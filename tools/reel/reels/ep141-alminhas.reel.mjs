// EP.141 "Why do some Portuguese leave dinner out for the dead?" — an uncleared Christmas Eve table at night, the lamp flickers
// (real Kling clip). Ernesto Veiga de Oliveira, Festividades cíclicas em Portugal, ch. 17 "O culto dos mortos no Natal": in parts of
// the north (Guimarães, Barroso, Rio Tinto, around Porto) the Consoada table is not cleared so the family's dead, the "alminhas", can
// eat the crumbs; in Alto Minho an extra place is set for the most recently dead. Otto: "So… can I have this one?" Grandma: "Isso é
// do teu avô." (That's your grandpa's.) Music: compose.py ep141.
// Real clips under magenta, laid from media/clip.mp4: 0–3.0 (the table), 6.8–10.8 (two ghosts at the table, Kling from a composite of
// props/ghost-avo + ghost-avoa on the plate), 10.8–14.6 (the extra place, candle flickers).
export const meta = {
  id: "ep141-alminhas", date: "2026-12-20",
  images: {
    dining: "characters/scenes/bg_dining.webp", grab: "characters/cutouts/otto-casual_grab.webp", dona: "characters/cutouts/dona_point.webp",
    lamp: "characters/props/oil-lamp.webp", plate: "characters/props/plate-crumbs.webp", ghost: "characters/props/ghost-avo.webp",
  },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 18.5;
  const EVE = 3.1, MAP = 4.9, SOULS = 6.8, PLACE = 10.8, THIS = 14.6, AVO = 16.7, OUT = 17.6;
  const S = E.scene("souls", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  const label = (P, top, html, t0, t1) => { const l = E.el(P, "abs", `left:140px;top:${top}px;width:800px;text-align:center;z-index:9;opacity:0`, `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:12px 30px;font-weight:900;font-size:64px;color:#fff;line-height:1.15">${html}</span>`); show(l, [[t0, t1]]); E.pop(l, t0, { from: .6, dur: .25 }); return l; };
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ real clips under magenta ============
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff"); show(M, [[0, EVE - .1], [SOULS, THIS]]);
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);
  const hookWords = [["Why", .2], ["do", .35], ["some", .45], ["Portuguese", .6], ["leave", 1.2], ["dinner", 1.4, 1], ["out", 1.7], ["for", 1.85], ["the", 1.95], ["dead?", 2.1, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:220px;width:1000px;text-align:center;z-index:10;line-height:1.08"); show(H, [[0, EVE - .1]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:100px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });
  label(S.el, 300, "\"as alminhas\"<br><span style='font-size:38px;color:#c8d6ff'>(the little souls)</span>", SOULS + 1.4, PLACE);
  label(S.el, 300, "one extra place<br><span style='font-size:36px;color:#ffd640'>for the one who left most recently</span>", PLACE + .5, THIS);

  // ============ 2. Christmas Eve, in the north (3.1 – 6.8): lamp-lit date, then the map ============
  const N = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 38%,#4a2f18 0%,#1d120a 45%,#07040a 80%)"); show(N, [[EVE - .1, SOULS]]);
  const lamp = fig(N, "lamp", 1024, 1024, .62, 540, 1180, 3); E.pop(lamp, EVE, { from: .7, dur: .3 });
  const glow = E.el(N, "abs", "left:240px;top:380px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(255,190,90,.45),rgba(255,190,90,0) 65%);z-index:2");
  E.K(glow, "s", Array.from({ length: 16 }, (_, k) => [EVE + k * .23, k % 2 ? .9 : 1.08, "io"]));
  const date = E.el(N, "abs", "left:290px;top:250px;width:500px;text-align:center;z-index:4;font-family:Georgia,serif;color:#f4e3c3;font-size:120px;font-weight:700;line-height:1;text-shadow:0 4px 18px #000", "24<br><span style='font-size:46px;letter-spacing:.18em'>DEZEMBRO</span>");
  E.pop(date, EVE + .2, { from: .7, dur: .25 }); show(date, [[EVE, MAP]]); show(lamp, [[EVE, MAP]]); show(glow, [[EVE, MAP]]);
  const map = E.el(N, "abs", "left:300px;top:300px;width:480px;height:900px;z-index:3;opacity:0");
  map.innerHTML = '<svg viewBox="0 0 240 450" width="480" height="900"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a4630"/><stop offset="1" stop-color="#2e2416"/></linearGradient><linearGradient id="ng" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf6b"/><stop offset="1" stop-color="#e09a2a"/></linearGradient></defs>' +
    '<path d="M70 10 L190 20 L200 90 L185 170 L200 250 L190 330 L170 400 L120 440 L60 430 L40 360 L30 280 L45 200 L35 120 L50 50 Z" fill="url(#lg)" stroke="#d8c4a0" stroke-width="2.5"/>' +
    '<path d="M70 10 L190 20 L200 90 L120 106 L42 112 L50 50 Z" fill="url(#ng)" opacity=".95"/>' +
    '<circle cx="78" cy="78" r="5" fill="#2a1a0a"/><circle cx="62" cy="104" r="5" fill="#2a1a0a"/><circle cx="130" cy="34" r="5" fill="#2a1a0a"/></svg>';
  show(map, [[MAP, SOULS]]); E.pop(map, MAP, { from: .8, dur: .25 });
  const towns = [["Guimarães", 472, 436], ["Porto", 300, 492], ["Barroso", 576, 348]];
  towns.forEach(([n, x, y], i) => { const tl = E.el(N, "abs", `left:${x}px;top:${y}px;font-weight:800;font-size:34px;color:#fff;z-index:5;text-shadow:0 2px 8px #000;opacity:0`, n); show(tl, [[MAP + .3 + i * .2, SOULS]]); });
  N.style.transformOrigin = "45% 23%"; E.K(N, "s", [[EVE, 1.1], [EVE + .5, 1, "out"], [MAP - .1, 1.04, "lin"], [MAP, 1.0, "out"], [MAP + .5, 1.0], [MAP + .9, 1.9, "out"], [SOULS, 2.0, "lin"]]);
  E.F(t => { N.style.background = t < MAP ? "radial-gradient(circle at 50% 38%,#4a2f18 0%,#1d120a 45%,#07040a 80%)" : "radial-gradient(circle at 50% 30%,#1f2a3a,#090d14)"; });

  // ============ 3. Otto reaches, grandma stops him (14.6 – end) ============
  const D = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(D, [[THIS, DUR]]); E.img(D, "dining", COVER);
  E.F(t => { D.style.filter = t < OUT ? "brightness(.62) saturate(.9) sepia(.2)" : "brightness(.3) saturate(.7)"; });
  fig(D, "lamp", 1024, 1024, .3, 820, 1160, 4);
  fig(D, "plate", 1024, 688, .5, 560, 1250, 5);
  const og = fig(D, "grab", 625, 1078, 1.05, 300, 1880, 7); E.K(og, "x", [[THIS, -500], [THIS + .3, 0, "out"]]);
  const dn = fig(D, "dona", 688, 1024, 1.05, 840, 1880, 8); show(dn, [[AVO, DUR]]); E.pop(dn, AVO, { from: 1.2, dur: .18 });
  const gh = fig(D, "ghost", 688, 1024, .55, 560, 1150, 6); E.F(t => { gh.style.opacity = t < AVO + .2 ? 0 : Math.min(.55, (t - AVO - .2) * 1.2); });
  E.K(D, "s", [[THIS, 1.04], [THIS + .3, 1, "out"], [AVO - .1, 1.02, "lin"], [AVO, 1.1, "out"], [OUT - .05, 1.12, "lin"], [OUT, 1.18, "out"], [DUR, 1.2, "lin"]]); D.style.transformOrigin = "55% 62%";

  // ============ captions ============
  const cap = E.el(S.el, "abs", "left:70px;top:1500px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const CAPS = [[EVE, "On Christmas Eve, in parts of the north,"], [MAP + .2, "the table isn't cleared."], [SOULS - .1, ""],
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
  E.clip(PLACE + .4, "sfx/fs-chair-creak.wav", { vol: 0.4, duck: false });
  E.clip(THIS, "voices/ep141/o_this.wav", { vol: 1.2 });
  E.clip(AVO, "voices/ep141/g_avo.wav", { vol: 1.3 });
  E.clip(OUT, "sfx/wind-gust.wav", { vol: 0.35, duck: false });
  E.clip(0, "../tools/reel/eps/ep141-alminhas/audio/music44.wav", { vol: 0.3, to: DUR });
  E.finish(DUR);
}
