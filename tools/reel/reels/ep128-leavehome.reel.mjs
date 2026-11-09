// EP.128 "At what age do Portuguese kids leave home?" — a data race: Finland 21.3, EU 26.3, Portugal's bar keeps climbing while
// mum calls "Ó filho, o jantar!" (Son, dinner!) and the son runs past the counter. It lands on 28.8 (Eurostat, 2025); only Croatia,
// Greece, Slovakia, Spain and Italy wait longer. Mum: "Leave? Who's going to iron your shirts?" Son: "Exactly." Mum: "Coitadinho."
// Narrator: Finkavo Narrator. Music: tools/music/compose.py ep128 (rua waltz). Facts: Eurostat yth_demo_030, data updated 16 Apr 2026.
export const meta = {
  id: "ep128-leavehome", date: "2026-11-10",
  images: {
    plate: "../tools/reel/eps/ep128-leavehome/media/frame0-plate.png", kitchen: "characters/scenes/bg_kitchen.webp",
    call: "characters/cutouts/mum_call.webp", shirt: "characters/cutouts/mum_shirt.webp", run: "characters/cutouts/tiago_sprint.webp",
    sonshirt: "characters/cutouts/tiago_shirt.webp", suitcase: "characters/cutouts/tiago_suitcase.webp",
  },
};

