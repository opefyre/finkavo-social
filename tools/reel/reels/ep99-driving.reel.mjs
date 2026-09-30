// EP.99 "Driving lessons with a Portuguese dad" — the car, seen from the front. Dad, calm teacher: "Okay. Mirrors. Signal. Nice and slow."
// "Okay, Dad." 12 km/h. An old lady with a shopping trolley overtakes them. Dad: "BRAKE! BRAKE! BRAKE!" "Dad. We're doing twelve." Dad,
// praying with a rosary: "Ai, Nossa Senhora!" Next: Dad drives. "Okay. Now watch how a real driver does it." 12 → 130 km/h, the horn, a
// bifana in one hand: "MOVE IT!" The teen, terrified: "Dad… you said 'safety first'." Dad, mouth full: "That's for YOU."
export const meta = {
  id: "ep99-driving", date: "2026-12-31",
  images: {
    bg: "characters/scenes/bg_street.webp", c1: "characters/cutouts/car-lesson_calm.webp", c2: "characters/cutouts/car-lesson_panic.webp",
    c3: "characters/cutouts/car-lesson_pray.webp", c4: "characters/cutouts/car-lesson_dad.webp", gr: "characters/cutouts/oldlady_trolley.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 116, root: 48, seed: 991, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 23.8, SLOW = .3, OK = 5.2, CRAWL = 6.2, OVER = 7.4, BRAKE = 9.2, TWELVE = 10.5, SENH = 12.6, SWAP = 14.2, WATCH = 14.4, FAST = 16.9,
    MOVE = 17.3, SAFETY = 18.3, YOU = 20.7, STAMP = 22.0;
  const S = E.scene("driving", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });

  // the street drifts sideways behind the car: slow, then very fast
  const bgw = E.el(S.el, "abs", "left:0;top:0;width:2160px;height:1930px");
  E.img(bgw, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px"); E.img(bgw, "bg", "position:absolute;left:1080px;top:0;width:1080px;height:1930px");
  E.F(t => {
    const d = t < SWAP ? t * 14 : SWAP * 14 + (t < FAST ? (t - SWAP) * 60 : (FAST - SWAP) * 60 + (t - FAST) * 1500);
    bgw.style.transform = `translateX(${-(d % 1080)}px)`;
    bgw.style.filter = t >= FAST ? "blur(6px)" : "none";
  });
  // speed lines
  const lines = E.el(S.el, "abs", "inset:0;z-index:2;opacity:0;background:repeating-linear-gradient(0deg,transparent 0 60px,rgba(255,255,255,.5) 60px 64px)"); show(lines, [[FAST, DUR]]);
  E.F(t => { lines.style.backgroundPosition = `${-(t * 3000) % 400}px 0`; });
  // the old lady with a shopping trolley overtakes (behind the car)
  const gr = E.el(S.el, "abs", `left:0;top:${1160 - 966 * .5}px;width:${729 * .5}px;height:${966 * .5}px;z-index:3`); E.img(gr, "gr", `width:${729 * .5}px;height:${966 * .5}px;transform:scaleX(-1)`);
  E.K(gr, "x", [[CRAWL, -400], [BRAKE + 1, 1100, "lin"]]); show(gr, [[CRAWL, BRAKE + 1]]);
  const gb = []; for (let t = CRAWL; t < BRAKE + 1; t += .3) gb.push([t, 0, "io"], [t + .15, -8, "io"]); E.K(gr, "y", gb);

  // the car (same 1168×880 canvas for all four)
  const CS = .92, car = E.el(S.el, "abs", `left:3px;top:${1880 - 880 * CS}px;width:${1168 * CS}px;height:${880 * CS}px;z-index:5;transform-origin:50% 100%`);
  const CARS = ["c1", "c2", "c3", "c4"].map(n => E.img(car, n, `position:absolute;left:0;top:0;width:${1168 * CS}px;height:${880 * CS}px;opacity:0`));
  E.F(t => { const k = t < BRAKE ? 0 : t < SENH ? 1 : t < SWAP ? 2 : 3; CARS.forEach((c, i) => { c.style.opacity = i === k ? 1 : 0; }); });
  const bump = []; for (let t = 0; t < SWAP; t += .5) bump.push([t, 0, "io"], [t + .25, -4, "io"]);
  for (let t = FAST; t < DUR; t += .08) bump.push([t, (Math.round(t * 12.5) % 2) ? -10 : 4]); E.K(car, "y", bump);             // frame-0 motion
  const rock = []; for (let t = FAST; t < DUR; t += .16) rock.push([t, (Math.round(t * 6.25) % 2) ? 2.5 : -2.5]); E.K(car, "r", rock);
  const flash = E.el(S.el, "abs", "inset:0;background:#fff;z-index:9;opacity:0"); E.K(flash, "o", [[SWAP - .05, 0], [SWAP, .9], [SWAP + .3, 0]]);

  // the speedometer
  const sp = E.el(S.el, "abs", `left:640px;top:460px;background:#1d2b36;color:#fff;font-weight:900;font-size:60px;padding:6px 22px;border-radius:20px;z-index:9;white-space:nowrap;font-variant-numeric:tabular-nums;border:5px solid #fff;box-shadow:0 8px 20px rgba(0,0,0,.3)`, "");
  E.F(t => {
    let v = t < CRAWL ? Math.min(12, t * 3) : 12;
    if (t >= SWAP) v = t < FAST ? 12 : Math.min(130, 12 + (t - FAST) * 120);
    const s = `${Math.round(v)} km/h`; if (sp.textContent !== s) sp.textContent = s;
    sp.style.background = v > 60 ? C.coralD : "#1d2b36";
  });

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "LESSON 1 · DAD TEACHES"], [OVER, "OVERTAKEN BY: A GRANDMA"], [BRAKE, "DAD: PANICKING"], [SENH, "DAD: PRAYING"], [SWAP, "NEXT DAY · DAD DRIVES"],
    [FAST, "DAD: “A REAL DRIVER”"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= BRAKE ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  const L = (h, t0, t1, fs = 46, w = 470) => bubble(h, 40, 900, w, 300, t0, t1, fs);          // the left seat (Dad, then the teen)
  const R = (h, t0, t1, fs = 46, w = 460) => bubble(h, 1040 - w, 900, w, 140, t0, t1, fs);    // the right seat (the driver)
  L("Okay. Mirrors. Signal. Nice and slow.", SLOW, OK - .05, 44, 480);
  R("Okay, Dad.", OK, CRAWL + .6, 50, 320);
  L("BRAKE! BRAKE! BRAKE!", BRAKE, TWELVE - .05, 50, 470);
  R("Dad. We're doing twelve.", TWELVE, SENH - .05, 46, 420);
  L(`Ai, Nossa Senhora!${sub("(Holy Mother of God!)")}`, SENH, SWAP - .05, 46, 440);
  R("Okay. Now watch how a real driver does it.", WATCH, FAST + .3, 42, 520);
  R("MOVE IT!", MOVE, SAFETY - .05, 60, 320);
  L("Dad… you said “safety first”.", SAFETY, YOU - .05, 44, 460);
  R("That's for YOU.", YOU, DUR - .3, 50, 380);
  const sb = E.el(S.el, "abs", "left:60px;top:600px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "DO AS I SAY.", STAMP, { size: 118, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/street-sunny.wav", { vol: .35, duck: false, to: SWAP });
  E.clip(SLOW, "voices/ep99/d_slow.wav", { vol: 1.3 });
  E.clip(OK, "voices/ep99/t_ok.wav", { vol: 1.2 });
  E.clip(CRAWL, "sfx/elx-trolley.wav", { vol: .4, to: 2.5 });
  E.clip(BRAKE, "voices/ep99/d_brake.wav", { vol: 1.35 }); E.S(BRAKE, "scratch", .4);
  E.clip(TWELVE, "voices/ep99/t_twelve.wav", { vol: 1.2 });
  E.clip(SENH, "voices/ep99/d_senhora.wav", { vol: 1.35 }); E.S(SENH + .2, "sparkle", .3);
  E.S(SWAP, "whoosh", .5); E.clip(WATCH, "voices/ep99/d_watch.wav", { vol: 1.3 });
  E.clip(FAST - .2, "sfx/car-rev-short.wav", { vol: .8 }); E.clip(FAST + .3, "sfx/car-speed.wav", { vol: .5, duck: false, to: DUR - FAST - .3 });
  E.clip(MOVE - .15, "sfx/car-horn.wav", { vol: .7, to: .8 }); E.clip(MOVE, "voices/ep99/d_move.wav", { vol: 1.35 });
  E.clip(SAFETY, "voices/ep99/t_safety.wav", { vol: 1.25 });
  E.clip(YOU - .2, "sfx/munch.wav", { vol: .5, to: .4 }); E.clip(YOU, "voices/ep99/d_you.wav", { vol: 1.35 });
  E.clip(STAMP - .15, "sfx/tire-screech.wav", { vol: .5, to: 1 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Driving lessons with a Portuguese *dad*", { size: 40, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[23.0, 1], [23.25, 1.18, "out"], [23.6, 1, "io"]]);
}
