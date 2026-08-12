import type { Slide } from "./schema.js";
const escapeHtml = (value: string): string => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
function content(slide: Slide): string {
  switch (slide.type) {
    case "cover": return `<p class="category">${escapeHtml(slide.category)}</p><h1>${escapeHtml(slide.title)}</h1><p class="subtitle">${escapeHtml(slide.subtitle)}</p>`;
    case "content": return `<h1>${escapeHtml(slide.title)}</h1><p class="body">${escapeHtml(slide.body)}</p>${slide.highlight ? `<p class="highlight">${escapeHtml(slide.highlight)}</p>` : ""}`;
    case "bullets": return `<h1>${escapeHtml(slide.title)}</h1><ul>${slide.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
    case "steps": return `<h1>${escapeHtml(slide.title)}</h1><ol>${slide.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
    case "summary": return `<h1>${escapeHtml(slide.title)}</h1><p class="body">${escapeHtml(slide.body)}</p><p class="cta">${escapeHtml(slide.cta)}</p>`;
  }
}
export function renderHtml(slide: Slide, number: number, total: number): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1350px;overflow:hidden}body{font-family:Inter,ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f7f3eb;color:#16302d}.slide{width:1080px;height:1350px;padding:104px 92px 90px;display:flex;flex-direction:column}.wave{height:18px;border-radius:999px;background:#edac76;width:220px;margin-bottom:54px}.brand{font-size:28px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#205752}.content{margin:auto 0}.eyebrow,.category{font-size:30px;font-weight:750;text-transform:uppercase;letter-spacing:.08em;color:#205752;margin:0 0 28px}h1{font-size:74px;line-height:1.04;letter-spacing:-.045em;max-width:900px;margin:0 0 42px}.subtitle,.body{font-size:38px;line-height:1.34;max-width:860px;margin:0}.highlight,.cta{display:inline-block;background:#edac76;padding:22px 30px;border-radius:24px;font-size:34px;font-weight:800;margin:42px 0 0}ul,ol{display:grid;gap:24px;margin:34px 0 0;padding-left:50px;font-size:34px;line-height:1.28}li{padding-left:12px}.footer{display:flex;justify-content:space-between;align-items:end;border-top:3px solid #a8bdbb;padding-top:26px;font-size:24px;font-weight:700;color:#205752}.source{max-width:700px;font-weight:500}.number{white-space:nowrap}</style></head><body><main class="slide"><header><div class="wave"></div><div class="brand">Finkavo</div></header><section class="content">${slide.eyebrow ? `<p class="eyebrow">${escapeHtml(slide.eyebrow)}</p>` : ""}${content(slide)}</section><footer class="footer"><span class="source">${slide.sourceLabel ? escapeHtml(slide.sourceLabel) : "Portugal, made clearer."}</span><span class="number">${number} / ${total}</span></footer></main></body></html>`;
}

