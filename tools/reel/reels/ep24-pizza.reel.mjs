// EP.24 "Grandma is 'not hungry'" — "Want some pizza?" "No, no. I'm not hungry." Every time Otto looks at his phone a slice
// disappears; every time he looks up grandma is whistling innocently with sauce on her mouth ("Just tasting." "It was cold.").
// 8 → 0 slices. The doorbell: a delivery for… grandma. "That one is mine." No voice: a visual gag with real effects (ElevenLabs sfx).
export const meta = {
  id: "ep24-pizza", date: "2026-10-17",
  images: {
    o_excited: "characters/cutouts/otto-casual_excited.webp", o_betrayed: "characters/cutouts/otto-casual_betrayed.webp",
    o_phone: "characters/cutouts/otto-phone_sleepy.webp", o_shocked: "characters/cutouts/otto-phone_shocked.webp",
    d_knowing: "characters/cutouts/dona_knowing.webp", d_pizza: "characters/cutouts/dona_pizza.webp", d_innocent: "characters/cutouts/dona_innocent.webp", d_smirk: "characters/cutouts/dona_smirk.webp",
    delivery: "characters/cutouts/leo_delivery.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 58, seed: 241, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [5, 9, 12]] });
  const DUR = 15.0;
  const S = E.scene("room", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const TABLE = 1480;
  // Otto looks at his phone (AWAY) and back (BACK); grandma eats while he is away
  const cycles = [[3.2, 4.1, 7], [5.0, 5.9, 5], [6.8, 7.7, 2], [8.6, 9.4, 0]];
  const BELL = 11.0, MINE = 12.6;

  // ---------------- the room ----------------
  E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;background:#f6e6cf");
  E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:repeating-linear-gradient(90deg,rgba(200,150,110,.10) 0 36px,transparent 36px 72px)");
  E.el(S.el, "abs", "left:360px;top:560px;width:300px;height:260px;border:16px solid #fff;border-radius:8px;background:linear-gradient(180deg,#f7b267,#ffd27a)");     // window at sunset
  E.el(S.el, "abs", "left:502px;top:560px;width:16px;height:260px;background:#fff");
  const clockEl = E.el(S.el, "abs", "left:120px;top:600px;width:140px;height:140px;border-radius:50%;background:#fff;border:10px solid #8a5f3a");
  const hand = E.el(clockEl, "abs", "left:62px;top:14px;width:6px;height:56px;border-radius:3px;background:#333;transform-origin:3px 52px");
  E.F(t => { hand.style.transform = `rotate(${t * 40}deg)`; });                                     // frame-0 motion

  // ---------------- Otto (left) ----------------
  const OS = .92, OH = 1078 * OS;
  const otto = E.el(S.el, "abs", `left:-20px;top:${TABLE + 180 - OH}px;width:${625 * OS}px;height:${OH}px;z-index:1`);
  const O = [["o_excited", 625, 1078], ["o_betrayed", 625, 1078], ["o_phone", 424, 1068], ["o_shocked", 424, 1068]];
  const oim = O.map(([n, w, h]) => E.img(otto, n, `position:absolute;left:0;bottom:0;width:${w * OS}px;height:${h * OS}px`));
  const oList = [[0, "o_excited"]];
  cycles.forEach(([a, b], i) => oList.push([a, "o_phone"], [b, i === 3 ? "o_shocked" : "o_betrayed"]));
  oList.push([BELL, "o_betrayed"]);
  E.F(t => { const f = at(oList, t); oim.forEach((im, i) => { im.style.opacity = O[i][0] === f ? 1 : 0; }); });

  // ---------------- grandma (right) ----------------
  const DS = .9, DH = 1020 * DS;
  const dona = E.el(S.el, "abs", `left:520px;top:${TABLE + 170 - DH}px;width:${700 * DS}px;height:${DH}px;z-index:1;transform-origin:40% 100%`);
  const DT = ["d_knowing", "d_pizza", "d_innocent", "d_smirk"];
  const dim = DT.map(n => E.img(dona, n, `position:absolute;left:0;bottom:0;height:${DH}px;width:auto`));
  const dList = [[0, "d_knowing"]];
  cycles.forEach(([a, b]) => dList.push([a + .15, "d_pizza"], [b, "d_innocent"]));
  dList.push([MINE - .2, "d_smirk"]);
  E.F(t => {
    const f = at(dList, t); dim.forEach((im, i) => { im.style.opacity = DT[i] === f ? 1 : 0; });
    let r = 0; if (f === "d_innocent") r = Math.sin(t * 5) * 2;                                        // innocent little sway
    dim.forEach(im => { im.style.transform = `rotate(${r}deg)`; im.style.transformOrigin = "40% 100%"; });
  });
  E.K(dona, "x", [[BELL + .2, 0], [BELL + .55, -380, "out"]]);
  E.K(otto, "x", [[BELL + .15, 0], [BELL + .5, -260, "out"]]);
  dona.style.zIndex = 1;

  // ---------------- the table and the pizza ----------------
  E.el(S.el, "abs", `left:-20px;top:${TABLE}px;width:1120px;height:${1920 - TABLE}px;background:#8a5a2b;z-index:2`);
  E.el(S.el, "abs", `left:-20px;top:${TABLE}px;width:1120px;height:30px;background:#a8764c;z-index:2`);
  const box = E.el(S.el, "abs", `left:280px;top:${TABLE - 280}px;width:520px;height:300px;z-index:3`);
  E.el(box, "abs", "left:30px;top:0;width:460px;height:150px;background:#e9dcc3;border:6px solid #cdbb98;border-bottom:none;border-radius:8px 8px 0 0;transform:skewX(-6deg)");   // the open lid
  E.el(box, "abs", "left:0;top:150px;width:520px;height:130px;background:#f0e4cb;border:6px solid #cdbb98;border-radius:10px");                                   // the base
  const pz = E.el(box, "abs", "left:110px;top:118px;width:300px;height:150px");                 // a pizza seen at an angle (squashed circle)
  const pizzaBg = "radial-gradient(circle at 30% 30%,#b22a1e 0 16px,transparent 17px),radial-gradient(circle at 68% 34%,#b22a1e 0 16px,transparent 17px),radial-gradient(circle at 50% 62%,#b22a1e 0 16px,transparent 17px),radial-gradient(circle at 26% 70%,#b22a1e 0 14px,transparent 15px),radial-gradient(circle at 74% 70%,#b22a1e 0 14px,transparent 15px),radial-gradient(circle,#ffd55a 0 58%,#e8a13c 59% 68%,#c9782a 69%)";
  const slices = [];
  for (let i = 0; i < 8; i++) {
    const a0 = i * 45 - 90, a1 = a0 + 45, P = a => `${50 + 60 * Math.cos(a * Math.PI / 180)}% ${50 + 60 * Math.sin(a * Math.PI / 180)}%`;
    slices.push(E.el(pz, "abs", `inset:0;border-radius:50%;background:${pizzaBg};clip-path:polygon(50% 50%,${P(a0)},${P(a0 + 22.5)},${P(a1)})`));
  }
  E.el(pz, "abs", "inset:0;border-radius:50%;box-shadow:inset 0 0 0 3px rgba(150,80,20,.25);pointer-events:none");
  const left = t => { let n = 8; for (const [a, b, k] of cycles) if (t >= a + .5) n = k; return n; };
  const order = [3, 5, 1, 7, 0, 4, 2, 6];
  E.F(t => { const n = left(t); slices.forEach((sl, i) => { sl.style.opacity = order.indexOf(i) < 8 - n ? 0 : 1; }); });
  // steam from frame 0
  for (let i = 0; i < 3; i++) {
    const st = E.el(S.el, "abs", `left:${470 + i * 50}px;top:${TABLE - 230}px;width:22px;height:70px;border-radius:11px;background:rgba(255,255,255,.7);z-index:3`);
    const ks = [], ko = []; for (let t = -i * .5; t < 9; t += 1.5) { const s0 = Math.max(0, t); ks.push([s0, 0], [t + 1.5, -120]); ko.push([s0, 0], [s0 + .3, .8], [t + 1.5, 0]); }
    E.K(st, "y", ks.filter(k => k[0] >= 0)); E.K(st, "o", ko.filter(k => k[0] >= 0).concat([[9.2, 0]]));
  }

  // the slice counter
  const pill = E.el(S.el, "abs", `left:100px;top:352px;display:inline-block;background:${C.ink};color:#fff;font-weight:900;font-size:56px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7;transform-origin:0 50%`, "SLICES: 8");
  E.F(t => { const n = left(t), s = "SLICES: " + n; if (pill.textContent !== s) pill.textContent = s; pill.style.background = n <= 2 ? C.coralD : C.ink; });
  E.K(pill, "s", [[0, 1], ...cycles.flatMap(([a]) => [[a + .49, 1], [a + .5, 1.3], [a + .7, 1, "back"]])]);

  // ---------------- the delivery ----------------
  const dv = E.el(S.el, "abs", `left:1100px;top:${TABLE + 150 - 1044 * .84}px;width:${648 * .84}px;height:${1044 * .84}px;z-index:1`);
  E.img(dv, "delivery", `width:${648 * .84}px;height:${1044 * .84}px`);
  E.K(dv, "x", [[BELL + .3, 0], [BELL + .65, -500, "out"]]);
  E.K(dv, "o", [[BELL + .29, 0], [BELL + .3, 1]]);

  // ---------------- sound ----------------
  E.clip(.2, "sfx/pizza-box.wav", { vol: .8 });
  cycles.forEach(([a, b]) => { E.clip(a + .2, "sfx/munch.wav", { vol: .9 }); E.S(b, "swish", .5); });
  E.clip(BELL, "sfx/doorbell.wav", { vol: .8 });
  E.S(BELL + .3, "whoosh", .6); E.S(MINE, "ding", .7);

  // ---------------- bubbles ----------------
  const bubble = (html, lft, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${lft}px;top:${top}px;width:${w}px;z-index:8;transform-origin:50% 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 70 : 58}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    E.S(t0 + .02, "pop", .6);
    return b;
  };
  bubble("Want some pizza?", 40, 560, 480, "l", .4, 1.7);
  bubble("No, no. I'm not hungry.", 420, 540, 620, "r", 1.7, 3.2, true);
  bubble("Just tasting.", 560, 620, 420, "r", 4.1, 5.0);
  bubble("It was cold.", 560, 620, 400, "r", 5.9, 6.8);
  bubble("Too salty.", 560, 620, 380, "r", 7.7, 8.6);
  bubble("See? I'm not hungry.", 420, 560, 620, "r", 9.4, BELL, true);
  bubble("Pizza for Dona Fernanda?", 460, 520, 580, "r", BELL + .6, MINE);
  bubble("That one is mine.", 40, 560, 540, "r", MINE, DUR - .6, true);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Grandma is *“not hungry”*", { size: 60, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[14.3, 1], [14.55, 1.18, "out"], [14.85, 1, "io"]]);
}
