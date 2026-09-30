// EP.92 "Watching football with a Portuguese dad" — 60', 0–0. Dad in his lucky shirt: "Nobody moves. Nobody breathes." The rules: the
// shirt (unwashed since 2004), the same seats, grandma's rosary. Otto wanders past the TV: "I'm just getting some water." They score.
// 0–1. The family turns: "OTTO." Dad: "Stand up again. EXACTLY like before." Otto, one leg up, glass out — GOAL! 1–1. "Don't. Move."
// 90+4': Otto, cobwebs, trembling: "…It's been ninety minutes." GOAL! 2–1. Dad, emotional: "Same position. Next week."
export const meta = {
  id: "ep92-superstition", date: "2026-12-24",
  images: {
    bg: "characters/scenes/bg_avo.webp", ft: "characters/cutouts/family_tense.webp", fc: "characters/cutouts/family_cheer2.webp", fg: "characters/cutouts/family_glare.webp",
    ow: "characters/cutouts/otto-casual_water.webp", of: "characters/cutouts/otto-casual_frozen.webp", of2: "characters/cutouts/otto-casual_frozen2.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 52, seed: 921, prog: [[0, 3, 7], [8, 12, 15], [5, 8, 12], [7, 11, 14]] });
  const DUR = 21.0, RULE = .3, R = [3.3, 3.9, 4.5], WATER = 5.4, AGAINST = 6.9, OTTO = 7.5, STAND = 8.6, FROZE = 11.2, G1 = 11.6, DONT = 12.9, SKIP = 15.0, NINETY = 15.3,
    G2 = 17.2, SAME = 17.8;
  const S = E.scene("superstition", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  E.el(S.el, "abs", "inset:0;background:rgba(20,20,40,.18)");
  // the TV (top right) with a pitch and the score
  const tv = E.el(S.el, "abs", "left:560px;top:480px;width:490px;height:340px;background:#2b2f35;border-radius:24px;padding:18px;box-sizing:border-box;z-index:3;box-shadow:0 14px 30px rgba(0,0,0,.35)");
  const scr = E.el(tv, "", "position:relative;width:100%;height:100%;border-radius:10px;overflow:hidden;background:repeating-linear-gradient(90deg,#3f9a4a 0 40px,#378c42 40px 80px)");
  E.el(scr, "abs", "left:50%;top:0;width:4px;height:100%;background:rgba(255,255,255,.7)"); E.el(scr, "abs", "left:calc(50% - 50px);top:calc(50% - 50px);width:92px;height:92px;border:4px solid rgba(255,255,255,.7);border-radius:50%");
  const ball = E.el(scr, "abs", "left:0;top:0;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px #1d2b36");
  E.F(t => { ball.style.transform = `translate(${200 + Math.sin(t * 1.7) * 170}px,${140 + Math.cos(t * 2.3) * 90}px)`; });
  const sc = E.el(scr, "abs", "left:10px;top:10px;background:rgba(0,0,0,.75);color:#fff;font-weight:900;font-size:30px;padding:4px 12px;border-radius:8px", "");
  const SC = [[0, "US 0–0 THEM · 60'"], [AGAINST, "US 0–1 THEM · 71'"], [G1, "US 1–1 THEM · 72'"], [SKIP, "US 1–1 THEM · 90+4'"], [G2, "US 2–1 THEM · FT"]];
  E.F(t => { const s = at(SC, t); if (sc.textContent !== s) sc.textContent = s; });
  const goal = E.el(scr, "abs", "inset:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:80px;color:#fff;text-shadow:0 4px 0 #1d2b36;opacity:0", "GOLO!");
  show(goal, [[G1, G1 + 1.2], [G2, G2 + 1.4]]);
  const bad = E.el(scr, "abs", "inset:0;background:rgba(200,30,40,.55);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:64px;color:#fff;opacity:0", "0–1 😱");
  show(bad, [[AGAINST, AGAINST + 1.2]]);
  E.el(S.el, "abs", "left:580px;top:820px;width:450px;height:90px;background:#6a4020;border-radius:8px;z-index:2");

  // the family on the sofa (left/centre): tense, glaring, cheering
  const FS = .92, fw = E.el(S.el, "abs", "left:-40px;top:0;width:1px;height:1px;z-index:4");
  const F = ["ft", "fg", "fc"].map(n => E.img(fw, n, `position:absolute;left:0;top:${1920 - 688 * FS}px;width:${1024 * FS}px;height:${688 * FS}px;opacity:0`));
  const FT = [[0, 0], [AGAINST + .3, 1], [STAND + .6, 0], [G1, 2], [DONT, 0], [G2, 2]];
  E.F(t => { const k = at(FT, t); F.forEach((f, i) => { f.style.opacity = i === k ? 1 : 0; }); });
  const tr = []; for (let t = 0; t < DUR; t += .12) tr.push([t, (Math.round(t * 8) % 2) ? 1.5 : -1.5]); E.K(fw, "x", tr);                   // frame-0 motion: tension
  // rule tags
  const TAGS = [["LUCKY SHIRT · UNWASHED SINCE 2004", 20, 1260], ["SAME SEATS SINCE 1998", 330, 1180], ["GRANDMA'S ROSARY: ON", 380, 1330]];
  TAGS.forEach(([txt, x, y], i) => { const g = E.el(S.el, "abs", `left:${x}px;top:${y}px;background:${C.coralD};color:#fff;font-weight:900;font-size:28px;padding:6px 14px;border-radius:12px;z-index:6;opacity:0;white-space:nowrap`, txt); E.K(g, "o", [[R[i] - .01, 0], [R[i], 1], [WATER - .2, 1], [WATER, 0]]); E.K(g, "s", [[R[i], 1.4], [R[i] + .2, 1, "out"]]); });
  // Otto (right)
  const o1 = fig("ow", 603, 992, .78, 420, 1880, 5), o2 = fig("of", 688, 1024, .76, 600, 1900, 5), o3 = fig("of2", 688, 1024, .76, 600, 1900, 5);
  show(o1, [[WATER - .3, STAND + .4]]); show(o2, [[STAND + .4, SKIP]]); show(o3, [[SKIP, DUR]]);
  E.K(o1, "x", [[WATER - .3, -600], [AGAINST, 60, "lin"], [STAND, 120, "lin"]]);
  const shiver = []; for (let t = SKIP; t < DUR; t += .1) shiver.push([t, (Math.round(t * 10) % 2) ? 2 : -2]); E.K(o3, "r", shiver);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "SUNDAY · THE BIG GAME"], [AGAINST, "WHO MOVED?"], [FROZE, "OTTO: THE LUCKY CHARM"], [SKIP, "OTTO: FROZEN FOR 22 MIN"], [G2, "WON 2–1 · THANKS, OTTO"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= AGAINST ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const D = (h, t0, t1, fs = 46, w = 500) => bubble(h, 40, 1030, w, 120, t0, t1, fs);
  D("Nobody moves. Nobody breathes.", RULE, R[0] - .1);
  bubble("I'm just getting some water.", 480, 900, 520, 260, WATER, AGAINST, 44);
  bubble("OTTO.", 60, 1030, 280, 120, OTTO, STAND - .1, 64);
  D("Stand up again. EXACTLY like before.", STAND, FROZE, 44, 540);
  D("Don't. Move.", DONT, SKIP - .1, 56, 360);
  bubble("…It's been ninety minutes.", 460, 880, 560, 300, NINETY, G2 - .1, 44);
  D("Same position. Next week.", SAME, DUR - .4, 48, 480);
  const sb = E.el(S.el, "abs", "left:60px;top:900px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "SEE YOU NEXT SUNDAY.", SAME + 1.8, { size: 90, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/cafe-tv-crowd.wav", { vol: .45, duck: false, to: DUR });
  E.clip(RULE, "voices/ep92/d_nobody.wav", { vol: 1.3 }); R.forEach(t => E.S(t, "pop", .5));
  E.clip(WATER, "voices/ep92/o_water.wav", { vol: 1.2 });
  E.clip(AGAINST, "sfx/crowd-groan.wav", { vol: 1.0 }); E.S(AGAINST + .3, "scratch", .5);
  E.clip(OTTO, "voices/ep92/f_otto.wav", { vol: 1.5 });
  E.clip(STAND, "voices/ep92/d_stand.wav", { vol: 1.3 });
  E.clip(G1, "sfx/stadium-goal.wav", { vol: 1.0, to: 1.8 });
  E.clip(DONT, "voices/ep92/d_dont.wav", { vol: 1.35 });
  E.S(SKIP, "whoosh", .5); E.clip(NINETY, "voices/ep92/o_ninety.wav", { vol: 1.2 });
  E.clip(G2, "sfx/stadium-goal.wav", { vol: 1.1, to: 2.2 });
  E.clip(SAME, "voices/ep92/d_same.wav", { vol: 1.35 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Football with a Portuguese *dad*", { size: 46, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[20.2, 1], [20.45, 1.18, "out"], [20.8, 1, "io"]]);
}
