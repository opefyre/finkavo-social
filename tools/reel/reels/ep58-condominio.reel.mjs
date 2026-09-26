// EP.58 "The building meeting" — the condomínio meets in the dark entrance hall, because the hall light bulb is dead. Agenda: one item.
// "Ponto um: a lâmpada do corredor." Grandma: "Eu não pago!" The old man: "No meu tempo era com velas!" The lady: "E a humidade do
// terceiro esquerdo?!" Everything but the bulb gets discussed while the clock races 20:00 → 23:50 and Otto grows a beard ("It's… one
// light bulb."). "Votação!" 2–2, one abstention. "Fica adiado." Otto buys a bulb and screws it in himself — light! — and a notice goes
// up: installed without the assembly's approval. Voiced (administrator, grandma, old man, lady, Otto — Portuguese with subtitles).
export const meta = {
  id: "ep58-condominio", date: "2026-11-20",
  images: {
    adm: "characters/cutouts/carimbo_deadpan.webp", gran: "characters/cutouts/dona_seated.webp", old: "characters/cutouts/oldman_seated.webp",
    lady: "characters/cutouts/lady_seated.webp", leo: "characters/cutouts/leo_seated.webp", marta: "characters/cutouts/marta_seated.webp",
    os: "characters/cutouts/otto-casual_seated.webp", oo: "characters/cutouts/otto-casual_seated-old.webp", lad: "characters/cutouts/otto-ladder.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 57, seed: 581, prog: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]] });
  const DUR = 18.8, PONTO = .6, PAGO = 3.0, VELAS = 4.4, HUM = 6.4, CHAOS = 8.3, BULB = 10.0, VOTE = 12.4, ADIA = 13.5, FIX = 15.1, LIT = 16.0, NOTE = 16.7;
  const S = E.scene("condo", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  // ---------------- the entrance hall ----------------
  E.el(S.el, "abs", "inset:0;background:#e8e0cf");
  E.el(S.el, "abs", "left:0;top:1060px;width:1080px;height:860px;background:linear-gradient(180deg,#c9bda4,#b7a98d)");
  const az = `<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90'><rect width='90' height='90' fill='#f4efe4'/><rect x='2' y='2' width='86' height='86' fill='none' stroke='#6f8fb8' stroke-width='3'/><circle cx='45' cy='45' r='16' fill='none' stroke='#2f6db5' stroke-width='5'/></svg>`;
  E.el(S.el, "abs", `left:0;top:760px;width:1080px;height:300px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(az)}");background-size:90px 90px`);
  const mail = E.el(S.el, "abs", "left:760px;top:560px;width:260px;height:180px;background:#9a7a55;border-radius:6px;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:10px;box-sizing:border-box");
  for (let i = 0; i < 8; i++) E.el(mail, "", "background:#c9a878;border-radius:3px");
  E.el(S.el, "abs", "left:60px;top:470px;width:130px;height:60px;background:#1f7a3a;color:#fff;font-weight:900;font-size:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 18px rgba(80,255,140,.6)", "SAÍDA");
  // the dead bulb
  E.el(S.el, "abs", "left:538px;top:420px;width:4px;height:150px;background:#555");
  const bulb = E.el(S.el, "abs", "left:505px;top:560px;width:70px;height:86px;border-radius:50% 50% 45% 45%;background:#cfd3d6;border:4px solid #9aa3ab;z-index:2");
  E.el(S.el, "abs", "left:520px;top:548px;width:40px;height:22px;background:#8a8f95;border-radius:4px;z-index:2");
  E.K(bulb, "r", [[0, -4], [.8, 4, "io"], [1.6, -4, "io"], [2.4, 4, "io"], [3.2, -4, "io"]]);                    // frame-0 motion: it sways
  const glow = E.el(S.el, "abs", "left:240px;top:300px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(255,230,140,.85),rgba(255,230,140,0) 65%);z-index:1;opacity:0");
  E.K(glow, "o", [[0, 0]]);
  E.F(t => { bulb.style.background = t >= LIT ? "#fff2a8" : "#cfd3d6"; bulb.style.boxShadow = t >= LIT ? "0 0 60px 20px rgba(255,230,120,.8)" : "none"; });
  const dim = E.el(S.el, "abs", "inset:0;background:#10182a;z-index:6;pointer-events:none");
  E.F(t => { dim.style.opacity = t >= LIT ? 0 : .22; });

  // ---------------- the administrator (with papers) ----------------
  const adm = E.el(S.el, "abs", `left:-10px;top:${1330 - 1094 * .5}px;width:${730 * .5}px;height:${1094 * .5}px;z-index:2`);
  E.img(adm, "adm", `width:${730 * .5}px;height:${1094 * .5}px`);
  const tb1 = E.el(S.el, "abs", "left:20px;top:1230px;width:330px;height:24px;background:#7a5a3a;border-radius:6px;z-index:3");
  const tb2 = E.el(S.el, "abs", "left:60px;top:1200px;width:120px;height:34px;background:#fff;box-shadow:4px 4px 0 #ddd;z-index:3;transform:rotate(-4deg)");
  [tb1, tb2].forEach(el => E.K(el, "o", [[FIX - .3, 1], [FIX, 0]]));
  const bang = []; for (const t of [VOTE]) bang.push([t - .01, 0], [t, 10], [t + .15, 0, "out"]);
  E.K(adm, "y", bang);
  E.K(adm, "o", [[FIX - .3, 1], [FIX, 0]]);

  // ---------------- the neighbours ----------------
  const seat = (n, w, h, x, floor, s, z) => { const el = E.el(S.el, "abs", `left:${x - w * s / 2}px;top:${floor - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); E.K(el, "o", [[FIX - .3, 1], [FIX, 0]]); return el; };
  const lady = seat("lady", 453, 1028, 480, 1380, .5, 2), leo = seat("leo", 528, 984, 700, 1380, .5, 2), mar = seat("marta", 545, 1009, 910, 1380, .5, 2);
  const gran = seat("gran", 597, 1027, 200, 1800, .6, 4), old = seat("old", 462, 1006, 470, 1800, .6, 4);
  const ow = E.el(S.el, "abs", `left:${760 - 551 * .6 / 2}px;top:${1800 - 1045 * .6}px;width:${551 * .6}px;height:${1045 * .6}px;z-index:4`);
  const o1 = E.img(ow, "os", `position:absolute;left:0;top:0;width:${551 * .6}px;height:${1045 * .6}px`);
  const o2 = E.img(ow, "oo", `position:absolute;left:0;top:0;width:${551 * .6}px;height:${1045 * .6}px;opacity:0`);
  E.F(t => { const g = t >= CHAOS + 1.0; o1.style.opacity = g ? 0 : 1; o2.style.opacity = g ? 1 : 0; });
  E.K(ow, "o", [[FIX - .3, 1], [FIX, 0]]);
  // everyone bounces while they argue
  [lady, leo, mar, gran, old].forEach((el, i) => { const k = []; for (let t = PAGO; t < ADIA; t += .5) k.push([t + i * .07, 0, "io"], [t + .25 + i * .07, -10, "io"]); E.K(el, "y", k); });
  // raised hands for the vote (drawn)
  const hand = (x, y, t) => { const h = E.el(S.el, "abs", `left:${x}px;top:${y}px;width:46px;height:80px;border-radius:20px 20px 10px 10px;background:#f5c9a8;border:4px solid #c98e6a;z-index:5;opacity:0`); E.K(h, "o", [[t - .01, 0], [t, 1], [ADIA, 1], [ADIA + .1, 0]]); E.K(h, "y", [[t, 60], [t + .2, 0, "out"]]); };
  hand(150, 1150, VOTE + .3); hand(880, 780, VOTE + .45);
  const tally = E.el(S.el, "abs", "left:380px;top:890px;background:#fff;border-radius:16px;padding:8px 18px;font-weight:900;font-size:40px;color:#1d2b36;z-index:7;box-shadow:0 8px 18px rgba(0,0,0,.2);opacity:0", "SIM 2 · NÃO 2 · ABST. 1");
  E.pop(tally, VOTE + .7, { from: .3, dur: .3 }); E.K(tally, "o", [[VOTE + .7, 0], [VOTE + .8, 1], [ADIA + 1.4, 1], [ADIA + 1.5, 0]]);

  // ---------------- the fix ----------------
  const LS = .85, LX = 360, LB = 1780, fx = LX + 360 * LS * .64, fy = LB - 1128 * LS + 8;
  const lad = E.el(S.el, "abs", `left:${LX}px;top:${LB - 1128 * LS}px;width:${360 * LS}px;height:${1128 * LS}px;z-index:7;opacity:0`);
  E.img(lad, "lad", `width:${360 * LS}px;height:${1128 * LS}px`);
  E.K(lad, "o", [[FIX - .01, 0], [FIX, 1]]); E.K(lad, "x", [[FIX, -600], [FIX + .4, 0, "out"]]);
  const cord = E.el(S.el, "abs", `left:${fx - 2}px;top:0;width:4px;height:${fy}px;background:#555;z-index:7;opacity:0`); E.K(cord, "o", [[FIX - .01, 0], [FIX, 1]]);
  const glow2 = E.el(S.el, "abs", `left:${fx - 330}px;top:${fy - 300}px;width:660px;height:660px;border-radius:50%;background:radial-gradient(circle,rgba(255,236,150,.95),rgba(255,236,150,0) 65%);z-index:6;opacity:0`);
  E.K(glow2, "o", [[LIT - .01, 0], [LIT, 1], [LIT + .08, .3], [LIT + .16, 1]]);
  [bulb].forEach(el => E.K(el, "o", [[FIX - .01, 1], [FIX, 0]]));
  const note = E.el(S.el, "abs", "left:620px;top:1000px;width:420px;background:#fffdf3;box-shadow:0 10px 24px rgba(0,0,0,.25);padding:16px 20px;box-sizing:border-box;z-index:8;transform:rotate(3deg);opacity:0;font-family:'Courier New',monospace;color:#1d2b36");
  E.el(note, "abs", "left:160px;top:-14px;width:100px;height:30px;background:rgba(255,255,255,.7);transform:rotate(-4deg)");
  E.el(note, "", "font-weight:900;font-size:40px;text-align:center;border-bottom:3px solid #1d2b36;margin-bottom:8px", "AVISO");
  E.el(note, "", "font-weight:700;font-size:26px;line-height:1.25", "Lâmpada instalada sem aprovação da assembleia.");
  E.el(note, "", "font-family:Arial;font-weight:800;font-size:22px;color:#7a8791;margin-top:8px", "(Bulb installed without the assembly's approval.)");
  E.el(note, "", "font-weight:700;font-size:22px;text-align:right;margin-top:6px", "— A Administração");
  E.pop(note, NOTE, { from: .3, dur: .35 });

  // ---------------- HUD ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  const CLK = t => { const m = t < CHAOS ? 1200 + (t / CHAOS) * 40 : t < VOTE ? 1240 + ((t - CHAOS) / (VOTE - CHAOS)) * 190 : 1430; return `${Math.floor(m / 60)}:${String(Math.floor(m % 60)).padStart(2, "0")}`; };
  E.F(t => { const s = t >= FIX ? "NEXT DAY · 5 MINUTES" : `${CLK(t)} · AGENDA: 1 ITEM`; if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= FIX ? "#1f7a3a" : t >= CHAOS ? C.coralD : C.ink; });

  // ---------------- bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble(`Ponto um: a lâmpada do corredor.${sub("(Item one: the hall light bulb.)")}`, 30, 600, 560, 90, PONTO, PAGO - .05, 44);
  bubble(`Eu não pago!${sub("(I'm not paying!)")}`, 30, 1050, 400, 150, PAGO, VELAS - .05, 50);
  bubble(`No meu tempo era com velas!${sub("(In my day we used candles!)")}`, 200, 1030, 560, 260, VELAS, HUM - .05, 44);
  bubble(`E a humidade do terceiro esquerdo?!${sub("(And the damp in flat 3L?!)")}`, 250, 620, 600, 220, HUM, CHAOS + .1, 42);
  [["E o elevador?!", 60, 680, CHAOS], ["O cão do 2º!", 600, 720, CHAOS + .35], ["Quem pagou o capacho?!", 250, 960, CHAOS + .7], ["E a porta da garagem?!", 560, 640, CHAOS + 1.05]].forEach(([s, x, y, t]) => bubble(s, x, y, 420, 150, t, BULB - .05, 38));
  bubble("It's… one light bulb.", 560, 1060, 480, 240, BULB, VOTE - .1, 46);
  bubble("Votação!", 40, 640, 320, 90, VOTE, ADIA - .05, 56);
  bubble(`Fica adiado para a próxima reunião.${sub("(Postponed to the next meeting.)")}`, 30, 600, 600, 90, ADIA, FIX - .05, 44);

  // ---------------- stamp ----------------
  const sb = E.el(S.el, "abs", "left:60px;top:1560px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "NEXT MEETING: MARCH.", NOTE + 1.0, { size: 90, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  E.clip(0, "sfx/crowd-murmur.wav", { vol: .18, duck: false }); E.clip(1.2, "sfx/crowd-murmur.wav", { vol: .18, duck: false });
  E.clip(PONTO, "voices/ep58/a_ponto.wav", { vol: 1.15 });
  E.clip(PAGO, "voices/ep58/g_naopago.wav", { vol: 1.15 });
  E.clip(VELAS, "voices/ep58/v_velas.wav", { vol: 1.15 });
  E.clip(HUM, "voices/ep58/m_humidade.wav", { vol: 1.15 });
  for (let k = 0; k < 4; k++) E.clip(CHAOS + k * .5, "sfx/crowd-groan.wav", { vol: 2.2, to: .9 });
  for (let k = 0; k < 12; k++) E.S(CHAOS + k * .15, "tick", .35);
  E.clip(BULB, "voices/ep58/o_lightbulb.wav", { vol: 1.15 });
  E.S(VOTE, "thud", .9); E.clip(VOTE, "voices/ep58/a_votacao.wav", { vol: 1.2 });
  E.clip(ADIA, "voices/ep58/a_adiado.wav", { vol: 1.15 }); E.S(ADIA + 1.6, "nope", .6);
  E.S(FIX, "whoosh", .5); E.S(LIT, "ding", .9); E.S(LIT + .05, "sparkle", .6);
  E.clip(NOTE, "sfx/note-slap.wav", { vol: 1.3 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "The *building meeting*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[18.0, 1], [18.25, 1.18, "out"], [18.6, 1, "io"]]);
}
