// EP.20 "Have you met a nice girl?" — "So… any girlfriend?" "Not yet." Next visit: a photo of the neighbour's granddaughter
// ("She's a NURSE!"). Next visit: the doorbell, and there she is — "Oh! What a coincidence!" Otto: "Grandma! I HAVE a girlfriend!"
// Grandma produces a pile of knitted baby clothes: "Finally! I started these in 2019!" Voices and effects: ElevenLabs.
export const meta = {
  id: "ep20-nicegirl", date: "2026-10-13",
  images: {
    o_excited: "characters/cutouts/otto-casual_excited.webp", o_betrayed: "characters/cutouts/otto-casual_betrayed.webp", o_awk: "characters/cutouts/otto-casual_awkward.webp",
    d_smirk: "characters/cutouts/dona_smirk.webp", d_phone: "characters/cutouts/dona_showphone.webp", d_knowing: "characters/cutouts/dona_knowing.webp", d_baby: "characters/cutouts/dona_baby.webp",
    zoe: "characters/cutouts/zoe_default.webp", marta: "characters/cutouts/marta_wave.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 60, seed: 201, prog: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]] });
  const DUR = 15.8;
  const S = E.scene("room", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FLOOR = 1760;
  const V2 = 3.45, V3 = 6.2, HAVE = 9.0, BABY = 11.55;

  // ---------------- the living room with the front door on the right ----------------
  const room = E.el(S.el, "abs", "inset:0");
  E.el(room, "abs", "left:0;top:0;width:1080px;height:1920px;background:#f3e3cf");
  E.el(room, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:radial-gradient(circle at 30px 30px,rgba(210,140,120,.2) 6px,transparent 7px);background-size:70px 70px");
  E.el(room, "abs", `left:0;top:${FLOOR}px;width:1080px;height:200px;background:#a8764c`);
  E.el(room, "abs", "left:90px;top:560px;width:260px;height:200px;border:14px solid #caa36a;background:linear-gradient(180deg,#9fd3f0,#f6e7b6)");       // a painting
  // a wall calendar that flips at every visit
  const cal = E.el(room, "abs", "left:420px;top:560px;width:200px;height:230px;border-radius:10px;background:#fff;box-shadow:0 6px 14px rgba(0,0,0,.15);overflow:hidden");
  E.el(cal, "abs", "left:0;top:0;width:100%;height:60px;background:#d9482e");
  const calN = E.el(cal, "abs", "left:0;top:70px;width:100%;text-align:center;font-weight:900;font-size:110px;color:#333", "3");
  const calM = E.el(cal, "abs", "left:0;top:10px;width:100%;text-align:center;font-weight:900;font-size:36px;color:#fff;letter-spacing:.1em", "MAY");
  E.F(t => { const [m, d] = at([[0, ["MAY", "3"]], [V2, ["JUN", "7"]], [V3, ["JUL", "12"]], [HAVE, ["AUG", "9"]]], t); if (calN.textContent !== d) { calN.textContent = d; calM.textContent = m; } });
  E.K(cal, "sy", [[0, 1], ...[V2, V3, HAVE].flatMap(t => [[t - .01, 1], [t, .1], [t + .25, 1, "back"]])]);
  [V2, V3, HAVE].forEach(t => E.S(t, "swish", .6));
  // the front door (right)
  E.el(room, "abs", `left:790px;top:620px;width:300px;height:${FLOOR - 620}px;background:#3b2412`);
  const outside = E.el(room, "abs", `left:806px;top:636px;width:274px;height:${FLOOR - 636}px;background:linear-gradient(180deg,#9fd3f0,#dff2fb)`);
  E.el(room, "abs", `left:806px;top:${FLOOR - 160}px;width:274px;height:160px;background:#9bbf7a`);
  const door = E.el(room, "abs", `left:806px;top:636px;width:274px;height:${FLOOR - 636}px;background:#7a4a26;transform-origin:100% 50%;z-index:1`);
  E.el(door, "abs", "left:26px;top:40px;width:222px;height:360px;border:8px solid #6a3e1e;border-radius:8px");
  E.el(door, "abs", "left:26px;top:460px;width:222px;height:360px;border:8px solid #6a3e1e;border-radius:8px");
  E.el(door, "abs", "left:30px;top:470px;width:28px;height:28px;border-radius:50%;background:#e2b54a");
  const OPEN = V3 + .5, SHUT = HAVE + .2;
  E.K(door, "sx", [[OPEN, 1], [OPEN + .3, .1, "out"], [SHUT, .1], [SHUT + .25, 1, "in"]]);
  // Marta on the doorstep
  const MS = .86;
  const marta = E.el(room, "abs", `left:790px;top:${FLOOR - 1031 * MS + 8}px;width:${533 * MS}px;height:${1031 * MS}px;z-index:0;opacity:0`);
  E.img(marta, "marta", `width:${533 * MS}px;height:${1031 * MS}px`);
  E.K(marta, "o", [[OPEN - .01, 0], [OPEN, 1], [SHUT + .25, 1], [SHUT + .26, 0]]);
  E.K(marta, "x", [[OPEN + .2, 0], [OPEN + .8, -100, "io"], [SHUT - .6, -100], [SHUT - .1, 0, "io"]]);            // she steps in, then out again
  marta.style.zIndex = 4;
  const mb = []; for (let t = OPEN; t < SHUT; t += .6) mb.push([t, 0, "io"], [t + .3, -6, "io"]);
  E.K(marta, "y", mb);

  // ---------------- Otto and grandma ----------------
  const OS = .95;
  const otto = E.el(room, "abs", `left:-10px;top:${FLOOR - 1078 * OS + 10}px;width:${625 * OS}px;height:${1078 * OS}px;z-index:2;transform-origin:50% 100%`);
  const O = [["o_excited", 625], ["o_betrayed", 625], ["o_awk", 488]];
  const oim = O.map(([n, w]) => E.img(otto, n, `position:absolute;left:0;bottom:0;width:${w * OS}px;height:${1078 * OS}px`));
  E.F(t => {
    const f = at([[0, "o_excited"], [1.5, "o_awk"], [V2 + .8, "o_betrayed"], [V3 + .9, "o_awk"], [HAVE, "o_excited"], [BABY + .2, "o_betrayed"]], t);
    oim.forEach((im, i) => { im.style.opacity = O[i][0] === f ? 1 : 0; });
    otto.style.transform = t >= HAVE && t < HAVE + .35 ? `translateY(${-Math.sin((t - HAVE) / .35 * Math.PI) * 30}px)` : "none";
  });
  const DS = .9;
  const dona = E.el(room, "abs", `left:380px;top:${FLOOR - 1024 * DS + 10}px;width:${700 * DS}px;height:${1024 * DS}px;z-index:3`);
  const DT = ["d_smirk", "d_phone", "d_knowing", "d_baby"];
  const dim = DT.map(n => E.img(dona, n, `position:absolute;left:0;bottom:0;height:${1020 * DS}px;width:auto`));
  E.F(t => { const f = at([[0, "d_smirk"], [V2, "d_phone"], [V3, "d_knowing"], [V3 + .9, "d_smirk"], [HAVE + .1, "d_knowing"], [BABY, "d_baby"]], t); dim.forEach((im, i) => { im.style.opacity = DT[i] === f ? 1 : 0; }); });
  const sway = []; for (let t = 0; t <= DUR; t += .8) sway.push([t, (Math.round(t / .8) % 2) ? -7 : 0, "io"]);
  E.K(dona, "y", sway);
  E.K(dona, "x", [[OPEN + .2, 0], [OPEN + .8, -130, "io"], [SHUT - .6, -130], [SHUT - .1, 0, "io"]]);

  // the photo she shows (a big card popping out of her phone)
  const card = E.el(S.el, "abs", "left:520px;top:520px;width:380px;height:470px;border-radius:26px;background:#fff;box-shadow:0 16px 40px rgba(0,0,0,.25);overflow:hidden;z-index:6;opacity:0;transform-origin:10% 90%");
  const ph = E.el(card, "abs", "left:20px;top:20px;width:340px;height:340px;border-radius:18px;overflow:hidden;background:linear-gradient(180deg,#ffd9e4,#ffeef3)");
  E.img(ph, "zoe", "position:absolute;left:-110px;top:-10px;width:560px;height:auto");
  E.el(card, "abs", "left:0;right:0;top:372px;text-align:center;font-weight:900;font-size:44px;color:#333", "Sofia, 29");
  const tag = E.el(card, "abs", `left:112px;top:420px;background:${C.mint};color:${C.ink};font-weight:900;font-size:32px;padding:2px 14px;border-radius:12px`, "NURSE ✓");
  E.K(card, "o", [[V2 + .3, 0], [V2 + .4, 1], [V3 - .1, 1], [V3, 0]]);
  E.K(card, "s", [[V2 + .3, .2], [V2 + .65, 1, "back"]]);
  E.K(card, "r", [[V2 + .3, -18], [V2 + .65, -4, "out"]]);
  // hearts around the reveal
  for (let i = 0; i < 6; i++) {
    const t = BABY + .15 + i * .12, h = E.el(S.el, "abs", `left:${380 + (i % 3) * 170}px;top:${1000 + (i % 2) * 90}px;width:60px;height:56px;z-index:7;opacity:0`);
    h.innerHTML = `<svg viewBox="0 0 32 30" width="60" height="56"><path d="M16 29 C6 21 0 15 0 8.5 C0 3.8 3.6 0 8.2 0 C11.2 0 14 1.8 16 4.6 C18 1.8 20.8 0 23.8 0 C28.4 0 32 3.8 32 8.5 C32 15 26 21 16 29Z" fill="#ff5d7a"/></svg>`;
    E.K(h, "o", [[t, 0], [t + .1, 1], [t + 1.1, 0]]); E.K(h, "y", [[t, 0], [t + 1.1, -260, "out"]]);
  }
  const rays = E.el(room, "abs", "left:180px;top:620px;width:900px;height:900px;border-radius:50%;background:repeating-conic-gradient(rgba(255,230,140,.55) 0 12deg,rgba(255,230,140,0) 12deg 24deg);opacity:0;z-index:2");
  E.K(rays, "o", [[BABY, 0], [BABY + .3, 1]]); E.K(rays, "r", [[BABY, 0], [DUR, 60]]);
  dona.style.zIndex = 3;

  // ---------------- sound ----------------
  E.clip(.3, "voices/ep20/g_girlfriend.wav");
  E.clip(2.4, "voices/ep20/o_notyet.wav");
  E.clip(V2 + .2, "voices/ep20/g_nurse.wav");
  E.clip(V3, "sfx/doorbell.wav", { vol: .8 });
  E.clip(OPEN + .3, "voices/ep20/g_coincidence.wav");
  E.clip(HAVE + .1, "voices/ep20/o_have.wav", { vol: 1.1 });
  E.clip(BABY, "sfx/angel-choir.wav", { vol: .7 });
  E.clip(BABY + .35, "voices/ep20/g_finally.wav");
  E.S(OPEN, "creak", .4); E.S(SHUT + .25, "slam", .7); E.shake(SHUT + .25, 10, .2);

  // ---------------- bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const box = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 72 : 58}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(box, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("So… any girlfriend?", 380, 440, 560, "r", .3, 2.4);
  bubble("Not yet, grandma.", 30, 620, 480, "l", 2.4, V2);
  bubble("She's a NURSE!", 100, 1000, 440, "r", V2 + .9, V3 - .05, true);
  bubble("Oh! What a coincidence!", 360, 440, 620, "r", OPEN + .3, HAVE - .1, true);
  bubble("Grandma! I HAVE a girlfriend!", 30, 560, 640, "l", HAVE + .1, BABY);
  bubble("Finally! I started these in 2019!", 330, 430, 690, "r", BABY + .35, DUR - .7, true);
  const visit = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:52px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7`, "VISIT 1");
  E.F(t => { const v = "VISIT " + at([[0, 1], [V2, 2], [V3, 3], [HAVE, 4]], t); if (visit.textContent !== v) visit.textContent = v; });
  E.K(visit, "s", [[0, 1], ...[V2, V3, HAVE].flatMap(t => [[t - .01, 1], [t, 1.3], [t + .2, 1, "back"]])]);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Have you met a *nice girl?*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[15.0, 1], [15.25, 1.18, "out"], [15.6, 1, "io"]]);
}
