// EP.97 "Splitting the bill in Portugal" — dinner with Tiago and Rui. Buck, cheerful: "Great dinner, guys! So, let's split it. You each owe
// me twelve-forty." Record scratch. "Split?!" The bill war: "No, no, no! I pay!" "Are you crazy?! I pay!" A tug-of-war, a credit card thrown
// like a ninja star, a sprint to the till, the waiter holding three cards — while Buck quietly slips away. He comes back with the receipt:
// "Guys. Relax. I already paid." Silence. "You… PAID?" Rui: "Fine. Then I pay the coffees!" Tiago: "Over my dead body!" ROUND 2.
export const meta = {
  id: "ep97-split", date: "2026-12-29",
  images: {
    bg: "characters/scenes/bg_tasca.webp", ti: "characters/cutouts/tiago_date.webp", ru: "characters/cutouts/rui_wave.webp", bh: "characters/cutouts/buck-chair_hand.webp",
    tug: "characters/cutouts/friends_tug.webp", thr: "characters/cutouts/rui_throw.webp", spr: "characters/cutouts/tiago_sprint.webp", hurt: "characters/cutouts/friends_hurt.webp",
    wc: "characters/cutouts/waiter_cards.webp", br: "characters/cutouts/buck_receipt.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 126, root: 52, seed: 971, prog: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]] });
  const DUR = 23.6, SPLIT = .3, GASP = 5.2, IPAY = 6.1, CRAZY = 8.1, THROW = 10.2, SPRINT = 11.0, WAITER = 11.9, PAID = 13.3, YOU = 16.8, COFFEE = 18.4,
    DEAD = 20.2, STAMP = 22.0;
  const S = E.scene("split", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  E.el(S.el, "abs", "inset:0;background:rgba(30,20,10,.12)");
  // the table (foreground, drawn): checked cloth, plates, glasses, the bill
  const tbl = E.el(S.el, "abs", "left:-20px;top:1700px;width:1120px;height:260px;z-index:6;background-color:#fff;background-image:linear-gradient(45deg,rgba(214,48,49,.85) 25%,transparent 25%,transparent 75%,rgba(214,48,49,.85) 75%),linear-gradient(45deg,rgba(214,48,49,.85) 25%,transparent 25%,transparent 75%,rgba(214,48,49,.85) 75%);background-size:60px 60px;background-position:0 0,30px 30px;border-radius:16px 16px 0 0;box-shadow:0 -8px 20px rgba(0,0,0,.25)");
  [[120, 1730], [470, 1745], [820, 1730]].forEach(([x, y]) => { E.el(S.el, "abs", `left:${x}px;top:${y}px;width:170px;height:70px;border-radius:50%;background:#fff;border:5px solid #d7dde2;box-sizing:border-box;z-index:7`); });
  [[330, 1690], [690, 1690]].forEach(([x, y]) => E.el(S.el, "abs", `left:${x}px;top:${y}px;width:46px;height:74px;border-radius:6px 6px 14px 14px;background:rgba(170,40,60,.75);border:4px solid rgba(255,255,255,.8);box-sizing:border-box;z-index:7`));
  const bill = E.el(S.el, "abs", "left:600px;top:1770px;width:120px;height:150px;background:#fffdf5;border-radius:6px;z-index:8;box-shadow:0 6px 14px rgba(0,0,0,.25);padding:14px 12px;box-sizing:border-box");
  [0, 1, 2, 3].forEach(i => E.el(bill, "", `height:8px;margin:10px 0;border-radius:4px;background:#c9ced3;width:${[90, 70, 85, 55][i]}%`));
  E.el(bill, "", "font-weight:900;font-size:22px;color:#1d2b36;text-align:right", "€37.20");
  show(bill, [[0, IPAY]]); E.K(bill, "r", [[0, -6]]);

  // cast: opening (seated), the war, the return
  const ti = fig("ti", 613, 1127, .7, 10, 1880, 4), ru = fig("ru", 527, 1016, .62, 350, 1640, 3), bh = fig("bh", 572, 1118, .7, 660, 1880, 4);
  show(ti, [[0, IPAY]]); show(ru, [[0, IPAY]]); show(bh, [[0, IPAY + 1.2]]);
  E.K(bh, "x", [[IPAY + .3, 0], [IPAY + 1.2, 460, "in"]]); E.K(bh, "y", [[0, 0], [.4, -6, "io"], [.8, 0, "io"], [1.2, -6, "io"], [1.6, 0, "io"]]);   // frame-0 motion
  const shake = (el, t0, t1, a = 4) => { const k = []; for (let t = t0; t < t1; t += .08) k.push([t, (Math.round(t * 12.5) % 2) ? a : -a]); E.K(el, "x", k); };
  shake(ti, GASP, IPAY, 3); shake(ru, GASP, IPAY, 3);
  const tug = fig("tug", 1054, 796, .72, 10, 1760, 5); show(tug, [[IPAY, THROW], [WAITER, PAID + .4], [DEAD, DUR]]); shake(tug, IPAY, THROW, 5); shake(tug, DEAD, DUR, 5);
  E.pop(tug, IPAY, { from: .85, dur: .25 });
  const thr = fig("thr", 661, 755, .8, 40, 1760, 5); show(thr, [[THROW, WAITER]]);
  const card = E.el(S.el, "abs", `left:520px;top:1170px;width:96px;height:62px;border-radius:9px;background:linear-gradient(135deg,#2b5fb8,#1b3a73);border:3px solid #fff;z-index:9;opacity:0`);
  show(card, [[THROW + .1, SPRINT]]); E.K(card, "x", [[THROW + .1, 0], [SPRINT, 620, "lin"]]); E.K(card, "r", [[THROW + .1, 0], [SPRINT, 1080, "lin"]]);
  const spr = fig("spr", 639, 967, .74, 0, 1780, 6); show(spr, [[SPRINT, WAITER]]); E.K(spr, "x", [[SPRINT, -480], [WAITER, 1100, "lin"]]);
  const wc = fig("wc", 500, 952, .7, 725, 1760, 4); show(wc, [[WAITER, PAID]]); E.pop(wc, WAITER, { from: .8, dur: .3 });
  const hurt = fig("hurt", 821, 843, .76, 20, 1760, 5); show(hurt, [[PAID + .4, DEAD]]);
  const br = fig("br", 480, 937, .78, 700, 1760, 4); show(br, [[PAID, DUR]]); E.K(br, "x", [[PAID, 420], [PAID + .45, 0, "out"]]);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "DINNER FOR 3 · €37.20"], [GASP, "“SPLIT” = AN INSULT"], [IPAY, "THE BILL WAR"], [THROW, "CARDS THROWN: 1"], [WAITER, "CARDS AT THE TILL: 3"],
    [PAID, "PAID BY: THE AMERICAN"], [COFFEE, "THE COFFEE WAR"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= GASP ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Great dinner, guys! So, let's split it. You each owe me €12.40.", 440, 780, 600, 380, SPLIT, GASP - .05, 42);
  bubble("Split?!", 60, 870, 260, 120, GASP, IPAY - .05, 56);
  bubble("No, no, no! I pay!", 30, 860, 420, 150, IPAY, CRAZY - .05, 48);
  bubble("Are you crazy?! I pay!", 420, 860, 460, 260, CRAZY, THROW - .05, 46);
  bubble("Guys. Relax. I already paid.", 500, 790, 540, 330, PAID, YOU - .05, 46);
  bubble("You… PAID?", 40, 880, 360, 150, YOU, COFFEE - .05, 52);
  bubble("Fine. Then I pay the coffees!", 260, 860, 520, 250, COFFEE, DEAD - .05, 44);
  bubble("Over my dead body!", 30, 860, 420, 150, DEAD, DUR - .3, 46);
  const sb = E.el(S.el, "abs", "left:60px;top:560px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "ROUND 2.", STAMP, { size: 130, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/restaurant.wav", { vol: .4, duck: false, to: DUR });
  E.clip(SPLIT, "voices/ep97/b_split.wav", { vol: 1.2 });
  E.S(GASP - .1, "scratch", .7); E.clip(GASP, "voices/ep97/t_split.wav", { vol: 1.35 });
  E.clip(IPAY, "voices/ep97/t_ipay.wav", { vol: 1.3 }); E.clip(IPAY, "sfx/crowd-ooh.wav", { vol: .35, to: 1.5 });
  E.clip(CRAZY, "voices/ep97/r_crazy.wav", { vol: 1.3 });
  E.S(THROW, "whoosh", .6); E.S(SPRINT - .05, "smack", .5); E.clip(SPRINT, "sfx/stairs-run.wav", { vol: .6, to: .9 });
  E.clip(WAITER, "sfx/elx-register.wav", { vol: .6, to: 1 });
  E.S(PAID - .1, "whoosh", .4); E.clip(PAID, "voices/ep97/b_paid.wav", { vol: 1.2 });
  E.clip(YOU - .2, "sfx/record-silence.wav", { vol: .5 }); E.clip(YOU, "voices/ep97/t_you.wav", { vol: 1.35 });
  E.clip(COFFEE, "voices/ep97/r_coffee.wav", { vol: 1.3 });
  E.clip(DEAD, "voices/ep97/t_dead.wav", { vol: 1.3 }); E.S(DEAD, "smack", .5);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Splitting the bill in *Portugal*", { size: 50, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[22.8, 1], [23.05, 1.18, "out"], [23.4, 1, "io"]]);
}
