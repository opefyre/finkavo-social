// EP.152 "A free dentist in Portugal? There's a voucher." STYLE TEST: paper-cut stop-motion (stepped to 12 fps after render).
// SNS 24 (sns24.gov.pt/pt/servico/cheques-dentista): vouchers for groups of particular vulnerability — under 18, pregnant women
// followed in the SNS, Complemento Solidário para Idosos recipients, people with HIV/AIDS, higher oral-cancer risk; usually issued
// at a health-centre appointment (ages 7 and 10 at school); used at participating dentists anywhere in Portugal. Voucher value not
// confirmed: kept out. DGS page outdated (3–15). Music: compose.py ep152.
export const meta = {
  id: "ep152-dentista", date: "2026-12-04",
  images: { centro: "characters/papercut/bg_centro.webp", sad: "characters/papercut/tooth_sad.webp", happy: "characters/papercut/tooth_happy.webp",
    voucher: "characters/papercut/voucher.webp", chair: "characters/papercut/chair_kid.webp" },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 16.6;
  const WHAT = 3.2, WHO = 7.2, JA = 14.1;
  const S = E.scene("dentista", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const COVER = "position:absolute;left:-60px;top:-90px;width:1200px;height:2140px;object-fit:cover";
  let seed = 1;
  const jit = (P, amt = 3) => {
    const k = seed++; const w = E.el(P, "abs", "inset:0;pointer-events:none");
    E.F(t => { const s = Math.floor(t * 12) + k * 97; const r = x => (Math.sin(x * 12.9898) * 43758.5453) % 1;
      w.style.transform = `translate(${r(s) * amt}px,${r(s + 3) * amt}px) rotate(${r(s + 7) * amt * .15}deg)`; });
    return w;
  };
  const piece = (P, n, w, h, s, cx, bottom, z = 3) => {
    const J = jit(P); J.style.zIndex = z;
    const el = E.el(J, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;transform-origin:50% 100%;filter:drop-shadow(0 14px 10px rgba(40,20,0,.45))`);
    E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el;
  };
  const strip = (P, html, top, size, bg = "#f4ecd8", col = "#2b1d12", rot = -2, z = 10) => {
    const J = jit(P, 2); J.style.zIndex = z;
    return E.el(J, "abs", `left:60px;top:${top}px;width:960px;text-align:center`, `<span style="display:inline-block;background:${bg};color:${col};padding:14px 34px;font-weight:900;font-size:${size}px;line-height:1.1;transform:rotate(${rot}deg);box-shadow:0 10px 14px rgba(40,20,0,.4)">${html}</span>`);
  };
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. hook: a sad tooth outside the health centre (0 – 3.1) ============
  const A = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(A, [[0, WHO - .1]]); E.img(A, "centro", COVER);
  const sad = piece(A, "sad", 1024, 1024, .62, 540, 1500, 4); show(sad, [[0, WHAT - .1]]);
  E.K(sad, "r", Array.from({ length: 12 }, (_, k) => [k * .25, k % 2 ? 5 : -5, "io"]));
  const hookWords = [["A", .2], ["free", .3, 1], ["dentist", .5, 1], ["in", .95], ["Portugal?", 1.05], ["There's", 1.8], ["a", 2.0], ["voucher.", 2.1, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:180px;width:1000px;text-align:center;z-index:30;line-height:1.25"); show(H, [[0, WHAT - .1]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:6px 8px;padding:4px 18px;background:${key ? "#ffd640" : "#f4ecd8"};color:#2b1d12;font-weight:900;font-size:94px;box-shadow:0 8px 10px rgba(40,20,0,.4);transform:rotate(${(w.length % 3 - 1) * 2}deg)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.1, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });
  // 2. the voucher slides out of the health centre (3.2 – 6.8)
  const v = piece(A, "voucher", 1024, 688, .95, 540, 1300, 6); show(v, [[WHAT, WHO]]);
  E.K(v, "y", [[WHAT, 400], [WHAT + .35, 0, "out"]]); E.K(v, "s", [[WHAT, .3], [WHAT + .35, 1, "out"]]);
  const vt = E.el(A, "abs", "left:150px;top:860px;width:620px;text-align:center;font-weight:900;font-size:76px;color:#1f4f7a;z-index:7;transform:rotate(-2deg);line-height:1.05", "cheque-<br>dentista");
  show(vt, [[WHAT + .3, WHO]]); E.K(vt, "y", [[WHAT, 400], [WHAT + .35, 0, "out"]]);
  const hc = strip(A, "from your health centre", 1360, 62, "#f4ecd8", "#2b1d12", 2, 12); show(hc, [[4.9, WHO]]); E.pop(hc, 4.9, { from: .4, dur: .2 });
  E.F(t => { A.firstChild.style.filter = t >= WHAT ? "blur(5px) brightness(.85)" : "none"; });
  A.style.transformOrigin = "50% 55%"; E.K(A, "s", [[0, 1.0], [WHAT - .05, 1.04, "lin"], [WHAT + .2, 1.12, "out"], [4.85, 1.12], [5.0, 1.0, "out"], [WHO, 1.03, "lin"]]);

  // ============ 3. who (6.9 – 13.8) ============
  const B = E.el(S.el, "abs", "inset:0;overflow:hidden;background:#cfe6f3"); show(B, [[WHO - .1, JA - .1]]);
  const bb = E.el(B, "abs", "inset:0;opacity:.4"); E.img(bb, "centro", COVER + ";filter:blur(14px) saturate(.6)");
  const t2s = piece(B, "sad", 1024, 1024, .38, 820, 640, 4); show(t2s, [[WHO, 12.9]]);
  const t2h = piece(B, "happy", 1024, 1024, .42, 820, 650, 4); show(t2h, [[12.9, JA]]); E.K(t2h, "s", [[12.9, .5], [13.15, 1.15, "out"], [13.3, 1, "io"]]);
  const tags = [["under 18", 7.9, "#ffd640"], ["pregnant, followed by the SNS", 9.0, "#bfe0ff"], ["some older people", 10.3, "#ffc9d6"], ["at participating dentists", 11.9, "#9fdc8f"]];
  tags.forEach(([txt, t, bg], i) => { const tg = strip(B, txt, 660 + i * 195, 62, bg, "#2b1d12", i % 2 ? 2 : -2); show(tg, [[t, JA]]); E.pop(tg, t, { from: .4, dur: .2 }); });
  B.style.transformOrigin = "50% 50%"; E.K(B, "s", [[WHO, 1.08], [WHO + .35, 1, "out"], [8.95, 1], [9.1, 1.06, "out"], [10.25, 1.06], [10.4, 1.0, "out"], [11.85, 1.0], [12.0, 1.08, "out"], [12.85, 1.08], [13.05, 1.0, "out"], [JA, 1.03, "lin"]]);
  E.F(t => { B.style.background = t < 11.9 ? "#cfe6f3" : "#e3f3d9"; });

  // ============ 4. "Já está?" (13.9 – end) ============
  const C = E.el(S.el, "abs", "inset:0;overflow:hidden;background:#e8f4f2"); show(C, [[JA - .1, DUR]]);
  const cbg = E.el(C, "abs", "inset:0;opacity:.3"); E.img(cbg, "centro", COVER + ";filter:blur(18px)");
  const ch = piece(C, "chair", 1024, 1024, 1.0, 540, 1700, 5); E.K(ch, "s", [[JA - .1, .85], [JA + .2, 1, "out"]]);
  const sp = piece(C, "happy", 1024, 1024, .25, 880, 520, 6); E.K(sp, "r", [[JA, -10], [JA + .4, 10, "io"], [JA + .8, -10, "io"], [JA + 1.2, 10, "io"], [JA + 1.6, -6, "io"]]);
  E.K(C, "s", [[JA, 1.0], [DUR, 1.08, "lin"]]);

  // ============ captions ============
  const cap = E.el(S.el, "abs", "left:60px;top:1600px;width:960px;text-align:center;z-index:50", "");
  const CAPS = [[WHAT, "It's called the cheque-dentista."], [4.9, "Your health centre gives it out."], [WHO - .1, ""], [WHO, "For under-18s, pregnant women followed by the SNS,"],
    [10.3, "and some older people."], [11.9, "At participating dentists."], [JA - .1, ""], [JA, `"Já está?"<br><span style='font-size:40px;color:#7a5a12'>(Done already?)</span>`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#f4ecd8;color:#2b1d12;padding:12px 28px;font-weight:800;font-size:48px;transform:rotate(-1.5deg);box-shadow:0 8px 10px rgba(40,20,0,.45)">${s}</span>` : ""; } });

  E.clip(0, "sfx/teeth-chatter.wav", { vol: 0.3, to: 1.5, duck: false });
  E.clip(0.15, "voices/ep152/n152_hook.wav", { vol: 1.2 });
  E.clip(WHAT, "sfx/elx-paper-unfold.wav", { vol: 0.5, duck: false });
  E.clip(WHAT, "voices/ep152/n152_what.wav", { vol: 1.2 });
  E.clip(WHO, "voices/ep152/n152_who.wav", { vol: 1.2 });
  E.clip(12.9, "sfx/app-success.wav", { vol: 0.3, duck: false });
  E.clip(JA - .3, "sfx/elx-dental-drill.wav", { vol: 0.2, to: JA, duck: false });
  E.clip(JA, "voices/ep152/o152_jaesta.wav", { vol: 1.3 });
  E.clip(0, "../tools/reel/eps/ep152-dentista/audio/music44.wav", { vol: 0.26, to: DUR });
  E.finish(DUR);
}
