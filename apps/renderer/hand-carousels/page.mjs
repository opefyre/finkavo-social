// Carousel slides, in the same glass language as the reels.
//
// Two things differ from the reel canvas and both matter:
//
// 1. SIZE. 1080x1350 (4:5) is what Instagram shows whole in the feed. A square would
//    waste a fifth of the height it will give you.
//
// 2. THE GRID CROP. The profile grid centre-crops a 4:5 image to 1:1, taking y 135 to
//    1215. Anything outside that band exists in the feed and vanishes on your profile,
//    so the headline and the number live inside it and only the footer sits below.
//
// There is no Instagram chrome over a feed image the way there is over a reel, so the
// safe area here is generous — the constraint is the crop, not the interface.

export const W = 1080, H = 1350;
/** The square the profile grid keeps. Headlines must sit inside it. */
export const GRID = { top: 135, bottom: 1215 };
export const PAD = 72;
export const LOGO = { size: 88, edge: 40 };

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function slideBody(s) {
  switch (s.type) {
    case "cover":
      return `<div class="panel wide"><i class="sheen"></i>
                <h1 class="hook">${esc(s.title)}</h1>
                ${s.body ? `<p class="sub">${esc(s.body)}</p>` : ""}
              </div>`;
    case "figure":
      return `<div class="figwrap"><i class="sheen"></i><span class="figure">${esc(s.figure)}</span>
                ${s.figureLabel ? `<span class="figlab">${esc(s.figureLabel)}</span>` : ""}</div>
              <div class="panel wide"><i class="sheen"></i>
                <h2 class="lead">${esc(s.title)}</h2>
                ${s.body ? `<p class="sub">${esc(s.body)}</p>` : ""}
              </div>`;
    case "rows":
      return `<div class="panel wide"><i class="sheen"></i><h2 class="lead">${esc(s.title)}</h2></div>
              <div class="rows">${s.rows.map(r => `<div class="row"><i class="sheen"></i>
                  <span class="rkey">${esc(r.key)}</span>
                  <span class="rval">${esc(r.value)}</span>
                </div>`).join("")}</div>`;
    case "cta":
      return `<div class="panel wide"><i class="sheen"></i>
                <h2 class="lead">${esc(s.title)}</h2>
                ${s.body ? `<p class="sub">${esc(s.body)}</p>` : ""}
              </div>
              ${s.action ? `<div class="action"><i class="sheen"></i><span>${esc(s.action)}</span></div>` : ""}`;
    default:
      return `<div class="panel wide"><i class="sheen"></i>
                <h2 class="lead">${esc(s.title)}</h2>
                ${s.body ? `<p class="sub">${esc(s.body)}</p>` : ""}
              </div>`;
  }
}

