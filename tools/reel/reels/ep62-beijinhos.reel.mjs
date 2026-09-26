// EP.62 "Beijinhos" — every Portuguese call ends with "beijinhos" (little kisses). Grandma on the phone: "Pronto, beijinhos!" The rule
// card. Otto tries it: the plumber — "Beijinhos!" ✓. The bank — "Obrigada, beijinhos!" ✓. Finanças (the tax office) — a long pause from
// the clerk… "…Beijinhos." ✓. BACK HOME, a call with his British boss: "…Beijinhos?" — "…I beg your pardon?" Voiced (grandma, plumber,
// bank, tax clerk in Portuguese with subtitles; Otto; the boss) + call sounds.
export const meta = {
  id: "ep62-beijinhos", date: "2026-11-24",
  images: {
    rel: "characters/cutouts/otto-phone_relief.webp", sh: "characters/cutouts/otto-phone_shocked.webp",
    gran: "characters/cutouts/dona_kiss-phone.webp", plumb: "characters/cutouts/plumber_phone.webp", bank: "characters/cutouts/bank_headset.webp",
    fin: "characters/cutouts/carimbo_deadpan.webp", boss: "characters/cutouts/boss_phone.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 62, seed: 621, prog: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]] });
  const DUR = 18.2, PL = 3.4, BK = 6.6, FN = 9.6, HOME = 13.0;
  const S = E.scene("calls", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  // ---------------- Otto's flat ----------------
  const wall = E.el(S.el, "abs", "inset:0");
  E.F(t => { wall.style.background = t >= HOME ? "#dfe6ee" : "#f6e4cc"; });
  E.el(S.el, "abs", "left:0;top:1740px;width:1080px;height:180px;background:repeating-linear-gradient(90deg,#b98a5e 0 160px,#a97c52 160px 320px)");
  const win = E.el(S.el, "abs", "left:60px;top:560px;width:300px;height:360px;border:14px solid #fff;border-radius:8px;overflow:hidden");
  const sky = E.el(win, "abs", "inset:0");
  E.F(t => { sky.style.background = t >= HOME ? "linear-gradient(180deg,#8a95a0,#b8c1c9)" : "linear-gradient(180deg,#8fd0f5,#dff2fb)"; });
  const home = E.el(S.el, "abs", "left:60px;top:930px;width:300px;text-align:center;font-weight:900;font-size:30px;color:#7a8791", "");
  E.F(t => { const s = t >= HOME ? "London, Monday 9:00" : "Lisbon"; if (home.textContent !== s) home.textContent = s; });
  const rain = Array.from({ length: 16 }, (_, i) => E.el(win, "abs", `left:${(i * 37) % 280}px;top:0;width:3px;height:26px;background:rgba(255,255,255,.7);opacity:0`));
  E.F(t => rain.forEach((r, i) => { r.style.opacity = t >= HOME ? .8 : 0; r.style.transform = `translateY(${((t * 700 + i * 90) % 400) - 30}px)`; }));

  // ---------------- Otto on the phone ----------------
  const OS = .98, ow = E.el(S.el, "abs", `left:-10px;top:${1780 - 1068 * OS}px;width:${424 * OS}px;height:${1068 * OS}px;z-index:4`);
  const o1 = E.img(ow, "rel", `position:absolute;left:0;top:0;width:${424 * OS}px;height:${1068 * OS}px`);
  const o2 = E.img(ow, "sh", `position:absolute;left:0;top:0;width:${424 * OS}px;height:${1068 * OS}px;opacity:0`);
  E.F(t => { const s = t >= HOME + 1.9 || (t >= FN + 1.0 && t < FN + 2.2); o1.style.opacity = s ? 0 : 1; o2.style.opacity = s ? 1 : 0; ow.style.opacity = t >= PL - .2 ? 1 : 0; });
  E.K(ow, "x", [[PL - .2, -400], [PL + .1, 0, "out"]]);

  // ---------------- the caller inset ----------------
  const R = 230, CX = 760, CY = 1050;
  const ring = E.el(S.el, "abs", `left:${CX - R}px;top:${CY - R}px;width:${2 * R}px;height:${2 * R}px;border-radius:50%;overflow:hidden;background:#fde9c8;border:12px solid #fff;box-shadow:0 12px 28px rgba(0,0,0,.2);z-index:3`);
  // [start, end, img, w, h, scale, offX, offY, label, bg]
  const CALLERS = [[0, PL, "gran", 0, 0, 0, 0, 0, "Grandma", "#fde9c8"], [PL, BK, "plumb", 685, 1031, .7, -40, 10, "The plumber", "#dff0e8"], [BK, FN, "bank", 880, 951, .62, -60, 30, "The bank", "#e3ecf7"],
    [FN, HOME, "fin", 730, 1094, .72, -30, -10, "Finanças (tax office)", "#eef0f2"], [HOME, DUR, "boss", 880, 1065, .62, -40, 20, "The boss (London)", "#e9eef3"]];
  const cIm = CALLERS.map(([a, b, n, w, h, s, ox, oy]) => n === "gran" ? null : E.img(ring, n, `position:absolute;left:${ox}px;top:${oy}px;width:${w * s}px;height:${h * s}px;opacity:0`));
  const lab = E.el(S.el, "abs", `left:${CX - 260}px;top:${CY + R + 30}px;width:520px;text-align:center;z-index:5`, "");
  const labIn = E.el(lab, "", "display:inline-block;background:#1d2b36;color:#fff;font-weight:900;font-size:30px;padding:6px 20px;border-radius:14px", "");
  E.F(t => { const i = CALLERS.findIndex(c => t >= c[0] && t < c[1]); cIm.forEach((el, k) => { if (el) el.style.opacity = k === i ? 1 : 0; }); ring.style.background = i >= 0 ? CALLERS[i][9] : "#fff"; const s = i >= 0 ? `ON THE PHONE: ${CALLERS[i][8]}` : ""; if (labIn.textContent !== s) labIn.textContent = s; ring.style.opacity = t >= PL - .1 ? 1 : 0; lab.style.opacity = t >= PL - .1 ? 1 : 0; });
  CALLERS.slice(1).forEach(([a]) => E.K(ring, "s", [[a - .01, 1], [a, .6], [a + .3, 1, "back"]]));
  // Scene 0: grandma, big, on her own phone
  const gw = E.el(S.el, "abs", "left:360px;top:0;width:1px;height:1px;z-index:3");
  const gimg = E.img(gw, "gran", `position:absolute;left:40px;top:${1760 - 1032 * .9}px;width:${568 * .9}px;height:${1032 * .9}px`);
  E.K(gw, "o", [[PL - .2, 1], [PL, 0]]);
  const gb = []; for (let t = 0; t < PL; t += .8) gb.push([t, 0, "io"], [t + .4, -8, "io"]);
  E.K(gw, "y", gb);                                                                                                     // frame-0 motion
  const rule = E.el(S.el, "abs", "left:60px;top:440px;width:520px;background:#fffdf3;border-left:14px solid #e0457b;border-radius:16px;padding:14px 20px;box-sizing:border-box;z-index:8;box-shadow:0 10px 24px rgba(0,0,0,.18);opacity:0");
  E.el(rule, "", "font-weight:900;font-size:36px;color:#e0457b", "THE RULE:");
  E.el(rule, "", `font-weight:800;font-size:32px;color:${C.ink};line-height:1.15;margin-top:4px`, "Every call ends with “beijinhos” (little kisses).");
  E.pop(rule, 1.9, { from: .3, dur: .3 }); E.K(rule, "o", [[1.9, 0], [2.0, 1], [PL - .1, 1], [PL, 0]]);

  // ---------------- counter ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:#e0457b;color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  const OK = [[0, 0], [PL + 1.9, 1], [BK + 2.2, 2], [FN + 2.3, 3]];
  E.F(t => { const n = at(OK, t), s = t >= HOME ? "BACK HOME · HABIT: STUCK" : `BEIJINHOS RETURNED: ${n}`; if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= HOME ? C.coralD : "#e0457b"; });
  OK.slice(1).forEach(([t]) => { E.K(pill, "s", [[t - .01, 1], [t, 1.25], [t + .25, 1, "out"]]); const ck = E.el(S.el, "abs", `left:${CX + 120}px;top:${CY - R - 20}px;width:110px;height:110px;border-radius:50%;background:#1f7a3a;color:#fff;font-weight:900;font-size:70px;display:flex;align-items:center;justify-content:center;z-index:6;opacity:0`, "✓"); E.pop(ck, t, { from: .3, dur: .3 }); E.K(ck, "o", [[t, 0], [t + .1, 1], [t + 1.0, 1], [t + 1.2, 0]]); });
  const hearts = [0, 1, 2].map(i => E.el(S.el, "abs", `left:${380 + i * 50}px;top:760px;font-size:56px;color:#e0457b;z-index:6;opacity:0`, "♥"));
  E.F(t => hearts.forEach((h, i) => { const act = [PL + 1.3, BK + 1.4, FN + 2.3].some(a => t > a && t < a + 1.2); const u = ((t * 1.3 + i * .3) % 1); h.style.opacity = act ? 1 - u : 0; h.style.transform = `translate(${Math.sin(u * 6 + i) * 20}px,${-u * 160}px)`; }));

  // ---------------- bubbles, stamp ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 50) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble(`Pronto, beijinhos!${sub("(Right, little kisses!)")}`, 480, 600, 480, 250, .4, 1.9, 50);
  bubble("Beijinhos!", 580, 600, 380, 180, PL + .5, PL + 1.3, 56);
  bubble("Thank you so much. Beijinhos!", 60, 540, 520, 120, PL + 1.3, BK - .1, 46);
  bubble(`Obrigada, beijinhos!${sub("(Thanks, little kisses!)")}`, 520, 600, 500, 240, BK + .3, BK + 1.6, 48);
  bubble("Beijinhos!", 60, 600, 360, 120, BK + 1.6, FN - .1, 54);
  bubble("Thank you so much. Beijinhos!", 60, 540, 520, 120, FN + .1, FN + 2.1, 46);
  bubble("…", 640, 640, 140, 60, FN + 1.0, FN + 2.2, 60);
  bubble(`…Beijinhos.${sub("(…little kisses.)")}`, 540, 600, 420, 220, FN + 2.2, HOME - .1, 50);
  bubble("…Beijinhos?", 60, 600, 380, 120, HOME + .5, HOME + 2.2, 56);
  bubble("…I beg your pardon?", 520, 620, 500, 240, HOME + 2.2, DUR - .4, 50);
  const sb = E.el(S.el, "abs", "left:60px;top:1500px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "BEIJINHOS.", HOME + 3.4, { size: 110, rot: -6, bg: "#e0457b", shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  E.clip(.4, "voices/ep62/g_beij.wav", { vol: 1.15 }); E.clip(1.9, "sfx/phone-hangup.wav", { vol: 3 });
  for (const t of [PL, BK, FN, HOME]) E.clip(t, "sfx/call-join.wav", { vol: .5 });
  E.clip(PL + .5, "voices/ep62/p_beij.wav", { vol: 1.15 });
  E.clip(PL + 1.3, "voices/ep62/o_beij.wav", { vol: 1.15 });
  E.clip(BK + .3, "voices/ep62/b_beij.wav", { vol: 1.15 });
  E.clip(BK + 1.6, "voices/ep62/o_beij.wav", { vol: 1.15, from: 1.1 });
  E.clip(FN + .1, "voices/ep62/o_beij.wav", { vol: 1.15 });
  E.clip(FN + 2.2, "voices/ep62/f_beij.wav", { vol: 1.25 });
  for (const t of [PL + 1.9, BK + 2.2, FN + 2.3]) E.S(t, "ding", .7);
  E.clip(HOME + .6, "voices/ep62/o_beij2.wav", { vol: 1.2 });
  E.S(HOME + 1.9, "scratch", .8);
  E.clip(HOME + 2.2, "voices/ep62/x_pardon.wav", { vol: 1.2 });
  E.clip(HOME + 3.8, "sfx/phone-hangup.wav", { vol: 3 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "Ending a call in *Portugal*", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[17.4, 1], [17.65, 1.18, "out"], [18.0, 1, "io"]]);
}
