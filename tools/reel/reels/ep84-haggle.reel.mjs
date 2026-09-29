// EP.84 "Haggling in Portugal" — reverse haggling at the Lisbon flea market. Zoe: "How much for this tile?" The old seller: "Fifty
// euros." "Perfect! Here you go!" He is heartbroken: "No, no, no! You must FIGHT! Say twenty!" "…Twenty?" "Forty-five! Now you say 'I'm
// leaving'!" "Okay… I'm leaving?" He runs after her: "Thirty! And a rooster! And a chair!" She staggers off under half his stall while he
// wipes a proud tear and hands her change: "Now… you are Portuguese." Zoe: "…I just wanted one tile."
export const meta = {
  id: "ep84-haggle", date: "2026-12-16",
  images: {
    bg: "characters/scenes/bg_feira.webp", zt: "characters/cutouts/zoe_think.webp", zc: "characters/cutouts/zoe_cash.webp", zl: "characters/cutouts/zoe_loaded.webp",
    st: "characters/cutouts/seller_tile.webp", so: "characters/cutouts/seller_offended.webp", sc: "characters/cutouts/seller_chase.webp", sp: "characters/cutouts/seller_proud.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 57, seed: 841, prog: [[0, 4, 7], [5, 9, 12], [2, 5, 9], [7, 11, 14]] });
  const DUR = 21.3, HOW = .2, FIFTY = 1.72, PERF = 2.72, FIGHT = 4.3, TW = 7.96, F45 = 8.8, LEAVE = 11.4, THIRTY = 14.0, PROUD = 16.8, TILE = 18.9;
  const S = E.scene("haggle", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3, flip = false) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); const inner = E.el(el, "abs", `left:0;top:0;width:${w * s}px;height:${h * s}px;${flip ? "transform:scaleX(-1)" : ""}`); E.img(inner, n, `width:${w * s}px;height:${h * s}px`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  // Zoe (left)
  const ZS = .8;
  const z1 = fig("zt", 417, 995, ZS, 40, 1900), z2 = fig("zc", 556, 1001, ZS, 30, 1900), z3 = fig("zt", 417, 995, ZS, 40, 1900, 3, true), z4 = fig("zl", 547, 979, ZS, 10, 1900, 4);
  show(z1, [[0, PERF], [TW, LEAVE]]); show(z2, [[PERF, TW]]); show(z3, [[LEAVE, PROUD]]); show(z4, [[PROUD, DUR]]);
  const zb = []; for (let t = 0; t < PERF; t += .7) zb.push([t, 0, "io"], [t + .35, -6, "io"]); E.K(z1, "y", zb);          // frame-0 motion
  E.K(z3, "x", [[LEAVE + .3, 0], [THIRTY, -200, "io"]]);
  const wob = []; for (let t = PROUD; t < DUR; t += .4) wob.push([t, -3, "io"], [t + .2, 3, "io"]); E.K(z4, "r", wob);
  // the seller (right)
  const SS = .8;
  const s1 = fig("st", 405, 991, SS, 720, 1900), s2 = fig("so", 548, 989, SS, 640, 1900), s3 = fig("sc", 643, 886, SS, 620, 1900, 5), s4 = fig("sp", 499, 978, SS, 680, 1900);
  show(s1, [[0, FIGHT], [F45, THIRTY]]); show(s2, [[FIGHT, F45]]); show(s3, [[THIRTY, PROUD]]); show(s4, [[PROUD, DUR]]);
  E.K(s2, "r", [[FIGHT, 0], [FIGHT + .2, -6, "out"], [FIGHT + .6, 0, "io"]]);
  E.K(s3, "x", [[THIRTY, 300], [THIRTY + .8, -140, "out"]]);
  const bob = []; for (let t = THIRTY; t < PROUD; t += .2) bob.push([t, 0], [t + .1, -16]); E.K(s3, "y", bob);
  // a price tag that keeps changing, pinned to the stall
  const tag = E.el(S.el, "abs", "left:410px;top:1080px;width:260px;height:120px;background:#fffdf3;border:6px solid #1d2b36;border-radius:12px;transform:rotate(-5deg);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:64px;color:#1d2b36;z-index:2", "");
  const PRICES = [[0, "€50"], [PERF, "€50 ✔"], [FIGHT, "€50 ✘"], [TW, "€20?"], [F45, "€45"], [THIRTY, "€30+🐓+🪑"], [PROUD, "−€5"]];
  E.F(t => { const s = at(PRICES, t); if (tag.textContent !== s) tag.textContent = s; tag.style.fontSize = s.length > 5 ? "44px" : "64px"; tag.style.color = t >= PROUD ? "#1f7a3a" : t >= FIGHT && t < TW ? "#d6333a" : "#1d2b36"; });
  PRICES.slice(1).forEach(([t]) => E.K(tag, "s", [[t - .01, 1], [t, 1.2], [t + .25, 1, "out"]]));
  // the coin he hands back
  const coin = E.el(S.el, "abs", "left:600px;top:1330px;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#ffe58a,#d9a520);border:4px solid #a67c00;z-index:6;opacity:0");
  show(coin, [[PROUD + .4, DUR]]); E.K(coin, "x", [[PROUD + .4, 60], [PROUD + .9, -180, "out"]]); E.K(coin, "y", [[PROUD + .4, 0], [PROUD + .65, -60, "out"], [PROUD + .9, 0, "in"]]);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "FEIRA DA LADRA · SATURDAY"], [FIGHT, "HAGGLING LESSON 1"], [F45, "HAGGLING LESSON 2"], [THIRTY, "HAGGLING LESSON 3"], [PROUD, "PAID: €45 · GOT: HALF THE STALL"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= FIGHT ? C.coralD : C.ink; pill.style.fontSize = s.length > 26 ? "40px" : "50px"; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const Z = (h, t0, t1, fs = 48, w = 460) => bubble(h, 30, 880, w, 170, t0, t1, fs);
  const V = (h, t0, t1, fs = 46, w = 560) => bubble(h, 1050 - w, 880, w, w - 200, t0, t1, fs);
  Z("How much for this tile?", HOW, FIFTY - .05);
  V("Fifty euros.", FIFTY, PERF - .05, 52, 380);
  Z("Perfect! Here you go!", PERF, FIGHT - .05);
  V("No, no, no! You must FIGHT! Say “twenty”!", FIGHT, TW - .05, 44, 620);
  Z("…Twenty?", TW, F45 - .05, 56, 320);
  V("Forty-five! Now you say “I'm leaving”!", F45, LEAVE - .05, 44, 620);
  Z("Okay… I'm leaving?", LEAVE, THIRTY - .05, 48, 440);
  V("Thirty! And a rooster! And a chair!", THIRTY, PROUD - .05, 46, 600);
  V("Now… you are Portuguese.", PROUD, TILE - .05, 48, 520);
  Z("…I just wanted one tile.", TILE, DUR - .4, 48, 520);
  const sb = E.el(S.el, "abs", "left:60px;top:560px;width:960px;display:flex;justify-content:center;z-index:11");
  const stp = E.stamp(sb, "HAGGLED.", TILE + .7, { size: 120, rot: -6, bg: C.coralD, shake: 10 }); stp.style.alignSelf = "center"; E.until(stp, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/street-sunny.wav", { vol: 1.0, duck: false, to: DUR });
  E.clip(HOW, "voices/ep84/z_how.wav", { vol: 1.2 });
  E.clip(FIFTY, "voices/ep84/s_fifty.wav", { vol: 1.35 });
  E.clip(PERF, "voices/ep84/z_perfect.wav", { vol: 1.2 }); E.clip(PERF + .5, "sfx/cash-register.wav", { vol: .6 });
  E.S(FIGHT - .1, "scratch", .6); E.clip(FIGHT, "voices/ep84/s_fight.wav", { vol: 1.35 });
  E.clip(TW, "voices/ep84/z_twenty.wav", { vol: 1.2 });
  E.clip(F45, "voices/ep84/s_45.wav", { vol: 1.35 });
  E.clip(LEAVE, "voices/ep84/z_leaving.wav", { vol: 1.2 });
  E.S(THIRTY - .1, "whoosh", .6); E.clip(THIRTY, "voices/ep84/s_thirty.wav", { vol: 1.35 });
  E.clip(PROUD, "voices/ep84/s_proud.wav", { vol: 1.35 }); E.S(PROUD + .5, "ding", .5);
  E.clip(TILE, "voices/ep84/z_tile.wav", { vol: 1.2 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Haggling in *Portugal*", { size: 58, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[20.5, 1], [20.75, 1.18, "out"], [21.1, 1, "io"]]);
}
