// EP.127 "The deadliest thing in a Portuguese house?" — the gas? the knives? the stairs? Please. It's invisible, and it just came
// through the window. Grandma: "Fecha a janela!" (Close the window!) Otto: "It's twenty-eight degrees…" Dad: "Who opened the window?!"
// Grandma: "Corrente de ar!" (A draught!) — a WANTED poster: blamed for every cold, every stiff neck and every family fight about the
// window. She slams it shut: "Agora sim." (Now we're good.) Otto ends up in a scarf, sweating. Narrator: Finkavo Narrator.
// The living-room shots are a real Kling clip laid in after the render (magenta key, see reel-post.sh notes in NOTE.md).
// Music: tools/music/compose.py ep127 (tasca noir), stopping dead on the slam.
export const meta = {
  id: "ep127-corrente", date: "2027-01-30",
  images: {
    stove: "../tools/reel/eps/ep127-corrente/media/stove.jpg", knives: "../tools/reel/eps/ep127-corrente/media/knives.jpg",
    stairs: "../tools/reel/eps/ep127-corrente/media/stairs.jpg", avo: "characters/scenes/bg_avo.webp",
    point: "characters/cutouts/dona_point.webp", slam: "characters/cutouts/dona_slam.webp", dad: "characters/cutouts/ze_angry.webp",
    sweat: "characters/cutouts/otto-summer_happy.webp", bundled: "characters/cutouts/otto-summer_bundled.webp",
    sneeze: "characters/cutouts/dona_sneeze.webp", worried: "characters/cutouts/otto_worried.webp",
  },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 24.8;
  const GAS = 3.0, KNIVES = 4.0, STAIRS = 5.0, INVIS = 7.0, FECHA = 10.0, DEG = 11.4, DAD = 13.2, CORR = 14.6, CRIMES = 16.2, SLAM = 22.9, AGORA = 23.1;
  const ROOM = [[0, GAS], [INVIS, FECHA]];          // windows where the real clip shows through the magenta
  const S = E.scene("draught", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ the living room: magenta, replaced by the real clip afterwards ============
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff"); show(M, ROOM);
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);
  const hookWords = [["The", .2], ["deadliest", .45], ["thing", .95], ["in", 1.2], ["a", 1.3], ["Portuguese", 1.45], ["house?", 2.1, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:280px;width:1000px;text-align:center;z-index:10;line-height:1.08"); show(H, [[0, GAS]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:110px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  // ============ the wrong guesses: gas, knives, stairs ============
  [["stove", GAS, KNIVES], ["knives", KNIVES, STAIRS], ["stairs", STAIRS, INVIS]].forEach(([img, t0, t1], i) => {
    const P = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(P, [[t0, t1]]);
    const im = E.el(P, "abs", "inset:0;transform-origin:50% 55%"); E.img(im, img, COVER);
    E.K(im, "s", [[t0, 1.35], [t0 + .25, 1.1, "out"], [t1, 1.04, "lin"]]); E.K(im, "x", [[t0, i % 2 ? -120 : 120], [t0 + .25, 0, "out"]]);
    const x = E.el(P, "abs", "left:240px;top:620px;width:600px;height:600px;z-index:5;opacity:0");
    x.innerHTML = '<svg viewBox="0 0 100 100" width="600" height="600"><path d="M15 15 L85 85 M85 15 L15 85" stroke="#e0333a" stroke-width="13" stroke-linecap="round"/></svg>';
    const tx = t0 + (i === 2 ? .75 : .6);
    show(x, [[tx, t1]]); E.pop(x, tx, { from: 2.2, dur: .16 });
    E.clip(tx, "sfx/fs-rubber-stamp.wav", { vol: 0.7, duck: false });
  });

  // ============ grandma, Otto, dad (10 – 14.6), cartoon house ============
  const G = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G, [[FECHA, CORR]]); E.img(G, "avo", COVER);
  const gp = fig(G, "point", 688, 1024, 1.15, 640, 1880, 5); show(gp, [[FECHA, DEG]]); E.pop(gp, FECHA, { from: 1.4, dur: .22 }); E.K(G, "x", [[FECHA, 14], [FECHA + .06, -12], [FECHA + .12, 8], [FECHA + .2, 0]]);
  const ot = fig(G, "sweat", 857, 1119, .95, 520, 1880, 5); show(ot, [[DEG, DAD]]); E.pop(ot, DEG, { from: .85, dur: .2 }); bob(ot, DEG, DAD, 5, .6);
  const th = E.el(G, "abs", "left:690px;top:430px;width:300px;height:150px;background:#e0533d;border-radius:24px;color:#fff;font-weight:900;font-size:96px;text-align:center;line-height:150px;z-index:7", "28°C");
  show(th, [[DEG, DAD]]); E.pop(th, DEG + .3, { from: .3, dur: .25 });
  const dd = fig(G, "dad", 749, 1014, 1.12, 560, 1880, 5); show(dd, [[DAD, CORR]]); E.K(dd, "x", [[DAD, 700], [DAD + .25, 0, "out"]]);

  // ============ the WANTED poster (14.6 – 22.9) ============
  const W = E.el(S.el, "abs", "inset:0;background:#2a2118"); show(W, [[CORR, SLAM]]);
  const poster = E.el(W, "abs", "left:150px;top:260px;width:780px;height:1100px;background:#f1e3c2;border-radius:6px;box-shadow:0 30px 60px rgba(0,0,0,.6);transform-origin:50% 0;z-index:3;text-align:center;color:#3b2a18");
  E.K(poster, "y", [[CORR, -1300], [CORR + .22, 0, "in"], [CORR + .32, -18, "out"], [CORR + .42, 0, "in"]]); E.K(poster, "r", [[CORR, -6], [CORR + .42, -1.5]]);
  E.el(poster, "abs", "left:0;top:40px;width:780px;font-weight:900;font-size:120px;letter-spacing:6px", "WANTED");
  const face = E.el(poster, "abs", "left:190px;top:200px;width:400px;height:300px;border:6px solid #3b2a18;border-radius:8px;background:#e6d3ab");
  face.innerHTML = '<svg viewBox="0 0 200 150" width="388" height="288"><g fill="none" stroke="#3b2a18" stroke-width="7" stroke-linecap="round"><path d="M20 55 C60 25 110 25 150 50 C170 62 168 82 150 82"/><path d="M15 85 C55 70 105 72 160 95 C182 105 175 125 155 120"/><path d="M30 115 C70 105 100 110 130 125"/></g><circle cx="80" cy="60" r="7" fill="#3b2a18"/><circle cx="110" cy="62" r="7" fill="#3b2a18"/></svg>';
  E.K(face, "x", [[CORR, 0], [SLAM, 0]]); const wob = []; for (let t = CORR; t < SLAM; t += .5) wob.push([t, -3, "io"], [t + .25, 3, "io"]); E.K(face, "r", wob);
  E.el(poster, "abs", "left:0;top:530px;width:780px;font-weight:900;font-size:76px", "CORRENTE DE AR");
  E.el(poster, "abs", "left:0;top:620px;width:780px;font-weight:700;font-size:40px;color:#6b5236", "(a draught)");
  const crimes = [["every cold", CRIMES + 1.6], ["every stiff neck", CRIMES + 3.0], ["every fight about the window", CRIMES + 4.7]];
  crimes.forEach(([c, t], i) => {
    const row = E.el(poster, "abs", `left:60px;top:${700 + i * 110}px;width:660px;font-weight:900;font-size:${i === 2 ? 40 : 48}px;color:#a32020;opacity:0`, `✗ ${c}`);
    show(row, [[t, SLAM]]); E.pop(row, t, { from: 1.6, dur: .18 });
    E.clip(t, "sfx/fs-rubber-stamp.wav", { vol: 0.55, duck: false });
  });
  const gp2 = fig(W, "point", 688, 1024, .8, 900, 1880, 6); show(gp2, [[CORR, CRIMES + .8]]); E.K(gp2, "x", [[CORR, 300], [CORR + .3, 0, "out"]]);
  // the poster punches in each time it comes back from a cutaway
  W.style.transformOrigin = "50% 45%";
  E.K(W, "s", [[CRIMES, 1], [CRIMES + 1.5, 1.06, "lin"], [CRIMES + 2.5, 1.18, "out"], [CRIMES + 3.9, 1.22, "lin"], [CRIMES + 4.6, 1.32, "out"], [SLAM, 1.38, "lin"]]);
  // cutaways, one per crime: the sneeze, the stiff neck, the window fight
  const CW = [[CRIMES + 1.6, CRIMES + 2.5], [CRIMES + 3.0, CRIMES + 3.9], [CRIMES + 4.7, CRIMES + 6.0]];
  const C = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(C, CW); E.img(C, "avo", COVER);
  const c1 = fig(C, "sneeze", 586, 1027, 1.15, 540, 1880, 5); show(c1, [CW[0]]); E.pop(c1, CW[0][0], { from: .8, dur: .2 });
  const c2 = fig(C, "worried", 751, 1108, 1.0, 540, 1880, 5); show(c2, [CW[1]]); E.pop(c2, CW[1][0], { from: .8, dur: .2 }); E.K(c2, "r", [[CW[1][0], 0], [CW[1][0] + .3, -9, "out"]]);
  const c3a = fig(C, "dad", 749, 1014, .85, 280, 1880, 5), c3b = fig(C, "point", 688, 1024, .85, 800, 1880, 5);
  show(c3a, [CW[2]]); show(c3b, [CW[2]]); c3b.style.transform = "scaleX(-1)"; E.K(c3a, "x", [[CW[2][0], -300], [CW[2][0] + .2, 0, "out"]]);
  const lab = E.el(C, "abs", "left:140px;top:300px;width:800px;text-align:center;font-weight:900;font-size:80px;color:#fff;-webkit-text-stroke:3px #141414;text-shadow:0 6px 18px rgba(0,0,0,.5);z-index:7", "");
  show(lab, CW); E.F(t => { const s = t < CW[1][0] ? "A COLD" : t < CW[2][0] ? "A STIFF NECK" : "THE WINDOW FIGHT"; if (lab.textContent !== s) lab.textContent = s; });
  CW.forEach(([a]) => E.pop(lab, a, { from: .6, dur: .18 }));

  // ============ the slam (22.9 – end) ============
  const F = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(F, [[SLAM, DUR]]); E.img(F, "avo", COVER);
  const gs = fig(F, "slam", 676, 1008, 1.1, 760, 1880, 5); E.K(gs, "x", [[SLAM, 40], [SLAM + .08, -10, "out"], [SLAM + .2, 0]]);
  const ob = fig(F, "bundled", 857, 1119, .8, 330, 1880, 4); bob(ob, SLAM, DUR, 4, .8);
  E.K(F, "x", [[SLAM, 0], [SLAM + .04, 16], [SLAM + .09, -12], [SLAM + .15, 6], [SLAM + .22, 0]]);

  // ============ captions and subtitles ============
  const cap = E.el(S.el, "abs", "left:70px;top:1385px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12;text-shadow:0 3px 10px rgba(0,0,0,.85)", "");
  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const CAPS = [[GAS, "The gas?"], [KNIVES, "The knives?"], [STAIRS, "The stairs?"], [STAIRS + .95, "Please."], [STAIRS + 1.9, ""],
    [INVIS, "It's invisible."], [INVIS + 1.25, "And it just came through the window."], [INVIS + 2.9, ""],
    [FECHA, `"Fecha a janela!"${sub("Close the window!")}`], [DEG, "\"It's twenty-eight degrees…\""], [DAD, "\"Who opened the window?!\""],
    [CORR, `"Corrente de ar!"${sub("A draught!")}`], [CRIMES, "The corrente de ar."], [CRIMES + 1.5, "Blamed for every cold,"], [CRIMES + 2.9, "every stiff neck…"],
    [CRIMES + 4.5, "and every family fight about the window."], [CRIMES + 6.6, ""], [AGORA, `"Agora sim."${sub("Now we're good.")}`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0.05, "sfx/wind-gust.wav", { vol: 0.9, duck: false });
  E.clip(0.3, "sfx/fs-curtain-flap.wav", { vol: 0.6, duck: false });
  E.clip(0.15, "voices/ep127/n_deadliest.wav", { vol: 1.2 });
  E.clip(GAS - .1, "sfx/fs-gas-hiss.wav", { vol: 0.5, from: 3.05, to: 4.1, duck: false });
  E.clip(GAS, "voices/ep127/n_gas.wav", { vol: 1.2 });
  E.clip(KNIVES - .05, "sfx/fs-knife-ring.wav", { vol: 0.35, to: 0.9, duck: false });
  E.clip(KNIVES, "voices/ep127/n_knives.wav", { vol: 1.2 });
  E.clip(STAIRS - .05, "sfx/footsteps-stairs.wav", { vol: 0.35, to: 1.2, duck: false });
  E.clip(STAIRS, "voices/ep127/n_stairs.wav", { vol: 1.2 });
  E.clip(INVIS - .1, "sfx/wind-gust.wav", { vol: 0.8, duck: false });
  E.clip(INVIS + .3, "sfx/fs-curtain-flap.wav", { vol: 0.5, duck: false });
  E.clip(INVIS, "voices/ep127/n_invisible.wav", { vol: 1.2 });
  E.clip(FECHA - .2, "sfx/fs-slipper-tiles.wav", { vol: 0.5, from: 0.5, to: 1.1, duck: false });
  E.clip(FECHA, "voices/ep127/g_fecha.wav", { vol: 1.25 });
  E.clip(DEG, "sfx/cicadas.wav", { vol: 0.25, to: 1.8, duck: false });
  E.clip(DEG, "voices/ep127/o_degrees.wav", { vol: 1.2 });
  E.clip(DAD - .15, "sfx/fs-door-bang.wav", { vol: 0.55, from: 9.35, to: 10.1, duck: false });
  E.clip(DAD, "voices/ep127/d_window.wav", { vol: 1.2 });
  E.clip(CORR, "sfx/note-slap.wav", { vol: 0.6, duck: false });
  E.clip(CORR, "voices/ep127/g_corrente.wav", { vol: 1.25 });
  E.clip(CRIMES, "voices/ep127/n_corrente.wav", { vol: 1.2 });
  E.clip(SLAM - .1, "sfx/fs-window-slam.wav", { vol: 0.8, from: 3.25, to: 4.4, duck: false });
  E.clip(AGORA + .25, "voices/ep127/g_agora.wav", { vol: 1.25 });
  E.clip(0, "../tools/reel/eps/ep127-corrente/audio/music44.wav", { vol: 0.3, to: DUR });
  E.finish(DUR);
}
