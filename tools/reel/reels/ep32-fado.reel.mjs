// EP.32 "A night at the fado house" — candlelight, "SILÊNCIO, POR FAVOR". Otto's crisp packet CRINKLES (the audience pops up:
// shhh), he CRUNCHES (SHHH!), then his phone RINGS: the music dies, the singer glares. "…Sorry." Twist: she carries on — pointing
// at him — singing a sad fado about the boy with the crisps. Sound-led: ElevenLabs fado guitar, crinkle, crunch, shush, ringtone.
export const meta = {
  id: "ep32-fado", date: "2026-10-25",
  images: {
    sing: "characters/cutouts/fadista_sing.webp", glare: "characters/cutouts/fadista_glare.webp", point: "characters/cutouts/fadista_point.webp",
    guitar: "characters/cutouts/guitarist.webp", crisps: "characters/cutouts/otto-chair_crisps.webp", phone: "characters/cutouts/otto-chair_phone.webp",
    aud: "characters/cutouts/fado_audience.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ off: true });                                                         // the recorded fado is the music
  const DUR = 14.8;
  const S = E.scene("fado", 0, DUR, "dark"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const CRINKLE = 2.2, CRUNCH = 4.6, RING = 7.0, SORRY = 9.2, SONG = 10.4, FLOOR = 1640;

  // ---------------- the room: dark red walls, dim azulejo, candles ----------------
  const room = E.el(S.el, "abs", "inset:0;transform-origin:300px 1300px");
  E.el(room, "abs", "left:-40px;top:-40px;width:1160px;height:2000px;background:radial-gradient(ellipse at 60% 45%,#6b2a22,#2a0e0c 75%)");
  const tileSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#e9dcc6'/><g fill='#2f4f85'><circle cx='60' cy='60' r='9'/><ellipse cx='60' cy='36' rx='8' ry='15'/><ellipse cx='60' cy='84' rx='8' ry='15'/><ellipse cx='36' cy='60' rx='15' ry='8'/><ellipse cx='84' cy='60' rx='15' ry='8'/></g></svg>`;
  E.el(room, "abs", `left:-40px;top:1150px;width:1160px;height:500px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tileSvg)}");background-size:120px 120px;opacity:.28`);
  E.el(room, "abs", `left:-40px;top:${FLOOR}px;width:1160px;height:400px;background:#3a1a10`);
  // a warm spotlight on the singer
  const spot = E.el(room, "abs", "left:360px;top:420px;width:720px;height:1300px;background:radial-gradient(ellipse at 50% 55%,rgba(255,210,140,.42),rgba(255,210,140,0) 62%)");
  E.F(t => { spot.style.opacity = t >= RING && t < SONG ? .25 : 1; });
  // the guitarist, seated behind
  const GS = .58, gt = E.el(room, "abs", `left:40px;top:${1470 - 1028 * GS}px;width:${728 * GS}px;height:${1028 * GS}px;filter:brightness(.8)`);
  E.img(gt, "guitar", `width:${728 * GS}px;height:${1028 * GS}px`);
  const strum = []; for (let t = 0; t < DUR; t += .5) strum.push([t, 0, "io"], [t + .25, 1.5, "io"]);
  E.K(gt, "r", strum.map(([t, v, e]) => [t, (t >= RING && t < SONG) ? 0 : v, e])); gt.style.transformOrigin = "50% 100%";
  // the singer
  const SS = .9, sg = E.el(room, "abs", `left:430px;top:${FLOOR - 1069 * SS + 20}px;width:${667 * SS}px;height:${1069 * SS}px`);
  const ST = ["sing", "glare", "point"];
  const sim = ST.map(n => E.img(sg, n, `position:absolute;left:0;top:0;width:${667 * SS}px;height:${1069 * SS}px`));
  E.F(t => {
    const f = at([[0, "sing"], [RING + .3, "glare"], [SONG, "point"]], t); sim.forEach((im, i) => { im.style.opacity = ST[i] === f ? 1 : 0; });
    sg.style.transform = f === "glare" ? "none" : `rotate(${Math.sin(t * 1.4) * 1.5}deg)`;
  });
  sg.style.transformOrigin = "50% 100%";

  // ---------------- Otto at his little table (front left) ----------------
  const OS = .78, ot = E.el(room, "abs", `left:-30px;top:${1860 - 1057 * OS}px;width:${567 * OS}px;height:${1057 * OS}px;transform-origin:50% 100%`);
  const OT = ["crisps", "phone"];
  const oim = OT.map(n => E.img(ot, n, `position:absolute;left:0;top:0;width:${567 * OS}px;height:${1057 * OS}px`));
  E.F(t => {
    const f = t >= RING && t < SONG - .5 ? "phone" : "crisps"; oim.forEach((im, i) => { im.style.opacity = OT[i] === f ? 1 : 0; });
    let sy = 1; if (t >= SONG) sy = 1 - Math.min(1, (t - SONG) / 2.5) * .14;
    ot.style.transform = `scaleY(${sy})` + (f === "phone" && t < RING + 1.6 ? ` rotate(${Math.sin(t * 70) * 1.5}deg)` : "");
  });
  E.el(room, "abs", "left:-20px;top:1650px;width:470px;height:26px;border-radius:12px;background:#5a2e1c;box-shadow:0 8px 0 #3a1a10");
  E.el(room, "abs", "left:200px;top:1676px;width:26px;height:250px;background:#4a2414");
  const candle = (x, y) => {
    E.el(room, "abs", `left:${x}px;top:${y}px;width:26px;height:60px;border-radius:4px;background:#f3ead6`);
    const fl = E.el(room, "abs", `left:${x + 3}px;top:${y - 36}px;width:20px;height:34px;border-radius:50% 50% 45% 45%;background:radial-gradient(circle at 50% 70%,#fff4c2,#ffb23b 60%,rgba(255,120,30,0));box-shadow:0 0 30px 12px rgba(255,190,90,.45)`);
    E.F(t => { fl.style.transform = `scale(${1 + Math.sin(t * 13 + x) * .08},${1 + Math.sin(t * 9 + x) * .12})`; });
  };
  candle(330, 1592); candle(930, 1520);

  // ---------------- the audience pops up to shush him ----------------
  const AS = .78, AW = 1024 * AS, AH = 607 * AS;
  const aud = E.el(S.el, "abs", `left:${1080 - AW + 30}px;top:${1920 - AH}px;width:${AW}px;height:${AH}px;z-index:4`);
  E.img(aud, "aud", `width:${AW}px;height:${AH}px`);
  const popY = []; for (const [a, b] of [[CRINKLE + .3, CRUNCH - .3], [CRUNCH + .2, RING - .2], [RING + .2, SONG + 3.2]]) popY.push([a - .01, AH + 20], [a, AH + 20], [a + .22, 0, "back"], [b - .2, 0], [b, AH + 20, "in"]);
  E.K(aud, "y", [[0, AH + 20], ...popY]);
  E.K(aud, "sy", [[CRUNCH + .2, .9], [CRUNCH + .42, 1.06, "back"], [CRUNCH + .6, 1]]);

  // ---------------- sound ----------------
  const fado = (t0, t1, vol) => { for (let t = t0; t < t1 - .05; t += 2.35) E.clip(t, "sfx/fado-music.wav", { vol, duck: false, to: Math.min(2.4, t1 - t) }); };
  fado(0, RING, .9);
  fado(SONG, DUR - .3, 1.15);
  E.clip(CRINKLE, "sfx/crinkle.wav", { vol: 1.1 });
  E.clip(CRINKLE + .35, "sfx/shush-crowd.wav", { vol: .6 });
  E.clip(CRUNCH, "sfx/crunch.wav", { vol: 1.4 });
  E.clip(CRUNCH + .25, "sfx/shush-crowd.wav", { vol: 1.0 });
  E.clip(RING, "sfx/ringtone.wav", { vol: .9, to: 1.6 });
  E.S(RING + .3, "scratch", .6);
  E.clip(SORRY, "voices/ep30/o_sorry.wav", { vol: 1.0 });
  E.S(SONG, "sparkle", .5);
  E.K(room, "s", [[RING, 1], [RING + 2, 1.06, "io"], [SONG, 1.06], [SONG + .4, 1, "io"]]);

  // ---------------- text ----------------
  const sfxWord = (str, t0, t1, left, top, rot, size, col) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;z-index:8;font-weight:900;font-size:${size}px;color:${col};-webkit-text-stroke:10px #1a0806;paint-order:stroke fill;transform:rotate(${rot}deg);white-space:nowrap;opacity:0`, str);
    E.K(b, "o", [[t0 - .01, 0], [t0, 1], [t1 - .1, 1], [t1, 0]]); E.K(b, "s", [[t0, .3], [t0 + .22, 1.12, "back"], [t0 + .4, 1]]);
  };
  sfxWord("crinkle…", CRINKLE, CRUNCH - .2, 60, 860, -6, 70, "#ffe7b0");
  sfxWord("CRUNCH!", CRUNCH, RING - .2, 50, 840, 5, 110, "#ffb23b");
  sfxWord("RING RING!", RING, RING + 1.8, 40, 830, -5, 110, "#ff5d4a");
  const shush = (t0, t1, big) => { const b = E.el(S.el, "abs", `left:${big ? 520 : 600}px;top:1300px;z-index:8;font-weight:900;font-size:${big ? 100 : 70}px;color:#fff;-webkit-text-stroke:10px #1a0806;paint-order:stroke fill;opacity:0;white-space:nowrap`, big ? "SHHH!" : "shhh"); E.K(b, "o", [[t0 - .01, 0], [t0, 1], [t1 - .1, 1], [t1, 0]]); };
  shush(CRINKLE + .4, CRUNCH - .3, false); shush(CRUNCH + .3, RING - .2, true);
  const bubble = (html, left, top, w, tail, t0, t1) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:20px 28px 24px;box-shadow:0 10px 26px rgba(0,0,0,.35);font-weight:900;font-size:58px;line-height:1.04;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
  };
  bubble("…Sorry.", 40, 820, 320, 120, SORRY, SONG);
  // the sign on the wall
  const sign = E.el(S.el, "abs", `left:100px;top:352px;display:flex;flex-direction:column;background:#f3ead6;color:#2a0e0c;font-weight:900;padding:.12em .5em .16em;border-radius:.3em;z-index:7;box-shadow:0 6px 18px rgba(0,0,0,.35)`,
    `<div style="font-size:48px;letter-spacing:.04em">SILÊNCIO, POR FAVOR</div><div style="font-size:30px;opacity:.7">silence, please</div>`);
  E.K(sign, "r", [[0, -2], [RING, -2], [RING + .1, 6, "out"], [RING + .5, 4]]);
  // the lyric card for the twist
  const lyr = E.el(S.el, "abs", "left:80px;top:560px;width:920px;display:flex;flex-direction:column;align-items:center;gap:6px;z-index:8;opacity:0");
  E.el(lyr, "", "background:rgba(20,6,4,.8);color:#ffe7b0;font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:64px;padding:.12em .6em .16em;border-radius:.4em;white-space:nowrap", "♪ Ai, o rapaz das batatas… ♪");
  E.el(lyr, "", "background:rgba(20,6,4,.7);color:#fff;font-weight:800;font-size:40px;padding:.1em .5em .14em;border-radius:.4em;white-space:nowrap", "(oh, the boy with the crisps…)");
  E.K(lyr, "o", [[SONG + .3, 0], [SONG + .6, 1]]); E.K(lyr, "y", [[SONG + .3, 30], [SONG + .7, 0, "out"]]);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "A night at the *fado house*", { size: 58, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[14.0, 1], [14.25, 1.18, "out"], [14.6, 1, "io"]]);
}
