// EP.91 "Coffee breaks in a Portuguese office" — Buck's first week at a Lisbon office. 09:30, three colleagues at the door: "Café?"
// "Sure! One coffee, why not!" 10:30: "Cafezinho?" "Another one? Okay!" 11:45: "Café?" — he's typing at light speed: "Okay-okay-okay-
// sure-sure!" 14:00, 16:00, 17:30… ESPRESSOS: 7. Buck, vibrating, hair on end: "I… can… hear… colours." 04:00, eyes wide open in bed.
// Next morning, 09:30, the colleagues again, concerned: "You look tired. Café?"
export const meta = {
  id: "ep91-cafe", date: "2026-12-23",
  images: {
    bg: "characters/scenes/bg_office.webp", dc: "characters/cutouts/buck-desk_calm.webp", dw: "characters/cutouts/buck-desk_wired.webp", bw: "characters/cutouts/buck_wired.webp",
    bed: "characters/cutouts/buck-bed_awake.webp", col: "characters/cutouts/colleagues_cafe.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 124, root: 57, seed: 911, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [9, 12, 16]] });
  const DUR = 20.4, C1 = .3, ONE = 1.1, C2 = 3.8, ANO = 4.8, C3 = 7.2, OK = 7.9, M = [10.2, 10.9, 11.6], COL = 12.6, NIGHT = 15.6, DAY = 17.2, TIRED = 17.6;
  const S = E.scene("cafe", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  // Buck at his desk (right), calm → wired; standing, vibrating; the next morning calm again
  const DS = .72, d1 = fig("dc", 1168, 880, DS, 331, 1900, 3), d2 = fig("dw", 1168, 880, DS, 331, 1900, 3), bw = fig("bw", 672, 1007, .95, 380, 1900, 4);
  show(d1, [[0, C3 + .5], [DAY, DUR]]); show(d2, [[C3 + .5, COL]]); show(bw, [[COL, NIGHT]]);
  const typ = []; for (let t = 0; t < C3; t += .5) typ.push([t, 0, "io"], [t + .25, -3, "io"]); E.K(d1, "y", typ);                  // frame-0 motion
  const vib = []; for (let t = C3 + .5; t < NIGHT; t += .05) vib.push([t, (Math.round(t * 20) % 2) ? (t < COL ? 4 : 9) : (t < COL ? -4 : -9)]); E.K(d2, "x", vib); E.K(bw, "x", vib);
  // espresso cups pile up on the desk
  const cups = [...Array(7)].map((_, i) => E.el(S.el, "abs", `left:${880 + (i % 4) * 46}px;top:${1448 - Math.floor(i / 4) * 38}px;width:42px;height:36px;border-radius:0 0 16px 16px;background:#fff;border:4px solid #cfd6dc;box-sizing:border-box;z-index:5;opacity:0`));
  const CT = [ONE + 1.5, ANO + 1.5, OK, OK + .3, M[0], M[1], M[2]];
  cups.forEach((c, i) => { E.K(c, "o", [[CT[i] - .01, 0], [CT[i], 1], [COL - .01, 1], [COL, 0]]); E.K(c, "y", [[CT[i], -80], [CT[i] + .25, 0, "in"]]); });
  // the colleagues pop in at the door (left)
  const col = fig("col", 688, 927, .78, -40, 1900, 5);
  const POP = [C1, C2, C3, ...M, DAY];
  E.K(col, "x", POP.flatMap((t, i) => { const out = [C1 + 1.4, C2 + 1.3, C3 + 1.2, M[0] + .55, M[1] + .55, M[2] + .55, DUR + 1][i]; return [[t - .01, -600], [t + .25, 0, "back"], [out, 0], [out + .25, -600, "in"]]; }));
  // night
  const N = E.el(S.el, "abs", "inset:0;background:#141a2e;z-index:7;opacity:0"); show(N, [[NIGHT, DAY]]);
  const bed = E.el(N, "abs", `left:40px;top:${1700 - 609 * 1.02}px;width:${972 * 1.02}px;height:${609 * 1.02}px`); E.img(bed, "bed", `width:${972 * 1.02}px;height:${609 * 1.02}px`);
  E.el(N, "abs", "left:380px;top:860px;font-weight:900;font-size:80px;color:#fff6c8", "👁 👁");

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "09:30 · ESPRESSOS: 0"], [ONE + 1.5, "09:40 · ESPRESSOS: 1"], [C2, "10:30 · ESPRESSOS: 1"], [ANO + 1.5, "10:40 · ESPRESSOS: 2"], [C3, "11:45 · ESPRESSOS: 4"],
    [M[0], "14:00 · ESPRESSOS: 5"], [M[1], "16:00 · ESPRESSOS: 6"], [M[2], "17:30 · ESPRESSOS: 7"], [NIGHT, "04:00 · STILL AWAKE"], [DAY, "09:30 · NEXT DAY"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= C3 && t < DAY ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const CB = (h, t0, t1, fs = 56, w = 300) => bubble(h, 40, 1040, w, 140, t0, t1, fs);
  const BB = (h, t0, t1, fs = 46, w = 520) => bubble(h, 520, 880, w, 260, t0, t1, fs);
  CB("Café?", C1, ONE); BB("Sure! One coffee, why not!", ONE, C2 - .1);
  CB("Cafezinho?", C2, ANO, 50, 340); BB("Another one? Okay!", ANO, C3 - .1);
  CB("Café?", C3, OK); BB("Okay-okay-okay-sure-sure!", OK, M[0] - .1, 44);
  M.forEach(t => CB("Café?", t, t + .6));
  BB("I… can… hear… colours.", COL, NIGHT - .1, 50, 480);
  CB("You look tired. Café?", TIRED, DUR - .4, 46, 460);
  const sb = E.el(S.el, "abs", "left:60px;top:560px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "ESPRESSO #8.", TIRED + 1.6, { size: 116, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/office.wav", { vol: .4, duck: false, to: NIGHT });
  E.clip(0, "sfx/keyboard.wav", { vol: .4, duck: false, to: C3 });
  [C1, C3, ...M].forEach(t => E.clip(t, "voices/ep91/c_cafe.wav", { vol: 1.3 }));
  E.clip(C2, "voices/ep91/c_cafezinho.wav", { vol: 1.3 });
  E.clip(ONE, "voices/ep91/b_one.wav", { vol: 1.2 }); E.clip(ANO, "voices/ep91/b_another.wav", { vol: 1.2 }); E.clip(OK, "voices/ep91/b_okay.wav", { vol: 1.2 });
  CT.forEach(t => E.clip(t, "sfx/elx-cup-saucer.wav", { vol: .5 }));
  E.clip(C3 + .5, "sfx/keyboard.wav", { vol: .9, duck: false, to: COL - C3 - .5 });
  E.clip(COL, "voices/ep91/b_colours.wav", { vol: 1.25 }); E.S(COL, "buzz", .4);
  E.S(NIGHT, "whoosh", .4); for (let t = NIGHT + .2; t < DAY; t += .5) E.S(t, "tick", .5);
  E.S(DAY, "whoosh", .4); E.clip(TIRED, "voices/ep91/c_tired.wav", { vol: 1.3 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Working in a Portuguese *office*", { size: 48, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[19.6, 1], [19.85, 1.18, "out"], [20.2, 1, "io"]]);
}
