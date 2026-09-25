// EP.28 "The Atlantic in October" — sunny beach, Buck the tourist runs in: "Beach day!!" The thermometer: AIR warm… WATER plunges
// to blue. He comes back out frozen stiff, icicles on his beard. The locals in jackets sip espresso: "Tourist." "Welcome to the
// Atlantic." A small wave taps his feet and he topples like a plank. ATLANTIC 1 · TOURIST 0. Effects only, no voice.
export const meta = {
  id: "ep28-atlantic", date: "2026-10-21",
  images: { b_swim: "characters/cutouts/buck_swim.webp", b_frozen: "characters/cutouts/buck_frozen.webp", locals: "characters/cutouts/locals_beach.webp" },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 60, seed: 281, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 14.2;
  const S = E.scene("beach", 0, DUR, "light"); E.cur = S;
  const SHORE = 1240, RUN = 2.2, SPLASH = 2.95, OUT = 3.9, WAVE = 8.9, FALL = 9.4, SCORE = 10.3;

  // ---------------- sky, sea, sand ----------------
  E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;background:linear-gradient(180deg,#7cc7f2,#cdeeff 55%)");
  E.el(S.el, "abs", "left:640px;top:560px;width:150px;height:150px;border-radius:50%;background:#fff2a8;box-shadow:0 0 60px 30px rgba(255,240,160,.8)");
  const sea = E.el(S.el, "abs", `left:0;top:960px;width:1080px;height:${SHORE - 960 + 40}px;background:linear-gradient(180deg,#1f6fa8,#2f9bd6 60%,#6cc6ec)`);
  for (let i = 0; i < 4; i++) {                                                    // rolling wave lines (moving from frame 0)
    const w = E.el(S.el, "abs", `left:-200px;top:${1000 + i * 60}px;width:1480px;height:10px;border-radius:5px;background:rgba(255,255,255,.55)`);
    E.F(t => { w.style.transform = `translateX(${Math.sin(t * 1.3 + i) * 60}px)`; w.style.opacity = .35 + .3 * Math.sin(t * 2 + i); });
  }
  E.el(S.el, "abs", `left:0;top:${SHORE}px;width:1080px;height:${1920 - SHORE}px;background:linear-gradient(180deg,#f3dca6,#e8c883)`);
  E.el(S.el, "abs", `left:0;top:${SHORE}px;width:1080px;height:26px;background:rgba(255,255,255,.7);border-radius:0 0 50% 50%`);
  // a parasol for the locals
  E.el(S.el, "abs", "left:196px;top:1080px;width:12px;height:560px;background:#e9e2d6;z-index:1");
  const can = E.el(S.el, "abs", "left:-20px;top:1010px;width:440px;height:150px;border-radius:220px 220px 0 0;overflow:hidden;z-index:1");
  for (let i = 0; i < 8; i++) E.el(can, "abs", `left:${i * 55}px;top:0;width:55px;height:150px;background:${i % 2 ? "#fff" : "#2f6db5"}`);

  // ---------------- the thermometer ----------------
  const th = E.el(S.el, "abs", "left:880px;top:470px;width:140px;height:430px;z-index:5");
  E.el(th, "abs", "left:44px;top:0;width:52px;height:330px;border-radius:26px;background:#fff;box-shadow:0 6px 16px rgba(0,0,0,.15)");
  const bulb = E.el(th, "abs", "left:20px;top:300px;width:100px;height:100px;border-radius:50%;background:#e5484d;box-shadow:0 6px 16px rgba(0,0,0,.15)");
  const merc = E.el(th, "abs", "left:58px;top:40px;width:24px;height:280px;border-radius:12px;background:#e5484d;transform-origin:50% 100%");
  const thLab = E.el(S.el, "abs", `left:840px;top:910px;width:220px;text-align:center;font-weight:900;font-size:40px;color:${C.ink};z-index:5`, "AIR");
  const mk = [[0, .8], [RUN, .8], [SPLASH + .1, .8], [SPLASH + .9, .06, "in"]];
  E.K(merc, "sy", mk);
  E.F(t => {
    const cold = t >= SPLASH + .1;
    const c = cold ? "#4aa3ff" : "#e5484d"; merc.style.background = c; bulb.style.background = c;
    const s = cold ? "WATER" : "AIR"; if (thLab.textContent !== s) thLab.textContent = s;
    th.style.transform = cold && t < OUT + .8 ? `rotate(${Math.sin(t * 60) * 3}deg)` : "none";
  });
  E.K(th, "s", [[SPLASH + .1, 1], [SPLASH + .25, 1.25, "out"], [SPLASH + .6, 1, "io"]]);

  // ---------------- the locals under the parasol ----------------
  const LS = .52, LW = 846 * LS, LH = 910 * LS;
  const loc = E.el(S.el, "abs", `left:-10px;top:${1760 - LH}px;width:${LW}px;height:${LH}px;z-index:2`);
  E.img(loc, "locals", `width:${LW}px;height:${LH}px`);
  const sip = []; for (let t = 0; t < DUR; t += 1.6) sip.push([t, 0, "io"], [t + .8, -5, "io"]);
  E.K(loc, "y", sip);

  // ---------------- Buck ----------------
  const BS = .72;
  const run = E.el(S.el, "abs", `left:470px;top:${1860 - 1013 * BS}px;width:${769 * BS}px;height:${1013 * BS}px;z-index:3;transform-origin:50% 100%`);
  E.img(run, "b_swim", `width:${769 * BS}px;height:${1013 * BS}px`);
  E.K(run, "x", [[0, -520], [.9, 0, "out"], [RUN, 0], [SPLASH, 180, "in"]]);
  E.K(run, "y", [[RUN, 0], [SPLASH, SHORE - 1860 + 30, "in"]]);
  E.K(run, "s", [[RUN, 1], [SPLASH, .34, "in"]]);
  E.K(run, "o", [[SPLASH - .02, 1], [SPLASH, 0]]);
  E.F(t => { run.firstChild.style.transform = `translateY(${-Math.abs(Math.sin(t * 9)) * 16}px)`; });
  // the splash at the shoreline
  for (let i = 0; i < 9; i++) {
    const d = E.el(S.el, "abs", `left:${690 + (i % 3) * 20}px;top:${SHORE - 40}px;width:${26 + (i % 3) * 8}px;height:${26 + (i % 3) * 8}px;border-radius:50%;background:#e8f7ff;z-index:3;opacity:0`);
    const a = (i / 8) * Math.PI;
    E.K(d, "o", [[SPLASH, 0], [SPLASH + .02, 1], [SPLASH + .6, 0]]);
    E.K(d, "x", [[SPLASH, 0], [SPLASH + .6, Math.cos(a) * 220]]); E.K(d, "y", [[SPLASH, 0], [SPLASH + .3, -Math.sin(a) * 260, "out"], [SPLASH + .6, -Math.sin(a) * 120, "in"]]);
  }
  E.clip(SPLASH - .05, "sfx/splash.wav", { vol: .9 });
  // he comes back: frozen, stiff, sliding out of the sea toward us
  const FS = .64, FW = 444 * FS, FH = 1064 * FS;
  const fz = E.el(S.el, "abs", `left:${700 - FW / 2}px;top:${1840 - FH}px;width:${FW}px;height:${FH}px;z-index:3;transform-origin:50% 100%;opacity:0`);
  const fzi = E.el(fz, "abs", "inset:0;transform-origin:50% 100%");
  E.img(fzi, "b_frozen", `width:${FW}px;height:${FH}px`);
  E.K(fz, "o", [[OUT - .01, 0], [OUT, 1]]);
  E.K(fz, "y", [[OUT, SHORE - 1840 + 20], [OUT + .7, 0, "out"]]);
  E.K(fz, "s", [[OUT, .34], [OUT + .7, 1, "out"]]);
  E.K(fz, "x", [[OUT, 0], [OUT + .7, 0, "out"]]);
  E.K(fz, "r", [[FALL, 0], [FALL + .45, -82, "in"], [FALL + .55, -76, "out"], [FALL + .65, -82, "in"]]);
  E.F(t => { fzi.style.transform = t >= OUT + .7 && t < FALL ? `translateX(${Math.sin(t * 80) * 3}px)` : "none"; });   // shivering
  E.clip(OUT + .3, "sfx/ice-freeze.wav", { vol: .9 });
  E.flash(OUT + .6, "#bfe8ff", .45, .3);
  // a small wave rolls up to his feet — and he topples like a plank
  const wave = E.el(S.el, "abs", `left:0;top:${SHORE}px;width:1080px;height:40px;background:linear-gradient(180deg,rgba(108,198,236,.9),rgba(232,247,255,.75));border-radius:0 0 50% 40%;transform-origin:50% 0;z-index:1;opacity:0`);
  E.K(wave, "o", [[WAVE - .01, 0], [WAVE, 1], [WAVE + 1.2, 1], [WAVE + 1.5, 0]]);
  E.K(wave, "sy", [[WAVE, 1], [WAVE + .45, 15.5, "out"], [WAVE + 1.2, 12], [WAVE + 1.5, 1, "in"]]);
  E.clip(WAVE - .1, "sfx/splash.wav", { vol: .45, to: .7 });
  E.S(FALL + .45, "slam", .9); E.shake(FALL + .45, 16, .3);

  // ---------------- ambience ----------------
  for (let t = 0; t < DUR - .5; t += 2.9) E.clip(t, "sfx/waves-seagulls.wav", { vol: .35, duck: false });

  // ---------------- bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${typeof tail === "number" ? tail + "px" : tail === "l" ? "15%" : "85%"} 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 70 : 58}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `${typeof tail === "number" ? `left:${tail}px` : tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    E.S(t0 + .02, "pop", .6);
    return b;
  };
  bubble("Beach day!!", 420, 800, 400, 150, .9, RUN + .2, true);
  bubble("Tourist.", 60, 1000, 330, 150, OUT + 1.3, OUT + 2.9, true);
  bubble("Welcome to the Atlantic.", 40, 960, 560, 150, OUT + 3.0, WAVE);
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.amberD};color:#fff;font-weight:900;font-size:52px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7`, "OCTOBER · SUNNY ☀");
  const sb = E.el(S.el, "abs", "left:60px;top:1000px;width:960px;display:flex;justify-content:center;z-index:9");
  const st = E.stamp(sb, "ATLANTIC 1 · TOURIST 0", SCORE, { size: 80, rot: -5, shake: 14 });
  st.style.alignSelf = "center"; E.until(st, DUR, .1);
  E.S(SCORE + .4, "ding", .6);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "The Atlantic in *October*", { size: 62, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[13.4, 1], [13.65, 1.18, "out"], [14.0, 1, "io"]]);
}
