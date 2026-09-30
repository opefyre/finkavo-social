// EP.96 "Returning a Portuguese tupperware" — two doors on one landing. 2006: grandma brings the new neighbour soup: "Welcome to the
// building! A little soup." Dona Rosa: "Ai, obrigada!" THE RULE: a tupperware NEVER goes back empty. 2007 it comes back with a cake ("Just
// a little something!"), 2011 a roast chicken, 2016 a whole roast pig, 2021 a five-tier cake. 2026: "Otto, take the box back to Dona Rosa."
// Knock knock. "Hi! Here's your box back. Thanks!" — EMPTY. Rosa: "…Vazia?" (Empty?) Grandma, arms crossed: "I have no grandson."
export const meta = {
  id: "ep96-tupperware", date: "2026-12-28",
  images: {
    bg: "characters/scenes/bg_landing.webp", go: "characters/cutouts/dona_offer.webp", gg: "characters/cutouts/dona_gasp.webp", gc: "characters/cutouts/dona_cold.webp",
    ro: "characters/cutouts/rosa_offer.webp", re: "characters/cutouts/rosa_empty.webp", ob: "characters/cutouts/otto-casual_box.webp", oa: "characters/cutouts/otto-casual_awkward.webp",
    box: "characters/props/tupperware.webp", cake: "characters/props/food_cake.webp", chick: "characters/props/roast-chicken.webp", pig: "characters/props/roast-pig.webp",
    tier: "characters/props/tier-cake.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 55, seed: 961, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 24.1, SOUP = .3, OBR = 2.5, RULE = 4.0, Y = [6.2, 7.9, 9.6, 11.3], Y5 = 13.1, OTTO = 13.3, KNOCK = 16.0, ROSA = 16.3, HERE = 16.5,
    EMPTY = 18.6, VAZIA = 18.8, GASP = 19.8, NOGRAND = 20.4, STAMP = 22.5;
  const S = E.scene("tupperware", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3, flip = false) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px${flip ? ";transform:scaleX(-1)" : ""}`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  const FS = .7, FB = 1880;
  // grandma (left door, facing right)
  const g1 = fig("go", 585, 955, FS, 20, FB, 4), g2 = fig("gg", 526, 967, FS, 40, FB, 4), g3 = fig("gc", 446, 955, FS, 60, FB, 4);
  show(g1, [[0, GASP]]); show(g2, [[GASP, NOGRAND]]); show(g3, [[NOGRAND, DUR]]);
  E.K(g1, "y", [[0, 0], [.5, -8, "io"], [1, 0, "io"], [1.5, -8, "io"], [2, 0, "io"]]);                                         // frame-0 motion
  // Dona Rosa (right door, mirrored to face left); away while the door is shut in 2026
  const r1 = fig("ro", 510, 955, FS, 700, FB, 4, true), r2 = fig("re", 531, 986, FS, 690, FB, 5, true);
  show(r1, [[0, Y5], [ROSA, EMPTY]]); show(r2, [[EMPTY, DUR]]); E.pop(r1, ROSA, { from: .8, dur: .3 });
  // Otto (2026, centre, facing Rosa)
  const o1 = fig("ob", 525, 943, FS, 360, FB, 6), o2 = fig("oa", 488, 1078, FS * .95, 380, FB, 6);
  show(o1, [[Y5, EMPTY]]); show(o2, [[EMPTY, DUR]]); E.K(o1, "x", [[Y5, -500], [Y5 + .5, 0, "out"]]);

  // the box, and what rides on it: [time, holder (0 grandma / 1 Rosa), food, food width, food height]
  const HOLD = [[SOUP, 0, null], [OBR, 1, null], [RULE, -1, null], [Y[0], 1, "cake", 200, 193], [Y[1], 0, "chick", 280, 181], [Y[2], 1, "pig", 330, 174], [Y[3], 0, "tier", 230, 458], [Y5, -1, null]];
  const BX = [285, 600], BY = 1440, BW = 220, BH = 150;
  const bw = E.el(S.el, "abs", `left:0;top:${BY}px;width:${BW}px;height:${BH}px;z-index:7`);
  E.img(bw, "box", `position:absolute;left:0;top:0;width:${BW}px;height:${BH}px`);
  const soup = E.el(bw, "abs", "left:9%;top:38%;width:82%;height:52%;background:rgba(88,140,52,.9);border-radius:6px 6px 18px 18px");
  show(soup, [[0, RULE]]);
  const foods = {}; [["cake", 200, 193], ["chick", 280, 181], ["pig", 330, 174], ["tier", 230, 458]].forEach(([n, w, h]) => {
    const f = E.el(bw, "abs", `left:${(BW - w) / 2}px;top:${20 - h}px;width:${w}px;height:${h}px`); E.img(f, n, `width:${w}px;height:${h}px`); foods[n] = f;
  });
  E.F(t => {
    const [, who, food] = HOLD.reduce((v, h) => (t >= h[0] ? h : v), HOLD[0]);
    bw.style.opacity = who < 0 ? 0 : 1; bw.style.left = `${BX[Math.max(0, who)]}px`;
    for (const n in foods) foods[n].style.opacity = n === food ? 1 : 0;
  });
  HOLD.slice(1).forEach(([t, who]) => { if (who >= 0) E.K(bw, "s", [[t - .01, 1], [t, .6], [t + .3, 1, "back"]]); });
  // the empty box, in Otto's hands then Rosa's (drawn in the cutouts)

  // the rule card
  const rc = E.el(S.el, "abs", `left:140px;top:560px;width:800px;background:#fff;border-radius:26px;box-shadow:0 16px 36px rgba(0,0,0,.3);z-index:9;opacity:0;overflow:hidden;text-align:center`);
  E.el(rc, "", `background:${C.coralD};color:#fff;font-weight:900;font-size:44px;padding:10px 0`, "THE RULE");
  E.el(rc, "", `color:${C.ink};font-weight:900;font-size:52px;line-height:1.1;padding:22px 30px 28px`, "A tupperware NEVER goes back <span style='color:#d9482e'>empty</span>.");
  E.K(rc, "o", [[RULE, 0], [RULE + .08, 1], [Y[0] - .15, 1], [Y[0], 0]]); E.pop(rc, RULE, { from: .4, dur: .3 });

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "2006 · NEW NEIGHBOUR"], [Y[0], "2007 · RETURNS: 2"], [Y[1], "2011 · RETURNS: 19"], [Y[2], "2016 · RETURNS: 64"], [Y[3], "2021 · RETURNS: 211"],
    [Y5, "2026 · RETURNS: 300"], [EMPTY, "2026 · RETURNED EMPTY"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= EMPTY ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  const GB = (h, t0, t1, fs = 46, w = 440) => bubble(h, 30, 1000, w, 110, t0, t1, fs);
  const RB = (h, t0, t1, fs = 46, w = 420) => bubble(h, 1050 - w, 1000, w, w - 150, t0, t1, fs);
  GB("Welcome to the building! A little soup.", SOUP, OBR - .05, 44, 460);
  RB(`Ai, obrigada!${sub("(Oh, thank you!)")}`, OBR, RULE, 48, 360);
  RB("Just a little something!", Y[0], Y[1] - .05, 44, 400);
  GB("Just a little something!", Y[1], Y[2] - .05, 44, 400);
  RB("Just a little something!", Y[2], Y[3] - .05, 44, 400);
  bubble("Just a little something!", 30, 820, 400, 110, Y[3], Y5 - .05, 44);
  GB("Otto, take the box back to Dona Rosa.", OTTO, KNOCK, 44, 460);
  bubble("Hi! Here's your box back. Thanks!", 300, 1000, 470, 150, HERE, EMPTY, 44);
  RB(`…Vazia?${sub("(…Empty?)")}`, VAZIA, GASP + .3, 54, 300);
  GB("I have no grandson.", NOGRAND, DUR - .4, 50, 420);
  const sb = E.el(S.el, "abs", "left:60px;top:620px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "20 YEARS. OVER.", STAMP, { size: 116, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(SOUP, "voices/ep96/g_soup.wav", { vol: 1.3 });
  E.clip(OBR, "voices/ep96/r_obrigada.wav", { vol: 1.3 });
  E.S(RULE, "ding", .5);
  Y.forEach((t, i) => { E.S(t - .1, "whoosh", .35); E.clip(t + .1, i % 2 ? "voices/ep96/g_little.wav" : "voices/ep96/r_little.wav", { vol: 1.3 }); E.S(t + .05, "pop", .5); });
  E.S(Y5 - .1, "whoosh", .4); E.clip(OTTO, "voices/ep96/g_otto.wav", { vol: 1.3 });
  E.clip(KNOCK, "sfx/door-knock.wav", { vol: .8, to: .6 }); E.clip(ROSA - .1, "sfx/door-open.wav", { vol: .5, to: .6 });
  E.clip(HERE, "voices/ep96/o_here.wav", { vol: 1.2 });
  E.S(EMPTY, "scratch", .7); E.clip(EMPTY, "sfx/record-silence.wav", { vol: .6 });
  E.clip(VAZIA, "voices/ep96/r_vazia.wav", { vol: 1.35 });
  E.S(GASP, "thud", .5); E.clip(NOGRAND, "voices/ep96/g_nogrand.wav", { vol: 1.35 });
  E.clip(STAMP - .1, "sfx/shutter-slam.wav", { vol: .5, to: .8 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Returning a Portuguese *tupperware*", { size: 41, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[23.3, 1], [23.55, 1.18, "out"], [23.9, 1, "io"]]);
}
