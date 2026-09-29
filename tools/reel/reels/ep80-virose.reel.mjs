// EP.80 "Going to the doctor in Portugal" — every diagnosis is "uma virose" (a virus). Otto: "Doctor, I have a little cough." The
// doctor, not looking up: "Hmm. É uma virose." (It's a virus.) STAMP. Buck, on crutches, arm in a sling: "I fell off a tram!" "Virus.
// Tea and rest." STAMP. A polite man with an arrow through his head: "Doctor… there's an arrow." "Virus. Drink water." STAMP. A skeleton
// rattles in on its waiting-room chair: "Virus. Next!" STAMP. Then the doctor sneezes — and looks up, worried: "…Virose." He stamps
// his own forehead.
export const meta = {
  id: "ep80-virose", date: "2026-12-12",
  images: {
    bg: "characters/scenes/bg_clinic.webp", dw: "characters/cutouts/doctor_write.webp", ds: "characters/cutouts/doctor_sneeze.webp",
    oc: "characters/cutouts/otto-casual_cough.webp", bc: "characters/cutouts/buck_cast.webp", am: "characters/cutouts/arrow_man.webp", sk: "characters/cutouts/skeleton_wait.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 55, seed: 803, prog: [[0, 4, 7], [2, 5, 9], [7, 11, 14], [5, 9, 12]] });
  const DUR = 20.2, P1 = .3, COUGH = .6, V1 = 2.35, S1 = 4.0, P2 = 4.6, TRAM = 5.0, V2 = 6.75, S2 = 8.5, P3 = 9.05, ARR = 9.4, V3 = 11.35,
    S3 = 12.8, P4 = 13.3, V4 = 14.1, S4 = 15.3, SNZ = 15.9, V5 = 16.8, S5 = 17.8;
  const S = E.scene("virose", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  // the doctor at his desk (right)
  const DS = .7, dw = fig("dw", 978, 838, DS, 395, 1915, 5), ds = fig("ds", 979, 829, DS, 395, 1909, 5);
  show(dw, [[0, SNZ], [SNZ + .7, DUR]]); show(ds, [[SNZ, SNZ + .7]]);
  const wr = []; for (let t = 0; t < SNZ; t += .5) wr.push([t, 0, "io"], [t + .25, -3, "io"]); E.K(dw, "r", wr);             // frame-0 motion: writing
  // patients walk in from the door (left) and out again
  const pat = (n, w, h, s, tin, tout, bottom = 1890, left = 30) => {
    const p = fig(n, w, h, s, left, bottom, 4); show(p, [[tin, tout + .45]]);
    E.K(p, "x", [[tin, -520], [tin + .35, 0, "out"], [tout, 0], [tout + .45, -620, "in"]]);
    const wob = []; for (let t = tin; t < tin + .4; t += .1) wob.push([t, (Math.round(t * 10) % 2) ? 4 : -4]); wob.push([tin + .45, 0]); E.K(p, "r", wob);
    return p;
  };
  const otto = pat("oc", 388, 974, .95, P1 - .2, P2 - .4);
  const buck = pat("bc", 413, 994, .93, P2, P3 - .4);
  const arrow = pat("am", 390, 984, .95, P3, P4 - .4);
  const skel = pat("sk", 429, 978, .9, P4, SNZ - .2);
  // the VIRUS rubber stamp, slammed on each patient's chest, then on the doctor's own forehead
  const stampMark = (P, x, y, t, size = 1) => {
    const m = E.el(P, "abs", `left:${x}px;top:${y}px;padding:6px 18px;border:7px solid #d6333a;border-radius:10px;color:#d6333a;font-weight:900;font-size:${54 * size}px;letter-spacing:.08em;transform:rotate(-12deg);opacity:0;background:rgba(255,255,255,.35)`, "VIRUS");
    E.K(m, "o", [[t - .01, 0], [t, 1]]); E.K(m, "s", [[t, 1.8], [t + .12, 1, "in"]]);
    return m;
  };
  stampMark(otto, 30, 420, S1); stampMark(buck, 40, 420, S2); stampMark(arrow, 30, 430, S3); stampMark(skel, 60, 360, S4);
  stampMark(dw, 262, 44, S5, .9);
  // each stamp lands with a white flash
  const flash = E.el(S.el, "abs", "inset:0;background:#fff;z-index:9;opacity:0");
  [S1, S2, S3, S4, S5].forEach(t => E.K(flash, "o", [[t - .01, 0], [t, .45], [t + .15, 0]]));
  // the sneeze cloud
  const cloud = E.el(S.el, "abs", "left:500px;top:1300px;width:380px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(200,235,255,.95),rgba(200,235,255,0) 70%);z-index:7;opacity:0");
  E.K(cloud, "o", [[SNZ, 0], [SNZ + .1, 1], [SNZ + .9, 0]]); E.K(cloud, "s", [[SNZ, .4], [SNZ + .5, 1.6, "out"]]);
  const sweat = E.el(S.el, "abs", "left:900px;top:1350px;font-size:56px;z-index:9;opacity:0", "💧"); show(sweat, [[V5, DUR]]);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "DIAGNOSES TODAY: 0"], [S1, "“A VIRUS” ×1"], [S2, "“A VIRUS” ×2"], [S3, "“A VIRUS” ×3"], [S4, "“A VIRUS” ×4"], [S5, "THE DOCTOR: A VIRUS"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= S1 ? C.coralD : C.ink; });
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
  bubble("Doctor, I have a little cough.", 40, 790, 480, 160, COUGH, V1 - .05, 46);
  bubble(`Hmm. É uma virose.${sub("(It's a virus.)")}`, 560, 1130, 480, 260, V1, P2, 48);
  bubble("I fell off a tram!", 40, 790, 440, 160, TRAM, V2 - .05, 50);
  bubble("Virus. Tea and rest.", 560, 1150, 480, 300, V2, P3, 48);
  bubble("Doctor… there's an arrow.", 40, 790, 480, 170, ARR, V3 - .05, 46);
  bubble("Virus. Drink water.", 560, 1150, 460, 300, V3, P4, 48);
  bubble("Virus. Next!", 580, 1150, 380, 250, V4, SNZ - .1, 54);
  bubble("…Virose.", 600, 1150, 320, 240, V5, DUR - .4, 58);
  const sb = E.el(S.el, "abs", "left:60px;top:520px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "IT'S ALWAYS A VIRUS.", S5 + .9, { size: 92, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/waiting-room.wav", { vol: .6, duck: false, to: DUR });
  E.clip(P1, "sfx/cough.wav", { vol: .9 }); E.clip(COUGH, "voices/ep80/o_cough.wav", { vol: 1.2 });
  E.clip(V1, "voices/ep80/d_virose.wav", { vol: 1.3 });
  [S1, S2, S3, S4, S5].forEach(t => E.S(t, "slam", .9));
  E.S(P2, "whoosh", .4); E.clip(TRAM, "voices/ep80/b_tram.wav", { vol: 1.2 });
  E.clip(V2, "voices/ep80/d_tea.wav", { vol: 1.3 });
  E.S(P3, "whoosh", .4); E.clip(ARR, "voices/ep80/a_arrow.wav", { vol: 1.25 });
  E.clip(V3, "voices/ep80/d_water.wav", { vol: 1.3 });
  E.clip(P4, "sfx/bones-rattle.wav", { vol: 1.1 }); E.clip(P4 + .4, "sfx/bones-rattle.wav", { vol: .9 });
  E.clip(V4, "voices/ep80/d_next.wav", { vol: 1.3 });
  E.clip(SNZ - .1, "sfx/big-sneeze.wav", { vol: 1.1 });
  E.clip(V5, "voices/ep80/d_virose2.wav", { vol: 1.35 }); E.S(S5 + .1, "scratch", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Going to the doctor in *Portugal*", { size: 46, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[19.4, 1], [19.65, 1.18, "out"], [20.0, 1, "io"]]);
}
