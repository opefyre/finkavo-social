// EP.89 "Coming home to Portugal for Christmas" — Lisbon arrivals. Buck comes out; one bored driver with a sign: BUCK. "Oh, hey! That's
// me!" Then Tiago comes out… and the whole family erupts: banner, balloons, accordion, 37 relatives. Mum grabs his face: "Ai, filho! Look
// how THIN you are!" "Mum… I was gone for ONE week." "ONE WEEK!" Grandma pushes through with a bifana: "Eat! You look so thin!" Buck's
// driver drops the BUCK sign and dances off to join the party. Buck, alone with his suitcase: "…Hello?"
export const meta = {
  id: "ep89-arrivals", date: "2026-12-21",
  images: {
    bg: "characters/scenes/bg_arrivals.webp", bk: "characters/cutouts/buck_suitcase.webp", ds: "characters/cutouts/driver_sign.webp", dd: "characters/cutouts/driver_dance.webp",
    ti: "characters/cutouts/tiago_suitcase.webp", mum: "characters/cutouts/mum_cheeks.webp", fam: "characters/cutouts/family_welcome.webp", gb: "characters/cutouts/dona_bifana.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 118, root: 55, seed: 891, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 20.2, BUCK = .5, ME = .9, TI = 2.8, BOOM = 3.5, MUM = 5.4, WEEK = 8.4, WAIL = 11.4, EAT = 13.0, DRIVER = 15.4, HELLO = 16.8;
  const S = E.scene("arrivals", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  // the sliding doors open for each arrival
  const doors = E.el(S.el, "abs", "left:360px;top:760px;width:360px;height:520px;z-index:1;overflow:hidden");
  for (const side of [0, 1]) { const d = E.el(doors, "abs", `left:${side * 180}px;top:0;width:180px;height:520px;background:rgba(190,225,245,.85);border:4px solid #b9c6d0;box-sizing:border-box`); E.K(d, "x", [[0, 0], [BUCK - .3, 0], [BUCK, side ? 170 : -170, "out"], [BUCK + 1, side ? 170 : -170], [BUCK + 1.3, 0, "io"], [TI - .3, 0], [TI, side ? 170 : -170, "out"], [TI + 1.4, side ? 170 : -170], [TI + 1.7, 0, "io"]]); }
  // the family behind the barrier (left), then pouring forward
  const fam = fig("fam", 1024, 688, .95, -60, 1560, 2); show(fam, [[BOOM, DUR]]);
  E.K(fam, "y", [[BOOM, 300], [BOOM + .35, 0, "back"]]); E.K(fam, "x", [[DRIVER, 0], [DRIVER + 1, -1300, "in"]]);
  const jump = []; for (let t = BOOM; t < DUR; t += .35) jump.push([t, 0], [t + .17, -14]); E.K(fam, "r", jump.map(([t, v]) => [t, v / 7]));
  const banner = E.el(S.el, "abs", "left:40px;top:560px;width:700px;height:120px;background:#fffdf3;border:6px solid #b3262c;border-radius:14px;z-index:5;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:58px;color:#b3262c;letter-spacing:.04em;opacity:0;box-shadow:0 10px 24px rgba(0,0,0,.25)", "BEM-VINDO TIAGO ❤️");
  E.K(banner, "o", [[BOOM, 0], [BOOM + .1, 1]]); E.K(banner, "x", [[DRIVER, 0], [DRIVER + 1, -1300, "in"]]); E.K(banner, "r", [[BOOM, -12], [BOOM + .5, -3, "back"]]);
  const confetti = [...Array(36)].map((_, i) => E.el(S.el, "abs", `left:${(i * 97) % 1080}px;top:0;width:16px;height:26px;background:${["#e5484d", "#f2c230", "#2fae6b", "#2f6db5", "#ff8ae2"][i % 5]};z-index:8;opacity:0`));
  E.F(t => confetti.forEach((c, i) => { const u = t - BOOM; if (u < 0 || t > DRIVER + 1.2) { c.style.opacity = 0; return; } const y = ((u * (300 + (i % 5) * 60)) + i * 53) % 1700 + 400; c.style.opacity = 1; c.style.transform = `translate(${Math.sin(u * 3 + i) * 40}px,${y}px) rotate(${u * 300 + i * 40}deg)`; }));
  // the driver (right) with his sign
  const d1 = fig("ds", 464, 1024, .7, 745, 1880, 4), d2 = fig("dd", 671, 1007, .7, 700, 1880, 4);
  show(d1, [[0, DRIVER]]); show(d2, [[DRIVER, DUR]]);
  E.el(d1, "abs", "left:65px;top:240px;width:180px;height:90px;background:#fff;border:4px solid #1d2b36;border-radius:6px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:42px;color:#1d2b36", "BUCK");
  const chew = []; for (let t = 0; t < DRIVER; t += .5) chew.push([t, 0, "io"], [t + .25, -4, "io"]); E.K(d1, "y", chew);                       // frame-0 motion
  E.K(d2, "x", [[DRIVER, 0], [DRIVER + 1.1, -1200, "in"]]);
  const sign = E.el(S.el, "abs", "left:800px;top:1790px;width:150px;height:80px;background:#fff;border:4px solid #1d2b36;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:34px;color:#1d2b36;z-index:3;opacity:0;transform:rotate(-20deg)", "BUCK");
  show(sign, [[DRIVER + .1, DUR]]); E.K(sign, "y", [[DRIVER + .1, -500], [DRIVER + .45, 0, "in"]]);
  // Buck and Tiago come through the doors
  const bk = fig("bk", 670, 982, .72, 380, 1900, 5);
  E.K(bk, "x", [[BUCK, -300], [BUCK + .9, -90, "out"], [BOOM, -90], [BOOM + .35, 800, "out"], [DRIVER + 1, 800], [HELLO - .2, -120, "io"]]);
  E.K(bk, "r", [[BOOM, 0], [BOOM + .2, 18, "out"], [BOOM + .4, 0, "io"]]); E.K(bk, "s", [[BUCK, .7], [BUCK + .9, 1, "out"]]);
  const ti = fig("ti", 514, 1014, .76, 300, 1900, 6);
  show(ti, [[TI, DRIVER + .8]]); E.K(ti, "s", [[TI, .7], [TI + .7, 1, "out"]]); E.K(ti, "x", [[TI + .7, 0], [MUM - .2, -40, "io"], [DRIVER, -40], [DRIVER + .8, -600, "in"]]);
  const mum = fig("mum", 688, 1024, .76, -520, 1920, 7);
  E.K(mum, "x", [[MUM - .3, 0], [MUM, 400, "out"], [DRIVER, 400], [DRIVER + .8, -400, "in"]]);
  const shake = []; for (let t = WAIL; t < WAIL + 1.4; t += .1) shake.push([t, (Math.round(t * 10) % 2) ? 4 : -4]); shake.push([WAIL + 1.5, 0]); E.K(mum, "r", shake);
  const gb = fig("gb", 676, 994, .66, 1100, 1920, 8);
  E.K(gb, "x", [[EAT - .3, 0], [EAT, -620, "out"], [DRIVER, -620], [DRIVER + .8, -1900, "in"]]);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "WAITING FOR BUCK: 1"], [BOOM, "WAITING FOR TIAGO: 37"], [WEEK, "TIAGO WAS AWAY: 7 DAYS"], [DRIVER, "WAITING FOR TIAGO: 38"], [HELLO, "WAITING FOR BUCK: 0"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= DRIVER ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Oh, hey! That's me!", 300, 980, 420, 200, ME, TI - .1, 48);
  bubble("Ai, filho! Look how THIN you are!", 40, 980, 560, 200, MUM, WEEK - .05, 46);
  bubble("Mum… I was gone for ONE week.", 380, 1000, 560, 160, WEEK, WAIL - .05, 44);
  bubble("ONE WEEK!", 40, 1000, 360, 200, WAIL, EAT - .1, 60);
  bubble("Eat! You look so thin!", 520, 980, 480, 320, EAT, DRIVER, 48);
  bubble("…Hello?", 330, 1000, 260, 140, HELLO, DUR - .4, 56);
  const sb = E.el(S.el, "abs", "left:60px;top:500px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "FAMILY: 38 · BUCK: 0", HELLO + .9, { size: 92, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/waiting-room.wav", { vol: .5, duck: false, to: BOOM });
  E.S(BUCK - .3, "swish", .5); E.clip(ME, "voices/ep89/b_me.wav", { vol: 1.2 });
  E.S(TI - .3, "swish", .5); E.clip(TI + .4, "sfx/record-silence.wav", { vol: .3 });
  E.clip(BOOM, "sfx/applause-cheer.wav", { vol: .9, duck: false, to: 3 }); E.clip(BOOM, "sfx/wedding-party.wav", { vol: .5, duck: false, gain: [[DRIVER, 1], [DRIVER + 1.4, 0]], to: DRIVER + 1.5 - BOOM }); E.S(BOOM, "pop", .8);
  E.clip(MUM, "voices/ep89/m_thin.wav", { vol: 1.3 });
  E.clip(WEEK, "voices/ep89/t_week.wav", { vol: 1.25 });
  E.clip(WAIL, "voices/ep89/m_week.wav", { vol: 1.35 }); E.clip(WAIL + .2, "sfx/crowd-ooh.wav", { vol: .7 });
  E.clip(EAT, "voices/ep89/g_eat.wav", { vol: 1.3 });
  E.S(DRIVER, "whoosh", .6); E.clip(DRIVER + .4, "sfx/note-slap.wav", { vol: .6 });
  E.clip(HELLO - .2, "sfx/record-silence.wav", { vol: .3 }); E.clip(HELLO, "voices/ep89/b_hello.wav", { vol: 1.3 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Coming home to *Portugal*", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[19.4, 1], [19.65, 1.18, "out"], [20.0, 1, "io"]]);
}
