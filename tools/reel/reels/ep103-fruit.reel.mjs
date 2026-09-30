// EP.103 "Buying fruit in Portugal" — in Portuguese supermarkets you weigh and label your own fruit. Buck at the till: "Just these, please!" The
// cashier, eyes closed: "Sir. Where is the label?" "Number seven. Over there." (the self-service scale). He sprints, comes back: "Sir. This is a
// coconut." — "But the machine said banana!" Seven trips later he is covered in stickers and the queue is enormous. "Sir. Those are red apples.
// This label says green." Then a small old woman steps out of the queue: "Give me." Six fruits, six labels, three seconds. "Thank you, Dona Lurdes."
// "I have been doing this since before the euro." A new customer arrives with her arms full. Buck, a sticker on his forehead: "Number seven. I will
// hold your place."
export const meta = {
  id: "ep103-fruit", date: "2027-01-04",
  images: {
    bg: "characters/scenes/bg_market.webp", k1: "characters/cutouts/checkout_scan.webp", k2: "characters/cutouts/checkout_sigh.webp", k3: "characters/cutouts/checkout_point.webp",
    bb: "characters/cutouts/buck_basket.webp", sp: "characters/cutouts/buck_sprint.webp", bl: "characters/cutouts/buck_labels.webp", ki: "characters/props/fruit-kiosk.webp",
    qa: "characters/cutouts/queue_a.webp", qb: "characters/cutouts/queue_b.webp", sa: "characters/cutouts/sensei_arms.webp", st: "characters/cutouts/sensei_tap.webp",
    zo: "characters/cutouts/zoe_loaded.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 120, root: 55, seed: 1031, prog: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]] });
  const DUR = 27.4, HI = .3, LABEL = 2.3, SEVEN = 3.95, RUN0 = 4.9, COCONUT = 7.4, BANANA = 9.25, MON0 = 10.95, MON1 = 12.35, APPLES = 12.5, GIVE = 15.65, DASH0 = 16.2,
    TAP0 = 16.9, BACK0 = 17.9, THANKS = 18.8, BEFORE = 20.25, ZOE = 22.3, HOLD = 22.9, STAMP = 25.6;
  const S = E.scene("fruit", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3, flip = false) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px${flip ? ";transform:scaleX(-1)" : ""}`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  // ---- the queue (behind the counter): three people, then three more
  const qa = fig("qa", 965, 597, .5, 10, 1290, 2), qb = fig("qb", 965, 627, .5, 500, 1290, 2);
  show(qb, [[COCONUT - .2, DUR]]); E.pop(qb, COCONUT - .2, { from: .6, dur: .3 });
  [qa, qb].forEach(q => { const k = []; for (let t = 0; t < DUR; t += .7) k.push([t, 0, "io"], [t + .35, -4, "io"]); E.K(q, "y", k); });        // frame-0 motion: impatient
  // ---- the self-service scale (far left)
  fig("ki", 347, 987, .6, 10, 1580, 3);
  // ---- the checkout: cashier poses on one canvas
  const CWd = 1004, CHt = 757, CO = E.el(S.el, "abs", `left:140px;top:${1880 - CHt}px;width:${CWd}px;height:${CHt}px;z-index:4`);
  const CK = ["k1", "k2", "k3"].map(n => E.img(CO, n, `position:absolute;left:0;top:0;width:${CWd}px;height:${CHt}px;opacity:0`));
  const CP = [[0, 0], [LABEL, 1], [SEVEN, 2], [COCONUT, 1], [THANKS - .1, 0], [THANKS + 1.6, 1]];
  E.F(t => { const k = at(CP, t); CK.forEach((c, i) => { c.style.opacity = i === k ? 1 : 0; }); });

  // ---- Buck: stand → sprint left → kiosk → sprint right; later covered in stickers
  const bx = [[0, 0], [RUN0, 0], [RUN0 + .8, -200, "io"], [RUN0 + 1.6, -200], [RUN0 + 2.3, 0, "io"]];
  const MT = []; for (let t = MON0, k = 0; t < MON1 - .01; t += .35, k++) MT.push([t, k]);
  MT.forEach(([t, k]) => { bx.push([t + .35, (k % 2) ? 0 : -200, "io"]); });
  bx.push([MON1 + .3, 0, "io"]);
  const B1 = fig("bb", 573, 930, .62, 330, 1900, 6), BL = fig("sp", 682, 784, .5, 340, 1900, 6), BR = fig("sp", 682, 784, .5, 340, 1900, 6, true), B3 = fig("bl", 413, 960, .62, 360, 1900, 6);
  [B1, BL, BR, B3].forEach(b => E.K(b, "x", bx));
  const goL = [[RUN0, RUN0 + .8]], goR = [[RUN0 + 1.6, RUN0 + 2.3]], atK = [[0, RUN0], [RUN0 + .8, RUN0 + 1.6], [RUN0 + 2.3, MON0]];
  MT.forEach(([t, k]) => ((k % 2) ? goR : goL).push([t, t + .35]));
  show(B1, atK); show(BL, goL); show(BR, goR); show(B3, [[MON1 + .3, DUR]]);
  const hop = []; for (let t = 0; t < DUR; t += .5) hop.push([t, 0, "io"], [t + .25, -4, "io"]); E.K(B1, "y", hop);

  // ---- the old lady who knows: steps out, dashes to the scale, taps, returns
  const sx = [[0, 0], [DASH0, 0], [DASH0 + .6, -540, "io"], [BACK0, -540], [BACK0 + .7, 0, "io"]];
  const SA = fig("sa", 463, 935, .6, 700, 1900, 6), SL = fig("sa", 463, 935, .6, 700, 1900, 6, true), ST = fig("st", 557, 966, .6, 690, 1900, 6);
  [SA, SL, ST].forEach(s => E.K(s, "x", sx));
  show(SA, [[GIVE - .3, DASH0], [BACK0 + .7, DUR]]); show(SL, [[DASH0, DASH0 + .6], [BACK0, BACK0 + .7]]); show(ST, [[DASH0 + .6, BACK0]]);
  E.pop(SA, GIVE - .3, { from: .6, dur: .3 });
  const tap = []; for (let t = DASH0 + .6; t < BACK0; t += .07) tap.push([t, (Math.round(t * 14) % 2) ? 3 : -3]); E.K(ST, "r", tap);
  // ---- the newcomer, arms full
  const ZO = fig("zo", 547, 979, .6, 20, 1900, 6); show(ZO, [[ZOE, DUR]]); E.K(ZO, "x", [[ZOE, -450], [ZOE + .5, 0, "out"]]);

  // ---- sigh puffs over the queue
  const SG = [LABEL, COCONUT, BANANA, MON0, MON0 + .7, MON1 - .3, APPLES, APPLES + 1.2];
  SG.forEach((t, i) => { const p = E.el(S.el, "abs", `left:${120 + (i * 137) % 700}px;top:980px;font-size:60px;z-index:5;opacity:0`, "💨"); E.K(p, "o", [[t - .01, 0], [t, 1], [t + .8, 1], [t + .9, 0]]); E.K(p, "y", [[t, 0], [t + .9, -40, "out"]]); });

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "FRUIT: 6 · LABELS: 0"], [LABEL, "SIGHS: 1"], [COCONUT, "SIGHS: 2"], [BANANA, "SIGHS: 3"], [MON0, "TRIPS TO THE SCALE: 2"], [MON0 + .7, "TRIPS: 3"], [MON0 + 1.4, "TRIPS: 7 · SIGHS: 14"],
    [DASH0 + .6, "DONA LURDES: 3 SECONDS"], [THANKS, "SIGHS: 0"], [ZOE, "NEW CUSTOMER: 12 FRUITS"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= LABEL && t < THANKS ? C.coralD : C.ink; pill.style.fontSize = s.length > 22 ? "44px" : "50px"; });
  PL.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx2 = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx2, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const CB = (h, t0, t1, fs = 44, w = 460) => bubble(h, 1050 - w, 870, w, w - 150, t0, t1, fs);
  bubble("Hi! Just these, please!", 240, 1070, 520, 270, HI, LABEL - .05, 46);
  CB("Sir. Where is the label?", LABEL, SEVEN - .1, 46);
  CB("Number seven. Over there.", SEVEN, RUN0 + 1.5, 44);
  CB("Sir. This is a coconut.", COCONUT, BANANA - .1, 46);
  bubble("But the machine said banana!", 240, 1070, 560, 270, BANANA, MON0 - .05, 44);
  CB("Sir. Those are red apples. This label says green.", APPLES, GIVE - .1, 40, 560);
  bubble("Give me.", 560, 1100, 300, 100, GIVE, DASH0 + .3, 56);
  CB("Thank you, Dona Lurdes.", THANKS, BEFORE - .05, 46);
  bubble("I have been doing this since before the euro.", 500, 1080, 540, 140, BEFORE, HOLD - .1, 42);
  bubble("Number seven. I will hold your place.", 160, 1010, 620, 420, HOLD, STAMP + .3, 44);
  const sb = E.el(S.el, "abs", "left:60px;top:660px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "SENSEI BUCK.", STAMP, { size: 124, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/crowd-murmur.wav", { vol: .3, duck: false, to: DUR });
  E.clip(HI, "voices/ep103/b_hi.wav", { vol: 1.2 }); E.S(1.0, "tick", .5); E.S(1.45, "tick", .5);
  E.clip(LABEL, "voices/ep103/c_label.wav", { vol: 1.3 }); E.clip(LABEL, "sfx/elx-queue-sigh.wav", { vol: .6, to: 1.6 });
  E.clip(SEVEN, "voices/ep103/c_seven.wav", { vol: 1.3 });
  E.clip(RUN0, "sfx/stairs-run.wav", { vol: .5, to: .8 }); E.clip(RUN0 + .9, "sfx/elx-label-print.wav", { vol: 1 }); E.clip(RUN0 + 1.25, "sfx/elx-label-print.wav", { vol: .8 });
  E.clip(RUN0 + 1.6, "sfx/stairs-run.wav", { vol: .5, to: .7 });
  E.clip(COCONUT, "voices/ep103/c_coconut.wav", { vol: 1.3 }); E.clip(COCONUT, "sfx/elx-queue-sigh.wav", { vol: .7, to: 1.8 });
  E.clip(BANANA, "voices/ep103/b_banana.wav", { vol: 1.25 });
  MT.forEach(([t, k]) => { if (k % 2 === 0) E.clip(t + .3, "sfx/elx-label-print.wav", { vol: .9, to: .7 }); E.S(t, "whoosh", .3); });
  E.clip(MON0 + .6, "sfx/elx-queue-sigh.wav", { vol: .8, to: 2 });
  E.clip(APPLES, "voices/ep103/c_apples.wav", { vol: 1.3 });
  E.clip(GIVE, "voices/ep103/s_give.wav", { vol: 1.35 }); E.S(DASH0, "whoosh", .4);
  [0, .2, .4, .6, .8, 1.0].forEach(d => E.clip(TAP0 + d, "sfx/elx-label-print.wav", { vol: .9, to: .4 }));
  E.clip(THANKS - .2, "sfx/cash-register.wav", { vol: .5, to: 1 }); E.clip(THANKS, "voices/ep103/c_thanks.wav", { vol: 1.3 });
  E.clip(BEFORE, "voices/ep103/s_before.wav", { vol: 1.35 });
  E.S(ZOE, "whoosh", .4); E.clip(HOLD, "voices/ep103/b_hold.wav", { vol: 1.25 });
  E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Buying fruit in *Portugal*", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[26.6, 1], [26.85, 1.18, "out"], [27.2, 1, "io"]]);
}
