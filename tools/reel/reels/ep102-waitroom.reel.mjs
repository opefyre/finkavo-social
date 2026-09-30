// EP.102 "Entering a waiting room in Portugal" — Buck walks into a full waiting room: "Hi…" Silence, crickets. "…Good morning?" Seven people answer in
// a chorus (the eighth is on her phone). "…I don't know any of you." 40 minutes later his name is called: "Right! Thank you, everyone. Bye!" And seven
// goodbyes roll out: "Que Deus o proteja!" (God protect you!) "Good luck, dear!" "Mind the step!" "Give my love to your mother!" "Bye bye!" "Call me
// if you need anything!" "Don't forget your coat!" Next morning, at his office back home: "Good morning, everyone!" Silence. "…Do we know you?"
// "Is this a cult?" "…Right."
export const meta = {
  id: "ep102-waitroom", date: "2027-01-03",
  images: {
    room: "characters/scenes/bg_clinic.webp", off: "characters/scenes/bg_office.webp", ba: "characters/cutouts/waitbench_a.webp", bb: "characters/cutouts/waitbench_b.webp",
    os: "characters/cutouts/office_stare.webp", b1: "characters/cutouts/buck_default.webp", b2: "characters/cutouts/buck_sorry.webp", b3: "characters/cutouts/buck_hola.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 53, seed: 1021, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [4, 7, 11]] });
  const DUR = 24.8, ENTER = .3, HI = 1.3, GM = 2.9, CH = 3.9, DK = 6.2, JUMP = 8.0, BYE = 9.1, F = [10.9, 11.55, 12.2, 12.8, 13.6, 14.2, 15.0], JUMP2 = 16.6, OFF = 17.4,
    GMALL = 18.1, KNOW = 19.9, CULT = 21.0, RIGHT = 22.2, STAMP = 22.9;
  const S = E.scene("waitroom", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, left, bottom, z = 3) => { const el = E.el(P, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  E.el(S.el, "abs", "inset:0;background:#1d2b36");

  // ================= the waiting room =================
  const G1 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G1, [[0, JUMP2 + .3]]);
  E.img(G1, "room", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  const BA = fig(G1, "ba", 1158, 730, .66, 158, 1180, 3), BB = fig(G1, "bb", 1148, 687, .7, 138, 1560, 4);
  [BA, BB].forEach((b, j) => { const k = []; for (let t = 0; t < JUMP2; t += .5) k.push([t, 0, "io"], [t + .25, (j ? -3 : 3), "io"]); E.K(b, "y", k); });        // frame-0 motion: everyone fidgets
  // Buck: hi (walks in) → doesn't know them → waves goodbye
  const B1 = fig(G1, "b1", 581, 976, .55, 690, 1890, 6), B2 = fig(G1, "b2", 830, 996, .55, 625, 1890, 6), B3 = fig(G1, "b3", 830, 996, .55, 625, 1890, 6);
  E.F(t => { const k = t < DK ? 0 : t < BYE - .2 ? 1 : 2; [B1, B2, B3].forEach((b, i) => { b.style.opacity = i === k ? 1 : 0; }); });
  [B1, B2, B3].forEach(b => E.K(b, "x", [[0, 520], [ENTER, 520], [ENTER + .9, 0, "out"]]));
  const hop = []; for (let t = ENTER; t < ENTER + .9; t += .2) hop.push([t, 0], [t + .1, -12]); hop.push([ENTER + .9, 0]); [B1].forEach(b => E.K(b, "y", hop));
  const crick = E.el(G1, "abs", "left:30px;top:1640px;font-size:54px;z-index:7;opacity:0", "🦗"); show(crick, [[HI + .2, CH - .4]]);
  E.K(crick, "x", [[HI, 0], [CH, 900, "lin"]]);

  // ================= the office (next morning) =================
  const G2 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G2, [[JUMP2 + .3, DUR]]);
  E.img(G2, "off", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  const OS = fig(G2, "os", 978, 633, .75, 10, 1720, 3);
  const ok = []; for (let t = JUMP2; t < DUR; t += .6) ok.push([t, 0, "io"], [t + .3, -2, "io"]); E.K(OS, "y", ok);
  const B3b = fig(G2, "b3", 830, 996, .6, 580, 1905, 6), B2b = fig(G2, "b2", 830, 996, .6, 580, 1905, 6);
  show(B3b, [[JUMP2 + .3, RIGHT - .05]]); show(B2b, [[RIGHT - .05, DUR]]);
  E.K(B3b, "x", [[OFF, 520], [OFF + .6, 0, "out"]]);
  const crick2 = E.el(G2, "abs", "left:30px;top:1770px;font-size:54px;z-index:7;opacity:0", "🦗"); show(crick2, [[GMALL + 1.3, KNOW - .1]]);
  E.K(crick2, "x", [[GMALL + 1.2, 0], [KNOW, 900, "lin"]]);

  // ---- time-jump cards
  const card = (txt, t0, t1) => { const c = E.el(S.el, "abs", "inset:0;background:#141a2e;z-index:14;opacity:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:76px;color:#fff6c8;text-align:center;padding:0 60px", txt); E.K(c, "o", [[t0, 0], [t0 + .12, 1], [t1 - .15, 1], [t1, 0]]); };
  card("40 MINUTES LATER…", JUMP, BYE - .1); card("NEXT MORNING…", JUMP2, OFF - .1);

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const CHT = [...Array(7)].map((_, i) => CH + i * .14);
  const P = [[0, "09:00 · WAITING ROOM"], [HI, "GREETINGS OWED: 8"], ...CHT.map((t, i) => [t, `GREETINGS OWED: ${7 - i}`]), [DK, "OWED: 1 (ON HER PHONE)"], [BYE, "09:40 · YOUR TURN"],
    ...F.map((t, i) => [t, `GOODBYES: ${i + 1}`]), [OFF, "NEXT DAY · THE OFFICE"], [GMALL, "GREETINGS BACK: 0"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= HI && t < BYE ? C.coralD : t >= F[0] && t < JUMP2 ? C.coralD : t >= GMALL ? C.coralD : C.ink; pill.style.fontSize = s.length > 22 ? "44px" : "50px"; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .18, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:28px;padding:14px 20px 18px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:26px;font-weight:800;color:#7a8791;margin-top:3px">${en}</div>`;
  // person centres: A (back bench) and B (front bench), then [who, topA/B, voice, text, width]
  const CX = { A1: 273, A2: 441, A3: 632, A4: 807, B1: 267, B2: 435, B3: 628, B4: 821 };
  const TOP = { A1: 560, A2: 470, A3: 560, A4: 470, B1: 940, B2: 850, B3: 940, B4: 850 };
  const place = (who, w, t0, t1, html, fs) => { const l = Math.max(10, Math.min(1070 - w, CX[who] - w / 2)); return bubble(html, l, TOP[who], w, CX[who] - l - 22, t0, t1, fs); };
  bubble("Hi…", 620, 1160, 220, 100, HI, GM - .05, 52);
  bubble("…Good morning?", 560, 1160, 420, 130, GM, CH - .05, 46);
  const ORDER = ["A1", "A2", "A3", "B1", "B2", "B3", "B4"];
  ORDER.forEach((who, i) => place(who, 190, CHT[i], DK - .15, "Good<br>morning!", 36));
  place("A4", 140, CHT[6] + .3, DK - .15, "📱", 54);
  bubble("…I don't know any of you.", 420, 1130, 600, 330, DK, JUMP - .05, 44);
  bubble("Right! Thank you, everyone. Bye!", 400, 1130, 620, 330, BYE, F[0] - .05, 44);
  const FW = [["A1", 300, `Que Deus o proteja!${sub("(God protect you!)")}`, 38], ["A2", 280, "Good luck, dear!", 38], ["A3", 280, "Mind the step!", 38], ["B1", 380, "Give my love to your mother!", 38],
    ["B2", 220, "Bye bye!", 38], ["B3", 400, "Call me if you need anything!", 38], ["B4", 340, "Don't forget your coat!", 38]];
  FW.forEach(([who, w, h, fs], i) => place(who, w, F[i], JUMP2 - .25, h, fs));
  bubble("Good morning, everyone!", 420, 1110, 600, 380, GMALL, KNOW - .05, 46);
  bubble("…Do we know you?", 200, 1090, 460, 150, KNOW, CULT - .05, 44);
  bubble("Is this a cult?", 20, 1090, 380, 80, CULT, RIGHT - .05, 44);
  bubble("…Right.", 640, 1130, 260, 130, RIGHT, STAMP + .4, 50);
  const sb = E.el(S.el, "abs", "left:60px;top:620px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "NOBODY ANSWERED.", STAMP, { size: 100, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/waiting-room.wav", { vol: .3, duck: false, to: JUMP });
  E.clip(OFF, "sfx/office.wav", { vol: .3, duck: false, to: DUR - OFF });
  E.S(ENTER, "whoosh", .3); E.clip(HI, "voices/ep102/b_hi.wav", { vol: 1.2 });
  E.clip(HI + .3, "sfx/elx-crickets.wav", { vol: 1.5, duck: false, to: GM - HI - .3 });
  E.clip(GM, "voices/ep102/b_gm.wav", { vol: 1.2 });
  const GMV = ["g1_gm", "g2_gm", "g3_gm", "g4_gm", "g8_gm", "g6_gm", "g5_gm"];
  GMV.forEach((v, i) => { E.clip(CHT[i], `voices/ep102/${v}.wav`, { vol: 1.15 }); E.S(CHT[i], "pop", .3); });
  E.clip(DK, "voices/ep102/b_dontknow.wav", { vol: 1.2 });
  E.S(JUMP, "whoosh", .4); E.clip(BYE, "voices/ep102/b_bye.wav", { vol: 1.25 });
  const FV = ["g1_deus", "g2_luck", "g3_step", "g4_mother", "g8_bye", "g6_call", "g5_coat"];
  FV.forEach((v, i) => { E.clip(F[i], `voices/ep102/${v}.wav`, { vol: 1.3 }); E.S(F[i], "pop", .3); });
  E.S(JUMP2, "whoosh", .4);
  E.clip(GMALL, "voices/ep102/b_gmall.wav", { vol: 1.3 });
  E.clip(GMALL + 1.3, "sfx/elx-crickets.wav", { vol: 1.5, duck: false, to: KNOW - GMALL - 1.4 });
  E.clip(KNOW, "voices/ep102/off_know.wav", { vol: 1.3 });
  E.clip(CULT, "voices/ep102/off_cult.wav", { vol: 1.3 });
  E.clip(RIGHT, "voices/ep102/b_right.wav", { vol: 1.2 });
  E.clip(STAMP - .1, "sfx/record-silence.wav", { vol: .5 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Entering a waiting room in *Portugal*", { size: 42, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[24.0, 1], [24.25, 1.18, "out"], [24.6, 1, "io"]]);
}
