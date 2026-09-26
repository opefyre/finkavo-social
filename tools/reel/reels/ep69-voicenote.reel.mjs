// EP.69 "Mum's voice note" — English-first. A voice message from Mum: 14:07. "Fourteen minutes?!" Otto plays it at 2x. The panel shows
// what Mum is actually doing: "Hi filho, it's Mummy. So listen, I need you to—" then she turns away: "No, Fernanda! Not that cousin!
// The one who married the dentist!" … "Zé! Turn off the TV! I am recording!" … "Ai, the soup!" — while Otto grows a beard. At 13:58:
// "Anyway… bring bread. Beijinhos." The useful part: 3 seconds. He brings a baguette. A new voice note arrives, 22:41: "Not THAT bread."
export const meta = {
  id: "ep69-voicenote", date: "2026-12-01",
  images: {
    sl: "characters/cutouts/otto-phone_sleepy.webp", sh: "characters/cutouts/otto-phone_shocked.webp", stb: "characters/cutouts/otto-casual_stubble.webp", anc: "characters/cutouts/otto-casual_ancient.webp",
    bag: "characters/cutouts/otto-casual_baguette.webp", mr: "characters/cutouts/mum_record.webp", ms: "characters/cutouts/mum_shout.webp", mb: "characters/cutouts/mum_baguette.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 60, seed: 691, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 21.0, FOUR = .6, PLAY = 1.9, HI = 2.1, COUS = 5.4, TV = 9.1, SOUP = 12.0, BREAD = 14.0, BAG = 17.0, NEW = 17.7, NOT = 18.1;
  const S = E.scene("voicenote", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const lerpK = (K, t) => { if (t <= K[0][0]) return K[0][1]; for (let i = 0; i < K.length - 1; i++) if (t < K[i + 1][0]) { const u = (t - K[i][0]) / (K[i + 1][0] - K[i][0]); return K[i][1] + (K[i + 1][1] - K[i][1]) * u; } return K[K.length - 1][1]; };

  // ---------------- Otto's living room ----------------
  E.el(S.el, "abs", "inset:0;background:#e9e1f3");
  E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:repeating-linear-gradient(90deg,rgba(90,60,140,.05) 0 60px,transparent 60px 120px)");
  E.el(S.el, "abs", "left:0;top:1760px;width:1080px;height:160px;background:repeating-linear-gradient(90deg,#b98a5e 0 160px,#a97c52 160px 320px)");
  const OT = E.el(S.el, "abs", "left:-20px;top:0;width:1px;height:1px;z-index:4");
  const OF = { sh: [424, 1068], sl: [424, 1068], stb: [625, 1078], anc: [625, 1078], bag: [454, 1044] };
  const oIm = Object.entries(OF).map(([n, [w, h]]) => [n, E.img(OT, n, `position:absolute;left:0;top:${1800 - h * .78}px;width:${w * .78}px;height:${h * .78}px;opacity:0`)]);
  E.F(t => { const f = at([[0, "sl"], [FOUR, "sh"], [HI, "sl"], [TV, "stb"], [SOUP, "anc"], [BAG, "bag"], [NOT, "sh"]], t); oIm.forEach(([n, el]) => { el.style.opacity = n === f ? 1 : 0; }); });
  const ob = []; for (let t = 0; t < FOUR; t += .6) ob.push([t, 0, "io"], [t + .3, -6, "io"]);
  E.K(OT, "y", ob);                                                                                                     // frame-0 motion
  const cw = [0, 1, 2].map(i => E.el(S.el, "abs", `left:${60 + i * 60}px;top:640px;font-size:60px;color:#8a95a0;z-index:5;opacity:0`, "z"));
  E.F(t => cw.forEach((z, i) => { const u = ((t - HI + i * .4) % 1.2) / 1.2; z.style.opacity = t > TV && t < BREAD ? 1 - u : 0; z.style.transform = `translate(${u * 40}px,${-u * 100}px)`; }));

  // ---------------- the phone card ----------------
  const ph = E.el(S.el, "abs", "left:420px;top:440px;width:620px;background:#f4f1ea;border-radius:34px;border:12px solid #1d2b36;box-shadow:0 16px 34px rgba(0,0,0,.25);z-index:6;overflow:hidden");
  const hd = E.el(ph, "", "display:flex;align-items:center;gap:16px;padding:16px 20px;background:#2f6db5;color:#fff");
  E.el(hd, "", "width:64px;height:64px;border-radius:50%;background:#f5c9a8;border:4px solid #fff");
  E.el(hd, "", "font-weight:900;font-size:40px", "MUM ♥");
  const vn = (dur, t0) => {
    const b = E.el(ph, "", "margin:18px 20px;background:#fff;border-radius:22px;padding:16px 18px;box-shadow:0 3px 0 rgba(0,0,0,.08);display:flex;align-items:center;gap:14px;opacity:0");
    const play = E.el(b, "", "flex:none;width:64px;height:64px;border-radius:50%;background:#2f9e6f;color:#fff;font-size:34px;display:flex;align-items:center;justify-content:center", "▶");
    const wv = E.el(b, "", "flex:1;position:relative;height:60px;overflow:hidden");
    const bars = Array.from({ length: 24 }, (_, i) => E.el(wv, "abs", `left:${i * 11}px;top:${30 - (8 + ((i * 37) % 22))}px;width:6px;height:${2 * (8 + ((i * 37) % 22))}px;border-radius:3px;background:#c9d2da`));
    const lab = E.el(b, "", "flex:none;font-weight:900;font-size:34px;color:#1d2b36;font-family:monospace", dur);
    E.K(b, "o", [[t0 - .01, 0], [t0, 1]]); E.K(b, "s", [[t0, .6], [t0 + .25, 1, "back"]]);
    return { b, bars, lab, play };
  };
  const v1 = vn("14:07", .2), v2 = vn("22:41", NEW);
  const sp = E.el(v1.b, "", "flex:none;background:#1d2b36;color:#fff;font-weight:900;font-size:26px;padding:4px 10px;border-radius:10px;opacity:0", "2x");
  E.K(sp, "o", [[PLAY - .01, 0], [PLAY, 1]]);
  const PROG = [[PLAY, 0], [COUS - .1, 192], [TV - .1, 460], [SOUP - .1, 715], [BREAD - .1, 838], [BAG - .2, 847]];
  E.F(t => {
    const sec = t < PLAY ? 0 : lerpK(PROG, t), frac = sec / 847;
    v1.bars.forEach((bb, i) => { bb.style.background = i / 24 < frac ? "#2f9e6f" : "#c9d2da"; });
    const s = t < PLAY ? "14:07" : `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;
    if (v1.lab.textContent !== s) v1.lab.textContent = s;
    v1.play.textContent = t >= PLAY && t < BAG - .2 ? "II" : "▶";
    const f2 = t < NOT ? 0 : Math.min(1, (t - NOT) / 1.3) * .06; v2.bars.forEach((bb, i) => { bb.style.background = i / 24 < f2 ? "#2f9e6f" : "#c9d2da"; });
  });
  const useful = E.el(v1.b, "abs", "left:360px;top:-58px;background:#e5484d;color:#fff;font-weight:900;font-size:24px;padding:4px 10px;border-radius:8px;white-space:nowrap;opacity:0", "THE USEFUL PART ↓");
  E.K(useful, "o", [[BREAD + .8, 0], [BREAD + .9, 1], [BAG, 1], [BAG + .1, 0]]);

  // ---------------- "what Mum is doing" panel ----------------
  const panel = E.el(S.el, "abs", "left:440px;top:1000px;width:600px;height:740px;border-radius:30px;overflow:hidden;border:10px solid #fff;box-shadow:0 14px 30px rgba(0,0,0,.2);z-index:5;opacity:0");
  E.K(panel, "o", [[HI - .01, 0], [HI, 1]]); E.K(panel, "s", [[HI, .7], [HI + .3, 1, "back"]]);
  const az = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='#f7f3ea'/><rect x='2' y='2' width='76' height='76' fill='none' stroke='#6f8fb8' stroke-width='3'/><circle cx='40' cy='40' r='12' fill='none' stroke='#2f6db5' stroke-width='5'/></svg>`;
  E.el(panel, "abs", `inset:0;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(az)}");background-size:80px 80px`);
  E.el(panel, "abs", "left:0;top:600px;width:100%;height:140px;background:#b98a5e");
  const tvb = E.el(panel, "abs", "left:30px;top:120px;width:190px;height:130px;background:#1d2b36;border-radius:10px;padding:8px;box-sizing:border-box");
  const tvs = E.el(tvb, "", "width:100%;height:100%;border-radius:6px;background:repeating-linear-gradient(90deg,#3f9a4a 0 20px,#4aab55 20px 40px)");
  E.F(t => { tvs.style.opacity = t >= TV && t < SOUP ? 1 : .35; tvb.style.transform = t >= TV && t < SOUP ? `translate(${Math.sin(t * 40) * 3}px,0)` : ""; });
  const pot = E.el(panel, "abs", "left:420px;top:420px;width:150px;height:100px;border-radius:0 0 30px 30px;background:#3d4650;border-top:12px solid #5a6570");
  const stm = E.el(panel, "abs", "left:440px;top:300px;width:110px;height:130px;border-radius:50%;background:rgba(255,255,255,.9);opacity:0");
  E.F(t => { const on = t >= SOUP && t < BREAD; stm.style.opacity = on ? .9 : 0; stm.style.transform = `scale(${1 + Math.sin(t * 20) * .1})`; pot.style.transform = on ? `translate(${Math.sin(t * 50) * 4}px,0)` : ""; });
  const MF = { mr: [528, 1076], ms: [489, 1050], mb: [608, 1069] };
  const mIm = Object.entries(MF).map(([n, [w, h]]) => [n, E.img(panel, n, `position:absolute;left:${200 - w * .58 / 2 + 60}px;top:${700 - h * .58}px;width:${w * .58}px;height:${h * .58}px;opacity:0`)]);
  E.F(t => { const f = at([[0, "mr"], [COUS, "ms"], [BREAD, "mr"], [NOT - .1, "mb"]], t); mIm.forEach(([n, el]) => { el.style.opacity = n === f ? 1 : 0; }); });
  const plab = E.el(panel, "abs", "left:16px;top:16px;background:#1d2b36;color:#fff;font-weight:900;font-size:26px;padding:4px 12px;border-radius:10px", "WHAT MUM IS DOING:");
  const doing = E.el(panel, "abs", "left:16px;top:60px;background:#fff;color:#1d2b36;font-weight:900;font-size:28px;padding:4px 12px;border-radius:10px", "");
  E.F(t => { const s = at([[0, ""], [HI, "recording"], [COUS, "gossiping"], [TV, "fighting the TV"], [SOUP, "saving the soup"], [BREAD, "remembering why she called"], [NOT, "judging your bread"]], t); if (doing.textContent !== s) doing.textContent = s; doing.style.opacity = s ? 1 : 0; });
  E.K(panel, "o", [[BAG - .01, 1], [BAG, 0], [NOT - .31, 0], [NOT - .3, 1]]);

  // ---------------- HUD ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  E.F(t => { const s = t < PLAY ? "NEW VOICE NOTE" : t < BAG ? "PLAYING AT 2x" : t < NEW ? "MISSION: BREAD ✓" : "NEW VOICE NOTE"; if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= BAG && t < NEW ? "#1f7a3a" : t >= NEW ? C.coralD : C.ink; });

  // ---------------- bubbles, stamp ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 46) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Fourteen minutes?!", 20, 700, 400, 140, FOUR, PLAY + .3, 50);
  const sayCap = (txt, t0, t1) => { const c = E.el(S.el, "abs", "left:440px;top:930px;width:600px;z-index:11;opacity:0;background:#1d2b36;color:#fff;border-radius:16px;padding:10px 16px;box-sizing:border-box;font-weight:800;font-size:30px;line-height:1.15", txt); E.K(c, "o", [[t0, 0], [t0 + .1, 1], [t1 - .1, 1], [t1, 0]]); };
  sayCap("“Hi filho, it's Mummy. So listen, I need you to—”", HI, COUS - .05);
  sayCap("“No, Fernanda! Not that cousin! The one who married the dentist!”", COUS, TV - .05);
  sayCap("“Zé! Turn off the TV! I am recording!”", TV, SOUP - .05);
  sayCap("“Ai, the soup! The soup!”", SOUP, BREAD - .05);
  sayCap("“Anyway… bring bread. Beijinhos.”", BREAD, BAG - .1);
  sayCap("“Not THAT bread.”", NOT, DUR - .4);
  const sb = E.el(S.el, "abs", "left:60px;top:1500px;width:960px;display:flex;justify-content:center;z-index:12");
  const st = E.stamp(sb, "14 MINUTES. 1 INSTRUCTION.", NOT + 1.4, { size: 78, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  E.clip(.2, "sfx/phone-ping.wav", { vol: 1.2 });
  E.clip(FOUR, "voices/ep69/o_fourteen.wav", { vol: 1.2 });
  E.S(PLAY, "tick", .8);
  E.clip(HI, "voices/ep69/m_hi.wav", { vol: 1.15 });
  E.clip(COUS, "voices/ep69/m_cousin.wav", { vol: 1.15 });
  E.clip(TV - .2, "sfx/tv-loud.wav", { vol: .35 }); E.clip(TV, "voices/ep69/m_tv.wav", { vol: 1.2 });
  E.clip(SOUP - .2, "sfx/pressure-cooker.wav", { vol: .45 }); E.clip(SOUP, "voices/ep69/m_soup.wav", { vol: 1.2 }); E.clip(SOUP + 1.2, "sfx/dog-bark.wav", { vol: .5 });
  E.clip(BREAD, "voices/ep69/m_bread.wav", { vol: 1.2 }); E.S(BREAD + .9, "ding", .6);
  E.S(BAG, "whoosh", .6); E.S(BAG + .2, "sparkle", .6);
  E.clip(NEW, "sfx/phone-ping.wav", { vol: 1.2 });
  E.clip(NOT, "voices/ep69/m_notthat.wav", { vol: 1.3 }); E.S(NOT + .1, "scratch", .6);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "Mum's *voice note*", { size: 58, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[20.2, 1], [20.45, 1.18, "out"], [20.8, 1, "io"]]);
}
