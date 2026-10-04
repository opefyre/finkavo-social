// EP.122 "Your smartwatch vs grandma's lunch" — Otto's watch: "Calories today: four hundred. Great job!" Grandma: "Come, come! Estás tão magrinho!" (Eat, eat! You're so skinny!) "Now the soup."
// "Now the meat." The watch: "Heart rate: one hundred and fifty. Are you exercising?" Otto, mouth full: "I'm eating!" Grandma: "And dessert. Arroz doce." The watch: "Calories: nine thousand. Emergency
// services contacted." Siren. A paramedic bursts in: "Where is the patient?" Grandma: "Sit, sit! You must be hungry!" The paramedic, napkin on: "Is this arroz doce?" (watch: PARAMEDIC CALORIES 3,000)
// Otto, stuffed: "…Now he needs an ambulance." Stamp: GRANDMA 2 · AMBULANCE 0.
export const meta = {
  id: "ep122-smartwatch", date: "2027-01-23",
  images: {
    bg: "characters/scenes/bg_dining.webp",
    o1: "characters/cutouts/otto-table_watch.webp", o2: "characters/cutouts/otto-table_full.webp",
    g1: "characters/cutouts/dona_offer.webp", g2: "characters/cutouts/dona_stir.webp", g3: "characters/cutouts/dona_pig.webp",
    p1: "characters/cutouts/paramedic_run.webp", p2: "characters/cutouts/paramedic_eat.webp",
    soup: "characters/props/food_soup.webp", bac: "characters/props/food_bacalhau.webp", rice: "characters/props/food_rice.webp", cake: "characters/props/food_cake.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 55, seed: 1221, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 29.6, W400 = .3, MAGR = 3.6, SOUP = 6.7, MEAT = 7.95, HEART = 9.25, EAT = 12.55, DESS = 13.85, W9 = 16.45, RUN = 20.7, WHERE = 21.0, SIT = 22.4, DOCE = 25.2, AMB = 26.9, STAMP = 28.1;
  const S = E.scene("watch", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };
  E.img(S.el, "bg", BG);

  // ---- Otto (left, at the table) and grandma (right, serving)
  const o1 = fig(S.el, "o1", 880, 1125, .72, 300, 1890, 5), o2 = fig(S.el, "o2", 880, 1161, .72, 300, 1900, 5);
  E.F(t => { o1.style.opacity = t < W9 ? 1 : 0; o2.style.opacity = t >= W9 ? 1 : 0; });
  // the plates already eaten pile up beside him
  const stk = E.el(S.el, "abs", "left:40px;top:1640px;width:240px;height:200px;z-index:7"); const plates = [];
  for (let i = 0; i < 8; i++) plates.push(E.el(stk, "abs", `left:0;top:${170 - i * 22}px;width:240px;height:34px;border-radius:50%;background:#fff;border:3px solid #cfc7b5;box-shadow:0 3px 4px rgba(0,0,0,.2);opacity:0`));
  plates.forEach((pl, i) => E.K(pl, "o", [[0, 0], [MAGR + .8 + i * 1.45, 0], [MAGR + .9 + i * 1.45, 1], [W9 - .05, 1], [W9, 0]]));
  bob(o1, 0, W9, 4, .6); bob(o2, W9, DUR, 6, .9);
  const chew = []; for (let t = MAGR; t < W9; t += .25) chew.push([t, 1, "io"], [t + .12, 1.02, "io"]); E.K(o1, "s", chew);
  const GX = 850, GB = 1720;
  const g1 = fig(S.el, "g1", 585, 955, .72, GX, GB, 4), g2 = fig(S.el, "g2", 657, 1021, .68, GX, GB, 4), g3 = fig(S.el, "g3", 744, 1063, .7, GX - 20, GB, 4);
  E.F(t => { const k = t < SOUP ? 1 : t < MEAT ? 2 : t < DESS ? 3 : 1; [g1, g2, g3].forEach((g, i) => { g.style.opacity = i + 1 === k ? 1 : 0; }); });
  [g1, g2, g3].forEach(g => bob(g, 0, DUR, 5, .55));
  E.K(g1, "x", [[0, 0], [RUN, 0], [RUN + .4, 120, "out"]]);
  // the food keeps landing on the table in front of Otto
  const food = (n, w, h, s, x, t0, t1 = DUR) => { const el = E.el(S.el, "abs", `left:${x - w * s / 2}px;top:${1660 - h * s}px;width:${w * s}px;height:${h * s}px;z-index:6;opacity:0;transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); show(el, [[t0, t1]]); E.K(el, "y", [[t0, -300], [t0 + .3, 0, "in"], [t0 + .45, -16, "out"], [t0 + .6, 0, "in"]]); return el; };
  food("soup", 203, 184, .9, 560, MAGR + .4, W9); food("soup", 203, 184, .9, 640, SOUP + .2, W9); food("bac", 241, 167, 1.0, 560, MEAT + .2, W9); food("rice", 238, 155, 1.0, 650, MEAT + 1.0, W9); food("cake", 211, 204, .9, 600, DESS + .3, DUR);

  // ---- the smartwatch, big, at the top
  const w = E.el(S.el, "abs", "left:300px;top:430px;width:480px;height:480px;z-index:9");
  E.el(w, "abs", "left:150px;top:-50px;width:180px;height:580px;background:#222;border-radius:30px");
  const face = E.el(w, "abs", "left:0;top:0;width:480px;height:480px;border-radius:110px;background:#0b0d10;border:14px solid #3a3f47;box-shadow:0 14px 30px rgba(0,0,0,.5);overflow:hidden");
  const big = E.el(face, "abs", "left:0;top:90px;width:452px;text-align:center;font-weight:900;font-size:120px;color:#fff;line-height:1", "");
  const lab = E.el(face, "abs", "left:0;top:230px;width:452px;text-align:center;font-weight:900;font-size:40px;color:#7dff8a;letter-spacing:2px", "");
  const msg = E.el(face, "abs", "left:30px;top:300px;width:392px;text-align:center;font-weight:800;font-size:34px;color:#cfd6dc;line-height:1.1", "");
  const WS = [[0, "400", "KCAL", "Great job! 🎉 10,000 steps", "#7dff8a"], [MAGR + .4, "1,100", "KCAL", "", "#7dff8a"], [SOUP + .2, "2,300", "KCAL", "", "#ffd60a"], [MEAT + .2, "4,800", "KCAL", "", "#ffb000"],
    [HEART, "150", "BPM ❤️", "Are you exercising?", "#ff6b3d"], [DESS + .3, "7,200", "KCAL", "", "#ff4d3d"], [W9, "9,000", "KCAL ⚠️", "Emergency services contacted 🚑", "#ff2d2d"], [DOCE + .4, "3,000", "PARAMEDIC KCAL", "", "#ff2d2d"]];
  E.F(t => { const a = at(WS.map(r => [r[0], r]), t); if (big.textContent !== a[1]) { big.textContent = a[1]; lab.textContent = a[2]; msg.textContent = a[3]; } lab.style.color = a[4]; face.style.boxShadow = (t >= W9 && t < W9 + 4 && Math.floor(t * 4) % 2) ? "0 0 60px rgba(255,40,40,.9)" : "0 14px 30px rgba(0,0,0,.5)"; });
  WS.slice(1).forEach(([t]) => E.K(w, "s", [[t - .01, 1], [t, 1.1], [t + .2, 1, "out"]]));
  show(w, [[0, SIT - .1], [DOCE + .3, STAMP - .1]]);
  // the siren light
  const siren = E.el(S.el, "abs", "inset:0;z-index:8;opacity:0;background:radial-gradient(circle at 90% 30%,rgba(255,40,40,.55),rgba(40,80,255,0) 60%)");
  const sk = []; for (let t = W9 + 2; t < RUN + 1.5; t += .3) sk.push([t, .9, "io"], [t + .15, .1, "io"]); E.K(siren, "o", [[0, 0], ...sk, [RUN + 1.6, 0]]);

  // ---- the paramedic
  const p1 = fig(S.el, "p1", 646, 989, .72, 830, 1880, 7); show(p1, [[RUN, SIT]]); E.K(p1, "x", [[RUN, 600], [RUN + .4, 0, "out"]]);
  const p2 = fig(S.el, "p2", 688, 1000, .7, 760, 1860, 6); show(p2, [[SIT, DUR]]); E.pop(p2, SIT, { from: .9, dur: .25 }); bob(p2, SIT, DUR, 5, .4);

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "HEALTHY WEEK: DAY 7"], [MAGR, "LUNCH AT GRANDMA'S"], [W9, "AMBULANCES CALLED: 1"], [DOCE, "PATIENTS: 2"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= MAGR ? C.coralD : C.ink; });
  PL.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const sub = en => `<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:3px">${en}</div>`;
  const bubble = (html, hx, top, w2, t0, t1, fs = 48, z = 10) => {
    const tail = Math.max(50, Math.min(w2 - 90, w2 / 2)), left = Math.max(20, Math.min(1060 - w2, hx - tail)), tl = hx - left - 22;
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w2}px;z-index:${z};transform-origin:${tl}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tl}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const WB = (h, t0, t1, fs = 40) => bubble(`<div style="font-size:26px;color:#7a8791;margin-bottom:2px">⌚ THE WATCH</div>${h}`, 540, 920, 640, t0, t1, fs, 11);
  WB("Calories today: 400. Great job!", W400, MAGR - .1, 42);
  bubble(`Come, come! Estás tão magrinho!${sub("(Eat, eat! You're so skinny!)")}`, GX, 960, 560, MAGR, SOUP - .1, 44);
  bubble("Now the soup.", GX, 980, 380, SOUP, MEAT - .1, 50);
  bubble("Now the meat.", GX, 980, 380, MEAT, HEART - .1, 50);
  WB("Heart rate: 150. Are you exercising?", HEART, EAT - .1, 42);
  bubble("I'm eating!", 300, 1000, 340, EAT, DESS - .1, 54);
  bubble(`And dessert. Arroz doce.${sub("(rice pudding)")}`, GX, 960, 480, DESS, W9 - .1, 46);
  WB("Calories: 9,000. Emergency services contacted.", W9, RUN - .1, 40);
  bubble("Where is the patient?", 830, 960, 460, WHERE, SIT - .1, 48);
  bubble("Sit, sit! You must be hungry!", 960, 760, 500, SIT, DOCE - .1, 46);
  bubble("Is this arroz doce?", 760, 1000, 440, DOCE, AMB - .1, 48);
  bubble("…Now he needs an ambulance.", 300, 960, 520, AMB, STAMP + .4, 46);
  E.stamp(E.el(S.el, "abs", "left:30px;top:620px;width:1020px;display:flex;justify-content:center;z-index:13"), "GRANDMA 2 · AMBULANCE 0", STAMP, { size: 60, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(0, "sfx/elx-dinner-party.wav", { vol: .08, duck: false, to: DUR });
  E.clip(W400 - .2, "sfx/elx-watch-alert.wav", { vol: .9 }); E.clip(W400, "voices/ep122/w_400.wav", { vol: 1.2 });
  E.clip(MAGR, "voices/ep122/g_magrinho.wav", { vol: 1.35 }); E.clip(SOUP, "voices/ep122/g_soup.wav", { vol: 1.35 }); E.clip(MEAT, "voices/ep122/g_meat.wav", { vol: 1.35 });
  [MAGR + .7, SOUP + .5, MEAT + .5, MEAT + 1.3, DESS + .6].forEach(t => E.S(t, "thud", .4));
  E.clip(HEART - .2, "sfx/elx-watch-alert.wav", { vol: .9 }); E.clip(HEART, "voices/ep122/w_heart.wav", { vol: 1.2 });
  E.clip(MAGR + .3, "sfx/elx-munch.wav", { vol: .5, to: 2.5 }); E.clip(EAT, "voices/ep122/o_eating.wav", { vol: 1.25 });
  E.clip(DESS, "voices/ep122/g_dessert.wav", { vol: 1.35 });
  E.clip(W9 - .2, "sfx/elx-watch-alert.wav", { vol: 1.1 }); E.clip(W9, "voices/ep122/w_9000.wav", { vol: 1.2 });
  E.clip(W9 + 2.2, "sfx/elx-siren.wav", { vol: .6, to: RUN - W9 - 1.2 }); E.S(RUN, "whoosh", .4);
  E.clip(WHERE, "voices/ep122/p_where.wav", { vol: 1.3 }); E.clip(SIT, "voices/ep122/g_sit.wav", { vol: 1.35 });
  E.clip(DOCE, "voices/ep122/p_doce.wav", { vol: 1.3 }); E.clip(AMB, "voices/ep122/o_ambulance.wav", { vol: 1.25 }); E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Your *smartwatch* vs grandma's lunch", { size: 42, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[28.8, 1], [29.05, 1.18, "out"], [29.35, 1, "io"]]);
}
