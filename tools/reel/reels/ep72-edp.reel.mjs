// EP.72 "Portuguese dads and the electricity bill" — the teenager opens the fridge: Dad bursts in: "Close the fridge! You are cooling the
// whole street!" "Dad, it was two seconds!" The phone charger: yanked — "Charge it at school." A light left on: click — and the classic
// Portuguese dad line, in Portuguese: "Achas que eu trabalho na EDP?!" (Do you think I work for the electricity company?!) The heater:
// unplugged. The teen in a blanket: "…It's twelve degrees in here." The bill arrives: €11. Dad frames it: "Eleven euros. Beautiful."
export const meta = {
  id: "ep72-edp", date: "2026-12-04",
  images: { tp: "characters/cutouts/teen_phone.webp", tb: "characters/cutouts/teen_blanket.webp", za: "characters/cutouts/ze_angry.webp", zf: "characters/cutouts/ze_frame.webp" },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 57, seed: 721, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 19.4, FLOOR = 1760, FRIDGE = .6, TWO = 4.6, CHG = 7.4, EDP = 9.3, HEAT = 11.6, COLD = 12.4, BILL = 14.8, ELEV = 15.5;
  const S = E.scene("edp", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  // ---------------- the flat ----------------
  const wall = E.el(S.el, "abs", "inset:0;background:#f1e6d2");
  E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:repeating-linear-gradient(90deg,rgba(120,90,50,.05) 0 70px,transparent 70px 140px)");
  E.el(S.el, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background:repeating-linear-gradient(90deg,#b98a5e 0 160px,#a97c52 160px 320px)`);
  const dim = E.el(S.el, "abs", "inset:0;background:#1a2440;z-index:6;pointer-events:none");
  E.F(t => { dim.style.opacity = t >= EDP + .2 ? .22 : 0; });
  // the fridge
  const fr = E.el(S.el, "abs", `left:60px;top:780px;width:320px;height:${FLOOR - 780}px;background:linear-gradient(90deg,#e9ecef,#cfd6dc);border-radius:18px;border:6px solid #aeb8c2;z-index:1`);
  E.el(fr, "abs", "left:0;top:330px;width:100%;height:6px;background:#aeb8c2");
  const inside = E.el(S.el, "abs", `left:66px;top:786px;width:308px;height:${FLOOR - 792}px;background:linear-gradient(180deg,#fffbe0,#f0ead0);border-radius:12px;z-index:1;opacity:0`);
  for (let k = 0; k < 3; k++) E.el(inside, "abs", `left:10px;top:${200 + k * 260}px;width:288px;height:8px;background:#cfd6dc`);
  E.el(inside, "abs", "left:40px;top:120px;width:70px;height:80px;background:#e5484d;border-radius:8px"); E.el(inside, "abs", "left:150px;top:360px;width:90px;height:100px;background:#f2c230;border-radius:40px");
  const door = E.el(S.el, "abs", `left:60px;top:780px;width:320px;height:${FLOOR - 780}px;background:linear-gradient(90deg,#e9ecef,#cfd6dc);border-radius:18px;border:6px solid #aeb8c2;transform-origin:100% 50%;z-index:2`);
  E.el(door, "abs", "left:24px;top:120px;width:16px;height:160px;border-radius:8px;background:#8a95a0");
  E.K(door, "sx", [[FRIDGE, 1], [FRIDGE + .3, .08, "out"], [FRIDGE + 1.1, .08], [FRIDGE + 1.3, 1, "in"]]);
  E.K(inside, "o", [[FRIDGE - .01, 0], [FRIDGE, 1], [FRIDGE + 1.3, 1], [FRIDGE + 1.31, 0]]);
  const cold = [0, 1, 2].map(i => E.el(S.el, "abs", `left:${380 + i * 60}px;top:${1000 + i * 100}px;width:120px;height:30px;border-radius:15px;background:rgba(180,220,255,.8);z-index:3;opacity:0`));
  E.F(t => cold.forEach((c, i) => { const u = ((t * 1.5 + i * .3) % 1); c.style.opacity = t > FRIDGE && t < FRIDGE + 1.3 ? 1 - u : 0; c.style.transform = `translateX(${u * 400}px)`; }));
  // lamp, socket, heater
  const lamp = E.el(S.el, "abs", "left:520px;top:440px;width:4px;height:120px;background:#555");
  const shade = E.el(S.el, "abs", "left:462px;top:550px;width:120px;height:70px;border-radius:60px 60px 10px 10px;background:#f2c230;box-shadow:0 30px 80px 30px rgba(255,220,120,.6)");
  E.F(t => { shade.style.boxShadow = t >= EDP ? "none" : "0 30px 80px 30px rgba(255,220,120,.6)"; shade.style.background = t >= EDP ? "#c9a24a" : "#f2c230"; });
  const heater = E.el(S.el, "abs", `left:840px;top:${FLOOR - 220}px;width:200px;height:220px;border-radius:14px;background:repeating-linear-gradient(90deg,#f4f4f4 0 24px,#d8d8d8 24px 32px);z-index:1`);
  const glowH = E.el(S.el, "abs", `left:800px;top:${FLOOR - 300}px;width:280px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,140,60,.5),transparent 70%);z-index:1`);
  E.K(glowH, "o", [[HEAT, 1], [HEAT + .1, 0]]);
  const therm = E.el(S.el, "abs", "left:760px;top:470px;background:#fff;border-radius:16px;padding:8px 16px;font-weight:900;font-size:44px;z-index:8;box-shadow:0 6px 14px rgba(0,0,0,.15)", "");
  E.F(t => { const d = t < HEAT ? 19 : Math.round(19 - Math.min(7, (t - HEAT) / .12)); const s = `${d}°C`; if (therm.textContent !== s) therm.textContent = s; therm.style.color = d <= 13 ? "#2f6db5" : "#e0662f"; });

  // ---------------- the teen and the dad ----------------
  const tw = E.el(S.el, "abs", "left:330px;top:0;width:1px;height:1px;z-index:4");
  const t1 = E.img(tw, "tp", `position:absolute;left:0;top:${FLOOR + 40 - 1063 * .76}px;width:${500 * .76}px;height:${1063 * .76}px`);
  const t2 = E.img(tw, "tb", `position:absolute;left:10px;top:${FLOOR + 40 - 1076 * .76}px;width:${448 * .76}px;height:${1076 * .76}px;opacity:0`);
  E.F(t => { const b = t >= COLD - .1; t1.style.opacity = b ? 0 : 1; t2.style.opacity = b ? 1 : 0; });
  const tb = []; for (let t = 0; t < FRIDGE + .6; t += .6) tb.push([t, 0, "io"], [t + .3, -6, "io"]); E.K(tw, "y", tb);   // frame-0 motion
  const shiver = []; for (let t = COLD; t < DUR; t += .1) shiver.push([t, (Math.round(t * 10) % 2) ? 3 : -3]); E.K(tw, "x", shiver);
  const dw = E.el(S.el, "abs", "left:0;top:0;width:1px;height:1px;z-index:5");
  const d1 = E.img(dw, "za", `position:absolute;left:600px;top:${FLOOR + 40 - 1014 * .78}px;width:${749 * .78}px;height:${1014 * .78}px`);
  const d2 = E.img(dw, "zf", `position:absolute;left:640px;top:${FLOOR + 40 - 1026 * .78}px;width:${524 * .78}px;height:${1026 * .78}px;opacity:0`);
  E.F(t => { const f = t >= ELEV - .2; d1.style.opacity = f ? 0 : 1; d2.style.opacity = f ? 1 : 0; });
  E.K(dw, "x", [[FRIDGE + .5, 700], [FRIDGE + .8, 0, "out"], [CHG - .2, 0], [CHG, -60, "out"], [CHG + .3, 0, "io"], [HEAT - .2, 0], [HEAT, 60, "out"], [HEAT + .3, 0, "io"]]);
  const FX = 640 + 524 * .78 * .351, FY = FLOOR + 40 - 1026 * .78 + 1026 * .78 * .306, FW = 524 * .78 * .325, FH = 1026 * .78 * .177;
  const billTxt = E.el(S.el, "abs", `left:${FX}px;top:${FY}px;width:${FW}px;height:${FH}px;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:6;opacity:0;font-weight:900;color:#1d2b36;line-height:1.05`, "");
  E.el(billTxt, "", "font-size:16px;color:#7a8791", "ELECTRICITY"); E.el(billTxt, "", "font-size:40px;color:#1f7a3a", "€11");
  E.K(billTxt, "o", [[ELEV - .21, 0], [ELEV - .2, 1]]);
  const charger = E.el(S.el, "abs", "left:700px;top:1330px;width:12px;height:180px;background:#fff;border-radius:6px;z-index:3;opacity:0;transform-origin:50% 100%");
  E.K(charger, "o", [[CHG - .8, 0], [CHG - .79, 1], [CHG + .3, 1], [CHG + .31, 0]]);
  E.K(charger, "r", [[CHG, 0], [CHG + .3, -70, "out"]]);
  const letter = E.el(S.el, "abs", "left:760px;top:1150px;width:200px;height:130px;background:#fffdf3;border:5px solid #1d2b36;border-radius:8px;z-index:7;opacity:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:30px;color:#1d2b36", "BILL");
  E.K(letter, "o", [[BILL - .01, 0], [BILL, 1], [ELEV - .3, 1], [ELEV - .2, 0]]); E.K(letter, "x", [[BILL, -500], [BILL + .4, 0, "out"]]); E.K(letter, "r", [[BILL, -30], [BILL + .4, 5, "out"]]);
  const sparkles = [0, 1, 2, 3].map(i => E.el(S.el, "abs", `left:${760 + (i % 2) * 180}px;top:${1100 + Math.floor(i / 2) * 200}px;font-size:60px;color:#f2c230;z-index:7;opacity:0`, "✦"));
  E.F(t => sparkles.forEach((s, i) => { s.style.opacity = t > ELEV && Math.floor(t * 3 + i) % 2 ? 1 : 0; }));

  // ---------------- HUD ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  const P = [[0, "TUESDAY, 20:00"], [FRIDGE + .6, "OFFENCE #1: FRIDGE"], [CHG - .2, "OFFENCE #2: CHARGER"], [EDP - .2, "OFFENCE #3: A LIGHT"], [HEAT - .2, "OFFENCE #4: HEATING"], [BILL, "END OF THE MONTH"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = s.startsWith("OFFENCE") ? C.coralD : t >= BILL ? "#1f7a3a" : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.2], [t + .2, 1, "out"]]));

  // ---------------- bubbles, stamp ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble("Close the fridge! You are cooling the whole street!", 440, 620, 600, 360, FRIDGE + .7, TWO - .05, 44);
  bubble("Dad, it was two seconds!", 180, 700, 460, 220, TWO, CHG - .3, 48);
  bubble("Charge it at school.", 520, 700, 480, 300, CHG, EDP - .1, 50);
  bubble(`Achas que eu trabalho na EDP?!${sub("(Do you think I work for the electricity company?!)")}`, 400, 620, 640, 400, EDP, HEAT - .05, 44);
  bubble("…It's twelve degrees in here.", 120, 720, 520, 280, COLD, BILL - .05, 46);
  bubble("Eleven euros. Beautiful.", 440, 700, 520, 320, ELEV, DUR - .4, 50);
  const sb = E.el(S.el, "abs", "left:60px;top:1480px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "€11. WORTH IT.", ELEV + 1.8, { size: 110, rot: -6, bg: "#1f7a3a", shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  E.clip(FRIDGE, "sfx/fridge-open.wav", { vol: 1.0 });
  E.S(FRIDGE + .5, "whoosh", .6); E.clip(FRIDGE + .7, "voices/ep72/d_fridge.wav", { vol: 1.2 }); E.S(FRIDGE + 1.3, "thud", .6);
  E.clip(TWO, "voices/ep72/t_two.wav", { vol: 1.15 });
  E.clip(CHG, "sfx/unplug.wav", { vol: 1.5 }); E.clip(CHG + .1, "voices/ep72/d_school.wav", { vol: 1.2 });
  E.clip(EDP - .1, "sfx/switch-click.wav", { vol: 3 }); E.clip(EDP, "voices/ep72/d_edp.wav", { vol: 1.3 });
  E.clip(HEAT, "sfx/unplug.wav", { vol: 1.5 }); E.clip(HEAT + .2, "sfx/wind-gust.wav", { vol: .3, to: 1.5 });
  E.clip(COLD, "voices/ep72/t_twelve.wav", { vol: 1.15 }); E.clip(COLD + .2, "sfx/teeth-chatter.wav", { vol: .5 });
  E.clip(BILL, "sfx/mail-slot.wav", { vol: 1.2 });
  E.S(ELEV - .2, "sparkle", .8); E.clip(ELEV - .1, "sfx/angel-choir.wav", { vol: .4 });
  E.clip(ELEV, "voices/ep72/d_eleven.wav", { vol: 1.2 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "Portuguese dads vs *electricity*", { size: 48, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[18.6, 1], [18.85, 1.18, "out"], [19.2, 1, "io"]]);
}
