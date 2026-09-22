// Selling a car in Portugal: the buyer has 60 days to register the change; until then, IUC still falls on the registered owner.
// Sources: IUC art. 3.º (info.portaldasfinancas.gov.pt) — sujeito passivo = whoever the registry names; gov.pt vehicle-registration guides — 60-day deadline, seller can self-register with proof of sale.
export const meta = { id: "car-sale-registration", date: "2026-09-22" };

export default function (E) {
  const { C } = E;
  E.music({ bpm: 84, root: 57, seed: 8, prog: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]] });
  const B = [0, 6.6, 12.6, 22.4, 30.4, 36.6];
  const S = [E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"), E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light")];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // 1 · hook
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "Selling a car", 0, { instant: true });
    E.text(col, "Sold your car? The buyer has *$60 days* to register it.", { size: 100, instant: true, lh: 1.05, id: "hook" });
    E.text(col, "Until then, you can still be the one on the hook.", { size: 48, weight: 700, color: C.mute, instant: true, id: "sub" });
    const row = E.el(col, "", "display:flex;align-items:center;gap:40px;margin-top:30px");
    E.std.dial(row, 380, { from: 60, to: 0, t0: 0, t1: 4.6, label: "days left", ticks: 6, color: C.coral });
  }

  // 2 · habit
  E.std.habit(S[1], B[1], { name: "The Handshake Sale", size: 108, def: "Selling with a signed paper and nothing else.", quote: "“We shook on it.”", qsize: 54, decor: "60", decorSize: 400 });

  // 3 · why
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:34px;justify-content:flex-start");
    E.chip(col, "Why it matters", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "car", iconBg: C.mint, text: "IUC follows whoever is the *registered* owner — not who actually owns it.", size: 44, ic: 112 });
    E.card(col, { t: t0 + 3.2, icon: "clock", iconBg: "#fbe6d1", text: "The buyer has *$60 days* to register the change.", size: 48, ic: 112 });
    E.card(col, { t: t0 + 5.4, icon: "ban", iconBg: "#ffe1d9", text: "Miss it, and the car can be *!seized*.", size: 48, ic: 112 });
  }

  // 4 · move
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "doc", iconBg: C.mint, text: "Keep *proof of sale* — dated, signed, both NIFs.", size: 50, ic: 112 });
    E.card(col, { t: t0 + 2.6, icon: "check", iconBg: "#dff5ec", text: "If they don't register in time, *you* can register it yourself.", size: 46, ic: 112 });
    const ck = E.el(col, "", "align-self:flex-start;margin-top:20px"); ck.innerHTML = E.icons.check(190);
    E.pop(ck, t0 + 5.2, { from: .2, dur: .55 }); E.S(t0 + 5.22, "ding"); E.S(t0 + 5.28, "sparkle", .8);
  }

  E.std.send(S[4], B[4], { send: "Send this to someone who *sold a car* in Portugal.", follow: "Follow for one plain-English Portugal tax rule at a time.", icon: "car" });
  E.finish(B[5]);
}
