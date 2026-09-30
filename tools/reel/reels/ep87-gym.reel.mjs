// EP.87 "The gym in January" — Jan 2: the gym is packed; Otto in brand-new neon gear: "New year, new me!" In the corner an 84-year-old
// does pull-ups, bored. The calendar flips — Jan 8, 15, 22 — and the crowd melts away; only Otto and the old man are left. Jan 29, Otto is
// dragged off the treadmill: "I think… I pulled… everything." Feb 1, he leaves with a pizza. The old man, one-handed, waves: "See you next
// January." ONE YEAR LATER, Jan 2: the crowd is back, Otto flexes: "New year, new me!" The old man sighs: "…Again?"
export const meta = {
  id: "ep87-gym", date: "2026-12-19",
  images: {
    bg: "characters/scenes/bg_gym.webp", crowd: "characters/cutouts/gym_crowd.webp", of: "characters/cutouts/otto-gym_flex.webp", od: "characters/cutouts/otto-gym_dead.webp",
    oq: "characters/cutouts/otto-gym_quit.webp", vp: "characters/cutouts/oldman_pullup.webp", vw: "characters/cutouts/oldman_wave.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 128, root: 52, seed: 871, prog: [[0, 3, 7], [5, 8, 12], [7, 10, 14], [3, 7, 10]] });
  const DUR = 19.8, NEW = .4, D = [0, 2.6, 4.2, 5.8, 7.4], PULL = 7.7, FEB = 11.0, JAN = 11.6, YEAR = 13.6, NEW2 = 14.2, AGAIN = 16.2;
  const S = E.scene("gym", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3, flip = false) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); const inner = E.el(el, "abs", `left:0;top:0;width:${w * s}px;height:${h * s}px;${flip ? "transform:scaleX(-1)" : ""}`); E.img(inner, n, `width:${w * s}px;height:${h * s}px`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  // the crowd: three groups that leave one by one, and come back a year later
  const c1 = fig("crowd", 993, 635, .62, -60, 1500, 2), c2 = fig("crowd", 993, 635, .62, 470, 1500, 2, true), c3 = fig("crowd", 993, 635, .7, 120, 1640, 2, true);
  show(c1, [[0, D[3]], [YEAR, DUR]]); show(c2, [[0, D[1]], [YEAR, DUR]]); show(c3, [[0, D[2]], [YEAR, DUR]]);
  [c1, c2, c3].forEach((c, i) => { const k = []; for (let t = 0; t < DUR; t += .3) k.push([t, 0], [t + .15, -10 - i * 3]); E.K(c, "y", k); });   // frame-0 motion
  // the old man on his pull-up bar (right), all year
  const V = .8, vp = fig("vp", 688, 978, V, 520, 1520, 4), vw = fig("vw", 688, 977, V, 520, 1520, 4);
  show(vp, [[0, FEB], [YEAR, DUR]]); show(vw, [[FEB, YEAR]]);
  const reps = []; for (let t = 0; t < DUR; t += .9) reps.push([t, 0, "io"], [t + .45, 50, "io"]); E.K(vp, "y", reps);
  const age = E.el(S.el, "abs", "left:860px;top:1460px;background:#1d2b36;color:#fff;font-weight:900;font-size:30px;padding:6px 14px;border-radius:12px;z-index:6", "AGE: 84");
  E.K(age, "r", [[0, 4]]);
  // Otto
  const o1 = fig("of", 559, 999, .78, 250, 1880, 5), o2 = fig("od", 986, 492, .9, 60, 1890, 5), o3 = fig("oq", 592, 987, .78, 300, 1880, 5);
  show(o1, [[0, D[4]], [YEAR, DUR]]); show(o2, [[D[4], FEB]]); show(o3, [[FEB, YEAR]]);
  E.K(o3, "x", [[FEB + .3, 0], [YEAR - .2, -500, "in"]]);
  const drops = [...Array(6)].map((_, i) => E.el(S.el, "abs", `left:${360 + i * 50}px;top:${1100 + (i % 2) * 40}px;font-size:40px;z-index:6;opacity:0`, "💦"));
  drops.forEach((d, i) => { show(d, [[D[3], D[4]]]); E.K(d, "y", [[D[3], 0], [D[4], 120 + i * 10]]); });
  const o2b = []; for (let t = D[4]; t < FEB; t += .3) o2b.push([t, 0], [t + .15, 14]); E.K(o2, "x", o2b);

  // the calendar page (top left)
  const cal = E.el(S.el, "abs", "left:60px;top:460px;width:230px;height:250px;border-radius:18px;background:#fff;box-shadow:0 12px 26px rgba(0,0,0,.25);z-index:7;overflow:hidden;text-align:center");
  E.el(cal, "", "height:70px;background:#e5484d;color:#fff;font-weight:900;font-size:40px;line-height:70px", "");
  const mon = cal.firstChild, day = E.el(cal, "", "font-weight:900;font-size:120px;line-height:170px;color:#1d2b36", "");
  const CAL = [[0, ["JAN", "2"]], [D[1], ["JAN", "8"]], [D[2], ["JAN", "15"]], [D[3], ["JAN", "22"]], [D[4], ["JAN", "29"]], [FEB, ["FEB", "1"]], [YEAR, ["JAN", "2"]]];
  E.F(t => { const [m, d] = at(CAL, t); if (mon.textContent !== m) mon.textContent = m; if (day.textContent !== d) day.textContent = d; });
  CAL.slice(1).forEach(([t]) => E.K(cal, "r", [[t - .01, 0], [t + .1, -10, "out"], [t + .3, 0, "io"]]));
  const yl = E.el(S.el, "abs", "inset:0;background:#1d2b36;z-index:9;opacity:0;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:90px", "ONE YEAR LATER…");
  E.K(yl, "o", [[YEAR - .5, 0], [YEAR - .35, 1], [YEAR + .05, 1], [YEAR + .3, 0]]);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "MEMBERS TODAY: 84"], [D[1], "MEMBERS TODAY: 41"], [D[2], "MEMBERS TODAY: 12"], [D[3], "MEMBERS TODAY: 2"], [FEB, "MEMBERS TODAY: 1"], [YEAR, "MEMBERS TODAY: 84"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= D[3] && t < YEAR ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("New year, new me!", 180, 950, 440, 200, NEW, D[1] - .05, 52);
  bubble("I think… I pulled… everything.", 60, 1300, 580, 180, PULL, FEB - .05, 46);
  bubble("See you next January.", 480, 560, 520, 330, JAN, YEAR - .5, 48);
  bubble("New year, new me!", 180, 950, 440, 200, NEW2, AGAIN - .05, 52);
  bubble("…Again?", 700, 560, 280, 130, AGAIN, DUR - .4, 56);
  const sb = E.el(S.el, "abs", "left:60px;top:1520px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "SEE YOU IN FEBRUARY.", AGAIN + 1.0, { size: 92, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/club-full.wav", { vol: .35, duck: false, to: D[2] });
  E.clip(0, "sfx/crowd-murmur.wav", { vol: .5, duck: false, to: D[2] });
  E.clip(NEW, "voices/ep87/o_new.wav", { vol: 1.2 });
  D.slice(1).forEach(t => E.S(t, "swish", .5));
  E.clip(D[3], "sfx/panting.wav", { vol: .8, to: 1.6 });
  E.clip(PULL, "voices/ep87/o_pulled.wav", { vol: 1.2 }); E.S(PULL - .2, "thud", .5);
  E.S(FEB, "whoosh", .5); E.clip(JAN, "voices/ep87/v_january.wav", { vol: 1.35 });
  E.S(YEAR - .4, "riser", .5); E.clip(YEAR, "sfx/club-full.wav", { vol: .35, duck: false, to: DUR - YEAR }); E.clip(YEAR, "sfx/crowd-murmur.wav", { vol: .5, duck: false, to: DUR - YEAR });
  E.clip(NEW2, "voices/ep87/o_new.wav", { vol: 1.2 });
  E.clip(AGAIN, "voices/ep87/v_again.wav", { vol: 1.4 }); E.S(AGAIN + 1.0, "thud", .6);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "The gym in *January*", { size: 60, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[19.0, 1], [19.25, 1.18, "out"], [19.6, 1, "io"]]);
}
