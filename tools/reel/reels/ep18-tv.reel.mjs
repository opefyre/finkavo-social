// EP.18 "Grandma's TV volume" — the TV at 100: the walls shake, the painting tilts, a cat flies past the window. Otto's
// "hi grandma" is tiny. He turns it down to 20 — "WHAT? I can't hear anything!" — she turns it back to 100 (the painting falls),
// then leans over and whispers something. Now HE can't hear. Universal joke. Paced per the reel-pacing note.
export const meta = {
  id: "ep18-tv", date: "2026-10-11",
  images: {
    o_ears: "characters/cutouts/otto-coat_ears.webp", o_wave: "characters/cutouts/otto-coat_wave.webp", o_remote: "characters/cutouts/otto-coat_remote.webp",
    d_knowing: "characters/cutouts/dona_knowing.webp", d_hear: "characters/cutouts/dona_hear.webp", d_whisper: "characters/cutouts/dona_whisper.webp", d_smirk: "characters/cutouts/dona_smirk.webp",
    p_cat: "characters/props/cat.webp", p_paint: "characters/props/painting.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 55, seed: 181, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [5, 9, 12]] });
  const DUR = 14.2;
  const S = E.scene("room", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FLOOR = 1760, DOWN = 3.3, WHAT = 4.6, UP = 6.6, WHISPER = 8.6, HUH = 10.6;
  const loud = t => t < DOWN || t >= UP + .4;

  // ---------------- the living room (it shakes when the TV is loud) ----------------
  const room = E.el(S.el, "abs", "inset:0");
  E.el(room, "abs", "left:-40px;top:-40px;width:1160px;height:2000px;background:#e6dcc8");
  E.el(room, "abs", "left:-40px;top:-40px;width:1160px;height:2000px;background-image:radial-gradient(circle at 20px 20px,rgba(170,120,90,.18) 6px,transparent 7px);background-size:80px 80px");
  E.el(room, "abs", `left:-40px;top:${FLOOR}px;width:1160px;height:300px;background:#9c6f45`);
  // window (the cat flies past it)
  const win = E.el(room, "abs", "left:70px;top:540px;width:280px;height:280px;border:16px solid #fff;border-radius:8px;overflow:hidden;background:linear-gradient(180deg,#8fc3e8,#d6ecf7)");
  E.el(win, "abs", "left:116px;top:0;width:16px;height:100%;background:#fff");
  const cat = E.el(win, "abs", "left:-300px;top:50px;width:216px;height:171px");
  E.img(cat, "p_cat", "width:216px;height:171px");
  E.K(cat, "x", [[2.0, 0], [2.9, 680, "lin"]]); E.K(cat, "y", [[2.0, 60], [2.45, -20, "out"], [2.9, 60, "in"]]); E.K(cat, "r", [[2.0, -10], [2.9, 30]]);
  E.S(2.0, "whoosh", .8);
  // the painting: tilts while it is loud, falls at the second blast
  const paint = E.el(room, "abs", "left:385px;top:580px;width:214px;height:175px;transform-origin:50% 0");
  E.img(paint, "p_paint", "width:214px;height:175px");
  E.el(room, "abs", "left:486px;top:560px;width:12px;height:12px;border-radius:50%;background:#6b5a48");
  const FALL = 7.5;
  E.F(t => {
    let r = 0, y = 0;
    if (t < DOWN) r = Math.sin(t * 9) * 5 + t * 3;
    if (t >= DOWN && t < UP + .4) r = 3 * 3.3;
    if (t >= UP + .4 && t < FALL) r = Math.sin(t * 11) * 7 + 12;
    if (t >= FALL) { const k = Math.min(1, (t - FALL) / .35); y = k * k * 900; r = 12 + k * 60; }
    paint.style.transform = `translateY(${y}px) rotate(${r}deg)`;
  });
  E.S(FALL + .35, "crack", .8);
  // the TV on a cabinet
  E.el(room, "abs", "left:830px;top:880px;width:18px;height:60px;background:#444");                                   // wall bracket
  const tv = E.el(room, "abs", "left:620px;top:540px;width:450px;height:340px;border-radius:16px;background:#111;border:14px solid #2b2b2b;overflow:hidden");
  const show = E.el(tv, "abs", "inset:0;background:linear-gradient(180deg,#ff9a5a,#ffd27a 60%,#f7b267)");
  E.el(show, "abs", "left:120px;top:100px;width:90px;height:220px;border-radius:45px 45px 0 0;background:#3b2a3a");
  E.el(show, "abs", "left:210px;top:110px;width:90px;height:210px;border-radius:45px 45px 0 0;background:#2a2a3b");
  const volBox = E.el(tv, "abs", "left:20px;right:20px;bottom:20px;height:70px;display:flex;align-items:center;gap:14px");
  E.el(volBox, "", "color:#fff;font-weight:900;font-size:40px;text-shadow:0 2px 0 #000", "VOL");
  const barBg = E.el(volBox, "", "flex:1;height:26px;border-radius:13px;background:rgba(255,255,255,.3);overflow:hidden;position:relative");
  const bar = E.el(barBg, "abs", "left:0;top:0;bottom:0;width:100%;background:#35d07f");
  const volN = E.el(volBox, "", "color:#fff;font-weight:900;font-size:52px;min-width:96px;text-align:right;text-shadow:0 2px 0 #000", "100");
  const vol = t => t < DOWN ? 100 : t < DOWN + .8 ? Math.round(100 - 80 * (t - DOWN) / .8) : t < UP ? 20 : t < UP + .4 ? Math.round(20 + 80 * (t - UP) / .4) : 100;
  E.F(t => {
    const v = vol(t); bar.style.width = v + "%"; bar.style.background = v >= 90 ? "#e5484d" : "#35d07f";
    const s = String(v); if (volN.textContent !== s) volN.textContent = s;
    // the whole room trembles while it is loud
    room.style.transform = loud(t) ? `translate(${Math.sin(t * 83) * 5}px,${Math.cos(t * 71) * 4}px)` : "none";
  });
  // sound rings pulsing out of the TV while it is loud
  for (let i = 0; i < 3; i++) {
    const ringEl = E.el(room, "abs", "left:755px;top:620px;width:180px;height:180px;border-radius:50%;border:10px solid rgba(229,72,77,.6)");
    E.F(t => {
      const ph = ((t * 1.6) + i / 3) % 1;
      ringEl.style.opacity = loud(t) ? String(1 - ph) : "0";
      ringEl.style.transform = `scale(${1 + ph * 3.2})`;
    });
  }
  // the TV noise itself, chained 1-second blasts while loud
  for (let t = 0; t < DOWN; t += 1) E.S(t, "blare", t === 0 ? .8 : .9);
  for (let t = UP + .4; t < DUR - .5; t += 1) E.S(t, "blare", .9);
  E.S(DOWN, "tick", 1); E.S(UP, "tick", 1);

  // ---------------- Otto ----------------
  const OS = .9;
  const otto = E.el(S.el, "abs", `left:-80px;top:${FLOOR - 1081 * OS + 10}px;width:${760 * OS}px;height:${1081 * OS}px;z-index:2`);
  const O = [["o_ears", 629, 1081, 0, 0], ["o_wave", 629, 1081, 0, 0], ["o_remote", 725, 1079, 24, 2]];
  const oim = O.map(([n, w, h, dx, dy]) => E.img(otto, n, `position:absolute;left:${dx * OS}px;top:${dy * OS}px;width:${w * OS}px;height:${h * OS}px`));
  E.F(t => {
    const f = at([[0, "o_ears"], [DOWN - .5, "o_remote"], [DOWN + 1.0, "o_wave"], [UP + .4, "o_ears"]], t);
    oim.forEach((im, i) => { im.style.opacity = O[i][0] === f ? 1 : 0; });
    otto.style.transform = loud(t) ? `rotate(${Math.sin(t * 40) * 1.5}deg)` : "none";
  });

  // ---------------- grandma ----------------
  const DS = .88;
  const dona = E.el(S.el, "abs", `left:370px;top:${FLOOR - 1024 * DS + 10}px;width:${700 * DS}px;height:${1024 * DS}px;z-index:1`);
  const DT = ["d_knowing", "d_hear", "d_whisper", "d_smirk"];
  const dim = DT.map(n => E.img(dona, n, `position:absolute;left:0;bottom:0;height:${1014 * DS}px;width:auto`));
  E.F(t => { const f = at([[0, "d_knowing"], [WHAT, "d_hear"], [UP + .4, "d_smirk"], [WHISPER, "d_whisper"], [HUH + .6, "d_smirk"]], t); dim.forEach((im, i) => { im.style.opacity = DT[i] === f ? 1 : 0; }); });
  // she rocks to the telenovela
  const rock = []; for (let t = 0; t <= DUR; t += .7) rock.push([t, (Math.round(t / .7) % 2) ? 3 : -3, "io"]);
  E.K(dona, "r", rock); dona.style.transformOrigin = "50% 100%";
  E.K(dona, "x", [[WHISPER - .3, 0], [WHISPER, -130, "out"], [HUH + 1.2, -130], [HUH + 1.5, 0, "io"]]);   // leans in to whisper

  // ---------------- bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 60) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const box = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(box, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    E.S(t0 + .02, "pop", .6);
    return b;
  };
  bubble("hi grandma", 60, 760, 280, "l", .4, 1.9, 28);                         // drowned out: tiny
  bubble("WHAT?! I can't hear ANYTHING!", 300, 370, 700, "r", WHAT + .2, UP, 66);
  bubble("can you hear me?", 330, 900, 320, "r", WHISPER + .3, HUH - .1, 28);    // her whisper: tiny
  bubble("WHAT?!", 40, 400, 420, "l", HUH, 12.9, 96);
  E.S(HUH, "nope", .8);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Grandma's *TV volume*", { size: 66, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[13.3, 1], [13.55, 1.18, "out"], [13.9, 1, "io"]]);
}
