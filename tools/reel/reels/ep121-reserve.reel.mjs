// EP.121 "Grandpa and the fuel light" — a country road. The fuel light comes on. Otto: "Grandpa, the fuel light is on." Grandpa, waving it off: "Calma. Ainda dá!" (Relax, there's still enough!)
// A petrol station: "There's a station!" "Too expensive. Two cents more." Another: "Grandpa, another one!" "That one is for tourists." The range hits 0 km: "It says zero kilometres!" "Zero is a number."
// The engine coughs and dies. "Ah. Small push." Otto pushes the car into the station while Grandpa steers with one hand, whistling: "You see? We made it." At the pump: "Dez euros, por favor." (Ten euros,
// please.) Otto: "…Ten?!" Grandpa: "Ainda dá." Stamp: RESERVE: A LIFESTYLE. (Prices are jokes.)
export const meta = {
  id: "ep121-reserve", date: "2027-01-22",
  images: {
    road: "characters/scenes/bg_road.webp", station: "characters/scenes/bg_station.webp",
    c1: "characters/cutouts/car-avo_smug.webp", c2: "characters/cutouts/car-avo_wave.webp", c3: "characters/cutouts/car-avo_smoke.webp", push: "characters/cutouts/car-avo_push.webp",
    pump: "characters/cutouts/avo_pump.webp", ot: "characters/cutouts/otto-casual_jawdrop.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 50, seed: 1211, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [2, 5, 9]] });
  const DUR = 28.8, LIGHT = .3, AINDA = 2.5, ST1 = 4.8, EXP = 5.85, ST2 = 8.5, TOUR = 9.85, ZERO = 11.85, ZNUM = 13.6, DIE = 15.4, PUSHL = 17.2, PUSH = 18.3, MADE = 21.4, PUMP = 23.3, DEZ = 23.5, TEN = 25.05, AINDA2 = 25.95, STAMP = 27.1;
  const S = E.scene("reserve", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };

  // ================= the road =================
  const G1 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G1, [[0, PUSH]]);
  E.img(G1, "road", BG);
  // road dashes rushing toward us (frame-0 motion), stopping when the engine dies
  const dash = []; for (let i = 0; i < 6; i++) dash.push(E.el(G1, "abs", "left:525px;top:0;width:30px;height:90px;background:#f4f1e8;border-radius:6px;z-index:1"));
  E.F(t => { const tt = Math.min(t, DIE + 1.2) - (t > DIE ? (t - DIE) * .5 : 0); dash.forEach((d, i) => { const k = ((tt * .55 + i / 6) % 1); const y = 1050 + k * k * 900, s = .3 + k * 1.6; d.style.transform = `translateY(${y}px) scale(${s},${s})`; d.style.opacity = k > .05 ? 1 : 0; }); });
  // roadside petrol-station signs flying past
  const sign = (t0, price, tag) => {                                                                       // a station sign slides past, over the dashboard
    const el = E.el(S.el, "abs", "left:330px;top:450px;width:420px;height:400px;z-index:10;opacity:0");
    E.el(el, "abs", "left:190px;top:260px;width:40px;height:140px;background:#555;border-radius:4px");
    const b = E.el(el, "abs", "left:0;top:0;width:420px;height:270px;background:#c73a2f;border-radius:24px;border:8px solid #fff;box-shadow:0 12px 26px rgba(0,0,0,.4);text-align:center");
    E.el(b, "abs", "left:0;top:14px;width:404px;font-size:84px", "⛽");
    E.el(b, "abs", "left:0;top:130px;width:404px;font-weight:900;font-size:96px;color:#fff", price);
    show(el, [[t0, t0 + 3.4]]);
    E.K(el, "x", [[t0, 760], [t0 + .45, 0, "out"], [t0 + 2.9, -40, "lin"], [t0 + 3.4, -1000, "in"]]);
  };
  const car = E.el(G1, "abs", "left:0;top:960px;width:1080px;height:814px;z-index:5;transform-origin:50% 100%");
  const CA = ["c1", "c2", "c3"].map(n => E.img(car, n, "position:absolute;left:0;top:0;width:1080px;height:814px;opacity:0"));
  E.F(t => { const k = t < AINDA ? 0 : t < ST1 ? 1 : t < EXP ? 0 : t < ST2 ? 1 : t < TOUR ? 0 : t < ZERO ? 1 : t < DIE ? 0 : 2; CA.forEach((c, i) => { c.style.opacity = i === k ? 1 : 0; }); });
  const cb = []; for (let t = 0; t < DIE; t += .3) cb.push([t, 0, "io"], [t + .15, -6, "io"]); E.K(car, "y", cb);
  const cs = []; for (let t = DIE; t < DIE + 1.6; t += .12) cs.push([t, (Math.round(t / .12) % 2) ? 2.5 : -2.5, "io"]); E.K(car, "r", [[0, 0], ...cs, [DIE + 1.7, 0]]);

  // ---- the dashboard inset: gauge, reserve light, range
  const dsh = E.el(S.el, "abs", "left:110px;top:440px;width:860px;height:300px;background:#1b1f24;border-radius:150px 150px 40px 40px;z-index:9;box-shadow:0 14px 30px rgba(0,0,0,.5);border:8px solid #33383f;opacity:0");
  show(dsh, [[LIGHT - .1, ST1 - .25], [EXP + 2.3, ST2 - .25], [TOUR + 1.6, PUSH]]);
  sign(ST1 - .35, "€1,79", ""); sign(ST2 - .35, "€1,81", ""); E.pop(dsh, LIGHT - .1, { from: .5, dur: .3 });
  const g = E.el(dsh, "abs", "left:70px;top:40px;width:300px;height:300px;border-radius:50%;border:8px solid #555;clip-path:inset(0 0 50% 0)");
  E.el(dsh, "abs", "left:58px;top:160px;font-weight:900;font-size:40px;color:#e04a3a", "E"); E.el(dsh, "abs", "left:350px;top:160px;font-weight:900;font-size:40px;color:#fff", "F");
  const needle = E.el(dsh, "abs", "left:212px;top:60px;width:14px;height:140px;background:#ff6b3d;border-radius:7px;transform-origin:50% 100%");
  E.F(t => { const a = -78 - Math.min(1, t / ZERO) * 10 + (t > DIE ? -4 : 0); needle.style.transform = `rotate(${a}deg)`; });
  const lamp = E.el(dsh, "abs", "left:180px;top:200px;font-size:60px;filter:drop-shadow(0 0 12px #ffa000)", "⛽");
  E.F(t => { lamp.style.opacity = (Math.floor(t * 3) % 2) ? 1 : .25; });
  E.el(dsh, "abs", "left:440px;top:46px;width:360px;font-weight:900;font-size:34px;color:#ffb000;letter-spacing:2px", "AUTONOMIA");
  E.el(dsh, "abs", "left:440px;top:86px;width:360px;font-weight:800;font-size:26px;color:#9aa4ad", "(range)");
  const rng = E.el(dsh, "abs", "left:440px;top:130px;width:360px;font-weight:900;font-size:110px;color:#fff;line-height:1", "");
  const RNG = [[0, "50 km"], [ST1, "31 km"], [ST2, "12 km"], [ZERO - .3, "0 km"]];
  E.F(t => { const s = at(RNG, t); if (rng.textContent !== s) rng.textContent = s; rng.style.color = t >= ZERO - .3 ? "#ff4d3d" : "#fff"; });
  RNG.slice(1).forEach(([t]) => E.K(rng, "s", [[t - .01, 1], [t, 1.15], [t + .25, 1, "out"]]));
  E.el(dsh, "abs", "left:180px;top:270px;width:560px;height:1px", "");

  // ================= the push / the station =================
  const G2 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G2, [[PUSH, DUR]]);
  E.img(G2, "station", BG);
  const pu = fig(G2, "push", 1168, 845, .92, 560, 1860, 5); show(pu, [[PUSH, PUMP]]);
  E.K(pu, "x", [[PUSH, -760], [MADE, 0, "out"]]);
  const pj = []; for (let t = PUSH; t < MADE; t += .25) pj.push([t, 0, "io"], [t + .12, -5, "io"]); E.K(pu, "y", pj);
  const pm = fig(G2, "pump", 671, 997, .78, 690, 1840, 5); show(pm, [[PUMP, DUR]]); E.pop(pm, PUMP, { from: .9, dur: .25 }); bob(pm, PUMP, DUR, 4, .7);
  const ot = fig(G2, "ot", 398, 1044, .74, 190, 1850, 6); show(ot, [[PUMP, DUR]]); bob(ot, PUMP, DUR, 3, 1.0);
  // the pump display: €10,00
  const pd = E.el(G2, "abs", "left:600px;top:560px;width:420px;height:200px;background:#0d1a10;border-radius:18px;border:8px solid #c73a2f;z-index:7;opacity:0;text-align:center;box-shadow:0 10px 22px rgba(0,0,0,.4)");
  E.el(pd, "abs", "left:0;top:16px;width:420px;font-weight:900;font-size:32px;color:#7dff8a;letter-spacing:2px", "GASÓLEO · TOTAL");
  const pv = E.el(pd, "abs", "left:0;top:62px;width:420px;font-weight:900;font-size:100px;color:#7dff8a;font-family:monospace", "");
  show(pd, [[DEZ + 1.0, DUR]]);
  E.F(t => { const v = Math.min(10, Math.max(0, (t - DEZ - 1.0) * 6)); const s = "€" + v.toFixed(2).replace(".", ","); if (pv.textContent !== s) pv.textContent = s; });

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "FUEL: RESERVE"], [ST2 + 2, "STATIONS PASSED: 2"], [ZERO, "RANGE: 0 KM · GRANDPA: CALM"], [DIE, "ENGINE: GONE"], [PUSH, "ENGINE: OTTO"], [DEZ + 2.6, "FUEL BOUGHT: €10"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= LIGHT + 1 ? C.coralD : C.ink; pill.style.fontSize = s.length > 22 ? "42px" : "48px"; });
  PL.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const sub = en => `<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:3px">${en}</div>`;
  const bubble = (html, hx, top, w, t0, t1, fs = 48, z = 10) => {
    const tail = Math.max(50, Math.min(w - 90, w / 2)), left = Math.max(20, Math.min(1060 - w, hx - tail)), tl = hx - left - 22;
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:${z};transform-origin:${tl}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tl}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const OH = 380, AH = 690, TOPB = 820;                                                                 // Otto is the passenger (left), grandpa drives (right)
  bubble("Grandpa, the fuel light is on.", OH, TOPB, 520, LIGHT, AINDA - .1, 46);
  bubble(`Calma. Ainda dá!${sub("(Relax. There's still enough!)")}`, AH, TOPB, 520, AINDA, ST1 - .1, 50);
  bubble("There's a station!", OH, TOPB, 420, ST1, EXP - .1, 50);
  bubble("Too expensive. Two cents more.", AH, TOPB, 520, EXP, ST2 - .1, 46);
  bubble("Grandpa, another one!", OH, TOPB, 460, ST2, TOUR - .1, 48);
  bubble("That one is for tourists.", AH, TOPB, 500, TOUR, ZERO - .1, 48);
  bubble("It says zero kilometres!", OH, TOPB, 500, ZERO, ZNUM - .1, 48);
  bubble("Zero is a number.", AH, TOPB, 420, ZNUM, DIE - .1, 50);
  bubble("Ah. Small push.", AH, TOPB, 380, PUSHL, PUSH - .05, 52);
  bubble("You see? We made it.", 660, 1100, 460, MADE, PUMP - .1, 48);
  bubble(`Dez euros, por favor.${sub("(Ten euros, please.)")}`, 690, 920, 480, DEZ, TEN - .1, 48);
  bubble("…Ten?!", 190, 960, 280, TEN, AINDA2 - .05, 60);
  bubble(`Ainda dá.${sub("(Still enough.)")}`, 690, 920, 360, AINDA2, STAMP + .3, 56);
  E.stamp(E.el(S.el, "abs", "left:30px;top:800px;width:1020px;display:flex;justify-content:center;z-index:11"), "RESERVE: A LIFESTYLE.", STAMP, { size: 76, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(0, "sfx/elx-car-drive.wav", { vol: .35, duck: false, to: DIE + .3 });
  E.S(LIGHT - .1, "ding", .4); E.clip(LIGHT, "voices/ep121/o_light.wav", { vol: 1.25 }); E.clip(AINDA, "voices/ep121/a_ainda1.wav", { vol: 1.35 });
  E.clip(ST1, "voices/ep121/o_station.wav", { vol: 1.25 }); E.clip(EXP, "voices/ep121/a_expensive.wav", { vol: 1.35 });
  E.clip(ST2, "voices/ep121/o_another.wav", { vol: 1.25 }); E.clip(TOUR, "voices/ep121/a_tourists.wav", { vol: 1.35 });
  E.clip(ZERO, "voices/ep121/o_zero.wav", { vol: 1.25 }); E.clip(ZNUM, "voices/ep121/a_zero.wav", { vol: 1.35 });
  E.clip(DIE, "sfx/elx-engine-sputter.wav", { vol: 1.0, to: 2.0 }); E.clip(PUSHL, "voices/ep121/a_push.wav", { vol: 1.35 });
  E.S(PUSH, "whoosh", .4); E.clip(PUSH + .2, "sfx/panting.wav", { vol: .6, duck: false, to: MADE - PUSH });
  E.clip(MADE, "voices/ep121/a_made.wav", { vol: 1.35 });
  E.clip(DEZ, "voices/ep121/a_dez.wav", { vol: 1.35 }); E.clip(DEZ + .9, "sfx/elx-fuel-pump.wav", { vol: 1.0, to: 2.0 });
  E.clip(TEN, "voices/ep121/o_ten.wav", { vol: 1.3 }); E.clip(AINDA2, "voices/ep121/a_ainda2.wav", { vol: 1.35 }); E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Grandpa and the *fuel light*", { size: 50, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[28.0, 1], [28.25, 1.18, "out"], [28.55, 1, "io"]]);
}
