// Closing a freelance activity — one idea (30 days to declare cessation), one move (file it on the Portal).
// Sources: CIVA art. 33.º; CIRS art. 112.º n.º 3 (30 days); RGIT art. 117.º n.º 2 (coima €300–7.500); ISS Guia Prático 1009 (Segurança Social ceases "oficiosamente" via AT).
export const meta = { id: "activity-closing", date: "2026-09-26" };

export default function (E) {
  const { C } = E;
  E.music({ bpm: 88, root: 50, seed: 13, prog: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]] });
  const B = [0, 6.6, 12.8, 22.4, 30.2, 36.4];
  const S = [E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"), E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light")];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // 1 · hook
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "Freelancers", 0, { instant: true });
    E.text(col, "Stopped freelancing in Portugal? You have *$30 days* to tell Finanças.", { size: 104, instant: true, lh: 1.03, id: "hook" });
    E.text(col, "The form is called “cessação de atividade”.", { size: 46, weight: 700, color: C.mute, instant: true, ls: "-.01em", id: "sub" });
    const row = E.el(col, "", "display:flex;align-items:center;gap:44px;margin-top:24px");
    E.std.dial(row, 340, { from: 30, to: 0, t0: 0, t1: 5.4, label: "days", ticks: 12, color: C.mintD });
    const lk = E.el(row, "", "flex:none"); lk.innerHTML = E.icons.lock(210);
    E.pop(lk, 5.5, { from: .3, dur: .5 }); E.S(5.5, "ding"); E.S(5.56, "sparkle", .8);
  }

  // 2 · habit
  E.std.habit(S[1], B[1], { name: "The Quiet Stop", size: 150, def: "Stopping work without telling Finanças.", quote: "“I just stopped.”", qsize: 54, decor: "30", decorSize: 420 });

  // 3 · why
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:34px;justify-content:flex-start");
    E.chip(col, "How it works", t0 + .2);
    const flow = E.el(col, "", "display:flex;align-items:flex-start;justify-content:space-between;width:780px;margin-top:6px");
    const tile = (icon, label, t, bg) => {
      const w = E.el(flow, "", "display:flex;flex-direction:column;align-items:center;gap:12px;width:190px;flex:none");
      const b = E.el(w, "", `width:150px;height:150px;border-radius:44px;background:${C.teal};box-shadow:0 22px 50px rgba(11,42,44,.18);display:flex;align-items:center;justify-content:center`);
      b.innerHTML = E.icons[icon](104, icon === "shield" ? { g: C.mint } : undefined);
      E.text(w, label, { size: 32, weight: 800, color: C.mute, t: t + .25, align: "center", ls: "-.01em", id: label });
      E.pop(b, t, { from: .3 }); E.S(t + .04, "pop", .8);
    };
    const gap = () => { const g = E.el(flow, "", "flex:none;margin-top:56px"); return g; };
    tile("doc", "You declare", t0 + .5);
    const g1 = gap(); E.std.arrow(g1, 90, C.mintD, t0 + 1.2); E.S(t0 + 1.2, "swish", .6);
    tile("bank", "Finanças", t0 + 1.6);
    const g2 = gap(); E.std.arrow(g2, 90, C.mintD, t0 + 2.3); E.S(t0 + 2.3, "swish", .6);
    tile("shield", "Social Security", t0 + 2.7);
    E.card(col, { t: t0 + 2.8, icon: "doc", iconBg: C.mint, text: "The activity closes when you declare it.", size: 50, ic: 116 });
    E.card(col, { t: t0 + 3.9, icon: "ban", iconBg: "#ffe1d9", text: "Late or missing? Fine range: *!€300 to €7.500*.", size: 50, ic: 116 });
    E.card(col, { t: t0 + 5.1, icon: "shield", iconBg: "#dff5ec", text: "Finanças tells Social Security, so it closes there too.", size: 50, ic: 116 });
  }

  // 4 · move
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "doc", iconBg: C.mint, text: "File your *cessação* on the Portal das Finanças.", size: 52, ic: 112 });
    E.card(col, { t: t0 + 2.4, icon: "calendar", iconBg: "#fbe6d1", text: "Within *$30 days* of your last day.", size: 52, ic: 112 });
    const row = E.el(col, "", "display:flex;align-items:center;gap:46px;margin-top:10px");
    const d = E.std.dial(row, 300, { from: 0, to: 30, t0: t0 + 4.2, t1: t0 + 6.2, label: "days", ticks: 8 });
    E.pop(d, t0 + 4.0, { from: .4, dur: .4 });
    const ck = E.el(row, "", "flex:none"); ck.innerHTML = E.icons.check(190);
    E.pop(ck, t0 + 6.3, { from: .2, dur: .55 }); E.S(t0 + 6.32, "ding"); E.S(t0 + 6.38, "sparkle", .8);
  }

  E.std.send(S[4], B[4], { send: "Send this to a freelancer who *stopped* working.", follow: "Follow for one plain-English Portugal tax rule at a time.", icon: "lock" });
  E.finish(B[5]);
}
