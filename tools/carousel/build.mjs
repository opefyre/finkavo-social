// node build.mjs specs/<file>.mjs [--sheet]     DESIGN=v2 node build.mjs specs/batch-3.mjs   (preview an old spec in the new look)
//
// Two designs share this builder. v1 (photo + glass + serif) made batches 1–3 and is kept so those specs still build exactly
// as before. v2 (flat, drawn in code, the reels' language) is the design for new batches. A spec file picks its design with
// `export const DESIGN = "v2"`; a single spec can override with `design: "v2"`; the DESIGN env var overrides both (for previews).
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import ffmpegStatic from "ffmpeg-static";
import * as PAGE1 from "./page.mjs";
import * as PAGE2 from "./v2/page.mjs";

const args = process.argv.slice(2);
const specsFile = args.find(a => !a.startsWith("--")) || process.env.SPECS_FILE;
if (!specsFile) throw new Error("usage: node build.mjs specs/batch-4.mjs [--sheet]");
const SHEET = args.includes("--sheet");
const { SPECS, DESIGN: FILE_DESIGN } = await import(path.resolve(specsFile));

const ROOT = process.env.ASSET_ROOT || path.resolve(import.meta.dirname, "../../branding/assets");
const OUT = process.env.OUT_DIR || path.join(import.meta.dirname, "out");
const dataUrl = async (file, mime) => `data:${mime};base64,${(await readFile(file)).toString("base64")}`;

// v1 measured these class names inline; they are data now, so each design declares what to measure.
const CHECK1 = {
  stack: ".stack",
  overflow: ".hook, .lead, .sub, .figure, .rval, .action span",
  clip: ".panel, .figwrap, .row, .action, .chip",
  furniture: [".cite", ".mark", ".pips", ".top"],
  logo: ".top",
  serifThree: true,
};
const DESIGNS = {
  v1: { page: PAGE1, check: CHECK1 },
  v2: { page: PAGE2, check: PAGE2.CHECK },
};

async function loadAssets(specs) {
  const out = {
    logo: await dataUrl(path.join(ROOT, "finkavo-logo-512.png"), "image/png"),
    fraunces: await dataUrl(path.join(ROOT, "fonts/fraunces-normal-latin.woff2"), "font/woff2"),
    frauncesExt: await dataUrl(path.join(ROOT, "fonts/fraunces-normal-latin-ext.woff2"), "font/woff2"),
    noto: await dataUrl(path.join(ROOT, "fonts/noto-sans-normal-latin.woff2"), "font/woff2"),
    notoExt: await dataUrl(path.join(ROOT, "fonts/noto-sans-normal-latin-ext.woff2"), "font/woff2"),
    photos: {}, icons: {},
  };
  for (const name of new Set(specs.map(s => s.photo).filter(Boolean))) {
    out.photos[name] = await dataUrl(path.join(import.meta.dirname, `img/${name}.webp`), "image/webp");
  }
  // The icon set is the reels' (tools/reel/icons.js, SVG strings). Evaluate it once here rather than keep a second copy.
  const src = await readFile(path.join(import.meta.dirname, "../reel/icons.js"), "utf8");
  const E = { C: PAGE2.C };
  new Function("E", src)(E);
  out.icons = Object.fromEntries(Object.entries(E.icons).map(([k, fn]) => [k, size => fn(size)]));
  return out;
}

const designOf = spec => process.env.DESIGN || spec.design || FILE_DESIGN || "v1";

