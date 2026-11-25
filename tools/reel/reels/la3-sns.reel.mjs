// LA3 "Got your SNS number? It might not cover you yet." Narrated explainer. Facts (docs/ideas-research-3.md, SNS 24): any foreigner
// with legal residence can get a número de utente, assigned at the first visit to a health centre or hospital; the SNS covers costs
// only when the number is linked to an ID document, a Portuguese NIF, a full Portuguese address and a valid residence permit.
// Emergencies: 112. Not claimed: what you pay without coverage.
export const meta = {
  id: "la3-sns", date: "2026-12-03",
  images: {
    o_card: "characters/cutouts/otto-casual_card.webp", o_shock: "characters/cutouts/otto-casual_jawdrop.webp", o_cough: "characters/cutouts/otto-casual_cough.webp",
  },
};

export default function (E) {
  const sk = E.std.sk, ex = E.std.ex, I = E.icons;
  E.episode(-16);
  E.music({ off: true });
  const L1 = .15, L2 = 3.85, L3 = 9.35, L4 = 14.4, L5 = 18.95, L6 = 22.7, DUR = 25.4;
  const S = E.scene("sns", 0, DUR, "light"); E.cur = S;
  ex.bg(S, 0, DUR); ex.tints(S, 2.6, DUR - .8);
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - .9 ? 0 : 1; });

  // 1. hook: Otto proud of his number; a question mark lands
  const O = sk.actor(S, [["o_card", 428, 1031], ["o_shock", 398, 1044]], { x: 260, floor: 1860, scale: 1.1, z: 4, on: [0, L2], face: [[0, "o_card"], [2.2, "o_shock"]] });
  const num = ex.card(S, `<div style="font-size:28px;color:#0f3b3a">Nº DE UTENTE · SNS</div><div style="font:900 60px monospace;margin-top:8px;white-space:nowrap">123 456 789</div>`,
    { x: 410, y: 820, w: 560, t0: 0, t1: L3, css: "border:6px solid #2f6db5;text-align:center" });
  E.K(num, "r", Array.from({ length: 8 }, (_, k) => [k * .25, k % 2 ? 3 : -3, "io"]));
  const q = E.el(S.el, "abs", "left:600px;top:1060px;font-weight:900;font-size:260px;color:#d62828;-webkit-text-stroke:8px #fff;paint-order:stroke;z-index:9", "?");
  sk.vis(q, 2.2, L2); E.pop(q, 2.2, { from: 2, dur: .3 });
  ex.head(S, "Got your SNS number? It might *not cover you* yet.", 0, L2 - .1, { instant: true, size: 80, top: 260 });
  // 2. anyone legally resident can get one, at the first visit
  E.K(num, "y", [[L2, 0], [L2 + .4, -160, "io"]]); E.K(num, "x", [[L2, 0], [L2 + .4, -330, "io"]]); E.K(num, "s", [[L2, 1], [L2 + .4, .8, "io"]]);
  const hc = ex.tile(S, ex.icon.health(170), "Health centre or hospital", { x: 560, y: 980, t0: L2 + .5, t1: L3, s: 230, w: 330, fs: 40 });
  ex.arrow(S, 380, 1100, 560, 1100, L2 + 2.4, L3, { col: "#2f6db5" });
  const fv = E.el(S.el, "abs", "left:100px;top:1500px;width:780px;text-align:center;font-weight:900;font-size:56px;color:#0f3b3a;z-index:9", "At your first visit");
  sk.vis(fv, L2 + 2.6, L3); E.pop(fv, L2 + 2.6, { from: .5 });
  ex.head(S, "Any *legal resident* can get one.", L2 + .1, L3, { size: 76, top: 300 });
  // 3–4. the four links
  const items = [["ID document", L4 + .1], ["Portuguese NIF", L4 + 1.0], ["Portuguese address", L4 + 1.9], ["Residence permit", L4 + 3.0]];
  const list = ex.card(S, "", { x: 120, y: 620, w: 740, t0: L3 + .3, t1: L6, pad: 30 });
  const slots = items.map(([lab, t], i) => {
    const r = E.el(list, "", "display:flex;align-items:center;gap:26px;font-size:56px;padding:18px 0", `<span class="box" style="width:76px;height:76px;border:6px solid #0f3b3a;border-radius:16px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:52px"></span><span>${lab}</span>`);
    const b = r.querySelector(".box");
    E.F(tt => { const on = i < 3 ? tt >= t : (tt >= t && tt < L5) || tt >= L5 + 2.4; b.style.background = on ? "#1f9d55" : (i === 3 && tt >= L5 && tt < L5 + 2.4 ? (Math.floor(tt * 4) % 2 ? "#d62828" : "#fff") : "#fff"); b.textContent = on ? "✓" : ""; });
    return r;
  });
  ex.head(S, "Covered only when it's linked to *4 things*:", L3 + .1, L5, { size: 64, top: 300 });
  // 5. missing one: Otto sweating in a waiting room
  const O2 = sk.actor(S, [["o_cough", 388, 974]], { x: 720, floor: 1900, scale: .72, z: 4, on: [L5, L6] }); sk.shakeA(O2, L5 + .2, 12);
  ex.head(S, "Missing one? Fix it *before* you need a doctor.", L5 + .1, L6, { size: 64, top: 300 });
  // 6. 112
  const e = E.el(S.el, "abs", "left:100px;top:700px;width:780px;text-align:center;z-index:9");
  E.stamp(e, "112", L6 + .2, { size: 300, rot: -4, bg: "#d62828", fg: "#fff", shake: 10, sound: null }); sk.vis(e, L6 + .1, DUR + 1);
  ex.head(S, "Emergency? Call *112*.", L6 - .3, DUR + 1, { size: 90, top: 300 });

  E.clip(0.02, "sfx/elx-msg-pop.wav", { vol: .4, duck: false });
  [["l1", L1], ["l2", L2], ["l3", L3], ["l4", L4], ["l5", L5], ["l6", L6]].forEach(([k, t]) => E.clip(t, `voices/la3-sns/${k}.wav`, { vol: 1.2 }));
  E.clip(2.2, "sfx/bonk.wav", { vol: 1.5, duck: false });
  items.forEach(([, t]) => E.clip(t, "sfx/app-success.wav", { vol: .3, duck: false }));
  E.clip(L5, "sfx/elx-heartbeat.wav", { vol: .4, to: L6, duck: false });
  E.clip(L6 + .2, "sfx/elx-siren.wav", { vol: .25, duck: false });
  E.clip(0, "../tools/reel/eps/la3-sns/audio/music44.wav", { vol: .16, to: DUR });
  sk.punch(S, 1.5, DUR - 1.2, 2.2, 1.05);
  E.finish(DUR);
}
