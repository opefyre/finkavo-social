// EP.7 "The Portuguese goodbye" — Otto says "Ok, I'm going!" at 22:00. Cake, holiday photos and "how's your mother?" keep him
// at the door; then every relative's two goodbye kisses while the clock spins to sunrise (KISSES 2 -> 24). He finally gets home
// and the phone buzzes: "Home safe? … Oh, one more thing…". Universal joke; Portugal (two kisses) is the backdrop.
// Stands alone for strangers: no series numbering, no "follow" line.
export const meta = {
  id: "ep7-goodbye", date: "2026-09-30",
  images: {
    o_wave: "characters/cutouts/otto-coat_wave.webp", o_cake: "characters/cutouts/otto-coat_cake.webp",
    o_tired: "characters/cutouts/otto-coat_tired-cake.webp", o_phone: "characters/cutouts/otto-coat_phone.webp",
    d_knowing: "characters/cutouts/dona_knowing.webp", d_smirk: "characters/cutouts/dona_smirk.webp",
    marta_phone: "characters/cutouts/marta_phone.webp", marta: "characters/cutouts/marta_default.webp",
    leo: "characters/cutouts/leo_default.webp", nico: "characters/cutouts/nico_default.webp",
    zoe: "characters/cutouts/zoe_default.webp", buck: "characters/cutouts/buck_default.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 116, root: 55, seed: 71, prog: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]] });
  const DUR = 13.8;
  const S = E.scene("hall", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FLOOR = 1660, HOME = 10.1;

  // ---------------- the hallway ----------------
  const stage = E.el(S.el, "abs", "inset:0;transform-origin:320px 820px");
  const hall = E.el(stage, "abs", "inset:0");
  E.el(hall, "abs", "left:0;top:0;width:1080px;height:1920px;background:#efdcb8");
  E.el(hall, "abs", "left:0;top:1180px;width:1080px;height:480px;background:#d9b98c");                    // wainscot
  E.el(hall, "abs", "left:0;top:1172px;width:1080px;height:12px;background:#b08a5c");
  E.el(hall, "abs", `left:0;top:${FLOOR}px;width:1080px;height:260px;background:#9c6f45`);
  // the window: the sky tells the time
  const win = E.el(hall, "abs", "left:420px;top:470px;width:280px;height:300px;border:16px solid #fff;border-radius:10px;overflow:hidden;box-shadow:0 6px 16px rgba(0,0,0,.12)");
  const sky = E.el(win, "abs", "inset:0");
  E.el(win, "abs", "left:124px;top:0;width:16px;height:100%;background:#fff");
  E.el(win, "abs", "left:0;top:134px;width:100%;height:16px;background:#fff");
  const moon = E.el(win, "abs", "left:40px;top:40px;width:56px;height:56px;border-radius:50%;background:#fff6c8;box-shadow:0 0 24px #fff6c8");
  const sun = E.el(win, "abs", "left:150px;top:300px;width:90px;height:90px;border-radius:50%;background:#ffb13b;box-shadow:0 0 40px #ffcf6a");
  // the front door (left)
  const doorFrame = E.el(hall, "abs", `left:20px;top:640px;width:330px;height:${FLOOR - 640}px;background:#3b2412;border-radius:10px 10px 0 0`);
  const door = E.el(hall, "abs", `left:34px;top:654px;width:302px;height:${FLOOR - 654}px;background:#7a4a26;border-radius:6px 6px 0 0;transform-origin:0 50%`);
  E.el(door, "abs", "left:30px;top:40px;width:242px;height:360px;border:8px solid #6a3e1e;border-radius:8px");
  E.el(door, "abs", "left:30px;top:460px;width:242px;height:360px;border:8px solid #6a3e1e;border-radius:8px");
  E.el(door, "abs", "left:250px;top:470px;width:30px;height:30px;border-radius:50%;background:#e2b54a");
  E.K(door, "sx", [[9.35, 1], [9.5, .12, "out"], [9.95, .12], [10.02, 1, "in"]]);

  // ---------------- Otto ----------------
  const OS = .95, OW = 629 * OS, OH = 1081 * OS;
  const ottoW = E.el(stage, "abs", `left:60px;top:${FLOOR - OH + 10}px;width:${OW}px;height:${OH}px;z-index:2`);
  const ottoI = E.el(ottoW, "abs", "inset:0;transform-origin:50% 100%");
  const OT = ["o_wave", "o_cake", "o_tired", "o_phone"];
  const oimg = OT.map(n => E.img(ottoI, n, `position:absolute;left:0;top:0;width:${OW}px;height:${OH}px`));
  const ottoFace = [[0, "o_wave"], [1.5, "o_cake"], [9.0, "o_tired"], [HOME, "o_phone"]];
  E.K(ottoW, "x", [[9.4, 0], [9.95, -760, "in"], [HOME - .01, -760], [HOME, 160]]);

  // ---------------- Dona (host) ----------------
  const DS = .9, DW = 665 * DS, DH = 1014 * DS;
  const dona = E.el(stage, "abs", `left:520px;top:${FLOOR - DH + 10}px;width:${DW}px;height:${DH}px;z-index:1`);
  const donaI = E.el(dona, "abs", "inset:0;transform-origin:50% 100%");
  const DT = ["d_knowing", "d_smirk"];
  const dimg = DT.map(n => E.img(donaI, n, `position:absolute;left:0;top:0;width:${DW}px;height:${DH}px`));
  const sway = []; for (let t = 0; t <= DUR; t += .8) sway.push([t, (Math.round(t / .8) % 2) ? -8 : 0, "io"]);
  E.K(donaI, "y", sway);
  E.K(dona, "x", [[5.45, 0], [5.6, 700, "in"], [9.0, 700], [9.2, 0, "out"], [HOME - .01, 0], [HOME, 1200]]);

  // ---------------- visitors: slide in from the right ----------------
  const H0 = 960;
  const person = (img, w, h, left, z = 3) => {
    const s = H0 / h, W = w * s;
    const el = E.el(stage, "abs", `left:${left}px;top:${FLOOR - H0 + 10}px;width:${W}px;height:${H0}px;z-index:${z};transform-origin:50% 100%;opacity:0`);
    E.img(el, img, `width:${W}px;height:${H0}px`);
    return el;
  };
  const visit = (el, t0, t1) => {
    E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1, 1], [t1 + .01, 0]]);
    E.K(el, "x", [[t0, 640], [t0 + .2, 0, "out"], [t1 - .18, 0], [t1, 700, "in"]]);
    E.S(t0, "swish", .7);
  };
  const marta = person("marta_phone", 535, 1022, 560); visit(marta, 2.35, 3.75);
  const leo = person("leo", 514, 1019, 580); visit(leo, 3.75, 4.95);

  // the kiss montage: 12 visits, two kisses each
  const KT0 = 5.6, KD = .28;
  const queue = [["d_knowing", 665, 1014], ["marta", 498, 1017], ["leo", 514, 1019], ["nico", 516, 970], ["zoe", 1075, 1818], ["buck", 581, 976]];
  const kissers = [];
  const heart = (t, x, y) => {
    const h = E.el(stage, "abs", `left:${x}px;top:${y}px;width:60px;height:60px;z-index:6;opacity:0`);
    h.innerHTML = `<svg viewBox="0 0 32 30" width="60" height="56"><path d="M16 29 C6 21 0 15 0 8.5 C0 3.8 3.6 0 8.2 0 C11.2 0 14 1.8 16 4.6 C18 1.8 20.8 0 23.8 0 C28.4 0 32 3.8 32 8.5 C32 15 26 21 16 29Z" fill="#ff5d7a"/></svg>`;
    E.K(h, "o", [[t, 0], [t + .02, 1], [t + .3, 0]]); E.K(h, "y", [[t, 0], [t + .3, -70, "out"]]); E.K(h, "s", [[t, .4], [t + .12, 1.2, "back"], [t + .3, .8]]);
  };
  for (let i = 0; i < 12; i++) {
    const [img, w, h] = queue[i % queue.length];
    const el = person(img, w, h, 400, 1);
    kissers.push(el);
    const t = KT0 + i * KD;
    E.K(el, "o", [[t - .01, 0], [t, 1], [t + KD - .02, 1], [t + KD - .01, 0]]);
    E.K(el, "x", [[t, 420], [t + .07, 0, "out"], [t + KD - .06, 0], [t + KD, 520, "in"]]);
    E.K(el, "r", [[t + .04, 0], [t + .09, -16, "out"], [t + .15, -6], [t + .19, -16, "out"], [t + .25, -4]]);
    E.S(t + .1, "smack", .9); E.S(t + .19, "smack", .8);
    heart(t + .1, 420, 760); heart(t + .19, 400, 700);
  }
  // ---------------- Otto's body motion ----------------
  E.F(t => {
    const f = at(ottoFace, t);
    oimg.forEach((im, i) => { im.style.opacity = OT[i] === f ? 1 : 0; });
    let r = 0, y = 0, sx = 1;
    if (t < .35) r = Math.sin(t * 16) * 2;                                               // the wave
    if (t >= KT0 && t < 9.0) { const k = (t - KT0) / (9 - KT0); r = Math.sin(t * 38) * (2 + 2 * k); y = Math.abs(Math.sin(t * 22)) * -6; }
    if (t >= 9.4 && t < 9.95) r = -6;
    if (t >= 11.4) r = Math.sin(t * 60) * .8;                                           // eye-twitch tremble
    ottoI.style.transform = `translateY(${y}px) rotate(${r}deg) scaleX(${sx})`;
  });

  // ---------------- Dona's face ----------------
  E.F(t => {
    const f = at([[0, "d_knowing"], [1.2, "d_smirk"], [2.3, "d_knowing"]], t);
    dimg.forEach((im, i) => { im.style.opacity = DT[i] === f ? 1 : 0; });
  });

  // ---------------- time: the window and the clock pill ----------------
  const minutes = t => {
    if (t < 1.5) return 22 * 60;
    if (t < 2.6) return 22 * 60 + 40;
    if (t < 4.0) return 23 * 60 + 50;
    if (t < KT0) return 25 * 60 + 10;
    if (t < 9.0) return 25 * 60 + 10 + (30 * 60 + 30 - (25 * 60 + 10)) * ((t - KT0) / (9 - KT0));
    return 30 * 60 + 30;
  };
  const pill = E.el(S.el, "abs", `left:100px;top:352px;display:flex;align-items:center;gap:14px;background:${C.ink};color:#fff;font-weight:900;font-size:58px;padding:.08em .36em .1em .18em;border-radius:.3em;white-space:nowrap;z-index:7`);
  const face = E.el(pill, "", "position:relative;width:52px;height:52px;border-radius:50%;background:#fff");
  const hh = E.el(face, "abs", `left:24px;top:12px;width:4px;height:16px;background:${C.ink};border-radius:2px;transform-origin:2px 14px`);
  const mh = E.el(face, "abs", `left:24px;top:5px;width:4px;height:23px;background:${C.coral};border-radius:2px;transform-origin:2px 21px`);
  const clockTx = E.el(pill, "", "", "22:00");
  const kiss = E.el(S.el, "abs", `left:400px;top:352px;display:inline-block;background:#ff5d7a;color:#fff;font-weight:900;font-size:58px;padding:.08em .36em .1em;border-radius:.3em;white-space:nowrap;z-index:7;opacity:0;transform-origin:0 50%`, "KISSES 2");
  E.K(kiss, "o", [[KT0, 0], [KT0 + .1, 1], [HOME - .01, 1], [HOME, 0]]);
  for (let i = 0; i < 12; i++) E.K(kiss, "s", [[KT0 + i * KD + .1, 1.25], [KT0 + i * KD + .24, 1, "out"]]);
  E.F(t => {
    const m = minutes(t), H = Math.floor(m / 60) % 24, M = Math.floor(m % 60);
    const s = `${String(H).padStart(2, "0")}:${String(M).padStart(2, "0")}`; if (clockTx.textContent !== s) clockTx.textContent = s;
    hh.style.transform = `rotate(${(m / 720) * 360}deg)`; mh.style.transform = `rotate(${(m / 60) * 360}deg)`;
    pill.style.opacity = t >= HOME ? 0 : 1;
    const n = Math.max(1, Math.min(12, Math.floor((t - KT0 - .1) / KD) + 1)) * 2;
    const ks = "KISSES " + n; if (kiss.textContent !== ks) kiss.textContent = ks;
    // sky: night -> dawn -> morning over the montage
    const u = Math.min(1, Math.max(0, (t - KT0) / (9 - KT0)));
    const lerp = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
    const top = u < .6 ? lerp([16, 24, 58], [92, 60, 120], u / .6) : lerp([92, 60, 120], [255, 170, 110], (u - .6) / .4);
    const bot = u < .6 ? lerp([34, 48, 96], [220, 110, 110], u / .6) : lerp([220, 110, 110], [255, 214, 150], (u - .6) / .4);
    sky.style.background = `linear-gradient(180deg,rgb(${top}),rgb(${bot}))`;
    moon.style.opacity = 1 - Math.min(1, u * 1.6);
    sun.style.transform = `translateY(${-u * 190}px)`;
  });
  E.S(1.5, "tick", .8); E.S(2.6, "tick", .8); E.S(4.0, "tick", .8);
  E.S(KT0, "riser", .45);
  E.S(9.0, "sparkle", .9); E.S(9.05, "ding", .6); E.flash(9.0, "#ffe2a6", .35, .3);
  E.S(9.36, "swish", .8); E.S(9.95, "slam", .9); E.shake(9.95, 12, .25);

  // ---------------- home: a different room, the phone ----------------
  const home = E.el(stage, "abs", "inset:0;opacity:0;z-index:1");
  E.el(home, "abs", "left:0;top:0;width:1080px;height:1920px;background:#cfd8e3");
  E.el(home, "abs", `left:0;top:${FLOOR}px;width:1080px;height:260px;background:#7b8796`);
  E.el(home, "abs", "left:600px;top:1180px;width:420px;height:240px;border-radius:40px 40px 10px 10px;background:#4e6a8a");  // sofa back
  E.el(home, "abs", "left:570px;top:1380px;width:480px;height:280px;border-radius:30px;background:#5f7ea1");
  E.K(home, "o", [[HOME - .01, 0], [HOME, 1]]);
  E.K(hall, "o", [[HOME - .01, 1], [HOME, 0]]);
  E.S(HOME + .05, "buzz", 1); E.S(HOME + .7, "buzz", .8);

  // ---------------- speech bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false, label = "") => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const box = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 76 : 58}px;line-height:1.02;letter-spacing:-.02em;color:${C.ink};text-align:center`, (label ? `<div style="font-size:30px;letter-spacing:.14em;color:${C.coralD};margin-bottom:8px">${label}</div>` : "") + html);
    E.el(box, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .1, 1], [t1, 0]]);
    E.S(t0 + .02, "pop", .7);
    return b;
  };
  const sub = s => `<div style="font-size:40px;font-weight:800;color:${C.mute};margin-top:6px;letter-spacing:0">${s}</div>`;
  bubble("Ok, I'm going!", 60, 460, 470, "l", .35, 1.2);
  bubble("Wait! Take some cake!", 470, 450, 520, "r", 1.2, 2.3);
  bubble("Did you see my holiday photos?", 450, 440, 560, "r", 2.45, 3.7);
  bubble("And how's your mother?", 450, 450, 540, "r", 3.85, 4.9);
  bubble("Ok… bye!", 60, 470, 380, "l", 4.9, 5.55);
  bubble(`Home safe?${sub("(chegaste bem?)")}`, 420, 440, 560, "r", HOME + .2, 11.4, true, "GRANDMA · CALLING");
  bubble("Oh, one more thing…", 420, 460, 560, "r", 11.4, 12.9, false, "GRANDMA · CALLING");
  E.K(stage, "s", [[11.4, 1], [12.9, 1.12, "io"]]);
  E.S(11.45, "nope", .7);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "The Portuguese *goodbye*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[12.95, 1], [13.2, 1.18, "out"], [13.55, 1, "io"]]);
}
