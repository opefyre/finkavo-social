// EP.15 "Tech support for grandma" — split-screen call: "THE INTERNET IS BROKEN!" Otto sprints across Lisbon (trams, hills,
// pigeons). The problem: the TV is on the wrong input. One button, fixed — "You're a genius!" Then she pulls the sheet off the
// mystery lump in the corner: a printer. "Since you're here…" Universal joke. Paced per the reel-pacing note.
export const meta = {
  id: "ep15-techsupport", date: "2026-10-08",
  images: {
    o_phone: "characters/cutouts/otto-coat_phone.webp", o_run: "characters/cutouts/otto-coat_run.webp", o_wave: "characters/cutouts/otto-coat_wave.webp",
    o_remote: "characters/cutouts/otto-coat_remote.webp", o_defeated: "characters/cutouts/otto-coat_defeated.webp",
    d_phone: "characters/cutouts/dona_phone.webp", d_offended: "characters/cutouts/dona_offended.webp", d_knowing: "characters/cutouts/dona_knowing.webp", d_smirk: "characters/cutouts/dona_smirk.webp",
    p_printer: "characters/props/printer.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 118, root: 57, seed: 151, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [9, 12, 16]] });
  const DUR = 15.0;
  const S = E.scene("all", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FLOOR = 1760;
  const RUN = 2.9, ARRIVE = 5.9, FIX = 8.9, REVEAL = 10.9;
  const scene = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };

  // ================= 1) the call, split screen =================
  const A = scene(0, RUN);
  E.el(A, "abs", "left:0;top:0;width:540px;height:1920px;background:#cfd8e3");
  E.el(A, "abs", "left:540px;top:0;width:540px;height:1920px;background:#f1dfc7");
  E.el(A, "abs", `left:0;top:${FLOOR}px;width:540px;height:200px;background:#7b8796`);
  E.el(A, "abs", `left:540px;top:${FLOOR}px;width:540px;height:200px;background:#b07d52`);
  E.el(A, "abs", "left:532px;top:0;width:16px;height:1920px;background:#fff;z-index:3");
  const OA = .8;
  const oA = E.el(A, "abs", `left:-40px;top:${FLOOR - 1081 * OA + 10}px;width:${629 * OA}px;height:${1081 * OA}px;z-index:2`);
  E.img(oA, "o_phone", `width:${629 * OA}px;height:${1081 * OA}px`);
  const dA = E.el(A, "abs", `left:520px;top:${FLOOR - 1023 * OA + 10}px;width:${661 * OA}px;height:${1023 * OA}px;z-index:2;transform-origin:50% 100%`);
  E.img(dA, "d_phone", `width:${661 * OA}px;height:${1023 * OA}px`);
  const jit = []; for (let t = 0; t < RUN; t += .12) jit.push([t, (Math.round(t / .12) % 2) ? 2.5 : -2.5]);
  E.K(dA, "r", jit);                                                                                     // she is shaking with panic (frame-0 motion)
  E.S(.05, "buzz", .8);

  // ================= 2) the run across Lisbon =================
  const B = scene(RUN, ARRIVE);
  E.el(B, "abs", "left:0;top:0;width:1080px;height:1920px;background:linear-gradient(180deg,#8fcdf0,#dff2fb)");
  const street = E.el(B, "abs", "left:0;top:0;width:4200px;height:1920px;transform-origin:540px 1700px");
  const facade = ["#f4c7a1", "#f7e3a3", "#bfe3d3", "#f2b8b0", "#c9d7f2", "#f6d0e0", "#e8d9c4"];
  for (let i = 0; i < 14; i++) {
    const x = i * 300, h = 900 + (i * 131) % 300, top = 1500 - h, col = facade[i % 7];
    const b = E.el(street, "abs", `left:${x}px;top:${top}px;width:300px;height:${h}px;background:${col};border-left:4px solid rgba(0,0,0,.06)`);
    E.el(b, "abs", "left:-6px;top:-30px;width:312px;height:40px;background:#c0643f;border-radius:6px");        // roof edge
    for (let r = 0; r < Math.floor((h - 160) / 170); r++) for (let c = 0; c < 2; c++) {
      E.el(b, "abs", `left:${50 + c * 120}px;top:${60 + r * 170}px;width:80px;height:110px;background:#3d5a73;border:8px solid #fff;border-radius:40px 40px 4px 4px`);
      if (r % 2 === 0) E.el(b, "abs", `left:${40 + c * 120}px;top:${170 + r * 170}px;width:100px;height:14px;background:#2d3b45`);   // little balcony
    }
    if (i % 3 === 1) E.el(b, "abs", `left:0;top:${h - 260}px;width:300px;height:260px;background-image:repeating-linear-gradient(45deg,#2f6db5 0 10px,#fff 10px 30px);opacity:.55`);   // azulejo band
  }
  E.el(street, "abs", "left:0;top:1500px;width:4200px;height:420px;background:#bdb3a4;background-image:radial-gradient(circle at 20px 20px,rgba(0,0,0,.12) 8px,transparent 9px);background-size:40px 40px");   // calçada
  E.el(street, "abs", "left:0;top:1600px;width:4200px;height:10px;background:#8a8171");
  E.el(street, "abs", "left:0;top:1680px;width:4200px;height:10px;background:#8a8171");
  E.K(street, "x", [[RUN, 0], [ARRIVE, -2900, "lin"]]);
  E.K(street, "r", [[RUN, 0], [4.1, 0], [4.4, -7, "io"], [5.2, -7], [5.5, 0, "io"]]);                                  // up a Lisbon hill
  // the yellow tram, going the other way
  const tram = E.el(B, "abs", "left:1200px;top:1230px;width:760px;height:380px;z-index:1");
  E.el(tram, "abs", "left:0;top:40px;width:760px;height:300px;border-radius:40px 40px 16px 16px;background:#ffcf2e;box-shadow:inset 0 -40px 0 #e0a800");
  for (let i = 0; i < 5; i++) E.el(tram, "abs", `left:${50 + i * 140}px;top:80px;width:110px;height:110px;border-radius:14px;background:#3d5a73;border:6px solid #fff6d0`);
  E.el(tram, "abs", "left:330px;top:0;width:100px;height:44px;border-radius:10px;background:#3b3b3b");
  E.el(tram, "abs", "left:320px;top:-160px;width:6px;height:170px;background:#3b3b3b;transform:rotate(20deg)");
  E.el(tram, "abs", "left:620px;top:95px;font-weight:900;font-size:56px;color:#3b3b3b", "28");
  E.K(tram, "x", [[3.4, 0], [4.9, -2300, "lin"]]);
  E.S(3.5, "ding", .7); E.S(3.55, "whoosh", .8);
  // pigeons scatter
  for (let i = 0; i < 5; i++) {
    const p = E.el(B, "abs", `left:${620 + i * 60}px;top:${1540 - (i % 2) * 30}px;width:60px;height:40px;border-radius:50%;background:#8d96a3;z-index:3`);
    E.el(p, "abs", "left:40px;top:-12px;width:26px;height:26px;border-radius:50%;background:#8d96a3");
    E.K(p, "x", [[4.3, 0], [5.0, (i - 2) * 260, "out"]]); E.K(p, "y", [[4.3, 0], [5.0, -700 - i * 60, "out"]]);
  }
  E.S(4.3, "swish", .7); E.S(4.35, "pop", .5);
  const OR = .95;
  const runner = E.el(B, "abs", `left:140px;top:${1610 - 956 * OR}px;width:${813 * OR}px;height:${956 * OR}px;z-index:2`);
  E.img(runner, "o_run", `width:${813 * OR}px;height:${956 * OR}px`);
  const bob = []; for (let t = RUN; t < ARRIVE; t += .18) bob.push([t, 0, "out"], [t + .09, -26, "in"]);
  E.K(runner, "y", bob);
  for (let t = RUN + .1; t < ARRIVE; t += .36) E.S(t, "tick", .35);                                                   // footsteps

  // ================= 3) grandma's living room =================
  const Cc = scene(ARRIVE, DUR);
  E.el(Cc, "abs", "left:0;top:0;width:1080px;height:1920px;background:#dfe8d6");
  E.el(Cc, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:repeating-linear-gradient(90deg,rgba(90,120,80,.08) 0 36px,transparent 36px 72px)");
  E.el(Cc, "abs", `left:0;top:${FLOOR}px;width:1080px;height:200px;background:#a8764c`);
  // the TV on the wall
  const tv = E.el(Cc, "abs", "left:620px;top:540px;width:420px;height:290px;border-radius:14px;background:#111;border:12px solid #2b2b2b;overflow:hidden;z-index:1");
  const noSig = E.el(tv, "abs", "inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#1a2a6c;color:#fff;font-weight:900", `<div style="font-size:52px">NO SIGNAL</div><div style="font-size:30px;opacity:.8;margin-top:8px">HDMI 2</div>`);
  const novela = E.el(tv, "abs", "inset:0;opacity:0;background:linear-gradient(180deg,#ff9a5a,#ffd27a 60%,#f7b267)");
  E.el(novela, "abs", "left:110px;top:90px;width:90px;height:190px;border-radius:45px 45px 0 0;background:#3b2a3a");
  E.el(novela, "abs", "left:196px;top:100px;width:90px;height:180px;border-radius:45px 45px 0 0;background:#2a2a3b");
  E.el(novela, "abs", "left:170px;top:40px;width:50px;height:50px;border-radius:50%;background:#ff5d7a");
  E.K(noSig, "o", [[FIX - .01, 1], [FIX, 0]]); E.K(novela, "o", [[FIX - .01, 0], [FIX, 1]]);
  E.K(tv, "s", [[FIX, 1.06], [FIX + .2, 1, "back"]]);
  E.S(FIX, "sparkle", .9); E.flash(FIX, "#ffffff", .2, .15);
  // the mystery lump under a sheet (on a little table) — it becomes the twist
  const side = E.el(Cc, "abs", `left:40px;top:${FLOOR - 200}px;width:420px;height:200px;z-index:4`);
  E.el(side, "abs", "left:0;top:0;width:420px;height:26px;border-radius:8px;background:#7a4a26");
  E.el(side, "abs", "left:30px;top:26px;width:22px;height:174px;background:#6a3e1e");
  E.el(side, "abs", "left:368px;top:26px;width:22px;height:174px;background:#6a3e1e");
  const pr = E.el(Cc, "abs", `left:30px;top:${FLOOR - 200 - 318 * .95 + 8}px;width:${445 * .95}px;height:${318 * .95}px;z-index:4;opacity:0`);
  E.img(pr, "p_printer", `width:${445 * .95}px;height:${318 * .95}px`);
  E.K(pr, "o", [[REVEAL - .01, 0], [REVEAL, 1]]);
  const sheet = E.el(Cc, "abs", `left:10px;top:${FLOOR - 200 - 330}px;width:460px;height:340px;border-radius:120px 140px 20px 20px;background:linear-gradient(180deg,#ffffff,#e6e6e6);box-shadow:inset -20px -10px 0 rgba(0,0,0,.05);z-index:5`);
  for (let i = 0; i < 4; i++) E.el(sheet, "abs", `left:${70 + i * 90}px;top:${120 + (i % 2) * 20}px;width:10px;height:200px;border-radius:5px;background:rgba(0,0,0,.06)`);
  E.K(sheet, "y", [[REVEAL, 0], [REVEAL + .45, -1100, "out"]]); E.K(sheet, "x", [[REVEAL, 0], [REVEAL + .45, 500, "out"]]); E.K(sheet, "r", [[REVEAL, 0], [REVEAL + .45, 40]]);
  E.K(sheet, "o", [[REVEAL + .3, 1], [REVEAL + .45, 0]]);
  E.S(REVEAL, "whoosh", 1); E.S(REVEAL + .1, "ding", .8);

  // grandma, then Otto walks in
  const DS = .88;
  const dona = E.el(Cc, "abs", `left:330px;top:${FLOOR - 1024 * DS + 10}px;width:${700 * DS}px;height:${1024 * DS}px;z-index:2`);
  const DT = ["d_offended", "d_knowing", "d_smirk"];
  const dim = DT.map(n => E.img(dona, n, `position:absolute;left:0;bottom:0;height:${1018 * DS}px;width:auto`));
  E.F(t => { const f = at([[0, "d_offended"], [FIX + .1, "d_knowing"], [REVEAL - .3, "d_smirk"]], t); dim.forEach((im, i) => { im.style.opacity = DT[i] === f ? 1 : 0; }); });
  E.K(dona, "x", [[7.6, 0], [8.0, 250, "io"]]);                                                             // she steps aside for the expert
  const OS = .9, x0 = -80;
  const otto = E.el(Cc, "abs", `left:${x0}px;top:${FLOOR - 1081 * OS + 10}px;width:${760 * OS}px;height:${1081 * OS}px;z-index:3`);
  const O = [["o_wave", 629, 1081, 0, 0], ["o_remote", 725, 1079, 24, 2], ["o_defeated", 725, 1079, 24, 2]];
  const oim = O.map(([n, w, h, dx, dy]) => E.img(otto, n, `position:absolute;left:${dx * OS}px;top:${dy * OS}px;width:${w * OS}px;height:${h * OS}px`));
  E.F(t => { const f = at([[0, "o_wave"], [8.3, "o_remote"], [REVEAL + .2, "o_defeated"]], t); oim.forEach((im, i) => { im.style.opacity = O[i][0] === f ? 1 : 0; }); });
  E.K(otto, "x", [[ARRIVE, -600], [ARRIVE + .35, 0, "out"]]);
  E.S(ARRIVE, "swish", .8);
  E.S(FIX - .05, "tick", 1);

  // ---------------- speech bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false, label = "") => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const box = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 76 : 60}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, (label ? `<div style="font-size:30px;letter-spacing:.14em;color:${C.coralD};margin-bottom:8px">${label}</div>` : "") + html);
    E.el(box, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    E.S(t0 + .02, "pop", .6);
    return b;
  };
  bubble("THE INTERNET IS BROKEN!", 380, 560, 640, "r", .25, 2.0, true, "GRANDMA · CALLING");
  bubble("On my way!", 60, 640, 440, "l", 2.0, RUN - .05);
  bubble("It's been like this for THREE DAYS!", 60, 600, 560, "r", ARRIVE + .4, 8.2);
  bubble("You're a genius!", 60, 620, 560, "r", FIX + .25, REVEAL - .2, true);
  bubble("Since you're here…", 60, 620, 560, "r", REVEAL + .3, 14.0, true);
  E.S(ARRIVE + .45, "nope", .5);

  // ---------------- the clock (only during the run) ----------------
  const clock = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:56px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7;opacity:0`, "20:03");
  E.K(clock, "o", [[RUN, 0], [RUN + .1, 1], [ARRIVE - .05, 1], [ARRIVE, 0]]);
  E.F(t => { const m = 20 * 60 + 3 + Math.round(38 * Math.min(1, Math.max(0, (t - RUN) / (ARRIVE - RUN)))); const s = `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`; if (clock.textContent !== s) clock.textContent = s; });

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Tech support for *grandma*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[14.1, 1], [14.35, 1.18, "out"], [14.7, 1, "io"]]);
}
