import type { Slide } from "./schema.js";

const escapeHtml = (value: string): string => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export type RenderAssets = {
  logoDataUrl: string;
  backgroundDataUrl: string;
  frauncesLatinDataUrl: string;
  frauncesLatinExtDataUrl: string;
  notoLatinDataUrl: string;
  notoLatinExtDataUrl: string;
};

const logo = (src: string) => `<div class="brand"><img src="${src}" alt=""><span>FINKAVO</span></div>`;

function content(slide: Slide): string {
  switch (slide.type) {
    case "cover":
      return `<p class="category">${escapeHtml(slide.category)}</p><h1>${escapeHtml(slide.title)}</h1><p class="subtitle">${escapeHtml(slide.subtitle)}</p><p class="swipe">Swipe to continue <span>→</span></p>`;
    case "content":
      return `<h1>${escapeHtml(slide.title)}</h1><p class="body">${escapeHtml(slide.body)}</p>${slide.highlight ? `<p class="highlight">${escapeHtml(slide.highlight)}</p>` : ""}`;
    case "bullets":
      return `<h1>${escapeHtml(slide.title)}</h1><ul>${slide.items.map((item, index) => `<li><b>${String(index + 1).padStart(2, "0")}</b><span>${escapeHtml(item)}</span></li>`).join("")}</ul>`;
    case "steps":
      return `<h1>${escapeHtml(slide.title)}</h1><ol>${slide.items.map((item, index) => `<li><b>${String(index + 1).padStart(2, "0")}</b><span>${escapeHtml(item)}</span></li>`).join("")}</ol>`;
    case "summary":
      return `<h1>${escapeHtml(slide.title)}</h1><p class="body">${escapeHtml(slide.body)}</p><p class="cta">${escapeHtml(slide.cta)} <span>→</span></p>`;
  }
}

