// IMI Familiar — one idea (councils may cut IMI by €30/€70/€140 for 1/2/3+ dependants), one move (check your município and your household).
// Sources: CIMI art. 112.º-A (Lei 56/2023: €30/€70/€140); Portal das Finanças "Consultar dedução fixa para agregados familiares" (which municípios apply which tiers).
export const meta = { id: "imi-familiar", date: "2026-10-01" };

export default function (E) {
  const { C } = E;
  E.music({ bpm: 90, root: 57, seed: 47, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const B = [0, 6.6, 12.6, 22.2, 30.0, 36.4];
  const S = [E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"), E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light")];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // 1 · hook
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "Property tax", 0, { instant: true });
    E.text(col, "Have kids? Your IMI can drop by up to *$€140*.", { size: 116, instant: true, lh: 1.03, id: "hook" });
    E.text(col, "If your council approved it.", { size: 48, weight: 700, color: C.mute, instant: true, ls: "-.01em", id: "sub" });
    const house = E.el(col, "sh", "margin-top:14px;align-self:flex-start"); house.innerHTML = E.icons.house(190);
    E.F(t => { house.style.transform = `translateY(${Math.sin(t * 2.6) * 7}px)`; });
    const row = E.el(col, "", "display:flex;gap:16px;width:780px;margin-top:10px");
    const tile = (label, val, t) => {
      const el = E.el(row, "", `flex:1;background:#fff;border-radius:34px;padding:22px 20px 24px;box-shadow:0 18px 40px rgba(11,42,44,.12);text-align:center`);
      E.el(el, "", `font-weight:800;font-size:32px;color:${C.mute};letter-spacing:.02em`, label);
      E.el(el, "", `font-weight:900;font-size:76px;line-height:1.1;letter-spacing:-.03em;color:${C.amberD}`, val);
      E.pop(el, t, { from: .5, dur: .4, dy: 30 }); E.S(t + .05, "pop", .8);
    };
    tile("1 child", "€30", 1.4); tile("2 children", "€70", 2.5); tile("3 or more", "€140", 3.6); E.S(3.7, "ding", .7);
  }

  // 2 · habit
  E.std.habit(S[1], B[1], { name: "The Unchecked Discount", size: 118, def: "Never checking what your council offers.", quote: "“Nobody told me.”", qsize: 54, decor: "€140", decorSize: 260 });

  // 3 · why
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:30px;justify-content:flex-start");
    E.chip(col, "How it works", t0 + .2);
    const rows = E.el(col, "", "display:flex;flex-direction:column;gap:18px;margin-top:6px");
    const row = (icon, txt, t) => {
      const r = E.el(rows, "", `display:flex;align-items:center;gap:22px;background:#fff;border-radius:34px;padding:20px 30px 20px 22px;box-shadow:0 18px 40px rgba(11,42,44,.10)`);
      const i = E.el(r, "", "flex:none;width:76px;height:76px"); i.innerHTML = E.icons[icon](76);
      E.el(r, "tx", `font-size:42px;font-weight:900;letter-spacing:-.02em;color:${C.ink}`, txt);
      E.pop(r, t, { from: .5, dur: .4, dy: 24 }); E.S(t + .05, "pop", .8);
    };
    row("check", "Council adopted it: discount", t0 + .5); row("cross", "Not adopted: no discount", t0 + 1.3);
    E.card(col, { t: t0 + 2.2, icon: "house", iconBg: C.mint, text: "It is a council choice: each município decides.", size: 48, ic: 108 });
    E.card(col, { t: t0 + 3.9, icon: "coin", iconBg: "#fbe6d1", text: "The amounts are set by law: €30, €70 or €140.", size: 48, ic: 108 });
    E.card(col, { t: t0 + 5.2, icon: "calendar", iconBg: "#dff5ec", text: "Your household counts as it stood on 31 December.", size: 48, ic: 108 });
  }

  // 4 · move
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "doc", iconBg: C.mint, text: "Check your município on the *Portal das Finanças*.", size: 52, ic: 112 });
    E.card(col, { t: t0 + 2.6, icon: "house", iconBg: "#fbe6d1", text: "Dependants on your IRS, tax address at the home.", size: 52, ic: 112 });
    const ck = E.el(col, "", "align-self:flex-start;margin-top:26px"); ck.innerHTML = E.icons.check(190);
    E.pop(ck, t0 + 5.0, { from: .2, dur: .55 }); E.S(t0 + 5.02, "ding"); E.S(t0 + 5.08, "sparkle", .8);
  }

  E.std.send(S[4], B[4], { send: "Send this to a parent who owns their *home*.", follow: "Follow for one plain-English Portugal tax rule at a time.", icon: "house" });
  E.finish(B[5]);
}
