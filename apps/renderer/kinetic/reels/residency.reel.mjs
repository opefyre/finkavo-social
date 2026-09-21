// Tax residency — one idea (183 nights), one move (count, then tell Finanças within 60 days).
// Sources: CIRS art. 16 (n.º 1, 2); LGT art. 19 n.º 5 (60 days); AT leaflet "Alteração de morada – cidadãos estrangeiros".
export const meta = { id: "residency", date: "2026-09-23" };

export default function (E) {
  const { C } = E;
  E.music({ bpm: 84, root: 57, seed: 3 });
  const B = [0, 6.8, 12.8, 22.8, 30.6, 36.6];           // scene boundaries (a wipe is centred on each)
  const S = [
    E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"),
    E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light"),
  ];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // ---------- 1 · hook ----------
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "Portugal tax", 0, { instant: true });
    E.text(col, "More than *183 nights* in Portugal makes you a *tax resident*.", { size: 112, instant: true, lh: 1.03, id: "hook" });
    E.text(col, "In any 12 months. Not just the calendar year.", { size: 48, weight: 700, color: C.mute, instant: true, ls: "-.01em", id: "sub" });
    // a ring that counts nights: 0 → 184, then flips to "resident"
    const row1 = E.el(col, "", "display:flex;align-items:center;gap:40px;margin-top:22px");
    const stage = E.el(row1, "", "position:relative;width:400px;height:400px;flex:none");
    const { box, arc } = E.ring(stage, 400, 38, C.mintD, "rgba(11,42,44,.10)");
    box.style.position = "absolute";
    const num = E.el(stage, "", `position:absolute;left:0;right:0;top:104px;text-align:center;font-weight:900;font-size:150px;line-height:1;letter-spacing:-.04em;color:${C.ink}`, "0");
    E.el(stage, "", `position:absolute;left:0;right:0;top:262px;text-align:center;font-weight:800;font-size:36px;letter-spacing:.14em;text-transform:uppercase;color:${C.mute}`, "nights");
    E.K(arc, "draw", [[0, 0], [5.4, 1, "io"]]);
    E.count(num, 0, 5.4, 0, 184, { ticks: 12 });
    E.F(t => { arc.setAttribute("stroke", t >= 5.45 ? C.amberD : C.mintD); });
    const b = E.el(row1, "tx", `font-size:58px;padding:.14em .4em .18em;border-radius:.32em;font-weight:900;letter-spacing:-.02em;background:${C.amber};color:${C.ink};white-space:nowrap`, "resident");
    E.pop(b, 5.5, { from: .3, dur: .5 }); E.S(5.5, "ding"); E.S(5.55, "sparkle", .8);
  }

  // ---------- 2 · the name of the habit (dark) ----------
  {
    const s = S[1]; E.cur = s;
    E.blobs(s, [{ x: 500, y: 1000, d: 700, c: "#0d3a3a", ax: 40, ay: 40, o: .9 }, { x: -260, y: 200, d: 560, c: "#0a2c2e", ph: 1, o: .9 }]);
    const col = E.col(s, "gap:40px;justify-content:center");
    E.chip(col, "The habit", B[1] + .25);
    E.S(B[1] + .4, "riser", .6);
    const st = E.stamp(col, "The Fuzzy Count", B[1] + 1.05, { size: 150, css: "max-width:780px", rot: -5 });
    E.text(col, "Guessing your nights instead of counting them.", { size: 62, t: B[1] + 1.9, weight: 800, color: C.cream, ls: "-.02em", id: "def" });
    const q = E.el(col, "", `display:inline-flex;align-items:center;gap:22px;align-self:flex-start;margin-top:30px;background:${C.petrol};padding:26px 34px;border-radius:36px`);
    E.text(q, "“About half the year.”", { size: 58, t: B[1] + 3.5, weight: 800, color: C.cream, id: "quote", ls: "-.02em", css: "white-space:nowrap" });
    const x = E.el(q, "", "width:84px;height:84px"); x.innerHTML = E.icons.cross(84);
    E.pop(x, B[1] + 4.6, { from: .2 }); E.S(B[1] + 4.62, "nope", .8);
    E.show(q, B[1] + 3.3, { dy: 30 });
    // the number the guess hides
    const big = E.el(s.el, "", `position:absolute;right:70px;bottom:560px;font-weight:900;font-size:300px;line-height:1;letter-spacing:-.05em;color:rgba(127,224,192,.10)`, "183");
    E.F(t => { big.style.transform = `translateY(${Math.sin(t * .9) * 16}px)`; });
  }

  // ---------- 3 · why it catches you ----------
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:34px;justify-content:flex-start");
    E.chip(col, "Why it catches you", t0 + .2);
    const row = E.el(col, "", "display:flex;align-items:baseline;gap:22px;margin-top:6px");
    const n = E.el(row, "", `font-weight:900;font-size:130px;line-height:1;letter-spacing:-.04em;color:${C.amberD}`, "0");
    E.el(row, "", `font-weight:800;font-size:42px;color:${C.mute};letter-spacing:-.01em`, "nights in 12 months");
    E.count(n, t0 + .6, t0 + 5.4, 0, 184, { ticks: 9 });
    E.show(row, t0 + .4, { dy: 30 });
    const g = E.dots(col, { n: 184, cols: 23, size: 28, gap: 6, t0: t0 + .6, t1: t0 + 5.4 });
    E.card(col, { t: t0 + 1.4, icon: "moon", iconBg: "#fbe6d1", text: "Any day you sleep here counts, even a part-day.", size: 50, ic: 116 });
    E.card(col, { t: t0 + 3.5, icon: "calendar", iconBg: C.mint, text: "The days don't have to be in a row.", size: 50, ic: 116 });
    E.card(col, { t: t0 + 5.4, icon: "house", iconBg: "#dff5ec", text: "Or a home you keep as your main one.", size: 50, ic: 116 });
  }

  // ---------- 4 · the move ----------
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "calendar", iconBg: C.mint, text: "Count your nights in any 12 months.", size: 52, ic: 112 });
    E.card(col, { t: t0 + 2.4, icon: "pin", iconBg: "#ffe1d9", text: "Over 183? Tell Finanças your address within *$60 days*.", size: 52, ic: 112 });
    const row = E.el(col, "", "display:flex;align-items:center;gap:46px;margin-top:10px");
    const st = E.el(row, "", "position:relative;width:300px;height:300px;flex:none");
    const { box, arc } = E.ring(st, 300, 30, C.amberD, "rgba(11,42,44,.10)"); box.style.position = "absolute";
    const num = E.el(st, "", `position:absolute;left:0;right:0;top:66px;text-align:center;font-weight:900;font-size:120px;line-height:1;letter-spacing:-.04em;color:${C.ink}`, "0");
    E.el(st, "", `position:absolute;left:0;right:0;top:190px;text-align:center;font-weight:800;font-size:32px;letter-spacing:.14em;text-transform:uppercase;color:${C.mute}`, "days");
    E.pop(st, t0 + 4.2, { from: .4, dur: .4 });
    E.K(arc, "draw", [[t0 + 4.4, 0], [t0 + 6.4, 1, "io"]]);
    E.count(num, t0 + 4.4, t0 + 6.4, 0, 60, { ticks: 8 });
    const ck = E.el(row, "", "flex:none"); ck.innerHTML = E.icons.check(190);
    E.pop(ck, t0 + 6.5, { from: .2, dur: .55 }); E.S(t0 + 6.52, "ding"); E.S(t0 + 6.58, "sparkle", .8);
  }

  // ---------- 5 · send-line + follow reason ----------
  {
    const s = S[4]; E.cur = s; const t0 = B[4];
    E.blobs(s, [{ x: 600, y: 900, d: 700, c: "#dff5ec", ax: 50, ay: 40 }, { x: -260, y: 200, d: 620, c: "#fbe6d1", ph: 1 }]);
    const col = E.col(s, "gap:48px;justify-content:center");
    const env = E.el(col, "", "align-self:flex-start;margin-top:14px"); env.innerHTML = E.icons.doc(190);
    E.pop(env, t0 + .3, { from: .3 }); E.S(t0 + .35, "pop");
    E.text(col, "Send this to someone who *just moved* to Portugal.", { size: 88, t: t0 + .8, lh: 1.04, id: "send" });
    E.card(col, { t: t0 + 1.5, icon: "check", iconBg: C.mint, text: "Follow for one plain-English Portugal tax rule at a time.", size: 50, from: "up", ic: 116 });
    const h = E.el(col, "chip dk", "align-self:flex-start;font-size:52px;padding:22px 44px 26px;text-transform:none;letter-spacing:.01em", "@finkavo");
    E.pop(h, t0 + 3.6, { from: .5 }); E.S(t0 + 3.65, "ding");
  }

  E.finish(B[5]);
}
