// EP.118 "When mum calls and you're on the bus" — a quiet Lisbon bus. The phone rings: MÃE (Mum), on loudspeaker. "Olá, filho! Did you eat lunch?" Otto, whispering: "Mum, I'm on the bus."
// "Are you wearing the underwear I bought you? The ones with the little hearts?" The whole bus turns. "Mum! You're on speaker!" "And did you call that nice girl, Inês?" Dona Rosa leans into the phone:
// "He didn't. I can tell." Mum, delighted (of course she knows her): "Ai, Dona Rosa! Tell him to wear a jacket!" A builder: "Wear a jacket, man!" The driver: "And call Inês!" Everyone: "Beijinhos!"
// NEXT DAY, outside, no jacket. Mum: "Dona Rosa says you didn't wear the jacket." Otto: "I'm buying a car." Stamp: MUM'S SPY NETWORK: ACTIVE.
export const meta = {
  id: "ep118-speaker", date: "2027-01-19",
  images: {
    bg: "characters/scenes/bg_businside.webp", bg2: "characters/scenes/bg_street.webp",
    o1: "characters/cutouts/otto-bus_phone.webp", o2: "characters/cutouts/otto-bus_hide.webp", o3: "characters/cutouts/otto-phone_shocked.webp",
    p1: "characters/cutouts/passengers_stare.webp", p2: "characters/cutouts/passengers_advise.webp",
    rosa: "characters/cutouts/rosa_advise.webp", drv: "characters/cutouts/busdriver_thumb.webp", mum: "characters/cutouts/mum_record.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 53, seed: 1181, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [2, 5, 9]] });
  const DUR = 30.0, RING = .15, OLA = .8, BUS = 3.15, UNDER = 5.05, SPK = 8.45, INES = 10.5, TELL = 12.9, MROSA = 15.15, JACKET = 18.25, DINES = 20.0, BEIJ = 21.5, CARD = 23.2, NEXT = 24.5, CAR = 27.2, STAMP = 28.5;
  const CALL1 = 23.1, DAY2 = 24.25;
  const S = E.scene("bus", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };

  // ================= on the bus =================
  const G1 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G1, [[0, DAY2]]);
  const bgw = E.el(G1, "abs", "inset:0"); E.img(bgw, "bg", BG);
  const rock = []; for (let t = 0; t < DAY2; t += .9) rock.push([t, 0, "io"], [t + .45, 3, "io"]); E.K(bgw, "y", rock);     // the bus rocks
  const FW = 1080, FH = 752 * FW / 1344;
  const pas = E.el(G1, "abs", `left:0;top:${1380 - FH}px;width:${FW}px;height:${FH}px;z-index:3`);
  const PA = ["p1", "p2"].map(n => E.img(pas, n, `position:absolute;left:0;top:0;width:${FW}px;height:${FH}px;opacity:0`));
  E.F(t => { const k = t < JACKET ? 0 : 1; PA.forEach((p, i) => { p.style.opacity = i === k ? 1 : 0; }); });
  E.K(pas, "x", [[0, 60], [UNDER + .6, 60], [UNDER + 1.0, 20, "out"], [JACKET, 20], [JACKET + .3, -10, "out"]]);
  bob(pas, 0, DAY2, 4, .9);
  const o1 = fig(G1, "o1", 536, 970, .78, 290, 1830, 6), o2 = fig(G1, "o2", 527, 896, .82, 290, 1830, 6);
  E.F(t => { const k = t < SPK ? 0 : t < MROSA ? 1 : 0; o1.style.opacity = k === 0 ? 1 : 0; o2.style.opacity = k === 1 ? 1 : 0; });
  const jit = []; for (let t = 0; t < DAY2; t += .1) jit.push([t, (Math.round(t / .1) % 2) ? 1.5 : -1.5, "io"]); E.K(o1, "r", jit);
  bob(o2, SPK, MROSA, 3, .8);
  const ro = fig(G1, "rosa", 634, 1004, .74, 820, 1870, 7); show(ro, [[TELL - .3, DAY2]]); E.K(ro, "x", [[TELL - .3, 420], [TELL + .2, 0, "out"]]);
  bob(ro, TELL, DAY2, 5, .6);
  // speaker waves from the phone
  const waves = E.el(G1, "abs", "left:420px;top:1080px;font-size:80px;z-index:8;opacity:0", "🔊");
  show(waves, [[OLA, BUS - .1], [UNDER, SPK - .1], [INES, TELL - .1], [MROSA, JACKET - .1], [BEIJ, CALL1]]);
  const wk = []; for (let t = 0; t < CALL1; t += .3) wk.push([t, 1, "io"], [t + .15, 1.25, "io"]); E.K(waves, "s", wk);

  // ---- insets: Mum on the phone screen, the driver in his mirror
  const phone = E.el(S.el, "abs", "left:60px;top:460px;width:280px;height:430px;background:#1d2b36;border-radius:42px;z-index:9;box-shadow:0 14px 30px rgba(0,0,0,.45);border:8px solid #0e151c;overflow:hidden;opacity:0");
  const scr = E.el(phone, "abs", "left:0;top:0;width:264px;height:414px;overflow:hidden;background:linear-gradient(#ffe0c2,#ffc79a)");
  E.img(scr, "mum", "position:absolute;left:-20px;top:46px;width:300px;height:611px");
  E.el(phone, "abs", "left:0;top:10px;width:264px;text-align:center;font-weight:900;font-size:34px;color:#1d2b36;z-index:2", "MÃE 📞");
  E.el(phone, "abs", "left:0;top:368px;width:264px;text-align:center;font-weight:800;font-size:24px;color:#1d2b36;z-index:2;background:rgba(255,255,255,.7)", "(Mum · speaker ON)");
  show(phone, [[OLA - .3, CALL1], [NEXT - .2, CAR]]); E.K(phone, "s", [[OLA - .3, .4], [OLA, 1, "out"], [NEXT - .21, 1], [NEXT - .2, .4], [NEXT + .1, 1, "out"]]);
  const pk = []; for (let t = 0; t < DUR; t += .7) pk.push([t, -2, "io"], [t + .35, 2, "io"]); E.K(phone, "r", pk);
  const mir = E.el(S.el, "abs", "left:700px;top:470px;width:320px;height:230px;background:#c9d6df;border-radius:30px;z-index:9;border:10px solid #222;overflow:hidden;opacity:0;box-shadow:0 10px 24px rgba(0,0,0,.4)");
  E.img(mir, "drv", "position:absolute;left:-60px;top:-20px;width:440px;height:584px");
  show(mir, [[DINES - .2, CALL1]]); E.pop(mir, DINES - .2, { from: .4, dur: .3 });

  // ================= the next day =================
  const G2 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G2, [[DAY2, DUR]]);
  E.img(G2, "bg2", BG);
  const o3 = fig(G2, "o3", 424, 1068, .78, 560, 1850, 6); bob(o3, DAY2, DUR, 4, .6);
  const shiv = []; for (let t = DAY2; t < DUR; t += .12) shiv.push([t, (Math.round(t / .12) % 2) ? 3 : -3, "io"]); E.K(o3, "x", shiv);
  const rw = fig(G2, "rosa", 634, 1004, .36, 900, 1260, 4); bob(rw, DAY2, DUR, 4, .5);                // Dona Rosa, far away, watching
  const eye = E.el(G2, "abs", "left:830px;top:830px;font-size:70px;z-index:5", "👀");
  const cold = E.el(G2, "abs", "left:690px;top:930px;font-size:80px;z-index:7", "🥶");
  const card = E.el(S.el, "abs", "inset:0;background:#141a2e;z-index:14;opacity:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:84px;color:#fff6c8;text-align:center", "NEXT DAY…");
  E.K(card, "o", [[CARD, 0], [CARD + .1, 1], [DAY2 + .2, 1], [DAY2 + .35, 0]]);

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "PASSENGERS LISTENING: 0"], [UNDER + .9, "PASSENGERS LISTENING: 4"], [TELL, "PASSENGERS LISTENING: 5"], [JACKET, "PASSENGERS LISTENING: ALL"], [DAY2 + .3, "MUM'S INFORMANTS: 1 BUS"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= UNDER + .9 ? C.coralD : C.ink; pill.style.fontSize = s.length > 24 ? "42px" : "48px"; });
  PL.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.1], [t + .2, 1, "out"]]));

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
  const MUMB = (h, t0, t1, fs = 44) => bubble(`<div style="font-size:26px;color:#7a8791;margin-bottom:2px">📞 MUM (ON SPEAKER)</div>${h}`, 360, 920, 680, t0, t1, fs, 11);
  MUMB(`Olá, filho! Did you eat lunch?${sub("(Hi, son!)")}`, OLA, BUS - .1, 46);
  bubble("Mum, I'm on the bus.", 300, 1000, 460, BUS, UNDER - .1, 46);
  MUMB("Are you wearing the underwear I bought you? The ones with the little hearts?", UNDER, SPK - .1, 40);
  bubble("Mum! You're on speaker!", 300, 1000, 480, SPK, INES - .1, 48);
  MUMB("And did you call that nice girl, Inês?", INES, TELL - .1, 46);
  bubble("He didn't. I can tell.", 820, 1040, 420, TELL, MROSA - .1, 48);
  MUMB("Ai, Dona Rosa! Tell him to wear a jacket!", MROSA, JACKET - .1, 46);
  bubble("Wear a jacket, man!", 930, 760, 420, JACKET, DINES - .1, 46);
  bubble("And call Inês!", 860, 740, 380, DINES, BEIJ - .1, 50, 12);
  bubble(`Beijinhos!${sub("(Kisses!)")}`, 540, 900, 400, BEIJ, CALL1, 58, 13);
  MUMB("Dona Rosa says you didn't wear the jacket.", NEXT, CAR - .1, 46);
  bubble("I'm buying a car.", 560, 1000, 440, CAR, STAMP + .3, 52);
  E.stamp(E.el(S.el, "abs", "left:30px;top:640px;width:1020px;display:flex;justify-content:center;z-index:13"), "MUM'S SPY NETWORK: ACTIVE.", STAMP, { size: 66, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(0, "sfx/elx-bus-brakes.wav", { vol: .18, duck: false, to: DAY2 }); E.clip(DAY2, "sfx/wind-gust.wav", { vol: .35, duck: false, to: DUR - DAY2 });
  E.clip(RING, "sfx/elx-phone-ring.wav", { vol: .8, to: .9 });
  E.clip(OLA, "voices/ep118/m_ola.wav", { vol: 1.3 }); E.clip(BUS, "voices/ep118/o_bus.wav", { vol: 1.2 });
  E.clip(UNDER, "voices/ep118/m_under.wav", { vol: 1.3 }); E.clip(UNDER + 2.2, "sfx/crowd-ooh.wav", { vol: .5, to: 1.6 });
  E.clip(SPK, "voices/ep118/o_speaker.wav", { vol: 1.25 }); E.clip(INES, "voices/ep118/m_ines.wav", { vol: 1.3 });
  E.clip(TELL, "voices/ep118/r_tell.wav", { vol: 1.35 }); E.clip(MROSA, "voices/ep118/m_rosa.wav", { vol: 1.3 });
  E.clip(JACKET, "voices/ep118/w_jacket.wav", { vol: 1.3 }); E.clip(DINES, "voices/ep118/d_ines.wav", { vol: 1.3 });
  E.clip(BEIJ, "voices/ep118/m_beij.wav", { vol: 1.2 }); E.clip(BEIJ + .12, "voices/ep118/r_beij.wav", { vol: 1.2 }); E.clip(BEIJ + .25, "voices/ep118/d_beij.wav", { vol: 1.2 });
  E.S(CARD, "whoosh", .4); E.clip(NEXT - .3, "sfx/elx-phone-ring.wav", { vol: .6, to: .5 });
  E.clip(NEXT, "voices/ep118/m_next.wav", { vol: 1.3 }); E.clip(CAR, "voices/ep118/o_car.wav", { vol: 1.25 }); E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "When *mum* calls on the bus", { size: 50, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[29.2, 1], [29.45, 1.18, "out"], [29.75, 1, "io"]]);
}
