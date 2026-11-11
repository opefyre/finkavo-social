// STYLE SAMPLE 2 (not for posting): paper-cut stop-motion. Same fact and audio as EP140 (CIRS art. 10.º: crypto held 365+ days,
// gain excluded; sooner, 28%). Paper elements: Higgsfield, transparent (branding/characters/papercut). After render, step to 12 fps:
//   ffmpeg -i reel.mp4 -vf "fps=12,fps=30" -c:a copy out.mp4
export const meta = {
  id: "sample-papercut", date: "2026-11-11",
  images: { bg: "characters/papercut/bg_lisbon.webp", cal: "characters/papercut/calendar.webp", coins: "characters/papercut/coins.webp",
    man: "characters/papercut/man.webp", tram: "characters/papercut/tram.webp", stamp: "characters/papercut/stamp.webp" },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 16;
  const D365 = 4.2, ZERO = 6.4, T28 = 8.5, SELL = 10.8, COME = 13.7;
  const S = E.scene("paper", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  // every paper piece sits in a wrapper that jitters a little on each 1/12 s step, like hand-moved stop-motion
  let seed = 1;
  const jit = (P, amt = 3) => {
    const k = seed++; const w = E.el(P, "abs", "inset:0;pointer-events:none");
    E.F(t => { const s = Math.floor(t * 12) + k * 97; const r = x => (Math.sin(x * 12.9898) * 43758.5453) % 1;
      w.style.transform = `translate(${r(s) * amt}px,${r(s + 3) * amt}px) rotate(${r(s + 7) * amt * .15}deg)`; });
    return w;
  };
  const piece = (P, n, w, h, s, cx, bottom, z = 3) => {
    const J = jit(P); J.style.zIndex = z;
    const el = E.el(J, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;transform-origin:50% 100%;filter:drop-shadow(0 14px 10px rgba(40,20,0,.45))`);
    E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el;
  };
  const strip = (P, html, top, size, bg = "#f4ecd8", col = "#2b1d12", rot = -2, z = 10) => {
    const J = jit(P, 2); J.style.zIndex = z;
    return E.el(J, "abs", `left:60px;top:${top}px;width:960px;text-align:center`, `<span style="display:inline-block;background:${bg};color:${col};padding:14px 34px;font-weight:900;font-size:${size}px;line-height:1.1;transform:rotate(${rot}deg);box-shadow:0 10px 14px rgba(40,20,0,.4);clip-path:polygon(0 4%,3% 0,20% 3%,45% 0,70% 4%,97% 0,100% 6%,99% 50%,100% 95%,96% 100%,70% 97%,40% 100%,15% 96%,2% 100%,0 90%,1% 50%)">${html}</span>`);
  };
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. hook on the paper Lisbon street (0 – 4.1) ============
  const A = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(A, [[0, D365 - .1]]); E.img(A, "bg", COVER);
  const tram = piece(A, "tram", 1024, 688, .62, 540, 1560, 4); E.K(tram, "x", [[0, 700], [D365, -500, "lin"]]);
  const coins = piece(A, "coins", 1024, 1024, .42, 310, 1830, 6); E.K(coins, "s", [[.3, 0], [.6, 1.15, "out"], [.8, 1, "io"]]);
  const man = piece(A, "man", 688, 1024, .95, 760, 1880, 5); E.K(man, "y", [[0, 300], [.4, 0, "out"]]);
  const hookWords = [["Sell", .2, 1], ["crypto", .4], ["in", .8], ["Portugal", .9], ["after", 1.5], ["a", 1.7], ["year?", 1.8, 1], ["Tax:", 2.5], ["€0", 3.1, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:200px;width:1000px;text-align:center;z-index:11;line-height:1.25"); show(H, [[0, D365 - .1]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:6px 8px;padding:4px 18px;background:${key ? "#ffd640" : "#f4ecd8"};color:#2b1d12;font-weight:900;font-size:92px;box-shadow:0 8px 10px rgba(40,20,0,.4);transform:rotate(${(w.length % 3 - 1) * 2}deg)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.1, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  // ============ 2. the paper calendar counts (4.2 – 10.7) ============
  const B = E.el(S.el, "abs", "inset:0;overflow:hidden;background:#c9a57a"); show(B, [[D365 - .1, SELL]]);
  const kraft = E.el(B, "abs", "inset:0;opacity:.35"); E.img(kraft, "bg", COVER + ";filter:blur(18px) saturate(.4)");
  const cal = piece(B, "cal", 1024, 1024, .95, 540, 1250, 4); E.K(cal, "y", [[D365, 900], [D365 + .35, 0, "out"]]);
  const num = E.el(B, "abs", "left:300px;top:640px;width:500px;text-align:center;font-family:Georgia,serif;font-weight:900;font-size:210px;color:#2b1d12;z-index:5;transform:rotate(-3deg)", "1");
  E.K(num, "y", [[D365, 900], [D365 + .35, 0, "out"]]);
  E.F(t => { const u = Math.max(0, Math.min(1, (t - D365 - .2) / 1.8)); const d = t >= SELL ? 364 : Math.round(1 + 364 * u * u); if (num.dataset.d != d) { num.dataset.d = d; num.textContent = d; } });
  const zero = strip(B, "TAX €0", 1290, 130, "#7dd88a", "#123b1c", -4); show(zero, [[ZERO, T28]]); E.pop(zero, ZERO, { from: 2, dur: .2 });
  const st = piece(B, "stamp", 1024, 1024, .6, 540, 1620, 7); show(st, [[T28, SELL]]); E.K(st, "s", [[T28, 2.4], [T28 + .18, 1, "in"], [T28 + .3, 1.06, "out"], [T28 + .45, 1, "io"]]);
  const s28 = E.el(B, "abs", "left:340px;top:1225px;width:400px;text-align:center;font-weight:900;font-size:150px;color:#b3261e;z-index:8;transform:rotate(-8deg)", "28%");
  show(s28, [[T28, SELL]]); E.K(s28, "s", [[T28, 2.4], [T28 + .18, 1, "in"]]);
  E.F(t => { B.style.background = t < T28 ? "#c9a57a" : "#d9b8a0"; });
  B.style.transformOrigin = "50% 45%"; E.K(B, "s", [[D365, 1.08], [D365 + .4, 1, "out"], [ZERO - .05, 1.03, "lin"], [ZERO, 1.1, "out"], [T28 - .05, 1.12, "lin"], [T28, 1.0, "out"], [SELL, 1.05, "lin"]]);

  // ============ 3. day 364: he sells (10.8 – end) ============
  const C = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(C, [[SELL, DUR]]); E.img(C, "bg", COVER);
  const man2 = piece(C, "man", 688, 1024, 1.15, 420, 1900, 5); E.K(man2, "r", [[COME, 0], [COME + .3, -12, "out"]]);
  const cal2 = piece(C, "cal", 1024, 1024, .45, 800, 820, 6); E.pop(cal2, SELL + .1, { from: .4, dur: .25 });
  E.el(C, "abs", "left:690px;top:520px;width:220px;text-align:center;font-family:Georgia,serif;font-weight:900;font-size:100px;color:#2b1d12;z-index:7;transform:rotate(-3deg)", "364");
  const st2 = piece(C, "stamp", 1024, 1024, .45, 760, 1330, 8); show(st2, [[COME - .3, DUR]]); E.K(st2, "s", [[COME - .3, 2.6], [COME - .12, 1, "in"]]);
  const s282 = E.el(C, "abs", "left:610px;top:1040px;width:300px;text-align:center;font-weight:900;font-size:112px;color:#b3261e;z-index:9;transform:rotate(-8deg)", "28%");
  show(s282, [[COME - .3, DUR]]); E.K(s282, "s", [[COME - .3, 2.6], [COME - .12, 1, "in"]]);
  E.K(C, "s", [[SELL, 1.06], [SELL + .3, 1, "out"], [COME - .35, 1.02, "lin"], [COME - .1, 1.1, "out"], [DUR, 1.14, "lin"]]); C.style.transformOrigin = "55% 50%";

  // ============ captions (paper strips) ============
  const cap = E.el(S.el, "abs", "left:60px;top:1560px;width:960px;text-align:center;z-index:12", "");
  const CAPS = [[D365, "Hold it 365 days or more,"], [ZERO, "and the gain isn't taxed."], [T28 - .1, ""], [T28, "Sell sooner: 28%."], [SELL - .1, ""],
    [SELL, "\"Day 364. SELL!\""], [COME - .3, ""], [COME, "\"Oh, come ON.\""]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#f4ecd8;color:#2b1d12;padding:12px 28px;font-weight:800;font-size:54px;transform:rotate(-1.5deg);box-shadow:0 8px 10px rgba(40,20,0,.45)">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0, "sfx/tram-pass.wav", { vol: 0.25, to: D365, duck: false });
  E.clip(0.15, "voices/ep140/n_hook10.wav", { vol: 1.2 });
  E.clip(D365, "voices/ep140/n_365.wav", { vol: 1.2 });
  E.clip(D365 + .2, "sfx/fs-clock-tick.wav", { vol: 0.4, to: D365 + 2.1, duck: false });
  E.clip(ZERO, "sfx/elx-chaching.wav", { vol: 0.4, duck: false });
  E.clip(T28, "voices/ep140/n_28.wav", { vol: 1.2 });
  E.clip(T28, "sfx/fs-rubber-stamp.wav", { vol: 0.8, duck: false });
  E.clip(SELL, "voices/ep140/b_sell.wav", { vol: 1.2 });
  E.clip(COME - .2, "sfx/fs-rubber-stamp.wav", { vol: 0.8, duck: false });
  E.clip(COME, "voices/ep140/b_comeon.wav", { vol: 1.2 });
  E.clip(0, "../tools/reel/eps/ep140-cripto/audio/music44.wav", { vol: 0.28, to: DUR });
  E.finish(DUR);
}
