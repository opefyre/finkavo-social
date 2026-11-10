// EP.141 "Why do some Portuguese leave dinner out for the dead?" — an uncleared Christmas Eve table at night, the lamp flickers
// (real Kling clip). Ernesto Veiga de Oliveira, Festividades cíclicas em Portugal, ch. 17 "O culto dos mortos no Natal": in parts of
// the north (Guimarães, Barroso, Rio Tinto, around Porto) the Consoada table is not cleared so the family's dead, the "alminhas", can
// eat the crumbs; in Alto Minho an extra place is set for the most recently dead. Otto: "So… can I have this one?" Grandma: "Isso é
// do teu avô." (That's your grandpa's.) Music: compose.py ep141. Opening 0–3.0 is the clip.
export const meta = {
  id: "ep141-alminhas", date: "2026-12-20",
  images: {
    dining: "characters/scenes/bg_dining.webp", grab: "characters/cutouts/otto-casual_grab.webp", dona: "characters/cutouts/dona_point.webp",
    pastry: "characters/props/pastry-travesseiro.webp", bread: "characters/props/bread-loaf.webp",
  },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 18.5;
  const EVE = 3.1, SOULS = 6.8, PLACE = 10.8, THIS = 14.6, AVO = 16.7, OUT = 17.6;
  const S = E.scene("souls", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. the real clip (0 – 3.0) ============
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff"); show(M, [[0, EVE - .1]]);
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);
  const hookWords = [["Why", .2], ["do", .35], ["some", .45], ["Portuguese", .6], ["leave", 1.2], ["dinner", 1.4, 1], ["out", 1.7], ["for", 1.85], ["the", 1.95], ["dead?", 2.1, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:220px;width:1000px;text-align:center;z-index:10;line-height:1.08"); show(H, [[0, EVE - .1]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:100px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  // ============ 2. Christmas Eve, in the north (3.1 – 6.8) ============
  const N = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#1c2a3f,#0b1220)"); show(N, [[EVE - .1, SOULS]]);
  const date = E.el(N, "abs", "left:290px;top:260px;width:500px;height:300px;border-radius:30px;background:#fff;z-index:4;overflow:hidden;text-align:center;font-weight:900;color:#1d2b36");
  E.el(date, "abs", "left:0;top:0;width:500px;height:100px;background:#c62828;color:#fff;font-size:52px;line-height:100px", "DECEMBER");
  E.el(date, "abs", "left:0;top:110px;width:500px;font-size:170px;line-height:1", "24");
  E.pop(date, EVE, { from: .6, dur: .25 });
  const map = E.el(N, "abs", "left:350px;top:620px;width:380px;height:710px;z-index:3");
  map.innerHTML = '<svg viewBox="0 0 240 450" width="380" height="710"><path d="M70 10 L190 20 L200 90 L185 170 L200 250 L190 330 L170 400 L120 440 L60 430 L40 360 L30 280 L45 200 L35 120 L50 50 Z" fill="#33445c" stroke="#9fb3cc" stroke-width="3"/><path d="M70 10 L190 20 L200 90 L120 105 L45 110 L50 50 Z" fill="#ffd640" opacity=".9"/></svg>';
  const north = E.el(N, "abs", "left:150px;top:700px;width:240px;text-align:right;font-weight:900;font-size:44px;color:#ffd640;z-index:4;opacity:0", "the north →");
  show(north, [[EVE + 1.4, SOULS]]); E.pop(north, EVE + 1.4, { from: .5, dur: .2 });
  N.style.transformOrigin = "50% 50%"; E.K(N, "s", [[EVE, 1.1], [EVE + .4, 1, "out"], [EVE + 1.3, 1.02, "lin"], [EVE + 1.5, 1.2, "out"], [SOULS, 1.24, "lin"]]); E.K(N, "y", [[EVE + 1.3, 0], [EVE + 1.5, 180, "out"], [SOULS, 190, "lin"]]);

  // ============ 3. the souls come for the crumbs (6.8 – 14.6) ============
  const D = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(D, [[SOULS - .1, DUR]]); E.img(D, "dining", COVER);
  const dark = E.el(D, "abs", "inset:0;background:rgba(10,14,40,.7);z-index:2"); E.F(t => { dark.style.opacity = t < SOULS + 1.4 ? .55 : t < THIS ? .85 : .3; });
  const loaf = fig(D, "bread", 294, 183, 1.0, 420, 1240, 3);
  for (let i = 0; i < 4; i++) { // soft glowing souls drifting to the table
    const g = E.el(D, "abs", `left:${120 + i * 230}px;top:${300 + (i % 2) * 120}px;width:220px;height:300px;border-radius:50% 50% 40% 40%;background:radial-gradient(ellipse at 50% 30%,rgba(235,245,255,.75),rgba(170,200,255,.3) 55%,rgba(170,200,255,0) 72%);filter:blur(10px);z-index:4`);
    const t0 = SOULS + .3 + i * .5; show(g, [[t0, THIS]]);
    E.K(g, "y", [[t0, -300], [t0 + 1.4, 380 + (i % 2) * 60, "out"]]);
    E.K(g, "s", Array.from({ length: 10 }, (_, k) => [t0 + k * .4, k % 2 ? .92 : 1.05, "io"]));
  }
  const alm = E.el(D, "abs", "left:140px;top:240px;width:800px;text-align:center;font-weight:900;font-size:74px;color:#fff;z-index:5;opacity:0;text-shadow:0 0 20px rgba(160,190,255,.9)", "\"as alminhas\"<br><span style='font-size:38px;color:#c8d6ff'>(the little souls)</span>");
  show(alm, [[SOULS + 1.4, PLACE]]); E.pop(alm, SOULS + 1.4, { from: .6, dur: .3 });
  const plate = E.el(D, "abs", "left:620px;top:1080px;width:300px;height:110px;border-radius:50%;background:#f4f1ea;border:8px solid #c9b88f;z-index:5;opacity:0;box-shadow:0 0 50px rgba(255,214,64,.7)");
  show(plate, [[PLACE, DUR]]); E.pop(plate, PLACE + .2, { from: .4, dur: .3 });
  const pl = E.el(D, "abs", "left:440px;top:700px;width:600px;text-align:center;font-weight:900;font-size:46px;color:#ffd640;text-shadow:0 2px 10px #000;z-index:6;opacity:0;line-height:1.15", "one extra place<br><span style='font-size:30px;color:#fff'>for the one who left most recently</span>");
  show(pl, [[PLACE + .6, THIS]]); E.pop(pl, PLACE + .6, { from: .6, dur: .2 });
  const pas = fig(D, "pastry", 281, 172, .9, 770, 1130, 6); show(pas, [[PLACE + .2, DUR]]);
  E.F(t => { D.style.filter = t >= THIS ? "none" : t >= PLACE + 2.0 ? "sepia(.5) saturate(1.3) brightness(.8)" : t >= PLACE ? "sepia(.25) saturate(1.2)" : "brightness(.75)"; });
  E.K(D, "s", [[SOULS, 1.15], [SOULS + .5, 1, "out"], [SOULS + 1.35, 1.02, "lin"], [SOULS + 1.6, 1.15, "out"], [PLACE - .1, 1.18, "lin"], [PLACE, 1.25, "out"], [PLACE + 1.9, 1.27, "lin"], [PLACE + 2.1, 1.55, "out"], [THIS - .1, 1.58, "lin"], [THIS, 1.0, "out"], [DUR, 1.08, "lin"]]); D.style.transformOrigin = "68% 58%";

  // ============ 4. Otto reaches, grandma stops him (14.6 – end) ============
  const og = fig(D, "grab", 625, 1078, 1.05, 330, 1880, 7); show(og, [[THIS, DUR]]); E.K(og, "x", [[THIS, -500], [THIS + .3, 0, "out"]]);
  const dn = fig(D, "dona", 688, 1024, 1.05, 830, 1880, 8); show(dn, [[AVO, DUR]]); E.pop(dn, AVO, { from: 1.2, dur: .18 });
  const lamp = E.el(D, "abs", "inset:0;background:#000;z-index:11;opacity:0"); E.F(t => { lamp.style.opacity = t < OUT ? 0 : t < OUT + .12 ? .75 : .5; });

  // ============ captions ============
  const cap = E.el(S.el, "abs", "left:70px;top:1385px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const CAPS = [[EVE, "On Christmas Eve, in parts of the north,"], [EVE + 1.9, "the table isn't cleared."], [SOULS - .1, ""],
    [SOULS, "So the family's dead can come"], [SOULS + 1.8, "and eat the crumbs."], [PLACE - .1, ""],
    [PLACE, "Some even set an extra place."], [THIS - .1, ""], [THIS, "\"So… can I have this one?\""], [AVO - .1, ""],
    [AVO, `"Isso é do teu avô."${sub("That's your grandpa's.")}`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0, "sfx/fs-clock-tick.wav", { vol: 0.25, to: EVE, duck: false });
  E.clip(0.15, "voices/ep141/n_hook11.wav", { vol: 1.2 });
  E.clip(EVE, "voices/ep141/n_eve.wav", { vol: 1.2 });
  E.clip(SOULS, "voices/ep141/n_souls.wav", { vol: 1.2 });
  E.clip(SOULS + .3, "sfx/wind-gust.wav", { vol: 0.2, duck: false });
  E.clip(PLACE, "voices/ep141/n_place.wav", { vol: 1.2 });
  E.clip(PLACE + .2, "sfx/plate-down.wav", { vol: 0.4, duck: false });
  E.clip(THIS, "voices/ep141/o_this.wav", { vol: 1.2 });
  E.clip(AVO, "voices/ep141/g_avo.wav", { vol: 1.3 });
  E.clip(OUT, "sfx/wind-gust.wav", { vol: 0.35, duck: false });
  E.clip(0, "../tools/reel/eps/ep141-alminhas/audio/music44.wav", { vol: 0.3, to: DUR });
  E.finish(DUR);
}
