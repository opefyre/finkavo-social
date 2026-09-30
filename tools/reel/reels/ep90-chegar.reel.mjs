// EP.90 "“Estou a chegar!”" — the Portuguese "I'm on my way!". Split screen: Otto waiting at the café (top), Rui at home (bottom).
// 20:00 Otto texts: "Where are you?" Rui is asleep. He wakes, blow-dries his hair: "Estou a chegar! Five minutes!" 20:40, on the sofa with
// cereal: "Almost there!" 21:20, ironing a shirt: "Parking!" The coffees pile up. 22:10 Rui strolls in: "Wow! You're early!" Otto: "I've
// been here since EIGHT." His phone buzzes — a voice note from the rest of the group: "Estamos a chegar!" (We're on our way!)
export const meta = {
  id: "ep90-chegar", date: "2026-12-22",
  images: {
    cafe: "characters/scenes/bg_tasca.webp", ob: "characters/cutouts/otto-table_bored.webp", rb: "characters/cutouts/rui_bed.webp", rr: "characters/cutouts/rui_robe.webp",
    rs: "characters/cutouts/rui_sofa.webp", ri: "characters/cutouts/rui_iron.webp", rw: "characters/cutouts/rui_wave.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 55, seed: 901, prog: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]] });
  const DUR = 19.6, WHERE = .3, BUZZ = 1.4, CHEG = 2.4, ALM = 5.2, PARK = 7.8, ARR = 10.4, EARLY = 10.9, EIGHT = 12.8, VN = 14.9;
  const S = E.scene("chegar", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, left, bottom, z = 3) => { const el = E.el(P, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  E.el(S.el, "abs", "inset:0;background:#1d2b36");

  // ================= top: the café (full screen after Rui arrives) =================
  const T = E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1030px;overflow:hidden");
  E.F(t => { T.style.height = t >= ARR ? "1920px" : "1030px"; });
  const cbg = E.el(T, "abs", "left:0;top:0;width:1080px;height:1930px"); E.img(cbg, "cafe", "width:1080px;height:1930px");
  E.F(t => { cbg.style.transform = t >= ARR ? "none" : "translateY(-620px)"; });
  const ot = E.el(T, "abs", "left:0;top:0;width:1px;height:1px;z-index:3");
  const o1 = E.img(ot, "ob", `position:absolute;left:40px;top:${1030 - 1145 * .52}px;width:${828 * .52}px;height:${1145 * .52}px`);
  const o2 = E.img(ot, "ob", `position:absolute;left:-40px;top:${1920 - 1145 * .9}px;width:${828 * .9}px;height:${1145 * .9}px;opacity:0`);
  E.F(t => { const f = t >= ARR; o1.style.opacity = f ? 0 : 1; o2.style.opacity = f ? 1 : 0; });
  const ob = []; for (let t = 0; t < ARR; t += 1) ob.push([t, 0, "io"], [t + .5, -5, "io"]); E.K(ot, "y", ob);                   // frame-0 motion
  // empty coffee cups piling up on Otto's table
  const cups = [...Array(6)].map((_, i) => E.el(T, "abs", `left:${420 + (i % 3) * 70}px;top:${880 - Math.floor(i / 3) * 60}px;width:56px;height:46px;border-radius:0 0 18px 18px;background:#fff;border:4px solid #cfd6dc;box-sizing:border-box;z-index:4;opacity:0`));
  const CUP = [0, 2.0, 5.0, 7.6, 9.2, 9.9];
  cups.forEach((c, i) => { E.K(c, "o", [[CUP[i] - .01, 0], [CUP[i], 1], [ARR - .01, 1], [ARR, 0]]); E.K(c, "y", [[CUP[i], -60], [CUP[i] + .25, 0, "in"]]); });
  const tbl2 = E.el(T, "abs", "left:-20px;top:1600px;width:640px;height:340px;z-index:4;background-color:#fff;background-image:linear-gradient(45deg,rgba(214,48,49,.85) 25%,transparent 25%,transparent 75%,rgba(214,48,49,.85) 75%),linear-gradient(45deg,rgba(214,48,49,.85) 25%,transparent 25%,transparent 75%,rgba(214,48,49,.85) 75%);background-size:60px 60px;background-position:0 0,30px 30px;border-radius:14px 14px 0 0;box-shadow:0 -6px 16px rgba(0,0,0,.2)");
  show(tbl2, [[ARR, DUR]]);
  const bigcups = [...Array(6)].map((_, i) => E.el(T, "abs", `left:${80 + (i % 3) * 130 + Math.floor(i / 3) * 60}px;top:${1540 - Math.floor(i / 3) * 70}px;width:96px;height:78px;border-radius:0 0 30px 30px;background:#fff;border:6px solid #cfd6dc;box-sizing:border-box;z-index:5;opacity:0`));
  bigcups.forEach(c => show(c, [[ARR, DUR]]));
  const rw = fig(T, "rw", 527, 1016, .9, 1100, 1920, 3); show(rw, [[ARR, DUR]]); E.K(rw, "x", [[ARR, 0], [ARR + .6, -500, "out"]]);
  // the phone buzz (voice note from the group)
  const vn = E.el(S.el, "abs", "left:60px;top:560px;width:620px;background:#fff;border-radius:26px;padding:18px 24px;box-sizing:border-box;box-shadow:0 14px 30px rgba(0,0,0,.3);z-index:9;opacity:0;display:flex;align-items:center;gap:18px");
  E.el(vn, "", "width:80px;height:80px;border-radius:50%;background:#1f6b5c;color:#fff;font-size:44px;display:flex;align-items:center;justify-content:center;flex:none", "▶");
  const vr = E.el(vn, "", "flex:1");
  E.el(vr, "", "font-weight:900;font-size:32px;color:#1f6b5c", "👥 THE GROUP · voice note");
  E.el(vr, "", "height:34px;margin-top:6px;background:repeating-linear-gradient(90deg,#1d2b36 0 5px,transparent 5px 11px);-webkit-mask:linear-gradient(0deg,#000 30%,transparent 30%,transparent 70%,#000 70%);opacity:.6");
  E.pop(vn, VN - .2, { from: .4, dur: .3 }); E.K(vn, "o", [[VN - .2, 0], [VN - .1, 1]]);

  // ================= bottom: Rui's flat =================
  const B = E.el(S.el, "abs", "left:0;top:1040px;width:1080px;height:880px;overflow:hidden;background:#dfe9f2");
  show(B, [[0, ARR]]);
  E.el(B, "abs", "left:0;top:0;width:1080px;height:880px;background-image:repeating-linear-gradient(90deg,rgba(80,110,140,.07) 0 70px,transparent 70px 140px)");
  E.el(B, "abs", "left:0;top:700px;width:1080px;height:180px;background:#b88f5c");
  E.el(B, "abs", "left:760px;top:80px;width:240px;height:300px;background:linear-gradient(180deg,#1b2a55,#3b4f8c);border:14px solid #fff;box-sizing:border-box");
  E.el(B, "abs", "left:880px;top:120px;width:60px;height:60px;border-radius:50%;background:#fff6c8");
  const clk = E.el(B, "abs", "left:60px;top:60px;width:150px;height:150px;border-radius:50%;background:#fff;border:10px solid #1d2b36;box-sizing:border-box");
  const hand = E.el(clk, "abs", "left:61px;top:15px;width:8px;height:52px;background:#1d2b36;border-radius:4px;transform-origin:50% 100%");
  const hand2 = E.el(clk, "abs", "left:62px;top:30px;width:6px;height:37px;background:#e5484d;border-radius:4px;transform-origin:50% 100%");
  E.F(t => { const m = t * 55; hand.style.transform = `rotate(${m * 6}deg)`; hand2.style.transform = `rotate(${240 + m / 2}deg)`; });
  const R = [["rb", 986, 612, .8, 60, 840, [0, CHEG]], ["rr", 661, 1011, .68, 280, 860, [CHEG, ALM]], ["rs", 1157, 843, .72, 40, 860, [ALM, PARK]], ["ri", 680, 1006, .7, 280, 860, [PARK, ARR]]];
  R.forEach(([n, w, h, s, x, b, span]) => { const f = fig(B, n, w, h, s, x, b, 3); show(f, [span]); E.K(f, "s", [[span[0], .9], [span[0] + .25, 1, "back"]]); });
  const buzz = E.el(B, "abs", "left:520px;top:360px;font-size:70px;z-index:5;opacity:0", "📳"); show(buzz, [[BUZZ, CHEG]]);
  const bz = []; for (let t = BUZZ; t < CHEG; t += .1) bz.push([t, (Math.round(t * 10) % 2) ? 10 : -10]); E.K(buzz, "r", bz);
  const zz = E.el(B, "abs", "left:420px;top:260px;font-weight:900;font-size:60px;color:#6b7c8f;z-index:5", "z z z"); show(zz, [[0, BUZZ]]);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "20:00 · COFFEES: 1"], [CHEG, "20:05 · “5 MINUTES”"], [ALM, "20:40 · COFFEES: 3"], [PARK, "21:20 · COFFEES: 4"], [ARR, "22:10 · COFFEES: 6"], [VN, "THE REST: ALSO “ARRIVING”"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= ALM ? C.coralD : C.ink; pill.style.fontSize = s.length > 22 ? "42px" : "50px"; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));
  const lab = (txt, top) => { const l = E.el(S.el, "abs", `left:40px;top:${top}px;background:rgba(29,43,54,.85);color:#fff;font-weight:900;font-size:30px;padding:6px 14px;border-radius:10px;z-index:8`, txt); show(l, [[0, ARR]]); };
  lab("☕ OTTO · AT THE CAFÉ", 440); lab("🏠 RUI · “ON HIS WAY”", 1060);

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble("Where are you?", 380, 560, 380, 60, WHERE, CHEG - .1, 48);
  const RB = (h, t0, t1, fs = 48, w = 460) => bubble(h, 580, 1120, w, 120, t0, t1, fs);
  RB(`Estou a chegar! Five minutes!${sub("(I'm on my way!)")}`, CHEG, ALM - .05, 44, 480);
  RB("Almost there!", ALM, PARK - .05, 52, 380);
  RB("Parking!", PARK, ARR - .05, 56, 300);
  bubble("Wow! You're early!", 540, 860, 480, 330, EARLY, EIGHT - .05, 48);
  bubble("I've been here since EIGHT.", 60, 780, 560, 200, EIGHT, VN - .25, 46);
  bubble(`Estamos a chegar!${sub("(We're on our way!)")}`, 120, 760, 480, 120, VN + .3, DUR - .4, 48);
  const sb = E.el(S.el, "abs", "left:60px;top:1640px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "5 MINUTES = 2 HOURS.", VN + 1.8, { size: 92, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/cafe-morning.wav", { vol: .5, duck: false, to: DUR });
  E.clip(WHERE - .1, "sfx/phone-typing.wav", { vol: .5, to: .8 }); E.clip(WHERE, "voices/ep90/o_where.wav", { vol: 1.2 });
  E.clip(BUZZ, "sfx/elx-phone-buzz.wav", { vol: .9 }); E.clip(0, "sfx/snore.wav", { vol: .5, to: BUZZ, duck: false });
  E.clip(CHEG, "voices/ep90/r_chegar.wav", { vol: 1.3 });
  CUP.slice(1).forEach(t => E.clip(t, "sfx/plate-down.wav", { vol: .4 }));
  E.clip(ALM, "voices/ep90/r_almost.wav", { vol: 1.3 }); E.clip(ALM + .2, "sfx/crunch.wav", { vol: .6 });
  E.clip(PARK, "voices/ep90/r_parking.wav", { vol: 1.35 });
  E.S(ARR, "whoosh", .5); E.clip(EARLY, "voices/ep90/r_early.wav", { vol: 1.3 });
  E.clip(EIGHT, "voices/ep90/o_eight.wav", { vol: 1.25 });
  E.clip(VN - .2, "sfx/phone-ping.wav", { vol: .8 }); E.clip(VN + .3, "voices/ep90/f_chegar.wav", { vol: 1.3 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "“I'm 5 minutes *away*!”", { size: 58, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[18.8, 1], [19.05, 1.18, "out"], [19.4, 1, "io"]]);
}
