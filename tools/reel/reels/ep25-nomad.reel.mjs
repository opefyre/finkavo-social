// EP.25 "Digital nomad in Lisbon" — Instagram: laptop on a golden rooftop, #livingthedream. Reality: screen glare, the call
// ("Hi everyone! Can you hear me?"), a tram ("Sorry, there's a TRAM!"), a pigeon steals her pastel de nata, the WiFi freezes
// ("Hello?! You're frozen!"). Then the boss reconnects — from a beach: "Sorry! Bad signal here in the Algarve!"
// Voiced (ElevenLabs, branding/voices/ep25) with real effects. Paced per reel-pacing.
export const meta = {
  id: "ep25-nomad", date: "2026-10-18",
  images: {
    z_laptop: "characters/cutouts/zoe_laptop.webp", z_zoom: "characters/cutouts/zoe_zoom.webp", z_glare: "characters/cutouts/zoe_glare.webp", z_shock: "characters/cutouts/zoe_shock.webp",
    nico: "characters/cutouts/nico_default.webp", leo: "characters/cutouts/leo_default.webp", marta: "characters/cutouts/marta_default.webp",
    natas: "characters/props/food_natas.webp", pigeon: "characters/props/pigeon.webp", pigeon2: "characters/props/pigeon-nata.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 57, seed: 251, prog: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]] });
  const DUR = 15.2;
  const S = E.scene("roof", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const REAL = 2.5, HI = 4.0, TRAM = 5.9, BIRD = 8.1, FROZE = 9.7, BOSS = 11.7;

  // ---------------- the rooftop terrace ----------------
  const skyEl = E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px");
  E.F(t => {
    skyEl.style.background = t < REAL ? "linear-gradient(180deg,#ff9a5a,#ffd27a 55%,#ffe7b0)" : "linear-gradient(180deg,#7fc6f2,#e6f5fc)";
  });
  const sun = E.el(S.el, "abs", "left:760px;top:560px;width:200px;height:200px;border-radius:50%;background:#fff3b0;box-shadow:0 0 80px 40px rgba(255,240,170,.9)");
  E.F(t => { sun.style.transform = t < REAL ? "translateY(200px) scale(1.2)" : `scale(${1 + Math.sin(t * 6) * .05})`; sun.style.background = t < REAL ? "#ffb13b" : "#fffbe0"; });
  // distant rooftops of Lisbon
  const roofs = ["#c0643f", "#d27a4f", "#b85a3a", "#cf6e48"];
  for (let i = 0; i < 9; i++) E.el(S.el, "abs", `left:${i * 130 - 30}px;top:${940 + (i % 3) * 40}px;width:140px;height:${300}px;background:${["#f4c7a1", "#f7e3a3", "#bfe3d3", "#f2b8b0"][i % 4]};border-top:26px solid ${roofs[i % 4]}`);
  // the street between them, and the tram passing on it
  E.el(S.el, "abs", "left:0;top:1190px;width:1080px;height:60px;background:#9a9384");
  const tram = E.el(S.el, "abs", "left:1200px;top:1080px;width:380px;height:170px");
  E.el(tram, "abs", "left:0;top:20px;width:380px;height:150px;border-radius:22px 22px 8px 8px;background:#ffcf2e;box-shadow:inset 0 -20px 0 #e0a800");
  for (let i = 0; i < 5; i++) E.el(tram, "abs", `left:${25 + i * 70}px;top:40px;width:55px;height:55px;border-radius:8px;background:#3d5a73;border:3px solid #fff6d0`);
  E.K(tram, "x", [[TRAM, 0], [TRAM + 2.4, -1700, "lin"]]);
  // the terrace floor and railing
  E.el(S.el, "abs", "left:0;top:1250px;width:1080px;height:670px;background:#d9b99a;background-image:linear-gradient(90deg,rgba(0,0,0,.05) 2px,transparent 2px);background-size:120px 100%");
  E.el(S.el, "abs", "left:0;top:1170px;width:1080px;height:14px;background:#fff");
  for (let i = 0; i < 12; i++) E.el(S.el, "abs", `left:${i * 95 + 10}px;top:1184px;width:10px;height:70px;background:#fff`);
  // the café table with the pastel de nata and a coffee
  E.el(S.el, "abs", "left:640px;top:1480px;width:360px;height:26px;border-radius:13px;background:#fff;box-shadow:0 6px 0 #d5d5d5;z-index:2");
  E.el(S.el, "abs", "left:810px;top:1506px;width:20px;height:300px;background:#999;z-index:1");
  E.el(S.el, "abs", "left:740px;top:1800px;width:160px;height:16px;border-radius:8px;background:#888;z-index:1");
  const nata = E.el(S.el, "abs", `left:660px;top:${1484 - 150 * .6}px;width:${235 * .6}px;height:${150 * .6}px;z-index:3`);
  E.img(nata, "natas", `width:${235 * .6}px;height:${150 * .6}px`);
  E.el(S.el, "abs", "left:860px;top:1410px;width:80px;height:72px;border-radius:0 0 26px 26px;background:#fff;border:6px solid #6b3f1d;z-index:3");
  E.K(nata, "o", [[BIRD + .55, 1], [BIRD + .56, 0]]);
  // the pigeon: lands on the table, grabs the tart, flies off
  const pg = E.el(S.el, "abs", `left:600px;top:${1488 - 238 * .9}px;width:${244 * .9}px;height:${238 * .9}px;z-index:4;opacity:0`);
  E.img(pg, "pigeon", `width:${244 * .9}px;height:${238 * .9}px`);
  E.K(pg, "o", [[BIRD - .01, 0], [BIRD, 1], [BIRD + .55, 1], [BIRD + .56, 0]]);
  E.K(pg, "y", [[BIRD, -500], [BIRD + .3, 0, "out"]]); E.K(pg, "x", [[BIRD, 300], [BIRD + .3, 0, "out"]]);
  const pg2 = E.el(S.el, "abs", `left:590px;top:${1420 - 239 * 1.0}px;width:${287 * 1.0}px;height:${239 * 1.0}px;z-index:4;opacity:0`);
  E.img(pg2, "pigeon2", `width:${287 * 1.0}px;height:${239 * 1.0}px`);
  E.K(pg2, "o", [[BIRD + .55, 0], [BIRD + .56, 1], [BIRD + 1.4, 1], [BIRD + 1.41, 0]]);
  E.K(pg2, "x", [[BIRD + .55, 0], [BIRD + 1.4, 700, "in"]]); E.K(pg2, "y", [[BIRD + .55, 0], [BIRD + 1.4, -900, "in"]]);
  E.clip(BIRD - .05, "sfx/pigeon-flutter.wav", { vol: .7 });
  E.clip(BIRD + .55, "sfx/pigeon-flutter.wav", { vol: .9 });

  // ---------------- Zoe ----------------
  const ZS = .95, ZW = 597 * ZS, ZH = 1036 * ZS;
  const zoe = E.el(S.el, "abs", `left:10px;top:${1830 - ZH}px;width:${ZW}px;height:${ZH}px;z-index:3`);
  const ZT = ["z_laptop", "z_glare", "z_zoom", "z_shock"];
  const zim = ZT.map(n => E.img(zoe, n, `position:absolute;left:0;top:0;width:${ZW}px;height:${ZH}px`));
  E.F(t => {
    const f = at([[0, "z_laptop"], [REAL, "z_glare"], [HI - .1, "z_laptop"], [TRAM + .2, "z_zoom"], [BIRD + .5, "z_shock"], [FROZE - .1, "z_zoom"], [BOSS, "z_shock"]], t);
    zim.forEach((im, i) => { im.style.opacity = ZT[i] === f ? 1 : 0; });
  });
  E.clip(REAL, "sfx/wind-gust.wav", { vol: .6 });

  // ---------------- the "expectation" frame ----------------
  const insta = E.el(S.el, "abs", "inset:0;border:26px solid #fff;box-shadow:inset 0 0 0 4px rgba(0,0,0,.08);z-index:6;pointer-events:none");
  const tag = E.el(S.el, "abs", "left:60px;top:1700px;z-index:7;background:#fff;color:#c13584;font-weight:900;font-size:52px;padding:.1em .4em;border-radius:.4em;box-shadow:0 8px 20px rgba(0,0,0,.15)", "#livingthedream ✨");
  const heart = E.el(S.el, "abs", "left:880px;top:1690px;z-index:7;width:90px;height:84px");
  heart.innerHTML = `<svg viewBox="0 0 32 30" width="90" height="84"><path d="M16 29 C6 21 0 15 0 8.5 C0 3.8 3.6 0 8.2 0 C11.2 0 14 1.8 16 4.6 C18 1.8 20.8 0 23.8 0 C28.4 0 32 3.8 32 8.5 C32 15 26 21 16 29Z" fill="#ff3b5c"/></svg>`;
  E.K(heart, "s", [[0, .6], [.4, 1.2, "back"], [.7, 1]]);
  for (const el of [insta, tag, heart]) E.K(el, "o", [[REAL - .01, 1], [REAL, 0]]);
  E.flash(REAL, "#ffffff", .5, .25); E.S(REAL - .05, "swish", .8);
  const mode = E.el(S.el, "abs", `left:100px;top:352px;display:inline-block;color:#fff;font-weight:900;font-size:56px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7`, "INSTAGRAM");
  E.F(t => { const r = t >= REAL; const s = r ? "REALITY" : "INSTAGRAM"; if (mode.textContent !== s) mode.textContent = s; mode.style.background = r ? C.coralD : "#c13584"; });
  E.K(mode, "s", [[REAL - .01, 1], [REAL, 1.3], [REAL + .2, 1, "back"]]);

  // ---------------- the call window ----------------
  const win = E.el(S.el, "abs", "left:530px;top:480px;width:500px;height:420px;border-radius:24px;background:#1e2229;box-shadow:0 16px 40px rgba(0,0,0,.3);overflow:hidden;z-index:5;opacity:0");
  E.K(win, "o", [[HI - .15, 0], [HI, 1]]);
  const tile = (x, y, w, h, img, iw, dx, dy, bgc) => {
    const t = E.el(win, "abs", `left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:12px;overflow:hidden;background:${bgc}`);
    E.img(t, img, `position:absolute;left:${dx}px;top:${dy}px;width:${iw}px;height:auto`);
    return t;
  };
  const grid = E.el(win, "abs", "inset:0");
  const tiles = [tile(10, 10, 235, 190, "nico", 250, -10, -8, "#c9d7f2"), tile(255, 10, 235, 190, "leo", 250, -8, -6, "#f7e3a3"), tile(10, 210, 235, 190, "marta", 250, -8, -6, "#bfe3d3")];
  const me = E.el(grid, "abs", "left:255px;top:210px;width:235px;height:190px;border-radius:12px;background:#333;color:#fff;font-weight:900;font-size:34px;display:flex;align-items:center;justify-content:center", "You");
  // frozen: grey overlay + spinner
  const froze = E.el(win, "abs", "inset:0;background:rgba(40,40,40,.75);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;opacity:0");
  const spin = E.el(froze, "", "width:80px;height:80px;border-radius:50%;border:10px solid rgba(255,255,255,.3);border-top-color:#fff");
  E.el(froze, "", "color:#fff;font-weight:900;font-size:38px", "Reconnecting…");
  E.K(froze, "o", [[FROZE - .01, 0], [FROZE, 1], [BOSS - .01, 1], [BOSS, 0]]);
  E.F(t => { spin.style.transform = `rotate(${t * 400}deg)`; tiles.forEach(tl => { tl.style.filter = t >= FROZE && t < BOSS ? "grayscale(1) blur(2px)" : "none"; }); });
  // the boss, reconnected — full tile, on a beach
  const boss = E.el(win, "abs", "inset:0;opacity:0;overflow:hidden;background:linear-gradient(180deg,#7fc6f2 0 55%,#2f9bd6 55% 70%,#f1d59a 70%)");
  E.el(boss, "abs", "left:330px;top:40px;width:90px;height:90px;border-radius:50%;background:#ffe27a;box-shadow:0 0 40px #ffe27a");
  E.el(boss, "abs", "left:40px;top:130px;width:12px;height:200px;background:#8a5a2b;transform:rotate(-8deg)");
  E.el(boss, "abs", "left:-10px;top:110px;width:130px;height:60px;border-radius:60px 60px 0 0;background:#2f8f5b");
  E.img(boss, "nico", "position:absolute;left:110px;top:30px;width:300px;height:auto");
  E.K(boss, "o", [[BOSS - .01, 0], [BOSS, 1]]);
  E.K(win, "s", [[HI - .15, .6], [HI + .15, 1, "back"], [BOSS, 1], [BOSS + .25, 1.06, "back"]]);

  // ---------------- sound ----------------
  E.clip(HI - .2, "sfx/call-join.wav", { vol: .6 });
  E.clip(HI, "voices/ep25/z_hi.wav");
  E.clip(TRAM - .2, "sfx/tram-pass.wav", { vol: 1.0 });
  E.clip(TRAM + .5, "voices/ep25/z_tram.wav", { vol: 1.1 });
  E.clip(FROZE - .15, "sfx/call-drop.wav", { vol: .7 });
  E.clip(FROZE + .15, "voices/ep25/z_frozen.wav");
  E.clip(BOSS - .15, "sfx/call-join.wav", { vol: .6 });
  E.clip(BOSS + .1, "voices/ep25/b_algarve.wav");

  // ---------------- bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 66 : 54}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Hi everyone! Can you hear me?", 40, 560, 480, "l", HI, TRAM + .3);
  bubble("Sorry, there's a TRAM!", 40, 580, 480, "l", TRAM + .5, BIRD + .4, true);
  bubble("Hello?! You're frozen!", 40, 580, 480, "l", FROZE + .15, BOSS, true);
  bubble("Sorry! Bad signal here in the Algarve!", 440, 940, 610, "r", BOSS + .1, DUR - .6);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Digital nomad in *Lisbon*", { size: 60, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[14.5, 1], [14.75, 1.18, "out"], [15.05, 1, "io"]]);
}
