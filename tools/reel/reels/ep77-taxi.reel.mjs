// EP.77 "Taking a taxi in Lisbon" — split screen: the ride outside (top), the two of them inside (bottom). Buck: "Hi! Rua Augusta,
// please!" The driver, calm: "Relax, my friend! I know these streets!" — and floors it. A tram head-on (he is eating a bifana), down a
// staircase (he takes a call from his mother: "Sim, mãe… o jantar às oito."), then he turns round to play tour guide: "Look! Tourist
// view! Beautiful, no?" "EYES ON THE ROAD!" Screech. "Here we are! Six euros fifty." Buck kisses the pavement… and the little old lady
// with the shopping trolley who was at the taxi stand is already there: "Bom dia!"
export const meta = {
  id: "ep77-taxi", date: "2026-12-09",
  images: {
    st: "characters/scenes/bg_lisbon.webp", taxi: "characters/props/taxi-lisbon.webp", tram: "characters/props/tram28.webp", pig: "characters/props/pigeon.webp",
    dc: "characters/cutouts/driver_calm.webp", dbf: "characters/cutouts/driver_bifana.webp", dph: "characters/cutouts/driver_phone.webp", dpt: "characters/cutouts/driver_point.webp",
    bc: "characters/cutouts/buck-taxi_calm.webp", bsc: "characters/cutouts/buck-taxi_scream.webp", bk: "characters/cutouts/buck_kiss.webp", old: "characters/cutouts/oldlady_trolley.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 132, root: 57, seed: 777, prog: [[0, 3, 7], [5, 8, 12], [7, 10, 14], [3, 7, 10]] });
  const DUR = 21.0, Q = .4, RELAX = 2.45, GO = 3.3, TRAM = 5.5, STAIRS = 7.6, MAE = 7.9, VIEW = 11.0, EYES = 13.8, STOP = 15.5,
    ARR = 15.9, BOM = 18.3;
  const S = E.scene("taxi", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  E.el(S.el, "abs", "inset:0;background:#1d2b36");

  // ================= outside (top panel) =================
  const PT = 420, PH = 600, TW = Math.round(1344 * PH / 752);
  const O = E.el(S.el, "abs", `left:0;top:${PT}px;width:1080px;height:${PH}px;overflow:hidden;background:#8fd0f5`);
  const strip = E.el(O, "abs", `left:0;top:0;width:${TW * 4}px;height:${PH}px`);
  for (let i = 0; i < 4; i++) E.img(strip, "st", `position:absolute;left:${i * TW}px;top:0;width:${TW}px;height:${PH}px;${i % 2 ? "transform:scaleX(-1)" : ""}`);
  // distance travelled: 0 at the stand, 1900 px/s on the move, braking at STOP
  const V = 1900, pos = t => t < GO ? 0 : t < STOP ? (t - GO) * V : (STOP - GO) * V + Math.min(t - STOP, .5) * V * (1 - Math.min(t - STOP, .5));
  E.F(t => { strip.style.transform = `translateX(${-(pos(t) % (TW * 2))}px)`; });
  // the stone stairs replace the road while they bump down
  const steps = E.el(O, "abs", `left:0;top:${PH - 120}px;width:1080px;height:120px;background:repeating-linear-gradient(90deg,#d8cfbd 0 90px,#b9ae98 90px 100px);opacity:0`);
  show(steps, [[STAIRS, VIEW]]);
  const oldA = E.el(O, "abs", "left:760px;top:0;width:1px;height:1px");
  E.img(oldA, "old", `position:absolute;left:0;top:${PH - 20 - 966 * .36}px;width:${729 * .36}px;height:${966 * .36}px`);
  E.F(t => { oldA.style.transform = `translateX(${-pos(t) + t * 12}px)`; });
  // the taxi
  const car = E.el(O, "abs", `left:250px;top:${PH - 30 - 497 * .46}px;width:${1262 * .46}px;height:${497 * .46}px;transform-origin:70% 100%;z-index:3`);
  E.img(car, "taxi", `width:${1262 * .46}px;height:${497 * .46}px`);
  const bump = [];
  for (let t = GO; t < STOP; t += .12) if ((t < TRAM + .2 || t > TRAM + 1.7) && (t < STAIRS || t >= VIEW)) bump.push([t, (Math.round(t * 8) % 2) ? -4 : 2]);
  for (let t = STAIRS; t < VIEW; t += .22) bump.push([t, -26, "out"], [t + .11, 4, "in"]);
  bump.push([TRAM + .2, 0], [TRAM + .45, -80, "out"], [TRAM + 1.4, -80], [TRAM + 1.65, 0, "in"], [STOP + .5, 0]);
  E.K(car, "y", bump.sort((x, y) => x[0] - y[0]));                                                  // hops onto the pavement for the tram
  E.K(car, "r", [[GO - .01, 0], [GO + .15, -4, "out"], [GO + .5, 0], [STAIRS - .01, 0], [STAIRS + .2, 9, "out"], [VIEW - .2, 9], [VIEW, 0, "io"], [STOP, 0], [STOP + .15, 5, "out"], [STOP + .45, 0, "io"]]);
  // speed lines
  const lines = E.el(O, "abs", "inset:0;pointer-events:none");
  for (let i = 0; i < 7; i++) E.el(lines, "abs", `left:${(i * 173) % 1000}px;top:${120 + i * 60}px;width:${160 + (i % 3) * 60}px;height:6px;border-radius:3px;background:rgba(255,255,255,.7)`);
  show(lines, [[GO, STOP]]); E.F(t => { lines.style.transform = `translateX(${-((t * 3000) % 1200) + 600}px)`; });
  // the tram, head-on (flipped to face left)
  const tram = E.el(O, "abs", `left:0;top:${PH - 20 - 675 * .6}px;width:${1033 * .6}px;height:${675 * .6}px;transform:scaleX(-1)`);
  E.img(tram, "tram", `width:${1033 * .6}px;height:${675 * .6}px`);
  const tw = E.el(O, "abs", "left:0;top:0;width:1px;height:1px;z-index:2"); tw.appendChild(tram);
  E.K(tw, "x", [[TRAM, 1150], [TRAM + 1.7, -800, "lin"]]);
  // pigeons scatter while he isn't looking
  const pigs = [0, 1, 2, 3].map(i => { const p = E.el(O, "abs", `left:${560 + i * 110}px;top:${PH - 120}px;width:110px;height:100px;opacity:0`); E.img(p, "pig", "width:110px;height:100px"); return p; });
  pigs.forEach((p, i) => { show(p, [[VIEW + .4, EYES + .8]]); E.K(p, "y", [[VIEW + .6 + i * .15, 0], [VIEW + 1.4 + i * .15, -480 - i * 60, "out"]]); E.K(p, "x", [[VIEW + .6 + i * .15, 0], [VIEW + 1.4 + i * .15, -200 + i * 120, "out"]]); });
  // a one-way sign pointing the other way
  const sign = E.el(O, "abs", `left:0;top:60px;width:230px;height:80px;background:#2f6db5;border:6px solid #fff;border-radius:10px;color:#fff;font-weight:900;font-size:70px;display:flex;align-items:center;justify-content:center;opacity:0`, "←");
  E.F(t => { const x = 1100 - (t - TRAM + .6) * 900; sign.style.transform = `translateX(${x}px)`; sign.style.opacity = t > TRAM - .6 && t < TRAM + 1.8 ? 1 : 0; });

  // ================= inside (bottom panel) =================
  const IT = 1030;
  const I = E.el(S.el, "abs", `left:0;top:${IT}px;width:1080px;height:${1920 - IT}px;overflow:hidden;background:#3a3f46`);
  E.K(I, "o", [[ARR - .01, 1], [ARR, 0]]);
  const win = E.el(I, "abs", "left:40px;top:40px;width:1000px;height:330px;border-radius:40px 40px 10px 10px;background:#9fd6f2;overflow:hidden;border:14px solid #22262c;box-sizing:border-box");
  const blur = E.el(win, "abs", "left:0;top:0;width:3000px;height:100%;background:repeating-linear-gradient(90deg,#f5c9a8 0 140px,#ffe29a 140px 260px,#bfe0d6 260px 400px,#f7b7b7 400px 520px);opacity:.85");
  E.F(t => { blur.style.transform = `translateX(${-(pos(t) * .8 % 1040)}px)`; blur.style.filter = t > GO && t < STOP ? "blur(6px)" : "none"; });
  E.el(I, "abs", "left:0;top:560px;width:1080px;height:400px;background:#2b2f36");
  const SC = .6, shake = E.el(I, "abs", "inset:0");
  const sh = []; for (let t = GO; t < STOP; t += .1) sh.push([t, (Math.round(t * 10) % 2) ? 5 : -5]); for (let t = STAIRS; t < VIEW; t += .22) sh.push([t + .01, -18], [t + .12, 6]); sh.push([STOP + .1, 0]);
  E.K(shake, "y", sh.sort((a, b) => a[0] - b[0]));
  const bw = E.el(shake, "abs", "left:-30px;top:0;width:1px;height:1px");
  const b1 = E.img(bw, "bc", `position:absolute;left:0;top:${890 - 991 * SC}px;width:${885 * SC}px;height:${991 * SC}px`);
  const b2 = E.img(bw, "bsc", `position:absolute;left:30px;top:${890 - 992 * SC}px;width:${784 * SC}px;height:${992 * SC}px;opacity:0`);
  E.F(t => { const s = t >= GO; b1.style.opacity = s ? 0 : 1; b2.style.opacity = s ? 1 : 0; });
  const dw = E.el(shake, "abs", "left:500px;top:0;width:1px;height:1px");
  const D = [["dc", 918, 899], ["dbf", 920, 900], ["dph", 929, 900], ["dpt", 958, 908]];
  const dimg = D.map(([n, w, h], i) => E.img(dw, n, `position:absolute;left:0;top:${890 - h * SC}px;width:${w * SC}px;height:${h * SC}px;opacity:${i ? 0 : 1}`));
  const DT = [[0, 0], [TRAM, 1], [STAIRS + .2, 2], [VIEW, 3], [EYES + .8, 0]];
  E.F(t => { const k = at(DT, t); dimg.forEach((im, i) => { im.style.opacity = i === k ? 1 : 0; }); });

  // ================= arrival (bottom panel, after the stop) =================
  const A = E.el(S.el, "abs", `left:0;top:${IT}px;width:1080px;height:${1920 - IT}px;overflow:hidden;opacity:0`);
  E.K(A, "o", [[ARR - .01, 0], [ARR, 1]]);
  const tile = `<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90'><rect width='90' height='90' fill='#f8f5ee'/><rect x='2' y='2' width='86' height='86' rx='4' fill='none' stroke='#c9d8ea' stroke-width='3'/><path d='M45 12 L78 45 L45 78 L12 45 Z' fill='none' stroke='#2f6db5' stroke-width='5'/><circle cx='45' cy='45' r='8' fill='#2f6db5'/></svg>`;
  E.el(A, "abs", `inset:0;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tile)}");background-size:90px 90px`);
  E.el(A, "abs", "left:540px;top:120px;width:360px;height:540px;background:#1f5a37;border:14px solid #f3d7a6;border-radius:180px 180px 0 0;box-sizing:border-box");
  E.el(A, "abs", "left:0;top:660px;width:1080px;height:300px;background:#d9d0bd");
  E.el(A, "abs", "left:500px;top:560px;width:460px;height:26px;background:#7a4a2a;border-radius:8px"); E.el(A, "abs", "left:530px;top:586px;width:20px;height:90px;background:#5a3a1a"); E.el(A, "abs", "left:910px;top:586px;width:20px;height:90px;background:#5a3a1a");
  const ol = E.el(A, "abs", `left:560px;top:${700 - 966 * .56}px;width:${729 * .56}px;height:${966 * .56}px`); E.img(ol, "old", `width:${729 * .56}px;height:${966 * .56}px`);
  E.K(ol, "r", [[BOM, 0], [BOM + .2, -3, "out"], [BOM + .5, 0, "io"]]);
  const bk = E.el(A, "abs", `left:20px;top:${860 - 436 * .62}px;width:${949 * .62}px;height:${436 * .62}px`); E.img(bk, "bk", `width:${949 * .62}px;height:${436 * .62}px`);
  E.K(bk, "x", [[ARR, -600], [ARR + .35, 0, "out"]]);
  E.K(bk, "y", [[ARR + .6, 0], [ARR + .9, -8, "io"], [ARR + 1.2, 0, "io"], [ARR + 1.5, -8, "io"], [ARR + 1.8, 0, "io"]]);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "TAXI STAND · 10:00"], [GO, "SPEED: 90 KM/H"], [TRAM, "SPEED: 110 KM/H"], [STAIRS, "ROUTE: STAIRS"], [VIEW, "EYES ON THE ROAD: 0%"], [STOP, "ARRIVED · 10:02"], [BOM, "SHE WALKED · 10:02"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= GO && t < STOP || t >= BOM ? C.coralD : C.ink; });
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
  bubble("Hi! Rua Augusta, please!", 40, 1150, 520, 150, Q, RELAX - .05, 48);
  bubble("Relax, my friend! I know these streets!", 430, 1110, 620, 380, RELAX, TRAM - .05, 44);
  bubble("AAAAAAH!", 40, 1150, 420, 180, TRAM + .4, STAIRS, 60);
  bubble(`Sim, mãe… sim… o jantar às oito.${sub("(Yes, Mum… yes… dinner at eight.)")}`, 380, 1090, 670, 420, MAE, VIEW - .05, 42);
  bubble("Look! Tourist view! Beautiful, no?", 420, 1110, 620, 260, VIEW, EYES - .05, 44);
  bubble("EYES ON THE ROAD!", 40, 1150, 520, 170, EYES, STOP - .05, 52);
  bubble("Here we are! Six euros fifty.", 400, 600, 600, 340, ARR - .1, BOM - .05, 46);
  bubble("Bom dia!", 560, 1180, 320, 170, BOM, DUR - .4, 60);
  const sb = E.el(S.el, "abs", "left:60px;top:1000px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "SHE WALKED.", BOM + 1.0, { size: 116, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/street-sunny.wav", { vol: 1.2, duck: false, to: GO });
  E.clip(Q, "voices/ep77/b_rua.wav", { vol: 1.2 });
  E.clip(RELAX, "voices/ep77/d_relax.wav", { vol: 1.25 });
  E.clip(GO - .3, "sfx/car-rev-short.wav", { vol: 1.0 }); E.clip(GO, "sfx/car-speed.wav", { vol: .8, duck: false });
  E.clip(TRAM, "sfx/horn-beep.wav", { vol: .9 }); E.clip(TRAM + .1, "sfx/tram-pass.wav", { vol: 1.1, to: 2, duck: false }); E.clip(TRAM + .4, "voices/ep77/b_scream.wav", { vol: 1.2 });
  E.clip(STAIRS, "sfx/car-stairs.wav", { vol: 1.0, duck: false }); E.clip(STAIRS + 1.8, "sfx/car-stairs.wav", { vol: .8, duck: false });
  E.clip(MAE, "voices/ep77/d_mae.wav", { vol: 1.3 });
  E.clip(VIEW, "voices/ep77/d_view.wav", { vol: 1.25 }); E.clip(VIEW + .6, "sfx/pigeon-flutter.wav", { vol: .8 });
  E.clip(EYES, "voices/ep77/b_eyes.wav", { vol: 1.2 });
  E.clip(STOP - .05, "sfx/tire-screech.wav", { vol: 1.0 });
  E.clip(ARR - .1, "voices/ep77/d_arrive.wav", { vol: 1.25 }); E.S(ARR + .3, "thud", .5);
  E.clip(BOM, "voices/ep77/l_bomdia.wav", { vol: 1.3 }); E.S(BOM + .9, "scratch", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Taking a taxi in *Lisbon*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[20.2, 1], [20.45, 1.18, "out"], [20.8, 1, "io"]]);
}
