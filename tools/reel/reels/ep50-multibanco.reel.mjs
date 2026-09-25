// EP.50 "The Portuguese cash machine" — good news for once. BACK HOME: the cash machine has one button, CASH. In Portugal Otto presses
// the Multibanco and the menu keeps going: cash ✓, pay bills ✓, phone top-up ✓, pay taxes ✓ — "It can pay my TAXES?!" He pushes his
// luck: "Can it book a dentist?" → BREVEMENTE (coming soon). "…Can it find me a girlfriend?" → BREVEMENTE ♥. A grandma steps in and
// pays five bills in eight seconds, receipts flying. Otto hugs the machine: LOVE AT FIRST BEEP. Voiced (Otto) + beeps/printer.
export const meta = {
  id: "ep50-multibanco", date: "2026-11-12",
  images: {
    ex: "characters/cutouts/otto-casual_excited.webp", press: "characters/cutouts/otto-casual_press.webp", jaw: "characters/cutouts/otto-casual_jawdrop.webp",
    grab: "characters/cutouts/otto-casual_grab.webp", card: "characters/cutouts/dona_card.webp", smirk: "characters/cutouts/dona_smirk.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 60, seed: 501, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 17.2, FLOOR = 1580, MENU = 3.0, TAX = 4.9, DENT = 7.2, GF = 9.3, GRAN = 11.3, HUG = 14.0;
  const S = E.scene("atm", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  // ---------------- the street wall and the machine ----------------
  E.el(S.el, "abs", "inset:0;background:#f1e4c8");
  E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:linear-gradient(rgba(0,0,0,.05) 3px,transparent 3px),linear-gradient(90deg,rgba(0,0,0,.05) 3px,transparent 3px);background-size:180px 90px");
  E.el(S.el, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background:repeating-linear-gradient(135deg,#ece6d8 0 30px,#d9d0bd 30px 60px)`);
  const atm = E.el(S.el, "abs", "left:520px;top:620px;width:540px;height:960px;background:linear-gradient(180deg,#46607a,#2f4459);border-radius:26px 26px 6px 6px;box-shadow:0 18px 30px rgba(0,0,0,.25)");
  E.el(atm, "abs", "left:30px;top:22px;width:480px;height:30px;border-radius:10px;background:#5d7a96");
  const scr = E.el(atm, "abs", "left:60px;top:80px;width:420px;height:360px;background:#eaf3fb;border-radius:10px;border:8px solid #1d2b36;overflow:hidden");
  for (let i = 0; i < 4; i++) for (const x of [16, 494]) E.el(atm, "abs", `left:${x}px;top:${120 + i * 80}px;width:30px;height:40px;border-radius:6px;background:#9fb3c6`);
  const kp = E.el(atm, "abs", "left:90px;top:490px;width:260px;height:260px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px");
  for (let i = 0; i < 12; i++) E.el(kp, "", `border-radius:8px;background:${i === 9 ? "#e5484d" : i === 11 ? "#2f9e6f" : "#dfe6ec"};height:56px`);
  E.el(atm, "abs", "left:390px;top:500px;width:110px;height:26px;border-radius:6px;background:#1d2b36");                  // card slot
  E.el(atm, "abs", "left:390px;top:640px;width:110px;height:18px;border-radius:6px;background:#1d2b36");                  // receipt slot
  const rcpt = E.el(atm, "abs", "left:400px;top:652px;width:90px;height:0;background:#fffdf6;box-shadow:0 4px 8px rgba(0,0,0,.2);background-image:repeating-linear-gradient(180deg,transparent 0 14px,rgba(0,0,0,.18) 14px 17px);z-index:3");
  const RK = [[0, 0], [MENU + .5, 0], [TAX + .3, 120], [GRAN, 120], [GRAN + 1.6, 300], [HUG, 300], [HUG + .01, 0]];
  E.F(t => { let v = RK[0][1]; for (let i = 0; i < RK.length - 1; i++) if (t >= RK[i][0]) { const [a, va] = RK[i], [b, vb] = RK[i + 1]; v = t >= b ? vb : va + (vb - va) * (t - a) / (b - a); } rcpt.style.height = `${v}px`; });

  // screen contents
  const idle = E.el(scr, "abs", "inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#1d2b36;font-weight:900;font-size:38px;text-align:center", "Bem-vindo<div style='font-size:28px;color:#7a8791;margin-top:8px'>Insira o cartão</div>");
  const menu = E.el(scr, "abs", "inset:0;padding:10px 16px;box-sizing:border-box;opacity:0");
  E.el(menu, "", "font-weight:900;font-size:26px;color:#fff;background:#2f6db5;border-radius:8px;padding:4px 12px;margin-bottom:8px", "MENU");
  const ITEMS = [["Levantamentos", "Cash", MENU + .4], ["Pagar serviços", "Pay bills", MENU + .9], ["Carregamentos", "Phone top-up", MENU + 1.4], ["Pagar ao Estado", "Pay taxes", TAX], ["Transferências", "Transfers", 99], ["Mais opções…", "More…", DENT - .2]];
  const rows = ITEMS.map(([pt, en, t]) => {
    const r = E.el(menu, "", "display:flex;align-items:center;justify-content:space-between;background:#fff;border-radius:8px;margin:5px 0;padding:4px 12px;box-shadow:0 2px 0 rgba(0,0,0,.06)");
    const tx = E.el(r, "", "");
    E.el(tx, "", "font-weight:900;font-size:24px;color:#1d2b36;line-height:1.05", pt);
    E.el(tx, "", "font-weight:800;font-size:18px;color:#7a8791", en);
    const ck = E.el(r, "", "font-weight:900;font-size:30px;color:#1f7a3a;opacity:0", "✓");
    E.F(tt => { ck.style.opacity = tt >= t ? 1 : 0; r.style.background = tt >= t && tt < t + .35 ? "#d8f3e4" : "#fff"; });
    return r;
  });
  const ask = E.el(scr, "abs", "inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;opacity:0;text-align:center");
  const q = E.el(ask, "", "font-weight:800;font-size:30px;color:#1d2b36;background:#fff;border:3px solid #9fb3c6;border-radius:10px;padding:10px 16px;width:100%;box-sizing:border-box", "");
  const ans = E.el(ask, "", "margin-top:22px;font-weight:900;font-size:44px;color:#e07a1a;opacity:0", "");
  E.F(t => {
    idle.style.opacity = t < MENU ? 1 : 0;
    menu.style.opacity = t >= MENU && t < DENT ? 1 : 0;
    ask.style.opacity = t >= DENT && t < GRAN ? 1 : 0;
    const typ = (s, t0) => s.slice(0, Math.max(0, Math.min(s.length, Math.floor((t - t0) / .045))));
    const qs = t < GF ? typ("Book a dentist?", DENT + .2) : typ("Find me a girlfriend?", GF + .2);
    if (q.textContent !== qs) q.textContent = qs;
    const a = t >= GF + 1.4 ? "BREVEMENTE ♥" : t >= DENT + 1.4 && t < GF ? "BREVEMENTE" : "";
    if (ans.textContent !== a) ans.textContent = a; ans.style.opacity = a ? 1 : 0;
  });
  const sub = E.el(scr, "abs", "left:0;bottom:8px;width:100%;text-align:center;font-weight:800;font-size:20px;color:#7a8791;opacity:0", "(coming soon)");
  E.F(t => { sub.style.opacity = (t >= DENT + 1.4 && t < GRAN) ? 1 : 0; });
  const paid = E.el(scr, "abs", "inset:0;display:flex;align-items:center;justify-content:center;background:#1f7a3a;color:#fff;font-weight:900;font-size:64px;opacity:0", "✓ PAGO");
  E.F(t => { const k = Math.floor((t - GRAN - .5) / .32); paid.style.opacity = t > GRAN + .5 && t < GRAN + .5 + 5 * .32 && ((t - GRAN - .5) % .32) < .2 ? 1 : 0; });
  const love = E.el(scr, "abs", "inset:0;display:flex;align-items:center;justify-content:center;font-size:120px;color:#e5484d;opacity:0", "♥");
  E.K(love, "o", [[HUG, 0], [HUG + .1, 1]]); E.K(love, "s", [[HUG, .6], [HUG + .3, 1.1, "back"], [HUG + .6, 1, "io"], [HUG + .9, 1.1, "io"], [HUG + 1.2, 1, "io"]]);

  // ---------------- "back home" inset ----------------
  const home = E.el(S.el, "abs", "left:60px;top:440px;width:390px;background:#fff;border-radius:22px;box-shadow:0 12px 26px rgba(0,0,0,.18);padding:16px;box-sizing:border-box;z-index:7");
  E.el(home, "", "font-weight:900;font-size:30px;color:#7a8791;margin-bottom:8px", "BACK HOME:");
  const hs = E.el(home, "", "height:150px;background:#2d3640;border-radius:12px;display:flex;align-items:center;justify-content:center");
  E.el(hs, "", "background:#7cff9e;color:#1d2b36;font-weight:900;font-size:44px;padding:10px 34px;border-radius:10px", "CASH");
  E.el(home, "", "font-weight:800;font-size:26px;color:#1d2b36;margin-top:8px;text-align:center", "(that's it)");
  E.K(home, "o", [[0, 1], [MENU + 1.6, 1], [MENU + 1.9, 0]]);

  // ---------------- Otto ----------------
  const OS = .82, ot = E.el(S.el, "abs", `left:30px;top:0;width:1px;height:${FLOOR}px;z-index:5`);
  const F = { ex: [625, 1078], press: [612, 1044], jaw: [398, 1044], grab: [625, 1078] };
  const oIm = Object.entries(F).map(([n, [w, h]]) => [n, E.img(ot, n, `position:absolute;left:${n === "jaw" ? 60 : 0}px;top:${FLOOR - h * OS}px;width:${w * OS}px;height:${h * OS}px;opacity:0`)]);
  const FACE = [[0, "ex"], [MENU - .3, "press"], [TAX + .15, "jaw"], [DENT, "press"], [GRAN, "ex"], [HUG, "grab"]];
  E.F(t => { const f = at(FACE, t); oIm.forEach(([n, el]) => { el.style.opacity = n === f ? 1 : 0; }); });
  const obob = []; for (let t = 0; t < MENU - .3; t += .8) obob.push([t, 0, "io"], [t + .4, -8, "io"]);
  E.K(ot, "y", obob);                                                                                                   // frame-0 motion
  const pushes = []; for (const t of [MENU - .1, MENU + .4, MENU + .9, MENU + 1.4, TAX - .1, DENT + .1, GF + .1]) pushes.push([t - .01, 0], [t, 16], [t + .12, 0, "out"]);
  E.K(ot, "x", [...pushes, [GRAN - .01, 0], [GRAN + .3, -640, "in"], [HUG - .4, -640], [HUG, 60, "out"]]);
  // the grandma: five bills, eight seconds
  const gw = E.el(S.el, "abs", `left:0;top:0;width:1px;height:${FLOOR}px;z-index:6`);
  const g1 = E.img(gw, "card", `position:absolute;left:0;top:${FLOOR - 1020 * .78}px;width:${684 * .78}px;height:${1020 * .78}px`);
  const g2 = E.img(gw, "smirk", `position:absolute;left:0;top:${FLOOR - 1014 * .78}px;width:${665 * .78}px;height:${1014 * .78}px;opacity:0`);
  E.F(t => { const sm = t >= GRAN + 2.2; g1.style.opacity = sm ? 0 : 1; g2.style.opacity = sm ? 1 : 0; });
  E.K(gw, "x", [[GRAN, -700], [GRAN + .35, 0, "out"], [GRAN + 2.4, 0], [GRAN + 2.8, -760, "in"]]);
  const cnt = E.el(S.el, "abs", "left:60px;top:560px;background:#1f7a3a;color:#fff;font-weight:900;font-size:46px;padding:10px 24px;border-radius:16px;z-index:8;opacity:0;box-shadow:0 8px 18px rgba(0,0,0,.2)", "");
  E.F(t => { const n = Math.max(0, Math.min(5, Math.floor((t - GRAN - .5) / .32) + 1)), s = `${n} bills · ${Math.min(8, Math.round(Math.max(0, t - GRAN) * 4))} s`; if (cnt.textContent !== s) cnt.textContent = s; cnt.style.opacity = t > GRAN + .45 && t < HUG - .2 ? 1 : 0; });
  // receipts flying out while she pays
  for (let k = 0; k < 5; k++) {
    const t = GRAN + .6 + k * .32, r = E.el(S.el, "abs", "left:930px;top:1270px;width:70px;height:120px;background:#fffdf6;box-shadow:0 4px 8px rgba(0,0,0,.2);background-image:repeating-linear-gradient(180deg,transparent 0 14px,rgba(0,0,0,.18) 14px 17px);z-index:7;opacity:0");
    E.K(r, "o", [[t - .01, 0], [t, 1], [t + .8, 1], [t + 1.0, 0]]); E.K(r, "y", [[t, 0], [t + .9, 420, "in"]]); E.K(r, "x", [[t, 0], [t + .9, (k % 2 ? 1 : -1) * 160 - 60]]); E.K(r, "r", [[t, 0], [t + .9, (k % 2 ? 1 : -1) * 220]]);
    E.clip(t, "sfx/atm-beep.wav", { vol: .8 });
  }
  const hearts = [0, 1, 2, 3].map(i => E.el(S.el, "abs", `left:${480 + i * 40}px;top:900px;font-size:70px;color:#e5484d;z-index:8;opacity:0`, "♥"));
  E.F(t => hearts.forEach((h, i) => { const u = ((t - HUG - .2 + i * .35) % 1.4) / 1.4; h.style.opacity = t > HUG + .2 ? 1 - u : 0; h.style.transform = `translate(${Math.sin(u * 6 + i) * 30}px,${-u * 260}px) scale(${.6 + u * .6})`; }));

  // ---------------- labels, bubbles, stamp ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  E.F(t => { const s = t < MENU ? "CASH MACHINE · PORTUGAL" : `OPTIONS: ${Math.min(6, 1 + ITEMS.filter(i => t >= i[2]).length + (t >= DENT ? 1 : 0))}+`; if (pill.textContent !== s) pill.textContent = s; });
  const bubble = (html, left, top, w, tail, t0, t1, fs = 54) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:9;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:32px;padding:18px 26px 22px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("It can pay my TAXES?!", 40, 520, 460, 180, TAX + .3, DENT - .1, 54);
  bubble("Can it book a dentist?", 40, 520, 460, 180, DENT + .2, GF - .1, 52);
  bubble("…Can it find me a girlfriend?", 40, 500, 470, 180, GF + .1, GRAN - .1, 48);
  const sb = E.el(S.el, "abs", "left:60px;top:1600px;width:960px;display:flex;justify-content:center;z-index:10");
  const st = E.stamp(sb, "LOVE AT FIRST BEEP.", HUG + .8, { size: 88, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  E.clip(0, "sfx/street-sunny.wav", { vol: 2.5, duck: false }); E.clip(4.9, "sfx/street-sunny.wav", { vol: 2.5, duck: false }); E.clip(9.8, "sfx/street-sunny.wav", { vol: 2.5, duck: false }); E.clip(14.7, "sfx/street-sunny.wav", { vol: 2.5, duck: false, to: DUR - 14.7 });
  for (const t of [MENU - .1, MENU + .4, MENU + .9, MENU + 1.4, TAX - .1, DENT + .1, GF + .1]) E.clip(t, "sfx/atm-beep.wav", { vol: .8 });
  E.clip(MENU + .5, "sfx/printer.wav", { vol: .45, to: 1.6 });
  E.clip(TAX + .3, "voices/ep50/o_taxes.wav", { vol: 1.15 });
  E.clip(DENT + .2, "voices/ep50/o_dentist.wav", { vol: 1.15 }); E.S(DENT + 1.4, "nope", .6);
  E.clip(GF + .1, "voices/ep50/o_girlfriend.wav", { vol: 1.2 }); E.S(GF + 1.4, "nope", .6);
  E.S(GRAN, "whoosh", .6); E.clip(GRAN + .6, "sfx/printer.wav", { vol: .5, to: 1.6 });
  E.S(HUG + .1, "sparkle", .8);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "The Portuguese *cash machine*", { size: 52, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[16.4, 1], [16.65, 1.18, "out"], [17.0, 1, "io"]]);
}
