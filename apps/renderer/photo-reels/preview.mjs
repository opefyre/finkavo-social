// Settled stills of every scene for the specs in REEL_SPECS, with the same layout checks
// the build runs, so copy can be reviewed before spending the render time.
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { buildPage, SAFE, W, H } from "./page.mjs";
const ROOT = path.resolve(import.meta.dirname, "../../../branding/assets");
const OUT = path.join(import.meta.dirname, "out/preview");
const KIT = import.meta.dirname;
const d = async (f, m) => `data:${m};base64,${(await readFile(f)).toString("base64")}`;
const assets = {
  logo: await d(path.join(ROOT, "finkavo-logo-512.png"), "image/png"),
  fraunces: await d(path.join(ROOT, "fonts/fraunces-normal-latin.woff2"), "font/woff2"),
  frauncesExt: await d(path.join(ROOT, "fonts/fraunces-normal-latin-ext.woff2"), "font/woff2"),
  noto: await d(path.join(ROOT, "fonts/noto-sans-normal-latin.woff2"), "font/woff2"),
  notoExt: await d(path.join(ROOT, "fonts/noto-sans-normal-latin-ext.woff2"), "font/woff2"),
};
const b = await chromium.launch({ headless: true });
await mkdir(OUT, { recursive: true });
for (const file of process.env.REEL_SPECS.split(",")) {
  const spec = (await import(`./specs/${file}`)).buildSpec();
  spec.photo = await d(path.join(KIT, `img/${spec.photo}.webp`), "image/webp");
  const page = await b.newPage({ viewport: { width: W, height: H } });
  await page.setContent(buildPage(spec, assets), { waitUntil: "load" });
  await page.evaluate(async () => { await document.fonts.load('900 16px "Fraunces"'); await document.fonts.ready; });
  let t = 0; const faults = [];
  for (let i = 0; i < spec.holds.length; i++) {
    await page.evaluate(ms => window.__seek(ms), t + spec.holds[i] * 1000 * 0.8);
    const f = await page.evaluate((S) => {
      const out = [];
      const zones = [
        { name: "top chrome", x0: 0, y0: 0, x1: 1080, y1: S.top },
        { name: "caption block", x0: 0, y0: 1920 - S.bottom, x1: 1080, y1: 1920 },
        { name: "action rail", x0: 1080 - S.right, y0: S.railTop, x1: 1080, y1: 1920 - S.bottom },
      ];
      for (const el of document.querySelectorAll(".scene:not([style*='opacity: 0']) .stack, .top, .mark, .cite, .bar")) {
        const sc = el.closest(".scene"); if (sc && Number(getComputedStyle(sc).opacity) < 0.5) continue;
        const r = el.getBoundingClientRect(); if (!r.width) continue;
        for (const z of zones) if (r.left < z.x1 && r.right > z.x0 && r.top < z.y1 && r.bottom > z.y0) out.push(`${el.className.split(" ")[0]} overlaps ${z.name}`);
      }
      for (const w of document.querySelectorAll(".w")) {
        const sc = w.closest(".scene"); if (Number(getComputedStyle(sc).opacity) < 0.5) continue;
        const r = w.getClientRects(); if (r.length > 1) out.push(`"${w.textContent}" split`);
        const p = w.closest(".panel"); if (p && r.length === 1 && r[0].right > p.getBoundingClientRect().right - 16) out.push(`"${w.textContent}" past panel`);
      }
        // A kicker is a one-line label. Wrapped, the chip's padding no longer fits two lines.
        document.querySelectorAll(".chip").forEach(chip => {
          const sc = chip.closest(".scene");
          if (Number(getComputedStyle(sc).opacity) < 0.5) return;
          const span = chip.querySelector("span");
          if (span.getClientRects().length > 1 || span.getBoundingClientRect().height > parseFloat(getComputedStyle(span).fontSize) * 1.8) {
            out.push(`kicker "${span.textContent}" wraps onto two lines`);
          }
        });
      const hook = document.querySelector(".scene.first .hook");
      return { out, hookPx: hook ? getComputedStyle(hook).fontSize : null, hookLines: hook ? Math.round(hook.getBoundingClientRect().height / parseFloat(getComputedStyle(hook).lineHeight)) : null };
    }, SAFE);
    faults.push(...f.out.map(x => `scene ${i + 1}: ${x}`));
    if (i === 0) console.log(`${spec.id}: hook ${f.hookPx}, ${f.hookLines} lines, holds ${spec.holds.join("/")}s = ${spec.holds.reduce((a, c) => a + c, 0).toFixed(1)}s, tags ${spec.caption.tags.length}`);
    await page.screenshot({ path: path.join(OUT, `${spec.id}-${i + 1}.png`) });
    t += spec.holds[i] * 1000;
  }
  console.log(faults.length ? "  FAULTS: " + faults.join(" | ") : "  clear");
  await page.close();
}
await b.close();
