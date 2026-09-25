// EP.44 "Speaking Spanish in Portugal" — a sunny café terrace in Lisbon. Buck, loud and happy: "¡Hola, amigo! ¡Una cerveza, por
// favor!" Record scratch: the waiter's eye twitches, the whole terrace turns round, a school map of Iberia drops down with a pin on
// Lisbon. Waiter, deadpan: "We speak Portuguese here. But English is fine, mate." Buck: "Oh! Sorry, sorry! Obrigado!" — the terrace
// relaxes, the beer arrives… and Buck leaves with "¡Adiós, amigo!" The map drops again, the waiter facepalms. Voiced (Buck, the
// waiter) with terrace ambience. Paced per the skit guide.
export const meta = {
  id: "ep44-spanish", date: "2026-11-06",
  images: {
    hola: "characters/cutouts/buck_hola.webp", sorry: "characters/cutouts/buck_sorry.webp",
    wt: "characters/cutouts/waiter_tray.webp", wo: "characters/cutouts/waiter_offended.webp", wf: "characters/cutouts/waiter_facepalm.webp",
    fans: "characters/cutouts/fans_stare.webp", map: "characters/props/map-iberia.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 62, seed: 441, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 17.0, FLOOR = 1860;
  const S = E.scene("terrace", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const HOLA = .4, SCR = 3.15, MAP = 4.1, PORT = 5.2, ENG = 7.0, SORRY = 8.9, BEER = 11.9, ADIOS = 12.6, AGAIN = 13.8;

  // ---------------- the terrace ----------------
  const tileSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90'><rect width='90' height='90' fill='#f7f3ea'/><rect x='2' y='2' width='86' height='86' rx='4' fill='none' stroke='#9fc0e0' stroke-width='3'/><circle cx='45' cy='45' r='14' fill='none' stroke='#2f6db5' stroke-width='6'/><circle cx='45' cy='45' r='5' fill='#f2b632'/><path d='M45 4 V20 M45 70 V86 M4 45 H20 M70 45 H86' stroke='#2f6db5' stroke-width='6'/></svg>`;
  E.el(S.el, "abs", "inset:0;background:#f6d98b");                                                           // a yellow Lisbon facade
  E.el(S.el, "abs", `left:0;top:1000px;width:1080px;height:${FLOOR - 1000}px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tileSvg)}");background-size:90px 90px`);
  for (const x of [80, 440, 800]) { E.el(S.el, "abs", `left:${x}px;top:430px;width:200px;height:300px;background:#3d5a73;border:12px solid #fff;border-radius:100px 100px 6px 6px`); E.el(S.el, "abs", `left:${x - 20}px;top:730px;width:240px;height:18px;background:#fff;border-radius:4px`); }
  const aw = E.el(S.el, "abs", "left:-20px;top:840px;width:1120px;height:130px;background:repeating-linear-gradient(90deg,#2f9e6f 0 70px,#f4f4f4 70px 140px);border-radius:0 0 26px 26px;box-shadow:0 10px 16px rgba(0,0,0,.15)");
  E.el(aw, "abs", "left:0;bottom:-24px;width:100%;height:30px;background:radial-gradient(circle at 35px 0,#2f9e6f 26px,transparent 27px);background-size:140px 30px");
  E.el(S.el, "abs", `left:0;top:${FLOOR - 20}px;width:1080px;height:${1940 - FLOOR}px;background:repeating-linear-gradient(135deg,#ece6d8 0 30px,#d9d0bd 30px 60px)`);   // calçada
  E.el(S.el, "abs", `left:0;top:${FLOOR - 26}px;width:1080px;height:10px;background:#bfb49c`);
  // a café table between them
  E.el(S.el, "abs", `left:430px;top:${FLOOR - 260}px;width:220px;height:26px;border-radius:13px;background:#f4f4f4;border:4px solid #c8c8c8;z-index:2`);
  E.el(S.el, "abs", `left:532px;top:${FLOOR - 236}px;width:16px;height:220px;background:#8a8a8a;z-index:2`);
  E.el(S.el, "abs", `left:470px;top:${FLOOR - 24}px;width:140px;height:14px;border-radius:7px;background:#8a8a8a;z-index:2`);
  const beer = E.el(S.el, "abs", `left:505px;top:${FLOOR - 350}px;width:70px;height:92px;border-radius:6px 6px 14px 14px;background:linear-gradient(180deg,#fff 0 22%,#f2b632 22%);border:4px solid rgba(255,255,255,.9);z-index:3;opacity:0`);
  E.K(beer, "o", [[BEER - .01, 0], [BEER, 1]]); E.K(beer, "y", [[BEER, -260], [BEER + .25, 0, "in"]]);

  // ---------------- Buck (left) and the waiter (right) ----------------
  const bk = E.el(S.el, "abs", `left:-110px;top:${FLOOR - 996 * .82}px;width:${830 * .82}px;height:${996 * .82}px;z-index:3;transform-origin:50% 100%`);
  const b1 = E.img(bk, "hola", `position:absolute;left:0;top:0;width:${830 * .82}px;height:${996 * .82}px`);
  const b2 = E.img(bk, "sorry", `position:absolute;left:0;top:0;width:${830 * .82}px;height:${996 * .82}px;opacity:0`);
  E.F(t => { const s = t >= SORRY - .05 && t < ADIOS - .1; b1.style.opacity = s ? 0 : 1; b2.style.opacity = s ? 1 : 0; });
  const bob = []; for (let t = 0; t < SCR; t += .8) bob.push([t, 0, "io"], [t + .4, -12, "io"]);
  E.K(bk, "y", bob);                                                                                          // frame-0 motion
  const wk = E.el(S.el, "abs", `left:505px;top:${FLOOR - 1050 * .9}px;width:${628 * .9}px;height:${1050 * .9}px;z-index:3;transform-origin:50% 100%`);
  const wIm = ["wt", "wo", "wf"].map((n, i) => E.img(wk, n, `position:absolute;left:0;top:0;width:${628 * .9}px;height:${1050 * .9}px;opacity:${i ? 0 : 1}`));
  const WF = [[0, "wt"], [SCR, "wo"], [ENG, "wt"], [AGAIN, "wf"]];
  E.F(t => { const f = at(WF, t); wIm.forEach((x, i) => { x.style.opacity = ["wt", "wo", "wf"][i] === f ? 1 : 0; }); });
  const twitch = []; for (const t0 of [SCR + .35, SCR + .85, PORT + 1.2]) twitch.push([t0 - .01, 1], [t0, 1.04], [t0 + .06, .98], [t0 + .12, 1.02], [t0 + .18, 1]);
  E.K(wk, "s", twitch);

  // ---------------- the terrace turns round (twice) ----------------
  const fans = E.el(S.el, "abs", `left:${540 - 1024 * .55}px;top:${1920 - 623 * .75}px;width:${1024 * 1.1}px;height:${623 * 1.1}px;z-index:6;opacity:0`);
  E.img(fans, "fans", `width:${1024 * 1.1}px;height:${623 * 1.1}px`);
  E.K(fans, "o", [[SCR + .2, 0], [SCR + .21, 1], [SORRY + 1.6, 1], [SORRY + 1.61, 0], [AGAIN + .1, 0], [AGAIN + .11, 1]]);
  E.K(fans, "y", [[SCR + .2, 500], [SCR + .45, 0, "out"], [SORRY + 1.2, 0], [SORRY + 1.6, 500, "in"], [AGAIN + .1, 500], [AGAIN + .35, 0, "out"]]);

  // ---------------- the map of Iberia ----------------
  const MW = 500, mapBox = E.el(S.el, "abs", `left:60px;top:430px;width:${MW}px;height:${MW + 30}px;z-index:7;transform-origin:50% 0;opacity:0`);
  E.el(mapBox, "abs", `left:-16px;top:0;width:${MW + 32}px;height:28px;border-radius:14px;background:#8a5a2b;box-shadow:0 4px 8px rgba(0,0,0,.25)`);
  const sheet = E.el(mapBox, "abs", `left:0;top:18px;width:${MW}px;height:${MW}px;overflow:hidden;border:6px solid #fff;box-shadow:0 12px 26px rgba(0,0,0,.28);transform-origin:50% 0`);
  E.img(sheet, "map", `width:${MW}px;height:${MW}px`);
  E.el(sheet, "abs", `left:${MW * .01}px;top:${MW * .83}px;background:#1f7a3a;color:#fff;font-weight:900;font-size:26px;padding:2px 10px;border-radius:8px`, "PORTUGAL");
  E.el(sheet, "abs", `left:${MW * .44}px;top:${MW * .44}px;background:#c77d12;color:#fff;font-weight:900;font-size:26px;padding:2px 10px;border-radius:8px`, "ESPAÑA");
  const ring = E.el(sheet, "abs", `left:${MW * .02}px;top:${MW * .24}px;width:${MW * .3}px;height:${MW * .56}px;border:8px solid #e5484d;border-radius:50%`);
  const pin = E.el(sheet, "abs", `left:${MW * .08}px;top:${MW * .56}px;width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#e5484d;border:4px solid #fff`);
  E.K(ring, "s", [[MAP + .5, .6], [MAP + .8, 1, "back"], [MAP + 1.3, 1.08, "io"], [MAP + 1.8, 1, "io"], [MAP + 2.3, 1.08, "io"], [MAP + 2.8, 1, "io"]]);
  E.K(mapBox, "o", [[MAP - .01, 0], [MAP, 1], [SORRY + .6, 1], [SORRY + .61, 0], [AGAIN + .3, 0], [AGAIN + .31, 1]]);
  E.K(sheet, "sy", [[MAP, .02], [MAP + .35, 1, "out"], [SORRY + .1, 1], [SORRY + .6, .02, "in"], [AGAIN + .3, .02], [AGAIN + .5, 1, "out"]]);

  // ---------------- bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 56) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:9;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:20px 28px 24px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("¡Hola, amigo! ¡Una cerveza, por favor!", 40, 700, 560, 220, HOLA, SCR + .3, 54);
  bubble("We speak Portuguese here.", 580, 660, 460, 200, PORT, ENG - .05, 50);
  bubble("But English is fine, mate.", 580, 660, 460, 200, ENG, SORRY - .05, 50);
  bubble("Oh! Sorry, sorry! Obrigado!", 40, 740, 520, 220, SORRY, ADIOS - .15, 52);
  bubble("¡Adiós, amigo!", 40, 740, 460, 220, ADIOS, DUR - .5, 62);
  const ok = E.el(S.el, "abs", "left:900px;top:700px;width:110px;height:110px;border-radius:50%;background:#1f7a3a;color:#fff;font-weight:900;font-size:70px;display:flex;align-items:center;justify-content:center;z-index:8;opacity:0", "✓");
  E.pop(ok, SORRY + 2.3, { from: .3, dur: .3 }); E.K(ok, "o", [[SORRY + 2.3, 0], [SORRY + 2.4, 1], [ADIOS - .1, 1], [ADIOS, 0]]);

  // ---------------- stamp ----------------
  const sb = E.el(S.el, "abs", "left:60px;top:1250px;width:960px;display:flex;justify-content:center;z-index:10");
  const st = E.stamp(sb, "IT'S OBRIGADO.", AGAIN + .9, { size: 100, rot: -6, bg: C.coralD, shake: 12 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  E.clip(0, "sfx/cafe-morning.wav", { vol: .35, duck: false, to: SCR });
  E.clip(HOLA, "voices/ep44/b_hola.wav", { vol: 1.1 });
  E.S(SCR, "scratch", 1);
  E.clip(SCR + .35, "sfx/eye-twitch.wav", { vol: .6 }); E.clip(SCR + .85, "sfx/eye-twitch.wav", { vol: .6 });
  E.clip(MAP, "sfx/crinkle.wav", { vol: .6, to: .5 }); E.S(MAP + .35, "thud", .7);
  E.clip(PORT, "voices/ep44/w_port.wav", { vol: 1.2 });
  E.clip(ENG, "voices/ep44/w_eng.wav", { vol: 1.2 });
  E.clip(SORRY, "voices/ep44/b_sorry.wav", { vol: 1.1 });
  E.clip(SORRY + 1.2, "sfx/cafe-morning.wav", { vol: .35, duck: false, to: AGAIN - SORRY - 1.2 });
  E.S(SORRY + 2.3, "ding", .6);
  E.clip(BEER + .25, "sfx/plate-down.wav", { vol: .6 });
  E.clip(ADIOS, "voices/ep44/b_adios.wav", { vol: 1.1 });
  E.S(AGAIN, "scratch", .8); E.clip(AGAIN + .3, "sfx/crowd-groan.wav", { vol: 3 }); E.S(AGAIN + .5, "thud", .7);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Speaking *Spanish* in Portugal", { size: 50, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[16.2, 1], [16.45, 1.18, "out"], [16.8, 1, "io"]]);
}
