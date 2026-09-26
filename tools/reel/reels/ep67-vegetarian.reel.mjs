// EP.67 "Telling your Portuguese grandma you're vegetarian" — English-first. Otto at her table: "Grandma… I'm vegetarian now."
// Record scratch, the spoon drops: "…Vegetarian?" Then grandma logic, escalating on a chalkboard: "Okay. No problem. Just fish."
// → "Fish lives in the water. Water is vegetable." → "The chicken only eats corn. So the chicken… is corn." Finally she walks in
// with a whole roast pig: "Look! He is smiling. He is happy for you!" Otto, stuffed: "…I'm vegetarian tomorrow."
export const meta = {
  id: "ep67-vegetarian", date: "2026-11-29",
  images: {
    oh: "characters/cutouts/otto-table_happy.webp", op: "characters/cutouts/otto-table_plead.webp", opn: "characters/cutouts/otto-table_panic.webp", os: "characters/cutouts/otto-table_stuffed.webp",
    stir: "characters/cutouts/dona_stir.webp", off: "characters/cutouts/dona_offended.webp", inn: "characters/cutouts/dona_innocent.webp", kn: "characters/cutouts/dona_knowing.webp", pig: "characters/cutouts/dona_pig.webp",
    sard: "characters/props/couvert-sardines.webp", hen: "characters/props/hen.webp", roast: "characters/props/roast-pig.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 62, seed: 671, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 20.4, TABLE = 1500, VEG = .3, SCR = 3.2, Q = 3.35, FISH = 4.5, DOTS = 7.0, WATER = 7.9, CORN = 10.7, PIG = 14.6, SMILE = 15.0, TOM = 17.9;
  const S = E.scene("grandma", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  // ---------------- grandma's kitchen ----------------
  E.el(S.el, "abs", "inset:0;background:#f6e4c6");
  const az = `<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90'><rect width='90' height='90' fill='#f7f3ea'/><rect x='2' y='2' width='86' height='86' fill='none' stroke='#6f8fb8' stroke-width='3'/><path d='M45 12 L55 45 L45 78 L35 45Z' fill='#2f6db5'/><circle cx='45' cy='45' r='7' fill='#f2b632'/></svg>`;
  E.el(S.el, "abs", `left:0;top:880px;width:1080px;height:${TABLE - 880}px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(az)}");background-size:90px 90px`);
  for (let k = 0; k < 5; k++) E.el(S.el, "abs", `left:${80 + k * 70}px;top:560px;width:${36 + (k % 2) * 14}px;height:${60 + (k % 3) * 18}px;background:${["#c0392b", "#e0a24a", "#2f7a3a", "#8a5a2b", "#d9b27a"][k]};border-radius:8px 8px 4px 4px`);
  E.el(S.el, "abs", "left:60px;top:640px;width:420px;height:16px;background:#8a5a2b");
  const holy = E.el(S.el, "abs", "left:760px;top:470px;width:160px;height:200px;border:10px solid #c9a24a;border-radius:80px 80px 10px 10px;background:linear-gradient(180deg,#ffe8a8,#f4c86a)");
  E.el(holy, "abs", "left:58px;top:40px;width:24px;height:110px;background:#fff;border-radius:6px"); E.el(holy, "abs", "left:30px;top:70px;width:80px;height:22px;background:#fff;border-radius:6px");
  const stove = E.el(S.el, "abs", "left:600px;top:1180px;width:420px;height:330px;background:#e9ecef;border-radius:10px;border:6px solid #b8c1c9");
  const pot = E.el(S.el, "abs", "left:700px;top:1070px;width:220px;height:130px;border-radius:0 0 40px 40px;background:#3d4650;border-top:14px solid #5a6570");
  const steam = [0, 1, 2].map(i => E.el(S.el, "abs", `left:${740 + i * 50}px;top:1000px;width:34px;height:60px;border-radius:50%;background:rgba(255,255,255,.85);opacity:0`));
  E.F(t => steam.forEach((s, i) => { const u = ((t + i * .4) % 1.2) / 1.2; s.style.opacity = (1 - u) * .8; s.style.transform = `translate(${Math.sin(u * 6 + i) * 10}px,${-u * 150}px)`; }));   // frame-0 motion

  // ---------------- grandma ----------------
  const gw = E.el(S.el, "abs", "left:0;top:0;width:1px;height:1px;z-index:2");
  const GF = { stir: [657, 1021], off: [697, 1020], inn: [581, 1018], kn: [665, 1014] };
  const gIm = Object.entries(GF).map(([n, [w, h]]) => [n, E.img(gw, n, `position:absolute;left:${560 + (657 - w) * .82 / 2}px;top:${TABLE + 40 - h * .82}px;width:${w * .82}px;height:${h * .82}px;opacity:0`)]);
  E.F(t => { const f = at([[0, "stir"], [SCR, "off"], [FISH, "inn"], [WATER, "kn"], [CORN, "inn"]], t); gIm.forEach(([n, el]) => { el.style.opacity = n === f && t < PIG ? 1 : 0; }); });
  E.K(gw, "s", [[SCR - .01, 1], [SCR, 1.06], [SCR + .3, 1, "out"]]);
  const spoon = E.el(S.el, "abs", "left:640px;top:1050px;width:26px;height:140px;border-radius:13px;background:#8a5a2b;z-index:3;opacity:0");
  E.K(spoon, "o", [[SCR - .01, 0], [SCR, 1], [SCR + .9, 1], [SCR + 1.0, 0]]); E.K(spoon, "y", [[SCR, 0], [SCR + .5, 380, "in"]]); E.K(spoon, "r", [[SCR, 0], [SCR + .5, 200]]);
  const gp = E.el(S.el, "abs", `left:${520}px;top:${TABLE + 40 - 1063 * .84}px;width:${744 * .84}px;height:${1063 * .84}px;z-index:2;opacity:0`);
  E.img(gp, "pig", `width:${744 * .84}px;height:${1063 * .84}px`);
  E.K(gp, "o", [[PIG - .01, 0], [PIG, 1], [TOM - .01, 1], [TOM, 0]]); E.K(gp, "x", [[PIG, 500], [PIG + .45, 0, "out"]]);
  const glow = E.el(S.el, "abs", "left:520px;top:780px;width:620px;height:620px;border-radius:50%;background:radial-gradient(circle,rgba(255,230,120,.7),rgba(255,230,120,0) 65%);z-index:1;opacity:0");
  E.K(glow, "o", [[PIG + .3, 0], [PIG + .6, 1], [TOM - .01, 1], [TOM, 0]]);

  // ---------------- the table and Otto ----------------
  E.el(S.el, "abs", `left:0;top:${TABLE}px;width:1080px;height:${1920 - TABLE}px;z-index:4;background-color:#fff;background-image:linear-gradient(90deg,rgba(47,109,181,.55) 50%,transparent 50%),linear-gradient(rgba(47,109,181,.55) 50%,transparent 50%);background-size:90px 90px`);
  const ow = E.el(S.el, "abs", "left:-120px;top:0;width:1px;height:1px;z-index:5");
  const OF = ["oh", "op", "opn", "os"];
  const oIm = OF.map(n => [n, E.img(ow, n, `position:absolute;left:0;top:${1960 - 1080 * .78}px;width:${768 * .78}px;height:${1080 * .78}px;opacity:0`)]);
  E.F(t => { const f = at([[0, "oh"], [SCR, "opn"], [DOTS, "op"], [PIG + .3, "opn"], [TOM, "os"]], t); oIm.forEach(([n, el]) => { el.style.opacity = n === f ? 1 : 0; }); });
  // dishes land on the table, one after another
  const dish = (n, w, h, s, x, t, t1 = TOM) => { const el = E.el(S.el, "abs", `left:${x}px;top:${TABLE + 70 - h * s}px;width:${w * s}px;height:${h * s}px;z-index:6;opacity:0;transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); E.K(el, "o", [[t - .01, 0], [t, 1], [t1 - .01, 1], [t1, 0]]); E.K(el, "y", [[t, -700], [t + .25, 0, "in"]]); E.K(el, "s", [[t + .25, 1.15], [t + .45, 1, "out"]]); E.S(t + .25, "thud", .6); return el; };
  dish("sard", 309, 223, 1.0, 470, FISH + 1.2);
  dish("hen", 237, 253, 1.0, 780, CORN + .5);
  dish("roast", 1102, 580, .62, 280, PIG + 1.6, DUR + 1);
  const corn = [0, 1, 2, 3, 4, 5].map(i => E.el(S.el, "abs", `left:${760 + (i % 3) * 40}px;top:${TABLE + 20 + Math.floor(i / 3) * 24}px;width:26px;height:18px;border-radius:50%;background:#f2c230;border:3px solid #c99a1a;z-index:6;opacity:0`));
  corn.forEach((c, i) => E.K(c, "o", [[CORN + .8 + i * .05, 0], [CORN + .85 + i * .05, 1], [TOM - .01, 1], [TOM, 0]]));

  // ---------------- grandma logic chalkboard ----------------
  const board = (t0, t1, lines) => {
    const b = E.el(S.el, "abs", "left:60px;top:440px;width:960px;background:#2d3a33;border:14px solid #8a5a2b;border-radius:14px;padding:18px 26px;box-sizing:border-box;z-index:8;color:#f4efe2;font-family:'Comic Sans MS','Chalkboard SE',cursive;opacity:0;box-shadow:0 12px 26px rgba(0,0,0,.25)");
    E.el(b, "", "font-size:34px;font-weight:700;color:#f2c230;letter-spacing:.06em;margin-bottom:6px", "GRANDMA LOGIC™");
    lines.forEach(([txt, dt]) => { const el = E.el(b, "", "font-size:48px;font-weight:700;line-height:1.25;opacity:0;transform-origin:0 50%", txt); E.K(el, "o", [[t0 + dt - .01, 0], [t0 + dt, 1]]); E.K(el, "s", [[t0 + dt, 1.15], [t0 + dt + .2, 1, "out"]]); });
    E.pop(b, t0, { from: .4, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .1, 1], [t1 - .12, 1], [t1, 0]]);
  };
  board(WATER + .3, CORN - .05, [["1. Fish lives in water.", 0], ["2. Water is a vegetable.", 1.0], ["∴ Fish is a vegetable. ✓", 1.9]]);
  board(CORN + .3, PIG - .05, [["1. Chicken only eats corn.", 0], ["2. You are what you eat.", 1.1], ["∴ Chicken is corn. ✓", 2.4]]);

  // ---------------- HUD ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  E.F(t => { const s = t < VEG + 2.4 ? "SUNDAY LUNCH" : t < TOM ? `VEGETARIAN FOR: ${Math.floor(t - VEG - 2.4)} s` : "VEGETARIAN FOR: 15 s"; if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= TOM ? C.coralD : C.ink; });

  // ---------------- bubbles, stamp ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 50) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Grandma… I'm vegetarian now.", 40, 760, 520, 200, VEG, SCR - .05, 48);
  bubble("…Vegetarian?", 560, 700, 420, 220, Q, FISH - .05, 58);
  bubble("Okay. No problem. Just fish.", 480, 700, 540, 300, FISH, DOTS - .05, 48);
  bubble("…", 200, 900, 140, 60, DOTS, WATER - .05, 64);
  bubble("Fish lives in the water. Water is vegetable.", 460, 1000, 580, 330, WATER, CORN - .05, 44);
  bubble("The chicken only eats corn. So the chicken… is corn.", 440, 1000, 600, 340, CORN, PIG - .05, 42);
  bubble("Look! He is smiling. He is happy for you!", 30, 600, 540, 480, SMILE, TOM - .05, 46);
  bubble("…I'm vegetarian tomorrow.", 40, 880, 520, 200, TOM, DUR - .4, 50);
  const sb = E.el(S.el, "abs", "left:60px;top:470px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "VEGETARIAN: TOMORROW.", TOM + 1.4, { size: 84, rot: -6, bg: C.coralD, shake: 12 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  E.clip(VEG, "voices/ep67/o_veg.wav", { vol: 1.15 });
  E.S(SCR, "scratch", 1); E.clip(SCR + .4, "sfx/spoon-drop.wav", { vol: .9 });
  E.clip(Q, "voices/ep67/g_veg.wav", { vol: 1.25 });
  E.clip(FISH, "voices/ep67/g_fish.wav", { vol: 1.2 });
  E.clip(WATER, "voices/ep67/g_water.wav", { vol: 1.2 }); E.S(WATER + 2.3, "ding", .6);
  E.clip(CORN, "voices/ep67/g_corn.wav", { vol: 1.2 }); E.clip(CORN + .5, "sfx/pigeon-flutter.wav", { vol: .4, to: .6 }); E.S(CORN + 3.1, "ding", .6);
  E.S(PIG, "whoosh", .6); E.clip(PIG + .2, "sfx/angel-choir.wav", { vol: .6 });
  E.clip(SMILE, "voices/ep67/g_smile.wav", { vol: 1.2 });
  E.clip(TOM - .3, "sfx/munch.wav", { vol: .6 });
  E.clip(TOM, "voices/ep67/o_tomorrow.wav", { vol: 1.25 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "Telling grandma you're *vegetarian*", { size: 42, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[19.6, 1], [19.85, 1.18, "out"], [20.2, 1, "io"]]);
}
