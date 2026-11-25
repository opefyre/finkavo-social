// LA1 "Moved flat in Portugal? Do this ONE thing." Narrated explainer. Facts (docs/ideas-research-3.md): change the address on the
// Cartão de Cidadão (online or at a counter); it passes to Finanças, Segurança Social and SNS; confirm with the code from the letter
// or it doesn't count; 60 days; car registration and pet registry are separate.
export const meta = {
  id: "la1-morada", date: "2026-12-01",
  images: { o_box: "characters/cutouts/otto-casual_boxes.webp", o_ok: "characters/cutouts/otto-casual_proud.webp", o_shock: "characters/cutouts/otto-casual_jawdrop.webp" },
};

export default function (E) {
  const sk = E.std.sk, ex = E.std.ex, I = E.icons;
  E.episode(-16);
  E.music({ off: true });
  const L1 = .15, L2 = 4.8, L3 = 8.75, L4 = 12.15, L5 = 18.25, L6 = 22.5, L7 = 27.95, DUR = 29.9;
  const S = E.scene("morada", 0, DUR, "light"); E.cur = S;
  ex.bg(S, 0, DUR); ex.tints(S, 2.6, DUR - .8);
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - .9 ? 0 : 1; });

  // 1. hook: Otto in boxes, four places to update
  const O = sk.actor(S, [["o_box", 457, 1024], ["o_shock", 398, 1044], ["o_ok", 625, 1078]], { x: 250, floor: 1860, scale: 1.12, z: 4, on: [0, L2 + .2], face: [[0, "o_box"], [2.2, "o_shock"]] });
  E.K(O.inner, "r", Array.from({ length: 10 }, (_, k) => [k * .25, k % 2 ? 4 : -4, "io"]));
  ex.head(S, "Moved flat in Portugal? Do this *ONE* thing.", 0, L2 - .1, { instant: true, size: 88, top: 260 });
  const four = [[I.house(150), "Citizen card", 0], [ex.icon.tax(150), "Tax office", 0], [ex.icon.social(150), "Social Security", 0], [ex.icon.health(150), "Health service", 0]];
  four.forEach(([svg, lab, t], i) => { const T = ex.tile(S, svg, lab, { x: 470 + (i % 2) * 300, y: 720 + Math.floor(i / 2) * 380, t0: t, t1: L2 + .3, s: 210, w: 280, fs: 40 }); ex.mark(T.ic, "warn", 1.4 + i * .6); });
  const cnt = E.el(S.el, "abs", "left:560px;top:1440px;font-weight:900;font-size:160px;color:#d62828;z-index:9", "");
  E.F(t => { const n = t < 1.4 ? 0 : Math.min(4, 1 + Math.floor((t - 1.4) / .6)); const s = n ? n + "×" : ""; if (cnt.textContent !== s) cnt.textContent = s; }); sk.vis(cnt, 1.4, L2 + .3);
  // 2. "once" (citizen card holders)
  const once = E.el(S.el, "abs", "left:100px;top:620px;width:780px;text-align:center;z-index:9");
  E.stamp(once, "ONCE.", L2 + 1.2, { size: 170, rot: -6, bg: "#1f9d55", shake: 10, sound: null }); sk.vis(once, L2 + 1.1, L3);
  ex.head(S, "With a Portuguese *citizen card*:", L2 + .2, L3, { size: 70, top: 980 });
  // 3. the card, address rewritten
  const card = ex.card(S, `<div style="font-size:26px;color:#0f3b3a;letter-spacing:.08em">CARTÃO DE CIDADÃO</div>
    <div style="display:flex;gap:22px;margin-top:16px"><div style="width:150px;height:190px;border-radius:14px;background:#cfd8dc"></div>
    <div style="flex:1;font-size:28px;line-height:1.35;color:#333">Name<br><span style="color:#141414">OTTO</span><br>Address<br><span id="addr"></span></div></div>`,
    { x: 100, y: 620, w: 780, t0: L3, t1: L5, css: "border:8px solid #0f3b3a;zoom:1.2" });
  const addr = card.querySelector("#addr");
  E.F(t => { const s = t < L3 + 1.2 ? "<s style='color:#d62828'>Rua Velha, 12</s>" : t < L3 + 2.2 ? "Rua N" : "Rua Nova, 40 ✓"; if (addr.dataset.s !== s) { addr.dataset.s = s; addr.innerHTML = `<b style="font-size:34px">${s}</b>`; } });
  ex.head(S, "Change it *on the card*: online or at a counter.", L3 + .1, L4, { size: 70, top: 1260 });
  // 4. one change → three offices
  E.K(card, "s", [[L4, 1], [L4 + .4, .55, "io"]]); E.K(card, "x", [[L4, 0], [L4 + .4, -230, "io"]]); E.K(card, "y", [[L4, 0], [L4 + .4, 180, "io"]]);
  const dest = [[ex.icon.tax(150), "Tax office", L4 + .9, 640], [ex.icon.social(150), "Social Security", L4 + 1.9, 960], [ex.icon.health(150), "Health service", L4 + 3.4, 1280]];
  dest.forEach(([svg, lab, t, y]) => {
    const T = ex.tile(S, svg, lab, { x: 600, y: y - 60, t0: L4 + .2, t1: L5, s: 190, w: 280, fs: 38 }); ex.mark(T.ic, "ok", t + .4);
    ex.arrow(S, 400, 1060, 610, y + 40, t, L5, { col: "#1f9d55", dur: .35 });
  });
  ex.head(S, "*Automatically.*", L4 + 4.9, L5, { size: 96, top: 300 });
  // 5. the code letter
  const env = ex.card(S, `<div style="font-size:34px;color:#0f3b3a">LETTER · CONFIRMATION CODE</div><div style="font:900 150px monospace;margin-top:10px">4729</div>`,
    { x: 120, y: 640, w: 740, t0: L5, t1: L6, css: "text-align:center;border:6px solid #e0a100" });
  E.K(env, "y", [[L5, 300], [L5 + .35, 0, "out"]]);
  const lock = E.el(S.el, "abs", "left:340px;top:1050px;width:300px;height:300px;z-index:8"); lock.innerHTML = I.lock(300); sk.vis(lock, L5 + 1.4, L6);
  E.K(lock, "r", [[L5 + 3.0, 0], [L5 + 3.15, -20, "out"], [L5 + 3.3, 0, "io"]]); E.pop(lock, L5 + 3.0, { from: 1.4, dur: .25 });
  const no = E.el(S.el, "abs", "left:100px;top:1380px;width:780px;text-align:center;font-weight:900;font-size:70px;color:#d62828;z-index:9", "No code = doesn't count");
  sk.vis(no, L5 + 1.8, L5 + 3.0);
  const yes = E.el(S.el, "abs", "left:100px;top:1380px;width:780px;text-align:center;font-weight:900;font-size:70px;color:#1f9d55;z-index:9", "Code entered ✓");
  sk.vis(yes, L5 + 3.0, L6);
  // 6. 60 days + two separate
  const cal = ex.card(S, `<div style="background:#d62828;color:#fff;font-size:40px;padding:8px;border-radius:14px 14px 0 0;margin:-26px -26px 10px">DEADLINE</div><div style="font-size:150px;line-height:1">60</div><div style="font-size:52px">DAYS</div>`,
    { x: 240, y: 480, w: 460, t0: L6, t1: L7, css: "text-align:center;overflow:hidden;zoom:1.15" });
  const sep = [[I.car(150), "Car registration", L6 + 2.2, 240], [ex.icon.paw(150), "Pet registry", L6 + 3.6, 560]];
  sep.forEach(([svg, lab, t, x]) => { const T = ex.tile(S, svg, lab, { x: x - 40, y: 1220, t0: t, t1: L7, s: 210, w: 320, fs: 40 }); ex.mark(T.ic, "warn", t + .3); });
  const sepl = E.el(S.el, "abs", "left:100px;top:1110px;width:780px;text-align:center;font-weight:900;font-size:62px;color:#0f3b3a;z-index:9", "Still separate:"); sk.vis(sepl, L6 + 2.0, L7);
  // 7. close
  const O2 = sk.actor(S, [["o_ok", 625, 1078]], { x: 490, floor: 1860, scale: 1.15, z: 4, on: [L7, DUR] }); sk.hop(O2, L7 + .1, 50);
  ex.head(S, "One change. *Not four.*", L7 - .3, DUR + 1, { size: 100, top: 300 });

  E.clip(0.02, "sfx/elx-paper-unfold.wav", { vol: .5, duck: false });
  [["l1", L1], ["l2", L2], ["l3", L3], ["l4", L4], ["l5", L5], ["l6", L6], ["l7", L7]].forEach(([k, t]) => E.clip(t, `voices/la1-morada/${k}.wav`, { vol: 1.2 }));
  four.forEach((_, i) => E.clip(1.4 + i * .6, "sfx/elx-msg-pop.wav", { vol: .35, duck: false }));
  E.clip(L2 + 1.2, "sfx/fs-rubber-stamp.wav", { vol: .6, duck: false });
  dest.forEach(([, , t]) => E.clip(t + .4, "sfx/app-success.wav", { vol: .3, duck: false }));
  E.clip(L5, "sfx/elx-envelope-slide.wav", { vol: .5, duck: false }); E.clip(L5 + 3.0, "sfx/elx-keys-fumble.wav", { vol: .4, duck: false });
  E.clip(L6, "sfx/elx-page-flip.wav", { vol: .5, duck: false });
  E.clip(0, "../tools/reel/eps/la1-morada/audio/music44.wav", { vol: .16, to: DUR });
  sk.punch(S, 1.5, DUR - 1.2, 2.2, 1.05);
  E.finish(DUR);
}
