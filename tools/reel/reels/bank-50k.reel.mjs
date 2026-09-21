// Bank reporting — one idea (banks report resident accounts above €50.000 at 31 Dec, by 31 Jul), one move (declare foreign accounts in Anexo J quadro 11).
// Sources: DL 64/2016 art. 10.º-A (added by Lei 17/2019); LGT art. 63.º-B (access needs listed cases + written decision); Modelo 3 Anexo J quadro 11 + AT FAQ 653.
export const meta = { id: "bank-50k", date: "2026-09-30" };

export default function (E) {
  const { C } = E;
  E.music({ bpm: 82, root: 50, seed: 41, prog: [[0, 3, 7], [5, 8, 12], [7, 10, 14], [3, 7, 10]] });
  const B = [0, 6.6, 12.6, 22.2, 30.0, 36.4];
  const S = [E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"), E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light")];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // 1 · hook
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "Banking", 0, { instant: true });
    E.text(col, "Your bank tells Finanças when your balance passes *$€50.000*.", { size: 108, instant: true, lh: 1.03, id: "hook" });
    E.text(col, "Once a year, for residents.", { size: 48, weight: 700, color: C.mute, instant: true, ls: "-.01em", id: "sub" });
    const meter = E.el(col, "", "margin-top:30px;width:780px");
    const top = E.el(meter, "", "display:flex;align-items:center;gap:26px");
    const ico = E.el(top, "sh", "flex:none"); ico.innerHTML = E.icons.bank(150);
    E.F(t => { ico.style.transform = `translateY(${Math.sin(t * 3) * 7}px)`; });
    const amt = E.el(top, "", `font-weight:900;font-size:140px;line-height:1;letter-spacing:-.04em;color:${C.ink}`, "€0");
    E.count(amt, 0, 5.2, 0, 50000, { fmt: v => "€" + E.std.money(Math.round(v / 500) * 500), ticks: 12 });
    const track = E.el(meter, "", "margin-top:30px;height:36px;border-radius:18px;background:rgba(11,42,44,.10);overflow:hidden");
    const fill = E.el(track, "", "height:100%;width:100%;border-radius:18px;transform-origin:0 50%");
    E.K(fill, "sx", [[0, 0.001], [5.2, 1, "io"]]);
    E.F(t => { fill.style.background = t >= 5.25 ? C.amberD : C.mintD; });
    const b = E.el(meter, "tx", `display:inline-block;margin-top:30px;font-size:58px;padding:.14em .4em .18em;border-radius:.32em;font-weight:900;letter-spacing:-.02em;background:${C.amber};color:${C.ink}`, "reported");
    E.pop(b, 5.3, { from: .3, dur: .5 }); E.S(5.3, "ding");
  }

  // 2 · habit
  E.std.habit(S[1], B[1], { name: "The Mattress Myth", size: 140, def: "Thinking Finanças never sees your balance.", quote: "“Nobody checks.”", qsize: 54, decor: "€", decorSize: 600 });

  // 3 · why
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:34px;justify-content:flex-start");
    E.chip(col, "How it works", t0 + .2);
    const dia = E.el(col, "", "position:relative;width:780px;height:210px;margin-top:6px");
    const node = (x, bg, icon, label, t, lx, al) => {
      const n = E.el(dia, "", `position:absolute;left:${x}px;top:0;width:96px;height:96px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center`);
      n.innerHTML = E.icons[icon](60); E.pop(n, t, { from: .3 });
      E.text(dia, label, { size: 32, weight: 800, color: C.mute, t: t + .2, id: label, css: `position:absolute;left:${lx}px;top:116px;width:200px;text-align:${al}`, align: al });
    };
    node(0, C.amber, "calendar", "31 Dec: balance", t0 + .5, 0, "left");
    node(684, C.mint, "bank", "31 Jul: report", t0 + 1.4, 580, "right");
    E.el(dia, "", "position:absolute;left:118px;top:36px;width:544px;height:24px;border-radius:12px;background:rgba(11,42,44,.10)");
    const fill = E.el(dia, "", `position:absolute;left:118px;top:36px;width:544px;height:24px;border-radius:12px;background:${C.mintD};transform-origin:0 50%`);
    E.K(fill, "sx", [[t0 + .9, 0.001], [t0 + 2.6, 1, "io"]]); E.S(t0 + .9, "swish", .6);
    E.card(col, { t: t0 + 1.9, icon: "bank", iconBg: C.mint, text: "Banks report once a year, by 31 July.", size: 50, ic: 112 });
    E.card(col, { t: t0 + 3.6, icon: "coin", iconBg: "#fbe6d1", text: "Only accounts above €50.000 on 31 December.", size: 50, ic: 112 });
    E.card(col, { t: t0 + 5.2, icon: "shield", iconBg: "#dff5ec", text: "Deeper access needs listed reasons and a written decision.", size: 50, ic: 112 });
  }

  // 4 · move
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "bank", iconBg: C.mint, text: "Account abroad? Declare it in your *IRS*.", size: 54, ic: 116 });
    E.card(col, { t: t0 + 2.6, icon: "doc", iconBg: "#fbe6d1", text: "*Anexo J*, quadro 11.", size: 54, ic: 116 });
    const ck = E.el(col, "", "align-self:flex-start;margin-top:26px"); ck.innerHTML = E.icons.check(190);
    E.pop(ck, t0 + 4.6, { from: .2, dur: .55 }); E.S(t0 + 4.62, "ding"); E.S(t0 + 4.68, "sparkle", .8);
  }

  E.std.send(S[4], B[4], { send: "Send this to someone with an account *abroad*.", follow: "Follow for one plain-English Portugal tax rule at a time.", icon: "bank" });
  E.finish(B[5]);
}
