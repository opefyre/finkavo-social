// Cash limit — one idea (€3.000 or more can't be paid or received in cash), one move (bank transfer, keep the proof).
// Sources: LGT art. 63.º-E n.º 1, 3, 4 (Lei 92/2017); RGIT art. 129.º n.º 3 (coima €180–4.500). Portal das Finanças.
export const meta = { id: "cash-limit", date: "2026-09-24" };

export default function (E) {
  const { C } = E;
  E.music({ bpm: 92, root: 55, seed: 5, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [3, 7, 10]] });
  const B = [0, 6.6, 12.6, 22.2, 30.0, 36.4];
  const S = [E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"), E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light")];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // 1 · hook
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "Portugal money rules", 0, { instant: true });
    E.text(col, "You can't pay *$€3.000* or more in *cash* in Portugal.", { size: 112, instant: true, lh: 1.03, id: "hook" });
    E.text(col, "The ban covers paying and receiving.", { size: 48, weight: 700, color: C.mute, instant: true, ls: "-.01em", id: "sub" });
    const meter = E.el(col, "", "margin-top:30px;width:780px");
    const top = E.el(meter, "", "display:flex;align-items:center;gap:26px");
    const ico = E.el(top, "", "flex:none"); ico.innerHTML = E.icons.banknote(150);
    E.F(t => { ico.style.transform = `translateY(${Math.sin(t * 3) * 8}px) rotate(${Math.sin(t * 2) * 3}deg)`; });
    const amt = E.el(top, "", `font-weight:900;font-size:150px;line-height:1;letter-spacing:-.04em;color:${C.ink}`, "€0");
    E.count(amt, 0, 5.2, 0, 3000, { fmt: v => "€" + E.std.money(Math.round(v / 50) * 50), ticks: 12 });
    const track = E.el(meter, "", "margin-top:30px;height:36px;border-radius:18px;background:rgba(11,42,44,.10);overflow:hidden");
    const fill = E.el(track, "", `height:100%;width:100%;border-radius:18px;transform-origin:0 50%`);
    E.K(fill, "sx", [[0, 0.001], [5.2, 1, "io"]]);
    E.F(t => { fill.style.background = t >= 5.25 ? C.coral : C.mintD; });
    const b = E.el(meter, "tx", `display:inline-block;margin-top:30px;font-size:58px;padding:.14em .4em .18em;border-radius:.32em;font-weight:900;letter-spacing:-.02em;background:${C.coral};color:${C.ink}`, "not allowed");
    E.pop(b, 5.3, { from: .3, dur: .5 }); E.S(5.3, "nope");
  }

  // 2 · the habit
  E.std.habit(S[1], B[1], {
    name: "The Split Payment", size: 138, def: "Paying €2.000 twice for a €4.000 car.", decor: "3.000", decorSize: 250,
    after: (col, t0) => {
      const row = E.el(col, "", "display:flex;align-items:center;gap:16px;margin-top:20px");
      const box = (txt, t, bg, fg) => { const el = E.el(row, "tx", `background:${bg};color:${fg};font-weight:900;font-size:48px;padding:.28em .36em;border-radius:.4em;letter-spacing:-.03em`, txt); E.pop(el, t, { from: .4, dur: .4 }); E.S(t + .05, "pop", .8); return el; };
      const op = (txt, t) => { const el = E.el(row, "", `font-weight:900;font-size:52px;color:${C.mint}`, txt); E.pop(el, t, { from: .5, dur: .3 }); };
      box("€2.000", t0 + 3.4, C.petrol, C.cream); op("+", t0 + 3.8); box("€2.000", t0 + 4.1, C.petrol, C.cream); op("=", t0 + 4.5);
      box("€4.000", t0 + 4.8, C.coral, C.ink); E.S(t0 + 4.85, "nope", .8);
    },
  });

  // 3 · why
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:34px;justify-content:flex-start");
    E.chip(col, "Why it doesn't work", t0 + .2);
    const dia = E.el(col, "", "position:relative;width:780px;height:190px;margin-top:6px");
    const X = v => v / 5000 * 780;
    E.el(dia, "", "position:absolute;left:0;top:96px;width:780px;height:46px;border-radius:23px;background:rgba(11,42,44,.10)");
    const pa = E.el(dia, "", `position:absolute;left:0;top:96px;width:${X(2000)}px;height:46px;border-radius:23px 0 0 23px;background:${C.mintD};transform-origin:0 50%`);
    const pb = E.el(dia, "", `position:absolute;left:${X(2000)}px;top:96px;width:${X(2000)}px;height:46px;border-radius:0 23px 23px 0;background:${C.amber};transform-origin:0 50%`);
    E.K(pa, "sx", [[t0 + .6, 0.001], [t0 + 1.2, 1, "out"]]); E.K(pb, "sx", [[t0 + 1.5, 0.001], [t0 + 2.2, 1, "out"]]);
    E.F(t => { pb.style.background = t >= t0 + 1.95 ? C.coral : C.amber; });
    const lab = (txt, x, y, t, color) => { const el = E.el(dia, "tx", `position:absolute;left:${x}px;top:${y}px;width:170px;text-align:center;font-size:34px;font-weight:900;line-height:46px;color:${color}`, txt); E.show(el, t, { dy: 8, dur: .3 }); };
    lab("€2.000", X(1000) - 85, 96, t0 + 1.0, C.ink); lab("€2.000", X(3500) - 85, 96, t0 + 1.9, C.ink);
    const mk = E.el(dia, "", `position:absolute;left:${X(3000) - 5}px;top:70px;width:10px;height:98px;border-radius:5px;background:${C.ink}`);
    E.pop(mk, t0 + .4, { from: .2 }); { const l = E.el(dia, "tx", `position:absolute;left:${X(3000) - 140}px;top:22px;width:280px;text-align:center;white-space:nowrap;font-size:34px;font-weight:900;color:${C.ink}`, "€3.000 limit"); E.show(l, t0 + .6, { dy: 8, dur: .3 }); }
    E.card(col, { t: t0 + 2.4, icon: "doc", iconBg: C.mint, text: "It covers any deal, even between two private people.", size: 50, ic: 116 });
    E.card(col, { t: t0 + 4.3, icon: "transfer", iconBg: "#fbe6d1", text: "Split payments for one sale are added together.", size: 50, ic: 116 });
    E.card(col, { t: t0 + 6.2, icon: "ban", iconBg: "#ffe1d9", text: "Fine range: *!€180 to €4.500*.", size: 50, ic: 116 });
  }

  // 4 · the move
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "transfer", iconBg: C.mint, text: "Pay by *bank transfer*.", size: 60, ic: 128 });
    E.card(col, { t: t0 + 2.4, icon: "receipt", iconBg: "#fbe6d1", text: "Keep the confirmation.", size: 60, ic: 128 });
    const row = E.el(col, "", "display:flex;align-items:center;gap:22px;margin-top:20px");
    const i1 = E.el(row, "", "flex:none"); i1.className = "sh"; i1.innerHTML = E.icons.banknote(140); E.pop(i1, t0 + 4.0, { from: .3 }); E.S(t0 + 4.02, "pop");
    const ar = E.std.arrow(row, 130, C.mintD, t0 + 4.5); ar.style.flex = "none"; E.S(t0 + 4.5, "swish", .6);
    const i2 = E.el(row, "", "flex:none"); i2.className = "sh"; i2.innerHTML = E.icons.bank(140); E.pop(i2, t0 + 5.1, { from: .3 }); E.S(t0 + 5.12, "pop");
    const i3 = E.el(row, "", "flex:none"); i3.innerHTML = E.icons.check(140); E.pop(i3, t0 + 5.9, { from: .2, dur: .5 }); E.S(t0 + 5.92, "ding"); E.S(t0 + 5.98, "sparkle", .8);
  }

  // 5 · send + follow
  E.std.send(S[4], B[4], { send: "Send this to someone buying a *used car* in Portugal.", follow: "Follow for Portugal money rules, checked against the law.", icon: "car" });
  E.finish(B[5]);
}
