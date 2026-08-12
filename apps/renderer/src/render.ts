import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import type { RenderManifest } from "./schema.js";
import { renderHtml } from "./template.js";
export async function renderManifest(manifest: RenderManifest, root: string): Promise<string[]> {
  const directory = path.resolve(root, manifest.postId, manifest.revisionId);
  await mkdir(directory, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
    const outputs: string[] = [];
    for (const [index, slide] of manifest.slides.entries()) {
      await page.setContent(renderHtml(slide, index + 1, manifest.slides.length), { waitUntil: "load" });
      const overflow = await page.evaluate(() => document.documentElement.scrollHeight > 1350 || document.documentElement.scrollWidth > 1080);
      if (overflow) throw new Error(`Slide ${index + 1} overflows the canvas`);
      const output = path.join(directory, `${String(index + 1).padStart(2, "0")}.png`);
      await page.screenshot({ path: output, type: "png" });
      outputs.push(output);
    }
    return outputs;
  } finally { await browser.close(); }
}

