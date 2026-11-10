// EP.131 "Can you name your baby Khaleesi in Portugal?" — the clerk raises her stamp (real clip). Otto, new dad: "Khaleesi. Final answer."
// Narrator: Portugal keeps an official list of approved names; Khaleesi is on it, so are Nirvana, Kevin and Elvis (IRN admitted-names
// list). Otto: "Her full name is Khaleesi Nirvana Elvis Kevin Otto Junior the Third." Narrator: a full name can only have six words
// (IRN, Composição do nome). Clerk: "Seis palavras. Escolha." (Six words. Choose.) Otto: "…Kevin." Only the names appear as words;
// no character imagery. Narrator: Finkavo Narrator. Music: compose.py ep131. Opening clip laid under magenta afterwards.
export const meta = {
  id: "ep131-nomes", date: "2026-11-15",
  images: {
    reg: "characters/scenes/bg_registo.webp", baby: "characters/cutouts/otto-coat_baby.webp", clerk: "characters/cutouts/clerk_stamp.webp",
    defeated: "characters/cutouts/otto_defeated.webp",
  },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 24.0;
  const OK = 2.75, LIST = 4.8, APPR = 7.8, FULL = 12.2, SIX = 17.0, SEIS = 19.8, KEVIN = 21.9, STAMP = 22.5;
  const S = E.scene("names", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. the real clip (0 – 2.75) ============
  const M = E.el(S.el, "abs", "inset:0;background:#ff00ff"); show(M, [[0, OK]]);
  const tick = E.el(M, "abs", "left:0;top:1900px;width:4px;height:4px;background:#fe00ff"); E.K(tick, "x", [[0, 0], [DUR, 20, "lin"]]);
  const hookWords = [["Can", .2], ["you", .35], ["name", .5], ["your", .75], ["baby", .9], ["Khaleesi", 1.2, 1], ["in", 1.75], ["Portugal?", 1.85]];
  const H = E.el(S.el, "abs", "left:40px;top:250px;width:1000px;text-align:center;z-index:10;line-height:1.08"); show(H, [[0, OK]]);
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:104px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  // ============ 2. the registry (2.75 – 4.8, 19.8 – end) ============
  const R = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(R, [[OK, LIST], [SEIS, DUR]]); E.img(R, "reg", COVER);
  const ob = fig(R, "baby", 678, 1024, 1.05, 330, 1880, 5); show(ob, [[OK, LIST]]); E.pop(ob, OK, { from: .85, dur: .2 }); bob(ob, OK, LIST, 6, .5);
  const cl = fig(R, "clerk", 687, 1016, 1.05, 780, 1880, 5); show(cl, [[OK + .8, LIST], [SEIS, DUR]]); E.pop(cl, SEIS, { from: 1.25, dur: .2 });
  const od = fig(R, "defeated", 751, 1108, .95, 300, 1880, 4); show(od, [[KEVIN - .3, DUR]]);
  R.style.transformOrigin = "70% 55%"; E.K(R, "s", [[SEIS, 1.0], [SEIS + .2, 1.12, "out"], [KEVIN, 1.14, "lin"], [KEVIN + .2, 1.0, "out"]]);

  // ============ 3. the official list (4.8 – 12.2) ============
  const L = E.el(S.el, "abs", "left:0;top:-200px;width:1080px;height:2330px;background:#f3efe4;overflow:hidden"); show(L, [[LIST, FULL]]);
  const hdr = E.el(S.el, "abs", "left:0;top:0;width:1080px;height:330px;box-sizing:border-box;padding-top:240px;text-align:center;font-weight:900;font-size:54px;color:#1d2b36;z-index:5;background:#f3efe4;box-shadow:0 10px 18px rgba(0,0,0,.12)", "Approved first names · IRN"); show(hdr, [[LIST, FULL]]);
  const NAMES = ["Abel", "Adriana", "Afonso", "Beatriz", "Bernardo", "Carolina", "Diogo", "Duarte", "Elvis", "Francisca", "Gonçalo", "Inês",
    "Joana", "Kevin", "Khaleesi", "Lara", "Leonor", "Matilde", "Miguel", "Nirvana", "Rodrigo", "Salvador", "Tomás", "Vicente"];
  const col = E.el(L, "abs", "left:240px;top:0;width:600px;z-index:3;font-weight:800;font-size:64px;line-height:96px;color:#1d2b36;text-align:center");
  const order = []; for (let k = 0; k < 4; k++) NAMES.forEach(n => order.push(n));
  order.forEach(n => E.el(col, "", "", n));
  // fast scroll, then settle with Khaleesi in view
  const rowOf = n => order.indexOf(n, NAMES.length * 2);
  const settle = 840 - rowOf("Khaleesi") * 96;
  E.K(col, "y", [[LIST, 400], [APPR, settle, "out"]]);
  const hits = [["Khaleesi", APPR + .1], ["Nirvana", APPR + 1.6], ["Kevin", APPR + 2.4], ["Elvis", APPR + 3.1]];
  hits.forEach(([n, t]) => {
    const y = settle + rowOf(n) * 96;
    const tag = E.el(L, "abs", `left:200px;top:${y + 6}px;width:680px;height:84px;border-radius:42px;background:rgba(73,184,98,.28);border:5px solid #2f9a4c;z-index:4;opacity:0`);
    show(tag, [[t, FULL]]); E.pop(tag, t, { from: 1.4, dur: .18 });
    const ok = E.el(L, "abs", `left:810px;top:${y}px;font-weight:900;font-size:76px;color:#2f9a4c;z-index:6;opacity:0`, "✓");
    show(ok, [[t, FULL]]); E.clip(t, "sfx/fs-rubber-stamp.wav", { vol: 0.35, duck: false });
  });
  // the camera moves down the list to each approved name
  E.K(L, "y", [[APPR, 0], [APPR + 1.4, 0], [APPR + 1.7, -120, "io"], [APPR + 2.3, -120], [APPR + 2.6, 60, "io"], [FULL, 60]]);

  // ============ 4. the full name runs off the form (12.2 – 19.8) ============
  const F = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 50% 40%,#2c3550,#121828);overflow:hidden"); show(F, [[FULL, SEIS]]);
  const form = E.el(F, "abs", "left:90px;top:330px;width:900px;height:640px;background:#fbf8f1;border-radius:10px;box-shadow:0 30px 60px rgba(0,0,0,.45);z-index:3");
  E.el(form, "abs", "left:40px;top:30px;width:820px;font-weight:900;font-size:46px;color:#1d2b36", "Registo de nascimento");
  E.el(form, "abs", "left:40px;top:90px;width:820px;font-weight:700;font-size:30px;color:#7a8791", "(birth registration) · Nome completo:");
  const WORDS = ["Khaleesi", "Nirvana", "Elvis", "Kevin", "Otto", "Junior", "the", "Third"];
  const box = E.el(form, "abs", "left:40px;top:160px;width:820px;z-index:4;font-weight:900;font-size:62px;line-height:84px;color:#1d2b36");
  const wEls = WORDS.map((w, i) => { const sp = E.el(box, "", "display:inline-block;margin-right:.28em;opacity:0;position:relative", w); show(sp, [[FULL + .9 + i * .42, SEIS]]); return sp; });
  const counter = E.el(F, "abs", "left:0;top:1030px;width:1080px;text-align:center;font-weight:900;font-size:90px;color:#ffd640;z-index:6", "");
  E.F(t => { const n = t < SIX ? Math.max(0, Math.min(8, Math.floor((t - FULL - .9) / .42) + 1)) : Math.max(6, 8 - Math.floor((t - SIX - .9) / .5)); const s = t < FULL + .9 ? "" : t < SIX ? `${n} words` : `${n} words · max 6`; if (counter.textContent !== s) counter.textContent = s; counter.style.color = t >= SIX && n > 6 ? "#ff6b5a" : (t >= FULL + 2.4 && t < SIX ? "#1d2b36" : "#ffd640"); });
  [7, 6].forEach((idx, k) => { const st = E.el(wEls[idx], "abs", "left:-6px;top:38px;height:9px;width:0;background:#c62828"); E.K(st, "w", [[SIX + .9 + k * .5, 0], [SIX + 1.15 + k * .5, 260, "out"]]); });
  form.style.transformOrigin = "50% 40%";
  E.K(form, "s", [[FULL, 1.1], [FULL + .4, 1, "out"], [FULL + 2.3, 1.02, "lin"], [FULL + 2.5, 1.1, "out"], [SIX, 1.12, "lin"], [SIX + .3, 1.16, "out"], [SEIS, 1.18, "lin"]]);
  E.F(t => { F.style.background = t < FULL + 2.4 ? "radial-gradient(circle at 50% 40%,#2c3550,#121828)" : t < SIX ? "radial-gradient(circle at 50% 40%,#ffe9a8,#e8b84a)" : "radial-gradient(circle at 50% 40%,#4a2a2a,#1c0f0f)"; });

  // ============ 5. KEVIN, approved (21.9 – end) ============
  const stampBox = E.el(R, "abs", "left:110px;top:430px;width:860px;text-align:center;z-index:9;opacity:0");
  E.el(stampBox, "", "font-weight:900;font-size:140px;color:#1d2b36;-webkit-text-stroke:3px #fff;line-height:1", "KEVIN");
  E.el(stampBox, "", "display:inline-block;margin-top:20px;border:10px solid #2f9a4c;border-radius:18px;color:#2f9a4c;font-weight:900;font-size:84px;padding:4px 30px;transform:rotate(-8deg);background:rgba(255,255,255,.85)", "APPROVED");
  show(stampBox, [[STAMP, DUR]]); E.pop(stampBox, STAMP, { from: 1.8, dur: .18 });

  // ============ captions ============
  const cap = E.el(S.el, "abs", "left:70px;top:1385px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12", "");
  const sub = en => `<br><span style='font-size:40px;color:#ffd640'>(${en})</span>`;
  const CAPS = [[OK, "\"Khaleesi. Final answer.\""], [OK + 1.9, ""], [LIST, "Portugal keeps an official list of approved names."], [LIST + 2.9, ""],
    [APPR, "Khaleesi? Approved."], [APPR + 1.5, "So are Nirvana, Kevin and Elvis."], [APPR + 4.2, ""],
    [FULL, "\"Great! Her full name is…\""], [FULL + 4.7, ""], [SIX, "But a full name can only have six words."], [SIX + 2.7, ""],
    [SEIS, `"Seis palavras. Escolha."${sub("Six words. Choose.")}`], [SEIS + 1.9, ""], [KEVIN, "\"…Kevin.\""]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.dataset.s !== s) { cap.dataset.s = s; cap.innerHTML = s ? `<span style="display:inline-block;background:#10151f;border-radius:18px;padding:10px 26px">${s}</span>` : ""; } });

  // ============ sound ============
  E.clip(0.05, "sfx/fs-rubber-stamp.wav", { vol: 0.25, duck: false });
  E.clip(0.15, "voices/ep131/n_khaleesi.wav", { vol: 1.2 });
  E.clip(OK, "voices/ep131/o_khaleesi.wav", { vol: 1.2 });
  E.clip(LIST, "sfx/elx-paper-unfold.wav", { vol: 0.4, duck: false });
  E.clip(LIST, "voices/ep131/n_list.wav", { vol: 1.2 });
  E.clip(APPR, "voices/ep131/n_approved.wav", { vol: 1.2 });
  E.clip(FULL, "voices/ep131/o_fullname.wav", { vol: 1.2 });
  E.clip(SIX, "voices/ep131/n_six.wav", { vol: 1.2 });
  E.clip(SEIS, "voices/ep131/c_seis.wav", { vol: 1.25 });
  E.clip(KEVIN, "voices/ep131/o_kevin.wav", { vol: 1.25 });
  E.clip(STAMP, "sfx/fs-rubber-stamp.wav", { vol: 0.8, duck: false });
  E.clip(0, "../tools/reel/eps/ep131-nomes/audio/music44.wav", { vol: 0.3, to: DUR });
  E.finish(DUR);
}
