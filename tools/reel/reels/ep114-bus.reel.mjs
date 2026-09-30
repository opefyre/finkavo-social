// EP.114 "Waiting for the bus (já vem)" — the stop's display says 1 MIN, and Otto, cheerful, reads it out: "It says one minute." An old man on the bench, without looking up: "Já vem!" (it's coming!)
// 20 MIN LATER: a queue has formed. "It says one minute." "Já vem…" 2 HOURS LATER: parasols, chairs, a cooler, a cooking pot; Otto has a beard. "It says… one minute." "Já vem."
// Three buses arrive at once, each with the sign FORA DE SERVIÇO (out of service). Otto, ancient, flat: "I'll walk." Stamp: BUSES 3 · IN SERVICE 0.
export const meta = {
  id: "ep114-bus", date: "2027-01-15",
  images: {
    bg: "characters/scenes/bg_busstop.webp", bus: "characters/props/bus-front.webp",
    o1: "characters/cutouts/otto-casual_thumbs.webp", o2: "characters/cutouts/otto-casual_phonedespair.webp", o3: "characters/cutouts/otto-casual_seated-old.webp", o4: "characters/cutouts/otto-casual_ancient.webp",
    old: "characters/cutouts/oldman_seated.webp", lady: "characters/cutouts/lady_seated.webp", dona: "characters/cutouts/dona_seated.webp", qa: "characters/cutouts/queue_a.webp", qb: "characters/cutouts/queue_b.webp",
    par: "characters/props/gear_parasol.webp", chr: "characters/props/gear_chairs.webp", coo: "characters/props/gear_cooler.webp", pot: "characters/props/gear_pot.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 50, seed: 1141, prog: [[0, 4, 7], [7, 11, 14], [5, 9, 12], [2, 5, 9]] });
  const DUR = 22.4, ONE1 = .35, VEM1 = 2.2, C1 = 3.3, ONE2 = 4.85, VEM2 = 7.2, C2 = 9.2, ONE3 = 10.75, VEM3 = 13.35, BUS = 14.9, FORA = 16.9, WALK = 18.7, STAMP = 20.3;
  const S = E.scene("bus", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  E.img(S.el, "bg", BG);
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };

  // ---- the stop's display: always "1 MIN"
  const disp = E.el(S.el, "abs", "left:560px;top:470px;width:430px;height:170px;background:#0c0c10;border:8px solid #2a2a33;border-radius:16px;z-index:5;box-shadow:0 10px 24px rgba(0,0,0,.4)");
  const led = E.el(disp, "abs", "left:0;top:14px;width:430px;text-align:center;font-weight:900;font-size:64px;letter-spacing:3px;color:#ffb000;text-shadow:0 0 14px rgba(255,176,0,.8)", "735 · 1 MIN");
  E.el(disp, "abs", "left:0;top:106px;width:430px;text-align:center;font-weight:800;font-size:34px;letter-spacing:2px;color:#ff8a00;opacity:.85", "PRÓXIMO AUTOCARRO");
  E.F(t => { led.style.opacity = (Math.floor(t * 2) % 2 && t > 3) ? .92 : 1; });

  // ---- the people (stage 1 → 2 → 3)
  const FL = 1830;
  const ot = [fig(S.el, "o1", 649, 1024, .7, 260, FL, 6), fig(S.el, "o2", 475, 1053, .7, 260, FL, 6), fig(S.el, "o3", 551, 1045, .66, 260, FL - 10, 6), fig(S.el, "o4", 625, 1078, .68, 260, FL, 6)];
  E.F(t => { const k = t < C1 ? 0 : t < C2 ? 1 : t < WALK ? 2 : 3; ot.forEach((o, i) => { o.style.opacity = i === k ? 1 : 0; }); });
  bob(ot[0], 0, C1, 6, .55); bob(ot[1], C1, C2, 4, .8); bob(ot[2], C2, WALK, 3, 1.0); bob(ot[3], WALK, DUR, 4, .8);
  const old = fig(S.el, "old", 462, 1006, .62, 830, FL - 20, 6); bob(old, 0, DUR, 3, 1.1);
  const grp = (id, n, w, h, s, cx, bot, t0, z = 5) => { const el = fig(S.el, n, w, h, s, cx, bot, z); show(el, [[t0, DUR]]); E.K(el, "y", [[t0, -30], [t0 + .25, 0, "out"]]); return el; };
  const qa = grp(0, "qa", 965, 597, .52, 640, 1660, C1 + .9, 4), qb = grp(0, "qb", 965, 627, .52, 500, 1600, C2 + .9, 3);
  bob(qa, C1 + 1.2, DUR, 3, .9); bob(qb, C2 + 1.2, DUR, 3, .7);
  const dn = grp(0, "dona", 597, 1027, .5, 590, 1830, C2 + .9, 5), ld = grp(0, "lady", 453, 1028, .5, 720, 1850, C2 + 1.1, 5);
  bob(dn, C2 + 1.3, DUR, 3, .9); bob(ld, C2 + 1.3, DUR, 3, 1.0);
  const prop = (n, w, h, s, cx, bot, t0, z = 5) => grp(0, n, w, h, s, cx, bot, t0, z);
  prop("par", 249, 265, 1.3, 120, 1560, C2 + .7, 4); prop("chr", 221, 228, 1.0, 420, 1840, C2 + .8, 5); prop("coo", 197, 207, .9, 940, 1850, C2 + 1.0, 5); prop("pot", 236, 181, .9, 1000, 1700, C2 + 1.1, 4);
  const steam = E.el(S.el, "abs", "left:930px;top:1540px;font-size:70px;z-index:7;opacity:0", "♨️"); show(steam, [[C2 + 1.4, DUR]]); E.K(steam, "y", [[C2 + 1.4, 0], [C2 + 2.4, -40, "out"], [C2 + 2.41, 0], [C2 + 3.4, -40, "out"], [C2 + 3.41, 0], [C2 + 4.4, -40, "out"]]);

  // ---- three buses arrive at once
  const bus = (cx, bot, sEnd, t0, z, sgn) => {
    const w = 1093, h = 880, el = E.el(S.el, "abs", `left:${cx - w / 2}px;top:${bot - h}px;width:${w}px;height:${h}px;z-index:${z};transform-origin:50% 100%;opacity:0`);
    E.img(el, "bus", `width:${w}px;height:${h}px`);
    const dd = E.el(el, "abs", `left:${w * .24}px;top:${h * .065}px;width:${w * .48}px;height:${h * .075}px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:${w * .033}px;letter-spacing:2px;color:#ffb000;text-shadow:0 0 10px rgba(255,176,0,.8);white-space:nowrap`, "FORA DE SERVIÇO");
    show(el, [[t0, DUR]]);
    E.K(el, "s", [[t0, .22 * sEnd / .75], [t0 + 1.7, sEnd, "out"]]); E.K(el, "x", [[t0, (cx < 540 ? 280 : cx > 540 ? -280 : 0)], [t0 + 1.7, 0, "out"]]); E.K(el, "y", [[t0, -380], [t0 + 1.7, 0, "out"]]);
    const k = []; for (let t = t0 + 1.8; t < DUR; t += .9) k.push([t, 0, "io"], [t + .45, -5, "io"]); E.K(el, "r", [[t0, 0]]);
    return el;
  };
  bus(240, 1290, .62, BUS, 2); bus(850, 1290, .62, BUS + .15, 2); bus(545, 1370, .78, BUS + .3, 3);
  const sb = en => `<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:3px">${en}</div>`;

  // ---- time cards + pill
  const card = (txt, t0, t1) => { const el = E.el(S.el, "abs", "inset:0;background:#141a2e;z-index:14;opacity:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:80px;color:#fff6c8;text-align:center;padding:0 60px;line-height:1.1", txt); E.K(el, "o", [[t0, 0], [t0 + .12, 1], [t1 - .15, 1], [t1, 0]]); };
  card("20 MIN<br>LATER…", C1, C1 + 1.3); card("2 HOURS<br>LATER…", C2, C2 + 1.3);
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "WAITING: 0 MIN · ETA: 1 MIN"], [C1 + 1.3, "WAITING: 20 MIN · ETA: 1 MIN"], [C2 + 1.3, "WAITING: 2 H · ETA: 1 MIN"], [BUS, "BUSES: 3 · IN SERVICE: 0"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= C1 + 1.3 ? C.coralD : C.ink; pill.style.fontSize = s.length > 26 ? "40px" : "44px"; });
  PL.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.1], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, hx, top, w, t0, t1, fs = 48, z = 10) => {
    const tail = Math.max(50, Math.min(w - 90, w / 2)), left = Math.max(20, Math.min(1060 - w, hx - tail)), tl = hx - left - 22;
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:${z};transform-origin:${tl}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tl}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("It says one minute.", 260, 930, 500, ONE1, VEM1 - .05, 50);
  bubble(`Já vem!${sb("(It's coming!)")}`, 830, 960, 420, VEM1, C1 - .05, 62);
  bubble("It says one minute.", 260, 930, 500, ONE2, VEM2 - .05, 48);
  bubble(`Já vem…${sb("(It's coming…)")}`, 830, 960, 420, VEM2, C2 - .05, 62);
  bubble("It says… one minute.", 260, 880, 540, ONE3, VEM3 - .05, 48);
  bubble(`Já vem.${sb("(It's coming.)")}`, 830, 960, 420, VEM3, BUS - .1, 62);
  const fo = (hx, t0) => bubble(`Fora de serviço.${sb("(Out of service.)")}`, hx, 900, 440, t0, WALK - .1, 40, 11);
  fo(240, FORA); fo(850, FORA + .25);
  bubble("I'll walk.", 260, 920, 360, WALK, STAMP + .3, 62);
  E.stamp(E.el(S.el, "abs", "left:30px;top:600px;width:1020px;display:flex;justify-content:center;z-index:11"), "BUSES 3 · IN SERVICE 0.", STAMP, { size: 76, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(0, "sfx/crowd-murmur.wav", { vol: .12, duck: false, to: BUS });
  E.clip(ONE1, "voices/ep114/o_one1.wav", { vol: 1.2 }); E.clip(VEM1, "voices/ep114/a_vem1.wav", { vol: 1.35 });
  E.S(C1, "whoosh", .4); E.clip(ONE2, "voices/ep114/o_one2.wav", { vol: 1.2 }); E.clip(VEM2, "voices/ep114/a_vem2.wav", { vol: 1.35 });
  E.S(C2, "whoosh", .4); E.clip(ONE3, "voices/ep114/o_one3.wav", { vol: 1.2 }); E.clip(VEM3, "voices/ep114/a_vem3.wav", { vol: 1.4 });
  E.clip(BUS - .3, "sfx/elx-bus-brakes.wav", { vol: .9, to: 3.4 }); E.clip(BUS + .6, "sfx/car-horn.wav", { vol: .5, to: 1 });
  E.clip(FORA, "voices/ep114/pa_fora.wav", { vol: 1.2 }); E.clip(FORA + .25, "voices/ep114/pa_fora.wav", { vol: 1.0 });
  E.clip(FORA + .6, "sfx/crowd-groan.wav", { vol: .8, to: 2.4 });
  E.clip(WALK, "voices/ep114/o_walk.wav", { vol: 1.25 }); E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Waiting for the *bus* (já vem)", { size: 50, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[21.6, 1], [21.85, 1.18, "out"], [22.15, 1, "io"]]);
}
