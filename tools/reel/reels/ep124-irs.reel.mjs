// EP.124 "When dad does the family IRS" — April. Mum, tiptoeing: "Silêncio! O pai está a fazer o IRS!" (Quiet! Dad is doing the taxes!) The TV goes mute, the teen pauses his game, grandma lights a
// candle and prays: "Ai, Nossa Senhora…" (Oh, Holy Mother…). Dad, sweating at the laptop among receipts: "Health expenses… education… the receipt for the dog…" "Simulate…" (drum roll). The Portal
// screen: REEMBOLSO €12,40. Dad: "Twelve euros! We're getting twelve euros back!" Grandma: "Graças a Deus!" (Thank God!) Confetti. Mum, calm, on her phone: "Mine says nine hundred." Silence.
// Dad: "Let's file jointly!" Mum: "Não." (No.) Stamp: IRS €12.40 · MARRIAGE: TESTED. (All numbers are jokes.)
export const meta = {
  id: "ep124-irs", date: "2027-01-25",
  images: {
    bg: "characters/scenes/bg_avo.webp",
    d1: "characters/cutouts/ze_laptop.webp", d2: "characters/cutouts/ze_proud.webp", d3: "characters/cutouts/ze_deflated.webp",
    m1: "characters/cutouts/mum_shh.webp", m2: "characters/cutouts/mum_phone.webp", g1: "characters/cutouts/dona_pray.webp", teen: "characters/cutouts/teen-sofa_game.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 50, seed: 1241, prog: [[0, 3, 7], [5, 8, 12], [7, 10, 14], [3, 7, 10]] });
  const DUR = 28.6, SIL = .3, MUTE = 3.6, TEEN = 4.5, PRAY = 5.5, REC = 7.6, SIM = 12.0, DRUM = 13.2, SCREEN = 14.6, TWELVE = 15.0, GRACAS = 18.3, M900 = 20.3, PAUSE = 22.4, JOINT = 23.4, NAO = 24.9, STAMP = 26.2;
  const S = E.scene("irs", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };
  E.img(S.el, "bg", BG);

  // ---- the household, before dad starts: teen on the sofa (back), grandma praying (right), mum tiptoeing (left)
  const teen = fig(S.el, "teen", 1168, 880, .5, 300, 1230, 3); show(teen, [[0, SIM]]);
  const g1 = fig(S.el, "g1", 653, 1024, .62, 880, 1640, 4); show(g1, [[PRAY - .3, DUR]]); E.pop(g1, PRAY - .3, { from: .85, dur: .25 });
  const gk = []; for (let t = PRAY; t < DUR; t += .25) gk.push([t, (Math.round(t / .25) % 2) ? 1.5 : -1.5, "io"]); E.K(g1, "r", gk);
  const m1 = fig(S.el, "m1", 529, 997, .68, 230, 1870, 6), m2 = fig(S.el, "m2", 672, 1024, .66, 230, 1870, 6);
  E.F(t => { m1.style.opacity = t < M900 - .1 ? 1 : 0; m2.style.opacity = t >= M900 - .1 ? 1 : 0; });
  E.K(m1, "x", [[0, -120], [2.2, 0, "out"], [SIM, 0], [SIM + .4, -40, "io"]]);
  const tip = []; for (let t = 0; t < 2.2; t += .4) tip.push([t, 0, "io"], [t + .2, -16, "io"]); E.K(m1, "y", tip);
  bob(m2, M900, DUR, 3, .9);
  // the TV goes MUTE
  const tv = E.el(S.el, "abs", "left:680px;top:780px;width:230px;height:100px;background:rgba(0,0,0,.75);border-radius:16px;z-index:5;opacity:0;color:#fff;font-weight:900;font-size:44px;display:flex;align-items:center;justify-content:center", "🔇 MUTE");
  show(tv, [[MUTE, SIM]]); E.pop(tv, MUTE, { from: .3, dur: .25 });
  const pz = E.el(S.el, "abs", "left:180px;top:910px;width:220px;height:90px;background:rgba(0,0,0,.75);border-radius:16px;z-index:5;opacity:0;color:#fff;font-weight:900;font-size:40px;display:flex;align-items:center;justify-content:center", "⏸ PAUSED");
  show(pz, [[TEEN, SIM]]); E.pop(pz, TEEN, { from: .3, dur: .25 });

  // ---- dad at the laptop (center, big) from REC
  const d1 = fig(S.el, "d1", 880, 1099, .72, 560, 1900, 5), d2 = fig(S.el, "d2", 499, 1054, .7, 560, 1880, 5), d3 = fig(S.el, "d3", 531, 1024, .7, 560, 1880, 5);
  E.F(t => { const k = t < REC - .2 ? 0 : t < TWELVE ? 1 : t < M900 + 1.2 ? 2 : 3; d1.style.opacity = k === 1 ? 1 : 0; d2.style.opacity = k === 2 ? 1 : 0; d3.style.opacity = k === 3 ? 1 : 0; });
  E.pop(d1, REC - .2, { from: .85, dur: .25 });
  const sw = []; for (let t = REC; t < TWELVE; t += .12) sw.push([t, (Math.round(t / .12) % 2) ? 1 : -1, "io"]); E.K(d1, "r", sw);
  E.K(d2, "y", [[TWELVE, 0], [TWELVE + .25, -120, "out"], [TWELVE + .55, 0, "in"], [TWELVE + .8, -80, "out"], [TWELVE + 1.05, 0, "in"]]);
  // a cloud of receipts swirling over him
  const rnd = i => { const x = Math.sin(i * 91.7) * 43758.5; return x - Math.floor(x); };
  for (let i = 0; i < 14; i++) { const r = E.el(S.el, "abs", `left:0;top:0;width:70px;height:92px;background:#fff;border:3px solid #ddd5c3;border-radius:4px;z-index:6;opacity:0`); for (let l = 0; l < 4; l++) E.el(r, "abs", `left:8px;top:${12 + l * 16}px;width:${48 - (l % 2) * 12}px;height:4px;background:#b9b2a2`);
    show(r, [[REC + .2, SIM]]); E.F(t => { const a = t * (1.2 + rnd(i)) + i; r.style.transform = `translate(${560 + Math.cos(a) * (260 + rnd(i + 3) * 120) - 35}px,${1250 + Math.sin(a * 1.3) * 160}px) rotate(${a * 60}deg)`; }); }

  // ---- the Portal screen (code-drawn) and the drum roll
  const scr = E.el(S.el, "abs", "left:110px;top:440px;width:860px;height:420px;background:#f4f7fa;border-radius:24px;z-index:9;box-shadow:0 16px 36px rgba(0,0,0,.45);border:10px solid #2b3540;overflow:hidden;opacity:0");
  E.el(scr, "abs", "left:0;top:0;width:840px;height:70px;background:#0b5a8c;color:#fff;font-weight:900;font-size:34px;line-height:70px;padding-left:28px;box-sizing:border-box", "PORTAL DAS FINANÇAS · IRS 2026");
  const scrTx = E.el(scr, "abs", "left:0;top:110px;width:840px;text-align:center;font-weight:900;font-size:64px;color:#1d2b36", "");
  const scrBig = E.el(scr, "abs", "left:0;top:200px;width:840px;text-align:center;font-weight:900;font-size:130px;color:#2e8b57", "");
  const scrSub = E.el(scr, "abs", "left:0;top:350px;width:840px;text-align:center;font-weight:800;font-size:28px;color:#7a8791", "");
  show(scr, [[SIM - .2, GRACAS + 1.6]]); E.pop(scr, SIM - .2, { from: .5, dur: .3 });
  E.F(t => {
    let a, b, c;
    if (t < SCREEN) { const dots = ".".repeat(1 + Math.floor(t * 4) % 3); a = "A SIMULAR" + dots; b = "⏳"; c = "(simulating)"; }
    else { a = "REEMBOLSO"; b = "€ 12,40"; c = "(refund)"; }
    if (scrTx.textContent !== a) { scrTx.textContent = a; scrBig.textContent = b; scrSub.textContent = c; }
  });
  E.pop(scrBig, SCREEN, { from: .3, dur: .35 });
  ["🎉", "🎊", "✨", "🎉", "🎊", "✨"].forEach((e, i) => { const el = E.el(S.el, "abs", `left:${100 + i * 160}px;top:${900 + (i % 2) * 80}px;font-size:${90 + (i % 3) * 20}px;z-index:10;opacity:0`, e); show(el, [[TWELVE + .1, TWELVE + 2.2]]); E.K(el, "y", [[TWELVE, 0], [TWELVE + 2.2, 220, "in"]]); E.K(el, "r", [[TWELVE, -20], [TWELVE + 2.2, 50 + i * 12]]); });
  // mum's phone screen: €900
  const ph = E.el(S.el, "abs", "left:60px;top:480px;width:330px;height:420px;background:#f4f7fa;border-radius:40px;z-index:9;border:10px solid #111;box-shadow:0 14px 30px rgba(0,0,0,.45);overflow:hidden;opacity:0;text-align:center");
  E.el(ph, "abs", "left:0;top:0;width:310px;height:60px;background:#0b5a8c;color:#fff;font-weight:900;font-size:24px;line-height:60px", "IRS · MÃE");
  E.el(ph, "abs", "left:0;top:110px;width:310px;font-weight:900;font-size:40px;color:#1d2b36", "REEMBOLSO");
  E.el(ph, "abs", "left:0;top:170px;width:310px;font-weight:900;font-size:88px;color:#2e8b57", "€900");
  E.el(ph, "abs", "left:0;top:300px;width:310px;font-weight:800;font-size:24px;color:#7a8791", "(Mum's refund)");
  show(ph, [[M900 + .3, DUR]]); E.pop(ph, M900 + .3, { from: .4, dur: .3 }); E.K(ph, "r", [[M900, -4], [DUR, -2]]);

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "APRIL · IRS SEASON"], [MUTE, "HOUSE VOLUME: 0"], [REC, "RECEIPTS: 214"], [SCREEN, "DAD'S REFUND: €12.40"], [M900 + .3, "MUM'S REFUND: €900"], [NAO, "JOINT FILING: NÃO"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= SCREEN ? C.coralD : C.ink; });
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
  const MH = 230, DH = 560, GH = 880;
  bubble(`Silêncio! O pai está a fazer o IRS!${sub("(Quiet! Dad is doing the taxes!)")}`, MH, 1000, 600, SIL, PRAY - .1, 44);
  bubble(`Ai, Nossa Senhora…${sub("(Oh, Holy Mother…)")}`, GH, 900, 440, PRAY, REC - .1, 46);
  bubble("Health expenses… education… the receipt for the dog…", DH, 900, 620, REC, SIM - .1, 42);
  bubble("Simulate…", DH, 900, 340, SIM, SCREEN - .2, 52);
  bubble("Twelve euros! We're getting twelve euros back!", DH, 920, 580, TWELVE, GRACAS - .1, 44);
  bubble(`Graças a Deus!${sub("(Thank God!)")}`, GH, 900, 400, GRACAS, M900 - .1, 50);
  bubble("Mine says nine hundred.", MH, 1000, 460, M900, JOINT - .1, 48);
  bubble("Let's file jointly!", DH, 960, 420, JOINT, NAO - .1, 50);
  bubble(`Não.${sub("(No.)")}`, MH, 1000, 260, NAO, STAMP + .3, 64);
  E.stamp(E.el(S.el, "abs", "left:30px;top:920px;width:1020px;display:flex;justify-content:center;z-index:13"), "IRS €12.40 · MARRIAGE: TESTED", STAMP, { size: 58, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(0, "sfx/tv-loud.wav", { vol: .25, duck: false, to: MUTE });
  E.clip(SIL, "voices/ep124/m_silencio.wav", { vol: 1.3 }); E.S(MUTE, "pop", .4); E.S(TEEN, "pop", .4);
  E.clip(PRAY, "voices/ep124/g_senhora.wav", { vol: 1.35 }); E.clip(REC - .2, "sfx/elx-paper-unfold.wav", { vol: .8, to: 1 });
  E.clip(REC, "voices/ep124/d_receipts.wav", { vol: 1.3 }); E.clip(REC, "sfx/elx-heartbeat.wav", { vol: .4, duck: false, to: SCREEN - REC });
  E.clip(SIM, "voices/ep124/d_simulate.wav", { vol: 1.3 }); E.clip(DRUM, "sfx/elx-stopwatch.wav", { vol: .6, to: SCREEN - DRUM });
  E.S(SCREEN, "sparkle", .6); E.clip(TWELVE, "voices/ep124/d_twelve.wav", { vol: 1.3 }); E.clip(TWELVE + .2, "sfx/applause-cheer.wav", { vol: .4, to: 2.6 });
  E.clip(GRACAS, "voices/ep124/g_gracas.wav", { vol: 1.35 });
  E.clip(M900, "voices/ep124/m_900.wav", { vol: 1.3 }); E.S(M900 + .3, "pop", .5); E.clip(PAUSE - .3, "sfx/elx-crickets.wav", { vol: .5, to: 1.2 });
  E.clip(JOINT, "voices/ep124/d_jointly.wav", { vol: 1.3 }); E.clip(NAO, "voices/ep124/m_nao.wav", { vol: 1.4 }); E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "When dad does the family *IRS*", { size: 48, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[27.8, 1], [28.05, 1.18, "out"], [28.35, 1, "io"]]);
}