export function renderHtml(slide: Slide, number: number, total: number, assets: RenderAssets): string {
  const bg = `url(&quot;${assets.backgroundDataUrl}&quot;)`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
@font-face{font-family:"Fraunces";font-style:normal;font-weight:300 900;font-display:block;src:url("${assets.frauncesLatinExtDataUrl}") format("woff2")}@font-face{font-family:"Fraunces";font-style:normal;font-weight:300 900;font-display:block;src:url("${assets.frauncesLatinDataUrl}") format("woff2")}@font-face{font-family:"Noto Sans";font-style:normal;font-weight:400 900;font-display:block;src:url("${assets.notoLatinExtDataUrl}") format("woff2")}@font-face{font-family:"Noto Sans";font-style:normal;font-weight:400 900;font-display:block;src:url("${assets.notoLatinDataUrl}") format("woff2")}
:root{--petrol:#14332f;--deep:#0a2320;--cream:#eeeae1;--paper:#f7f3eb;--mint:#daf0e6;--ink:#1b2b29;--muted:#586663;--peach:#e3a171;--photo:${bg}}*{box-sizing:border-box}html,body{margin:0;width:1080px;height:1350px;overflow:hidden}body{font-family:"Noto Sans",Arial,sans-serif;font-stretch:normal;background:var(--cream);color:var(--ink);-webkit-font-smoothing:antialiased}.slide{position:relative;width:1080px;height:1350px;padding:62px 72px 54px;display:flex;flex-direction:column;isolation:isolate;overflow:hidden}.slide:before{content:"";position:absolute;z-index:0;inset:0;background-image:linear-gradient(90deg,rgba(238,234,225,.98) 0 64%,rgba(238,234,225,.18) 100%),var(--photo);background-size:cover;background-position:center}.slide:after{content:"";position:absolute;z-index:1;right:-80px;bottom:-40px;width:450px;height:560px;background:linear-gradient(180deg,rgba(218,240,230,.12),rgba(20,51,47,.20));border-radius:220px 0 0 0}.top,.copy,.footer{position:relative;z-index:2}.top{display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid rgba(27,43,41,.26);padding-bottom:22px}.brand{display:flex;align-items:center;gap:16px}.brand img{width:58px;height:58px;object-fit:contain}.brand span{font-size:25px;font-weight:900;letter-spacing:.16em}.series{font-size:20px;font-weight:850;letter-spacing:.14em;text-transform:uppercase}.copy{margin:auto 0;max-width:855px;padding:48px 0}.eyebrow,.category{font-size:25px;font-weight:900;text-transform:uppercase;letter-spacing:.14em;margin:0 0 28px;color:var(--petrol)}h1{font-family:"Fraunces",Georgia,serif;font-stretch:normal;font-size:78px;line-height:.98;letter-spacing:-.025em;max-width:900px;margin:0 0 34px;text-wrap:balance;font-weight:900}.subtitle,.body{font-size:39px;line-height:1.24;max-width:820px;margin:0;color:var(--ink);font-weight:620}.highlight{display:inline-block;color:var(--petrol);border-top:4px solid var(--peach);padding:20px 0 0;font-size:34px;line-height:1.15;font-weight:900;margin:36px 0 0}.swipe,.cta{font-size:25px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;margin:42px 0 0;padding-top:22px;border-top:3px solid currentColor;width:max-content;max-width:100%}.swipe span,.cta span{font-size:34px}ul,ol{list-style:none;display:grid;gap:16px;margin:34px 0 0;padding:0}ul li,ol li{display:grid;grid-template-columns:80px 1fr;gap:22px;align-items:center;background:rgba(247,243,235,.96);border:3px solid var(--ink);border-radius:22px;padding:20px 24px;min-height:100px;font-size:31px;line-height:1.17;font-weight:760}ul li:nth-child(even),ol li:nth-child(even){background:rgba(218,240,230,.97)}ul b,ol b{font-size:34px;letter-spacing:-.04em}.footer{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:end;border-top:2px solid rgba(27,43,41,.28);padding-top:22px;font-size:21px;font-weight:750;color:var(--ink)}.source{max-width:720px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.number{font-weight:900;letter-spacing:.10em}.cover,.summary{color:var(--paper)}.cover:before,.summary:before{background-image:linear-gradient(90deg,rgba(10,35,32,.96) 0%,rgba(10,35,32,.88) 46%,rgba(10,35,32,.28) 100%),var(--photo);background-position:center}.cover:after,.summary:after{display:none}.cover .top,.cover .footer,.summary .top,.summary .footer{border-color:rgba(234,240,238,.45);color:var(--paper)}.cover .category{color:var(--mint)}.cover h1{font-family:"Fraunces",Georgia,serif;font-stretch:normal;font-size:96px;max-width:830px}.cover .subtitle,.summary .body{color:var(--paper);font-weight:650}.cover .copy{max-width:850px}.summary .copy{max-width:820px}.summary h1{font-family:"Fraunces",Georgia,serif;font-stretch:normal;font-size:88px}.summary .cta{color:var(--mint);background:none;border-radius:0}.bullets:before{background-image:linear-gradient(90deg,rgba(238,234,225,.99) 0 72%,rgba(238,234,225,.28) 100%),var(--photo)}.steps:before{background-image:linear-gradient(90deg,rgba(218,240,230,.99) 0 70%,rgba(218,240,230,.30) 100%),var(--photo)}
.photo{position:absolute;z-index:0;inset:0;background-size:cover;background-position:center}.slide:before{z-index:1;background:linear-gradient(90deg,rgba(238,234,225,.98) 0 64%,rgba(238,234,225,.18) 100%)}.cover:before,.summary:before{background:linear-gradient(90deg,rgba(10,35,32,.96) 0%,rgba(10,35,32,.88) 46%,rgba(10,35,32,.28) 100%)}.bullets:before{background:linear-gradient(90deg,rgba(238,234,225,.99) 0 72%,rgba(238,234,225,.28) 100%)}.steps:before{background:linear-gradient(90deg,rgba(218,240,230,.99) 0 70%,rgba(218,240,230,.30) 100%)}
</style></head><body><main class="slide ${slide.type}"><div class="photo" style="background-image:${bg}"></div><header class="top">${logo(assets.logoDataUrl)}<span class="series">Portugal, explained</span></header><section class="copy">${slide.eyebrow ? `<p class="eyebrow">${escapeHtml(slide.eyebrow)}</p>` : ""}${content(slide)}</section><footer class="footer"><span class="source">${slide.sourceLabel ? escapeHtml(slide.sourceLabel) : "finkavo.com · @finkavo"}</span><span class="number">${number} / ${total}</span></footer></main></body></html>`;
}
