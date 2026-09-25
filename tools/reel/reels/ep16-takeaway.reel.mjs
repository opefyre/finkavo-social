// EP.16 "Leaving grandma's house" — "Take a little something!" A tupperware, a pot, a whole salt cod, bread, a sack of potatoes,
// a cake… and a live hen, stacked on Otto's cake box until he staggers. At the car the suspension sinks to the ground. At home
// he opens his fridge: it is already full of last week's tupperware. Universal joke. Paced per the reel-pacing note.
export const meta = {
  id: "ep16-takeaway", date: "2026-10-09",
  images: {
    o_cake: "characters/cutouts/otto-coat_cake.webp", o_t1: "characters/cutouts/otto-tower_1.webp", o_t2: "characters/cutouts/otto-tower_2.webp", o_t3: "characters/cutouts/otto-tower_3.webp", o_defeated: "characters/cutouts/otto-coat_defeated.webp",
    d_knowing: "characters/cutouts/dona_knowing.webp", d_smirk: "characters/cutouts/dona_smirk.webp", d_offended: "characters/cutouts/dona_offended.webp",
    p_tup: "characters/props/food_tupperware.webp", p_pot: "characters/props/pot.webp", p_cod: "characters/props/bacalhau-dry.webp", p_bread: "characters/props/bread-loaf.webp",
    p_pot2: "characters/props/potatoes.webp", p_cake: "characters/props/food_cake.webp", p_hen: "characters/props/hen.webp", p_car: "characters/props/car.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 57, seed: 161, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [5, 9, 12]] });
  const DUR = 14.6;
  const S = E.scene("all", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FLOOR = 1760, STREET = 7.6, HOME = 10.9;
  const scene = (t0, t1, z = 0) => { const el = E.el(S.el, "abs", `inset:0;opacity:0;z-index:${z}`); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };

  // ================= 1) grandma's front door (the camera pulls back as the tower grows) =================
  const A = scene(0, STREET);
  const W = E.el(A, "abs", `inset:0;transform-origin:540px ${FLOOR}px`);
  E.el(W, "abs", "left:-900px;top:-1600px;width:2900px;height:3600px;background:#f4e4c1");
  E.el(W, "abs", "left:-900px;top:-1600px;width:2900px;height:3600px;background-image:repeating-linear-gradient(90deg,rgba(160,120,80,.08) 0 40px,transparent 40px 80px)");
  E.el(W, "abs", `left:-900px;top:${FLOOR}px;width:2900px;height:900px;background:#a8764c`);
  E.el(W, "abs", `left:-330px;top:560px;width:300px;height:${FLOOR - 560}px;background:#3b2412;border-radius:10px 10px 0 0`);          // the open front door (left)
  E.el(W, "abs", `left:-320px;top:574px;width:280px;height:${FLOOR - 574}px;background:linear-gradient(180deg,#9fd3f0,#dff2fb)`);
  E.el(W, "abs", "left:880px;top:640px;width:120px;height:90px;border:10px solid #8a5f3a;background:linear-gradient(180deg,#9fd3f0,#f6e7b6)");
  const T1 = 2.9, T2 = 4.8, T3 = 6.2;
  E.K(W, "s", [[T2, 1], [T2 + .35, .95, "out"], [T3, .95], [T3 + .45, .685, "out"]]);

  // Otto: the plain pose, then three drawn tower stages (swapped as items land), all aligned on his feet
  const FX = 330;
  const stageImg = (n, w, h, fx, fy, sc) => E.img(W, n, `position:absolute;left:${FX - fx * sc}px;top:${FLOOR + 6 - fy * sc}px;width:${w * sc}px;height:${h * sc}px;z-index:2;transform-origin:${fx * sc}px ${fy * sc}px`);
  const ST = [stageImg("o_cake", 629, 1081, 315, 1075, .935), stageImg("o_t1", 752, 1344, 375, 1230, 1.033), stageImg("o_t2", 752, 1344, 366, 1268, 1.159), stageImg("o_t3", 752, 1344, 380, 1298, 1.513)];
  E.F(t => {
    const k = t < T1 ? 0 : t < T2 ? 1 : t < T3 ? 2 : 3;
    ST.forEach((im, i) => { im.style.opacity = i === k ? 1 : 0; });
    const amp = [0, .6, 1.4, 2.6][k], sp = [0, 7, 10, 13][k];
    ST[k].style.transform = `rotate(${Math.sin(t * sp) * amp}deg)`;
  });
  [T1, T2, T3].forEach(t => { E.S(t, "thud", .9); E.shake(t, 8, .2); });
  // items fall in and land exactly where the next drawing has them
  const drop = (n, w, h, s, cx, bottom, t, until) => {
    const Wd = w * s, H = h * s;
    const el = E.el(W, "abs", `left:${cx - Wd / 2}px;top:${bottom - H}px;width:${Wd}px;height:${H}px;z-index:3;opacity:0;transform-origin:50% 100%`);
    E.img(el, n, `width:${Wd}px;height:${H}px`);
    E.K(el, "o", [[t - .2, 0], [t - .19, 1], [until - .01, 1], [until, 0]]);
    E.K(el, "y", [[t - .19, -900], [t, 0, "in"]]);
    E.K(el, "sy", [[t, .78], [t + .16, 1, "back"]]);
    E.S(t, "thud", .7);
  };
  drop("p_tup", 147, 258, .55, 330, 1172, 2.3, T1);
  drop("p_cod", 300, 176, .6, 450, 985, 3.6, T2);
  drop("p_bread", 294, 183, .5, 480, 900, 4.2, T2);
  drop("p_cake", 211, 204, .5, 470, 395, 5.4, T3);
  E.S(T3 + .15, "cluck", 1); E.S(6.95, "cluck", .8);

  const DS = .95;
  const dona = E.el(W, "abs", `left:660px;top:${FLOOR - 1014 * DS + 10}px;width:${700 * DS}px;height:${1014 * DS}px;z-index:1`);
  const DT = ["d_knowing", "d_smirk", "d_offended"];
  const dim = DT.map(n => E.img(dona, n, `position:absolute;left:0;bottom:0;height:${1014 * DS}px;width:auto`));
  dim[2].style.transform = "scaleX(-1)";
  E.F(t => { const f = at([[0, "d_knowing"], [1.6, "d_smirk"], [5.9, "d_offended"], [7.0, "d_smirk"]], t); dim.forEach((im, i) => { im.style.opacity = DT[i] === f ? 1 : 0; }); });
  const sway = []; for (let t = 0; t <= STREET; t += .8) sway.push([t, (Math.round(t / .8) % 2) ? -8 : 0, "io"]);
  E.K(dona, "y", sway);

  // the weight counter
  const kg = E.el(S.el, "abs", `left:100px;top:352px;display:inline-block;background:${C.coralD};color:#fff;font-weight:900;font-size:56px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7;opacity:0;transform-origin:0 50%`, "+2 KG");
  const KG = [[2.3, 2], [2.9, 6], [3.6, 9], [4.2, 10], [4.8, 20], [5.4, 22], [6.2, 24]];
  E.K(kg, "o", [[2.3, 0], [2.35, 1], [STREET - .01, 1], [STREET, 0]]);
  E.F(t => { const v = at([[0, 2], ...KG], t), s = `+${v} KG`; if (kg.textContent !== s) kg.textContent = s; });
  KG.forEach(([t]) => E.K(kg, "s", [[t, 1.3], [t + .2, 1, "back"]]));

  // ================= 2) the street: the car sinks =================
  const B = scene(STREET, HOME);
  E.el(B, "abs", "left:0;top:0;width:1080px;height:1920px;background:linear-gradient(180deg,#8fcdf0,#dff2fb)");
  for (let i = 0; i < 4; i++) E.el(B, "abs", `left:${i * 280 - 20}px;top:${560 + (i % 2) * 80}px;width:290px;height:${1000 - (i % 2) * 80}px;background:${["#f4c7a1", "#f7e3a3", "#bfe3d3", "#f2b8b0"][i]};border-top:40px solid #c0643f`);
  E.el(B, "abs", "left:0;top:1500px;width:1080px;height:420px;background:#8d8d8d");
  E.el(B, "abs", "left:0;top:1500px;width:1080px;height:40px;background:#bdb3a4");
  const CS = 2.4, CW = 305 * CS, CH = 170 * CS;
  const car = E.el(B, "abs", `left:300px;top:${1720 - CH}px;width:${CW}px;height:${CH}px;z-index:2;transform-origin:50% 100%`);
  E.img(car, "p_car", `width:${CW}px;height:${CH}px`);
  const SINK = 9.0;
  E.K(car, "sy", [[SINK, 1], [SINK + .18, .5, "in"], [SINK + .45, .6, "out"], [SINK + .7, .55, "io"]]);
  E.K(car, "sx", [[SINK, 1], [SINK + .18, 1.14, "in"], [SINK + .45, 1.1, "out"]]);
  // what ends up on the roof: the sack and the hen, and a puff of dust
  const roof = (n, w, h, s, x, t) => { const W = w * s, H = h * s; const el = E.el(B, "abs", `left:${x}px;top:${1720 - CH * .55 - H + 8}px;width:${W}px;height:${H}px;z-index:3;opacity:0;transform-origin:50% 100%`); E.img(el, n, `width:${W}px;height:${H}px`); E.K(el, "o", [[t - .01, 0], [t, 1]]); E.K(el, "y", [[t, -500], [t + .25, 0, "in"]]); E.K(el, "sy", [[t + .25, .8], [t + .4, 1, "back"]]); E.S(t + .25, "thud", .6); return el; };
  roof("p_pot2", 208, 223, .9, 420, SINK + .5);
  const hen2 = roof("p_hen", 237, 253, .95, 640, SINK + .9);
  E.K(hen2, "r", [[SINK + 1.2, 0], [SINK + 1.3, -8], [SINK + 1.4, 6], [SINK + 1.5, 0]]);
  E.S(SINK + 1.2, "cluck", .9);
  const dust = E.el(B, "abs", "left:220px;top:1640px;width:920px;height:160px;border-radius:50%;background:radial-gradient(ellipse,rgba(180,170,150,.8),rgba(180,170,150,0) 70%);z-index:3;opacity:0");
  E.K(dust, "o", [[SINK, 0], [SINK + .1, 1], [SINK + .9, 0]]); E.K(dust, "s", [[SINK, .6], [SINK + .9, 1.3]]);
  E.S(SINK, "thud", 1); E.S(SINK + .1, "creak", 1); E.shake(SINK, 18, .35);
  const crunch = E.el(B, "abs", "left:330px;top:1180px;z-index:5;font-weight:900;font-size:130px;color:#d9482e;-webkit-text-stroke:12px #fff;paint-order:stroke fill;transform:rotate(-8deg);opacity:0;white-space:nowrap", "CRUNCH!");
  E.K(crunch, "o", [[SINK - .01, 0], [SINK, 1], [SINK + 1.1, 1], [SINK + 1.25, 0]]); E.K(crunch, "s", [[SINK, .3], [SINK + .22, 1.15, "back"], [SINK + .4, 1]]);
  // the whole load flies from the left into the car (seen as a blur of items)
  ["p_hen", "p_pot2", "p_cod", "p_pot", "p_cake"].forEach((n, i) => {
    const t = STREET + .35 + i * .22, W = 180, el = E.el(B, "abs", `left:-240px;top:900px;width:${W}px;height:${W}px;z-index:3;opacity:0`);
    E.img(el, n, `width:${W}px;height:auto`);
    E.K(el, "o", [[t - .01, 0], [t, 1], [t + .4, 1], [t + .41, 0]]);
    E.K(el, "x", [[t, 0], [t + .4, 800, "in"]]); E.K(el, "y", [[t, 0], [t + .2, -160, "out"], [t + .4, 520, "in"]]); E.K(el, "r", [[t, 0], [t + .4, 300]]);
    E.S(t + .4, "thud", .5);
  });
  E.S(STREET + .35 + 4 * .22 + .5, "cluck", .7);
  // a feather drifts down after the sink
  const feather = E.el(B, "abs", "left:620px;top:1100px;width:36px;height:90px;border-radius:50%;background:#fffaf0;box-shadow:0 0 0 2px #e6dccb;z-index:3;opacity:0");
  E.K(feather, "o", [[SINK + .2, 0], [SINK + .3, 1]]);
  E.K(feather, "y", [[SINK + .2, 0], [HOME, 300, "io"]]);
  E.K(feather, "r", [[SINK + .2, -30], [9.8, 30, "io"], [10.4, -20, "io"], [HOME, 20]]);

  // ================= 3) home: the fridge =================
  const Cc = scene(HOME, DUR);
  E.el(Cc, "abs", "left:0;top:0;width:1080px;height:1920px;background:#dfe7ee");
  E.el(Cc, "abs", `left:0;top:${FLOOR}px;width:1080px;height:200px;background:#9aa7b2`);
  const fridge = E.el(Cc, "abs", `left:480px;top:620px;width:560px;height:${FLOOR - 620}px;background:#f4f7f9;border-radius:24px 24px 0 0;box-shadow:inset -14px 0 0 #d6dde3;overflow:hidden`);
  // inside: shelves crammed with tupperware (the door swings open)
  for (let r = 0; r < 4; r++) {
    E.el(fridge, "abs", `left:30px;top:${260 + r * 245}px;width:500px;height:10px;background:#c9d3da`);
    for (let c = 0; c < 4; c++) {
      const el = E.el(fridge, "abs", `left:${36 + c * 120}px;top:${260 + r * 245 - 214}px;width:${147 * .82}px;height:${258 * .82}px`);
      E.img(el, "p_tup", `width:${147 * .82}px;height:${258 * .82}px`);
    }
  }
  const fdoor = E.el(Cc, "abs", `left:480px;top:620px;width:560px;height:${FLOOR - 620}px;background:#e9eef2;border-radius:24px 24px 0 0;box-shadow:inset -10px 0 0 #cfd8df;transform-origin:0 50%;z-index:2`);
  E.el(fdoor, "abs", "left:30px;top:200px;width:18px;height:220px;border-radius:9px;background:#aab5bf");
  const OPEN = HOME + .5;
  E.K(fdoor, "sx", [[OPEN, 1], [OPEN + .3, .06, "out"]]);
  E.S(OPEN, "creak", .6); E.S(OPEN + .3, "sparkle", .5);
  // one tupperware slides out and lands on his head
  const fall = E.el(Cc, "abs", `left:520px;top:780px;width:${147 * .7}px;height:${258 * .7}px;z-index:4;opacity:0`);
  E.img(fall, "p_tup", `width:${147 * .7}px;height:${258 * .7}px`);
  const BONK = HOME + 1.9;
  E.K(fall, "o", [[BONK - .5, 0], [BONK - .49, 1]]);
  E.K(fall, "x", [[BONK - .49, 0], [BONK, -200, "in"]]); E.K(fall, "y", [[BONK - .49, 0], [BONK, 120, "in"], [BONK + .15, 80, "out"], [BONK + .35, 120, "in"]]);
  E.K(fall, "r", [[BONK - .49, 0], [BONK, -30]]);
  E.S(BONK, "thud", .9);
  const OT = .95;
  const otto = E.el(Cc, "abs", `left:10px;top:${FLOOR - 1079 * OT + 10}px;width:${725 * OT}px;height:${1079 * OT}px;z-index:3`);
  E.img(otto, "o_defeated", `width:${725 * OT}px;height:${1079 * OT}px`);
  const stampBox = E.el(S.el, "abs", "left:100px;top:470px;width:880px;display:flex;justify-content:center;z-index:9");
  const st = E.stamp(stampBox, "LAST WEEK'S LEFTOVERS", HOME + 1.1, { size: 62, rot: -5, shake: 14 });
  st.style.alignSelf = "center";
  E.until(st, DUR, .1);

  // ---------------- speech bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const box = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 76 : 60}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(box, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    E.S(t0 + .02, "pop", .6);
    return b;
  };
  const sub = s => `<div style="font-size:40px;font-weight:800;color:${C.mute};margin-top:6px;letter-spacing:0">${s}</div>`;
  bubble("Thanks, bye!", 60, 470, 440, "l", .35, 1.6);
  bubble(`Leva qualquer coisa!${sub("(take a little something!)")}`, 400, 440, 640, "r", 1.6, 3.4, true);
  bubble("I live alone!", 30, 560, 400, "l", 4.5, 5.8);
  bubble("You're too thin!", 470, 640, 560, "r", 5.9, 7.4, true);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Leaving *grandma's* house", { size: 58, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[13.7, 1], [13.95, 1.18, "out"], [14.3, 1, "io"]]);
}
