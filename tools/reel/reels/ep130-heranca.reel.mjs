// EP.130 "Can a Portuguese grandma cut you out of her will?" — grandma crosses a name out (real clip). Tiago: "Avó, I said I was sorry
// about the plant!" Grandma: "Está decidido." (It's decided.) Narrator: in Portugal she can't — if she has children, up to two-thirds
// of everything is reserved for them by law (Código Civil art. 2159: 1/2 for one child, 2/3 for two or more, 2/3 with a spouse and
// children). She only decides the rest. Grandma: "Então fica para o gato." (Then it goes to the cat.) Tiago: "…The cat?"
// Grandma: "O gato nunca matou uma planta." (The cat never killed a plant.) Narrator: Finkavo Narrator. Music: compose.py ep130.
// The opening (0–2.9 s) is a real Kling clip laid under the magenta after the render (see NOTE.md).
export const meta = {
  id: "ep130-heranca", date: "2026-11-14",
  images: {
    avo: "characters/scenes/bg_avo.webp", plant: "characters/cutouts/tiago_plant.webp", folded: "characters/cutouts/dona_folded.webp",
    cat: "characters/props/cat-crown.webp", sheep: "characters/cutouts/tiago_sheepish.webp",
  },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 24.6;
  const PLANT = 2.9, DECID = 6.0, BAD = 7.4, NO = 9.6, RES = 10.8, REST = 15.8, GATO = 17.8, CAT = 20.3, PLANTA = 21.2;
  const S = E.scene("will", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. the real clip (0 – 2.9) under magenta ============
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff"); show(M, [[0, PLANT]]);
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);
  const hookWords = [["Can", .2], ["a", .35], ["Portuguese", .45], ["grandma", .95], ["cut", 1.35, 1], ["you", 1.5, 1], ["out", 1.65, 1], ["of", 1.85], ["her", 1.95], ["will?", 2.1, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:260px;width:1000px;text-align:center;z-index:10;line-height:1.08"); show(H, [[0, PLANT]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:100px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  // ============ 2. the plant and the decision (2.9 – 7.4) ============
  const K = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(K, [[PLANT, BAD], [GATO, DUR]]); E.img(K, "avo", COVER);
  const tp = fig(K, "plant", 600, 1024, 1.05, 330, 1880, 5); show(tp, [[PLANT, BAD]]); E.K(tp, "x", [[PLANT, -500], [PLANT + .3, 0, "out"]]); bob(tp, PLANT, BAD, 6, .45);
  const gf = fig(K, "folded", 600, 1024, 1.05, 780, 1880, 5); show(gf, [[DECID - .2, BAD], [GATO, DUR]]); E.pop(gf, DECID - .2, { from: .85, dur: .2 });
  E.K(K, "s", [[PLANT, 1], [DECID - .2, 1.04, "lin"], [DECID, 1.12, "out"], [BAD, 1.14, "lin"]]); E.K(K, "x", [[PLANT, 1080], [PLANT + .25, 0, "out"], [GATO, -1080], [GATO + .25, 0, "out"]]); K.style.transformOrigin = "65% 60%";

  // ============ 3. the will gets a NÃO (7.4 – 10.8) ============
  const Wl = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#3a2f25,#16110c)"); show(Wl, [[BAD, RES]]);
  const paper = E.el(Wl, "abs", "left:200px;top:300px;width:680px;height:880px;background:#f4ecd8;border-radius:6px;box-shadow:0 30px 60px rgba(0,0,0,.5);z-index:3;font-family:Georgia,serif;color:#3b2a18;text-align:center");
  E.el(paper, "abs", "left:0;top:50px;width:680px;font-size:64px;font-style:italic", "Testamento");
  E.el(paper, "abs", "left:0;top:130px;width:680px;font-size:32px;color:#7a6650", "(the will)");
  ["To my grandson Tiago: ", "my house", "my savings", "the good cutlery"].forEach((l, i) => {
    const r = E.el(paper, "abs", `left:70px;top:${230 + i * 90}px;width:540px;text-align:left;font-size:${i ? 40 : 36}px`, i ? `• ${l}` : l);
    if (i) { const strike = E.el(r, "abs", "left:0;top:26px;height:6px;width:0;background:#a32020"); E.K(strike, "w", [[BAD + .3 + i * .35, 0], [BAD + .6 + i * .35, 360, "out"]]); }
  });
  E.K(paper, "s", [[BAD, 1.15], [BAD + .4, 1, "out"], [NO, 1.03, "lin"], [NO + .08, .97, "in"], [NO + .25, 1, "out"]]);
  const no = E.el(Wl, "abs", "left:240px;top:640px;width:600px;height:220px;border:14px solid #c62828;border-radius:24px;color:#c62828;font-weight:900;font-size:170px;text-align:center;line-height:200px;transform:rotate(-12deg);z-index:6;opacity:0", "NÃO");
  show(no, [[NO, RES]]); E.pop(no, NO, { from: 2.4, dur: .16 });
  const noSub = E.el(Wl, "abs", "left:0;top:900px;width:1080px;text-align:center;font-weight:800;font-size:44px;color:#ffd640;z-index:6", "(no)"); show(noSub, [[NO + .2, RES]]);

  // ============ 4. the pie (10.8 – 17.8): two-thirds locked, the rest is hers ============
  const Pi = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#22324d,#0f1726)"); show(Pi, [[RES, GATO]]);
  const pie = E.el(Pi, "abs", "left:240px;top:330px;width:600px;height:600px;border-radius:50%;z-index:3;box-shadow:0 20px 50px rgba(0,0,0,.45)");
  E.F(t => {
    const u = Math.max(0, Math.min(1, (t - RES - .2) / 1.2)), lock = 240 * (1 - Math.pow(1 - u, 3)), glow = t >= REST ? .55 + .45 * Math.abs(Math.sin((t - REST) * 4)) : .35;
    pie.style.background = `conic-gradient(#e0533d 0deg ${lock}deg, rgba(125,255,138,${glow}) ${lock}deg 360deg)`;
  });
  const lk = E.el(Pi, "abs", "left:300px;top:520px;width:300px;text-align:center;font-weight:900;font-size:52px;color:#fff;z-index:5;line-height:1.1;opacity:0", "2/3<br><span style='font-size:30px'>FAMILY · BY LAW</span>");
  show(lk, [[RES + 1.5, GATO]]); E.pop(lk, RES + 1.5, { from: .5, dur: .25 });
  const lockIcon = E.el(Pi, "abs", "left:300px;top:390px;width:110px;height:130px;z-index:6;opacity:0");
  lockIcon.innerHTML = '<svg viewBox="0 0 50 60" width="110" height="130"><rect x="5" y="25" width="40" height="32" rx="5" fill="#ffd640"/><path d="M14 25 V17 a11 11 0 0 1 22 0 V25" stroke="#ffd640" stroke-width="6" fill="none"/></svg>';
  show(lockIcon, [[RES + 2.2, GATO]]); E.pop(lockIcon, RES + 2.2, { from: 2, dur: .18 });
  const freeLab = E.el(Pi, "abs", "left:610px;top:420px;width:300px;text-align:center;font-weight:900;font-size:46px;color:#0f1726;z-index:5;line-height:1.1;opacity:0;text-shadow:0 0 12px #fff", "THE REST<br><span style='font-size:28px'>her choice</span>");
  show(freeLab, [[REST, GATO]]); E.pop(freeLab, REST, { from: .5, dur: .25 });
  const fine = E.el(Pi, "abs", "left:80px;top:1010px;width:920px;text-align:center;font-weight:800;font-size:32px;color:#1d2b36;background:rgba(255,255,255,.8);border-radius:16px;padding:10px 0;z-index:5;line-height:1.35",
    "One child: 1/2 reserved · two or more: 2/3<br>Código Civil, art. 2159");
  show(fine, [[RES + 3.2, GATO]]);
  Pi.style.transformOrigin = "40% 35%"; E.K(Pi, "s", [[RES, 1.12], [RES + .5, 1, "out"], [RES + 2.1, 1.02, "lin"], [RES + 2.35, 1.5, "out"], [RES + 3.6, 1.55, "lin"], [RES + 3.85, 1.0, "out"], [REST, 1.02, "lin"], [REST + .25, 1.0, "out"], [GATO, 1.06, "lin"]]);
  E.F(t => { Pi.style.background = t < RES + 2.3 ? "radial-gradient(circle at 50% 40%,#22324d,#0f1726)" : t < REST ? "radial-gradient(circle at 50% 40%,#f1d8c8,#c98f73)" : "radial-gradient(circle at 50% 40%,#d9f5df,#7fc994)"; });
  E.K(Pi, "x", [[REST, 0], [REST + .25, -80, "out"], [GATO, -100, "lin"]]);

  // ============ 5. the cat inherits (17.8 – end) ============
  const cat = fig(K, "cat", 640, 520, 1.0, 330, 1720, 6); show(cat, [[GATO, DUR]]); E.pop(cat, GATO + .2, { from: .4, dur: .3 });
  const crown = E.el(K, "abs", "left:110px;top:980px;width:440px;text-align:center;font-weight:900;font-size:56px;color:#ffd640;-webkit-text-stroke:2px #141414;z-index:7;opacity:0", "HEIR");
  show(crown, [[GATO + 1.0, DUR]]); E.pop(crown, GATO + 1.0, { from: .5, dur: .2 });
  const ts = fig(K, "sheep", 600, 1024, .95, 330, 1880, 8); show(ts, [[CAT - .1, PLANTA]]); E.pop(ts, CAT - .1, { from: 1.3, dur: .18 });
  E.K(K, "x", [[GATO, 0], [CAT - .1, 0], [CAT, -20], [CAT + .1, 0]]);

  // ============ captions ============
  const cap = E.el(S.el, "abs", "left:70px;top:1385px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const CAPS = [[PLANT, "\"Avó, I said I was sorry about the plant!\""], [DECID, `"Está decidido."${sub("It's decided.")}`], [DECID + 1.3, ""],
    [BAD, "Bad news, grandma."], [BAD + 1.4, "In Portugal, you can't."], [BAD + 3.2, ""],
    [RES, "If she has children, up to two-thirds"], [RES + 2.2, "is reserved for them by law."], [RES + 4.8, ""], [REST, "She only decides the rest."], [REST + 1.8, ""],
    [GATO, `"Então fica para o gato."${sub("Then it goes to the cat.")}`], [CAT, "\"…The cat?\""], [CAT + .7, ""],
    [PLANTA, `"O gato nunca matou uma planta."${sub("The cat never killed a plant.")}`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0.05, "sfx/elx-paper-unfold.wav", { vol: 0.5, duck: false });
  E.clip(0.15, "voices/ep130/n_will.wav", { vol: 1.2 });
  E.clip(PLANT, "voices/ep130/t_plant.wav", { vol: 1.2 });
  E.clip(DECID, "voices/ep130/g_decidido.wav", { vol: 1.25 });
  E.clip(BAD, "voices/ep130/n_badnews.wav", { vol: 1.2 });
  E.clip(NO, "sfx/fs-rubber-stamp.wav", { vol: 0.8, duck: false });
  E.clip(RES, "voices/ep130/n_reserved.wav", { vol: 1.2 });
  E.clip(RES + 2.2, "sfx/fs-rubber-stamp.wav", { vol: 0.4, duck: false });
  E.clip(REST, "voices/ep130/n_rest.wav", { vol: 1.2 });
  E.clip(GATO, "voices/ep130/g_gato.wav", { vol: 1.25 });
  E.clip(CAT, "voices/ep130/t_cat.wav", { vol: 1.2 });
  E.clip(PLANTA, "voices/ep130/g_planta.wav", { vol: 1.25 });
  E.clip(0, "../tools/reel/eps/ep130-heranca/audio/music44.wav", { vol: 0.3, to: DUR });
  E.finish(DUR);
}
