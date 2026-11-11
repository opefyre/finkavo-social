// EP.153 "Your bank can't charge you for these transfers." STYLE TEST: ink-on-notebook doodle, all drawn in code.
// DL 3/2010 art. 3.º-A n.º 1 (added by Lei 53/2020): no fees for consumers on transfers through third-party payment apps (MB WAY)
// that don't exceed €30 per operation, or €150 a month, or 25 transfers a month (n.º 4: consumers, linked account or card).
// Above the limits, fees are capped (DL 72/2024: 0.2%) — kept off screen. EU instant-payments regulation not opened.
// Music: compose.py ep153.
export const meta = { id: "ep153-mbway", date: "2026-12-06", images: {} };

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 14.4;
  const LAW = 2.8, LIM = 7.1, MANDA = 12.0;
  const S = E.scene("mbway", 0, DUR, "light"); E.cur = S;
  const SH = 1930, PAGES = 4;
  const HAND = "'Marker Felt','Chalkboard SE','Bradley Hand',cursive";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  const lens = E.el(S.el, "abs", "inset:0;transform-origin:50% 42%");
  const cam = E.el(lens, "abs", `left:0;top:0;width:1080px;height:${SH * PAGES}px;transform-origin:0 0;background-color:#fbfaf3;` +
    "background-image:linear-gradient(#cfdcec 2px,transparent 2px),linear-gradient(90deg,#cfdcec 2px,transparent 2px);background-size:54px 54px");
  ["#fbfaf3", "#dff3da", "#dde8fb", "#fff3c4"].forEach((c, i) => E.el(cam, "abs", `left:0;top:${i * SH}px;width:1080px;height:${SH}px;background-color:${c};background-image:linear-gradient(#c3d2e6 2px,transparent 2px),linear-gradient(90deg,#c3d2e6 2px,transparent 2px);background-size:54px 54px`));
  E.el(cam, "abs", `left:110px;top:0;width:4px;height:${SH * PAGES}px;background:#f0a3a3`);
  const blob = (x, y, w, h, bg, t0, rot = 0, r = 6) => { const b = E.el(cam, "abs", `left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${bg};border-radius:${r}px;transform:rotate(${rot}deg);box-shadow:0 10px 18px rgba(0,0,0,.15);opacity:0`); E.F(t => { b.style.opacity = Math.max(0, Math.min(1, (t - t0) / .2)); }); E.pop(b, t0, { from: 1.15, dur: .2 }); return b; };
  E.el(cam, "abs", "left:700px;top:5200px;width:320px;height:320px;border-radius:50%;box-shadow:inset 0 0 0 16px rgba(150,95,40,.18),inset 0 0 0 26px rgba(150,95,40,.07)");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", 1080); svg.setAttribute("height", SH * PAGES); svg.style.cssText = "position:absolute;left:0;top:0;overflow:visible";
  cam.appendChild(svg);

  let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647 - .5;
  const strokes = [];
  const path = (pts, col, w, t0, dur, fill) => {
    const j = pts.map(([x, y]) => [x + rnd() * 5, y + rnd() * 5]);
    let d = `M${j[0][0]},${j[0][1]}`;
    for (let i = 1; i < j.length; i++) { const [x0, y0] = j[i - 1], [x1, y1] = j[i]; d += ` Q${x0 + rnd() * 6},${y0 + rnd() * 6} ${(x0 + x1) / 2},${(y0 + y1) / 2} T${x1},${y1}`; }
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", d); p.setAttribute("fill", "none"); p.setAttribute("stroke", col); p.setAttribute("stroke-width", w);
    p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); svg.appendChild(p);
    strokes.push({ p, t0, dur }); return p;
  };
  const rect = (x, y, w, h, col, sw, t0, dur) => path([[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y + 4]], col, sw, t0, dur);
  const circ = (cx, cy, rx, ry, col, sw, t0, dur, turns = 1.12) => path(Array.from({ length: 36 }, (_, i) => { const a = -2 + i / 35 * Math.PI * 2 * turns; return [cx + Math.cos(a) * rx * (1 + i * .002), cy + Math.sin(a) * ry]; }), col, sw, t0, dur);
  const line = (pts, col, sw, t0, dur) => path(pts, col, sw, t0, dur);
  const heart = (cx, cy, s, col, sw, t0, dur) => path(Array.from({ length: 40 }, (_, i) => { const a = i / 39 * Math.PI * 2; return [cx + s * 16 * Math.sin(a) ** 3, cy - s * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a))]; }), col, sw, t0, dur);
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

  // ============ page 1: hook (0 – 2.7) ============
  write(150, 200, "Your bank <b style='color:#c0392b'>can't</b>", 100, "#1b2a6b", 0, .4);
  write(150, 320, "charge you for", 96, "#1b2a6b", .4, .4);
  write(150, 440, "these transfers.", 96, "#1b2a6b", .8, .45);
  E.texts.push({ scene: S, tIn: 0, words: 8 });
  blob(330, 700, 420, 760, "#2b2f3a", .2, 0, 50);                                  // a phone
  rect(330, 700, 420, 760, "#111", 7, .2, .5); blob(365, 780, 350, 560, "#e9f0ff", .5, 0, 16);
  line([[420, 950], [660, 950], [630, 920], [660, 950], [630, 980]], "#1e8a3c", 9, 1.0, .3);
  line([[660, 1120], [420, 1120], [450, 1090], [420, 1120], [450, 1150]], "#4f7fe0", 9, 1.3, .3);
  write(390, 1200, "€0", 120, "#1e8a3c", 1.8, .25, 300, "center");

  // ============ page 2: by law (2.8 – 7.0) ============
  const y2 = SH;
  write(150, y2 + 200, "by law:", 100, "#1b2a6b", LAW, .4);
  write(150, y2 + 330, "MB WAY transfers", 90, "#1b2a6b", LAW + .6, .6);
  blob(140, y2 + 520, 800, 380, "#59b86a", LAW + 1.6, -2, 30);
  write(140, y2 + 560, "up to €30", 170, "#fff", LAW + 1.9, .4, 800, "center");
  write(140, y2 + 760, "each", 70, "#123b1c", LAW + 2.3, .2, 800, "center");
  write(150, y2 + 1020, "= no fee", 120, "#1e8a3c", LAW + 3.0, .4);
  circ(400, y2 + 1090, 300, 110, "#c0392b", 8, LAW + 3.4, .45);

  // ============ page 3: the three limits (7.1 – 11.8) ============
  const y3 = SH * 2;
  write(150, y3 + 160, "stay under all three:", 84, "#1b2a6b", LIM, .6);
  blob(120, y3 + 330, 840, 230, "#ffd23f", LIM + .5, -2, 18); write(120, y3 + 370, "€30 per transfer", 100, "#5a3a00", LIM + .7, .4, 840, "center");
  blob(120, y3 + 620, 840, 230, "#7fb2ff", LIM + 1.9, 2, 18); write(120, y3 + 660, "€150 a month", 100, "#0f2a6b", LIM + 2.1, .4, 840, "center");
  blob(120, y3 + 910, 840, 230, "#ff86a8", LIM + 3.2, -1, 18); write(120, y3 + 950, "25 transfers a month", 92, "#5a0a24", LIM + 3.4, .4, 840, "center");

  // ============ page 4: "Manda por MB WAY!" (12.0 – end) ============
  const y4 = SH * 3;
  blob(140, y4 + 1180, 800, 80, "#8a5a36", MANDA - .4, 0, 10);                       // table
  for (const [x, d] of [[300, 0], [780, .1]]) {
    circ(x, y4 + 800, 85, 95, "#222", 7, MANDA - .35 + d, .25);
    line([[x, y4 + 895], [x, y4 + 1180]], "#222", 7, MANDA - .2 + d, .15);
    line([[x, y4 + 960], [x + (x < 540 ? 110 : -110), y4 + 1060]], "#222", 7, MANDA - .1 + d, .12);
    line([[x - 30, y4 + 780], [x - 28, y4 + 782]], "#222", 11, MANDA - .2 + d, .05); line([[x + 30, y4 + 780], [x + 32, y4 + 782]], "#222", 11, MANDA - .2 + d, .05);
    line([[x - 35, y4 + 830], [x, y4 + 860], [x + 35, y4 + 830]], "#222", 6, MANDA - .15 + d, .1);
  }
  blob(470, y4 + 1100, 140, 90, "#fbfaf3", MANDA - .1, -6, 6); rect(470, y4 + 1100, 140, 90, "#222", 5, MANDA - .1, .2);   // the bill
  path([[100, y4 + 360], [700, y4 + 360], [700, y4 + 560], [380, y4 + 560], [320, y4 + 650], [330, y4 + 560], [100, y4 + 560], [100, y4 + 364]], "#222", 6, MANDA, .4);
  write(110, y4 + 410, "Manda por MB WAY!", 70, "#222", MANDA + .3, .6, 580, "center");
  line([[640, y4 + 1000], [730, y4 + 1000], [710, y4 + 980], [730, y4 + 1000], [710, y4 + 1020]], "#1e8a3c", 7, MANDA + .9, .2);

  const pen = E.el(cam, "abs", "left:0;top:0;width:0;height:0;z-index:20;opacity:0",
    `<div style="position:absolute;left:-6px;top:-300px;width:44px;height:300px;transform:rotate(28deg);transform-origin:6px 300px">
      <div style="position:absolute;left:0;top:0;width:44px;height:230px;border-radius:10px 10px 4px 4px;background:linear-gradient(90deg,#1b2a6b,#3c52b0 45%,#16215a)"></div>
      <div style="position:absolute;left:4px;top:226px;width:36px;height:40px;background:#c9ccd3"></div>
      <div style="position:absolute;left:4px;top:264px;width:0;height:0;border-left:18px solid transparent;border-right:18px solid transparent;border-top:36px solid #2a2a2a"></div></div>
     <div style="position:absolute;left:-40px;top:20px;width:120px;height:40px;border-radius:50%;background:rgba(0,0,0,.12);filter:blur(10px)"></div>`);

  E.K(cam, "y", [[0, 0], [LAW - .25, 0], [LAW + .2, -SH, "io"], [LIM - .25, -SH], [LIM + .2, -SH * 2, "io"], [MANDA - .65, -SH * 2], [MANDA - .3, -SH * 3, "io"]]);
  E.K(lens, "s", [[1.6, 1], [1.85, 1.18, "out"], [2.4, 1.18], [2.6, 1, "io"], [LAW + 1.8, 1], [LAW + 2.05, 1.2, "out"], [LAW + 3.2, 1.2], [LAW + 3.5, 1, "io"], [LIM + 1.7, 1], [LIM + 1.95, 1.12, "out"], [LIM + 3.0, 1.12], [LIM + 3.3, 1, "io"], [MANDA + .2, 1], [MANDA + .45, 1.12, "out"]]);

  const cap = E.el(S.el, "abs", "left:60px;top:1640px;width:960px;text-align:center;z-index:12", "");
  const CAPS = [[LAW, "By law, MB WAY transfers"], [LAW + 1.6, "up to €30 each are free."], [LIM - .1, ""], [LIM, "As long as you stay under €150"], [LIM + 2.4, "and 25 transfers a month."], [MANDA - .4, ""],
    [MANDA, `"Manda por MB WAY!"<br><span style='font-size:38px;color:#ffd640'>(Send it by MB WAY!)</span>`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#1b2a6b;color:#fff;padding:10px 26px;border-radius:14px;font-weight:800;font-size:48px">${s}</span>` : ""; } });

  E.clip(0, "sfx/phone-ping.wav", { vol: 0.35, duck: false });
  E.clip(0.15, "voices/ep153/n153_hook.wav", { vol: 1.2 });
  E.clip(1.0, "sfx/elx-msg-pop.wav", { vol: 0.3, duck: false });
  E.clip(LAW - .2, "sfx/elx-page-flip.wav", { vol: 0.4, duck: false });
  E.clip(LAW, "voices/ep153/n153_law.wav", { vol: 1.2 });
  E.clip(LAW + 3.0, "sfx/elx-chaching.wav", { vol: 0.3, duck: false });
  E.clip(LIM - .2, "sfx/elx-page-flip.wav", { vol: 0.4, duck: false });
  E.clip(LIM, "voices/ep153/n153_limits.wav", { vol: 1.2 });
  E.clip(MANDA - .5, "sfx/elx-page-flip.wav", { vol: 0.4, duck: false });
  E.clip(MANDA - .4, "sfx/restaurant.wav", { vol: 0.2, to: DUR, duck: false });
  E.clip(MANDA, "voices/ep153/o153_manda.wav", { vol: 1.3 });
  E.clip(MANDA + .9, "sfx/app-success.wav", { vol: 0.35, duck: false });
  E.clip(0, "../tools/reel/eps/ep153-mbway/audio/music44.wav", { vol: 0.26, to: DUR });
  E.finish(DUR);
}
