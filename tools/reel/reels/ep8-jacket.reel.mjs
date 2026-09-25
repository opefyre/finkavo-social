// EP.8 "32°C outside. Grandma:" — grandma will not let Otto leave for the beach without a jacket. Jacket, scarf and hat, then a
// montage of blankets, mittens and a thermos while the temperature climbs to 44°C. At the beach he tears it all off, the
// temperature drops ONE degree, he shivers — and she pops up behind the dune holding the jacket: "Eu disse." (told you).
// Universal joke; Portugal is the backdrop. Stands alone for strangers: no series numbering, no "follow" line.
export const meta = {
  id: "ep8-jacket", date: "2026-10-01",
  images: {
    o_happy: "characters/cutouts/otto-summer_happy.webp", o_jacket: "characters/cutouts/otto-summer_jacket.webp",
    o_layers: "characters/cutouts/otto-summer_layers.webp", o_bundled: "characters/cutouts/otto-summer_bundled.webp",
    o_shiver: "characters/cutouts/otto-summer_shiver.webp",
    d_knowing: "characters/cutouts/dona_knowing.webp", d_smirk: "characters/cutouts/dona_smirk.webp", d_jacket: "characters/cutouts/dona_jacket.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 124, root: 60, seed: 81, prog: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]] });
  const DUR = 12.2, BEACH = 6.6;
  const S = E.scene("door", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FLOOR = 1660;

  // ---------------- scene 1: the front door on a hot day ----------------
  const stage = E.el(S.el, "abs", "inset:0");
  const door1 = E.el(stage, "abs", "inset:0");
  const wall = E.el(door1, "abs", "left:0;top:0;width:1080px;height:1920px;background:#fbe6bf");
  E.el(door1, "abs", `left:0;top:${FLOOR}px;width:1080px;height:260px;background:#d7b48a`);
  E.el(door1, "abs", `left:520px;top:600px;width:560px;height:${FLOOR - 600}px;background:#3f2a1a;border-radius:14px 0 0 0`);   // open doorway
  E.el(door1, "abs", `left:500px;top:580px;width:30px;height:${FLOOR - 580}px;background:#8a5a2b`);
  E.F(t => {
    const k = Math.min(1, Math.max(0, (t - 3.6) / 2.8));                                     // the wall heats up with the montage
    const a = [251, 230, 191], b = [255, 176, 120];
    wall.style.background = `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * (t < BEACH ? k : 0))).join(",")})`;
  });
  // heat shimmer lines (moving from frame 0)
  for (let i = 0; i < 4; i++) {
    const h = E.el(door1, "abs", `left:${120 + i * 90}px;top:520px;width:10px;height:90px;border-radius:5px;background:rgba(255,160,60,.35)`);
    const ks = []; for (let t = 0; t < BEACH; t += .6) ks.push([t, (i % 2 ? 1 : -1) * 10, "io"], [t + .3, (i % 2 ? -1 : 1) * 10, "io"]);
    E.K(h, "x", ks);
  }

  // ---------------- scene 2: the beach ----------------
  const beach = E.el(stage, "abs", "inset:0;opacity:0");
  E.el(beach, "abs", "left:0;top:0;width:1080px;height:1160px;background:linear-gradient(180deg,#7cc7f2,#c9ecff)");
  E.el(beach, "abs", "left:0;top:1140px;width:1080px;height:170px;background:#2f9bd6");
  E.el(beach, "abs", "left:0;top:1140px;width:1080px;height:16px;background:#8fd6f5");
  E.el(beach, "abs", "left:0;top:1300px;width:1080px;height:620px;background:#f1d59a");
  E.el(beach, "abs", "left:900px;top:760px;width:16px;height:760px;background:#e9e2d6");                                    // parasol pole
  const can = E.el(beach, "abs", "left:650px;top:700px;width:520px;height:190px;border-radius:260px 260px 0 0;overflow:hidden");
  for (let i = 0; i < 8; i++) E.el(can, "abs", `left:${i * 65}px;top:0;width:65px;height:190px;background:${i % 2 ? "#fff" : "#ff7d63"}`);
  E.K(beach, "o", [[BEACH - .01, 0], [BEACH, 1]]);
  E.K(door1, "o", [[BEACH - .01, 1], [BEACH, 0]]);
  E.wipe(BEACH);

  // ---------------- Dona in the doorway ----------------
  const DS = .85, DW = 665 * DS, DH = 1014 * DS;
  const dona = E.el(stage, "abs", `left:530px;top:${FLOOR - DH + 10}px;width:${DW}px;height:${DH}px;z-index:1`);
  const donaI = E.el(dona, "abs", "inset:0;transform-origin:50% 100%");
  const DT = ["d_knowing", "d_smirk"];
  const dimg = DT.map(n => E.img(donaI, n, `position:absolute;left:0;top:0;width:${DW}px;height:${DH}px`));
  const sway = []; for (let t = 0; t <= BEACH; t += .8) sway.push([t, (Math.round(t / .8) % 2) ? -8 : 0, "io"]);
  E.K(donaI, "y", sway);
  E.K(dona, "o", [[BEACH - .01, 1], [BEACH, 0]]);
  E.F(t => { const f = at([[0, "d_knowing"], [.5, "d_smirk"], [1.7, "d_knowing"], [2.6, "d_smirk"]], t); dimg.forEach((im, i) => { im.style.opacity = DT[i] === f ? 1 : 0; }); });

  // Dona at the beach: rises from behind the dune with the jacket
  const POP = 9.3;
  const J = .85, JW = 630 * J, JH = 1020 * J;
  const donaB = E.el(stage, "abs", `left:560px;top:${1490 - 560}px;width:${JW}px;height:${JH}px;z-index:2;opacity:0`);
  E.img(donaB, "d_jacket", `width:${JW}px;height:${JH}px`);
  E.K(donaB, "o", [[POP - .01, 0], [POP, 1]]);
  E.K(donaB, "y", [[POP, 520], [POP + .32, 0, "back"]]);
  const dune = E.el(stage, "abs", "left:430px;top:1470px;width:1000px;height:640px;border-radius:50%;background:#e8c883;z-index:3;opacity:0");
  E.K(dune, "o", [[BEACH - .01, 0], [BEACH, 1]]);

  // ---------------- Otto ----------------
  const OS = .85, OW = 857 * OS, OH = 1119 * OS;
  const ottoW = E.el(stage, "abs", `left:-40px;top:${FLOOR - OH + 10}px;width:${OW}px;height:${OH}px;z-index:4`);
  const ottoI = E.el(ottoW, "abs", "inset:0;transform-origin:50% 100%");
  const OT = ["o_happy", "o_jacket", "o_layers", "o_bundled", "o_shiver"];
  const oimg = OT.map(n => E.img(ottoI, n, `position:absolute;left:0;top:0;width:${OW}px;height:${OH}px`));
  const OFF = 7.0, BREEZE = 8.4;
  const ottoFace = [[0, "o_happy"], [1.0, "o_jacket"], [2.9, "o_layers"], [4.1, "o_bundled"], [OFF, "o_happy"], [BREEZE + .15, "o_shiver"]];
  E.F(t => {
    const f = at(ottoFace, t);
    oimg.forEach((im, i) => { im.style.opacity = OT[i] === f ? 1 : 0; });
    let r = 0, y = 0, sx = 1;
    if (t < 1.0) y = Math.max(0, Math.sin(t * 8)) * -10;                                    // happy bounce
    if (t >= 4.1 && t < BEACH) { const k = (t - 4.1) / (BEACH - 4.1); sx = 1 + k * .1; r = Math.sin(t * 44) * (1 + k * 2); }
    if (t >= OFF && t < BREEZE) y = Math.max(0, Math.sin((t - OFF) * 9)) * -14;
    if (t >= BREEZE + .15) r = Math.sin(t * 90) * 2.2;                                        // shivering
    ottoI.style.transform = `translateY(${y}px) rotate(${r}deg) scaleX(${sx})`;
  });
  E.S(1.0, "swish", .9); E.S(1.05, "thud", .7);
  E.S(2.9, "swish", .9); E.S(2.95, "thud", .7);
  E.S(4.1, "poof", .8);

  // the montage: things fly from grandma onto Otto
  const thing = (t, html, w, h) => {
    const el = E.el(stage, "abs", `left:700px;top:1300px;width:${w}px;height:${h}px;z-index:5;opacity:0`, html);
    E.K(el, "o", [[t - .01, 0], [t, 1], [t + .32, 1], [t + .36, 0]]);
    E.K(el, "x", [[t, 0], [t + .34, -420, "in"]]);
    E.K(el, "y", [[t, 0], [t + .16, -380, "out"], [t + .34, -220, "in"]]);
    E.K(el, "r", [[t, 0], [t + .34, -200]]);
    E.S(t, "swish", .7); E.S(t + .34, "thud", .6);
  };
  const plaid = "background:repeating-linear-gradient(0deg,rgba(40,60,120,.8) 0 14px,transparent 14px 28px),repeating-linear-gradient(90deg,rgba(200,40,40,.8) 0 14px,#f3ead7 14px 28px);border-radius:10px";
  thing(3.7, `<div style="width:170px;height:130px;${plaid}"></div>`, 170, 130);                                        // blanket
  thing(4.15, `<div style="width:80px;height:100px;border-radius:36px 36px 20px 20px;background:#23305e"></div>`, 80, 100);  // mitten
  thing(4.6, `<div style="width:70px;height:150px;border-radius:14px;background:linear-gradient(90deg,#9aa6b2,#e3e8ee,#9aa6b2)"></div>`, 70, 150); // thermos
  thing(5.05, `<div style="width:190px;height:44px;border-radius:14px;background:repeating-linear-gradient(90deg,#2f8f5b 0 22px,#f3ead7 22px 44px)"></div>`, 190, 44); // scarf
  thing(5.5, `<div style="width:110px;height:120px;border-radius:40px;background:#d9482e"></div>`, 110, 120);          // hot-water bottle
  thing(5.95, `<div style="width:170px;height:130px;${plaid}"></div>`, 170, 130);                                       // another blanket

  // sweat drops fly off his head while he cooks
  for (let i = 0; i < 10; i++) {
    const t = 3.0 + i * .34;
    const d = E.el(stage, "abs", `left:${300 + (i % 3) * 40}px;top:760px;width:22px;height:30px;border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;background:#6cc6ff;z-index:6;opacity:0`);
    E.K(d, "o", [[t - .01, 0], [t, 1], [t + .4, 0]]);
    E.K(d, "x", [[t, 0], [t + .4, (i % 2 ? 1 : -1) * 90]]);
    E.K(d, "y", [[t, 0], [t + .15, -60, "out"], [t + .4, 40, "in"]]);
  }

  // at the beach: everything flies off (pops), then one breeze
  const off = (t, css, dx, dy, rot) => {
    const el = E.el(stage, "abs", `left:260px;top:1150px;z-index:6;opacity:0;${css}`);
    E.K(el, "o", [[t - .01, 0], [t, 1], [t + .5, 1], [t + .55, 0]]);
    E.K(el, "x", [[t, 0], [t + .55, dx, "out"]]); E.K(el, "y", [[t, 0], [t + .25, dy * .5, "out"], [t + .55, dy * .5 + 400, "in"]]); E.K(el, "r", [[t, 0], [t + .55, rot]]);
    E.S(t, "pop", .8);
  };
  off(OFF, "width:170px;height:200px;border-radius:30px;background:#d9482e", -300, -420, -220);                   // puffer jacket
  off(OFF + .12, "width:200px;height:48px;border-radius:14px;background:#2f8f5b", 380, -520, 300);                // scarf
  off(OFF + .24, "width:110px;height:90px;border-radius:55px 55px 12px 12px;background:#23305e", -420, -500, -260); // hat
  off(OFF + .36, `width:170px;height:130px;${plaid}`, 420, -360, 200);                                             // blanket
  off(OFF + .48, "width:80px;height:100px;border-radius:36px;background:#23305e", -360, -300, -140);               // mitten
  E.S(OFF + .6, "sparkle", .8);
  for (let i = 0; i < 4; i++) {
    const w = E.el(stage, "abs", `left:-500px;top:${760 + i * 150}px;width:420px;height:10px;border-radius:5px;background:rgba(255,255,255,.9);z-index:7`);
    E.K(w, "x", [[BREEZE + i * .05, 0], [BREEZE + .7 + i * .05, 1700, "lin"]]);
  }
  E.S(BREEZE, "swish", .6); E.S(BREEZE + .2, "swish", .5);

  // ---------------- the temperature pill ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;display:flex;align-items:center;gap:14px;background:${C.amberD};color:#fff;font-weight:900;font-size:58px;padding:.08em .38em .1em .2em;border-radius:.3em;white-space:nowrap;z-index:7;transform-origin:0 50%`);
  const sunI = E.el(pill, "", "width:46px;height:46px;border-radius:50%;background:#ffd23f;box-shadow:0 0 0 6px rgba(255,210,63,.45)");
  const tx = E.el(pill, "", "", "32°C");
  const temp = t => {
    if (t < 1.0) return 32; if (t < 2.9) return 33; if (t < 3.7) return 35;
    if (t < 6.2) return Math.round(35 + 9 * (t - 3.7) / 2.5);
    if (t < BEACH) return 44; if (t < BREEZE) return 32; return 31;
  };
  E.F(t => {
    const v = temp(t), s = v + "°C"; if (tx.textContent !== s) tx.textContent = s;
    pill.style.background = t >= BREEZE ? "#3a8dd8" : v >= 40 ? C.coralD : v >= 35 ? "#e0622e" : C.amberD;
    pill.style.transform = v >= 40 && t < BEACH ? `rotate(${Math.sin(t * 60) * 2}deg)` : "none";
    sunI.style.background = t >= BREEZE ? "#cfe8ff" : "#ffd23f";
  });
  [1.0, 2.9].forEach(t => E.K(pill, "s", [[t, 1.3], [t + .2, 1, "back"]]));
  for (let v = 36; v <= 44; v++) E.S(3.7 + (v - 35) * 2.5 / 9, "tick", .6);
  E.K(pill, "s", [[BREEZE, 1.4], [BREEZE + .25, 1, "back"]]);
  E.S(BREEZE + .02, "ding", .5);

  // ---------------- speech bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const box = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 80 : 58}px;line-height:1.02;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(box, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .1, 1], [t1, 0]]);
    E.S(t0 + .02, "pop", .7);
    return b;
  };
  const sub = s => `<div style="font-size:40px;font-weight:800;color:${C.mute};margin-top:6px;letter-spacing:0">${s}</div>`;
  bubble(`Leva um casaco!${sub("(take a jacket!)")}`, 460, 450, 580, "r", .5, 1.7);
  bubble("It's 32 degrees!", 60, 470, 500, "l", 1.7, 2.6);
  bubble("And a scarf. And a hat.", 470, 460, 560, "r", 2.6, 3.6);
  bubble(`Eu disse.${sub("(told you.)")}`, 470, 450, 520, "r", POP + .15, 11.4, true);
  E.S(POP, "whoosh", .8); E.S(POP + .3, "ding", .8);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "32°C outside. *Grandma:*", { size: 58, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[11.45, 1], [11.7, 1.18, "out"], [12.05, 1, "io"]]);
}
