// Does a tax deadline move if it lands on a weekend/holiday? Depends on how it's written — a counted term vs a fixed date.
// Sources: CPPT art. 20.º n.º 1 (tax procedure deadlines shift to next working day); CPA art. 87.º (general admin deadlines, working-day count) — info.portaldasfinancas.gov.pt.
export const meta = { id: "deadline-weekend-shift", date: "2026-10-05" };

export default function (E) {
  const { C } = E;
  E.music({ bpm: 82, root: 53, seed: 5, prog: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [8, 12, 15]] });
  const B = [0, 6.6, 12.6, 22.4, 30.4, 36.6];
  const S = [E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"), E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light")];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // 1 · hook
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "Deadlines", 0, { instant: true });
    E.text(col, "Your deadline lands on a Sunday. Does it *!really* move?", { size: 104, instant: true, lh: 1.05, id: "hook" });
    E.text(col, "It depends on how the deadline is written.", { size: 48, weight: 700, color: C.mute, instant: true, id: "sub" });
    const row = E.el(col, "", "display:flex;gap:26px;margin-top:30px");
    ["Sat", "Sun", "Mon"].forEach((d, i) => {
      const c = E.el(row, "", `width:150px;height:150px;border-radius:32px;background:${i === 2 ? C.mint : "#f4efe6"};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:56px;color:${i === 2 ? C.mintD : C.mute}`, d);
      E.pop(c, i * .35, { from: .3, dur: .45 });
    });
    E.S(1.1, "whoosh", .6);
  }

  // 2 · habit
  E.std.habit(S[1], B[1], { name: "The Automatic Shift", size: 108, def: "Assuming every deadline slides to Monday.", quote: "“It'll wait, right?”", qsize: 54, decor: "20.º", decorSize: 320 });

  // 3 · why
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:34px;justify-content:flex-start");
    E.chip(col, "Two kinds of deadline", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "clock", iconBg: C.mint, text: "A *counted* deadline (“15 days from…”) shifts if it ends on a closed day.", size: 44, ic: 112 });
    E.card(col, { t: t0 + 3.2, icon: "calendar", iconBg: "#fbe6d1", text: "A *fixed* date (“until 30 June”) only shifts if *that* date is closed.", size: 44, ic: 112 });
    E.card(col, { t: t0 + 5.4, icon: "doc", iconBg: "#ffe1d9", text: "Tax and admin deadlines follow *!different* rules.", size: 44, ic: 112 });
  }

  // 4 · move
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "doc", iconBg: C.mint, text: "Read the *exact wording* before assuming it moved.", size: 50, ic: 112 });
    E.card(col, { t: t0 + 2.6, icon: "check", iconBg: "#dff5ec", text: "When in doubt, treat the *stated* date as the real one.", size: 50, ic: 112 });
    const ck = E.el(col, "", "align-self:flex-start;margin-top:20px"); ck.innerHTML = E.icons.check(190);
    E.pop(ck, t0 + 5.0, { from: .2, dur: .55 }); E.S(t0 + 5.02, "ding"); E.S(t0 + 5.08, "sparkle", .8);
  }

  E.std.send(S[4], B[4], { send: "Send this to someone tracking a *Finanças* deadline.", follow: "Follow for one plain-English Portugal tax rule at a time.", icon: "clock" });
  E.finish(B[5]);
}
