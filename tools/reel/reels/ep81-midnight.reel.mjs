// EP.81 "Dinner in Portugal at midnight" — Buck, hungry at 21:00, in an empty tasca: "Hi! Table for one, please!" The waiter, laughing:
// "Dinner? Now? It's so early!" The clock runs: 22:30 the families arrive, 23:30 kids play football between the tables, 00:15 a toddler
// eats a whole octopus tentacle, 00:45 grandma is dancing. 01:00 Buck, yawning: "Shouldn't they be in bed?" 01:30 he's asleep at the
// table. A five-year-old tucks a blanket over him and whispers to her friends: "Old people go to bed early."
export const meta = {
  id: "ep81-midnight", date: "2026-12-13",
  images: {
    bg: "characters/scenes/bg_tasca.webp", bf: "characters/cutouts/buck-chair_fork.webp", by: "characters/cutouts/buck-chair_yawn.webp", ba: "characters/cutouts/buck-chair_asleep.webp",
    wt: "characters/cutouts/waiter_tray.webp", fam: "characters/cutouts/family_cheer.webp", kids: "characters/cutouts/kids_run.webp", tod: "characters/cutouts/toddler_octopus.webp",
    gran: "characters/cutouts/dona_dance.webp", girl: "characters/cutouts/girl_point.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 118, root: 57, seed: 811, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [9, 12, 16]] });
  const DUR = 20.3, Q = .3, EARLY = 2.2, T1 = 5.2, T2 = 7.2, T3 = 9.2, T4 = 10.9, BED = 12.5, SLEEP = 14.4, GIRL = 15.1, OLD = 15.9;
  const S = E.scene("midnight", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  // it gets darker outside and livelier inside
  const night = E.el(S.el, "abs", "inset:0;background:#0b1030;z-index:1;pointer-events:none");
  E.K(night, "o", [[0, 0], [T1, .12], [SLEEP, .28]]);
  // the room fills up
  const fam = fig("fam", 1168, 585, .62, 250, 1230, 2); show(fam, [[T1, DUR]]); E.K(fam, "y", [[T1, 200], [T1 + .35, 0, "out"]]);
  const cb = []; for (let t = T1; t < DUR; t += .5) cb.push([t, 0, "io"], [t + .25, -8, "io"]); E.K(fam, "r", cb.map(([t, v, e]) => [t, v / 4, e]));
  const gran = fig("gran", 776, 1027, .6, 700, 1420, 3); show(gran, [[T4, DUR]]);
  const gd = []; for (let t = T4; t < DUR; t += .4) gd.push([t, -8, "io"], [t + .2, 8, "io"]); E.K(gran, "r", gd);
  const kids = fig("kids", 951, 598, .62, 0, 1640, 6); show(kids, [[T2, T3 + .2], [SLEEP + .2, GIRL - .2]]);
  E.K(kids, "x", [[T2, 200], [T3 + .2, 1100, "lin"], [SLEEP + .2, 250], [GIRL - .2, 1100, "lin"]]);
  const kb = []; for (let t = T2; t < T3 + .2; t += .16) kb.push([t, 0], [t + .08, -20]); E.K(kids, "y", kb);
  // Buck at his table (left), the toddler at the next one (right)
  const BX = 20, BS = .95;
  const b1 = fig("bf", 536, 1014, BS, BX, 1900, 5), b2 = fig("by", 758, 1143, BS * .88, BX - 30, 1900, 5), b3 = fig("ba", 545, 995, BS, BX, 1900, 5);
  show(b1, [[0, BED]]); show(b2, [[BED, SLEEP]]); show(b3, [[SLEEP, DUR]]);
  const bb = []; for (let t = 0; t < T1; t += .7) bb.push([t, 0, "io"], [t + .35, -6, "io"]); E.K(b1, "y", bb);            // frame-0 motion
  const zz = E.el(S.el, "abs", "left:300px;top:1100px;font-weight:900;font-size:64px;color:#fff;text-shadow:0 3px 8px rgba(0,0,0,.5);z-index:8;opacity:0", "z z z");
  show(zz, [[SLEEP + .3, DUR]]); E.K(zz, "y", [[SLEEP + .3, 0], [DUR, -80]]);
  const tbl = E.el(S.el, "abs", "left:0;top:0;width:1px;height:1px;z-index:6");
  E.el(tbl, "abs", "left:-40px;top:1520px;width:700px;height:80px;border-radius:50%;background-color:#fff;background-image:linear-gradient(45deg,rgba(214,48,49,.85) 25%,transparent 25%,transparent 75%,rgba(214,48,49,.85) 75%),linear-gradient(45deg,rgba(214,48,49,.85) 25%,transparent 25%,transparent 75%,rgba(214,48,49,.85) 75%);background-size:50px 50px;background-position:0 0,25px 25px");
  E.el(tbl, "abs", "left:280px;top:1580px;width:40px;height:340px;background:#4a2a18");
  E.el(tbl, "abs", "left:190px;top:1490px;width:200px;height:60px;border-radius:0 0 100px 100px;background:#fff;border:4px solid #cfd6dc;box-sizing:border-box");
  E.el(tbl, "abs", "left:205px;top:1490px;width:170px;height:22px;border-radius:50%;background:#e8a33a");
  const blanket = E.el(S.el, "abs", "left:40px;top:1300px;width:470px;height:260px;border-radius:120px 120px 30px 30px;background:repeating-linear-gradient(45deg,#7bb6e8 0 30px,#a8d2f2 30px 60px);z-index:7;opacity:0;transform-origin:50% 0");
  show(blanket, [[OLD - .4, DUR]]); E.K(blanket, "sy", [[OLD - .4, .1], [OLD - .1, 1, "out"]]);
  const wt = fig("wt", 628, 1050, .8, 620, 1900, 5); show(wt, [[0, T1]]); E.K(wt, "x", [[0, 0], [T1 - .2, 0], [T1, 500, "in"]]);
  const tod = fig("tod", 544, 1086, .72, 690, 1900, 5); show(tod, [[T3, DUR]]); E.K(tod, "y", [[T3, 400], [T3 + .3, 0, "out"]]);
  const girl = fig("girl", 579, 884, .78, 560, 1900, 8); show(girl, [[GIRL, DUR]]); E.K(girl, "x", [[GIRL, 500], [GIRL + .4, 0, "out"]]);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "21:00 · EMPTY"], [T1, "22:30 · THE FAMILIES"], [T2, "23:30 · FOOTBALL"], [T3, "00:15 · OCTOPUS"], [T4, "00:45 · GRANDMA DANCES"], [BED, "01:00"], [SLEEP, "01:30 · STILL EARLY"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= T1 ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Hi! Table for one, please!", 60, 760, 520, 200, Q, EARLY - .05, 46);
  bubble("Dinner? Now? It's so early!", 460, 760, 580, 380, EARLY, T1 - .1, 46);
  bubble("Shouldn't they be in bed?", 60, 760, 520, 220, BED, SLEEP - .05, 46);
  bubble("Old people go to bed early.", 420, 980, 620, 380, OLD, DUR - .4, 46);
  const sb = E.el(S.el, "abs", "left:60px;top:520px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "01:30. STILL EARLY.", OLD + 2.5, { size: 96, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/restaurant.wav", { vol: .25, duck: false, to: T1 });
  E.clip(Q, "voices/ep81/b_table.wav", { vol: 1.2 });
  E.clip(EARLY, "voices/ep81/w_early.wav", { vol: 1.3 });
  E.clip(T1, "sfx/crowd-murmur.wav", { vol: .9, duck: false, to: DUR - T1 }); E.S(T1, "pop", .6);
  E.clip(T2, "sfx/kids-playing.wav", { vol: .9, duck: false }); E.clip(T2 + .5, "sfx/ball-bounce.wav", { vol: .9 });
  E.S(T3, "pop", .6); E.clip(T3 + .2, "sfx/munch.wav", { vol: .8 });
  E.clip(T4, "sfx/wedding-party.wav", { vol: .5, duck: false, to: DUR - T4 });
  E.clip(BED - .1, "sfx/yawn.wav", { vol: .8 }); E.clip(BED + .2, "voices/ep81/b_bed.wav", { vol: 1.2 });
  E.clip(SLEEP, "sfx/snore.wav", { vol: .8, to: DUR - SLEEP });
  E.clip(SLEEP + .2, "sfx/kids-playing.wav", { vol: .6, duck: false, to: 1.4 });
  E.S(OLD - .4, "swish", .5); E.clip(OLD, "voices/ep81/g_old.wav", { vol: 1.3 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Dinner in Portugal at *midnight*", { size: 48, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[19.5, 1], [19.75, 1.18, "out"], [20.1, 1, "io"]]);
}
