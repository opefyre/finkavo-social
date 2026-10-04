// EP.120 "Your first Portuguese salary" — Otto at his desk, payslip held high: "My first Portuguese salary! Two thousand euros!" A pile of euro notes appears on the desk. A queue forms.
// The IRS official, bowing: "Bom dia! I'm the IRS. Just a little piece." (a slice of the pile goes) "Ótimo!" Segurança Social: "My piece, please." "Ótimo!" Otto: "Okay… still fine!" The landlord:
// "A renda, my friend!" (the rent — most of the pile) "Ótimo!" Three little bill-envelopes: "Electricity! Water! Internet!" The café waiter: "And your coffees this month!" "Ótimo!" Otto, holding one
// coin: "…One euro twenty." Then, rolling up a sleeve: "Fine. I'll work extra hours." The IRS official reappears, delighted: "Ótimo!" Stamp: SALARY: €2,000 · LEFT: €1.20. (All numbers are jokes.)
export const meta = {
  id: "ep120-salary", date: "2027-01-21",
  images: {
    bg: "characters/scenes/bg_office.webp",
    o1: "characters/cutouts/otto-desk_payslip.webp", o2: "characters/cutouts/otto-desk_overtime.webp", o3: "characters/cutouts/otto-desk_coin.webp",
    irs: "characters/cutouts/taxman_palm.webp", ss: "characters/cutouts/ssofficer_palm.webp", lan: "characters/cutouts/renda_smug.webp", bills: "characters/cutouts/bills_trio.webp", wai: "characters/cutouts/waiter_bill.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 110, root: 55, seed: 1201, prog: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]] });
  const DUR = 29.6, SAL = .3, IRS = 4.9, I_OK = 8.45, SS = 9.6, S_OK = 12.15, FINE = 13.35, LAN = 15.95, L_OK = 17.75, BILLS = 18.85, WAI = 20.85, W_OK = 22.6, COIN = 23.55, EXTRA = 25.5, IRS2 = 27.4, STAMP = 28.0;
  const S = E.scene("salary", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };
  E.img(S.el, "bg", BG);

  // ---- Otto at his desk (left)
  const OX = 300, OB = 1880;
  const o1 = fig(S.el, "o1", 880, 1168, .7, OX, OB, 5), o3 = fig(S.el, "o3", 880, 1168, .7, OX, OB, 5), o2 = fig(S.el, "o2", 879, 1168, .7, OX, OB, 5);
  E.F(t => { const k = t < COIN ? 1 : t < EXTRA ? 3 : 2; o1.style.opacity = k === 1 ? 1 : 0; o3.style.opacity = k === 3 ? 1 : 0; o2.style.opacity = k === 2 ? 1 : 0; });
  bob(o1, 0, IRS, 9, .35); bob(o1, IRS, COIN, 4, .7); bob(o3, COIN, EXTRA, 2, 1.1); bob(o2, EXTRA, DUR, 4, .6);

  // ---- the money: a stack of notes (drawn in code) that each visitor takes a share of
  const pile = E.el(S.el, "abs", "left:545px;top:0;width:300px;height:1px;z-index:6");
  const NOTES = 40, notes = [];
  for (let i = 0; i < NOTES; i++) {
    const n = E.el(pile, "abs", `left:${(i % 2) * 14 - 7}px;top:${1500 - i * 11}px;width:260px;height:70px;background:linear-gradient(90deg,#7fb27a,#a8d49b 40%,#7fb27a);border:3px solid #4f8a4b;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,.25);opacity:0`);
    E.el(n, "abs", "left:16px;top:12px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.35)");
    E.el(n, "abs", "left:0;top:12px;width:250px;text-align:right;font-weight:900;font-size:34px;color:#2f5f2c", "€50");
    notes.push(n);
  }
  // who takes how many notes, and when (top of the pile first)
  const TAKE = [[IRS + 1.6, 9, "irs"], [SS + 1.6, 6, "ss"], [LAN + .9, 18, "lan"], [BILLS + .9, 5, "bills"], [WAI + .9, 2, "wai"]];
  const DEST = { irs: [380, -900], ss: [380, -900], lan: [420, -800], bills: [300, -700], wai: [420, -760] };
  let top = NOTES;
  TAKE.forEach(([t0, n, who]) => {
    for (let j = 0; j < n; j++) {
      const i = top - 1 - j, el = notes[i], tt = t0 + j * .05;
      const [dx, dy] = DEST[who];
      E.K(el, "x", [[tt, 0], [tt + .55, dx + (j % 3) * 30, "in"]]); E.K(el, "y", [[tt, 0], [tt + .55, dy - j * 4, "in"]]); E.K(el, "r", [[tt, 0], [tt + .55, (j % 2 ? 1 : -1) * 60, "lin"]]);
      E.K(el, "o", [[0, 0], [SAL + .9 + i * .03, 0], [SAL + 1.0 + i * .03, 1], [tt + .45, 1], [tt + .55, 0]]);
    }
    top -= n;
  });
  // the last thing left: one coin
  const coin = E.el(S.el, "abs", "left:620px;top:1490px;width:110px;height:110px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffe58a,#d4a017 70%);border:5px solid #a77d06;z-index:6;opacity:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:30px;color:#6b4f00", "€1,20");
  E.K(coin, "o", [[W_OK, 0], [W_OK + .2, 1]]); E.pop(coin, W_OK + .1, { from: .3, dur: .3 });

  // ---- the visitors, one at a time, on the right
  const VX = 890, VB = 1880;
  const vis = (n, w, h, s, t0, t1, z = 5) => { const el = fig(S.el, n, w, h, s, VX, VB, z); show(el, [[t0, t1]]); E.K(el, "x", [[t0, 520], [t0 + .45, 0, "out"], [t1 - .4, 0], [t1, 520, "in"]]); bob(el, t0, t1, 5, .55); return el; };
  vis("irs", 455, 1012, .78, IRS - .3, SS - .2); vis("ss", 501, 1024, .76, SS - .3, LAN - .3);
  vis("lan", 672, 1030, .78, LAN - .4, BILLS - .2); vis("wai", 438, 982, .8, WAI - .3, COIN - .1);
  const irs2 = fig(S.el, "irs", 455, 1012, .78, VX, VB, 5); show(irs2, [[IRS2 - .3, DUR]]); E.K(irs2, "x", [[IRS2 - .3, 520], [IRS2 + .1, 0, "out"]]);
  const bills = E.el(S.el, "abs", `left:560px;top:${1880 - 629 * .38}px;width:${1344 * .38}px;height:${629 * .38}px;z-index:7;opacity:0`); E.img(bills, "bills", `width:${1344 * .38}px;height:${629 * .38}px`);
  show(bills, [[BILLS - .3, WAI - .2]]); E.K(bills, "x", [[BILLS - .3, 600], [BILLS + .2, 0, "out"], [WAI - .5, 0], [WAI - .2, 600, "in"]]);
  const bj = []; for (let t = BILLS; t < WAI; t += .2) bj.push([t, 0, "io"], [t + .1, -16, "io"]); E.K(bills, "y", bj);
  // the queue sign: they keep coming
  const q = E.el(S.el, "abs", "left:700px;top:560px;width:330px;height:110px;background:#1d2b36;border-radius:16px;z-index:8;box-shadow:0 8px 18px rgba(0,0,0,.35);text-align:center;opacity:0");
  E.el(q, "abs", "left:0;top:10px;width:330px;font-weight:900;font-size:34px;color:#ffb000;letter-spacing:1px", "SENHA");
  const qn = E.el(q, "abs", "left:0;top:50px;width:330px;font-weight:900;font-size:46px;color:#fff", "");
  const QN = [[IRS - .3, "A001 · IRS"], [SS - .3, "A002 · SEG. SOCIAL"], [LAN - .4, "A003 · SENHORIO"], [BILLS - .3, "A004–A006"], [WAI - .3, "A007 · CAFÉ"], [COIN, "—"], [IRS2 - .3, "A008 · IRS"]];
  show(q, [[IRS - .3, DUR]]);
  E.F(t => { const s = at(QN, t); if (qn.textContent !== s) qn.textContent = s; qn.style.fontSize = s.length > 14 ? "30px" : s.length > 11 ? "36px" : "46px"; qn.style.whiteSpace = "nowrap"; });
  QN.slice(1).forEach(([t]) => E.K(q, "s", [[t - .01, 1], [t, 1.1], [t + .2, 1, "out"]]));

  // ---- pill: the balance
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const BAL = [[0, 2000], [IRS + 1.6, 1550], [SS + 1.6, 1250], [LAN + .9, 350], [BILLS + .9, 101.2], [WAI + .9, 1.2]];
  E.F(t => {
    let v = BAL[0][1];
    for (let i = 1; i < BAL.length; i++) { const [k, x] = BAL[i], [pk, px] = BAL[i - 1]; if (t >= k + .6) v = x; else if (t >= k) { v = px + (x - px) * ((t - k) / .6); break; } else break; }
    const s = `BALANCE: €${v.toLocaleString("en", { minimumFractionDigits: v < 10 ? 2 : 0, maximumFractionDigits: v < 10 ? 2 : 0 })}`;
    if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= IRS + 1.6 ? C.coralD : "#2e8b57";
  });
  BAL.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .25, 1, "out"]]));

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
  const VH = 890, OH = 300, VT = 960;
  bubble("My first Portuguese salary! Two thousand euros!", OH + 40, 800, 600, SAL, IRS - .1, 46);
  bubble(`Bom dia! I'm the IRS. Just a little piece.${sub("(the income-tax office)")}`, VH, VT - 60, 540, IRS, I_OK - .1, 42);
  const ok = (t0, t1) => bubble(`Ótimo!${sub("(Great!)")}`, VH, VT, 320, t0, t1, 54, 11);
  ok(I_OK, SS - .3);
  bubble(`Segurança Social! My piece, please.${sub("(social security)")}`, VH, VT - 60, 520, SS, S_OK - .1, 42);
  ok(S_OK, LAN - .4);
  bubble("Okay… still fine!", OH, 760, 440, FINE, LAN - .1, 48, 12);
  bubble(`A renda, my friend!${sub("(The rent!)")}`, VH, VT - 40, 460, LAN, L_OK - .1, 48);
  ok(L_OK, BILLS - .3);
  bubble("Electricity! Water! Internet!", VH, 1340, 520, BILLS, WAI - .25, 44);
  bubble("And your coffees this month!", VH, VT, 480, WAI, W_OK - .1, 44);
  ok(W_OK, COIN - .15);
  bubble("…One euro twenty.", OH, 780, 440, COIN, EXTRA - .1, 50);
  bubble("Fine. I'll work extra hours.", OH, 780, 480, EXTRA, STAMP, 46);
  bubble(`Ótimo!${sub("(Great!)")}`, VH, VT, 320, IRS2, STAMP + .3, 58, 11);
  E.stamp(E.el(S.el, "abs", "left:30px;top:720px;width:1020px;display:flex;justify-content:center;z-index:13"), "SALARY €2,000 · LEFT €1.20", STAMP, { size: 62, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(0, "sfx/office.wav", { vol: .12, duck: false, to: DUR });
  E.clip(SAL, "voices/ep120/o_salary.wav", { vol: 1.2 }); E.S(SAL + 1.0, "sparkle", .5); E.clip(SAL + 1.2, "sfx/elx-chaching.wav", { vol: .6 });
  E.clip(IRS, "voices/ep120/i_piece.wav", { vol: 1.3 }); E.clip(IRS + 1.6, "sfx/elx-paper-unfold.wav", { vol: .8, to: .8 }); E.clip(I_OK, "voices/ep120/i_otimo.wav", { vol: 1.3 });
  E.clip(SS, "voices/ep120/s_piece.wav", { vol: 1.3 }); E.clip(SS + 1.6, "sfx/elx-paper-unfold.wav", { vol: .8, to: .8 }); E.clip(S_OK, "voices/ep120/s_otimo.wav", { vol: 1.3 });
  E.clip(FINE, "voices/ep120/o_fine.wav", { vol: 1.2 });
  E.clip(LAN, "voices/ep120/l_renda.wav", { vol: 1.35 }); E.clip(LAN + .9, "sfx/elx-paper-unfold.wav", { vol: 1.0, to: 1.2 }); E.clip(L_OK, "voices/ep120/l_otimo.wav", { vol: 1.35 });
  E.clip(BILLS, "voices/ep120/b_bills.wav", { vol: 1.25 }); E.clip(WAI, "voices/ep120/w_coffee.wav", { vol: 1.3 }); E.clip(W_OK, "voices/ep120/w_otimo.wav", { vol: 1.3 });
  E.S(W_OK + .1, "pop", .4); E.clip(COIN, "voices/ep120/o_coin.wav", { vol: 1.2 });
  E.clip(EXTRA, "voices/ep120/o_extra.wav", { vol: 1.2 }); E.clip(IRS2, "voices/ep120/i_otimo.wav", { vol: 1.35 }); E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Your first Portuguese *salary*", { size: 48, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[28.8, 1], [29.05, 1.18, "out"], [29.35, 1, "io"]]);
}
