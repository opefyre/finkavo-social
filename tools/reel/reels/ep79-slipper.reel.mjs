// EP.79 "Mum's slipper never misses" — a guided-missile parody. Mum: "Your room. Now. I'm counting to three!" The teen, on his phone:
// "Mum, I'm literally busy." "One…" "Two…" — he bolts. She takes off her slipper: "THREE!" A trailer voice: "Target locked." The slipper
// chases him down the street ("Nope. Nope. Nope!"), then across the world map after his plane: DISTANCE 17,000 KM. Sydney, three days
// later, on a beach towel: "Finally… safe." A whistle from the sky — THWACK. The note on the slipper: "Clean your room. ❤️ Mum".
export const meta = {
  id: "ep79-slipper", date: "2026-12-11",
  images: {
    ms: "characters/cutouts/mum_shout.webp", msl: "characters/cutouts/mum_slipper.webp", tp: "characters/cutouts/teen_phone.webp", tr: "characters/cutouts/teen_run.webp",
    tb: "characters/cutouts/teen_beach.webp", th: "characters/cutouts/teen_hit.webp", sls: "characters/props/slipper_side.webp", slt: "characters/props/slipper_top.webp",
    plane: "characters/props/plane.webp", kang: "characters/props/kangaroo.webp", surf: "characters/props/surfboard.webp",
    st: "characters/scenes/bg_lisbon.webp", world: "characters/scenes/bg_world.webp", beach: "characters/scenes/bg_beach.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 126, root: 52, seed: 797, prog: [[0, 3, 7], [8, 12, 15], [10, 14, 17], [7, 11, 14]] });
  const DUR = 19.8, Q = .4, BUSY = 3.35, ONE = 5.1, TWO = 6.0, RUN = 6.6, THREE = 7.0, LAUNCH = 7.5, STREET = 7.8, NOPE = 8.9,
    MAP = 10.5, BEACH = 13.4, SAFE = 13.8, FALL = 16.1, HIT = 16.6;
  const S = E.scene("slipper", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); show(el, [[t0, t1]]); return el; };
  const fig = (P, n, w, h, s, left, bottom, z = 3) => { const el = E.el(P, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const FLOOR = 1780;

  // ================= 1) the living room =================
  const A = layer(0, STREET);
  E.el(A, "abs", "inset:0;background:#f4e3cc");
  E.el(A, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:repeating-linear-gradient(90deg,rgba(190,120,80,.08) 0 60px,transparent 60px 120px)");
  E.el(A, "abs", `left:0;top:${FLOOR}px;width:1080px;height:140px;background:repeating-linear-gradient(90deg,#b98a5e 0 160px,#a97c52 160px 320px)`);
  E.el(A, "abs", "left:620px;top:1330px;width:440px;height:260px;border-radius:40px 40px 20px 20px;background:#6d8fb3");        // sofa
  E.el(A, "abs", "left:600px;top:1480px;width:480px;height:170px;border-radius:30px;background:#5a7ba0");
  E.el(A, "abs", "left:80px;top:520px;width:260px;height:190px;background:#fffdf3;border:14px solid #7a4a2a;box-sizing:border-box");
  E.el(A, "abs", "left:110px;top:550px;width:172px;height:102px;background:linear-gradient(180deg,#8fd0f5 55%,#7bc47f 55%)");
  const mum1 = fig(A, "ms", 489, 1050, .74, 40, FLOOR + 30, 4), mum2 = fig(A, "msl", 600, 980, .76, 20, FLOOR + 30, 4);
  show(mum1, [[0, THREE - .1]]); show(mum2, [[THREE - .1, STREET]]);
  E.K(mum1, "s", [[ONE, 1], [ONE + .1, 1.05, "out"], [ONE + .3, 1, "io"], [TWO, 1], [TWO + .1, 1.07, "out"], [TWO + .3, 1, "io"]]);
  const teen = fig(A, "tp", 500, 1063, .74, 640, FLOOR + 30, 3);
  const tb = []; for (let t = 0; t < TWO; t += .8) tb.push([t, 0, "io"], [t + .4, -6, "io"]); E.K(teen, "y", tb);   // frame-0 motion
  show(teen, [[0, RUN]]);
  const trn = fig(A, "tr", 675, 817, .74, 560, FLOOR + 30, 3); show(trn, [[RUN, STREET]]);
  E.K(trn, "x", [[RUN, 0], [RUN + .5, 700, "in"]]);
  const dash = E.el(A, "abs", "left:540px;top:1300px;font-weight:900;font-size:90px;color:#1d2b36;opacity:0", "💨"); show(dash, [[RUN + .1, STREET]]);
  const sl1 = E.el(A, "abs", "left:120px;top:900px;width:200px;height:91px;z-index:6;opacity:0"); E.img(sl1, "sls", "width:200px;height:91px");
  show(sl1, [[LAUNCH, STREET]]); E.K(sl1, "x", [[LAUNCH, 0], [STREET, 1100, "in"]]); E.K(sl1, "r", [[LAUNCH, 0], [STREET, 540]]);

  // ================= 2) the street chase, missile-cam =================
  const B = layer(STREET, MAP);
  const TW = Math.round(1344 * 1920 / 752);
  const strip = E.el(B, "abs", `left:0;top:0;width:${TW * 2}px;height:1920px`);
  for (let i = 0; i < 2; i++) E.img(strip, "st", `position:absolute;left:${i * TW}px;top:0;width:${TW}px;height:1920px;${i % 2 ? "transform:scaleX(-1)" : ""}`);
  E.F(t => { strip.style.transform = `translateX(${-(Math.max(0, t - STREET) * 1400) % (TW * 2)}px)`; });
  const run2 = fig(B, "tr", 675, 817, .9, 400, 1840, 3);
  const rb = []; for (let t = STREET; t < MAP; t += .2) rb.push([t, 0], [t + .1, -18]); E.K(run2, "y", rb);
  const sl2 = E.el(B, "abs", "left:0;top:0;width:220px;height:100px;z-index:4"); E.img(sl2, "sls", "width:220px;height:100px");
  E.F(t => { const u = Math.max(0, t - STREET); const x = 60 + u * 120 + Math.sin(u * 5) * 60, y = 1380 + Math.cos(u * 4) * 120; sl2.style.transform = `translate(${x}px,${y}px) rotate(${Math.sin(u * 6) * 20}deg)`; });
  const hud = E.el(B, "abs", "inset:0;z-index:5;pointer-events:none;background:rgba(40,255,140,.10)");
  E.el(hud, "abs", "inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.08) 0 3px,transparent 3px 8px)");
  const box = E.el(hud, "abs", "left:400px;top:1140px;width:600px;height:640px;border:8px solid #e5484d;box-sizing:border-box");
  E.K(box, "s", [[STREET, 1.6], [STREET + .4, 1, "out"]]);
  E.el(box, "abs", "left:-8px;top:-60px;background:#e5484d;color:#fff;font-family:monospace;font-weight:900;font-size:38px;padding:4px 14px", "TARGET LOCKED");
  E.el(hud, "abs", "left:750px;top:0;width:3px;height:1920px;background:rgba(229,72,77,.6)");
  E.el(hud, "abs", "left:0;top:1460px;width:1080px;height:3px;background:rgba(229,72,77,.6)");

  // ================= 3) the world map =================
  const M = layer(MAP, BEACH);
  const WS = 1080 / 752;
  E.img(M, "world", `position:absolute;left:0;top:0;width:1080px;height:${1344 * WS}px`);
  const PT = [316 * WS, 503 * WS], AU = [614 * WS, 928 * WS];
  const trail = E.el(M, "abs", "left:0;top:0;width:1080px;height:1930px");
  trail.innerHTML = `<svg width="1080" height="1930"><line id="tl" x1="${PT[0]}" y1="${PT[1]}" x2="${PT[0]}" y2="${PT[1]}" stroke="#e5484d" stroke-width="8" stroke-dasharray="18 14" stroke-linecap="round"/><circle cx="${PT[0]}" cy="${PT[1]}" r="16" fill="#e5484d"/><circle cx="${AU[0]}" cy="${AU[1]}" r="16" fill="none" stroke="#1d2b36" stroke-width="6"/></svg>`;
  const tl = trail.querySelector("#tl");
  const ang = Math.atan2(AU[1] - PT[1], AU[0] - PT[0]) * 180 / Math.PI;
  const pl = E.el(M, "abs", "left:0;top:0;width:180px;height:82px;z-index:3"); E.img(pl, "plane", "width:180px;height:82px");
  const sl3 = E.el(M, "abs", "left:0;top:0;width:70px;height:126px;z-index:4"); E.img(sl3, "slt", "width:70px;height:126px");
  const lerp = u => [PT[0] + (AU[0] - PT[0]) * u, PT[1] + (AU[1] - PT[1]) * u];
  E.F(t => {
    const u = Math.min(1, Math.max(0, (t - MAP - .2) / 2.2)), v = Math.min(1, Math.max(0, (t - MAP - .6) / 2.2));
    const [px, py] = lerp(u), [sx, sy] = lerp(v);
    pl.style.transform = `translate(${px - 90}px,${py - 41}px) rotate(${ang}deg)`;
    sl3.style.transform = `translate(${sx - 35}px,${sy - 63}px) rotate(${ang + 90}deg)`;
    tl.setAttribute("x2", sx); tl.setAttribute("y2", sy);
  });
  const ping = E.el(M, "abs", `left:${AU[0] - 120}px;top:${AU[1] - 120}px;width:240px;height:240px;border-radius:50%;border:6px solid #e5484d;box-sizing:border-box;opacity:0`);
  [MAP + 1.0, MAP + 1.8, MAP + 2.6].forEach(t => { E.K(ping, "o", [[t - .01, 0], [t, 1], [t + .5, 0]]); E.K(ping, "s", [[t, .3], [t + .5, 1.3, "out"]]); });

  // ================= 4) Sydney, three days later =================
  const Bc = layer(BEACH, DUR);
  E.img(Bc, "beach", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  const kg = fig(Bc, "kang", 244, 306, 1.1, 800, 1500, 2);
  E.K(kg, "y", [[BEACH, 0], [BEACH + .3, -60, "out"], [BEACH + .6, 0, "in"], [HIT + .2, 0], [HIT + .45, -80, "out"], [HIT + .8, 0, "in"]]);
  fig(Bc, "surf", 109, 300, 1.1, 60, 1560, 2);
  const tbw = E.el(Bc, "abs", "left:0;top:0;width:1px;height:1px;z-index:3");
  const tb1 = E.img(tbw, "tb", `position:absolute;left:${540 - 944 * .95 / 2}px;top:${1860 - 557 * .95}px;width:${944 * .95}px;height:${557 * .95}px`);
  const tb2 = E.img(tbw, "th", `position:absolute;left:${540 - 920 * .95 / 2}px;top:${1860 - 606 * .95}px;width:${920 * .95}px;height:${606 * .95}px;opacity:0`);
  E.F(t => { const h = t >= HIT; tb1.style.opacity = h ? 0 : 1; tb2.style.opacity = h ? 1 : 0; });
  const sl4 = E.el(Bc, "abs", "left:360px;top:0;width:110px;height:198px;z-index:4;opacity:0"); E.img(sl4, "slt", "width:110px;height:198px");
  show(sl4, [[FALL, HIT]]); E.K(sl4, "y", [[FALL, -300], [HIT, 1380, "in"]]); E.K(sl4, "r", [[FALL, 0], [HIT, 720]]);
  const note = E.el(Bc, "abs", "left:300px;top:760px;width:480px;padding:22px 26px;background:#fffdf3;border:5px solid #1d2b36;border-radius:10px;transform:rotate(-4deg);font-family:'Comic Sans MS',cursive;font-weight:700;font-size:48px;line-height:1.15;color:#1d2b36;text-align:center;z-index:9;opacity:0;box-shadow:0 12px 26px rgba(0,0,0,.25)", "Clean your room. ❤️<br>— Mum");
  E.pop(note, HIT + .6, { from: .3, dur: .35 }); E.K(note, "o", [[HIT + .6, 0], [HIT + .68, 1]]);
  const stars = E.el(Bc, "abs", "left:220px;top:1390px;font-size:60px;z-index:5;opacity:0", "💫"); show(stars, [[HIT, DUR]]);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "MUM'S PATIENCE: 3"], [ONE, "MUM'S PATIENCE: 2"], [TWO, "MUM'S PATIENCE: 1"], [THREE, "MUM'S PATIENCE: 0"], [STREET, "RANGE: 40 M"], [MAP, "RANGE: 17,000 KM"], [BEACH, "SYDNEY · 3 DAYS LATER"], [HIT, "DIRECT HIT"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= THREE && t < BEACH || t >= HIT ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.22);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Your room. Now. I'm counting to three!", 60, 760, 560, 160, Q, BUSY - .05, 46);
  bubble("Mum, I'm literally busy.", 480, 820, 520, 330, BUSY, ONE - .05, 46);
  bubble("One…", 110, 840, 260, 100, ONE, TWO - .05, 64);
  bubble("Two…", 110, 840, 260, 100, TWO, THREE - .05, 64);
  bubble("THREE!", 60, 820, 340, 160, THREE, STREET, 72);
  bubble("Nope. Nope. Nope!", 440, 920, 480, 300, NOPE, MAP - .05, 52);
  bubble("Finally… safe.", 300, 1150, 420, 200, SAFE, FALL, 54);
  const sb = E.el(S.el, "abs", "left:60px;top:500px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "NEVER MISSES.", HIT + 1.5, { size: 116, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(Q, "voices/ep79/m_count.wav", { vol: 1.25 });
  E.clip(BUSY, "voices/ep79/t_busy.wav", { vol: 1.2 });
  E.clip(ONE, "voices/ep79/m_one.wav", { vol: 1.3 }); E.S(ONE, "tick", .6);
  E.clip(TWO, "voices/ep79/m_two.wav", { vol: 1.3 }); E.S(TWO, "tick", .7);
  E.S(RUN, "whoosh", .7); E.clip(THREE, "voices/ep79/m_three.wav", { vol: 1.4 }); E.S(LAUNCH, "swish", .8);
  E.clip(STREET, "sfx/lock-on.wav", { vol: .45 }); E.clip(STREET + .05, "sfx/heist-sting.wav", { vol: .5 }); E.clip(STREET + .1, "voices/ep79/n_target.wav", { vol: 1.3 });
  E.clip(NOPE, "voices/ep79/t_nope.wav", { vol: 1.2 });
  E.clip(MAP, "sfx/jet-flyby.wav", { vol: .6, duck: false }); [MAP + 1.0, MAP + 1.8, MAP + 2.6].forEach(t => E.clip(t, "sfx/radar-ping.wav", { vol: .7 }));
  E.clip(BEACH, "sfx/waves-seagulls.wav", { vol: .8, duck: false, to: DUR - BEACH });
  E.clip(SAFE, "voices/ep79/t_safe.wav", { vol: 1.2 });
  E.S(FALL, "riser", .5); E.S(HIT, "smack", 1.0); E.S(HIT + .05, "thud", .7);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Mum's slipper never *misses*", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[19.0, 1], [19.25, 1.18, "out"], [19.6, 1, "io"]]);
}
