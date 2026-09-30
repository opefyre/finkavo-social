// EP.112 "A letter from the Tax Office" — a horror-trailer parody. An envelope slides under the door. Narrator: "A letter. From the Tax Office." Grandma: "Ai, Jesus!" Dad cowers
// behind a plant: "Quem não deve, não teme!" (who owes nothing, fears nothing). Mum: "Don't open it!" Otto opens it and reads: "…you are owed eight euros and forty-three cents."
// Silence. Grandma: "…Eight euros?" Dad: "For THIS I hid behind the plant?!" Otto: "I'm rich!" Narrator: "And then… a second letter." Otto, flat: "…Don't open that one."
// Stamp: FINANÇAS 2 · FAMILY 0. (All numbers are jokes.)
export const meta = {
  id: "ep112-finance-letter", date: "2027-01-13",
  images: {
    bg: "characters/scenes/bg_hall.webp",
    o1: "characters/cutouts/otto-casual_jawdrop.webp", o2: "characters/cutouts/otto-casual_letter.webp", o3: "characters/cutouts/otto-casual_excited.webp",
    g1: "characters/cutouts/dona_gasp.webp", g2: "characters/cutouts/dona_skeptical.webp", m1: "characters/cutouts/mum_horror.webp", d1: "characters/cutouts/ze_plant.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 96, root: 47, seed: 1121, prog: [[0, 3, 7], [5, 8, 12], [7, 10, 14], [3, 7, 10]] });
  const DUR = 27.9, NAR = .3, JES = 3.35, DEV = 5.3, OPEN = 8.05, HAVE = 9.35, READ = 10.75, EIGHT = 16.65, PLANT = 18.25, RICH = 20.55, SEC = 21.85, DONT = 24.4, STAMP = 26.0;
  const ENV1 = 1.1, REFUND = 14.6;
  const S = E.scene("letter", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  E.img(S.el, "bg", BG);
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };
  const jit = (el, t0, t1, amp, per = .07) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, (Math.round(t / per) % 2) ? amp : -amp, "io"]); E.K(el, "r", k); };

  // ---- the family
  const FL = 1850;
  const ot1 = fig(S.el, "o1", 398, 1044, .6, 235, FL, 4), ot2 = fig(S.el, "o2", 521, 1012, .62, 235, FL, 4), ot3 = fig(S.el, "o3", 625, 1078, .58, 235, FL, 4);
  E.F(t => { const k = t < HAVE + 1.4 ? 1 : t < RICH ? 2 : t < SEC + 2.5 ? 3 : 1; ot1.style.opacity = (k === 1 || t >= DONT - .05 && false) ? 1 : 0; ot2.style.opacity = k === 2 ? 1 : 0; ot3.style.opacity = k === 3 ? 1 : 0; if (t >= DONT - .3) { ot1.style.opacity = 1; ot3.style.opacity = 0; } });
  bob(ot1, 0, HAVE + 1.4, 5, .6); bob(ot2, READ, RICH, 4, .6); bob(ot3, RICH, SEC + 2.5, 14, .3);
  const g1 = fig(S.el, "g1", 526, 967, .58, 720, FL, 4), g2 = fig(S.el, "g2", 665, 1014, .56, 720, FL, 4);
  E.F(t => { g1.style.opacity = t < EIGHT ? 1 : 0; g2.style.opacity = t >= EIGHT ? 1 : 0; });
  bob(g1, 0, EIGHT, 4, .6); jit(g1, JES, JES + 1.6, 2);
  const m1 = fig(S.el, "m1", 371, 998, .6, 500, FL - 8, 5); bob(m1, 0, DUR, 4, .55); jit(m1, OPEN, OPEN + 1.3, 2.5);
  const d1 = fig(S.el, "d1", 661, 986, .4, 940, FL - 15, 6); jit(d1, 0, DUR, 1.5, .09); jit(d1, DEV, DEV + 2.6, 4, .05); jit(d1, PLANT, PLANT + 2.2, 4, .05);

  // ---- envelopes (drawn in code)
  const env = (id, w, h, bg, edge, label, lab2) => {
    const el = E.el(S.el, "abs", `left:${540 - w / 2}px;top:0;width:${w}px;height:${h}px;background:${bg};border-radius:10px;box-shadow:0 10px 20px rgba(0,0,0,.4);z-index:7;opacity:0;border:3px solid ${edge}`);
    E.el(el, "abs", `left:0;top:0;width:${w}px;height:${h * .45}px;background:linear-gradient(160deg,rgba(0,0,0,.06),rgba(0,0,0,0));clip-path:polygon(0 0,100% 0,50% 100%)`);
    E.el(el, "abs", `left:${w * .08}px;top:${h * .52}px;width:${w * .84}px;font-weight:900;font-size:${h * .2}px;color:#1d2b36;letter-spacing:2px;text-align:center`, label);
    E.el(el, "abs", `left:${w * .08}px;top:${h * .78}px;width:${w * .84}px;font-weight:800;font-size:${h * .1}px;color:#7a8791;text-align:center`, lab2);
    E.el(el, "abs", `right:10px;top:10px;width:${w * .14}px;height:${w * .16}px;background:#c95b4d;border-radius:4px;opacity:.85`);
    return el;
  };
  const e1 = env(1, 250, 164, "#fdfaf2", "#d6cfbd", "FINANÇAS", "ENVELOPE OFICIAL");
  show(e1, [[ENV1, HAVE + .1]]);
  E.K(e1, "y", [[ENV1, 960], [ENV1 + .25, 990, "in"], [ENV1 + .55, 1120, "in"], [ENV1 + .7, 1040, "out"], [ENV1 + .9, 1060, "in"], [HAVE, 1060], [HAVE + .1, 1500]]);
  E.K(e1, "r", [[ENV1, 14], [ENV1 + .3, -16, "io"], [ENV1 + .6, 8, "io"], [ENV1 + .9, -3, "io"]]);
  E.K(e1, "x", [[HAVE - .01, 0], [HAVE + .1, -300, "in"]]);
  const e2 = env(2, 280, 183, "#f3e3d0", "#c95b4d", "FINANÇAS", "URGENTE");
  show(e2, [[SEC + .7, DUR]]);
  E.K(e2, "y", [[SEC + .7, 960], [SEC + .95, 1000, "in"], [SEC + 1.3, 1130, "in"], [SEC + 1.5, 1040, "out"], [SEC + 1.75, 1055, "in"], [DUR, 1055]]);
  E.K(e2, "r", [[SEC + .7, -12], [SEC + 1.0, 18, "io"], [SEC + 1.4, -6, "io"], [SEC + 1.75, 2, "io"]]);
  // the letter: REEMBOLSO €8,43
  const card = E.el(S.el, "abs", "left:150px;top:560px;width:780px;height:330px;background:#fff;border-radius:22px;box-shadow:0 18px 40px rgba(0,0,0,.45);z-index:11;opacity:0;padding:26px 36px;box-sizing:border-box;text-align:center");
  E.el(card, "abs", "left:36px;top:24px;width:708px;font-weight:900;font-size:40px;color:#7a8791;letter-spacing:2px;text-align:left", "FINANÇAS · NOTIFICAÇÃO");
  E.el(card, "abs", "left:36px;top:96px;width:708px;font-weight:900;font-size:76px;color:#1d2b36", "REEMBOLSO");
  E.el(card, "abs", `left:36px;top:190px;width:708px;font-weight:900;font-size:110px;color:${C.coralD}`, "€ 8,43");
  E.K(card, "o", [[REFUND, 0], [REFUND + .1, 1], [EIGHT + .8, 1], [EIGHT + 1.0, 0]]); E.pop(card, REFUND, { from: .4, dur: .3 });
  const sub = E.el(S.el, "abs", "left:150px;top:900px;width:780px;text-align:center;font-weight:800;font-size:30px;color:#fff;z-index:11;opacity:0;text-shadow:0 2px 6px rgba(0,0,0,.6)", "(reembolso = refund)");
  E.K(sub, "o", [[REFUND + .2, 0], [REFUND + .3, 1], [EIGHT + .8, 1], [EIGHT + 1.0, 0]]);

  // ---- dread: vignette + pill
  const vig = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 55%,rgba(0,0,0,0) 30%,rgba(10,0,20,.75) 100%);z-index:8;opacity:0");
  E.K(vig, "o", [[0, 0], [ENV1, .25], [JES, .4], [DEV, .6], [HAVE, .85], [REFUND, .85], [REFUND + .3, 0], [SEC + .7, 0], [SEC + 1.2, .9], [DUR, .9]]);
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "DREAD: 10%"], [ENV1, "DREAD: 40%"], [JES, "DREAD: 65%"], [DEV, "DREAD: 85%"], [HAVE, "DREAD: 99%"], [REFUND, "REFUND: €8.43"], [EIGHT, "DREAD: 0%"], [SEC + .9, "DREAD: 100%"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = (t >= REFUND && t < SEC + .9) ? "#2e9e6b" : t >= ENV1 ? C.coralD : C.ink; });
  PL.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const sb = en => `<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:3px">${en}</div>`;
  const bubble = (html, hx, top, w, t0, t1, fs = 48, z = 10) => {
    const tail = Math.max(50, Math.min(w - 90, w / 2)), left = Math.max(20, Math.min(1060 - w, hx - tail)), tl = hx - left - 22;
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:${z};transform-origin:${tl}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tl}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  // narrator: a movie-trailer caption, not a character bubble
  const cap = (txt, t0, t1) => { const el = E.el(S.el, "abs", "left:40px;top:600px;width:1000px;text-align:center;font-weight:900;font-size:68px;letter-spacing:3px;color:#fff6c8;z-index:13;opacity:0;text-shadow:0 4px 14px rgba(0,0,0,.8)", txt); E.K(el, "o", [[t0, 0], [t0 + .15, 1], [t1 - .15, 1], [t1, 0]]); };
  cap("A LETTER.<br>FROM THE TAX OFFICE.", NAR, JES - .1); cap("AND THEN…<br>A SECOND LETTER.", SEC, SEC + 2.5);
  bubble("Ai, Jesus!", 720, 1040, 380, JES, DEV - .1, 60);
  bubble(`Quem não deve, não teme!${sb("(Who owes nothing, fears nothing!)")}`, 940, 960, 560, DEV, OPEN - .1, 44);
  bubble("Don't open it!", 500, 1000, 400, OPEN, HAVE - .1, 54);
  bubble("I have to open it.", 235, 1010, 470, HAVE, READ - .1, 48);
  bubble("…Eight euros?", 720, 1040, 440, EIGHT, PLANT - .1, 52);
  bubble("For THIS I hid behind the plant?!", 940, 930, 640, PLANT, RICH - .1, 46);
  bubble("I'm rich!", 235, 1000, 380, RICH, SEC - .1, 62);
  bubble("…Don't open that one.", 235, 1000, 500, DONT, STAMP + .3, 50);
  E.stamp(E.el(S.el, "abs", "left:30px;top:600px;width:1020px;display:flex;justify-content:center;z-index:11"), "FINANÇAS 2 · FAMILY 0.", STAMP, { size: 84, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(0, "sfx/elx-heartbeat.wav", { vol: .7, duck: false, to: HAVE + 1.0 }); E.S(NAR, "whoosh", .3);
  E.clip(NAR, "voices/ep112/n_letter.wav", { vol: 1.3 }); E.clip(ENV1 - .1, "sfx/thunder.wav", { vol: .5 }); E.clip(ENV1 + .2, "sfx/elx-envelope-slide.wav", { vol: 2.2, to: 1 });
  E.clip(JES, "voices/ep112/g_jesus.wav", { vol: 1.35 }); E.clip(DEV, "voices/ep112/d_deve.wav", { vol: 1.3 }); E.clip(OPEN, "voices/ep112/m_open.wav", { vol: 1.3 });
  E.clip(HAVE, "voices/ep112/o_have.wav", { vol: 1.2 }); E.clip(READ, "voices/ep112/o_read.wav", { vol: 1.25 });
  E.S(REFUND, "sparkle", .5); E.S(EIGHT - .05, "scratch", .6);
  E.clip(EIGHT, "voices/ep112/g_eight.wav", { vol: 1.3 }); E.clip(EIGHT + .2, "sfx/elx-crickets.wav", { vol: .4, to: 1.4 });
  E.clip(PLANT, "voices/ep112/d_plant.wav", { vol: 1.3 }); E.clip(RICH, "voices/ep112/o_rich.wav", { vol: 1.25 }); E.S(RICH + .1, "sparkle", .5);
  E.clip(SEC, "voices/ep112/n_second.wav", { vol: 1.3 }); E.clip(SEC + .6, "sfx/thunder.wav", { vol: .6 }); E.clip(SEC + 1.0, "sfx/elx-envelope-slide.wav", { vol: 2.2, to: 1 });
  E.clip(SEC + 1.4, "sfx/elx-heartbeat.wav", { vol: .8, duck: false, to: DUR - SEC - 1.4 });
  E.clip(DONT, "voices/ep112/o_dont.wav", { vol: 1.25 }); E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "A letter from the *Tax Office*", { size: 48, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[27.1, 1], [27.35, 1.18, "out"], [27.65, 1, "io"]]);
}
