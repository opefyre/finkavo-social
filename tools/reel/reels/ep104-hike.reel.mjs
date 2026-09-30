// EP.104 "Hiking in Portugal" — Buck in full gear (poles, pot, smart watch): "Four kilometres uphill? Easy." An 85-year-old man in slippers, a sack on his
// shoulder, overtakes him: "Good morning, son!" — then, on an old flip phone: "Yes, yes, I am on the mountain. Ten minutes." Buck: "Is he… wearing
// SLIPPERS?!" Time-lapse: ALTITUDE climbs, WATER drops, Buck crawls. 2 HOURS LATER, the summit: a picnic table, a grill, the whole family waving. The old man,
// with a sausage on a fork: "You're late! Sausage?" "But… you were in slippers!" "Eighty-five. Eat, you look tired." Grandma: "Sit! Sit! Eat, eat!"
export const meta = {
  id: "ep104-hike", date: "2027-01-05",
  images: {
    trail: "characters/scenes/bg_trail.webp", top: "characters/scenes/bg_summit.webp", bh: "characters/cutouts/buck_hike.webp", bt: "characters/cutouts/buck_hike_tired.webp",
    os: "characters/cutouts/oldman_sack.webp", op: "characters/cutouts/oldman_phone.webp", of: "characters/cutouts/oldman_fork.webp", fb: "characters/cutouts/family_bench.webp",
    bc: "characters/cutouts/buck_crawl.webp", gr: "characters/props/gear_grill.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 110, root: 55, seed: 1041, prog: [[0, 4, 7], [7, 11, 14], [5, 9, 12], [9, 12, 16]] });
  const DUR = 24.8, EASY = .3, PASS = 1.7, MORN = 2.0, PHONE = 3.3, SLIP = 6.0, LAPSE = 9.0, TRAIN = 9.2, CARD = 11.7, SUM = 12.6, LATE = 13.0, INSL = 15.0, EAT = 17.6, SIT = 20.2, STAMP = 23.0;
  const S = E.scene("hike", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, left, bottom, z = 3) => { const el = E.el(P, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";

  // ================= the trail =================
  const G1 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G1, [[0, SUM]]);
  E.img(G1, "trail", BG);
  // Buck: proud → tired; climbs the path during the time-lapse
  const b1 = fig(G1, "bh", 644, 984, .55, 40, 1850, 5), b2 = fig(G1, "bt", 648, 809, .55, 40, 1850, 5);
  show(b1, [[0, LAPSE]]); show(b2, [[LAPSE, SUM]]);
  const bob = []; for (let t = 0; t < LAPSE; t += .5) bob.push([t, 0, "io"], [t + .25, -6, "io"]); E.K(b1, "y", bob);                                        // frame-0 motion: marching
  [b1, b2].forEach(b => { E.K(b, "x", [[LAPSE, 0], [CARD, 330, "lin"]]); });
  [b2].forEach(b => { E.K(b, "y", [[LAPSE, 0], [CARD, -330, "lin"]]); E.K(b, "s", [[LAPSE, 1], [CARD, .72, "lin"]]); });
  const bt = []; for (let t = LAPSE; t < CARD; t += .3) bt.push([t, (Math.round(t / .3) % 2) ? 3 : -3, "io"]); E.K(b2, "r", bt);
  // the old man overtakes (sack) then keeps walking uphill on his phone
  const o1 = fig(G1, "os", 636, 967, .58, -380, 1900, 6), o2 = fig(G1, "op", 427, 949, .58, -300, 1900, 6);
  const ox = [[PASS, 0], [PHONE + .3, 880, "lin"], [SLIP + 1.5, 980, "lin"]], oy = [[PASS, 0], [PHONE + .3, -380, "lin"], [SLIP + 1.5, -560, "lin"]], os2 = [[PASS, 1], [PHONE + .3, .62, "lin"], [SLIP + 1.5, .36, "lin"]];
  [o1, o2].forEach(o => { E.K(o, "x", ox); E.K(o, "y", oy); E.K(o, "s", os2); });
  show(o1, [[PASS - .1, PHONE]]); show(o2, [[PHONE, SLIP + 1.6]]);
  const ow = []; for (let t = PASS; t < SLIP + 1.5; t += .35) ow.push([t, (Math.round(t / .35) % 2) ? 2 : -2]); E.K(o1, "r", ow); E.K(o2, "r", ow);
  const sweat = E.el(G1, "abs", "left:300px;top:1330px;font-size:54px;z-index:7;opacity:0", "💦"); show(sweat, [[LAPSE + .3, CARD]]);
  E.K(sweat, "x", [[LAPSE, 0], [CARD, 330, "lin"]]); E.K(sweat, "y", [[LAPSE, 0], [CARD, -330, "lin"]]);

  // ================= the summit =================
  const G2 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G2, [[SUM, DUR]]);
  E.img(G2, "top", BG);
  const fw = E.el(G2, "abs", "left:340px;top:700px;width:729px;height:355px;overflow:hidden;z-index:3");
  E.img(fw, "fb", "position:absolute;left:0;top:0;width:729px;height:472px");
  const fbob = []; for (let t = SUM; t < DUR; t += .5) fbob.push([t, 0, "io"], [t + .25, -4, "io"]); E.K(fw, "y", fbob);
  fig(G2, "gr", 200, 289, .95, 300, 1580, 4);
  const om = fig(G2, "of", 665, 960, .6, 10, 1590, 5); E.pop(om, SUM, { from: .8, dur: .3 });
  const omb = []; for (let t = SUM; t < DUR; t += .6) omb.push([t, 0, "io"], [t + .3, -5, "io"]); E.K(om, "y", omb);
  const bc = fig(G2, "bc", 901, 510, .55, -520, 1860, 6); E.K(bc, "x", [[SUM, 0], [SUM + 1.5, 560, "out"]]);
  const crawl = []; for (let t = SUM; t < SUM + 1.5; t += .3) crawl.push([t, (Math.round(t / .3) % 2) ? -8 : 0, "io"]); E.K(bc, "y", crawl);
  [[230, 1120], [300, 1040]].forEach(([x, y], i) => { const p = E.el(G2, "abs", `left:${x}px;top:${y}px;font-size:60px;z-index:6;opacity:.85`, "💨"); E.K(p, "y", [[0, 0], [1, -40, "out"], [1.6, 0, "io"], [2.6, -40, "out"], [3.2, 0, "io"], [4.2, -40, "out"], [DUR, 0]]); E.K(p, "o", [[0, .85], [DUR, .85]]); });

  // ---- time-lapse card
  const card = E.el(S.el, "abs", "inset:0;background:#141a2e;z-index:14;opacity:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:76px;color:#fff6c8;text-align:center;padding:0 60px", "2 HOURS LATER…");
  E.K(card, "o", [[CARD, 0], [CARD + .12, 1], [SUM - .15, 1], [SUM, 0]]);

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  E.F(t => {
    let s;
    if (t < PASS) s = "GEAR: 14 ITEMS";
    else if (t < SLIP) s = "OVERTAKEN BY: SLIPPERS";
    else if (t < LAPSE) s = "SLIPPERS: 1 · BOOTS: 0";
    else if (t < SUM) { const k = Math.min(6, Math.floor((t - LAPSE) / .45)); s = `ALTITUDE ${[120, 310, 480, 620, 740, 810, 860][k]} m · WATER ${[70, 41, 23, 12, 6, 3, 1][k]}%`; }
    else if (t < EAT) s = "SUMMIT · SAUSAGES: CARRIED";
    else s = "SLIPPERS: 1 · BOOTS: 0";
    if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= PASS ? C.coralD : C.ink; pill.style.fontSize = s.length > 26 ? "38px" : s.length > 22 ? "44px" : "50px";
  });
  [PASS, SLIP, LAPSE, SUM, EAT].forEach(t => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Four kilometres uphill? Easy.", 60, 1110, 520, 200, EASY, PASS + .3, 46);
  bubble("Good morning, son!", 470, 1330, 460, 130, MORN, PHONE - .05, 46);
  bubble("Yes, yes, I am on the mountain. Ten minutes.", 500, 1000, 520, 360, PHONE, SLIP - .05, 42);
  bubble("Is he… wearing SLIPPERS?!", 40, 1030, 600, 180, SLIP, LAPSE - .1, 48);
  bubble("I trained… for six months…", 50, 1000, 600, 250, TRAIN, CARD - .05, 46);
  bubble("You're late! Sausage?", 20, 820, 500, 170, LATE, INSL - .05, 48);
  bubble("But… you were in SLIPPERS!", 120, 1390, 640, 420, INSL, EAT - .05, 46);
  bubble("Eighty-five. Eat, you look tired.", 20, 820, 520, 170, EAT, SIT - .05, 44);
  bubble("Sit! Sit! Eat, eat!", 340, 590, 460, 100, SIT, STAMP + .3, 48);
  const sb = E.el(S.el, "abs", "left:30px;top:1180px;width:1020px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "SLIPPERS 1 · BOOTS 0.", STAMP, { size: 84, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/dawn-birds.wav", { vol: .3, duck: false, to: SUM }); E.clip(0, "sfx/elx-gravel-steps.wav", { vol: .6, duck: false, to: LAPSE });
  E.clip(EASY, "voices/ep104/b_easy.wav", { vol: 1.2 });
  E.S(PASS, "whoosh", .4); E.clip(MORN, "voices/ep104/o_morning.wav", { vol: 1.3 });
  E.clip(PHONE, "voices/ep104/o_phone.wav", { vol: 1.3 });
  E.clip(SLIP, "voices/ep104/b_slippers.wav", { vol: 1.3 });
  E.clip(LAPSE, "sfx/panting.wav", { vol: .7, duck: false, to: CARD - LAPSE }); E.clip(TRAIN, "voices/ep104/b_trained.wav", { vol: 1.25 });
  E.S(CARD, "whoosh", .4);
  E.clip(SUM, "sfx/sizzle.wav", { vol: .5, duck: false, to: DUR - SUM }); E.clip(LATE, "voices/ep104/o_late.wav", { vol: 1.3 });
  E.clip(INSL, "voices/ep104/b_inslippers.wav", { vol: 1.25 });
  E.clip(EAT, "voices/ep104/o_eat.wav", { vol: 1.3 });
  E.clip(SIT, "voices/ep104/e_sit.wav", { vol: 1.35 });
  E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Hiking in *Portugal*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[24.0, 1], [24.25, 1.18, "out"], [24.6, 1, "io"]]);
}
