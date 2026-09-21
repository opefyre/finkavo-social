// Fake Finanças messages — one idea (the AT never asks for payment through an email/SMS link), one move (go to the Portal yourself).
// Sources: Portal das Finanças security alerts of 3 Aug 2026 and 16 Apr 2025 (only emails from @at.gov.pt; never links to enter/confirm data or pay).
export const meta = { id: "fake-financas", date: "2026-09-28" };

export default function (E) {
  const { C } = E;
  E.music({ bpm: 96, root: 52, seed: 31, prog: [[0, 3, 7], [3, 7, 10], [8, 12, 15], [5, 8, 12]] });
  const B = [0, 6.6, 12.6, 22.2, 30.0, 36.4];
  const S = [E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"), E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light")];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // 1 · hook
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "Scam alert", 0, { instant: true });
    E.text(col, "Finanças will *!never* ask you to pay through a *link*.", { size: 112, instant: true, lh: 1.03, id: "hook" });
    E.text(col, "Not by email. Not by SMS.", { size: 48, weight: 700, color: C.mute, instant: true, ls: "-.01em", id: "sub" });
    const chat = E.el(col, "", "position:relative;width:780px;height:470px;margin-top:20px");
    const bubble = (txt, y, t, w) => {
      const b = E.el(chat, "tx", `position:absolute;left:0;top:${y}px;background:#fff;color:${C.ink};border-radius:38px 38px 38px 10px;padding:24px 34px;font-size:40px;font-weight:800;line-height:1.12;letter-spacing:-.01em;box-shadow:0 18px 40px rgba(11,42,44,.12);max-width:${w}px`, txt);
      E.pop(b, t, { from: .6, dur: .4, dy: 30 }); E.S(t + .05, "pop", .7); return b;
    };
    bubble("Finanças: you have unpaid tax.", 0, .15, 640);
    bubble("Pay in 24h: [link]", 130, 1.5, 560);
    bubble("Last notice!", 260, 2.8, 400);
    const ban = E.el(chat, "sh", "position:absolute;right:20px;top:110px"); ban.innerHTML = E.icons.ban(240);
    E.pop(ban, 4.6, { from: .3, dur: .5 }); E.S(4.62, "nope");
    const ph = E.el(chat, "", "position:absolute;right:30px;top:0;width:14px;height:14px;border-radius:50%;background:" + C.coral);
    E.F(t => { ph.style.opacity = String(.5 + .5 * Math.sin(t * 9)); });
  }

  // 2 · habit
  E.std.habit(S[1], B[1], { name: "The Panic Click", size: 150, def: "Clicking before checking.", quote: "“Pay in 24 hours!”", qsize: 50, decor: "!", decorSize: 520 });

  // 3 · why
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:30px;justify-content:flex-start");
    E.chip(col, "How to tell", t0 + .2);
    const rows = E.el(col, "", "display:flex;flex-direction:column;gap:18px;margin-top:6px");
    const row = (icon, txt, t, bg) => {
      const r = E.el(rows, "", `display:flex;align-items:center;gap:22px;background:${bg};border-radius:34px;padding:20px 30px 20px 22px;box-shadow:0 18px 40px rgba(11,42,44,.10)`);
      const i = E.el(r, "", "flex:none;width:76px;height:76px"); i.innerHTML = E.icons[icon](76);
      E.el(r, "tx", `font-size:44px;font-weight:900;letter-spacing:-.02em;color:${C.ink}`, txt);
      E.pop(r, t, { from: .5, dur: .4, dy: 24 }); E.S(t + .05, "pop", .8);
    };
    row("check", "…@at.gov.pt", t0 + .5, "#fff"); row("cross", "any other address", t0 + 1.3, "#fff");
    E.card(col, { t: t0 + 2.2, icon: "doc", iconBg: C.mint, text: "Real emails come only from addresses ending @at.gov.pt.", size: 48, ic: 108 });
    E.card(col, { t: t0 + 4.0, icon: "ban", iconBg: "#ffe1d9", text: "It never sends links to confirm your data.", size: 48, ic: 108 });
    E.card(col, { t: t0 + 5.5, icon: "coin", iconBg: "#fbe6d1", text: "It never asks for payment by link.", size: 48, ic: 108 });
  }

  // 4 · move
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "ban", iconBg: "#ffe1d9", text: "Don't click. Open the *Portal das Finanças* yourself.", size: 54, ic: 116 });
    E.card(col, { t: t0 + 2.6, icon: "doc", iconBg: C.mint, text: "Check *Comunicações* after you log in.", size: 54, ic: 116 });
    const row = E.el(col, "", "display:flex;align-items:center;gap:22px;margin-top:20px");
    const i1 = E.el(row, "", "flex:none"); i1.className = "sh"; i1.innerHTML = E.icons.ban(140); E.pop(i1, t0 + 4.4, { from: .3 }); E.S(t0 + 4.42, "pop");
    const ar = E.std.arrow(row, 130, C.mintD, t0 + 4.9); ar.style.flex = "none"; E.S(t0 + 4.9, "swish", .6);
    const i2 = E.el(row, "", "flex:none"); i2.className = "sh"; i2.innerHTML = E.icons.bank(140); E.pop(i2, t0 + 5.5, { from: .3 }); E.S(t0 + 5.52, "pop");
    const i3 = E.el(row, "", "flex:none"); i3.innerHTML = E.icons.check(140); E.pop(i3, t0 + 6.3, { from: .2, dur: .5 }); E.S(t0 + 6.32, "ding"); E.S(t0 + 6.38, "sparkle", .8);
  }

  E.std.send(S[4], B[4], { send: "Send this to someone who gets these *texts*.", follow: "Follow for one plain-English Portugal tax rule at a time.", icon: "doc" });
  E.finish(B[5]);
}
