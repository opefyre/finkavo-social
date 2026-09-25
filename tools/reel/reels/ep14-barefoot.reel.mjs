// EP.14 "One sneeze at grandma's" — Otto sneezes once. Grandma: "You're SICK!" Tea, honey, lemon, ointment, soup, blankets,
// a hot-water bottle, a thermometer — until he is buried. The diagnosis: "You walked BAREFOOT!" (a zoom onto his bare feet).
// Then grandma sneezes. "Allergies." Universal joke; the barefoot belief is very Portuguese. Paced per the reel-pacing note.
export const meta = {
  id: "ep14-barefoot", date: "2026-10-07",
  images: {
    o_meh: "characters/cutouts/otto-sofa_meh.webp", o_sneeze: "characters/cutouts/otto-sofa_sneeze.webp", o_buried: "characters/cutouts/otto-sofa_buried.webp",
    d_offended: "characters/cutouts/dona_offended.webp", d_tea: "characters/cutouts/dona_tea.webp", d_sneeze: "characters/cutouts/dona_sneeze.webp", d_smirk: "characters/cutouts/dona_smirk.webp",
    r_tea: "characters/props/tea.webp", r_honey: "characters/props/honey.webp", r_lemon: "characters/props/lemon.webp", r_ointment: "characters/props/ointment.webp",
    r_soup: "characters/props/soup-chicken.webp", r_blanket: "characters/props/blanket.webp", r_hot: "characters/props/hotwater.webp", r_thermo: "characters/props/thermometer.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 55, seed: 141, prog: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]] });
  const DUR = 14.2;
  const S = E.scene("room", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FLOOR = 1760;
  const ACHOO = 1.0, IN = 2.0, CURE = 3.6, BURY = 5.85, FEET = 8.0, GSNZ = 10.3, ALLERGY = 11.1;

  // ---------------- the living room ----------------
  const stage = E.el(S.el, "abs", "inset:0;transform-origin:75px 2187px");                     // zoom keeps the feet mid-screen
  E.el(stage, "abs", "left:0;top:0;width:1080px;height:1920px;background:#f1dfc7");
  E.el(stage, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:repeating-linear-gradient(90deg,rgba(180,140,100,.10) 0 40px,transparent 40px 80px)");   // striped wallpaper
  E.el(stage, "abs", `left:-200px;top:${FLOOR}px;width:1480px;height:900px;background:#b07d52`);
  E.el(stage, "abs", `left:0;top:${FLOOR}px;width:1080px;height:12px;background:#8a5f3a`);
  // a framed picture and a window
  E.el(stage, "abs", "left:120px;top:560px;width:220px;height:170px;border:14px solid #8a5f3a;background:linear-gradient(180deg,#9fd3f0,#f6e7b6);border-radius:6px");
  E.el(stage, "abs", "left:640px;top:520px;width:300px;height:300px;border:16px solid #fff;background:linear-gradient(180deg,#8fc3e8,#d6ecf7);border-radius:8px");
  E.el(stage, "abs", "left:782px;top:520px;width:16px;height:300px;background:#fff");
  // a rug and a coffee table (things land on it)
  E.el(stage, "abs", `left:60px;top:${FLOOR - 40}px;width:900px;height:90px;border-radius:50%;background:#c9543d;opacity:.8`);
  const table = E.el(stage, "abs", `left:640px;top:${FLOOR - 230}px;width:360px;height:230px;z-index:2`);
  E.el(table, "abs", "left:0;top:0;width:360px;height:30px;border-radius:10px;background:#7a4a26");
  E.el(table, "abs", "left:30px;top:30px;width:24px;height:200px;background:#6a3e1e");
  E.el(table, "abs", "left:306px;top:30px;width:24px;height:200px;background:#6a3e1e");

  // ---------------- Otto on the sofa ----------------
  const OS = 1.08, OW = 806 * OS, OH = 931 * OS;
  const ottoW = E.el(stage, "abs", `left:-80px;top:${FLOOR - OH + 20}px;width:${OW}px;height:${OH}px;z-index:1`);
  const ottoI = E.el(ottoW, "abs", "inset:0;transform-origin:50% 100%");
  const OT = ["o_meh", "o_sneeze", "o_buried"];
  const oim = OT.map(n => E.img(ottoI, n, `position:absolute;left:0;top:0;width:${OW}px;height:${OH}px`));
  E.F(t => {
    const f = at([[0, "o_meh"], [ACHOO, "o_sneeze"], [ACHOO + 1.0, "o_meh"], [BURY, "o_buried"]], t);
    oim.forEach((im, i) => { im.style.opacity = OT[i] === f ? 1 : 0; });
    let r = 0, y = 0;
    if (t < ACHOO) { const k = t / ACHOO; r = -k * 3; y = -k * 10; }                 // the build-up: head tipping back
    if (t >= ACHOO && t < ACHOO + .25) r = 4 - (t - ACHOO) * 16;
    if (t >= BURY && t < FEET) r = Math.sin(t * 30) * .8;
    ottoI.style.transform = `translateY(${y}px) rotate(${r}deg)`;
  });
  // "ah… ah…" then ACHOO!
  const burst = (str, t0, t1, left, top, rot, col) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;z-index:8;transform-origin:50% 50%`);
    E.el(b, "", `font-weight:900;font-size:120px;letter-spacing:-.03em;color:${col};-webkit-text-stroke:10px #fff;paint-order:stroke fill;transform:rotate(${rot}deg);white-space:nowrap`, str);
    E.K(b, "s", [[t0, .3], [t0 + .22, 1.15, "back"], [t0 + .4, 1]]);
    E.K(b, "o", [[t0 - .01, 0], [t0, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const ah = E.el(S.el, "abs", "left:110px;top:640px;z-index:8;font-weight:900;font-size:70px;color:#5b6a73;-webkit-text-stroke:8px #fff;paint-order:stroke fill;white-space:nowrap", "ah… ah…");
  E.K(ah, "o", [[0, 1], [ACHOO - .05, 1], [ACHOO, 0]]);
  E.K(ah, "s", [[0, 1], [.5, 1.08, "io"], [ACHOO, 1.16, "io"]]);
  burst("ACHOO!", ACHOO, ACHOO + 1.0, 120, 620, -8, C.coralD);
  E.S(ACHOO, "slam", .7); E.shake(ACHOO, 22, .35); E.flash(ACHOO, "#ffffff", .3, .15);

  // ---------------- grandma ----------------
  const DS = .95;
  const dona = E.el(stage, "abs", `left:470px;top:${FLOOR - 1024 * DS + 10}px;width:${700 * DS}px;height:${1024 * DS}px;z-index:3`);
  const DT = ["d_offended", "d_tea", "d_sneeze", "d_smirk"];
  const dim = DT.map(n => E.img(dona, n, `position:absolute;left:0;bottom:0;height:${1020 * DS}px;width:auto`));
  dim[0].style.transform = "scaleX(-1)";                                                      // pointing left, at Otto
  E.F(t => { const f = at([[0, "d_offended"], [CURE, "d_tea"], [FEET - .2, "d_offended"], [GSNZ, "d_sneeze"], [ALLERGY, "d_smirk"]], t); dim.forEach((im, i) => { im.style.opacity = DT[i] === f ? 1 : 0; }); });
  E.K(dona, "x", [[IN - .01, 700], [IN, 700], [IN + .3, 0, "out"]]);
  E.K(dona, "o", [[IN - .02, 0], [IN - .01, 1]]);
  E.S(IN, "whoosh", .8);
  // she bustles while curing
  const bus = []; for (let t = CURE; t < FEET; t += .5) bus.push([t, 0, "io"], [t + .25, -14, "io"]);
  E.K(dona, "y", bus.concat([[FEET, 0]]));

  // ---------------- the cure: remedies land one by one ----------------
  // the first four land ON Otto (they become part of the pile at BURY), the rest on the table
  const R = [["r_soup", 216, 234, 330, 1420, .75], ["r_blanket", 260, 178, 300, 1330, .95], ["r_hot", 150, 255, 290, 930, .6], ["r_thermo", 167, 220, 420, 1080, .55],
    ["r_tea", 190, 206, 760, FLOOR - 230, .7], ["r_honey", 168, 211, 880, FLOOR - 230, .6], ["r_lemon", 166, 159, 700, FLOOR - 230, .55], ["r_ointment", 219, 145, 930, FLOOR - 200, .5]];
  const T0 = CURE + .2, DT0 = .5;
  const count = E.el(S.el, "abs", `left:100px;top:352px;display:inline-block;background:${C.coralD};color:#fff;font-weight:900;font-size:56px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7;opacity:0;transform-origin:0 50%`, "REMEDIES 1");
  R.forEach(([n, w, h, cx, bottom, s], i) => {
    const t = T0 + i * DT0, W = w * s, H = h * s;
    const el = E.el(stage, "abs", `left:${cx - W / 2}px;top:${bottom - H}px;width:${W}px;height:${H}px;z-index:4;transform-origin:50% 100%;opacity:0`);
    E.img(el, n, `width:${W}px;height:${H}px`);
    E.K(el, "o", [[t - .01, 0], [t, 1], ...(i < 4 ? [[BURY, 1], [BURY + .01, 0]] : [])]);           // the ones on Otto become the pile
    E.K(el, "x", [[t, 760 - cx], [t + .32, 0, "out"]]);
    E.K(el, "y", [[t, -220], [t + .16, -320, "out"], [t + .32, 0, "in"]]);
    E.K(el, "sy", [[t + .32, .8], [t + .46, 1, "back"]]);
    E.S(t, "swish", .6); E.S(t + .32, i % 2 ? "pop" : "thud", .7);
    E.K(count, "s", [[t + .32, 1.3], [t + .5, 1, "back"]]);
  });
  E.K(count, "o", [[T0 + .3, 0], [T0 + .32, 1], [FEET - .1, 1], [FEET, 0]]);
  E.F(t => { const n = Math.max(1, Math.min(R.length, Math.floor((t - T0 - .32) / DT0) + 1)); const s = "REMEDIES " + n; if (count.textContent !== s) count.textContent = s; });
  E.S(BURY, "poof", .9); E.flash(BURY, "#fff4c0", .3, .2);

  // ---------------- the diagnosis: zoom onto the bare feet ----------------
  E.K(stage, "s", [[FEET, 1], [FEET + .35, 1.9, "out"], [FEET + 1.9, 1.9], [FEET + 2.2, 1, "io"]]);
  const ring = E.el(stage, "abs", `left:150px;top:${FLOOR - 110}px;width:340px;height:150px;border-radius:50%;border:10px solid ${C.coral};z-index:6;opacity:0`);
  E.K(ring, "o", [[FEET + .35, 0], [FEET + .45, 1], [FEET + 1.9, 1], [FEET + 2.0, 0]]);
  E.K(ring, "s", [[FEET + .35, 1.4], [FEET + .6, 1, "back"]]);
  E.S(FEET, "scratch", .8); E.S(FEET + .4, "thud", .8);

  // ---------------- speech bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const box = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 80 : 62}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(box, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    E.S(t0 + .02, "pop", .6);
    return b;
  };
  bubble("You're SICK!", 470, 640, 520, "r", IN + .25, CURE, true);
  bubble("You walked BAREFOOT!", 300, 520, 700, "r", FEET + .4, GSNZ - .1, true);
  burst("ACHOO!", GSNZ, GSNZ + .8, 540, 640, 7, C.coralD);
  E.S(GSNZ, "slam", .6); E.shake(GSNZ, 16, .3);
  bubble("Allergies.", 560, 650, 420, "r", ALLERGY, 13.3, true);
  E.S(ALLERGY + .3, "ding", .6);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "One sneeze at *grandma's*", { size: 58, lh: 1.04, instant: true, id: "hook", nowrap: true });
  E.K(titleBox, "o", [[FEET, 1], [FEET + .15, 0], [FEET + 2.05, 0], [FEET + 2.25, 1]]);              // out of the way during the zoom

  E.finish(DUR);
  E.K(E.logo, "s", [[13.3, 1], [13.55, 1.18, "out"], [13.9, 1, "io"]]);
}
