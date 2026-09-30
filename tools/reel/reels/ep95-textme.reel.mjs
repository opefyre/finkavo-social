// EP.95 "Text me when you get there" — split screen: Tomás's living room (top), Mum's kitchen (bottom). The teen: "Bye, Mum! Going to
// Tomás's." Mum: "Text me when you get there!" He leaves; she shouts after him: "TEXT. ME." 18:02 he's on Tomás's sofa, gaming, phone face
// down. 18:06 Mum: "He should be there by now…" MISSED CALLS 3 → 58. "Hello? Police?! My son is MISSING!" Sirens, the national news
// ("Breaking news. A teenager… has not texted his mother."), a helicopter searchlight on the sofa. He finally looks: "Oh." — "here 👍".
// Mum, instantly calm: "Okay. Beijinhos." Everything leaves. 23:00, home: "Mum, I'm going for a shower." "Text me when you get there."
export const meta = {
  id: "ep95-textme", date: "2026-12-27",
  images: {
    room: "characters/scenes/bg_teenroom.webp", kit: "characters/scenes/bg_kitchen.webp", tg: "characters/cutouts/teen-sofa_game.webp", tt: "characters/cutouts/teen-sofa_text.webp",
    tp: "characters/cutouts/teen_phone.webp", tw: "characters/cutouts/teen_towel.webp", ms: "characters/cutouts/mum_shout.webp", ml: "characters/cutouts/mum_look.webp",
    mp: "characters/cutouts/mum_panic.webp", mc: "characters/cutouts/mum_calm.webp", mr: "characters/cutouts/mum_record.webp", an: "characters/cutouts/anchor_grave.webp",
    heli: "characters/props/helicopter.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 118, root: 50, seed: 951, prog: [[0, 3, 7], [5, 8, 12], [7, 10, 14], [3, 7, 10]] });
  const DUR = 24.8, BYE = .3, TEXT = 2.2, WALK = 3.5, TEXTME = 3.7, ARR = 4.3, SHOULD = 5.6, CALLS = [7.1, 7.55, 8.0, 8.45], POLICE = 8.9, SIREN = 10.2,
    NEWS = 12.6, HELI = 13.0, OH = 16.7, TXT = 17.5, OK = 17.9, LATER = 19.8, THERE = 21.6, STAMP = 23.2;
  const S = E.scene("textme", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, left, bottom, z = 3) => { const el = E.el(P, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  E.el(S.el, "abs", "inset:0;background:#1d2b36");

  // ================= top: Tomás's living room =================
  const T = E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1030px;overflow:hidden;background:#3a2c26");
  E.img(T, "room", "position:absolute;left:0;top:216px;width:1080px;height:814px");
  const sofa = E.el(T, "abs", "left:60px;top:0;width:1px;height:1px;z-index:3");
  const SW = [["tg", 0], ["tt", 1]].map(([n]) => E.img(sofa, n, `position:absolute;left:0;top:${1010 - 880 * .56}px;width:${1168 * .56}px;height:${880 * .56}px;opacity:0`));
  E.F(t => { const k = t < ARR || t >= LATER ? -1 : t >= OH ? 1 : 0; SW.forEach((g, i) => { g.style.opacity = i === k ? 1 : 0; }); });
  E.pop(sofa, ARR, { from: .8, dur: .3 });
  const bop = []; for (let t = ARR; t < OH; t += .45) bop.push([t, 0, "io"], [t + .22, -4, "io"]); E.K(sofa, "y", bop);
  // his phone buzzing on the cushion (face down, ignored)
  const buzz = E.el(T, "abs", "left:150px;top:780px;font-size:56px;z-index:5;opacity:0", "📳"); show(buzz, [[CALLS[0], OH]]);
  const bz = []; for (let t = CALLS[0]; t < OH; t += .1) bz.push([t, (Math.round(t * 10) % 2) ? 12 : -12]); E.K(buzz, "r", bz);
  // police lights through the window, then the helicopter and its searchlight
  const lights = E.el(T, "abs", "inset:0;z-index:6;mix-blend-mode:screen;opacity:0"); show(lights, [[SIREN, OK]]);
  E.F(t => { const on = Math.floor(t * 4) % 2; lights.style.background = on ? "radial-gradient(circle at 15% 45%,rgba(255,40,40,.55),transparent 45%)" : "radial-gradient(circle at 25% 45%,rgba(40,90,255,.55),transparent 45%)"; });
  const heli = E.el(T, "abs", "left:0;top:0;width:520px;height:265px;z-index:8"); E.img(heli, "heli", "width:520px;height:265px");
  E.K(heli, "x", [[0, 1200], [HELI, 1200], [HELI + 1.2, 520, "out"], [OK + .4, 520], [OK + 1.4, -700, "in"]]); E.K(heli, "y", [[0, 430], [HELI + 1.2, 440, "out"], [HELI + 2.2, 420, "io"], [HELI + 3.2, 440, "io"]]);
  const beam = E.el(T, "abs", "left:130px;top:650px;width:520px;height:380px;z-index:7;opacity:0;background:linear-gradient(180deg,rgba(255,250,200,.8),rgba(255,250,200,.3));clip-path:polygon(80% 0,90% 0,70% 100%,0 100%)");
  show(beam, [[HELI + 1.3, OK + .4]]);

  // ================= bottom: Mum's kitchen =================
  const B = E.el(S.el, "abs", "left:0;top:1040px;width:1080px;height:880px;overflow:hidden");
  E.img(B, "kit", "position:absolute;left:-44px;top:0;width:1168px;height:880px");
  const MB = 870, MS = .6;
  const mum = [["mr", 528, 1076, [[0, WALK]]], ["ms", 489, 1050, [[WALK, SHOULD]]], ["ml", 356, 976, [[SHOULD, POLICE]]], ["mp", 411, 988, [[POLICE, OK]]], ["mc", 396, 979, [[OK, DUR]]]]
    .map(([n, w, h, spans]) => { const f = fig(B, n, w, h, MS, 250 - w * MS / 2 + 60, MB, 3); show(f, spans); return f; });
  E.K(mum[3], "x", (() => { const k = []; for (let t = POLICE; t < OK; t += .1) k.push([t, (Math.round(t * 10) % 2) ? 5 : -5]); return k; })());
  const tp = fig(B, "tp", 500, 1063, .6, 620, MB, 4); show(tp, [[0, WALK + .6]]); E.K(tp, "x", [[WALK, 0], [WALK + .6, 560, "in"]]);
  const tw = fig(B, "tw", 465, 978, .64, 640, MB, 4); show(tw, [[LATER, DUR]]); E.pop(tw, LATER, { from: .8, dur: .3 });
  // the TV news (bottom right, over the kitchen wall)
  const tv = E.el(B, "abs", "left:500px;top:70px;width:540px;height:360px;background:#2b2f35;border-radius:20px;padding:14px;box-sizing:border-box;z-index:5;opacity:0;box-shadow:0 14px 30px rgba(0,0,0,.35)");
  show(tv, [[NEWS, OK]]); E.pop(tv, NEWS, { from: .5, dur: .3 });
  const scr = E.el(tv, "", "position:relative;width:100%;height:100%;border-radius:8px;overflow:hidden;background:linear-gradient(180deg,#1b3a6b,#274f8f)");
  E.img(scr, "an", "position:absolute;left:18px;top:20px;width:218px;height:311px");
  const ph = E.el(scr, "abs", "left:268px;top:26px;width:220px;height:160px;background:#fff;border-radius:8px;overflow:hidden");
  E.img(ph, "tp", "position:absolute;left:40px;top:6px;width:140px;height:298px");
  E.el(ph, "abs", "left:0;bottom:0;width:100%;background:#d9482e;color:#fff;font-weight:900;font-size:22px;text-align:center;padding:2px 0", "MISSING");
  E.el(scr, "abs", "left:0;bottom:0;width:100%;background:#d9482e;color:#fff;font-weight:900;font-size:25px;padding:6px 12px;box-sizing:border-box;white-space:nowrap", "BREAKING · TEEN HAS NOT TEXTED MUM");
  // the text arrives
  const msg = E.el(B, "abs", "left:620px;top:470px;background:#dcf8c6;color:#1d2b36;font-weight:900;font-size:48px;padding:14px 26px;border-radius:26px 26px 26px 6px;z-index:9;opacity:0;box-shadow:0 10px 24px rgba(0,0,0,.25)", "here 👍");
  show(msg, [[TXT, LATER]]); E.pop(msg, TXT, { from: .4, dur: .3 });

  const lab = (txt, top, spans) => { const l = E.el(S.el, "abs", `left:40px;top:${top}px;background:rgba(29,43,54,.85);color:#fff;font-weight:900;font-size:30px;padding:6px 14px;border-radius:10px;z-index:8`, txt); show(l, spans); };
  lab("🎮 TOMÁS'S HOUSE · 2 STREETS AWAY", 440, [[0, OH]]); lab("🍲 MUM · AT HOME", 1060, [[0, LATER]]);
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "18:00 · LEAVING"], [ARR, "18:02 · ARRIVED"], [SHOULD, "18:06 · NO TEXT"], [CALLS[0], "MISSED CALLS: 3"], [CALLS[1], "MISSED CALLS: 12"], [CALLS[2], "MISSED CALLS: 27"],
    [CALLS[3], "MISSED CALLS: 58"], [POLICE, "18:09 · POLICE"], [NEWS, "18:11 · NATIONAL NEWS"], [TXT, "18:12 · “here 👍”"], [LATER, "23:00 · HOME"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= CALLS[0] && t < TXT ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));
  // frame-0 motion: the kitchen pot steams
  const steam = E.el(B, "abs", "left:255px;top:180px;font-size:60px;opacity:.7;z-index:2", "♨"); E.K(steam, "y", [[0, 0], [1, -14, "io"], [2, 0, "io"], [3, -14, "io"], [4, 0, "io"]]);

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const MBub = (h, t0, t1, fs = 46, w = 470) => bubble(h, 40, 1110, w, 150, t0, t1, fs);
  bubble("Bye, Mum! Going to Tomás's.", 560, 1110, 480, 230, BYE, TEXT - .05, 44);
  MBub("Text me when you get there!", TEXT, WALK, 44, 460);
  MBub("TEXT. ME.", TEXTME, SHOULD - .1, 64, 360);
  MBub("He should be there by now…", SHOULD, CALLS[0] + .3, 44, 440);
  MBub("Hello? Police?! My son is MISSING!", POLICE, NEWS, 44, 460);
  bubble("Oh.", 110, 470, 170, 110, OH, TXT + .6, 56);
  MBub("Okay. Beijinhos.", OK, LATER - .1, 50, 400);
  bubble("Mum, I'm going for a shower.", 560, 1110, 470, 230, LATER + .1, THERE - .05, 44);
  MBub("Text me when you get there.", THERE, DUR - .4, 46, 460);
  const sb = E.el(S.el, "abs", "left:60px;top:700px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "THE SHOWER: 4 METRES.", STAMP, { size: 70, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);
  // later: the top panel goes dark ("23:00")
  const night = E.el(T, "abs", "inset:0;background:#141a2e;z-index:9;opacity:0"); show(night, [[LATER, DUR]]);
  E.el(night, "abs", "left:0;top:500px;width:1080px;text-align:center;font-weight:900;font-size:60px;color:#fff6c8", "LATER THAT NIGHT…");

  // ================= sound =================
  E.clip(BYE, "voices/ep95/t_bye.wav", { vol: 1.2 });
  E.clip(TEXT, "voices/ep95/m_text.wav", { vol: 1.3 });
  E.clip(WALK, "sfx/door-open.wav", { vol: .6, to: 1 }); E.clip(TEXTME, "voices/ep95/m_textme.wav", { vol: 1.35 });
  E.S(ARR, "whoosh", .4); E.clip(ARR + .2, "sfx/club-bass.wav", { vol: .25, duck: false, to: OH - ARR - .2 });
  E.clip(SHOULD, "voices/ep95/m_should.wav", { vol: 1.3 });
  CALLS.forEach(t => E.clip(t, "sfx/elx-phone-buzz.wav", { vol: .7, to: .45 }));
  E.clip(POLICE, "voices/ep95/m_police.wav", { vol: 1.35 });
  E.clip(SIREN, "sfx/elx-siren.wav", { vol: .6, duck: false, to: OK - SIREN });
  E.clip(NEWS - .2, "sfx/news-sting.wav", { vol: .7, to: 1.2 }); E.clip(NEWS + .4, "voices/ep95/n_breaking.wav", { vol: 1.25 });
  E.clip(HELI, "sfx/elx-helicopter.wav", { vol: .35, duck: false, to: OK + 1.4 - HELI });
  E.clip(OH, "voices/ep95/t_oh.wav", { vol: 1.3 }); E.clip(OH + .4, "sfx/phone-typing.wav", { vol: .6, to: .6 });
  E.clip(TXT, "sfx/phone-ping.wav", { vol: .9 });
  E.clip(OK, "voices/ep95/m_ok.wav", { vol: 1.3 });
  E.S(LATER, "whoosh", .4); E.clip(LATER + .1, "voices/ep95/t_shower.wav", { vol: 1.2 });
  E.clip(THERE, "voices/ep95/m_there.wav", { vol: 1.35 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "“Text me when you get *there*!”", { size: 50, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[24.0, 1], [24.25, 1.18, "out"], [24.6, 1, "io"]]);
}
