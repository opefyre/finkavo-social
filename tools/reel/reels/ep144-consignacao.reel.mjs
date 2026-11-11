// EP.144 "Portugal lets you give away tax you already paid." STYLE TEST: ink-on-notebook doodle, all drawn in code.
// Lei 16/2001 art. 32.º n.º 4 and 6 (as amended by Lei 42/2024): 1% of the IRS assessed on the annual return can go to a church,
// an IPSS or a public-utility charity; CIRS art. 152.º: the same 1% to cultural/youth/sports bodies; Lei 42/2024 art. 5.º: income
// from 2024 on. Chosen in the IRS return or beforehand on the Portal (CIRS art. 153.º). Bill unchanged: the share comes out of tax
// already assessed (our reading of "imposto liquidado"; no source states it in words). IVA consignation left out (it costs you).
// Music: compose.py ep144.
export const meta = { id: "ep144-consignacao", date: "2026-11-27", images: {} };

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 13.0;
  const HOW = 3.3, FREE = 8.0, OBG = 10.4;
  const S = E.scene("consig", 0, DUR, "light"); E.cur = S;
  const SH = 1930, PAGES = 4;
  const HAND = "'Marker Felt','Chalkboard SE','Bradley Hand',cursive";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  const lens = E.el(S.el, "abs", "inset:0;transform-origin:50% 42%");
  const cam = E.el(lens, "abs", `left:0;top:0;width:1080px;height:${SH * PAGES}px;transform-origin:0 0;background-color:#fbfaf3;` +
    "background-image:linear-gradient(#cfdcec 2px,transparent 2px),linear-gradient(90deg,#cfdcec 2px,transparent 2px);background-size:54px 54px");
  ["#fbfaf3", "#fff3c4", "#dff3da", "#dde8fb"].forEach((c, i) => E.el(cam, "abs", `left:0;top:${i * SH}px;width:1080px;height:${SH}px;background-color:${c};background-image:linear-gradient(#c3d2e6 2px,transparent 2px),linear-gradient(90deg,#c3d2e6 2px,transparent 2px);background-size:54px 54px`));
  E.el(cam, "abs", `left:110px;top:0;width:4px;height:${SH * PAGES}px;background:#f0a3a3`);
  const blob = (x, y, w, h, bg, t0, rot = 0, r = 6) => { const b = E.el(cam, "abs", `left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${bg};border-radius:${r}px;transform:rotate(${rot}deg);box-shadow:0 10px 18px rgba(0,0,0,.15);opacity:0`); E.F(t => { b.style.opacity = Math.max(0, Math.min(1, (t - t0) / .2)); }); E.pop(b, t0, { from: 1.15, dur: .2 }); return b; };
  E.el(cam, "abs", "left:720px;top:2500px;width:320px;height:320px;border-radius:50%;box-shadow:inset 0 0 0 16px rgba(150,95,40,.18),inset 0 0 0 26px rgba(150,95,40,.07)");
  blob(220, 730, 480, 620, "#ffd23f", 1.6, -3);                          // p1: the IRS sheet becomes a yellow sticky note
  blob(110, SH + 330, 600, 600, "#5aa9f0", 4.4, 0, 300);                  // p2: the pie fills
  blob(630, SH + 410, 440, 640, "#ff86a8", 5.4, 3);                       // p2: pink sticky note behind the heart
  blob(215, SH * 2 + 515, 270, 530, "#4fbf5a", 9.0); blob(635, SH * 2 + 515, 270, 530, "#4fbf5a", 9.05);  // p3: equal bars fill
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

  // ============ page 1: hook (0 – 3.2) ============
  write(150, 230, "Portugal lets you", 96, "#1b2a6b", 0, .45);
  write(150, 350, "<b>give away</b> tax", 104, "#c0392b", .45, .45);
  write(150, 475, "you already <u>paid</u>.", 96, "#1b2a6b", .9, .5);
  E.texts.push({ scene: S, tIn: 0, words: 9 });
  rect(250, 760, 420, 560, "#222", 7, .3, .8); write(290, 790, "IRS", 90, "#222", .9, .3, 340, "center");
  for (let i = 0; i < 4; i++) line([[300, 960 + i * 80], [620, 960 + i * 80]], "#999", 5, 1.1 + i * .12, .15);
  line([[700, 1040], [800, 1040], [775, 1015], [800, 1040], [775, 1065]], "#c0392b", 7, 2.3, .3);
  heart(900, 1060, 6.2, "#c0392b", 8, 2.5, .6);

  // ============ page 2: 1% to a charity you pick (3.3 – 7.9) ============
  const y2 = SH;
  circ(410, y2 + 630, 300, 300, "#222", 8, HOW, .6, 1.02);
  line([[410, y2 + 630], [410, y2 + 330]], "#222", 6, HOW + .5, .15); line([[410, y2 + 630], [470, y2 + 336]], "#222", 6, HOW + .6, .15);
  write(160, y2 + 680, "your IRS", 70, "#1b2a6b", HOW + .7, .4, 480, "center");
  write(380, y2 + 190, "1%", 120, "#c0392b", HOW + 1.0, .3, 200);
  line([[500, y2 + 300], [740, y2 + 520], [712, y2 + 478], [740, y2 + 520], [692, y2 + 522]], "#c0392b", 8, HOW + 1.4, .4);
  heart(850, y2 + 600, 7, "#c0392b", 9, HOW + 1.8, .6);
  write(660, y2 + 770, "a charity<br>you pick", 66, "#c0392b", HOW + 2.3, .5, 380, "center");
  rect(160, y2 + 1080, 80, 80, "#222", 6, 6.6, .3); line([[175, y2 + 1120], [200, y2 + 1150], [250, y2 + 1060]], "#1e8a3c", 9, 6.9, .25);
  write(270, y2 + 1078, "in your IRS return", 74, "#1b2a6b", 6.8, .6, 760);

  // ============ page 3: your bill stays the same (8.0 – 10.3) ============
  const y3 = SH * 2;
  write(150, y3 + 230, "your bill:", 96, "#1b2a6b", FREE - .05, .45);
  rect(215, y3 + 515, 270, 530, "#222", 7, FREE + .3, .4); rect(635, y3 + 515, 270, 530, "#222", 7, FREE + .5, .4);
  for (let i = 0; i < 6; i++) line([[230, y3 + 560 + i * 80], [410, y3 + 530 + i * 80]], "#999", 4, FREE + .7 + i * .05, .08);
  for (let i = 0; i < 6; i++) line([[650, y3 + 560 + i * 80], [830, y3 + 530 + i * 80]], "#999", 4, FREE + .9 + i * .05, .08);
  write(170, y3 + 1070, "without", 60, "#222", FREE + .6, .3, 300, "center"); write(590, y3 + 1070, "with 1%", 60, "#c0392b", FREE + .8, .3, 300, "center");
  write(470, y3 + 700, "=", 160, "#1e8a3c", FREE + 1.2, .2, 140, "center");
  circ(530, y3 + 790, 110, 110, "#1e8a3c", 8, FREE + 1.4, .4);

  // ============ page 4: "Obrigado, Finanças!" (10.4 – end) ============
  const y4 = SH * 3;
  circ(380, y4 + 760, 95, 105, "#222", 7, OBG - .2, .3);
  circ(380, y4 + 620, 90, 22, "#d99a16", 8, OBG + .1, .3);                // halo
  line([[380, y4 + 865], [380, y4 + 1250]], "#222", 7, OBG + .1, .2);
  line([[380, y4 + 940], [500, y4 + 860], [540, y4 + 790]], "#222", 7, OBG + .25, .15); line([[380, y4 + 950], [260, y4 + 860], [230, y4 + 790]], "#222", 7, OBG + .3, .15);
  line([[380, y4 + 1250], [290, y4 + 1450]], "#222", 7, OBG + .4, .12); line([[380, y4 + 1250], [470, y4 + 1450]], "#222", 7, OBG + .45, .12);
  line([[350, y4 + 740], [352, y4 + 742]], "#222", 12, OBG, .05); line([[410, y4 + 740], [412, y4 + 742]], "#222", 12, OBG, .05);
  line([[335, y4 + 795], [380, y4 + 835], [425, y4 + 795]], "#222", 6, OBG + .05, .12);
  path([[560, y4 + 420], [1010, y4 + 420], [1010, y4 + 640], [680, y4 + 640], [610, y4 + 720], [630, y4 + 640], [560, y4 + 640], [560, y4 + 424]], "#222", 6, OBG + .1, .4);
  write(575, y4 + 455, "Obrigado,<br>Finanças!", 80, "#222", OBG + .4, .6, 430, "center");
  heart(800, y4 + 1000, 4, "#c0392b", 7, OBG + 1.0, .35); heart(900, y4 + 900, 3, "#c0392b", 6, OBG + 1.2, .3);

  const pen = E.el(cam, "abs", "left:0;top:0;width:0;height:0;z-index:20;opacity:0",
    `<div style="position:absolute;left:-6px;top:-300px;width:44px;height:300px;transform:rotate(28deg);transform-origin:6px 300px">
      <div style="position:absolute;left:0;top:0;width:44px;height:230px;border-radius:10px 10px 4px 4px;background:linear-gradient(90deg,#1b2a6b,#3c52b0 45%,#16215a)"></div>
      <div style="position:absolute;left:4px;top:226px;width:36px;height:40px;background:#c9ccd3"></div>
      <div style="position:absolute;left:4px;top:264px;width:0;height:0;border-left:18px solid transparent;border-right:18px solid transparent;border-top:36px solid #2a2a2a"></div></div>
     <div style="position:absolute;left:-40px;top:20px;width:120px;height:40px;border-radius:50%;background:rgba(0,0,0,.12);filter:blur(10px)"></div>`);

  E.K(cam, "y", [[0, 0], [HOW - .25, 0], [HOW + .3, -SH, "io"], [FREE - .25, -SH], [FREE + .3, -SH * 2, "io"], [OBG - .45, -SH * 2], [OBG - .2, -SH * 3, "io"]]);
  E.K(lens, "s", [[2.2, 1], [2.45, 1.22, "out"], [3.1, 1.22], [3.3, 1, "io"], [6.6, 1], [6.85, 1.25, "out"], [7.8, 1.25], [8.0, 1, "io"], [9.5, 1], [9.75, 1.22, "out"], [10.0, 1.22], [10.2, 1, "io"], [11.6, 1], [11.85, 1.15, "out"]]);

  const cap = E.el(S.el, "abs", "left:60px;top:1640px;width:960px;text-align:center;z-index:12", "");
  const CAPS = [[HOW, "In your IRS return,"], [HOW + 1.4, "send 1% of your tax to a charity you pick."], [FREE - .1, ""], [FREE, "Your bill stays exactly the same."], [OBG - .2, ""],
    [OBG, `"Obrigado, Finanças!"<br><span style='font-size:38px;color:#ffd640'>(Thank you, tax office!)</span>`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#1b2a6b;color:#fff;padding:10px 26px;border-radius:14px;font-weight:800;font-size:48px">${s}</span>` : ""; } });

  E.clip(0.15, "voices/ep144/n144_hook.wav", { vol: 1.2 });
  E.clip(HOW, "voices/ep144/n144_how.wav", { vol: 1.2 });
  E.clip(HOW, "sfx/elx-page-flip.wav", { vol: 0.4, duck: false });
  E.clip(FREE, "sfx/elx-page-flip.wav", { vol: 0.4, duck: false });
  E.clip(FREE, "voices/ep144/n144_free.wav", { vol: 1.2 });
  E.clip(FREE + 1.3, "sfx/elx-chaching.wav", { vol: 0.35, duck: false });
  E.clip(OBG - .2, "sfx/elx-page-flip.wav", { vol: 0.4, duck: false });
  E.clip(OBG, "voices/ep144/o144_obrigado.wav", { vol: 1.3 });
  E.clip(OBG + .9, "sfx/angel-choir.wav", { vol: 0.25, duck: false });
  E.clip(0, "../tools/reel/eps/ep144-consignacao/audio/music44.wav", { vol: 0.26, to: DUR });
  E.finish(DUR);
}
