// Bank interest & dividends: 28% final withholding at source; englobamento is an opt-in choice when filing.
// Sources: CIRS art. 71.º n.º 1 (info.portaldasfinancas.gov.pt) — 28% retenção liberatória on interest/securities income for residents.
export const meta = { id: "bank-interest-28", date: "2026-10-03" };

export default function (E) {
  const { C } = E;
  E.music({ bpm: 80, root: 55, seed: 3, prog: [[0, 3, 7], [5, 8, 12], [7, 10, 14], [3, 7, 10]] });
  const B = [0, 6.8, 12.8, 22.6, 30.6, 36.8];
  const S = [E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"), E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light")];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // 1 · hook
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "Savings & investing", 0, { instant: true });
    E.text(col, "Your bank keeps *$28%* of the interest — *!before* you see it.", { size: 100, instant: true, lh: 1.05, id: "hook" });
    E.text(col, "Interest and dividends paid to tax residents in Portugal.", { size: 46, weight: 700, color: C.mute, instant: true, id: "sub" });
    const meter = E.el(col, "", "margin-top:26px;width:780px");
    E.el(meter, "", `font-weight:800;font-size:34px;letter-spacing:.06em;text-transform:uppercase;color:${C.mute}`, "€100 of interest");
    const amt = E.el(meter, "", `font-weight:900;font-size:150px;line-height:1.05;letter-spacing:-.04em;color:${C.ink}`, "€100");
    E.count(amt, 0, 4.6, 100, 72, { fmt: v => "€" + E.std.money(v), ticks: 10 });
    const track = E.el(meter, "", "margin-top:22px;height:34px;border-radius:17px;background:rgba(11,42,44,.10);overflow:hidden");
    const fill = E.el(track, "", `height:100%;width:100%;border-radius:17px;transform-origin:0 50%;background:${C.coral}`);
    E.K(fill, "sx", [[0, 1], [4.6, 0.72, "io"]]);
    const b = E.el(meter, "tx", `display:inline-block;margin-top:26px;font-size:52px;padding:.14em .4em .18em;border-radius:.32em;font-weight:900;letter-spacing:-.02em;background:${C.coral};color:${C.ink}`, "28% withheld");
    E.pop(b, 4.7, { from: .3, dur: .5 }); E.S(4.7, "nope");
  }

  // 2 · habit
  E.std.habit(S[1], B[1], { name: "The Uncounted Slice", size: 116, def: "Not knowing the tax was already taken.", quote: "“It's already net.”", qsize: 54, decor: "28%", decorSize: 340 });

  // 3 · why
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:34px;justify-content:flex-start");
    E.chip(col, "How it works", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "bank", iconBg: C.mint, text: "The bank withholds *$28%* and pays it straight to Finanças.", size: 48, ic: 112 });
    E.card(col, { t: t0 + 3.0, icon: "check", iconBg: "#dff5ec", text: "It's *final* — nothing more to declare, by default.", size: 48, ic: 112 });
    E.card(col, { t: t0 + 5.2, icon: "chart", iconBg: "#ffe1d9", text: "Lower income? You can end up *!overpaying*.", size: 48, ic: 112 });
  }

  // 4 · move
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "doc", iconBg: C.mint, text: "Check your bank's *annual tax statement*.", size: 52, ic: 112 });
    E.card(col, { t: t0 + 2.6, icon: "chart", iconBg: "#fbe6d1", text: "Lower bracket? You can choose *englobamento* when filing IRS.", size: 48, ic: 112 });
    const ck = E.el(col, "", "align-self:flex-start;margin-top:20px"); ck.innerHTML = E.icons.check(190);
    E.pop(ck, t0 + 5.4, { from: .2, dur: .55 }); E.S(t0 + 5.42, "ding"); E.S(t0 + 5.48, "sparkle", .8);
  }

  E.std.send(S[4], B[4], { send: "Send this to someone with savings in *Portugal*.", follow: "Follow for one plain-English Portugal tax rule at a time.", icon: "bank" });
  E.finish(B[5]);
}
