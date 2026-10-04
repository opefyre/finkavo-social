// EP.119 "Helping a friend move (just a few boxes)" — Tiago: "Hey! Can you help me move? It's just a few boxes. Umas caixinhas!" Otto: "Sure! A few boxes. Easy." The van arrives: boxes, a sofa,
// a fridge… "Tiago… is that a piano?" Tiago, on a box with an espresso: "Relax. Isto vai num instante!" (This will be done in a minute!) A Lisbon stairwell, fifth floor, SEM ELEVADOR (no lift): trip
// after trip. A neighbour squeezes past the wardrobe: "Bom dia!" Otto, crushed: "Tiago… my legs… are gone." Tiago: "You're doing great! Pizza's on me later!" Fifth floor. Otto collapses. Tiago, reading
// a text: "Ah. Small thing… the landlord says it's the building next door." Otto, face down: "I hate you." Stamp: TRIPS 47 · WRONG BUILDING 1.
export const meta = {
  id: "ep119-moving", date: "2027-01-20",
  images: {
    street: "characters/scenes/bg_street.webp", stairs: "characters/scenes/bg_stairwell.webp",
    t1: "characters/cutouts/tiago_phone.webp", t2: "characters/cutouts/tiago_coffee.webp", o1: "characters/cutouts/otto-casual_thumbs.webp", o2: "characters/cutouts/otto-casual_jawdrop.webp",
    van: "characters/props/van-loaded.webp", ob: "characters/cutouts/otto-casual_boxes.webp", duo: "characters/cutouts/duo_wardrobe.webp", nb: "characters/cutouts/oldman_ask.webp", oc: "characters/cutouts/otto-casual_collapse.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 116, root: 50, seed: 1191, prog: [[0, 4, 7], [7, 11, 14], [5, 9, 12], [9, 12, 16]] });
  const DUR = 30.0, MOVE = .3, SURE = 4.55, VAN = 7.0, PIANO = 7.3, INST = 10.35, STAIRS = 12.75, WARD = 15.6, BOMDIA = 15.85, LEGS = 17.05, PIZZA = 20.45, TOP = 23.05, NEXT = 23.3, HATE = 27.05, STAMP = 28.5;
  const S = E.scene("moving", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };

  // ================= the street =================
  const G1 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G1, [[0, STAIRS]]);
  E.img(G1, "street", BG);
  const van = fig(G1, "van", 1023, 880, .7, 560, 1560, 3); show(van, [[VAN, STAIRS]]); E.K(van, "x", [[VAN, 900], [VAN + .55, 0, "out"]]);
  E.K(van, "r", [[VAN + .55, 0], [VAN + .7, -2, "io"], [VAN + .85, 1.5, "io"], [VAN + 1.0, 0, "io"]]);
  const t1 = fig(G1, "t1", 423, 1024, .74, 820, 1860, 5), t2 = fig(G1, "t2", 585, 1008, .72, 820, 1870, 5);
  E.F(t => { t1.style.opacity = t < INST ? 1 : 0; t2.style.opacity = t >= INST ? 1 : 0; });
  bob(t1, 0, INST, 5, .6); bob(t2, INST, STAIRS, 4, .8);
  const o1 = fig(G1, "o1", 649, 1024, .72, 250, 1860, 6), o2 = fig(G1, "o2", 398, 1044, .74, 250, 1860, 6);
  E.F(t => { o1.style.opacity = t < PIANO ? 1 : 0; o2.style.opacity = t >= PIANO ? 1 : 0; });
  bob(o1, 0, PIANO, 6, .5); bob(o2, PIANO, STAIRS, 3, .9);

  // ================= the stairwell =================
  const G2 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G2, [[STAIRS, DUR]]);
  E.img(G2, "stairs", BG);
  // sign: SEM ELEVADOR
  const sign = E.el(G2, "abs", "left:70px;top:640px;width:470px;height:150px;background:#f6f1e4;border:6px solid #2b2b2b;border-radius:14px;z-index:4;text-align:center;transform:rotate(-3deg);box-shadow:0 8px 18px rgba(0,0,0,.35)");
  E.el(sign, "abs", `left:0;top:20px;width:470px;font-weight:900;font-size:50px;color:${C.coralD};letter-spacing:1px;white-space:nowrap`, "SEM ELEVADOR");
  E.el(sign, "abs", "left:0;top:94px;width:470px;font-weight:800;font-size:30px;color:#555", "(no lift)");
  // the montage: Otto climbs with boxes, again and again
  const ob = fig(G2, "ob", 457, 1024, .82, 480, 1890, 6); show(ob, [[STAIRS, WARD]]);
  const trips = 6, per = (WARD - STAIRS) / trips, mx = [], my = [], ms = [];
  for (let i = 0; i < trips; i++) { const a = STAIRS + i * per; mx.push([a, -160], [a + per * .9, 280, "lin"]); my.push([a, 0], [a + per * .9, -620, "lin"]); ms.push([a, 1], [a + per * .9, .55, "lin"]); }
  E.K(ob, "x", mx); E.K(ob, "y", my); E.K(ob, "s", ms);
  const wb = []; for (let t = STAIRS; t < WARD; t += .15) wb.push([t, (Math.round(t / .15) % 2) ? 4 : -4, "io"]); E.K(ob, "r", wb);
  const duo = fig(G2, "duo", 663, 1007, .9, 560, 1880, 6); show(duo, [[WARD, TOP]]);
  const dj = []; for (let t = WARD; t < TOP; t += .1) dj.push([t, (Math.round(t / .1) % 2) ? 1.2 : -1.2, "io"]); E.K(duo, "r", dj);
  const nb = fig(G2, "nb", 480, 1037, .6, 900, 1700, 7); show(nb, [[WARD, LEGS + .6]]); E.K(nb, "x", [[WARD, 200], [BOMDIA + .3, 0, "out"], [LEGS + .6, -60, "lin"]]); E.K(nb, "y", [[WARD, -260], [BOMDIA + .3, 0, "out"]]);
  const tc = fig(G2, "t2", 585, 1008, .5, 790, 1060, 5); show(tc, [[PIZZA - .2, TOP]]); E.pop(tc, PIZZA - .2, { from: .7, dur: .3 });
  // the top floor
  const oc = fig(G2, "oc", 993, 595, .7, 400, 1880, 6); show(oc, [[TOP, DUR]]);
  const ocb = []; for (let t = TOP; t < DUR; t += 1.1) ocb.push([t, 0, "io"], [t + .55, -4, "io"]); E.K(oc, "y", ocb);
  const tp = fig(G2, "t1", 423, 1024, .74, 860, 1880, 5); show(tp, [[TOP, DUR]]); bob(tp, TOP, DUR, 4, .7);
  const sweat = E.el(G2, "abs", "left:240px;top:1480px;font-size:70px;z-index:8;opacity:0", "💦"); show(sweat, [[STAIRS, DUR]]);
  E.K(sweat, "y", [[STAIRS, 0], [STAIRS + .5, -30, "out"], [STAIRS + .51, 0], [STAIRS + 1, -30, "out"], [STAIRS + 1.01, 0], [STAIRS + 1.5, -30, "out"], [STAIRS + 1.51, 0], [STAIRS + 2, -30, "out"]]);

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  E.F(t => {
    let s;
    if (t < VAN) s = "BOXES: \"JUST A FEW\"";
    else if (t < STAIRS) s = "BOXES: 61 · PIANO: 1";
    else if (t < WARD) s = `FLOOR 5 · TRIP ${Math.min(46, 1 + Math.floor((t - STAIRS) / per) * 7)}/47`;
    else if (t < TOP) s = "TRIP 47/47 · LEGS: 0/2";
    else if (t < NEXT + 2.6) s = "FLOOR 5 · DONE ✔";
    else s = "BUILDING: WRONG";
    if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= VAN ? C.coralD : C.ink;
  });
  [VAN, STAIRS, WARD, TOP, NEXT + 2.6].forEach(t => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

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
  bubble(`Hey! Can you help me move? It's just a few boxes. Umas caixinhas!${sub("(Just a few little boxes!)")}`, 820, 860, 640, MOVE, SURE - .1, 40);
  bubble("Sure! A few boxes. Easy.", 250, 980, 480, SURE, VAN, 46);
  bubble("Tiago… is that a piano?", 250, 980, 480, PIANO, INST - .1, 46);
  bubble(`Relax. Isto vai num instante!${sub("(This will be done in a minute!)")}`, 820, 900, 600, INST, STAIRS - .1, 42);
  bubble(`Bom dia!${sub("(Good morning!)")}`, 900, 940, 340, BOMDIA, LEGS - .1, 50);
  bubble("Tiago… my legs… are gone.", 400, 960, 500, LEGS, PIZZA - .1, 46);
  bubble("You're doing great! Pizza's on me later!", 830, 560, 560, PIZZA, TOP - .1, 42);
  bubble("Ah. Small thing… the landlord says it's the building next door.", 860, 860, 640, NEXT, HATE - .1, 40);
  bubble("I hate you.", 400, 1340, 360, HATE, STAMP + .3, 54);
  E.stamp(E.el(S.el, "abs", "left:30px;top:900px;width:1020px;display:flex;justify-content:center;z-index:11"), "47 TRIPS · WRONG BUILDING.", STAMP, { size: 58, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(0, "sfx/crowd-murmur.wav", { vol: .1, duck: false, to: STAIRS });
  E.clip(MOVE, "voices/ep119/t_move.wav", { vol: 1.3 }); E.clip(SURE, "voices/ep119/o_sure.wav", { vol: 1.2 });
  E.clip(VAN - .2, "sfx/elx-bus-brakes.wav", { vol: .6, to: 1.6 }); E.clip(PIANO, "voices/ep119/o_piano.wav", { vol: 1.2 });
  E.clip(INST, "voices/ep119/t_instante.wav", { vol: 1.3 }); E.S(STAIRS, "whoosh", .4);
  for (let i = 0; i < 6; i++) E.S(STAIRS + i * per + .2, "thud", .35);
  E.clip(STAIRS, "sfx/panting.wav", { vol: .6, duck: false, to: TOP - STAIRS });
  E.clip(BOMDIA, "voices/ep119/n_bomdia.wav", { vol: 1.3 }); E.clip(LEGS, "voices/ep119/o_legs.wav", { vol: 1.2 });
  E.clip(PIZZA, "voices/ep119/t_pizza.wav", { vol: 1.3 }); E.S(TOP, "thud", .6);
  E.clip(NEXT, "voices/ep119/t_next.wav", { vol: 1.3 }); E.S(NEXT + 3.0, "scratch", .5);
  E.clip(HATE, "voices/ep119/o_hate.wav", { vol: 1.3 }); E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Helping a friend *move*", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[29.2, 1], [29.45, 1.18, "out"], [29.75, 1, "io"]]);
}
