import type { RenderAssets } from "./template.js";
import type { ReelFrame, ReelManifest } from "./reel-schema.js";

const escapeHtml = (value: string): string =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

export const REEL_WIDTH = 1080;
export const REEL_HEIGHT = 1920;

// Instagram lays its own furniture over a Reel: the account row and caption sit across
// the bottom, the audio and buttons up the right side, and the top is clipped in the
// grid preview. Copy inside these margins is copy nobody has to fight the interface to
// read, which is why the frame is 1920 tall but only the middle band is used.
const SAFE_TOP = 260;
const SAFE_BOTTOM = 520;
const SAFE_RIGHT = 190;

function body(frame: ReelFrame): string {
  switch (frame.type) {
    case "hook":
      return `${frame.kicker ? `<p class="kicker">${escapeHtml(frame.kicker)}</p>` : ""}<h1 class="hook">${escapeHtml(frame.headline)}</h1>`;
    case "beat":
      return `${frame.figure ? `<p class="figure">${escapeHtml(frame.figure)}</p>` : ""}${frame.label ? `<p class="label">${escapeHtml(frame.label)}</p>` : ""}<p class="beat">${escapeHtml(frame.body)}</p>`;
    case "payoff":
      return `<h1 class="payoff">${escapeHtml(frame.headline)}</h1><p class="action">${escapeHtml(frame.action)}</p>`;
  }
}

export function renderReelFrame(manifest: ReelManifest, index: number, assets: RenderAssets): string {
  const frame = manifest.frames[index];
  if (!frame) throw new Error(`Reel has no frame at index ${index}`);
  const total = manifest.frames.length;
  // A thin bar showing how much is left. On a loop it is the cheapest possible signal
  // that the video is short, which is what keeps someone watching to the end.
  const progress = Math.round(((index + 1) / total) * 100);

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
@font-face{font-family:"Fraunces";font-style:normal;font-weight:300 900;font-display:block;src:url("${assets.frauncesLatinExtDataUrl}") format("woff2")}
@font-face{font-family:"Fraunces";font-style:normal;font-weight:300 900;font-display:block;src:url("${assets.frauncesLatinDataUrl}") format("woff2")}
@font-face{font-family:"Noto Sans";font-style:normal;font-weight:400 900;font-display:block;src:url("${assets.notoLatinExtDataUrl}") format("woff2")}
@font-face{font-family:"Noto Sans";font-style:normal;font-weight:400 900;font-display:block;src:url("${assets.notoLatinDataUrl}") format("woff2")}
:root{--petrol:#14332f;--deep:#0a2320;--cream:#eeeae1;--paper:#f7f3eb;--mint:#daf0e6;--ink:#1b2b29;--muted:#586663;--peach:#e3a171;--bg:var(--deep);--fg:var(--paper);--accent:var(--mint)}
*{box-sizing:border-box}
html,body{margin:0;width:${REEL_WIDTH}px;height:${REEL_HEIGHT}px;overflow:hidden}
body{font-family:"Noto Sans",Arial,sans-serif;background:var(--bg);color:var(--fg);-webkit-font-smoothing:antialiased}
/* The theme class lives on .frame, so .frame has to paint its own ground. Leaving the
   background on body meant a light theme set dark text through the cascade while the
   page behind it stayed dark, and the frame came out unreadable on itself. */
.frame{position:relative;width:${REEL_WIDTH}px;height:${REEL_HEIGHT}px;padding:${SAFE_TOP}px ${SAFE_RIGHT}px ${SAFE_BOTTOM}px 96px;display:flex;flex-direction:column;isolation:isolate;overflow:hidden;background:var(--bg);color:var(--fg)}
.frame:before{content:"";position:absolute;inset:0;z-index:0;background-image:linear-gradient(rgba(218,240,230,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(218,240,230,.05) 1px,transparent 1px),radial-gradient(circle at 88% 14%,rgba(227,161,113,.30) 0 260px,transparent 262px);background-size:70px 70px,70px 70px,auto}
.top,.copy,.foot{position:relative;z-index:2}
.top{display:flex;align-items:center;gap:20px}
.top img{width:64px;height:64px;object-fit:contain}
.top span{font-size:30px;font-weight:900;letter-spacing:.18em}
.copy{margin:auto 0;display:flex;flex-direction:column;justify-content:center}
/* Type is sized for a phone held at arm's length with the sound off. */
.kicker{font-size:34px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin:0 0 32px}
h1.hook{font-family:"Fraunces",Georgia,serif;font-size:112px;line-height:.96;letter-spacing:-.03em;font-weight:900;margin:0;text-wrap:balance}
.figure{font-family:"Fraunces",Georgia,serif;font-size:190px;line-height:.9;letter-spacing:-.045em;font-weight:900;color:var(--accent);margin:0 0 18px}
.label{font-size:36px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--fg);opacity:.82;margin:0 0 34px}
.beat{font-size:56px;line-height:1.2;font-weight:750;margin:0;max-width:760px;text-wrap:pretty}
h1.payoff{font-family:"Fraunces",Georgia,serif;font-size:92px;line-height:1;letter-spacing:-.025em;font-weight:900;margin:0 0 40px;text-wrap:balance}
.action{font-size:52px;line-height:1.22;font-weight:800;color:var(--accent);margin:0;max-width:760px;border-top:5px solid var(--accent);padding-top:34px}
.foot{display:flex;align-items:center;justify-content:space-between;gap:28px;font-size:26px;font-weight:750;opacity:.86}
.src{max-width:640px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bar{position:absolute;left:96px;right:${SAFE_RIGHT}px;bottom:${SAFE_BOTTOM - 64}px;height:8px;border-radius:8px;background:rgba(247,243,235,.20);z-index:2}
.bar i{display:block;height:8px;border-radius:8px;background:var(--accent);width:${progress}%}
/* Light themes flip the ground and keep the accent readable against it. */
.theme-cream_guide{--bg:#f7f3eb;--fg:var(--ink);--accent:var(--petrol)}
.theme-mint_checklist{--bg:#daf0e6;--fg:var(--ink);--accent:var(--petrol)}
.theme-peach_deadline{--bg:#efb78e;--fg:var(--ink);--accent:var(--petrol)}
.theme-ink_alert{--bg:#102b28;--fg:var(--paper);--accent:var(--peach)}
.theme-cream_guide:before,.theme-mint_checklist:before,.theme-peach_deadline:before{background-image:linear-gradient(rgba(27,43,41,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(27,43,41,.05) 1px,transparent 1px),radial-gradient(circle at 88% 14%,rgba(20,51,47,.10) 0 260px,transparent 262px)}
</style></head><body>
<main class="frame theme-${manifest.visualStyle}">
<header class="top"><img src="${assets.logoDataUrl}" alt=""><span>FINKAVO</span></header>
<section class="copy">${body(frame)}</section>
<div class="bar"><i></i></div>
<footer class="foot"><span class="src">${escapeHtml(manifest.sourceLabel)}</span><span>${index + 1}/${total}</span></footer>
</main></body></html>`;
}
