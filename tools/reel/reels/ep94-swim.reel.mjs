// EP.94 "Swimming after lunch in Portugal" — the grandma rule: no swimming for three hours after eating. 14:00, lunch done, Otto (35) in
// armbands and a snorkel: "Right! Swimming time!" Grandma, stopwatch up: "Three hours after lunch. Or you get a cramp… and you DIE."
// "Grandma… I'm thirty-five." The stopwatch counts down: 14:30, 15:00… Otto waits at the shoreline and slowly turns lobster red. 17:00,
// BEEP: "Okay! Now you can swim." "Finally!" He runs — "Wait! You must be starving. Eat, eat!" He takes one bite. Click. "Okay. Three hours."
export const meta = {
  id: "ep94-swim", date: "2026-12-26",
  images: {
    bg: "characters/scenes/bg_beach2.webp", dw: "characters/cutouts/dona-kaftan_watch.webp", ds: "characters/cutouts/dona-kaftan_sandwich.webp",
    op: "characters/cutouts/otto-beach_point.webp", os: "characters/cutouts/otto-beach_sit.webp", ob: "characters/cutouts/otto-beach_burnt.webp",
    or: "characters/cutouts/otto-beach_run.webp", oe: "characters/cutouts/otto-beach_bite.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 53, seed: 941, prog: [[0, 4, 7], [5, 9, 12], [2, 5, 9], [7, 11, 14]] });
  const DUR = 23.6, SWIM = .3, THREE = 1.9, AGE = 6.6, M0 = 8.9, STEP = .75, BEEP = 13.4, NOW = 13.6, FIN = 15.55, EAT = 16.2, BITE = 17.6,
    RESET = 19.5, STAMP = 21.9;
  const M = [...Array(6)].map((_, i) => M0 + i * STEP);
  const S = E.scene("swim", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  // the sun crosses the sky and the light goes golden while he waits
  const sun = E.el(S.el, "abs", "left:0;top:0;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,#fff6c8 0 45%,#ffd35a 46% 70%,rgba(255,211,90,0) 71%);z-index:1");
  E.K(sun, "x", [[0, 820], [M0, 820], [BEEP, 450, "io"]]); E.K(sun, "y", [[0, 440], [M0, 440], [BEEP, 610, "io"]]);
  const tint = E.el(S.el, "abs", "inset:0;background:linear-gradient(180deg,rgba(255,110,40,.85),rgba(255,170,90,.35) 60%,rgba(255,190,120,.2));mix-blend-mode:soft-light;z-index:2;opacity:0");
  E.K(tint, "o", [[M0, 0], [BEEP, 1, "io"]]);

  // grandma in her beach chair (left): stopwatch → sandwich (same canvas)
  const GS = .8, gw = E.el(S.el, "abs", "left:-30px;top:0;width:1px;height:1px;z-index:5");
  const G = ["dw", "ds"].map(n => E.img(gw, n, `position:absolute;left:0;top:${1900 - 1168 * GS}px;width:${880 * GS}px;height:${1168 * GS}px`));
  E.F(t => { const k = t >= EAT && t < RESET ? 1 : 0; G.forEach((g, i) => { g.style.opacity = i === k ? 1 : 0; }); });
  const wag = []; for (let t = THREE; t < AGE; t += .3) wag.push([t, 0, "io"], [t + .15, -2, "io"]); E.K(gw, "r", wag);
  E.K(gw, "y", [[0, 0], [.6, -6, "io"], [1.2, 0, "io"], [1.8, -6, "io"], [2.4, 0, "io"]]);                              // frame-0 motion

  // Otto: pointing (foreground) → waiting at the shoreline (small) → burnt → running into the sea → back, eating
  const o1 = fig("op", 656, 947, .82, 520, 1870, 6), o2 = fig("os", 614, 906, .5, 640, 1190, 4), o3 = fig("ob", 575, 965, .47, 650, 1190, 4),
    o4 = fig("or", 660, 940, .5, 620, 1190, 4), o5 = fig("oe", 515, 1000, .8, 600, 1880, 6);
  show(o1, [[0, M0]]); show(o2, [[M0, M[3]]]); show(o3, [[M[3], BEEP + .2]]); show(o4, [[BEEP + .2, BITE]]); show(o5, [[BITE, DUR]]);
  E.K(o1, "y", [[0, 0], [.3, -30, "out"], [.6, 0, "in"]]); E.pop(o2, M0, { from: .6, dur: .3 });
  E.K(o4, "y", [[BEEP + .2, 0], [BEEP + .45, -60, "out"], [BEEP + .7, 0, "in"], [FIN, 0], [EAT, -120, "lin"], [EAT + .3, -120]]);
  E.K(o4, "x", [[BEEP + .2, 0], [FIN, 0], [EAT, 190, "lin"], [EAT + .3, 190], [EAT + .5, 150, "out"]]);
  E.K(o4, "s", [[FIN, 1], [EAT, .8, "lin"]]);
  const shake = []; for (let t = M[3]; t < BEEP; t += .12) shake.push([t, (Math.round(t * 8) % 2) ? 1.5 : -1.5]); E.K(o3, "r", shake);
  E.pop(o5, BITE, { from: .7, dur: .3 });
  // the sandwich bite crumbs
  const crumbs = E.el(S.el, "abs", "left:820px;top:1150px;font-size:44px;z-index:7;opacity:0", "✦ ✦"); show(crumbs, [[BITE + .1, BITE + .8]]);

  // the stopwatch readout
  const sw = E.el(S.el, "abs", `left:100px;top:460px;background:#fff;color:${C.ink};font-weight:900;font-size:64px;padding:8px 26px;border-radius:24px;border:6px solid ${C.ink};z-index:9;opacity:0;font-variant-numeric:tabular-nums;white-space:nowrap`, "");
  E.K(sw, "o", [[THREE + 1.2, 0], [THREE + 1.3, 1]]); E.pop(sw, THREE + 1.2, { from: .5, dur: .3 });
  const fmt = s => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, x = s % 60; return `⏱ ${h}:${String(m).padStart(2, "0")}:${String(x).padStart(2, "0")}`; };
  E.F(t => {
    let left = 3 * 3600;
    if (t >= M0 && t < RESET) left = 3 * 3600 * Math.max(0, 1 - (t - M0) / (BEEP - M0));
    const s = fmt(left); if (sw.textContent !== s) sw.textContent = s;
    sw.style.background = t >= BEEP && t < RESET ? C.mint || "#bdf0d2" : t >= RESET ? "#ffd9d6" : "#fff";
  });
  E.K(sw, "s", [[BEEP - .01, 1], [BEEP, 1.25], [BEEP + .25, 1, "out"], [RESET - .01, 1], [RESET, 1.3], [RESET + .25, 1, "out"]]);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "14:00 · LUNCH: DONE"], [M[0], "14:30 · WAITING"], [M[1], "15:00 · WAITING"], [M[2], "15:30 · WAITING"], [M[3], "16:00 · MEDIUM RARE"],
    [M[4], "16:30 · WELL DONE"], [M[5], "16:45 · ALMOST…"], [BEEP, "17:00 · SWIM TIME!"], [RESET, "17:05 · ATE A BITE"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= M[3] ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const GB = (h, t0, t1, fs = 46, w = 520) => bubble(h, 40, 840, w, 160, t0, t1, fs);
  bubble("Right! Swimming time!", 540, 880, 480, 250, SWIM, THREE - .05, 48);
  GB("Three hours after lunch. Or you get a cramp… and you DIE.", THREE, AGE - .05, 44, 560);
  bubble("Grandma… I'm thirty-five.", 520, 880, 500, 260, AGE, M0 - .1, 46);
  GB("Okay! Now you can swim.", NOW, FIN, 48, 460);
  bubble("Finally!", 600, 460, 260, 150, FIN, EAT - .05, 54);
  GB("Wait! You must be starving. Eat, eat!", EAT, RESET - .1, 46, 520);
  GB("Okay. Three hours.", RESET, STAMP - .1, 52, 420);
  const sb = E.el(S.el, "abs", "left:60px;top:620px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "SEE YOU TOMORROW.", STAMP, { size: 100, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/waves-seagulls.wav", { vol: .5, duck: false, to: DUR });
  E.clip(SWIM, "voices/ep94/o_swim.wav", { vol: 1.2 });
  E.clip(THREE, "voices/ep94/g_three.wav", { vol: 1.3 }); E.clip(THREE + 1.2, "sfx/elx-stopwatch.wav", { vol: 1.6, to: .3 });
  E.clip(AGE, "voices/ep94/o_age.wav", { vol: 1.2 });
  E.S(M0, "whoosh", .4); for (let t = M0 + .2; t < BEEP; t += .375) E.S(t, "tick", .45);
  E.clip(BEEP, "sfx/elx-stopwatch.wav", { vol: 1.8 });
  E.clip(NOW, "voices/ep94/g_now.wav", { vol: 1.3 });
  E.clip(FIN, "voices/ep94/o_finally.wav", { vol: 1.2 });
  E.clip(EAT, "voices/ep94/g_eat.wav", { vol: 1.3 }); E.S(EAT + .1, "scratch", .45);
  E.S(BITE - .2, "whoosh", .35); E.clip(BITE + .1, "sfx/munch.wav", { vol: .8, to: 1.2 });
  E.clip(RESET - .2, "sfx/elx-stopwatch.wav", { vol: 1.8, to: .3 }); E.clip(RESET, "voices/ep94/g_reset.wav", { vol: 1.35 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Swimming after lunch in *Portugal*", { size: 46, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[22.8, 1], [23.05, 1.18, "out"], [23.4, 1, "io"]]);
}