export default function (E) {
  E.episode(-16);
  E.music({ off: true });
  const DUR = 24.0;
  const AGE = 0.15, FIN = 2.65, EU = 4.55, PT = 6.85, JANTAR = 8.9, COMING = 10.9, R288 = 12.4, IRON = 18.6, EXACT = 21.3, COIT = 22.6;
  const S = E.scene("leave", 0, DUR, "dark"); E.cur = S;
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };
  const COVER = "position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover";
  E.F(t => { if (E.logo) E.logo.style.opacity = t < DUR - 1 ? 0 : 1; });

  // ============ 1. the real kitchen (0 – 2.6): mum irons, he plays ============
  const A = E.el(S.el, "abs", "inset:0;overflow:hidden;transform-origin:50% 60%"); show(A, [[0, FIN]]);
  E.img(A, "plate", COVER); E.K(A, "s", [[0, 1.04], [FIN, 1.1, "lin"]]);
  for (let i = 0; i < 12; i++) {
    const p = E.el(A, "abs", `left:${130 + (i % 4) * 40}px;top:1150px;width:170px;height:170px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.8),rgba(255,255,255,0) 70%);z-index:6`);
    const t0 = (i * 0.27) % 2.4;
    E.K(p, "y", [[t0, 0], [t0 + 1.8, -380, "out"]]); E.K(p, "o", [[0, 0], [t0, 0], [t0 + .2, 1], [t0 + 1.8, 0]]); E.K(p, "s", [[t0, .6], [t0 + 1.8, 1.8, "out"]]);
  }
  const hookWords = [["At", .2], ["what", .4], ["age", .65], ["do", .85], ["Portuguese", 1.0], ["kids", 1.5], ["leave", 1.75, 1], ["home?", 2.0, 1]];
  const H = E.el(A, "abs", "left:40px;top:280px;width:1000px;text-align:center;z-index:10;line-height:1.08");
  hookWords.forEach(([w, t, key]) => {
    const sp = E.el(H, "", `display:inline-block;margin:0 .2em;font-weight:900;font-size:110px;color:${key ? "#ffd640" : "#fff"};-webkit-text-stroke:4px #141414;text-shadow:0 6px 18px rgba(0,0,0,.55)`, w);
    E.K(sp, "s", [[t - .01, 1], [t + .06, 1.07, "out"], [t + .22, 1, "io"]]);
  });
  E.texts.push({ scene: S, tIn: 0, words: hookWords.length });

  // ============ 2. the race (2.6 – 8.9, and 12.4 – 18.6): bars grow out of the floor ============
  const R = E.el(S.el, "abs", "inset:0;background:linear-gradient(#17233a,#0f1828)"); show(R, [[FIN, JANTAR], [R288, IRON]]);
  E.el(R, "abs", "left:0;top:1250px;width:1080px;height:6px;background:#3b4a66");
  const title = E.el(R, "abs", "left:60px;top:230px;width:960px;text-align:center;font-weight:900;font-size:62px;color:#fff", "Average age young people<br>leave the parental home");
  const src = E.el(R, "abs", "left:60px;top:1452px;width:960px;text-align:center;font-weight:700;font-size:30px;color:#8fa0bd", "Source: Eurostat, 2025");
  const BASE = 1250, PX = 64;              // 1 year = 64 px above 18
  const bar = (x, label, flag, color) => {
    const b = E.el(R, "abs", `left:${x}px;top:${BASE}px;width:200px;height:0;background:${color};border-radius:14px 14px 0 0;z-index:3`);
    E.el(R, "abs", `left:${x - 20}px;top:${BASE + 22}px;width:240px;text-align:center;font-weight:900;font-size:40px;white-space:nowrap;color:#fff`, `${flag} ${label}`);
    const v = E.el(R, "abs", `left:${x - 20}px;width:240px;text-align:center;font-weight:900;font-size:72px;color:#fff;z-index:4`, "");
    return { b, v };
  };
  const grow = ({ b, v }, t0, t1, val, ease = "out") => {
    E.F(t => {
      const u = Math.max(0, Math.min(1, (t - t0) / (t1 - t0))), e = ease === "out" ? 1 - Math.pow(1 - u, 3) : u;
      const age = 18 + (val - 18) * e, h = (age - 18) * PX;
      b.style.top = `${BASE - h}px`; b.style.height = `${h}px`;
      v.style.top = `${BASE - h - 96}px`; v.textContent = t >= t0 ? age.toFixed(1) : "";
    });
  };
  const fin = bar(110, "Finland", "🇫🇮", "#6fa8dc"), pt = bar(440, "Portugal", "🇵🇹", "#e0533d"), eu = bar(770, "EU", "🇪🇺", "#7d8aa6");
  grow(fin, FIN, FIN + 1.2, 21.3); grow(eu, EU, EU + 1.2, 26.3);
  // Portugal climbs in two stages: to 25 before dinner, then on to 28.8 after it
  E.F(t => {
    const seg = t < R288 ? Math.max(0, Math.min(1, (t - PT) / 1.6)) * (25 - 18) : 7 + Math.max(0, Math.min(1, (t - R288 - .3) / 2.2)) * (28.8 - 25);
    const age = 18 + (t < PT ? 0 : seg), h = (age - 18) * PX;
    pt.b.style.top = `${BASE - h}px`; pt.b.style.height = `${h}px`; pt.v.style.top = `${BASE - h - 96}px`; pt.v.textContent = t >= PT ? age.toFixed(1) : "";
    pt.v.style.color = t >= R288 + 2.5 ? "#ffd640" : "#fff";
  });
  E.K(pt.v, "s", [[R288 + 2.49, 1], [R288 + 2.55, 1.35, "out"], [R288 + 2.9, 1, "io"]]);
  // the Finnish kid walks out with his suitcase at 21
  const kid = fig(R, "suitcase", 514, 1014, .34, 210, BASE - (21.3 - 18) * PX, 5); show(kid, [[FIN + 1.2, JANTAR]]);
  E.K(kid, "x", [[FIN + 1.2, 0], [JANTAR, -260, "lin"]]); bob(kid, FIN + 1.2, JANTAR, 6, .4);
  // the five countries that wait longer
  const longer = E.el(R, "abs", "left:40px;top:230px;width:1000px;text-align:center;font-weight:900;font-size:50px;color:#ffd640;line-height:1.3;opacity:0",
    "Later than Portugal:<br>🇭🇷 Croatia · 🇬🇷 Greece · 🇸🇰 Slovakia<br>🇪🇸 Spain · 🇮🇹 Italy");
  show(longer, [[R288 + 3.2, IRON]]); E.pop(longer, R288 + 3.2, { from: .7, dur: .3 });
  show(title, [[FIN, R288 + 2.2]]);
  // the camera: push onto Finland, whip to the EU, push onto Portugal; later punch into 28.8 and pull back for the list
  const CAM = E.el(R, "abs", "inset:0"); while (R.firstChild !== CAM) CAM.appendChild(R.firstChild);
  [title, src, longer].forEach(el => { R.appendChild(el); el.style.zIndex = 9; });   // the title, source and list stay put
  const ORG = [[FIN, "210px 1150px"], [EU, "870px 1150px"], [PT, "540px 1150px"], [R288, "540px 1150px"]];
  E.F(t => { let o = ORG[0][1]; for (const [k, v] of ORG) if (t >= k) o = v; CAM.style.transformOrigin = o; });
  E.K(CAM, "s", [[FIN, 1], [FIN + .5, 1.2, "out"], [EU - .05, 1.22], [EU, 1, "in"], [EU + .45, 1.2, "out"], [PT - .05, 1.22], [PT, 1, "in"],
    [PT + .5, 1.22, "out"], [JANTAR, 1.25], [R288, 1.15], [R288 + 2.4, 1.22, "io"], [R288 + 2.6, 1.3, "out"], [R288 + 3.2, 1, "io"], [IRON, 1.04, "lin"]]);
  E.K(CAM, "x", [[EU - .2, 0], [EU, -60, "in"], [EU + .2, 0, "out"], [PT - .2, 0], [PT, 60, "in"], [PT + .2, 0, "out"]]);

  // ============ 3. dinner (8.9 – 12.4), cartoon kitchen ============
  const K = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(K, [[JANTAR, R288], [IRON, DUR]]);
  E.img(K, "kitchen", COVER);
  const call = fig(K, "call", 599, 1024, 1.05, 330, 1850, 4); show(call, [[JANTAR, R288]]); bob(call, JANTAR, R288, 8, .5);
  E.pop(call, JANTAR, { from: .85, dur: .25 });
  const run = fig(K, "run", 639, 967, .95, 1300, 1850, 5); show(run, [[COMING - .3, R288]]);
  E.K(run, "x", [[COMING - .3, 0], [R288, -1700, "lin"]]); bob(run, COMING - .3, R288, 18, .25);
  const ageTag = E.el(K, "abs", "left:620px;top:360px;background:#e0533d;color:#fff;font-weight:900;font-size:64px;padding:.1em .45em;border-radius:.3em;z-index:8", "");
  show(ageTag, [[JANTAR, R288]]); E.F(t => { const s = t < COMING + .4 ? "AGE: 25" : "AGE: 27"; if (ageTag.textContent !== s) ageTag.textContent = s; });
  E.K(ageTag, "s", [[COMING + .39, 1], [COMING + .45, 1.25, "out"], [COMING + .8, 1, "io"]]);

  // ============ 4. the ending (18.6 – end), cartoon kitchen ============
  const mum = fig(K, "shirt", 643, 1024, 1.05, 330, 1850, 4); show(mum, [[IRON, DUR]]); E.pop(mum, IRON, { from: .85, dur: .25 }); bob(mum, IRON, DUR, 6, .6);
  const son = fig(K, "sonshirt", 664, 1024, 1.0, 790, 1850, 4); show(son, [[EXACT - .4, DUR]]); E.pop(son, EXACT - .4, { from: .85, dur: .25 }); bob(son, EXACT, DUR, 5, .7);

  // ============ narration captions and subtitles ============
  const cap = E.el(S.el, "abs", "left:70px;top:1385px;width:940px;text-align:center;font-weight:800;font-size:50px;line-height:1.2;color:#fff;z-index:12;text-shadow:0 3px 10px rgba(0,0,0,.8)", "");
  const CAPS = [[FIN, "In Finland? Twenty-one."], [FIN + 1.7, ""], [EU, "The EU average? Twenty-six."], [EU + 2.2, ""], [PT, "Portugal?"], [PT + .7, ""],
    [JANTAR, "\"Ó filho, o jantar!\"<br><span style='font-size:40px;color:#ffd640'>(Son, dinner!)</span>"], [JANTAR + 1.8, ""], [COMING, "\"Coming, mãe!\""], [COMING + 1, ""],
    [R288, "Twenty-eight point eight."], [R288 + 2.3, "Only five countries wait longer."], [R288 + 5.8, ""],
    [IRON, "\"Leave? Who's going to iron your shirts?\""], [IRON + 2.6, ""], [EXACT, "\"Exactly.\""], [EXACT + 1.1, ""],
    [COIT, "\"Coitadinho.\"<br><span style='font-size:40px;color:#ffd640'>(Poor little thing.)</span>"]];
  E.F(t => { let s = ""; for (const [k, x] of CAPS) if (t >= k) s = x; if (cap.innerHTML !== s) cap.innerHTML = s; });

  // ============ sound ============
  E.clip(0.05, "sfx/fs-iron-steam.wav", { vol: 0.7, duck: false });
  E.clip(AGE, "voices/ep128/n_age.wav", { vol: 1.2 });
  E.clip(FIN, "voices/ep128/n_finland.wav", { vol: 1.2 });
  E.clip(FIN + 1.2, "sfx/fs-suitcase-wheels.wav", { vol: 0.35, to: 2.5, duck: false });
  E.clip(EU, "voices/ep128/n_eu.wav", { vol: 1.2 });
  E.clip(PT, "voices/ep128/n_portugal.wav", { vol: 1.2 });
  E.clip(PT + .5, "sfx/fs-clock-tick.wav", { vol: 0.35, to: 1.6, duck: false });
  E.clip(JANTAR - .2, "sfx/fs-pot-lid.wav", { vol: 0.4, to: 1.0, duck: false });
  E.clip(JANTAR, "voices/ep128/m_jantar.wav", { vol: 1.2 });
  E.clip(COMING, "voices/ep128/s_coming.wav", { vol: 1.2 });
  E.clip(R288, "voices/ep128/n_288.wav", { vol: 1.2 });
  E.clip(IRON, "voices/ep128/m_iron.wav", { vol: 1.2 });
  E.clip(EXACT, "voices/ep128/s_exactly.wav", { vol: 1.2 });
  E.clip(COIT, "voices/ep128/m_coitadinho.wav", { vol: 1.2 });
  E.clip(0, "../tools/reel/eps/ep128-leavehome/audio/music44.wav", { vol: 0.3, to: DUR, duck: true });
  E.finish(DUR);
}
