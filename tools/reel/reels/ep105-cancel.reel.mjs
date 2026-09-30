// EP.105 "Cancelling your internet in Portugal" — split screen: Buck's sofa (top), the call centre (bottom). Buck, calm: "I would like to cancel my internet,
// please." The agent, shocked: "Cancel?! But why? We have a special offer for you!" Free tablet, free television, free toaster (and a bicycle) drop
// around the sofa, one by one. Buck, sinking: "I just want to CANCEL." The agent, sobbing: "Please, sir… I have a family!" Buck: "Fine! I will stay!" The
// agent, radiant: "Wonderful! Your new twenty-four month loyalty period starts now." "But I wanted to cancel!" The agent, leaning back: "And that, sir, is
// called loyalty." Hold music.
export const meta = {
  id: "ep105-cancel", date: "2027-01-06",
  images: {
    room: "characters/scenes/bg_teenroom.webp", cc: "characters/scenes/bg_callcenter.webp", s1: "characters/cutouts/buck-sofa_calm.webp", s2: "characters/cutouts/buck-sofa_defeat.webp",
    a1: "characters/cutouts/agent_offer.webp", a2: "characters/cutouts/agent_cry.webp", a3: "characters/cutouts/agent_smug.webp",
    g1: "characters/props/gift-tablet.webp", g2: "characters/props/gift-tv.webp", g3: "characters/props/gift-toaster.webp", g4: "characters/props/gift-bike.webp", g5: "characters/props/gift-box.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 114, root: 52, seed: 1051, prog: [[0, 4, 7], [5, 9, 12], [2, 5, 9], [7, 11, 14]] });
  const DUR = 27.7, B_CANCEL = .3, A_CANCEL = 3.15, A_TAB = 6.1, A_TV = 7.6, A_TOAST = 9.37, B_JUST = 11.1, A_FAM = 13.15, B_FINE = 15.6, A_WON = 17.6, B_WANT = 21.3, A_LOY = 23.17, STAMP = 25.9;
  const S = E.scene("cancel", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  E.el(S.el, "abs", "inset:0;background:#1d2b36");

  // ================= top: Buck's living room =================
  const T = E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1030px;overflow:hidden;background:#3a2c26");
  E.img(T, "room", "position:absolute;left:0;top:216px;width:1080px;height:814px");
  const SW = 724, SH = 546, sofa = E.el(T, "abs", `left:250px;top:${1030 - SH}px;width:${SW}px;height:${SH}px;z-index:6`);
  const SF = ["s1", "s2"].map(n => E.img(sofa, n, `position:absolute;left:0;top:0;width:${SW}px;height:${SH}px;opacity:0`));
  E.F(t => { const k = t < B_JUST - .1 ? 0 : 1; SF.forEach((s, i) => { s.style.opacity = i === k ? 1 : 0; }); });
  const sb2 = []; for (let t = 0; t < B_JUST; t += .6) sb2.push([t, 0, "io"], [t + .3, -3, "io"]); E.K(sofa, "y", sb2);                        // frame-0 motion: on hold
  // the gifts drop around the sofa
  const gift = (n, w, h, s, left, t0) => { const el = E.el(T, "abs", `left:${left}px;top:${1020 - h * s}px;width:${w * s}px;height:${h * s}px;z-index:7;opacity:0`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); show(el, [[t0, DUR]]); E.K(el, "y", [[t0, -700], [t0 + .35, 0, "in"], [t0 + .5, -24, "out"], [t0 + .65, 0, "in"]]); };
  gift("g1", 230, 253, .55, 226, A_TAB + .25); gift("g2", 286, 242, .7, 850, A_TV + .25); gift("g3", 310, 222, .55, 400, A_TOAST + .15); gift("g4", 327, 233, .6, 20, A_TOAST + .7);

  // ================= bottom: the call centre =================
  const B = E.el(S.el, "abs", "left:0;top:1040px;width:1080px;height:880px;overflow:hidden");
  E.img(B, "cc", "position:absolute;left:-44px;top:0;width:1168px;height:880px");
  const AG = E.el(B, "abs", "left:-44px;top:0;width:1168px;height:880px;z-index:3");
  const AP = ["a1", "a2", "a3"].map(n => E.img(AG, n, "position:absolute;left:0;top:0;width:1168px;height:880px;opacity:0"));
  E.F(t => { const k = t < A_FAM ? 0 : t < B_FINE ? 1 : t < B_WANT ? 0 : 2; AP.forEach((a, i) => { a.style.opacity = i === k ? 1 : 0; }); });
  const ab = []; for (let t = 0; t < DUR; t += .5) ab.push([t, 0, "io"], [t + .25, -4, "io"]); E.K(AG, "y", ab);
  const badge = E.el(B, "abs", `left:720px;top:130px;width:190px;height:190px;border-radius:50%;background:${C.coralD};color:#fff;font-weight:900;font-size:62px;display:flex;align-items:center;justify-content:center;z-index:4;border:8px solid #fff;box-shadow:0 8px 20px rgba(0,0,0,.3)`, "−50%");
  show(badge, [[A_CANCEL + .8, A_FAM]]); E.pop(badge, A_CANCEL + .8, { from: .3, dur: .3 }); E.K(badge, "r", [[A_CANCEL + .8, -10], [A_FAM, -6]]);

  const lab = (txt, top) => E.el(S.el, "abs", `left:40px;top:${top}px;background:rgba(29,43,54,.85);color:#fff;font-weight:900;font-size:30px;padding:6px 14px;border-radius:10px;z-index:8`, txt);
  lab("🛋 BUCK · AT HOME", 440); lab("🎧 CALL CENTRE", 1060);
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "CALL: CANCEL INTERNET"], [A_CANCEL, "OFFERS: 1"], [A_TAB, "OFFERS: 2"], [A_TV, "OFFERS: 3"], [A_TOAST, "OFFERS: 5"], [B_JUST, "CANCELLED: 0"], [A_WON, "LOYALTY: +24 MONTHS"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= A_CANCEL ? C.coralD : C.ink; pill.style.fontSize = s.length > 22 ? "44px" : "50px"; });
  PL.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const BU = (h, t0, t1, fs = 44, w = 480) => bubble(h, 30, 500, w, w - 70, t0, t1, fs);
  const AB = (h, t0, t1, fs = 44, w = 470) => bubble(h, 590, 1090, w, 50, t0, t1, fs);
  BU("Hi! I would like to cancel my internet, please.", B_CANCEL, A_CANCEL - .05, 42, 500);
  AB("Cancel?! But why? We have a special offer for you!", A_CANCEL, A_TAB - .05, 42);
  AB("And a free tablet!", A_TAB, A_TV - .05, 50);
  AB("And a free television!", A_TV, A_TOAST - .05, 50);
  AB("And a free toaster!", A_TOAST, B_JUST - .05, 50);
  BU("I just want to CANCEL.", B_JUST, A_FAM - .05, 50);
  AB("Please, sir… I have a family!", A_FAM, B_FINE - .05, 48);
  BU("Fine! I will stay!", B_FINE, A_WON - .05, 54, 440);
  AB("Wonderful! Your new 24-month loyalty period starts now.", A_WON, B_WANT - .05, 42);
  BU("But I wanted to cancel!", B_WANT, A_LOY - .05, 50);
  AB("And that, sir, is called loyalty.", A_LOY, STAMP + .4, 46);
  const sb = E.el(S.el, "abs", "left:30px;top:930px;width:1020px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "LOYALTY: 24 MONTHS.", STAMP, { size: 88, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/office.wav", { vol: .25, duck: false, to: DUR });
  E.clip(B_CANCEL, "voices/ep105/b_cancel.wav", { vol: 1.2 });
  E.clip(A_CANCEL - .3, "sfx/phone-ping.wav", { vol: .6 }); E.clip(A_CANCEL, "voices/ep105/a_cancel.wav", { vol: 1.3 }); E.S(A_CANCEL + .8, "sparkle", .5);
  E.clip(A_TAB, "voices/ep105/a_tablet.wav", { vol: 1.3 }); E.S(A_TAB + .35, "thud", .55);
  E.clip(A_TV, "voices/ep105/a_tv.wav", { vol: 1.3 }); E.S(A_TV + .35, "thud", .55);
  E.clip(A_TOAST, "voices/ep105/a_toaster.wav", { vol: 1.3 }); E.S(A_TOAST + .3, "thud", .55); E.S(A_TOAST + .85, "thud", .55);
  E.clip(B_JUST, "voices/ep105/b_justcancel.wav", { vol: 1.25 });
  E.clip(A_FAM, "voices/ep105/a_family.wav", { vol: 1.35 });
  E.clip(B_FINE, "voices/ep105/b_fine.wav", { vol: 1.25 });
  E.clip(A_WON, "voices/ep105/a_wonderful.wav", { vol: 1.3 }); E.S(A_WON + .2, "sparkle", .5);
  E.clip(B_WANT, "voices/ep105/b_wanted.wav", { vol: 1.25 });
  E.clip(A_LOY, "voices/ep105/a_loyalty.wav", { vol: 1.35 });
  E.clip(STAMP - .2, "sfx/elx-hold-music.wav", { vol: .6, duck: false, to: DUR - STAMP + .2 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Cancelling your internet in *Portugal*", { size: 42, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[26.9, 1], [27.15, 1.18, "out"], [27.5, 1, "io"]]);
}
