// TEMPLATE — copy to reels/<id>.reel.mjs, then replace every string, the source line and the boundaries.
// It passes `node render.mjs reels/_template.reel.mjs --check` as it stands, so start from green and stay green.
// Sources: <law article / official page that each number below comes from>
export const meta = { id: "template", date: "2026-01-01" };   // id = folder name under out/ and the caption file name

export default function (E) {                                   // runs inside the page; use only E, no imports
  const { C } = E;
  E.music({ bpm: 84, root: 57, seed: 1, prog: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]] }); // change seed/bpm/root per reel

  // Scene boundaries. Each one gets a wipe. Total must land between 35 and 38 seconds.
  //         hook  habit  why    move   send   end
  const B = [0, 6.6, 12.6, 22.2, 30.0, 36.4];
  const S = [E.scene("hook", B[0], B[1], "light"), E.scene("habit", B[1], B[2], "dark"), E.scene("why", B[2], B[3], "light"),
             E.scene("move", B[3], B[4], "light"), E.scene("send", B[4], B[5], "light")];
  [1, 2, 3, 4].forEach(i => E.wipe(B[i]));

  // 1 · HOOK — everything except the moving part is visible on frame 0 (instant: true). Something must move.
  {
    const s = S[0]; E.cur = s;
    E.blobs(s, [{ x: 620, y: 300, d: 620, c: "#dff5ec", ax: 50, ay: 40 }, { x: -200, y: 1250, d: 700, c: "#fbe6d1", ax: 40, ay: 30, ph: 2 }]);
    const col = E.col(s, "gap:26px;justify-content:flex-start");
    E.chip(col, "Topic label", 0, { instant: true });
    E.text(col, "One *clear* claim with *$one number* in it.", { size: 112, instant: true, lh: 1.03, id: "hook" });
    E.text(col, "One line of context under the claim.", { size: 48, weight: 700, color: C.mute, instant: true, id: "sub" });
    // the moving part: a dial that counts 0 → 100 over the first 5 seconds
    const row = E.el(col, "", "display:flex;align-items:center;gap:40px;margin-top:30px");
    E.std.dial(row, 400, { from: 0, to: 100, t0: 0, t1: 5.2, label: "unit", ticks: 12, color: C.mintD });
  }

  // 2 · THE NAMED HABIT (dark) — a name that lands with a stamp, a one-line definition, the thing people say
  E.std.habit(S[1], B[1], { name: "The Habit Name", size: 150, def: "What people do, in one short line.", quote: "“What they say.”", qsize: 54, decor: "100", decorSize: 380 });

  // 3 · WHY IT HAPPENS — a small diagram, then up to three cards (≤ 11 words each, start them ≥ 1.6 s apart)
  {
    const s = S[2]; E.cur = s; const t0 = B[2];
    E.blobs(s, [{ x: 700, y: 1100, d: 560, c: "#dff5ec", ax: 40, ay: 30 }, { x: -220, y: 250, d: 520, c: "#fbe6d1", ph: 1.4 }]);
    const col = E.col(s, "gap:34px;justify-content:flex-start");
    E.chip(col, "Why it happens", t0 + .2);
    const g = E.dots(col, { n: 120, cols: 20, size: 32, gap: 8, t0: t0 + .6, t1: t0 + 4.2 });   // 120 dots that fill in
    E.card(col, { t: t0 + 1.6, icon: "doc", iconBg: C.mint, text: "First reason, in plain words.", size: 50, ic: 116 });
    E.card(col, { t: t0 + 3.6, icon: "calendar", iconBg: "#fbe6d1", text: "Second reason, in plain words.", size: 50, ic: 116 });
    E.card(col, { t: t0 + 5.4, icon: "check", iconBg: "#dff5ec", text: "Third reason, with a *!red flag*.", size: 50, ic: 116 });
  }

  // 4 · THE MOVE — one exact action; a dial or icon row; a check lands with a ding
  {
    const s = S[3]; E.cur = s; const t0 = B[3];
    E.blobs(s, [{ x: 650, y: 200, d: 600, c: "#dff5ec", ax: 50, ay: 40 }, { x: -240, y: 1150, d: 640, c: "#fbe6d1", ph: 2.2 }]);
    const col = E.col(s, "gap:34px;justify-content:center");
    E.chip(col, "The move", t0 + .2);
    E.card(col, { t: t0 + .8, icon: "doc", iconBg: C.mint, text: "Do this one thing on the *Portal*.", size: 52, ic: 112 });
    E.card(col, { t: t0 + 2.4, icon: "calendar", iconBg: "#fbe6d1", text: "By this *$deadline*.", size: 52, ic: 112 });
    const ck = E.el(col, "", "align-self:flex-start;margin-top:20px"); ck.innerHTML = E.icons.check(190);
    E.pop(ck, t0 + 4.6, { from: .2, dur: .55 }); E.S(t0 + 4.62, "ding"); E.S(t0 + 4.68, "sparkle", .8);
  }

  // 5 · SEND-LINE + FOLLOW REASON
  E.std.send(S[4], B[4], { send: "Send this to someone who *needs* it.", follow: "Follow for one plain-English Portugal tax rule at a time.", icon: "doc" });

  E.finish(B[5]);
}
