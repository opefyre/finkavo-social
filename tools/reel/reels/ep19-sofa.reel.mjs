// EP.19 "Grandma's good sofa" — the guest armchair is wrapped in plastic. Otto sits: SQUEAK. "That… was the sofa." "Mm-hm."
// Two hours and 34°C later he is glued to it and peels off with a long RIIIP. "Have you EVER sat on it?" "Never! It's for GUESTS!"
// Voices: ElevenLabs (branding/voices/ep19); sound effects: ElevenLabs sound generation (branding/sfx). Paced per reel-pacing.
export const meta = {
  id: "ep19-sofa", date: "2026-10-12",
  images: {
    o_sit: "characters/cutouts/otto-armchair_sit.webp", o_sweat: "characters/cutouts/otto-armchair_sweat.webp", o_peel: "characters/cutouts/otto-armchair_peel.webp",
    d_knowing: "characters/cutouts/dona_knowing.webp", d_skeptical: "characters/cutouts/dona_skeptical.webp", d_offended: "characters/cutouts/dona_offended.webp", d_smirk: "characters/cutouts/dona_smirk.webp",
    p_doily: "characters/props/doily.webp", p_dog: "characters/props/porcelain-dog.webp", 
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 96, root: 57, seed: 191, prog: [[0, 4, 7], [5, 9, 12], [2, 5, 9], [7, 11, 14]] });
  const DUR = 16.2;
  const S = E.scene("room", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FLOOR = 1760;
  const SQ1 = 3.35, SQ2 = 6.3, LATER = 7.6, RIP = 9.2, EVER = 10.55, NEVER = 13.3;

  // ---------------- the "good room" ----------------
  const room = E.el(S.el, "abs", "inset:0;transform-origin:360px 1500px");
  E.el(room, "abs", "left:-40px;top:0;width:1160px;height:1920px;background:#efe0d0");
  E.el(room, "abs", "left:-40px;top:0;width:1160px;height:1920px;background-image:repeating-linear-gradient(90deg,rgba(190,120,120,.10) 0 30px,transparent 30px 90px),radial-gradient(circle at 45px 60px,rgba(200,110,120,.22) 7px,transparent 8px);background-size:90px 90px,90px 120px");
  E.el(room, "abs", "left:-40px;top:1180px;width:1160px;height:600px;background:#d8c2a6");
  E.el(room, "abs", "left:-40px;top:1170px;width:1160px;height:14px;background:#a8805a");
  E.el(room, "abs", `left:-40px;top:${FLOOR}px;width:1160px;height:240px;background:#8b5e3c`);
  // a china cabinet with the porcelain dog and a doily, a framed portrait, the fake-fruit bowl on a side table
  const cab = E.el(room, "abs", "left:660px;top:560px;width:380px;height:600px;border-radius:14px 14px 0 0;background:#7a4a26;box-shadow:inset 0 0 0 16px #6a3e1e");
  E.el(cab, "abs", "left:30px;top:30px;width:320px;height:250px;background:rgba(200,230,255,.35);border:6px solid #caa36a");
  E.el(cab, "abs", "left:30px;top:300px;width:320px;height:250px;background:rgba(200,230,255,.35);border:6px solid #caa36a");
  const doily = E.el(room, "abs", "left:700px;top:790px;width:300px;height:90px;overflow:hidden"); E.img(doily, "p_doily", "width:300px;height:179px;margin-top:-50px;opacity:.95");
  const dog = E.el(room, "abs", "left:780px;top:600px;width:150px;height:166px"); E.img(dog, "p_dog", "width:150px;height:166px");
  E.el(room, "abs", "left:120px;top:560px;width:230px;height:280px;border:16px solid #caa36a;border-radius:50% / 40%;background:radial-gradient(ellipse at 50% 40%,#e8d3b4,#b89a78)");

  // ---------------- Otto in the plastic armchair ----------------
  const OS = .8, OW = 860 * OS, OH = 971 * OS;
  const otto = E.el(room, "abs", `left:-10px;top:${FLOOR - OH + 18}px;width:${OW}px;height:${OH}px;z-index:2;transform-origin:50% 100%`);
  const OT = ["o_sit", "o_sweat", "o_peel"];
  const oim = OT.map(n => E.img(otto, n, `position:absolute;left:0;top:0;width:${OW}px;height:${OH}px`));
  E.F(t => {
    const f = at([[0, "o_sit"], [LATER, "o_sweat"], [RIP - .3, "o_peel"], [RIP + 1.4, "o_sit"]], t);
    oim.forEach((im, i) => { im.style.opacity = OT[i] === f ? 1 : 0; });
    let sx = 1, sy = 1, y = 0;
    for (const k of [SQ1, SQ2]) if (t >= k && t < k + .35) { const u = (t - k) / .35; sy = 1 - .04 * Math.sin(u * Math.PI); sx = 1 + .03 * Math.sin(u * Math.PI); }
    if (t >= RIP - .3 && t < RIP + 1.1) y = Math.sin((t - RIP) * 40) * 3;
    otto.style.transform = `translateY(${y}px) scale(${sx},${sy})`;
  });
  // the plastic gleams (moving from frame 0)
  const glint = E.el(room, "abs", "left:40px;top:1380px;width:60px;height:260px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent);transform:skewX(-20deg);z-index:3");
  E.K(glint, "x", [[0, 0], [1.2, 520, "io"], [1.21, 0], [LATER, 0]]);
  E.K(glint, "o", [[0, 1], [1.2, 1], [1.21, 0]]);
  // sweat drops and heat while he is stuck
  for (let i = 0; i < 8; i++) {
    const t = LATER + .3 + i * .22;
    const d = E.el(room, "abs", `left:${270 + (i % 3) * 50}px;top:1000px;width:20px;height:28px;border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;background:#6cc6ff;z-index:4;opacity:0`);
    E.K(d, "o", [[t - .01, 0], [t, 1], [t + .45, 0]]); E.K(d, "x", [[t, 0], [t + .45, (i % 2 ? 1 : -1) * 80]]); E.K(d, "y", [[t, 0], [t + .2, -50, "out"], [t + .45, 40, "in"]]);
  }
  const heat = E.el(S.el, "abs", "inset:0;background:radial-gradient(ellipse at 50% 60%,rgba(255,140,60,0),rgba(255,120,40,.22));opacity:0;z-index:5;pointer-events:none");
  E.K(heat, "o", [[LATER, 0], [LATER + .4, 1], [RIP + 1.2, 1], [RIP + 1.6, 0]]);

  // ---------------- grandma ----------------
  const DS = .84;
  const dona = E.el(room, "abs", `left:650px;top:${FLOOR - 1024 * DS + 10}px;width:${700 * DS}px;height:${1024 * DS}px;z-index:3`);
  const DT = ["d_knowing", "d_skeptical", "d_offended", "d_smirk"];
  const dim = DT.map(n => E.img(dona, n, `position:absolute;left:0;bottom:0;height:${1014 * DS}px;width:auto`));
  dim[2].style.transform = "scaleX(-1)";
  E.F(t => { const f = at([[0, "d_knowing"], [SQ1 + .1, "d_skeptical"], [LATER, "d_smirk"], [NEVER - .1, "d_offended"], [NEVER + 2.2, "d_smirk"]], t); dim.forEach((im, i) => { im.style.opacity = DT[i] === f ? 1 : 0; }); });
  const sway = []; for (let t = 0; t <= DUR; t += .8) sway.push([t, (Math.round(t / .8) % 2) ? -7 : 0, "io"]);
  E.K(dona, "y", sway);

  // ---------------- sound: voices and real effects ----------------
  E.clip(.35, "voices/ep19/g_sit.wav");
  E.clip(SQ1, "sfx/plastic-squeak-short.wav", { vol: 1.1 });
  E.clip(SQ1 + 1.0, "voices/ep19/o_sofa.wav");
  E.clip(SQ1 + 2.0, "voices/ep19/g_mmhm.wav");
  E.clip(SQ2, "sfx/plastic-squeak-long.wav", { vol: 1.0 });
  E.clip(LATER, "sfx/cicadas.wav", { vol: .5, duck: false });
  E.clip(RIP - .2, "sfx/plastic-rip.wav", { vol: 1.2 });
  E.clip(EVER, "voices/ep19/o_ever.wav");
  E.clip(NEVER, "voices/ep19/g_guests.wav");
  E.S(LATER, "swish", .6); E.shake(RIP + .05, 16, .35); E.shake(RIP + .9, 20, .3); E.flash(RIP + .9, "#ffffff", .3, .15);

  // ---------------- text ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const box = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 72 : 58}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(box, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sfxWord = (str, t0, t1, left, top, rot) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;z-index:8;font-weight:900;font-size:110px;color:#ff5d7a;-webkit-text-stroke:11px #fff;paint-order:stroke fill;transform:rotate(${rot}deg);white-space:nowrap;opacity:0`, str);
    E.K(b, "o", [[t0 - .01, 0], [t0, 1], [t1 - .1, 1], [t1, 0]]); E.K(b, "s", [[t0, .3], [t0 + .22, 1.15, "back"], [t0 + .4, 1]]);
  };
  bubble("Sit, sit! Today you're a guest!", 440, 440, 600, "r", .35, SQ1);
  sfxWord("SQUEEEAK", SQ1, SQ1 + 1.0, 60, 1440, -8);
  bubble("That… was the sofa.", 40, 600, 520, "l", SQ1 + 1.0, SQ1 + 2.0);
  bubble("Mm-hm.", 620, 460, 360, "r", SQ1 + 2.0, SQ2 + .2, true);
  sfxWord("SQUEEEEEEAK", SQ2, SQ2 + 1.1, 30, 1440, 6);
  const later = E.el(S.el, "abs", `left:100px;top:352px;display:flex;gap:14px;z-index:7;opacity:0`);
  E.el(later, "", `background:${C.ink};color:#fff;font-weight:900;font-size:52px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap`, "2 HOURS LATER");
  E.el(later, "", `background:${C.coralD};color:#fff;font-weight:900;font-size:52px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap`, "34°C");
  E.K(later, "o", [[LATER, 0], [LATER + .1, 1], [RIP + 1.3, 1], [RIP + 1.45, 0]]); E.K(later, "s", [[LATER, .7], [LATER + .25, 1, "back"]]);
  sfxWord("RRRIIIP!", RIP - .1, RIP + 1.3, 60, 1460, -6);
  bubble("Grandma… have you EVER sat on it?", 40, 560, 640, "l", EVER, NEVER - .1);
  bubble("Never! It's for GUESTS!", 400, 440, 640, "r", NEVER, DUR - .9, true);
  const fact = E.el(S.el, "abs", `left:100px;top:352px;display:flex;gap:14px;z-index:7;opacity:0`);
  E.el(fact, "", `background:${C.ink};color:#fff;font-weight:900;font-size:46px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap`, "SOFA: 1986");
  E.el(fact, "", `background:${C.coralD};color:#fff;font-weight:900;font-size:46px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap`, "GUESTS SO FAR: 0");
  E.K(fact, "o", [[NEVER + 1.2, 0], [NEVER + 1.3, 1]]); E.K(fact, "s", [[NEVER + 1.2, .7], [NEVER + 1.45, 1, "back"]]);
  E.S(NEVER + 1.2, "ding", .6);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Grandma's *good* sofa", { size: 66, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[15.5, 1], [15.75, 1.18, "out"], [16.05, 1, "io"]]);
}
