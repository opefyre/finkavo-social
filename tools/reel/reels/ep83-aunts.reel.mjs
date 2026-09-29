// EP.83 "Christmas with the aunts" — the same Christmas table, five years running; the two aunts always find the next question.
// 2022, Otto alone: "So… still single?" 2023: "Everyone, this is Inês!" — "So… when is the wedding?" 2024: "We got married!" — "So…
// when is the baby?" 2025: "Meet little Tomás!" — "So… when is the second one?" 2026: two kids, a round Otto. Silence. "…You got fat."
export const meta = {
  id: "ep83-aunts", date: "2026-12-15",
  images: {
    bg: "characters/scenes/bg_xmas.webp", ask: "characters/cutouts/aunts_ask.webp", wh: "characters/cutouts/gossip_ladies.webp",
    o1: "characters/cutouts/otto-table_happy.webp", o2: "characters/cutouts/otto-suit_happy.webp", o3: "characters/cutouts/otto-table_baby.webp", o4: "characters/cutouts/otto-table_stuffed.webp",
    i1: "characters/cutouts/ines_wave.webp", i2: "characters/cutouts/ines_kids.webp", bolo: "characters/props/bolo-rei.webp", cod: "characters/props/food_bacalhau.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 55, seed: 831, prog: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]] });
  const DUR = 20.0, Y = [0, 3.0, 7.2, 10.9, 15.1], SINGLE = .8, INES = 3.3, WED = 5.0, MAR = 7.5, BABY = 8.7, TOM = 11.2, SEC = 12.6, FAT = 16.3;
  const S = E.scene("aunts", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3, clip = 1) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s * clip}px;width:${w * s}px;height:${h * s * clip}px;overflow:hidden;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  E.el(S.el, "abs", "inset:0;background:rgba(40,20,10,.12)");
  // snow outside, all the time
  const snow = [...Array(26)].map((_, i) => E.el(S.el, "abs", `left:${(i * 83) % 1080}px;top:0;width:${6 + (i % 3) * 3}px;height:${6 + (i % 3) * 3}px;border-radius:50%;background:rgba(255,255,255,.8);z-index:1`));
  E.F(t => snow.forEach((f, i) => { const u = (t * (.08 + (i % 4) * .02) + i * .173) % 1; f.style.transform = `translate(${Math.sin(t + i) * 20}px,${u * 1900}px)`; }));   // frame-0 motion

  // ---- the aunts (left): whispering between years, interrogating when they ask
  const ASK = [[SINGLE, Y[1] - .1], [WED, Y[2] - .1], [BABY, Y[3] - .1], [SEC, Y[4] - .1], [FAT - .6, DUR]];
  const a1 = fig("ask", 1168, 810, .6, -90, 1620, 3, .82), a2 = fig("wh", 750, 755, .78, -70, 1700, 3);
  show(a1, ASK); E.F(t => { a2.style.opacity = ASK.some(([p, q]) => t >= p && t < q) ? 0 : 1; });
  E.K(a1, "s", [[FAT - .6, 1], [FAT - .2, 1.12, "out"]]);
  // ---- Otto and his growing family (right), one pose per year
  const O = [["o1", 768, 1080], ["o1", 768, 1080], ["o2", 672, 1057], ["o3", 514, 1155], ["o4", 768, 1080]];
  O.forEach(([n, w, h], i) => { const f = fig(n, w, h, .62 * (n === "o3" ? 1.12 : n === "o2" ? .98 : 1), n === "o3" ? 520 : 450, 1900, 3); show(f, [[Y[i], Y[i + 1] ?? DUR]]); E.K(f, "y", [[Y[i], 60], [Y[i] + .3, 0, "out"]]); });
  const i1 = fig("i1", 536, 1096, .6, 790, 1900, 2); show(i1, [[Y[1], Y[4]]]); E.K(i1, "x", [[Y[1], 400], [Y[1] + .35, 0, "out"]]);
  const i2 = fig("i2", 613, 1108, .6, 760, 1900, 2); show(i2, [[Y[4], DUR]]);
  const veil = E.el(S.el, "abs", "left:850px;top:1215px;width:200px;height:300px;border-radius:90px 90px 30px 30px;background:rgba(255,255,255,.75);border:3px solid #fff;z-index:1;opacity:0");
  const crown = E.el(S.el, "abs", "left:880px;top:1228px;width:140px;height:26px;border-radius:13px;background:repeating-linear-gradient(90deg,#fff 0 14px,#f3e7c9 14px 20px);z-index:3;opacity:0"); show(crown, [[Y[2], Y[3]]]);
  show(veil, [[Y[2], Y[3]]]);
  // ---- the table in front of everyone
  const tbl = E.el(S.el, "abs", "left:-20px;top:1600px;width:1120px;height:360px;z-index:5");
  E.el(tbl, "abs", "left:0;top:0;width:100%;height:100%;background:#fbfaf6;border-top:10px solid #eae4d6;box-shadow:0 -6px 18px rgba(0,0,0,.15)");
  E.el(tbl, "abs", "left:0;top:40px;width:100%;height:70px;background:#b3262c;opacity:.9");
  E.img(tbl, "cod", "position:absolute;left:150px;top:40px;width:320px;height:180px");
  for (const x of [80, 560, 880]) E.el(tbl, "abs", `left:${x}px;top:150px;width:200px;height:90px;border-radius:50%;background:#fff;border:5px solid #e3ded2;box-sizing:border-box`);
  E.img(tbl, "bolo", "position:absolute;left:620px;top:10px;width:280px;height:200px");
  for (const x of [520, 940, 1040]) { E.el(tbl, "abs", `left:${x}px;top:-110px;width:18px;height:110px;background:#fffaf0;border-radius:4px`); const fl = E.el(tbl, "abs", `left:${x - 4}px;top:-150px;width:26px;height:44px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:radial-gradient(circle at 50% 70%,#fff3b0,#ffb52e 60%,#ff7a1a);box-shadow:0 0 30px 10px rgba(255,190,80,.45);transform-origin:50% 100%`); const k = []; for (let t = 0; t < DUR; t += .3) k.push([t, 1 + ((Math.round(t * 3.3 + x) % 3) - 1) * .08]); E.K(fl, "sy", k); }

  // the year card between Christmases
  const card = E.el(S.el, "abs", "left:240px;top:760px;width:600px;height:200px;border-radius:30px;background:#b3262c;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:110px;z-index:9;opacity:0;box-shadow:0 14px 30px rgba(0,0,0,.3)", "");
  const YR = ["2022", "2023", "2024", "2025", "2026"];
  E.F(t => { const k = [...Y].reverse().findIndex(y => t >= y); const i = Y.length - 1 - k; const s = "🎄 " + YR[i]; if (card.textContent !== s) card.textContent = s; const u = t - Y[i]; card.style.opacity = i > 0 && u < .75 ? (u < .1 ? u / .1 : u > .6 ? (.75 - u) / .15 : 1) : 0; });
  Y.slice(1).forEach(t => E.K(card, "s", [[t, .5], [t + .25, 1, "back"]]));

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "CHRISTMAS 2022 · SINGLE"], [Y[1], "CHRISTMAS 2023 · GIRLFRIEND"], [Y[2], "CHRISTMAS 2024 · MARRIED"], [Y[3], "CHRISTMAS 2025 · 1 BABY"], [Y[4], "CHRISTMAS 2026 · 2 KIDS"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= FAT ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const AUNT = (txt, t0, t1, fs = 50) => bubble(txt, 40, 1040, 520, 200, t0, t1, fs);
  AUNT("So… still single?", SINGLE, Y[1] - .1);
  bubble("Everyone, this is Inês!", 480, 1080, 560, 200, INES, WED - .05, 46);
  AUNT("So… when is the wedding?", WED, Y[2] - .1, 46);
  bubble("We got married!", 500, 1080, 440, 180, MAR, BABY - .05, 50);
  AUNT("So… when is the baby?", BABY, Y[3] - .1, 48);
  bubble("Meet little Tomás!", 500, 1080, 480, 180, TOM, SEC - .05, 50);
  AUNT("So… when is the second one?", SEC, Y[4] - .1, 44);
  AUNT("…You got fat.", FAT, DUR - .4, 60);
  const sb = E.el(S.el, "abs", "left:60px;top:520px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "SEE YOU NEXT CHRISTMAS.", FAT + 1.4, { size: 80, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/crowd-murmur.wav", { vol: .35, duck: false, to: DUR });
  E.clip(SINGLE, "voices/ep83/t_single.wav", { vol: 1.3 });
  Y.slice(1).forEach(t => { E.S(t, "whoosh", .5); E.S(t + .1, "ding", .4); });
  E.clip(INES, "voices/ep83/o_ines.wav", { vol: 1.2 }); E.clip(WED, "voices/ep83/t_wedding.wav", { vol: 1.3 });
  E.clip(MAR, "voices/ep83/o_married.wav", { vol: 1.2 }); E.clip(BABY, "voices/ep83/t_baby.wav", { vol: 1.3 });
  E.clip(TOM, "voices/ep83/o_tomas.wav", { vol: 1.2 }); E.clip(SEC, "voices/ep83/t_second.wav", { vol: 1.3 });
  E.S(FAT - .6, "scratch", .5); E.clip(FAT, "voices/ep83/t_fat.wav", { vol: 1.4 }); E.S(FAT + 1.0, "thud", .6);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Christmas with the *aunts*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[19.2, 1], [19.45, 1.18, "out"], [19.8, 1, "io"]]);
}
