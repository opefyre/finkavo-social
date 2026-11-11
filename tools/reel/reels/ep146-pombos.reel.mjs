// EP.146 "Feeding pigeons in Lisbon can cost you €1,000." STYLE TEST: paper-cut stop-motion (Higgsfield paper pieces, stepped to
// 12 fps after render). Lisbon Regulamento de Gestão de Resíduos, Limpeza e Higiene Urbana (Aviso n.º 20811-B/2019, DR 2.ª série
// n.º 251, 31 Dec 2019) art. 84.º n.º 2 a): scattering food on streets/public spaces likely to attract stray animals, namely dogs,
// cats and pigeons: €50–€1,000 for individuals (negligence halves the limits, art. 86.º). Amendments since 2019 not checked.
// Music: compose.py ep146.
export const meta = {
  id: "ep146-pombos", date: "2026-11-28",
  images: { sq: "characters/papercut/bg_square.webp", pg: "characters/papercut/pigeon.webp", pf: "characters/papercut/pigeon_fly.webp",
    bread: "characters/papercut/bread.webp", man: "characters/papercut/man_hide.webp", stamp: "characters/papercut/stamp.webp" },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 12.6;
  const FINE = 3.9, NOTICE = 6.0, WHAT = 7.6, NAO = 10.4;
  const S = E.scene("pombos", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  let seed = 1;
  const jit = (P, amt = 3) => {
    const k = seed++; const w = E.el(P, "abs", "inset:0;pointer-events:none");
    E.F(t => { const s = Math.floor(t * 12) + k * 97; const r = x => (Math.sin(x * 12.9898) * 43758.5453) % 1;
      w.style.transform = `translate(${r(s) * amt}px,${r(s + 3) * amt}px) rotate(${r(s + 7) * amt * .15}deg)`; });
    return w;
  };
  const piece = (P, n, w, h, s, cx, bottom, z = 3, flip = false) => {
    const J = jit(P); J.style.zIndex = z;
    const el = E.el(J, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;transform-origin:50% 100%;filter:drop-shadow(0 12px 9px rgba(40,20,0,.45))`);
    E.img(el, n, `width:${w * s}px;height:${h * s}px;${flip ? "transform:scaleX(-1)" : ""}`); return el;
  };
  const strip = (P, html, top, size, bg = "#f4ecd8", col = "#2b1d12", rot = -2, z = 10) => {
    const J = jit(P, 2); J.style.zIndex = z;
    return E.el(J, "abs", `left:60px;top:${top}px;width:960px;text-align:center`, `<span style="display:inline-block;background:${bg};color:${col};padding:14px 34px;font-weight:900;font-size:${size}px;line-height:1.1;transform:rotate(${rot}deg);box-shadow:0 10px 14px rgba(40,20,0,.4)">${html}</span>`);
  };
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ the square: bread falls, pigeons pour in (0 – 10.3) ============
  const A = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(A, [[0, NAO - .2]]);
  const bg = E.el(A, "abs", "inset:0"); E.img(bg, "sq", COVER);
  const bread = piece(A, "bread", 1024, 688, .55, 540, 1520, 4); E.K(bread, "y", [[0, -900], [.35, 0, "in"]]); E.K(bread, "s", [[.35, 1.15], [.5, 1, "out"]]);
  // flyers swoop in, then stand around the bread
  const spots = [[260, 1560, .38, 0], [820, 1590, .4, 1], [380, 1700, .45, 0], [700, 1740, .46, 1], [140, 1760, .5, 0], [950, 1800, .5, 1],
    [520, 1820, .52, 0], [250, 1890, .55, 1], [860, 1930, .56, 0], [600, 1650, .36, 1]];
  spots.forEach(([x, y, s, flip], i) => {
    const t0 = .5 + i * (i < 6 ? .45 : .6);
    const fx = flip ? 1300 : -300;
    const fl = piece(A, "pf", 1024, 1024, s * 1.1, x, y - 120, 5 + i, !flip); show(fl, [[t0, t0 + .5]]);
    E.K(fl, "x", [[t0, fx - x], [t0 + .5, 0, "out"]]); E.K(fl, "y", [[t0, -700], [t0 + .5, 0, "out"]]);
    const st = piece(A, "pg", 1024, 1024, s, x, y, 5 + i, !!flip); show(st, [[t0 + .5, NAO]]);
    E.K(st, "r", Array.from({ length: 10 }, (_, k) => [t0 + .6 + k * .55 + i * .07, k % 2 ? 0 : 14, "io"]));  // pecking
  });
  const hookWords = [["Feeding", .2, 1], ["pigeons", .45, 1], ["in", .9], ["Lisbon", 1.0], ["can", 1.6], ["cost", 1.75], ["you", 1.95], ["€1,000.", 2.2, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:200px;width:1000px;text-align:center;z-index:30;line-height:1.25"); show(H, [[0, FINE - .1]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:6px 8px;padding:4px 18px;background:${key ? "#ffd640" : "#f4ecd8"};color:#2b1d12;font-weight:900;font-size:96px;box-shadow:0 8px 10px rgba(40,20,0,.4);transform:rotate(${(w.length % 3 - 1) * 2}deg)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.1, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });
  // the fine
  const stp = piece(A, "stamp", 1024, 1024, .62, 540, 1000, 40); show(stp, [[NOTICE, NAO]]); E.K(stp, "s", [[NOTICE, 2.4], [NOTICE + .18, 1, "in"]]);
  const amt = E.el(A, "abs", "left:340px;top:482px;width:400px;height:400px;border-radius:50%;background:#f4ecd8;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:900;font-size:80px;line-height:1.05;color:#b3261e;z-index:39;transform:rotate(-8deg)", "€50 –<br>€1,000");
  show(amt, [[NOTICE, NAO]]); E.K(amt, "s", [[NOTICE, 2.4], [NOTICE + .18, 1, "in"]]);
  const what = strip(A, "food that attracts pigeons,<br>cats or dogs", 1080, 60, "#f4ecd8", "#2b1d12", 2, 42); show(what, [[WHAT, NAO]]); E.pop(what, WHAT, { from: .4, dur: .2 });
  const law = strip(A, "Lisbon urban hygiene rules, art. 84.º", 1310, 34, "#2b1d12", "#f4ecd8", -1, 42); show(law, [[WHAT + .5, NAO]]);
  A.style.transformOrigin = "50% 75%";
  E.K(A, "s", [[0, 1.0], [FINE - .05, 1.06, "lin"], [FINE + .15, 1.2, "out"], [NOTICE - .05, 1.2], [NOTICE + .1, 1.0, "out"], [WHAT - .05, 1.0], [WHAT + .15, 1.1, "out"], [9.0, 1.1], [9.2, 1.0, "out"], [NAO, 1.03, "lin"]]);
  E.F(t => { bg.style.filter = t >= NOTICE && t < NAO ? "brightness(.75) saturate(.8)" : "none"; });

  // ============ "Não fui eu!" (10.4 – end) ============
  const C = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(C, [[NAO - .2, DUR]]); E.img(C, "sq", COVER + ";filter:blur(3px)");
  const man = piece(C, "man", 688, 1024, 1.2, 690, 1930, 5); E.K(man, "x", [[NAO - .2, 300], [NAO + .1, 0, "out"]]);
  const big = piece(C, "pg", 1024, 1024, .75, 300, 1880, 6, false);
  E.K(big, "s", [[NAO - .2, .8], [11.5, .8], [11.7, 1.18, "out"], [DUR, 1.22, "lin"]]); E.K(big, "r", [[11.6, 0], [11.8, -6, "io"]]);
  E.K(C, "s", [[NAO - .2, 1.1], [NAO + .2, 1, "out"], [11.55, 1], [11.75, 1.08, "out"], [DUR, 1.1, "lin"]]); C.style.transformOrigin = "40% 70%";

  // ============ captions ============
  const cap = E.el(S.el, "abs", "left:60px;top:1560px;width:960px;text-align:center;z-index:50", "");
  const CAPS = [[FINE, "Leaving food in the street that attracts"], [5.6, "pigeons, cats or dogs?"], [NOTICE + .5, ""], [7.9, "€50 to €1,000."], [NAO - .2, ""],
    [NAO, `"Não fui eu!"<br><span style='font-size:40px;color:#7a5a12'>(It wasn't me!)</span>`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#f4ecd8;color:#2b1d12;padding:12px 28px;font-weight:800;font-size:52px;transform:rotate(-1.5deg);box-shadow:0 8px 10px rgba(40,20,0,.45)">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0, "sfx/street-sunny.wav", { vol: 0.25, to: NAO, duck: false });
  E.clip(0.15, "voices/ep146/n146_hook.wav", { vol: 1.2 });
  for (const t of [.5, 1.4, 2.3, 3.1, 4.2, 5.4]) E.clip(t, "sfx/pigeon-flutter.wav", { vol: 0.3, duck: false });
  E.clip(1.5, "sfx/coo.wav", { vol: 0.35, duck: false });
  E.clip(FINE, "voices/ep146/n146_fine.wav", { vol: 1.2 });
  E.clip(NOTICE, "sfx/fs-rubber-stamp.wav", { vol: 0.8, duck: false });
  E.clip(NAO, "voices/ep146/o146_naofui.wav", { vol: 1.3 });
  E.clip(11.6, "sfx/coo.wav", { vol: 0.5, duck: false });
  E.clip(0, "../tools/reel/eps/ep146-pombos/audio/music44.wav", { vol: 0.26, to: DUR });
  E.finish(DUR);
}
