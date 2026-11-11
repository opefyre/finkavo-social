// STYLE SAMPLE 3 (not for posting): ink-on-notebook doodle, all drawn in code. Same fact and audio as EP140 (CIRS art. 10.º:
// crypto held 365+ days, gain excluded; sooner, 28%). One long squared-paper sheet; the camera follows the pen down the page.
export const meta = { id: "sample-doodle", date: "2026-11-11", images: {} };

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 16;
  const D365 = 4.2, ZERO = 6.4, T28 = 8.5, SELL = 10.8, COME = 13.7;
  const S = E.scene("doodle", 0, DUR, "light"); E.cur = S;
  const SH = 1930, PAGES = 4;
  const HAND = "'Marker Felt','Chalkboard SE','Bradley Hand',cursive";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ---- the sheet: squared paper, margin line, a coffee ring ----
  const cam = E.el(S.el, "abs", `left:0;top:0;width:1080px;height:${SH * PAGES}px;transform-origin:0 0;background-color:#fbfaf3;` +
    "background-image:linear-gradient(#cfdcec 2px,transparent 2px),linear-gradient(90deg,#cfdcec 2px,transparent 2px);background-size:54px 54px");
  E.el(cam, "abs", `left:110px;top:0;width:4px;height:${SH * PAGES}px;background:#f0a3a3`);
  E.el(cam, "abs", "left:700px;top:2700px;width:330px;height:330px;border-radius:50%;box-shadow:inset 0 0 0 16px rgba(150,95,40,.18),inset 0 0 0 26px rgba(150,95,40,.07)");
  E.el(cam, "abs", "left:20px;top:5600px;width:260px;height:260px;border-radius:50%;box-shadow:inset 0 0 0 12px rgba(150,95,40,.14)");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", 1080); svg.setAttribute("height", SH * PAGES); svg.style.cssText = "position:absolute;left:0;top:0;overflow:visible";
  cam.appendChild(svg);

  // ---- drawing helpers: wobbly strokes that draw themselves; the pen follows the newest one ----
  let sd = 3; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647 - .5;
  const tip = { x: -200, y: -200, t: -1 };
  const strokes = [];
  const path = (pts, col, w, t0, dur, close = false) => {
    const j = pts.map(([x, y]) => [x + rnd() * 5, y + rnd() * 5]);
    let d = `M${j[0][0]},${j[0][1]}`;
    for (let i = 1; i < j.length; i++) { const [x0, y0] = j[i - 1], [x1, y1] = j[i]; d += ` Q${x0 + rnd() * 6},${y0 + rnd() * 6} ${(x0 + x1) / 2},${(y0 + y1) / 2} T${x1},${y1}`; }
    if (close) d += ` L${j[0][0]},${j[0][1]}`;
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", d); p.setAttribute("fill", "none"); p.setAttribute("stroke", col); p.setAttribute("stroke-width", w);
    p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); svg.appendChild(p);
    strokes.push({ p, t0, dur }); return p;
  };
  const rect = (x, y, w, h, col, sw, t0, dur) => path([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y + 4]], col, sw, t0, dur);
  const circ = (cx, cy, rx, ry, col, sw, t0, dur, turns = 1.12) => path(Array.from({ length: 36 }, (_, i) => { const a = -2 + i / 35 * Math.PI * 2 * turns; return [cx + Math.cos(a) * rx * (1 + i * .002), cy + Math.sin(a) * ry]; }), col, sw, t0, dur);
  const line = (pts, col, sw, t0, dur) => path(pts, col, sw, t0, dur);
  const write = (x, y, html, size, col, t0, dur, w = 860, align = "left") => {
    const el = E.el(cam, "abs", `left:${x}px;top:${y}px;width:${w}px;font-family:${HAND};font-size:${size}px;line-height:1.1;color:${col};text-align:${align};clip-path:inset(0 100% 0 0)`, html);
    strokes.push({ el, t0, dur, x, y, w, size }); return el;
  };
  E.F(t => {
    let best = null;
    for (const s of strokes) {
      const u = Math.max(0, Math.min(1, (t - s.t0) / s.dur));
      if (s.p) { if (!s.L) { s.L = s.p.getTotalLength(); s.p.style.strokeDasharray = s.L; } s.p.style.strokeDashoffset = s.L * (1 - u);
        if (u > 0 && u < 1) { const q = s.p.getPointAtLength(s.L * u); best = [q.x, q.y]; } }
      else { s.el.style.clipPath = `inset(0 ${100 - u * 100}% 0 0)`; if (u > 0 && u < 1) best = [s.x + s.w * u, s.y + s.size * .7]; }
    }
    if (best) { pen.style.left = best[0] + "px"; pen.style.top = best[1] + "px"; pen.style.opacity = 1; } else pen.style.opacity = 0;
  });

  // ============ page 1: the hook (0 – 4.1) ============
  const y1 = 0;
  write(150, y1 + 230, "Sell <u>crypto</u> in Portugal", 92, "#1b2a6b", .15, 1.3);
  write(150, y1 + 350, "after a <b>year</b>?", 92, "#1b2a6b", 1.4, .7);
  write(150, y1 + 480, "Tax:", 110, "#1b2a6b", 2.4, .4);
  write(420, y1 + 455, "€0", 170, "#1e8a3c", 3.0, .4, 400);
  circ(530, y1 + 560, 170, 105, "#1e8a3c", 7, 3.4, .55);
  E.texts.push({ scene: S, tIn: 0, words: 9 });
  // a phone with a coin, doodled
  rect(330, y1 + 860, 420, 720, "#222", 7, .3, 1.0); rect(365, y1 + 930, 350, 560, "#222", 4, 1.2, .6);
  circ(540, y1 + 1210, 120, 120, "#d99a16", 9, 1.6, .6); line([[505, y1 + 1150], [505, y1 + 1270]], "#d99a16", 8, 2.1, .2);
  line([[490, y1 + 1175], [585, y1 + 1175], [570, y1 + 1210], [490, y1 + 1210], [585, y1 + 1215], [570, y1 + 1255], [490, y1 + 1255]], "#d99a16", 8, 2.2, .5);
  line([[540, y1 + 1520], [540, y1 + 1522]], "#222", 14, 1.3, .05);

  // ============ page 2: the counter (4.2 – 8.4) ============
  const y2 = SH;
  write(150, y2 + 200, "Hold it...", 96, "#1b2a6b", D365, .5);
  rect(250, y2 + 380, 580, 600, "#222", 7, D365 + .2, .7); line([[250, y2 + 520], [830, y2 + 520]], "#c0392b", 9, D365 + .7, .3);
  line([[350, y2 + 380], [350, y2 + 330]], "#222", 7, D365 + .9, .1); line([[730, y2 + 380], [730, y2 + 330]], "#222", 7, D365 + 1.0, .1);
  write(250, y2 + 410, "DAYS", 70, "#c0392b", D365 + .8, .3, 580, "center");
  const num = E.el(cam, "abs", `left:250px;top:${y2 + 600}px;width:580px;text-align:center;font-family:${HAND};font-size:230px;color:#222`, "1");
  E.F(t => { const u = Math.max(0, Math.min(1, (t - D365 - .5) / 1.6)); const d = Math.round(1 + 364 * u * u); num.style.opacity = t > D365 + .4 ? 1 : 0; if (num.dataset.d != d) { num.dataset.d = d; num.textContent = d; } });
  write(150, y2 + 1130, "tax on the gain:", 80, "#1b2a6b", ZERO - .3, .6);
  write(560, y2 + 1230, "€0", 220, "#1e8a3c", ZERO + .2, .3, 400);
  circ(700, y2 + 1360, 200, 130, "#1e8a3c", 8, ZERO + .4, .5);
  line([[300, y2 + 1500], [470, y2 + 1400], [440, y2 + 1450], [470, y2 + 1400], [415, y2 + 1395]], "#1e8a3c", 7, ZERO + .9, .4);

  // ============ page 3: sooner = 28% (8.5 – 10.7) ============
  const y3 = SH * 2;
  write(150, y3 + 260, "sell <u>before</u> 365 days?", 90, "#1b2a6b", T28 - .1, .6);
  write(260, y3 + 520, "28%", 300, "#c0392b", T28 + .4, .35, 700);
  circ(520, y3 + 690, 330, 190, "#c0392b", 10, T28 + .7, .45, 1.2);
  for (let i = 0; i < 4; i++) line([[180 + i * 40, y3 + 1050 + i * 8], [900 - i * 30, y3 + 1060 + i * 8]], "#c0392b", 6, T28 + 1.1 + i * .08, .12);

  // ============ page 4: the stick man sells on day 364 (10.8 – end) ============
  const y4 = SH * 3;
  circ(380, y4 + 760, 95, 105, "#222", 7, SELL, .35);                     // head
  line([[380, y4 + 865], [380, y4 + 1250]], "#222", 7, SELL + .3, .25);  // body
  line([[380, y4 + 940], [520, y4 + 870], [560, y4 + 820]], "#222", 7, SELL + .5, .2);  // arm up with phone
  line([[380, y4 + 950], [260, y4 + 1090]], "#222", 7, SELL + .6, .15);
  line([[380, y4 + 1250], [290, y4 + 1450]], "#222", 7, SELL + .7, .15); line([[380, y4 + 1250], [470, y4 + 1450]], "#222", 7, SELL + .8, .15);
  rect(540, y4 + 720, 70, 120, "#222", 5, SELL + .55, .2);
  line([[350, y4 + 740], [352, y4 + 742]], "#222", 12, SELL + .2, .05); line([[410, y4 + 740], [412, y4 + 742]], "#222", 12, SELL + .2, .05);
  const smile = line([[335, y4 + 790], [380, y4 + 825], [425, y4 + 790]], "#222", 6, SELL + .25, .15);
  const frown = line([[335, y4 + 825], [380, y4 + 795], [425, y4 + 825]], "#222", 6, COME, .15);
  E.F(t => { smile.style.opacity = t < COME ? 1 : 0; });
  path([[600, y4 + 380], [1010, y4 + 380], [1010, y4 + 600], [700, y4 + 600], [640, y4 + 680], [660, y4 + 600], [600, y4 + 600], [600, y4 + 384]], "#222", 6, SELL + .1, .5);
  write(615, y4 + 420, "Day 364.<br>SELL!", 82, "#222", SELL + .6, .7, 390, "center");
  write(560, y4 + 1050, "28%", 210, "#c0392b", COME - .35, .25, 480);
  for (let i = 0; i < 3; i++) circ(720, y4 + 1170, 230 - i * 12, 140 - i * 8, "#c0392b", 7, COME - .15 + i * .1, .25);
  // speech mark for "come ON"
  line([[260, y4 + 600], [300, y4 + 650]], "#222", 6, COME + .2, .1); line([[230, y4 + 640], [290, y4 + 670]], "#222", 6, COME + .3, .1);

  // ---- pen nib that follows the drawing ----
  const pen = E.el(cam, "abs", "left:0;top:0;width:0;height:0;z-index:20;opacity:0",
    `<div style="position:absolute;left:-6px;top:-300px;width:44px;height:300px;transform:rotate(28deg);transform-origin:6px 300px">
      <div style="position:absolute;left:0;top:0;width:44px;height:230px;border-radius:10px 10px 4px 4px;background:linear-gradient(90deg,#1b2a6b,#3c52b0 45%,#16215a)"></div>
      <div style="position:absolute;left:4px;top:226px;width:36px;height:40px;background:#c9ccd3"></div>
      <div style="position:absolute;left:4px;top:264px;width:0;height:0;border-left:18px solid transparent;border-right:18px solid transparent;border-top:36px solid #2a2a2a"></div></div>
     <div style="position:absolute;left:-40px;top:20px;width:120px;height:40px;border-radius:50%;background:rgba(0,0,0,.12);filter:blur(10px)"></div>`);

  // ---- camera: glide down the notebook page by page, small push-ins on each payoff ----
  E.K(cam, "y", [[0, 0], [D365 - .25, 0], [D365, -SH, "io"], [ZERO - .3, -SH], [ZERO - .1, -SH - 520, "io"], [T28 - .25, -SH - 520], [T28, -SH * 2, "io"], [SELL - .25, -SH * 2], [SELL, -SH * 3, "io"]]);
  E.K(cam, "s", [[2.9, 1], [3.1, 1.06, "out"], [3.3, 1, "io"], [T28 + .35, 1], [T28 + .5, 1.07, "out"], [T28 + .7, 1, "io"], [COME - .4, 1], [COME - .2, 1.06, "out"], [COME, 1, "io"]]);

  // ---- captions ----
  const cap = E.el(S.el, "abs", "left:60px;top:1640px;width:960px;text-align:center;z-index:12", "");
  const CAPS = [[D365, "Hold it 365 days or more,"], [ZERO, "and the gain isn't taxed."], [T28 - .1, ""], [T28, "Sell sooner: 28%."], [SELL - .1, ""],
    [SELL, "\"Day 364. SELL!\""], [COME - .3, ""], [COME, "\"Oh, come ON.\""]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#1b2a6b;color:#fff;padding:10px 26px;border-radius:14px;font-weight:800;font-size:50px">${s}</span>` : ""; } });

  // ---- sound ----
  E.clip(0, "sfx/fs-clock-tick.wav", { vol: 0.15, to: D365, duck: false });
  E.clip(0.15, "voices/ep140/n_hook10.wav", { vol: 1.2 });
  E.clip(D365, "voices/ep140/n_365.wav", { vol: 1.2 });
  E.clip(ZERO, "sfx/elx-chaching.wav", { vol: 0.4, duck: false });
  E.clip(T28, "voices/ep140/n_28.wav", { vol: 1.2 });
  E.clip(SELL, "voices/ep140/b_sell.wav", { vol: 1.2 });
  E.clip(COME, "voices/ep140/b_comeon.wav", { vol: 1.2 });
  E.clip(0, "../tools/reel/eps/ep140-cripto/audio/music44.wav", { vol: 0.28, to: DUR });
  E.finish(DUR);
}
