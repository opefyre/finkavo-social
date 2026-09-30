// EP.98 "Packed by a Portuguese mum" — London Heathrow, customs, after Christmas in Portugal. The officer: "Anything to declare?" Tiago:
// "No, no. Just clothes." The X-ray says otherwise: chouriço, cheese, bacalhau, pastéis de nata, port, bread, a soup pot, a slipper, a melon…
// WEIGHT 23 → 71 kg. "Sir… is that a whole pig?" "My mum packed." One more shape on the screen, curled up. "And what… is THAT?" The suitcase
// bursts open: Mum. "He doesn't eat properly in London!" The officer, one bite into a nata: "…Fair enough." DECLARED: 1 MUM.
export const meta = {
  id: "ep98-suitcase", date: "2026-12-30",
  images: {
    bg: "characters/scenes/bg_customs.webp", oa: "characters/cutouts/officer_arms.webp", os: "characters/cutouts/officer_shock.webp", on: "characters/cutouts/officer_nata.webp",
    ts: "characters/cutouts/tiago_sheepish.webp", sc: "characters/props/suitcase-full.webp", mc: "characters/cutouts/mum_curl.webp", mp: "characters/cutouts/mum_pop.webp",
    i1: "characters/props/food_chourico.webp", i2: "characters/props/couvert-cheese.webp", i3: "characters/props/bacalhau-dry.webp", i4: "characters/props/pastry-nata.webp",
    i5: "characters/props/port.webp", i6: "characters/props/food_bread.webp", i7: "characters/props/pot.webp", i8: "characters/props/slipper_side.webp", i9: "characters/props/gear_melon.webp",
    pig: "characters/props/roast-pig.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 96, root: 50, seed: 981, prog: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]] });
  const DUR = 22.6, DECL = .3, CLOTHES = 1.9, SCAN = 3.4, IT0 = 4.2, ISTEP = .55, PIGT = 9.2, PIG = 9.9, MUM = 13.3, WHAT = 14.4, WHATV = 14.6, POP = 17.2,
    EAT = 17.4, FAIR = 19.6, STAMP = 21.0;
  const S = E.scene("suitcase", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  // the suitcase on the belt → into the machine; then open, with Mum
  const sc = fig("sc", 1071, 619, .44, 330, 1150, 3); show(sc, [[0, SCAN + .9]]); E.K(sc, "x", [[0, 0], [SCAN, 0], [SCAN + .9, -700, "in"]]);
  E.K(sc, "s", [[0, 1], [.5, 1.04, "io"], [1, 1, "io"], [1.5, 1.04, "io"], [2, 1, "io"]]);                                         // frame-0 motion: it bulges
  const mp = fig("mp", 973, 955, .64, 235, 1890, 6); show(mp, [[POP, DUR]]); E.pop(mp, POP, { from: .5, dur: .35 });
  // the officer (left) and Tiago (right)
  const O = [["oa", 309, 985, [[0, PIG]]], ["os", 641, 984, [[PIG, FAIR]]], ["on", 406, 986, [[FAIR, DUR]]]]
    .map(([n, w, h, sp]) => { const f = fig(n, w, h, .78, 20, 1880, 4); show(f, sp); return f; });
  const ts = fig("ts", 400, 968, .78, 740, 1880, 4);
  const sweat = []; for (let t = PIG; t < POP; t += .12) sweat.push([t, (Math.round(t * 8) % 2) ? 2 : -2]); E.K(ts, "x", sweat);

  // ================= the X-ray monitor =================
  const mon = E.el(S.el, "abs", "left:70px;top:440px;width:940px;height:580px;background:#2b2f35;border-radius:26px;padding:18px;box-sizing:border-box;z-index:8;opacity:0;box-shadow:0 18px 40px rgba(0,0,0,.4)");
  show(mon, [[SCAN + .3, POP]]); E.pop(mon, SCAN + .3, { from: .6, dur: .3 });
  const scr = E.el(mon, "", "position:relative;width:100%;height:100%;border-radius:12px;overflow:hidden;background:#0d1b2e;background-image:linear-gradient(rgba(90,160,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(90,160,255,.08) 1px,transparent 1px);background-size:40px 40px");
  E.el(scr, "abs", "left:30px;top:40px;width:840px;height:450px;border:6px solid rgba(120,190,255,.55);border-radius:40px;box-sizing:border-box");
  E.el(scr, "abs", "left:20px;top:8px;font-weight:900;font-size:24px;color:#7fc4ff;letter-spacing:2px", "X-RAY · BAG 1 · LHR");
  const beam = E.el(scr, "abs", "left:0;top:0;width:10px;height:100%;background:rgba(127,196,255,.7);box-shadow:0 0 24px #7fc4ff");
  E.K(beam, "x", [[SCAN + .3, 0], [PIGT + .4, 890, "lin"]]); show(beam, [[SCAN + .3, PIGT + .4]]);
  const XR = "filter:grayscale(1) invert(.92) sepia(1) saturate(5) hue-rotate(-18deg) brightness(1.05);opacity:.92";
  const XB = "filter:grayscale(1) invert(.92) sepia(1) saturate(5) hue-rotate(170deg) brightness(1.1);opacity:.92";
  const ITEMS = [["i1", 220, 142, .9, 60, 70, XR], ["i2", 285, 194, .7, 280, 60, XR], ["i3", 300, 176, .9, 500, 70, XR], ["i4", 252, 185, .55, 70, 230, XR], ["i4", 252, 185, .55, 170, 250, XR],
    ["i5", 112, 304, .8, 300, 200, XB], ["i6", 221, 199, .8, 410, 240, XR], ["i7", 345, 255, .7, 600, 220, XB], ["i8", 287, 130, .8, 60, 370, XR], ["i9", 190, 220, .75, 300, 330, XR]];
  const els = ITEMS.map(([n, w, h, s, x, y, f], i) => {
    const el = E.el(scr, "abs", `left:${x}px;top:${y}px;width:${w * s}px;height:${h * s}px;opacity:0`); E.img(el, n, `width:${w * s}px;height:${h * s}px;${f}`);
    const t = IT0 + i * ISTEP; show(el, [[t, WHAT]]); E.pop(el, t, { from: .4, dur: .25 }); return t;
  });
  const pig = E.el(scr, "abs", "left:470px;top:250px;width:390px;height:205px;opacity:0"); E.img(pig, "pig", `width:390px;height:205px;${XR}`);
  show(pig, [[PIGT, WHAT]]); E.pop(pig, PIGT, { from: .4, dur: .3 });
  const mc = E.el(scr, "abs", "left:290px;top:60px;width:340px;height:450px;opacity:0"); E.img(mc, "mc", `width:340px;height:450px;${XR}`);
  show(mc, [[WHAT, POP]]); E.pop(mc, WHAT, { from: .5, dur: .3 });
  const hb = E.el(scr, "abs", "left:640px;top:170px;font-size:70px;opacity:0", "💓"); show(hb, [[WHAT + .5, POP]]);
  const hbk = []; for (let t = WHAT + .5; t < POP; t += .5) hbk.push([t, 1], [t + .12, 1.35, "out"], [t + .3, 1, "in"]); E.K(hb, "s", hbk);
  const alarm = E.el(mon, "abs", "inset:0;border-radius:26px;box-shadow:inset 0 0 0 10px #e5484d;opacity:0"); E.F(t => { alarm.style.opacity = t >= PIGT && t < POP && Math.floor(t * 3) % 2 ? 1 : 0; });

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const W = [[0, "LONDON · CUSTOMS"], [SCAN + .3, "WEIGHT: 23 kg"]];
  els.forEach((t, i) => W.push([t, `WEIGHT: ${23 + (i + 1) * 3} kg`]));
  W.push([PIGT, "WEIGHT: 71 kg"], [WHAT, "WEIGHT: 134 kg"], [POP, "CONTENTS: 1 MUM"]);
  E.F(t => { const s = at(W, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= PIGT ? C.coralD : C.ink; });
  W.slice(2).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .18, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const OB = (h, t0, t1, fs = 46, w = 440) => bubble(h, 30, 1030, w, 100, t0, t1, fs);
  const TB = (h, t0, t1, fs = 46, w = 400) => bubble(h, 1050 - w, 1030, w, w - 150, t0, t1, fs);
  OB("Anything to declare?", DECL, CLOTHES - .05, 48, 420);
  TB("No, no. Just clothes.", CLOTHES, SCAN + .3, 46, 400);
  OB("Sir… is that a whole pig?", PIG, MUM - .05, 46, 440);
  TB("My mum packed.", MUM, WHAT, 48, 360);
  OB("And what… is THAT?", WHATV, POP - .05, 48, 420);
  bubble("He doesn't eat properly in London!", 240, 1080, 600, 250, EAT, FAIR - .05, 44);
  OB("…Fair enough.", FAIR, DUR - .3, 48, 360);
  const sb = E.el(S.el, "abs", "left:60px;top:560px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "DECLARED: 1 MUM.", STAMP, { size: 86, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/crowd-murmur.wav", { vol: .3, duck: false, to: DUR });
  E.clip(DECL, "voices/ep98/o_declare.wav", { vol: 1.25 });
  E.clip(CLOTHES, "voices/ep98/t_clothes.wav", { vol: 1.25 });
  E.clip(SCAN, "sfx/elx-trolley.wav", { vol: .5, to: 1 }); E.S(SCAN + .3, "whoosh", .4);
  els.forEach(t => E.S(t, "tick", .5)); E.clip(PIGT, "sfx/radar-ping.wav", { vol: .6 }); E.S(PIGT, "blare", .35);
  E.clip(PIG, "voices/ep98/o_pig.wav", { vol: 1.3 });
  E.clip(MUM, "voices/ep98/t_mum.wav", { vol: 1.3 });
  E.S(WHAT, "riser", .4); E.clip(WHATV, "voices/ep98/o_what.wav", { vol: 1.3 });
  E.clip(POP - .1, "sfx/plastic-rip.wav", { vol: .5, to: .6 }); E.S(POP, "poof", .6); E.clip(EAT, "voices/ep98/m_eat.wav", { vol: 1.35 });
  E.clip(FAIR - .3, "sfx/munch.wav", { vol: .6, to: .5 }); E.clip(FAIR, "voices/ep98/o_fair.wav", { vol: 1.3 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Packed by a Portuguese *mum*", { size: 52, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[21.8, 1], [22.05, 1.18, "out"], [22.4, 1, "io"]]);
}
