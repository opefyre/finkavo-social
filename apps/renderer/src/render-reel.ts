import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import type { ReelManifest } from "./reel-schema.js";
import { renderReelFrame, REEL_HEIGHT, REEL_WIDTH } from "./reel-template.js";

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
