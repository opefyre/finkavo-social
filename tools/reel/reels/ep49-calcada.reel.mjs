// EP.49 "Lisbon pavement when it rains" — the white-and-black calçada: pretty in the sun, an ice rink in the rain. Otto strolls,
// whistling. Clouds, rain, one step: he windmills, slides, spins ("A TRIPLE AXEL!") and lands in a split ("Magnificent!"), called by a
// British sports commentator. A tiny Portuguese grandma with an umbrella walks past in perfect little steps ("…flawless"). Three
// old men on a bench hold up the scores: 10 · 10 · 10 — for her. Voiced commentator (ElevenLabs) + rain/squeak effects.
export const meta = {
  id: "ep49-calcada", date: "2026-11-11",
  images: {
    walk: "characters/cutouts/otto-casual_stroll.webp", slip: "characters/cutouts/otto-casual_slip.webp", spin: "characters/cutouts/otto-casual_spin.webp",
    split: "characters/cutouts/otto-casual_split.webp", gran: "characters/cutouts/dona_umbrella.webp", judges: "characters/cutouts/judges_bench.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 62, seed: 491, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 17.4, GROUND = 1500, RAIN = 3.0, SLIP = 3.7, SPIN = 6.4, SPLIT = 7.9, GRAN = 10.6, SCORE = 14.0;
  const S = E.scene("street", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  // ---------------- the street ----------------
  const sky = E.el(S.el, "abs", "inset:0");
  E.F(t => { const u = Math.max(0, Math.min(1, (t - RAIN + .4) / .8)); sky.style.background = `linear-gradient(180deg, rgb(${143 - u * 60},${205 - u * 90},${240 - u * 90}), rgb(${223 - u * 70},${242 - u * 80},${251 - u * 70}))`; });
  const cols = ["#f5c9a8", "#ffe29a", "#bfe0d6", "#f7b7b7", "#cfe0f5"];
  for (let i = 0; i < 5; i++) {
    const b = E.el(S.el, "abs", `left:${-20 + i * 225}px;top:${760 - (i % 2) * 90}px;width:230px;height:${GROUND - 760 + (i % 2) * 90}px;background:${cols[i]};box-shadow:inset -8px 0 0 rgba(0,0,0,.05)`);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) E.el(b, "abs", `left:${34 + c * 100}px;top:${70 + r * 210}px;width:62px;height:120px;background:#3d5a73;border:8px solid #fff;border-radius:30px 30px 4px 4px`);
    E.el(b, "abs", "left:0;top:0;width:100%;height:22px;background:#c0643f");
  }
  const sun = E.el(S.el, "abs", "left:800px;top:470px;width:160px;height:160px;border-radius:50%;background:#ffd23f;box-shadow:0 0 60px 30px rgba(255,210,63,.55)");
  E.K(sun, "o", [[RAIN - .5, 1], [RAIN + .3, 0]]);
  const clouds = [0, 1, 2].map(i => E.el(S.el, "abs", `left:${-400 + i * 380}px;top:${440 + (i % 2) * 70}px;width:420px;height:150px;border-radius:80px;background:#7b8794;box-shadow:60px -40px 0 -10px #7b8794,-50px -20px 0 -20px #8a95a0;opacity:0`));
  clouds.forEach((c, i) => { E.K(c, "o", [[RAIN - .6, 0], [RAIN, .95]]); E.K(c, "x", [[RAIN - .6, -300], [RAIN + .2, 0, "out"]]); });
  // the calçada: white stones with black waves
  const wave = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='120'><rect width='240' height='120' fill='#f4f1ea'/><path d='M0 40 Q60 0 120 40 T240 40' fill='none' stroke='#2b2b2b' stroke-width='22'/><path d='M0 100 Q60 60 120 100 T240 100' fill='none' stroke='#2b2b2b' stroke-width='22'/></svg>`;
  E.el(S.el, "abs", `left:0;top:${GROUND}px;width:1080px;height:${1920 - GROUND}px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(wave)}");background-size:240px 120px`);
  const gloss = E.el(S.el, "abs", `left:0;top:${GROUND}px;width:1080px;height:${1920 - GROUND}px;background:linear-gradient(100deg,transparent 20%,rgba(255,255,255,.55) 32%,transparent 44%,transparent 60%,rgba(255,255,255,.4) 70%,transparent 80%);opacity:0`);
  E.K(gloss, "o", [[RAIN + .2, 0], [RAIN + .8, 1]]);
  E.F(t => { gloss.style.backgroundPosition = `${(t * 120) % 1080}px 0`; });
  const drops = Array.from({ length: 60 }, (_, i) => E.el(S.el, "abs", `left:${(i * 97) % 1080}px;top:0;width:4px;height:46px;border-radius:2px;background:rgba(210,230,255,.8);z-index:6;opacity:0`));
  E.F(t => drops.forEach((d, i) => { const on = t > RAIN; d.style.opacity = on ? .8 : 0; const y = ((t * 1600 + i * 137) % 1500) + 400; d.style.transform = `translate(${-y * .12}px,${y}px) rotate(8deg)`; }));

  // ---------------- Otto: stroll → slip → spin → split ----------------
  const OS = .72, ot = E.el(S.el, "abs", `left:0;top:0;width:1px;height:1px;z-index:4`);
  const P = { walk: [540, 1044], slip: [839, 985], spin: [695, 1064], split: [823, 599] };
  const im = Object.entries(P).map(([n, [w, h]]) => [n, E.img(ot, n, `position:absolute;left:${-w * OS / 2}px;top:${-h * OS}px;width:${w * OS}px;height:${h * OS}px;opacity:0;transform-origin:50% 100%`)]);
  const XK = [[0, 160], [SLIP, 380], [SPIN, 560], [SPLIT, 680], [SPLIT + .8, 780, "out"], [DUR, 780]];
  const lerp = (K, t) => { for (let i = 0; i < K.length - 1; i++) if (t < K[i + 1][0]) { let u = (t - K[i][0]) / (K[i + 1][0] - K[i][0]); if (K[i + 1][2] === "out") u = 1 - (1 - u) * (1 - u); return K[i][1] + (K[i + 1][1] - K[i][1]) * Math.max(0, u); } return K[K.length - 1][1]; };
  E.F(t => {
    const f = at([[0, "walk"], [SLIP, "slip"], [SPIN, "spin"], [SPLIT, "split"]], t);
    im.forEach(([n, el]) => { el.style.opacity = n === f ? 1 : 0; });
    let y = GROUND + 30, r = 0, sx = 1;
    if (f === "walk") y -= Math.abs(Math.sin(t * 7)) * 10;
    if (f === "slip") { r = Math.sin(t * 13) * 10; y -= Math.abs(Math.sin(t * 9)) * 16; }
    if (f === "spin") { sx = Math.floor((t - SPIN) / .14) % 2 ? -1 : 1; r = Math.sin((t - SPIN) * 20) * 6; y -= 20; }
    if (f === "split") y = GROUND + 36 + (t < SPLIT + .15 ? -(1 - (t - SPLIT) / .15) * 80 : 0);
    ot.style.transform = `translate(${lerp(XK, t)}px,${y}px) rotate(${r}deg) scaleX(${sx})`;
  });
  // speed lines while sliding
  const lines = [0, 1, 2, 3].map(i => E.el(S.el, "abs", `left:0;top:${GROUND - 160 - i * 90}px;width:${140 + (i % 2) * 60}px;height:8px;border-radius:4px;background:rgba(255,255,255,.85);z-index:3;opacity:0`));
  E.F(t => lines.forEach((l, i) => { const on = t > SLIP && t < SPLIT + .8; const x = lerp(XK, t) - 260 - (i % 2) * 80 - ((t * 700 + i * 90) % 160); l.style.opacity = on ? .9 : 0; l.style.transform = `translateX(${x}px)`; }));
  // the grandma, tiny perfect steps
  const gr = E.el(S.el, "abs", `left:-500px;top:${GROUND + 30 - 1033 * .62}px;width:${694 * .62}px;height:${1033 * .62}px;z-index:5`);
  E.img(gr, "gran", `width:${694 * .62}px;height:${1033 * .62}px`);
  E.K(gr, "x", [[GRAN, 200], [GRAN + .8, 460, "out"], [SCORE + 2, 900]]);
  E.K(gr, "o", [[GRAN - .01, 0], [GRAN, 1]]);
  const gs = []; for (let t = GRAN; t < DUR; t += .22) gs.push([t, 0, "io"], [t + .11, -5, "io"]);
  E.K(gr, "y", gs);
  // the judges
  const JW = 1001 * .6, JH = 738 * .6, jd = E.el(S.el, "abs", `left:${540 - JW / 2}px;top:${1920 - JH + 10}px;width:${JW}px;height:${JH}px;z-index:7;opacity:0`);
  E.img(jd, "judges", `width:${JW}px;height:${JH}px`);
  E.K(jd, "o", [[SCORE - .01, 0], [SCORE, 1]]); E.K(jd, "y", [[SCORE, 300], [SCORE + .35, 0, "out"]]);
  [[.165, "10"], [.49, "10"], [.8, "10"]].forEach(([fx, s], i) => {
    const n = E.el(jd, "abs", `left:${JW * fx - 60}px;top:${JH * .02}px;width:120px;height:${JH * .13}px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:66px;color:#1d2b36;opacity:0`, s);
    E.K(n, "o", [[SCORE + .5 + i * .25, 0], [SCORE + .55 + i * .25, 1]]); E.S(SCORE + .5 + i * .25, "pop", .7);
  });
  const arrow = E.el(S.el, "abs", "left:240px;top:1405px;background:#fff;border-radius:16px;padding:6px 16px;font-weight:900;font-size:36px;color:#1d2b36;z-index:8;opacity:0;box-shadow:0 6px 14px rgba(0,0,0,.2)", "↑ all for HER");
  E.K(arrow, "o", [[SCORE + 1.4, 0], [SCORE + 1.5, 1]]);

  // ---------------- broadcast graphics ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:#e5484d;color:#fff;font-weight:900;font-size:46px;padding:.08em .4em .12em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  E.F(t => { const s = t < RAIN ? "☀ LISBON · 22°C" : "● LIVE · WET CALÇADA"; if (pill.textContent !== s) pill.textContent = s; pill.style.background = t < RAIN ? "#1f7a3a" : "#e5484d"; });
  const cap = (txt, t0, t1, col = "#ffd23f") => {
    const b = E.el(S.el, "abs", "left:60px;top:1060px;width:960px;text-align:center;z-index:9;opacity:0", "");
    E.el(b, "", `display:inline-block;background:#1d2b36;color:${col};font-weight:900;font-size:78px;padding:8px 30px;border-radius:18px;transform:rotate(-3deg);box-shadow:0 10px 24px rgba(0,0,0,.3)`, txt);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
  };
  cap("TRIPLE AXEL!", SPIN + .1, SPIN + 1.4);
  cap("THE SPLIT!", SPLIT + .2, SPLIT + 1.7);
  const bubble = (html, left, top, w, tail, t0, t1, fs = 54) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:9;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:32px;padding:18px 26px 22px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("What a pretty pavement!", 40, 560, 500, 160, .5, RAIN - .1, 50);
  const low = E.el(S.el, "abs", "left:60px;top:470px;width:560px;background:rgba(29,43,54,.92);border-left:12px solid #e5484d;border-radius:8px;padding:10px 18px;z-index:9;opacity:0", "");
  E.el(low, "", "color:#fff;font-weight:900;font-size:32px", "COMMENTARY");
  const lowT = E.el(low, "", "color:#cfe3ff;font-weight:800;font-size:34px;line-height:1.15", "");
  const LT = [[SLIP + .1, "“Oh, he's going!”"], [SPIN, "“A triple axel!”"], [SPLIT + .1, "“The split! Magnificent!”"], [GRAN + .1, "“The Portuguese grandmother… flawless.”"]];
  E.F(t => { const s = at([[0, ""], ...LT], t); if (lowT.textContent !== s) lowT.textContent = s; low.style.opacity = t > SLIP && t < SCORE ? 1 : 0; });

  // ---------------- stamp ----------------
  const sb = E.el(S.el, "abs", "left:60px;top:760px;width:960px;display:flex;justify-content:center;z-index:10");
  const st = E.stamp(sb, "WET CALÇADA.", SCORE + 1.9, { size: 100, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  E.clip(0, "sfx/street-sunny.wav", { vol: 3, duck: false, to: RAIN + .3, gain: [[0, 1], [RAIN, 1], [RAIN + .3, 0]] });
  E.clip(RAIN - .2, "sfx/thunder.wav", { vol: .5 });
  for (let k = 0; k < 6; k++) E.clip(RAIN + k * 2.4, "sfx/rain-heavy.wav", { vol: .35, duck: false, to: Math.min(2.5, DUR - RAIN - k * 2.4) });
  E.clip(SLIP, "sfx/skid-squeak.wav", { vol: 1.2 }); E.clip(SLIP + .6, "sfx/skid-squeak.wav", { vol: 1.0 });
  E.clip(SLIP + .1, "voices/ep49/c_going.wav", { vol: 1.15 });
  E.S(SPIN, "whoosh", .8); E.clip(SPIN, "voices/ep49/c_axel.wav", { vol: 1.2 });
  E.S(SPLIT + .12, "thud", .9); E.clip(SPLIT + .1, "voices/ep49/c_split.wav", { vol: 1.15 });
  E.clip(GRAN + .1, "voices/ep49/c_grandma.wav", { vol: 1.15 });
  E.clip(SCORE + 1.3, "sfx/applause-cheer.wav", { vol: .6 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(246,239,226,.95);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "Lisbon pavement *when it rains*", { size: 50, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[16.6, 1], [16.85, 1.18, "out"], [17.2, 1, "io"]]);
}
