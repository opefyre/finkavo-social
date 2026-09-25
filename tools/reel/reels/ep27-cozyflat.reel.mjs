// EP.27 "The 'cozy' flat" — a listing: COZY · BRIGHT · CENTRAL. The landlord gives the tour: "Cozy: the bed is in the KITCHEN."
// "Bright: one bulb. Very modern." "Central: the nightclub is downstairs!" (the floor thumps, disco light through the boards).
// "Fourteen hundred a month. Deposit… a kidney." Voiced (ElevenLabs, branding/voices/ep27) with real effects. Paced per reel-pacing.
export const meta = {
  id: "ep27-cozyflat", date: "2026-10-20",
  images: {
    r_present: "characters/cutouts/renda_present.webp", r_smug: "characters/cutouts/renda_smug.webp", r_evil: "characters/cutouts/renda_evil-grin.webp",
    o_excited: "characters/cutouts/otto-casual_excited.webp", o_betrayed: "characters/cutouts/otto-casual_betrayed.webp", o_awk: "characters/cutouts/otto-casual_awkward.webp",
    bed: "characters/props/bed.webp", stove: "characters/props/stove.webp", bulb: "characters/props/bulb.webp", disco: "characters/props/discoball.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 57, seed: 271, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [5, 9, 12]] });
  const DUR = 15.6;
  const S = E.scene("flat", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FLOOR = 1760;
  const WELCOME = .4, COZY = 3.5, BRIGHT = 6.1, CENTRAL = 8.6, PRICE = 11.2;

  // ---------------- the tiny flat ----------------
  const room = E.el(S.el, "abs", "inset:0");
  E.el(room, "abs", "left:-40px;top:-40px;width:1160px;height:2000px;background:#e8e2d6");
  E.el(room, "abs", "left:-40px;top:-40px;width:1160px;height:2000px;background-image:linear-gradient(rgba(0,0,0,.04) 2px,transparent 2px);background-size:100% 80px");
  E.el(room, "abs", "left:620px;top:780px;width:70px;height:220px;background:rgba(120,110,90,.18);border-radius:40px 10px 30px 10px");    // a damp stain
  const floor = E.el(room, "abs", `left:-40px;top:${FLOOR}px;width:1160px;height:300px;background:#a8764c;background-image:repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 4px,transparent 4px 110px)`);
  // disco light leaking through the floorboards (central)
  const leak = E.el(room, "abs", `left:-40px;top:${FLOOR}px;width:1160px;height:300px;opacity:0;mix-blend-mode:screen`);
  E.F(t => {
    const on = t >= CENTRAL;
    leak.style.opacity = on ? 1 : 0;
    if (on) { const h = Math.floor(t * 6) % 3; leak.style.background = `repeating-linear-gradient(90deg,transparent 0 100px,${["#ff3bd4", "#3bd4ff", "#ffe23b"][h]} 100px 110px)`; }
  });
  // the stove and the bed side by side: "cozy"
  const stove = E.el(room, "abs", `left:560px;top:${FLOOR + 60 - 231 * 1.5}px;width:${211 * 1.5}px;height:${231 * 1.5}px;z-index:3;opacity:0`);
  E.img(stove, "stove", `width:${211 * 1.6}px;height:${231 * 1.6}px`);
  const bed = E.el(room, "abs", `left:200px;top:${FLOOR + 70 - 195 * 1.35}px;width:${295 * 1.35}px;height:${195 * 1.35}px;z-index:3;opacity:0`);
  E.img(bed, "bed", `width:${295 * 1.35}px;height:${195 * 1.35}px`);
  for (const [el, t] of [[stove, COZY + .4], [bed, COZY + .8]]) { E.K(el, "o", [[t - .01, 0], [t, 1]]); E.K(el, "y", [[t, -600], [t + .3, 0, "in"]]); E.S(t + .3, "thud", .8); }
  // the bulb: "bright"
  E.el(room, "abs", "left:538px;top:430px;width:4px;height:120px;background:#333;z-index:3");
  const bulbWrap = E.el(room, "abs", "left:484px;top:420px;width:112px;height:224px;transform-origin:50% 0;z-index:3");
  E.img(bulbWrap, "bulb", "width:112px;height:224px");
  E.F(t => { bulbWrap.style.transform = `rotate(${t >= BRIGHT ? Math.sin((t - BRIGHT) * 3.2) * 14 * Math.exp(-(t - BRIGHT) * .15) : Math.sin(t * 2) * 2}deg)`; });
  const dark = E.el(S.el, "abs", "inset:0;background:radial-gradient(circle at 540px 600px,rgba(255,240,180,0) 0 140px,rgba(20,20,40,.42) 560px);opacity:0;z-index:4;pointer-events:none");
  E.K(dark, "o", [[BRIGHT, 0], [BRIGHT + .2, 1]]);
  E.S(BRIGHT, "tick", 1);
  // the disco ball rising through a hole? No: hanging from the ceiling, dropped in at "central"
  const disco = E.el(room, "abs", "left:830px;top:-300px;width:200px;height:240px;z-index:3");
  E.img(disco, "disco", "width:200px;height:240px");
  E.K(disco, "y", [[CENTRAL + .3, 0], [CENTRAL + .8, 940, "back"]]);
  E.K(disco, "r", [[CENTRAL, 0], [DUR, 400]]);

  // ---------------- the landlord and Otto ----------------
  const RS = .86;
  const ren = E.el(room, "abs", `left:380px;top:${FLOOR + 14 - 1035 * RS}px;width:${823 * RS}px;height:${1035 * RS}px;z-index:2`);
  const RT = [["r_present", 823], ["r_smug", 672], ["r_evil", 672]];
  const rim = RT.map(([n, w]) => E.img(ren, n, `position:absolute;bottom:0;left:${n === "r_present" ? 0 : 75 * RS}px;width:${w * RS}px;height:${1030 * RS}px`));
  E.F(t => { const f = at([[0, "r_present"], [COZY + 1.4, "r_smug"], [BRIGHT, "r_present"], [BRIGHT + 1.2, "r_smug"], [CENTRAL, "r_present"], [PRICE, "r_evil"]], t); rim.forEach((im, i) => { im.style.opacity = RT[i][0] === f ? 1 : 0; }); });
  const OS = .92;
  const otto = E.el(room, "abs", `left:-30px;top:${FLOOR + 14 - 1078 * OS}px;width:${625 * OS}px;height:${1078 * OS}px;z-index:2`);
  const OT = ["o_excited", "o_betrayed", "o_awk"];
  const oim = OT.map(n => E.img(otto, n, `position:absolute;left:0;bottom:0;width:${(n === "o_awk" ? 488 : 625) * OS}px;height:${1078 * OS}px`));
  E.F(t => {
    const f = at([[0, "o_excited"], [COZY + 1.2, "o_awk"], [BRIGHT + .5, "o_betrayed"], [CENTRAL + .8, "o_awk"], [PRICE + 1.2, "o_betrayed"]], t); oim.forEach((im, i) => { im.style.opacity = OT[i] === f ? 1 : 0; });
    // the whole room thumps with the club below
    room.style.transform = t >= CENTRAL ? `translateY(${(Math.floor((t - CENTRAL) * 4) % 2 ? 0 : -6)}px)` : "none";
  });

  // ---------------- the listing card (frame 0) ----------------
  const card = E.el(S.el, "abs", "left:40px;top:420px;width:470px;height:360px;border-radius:26px;background:#fff;box-shadow:0 16px 40px rgba(0,0,0,.22);overflow:hidden;z-index:6");
  const photo = E.el(card, "abs", "left:0;top:0;width:470px;height:190px;background:linear-gradient(180deg,#bfe4ff,#fff7df 70%,#e9d1ad 70%)");
  E.el(photo, "abs", "left:70px;top:20px;width:320px;height:110px;border:10px solid #fff;background:linear-gradient(180deg,#8fd6f5,#2f9bd6)");        // a big sea-view window (not in this flat)
  E.el(photo, "abs", "left:120px;top:140px;width:230px;height:44px;border-radius:14px;background:#f2e6d4;box-shadow:0 8px 0 #d8c7ad");
  E.el(card, "abs", "left:24px;top:200px;font-weight:900;font-size:38px;color:#222", "Lisbon · T0");
  const tags = E.el(card, "abs", "left:24px;top:252px;display:flex;gap:10px");
  ["COZY", "BRIGHT", "CENTRAL"].forEach(tg => E.el(tags, "", `background:${C.mint};color:${C.ink};font-weight:900;font-size:30px;padding:4px 12px;border-radius:10px`, tg));
  const priceEl = E.el(card, "abs", `left:24px;top:300px;font-weight:900;font-size:44px;color:${C.coralD}`, "€ ???");
  E.K(card, "o", [[0, 1], [COZY - .1, 1], [COZY, 0]]);
  E.K(card, "r", [[0, 3], [.5, -2, "io"], [1.2, 2, "io"], [1.9, -1, "io"], [2.6, 1, "io"]]);          // frame-0 motion

  // ---------------- labels for each reveal ----------------
  const label = (str, sub, t0, t1) => {
    const b = E.el(S.el, "abs", "left:100px;top:352px;display:flex;gap:14px;align-items:center;z-index:7;opacity:0");
    E.el(b, "", `background:${C.ink};color:#fff;font-weight:900;font-size:52px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap`, str);
    E.el(b, "", `background:${C.coralD};color:#fff;font-weight:900;font-size:40px;padding:.1em .4em .12em;border-radius:.3em;white-space:nowrap`, sub);
    E.K(b, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); E.K(b, "s", [[t0, .7], [t0 + .25, 1, "back"]]);
    E.S(t0, "ding", .5);
  };
  label("COZY", "bed = kitchen", COZY + .9, BRIGHT);
  label("BRIGHT", "1 bulb", BRIGHT + .3, CENTRAL);
  label("CENTRAL", "club downstairs", CENTRAL + .6, PRICE);
  const sb = E.el(S.el, "abs", "left:60px;top:470px;width:960px;display:flex;justify-content:center;z-index:9");
  const st = E.stamp(sb, "€1,400 / MONTH", PRICE + .4, { size: 100, rot: -5, shake: 14 });
  st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  E.clip(WELCOME, "voices/ep27/r_welcome.wav");
  E.clip(COZY, "voices/ep27/r_cozy.wav");
  E.clip(BRIGHT + .15, "voices/ep27/r_bright.wav");
  E.clip(CENTRAL + .1, "voices/ep27/r_central.wav");
  E.clip(CENTRAL - .1, "sfx/club-bass.wav", { vol: .28, duck: false });
  E.clip(CENTRAL + 2.9, "sfx/club-bass.wav", { vol: .22, duck: false });
  E.clip(CENTRAL + 5.9, "sfx/club-bass.wav", { vol: .18, duck: false, to: 1.1 });
  E.clip(PRICE, "voices/ep27/r_price.wav");

  // ---------------- bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${typeof tail === "number" ? tail + "px" : tail === "l" ? "15%" : "85%"} 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 64 : 54}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `${typeof tail === "number" ? `left:${tail}px` : tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Welcome! Cozy, bright, central!", 530, 440, 520, 250, WELCOME, COZY);
  bubble("Cozy: the bed is in the KITCHEN.", 380, 520, 660, 440, COZY, BRIGHT);
  bubble("Bright: one bulb. Very modern.", 380, 700, 660, 440, BRIGHT + .15, CENTRAL);
  bubble("Central: the nightclub is downstairs!", 380, 700, 660, 440, CENTRAL + .1, PRICE);
  bubble("Deposit… a kidney.", 360, 700, 560, 380, PRICE + 1.3, DUR - .6, true);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "“Cozy” flat in *Lisbon*", { size: 64, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[14.9, 1], [15.15, 1.18, "out"], [15.45, 1, "io"]]);
}
