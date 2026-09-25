// EP.9 "Grandma's cookie tin" — the three great grandma lies: the cookie tin (sewing kit), the ice-cream tub (frozen soup) and
// the cupboard (an avalanche of plastic bags). Then grandma offers a box of real cookies… and slams the lid: "They're for the
// guests." Universal joke; the kitchen is Portuguese. Stands alone for strangers: no series numbering, no "follow" line.
export const meta = {
  id: "ep9-cookies", date: "2026-10-02",
  images: {
    o_excited: "characters/cutouts/otto-casual_excited.webp", o_betrayed: "characters/cutouts/otto-casual_betrayed.webp",
    o_grab: "characters/cutouts/otto-casual_grab.webp", d_box: "characters/cutouts/dona_box.webp",
    p_tin: "characters/props/tin.webp", p_tin2: "characters/props/tin-sewing.webp", p_tub: "characters/props/tub.webp",
    p_tub2: "characters/props/tub-soup.webp", p_bags: "characters/props/bags.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 118, root: 58, seed: 91, prog: [[0, 4, 7], [5, 9, 12], [2, 5, 9], [7, 11, 14]] });
  const DUR = 10.6;
  const S = E.scene("kitchen", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FLOOR = 1780;

  // ---------------- the kitchen ----------------
  const stage = E.el(S.el, "abs", "inset:0;transform-origin:280px 1000px");
  E.el(stage, "abs", "left:0;top:0;width:1080px;height:1920px;background:#f4e4c1");
  const tileSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#f8f5ee'/><rect x='2' y='2' width='116' height='116' rx='5' fill='none' stroke='#c9d8ea' stroke-width='3'/><g fill='#2f6db5'><circle cx='60' cy='60' r='9'/><ellipse cx='60' cy='36' rx='8' ry='15'/><ellipse cx='60' cy='84' rx='8' ry='15'/><ellipse cx='36' cy='60' rx='15' ry='8'/><ellipse cx='84' cy='60' rx='15' ry='8'/></g><g fill='#7fa8dc'><circle cx='14' cy='14' r='5'/><circle cx='106' cy='14' r='5'/><circle cx='14' cy='106' r='5'/><circle cx='106' cy='106' r='5'/></g></svg>`;
  E.el(stage, "abs", `left:0;top:640px;width:1080px;height:${FLOOR - 640}px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tileSvg)}");background-size:120px 120px;background-position:-30px 0`);
  E.el(stage, "abs", "left:0;top:626px;width:1080px;height:16px;background:#2f6db5");
  E.el(stage, "abs", `left:0;top:${FLOOR}px;width:1080px;height:260px;background:#c9a27a`);
  E.el(stage, "abs", `left:0;top:${FLOOR}px;width:1080px;height:10px;background:#a57e58`);

  // ---------------- Otto ----------------
  const OS = 1.1, OW = 625 * OS, OH = 1076 * OS;
  const ottoW = E.el(stage, "abs", `left:40px;top:${FLOOR - OH + 10}px;width:${OW}px;height:${OH}px;z-index:2`);
  const ottoI = E.el(ottoW, "abs", "inset:0;transform-origin:35% 100%");
  const OT = ["o_excited", "o_betrayed", "o_grab"];
  const oimg = OT.map(n => E.img(ottoI, n, `position:absolute;left:0;top:0;width:${OW}px;height:${OH}px`));
  const T1 = 1.0, T2 = 2.3, T3 = 3.2, BAGS = 4.4, OFFER = 6.0, SLAM = 7.55;
  const ottoFace = [[0, "o_excited"], [T1, "o_betrayed"], [T2, "o_excited"], [T3, "o_betrayed"], [OFFER + .6, "o_grab"], [SLAM + .05, "o_betrayed"]];
  E.F(t => {
    const f = at(ottoFace, t);
    oimg.forEach((im, i) => { im.style.opacity = OT[i] === f ? 1 : 0; });
    let y = 0, r = 0, x = 0;
    if (t < T1 || (t >= T2 && t < T3)) y = Math.max(0, Math.sin(t * 10)) * -12;                     // excited bounce
    if (t >= OFFER + .6 && t < SLAM) { r = 3; }       // lunging for the cookies
    if (t >= SLAM + .05 && t < SLAM + .4) r = Math.sin(t * 70) * 2;
    ottoI.style.transform = `translate(${x}px,${y}px) rotate(${r}deg)`;
  });

  // ---------------- the containers in his hands ----------------
  const HX = 40 + 215 * OS, HY = FLOOR - OH + 10 + 520 * OS;                                          // where his cupped hands are
  const glow = E.el(stage, "abs", `left:${HX - 220}px;top:${HY - 330}px;width:440px;height:440px;border-radius:50%;background:radial-gradient(circle,rgba(255,236,150,.95),rgba(255,236,150,0) 68%);z-index:2`);
  const gk = []; for (let t = 0; t < DUR; t += .5) gk.push([t, 1, "io"], [t + .25, 1.12, "io"]);
  E.K(glow, "s", gk);
  E.K(glow, "o", [[0, 1], [T1, 1], [T1 + .05, 0], [T2, 0], [T2 + .1, 1], [T3, 1], [T3 + .05, 0]]);
  const prop = (name, w, h, t0, t1, inFrom = 0, outTo = -700) => {
    const el = E.el(stage, "abs", `left:${HX - w / 2}px;top:${HY - h + 30}px;width:${w}px;height:${h}px;z-index:3;opacity:0`);
    E.img(el, name, `width:${w}px;height:${h}px`);
    E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1, 1], [t1 + .01, 0]]);
    if (inFrom) E.K(el, "x", [[t0, inFrom], [t0 + .22, 0, "out"], [t1 - .2, 0], [t1, outTo, "in"]]);
    else E.K(el, "x", [[t1 - .2, 0], [t1, outTo, "in"]]);
    return el;
  };
  const tin = prop("p_tin", 265, 216, 0, T1);
  E.K(tin, "y", [[0, 0], [.22, -18, "out"], [.44, 0, "in"], [.66, -18, "out"], [.88, 0, "in"]]);              // it hops in his hands (frame-0 motion)
  const tin2 = prop("p_tin2", 253, 233, T1, T2);
  E.K(tin2, "s", [[T1, 1.2], [T1 + .2, 1, "back"]]);
  prop("p_tub", 245, 223, T2, T3, 700);
  const tub2 = prop("p_tub2", 252, 254, T3, BAGS);
  E.K(tub2, "s", [[T3, 1.2], [T3 + .2, 1, "back"]]);
  E.S(0.05, "sparkle", .6); E.S(T1, "pop", .9); E.S(T1 + .08, "nope", .8);
  E.S(T2 - .2, "swish", .8); E.S(T2, "swish", .7); E.S(T2 + .1, "sparkle", .6); E.S(T3, "pop", .9); E.S(T3 + .08, "nope", .8);
  // the lids pop off
  const lid = (t, css) => {
    const l = E.el(stage, "abs", `left:${HX - 130}px;top:${HY - 200}px;z-index:4;opacity:0;${css}`);
    E.K(l, "o", [[t - .01, 0], [t, 1], [t + .5, 1], [t + .55, 0]]);
    E.K(l, "y", [[t, 0], [t + .2, -260, "out"], [t + .55, 500, "in"]]); E.K(l, "x", [[t, 0], [t + .55, -260]]); E.K(l, "r", [[t, 0], [t + .55, -300]]);
  };
  lid(T1, "width:260px;height:56px;border-radius:30px;background:#1f4fa8");
  lid(T3, "width:250px;height:50px;border-radius:26px;background:#ff8fb0");

  // ---------------- the bag avalanche ----------------
  const drops = [[20, 1560, .7], [300, 1590, .66], [150, 1640, .72], [400, 1700, .62], [-30, 1720, .7], [220, 1760, .7], [360, 1790, .66],
    [60, 1800, .66], [470, 1800, .55], [250, 1470, .6], [110, 1450, .55], [390, 1520, .55]];
  drops.forEach(([x, bottom, s], i) => {
    const w = 301 * s, h = 279 * s, t = BAGS + i * .11;
    const b = E.el(stage, "abs", `left:${x}px;top:${bottom - h}px;width:${w}px;height:${h}px;z-index:5;opacity:0;transform-origin:50% 100%`);
    E.img(b, "p_bags", `width:${w}px;height:${h}px`);
    E.K(b, "o", [[t - .01, 0], [t, 1]]);
    E.K(b, "y", [[t, -bottom - 100], [t + .3, 0, "in"]]);
    E.K(b, "r", [[t, (i % 2 ? 30 : -30)], [t + .3, (i % 3 - 1) * 8]]);
    E.K(b, "sy", [[t + .3, .8], [t + .45, 1, "back"]]);
    E.S(t + .3, i % 2 ? "thud" : "pop", .55);
  });
  E.shake(BAGS + .5, 14, .8);

  // stamps: the verdicts
  const stampBox = (t, str, t1) => { const b = E.el(S.el, "abs", "left:90px;top:470px;width:700px;display:flex;z-index:9"); const s = E.stamp(b, str, t, { size: 80, rot: -6, shake: 14 }); E.until(s, t1, .12); };
  stampBox(T1 + .1, "SEWING KIT", T2 - .1);
  stampBox(T3 + .1, "FROZEN SOUP", BAGS);
  stampBox(BAGS + .9, "A BAG OF BAGS", OFFER);

  // ---------------- grandma offers real cookies… ----------------
  const DS = 1.0, DW = 619 * DS, DH = 1021 * DS;
  const dona = E.el(stage, "abs", `left:470px;top:${FLOOR - DH + 10}px;width:${DW}px;height:${DH}px;z-index:1;opacity:0`);
  E.img(dona, "d_box", `width:${DW}px;height:${DH}px`);
  E.K(dona, "o", [[OFFER - .01, 0], [OFFER, 1]]);
  E.K(dona, "x", [[OFFER, 620], [OFFER + .28, 0, "out"]]);
  const glow2 = E.el(stage, "abs", `left:${470 + 390 * DS - 230}px;top:${FLOOR - DH + 10 + 540 * DS - 250}px;width:460px;height:460px;border-radius:50%;background:radial-gradient(circle,rgba(255,236,150,.9),rgba(255,236,150,0) 68%);z-index:0;opacity:0`);
  E.K(glow2, "o", [[OFFER + .2, 0], [OFFER + .4, 1], [SLAM, 1], [SLAM + .05, 0]]);
  E.S(OFFER, "whoosh", .7); E.S(OFFER + .3, "sparkle", .9); E.S(OFFER + .5, "riser", .5);
  // …and slams the lid
  const boxLid = E.el(stage, "abs", `left:${470 + 180 * DS}px;top:${FLOOR - DH + 10 + 400 * DS}px;width:${425 * DS}px;height:${150 * DS}px;border-radius:10px;background:#b98a58;box-shadow:inset 0 -10px 0 #9c6f40;z-index:2;opacity:0;transform-origin:50% 100%`);
  E.K(boxLid, "o", [[SLAM - .12, 0], [SLAM - .11, 1]]);
  E.K(boxLid, "y", [[SLAM - .12, -420], [SLAM, 0, "in"]]);
  E.K(boxLid, "r", [[SLAM - .12, -30], [SLAM, -9, "in"]]);
  E.S(SLAM, "slam", 1); E.shake(SLAM, 20, .3); E.flash(SLAM, "#ffffff", .45, .2); E.S(SLAM + .1, "nope", .8);
  E.K(stage, "s", [[SLAM, 1], [SLAM + .08, 1.08, "out"], [DUR, 1.12]]);

  // ---------------- speech bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const box = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 76 : 58}px;line-height:1.02;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(box, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .1, 1], [t1, 0]]);
    E.S(t0 + .02, "pop", .7);
    return b;
  };
  bubble("Want a cookie?", 470, 470, 520, "r", OFFER + .35, SLAM - .1);
  bubble("They're for the guests.", 440, 450, 580, "r", SLAM + .12, 9.7, true);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Grandma's *cookie tin*", { size: 66, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[9.75, 1], [10.0, 1.18, "out"], [10.35, 1, "io"]]);
}
