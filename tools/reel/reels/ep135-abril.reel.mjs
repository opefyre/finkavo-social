// EP.135 "Why do so many Portuguese streets have this name?" — a "Rua 25 de Abril" tile sign as a tram climbs (real Kling clip).
// 25 April 1974: at 22:55 a song on the radio was signal one; at 00:20 "Grândola" on Rádio Renascença was signal two (Museu do
// Aljube timeline). A woman handed soldiers carnations; they put them in their rifles (RTP). 48 years of dictatorship (1926–1974)
// ended in a day. Today it's a public holiday (Código do Trabalho art. 234) and a street name across the country (no official count,
// so no number). Grandma: "Eu estava lá." (I was there.) No real songs are played. Music: compose.py ep135.
// Real clips under magenta: 0–2.9 (the sign) and 15.2–18.6 (the carnation), laid from media/clip.mp4.
export const meta = {
  id: "ep135-abril", date: "2026-11-19",
  images: { avo: "characters/scenes/bg_avo.webp", dona: "characters/cutouts/dona_seated.webp" },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 27.85;
  const DATE = 3.0, SIG1 = 7.6, SIG2 = 10.3, MOVE = 13.0, CARN = 15.2, DICT = 18.7, TODAY = 22.0, SIGNS = 23.6, AVO = 26.5;
  const S = E.scene("abril", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  const RED = "#d62839";
  const carnation = s => `<svg viewBox="0 0 80 200" width="${80 * s}" height="${200 * s}"><path d="M40 70 C38 120 44 160 40 200" stroke="#3f7d3a" stroke-width="6" fill="none"/><path d="M41 130 C55 118 66 120 72 112" stroke="#3f7d3a" stroke-width="5" fill="none"/>` +
    [0, 1, 2, 3, 4, 5, 6].map(i => `<ellipse cx="${40 + 16 * Math.cos(i * .9)}" cy="${42 + 12 * Math.sin(i * .9)}" rx="18" ry="14" fill="${i % 2 ? "#b81d2c" : RED}" stroke="#7a1019" stroke-width="2"/>`).join("") + `<circle cx="40" cy="44" r="12" fill="#e2384a"/></svg>`;
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. the real clips (0 – 2.9, 15.2 – 18.6) under magenta ============
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff"); show(M, [[0, 2.9], [CARN, DICT - .1]]);
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);
  const hookWords = [["Why", .2], ["do", .35], ["so", .45], ["many", .6, 1], ["Portuguese", .85], ["streets", 1.4, 1], ["have", 1.8], ["this", 1.95, 1], ["name?", 2.15, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:1240px;width:1000px;text-align:center;z-index:10;line-height:1.08"); show(H, [[0, 2.9]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:100px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  // ============ 2. the night of 24–25 April 1974: two songs on the radio (2.9 – 15.2) ============
  const R = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#2b2a3a,#0e0d16)"); show(R, [[2.9, CARN]]);
  const date = E.el(R, "abs", "left:90px;top:280px;width:900px;text-align:center;font-weight:900;font-size:110px;color:#fff;z-index:4;line-height:1", "25 · 4 · 1974");
  E.pop(date, DATE, { from: .6, dur: .25 }); E.K(date, "s", [[DATE + .3, 1], [SIG2, 1.06, "lin"]]);
  const radio = E.el(R, "abs", "left:190px;top:560px;width:700px;height:440px;border-radius:40px;background:linear-gradient(#8a5a35,#5b3a22);border:8px solid #2e1c10;z-index:3;box-shadow:0 30px 60px rgba(0,0,0,.5)");
  E.el(radio, "abs", "left:50px;top:60px;width:300px;height:300px;border-radius:50%;background:repeating-radial-gradient(#3a2616 0 6px,#20140b 6px 12px)");
  const dial = E.el(radio, "abs", "left:390px;top:70px;width:250px;height:110px;border-radius:14px;background:#f2e2b8;border:5px solid #2e1c10;overflow:hidden");
  const needle = E.el(dial, "abs", "left:30px;top:6px;width:6px;height:98px;background:#c62828"); E.K(needle, "x", [[DATE, 0], [SIG1 - .4, 160, "io"], [SIG2, 40, "io"], [SIG2 + .6, 190, "io"]]);
  const clock = E.el(radio, "abs", "left:390px;top:220px;width:250px;text-align:center;font-family:'Courier New',monospace;font-weight:900;font-size:84px;color:#ffd640;text-shadow:0 0 14px rgba(255,214,64,.6)", "22:55");
  E.F(t => { const s = t < SIG2 ? "22:55" : "00:20"; if (clock.textContent !== s) clock.textContent = s; });
  E.F(t => { R.style.background = t < 5.0 ? "radial-gradient(circle at 50% 40%,#2b2a3a,#0e0d16)" : t < SIG2 ? "radial-gradient(circle at 50% 40%,#ffe2a8,#c9822e)" : t < SIG2 + 1.6 ? "radial-gradient(circle at 50% 40%,#2b2a3a,#0e0d16)" : t < MOVE ? "radial-gradient(circle at 50% 40%,#ffe3e6,#d62839)" : "radial-gradient(circle at 50% 40%,#3d4a2c,#141a0c)"; });
  R.style.transformOrigin = "50% 45%";
  E.K(R, "s", [[2.9, 1.1], [3.3, 1, "out"], [SIG1 - .1, 1.04, "lin"], [SIG1, 1.15, "out"], [SIG2 - .1, 1.18, "lin"], [SIG2, 1.0, "out"], [MOVE - .1, 1.05, "lin"], [MOVE, 1.0, "out"], [CARN, 1.06, "lin"]]);
  for (let i = 0; i < 8; i++) { // notes rising from the speaker while each song plays
    const n = E.el(R, "abs", `left:${280 + (i % 3) * 60}px;top:620px;font-size:70px;color:#ffd640;z-index:4`, i % 2 ? "♪" : "♫");
    const t0 = (i < 4 ? SIG1 - 2.6 : SIG2) + (i % 4) * .55; show(n, [[t0, t0 + 1.4]]);
    E.K(n, "y", [[t0, 0], [t0 + 1.4, -320, "out"]]); E.K(n, "x", [[t0, 0], [t0 + 1.4, (i % 2 ? 1 : -1) * 90, "io"]]);
  }
  const s1 = E.el(R, "abs", "left:240px;top:1060px;width:600px;padding:12px 0;border:10px solid #1d2b36;border-radius:20px;color:#1d2b36;background:rgba(255,255,255,.9);font-weight:900;font-size:66px;text-align:center;transform:rotate(-5deg);z-index:6;opacity:0", "SIGNAL 1");
  show(s1, [[SIG1, SIG2]]); E.pop(s1, SIG1, { from: 2.2, dur: .16 });
  const s2 = E.el(R, "abs", "left:240px;top:1060px;width:600px;padding:12px 0;border:10px solid " + RED + ";border-radius:20px;color:" + RED + ";font-weight:900;font-size:66px;text-align:center;transform:rotate(5deg);z-index:6;opacity:0;background:rgba(255,255,255,.9)", "SIGNAL 2");
  show(s2, [[SIG2 + 1.6, CARN]]); E.pop(s2, SIG2 + 1.6, { from: 2.2, dur: .16 });
  for (let i = 0; i < 5; i++) { // the columns move out
    const a = E.el(R, "abs", `left:-200px;top:${1250 + i * 20}px;font-size:80px;z-index:5;color:#9fb08a`, "▶▶");
    show(a, [[MOVE, CARN]]); E.K(a, "x", [[MOVE + i * .25, 0], [MOVE + i * .25 + 1.6, 1400, "lin"]]);
  }

  // ============ 3. 48 years → one day (18.7 – 22.0) ============
  const D = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#2a2a2a,#0c0c0c)"); show(D, [[DICT - .1, TODAY]]);
  const y48 = E.el(D, "abs", "left:90px;top:420px;width:900px;text-align:center;font-weight:900;font-size:220px;color:#9a9a9a;z-index:3;line-height:1", "48<br><span style='font-size:64px'>years of dictatorship</span>");
  E.pop(y48, DICT, { from: .6, dur: .25 });
  const strike = E.el(D, "abs", "left:150px;top:560px;width:0;height:22px;background:" + RED + ";z-index:4;transform:rotate(-8deg)"); E.K(strike, "w", [[DICT + 1.4, 0], [DICT + 1.8, 780, "out"]]);
  const one = E.el(D, "abs", "left:140px;top:1020px;width:800px;text-align:center;font-weight:900;font-size:110px;color:#1d2b36;z-index:4;opacity:0", "over in <span style='color:" + RED + "'>1 day</span>");
  show(one, [[DICT + 1.9, TODAY]]); E.pop(one, DICT + 1.9, { from: 1.8, dur: .18 });
  const fl = E.el(D, "abs", "left:780px;top:880px;z-index:5;opacity:0"); fl.innerHTML = carnation(1.3); show(fl, [[DICT + 2.1, TODAY]]); E.pop(fl, DICT + 2.1, { from: .3, dur: .25 });
  E.F(t => { D.style.background = t < DICT + 1.9 ? "radial-gradient(circle at 50% 40%,#2a2a2a,#0c0c0c)" : "radial-gradient(circle at 50% 40%,#fff1f2,#f2a7ae)"; });
  E.F(t => { y48.style.color = t < DICT + 1.9 ? "#9a9a9a" : "#5a5a5a"; });
  D.style.transformOrigin = "50% 40%"; E.K(D, "s", [[DICT, 1.1], [DICT + .4, 1, "out"], [TODAY, 1.06, "lin"]]);

  // ============ 4. today: a holiday and a street name (22.0 – 26.5) ============
  const T = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#e9f0f7,#b9c9da)"); show(T, [[TODAY, AVO]]);
  const hol = E.el(T, "abs", "left:190px;top:330px;width:700px;height:420px;border-radius:30px;background:#fff;box-shadow:0 30px 60px rgba(0,0,0,.2);z-index:3;overflow:hidden;text-align:center;font-weight:900;color:#1d2b36");
  E.el(hol, "abs", "left:0;top:0;width:700px;height:120px;background:" + RED + ";color:#fff;font-size:60px;line-height:120px", "APRIL");
  E.el(hol, "abs", "left:0;top:130px;width:700px;font-size:190px;line-height:1", "25");
  E.el(hol, "abs", "left:0;top:340px;width:700px;font-size:40px;color:#2a7a3a", "national holiday");
  E.pop(hol, TODAY, { from: .6, dur: .25 });
  const spots = [[110, 820, -6], [560, 860, 5], [120, 1110, 3], [600, 1130, -4], [330, 990, -2], [40, 1300, 6], [580, 1320, -5]];
  spots.forEach(([x, y, r], i) => {
    const tile = E.el(T, "abs", `left:${x}px;top:${y}px;width:440px;height:170px;border-radius:14px;background:#fbfaf6;border:8px solid #1f4fa0;box-shadow:0 10px 24px rgba(0,0,0,.25);z-index:${4 + i};transform:rotate(${r}deg);text-align:center;color:#1f4fa0;font-weight:900;font-family:Georgia,serif;opacity:0`);
    E.el(tile, "abs", "left:0;top:22px;width:440px;font-size:38px", i % 3 === 2 ? "AVENIDA" : "RUA");
    E.el(tile, "abs", "left:0;top:72px;width:440px;font-size:56px", "25 DE ABRIL");
    const t0 = SIGNS + i * .3; show(tile, [[t0, AVO]]); E.pop(tile, t0, { from: 1.6, dur: .16 });
  });
  T.style.transformOrigin = "50% 50%"; E.K(T, "s", [[TODAY, 1.06], [TODAY + .4, 1, "out"], [AVO, 1.08, "lin"]]);

  // ============ 5. grandma (26.5 – end) ============
  const A = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(A, [[AVO, DUR]]); E.img(A, "avo", COVER);
  const dn = fig(A, "dona", 597, 1027, 1.2, 540, 1880, 5); E.pop(dn, AVO, { from: .9, dur: .2 });
  const fg = E.el(A, "abs", "left:500px;top:1180px;z-index:6;transform:rotate(-25deg)"); fg.innerHTML = carnation(1.4); E.pop(fg, AVO + .3, { from: .3, dur: .3 });
  E.K(A, "s", [[AVO, 1.05], [DUR, 1.15, "lin"]]); A.style.transformOrigin = "50% 62%";

  // ============ captions ============
  const cap = E.el(S.el, "abs", "left:70px;top:1500px;width:940px;text-align:center;font-weight:800;font-size:48px;line-height:1.2;color:#fff;z-index:12", "");
  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const CAPS = [[DATE, "April 25th, 1974."], [DATE + 2.0, "10:55 pm: a love song on the radio."], [SIG1, "Signal one."], [SIG1 + 2.4, ""],
    [SIG2, "Twenty past midnight, another song."], [SIG2 + 2.2, "Signal two. The soldiers move."], [CARN - .1, ""],
    [CARN, "A woman hands them carnations."], [CARN + 1.7, "They put them in their rifles."], [DICT - .2, ""],
    [DICT, "48 years of dictatorship."], [DICT + 1.8, "Over in a day."], [TODAY - .1, ""],
    [TODAY, "Today it's a national holiday…"], [SIGNS, "and a street name in town after town."], [AVO - .1, ""],
    [AVO, `"Eu estava lá."${sub("I was there.")}`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0, "sfx/tram-pass.wav", { vol: 0.35, to: 2.9, duck: false });
  E.clip(0.15, "voices/ep135/n_streets.wav", { vol: 1.2 });
  E.clip(DATE, "voices/ep135/n_signal1.wav", { vol: 1.2 });
  E.clip(DATE + 1.9, "sfx/elx-vhs.wav", { vol: 0.25, duck: false });
  E.clip(SIG1, "sfx/fs-rubber-stamp.wav", { vol: 0.6, duck: false });
  E.clip(SIG2, "voices/ep135/n_signal2.wav", { vol: 1.2 });
  E.clip(SIG2 + 1.6, "sfx/fs-rubber-stamp.wav", { vol: 0.6, duck: false });
  E.clip(MOVE, "sfx/elx-gravel-steps.wav", { vol: 0.4, to: CARN, duck: false });
  E.clip(CARN, "sfx/crowd-murmur.wav", { vol: 0.3, to: DICT, duck: false });
  E.clip(CARN, "voices/ep135/n_carn.wav", { vol: 1.2 });
  E.clip(DICT, "voices/ep135/n_dict.wav", { vol: 1.2 });
  E.clip(TODAY, "voices/ep135/n_today.wav", { vol: 1.2 });
  E.clip(AVO, "sfx/elx-drawer-open.wav", { vol: 0.4, duck: false });
  E.clip(AVO + .3, "voices/ep135/g_estava.wav", { vol: 1.3 });
  E.clip(0, "../tools/reel/eps/ep135-abril/audio/music44.wav", { vol: 0.3, to: DUR });
  E.finish(DUR);
}
