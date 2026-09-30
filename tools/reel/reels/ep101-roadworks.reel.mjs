// EP.101 "Roadworks in Portugal" — a lone roadworker starts digging a hole: "Today, I finish this little hole, no problem." One by one old men
// arrive, hands behind their backs, and supervise: "Deeper." "No. Wider." "In nineteen seventy-four, we did this in ten minutes." "It is going to
// rain." "That pipe… is not supposed to be there." and a last one who only stares. SUPERVISORS: 6. The worker, begging: "Do you want to help?"
// Every old man: "No." "Why are you here?" "Supervising." Then the worker's hard hat flies off. He puts on a flat cap, clasps his hands behind
// his back and leans over the hole: "…Deeper." SUPERVISORS: 7.
export const meta = {
  id: "ep101-roadworks", date: "2027-01-02",
  images: {
    bg: "characters/scenes/bg_street.webp", wd: "characters/cutouts/worker_dig.webp", wn: "characters/cutouts/worker_nervous.webp", wp: "characters/cutouts/worker_plead.webp",
    ws: "characters/cutouts/worker_super.webp", m1: "characters/cutouts/oldman_watch_cap.webp", m2: "characters/cutouts/oldman_watch_glasses.webp", m3: "characters/cutouts/oldman_watch_beret.webp",
    m4: "characters/cutouts/oldman_watch_straw.webp", m5: "characters/cutouts/oldman_watch_tie.webp", m6: "characters/cutouts/oldman_watch_bucket.webp",
    cone: "characters/props/roadwork-cone.webp", cone2: "characters/props/roadwork-cone-tipped.webp", bar: "characters/props/roadwork-barrier.webp",
    dirt: "characters/props/roadwork-dirt.webp", sign: "characters/props/roadwork-sign.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 52, seed: 1011, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 24.2, W0 = .3, A = [4.0, 5.0, 7.2, 10.1, 11.5, 14.3], HELP = 15.4, NO = 16.6, WHY = 17.4, SUPV = 18.9, CONV = 20.3, DEEP = 20.7, STAMP = 22.1;
  const S = E.scene("roadworks", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3, flip = false) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px${flip ? ";transform:scaleX(-1)" : ""}`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  // ---- the road works: barrier, sign, cones, the hole and its pile of dirt
  fig("bar", 299, 238, .9, -20, 1690, 2); fig("sign", 254, 282, .7, 905, 1690, 2);
  const hole = E.el(S.el, "abs", "left:290px;top:1760px;width:540px;height:130px;z-index:3;transform-origin:50% 50%");
  E.el(hole, "abs", "inset:0;border-radius:50%;background:#9a7447;box-shadow:0 6px 0 rgba(0,0,0,.18)");
  E.el(hole, "abs", "left:26px;top:12px;right:26px;bottom:12px;border-radius:50%;background:radial-gradient(ellipse at 50% 30%,#3a2616 0,#1e120a 100%)");
  E.K(hole, "sy", [[0, .4], [4.0, 1, "lin"], [4.9, 1.15, "out"], [DUR, 1.15]]); E.K(hole, "sx", [[0, .7], [4.0, 1, "lin"], [4.9, 1.06, "out"], [DUR, 1.06]]);
  const dirt = fig("dirt", 301, 172, .8, 830, 1880, 6); E.K(dirt, "s", [[0, .5], [4.0, 1, "lin"], [4.9, 1.12, "out"], [DUR, 1.12]]);
  fig("cone", 205, 256, .6, 760, 1905, 6); fig("cone2", 239, 201, .55, 40, 1915, 6);
  // flying dirt while he digs
  for (let i = 0; i < 6; i++) {
    const t0 = .7 + i * .68, d = E.el(S.el, "abs", "left:450px;top:1745px;width:34px;height:26px;border-radius:50%;background:#6b4a2b;z-index:7;opacity:0");
    E.K(d, "o", [[t0 - .01, 0], [t0, 1], [t0 + .55, 1], [t0 + .56, 0]]); E.K(d, "x", [[t0, 0], [t0 + .55, 330, "lin"]]); E.K(d, "y", [[t0, 0], [t0 + .28, -150, "out"], [t0 + .55, 40, "in"]]);
  }

  // ---- the worker (left): digging → nervous → begging → supervising
  const WB = 1840, WS = .8;
  const w1 = fig("wd", 634, 990, WS, 10, WB, 5), w2 = fig("wn", 477, 987, WS, 50, WB, 5), w3 = fig("wp", 368, 990, WS, 95, WB, 5), w4 = fig("ws", 391, 956, WS, 85, WB, 5);
  show(w1, [[0, A[1]]]); show(w2, [[A[1], HELP]]); show(w3, [[HELP, CONV]]); show(w4, [[CONV, DUR]]);
  const sw = []; for (let t = 0; t < A[1]; t += .34) sw.push([t, (Math.round(t / .34) % 2) ? 3 : -2, "io"]); E.K(w1, "r", sw);                   // frame-0 motion: digging
  const tr = []; for (let t = A[1]; t < HELP; t += .12) tr.push([t, (Math.round(t * 8) % 2) ? 1.5 : -1.5]); E.K(w2, "x", tr);
  const tr2 = []; for (let t = HELP; t < CONV; t += .1) tr2.push([t, (Math.round(t * 10) % 2) ? 2 : -2]); E.K(w3, "x", tr2);
  E.pop(w4, CONV, { from: .7, dur: .3 });
  const hat = E.el(S.el, "abs", "left:150px;top:1070px;width:110px;height:56px;border-radius:70px 70px 8px 8px;background:#ffc928;border-bottom:10px solid #e0a800;box-sizing:border-box;z-index:8;opacity:0");
  E.K(hat, "o", [[CONV - .01, 0], [CONV, 1], [CONV + .9, 1], [CONV + 1.0, 0]]); E.K(hat, "x", [[CONV, 0], [CONV + .9, -300, "out"]]); E.K(hat, "y", [[CONV, 0], [CONV + .45, -420, "out"], [CONV + .9, 100, "in"]]); E.K(hat, "r", [[CONV, 0], [CONV + .9, 720, "lin"]]);
  const puff = E.el(S.el, "abs", "left:30px;top:1180px;width:420px;height:420px;border-radius:50%;background:radial-gradient(#fff 0,rgba(255,255,255,.75) 40%,transparent 70%);z-index:9;opacity:0");
  E.K(puff, "o", [[CONV - .05, 0], [CONV, .9], [CONV + .35, 0]]); E.K(puff, "s", [[CONV - .05, .5], [CONV + .35, 1.3, "out"]]);

  // ---- the supervisors (mirrored so they look down into the hole)
  const SL = [["m1", 446, 965, .4, 520, 1625, 4], ["m2", 475, 951, .4, 690, 1625, 4], ["m3", 444, 965, .4, 850, 1625, 4], ["m4", 559, 969, .4, 975, 1625, 4], ["m5", 440, 961, .36, 605, 1548, 3], ["m6", 478, 992, .36, 775, 1548, 3]];
  const men = SL.map(([n, w, h, s, cx, b, z], i) => {
    const el = fig(n, w, h, s, cx - w * s / 2, b, z, true); const t = A[i];
    show(el, [[t - .3, DUR]]); E.K(el, "x", [[t - .3, 520], [t + .15, 0, "out"]]);
    const bob = []; for (let k = t + .4; k < DUR; k += .7) bob.push([k, 0, "io"], [k + .35, -3, "io"]); E.K(el, "y", bob); return el;
  });
  // ---- pill: supervisors counter
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  E.F(t => { const n = A.filter(a => t >= a - .3).length + (t >= CONV ? 1 : 0); const s = `SUPERVISORS: ${n}`; if (pill.textContent !== s) pill.textContent = s; pill.style.background = n ? C.coralD : C.ink; });
  [...A.map(a => a - .3), CONV].forEach(t => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const cx = [520, 690, 850, 975, 605, 775];
  const M = (i, h, t0, t1, fs = 44, w = 360) => { const l = Math.max(10, Math.min(1070 - w, cx[i] - w / 2)); return bubble(h, l, 1000, w, cx[i] - l - 22, t0, t1, fs); };
  bubble("Good morning! Today, I finish this little hole, no problem.", 20, 820, 560, 140, W0, A[0] - .35, 42);
  M(0, "Deeper.", A[0], A[1] - .1, 54, 250);
  M(1, "No. Wider.", A[1], A[2] - .1, 50, 320);
  M(2, "In 1974, we did this in ten minutes.", A[2], A[3] - .1, 40, 520);
  M(3, "It is going to rain.", A[3], A[4] - .1, 44, 400);
  M(4, "That pipe… is not supposed to be there.", A[4], A[5] - .1, 40, 560);
  M(5, "Hmmmm.", A[5], HELP - .1, 54, 300);
  bubble("Do you want to help?", 20, 820, 480, 140, HELP, NO - .05, 46);
  [[0], [1], [2], [3], [4], [5]].forEach(([i], k) => { const w = 130, l = Math.max(10, Math.min(1070 - w, cx[i] - w / 2)); bubble("No.", l, 1000 - (i > 3 ? 60 : 0) - (k % 2) * 0, w, w / 2 - 22, NO + k * .05, WHY - .15, 40); });
  bubble("Why are you here?", 20, 820, 440, 140, WHY, SUPV - .05, 46);
  M(0, "Supervising.", SUPV, CONV - .1, 46, 400);
  bubble("…Deeper.", 40, 820, 320, 120, DEEP, DUR - .3, 54);
  const sb = E.el(S.el, "abs", "left:60px;top:640px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "SUPERVISORS: 7.", STAMP, { size: 110, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/street-sunny.wav", { vol: .3, duck: false, to: DUR });
  E.clip(.45, "sfx/elx-shovel-dig.wav", { vol: .8, to: 3 }); E.clip(3.4, "sfx/elx-shovel-dig.wav", { vol: .6, to: 1.6 });
  E.clip(W0, "voices/ep101/w_morning.wav", { vol: 1.25 });
  const VA = ["s1_deeper", "s2_wider", "s3_1974", "s4_rain", "s5_pipe", "s6_hm"];
  VA.forEach((v, i) => { E.S(A[i] - .3, "whoosh", .25); E.clip(A[i], `voices/ep101/${v}.wav`, { vol: 1.3 }); });
  E.clip(A[5], "sfx/elx-crickets.wav", { vol: 1.3, duck: false, to: HELP - A[5] });
  E.clip(HELP, "voices/ep101/w_help.wav", { vol: 1.3 });
  ["s1_no", "s2_no", "s3_no", "s4_no", "s5_no", "s6_no"].forEach((v, k) => E.clip(NO + k * .05, `voices/ep101/${v}.wav`, { vol: 1.1 }));
  E.clip(WHY, "voices/ep101/w_why.wav", { vol: 1.3 });
  E.clip(SUPV, "voices/ep101/s1_super.wav", { vol: 1.35 });
  E.S(CONV, "poof", .55); E.S(CONV + .05, "whoosh", .4);
  E.clip(DEEP, "voices/ep101/w_deeper.wav", { vol: 1.3 });
  E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Roadworks in *Portugal*", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[23.4, 1], [23.65, 1.18, "out"], [24.0, 1, "io"]]);
}
