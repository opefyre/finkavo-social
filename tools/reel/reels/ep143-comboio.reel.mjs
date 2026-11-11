// EP.143 "Trains across Portugal for €20 a month?" STYLE TEST: paper-cut stop-motion (Higgsfield paper pieces, stepped to 12 fps
// after render: ffmpeg -vf "fps=12,fps=30"). Source: CP, Passe Ferroviário Verde (cp.pt/info/w/green-rail-pass, opened 11 Nov 2026):
// €20 / 30 days, residents of Portugal (Portuguese and foreign), 2nd class, Regional, InterRegional, Intercidades (free mandatory
// seat booking) and the Coimbra, Lisbon and Porto urban trains; not on the closed list: Alfa Pendular; not valid on IC-E.
// Music: compose.py ep143.
export const meta = {
  id: "ep143-comboio", date: "2026-11-26",
  images: { douro: "characters/papercut/bg_douro.webp", coast: "characters/papercut/bg_coast.webp", train: "characters/papercut/train.webp",
    pass: "characters/papercut/pass.webp", seat: "characters/papercut/man_seat.webp", stamp: "characters/papercut/stamp.webp" },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 16.4;
  const PASS = 3.5, WHICH = 8.0, VINTE = 14.1;
  const S = E.scene("comboio", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  let seed = 1;
  const jit = (P, amt = 3) => {
    const k = seed++; const w = E.el(P, "abs", "inset:0;pointer-events:none");
    E.F(t => { const s = Math.floor(t * 12) + k * 97; const r = x => (Math.sin(x * 12.9898) * 43758.5453) % 1;
      w.style.transform = `translate(${r(s) * amt}px,${r(s + 3) * amt}px) rotate(${r(s + 7) * amt * .15}deg)`; });
    return w;
  };
  const piece = (P, n, w, h, s, cx, bottom, z = 3, shadow = true) => {
    const J = jit(P); J.style.zIndex = z;
    const el = E.el(J, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;transform-origin:50% 100%;${shadow ? "filter:drop-shadow(0 14px 10px rgba(40,20,0,.45))" : ""}`);
    E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el;
  };
  const strip = (P, html, top, size, bg = "#f4ecd8", col = "#2b1d12", rot = -2, z = 10, left = 60, width = 960) => {
    const J = jit(P, 2); J.style.zIndex = z;
    return E.el(J, "abs", `left:${left}px;top:${top}px;width:${width}px;text-align:center`, `<span style="display:inline-block;background:${bg};color:${col};padding:14px 34px;font-weight:900;font-size:${size}px;line-height:1.1;transform:rotate(${rot}deg);box-shadow:0 10px 14px rgba(40,20,0,.4)">${html}</span>`);
  };
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. hook: a paper train runs the Douro (0 – 3.4) ============
  const A = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(A, [[0, PASS - .1]]); E.img(A, "douro", COVER);
  const tr = piece(A, "train", 1024, 688, .62, 540, 1420, 4);
  tr.style.transformOrigin = "50% 70%"; tr.style.rotate = "19deg";
  E.K(tr, "x", [[0, -760], [PASS, 380, "lin"]]); E.K(tr, "y", [[0, 161], [PASS, 430, "lin"]]);
  const hookWords = [["Trains", .2, 1], ["across", .55], ["Portugal,", .8], ["for", 1.6], ["€20", 1.8, 1], ["a", 2.3], ["month?", 2.45, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:200px;width:1000px;text-align:center;z-index:11;line-height:1.25"); show(H, [[0, PASS - .1]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:6px 8px;padding:4px 18px;background:${key ? "#ffd640" : "#f4ecd8"};color:#2b1d12;font-weight:900;font-size:96px;box-shadow:0 8px 10px rgba(40,20,0,.4);transform:rotate(${(w.length % 3 - 1) * 2}deg)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.1, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  // ============ 2. the pass (3.5 – 7.9) ============
  const B = E.el(S.el, "abs", "inset:0;overflow:hidden;background:#cfe3d4"); show(B, [[PASS - .1, WHICH]]);
  const blur = E.el(B, "abs", "inset:0;opacity:.45"); E.img(blur, "douro", COVER + ";filter:blur(16px) saturate(.6)");
  const pass = piece(B, "pass", 1024, 688, .95, 540, 1150, 4); E.K(pass, "y", [[PASS, 900], [PASS + .35, 0, "out"]]); E.K(pass, "r", [[PASS, 12], [PASS + .35, -3, "out"]]);
  const big = E.el(B, "abs", "left:200px;top:650px;width:680px;text-align:center;font-weight:900;color:#1d5b3a;z-index:5;line-height:1;transform:rotate(-3deg)",
    "<span style='font-size:230px'>€20</span><br><span style='font-size:64px'>30 DAYS</span>");
  E.K(big, "y", [[PASS, 900], [PASS + .35, 0, "out"]]);
  const st = piece(B, "stamp", 1024, 1024, .4, 830, 1320, 7); show(st, [[5.2, WHICH]]); E.K(st, "s", [[5.2, 2.4], [5.38, 1, "in"]]);
  const stt = E.el(B, "abs", "left:690px;top:1080px;width:280px;text-align:center;font-weight:900;font-size:40px;line-height:1.05;color:#b3261e;z-index:8;transform:rotate(-10deg)", "LIVE IN<br>PORTUGAL");
  show(stt, [[5.2, WHICH]]); E.K(stt, "s", [[5.2, 2.4], [5.38, 1, "in"]]);
  B.style.transformOrigin = "50% 45%"; E.K(B, "s", [[PASS, 1.08], [PASS + .4, 1, "out"], [5.15, 1.02, "lin"], [5.25, 1.1, "out"], [WHICH, 1.05, "lin"]]);

  // ============ 3. which trains (8.0 – 13.9) ============
  const C = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(C, [[WHICH - .1, VINTE - .1]]);
  const cbg = E.el(C, "abs", "inset:0;transform:scale(1.07)"); E.img(cbg, "coast", COVER);
  const tr2 = piece(C, "train", 1024, 688, .55, 540, 1330, 4);
  tr2.style.transformOrigin = "50% 70%"; tr2.style.rotate = "20.5deg";
  E.K(tr2, "x", [[WHICH, -800], [VINTE, 500, "lin"]]); E.K(tr2, "y", [[WHICH, 190], [VINTE, 600, "lin"]]);
  const tags = [["Regional ✓", 8.7, "#f4ecd8", "#1d5b3a"], ["Intercidades ✓", 9.6, "#f4ecd8", "#1d5b3a"], ["Lisbon &amp; Porto urban ✓", 10.6, "#f4ecd8", "#1d5b3a"], ["Alfa Pendular ✗", 11.9, "#e8b4ad", "#8f1d16"]];
  tags.forEach(([txt, t, bg, col], i) => { const tg = strip(C, txt, 230 + i * 125, 66, bg, col, i % 2 ? 2 : -2); show(tg, [[t, VINTE - .1]]); E.pop(tg, t, { from: .4, dur: .2 }); });
  E.K(cbg, "s", [[WHICH, 1.12], [WHICH + .3, 1.07, "out"]]);
  C.style.transformOrigin = "50% 35%"; E.K(C, "s", [[8.65, 1], [8.8, 1.14, "out"], [9.55, 1.14], [9.7, 1, "out"], [10.55, 1], [10.7, 1.16, "out"], [11.85, 1.16], [12.0, 1.0, "out"], [12.9, 1.0], [13.1, 1.12, "out"], [VINTE, 1.14, "lin"]]);
  E.F(t => { cbg.style.filter = t >= 11.9 ? "saturate(.55) sepia(.25) hue-rotate(-20deg)" : "none"; });

  // ============ 4. "Vinte euros!" at the window (14.1 – end) ============
  const D = E.el(S.el, "abs", "inset:0;overflow:hidden;background:#3a4a6b"); show(D, [[VINTE - .1, DUR]]);
  const win = E.el(D, "abs", "left:90px;top:260px;width:900px;height:760px;border-radius:70px;overflow:hidden;border:26px solid #e9e4d8;box-shadow:inset 0 0 0 6px #b9b2a2,0 18px 30px rgba(0,0,0,.4)");
  const land = E.el(win, "abs", "left:0;top:-300px;width:2200px;height:1400px"); E.img(land, "douro", "position:absolute;left:0;top:0;width:2200px;height:1400px;object-fit:cover");
  E.K(land, "x", [[VINTE, 0], [DUR, -1100, "lin"]]);
  const seat = piece(D, "seat", 688, 1024, 1.25, 560, 1960, 6); E.K(seat, "y", [[VINTE, 400], [VINTE + .3, 0, "out"]]);
  E.K(seat, "r", [[VINTE + .5, 0], [VINTE + .7, -3, "io"], [VINTE + .9, 2, "io"], [VINTE + 1.1, 0, "io"]]);

  // ============ captions ============
  const cap = E.el(S.el, "abs", "left:60px;top:1560px;width:960px;text-align:center;z-index:12", "");
  const CAPS = [[PASS, "If you live in Portugal,"], [5.2, "€20 buys 30 days on most CP trains."], [WHICH - .1, ""], [WHICH, "Regionals, Intercidades, city lines."],
    [11.9, "Just not the Alfa Pendular."], [VINTE - .1, ""], [VINTE, `"Vinte euros!"<br><span style='font-size:40px;color:#7a5a12'>(Twenty euros!)</span>`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#f4ecd8;color:#2b1d12;padding:12px 28px;font-weight:800;font-size:52px;transform:rotate(-1.5deg);box-shadow:0 8px 10px rgba(40,20,0,.45)">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0, "sfx/tram-pass.wav", { vol: 0.3, to: PASS, duck: false });
  E.clip(0.15, "voices/ep143/n143_hook.wav", { vol: 1.2 });
  E.clip(PASS, "sfx/elx-paper-unfold.wav", { vol: 0.5, duck: false });
  E.clip(PASS + .1, "voices/ep143/n143_pass.wav", { vol: 1.2 });
  E.clip(5.2, "sfx/fs-rubber-stamp.wav", { vol: 0.7, duck: false });
  E.clip(WHICH, "voices/ep143/n143_which.wav", { vol: 1.2 });
  E.clip(WHICH, "sfx/tram-pass.wav", { vol: 0.18, to: VINTE, duck: false });
  E.clip(VINTE, "voices/ep143/o143_vinte.wav", { vol: 1.3 });
  E.clip(0, "../tools/reel/eps/ep143-comboio/audio/music44.wav", { vol: 0.26, to: DUR });
  E.finish(DUR);
}
