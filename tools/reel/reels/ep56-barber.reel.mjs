// EP.56 "'Just the tips' at the barber" — Otto takes his beanie off (big fluffy hair) and sits down: "Just the tips, please." The old
// barber: "Só as pontas? Claro!" Then he turns to talk football — "E o Benfica, hã? Aquele penálti! Uma vergonha!" — snipping blindly
// while hair flies; clippers, a cloud of hair, the HAIR meter drops 100% → 0%. The cloud clears: bald. "Pronto! Está impecável!" (there,
// perfect!) "…The tips?" Otto quietly pulls his beanie back on. Voiced (barber in Portuguese with subtitles, Otto) + scissors/clippers.
export const meta = {
  id: "ep56-barber", date: "2026-11-18",
  images: {
    hair: "characters/cutouts/otto-cape_hair.webp", bald: "characters/cutouts/otto-cape_bald.webp",
    talk: "characters/cutouts/barber_talk.webp", mirror: "characters/cutouts/barber_mirror.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 110, root: 62, seed: 561, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 17.6, FLOOR = 1700, TIPS = .5, CLARO = 1.9, CUT = 3.7, CLIP = 7.4, REVEAL = 10.6, Q = 12.5, CAP = 14.0;
  const S = E.scene("barber", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  // ---------------- the barbershop ----------------
  E.el(S.el, "abs", "inset:0;background:#e9f1ee");
  E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:repeating-linear-gradient(90deg,rgba(0,0,0,.035) 0 60px,transparent 60px 120px)");
  E.el(S.el, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background-color:#f4f4f4;background-image:linear-gradient(45deg,#2b2b2b 25%,transparent 25%,transparent 75%,#2b2b2b 75%),linear-gradient(45deg,#2b2b2b 25%,transparent 25%,transparent 75%,#2b2b2b 75%);background-size:120px 120px;background-position:0 0,60px 60px`);
  const mir = E.el(S.el, "abs", "left:190px;top:440px;width:700px;height:600px;border:22px solid #b8894f;border-radius:20px;background:linear-gradient(135deg,#dbe9f0,#f4fafc 45%,#cfe1ea);box-shadow:0 10px 20px rgba(0,0,0,.15)");
  E.el(mir, "abs", "left:60px;top:40px;width:120px;height:500px;background:rgba(255,255,255,.5);transform:skewX(-20deg)");
  const pole = E.el(S.el, "abs", "left:950px;top:520px;width:70px;height:320px;border-radius:35px;overflow:hidden;border:8px solid #d0d6da");
  const stripes = E.el(pole, "abs", "left:0;top:-200px;width:70px;height:720px;background:repeating-linear-gradient(135deg,#e5484d 0 30px,#fff 30px 60px,#2f6db5 60px 90px,#fff 90px 120px)");
  E.F(t => { stripes.style.transform = `translateY(${(t * 120) % 120}px)`; });
  E.el(S.el, "abs", "left:60px;top:1110px;width:960px;height:40px;background:#f7f2e8;border-radius:8px;box-shadow:0 6px 0 rgba(0,0,0,.08)");
  for (const [x, c, h] of [[120, "#2f9e6f", 90], [190, "#e5484d", 70], [250, "#f2b632", 100], [800, "#2f6db5", 80]]) E.el(S.el, "abs", `left:${x}px;top:${1110 - h}px;width:44px;height:${h}px;border-radius:10px 10px 4px 4px;background:${c}`);
  const hook = E.el(S.el, "abs", "left:70px;top:520px;width:90px;height:60px;border-radius:45px 45px 8px 8px;background:#2f6b3a;box-shadow:inset 0 -14px 0 #245a2f;opacity:0");     // the beanie on its hook
  E.K(hook, "o", [[.2, 0], [.25, 1], [CAP - .01, 1], [CAP, 0]]);

  // ---------------- Otto in the chair ----------------
  const OS = 1.0, OW = 533 * OS, OH = 1081 * OS, ow = E.el(S.el, "abs", `left:${250}px;top:${FLOOR + 40 - OH}px;width:${OW}px;height:${OH}px;z-index:3`);
  const hIm = E.img(ow, "hair", `position:absolute;left:0;top:0;width:${OW}px;height:${OH}px`);
  const bIm = E.img(ow, "bald", `position:absolute;left:0;top:0;width:${OW}px;height:${OH}px;opacity:0`);
  E.F(t => { const b = t >= REVEAL; hIm.style.opacity = b ? 0 : 1; bIm.style.opacity = b ? 1 : 0; });
  const ob = []; for (let t = 0; t < CUT; t += .8) ob.push([t, 0, "io"], [t + .4, -6, "io"]);
  E.K(ow, "y", ob);                                                                                                     // frame-0 motion
  const HX = 250 + 268 * OS, HY = FLOOR + 40 - OH + 150 * OS;                                                            // head centre
  // flying hair tufts while he snips
  const tufts = Array.from({ length: 16 }, (_, i) => E.el(S.el, "abs", `left:${HX - 30}px;top:${HY - 80}px;width:${50 + (i % 3) * 16}px;height:${22 + (i % 2) * 10}px;border-radius:50% 40% 60% 40%;background:#5a3a22;z-index:5;opacity:0`));
  E.F(t => tufts.forEach((f, i) => {
    const per = t < CLIP ? .5 : .28, u = ((t - CUT + i * per / 4) % (per * 4)) / (per * 4), on = t > CUT && t < REVEAL - .2 && i < (t < CLIP ? 8 : 16);
    const dir = i % 2 ? 1 : -1; f.style.opacity = on ? 1 - u * .6 : 0;
    f.style.transform = `translate(${dir * (80 + u * 300)}px,${-60 * Math.sin(u * 3) + u * 700}px) rotate(${u * 400 * dir}deg)`;
  }));
  const pile = E.el(S.el, "abs", `left:${HX - 260}px;top:${FLOOR - 10}px;width:520px;height:70px;border-radius:50% 50% 20% 20%;background:#5a3a22;z-index:2;transform-origin:50% 100%`);
  E.K(pile, "sy", [[0, 0], [CUT, 0], [REVEAL, 1]]); E.K(pile, "sx", [[0, .1], [CUT, .1], [REVEAL, 1]]);
  // the cloud of hair (clippers)
  const cloud = E.el(S.el, "abs", `left:${HX - 230}px;top:${HY - 220}px;width:460px;height:380px;z-index:6;opacity:0`);
  for (const [x, y, r] of [[40, 90, 120], [150, 20, 150], [270, 80, 130], [100, 170, 140], [230, 190, 130]]) E.el(cloud, "abs", `left:${x}px;top:${y}px;width:${r * 1.3}px;height:${r * 1.3}px;border-radius:50%;background:#6b4a2c;box-shadow:inset -14px -14px 0 rgba(0,0,0,.15)`);
  E.el(cloud, "abs", "left:60px;top:150px;font-weight:900;font-size:80px;color:#ffd23f;-webkit-text-stroke:6px #1d2b36;paint-order:stroke;transform:rotate(-8deg)", "BZZZZ!");
  E.K(cloud, "o", [[CLIP, 0], [CLIP + .1, 1], [REVEAL - .15, 1], [REVEAL, 0]]);
  E.F(t => { cloud.style.transform = t > CLIP && t < REVEAL ? `translate(${Math.sin(t * 40) * 8}px,${Math.cos(t * 33) * 8}px) scale(${1 + Math.sin(t * 9) * .04})` : ""; });
  const shine = E.el(S.el, "abs", `left:${HX + 20}px;top:${HY - 90}px;width:40px;height:40px;z-index:6;opacity:0;font-size:60px;color:#fff;line-height:40px;text-shadow:0 0 12px #fff`, "✦");
  E.K(shine, "o", [[REVEAL + .1, 0], [REVEAL + .2, 1], [REVEAL + .6, 0], [REVEAL + 1.0, 1], [REVEAL + 1.4, 0]]); E.K(shine, "s", [[REVEAL + .1, .4], [REVEAL + .4, 1.4, "out"]]);
  // the beanie, pulled back on
  const bea = E.el(S.el, "abs", `left:${HX - 125}px;top:${HY - 100}px;width:250px;height:125px;z-index:7;opacity:0`);
  E.el(bea, "abs", "left:0;top:0;width:250px;height:125px;border-radius:125px 125px 14px 14px;background:#2f6b3a;box-shadow:inset 0 -26px 0 #245a2f");
  E.el(bea, "abs", "left:20px;top:18px;width:210px;height:70px;border-radius:100px 100px 0 0;background:repeating-linear-gradient(90deg,rgba(0,0,0,.08) 0 10px,transparent 10px 20px)");
  E.K(bea, "o", [[CAP, 0], [CAP + .01, 1]]); E.K(bea, "y", [[CAP, -500], [CAP + .3, 0, "in"], [CAP + .4, -12, "out"], [CAP + .5, 0, "in"]]);

  // ---------------- the barber ----------------
  const bw = E.el(S.el, "abs", `left:0;top:0;width:1px;height:1px;z-index:4`);
  const t1 = E.img(bw, "talk", `position:absolute;left:640px;top:${FLOOR + 20 - 1044 * .86}px;width:${420 * .86}px;height:${1044 * .86}px`);
  const m1 = E.img(bw, "mirror", `position:absolute;left:600px;top:${FLOOR + 20 - 1021 * .8}px;width:${598 * .8}px;height:${1021 * .8}px;opacity:0`);
  E.F(t => { const m = t >= REVEAL + .2; t1.style.opacity = m ? 0 : 1; m1.style.opacity = m ? 1 : 0; });
  const gest = []; for (let tt = CUT; tt < REVEAL; tt += .3) gest.push([tt, -3, "io"], [tt + .15, 3, "io"]);
  E.K(t1, "r", gest);
  E.K(bw, "x", [[0, 500], [.6, 0, "out"]]);

  // ---------------- HUD ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:52px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  E.F(t => { const u = Math.max(0, Math.min(1, (t - CUT) / (REVEAL - CUT))), h = Math.round(100 - 100 * u * u), s = t >= CAP ? "HAIR: CLASSIFIED" : `HAIR: ${h}%`; if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= CAP ? "#1f7a3a" : h < 40 ? C.coralD : C.ink; });
  const ord = E.el(S.el, "abs", "left:600px;top:352px;background:#fff;border-radius:14px;padding:4px 14px;font-weight:900;font-size:34px;color:#1d2b36;z-index:9;box-shadow:0 6px 14px rgba(0,0,0,.15);opacity:0", "ORDER: just the tips");
  E.K(ord, "o", [[TIPS + .6, 0], [TIPS + .7, 1]]);

  // ---------------- bubbles, stamp ----------------
  const bubble = (html, left, top, w, tail, t0, t1b, fs = 52) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:32px;padding:18px 26px 22px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1b - .12, 1], [t1b - .01, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble("Just the tips, please.", 40, 620, 460, 280, TIPS, CLARO - .05, 50);
  bubble(`Só as pontas? Claro!${sub("(Just the tips? Of course!)")}`, 480, 560, 560, 320, CLARO, CUT + .1, 48);
  bubble(`E o Benfica, hã? Aquele penálti! Uma vergonha!${sub("(And Benfica, eh? That penalty! A disgrace!)")}`, 400, 520, 640, 420, CUT + .3, CLIP + .2, 44);
  bubble(`…E O ÁRBITRO?!${sub("(…and the REFEREE?!)")}`, 480, 560, 560, 320, CLIP + .6, REVEAL - .1, 50);
  bubble(`Pronto! Está impecável!${sub("(There! Perfect!)")}`, 480, 540, 560, 280, REVEAL + .3, Q - .05, 48);
  bubble("…The tips?", 60, 640, 380, 250, Q, CAP - .05, 58);
  const sb = E.el(S.el, "abs", "left:60px;top:470px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "SÓ AS PONTAS.", CAP + .9, { size: 104, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  E.clip(0, "sfx/cafe-morning.wav", { vol: .2, duck: false });
  E.clip(TIPS, "voices/ep56/o_tips.wav", { vol: 1.15 });
  E.clip(CLARO, "voices/ep56/b_pontas.wav", { vol: 1.15 });
  E.clip(CUT, "sfx/scissors.wav", { vol: 1.1 }); E.clip(CUT + 2, "sfx/scissors.wav", { vol: 1.1, to: CLIP - CUT - 2 });
  E.clip(CUT + .3, "voices/ep56/b_benfica.wav", { vol: 1.15 });
  E.clip(CLIP, "sfx/clippers.wav", { vol: .8 }); E.clip(CLIP + 1.9, "sfx/clippers.wav", { vol: .8, to: REVEAL - CLIP - 1.9 });
  E.S(REVEAL, "poof", 1); E.S(REVEAL + .2, "sparkle", .7);
  E.clip(REVEAL + .3, "voices/ep56/b_pronto.wav", { vol: 1.15 });
  E.clip(Q, "voices/ep56/o_tips2.wav", { vol: 1.25 });
  E.S(CAP + .3, "pop", .8);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.95);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "“Just the tips” at the *barber*", { size: 50, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[16.8, 1], [17.05, 1.18, "out"], [17.4, 1, "io"]]);
}
