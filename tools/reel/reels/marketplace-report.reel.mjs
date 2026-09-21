// Marketplace reporting (DAC7) — one idea (platforms report some sellers; reporting is not a tax), one move (regular resale is business activity: open it).
// Sources: Lei 36/2023 (art. 4.º-K DL 61/2013, DAC7); AT FAQs 5181, 5355, 5365 v); CIRS art. 3.º n.º 1 a). Goods sellers: 30+ sales OR more than €2.000 a year.
export const meta = { id: "marketplace-report", date: "2026-10-02" };

export default function (E) {
  const { C } = E;
  E.music({ bpm: 94, root: 53, seed: 53, prog: [[0, 3, 7], [8, 12, 15], [5, 8, 12], [3, 7, 10]] });
  const B = [0, 6.6, 12.6, 22.2, 30.0, 36.4];
  const S = [E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"), E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light")];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // 1 · hook
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "Selling online", 0, { instant: true });
    E.text(col, "Sell online? Platforms report some sellers to *Finanças*.", { size: 112, instant: true, lh: 1.03, id: "hook" });
    E.text(col, "Reporting is not a tax.", { size: 48, weight: 700, color: C.mute, instant: true, ls: "-.01em", id: "sub" });
    const row = E.el(col, "", "display:flex;align-items:center;gap:40px;margin-top:24px");
    E.std.dial(row, 360, { from: 0, to: 30, t0: 0, t1: 4.6, label: "sales", ticks: 12, color: C.mintD });
    const side = E.el(row, "", "flex:1;display:flex;flex-direction:column;gap:14px");
    E.text(side, "or more than *$€2.000* in a year", { size: 46, t: 3.0, weight: 800, id: "or" });
    const b = E.el(side, "tx", `display:inline-block;align-self:flex-start;font-size:52px;padding:.14em .4em .18em;border-radius:.32em;font-weight:900;letter-spacing:-.02em;background:${C.amber};color:${C.ink}`, "reported");
    E.pop(b, 5.0, { from: .3, dur: .5 }); E.S(5.0, "ding");
  }

  // 2 · habit
  E.std.habit(S[1], B[1], { name: "The Hobby Excuse", size: 150, def: "Reselling regularly and calling it a hobby.", quote: "“It's just a hobby.”", qsize: 54, decor: "30", decorSize: 480 });

  // 3 · why
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:32px;justify-content:flex-start");
    E.chip(col, "What is reported", t0 + .2);
    const th = E.el(col, "", "display:flex;align-items:center;gap:18px;width:780px;margin-top:6px");
    const box = (big, small, t) => { const el = E.el(th, "", `flex:1;background:#fff;border-radius:34px;padding:22px 20px;text-align:center;box-shadow:0 18px 40px rgba(11,42,44,.12)`);
      E.el(el, "", `font-weight:900;font-size:76px;line-height:1.05;letter-spacing:-.03em;color:${C.amberD}`, big); E.el(el, "", `font-weight:800;font-size:32px;color:${C.mute}`, small); E.pop(el, t, { from: .5, dur: .4, dy: 24 }); E.S(t + .05, "pop", .8); };
    box("30", "sales in a year", t0 + .5);
    const or = E.el(th, "tx", `flex:none;font-size:44px;font-weight:900;color:${C.mute}`, "or"); E.pop(or, t0 + 1.1, { from: .4 });
    box("€2.000", "in a year", t0 + 1.5);
    E.card(col, { t: t0 + 2.0, icon: "doc", iconBg: C.mint, text: "The platform sends the report, not you.", size: 48, ic: 108 });
    E.card(col, { t: t0 + 3.6, icon: "tag", iconBg: "#fbe6d1", text: "For goods: 30 or more sales, or more than €2.000.", size: 48, ic: 108 });
    E.card(col, { t: t0 + 5.4, icon: "shield", iconBg: "#dff5ec", text: "The report creates no new tax.", size: 48, ic: 108 });
  }

  // 4 · move
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "tag", iconBg: "#fbe6d1", text: "Buy to resell regularly? That is *business activity*.", size: 52, ic: 112 });
    E.card(col, { t: t0 + 2.6, icon: "doc", iconBg: C.mint, text: "Open the activity at *Finanças*.", size: 52, ic: 112 });
    const ck = E.el(col, "", "align-self:flex-start;margin-top:26px"); ck.innerHTML = E.icons.check(190);
    E.pop(ck, t0 + 4.8, { from: .2, dur: .55 }); E.S(t0 + 4.82, "ding"); E.S(t0 + 4.88, "sparkle", .8);
  }

  E.std.send(S[4], B[4], { send: "Send this to someone who *resells* online.", follow: "Follow for one plain-English Portugal tax rule at a time.", icon: "tag" });
  E.finish(B[5]);
}
