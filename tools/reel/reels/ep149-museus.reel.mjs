// EP.149 "Live in Portugal? Museums can be free for you." STYLE TEST: paper-cut stop-motion (stepped to 12 fps after render).
// "Acesso 52" (from 1 Aug 2024): residents of Portugal, incl. foreigners with a NIF, get 52 free days a year at the 37 museums,
// monuments and palaces of Museus e Monumentos de Portugal; show ID and NIF at the ticket desk (gov.pt news 06/08/2024;
// museusemonumentos.pt/pt/pagina/bilhetes). Example site: Torre de Belém (portugal.gov.pt). Legal act not found; a July 2026
// report says the minister wants to change it — RECHECK BEFORE POSTING. Music: compose.py ep149.
export const meta = {
  id: "ep149-museus", date: "2026-12-02",
  images: { belem: "characters/papercut/bg_belem.webp", torre: "characters/papercut/torre.webp", desk: "characters/papercut/desk.webp",
    cal: "characters/papercut/calendar.webp", man: "characters/papercut/man.webp", stamp: "characters/papercut/stamp.webp" },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 14.2;
  const DAYS = 3.1, N37 = 5.9, SHOW = 9.0, GRATIS = 12.2;
  const S = E.scene("museus", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
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

  // ============ 1. hook: the Torre de Belém pops up (0 – 3.0) ============
  const A = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(A, [[0, DAYS - .1]]); E.img(A, "belem", COVER);
  const torre = piece(A, "torre", 688, 1024, 1.25, 560, 1900, 4); E.K(torre, "s", [[0, .55], [.5, 1.05, "out"], [.7, 1, "io"]]); E.K(torre, "r", [[0, -6], [.5, 0, "out"]]);
  const hookWords = [["Live", .2], ["in", .4], ["Portugal?", .5, 1], ["Museums", 1.3, 1], ["can", 1.75], ["be", 1.9], ["free", 2.05, 1], ["for", 2.3], ["you.", 2.45]];
  const H = E.el(S.el, "abs", "left:40px;top:180px;width:1000px;text-align:center;z-index:30;line-height:1.25"); show(H, [[0, DAYS - .1]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:6px 8px;padding:4px 18px;background:${key ? "#ffd640" : "#f4ecd8"};color:#2b1d12;font-weight:900;font-size:92px;box-shadow:0 8px 10px rgba(40,20,0,.4);transform:rotate(${(w.length % 3 - 1) * 2}deg)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.1, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });
  A.style.transformOrigin = "50% 70%"; E.K(A, "s", [[0, 1.08], [1.2, 1.0, "out"], [2.0, 1.0], [2.2, 1.1, "out"], [DAYS, 1.12, "lin"]]);

  // ============ 2. 52 free days, 37 sites (3.1 – 8.9) ============
  const B = E.el(S.el, "abs", "inset:0;overflow:hidden;background:#e7d3b0"); show(B, [[DAYS - .1, SHOW]]);
  const kr = E.el(B, "abs", "inset:0;opacity:.35"); E.img(kr, "belem", COVER + ";filter:blur(16px) saturate(.5)");
  const cal = piece(B, "cal", 1024, 1024, .9, 540, 1150, 4); E.K(cal, "y", [[DAYS, 900], [DAYS + .35, 0, "out"]]);
  const num = E.el(B, "abs", "left:290px;top:560px;width:500px;text-align:center;font-family:Georgia,serif;font-weight:900;font-size:230px;color:#2b1d12;z-index:5;transform:rotate(-3deg);line-height:1", "52");
  E.K(num, "y", [[DAYS, 900], [DAYS + .35, 0, "out"]]);
  const fd = strip(B, "free days a year", 1180, 70, "#7dd88a", "#123b1c", -3, 6); show(fd, [[DAYS + 1.0, SHOW]]); E.pop(fd, DAYS + 1.0, { from: 1.6, dur: .2 });
  const n37 = strip(B, "37 national museums,<br>monuments &amp; palaces", 1330, 60, "#f4ecd8", "#2b1d12", 2, 6); show(n37, [[N37, SHOW]]); E.pop(n37, N37, { from: .4, dur: .2 });
  const tm = piece(B, "torre", 688, 1024, .42, 160, 560, 7); show(tm, [[N37 + .3, SHOW]]); E.pop(tm, N37 + .3, { from: .3, dur: .25 });
  const st = piece(B, "stamp", 1024, 1024, .34, 880, 640, 8); show(st, [[4.6, SHOW]]); E.K(st, "s", [[4.6, 2.4], [4.78, 1, "in"]]);
  const stt = E.el(B, "abs", "left:780px;top:366px;width:200px;height:200px;border-radius:50%;background:#f4ecd8;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:900;font-size:30px;line-height:1.05;color:#b3261e;z-index:7;transform:rotate(-10deg)", "LIVE IN<br>PORTUGAL");
  show(stt, [[4.6, SHOW]]); E.K(stt, "s", [[4.6, 2.4], [4.78, 1, "in"]]);
  B.style.transformOrigin = "50% 40%"; E.K(B, "s", [[DAYS, 1.08], [DAYS + .4, 1, "out"], [4.55, 1.0], [4.7, 1.1, "out"], [N37 - .05, 1.1], [N37 + .15, 1.0, "out"], [7.4, 1.0], [7.6, 1.12, "out"], [SHOW, 1.14, "lin"]]);

  // ============ 3. ID at the desk, "Grátis?" (9.0 – end) ============
  const C = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(C, [[SHOW - .1, DUR]]); E.img(C, "belem", COVER + ";filter:blur(4px) brightness(.9)");
  const desk = piece(C, "desk", 1024, 688, .9, 640, 1640, 4); E.K(desk, "y", [[SHOW, 800], [SHOW + .3, 0, "out"]]);
  const man = piece(C, "man", 688, 1024, .95, 250, 1900, 6); E.K(man, "x", [[SHOW, -500], [SHOW + .35, 0, "out"]]);
  E.K(man, "y", [[GRATIS, 0], [GRATIS + .15, -60, "out"], [GRATIS + .35, 0, "in"]]);
  const idc = strip(C, "ID", 590, 110, "#bfe0ff", "#0f2a6b", -6, 8); show(idc, [[9.6, DUR]]); E.pop(idc, 9.6, { from: .3, dur: .2 });
  const st2 = piece(C, "stamp", 1024, 1024, .42, 700, 1250, 9); show(st2, [[12.9, DUR]]); E.K(st2, "s", [[12.9, 2.4], [13.08, 1, "in"]]);
  const st2t = E.el(C, "abs", "left:580px;top:915px;width:240px;height:240px;border-radius:50%;background:#f4ecd8;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:900;font-size:50px;color:#b3261e;z-index:8;transform:rotate(-10deg)", "GRÁTIS");
  show(st2t, [[12.9, DUR]]); E.K(st2t, "s", [[12.9, 2.4], [13.08, 1, "in"]]);
  C.style.transformOrigin = "50% 60%"; E.K(C, "s", [[SHOW, 1.1], [SHOW + .35, 1, "out"], [10.35, 1.0], [10.5, 1.06, "out"], [12.85, 1.06], [13.0, 1.14, "out"], [DUR, 1.16, "lin"]]);

  // ============ captions ============
  const cap = E.el(S.el, "abs", "left:60px;top:1560px;width:960px;text-align:center;z-index:50", "");
  const CAPS = [[DAYS, "52 free days a year,"], [N37 - .1, "at 37 national museums, monuments and palaces."], [SHOW - .1, ""], [SHOW, "Just show your ID at the ticket desk."], [GRATIS - .1, ""],
    [GRATIS, `"Grátis?"<br><span style='font-size:40px;color:#7a5a12'>(Free?)</span>`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#f4ecd8;color:#2b1d12;padding:12px 28px;font-weight:800;font-size:50px;transform:rotate(-1.5deg);box-shadow:0 8px 10px rgba(40,20,0,.45)">${s}</span>` : ""; } });

  E.clip(0, "sfx/big-wave.wav", { vol: 0.2, to: DAYS, duck: false });
  E.clip(0, "sfx/elx-paper-unfold.wav", { vol: 0.5, duck: false });
  E.clip(0.15, "voices/ep149/n149_hook.wav", { vol: 1.2 });
  E.clip(DAYS, "voices/ep149/n149_days.wav", { vol: 1.2 });
  E.clip(DAYS, "sfx/elx-page-flip.wav", { vol: 0.4, duck: false });
  E.clip(4.6, "sfx/fs-rubber-stamp.wav", { vol: 0.6, duck: false });
  E.clip(SHOW, "voices/ep149/n149_show.wav", { vol: 1.2 });
  E.clip(GRATIS, "voices/ep149/o149_gratis.wav", { vol: 1.3 });
  E.clip(12.9, "sfx/fs-rubber-stamp.wav", { vol: 0.8, duck: false });
  E.clip(0, "../tools/reel/eps/ep149-museus/audio/music44.wav", { vol: 0.26, to: DUR });
  E.finish(DUR);
}
