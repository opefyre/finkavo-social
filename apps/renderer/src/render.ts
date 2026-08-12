import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import type { RenderManifest } from "./schema.js";
import { renderHtml } from "./template.js";
export async function renderManifest(manifest: RenderManifest, root: string): Promise<string[]> {
  const directory = path.resolve(root, manifest.postId, manifest.revisionId);
  await mkdir(directory, { recursive: true });
  const assetRoot = path.resolve(process.env.RENDER_ASSET_ROOT || "branding/assets");
  const [logo, frauncesLatin, frauncesLatinExt, notoLatin, notoLatinExt] = await Promise.all([
    readFile(path.join(assetRoot, "finkavo-logo-512.png")),
    readFile(path.join(assetRoot, "fonts/fraunces-normal-latin.woff2")),
    readFile(path.join(assetRoot, "fonts/fraunces-normal-latin-ext.woff2")),
    readFile(path.join(assetRoot, "fonts/noto-sans-normal-latin.woff2")),
    readFile(path.join(assetRoot, "fonts/noto-sans-normal-latin-ext.woff2")),
  ]);
  const assets = {
    logoDataUrl: `data:image/png;base64,${logo.toString("base64")}`,
    frauncesLatinDataUrl: `data:font/woff2;base64,${frauncesLatin.toString("base64")}`,
    frauncesLatinExtDataUrl: `data:font/woff2;base64,${frauncesLatinExt.toString("base64")}`,
    notoLatinDataUrl: `data:font/woff2;base64,${notoLatin.toString("base64")}`,
    notoLatinExtDataUrl: `data:font/woff2;base64,${notoLatinExt.toString("base64")}`,
  };
  const browser = await chromium.launch({ headless: true });
  try {
    const outputs: string[] = [];
    for (const [index, slide] of manifest.slides.entries()) {
      const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
      try {
        await page.setContent(renderHtml(slide, index + 1, manifest.slides.length, assets, manifest.visualStyle), { waitUntil: "load" });
        await page.evaluate(async () => {
          await Promise.all([
            document.fonts.load('900 16px "Fraunces"'),
            document.fonts.load('900 16px "Noto Sans"'),
          ]);
          await document.fonts.ready;
        });
        const dimensions = await page.evaluate(() => {
        const slide = document.querySelector(".slide")?.getBoundingClientRect();
        const clipped = [...document.querySelectorAll(".top,.copy,.footer,h1,.body,.subtitle,li")].some((element) => {
          const rect = element.getBoundingClientRect();
          return rect.left < 0 || rect.right > 1080 || rect.top < 0 || rect.bottom > 1350;
        });
        const fonts = document.fonts.check('900 16px "Fraunces"') && document.fonts.check('900 16px "Noto Sans"');
        return { overflow: document.documentElement.scrollHeight > 1350 || document.documentElement.scrollWidth > 1080 || clipped, fonts, width: slide?.width, height: slide?.height };
        });
        if (dimensions.width !== 1080 || dimensions.height !== 1350) throw new Error(`Slide ${index + 1} has an invalid ${dimensions.width} × ${dimensions.height} canvas`);
        if (dimensions.overflow) throw new Error(`Slide ${index + 1} overflows the canvas`);
        if (!dimensions.fonts) throw new Error(`Slide ${index + 1} did not load the approved brand fonts`);
        const output = path.join(directory, `${String(index + 1).padStart(2, "0")}.png`);
        await page.screenshot({ path: output, type: "png" });
        outputs.push(output);
      } finally {
        await page.close();
      }
    }
    return outputs;
  } finally { await browser.close(); }
}
