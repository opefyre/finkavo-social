// EP.123 "Taking grandpa to the cinema" — a dark cinema. Otto, whispering: "Grandpa, the film is starting. Phones off." Grandpa unwraps a giant chouriço sandwich in crinkly foil. Then, at full volume:
// "Who is that? Is he the bad guy?" The row in front turns: "Shhh!" Grandpa: "Shhh yourself! I paid for my ticket!" His phone rings (loud ringtone); he answers: "Estou? Estou no cinema, filha! Sim, é bom!"
// (Hello? I'm at the cinema, dear! Yes, it's good!) Otto: "Grandpa!" 2 HOURS LATER, credits rolling: grandpa asleep, snoring. "Grandpa, it's finished." He wakes up, content: "Very good film. Same time next week?"
// Stamp: GRANDPA: 5 STARS ⭐. (The screen shows a code-drawn spy film.)
export const meta = {
  id: "ep123-cinema", date: "2027-01-24",
  images: {
    bg: "characters/scenes/bg_cinema.webp",
    s1: "characters/cutouts/cinema-avo_sandwich.webp", s2: "characters/cutouts/cinema-avo_phone.webp", s3: "characters/cutouts/cinema-avo_sleep.webp", sh: "characters/cutouts/cinema_shushers.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 96, root: 48, seed: 1231, prog: [[0, 3, 7], [5, 8, 12], [7, 10, 14], [3, 7, 10]] });
  const DUR = 27.6, START = .3, FOIL = 3.5, WHO = 4.7, SHH = 7.2, PAID = 8.0, RING = 11.2, ESTOU = 11.6, GRAND = 15.8, CARD = 16.9, FIN = 18.6, GOOD = 20.4, STAMP = 23.4;
  const S = E.scene("cinema", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };
  E.img(S.el, "bg", BG);

  // ---- the film on the screen (drawn in code): a spy chase, then the credits
  const scr = E.el(S.el, "abs", "left:130px;top:250px;width:820px;height:420px;z-index:1;overflow:hidden;border-radius:6px;background:#0a1630");
  const city = E.el(scr, "abs", "left:0;top:240px;width:2400px;height:180px");
  for (let i = 0; i < 26; i++) E.el(city, "abs", `left:${i * 92}px;bottom:0;width:80px;height:${60 + (i * 53) % 130}px;background:#1d2d55;border-top:6px solid #2c4580`);
  E.K(city, "x", [[0, 0], [CARD, -1500, "lin"]]);
  const spy = E.el(scr, "abs", "left:260px;top:170px;font-size:120px", "🕴️"); bob(spy, 0, CARD, 18, .35);
  const car = E.el(scr, "abs", "left:-200px;top:250px;font-size:110px", "🚗"); E.K(car, "x", [[0, 0], [CARD, 900, "lin"]]);
  const boom = E.el(scr, "abs", "left:560px;top:80px;font-size:150px;opacity:0", "💥"); show(boom, [[6.0, 6.6], [13.0, 13.5]]); E.pop(boom, 6.0, { from: .3, dur: .2 }); E.pop(boom, 13.0, { from: .3, dur: .2 });
  const cred = E.el(scr, "abs", "inset:0;background:#05070d;opacity:0;text-align:center;color:#cfd6dc;font-weight:800;font-size:36px;line-height:1.5;padding-top:130px;box-sizing:border-box");
  cred.innerHTML = "FIM<br><span style='font-size:26px;color:#7a8791'>(THE END)</span><br>Realizador · Director<br>Produtor · Producer<br>Música · Music";
  show(cred, [[CARD, DUR]]);
  const roll = E.el(cred, "abs", "left:0;top:0;width:820px;height:1px"); E.K(cred, "y", [[CARD, 0], [DUR, -60, "lin"]]);
  // the screen's flicker lights the audience
  const glow = E.el(S.el, "abs", "inset:0;background:radial-gradient(ellipse at 50% 20%,rgba(120,170,255,.35),rgba(0,0,0,0) 70%);z-index:2");
  const gk = []; for (let t = 0; t < CARD; t += .4) gk.push([t, .7, "io"], [t + .2, 1, "io"]); E.K(glow, "o", [...gk, [CARD, .4]]);
  E.el(S.el, "abs", "inset:0;background:rgba(5,8,20,.25);z-index:2");

  // ---- the row in front (shushers) and grandpa + Otto
  const FW = 1080, FH = 745 * FW / 1344;
  const shh = E.el(S.el, "abs", `left:0;top:${1150 - FH}px;width:${FW}px;height:${FH}px;z-index:4;opacity:0`); E.img(shh, "sh", `width:${FW}px;height:${FH}px`);
  show(shh, [[SHH - .1, PAID + 2.4]]); E.K(shh, "y", [[SHH - .1, 120], [SHH + .2, 0, "out"]]);
  const SW = 1080, SH = 752 * SW / 1344, row = E.el(S.el, "abs", `left:0;top:${1930 - SH - 20}px;width:${SW}px;height:${SH}px;z-index:5`);
  const R = ["s1", "s2", "s3"].map(n => E.img(row, n, `position:absolute;left:0;top:0;width:${SW}px;height:${SH}px;opacity:0`));
  E.F(t => { const k = t < RING ? 0 : t < CARD ? 1 : t < GOOD ? 2 : 0; R.forEach((r, i) => { r.style.opacity = i === k ? 1 : 0; }); });
  bob(row, 0, CARD, 4, .6);
  const snore = E.el(S.el, "abs", "left:230px;top:1180px;font-weight:900;font-size:70px;color:#cfe3ff;z-index:7;opacity:0;text-shadow:0 3px 8px rgba(0,0,0,.6)", "Z z z");
  show(snore, [[CARD + .2, GOOD]]); E.K(snore, "y", [[CARD, 0], [CARD + 1, -40, "out"], [CARD + 1.01, 0], [CARD + 2, -40, "out"], [CARD + 2.01, 0], [CARD + 3, -40, "out"]]);
  const glowp = E.el(S.el, "abs", "left:180px;top:1250px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(200,230,255,.7),rgba(200,230,255,0) 70%);z-index:6;opacity:0");
  show(glowp, [[RING, CARD]]);
  const card = E.el(S.el, "abs", "inset:0;background:#141a2e;z-index:14;opacity:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:80px;color:#fff6c8;text-align:center;line-height:1.1", "2 HOURS<br>LATER…");
  E.K(card, "o", [[CARD, 0], [CARD + .1, 1], [CARD + 1.2, 1], [CARD + 1.35, 0]]);

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "PHONES OFF: 1 OF 2"], [WHO, "PEOPLE SHUSHING: 0"], [SHH, "PEOPLE SHUSHING: 4"], [ESTOU, "PEOPLE SHUSHING: ALL"], [CARD + 1.3, "MINUTES WATCHED: 4"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= WHO ? C.coralD : C.ink; });
  PL.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.12], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const sub = en => `<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:3px">${en}</div>`;
  const bubble = (html, hx, top, w, t0, t1, fs = 48, z = 10) => {
    const tail = Math.max(50, Math.min(w - 90, w / 2)), left = Math.max(20, Math.min(1060 - w, hx - tail)), tl = hx - left - 22;
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:${z};transform-origin:${tl}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tl}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const AH = 300, OH = 780, TB = 1180;
  bubble("Grandpa, the film is starting. Phones off.", OH, TB, 560, START, FOIL - .1, 42);
  bubble("Who is that? Is he the bad guy?", AH, TB, 520, WHO, SHH - .1, 48);
  bubble("SHHH!", 540, 760, 300, SHH, PAID + .4, 64, 11);
  bubble("Shhh yourself! I paid for my ticket!", AH, TB, 560, PAID, RING - .1, 44);
  bubble(`Estou? Estou no cinema, filha! Sim, é bom!${sub("(Hello? I'm at the cinema, dear! Yes, it's good!)")}`, AH, TB - 60, 620, ESTOU, GRAND - .1, 40);
  bubble("Grandpa!", OH, TB, 320, GRAND, CARD, 56, 11);
  bubble("Grandpa, it's finished.", OH, TB, 460, FIN, GOOD - .1, 48);
  bubble("Very good film. Same time next week?", AH, TB, 560, GOOD, STAMP + .3, 46);
  E.stamp(E.el(S.el, "abs", "left:30px;top:760px;width:1020px;display:flex;justify-content:center;z-index:13"), "GRANDPA'S REVIEW: ⭐⭐⭐⭐⭐", STAMP, { size: 60, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(START, "voices/ep123/o_start.wav", { vol: 1.2 });
  E.clip(FOIL - .2, "sfx/crinkle.wav", { vol: 1.2, to: 1.6 }); E.S(6.0, "thud", .5); E.S(13.0, "thud", .5);
  E.clip(WHO, "voices/ep123/a_who.wav", { vol: 1.35 });
  E.clip(SHH, "sfx/shush-crowd.wav", { vol: 1.0, to: 1.0 }); E.clip(PAID, "voices/ep123/a_shh.wav", { vol: 1.35 });
  E.clip(RING, "sfx/ringtone.wav", { vol: .8, to: .7 }); E.clip(ESTOU, "voices/ep123/a_estou.wav", { vol: 1.35 });
  E.clip(GRAND, "voices/ep123/o_grandpa.wav", { vol: 1.3 }); E.S(CARD, "whoosh", .4);
  E.clip(CARD + .3, "sfx/elx-snore.wav", { vol: .9, to: FIN - CARD - .2 });
  E.clip(FIN, "voices/ep123/o_finished.wav", { vol: 1.25 }); E.clip(GOOD, "voices/ep123/a_good.wav", { vol: 1.35 }); E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Taking *grandpa* to the cinema", { size: 48, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[26.8, 1], [27.05, 1.18, "out"], [27.35, 1, "io"]]);
}
