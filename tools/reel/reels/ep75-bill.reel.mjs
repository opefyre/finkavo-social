// EP.75 "Asking for the bill in Portugal" — English-first. Buck, finished, on a café terrace: "Excuse me! Could we get the check,
// please?" The waiter strolls past: "Já vai!" (Coming!) — and keeps walking. "Sir? …Sir?" He strolls back the other way, whistling.
// Buck stands on his chair waving a white napkin: "HELLO?! THE CHECK?!" A little plane flies over towing THE CHECK, PLEASE! The
// waiter looks up: "Ahh… bonito." WAITING: 58 MIN. Then the old man at the next table lifts one finger without looking up from his
// paper: "Ó chefe." POOF — the waiter is there with his bill. Buck tries it: "…O… chef?" POOF — "On the house, my friend!" (a cake).
// Buck gives up and stands to leave — POOF, the waiter blocks the way, bill in hand: "Leaving already, my friend?" "…Oh, NOW you're fast."
export const meta = {
  id: "ep75-bill", date: "2026-12-07",
  images: {
    bf: "characters/cutouts/buck-chair_fork.webp", bs: "characters/cutouts/buck-chair_shock.webp", bh: "characters/cutouts/buck-chair_hand.webp",
    bst: "characters/cutouts/buck_chairstand.webp", bl: "characters/cutouts/buck_startled.webp",
    wa: "characters/cutouts/waiter_away.webp", wt: "characters/cutouts/waiter_tray.webp", wb: "characters/cutouts/waiter_bill.webp", wc: "characters/cutouts/waiter_cake.webp",
    om: "characters/cutouts/oldman_paper.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 116, root: 60, seed: 757, prog: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]] });
  const DUR = 20.8, FLOOR = 1800, Q = .4, JV = 2.85, SIR = 3.9, HELLO = 6.4, PLANE = 8.9, BON = 10.1, CHEFE = 11.9, POOF1 = 12.3,
    COPY = 13.4, HOUSE = 15.1, LEAVE = 16.6, POOF3 = 16.85, LV = 16.95, NOW = 18.35;
  const S = E.scene("bill", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  // ================= the terrace =================
  E.el(S.el, "abs", "inset:0;background:linear-gradient(180deg,#7cc6f2 0%,#cdebfa 38%)");
  const cl = E.el(S.el, "abs", "left:620px;top:520px;width:260px;height:70px;border-radius:40px;background:#fff;box-shadow:60px -20px 0 10px #fff,-50px 10px 0 -5px #fff;opacity:.9");
  E.K(cl, "x", [[0, 0], [DUR, -120, "lin"]]);                                                                                        // frame-0 motion
  // the café façade with a striped awning
  E.el(S.el, "abs", "left:0;top:880px;width:1080px;height:640px;background:#f3d7a6");
  E.el(S.el, "abs", "left:0;top:880px;width:1080px;height:640px;background-image:repeating-linear-gradient(0deg,rgba(0,0,0,.03) 0 4px,transparent 4px 64px)");
  const aw = E.el(S.el, "abs", "left:-20px;top:840px;width:1120px;height:130px;background:repeating-linear-gradient(90deg,#1f7a5a 0 80px,#f7f1e3 80px 160px);border-radius:0 0 30px 30px;box-shadow:0 10px 16px rgba(0,0,0,.15)");
  E.el(aw, "abs", "left:0;top:120px;width:100%;height:30px;background:radial-gradient(circle at 40px 0,#1f7a5a 30px,transparent 31px) 0 0/160px 30px repeat-x,radial-gradient(circle at 120px 0,#f7f1e3 30px,transparent 31px) 0 0/160px 30px repeat-x");
  E.el(S.el, "abs", "left:270px;top:760px;width:540px;height:80px;background:#1d2b36;border-radius:14px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:46px;color:#f2c230;letter-spacing:.1em;white-space:nowrap", "CAFÉ CENTRAL");
  E.el(S.el, "abs", "left:60px;top:1060px;width:360px;height:380px;background:#8fc6e3;border:14px solid #7a4a2a;border-radius:8px;box-sizing:border-box");
  E.el(S.el, "abs", "left:660px;top:1060px;width:360px;height:380px;background:#8fc6e3;border:14px solid #7a4a2a;border-radius:8px;box-sizing:border-box");
  const cob = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='60'><rect width='120' height='60' fill='#ece6d8'/><path d='M0 30 Q30 0 60 30 T120 30' fill='none' stroke='#1d2b36' stroke-width='9'/></svg>`;
  E.el(S.el, "abs", `left:0;top:1520px;width:1080px;height:400px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(cob)}");background-size:120px 60px`);

  const box = (n, w, h, s, left, bottom, z, extra = "") => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%;${extra}`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });

  // the old man at the next table (left)
  box("om", 555, 1146, .62, -10, FLOOR - 10, 3);
  E.el(S.el, "abs", `left:0;top:1560px;width:330px;height:34px;border-radius:50%;background:#3a3f46;z-index:4`);
  E.el(S.el, "abs", `left:150px;top:1590px;width:26px;height:${FLOOR - 1590}px;background:#3a3f46;z-index:4`);
  E.el(S.el, "abs", "left:230px;top:1518px;width:46px;height:44px;border-radius:0 0 18px 18px;background:#fff;border:4px solid #cfd6dc;box-sizing:border-box;z-index:5");

  // Buck at his table (centre-right); poses swap by opacity on one anchor
  const BX = 430, BS = .8;
  const bf = box("bf", 536, 1014, BS, BX, FLOOR, 3), bs = box("bs", 536, 1014, BS, BX, FLOOR, 3);
  const bh = box("bh", 572, 1118, BS * .88, BX - 3, FLOOR, 3);
  const bst = box("bst", 433, 983, BS * 1.15, BX + 20, FLOOR, 3);
  const bl = box("bl", 536, 947, BS * .95, BX + 60, FLOOR, 7);
  show(bf, [[0, Q - .05]]); show(bh, [[Q - .05, HELLO], [COPY, HOUSE - .1]]); show(bst, [[HELLO, PLANE]]);
  show(bs, [[PLANE, COPY], [HOUSE - .1, LEAVE]]); show(bl, [[LEAVE, DUR]]);
  E.K(bl, "x", [[LEAVE, -40], [LEAVE + .25, 60, "out"], [POOF3, 60], [POOF3 + .15, 0, "out"]]);
  const wave = []; for (let t = HELLO; t < PLANE; t += .3) wave.push([t, -4, "io"], [t + .15, 4, "io"]); wave.push([PLANE, 0]); E.K(bst, "r", wave);
  // his table, in front of him
  const tb = E.el(S.el, "abs", "left:400px;top:0;width:1px;height:1px;z-index:6");
  E.F(t => { tb.style.opacity = t >= LEAVE ? 0 : 1; });
  E.el(tb, "abs", "left:20px;top:1460px;width:460px;height:50px;border-radius:50%;background:#3a3f46");
  E.el(tb, "abs", "left:236px;top:1500px;width:30px;height:300px;background:#3a3f46");
  E.el(tb, "abs", "left:120px;top:1438px;width:160px;height:40px;border-radius:50%;background:#fff;border:4px solid #cfd6dc;box-sizing:border-box");
  E.el(tb, "abs", "left:330px;top:1380px;width:40px;height:80px;border-radius:0 0 12px 12px;background:rgba(230,180,60,.8);border:4px solid rgba(255,255,255,.8);box-sizing:border-box");
  const cake = E.el(tb, "abs", "left:150px;top:1370px;width:100px;height:70px;background:linear-gradient(180deg,#5a2f1c 0 20%,#8a4a2a 20% 45%,#5a2f1c 45% 60%,#8a4a2a 60%);border-radius:6px;opacity:0");
  E.K(cake, "o", [[HOUSE + .9, 0], [HOUSE + 1, 1]]);

  // the waiter: strolls past, back again, admires the plane, then teleports
  const WS = .74;
  const wa = box("wa", 585, 980, WS, 0, FLOOR - 120, 2), wa2 = box("wa", 585, 980, WS, 0, FLOOR - 120, 2);
  wa2.firstChild.style.transform = "scaleX(-1)";
  E.K(wa, "x", [[1.3, 1150], [3.9, -520, "lin"]]); show(wa, [[1.3, 3.9]]);
  E.K(wa2, "x", [[4.3, -520], [6.6, 1150, "lin"]]); show(wa2, [[4.3, 6.6]]);
  const wh = []; for (let t = 1.3; t < 6.6; t += .25) wh.push([t, 0], [t + .125, -10]); E.K(wa, "y", wh); E.K(wa2, "y", wh);
  const wa3 = box("wa", 585, 980, WS, 700, FLOOR - 60, 2); show(wa3, [[HELLO + .2, PLANE + .6]]);
  E.K(wa3, "x", [[HELLO + .2, 400], [HELLO + .8, 0, "out"]]);
  const wt = box("wt", 628, 1050, WS, 780, FLOOR - 60, 2); show(wt, [[PLANE + .6, CHEFE]]);
  const wb1 = box("wb", 438, 982, WS, 250, FLOOR - 40, 4); show(wb1, [[POOF1, COPY + .2]]);
  const wc = box("wc", 458, 996, WS, 800, FLOOR - 40, 5); show(wc, [[HOUSE - .15, LEAVE]]);
  const wb2 = box("wb", 438, 982, WS * 1.05, 780, FLOOR - 20, 8); show(wb2, [[POOF3, DUR]]);
  const poof = (x, y, t) => { const p = E.el(S.el, "abs", `left:${x - 230}px;top:${y - 230}px;width:460px;height:460px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.95),rgba(255,255,255,0) 68%);z-index:9;opacity:0`); E.K(p, "o", [[t - .01, 0], [t, 1], [t + .35, 0]]); E.K(p, "s", [[t, .4], [t + .35, 1.4, "out"]]); };
  poof(410, 1450, POOF1); poof(970, 1450, HOUSE - .15); poof(940, 1450, POOF3);
  // the plane with the banner
  const pl = E.el(S.el, "abs", "left:0;top:560px;width:1px;height:1px;z-index:1");
  E.K(pl, "x", [[PLANE, 1100], [PLANE + 3.2, -900, "lin"]]); E.K(pl, "y", [[PLANE, 0], [PLANE + 1.5, -30, "io"], [PLANE + 3, 0, "io"]]);
  E.el(pl, "abs", "left:0;top:0;width:190px;height:56px;border-radius:30px 60px 60px 30px;background:#e5484d");
  E.el(pl, "abs", "left:60px;top:-26px;width:60px;height:108px;border-radius:14px;background:#c23a3f");
  E.el(pl, "abs", "left:160px;top:-4px;width:50px;height:34px;border-radius:0 30px 0 0;background:#c23a3f");
  E.el(pl, "abs", "left:26px;top:10px;width:40px;height:24px;border-radius:10px;background:#bfe6fb");
  const prop = E.el(pl, "abs", "left:-14px;top:-22px;width:10px;height:100px;border-radius:5px;background:rgba(40,40,40,.5)");
  E.F(t => { prop.style.transform = `scaleY(${.3 + Math.abs(Math.sin(t * 40)) * .7})`; });
  E.el(pl, "abs", "left:210px;top:26px;width:70px;height:3px;background:#555");
  E.el(pl, "abs", "left:280px;top:-16px;width:560px;height:90px;background:#fffdf3;border:5px solid #1d2b36;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:50px;color:#e5484d;white-space:nowrap;box-sizing:border-box", "THE CHECK, PLEASE!");

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "WAITING: 0 MIN"], [SIR, "WAITING: 12 MIN"], [HELLO, "WAITING: 34 MIN"], [PLANE, "WAITING: 58 MIN"], [POOF1, "THE OLD MAN WAITED: 0.3 SEC"],
    [COPY, "WAITING: 90 MIN"], [POOF3, "LEAVING: 0.1 SEC"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = s.includes("SEC") ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble("Excuse me! Could we get the check, please?", 300, 800, 620, 360, Q, JV - .05, 44);
  bubble(`Já vai!${sub("(Coming!)")}`, 60, 900, 300, 150, JV, SIR - .05, 52);
  bubble("Sir? …Sir?", 460, 830, 360, 200, SIR, HELLO - .05, 54);
  bubble("HELLO?! THE CHECK?!", 330, 720, 560, 280, HELLO, PLANE - .05, 52);
  bubble(`Ahh… bonito.${sub("(Beautiful.)")}`, 560, 880, 400, 300, BON, CHEFE - .05, 50);
  bubble(`Ó chefe.${sub("(Hey, boss.)")}`, 20, 900, 300, 120, CHEFE, COPY - .05, 52);
  bubble("…O… chef?", 480, 820, 340, 180, COPY, HOUSE - .05, 54);
  bubble("On the house, my friend!", 520, 820, 500, 360, HOUSE, LEAVE - .05, 48);
  bubble("Leaving already, my friend?", 460, 800, 580, 440, LV, NOW - .05, 48);
  bubble("…Oh, NOW you're fast.", 200, 820, 540, 280, NOW, DUR - .4, 50);
  const sb = E.el(S.el, "abs", "left:60px;top:560px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "0.1 SECONDS.", NOW + .8, { size: 116, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/street-sunny.wav", { vol: 1.4, duck: false, to: DUR });
  E.clip(Q, "voices/ep75/b_check.wav", { vol: 1.2 });
  E.clip(JV, "voices/ep75/w_javai.wav", { vol: 1.3 });
  E.clip(SIR, "voices/ep75/b_sir.wav", { vol: 1.2 }); E.clip(4.4, "sfx/whistle.wav", { vol: .6, to: 2.1 });
  E.clip(HELLO, "voices/ep75/b_hello.wav", { vol: 1.15 });
  E.clip(PLANE, "sfx/plane-flyby.wav", { vol: .9, duck: false }); E.clip(BON, "voices/ep75/w_bonito.wav", { vol: 1.3 });
  E.clip(CHEFE, "voices/ep75/o_chefe.wav", { vol: 1.4 }); E.S(POOF1, "poof", .8); E.S(POOF1 + .05, "ding", .5);
  E.clip(COPY, "voices/ep75/b_chef.wav", { vol: 1.2 }); E.S(HOUSE - .15, "poof", .8);
  E.clip(HOUSE, "voices/ep75/w_house.wav", { vol: 1.3 });
  E.S(LEAVE, "whoosh", .4); E.S(POOF3, "poof", .9); E.S(POOF3 + .02, "scratch", .5);
  E.clip(LV, "voices/ep75/w_leaving.wav", { vol: 1.3 });
  E.clip(NOW, "voices/ep75/b_now.wav", { vol: 1.2 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Asking for the *bill* in Portugal", { size: 48, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[20.0, 1], [20.25, 1.18, "out"], [20.6, 1, "io"]]);
}
