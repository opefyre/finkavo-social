// Recibos verdes: the fatura-recibo must be issued within 5 business days of the chargeable event (service done or paid, whichever first).
// Sources: CIVA art. 36.º n.º 1 a) (5 dias úteis); art. 7.º/8.º (chargeable event); RGIT art. 123.º (coima €150–€3.750) — info.portaldasfinancas.gov.pt.
export const meta = { id: "recibo-verde-5-days", date: "2026-10-06" };

export default function (E) {
  const { C } = E;
  E.music({ bpm: 88, root: 57, seed: 6, prog: [[0, 3, 7], [7, 10, 14], [5, 8, 12], [3, 7, 10]] });
  const B = [0, 6.6, 12.6, 22.2, 30.2, 36.4];
  const S = [E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"), E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light")];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // 1 · hook
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "Recibos verdes", 0, { instant: true });
    E.text(col, "Paid by a client? You have *$5* business days to invoice.", { size: 100, instant: true, lh: 1.05, id: "hook" });
    E.text(col, "The fatura-recibo deadline, for freelancers in Portugal.", { size: 46, weight: 700, color: C.mute, instant: true, id: "sub" });
    const row = E.el(col, "", "display:flex;align-items:center;gap:40px;margin-top:30px");
    E.std.dial(row, 380, { from: 5, to: 0, t0: 0, t1: 4.6, label: "days left", ticks: 5, color: C.coral });
  }

  // 2 · habit
  E.std.habit(S[1], B[1], { name: "The End-of-Month Batch", size: 104, def: "Saving all your invoices for one day a month.", quote: "“I'll do them together.”", qsize: 52, decor: "5", decorSize: 420 });

  // 3 · why
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:34px;justify-content:flex-start");
    E.chip(col, "How the clock runs", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "clock", iconBg: C.mint, text: "It starts when you're *paid* — or the service is done, whichever comes first.", size: 44, ic: 112 });
    E.card(col, { t: t0 + 3.2, icon: "receipt", iconBg: "#fbe6d1", text: "Miss it, and it's a *!fine*, not a warning.", size: 48, ic: 112 });
    E.card(col, { t: t0 + 5.4, icon: "coin", iconBg: "#ffe1d9", text: "*$€150* to *$€3.750*, per missed invoice.", size: 48, ic: 112 });
  }

  // 4 · move
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "receipt", iconBg: C.mint, text: "Issue the fatura-recibo the *same day* the money lands.", size: 48, ic: 112 });
    E.card(col, { t: t0 + 2.6, icon: "clock", iconBg: "#fbe6d1", text: "Treat 5 days as the *outer limit*, not the plan.", size: 50, ic: 112 });
    const ck = E.el(col, "", "align-self:flex-start;margin-top:20px"); ck.innerHTML = E.icons.check(190);
    E.pop(ck, t0 + 5.0, { from: .2, dur: .55 }); E.S(t0 + 5.02, "ding"); E.S(t0 + 5.08, "sparkle", .8);
  }

  E.std.send(S[4], B[4], { send: "Send this to a *freelancer* in Portugal.", follow: "Follow for freelancer tax rules in plain English.", icon: "receipt" });
  E.finish(B[5]);
}
