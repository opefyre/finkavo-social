// Carousel design v2 — the reels' visual language, for static slides.
//
// What changed from v1 (photo + glass panels + serif headlines):
//   · no stock photo, everything is drawn in code, so no garbled AI text and nothing to crop away
//   · one typeface (Noto Sans) — numbers can never be misprinted, so the "no 3 in the headline" rule is gone
//   · a light/dark rhythm: dark cover and dark end card frame cream content slides; "figure" slides go dark for a beat
//   · the same parts as the reels: mint/amber/coral pills, white cards, icon tiles, a named "swipe" cue, a progress bar
//
// The two constraints are unchanged: 1080x1350 (4:5, shown whole in the feed) and the profile-grid crop, which keeps the
// square y 135..1215. All copy lives inside that square; only the top bar (kicker + logo) and the footer sit outside it.

export const W = 1080, H = 1350;
export const GRID = { top: 135, bottom: 1215 };
export const PAD = 84;
export const C = {
  deep: "#06181a", petrol: "#0f2f33", teal: "#1d4f4c", ink: "#0b2a2c", cream: "#f6f1e7", white: "#ffffff",
  mint: "#7fe0c0", mintD: "#26a688", amber: "#f3b072", amberD: "#d9812f", coral: "#ff7d63", coralD: "#d9482e", mute: "#557270",
};

/** What the builder measures on this design. Selectors, not code, so build.mjs stays design-agnostic. */
export const CHECK = {
  stack: ".stack",
  overflow: ".h1, .h2, .rv, .action, .fignum, .cite, .cue, .kick",
  clip: ".card, .row, .step, .action, .tile, .versus > div, .kick",
  furniture: [".cite", ".cue", ".pips", ".top", ".kick"],
  logo: ".top",
  serifThree: false,
};

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
/** *word* mint pill · *$word* amber pill · *!word* coral pill. Pills never wrap, so keep them to one or two short words. */
export const rich = s => esc(s).replace(/\*([!$]?)([^*]+)\*/g, (_, k, t) => `<b class="em ${k === "$" ? "amber" : k === "!" ? "coral" : "mint"}">${t.replace(/ /g, "&nbsp;")}</b>`);

/** The footer pill holds one line. Keep as many whole " · " segments as fit; the caption carries the full source list. */
const shortSource = (src, max = 50) => {
  const parts = String(src).split(" · "); let out = parts[0];
  for (const p of parts.slice(1)) { if ((out + " · " + p).length > max) break; out += " · " + p; }
  return out;
};
const DARK_TYPES = new Set(["cover", "figure", "cta"]);
const ICON_FOR = { cover: "doc", content: "doc", rows: "chart", figure: "coin", cta: "check", steps: "check", versus: "shield" };

function body(s, ic) {
  const tile = (name, size = "", bg = C.mint) => `<div class="tile ${size}" style="background:${bg}">${ic(name || "doc", size === "lg" ? 136 : 104)}</div>`;
  switch (s.type) {
    case "cover":
      return `<div class="stack cover">
        ${tile(s.icon || ICON_FOR.cover, "lg")}
        <h1 class="h1">${rich(s.title)}</h1>
        ${s.body ? `<p class="sub">${rich(s.body)}</p>` : ""}
      </div>`;
    case "figure": {
      const n = String(s.figure).length, size = n <= 6 ? 210 : n <= 9 ? 160 : n <= 13 ? 118 : 92;
      return `<div class="stack">
        <div class="figbox"><span class="fignum" style="font-size:${size}px">${esc(s.figure)}</span></div>
        ${s.figureLabel ? `<div class="figlab">${esc(s.figureLabel)}</div>` : ""}
        <h2 class="h2 sm">${rich(s.title)}</h2>
        ${s.body ? `<p class="sub">${rich(s.body)}</p>` : ""}
      </div>`;
    }
    case "rows":
      return `<div class="stack">
        <h2 class="h2">${rich(s.title)}</h2>
        <div class="rows">${s.rows.map(r => `<div class="row"><span class="rk">${rich(r.key)}</span><span class="rv">${esc(r.value)}</span></div>`).join("")}</div>
      </div>`;
    case "steps":
      return `<div class="stack">
        <h2 class="h2">${rich(s.title)}</h2>
        <div class="steps">${s.steps.map((t, i) => `<div class="step"><span class="n">${i + 1}</span><div><b>${rich(t.title)}</b>${t.text ? `<p>${rich(t.text)}</p>` : ""}</div></div>`).join("")}</div>
      </div>`;
    case "versus": {
      const [a, b] = s.versus;
      const half = (h, bad) => `<div class="${bad ? "bad" : "good"}"><span class="vt">${ic(bad ? "cross" : "check", 64)}<i>${esc(h.label)}</i></span><p>${rich(h.text)}</p></div>`;
      return `<div class="stack">
        <h2 class="h2">${rich(s.title)}</h2>
        <div class="versus">${half(a, true)}${half(b, false)}</div>
      </div>`;
    }
    case "cta":
      return `<div class="stack">
        <h2 class="h2">${rich(s.title)}</h2>
        ${s.body ? `<p class="sub">${rich(s.body)}</p>` : ""}
        ${s.action ? `<div class="action">${esc(s.action)}</div>` : ""}
        <div class="card follow">${tile("check", "", C.mint)}<p>${rich(s.follow || "Follow for one plain-English Portugal tax rule at a time.")}</p></div>
      </div>`;
    default:
      return `<div class="stack">
        ${s.icon ? tile(s.icon) : ""}
        <h2 class="h2">${rich(s.title)}</h2>
        ${s.body ? `<div class="card"><p>${rich(s.body)}</p></div>` : ""}
      </div>`;
  }
}

