// EP.30 "Derby night at the café" — 89th minute, 0-0. A café full of regulars in green scarves, biting their nails. Otto, in a
// red scarf, tries to blend in. The commentator: "Cruzamento… cabeceia… GOLO!" — for the red team. Otto jumps: "GOOOAL! YES!"
// The whole café turns and stares. A cup clinks. "…Sorry." The waiter: "Your bill." WRONG SCARF.
// Voiced (ElevenLabs: Portuguese commentator, Otto, the waiter) with real café/stadium effects. No club names.
export const meta = {
  id: "ep30-derby", date: "2026-10-23",
  images: {
    o_oops: "characters/cutouts/otto-casual_oops.webp", o_goal: "characters/cutouts/otto-casual_goal.webp",
    f_nervous: "characters/cutouts/fans_nervous.webp", f_stare: "characters/cutouts/fans_stare.webp",
    waiter: "characters/cutouts/carimbo_deadpan.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 96, root: 55, seed: 301, prog: [[0, 3, 7], [5, 8, 12], [7, 10, 14], [3, 7, 10]] });
  const DUR = 14.6;
  const S = E.scene("cafe", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const CROSS = 1.6, GOAL = 4.4, TURN = 5.0, SILENCE = 7.6, SORRY = 9.0, BILL = 10.5, STAMP = 12.0;

  // ---------------- the café ----------------
  const stage = E.el(S.el, "abs", "inset:0;transform-origin:540px 1300px");
  E.el(stage, "abs", "left:-40px;top:-40px;width:1160px;height:2000px;background:#e9d6b8");
  E.el(stage, "abs", "left:-40px;top:-40px;width:1160px;height:2000px;background-image:repeating-linear-gradient(90deg,rgba(120,80,40,.08) 0 60px,transparent 60px 120px)");
  // a shelf of bottles
  E.el(stage, "abs", "left:-40px;top:1010px;width:1160px;height:18px;background:#7a4a26");
  for (let i = 0; i < 16; i++) E.el(stage, "abs", `left:${i * 72}px;top:${900 + (i % 3) * 10}px;width:34px;height:${110 - (i % 3) * 10}px;border-radius:14px 14px 4px 4px;background:${["#2f8f5b", "#8a2b2b", "#c89b3c", "#3d5a73"][i % 4]};opacity:.85`);
  // the TV on the wall
  const tv = E.el(stage, "abs", "left:180px;top:450px;width:720px;height:405px;border-radius:14px;background:#111;border:14px solid #2b2b2b;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,.3)");
  const pitch = E.el(tv, "abs", "inset:0;background:repeating-linear-gradient(90deg,#3f9b4a 0 70px,#379043 70px 140px)");
  E.el(pitch, "abs", "left:50%;top:0;width:4px;height:100%;background:rgba(255,255,255,.6)");
  E.el(pitch, "abs", "left:calc(50% - 70px);top:calc(50% - 70px);width:140px;height:140px;border-radius:50%;border:4px solid rgba(255,255,255,.6)");
  E.el(pitch, "abs", "left:606px;top:130px;width:80px;height:140px;border:4px solid rgba(255,255,255,.7);border-right:none");
  const players = [];
  for (let i = 0; i < 10; i++) players.push(E.el(pitch, "abs", `width:22px;height:22px;border-radius:50%;background:${i % 2 ? "#e5484d" : "#2f8f5b"};border:3px solid #fff`));
  const ball = E.el(pitch, "abs", "width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 0 0 2px #333");
  E.F(t => {
    const k = Math.min(1, Math.max(0, (t - CROSS) / (GOAL - CROSS)));
    players.forEach((p, i) => { const bx = 140 + (i * 53) % 420 + k * 120, by = 60 + (i * 71) % 270; p.style.left = (bx + Math.sin(t * 3 + i) * 18) + "px"; p.style.top = (by + Math.cos(t * 2.4 + i) * 14) + "px"; });
    const bx = t < CROSS ? 330 + Math.sin(t * 2) * 60 : t < GOAL ? 330 + (640 - 330) * k : 660, by = t < CROSS ? 190 + Math.cos(t * 3) * 40 : t < GOAL ? 190 - Math.sin(k * Math.PI) * 120 + k * 10 : 200;
    ball.style.left = bx + "px"; ball.style.top = by + "px";
  });
  const bug = E.el(tv, "abs", "left:16px;top:14px;display:flex;gap:10px;align-items:center;background:rgba(0,0,0,.72);color:#fff;font-weight:900;font-size:34px;padding:4px 14px;border-radius:10px");
  E.el(bug, "", "width:22px;height:22px;border-radius:4px;background:#2f8f5b");
  const score = E.el(bug, "", "", "0 - 0");
  E.el(bug, "", "width:22px;height:22px;border-radius:4px;background:#e5484d");
  const clock = E.el(bug, "", "margin-left:10px;color:#ffd43b", "89:00");
  E.F(t => {
    const s = t >= GOAL + .1 ? "0 - 1" : "0 - 0"; if (score.textContent !== s) score.textContent = s;
    const sec = Math.min(59, Math.floor(t * 4)), c = `89:${String(sec).padStart(2, "0")}`; if (clock.textContent !== c) clock.textContent = c;
  });
  const goalBanner = E.el(tv, "abs", "left:0;right:0;top:150px;text-align:center;font-weight:900;font-size:110px;color:#fff;-webkit-text-stroke:8px #e5484d;paint-order:stroke fill;opacity:0", "GOLO!");
  E.K(goalBanner, "o", [[GOAL, 0], [GOAL + .05, 1], [GOAL + 2.4, 1], [GOAL + 2.6, 0]]); E.K(goalBanner, "s", [[GOAL, .3], [GOAL + .3, 1.15, "back"], [GOAL + .5, 1]]);

  // ---------------- the regulars (waist-up, behind the tables) ----------------
  const FS = .86, FW = 1024 * FS, FH = 623 * FS;
  const fans = E.el(stage, "abs", `left:-60px;top:${1730 - FH}px;width:${FW}px;height:${FH}px;z-index:1`);
  const fn = E.img(fans, "f_nervous", `position:absolute;left:0;top:0;width:${FW}px;height:${FH}px`);
  const fs = E.img(fans, "f_stare", `position:absolute;left:0;top:0;width:${FW}px;height:${FH}px`);
  E.F(t => { const st = t >= TURN; fn.style.opacity = st ? 0 : 1; fs.style.opacity = st ? 1 : 0; fans.style.transform = !st ? `translateY(${Math.sin(t * 9) * 3}px)` : "none"; });
  // the table/bar in front
  E.el(stage, "abs", "left:-40px;top:1720px;width:1160px;height:260px;background:#6a3e1e;z-index:2");
  E.el(stage, "abs", "left:-40px;top:1720px;width:1160px;height:22px;background:#8a5a2b;z-index:2");
  E.el(stage, "abs", "left:120px;top:1680px;width:70px;height:46px;border-radius:0 0 18px 18px;background:#fff;border:5px solid #6b3f1d;z-index:3");       // espresso cups
  E.el(stage, "abs", "left:440px;top:1680px;width:70px;height:46px;border-radius:0 0 18px 18px;background:#fff;border:5px solid #6b3f1d;z-index:3");

  // ---------------- Otto (right, red scarf) ----------------
  const OS = .86, OW = 577 * OS, OH = 1078 * OS;
  const otto = E.el(stage, "abs", `left:620px;top:${1880 - OH}px;width:${OW}px;height:${OH}px;z-index:1;transform-origin:50% 100%`);
  const OT = ["o_oops", "o_goal"];
  const oim = OT.map(n => E.img(otto, n, `position:absolute;left:0;top:0;width:${OW}px;height:${OH}px`));
  E.F(t => {
    const f = t >= GOAL + .15 && t < SILENCE ? "o_goal" : "o_oops";
    oim.forEach((im, i) => { im.style.opacity = OT[i] === f ? 1 : 0; });
    let y = 0, sy = 1;
    if (f === "o_goal") y = -Math.abs(Math.sin((t - GOAL) * 7)) * 40;
    if (t >= SILENCE) { const k = Math.min(1, (t - SILENCE) / 3); sy = 1 - .12 * k; }                  // he slowly shrinks
    otto.style.transform = `translateY(${y}px) scaleY(${sy})`;
  });

  // ---------------- the waiter slides in with the bill ----------------
  const WS = .66, WW = 730 * WS, WH = 1094 * WS;
  const waiter = E.el(stage, "abs", `left:-190px;top:${1880 - WH}px;width:${WW}px;height:${WH}px;z-index:3;opacity:0`);
  E.img(waiter, "waiter", `width:${WW}px;height:${WH}px`);
  E.K(waiter, "o", [[BILL - .31, 0], [BILL - .3, 1]]);
  E.K(waiter, "x", [[BILL - .3, -300], [BILL, 0, "out"]]);
  const bill = E.el(stage, "abs", "left:300px;top:1420px;width:130px;height:180px;background:#fff;border-radius:6px;box-shadow:0 6px 14px rgba(0,0,0,.25);z-index:4;opacity:0;padding:16px 12px", `<div style="height:8px;background:#ccc;margin:8px 0"></div><div style="height:8px;background:#ccc;margin:8px 0;width:70%"></div><div style="height:8px;background:#ccc;margin:8px 0"></div><div style="height:12px;background:#e5484d;margin:18px 0 0;width:60%"></div>`);
  E.K(bill, "o", [[BILL + .2, 0], [BILL + .25, 1]]);
  E.K(bill, "x", [[BILL + .2, 0], [BILL + .7, 420, "out"]]); E.K(bill, "y", [[BILL + .2, 0], [BILL + .45, -80, "out"], [BILL + .7, 0, "in"]]);
  E.K(bill, "r", [[BILL + .2, -10], [BILL + .7, 8]]);

  // ---------------- sound ----------------
  for (let t = 0; t < SILENCE - .4; t += 2.9) E.clip(t, "sfx/cafe-tv-crowd.wav", { vol: .45, duck: false, to: Math.min(3, SILENCE - t) });
  E.clip(CROSS, "voices/ep30/c_cross.wav", { vol: .85 });
  E.clip(GOAL, "sfx/stadium-goal.wav", { vol: .6 });
  E.clip(GOAL + .05, "voices/ep30/c_golo.wav", { vol: .8 });
  E.clip(GOAL + .25, "voices/ep30/o_goal.wav", { vol: 1.1 });
  E.clip(SILENCE, "sfx/record-silence.wav", { vol: 1.0 });
  E.clip(SORRY, "voices/ep30/o_sorry.wav", { vol: 1.0 });
  E.clip(BILL + .1, "voices/ep30/w_bill.wav", { vol: 1.0 });
  E.S(TURN, "scratch", .8); E.S(STAMP, "slam", .6);
  E.K(stage, "s", [[SILENCE, 1], [SILENCE + 2.6, 1.08, "io"], [STAMP, 1.08]]);

  // ---------------- text ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${typeof tail === "number" ? tail + "px" : tail === "l" ? "15%" : "85%"} 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:20px 28px 24px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 72 : 56}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `${typeof tail === "number" ? `left:${tail}px` : tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("GOOOAL! YES!", 520, 780, 520, 330, GOAL + .25, SILENCE - .1, true);
  bubble("…Sorry.", 640, 840, 340, 200, SORRY, BILL);
  bubble("Your bill.", 30, 780, 380, 150, BILL + .1, STAMP + .6);
  const silence = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:52px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7;opacity:0`, "SILENCE.");
  E.K(silence, "o", [[SILENCE + .2, 0], [SILENCE + .3, 1], [STAMP - .1, 1], [STAMP, 0]]);
  const sb = E.el(S.el, "abs", "left:60px;top:900px;width:960px;display:flex;justify-content:center;z-index:9");
  const st = E.stamp(sb, "WRONG SCARF.", STAMP, { size: 110, rot: -6, shake: 14 });
  st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Derby night at the *café*", { size: 60, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[13.8, 1], [14.05, 1.18, "out"], [14.4, 1, "io"]]);
}
