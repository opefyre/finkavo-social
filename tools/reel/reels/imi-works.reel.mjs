// Renovation and the property tax record — one idea (60 days after the works), one move (Modelo 1 on the Portal, with the plans).
// Sources: CIMI art. 13.º n.º 1 d) (60 days; conclusão de obras que possam alterar o VPT); art. 37.º; Portal das Finanças FAQ 00462; Modelo 1 instructions.
export const meta = { id: "imi-works", date: "2026-09-27" };

export default function (E) {
  const { C } = E;
  E.music({ bpm: 80, root: 53, seed: 21, prog: [[0, 3, 7], [5, 8, 12], [8, 12, 15], [7, 10, 14]] });
  const B = [0, 6.8, 12.8, 22.6, 30.4, 36.6];
  const S = [E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"), E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light")];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // 1 · hook
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "Property tax", 0, { instant: true });
    E.text(col, "Finished renovating in Portugal? Finanças needs to know within *$60 days*.", { size: 104, instant: true, lh: 1.03, id: "hook" });
    E.text(col, "For works that can change your home's tax value.", { size: 46, weight: 700, color: C.mute, instant: true, ls: "-.01em", id: "sub" });
    const row = E.el(col, "", "display:flex;align-items:center;gap:36px;margin-top:20px");
    const stage = E.el(row, "", "position:relative;width:400px;height:390px;flex:none");
    const house = E.el(stage, "sh", "position:absolute;left:0;top:90px"); house.innerHTML = E.icons.house(310);
    const ham = E.el(stage, "", "position:absolute;left:170px;top:30px;transform-origin:30% 80%"); ham.innerHTML = E.icons.hammer(210);
    E.F(t => { ham.style.transform = `rotate(${-8 + 26 * Math.pow(Math.abs(Math.sin(t * 3.4)), 3)}deg)`; house.style.transform = `translateY(${Math.sin(t * 2.2) * 5}px)`; });
    for (let k = 0; k < 6; k++) E.S(0.15 + k * 0.92, "tick", .6);
    const b = E.el(row, "tx", `font-size:62px;padding:.14em .4em .18em;border-radius:.32em;font-weight:900;letter-spacing:-.02em;background:${C.amber};color:${C.ink};white-space:nowrap`, "60 days");
    E.pop(b, 5.2, { from: .3, dur: .5 }); E.S(5.2, "ding"); E.S(5.26, "sparkle", .8);
  }

  // 2 · habit
  E.std.habit(S[1], B[1], { name: "The Silent Renovation", size: 122, def: "Finishing the works and telling no one.", quote: "“Just a renovation.”", qsize: 52, decor: "60", decorSize: 420 });

  // 3 · why
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:34px;justify-content:flex-start");
    E.chip(col, "Why it matters", t0 + .2);
    const dia = E.el(col, "", "position:relative;width:780px;height:210px;margin-top:6px");
    const node = (x, bg, icon, label, t, lx = x - 40, al = "center") => {
      const n = E.el(dia, "", `position:absolute;left:${x}px;top:0;width:96px;height:96px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center`);
      n.innerHTML = E.icons[icon](60); E.pop(n, t, { from: .3 });
      const l = E.text(dia, label, { size: 32, weight: 800, color: C.mute, t: t + .2, id: label, css: `position:absolute;left:${lx}px;top:116px;width:176px;text-align:${al}`, align: al });
      return n;
    };
    node(0, C.amber, "hammer", "Works finished", t0 + .5, 0, "left");
    node(684, C.coral, "calendar", "Day 60", t0 + 1.4);
    E.el(dia, "", "position:absolute;left:118px;top:36px;width:544px;height:24px;border-radius:12px;background:rgba(11,42,44,.10)");
    const fill = E.el(dia, "", `position:absolute;left:118px;top:36px;width:544px;height:24px;border-radius:12px;background:${C.mintD};transform-origin:0 50%`);
    E.K(fill, "sx", [[t0 + .9, 0.001], [t0 + 2.9, 1, "io"]]);
    E.S(t0 + .9, "swish", .6);
    E.card(col, { t: t0 + 2.0, icon: "tag", iconBg: "#fbe6d1", text: "IMI is charged on the property's tax value (VPT).", size: 50, ic: 116 });
    E.card(col, { t: t0 + 3.9, icon: "hammer", iconBg: "#fbe6d1", text: "Works that can change that value must be declared.", size: 50, ic: 116 });
    E.card(col, { t: t0 + 5.4, icon: "clock", iconBg: "#ffe1d9", text: "The 60 days start when the works are finished.", size: 50, ic: 116 });
  }

  // 4 · move
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "doc", iconBg: C.mint, text: "File *Modelo 1* on the Portal das Finanças.", size: 52, ic: 112 });
    E.card(col, { t: t0 + 2.4, icon: "house", iconBg: "#fbe6d1", text: "Add the plans of the works.", size: 52, ic: 112 });
    const row = E.el(col, "", "display:flex;align-items:center;gap:40px;margin-top:14px");
    const h = E.el(row, "", "flex:none"); h.className = "sh"; h.innerHTML = E.icons.house(230); E.pop(h, t0 + 4.2, { from: .3 }); E.S(t0 + 4.22, "pop");
    E.F(t => { h.style.marginTop = t > t0 + 4.6 ? `${Math.sin((t - t0) * 2.4) * 4}px` : "0"; });
    const ck = E.el(row, "", "flex:none"); ck.innerHTML = E.icons.check(190);
    E.pop(ck, t0 + 5.4, { from: .2, dur: .55 }); E.S(t0 + 5.42, "ding"); E.S(t0 + 5.48, "sparkle", .8);
  }

  E.std.send(S[4], B[4], { send: "Send this to a *homeowner* who just renovated.", follow: "Follow for Portugal property tax rules in plain English.", icon: "house" });
  E.finish(B[5]);
}
