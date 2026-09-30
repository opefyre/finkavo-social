// EP.93 "Ordering bread in Portuguese" — Buck, phrasebook in hand, at a Lisbon padaria: "Good morning! Um pow, por favor!" The baker
// hands him a stick — PAU = STICK. "No, no! Um… PAH!" A shovel — PÁ = SHOVEL. "Um… pa-VOWNG?" "Um pavão!" A peacock walks in — PAVÃO =
// PEACOCK. An old man behind him points and grunts: "Hm." He gets a bag of bread. Buck: "…I just wanted bread." The baker, in perfect
// English: "Oh! You want BREAD? Why didn't you just say it in English?"
export const meta = {
  id: "ep93-pao", date: "2026-12-25",
  images: {
    bg: "characters/scenes/bg_padaria.webp", bo: "characters/cutouts/buck_order.webp", bc: "characters/cutouts/buck_confused.webp", ko: "characters/cutouts/baker_offer.webp",
    kh: "characters/cutouts/baker_hmm.webp", old: "characters/cutouts/oldman_ask.webp", stick: "characters/props/stick.webp", shovel: "characters/props/shovel.webp",
    pea: "characters/props/peacock.webp", bag: "characters/props/bread-bag.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 55, seed: 931, prog: [[0, 4, 7], [5, 9, 12], [2, 5, 9], [7, 11, 14]] });
  const DUR = 21.4, POW = .3, PAU = 2.6, PAH = 4.7, PA = 6.8, VOW = 7.9, PAVAO = 10.3, HM = 11.9, BREAD = 13.4, ENG = 14.8;
  const S = E.scene("pao", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  // the baker behind her counter (right): two poses, counters aligned (offer counter 54–631 of 657; hmm 76–808 of 835)
  const KS = .78, KX = 470, KB = 1760, k1 = fig("ko", 657, 1009, KS, KX, KB, 3), hs = KS * 577 / 732, k2 = fig("kh", 835, 1156, hs, KX + 54 * KS - 76 * hs, KB, 3);
  const KT = [[0, 0], [PAH, 1], [PA, 0], [VOW, 1], [PAVAO, 0], [BREAD, 1], [ENG + .3, 0]];
  E.F(t => { const k = at(KT, t); k1.style.opacity = k === 0 ? 1 : 0; k2.style.opacity = k === 1 ? 1 : 0; });
  // Buck (left)
  const b1 = fig("bo", 688, 1024, .92, -60, 1920, 5), b2 = fig("bc", 688, 1024, .92, -60, 1920, 5);
  const BT = [[0, 0], [PAU + .6, 1], [PAH, 0], [PA + .3, 1], [VOW, 0], [PAVAO + .3, 1]];
  E.F(t => { const k = at(BT, t); b1.style.opacity = k === 0 ? 1 : 0; b2.style.opacity = k === 1 ? 1 : 0; });
  const bb = []; for (let t = 0; t < PAU; t += .7) bb.push([t, 0, "io"], [t + .35, -6, "io"]); E.K(b1, "y", bb);                      // frame-0 motion
  // the wrong things slide across the counter, and pile up in front of Buck
  const item = (n, w, h, s, t0, x1, y1, r1) => { const el = E.el(S.el, "abs", `left:640px;top:1240px;width:${w * s}px;height:${h * s}px;z-index:6;opacity:0`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); E.K(el, "o", [[t0 - .01, 0], [t0, 1]]); E.K(el, "x", [[t0, 0], [t0 + .5, x1 - 640, "out"]]); E.K(el, "y", [[t0, 0], [t0 + .5, y1 - 1240, "out"]]); E.K(el, "r", [[t0, 0], [t0 + .5, r1, "out"]]); return el; };
  item("stick", 237, 325, .7, PAU + .5, 380, 1560, -30);
  item("shovel", 218, 318, .8, PA + .2, 420, 1500, 18);
  const pea = fig("pea", 317, 304, 1.25, 1100, 1900, 7);
  E.K(pea, "x", [[PAVAO + .2, 0], [PAVAO + 1.4, -760, "out"]]);
  const strut = []; for (let t = PAVAO + .2; t < DUR; t += .3) strut.push([t, 0], [t + .15, -10]); E.K(pea, "y", strut);
  // the old man appears behind Buck, grunts, gets his bread instantly
  const old = fig("old", 480, 1037, .72, 1100, 1900, 6);
  E.K(old, "x", [[HM - .6, 0], [HM - .1, -360, "out"], [BREAD + .6, -360], [BREAD + 1.4, 300, "in"]]);
  const bag = E.el(S.el, "abs", "left:760px;top:1360px;width:170px;height:199px;z-index:7;opacity:0"); E.img(bag, "bag", "width:170px;height:199px");
  E.K(bag, "o", [[HM + .4, 0], [HM + .45, 1], [BREAD + .6, 1], [BREAD + .7, 0]]); E.K(bag, "s", [[HM + .4, .4], [HM + .7, 1, "back"]]);
  // the dictionary card
  const card = E.el(S.el, "abs", "left:80px;top:480px;width:620px;background:#fffdf3;border:6px solid #1d2b36;border-radius:18px;padding:16px 22px;box-sizing:border-box;z-index:9;opacity:0;box-shadow:0 12px 26px rgba(0,0,0,.25)");
  const cw = E.el(card, "", "font-weight:900;font-size:58px;color:#b3262c;line-height:1.05", ""), cm = E.el(card, "", "font-weight:800;font-size:40px;color:#1d2b36;margin-top:4px", "");
  const CARD = [[0, null], [PAU + .4, ["PAU", "= a stick 🪵"]], [PAH, null], [PA + .1, ["PÁ", "= a shovel"]], [VOW, null], [PAVAO + .1, ["PAVÃO", "= a peacock 🦚"]], [HM + .3, ["“HM.”", "= bread 🍞 (if you're 80)"]], [BREAD, null]];
  E.F(t => { const v = at(CARD, t); card.style.opacity = v ? 1 : 0; if (v && cw.textContent !== v[0]) { cw.textContent = v[0]; cm.textContent = v[1]; } });
  CARD.filter(([, v]) => v).forEach(([t]) => E.K(card, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "PADARIA · 08:00"], [PAU, "BREAD: 0 · STICKS: 1"], [PA, "BREAD: 0 · SHOVELS: 1"], [PAVAO, "BREAD: 0 · PEACOCKS: 1"], [HM, "OLD MAN: 1 WORD · 1 BREAD"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= PAU ? C.coralD : C.ink; pill.style.fontSize = s.length > 22 ? "42px" : "50px"; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  const B = (h, t0, t1, fs = 46, w = 480) => bubble(h, 40, 860, w, 200, t0, t1, fs);
  const K = (h, t0, t1, fs = 48, w = 420) => bubble(h, 1040 - w, 880, w, w - 170, t0, t1, fs);
  B("Good morning! Um “pow”, por favor!", POW, PAU - .05, 44, 520);
  K(`Um pau? Aqui tem.${sub("(A stick? Here you go.)")}`, PAU, PAH - .05, 44, 440);
  B("No, no! Um… “PAH”!", PAH, PA - .05, 48);
  K(`Uma pá?${sub("(A shovel?)")}`, PA, VOW - .05, 50, 300);
  B("Um… “pa-VOWNG”?", VOW, PAVAO - .05, 48);
  K(`Um pavão!${sub("(A peacock!)")}`, PAVAO, HM - .05, 50, 340);
  bubble("Hm.", 800, 960, 180, 60, HM, HM + 1.2, 56);
  B("…I just wanted bread.", BREAD, ENG - .05, 48, 460);
  K("Oh! You want BREAD? Why didn't you just say it in English?", ENG, DUR - .4, 42, 560);
  const sb = E.el(S.el, "abs", "left:60px;top:480px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "PÃO. NOT PAU.", ENG + 3.5, { size: 110, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/cafe-morning.wav", { vol: .5, duck: false, to: DUR });
  E.clip(POW, "voices/ep93/b_pow.wav", { vol: 1.2 });
  E.clip(PAU, "voices/ep93/k_pau.wav", { vol: 1.3 }); E.S(PAU + .5, "swish", .5); E.S(PAU + 1, "thud", .4);
  E.clip(PAH, "voices/ep93/b_pah.wav", { vol: 1.2 });
  E.clip(PA, "voices/ep93/k_pa.wav", { vol: 1.3 }); E.S(PA + .2, "swish", .5); E.S(PA + .7, "crack", .5);
  E.clip(VOW, "voices/ep93/b_pavao.wav", { vol: 1.2 });
  E.clip(PAVAO, "voices/ep93/k_pavao.wav", { vol: 1.35 }); E.S(PAVAO + .2, "sparkle", .7);
  E.S(HM - .5, "whoosh", .3); E.clip(HM, "voices/ep93/v_hm.wav", { vol: 1.5 }); E.S(HM + .4, "ding", .5);
  E.clip(BREAD, "voices/ep93/b_bread.wav", { vol: 1.2 });
  E.clip(ENG, "voices/ep93/k_english.wav", { vol: 1.3 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Ordering bread in *Portuguese*", { size: 50, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[20.6, 1], [20.85, 1.18, "out"], [21.2, 1, "io"]]);
}
