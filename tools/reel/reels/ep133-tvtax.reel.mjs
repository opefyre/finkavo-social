// EP.133 "Why do the Portuguese pay for TV… on their electricity bill?" — a dad squints at the bill (real Kling clip). The bill's
// lines: energy, power, VAT… "Contribuição Audiovisual" (the audiovisual levy). Otto: "But I don't even have a TV!" Narrator: by law
// it is charged on the electricity supply, not on the TV (Lei 30/2003, art. 3), and it all goes to RTP, the public broadcaster
// (art. 6, quoted in Ofício-Circulado 30199/2018). Grandpa: "Pago a televisão e nem a ligo." (I pay for the TV and never switch it on.)
// No amount on screen: the monthly figure was only confirmed in secondary sources. Music: compose.py ep133. Opening 0–4.6 is the clip.
export const meta = {
  id: "ep133-tvtax", date: "2026-11-17",
  images: {
    kitchen: "characters/scenes/bg_kitchen.webp", shrug: "characters/cutouts/otto-casual_shrug.webp",
    grandpa: "characters/cutouts/oldman_seated.webp", tv: "characters/props/gear_tv.webp", coins: "characters/props/coins.webp",
  },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 25.0;
  const BILL = 4.6, OTTO = 11.2, LAW = 13.0, STAMP = 15.2, RTP = 18.6, PAGO = 22.0;
  const S = E.scene("tv", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. the real clip (0 – 4.6) under magenta ============
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff"); show(M, [[0, BILL]]);
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);
  const hookWords = [["Why", .2], ["do", .4], ["the", .5], ["Portuguese", .6], ["pay", 1.3, 1], ["for", 1.5], ["TV…", 1.7, 1], ["on", 2.6], ["their", 2.8], ["electricity", 3.0, 1], ["bill?", 3.6, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:240px;width:1000px;text-align:center;z-index:10;line-height:1.08"); show(H, [[0, BILL]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:96px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  // ============ 2. the bill, line by line (4.6 – 11.2) ============
  const B = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#2c3a55,#111827)"); show(B, [[BILL, OTTO]]);
  const paper = E.el(B, "abs", "left:150px;top:260px;width:780px;height:1000px;background:#fbfaf6;border-radius:8px;box-shadow:0 30px 60px rgba(0,0,0,.5);z-index:3;color:#1d2b36;font-family:Inter,Arial,sans-serif");
  E.el(paper, "abs", "left:50px;top:40px;width:680px;font-size:46px;font-weight:900", "⚡ Electricity bill");
  E.el(paper, "abs", "left:50px;top:105px;width:680px;font-size:26px;color:#7a8794", "Fatura de eletricidade · monthly");
  const rows = [["Energia", "(energy)", 5.5], ["Potência", "(power)", 6.2], ["IVA", "(VAT)", 6.9], ["Contribuição Audiovisual", "(audiovisual levy)", 8.4]];
  rows.forEach(([pt, en, t], i) => {
    const r = E.el(paper, "abs", `left:50px;top:${200 + i * 150}px;width:680px;height:120px;border-bottom:3px dashed #d6dbe0;opacity:0`);
    E.el(r, "abs", "left:0;top:10px;font-size:44px;font-weight:800", pt);
    E.el(r, "abs", "left:0;top:66px;font-size:30px;color:#7a8794", en);
    show(r, [[t, OTTO]]); E.pop(r, t, { from: .85, dur: .2 });
    if (i === 3) { const hl = E.el(r, "abs", "left:-20px;top:0;width:720px;height:118px;border:8px solid #e0533d;border-radius:20px;opacity:0"); show(hl, [[t + .5, OTTO]]); E.pop(hl, t + .5, { from: 1.3, dur: .2 }); }
  });
  E.F(t => { B.style.background = t < 6.2 ? "radial-gradient(circle at 50% 40%,#2c3a55,#111827)" : t < 8.4 ? "radial-gradient(circle at 50% 40%,#fff3c4,#e8b84a)" : "radial-gradient(circle at 50% 40%,#ffe0d6,#e0533d)"; });
  paper.style.transformOrigin = "50% 75%";
  E.K(paper, "s", [[BILL, 1.12], [BILL + .4, 1, "out"], [8.3, 1.03, "lin"], [8.8, 1.2, "out"], [OTTO, 1.22, "lin"]]);
  E.K(paper, "y", [[BILL, 0], [8.3, 0], [8.8, 60, "out"], [OTTO, 60, "lin"]]);

  // ============ 3. Otto (11.2 – 13.0) and the grandpa (22.0 – end) in the kitchen ============
  const K = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(K, [[OTTO, LAW], [PAGO, DUR]]); E.img(K, "kitchen", COVER);
  const ot = fig(K, "shrug", 702, 1055, 1.15, 540, 1880, 5); show(ot, [[OTTO, LAW]]); E.pop(ot, OTTO, { from: .8, dur: .2 });
  const gp = fig(K, "grandpa", 462, 1006, 1.2, 380, 1880, 5); show(gp, [[PAGO, DUR]]); E.pop(gp, PAGO, { from: .85, dur: .2 });
  const tvk = fig(K, "tv", 204, 236, 1.9, 800, 1500, 4); show(tvk, [[PAGO, DUR]]);
  const dust = E.el(K, "abs", "left:620px;top:1010px;width:360px;text-align:center;font-weight:900;font-size:40px;color:#fff;-webkit-text-stroke:2px #141414;z-index:6", "OFF since 1998");
  show(dust, [[PAGO + .8, DUR]]); E.pop(dust, PAGO + .8, { from: .5, dur: .2 });
  E.K(K, "s", [[OTTO, 1], [LAW, 1.06, "lin"], [PAGO, 1.0], [DUR, 1.08, "lin"]]); K.style.transformOrigin = "50% 60%";

  // ============ 4. the law: it's the electricity, not the TV (13.0 – 18.6) ============
  const L = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#3a2f25,#16110c)"); show(L, [[LAW, RTP]]);
  const tvL = fig(L, "tv", 204, 236, 2.6, 300, 900, 3); E.pop(tvL, LAW, { from: .6, dur: .25 });
  const cross = E.el(L, "abs", "left:150px;top:300px;width:300px;height:600px;z-index:4;opacity:0");
  cross.innerHTML = '<svg viewBox="0 0 100 100" width="300" height="600" preserveAspectRatio="none"><path d="M10 10 L90 90 M90 10 L10 90" stroke="#e0533d" stroke-width="10" stroke-linecap="round"/></svg>';
  show(cross, [[LAW + 1.6, RTP]]); E.pop(cross, LAW + 1.6, { from: 1.6, dur: .18 });
  const bolt = E.el(L, "abs", "left:640px;top:330px;width:260px;height:520px;z-index:3;opacity:0");
  bolt.innerHTML = '<svg viewBox="0 0 60 120" width="260" height="520"><path d="M36 0 L6 66 H28 L20 120 L56 46 H34 Z" fill="#ffd640" stroke="#141414" stroke-width="3"/></svg>';
  show(bolt, [[LAW + 2.4, RTP]]); E.pop(bolt, LAW + 2.4, { from: .4, dur: .25 });
  const st = E.el(L, "abs", "left:110px;top:960px;width:860px;padding:18px 0;border:12px solid #c62828;border-radius:24px;color:#c62828;font-weight:900;font-size:60px;text-align:center;line-height:1.1;transform:rotate(-6deg);z-index:6;background:rgba(255,255,255,.88);opacity:0", "ON THE ELECTRICITY<br>NOT THE TV");
  show(st, [[STAMP, RTP]]); E.pop(st, STAMP, { from: 2.2, dur: .16 });
  const fine = E.el(L, "abs", "left:140px;top:1240px;width:800px;text-align:center;font-weight:700;font-size:30px;color:#e9dcc8;z-index:5", "Lei 30/2003, art. 3: charged on the electricity supply");
  show(fine, [[STAMP + .8, RTP]]);
  E.F(t => { L.style.background = t < STAMP ? "radial-gradient(circle at 50% 40%,#3a2f25,#16110c)" : t < 16.9 ? "radial-gradient(circle at 50% 40%,#fff3c4,#e8b84a)" : "radial-gradient(circle at 50% 40%,#f1d8c8,#c98f73)"; });
  E.K(L, "x", [[16.9, 0], [17.1, -60, "out"], [RTP, -70, "lin"]]);
  L.style.transformOrigin = "50% 45%"; E.K(L, "s", [[LAW, 1.1], [LAW + .4, 1, "out"], [STAMP, 1.02, "lin"], [STAMP + .08, .97, "in"], [STAMP + .25, 1, "out"], [RTP, 1.05, "lin"]]);

  // ============ 5. the money goes to RTP (18.6 – 22.0) ============
  const R = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#22324d,#0f1726)"); show(R, [[RTP, PAGO]]);
  const plug = E.el(R, "abs", "left:110px;top:560px;width:240px;height:240px;border-radius:50%;background:#ffd640;z-index:3;text-align:center;line-height:240px;font-size:130px", "⚡");
  const box = E.el(R, "abs", "left:640px;top:520px;width:330px;height:320px;border-radius:28px;background:#2563eb;color:#fff;z-index:3;text-align:center;font-weight:900;font-size:86px;line-height:1.05;padding-top:70px;box-sizing:border-box", "RTP<br><span style='font-size:30px;font-weight:700'>public broadcaster</span>");
  E.pop(plug, RTP, { from: .5, dur: .2 }); E.pop(box, RTP + .3, { from: .5, dur: .2 });
  for (let i = 0; i < 6; i++) {
    const c = E.el(R, "abs", "left:300px;top:610px;width:110px;height:110px;z-index:4"); E.img(c, "coins", "width:110px;height:110px;object-fit:contain");
    const t0 = RTP + .6 + i * .45; show(c, [[t0, t0 + .6]]);
    E.K(c, "x", [[t0, 0], [t0 + .6, 380, "io"]]); E.K(c, "y", [[t0, 0], [t0 + .3, -160, "out"], [t0 + .6, 0, "in"]]);
  }
  E.F(t => { R.style.background = t < RTP + 1.6 ? "radial-gradient(circle at 50% 40%,#22324d,#0f1726)" : "radial-gradient(circle at 50% 40%,#dbe8ff,#6d9bea)"; });
  R.style.transformOrigin = "50% 45%"; E.K(R, "s", [[RTP, 1], [RTP + 1.55, 1.05, "lin"], [RTP + 1.75, 1.25, "out"], [PAGO, 1.3, "lin"]]);

  // ============ captions ============
  const cap = E.el(S.el, "abs", "left:70px;top:1385px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const CAPS = [[BILL, "Look closer."], [BILL + 1.0, "Energy. Power. VAT."], [8.3, "And… the audiovisual levy."], [10.9, ""],
    [OTTO, "\"But I don't even have a TV!\""], [12.8, ""],
    [LAW, "Doesn't matter."], [LAW + 1.2, "By law, it's charged on your electricity."], [STAMP + 1.4, "Not on your TV."], [18.4, ""],
    [RTP, "And all of it goes to RTP,"], [RTP + 1.6, "the public broadcaster."], [21.8, ""],
    [PAGO, `"Pago a televisão e nem a ligo."${sub("I pay for the TV and never even switch it on.")}`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0.05, "sfx/elx-page-flip.wav", { vol: 0.5, duck: false });
  E.clip(0.15, "voices/ep133/n_why.wav", { vol: 1.2 });
  E.clip(BILL, "sfx/elx-paper-unfold.wav", { vol: 0.5, duck: false });
  E.clip(BILL + .1, "voices/ep133/n_look.wav", { vol: 1.2 });
  E.clip(OTTO, "voices/ep133/o_tv.wav", { vol: 1.2 });
  E.clip(LAW, "voices/ep133/n_law.wav", { vol: 1.2 });
  E.clip(STAMP, "sfx/fs-rubber-stamp.wav", { vol: 0.8, duck: false });
  E.clip(RTP, "voices/ep133/n_rtp.wav", { vol: 1.2 });
  E.clip(RTP + .6, "sfx/elx-chaching.wav", { vol: 0.35, duck: false });
  E.clip(PAGO, "voices/ep133/v_pago.wav", { vol: 1.3 });
  E.clip(0, "../tools/reel/eps/ep133-tvtax/audio/music44.wav", { vol: 0.3, to: DUR });
  E.finish(DUR);
}
