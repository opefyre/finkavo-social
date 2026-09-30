// EP.100 "Following the GPS in Lisbon" — Buck, smug, hotel 4 minutes away: "Easy. Who needs a map when you have a GPS?" The GPS: "Continue
// straight." The route leads DOWN a staircase (the car is wider than the steps): "That's… stairs?" STAIRS: 27. The alley narrows: STREET 1.8 m ·
// CAR 1.9 m, mirrors fold, stone scrapes. "Recalculating." A neighbour at her window, with coffee: "Ah. The GPS. You are the third one this
// week." A whistle — four neighbours arrive, lift the car, spin it round: "One, two, three… UP!" The old man on his chair: "Son… that street
// was built for donkeys." "But the GPS said 'fastest route'!" "For the donkey." (hee-haw)
export const meta = {
  id: "ep100-gps", date: "2027-01-01",
  images: {
    bg: "characters/scenes/bg_alley.webp", c1: "characters/cutouts/car-gps_smug.webp", c2: "characters/cutouts/car-gps_panic.webp", c3: "characters/cutouts/car-gps_squeeze.webp",
    lift: "characters/cutouts/car-gps_lift.webp", nb: "characters/cutouts/neighbour_window.webp", om: "characters/cutouts/oldman_seated.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 50, seed: 1001, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [2, 5, 9]] });
  const DUR = 25.2, GPS0 = .3, EASY = 1.3, STRAIGHT = 3.7, TIP = 4.2, STAIRS = 4.7, ROLL = 5.4, LAND = 7.2, RECALC = 7.6, NEIGH = 8.7, THIRD = 8.9, WHISTLE = 12.4,
    SWAP = 13.0, UPS = 13.2, LIFT = 15.2, SETD = 16.5, DONK = 16.9, FAST = 19.6, FORD = 22.0, STAMP = 23.3;
  const S = E.scene("gps", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });

  // ---- the alley (shakes while the car goes down the steps)
  const bgw = E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1930px");
  E.img(bgw, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  const sh = []; for (let t = TIP; t < ROLL + .2; t += .11) sh.push([t, (Math.round(t * 9) % 2) ? -7 : 5]); sh.push([ROLL + .3, 0]); E.K(bgw, "y", sh);

  // ---- the old man on his chair, far back in the alley (behind the car)
  const om = E.el(S.el, "abs", `left:700px;top:${1345 - 1006 * .38}px;width:${462 * .38}px;height:${1006 * .38}px;z-index:4;transform-origin:50% 100%`); E.img(om, "om", `width:${462 * .38}px;height:${1006 * .38}px`);
  show(om, [[LAND - .2, DUR]]); E.pop(om, LAND - .2, { from: .6, dur: .3 });

  // ---- the car: one wrapper, poses swapped by opacity
  const CW = 934, CH = 704;
  const car = E.el(S.el, "abs", `left:73px;top:${1800 - CH}px;width:${CW}px;height:${CH}px;z-index:5;transform-origin:50% 100%`);
  const CARS = ["c1", "c2", "c3"].map(n => E.img(car, n, `position:absolute;left:0;top:0;width:${CW}px;height:${CH}px;opacity:0`));
  E.F(t => {
    const k = t < TIP + .3 ? 0 : t < LAND ? 1 : t < SWAP ? 2 : t < SETD ? -1 : t < FAST - .1 ? 2 : t < FORD - .2 ? 1 : 2;
    CARS.forEach((c, i) => { c.style.opacity = i === k ? 1 : 0; });
  });
  const base = t => t < TIP ? -700 : t < ROLL ? -700 + 230 * (t - TIP) / (ROLL - TIP) : t < LAND ? -470 + 470 * Math.pow((t - ROLL) / (LAND - ROLL), 1.6) : 0;
  const bs = t => t < TIP ? .26 : t < ROLL ? .26 + .1 * (t - TIP) / (ROLL - TIP) : t < LAND ? .36 + .54 * Math.pow((t - ROLL) / (LAND - ROLL), 1.6) : .9;
  const ky = [], ks = [], kx = [];
  for (let t = 0; t < TIP; t += .5) ky.push([t, -700 + ((t / .5) % 2 ? -3 : 3), "io"]);
  for (let t = TIP; t < ROLL; t += .11) ky.push([t, base(t) + ((Math.round(t * 9) % 2) ? -16 : 0), "lin"]);
  for (let t = ROLL; t <= LAND + .01; t += .2) ky.push([t, base(Math.min(t, LAND)), "lin"]);
  [[0, .26], [TIP, .26], [ROLL, .36, "lin"]].forEach(k => ks.push(k));
  for (let t = ROLL + .2; t <= LAND + .01; t += .2) ks.push([t, bs(Math.min(t, LAND)), "lin"]);
  E.K(car, "y", ky); E.K(car, "s", ks);
  for (let t = LAND; t < LAND + 1.5; t += .09) kx.push([t, (Math.round(t * 11) % 2) ? 4 : -4]); kx.push([LAND + 1.6, 0]); E.K(car, "x", kx);   // scraping
  // the lifted car (+ four neighbours), spun round, then set down
  const LW = 993, LH = 748;
  const lift = E.el(S.el, "abs", `left:43px;top:${1800 - LH}px;width:${LW}px;height:${LH}px;z-index:5;transform-origin:50% 100%`); E.img(lift, "lift", `width:${LW}px;height:${LH}px`);
  show(lift, [[SWAP, SETD]]); E.pop(lift, SWAP, { from: .8, dur: .25 });
  E.K(lift, "y", [[SWAP, 0], [LIFT, 0], [LIFT + .3, -50, "out"], [LIFT + .6, -50], [SETD - .3, -50], [SETD, 0, "in"]]);
  E.K(lift, "sx", [[LIFT + .3, 1], [LIFT + .65, .02, "io"], [LIFT + 1.0, 1, "io"]]);                                                // the spin
  const puff = E.el(S.el, "abs", "left:140px;top:1300px;width:800px;height:500px;border-radius:50%;background:radial-gradient(#fff 0,rgba(255,255,255,.7) 40%,transparent 70%);z-index:9;opacity:0");
  E.K(puff, "o", [[SWAP - .05, 0], [SWAP, .95], [SWAP + .35, 0]]); E.K(puff, "s", [[SWAP - .05, .6], [SWAP + .35, 1.3, "out"]]);
  // sparks where the mirrors scrape the walls
  ["left:96px;top:1500px", "left:900px;top:1500px"].forEach(p => { const sp = E.el(S.el, "abs", `${p};font-size:70px;z-index:7;opacity:0`, "✨"); E.F(t => { sp.style.opacity = t >= LAND && t < LAND + 1.4 && Math.floor(t * 12) % 2 ? 1 : 0; }); });
  // BUMP pops while it rattles down the stairs
  [[4.5, 360, 1000], [4.78, 620, 1060], [5.05, 330, 1120], [5.3, 650, 1190]].forEach(([t, x, y]) => {
    const b = E.el(S.el, "abs", `left:${x}px;top:${y}px;font-weight:900;font-size:54px;color:${C.coralD};z-index:7;opacity:0;-webkit-text-stroke:2px #fff`, "BUMP!");
    E.K(b, "o", [[t - .01, 0], [t, 1], [t + .35, 1], [t + .4, 0]]); E.pop(b, t, { from: .4, dur: .15 });
  });

  // ---- the neighbour at her window (upper left)
  const nb = E.el(S.el, "abs", "left:0;top:560px;width:330px;height:436px;z-index:6"); E.img(nb, "nb", "width:330px;height:436px");
  show(nb, [[NEIGH, DUR]]); E.pop(nb, NEIGH, { from: .6, dur: .3 });
  const whis = E.el(S.el, "abs", "left:760px;top:880px;font-size:64px;z-index:7;opacity:0", "🎶"); show(whis, [[WHISTLE, WHISTLE + .7]]);

  // ---- the phone (GPS) at the upper right
  const ph = E.el(S.el, "abs", "left:722px;top:440px;width:300px;height:300px;border-radius:32px;background:#1d2b36;padding:12px;box-sizing:border-box;z-index:6;box-shadow:0 12px 26px rgba(0,0,0,.35)");
  const map = E.el(ph, "", "position:relative;width:100%;height:100%;border-radius:22px;background:#e6efdf;overflow:hidden");
  E.el(map, "abs", "left:-20px;top:120px;width:340px;height:26px;background:#fff;transform:rotate(-12deg)"); E.el(map, "abs", "left:120px;top:-20px;width:24px;height:340px;background:#fff;transform:rotate(8deg)");
  E.el(map, "abs", "left:180px;top:150px;width:150px;height:22px;background:#fff;transform:rotate(30deg)");
  const steps = E.el(map, "abs", "left:118px;top:92px;width:40px;height:70px;background:repeating-linear-gradient(0deg,#b98 0 5px,#fff 5px 10px);border:2px solid #a77;transform:rotate(8deg)");
  const route = E.el(map, "abs", "left:132px;top:150px;width:12px;height:150px;background:#2b6fe6;border-radius:6px;transform:rotate(8deg)");
  const dot = E.el(map, "abs", "left:123px;top:258px;width:30px;height:30px;border-radius:50%;background:#2b6fe6;border:5px solid #fff;box-shadow:0 0 0 8px rgba(43,111,230,.3)");
  E.K(dot, "y", [[0, 0], [TIP, 0], [LAND - .2, -110, "in"]]); E.K(dot, "s", [[0, 1], [.4, 1.2, "io"], [.8, 1, "io"], [1.2, 1.2, "io"], [1.6, 1, "io"]]);
  E.el(map, "abs", "left:116px;top:62px;font-size:40px", "📍");
  const ban = E.el(ph, "abs", "left:12px;top:12px;width:276px;background:#1f6b5c;color:#fff;font-weight:900;font-size:25px;padding:6px 12px;box-sizing:border-box;border-radius:18px 18px 0 0;white-space:nowrap", "");
  const PT = [[0, "↑ Fastest route"], [STRAIGHT, "↑ Continue 2 m"], [RECALC, "↻ Recalculating…"], [SWAP, "↩ U-turn"], [DONK - .2, "✓ Fastest route"]];
  E.F(t => { const s = at(PT, t); if (ban.textContent !== s) ban.textContent = s; ban.style.background = t >= RECALC && t < DONK - .2 ? C.coralD : "#1f6b5c"; });

  // ---- pill counter
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "HOTEL: 4 MIN AWAY"], [TIP, "STAIRS: 1"], [LAND, "STREET 1.8 m · CAR 1.9 m"], [THIRD, "THIRD THIS WEEK: YOU"], [SWAP, "LIFTING: 4 NEIGHBOURS"], [DONK, "FASTEST ROUTE: ???"], [FORD, "FASTEST ROUTE: DONKEY"]];
  E.F(t => {
    let s = at(P, t); if (t >= TIP && t < LAND) s = `STAIRS: ${Math.min(27, 1 + Math.floor((t - TIP) * 9))}`;
    if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= TIP ? C.coralD : C.ink; pill.style.fontSize = s.length > 22 ? "42px" : "50px";
  });
  P.slice(2).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48, bg = "#fff") => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:${bg};border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:${bg};transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const G = (h, t0, t1, fs = 38, w = 370) => bubble(`🗣 ${h}`, 330, 470, w, w - 40, t0, t1, fs, "#e3efff");
  G("Starting route.", GPS0, EASY + .2, 42, 340);
  bubble("Easy. Who needs a map when you have a GPS?", 120, 760, 600, 300, EASY, STRAIGHT - .05, 42);
  G("Continue straight for two metres.", STRAIGHT, STAIRS + 1.4, 34, 390);
  bubble("That's… stairs?!", 140, 830, 440, 300, STAIRS, ROLL + 1.3, 54);
  G("Recalculating…", RECALC, RECALC + 1.3, 40, 350);
  bubble("Ah. The GPS. You are the third one this week.", 340, 600, 640, 90, THIRD, WHISTLE - .05, 44);
  bubble("One, two, three… UP!", 40, 960, 460, 260, UPS, SETD - .3, 46);
  bubble("Son… that street was built for donkeys.", 470, 780, 580, 330, DONK, FAST - .05, 44);
  bubble("But the GPS said “fastest route”!", 100, 1030, 580, 480, FAST, FORD - .05, 44);
  bubble("For the donkey.", 560, 780, 440, 240, FORD, STAMP + .3, 50);
  const sb = E.el(S.el, "abs", "left:30px;top:1020px;width:1020px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "FASTEST ROUTE: DONKEY.", STAMP, { size: 76, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/street-sunny.wav", { vol: .3, duck: false, to: DUR });
  E.clip(GPS0, "voices/ep100/g_start.wav", { vol: 1.1 });
  E.clip(EASY, "voices/ep100/b_easy.wav", { vol: 1.2 });
  E.clip(STRAIGHT, "voices/ep100/g_straight.wav", { vol: 1.1 });
  for (let t = TIP; t < ROLL; t += .22) E.S(t, "thud", .35);
  E.clip(STAIRS, "voices/ep100/b_stairs.wav", { vol: 1.3 });
  E.clip(ROLL, "sfx/car-speed.wav", { vol: .4, to: 2 });
  E.clip(LAND, "sfx/elx-car-scrape.wav", { vol: .85, to: 1.6 }); E.S(LAND, "thud", .6);
  E.clip(RECALC, "voices/ep100/g_recalc.wav", { vol: 1.1 });
  E.clip(THIRD, "voices/ep100/n_third.wav", { vol: 1.3 });
  E.clip(WHISTLE, "sfx/whistle.wav", { vol: .9, to: .9 }); E.S(SWAP, "poof", .55); E.S(SWAP + .05, "whoosh", .4);
  E.clip(UPS, "voices/ep100/h_up.wav", { vol: 1.35 });
  E.clip(LIFT - .05, "sfx/elx-old-grunts.wav", { vol: .8, to: 1.5 }); E.S(LIFT + .3, "whoosh", .45);
  E.S(SETD, "thud", .6);
  E.clip(DONK, "voices/ep100/o_donkeys.wav", { vol: 1.3 });
  E.clip(FAST, "voices/ep100/b_fastest.wav", { vol: 1.25 });
  E.clip(FORD, "voices/ep100/o_fordonkey.wav", { vol: 1.35 });
  E.clip(STAMP - .1, "sfx/elx-donkey.wav", { vol: .8, to: 2.2 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Following the GPS in *Lisbon*", { size: 50, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[24.4, 1], [24.65, 1.18, "out"], [25.0, 1, "io"]]);
}
