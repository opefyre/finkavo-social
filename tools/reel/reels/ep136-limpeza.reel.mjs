// EP.136 "In Portugal, your weeds are the council's business." — an overgrown plot, a goat chewing (real Kling clip). Fire law:
// clear at least 50 m around your house (DL 124/2006 art. 15 n.º 2 a), still in effect through 2026 per DL 82/2021 art. 79; DL 82/2021
// art. 49 keeps 50 m for forest land). Otto: "Fifty METRES?!" If you don't, the council can do it and charge you (DL 124/2006 art. 15
// n.º 5; DL 82/2021 art. 49 n.º 10, 13). Grandma's plot is spotless: "Eu tenho as cabras há quarenta anos." (I've had the goats for
// 40 years.) No fines or deadlines on screen: the two regimes disagree. Music: compose.py ep136. Opening 0–3.4 is the clip.
export const meta = {
  id: "ep136-limpeza", date: "2026-11-20",
  images: {
    trail: "characters/scenes/bg_trail.webp", relax: "characters/cutouts/otto-beach_sit.webp", shock: "characters/cutouts/otto_shocked.webp",
    dona: "characters/cutouts/dona_knowing.webp", goat: "characters/props/goat.webp",
  },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 17.0;
  const LAW = 3.5, RING = 5.0, FIFTY = 7.8, COUNCIL = 9.2, BILL = 11.6, AVO = 13.0;
  const S = E.scene("weeds", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. the real clip (0 – 3.4) ============
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff"); show(M, [[0, LAW - .1]]);
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);
  const hookWords = [["In", .2], ["Portugal,", .3], ["your", .9], ["weeds", 1.05, 1], ["are", 1.5], ["the", 1.6], ["council's", 1.75, 1], ["business.", 2.3, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:240px;width:1000px;text-align:center;z-index:10;line-height:1.08"); show(H, [[0, LAW - .1]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:100px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  // ============ 2. the 50 m ring, seen from above (3.5 – 7.8) ============
  const D = E.el(S.el, "abs", "inset:0;background:#c9a64a;overflow:hidden"); show(D, [[LAW - .1, FIFTY]]);
  for (let i = 0; i < 70; i++) { const x = (i * 157) % 1080, y = (i * 263) % 1900; E.el(D, "abs", `left:${x}px;top:${y}px;width:${60 + (i % 5) * 20}px;height:${60 + (i % 4) * 20}px;border-radius:50%;background:${i % 3 ? "#7f8f3a" : "#5e6e2a"};opacity:.85`); }
  const ring = E.el(D, "abs", "left:540px;top:820px;width:0;height:0;border-radius:50%;background:rgba(247,236,200,.95);border:10px dashed #e0533d;z-index:3;transform:translate(-50%,-50%)");
  E.F(t => { const u = Math.max(0, Math.min(1, (t - RING) / .9)), r = 760 * (1 - Math.pow(1 - u, 3)); ring.style.width = ring.style.height = r + "px"; });
  const house = E.el(D, "abs", "left:470px;top:750px;width:140px;height:140px;background:#b5462c;border:8px solid #fff;z-index:4", "");
  const lab = E.el(D, "abs", "left:540px;top:820px;width:300px;z-index:5;font-weight:900;font-size:76px;color:#e0533d;-webkit-text-stroke:2px #fff;opacity:0", "50 m");
  show(lab, [[RING + .9, FIFTY]]); E.pop(lab, RING + .9, { from: .5, dur: .2 });
  const ar = E.el(D, "abs", "left:620px;top:812px;width:0;height:12px;background:#e0533d;z-index:5"); E.K(ar, "w", [[RING + .5, 0], [RING + .9, 300, "out"]]);
  const ot = fig(D, "relax", 614, 906, .9, 300, 1880, 6); show(ot, [[LAW - .1, RING]]); E.K(ot, "y", [[LAW, 400], [LAW + .3, 0, "out"]]);
  D.style.transformOrigin = "50% 43%"; E.K(D, "s", [[LAW, 1.2], [LAW + .5, 1, "out"], [RING, 1, "lin"], [RING + .9, .85, "out"], [FIFTY, .82, "lin"]]);
  E.K(D, "r", [[LAW, 0], [FIFTY, 6, "lin"]]);

  // ============ 3. Otto: "Fifty METRES?!" (7.8 – 9.2) ============
  const T = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(T, [[FIFTY, COUNCIL], [AVO, DUR]]); E.img(T, "trail", COVER);
  const os = fig(T, "shock", 751, 1108, 1.15, 540, 1880, 5); show(os, [[FIFTY, COUNCIL]]); E.pop(os, FIFTY, { from: 1.3, dur: .18 });
  E.K(T, "s", [[FIFTY, 1.25], [FIFTY + .25, 1.1, "out"], [COUNCIL, 1.12, "lin"], [AVO, 1], [DUR, 1.08, "lin"]]); T.style.transformOrigin = "50% 50%";

  // ============ 4. the council clears it and sends the bill (9.2 – 13.0) ============
  const C = E.el(S.el, "abs", "inset:0;background:linear-gradient(#bfe0f5 0 45%,#c9a64a 45%);overflow:hidden"); show(C, [[COUNCIL, AVO]]);
  const grass = E.el(C, "abs", "left:0;top:860px;width:1080px;height:700px;background:repeating-linear-gradient(90deg,#7f8f3a 0 18px,#5e6e2a 18px 30px);z-index:2");
  E.F(t => { const u = Math.max(0, Math.min(1, (t - COUNCIL - .2) / 1.9)); grass.style.clipPath = `inset(0 0 0 ${u * 100}%)`; });
  const tractor = E.el(C, "abs", "left:-380px;top:700px;font-size:300px;z-index:4;transform:scaleX(-1)", "🚜"); E.K(tractor, "x", [[COUNCIL, 0], [COUNCIL + 2.2, 1500, "lin"]]);
  const cm = E.el(C, "abs", "left:140px;top:330px;width:800px;text-align:center;font-weight:900;font-size:58px;color:#1d2b36;z-index:5", "CÂMARA MUNICIPAL<br><span style='font-size:34px'>(the town council)</span>");
  E.pop(cm, COUNCIL + .1, { from: .6, dur: .2 });
  const inv = E.el(C, "abs", "left:190px;top:520px;width:700px;height:760px;border-radius:12px;background:#fbfaf6;box-shadow:0 30px 60px rgba(0,0,0,.4);z-index:6;color:#1d2b36;font-weight:800;text-align:left;padding:50px;box-sizing:border-box;font-size:40px;line-height:1.6",
    "<div style='font-size:60px;font-weight:900'>FATURA</div><div style='font-size:30px;color:#7a8794'>(invoice)</div><br>Land clearing ✓<br>Tractor ✓<br>Labour ✓<br><br><div style='font-size:56px;color:#e0533d'>TOTAL: you pay</div>");
  E.K(inv, "y", [[BILL - .1, 1400], [BILL + .25, 0, "out"]]); E.K(inv, "r", [[BILL + .25, 6], [BILL + .45, -3, "out"]]);
  E.F(t => { C.style.background = t < BILL ? "linear-gradient(#bfe0f5 0 45%,#c9a64a 45%)" : "radial-gradient(circle at 50% 40%,#ffe0d6,#e0533d)"; });
  C.style.transformOrigin = "50% 50%"; E.K(C, "s", [[COUNCIL, 1.08], [COUNCIL + .3, 1, "out"], [BILL, 1.02, "lin"], [BILL + .3, 1.05, "out"], [AVO, 1.08, "lin"]]);

  // ============ 5. grandma's spotless plot (13.0 – end) ============
  const dn = fig(T, "dona", 665, 1014, 1.1, 330, 1880, 5); show(dn, [[AVO, DUR]]); E.pop(dn, AVO, { from: .85, dur: .2 });
  const g1 = fig(T, "goat", 1024, 1024, .42, 790, 1840, 6); show(g1, [[AVO + .2, DUR]]); E.K(g1, "x", [[AVO + .2, 500], [AVO + .6, 0, "out"]]);
  const g2 = fig(T, "goat", 1024, 1024, .34, 720, 1600, 4); show(g2, [[AVO + .5, DUR]]); E.K(g2, "x", [[AVO + .5, 600], [AVO + .9, 0, "out"]]);
  [g1, g2].forEach((g, i) => E.K(g, "r", Array.from({ length: 10 }, (_, k) => [AVO + 1 + k * .4 + i * .2, k % 2 ? 3 : -3, "io"])));

  // ============ captions ============
  const cap = E.el(S.el, "abs", "left:70px;top:1385px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const CAPS = [[LAW, "Fire prevention law:"], [LAW + 1.3, "clear the land 50 metres around your house."], [FIFTY - .2, ""],
    [FIFTY, "\"Fifty METRES?!\""], [COUNCIL - .1, ""], [COUNCIL, "Don't, and the council can clear it for you…"], [BILL, "…and send you the bill."], [AVO - .2, ""],
    [AVO, `"Eu tenho as cabras há quarenta anos."${sub("I've had the goats for 40 years.")}`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0, "sfx/cicadas.wav", { vol: 0.3, to: LAW, duck: false });
  E.clip(0.15, "voices/ep136/n_hook6.wav", { vol: 1.2 });
  E.clip(LAW, "voices/ep136/n_fifty.wav", { vol: 1.2 });
  E.clip(FIFTY, "voices/ep136/o_fifty.wav", { vol: 1.2 });
  E.clip(COUNCIL, "sfx/cement-mixer.wav", { vol: 0.25, to: BILL, duck: false });
  E.clip(COUNCIL, "voices/ep136/n_council.wav", { vol: 1.2 });
  E.clip(BILL, "sfx/elx-envelope-slide.wav", { vol: 0.5, duck: false });
  E.clip(BILL, "voices/ep136/n_bill.wav", { vol: 1.2 });
  E.clip(AVO + .2, "voices/ep136/g_cabras.wav", { vol: 1.3 });
  E.clip(0, "../tools/reel/eps/ep136-limpeza/audio/music44.wav", { vol: 0.3, to: DUR });
  E.finish(DUR);
}
