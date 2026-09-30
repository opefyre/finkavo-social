// EP.108 "Grandma's knee vs the weather app" — three days, one scoreboard. DAY 1: the app: "Zero percent chance of rain." Otto, thumbs up: "Zero percent rain! Let's go!"
// Grandma clutches her knee, squinting at the sky: "My knee says rain." Downpour; Otto soaked, grandma under a smug umbrella. DAY 2: "Two percent." "Left knee. Rain." Soaked again.
// DAY 3: "Ninety percent chance of rain." Otto in a raincoat, umbrella up. Grandma: "Right knee says sun." Sun. Then Otto, awkward: "I'm not hungry, grandma."
// Her knee twinges: "Os meus joelhos nunca mentem. Senta-te." (My knees never lie. Sit.) He sits and eats. Stamp: KNEE 4 · APP 0.
export const meta = {
  id: "ep108-knee", date: "2027-01-09",
  images: {
    street: "characters/scenes/bg_street.webp", beach: "characters/scenes/bg_beach.webp", feira: "characters/scenes/bg_feira.webp",
    o1: "characters/cutouts/otto-casual_thumbs.webp", o2: "characters/cutouts/otto-casual_soaked.webp", o3: "characters/cutouts/otto-casual_umbrella.webp", o4: "characters/cutouts/otto-casual_awkward.webp", o5: "characters/cutouts/otto-casual_eating.webp",
    d1: "characters/cutouts/dona_knee.webp", d2: "characters/cutouts/dona_smug-umbrella.webp", d3: "characters/cutouts/dona_knowing.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 106, root: 57, seed: 1081, prog: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]] });
  const DUR = 28.0;
  const P0 = .3, OZ = 2.75, DR = 5.85, RAIN1 = 7.6, D2 = 9.6, P2 = 9.7, DL = 12.0, RAIN2 = 13.95, D3 = 15.9, P9 = 16.0, DRT = 18.8, OH = 20.8, DJ = 22.5, EAT = 26.0, STAMP = 26.1;
  const S = E.scene("knee", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };
  const DAYS = [[0, D2, "street", "DAY 1 · THE STREET"], [D2, D3, "beach", "DAY 2 · THE BEACH"], [D3, DUR, "feira", "DAY 3 · THE MARKET"]];

  // ---- the three days
  const OC = 280, DC = 760, FL = 1810;
  DAYS.forEach(([a, b, bg]) => { const G = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G, [[a, b]]); E.img(G, bg, BG); });
  const grp = E.el(S.el, "abs", "inset:0;overflow:hidden");             // characters on top of backgrounds
  const o1 = fig(grp, "o1", 649, 1024, .78, OC, FL, 4), o2 = fig(grp, "o2", 351, 1010, .78, OC, FL, 4), o3 = fig(grp, "o3", 603, 1010, .78, OC, FL, 4), o4 = fig(grp, "o4", 488, 1078, .74, OC, FL, 4), o5 = fig(grp, "o5", 616, 1008, .78, OC, FL, 4);
  const d1 = fig(grp, "d1", 598, 1011, .8, DC, FL, 4), d2 = fig(grp, "d2", 688, 1024, .78, DC, FL, 4), d3 = fig(grp, "d3", 665, 1014, .8, DC, FL, 4);
  const RAINS = [[RAIN1, RAIN1 + 2.0], [RAIN2, RAIN2 + 1.9]];
  E.F(t => {
    const wet = RAINS.some(([a, b]) => t >= a + .5 && t < b + (t < D2 ? 1.8 : 1.9));
    const k = t < RAIN1 + .5 ? 1 : t < D2 ? 2 : t < RAIN2 + .5 ? 1 : t < D3 ? 2 : t < 18.9 ? 3 : t < OH ? 4 : t < EAT ? 5 : 6;     // Otto pose
    [o1, o2, o3, o4, o5].forEach(o => { o.style.opacity = 0; });
    const pick = { 1: o1, 2: o2, 3: o3, 4: o4, 5: o4, 6: o5 }[k]; pick.style.opacity = 1;
    const g = t < RAIN1 + .5 ? 1 : t < D2 ? 2 : t < RAIN2 + .5 ? 1 : t < D3 ? 2 : t < DJ ? 1 : t < EAT ? 3 : 3;
    [d1, d2, d3].forEach(d => { d.style.opacity = 0; }); (t < DJ - .05 ? (g === 2 ? d2 : d1) : d3).style.opacity = 1;
  });
  bob(o1, 0, RAIN1, 6, .5); bob(o5, EAT, DUR, 8, .4); bob(d1, 0, RAIN1, 3, .7);
  const shiv = []; for (let t = RAIN1 + .5; t < D2; t += .18) shiv.push([t, (Math.round(t / .18) % 2) ? 3 : -3, "io"]); E.K(o2, "r", shiv);
  const shiv2 = []; for (let t = RAIN2 + .5; t < D3; t += .18) shiv2.push([t, (Math.round(t / .18) % 2) ? 3 : -3, "io"]); E.K(o2, "r", shiv.concat(shiv2));
  // Otto in the market: umbrella up, nervous sway, then awkward
  const ums = []; for (let t = D3; t < 18.9; t += .4) ums.push([t, (Math.round(t / .4) % 2) ? 2 : -2, "io"]); E.K(o3, "r", ums);

  // ---- rain overlay + darkness
  const dark = E.el(S.el, "abs", "inset:0;background:rgba(25,35,70,.42);z-index:7;opacity:0;pointer-events:none");
  const dk = []; RAINS.forEach(([a, b]) => dk.push([a, 0], [a + .3, 1], [b + .9, 1], [b + 1.4, 0])); E.K(dark, "o", dk);
  const RN = E.el(S.el, "abs", "inset:0;z-index:8;overflow:hidden;pointer-events:none;opacity:0"); show(RN, RAINS.map(([a, b]) => [a + .1, b + 1.2]));
  const drops = []; for (let i = 0; i < 70; i++) drops.push(E.el(RN, "abs", `left:${(i * 173) % 1140 - 40}px;top:0;width:5px;height:${60 + (i * 37) % 50}px;background:rgba(200,225,255,.75);border-radius:3px;transform:rotate(12deg)`));
  E.F(t => { drops.forEach((d, i) => { const y = ((t * 1500 + i * 211) % 2150) - 120; d.style.transform = `translate(${y * .21}px,${y}px) rotate(12deg)`; }); });
  // sunshine
  const sun = E.el(S.el, "abs", "left:700px;top:430px;width:320px;height:320px;z-index:6;opacity:0;font-size:260px;text-align:center;line-height:320px;filter:drop-shadow(0 0 40px rgba(255,220,80,.9))", "☀️");
  E.K(sun, "o", [[18.9, 0], [19.2, 1]]); E.K(sun, "r", [[18.9, 0], [DUR, 40, "lin"]]); E.pop(sun, 18.9, { from: .3, dur: .4 });
  // knee twinge glow (over her knee)
  const glow = (t0, t1, x, y) => { const g = E.el(S.el, "abs", `left:${x - 80}px;top:${y - 80}px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(255,60,40,.85) 0,rgba(255,60,40,.0) 70%);z-index:9;opacity:0`); show(g, [[t0, t1]]); const k = []; for (let t = t0; t < t1; t += .3) k.push([t, .8, "io"], [t + .15, 1.35, "io"]); E.K(g, "s", k);
    const z = E.el(S.el, "abs", `left:${x + 30}px;top:${y - 130}px;font-size:80px;z-index:9;opacity:0`, "⚡"); show(z, [[t0, t1]]); E.K(z, "x", [[t0, 0], [t0 + .15, 10, "io"], [t0 + .3, -10, "io"], [t1, 0]]); };
  glow(DR - .05, DR + 1.8, 915, 1545); glow(DL - .05, DL + 1.85, 915, 1545); glow(DRT - .05, DRT + 1.9, 915, 1545);

  // ---- weather app widget
  const app = E.el(S.el, "abs", "left:110px;top:455px;width:860px;height:190px;background:rgba(255,255,255,.96);border-radius:38px;box-shadow:0 12px 28px rgba(0,0,0,.3);z-index:12;display:flex;align-items:center;padding:0 34px;box-sizing:border-box;gap:26px;opacity:0");
  const ic = E.el(app, "", "font-size:110px;line-height:1", ""); const tx = E.el(app, "", `font-weight:900;color:${C.ink};line-height:1.05`, "");
  const APPS = [[P0, OZ + .4, "☀️", "WEATHER · TODAY", "0% chance of rain"], [P2, DL - .2, "🌤️", "WEATHER · TODAY", "2% chance of rain"], [P9, DRT - .2, "🌧️", "WEATHER · TODAY", "90% chance of rain"]];
  show(app, APPS.map(([a, b]) => [a, b]));
  E.F(t => { const a = APPS.filter(x => t >= x[0]).pop(); if (!a) return; const h = `<div style="font-size:30px;color:#7a8791">${a[3]}</div><div style="font-size:54px">${a[4]}</div>`; if (tx.innerHTML !== h) { tx.innerHTML = h; ic.textContent = a[2]; } });
  APPS.forEach(([a]) => E.pop(app, a, { from: .4, dur: .3 }));
  const lab = E.el(S.el, "abs", "left:40px;top:690px;background:rgba(29,43,54,.85);color:#fff;font-weight:900;font-size:30px;padding:6px 14px;border-radius:10px;z-index:8", "");
  E.F(t => { const d = DAYS.find(([a, b]) => t >= a && t < b); const s = "📅 " + d[3]; if (lab.textContent !== s) lab.textContent = s; });

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "KNEE: 0 · APP: 0"], [RAIN1 + .4, "KNEE: 1 · APP: 0"], [RAIN2 + .4, "KNEE: 2 · APP: 0"], [DRT + .4, "KNEE: 3 · APP: 0"], [DJ + 1.2, "KNEE: 4 · APP: 0"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= RAIN1 + .4 ? C.coralD : C.ink; });
  PL.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const sub = en => `<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:3px">${en}</div>`;
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const OB = (h, t0, t1, fs = 46, w = 500, top = 840) => bubble(h, 40, top, w, w - 140, t0, t1, fs);
  const DB = (h, t0, t1, fs = 46, w = 440, top = 830) => bubble(h, 560, top, w, 180, t0, t1, fs);
  OB("Zero percent rain! Let's go!", OZ, DR - .05, 50);
  DB("My knee says rain.", DR, RAIN1 + .1, 52);
  DB("Left knee. Rain.", DL, RAIN2 - .05, 54, 400);
  DB("Right knee says sun.", DRT, OH - .05, 52);
  OB("I'm not hungry, grandma.", OH, DJ - .05, 48, 480, 880);
  DB(`Os meus joelhos nunca mentem. Senta-te.${sub("(My knees never lie. Sit.)")}`, DJ, STAMP + .3, 40, 480, 780);
  const sb = E.el(S.el, "abs", "left:30px;top:600px;width:1020px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "KNEE 4 · APP 0.", STAMP, { size: 96, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/crowd-murmur.wav", { vol: .18, duck: false, to: DUR });
  E.clip(P0, "voices/ep108/p_zero.wav", { vol: 1.1 }); E.clip(OZ, "voices/ep108/o_zero.wav", { vol: 1.2 });
  E.clip(DR, "voices/ep108/d_rain.wav", { vol: 1.35 }); E.clip(DR, "sfx/elx-knee-creak.wav", { vol: 2.2, to: 1.4 });
  RAINS.forEach(([a, b]) => { E.clip(a - .1, "sfx/thunder.wav", { vol: .7 }); E.clip(a, "sfx/rain-heavy.wav", { vol: .6, duck: false, to: b - a + .9 }); });
  E.S(D2, "whoosh", .4); E.clip(P2, "voices/ep108/p_two.wav", { vol: 1.1 });
  E.clip(DL, "voices/ep108/d_left.wav", { vol: 1.35 }); E.clip(DL, "sfx/elx-knee-creak.wav", { vol: 2.2, to: 1.4 });
  E.S(D3, "whoosh", .4); E.clip(P9, "voices/ep108/p_ninety.wav", { vol: 1.1 });
  E.clip(DRT, "voices/ep108/d_right.wav", { vol: 1.35 }); E.clip(DRT, "sfx/elx-knee-creak.wav", { vol: 2.2, to: 1.4 }); E.S(DRT + .2, "sparkle", .5);
  E.clip(OH, "voices/ep108/o_hungry.wav", { vol: 1.2 });
  E.clip(DJ, "voices/ep108/d_joelhos.wav", { vol: 1.35 }); E.clip(DJ, "sfx/elx-knee-creak.wav", { vol: 2.2, to: 1.4 });
  E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Grandma's *knee* vs the weather app", { size: 42, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[27.3, 1], [27.55, 1.18, "out"], [27.85, 1, "io"]]);
}
