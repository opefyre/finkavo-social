// EP.147 "Why Portuguese workers get paid in lunch money." STYLE TEST: ink-on-notebook doodle, all drawn in code.
// CIRS art. 2.º n.º 3 b) 2): the meal allowance is taxed only on the part above the legal limit, or above it +70% when paid in
// meal vouchers. 2026 limit: €6.15/day (Portaria n.º 51-B/2026/1, art. 1.º, from 1 Jan 2026); vouchers: 6.15 × 1.7 = €10.455
// (≈€10.46, our arithmetic). "Vouchers" is the statute's word (cards are the usual form; not stated in the code). Social Security
// left out. Music: compose.py ep147.
export const meta = { id: "ep147-refeicao", date: "2026-11-29", images: {} };

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 16.6;
  const CASH = 3.0, VOU = 9.1, ABOVE = 12.4, BOM = 14.8;
  const S = E.scene("refeicao", 0, DUR, "light"); E.cur = S;
  const SH = 1930, PAGES = 4;
  const HAND = "'Marker Felt','Chalkboard SE','Bradley Hand',cursive";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  const lens = E.el(S.el, "abs", "inset:0;transform-origin:50% 42%");
  const cam = E.el(lens, "abs", `left:0;top:0;width:1080px;height:${SH * PAGES}px;transform-origin:0 0;background-color:#fbfaf3;` +
    "background-image:linear-gradient(#cfdcec 2px,transparent 2px),linear-gradient(90deg,#cfdcec 2px,transparent 2px);background-size:54px 54px");
  ["#fbfaf3", "#dff3da", "#ffe7c7", "#dde8fb"].forEach((c, i) => E.el(cam, "abs", `left:0;top:${i * SH}px;width:1080px;height:${SH}px;background-color:${c};background-image:linear-gradient(#c3d2e6 2px,transparent 2px),linear-gradient(90deg,#c3d2e6 2px,transparent 2px);background-size:54px 54px`));
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

  // ============ page 1: hook (0 – 2.9) ============
  write(150, 200, "Why Portuguese", 96, "#1b2a6b", 0, .4);
  write(150, 320, "workers get paid", 96, "#1b2a6b", .4, .45);
  write(150, 440, "in <b style='color:#c0392b'>lunch money</b>.", 100, "#1b2a6b", .85, .5);
  E.texts.push({ scene: S, tIn: 0, words: 8 });
  blob(240, 760, 600, 600, "#ffd23f", .3, 0, 300);                               // a big plate
  circ(540, 1060, 300, 300, "#222", 8, .3, .6); circ(540, 1060, 200, 200, "#222", 5, .8, .5);
  line([[170, 820], [170, 1300]], "#222", 9, 1.2, .3); line([[140, 820], [140, 950], [200, 950], [200, 820]], "#222", 6, 1.4, .3);   // fork
  line([[910, 820], [910, 1300]], "#222", 9, 1.6, .3); path([[910, 820], [950, 900], [910, 1000]], "#222", 6, 1.8, .2);             // knife
  write(390, 1000, "€", 150, "#1e8a3c", 2.0, .2, 300, "center");

  // ============ page 2: €6.15 a day in cash (3.0 – 9.0) ============
  const y2 = SH;
  write(150, y2 + 200, "meal allowance, 2026:", 80, "#1b2a6b", CASH, .7);
  write(150, y2 + 320, "tax-free up to", 80, "#1b2a6b", CASH + 2.2, .5);
  blob(140, y2 + 520, 800, 420, "#59b86a", CASH + 1.0, -2, 26);                     // a banknote
  rect(140, y2 + 520, 800, 420, "#123b1c", 7, CASH + 1.0, .5); circ(540, y2 + 730, 150, 150, "#123b1c", 6, CASH + 1.3, .4);
  write(140, y2 + 600, "€6.15", 230, "#fff", CASH + 3.1, .4, 800, "center");
  write(150, y2 + 1030, "a day · in cash", 86, "#123b1c", CASH + 3.6, .5);
  circ(540, y2 + 730, 470, 260, "#c0392b", 8, CASH + 4.2, .5);

  // ============ page 3: ≈€10.46 on meal vouchers; above that, salary (9.1 – 14.6) ============
  const y3 = SH * 2;
  write(150, y3 + 200, "on meal vouchers:", 86, "#1b2a6b", VOU, .6);
  blob(140, y3 + 380, 800, 480, "#ff9d3b", VOU + .4, 2, 34);                        // a meal-voucher card
  rect(140, y3 + 380, 800, 480, "#5a2a00", 7, VOU + .4, .5);
  write(140, y3 + 470, "≈€10.46", 220, "#fff", VOU + 1.3, .4, 800, "center");
  write(140, y3 + 720, "a day", 70, "#5a2a00", VOU + 1.7, .3, 800, "center");
  write(150, y3 + 950, "above that?", 86, "#1b2a6b", ABOVE - .2, .5);
  blob(140, y3 + 1080, 800, 230, "#e0533d", ABOVE + .5, -1, 20);
  write(140, y3 + 1120, "taxed like salary", 100, "#fff", ABOVE + .7, .5, 800, "center");

  // ============ page 4: "Bom apetite!" (14.8 – end) ============
  const y4 = SH * 3;
  blob(160, y4 + 1180, 760, 90, "#8a5a36", BOM - .3, 0, 10);                         // table
  circ(380, y4 + 760, 95, 105, "#222", 7, BOM - .3, .3);
  line([[380, y4 + 865], [380, y4 + 1180]], "#222", 7, BOM - .1, .2);
  line([[380, y4 + 950], [500, y4 + 1020], [600, y4 + 1100]], "#222", 7, BOM, .15); line([[380, y4 + 950], [270, y4 + 1050]], "#222", 7, BOM + .05, .15);
  blob(560, y4 + 1080, 260, 110, "#ffd23f", BOM + .1, 0, 60); circ(690, y4 + 1135, 130, 55, "#222", 5, BOM + .1, .2);   // plate
  line([[350, y4 + 740], [352, y4 + 742]], "#222", 12, BOM - .2, .05); line([[410, y4 + 740], [412, y4 + 742]], "#222", 12, BOM - .2, .05);
  circ(380, y4 + 810, 30, 20, "#222", 6, BOM - .15, .15);
  path([[560, y4 + 420], [1010, y4 + 420], [1010, y4 + 640], [680, y4 + 640], [610, y4 + 720], [630, y4 + 640], [560, y4 + 640], [560, y4 + 424]], "#222", 6, BOM, .4);
  write(575, y4 + 460, "Bom<br>apetite!", 84, "#222", BOM + .3, .5, 430, "center");

  const pen = E.el(cam, "abs", "left:0;top:0;width:0;height:0;z-index:20;opacity:0",
    `<div style="position:absolute;left:-6px;top:-300px;width:44px;height:300px;transform:rotate(28deg);transform-origin:6px 300px">
      <div style="position:absolute;left:0;top:0;width:44px;height:230px;border-radius:10px 10px 4px 4px;background:linear-gradient(90deg,#1b2a6b,#3c52b0 45%,#16215a)"></div>
      <div style="position:absolute;left:4px;top:226px;width:36px;height:40px;background:#c9ccd3"></div>
      <div style="position:absolute;left:4px;top:264px;width:0;height:0;border-left:18px solid transparent;border-right:18px solid transparent;border-top:36px solid #2a2a2a"></div></div>
     <div style="position:absolute;left:-40px;top:20px;width:120px;height:40px;border-radius:50%;background:rgba(0,0,0,.12);filter:blur(10px)"></div>`);

  E.K(cam, "y", [[0, 0], [CASH - .25, 0], [CASH + .2, -SH, "io"], [VOU - .25, -SH], [VOU + .2, -SH * 2, "io"], [BOM - .55, -SH * 2], [BOM - .2, -SH * 3, "io"]]);
  E.K(lens, "s", [[1.8, 1], [2.05, 1.18, "out"], [2.6, 1.18], [2.8, 1, "io"], [CASH + 3.0, 1], [CASH + 3.25, 1.2, "out"], [CASH + 4.0, 1.2], [CASH + 4.3, 1, "io"], [VOU + 1.2, 1], [VOU + 1.45, 1.2, "out"], [VOU + 2.4, 1.2], [VOU + 2.7, 1, "io"], [ABOVE + .4, 1], [ABOVE + .65, 1.15, "out"], [ABOVE + 1.6, 1.15], [ABOVE + 1.9, 1, "io"], [BOM + .2, 1], [BOM + .45, 1.12, "out"]]);

  const cap = E.el(S.el, "abs", "left:60px;top:1640px;width:960px;text-align:center;z-index:12", "");
  const CAPS = [[CASH, "In 2026, the meal allowance is tax-free"], [CASH + 2.9, "up to €6.15 a day in cash."], [VOU - .1, ""], [VOU, "Or about €10.46 on meal vouchers."],
    [ABOVE, "Above that, it's taxed like salary."], [BOM - .3, ""], [BOM, `"Bom apetite!"<br><span style='font-size:38px;color:#ffd640'>(Enjoy your meal!)</span>`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#1b2a6b;color:#fff;padding:10px 26px;border-radius:14px;font-weight:800;font-size:48px">${s}</span>` : ""; } });

  E.clip(0, "sfx/elx-cutlery.wav", { vol: 0.25, to: CASH, duck: false });
  E.clip(0.15, "voices/ep147/n147_hook.wav", { vol: 1.2 });
  E.clip(CASH - .2, "sfx/elx-page-flip.wav", { vol: 0.4, duck: false });
  E.clip(CASH, "voices/ep147/n147_cash.wav", { vol: 1.2 });
  E.clip(CASH + 3.1, "sfx/elx-chaching.wav", { vol: 0.35, duck: false });
  E.clip(VOU - .2, "sfx/elx-page-flip.wav", { vol: 0.4, duck: false });
  E.clip(VOU, "voices/ep147/n147_vouch.wav", { vol: 1.2 });
  E.clip(ABOVE + .5, "sfx/fs-rubber-stamp.wav", { vol: 0.6, duck: false });
  E.clip(BOM - .3, "sfx/elx-page-flip.wav", { vol: 0.4, duck: false });
  E.clip(BOM, "voices/ep147/o147_bom.wav", { vol: 1.3 });
  E.clip(BOM + .4, "sfx/elx-munch.wav", { vol: 0.4, duck: false });
  E.clip(0, "../tools/reel/eps/ep147-refeicao/audio/music44.wav", { vol: 0.26, to: DUR });
  E.finish(DUR);
}
