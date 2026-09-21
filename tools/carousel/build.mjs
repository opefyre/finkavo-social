import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { buildPage, W, H, GRID, PAD } from "./page.mjs";
const specsFile = process.argv[2] || process.env.SPECS_FILE;
if (!specsFile) throw new Error("usage: node build.mjs specs/batch-2.mjs");
const { SPECS } = await import(path.resolve(specsFile));

const ROOT = process.env.ASSET_ROOT || path.resolve(import.meta.dirname, "../../branding/assets");
const OUT = process.env.OUT_DIR || path.join(import.meta.dirname, "out");

const dataUrl = async (file, mime) => `data:${mime};base64,${(await readFile(file)).toString("base64")}`;

async function loadAssets(photos) {
  const out = {
    logo: await dataUrl(path.join(ROOT, "finkavo-logo-512.png"), "image/png"),
    fraunces: await dataUrl(path.join(ROOT, "fonts/fraunces-normal-latin.woff2"), "font/woff2"),
    frauncesExt: await dataUrl(path.join(ROOT, "fonts/fraunces-normal-latin-ext.woff2"), "font/woff2"),
    noto: await dataUrl(path.join(ROOT, "fonts/noto-sans-normal-latin.woff2"), "font/woff2"),
    notoExt: await dataUrl(path.join(ROOT, "fonts/noto-sans-normal-latin-ext.woff2"), "font/woff2"),
    photos: {},
  };
  for (const name of photos) {
    out.photos[name] = await dataUrl(path.join(import.meta.dirname, `img/${name}.webp`), "image/webp");
  }
  return out;
}

async function renderOne(spec, assets, browser) {
  const dir = path.join(OUT, spec.id);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  const image = assets.photos[spec.photo];
  if (!image) throw new Error(`[${spec.id}] no image registered for "${spec.photo}"`);
  const withPhoto = { ...spec, photo: image };

  // Instagram rejects more than five hashtags. This has shipped wrong before.
  const tagCount = spec.caption.tags.length;
  if (tagCount > 5) throw new Error(`[${spec.id}] ${tagCount} hashtags; Instagram allows five`);
  if (!spec.caption.tags.every(t => /^#\S+$/.test(t))) throw new Error(`[${spec.id}] malformed hashtag`);

  const files = [];
  for (const [index, slide] of spec.slides.entries()) {
    const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    await page.setContent(buildPage(withPhoto, assets, slide, index), { waitUntil: "load" });
    await page.evaluate(async () => {
      await Promise.all([document.fonts.load('900 16px "Fraunces"'), document.fonts.load('900 16px "Noto Sans"')]);
      await document.fonts.ready;
    });

    // Two things are checked on every slide, because both have shipped broken before:
    // copy running outside the square the profile grid keeps, and a word split or
    // overflowing its measure.
    const faults = await page.evaluate(({ grid, pad, w }) => {
      const out = [];
      const stack = document.querySelector(".stack");
      if (stack) {
        const b = stack.getBoundingClientRect();
        if (b.top < grid.top) out.push(`copy starts above the grid crop (${Math.round(b.top)} < ${grid.top})`);
        if (b.bottom > grid.bottom) out.push(`copy runs past the grid crop (${Math.round(b.bottom)} > ${grid.bottom})`);
        if (b.left < pad - 1) out.push("copy breaks the left margin");
        if (b.right > w - pad + 1) out.push("copy breaks the right margin");
      }
      // Horizontal overflow is measured on the text itself: a line that does not fit its
      // measure really is cut off.
      for (const el of document.querySelectorAll(".hook, .lead, .sub, .figure, .rval, .action span")) {
        if (el.scrollWidth > el.clientWidth + 2) out.push(`"${el.textContent.slice(0, 28)}" overflows its measure`);
      }
      // Vertical clipping is measured on the containers that actually clip. Checking the
      // text element instead reports a false positive on every headline: at line-height
      // 1.03 the glyph ink stands about 8px proud of the line box, so scrollHeight
      // exceeds clientHeight on type that is not clipped at all — the panel's padding
      // absorbs it.
      for (const box of document.querySelectorAll(".panel, .figwrap, .row, .action, .chip")) {
        if (box.scrollHeight > box.clientHeight + 2) {
          out.push(`${box.className.split(" ")[0]} clips its content (${box.scrollHeight} > ${box.clientHeight})`);
        }
      }
      // Fraunces draws a 3 that reads as a 5. It has fooled me at 24px, 88px, 128px and
      // in a headline — it is the typeface, not the size. Data numerals already live in
      // the sans; the serif headline classes must simply not carry a 3.
      for (const el of document.querySelectorAll(".hook, .lead")) {
        if (/3/.test(el.textContent || "")) {
          out.push(`serif headline contains a 3, which reads as a 5: "${el.textContent.slice(0, 40)}"`);
        }
      }
      // Nothing in the footer may overlap anything else in it. The source chip does not
      // wrap and its text varies by topic, so this is checked rather than assumed.
      const furniture = [".cite", ".mark", ".pips", ".top"].map(sel => {
        const el = document.querySelector(sel);
        return el ? { sel, box: el.getBoundingClientRect() } : null;
      }).filter(Boolean);
      for (let i = 0; i < furniture.length; i++) {
        for (let j = i + 1; j < furniture.length; j++) {
          const a = furniture[i].box, c = furniture[j].box;
          if (a.left < c.right + 8 && a.right + 8 > c.left && a.top < c.bottom + 4 && a.bottom + 4 > c.top) {
            out.push(`${furniture[i].sel} overlaps ${furniture[j].sel}`);
          }
        }
      }
      // The logo must be wholly outside the grid crop or wholly inside it, never cut.
      const logo = document.querySelector(".top");
      if (logo) {
        const l = logo.getBoundingClientRect();
        if (l.top < grid.top && l.bottom > grid.top) out.push(`logo straddles the grid crop (${Math.round(l.top)}–${Math.round(l.bottom)})`);
      }
      return out.slice(0, 3);
    }, { grid: GRID, pad: PAD, w: W });
    if (faults.length) throw new Error(`[${spec.id}] slide ${index + 1}: ${faults.join("; ")}`);

    const file = path.join(dir, `${String(index + 1).padStart(2, "0")}.png`);
    await page.screenshot({ path: file, type: "png" });
    files.push(file);
    await page.close();
  }

  const c = spec.caption;
  await writeFile(path.join(OUT, `${spec.id}-caption.txt`),
    `${c.hook}\n\n${c.body}\n\n${c.cta}\n\n${c.tags.join(" ")}\n`);

  return { id: spec.id, slides: files.length, dir };
}

const specs = SPECS;
const assets = await loadAssets([...new Set(specs.map(s => s.photo))]);
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const spec of specs) {
    process.stdout.write(`building ${spec.id} ... `);
    const r = await renderOne(spec, assets, browser);
    console.log(`${r.slides} slides`);
    results.push(r);
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(results, null, 1));
