// EP.151 "Shaking a rug out of your window can cost €1,000 in Lisbon." STYLE TEST: 3D miniature diorama on the Lisbon street kit
// (eps/ep151-tapete/scene.py → media/clip.mp4, laid under this magenta layer: layclip.sh ep151-tapete 14.3).
// Lisbon Regulamento de Gestão de Resíduos, Limpeza e Higiene Urbana (Aviso n.º 20811-B/2019) art. 84.º n.º 2 g): shaking or beating
// blankets, doormats, rugs, carpets, clothes… from windows and doors facing the street between 8:00 and 23:00: €50–€1,000 for
// individuals (negligence halves, art. 86.º). Amendments since 2019 not checked. Music: compose.py ep151.
export const meta = { id: "ep151-tapete", date: "2026-12-05", images: {} };

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 14.3;
  const FINE = 4.5, CARD = 6.4, DUST = 10.2, SERIO = 11.6;
  const S = E.scene("tapete", 0, DUR, "dark"); E.cur = S;
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff");
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);

  const hookWords = [["Shaking", .2, 1], ["a", .55], ["rug", .65, 1], ["out", .9], ["of", 1.05], ["your", 1.15], ["window", 1.3], ["can", 1.9], ["cost", 2.05], ["€1,000", 2.4, 1], ["in", 3.3], ["Lisbon.", 3.45]];
  const H = E.el(S.el, "abs", "left:40px;top:1150px;width:1000px;text-align:center;z-index:10;line-height:1.08");
  E.F(t => { H.style.opacity = t < FINE - .1 ? 1 : 0; });
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:96px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.08, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  const card = E.el(S.el, "abs", "left:90px;top:1080px;width:900px;padding:28px 0;border-radius:30px;background:#fbfaf6;text-align:center;font-weight:900;color:#1d2b36;z-index:9;opacity:0;line-height:1.1;box-shadow:0 20px 40px rgba(0,0,0,.4)",
    "<span style='font-size:60px'>8:00 – 23:00, street-facing</span><br><span style='font-size:110px;color:#c62828'>€50–€1,000</span>");
  E.F(t => { card.style.opacity = t >= CARD && t < DUST ? 1 : 0; }); E.pop(card, CARD, { from: .5, dur: .22 });
  const law = E.el(S.el, "abs", "left:90px;top:1420px;width:900px;text-align:center;z-index:9;opacity:0", "<span style='display:inline-block;background:#10151f;color:#fff;border-radius:12px;padding:8px 20px;font-weight:700;font-size:30px'>Lisbon urban hygiene rules, art. 84.º</span>");
  E.F(t => { law.style.opacity = t >= CARD + .4 && t < DUST ? 1 : 0; });

  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const cap = E.el(S.el, "abs", "left:70px;top:1590px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const CAPS = [[FINE, "Between 8 am and 11 pm,"], [6.9, "it's a fine: €50 to €1,000."], [DUST - .1, ""], [SERIO, `"A sério?!"${sub("Seriously?!")}`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  E.clip(0, "sfx/street-sunny.wav", { vol: 0.25, to: DUR, duck: true });
  for (const t of [.3, 1.1, 1.9, 2.7, 3.5, 5.0, 6.6, 8.2]) E.clip(t, "sfx/fs-curtain-flap.wav", { vol: 0.35, duck: false });
  E.clip(0.15, "voices/ep151/n151_hook.wav", { vol: 1.2 });
  E.clip(FINE, "voices/ep151/n151_fine.wav", { vol: 1.2 });
  E.clip(DUST, "sfx/elx-paper-avalanche.wav", { vol: 0.3, duck: false });
  E.clip(DUST + .6, "sfx/cough.wav", { vol: 0.5, duck: false });
  E.clip(SERIO, "voices/ep151/o151_serio.wav", { vol: 1.3 });
  E.clip(12.8, "sfx/fs-window-slam.wav", { vol: 0.6, duck: false });
  E.clip(0, "../tools/reel/eps/ep151-tapete/audio/music44.wav", { vol: 0.24, to: DUR });
  E.finish(DUR);
}
