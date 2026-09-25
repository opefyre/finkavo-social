// EP.53 "The neighbourhood cat" — one orange street cat, five doors, five names. Grandma: "Tareco! Anda cá, Tareco!" (sardines).
// The café: "Bolinhas! Toma, Bolinhas!" (another sardine). A little girl: "Mimi! Mimi!" (milk). Otto: "Kevin! Here, Kevin!" (treats).
// Each stop the cat gets rounder. Last door: a posh English lady — "Sir Reginald! You are on a DIET." Name tags pile up:
// 5 NAMES. 5 DINNERS. Voiced (ElevenLabs: grandma, barman, girl, Otto, posh lady) + meows, purr, munching.
export const meta = {
  id: "ep53-cat", date: "2026-11-15",
  images: {
    walk: "characters/cutouts/cat_walk.webp", beg: "characters/cutouts/cat_beg.webp", fat: "characters/cutouts/cat_fat.webp",
    gran: "characters/cutouts/dona_knowing.webp", bar: "characters/cutouts/barman_smile.webp", girl: "characters/cutouts/girl_bowl.webp",
    otto: "characters/cutouts/otto-casual_excited.webp", posh: "characters/cutouts/posh_lady.webp", sard: "characters/props/couvert-sardines.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 62, seed: 531, prog: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]] });
  const DUR = 18.0, FLOOR = 1620, GAP = 1000;
  const S = E.scene("street", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const lerpK = (K, t) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t < K[i + 1][0]) { let u = (t - K[i][0]) / (K[i + 1][0] - K[i][0]); u = u * u * (3 - 2 * u); return K[i][1] + (K[i + 1][1] - K[i][1]) * u; } return K[K.length - 1][1]; };
  // stops: [start, end]
  const ST = [[0, 3.4], [4.0, 7.0], [7.6, 9.9], [10.5, 12.8], [13.4, DUR]];
  const CAM = [[0, 0]]; ST.forEach(([a], i) => { if (i) CAM.push([a - .6, -(i - 1) * GAP], [a, -i * GAP]); });
  const camX = t => lerpK(CAM, t);

  // ---------------- sky + the world ----------------
  const sky = E.el(S.el, "abs", "inset:0");
  E.F(t => { const u = t / DUR; sky.style.background = `linear-gradient(180deg, rgb(${140 - u * 70},${200 - u * 110},${240 - u * 90}), rgb(${255 - u * 20},${214 - u * 60},${170 - u * 20}))`; });
  const W = E.el(S.el, "abs", `left:0;top:0;width:${GAP * 5 + 200}px;height:1920px`);
  E.F(t => { W.style.transform = `translateX(${camX(t)}px)`; });
  const HC = ["#f5c9a8", "#ffe29a", "#bfe0d6", "#f7b7b7", "#cfe0f5"];
  for (let i = 0; i < 5; i++) {
    const x0 = i * GAP - 40, h = E.el(W, "abs", `left:${x0}px;top:700px;width:${GAP + 80}px;height:${FLOOR - 700}px;background:${HC[i]};box-shadow:inset -10px 0 0 rgba(0,0,0,.05)`);
    E.el(h, "abs", "left:0;top:0;width:100%;height:26px;background:#c0643f");
    for (let k = 0; k < 4; k++) E.el(h, "abs", `left:${60 + k * 250}px;top:70px;width:90px;height:150px;background:#3d5a73;border:10px solid #fff;border-radius:44px 44px 4px 4px`);
    E.el(W, "abs", `left:${i * GAP + 470}px;top:1010px;width:${i === 4 ? 230 : 200}px;height:${FLOOR - 1010}px;background:${["#6b4a2c", "#2f6db5", "#2f9e6f", "#8a5a2b", "#1f3a8a"][i]};border-radius:${i === 4 ? "115px 115px 0 0" : "8px 8px 0 0"};border:10px solid #fff;border-bottom:none`);
  }
  E.el(W, "abs", `left:0;top:${FLOOR}px;width:${GAP * 5 + 200}px;height:${1920 - FLOOR}px;background:repeating-linear-gradient(135deg,#ece6d8 0 30px,#d9d0bd 30px 60px)`);
  // the café window (stop 1) with the barman inside
  const cw = E.el(W, "abs", `left:${GAP + 700}px;top:960px;width:360px;height:330px;background:#fde9c8;border:14px solid #fff;border-radius:10px;overflow:hidden`);
  E.img(E.el(cw, "abs", `left:${180 - 856 * .44 / 2}px;top:14px;width:${856 * .44}px;height:${993 * .44}px`), "bar", `width:${856 * .44}px;height:${993 * .44}px`);
  E.el(W, "abs", `left:${GAP + 690}px;top:1296px;width:380px;height:22px;background:#8a5a2b`);
  E.el(W, "abs", `left:${GAP + 700}px;top:900px;width:360px;height:60px;background:repeating-linear-gradient(90deg,#e5484d 0 45px,#fff 45px 90px);border-radius:0 0 14px 14px`);
  // the people at their doors
  const person = (i, n, w, h, s, dx) => { const el = E.el(W, "abs", `left:${i * GAP + dx}px;top:${FLOOR + 20 - h * s}px;width:${w * s}px;height:${h * s}px;z-index:2`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const gp = person(0, "gran", 665, 1014, .78, 620);
  person(2, "girl", 626, 881, .74, 640);
  const op = person(3, "otto", 625, 1078, .78, 640);
  person(4, "posh", 381, 1051, .78, 760);
  const gb = []; for (let t = 0; t < 3.4; t += .8) gb.push([t, 0, "io"], [t + .4, -8, "io"]);
  E.K(gp, "y", gb);                                                                                                   // frame-0 motion

  // ---------------- the cat ----------------
  const cat = E.el(W, "abs", `left:0;top:0;width:1px;height:1px;z-index:4`);
  const CI = { walk: [802, 671, .5], beg: [582, 865, .46], fat: [824, 802, .52] };
  const cIm = Object.entries(CI).map(([n, [w, h, s]]) => [n, E.img(cat, n, `position:absolute;left:${-w * s / 2}px;top:${-h * s}px;width:${w * s}px;height:${h * s}px;opacity:0;transform-origin:50% 100%`)]);
  const SIT = [0, 1, 2, 3, 4].map(i => i * GAP + 360);
  E.F(t => {
    let x = SIT[0] - 300 + Math.min(1, t / .6) * 300, pose = "beg", grow = 1;
    for (let i = 0; i < 5; i++) { const [a, b] = ST[i]; if (t >= a - .6 && i) { const u = Math.min(1, (t - (a - .6)) / .6); x = SIT[i - 1] + (SIT[i] - SIT[i - 1]) * u; pose = u < 1 ? "walk" : "beg"; } }
    if (t < .6) pose = "walk";
    const idx = ST.findIndex(([a, b]) => t >= a - .6 && t < b); grow = 1 + Math.max(0, idx) * .09;
    if (t >= ST[4][0] - .6) { pose = "fat"; grow = 1.05; }
    cIm.forEach(([n, el]) => { el.style.opacity = n === pose ? 1 : 0; });
    const wob = pose === "walk" ? Math.abs(Math.sin(t * 14)) * -8 : 0;
    cat.style.transform = `translate(${x}px,${FLOOR + 30 + wob}px) scale(${grow * (pose === "beg" ? 1 : 1)})`;
  });
  // food at each stop
  [[0, 1.9], [1, 5.8], [3, 11.5]].forEach(([i, t]) => {
    const el = E.el(W, "abs", `left:${SIT[i] + 90}px;top:${FLOOR + 20 - 223 * .5}px;width:${309 * .5}px;height:${223 * .5}px;z-index:3;opacity:0`);
    E.img(el, "sard", `width:${309 * .5}px;height:${223 * .5}px`);
    E.K(el, "o", [[t - .01, 0], [t, 1], [t + 1.0, 1], [t + 1.2, 0]]); E.K(el, "y", [[t, -300], [t + .25, 0, "in"]]);
    E.clip(t + .5, "sfx/munch.wav", { vol: .7, to: .6 });
  });
  const milk = E.el(W, "abs", `left:${SIT[2] + 100}px;top:${FLOOR - 40}px;width:120px;height:50px;border-radius:0 0 50px 50px;background:#fff;border:5px solid #9fb3c6;z-index:3;opacity:0`);
  E.K(milk, "o", [[8.9, 0], [9.0, 1], [9.8, 1], [9.9, 0]]);

  // ---------------- name tags ----------------
  const NAMES = [["TARECO", "#c0643f", 1.4], ["BOLINHAS", "#2f6db5", 5.0], ["MIMI", "#e0457b", 8.5], ["KEVIN", "#1f7a3a", 11.6], ["SIR REGINALD", "#8a6a1a", 15.0]];
  NAMES.forEach(([n, col, t], i) => {
    const tg = E.el(W, "abs", `left:${SIT[i] - 150}px;top:${FLOOR - 560}px;width:300px;text-align:center;z-index:6;opacity:0`, "");
    E.el(tg, "", `display:inline-block;background:#fff;border:6px solid ${col};color:${col};font-weight:900;font-size:${i === 4 ? 42 : 50}px;padding:4px 20px;border-radius:40px;box-shadow:0 8px 16px rgba(0,0,0,.2);white-space:nowrap`, n);
    E.pop(tg, t, { from: .3, dur: .3 }); E.S(t, "ding", .5);
  });
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:52px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  E.F(t => { const n = NAMES.filter(x => t >= x[2]).length, s = `NAMES: ${n}`; if (pill.textContent !== s) pill.textContent = s; });
  NAMES.forEach(([, , t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.2], [t + .2, 1, "out"]]));
  // the final list
  const list = E.el(S.el, "abs", "left:60px;top:470px;width:960px;display:flex;flex-wrap:wrap;justify-content:center;gap:10px;z-index:9;opacity:0");
  NAMES.forEach(([n, col]) => E.el(list, "", `background:#fff;border:5px solid ${col};color:${col};font-weight:900;font-size:34px;padding:2px 16px;border-radius:30px`, n));
  E.K(list, "o", [[16.2, 0], [16.35, 1]]);

  // ---------------- bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 54) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:32px;padding:18px 26px 22px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Tareco! Anda cá, Tareco!", 500, 560, 520, 300, .4, 3.3, 50);
  bubble("Bolinhas! Toma, Bolinhas!", 500, 560, 520, 330, 4.2, 6.9, 50);
  bubble("Mimi! Mimi!", 560, 640, 380, 200, 7.8, 9.8, 58);
  bubble("Kevin! Here, Kevin!", 520, 600, 480, 260, 10.7, 12.7, 54);
  bubble("Sir Reginald! You are on a DIET.", 440, 560, 600, 420, 13.9, 16.1, 50);

  // ---------------- stamp ----------------
  const sb = E.el(S.el, "abs", "left:60px;top:680px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "5 NAMES. 5 DINNERS.", 16.5, { size: 92, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  E.clip(0, "sfx/street-sunny.wav", { vol: 2.5, duck: false }); E.clip(4.9, "sfx/street-sunny.wav", { vol: 2.5, duck: false }); E.clip(9.8, "sfx/street-sunny.wav", { vol: 2.2, duck: false }); E.clip(14.7, "sfx/street-sunny.wav", { vol: 2, duck: false, to: DUR - 14.7 });
  E.clip(.4, "voices/ep53/g_tareco.wav", { vol: 1.15 });
  E.clip(4.2, "voices/ep53/b_bolinhas.wav", { vol: 1.15 });
  E.clip(7.8, "voices/ep53/k_mimi.wav", { vol: 1.1 });
  E.clip(10.7, "voices/ep53/o_kevin.wav", { vol: 1.15 });
  E.clip(13.9, "voices/ep53/p_reginald.wav", { vol: 1.15 });
  [1.3, 4.9, 8.4, 11.4].forEach(t => E.clip(t, "sfx/meow-cute.wav", { vol: .6 }));
  E.clip(13.2, "sfx/meow-fat.wav", { vol: .7 }); E.clip(16.4, "sfx/purr.wav", { vol: .5 });
  [3.4, 7.0, 9.9, 12.8].forEach(t => E.S(t, "whoosh", .4));

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.95);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "Every neighbourhood *cat*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[17.2, 1], [17.45, 1.18, "out"], [17.8, 1, "io"]]);
}
