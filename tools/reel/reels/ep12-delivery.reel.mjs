// EP.12 "Grandma sees your delivery" — Otto comes in with a food-delivery bag. Grandma, scandalised: "You PAID for that?!"
// A spite-cooking montage: pots slam down, four courses in 17 minutes, the delivery bag shrinks. Then 02:00, the fridge light:
// grandma in her dressing gown, mouth full of his burger — "Just checking it's safe." Universal joke. Stands alone for strangers.
export const meta = {
  id: "ep12-delivery", date: "2026-10-05",
  images: {
    o_excited: "characters/cutouts/otto-casual_excited.webp", o_betrayed: "characters/cutouts/otto-casual_betrayed.webp",
    o_grab: "characters/cutouts/otto-casual_grab.webp",
    d_offended: "characters/cutouts/dona_offended.webp", d_stir: "characters/cutouts/dona_stir.webp", d_burger: "characters/cutouts/dona_burger.webp",
    p_bag: "characters/props/delivery-bag.webp", p_pot: "characters/props/pot.webp",
    f_bacalhau: "characters/props/food_bacalhau.webp", f_soup: "characters/props/food_soup.webp", f_rice: "characters/props/food_rice.webp", f_cake: "characters/props/food_cake.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 126, root: 53, seed: 121, prog: [[0, 3, 7], [5, 8, 12], [7, 10, 14], [3, 7, 10]] });
  const DUR = 10.6;
  const S = E.scene("kitchen", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const TOP = 1400;                                            // the worktop line
  const GASP = .8, COOK = 2.3, EAT = 5.9, NIGHT = 7.3;

  // ---------------- the kitchen ----------------
  const stage = E.el(S.el, "abs", "inset:0;transform-origin:540px 1000px");
  E.el(stage, "abs", "left:0;top:0;width:1080px;height:1920px;background:#f4e4c1");
  const tileSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#f8f5ee'/><rect x='2' y='2' width='116' height='116' rx='5' fill='none' stroke='#c9d8ea' stroke-width='3'/><g fill='#2f6db5'><circle cx='60' cy='60' r='9'/><ellipse cx='60' cy='36' rx='8' ry='15'/><ellipse cx='60' cy='84' rx='8' ry='15'/><ellipse cx='36' cy='60' rx='15' ry='8'/><ellipse cx='84' cy='60' rx='15' ry='8'/></g><g fill='#7fa8dc'><circle cx='14' cy='14' r='5'/><circle cx='106' cy='14' r='5'/><circle cx='14' cy='106' r='5'/><circle cx='106' cy='106' r='5'/></g></svg>`;
  E.el(stage, "abs", `left:0;top:600px;width:1080px;height:${TOP - 600}px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tileSvg)}");background-size:120px 120px;background-position:-30px 0`);
  E.el(stage, "abs", "left:0;top:586px;width:1080px;height:16px;background:#2f6db5");
  // the fridge (right, behind grandma): matters at night
  const fridge = E.el(stage, "abs", `left:780px;top:520px;width:300px;height:${TOP - 520}px;background:#e9eef2;border-radius:18px 0 0 0;box-shadow:inset -10px 0 0 #cfd8df`);
  E.el(fridge, "abs", "left:26px;top:120px;width:16px;height:160px;border-radius:8px;background:#aab5bf");
  // people stand behind the worktop
  const person = (names, w, h, left, s, z) => {
    const W = w * s, H = h * s;
    const el = E.el(stage, "abs", `left:${left}px;top:${TOP - 560 * s}px;width:${W}px;height:${H}px;z-index:${z};transform-origin:50% 100%`);
    const inner = E.el(el, "abs", "inset:0;transform-origin:50% 100%");
    const ims = names.map(n => E.img(inner, n, `position:absolute;left:0;top:0;width:${W}px;height:${H}px;opacity:0`));
    return { el, inner, ims, names };
  };
  const otto = person(["o_excited", "o_betrayed", "o_grab"], 625, 1076, 10, 1.05, 2);
  const dona = person(["d_offended", "d_stir"], 697, 1020, 470, 1.0, 1);
  const donaN = person(["d_burger"], 541, 1026, 520, 1.0, 1);
  E.K(dona.el, "x", [[GASP - .01, 700], [GASP, 700], [GASP + .2, 0, "out"]]);
  E.K(dona.el, "o", [[NIGHT - .01, 1], [NIGHT, 0]]);
  E.K(donaN.el, "o", [[NIGHT - .01, 0], [NIGHT, 1]]);
  const show = (p, list) => E.F(t => { const f = at(list, t); p.ims.forEach((im, i) => { im.style.opacity = p.names[i] === f ? 1 : 0; }); });
  show(otto, [[0, "o_excited"], [GASP + .1, "o_betrayed"], [EAT - .4, "o_grab"], [NIGHT, "o_betrayed"]]);
  show(dona, [[0, "d_offended"], [COOK, "d_stir"]]);
  dona.ims[0].style.transform = "scaleX(-1)";                                                   // she points at Otto (left)
  show(donaN, [[0, "d_burger"]]);
  E.F(t => {
    let r = 0, y = 0;
    if (t < GASP) y = Math.max(0, Math.sin(t * 10)) * -12;
    otto.inner.style.transform = `translateY(${y}px) rotate(${r}deg)`;
    let dr = 0; if (t >= COOK && t < EAT) dr = Math.sin(t * 26) * 3;
    dona.inner.style.transform = `rotate(${dr}deg)`;
    donaN.inner.style.transform = t >= NIGHT ? `translateY(${Math.abs(Math.sin(t * 14)) * -5}px)` : "none";   // chewing
  });

  // the worktop
  E.el(stage, "abs", `left:0;top:${TOP}px;width:1080px;height:${1920 - TOP}px;background:#8a5a2b;z-index:3`);
  E.el(stage, "abs", `left:0;top:${TOP}px;width:1080px;height:34px;background:#c9a27a;z-index:3`);
  E.el(stage, "abs", `left:0;top:${TOP + 34}px;width:1080px;height:12px;background:rgba(0,0,0,.18);z-index:3`);

  // ---------------- props on the worktop ----------------
  const prop = (name, w, h, cx, s, z = 4) => {
    const W = w * s, H = h * s;
    const el = E.el(stage, "abs", `left:${cx - W / 2}px;top:${TOP + 20 - H}px;width:${W}px;height:${H}px;z-index:${z};transform-origin:50% 100%`);
    E.img(el, name, `width:${W}px;height:${H}px`);
    return el;
  };
  const land = (el, t, snd = "thud") => {
    E.K(el, "o", [[t - .16, 0], [t - .15, 1]]); E.K(el, "y", [[t - .15, -900], [t, 0, "in"]]);
    E.K(el, "sy", [[t, .75], [t + .16, 1, "back"]]); E.S(t, snd, .8);
  };
  // the delivery bag: in Otto's hands, then on the worktop, shrinking in shame
  const bag = prop("p_bag", 270, 296, 240, .95, 4);
  E.K(bag, "y", [[0, -60], [.2, -84, "out"], [.4, -60, "in"], [.6, -84, "out"], [GASP, -60, "in"], [GASP + .25, 0, "in"]]);
  E.K(bag, "s", [[COOK, 1], [EAT, .55, "io"]]);
  E.K(bag, "o", [[NIGHT - .01, 1], [NIGHT, 0]]);
  E.S(GASP + .25, "thud", .6);
  // the spite-cooking montage
  const L = [["p_pot", 345, 255, 640, .75, COOK + .2, "slam"], ["p_pot", 345, 255, 900, .7, COOK + .7, "slam"], ["f_soup", 203, 184, 470, .85, COOK + 1.3, "splat"],
    ["f_bacalhau", 241, 167, 760, .9, COOK + 1.8, "splat"], ["f_rice", 238, 155, 980, .8, COOK + 2.3, "splat"], ["f_cake", 211, 204, 560, .8, COOK + 2.8, "pop"]];
  const cooked = L.map(([n, w, h, cx, s, t, snd]) => { const el = prop(n, w, h, cx, s, 5); land(el, t, snd); E.K(el, "o", [[NIGHT - .01, 1], [NIGHT, 0]]); return el; });
  // steam puffs off the pots
  for (let i = 0; i < 6; i++) {
    const t0 = COOK + .5 + i * .45;
    const p = E.el(stage, "abs", `left:${600 + (i % 3) * 120}px;top:1180px;width:70px;height:70px;border-radius:50%;background:rgba(255,255,255,.8);z-index:6;opacity:0`);
    E.K(p, "o", [[t0, 0], [t0 + .1, .9], [t0 + .7, 0]]); E.K(p, "y", [[t0, 0], [t0 + .7, -200, "out"]]); E.K(p, "s", [[t0, .5], [t0 + .7, 1.6]]);
  }
  // counters: courses and minutes
  const pill = (left, bg, str) => E.el(S.el, "abs", `left:${left}px;top:352px;display:inline-block;background:${bg};color:#fff;font-weight:900;font-size:56px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7;opacity:0;transform-origin:0 50%`, str);
  const courses = pill(100, C.coralD, "COURSES 1"), mins = pill(620, C.ink, "0 MIN");
  E.K(courses, "o", [[COOK, 0], [COOK + .1, 1], [NIGHT - .01, 1], [NIGHT, 0]]);
  E.K(mins, "o", [[COOK, 0], [COOK + .1, 1], [NIGHT - .01, 1], [NIGHT, 0]]);
  E.F(t => {
    const n = t < COOK + 1.3 ? 1 : t < COOK + 1.8 ? 2 : t < COOK + 2.3 ? 3 : 4;
    const s = "COURSES " + n; if (courses.textContent !== s) courses.textContent = s;
    const m = Math.round(Math.min(17, Math.max(0, (t - COOK) / 3.0 * 17))), ms = m + " MIN"; if (mins.textContent !== ms) mins.textContent = ms;
  });
  [COOK + 1.3, COOK + 1.8, COOK + 2.3].forEach(t => E.K(courses, "s", [[t, 1.3], [t + .2, 1, "back"]]));
  E.S(COOK, "riser", .5);

  // ---------------- 02:00: the fridge light ----------------
  const night = E.el(S.el, "abs", "inset:0;background:rgba(10,20,50,.72);opacity:0;z-index:4;pointer-events:none");
  E.K(night, "o", [[NIGHT - .01, 0], [NIGHT, 1]]);
  const beam = E.el(S.el, "abs", "left:420px;top:420px;width:760px;height:1500px;background:radial-gradient(ellipse at 70% 40%,rgba(255,250,215,.85),rgba(255,250,215,0) 62%);opacity:0;z-index:4");
  E.K(beam, "o", [[NIGHT - .01, 0], [NIGHT, 1]]);
  donaN.el.style.zIndex = 5;
  const clock = E.el(S.el, "abs", "left:100px;top:352px;background:#1b2a4a;color:#fff;font-weight:900;font-size:56px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7;opacity:0", "02:00");
  E.K(clock, "o", [[NIGHT - .01, 0], [NIGHT, 1]]);
  E.S(NIGHT, "scratch", .6); E.S(NIGHT + .15, "tick", .8);
  // the empty bag on the worktop at night, tipped over
  const bag2 = prop("p_bag", 270, 296, 330, .7, 5);
  E.K(bag2, "o", [[NIGHT - .01, 0], [NIGHT, 1]]); E.K(bag2, "r", [[0, -80]]);

  // ---------------- speech bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const box = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 78 : 60}px;line-height:1.02;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(box, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .1, 1], [t1, 0]]);
    E.S(t0 + .02, "pop", .7);
    return b;
  };
  bubble("You PAID for that?!", 420, 440, 600, "r", GASP + .15, COOK, true);
  bubble("Real food. Eat.", 480, 450, 520, "r", EAT, NIGHT - .05);
  bubble("Just checking it's safe.", 420, 440, 600, "r", NIGHT + .35, 9.9, true);
  E.S(GASP, "scratch", .8); E.S(GASP + .1, "nope", .6); E.shake(GASP + .15, 10, .25);
  E.S(NIGHT + .4, "ding", .6);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Grandma sees your *delivery*", { size: 50, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[9.95, 1], [10.2, 1.18, "out"], [10.5, 1, "io"]]);
}
