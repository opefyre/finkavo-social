// EP.140 "Sell crypto in Portugal after a year? Tax: zero." — a thumb hovers over SELL on a tram (real Kling clip). CIRS art. 10.º:
// gains on crypto held 365 days or more are excluded (unless a non-EU/EEA, non-treaty counterparty is involved); under 365 days, 28%
// autonomous rate (art. 72.º n.º 1 c) or optional aggregation; crypto-to-crypto swaps not taxed at the swap. Buck sells on day 364.
// Music: compose.py ep140. Opening 0–4.1 is the clip.
export const meta = {
  id: "ep140-cripto", date: "2026-11-24",
  images: { lisbon: "characters/scenes/bg_lisbon.webp", wired: "characters/cutouts/buck_wired.webp", conf: "characters/cutouts/buck_confused.webp" },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 20.2;
  const D365 = 4.2, T28 = 8.4, SWAP = 10.7, SELL = 14.3, STAMP = 17.0, COME = 17.4;
  const S = E.scene("crypto", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. the real clip (0 – 4.1) ============
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff"); show(M, [[0, D365 - .1]]);
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);
  const hookWords = [["Sell", .2, 1], ["crypto", .4], ["in", .8], ["Portugal", .9], ["after", 1.5], ["a", 1.7], ["year?", 1.8, 1], ["Tax:", 2.5], ["€0", 3.1, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:220px;width:1000px;text-align:center;z-index:10;line-height:1.08"); show(H, [[0, D365 - .1]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:108px;color:${key ? "#7dff8a" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  // ============ 2. the 365-day counter (4.2 – 10.7) ============
  const C = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#13261b,#07110b)"); show(C, [[D365 - .1, SWAP]]);
  const cal = E.el(C, "abs", "left:240px;top:330px;width:600px;height:600px;border-radius:30px;background:#fff;box-shadow:0 30px 60px rgba(0,0,0,.4);z-index:3;overflow:hidden;text-align:center;font-weight:900;color:#1d2b36");
  E.el(cal, "abs", "left:0;top:0;width:600px;height:140px;background:#2a7a3a;color:#fff;font-size:60px;line-height:140px", "DAYS HELD");
  const num = E.el(cal, "abs", "left:0;top:190px;width:600px;font-size:240px;line-height:1", "1");
  E.F(t => { const u = Math.max(0, Math.min(1, (t - D365 - .2) / 1.8)); const d = Math.round(1 + 364 * u * u); if (num.dataset.d != d) { num.dataset.d = d; num.textContent = d; } });
  const zero = E.el(C, "abs", "left:190px;top:1000px;width:700px;padding:20px 0;border-radius:24px;background:#7dff8a;text-align:center;font-weight:900;font-size:110px;color:#07110b;z-index:4;opacity:0", "TAX €0");
  show(zero, [[D365 + 2.2, T28]]); E.pop(zero, D365 + 2.2, { from: 2, dur: .18 });
  const t28 = E.el(C, "abs", "left:140px;top:1000px;width:800px;padding:20px 0;border-radius:24px;background:#e0533d;text-align:center;font-weight:900;font-size:90px;color:#fff;z-index:4;opacity:0;line-height:1.1", "under 365 days<br><span style='font-size:150px'>28%</span>");
  show(t28, [[T28, SWAP]]); E.pop(t28, T28, { from: 2, dur: .18 });
  E.F(t => { C.style.background = t < T28 ? "radial-gradient(circle at 50% 40%,#13261b,#07110b)" : "radial-gradient(circle at 50% 40%,#3f1c1c,#140707)"; });
  E.F(t => { num.textContent = t >= T28 ? "200" : num.textContent; });
  C.style.transformOrigin = "50% 45%"; E.K(C, "s", [[D365, 1.1], [D365 + .4, 1, "out"], [D365 + 2.1, 1.02, "lin"], [D365 + 2.3, 1.1, "out"], [T28 - .1, 1.12, "lin"], [T28, 1.0, "out"], [SWAP, 1.05, "lin"]]);

  // ============ 3. swaps (10.7 – 14.3) ============
  const W = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#22324d,#0f1726)"); show(W, [[SWAP, SELL]]);
  const coin = (x, txt, col) => E.el(W, "abs", `left:${x}px;top:560px;width:300px;height:300px;border-radius:50%;background:${col};border:12px solid #fff3;text-align:center;line-height:300px;font-weight:900;font-size:110px;color:#fff;z-index:3`, txt);
  const ca = coin(110, "A", "#f2a93b"), cb = coin(670, "B", "#5b7cfa");
  E.pop(ca, SWAP, { from: .5, dur: .2 }); E.pop(cb, SWAP + .3, { from: .5, dur: .2 });
  const arr = E.el(W, "abs", "left:430px;top:640px;width:220px;text-align:center;font-size:120px;color:#fff;z-index:4", "⇄");
  E.K(arr, "r", [[SWAP + .5, 0], [SWAP + 1.3, 180, "io"], [SWAP + 2.1, 360, "io"]]);
  const nt = E.el(W, "abs", "left:140px;top:1000px;width:800px;padding:20px 0;border-radius:24px;background:#fbfaf6;text-align:center;font-weight:900;font-size:56px;color:#1d2b36;z-index:5;opacity:0;line-height:1.15", "not taxed at the swap<br><span style='font-size:34px;color:#7a8794'>(the tax waits for the sale)</span>");
  show(nt, [[SWAP + 1.8, SELL]]); E.pop(nt, SWAP + 1.8, { from: 1.8, dur: .18 });
  E.F(t => { W.style.background = t < SWAP + 1.8 ? "radial-gradient(circle at 50% 40%,#22324d,#0f1726)" : "radial-gradient(circle at 50% 40%,#dbe8ff,#6d9bea)"; });
  W.style.transformOrigin = "50% 45%"; E.K(W, "s", [[SWAP, 1.1], [SWAP + .4, 1, "out"], [SELL, 1.06, "lin"]]);

  // ============ 4. Buck sells on day 364 (14.3 – end) ============
  const B = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(B, [[SELL, DUR]]); E.img(B, "lisbon", COVER);
  const bw = fig(B, "wired", 672, 1007, 1.15, 380, 1880, 5); show(bw, [[SELL, COME]]); E.pop(bw, SELL, { from: .8, dur: .2 });
  const bc = fig(B, "conf", 688, 1024, 1.12, 380, 1880, 5); show(bc, [[COME, DUR]]);
  const d364 = E.el(B, "abs", "left:620px;top:420px;width:400px;height:400px;border-radius:26px;background:#fff;box-shadow:0 20px 40px rgba(0,0,0,.35);z-index:6;overflow:hidden;text-align:center;font-weight:900;color:#1d2b36");
  E.el(d364, "abs", "left:0;top:0;width:400px;height:100px;background:#2a7a3a;color:#fff;font-size:44px;line-height:100px", "DAY");
  E.el(d364, "abs", "left:0;top:130px;width:400px;font-size:180px;line-height:1", "364");
  E.pop(d364, SELL + .1, { from: .5, dur: .2 });
  const st = E.el(B, "abs", "left:540px;top:880px;width:500px;padding:10px 0;border:14px solid #c62828;border-radius:24px;color:#c62828;font-weight:900;font-size:120px;text-align:center;transform:rotate(-8deg);z-index:8;background:rgba(255,255,255,.92);opacity:0", "28%");
  show(st, [[STAMP, DUR]]); E.pop(st, STAMP, { from: 2.4, dur: .16 });
  E.K(B, "s", [[SELL, 1.05], [SELL + .3, 1, "out"], [STAMP - .05, 1.02, "lin"], [STAMP, 1.08, "out"], [STAMP + .15, 1.02, "io"], [DUR, 1.1, "lin"]]); B.style.transformOrigin = "60% 45%";

  // ============ captions ============
  const cap = E.el(S.el, "abs", "left:70px;top:1385px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const CAPS = [[D365, "Hold it for 365 days or more,"], [D365 + 2.2, "and the gain isn't taxed."], [T28 - .1, ""], [T28, "Sell sooner: 28%."], [SWAP - .2, ""],
    [SWAP, "Swapping one coin for another?"], [SWAP + 1.8, "Not taxed at the swap."], [SELL - .1, ""],
    [SELL, "\"Day 364. SELL!\""], [STAMP - .1, ""], [COME, "\"Oh, come ON.\""]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0, "sfx/tram-pass.wav", { vol: 0.25, to: D365, duck: false });
  E.clip(0.15, "voices/ep140/n_hook10.wav", { vol: 1.2 });
  E.clip(D365, "voices/ep140/n_365.wav", { vol: 1.2 });
  E.clip(D365 + .2, "sfx/fs-clock-tick.wav", { vol: 0.4, to: D365 + 2.1, duck: false });
  E.clip(D365 + 2.2, "sfx/elx-chaching.wav", { vol: 0.4, duck: false });
  E.clip(T28, "voices/ep140/n_28.wav", { vol: 1.2 });
  E.clip(SWAP, "voices/ep140/n_swap.wav", { vol: 1.2 });
  E.clip(SWAP + .5, "sfx/elx-swirl.wav", { vol: 0.4, duck: false });
  E.clip(SELL, "voices/ep140/b_sell.wav", { vol: 1.2 });
  E.clip(STAMP, "sfx/fs-rubber-stamp.wav", { vol: 0.8, duck: false });
  E.clip(COME, "voices/ep140/b_comeon.wav", { vol: 1.2 });
  E.clip(0, "../tools/reel/eps/ep140-cripto/audio/music44.wav", { vol: 0.28, to: DUR });
  E.finish(DUR);
}
