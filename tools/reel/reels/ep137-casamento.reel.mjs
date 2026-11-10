// EP.137 "Getting married in Portugal costs… how much?" — a couple at a registry desk (real Kling clip). At the registry: €120 for
// the whole marriage process and registration (Regulamento Emolumentar dos Registos e Notariado, art. 18 n.º 3.1; IRN price list).
// Otto: "That's it?!" Narrator: that's the wedding; then there's the party. The receipt keeps printing (a joke total, not a statistic).
// Grandma: "O casamento é barato. A festa é que não." (The wedding is cheap. The party isn't.) Music: compose.py ep137.
export const meta = {
  id: "ep137-casamento", date: "2026-11-21",
  images: {
    registo: "characters/scenes/bg_registo.webp", otto: "characters/cutouts/otto-coat_ask.webp", zoe: "characters/cutouts/zoe_date.webp",
    party: "characters/scenes/bg_party.webp", dona: "characters/cutouts/dona_point.webp", pig: "characters/props/roast-pig.webp", cake: "characters/props/tier-cake.webp",
  },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 17.2;
  const FEE = 3.1, PRICE = 5.0, WHAT = 7.2, PARTY = 8.1, RUN = 10.0, AVO = 13.2;
  const S = E.scene("wedding", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. the real clip (0 – 3.0) ============
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff"); show(M, [[0, FEE - .1]]);
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);
  const hookWords = [["Getting", .2], ["married", .4, 1], ["in", .8], ["Portugal", .9], ["costs…", 1.4], ["how", 2.0, 1], ["much?", 2.2, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:240px;width:1000px;text-align:center;z-index:10;line-height:1.08"); show(H, [[0, FEE - .1]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:104px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  // ============ 2. at the registry counter (3.1 – 13.2) ============
  const R = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(R, [[FEE - .1, AVO]]); E.img(R, "registo", COVER);
  const oz = fig(R, "zoe", 509, 1113, 1.0, 280, 1880, 5); E.K(oz, "x", [[FEE, -500], [FEE + .3, 0, "out"]]);
  const oo = fig(R, "otto", 668, 1024, 1.05, 560, 1880, 6); E.K(oo, "x", [[FEE + .1, -700], [FEE + .4, 0, "out"]]);
  E.K(oo, "s", [[WHAT, 1], [WHAT + .1, 1.12, "out"], [WHAT + .3, 1, "io"]]);
  // the receipt: a strip that keeps growing
  const rc = E.el(R, "abs", "left:540px;top:260px;width:500px;height:0;background:#fbfaf6;box-shadow:0 20px 40px rgba(0,0,0,.35);z-index:7;overflow:hidden;font-family:'Courier New',monospace;color:#1d2b36;font-weight:800");
  const lines = [[PRICE - .6, "CONSERVATÓRIA", 30], [PRICE - .3, "(registry office)", 22], [PRICE, "Processo e registo", 26], [PRICE, "de casamento   €120", 30],
    [RUN, "--- the party ---", 26], [RUN + .3, "200 cousins", 28], [RUN + .6, "1 whole roast pig", 28], [RUN + .9, "the band", 28], [RUN + 1.2, "5-tier cake", 28],
    [RUN + 1.5, "dress, flowers…", 28], [RUN + 2.0, "TOTAL ≈ €20,000*", 32], [RUN + 2.2, "*a guess, not a stat", 20]];
  lines.forEach(([t, s, fs], i) => { const l = E.el(rc, "abs", `left:24px;top:${30 + i * 50}px;width:460px;font-size:${fs}px;${i === 3 ? "color:#2a7a3a;font-size:36px" : ""}${i === 10 ? "color:#e0533d" : ""}`, s); show(l, [[t, AVO]]); });
  E.F(t => { const n = lines.filter(([lt]) => t >= lt).length; rc.style.height = (n ? 60 + n * 50 : 0) + "px"; });
  const big = E.el(R, "abs", "left:120px;top:300px;width:440px;text-align:center;font-weight:900;font-size:150px;color:#2a7a3a;-webkit-text-stroke:4px #fff;z-index:8;opacity:0", "€120");
  show(big, [[PRICE, PARTY]]); E.pop(big, PRICE, { from: 2, dur: .18 });
  const pig = fig(R, "pig", 1102, 580, .45, 260, 1180, 8); show(pig, [[RUN + .6, AVO]]); E.pop(pig, RUN + .6, { from: .3, dur: .2 });
  const cake = fig(R, "cake", 491, 978, .42, 200, 900, 8); show(cake, [[RUN + 1.2, AVO]]); E.pop(cake, RUN + 1.2, { from: .3, dur: .2 });
  R.style.transformOrigin = "70% 30%";
  E.K(R, "s", [[FEE, 1.05], [FEE + .3, 1, "out"], [PRICE - .1, 1.02, "lin"], [PRICE, 1.25, "out"], [WHAT - .1, 1.27, "lin"], [WHAT, 1.0, "out"], [PARTY, 1.02, "lin"], [RUN, 1.0], [RUN + .2, 1.3, "out"], [AVO, 1.45, "lin"]]);
  E.F(t => { R.style.filter = t >= RUN ? "saturate(1.3)" : "none"; });

  // ============ 3. grandma (13.2 – end) ============
  const A = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(A, [[AVO, DUR]]); E.img(A, "party", COVER);
  const dn = fig(A, "dona", 688, 1024, 1.15, 540, 1880, 5); E.pop(dn, AVO, { from: .85, dur: .2 });
  E.K(A, "s", [[AVO, 1.05], [DUR, 1.14, "lin"]]); A.style.transformOrigin = "50% 60%";

  // ============ captions ============
  const cap = E.el(S.el, "abs", "left:70px;top:1385px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const CAPS = [[FEE, "At the registry:"], [PRICE, "€120. The whole thing."], [WHAT - .1, ""], [WHAT, "\"That's it?!\""], [PARTY, "That's the wedding."], [PARTY + 1.1, "Then there's the party."], [RUN + 2.6, ""],
    [AVO, `"O casamento é barato. A festa é que não."${sub("The wedding is cheap. The party isn't.")}`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0.05, "sfx/elx-page-flip.wav", { vol: 0.4, duck: false });
  E.clip(0.15, "voices/ep137/n_hook7.wav", { vol: 1.2 });
  E.clip(FEE, "voices/ep137/n_fee.wav", { vol: 1.2 });
  E.clip(PRICE - .6, "sfx/printer.wav", { vol: 0.35, to: PRICE + .5, duck: false });
  E.clip(PRICE, "sfx/cash-register.wav", { vol: 0.5, duck: false });
  E.clip(WHAT, "voices/ep137/o_thatsit.wav", { vol: 1.25 });
  E.clip(PARTY, "voices/ep137/n_party.wav", { vol: 1.2 });
  E.clip(RUN, "sfx/printer.wav", { vol: 0.4, to: RUN + 2.4, duck: false });
  E.clip(RUN, "sfx/wedding-party.wav", { vol: 0.25, to: AVO, duck: false });
  E.clip(AVO, "voices/ep137/g_festa.wav", { vol: 1.3 });
  E.clip(0, "../tools/reel/eps/ep137-casamento/audio/music44.wav", { vol: 0.28, to: DUR });
  E.finish(DUR);
}
