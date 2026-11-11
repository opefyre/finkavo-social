// STYLE SAMPLE 1 (not for posting): 3D miniature diorama. Picture = Blender render (eps/sample-3d/diorama.py → media/clip.mp4),
// laid under this magenta layer with layclip.sh sample-3d 16. Same fact and audio as EP140 (CIRS art. 10.º).
export const meta = { id: "sample-3d", date: "2026-11-11", images: {} };

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 16;
  const D365 = 4.2, ZERO = 6.4, T28 = 8.5, SELL = 10.8, COME = 13.7;
  const S = E.scene("dio", 0, DUR, "dark"); E.cur = S;
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff");
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);
  const hookWords = [["Sell", .2, 1], ["crypto", .4], ["in", .8], ["Portugal", .9], ["after", 1.5], ["a", 1.7], ["year?", 1.8, 1], ["Tax:", 2.5], ["€0", 3.1, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:220px;width:1000px;text-align:center;z-index:10;line-height:1.08");
  E.F(t => { H.style.opacity = t < D365 - .1 ? 1 : 0; });
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:104px;color:${key ? "#7dff8a" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });
  const cap = E.el(S.el, "abs", "left:70px;top:1560px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const CAPS = [[D365, "Hold it 365 days or more,"], [ZERO, "and the gain isn't taxed."], [T28 - .1, ""], [T28, "Sell sooner: 28%."], [SELL - .1, ""],
    [SELL, "\"Day 364. SELL!\""], [COME - .3, ""], [COME, "\"Oh, come ON.\""]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });
  E.clip(0, "sfx/tram-pass.wav", { vol: 0.25, to: D365, duck: false });
  E.clip(0.15, "voices/ep140/n_hook10.wav", { vol: 1.2 });
  E.clip(D365, "voices/ep140/n_365.wav", { vol: 1.2 });
  E.clip(D365 + .2, "sfx/fs-clock-tick.wav", { vol: 0.4, to: D365 + 2.1, duck: false });
  E.clip(6.6, "sfx/elx-chaching.wav", { vol: 0.4, duck: false });
  E.clip(T28, "voices/ep140/n_28.wav", { vol: 1.2 });
  E.clip(8.55, "sfx/fs-rubber-stamp.wav", { vol: 0.8, duck: false });
  E.clip(SELL, "voices/ep140/b_sell.wav", { vol: 1.2 });
  E.clip(13.8, "sfx/fs-rubber-stamp.wav", { vol: 0.8, duck: false });
  E.clip(COME, "voices/ep140/b_comeon.wav", { vol: 1.2 });
  E.clip(0, "../tools/reel/eps/ep140-cripto/audio/music44.wav", { vol: 0.28, to: DUR });
  E.finish(DUR);
}
