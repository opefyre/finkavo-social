// EP.78 "Your neighbour's DIY project" — a cross-section of two flats. Sunday, 08:00: Otto asleep downstairs; upstairs Sr. Manel lifts
// a huge drill. BRRRR — dust rains on Otto: "…It's Sunday. It's eight a.m." Upstairs, Manel, all innocence: "Just one little hole,
// vizinho!" Then the montage — the hammer, the circular saw, the jackhammer, the cement mixer — SUNDAY 12:00 → MONDAY → WEEK 3 →
// MONTH 7 → YEAR 2, while Otto grows a long grey beard. Silence. The masterpiece: one tiny shelf with one Barcelos rooster. His wife:
// "Ó Manel, ficou tão lindo!" (Oh Manel, it's so beautiful!) Manel: "Two years. Is it straight?" The shelf tilts; the rooster smashes.
// Manel, unbothered: "Okay. Tomorrow. Eight o'clock."
export const meta = {
  id: "ep78-diy", date: "2026-12-10",
  images: {
    os: "characters/cutouts/otto-bed_sleep.webp", oa: "characters/cutouts/otto-bed_awake.webp", orb: "characters/cutouts/otto-robe_shock.webp", oan: "characters/cutouts/otto-casual_ancient.webp",
    md: "characters/cutouts/manel_drill.webp", mj: "characters/cutouts/manel_jackhammer.webp", mp: "characters/cutouts/manel_present.webp", wife: "characters/cutouts/lady_ask.webp",
    galo: "characters/props/diy_galo.webp", shelf: "characters/props/diy_shelf.webp", saw: "characters/props/diy_saw.webp", ham: "characters/props/diy_hammer.webp", mix: "characters/props/diy_mixer.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 110, root: 55, seed: 787, prog: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]] });
  const DUR = 20.8, DRILL = 1.2, SUN = 2.9, DOOR = 5.5, HOLE = 5.8, M = [8.0, 8.85, 9.7, 10.55, 11.4], REV = 12.4, LINDO = 12.7,
    STR = 15.0, FALL = 16.8, TOM = 17.7, AGAIN = 19.6;
  const S = E.scene("diy", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, left, bottom, z = 3) => { const el = E.el(P, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const NOISE = [[DRILL, SUN - .2], [AGAIN, DUR], ...M.map(t => [t, t + .75])];
  const noisy = t => NOISE.some(([a, b]) => t >= a && t < b);

  // ================= the building, cut open =================
  E.el(S.el, "abs", "inset:0;background:#e9dcc4");
  const UF = 1180;                                                                                  // upstairs floor line
  const U = E.el(S.el, "abs", `left:0;top:420px;width:1080px;height:${UF - 420}px;overflow:hidden;background:#f3e6cf`);
  E.el(U, "abs", "inset:0;background-image:radial-gradient(rgba(160,90,60,.14) 3px,transparent 4px);background-size:54px 54px");
  E.el(U, "abs", "left:40px;top:120px;width:170px;height:520px;background:#8a5a2b;border:10px solid #6a4020;box-sizing:border-box;border-radius:6px");   // the door
  E.el(U, "abs", "left:180px;top:380px;width:14px;height:14px;border-radius:50%;background:#f2c230");
  E.el(S.el, "abs", `left:0;top:${UF}px;width:1080px;height:34px;background:repeating-linear-gradient(90deg,#9a9a9a 0 60px,#8a8a8a 60px 120px)`);
  const D = E.el(S.el, "abs", `left:0;top:${UF + 34}px;width:1080px;height:${1920 - UF - 34}px;overflow:hidden;background:#d9e6f2`);
  E.el(D, "abs", "inset:0;background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.35) 0 40px,transparent 40px 80px)");
  E.el(D, "abs", "left:0;top:600px;width:1080px;height:200px;background:#b88f5c");
  const frame = E.el(D, "abs", "left:700px;top:90px;width:200px;height:150px;background:#fffdf3;border:12px solid #7a4a2a;box-sizing:border-box;transform-origin:50% 0");
  E.el(frame, "abs", "left:30px;top:30px;width:116px;height:66px;background:linear-gradient(180deg,#8fd0f5 50%,#7bc47f 50%)");
  // cracks that spread over the months
  const cracks = E.el(D, "abs", "left:0;top:0;width:1080px;height:300px");
  cracks.innerHTML = `<svg width="1080" height="300"><g fill="none" stroke="#5a6470" stroke-width="5" stroke-linecap="round">
    <path id="c1" d="M300 0 L330 60 L310 110 L350 170"/><path id="c2" d="M620 0 L600 50 L640 90 L620 150 L660 210"/><path id="c3" d="M880 0 L860 70 L900 120"/><path id="c4" d="M120 0 L150 80 L120 130"/></g></svg>`;
  const cs = [...cracks.querySelectorAll("path")];
  E.F(t => cs.forEach((p, i) => { p.style.opacity = t >= M[Math.min(i + 1, 4)] ? 1 : 0; }));
  // dust falling from the ceiling while anything is running
  const dust = [...Array(18)].map((_, i) => E.el(D, "abs", `left:${40 + (i * 61) % 1000}px;top:0;width:${8 + (i % 3) * 5}px;height:${8 + (i % 3) * 5}px;border-radius:50%;background:#bdb3a2;opacity:0`));
  E.F(t => dust.forEach((d, i) => { const on = noisy(t), u = ((t * .9 + i * .137) % 1); d.style.opacity = on ? .9 : 0; d.style.transform = `translateY(${u * 600}px)`; }));
  E.F(t => { const a = noisy(t) ? Math.sin(t * 40) * 4 : 0; frame.style.transform = `rotate(${a + (t >= M[2] ? 9 : 0)}deg)`; });
  // the whole building trembles with the noise
  const quake = []; for (let t = 0; t < DUR; t += .08) quake.push([t, noisy(t) ? (Math.round(t * 12.5) % 2 ? 4 : -4) : 0]); E.K(U, "x", quake); E.K(D, "x", quake);

  // ================= Otto, downstairs =================
  const obed = E.el(D, "abs", "left:0;top:0;width:1px;height:1px;z-index:3");
  const o1 = fig(obed, "os", 908, 463, .95, 20, 680, 3), o2 = fig(obed, "oa", 907, 541, .95, 20, 680, 3);
  show(o1, [[0, DRILL + .2]]); show(o2, [[DRILL + .2, M[3]]]);
  const zz = E.el(D, "abs", "left:330px;top:160px;font-weight:900;font-size:60px;color:#6b7c8f", "z z z");
  E.K(zz, "y", [[0, 0], [DRILL, -40]]); show(zz, [[0, DRILL]]);                                          // frame-0 motion
  const oan = fig(D, "oan", 625, 1078, .56, 700, 680, 4); show(oan, [[M[3], REV]]);
  E.K(oan, "x", [[M[3], 60], [M[3] + .3, 0, "out"]]);

  // ================= Manel, upstairs =================
  const md = fig(U, "md", 496, 981, .56, 640, UF - 420, 3), mj = fig(U, "mj", 541, 950, .56, 620, UF - 420, 3), mp = fig(U, "mp", 666, 976, .52, 520, UF - 420, 3);
  show(md, [[0, M[2]], [M[4], REV], [TOM, DUR]]); show(mj, [[M[2], M[4]]]); show(mp, [[REV, TOM]]);
  const mshake = []; for (let t = 0; t < DUR; t += .06) mshake.push([t, noisy(t) ? (Math.round(t * 16) % 2 ? 3 : -3) : 0]); E.K(md, "x", mshake); E.K(mj, "y", mshake);
  E.K(md, "r", [[0, 0], [.5, -3, "io"], [1, 0, "io"]]);
  // the tools of the montage
  const ham = E.el(U, "abs", "left:520px;top:300px;width:110px;height:147px;z-index:4;transform-origin:80% 90%;opacity:0"); E.img(ham, "ham", "width:110px;height:147px");
  show(ham, [[M[0], M[1]]]); const hk = []; for (let t = M[0]; t < M[1]; t += .16) hk.push([t, -30, "out"], [t + .08, 20, "in"]); E.K(ham, "r", hk);
  const saw = E.el(U, "abs", "left:480px;top:360px;width:170px;height:155px;z-index:4;opacity:0"); E.img(saw, "saw", "width:170px;height:155px"); show(saw, [[M[1], M[2]]]);
  const sparks = [...Array(8)].map((_, i) => E.el(U, "abs", `left:560px;top:470px;width:10px;height:10px;border-radius:50%;background:#ffb52e;z-index:5;opacity:0`));
  E.F(t => sparks.forEach((s, i) => { const on = t >= M[1] && t < M[2], u = ((t * 2.5 + i * .13) % 1); s.style.opacity = on ? 1 - u : 0; s.style.transform = `translate(${-u * 160 - i * 8}px,${-u * 90 + u * u * 260}px)`; }));
  const mix = E.el(U, "abs", "left:300px;top:420px;width:210px;height:226px;z-index:4;opacity:0"); E.img(mix, "mix", "width:210px;height:226px"); show(mix, [[M[3], REV]]);
  E.K(mix, "r", [[M[3], 0], [M[3] + .1, 3], [M[3] + .2, -3], [M[3] + .3, 3], [M[3] + .4, -3], [M[3] + .5, 0]]);
  // the masterpiece: a tiny shelf, one rooster, a spotlight
  const spot = E.el(U, "abs", "left:230px;top:0;width:400px;height:640px;background:linear-gradient(180deg,rgba(255,240,170,.75),rgba(255,240,170,0));clip-path:polygon(40% 0,60% 0,100% 100%,0 100%);opacity:0;z-index:1");
  show(spot, [[REV, FALL + .2]]);
  const sh = E.el(U, "abs", "left:330px;top:380px;width:1px;height:1px;z-index:2;transform-origin:0 0");
  E.img(sh, "shelf", "position:absolute;left:0;top:0;width:200px;height:89px");
  const galo = E.el(U, "abs", "left:365px;top:176px;width:130px;height:214px;z-index:2"); E.img(galo, "galo", "width:130px;height:214px");
  show(sh, [[REV, DUR]]); show(galo, [[REV, FALL + .5]]);
  E.K(sh, "r", [[FALL, 0], [FALL + .3, 24, "in"]]);
  E.K(galo, "x", [[FALL + .1, 0], [FALL + .45, 70, "in"]]); E.K(galo, "y", [[FALL + .1, 0], [FALL + .5, 350, "in"]]); E.K(galo, "r", [[FALL + .1, 0], [FALL + .5, 80, "in"]]);
  const shards = [...Array(7)].map((_, i) => E.el(U, "abs", `left:470px;top:${UF - 420 - 30}px;width:${22 + (i % 3) * 10}px;height:${16 + (i % 2) * 10}px;background:${["#1d1d1d", "#e5484d", "#f2c230"][i % 3]};border-radius:4px;z-index:4;opacity:0`));
  shards.forEach((s, i) => { show(s, [[FALL + .5, DUR]]); E.K(s, "x", [[FALL + .5, 0], [FALL + .85, (i - 3) * 70, "out"]]); E.K(s, "y", [[FALL + .5, 0], [FALL + .7, -50 - (i % 3) * 20, "out"], [FALL + .85, 0, "in"]]); E.K(s, "r", [[FALL + .5, 0], [FALL + .85, i * 70]]); });
  const wife = fig(U, "wife", 546, 1031, .5, 820, UF - 420, 3); show(wife, [[REV, DUR]]);
  E.K(wife, "x", [[REV, 300], [REV + .3, 0, "out"]]);
  // Otto at the door upstairs: in his robe at 08:00, bearded two years later
  const orb = fig(U, "orb", 457, 1069, .52, 60, UF - 420, 3); show(orb, [[DOOR, M[0]]]);
  const oan2 = fig(U, "oan", 625, 1078, .5, 30, UF - 420, 3); show(oan2, [[REV, DUR]]);
  E.K(oan2, "r", [[AGAIN, 0], [AGAIN + .4, -85, "in"]]);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "SUNDAY · 08:00"], [M[0], "SUNDAY · 12:00"], [M[1], "MONDAY"], [M[2], "WEEK 3"], [M[3], "MONTH 7"], [M[4], "YEAR 2"], [REV, "THE MASTERPIECE"], [TOM, "TOMORROW · 08:00"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= M[0] && t < REV || t >= TOM ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.22);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble("…It's Sunday. It's eight a.m.", 200, 1235, 540, 40, SUN, DOOR - .05, 48);
  bubble(`Just one little hole, vizinho!${sub("(neighbour!)")}`, 300, 450, 620, 440, HOLE, M[0] - .05, 46);
  bubble(`Ó Manel, ficou tão lindo!${sub("(Oh Manel, it's so beautiful!)")}`, 420, 450, 620, 480, LINDO, STR - .05, 46);
  bubble("Two years. Is it straight?", 300, 470, 560, 370, STR, FALL + .2, 48);
  bubble("Okay. Tomorrow. Eight o'clock.", 300, 470, 620, 420, TOM, DUR - .4, 48);
  const sb = E.el(S.el, "abs", "left:60px;top:1450px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "SEE YOU AT 8.", TOM + 1.2, { size: 120, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/snore.wav", { vol: .7, to: DRILL });
  E.clip(DRILL, "sfx/power-drill.wav", { vol: 1.1, duck: false });
  E.clip(SUN, "voices/ep78/o_sunday.wav", { vol: 1.25 });
  E.clip(DOOR - .1, "sfx/door-open.wav", { vol: .8 }); E.clip(HOLE, "voices/ep78/m_hole.wav", { vol: 1.3 });
  E.clip(M[0], "sfx/hammering.wav", { vol: 1.0, to: .8, duck: false }); E.clip(M[1], "sfx/circular-saw.wav", { vol: .9, to: .8, duck: false });
  E.clip(M[2], "sfx/jackhammer.wav", { vol: .9, to: .8, duck: false }); E.clip(M[3], "sfx/cement-mixer.wav", { vol: 1.2, to: .8, duck: false });
  E.clip(M[4], "sfx/power-drill.wav", { vol: .9, to: .8, duck: false });
  E.S(REV - .05, "scratch", .5); E.clip(REV, "sfx/angel-choir.wav", { vol: .5 });
  E.clip(LINDO, "voices/ep78/w_lindo.wav", { vol: 1.3 });
  E.clip(STR, "voices/ep78/m_straight.wav", { vol: 1.3 });
  E.S(FALL, "creak", .6); E.clip(FALL + .45, "sfx/plate-smash.wav", { vol: 1.1 });
  E.clip(TOM, "voices/ep78/m_tomorrow.wav", { vol: 1.3 });
  E.clip(AGAIN, "sfx/power-drill.wav", { vol: 1.0, duck: false }); E.S(AGAIN + .4, "thud", .8);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Your neighbour's *DIY* project", { size: 52, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[20.0, 1], [20.25, 1.18, "out"], [20.6, 1, "io"]]);
}
