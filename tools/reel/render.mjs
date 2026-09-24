// render.mjs — node render.mjs reels/<id>.reel.mjs [--stills 0,2.5,...] [--sheet] [--check] [--workers 4] [--force]
// Playwright draws every frame from time alone; ffmpeg encodes; audio.py synthesises the sound.
import { chromium } from "playwright";
import ffmpegStatic from "ffmpeg-static";
import { readFile, writeFile, mkdir, rm, readdir } from "node:fs/promises";
import { spawn, execFileSync } from "node:child_process";
import path from "node:path";
import { existsSync } from "node:fs";

const HERE = import.meta.dirname;
const ASSETS = process.env.ASSET_ROOT || path.resolve(HERE, "../../branding/assets");
const FFMPEG = process.env.FFMPEG || ffmpegStatic;
// numpy lives in a venv next to this file (see GUIDE); PYTHON overrides it.
const VENV_PY = path.join(HERE, ".venv/bin/python");
const PY = process.env.PYTHON || (existsSync(VENV_PY) ? VENV_PY : "python3");
const FPS = 30;

const args = process.argv.slice(2);
const reelPath = path.resolve(args[0]);
const flag = (n, d = null) => { const i = args.indexOf(n); return i < 0 ? d : (args[i + 1] ?? true); };
const stills = flag("--stills"), checkOnly = args.includes("--check"), WORKERS = +(flag("--workers", 4));

const mod = await import(reelPath);
const meta = mod.meta;
const reelSrc = mod.default.toString();
const out = path.join(HERE, "out", meta.id);
await mkdir(out, { recursive: true });

const b64 = async (f, mime) => `data:${mime};base64,${(await readFile(path.join(ASSETS, f))).toString("base64")}`;
const fonts = {
  fr: await b64("fonts/fraunces-normal-latin.woff2", "font/woff2"), frx: await b64("fonts/fraunces-normal-latin-ext.woff2", "font/woff2"),
  no: await b64("fonts/noto-sans-normal-latin.woff2", "font/woff2"), nox: await b64("fonts/noto-sans-normal-latin-ext.woff2", "font/woff2"),
};
const logo = await b64("finkavo-logo-512.png", "image/png");
// meta.images = { name: "characters/cutouts/x.png" } (paths under branding/) become data URIs the reel can draw with E.img
const BRANDING = path.resolve(HERE, "../../branding");
const images = {};
for (const [k, f] of Object.entries(meta.images || {})) images[k] = `data:image/${f.endsWith(".webp") ? "webp" : "png"};base64,${(await readFile(path.join(BRANDING, f))).toString("base64")}`;
const engineSrc = await readFile(path.join(HERE, "engine.js"), "utf8");
const iconsSrc = (await readFile(path.join(HERE, "icons.js"), "utf8")) + "\n" + (await readFile(path.join(HERE, "std.js"), "utf8"));
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Fraunces";font-weight:300 900;src:url("${fonts.frx}") format("woff2")}
@font-face{font-family:"Fraunces";font-weight:300 900;src:url("${fonts.fr}") format("woff2")}
@font-face{font-family:"Noto Sans";font-weight:400 900;src:url("${fonts.nox}") format("woff2")}
@font-face{font-family:"Noto Sans";font-weight:400 900;src:url("${fonts.no}") format("woff2")}
</style></head><body></body></html>`;

async function open(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on("pageerror", e => { console.error("PAGE ERROR", e.message); process.exitCode = 2; });
  await page.setContent(html);
  await page.addScriptTag({ content: engineSrc });
  await page.addScriptTag({ content: iconsSrc });
  await page.evaluate(async () => { await Promise.all([document.fonts.load('900 40px "Noto Sans"'), document.fonts.load('800 40px "Noto Sans"'), document.fonts.load('900 40px "Fraunces"')]); await document.fonts.ready; });
  await page.evaluate(`(async()=>{ E.init({logo:${JSON.stringify(logo)},images:${JSON.stringify(images)}}); (${reelSrc})(E); })()`);
  return page;
}

const browser = await chromium.launch();
const page = await open(browser);
const problems = await page.evaluate(() => E.check());
const first = await page.evaluate(() => E.texts.filter(h => h.scene.i === 0 && h.tIn === 0 && h.words >= 3).length);
if (!first) problems.push("FRAME0 the hook is not fully visible on frame 0");
const p0 = await (async () => { await page.evaluate(() => E.render(0)); return page.screenshot({ type: "png" }); })();
const p1 = await (async () => { await page.evaluate(() => E.render(0.5)); return page.screenshot({ type: "png" }); })();
if (Buffer.compare(p0, p1) === 0) problems.push("FRAME0 nothing moves in the first half second");
const m = await page.evaluate(() => E.meta());
await writeFile(path.join(out, "meta.json"), JSON.stringify({ ...m, id: meta.id }, null, 1));
console.log(`${meta.id}: ${m.dur}s, ${m.sounds.length} sounds, ${problems.length} problem(s)`);
for (const p of problems) console.log("  ✗", p);
if (problems.length && !args.includes("--force")) { await browser.close(); process.exit(1); }
if (checkOnly) { await browser.close(); process.exit(0); }

if (stills) {
  const sd = path.join(out, "stills");
  await rm(sd, { recursive: true, force: true }); await mkdir(sd, { recursive: true });
  const times = String(stills).split(",");
  for (const s of times) {
    await page.evaluate(t => E.render(t), +s);
    await page.screenshot({ path: path.join(sd, `still-${(+s).toFixed(1).padStart(5, "0")}.png`), type: "png" });
  }
  await browser.close();
  if (args.includes("--sheet")) {
    // one contact sheet of every still, side by side, so a whole reel can be read at a glance
    await new Promise((res, rej) => spawn(FFMPEG, ["-y", "-loglevel", "error", "-pattern_type", "glob", "-i", path.join(sd, "still-*.png"),
      "-vf", `scale=240:-1,tile=${times.length}x1:padding=5:color=gray`, "-frames:v", "1", path.join(out, "sheet.png")], { stdio: "inherit" }).on("close", c => (c ? rej(new Error("sheet failed")) : res())));
    console.log("sheet →", path.join(out, "sheet.png"));
  }
  console.log("stills →", sd); process.exit(0);
}

// ---------- frames ----------
const total = Math.round(m.dur * FPS);
const frames = path.join(out, "frames");
await rm(frames, { recursive: true, force: true }); await mkdir(frames, { recursive: true });
const t0 = Date.now();
await browser.close();
await Promise.all(Array.from({ length: WORKERS }, async (_, k) => {
  const b = await chromium.launch(); const pg = await open(b);
  for (let f = k; f < total; f += WORKERS) {
    await pg.evaluate(t => E.render(t), f / FPS);
    await pg.screenshot({ path: path.join(frames, `f-${String(f).padStart(5, "0")}.png`), type: "png" });
  }
  await b.close();
}));
console.log(`frames: ${total} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);

