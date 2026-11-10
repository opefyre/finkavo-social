// EP.139 "Under 35 in Portugal? Your first year of income tax could be zero." — a young woman stares at her payslip in a café
// (real Kling clip). IRS Jovem (CIRS art. 12.º-B): categories A and B, up to 35; exempt 100% in year 1, 75% years 2–4, 50% years 5–7,
// 25% years 8–10 (n.º 5), capped at 55 × IAS = €29,542 in 2026 (IAS €537.13, Portaria 480-A/2025/1). Otto: "Wait. I'm thirty-six."
// Grandma: "Devias ter vindo mais cedo." (You should have come earlier.) Music: compose.py ep139. Opening 0–4.6 is the clip.
export const meta = {
  id: "ep139-irsjovem", date: "2026-11-23",
  images: { kitchen: "characters/scenes/bg_kitchen.webp", shock: "characters/cutouts/otto_shocked.webp", dona: "characters/cutouts/dona_smirk.webp" },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 22.4;
  const JOV = 4.7, Y1 = 6.6, SCALE = 9.7, CAP = 14.5, O36 = 17.6, AVO = 19.6;
  const S = E.scene("jovem", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. the real clip (0 – 4.6) ============
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff"); show(M, [[0, JOV - .1]]);
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);
  const hookWords = [["Under", .2], ["35", .45, 1], ["in", .8], ["Portugal?", .9], ["Year", 2.0], ["one:", 2.2], ["zero", 3.4, 1], ["income", 3.6], ["tax.", 3.85, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:220px;width:1000px;text-align:center;z-index:10;line-height:1.08"); show(H, [[0, JOV - .1]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:104px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  // ============ 2. IRS Jovem, year 1: 100% (4.7 – 9.7) ============
  const J = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#1f3d2b,#0d1a12)"); show(J, [[JOV - .1, SCALE]]);
  const tit = E.el(J, "abs", "left:90px;top:330px;width:900px;text-align:center;font-weight:900;font-size:120px;color:#fff;z-index:3;line-height:1", "IRS JOVEM<br><span style='font-size:40px;color:#c8e9d2'>(the young people's income tax regime)</span>");
  E.pop(tit, JOV, { from: .6, dur: .25 });
  const y1 = E.el(J, "abs", "left:190px;top:700px;width:700px;padding:30px 0;border-radius:30px;background:#7dff8a;text-align:center;font-weight:900;color:#0d1a12;z-index:4;line-height:1;opacity:0", "<span style='font-size:50px'>YEAR 1</span><br><span style='font-size:190px'>100%</span><br><span style='font-size:50px'>EXEMPT</span>");
  show(y1, [[Y1, SCALE]]); E.pop(y1, Y1, { from: 2, dur: .18 });
  E.F(t => { J.style.background = t < Y1 ? "radial-gradient(circle at 50% 40%,#1f3d2b,#0d1a12)" : "radial-gradient(circle at 50% 40%,#f2fff3,#9fe0ae)"; });
  E.F(t => { tit.style.color = t < Y1 ? "#fff" : "#0d1a12"; });
  J.style.transformOrigin = "50% 40%"; E.K(J, "s", [[JOV, 1.1], [JOV + .4, 1, "out"], [Y1 - .1, 1.03, "lin"], [Y1, 1.0, "out"], [SCALE, 1.06, "lin"]]);

  // ============ 3. the staircase: 10 years (9.7 – 14.5) and the cap (14.5 – 17.6) ============
  const C = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#22324d,#0f1726)"); show(C, [[SCALE, O36]]);
  const pct = [100, 75, 75, 75, 50, 50, 50, 25, 25, 25];
  pct.forEach((p, i) => {
    const t0 = SCALE + .25 + i * .3;
    const bar = E.el(C, "abs", `left:${90 + i * 92}px;top:${1150 - p * 6}px;width:76px;height:${p * 6}px;border-radius:12px 12px 0 0;background:${p === 100 ? "#7dff8a" : p === 75 ? "#b6f0a0" : p === 50 ? "#ffd640" : "#ffb36b"};z-index:3;transform-origin:50% 100%`);
    E.K(bar, "s", [[t0, 0], [t0 + .25, 1, "out"]]);
    E.el(C, "abs", `left:${90 + i * 92}px;top:1170px;width:76px;text-align:center;font-weight:800;font-size:30px;color:#c9d6e8;z-index:3`, `Y${i + 1}`);
    if (i === 0 || i === 1 || i === 4 || i === 7) { const lb = E.el(C, "abs", `left:${70 + i * 92}px;top:${1100 - p * 6}px;width:116px;text-align:center;font-weight:900;font-size:36px;color:#fff;z-index:4;opacity:0`, p + "%"); show(lb, [[t0 + .2, O36]]); }
  });
  const yrs = E.el(C, "abs", "left:140px;top:330px;width:800px;text-align:center;font-weight:900;font-size:64px;color:#fff;z-index:4", "up to 10 years");
  E.pop(yrs, SCALE + .2, { from: .6, dur: .2 });
  const cap = E.el(C, "abs", "left:140px;top:1260px;width:800px;padding:20px 0;border-radius:24px;background:#fbfaf6;text-align:center;font-weight:900;color:#1d2b36;z-index:5;line-height:1.1;opacity:0", "<span style='font-size:36px'>exempt income, max per year</span><br><span style='font-size:96px'>≈ €29,500</span>");
  show(cap, [[CAP, O36]]); E.pop(cap, CAP, { from: 1.8, dur: .18 });
  const law = E.el(C, "abs", "left:140px;top:1520px;width:800px;text-align:center;font-weight:700;font-size:28px;color:#c9d6e8;z-index:5", "Código do IRS, art. 12.º-B · cap 55 × IAS (2026)");
  show(law, [[CAP + .4, O36]]);
  E.F(t => { C.style.background = t < CAP ? "radial-gradient(circle at 50% 40%,#22324d,#0f1726)" : "radial-gradient(circle at 50% 40%,#3a2f55,#16102a)"; });
  C.style.transformOrigin = "50% 60%"; E.K(C, "s", [[SCALE, 1.1], [SCALE + .4, 1, "out"], [12.4, 1.03, "lin"], [12.6, 1.12, "out"], [CAP - .1, 1.13, "lin"], [CAP, .92, "out"], [O36, .95, "lin"]]);
  E.K(C, "y", [[CAP - .1, 0], [CAP, -200, "out"], [O36, -210, "lin"]]);

  // ============ 4. Otto is 36 (17.6 – 19.6) and grandma (19.6 – end) ============
  const K = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(K, [[O36, DUR]]); E.img(K, "kitchen", COVER);
  const os = fig(K, "shock", 751, 1108, 1.1, 360, 1880, 5); show(os, [[O36, DUR]]); E.pop(os, O36, { from: 1.2, dur: .18 });
  const cake = E.el(K, "abs", "left:620px;top:1080px;width:340px;height:220px;border-radius:24px 24px 10px 10px;background:linear-gradient(#ffd1dc 0 30%,#f4ecd8 30%);border:6px solid #7a4b2a;z-index:6;text-align:center;font-weight:900;font-size:120px;line-height:260px;color:#c62828", "36");
  show(cake, [[O36, AVO]]); E.pop(cake, O36 + .2, { from: .3, dur: .25 });
  const fl = E.el(K, "abs", "left:770px;top:1000px;width:36px;height:70px;border-radius:50% 50% 40% 40%;background:#ffb703;z-index:7;box-shadow:0 0 30px #ffd640"); show(fl, [[O36 + .2, AVO]]);
  E.K(fl, "s", Array.from({ length: 8 }, (_, k) => [O36 + .2 + k * .2, k % 2 ? .85 : 1.1, "io"]));
  const dn = fig(K, "dona", 665, 1014, 1.1, 780, 1880, 6); show(dn, [[AVO, DUR]]); E.K(dn, "x", [[AVO, 500], [AVO + .3, 0, "out"]]);
  E.K(K, "s", [[O36, 1.08], [O36 + .3, 1, "out"], [AVO - .1, 1.02, "lin"], [AVO, 1.1, "out"], [DUR, 1.16, "lin"]]); K.style.transformOrigin = "50% 60%";

  // ============ captions ============
  const cap2 = E.el(S.el, "abs", "left:70px;top:1385px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const CAPS = [[JOV, "It's called IRS Jovem."], [Y1, "Year one: 100% exempt."], [SCALE - .2, ""],
    [SCALE, "Then 75, 50, 25%,"], [SCALE + 2.4, "for up to ten years."], [CAP - .1, ""],
    [O36, "\"Wait. I'm thirty-six.\""], [AVO - .1, ""],
    [AVO, `"Devias ter vindo mais cedo."${sub("You should have come earlier.")}`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap2.dataset.s !== s) { cap2.dataset.s = s; cap2.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0, "sfx/elx-cafe.wav", { vol: 0.25, to: JOV, duck: false });
  E.clip(0.15, "voices/ep139/n_hook9.wav", { vol: 1.2 });
  E.clip(JOV, "voices/ep139/n_jovem.wav", { vol: 1.2 });
  E.clip(Y1, "sfx/elx-chaching.wav", { vol: 0.4, duck: false });
  E.clip(SCALE, "voices/ep139/n_scale.wav", { vol: 1.2 });
  E.clip(CAP, "voices/ep139/n_cap.wav", { vol: 1.2 });
  E.clip(CAP, "sfx/fs-rubber-stamp.wav", { vol: 0.5, duck: false });
  E.clip(O36, "voices/ep139/o_36.wav", { vol: 1.25 });
  E.clip(AVO, "voices/ep139/g_cedo.wav", { vol: 1.3 });
  E.clip(0, "../tools/reel/eps/ep139-irsjovem/audio/music44.wav", { vol: 0.28, to: DUR });
  E.finish(DUR);
}
