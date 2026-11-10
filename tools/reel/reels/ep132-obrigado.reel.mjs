// EP.132 "Why did she get corrected for saying obrigado?" — Zoe: "Obrigado!" The waiter freezes mid-pour (real clip): "Obrigada."
// Zoe: "No, no, I'm thanking you. Obrigado!" Narrator: in Portuguese, thank you follows the person speaking — women say obrigada,
// men say obrigado (Ciberdúvidas, "Obrigado(a), eu"); it literally means "I'm obliged". Otto: "Obrigada!" ✗ · waiter: "Obrigado." ✓
// Otto: "So I've been saying it wrong for four years?" Grandma: "E eu nunca disse nada." (And I never said a thing.)
// Zoe: "Obrigada!" Waiter: "De nada." (You're welcome.) Narrator: Finkavo Narrator. Music: compose.py ep132.
export const meta = {
  id: "ep132-obrigado", date: "2026-11-16",
  images: {
    cafe: "characters/scenes/bg_tasca.webp", zthink: "characters/cutouts/zoe_think.webp", zdef: "characters/cutouts/zoe_default.webp",
    woff: "characters/cutouts/waiter_offended.webp", wtray: "characters/cutouts/waiter_tray.webp", othumb: "characters/cutouts/otto-casual_thumbs.webp",
    oshock: "characters/cutouts/otto_shocked.webp", dtea: "characters/cutouts/dona_tea.webp",
  },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 26.4;
  const WHY = 1.0, WOB = 2.5, THANK = 3.4, FOLLOW = 6.8, WOMEN = 10.0, OBLIGED = 13.4, OTTO = 16.0, WOK = 17.0, FOUR = 18.5, NUNCA = 21.4, ZOBA = 23.7, DENADA = 25.0;
  const S = E.scene("obrigado", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. the real clip (0 – 2.5) ============
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff"); show(M, [[0, WOB]]);
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);
  const hookWords = [["Why", .2], ["did", .35], ["she", .5], ["get", .65], ["corrected", .8, 1], ["for", 1.3], ["saying", 1.45], ["\"obrigado\"?", 1.7, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:250px;width:1000px;text-align:center;z-index:10;line-height:1.08"); show(H, [[0, WOB]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:100px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  // ============ 2. the café (2.5 – 6.8), and the story beats later ============
  const C = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(C, [[WOB, FOLLOW], [OTTO, DUR]]); E.img(C, "cafe", COVER);
  const wo = fig(C, "woff", 628, 1050, 1.0, 780, 1880, 5); show(wo, [[WOB, FOLLOW]]); E.pop(wo, WOB, { from: 1.2, dur: .2 });
  const zt = fig(C, "zthink", 417, 995, 1.05, 290, 1880, 5); show(zt, [[WOB, FOLLOW]]); E.pop(zt, THANK, { from: .9, dur: .2 }); bob(zt, THANK, FOLLOW, 5, .5);
  C.style.transformOrigin = "50% 60%"; E.K(C, "s", [[WOB, 1.0], [WOB + .2, 1.1, "out"], [THANK, 1.12, "lin"], [THANK + .2, 1.0, "out"]]);
  // montage: Otto ✗, waiter ✓ (16 – 18.5)
  const ot = fig(C, "othumb", 649, 1024, 1.05, 300, 1880, 5); show(ot, [[OTTO, WOK]]); E.pop(ot, OTTO, { from: .85, dur: .2 });
  const wt = fig(C, "wtray", 628, 1050, 1.05, 760, 1880, 5); show(wt, [[WOK, FOUR], [DENADA, DUR]]); E.pop(wt, WOK, { from: .85, dur: .2 });
  const mark = E.el(C, "abs", "left:0;top:420px;width:1080px;text-align:center;font-weight:900;font-size:200px;z-index:8;-webkit-text-stroke:5px #141414", "");
  show(mark, [[OTTO + .4, FOUR], [ZOBA + .4, DENADA]]);
  E.F(t => { const s = t < WOK ? "✗" : "✓"; if (mark.textContent !== s) mark.textContent = s; mark.style.color = t < WOK ? "#e0333a" : "#3fbf5f"; });
  [OTTO + .4, WOK + .3, ZOBA + .4].forEach(t => { E.pop(mark, t, { from: 1.8, dur: .16 }); E.clip(t, "sfx/fs-rubber-stamp.wav", { vol: 0.5, duck: false }); });
  const os = fig(C, "oshock", 751, 1108, .95, 540, 1880, 6); show(os, [[FOUR, NUNCA]]); E.pop(os, FOUR, { from: 1.2, dur: .18 });
  const dt = fig(C, "dtea", 693, 1019, 1.0, 540, 1880, 6); show(dt, [[NUNCA, ZOBA]]); E.pop(dt, NUNCA, { from: .85, dur: .2 });
  const zd = fig(C, "zdef", 1075, 1818, .58, 300, 1880, 6); show(zd, [[ZOBA, DUR]]); E.pop(zd, ZOBA, { from: .85, dur: .2 });
  E.K(C, "x", [[FOUR, 0], [FOUR + .05, 18], [FOUR + .1, -14], [FOUR + .18, 0]]);

  // ============ 3. the rule (6.8 – 16.0) ============
  const R = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#2c3550,#121828);overflow:hidden"); show(R, [[FOLLOW, OTTO]]);
  const bubble = E.el(R, "abs", "left:140px;top:360px;width:800px;height:300px;background:#fff;border-radius:150px;z-index:3;text-align:center;line-height:300px;font-weight:900;font-size:110px;color:#1d2b36", "thank you");
  E.el(bubble, "abs", "left:150px;top:270px;width:0;height:0;border-left:40px solid transparent;border-right:40px solid transparent;border-top:70px solid #fff");
  E.K(bubble, "s", [[FOLLOW, .6], [FOLLOW + .3, 1, "out"], [FOLLOW + 1.5, 1.02, "lin"], [FOLLOW + 1.75, 1.35, "out"], [WOMEN - .1, 1.4, "lin"], [WOMEN + .1, .82, "out"]]);
  E.K(bubble, "y", [[FOLLOW + 1.5, 0], [FOLLOW + 1.75, 160, "out"]]);
  E.F(t => { R.style.background = t < FOLLOW + 1.6 ? "radial-gradient(circle at 50% 40%,#2c3550,#121828)" : "radial-gradient(circle at 50% 40%,#3d6b4f,#14261b)"; });
  const arrow = E.el(R, "abs", "left:0;top:960px;width:1080px;text-align:center;font-weight:900;font-size:80px;color:#ffd640;z-index:5;-webkit-text-stroke:2px #141414", "follows the SPEAKER");
  show(arrow, [[FOLLOW + 1.6, WOMEN]]); E.pop(arrow, FOLLOW + 1.6, { from: .5, dur: .2 });
  const side = (x, who, word, color, t) => {
    const b = E.el(R, "abs", `left:${x}px;top:240px;width:540px;height:1180px;background:${color};z-index:7;text-align:center;opacity:0`);
    E.el(b, "abs", "left:0;top:380px;width:540px;font-weight:800;font-size:60px;color:#fff", who);
    E.el(b, "abs", "left:0;top:500px;width:540px;font-weight:900;font-size:92px;color:#fff", word);
    show(b, [[t, OBLIGED]]); E.pop(b, t, { from: .5, dur: .22 }); return b;
  };
  side(0, "WOMEN say", "obrigada", "#c2477a", WOMEN + .4); side(540, "MEN say", "obrigado", "#3a6fc2", WOMEN + 1.9);
  const lit = E.el(R, "abs", "left:60px;top:780px;width:960px;text-align:center;font-weight:900;font-size:96px;color:#fff;z-index:6;opacity:0;line-height:1.15", "obrigado =<br><span style='color:#ffd640'>\"I'm obliged\"</span>");
  show(lit, [[OBLIGED, OTTO]]); E.pop(lit, OBLIGED, { from: .6, dur: .22 });
  E.K(R, "s", [[OBLIGED, 1], [OBLIGED + .25, 1.08, "out"], [OTTO, 1.12, "lin"]]); R.style.transformOrigin = "50% 50%";

  // ============ captions ============
  const cap = E.el(S.el, "abs", "left:70px;top:1385px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const CAPS = [[0.1, "\"Obrigado!\""], [WHY, "Why did she get corrected?"], [WOB, "\"Obrigada.\""], [THANK, "\"No, no, I'm thanking you. Obrigado!\""], [THANK + 3.2, ""],
    [FOLLOW, "In Portuguese, thank you follows the person speaking."], [FOLLOW + 3.1, ""], [WOMEN, "Women say obrigada."], [WOMEN + 1.6, "Men say obrigado."], [WOMEN + 3.3, ""],
    [OBLIGED, "It literally means: I'm obliged."], [OBLIGED + 2.4, ""], [OTTO, "\"Obrigada!\""], [WOK, "\"Obrigado.\""], [WOK + 1.3, ""],
    [FOUR, "\"So I've been saying it wrong for four years?\""], [FOUR + 2.7, ""], [NUNCA, `"E eu nunca disse nada."${sub("And I never said a thing.")}`], [NUNCA + 2.1, ""],
    [ZOBA, "\"Obrigada!\""], [DENADA, `"De nada."${sub("You're welcome.")}`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0.0, "sfx/elx-espresso-steam.wav", { vol: 0.35, to: 1.5, duck: false });
  E.clip(0.1, "voices/ep132/z_obrigado.wav", { vol: 1.2 });
  E.clip(WHY, "voices/ep132/n_why.wav", { vol: 1.2 });
  E.clip(WOB, "voices/ep132/w_obrigada.wav", { vol: 1.25 });
  E.clip(THANK, "voices/ep132/z_thanking.wav", { vol: 1.2 });
  E.clip(FOLLOW, "voices/ep132/n_follows.wav", { vol: 1.2 });
  E.clip(WOMEN, "voices/ep132/n_women.wav", { vol: 1.2 });
  E.clip(OBLIGED, "voices/ep132/n_obliged.wav", { vol: 1.2 });
  E.clip(OTTO, "voices/ep132/o_obrigada.wav", { vol: 1.2 });
  E.clip(WOK, "voices/ep132/w_obrigado.wav", { vol: 1.25 });
  E.clip(FOUR, "voices/ep132/o_fouryears.wav", { vol: 1.2 });
  E.clip(NUNCA, "voices/ep132/g_nunca.wav", { vol: 1.25 });
  E.clip(ZOBA, "voices/ep132/z_obrigada.wav", { vol: 1.2 });
  E.clip(DENADA, "voices/ep132/w_denada.wav", { vol: 1.25 });
  E.clip(0, "../tools/reel/eps/ep132-obrigado/audio/music44.wav", { vol: 0.28, to: DUR });
  E.finish(DUR);
}
