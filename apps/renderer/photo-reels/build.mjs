import { mkdir, readFile, writeFile, copyFile, rm } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { chromium } from "playwright";
import ffmpegStatic from "ffmpeg-static";
import { buildPage, SAFE, W, H } from "./page.mjs";
import { readdir } from "node:fs/promises";
import { sceneWords, WORDS_PER_SECOND } from "./reading.mjs";

const run = promisify(execFile);
const ffmpeg = ffmpegStatic;
const FPS = 30;
// The cover is the profile tile and the first thing in feed. It is held long enough to be
// the frame Instagram grabs, short enough not to read as a stall.
const COVER_SECONDS = 0.9;

const ROOT = process.env.ASSET_ROOT || path.resolve(import.meta.dirname, "../../../branding/assets");
const OUT = process.env.OUT_DIR || path.join(import.meta.dirname, "out");

async function dataUrl(file, mime) {
  return `data:${mime};base64,${(await readFile(file)).toString("base64")}`;
}

async function loadAssets() {
  // Every photo in img/, keyed by file name, so a new spec never needs an edit here.
  const photos = {};
  for (const f of await readdir(path.join(import.meta.dirname, "img"))) {
    if (f.endsWith(".webp")) photos[f.slice(0, -5)] = await dataUrl(path.join(import.meta.dirname, "img", f), "image/webp");
  }
  return {
    photos,
    logo: await dataUrl(path.join(ROOT, "finkavo-logo-512.png"), "image/png"),
    fraunces: await dataUrl(path.join(ROOT, "fonts/fraunces-normal-latin.woff2"), "font/woff2"),
    frauncesExt: await dataUrl(path.join(ROOT, "fonts/fraunces-normal-latin-ext.woff2"), "font/woff2"),
    noto: await dataUrl(path.join(ROOT, "fonts/noto-sans-normal-latin.woff2"), "font/woff2"),
    notoExt: await dataUrl(path.join(ROOT, "fonts/noto-sans-normal-latin-ext.woff2"), "font/woff2"),
  };
}

