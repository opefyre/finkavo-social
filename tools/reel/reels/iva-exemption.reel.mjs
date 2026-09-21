// IVA exemption — one idea (two limits: €15.000 last year, €18.750 this year), one move (track your total; 15 working days).
// Sources: CIVA art. 53.º (Portal das Finanças, DL 35/2025 in force 1 Jul 2025); Ofício-Circulado 25062/2025 (art. 58.º n.º 4 b), 5 b; 15 dias úteis).
export const meta = { id: "iva-exemption", date: "2026-09-25" };

export default function (E) {
  const { C } = E;
  E.music({ bpm: 78, root: 52, seed: 9, prog: [[0, 3, 7], [8, 12, 15], [5, 8, 12], [7, 10, 14]] });
  const B = [0, 6.6, 12.6, 22.4, 30.4, 36.6];
  const S = [E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"), E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light")];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // 1 · hook
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "Freelancers", 0, { instant: true });
    E.text(col, "Freelancer in Portugal? Cross *$€18.750* and IVA starts *!at once*.", { size: 108, instant: true, lh: 1.03, id: "hook" });
    E.text(col, "For freelancers on the small-business IVA exemption.", { size: 48, weight: 700, color: C.mute, instant: true, ls: "-.01em", id: "sub" });
    const meter = E.el(col, "", "margin-top:30px;width:780px");
    E.el(meter, "", `font-weight:800;font-size:36px;letter-spacing:.06em;text-transform:uppercase;color:${C.mute}`, "Invoiced this year");
    const amt = E.el(meter, "", `font-weight:900;font-size:160px;line-height:1.05;letter-spacing:-.04em;color:${C.ink}`, "€0");
    E.count(amt, 0, 5.2, 0, 18750, { fmt: v => "€" + E.std.money(Math.round(v / 50) * 50), ticks: 14 });
    const track = E.el(meter, "", "margin-top:24px;height:36px;border-radius:18px;background:rgba(11,42,44,.10);overflow:hidden");
    const fill = E.el(track, "", "height:100%;width:100%;border-radius:18px;transform-origin:0 50%");
    E.K(fill, "sx", [[0, 0.001], [5.2, 1, "io"]]);
    E.F(t => { fill.style.background = t >= 5.25 ? C.coral : C.mintD; });
    const b = E.el(meter, "tx", `display:inline-block;margin-top:30px;font-size:58px;padding:.14em .4em .18em;border-radius:.32em;font-weight:900;letter-spacing:-.02em;background:${C.coral};color:${C.ink}`, "IVA starts");
    E.pop(b, 5.3, { from: .3, dur: .5 }); E.S(5.3, "nope");
  }

  // 2 · habit
  E.std.habit(S[1], B[1], { name: "The December Check", size: 118, def: "Adding up your invoices only in December.", quote: "“Check in December.”", qsize: 50, decor: "€18.750", decorSize: 170 });

  // 3 · why
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:34px;justify-content:flex-start");
    E.chip(col, "The two limits", t0 + .2);
    const dia = E.el(col, "", "position:relative;width:780px;height:230px;margin-top:6px");
    const X = v => v / 20000 * 780;
    E.el(dia, "", "position:absolute;left:0;top:100px;width:780px;height:46px;border-radius:23px;background:rgba(11,42,44,.10)");
    const fill = E.el(dia, "", `position:absolute;left:0;top:100px;width:${X(18750)}px;height:46px;border-radius:23px;background:${C.mintD};transform-origin:0 50%`);
    E.K(fill, "sx", [[t0 + .6, 0.001], [t0 + 2.6, 1, "io"]]);
    E.F(t => { fill.style.background = t >= t0 + 2.4 ? C.coral : (t >= t0 + 0.6 + 2 * (15000 / 18750) * .85 ? C.amberD : C.mintD); });
    const tick = (v, color, above, txt, t) => {
      const m = E.el(dia, "", `position:absolute;left:${X(v) - 5}px;top:${above ? 60 : 92}px;width:10px;height:${above ? 100 : 100}px;border-radius:5px;background:${color}`);
      E.pop(m, t, { from: .2 });
      const l = E.el(dia, "tx", `position:absolute;left:${X(v) - 90}px;top:${above ? 8 : 172}px;width:180px;text-align:center;font-size:36px;font-weight:900;color:${color === C.coral ? C.coralD : C.amberD}`, txt);
      E.show(l, t + .1, { dy: 14, dur: .3 });
    };
    tick(15000, C.amberD, true, "€15.000", t0 + .5); tick(18750, C.coral, false, "€18.750", t0 + .8);
    E.card(col, { t: t0 + 1.8, icon: "check", iconBg: C.mint, text: "Up to €15.000 last year: no IVA.", size: 50, ic: 116 });
    E.card(col, { t: t0 + 3.8, icon: "calendar", iconBg: "#fbe6d1", text: "Over €15.000 last year: IVA from 1 January.", size: 50, ic: 116 });
    E.card(col, { t: t0 + 5.4, icon: "receipt", iconBg: "#ffe1d9", text: "Over €18.750 this year: IVA starts on that invoice.", size: 50, ic: 116 });
  }

  // 4 · move
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "chart", iconBg: C.mint, text: "Track your total as you invoice.", size: 52, ic: 112 });
    E.card(col, { t: t0 + 2.4, icon: "clock", iconBg: "#ffe1d9", text: "Past €18.750? Tell Finanças within *$15 working days*.", size: 52, ic: 112 });
    const row = E.el(col, "", "display:flex;align-items:center;gap:46px;margin-top:10px");
    const d = E.std.dial(row, 300, { from: 0, to: 15, t0: t0 + 4.4, t1: t0 + 6.4, label: "workdays", labelScale: .8, ticks: 8 });
    E.pop(d, t0 + 4.2, { from: .4, dur: .4 });
    const ck = E.el(row, "", "flex:none"); ck.innerHTML = E.icons.check(190);
    E.pop(ck, t0 + 6.5, { from: .2, dur: .55 }); E.S(t0 + 6.52, "ding"); E.S(t0 + 6.58, "sparkle", .8);
  }

  E.std.send(S[4], B[4], { send: "Send this to a *freelancer* you know.", follow: "Follow for freelancer tax rules in plain English.", icon: "receipt" });
  E.finish(B[5]);
}
