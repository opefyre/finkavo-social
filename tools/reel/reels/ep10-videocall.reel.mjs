// EP.10 "Video call with grandma" — the screen IS the call. Ceiling, forehead, nostrils, ear (she holds it like a phone), her
// thumb… then the perfect frame at last — and the call freezes on the worst frame. It reconnects: forehead again. Loops.
// Otto reacts in the little self-view window. Universal joke. Stands alone for strangers: no series numbering, no "follow" line.
export const meta = {
  id: "ep10-videocall", date: "2026-10-03",
  images: {
    v_forehead: "characters/scenes/call_forehead.webp", v_nostrils: "characters/scenes/call_nostrils.webp",
    v_ear: "characters/scenes/call_ear.webp", v_portrait: "characters/scenes/call_portrait.webp",
    o_excited: "characters/cutouts/otto-casual_excited.webp", o_betrayed: "characters/cutouts/otto-casual_betrayed.webp",
    o_panic: "characters/cutouts/otto-phone_panic.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 57, seed: 101, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 10.8;
  const S = E.scene("call", 0, DUR, "dark"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const F1 = 1.1, F2 = 2.3, F3 = 3.5, F4 = 4.7, F5 = 5.8, FREEZE = 7.2, RECON = 8.7;
  const feedAt = [[0, "ceiling"], [F1, "forehead"], [F2, "nostrils"], [F3, "ear"], [F4, "thumb"], [F5, "portrait"], [FREEZE, "nostrils"], [RECON, "forehead"]];

  // ---------------- the feed (full screen) ----------------
  const feed = E.el(S.el, "abs", "left:-40px;top:-40px;width:1160px;height:2000px;overflow:hidden;background:#f3ead9");
  const cam = E.el(feed, "abs", "inset:0;transform-origin:50% 50%");
  const ceiling = E.el(cam, "abs", "inset:0;background:linear-gradient(180deg,#efe6d4,#e2d6bf)");
  E.el(ceiling, "abs", "left:330px;top:700px;width:500px;height:170px;border-radius:50%;background:#fbf6ea;box-shadow:0 0 90px 30px rgba(255,248,220,.9)");
  E.el(ceiling, "abs", "left:540px;top:760px;width:80px;height:40px;border-radius:50%;background:#d9cdb5");
  const pic = n => E.img(cam, n, "position:absolute;left:0;top:0;width:1160px;height:2073px;object-fit:cover;opacity:0");
  const P = { forehead: pic("v_forehead"), nostrils: pic("v_nostrils"), ear: pic("v_ear"), portrait: pic("v_portrait") };
  // her thumb over the lens: a blurred, glowing pink blob with a hint of a fingerprint
  const thumb = E.el(cam, "abs", "left:-200px;top:300px;width:1300px;height:1500px;border-radius:48%;background:radial-gradient(circle at 45% 45%,#ffc2a8,#e98a74 60%,#8f4c42);filter:blur(18px);opacity:0");
  const print = E.el(cam, "abs", "left:180px;top:560px;width:700px;height:900px;border-radius:50%;background:repeating-radial-gradient(circle at 50% 50%,rgba(150,70,60,.18) 0 10px,transparent 10px 26px);filter:blur(3px);opacity:0");
  E.F(t => {
    const f = at(feedAt, t);
    ceiling.style.opacity = f === "ceiling" ? 1 : 0;
    for (const k in P) P[k].style.opacity = (f === k || (f === "thumb" && k === "portrait")) ? 1 : 0;
    thumb.style.opacity = print.style.opacity = f === "thumb" ? 1 : 0;
    P.portrait.style.filter = f === "thumb" ? "blur(14px)" : t >= FREEZE && t < RECON ? "none" : "none";
    // hand-held wobble — except when frozen
    const live = !(t >= FREEZE && t < RECON);
    const k = f === "portrait" ? .3 : 1;
    cam.style.transform = live ? `translate(${Math.sin(t * 3.1) * 14 * k}px,${Math.cos(t * 2.3) * 18 * k}px) rotate(${Math.sin(t * 1.7) * 2.2 * k}deg) scale(1.04)` : "scale(1.04)";
    cam.style.filter = t >= FREEZE + .25 && t < RECON ? "blur(7px) saturate(.75)" : "none";
  });
  // blocky "bad connection" overlay while frozen
  const blocks = E.el(S.el, "abs", "inset:0;opacity:0;background-image:linear-gradient(rgba(0,0,0,.08) 2px,transparent 2px),linear-gradient(90deg,rgba(0,0,0,.08) 2px,transparent 2px);background-size:48px 48px");
  E.K(blocks, "o", [[FREEZE + .25, 0], [FREEZE + .3, 1], [RECON - .01, 1], [RECON, 0]]);
  const poor = E.el(S.el, "abs", "left:290px;top:880px;width:500px;display:flex;flex-direction:column;align-items:center;gap:22px;opacity:0;z-index:5");
  const spin = E.el(poor, "", "width:110px;height:110px;border-radius:50%;border:14px solid rgba(255,255,255,.35);border-top-color:#fff");
  E.el(poor, "", "background:rgba(0,0,0,.72);color:#fff;font-weight:900;font-size:50px;padding:.14em .5em .18em;border-radius:.4em;white-space:nowrap", "Poor connection");
  E.K(poor, "o", [[FREEZE + .3, 0], [FREEZE + .4, 1], [RECON - .05, 1], [RECON, 0]]);
  E.F(t => { spin.style.transform = `rotate(${t * 420}deg)`; });

  // cuts between framings: a swish and a tiny jolt
  [F1, F2, F3, F4, F5, RECON].forEach(t => { E.S(t - .02, "swish", .7); E.shake(t, 10, .18); });
  E.S(F5, "sparkle", .9); E.S(F5 + .05, "ding", .6);
  E.S(FREEZE + .25, "scratch", .8); E.S(FREEZE + .4, "nope", .7);

  // ---------------- call chrome ----------------
  const shade = E.el(S.el, "abs", "left:0;top:0;width:1080px;height:520px;background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,0))");
  const namePill = E.el(S.el, "abs", "left:100px;top:352px;display:flex;align-items:center;gap:16px;background:rgba(0,0,0,.55);color:#fff;font-weight:900;font-size:50px;padding:.1em .45em .12em .2em;border-radius:.4em;white-space:nowrap;z-index:6");
  E.el(namePill, "", "width:26px;height:26px;border-radius:50%;background:#35d07f");
  const timer = E.el(namePill, "", "", "GRANDMA · 00:01");
  E.F(t => {
    const s = Math.floor(t < FREEZE ? t : t < RECON ? FREEZE : t - (RECON - FREEZE)) + 1;
    const str = `GRANDMA · 00:${String(s).padStart(2, "0")}`; if (timer.textContent !== str) timer.textContent = str;
  });
  // bottom buttons: mic, camera, red hang-up
  const bar = E.el(S.el, "abs", "left:190px;top:1560px;width:700px;display:flex;justify-content:space-between;z-index:6");
  const btn = (bg, inner) => E.el(bar, "", `width:150px;height:150px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center`, inner);
  btn("rgba(255,255,255,.28)", `<div style="width:34px;height:60px;border-radius:17px;border:9px solid #fff"></div>`);
  btn("rgba(255,255,255,.28)", `<div style="width:66px;height:46px;border-radius:10px;border:9px solid #fff"></div>`);
  btn("#e5484d", `<div style="width:78px;height:30px;border-radius:15px;background:#fff;transform:rotate(-12deg)"></div>`);

  // self-view: Otto's reactions
  const pip = E.el(S.el, "abs", "left:800px;top:430px;width:220px;height:296px;border-radius:26px;overflow:hidden;border:6px solid rgba(255,255,255,.9);box-shadow:0 12px 30px rgba(0,0,0,.35);background:#f4e4c1;z-index:6");
  const OT = ["o_excited", "o_betrayed", "o_panic"];
  const oim = OT.map(n => E.img(pip, n, n === "o_panic"
    ? "position:absolute;left:-100px;top:-8px;width:425px;height:auto;opacity:0"
    : "position:absolute;left:-114px;top:-5px;width:577px;height:auto;opacity:0"));
  const ottoAt = [[0, "o_excited"], [F2, "o_betrayed"], [F5, "o_excited"], [FREEZE + .3, "o_panic"], [RECON, "o_betrayed"]];
  E.F(t => { const f = at(ottoAt, t); oim.forEach((im, i) => { im.style.opacity = OT[i] === f ? 1 : 0; }); });
  E.K(pip, "s", [[F2, 1.12], [F2 + .2, 1, "back"], [FREEZE + .3, 1.12], [FREEZE + .5, 1, "back"]]);

  // ---------------- what she says (call captions) ----------------
  const say = (str, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", "left:100px;top:1250px;width:880px;display:flex;justify-content:center;z-index:7");
    const e = E.el(b, "", `background:#fff;color:${C.ink};font-weight:900;font-size:${big ? 80 : 66}px;line-height:1.04;letter-spacing:-.02em;padding:.18em .5em .22em;border-radius:.42em;box-shadow:0 12px 30px rgba(0,0,0,.3);text-align:center`, str);
    E.pop(b, t0, { from: .4, dur: .26 });
    E.K(b, "o", [[t0, 0], [t0 + .06, 1], [t1 - .08, 1], [t1, 0]]);
    E.S(t0 + .02, "pop", .6);
  };
  say("Can you see me?", .25, F1);
  say("Is it on?", F1 + .1, F2);
  say("Hello??", F2 + .1, F3, true);
  say("HELLO??", F3 + .1, F4, true);
  say("Your cousin set this up.", F4 + .1, F5);
  say("Ah! There you are!", F5 + .1, FREEZE);
  say("Can you see me?", RECON + .1, 10.4);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Video call with *grandma*", { size: 60, lh: 1.04, instant: true, id: "hook", nowrap: true, color: "#fff" });

  E.finish(DUR);
  E.K(E.logo, "s", [[10.0, 1], [10.25, 1.18, "out"], [10.6, 1, "io"]]);
}
