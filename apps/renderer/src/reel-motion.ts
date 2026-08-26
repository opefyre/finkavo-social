import type { ReelManifest, ReelFrame } from "./reel-schema.js";
import { HOLD_SECONDS } from "./reel-schema.js";
import type { RenderAssets } from "./template.js";
import { REEL_WIDTH, REEL_HEIGHT, reelThemeCss, reelFontFaces } from "./reel-template.js";

// The reel used to be one still per frame, held by ffmpeg under a slow zoom. That reads
// as a slideshow because it is one: nothing moves except the crop. This builds the whole
// reel as a single animated page instead, and the renderer photographs it thirty times a
// second.
//
// Everything is driven off one clock. `window.__seek(ms)` puts every animation at exactly
// that moment and pauses it, so the same millisecond always produces the same pixel —
// which is what makes frame-by-frame capture reproducible rather than a race against
// whatever the browser felt like painting. Counters that cannot be expressed as keyframes
// are computed from the same t inside __seek.

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Split into words, each wrapped so it can be revealed on its own beat. */
const words = (value: string) =>
  value.trim().split(/\s+/).filter(Boolean)
    .map((word, index) => `<span class="w" data-i="${index}">${escapeHtml(word)}</span>`)
    .join(" ");

/** Characters, for the typed opening line. Spaces stay unwrapped so wrapping still works. */
const chars = (value: string) =>
  [...value.trim()].map((character, index) =>
    character === " " ? " " : `<span class="c" data-i="${index}">${escapeHtml(character)}</span>`).join("");

// A figure like "40 hours" or "31 August" counts its number and keeps its unit. One that
// carries no number at all — "Both parents" — simply arrives.
const splitFigure = (figure: string) => {
  const match = figure.match(/^\s*([€$]?)\s*([\d.,]+)\s*(.*)$/u);
  if (!match) return { prefix: "", value: null as number | null, digits: "", suffix: figure };
  const digits = match[2]!;
  const numeric = Number(digits.replace(/[.,](?=\d{3}\b)/g, "").replace(",", "."));
  if (!Number.isFinite(numeric)) return { prefix: "", value: null, digits: "", suffix: figure };
  return { prefix: match[1] ?? "", value: numeric, digits, suffix: match[3] ?? "" };
};

function frameMarkup(frame: ReelFrame, index: number): string {
  const head =
    frame.type === "hook"
      ? `${frame.kicker ? `<p class="kicker">${escapeHtml(frame.kicker)}</p>` : ""}<h1 class="hook">${chars(frame.headline)}</h1>`
      : frame.type === "payoff"
        ? `<h1 class="payoff">${words(frame.headline)}</h1><p class="action">${words(frame.action)}</p>`
        : "";

  if (frame.type === "beat") {
    const parsed = frame.figure ? splitFigure(frame.figure) : null;
    const figure = frame.figure
      ? parsed && parsed.value !== null
        ? `<p class="figure" data-count="${parsed.value}" data-digits="${escapeHtml(parsed.digits)}"><span class="pre">${escapeHtml(parsed.prefix)}</span><span class="num">${escapeHtml(parsed.digits)}</span><span class="suf">${parsed.suffix ? ` ${escapeHtml(parsed.suffix)}` : ""}</span></p>`
        : `<p class="figure"><span class="num">${escapeHtml(frame.figure)}</span></p>`
      : "";
    const label = frame.label ? `<p class="label">${escapeHtml(frame.label)}</p>` : "";
    return `<section class="scene" data-i="${index}">${figure}${label}<p class="beat">${words(frame.body)}</p></section>`;
  }
  return `<section class="scene" data-i="${index}">${head}</section>`;
}

