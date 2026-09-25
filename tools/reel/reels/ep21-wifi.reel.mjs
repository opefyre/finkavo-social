// EP.21 "Grandma's WiFi password" — Otto asks. Grandma reads it from a notebook full of sticky notes: "Capital B… the number of
// the house… my first cat… no, the SECOND cat… then a little flower." Incorrect password ×3. Otto flips the router: the sticker
// says "password". Grandma: "Ah! That's the NEW one!" Voices and effects: ElevenLabs. Paced per reel-pacing.
export const meta = {
  id: "ep21-wifi", date: "2026-10-14",
  images: {
    o_sleepy: "characters/cutouts/otto-phone_sleepy.webp", o_shocked: "characters/cutouts/otto-phone_shocked.webp", o_panic: "characters/cutouts/otto-phone_panic.webp",
    d_knowing: "characters/cutouts/dona_knowing.webp", d_note: "characters/cutouts/dona_notebook.webp", d_smirk: "characters/cutouts/dona_smirk.webp",
    p_router: "characters/props/router.webp", p_doily: "characters/props/doily.webp", p_dog: "characters/props/porcelain-dog.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 98, root: 55, seed: 211, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [5, 9, 12]] });
  const DUR = 15.2;
  const S = E.scene("room", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FLOOR = 1760, READ = 2.2, FAIL = 9.55, FLIP = 10.9, PW = 11.45, NEW = 12.45;

  // ---------------- the room ----------------
  E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;background:#e9e1d2");
  E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:repeating-linear-gradient(0deg,rgba(150,120,90,.08) 0 2px,transparent 2px 60px)");
  E.el(S.el, "abs", `left:0;top:${FLOOR}px;width:1080px;height:200px;background:#9c6f45`);
  // a wall shelf: doily, porcelain dog, the router
  E.el(S.el, "abs", "left:590px;top:740px;width:460px;height:24px;border-radius:6px;background:#7a4a26;box-shadow:0 8px 0 rgba(0,0,0,.12)");
  const doily = E.el(S.el, "abs", "left:610px;top:720px;width:420px;height:40px;overflow:hidden"); E.img(doily, "p_doily", "width:420px;height:250px;margin-top:-150px");
  const dog = E.el(S.el, "abs", "left:900px;top:585px;width:130px;height:144px"); E.img(dog, "p_dog", "width:130px;height:144px");
  // the router: its lights blink; at FLIP it lifts and turns over to show the sticker underneath
  const rWrap = E.el(S.el, "abs", "left:620px;top:600px;width:250px;height:187px;transform-origin:50% 50%;z-index:2");
  const rTop = E.el(rWrap, "abs", "inset:0"); E.img(rTop, "p_router", "width:250px;height:187px");
  const leds = [0, 1, 2, 3].map(i => E.el(rTop, "abs", `left:${81 + i * 25}px;top:131px;width:12px;height:12px;border-radius:50%;background:#7bd23a`));
  E.F(t => leds.forEach((l, i) => { l.style.opacity = (Math.floor(t * 6 + i * 1.7) % 3) ? 1 : .25; }));
  const rBot = E.el(rWrap, "abs", "left:0;top:60px;width:250px;height:120px;border-radius:16px;background:#dfe3e6;box-shadow:inset 0 -8px 0 #c3c9cd;opacity:0");
  const sticker = E.el(rBot, "abs", "left:22px;top:14px;width:206px;height:92px;border-radius:8px;background:#fff;box-shadow:0 2px 4px rgba(0,0,0,.2);display:flex;flex-direction:column;justify-content:center;padding:0 12px;font-weight:900;color:#333", `<div style="font-size:18px;opacity:.7">WiFi password:</div><div style="font-size:40px;letter-spacing:-.01em">password</div>`);
  E.K(rWrap, "y", [[FLIP, 0], [FLIP + .3, -60, "out"], [NEW - .35, -60], [NEW - .05, 0, "io"]]);
  E.K(rWrap, "s", [[FLIP, 1], [FLIP + .3, 2.3, "out"], [NEW - .35, 2.3], [NEW - .05, 1.15, "io"]]);
  E.K(rWrap, "sy", [[FLIP + .05, 1], [FLIP + .2, .02, "in"], [FLIP + .21, .02], [FLIP + .38, 1, "out"]]);
  E.F(t => { const flipped = t >= FLIP + .2; rTop.style.opacity = flipped ? 0 : 1; rBot.style.opacity = flipped ? 1 : 0; });
  E.K(rWrap, "x", [[FLIP, 0], [FLIP + .3, -100, "out"], [NEW - .35, -100], [NEW - .05, 0, "io"]]);
  E.S(FLIP, "whoosh", .7); E.S(FLIP + .4, "sparkle", .9); E.S(FLIP + .45, "ding", .6);

  // ---------------- Otto and grandma ----------------
  const OS = .9;
  const otto = E.el(S.el, "abs", `left:-10px;top:${FLOOR - 1068 * OS + 10}px;width:${424 * OS}px;height:${1068 * OS}px;z-index:3;transform-origin:50% 100%`);
  const OT = ["o_sleepy", "o_shocked", "o_panic"];
  const oim = OT.map(n => E.img(otto, n, `position:absolute;left:0;top:0;width:${424 * OS}px;height:${1068 * OS}px`));
  E.F(t => {
    const f = at([[0, "o_sleepy"], [READ + 2.2, "o_shocked"], [FAIL, "o_panic"], [PW - .1, "o_sleepy"]], t);
    oim.forEach((im, i) => { im.style.opacity = OT[i] === f ? 1 : 0; });
    otto.style.transform = t >= FAIL && t < FLIP ? `rotate(${Math.sin(t * 60) * 1.5}deg)` : "none";
  });
  const DS = .9;
  const dona = E.el(S.el, "abs", `left:420px;top:${FLOOR - 1024 * DS + 10}px;width:${700 * DS}px;height:${1024 * DS}px;z-index:2`);
  const DT = ["d_knowing", "d_note", "d_smirk"];
  const dim = DT.map(n => E.img(dona, n, `position:absolute;left:0;bottom:0;height:${1020 * DS}px;width:auto`));
  E.F(t => { const f = at([[0, "d_knowing"], [READ - .1, "d_note"], [FAIL, "d_knowing"], [NEW - .1, "d_smirk"]], t); dim.forEach((im, i) => { im.style.opacity = DT[i] === f ? 1 : 0; }); });
  const sway = []; for (let t = 0; t <= DUR; t += .8) sway.push([t, (Math.round(t / .8) % 2) ? -7 : 0, "io"]);
  E.K(dona, "y", sway);

  // ---------------- the phone screen (big, top left) ----------------
  const card = E.el(S.el, "abs", "left:40px;top:420px;width:540px;height:340px;border-radius:32px;background:#fff;box-shadow:0 16px 40px rgba(0,0,0,.22);z-index:6;opacity:0;padding:24px 28px;display:flex;flex-direction:column;gap:12px;transform-origin:20% 100%");
  E.el(card, "", "font-weight:900;font-size:40px;color:#333;display:flex;align-items:center;gap:14px", `<span style="display:inline-block;width:40px;height:30px;border-radius:40px 40px 4px 4px;border:7px solid #2f6f63;border-bottom:none"></span>Casa da Avó`);
  E.el(card, "", "font-weight:700;font-size:28px;color:#777", "Enter password");
  const field = E.el(card, "", "height:84px;border-radius:16px;border:4px solid #2f6f63;display:flex;align-items:center;padding:0 18px;font-weight:900;font-size:40px;color:#222;white-space:nowrap;overflow:hidden", "");
  const err = E.el(card, "", "font-weight:900;font-size:36px;color:#e5484d;opacity:0", "Incorrect password");
  const tries = E.el(card, "", "font-weight:800;font-size:28px;color:#999", "");
  E.K(card, "o", [[READ + .2, 0], [READ + .35, 1], [FLIP - .05, 1], [FLIP + .1, 0]]);
  E.K(card, "s", [[READ + .2, .6], [READ + .45, 1, "back"]]);
  // what gets typed, in step with the reading (the voice line runs READ … READ + 7.2)
  const typed = [[0, ""], [READ + .9, "B"], [READ + 2.4, "B12"], [READ + 3.9, "B12Mimi"], [READ + 4.9, "B12"], [READ + 5.6, "B12Farrusco"], [READ + 6.7, "B12Farrusco✿"]];
  E.F(t => {
    const v = at(typed, t), caret = (Math.floor(t * 2.5) % 2) && t < FAIL ? "|" : "";
    const s = v + caret; if (field.textContent !== s) field.textContent = s;
    const n = t < FAIL ? 0 : t < FAIL + .45 ? 1 : t < FAIL + .9 ? 2 : 3;
    err.style.opacity = n ? 1 : 0; const ts = n ? `Attempt ${n} of 3` : ""; if (tries.textContent !== ts) tries.textContent = ts;
    field.style.borderColor = n ? "#e5484d" : "#2f6f63";
    card.style.marginLeft = n && t < FAIL + 1.2 ? `${Math.sin(t * 90) * 10}px` : "0";
  });
  [READ + .9, READ + 2.4, READ + 3.9, READ + 5.6, READ + 6.7].forEach(t => E.clip(t - .1, "sfx/phone-typing.wav", { vol: .5, to: .7, duck: false }));
  [FAIL, FAIL + .45, FAIL + .9].forEach(t => E.clip(t, "sfx/phone-error.wav", { vol: .8 }));

  // ---------------- voices ----------------
  E.clip(.3, "voices/ep21/o_wifi.wav");
  E.clip(READ, "voices/ep21/g_password.wav");
  E.clip(PW, "voices/ep21/o_password.wav");
  E.clip(NEW, "voices/ep21/g_new.wav");

  // ---------------- bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const box = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 72 : 56}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(box, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Grandma, what's the WiFi password?", 40, 600, 620, "l", .3, READ);
  const lines = [["Capital B…", READ, READ + 1.5], ["…the number of the house…", READ + 1.5, READ + 3.0], ["…my first cat…", READ + 3.0, READ + 4.3], ["…no, the SECOND cat…", READ + 4.3, READ + 5.9], ["…then a little flower.", READ + 5.9, FAIL]];
  lines.forEach(([s, a, b]) => bubble(s, 590, 410, 460, "r", a, b));
  bubble("…It's “password”.", 40, 1180, 470, "l", PW, NEW - .05);
  bubble("Ah! That's the NEW one!", 400, 400, 640, "r", NEW, DUR - .7, true);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Grandma's *WiFi password*", { size: 60, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[14.45, 1], [14.7, 1.18, "out"], [15.0, 1, "io"]]);
}
