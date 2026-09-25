// EP.22 "Grandma parks the car" — a tiny gap, a tiny car. Forward, back, bump, forward… MOVES 1 → 37 while a crowd gathers on
// the pavement (Buck arrives with popcorn). She slides in perfectly — applause — then: "Oh… wrong street." and drives off.
// No voice: a visual gag carried by real effects (ElevenLabs sound generation, branding/sfx). Paced per reel-pacing.
export const meta = {
  id: "ep22-parking", date: "2026-10-15",
  images: {
    g_drive: "characters/cutouts/dona-car_drive.webp", g_proud: "characters/cutouts/dona-car_proud.webp", g_oh: "characters/cutouts/dona-car_oh.webp",
    car: "characters/props/car.webp",
    leo: "characters/cutouts/leo_default.webp", marta: "characters/cutouts/marta_default.webp", nico: "characters/cutouts/nico_default.webp",
    zoe: "characters/cutouts/zoe_default.webp", buck: "characters/cutouts/buck_popcorn.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 57, seed: 221, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [9, 12, 16]] });
  const DUR = 15.2;
  const S = E.scene("street", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const WALK = 1330, ROAD = 1780;
  const IN = 9.3, CLAP = 9.8, OH = 11.9, AWAY = 13.0;

  // ---------------- a Lisbon street ----------------
  E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;background:linear-gradient(180deg,#8fcdf0,#dff2fb)");
  const facade = ["#f4c7a1", "#f7e3a3", "#bfe3d3", "#f2b8b0"];
  for (let i = 0; i < 4; i++) {
    const b = E.el(S.el, "abs", `left:${i * 280 - 20}px;top:${440 + (i % 2) * 60}px;width:290px;height:${WALK - 440 - (i % 2) * 60}px;background:${facade[i]};border-top:36px solid #c0643f`);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) E.el(b, "abs", `left:${46 + c * 120}px;top:${60 + r * 230}px;width:84px;height:130px;background:#3d5a73;border:8px solid #fff;border-radius:42px 42px 4px 4px`);
    if (i % 2) E.el(b, "abs", `left:0;top:${WALK - 440 - 60 - 220}px;width:290px;height:220px;background-image:repeating-linear-gradient(45deg,#2f6db5 0 10px,#fff 10px 30px);opacity:.5`);
  }
  E.el(S.el, "abs", `left:0;top:${WALK}px;width:1080px;height:110px;background:#c9c0b0;background-image:radial-gradient(circle at 20px 20px,rgba(0,0,0,.1) 8px,transparent 9px);background-size:40px 40px`);  // calçada
  E.el(S.el, "abs", `left:0;top:${WALK + 110}px;width:1080px;height:22px;background:#9a9384`);                                    // kerb
  E.el(S.el, "abs", `left:0;top:${WALK + 132}px;width:1080px;height:${1920 - WALK - 132}px;background:#6f7479`);                  // road
  for (let i = 0; i < 6; i++) E.el(S.el, "abs", `left:${i * 200 + 30}px;top:1860px;width:110px;height:14px;background:#e9e5d8`);

  // ---------------- the crowd on the pavement (behind the cars) ----------------
  const crowd = [["leo", 514, 1019, 10, 3.0], ["marta", 498, 1017, 220, 4.2], ["nico", 516, 970, 420, 5.3], ["zoe", 1075, 1818, 600, 6.4], ["buck", 583, 1002, 800, 7.5]];
  const people = crowd.map(([n, w, h, x, t], i) => {
    const H = n === "zoe" ? 640 : 600, W = w * H / h;
    const el = E.el(S.el, "abs", `left:${x}px;top:${WALK + 20 - H}px;width:${W}px;height:${H}px;z-index:1;opacity:0;transform-origin:50% 100%`);
    E.img(el, n, `width:${W}px;height:${H}px`);
    E.K(el, "o", [[t - .01, 0], [t, 1]]);
    const c = CLAP + i * .05;
    E.K(el, "y", [[t, 60], [t + .3, 0, "back"], [c, 0], [c + .15, -40, "out"], [c + .4, 0, "in"], [c + .55, -30, "out"], [c + .8, 0, "in"]]);
    const bob = []; for (let k = t; k < DUR; k += .7) bob.push([k, 0, "io"], [k + .35, -6 - (i % 2) * 4, "io"]);
    E.K(el, "r", bob.map(([k, v, e]) => [k, v * .4, e]));
    E.S(t, "pop", .5);
    return el;
  });
  // Buck's popcorn spills when she drives off
  for (let i = 0; i < 7; i++) {
    const p = E.el(S.el, "abs", `left:${900 + (i % 3) * 18}px;top:${WALK - 330}px;width:22px;height:20px;border-radius:50%;background:#fff6d8;box-shadow:inset -3px -3px 0 #f0d58a;z-index:2;opacity:0`);
    const t = AWAY + .2 + i * .05;
    E.K(p, "o", [[t, 0], [t + .02, 1], [t + .7, 1], [t + .75, 0]]); E.K(p, "y", [[t, 0], [t + .7, 330, "in"]]); E.K(p, "x", [[t, 0], [t + .7, (i - 3) * 30]]);
  }

  // ---------------- the parked cars and the gap ----------------
  const parked = (x) => { const el = E.el(S.el, "abs", `left:${x}px;top:${ROAD - 340}px;width:610px;height:340px;z-index:3;transform-origin:50% 100%`); E.img(el, "car", "width:610px;height:340px"); return el; };
  const back = parked(-470), front = parked(900);
  // ---------------- grandma's car ----------------
  const GW = 928 * .78, GH = 476 * .78;
  const g = E.el(S.el, "abs", `left:0;top:${ROAD + 30 - GH}px;width:${GW}px;height:${GH}px;z-index:4;transform-origin:50% 100%`);
  const GT = ["g_drive", "g_proud", "g_oh"];
  const gim = GT.map(n => E.img(g, n, `position:absolute;left:0;top:0;width:${GW}px;height:${GH}px`));
  E.F(t => { const f = at([[0, "g_drive"], [IN + .2, "g_proud"], [OH, "g_oh"], [AWAY, "g_drive"]], t); gim.forEach((im, i) => { im.style.opacity = GT[i] === f ? 1 : 0; }); });
  // path: drives in along the front lane (y +40), then a long back-and-forth into the gap; the final slide lands at x 235, y 0
  const moves = [[1.2, 329, 40], [2.0, 215, 10], [2.5, 299, 30], [3.0, 197, 0], [3.5, 287, 25], [4.0, 173, 5], [4.5, 269, 30], [5.0, 185, 0],
    [5.5, 281, 20], [6.0, 167, 10], [6.5, 257, 30], [7.0, 179, 0], [7.5, 275, 20], [8.0, 173, 5], [8.5, 245, 25]];
  const kx = [[0, -800]], ky = [[0, 40]];
  moves.forEach(([t, x, y], i) => { kx.push([t - (i ? .38 : 1.2), kx[kx.length - 1][1]], [t, x, "io"]); ky.push([t - (i ? .38 : 1.2), ky[ky.length - 1][1]], [t, y, "io"]); });
  kx.push([IN - .5, 245], [IN, 158, "io"], [AWAY, 158], [AWAY + 1.2, 1500, "in"]);
  ky.push([IN - .5, 25], [IN, 0, "io"]);
  E.K(g, "x", kx); E.K(g, "y", ky);
  // a little rock and bounce on every stop
  E.F(t => {
    let r = 0;
    for (const [mt] of moves.concat([[IN]])) if (t >= mt && t < mt + .3) r = Math.sin((t - mt) / .3 * Math.PI * 2) * 1.6;
    if (t >= AWAY && t < AWAY + .25) r = -3;
    g.style.transform = (g.style.transform || "") .replace(/rotate\([^)]*\)/, "") + ` rotate(${r}deg)`;
  });
  moves.forEach(([t], i) => { E.clip(t - .38, "sfx/car-rev-short.wav", { vol: .45, to: .7, duck: false }); });
  // bumps into the neighbours
  [[2.0, back, "back"], [3.0, back, "back"], [4.5, front, "front"], [6.0, back, "back"], [7.5, front, "front"]].forEach(([t, car, side]) => {
    E.clip(t - .02, "sfx/car-bump.wav", { vol: 1.2 });
    E.K(car, "r", [[t, 0], [t + .08, side === "back" ? -1.5 : 1.5], [t + .3, 0, "out"]]);
    E.shake(t, 6, .15);
  });

  // ---------------- the crowd's sound ----------------
  E.clip(3.0, "sfx/crowd-murmur.wav", { vol: .35, duck: false });
  E.clip(6.0, "sfx/crowd-murmur.wav", { vol: .5, duck: false });
  E.clip(8.6, "sfx/crowd-ooh.wav", { vol: .8 });
  E.clip(CLAP, "sfx/applause-cheer.wav", { vol: .9 });
  E.clip(AWAY, "sfx/car-rev-short.wav", { vol: .7 });
  E.clip(AWAY + .5, "sfx/crowd-ooh.wav", { vol: .5 });
  E.S(IN, "ding", .7); E.S(IN + .05, "sparkle", .7); E.flash(IN, "#ffffff", .25, .15);

  // ---------------- counter and text ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;display:inline-block;background:${C.ink};color:#fff;font-weight:900;font-size:56px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7;transform-origin:0 50%`, "MOVES: 0");
  const cnt = t => { if (t < 2.0) return t < 1.2 ? 0 : 1; if (t < 8.5) return 1 + Math.floor((t - 2.0) / .5) * 2; if (t < IN) return 27 + Math.round((t - 8.5) / (IN - 8.5) * 9); return 37; };
  E.F(t => { const s = "MOVES: " + cnt(t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = cnt(t) >= 20 ? C.coralD : C.ink; });
  moves.forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.2], [t + .2, 1, "back"]]));
  const stampBox = E.el(S.el, "abs", "left:100px;top:470px;width:880px;display:flex;justify-content:center;z-index:9");
  const st = E.stamp(stampBox, "PERFECT!", IN + .05, { size: 110, rot: -6, bg: C.mint, shake: 12 });
  st.style.alignSelf = "center"; E.until(st, OH - .1, .15);
  const bubble = (html, left, top, w, tail, t0, t1) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const box = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:66px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(box, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    E.S(t0 + .02, "pop", .6);
    return b;
  };
  bubble("Oh… wrong street.", 330, 1150, 560, "l", OH, AWAY + 1.4);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Grandma *parks* the car", { size: 64, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[14.45, 1], [14.7, 1.18, "out"], [15.0, 1, "io"]]);
}
