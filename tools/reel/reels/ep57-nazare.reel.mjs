// EP.57 "Surfing in Nazaré" — Buck with his board, cocky: "Waves? Please. I've surfed Cornwall." Behind him the sea starts to rise;
// the WAVE meter climbs 1 m → 5 m → 12 m → 20+ m and the light goes dark. He turns round: "…Nope. Nope nope nope nope." — and runs.
// On the giant wave: a Portuguese grandma, surfing it calmly while she knits. Last shot: Buck sunbathing on his towel, "surf done",
// while grandma is still out there. Voiced (Buck) + a giant-wave roar and seagulls. Paced per the skit guide.
export const meta = {
  id: "ep57-nazare", date: "2026-11-19",
  images: {
    surf: "characters/cutouts/buck_surf.webp", run: "characters/cutouts/buck_run.webp", beach: "characters/cutouts/buck_beach.webp",
    gran: "characters/cutouts/dona_surf.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 57, seed: 571, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 17.0, SAND = 1560, RISE = 3.8, NOPE = 6.1, RUN = 7.6, GRAN = 8.2, END = 12.6;
  const S = E.scene("nazare", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const lerp = (K, t) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t < K[i + 1][0]) { let u = (t - K[i][0]) / (K[i + 1][0] - K[i][0]); u = u * u * (3 - 2 * u); return K[i][1] + (K[i + 1][1] - K[i][1]) * u; } return K[K.length - 1][1]; };
  const WAVEH = [[0, 0.05], [RISE, .05], [RISE + 1.0, .25], [RISE + 2.0, .55], [RUN, 1], [DUR, 1]];

  // ---------------- sky, cliff and lighthouse ----------------
  const sky = E.el(S.el, "abs", "inset:0");
  E.F(t => { const d = lerp([[0, 0], [RISE, 0], [RUN, 1], [END - .01, 1], [END, .3]], t); sky.style.background = `linear-gradient(180deg, rgb(${143 - d * 80},${205 - d * 110},${240 - d * 110}), rgb(${223 - d * 110},${242 - d * 120},${251 - d * 110}))`; });
  const cliff = E.el(S.el, "abs", "left:760px;top:900px;width:420px;height:700px;background:#b58a5a;border-radius:120px 0 0 0;box-shadow:inset 20px 0 0 rgba(0,0,0,.08)");
  E.el(S.el, "abs", "left:800px;top:880px;width:320px;height:40px;background:#6cae5a;border-radius:20px 0 0 0");
  const fort = E.el(S.el, "abs", "left:860px;top:740px;width:170px;height:150px;background:#f2e6cf;border:6px solid #c9b48a");
  E.el(fort, "abs", "left:50px;top:-110px;width:60px;height:110px;background:#e5484d;border:6px solid #fff;border-bottom:none");         // the red lighthouse
  E.el(fort, "abs", "left:44px;top:-140px;width:72px;height:36px;background:#2b2b2b;border-radius:30px 30px 0 0");

  // ---------------- the sea and the wave ----------------
  E.el(S.el, "abs", `left:0;top:1260px;width:800px;height:${SAND - 1260}px;background:linear-gradient(180deg,#2e86b8,#5fb3dd)`);
  const wave = E.el(S.el, "abs", `left:-260px;top:${SAND - 1500}px;width:1200px;height:1500px;transform-origin:50% 100%;z-index:1`,
    `<svg width="1200" height="1500" viewBox="0 0 1200 1500"><defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f6f8f"/><stop offset=".6" stop-color="#15506a"/><stop offset="1" stop-color="#2e86b8"/></linearGradient></defs>
    <path d="M0 1500 L0 420 C 120 180 380 40 640 60 C 860 80 1010 200 1060 360 C 1000 300 920 290 880 340 C 960 380 1000 470 980 560 C 900 700 1000 1100 1200 1500 Z" fill="url(#wg)"/>
    <path d="M640 60 C 860 80 1010 200 1060 360 C 1000 300 920 290 880 340 C 850 250 760 190 640 180 Z" fill="#e9f7ff"/>
    ${Array.from({ length: 10 }, (_, i) => `<circle cx="${700 + i * 40}" cy="${90 + Math.abs(i - 4) * 28}" r="${26 - i}" fill="#fff"/>`).join("")}
    <path d="M40 700 C 200 640 360 660 520 620" stroke="rgba(255,255,255,.35)" stroke-width="14" fill="none"/><path d="M60 950 C 260 900 420 920 600 880" stroke="rgba(255,255,255,.25)" stroke-width="14" fill="none"/></svg>`);
  E.F(t => { const h = lerp(WAVEH, t); wave.style.transform = `scaleY(${h}) scaleX(${.8 + h * .2})`; wave.style.opacity = t >= END ? .95 : 1; });
  const spray = Array.from({ length: 14 }, (_, i) => E.el(S.el, "abs", `left:${400 + i * 30}px;top:0;width:${20 + (i % 3) * 10}px;height:${20 + (i % 3) * 10}px;border-radius:50%;background:#fff;z-index:2;opacity:0`));
  E.F(t => spray.forEach((d, i) => { const h = lerp(WAVEH, t), on = h > .5 && t < END, u = ((t * 1.3 + i * .13) % 1); d.style.opacity = on ? 1 - u : 0; d.style.transform = `translate(${u * 120}px,${SAND - 1500 * h + 80 - u * 160}px)`; }));
  // the sand
  E.el(S.el, "abs", `left:0;top:${SAND}px;width:1080px;height:${1920 - SAND}px;background:#f0d9a4;z-index:3`);
  E.el(S.el, "abs", `left:0;top:${SAND}px;width:1080px;height:30px;background:#e6c989;z-index:3`);

  // ---------------- Buck ----------------
  const bk = E.el(S.el, "abs", `left:0;top:0;width:1px;height:1px;z-index:5`);
  const b1 = E.img(bk, "surf", `position:absolute;left:380px;top:${SAND + 120 - 1013 * .8}px;width:${640 * .8}px;height:${1013 * .8}px`);
  const b2 = E.img(bk, "run", `position:absolute;left:300px;top:${SAND + 120 - 984 * .8}px;width:${839 * .8}px;height:${984 * .8}px;opacity:0`);
  E.F(t => { const r = t >= RUN - .3; b1.style.opacity = r ? 0 : 1; b2.style.opacity = r ? 1 : 0; bk.style.opacity = t < GRAN ? 1 : 0; });
  const bb = []; for (let t = 0; t < RISE + 1; t += .8) bb.push([t, 0, "io"], [t + .4, -8, "io"]);
  E.K(bk, "y", bb);                                                                                                     // frame-0 motion
  E.K(bk, "x", [[RUN - .3, 0], [GRAN, -1000, "in"]]);
  const shake = []; for (let t = NOPE; t < RUN - .3; t += .08) shake.push([t, (Math.round(t * 12) % 2 ? 5 : -5)]);
  E.K(b1, "x", shake);

  // ---------------- grandma on the wave ----------------
  const gw = E.el(S.el, "abs", `left:0;top:0;width:${810 * .7}px;height:${885 * .7}px;z-index:4;opacity:0`);
  E.img(gw, "gran", `width:${810 * .7}px;height:${885 * .7}px`);
  E.F(t => {
    const on = t >= GRAN; gw.style.opacity = on ? 1 : 0; if (!on) return;
    if (t < END) { const u = (t - GRAN) / (END - GRAN); gw.style.transform = `translate(${-20 + u * 440}px,${500 + Math.sin(u * 6) * 30 + u * 120}px) rotate(${-6 + Math.sin(u * 5) * 4}deg)`; }
    else { gw.style.transform = `translate(${360}px,${760}px) scale(.35) rotate(-6deg)`; }
  });
  const needles = E.el(S.el, "abs", "left:0;top:0;font-weight:900;font-size:40px;color:#fff;z-index:6;opacity:0;text-shadow:0 2px 6px rgba(0,0,0,.5)", "click click");
  E.F(t => { const on = t > GRAN + .6 && t < END; needles.style.opacity = on && (t * 3) % 1 < .6 ? 1 : 0; const u = (t - GRAN) / (END - GRAN); needles.style.transform = `translate(${40 + u * 520}px,${430 + u * 120}px)`; });

  // ---------------- the end: Buck sunbathing ----------------
  const be = E.el(S.el, "abs", `left:-40px;top:${SAND + 280 - 886 * .8}px;width:${823 * .8}px;height:${886 * .8}px;z-index:5;opacity:0`);
  E.img(be, "beach", `width:${823 * .8}px;height:${886 * .8}px`);
  E.K(be, "o", [[END - .01, 0], [END, 1]]);
  const tag = E.el(S.el, "abs", "left:520px;top:1000px;background:#fff;border-radius:14px;padding:6px 16px;font-weight:900;font-size:34px;color:#1d2b36;z-index:6;box-shadow:0 6px 14px rgba(0,0,0,.15);opacity:0", "← still out there");
  E.K(tag, "o", [[END + .8, 0], [END + .9, 1]]);

  // ---------------- HUD ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:52px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  const MET = [[0, "NAZARÉ · WAVE: 1 m"], [RISE + .5, "NAZARÉ · WAVE: 5 m"], [RISE + 1.4, "NAZARÉ · WAVE: 12 m"], [RISE + 2.2, "NAZARÉ · WAVE: 20+ m"], [END, "BUCK · SURF: DONE"]];
  E.F(t => { const s = at(MET, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= RISE + 1.4 && t < END ? C.coralD : t >= END ? "#1f7a3a" : C.ink; });
  MET.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.22], [t + .25, 1, "out"]]));

  // ---------------- bubbles, stamp ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 52) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:32px;padding:18px 26px 22px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Waves? Please. I've surfed Cornwall.", 60, 620, 620, 420, .4, RISE + .4, 48);
  bubble("…Nope. Nope nope nope.", 80, 640, 540, 380, NOPE, RUN + .3, 52);
  const sb = E.el(S.el, "abs", "left:60px;top:470px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "NAZARÉ: LOCALS ONLY.", END + 1.6, { size: 86, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  E.clip(0, "sfx/waves-seagulls.wav", { vol: .6, duck: false, to: RISE + .5 });
  E.clip(.4, "voices/ep57/b_cornwall.wav", { vol: 1.15 });
  E.clip(RISE, "sfx/big-wave.wav", { vol: .7, gain: [[RISE, .4], [RISE + 2, 1]] }); E.clip(RISE + 3.6, "sfx/big-wave.wav", { vol: .5, duck: false, to: END - RISE - 3.6 });
  E.S(RISE + .5, "tick", .6); E.S(RISE + 1.4, "tick", .7); E.S(RISE + 2.2, "nope", .7);
  E.clip(NOPE, "voices/ep57/b_nope.wav", { vol: 1.2 });
  E.S(RUN - .3, "whoosh", .7);
  E.S(GRAN, "sparkle", .6);
  E.clip(END, "sfx/waves-seagulls.wav", { vol: .6, duck: false, to: DUR - END });
  E.S(END + .1, "ding", .5);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.95);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "Surfing in *Nazaré*", { size: 58, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[16.2, 1], [16.45, 1.18, "out"], [16.8, 1, "io"]]);
}
