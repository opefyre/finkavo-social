// EP.138 "Sleeping in your van in Portugal? Careful." — a camper van on a sea cliff at dusk, a torch beam lands on it (real Kling clip).
// Buck: "Whoa, whoa! I'm just sleeping!" Código da Estrada art. 50.º-A (Lei 66/2021): overnighting ("pernoita", occupied, 22:00–07:00)
// by motorhomes is banned in Natura 2000, protected areas and coastal-plan zones except authorised spots (n.º 1, 3 c); fine €120–600
// there, €60–300 otherwise (n.º 4); elsewhere, max 48 hours in the same municipality unless the council rules otherwise (n.º 2).
// Officer at an official site: "Aqui pode." (Here you can.) Music: compose.py ep138. Opening 0–2.8 is the clip.
export const meta = {
  id: "ep138-autocaravana", date: "2026-11-22",
  images: {
    night: "characters/scenes/bg_night.webp", van: "characters/props/van-loaded.webp", buck: "characters/cutouts/buck_startled.webp",
    officer: "characters/cutouts/officer_arms.webp", beach: "characters/scenes/bg_beach2.webp", hola: "characters/cutouts/buck_hola.webp",
  },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 19.6;
  const WAKE = 2.9, BAN = 5.5, CLOCK = 8.2, FINE = 11.1, ELSE = 14.6, AQUI = 17.6;
  const S = E.scene("van", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. the real clip (0 – 2.8) ============
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff"); show(M, [[0, WAKE - .1]]);
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);
  const hookWords = [["Sleeping", .2, 1], ["in", .6], ["your", .7], ["van", .85, 1], ["in", 1.1], ["Portugal?", 1.2], ["Careful.", 1.9, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:240px;width:1000px;text-align:center;z-index:10;line-height:1.08"); show(H, [[0, WAKE - .1]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:104px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  // ============ 2. the knock (2.9 – 5.5) ============
  const N = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(N, [[WAKE - .1, BAN]]); E.img(N, "night", COVER);
  const van = fig(N, "van", 1023, 880, .9, 600, 1700, 3);
  const bk = fig(N, "buck", 536, 947, 1.0, 520, 1880, 5); E.pop(bk, WAKE + .2, { from: .7, dur: .2 });
  const of = fig(N, "officer", 309, 985, 1.25, 880, 1880, 6); E.K(of, "x", [[WAKE, 400], [WAKE + .3, 0, "out"]]);
  const beam = E.el(N, "abs", "left:300px;top:700px;width:800px;height:500px;z-index:7;background:radial-gradient(ellipse at 80% 50%,rgba(255,250,200,.55),rgba(255,250,200,0) 70%)"); show(beam, [[WAKE, BAN]]);
  N.style.transformOrigin = "60% 60%"; E.K(N, "s", [[WAKE, 1.0], [WAKE + .05, 1.04, "out"], [WAKE + .15, 1, "io"], [WAKE + .4, 1.04, "out"], [WAKE + .5, 1, "io"], [BAN, 1.1, "lin"]]);

  // ============ 3. the rule: coast + protected areas, 22:00–07:00 (5.5 – 11.1) ============
  const P = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#1c2a3f,#0b1220)"); show(P, [[BAN, FINE]]);
  const map = E.el(P, "abs", "left:300px;top:250px;width:480px;height:900px;z-index:3");
  map.innerHTML = '<svg viewBox="0 0 240 450" width="480" height="900"><path d="M70 10 L190 20 L200 90 L185 170 L200 250 L190 330 L170 400 L120 440 L60 430 L40 360 L30 280 L45 200 L35 120 L50 50 Z" fill="#3d5a3a" stroke="#cfe3c4" stroke-width="3"/></svg>';
  const coast = E.el(P, "abs", "left:300px;top:250px;width:480px;height:900px;z-index:4;opacity:0");
  coast.innerHTML = '<svg viewBox="0 0 240 450" width="480" height="900"><path d="M70 10 L50 50 L35 120 L45 200 L30 280 L40 360 L60 430 L120 440 L170 400" fill="none" stroke="#e0533d" stroke-width="18" stroke-linejoin="round"/><circle cx="130" cy="110" r="22" fill="#e0533d" opacity=".8"/><circle cx="160" cy="230" r="28" fill="#e0533d" opacity=".8"/><circle cx="110" cy="330" r="20" fill="#e0533d" opacity=".8"/></svg>';
  show(coast, [[BAN + 1.4, FINE]]); E.pop(coast, BAN + 1.4, { from: 1.1, dur: .25 });
  const legend = E.el(P, "abs", "left:120px;top:1180px;width:840px;text-align:center;font-weight:900;font-size:44px;color:#ffb3a6;z-index:5;opacity:0", "🔴 coast · protected nature areas");
  show(legend, [[BAN + 1.6, CLOCK]]);
  const clock = E.el(P, "abs", "left:140px;top:1150px;width:800px;padding:14px 0;border-radius:24px;background:#fbfaf6;text-align:center;font-family:'Courier New',monospace;font-weight:900;font-size:84px;color:#1d2b36;z-index:6;opacity:0", "22:00 → 07:00");
  show(clock, [[CLOCK, FINE]]); E.pop(clock, CLOCK, { from: 1.6, dur: .18 });
  const ban = E.el(P, "abs", "left:240px;top:120px;width:600px;text-align:center;font-weight:900;font-size:66px;color:#e0533d;z-index:6;opacity:0", "NO OVERNIGHT");
  show(ban, [[BAN + 2.4, FINE]]); E.pop(ban, BAN + 2.4, { from: 1.8, dur: .16 });
  E.F(t => { P.style.background = t < BAN + 1.4 ? "radial-gradient(circle at 50% 40%,#1c2a3f,#0b1220)" : t < BAN + 2.4 ? "radial-gradient(circle at 50% 40%,#3f1c1c,#200b0b)" : t < CLOCK ? "radial-gradient(circle at 50% 40%,#1c2a3f,#0b1220)" : "radial-gradient(circle at 50% 40%,#2b1d3f,#120b20)"; });
  P.style.transformOrigin = "50% 40%"; E.K(P, "s", [[BAN, 1.1], [BAN + .4, 1, "out"], [BAN + 1.35, 1.02, "lin"], [BAN + 1.6, 1.25, "out"], [BAN + 2.3, 1.27, "lin"], [BAN + 2.5, 1.0, "out"], [CLOCK - .1, 1.04, "lin"], [CLOCK, 1.0, "out"], [FINE, 1.06, "lin"]]);

  // ============ 4. the fine (11.1 – 14.6) and the 48-hour rule (14.6 – 17.6) ============
  const F = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#ffe0d6,#e0533d)"); show(F, [[FINE, AQUI]]);
  const fine = E.el(F, "abs", "left:140px;top:420px;width:800px;padding:30px 0;border:14px solid #c62828;border-radius:30px;background:#fff;text-align:center;font-weight:900;color:#c62828;z-index:4;transform:rotate(-4deg);line-height:1.1", "FINE<br><span style='font-size:110px'>€120–600</span><br><span style='font-size:34px;color:#7a8794'>(€60–300 elsewhere)</span>");
  fine.style.fontSize = "70px"; show(fine, [[FINE, ELSE]]); E.pop(fine, FINE + .2, { from: 2.2, dur: .16 });
  const h48 = E.el(F, "abs", "left:240px;top:400px;width:600px;height:600px;border-radius:50%;background:#fff;border:16px solid #1f4fa0;text-align:center;font-weight:900;color:#1f4fa0;z-index:4;line-height:1;padding-top:150px;box-sizing:border-box", "<span style='font-size:200px'>48h</span><br><span style='font-size:40px'>max, same town</span>");
  show(h48, [[ELSE, AQUI]]); E.pop(h48, ELSE, { from: .5, dur: .25 });
  const law = E.el(F, "abs", "left:140px;top:1180px;width:800px;text-align:center;font-weight:700;font-size:30px;color:#1d2b36;z-index:5", "Código da Estrada, art. 50.º-A");
  E.F(t => { F.style.background = t < ELSE ? "radial-gradient(circle at 50% 40%,#ffe0d6,#e0533d)" : "radial-gradient(circle at 50% 40%,#dbe8ff,#6d9bea)"; });
  F.style.transformOrigin = "50% 40%"; E.K(F, "s", [[FINE, 1.1], [FINE + .4, 1, "out"], [ELSE - .1, 1.03, "lin"], [ELSE, 1, "out"], [AQUI, 1.06, "lin"]]);

  // ============ 5. the official site (17.6 – end) ============
  const B = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(B, [[AQUI, DUR]]); E.img(B, "beach", COVER);
  const sign = E.el(B, "abs", "left:90px;top:330px;width:500px;padding:16px 0;border-radius:18px;background:#1f4fa0;color:#fff;text-align:center;font-weight:900;font-size:44px;z-index:4;line-height:1.15", "🚐 ÁREA DE AUTOCARAVANAS<br><span style='font-size:28px'>(motorhome area)</span>");
  E.pop(sign, AQUI, { from: .6, dur: .2 });
  const bh = fig(B, "hola", 830, 996, .95, 380, 1880, 5); E.K(bh, "x", [[AQUI, -600], [AQUI + .3, 0, "out"]]);
  const of2 = fig(B, "officer", 309, 985, 1.25, 860, 1880, 6); E.pop(of2, AQUI, { from: .85, dur: .2 });
  E.K(B, "s", [[AQUI, 1.05], [DUR, 1.12, "lin"]]); B.style.transformOrigin = "50% 60%";

  // ============ captions ============
  const cap = E.el(S.el, "abs", "left:70px;top:1385px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const CAPS = [[WAKE + .2, "\"Whoa, whoa! I'm just sleeping!\""], [BAN - .1, ""],
    [BAN, "In protected and coastal areas,"], [BAN + 2.0, "overnighting is banned,"], [CLOCK, "from 10 pm to 7 am."], [FINE - .1, ""],
    [FINE, "The fine: €120 to €600."], [ELSE - .1, ""], [ELSE, "Elsewhere, 48 hours max in the same town."], [AQUI - .1, ""],
    [AQUI, `"Aqui pode."${sub("Here you can.")}`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0, "sfx/waves-seagulls.wav", { vol: 0.3, to: WAKE, duck: false });
  E.clip(0.15, "voices/ep138/n_hook8.wav", { vol: 1.2 });
  E.clip(WAKE, "sfx/door-knock.wav", { vol: 0.7, duck: false });
  E.clip(WAKE + .2, "voices/ep138/b_sleep.wav", { vol: 1.2 });
  E.clip(BAN, "voices/ep138/n_banned.wav", { vol: 1.2 });
  E.clip(BAN + 2.4, "sfx/fs-rubber-stamp.wav", { vol: 0.6, duck: false });
  E.clip(FINE, "voices/ep138/n_fine.wav", { vol: 1.2 });
  E.clip(FINE + .2, "sfx/elx-register.wav", { vol: 0.4, duck: false });
  E.clip(ELSE, "voices/ep138/n_else.wav", { vol: 1.2 });
  E.clip(ELSE, "sfx/fs-clock-tick.wav", { vol: 0.4, to: AQUI, duck: false });
  E.clip(AQUI, "voices/ep138/p_aqui.wav", { vol: 1.3 });
  E.clip(0, "../tools/reel/eps/ep138-autocaravana/audio/music44.wav", { vol: 0.3, to: DUR });
  E.finish(DUR);
}
