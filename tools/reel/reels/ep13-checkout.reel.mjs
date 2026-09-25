// EP.13 "Grandma at the checkout" — she pays €11.37 in coins, one by one. The camera pans down the queue (it goes on forever),
// the clock spins, the cashier falls asleep, and Otto (next in line) ages into a long grey beard. She reaches €11.36 — one cent
// short — "…Oh! I have the card!" Universal joke. Paced so every beat can be read (see the reel-pacing note).
export const meta = {
  id: "ep13-checkout", date: "2026-10-06",
  images: {
    d_coins: "characters/cutouts/dona_coins.webp", d_card: "characters/cutouts/dona_card.webp",
    c_deadpan: "characters/cutouts/carimbo_deadpan.webp", c_asleep: "characters/cutouts/carimbo_bored-asleep.webp", c_surprised: "characters/cutouts/carimbo_surprised.webp",
    o_excited: "characters/cutouts/otto-casual_excited.webp", o_betrayed: "characters/cutouts/otto-casual_betrayed.webp",
    o_stubble: "characters/cutouts/otto-casual_stubble.webp", o_ancient: "characters/cutouts/otto-casual_ancient.webp",
    leo: "characters/cutouts/leo_default.webp", marta: "characters/cutouts/marta_default.webp", buck: "characters/cutouts/buck_default.webp",
    zoe: "characters/cutouts/zoe_default.webp", nico: "characters/cutouts/nico_default.webp",
    p_basket: "characters/props/basket.webp", p_milk: "characters/props/milk.webp", p_bread: "characters/props/bread-loaf.webp", p_bananas: "characters/props/bananas.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 57, seed: 131, prog: [[0, 4, 7], [5, 9, 12], [2, 5, 9], [7, 11, 14]] });
  const DUR = 14.4;
  const S = E.scene("shop", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FEET = 1880, COUNTER = 1390;
  const PAN0 = 4.1, PAN1 = 5.2, PAN2 = 6.0, PAN3 = 6.8, SHORT = 8.9, CARD = 10.6;

  // ---------------- the shop (the stage pans left along the queue) ----------------
  const stage = E.el(S.el, "abs", "inset:0");
  E.el(stage, "abs", "left:-2400px;top:0;width:3500px;height:1920px;background:#dfe9ee");
  E.el(stage, "abs", `left:-2400px;top:${COUNTER + 90}px;width:3500px;height:${1920 - COUNTER - 90}px;background:#cfd6da;background-image:linear-gradient(90deg,rgba(0,0,0,.06) 2px,transparent 2px);background-size:120px 100%`);
  // shelves full of colourful boxes behind everyone
  const colors = ["#ff7d63", "#f3b072", "#7fe0c0", "#6cb4ff", "#ffd23f", "#c58cff", "#ff9ec4"];
  for (let r = 0; r < 4; r++) {
    const y = 560 + r * 190;
    E.el(stage, "abs", `left:-2400px;top:${y + 150}px;width:3500px;height:18px;background:#9aa8b0`);
    for (let i = 0; i < 53; i++) E.el(stage, "abs", `left:${-2380 + i * 66 + (r % 2) * 20}px;top:${y + 40 + ((i * 7 + r) % 3) * 12}px;width:${44 + (i % 3) * 8}px;height:${110 - ((i * 7 + r) % 3) * 12}px;border-radius:6px;background:${colors[(i + r * 3) % 7]};opacity:.85`);
  }
  // the till: counter, conveyor, the display on a pole
  const counter = E.el(stage, "abs", `left:420px;top:${COUNTER}px;width:700px;height:${1920 - COUNTER}px;background:#3a4750;z-index:1`);
  E.el(counter, "abs", "left:0;top:0;width:100%;height:36px;background:#1f272d");
  E.el(stage, "abs", "left:930px;top:700px;width:22px;height:700px;background:#7c8a93");
  const disp = E.el(stage, "abs", `left:620px;top:520px;width:440px;height:200px;white-space:nowrap;border-radius:18px;background:#0d1b12;border:8px solid #5b6a73;display:flex;flex-direction:column;justify-content:center;padding:0 22px;font-weight:900;color:#5ff58f;z-index:1`);
  const dTop = E.el(disp, "", "font-size:38px;letter-spacing:.03em", "TOTAL €11.37");
  const dBot = E.el(disp, "", "font-size:50px;letter-spacing:.01em;margin-top:6px", "PAID €0.00");

  // the cashier (behind the counter)
  const CS = .8, CW = 730 * CS, CH = 1094 * CS;
  const cash = E.el(stage, "abs", `left:610px;top:${COUNTER - 700 * CS}px;width:${CW}px;height:${CH}px;z-index:0`);
  const CT = ["c_deadpan", "c_asleep", "c_surprised"];
  const cim = CT.map(n => E.img(cash, n, `position:absolute;left:0;top:0;width:${CW}px;height:${CH}px`));
  E.F(t => { const f = at([[0, "c_deadpan"], [6.4, "c_asleep"], [CARD + .6, "c_surprised"]], t); cim.forEach((im, i) => { im.style.opacity = CT[i] === f ? 1 : 0; }); });
  // z-z-z while he sleeps
  for (let i = 0; i < 3; i++) {
    const z = E.el(stage, "abs", `left:${900 + i * 30}px;top:${760 - i * 50}px;font-weight:900;font-size:${46 + i * 10}px;color:#4b5a63;opacity:0;z-index:2`, "z");
    const ks = []; for (let t = 6.6 + i * .3; t < CARD + .5; t += 1.1) ks.push([t, 0], [t + .3, 1], [t + .9, 0]);
    E.K(z, "o", ks);
  }
  // groceries on the conveyor
  const prop = (name, w, h, cx, bottom, s, z = 2) => { const W = w * s, H = h * s; const el = E.el(stage, "abs", `left:${cx - W / 2}px;top:${bottom - H}px;width:${W}px;height:${H}px;z-index:${z}`); E.img(el, name, `width:${W}px;height:${H}px`); return el; };
  prop("p_milk", 165, 267, 1010, COUNTER + 18, .55);
  prop("p_bread", 294, 183, 880, COUNTER + 18, .5);

  // ---------------- grandma (at the till) ----------------
  const DS = .86, DW = 684 * DS, DH = 1021 * DS;
  const dona = E.el(stage, "abs", `left:270px;top:${FEET - DH}px;width:${DW}px;height:${DH}px;z-index:3`);
  const DT = ["d_coins", "d_card"];
  const dim = DT.map(n => E.img(dona, n, `position:absolute;left:0;top:0;height:${DH}px;width:auto`));
  E.F(t => { const f = t >= CARD ? "d_card" : "d_coins"; dim.forEach((im, i) => { im.style.opacity = DT[i] === f ? 1 : 0; }); });
  const sway = []; for (let t = 0; t <= DUR; t += .7) sway.push([t, (Math.round(t / .7) % 2) ? -6 : 0, "io"]);
  E.K(dona, "y", sway);
  // coins hop from her hand to the counter, slowly
  const coinT = [.6, 1.3, 2.0, 2.8, 3.5, 7.0, 7.4, 7.8, 8.2, 8.6];
  coinT.forEach((t, i) => {
    const c = E.el(stage, "abs", `left:540px;top:1050px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffe28a,#d9a520);box-shadow:inset -3px -3px 0 #b8860b;z-index:4;opacity:0`);
    E.K(c, "o", [[t - .01, 0], [t, 1], [t + .45, 1], [t + .5, 0]]);
    E.K(c, "x", [[t, 0], [t + .45, 240 + (i % 3) * 30]]);
    E.K(c, "y", [[t, 0], [t + .2, -80, "out"], [t + .45, 330, "in"]]);
    E.S(t + .45, "tick", .9);
  });
  const paid = t => {
    const steps = [[0, 0], [.95, .05], [1.65, .10], [2.35, .12], [3.15, .17], [3.85, .22]];
    if (t < 6.8) return at(steps, t);
    if (t < 8.95) return .22 + (11.36 - .22) * Math.min(1, (t - 6.8) / 2.1);
    return 11.36;
  };
  E.F(t => {
    const v = paid(t);
    const s = t >= CARD + .6 ? "APPROVED ✓" : `PAID €${v.toFixed(2)}`; if (dBot.textContent !== s) dBot.textContent = s;
    const top = t >= SHORT && t < CARD + .6 ? "MISSING €0.01" : "TOTAL €11.37"; if (dTop.textContent !== top) dTop.textContent = top;
    dTop.style.color = t >= SHORT && t < CARD + .6 ? "#ff6b5b" : "#5ff58f";
  });

  // ---------------- the queue ----------------
  const OS = .88, OW = 625 * OS, OH = 1078 * OS;
  const otto = E.el(stage, "abs", `left:-40px;top:${FEET - OH}px;width:${OW}px;height:${OH}px;z-index:3`);
  const OT = ["o_excited", "o_betrayed", "o_stubble", "o_ancient"];
  const oim = OT.map(n => E.img(otto, n, `position:absolute;left:0;top:0;width:${OW}px;height:${OH}px`));
  E.F(t => { const f = at([[0, "o_excited"], [2.2, "o_betrayed"], [PAN3, "o_stubble"], [8.2, "o_ancient"]], t); oim.forEach((im, i) => { im.style.opacity = OT[i] === f ? 1 : 0; }); });
  prop("p_basket", 295, 245, -40 + 215 * OS, FEET - OH + 540 * OS, .62, 4);
  E.S(8.2, "poof", .8); E.flash(8.2, "#fff4c0", .25, .2);
  // everyone else, further down the line (off screen to the left until the pan)
  const Q = [["leo", 514, 1019, -560], ["marta", 498, 1017, -980], ["buck", 581, 976, -1400], ["zoe", 1075, 1818, -1840]];
  Q.forEach(([n, w, h, x], i) => {
    const s = (1000 - i * 60) / h, W = w * s, H = h * s;
    const el = E.el(stage, "abs", `left:${x}px;top:${FEET - H}px;width:${W}px;height:${H}px;z-index:3`);
    E.img(el, n, `width:${W}px;height:${H}px`);
    const k = []; for (let t = 0; t < DUR; t += .9) k.push([t, (Math.round(t / .9 + i) % 2) ? -8 : 0, "io"]);
    E.K(el, "y", k);
  });
  // tiny silhouettes: the line never ends
  for (let i = 0; i < 6; i++) E.el(stage, "abs", `left:${-2000 - i * 60}px;top:${FEET - 380 + i * 14}px;width:${70 - i * 6}px;height:${340 - i * 30}px;border-radius:40px 40px 10px 10px;background:rgba(80,95,110,${.5 - i * .06});z-index:2`);

  // the camera: pan left along the queue, hold, come back
  E.K(stage, "x", [[PAN0, 0], [PAN1, 1620, "io"], [PAN2, 1620], [PAN3, 0, "io"]]);
  E.S(PAN0, "whoosh", .7); E.S(PAN2, "whoosh", .6);

  // ---------------- the clock ----------------
  const clock = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:56px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7`, "18:02");
  const mins = t => t < 3.6 ? 18 * 60 + 2 : t < SHORT ? 18 * 60 + 2 + (21 * 60 + 15 - (18 * 60 + 2)) * Math.min(1, (t - 3.6) / (SHORT - 3.6)) : 21 * 60 + 15;
  E.F(t => { const m = mins(t), s = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(Math.floor(m % 60)).padStart(2, "0")}`; if (clock.textContent !== s) clock.textContent = s; });

  // ---------------- speech bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const box = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 78 : 60}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(box, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    E.S(t0 + .02, "pop", .6);
    return b;
  };
  bubble("Five… ten… twelve…", 180, 760, 560, "l", 1.1, 3.9);
  bubble("Ah… one cent short.", 150, 740, 600, "l", SHORT, CARD - .1, true);
  bubble("Oh! I have the card!", 150, 740, 600, "l", CARD + .05, 12.9, true);
  E.S(SHORT, "nope", .8); E.S(CARD + .6, "ding", .9); E.S(CARD + .65, "sparkle", .6);
  E.shake(CARD + .6, 8, .2);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Grandma at the *checkout*", { size: 58, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[13.4, 1], [13.65, 1.18, "out"], [14.0, 1, "io"]]);
}