export function renderReelMotion(manifest: ReelManifest, assets: RenderAssets): string {
  const hold = (manifest.holdSeconds ?? HOLD_SECONDS) * 1000;
  const total = manifest.frames.length;
  const duration = hold * total;

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
${reelFontFaces(assets)}
${reelThemeCss()}
*{box-sizing:border-box}
html,body{margin:0;width:${REEL_WIDTH}px;height:${REEL_HEIGHT}px;overflow:hidden}
body{font-family:"Noto Sans",Arial,sans-serif;background:var(--bg);color:var(--fg);-webkit-font-smoothing:antialiased}
.stage{position:relative;width:${REEL_WIDTH}px;height:${REEL_HEIGHT}px;overflow:hidden;isolation:isolate}

/* Atmosphere. The grid and the disc drift for the whole run rather than per frame, so the
   reel feels like one continuous shot with things happening in it. */
.grid{position:absolute;inset:-40px;z-index:0;background-image:linear-gradient(rgba(218,240,230,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(218,240,230,.05) 1px,transparent 1px);background-size:90px 90px}
.disc{position:absolute;z-index:0;width:760px;height:760px;border-radius:50%;background:var(--accent);opacity:.14;right:-190px;top:-150px;filter:blur(2px)}
.grain{position:absolute;inset:0;z-index:5;pointer-events:none;opacity:.055;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/></filter><rect width='180' height='180' filter='url(%23n)' opacity='.5'/></svg>")}

.top{position:absolute;z-index:3;left:96px;top:${'88'}px;display:flex;align-items:center;gap:20px}
.top img{width:64px;height:64px;object-fit:contain}
.top span{font-size:30px;font-weight:900;letter-spacing:.18em}

.scenes{position:absolute;z-index:2;left:96px;right:96px;top:0;bottom:0;display:grid;place-items:start}
.scene{grid-area:1/1;width:100%;align-self:center;will-change:transform,opacity}

.kicker{font-size:30px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin:0 0 32px}
h1.hook{font-family:"Fraunces",Georgia,serif;font-size:78px;line-height:1.06;letter-spacing:-.025em;font-weight:900;margin:0;max-width:920px}
.figure{font-family:"Fraunces",Georgia,serif;font-size:132px;line-height:.9;letter-spacing:-.045em;font-weight:900;color:var(--accent);margin:0 0 14px;display:flex;align-items:baseline;gap:.12em}
.figure .suf{font-size:.52em;letter-spacing:-.02em}
.label{font-size:32px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;opacity:.82;margin:0 0 34px}
.beat{font-size:46px;line-height:1.34;font-weight:650;margin:0;max-width:920px}
h1.payoff{font-family:"Fraunces",Georgia,serif;font-size:60px;line-height:1.1;letter-spacing:-.02em;font-weight:900;margin:0 0 30px;max-width:920px}
.action{font-size:44px;line-height:1.32;font-weight:750;color:var(--accent);margin:0;max-width:920px;border-top:5px solid var(--accent);padding-top:28px}

/* Every revealed unit starts hidden. Without this the first captured frame shows the
   whole page before any animation has had a chance to hide it. */
.w,.c{display:inline-block;opacity:0;will-change:transform,opacity}
.kicker,.label,.figure{opacity:0}
.action{opacity:0}

.bar{position:absolute;z-index:3;left:96px;right:96px;bottom:${'120'}px;height:6px;background:rgba(238,234,225,.18);border-radius:99px;overflow:hidden}
.bar i{display:block;height:100%;width:100%;background:var(--accent);transform-origin:left center;transform:scaleX(0)}
.foot{position:absolute;z-index:3;left:96px;right:96px;bottom:${'150'}px;display:flex;justify-content:space-between;font-size:26px;font-weight:750;opacity:.86}
</style></head><body>
<div class="stage">
  <div class="grid"></div><div class="disc"></div>
  <header class="top"><img src="${assets.logoDataUrl}" alt=""><span>FINKAVO</span></header>
  <div class="scenes theme-${manifest.visualStyle}">${manifest.frames.map(frameMarkup).join("")}</div>
  <footer class="foot"><span>${escapeHtml(manifest.sourceLabel)}</span><span class="count">1/${total}</span></footer>
  <div class="bar"><i></i></div>
  <div class="grain"></div>
</div>
<script>
(function(){
  var HOLD = ${hold};
  var TOTAL = ${total};
  var DURATION = ${duration};
  var EASE_OUT = "cubic-bezier(.16,1,.3,1)";
  var scenes = [].slice.call(document.querySelectorAll(".scene"));
  var counters = [];

  function at(el, keyframes, delay, dur, easing){
    return el.animate(keyframes, { delay: delay, duration: dur, easing: easing || EASE_OUT, fill: "both" });
  }

  // The whole run: the grid creeps, the disc wanders. Slow enough to be felt rather than
  // watched, which is what stops four static frames feeling like four static frames.
  at(document.querySelector(".grid"), [{transform:"translate3d(0,0,0)"},{transform:"translate3d(-46px,-30px,0)"}], 0, DURATION, "linear");
  at(document.querySelector(".disc"), [{transform:"translate3d(0,0,0) scale(1)"},{transform:"translate3d(-120px,150px,0) scale(1.16)"}], 0, DURATION, "linear");
  // One continuous bar across the whole reel: the cheapest signal that this is short and
  // worth staying for.
  at(document.querySelector(".bar i"), [{transform:"scaleX(0)"},{transform:"scaleX(1)"}], 0, DURATION, "linear");

  scenes.forEach(function(scene, i){
    var start = i * HOLD;
    var isLast = i === TOTAL - 1;

    // Scenes cross over rather than cut: the outgoing one lifts and dissolves while the
    // next rises into its place.
    at(scene, [{opacity:0},{opacity:1}], start, 340);
    at(scene, [{transform:"translate3d(0,54px,0)"},{transform:"translate3d(0,0,0)"}], start, 620);
    if (!isLast) {
      at(scene, [{opacity:1},{opacity:0}], start + HOLD - 340, 340, "cubic-bezier(.4,0,1,1)");
      at(scene, [{transform:"translate3d(0,0,0)"},{transform:"translate3d(0,-46px,0)"}], start + HOLD - 340, 340, "cubic-bezier(.4,0,1,1)");
    }

    var kicker = scene.querySelector(".kicker");
    if (kicker) {
      at(kicker, [{opacity:0},{opacity:1}], start + 60, 260);
      at(kicker, [{clipPath:"inset(0 100% 0 0)"},{clipPath:"inset(0 0 0 0)"}], start + 60, 520);
    }

    // The opening line types. It is the one frame a viewer decides on, so it earns the
    // most conspicuous treatment in the reel.
    var typed = scene.querySelectorAll(".c");
    if (typed.length) {
      // Typing occupies a little over half the frame, whatever the line's length, so a
      // short hook does not finish in a blink and a long one does not still be typing
      // when the frame leaves.
      var typeWindow = HOLD * 0.56;
      var perChar = Math.min(30, Math.max(11, typeWindow / typed.length));
      [].forEach.call(typed, function(c, n){
        at(c, [{opacity:0},{opacity:1}], start + 240 + n * perChar, 90);
      });
    }

    var figure = scene.querySelector(".figure");
    if (figure) {
      at(figure, [{opacity:0},{opacity:1}], start + 90, 220);
      at(figure, [{transform:"translate3d(0,26px,0) scale(.92)"},{transform:"translate3d(0,0,0) scale(1)"}], start + 90, 820);
      var target = figure.getAttribute("data-count");
      if (target !== null) {
        // Slow enough to watch the number climb. Counting to forty in six-tenths of a
        // second only registers as a flicker.
        counters.push({ el: figure.querySelector(".num"), to: Number(target),
                        digits: figure.getAttribute("data-digits") || "", from: start + 140, dur: 900 });
      }
    }

    var label = scene.querySelector(".label");
    if (label) {
      at(label, [{opacity:0},{opacity:.82}], start + 260, 240);
      at(label, [{clipPath:"inset(0 100% 0 0)"},{clipPath:"inset(0 0 0 0)"}], start + 260, 460);
    }

    // Body copy arrives a word at a time. With a frame now carrying a paragraph, a single
    // fade would drop forty words on screen at once; staggering gives the eye a path
    // through it and makes the pause feel like reading rather than waiting.
    var ws = scene.querySelectorAll(".w");
    var lead = scene.querySelector(".figure") ? 520 : 300;
    // The reveal is timed to finish at about seventy per cent of the frame, whatever the
    // word count, which leaves the last stretch of the hold with the copy sitting still.
    // That pause is what someone catches; a reveal that runs right up to the exit reads
    // as motion rather than as text. Bounded so a very long frame does not become a
    // flicker and a very short one does not crawl.
    var revealWindow = Math.max(300, HOLD * 0.70 - lead);
    var perWord = Math.min(85, Math.max(34, revealWindow / Math.max(1, ws.length)));
    [].forEach.call(ws, function(w, n){
      at(w, [{opacity:0},{opacity:1}], start + lead + n * perWord, 300);
      at(w, [{transform:"translate3d(0,18px,0)"},{transform:"translate3d(0,0,0)"}], start + lead + n * perWord, 520);
    });

    var action = scene.querySelector(".action");
    if (action) at(action, [{opacity:0},{opacity:1}], start + 620, 380);
  });

  var countEl = document.querySelector(".count");
  var animations = document.getAnimations();
  animations.forEach(function(a){ a.pause(); });

  function pad(value, digits){
    var text = String(Math.round(value));
    // "07" stays "07" while it counts, so the figure does not change width mid-run.
    while (digits && text.length < digits.replace(/[^0-9]/g, "").length && digits[0] === "0") text = "0" + text;
    return text;
  }

  window.__seek = function(ms){
    var t = Math.max(0, Math.min(DURATION, ms));
    animations.forEach(function(a){ a.currentTime = t; });
    counters.forEach(function(c){
      var p = Math.max(0, Math.min(1, (t - c.from) / c.dur));
      // Eased so the number decelerates into its final value instead of stopping dead.
      var eased = 1 - Math.pow(1 - p, 3);
      c.el.textContent = pad(c.to * eased, c.digits);
    });
    var index = Math.min(TOTAL, Math.floor(t / HOLD) + 1);
    countEl.textContent = index + "/" + TOTAL;
    return true;
  };
  window.__duration = DURATION;
  window.__seek(0);
})();
</script></body></html>`;
}
