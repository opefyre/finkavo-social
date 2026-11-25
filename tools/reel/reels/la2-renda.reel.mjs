// LA2 "Paying rent in cash? You're losing up to €900." Narrated explainer. Facts (docs/ideas-research-3.md, DL 97/2026):
// landlords must issue rent receipts, most electronically on the Portal das Finanças; the lease must be registered with Finanças
// by the end of the month after it starts; tenants get 15% of rent back on IRS, up to €900 for 2026.
export const meta = {
  id: "la2-renda", date: "2026-12-02",
  images: {
    o_cash: "characters/cutouts/otto-casual_wallet.webp", o_shock: "characters/cutouts/otto-casual_jawdrop.webp", o_ok: "characters/cutouts/otto-casual_proud.webp",
    l_smug: "characters/cutouts/renda_smug.webp", l_grin: "characters/cutouts/renda_evil-grin.webp",
  },
};

export default function (E) {
  const sk = E.std.sk, ex = E.std.ex, I = E.icons;
  E.episode(-16);
  E.music({ off: true });
  const L1 = .15, L2 = 5.65, L3 = 11.1, L4 = 16.95, L5 = 24.3, DUR = 28.4;
  const S = E.scene("renda", 0, DUR, "light"); E.cur = S;
  ex.bg(S, 0, DUR); ex.tints(S, 2.6, DUR - .8);
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - .9 ? 0 : 1; });

  // 1. hook: cash changes hands, €900 cracks
  const O = sk.actor(S, [["o_cash", 636, 1039], ["o_shock", 398, 1044]], { x: 250, floor: 1860, scale: 1.05, z: 4, on: [0, L2], face: [[0, "o_cash"], [3.4, "o_shock"]] });
  const LL = sk.actor(S, [["l_smug", 672, 1030], ["l_grin", 672, 1030]], { x: 790, floor: 1860, scale: 1.0, z: 3, on: [0, L2], face: [[0, "l_smug"], [1.5, "l_grin"]] });
  for (let k = 0; k < 5; k++) {
    const n = E.el(S.el, "abs", "left:330px;top:1180px;width:150px;height:150px;z-index:6"); n.innerHTML = I.banknote(150);
    const t0 = k * .55; E.K(n, "x", [[t0, 0], [t0 + .5, 330, "out"]]); E.K(n, "y", [[t0, 0], [t0 + .25, -120, "out"], [t0 + .5, -40, "in"]]); E.K(n, "r", [[t0, -10], [t0 + .5, 20]]);
    E.K(n, "o", [[0, k === 0 ? 1 : 0], [t0 - .01, k === 0 ? 1 : 0], [t0, 1], [t0 + .5, 1], [t0 + .55, 0]]);
  }
  ex.head(S, "Paying rent in cash? You're losing up to *€900*.", 0, L2 - .1, { instant: true, size: 84, top: 260 });
  const lose = E.el(S.el, "abs", "left:250px;top:1500px;font-weight:900;font-size:200px;color:#d62828;-webkit-text-stroke:8px #fff;paint-order:stroke;z-index:9;transform:rotate(-8deg)", "–€900");
  sk.vis(lose, 3.4, L2); E.pop(lose, 3.4, { from: 1.8, dur: .3 });
  // 2. receipts: a laptop prints an electronic receipt
  const lap = ex.card(S, `<div style="background:#0f3b3a;border-radius:16px;height:300px;display:flex;align-items:center;justify-content:center;color:#7fe0c0;font-size:40px">TAX PORTAL</div><div style="height:26px;background:#cfd8dc;border-radius:0 0 30px 30px;margin:0 -40px"></div>`,
    { x: 170, y: 1080, w: 640, t0: L2, t1: L3, pad: 26 });
  const rc = ex.card(S, `<div style="font-size:30px;color:#0f3b3a">RECIBO DE RENDA ELETRÓNICO</div><div style="font-size:24px;color:#8a6a1c">(electronic rent receipt)</div><div style="font-size:30px;margin-top:14px;line-height:1.5;color:#333">Rent · December<br>Tenant NIF ✓</div>`,
    { x: 230, y: 700, w: 520, t0: L2 + 1.2, t1: L3, css: "border:6px solid #1f9d55" });
  E.K(rc, "y", [[L2 + 1.2, 380], [L2 + 2.0, 0, "out"]]);
  ex.head(S, "Your landlord *must* give you rent receipts.", L2 + .1, L3, { size: 68, top: 300 });
  // 3. the lease registered
  const lease = ex.card(S, `<div style="font-size:34px;color:#0f3b3a">LEASE · CONTRATO</div><div style="height:16px;background:#e5e5e5;margin:18px 0;border-radius:8px"></div><div style="height:16px;background:#e5e5e5;margin:18px 0;border-radius:8px;width:80%"></div><div style="height:16px;background:#e5e5e5;margin:18px 0;border-radius:8px;width:60%"></div>`,
    { x: 120, y: 760, w: 520, t0: L3, t1: L4 });
  const st = E.el(S.el, "abs", "left:360px;top:960px;z-index:9"); E.stamp(st, "REGISTERED", L3 + 2.0, { size: 64, rot: -10, bg: "#1f9d55", shake: 6, sound: null }); sk.vis(st, L3 + 1.9, L4);
  const cal = ex.card(S, `<div style="font-size:28px;color:#666">Lease starts</div><div style="font-size:58px">January</div><div style="font-size:28px;color:#666;margin-top:12px">Register by</div><div style="font-size:52px;color:#d62828">end of February</div>`,
    { x: 470, y: 1220, w: 420, t0: L3 + 2.6, t1: L4, css: "text-align:center;border:6px solid #d62828" });
  ex.head(S, "The lease must be *registered* with the tax office.", L3 + .1, L4, { size: 64, top: 300 });
  // 4. the maths
  const rows = [["Rent €500 × 12", "€6,000", L4 + .6], ["× 15%", "€900", L4 + 2.6], ["Cap for 2026", "€900", L4 + 4.6]];
  const calc = ex.card(S, "", { x: 110, y: 640, w: 760, t0: L4, t1: L5, pad: 30 });
  rows.forEach(([a, b, t], i) => {
    const r = E.el(calc, "", `display:flex;justify-content:space-between;font-size:58px;padding:14px 0;border-bottom:${i < 2 ? "4px dashed #ddd" : "none"};color:${i === 2 ? "#1f9d55" : "#141414"}`, `<span>${a}</span><span>${b}</span>`);
    sk.vis(r, t, L5); E.pop(r, t, { from: .6, dur: .25 });
  });
  const back = E.el(S.el, "abs", "left:100px;top:1200px;width:780px;text-align:center;z-index:9"); E.stamp(back, "€900 BACK", L4 + 5.6, { size: 110, rot: -5, bg: "#1f9d55", shake: 8, sound: null }); sk.vis(back, L4 + 5.5, L5);
  ex.head(S, "Tenants get *15%* of their rent back on IRS.", L4 + .1, L5, { size: 64, top: 300 });
  // 5. close
  const O2 = sk.actor(S, [["o_ok", 625, 1078]], { x: 490, floor: 1860, scale: 1.12, z: 4, on: [L5, DUR] }); sk.hop(O2, L5 + .1, 50);
  const rr = E.el(S.el, "abs", "left:600px;top:930px;width:170px;height:230px;background:#fffdf5;border:4px solid #1f9d55;border-radius:10px;z-index:6;font-weight:900;font-size:24px;padding:12px;line-height:1.4;transform:rotate(10deg)", "RECIBO<br>Rent<br>────<br>✓"); sk.vis(rr, L5, DUR);
  ex.head(S, "No receipts, *no deduction*. Ask for them.", L5 - .3, DUR + 1, { size: 84, top: 290 });

  E.clip(0.02, "sfx/elx-chaching.wav", { vol: .35, duck: false });
  [["l1", L1], ["l2", L2], ["l3", L3], ["l4", L4], ["l5", L5]].forEach(([k, t]) => E.clip(t, `voices/la2-renda/${k}.wav`, { vol: 1.2 }));
  E.clip(3.4, "sfx/elx-glass-smash.wav", { vol: .3, duck: false });
  E.clip(L2 + 1.2, "sfx/elx-label-print.wav", { vol: .5, duck: false });
  E.clip(L3 + 2.2, "sfx/fs-rubber-stamp.wav", { vol: .6, duck: false });
  rows.forEach(([, , t]) => E.clip(t, "sfx/elx-msg-pop.wav", { vol: .35, duck: false }));
  E.clip(L4 + 5.8, "sfx/fs-rubber-stamp.wav", { vol: .6, duck: false }); E.clip(L4 + 6.0, "sfx/elx-chaching.wav", { vol: .4, duck: false });
  E.clip(0, "../tools/reel/eps/la2-renda/audio/music44.wav", { vol: .16, to: DUR });
  sk.punch(S, 1.5, DUR - 1.2, 2.2, 1.05);
  E.finish(DUR);
}