// ---------- sound ----------
execFileSync(PY, [path.join(HERE, "audio.py"), path.join(out, "meta.json"), out], { stdio: "inherit" });

// ---------- encode ----------
const run = (cmd, a) => new Promise((res, rej) => { const p = spawn(cmd, a, { stdio: ["ignore", "ignore", "pipe"] }); let err = ""; p.stderr.on("data", d => (err += d)); p.on("close", c => (c ? rej(new Error(err.slice(-800))) : res(err))); });
const D = m.dur.toFixed(3);
// loudnorm emits 192kHz; aformat pins it back to 44.1kHz or the muxer halves the track (see memory: reel-audio-loudnorm-192k).
const enc = (wav, lufs, file) => run(FFMPEG, ["-y", "-framerate", String(FPS), "-i", path.join(frames, "f-%05d.png"), "-i", path.join(out, wav),
  "-filter_complex", `[1:a]atrim=0:${D},asetpts=N/SR/TB,loudnorm=I=${lufs}:TP=-1.5:LRA=11,aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,apad,atrim=0:${D}[a]`,
  "-map", "0:v", "-map", "[a]", "-c:v", "libx264", "-profile:v", "high", "-crf", "18", "-pix_fmt", "yuv420p", "-r", String(FPS),
  "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-t", D, path.join(out, file)]);
await enc("mix.wav", -14, "reel.mp4");
await enc("sfx.wav", m.sfxLufs || -20, "reel-sfx-only.mp4");
// audio duration must match the video: decode the audio stream and read its length
for (const f of ["reel.mp4", "reel-sfx-only.mp4"]) {
  const log = await run(FFMPEG, ["-i", path.join(out, f), "-map", "0:a", "-f", "null", "-"]);
  const t = [...log.matchAll(/time=(\d+):(\d+):([\d.]+)/g)].pop();
  const sec = t ? +t[1] * 3600 + +t[2] * 60 + +t[3] : 0;
  console.log(`${f}: audio ${sec.toFixed(2)}s vs video ${D}s`);
  if (Math.abs(sec - m.dur) > 0.1) { console.error("AUDIO LENGTH MISMATCH"); process.exit(3); }
}
await rm(frames, { recursive: true, force: true });
console.log("done →", path.join(out, "reel.mp4"));
