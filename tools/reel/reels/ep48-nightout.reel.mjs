// EP.48 "A night out in Portugal" — 22:00: Otto arrives at the club like at home. It is empty: a bored DJ on his phone, a yawning
// bouncer, a disco ball for one. He dances alone; his ENERGY drains, LISBOA's stays at 0%. 00:30: asleep on the bar. 01:45: he
// shuffles out yawning just as the whole city pours in, dressed up, and LISBOA's energy shoots to 100%. Time-lapse: the club
// throbs all night, the sky turns pink. 07:00: Otto goes for a fresh morning jog… and meets them just leaving, eating bifanas:
// "BOM DIAAA!" Effects + one crowd shout (ElevenLabs). Paced per the skit guide.
export const meta = {
  id: "ep48-nightout", date: "2026-11-10",
  images: {
    dance: "characters/cutouts/otto-casual_dance.webp", sleep: "characters/cutouts/otto-casual_barsleep.webp", yawn: "characters/cutouts/otto-casual_yawn.webp",
    jog: "characters/cutouts/otto-jog.webp", dj: "characters/cutouts/dj_phone.webp", bouncer: "characters/cutouts/bouncer_yawn.webp",
    night: "characters/cutouts/crowd_night.webp", dawn: "characters/cutouts/crowd_dawn.webp", ball: "characters/props/discoball.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 124, root: 57, seed: 481, prog: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]] });
  const DUR = 17.6, FLOOR = 1580, SLEEP = 3.2, FLOOD = 5.6, OUTS = 9.4, DAWN = 11.2;
  const S = E.scene("night", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const lerpK = (K, t) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t < K[i + 1][0]) { const u = (t - K[i][0]) / (K[i + 1][0] - K[i][0]); return K[i][1] + (K[i + 1][1] - K[i][1]) * u; } return K[K.length - 1][1]; };
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };
  const fig = (P, n, w, h, s, left, bottom, z = 3) => { const el = E.el(P, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  // ================= the club =================
  const A = layer(0, OUTS);
  E.el(A, "abs", "inset:0;background:linear-gradient(180deg,#140a26,#2a1240)");
  const beams = [0, 1, 2, 3].map(i => E.el(A, "abs", `left:${i < 2 ? -300 : 780}px;top:${300 - 300}px;width:600px;height:600px;transform-origin:${i < 2 ? "0 0" : "100% 0"};background:conic-gradient(from ${i < 2 ? 100 : 230}deg at ${i < 2 ? "0 0" : "100% 0"},transparent 0deg,${["rgba(255,80,200,.35)", "rgba(80,200,255,.3)", "rgba(255,210,60,.3)", "rgba(120,255,160,.3)"][i]} 6deg,transparent 12deg);opacity:0`));
  E.F(t => { const party = t >= FLOOD + .8 ? 1 : .35; beams.forEach((b, i) => { b.style.opacity = party; b.style.transform = `rotate(${Math.sin(t * (1 + i * .3) + i) * 30}deg) scale(3)`; }); });
  // disco ball + sparkles on the walls
  E.el(A, "abs", "left:538px;top:360px;width:4px;height:90px;background:#888");
  const ball = fig(A, "ball", 218, 261, .75, 540 - 82, 450 + 196, 2);
  E.K(ball, "r", [[0, -4], [.8, 4, "io"], [1.6, -4, "io"], [2.4, 4, "io"], [3.2, -4, "io"], [4, 4, "io"], [4.8, -4, "io"], [5.6, 4, "io"], [6.4, -4, "io"], [7.2, 4, "io"], [8, -4, "io"], [8.8, 4, "io"]]);
  const dots = Array.from({ length: 22 }, (_, i) => E.el(A, "abs", `left:0;top:0;width:12px;height:12px;border-radius:50%;background:#fff;box-shadow:0 0 10px 3px rgba(255,255,255,.7);z-index:1`));
  E.F(t => dots.forEach((d, i) => { const a = i * 2.39 + t * .7, r = 260 + (i % 5) * 110; d.style.transform = `translate(${540 + Math.cos(a) * r}px,${560 + Math.sin(a) * r * .8}px)`; d.style.opacity = .8; }));
  // the DJ booth
  const dj = fig(A, "dj", 386, 1057, .52, 820, 1330, 1);
  E.el(A, "abs", "left:760px;top:1130px;width:320px;height:200px;background:#22252b;border-radius:14px 14px 0 0;z-index:2;box-shadow:inset 0 6px 0 #3a3f48");
  for (let i = 0; i < 6; i++) { const l = E.el(A, "abs", `left:${784 + i * 48}px;top:1160px;width:36px;height:14px;border-radius:4px;background:${["#ff4fc3", "#4fd8ff", "#ffd23f"][i % 3]};z-index:2`); E.F(t => { l.style.opacity = (Math.floor(t * 4 + i) % 3) ? 1 : .25; }); }
  // the bar (right) and the exit door (left)
  E.el(A, "abs", "left:500px;top:700px;width:280px;height:14px;background:#5a3a2a"); for (let k = 0; k < 6; k++) E.el(A, "abs", `left:${515 + k * 44}px;top:${610 + (k % 2) * 10}px;width:26px;height:${90 - (k % 2) * 10}px;border-radius:10px 10px 3px 3px;background:${["#3f8f5a", "#b5482d", "#d9a441", "#7fb0d6"][k % 4]}`);
  E.el(A, "abs", `left:520px;top:1100px;width:240px;height:${FLOOR - 1100}px;background:#3b2432;z-index:4;border-radius:8px 8px 0 0`); E.el(A, "abs", "left:510px;top:1090px;width:260px;height:22px;background:#6b4a5a;z-index:4");
  E.el(A, "abs", `left:10px;top:860px;width:230px;height:${FLOOR - 860}px;background:#0b0614;border:10px solid #3a2a4a;border-bottom:none`);
  E.el(A, "abs", "left:60px;top:800px;background:#1f7a3a;color:#fff;font-weight:900;font-size:30px;padding:2px 14px;border-radius:6px", "SAÍDA");
  const bouncer = fig(A, "bouncer", 492, 1049, .5, 0, FLOOR + 10, 3);
  // the dance floor
  const tiles = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) tiles.push(E.el(A, "abs", `left:${c * 120}px;top:${FLOOR + r * 114}px;width:116px;height:110px;border-radius:6px`));
  const TC = ["#ff4fc3", "#4fd8ff", "#ffd23f", "#7cff9e", "#9b59ff"];
  E.F(t => tiles.forEach((tl, i) => { const k = Math.floor(t * (t > FLOOD ? 6 : 2) + i * 1.7) % 5; tl.style.background = TC[k]; tl.style.opacity = t > FLOOD ? .9 : .45; }));
  // Otto: dancing alone → asleep on the bar → leaving
  const od = fig(A, "dance", 604, 1072, .72, 250, FLOOR + 30, 5);
  const wig = []; for (let t = 0; t < SLEEP; t += .5) wig.push([t, -6, "io"], [t + .25, 6, "io"]);
  E.K(od, "r", wig); E.K(od, "o", [[SLEEP - .01, 1], [SLEEP, 0]]);
  const ob = []; for (let t = 0; t < SLEEP; t += .5) ob.push([t, 0, "io"], [t + .25, -20, "io"]);
  E.K(od, "y", ob);
  const os = fig(A, "sleep", 521, 1021, .72, 180, FLOOR + 30, 5);
  E.K(os, "o", [[SLEEP - .01, 0], [SLEEP, 1], [FLOOD + .2, 1], [FLOOD + .21, 0]]);
  const zz = [0, 1, 2].map(i => E.el(A, "abs", "left:470px;top:860px;font-weight:900;font-size:60px;color:#c9b8ff;z-index:6;opacity:0", "z"));
  E.F(t => zz.forEach((z, i) => { const u = ((t - SLEEP + i * .4) % 1.2) / 1.2; z.style.opacity = t > SLEEP + .2 && t < FLOOD ? 1 - u : 0; z.style.transform = `translate(${u * 60}px,${-u * 120}px) scale(${.6 + u * .6})`; }));
  const oy = fig(A, "yawn", 515, 1033, .72, 300, FLOOR + 30, 7);
  E.K(oy, "o", [[FLOOD + .19, 0], [FLOOD + .2, 1]]);
  E.K(oy, "x", [[FLOOD + .2, 0], [FLOOD + 2.4, -760]]);
  const wk = []; for (let t = FLOOD + .2; t < FLOOD + 2.4; t += .36) wk.push([t, 0, "io"], [t + .18, -12, "io"]);
  E.K(oy, "y", wk);
  // the city pours in
  const cn = fig(A, "night", 1093, 803, .92, -1060, FLOOR + 40, 6);
  E.K(cn, "x", [[FLOOD, 0], [FLOOD + 1.6, 1110, "out"]]);
  const jump = []; for (let t = FLOOD + 1.6; t < OUTS; t += .48) jump.push([t, 0, "io"], [t + .24, -26, "io"]);
  E.K(cn, "y", jump);
  const cn2 = fig(A, "night", 1093, 803, .7, -900, FLOOR - 120, 2);                                    // more people behind
  E.K(cn2, "x", [[FLOOD + .6, 0], [FLOOD + 2.2, 1050, "out"]]); E.K(cn2, "o", [[FLOOD + .6, 0], [FLOOD + .7, .85]]);
  const flash = E.el(A, "abs", "inset:0;z-index:8;background:#fff;opacity:0");
  E.F(t => { flash.style.opacity = t > FLOOD + .8 && t < OUTS ? (Math.floor(t * 4) % 2 ? .06 : 0) : 0; });

  // ================= outside, the night flies by =================
  const B = layer(OUTS, DAWN);
  const sky = E.el(B, "abs", "inset:0");
  E.F(t => { const u = Math.max(0, Math.min(1, (t - OUTS) / (DAWN - OUTS))); sky.style.background = `linear-gradient(180deg, rgb(${11 + u * 220},${22 + u * 120},${64 + u * 60}), rgb(${40 + u * 215},${30 + u * 150},${90 - u * 10}))`; });
  const sun = E.el(B, "abs", "left:60px;top:1200px;width:200px;height:200px;border-radius:50%;background:#ffd23f;box-shadow:0 0 80px 40px rgba(255,190,80,.6)");
  E.K(sun, "y", [[OUTS, 300], [DAWN, -200, "out"]]);
  const club = E.el(B, "abs", "left:300px;top:900px;width:720px;height:1020px;background:#2a1a33;border-radius:10px 10px 0 0");
  const neon = E.el(club, "abs", "left:180px;top:60px;width:360px;height:110px;border:8px solid #ff4fc3;border-radius:22px;color:#ff4fc3;font-weight:900;font-size:70px;display:flex;align-items:center;justify-content:center;text-shadow:0 0 18px #ff4fc3;box-shadow:0 0 24px #ff4fc3", "CLUB");
  const wins = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) wins.push(E.el(club, "abs", `left:${60 + c * 165}px;top:${260 + r * 220}px;width:120px;height:150px;border-radius:8px`));
  E.F(t => { const beat = Math.floor(t * 4.1) % 2; wins.forEach((w, i) => { w.style.background = TC[(Math.floor(t * 4.1) + i) % 5]; w.style.opacity = beat ? .95 : .6; }); club.style.transform = `scale(${beat ? 1.012 : 1})`; club.style.transformOrigin = "50% 100%"; });

  // ================= 07:00, sunrise =================
  const D = layer(DAWN, DUR);
  E.el(D, "abs", "inset:0;background:linear-gradient(180deg,#ffb37a,#ffe0b0)");
  E.el(D, "abs", "left:780px;top:520px;width:200px;height:200px;border-radius:50%;background:#ffd23f;box-shadow:0 0 80px 40px rgba(255,210,63,.55)");
  for (let i = 0; i < 4; i++) E.el(D, "abs", `left:${-40 + i * 290}px;top:${820 - (i % 2) * 70}px;width:270px;height:${720 + (i % 2) * 70}px;background:${["#f5c9a8", "#ffe29a", "#bfe0d6", "#2a1a33"][i]};border-radius:6px`);
  E.el(D, "abs", "left:870px;top:1180px;width:160px;height:420px;background:#0b0614;border-radius:8px 8px 0 0");
  E.el(D, "abs", "left:860px;top:860px;width:200px;height:70px;border:6px solid #a06a90;border-radius:16px;color:#a06a90;font-weight:900;font-size:40px;display:flex;align-items:center;justify-content:center", "CLUB");
  E.el(D, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background:repeating-linear-gradient(135deg,#ece6d8 0 30px,#d9d0bd 30px 60px)`);
  const jg = fig(D, "jog", 715, 1062, .66, -500, FLOOR + 30, 5);
  E.K(jg, "x", [[DAWN, 0], [DAWN + 1.2, 540, "out"]]);
  const jb = []; for (let t = DAWN; t < DUR; t += .32) jb.push([t, 0, "io"], [t + .16, -22, "io"]);
  E.K(jg, "y", jb);
  const cd = fig(D, "dawn", 975, 816, .78, 900, FLOOR + 40, 4);
  E.K(cd, "x", [[DAWN + .3, 0], [DAWN + 1.9, -300, "out"], [DUR, -380]]);
  const sw = []; for (let t = DAWN + .3; t < DUR; t += .6) sw.push([t, 0, "io"], [t + .3, -3, "io"]);
  E.K(cd, "r", sw);

  // ================= HUD: clock + energy =================
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:#ff4fc3;color:#fff;font-weight:900;font-size:56px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  const CLK = [[0, "22:00"], [1.8, "23:30"], [SLEEP, "00:30"], [FLOOD, "01:45"], [8.2, "03:00"], [OUTS, "05:00"], [10.3, "06:00"], [DAWN, "07:00"]];
  E.F(t => { const s = at(CLK, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= DAWN ? "#e08a3a" : "#ff4fc3"; });
  CLK.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.2], [t + .2, 1, "out"]]));
  const panel = E.el(S.el, "abs", "left:560px;top:430px;width:460px;background:rgba(10,6,20,.72);border-radius:20px;padding:14px 18px;box-sizing:border-box;z-index:9;border:3px solid rgba(255,255,255,.25)");
  const bar = (label, col) => {
    const row = E.el(panel, "", "display:flex;align-items:center;gap:12px;margin:6px 0");
    E.el(row, "", "width:120px;color:#fff;font-weight:900;font-size:28px", label);
    const tr = E.el(row, "", "flex:1;height:28px;border-radius:14px;background:rgba(255,255,255,.18);overflow:hidden");
    const fl = E.el(tr, "", `height:100%;width:0;background:${col};border-radius:14px`);
    const pc = E.el(row, "", "width:78px;text-align:right;color:#fff;font-weight:900;font-size:28px", "");
    return (v) => { fl.style.width = `${v}%`; const s = `${Math.round(v)}%`; if (pc.textContent !== s) pc.textContent = s; };
  };
  const eO = bar("OTTO", "#f2b632"), eL = bar("LISBOA", "#ff4fc3");
  const EO = [[0, 100], [SLEEP, 40], [FLOOD, 12], [OUTS, 8], [DAWN, 8], [DAWN + .6, 100]], EL = [[0, 0], [FLOOD + .4, 0], [FLOOD + 1.6, 100], [DUR, 100]];
  E.F(t => { eO(lerpK(EO, t)); eL(lerpK(EL, t)); });

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 56) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:32px;padding:18px 26px 22px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Where is everyone?", 60, 640, 460, 250, .9, 2.9, 50);
  bubble(`BOM DIAAA!<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:4px">(Good morning!)</div>`, 520, 680, 440, 200, DAWN + 1.9, DUR - .6, 64);
  const sb = E.el(S.el, "abs", "left:60px;top:1470px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "THE NIGHT JUST ENDED.", DAWN + 3.0, { size: 84, rot: -6, bg: C.coralD, shake: 12 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/club-empty.wav", { vol: .5, duck: false }); E.clip(4.9, "sfx/club-empty.wav", { vol: .35, duck: false, to: FLOOD - 4.9 });
  E.clip(1.6, "sfx/yawn.wav", { vol: .5 });
  E.clip(SLEEP + .4, "sfx/snore.wav", { vol: .8 });
  E.clip(FLOOD, "sfx/club-full.wav", { vol: .6, duck: false, gain: [[FLOOD, .2], [FLOOD + 1.2, 1]] }); E.clip(FLOOD + 4.9, "sfx/club-full.wav", { vol: .3, duck: false, to: DAWN - FLOOD - 4.9 });
  E.clip(FLOOD + .3, "sfx/yawn.wav", { vol: .6 });
  E.clip(FLOOD + .9, "sfx/applause-cheer.wav", { vol: .5 });
  for (let k = 0; k < 7; k++) E.S(OUTS + k * .25, "tick", .45);
  E.clip(DAWN, "sfx/dawn-birds.wav", { vol: 1.3, duck: false });
  E.clip(DAWN + 1.9, "voices/ep48/c_bomdia.wav", { vol: 1.2 }); E.clip(DAWN + 2.0, "sfx/applause-cheer.wav", { vol: .6 });

  // ---------------- title (frame 0) ----------------
  const tb = E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(246,239,226,.95);box-shadow:0 8px 20px rgba(0,0,0,.3);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "A night out in *Portugal*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[16.8, 1], [17.05, 1.18, "out"], [17.4, 1, "io"]]);
}
