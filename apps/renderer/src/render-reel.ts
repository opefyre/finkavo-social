import { mkdir, readFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import type { ReelManifest } from "./reel-schema.js";
import { renderReelFrame, REEL_HEIGHT, REEL_WIDTH } from "./reel-template.js";
import { renderReelMotion } from "./reel-motion.js";

async function loadAssets() {
  const assetRoot = path.resolve(process.env.RENDER_ASSET_ROOT || "branding/assets");
  const [logo, frauncesLatin, frauncesLatinExt, notoLatin, notoLatinExt] = await Promise.all([
    readFile(path.join(assetRoot, "finkavo-logo-512.png")),
    readFile(path.join(assetRoot, "fonts/fraunces-normal-latin.woff2")),
    readFile(path.join(assetRoot, "fonts/fraunces-normal-latin-ext.woff2")),
    readFile(path.join(assetRoot, "fonts/noto-sans-normal-latin.woff2")),
    readFile(path.join(assetRoot, "fonts/noto-sans-normal-latin-ext.woff2")),
  ]);
  return {
    logoDataUrl: `data:image/png;base64,${logo.toString("base64")}`,
    frauncesLatinDataUrl: `data:font/woff2;base64,${frauncesLatin.toString("base64")}`,
    frauncesLatinExtDataUrl: `data:font/woff2;base64,${frauncesLatinExt.toString("base64")}`,
    notoLatinDataUrl: `data:font/woff2;base64,${notoLatin.toString("base64")}`,
    notoLatinExtDataUrl: `data:font/woff2;base64,${notoLatinExt.toString("base64")}`,
  };
}

/**
 * Renders one PNG per frame. Overflow is fatal rather than cropped: a carousel slide
 * that runs long is a reader's inconvenience, but a Reel frame whose last line is cut
 * off is unreadable at the speed it goes past, and nobody scrolls back.
 */
export async function renderReel(manifest: ReelManifest, root: string): Promise<string[]> {
  const directory = path.resolve(root);
  await mkdir(directory, { recursive: true });
  const assets = await loadAssets();
  const browser = await chromium.launch({ headless: true });
  try {
    const outputs: string[] = [];
    for (let index = 0; index < manifest.frames.length; index++) {
      const page = await browser.newPage({ viewport: { width: REEL_WIDTH, height: REEL_HEIGHT }, deviceScaleFactor: 1 });
      try {
        await page.setContent(renderReelFrame(manifest, index, assets), { waitUntil: "load" });
        await page.evaluate(async () => {
          await Promise.all([document.fonts.load('900 16px "Fraunces"'), document.fonts.load('900 16px "Noto Sans"')]);
          await document.fonts.ready;
        });
        const overflow = await page.evaluate(() => {
          const copy = document.querySelector(".copy")?.getBoundingClientRect();
          const bar = document.querySelector(".bar")?.getBoundingClientRect();
          const clipped = [...document.querySelectorAll(".copy *")].some(node => {
            const rect = node.getBoundingClientRect();
            return rect.left < 0 || rect.right > window.innerWidth || rect.top < 0 || rect.bottom > window.innerHeight;
          });
          return {
            clipped,
            // Copy must not run under the progress bar, which sits above Instagram's own
            // caption row; if it does, the frame is too full for the format.
            collides: Boolean(copy && bar && copy.bottom > bar.top),
            scroll: document.documentElement.scrollHeight > window.innerHeight,
          };
        });
        if (overflow.clipped || overflow.collides || overflow.scroll) {
          throw new Error(`Reel frame ${index + 1} does not fit: ${JSON.stringify(overflow)}`);
        }
        const file = path.join(directory, `frame-${String(index + 1).padStart(2, "0")}.png`);
        await page.screenshot({ path: file, type: "png" });
        outputs.push(file);
      } finally {
        await page.close();
      }
    }
    return outputs;
  } finally {
    await browser.close();
  }
}


/** Frames per second of the captured sequence. Thirty is what Instagram plays back at. */
export const MOTION_FPS = 30;
// How long the still cover is held before the reel animates. Long enough to be the frame
// Instagram grabs for the grid, short enough not to read as a stall on the way in.
const COVER_SECONDS = Number(process.env.REEL_COVER_SECONDS ?? 0.8);

/**
 * Photographs the animated reel one tick at a time.
 *
 * The page holds the whole reel and exposes `__seek(ms)`, which puts every animation at
 * exactly that moment and pauses it. Stepping the clock ourselves rather than recording
 * in real time is what makes this reproducible: no dropped frames, no dependence on how
 * fast the machine happens to be, and the same millisecond always yields the same pixel.
 */
export async function renderReelMotionFrames(manifest: ReelManifest, root: string): Promise<{ files: string[]; fps: number; durationMs: number }> {
  const directory = path.resolve(root, "motion");
  await mkdir(directory, { recursive: true });
  const assets = await loadAssets();
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: REEL_WIDTH, height: REEL_HEIGHT }, deviceScaleFactor: 1 });
    await page.setContent(renderReelMotion(manifest, assets), { waitUntil: "load" });
    await page.evaluate(async () => {
      await Promise.all([document.fonts.load('900 16px "Fraunces"'), document.fonts.load('900 16px "Noto Sans"')]);
      await document.fonts.ready;
    });

    const durationMs = await page.evaluate(() => (window as unknown as { __duration: number }).__duration);

    // Overflow is checked at the moment each scene is fully revealed, because a scene is
    // deliberately clipped while it animates in and would report a false positive earlier.
    const holdMs = durationMs / manifest.frames.length;
    for (let index = 0; index < manifest.frames.length; index++) {
      await page.evaluate(t => (window as unknown as { __seek: (ms: number) => void }).__seek(t), index * holdMs + holdMs * 0.75);
      // Measured as a box against the band between the logo and the progress bar. An
      // earlier version compared scrollHeight with clientHeight and failed everything:
      // the word spans rest on a translate that pushes them out of the scroll box while
      // they are still animating in, so every scene looked overflowing and none was.
      const overflow = await page.evaluate(() => {
        const HEADER_BOTTOM = 200;
        const BAR_TOP = 1740;
        return [...document.querySelectorAll<HTMLElement>(".scene")].some(scene => {
          const box = scene.getBoundingClientRect();
          return box.height > 0 && (box.bottom > BAR_TOP || box.top < HEADER_BOTTOM);
        });
      });
      if (overflow) throw new Error(`Reel frame ${index + 1} runs outside the safe band between the logo and the progress bar; shorten the copy`);

      // A word laid out across two lines is a rendering fault, not a copy problem, and it
      // is invisible in the markup — it only exists once the browser has done the line
      // breaking. A span that wraps reports more than one client rect, which is a
      // reliable way to catch it from outside.
      const split = await page.evaluate(() => {
        const stage = document.querySelector(".scenes")!.getBoundingClientRect();
        const faults: string[] = [];
        for (const span of document.querySelectorAll<HTMLElement>(".w, .c")) {
          const rects = span.getClientRects();
          if (!rects.length) continue;
          // Two rects means the browser broke the word over a line end.
          if (rects.length > 1) { faults.push(`${span.textContent} (split)`); continue; }
          // With nowrap it cannot split, so a word too long for the measure runs off the
          // edge instead — same defect, different symptom, and the one the first version
          // of this check walked straight past.
          if (rects[0]!.right > stage.right + 1) faults.push(`${span.textContent} (overflows)`);
        }
        return faults.slice(0, 3);
      });
      if (split.length) throw new Error(`Reel frame ${index + 1} cannot set ${split.join(", ")} within the measure`);
    }

    const files: string[] = [];

    // Instagram takes a Reel's grid thumbnail from its first frame, and the first frame of
    // the animation is deliberately empty — every revealed unit starts hidden, so t=0 is
    // the bare background. On the profile that rendered as a blank dark tile next to
    // carousels showing their titles, which is the worst possible advertisement for a post
    // whose whole argument is that it says something worth stopping for.
    //
    // A custom thumbnail is not an option: Instagram refuses one for video, which is what
    // the earlier thumbnailUrl attempt ran into. So the cover is made part of the video —
    // the hook, held still and fully typed, before the animation runs. It is captured at
    // the same three-quarter point through the hold that the still renderer uses for its
    // frames, which is after the typing finishes and before the exit begins.
    const coverTicks = Math.max(0, Math.round(COVER_SECONDS * MOTION_FPS));
    if (coverTicks > 0) {
      await page.evaluate(t => (window as unknown as { __seek: (ms: number) => void }).__seek(t), holdMs * 0.75);
      const cover = path.join(directory, `t-${String(0).padStart(5, "0")}.png`);
      await page.screenshot({ path: cover, type: "png" });
      files.push(cover);
      // Copied rather than re-screenshotted: it is the same still, and a screenshot costs
      // far more than a file copy at thirty of them a second.
      for (let tick = 1; tick < coverTicks; tick++) {
        const file = path.join(directory, `t-${String(tick).padStart(5, "0")}.png`);
        await copyFile(cover, file);
        files.push(file);
      }
    }

    const totalTicks = Math.round((durationMs / 1000) * MOTION_FPS);
    for (let tick = 0; tick < totalTicks; tick++) {
      await page.evaluate(t => (window as unknown as { __seek: (ms: number) => void }).__seek(t), (tick / MOTION_FPS) * 1000);
      const file = path.join(directory, `t-${String(coverTicks + tick).padStart(5, "0")}.png`);
      await page.screenshot({ path: file, type: "png" });
      files.push(file);
    }
    await page.close();
    return { files, fps: MOTION_FPS, durationMs: durationMs + coverTicks * (1000 / MOTION_FPS) };
  } finally {
    await browser.close();
  }
}
