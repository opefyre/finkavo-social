// EP.68 "The pastel de nata heist" — a movie-trailer parody. Narrator: "Lisbon. Ten a.m. The target… one pastel de nata." A red
// reticle locks onto Buck's nata. The crew, in title cards: THE BRAINS, THE MUSCLE, THE DISTRACTION, THE LOOKOUT. The job: a
// top-hat pigeon dances at Buck's feet ("Oh, hello little fella!"), the Muscle dives in — "Two seconds. Clean." Buck: "…Where's my
// nata?" The crew on a rooftop in sunglasses. Buck buys another… and forty pigeons turn to look. "Coming soon… Nata Heist Two."
export const meta = {
  id: "ep68-heist", date: "2026-11-30",
  images: {
    fork: "characters/cutouts/buck-chair_fork.webp", aww: "characters/cutouts/buck-chair_aww.webp", shock: "characters/cutouts/buck-chair_shock.webp",
    nata: "characters/props/pastry-nata.webp", pn: "characters/props/pigeon-nata.webp", pig: "characters/props/pigeon.webp",
    brains: "characters/props/pigeon_brains.webp", muscle: "characters/props/pigeon_muscle.webp", dis: "characters/props/pigeon_distraction.webp", look: "characters/props/pigeon_lookout.webp",
    roof: "characters/props/pigeons_roof.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 96, root: 50, seed: 681, prog: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]] });
  const DUR = 19.6, TABLE = 1400, TGT = .3, CREW = 5.0, JOB = 9.95, DIVE = 11.4, WHERE = 13.9, ROOF = 15.3, SEQ = 16.3;
  const S = E.scene("heist", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };
  const terrace = P => {
    E.el(P, "abs", "inset:0;background:#f6d98b");
    for (const x of [60, 420, 780]) { E.el(P, "abs", `left:${x}px;top:440px;width:220px;height:330px;background:#3d5a73;border:12px solid #fff;border-radius:110px 110px 6px 6px`); E.el(P, "abs", `left:${x - 20}px;top:770px;width:260px;height:18px;background:#fff;border-radius:4px`); }
    const aw = E.el(P, "abs", "left:-20px;top:840px;width:1120px;height:120px;background:repeating-linear-gradient(90deg,#c0392b 0 70px,#f4f4f4 70px 140px);border-radius:0 0 26px 26px;box-shadow:0 10px 16px rgba(0,0,0,.15)");
    E.el(P, "abs", `left:0;top:1600px;width:1080px;height:320px;background:repeating-linear-gradient(135deg,#ece6d8 0 30px,#d9d0bd 30px 60px)`);
  };
  const table = (P, withNata) => {
    E.el(P, "abs", `left:600px;top:${TABLE}px;width:380px;height:30px;border-radius:15px;background:#f4f4f4;border:5px solid #c8c8c8;z-index:3`);
    E.el(P, "abs", `left:780px;top:${TABLE + 30}px;width:20px;height:250px;background:#8a8a8a;z-index:3`);
    E.el(P, "abs", `left:640px;top:${TABLE - 26}px;width:200px;height:34px;border-radius:50%;background:#fff;border:5px solid #e3dccc;z-index:3`);
    E.el(P, "abs", `left:870px;top:${TABLE - 70}px;width:60px;height:70px;border-radius:0 0 14px 14px;background:#fff;border:5px solid #6b3f1d;z-index:3`);
    if (!withNata) return null;
    const n = E.el(P, "abs", `left:${740 - 252 * .55 / 2}px;top:${TABLE - 10 - 185 * .55}px;width:${252 * .55}px;height:${185 * .55}px;z-index:4`); E.img(n, "nata", `width:${252 * .55}px;height:${185 * .55}px`); return n;
  };
  const buck = (P, n, img) => { const el = E.el(P, "abs", `left:130px;top:${1660 - 1014 * .95}px;width:${536 * .95}px;height:${1014 * .95}px;z-index:2`); E.img(el, n, `width:${536 * .95}px;height:${1014 * .95}px`); return el; };

  // ================= 1) the target =================
  const A = layer(0, CREW); terrace(A); buck(A, "fork"); const n1 = table(A, true);
  const ret = E.el(A, "abs", `left:${740 - 130}px;top:${TABLE - 180}px;width:260px;height:260px;border:8px solid #e5484d;border-radius:50%;z-index:6;opacity:0`);
  E.el(ret, "abs", "left:122px;top:-40px;width:8px;height:340px;background:#e5484d"); E.el(ret, "abs", "left:-40px;top:122px;width:340px;height:8px;background:#e5484d");
  E.K(ret, "o", [[3.2, 0], [3.3, 1]]); E.K(ret, "s", [[3.2, 2.2], [3.7, 1, "out"]]); E.K(ret, "r", [[3.2, -90], [3.7, 0, "out"]]);
  const tl = E.el(A, "abs", `left:620px;top:${TABLE + 110}px;background:#e5484d;color:#fff;font-weight:900;font-size:40px;padding:4px 16px;border-radius:8px;z-index:6;opacity:0`, "TARGET ACQUIRED");
  E.K(tl, "o", [[3.8, 0], [3.9, 1]]);
  const sw = []; for (let t = 0; t < CREW; t += .9) sw.push([t, 0, "io"], [t + .45, -4, "io"]);
  E.K(n1, "y", sw);                                                                                                     // frame-0 motion

  // ================= 2) the crew =================
  const CR = [["brains", 197, 320, "THE BRAINS", "plans · coffee · no mercy"], ["muscle", 316, 420, "THE MUSCLE", "dives at 60 km/h"], ["dis", 227, 361, "THE DISTRACTION", "too cute to suspect"], ["look", 149, 351, "THE LOOKOUT", "sees everything"]];
  CR.forEach(([n, w, h, name, tag], i) => {
    const t0 = CREW + i * 1.24, L = layer(t0, t0 + 1.24);
    E.el(L, "abs", "inset:0;background:radial-gradient(circle at 50% 55%,#2c3440,#0b0f14)");
    E.el(L, "abs", "left:0;top:1180px;width:1080px;height:14px;background:rgba(255,255,255,.08)");
    const s = 1.9, p = E.el(L, "abs", `left:${540 - w * s / 2}px;top:${1500 - h * s}px;width:${w * s}px;height:${h * s}px`); E.img(p, n, `width:${w * s}px;height:${h * s}px`);
    E.K(p, "s", [[t0, 1.15], [t0 + 1.2, 1]]);
    const nm = E.el(L, "abs", "left:0;top:1560px;width:1080px;text-align:center;color:#fff;font-weight:900;font-size:92px;letter-spacing:.08em", name);
    E.el(L, "abs", "left:0;top:1670px;width:1080px;text-align:center;color:#f2c230;font-weight:800;font-size:40px;letter-spacing:.04em", tag);
    E.K(nm, "x", [[t0, -60], [t0 + 1.2, 20]]);
    E.flash(t0, "#ffffff", .5, .15);
  });

  // ================= 3) the job =================
  const B = layer(JOB, ROOF); terrace(B);
  const bj = E.el(B, "abs", `left:130px;top:${1660 - 1014 * .95}px;width:${536 * .95}px;height:${1014 * .95}px;z-index:2`);
  const bA = E.img(bj, "aww", `position:absolute;left:0;top:${(1014 - 962) * .95}px;width:${614 * .95}px;height:${962 * .95}px`);
  const bS = E.img(bj, "shock", `position:absolute;left:0;top:0;width:${536 * .95}px;height:${1014 * .95}px;opacity:0`);
  E.F(t => { const s = t >= WHERE; bA.style.opacity = s ? 0 : 1; bS.style.opacity = s ? 1 : 0; });
  const n2 = table(B, true);
  E.K(n2, "o", [[DIVE + .4, 1], [DIVE + .41, 0]]);
  const dis = E.el(B, "abs", `left:430px;top:${1760 - 361 * 1.05}px;width:${227 * 1.05}px;height:${361 * 1.05}px;z-index:5`); E.img(dis, "dis", `width:${227 * 1.05}px;height:${361 * 1.05}px`);
  E.K(dis, "x", [[JOB, -400], [JOB + .5, 0, "out"], [WHERE, 0], [WHERE + .4, -500, "in"]]);
  const dance = []; for (let t = JOB + .5; t < WHERE; t += .3) dance.push([t, -8, "io"], [t + .15, 8, "io"]); E.K(dis, "r", dance);
  const hearts = [0, 1, 2].map(i => E.el(B, "abs", `left:${440 + i * 40}px;top:1420px;font-size:48px;color:#e0457b;z-index:6;opacity:0`, "♥"));
  E.F(t => hearts.forEach((h, i) => { const u = ((t * 1.2 + i * .3) % 1); h.style.opacity = t > JOB + .6 && t < DIVE + .4 ? 1 - u : 0; h.style.transform = `translate(${Math.sin(u * 6 + i) * 20}px,${-u * 140}px)`; }));
  const mus = E.el(B, "abs", `left:0;top:0;width:${316 * .6}px;height:${420 * .6}px;z-index:7;opacity:0`); E.img(mus, "muscle", `width:${316 * .6}px;height:${420 * .6}px`);
  E.F(t => { const u = (t - DIVE) / .4; if (u < 0 || t > DIVE + .45) { mus.style.opacity = 0; return; } mus.style.opacity = 1; mus.style.transform = `translate(${1100 - u * 460}px,${-200 + u * (TABLE - 240 + 200)}px) rotate(${-40 + u * 20}deg)`; });
  const pn = E.el(B, "abs", `left:0;top:0;width:${287 * .7}px;height:${239 * .7}px;z-index:7;opacity:0`); E.img(pn, "pn", `width:${287 * .7}px;height:${239 * .7}px`);
  E.F(t => { const u = (t - DIVE - .4) / 1.0; if (u < 0 || u > 1) { pn.style.opacity = 0; return; } pn.style.opacity = 1; pn.style.transform = `translate(${640 + u * 520}px,${TABLE - 200 - u * 900}px) rotate(${-10 - u * 20}deg)`; });
  const feathers = [0, 1, 2, 3].map(i => E.el(B, "abs", `left:${700 + i * 30}px;top:${TABLE - 60}px;width:34px;height:14px;border-radius:50%;background:#aab3bb;z-index:6;opacity:0`));
  E.F(t => feathers.forEach((f, i) => { const u = (t - DIVE - .4) / 2.2; f.style.opacity = u > 0 && u < 1 ? 1 - u : 0; f.style.transform = `translate(${Math.sin(u * 8 + i) * 50}px,${u * 240}px) rotate(${u * 300}deg)`; }));
  const timer = E.el(B, "abs", "left:700px;top:1100px;background:#0b0f14;color:#7cff9e;font-family:monospace;font-weight:900;font-size:50px;padding:6px 18px;border-radius:10px;z-index:8;opacity:0;white-space:nowrap", "");
  E.F(t => { const u = Math.max(0, Math.min(2, (t - DIVE) * 2.4)), txt = `TIME: ${u.toFixed(2)} s`; if (timer.textContent !== txt) timer.textContent = txt; timer.style.opacity = t > DIVE && t < WHERE ? 1 : 0; });

  // ================= 4) the rooftop, then the sequel =================
  const R = layer(ROOF, SEQ);
  E.el(R, "abs", "inset:0;background:linear-gradient(180deg,#f19a5a,#ffcf8a)");
  E.el(R, "abs", "left:760px;top:520px;width:170px;height:170px;border-radius:50%;background:#ffd23f;box-shadow:0 0 70px 36px rgba(255,210,63,.5)");
  const rf = E.el(R, "abs", `left:${540 - 1168 * .46}px;top:${1500 - 689 * .92}px;width:${1168 * .92}px;height:${689 * .92}px`); E.img(rf, "roof", `width:${1168 * .92}px;height:${689 * .92}px`);
  E.K(rf, "s", [[ROOF, 1.08], [SEQ, 1]]);
  E.el(R, "abs", "left:0;top:1480px;width:1080px;height:440px;background:#c0643f");
  const Q = layer(SEQ, DUR); terrace(Q); buck(Q, "fork"); table(Q, true);
  const rail = E.el(Q, "abs", "left:660px;top:776px;width:420px;height:14px;background:#3b3b3b;z-index:3");
  for (let i = 0; i < 6; i++) { const pp = E.el(Q, "abs", `left:${650 + i * 70}px;top:${776 - 238 * .42 + 10}px;width:${244 * .42}px;height:${238 * .42}px;z-index:3;opacity:0;transform:scaleX(${i % 2 ? -1 : 1})`); E.img(pp, "pig", `width:${244 * .42}px;height:${238 * .42}px`); E.K(pp, "o", [[SEQ + .6 + i * .05, 0], [SEQ + .65 + i * .05, 1]]); }
  for (let i = 0; i < 9; i++) { const pp = E.el(Q, "abs", `left:${60 + i * 110}px;top:${1600 - 238 * .5}px;width:${244 * .5}px;height:${238 * .5}px;z-index:4;opacity:0;transform:scaleX(${i % 2 ? 1 : -1})`); E.img(pp, "pig", `width:${244 * .5}px;height:${238 * .5}px`); E.K(pp, "o", [[SEQ + 1.1 + i * .05, 0], [SEQ + 1.15 + i * .05, 1]]); }

  // ================= cinematic frame + HUD =================
  const bars = [0, 1].map(i => E.el(S.el, "abs", `left:0;${i ? "bottom" : "top"}:0;width:1080px;height:0;background:#000;z-index:12`));
  E.F(t => bars.forEach(b => { b.style.height = `${t < CREW ? 0 : 150}px`; }));
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:13`, "");
  E.F(t => { const s = t < CREW ? "LISBON · 10:00" : t < JOB ? "THE CREW" : t < ROOF ? "THE JOB" : t < SEQ ? "THE GETAWAY" : "COMING SOON…"; if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= SEQ ? C.coralD : C.ink; });

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 50) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:11;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const cap = (txt, t0, t1) => { const c = E.el(S.el, "abs", "left:60px;top:1660px;width:960px;text-align:center;z-index:13;opacity:0;color:#fff;font-weight:800;font-style:italic;font-size:42px;text-shadow:0 3px 8px rgba(0,0,0,.8)", txt); E.K(c, "o", [[t0, 0], [t0 + .1, 1], [t1 - .1, 1], [t1, 0]]); };
  cap("“Lisbon. Ten a.m. The target… one pastel de nata.”", TGT, CREW - .05);
  bubble("Oh, hello little fella!", 360, 780, 480, 120, JOB + .25, DIVE + .5, 50);
  cap("“Two seconds. Clean.”", DIVE + .6, WHERE - .05);
  bubble("…Where's my nata?", 360, 780, 440, 120, WHERE, ROOF - .05, 52);
  cap("“Coming soon… Nata Heist Two.”", SEQ, DUR - .3);
  const sb = E.el(S.el, "abs", "left:60px;top:470px;width:960px;display:flex;justify-content:center;z-index:14");
  const st = E.stamp(sb, "NEVER LOOK AWAY FROM A NATA.", SEQ + 1.8, { size: 70, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/cafe-morning.wav", { vol: .25, duck: false, to: CREW });
  E.clip(TGT, "voices/ep68/n_target.wav", { vol: 1.2 });
  E.S(3.3, "ding", .5);
  const lines = ["n_brains", "n_muscle", "n_distraction", null];
  lines.forEach((l, i) => { const t = CREW + i * 1.24; E.clip(t, "sfx/heist-sting.wav", { vol: .7 }); if (l) E.clip(t + .15, `voices/ep68/${l}.wav`, { vol: 1.25 }); else E.clip(t + .2, "sfx/coo.wav", { vol: .8 }); });
  E.clip(JOB, "sfx/cafe-morning.wav", { vol: .25, duck: false, to: ROOF - JOB });
  E.clip(JOB + .3, "sfx/coo.wav", { vol: .7 });
  E.clip(JOB + .25, "voices/ep68/b_hello.wav", { vol: 1.15 });
  E.S(DIVE, "whoosh", 1); E.clip(DIVE + .4, "sfx/pigeon-flutter.wav", { vol: .9 });
  E.clip(DIVE + .6, "voices/ep68/n_clean.wav", { vol: 1.25 });
  E.clip(WHERE, "voices/ep68/b_where.wav", { vol: 1.2 });
  E.S(ROOF, "whoosh", .5);
  E.S(SEQ, "scratch", .6); E.clip(SEQ + .6, "sfx/pigeon-flutter.wav", { vol: .6 }); E.clip(SEQ + .3, "voices/ep68/n_sequel.wav", { vol: 1.25 }); E.clip(SEQ + 1.1, "sfx/coo.wav", { vol: .8 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:13");
  E.text(titleBox, "The *pastel de nata* heist", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[18.8, 1], [19.05, 1.18, "out"], [19.4, 1, "io"]]);
}
