// EP.126 "Paying by card in a Portuguese café" — Buck, after an €0,80 coffee: "Can I pay by card?" Waiter: "Só dinheiro." (Cash only.) "Phone?" "Só dinheiro." "…Watch?" "Só… dinheiro."
// "Where's the ATM?" "É já ali!" (It's right there!) — 1.2 km uphill, a Multibanco queue of grannies counting coins, the first machine FORA DE SERVIÇO, the second one finally gives €20. Back, soaked:
// "Here! Twenty euros!" Waiter: "Não tenho troco." (I don't have change.) "Pay tomorrow!" Buck, flat: "…I'll have another coffee." Stamp: COFFEE €0.80 · CARDIO 1.2 KM.
export const meta = {
  id: "ep126-cash", date: "2027-01-27",
  images: {
    cafe: "characters/scenes/bg_tasca.webp", street: "characters/scenes/bg_street.webp",
    b1: "characters/cutouts/buck_card.webp", b2: "characters/cutouts/buck_confused.webp", run: "characters/cutouts/buck_sprint.webp",
    w1: "characters/cutouts/waiter_tray.webp", w2: "characters/cutouts/waiter_offended.webp", w3: "characters/cutouts/waiter_facepalm.webp", atm: "characters/props/atm-queue.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 114, root: 52, seed: 1261, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [2, 5, 9]] });
  const DUR = 28.25, CARD = 0.3, SO1 = 1.75, PHONE = 3.2, SO2 = 4.05, WATCH = 6.2, SO3 = 7.45, ATM = 9.85, JAALI = 11.25, RUN = 12.45, QUEUE = 14.65, CASH = 17.05, BACK = 18.75, TWENTY = 18.95, TROCO = 21.25, TOMOR = 22.65, ANOTHER = 24.05, STAMP = 25.95;
  const S = E.scene("cash", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };
  const CAFE = [[0, RUN], [BACK, DUR]];

  // ================= the café =================
  const G1 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G1, CAFE);
  E.img(G1, "cafe", BG);
  const w1 = fig(G1, "w1", 628, 1050, .72, 800, 1860, 5), w2 = fig(G1, "w2", 628, 1050, .72, 800, 1860, 5), w3 = fig(G1, "w3", 628, 1050, .72, 800, 1860, 5);
  E.F(t => { const k = t < SO3 ? 0 : t < JAALI ? 1 : t < TROCO ? 0 : t < TOMOR ? 2 : 0; [w1, w2, w3].forEach((w, i) => { w.style.opacity = i === k ? 1 : 0; }); });
  [w1, w2, w3].forEach(w => bob(w, 0, DUR, 4, .7));
  const b1 = fig(G1, "b1", 503, 1000, .74, 280, 1860, 6), b2 = fig(G1, "b2", 688, 1024, .72, 280, 1860, 6);
  E.F(t => { b1.style.opacity = t < ATM ? 1 : 0; b2.style.opacity = t >= ATM ? 1 : 0; });
  bob(b1, 0, ATM, 6, .5); bob(b2, ATM, DUR, 4, .6);
  // the sweat once he is back
  const sweat = E.el(G1, "abs", "left:120px;top:1100px;font-size:80px;z-index:7;opacity:0", "💦"); show(sweat, [[BACK, DUR]]);
  const sk = []; for (let t = BACK; t < DUR; t += .6) sk.push([t, 0, "io"], [t + .3, -20, "io"]); E.K(sweat, "y", sk);
  // the coffee cup and the bill on the counter (drawn in code)
  const bill = E.el(G1, "abs", "left:420px;top:1500px;width:200px;height:120px;background:#fffdf6;border-radius:12px;border:4px solid #d9cfb9;z-index:7;text-align:center;box-shadow:0 6px 12px rgba(0,0,0,.25)");
  E.el(bill, "abs", "left:0;top:10px;width:200px;font-weight:900;font-size:30px;color:#1d2b36", "☕ BICA");
  E.el(bill, "abs", "left:0;top:50px;width:200px;font-weight:900;font-size:52px;color:#c73a2f", "€0,80");
  // the "SÓ DINHEIRO" sign on the counter
  const sign = E.el(G1, "abs", "left:520px;top:760px;width:520px;height:150px;background:#1d2b36;border-radius:16px;border:6px solid #f4c542;z-index:4;text-align:center;opacity:0;transform:rotate(3deg)");
  E.el(sign, "abs", "left:0;top:14px;width:508px;font-weight:900;font-size:56px;color:#f4c542;letter-spacing:2px;white-space:nowrap", "SÓ DINHEIRO");
  E.el(sign, "abs", "left:0;top:90px;width:508px;font-weight:800;font-size:30px;color:#cfd6dc", "(cash only) 💶");
  show(sign, [[SO1 + .2, RUN], [BACK, DUR]]); E.pop(sign, SO1 + .2, { from: .3, dur: .3 });
  // the €20 note
  const note = E.el(G1, "abs", "left:150px;top:880px;width:260px;height:130px;background:linear-gradient(90deg,#4f9fd6,#86c1e8 45%,#4f9fd6);border:4px solid #2a6a96;border-radius:10px;z-index:8;opacity:0;text-align:right;font-weight:900;font-size:64px;color:#174a6b;padding:24px 20px 0 0;box-sizing:border-box;box-shadow:0 8px 16px rgba(0,0,0,.3)", "€20");
  show(note, [[TWENTY, TROCO + 1.2]]); E.pop(note, TWENTY, { from: .3, dur: .3 }); E.K(note, "r", [[TWENTY, -8], [TROCO, -3]]);

  // ================= the run: "é já ali" =================
  const G2 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G2, [[RUN, BACK]]);
  const sbg = E.el(G2, "abs", "inset:0;transform-origin:50% 50%"); E.img(sbg, "street", BG);
  E.K(sbg, "r", [[RUN, -6], [QUEUE, -6]]); E.K(sbg, "s", [[RUN, 1.15], [QUEUE, 1.15]]);              // tilted: it's uphill
  const run = fig(G2, "run", 682, 784, .78, 760, 1860, 5); show(run, [[RUN, QUEUE]]);
  E.K(run, "x", [[RUN, 300], [QUEUE, -700, "lin"]]);
  const rb = []; for (let t = RUN; t < QUEUE; t += .22) rb.push([t, 0, "io"], [t + .11, -24, "io"]); E.K(run, "y", rb);
  const km = E.el(G2, "abs", "left:100px;top:470px;width:880px;text-align:center;font-weight:900;font-size:64px;color:#fff;z-index:8;opacity:0;text-shadow:0 4px 14px rgba(0,0,0,.6)", "");
  show(km, [[RUN + .3, QUEUE]]); E.F(t => { const d = Math.min(1.2, Math.max(0, (t - RUN) / (QUEUE - RUN) * 1.2)); const s = `"JÁ ALI"… ${d.toFixed(1)} KM ⛰️`; if (km.textContent !== s) km.textContent = s; });
  // the ATMs
  const atm = fig(G2, "atm", 880, 1168, .96, 540, 1900, 4); show(atm, [[QUEUE, BACK]]); E.pop(atm, QUEUE, { from: .9, dur: .25 });
  const scr = E.el(G2, "abs", "left:812px;top:1010px;width:160px;height:120px;background:#0d1a10;border-radius:8px;z-index:6;opacity:0;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:900;font-size:26px;line-height:1.1;color:#ff5a4a;transform:rotate(-2deg)", "");
  show(scr, [[QUEUE + .2, BACK]]);
  E.F(t => { const s = t < CASH ? "FORA DE<br>SERVIÇO" : "€20 ✔"; if (scr.innerHTML !== s) { scr.innerHTML = s; scr.style.color = t < CASH ? "#ff5a4a" : "#7dff8a"; scr.style.fontSize = t < CASH ? "26px" : "40px"; } });
  const lab = E.el(G2, "abs", "left:100px;top:470px;width:880px;text-align:center;font-weight:900;font-size:54px;color:#fff;z-index:8;opacity:0;text-shadow:0 4px 14px rgba(0,0,0,.6);line-height:1.15", "");
  show(lab, [[QUEUE + .1, BACK]]); E.F(t => { const s = t < CASH ? "MULTIBANCO #1<br><span style='font-size:36px'>FORA DE SERVIÇO (out of order)</span>" : "MULTIBANCO #2 ✔"; if (lab.innerHTML !== s) lab.innerHTML = s; });
  E.K(atm, "x", [[CASH - .4, 0], [CASH - .1, -20, "io"], [CASH, 0, "io"]]);
  const card = E.el(S.el, "abs", "inset:0;background:#141a2e;z-index:14;opacity:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:80px;color:#fff6c8;text-align:center;line-height:1.1", "40 MINUTES<br>LATER…");
  E.K(card, "o", [[BACK - .9, 0], [BACK - .8, 1], [BACK - .1, 1], [BACK, 0]]);

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "COFFEE: €0,80"], [SO1, "PAYMENT OPTIONS: 1"], [RUN, "DISTANCE TO \"JÁ ALI\": ???"], [BACK, "CASH: €20 · CHANGE: ✗"], [TOMOR, "COFFEE: €0,80 · DEBT: 1"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= SO1 ? C.coralD : C.ink; pill.style.fontSize = s.length > 24 ? "42px" : "48px"; });
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
  const BH = 280, WH = 800, TB = 1000;
  bubble("Can I pay by card?", BH, TB, 440, CARD, SO1 - .05, 50);
  bubble(`Só dinheiro.${sub("(Cash only.)")}`, WH, TB - 20, 400, SO1, PHONE - .05, 52);
  bubble("Phone?", BH, TB, 280, PHONE, SO2 - .05, 56);
  bubble(`Só dinheiro.${sub("(Cash only.)")}`, WH, TB - 20, 400, SO2, WATCH - .05, 52);
  bubble("…Watch?", BH, TB, 300, WATCH, SO3 - .05, 56);
  bubble(`Só… dinheiro.${sub("(Cash. Only.)")}`, WH, TB - 20, 420, SO3, ATM - .05, 52);
  bubble("Where's the ATM?", BH, TB, 420, ATM, JAALI - .05, 50);
  bubble(`É já ali!${sub("(It's right there!)")}`, WH, TB - 20, 380, JAALI, RUN, 56);
  bubble("Here! Twenty euros!", BH, TB + 40, 460, TWENTY, TROCO - .1, 50);
  bubble(`Não tenho troco.${sub("(I don't have change.)")}`, WH, TB - 20, 460, TROCO, TOMOR - .05, 48);
  bubble("Pay tomorrow!", WH, TB - 20, 380, TOMOR, ANOTHER - .1, 52);
  bubble("…I'll have another coffee.", BH, TB + 40, 500, ANOTHER, STAMP + .3, 46);
  E.stamp(E.el(S.el, "abs", "left:30px;top:620px;width:1020px;display:flex;justify-content:center;z-index:13"), "COFFEE €0.80 · CARDIO 1.2 KM", STAMP, { size: 60, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(0, "sfx/cafe-morning.wav", { vol: .2, duck: false, to: RUN }); E.clip(BACK, "sfx/cafe-morning.wav", { vol: .2, duck: false, to: DUR - BACK });
  E.clip(CARD, "voices/ep126/b_card.wav", { vol: 1.25 }); E.clip(SO1, "voices/ep126/w_so1.wav", { vol: 1.35 });
  E.clip(PHONE, "voices/ep126/b_phone.wav", { vol: 1.25 }); E.clip(SO2, "voices/ep126/w_so2.wav", { vol: 1.35 });
  E.clip(WATCH, "voices/ep126/b_watch.wav", { vol: 1.25 }); E.clip(SO3, "voices/ep126/w_so3.wav", { vol: 1.4 });
  E.clip(ATM, "voices/ep126/b_atm.wav", { vol: 1.25 }); E.clip(JAALI, "voices/ep126/w_jaali.wav", { vol: 1.35 });
  E.S(RUN, "whoosh", .4); E.clip(RUN + .1, "sfx/panting.wav", { vol: .6, duck: false, to: BACK - RUN - 1 }); E.clip(QUEUE, "sfx/elx-queue-sigh.wav", { vol: .5, to: 1.5 });
  E.clip(QUEUE + .6, "sfx/atm-beep.wav", { vol: .6, to: .8 }); E.clip(CASH, "sfx/atm-beep.wav", { vol: .6, to: .8 }); E.S(CASH + .2, "sparkle", .5);
  E.S(BACK - .9, "whoosh", .4); E.clip(TWENTY, "voices/ep126/b_twenty.wav", { vol: 1.25 });
  E.clip(TROCO, "voices/ep126/w_troco.wav", { vol: 1.35 }); E.clip(TOMOR, "voices/ep126/w_tomorrow.wav", { vol: 1.35 });
  E.clip(ANOTHER, "voices/ep126/b_another.wav", { vol: 1.25 }); E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Paying by *card* in a Portuguese café", { size: 42, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[27.45, 1], [27.7, 1.18, "out"], [28.0, 1, "io"]]);
}
