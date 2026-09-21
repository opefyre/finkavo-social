// IRS refund offset — one idea (Finanças applies your refund to debts it collects), one move (check what you owe, pay or challenge it).
// Sources: CPPT art. 89.º n.º 1–4 (compensação; exceptions for open/possible challenges and guaranteed instalments); AT FAQ 3420. Not confirmed, so not claimed: Segurança Social debts, prior notice.
export const meta = { id: "refund-offset", date: "2026-09-29" };

export default function (E) {
  const { C } = E;
  E.music({ bpm: 88, root: 55, seed: 37, prog: [[0, 4, 7], [7, 11, 14], [5, 9, 12], [9, 12, 16]] });
  const B = [0, 6.6, 12.6, 22.2, 30.0, 36.4];
  const S = [E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"), E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light")];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // 1 · hook
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "IRS refund", 0, { instant: true });
    E.text(col, "Finanças can use your *IRS refund* to pay your *!tax debts*.", { size: 108, instant: true, lh: 1.03, id: "hook" });
    E.text(col, "Before the money reaches you.", { size: 48, weight: 700, color: C.mute, instant: true, ls: "-.01em", id: "sub" });
    const box = E.el(col, "", "margin-top:26px;width:780px");
    E.el(box, "", `font-weight:800;font-size:34px;letter-spacing:.12em;text-transform:uppercase;color:${C.mute}`, "Example");
    const amt = E.el(box, "", `font-weight:900;font-size:150px;line-height:1.05;letter-spacing:-.04em;color:${C.ink}`, "€800");
    E.F(t => {                                                     // count up to €800, hold, then show what is left
      const v = t >= 3.6 ? 300 : Math.round(800 * E.EASE.io(Math.min(1, t / 1.6)) / 10) * 10;
      const x = "€" + v; if (amt.textContent !== x) amt.textContent = x;
    });
    for (let i = 0; i < 6; i++) E.S(i * .28, "tick", .5);
    const track = E.el(box, "", "position:relative;margin-top:18px;height:44px;border-radius:22px;background:rgba(11,42,44,.10);overflow:hidden");
    const fill = E.el(track, "", `position:absolute;left:0;top:0;height:100%;width:100%;border-radius:22px;background:${C.mintD};transform-origin:0 50%`);
    E.K(fill, "sx", [[0, 0.001], [1.6, 1, "io"]]);
    const debt = E.el(track, "", `position:absolute;right:0;top:0;height:100%;width:62.5%;background:${C.coral};transform-origin:100% 50%`);
    E.K(debt, "sx", [[2.6, 0.001], [3.5, 1, "io"]]); E.S(2.6, "swish", .8); E.S(3.5, "thud", .7);
    E.F(t => { amt.style.color = t >= 3.6 ? C.mintD : C.ink; });
    const lab = E.el(box, "tx", `margin-top:16px;display:flex;justify-content:space-between;font-size:34px;font-weight:800;color:${C.mute}`, `<span>You get €300</span><span style="color:${C.coralD}">Debt €500</span>`);
    E.show(lab, 3.6, { dy: 10, dur: .4 });
  }

  // 2 · habit
  E.std.habit(S[1], B[1], { name: "The Ignored Debt", size: 150, def: "Thinking a small debt can wait.", quote: "“It's only €40.”", qsize: 54, decor: "€", decorSize: 600 });

  // 3 · why
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:32px;justify-content:flex-start");
    E.chip(col, "How the refund is used", t0 + .2);
    const flow = E.el(col, "", "display:flex;align-items:flex-start;justify-content:space-between;width:780px;margin-top:6px");
    const tile = (icon, label, t) => {
      const w = E.el(flow, "", "display:flex;flex-direction:column;align-items:center;gap:12px;width:200px;flex:none");
      const b = E.el(w, "", `width:150px;height:150px;border-radius:44px;background:${C.teal};box-shadow:0 22px 50px rgba(11,42,44,.18);display:flex;align-items:center;justify-content:center`);
      b.innerHTML = E.icons[icon](104); E.text(w, label, { size: 32, weight: 800, color: C.mute, t: t + .25, align: "center", id: label });
      E.pop(b, t, { from: .3 }); E.S(t + .04, "pop", .8);
    };
    const gap = () => E.el(flow, "", "flex:none;margin-top:56px");
    tile("clock", "Interest first", t0 + .4); const g1 = gap(); E.std.arrow(g1, 90, C.mintD, t0 + 1.0);
    tile("receipt", "Then charges", t0 + 1.3); const g2 = gap(); E.std.arrow(g2, 90, C.mintD, t0 + 1.9);
    tile("coin", "Then the debt", t0 + 2.2);
    E.card(col, { t: t0 + 2.4, icon: "doc", iconBg: C.mint, text: "Debts Finanças collects can be paid from it, not just IRS.", size: 48, ic: 108 });
    E.card(col, { t: t0 + 4.0, icon: "coin", iconBg: "#fbe6d1", text: "A refund bigger than the debt? You get the rest.", size: 48, ic: 108 });
    E.card(col, { t: t0 + 5.4, icon: "shield", iconBg: "#dff5ec", text: "No offset while your challenge is still open.", size: 48, ic: 108 });
  }

  // 4 · move
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "doc", iconBg: C.mint, text: "Check what you owe on the *Portal das Finanças*.", size: 54, ic: 116 });
    E.card(col, { t: t0 + 2.6, icon: "shield", iconBg: "#fbe6d1", text: "Pay it, or *challenge* it in time.", size: 54, ic: 116 });
    const ck = E.el(col, "", "align-self:flex-start;margin-top:26px"); ck.innerHTML = E.icons.check(190);
    E.pop(ck, t0 + 5.0, { from: .2, dur: .55 }); E.S(t0 + 5.02, "ding"); E.S(t0 + 5.08, "sparkle", .8);
  }

  E.std.send(S[4], B[4], { send: "Send this to someone waiting for a *refund*.", follow: "Follow for one plain-English Portugal tax rule at a time.", icon: "coin" });
  E.finish(B[5]);
}
