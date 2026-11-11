// EP.150 "Under 24 in Portugal? Your transport pass may be free." STYLE TEST: ink-on-notebook doodle, all drawn in code.
// Portaria 307-A/2024/1 (amending Portaria 7-A/2024): free passes for all young people up to 23 inclusive, student or not (sub18+TP
// 4–18, sub23+TP 18–23, valid until the end of the month you turn 24); the pass is the monthly network pass of the metropolitan
// area/CIM where you live. gov.pt news 7 Jul 2026: still running (2026 legal act not found). Apply: navegante app (TML), Andante
// site/store (Porto). Music: compose.py ep150.
export const meta = { id: "ep150-passe", date: "2026-12-03", images: {} };

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 15.6;
  const WHO = 3.9, ASK = 8.8, ESP = 13.5;
  const S = E.scene("passe", 0, DUR, "light"); E.cur = S;
  const SH = 1930, PAGES = 4;
  const HAND = "'Marker Felt','Chalkboard SE','Bradley Hand',cursive";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  const lens = E.el(S.el, "abs", "inset:0;transform-origin:50% 42%");
  const cam = E.el(lens, "abs", `left:0;top:0;width:1080px;height:${SH * PAGES}px;transform-origin:0 0;background-color:#fbfaf3;` +
    "background-image:linear-gradient(#cfdcec 2px,transparent 2px),linear-gradient(90deg,#cfdcec 2px,transparent 2px);background-size:54px 54px");
  ["#fbfaf3", "#dde8fb", "#fff3c4", "#dff3da"].forEach((c, i) => E.el(cam, "abs", `left:0;top:${i * SH}px;width:1080px;height:${SH}px;background-color:${c};background-image:linear-gradient(#c3d2e6 2px,transparent 2px),linear-gradient(90deg,#c3d2e6 2px,transparent 2px);background-size:54px 54px`));
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

  // ============ page 1: hook (0 – 3.7) ============
  write(150, 200, "Under <b style='color:#c0392b'>24</b> in Portugal?", 92, "#1b2a6b", 0, .5);
  write(150, 320, "your transport pass", 92, "#1b2a6b", .5, .5);
  write(150, 440, "may be <b style='color:#1e8a3c'>free</b>.", 100, "#1b2a6b", 1.0, .4);
  E.texts.push({ scene: S, tIn: 0, words: 10 });
  blob(130, 760, 820, 420, "#ffd23f", .3, 0, 40);                                 // the bus
  rect(130, 760, 820, 420, "#222", 8, .3, .6);
  for (let i = 0; i < 4; i++) rect(170 + i * 190, 810, 150, 140, "#222", 6, .7 + i * .12, .2);
  circ(300, 1185, 70, 70, "#222", 8, 1.3, .3); circ(780, 1185, 70, 70, "#222", 8, 1.45, .3);
  write(560, 1010, "€0", 140, "#1e8a3c", 2.0, .25, 360, "center");

  // ============ page 2: who (3.9 – 8.7) ============
  const y2 = SH;
  blob(140, y2 + 260, 800, 500, "#4f7fe0", WHO + .2, -2, 34);                       // the pass card
  rect(140, y2 + 260, 800, 500, "#0f2a6b", 7, WHO + .2, .5);
  write(140, y2 + 330, "monthly pass", 70, "#fff", WHO + .6, .4, 800, "center");
  write(140, y2 + 430, "€0", 240, "#fff", WHO + 1.0, .3, 800, "center");
  write(170, y2 + 860, "✓ up to age 23", 86, "#1b2a6b", WHO + 1.4, .5);
  write(170, y2 + 980, "✓ student or not", 86, "#1b2a6b", WHO + 2.3, .5);
  write(170, y2 + 1100, "✓ in your own region", 86, "#1b2a6b", WHO + 3.1, .5);

  // ============ page 3: ask your operator (8.8 – 13.2) ============
  const y3 = SH * 2;
  write(150, y3 + 200, "ask your operator:", 90, "#1b2a6b", ASK, .5);
  blob(130, y3 + 380, 560, 340, "#7fb2ff", ASK + .8, -4, 8);
  write(150, y3 + 470, "navegante<br><span style='font-size:56px'>Lisbon</span>", 90, "#0f2a6b", ASK + 1.1, .4, 520, "center");
  blob(400, y3 + 800, 560, 340, "#ffab5e", ASK + 2.4, 3, 8);
  write(420, y3 + 890, "Andante<br><span style='font-size:56px'>Porto</span>", 90, "#5a2a00", ASK + 2.7, .4, 520, "center");
  write(150, y3 + 1220, "(other regions: your local operator)", 54, "#1b2a6b", ASK + 3.3, .5);

  // ============ page 4: "Espera!" (13.3 – end) ============
  const y4 = SH * 3;
  const bus = E.el(cam, "abs", `left:520px;top:${y4 + 760}px;width:520px;height:300px;background:#ffd23f;border:8px solid #222;border-radius:26px;opacity:0`);
  E.F(t => { bus.style.opacity = t >= ESP - .3 ? 1 : 0; }); E.K(bus, "x", [[ESP - .3, 0], [ESP + .3, 0], [DUR, 700, "in"]]);
  circ(260, y4 + 760, 90, 100, "#222", 7, ESP - .35, .25);
  line([[260, y4 + 860], [300, y4 + 1150]], "#222", 7, ESP - .15, .15);
  line([[290, y4 + 950], [420, y4 + 860]], "#222", 7, ESP - .05, .12); line([[290, y4 + 950], [170, y4 + 1010]], "#222", 7, ESP, .12);
  line([[300, y4 + 1150], [420, y4 + 1300]], "#222", 7, ESP + .05, .12); line([[300, y4 + 1150], [190, y4 + 1290]], "#222", 7, ESP + .1, .12);
  write(150, y4 + 620, "24", 70, "#c0392b", ESP - .2, .2, 200);
  path([[110, y4 + 380], [520, y4 + 380], [520, y4 + 560], [330, y4 + 560], [280, y4 + 640], [290, y4 + 560], [110, y4 + 560], [110, y4 + 384]], "#222", 6, ESP, .35);
  write(120, y4 + 420, "Espera!", 96, "#c0392b", ESP + .1, .3, 400, "center");
  for (let i = 0; i < 3; i++) line([[60, y4 + 900 + i * 60], [140, y4 + 900 + i * 60]], "#999", 5, ESP + .2 + i * .08, .1);

  const pen = E.el(cam, "abs", "left:0;top:0;width:0;height:0;z-index:20;opacity:0",
    `<div style="position:absolute;left:-6px;top:-300px;width:44px;height:300px;transform:rotate(28deg);transform-origin:6px 300px">
      <div style="position:absolute;left:0;top:0;width:44px;height:230px;border-radius:10px 10px 4px 4px;background:linear-gradient(90deg,#1b2a6b,#3c52b0 45%,#16215a)"></div>
      <div style="position:absolute;left:4px;top:226px;width:36px;height:40px;background:#c9ccd3"></div>
      <div style="position:absolute;left:4px;top:264px;width:0;height:0;border-left:18px solid transparent;border-right:18px solid transparent;border-top:36px solid #2a2a2a"></div></div>
     <div style="position:absolute;left:-40px;top:20px;width:120px;height:40px;border-radius:50%;background:rgba(0,0,0,.12);filter:blur(10px)"></div>`);

  E.K(cam, "y", [[0, 0], [WHO - .25, 0], [WHO + .2, -SH, "io"], [ASK - .25, -SH], [ASK + .2, -SH * 2, "io"], [ESP - .75, -SH * 2], [ESP - .4, -SH * 3, "io"]]);
  E.K(lens, "s", [[2.0, 1], [2.25, 1.18, "out"], [3.3, 1.18], [3.6, 1, "io"], [WHO + 1.0, 1], [WHO + 1.25, 1.2, "out"], [WHO + 2.2, 1.2], [WHO + 2.5, 1, "io"], [ASK + 1.0, 1], [ASK + 1.25, 1.15, "out"], [ASK + 2.3, 1.15], [ASK + 2.6, 1, "io"], [ESP + .2, 1], [ESP + .45, 1.12, "out"]]);

  const cap = E.el(S.el, "abs", "left:60px;top:1640px;width:960px;text-align:center;z-index:12", "");
  const CAPS = [[WHO, "Up to age 23, student or not,"], [WHO + 2.2, "your region's monthly pass can be free."], [ASK - .1, ""], [ASK, "Ask your operator:"], [ASK + 1.5, "navegante in Lisbon, Andante in Porto."], [ESP - .4, ""],
    [ESP, `"Espera!"<br><span style='font-size:38px;color:#ffd640'>(Wait!)</span>`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#1b2a6b;color:#fff;padding:10px 26px;border-radius:14px;font-weight:800;font-size:48px">${s}</span>` : ""; } });

  E.clip(0, "sfx/elx-bus-brakes.wav", { vol: 0.25, duck: false });
  E.clip(0.15, "voices/ep150/n150_hook.wav", { vol: 1.2 });
  E.clip(WHO - .2, "sfx/elx-page-flip.wav", { vol: 0.4, duck: false });
  E.clip(WHO, "voices/ep150/n150_who.wav", { vol: 1.2 });
  E.clip(WHO + 1.0, "sfx/elx-chaching.wav", { vol: 0.3, duck: false });
  E.clip(ASK - .2, "sfx/elx-page-flip.wav", { vol: 0.4, duck: false });
  E.clip(ASK, "voices/ep150/n150_ask.wav", { vol: 1.2 });
  E.clip(ESP - .5, "sfx/elx-page-flip.wav", { vol: 0.4, duck: false });
  E.clip(ESP - .3, "sfx/stairs-run.wav", { vol: 0.35, to: DUR, duck: false });
  E.clip(ESP, "voices/ep150/o150_espera.wav", { vol: 1.3 });
  E.clip(ESP + .4, "sfx/van-away.wav", { vol: 0.4, duck: false });
  E.clip(0, "../tools/reel/eps/ep150-passe/audio/music44.wav", { vol: 0.26, to: DUR });
  E.finish(DUR);
}
