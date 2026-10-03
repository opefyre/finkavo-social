// EP.117 "Small talk with your dentist" — Otto in the chair, mouth wide open. The dentist, cheerful: "Abre bem a boca!" (Open wide!) then keeps chatting: "So, do you work around here?" Otto's mumble,
// with a caption of what he MEANT ("I'm a designer. I work from home. Thank you for asking."). Dentist, delighted: "Fantastic! My brother was a pilot too!" "Does it hurt?" Otto: "AAAARGH!" (caption: YES. EVERYTHING.)
// Dentist: "Good, good, no pain." "Done! You can rinse now." Otto, numb and beaming: "Thank you, doctor. It was wonderful." (slurred). Reception: "São duzentos euros. Quer fatura com contribuinte?"
// (That's two hundred euros. Invoice with your tax number?) Otto, flat, clear: "Now it hurts." Stamp: NOW IT HURTS.
export const meta = {
  id: "ep117-dentist", date: "2027-01-18",
  images: {
    bg: "characters/scenes/bg_dentist.webp", bg2: "characters/scenes/bg_clinic.webp",
    d1: "characters/cutouts/dentist_lean.webp", d2: "characters/cutouts/dentist_cheer.webp",
    o1: "characters/cutouts/otto-dentist_open.webp", o2: "characters/cutouts/otto-dentist_numb.webp", o3: "characters/cutouts/otto-casual_wallet-empty.webp",
    rc: "characters/cutouts/receptionist_counter.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 48, seed: 1171, prog: [[0, 4, 7], [5, 9, 12], [2, 5, 9], [7, 11, 14]] });
  const DUR = 28.4, ABRE = .3, WORK = 2.3, M1 = 4.3, PILOT = 7.5, HURT = 10.9, M3 = 12.15, NOPAIN = 13.9, DONE = 16.15, THANKS = 18.2, SW = 20.8, CONTA = 21.0, NOW = 24.2, STAMP = 25.8;
  const S = E.scene("dentist", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };

  // ================= the surgery =================
  const G1 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G1, [[0, SW]]);
  E.img(G1, "bg", BG);
  const oo = fig(G1, "o1", 866, 1168, .66, 760, 1780, 4), on = fig(G1, "o2", 837, 1168, .66, 760, 1780, 4);
  E.F(t => { oo.style.opacity = t < THANKS - .1 ? 1 : 0; on.style.opacity = t >= THANKS - .1 ? 1 : 0; });
  const shk = []; for (let t = 0; t < THANKS; t += .12) shk.push([t, (Math.round(t / .12) % 2) ? 1.4 : -1.4, "io"]); E.K(oo, "r", shk);
  const hb = []; for (let t = HURT; t < NOPAIN; t += .08) hb.push([t, (Math.round(t / .08) % 2) ? 5 : -5, "io"]); E.K(oo, "x", [[0, 0], ...hb, [NOPAIN, 0]]);
  bob(on, THANKS, SW, 6, .4);
  const d1 = fig(G1, "d1", 688, 1024, .78, 250, 1790, 6), d2 = fig(G1, "d2", 688, 1024, .78, 250, 1790, 6);
  E.F(t => { d1.style.opacity = t < DONE ? 1 : 0; d2.style.opacity = t >= DONE ? 1 : 0; });
  bob(d1, 0, DONE, 7, .45); bob(d2, DONE, SW, 6, .5);
  E.K(d1, "x", [[0, 0], [M1, 0], [M1 + .6, 22, "io"], [PILOT, 22], [PILOT + .4, 0, "io"], [M3, 0], [M3 + .5, 45, "io"], [NOPAIN, 45], [NOPAIN + .4, 0, "io"]]);
  // the lamp flickers
  const lamp = E.el(G1, "abs", "left:520px;top:240px;width:480px;height:480px;border-radius:50%;background:radial-gradient(circle,rgba(255,250,200,.55),rgba(255,250,200,0) 70%);z-index:3;opacity:0");
  const lk = []; for (let t = 0; t < SW; t += .6) lk.push([t, .5, "io"], [t + .3, .9, "io"]); E.K(lamp, "o", lk);

  // ---- caption: what Otto meant
  const cap = E.el(S.el, "abs", "left:40px;top:1480px;width:1000px;background:rgba(15,20,30,.88);border-radius:22px;padding:14px 26px 16px;z-index:12;opacity:0;border:3px solid #ffd60a");
  E.el(cap, "abs", "left:26px;top:10px;font-weight:900;font-size:26px;color:#ffd60a;letter-spacing:2px", "🗣 WHAT OTTO MEANT");
  const capTx = E.el(cap, "", "padding-top:34px;font-weight:900;font-size:40px;line-height:1.08;color:#fff", "");
  const CAPS = [[M1 + .2, M1 + 3.1, "I'm a designer. I work from home. Thank you for asking."], [M3, M3 + 1.7, "YES. EVERYTHING. PLEASE STOP."], [THANKS, THANKS + 2.4, "Thank you, doctor. It was wonderful."]];
  E.F(t => { const c = CAPS.find(([a, b]) => t >= a && t < b); cap.style.opacity = c ? 1 : 0; if (c && capTx.textContent !== c[2]) capTx.textContent = c[2]; });
  CAPS.forEach(([a]) => E.pop(cap, a, { from: .8, dur: .2 }));

  // ================= reception =================
  const G2 = E.el(S.el, "abs", "inset:0;overflow:hidden"); show(G2, [[SW, DUR]]);
  E.img(G2, "bg2", BG);
  const rc = fig(G2, "rc", 880, 1152, .86, 700, 1900, 4); bob(rc, SW, DUR, 4, .8);
  const o3 = fig(G2, "o3", 489, 1016, .64, 230, 1850, 6); bob(o3, SW, DUR, 4, .7); E.pop(o3, SW, { from: .9, dur: .25 });
  // the bill
  const bill = E.el(G2, "abs", "left:520px;top:640px;width:420px;height:230px;background:#fffdf6;border-radius:18px;box-shadow:0 14px 30px rgba(0,0,0,.4);z-index:8;opacity:0;border:5px solid #e5dcc6;transform:rotate(3deg)");
  E.el(bill, "abs", `left:0;top:22px;width:420px;text-align:center;font-weight:900;font-size:44px;color:${C.ink}`, "FATURA");
  E.el(bill, "abs", `left:0;top:92px;width:420px;text-align:center;font-weight:900;font-size:80px;color:${C.coralD}`, "€ 200");
  E.el(bill, "abs", "left:0;top:186px;width:420px;text-align:center;font-weight:800;font-size:28px;color:#7a8791", "(invoice)");
  E.K(bill, "o", [[CONTA + 1.5, 0], [CONTA + 1.6, 1]]); E.pop(bill, CONTA + 1.5, { from: .4, dur: .3 });

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "WORDS UNDERSTOOD: 0"], [DONE, "NUMBNESS: 100%"], [SW, "BILL: €200"], [NOW, "PAIN: NOW"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= M1 ? C.coralD : C.ink; });
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
  const DH = 250, OH = 780;
  bubble(`Abre bem a boca!${sub("(Open wide!)")}`, DH, 780, 520, ABRE, WORK - .1, 50);
  bubble("So, do you work around here?", DH, 800, 560, WORK, M1 - .1, 46);
  bubble("Aaargh ah aaah aargh.", OH, 680, 520, M1, PILOT - .15, 46);
  bubble("Fantastic! My brother was a pilot too!", DH, 780, 560, PILOT, HURT - .1, 44);
  bubble("Does it hurt?", DH, 800, 420, HURT, M3 - .05, 52);
  bubble("AAAARGH!", OH, 680, 420, M3, NOPAIN - .1, 62);
  bubble("Good, good, no pain.", DH, 800, 480, NOPAIN, DONE - .1, 50);
  bubble("Done! You can rinse now.", DH, 780, 520, DONE, THANKS - .05, 48);
  bubble("Fank oo, dowter. Id wath wonderful.", OH, 640, 560, THANKS, SW - .1, 44);
  bubble(`São duzentos euros. Quer fatura com contribuinte?${sub("(That's two hundred euros. Invoice with your tax number?)")}`, 700, 520, 700, CONTA, NOW - .1, 40, 12);
  bubble("Now it hurts.", 230, 1020, 480, NOW, STAMP + .3, 58);
  E.stamp(E.el(S.el, "abs", "left:30px;top:470px;width:1020px;display:flex;justify-content:center;z-index:11"), "NOW IT HURTS.", STAMP, { size: 100, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(0, "sfx/office.wav", { vol: .1, duck: false, to: SW }); E.clip(0, "sfx/elx-dental-drill.wav", { vol: .14, duck: false, to: 3 });
  E.clip(ABRE, "voices/ep117/d_abre.wav", { vol: 1.35 }); E.clip(WORK, "voices/ep117/d_work.wav", { vol: 1.3 });
  E.clip(M1 - .1, "sfx/elx-suction.wav", { vol: .5, to: 3 }); E.clip(M1, "voices/ep117/o_m1.wav", { vol: 1.2 });
  E.clip(PILOT, "voices/ep117/d_pilot.wav", { vol: 1.3 }); E.clip(PILOT + 2.4, "sfx/elx-dental-drill.wav", { vol: .6, to: 2.6 });
  E.clip(HURT, "voices/ep117/d_hurt.wav", { vol: 1.3 }); E.clip(M3, "voices/ep117/o_m3.wav", { vol: 1.25 });
  E.clip(NOPAIN, "voices/ep117/d_nopain.wav", { vol: 1.3 }); E.clip(DONE, "voices/ep117/d_done.wav", { vol: 1.3 });
  E.clip(THANKS, "voices/ep117/o_thanks.wav", { vol: 1.2 }); E.S(SW, "whoosh", .4);
  E.clip(CONTA, "voices/ep117/r_conta.wav", { vol: 1.3 }); E.S(CONTA + 1.5, "pop", .5);
  E.clip(NOW, "voices/ep117/o_now.wav", { vol: 1.25 }); E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Small talk with your *dentist*", { size: 48, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[27.6, 1], [27.85, 1.18, "out"], [28.15, 1, "io"]]);
}
