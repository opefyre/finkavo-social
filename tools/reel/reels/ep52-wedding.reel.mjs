// EP.52 "A Portuguese wedding" — 14:00, Otto at the table in a suit: "just a light lunch". Course after course lands (the waiter:
// "Mais um pratinho?"), the COURSE counter climbs to 9, a shirt button pops: "I can't… I physically can't." 19:00: the cake, the
// newlyweds dance. 22:00: grandma drags him onto the dance floor ("Anda dançar!"). 03:00: he's asleep on his chair, the party is
// still going… the waiter bursts in: "CALDO VERDE!" and the hall cheers. Voiced (waiter, grandma, Otto) + party effects.
export const meta = {
  id: "ep52-wedding", date: "2026-11-14",
  images: {
    oh: "characters/cutouts/otto-suit_happy.webp", os: "characters/cutouts/otto-suit_stuffed.webp", oz: "characters/cutouts/otto-suit_asleep.webp",
    od: "characters/cutouts/otto-suit_dragged.webp", gd: "characters/cutouts/dona_dance.webp", bg: "characters/cutouts/bride_groom.webp",
    wt: "characters/cutouts/waiter_tray.webp",
    soup: "characters/props/food_soup.webp", bac: "characters/props/food_bacalhau.webp", cho: "characters/props/food_chourico.webp", rice: "characters/props/food_rice.webp",
    sard: "characters/props/couvert-sardines.webp", bread: "characters/props/food_bread.webp", cake: "characters/props/food_cake.webp", nata: "characters/props/food_natas.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 118, root: 60, seed: 521, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 17.8, TOP = 1520, FEAST = .9, CAKE = 6.4, DANCE = 8.6, SLEEP = 11.8, CALDO = 14.2;
  const S = E.scene("wedding", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  // ---------------- the hall ----------------
  const wall = E.el(S.el, "abs", "inset:0");
  E.F(t => { const n = t >= DANCE ? 1 : 0; wall.style.background = n ? "linear-gradient(180deg,#3a2350,#5a2f5a)" : "linear-gradient(180deg,#fbe7d0,#f5d6b8)"; });
  E.el(S.el, "abs", "left:0;top:1100px;width:1080px;height:40px;background:rgba(0,0,0,.06)");
  const lights = Array.from({ length: 16 }, (_, i) => E.el(S.el, "abs", `left:${i * 70 + 10}px;top:${640 + Math.sin(i / 15 * Math.PI) * 60}px;width:22px;height:22px;border-radius:50%;background:#ffd23f;box-shadow:0 0 14px 4px rgba(255,210,63,.7)`));
  E.el(S.el, "abs", "left:0;top:630px;width:1080px;height:120px;border-top:4px solid #8a6a4a;border-radius:50%");
  E.F(t => lights.forEach((l, i) => { l.style.opacity = (Math.floor(t * 3 + i) % 3) ? 1 : .45; l.style.background = t >= DANCE ? ["#ff4fc3", "#4fd8ff", "#ffd23f"][i % 3] : "#ffd23f"; }));
  const ban = E.el(S.el, "abs", "left:190px;top:760px;width:700px;height:110px;background:#fff;border:6px solid #e8b4c4;border-radius:18px;display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:58px;color:#b0476e;box-shadow:0 8px 16px rgba(0,0,0,.12)", "♥ Ana & Rui ♥");
  // the newlyweds dancing in the background (from the cake onwards)
  const nw = E.el(S.el, "abs", `left:${540 - 851 * .55 / 2}px;top:${TOP - 1002 * .55 + 30}px;width:${851 * .55}px;height:${1002 * .55}px;opacity:0;transform-origin:50% 100%`);
  E.img(nw, "bg", `width:${851 * .55}px;height:${1002 * .55}px`);
  E.K(nw, "o", [[CAKE - .01, 0], [CAKE, 1], [DANCE - .01, 1], [DANCE, 0], [SLEEP - .01, 0], [SLEEP, 1]]);
  const sway = []; for (let t = CAKE; t < DUR; t += .7) sway.push([t, -4, "io"], [t + .35, 4, "io"]);
  E.K(nw, "r", sway); E.K(nw, "x", [[CAKE, 300], [DANCE, 320], [SLEEP, 300], [DUR, 330]]);

  // ---------------- Otto at the table ----------------
  const OS = .95, OW = 672 * OS, OH = 1057 * OS, ot = E.el(S.el, "abs", `left:${540 - OW / 2}px;top:${TOP - OH * .58}px;width:${OW}px;height:${OH}px;z-index:2;transform-origin:50% 100%`);
  const oIm = ["oh", "os", "oz"].map(n => [n, E.img(ot, n, `position:absolute;left:0;top:0;width:${OW}px;height:${OH}px;opacity:0`)]);
  E.F(t => { const f = at([[0, "oh"], [3.0, "os"], [SLEEP, "oz"], [CALDO + .5, "os"]], t); oIm.forEach(([n, el]) => { el.style.opacity = n === f ? 1 : 0; }); ot.style.opacity = t >= DANCE && t < SLEEP ? 0 : 1; });
  const ob = []; for (let t = 0; t < 3; t += .8) ob.push([t, 0, "io"], [t + .4, -8, "io"]);
  E.K(ot, "y", ob);                                                                                                     // frame-0 motion
  E.K(ot, "sx", [[2.9, 1], [3.1, 1.08, "out"], [3.3, 1.04, "io"]]);
  const btn = E.el(S.el, "abs", "left:530px;top:1290px;width:26px;height:26px;border-radius:50%;background:#e9e2d0;border:4px solid #8a7a5a;z-index:6;opacity:0");
  E.K(btn, "o", [[3.4 - .01, 0], [3.4, 1], [4.4, 1], [4.5, 0]]); E.K(btn, "x", [[3.4, 0], [4.4, 420]]); E.K(btn, "y", [[3.4, 0], [3.7, -300, "out"], [4.4, 260, "in"]]);
  // the table
  E.el(S.el, "abs", `left:0;top:${TOP}px;width:1080px;height:40px;background:#fff;z-index:3;box-shadow:0 -4px 0 rgba(0,0,0,.05)`);
  E.el(S.el, "abs", `left:0;top:${TOP + 40}px;width:1080px;height:${1920 - TOP - 40}px;background:linear-gradient(180deg,#fdfbf6,#efe7d6);z-index:3`);
  E.el(S.el, "abs", `left:0;top:${TOP + 40}px;width:1080px;height:60px;z-index:3;background:radial-gradient(circle at 40px 0,#fff 36px,transparent 37px);background-size:80px 60px`);
  // courses land in front of him; the counter climbs
  const DISH = [["soup", 203, 184, 1.0], ["bac", 241, 167, 1.55], ["cho", 220, 142, 2.1], ["rice", 238, 155, 2.6], ["sard", 309, 223, 3.15], ["bread", 221, 199, 3.7], ["bac", 241, 167, 4.25], ["nata", 235, 150, 4.8], ["cake", 211, 204, CAKE + .2]];
  DISH.forEach(([n, w, h, t], i) => {
    const s = .95, x = [440, 160, 700, 250, 620, 90, 800, 340, 430][i], el = E.el(S.el, "abs", `left:${x}px;top:${TOP + 30 - h * s}px;width:${w * s}px;height:${h * s}px;z-index:4;opacity:0;transform-origin:50% 100%`);
    E.img(el, n, `width:${w * s}px;height:${h * s}px`);
    const t1 = i < 8 ? (DISH[i + 1] ? Math.min(DISH[i + 1][3], CAKE) : CAKE) + (i < 7 ? 1.6 : 0) : DANCE;
    E.K(el, "o", [[t - .01, 0], [t, 1], [Math.max(t + .5, DANCE - .01), 1], [Math.max(t + .51, DANCE), 0]]);
    E.K(el, "y", [[t, -600], [t + .22, 0, "in"]]); E.K(el, "s", [[t + .22, 1.15], [t + .4, 1, "out"]]);
    E.S(t + .22, "thud", .45);
  });
  const soup3 = E.el(S.el, "abs", `left:${540 - 203 * .6}px;top:${TOP + 30 - 184 * 1.2}px;width:${203 * 1.2}px;height:${184 * 1.2}px;z-index:5;opacity:0;filter:hue-rotate(70deg) saturate(1.3)`);
  E.img(soup3, "soup", `width:${203 * 1.2}px;height:${184 * 1.2}px`);
  E.K(soup3, "o", [[CALDO + .3, 0], [CALDO + .31, 1]]); E.K(soup3, "y", [[CALDO + .3, -700], [CALDO + .55, 0, "in"]]); E.K(soup3, "s", [[CALDO + .55, 1.2], [CALDO + .75, 1, "out"]]);
  const steam = [0, 1, 2].map(i => E.el(S.el, "abs", `left:${520 + (i - 1) * 40}px;top:${TOP - 200}px;width:30px;height:60px;border-radius:50%;background:rgba(255,255,255,.85);z-index:5;opacity:0`));
  E.F(t => steam.forEach((s, i) => { const u = ((t + i * .4) % 1.2) / 1.2; s.style.opacity = t > CALDO + .6 ? (1 - u) * .9 : 0; s.style.transform = `translate(${Math.sin(u * 6 + i) * 10}px,${-u * 140}px)`; }));

  // ---------------- the waiter (keeps coming back) ----------------
  const wt = E.el(S.el, "abs", `left:640px;top:${TOP + 60 - 1050 * .85}px;width:${628 * .85}px;height:${1050 * .85}px;z-index:2;opacity:0`);
  E.img(wt, "wt", `width:${628 * .85}px;height:${1050 * .85}px`);
  const WIN = [[.9, 2.3], [3.4, 4.6], [CALDO, CALDO + 2.2]];
  E.F(t => { let x = 500, on = false; for (const [a, b] of WIN) if (t >= a - .05 && t < b + .3) { on = true; const u = Math.min(1, (t - a) / .3), v = Math.max(0, (t - b) / .3); x = 500 * (1 - u) + 500 * v; } wt.style.opacity = on ? 1 : 0; wt.style.transform = `translateX(${x}px)`; });

  // ---------------- the dance floor ----------------
  const dg = E.el(S.el, "abs", `left:470px;top:${1620 - 1027 * .72}px;width:${776 * .72}px;height:${1027 * .72}px;z-index:6;opacity:0`);
  E.img(dg, "gd", `width:${776 * .72}px;height:${1027 * .72}px`);
  const dd = E.el(S.el, "abs", `left:-60px;top:${1620 - 913 * .72}px;width:${848 * .72}px;height:${913 * .72}px;z-index:6;opacity:0`);
  E.img(dd, "od", `width:${848 * .72}px;height:${913 * .72}px`);
  [dg, dd].forEach(el => { E.K(el, "o", [[DANCE - .01, 0], [DANCE, 1], [SLEEP - .01, 1], [SLEEP, 0]]); E.K(el, "x", [[DANCE, -500], [DANCE + .4, 0, "out"], [SLEEP - .8, 120, "io"]]); });
  const spin = []; for (let t = DANCE + .4; t < SLEEP; t += .5) spin.push([t, -5, "io"], [t + .25, 5, "io"]);
  E.K(dg, "r", spin); E.K(dd, "r", spin.map(([t, v, e]) => [t + .1, -v * 1.4, e]));
  const floorLights = E.el(S.el, "abs", "left:0;top:1620px;width:1080px;height:300px;z-index:5;opacity:0;background:repeating-linear-gradient(90deg,#ff4fc3 0 120px,#4fd8ff 120px 240px,#ffd23f 240px 360px)");
  E.K(floorLights, "o", [[DANCE - .01, 0], [DANCE, .85], [SLEEP - .01, .85], [SLEEP, 0]]);
  E.F(t => { floorLights.style.backgroundPosition = `${Math.floor(t * 3) * 120}px 0`; });

  // ---------------- HUD ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:52px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  const CLK = [[0, "14:00 · LUNCH"], [2.1, "15:30"], [3.7, "17:00"], [CAKE, "19:00 · CAKE"], [DANCE, "22:00 · DANCING"], [SLEEP, "02:00"], [13.0, "03:00"]];
  E.F(t => { const s = at(CLK, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= DANCE ? "#ff4fc3" : C.ink; });
  CLK.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.2], [t + .2, 1, "out"]]));
  const cnt = E.el(S.el, "abs", "left:700px;top:470px;background:#fff;border-radius:18px;padding:8px 18px;font-weight:900;font-size:40px;color:#b0476e;z-index:9;box-shadow:0 6px 14px rgba(0,0,0,.15);opacity:0", "");
  E.F(t => { const n = DISH.filter(d => t >= d[3]).length + (t >= CALDO + .3 ? 1 : 0), s = `COURSE ${n}`; if (cnt.textContent !== s) cnt.textContent = s; cnt.style.opacity = n ? 1 : 0; });
  DISH.forEach(d => E.K(cnt, "s", [[d[3] - .01, 1], [d[3], 1.25], [d[3] + .2, 1, "out"]]));
  E.K(cnt, "s", [[CALDO + .29, 1], [CALDO + .3, 1.35], [CALDO + .55, 1, "out"]]);

  // ---------------- bubbles, stamp ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 54) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:32px;padding:18px 26px 22px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble("Just a light lunch.", 60, 560, 400, 260, .2, .95, 50);
  bubble(`Mais um pratinho?${sub("(Another little dish?)")}`, 560, 560, 480, 300, 1.2, 2.3, 48);
  bubble(`Mais um pratinho?!`, 560, 560, 480, 300, 3.6, 4.55, 50);
  bubble("I can't… I physically can't.", 40, 580, 520, 300, 4.6, CAKE - .1, 48);
  bubble(`Anda dançar!${sub("(Come dance!)")}`, 560, 560, 440, 180, DANCE + .2, DANCE + 1.9, 54);
  bubble(`CALDO VERDE!${sub("(the 3am soup)")}`, 520, 560, 500, 300, CALDO + .1, DUR - .5, 58);
  const sb = E.el(S.el, "abs", "left:60px;top:1560px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "14:00 → 04:00.", CALDO + 1.4, { size: 100, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  for (let k = 0; k < 4; k++) E.clip(k * 4.6, "sfx/wedding-party.wav", { vol: .3, duck: false, to: Math.min(4.6, DUR - k * 4.6) });
  E.clip(1.2, "voices/ep52/w_prato1.wav", { vol: 1.15 }); E.clip(3.6, "voices/ep52/w_prato2.wav", { vol: 1.2 });
  E.S(3.4, "pop", .9);
  E.clip(4.6, "voices/ep52/o_cant.wav", { vol: 1.15 });
  E.clip(CAKE + .1, "sfx/glass-clink.wav", { vol: 1.2 }); E.clip(CAKE + .4, "sfx/applause-cheer.wav", { vol: .45 });
  E.clip(DANCE + .2, "voices/ep52/g_danca.wav", { vol: 1.15 });
  E.clip(SLEEP + .3, "sfx/snore.wav", { vol: .6 });
  E.clip(CALDO + .1, "voices/ep52/w_caldo.wav", { vol: 1.2 }); E.clip(CALDO + .5, "sfx/applause-cheer.wav", { vol: .7 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.95);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "A Portuguese *wedding*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[17.0, 1], [17.25, 1.18, "out"], [17.6, 1, "io"]]);
}
