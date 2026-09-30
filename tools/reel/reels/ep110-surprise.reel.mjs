// EP.110 "Your surprise party (you already know)" — Otto comes home on his birthday to a dark living room. He is loud and theatrical: "Hello? Anybody home? Why are all the
// lights off? Strange." Dad's phone rings behind a tiny plant, a sneeze from the curtain, a hearing-aid squeal from the wardrobe, two giggling heads over the sofa.
// "Nobody is home! Okay! I will just sit here!" SURPRISE! Otto, hands on cheeks, dead-flat: "Wow. I had NO idea. What a SURPRISE." Mum: "You knew?! Who told you?!"
// "Everyone told me." Dad: "…Monday." Grandma: "Tuesday." The postman, in a party hat: "Happy birthday, Otto!" Stamp: EVERYONE KNEW.
export const meta = {
  id: "ep110-surprise", date: "2027-01-11",
  images: {
    bg: "characters/scenes/bg_party.webp",
    o1: "characters/cutouts/otto-casual_stroll.webp", o2: "characters/cutouts/otto-casual_fakesurprise.webp",
    h1: "characters/cutouts/hide_curtain.webp", h2: "characters/cutouts/hide_dad-plant.webp", h3: "characters/cutouts/hide_sofa.webp", h4: "characters/cutouts/hide_wardrobe.webp",
    crowd: "characters/cutouts/family_welcome.webp", post: "characters/cutouts/postman_wave.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 116, root: 55, seed: 1101, prog: [[0, 4, 7], [7, 11, 14], [5, 9, 12], [9, 12, 16]] });
  const DUR = 23.2, HELLO = .3, RING = 2.0, SNEEZE = 3.0, SQUEAL = 3.9, SIT = 5.15, SURP = 8.8, WOW = 10.3, KNEW = 14.15, EVERY = 16.4, MON = 17.7, TUE = 18.6, POST = 19.45, STAMP = 21.2;
  const S = E.scene("party", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  const bgw = E.el(S.el, "abs", "inset:0"); E.img(bgw, "bg", BG); E.F(t => { bgw.style.filter = t >= SURP ? "brightness(1.7) saturate(1.2)" : "none"; });
  const night = E.el(S.el, "abs", "inset:0;background:rgba(10,12,40,.30);z-index:2");
  E.K(night, "o", [[0, 1], [SURP - .1, 1], [SURP, 0]]);

  // ---- the hiders (all terrible)
  const H = E.el(S.el, "abs", "inset:0;z-index:3"); show(H, [[0, SURP]]);
  const hc = fig(H, "h1", 620, 1002, .72, 175, 1330, 3);
  const hs = fig(H, "h3", 1318, 752, .6, 540, 1030, 3);
  const hw = fig(H, "h4", 485, 1024, .86, 905, 1215, 3);
  const hp = fig(H, "h2", 623, 993, .56, 760, 1540, 4);
  const shk = (el, t0, t1, amp, per = .08) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, (Math.round(t / per) % 2) ? amp : -amp, "io"]); E.K(el, "x", k); };
  shk(hp, RING, RING + 1.3, 6); shk(hc, SNEEZE, SNEEZE + .35, 10); shk(hw, SQUEAL, SQUEAL + 1.2, 5);
  const hb = []; for (let t = 0; t < SURP; t += .35) hb.push([t, 0, "io"], [t + .18, -6, "io"]); E.K(hs, "y", hb);                // giggling heads: frame-0 motion
  const emo = (txt, x, y, t0, t1, fs = 80) => { const el = E.el(S.el, "abs", `left:${x}px;top:${y}px;font-size:${fs}px;z-index:9;opacity:0`, txt); show(el, [[t0, t1]]); E.pop(el, t0, { from: .3, dur: .25 }); E.K(el, "y", [[t0, 0], [t1, -40, "out"]]); };
  emo("📱", 830, 1140, RING, RING + 1.3); emo("🤧", 40, 780, SNEEZE, SNEEZE + 1.0); emo("〰️", 870, 720, SQUEAL, SQUEAL + 1.2, 70); emo("🤭", 620, 640, 1.0, 2.0, 60); emo("🤭", 410, 640, 6.2, 7.3, 60);

  // ---- Otto walks in, then stands in the middle of it all
  const o1 = fig(S.el, "o1", 540, 1044, .68, 0, 1780, 6);
  E.K(o1, "x", [[0, -230], [1.6, 250, "lin"], [2.4, 300, "io"], [DUR, 300]]);
  show(o1, [[0, SURP]]);
  const wb = []; for (let t = 0; t < 1.6; t += .3) wb.push([t, 0, "io"], [t + .15, -14, "io"]); E.K(o1, "y", wb);
  const sway = []; for (let t = 2.4; t < SURP; t += .6) sway.push([t, (Math.round(t / .6) % 2) ? 3 : -3, "io"]); E.K(o1, "r", [[0, 0], ...sway]);
  const o2 = fig(S.el, "o2", 583, 1024, .7, 250, 1850, 6); show(o2, [[SURP, DUR]]); E.pop(o2, SURP, { from: .9, dur: .25 });
  const ob = []; for (let t = SURP; t < DUR; t += .6) ob.push([t, 0, "io"], [t + .3, -5, "io"]); E.K(o2, "y", ob);

  // ---- SURPRISE: the crowd
  const CW = 1080, CH = 688 * CW / 1024, cr = E.el(S.el, "abs", `left:0;top:${1800 - CH}px;width:${CW}px;height:${CH}px;z-index:4;opacity:0;transform-origin:50% 100%`);
  E.img(cr, "crowd", `width:${CW}px;height:${CH}px`); show(cr, [[SURP, DUR]]); E.pop(cr, SURP, { from: .6, dur: .3 });
  const cb = []; for (let t = SURP + .35; t < DUR; t += .55) cb.push([t, 0, "io"], [t + .28, -8, "io"]); E.K(cr, "y", cb);
  ["🎉", "🎊", "🎈", "✨", "🎉", "🎊"].forEach((e, i) => { const el = E.el(S.el, "abs", `left:${80 + i * 170}px;top:${900 + (i % 2) * 70}px;font-size:${90 + (i % 3) * 20}px;z-index:9;opacity:0`, e); show(el, [[SURP + .1 + i * .06, SURP + 1.6]]); E.K(el, "y", [[SURP, 0], [SURP + 1.6, 140, "in"]]); E.K(el, "r", [[SURP, -20], [SURP + 1.6, 40 + i * 10]]); });
  const pm = fig(S.el, "post", 660, 1008, .62, 930, 1990, 7); show(pm, [[POST - .1, DUR]]); E.K(pm, "y", [[POST - .1, 420], [POST + .25, 0, "out"]]);
  const pmb = []; for (let t = POST + .3; t < DUR; t += .4) pmb.push([t, 0, "io"], [t + .2, -6, "io"]); E.K(pm, "r", [[0, 0], ...pmb.map(([t, v, e]) => [t, v / 3, e])]);

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "HIDING: 5 · OTTO NOTICED: 0"], [KNEW - .3, "TOLD HIM: EVERYONE"], [MON, "TOLD HIM: DAD (MON)"], [TUE, "+ GRANDMA (TUE)"], [POST, "+ THE POSTMAN"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= KNEW - .3 ? C.coralD : C.ink; pill.style.fontSize = s.length > 24 ? "44px" : "50px"; });
  PL.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, hx, top, w, t0, t1, fs = 48, z = 10) => {
    const tail = Math.max(50, Math.min(w - 90, w / 2)), left = Math.max(20, Math.min(1060 - w, hx - tail)), tl = hx - left - 22;
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:${z};transform-origin:${tl}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tl}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Hello? Anybody home? Why are all the lights off? Strange.", 330, 770, 620, HELLO, SIT - .1, 44);
  bubble("Nobody is home! Okay! I will just sit here!", 340, 790, 620, SIT, SURP - .15, 44);
  bubble("Wow. I had NO idea. What a SURPRISE.", 250, 780, 600, WOW, KNEW - .1, 44);
  bubble("You knew?! Who told you?!", 240, 850, 520, KNEW, EVERY - .1, 48);
  bubble("Everyone told me.", 250, 780, 480, EVERY, MON - .1, 52);
  bubble("…Monday.", 100, 900, 330, MON, TUE - .1, 54);
  bubble("Tuesday.", 950, 900, 300, TUE, POST - .1, 54);
  bubble("Happy birthday, Otto!", 930, 1330, 560, POST, STAMP + .3, 46);
  E.stamp(E.el(S.el, "abs", "left:30px;top:560px;width:1020px;display:flex;justify-content:center;z-index:11"), "EVERYONE KNEW.", STAMP, { size: 96, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(0, "sfx/cicadas.wav", { vol: .22, duck: false, to: SURP });
  E.clip(HELLO, "voices/ep110/o_hello.wav", { vol: 1.25 });
  E.clip(RING, "sfx/elx-phone-ring.wav", { vol: .5, to: 1.4 }); E.clip(SNEEZE, "sfx/big-sneeze.wav", { vol: .9 }); E.clip(SQUEAL, "sfx/elx-hearing-aid-squeal.wav", { vol: .7, to: 1.3 });
  E.clip(SIT, "voices/ep110/o_sit.wav", { vol: 1.25 });
  E.clip(SURP - .05, "sfx/elx-light-switch.wav", { vol: 1.1 }); E.flash(SURP, "#fff6d8", .7, .3);
  E.clip(SURP, "sfx/elx-crowd-surprise.wav", { vol: .9 }); E.clip(SURP, "voices/ep110/m_surprise.wav", { vol: 1.1 }); E.clip(SURP + .05, "voices/ep110/d_surprise.wav", { vol: 1.1 }); E.clip(SURP + .1, "voices/ep110/g_surprise.wav", { vol: 1.1 });
  E.clip(WOW, "voices/ep110/o_wow.wav", { vol: 1.25 });
  E.clip(KNEW, "voices/ep110/m_knew.wav", { vol: 1.3 });
  E.clip(EVERY, "voices/ep110/o_everyone.wav", { vol: 1.25 });
  E.clip(MON, "voices/ep110/d_monday.wav", { vol: 1.3 }); E.clip(TUE, "voices/ep110/g_tuesday.wav", { vol: 1.3 });
  E.S(POST - .1, "whoosh", .4); E.clip(POST, "voices/ep110/p_happy.wav", { vol: 1.3 });
  E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Your *surprise party* (you knew)", { size: 46, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[22.4, 1], [22.65, 1.18, "out"], [22.95, 1, "io"]]);
}
