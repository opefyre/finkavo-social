// EP.134 "Found €50 in Portugal. Can you keep it?" — a hand hovers over a €50 note on wet calçada (real Kling clip). Otto: "Finders
// keepers, right?" Narrator: keeping it is a crime, up to a year in prison (Código Penal art. 209 n.º 2: up to 1 year or a fine of up
// to 120 days, on complaint). Hand it in to the police (Portaria 1513/2007: PSP/GNR). Clerk: "Volte daqui a um ano." (Come back in a
// year.) If nobody claims it within a year of the announcement, it's yours; no reward (Código Civil art. 1323 n.º 4 and 5).
// Otto, a year later: "One coffee… and one pastel de nata, please." Music: compose.py ep134. Opening 0–3.0 is the clip.
export const meta = {
  id: "ep134-achado", date: "2026-11-18",
  images: {
    street: "characters/scenes/bg_street.webp", grab: "characters/cutouts/otto-casual_grab.webp", station: "characters/scenes/bg_esquadra.webp",
    officer: "characters/cutouts/officer_arms.webp", coin: "characters/cutouts/otto-casual_coin.webp", padaria: "characters/scenes/bg_padaria.webp",
    stubble: "characters/cutouts/otto-casual_stubble.webp", nata: "characters/props/pastry-nata.webp",
  },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 24.0;
  const FIND = 3.0, CRIME = 4.4, JAIL = 6.6, HAND = 9.0, VOLTE = 11.9, CAL = 13.3, YEAR = 14.9, NOREW = 17.4, CAFE = 20.0;
  const S = E.scene("found", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. the real clip (0 – 3.0) under magenta ============
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff"); show(M, [[0, FIND]]);
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);
  const hookWords = [["Found", .2], ["€50", .42, 1], ["in", 1.0], ["Portugal.", 1.1], ["Can", 1.8], ["you", 1.95], ["keep", 2.1, 1], ["it?", 2.35, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:240px;width:1000px;text-align:center;z-index:10;line-height:1.08"); show(H, [[0, FIND]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:104px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  // ============ 2. Otto wants it (3.0 – 4.4) ============
  const St = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(St, [[FIND, CRIME]]); E.img(St, "street", COVER);
  const og = fig(St, "grab", 625, 1078, 1.2, 540, 1880, 5); E.pop(og, FIND, { from: .8, dur: .2 });
  St.style.transformOrigin = "50% 40%"; E.K(St, "s", [[FIND, 1.15], [FIND + .3, 1, "out"], [CRIME, 1.05, "lin"]]);

  // ============ 3. it's a crime (4.4 – 9.0) ============
  const C = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#3a2525,#140c0c)"); show(C, [[CRIME, HAND]]);
  const note = E.el(C, "abs", "left:270px;top:430px;width:540px;height:290px;border-radius:18px;background:linear-gradient(135deg,#f4b183,#e48a5a);border:6px solid #8a4b2a;z-index:3;text-align:center;font-weight:900;font-size:150px;line-height:290px;color:#7a3a17", "€50");
  E.pop(note, CRIME, { from: .6, dur: .25 });
  const bars = E.el(C, "abs", "left:200px;top:-900px;width:680px;height:900px;z-index:5");
  bars.innerHTML = '<svg viewBox="0 0 680 900" width="680" height="900">' + [0, 1, 2, 3, 4, 5].map(i => `<rect x="${20 + i * 125}" y="0" width="34" height="900" rx="12" fill="#5b6470" stroke="#2a2f36" stroke-width="4"/>`).join("") + '<rect x="0" y="40" width="680" height="40" rx="10" fill="#4a525c"/><rect x="0" y="820" width="680" height="40" rx="10" fill="#4a525c"/></svg>';
  E.K(bars, "y", [[JAIL - .25, 0], [JAIL, 1040, "in"], [JAIL + .1, 1000, "out"], [JAIL + .2, 1040, "in"]]);
  const yr = E.el(C, "abs", "left:110px;top:1020px;width:860px;padding:14px 0;border:12px solid #c62828;border-radius:24px;color:#c62828;font-weight:900;font-size:64px;text-align:center;line-height:1.1;transform:rotate(-5deg);z-index:6;background:rgba(255,255,255,.9);opacity:0", "CRIME<br><span style='font-size:44px'>up to 1 year in prison</span>");
  show(yr, [[JAIL + .3, HAND]]); E.pop(yr, JAIL + .3, { from: 2.2, dur: .16 });
  const cp = E.el(C, "abs", "left:140px;top:1280px;width:800px;text-align:center;font-weight:700;font-size:30px;color:#e9c8c8;z-index:5", "Código Penal, art. 209 (or a fine)");
  show(cp, [[JAIL + 1.0, HAND]]);
  E.F(t => { C.style.background = t < JAIL ? "radial-gradient(circle at 50% 40%,#3a2525,#140c0c)" : "radial-gradient(circle at 50% 40%,#f6d6d6,#b33a3a)"; });
  C.style.transformOrigin = "50% 40%"; E.K(C, "s", [[CRIME, 1.1], [CRIME + .4, 1, "out"], [JAIL, 1, "lin"], [JAIL + .05, 1.04, "out"], [JAIL + .25, 1, "io"], [HAND, 1.06, "lin"]]);

  // ============ 4. the police counter (9.0 – 13.3) ============
  const P = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(P, [[HAND, CAL]]); E.img(P, "station", COVER);
  const oc = fig(P, "coin", 625, 1078, 1.1, 330, 1880, 5); show(oc, [[HAND, CAL]]); E.K(oc, "x", [[HAND, -500], [HAND + .3, 0, "out"]]);
  const of = fig(P, "officer", 309, 985, 1.35, 800, 1880, 5); E.pop(of, HAND + .5, { from: .85, dur: .2 });
  P.style.transformOrigin = "75% 45%"; E.K(P, "s", [[HAND, 1], [VOLTE - .1, 1.04, "lin"], [VOLTE, 1.45, "out"], [CAL, 1.5, "lin"]]);

  // ============ 5. 365 days later (13.3 – 14.9) ============
  const Cl = E.el(S.el, "abs", "inset:0;background:#f4ecd8"); show(Cl, [[CAL, YEAR]]);
  const cal = E.el(Cl, "abs", "left:240px;top:480px;width:600px;height:640px;border-radius:30px;background:#fff;box-shadow:0 30px 60px rgba(0,0,0,.25);z-index:3;overflow:hidden;text-align:center;font-weight:900;color:#1d2b36");
  E.el(cal, "abs", "left:0;top:0;width:600px;height:150px;background:#e0533d;color:#fff;font-size:70px;line-height:150px", "DAY");
  const num = E.el(cal, "abs", "left:0;top:200px;width:600px;font-size:260px;line-height:1", "1");
  E.F(t => { const u = Math.max(0, Math.min(1, (t - CAL - .1) / 1.2)); const d = Math.round(1 + 364 * u * u); if (num.dataset.d != d) { num.dataset.d = d; num.textContent = d; } });
  E.K(cal, "r", [[CAL, -3], [YEAR, 3, "lin"]]); E.K(cal, "s", [[CAL, .9], [CAL + .3, 1, "out"], [YEAR - .2, 1.02, "lin"], [YEAR, 1.2, "in"]]);

  // ============ 6. nobody claimed it; no reward (14.9 – 20.0) ============
  const Y = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#1f3d2b,#0d1a12)"); show(Y, [[YEAR, CAFE]]);
  const note2 = E.el(Y, "abs", "left:270px;top:380px;width:540px;height:290px;border-radius:18px;background:linear-gradient(135deg,#f4b183,#e48a5a);border:6px solid #8a4b2a;z-index:3;text-align:center;font-weight:900;font-size:150px;line-height:290px;color:#7a3a17", "€50");
  E.pop(note2, YEAR, { from: .5, dur: .25 });
  const yours = E.el(Y, "abs", "left:140px;top:720px;width:800px;text-align:center;font-weight:900;font-size:76px;color:#7dff8a;z-index:4;opacity:0", "✓ IT'S YOURS");
  show(yours, [[YEAR + 2.0, CAFE]]); E.pop(yours, YEAR + 2.0, { from: .5, dur: .2 });
  const rew = E.el(Y, "abs", "left:190px;top:880px;width:700px;text-align:center;font-weight:900;font-size:64px;color:#fff;z-index:4;opacity:0", "Reward: <span style='color:#e0533d'>€0</span>");
  show(rew, [[NOREW, CAFE]]); E.pop(rew, NOREW, { from: 1.8, dur: .16 });
  const cc = E.el(Y, "abs", "left:140px;top:1020px;width:800px;text-align:center;font-weight:700;font-size:30px;color:#c8e9d2;z-index:5", "Código Civil, art. 1323: one year after it's announced");
  show(cc, [[YEAR + 2.4, CAFE]]);
  E.F(t => { Y.style.background = t < YEAR + 2.0 ? "radial-gradient(circle at 50% 40%,#1f3d2b,#0d1a12)" : t < NOREW ? "radial-gradient(circle at 50% 40%,#d9f5df,#4caf6a)" : "radial-gradient(circle at 50% 40%,#2a1414,#120808)"; });
  Y.style.transformOrigin = "50% 35%"; E.K(Y, "s", [[YEAR, 1.1], [YEAR + .4, 1, "out"], [NOREW, 1.03, "lin"], [NOREW + .08, .97, "in"], [NOREW + .25, 1, "out"], [CAFE, 1.05, "lin"]]);

  // ============ 7. a year later, the café (20.0 – end) ============
  const Cf = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(Cf, [[CAFE, DUR]]); E.img(Cf, "padaria", COVER);
  const os = fig(Cf, "stubble", 751, 1108, 1.1, 430, 1880, 5); E.K(os, "x", [[CAFE, -600], [CAFE + .35, 0, "out"]]);
  const nata = fig(Cf, "nata", 300, 300, 1.0, 860, 1560, 6); show(nata, [[CAFE + 2.0, DUR]]); E.pop(nata, CAFE + 2.0, { from: .3, dur: .25 });
  const later = E.el(Cf, "abs", "left:240px;top:330px;width:600px;text-align:center;font-weight:900;font-size:60px;color:#fff;background:#10151f;border-radius:18px;padding:8px 0;z-index:7", "1 year later");
  E.pop(later, CAFE, { from: .6, dur: .2 });
  E.K(Cf, "s", [[CAFE, 1], [DUR, 1.08, "lin"]]); Cf.style.transformOrigin = "50% 60%";

  // ============ captions ============
  const cap = E.el(S.el, "abs", "left:70px;top:1385px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const CAPS = [[FIND, "\"Finders keepers, right?\""], [CRIME, "Not quite."], [CRIME + 1.0, "Keep it, and it's a crime."], [JAIL + .6, "Up to a year in prison."], [8.9, ""],
    [HAND, "The law says: hand it in, to the police."], [11.7, ""],
    [VOLTE, `"Volte daqui a um ano."${sub("Come back in a year.")}`], [CAL, ""],
    [YEAR, "If nobody claims it within a year…"], [YEAR + 2.0, "it's yours."], [NOREW, "No reward. Just the fifty."], [19.8, ""],
    [CAFE, "\"One coffee… and one pastel de nata, please.\""]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0, "sfx/rain-heavy.wav", { vol: 0.25, to: FIND, duck: false });
  E.clip(0.15, "voices/ep134/n_found.wav", { vol: 1.2 });
  E.clip(FIND, "voices/ep134/o_finders.wav", { vol: 1.2 });
  E.clip(CRIME, "voices/ep134/n_crime.wav", { vol: 1.2 });
  E.clip(JAIL, "sfx/shutter-slam.wav", { vol: 0.6, duck: false });
  E.clip(HAND, "voices/ep134/n_hand.wav", { vol: 1.2 });
  E.clip(HAND + .5, "sfx/elx-pub-bell.wav", { vol: 0.35, duck: false });
  E.clip(VOLTE, "voices/ep134/p_volte.wav", { vol: 1.3 });
  E.clip(CAL, "sfx/fs-clock-tick.wav", { vol: 0.6, to: YEAR, duck: false });
  E.clip(YEAR, "voices/ep134/n_year.wav", { vol: 1.2 });
  E.clip(CAFE, "sfx/elx-cup-saucer.wav", { vol: 0.4, duck: false });
  E.clip(CAFE + .2, "voices/ep134/o_coffee.wav", { vol: 1.2 });
  E.clip(0, "../tools/reel/eps/ep134-achado/audio/music44.wav", { vol: 0.3, to: DUR });
  E.finish(DUR);
}
