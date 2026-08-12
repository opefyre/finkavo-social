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
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
    const outputs: string[] = [];
    for (const [index, slide] of manifest.slides.entries()) {
      await page.setContent(renderHtml(slide, index + 1, manifest.slides.length, assets), { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      const dimensions = await page.evaluate(() => {
        const slide = document.querySelector(".slide")?.getBoundingClientRect();
        return { overflow: document.documentElement.scrollHeight > 1350 || document.documentElement.scrollWidth > 1080, width: slide?.width, height: slide?.height };
      });
      if (dimensions.width !== 1080 || dimensions.height !== 1350) throw new Error(`Slide ${index + 1} has an invalid ${dimensions.width} × ${dimensions.height} canvas`);
      if (dimensions.overflow) throw new Error(`Slide ${index + 1} overflows the canvas`);
      const output = path.join(directory, `${String(index + 1).padStart(2, "0")}.png`);
      await page.screenshot({ path: output, type: "png" });
      outputs.push(output);
    }
    return outputs;
  } finally { await browser.close(); }
}
