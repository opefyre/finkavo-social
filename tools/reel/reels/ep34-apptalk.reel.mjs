// EP.34 "Portuguese: the app vs real life" — THE APP: a calm voice, "O menino come uma maçã", +500 XP, a 400-day streak, Otto
// proud. REAL LIFE: a Lisbon café barman fires "Quéquéqueres, pá? Bica, galão, meia de leite, torrada, tá?" at full speed.
// Otto panics: "The boy… eats… an apple." The barman, in perfect English: "Ah, you want a coffee? No problem, my friend."
// The streak shatters. Voiced (ElevenLabs: app voice, barman, Otto) with real café effects. Paced per the skit guide.
export const meta = {
  id: "ep34-apptalk", date: "2026-10-27",
  images: {
    proud: "characters/cutouts/otto-casual_proud.webp", awk: "characters/cutouts/otto-casual_awkward.webp", betrayed: "characters/cutouts/otto-casual_betrayed.webp",
    bTalk: "characters/cutouts/barman_talk.webp", bSmile: "characters/cutouts/barman_smile.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 60, seed: 341, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [5, 9, 12]] });
  const DUR = 15.8;
  const S = E.scene("all", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const APP = .4, XP = 2.4, CAFE = 3.9, FAST = 4.2, APPLE = 8.1, ENG = 11.95, BREAK = 14.25, FLOOR = 1760;
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };

  // ================= THE APP =================
  const A = layer(0, CAFE);
  E.el(A, "abs", "inset:0;background:linear-gradient(180deg,#e8f7e1,#cdeec2)");
  for (let i = 0; i < 18; i++) E.el(A, "abs", `left:${(i * 173) % 1080}px;top:${520 + (i * 331) % 1300}px;width:${14 + i % 3 * 8}px;height:${14 + i % 3 * 8}px;border-radius:50%;background:rgba(88,204,2,.18)`);
  const ot = E.el(A, "abs", `left:-40px;top:${FLOOR - 1078 * .95}px;width:${625 * .95}px;height:${1078 * .95}px`);
  E.img(ot, "proud", `width:${625 * .95}px;height:${1078 * .95}px`);
  const bob = []; for (let t = 0; t < CAFE; t += .6) bob.push([t, 0, "io"], [t + .3, -10, "io"]);
  E.K(ot, "y", bob);
  // the phone: a generic language-app lesson (no real brand)
  const ph = E.el(A, "abs", "left:500px;top:520px;width:520px;height:960px;border-radius:60px;background:#161616;box-shadow:0 24px 60px rgba(0,0,0,.25)");
  E.K(ph, "r", [[0, 4], [.6, 2, "out"]]);
  const scr = E.el(ph, "abs", "left:18px;top:18px;width:484px;height:924px;border-radius:44px;overflow:hidden;background:#fff");
  const bar = E.el(scr, "abs", "left:40px;top:60px;width:404px;height:26px;border-radius:13px;background:#e5e5e5;overflow:hidden");
  const fill = E.el(bar, "abs", "left:0;top:0;bottom:0;width:30%;background:#58cc02;border-radius:13px");
  E.K(fill, "sx", [[0, 1], [XP, 1], [XP + .4, 3.3, "out"]]); fill.style.transformOrigin = "0 50%";
  E.el(scr, "abs", "left:40px;top:130px;font-weight:900;font-size:34px;color:#777", "Translate this sentence");
  const card = E.el(scr, "abs", "left:40px;top:200px;width:404px;padding:28px;border-radius:26px;border:4px solid #e5e5e5;font-weight:900;font-size:44px;line-height:1.15;color:#3c3c3c", "O menino come uma maçã.");
  E.el(scr, "abs", "left:170px;top:400px;width:140px;height:130px", `<svg viewBox="0 0 64 64" width="140" height="130"><path d="M32 18c6-8 20-6 22 8 3 18-10 34-22 34S7 44 10 26c2-14 16-16 22-8z" fill="#e5484d"/><path d="M32 18c0-6 3-10 8-12" stroke="#6b3f1d" stroke-width="4" fill="none"/><path d="M34 12c6-4 12-2 14 2-6 2-10 2-14-2z" fill="#58cc02"/></svg>`);
  const ans = E.el(scr, "abs", "left:40px;top:560px;width:404px;padding:22px;border-radius:22px;background:#d7ffb8;border:4px solid #58cc02;font-weight:900;font-size:38px;color:#58a700;opacity:0", "The boy eats an apple. ✓");
  E.K(ans, "o", [[XP - .4, 0], [XP - .3, 1]]); E.K(ans, "s", [[XP - .4, .8], [XP - .15, 1, "back"]]);
  const xp = E.el(scr, "abs", "left:40px;top:720px;width:404px;display:flex;justify-content:space-between;opacity:0");
  E.el(xp, "", "background:#ffc800;color:#fff;font-weight:900;font-size:44px;padding:10px 22px;border-radius:18px", "+500 XP");
  E.el(xp, "", "background:#ff9600;color:#fff;font-weight:900;font-size:44px;padding:10px 22px;border-radius:18px", "🔥 400");
  E.K(xp, "o", [[XP - .01, 0], [XP, 1]]); E.K(xp, "s", [[XP, .4], [XP + .3, 1, "back"]]);
  for (let i = 0; i < 10; i++) {                                                           // confetti
    const c = E.el(A, "abs", `left:760px;top:900px;width:18px;height:28px;border-radius:4px;background:${["#58cc02", "#ffc800", "#1cb0f6", "#ff4b4b"][i % 4]};opacity:0`);
    const a = i / 10 * Math.PI * 2;
    E.K(c, "o", [[XP, 0], [XP + .02, 1], [XP + 1.1, 0]]); E.K(c, "x", [[XP, 0], [XP + 1.1, Math.cos(a) * 380]]); E.K(c, "y", [[XP, 0], [XP + .4, Math.sin(a) * 300 - 200, "out"], [XP + 1.1, Math.sin(a) * 300 + 150, "in"]]); E.K(c, "r", [[XP, 0], [XP + 1.1, 540]]);
  }
  E.clip(APP, "voices/ep34/app_menino.wav");
  E.clip(XP, "sfx/app-success.wav", { vol: .9 });

  // ================= REAL LIFE: the café =================
  const B = layer(CAFE, DUR);
  E.el(B, "abs", "inset:0;background:#efe0c7");
  const tileSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#f8f5ee'/><rect x='2' y='2' width='116' height='116' rx='5' fill='none' stroke='#c9d8ea' stroke-width='3'/><g fill='#2f6db5'><circle cx='60' cy='60' r='9'/><ellipse cx='60' cy='36' rx='8' ry='15'/><ellipse cx='60' cy='84' rx='8' ry='15'/><ellipse cx='36' cy='60' rx='15' ry='8'/><ellipse cx='84' cy='60' rx='15' ry='8'/></g></svg>`;
  E.el(B, "abs", `left:0;top:900px;width:1080px;height:560px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tileSvg)}");background-size:120px 120px`);
  // the espresso machine on the back shelf
  const mach = E.el(B, "abs", "left:680px;top:660px;width:330px;height:230px;border-radius:24px 24px 8px 8px;background:linear-gradient(180deg,#d9dde1,#9aa3ab);box-shadow:0 8px 16px rgba(0,0,0,.2)");
  for (let i = 0; i < 2; i++) E.el(mach, "abs", `left:${70 + i * 150}px;top:150px;width:40px;height:60px;background:#444;border-radius:0 0 8px 8px`);
  const steam = E.el(B, "abs", "left:760px;top:560px;width:60px;height:100px;border-radius:30px;background:rgba(255,255,255,.7);filter:blur(6px)");
  E.F(t => { const u = (t * 1.3) % 1; steam.style.transform = `translateY(${-u * 80}px) scale(${1 + u})`; steam.style.opacity = String(.8 * (1 - u)); });
  // the barman behind the counter
  const BS = .9, bm = E.el(B, "abs", `left:430px;top:${1450 - 993 * BS * .9}px;width:${856 * BS}px;height:${993 * BS}px`);
  const BT = ["bTalk", "bSmile"];
  const bim = BT.map(n => E.img(bm, n, `position:absolute;left:0;top:0;width:${856 * BS}px;height:${993 * BS}px`));
  E.F(t => {
    const f = t >= ENG - .1 ? "bSmile" : "bTalk"; bim.forEach((im, i) => { im.style.opacity = BT[i] === f ? 1 : 0; });
    bm.style.transform = t >= FAST && t < FAST + 3.65 ? `translate(${Math.sin(t * 55) * 4}px,${Math.cos(t * 47) * 3}px)` : "none";
  });
  // the counter
  E.el(B, "abs", "left:0;top:1420px;width:1080px;height:500px;background:#6a3e1e");
  E.el(B, "abs", "left:0;top:1420px;width:1080px;height:34px;background:#a8764c");
  E.el(B, "abs", "left:620px;top:1370px;width:74px;height:52px;border-radius:0 0 20px 20px;background:#fff;border:6px solid #6b3f1d");
  // Otto on the customer side
  const OS = .92, ot2 = E.el(B, "abs", `left:-30px;top:${1900 - 1078 * OS}px;width:${625 * OS}px;height:${1078 * OS}px;transform-origin:50% 100%`);
  const OT = [["awk", 488], ["betrayed", 625]];
  const oim = OT.map(([n, w]) => E.img(ot2, n, `position:absolute;left:0;bottom:0;width:${w * OS}px;height:${1078 * OS}px`));
  E.F(t => {
    const f = t >= APPLE - .3 && t < ENG ? "awk" : "betrayed"; oim.forEach((im, i) => { im.style.opacity = OT[i][0] === f ? 1 : 0; });
    ot2.style.transform = t >= FAST && t < APPLE ? `rotate(${Math.sin(t * 60) * 1.2}deg)` : t >= BREAK ? `scaleY(${1 - Math.min(1, (t - BREAK) / .8) * .1})` : "none";
  });
  // sweat drops while the barman fires away
  for (let i = 0; i < 6; i++) {
    const t = FAST + .5 + i * .5, d = E.el(B, "abs", `left:${200 + (i % 2) * 60}px;top:950px;width:22px;height:30px;border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;background:#6cc6ff;opacity:0`);
    E.K(d, "o", [[t, 0], [t + .02, 1], [t + .45, 0]]); E.K(d, "x", [[t, 0], [t + .45, (i % 2 ? 1 : -1) * 70]]); E.K(d, "y", [[t, 0], [t + .2, -40, "out"], [t + .45, 40, "in"]]);
  }
  E.clip(CAFE, "sfx/cafe-morning.wav", { vol: .35, duck: false });
  E.clip(CAFE + 2.9, "sfx/cafe-morning.wav", { vol: .35, duck: false });
  E.clip(CAFE + 5.8, "sfx/cafe-morning.wav", { vol: .3, duck: false, to: ENG - CAFE - 5.8 });
  E.clip(FAST, "voices/ep34/barman_fast.wav", { vol: 1.1 });
  E.clip(APPLE, "voices/ep34/otto_apple.wav", { vol: 1.1 });
  E.clip(ENG, "voices/ep34/barman_english.wav", { vol: 1.1 });
  E.S(CAFE - .05, "swish", .8); E.S(ENG, "ding", .5);

  // the streak shatters
  const streak = E.el(S.el, "abs", "left:620px;top:352px;display:flex;gap:10px;align-items:center;background:#ff9600;color:#fff;font-weight:900;font-size:52px;padding:.06em .4em .1em;border-radius:.3em;z-index:7;opacity:0", "🔥 400 days");
  E.K(streak, "o", [[CAFE, 0], [CAFE + .1, 1], [BREAK + .5, 1], [BREAK + .6, 0]]);
  E.F(t => { if (t >= BREAK - .05 && t < BREAK + .5) streak.style.transform = `translateX(${Math.sin(t * 90) * 10}px)`; });
  for (let i = 0; i < 9; i++) {
    const sh = E.el(S.el, "abs", `left:${700 + (i % 3) * 50}px;top:${360 + Math.floor(i / 3) * 18}px;width:${40 + (i % 2) * 20}px;height:${26 + (i % 3) * 10}px;background:#ff9600;clip-path:polygon(0 0,100% 30%,60% 100%);z-index:7;opacity:0`);
    E.K(sh, "o", [[BREAK + .5, 0], [BREAK + .51, 1], [BREAK + 1.3, 0]]);
    E.K(sh, "x", [[BREAK + .5, 0], [BREAK + 1.3, (i - 4) * 60]]); E.K(sh, "y", [[BREAK + .5, 0], [BREAK + 1.3, 300 + i * 30, "in"]]); E.K(sh, "r", [[BREAK + .5, 0], [BREAK + 1.3, (i % 2 ? 1 : -1) * 300]]);
  }
  E.clip(BREAK + .45, "sfx/glass-shatter.wav", { vol: .8 });
  const zero = E.el(S.el, "abs", "left:620px;top:352px;background:#8a8a8a;color:#fff;font-weight:900;font-size:52px;padding:.06em .4em .1em;border-radius:.3em;z-index:7;opacity:0", "🔥 0 days");
  E.K(zero, "o", [[BREAK + .6, 0], [BREAK + .7, 1]]);

  // ---------------- labels, subtitles, bubbles ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:#58cc02;color:#fff;font-weight:900;font-size:52px;padding:.06em .4em .1em;border-radius:.3em;white-space:nowrap;z-index:7`, "THE APP");
  E.F(t => { const r = t >= CAFE; const s = r ? "REAL LIFE" : "THE APP"; if (pill.textContent !== s) { pill.textContent = s; pill.style.background = r ? C.coralD : "#58cc02"; } });
  E.K(pill, "s", [[CAFE - .01, 1], [CAFE, 1.3], [CAFE + .2, 1, "back"]]);
  const bubble = (html, left, top, w, tail, t0, t1, fs = 56) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:20px 28px 24px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = s => `<div style="font-size:34px;font-weight:800;opacity:.6;margin-top:6px">${s}</div>`;
  bubble(`Quéquéqueres, pá? Bica, galão, meia de leite, torrada, tá?${sub("(what'll it be, mate? espresso, milky coffee, toast?)")}`, 380, 470, 680, 360, FAST, APPLE - .1, 50);
  bubble("The boy… eats… an apple.", 40, 640, 560, 150, APPLE, ENG - .05, 58);
  bubble("Ah, you want a coffee? No problem, my friend.", 380, 470, 680, 360, ENG, DUR - .6, 54);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Portuguese: *app vs real life*", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[15.0, 1], [15.25, 1.18, "out"], [15.6, 1, "io"]]);
}
