// EP.88 "Talking to grandma during her novela" — grandma is glued to her soap opera. Otto: "Grandma! I got the job!" "Shhh!" "Grandma,
// I'm getting married!" "Shhh!" The kitchen catches fire: "Grandma! The kitchen is on FIRE!" "Shhh! Is the best part!" The firemen burst
// in… and sit down to watch. On TV: "Ricardo… estou grávida!" (I'm pregnant!) Grandma, sobbing: "Ai, meu Deus! I KNEW IT!" Commercial
// break — she turns, sweetly: "So, filho. What did you want?" "…Nothing, Grandma." The novela is back. Grandma and the firemen: "Shhh!"
export const meta = {
  id: "ep88-novela", date: "2026-12-20",
  images: {
    bg: "characters/scenes/bg_avo.webp", tv: "characters/props/tv_novela.webp", gs: "characters/cutouts/dona-arm_shh.webp", gc: "characters/cutouts/dona-arm_cry.webp",
    gk: "characters/cutouts/dona-arm_calm.webp", oj: "characters/cutouts/otto-casual_job.webp", of: "characters/cutouts/otto-casual_fire.webp", fm: "characters/cutouts/firemen_sofa.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 96, root: 57, seed: 881, prog: [[0, 3, 7], [8, 12, 15], [5, 8, 12], [7, 11, 14]] });
  const DUR = 21.4, JOB = .3, SH1 = 2.0, MAR = 2.8, SH2 = 4.45, GLOW = 5.0, FIRE = 5.3, BEST = 7.9, BURST = 8.3, SIT = 9.3, GRAV = 10.0, KNEW = 12.4,
    BREAK = 15.6, WANT = 15.8, NOTH = 18.0, BACK = 19.2, SHH3 = 19.3;
  const S = E.scene("novela", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  // the kitchen doorway (top left) catches fire; smoke fills the room
  const glow = E.el(S.el, "abs", "left:-120px;top:160px;width:460px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(255,150,40,.85),rgba(255,90,20,.35) 45%,rgba(255,80,20,0) 70%);z-index:1;opacity:0");
  E.K(glow, "o", [[GLOW, 0], [FIRE, 1]]);
  const flames = [...Array(7)].map((_, i) => E.el(S.el, "abs", `left:${-10 + i * 30}px;top:${520 - (i % 3) * 40}px;width:70px;height:130px;border-radius:50% 50% 40% 40%/70% 70% 30% 30%;background:linear-gradient(0deg,#ff5a1a,#ffb52e 60%,#fff3b0);z-index:1;opacity:0;transform-origin:50% 100%`));
  E.F(t => flames.forEach((f, i) => { const on = t >= GLOW + .2; f.style.opacity = on ? .95 : 0; f.style.transform = `scaleY(${.8 + Math.abs(Math.sin(t * 7 + i)) * .5}) scaleX(${.9 + Math.sin(t * 5 + i) * .1})`; }));
  const smoke = [...Array(8)].map((_, i) => E.el(S.el, "abs", `left:${40 + i * 40}px;top:300px;width:${140 + (i % 3) * 40}px;height:${140 + (i % 3) * 40}px;border-radius:50%;background:rgba(90,90,100,.45);z-index:2;opacity:0`));
  E.F(t => smoke.forEach((s, i) => { const u = ((t - GLOW) * .35 + i * .13) % 1; s.style.opacity = t > GLOW + .3 ? .8 * (1 - u) : 0; s.style.transform = `translate(${u * 500}px,${-u * 260}px) scale(${.6 + u})`; }));
  const haze = E.el(S.el, "abs", "inset:0;background:rgba(80,80,90,1);z-index:5;pointer-events:none;opacity:0");
  E.K(haze, "o", [[GLOW, 0], [BURST, .22], [DUR, .3]]);

  // the TV (right) with the novela playing
  const tv = E.el(S.el, "abs", "left:610px;top:520px;width:470px;height:350px;background:#2b2f35;border-radius:24px;padding:20px;box-sizing:border-box;z-index:3;box-shadow:0 14px 30px rgba(0,0,0,.35)");
  const scr = E.el(tv, "", "position:relative;width:100%;height:100%;border-radius:10px;overflow:hidden;background:#000");
  const nv = E.el(scr, "abs", "left:-40px;top:0;width:540px;height:302px;transform-origin:50% 50%"); E.img(nv, "tv", "width:540px;height:302px");
  E.K(nv, "x", [[0, 0], [GRAV, -30, "lin"], [GRAV + .3, -60, "out"], [BREAK, -80, "lin"]]); E.K(nv, "s", [[GRAV, 1], [GRAV + .4, 1.35, "out"], [KNEW, 1.35], [KNEW + .3, 1, "io"]]);
  const brk = E.el(scr, "abs", "inset:0;background:linear-gradient(135deg,#f2c230,#e5484d);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:44px;letter-spacing:.1em;opacity:0", "INTERVALO");
  show(brk, [[BREAK, BACK]]);
  E.el(S.el, "abs", "left:630px;top:870px;width:440px;height:120px;background:#6a4020;border-radius:8px;z-index:2");

  // grandma in her armchair (centre), same canvas for all three poses
  const GS = .74, gw = E.el(S.el, "abs", "left:300px;top:0;width:1px;height:1px;z-index:4");
  const G = [["gs", 0], ["gc", 1], ["gk", 2]].map(([n]) => E.img(gw, n, `position:absolute;left:0;top:${1920 - 1168 * GS}px;width:${880 * GS}px;height:${1168 * GS}px;opacity:0`));
  const GT = [[0, 0], [KNEW, 1], [BREAK, 2], [BACK, 0]];
  E.F(t => { const k = at(GT, t); G.forEach((g, i) => { g.style.opacity = i === k ? 1 : 0; }); });
  const gb = []; for (let t = 0; t < DUR; t += .9) gb.push([t, 0, "io"], [t + .45, -4, "io"]); E.K(gw, "y", gb);          // frame-0 motion
  const sob = []; for (let t = KNEW; t < BREAK; t += .15) sob.push([t, (Math.round(t * 7) % 2) ? -8 : 0]); E.K(gw, "x", sob);
  // Otto (left)
  const o1 = fig("oj", 641, 985, .74, -80, 1700, 3), o2 = fig("of", 648, 1009, .74, -90, 1700, 3);
  show(o1, [[0, FIRE]]); show(o2, [[FIRE, DUR]]);
  E.K(o1, "x", [[JOB - .3, -300], [JOB, 0, "out"]]);
  const jump = []; for (let t = FIRE; t < BEST; t += .3) jump.push([t, 0], [t + .15, -24]); E.K(o2, "y", jump);
  // the firemen: burst in, then sit and watch (behind grandma)
  const fm = fig("fm", 1007, 872, .56, 330, 1260, 2); show(fm, [[SIT, DUR]]);
  E.K(fm, "y", [[SIT, 60], [SIT + .3, 0, "out"]]);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "NOVELA · EPISODE 847"], [GLOW, "KITCHEN: ON FIRE"], [SIT, "FIREMEN: WATCHING TOO"], [BREAK, "COMMERCIAL BREAK · 3 MIN"], [BACK, "NOVELA · EPISODE 847"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= GLOW && t < BREAK ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  const O = (h, t0, t1, fs = 46, w = 460) => bubble(h, 30, 780, w, 140, t0, t1, fs);
  const Gb = (h, t0, t1, fs = 50, w = 400) => bubble(h, 470, 1000, w, 140, t0, t1, fs);
  O("Grandma! I got the job!", JOB, SH1 + .6);
  Gb("Shhh!", SH1, MAR, 60, 220);
  O("Grandma, I'm getting married!", MAR, SH2 + .5);
  Gb("Shhh!", SH2, FIRE, 60, 220);
  O("Grandma! The kitchen is on FIRE!", FIRE, BEST, 46, 520);
  Gb("Shhh! Is the best part!", BEST, SIT, 44, 420);
  bubble(`Ricardo… estou grávida!${sub("(Ricardo… I'm pregnant!)")}`, 500, 890, 560, 300, GRAV, KNEW - .05, 42);
  Gb("Ai, meu Deus! I KNEW IT!", KNEW, BREAK, 46, 440);
  Gb("So, filho. What did you want?", WANT, NOTH, 44, 460);
  O("…Nothing, Grandma.", NOTH, BACK + .2, 48, 420);
  bubble("SHHH!", 470, 1000, 300, 140, SHH3, DUR - .4, 64);
  const sb = E.el(S.el, "abs", "left:60px;top:560px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "NOVELA > FIRE.", SHH3 + .6, { size: 116, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/tv-loud.wav", { vol: .12, duck: false, to: BREAK });
  E.clip(JOB, "voices/ep88/o_job.wav", { vol: 1.2 }); E.clip(SH1, "voices/ep88/g_shh.wav", { vol: 1.4 });
  E.clip(MAR, "voices/ep88/o_married.wav", { vol: 1.2 }); E.clip(SH2, "voices/ep88/g_shh.wav", { vol: 1.4 });
  E.clip(GLOW, "sfx/sizzle.wav", { vol: .8, duck: false }); E.S(GLOW, "riser", .4);
  E.clip(FIRE, "voices/ep88/o_fire.wav", { vol: 1.25 }); E.clip(BEST, "voices/ep88/g_best.wav", { vol: 1.35 });
  E.clip(BURST - .3, "sfx/horn-beep.wav", { vol: .8 }); E.clip(BURST, "sfx/water-gush.wav", { vol: .8, to: 1 }); E.S(SIT, "thud", .5);
  E.clip(GRAV, "voices/ep88/n_gravida.wav", { vol: 1.3 }); E.S(GRAV + .2, "riser", .4);
  E.clip(KNEW, "voices/ep88/g_knew.wav", { vol: 1.35 });
  E.S(BREAK, "ding", .5); E.clip(WANT, "voices/ep88/g_want.wav", { vol: 1.3 });
  E.clip(NOTH, "voices/ep88/o_nothing.wav", { vol: 1.2 });
  E.clip(SHH3, "voices/ep88/g_shh.wav", { vol: 1.4 }); E.clip(SHH3 + .05, "voices/ep88/f_shh.wav", { vol: 1.3 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Never interrupt grandma's *novela*", { size: 44, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[20.6, 1], [20.85, 1.18, "out"], [21.2, 1, "io"]]);
}
