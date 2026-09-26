// EP.64 "Asking for directions in Portugal" — "É já ali!" (it's right there!). Otto, map in hand: "Excuse me, the post office?"
// A lady points right: "É já ali!" He walks. The café: "Já ali, à esquerda!" He walks. An old man: "É já ali, sempre em frente!"
// He walks (STEPS counter climbing). Three old men argue — "É pela esquerda!" "Não, é pela direita!" — then: "Eu levo-o!" (I'll
// take you!) and march him arm in arm… back to where he started: the post office was right behind him. "…It was next door?"
// Voiced (lady, barman, old men in Portuguese with subtitles; Otto) + street ambience and footsteps.
export const meta = {
  id: "ep64-jaali", date: "2026-11-26",
  images: {
    map: "characters/cutouts/otto-casual_map.webp", walk: "characters/cutouts/otto-casual_stroll.webp", awk: "characters/cutouts/otto-casual_awkward.webp",
    lady: "characters/cutouts/lady_point.webp", bar: "characters/cutouts/barman_talk.webp", old: "characters/cutouts/oldman_ask.webp",
    argue: "characters/cutouts/oldmen_argue.webp", esc: "characters/cutouts/oldmen_escort.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 60, seed: 641, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 19.0, FLOOR = 1640;
  const S1 = 0, W1 = 3.2, S2 = 4.4, W2 = 7.3, S3 = 8.3, W3 = 10.5, S4 = 11.1, S5 = 15.0, BACK = 16.2;
  const S = E.scene("streets", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };
  const fig = (P, n, w, h, s, left, bottom, z = 4) => { const el = E.el(P, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const street = (P, cols, post = false) => {
    E.el(P, "abs", "inset:0;background:linear-gradient(180deg,#8fd0f5,#dff2fb)");
    cols.forEach((c, i) => { const h = E.el(P, "abs", `left:${-20 + i * 280}px;top:${700 - (i % 2) * 80}px;width:290px;height:${FLOOR - 700 + (i % 2) * 80}px;background:${c}`); E.el(h, "abs", "left:0;top:0;width:100%;height:22px;background:#c0643f"); for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) E.el(h, "abs", `left:${46 + k * 120}px;top:${70 + r * 200}px;width:70px;height:120px;background:#3d5a73;border:8px solid #fff;border-radius:35px 35px 4px 4px`); });
    if (post) {
      const d = E.el(P, "abs", `left:60px;top:1180px;width:250px;height:${FLOOR - 1180}px;background:#6b2a2a;border-radius:8px 8px 0 0`);
      E.el(d, "abs", "left:20px;top:20px;width:210px;height:300px;background:#8f3a3a;border-radius:6px");
      const sg = E.el(P, "abs", "left:40px;top:1080px;width:290px;height:80px;background:#d52b1e;border-radius:10px;border:5px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:44px;letter-spacing:.04em", "CORREIOS");
      E.el(P, "abs", "left:330px;top:1400px;width:70px;height:170px;background:#d52b1e;border-radius:30px 30px 6px 6px");   // a red post box
    }
    E.el(P, "abs", `left:0;top:${FLOOR - 70}px;width:1080px;height:70px;background:repeating-linear-gradient(135deg,#ece6d8 0 30px,#d9d0bd 30px 60px)`);
    E.el(P, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background:#8a8f95`);
  };

  // ================= S1: the lady =================
  const A = layer(S1, W1); street(A, ["#f5c9a8", "#ffe29a", "#bfe0d6", "#f7b7b7"], true);
  const oa = fig(A, "map", 539, 1052, .82, 20, FLOOR + 60, 5);
  const ob = []; for (let t = 0; t < W1; t += .8) ob.push([t, 0, "io"], [t + .4, -8, "io"]);
  E.K(oa, "y", ob);                                                                                                     // frame-0 motion
  fig(A, "lady", 736, 1057, .8, 480, FLOOR + 60, 4);
  // ================= walking layer (reused) =================
  const Wl = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0");
  const WINS = [[W1, S2], [W2, S3], [W3, S4]];
  E.F(t => { Wl.style.opacity = WINS.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const strip = E.el(Wl, "abs", "left:0;top:0;width:3400px;height:1920px");
  E.el(strip, "abs", "left:0;top:0;width:3400px;height:1920px;background:linear-gradient(180deg,#8fd0f5,#dff2fb)");
  const HC = ["#f5c9a8", "#ffe29a", "#bfe0d6", "#f7b7b7", "#cfe0f5", "#f2d4a0"];
  for (let i = 0; i < 12; i++) { const h = E.el(strip, "abs", `left:${i * 285}px;top:${700 - (i % 2) * 80}px;width:290px;height:${FLOOR - 700 + (i % 2) * 80}px;background:${HC[i % 6]}`); E.el(h, "abs", "left:0;top:0;width:100%;height:22px;background:#c0643f"); for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) E.el(h, "abs", `left:${46 + k * 120}px;top:${70 + r * 200}px;width:70px;height:120px;background:#3d5a73;border:8px solid #fff;border-radius:35px 35px 4px 4px`); }
  E.el(strip, "abs", `left:0;top:${FLOOR - 70}px;width:3400px;height:70px;background:repeating-linear-gradient(135deg,#ece6d8 0 30px,#d9d0bd 30px 60px)`);
  E.el(strip, "abs", `left:0;top:${FLOOR}px;width:3400px;height:${1920 - FLOOR}px;background:#8a8f95`);
  E.F(t => { const w = WINS.find(([a, b]) => t >= a && t < b); if (w) strip.style.transform = `translateX(${-((t - w[0]) * 1500 + WINS.indexOf(w) * 700) % 2200}px)`; });
  const ow = fig(Wl, "walk", 540, 1044, .8, 300, FLOOR + 60, 5);
  const wb = []; for (let t = W1; t < S4; t += .3) wb.push([t, 0, "io"], [t + .15, -14, "io"]);
  E.K(ow, "y", wb);

  // ================= S2: the café =================
  const Bl = layer(S2, W2);
  E.el(Bl, "abs", "inset:0;background:#efe0c7");
  const tileSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#f8f5ee'/><rect x='2' y='2' width='116' height='116' rx='5' fill='none' stroke='#c9d8ea' stroke-width='3'/><g fill='#2f6db5'><circle cx='60' cy='60' r='9'/><ellipse cx='60' cy='36' rx='8' ry='15'/><ellipse cx='60' cy='84' rx='8' ry='15'/><ellipse cx='36' cy='60' rx='15' ry='8'/><ellipse cx='84' cy='60' rx='15' ry='8'/></g></svg>`;
  E.el(Bl, "abs", `left:0;top:900px;width:1080px;height:560px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tileSvg)}");background-size:120px 120px`);
  fig(Bl, "bar", 856, 993, .72, 440, 1440 + 993 * .72 * .08, 1);
  E.el(Bl, "abs", "left:0;top:1420px;width:1080px;height:500px;background:#6a3e1e;z-index:2"); E.el(Bl, "abs", "left:0;top:1420px;width:1080px;height:30px;background:#a8764c;z-index:2");
  fig(Bl, "map", 539, 1052, .82, 20, FLOOR + 220, 5);

  // ================= S3: the old man =================
  const Cl = layer(S3, W3); street(Cl, ["#cfe0f5", "#f2d4a0", "#f5c9a8", "#bfe0d6"]);
  fig(Cl, "map", 539, 1052, .82, 20, FLOOR + 60, 5);
  const om = fig(Cl, "old", 480, 1037, .82, 560, FLOOR + 60, 4);
  E.K(om, "r", [[S3 + .3, 0], [S3 + .6, -3, "io"], [S3 + .9, 3, "io"], [S3 + 1.2, 0, "io"]]);

  // ================= S4: the argument =================
  const Dl = layer(S4, S5); street(Dl, ["#f7b7b7", "#cfe0f5", "#ffe29a", "#f5c9a8"]);
  fig(Dl, "awk", 488, 1078, .8, 10, FLOOR + 60, 5);
  const ar = fig(Dl, "argue", 1107, 776, .72, 290, FLOOR + 60, 4);
  const shk = []; for (let t = S4; t < S5; t += .16) shk.push([t, (Math.round(t * 6) % 2) ? 3 : -3]);
  E.K(ar, "x", shk);

  // ================= S5: escorted back =================
  const Fl = layer(S5, DUR); street(Fl, ["#f5c9a8", "#ffe29a", "#bfe0d6", "#f7b7b7"], true);
  fig(Fl, "lady", 736, 1057, .72, 700, FLOOR + 60, 3);
  const es = fig(Fl, "esc", 1108, 728, .8, -900, FLOOR + 60, 5);
  E.K(es, "x", [[S5, 0], [BACK, 860, "out"]]);
  const eb = []; for (let t = S5; t < BACK; t += .3) eb.push([t, 0, "io"], [t + .15, -10, "io"]);
  E.K(es, "y", eb);
  const arrow = E.el(Fl, "abs", "left:360px;top:1000px;background:#fff;border-radius:14px;padding:6px 16px;font-weight:900;font-size:36px;color:#1d2b36;z-index:6;box-shadow:0 6px 14px rgba(0,0,0,.2);opacity:0", "↓ where he started");
  E.K(arrow, "o", [[BACK + .3, 0], [BACK + .4, 1]]);

  // ================= HUD: steps =================
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:52px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  const SK = [[0, 0], [W1, 0], [S2, 1240], [W2, 1240], [S3, 2610], [W3, 2610], [S4, 3480], [S5, 3480], [BACK, 4812]];
  const lerp = t => { for (let i = 0; i < SK.length - 1; i++) if (t < SK[i + 1][0]) { const u = (t - SK[i][0]) / (SK[i + 1][0] - SK[i][0]); return SK[i][1] + (SK[i + 1][1] - SK[i][1]) * u; } return SK[SK.length - 1][1]; };
  E.F(t => { const n = Math.round(lerp(t)), s = `STEPS: ${n.toLocaleString("en")}`; if (pill.textContent !== s) pill.textContent = s; pill.style.background = n > 3000 ? C.coralD : C.ink; });
  const tag = E.el(S.el, "abs", "left:640px;top:352px;background:#fff;border-radius:14px;padding:4px 14px;font-weight:900;font-size:34px;color:#1d2b36;z-index:9;box-shadow:0 6px 14px rgba(0,0,0,.15)", "");
  E.F(t => { const n = t < W1 ? 1 : t < W2 ? 2 : t < W3 ? 3 : 4, s = `“JÁ ALI” #${n}`; if (tag.textContent !== s) tag.textContent = s; });

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 50) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble("Excuse me, the post office?", 40, 620, 500, 160, .4, 1.8, 46);
  bubble(`É já ali!${sub("(It's right there!)")}`, 560, 640, 400, 200, 1.9, W1 - .05, 56);
  bubble("Excuse me, the post office?", 40, 740, 500, 160, S2 + .1, S2 + 1.5, 46);
  bubble(`Já ali, à esquerda!${sub("(Right there, on the left!)")}`, 520, 600, 500, 240, S2 + 1.6, W2 - .05, 50);
  bubble(`É já ali, sempre em frente!${sub("(Right there, straight ahead!)")}`, 440, 600, 600, 300, S3 + .2, W3 - .05, 46);
  bubble(`É pela esquerda!${sub("(It's to the left!)")}`, 330, 640, 420, 120, S4 + .2, S4 + 1.35, 48);
  bubble(`Não, é pela direita!${sub("(No, it's to the right!)")}`, 560, 640, 480, 330, S4 + 1.4, S4 + 2.95, 46);
  bubble(`Eu levo-o!${sub("(I'll take you!)")}`, 480, 640, 380, 200, S4 + 3.0, S5 - .05, 54);
  bubble("…It was next door?", 30, 820, 460, 110, BACK + .3, DUR - .4, 50);
  const sb = E.el(S.el, "abs", "left:60px;top:470px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "É JÁ ALI.", BACK + 1.6, { size: 120, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  for (let k = 0; k < 4; k++) E.clip(k * 4.9, "sfx/street-sunny.wav", { vol: 2.4, duck: false, to: Math.min(4.9, DUR - k * 4.9) });
  E.clip(.4, "voices/ep64/o_excuse.wav", { vol: 1.15 });
  E.clip(1.9, "voices/ep64/m_jaali.wav", { vol: 1.2 });
  for (const [a, b] of WINS) for (let t = a; t < b - .1; t += .3) E.S(t, "tick", .3);
  E.clip(S2 + .1, "voices/ep64/o_excuse.wav", { vol: 1.15 });
  E.clip(S2 + 1.6, "voices/ep64/p_jaali.wav", { vol: 1.2 });
  E.clip(S3 + .2, "voices/ep64/v_jaali.wav", { vol: 1.2 });
  E.clip(S4 + .2, "voices/ep64/p_esquerda.wav", { vol: 1.2 });
  E.clip(S4 + 1.4, "voices/ep64/v_direita.wav", { vol: 1.2 });
  E.clip(S4 + 3.0, "voices/ep64/v_levo.wav", { vol: 1.25 });
  for (let t = S5; t < BACK; t += .3) E.S(t, "tick", .35);
  E.clip(BACK + .3, "voices/ep64/o_nextdoor.wav", { vol: 1.2 }); E.S(BACK + .2, "ding", .7);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "Asking for *directions*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[18.2, 1], [18.45, 1.18, "out"], [18.8, 1, "io"]]);
}
