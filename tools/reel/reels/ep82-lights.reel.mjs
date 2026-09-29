// EP.82 "The Christmas lights war" — a Lisbon building at night, two balconies. Otto hangs one string of lights: "Nice. Festive." Next
// door, Sr. Manel lights up his whole half of the building and an inflatable Santa: "Ah, vizinho… cute." Otto, loaded with cables: "Oh,
// it's ON." The war escalates — reindeer, stars, snowmen, 50,000 bulbs — until Manel pulls a giant lever: "Feliz Natal!" Fireworks.
// Cut to the space station: an astronaut at the window, Europe at night, one blinding spot: "Houston… what is THAT?" "…That's Portugal."
export const meta = {
  id: "ep82-lights", date: "2026-12-14",
  images: {
    bg: "characters/scenes/bg_night.webp", sp: "characters/scenes/bg_space.webp", ast: "characters/cutouts/astronaut.webp",
    ol: "characters/cutouts/otto-xmas_lights.webp", ow: "characters/cutouts/otto-xmas_war.webp", ms: "characters/cutouts/manel_smug.webp", ml: "characters/cutouts/manel_lever.webp",
    santa: "characters/props/xmas_santa.webp", deer: "characters/props/xmas_reindeer.webp", star: "characters/props/xmas_star.webp", rocket: "characters/props/xmas_rocket.webp",
    tree: "characters/props/xmas_tree.webp", snow: "characters/props/xmas_snowman.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 128, root: 55, seed: 821, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 20.4, HANG = .3, NICE = 1.2, MAN = 2.9, CUTE = 3.4, ON = 5.8, O2 = 7.0, M2 = 8.6, BLD = 10.0, LEVER = 11.4, NATAL = 11.5,
    FIRE = 12.0, FLASH = 12.7, SPACE = 13.0, WHAT = 14.2, PT = 16.4;
  const S = E.scene("lights", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, left, bottom, z = 3) => { const el = E.el(P, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  // ================= the building =================
  const B = E.el(S.el, "abs", "inset:0;overflow:hidden");
  show(B, [[0, SPACE]]);
  E.img(B, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  // a string of bulbs: a thin wire and three interleaved colours that twinkle
  const COLS = ["#ff4d4d", "#ffd23f", "#4dd2ff", "#7dff6a", "#ff8ae2"];
  const bulbs = [];
  const row = (x0, x1, y, t0, gap = 40, sag = 0) => {
    const r = E.el(B, "abs", `left:${x0}px;top:${y}px;width:${x1 - x0}px;height:34px;z-index:2;opacity:0;transform-origin:0 50%`);
    E.el(r, "abs", `left:0;top:6px;width:100%;height:4px;background:#1d2430;border-radius:${sag}px`);
    const dots = E.el(r, "abs", "inset:0");
    const g = [0, 1, 2].map(i => `radial-gradient(circle at ${gap / 2}px 18px,#fff 0 3px,${COLS[(i + Math.round(x0 + y)) % 5]} 4px 10px,transparent 11px) ${i * gap / 3}px 0/${gap}px 34px repeat-x`);
    dots.style.background = g.join(","); dots.style.filter = `drop-shadow(0 0 8px rgba(255,230,150,1)) drop-shadow(0 0 14px rgba(255,200,120,.8))`;
    E.K(r, "o", [[t0 - .01, 0], [t0, 1]]); E.K(r, "sx", [[t0, .05], [t0 + .35, 1, "out"]]);
    bulbs.push(dots);
    return r;
  };
  E.F(t => bulbs.forEach((d, i) => { d.style.opacity = (Math.floor(t * 4 + i) % 3) ? 1 : .55; }));
  // Otto's side (left), Manel's side (right)
  row(70, 480, 690, NICE - .4, 36);
  [460, 560].forEach((y, i) => row(560, 1020, y, MAN + .1 + i * .08));
  [690, 780, 1000].forEach((y, i) => row(560, 1020, y, MAN + .25 + i * .08));
  [420, 480, 560, 620, 780, 860, 1000, 1080, 1160].forEach((y, i) => row(40, 520, y, O2 + i * .07));
  [640, 900, 1120, 1200, 1280, 1360].forEach((y, i) => row(560, 1040, y, M2 + i * .07));
  for (let k = 0; k < 10; k++) { const y = 1240 + k * 60; row(0, 1080, y, BLD + k * .06, 30); }
  for (let k = 0; k < 6; k++) row(0, 1080, 330 + k * 40, BLD + .6 + k * .05, 30);
  // the decorations
  const deco = (n, w, h, s, x, bottom, t0, z = 5) => { const d = fig(B, n, w, h, s, x, bottom, z); E.K(d, "o", [[t0 - .01, 0], [t0, 1]]); E.K(d, "s", [[t0, .1], [t0 + .4, 1, "back"]]); return d; };
  deco("santa", 248, 307, 1.05, 820, 930, MAN + .4);
  deco("star", 261, 263, .7, 150, 420, O2 + .5); deco("snow", 212, 292, .7, 330, 930, O2 + .7, 5); deco("tree", 194, 296, .8, 60, 1500, O2 + .9, 5);
  deco("deer", 222, 310, .7, 640, 1520, M2 + .3); deco("deer", 222, 310, .7, 790, 1520, M2 + .45); deco("deer", 222, 310, .7, 930, 1520, M2 + .6);
  const big = deco("star", 261, 263, 1.0, 410, 1150, M2 + .8, 6);
  E.K(big, "r", [[M2 + .8, 0], [DUR, 400, "lin"]]);
  // the characters on their balconies (a railing drawn over their legs)
  const o1 = fig(B, "ol", 458, 982, .56, 130, 930, 3), o2 = fig(B, "ow", 611, 974, .56, 100, 930, 3);
  show(o1, [[0, ON]]); show(o2, [[ON, SPACE]]);
  const ob = []; for (let t = 0; t < MAN; t += .7) ob.push([t, 0, "io"], [t + .35, -6, "io"]); E.K(o1, "y", ob);                   // frame-0 motion
  const m1 = fig(B, "ms", 386, 978, .56, 700, 930, 3), m2 = fig(B, "ml", 609, 961, .56, 640, 930, 3);
  show(m1, [[MAN, LEVER]]); show(m2, [[LEVER, SPACE]]);
  E.K(m1, "y", [[MAN, 300], [MAN + .35, 0, "out"]]);
  for (const x of [65, 595]) E.el(B, "abs", `left:${x}px;top:840px;width:420px;height:90px;z-index:4;background:repeating-linear-gradient(90deg,#1d2430 0 6px,transparent 6px 34px);border-top:8px solid #1d2430;border-bottom:8px solid #1d2430;box-sizing:border-box`);
  // glow over everything as the war heats up, then the lever
  const glow = E.el(B, "abs", "inset:0;z-index:7;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(255,230,140,.55),rgba(255,230,140,0) 70%);opacity:0");
  E.K(glow, "o", [[O2, 0], [O2 + .3, .25], [M2 + .3, .45], [BLD + .5, .7], [LEVER + .5, .9]]);
  // fireworks
  [[200, FIRE], [520, FIRE + .15], [860, FIRE + .3]].forEach(([x, t]) => {
    const r = fig(B, "rocket", 186, 281, .4, x, 1300, 8); E.K(r, "o", [[t - .01, 0], [t, 1], [t + .4, 1], [t + .41, 0]]); E.K(r, "y", [[t, 0], [t + .4, -700, "in"]]);
    const burst = E.el(B, "abs", `left:${x - 160}px;top:${480}px;width:360px;height:360px;border-radius:50%;z-index:8;opacity:0;background:repeating-conic-gradient(${COLS[(x / 100 | 0) % 5]} 0 6deg,transparent 6deg 20deg);-webkit-mask:radial-gradient(circle,transparent 30%,#000 32%,#000 60%,transparent 62%);mask:radial-gradient(circle,transparent 30%,#000 32%,#000 60%,transparent 62%)`);
    E.K(burst, "o", [[t + .4, 0], [t + .45, 1], [t + 1.1, 0]]); E.K(burst, "s", [[t + .4, .2], [t + 1.1, 1.3, "out"]]);
  });
  const white = E.el(S.el, "abs", "inset:0;background:#fff;z-index:9;opacity:0");
  E.K(white, "o", [[FLASH, 0], [FLASH + .15, 1], [SPACE + .05, 1], [SPACE + .4, 0]]);

  // ================= from the space station =================
  const SPc = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0");
  show(SPc, [[SPACE, DUR]]);
  const earth = E.el(SPc, "abs", "left:0;top:0;width:1080px;height:1930px;transform-origin:435px 1150px");
  E.img(earth, "sp", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  E.K(earth, "s", [[SPACE, 1.15], [DUR, 1, "lin"]]);
  // the rest of Europe dims; one spot blazes
  const dimEU = E.el(earth, "abs", "inset:0;background:rgba(5,10,30,.0)");
  E.F(t => { dimEU.style.background = `rgba(5,10,30,${Math.min(.45, Math.max(0, (t - SPACE - .3) * .4))})`; });
  const sun = E.el(earth, "abs", "left:285px;top:1000px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,#fff 0 12%,rgba(255,240,160,.95) 22%,rgba(255,210,90,.55) 45%,rgba(255,200,80,0) 70%)");
  E.K(sun, "s", [[SPACE, .3], [SPACE + .8, 1.4, "out"], [WHAT, 1.3], [WHAT + .3, 1.6, "out"], [DUR, 1.5]]);
  const rays = E.el(earth, "abs", "left:135px;top:850px;width:600px;height:600px;border-radius:50%;background:repeating-conic-gradient(rgba(255,240,170,.35) 0 4deg,transparent 4deg 18deg);-webkit-mask:radial-gradient(circle,#000 10%,transparent 65%);mask:radial-gradient(circle,#000 10%,transparent 65%)");
  E.K(rays, "r", [[SPACE, 0], [DUR, 60, "lin"]]); E.K(rays, "o", [[SPACE, 0], [SPACE + .8, 1]]);
  const ast = fig(SPc, "ast", 864, 951, .78, -40, 1930, 5);
  E.K(ast, "y", [[SPACE, 0], [SPACE + 1, -14, "io"], [SPACE + 2, 0, "io"], [SPACE + 3, -14, "io"], [SPACE + 4, 0, "io"], [SPACE + 5, -14, "io"], [SPACE + 6, 0, "io"]]);
  const radio = E.el(SPc, "abs", "left:600px;top:1560px;padding:10px 22px;background:#1d2b36;color:#6fffb0;font-family:monospace;font-weight:700;font-size:34px;border-radius:12px;z-index:6;opacity:0", "📡 HOUSTON");
  show(radio, [[PT - .1, DUR]]);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "OTTO: 12 BULBS"], [MAN, "MANEL: 400 BULBS"], [O2, "OTTO: 3,000 BULBS"], [M2, "MANEL: 10,000 BULBS"], [BLD, "THE BUILDING: 50,000"], [LEVER, "POWER: ████████ MAX"], [SPACE, "400 KM ABOVE EUROPE"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= MAN && t < SPACE ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.3);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble("Nice. Festive.", 40, 470, 360, 170, NICE, MAN - .05, 50);
  bubble("Ah, vizinho… cute.", 560, 470, 460, 250, CUTE, ON - .05, 48);
  bubble("Oh, it's ON.", 40, 470, 360, 170, ON, O2 + .6, 54);
  bubble(`Feliz Natal!${sub("(Merry Christmas!)")}`, 560, 440, 420, 180, NATAL, FLASH, 54);
  bubble("Houston… what is THAT?", 40, 1080, 560, 250, WHAT, PT - .05, 48);
  bubble("…That's Portugal.", 480, 1400, 520, 300, PT, DUR - .4, 52);
  const sb = E.el(S.el, "abs", "left:60px;top:560px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "VISIBLE FROM SPACE.", PT + 2.0, { size: 96, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/street-sunny.wav", { vol: .4, duck: false, to: SPACE });
  E.S(NICE - .4, "sparkle", .5); E.clip(NICE, "voices/ep82/o_nice.wav", { vol: 1.2 });
  E.S(MAN + .1, "sparkle", .8); E.S(MAN + .4, "poof", .5); E.clip(CUTE, "voices/ep82/m_cute.wav", { vol: 1.3 });
  E.clip(ON, "voices/ep82/o_on.wav", { vol: 1.25 }); E.S(ON + .9, "riser", .5);
  E.S(O2, "sparkle", .9); E.S(M2, "sparkle", .9); E.S(BLD, "sparkle", 1.0); E.S(BLD + .5, "riser", .6);
  E.clip(LEVER - .1, "sfx/switch-click.wav", { vol: 3 }); E.clip(NATAL, "voices/ep82/m_natal.wav", { vol: 1.4 });
  [FIRE, FIRE + .15, FIRE + .3].forEach(t => { E.S(t, "whoosh", .6); E.S(t + .42, "crack", .9); });
  E.S(FLASH, "buzz", .7);
  E.clip(SPACE, "sfx/elx-cabin-hum.wav", { vol: .6, duck: false, to: DUR - SPACE });
  E.clip(WHAT, "voices/ep82/a_what.wav", { vol: 1.3 });
  E.clip(PT - .15, "sfx/radar-ping.wav", { vol: .5 }); E.clip(PT, "voices/ep82/h_portugal.wav", { vol: 1.3 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "The Christmas lights *war*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[19.6, 1], [19.85, 1.18, "out"], [20.2, 1, "io"]]);
}
