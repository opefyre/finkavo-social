// EP.125 "Your mother-in-law's 'weekend' visit" — Inês's mum arrives with one small pink suitcase: "Just for the weekend, filhos!" Day 1: she opens the fridge (one yoghurt): "Only yoghurt? Ai, coitadinho."
// (poor thing) — it fills with tupperwares. Day 2: "I ironed your socks." (a tower of ironed socks). Day 3: "Your cushions were sad. I fixed them." (doilies everywhere). Otto, whispering: "Inês… when is she
// leaving?" Inês: "She said the weekend." 3 MONTHS LATER: she owns the armchair and the remote; Otto sits on a tiny stool; a pile of suitcases. Sogra: "Quem casa, quer casa." (Those who marry want their
// own home.) Otto: "Exactly!" Sogra, sweetly: "So… when are you two moving out?" Stamp: HOUSE: SOGRA 1 · OTTO 0.
export const meta = {
  id: "ep125-sogra", date: "2027-01-26",
  images: {
    hall: "characters/scenes/bg_hall.webp", kit: "characters/scenes/bg_kitchen.webp", room: "characters/scenes/bg_avo.webp",
    s1: "characters/cutouts/sogra_arrive.webp", s2: "characters/cutouts/sogra_armchair.webp", ines: "characters/cutouts/ines_wave.webp",
    o1: "characters/cutouts/otto-casual_shrug.webp", o2: "characters/cutouts/otto-kidchair_squeezed.webp", tup: "characters/props/food_tupperware.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 53, seed: 1251, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [2, 5, 9]] });
  const DUR = 29.0, WEEK = .4, D1 = 3.0, YOG = 3.3, D2 = 7.0, SOCKS = 7.3, D3 = 9.8, CUSH = 10.1, LEAVE = 13.4, INES = 15.8, CARD = 17.7, M3 = 19.0, QUEM = 19.3, EXACT = 21.4, MOVING = 22.7, STAMP = 25.8;
  const S = E.scene("sogra", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };

  // ================= the hall: arrival =================
  const G1 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G1, [[0, D1]]);
  E.img(G1, "hall", BG);
  const s1a = fig(G1, "s1", 654, 1010, .76, 560, 1860, 5); E.K(s1a, "x", [[0, 300], [.9, 0, "out"]]); bob(s1a, .9, D1, 5, .5);
  fig(G1, "ines", 536, 1096, .66, 870, 1880, 4); fig(G1, "o1", 702, 1055, .62, 200, 1880, 4);

  // ================= the kitchen: days 1–2 =================
  const G2 = E.el(S.el, "abs", "inset:0;overflow:hidden;background:#e9dcc6"); show(G2, [[D1, D3]]);
  E.img(G2, "kit", "position:absolute;left:-740px;top:0;width:2562px;height:1930px");
  // the fridge (drawn in code): opens on one sad yoghurt, then fills with tupperwares
  const fr = E.el(G2, "abs", "left:520px;top:760px;width:500px;height:1080px;background:#eef2f4;border-radius:26px;border:8px solid #c8d0d6;z-index:3;box-shadow:0 14px 30px rgba(0,0,0,.25)");
  const inside = E.el(fr, "abs", "left:20px;top:20px;width:444px;height:1024px;background:#fbfdff;border-radius:14px;overflow:hidden");
  for (let i = 1; i < 4; i++) E.el(inside, "abs", `left:0;top:${i * 256}px;width:444px;height:10px;background:#d7dee3`);
  const yog = E.el(inside, "abs", "left:180px;top:150px;width:80px;height:100px;background:#fff;border:4px solid #cfd6dc;border-radius:6px 6px 14px 14px", ""); E.el(yog, "abs", "left:-4px;top:-10px;width:80px;height:18px;background:#e84c3d;border-radius:4px");
  const tups = [];
  for (let i = 0; i < 9; i++) { const row = Math.floor(i / 3), col = i % 3; const t = E.el(inside, "abs", `left:${18 + col * 142}px;top:${40 + row * 256}px;width:${147 * .9}px;height:${258 * .74}px;opacity:0`); E.img(t, "tup", `width:${147 * .9}px;height:${258 * .74}px`); tups.push(t); show(t, [[YOG + 1.6 + i * .12, D3]]); E.pop(t, YOG + 1.6 + i * .12, { from: .3, dur: .2 }); }
  E.K(yog, "o", [[0, 1], [YOG + 1.5, 1], [YOG + 1.6, 0]]);
  const door = E.el(fr, "abs", "left:0;top:0;width:484px;height:1064px;background:#e6ebee;border-radius:20px;transform-origin:0 50%;border:6px solid #c8d0d6");
  E.el(door, "abs", "left:420px;top:420px;width:20px;height:200px;background:#9aa4ad;border-radius:10px");
  E.K(door, "r", [[0, 0]]); E.F(t => { const o = Math.min(1, Math.max(0, (t - D1) / .5)); const c = t > D2 - .5 ? Math.min(1, (t - (D2 - .5)) / .4) : 0; door.style.transform = `perspective(1400px) rotateY(${-100 * o * (1 - c)}deg)`; });
  const s1b = fig(G2, "s1", 654, 1010, .76, 300, 1860, 5); bob(s1b, D1, D3, 5, .5);
  // day 2: a tower of ironed socks grows
  const tower = E.el(G2, "abs", "left:610px;top:0;width:320px;height:1px;z-index:6");
  const SOX = ["#e84c3d", "#2e6fd1", "#f4c542", "#2e8b57", "#7a4fd1", "#ff8a3d", "#1d2b36", "#e84c3d", "#2e6fd1", "#f4c542", "#2e8b57", "#7a4fd1", "#ff8a3d", "#1d2b36", "#e84c3d", "#2e6fd1"];
  SOX.forEach((c, i) => { const s = E.el(tower, "abs", `left:${(i % 2) * 10}px;top:${1800 - i * 46}px;width:300px;height:44px;background:${c};border-radius:10px;border:3px solid rgba(0,0,0,.18);box-shadow:inset 0 -6px 0 rgba(255,255,255,.25)`); show(s, [[SOCKS + .3 + i * .08, D3]]); E.pop(s, SOCKS + .3 + i * .08, { from: .3, dur: .15 }); });
  const steam = E.el(G2, "abs", "left:700px;top:960px;font-size:90px;z-index:7;opacity:0", "♨️"); show(steam, [[SOCKS + .3, D3]]);

  // ================= the living room: day 3 and 3 months later =================
  const G3 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G3, [[D3, DUR]]);
  E.img(G3, "room", BG);
  // doilies everywhere (drawn in code)
  const doily = (x, y, r, t0) => {                                                                        // a crocheted doily (SVG): scalloped rim, lace holes
    let holes = ""; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; holes += `<circle cx="${50 + Math.cos(a) * 30}" cy="${50 + Math.sin(a) * 30}" r="4.5" fill="none" stroke="#e8dcc4" stroke-width="1.6"/>`; }
    let rim = ""; for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; rim += `<circle cx="${50 + Math.cos(a) * 44}" cy="${50 + Math.sin(a) * 44}" r="6" fill="#fffdf6"/>`; }
    const d = E.el(G3, "abs", `left:${x}px;top:${y}px;width:${r}px;height:${r * .55}px;z-index:4;opacity:0;filter:drop-shadow(0 3px 3px rgba(0,0,0,.25))`,
      `<svg viewBox="0 0 100 100" width="${r}" height="${r * .55}" preserveAspectRatio="none">${rim}<circle cx="50" cy="50" r="44" fill="#fffdf6"/>${holes}<circle cx="50" cy="50" r="14" fill="none" stroke="#e8dcc4" stroke-width="2"/><circle cx="50" cy="50" r="5" fill="#e8dcc4"/></svg>`);
    show(d, [[t0, DUR]]); E.pop(d, t0, { from: .2, dur: .25 });
  };
  [[40, 1500, 220], [700, 1020, 260], [330, 1010, 150], [420, 1540, 200], [860, 860, 150]].forEach(([x, y, r], i) => doily(x, y, r, CUSH + .4 + i * .2));
  const s1c = fig(G3, "s1", 654, 1010, .76, 820, 1860, 5); show(s1c, [[D3, CARD]]); bob(s1c, D3, CARD, 5, .5);
  const ot = fig(G3, "o1", 702, 1055, .62, 210, 1860, 6); show(ot, [[D3, CARD]]);
  const ine = fig(G3, "ines", 536, 1096, .62, 470, 1880, 6); show(ine, [[LEAVE - .2, CARD]]); E.pop(ine, LEAVE - .2, { from: .9, dur: .25 });
  // three months later: armchair, remote, suitcases, tiny stool
  const s2 = fig(G3, "s2", 880, 1168, .78, 700, 1890, 5); show(s2, [[M3, DUR]]);
  const o2 = fig(G3, "o2", 507, 1008, .6, 200, 1890, 6); show(o2, [[M3, DUR]]); bob(o2, M3, DUR, 3, 1.0);
  const bags = E.el(G3, "abs", "left:330px;top:0;width:260px;height:1px;z-index:4");
  [["#f2a7c3", 220, 150], ["#e88fb2", 240, 170], ["#f7c0d5", 200, 140], ["#e88fb2", 230, 160], ["#f2a7c3", 210, 150]].forEach(([c, w, h], i) => { let y = 1820; for (let j = 0; j < i; j++) y -= [150, 170, 140, 160, 150][j]; const b = E.el(bags, "abs", `left:${(i % 2) * 20}px;top:${y - h}px;width:${w}px;height:${h}px;background:${c};border-radius:18px;border:5px solid rgba(0,0,0,.15)`); E.el(b, "abs", `left:${w / 2 - 30}px;top:-22px;width:60px;height:24px;border:6px solid #9a5070;border-bottom:none;border-radius:10px 10px 0 0`); show(b, [[M3, DUR]]); });

  // ---- cards + pill
  const card = (txt, t0, t1) => { const el = E.el(S.el, "abs", "inset:0;background:#141a2e;z-index:14;opacity:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:84px;color:#fff6c8;text-align:center;line-height:1.1", txt); E.K(el, "o", [[t0, 0], [t0 + .1, 1], [t1 - .15, 1], [t1, 0]]); };
  card("3 MONTHS<br>LATER…", CARD, M3 + .1);
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "\"A WEEKEND\" · DAY 0"], [D1, "\"A WEEKEND\" · DAY 1"], [D2, "\"A WEEKEND\" · DAY 2"], [D3, "\"A WEEKEND\" · DAY 3"], [M3, "\"A WEEKEND\" · DAY 94"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= D3 ? C.coralD : C.ink; });
  PL.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const sub = en => `<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:3px">${en}</div>`;
  const bubble = (html, hx, top, w, t0, t1, fs = 48, z = 10) => {
    const tail = Math.max(50, Math.min(w - 90, w / 2)), left = Math.max(20, Math.min(1060 - w, hx - tail)), tl = hx - left - 22;
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:${z};transform-origin:${tl}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tl}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble(`Just for the weekend, filhos!${sub("(my children!)")}`, 560, 940, 540, WEEK, D1 - .05, 46);
  bubble(`Only yoghurt? Ai, coitadinho.${sub("(Oh, poor thing.)")}`, 300, 950, 540, YOG, D2 - .1, 46);
  bubble("I ironed your socks.", 300, 950, 460, SOCKS, D3 - .05, 48);
  bubble("Your cushions were sad. I fixed them.", 820, 940, 560, CUSH, LEAVE - .1, 44);
  bubble("Inês… when is she leaving?", 210, 960, 500, LEAVE, INES - .1, 46);
  bubble("She said the weekend.", 470, 920, 460, INES, CARD, 46);
  bubble(`Quem casa, quer casa.${sub("(Those who marry want their own home.)")}`, 700, 930, 600, QUEM, EXACT - .1, 46);
  bubble("Exactly!", 200, 1100, 320, EXACT, MOVING - .1, 58);
  bubble("So… when are you two moving out?", 700, 930, 560, MOVING, STAMP + .3, 46);
  E.stamp(E.el(S.el, "abs", "left:30px;top:640px;width:1020px;display:flex;justify-content:center;z-index:13"), "HOUSE: SOGRA 1 · OTTO 0", STAMP, { size: 68, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(0, "sfx/doorbell.wav", { vol: .8, to: 1.2 });
  E.clip(WEEK, "voices/ep125/s_weekend.wav", { vol: 1.35 }); E.S(D1, "whoosh", .4);
  E.clip(YOG, "voices/ep125/s_yoghurt.wav", { vol: 1.35 }); tups.forEach((_, i) => { if (i % 3 === 0) E.S(YOG + 1.6 + i * .12, "pop", .35); });
  E.S(D2, "whoosh", .4); E.clip(SOCKS, "voices/ep125/s_socks.wav", { vol: 1.35 });
  E.S(D3, "whoosh", .4); E.clip(CUSH, "voices/ep125/s_cushions.wav", { vol: 1.35 });
  E.clip(LEAVE, "voices/ep125/o_leaving.wav", { vol: 1.25 }); E.clip(INES, "voices/ep125/i_weekend.wav", { vol: 1.3 });
  E.S(CARD, "whoosh", .4); E.clip(M3, "sfx/tv-loud.wav", { vol: .12, duck: false, to: DUR - M3 });
  E.clip(QUEM, "voices/ep125/s_quemcasa.wav", { vol: 1.4 }); E.clip(EXACT, "voices/ep125/o_exactly.wav", { vol: 1.3 });
  E.clip(MOVING, "voices/ep125/s_moving.wav", { vol: 1.35 }); E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Your mother-in-law's *weekend* visit", { size: 42, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[28.2, 1], [28.45, 1.18, "out"], [28.75, 1, "io"]]);
}
