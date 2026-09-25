// EP.23 "Grandma at the pharmacy" — "Bom dia, Senhor Carlos! How is your MOTHER?" … the cousin in France … the dog. The camera
// pans down an endless queue, the clock spins, Otto (next in line) grows a long beard. "So… what do you need?" — "Oh, nothing! I
// only came to say hello!" Voiced (the joke is the chatter): ElevenLabs, branding/voices/ep23. Paced per reel-pacing.
export const meta = {
  id: "ep23-pharmacy", date: "2026-10-16",
  images: {
    d_knowing: "characters/cutouts/dona_knowing.webp", d_smirk: "characters/cutouts/dona_smirk.webp", d_hear: "characters/cutouts/dona_hear.webp",
    p_polite: "characters/cutouts/pharmacist_polite.webp", p_tired: "characters/cutouts/pharmacist_tired.webp",
    o_excited: "characters/cutouts/otto-casual_excited.webp", o_betrayed: "characters/cutouts/otto-casual_betrayed.webp",
    o_stubble: "characters/cutouts/otto-casual_stubble.webp", o_ancient: "characters/cutouts/otto-casual_ancient.webp",
    leo: "characters/cutouts/leo_default.webp", marta: "characters/cutouts/marta_default.webp", buck: "characters/cutouts/buck_default.webp", zoe: "characters/cutouts/zoe_default.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 55, seed: 231, prog: [[0, 4, 7], [5, 9, 12], [2, 5, 9], [7, 11, 14]] });
  const DUR = 16.0;
  const S = E.scene("shop", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FEET = 1880, COUNTER = 1360;
  const MOTHER = .5, FINE = 4.0, COUSIN = 5.25, DOG = 7.7, NEED = 10.2, HELLO = 11.95;
  const PAN0 = 5.3, PAN1 = 6.2, PAN2 = 6.9, PAN3 = 7.6;

  // ---------------- the pharmacy (the stage pans left along the queue) ----------------
  const stage = E.el(S.el, "abs", "inset:0");
  E.el(stage, "abs", "left:-2200px;top:0;width:3300px;height:1920px;background:#e3f1ea");
  E.el(stage, "abs", `left:-2200px;top:${COUNTER + 60}px;width:3300px;height:${1920 - COUNTER - 60}px;background:#d5ddd8;background-image:linear-gradient(90deg,rgba(0,0,0,.05) 2px,transparent 2px);background-size:120px 100%`);
  const cols = ["#ffffff", "#bfe3d3", "#f7e3a3", "#f2b8b0", "#c9d7f2"];
  for (let r = 0; r < 4; r++) {
    const y = 560 + r * 170;
    E.el(stage, "abs", `left:-2200px;top:${y + 130}px;width:3300px;height:14px;background:#9fb3aa`);
    for (let i = 0; i < 50; i++) E.el(stage, "abs", `left:${-2180 + i * 66 + (r % 2) * 18}px;top:${y + 40 + ((i * 5 + r) % 3) * 10}px;width:${48 + (i % 3) * 6}px;height:${90 - ((i * 5 + r) % 3) * 10}px;border-radius:5px;background:${cols[(i + r * 2) % 5]};box-shadow:inset 0 -12px 0 rgba(0,0,0,.06)`);
  }
  // the green cross sign
  const cross = E.el(stage, "abs", "left:840px;top:430px;width:170px;height:170px;z-index:1");
  E.el(cross, "abs", "left:55px;top:0;width:60px;height:170px;background:#22b35e;border-radius:10px;box-shadow:0 0 30px rgba(34,179,94,.6)");
  E.el(cross, "abs", "left:0;top:55px;width:170px;height:60px;background:#22b35e;border-radius:10px;box-shadow:0 0 30px rgba(34,179,94,.6)");
  E.F(t => { cross.style.opacity = (Math.floor(t * 2) % 2) ? 1 : .85; });
  // the pharmacist behind the counter
  const PS = .78;
  const ph = E.el(stage, "abs", `left:640px;top:${COUNTER - 700 * PS}px;width:${507 * PS}px;height:${1100 * PS}px;z-index:0`);
  const PT = ["p_polite", "p_tired"];
  const pim = PT.map(n => E.img(ph, n, `position:absolute;left:0;top:0;width:${507 * PS}px;height:${1100 * PS}px`));
  E.F(t => { const f = t >= DOG + .5 ? "p_tired" : "p_polite"; pim.forEach((im, i) => { im.style.opacity = PT[i] === f ? 1 : 0; }); });
  const counter = E.el(stage, "abs", `left:560px;top:${COUNTER}px;width:560px;height:${1920 - COUNTER}px;background:#f4f7f5;z-index:1;box-shadow:inset 0 30px 0 #2e7d57`);
  E.el(counter, "abs", "left:200px;top:120px;width:120px;height:120px;border-radius:14px;background:#22b35e;opacity:.9");
  E.el(counter, "abs", "left:245px;top:140px;width:30px;height:80px;background:#fff"); E.el(counter, "abs", "left:220px;top:165px;width:80px;height:30px;background:#fff");

  // ---------------- grandma at the counter ----------------
  const DS = .86;
  const dona = E.el(stage, "abs", `left:300px;top:${FEET - 1024 * DS}px;width:${700 * DS}px;height:${1024 * DS}px;z-index:3`);
  const DT = ["d_knowing", "d_smirk", "d_hear"];
  const dim = DT.map(n => E.img(dona, n, `position:absolute;left:0;bottom:0;height:${1014 * DS}px;width:auto`));
  E.F(t => { const f = at([[0, "d_smirk"], [FINE, "d_knowing"], [COUSIN, "d_smirk"], [DOG, "d_hear"], [NEED, "d_knowing"], [HELLO, "d_smirk"]], t); dim.forEach((im, i) => { im.style.opacity = DT[i] === f ? 1 : 0; }); });
  const chat = []; for (let t = 0; t <= DUR; t += .45) chat.push([t, (Math.round(t / .45) % 2) ? -8 : 0, "io"]);
  E.K(dona, "y", chat);                                                                  // she bobs as she talks

  // ---------------- the queue ----------------
  const OS = .84;
  const otto = E.el(stage, "abs", `left:-40px;top:${FEET - 1078 * OS}px;width:${625 * OS}px;height:${1078 * OS}px;z-index:2`);
  const OT = ["o_excited", "o_betrayed", "o_stubble", "o_ancient"];
  const oim = OT.map(n => E.img(otto, n, `position:absolute;left:0;top:0;width:${625 * OS}px;height:${1078 * OS}px`));
  E.F(t => { const f = at([[0, "o_excited"], [3.0, "o_betrayed"], [PAN3, "o_stubble"], [9.0, "o_ancient"]], t); oim.forEach((im, i) => { im.style.opacity = OT[i] === f ? 1 : 0; }); });
  E.S(9.0, "poof", .7); E.flash(9.0, "#fff4c0", .2, .2);
  const Q = [["leo", 514, 1019, -560], ["marta", 498, 1017, -960], ["buck", 581, 976, -1360], ["zoe", 1075, 1818, -1760]];
  Q.forEach(([n, w, h, x], i) => {
    const H = n === "zoe" ? 960 : 900, W = w * H / h;
    const el = E.el(stage, "abs", `left:${x}px;top:${FEET - H}px;width:${W}px;height:${H}px;z-index:2`);
    E.img(el, n, `width:${W}px;height:${H}px`);
    const k = []; for (let t = 0; t < DUR; t += .9) k.push([t, (Math.round(t / .9 + i) % 2) ? -8 : 0, "io"]);
    E.K(el, "y", k);
  });
  for (let i = 0; i < 6; i++) E.el(stage, "abs", `left:${-1900 - i * 60}px;top:${FEET - 400 + i * 14}px;width:${70 - i * 6}px;height:${360 - i * 30}px;border-radius:40px 40px 10px 10px;background:rgba(80,110,95,${.5 - i * .06});z-index:1`);
  E.K(stage, "x", [[PAN0, 0], [PAN1, 1500, "io"], [PAN2, 1500], [PAN3, 0, "io"]]);
  E.S(PAN0, "whoosh", .6); E.S(PAN2, "whoosh", .5);

  // ---------------- the clock ----------------
  const clock = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:56px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7`, "10:02");
  const mins = t => t < 3 ? 602 : t < NEED ? 602 + (700 - 602) * Math.min(1, (t - 3) / (NEED - 3)) : 700;
  E.F(t => { const m = Math.round(mins(t)), s = `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`; if (clock.textContent !== s) clock.textContent = s; });

  // ---------------- voices ----------------
  E.clip(.3, "sfx/pharmacy-beep.wav", { vol: .5 });
  E.clip(MOTHER, "voices/ep23/g_mother.wav");
  E.clip(FINE, "voices/ep23/p_fine.wav");
  E.clip(COUSIN, "voices/ep23/g_cousin.wav");
  E.clip(DOG, "voices/ep23/g_dog.wav");
  E.clip(NEED, "voices/ep23/p_need.wav");
  E.clip(HELLO, "voices/ep23/g_hello.wav");

  // ---------------- bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const box = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 68 : 56}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(box, "abs", `${typeof tail === "number" ? `left:${tail}px` : tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Bom dia, Senhor Carlos! How is your MOTHER?", 80, 560, 620, 360, MOTHER, FINE);
  bubble("She's fine, thank you.", 520, 460, 500, "r", FINE, COUSIN);
  bubble("And your cousin? The one in France?", 80, 580, 620, 360, COUSIN, DOG);
  bubble("And the dog? Is he still sad?", 80, 580, 620, 360, DOG, NEED);
  bubble("So… what do you need?", 520, 460, 500, "r", NEED, HELLO);
  bubble("Oh, nothing! I only came to say hello!", 60, 520, 680, 380, HELLO, DUR - .6, true);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Grandma at the *pharmacy*", { size: 58, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[15.2, 1], [15.45, 1.18, "out"], [15.8, 1, "io"]]);
}