async function renderOne(spec, assets, browser) {
  const dir = path.join(OUT, spec.id);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  const design = designOf(spec);
  if (!DESIGNS[design]) throw new Error(`[${spec.id}] unknown design "${design}"`);
  const { page: P, check } = DESIGNS[design];

  let withPhoto = spec;
  if (design === "v1") {
    const image = assets.photos[spec.photo];
    if (!image) throw new Error(`[${spec.id}] no image registered for "${spec.photo}"`);
    withPhoto = { ...spec, photo: image };
  }

  // Instagram rejects more than five hashtags. This has shipped wrong before.
  const tagCount = spec.caption.tags.length;
  if (tagCount > 5) throw new Error(`[${spec.id}] ${tagCount} hashtags; Instagram allows five`);
  if (!spec.caption.tags.every(t => /^#\S+$/.test(t))) throw new Error(`[${spec.id}] malformed hashtag`);

  const files = [];
  for (const [index, slide] of spec.slides.entries()) {
    const page = await browser.newPage({ viewport: { width: P.W, height: P.H }, deviceScaleFactor: 1 });
    await page.setContent(P.buildPage(withPhoto, assets, slide, index), { waitUntil: "load" });
    await page.evaluate(async () => {
      await Promise.all([document.fonts.load('900 16px "Fraunces"'), document.fonts.load('900 16px "Noto Sans"')]);
      await document.fonts.ready;
    });

    // Both designs are checked for the things that have shipped broken before: copy running outside the square the profile
    // grid keeps, a word overflowing its measure, a box clipping its content, furniture overlapping furniture.
    const faults = await page.evaluate(({ grid, pad, w, cfg }) => {
      const out = [];
      const stack = document.querySelector(cfg.stack);
      if (stack) {
        const b = stack.getBoundingClientRect();
        if (b.top < grid.top) out.push(`copy starts above the grid crop (${Math.round(b.top)} < ${grid.top})`);
        if (b.bottom > grid.bottom) out.push(`copy runs past the grid crop (${Math.round(b.bottom)} > ${grid.bottom})`);
        if (b.left < pad - 1) out.push("copy breaks the left margin");
        if (b.right > w - pad + 1) out.push("copy breaks the right margin");
        // v2 centres its content inside a fixed box, so "inside the box" proves nothing: measure the content itself.
        for (const kid of stack.children) {
          const k = kid.getBoundingClientRect();
          if (k.top < grid.top - 1 || k.bottom > grid.bottom + 1) out.push(`"${(kid.textContent || kid.className).trim().slice(0, 24)}" leaves the grid crop (${Math.round(k.top)}–${Math.round(k.bottom)})`);
        }
        if (stack.scrollHeight > stack.clientHeight + 2) out.push(`content taller than its box (${stack.scrollHeight} > ${stack.clientHeight})`);
      }
      for (const el of document.querySelectorAll(cfg.overflow)) {
        if (el.scrollWidth > el.clientWidth + 2) out.push(`"${el.textContent.slice(0, 28)}" overflows its measure`);
      }
      for (const box of document.querySelectorAll(cfg.clip)) {
        if (box.scrollHeight > box.clientHeight + 2) out.push(`${box.className.split(" ")[0]} clips its content (${box.scrollHeight} > ${box.clientHeight})`);
      }
      if (cfg.serifThree) {
        // Fraunces draws a 3 that reads as a 5. It is the typeface, not the size.
        for (const el of document.querySelectorAll(".hook, .lead")) {
          if (/3/.test(el.textContent || "")) out.push(`serif headline contains a 3, which reads as a 5: "${el.textContent.slice(0, 40)}"`);
        }
      }
      const furniture = cfg.furniture.map(sel => { const el = document.querySelector(sel); return el ? { sel, box: el.getBoundingClientRect() } : null; }).filter(Boolean);
      for (let i = 0; i < furniture.length; i++) {
        for (let j = i + 1; j < furniture.length; j++) {
          const a = furniture[i].box, c = furniture[j].box;
          if (a.left < c.right + 8 && a.right + 8 > c.left && a.top < c.bottom + 4 && a.bottom + 4 > c.top) out.push(`${furniture[i].sel} overlaps ${furniture[j].sel}`);
        }
      }
      // The logo must be wholly outside the grid crop or wholly inside it, never cut.
      const logo = document.querySelector(cfg.logo);
      if (logo) {
        const l = logo.getBoundingClientRect();
        if (l.top < grid.top && l.bottom > grid.top) out.push(`logo straddles the grid crop (${Math.round(l.top)}–${Math.round(l.bottom)})`);
      }
      return out.slice(0, 3);
    }, { grid: P.GRID, pad: P.PAD, w: P.W, cfg: check });
    if (faults.length) throw new Error(`[${spec.id}] slide ${index + 1} (${design}): ${faults.join("; ")}`);

    const file = path.join(dir, `${String(index + 1).padStart(2, "0")}.png`);
    await page.screenshot({ path: file, type: "png" });
    files.push(file);
    await page.close();
  }

  const c = spec.caption;
  await writeFile(path.join(OUT, `${spec.id}-caption.txt`),
    `${c.hook}\n\n${c.body}\n\n${c.cta}\n\n${c.tags.join(" ")}\n`);

  if (SHEET) {
    // one strip of every slide, so a whole carousel can be read at a glance
    await new Promise((res, rej) => spawn(ffmpegStatic, ["-y", "-loglevel", "error", "-pattern_type", "glob", "-i", path.join(dir, "*.png"),
      "-vf", `scale=260:-1,tile=${files.length}x1:padding=6:color=gray`, "-frames:v", "1", path.join(OUT, `${spec.id}-sheet.png`)], { stdio: "inherit" })
      .on("close", c => (c ? rej(new Error("sheet failed")) : res())));
  }
  return { id: spec.id, design, slides: files.length, dir };
}

const specs = SPECS;
const assets = await loadAssets(specs);
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const spec of specs) {
    process.stdout.write(`building ${spec.id} ... `);
    const r = await renderOne(spec, assets, browser);
    console.log(`${r.slides} slides (${r.design})`);
    results.push(r);
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(results, null, 1));
