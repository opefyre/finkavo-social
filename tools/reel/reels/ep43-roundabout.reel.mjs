// EP.43 "Portuguese roundabouts" — top-down, drawn in code. Otto enters a two-lane roundabout, indicating right to take the first
// exit. A car from the inner lane cuts across to that exit: screech, horn, missed. LAP 2: a taxi does the same. Montage: LAP 3 → 37,
// day and night flicker by, and his face-cam grows stubble, then a long white beard (DAY 12). Then Dona Fernanda's tiny car hugs the
// island and cuts across both lanes to the exit, beep-beep. Otto finally gets out… and the camera pans to the next roundabout:
// LAP 1. Effects only (traffic, screeches, horns). Face-cam uses the existing Otto/grandma cutouts.
export const meta = {
  id: "ep43-roundabout", date: "2026-11-05",
  images: {
    hop: "characters/cutouts/otto_hopeful.webp", pan: "characters/cutouts/otto_panic.webp", def: "characters/cutouts/otto_defeated.webp",
    stb: "characters/cutouts/otto_stubble.webp", anc: "characters/cutouts/otto_ancient.webp", gm: "characters/cutouts/dona-car_proud.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 120, root: 57, seed: 431, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 17.8;
  const S = E.scene("roundabout", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const lerpK = (K, t) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t < K[i + 1][0]) { let u = (t - K[i][0]) / (K[i + 1][0] - K[i][0]); if (K[i + 1][2] === "io") u = u * u * (3 - 2 * u); if (K[i + 1][2] === "out") u = 1 - (1 - u) * (1 - u); return K[i][1] + (K[i + 1][1] - K[i][1]) * u; } return K[K.length - 1][1]; };
  const sm = u => { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); };
  const CX = 540, CY = 1180, CX2 = 1620, R2 = 330, R1 = 250, LANE = 45;
  const rad = d => d * Math.PI / 180;
  const circ = (R, th, cx = CX) => [cx + R * Math.cos(rad(th)), CY + R * Math.sin(rad(th))];
  const mix = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  const EXIT = [CX + R2 + 170, CY + LANE];                                                          // east road, eastbound lane

  // ---------------- the world (two roundabouts side by side; the camera pans at the end) ----------------
  const W = E.el(S.el, "abs", "left:0;top:0;width:2160px;height:1920px");
  const PAN = [[0, 0], [13.9, 0], [15.6, -1080, "io"]];
  E.F(t => { W.style.transform = `translateX(${lerpK(PAN, t)}px)`; });
  const rb = cx => `
    <circle cx="${cx}" cy="${CY}" r="392" fill="#e9e4d8"/>
    <circle cx="${cx}" cy="${CY}" r="380" fill="#5d6166"/>
    <circle cx="${cx}" cy="${CY}" r="${(R1 + R2) / 2}" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="26 22" opacity=".85"/>
    <circle cx="${cx}" cy="${CY}" r="206" fill="#fff"/>
    <circle cx="${cx}" cy="${CY}" r="198" fill="#86c46e"/>
    <circle cx="${cx}" cy="${CY}" r="150" fill="#79b862"/>
    <circle cx="${cx}" cy="${CY}" r="70" fill="#d9d2c0" stroke="#bfb6a0" stroke-width="8"/>
    <circle cx="${cx}" cy="${CY}" r="42" fill="#7cc4ee" stroke="#e9f6ff" stroke-width="6"/>
    <circle cx="${cx}" cy="${CY}" r="14" fill="#e9f6ff"/>
    ${[0, 60, 120, 180, 240, 300].map(a => `<circle cx="${cx + 110 * Math.cos(rad(a))}" cy="${CY + 110 * Math.sin(rad(a))}" r="16" fill="${a % 120 ? "#f2b632" : "#e5484d"}"/>`).join("")}`;
  const zebra = (x, y, horiz) => Array.from({ length: 6 }, (_, i) => horiz ? `<rect x="${x + i * 30 - 90}" y="${y}" width="16" height="70" fill="#fff" opacity=".9"/>` : `<rect x="${x}" y="${y + i * 30 - 90}" width="70" height="16" fill="#fff" opacity=".9"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2160" height="1920" viewBox="0 0 2160 1920">
    <rect width="2160" height="1920" fill="#cfe3c1"/>
    ${[[60, 470, 300, 260], [700, 470, 300, 250], [60, 1560, 300, 330], [700, 1560, 320, 330], [1140, 470, 300, 250], [1780, 470, 320, 260], [1140, 1560, 300, 330], [1780, 1560, 320, 330]].map(([x, y, w, h], i) => `<rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" rx="10" fill="#e9e4d8"/><rect x="${x + 10}" y="${y + 12}" width="${w}" height="${h}" rx="6" fill="rgba(0,0,0,.12)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${["#d9724a", "#e08a5a", "#c9633f", "#e39a6a"][i % 4]}"/><path d="M${x} ${y + h / 2} H${x + w}" stroke="rgba(0,0,0,.18)" stroke-width="6"/>`).join("")}
    ${[[420, 800], [880, 820], [420, 1560], [960, 1520], [1500, 800], [1960, 820], [1500, 1560], [2040, 1520]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="46" fill="#4f9a45"/><circle cx="${x - 10}" cy="${y - 10}" r="26" fill="#63b458"/>`).join("")}
    <rect x="0" y="${CY - 90}" width="2160" height="180" fill="#5d6166"/>
    <rect x="${CX - 90}" y="0" width="180" height="1920" fill="#5d6166"/><rect x="${CX2 - 90}" y="0" width="180" height="1920" fill="#5d6166"/>
    <path d="M0 ${CY} H2160 M${CX} 0 V1920 M${CX2} 0 V1920" stroke="#f4d35e" stroke-width="6" stroke-dasharray="40 30"/>
    ${zebra(CX, CY + 440, true)}${zebra(CX, CY - 510, true)}${zebra(CX - 510, CY, false)}${zebra(CX + 440, CY, false)}
    ${zebra(CX2, CY + 440, true)}${zebra(CX2, CY - 510, true)}${zebra(CX2 - 510, CY, false)}${zebra(CX2 + 440, CY, false)}
    ${rb(CX)}${rb(CX2)}
  </svg>`;
  E.el(W, "abs", "left:0;top:0;width:2160px;height:1920px", svg);
  // the "roundabout 200 m" sign, seen during the pan
  const sign = E.el(W, "abs", `left:1140px;top:${CY + 110}px;width:150px;height:170px;background:#1f5fb4;border:8px solid #fff;border-radius:16px;box-shadow:0 8px 16px rgba(0,0,0,.25);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:30px;z-index:3`);
  E.el(sign, "", "", `<svg width="90" height="90" viewBox="0 0 90 90"><circle cx="45" cy="45" r="30" fill="none" stroke="#fff" stroke-width="10"/><path d="M45 5 l12 12 h-24z M85 45 l-12 12 v-24z M45 85 l-12 -12 h24z M5 45 l12 -12 v24z" fill="#fff"/></svg>`);
  E.el(sign, "", "", "200 m");

  // ---------------- cars (top-down; front points up before rotation) ----------------
  const car = (col, len = 132, wid = 72, roof = "rgba(255,255,255,.18)") => {
    const c = E.el(W, "abs", `left:0;top:0;width:${wid}px;height:${len}px;margin-left:${-wid / 2}px;margin-top:${-len / 2}px;z-index:4`);
    for (const [x, y] of [[-6, 18], [wid - 6, 18], [-6, len - 42], [wid - 6, len - 42]]) E.el(c, "abs", `left:${x}px;top:${y}px;width:12px;height:26px;border-radius:4px;background:#1b1b1b`);
    const b = E.el(c, "abs", `inset:0;border-radius:${wid * .42}px ${wid * .42}px ${wid * .3}px ${wid * .3}px;background:${col};box-shadow:0 8px 12px rgba(0,0,0,.35)`);
    E.el(b, "abs", `left:9px;top:${len * .2}px;width:${wid - 18}px;height:${len * .17}px;border-radius:10px 10px 4px 4px;background:#2c3e50`);
    E.el(b, "abs", `left:9px;top:${len * .39}px;width:${wid - 18}px;height:${len * .3}px;border-radius:6px;background:${roof}`);
    E.el(b, "abs", `left:11px;top:${len * .71}px;width:${wid - 22}px;height:${len * .12}px;border-radius:4px 4px 10px 10px;background:#2c3e50`);
    for (const x of [8, wid - 22]) E.el(b, "abs", `left:${x}px;top:3px;width:14px;height:8px;border-radius:4px;background:#fff6b0`);
    return c;
  };
  const drive = (el, pos, hide) => {
    E.F(t => {
      const p = pos(t), q = pos(t + .03), h = hide ? hide(t) : false;
      const ang = Math.atan2(q[0] - p[0], -(q[1] - p[1])) * 180 / Math.PI;
      if (Math.hypot(q[0] - p[0], q[1] - p[1]) > .01) el.__ang = ang;
      el.style.transform = `translate(${p[0]}px,${p[1]}px) rotate(${el.__ang || 0}deg)`;
      el.style.opacity = h ? 0 : 1;
    });
  };
  // Otto: yellow, indicating right the whole time
  const TH = [[1.0, 80], [2.3, 42], [2.9, 35, "out"], [5.25, -318], [5.8, -325, "out"], [6.1, -333], [10.4, -333 - 35 * 360, "io"], [12.25, -13280], [12.85, -13286, "out"], [13.4, -13288]];
  const ottoPos = t => {
    if (t < 1.0) return [CX + LANE, 1790 - (1790 - (CY + R2 + 40)) * (t / 1.0)];
    if (t < 13.4) { const c = circ(R2, lerpK(TH, t)); if (t < 1.35) return mix([CX + LANE, CY + R2 + 40], c, sm((t - 1.0) / .35)); return c; }
    const u = sm((t - 13.4) / .6), a = circ(R2, -13288 + 360 * 37), e = [EXIT[0], EXIT[1]];
    if (t < 14.0) return mix(a, e, u);
    return [lerpK([[14.0, EXIT[0]], [15.9, CX2 - R2 - 150], [16.4, CX2 - R2 - 60, "out"]], t), CY + LANE];
  };
  const oc = car("#f2b632", 136, 74, "#2f9e6f");
  drive(oc, ottoPos, t => t > 6.4 && t < 10.2);
  const blink = [0, 1].map(i => E.el(oc, "abs", `left:${58}px;top:${i ? 118 : 4}px;width:18px;height:14px;border-radius:5px;background:#ff8a00;box-shadow:0 0 12px 4px rgba(255,138,0,.8)`));
  E.F(t => blink.forEach(b => { b.style.opacity = t > .6 && (t * 2.2) % 1 < .5 ? 1 : 0; }));
  // the blur ring during the montage
  const ring = E.el(W, "abs", `left:${CX - R2 - 40}px;top:${CY - R2 - 40}px;width:${2 * R2 + 80}px;height:${2 * R2 + 80}px;border-radius:50%;z-index:4;opacity:0;background:conic-gradient(from 0deg,rgba(242,182,50,0),rgba(242,182,50,.95) 20%,rgba(242,182,50,0) 40%,rgba(242,182,50,0));-webkit-mask:radial-gradient(circle,transparent ${R2 - 40}px,#000 ${R2 - 36}px,#000 ${R2 + 36}px,transparent ${R2 + 40}px)`);
  E.K(ring, "o", [[6.3, 0], [6.5, 1], [10.1, 1], [10.3, 0]]);
  E.F(t => { ring.style.transform = `rotate(${-t * 1400}deg)`; });
  // the blue car: inner lane, then straight across Otto to the exit
  const cutter = (col, t0, th0, th1, tc, roof) => {
    const c = car(col, 132, 72, roof);
    drive(c, t => {
      if (t < tc) return circ(R1, th0 + (th1 - th0) * sm((t - t0) / (tc - t0)));
      if (t < tc + .5) return mix(circ(R1, th1), EXIT, sm((t - tc) / .5));
      return [EXIT[0] + (t - tc - .5) * 900, EXIT[1]];
    }, t => t < t0 || t > tc + 1.4);
    return c;
  };
  cutter("#2f6db5", 1.2, 140, 30, 2.3);
  cutter("#e8dcc0", 4.3, -210, -330, 5.2, "#2f9e6f");                                               // a Lisbon taxi
  // two cars that just circle in the inner lane (traffic)
  [["#e5484d", 0], ["#f4f4f4", 180]].forEach(([col, ph]) => { const c = car(col); drive(c, t => circ(R1, ph - t * 60 - (t > 6.3 && t < 10.3 ? (t - 6.3) * 300 : t >= 10.3 ? 1200 : 0)), t => (t > 1.1 && t < 3.0) || (t > 4.2 && t < 6.0) || t > 11.4); });
  // Dona Fernanda: tiny mint car, hugging the island, straight across both lanes
  const gc = car("#bcd9c4", 104, 60, "rgba(255,255,255,.35)");
  drive(gc, t => {
    if (t < 11.3) return [lerpK([[10.7, -120], [11.3, CX - R2 - 30]], t), CY + LANE];
    if (t < 12.2) return circ(222, 165 - 135 * sm((t - 11.3) / .9));
    if (t < 12.55) return mix(circ(222, 30), EXIT, sm((t - 12.2) / .35));
    return [EXIT[0] + (t - 12.55) * 1100, EXIT[1]];
  }, t => t < 10.7 || t > 13.6);

  // ---------------- HUD: lap counter, face-cam ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:56px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7`, "");
  E.F(t => {
    let n = t < 1.0 ? 0 : 1 + Math.max(0, Math.floor((80 - lerpK(TH, Math.min(t, 13.4))) / 360 + .02));
    if (t >= 16.4) n = 1;
    const s = t < 1.0 ? "LAP 0" : `LAP ${n}`; if (pill.textContent !== s) pill.textContent = s;
    pill.style.background = n >= 3 && t < 16.4 ? C.coralD : C.ink;
  });
  E.K(pill, "s", [[16.39, 1], [16.4, 1.4], [16.7, 1, "out"]]);
  const cam = E.el(S.el, "abs", "left:760px;top:430px;width:250px;height:250px;border-radius:50%;overflow:hidden;background:#fde9c8;border:10px solid #fff;box-shadow:0 10px 26px rgba(0,0,0,.25);z-index:7");
  const FACES = { hop: [751, 1108, 1.0, 379, 150], pan: [751, 1108, 1.0, 379, 150], def: [751, 1108, 1.0, 379, 150], stb: [751, 1108, 1.0, 379, 150], anc: [751, 1108, .82, 379, 190], gm: [928, 476, 1.45, 448, 118] };
  const fim = Object.entries(FACES).map(([n, [w, h, s, fx, fy]]) => [n, E.img(cam, n, `position:absolute;left:${125 - fx * s}px;top:${125 - fy * s}px;width:${w * s}px;height:${h * s}px;opacity:0`)]);
  const FACE = [[0, "hop"], [2.35, "pan"], [3.6, "hop"], [5.2, "pan"], [5.9, "def"], [7.4, "stb"], [9.2, "anc"], [11.9, "gm"], [12.9, "anc"]];
  E.F(t => { const f = at(FACE, t); fim.forEach(([n, el]) => { el.style.opacity = n === f ? 1 : 0; }); });
  const camL = E.el(S.el, "abs", "left:760px;top:690px;width:270px;text-align:center;z-index:7", "");
  const camT = E.el(camL, "", "display:inline-block;background:#1d2b36;color:#fff;font-weight:900;font-size:30px;padding:4px 14px;border-radius:10px", "");
  E.F(t => { const d = t < 6.3 ? 1 : t < 10.3 ? 1 + Math.floor((t - 6.3) / 4 * 11) : 12, s = t >= 11.9 && t < 12.9 ? "DONA FERNANDA" : `OTTO · DAY ${d}`; if (camT.textContent !== s) camT.textContent = s; });
  // day / night flicker during the montage
  const night = E.el(S.el, "abs", "inset:0;background:#0b1640;z-index:5;opacity:0;pointer-events:none");
  E.F(t => { night.style.opacity = t > 6.3 && t < 10.3 ? (.28 * (1 - Math.cos((t - 6.3) * Math.PI * 2 * 2.75)) / 2) : 0; });
  // "!" pops over Otto's car when he brakes
  [2.35, 5.2, 12.3].forEach(t => {
    const b = E.el(S.el, "abs", "left:0;top:0;width:80px;height:80px;border-radius:50%;background:#fff;color:#e5484d;font-weight:900;font-size:64px;display:flex;align-items:center;justify-content:center;z-index:8;opacity:0;box-shadow:0 6px 14px rgba(0,0,0,.25)", "!");
    E.F(tt => { const p = ottoPos(Math.min(tt, t + .9)), on = tt >= t && tt < t + .9; b.style.opacity = on ? 1 : 0; b.style.transform = `translate(${p[0] - 40 + lerpK(PAN, tt)}px,${p[1] - 150}px) scale(${on ? 1 + .25 * Math.max(0, 1 - (tt - t) / .2) : 1})`; });
  });

  // ---------------- stamp ----------------
  const sb = E.el(S.el, "abs", "left:60px;top:1420px;width:960px;display:flex;justify-content:center;z-index:9");
  const st = E.stamp(sb, "NEXT ROUNDABOUT.", 16.6, { size: 92, rot: -6, bg: C.coralD, shake: 12 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  for (let k = 0; k < 4; k++) E.clip(k * 4.8, "sfx/traffic-loop.wav", { vol: .7, duck: false, to: k === 3 ? DUR - 14.4 : 4.9 });
  for (const t of [2.3, 5.2, 12.3]) { E.clip(t, "sfx/tire-screech.wav", { vol: .7 }); }
  E.clip(2.45, "sfx/car-horn.wav", { vol: .6 }); E.clip(5.35, "sfx/car-horn.wav", { vol: .6, to: .6 });
  E.S(6.2, "riser", .7); for (let k = 0; k < 16; k++) E.S(6.4 + k * .24, "tick", .45);
  E.clip(12.25, "sfx/horn-beep.wav", { vol: .9 });
  E.S(13.5, "ding", .7);
  E.S(14.1, "whoosh", .5);
  E.S(16.4, "nope", .8);

  // ---------------- title (frame 0) ----------------
  const tb = E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(246,239,226,.94);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:6");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Portuguese *roundabouts*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[17.0, 1], [17.25, 1.18, "out"], [17.6, 1, "io"]]);
}
