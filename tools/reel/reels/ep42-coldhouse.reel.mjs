// EP.42 "Winter: Sweden vs Portugal" — split screen. STOCKHOLM: −10°C outside, snow, 22°C inside; a Swede in a T-shirt eats ice
// cream. LISBON: 18°C and sunny outside, 11°C inside; Otto shivers, breath steaming, mould creeping up the wall. The Swede: "It's
// so cozy here!" Otto becomes a duvet burrito (9°C). "Why are you wearing a hat inside?" "Why AREN'T you?!" Then Otto opens the
// window to let the WARM air in (9 → 14°C), and finally goes outside to warm up on a sunny bench. Effects only (wind, chattering
// teeth, creak, street ambience). Paced per the skit guide.
export const meta = {
  id: "ep42-coldhouse", date: "2026-11-04",
  images: {
    sw: "characters/cutouts/swede_wave.webp", sp: "characters/cutouts/swede_puzzled.webp",
    shiv: "characters/cutouts/otto-casual_shiver.webp", bur: "characters/cutouts/otto-casual_burrito.webp", win: "characters/cutouts/otto-casual_window.webp",
    bench: "characters/cutouts/otto-casual_bench.webp", locals: "characters/cutouts/locals_sunny.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 96, root: 62, seed: 421, prog: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]] });
  const DUR = 16.6;
  const S = E.scene("winter", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const COZY = 2.4, BURR = 4.0, HAT = 5.4, WIN = 8.0, OPEN = 9.2, OUT = 11.6;
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };
  const lerp = (K, t) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t < K[i + 1][0]) { const u = (t - K[i][0]) / (K[i + 1][0] - K[i][0]); return K[i][1] + (K[i + 1][1] - K[i][1]) * u; } return K[K.length - 1][1]; };
  const thermo = (P, left, top, label, K, hot) => {           // a label + a live temperature
    const b = E.el(P, "abs", `left:${left}px;top:${top}px;background:#fff;border-radius:18px;padding:8px 18px;box-shadow:0 6px 14px rgba(0,0,0,.15);text-align:center;z-index:6;min-width:170px`);
    E.el(b, "", "font-weight:800;font-size:26px;color:#7a8791", label);
    const v = E.el(b, "", "font-weight:900;font-size:58px;line-height:1", "");
    E.F(t => { const x = Math.round(lerp(K, t)), s = `${x}°C`; if (v.textContent !== s) v.textContent = s; v.style.color = hot(x) ? "#e0662f" : "#2f6db5"; });
    return b;
  };

  // ================= split screen: Stockholm (top) / Lisbon (bottom) =================
  const SPLIT = layer(0, WIN), MID = 1120;
  const top = E.el(SPLIT, "abs", `left:0;top:0;width:1080px;height:${MID}px;overflow:hidden;background:linear-gradient(180deg,#ffe6bf,#ffd79a)`);
  const tw = E.el(top, "abs", "left:60px;top:470px;width:360px;height:420px;border:16px solid #fff;border-radius:12px;overflow:hidden;background:linear-gradient(180deg,#27406b,#5b7bb0)");
  E.el(tw, "abs", "left:0;top:330px;width:100%;height:90px;background:#eef4ff");
  const flakes = Array.from({ length: 26 }, (_, i) => E.el(tw, "abs", `left:${(i * 53) % 340}px;top:0;width:${8 + (i % 3) * 4}px;height:${8 + (i % 3) * 4}px;border-radius:50%;background:#fff`));
  E.F(t => flakes.forEach((f, i) => { const y = ((t * (90 + (i % 4) * 30) + i * 61) % 440) - 20, x = Math.sin(t * 1.5 + i) * 12; f.style.transform = `translate(${x}px,${y}px)`; }));
  E.el(top, "abs", "left:470px;top:900px;width:200px;height:120px;border-radius:12px;background:repeating-linear-gradient(90deg,#f4f4f4 0 22px,#d8d8d8 22px 30px)");   // radiator
  E.el(top, "abs", "left:0;top:1040px;width:1080px;height:80px;background:#c89a64");
  const SWS = .52, sw = E.el(top, "abs", `left:720px;top:${1070 - 1089 * SWS}px;width:${491 * SWS}px;height:${1089 * SWS}px;z-index:3`);
  const sw1 = E.img(sw, "sw", `position:absolute;left:0;top:0;width:${491 * SWS}px;height:${1089 * SWS}px`);
  const sw2 = E.img(sw, "sp", `position:absolute;left:0;top:0;width:${491 * SWS}px;height:${1089 * SWS}px;opacity:0`);
  E.F(t => { const p = t >= HAT; sw1.style.opacity = p ? 0 : 1; sw2.style.opacity = p ? 1 : 0; });
  const sway = []; for (let t = 0; t < WIN; t += .8) sway.push([t, 0, "io"], [t + .4, -3, "io"]);
  E.K(sw, "r", sway);                                                                                    // frame-0 motion
  E.el(top, "abs", "left:60px;top:410px;background:#1d2b36;color:#fff;font-weight:900;font-size:34px;padding:4px 16px;border-radius:10px;z-index:6", "STOCKHOLM");
  thermo(top, 450, 520, "OUTSIDE", [[0, -10]], x => x > 15);
  thermo(top, 450, 690, "INSIDE", [[0, 22]], x => x > 15);

  const bot = E.el(SPLIT, "abs", `left:0;top:${MID}px;width:1080px;height:${1920 - MID}px;overflow:hidden;background:#dfe4e2`);
  E.el(bot, "abs", "left:0;top:0;width:1080px;height:10px;background:#1d2b36");
  const mould = E.el(bot, "abs", "left:700px;top:-40px;width:420px;height:380px;border-radius:50%;background:radial-gradient(circle at 70% 30%,rgba(60,80,50,.75),rgba(80,100,60,.45) 45%,transparent 70%);transform-origin:100% 0");
  E.K(mould, "s", [[0, .35], [BURR, .7], [HAT + 1.5, 1.1]]);
  const bwn = E.el(bot, "abs", "left:60px;top:90px;width:360px;height:380px;border:16px solid #fff;border-radius:12px;overflow:hidden;background:linear-gradient(180deg,#63b8f0,#bfe6ff)");
  E.el(bwn, "abs", "left:220px;top:30px;width:110px;height:110px;border-radius:50%;background:#ffd23f;box-shadow:0 0 40px 20px rgba(255,210,63,.6)");
  E.el(bwn, "abs", "left:0;top:260px;width:100%;height:120px;background:#f2c56b");
  E.el(bot, "abs", "left:0;top:730px;width:1080px;height:100px;background:#9c7a5a");
  const oL = E.el(bot, "abs", `left:720px;top:${740 - 1065 * .6}px;width:${458 * .6}px;height:${1065 * .6}px;z-index:3;transform-origin:50% 100%`);
  const o1 = E.img(oL, "shiv", `position:absolute;left:${(458 - 388) * .3}px;bottom:0;width:${388 * .6}px;height:${1055 * .6}px`);
  const o2 = E.img(oL, "bur", `position:absolute;left:0;bottom:0;width:${458 * .6}px;height:${1065 * .6}px;opacity:0`);
  E.F(t => { const b = t >= BURR; o1.style.opacity = b ? 0 : 1; o2.style.opacity = b ? 1 : 0; });
  E.K(oL, "s", [[BURR - .01, 1], [BURR, 1.15], [BURR + .3, 1, "out"]]);
  const jit = []; for (let t = 0; t < WIN; t += .1) jit.push([t, (Math.round(t * 10) % 2 ? 4 : -4)]);
  E.K(oL, "x", jit);                                                                                     // he shivers
  const puffs = [0, 1, 2].map(() => E.el(bot, "abs", "left:830px;top:200px;width:70px;height:46px;border-radius:50%;background:rgba(255,255,255,.9);z-index:4;opacity:0"));
  E.F(t => puffs.forEach((p, i) => { const u = ((t + i * .5) % 1.5) / 1.5; p.style.opacity = t < WIN ? (1 - u) * .9 : 0; p.style.transform = `translate(${-u * 90}px,${-u * 70}px) scale(${.6 + u})`; }));
  E.el(bot, "abs", "left:60px;top:24px;background:#1d2b36;color:#fff;font-weight:900;font-size:34px;padding:4px 16px;border-radius:10px;z-index:6", "LISBON");
  thermo(bot, 460, 110, "OUTSIDE", [[0, 18]], x => x > 15);
  thermo(bot, 460, 280, "INSIDE", [[0, 11], [BURR, 11], [BURR + .6, 9]], x => x > 15);

  // ================= full screen Lisbon: open the window =================
  const L = layer(WIN, OUT);
  E.el(L, "abs", "inset:0;background:#dfe4e2");
  const m2 = E.el(L, "abs", "left:-140px;top:560px;width:520px;height:480px;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(60,80,50,.75),rgba(80,100,60,.45) 45%,transparent 70%)");
  const WX = 560, WY = 560, WW = 440, WH = 700;
  const view = E.el(L, "abs", `left:${WX}px;top:${WY}px;width:${WW}px;height:${WH}px;overflow:hidden;background:linear-gradient(180deg,#63b8f0,#bfe6ff)`);
  E.el(view, "abs", "left:260px;top:40px;width:130px;height:130px;border-radius:50%;background:#ffd23f;box-shadow:0 0 50px 26px rgba(255,210,63,.6)");
  E.el(view, "abs", "left:0;top:470px;width:100%;height:230px;background:#f2c56b");
  E.img(E.el(view, "abs", `left:20px;top:${520 - 636 * .55}px;width:${745 * .55}px;height:${636 * .55}px`), "locals", `width:${745 * .55}px;height:${636 * .55}px`);
  const lp = E.el(L, "abs", `left:${WX - 16}px;top:${WY - 16}px;width:${WW / 2 + 16}px;height:${WH + 32}px;border:16px solid #fff;border-right-width:8px;box-sizing:border-box;background:rgba(200,225,240,.55);transform-origin:0 50%;z-index:2`);
  const rp = E.el(L, "abs", `left:${WX + WW / 2}px;top:${WY - 16}px;width:${WW / 2 + 16}px;height:${WH + 32}px;border:16px solid #fff;border-left-width:8px;box-sizing:border-box;background:rgba(200,225,240,.55);transform-origin:100% 50%;z-index:2`);
  E.K(lp, "sx", [[OPEN, 1], [OPEN + .4, .12, "out"]]); E.K(rp, "sx", [[OPEN, 1], [OPEN + .4, .12, "out"]]);
  E.el(L, "abs", `left:0;top:1560px;width:1080px;height:360px;background:#9c7a5a`);
  const ow = E.el(L, "abs", `left:60px;top:${1600 - 1050 * .85}px;width:${699 * .85}px;height:${1050 * .85}px;z-index:3;transform-origin:50% 100%`);
  const w1 = E.img(ow, "bur", `position:absolute;left:60px;bottom:0;width:${458 * .85}px;height:${1065 * .85}px`);
  const w2 = E.img(ow, "win", `position:absolute;left:0;bottom:0;width:${699 * .85}px;height:${1050 * .85}px;opacity:0`);
  E.F(t => { const o = t >= OPEN - .15; w1.style.opacity = o ? 0 : 1; w2.style.opacity = o ? 1 : 0; });
  E.K(ow, "x", [[WIN, -60], [WIN + .6, 0, "out"]]);
  const waves = [0, 1, 2, 3].map(i => E.el(L, "abs", `left:${WX - 40}px;top:${760 + i * 90}px;width:220px;height:40px;border-top:10px solid rgba(255,150,60,.85);border-radius:50%;z-index:4;opacity:0`));
  E.F(t => waves.forEach((w, i) => { const u = ((t - OPEN - .3 + i * .25) % 1.2) / 1.2; const on = t > OPEN + .3; w.style.opacity = on ? (1 - u) : 0; w.style.transform = `translateX(${-u * 380}px)`; }));
  thermo(L, 100, 470, "INSIDE", [[WIN, 9], [OPEN + .4, 9], [OPEN + 1.8, 14]], x => x > 12);

  // ================= outside: warming up on a bench =================
  const O = layer(OUT, DUR);
  E.el(O, "abs", "inset:0;background:linear-gradient(180deg,#63b8f0,#cdeeff)");
  E.el(O, "abs", "left:760px;top:470px;width:170px;height:170px;border-radius:50%;background:#ffd23f;box-shadow:0 0 70px 36px rgba(255,210,63,.6)");
  for (let i = 0; i < 4; i++) E.el(O, "abs", `left:${-40 + i * 290}px;top:${780 - (i % 2) * 60}px;width:260px;height:${660 + (i % 2) * 60}px;background:${["#f5c9a8", "#ffe29a", "#bfe0d6", "#f7b7b7"][i]};border-radius:6px;box-shadow:inset 0 -20px 0 rgba(0,0,0,.05)`);
  for (let i = 0; i < 8; i++) E.el(O, "abs", `left:${-10 + (i % 4) * 290 + 60}px;top:${860 + Math.floor(i / 4) * 200 - ((i % 4) % 2) * 60}px;width:90px;height:120px;background:#3d5a73;border:8px solid #fff;border-radius:44px 44px 4px 4px`);
  E.el(O, "abs", "left:0;top:1440px;width:1080px;height:480px;background:repeating-linear-gradient(45deg,#e9e3d6 0 34px,#d8cfbd 34px 68px)");   // calçada
  const bn = E.el(O, "abs", `left:40px;top:${1600 - 939 * .78}px;width:${824 * .78}px;height:${939 * .78}px;z-index:3`);
  E.img(bn, "bench", `width:${824 * .78}px;height:${939 * .78}px`);
  E.K(bn, "y", [[OUT, 0], [OUT + .8, -6, "io"], [OUT + 1.6, 0, "io"], [OUT + 2.4, -6, "io"], [OUT + 3.2, 0, "io"], [OUT + 4, -6, "io"], [OUT + 4.8, 0, "io"]]);
  const lc = E.el(O, "abs", `left:640px;top:${1620 - 636 * .62}px;width:${745 * .62}px;height:${636 * .62}px;z-index:3`);
  E.img(lc, "locals", `width:${745 * .62}px;height:${636 * .62}px`);
  thermo(O, 100, 470, "OUTSIDE", [[OUT, 18]], x => x > 12);

  // ================= bubbles =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 54) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:9;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:18px 26px 22px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]); E.S(t0 + .02, "pop", .5);
    return b;
  };
  bubble("It's so cozy here!", 520, 335, 470, 330, COZY, HAT - .1, 50);
  bubble("Why are you wearing a hat inside?", 470, 335, 520, 380, HAT, 7.0, 44);
  bubble("Why AREN'T you?!", 630, 1100, 430, 190, 6.6, WIN - .05, 50);
  bubble("Let the warm air in…", 60, 620, 480, 240, OPEN + .5, OUT - .1, 50);

  // ================= stamp =================
  const sb = E.el(S.el, "abs", "left:60px;top:660px;width:960px;display:flex;justify-content:center;z-index:9");
  const st = E.stamp(sb, "WARMER OUTSIDE.", OUT + 1.3, { size: 96, rot: -6, bg: C.mint, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/wind-gust.wav", { vol: .5, duck: false });
  E.clip(.2, "sfx/teeth-chatter.wav", { vol: .9 }); E.clip(2.2, "sfx/teeth-chatter.wav", { vol: .8 });
  E.S(BURR, "poof", .8); E.clip(BURR + .3, "sfx/teeth-chatter.wav", { vol: .7 });
  E.clip(6.0, "sfx/teeth-chatter.wav", { vol: .6 });
  E.S(WIN, "whoosh", .5);
  E.S(OPEN, "creak", .9);
  E.clip(OPEN + .2, "sfx/street-sunny.wav", { vol: 3.5, duck: false, gain: [[OPEN + .2, 0], [OPEN + 1.0, 1]] });
  E.S(OPEN + 1.8, "ding", .6);
  E.S(OUT, "whoosh", .5);
  E.clip(OUT, "sfx/street-sunny.wav", { vol: 3.5, duck: false });

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Winter: *Sweden* vs *Portugal*", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[15.8, 1], [16.05, 1.18, "out"], [16.4, 1, "io"]]);
}