export function buildPage(spec, assets, slide, index) {
  const isCover = slide.type === "cover";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
@font-face{font-family:"Fraunces";font-weight:300 900;font-display:block;src:url("${assets.frauncesExt}") format("woff2")}
@font-face{font-family:"Fraunces";font-weight:300 900;font-display:block;src:url("${assets.fraunces}") format("woff2")}
@font-face{font-family:"Noto Sans";font-weight:400 900;font-display:block;src:url("${assets.notoExt}") format("woff2")}
@font-face{font-family:"Noto Sans";font-weight:400 900;font-display:block;src:url("${assets.noto}") format("woff2")}
:root{
  --deep:#06181a; --petrol:#0f2f33; --ink:#f5f8f6; --muted:rgba(245,248,246,.78);
  --mint:#7fe0c0; --amber:#f3b072;
  --r-chip:999px; --r-md:28px; --r-lg:40px; --r-xl:52px;
  --glass:linear-gradient(158deg,rgba(255,255,255,.16),rgba(255,255,255,.055) 46%,rgba(255,255,255,.09));
  --glass-soft:linear-gradient(158deg,rgba(255,255,255,.11),rgba(255,255,255,.04));
  --blur:saturate(150%) blur(30px);
  --rim:inset 0 3px 14px rgba(255,255,255,.13), inset 0 -2px 18px rgba(0,0,0,.16);
  --lift:0 26px 64px rgba(0,0,0,.44), 0 6px 16px rgba(0,0,0,.28);
  --lift-sm:0 12px 32px rgba(0,0,0,.34);
}
*{box-sizing:border-box;margin:0;border:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{background:var(--deep);color:var(--ink);font-family:"Noto Sans",Arial,sans-serif;-webkit-font-smoothing:antialiased}
.stage{position:relative;width:${W}px;height:${H}px;overflow:hidden;isolation:isolate;background:var(--deep)}
.bg{position:absolute;inset:0;z-index:0}
.ph{position:absolute;inset:0;background-size:cover;background-position:${spec.photoPos || (isCover ? "center 28%" : "center 40%")};
  transform:scale(${isCover ? 1.0 : 1.08});filter:saturate(.76) contrast(1.06) brightness(${isCover ? .88 : .7})}
.grade{position:absolute;inset:0;background:var(--petrol);mix-blend-mode:color;opacity:.3}
.scrim{position:absolute;inset:0;background:linear-gradient(180deg,
  rgba(6,24,26,${isCover ? ".46" : ".62"}) 0%, rgba(6,24,26,${isCover ? ".18" : ".5"}) 26%,
  rgba(6,24,26,${isCover ? ".44" : ".66"}) 56%, rgba(6,24,26,.92) 100%)}
.glow{position:absolute;z-index:1;width:1000px;height:1000px;left:-200px;top:${isCover ? 300 : 120}px;pointer-events:none;
  background:radial-gradient(circle at center, rgba(127,224,192,.18), rgba(127,224,192,0) 62%);filter:blur(26px)}

/* Everything the grid crop keeps lives between GRID.top and GRID.bottom. */
.stack{position:absolute;left:${PAD}px;width:${W - PAD * 2}px;bottom:${H - GRID.bottom + 96}px;
  display:flex;flex-direction:column;align-items:flex-start;gap:20px;z-index:3}
.chip,.panel,.row,.figwrap,.action,.cite{position:relative;overflow:hidden;
  background:var(--glass);-webkit-backdrop-filter:var(--blur);backdrop-filter:var(--blur);
  box-shadow:var(--rim),var(--lift)}
.wide{width:100%}
.chip{border-radius:var(--r-chip);padding:15px 28px 16px;box-shadow:var(--rim),var(--lift-sm)}
.chip span{font-size:27px;font-weight:900;letter-spacing:.13em;text-transform:uppercase;color:var(--mint)}
.panel{border-radius:var(--r-xl);padding:38px 42px 42px}
.hook{font-family:"Fraunces",Georgia,serif;font-weight:900;font-size:92px;line-height:1.03;letter-spacing:-.028em}
.lead{font-family:"Fraunces",Georgia,serif;font-weight:900;font-size:64px;line-height:1.08;letter-spacing:-.02em}
.sub{font-size:37px;line-height:1.36;font-weight:640;color:var(--muted)}
.panel .hook + .sub,.panel .lead + .sub{margin-top:22px}
.figwrap{border-radius:var(--r-lg);padding:24px 40px 28px;background:var(--glass-soft)}
.figure{font-family:"Noto Sans",Arial,sans-serif;font-weight:900;font-size:104px;line-height:1;letter-spacing:-.035em;color:var(--amber);display:block;font-variant-numeric:lining-nums}
.figlab{display:block;font-size:27px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-top:8px}
.rows{display:flex;flex-direction:column;gap:14px;width:100%}
.row{border-radius:var(--r-md);padding:22px 30px;background:var(--glass-soft);display:flex;align-items:baseline;justify-content:space-between;gap:24px}
.rkey{font-size:33px;font-weight:680;color:var(--muted);flex:1}
.rval{font-family:"Noto Sans",Arial,sans-serif;font-size:40px;font-weight:900;color:var(--amber);white-space:nowrap;font-variant-numeric:lining-nums}
.action{border-radius:var(--r-chip);padding:19px 32px 21px;background:linear-gradient(158deg,rgba(127,224,192,.26),rgba(127,224,192,.11))}
.action span{font-size:32px;font-weight:800;color:var(--mint)}
.sheen{position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(112deg,transparent 32%,rgba(255,255,255,.10) 47%,transparent 66%)}

/* Bigger and flat, to match the reels. It sits wholly above the grid crop: at 88px from
   the old 72px margin it straddled y 135 and the profile grid would cut it in half. */
.top{position:absolute;z-index:6;right:${LOGO.edge}px;top:${LOGO.edge}px}
.top img{width:${LOGO.size}px;height:${LOGO.size}px;object-fit:contain;display:block}
.cite{position:absolute;z-index:6;left:${PAD}px;bottom:${PAD - 8}px;border-radius:var(--r-chip);
  padding:11px 22px 12px;white-space:nowrap;font-size:21px;font-weight:700;color:var(--muted);
  box-shadow:var(--rim),var(--lift-sm)}
.mark{position:absolute;z-index:6;right:${PAD}px;bottom:${PAD + 2}px;font-size:20px;font-weight:900;letter-spacing:.24em;opacity:.46}
/* Which slide you are on, and that there are more. Carousels lose people who cannot
   tell there is a next card. */
/* Top left, opposite the logo. Centred along the bottom they collided with the source
   chip on four of seven carousels — the source line varies in length, so any bottom
   position is a collision waiting for a longer citation. Up here it cannot happen, and
   it sits inside the square the profile grid keeps. */
.pips{position:absolute;z-index:6;left:${LOGO.edge}px;top:${LOGO.edge + LOGO.size / 2 - 5}px;display:flex;gap:7px}
.pip{width:9px;height:9px;border-radius:999px;background:rgba(245,248,246,.26)}
.pip.on{background:var(--mint);width:26px}
.grain{position:absolute;inset:0;z-index:5;pointer-events:none;opacity:.04;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E")}
</style></head><body>
<div class="stage">
  <div class="bg">
    <div class="ph" style="background-image:url('${spec.photo}')"></div>
    <div class="grade"></div><div class="scrim"></div>
  </div>
  <div class="glow"></div>
  <div class="stack">
    ${slide.kicker ? `<div class="chip"><i class="sheen"></i><span>${esc(slide.kicker)}</span></div>` : ""}
    ${slideBody(slide)}
  </div>
  <div class="grain"></div>
  <div class="top"><img src="${assets.logo}" alt=""></div>
  <div class="cite">${esc(spec.source)}</div>
  <div class="mark">FINKAVO</div>
  <div class="pips">${spec.slides.map((_, i) => `<span class="pip${i === index ? " on" : ""}"></span>`).join("")}</div>
</div>
</body></html>`;
}
