// EP.51 "Buying a used car in Portugal" — a car lot with bunting. A slick salesman presents a battered 2008 hatchback: "Só 290 mil
// quilómetros!" (only 290,000 km!) "9.500 euros. Uma pechincha!" (a bargain!). Otto inspects it: the door falls off, a hubcap rolls
// away, pigeons fly out of the window. "…Pronto. 9.400." Otto checks his phone: the same car back home. The hubcap rolls back and
// bonks his foot. Voiced (the salesman in Portuguese with subtitles) + clunks, pigeons. Paced per the skit guide.
export const meta = {
  id: "ep51-usedcar", date: "2026-11-13",
  images: {
    ex: "characters/cutouts/otto-casual_excited.webp", awk: "characters/cutouts/otto-casual_awkward.webp", ph: "characters/cutouts/otto-phone_shocked.webp",
    sp: "characters/cutouts/salesman_present.webp", sg: "characters/cutouts/salesman_pronto.webp",
    car: "characters/props/car_old.webp", car2: "characters/props/car_old-nodoor.webp", pig: "characters/props/pigeon.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 57, seed: 511, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 17.4, FLOOR = 1600, KM = 1.0, PRICE = 3.3, DOOR = 6.2, CAP = 7.2, PIG = 8.2, PRONTO = 9.6, PHONE = 12.0, BONK = 15.0;
  const S = E.scene("lot", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  // ---------------- the car lot ----------------
  E.el(S.el, "abs", "inset:0;background:linear-gradient(180deg,#8fd0f5,#dff2fb)");
  E.el(S.el, "abs", "left:0;top:900px;width:1080px;height:260px;background:#e7dcc6");
  const sign = E.el(S.el, "abs", "left:540px;top:760px;width:480px;height:140px;background:#e5484d;border:8px solid #fff;border-radius:14px;box-shadow:0 8px 16px rgba(0,0,0,.2);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-weight:900");
  E.el(sign, "", "font-size:56px;line-height:1", "STAND AUTO");
  E.el(sign, "", "font-size:26px;color:#ffe29a", "★ OPORTUNIDADES ★");
  const flags = ["#e5484d", "#f2b632", "#2f9e6f", "#2f6db5", "#f4f4f4"];
  for (let i = 0; i < 14; i++) E.el(S.el, "abs", `left:${i * 78}px;top:${690 + Math.sin(i / 13 * Math.PI) * 40}px;width:0;height:0;border-left:28px solid transparent;border-right:28px solid transparent;border-top:50px solid ${flags[i % 5]}`);
  E.el(S.el, "abs", `left:0;top:1150px;width:1080px;height:${1920 - 1150}px;background:#8a8f95`);
  for (let i = 0; i < 6; i++) E.el(S.el, "abs", `left:${i * 200 - 40}px;top:1640px;width:120px;height:18px;background:#f4f4f4;opacity:.85`);
  // a second, shinier car in the background, for contrast
  const bg = E.el(S.el, "abs", "left:-60px;top:1040px;width:360px;height:130px;border-radius:60px 80px 18px 18px;background:#35a0d0;opacity:.8");
  E.el(bg, "abs", "left:40px;top:96px;width:60px;height:60px;border-radius:50%;background:#333"); E.el(bg, "abs", "left:250px;top:96px;width:60px;height:60px;border-radius:50%;background:#333");

  // ---------------- the car ----------------
  const CW = 1056 * .72, CH = 504 * .72, carEl = E.el(S.el, "abs", `left:${540 - CW / 2}px;top:${FLOOR + 40 - CH}px;width:${CW}px;height:${CH}px;z-index:2;transform-origin:50% 100%`);
  const c1 = E.img(carEl, "car", `position:absolute;left:0;top:0;width:${CW}px;height:${CH}px`);
  const c2 = E.img(carEl, "car2", `position:absolute;left:0;top:0;width:${CW}px;height:${CH}px;opacity:0`);
  E.F(t => { const d = t >= DOOR; c1.style.opacity = d ? 0 : 1; c2.style.opacity = d ? 1 : 0; });
  E.K(carEl, "sy", [[DOOR - .01, 1], [DOOR, .96], [DOOR + .25, 1, "out"]]);
  E.K(carEl, "r", [[CAP - .01, 0], [CAP, -1.2], [CAP + .3, 0, "out"]]);
  // price card on the windscreen
  const price = E.el(S.el, "abs", `left:${540 - CW / 2 + CW * .5}px;top:${FLOOR + 40 - CH + CH * .06}px;width:210px;background:#fff;border:5px solid #e5484d;border-radius:10px;text-align:center;z-index:3;opacity:0;padding:4px 0`);
  const pv = E.el(price, "", "font-weight:900;font-size:46px;color:#e5484d;line-height:1.05", "€9.500");
  E.el(price, "", "font-weight:800;font-size:22px;color:#1d2b36", "2008 · 290.000 km");
  E.pop(price, PRICE + .2, { from: .3, dur: .3 });
  E.F(t => { const s = t >= PRONTO + 1.0 ? "€9.400" : "€9.500"; if (pv.textContent !== s) pv.textContent = s; });
  E.K(price, "r", [[PRONTO + .99, 0], [PRONTO + 1.0, -8], [PRONTO + 1.3, 0, "out"]]);
  // hubcap: rolls away (and comes back later)
  const hub = E.el(S.el, "abs", `left:${540 - CW / 2 + CW * .12}px;top:${FLOOR + 40 - 100}px;width:92px;height:92px;border-radius:50%;background:radial-gradient(circle,#e9eef2 0 22%,#aeb8c2 23% 40%,#dfe6ec 41% 62%,#8a95a0 63%);z-index:7;opacity:0`);
  E.K(hub, "o", [[CAP - .01, 0], [CAP, 1]]);
  E.K(hub, "x", [[CAP, 0], [CAP + 1.4, -700, "in"], [BONK - 1.21, -700], [BONK - 1.2, 1400], [BONK, 60, "out"], [BONK + .4, 40]]);
  E.K(hub, "r", [[CAP, 0], [CAP + 1.4, -720], [BONK - 1.21, -720], [BONK - 1.2, 720], [BONK, -540, "out"]]);
  E.K(hub, "y", [[BONK, 0], [BONK + .15, -60, "out"], [BONK + .4, 0, "in"]]);
  // pigeons out of the car
  [0, 1, 2].forEach(i => {
    const t = PIG + i * .18, p = E.el(S.el, "abs", `left:${540 - CW / 2 + CW * .55}px;top:${FLOOR + 40 - CH + CH * .2}px;width:${244 * .5}px;height:${238 * .5}px;z-index:5;opacity:0`);
    E.img(p, "pig", `width:${244 * .5}px;height:${238 * .5}px`);
    E.K(p, "o", [[t - .01, 0], [t, 1], [t + 1.6, 1], [t + 1.8, 0]]);
    E.K(p, "y", [[t, 0], [t + 1.6, -700 - i * 80, "out"]]); E.K(p, "x", [[t, 0], [t + 1.6, (i - 1) * 260 + 120]]); E.K(p, "r", [[t, 0], [t + .3, -12, "io"], [t + .6, 12, "io"], [t + .9, -12, "io"], [t + 1.2, 12, "io"]]);
  });
  const feathers = [0, 1, 2, 3].map(i => E.el(S.el, "abs", `left:${680 + i * 30}px;top:1300px;width:30px;height:12px;border-radius:50%;background:#b8c1c9;z-index:5;opacity:0`));
  E.F(t => feathers.forEach((f, i) => { const u = (t - PIG) / 2; f.style.opacity = u > 0 && u < 1 ? 1 - u : 0; f.style.transform = `translate(${Math.sin(u * 8 + i) * 40}px,${u * 220}px) rotate(${u * 300}deg)`; }));

  // ---------------- people ----------------
  const OS = .62, ot = E.el(S.el, "abs", `left:-40px;top:0;width:1px;height:${FLOOR + 160}px;z-index:6`);
  const OF = { ex: [625, 1078], awk: [488, 1078], ph: [424, 1068] };
  const oIm = Object.entries(OF).map(([n, [w, h]]) => [n, E.img(ot, n, `position:absolute;left:${(625 - w) * OS / 2}px;top:${FLOOR + 160 - h * OS}px;width:${w * OS}px;height:${h * OS}px;opacity:0`)]);
  E.F(t => { const f = at([[0, "ex"], [DOOR, "awk"], [PHONE, "ph"]], t); oIm.forEach(([n, el]) => { el.style.opacity = n === f ? 1 : 0; }); });
  const ob = []; for (let t = 0; t < DOOR; t += .8) ob.push([t, 0, "io"], [t + .4, -8, "io"]);
  E.K(ot, "y", [...ob, [BONK + .05, 0], [BONK + .15, -30, "out"], [BONK + .35, 0, "in"]]);                          // frame-0 motion, then the bonk
  E.K(ot, "x", [[DOOR - .6, 0], [DOOR - .2, 120, "out"], [DOOR + .3, 0, "io"]]);
  const SS = .62, sm = E.el(S.el, "abs", `left:810px;top:0;width:1px;height:${FLOOR + 170}px;z-index:6`);
  const s1 = E.img(sm, "sp", `position:absolute;left:0;top:${FLOOR + 170 - 1066 * SS}px;width:${635 * SS}px;height:${1066 * SS}px`);
  const s2 = E.img(sm, "sg", `position:absolute;left:0;top:${FLOOR + 170 - 1066 * SS}px;width:${635 * SS}px;height:${1066 * SS}px;opacity:0`);
  E.F(t => { const g = t >= PRONTO - .1; s1.style.opacity = g ? 0 : 1; s2.style.opacity = g ? 1 : 0; });
  const sbob = []; for (let t = 0; t < DUR; t += 1.2) sbob.push([t, 0, "io"], [t + .6, -6, "io"]);
  E.K(sm, "y", sbob);
  // the phone: the same car back home
  const pc = E.el(S.el, "abs", "left:140px;top:460px;width:420px;background:#fff;border-radius:26px;border:10px solid #1d2b36;box-shadow:0 14px 30px rgba(0,0,0,.25);padding:18px;box-sizing:border-box;z-index:8;opacity:0");
  E.el(pc, "", "font-weight:800;font-size:26px;color:#7a8791", "Same car, back home:");
  E.el(pc, "", "font-weight:900;font-size:76px;color:#1f7a3a;line-height:1.1", "€1.900");
  E.el(pc, "", "font-weight:800;font-size:24px;color:#7a8791", "2008 · 290,000 km · with door");
  E.pop(pc, PHONE + .3, { from: .3, dur: .3 }); E.K(pc, "o", [[PHONE + .3, 0], [PHONE + .4, 1], [BONK - .3, 1], [BONK - .1, 0]]);

  // ---------------- bubbles, stamp ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 54) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:9;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:32px;padding:18px 26px 22px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble(`Só 290 mil quilómetros!${sub("(Only 290,000 km!)")}`, 420, 470, 620, 440, KM, PRICE - .1, 48);
  bubble(`9.500 euros. Uma pechincha!${sub("(A bargain!)")}`, 420, 470, 620, 440, PRICE, DOOR - .3, 48);
  bubble(`…Pronto. 9.400.${sub("(Fine. 9,400.)")}`, 460, 470, 560, 400, PRONTO, PHONE - .1, 52);
  const sb = E.el(S.el, "abs", "left:60px;top:640px;width:960px;display:flex;justify-content:center;z-index:10");
  const st = E.stamp(sb, "UMA PECHINCHA.", BONK + .6, { size: 100, rot: -6, bg: C.coralD, shake: 12 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  E.clip(0, "sfx/street-sunny.wav", { vol: 2.5, duck: false }); E.clip(4.9, "sfx/street-sunny.wav", { vol: 2.5, duck: false }); E.clip(9.8, "sfx/street-sunny.wav", { vol: 2.5, duck: false }); E.clip(14.7, "sfx/street-sunny.wav", { vol: 2.5, duck: false, to: DUR - 14.7 });
  E.clip(KM, "voices/ep51/s_km.wav", { vol: 1.15 });
  E.clip(PRICE, "voices/ep51/s_price.wav", { vol: 1.15 }); E.S(PRICE + .2, "ding", .5);
  E.S(DOOR - .2, "tick", .6); E.clip(DOOR, "sfx/car-door-fall.wav", { vol: .9 }); E.shake(DOOR + .05, 12);
  E.clip(CAP, "sfx/hubcap-roll.wav", { vol: 1.0 });
  E.clip(PIG - .1, "sfx/pigeon-flutter.wav", { vol: .9 });
  E.clip(PRONTO, "voices/ep51/s_pronto.wav", { vol: 1.15 });
  E.S(PHONE + .3, "pop", .6);
  E.clip(BONK - 1.2, "sfx/hubcap-roll.wav", { vol: .8, to: 1.3 }); E.clip(BONK, "sfx/bonk.wav", { vol: 4 });

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "Buying a *used car* in Portugal", { size: 50, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[16.6, 1], [16.85, 1.18, "out"], [17.2, 1, "io"]]);
}
