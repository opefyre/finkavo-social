// EP.59 "Bolo-Rei rules" — Christmas at the family table. Grandma: "Cuidado com a fava!" (careful with the bean!) The rule card: whoever
// finds the fava buys next year's Bolo-Rei. Slices go round; the family chews slowly, suspiciously; Otto munches happily — CRUNCH. A bean.
// The family points and cheers: "Pagas o próximo!" (you pay for the next one!) "…It's a bean." "Tradição!" ONE YEAR LATER: Otto arrives
// with the cake he paid for, takes the first bite — CRUNCH. Again. Voiced (grandma, family, Otto) + crunch, cheers.
export const meta = {
  id: "ep59-bolorei", date: "2026-11-21",
  images: {
    chew: "characters/cutouts/family_chew.webp", cheer: "characters/cutouts/family_cheer.webp", cake: "characters/props/bolo-rei.webp",
    oh: "characters/cutouts/otto-table_happy.webp", op: "characters/cutouts/otto-table_panic.webp", ol: "characters/cutouts/otto-table_plead.webp",
    coat: "characters/cutouts/otto-coat_cake.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 62, seed: 591, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 17.6, TABLE = 1480, FAVA = .5, SLICE = 2.7, CHEW = 3.3, CRUNCH = 6.6, PAGAS = 7.7, BEAN = 9.1, TRAD = 10.2, YEAR = 11.6, CRUNCH2 = 13.4, PAGAS2 = 14.2;
  const S = E.scene("xmas", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  // ---------------- the dining room ----------------
  E.el(S.el, "abs", "inset:0;background:#f3dcc0");
  E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:repeating-linear-gradient(90deg,rgba(160,60,40,.06) 0 50px,transparent 50px 100px)");
  const win = E.el(S.el, "abs", "left:640px;top:470px;width:300px;height:360px;border:16px solid #fff;border-radius:150px 150px 8px 8px;background:linear-gradient(180deg,#1b2a4a,#35507a);overflow:hidden");
  for (let i = 0; i < 12; i++) E.el(win, "abs", `left:${(i * 67) % 280}px;top:${(i * 43) % 320}px;width:6px;height:6px;border-radius:50%;background:#fff;opacity:.8`);
  // the tree
  const tree = E.el(S.el, "abs", "left:40px;top:560px;width:300px;height:520px");
  for (const [y, w] of [[0, 150], [120, 220], [250, 300]]) E.el(tree, "abs", `left:${150 - w / 2}px;top:${y}px;width:0;height:0;border-left:${w / 2}px solid transparent;border-right:${w / 2}px solid transparent;border-bottom:${220}px solid #2f7a3a`);
  E.el(tree, "abs", "left:130px;top:470px;width:40px;height:50px;background:#7a5230");
  E.el(tree, "abs", "left:126px;top:-40px;font-size:60px;color:#f2c230;line-height:1", "★");
  const balls = [[120, 90], [180, 150], [90, 200], [150, 260], [60, 330], [230, 320], [110, 400], [200, 420], [40, 450]].map(([x, y], i) => E.el(tree, "abs", `left:${x}px;top:${y}px;width:26px;height:26px;border-radius:50%;background:${["#e5484d", "#f2c230", "#4fb3e8"][i % 3]}`));
  E.F(t => balls.forEach((b, i) => { b.style.opacity = (Math.floor(t * 2.5 + i) % 3) ? 1 : .35; }));   // frame-0 motion: twinkle
  const garland = Array.from({ length: 14 }, (_, i) => E.el(S.el, "abs", `left:${i * 78 + 10}px;top:${440 + Math.sin(i / 13 * Math.PI) * 40}px;width:18px;height:18px;border-radius:50%;background:${["#e5484d", "#f2c230", "#2f9e6f"][i % 3]};box-shadow:0 0 10px 3px rgba(255,220,120,.6)`));
  E.F(t => garland.forEach((g, i) => { g.style.opacity = (Math.floor(t * 3 + i) % 2) ? 1 : .5; }));

  // ---------------- the family behind the table ----------------
  const FS = .76, FW = 1168 * FS, FH = 585 * FS, fam = E.el(S.el, "abs", `left:${620 - FW / 2}px;top:${TABLE + 20 - FH}px;width:${FW}px;height:${FH}px;z-index:2`);
  const f1 = E.img(fam, "chew", `position:absolute;left:0;top:0;width:${FW}px;height:${FH}px`);
  const f2 = E.img(fam, "cheer", `position:absolute;left:0;top:0;width:${FW}px;height:${FH}px;opacity:0`);
  E.F(t => { const c = (t >= PAGAS - .1 && t < YEAR) || t >= PAGAS2 - .1; f1.style.opacity = c ? 0 : 1; f2.style.opacity = c ? 1 : 0; });
  const chew = []; for (let t = CHEW; t < CRUNCH; t += .5) chew.push([t, 0, "io"], [t + .25, 5, "io"]);
  E.K(fam, "y", chew);
  const jump = []; for (const t0 of [PAGAS, PAGAS2]) for (let t = t0; t < t0 + 1.4; t += .35) jump.push([t, 0, "io"], [t + .17, -18, "io"]);
  E.K(fam, "sy", jump.map(([t, v, e]) => [t, 1 + v / -300, e]));
  // the table
  E.el(S.el, "abs", `left:0;top:${TABLE}px;width:1080px;height:${1920 - TABLE}px;background:#fbf7ef;z-index:3`);
  E.el(S.el, "abs", `left:0;top:${TABLE + 60}px;width:1080px;height:120px;background:repeating-linear-gradient(90deg,#c0392b 0 60px,#a93226 60px 120px);z-index:3`);
  const cake = E.el(S.el, "abs", `left:${650 - 891 * .5 / 2}px;top:${TABLE + 70 - 671 * .5}px;width:${891 * .5}px;height:${671 * .5}px;z-index:4`);
  E.img(cake, "cake", `width:${891 * .5}px;height:${671 * .5}px`);
  E.K(cake, "o", [[SLICE + .4, 1], [SLICE + .6, 0], [YEAR, 0], [YEAR + 1.4, 0], [YEAR + 1.6, 1]]);
  // slices flying out to everyone
  for (let k = 0; k < 5; k++) {
    const sl = E.el(S.el, "abs", `left:520px;top:${TABLE - 60}px;width:0;height:0;border-left:30px solid transparent;border-right:30px solid transparent;border-bottom:70px solid #e0a24a;z-index:5;opacity:0`);
    const t = SLICE + k * .12, tx = [-360, -180, 60, 250, -430][k], ty = [-230, -260, -250, -220, 80][k];
    E.K(sl, "o", [[t - .01, 0], [t, 1], [t + .45, 1], [t + .55, 0]]); E.K(sl, "x", [[t, 0], [t + .45, tx, "out"]]); E.K(sl, "y", [[t, 0], [t + .25, ty - 80, "out"], [t + .45, ty, "in"]]); E.S(t, "swish", .35);
  }

  // ---------------- Otto (front left, at the table) ----------------
  const OS = .64, ow = E.el(S.el, "abs", `left:-110px;top:${1920 - 1080 * OS + 40}px;width:${768 * OS}px;height:${1080 * OS}px;z-index:6`);
  const oIm = ["oh", "op", "ol"].map(n => [n, E.img(ow, n, `position:absolute;left:0;top:0;width:${768 * OS}px;height:${1080 * OS}px;opacity:0`)]);
  E.F(t => { const f = t >= YEAR && t < CRUNCH2 ? "none" : at([[0, "oh"], [CRUNCH, "op"], [BEAN - .1, "ol"], [TRAD + .6, "op"], [CRUNCH2, "op"]], t); oIm.forEach(([n, el]) => { el.style.opacity = n === f ? 1 : 0; }); });
  const munch = []; for (let t = CHEW; t < CRUNCH; t += .3) munch.push([t, 0, "io"], [t + .15, -10, "io"]);
  E.K(ow, "y", munch);
  E.shake(CRUNCH, 16); E.shake(CRUNCH2, 18);
  // the bean
  const bean = t0 => {
    const b = E.el(S.el, "abs", "left:300px;top:1400px;width:60px;height:40px;border-radius:50% 50% 45% 45%;background:radial-gradient(circle at 35% 35%,#d9b27a,#8a5a2b);border:4px solid #5a3a1c;z-index:9;opacity:0");
    E.K(b, "o", [[t0 - .01, 0], [t0, 1], [t0 + 3.0, 1], [t0 + 3.1, 0]]);
    E.K(b, "y", [[t0, 0], [t0 + .35, -380, "out"], [t0 + .8, 70, "in"]]); E.K(b, "x", [[t0, 0], [t0 + .8, 150]]); E.K(b, "r", [[t0, 0], [t0 + .8, 540]]);
    E.K(b, "s", [[t0 + .8, 1], [t0 + 1.0, 1.6, "out"], [t0 + 1.3, 1.4, "io"]]);
    const lab = E.el(S.el, "abs", "left:540px;top:1470px;background:#fff;border-radius:12px;padding:4px 14px;font-weight:900;font-size:34px;color:#8a5a2b;z-index:9;opacity:0;box-shadow:0 6px 14px rgba(0,0,0,.2)", "← A FAVA");
    E.K(lab, "o", [[t0 + .9, 0], [t0 + 1.0, 1], [t0 + 3.0, 1], [t0 + 3.1, 0]]);
  };
  bean(CRUNCH); bean(CRUNCH2);
  // one year later: Otto brings the cake
  const oc = E.el(S.el, "abs", `left:-40px;top:${1920 - 1081 * .72 + 60}px;width:${629 * .72}px;height:${1081 * .72}px;z-index:6;opacity:0`);
  E.img(oc, "coat", `width:${629 * .72}px;height:${1081 * .72}px`);
  E.K(oc, "o", [[YEAR + .5, 0], [YEAR + .51, 1], [CRUNCH2 - .21, 1], [CRUNCH2 - .2, 0]]); E.K(oc, "x", [[YEAR + .5, -500], [YEAR + 1.0, 0, "out"]]);
  const card = E.el(S.el, "abs", "inset:0;z-index:12;background:#1d2b36;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:90px;opacity:0", "ONE YEAR LATER…");
  E.K(card, "o", [[YEAR - .01, 0], [YEAR, 1], [YEAR + .5, 1], [YEAR + .7, 0]]);

  // ---------------- HUD, rule card ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:#b0243a;color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  E.F(t => { const s = t < YEAR ? (t < CRUNCH ? "CHRISTMAS · 1 CAKE, 1 BEAN" : "BEAN FOUND BY: OTTO") : (t < CRUNCH2 ? "NEXT CHRISTMAS · PAID BY: OTTO" : "BEAN FOUND BY: OTTO. AGAIN."); if (pill.textContent !== s) pill.textContent = s; });
  const rule = E.el(S.el, "abs", "left:560px;top:600px;width:470px;background:#fffdf3;border:6px solid #b0243a;border-radius:18px;padding:14px 18px;box-sizing:border-box;z-index:8;box-shadow:0 10px 24px rgba(0,0,0,.2);transform:rotate(2deg)");
  E.el(rule, "", "font-weight:900;font-size:36px;color:#b0243a", "THE RULE:");
  E.el(rule, "", `font-weight:800;font-size:32px;color:${C.ink};line-height:1.15;margin-top:4px`, "Whoever finds the fava (the bean) buys next year's Bolo-Rei.");
  E.pop(rule, FAVA + 1.4, { from: .3, dur: .3 }); E.K(rule, "o", [[FAVA + 1.4, 0], [FAVA + 1.5, 1], [CHEW + 1.2, 1], [CHEW + 1.4, 0]]);

  // ---------------- bubbles, stamp ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 50) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble(`Cuidado com a fava!${sub("(Careful with the bean!)")}`, 140, 880, 480, 250, FAVA, FAVA + 1.9, 48);
  bubble("…", 120, 900, 140, 50, CHEW + .8, CRUNCH - .1, 60);
  bubble("…", 820, 900, 140, 50, CHEW + 1.2, CRUNCH - .1, 60);
  bubble(`Pagas o próximo!${sub("(You pay for the next one!)")}`, 300, 800, 520, 200, PAGAS, BEAN - .05, 52);
  bubble("…It's a bean.", 40, 1180, 380, 150, BEAN, TRAD - .05, 52);
  bubble(`Tradição!${sub("(Tradition!)")}`, 420, 820, 360, 120, TRAD, YEAR - .1, 56);
  bubble(`Pagas o próximo!`, 300, 820, 520, 200, PAGAS2, DUR - .4, 54);
  const sb = E.el(S.el, "abs", "left:60px;top:470px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "PAGAS O PRÓXIMO.", PAGAS2 + 1.2, { size: 96, rot: -6, bg: "#b0243a", shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  E.clip(0, "sfx/wedding-party.wav", { vol: .14, duck: false });
  E.clip(FAVA, "voices/ep59/g_fava.wav", { vol: 1.15 });
  for (let k = 0; k < 6; k++) E.clip(CHEW + k * .5, "sfx/munch.wav", { vol: .5, to: .4 });
  for (let k = 0; k < 8; k++) E.S(CHEW + .2 + k * .4, "tick", .35);
  E.clip(CRUNCH, "sfx/crunch.wav", { vol: 1.3 }); E.S(CRUNCH + .8, "ding", .6); E.S(CRUNCH + .1, "scratch", .7);
  E.clip(PAGAS, "voices/ep59/c_pagas.wav", { vol: 1.2 }); E.clip(PAGAS + .2, "sfx/applause-cheer.wav", { vol: .7 });
  E.clip(BEAN, "voices/ep59/o_bean.wav", { vol: 1.2 });
  E.clip(TRAD, "voices/ep59/g_tradicao.wav", { vol: 1.2 });
  E.S(YEAR, "whoosh", .6); E.clip(YEAR + .6, "sfx/door-open.wav", { vol: .5, to: .6 });
  E.clip(CRUNCH2, "sfx/crunch.wav", { vol: 1.4 }); E.S(CRUNCH2 + .8, "ding", .6);
  E.clip(PAGAS2, "voices/ep59/c_pagas.wav", { vol: 1.2 }); E.clip(PAGAS2 + .2, "sfx/applause-cheer.wav", { vol: .8 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "The *Bolo-Rei* rule", { size: 58, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[16.8, 1], [17.05, 1.18, "out"], [17.4, 1, "io"]]);
}
