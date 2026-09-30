// EP.106 "Hotel breakfast with your grandpa" — Otto treats grandpa to a hotel: "Breakfast is included!" Grandpa, sly: "Included? Hm. For later." One bread roll
// vanishes into his jacket. Then ham, cheese, an orange, yoghurt, an egg, jam, a croissant. "Grandpa, just eat here!" "I am eating here. This is for there."
// "Não se desperdiça!" (we don't waste!). The waiter notices: "Sir… would you like a bag for the road?" Grandpa: "You see? Hospitality." 1:00 PM, the beach:
// he opens his jacket — lunch for everyone. Otto, awkward: "Grandpa… I'm sorry I was embarrassed." "Eat. Breakfast was included." Stamp: "LUNCH: ALSO INCLUDED."
export const meta = {
  id: "ep106-buffet", date: "2027-01-07",
  images: {
    bg: "characters/scenes/bg_buffet.webp", beach: "characters/scenes/bg_beach.webp",
    o1: "characters/cutouts/otto-casual_proud.webp", o2: "characters/cutouts/otto-casual_awkward.webp", o3: "characters/cutouts/otto-casual_eating.webp",
    a1: "characters/cutouts/avo_sneak.webp", a2: "characters/cutouts/avo_stuffed.webp", a3: "characters/cutouts/avo_open.webp",
    w1: "characters/cutouts/waiter_tray.webp", w2: "characters/cutouts/waiter_facepalm.webp",
    bun: "characters/props/buffet-bun.webp", ham: "characters/props/buffet-ham.webp", cheese: "characters/props/buffet-cheese.webp", orange: "characters/props/buffet-orange.webp",
    yog: "characters/props/buffet-yoghurt.webp", egg: "characters/props/buffet-egg.webp", jam: "characters/props/buffet-jam.webp", croi: "characters/props/buffet-croissant.webp",
    therm: "characters/props/buffet-thermos.webp", blanket: "characters/props/blanket.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 53, seed: 1061, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [2, 5, 9]] });
  const DUR = 29.6, ENJOY = .3, LATER = 2.8, EATH = 6.0, THERE = 7.55, DESP = 10.65, WAIT = 12.4, BAG = 12.85, HOSP = 15.4, CARD = 18.0, BEACH = 19.2, LUNCH = 19.5, SORRY = 23.0, EATB = 25.3, STAMP = 27.7;
  const S = E.scene("buffet", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };

  // ================= the breakfast room =================
  const G1 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G1, [[0, CARD]]);
  E.img(G1, "bg", BG);
  const FL = 1830;
  const ot = fig(G1, "o1", 625, 1078, .68, 215, FL, 4); bob(ot, 0, CARD, 6, .6);
  const AV = 650;
  const a1 = fig(G1, "a1", 539, 1010, .82, AV, FL, 5), a2 = fig(G1, "a2", 606, 1015, .82, AV, FL, 5);
  E.F(t => { const k = t < 10.0 ? 0 : 1; a1.style.opacity = k === 0 ? 1 : 0; a2.style.opacity = k === 1 ? 1 : 0; });
  bob(a1, 0, 10, 5, .5); bob(a2, 10, CARD, 5, .5);
  // the waiter strolls in from the right, then hands over a bag
  const wt = fig(G1, "w1", 628, 1050, .7, 930, FL - 10, 4);
  E.K(wt, "x", [[WAIT, 420], [WAIT + .7, 0, "out"]]); E.K(wt, "o", [[0, 0], [WAIT - .01, 0], [WAIT, 1]]);
  bob(wt, WAIT + .7, CARD, 4, .6);
  // food flies off the buffet into grandpa's jacket
  const FOOD = [["bun", 4.85, 150], ["ham", 7.75, 150], ["cheese", 8.15, 150], ["orange", 8.55, 136], ["yog", 8.95, 124], ["egg", 9.35, 112], ["jam", 9.75, 130], ["croi", 10.15, 150]];
  FOOD.forEach(([n, t0, w], i) => {
    const sz = { bun: [278, 311], ham: [287, 309], cheese: [253, 229], orange: [278, 272], yog: [327, 339], egg: [251, 337], jam: [279, 240], croi: [299, 302] }[n];
    const h = w * sz[1] / sz[0], el = E.el(G1, "abs", `left:${170 - w / 2}px;top:${980 - h / 2}px;width:${w}px;height:${h}px;z-index:8;opacity:0`); E.img(el, n, `width:${w}px;height:${h}px`);
    show(el, [[t0, t0 + .5]]);
    E.K(el, "x", [[t0, 0], [t0 + .5, AV - 170 + (i % 2 ? 30 : -30), "io"]]);
    E.K(el, "y", [[t0, 0], [t0 + .22, -150, "out"], [t0 + .5, 1250 - 980 - 40 + (i % 3) * 20, "in"]]);
    E.K(el, "s", [[t0, 1], [t0 + .5, .4, "lin"]]); E.K(el, "r", [[t0, 0], [t0 + .5, 200 * (i % 2 ? 1 : -1), "lin"]]);
  });

  // ================= 13:00, the beach =================
  const G2 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G2, [[BEACH, DUR]]);
  E.img(G2, "beach", BG);
  const bl = E.el(G2, "abs", "left:60px;top:1610px;width:960px;height:240px;z-index:2;background:repeating-linear-gradient(90deg,#e8483f 0 60px,#fff 60px 120px),#e8483f;border-radius:28px;transform:perspective(600px) rotateX(58deg);transform-origin:50% 100%;box-shadow:0 18px 30px rgba(0,0,0,.25);opacity:0");
  const bl2 = E.el(bl, "abs", "inset:0;background:repeating-linear-gradient(0deg,rgba(232,72,63,.55) 0 40px,rgba(255,255,255,.0) 40px 80px);border-radius:28px"); E.K(bl, "o", [[BEACH, 1]]);
  const av3 = fig(G2, "a3", 688, 1011, .82, 660, 1700, 5); bob(av3, BEACH, DUR, 5, .5);
  E.pop(av3, BEACH + .05, { from: .85, dur: .3 });
  const o2 = fig(G2, "o2", 488, 1078, .7, 200, 1760, 5), o3 = fig(G2, "o3", 625, 1078, .7, 200, 1760, 5);
  E.F(t => { const k = t < EATB ? 0 : 1; o2.style.opacity = k === 0 ? 1 : 0; o3.style.opacity = k === 1 ? 1 : 0; });
  bob(o2, BEACH, EATB, 5, .7); bob(o3, EATB, DUR, 7, .45);
  const LUN = [["bun", 20.0, 120, 330], ["ham", 20.4, 120, 440], ["cheese", 20.8, 112, 540], ["orange", 21.2, 104, 640], ["yog", 21.6, 92, 740], ["egg", 22.0, 84, 820], ["croi", 22.4, 120, 910], ["therm", 22.8, 58, 990]];
  LUN.forEach(([n, t0, w, x]) => {
    const sz = { bun: [278, 311], ham: [287, 309], cheese: [253, 229], orange: [278, 272], yog: [327, 339], egg: [251, 337], croi: [299, 302], therm: [181, 310] }[n];
    const h = w * sz[1] / sz[0], y = 1800 - h, el = E.el(G2, "abs", `left:${x - w / 2}px;top:${y}px;width:${w}px;height:${h}px;z-index:6;opacity:0;transform-origin:50% 100%`); E.img(el, n, `width:${w}px;height:${h}px`);
    show(el, [[t0, DUR]]); E.K(el, "y", [[t0, -260], [t0 + .28, 0, "in"], [t0 + .42, -20, "out"], [t0 + .54, 0, "in"]]); E.K(el, "s", [[t0, .6], [t0 + .28, 1, "out"]]);
  });

  // ---- time card
  const card = E.el(S.el, "abs", "inset:0;background:#141a2e;z-index:14;opacity:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:80px;color:#fff6c8;text-align:center;padding:0 60px;line-height:1.1", "13:00<br>THE BEACH");
  E.K(card, "o", [[CARD, 0], [CARD + .12, 1], [BEACH - .15, 1], [BEACH, 0]]);

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  E.F(t => {
    let s;
    if (t < FOOD[0][1]) s = "BREAKFAST: INCLUDED";
    else if (t < WAIT) { const n = FOOD.filter(f => t >= f[1] + .4).length; s = `SMUGGLED: ${n} ITEM${n === 1 ? "" : "S"}`; }
    else if (t < HOSP) s = "WAITER: HAS NOTICED";
    else if (t < BEACH) s = "BAGS OFFERED: 1";
    else s = "LUNCH: INCLUDED";
    if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= FOOD[0][1] + .4 ? C.coralD : C.ink; pill.style.fontSize = s.length > 22 ? "44px" : "50px";
  });
  [...FOOD.map(f => f[1] + .4), WAIT, HOSP, BEACH].forEach(t => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const sub = en => `<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:3px">${en}</div>`;
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Grandpa, enjoy! Breakfast is included!", 20, 880, 560, 200, ENJOY, LATER - .1, 46);
  bubble("Included? Hm… For later.", 440, 850, 520, 260, LATER, EATH - .1, 48);
  bubble("Grandpa, just eat here!", 20, 880, 500, 210, EATH, THERE - .1, 48);
  bubble("I am eating here. This is for there.", 440, 850, 560, 280, THERE, DESP - .1, 46);
  bubble(`Não se desperdiça!${sub("(We don't waste!)")}`, 430, 830, 560, 270, DESP, BAG - .1, 52);
  bubble("Sir… would you like a bag for the road?", 380, 800, 620, 420, BAG, HOSP - .1, 46);
  bubble("You see? Hospitality.", 380, 850, 520, 220, HOSP, CARD - .05, 50);
  bubble("Lunch!", 470, 780, 340, 160, LUNCH, SORRY - .3, 64);
  bubble("Grandpa… I'm sorry I was embarrassed.", 20, 800, 620, 180, SORRY, EATB - .1, 44);
  bubble("Eat. Breakfast was included.", 440, 780, 560, 240, EATB, STAMP + .3, 48);
  const sb = E.el(S.el, "abs", "left:30px;top:560px;width:1020px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "LUNCH: ALSO INCLUDED.", STAMP, { size: 78, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/restaurant.wav", { vol: .3, duck: false, to: CARD }); E.clip(BEACH, "sfx/elx-waves.wav", { vol: .35, duck: false, to: DUR - BEACH });
  E.clip(ENJOY, "voices/ep106/o_enjoy.wav", { vol: 1.2 });
  E.clip(LATER, "voices/ep106/a_later.wav", { vol: 1.3 });
  FOOD.forEach(([n, t0], i) => { if (i === 0 || i % 2 === 1) E.clip(t0 + .1, "sfx/elx-bag-crinkle.wav", { vol: 1.6, to: .5 }); E.S(t0 + .45, "pop", .4); });
  E.clip(EATH, "voices/ep106/o_eathere.wav", { vol: 1.2 });
  E.clip(THERE, "voices/ep106/a_there.wav", { vol: 1.3 });
  E.clip(DESP, "voices/ep106/a_desp.wav", { vol: 1.35 });
  E.S(WAIT, "whoosh", .3); E.clip(BAG, "voices/ep106/w_bag.wav", { vol: 1.3 });
  E.clip(HOSP, "voices/ep106/a_hosp.wav", { vol: 1.3 });
  E.S(CARD, "whoosh", .4);
  E.clip(LUNCH, "voices/ep106/a_lunch.wav", { vol: 1.3 });
  LUN.forEach(([n, t0]) => E.S(t0 + .3, "thud", .4));
  E.clip(SORRY, "voices/ep106/o_sorry.wav", { vol: 1.2 });
  E.clip(EATB, "voices/ep106/a_eat.wav", { vol: 1.3 });
  E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Hotel breakfast with *grandpa*", { size: 50, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[28.9, 1], [29.15, 1.18, "out"], [29.45, 1, "io"]]);
}
