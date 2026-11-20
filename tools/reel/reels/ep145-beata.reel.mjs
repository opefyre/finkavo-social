// EP.145 "This tiny thing can cost you €250 in Portugal." STYLE TEST: 3D miniature diorama on the Lisbon street kit
// (eps/ep145-beata/scene.py → media/clip.mp4, laid under this magenta layer: layclip.sh ep145-beata 14.4).
// Lei 88/2019 art. 3.º: dropping cigarette/cigar butts in public space is prohibited; art. 11.º n.º 1: fine €25–€250 (DL 433/82);
// in force since 3 Sep 2020 (art. 14.º n.º 2). Amendments not checked on the DR consolidated version. Music: compose.py ep145.
export const meta = { id: "ep145-beata", date: "2026-11-30", images: { flagpt: "characters/props/flag-pt.webp", tp: "characters/props/cigarette-butt.webp" } };

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 14.4;
  const FINE = 4.6, SIGN = 6.6, PICK = 10.8, PRONTO = 12.8;
  const S = E.scene("beata", 0, DUR, "dark"); E.cur = S;
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff");
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);

  const hookWords = [["This", .2], ["tiny", .4, 1], ["thing", .65], ["can", 1.1], ["cost", 1.3], ["you", 1.5], ["€250", 1.9, 1], ["in", 3.2], ["Portugal.", 3.35]];
  const H = E.el(S.el, "abs", "left:40px;top:1160px;width:1000px;text-align:center;z-index:10;line-height:1.25");
  E.F(t => { H.style.opacity = t < FINE - .1 ? 1 : 0; });
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:7px 6px;padding:2px 18px 6px;border-radius:12px;font-weight:900;font-size:94px;color:#141414;background:${key ? "#ffd640" : "#ffffff"};border:5px solid #141414;box-shadow:0 10px 0 #141414;transform:rotate(${(w.length % 3 - 1) * 1.5}deg)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.08, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });
  // ===== hook visuals: big number badge + real cut-out symbols (Portugal flag, topic object), popping in on the word =====
  const HV = (el, a, b) => E.F(t => { el.style.opacity = t >= a && t < b ? 1 : 0; });
  const HY = { row: 600, bx: 610, by: 140 };
  const BG = E.el(S.el, "abs", `left:${HY.bx}px;top:${HY.by}px;width:430px;height:430px;border-radius:50%;background:#d62828;border:12px solid #fff;box-shadow:0 14px 30px rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;z-index:31;line-height:1`, "<span style='font-size:120px;-webkit-text-stroke:4px #141414'>€250</span>");
  HV(BG, 0, FINE - .1); BG.style.rotate = "-8deg";
  E.K(BG, "s", Array.from({ length: 12 }, (_, k) => [k * .3, k % 2 ? 1.1 : 1, "io"]));
  [[0.4, "tp", 300], [3.35, "flagpt", 360]].forEach(([t, key, w], i, all) => {
    const x = 540 + (i - (all.length - 1) / 2) * 400 - w / 2;
    const st = E.el(S.el, "abs", `left:${x}px;top:${HY.row}px;width:${w}px;height:${w}px;z-index:31;filter:drop-shadow(0 12px 14px rgba(0,0,0,.6))`);
    E.img(st, key, `width:${w}px;height:${w}px;object-fit:contain`);
    HV(st, t, FINE - .1); E.K(st, "s", [[t, .2], [t + .14, 1.15, "out"], [t + .3, 1, "io"]]);
    st.style.transformOrigin = key === "flagpt" ? "8% 90%" : "50% 100%";
    E.K(st, "r", Array.from({ length: 16 }, (_, j) => [t + j * .35, j % 2 ? (key === "flagpt" ? 5 : 3) : (key === "flagpt" ? -4 : -3), "io"]));
  });

  const card = E.el(S.el, "abs", "left:150px;top:250px;width:780px;padding:22px 0;border-radius:26px;background:#fbfaf6;text-align:center;font-weight:900;color:#1d2b36;z-index:9;opacity:0;line-height:1.15;box-shadow:0 20px 40px rgba(0,0,0,.4)",
    "<span style='font-size:52px'>any public space</span><br><span style='font-size:30px;color:#7a8794'>Lei 88/2019, art. 3.º and 11.º</span>");
  E.F(t => { card.style.opacity = t >= 7.6 && t < PICK ? 1 : 0; }); E.pop(card, 7.6, { from: .6, dur: .22 });

  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const cap = E.el(S.el, "abs", "left:70px;top:1590px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const CAPS = [[FINE, "Drop a cigarette butt anywhere public,"], [7.0, "and it's a fine: €25 to €250."], [PICK - .2, ""], [PRONTO, `"Pronto."${sub("There.")}`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  E.clip(0, "sfx/street-sunny.wav", { vol: 0.3, to: DUR, duck: true });
  E.clip(0.15, "voices/ep145/n145_hook.wav", { vol: 1.2 });
  E.clip(1.0, "sfx/elx-slowmo.wav", { vol: 0.35, duck: false });
  E.clip(FINE, "voices/ep145/n145_fine.wav", { vol: 1.2 });
  E.clip(SIGN, "sfx/fs-rubber-stamp.wav", { vol: 0.7, duck: false });
  E.clip(PICK, "sfx/tiptoe.wav", { vol: 0.4, duck: false });
  E.clip(12.35, "sfx/elx-drawer-open.wav", { vol: 0.3, duck: false });
  E.clip(12.5, "sfx/coo.wav", { vol: 0.4, duck: false });
  E.clip(PRONTO, "voices/ep145/o145_pronto.wav", { vol: 1.3 });
  E.clip(0, "../tools/reel/eps/ep145-beata/audio/music44.wav", { vol: 0.24, to: DUR });
  E.finish(DUR);
}
