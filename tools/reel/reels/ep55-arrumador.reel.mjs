// EP.55 "The parking helper" — the arrumador. Otto parks his little car perfectly, by himself. The second the engine stops, a man in a
// yellow vest pops up waving him in: "Vá, vá, vá! Tá bom, tá bom!" "But I parked it myself!" "Uma moedinha, chefe?" (a little coin,
// boss?). Otto pays. Next: an empty country road, nobody for miles — he pops out of a bush. Last: Otto drives into his OWN garage,
// switches the light on… he's inside, waving. "…In my own garage?!" Voiced (arrumador in Portuguese with subtitles, Otto) + car sounds.
export const meta = {
  id: "ep55-arrumador", date: "2026-11-17",
  images: {
    car: "characters/cutouts/otto-car.webp", aw: "characters/cutouts/arrumador_wave.webp", ah: "characters/cutouts/arrumador_hand.webp",
    bet: "characters/cutouts/otto-casual_betrayed.webp", coin: "characters/cutouts/otto-casual_coin.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 57, seed: 551, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 18.2, ROAD = 1560, S2 = 8.0, S3 = 12.0;
  const S = E.scene("parking", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };
  const CW = 1017 * .62, CH = 594 * .62;
  const carAt = (P, z = 4) => { const el = E.el(P, "abs", `left:0;top:${ROAD + 30 - CH}px;width:${CW}px;height:${CH}px;z-index:${z}`); E.img(el, "car", `width:${CW}px;height:${CH}px`); return el; };
  const guy = (P, left, bottom, s, z) => {
    const w = E.el(P, "abs", `left:${left}px;top:${bottom - 1057 * s}px;width:${568 * s}px;height:${1057 * s}px;z-index:${z}`);
    const a = E.img(w, "aw", `position:absolute;left:0;top:0;width:${568 * s}px;height:${1057 * s}px`);
    const b = E.img(w, "ah", `position:absolute;left:0;top:0;width:${568 * s}px;height:${1057 * s}px;opacity:0`);
    return { w, set: h => { a.style.opacity = h ? 0 : 1; b.style.opacity = h ? 1 : 0; } };
  };
  const wave = (el, t0, t1) => { const k = []; for (let t = t0; t < t1; t += .36) k.push([t, -3, "io"], [t + .18, 3, "io"]); E.K(el, "r", k); };

  // ================= 1) the city street =================
  const A = layer(0, S2);
  E.el(A, "abs", "inset:0;background:linear-gradient(180deg,#8fd0f5,#dff2fb)");
  const HC = ["#f5c9a8", "#ffe29a", "#bfe0d6", "#f7b7b7"];
  for (let i = 0; i < 4; i++) { const h = E.el(A, "abs", `left:${-20 + i * 280}px;top:${700 - (i % 2) * 80}px;width:290px;height:${ROAD - 700}px;background:${HC[i]}`); E.el(h, "abs", "left:0;top:0;width:100%;height:22px;background:#c0643f"); for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) E.el(h, "abs", `left:${46 + c * 120}px;top:${70 + r * 200}px;width:70px;height:120px;background:#3d5a73;border:8px solid #fff;border-radius:35px 35px 4px 4px`); }
  E.el(A, "abs", `left:0;top:${ROAD - 90}px;width:1080px;height:90px;background:repeating-linear-gradient(135deg,#ece6d8 0 30px,#d9d0bd 30px 60px)`);
  E.el(A, "abs", `left:0;top:${ROAD}px;width:1080px;height:${1920 - ROAD}px;background:#6f757b`);
  for (let i = 0; i < 6; i++) E.el(A, "abs", `left:${i * 200 - 40}px;top:1760px;width:110px;height:16px;background:#f4f4f4;opacity:.8`);
  const parked = (x, col, z) => { const p = E.el(A, "abs", `left:${x}px;top:${ROAD - 120}px;width:330px;height:150px;border-radius:60px 80px 20px 20px;background:${col};z-index:${z}`); E.el(p, "abs", "left:60px;top:20px;width:190px;height:54px;border-radius:30px 40px 4px 4px;background:#cfe6f5"); for (const wx of [40, 230]) E.el(p, "abs", `left:${wx}px;top:106px;width:70px;height:70px;border-radius:50%;background:#2b2b2b;border:10px solid #9aa3ab;box-sizing:border-box`); };
  parked(-230, "#2f6db5", 3); parked(990, "#e5484d", 3);
  const g1 = guy(A, 520, ROAD - 60, .8, 2);
  E.K(g1.w, "x", [[1.9, 560], [2.25, 0, "out"]]); E.K(g1.w, "o", [[1.89, 0], [1.9, 1]]);
  wave(g1.w, 2.25, 5.4);
  E.F(t => g1.set(t >= 5.4));
  const c1 = carAt(A, 4);
  const glass = E.el(c1, "abs", `left:${CW * .385}px;top:${CH * .085}px;width:${CW * .33}px;height:${CH * .31}px;border-radius:22px 40px 6px 6px;background:linear-gradient(120deg,#bfe0f3 0 55%,#e6f4fc 55% 70%,#bfe0f3 70%);opacity:0`);
  E.K(glass, "o", [[3.99, 0], [4.0, 1]]);   // Otto got out: empty driver window
  E.K(c1, "x", [[0, -700], [1.5, 300, "out"]]);
  E.K(c1, "y", [[0, 0], [.2, -4], [.4, 0], [.6, -4], [.8, 0], [1.0, -3], [1.5, 0]]);                    // frame-0 motion: driving
  const ot = E.el(A, "abs", `left:-30px;top:0;width:1px;height:1px;z-index:5;opacity:0`);
  const o1 = E.img(ot, "bet", `position:absolute;left:0;top:${1790 - 1078 * .78}px;width:${625 * .78}px;height:${1078 * .78}px`);
  const o2 = E.img(ot, "coin", `position:absolute;left:0;top:${1790 - 1047 * .78}px;width:${540 * .78}px;height:${1047 * .78}px;opacity:0`);
  E.K(ot, "o", [[4.0, 0], [4.01, 1]]); E.K(ot, "x", [[4.0, -300], [4.3, 0, "out"]]);
  E.F(t => { const c = t >= 6.7; o1.style.opacity = c ? 0 : 1; o2.style.opacity = c ? 1 : 0; });

  // ================= 2) the empty country road =================
  const B = layer(S2, S3);
  E.el(B, "abs", "inset:0;background:linear-gradient(180deg,#9fd8f7,#e8f6fd)");
  E.el(B, "abs", "left:-300px;top:1020px;width:1100px;height:900px;border-radius:50%;background:#8cc36f");
  E.el(B, "abs", "left:400px;top:1080px;width:1100px;height:900px;border-radius:50%;background:#7ab85e");
  E.el(B, "abs", "left:120px;top:960px;width:26px;height:160px;background:#7a5230"); E.el(B, "abs", "left:50px;top:860px;width:170px;height:150px;border-radius:50%;background:#4f9a45");
  E.el(B, "abs", `left:0;top:${ROAD}px;width:1080px;height:${1920 - ROAD}px;background:#8a8f95`);
  const nobody = E.el(B, "abs", "left:560px;top:760px;background:#fff;border-radius:14px;padding:6px 16px;font-weight:900;font-size:34px;color:#1d2b36;box-shadow:0 6px 14px rgba(0,0,0,.15)", "NEAREST HUMAN: 12 km");
  E.K(nobody, "o", [[S2 + .3, 0], [S2 + .45, 1], [S2 + 1.3, 1], [S2 + 1.45, 0]]);
  const g2 = guy(B, 560, ROAD - 40, .78, 2);
  E.K(g2.w, "y", [[S2 + 1.2, 700], [S2 + 1.5, 0, "out"]]);
  wave(g2.w, S2 + 1.5, S2 + 2.4); E.F(t => g2.set(t >= S2 + 2.5));
  const bush = E.el(B, "abs", `left:520px;top:${ROAD - 250}px;width:440px;height:280px;z-index:3`);
  for (const [x, y, r] of [[0, 90, 110], [120, 20, 140], [270, 70, 120], [180, 110, 120]]) E.el(bush, "abs", `left:${x}px;top:${y}px;width:${r * 1.4}px;height:${r * 1.4}px;border-radius:50%;background:#3f8a3a;box-shadow:inset -10px -10px 0 rgba(0,0,0,.1)`);
  E.K(bush, "r", [[S2 + .9, 0], [S2 + 1.0, 3], [S2 + 1.1, -3], [S2 + 1.2, 3], [S2 + 1.3, 0]]);
  const c2 = carAt(B, 4);
  E.K(c2, "x", [[S2, -700], [S2 + .8, 40, "out"]]);

  // ================= 3) his own garage =================
  const Cg = layer(S3, DUR);
  E.el(Cg, "abs", "inset:0;background:linear-gradient(180deg,#f1b27a,#ffe0b0)");
  E.el(Cg, "abs", "left:60px;top:560px;width:960px;height:1040px;background:#f4ead6;border-radius:8px 8px 0 0");
  E.el(Cg, "abs", "left:20px;top:500px;width:1040px;height:80px;background:#c0643f;border-radius:8px");
  E.el(Cg, "abs", "left:760px;top:640px;width:180px;height:160px;background:#3d5a73;border:10px solid #fff");
  E.el(Cg, "abs", "left:170px;top:600px;width:340px;height:70px;background:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:40px;color:#1d2b36", "CASA DO OTTO");
  const inside = E.el(Cg, "abs", `left:90px;top:900px;width:900px;height:${ROAD + 30 - 900}px;background:#2b2f35;overflow:hidden`);
  const lamp = E.el(inside, "abs", "inset:0;background:radial-gradient(ellipse at 50% 0,#fff6c9 0,#d8cda8 45%,#8f8a7a 100%);opacity:0");
  E.K(lamp, "o", [[S3 + 1.6, 0], [S3 + 1.62, 1], [S3 + 1.7, .3], [S3 + 1.75, 1]]);
  for (let k = 0; k < 3; k++) E.el(inside, "abs", `left:${40 + k * 90}px;top:120px;width:60px;height:${140 - k * 20}px;background:#9aa3ab;border-radius:6px;opacity:.7`);   // shelves of paint cans
  const g3 = guy(inside, 470, ROAD + 30 - 900, .66, 1);
  E.K(g3.w, "o", [[S3 + 1.6, 0], [S3 + 1.62, 1]]);
  wave(g3.w, S3 + 1.7, S3 + 4.0); E.F(t => g3.set(t >= S3 + 4.1));
  const door = E.el(Cg, "abs", `left:90px;top:900px;width:900px;height:${ROAD + 30 - 900}px;background:repeating-linear-gradient(180deg,#d9d3c4 0 56px,#bfb8a8 56px 62px);transform-origin:50% 0;z-index:3`);
  E.K(door, "sy", [[S3, 1], [S3 + .7, .02, "out"]]);
  E.el(Cg, "abs", `left:0;top:${ROAD + 30}px;width:1080px;height:${1920 - ROAD}px;background:#8a8f95`);
  const c3 = carAt(Cg, 4);
  E.K(c3, "x", [[S3 + .5, -700], [S3 + 1.4, 70, "out"]]);

  // ================= HUD =================
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  const PAID = [[0, 0], [6.9, 1], [S2 + 3.2, 2], [DUR - .9, 3]];
  E.F(t => { const n = at(PAID, t); const place = t < S2 ? "LISBON" : t < S3 ? "NOWHERE" : "HOME"; const s = `${place} · PAID: €${n}`; if (pill.textContent !== s) pill.textContent = s; pill.style.background = n ? C.coralD : C.ink; });
  PAID.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.25], [t + .25, 1, "out"]]));
  const coin = t => { const c = E.el(S.el, "abs", "left:500px;top:1000px;width:70px;height:70px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffe89a,#e0a81e);border:5px solid #b8860b;z-index:8;opacity:0"); E.K(c, "o", [[t - .01, 0], [t, 1], [t + .6, 1], [t + .7, 0]]); E.K(c, "y", [[t, 0], [t + .3, -160, "out"], [t + .6, -40, "in"]]); E.K(c, "x", [[t, 0], [t + .6, 180]]); E.S(t + .5, "ding", .6); };
  coin(6.9); coin(S2 + 3.2);

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 52) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:32px;padding:18px 26px 22px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble(`Vá, vá, vá! Tá bom, tá bom!${sub("(Come on, come on… that's good!)")}`, 400, 440, 640, 400, 2.3, 4.2, 46);
  bubble("But I parked it myself!", 40, 700, 460, 200, 4.4, 5.6, 50);
  bubble(`Uma moedinha, chefe?${sub("(A little coin, boss?)")}`, 440, 460, 600, 380, 5.6, 7.9, 48);
  bubble("Vá, vá, vá!", 560, 700, 400, 240, S2 + 1.5, S2 + 2.5, 54);
  bubble("Uma moedinha?", 520, 700, 460, 260, S2 + 2.5, S3 - .1, 54);
  bubble("Vá, vá, vá! Tá bom!", 460, 700, 500, 300, S3 + 1.7, S3 + 2.9, 50);
  bubble("…In my own garage?!", 40, 1000, 480, 200, S3 + 3.0, S3 + 4.3, 50);
  bubble("Uma moedinha, chefe?", 460, 700, 520, 300, S3 + 4.3, DUR - .3, 48);
  const sb = E.el(S.el, "abs", "left:60px;top:470px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "ALWAYS THERE.", DUR - 1.5, { size: 100, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/street-sunny.wav", { vol: 2.5, duck: false }); E.clip(4.9, "sfx/street-sunny.wav", { vol: 2.5, duck: false, to: S2 - 4.9 });
  E.clip(0, "sfx/car-park.wav", { vol: .8 });
  E.clip(2.25, "voices/ep55/a_va.wav", { vol: 1.15 });
  E.clip(4.4, "voices/ep55/o_myself.wav", { vol: 1.15 });
  E.clip(5.6, "voices/ep55/a_moedinha.wav", { vol: 1.15 });
  E.clip(S2, "sfx/car-park.wav", { vol: .6, to: 1.2 }); E.clip(S2 + .2, "sfx/cicadas.wav", { vol: .5, duck: false, to: 3.6 });
  E.clip(S2 + .9, "sfx/crinkle.wav", { vol: .8, to: .5 }); E.S(S2 + 1.3, "pop", .7);
  E.clip(S2 + 1.5, "voices/ep55/a_va.wav", { vol: 1.1, to: .9 });
  E.clip(S2 + 2.5, "voices/ep55/a_moedinha.wav", { vol: 1.15 });
  E.S(S3, "whoosh", .5); E.clip(S3 + .5, "sfx/car-park.wav", { vol: .7, to: 1.8 });
  E.S(S3 + 1.6, "tick", .9);
  E.clip(S3 + 1.7, "voices/ep55/a_va.wav", { vol: 1.15, to: 1.4 });
  E.clip(S3 + 3.0, "voices/ep55/o_garage.wav", { vol: 1.2 });
  E.clip(S3 + 4.3, "voices/ep55/a_moedinha.wav", { vol: 1.15 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.95);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "Parking in *Portugal*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[17.4, 1], [17.65, 1.18, "out"], [18.0, 1, "io"]]);
}