async function renderOne(spec, assets, browser) {
  const dir = path.join(OUT, spec.id, "frames");
  await rm(path.join(OUT, spec.id), { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  // spec.photo names the image; the page needs the data URL. Substituting it only onto the
  // scenes left the stage-level layer rendering url('aima') — an invalid URL, which a browser
  // drops in silence, so every frame came out as the bare ground with no picture and nothing
  // in the logs to say so.
  // Instagram rejects more than five hashtags. Shipped with seven before anyone said so.
  if (spec.caption.tags.length > 5) throw new Error(`[${spec.id}] ${spec.caption.tags.length} hashtags; Instagram allows five`);
  // Fraunces draws numerals badly (its 3 reads as a 5), so the serif classes carry none.
  for (const [i, sc] of spec.scenes.entries()) {
    const serif = sc.type === "figure" ? "" : sc.text;
    if (/\d/.test(serif || "")) throw new Error(`[${spec.id}] scene ${i + 1}: digits in the serif headline: "${serif}"`);
  }

  const image = assets.photos[spec.photo];
  if (spec.photo && !image) throw new Error(`[${spec.id}] no image registered for "${spec.photo}"`);
  const withPhotos = { ...spec, photo: image, scenes: spec.scenes.map(sc => sc.photo ? { ...sc, photo: image } : sc) };
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.setContent(buildPage(withPhotos, assets), { waitUntil: "load" });
  await page.evaluate((s) => { window.__SAFE = s; }, SAFE);
  await page.evaluate(async () => {
    await Promise.all([document.fonts.load('900 16px "Fraunces"'), document.fonts.load('900 16px "Noto Sans"')]);
    await document.fonts.ready;
  });

  const duration = await page.evaluate(() => window.__duration);

  // Layout is checked while each scene is settled, never mid-animation: a scene is
  // deliberately clipped on the way in and would report a false overflow if measured early.
  const holds = spec.holds.map(h => h * 1000);
  let elapsed = 0;
  for (let i = 0; i < holds.length; i++) {
    await page.evaluate(t => window.__seek(t), elapsed + holds[i] * 0.8);
    const faults = await page.evaluate(() => {
      const out = [];
      // Everything visible, against Instagram's reserved chrome. v2 shipped with
      // the logo, the source line and the progress bar all underneath it.
      const S = window.__SAFE;
      // Instagram's furniture is three boxes, not three edges. The action rail is a
      // column on the right that starts well below the header, so the top-right corner
      // above it is usable — which is where the brand mark now sits, out of the way of
      // the account name Instagram draws top left.
      const zones = [
        { name: "the top chrome", x0: 0, y0: 0, x1: 1080, y1: S.top },
        { name: "the caption block", x0: 0, y0: 1920 - S.bottom, x1: 1080, y1: 1920 },
        { name: "the action rail", x0: 1080 - S.right, y0: S.railTop, x1: 1080, y1: 1920 - S.bottom },
      ];
      document.querySelectorAll(".stack, .top, .mark, .cite, .bar").forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.height === 0 || b.width === 0) return;
        const name = el.className.split(" ")[0];
        for (const z of zones) {
          if (b.left < z.x1 && b.right > z.x0 && b.top < z.y1 && b.bottom > z.y0) {
            out.push(`${name} overlaps ${z.name} (${Math.round(b.left)},${Math.round(b.top)} to ${Math.round(b.right)},${Math.round(b.bottom)})`);
          }
        }
        if (b.left < S.left - 1) out.push(`${name} breaks the left margin`);
        if (b.right > 1080 - S.edge + 1) out.push(`${name} breaks the right margin`);
      });
        // A kicker is a one-line label. Wrapped, the chip's padding no longer fits two lines.
        document.querySelectorAll(".chip").forEach(chip => {
          const sc = chip.closest(".scene");
          if (Number(getComputedStyle(sc).opacity) < 0.5) return;
          const span = chip.querySelector("span");
          if (span.getClientRects().length > 1 || span.getBoundingClientRect().height > parseFloat(getComputedStyle(span).fontSize) * 1.8) {
            out.push(`kicker "${span.textContent}" wraps onto two lines`);
          }
        });
      // A word split across two lines reports more than one client rect.
      document.querySelectorAll(".w").forEach(w => {
        const r = w.getClientRects();
        if (r.length > 1) out.push(`"${w.textContent}" split across lines`);
        if (r.length === 1 && r[0].right > window.innerWidth - 80) out.push(`"${w.textContent}" overflows the measure`);
        // The panel clips, so a word wider than the panel is cut off silently. Only words
        // in the scene currently on screen are measured; hidden scenes still lay out.
        const panel = w.closest(".panel");
        const sc = w.closest(".scene");
        if (panel && r.length === 1 && Number(getComputedStyle(sc).opacity) > 0.5) {
          const pr = panel.getBoundingClientRect();
          if (r[0].right > pr.right - 16) out.push(`"${w.textContent}" runs past its panel`);
        }
      });
      return out.slice(0, 4);
    });
    if (faults.length) throw new Error(`[${spec.id}] scene ${i + 1}: ${faults.join("; ")}`);
    elapsed += holds[i];
  }

  // The defect that sank v2 was two scenes composited together. Eyeballing a
  // contact sheet cannot catch it — the overlap lasts a few frames. So sweep every
  // transition at frame resolution and assert only one scene is ever on screen.
  {
    const bad = await page.evaluate(async ({ holds }) => {
      const out = [];
      const scenes = [...document.querySelectorAll(".scene")];
      let edge = 0;
      for (let i = 0; i < holds.length - 1; i++) {
        edge += holds[i];
        for (let t = edge - 500; t <= edge + 500; t += 1000 / 30) {
          window.__seek(t);
          const lit = scenes
            .map((s, n) => [n, Number(getComputedStyle(s).opacity)])
            .filter(([, o]) => o > 0.06);
          if (lit.length > 1) {
            out.push(`t=${Math.round(t)}ms scenes ${lit.map(([n, o]) => `${n + 1}@${o.toFixed(2)}`).join(" + ")}`);
            break;
          }
        }
      }
      return out;
    }, { holds });
    if (bad.length) throw new Error(`[${spec.id}] scenes overlap: ${bad.join("; ")}`);
  }

  // Timing is a property to check, not a claim. Copy grows during editing and a hold
  // typed in beside it does not, so a scene that was comfortable becomes one that flashes
  // past. Every scene has to be readable at WORDS_PER_SECOND with its own words.
  {
    const rushed = spec.scenes
      .map((scene, i) => ({ i, words: sceneWords(scene), hold: spec.holds[i] }))
      .filter(s => s.words / s.hold > WORDS_PER_SECOND)
      .map(s => `scene ${s.i + 1}: ${s.words} words in ${s.hold}s is ${(s.words / s.hold).toFixed(2)}/s`);
    if (rushed.length) {
      throw new Error(`[${spec.id}] too fast to read (budget ${WORDS_PER_SECOND}/s): ${rushed.join("; ")}`);
    }
  }

  const files = [];
  const coverTicks = Math.round(COVER_SECONDS * FPS);
  // The cover is the hook already typeset, not the blank ground the animation starts on,
  // and with the sub held back so the tile carries one line rather than a paragraph.
  await page.evaluate(t => window.__seek(t), holds[0] * 0.78);
  await page.evaluate(() => document.body.classList.add("coverframe"));
  const cover = path.join(dir, "f-00000.png");
  await page.screenshot({ path: cover, type: "png" });
  await page.evaluate(() => document.body.classList.remove("coverframe"));
  files.push(cover);
  for (let i = 1; i < coverTicks; i++) {
    const f = path.join(dir, `f-${String(i).padStart(5, "0")}.png`);
    await copyFile(cover, f);
    files.push(f);
  }

  const ticks = Math.round((duration / 1000) * FPS);
  for (let t = 0; t < ticks; t++) {
    await page.evaluate(ms => window.__seek(ms), (t / FPS) * 1000);
    const f = path.join(dir, `f-${String(coverTicks + t).padStart(5, "0")}.png`);
    await page.screenshot({ path: f, type: "png" });
    files.push(f);
  }
  await page.close();

  const seconds = files.length / FPS;
  const mp4 = path.join(OUT, `${spec.id}.mp4`);
  const music = path.join(ROOT, "audio/music", spec.music);

  const args = [
    "-y", "-framerate", String(FPS), "-i", path.join(dir, "f-%05d.png"),
    "-stream_loop", "-1", "-i", music,
    "-filter_complex",
    // loudnorm emits 192kHz. Handed to the muxer at that rate the audio track came
    // out at 9.96s against 18.3s of video — the bed simply stopped half way, which
    // is the "music cuts off in the middle" defect. aformat pins the rate back to
    // 44.1k stereo before the encoder ever sees it.
    `[1:a]atrim=0:${seconds.toFixed(3)},asetpts=N/SR/TB,loudnorm=I=-16:TP=-1.5:LRA=11,` +
    `aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,` +
    `afade=t=in:st=0:d=0.6,afade=t=out:st=${(seconds - 1.4).toFixed(3)}:d=1.4[a]`,
    "-map", "0:v", "-map", "[a]",
    "-c:v", "libx264", "-profile:v", "high", "-crf", "18", "-pix_fmt", "yuv420p",
    "-r", String(FPS), "-t", seconds.toFixed(3),
    "-c:a", "aac", "-b:a", "160k", "-ar", "44100",
    "-movflags", "+faststart", mp4,
  ];
  await run(ffmpeg, args, { maxBuffer: 1 << 26 });

  // Decode the muxed audio and compare it against the picture. A bed that stops
  // early is invisible in every frame-based check and has shipped twice.
  const probe = await run(ffmpeg, ["-i", mp4, "-map", "0:a", "-f", "null", "-"], { maxBuffer: 1 << 26 })
    .catch((e) => e);
  const stamps = [...String(probe.stderr ?? "").matchAll(/time=(\d+):(\d+):([\d.]+)/g)];
  const audioSeconds = stamps.length
    ? Number(stamps.at(-1)[1]) * 3600 + Number(stamps.at(-1)[2]) * 60 + parseFloat(stamps.at(-1)[3])
    : 0;
  if (Math.abs(audioSeconds - seconds) > 0.3) {
    throw new Error(`[${spec.id}] audio is ${audioSeconds.toFixed(2)}s against ${seconds.toFixed(2)}s of video`);
  }

  const coverOut = path.join(OUT, `${spec.id}-cover.png`);
  await copyFile(cover, coverOut);
  await writeFile(path.join(OUT, `${spec.id}-caption.txt`),
    `${spec.caption.hook}\n\n${spec.caption.body}\n\n${spec.caption.cta}\n\n${spec.caption.tags.join(" ")}\n`);

  // The frames exist only to be encoded. Five reels' worth is several gigabytes, so
  // they go as soon as the mp4 and the cover are safely written.
  await rm(dir, { recursive: true, force: true });

  return { id: spec.id, mp4, cover: coverOut, seconds: Number(seconds.toFixed(2)), frames: files.length };
}

const assets = await loadAssets();
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  const files = (process.env.REEL_SPECS || "").split(",").filter(Boolean);
  if (!files.length) throw new Error("set REEL_SPECS to a comma-separated list of spec files");
  const specs = [];
  for (const f of files) specs.push((await import(`./specs/${f}`)).buildSpec());
  for (const spec of specs) {
    process.stdout.write(`building ${spec.id} ... `);
    const r = await renderOne(spec, assets, browser);
    console.log(`${r.seconds}s, ${r.frames} frames -> ${path.basename(r.mp4)}`);
    results.push(r);
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(results, null, 1));
