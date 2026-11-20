// EP.142 "In Portugal, your neighbour's party has a legal bedtime." STYLE TEST: 3D miniature diorama (Blender,
// eps/ep142-ruido/scene.py → media/clip.mp4, laid under this magenta layer: layclip.sh ep142-ruido 13.6).
// Regulamento Geral do Ruído (DL 9/2007): art. 3.º night period 23:00–07:00; art. 24.º n.º 1 police can order neighbourhood noise
// made between 23:00 and 07:00 to stop immediately (n.º 2: by day, with a deadline); ignoring the order is an offence (art. 28.º).
// No fine amount on screen (not confirmed at a primary source). Music: compose.py ep142.
export const meta = { id: "ep142-ruido", date: "2026-11-25", images: { flagpt: "characters/props/flag-pt.webp", tp: "characters/props/party-speaker.webp" } };

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 13.6;
  const LAW = 3.6, COP = 4.6, CARD = 6.4, QUIET = 10.0, FIN = 10.6;
  const S = E.scene("ruido", 0, DUR, "dark"); E.cur = S;
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff");
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);

  const hookWords = [["In", .2], ["Portugal,", .35], ["your", .9], ["neighbour's", 1.05], ["party", 1.6, 1], ["has", 2.0], ["a", 2.15], ["legal", 2.3, 1], ["bedtime.", 2.6, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:1180px;width:1000px;text-align:center;z-index:10;line-height:1.25");
  E.F(t => { H.style.opacity = t < LAW - .1 ? 1 : 0; });
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:7px 6px;padding:2px 18px 6px;border-radius:12px;font-weight:900;font-size:90px;color:#141414;background:${key ? "#ffd640" : "#ffffff"};border:5px solid #141414;box-shadow:0 10px 0 #141414;transform:rotate(${(w.length % 3 - 1) * 1.5}deg)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.08, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });
  // ===== hook visuals: big number badge + real cut-out symbols (Portugal flag, topic object), popping in on the word =====
  const HV = (el, a, b) => E.F(t => { el.style.opacity = t >= a && t < b ? 1 : 0; });
  const HY = { row: 600, bx: 610, by: 140 };
  const BG = E.el(S.el, "abs", `left:${HY.bx}px;top:${HY.by}px;width:430px;height:430px;border-radius:50%;background:#d62828;border:12px solid #fff;box-shadow:0 14px 30px rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;z-index:31;line-height:1`, "<span style='font-size:96px;-webkit-text-stroke:4px #141414'>23:00</span>");
  HV(BG, 0, LAW - .1); BG.style.rotate = "-8deg";
  E.K(BG, "s", Array.from({ length: 12 }, (_, k) => [k * .3, k % 2 ? 1.1 : 1, "io"]));
  [[0.35, "flagpt", 360], [1.6, "tp", 300]].forEach(([t, key, w], i, all) => {
    const x = 540 + (i - (all.length - 1) / 2) * 400 - w / 2;
    const st = E.el(S.el, "abs", `left:${x}px;top:${HY.row}px;width:${w}px;height:${w}px;z-index:31;filter:drop-shadow(0 12px 14px rgba(0,0,0,.6))`);
    E.img(st, key, `width:${w}px;height:${w}px;object-fit:contain`);
    HV(st, t, LAW - .1); E.K(st, "s", [[t, .2], [t + .14, 1.15, "out"], [t + .3, 1, "io"]]);
    st.style.transformOrigin = key === "flagpt" ? "8% 90%" : "50% 100%";
    E.K(st, "r", Array.from({ length: 16 }, (_, j) => [t + j * .35, j % 2 ? (key === "flagpt" ? 5 : 3) : (key === "flagpt" ? -4 : -3), "io"]));
  });

  // rule card
  const card = E.el(S.el, "abs", "left:110px;top:260px;width:860px;padding:26px 0;border-radius:28px;background:#fbfaf6;text-align:center;font-weight:900;color:#1d2b36;z-index:9;opacity:0;line-height:1.1;box-shadow:0 20px 40px rgba(0,0,0,.45)",
    "<span style='font-size:96px'>23:00 – 07:00</span><br><span style='font-size:42px'>police can order it to stop</span><br><span style='font-size:42px;color:#c0392b'>immediately</span>");
  E.F(t => { card.style.opacity = t >= CARD && t < QUIET ? 1 : 0; }); E.pop(card, CARD, { from: .6, dur: .22 });
  const law = E.el(S.el, "abs", "left:110px;top:610px;width:860px;text-align:center;z-index:9;opacity:0", "<span style='display:inline-block;background:#10151f;color:#fff;border-radius:12px;padding:8px 20px;font-weight:700;font-size:30px'>Regulamento Geral do Ruído, art. 24.º</span>");
  E.F(t => { law.style.opacity = t >= CARD + .4 && t < QUIET ? 1 : 0; });

  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const cap = E.el(S.el, "abs", "left:70px;top:1590px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const CAPS = [[LAW, "From 11 pm to 7 am,"], [5.6, "police can order the noise to stop."], [QUIET - .1, ""], [FIN, `"Finalmente."${sub("Finally.")}`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  E.clip(0, "sfx/club-full.wav", { vol: 0.35, to: QUIET, duck: true });
  E.clip(0.15, "voices/ep142/n142_hook.wav", { vol: 1.2 });
  E.clip(LAW, "voices/ep142/n142_law.wav", { vol: 1.2 });
  E.clip(COP, "sfx/elx-siren.wav", { vol: 0.22, to: COP + 1.6, duck: false });
  E.clip(QUIET, "sfx/elx-powerdown.wav", { vol: 0.5, duck: false });
  E.clip(QUIET + .2, "sfx/elx-crickets.wav", { vol: 0.3, to: DUR, duck: false });
  E.clip(FIN, "voices/ep142/o142_fin.wav", { vol: 1.3 });
  E.clip(0, "../tools/reel/eps/ep142-ruido/audio/music44.wav", { vol: 0.22, to: DUR });
  E.finish(DUR);
}
