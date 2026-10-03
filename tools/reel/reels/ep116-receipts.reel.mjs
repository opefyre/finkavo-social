// EP.116 "Grandma keeps every receipt" — Otto, tired and polite: "Grandma, I need the invoices for my tax return." Grandma: "Ai, filho. One moment." The hallway cupboard opens and an avalanche
// of paper buries her: "Guarda tudo!" (Keep everything!) Out come: a 1987 toaster receipt ("still under guarantee"), an envelope with Otto's first tooth ("dente"). Otto: "Grandma… it's been thirty-eight years."
// "I just need March. From last year." Grandma, calm, pulls one receipt in half a second: "Here." Otto: "…How?" "Guarda tudo." Otto: "Grandma. Do you have the receipt… for this box?" Grandma: "Of course."
// (the 1991 receipt for the shoebox). Stamp: RECEIPTS: 38 YEARS · LOST: 0.
export const meta = {
  id: "ep116-receipts", date: "2027-01-17",
  images: {
    bg: "characters/scenes/bg_cupboard.webp",
    o1: "characters/cutouts/otto-casual_shrug.webp", o2: "characters/cutouts/otto-casual_jawdrop.webp", o3: "characters/cutouts/otto-casual_awkward.webp",
    g1: "characters/cutouts/dona_knowing.webp", g2: "characters/cutouts/dona_buried.webp", g3: "characters/cutouts/dona_receipt.webp",
    toaster: "characters/props/paper-toaster.webp", env: "characters/props/paper-envelope.webp", box: "characters/props/paper-shoebox.webp",
    cert: "characters/props/paper-certificate.webp", cass: "characters/props/paper-cassette.webp", boxes: "characters/props/paper-boxes.webp", cat: "characters/props/paper-cat.webp", stack: "characters/props/paper-stack.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 50, seed: 1161, prog: [[0, 3, 7], [5, 8, 12], [7, 10, 14], [3, 7, 10]] });
  const DUR = 29.6, INV = .3, MOM = 3.4, AVAL = 5.9, GU1 = 6.2, TOAST = 8.1, THIRTY = 10.9, TOOTH = 13.8, MARCH = 15.7, HERE = 18.4, HOW = 19.3, GU2 = 20.5, BOX = 22.2, COURSE = 25.4, STAMP = 26.9;
  const S = E.scene("receipts", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  E.img(S.el, "bg", BG);
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };
  const FL = 1850;

  // ---- Otto (left)
  const o1 = fig(S.el, "o1", 702, 1055, .6, 200, FL, 6), o2 = fig(S.el, "o2", 398, 1044, .62, 200, FL, 6), o3 = fig(S.el, "o3", 488, 1078, .6, 200, FL, 6);
  E.F(t => { const k = t < THIRTY - .05 ? 0 : t < MARCH ? 1 : t < HERE ? 0 : t < GU2 ? 1 : 2; [o1, o2, o3].forEach((o, i) => { o.style.opacity = i === (k === 0 ? 0 : k === 1 ? 1 : 2) ? 1 : 0; }); });
  bob(o1, 0, DUR, 5, .7); bob(o2, 0, DUR, 5, .5); bob(o3, 0, DUR, 5, .7);

  // ---- Grandma (right): standing → buried → proud
  const g1 = fig(S.el, "g1", 665, 1014, .66, 760, FL, 6), g2 = fig(S.el, "g2", 688, 994, .72, 700, FL, 6), g3 = fig(S.el, "g3", 662, 1011, .66, 760, FL, 6);
  E.F(t => { const k = t < AVAL + .5 ? 0 : t < HERE - .15 ? 1 : 2; g1.style.opacity = k === 0 ? 1 : 0; g2.style.opacity = k === 1 ? 1 : 0; g3.style.opacity = k === 2 ? 1 : 0; });
  bob(g1, 0, AVAL, 5, .6); bob(g2, AVAL, HERE, 6, .5); bob(g3, HERE, DUR, 4, .8);
  E.pop(g2, AVAL + .45, { from: .5, dur: .35 });

  // ---- the avalanche (paper drawn in code)
  const rnd = i => { const x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x); };
  const N = 70;
  for (let i = 0; i < N; i++) {
    const w = 60 + rnd(i) * 40, h = 76 + rnd(i + 9) * 40, x0 = 200 + rnd(i + 3) * 700, yEnd = 1560 + rnd(i + 5) * 330, tt = AVAL + rnd(i + 7) * .9, col = ["#ffffff", "#f6f1e4", "#e8eef7", "#f4d9a6"][i % 4];
    const el = E.el(S.el, "abs", `left:${x0}px;top:0;width:${w}px;height:${h}px;background:${col};border:3px solid #d2cab8;border-radius:5px;z-index:${i % 5 === 0 ? 7 : 5};opacity:0;box-shadow:0 3px 8px rgba(0,0,0,.2)`);
    for (let l = 0; l < 4; l++) E.el(el, "abs", `left:8px;top:${10 + l * 14}px;width:${w - 22 - (l % 2) * 14}px;height:4px;background:#b9b2a2;border-radius:2px`);
    show(el, [[tt, DUR]]);
    E.K(el, "y", [[tt, -200], [tt + .7, yEnd, "in"], [tt + .85, yEnd - 26, "out"], [tt + 1.0, yEnd, "in"]]);
    E.K(el, "r", [[tt, rnd(i + 11) * 80 - 40], [tt + 1.0, rnd(i + 13) * 360 - 180, "lin"]]);
  }
  const dust = E.el(S.el, "abs", "left:240px;top:1500px;width:600px;font-size:220px;text-align:center;z-index:8;opacity:0", "💨");
  E.K(dust, "o", [[AVAL + .6, 0], [AVAL + .9, .9], [AVAL + 2.0, 0]]); E.K(dust, "s", [[AVAL + .6, .5], [AVAL + 2.0, 1.7, "out"]]);

  // ---- cards: the things she kept
  const card = (img, iw, ih, big, small, t0, t1, tone = C.ink) => {
    const el = E.el(S.el, "abs", "left:110px;top:500px;width:860px;height:290px;background:#fffdf6;border-radius:30px;box-shadow:0 16px 36px rgba(0,0,0,.45);z-index:11;opacity:0;border:6px solid #e5dcc6");
    const m = Math.min(190 / iw, 190 / ih); const ph = E.el(el, "abs", `left:40px;top:${(290 - ih * m) / 2 - 6}px;width:${iw * m}px;height:${ih * m}px`); E.img(ph, img, `width:${iw * m}px;height:${ih * m}px`);
    E.el(el, "abs", `left:290px;top:44px;width:540px;font-weight:900;font-size:50px;line-height:1.05;color:${tone}`, big);
    E.el(el, "abs", `left:290px;top:180px;width:540px;font-weight:800;font-size:33px;line-height:1.1;color:#7a8791`, small);
    E.K(el, "o", [[t0, 0], [t0 + .08, 1], [t1 - .15, 1], [t1, 0]]); E.pop(el, t0, { from: .4, dur: .3 }); E.K(el, "r", [[t0, -3], [t1, 2]]);
  };
  card("toaster", 276, 264, "TORRADEIRA 1987", "toaster receipt · guarantee: 2 years", TOAST, THIRTY - .1);
  card("env", 312, 293, "DENTE DO OTTO", "Otto's first tooth · 1994", TOOTH, MARCH - .1);
  card("stack", 300, 282, "FATURA · MARÇO ✔", "March invoice · found in 0.5 sec", HERE, GU2 - .1, "#2e8b57");
  card("box", 311, 316, "RECIBO · 1991", "receipt for the shoebox ✔", COURSE, STAMP + .2, "#2e8b57");
  // a few collectables peeking out of the mess
  [["cass", 283, 220, .5, 420, 1790, TOAST + 1.4], ["cat", 263, 277, .5, 560, 1810, TOOTH - .6], ["cert", 341, 271, .45, 330, 1760, MARCH - 2.0], ["boxes", 297, 295, .55, 880, 1850, THIRTY - 2.4]].forEach(([n, w, h, s, cx, bot, t0], i) => { const el = fig(S.el, n, w, h, s, cx, bot, 7); show(el, [[t0, DUR]]); E.K(el, "y", [[t0, -500], [t0 + .45, 0, "in"], [t0 + .6, -18, "out"], [t0 + .75, 0, "in"]]); });

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  E.F(t => {
    let s;
    if (t < AVAL) s = "IRS RETURN: DUE";
    else if (t < GU1 + 2.2) { const n = Math.min(4812, Math.floor(((t - AVAL) / 1.6) * 4812)); s = `RECEIPTS: ${n.toLocaleString("en")}`; }
    else if (t < HERE) s = "RECEIPTS: 4,812 · FOUND: 0";
    else if (t < COURSE) s = "RECEIPTS: 4,812 · FOUND: 1";
    else s = "YEARS KEPT: 38 · LOST: 0";
    if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= AVAL ? C.coralD : C.ink; pill.style.fontSize = s.length > 24 ? "42px" : "48px";
  });
  [AVAL, HERE, COURSE].forEach(t => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const sub = en => `<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:3px">${en}</div>`;
  const bubble = (html, hx, top, w, t0, t1, fs = 48, z = 10) => {
    const tail = Math.max(50, Math.min(w - 90, w / 2)), left = Math.max(20, Math.min(1060 - w, hx - tail)), tl = hx - left - 22;
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:${z};transform-origin:${tl}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tl}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const OH = 200, GH = 740;
  bubble("Grandma, I need the invoices for my tax return.", OH + 80, 960, 600, INV, MOM - .1, 44);
  bubble("Ai, filho. One moment.", GH, 1000, 460, MOM, AVAL - .1, 48);
  bubble(`Guarda tudo!${sub("(Keep everything!)")}`, GH, 1000, 460, GU1, TOAST - .1, 56);
  bubble("Grandma… it's been thirty-eight years.", OH + 80, 960, 540, THIRTY, TOOTH - .1, 44);
  bubble("I just need March. From last year.", OH + 80, 960, 540, MARCH, HERE - .1, 46);
  bubble("…How?", OH, 1000, 300, HOW, GU2 - .1, 60);
  bubble(`Guarda tudo.${sub("(Keep everything.)")}`, GH, 960, 440, GU2, BOX - .1, 52);
  bubble("Grandma. Do you have the receipt… for this box?", OH + 60, 940, 580, BOX, COURSE - .1, 42);
  bubble("Of course.", GH, 980, 360, COURSE, STAMP + .3, 56);
  E.stamp(E.el(S.el, "abs", "left:30px;top:830px;width:1020px;display:flex;justify-content:center;z-index:11"), "RECEIPTS: 38 YEARS · LOST: 0.", STAMP, { size: 66, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(0, "sfx/office.wav", { vol: .08, duck: false, to: DUR });
  E.clip(INV, "voices/ep116/o_invoices.wav", { vol: 1.2 }); E.clip(MOM, "voices/ep116/g_moment.wav", { vol: 1.3 });
  E.clip(AVAL - .5, "sfx/elx-cupboard-open.wav", { vol: .9, to: 1.6 }); E.clip(AVAL, "sfx/elx-paper-avalanche.wav", { vol: 1.3, to: 3 });
  E.clip(GU1, "voices/ep116/g_guarda1.wav", { vol: 1.35 });
  E.S(TOAST - .1, "ding", .6); E.clip(TOAST, "voices/ep116/g_toaster.wav", { vol: 1.3 });
  E.clip(THIRTY, "voices/ep116/o_38.wav", { vol: 1.2 }); E.clip(TOOTH, "voices/ep116/g_tooth.wav", { vol: 1.3 });
  E.clip(MARCH, "voices/ep116/o_march.wav", { vol: 1.2 }); E.clip(HERE, "voices/ep116/g_here.wav", { vol: 1.3 }); E.S(HERE + .2, "sparkle", .5);
  E.clip(HOW, "voices/ep116/o_how.wav", { vol: 1.2 }); E.clip(GU2, "voices/ep116/g_guarda2.wav", { vol: 1.3 });
  E.clip(BOX, "voices/ep116/o_box.wav", { vol: 1.2 }); E.clip(COURSE, "voices/ep116/g_course.wav", { vol: 1.3 }); E.S(COURSE + .3, "sparkle", .5); E.S(STAMP, "ding", .4);
  [TOAST, TOOTH, HERE, COURSE].forEach(t => E.S(t, "pop", .45));

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Grandma keeps *every receipt*", { size: 48, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[28.8, 1], [29.05, 1.18, "out"], [29.35, 1, "io"]]);
}
