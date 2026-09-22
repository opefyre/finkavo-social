// AIMI (Adicional ao IMI): a second, extra property tax above a per-person deduction. Individuals only in this reel.
// Sources: CIMI art. 135.º-B (objective scope), 135.º-C (€600.000 deduction), 135.º-F (0,7%/1%/1,5% rates) — info.portaldasfinancas.gov.pt.
export const meta = { id: "aimi-property-tax", date: "2026-10-04" };

export default function (E) {
  const { C } = E;
  E.music({ bpm: 76, root: 50, seed: 4, prog: [[0, 3, 7], [8, 12, 15], [5, 8, 12], [7, 10, 14]] });
  const B = [0, 6.8, 12.8, 23.0, 31.0, 37.2];
  const S = [E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"), E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light")];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // 1 · hook
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "Property owners", 0, { instant: true });
    E.text(col, "Property in Portugal over *$€600.000*? There's a *!second* tax.", { size: 96, instant: true, lh: 1.05, id: "hook" });
    E.text(col, "AIMI: an extra annual tax on top of IMI, for individuals.", { size: 46, weight: 700, color: C.mute, instant: true, id: "sub" });
    const row = E.el(col, "", "display:flex;align-items:center;gap:40px;margin-top:30px");
    E.std.dial(row, 380, { from: 0, to: 600, t0: 0, t1: 4.6, label: "thousand €", labelScale: .85, ticks: 10, color: C.amberD });
  }

  // 2 · habit
  E.std.habit(S[1], B[1], { name: "The IMI-Only Mindset", size: 108, def: "Assuming IMI is the only property tax there is.", quote: "“I already pay IMI.”", qsize: 52, decor: "AIMI", decorSize: 300 });

  // 3 · why
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:34px;justify-content:flex-start");
    E.chip(col, "How it's built", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "house", iconBg: C.mint, text: "AIMI adds up the value of your *urban housing* and building land.", size: 46, ic: 112 });
    E.card(col, { t: t0 + 3.0, icon: "check", iconBg: "#dff5ec", text: "The first *$€600.000* per person is *deducted*, automatically.", size: 46, ic: 112 });
    E.card(col, { t: t0 + 5.2, icon: "chart", iconBg: "#ffe1d9", text: "Above that: *0,7%*, then *1%*, then *1,5%*.", size: 46, ic: 112 });
  }

  // 4 · move
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "doc", iconBg: C.mint, text: "Check your total value under *Imóveis* on the *Portal*.", size: 48, ic: 112 });
    E.card(col, { t: t0 + 2.6, icon: "calendar", iconBg: "#fbe6d1", text: "Finanças assesses it in *$June*; you pay in *$September*.", size: 48, ic: 112 });
    const ck = E.el(col, "", "align-self:flex-start;margin-top:20px"); ck.innerHTML = E.icons.check(190);
    E.pop(ck, t0 + 5.4, { from: .2, dur: .55 }); E.S(t0 + 5.42, "ding"); E.S(t0 + 5.48, "sparkle", .8);
  }

  E.std.send(S[4], B[4], { send: "Send this to a *property owner* in Portugal.", follow: "Follow for one plain-English Portugal tax rule at a time.", icon: "house" });
  E.finish(B[5]);
}
