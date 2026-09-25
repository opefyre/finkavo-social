// EP.37 "How many kisses?" — Otto learns to greet people. Marta (Portugal): two kisses, easy. The French woman goes for a third
// while he has already pulled back. The American hugs him until his back cracks. The Brit offers a handshake, Otto goes in for a
// kiss: bonk, and the Brit says "Sorry." Otto has mastered two kisses… and tries them on Carimbo, the civil servant: record
// scratch, stamp: MEN? HANDSHAKE. An AWKWARD counter climbs 0 → 4. Effects only (smacks, squish, crack, bonk, scratch).
export const meta = {
  id: "ep37-kisses", date: "2026-10-30",
  images: {
    o_ex: "characters/cutouts/otto-casual_excited.webp", o_kiss: "characters/cutouts/otto-side_kiss.webp", o_hand: "characters/cutouts/otto-side_hand.webp",
    o_nose: "characters/cutouts/otto-casual_nose.webp", o_awk: "characters/cutouts/otto-casual_awkward.webp", o_bet: "characters/cutouts/otto-casual_betrayed.webp",
    marta: "characters/cutouts/marta_wave.webp", fr: "characters/cutouts/french_kiss.webp", us: "characters/cutouts/american_hug.webp",
    uk: "characters/cutouts/british_hand.webp", cb: "characters/cutouts/carimbo_deadpan.webp", cb2: "characters/cutouts/carimbo_surprised.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 116, root: 60, seed: 371, prog: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]] });
  const DUR = 15.2, FLOOR = 1760, SC = .9;
  const S = E.scene("party", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FR = 2.9, US = 6.0, UK = 8.7, CB = 11.3;

  // ---------------- the room: a warm living room with bunting ----------------
  E.el(S.el, "abs", "inset:0;background:#f6e6cf");
  E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:repeating-linear-gradient(90deg,rgba(190,120,60,.07) 0 40px,transparent 40px 80px)");
  E.el(S.el, "abs", `left:0;top:${FLOOR - 10}px;width:1080px;height:${1930 - FLOOR}px;background:#b98a5e`);
  E.el(S.el, "abs", `left:0;top:${FLOOR - 10}px;width:1080px;height:14px;background:#8a5f3a`);
  const win = E.el(S.el, "abs", "left:360px;top:760px;width:360px;height:420px;background:linear-gradient(180deg,#9fd6f2,#e3f4fb);border:16px solid #fff;border-radius:180px 180px 8px 8px;box-shadow:0 6px 0 rgba(0,0,0,.08)");
  E.el(win, "abs", "left:164px;top:0;width:10px;height:100%;background:#fff"); E.el(win, "abs", "left:0;top:190px;width:100%;height:10px;background:#fff");
  const flagCols = ["#e5484d", "#f2b632", "#2f9e6f", "#2f6db5", "#9b59b6"];
  for (let i = 0; i < 13; i++) {                                                         // bunting across the top of the room
    const x = 20 + i * 82, y = 610 + Math.sin(i / 12 * Math.PI) * 50;
    E.el(S.el, "abs", `left:${x}px;top:${y}px;width:0;height:0;border-left:30px solid transparent;border-right:30px solid transparent;border-top:56px solid ${flagCols[i % 5]}`);
  }
  E.el(S.el, "abs", `left:0;top:600px;width:1080px;height:0;border-top:4px solid #6b4a2c;border-radius:50%;height:110px`);

  // ---------------- Otto (left, faces right) ----------------
  const OT = E.el(S.el, "abs", `left:10px;top:${FLOOR - 1078 * SC}px;width:${625 * SC}px;height:${1078 * SC}px;z-index:3;transform-origin:50% 100%`);
  const oIn = E.el(OT, "abs", "inset:0;transform-origin:50% 100%");
  const OF = [["o_ex", 625, 1078], ["o_kiss", 597, 1041], ["o_hand", 575, 1027], ["o_nose", 625, 1078], ["o_awk", 488, 1078], ["o_bet", 625, 1078]];
  const oIm = OF.map(([n, w, h]) => E.img(oIn, n, `position:absolute;left:${(625 - w) * SC / 2}px;bottom:0;width:${w * SC}px;height:${h * SC}px`));
  const face = [[0, "o_ex"], [.55, "o_kiss"], [1.75, "o_ex"], [FR + .15, "o_kiss"], [FR + 1.35, "o_ex"], [FR + 1.8, "o_awk"],
    [US + .1, "o_kiss"], [US + 1.7, "o_bet"], [UK + .45, "o_hand"], [UK + 1.2, "o_nose"], [CB + .1, "o_ex"], [CB + .55, "o_kiss"]];
  E.F(t => { const f = at(face, t); oIm.forEach((x, i) => { x.style.opacity = OF[i][0] === f ? 1 : 0; }); });
  const lean = (t, d = 80) => [[t, 0, "io"], [t + .18, d, "io"], [t + .36, 0, "io"]];
  E.K(oIn, "x", [[0, 0], ...lean(.8), ...lean(1.25), ...lean(FR + .45), ...lean(FR + .9),
    [US + .5, 0], [US + .7, 60, "io"], [US + 1.6, 60], [US + 1.8, 0, "io"],
    [UK + .8, 0], [UK + 1.15, 120, "in"], [UK + 1.3, 60, "out"], [UK + 1.6, 0, "io"],
    [CB + .7, 0], [CB + .9, 110, "io"]]);
  E.K(oIn, "sx", [[US + .65, 1], [US + .75, .8, "out"], [US + 1.55, .8], [US + 1.75, 1, "back"]]);
  E.K(oIn, "r", [[FR + 1.35, 0], [FR + 1.5, -5, "out"], [FR + 1.7, 0, "io"], [UK + 1.2, 0], [UK + 1.3, -7, "out"], [UK + 1.6, 0, "io"]]);

  // ---------------- the greeters (right, face left) ----------------
  const guest = (n, w, h, left, t0, t1, z = 2, enter = true) => {
    const o = E.el(S.el, "abs", `left:${left}px;top:${FLOOR - h * SC}px;width:${w * SC}px;height:${h * SC}px;z-index:${z};opacity:0;transform-origin:50% 100%`);
    const i = E.el(o, "abs", "inset:0;transform-origin:50% 100%");
    const im = E.img(i, n, `position:absolute;left:0;bottom:0;width:${w * SC}px;height:${h * SC}px`);
    E.K(o, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]);
    E.K(o, "x", [...(enter ? [[t0, 700], [t0 + .3, 0, "out"]] : [[t0, 0]]), [t1 - .3, 0], [t1, 800, "in"]]);
    return { o, i, im };
  };
  // Portugal: two kisses, easy
  const M = guest("marta", 533, 1031, 540, 0, FR, 2, false);
  const wave = []; for (let t = 0; t < .8; t += .8) wave.push([t, 0, "io"], [t + .4, -4, "io"]); wave.push([.8, 0, "io"]);
  E.K(M.i, "r", wave);                                                                     // frame-0 motion: she waves
  E.K(M.i, "x", [[.8, 0], [.98, -40, "io"], [1.16, 0, "io"], [1.25, 0], [1.43, -40, "io"], [1.61, 0, "io"]]);
  // France: three
  const F = guest("fr", 616, 1045, 500, FR, US);
  E.K(F.i, "x", [[FR + .45, 0], [FR + .63, -60, "io"], [FR + .81, 0, "io"], [FR + .9, 0], [FR + 1.08, -60, "io"], [FR + 1.26, 0, "io"],
    [FR + 1.45, 0], [FR + 1.7, -150, "io"], [FR + 2.3, -150], [FR + 2.55, 0, "io"]]);
  // USA: the hug
  const U = guest("us", 839, 1013, 330, US, UK, 4);
  E.K(U.i, "x", [[US + .45, 0], [US + .65, -260, "out"], [US + 1.6, -260], [US + 1.8, 0, "io"]]);
  E.K(U.i, "r", [[US + .7, 0], [US + .85, -4, "io"], [US + 1.0, 4, "io"], [US + 1.15, -4, "io"], [US + 1.3, 4, "io"], [US + 1.45, 0, "io"]]);
  // UK: the handshake
  const B = guest("uk", 612, 1060, 520, UK, CB);
  E.K(B.i, "r", [[UK + 1.2, 0], [UK + 1.3, 5, "out"], [UK + 1.6, 0, "io"]]);
  // Carimbo: a Portuguese man
  const K = guest("cb", 730 * .92, 1094 * .92, 450, CB, DUR + 1);
  const k2 = E.img(K.i, "cb2", `position:absolute;left:0;bottom:0;width:${730 * .92 * SC}px;height:${1094 * .92 * SC}px;opacity:0`);
  E.F(t => { const s = t >= CB + 1.05; K.im.style.opacity = s ? 0 : 1; k2.style.opacity = s ? 1 : 0; });
  E.K(K.i, "x", [[CB + 1.05, 0], [CB + 1.2, 40, "out"]]);

  // ---------------- kiss counts pop between the faces ----------------
  const num = (s, t, col = "#e0457b", x = 430) => {
    const el = E.el(S.el, "abs", `left:${x}px;top:640px;width:220px;text-align:center;font-weight:900;font-size:110px;color:${col};-webkit-text-stroke:6px #fff;paint-order:stroke;z-index:8;opacity:0`, s);
    E.pop(el, t, { from: .3, dur: .25 }); E.K(el, "o", [[t, 0], [t + .05, 1], [t + .55, 1], [t + .75, 0]]);
    E.K(el, "y", [[t, 20], [t + .75, -40]]);
  };
  num("1", .98); num("2", 1.43); E.S(.98, "smack", .8); E.S(1.43, "smack", .8); E.S(1.75, "ding", .6);
  num("1", FR + .63); num("2", FR + 1.08); E.S(FR + .63, "smack", .8); E.S(FR + 1.08, "smack", .8);
  num("3?!", FR + 1.7, C.coralD, 400); E.S(FR + 1.7, "smack", .5); E.S(FR + 1.85, "nope", .7);

  // ---------------- counter and country tag ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:52px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7`, "AWKWARD: 0");
  const AW = [[0, 0], [FR + 1.8, 1], [US + .75, 2], [UK + 1.2, 3], [CB + 1.05, 4]];
  E.F(t => { const n = at(AW, t), s = `AWKWARD: ${n}`; if (pill.textContent !== s) pill.textContent = s; pill.style.background = n ? C.coralD : C.ink; });
  const bump = (el, prop, t, a, b = 1) => E.K(el, prop, [[t - .01, b], [t, a], [t + .25, b, "out"]]);
  AW.slice(1).forEach(([t]) => bump(pill, "s", t, 1.25));
  const flag = {
    pt: `<svg viewBox="0 0 60 40" width="84" height="56"><rect width="24" height="40" fill="#046a38"/><rect x="24" width="36" height="40" fill="#da291c"/><circle cx="24" cy="20" r="8" fill="#ffe900" stroke="#fff" stroke-width="1.5"/></svg>`,
    fr: `<svg viewBox="0 0 60 40" width="84" height="56"><rect width="20" height="40" fill="#0055a4"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#ef4135"/></svg>`,
    us: `<svg viewBox="0 0 60 40" width="84" height="56">${Array.from({ length: 7 }, (_, i) => `<rect y="${i * 40 / 6.5}" width="60" height="${40 / 13}" fill="#b22234"/>`).join("")}<rect width="26" height="21.5" fill="#3c3b6e"/>${Array.from({ length: 12 }, (_, i) => `<circle cx="${4 + (i % 4) * 6}" cy="${4 + Math.floor(i / 4) * 6.5}" r="1.3" fill="#fff"/>`).join("")}</svg>`,
    uk: `<svg viewBox="0 0 60 30" width="84" height="42"><clipPath id="ukt"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#ukt)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></svg>`,
  };
  const TAGS = [[0, "pt", "Portugal", ""], [1.75, "pt", "Portugal", "2 kisses ✓"], [FR, "fr", "Paris", ""], [FR + 1.8, "fr", "Paris", "3 kisses"],
    [US, "us", "Texas", ""], [US + .75, "us", "Texas", "hug"], [UK, "uk", "London", ""], [UK + 1.2, "uk", "London", "handshake"],
    [CB, "pt", "Portugal", ""], [CB + 1.75, "pt", "Portugal", "men: handshake"]];
  const tag = E.el(S.el, "abs", "right:50px;top:470px;height:84px;display:flex;align-items:center;gap:18px;background:#fff;border-radius:22px;padding:0 26px 0 18px;box-shadow:0 8px 20px rgba(0,0,0,.14);z-index:7;white-space:nowrap");
  const tf = E.el(tag, "", "display:flex;border-radius:6px;overflow:hidden;box-shadow:0 0 0 2px rgba(0,0,0,.12)");
  const tx = E.el(tag, "", `font-weight:900;font-size:42px;color:${C.ink}`);
  const tr = E.el(tag, "", "font-weight:900;font-size:42px;color:#1f7a3a;transform-origin:0 50%");
  let last = "";
  E.F(t => { const [, f, a, b] = at(TAGS.map(x => [x[0], x]), t); const key = f + a + b; if (key !== last) { last = key; tf.innerHTML = flag[f]; tx.textContent = a; tr.textContent = b ? "· " + b : ""; } });
  [FR, US, UK, CB].forEach(t => E.K(tag, "x", [[t - .01, 0], [t, 400], [t + .3, 0, "out"]]));
  [1.75, FR + 1.8, US + .75, UK + 1.2, CB + 1.75].forEach(t => bump(tr, "s", t, 1.2));

  // ---------------- bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 58) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:20px 28px 24px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]); E.S(t0 + .02, "pop", .5);
    return b;
  };
  bubble("Easy!", 70, 640, 260, 150, 1.85, FR - .1, 64);
  bubble("Sorry.", 640, 640, 280, 110, UK + 1.55, CB - .1, 64);
  bubble("Two kisses. Got it.", 40, 620, 420, 200, CB + .1, CB + 1.0, 50);

  // ---------------- sound ----------------
  E.clip(0, "sfx/crowd-murmur.wav", { vol: .25, duck: false });
  E.S(FR, "whoosh", .5); E.S(UK, "whoosh", .5); E.S(CB, "whoosh", .5);
  for (let k = 0; k < 3; k++) E.S(US + k * .1, "thud", .5);                                // he charges in
  E.clip(US + .65, "sfx/squish.wav", { vol: .9 }); E.S(US + 1.1, "crack", .9);
  E.clip(UK + 1.15, "sfx/bonk.wav", { vol: 4 }); E.shake(UK + 1.15, 14);
  E.S(CB + 1.05, "scratch", 1);

  // ---------------- the stamp ----------------
  const sb = E.el(S.el, "abs", "left:60px;top:1330px;width:960px;display:flex;justify-content:center;z-index:9");
  const st = E.stamp(sb, "MEN? HANDSHAKE.", CB + 1.75, { size: 96, rot: -6, bg: C.coralD, shake: 12 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "How many *kisses* in Portugal?", { size: 52, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[14.4, 1], [14.65, 1.18, "out"], [15.0, 1, "io"]]);
}
