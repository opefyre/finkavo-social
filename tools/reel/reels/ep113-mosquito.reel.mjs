// EP.113 "One mosquito at 3 a.m." — Otto, awake in the dark, hand over his ear: "Okay. It's just one mosquito." The war: a slipper (he slaps himself: "Ow!"), an electric racket
// ("I will find you." — he zaps the lamp and the lights go out), a spray can. The neighbour bangs her broom on the wall: "Ó vizinho! São três da manhã!" (Hey neighbour! It's 3 a.m.!)
// 04:30, Otto exhausted and covered in bites. He gives up: "Fine. Take my arm. Just one. Be quick." The mosquito lands… and eleven friends arrive. "I meant ONE."
// Stamp: MOSQUITOES 12 · OTTO 0.
export const meta = {
  id: "ep113-mosquito", date: "2027-01-14",
  images: {
    bg: "characters/scenes/bg_bedroom.webp",
    l1: "characters/cutouts/otto-bed_awake-pj.webp", l2: "characters/cutouts/otto-bed_arm.webp",
    p1: "characters/cutouts/otto-pj_slipper.webp", p2: "characters/cutouts/otto-pj_racket.webp", p3: "characters/cutouts/otto-pj_bitten.webp",
    nb: "characters/cutouts/neighbour_broom.webp", mq: "characters/props/bug-mosquito.webp", sw: "characters/props/bug-swarm.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 45, seed: 1131, prog: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]] });
  const DUR = 22.4, JUST = .6, SLIP = 3.3, OW = 4.25, FIND = 5.4, ZAP = 6.45, OUT = 6.95, SPRAY = 7.6, KNOCK = 9.35, TRES = 9.5, BIT = 12.0, FINE = 13.4, LAND = 14.7, SWARM = 16.9, ONE = 17.55, STAMP = 19.5;
  const S = E.scene("mosq", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  E.img(S.el, "bg", BG);
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };

  // ---- Otto: in bed → standing with weapons → bitten → in bed, arm out
  const FL = 1860, CX = 320;
  const l1 = fig(S.el, "l1", 766, 746, .86, 540, 1600, 4), l2 = fig(S.el, "l2", 823, 742, .8, 560, 1600, 4);
  const p1 = fig(S.el, "p1", 670, 1024, .72, CX, FL, 4), p2 = fig(S.el, "p2", 663, 1009, .72, CX, FL, 4), p3 = fig(S.el, "p3", 620, 1012, .72, CX, FL, 4);
  E.F(t => { const k = t < SLIP ? 1 : t < FIND ? 3 : t < BIT ? 4 : t < FINE ? 5 : 2; [l1, l2, p1, p2, p3].forEach(o => { o.style.opacity = 0; });
    ({ 1: l1, 2: l2, 3: p1, 4: p2, 5: p3 })[k].style.opacity = 1; });
  bob(l1, 0, SLIP, 4, .7); bob(p1, SLIP, FIND, 10, .25); bob(p2, FIND, BIT, 7, .3); bob(p3, BIT, FINE, 4, .8); bob(l2, FINE, DUR, 3, .8);
  const sw1 = []; for (let t = SLIP; t < FIND; t += .3) sw1.push([t, (Math.round(t / .3) % 2) ? 6 : -6, "io"]); E.K(p1, "r", sw1);

  // ---- the mosquito (and later the gang)
  const MQ = (id, w) => { const el = E.el(S.el, "abs", `left:0;top:0;width:${w}px;height:${w * 327 / 288}px;z-index:9;opacity:0`); E.img(el, "mq", `width:${w}px;height:${w * 327 / 288}px`); return el; };
  const m0 = MQ(0, 130);
  show(m0, [[0, DUR]]);
  E.F(t => {
    let x, y, r = 0;
    if (t < LAND - .5) { const a = t * 3.1; x = 620 + Math.cos(a) * 270 + Math.sin(a * 2.3) * 80; y = 780 + Math.sin(a * 1.7) * 170 + Math.cos(a * 4) * 40; r = Math.cos(a) * 30; }
    else if (t < LAND) { const k = (t - (LAND - .5)) / .5, a = (LAND - .5) * 3.1; const x0 = 620 + Math.cos(a) * 270 + Math.sin(a * 2.3) * 80, y0 = 780 + Math.sin(a * 1.7) * 170 + Math.cos(a * 4) * 40; x = x0 + (250 - x0) * k; y = y0 + (1170 - y0) * k; r = -20 * k; }
    else { x = 250; y = 1170 + Math.sin(t * 20) * 3; r = -20; }
    m0.style.transform = `translate(${x}px,${y}px) rotate(${r}deg)`;
  });
  const gang = [];
  for (let i = 0; i < 11; i++) { const g = MQ(i + 1, 92 + (i % 3) * 14); const sx = i % 2 ? 1180 : -200, sy = 500 + (i * 137) % 900, tx = 170 + (i % 4) * 70 + (i > 7 ? 200 : 0), ty = 1120 + (i % 3) * 60; gang.push([g, sx, sy, tx, ty, SWARM + i * .07]); }
  E.F(t => { gang.forEach(([g, sx, sy, tx, ty, t0]) => { if (t < t0) { g.style.opacity = 0; return; } g.style.opacity = 1; const k = Math.min(1, (t - t0) / .9), e = 1 - Math.pow(1 - k, 2); const wig = k < 1 ? Math.sin(t * 30) * 25 * (1 - k) : Math.sin(t * 25) * 3; g.style.transform = `translate(${sx + (tx - sx) * e}px,${sy + (ty - sy) * e + wig}px) rotate(${k < 1 ? Math.sin(t * 9) * 30 : -15}deg)`; }); });

  // ---- impact effects
  const emo = (txt, x, y, t0, t1, fs = 110) => { const el = E.el(S.el, "abs", `left:${x}px;top:${y}px;font-size:${fs}px;z-index:10;opacity:0`, txt); show(el, [[t0, t1]]); E.pop(el, t0, { from: .3, dur: .2 }); E.K(el, "y", [[t0, 0], [t1, -40, "out"]]); };
  emo("💥", 360, 1150, OW - .15, OW + .7); emo("⚡", 300, 980, ZAP, ZAP + .8, 130); emo("⚡", 420, 880, ZAP + .1, ZAP + .7, 100);
  const cloud = E.el(S.el, "abs", "left:380px;top:1150px;width:600px;height:400px;z-index:8;opacity:0;font-size:260px;line-height:1;text-align:center", "💨💨");
  E.K(cloud, "o", [[SPRAY, 0], [SPRAY + .3, .9], [SPRAY + 1.6, .7], [SPRAY + 2.0, 0]]); E.K(cloud, "s", [[SPRAY, .4], [SPRAY + 2.0, 1.6, "out"]]); E.K(cloud, "x", [[SPRAY, -80], [SPRAY + 2.0, 140, "out"]]);
  // the dark: the zapper kills the lamp, not the mosquito
  const dark = E.el(S.el, "abs", "inset:0;background:rgba(3,6,25,.6);z-index:6;opacity:0");
  E.K(dark, "o", [[OUT - .05, 0], [OUT, 1], [BIT - .1, 1], [BIT + .3, .4], [DUR, .4]]);
  // the neighbour
  const nb = fig(S.el, "nb", 679, 1013, .62, 860, 1930, 8); show(nb, [[KNOCK - .2, TRES + 2.6]]); E.K(nb, "y", [[KNOCK - .2, 600], [KNOCK + .15, 0, "out"]]);
  const nk = []; for (let t = KNOCK; t < KNOCK + 1.2; t += .4) nk.push([t, -6, "out"], [t + .12, 4, "in"]); E.K(nb, "r", nk);
  ["THUD", "THUD", "THUD"].forEach((tx, i) => { const el = E.el(S.el, "abs", `left:${640 + i * 50}px;top:${760 - i * 90}px;font-weight:900;font-size:70px;color:#ffd60a;z-index:9;opacity:0;text-shadow:0 4px 10px rgba(0,0,0,.7);transform:rotate(${-8 + i * 8}deg)`, tx); show(el, [[KNOCK + i * .4, KNOCK + i * .4 + .5]]); E.pop(el, KNOCK + i * .4, { from: .3, dur: .15 }); });

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "03:00 · MOSQUITOES: 1"], [SLIP, "TRIES: 1 · KILLED: 0"], [FIND, "TRIES: 7 · KILLED: 0"], [SPRAY, "TRIES: 23 · KILLED: 0"], [BIT, "04:30 · BITES: 14"], [FINE, "OTTO: SURRENDERS"], [SWARM, "MOSQUITOES: 12"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= SLIP ? C.coralD : C.ink; pill.style.fontSize = s.length > 22 ? "44px" : "50px"; });
  PL.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const sb = en => `<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:3px">${en}</div>`;
  const bubble = (html, hx, top, w, t0, t1, fs = 48, z = 10) => {
    const tail = Math.max(50, Math.min(w - 90, w / 2)), left = Math.max(20, Math.min(1060 - w, hx - tail)), tl = hx - left - 22;
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:${z};transform-origin:${tl}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tl}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Okay. It's just one mosquito.", 540, 880, 640, JUST, SLIP - .15, 48);
  bubble("Ow!", 330, 1000, 240, OW, FIND - .15, 68);
  bubble("I will find you.", 330, 1000, 430, FIND, OUT + .2, 50);
  bubble(`Ó vizinho! São três da manhã!${sb("(Hey, neighbour! It's 3 a.m.!)")}`, 860, 840, 560, TRES, BIT - .2, 42);
  bubble("Fine. Take my arm. Just one. Be quick.", 540, 880, 640, FINE, SWARM - .1, 44);
  bubble("I meant ONE.", 540, 880, 480, ONE, STAMP + .3, 58);
  E.stamp(E.el(S.el, "abs", "left:30px;top:600px;width:1020px;display:flex;justify-content:center;z-index:11"), "MOSQUITOES 12 · OTTO 0.", STAMP, { size: 76, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(0, "sfx/elx-crickets.wav", { vol: .5, duck: false, to: DUR });
  [[.3, 3], [3.1, 3], [5.7, 3], [8.6, 3], [12.1, 3], [LAND - .6, 2.5]].forEach(([t, d]) => E.clip(t, "sfx/elx-mosquito-buzz.wav", { vol: 1.1, to: d }));
  E.clip(SWARM - .1, "sfx/elx-mosquito-buzz.wav", { vol: 1.6, to: 3.5 }); E.clip(SWARM + .6, "sfx/elx-mosquito-buzz.wav", { vol: 1.3, to: 2.5 });
  E.clip(JUST, "voices/ep113/o_just.wav", { vol: 1.2 });
  E.clip(OW - .12, "sfx/elx-skin-slap.wav", { vol: 1.6, to: .8 }); E.clip(OW, "voices/ep113/o_ow.wav", { vol: 1.25 });
  E.clip(FIND, "voices/ep113/o_find.wav", { vol: 1.2 }); E.clip(ZAP, "sfx/elx-zapper.wav", { vol: .9, to: 1.2 }); E.S(OUT, "thud", .5);
  E.clip(SPRAY, "sfx/elx-spray-hiss.wav", { vol: .8, to: 1.8 });
  E.clip(KNOCK, "sfx/elx-broom-knock.wav", { vol: 1.3, to: 1.6 }); E.clip(TRES, "voices/ep113/v_tres.wav", { vol: 1.35 });
  E.clip(FINE, "voices/ep113/o_fine.wav", { vol: 1.2 }); E.S(LAND, "pop", .4);
  E.clip(ONE, "voices/ep113/o_one.wav", { vol: 1.25 }); E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "One *mosquito* at 3 a.m.", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[21.6, 1], [21.85, 1.18, "out"], [22.15, 1, "io"]]);
}
