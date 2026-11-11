// EP.148 "Your Portuguese driving licence has an expiry age." STYLE TEST: 3D miniature diorama on the Lisbon street kit
// (eps/ep148-carta/scene.py → media/clip.mp4, laid under this magenta layer: layclip.sh ep148-carta 17.8).
// RHLC (DL 138/2012, republished by DL 40/2016) art. 16.º n.º 2–3: category B revalidated every 15 years until 60, then at 60, 65,
// 70 and every 2 years from 70; art. 17.º n.º 3–4: medical certificate from 60; gov.pt (updated 29.10.2026): licences issued up to
// 1.1.2013 also renew at 50. Fine for an expired licence not confirmed: kept out. Music: compose.py ep148.
export const meta = { id: "ep148-carta", date: "2026-12-01", images: {} };

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 17.8;
  const AGES = 3.5, MED = 8.5, OLD = 11.6, OTIMO = 15.1;
  const S = E.scene("carta", 0, DUR, "dark"); E.cur = S;
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff");
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);

  const hookWords = [["Your", .2], ["Portuguese", .35], ["driving", .95], ["licence", 1.25, 1], ["has", 1.75], ["an", 1.9], ["expiry", 2.0, 1], ["age.", 2.4, 1]];
  const H = E.el(S.el, "abs", "left:40px;top:230px;width:1000px;text-align:center;z-index:10;line-height:1.08");
  E.F(t => { H.style.opacity = t < AGES - .1 ? 1 : 0; });
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:104px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.08, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  const card = (top, html, t0, t1, bg = "#fbfaf6") => {
    const c = E.el(S.el, "abs", `left:90px;top:${top}px;width:900px;padding:30px 0;border-radius:30px;background:${bg};text-align:center;font-weight:900;color:#1d2b36;z-index:9;opacity:0;line-height:1.12;box-shadow:0 20px 40px rgba(0,0,0,.4)`, html);
    E.F(t => { c.style.opacity = t >= t0 && t < t1 ? 1 : 0; }); E.pop(c, t0, { from: .5, dur: .22 }); return c;
  };
  card(240, "<span style='font-size:66px'>from 60:</span><br><span style='font-size:84px;color:#c62828'>medical certificate</span>", MED + .3, OLD - .1);
  card(240, "<span style='font-size:58px'>licence from before 2013?</span><br><span style='font-size:96px;color:#c62828'>also at 50</span>", OLD, OTIMO - .2, "#ffe7a8");
  const law = E.el(S.el, "abs", "left:90px;top:640px;width:900px;text-align:center;z-index:9;opacity:0", "<span style='display:inline-block;background:#10151f;color:#fff;border-radius:12px;padding:8px 20px;font-weight:700;font-size:30px'>Regulamento da Habilitação Legal para Conduzir, arts. 16.º–17.º</span>");
  E.F(t => { law.style.opacity = t >= MED + .6 && t < OTIMO - .2 ? 1 : 0; });

  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const cap = E.el(S.el, "abs", "left:70px;top:1590px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const CAPS = [[AGES, "Renew it at 60, 65 and 70."], [6.5, "Then every 2 years."], [MED - .1, ""], [MED, "From 60, with a medical certificate."], [OLD, "Pre-2013 licences also renew at 50."], [OTIMO - .2, ""],
    [OTIMO, `"Ainda estou ótimo!"${sub("I'm still great!")}`]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  E.clip(0, "sfx/elx-car-drive.wav", { vol: 0.3, to: 9.0, duck: true });
  E.clip(0.15, "voices/ep148/n148_hook.wav", { vol: 1.2 });
  E.clip(AGES, "voices/ep148/n148_ages.wav", { vol: 1.2 });
  for (const t of [4.3, 5.6, 6.9, 8.0]) E.clip(t, "sfx/elx-cabin-ding.wav", { vol: 0.3, duck: false });
  E.clip(MED, "voices/ep148/n148_med.wav", { vol: 1.2 });
  E.clip(MED + .3, "sfx/elx-page-flip.wav", { vol: 0.35, duck: false });
  E.clip(OLD, "sfx/fs-rubber-stamp.wav", { vol: 0.5, duck: false });
  E.clip(OTIMO, "voices/ep148/o148_otimo.wav", { vol: 1.3 });
  E.clip(OTIMO + .1, "sfx/car-horn.wav", { vol: 0.35, duck: false });
  E.clip(0, "../tools/reel/eps/ep148-carta/audio/music44.wav", { vol: 0.24, to: DUR });
  E.finish(DUR);
}
