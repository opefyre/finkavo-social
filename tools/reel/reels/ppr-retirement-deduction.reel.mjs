// PPR contributions: a 20% IRS deduction capped by age; keep it 5 years or lose it, plus a 10%/year clawback surcharge.
// Sources: EBF art. 21.º (info.portaldasfinancas.gov.pt) — 20% rate, €400/€350/€300 age caps, 5-year rule, 10%-per-year surcharge on early redemption.
export const meta = { id: "ppr-retirement-deduction", date: "2026-10-07" };

export default function (E) {
  const { C } = E;
  E.music({ bpm: 74, root: 48, seed: 7, prog: [[0, 3, 7], [5, 8, 12], [8, 12, 15], [3, 7, 10]] });
  const B = [0, 6.8, 12.8, 22.8, 30.8, 37.0];
  const S = [E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"), E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light")];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // 1 · hook
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "Retirement savings", 0, { instant: true });
    E.text(col, "Save into a PPR in Portugal, and IRS gives back *$up to €400*.", { size: 92, instant: true, lh: 1.05, id: "hook" });
    E.text(col, "A deduction for retirement-savings contributions, by age.", { size: 46, weight: 700, color: C.mute, instant: true, id: "sub" });
    const row = E.el(col, "", "display:flex;align-items:center;gap:40px;margin-top:30px");
    E.std.dial(row, 380, { from: 0, to: 20, t0: 0, t1: 4.6, label: "% back", ticks: 10, color: C.mintD });
  }

  // 2 · habit
  E.std.habit(S[1], B[1], { name: "The Early Cash-Out", size: 100, def: "Withdrawing a PPR before five years are up.", quote: "“I need it now.”", qsize: 54, decor: "PPR", decorSize: 300 });

  // 3 · why
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:34px;justify-content:flex-start");
    E.chip(col, "The deduction", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "coin", iconBg: C.mint, text: "*$20%* of what you invest comes back off your IRS.", size: 48, ic: 112 });
    E.card(col, { t: t0 + 3.0, icon: "chart", iconBg: "#fbe6d1", text: "Capped by age: *$€400* under 35, *$€350* 35–50, *$€300* over.", size: 42, ic: 112 });
    E.card(col, { t: t0 + 5.4, icon: "calendar", iconBg: "#ffe1d9", text: "Contribute by *$31 December* to count for that year.", size: 46, ic: 112 });
  }

  // 4 · move
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "lock", iconBg: C.mint, text: "Keep it *$5 years*, or hold to retirement, to keep the benefit.", size: 46, ic: 112 });
    E.card(col, { t: t0 + 2.8, icon: "ban", iconBg: "#ffe1d9", text: "Withdraw early and you repay it — *!plus 10% a year*.", size: 46, ic: 112 });
    const ck = E.el(col, "", "align-self:flex-start;margin-top:20px"); ck.innerHTML = E.icons.check(190);
    E.pop(ck, t0 + 5.2, { from: .2, dur: .55 }); E.S(t0 + 5.22, "ding"); E.S(t0 + 5.28, "sparkle", .8);
  }

  E.std.send(S[4], B[4], { send: "Send this to someone saving for retirement in *Portugal*.", follow: "Follow for one plain-English Portugal tax rule at a time.", icon: "coin" });
  E.finish(B[5]);
}
