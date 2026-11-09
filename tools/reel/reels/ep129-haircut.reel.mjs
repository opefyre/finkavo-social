// EP.129 "Can a haircut lower your taxes in Portugal?" — the barber: "Contribuinte?" (Your tax number?) Otto: "…Sorry?"
// Narrator: give him your NIF and 15% of this haircut's VAT counts against your IRS (receipt: €15,00 incl. 23% IVA = €2,80 VAT → €0,42).
// Restaurants, mechanics, vets too; up to €250 a year per household (CIRS art. 78.º-F). Otto now asks everyone, then grandma:
// "Contribuinte?" — "Come a sopa." (Eat your soup.) Narrator: Finkavo Narrator. Music: tools/music/compose.py ep129.
export const meta = {
  id: "ep129-haircut", date: "2027-01-29",
  images: {
    plate: "../tools/reel/eps/ep129-haircut/media/frame0-plate.png", cafe: "../tools/reel/eps/ep129-haircut/media/cafe.jpg",
    garage: "../tools/reel/eps/ep129-haircut/media/garage.jpg", vet: "../tools/reel/eps/ep129-haircut/media/vet.jpg",
    lunch: "characters/scenes/bg_lunch.webp", cape: "characters/cutouts/otto_cape.webp", ask: "characters/cutouts/otto-coat_ask.webp",
    dona: "characters/cutouts/dona_offer.webp",
  },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 21.6;
  const HOOK = 0.15, BARBER = 2.6, SORRY = 3.6, NIF = 4.5, SECT = 10.3, CAP = 12.8, ASK = 16.4, GRAN = 18.9, SOPA = 19.9;
  const S = E.scene("haircut", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. the barbershop (0 – 4.5) ============
  const A = E.el(S.el, "abs", "inset:0;overflow:hidden;transform-origin:50% 60%"); show(A, [[0, NIF]]);
  const plate = E.el(A, "abs", "inset:0"); E.img(plate, "plate", COVER);
  E.K(A, "s", [[0, 1.04], [BARBER, 1.1, "lin"], [BARBER + .25, 1.3, "out"], [NIF, 1.33, "lin"]]);
  E.F(t => { plate.style.filter = t >= SORRY ? "blur(10px) brightness(.7)" : "none"; });
  for (let i = 0; i < 26; i++) {
    const h = E.el(A, "abs", `left:${480 + (i * 37) % 320}px;top:${1020 + (i * 23) % 120}px;width:${22 + i % 3 * 8}px;height:6px;background:#1c130c;border-radius:2px;z-index:6`);
    const t0 = (i * 0.13) % 3.0;
    E.K(h, "y", [[t0, 0], [t0 + 0.9, 340, "in"]]); E.K(h, "r", [[t0, i * 25], [t0 + 0.9, i * 25 + 180, "lin"]]); E.K(h, "o", [[0, 0], [t0, 0], [t0 + .05, 1], [t0 + .8, 1], [t0 + .9, 0]]);
  }
  const hookWords = [["Can", .2], ["a", .4], ["haircut", .5], ["lower", .95, 1], ["your", 1.2, 1], ["taxes", 1.4, 1], ["in", 1.75], ["Portugal?", 1.85]];
  const H = E.el(A, "abs", "left:40px;top:280px;width:1000px;text-align:center;z-index:10;line-height:1.08"); show(H, [[0, BARBER]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:96px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });
  const cape = fig(A, "cape", 688, 947, 1.15, 540, 1700, 8); show(cape, [[SORRY - .1, NIF]]); E.pop(cape, SORRY - .1, { from: .8, dur: .25 }); bob(cape, SORRY, NIF, 6, .4);

  // ============ 2. the receipt (4.5 – 10.3) ============
  const RC = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#2c3550,#121828)"); show(RC, [[NIF, SECT]]);
  const paper = E.el(RC, "abs", "left:240px;top:330px;width:600px;height:540px;background:#fbf8f1;border-radius:6px;box-shadow:0 30px 60px rgba(0,0,0,.45);font-family:'Courier New',monospace;color:#222;z-index:3;overflow:hidden");
  E.K(paper, "y", [[NIF, 900], [NIF + .6, 0, "out"]]); E.K(paper, "r", [[NIF, 6], [NIF + .6, -2, "out"], [NIF + 3.4, 0, "io"]]);
  // the camera pushes onto the NIF line, then the VAT line, then pulls back for the result
  E.F(t => { paper.style.transformOrigin = t < NIF + 2.5 ? "50% 30%" : "50% 37%"; });
  E.K(paper, "s", [[NIF, 1.25], [NIF + .9, 1.3, "lin"], [NIF + 1.3, 1.75, "out"], [NIF + 2.4, 1.8, "lin"], [NIF + 2.8, 1.85, "io"], [NIF + 3.5, 1.15, "io"], [SECT, 1.2, "lin"]]);
  const row = (top, l, r, size = 34, bold = 400) => { const d = E.el(paper, "abs", `left:40px;top:${top}px;width:520px;font-size:${size}px;font-weight:${bold}`); E.el(d, "", "float:left", l); E.el(d, "", "float:right", r); return d; };
  E.el(paper, "abs", "left:0;top:40px;width:600px;text-align:center;font-size:44px;font-weight:700", "BARBEARIA");
  E.el(paper, "abs", "left:0;top:100px;width:600px;text-align:center;font-size:26px;color:#666", "Fatura-recibo");
  E.el(paper, "abs", "left:40px;top:150px;width:520px;border-top:3px dashed #999");
  row(185, "Corte de cabelo", "€15,00");
  const nifRow = row(255, "NIF cliente", "███ ███ ███");
  const ivaRow = row(325, "IVA 23% incl.", "€2,80");
  E.el(paper, "abs", "left:40px;top:395px;width:520px;border-top:3px dashed #999");
  row(430, "TOTAL", "€15,00", 44, 700);
  const hl = (el, t0) => { E.F(t => { el.style.background = t >= t0 ? "rgba(255,214,64,.65)" : "transparent"; }); E.K(el, "s", [[t0 - .01, 1], [t0 + .08, 1.08, "out"], [t0 + .3, 1, "io"]]); };
  hl(nifRow, NIF + 1.1); hl(ivaRow, NIF + 2.6);
  const back = E.el(RC, "abs", "left:140px;top:1080px;width:800px;text-align:center;font-weight:900;font-size:76px;color:#7dff8a;z-index:6;text-shadow:0 4px 14px rgba(0,0,0,.6)", "");
  show(back, [[NIF + 3.6, SECT]]); E.pop(back, NIF + 3.6, { from: .5, dur: .3 });
  E.F(t => { const u = Math.max(0, Math.min(1, (t - NIF - 3.6) / 1.0)); const s = `15% of €2,80 = €${(0.42 * u).toFixed(2).replace(".", ",")}`; if (back.textContent !== s) back.textContent = s; });
  const off = E.el(RC, "abs", "left:100px;top:1185px;width:880px;text-align:center;font-weight:800;font-size:44px;color:#cfd6dc;z-index:6", "counts against your IRS"); show(off, [[NIF + 3.6, SECT]]);

  // ============ 3. the sectors (10.3 – 12.8): three real places ============
  const SEC = [["cafe", "Restaurants"], ["garage", "Mechanics"], ["vet", "Vets"]];
  SEC.forEach(([img, label], i) => {
    const t0 = SECT + i * 0.75, t1 = i < 2 ? t0 + 0.75 : CAP;
    const P = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(P, [[t0, t1]]); E.img(P, img, COVER);
    E.K(P, "s", [[t0, 1.15], [t1, 1.05, "out"]]);
    const chip = E.el(P, "abs", "left:140px;top:300px;width:800px;text-align:center;font-weight:900;font-size:84px;color:#fff;-webkit-text-stroke:3px #141414;text-shadow:0 6px 18px rgba(0,0,0,.6);z-index:5", `${label}<br><span style='color:#ffd640'>15% of the VAT</span>`);
    E.pop(chip, t0, { from: .7, dur: .22 });
  });

  // ============ 4. the cap (12.8 – 16.4) ============
  const CP = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 45%,#2c3550,#121828);transform-origin:50% 40%"); show(CP, [[CAP, ASK]]);
  E.K(CP, "s", [[CAP, 1.0], [CAP + 2.15, 1.12, "lin"], [CAP + 2.25, 1.2, "out"], [CAP + 2.5, 1.14, "io"], [ASK, 1.22, "lin"]]);
  E.K(CP, "r", [[CAP + 2.2, 0], [CAP + 2.26, -1.5], [CAP + 2.32, 1.2], [CAP + 2.4, 0]]);
  E.F(t => { CP.style.background = t < CAP + 1.3 ? "radial-gradient(circle at 50% 45%,#2c3550,#121828)" : "radial-gradient(circle at 50% 45%,#3d6b4f,#14261b)"; });
  const flash = E.el(CP, "abs", "inset:0;background:#fff;z-index:9;opacity:0"); E.K(flash, "o", [[CAP + 2.18, 0], [CAP + 2.22, .7], [CAP + 2.45, 0]]);
  const big = E.el(CP, "abs", "left:0;top:560px;width:1080px;text-align:center;font-weight:900;font-size:220px;color:#ffd640;text-shadow:0 8px 24px rgba(0,0,0,.5)", "");
  E.F(t => { const u = Math.max(0, Math.min(1, (t - CAP - .3) / 1.6)); const s = `€${Math.round(250 * (1 - Math.pow(1 - u, 3)))}`; if (big.textContent !== s) big.textContent = s; });
  E.el(CP, "abs", "left:0;top:850px;width:1080px;text-align:center;font-weight:800;font-size:60px;color:#fff", "a year, per household");
  const stamp = E.el(CP, "abs", "left:300px;top:420px;width:480px;height:130px;border:10px solid #e0533d;border-radius:18px;color:#e0533d;font-weight:900;font-size:90px;text-align:center;line-height:110px;transform:rotate(-8deg);opacity:0;z-index:5", "LIMIT");
  show(stamp, [[CAP + 2.2, ASK]]); E.pop(stamp, CAP + 2.2, { from: 2.2, dur: .18 });
  E.el(CP, "abs", "left:0;top:1000px;width:1080px;text-align:center;font-weight:700;font-size:34px;color:#8fa0bd", "Monthly public-transport passes: 100% of the VAT");

  // ============ 5. Otto asks everyone (16.4 – 18.9) ============
  [["cafe", ASK, ASK + .8], ["garage", ASK + .8, ASK + 1.6], ["vet", ASK + 1.6, GRAN]].forEach(([img, t0, t1], i) => {
    const P = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(P, [[t0, t1]]); E.img(P, img, COVER + ";filter:brightness(.85)");
    const o = fig(P, "ask", 668, 1024, 1.1, i % 2 ? 330 : 750, 1880, 4); E.pop(o, t0, { from: .85, dur: .2 }); bob(o, t0, t1, 10, .3);
  });

  // ============ 6. grandma's lunch (18.9 – end) ============
  const L = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(L, [[GRAN, DUR]]); E.img(L, "lunch", COVER);
  const o2 = fig(L, "ask", 668, 1024, 1.0, 300, 1880, 4); bob(o2, GRAN, DUR, 6, .5);
  const d = fig(L, "dona", 585, 955, 1.1, 780, 1880, 5); E.pop(d, SOPA - .1, { from: .9, dur: .2 }); E.K(d, "x", [[SOPA - .1, 60], [SOPA + .2, 0, "out"]]);

  // ============ captions and subtitles ============
  const cap = E.el(S.el, "abs", "left:70px;top:1385px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12;text-shadow:0 3px 10px rgba(0,0,0,.85)", "");
  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const CAPS = [[BARBER, `"Contribuinte?"${sub("Your tax number?")}`], [SORRY, "\"…Sorry?\""], [SORRY + .6, ""],
    [NIF, "Give him your NIF,"], [NIF + 1.9, "and 15% of this haircut's VAT"], [NIF + 3.9, "counts against your IRS."], [NIF + 5.6, ""],
    [SECT, "Restaurants. Mechanics. Vets."], [SECT + 2.3, ""], [CAP, "Up to €250 a year, per household."], [CAP + 3.3, ""],
    [ASK, "\"Contribuinte? Contribuinte!\""], [ASK + 2.1, ""], [GRAN, "\"Contribuinte?\""], [GRAN + .8, ""], [SOPA, `"Come a sopa."${sub("Eat your soup.")}`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:rgba(10,14,24,.72);border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0.05, "sfx/scissors.wav", { vol: 0.8, duck: false });
  E.clip(0.75, "sfx/scissors.wav", { vol: 0.6, duck: false });
  E.clip(HOOK, "voices/ep129/n_haircut.wav", { vol: 1.2 });
  E.clip(BARBER, "voices/ep129/b_contribuinte.wav", { vol: 1.25 });
  E.clip(SORRY - .15, "sfx/fs-chair-creak.wav", { vol: 0.4, to: 0.8, duck: false });
  E.clip(SORRY, "voices/ep129/o_sorry.wav", { vol: 1.2 });
  E.clip(NIF, "sfx/printer.wav", { vol: 0.45, to: 1.2, duck: false });
  E.clip(NIF, "voices/ep129/n_nif.wav", { vol: 1.2 });
  [0, .75, 1.5].forEach(o => E.clip(SECT + o, "sfx/note-slap.wav", { vol: 0.45, duck: false }));
  E.clip(SECT, "voices/ep129/n_restaurants.wav", { vol: 1.2 });
  E.clip(CAP, "voices/ep129/n_250.wav", { vol: 1.2 });
  E.clip(CAP + 2.2, "sfx/cash-register.wav", { vol: 0.5, duck: false });
  E.clip(ASK, "voices/ep129/o_contribuinte2.wav", { vol: 1.2 });
  E.clip(GRAN, "voices/ep129/o_contribuinte.wav", { vol: 1.2 });
  E.clip(SOPA, "voices/ep129/g_sopa.wav", { vol: 1.25 });
  E.clip(0, "../tools/reel/eps/ep129-haircut/audio/music44.wav", { vol: 0.3, to: DUR });
  E.finish(DUR);
}
