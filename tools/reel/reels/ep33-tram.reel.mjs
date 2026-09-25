// EP.33 "Tram 28 at rush hour" — Tetris. Passengers drop into the tram like Tetris pieces, rotating to fit (lying down, upside
// down, squashed thin); PASSENGERS climbs to 70; the tram groans. Stop. The doors open: a tiny old lady with a shopping trolley.
// "Com licença!" She steps in — and every other passenger pops out through the windows. PASSENGERS: 1. She got a seat.
// Effects only (tram bell, clicks, thuds, squish, crowd groan), no voice. Paced per the skit guide.
export const meta = {
  id: "ep33-tram", date: "2026-10-26",
  images: {
    nico: "characters/cutouts/nico_default.webp", marta: "characters/cutouts/marta_default.webp", leo: "characters/cutouts/leo_default.webp",
    buck: "characters/cutouts/buck_map.webp", carimbo: "characters/cutouts/carimbo_deadpan.webp", zoe: "characters/cutouts/zoe_default.webp",
    otto: "characters/cutouts/otto-casual_betrayed.webp", renda: "characters/cutouts/renda_default.webp", lady: "characters/cutouts/oldlady_trolley.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 128, root: 57, seed: 331, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [5, 9, 12]] });
  const DUR = 14.4;
  const S = E.scene("tram", 0, DUR, "light"); E.cur = S;
  const WL = 140, WR = 940, WT = 560, WB = 1540;                   // the well = the inside of the tram
  const STOP = 6.9, OPEN = 7.5, ENTER = 8.2, EJECT = 9.1, SEAT = 11.0;

  // ---------------- street and tram ----------------
  E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;background:linear-gradient(180deg,#8fcdf0,#e4f4fb)");
  ["#f4c7a1", "#f7e3a3", "#bfe3d3", "#f2b8b0"].forEach((c, i) => E.el(S.el, "abs", `left:${i * 280 - 20}px;top:${360 + (i % 2) * 60}px;width:290px;height:1400px;background:${c};border-top:30px solid #c0643f;opacity:.55`));
  E.el(S.el, "abs", "left:0;top:1640px;width:1080px;height:280px;background:#8d8a84");
  E.el(S.el, "abs", "left:0;top:1700px;width:1080px;height:10px;background:#5f5c56"); E.el(S.el, "abs", "left:0;top:1760px;width:1080px;height:10px;background:#5f5c56");
  const tram = E.el(S.el, "abs", "inset:0;transform-origin:540px 1640px");
  E.el(tram, "abs", `left:${WL - 40}px;top:${WT - 110}px;width:${WR - WL + 80}px;height:${WB - WT + 190}px;border-radius:50px 50px 18px 18px;background:#ffcf2e;box-shadow:inset 0 -46px 0 #e0a800,0 16px 30px rgba(0,0,0,.25)`);
  E.el(tram, "abs", `left:${WL + 300}px;top:${WT - 160}px;width:${WR - WL - 600}px;height:56px;border-radius:14px;background:#3b3b3b`);
  E.el(tram, "abs", `left:${WL + 260}px;top:${WT - 104}px;width:${WR - WL - 520}px;height:44px;border-radius:10px;background:#222;color:#ffd43b;font-weight:900;font-size:36px;display:flex;align-items:center;justify-content:center`, "28 · PRAZERES");
  // the inside, with a faint Tetris grid
  E.el(tram, "abs", `left:${WL}px;top:${WT}px;width:${WR - WL}px;height:${WB - WT}px;border-radius:10px;background:#fff6d8;background-image:linear-gradient(rgba(0,0,0,.06) 2px,transparent 2px),linear-gradient(90deg,rgba(0,0,0,.06) 2px,transparent 2px);background-size:80px 80px`);
  // window frames along the top (the passengers pop out through them)
  for (let i = 0; i < 5; i++) E.el(tram, "abs", `left:${WL + 20 + i * 156}px;top:${WT - 70}px;width:130px;height:56px;border-radius:12px;background:#9fd3f0;border:6px solid #fff6d0`);
  E.el(tram, "abs", `left:${WL - 40}px;top:${WB}px;width:${WR - WL + 80}px;height:60px;background:#3b3b3b;border-radius:0 0 18px 18px`);
  for (const x of [WL + 60, WR - 150]) E.el(tram, "abs", `left:${x}px;top:${WB + 40}px;width:90px;height:90px;border-radius:50%;background:#222;border:12px solid #555`);
  // the door (right side, bottom)
  const door = E.el(tram, "abs", `left:${WR - 20}px;top:${WB - 420}px;width:60px;height:420px;background:#d9a400;border:4px solid #8a6a00;transform-origin:100% 50%;z-index:3`);
  E.K(door, "sx", [[OPEN, 1], [OPEN + .3, .05, "out"]]);

  // ---------------- the passengers (Tetris pieces) ----------------
  const stack = E.el(tram, "abs", `inset:0;transform-origin:${WL}px ${WB}px`);
  // [img, w, h, H (visual long side), rot, target cx, target cy, drop time, sx]
  const P = [["nico", 516, 970, 520, 0, 270, WB - 260, .5], ["marta", 498, 1017, 520, 90, 610, WB - 127, 1.1], ["leo", 514, 1019, 520, 0, 835, WB - 260, 1.7],
    ["buck", 596, 1024, 520, -90, 575, WB - 254 - 151, 2.3], ["carimbo", 730, 1094, 480, 180, 275, WB - 520 - 240, 2.9], ["otto", 625, 1078, 460, 0, 840, WB - 520 - 230, 3.5, .62],
    ["zoe", 1075, 1818, 520, 90, 575, WB - 556 - 153, 4.1], ["renda", 1168, 1802, 520, -90, 560, WB - 862 - 168, 4.7]];
  const els = [];
  P.forEach(([img, w, h, H, rot, cx, cy, t0, sx = 1], i) => {
    const s = H / h, W = w * s;
    const el = E.el(stack, "abs", `left:${cx - W / 2}px;top:${cy - H / 2}px;width:${W}px;height:${H}px;opacity:0`);
    const inner = E.el(el, "abs", "inset:0");
    E.img(inner, img, `width:${W}px;height:${H}px`);
    els.push(el);
    const DROP = .5, y0 = WT - 300 - cy;
    E.F(t => {                                                                      // the fall lives on the inner element; the ejection on the outer
      if (t < t0) return;
      const u = Math.min(1, (t - t0) / DROP), q = Math.floor(u * 7) / 7;             // Tetris-style stepped fall
      const r = u < .35 ? 0 : rot;
      let bounceY = 0; if (t >= t0 + DROP && t < t0 + DROP + .15) bounceY = -8 * Math.sin((t - t0 - DROP) / .15 * Math.PI);
      inner.style.transform = `translateY(${y0 * (1 - q) + bounceY}px) rotate(${r}deg) scaleX(${sx})`;
    });
    if (rot) E.S(t0 + DROP * .35, "tick", 1);
    E.S(t0 + DROP, "thud", .7); E.clip(t0 + DROP, "sfx/squish.wav", { vol: .5 });
    // the ejection: out through the windows
    const dx = (cx - 540) * 1.4 + (i % 2 ? 140 : -140), t1 = EJECT + i * .06;
    E.K(el, "x", [[t1, 0], [t1 + .7, dx, "out"]]);
    E.K(el, "y", [[t1, 0], [t1 + .7, -2600 - i * 40, "in"]]);
    E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 + .6, 1], [t1 + .7, 0]]);
    E.K(el, "r", [[t1, 0], [t1 + .7, (i % 2 ? 1 : -1) * 400]]);
    E.S(t1, "pop", .6 + (i % 3) * .1);
  });
  // the crowd groans and gets squeezed
  E.K(stack, "sy", [[5.3, 1], [5.5, .95, "out"], [5.8, 1, "out"], [ENTER, 1], [ENTER + .4, .86, "in"], [EJECT, .86]]);
  E.K(stack, "sx", [[ENTER, 1], [ENTER + .4, .88, "in"], [EJECT, .88]]);
  E.clip(5.3, "sfx/crowd-groan.wav", { vol: .9 });
  E.clip(ENTER + .2, "sfx/crowd-groan.wav", { vol: 1.0 });
  E.clip(ENTER + .3, "sfx/squish.wav", { vol: 1.0 });
  E.S(EJECT, "poof", .9); E.flash(EJECT, "#ffffff", .3, .2);

  // ---------------- the tram stops, the lady boards ----------------
  E.K(tram, "x", [[0, 0], [STOP - .5, 0], [STOP, -14, "out"], [STOP + .2, 0, "io"]]);
  E.clip(STOP - .3, "sfx/tram-pass.wav", { vol: .8, to: 1.6 });
  const LS = .62, LW = 729 * LS, LH = 966 * LS;
  const lady = E.el(S.el, "abs", `left:0;top:${WB - LH + 6}px;width:${LW}px;height:${LH}px;z-index:2`);
  E.img(lady, "lady", `width:${LW}px;height:${LH}px`);
  E.K(lady, "x", [[0, 1200], [OPEN, 1200], [OPEN + .5, 900, "out"], [ENTER, 900], [ENTER + .5, 720, "in"], [EJECT + .6, 720], [EJECT + 1.2, 360, "io"]]);
  E.K(lady, "y", [[ENTER, 0], [ENTER + .25, -20, "out"], [ENTER + .5, 0, "in"]]);

  // ---------------- counter ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;display:inline-block;background:${C.ink};color:#fff;font-weight:900;font-size:56px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7;transform-origin:0 50%`, "PASSENGERS: 0");
  const V = [[0, 0], ...P.map(([, , , , , , , t0], i) => [t0 + .5, [6, 13, 21, 29, 38, 47, 58, 70][i]]), [EJECT + .3, 1]];
  E.F(t => {
    let v = 0; for (const [k, n] of V) if (t >= k) v = n;
    const s = "PASSENGERS: " + v; if (pill.textContent !== s) pill.textContent = s;
    pill.style.background = t >= EJECT + .3 ? "#1f7a3a" : v >= 40 ? C.coralD : C.ink;
  });
  E.K(pill, "s", [[0, 1], ...V.slice(1).flatMap(([k]) => [[k - .01, 1], [k, 1.25], [k + .2, 1, "back"]])]);
  // text
  const bubble = (html, left, top, w, tail, t0, t1) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:20px 28px 24px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:58px;line-height:1.04;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]); E.S(t0 + .02, "pop", .6);
  };
  bubble(`Com licença!<div style="font-size:36px;font-weight:800;opacity:.6;margin-top:4px">(excuse me!)</div>`, 520, 820, 480, 330, OPEN + .5, EJECT);
  const full = E.el(S.el, "abs", "left:100px;top:470px;width:880px;display:flex;justify-content:center;z-index:9");
  const st = E.stamp(full, "FULL", 5.4, { size: 120, rot: -6, shake: 14 }); st.style.alignSelf = "center"; E.until(st, OPEN, .12);
  const won = E.el(S.el, "abs", "left:100px;top:470px;width:880px;display:flex;justify-content:center;z-index:9");
  const st2 = E.stamp(won, "RUSH HOUR: SOLVED.", SEAT, { size: 96, rot: -5, bg: C.mint, shake: 12 }); st2.style.alignSelf = "center"; E.until(st2, DUR, .1);
  E.clip(SEAT + .1, "sfx/tram-pass.wav", { vol: .6, to: 1.2 });

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Tram 28 at *rush hour*", { size: 64, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[13.6, 1], [13.85, 1.18, "out"], [14.2, 1, "io"]]);
}