export function buildPage(spec, assets, slide, index) {
  const total = spec.slides.length, last = index === total - 1, first = index === 0;
  const dark = DARK_TYPES.has(slide.type);
  const ic = (name, size) => (assets.icons[name] || assets.icons.doc)(size);
  const blobs = dark
    ? `<i class="blob" style="left:520px;top:520px;width:760px;height:760px;background:#0d3a3a"></i><i class="blob" style="left:-260px;top:-200px;width:640px;height:640px;background:#0a2c2e"></i><i class="blob" style="left:700px;top:60px;width:300px;height:300px;background:#7fe0c0;opacity:.10"></i>`
    : `<i class="blob" style="left:640px;top:760px;width:640px;height:640px;background:#dff5ec"></i><i class="blob" style="left:-240px;top:-120px;width:520px;height:520px;background:#fbe6d1"></i>`;
  const pips = Array.from({ length: total }, (_, i) => `<i class="${i <= index ? "on" : ""}"></i>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
@font-face{font-family:"Noto Sans";font-weight:400 900;font-display:block;src:url("${assets.notoExt}") format("woff2")}
@font-face{font-family:"Noto Sans";font-weight:400 900;font-display:block;src:url("${assets.noto}") format("woff2")}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{font-family:"Noto Sans",Arial,sans-serif;-webkit-font-smoothing:antialiased;font-variant-numeric:lining-nums}
.slide{position:relative;width:${W}px;height:${H}px;overflow:hidden}
.light{background:${C.cream};color:${C.ink};--muted:${C.mute};--card:#fff;--cardfg:${C.ink};--shadow:0 26px 60px rgba(11,42,44,.12),0 4px 12px rgba(11,42,44,.05)}
.dark{background:radial-gradient(110% 70% at 78% 12%,#134747 0%,${C.deep} 62%);color:${C.cream};--muted:rgba(246,241,231,.76);--card:${C.petrol};--cardfg:${C.cream};--shadow:0 26px 60px rgba(0,0,0,.35)}
.blob{position:absolute;border-radius:50%}
.kick{position:absolute;left:${PAD}px;top:56px;padding:15px 30px 16px;border-radius:999px;background:${C.mint};color:${C.ink};font-weight:900;font-size:27px;letter-spacing:.13em;text-transform:uppercase;white-space:nowrap}
.top{position:absolute;right:60px;top:40px;width:88px;height:88px;border-radius:26px}
.top img{display:block;width:100%;height:100%;border-radius:26px}
.dark .top{background:${C.mint};padding:6px;width:96px;height:96px;right:56px;top:36px;border-radius:30px}
.dark .top img{border-radius:22px}
.stack{position:absolute;left:${PAD}px;top:${GRID.top + 30}px;width:${W - PAD * 2}px;height:${GRID.bottom - GRID.top - 60}px;display:flex;flex-direction:column;justify-content:center;gap:34px}
.h1{font-weight:900;font-size:116px;line-height:1.0;letter-spacing:-.04em}
.h2{font-weight:900;font-size:80px;line-height:1.03;letter-spacing:-.035em}
.h2.sm{font-size:64px}
.em{display:inline-block;padding:.02em .2em .07em;border-radius:.26em;letter-spacing:-.03em}
.em.mint{background:${C.mint};color:${C.ink}}.em.amber{background:${C.amber};color:${C.ink}}.em.coral{background:${C.coral};color:${C.ink}}
.sub{font-weight:700;font-size:44px;line-height:1.3;letter-spacing:-.01em;color:var(--muted)}
.card{background:var(--card);color:var(--cardfg);border-radius:52px;padding:44px 50px;box-shadow:var(--shadow)}
.card p{font-weight:700;font-size:42px;line-height:1.36;letter-spacing:-.01em}
.tile{flex:none;display:flex;align-items:center;justify-content:center;width:150px;height:150px;border-radius:44px;box-shadow:var(--shadow)}
.tile.lg{width:196px;height:196px;border-radius:58px}
.rows{display:flex;flex-direction:column;gap:20px}
.row{display:flex;align-items:center;justify-content:space-between;gap:26px;background:var(--card);color:var(--cardfg);border-radius:42px;padding:26px 30px 26px 42px;box-shadow:var(--shadow)}
.rk{flex:1;font-weight:800;font-size:36px;line-height:1.2;letter-spacing:-.01em}
.rv{flex:none;font-weight:900;font-size:36px;letter-spacing:-.02em;background:${C.amber};color:${C.ink};padding:12px 28px 14px;border-radius:999px;white-space:nowrap}
.steps{display:flex;flex-direction:column;gap:22px}
.step{display:flex;gap:28px;align-items:flex-start;background:var(--card);color:var(--cardfg);border-radius:46px;padding:32px 40px 34px 32px;box-shadow:var(--shadow)}
.step .n{flex:none;display:flex;align-items:center;justify-content:center;width:84px;height:84px;border-radius:50%;background:${C.mint};color:${C.ink};font-weight:900;font-size:48px}
.step b{display:block;font-weight:900;font-size:42px;line-height:1.15;letter-spacing:-.02em}
.step p{margin-top:8px;font-weight:700;font-size:34px;line-height:1.32;color:var(--muted)}
.versus{display:flex;flex-direction:column;gap:24px}
.versus>div{border-radius:48px;padding:34px 44px 38px;box-shadow:var(--shadow)}
.versus .bad{background:#ffe1d9;color:${C.ink}}.versus .good{background:#dff5ec;color:${C.ink}}
.vt{display:flex;align-items:center;gap:20px}.vt i{font-style:normal;font-weight:900;font-size:34px;letter-spacing:.12em;text-transform:uppercase}
.versus p{margin-top:14px;font-weight:800;font-size:42px;line-height:1.28;letter-spacing:-.015em}
.figbox{display:inline-flex;align-self:flex-start;background:${C.amber};border-radius:56px;padding:22px 52px 32px;box-shadow:var(--shadow)}
.fignum{font-weight:900;line-height:1.02;letter-spacing:-.05em;color:${C.ink};white-space:nowrap}
.figlab{align-self:flex-start;font-weight:800;font-size:32px;letter-spacing:.1em;text-transform:uppercase;color:${C.mint}}
.action{align-self:flex-start;background:${C.mint};color:${C.ink};font-weight:900;font-size:46px;letter-spacing:-.02em;padding:26px 48px 30px;border-radius:999px;box-shadow:var(--shadow)}
.follow{display:flex;align-items:center;gap:30px;padding:30px 44px 30px 30px}
.follow .tile{width:112px;height:112px;border-radius:34px;box-shadow:none}
.follow p{font-size:38px;line-height:1.28}
.cite{position:absolute;left:${PAD}px;bottom:66px;max-width:640px;padding:12px 26px 13px;border-radius:999px;background:${dark ? "rgba(246,241,231,.12)" : "rgba(11,42,44,.07)"};font-weight:700;font-size:23px;letter-spacing:.02em;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:clip}
.cue{position:absolute;right:${PAD}px;bottom:58px;display:flex;align-items:center;gap:14px;padding:14px 30px 15px;border-radius:999px;font-weight:900;font-size:27px;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;background:${C.mint};color:${C.ink}}
.cue svg{display:block}
.pips{position:absolute;left:${PAD}px;right:${PAD}px;bottom:30px;display:flex;gap:8px}
.pips i{flex:1;height:8px;border-radius:4px;background:${dark ? "rgba(246,241,231,.2)" : "rgba(11,42,44,.13)"}}
.pips i.on{background:${dark ? C.mint : C.mintD}}
</style></head><body>
<div class="slide ${dark ? "dark" : "light"}">
  ${blobs}
  ${spec.kicker !== false && slide.kicker ? `<div class="kick">${esc(slide.kicker)}</div>` : ""}
  <div class="top"><img src="${assets.logo}" alt=""></div>
  ${body(slide, ic)}
  ${spec.source ? `<div class="cite">${esc(shortSource(spec.source))}</div>` : ""}
  <div class="cue">${last ? "@finkavo" : `${first ? "Swipe" : ""}<svg width="44" height="24" viewBox="0 0 44 24"><path d="M3 12 H37 M27 3 L38 12 L27 21" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`}</div>
  <div class="pips">${pips}</div>
</div></body></html>`;
}
