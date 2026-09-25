// EP.38 "The plumber said 'amanhã'" — a pipe drips into Otto's bucket. He calls the plumber: "Amanhã!" The calendar flips, the
// water rises: "Amanhã, amanhã!" … "Amanhã, sem falta!" By Sunday Otto is rowing a dinghy round his kitchen: "It's everywhere
// now!" The doorbell: the plumber wades in, looks at the pipe: "Ah… isto precisa de uma peça. Amanhã." Voiced (ElevenLabs:
// Otto, the plumber in Portuguese with English subtitles) with water effects. Paced per the skit guide.
export const meta = {
  id: "ep38-plumber", date: "2026-10-31",
  images: {
    bucket: "characters/cutouts/otto-casual_bucket.webp", boat: "characters/cutouts/otto-boat.webp",
    ph: "characters/cutouts/plumber_phone.webp", shrug: "characters/cutouts/plumber_shrug.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 57, seed: 381, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 15.0, FLOOR = 1780, JX = 330, JY = 826;
  const S = E.scene("kitchen", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const C1 = .2, TUE = 3.2, WED = 5.4, SUN = 7.3, BELL = 9.4, PECA = 10.2;

  // ---------------- the kitchen ----------------
  E.el(S.el, "abs", "inset:0;background:#e3f0ee");
  E.el(S.el, "abs", `left:0;top:1180px;width:1080px;height:${FLOOR - 1180}px;background-color:#fbfbf7;background-image:linear-gradient(#c9dcd8 3px,transparent 3px),linear-gradient(90deg,#c9dcd8 3px,transparent 3px);background-size:90px 90px`);
  E.el(S.el, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background:#9c7a5a`);
  E.el(S.el, "abs", "left:0;top:800px;width:1080px;height:44px;background:linear-gradient(180deg,#c8ccd1,#8b939b);border-radius:6px;box-shadow:0 6px 0 rgba(0,0,0,.08)");
  for (const x of [120, JX - 36, 760]) E.el(S.el, "abs", `left:${x}px;top:790px;width:72px;height:64px;background:linear-gradient(180deg,#d8dde2,#7d858d);border-radius:8px`);
  E.el(S.el, "abs", "left:600px;top:1050px;width:420px;height:130px;background:#fff;border:10px solid #c9dcd8;border-radius:8px");   // a shelf, for scale
  E.el(S.el, "abs", "left:640px;top:990px;width:70px;height:60px;background:#e5484d;border-radius:8px 8px 20px 20px");
  E.el(S.el, "abs", "left:740px;top:960px;width:50px;height:90px;background:#35a0d0;border-radius:10px");

  // ---------------- the calendar ----------------
  const cal = E.el(S.el, "abs", "left:90px;top:430px;width:220px;height:210px;background:#fff;border-radius:14px;box-shadow:0 8px 18px rgba(0,0,0,.15);overflow:hidden;z-index:2;text-align:center");
  E.el(cal, "", "height:54px;background:#e5484d;color:#fff;font-weight:900;font-size:34px;line-height:54px", "OCT");
  const day = E.el(cal, "", `font-weight:900;font-size:84px;line-height:96px;color:${C.ink}`, "MON");
  const dn = E.el(cal, "", "font-weight:800;font-size:30px;color:#8b939b", "DAY 1");
  const DAYS = [[0, "MON", 1], [TUE, "TUE", 2], [WED, "WED", 3], [SUN, "THU", 4], [SUN + .18, "FRI", 5], [SUN + .36, "SAT", 6], [SUN + .54, "SUN", 7], [PECA + 2.4, "MON", 8]];
  E.F(t => { const [d, n] = at(DAYS.map(x => [x[0], [x[1], x[2]]]), t); if (day.textContent !== d) { day.textContent = d; dn.textContent = `DAY ${n}`; } dn.style.color = n >= 7 ? C.coralD : "#8b939b"; });
  DAYS.slice(1).forEach(([t]) => { E.K(cal, "r", [[t - .01, 0], [t, -8], [t + .2, 0, "out"]]); E.S(t, "tick", .7); });

  // ---------------- the water ----------------
  const LV = [[0, 0], [TUE, 0], [TUE + .4, 170, "out"], [WED, 170], [WED + .5, 420, "out"], [SUN, 420], [SUN + .7, 620, "out"]];
  const water = E.el(S.el, "abs", `left:0;top:${FLOOR}px;width:1080px;height:900px;z-index:5;background:linear-gradient(180deg,rgba(76,170,226,.82),rgba(40,120,190,.9))`);
  E.el(water, "abs", "left:0;top:-18px;width:2200px;height:36px;background:radial-gradient(circle at 45px 36px,rgba(76,170,226,.82) 34px,transparent 35px);background-size:90px 36px");
  E.K(water, "o", [[TUE - .01, 0], [TUE, 1]]);
  E.K(water, "y", LV.map(([t, v, e]) => (e ? [t, -v, e] : [t, -v])));
  E.F(t => { water.firstChild.style.transform = `translateX(${-((t * 60) % 90)}px)`; });

  // ---------------- the leak: drips, then a stream ----------------
  const drops = [0, 1, 2].map(() => E.el(S.el, "abs", `left:${JX - 13}px;top:${JY}px;width:26px;height:36px;background:#4aa8e0;border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;z-index:4;opacity:0`));
  const bucketY = 1160;
  E.F(t => {
    const p = t < TUE ? .8 : .42;
    drops.forEach((d, i) => {
      const u = ((t / p) + i / 3) % 1, y = u * (bucketY - JY), on = t < WED && i < (t < TUE ? 1 : 3);
      d.style.opacity = on && (i === 0 || t >= TUE) ? 1 : 0; d.style.transform = `translateY(${y}px)`;
    });
  });
  const stream = E.el(S.el, "abs", `left:${JX - 16}px;top:${JY + 10}px;width:32px;height:900px;background:linear-gradient(90deg,#7cc4ee,#3b95d6,#7cc4ee);border-radius:16px;z-index:4;transform-origin:50% 0;opacity:0`);
  E.K(stream, "o", [[WED - .01, 0], [WED, 1]]);
  E.F(t => { stream.style.height = t < SUN + .4 ? `${bucketY - JY - 10}px` : "900px"; }); E.K(stream, "sy", [[WED, .2], [WED + .3, 1, "out"]]);
  const spray = E.el(S.el, "abs", `left:${JX - 70}px;top:${JY - 20}px;width:140px;height:60px;border-radius:50%;background:radial-gradient(ellipse,rgba(124,196,238,.9),transparent 70%);z-index:4;opacity:0`);
  E.K(spray, "o", [[WED - .01, 0], [WED, 1]]); E.K(spray, "sx", [[WED, .6], [WED + .25, 1.1], [WED + .5, .9], [WED + .75, 1.1], [WED + 1, .95]]);

  // ---------------- Otto: the bucket, then the dinghy ----------------
  const ob = E.el(S.el, "abs", `left:90px;top:${FLOOR - 1078 * .85}px;width:${625 * .85}px;height:${1078 * .85}px;z-index:3;transform-origin:50% 100%`);
  E.img(ob, "bucket", `width:${625 * .85}px;height:${1078 * .85}px`);
  E.K(ob, "o", [[SUN + .4, 1], [SUN + .41, 0]]);
  const shiver = []; for (let t = 0; t < SUN; t += .8) shiver.push([t, 0, "io"], [t + .4, -6, "io"]);
  E.K(ob, "y", shiver);
  const BW = 864 * .8, BH = 625 * .8, boatTop = FLOOR - 620 - BH * .74;
  const boat = E.el(S.el, "abs", `left:30px;top:${boatTop}px;width:${BW}px;height:${BH}px;z-index:6;opacity:0;transform-origin:50% 80%`);
  E.img(boat, "boat", `width:${BW}px;height:${BH}px`);
  E.K(boat, "o", [[SUN + .4, 0], [SUN + .41, 1]]);
  const bob = [[SUN + .4, 120]]; for (let t = SUN + .7; t < DUR; t += 1) bob.push([t, 0, "io"], [t + .5, 10, "io"]);
  E.K(boat, "y", bob);
  const rock = []; for (let t = SUN + .5; t < DUR; t += 1.2) rock.push([t, -3, "io"], [t + .6, 3, "io"]);
  E.K(boat, "r", rock);

  // ---------------- the phone call inset ----------------
  const CALLS = [[C1, 3.1], [TUE + .3, 5.25], [WED + .4, 7.15]];
  const inset = E.el(S.el, "abs", "left:650px;top:450px;width:360px;height:360px;border-radius:50%;overflow:hidden;background:#fde9c8;border:10px solid #fff;box-shadow:0 10px 26px rgba(0,0,0,.2);z-index:7;opacity:0");
  E.img(inset, "ph", `position:absolute;left:-70px;top:14px;width:${685 * .72}px;height:${1031 * .72}px`);
  const nm = E.el(S.el, "abs", "left:700px;top:414px;width:260px;text-align:center;z-index:8;opacity:0", "");
  E.el(nm, "", "display:inline-block;background:#1f7a3a;color:#fff;font-weight:900;font-size:34px;padding:4px 18px;border-radius:14px", "Zé, plumber");
  CALLS.forEach(([a, b]) => {
    [inset, nm].forEach(el => E.K(el, "o", [[a - .01, 0], [a, 1], [b - .12, 1], [b, 0]]));
    E.K(inset, "s", [[a - .01, 1], [a, .4], [a + .3, 1, "back"]]); E.clip(a, "sfx/call-join.wav", { vol: .45 });
  });
  const sub = (pt, en, left, top, w, t0, t1, fs = 64) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;text-align:center;background:#fff;border-radius:28px;padding:14px 20px 18px;box-shadow:0 10px 26px rgba(0,0,0,.18)`);
    E.el(b, "", `font-weight:900;font-size:${fs}px;line-height:1.04;color:${C.ink}`, pt);
    E.el(b, "", "font-weight:800;font-size:34px;color:#7a8791;margin-top:6px", en);
    E.pop(b, t0, { from: .4, dur: .28 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  sub("Amanhã!", "(Tomorrow!)", 620, 840, 420, 2.2, 3.1, 72);
  sub("Amanhã, amanhã!", "(Tomorrow, tomorrow!)", 580, 840, 480, 3.7, 5.25);
  sub("Amanhã, sem falta!", "(Tomorrow, without fail!)", 560, 840, 500, 6.0, 7.15);

  // ---------------- the plumber arrives ----------------
  const pl = E.el(S.el, "abs", `left:420px;top:${FLOOR - 1044 * .85}px;width:${804 * .85}px;height:${1044 * .85}px;z-index:4;opacity:0`);
  E.img(pl, "shrug", `width:${804 * .85}px;height:${1044 * .85}px`);
  E.K(pl, "o", [[BELL + .2, 0], [BELL + .21, 1]]);
  E.K(pl, "x", [[BELL + .2, 700], [BELL + .7, 0, "out"]]);
  E.K(pl, "y", [[BELL + .2, 0], [BELL + .35, -10, "io"], [BELL + .5, 0, "io"], [BELL + .65, -10, "io"], [BELL + .8, 0, "io"]]);
  sub("Ah… isto precisa de uma peça.", "(Ah… this needs a part.)", 470, 620, 580, PECA, PECA + 2.3, 54);
  sub("Amanhã.", "(Tomorrow.)", 600, 660, 400, PECA + 2.35, DUR - .5, 80);

  // ---------------- Otto's lines ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 56) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:20px 28px 24px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Hello? The pipe is leaking!", 40, 672, 520, 200, .45, 2.15, 52);
  bubble("It’s everywhere now!", 470, 660, 560, 70, 7.95, 9.3, 60);

  // ---------------- the stamp ----------------
  const sb = E.el(S.el, "abs", "left:60px;top:1260px;width:960px;display:flex;justify-content:center;z-index:9");
  const st = E.stamp(sb, "AMANHÃ #4", PECA + 3.1, { size: 110, rot: -6, bg: C.coralD, shake: 12 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  E.clip(0, "sfx/drip.wav", { vol: .8, duck: false }); E.clip(3, "sfx/drip.wav", { vol: .8, duck: false, to: WED - 3 });
  E.clip(WED, "sfx/water-gush.wav", { vol: .55, gain: [[WED, 1], [WED + 1.5, .5]] });
  E.clip(WED + 3, "sfx/water-gush.wav", { vol: .25, duck: false, gain: [[WED + 3, .6], [SUN, 1]] });
  E.clip(SUN + .4, "sfx/splash.wav", { vol: .8 });
  E.clip(BELL, "sfx/doorbell.wav", { vol: .8 });
  E.clip(BELL + .3, "sfx/splash.wav", { vol: .4, to: .6 });
  E.clip(.5, "voices/ep38/o_leak.wav", { vol: 1.1 });
  E.clip(2.2, "voices/ep38/p_amanha1.wav", { vol: 1.15 });
  E.clip(3.7, "voices/ep38/p_amanha2.wav", { vol: 1.15 });
  E.clip(6.0, "voices/ep38/p_amanha3.wav", { vol: 1.15 });
  E.clip(8.0, "voices/ep38/o_everywhere.wav", { vol: 1.1 });
  E.clip(PECA, "voices/ep38/p_peca.wav", { vol: 1.2 });

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "The plumber said *“amanhã”*", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[14.2, 1], [14.45, 1.18, "out"], [14.8, 1, "io"]]);
}
