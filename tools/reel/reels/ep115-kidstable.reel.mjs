// EP.115 "The kids' table (at 35)" — big Sunday family lunch. Otto, 35, is squeezed onto a tiny chair at the "MESA DOS MIÚDOS" (kids' table): "Okay. It's fine. I'm fine."
// A kid: "Uncle, you're in my chair!" Another: "My dad says you still live with grandma." Otto: "…Eat your peas." Mum, from the adults' table: "Otto! Come sit with us, you're thirty-five!"
// The adults' table: grandma, narrowing her eyes: "Então, quando é que casas?" (So, when are you getting married?) The aunt: "And when are you giving us grandchildren?" Uncle and dad: "That referee is a THIEF!"
// "In MY day we had no phones!" Otto: "Excuse me. I need to go to the… kids' table." Kid: "Welcome back, uncle." "Want my dessert?" Otto, cupcake, party hat: "Best table in the house."
export const meta = {
  id: "ep115-kidstable", date: "2027-01-16",
  images: {
    bg: "characters/scenes/bg_lunch.webp",
    k1: "characters/cutouts/kids_chat.webp", k2: "characters/cutouts/kids_stare.webp", k3: "characters/cutouts/kids_kind.webp",
    a1: "characters/cutouts/adults_ask.webp", a2: "characters/cutouts/adults_fight.webp",
    o1: "characters/cutouts/otto-kidchair_squeezed.webp", o2: "characters/cutouts/otto-kidchair_cupcake.webp", o3: "characters/cutouts/otto-table_plead.webp", o4: "characters/cutouts/otto-table_panic.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 52, seed: 1151, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 30.0, FINE = .3, CHAIR = 3.0, KDAD = 5.45, PEAS = 8.15, MUM = 9.5, TOADULT = 12.4, CASAS = 12.8, GRAND = 15.0, THIEF = 17.5, PHONES = 18.7, EXC = 21.3, BACK = 24.0, K_BACK = 24.3, DESS = 25.85, BEST = 27.1, STAMP = 28.8;
  const S = E.scene("lunch", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (P, n, w, h, s, cx, bottom, z = 3) => { const el = E.el(P, "abs", `left:${cx - w * s / 2}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  E.img(S.el, "bg", BG);
  const bob = (el, t0, t1, amp, per = .5) => { const k = []; for (let t = t0; t < t1; t += per) k.push([t, 0, "io"], [t + per / 2, -amp, "io"]); E.K(el, "y", k); };
  const KIDS = [[0, TOADULT], [BACK - .05, DUR]], ADULTS = [[TOADULT, BACK - .05]];

  // ================= the kids' table =================
  const FW = 1080, FH = 752 * FW / 1344, KB = 1620;
  const kids = E.el(S.el, "abs", `left:0;top:${KB - FH}px;width:${FW}px;height:${FH}px;z-index:4`); show(kids, KIDS);
  const KI = ["k1", "k2", "k3"].map(n => E.img(kids, n, `position:absolute;left:0;top:0;width:${FW}px;height:${FH}px;opacity:0`));
  E.F(t => { const k = t < CHAIR ? 0 : t < TOADULT ? 1 : t < K_BACK ? 1 : 2; KI.forEach((f, i) => { f.style.opacity = i === k ? 1 : 0; }); });
  bob(kids, 0, DUR, 5, .55);
  const o1 = fig(S.el, "o1", 507, 1008, .62, 545, 1830, 6), o2 = fig(S.el, "o2", 528, 984, .62, 545, 1830, 6);
  E.F(t => { const k = t < DESS ? 0 : 1; o1.style.opacity = (k === 0 && ((t < TOADULT) || t >= BACK - .05)) ? 1 : 0; o2.style.opacity = (k === 1 && t >= BACK - .05) ? 1 : 0; });
  bob(o1, 0, TOADULT, 4, .8); bob(o1, BACK, DESS, 4, .8); bob(o2, DESS, DUR, 6, .45);
  // the banner: MESA DOS MIÚDOS
  const ban = E.el(S.el, "abs", "left:150px;top:500px;width:780px;height:150px;background:#f4c542;border-radius:20px;z-index:7;box-shadow:0 10px 24px rgba(0,0,0,.35);transform:rotate(-2deg);text-align:center;border:6px solid #fff6c8");
  E.el(ban, "abs", `left:0;top:14px;width:780px;font-weight:900;font-size:66px;letter-spacing:3px;color:${C.ink}`, "MESA DOS MIÚDOS");
  E.el(ban, "abs", `left:0;top:96px;width:780px;font-weight:800;font-size:34px;color:#6b4a00`, "(the kids' table)");
  show(ban, KIDS);
  [[130, 466], [270, 462], [810, 462], [940, 466]].forEach(([x, y], i) => { const b = E.el(S.el, "abs", `left:${x}px;top:${y}px;font-size:66px;z-index:6;opacity:0`, ["🎈", "🎈", "🎈", "🎈"][i]); show(b, KIDS); E.K(b, "y", [[0, 0], [1.2, -14, "io"], [2.4, 0, "io"], [3.6, -14, "io"], [4.8, 0, "io"], [6, -14, "io"], [7.2, 0, "io"], [8.4, -14, "io"], [9.6, 0, "io"], [10.8, -14, "io"], [12, 0, "io"], [13.2, -14, "io"], [14.4, 0, "io"], [15.6, -14, "io"], [16.8, 0, "io"], [18, -14, "io"], [19.2, 0, "io"], [20.4, -14, "io"], [21.6, 0, "io"], [22.8, -14, "io"], [24, 0, "io"], [25.2, -14, "io"], [26.4, 0, "io"], [27.6, -14, "io"], [28.8, 0, "io"], [30, -14, "io"], [31.2, 0, "io"]]); });

  // ================= the adults' table =================
  const ad = E.el(S.el, "abs", `left:0;top:${1450 - FH}px;width:${FW}px;height:${FH}px;z-index:4`); show(ad, ADULTS);
  const AD = ["a1", "a2"].map(n => E.img(ad, n, `position:absolute;left:0;top:0;width:${FW}px;height:${FH}px;opacity:0`));
  E.F(t => { const k = t < THIEF ? 0 : 1; AD.forEach((f, i) => { f.style.opacity = i === k ? 1 : 0; }); });
  bob(ad, TOADULT, BACK, 5, .55);
  const ot3 = fig(S.el, "o3", 768, 1080, .66, 200, 1860, 6), ot4 = fig(S.el, "o4", 768, 1080, .66, 200, 1860, 6);
  E.F(t => { const on = t >= TOADULT && t < BACK - .05; ot3.style.opacity = (on && t < THIEF) ? 1 : 0; ot4.style.opacity = (on && t >= THIEF) ? 1 : 0; });
  bob(ot3, TOADULT, THIEF, 4, .7); bob(ot4, THIEF, BACK, 5, .3);
  // the invisible table line + plates for the adults' lunch
  E.el(S.el, "abs", `left:0;top:1380px;width:1080px;height:90px;background:linear-gradient(#f7f1e6,#ece2d0);z-index:5;box-shadow:0 -4px 14px rgba(0,0,0,.25)`).style.opacity = 0;
  show(E.el(S.el, "abs", `left:0;top:1440px;width:1080px;height:520px;background:linear-gradient(#f7f1e6,#eae0cc);z-index:5`), ADULTS);

  // ---- mum's voice from the other room
  const mumTag = E.el(S.el, "abs", "left:620px;top:470px;font-weight:900;font-size:30px;color:#fff;background:rgba(29,43,54,.85);padding:6px 14px;border-radius:10px;z-index:8;opacity:0", "👩 MUM (FROM THE ADULTS' TABLE)");
  

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "AGE AT THE TABLE: 8 · OTTO: 35"], [KDAD, "KIDS' OPINION OF OTTO: LOW"], [TOADULT, "QUESTIONS ASKED: 0"], [CASAS + .4, "QUESTIONS ASKED: 1"], [GRAND, "QUESTIONS ASKED: 2"], [THIEF, "VOLUME: 100%"], [BACK, "KIDS' TABLE: 1 · ADULTS: 0"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= KDAD ? C.coralD : C.ink; pill.style.fontSize = s.length > 26 ? "40px" : "46px"; });
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
  const KH = { a: 120, b: 345, c: 740, d: 960 }, AH = { aunt: 140, uncle: 410, gran: 670, dad: 940 };
  bubble("Okay. It's fine. I'm fine.", 545, 880, 520, FINE, CHAIR - .1, 48);
  bubble("Uncle, you're in my chair!", KH.c, 880, 520, CHAIR, KDAD - .1, 46);
  bubble("My dad says you still live with grandma.", KH.d, 840, 560, KDAD, PEAS - .1, 42);
  bubble("…Eat your peas.", 545, 880, 440, PEAS, MUM - .1, 52);
  bubble(`<div style="font-size:26px;color:#7a8791;margin-bottom:2px">📣 MUM (FROM THE ADULTS' TABLE)</div>Otto! Come sit with us, you're thirty-five!`, 880, 700, 640, MUM, TOADULT - .05, 44, 12);
  bubble(`Então, quando é que casas?${sub("(So, when are you getting married?)")}`, AH.gran, 760, 600, CASAS, GRAND - .1, 46);
  bubble("And when are you giving us grandchildren?", AH.aunt, 760, 600, GRAND, THIEF - .1, 44);
  bubble("That referee is a THIEF!", AH.uncle, 800, 480, THIEF, EXC - .1, 46, 10);
  bubble("In MY day we had no phones!", AH.dad, 710, 520, PHONES, EXC - .1, 44, 11);
  bubble("Excuse me. I need to go to the… kids' table.", 200, 1060, 600, EXC, BACK - .1, 44);
  bubble("Welcome back, uncle.", KH.b, 880, 460, K_BACK, DESS - .1, 46);
  bubble("Want my dessert?", KH.a, 880, 420, DESS, BEST - .1, 48);
  bubble("Best table in the house.", 545, 880, 520, BEST, STAMP + .3, 50);
  E.stamp(E.el(S.el, "abs", "left:30px;top:700px;width:1020px;display:flex;justify-content:center;z-index:11"), "KIDS' TABLE 1 · ADULTS 0.", STAMP, { size: 78, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(0, "sfx/elx-dinner-party.wav", { vol: .16, duck: false, to: DUR }); E.clip(0, "sfx/elx-kids-party.wav", { vol: .1, duck: false, to: TOADULT });
  E.clip(FINE, "voices/ep115/o_fine.wav", { vol: 1.2 }); E.clip(CHAIR, "voices/ep115/k_chair.wav", { vol: 1.3 }); E.clip(KDAD, "voices/ep115/k_dad.wav", { vol: 1.3 });
  E.clip(PEAS, "voices/ep115/o_peas.wav", { vol: 1.2 }); E.clip(MUM, "voices/ep115/m_sit.wav", { vol: 1.3 });
  E.S(TOADULT, "whoosh", .4); E.clip(CASAS, "voices/ep115/g_casas.wav", { vol: 1.35 }); E.clip(GRAND, "voices/ep115/a_grand.wav", { vol: 1.3 });
  E.clip(THIEF, "voices/ep115/r_thief.wav", { vol: 1.3 }); E.clip(PHONES, "voices/ep115/r_phones.wav", { vol: 1.25 }); E.clip(THIEF, "sfx/crowd-groan.wav", { vol: .3, to: 4 });
  E.clip(EXC, "voices/ep115/o_excuse.wav", { vol: 1.2 }); E.S(BACK, "whoosh", .4);
  E.clip(K_BACK, "voices/ep115/k_back.wav", { vol: 1.3 }); E.clip(DESS, "voices/ep115/k_dessert.wav", { vol: 1.3 }); E.clip(BEST, "voices/ep115/o_best.wav", { vol: 1.2 }); E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "The *kids' table* (at 35)", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[29.2, 1], [29.45, 1.18, "out"], [29.75, 1, "io"]]);
}
