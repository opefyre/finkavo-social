// EP.109 "The last slice of cake" — a family at the table, one slice left. Dad: "Who wants the last slice?" Everyone, palms up: "Oh no, not me!" / "I'm full." /
// "Me? No, no, I'm fine!" / "Not for me. Let the young ones have it." The plate is pushed around the table ("You have it!" "No, YOU have it!"). 40 MINUTES LATER: four pairs of
// eyes on one slice. The lights go out. In the dark, grandma: "Well… if nobody wants it." (munching). Lights on: empty plate. Everyone: "GRANDMA!" Dad: "I WANTED it!"
// Grandma: "Quem não arrisca, não petisca!" (who doesn't risk it, doesn't snack). Stamp: LAST SLICE: GRANDMA.
export const meta = {
  id: "ep109-lastslice", date: "2027-01-10",
  images: {
    bg: "characters/scenes/bg_dining.webp",
    f1: "characters/cutouts/family_polite.webp", f2: "characters/cutouts/family_eye.webp", f3: "characters/cutouts/family_win.webp",
    slice: "characters/props/cake-slice.webp", empty: "characters/props/cake-empty.webp", fly: "characters/props/cake-fly.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 52, seed: 1091, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 27.0, WHO = .3, SIS = 1.95, TEEN = 3.5, DAD = 4.5, GRAN = 6.2, PUSH = 9.3, CARD = 12.1, EYES = 13.4, DARK = 15.6, WELL = 15.95, LIGHT = 18.6, SHOUT = 18.8, WANT = 19.95, ARR = 22.2, STAMP = 24.9;
  const S = E.scene("cake", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  E.img(S.el, "bg", BG);

  // ================= family (waist-up, behind the table) =================
  const FW = 1080, FH = 752 * FW / 1344, FB = 1450;
  const fam = E.el(S.el, "abs", `left:0;top:${FB - FH}px;width:${FW}px;height:${FH}px;z-index:4`);
  const F = ["f1", "f2", "f3"].map(n => E.img(fam, n, `position:absolute;left:0;top:0;width:${FW}px;height:${FH}px;opacity:0`));
  E.F(t => { const k = t < EYES ? 0 : t < LIGHT ? 1 : 2; F.forEach((f, i) => { f.style.opacity = i === k ? 1 : 0; }); });
  const fb = []; for (let t = 0; t < DUR; t += .7) fb.push([t, 0, "io"], [t + .35, -5, "io"]); E.K(fam, "y", fb);
  // the table in front of them
  E.el(S.el, "abs", `left:0;top:${FB - 10}px;width:1080px;height:${1930 - FB + 10}px;background:linear-gradient(#f7f1e6,#ebe2d2);z-index:6;box-shadow:0 -10px 24px rgba(0,0,0,.25)`);
  E.el(S.el, "abs", `left:0;top:${FB + 100}px;width:1080px;height:26px;background:#c95b4d;z-index:6;opacity:.85`);
  // the plate, pushed around
  const plate = E.el(S.el, "abs", "left:0;top:1570px;width:280px;height:244px;z-index:8"); E.img(plate, "slice", "width:280px;height:244px");
  const plateE = E.el(S.el, "abs", "left:400px;top:1570px;width:280px;height:249px;z-index:8;opacity:0"); E.img(plateE, "empty", "width:280px;height:249px");
  show(plate, [[0, LIGHT]]); show(plateE, [[LIGHT, DUR]]);
  const PX = [[0, 400], [PUSH, 400], [PUSH + .3, 120, "io"], [PUSH + .7, 680, "io"], [PUSH + 1.1, 290, "io"], [PUSH + 1.5, 760, "io"], [PUSH + 1.9, 400, "io"]];
  E.K(plate, "x", PX.map(([t, x, e]) => [t, x, e]));
  E.K(plate, "y", [[0, 0], [PUSH, 0], [PUSH + .15, -18, "out"], [PUSH + .3, 0, "in"], [PUSH + .55, -18, "out"], [PUSH + .7, 0, "in"], [PUSH + .95, -18, "out"], [PUSH + 1.1, 0, "in"], [PUSH + 1.35, -18, "out"], [PUSH + 1.5, 0, "in"]]);
  // a fly, circling the slice while everyone stares
  const fly = E.el(S.el, "abs", "left:0;top:0;width:90px;height:85px;z-index:9;opacity:0"); E.img(fly, "fly", "width:90px;height:85px");
  show(fly, [[EYES + .3, DARK - .1]]);
  E.F(t => { const a = (t - EYES) * 5; fly.style.transform = `translate(${540 + Math.cos(a) * 230}px,${1560 + Math.sin(a * 1.3) * 90}px) rotate(${a * 40}deg)`; });

  // ---- lights out
  const dark = E.el(S.el, "abs", "inset:0;background:#05060c;z-index:16;opacity:0");
  E.K(dark, "o", [[DARK - .05, 0], [DARK, 1], [LIGHT - .05, 1], [LIGHT, 0]]);
  // ---- time card
  const card = E.el(S.el, "abs", "inset:0;background:#141a2e;z-index:14;opacity:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:76px;color:#fff6c8;text-align:center;padding:0 60px", "40 MINUTES LATER…");
  E.K(card, "o", [[CARD, 0], [CARD + .12, 1], [EYES - .15, 1], [EYES, 0]]);

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "SLICES LEFT: 1 · WANTED: 0"], [SIS + .2, "SLICES LEFT: 1 · REFUSED: 1"], [TEEN + .2, "SLICES LEFT: 1 · REFUSED: 2"], [DAD + .3, "SLICES LEFT: 1 · REFUSED: 3"], [GRAN + .3, "SLICES LEFT: 1 · REFUSED: 4"], [PUSH + .3, "SLICES LEFT: 1 · REFUSED: 11"], [EYES, "SLICES LEFT: 1 · 40 MIN"], [LIGHT, "SLICES LEFT: 0"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= SIS ? C.coralD : C.ink; pill.style.fontSize = s.length > 26 ? "42px" : "46px"; });
  PL.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.1], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const sub = en => `<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:3px">${en}</div>`;
  const bubble = (html, hx, top, w, t0, t1, fs = 48, z = 10) => {                                        // hx = x of the speaker's head
    const tail = Math.max(50, Math.min(w - 90, w / 2)), left = Math.max(20, Math.min(1060 - w, hx - tail)), tl = hx - left - 22;
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:${z};transform-origin:${tl}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tl}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const HX = { dad: 150, gran: 430, sis: 650, teen: 930 }, TOP = 720;
  bubble("Who wants the last slice?", HX.dad, TOP + 40, 500, WHO, SIS - .1, 48);
  bubble("Oh no, not me!", HX.sis, TOP, 400, SIS, TEEN - .1, 50);
  bubble("I'm full.", HX.teen, TOP + 40, 300, TEEN, DAD - .1, 52);
  bubble("Me? No, no, I'm fine!", HX.dad, TOP + 40, 460, DAD, GRAN - .1, 48);
  bubble("Not for me. Let the young ones have it.", HX.gran, TOP - 40, 560, GRAN, PUSH - .2, 46);
  // the plate goes round: a burst of "no, you!"
  bubble("You have it!", HX.dad, TOP + 70, 380, PUSH, PUSH + 1.5, 46, 10);
  bubble("No, YOU have it!", HX.sis, TOP + 10, 440, PUSH + .25, PUSH + 1.7, 46, 11);
  bubble("Give it to grandma!", HX.teen, TOP + 90, 420, PUSH + .6, PUSH + 2.0, 42, 12);
  bubble("Give it to your father!", HX.gran, TOP - 150, 450, PUSH + 1.0, PUSH + 2.5, 44, 13);
  bubble("Well… if nobody wants it.", HX.gran, 860, 560, WELL, LIGHT - .1, 50, 18);
  bubble("GRANDMA!", HX.dad, TOP + 60, 330, SHOUT, WANT - .1, 52, 10); bubble("GRANDMA!", HX.sis, TOP + 10, 330, SHOUT + .05, WANT - .1, 52, 11); bubble("GRANDMA!", HX.teen, TOP + 80, 330, SHOUT + .1, WANT - .1, 52, 12);
  bubble("I WANTED it!", HX.dad, TOP + 40, 420, WANT, ARR - .1, 58);
  bubble(`Quem não arrisca, não petisca!${sub("(Who doesn't risk it, doesn't snack!)")}`, HX.gran, TOP - 100, 600, ARR, STAMP + .3, 44);
  const sb = E.el(S.el, "abs", "left:30px;top:520px;width:1020px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "LAST SLICE: GRANDMA.", STAMP, { size: 78, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/elx-dinner-party.wav", { vol: .14, duck: false, to: CARD }); E.clip(EYES, "sfx/cicadas.wav", { vol: .35, duck: false, to: DARK - EYES });
  E.clip(WHO, "voices/ep109/d_who.wav", { vol: 1.25 }); E.clip(SIS, "voices/ep109/s_notme.wav", { vol: 1.25 }); E.clip(TEEN, "voices/ep109/t_full.wav", { vol: 1.2 }); E.clip(DAD, "voices/ep109/d_fine.wav", { vol: 1.25 });
  E.clip(GRAN, "voices/ep109/g_notme.wav", { vol: 1.3, gain: 0 });
  E.clip(PUSH, "voices/ep109/d_youhave.wav", { vol: 1.2 }); E.clip(PUSH + .25, "voices/ep109/s_youhave.wav", { vol: 1.2 }); E.clip(PUSH + .6, "voices/ep109/t_give.wav", { vol: 1.15 }); E.clip(PUSH + 1.0, "voices/ep109/g_give.wav", { vol: 1.25 });
  for (let i = 0; i < 5; i++) E.S(PUSH + .3 + i * .4, "thud", .35);
  E.S(CARD, "whoosh", .4);
  E.clip(DARK - .05, "sfx/elx-light-switch.wav", { vol: 1.2 }); E.clip(WELL, "voices/ep109/g_well.wav", { vol: 1.3 }); E.clip(WELL + .8, "sfx/elx-munch.wav", { vol: .9, to: LIGHT - WELL - 1 });
  E.clip(LIGHT - .05, "sfx/elx-light-switch.wav", { vol: 1.2 });
  E.clip(SHOUT, "voices/ep109/d_grandma.wav", { vol: 1.2 }); E.clip(SHOUT + .05, "voices/ep109/s_grandma.wav", { vol: 1.2 }); E.clip(SHOUT + .1, "voices/ep109/t_grandma.wav", { vol: 1.15 });
  E.clip(WANT, "voices/ep109/d_wanted.wav", { vol: 1.3 });
  E.clip(ARR, "voices/ep109/g_arrisca.wav", { vol: 1.35 });
  E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "The *last slice* of cake", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[26.2, 1], [26.45, 1.18, "out"], [26.75, 1, "io"]]);
}
