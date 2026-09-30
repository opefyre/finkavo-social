// EP.107 "Asking mum where your stuff is" — split screen: Otto's room (top), Mum's kitchen (bottom). Otto, frantic: "Mum! Where's my charger?!" Mum, back turned, washing up:
// "Left drawer. Under the blue jumper." (it is.) "Mum! Where are my glasses?!" "On your head." "Mum! My passport! I'm at the airport!" Mum, on the phone, folder in hand:
// "Blue folder. Bottom drawer. Under the cake tin. I'm sending you a photo." Otto: "Found it! Mum, you're a genius!" "I know." Then Otto, on his sofa, quietly:
// "Mum… where is my motivation?" Mum, eyes closed: "Bottom drawer. Next to the cake tin. You'll find it after lunch." Stamp: MUM 4 · OTTO 0.
export const meta = {
  id: "ep107-mumknows", date: "2027-01-08",
  images: {
    room: "characters/scenes/bg_teenroom.webp", air: "characters/scenes/bg_arrivals.webp", kit: "characters/scenes/bg_kitchen.webp",
    o1: "characters/cutouts/otto-casual_rummage.webp", o2: "characters/cutouts/otto-phone_panic.webp", o3: "characters/cutouts/otto-phone_relief.webp", o4: "characters/cutouts/otto-sofa_meh.webp",
    m1: "characters/cutouts/mum_sink.webp", m2: "characters/cutouts/mum_phone.webp", m3: "characters/cutouts/mum_serene.webp", tin: "characters/props/tin.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 50, seed: 1071, prog: [[0, 4, 7], [7, 11, 14], [5, 9, 12], [2, 5, 9]] });
  const DUR = 27.6, O_CH = .3, M_CH = 2.45, O_GL = 4.85, M_HD = 6.8, O_PP = 8.4, M_FO = 11.25, O_FD = 15.55, M_KN = 17.75, O_MO = 19.0, M_MO = 22.05, STAMP = 25.95;
  const AIR0 = O_PP - .1, AIR1 = M_KN + 1.15;
  const S = E.scene("mum", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  E.el(S.el, "abs", "inset:0;background:#1d2b36");

  // ================= top: Otto =================
  const T = E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1030px;overflow:hidden;background:#3a2c26");
  // room
  const R = E.el(T, "abs", "inset:0"); show(R, [[0, AIR0], [AIR1, DUR]]);
  E.img(R, "room", "position:absolute;left:0;top:216px;width:1080px;height:814px");
  const o1 = fig(R, "o1", 655, 986, .56, 300, 1020, 4), o4 = fig(R, "o4", 806, 931, .62, 420, 1030, 4);
  show(o1, [[0, AIR0]]); show(o4, [[AIR1, DUR]]);
  const sway = []; for (let t = 0; t < AIR0; t += .4) sway.push([t, (Math.round(t / .4) % 2) ? 4 : -4, "io"]); E.K(o1, "r", sway);
  const hop = []; for (let t = 0; t < AIR0; t += .4) hop.push([t, 0, "io"], [t + .2, -8, "io"]); E.K(o1, "y", hop);
  const sb2 = []; for (let t = AIR1; t < DUR; t += .8) sb2.push([t, 0, "io"], [t + .4, -4, "io"]); E.K(o4, "y", sb2);
  // airport
  const A = E.el(T, "abs", "inset:0;overflow:hidden"); show(A, [[AIR0, AIR1]]);
  E.img(A, "air", "position:absolute;left:0;top:-560px;width:1080px;height:1930px");
  const o2 = fig(A, "o2", 424, 1068, .56, 300, 1015, 4), o3 = fig(A, "o3", 424, 1068, .56, 300, 1015, 4);
  E.F(t => { o2.style.opacity = t < O_FD ? 1 : 0; o3.style.opacity = t < O_FD ? 0 : 1; });
  const pb = []; for (let t = AIR0; t < O_FD; t += .35) pb.push([t, (Math.round(t / .35) % 2) ? 5 : -5, "io"]); E.K(o2, "r", pb);
  // the photo Mum sends
  const ph = E.el(T, "abs", "left:560px;top:540px;width:440px;height:400px;background:#fff;border-radius:18px;box-shadow:0 14px 30px rgba(0,0,0,.4);z-index:9;padding:16px;box-sizing:border-box;opacity:0");
  E.K(ph, "o", [[M_FO + 2.2, 0], [M_FO + 2.3, 1], [O_FD + .9, 1], [O_FD + 1.05, 0]]); E.pop(ph, M_FO + 2.2, { from: .3, dur: .3 }); E.K(ph, "r", [[M_FO + 2.2, 5], [O_FD + 1, 3]]);
  const drw = E.el(ph, "abs", "left:16px;top:16px;width:408px;height:300px;background:#8b5a2b;border-radius:10px;border:10px solid #6b3f1a;overflow:hidden");
  E.el(drw, "abs", "left:30px;top:90px;width:210px;height:160px;background:#2b5fb0;border-radius:8px;transform:rotate(-6deg)", "");
  E.el(drw, "abs", "left:70px;top:130px;width:130px;height:40px;background:#f3d27a;border-radius:6px;transform:rotate(-6deg);font-size:26px;font-weight:900;color:#2b5fb0;text-align:center;line-height:40px", "PASSPORT");
  const tn = E.el(drw, "abs", "left:190px;top:60px;width:180px;height:147px"); E.img(tn, "tin", "width:180px;height:147px");
  E.el(ph, "abs", "left:16px;top:328px;width:408px;font-weight:900;font-size:34px;color:#1d2b36;text-align:center", "📸 from Mum");
  // the little pops: found charger / glasses
  const ok = (emoji, x, y, t0, t1) => { const el = E.el(T, "abs", `left:${x}px;top:${y}px;font-size:92px;z-index:9;opacity:0`, emoji); show(el, [[t0, t1]]); E.pop(el, t0, { from: .3, dur: .3 }); E.K(el, "y", [[t0, 0], [t1, -30, "out"]]); };
  ok("🔌", 380, 600, 4.25, 5.6); ok("👓", 210, 330, 7.9, 9.0); ok("📕", 220, 660, 15.9, 17.2);

  // ================= bottom: Mum =================
  const B = E.el(S.el, "abs", "left:0;top:1040px;width:1080px;height:880px;overflow:hidden");
  E.img(B, "kit", "position:absolute;left:-44px;top:0;width:1168px;height:880px");
  const m1 = fig(B, "m1", 582, 1015, .66, 790, 870, 4), m2 = fig(B, "m2", 672, 1024, .66, 790, 870, 4), m3 = fig(B, "m3", 509, 1001, .66, 790, 870, 4);
  E.F(t => { const k = t < M_FO ? 0 : t < M_KN ? 1 : 2; [m1, m2, m3].forEach((m, i) => { m.style.opacity = i === k ? 1 : 0; }); });
  const mb = []; for (let t = 0; t < DUR; t += .7) mb.push([t, 0, "io"], [t + .35, -4, "io"]); [m1, m2, m3].forEach(m => E.K(m, "y", mb));
  const lab = (txt, top) => E.el(S.el, "abs", `left:40px;top:${top}px;background:rgba(29,43,54,.85);color:#fff;font-weight:900;font-size:30px;padding:6px 14px;border-radius:10px;z-index:8`, txt);
  const l1 = lab("", 975); lab("👩 MUM · IN THE KITCHEN", 1850);
  E.F(t => { const s = (t >= AIR0 && t < AIR1) ? "🛫 OTTO · AT THE AIRPORT" : "🧍 OTTO · IN HIS ROOM"; if (l1.textContent !== s) l1.textContent = s; });

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "MUM: 0 · OTTO: 0"], [4.25, "MUM: 1 · OTTO: 0"], [7.9, "MUM: 2 · OTTO: 0"], [15.9, "MUM: 3 · OTTO: 0"], [M_MO + 3, "MUM: 4 · OTTO: 0"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= 4.25 ? C.coralD : C.ink; });
  PL.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const OB = (h, t0, t1, fs = 46, w = 520) => bubble(h, 470, 470, w, 40, t0, t1, fs);
  const MB = (h, t0, t1, fs = 44, w = 560) => { const tl = Math.min(480, w - 70); return bubble(h, 790 - tl, 1085, w, tl, t0, t1, fs); };
  OB("Mum! Where's my charger?!", O_CH, M_CH - .05);
  MB("Left drawer. Under the blue jumper.", M_CH, O_GL - .05, 46);
  OB("Mum! Where are my glasses?!", O_GL, M_HD - .05);
  MB("On your head.", M_HD, O_PP - .05, 56, 440);
  OB("Mum! My passport! I'm at the airport!", O_PP, M_FO - .05, 44);
  MB("Blue folder. Bottom drawer. Under the cake tin. I'm sending you a photo.", M_FO, O_FD - .05, 40, 600);
  OB("Found it! Mum, you're a genius!", O_FD, M_KN - .05, 44);
  MB("I know.", M_KN, O_MO - .05, 60, 360);
  OB("Mum… where is my motivation?", O_MO, M_MO - .05, 44);
  MB("Bottom drawer. Next to the cake tin. You'll find it after lunch.", M_MO, STAMP + .3, 42, 600);
  const sb = E.el(S.el, "abs", "left:30px;top:850px;width:1020px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "MUM 4 · OTTO 0.", STAMP, { size: 96, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/elx-sink-dishes.wav", { vol: .3, duck: false, to: DUR }); E.clip(AIR0, "sfx/elx-airport-ambience.wav", { vol: .35, duck: false, to: AIR1 - AIR0 });
  E.clip(O_CH, "voices/ep107/o_charger.wav", { vol: 1.2 });
  E.clip(M_CH, "voices/ep107/m_charger.wav", { vol: 1.3 }); E.clip(4.1, "sfx/elx-drawer-open.wav", { vol: 1.2 }); E.S(4.3, "sparkle", .5);
  E.clip(O_GL, "voices/ep107/o_glasses.wav", { vol: 1.2 });
  E.clip(M_HD, "voices/ep107/m_head.wav", { vol: 1.3 }); E.S(7.95, "sparkle", .5);
  E.S(AIR0, "whoosh", .4); E.clip(O_PP, "voices/ep107/o_passport.wav", { vol: 1.2 });
  E.clip(M_FO, "voices/ep107/m_folder.wav", { vol: 1.3 }); E.clip(M_FO + 2.2, "sfx/phone-ping.wav", { vol: .6 });
  E.clip(O_FD, "voices/ep107/o_found.wav", { vol: 1.2 }); E.S(O_FD + .35, "sparkle", .5);
  E.clip(M_KN, "voices/ep107/m_know.wav", { vol: 1.3 });
  E.S(AIR1, "whoosh", .4); E.clip(O_MO, "voices/ep107/o_motiv.wav", { vol: 1.2 });
  E.clip(M_MO, "voices/ep107/m_motiv.wav", { vol: 1.3 });
  E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Asking *mum* where your stuff is", { size: 44, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[26.9, 1], [27.15, 1.18, "out"], [27.45, 1, "io"]]);
}
