// EP.3 "Rent a flat" — Otto views a tiny room; the landlord (Sr. Renda) points at things and each one adds to the rent, while the wall
// (a partition) slides in on Otto. The picture is the joke: price up, room down. Stands alone; no series numbering, no "follow" line.
// Exaggerated on purpose (the caption says so). One rent counter, one closing wall, one twist: "DEPOSIT: 6 MONTHS" and the wall slams shut.
export const meta = {
  id: "ep3-flat", date: "2026-09-27",
  images: {
    o_smug: "characters/cutouts/otto_smug.webp", o_hopeful: "characters/cutouts/otto_hopeful.webp", o_worried: "characters/cutouts/otto_worried.webp",
    o_confused: "characters/cutouts/otto_confused.webp", o_angry: "characters/cutouts/otto_angry.webp", o_shocked: "characters/cutouts/otto_shocked.webp",
    o_side: "characters/cutouts/otto_side-eye.webp", o_defeated: "characters/cutouts/otto_defeated.webp", o_panic: "characters/cutouts/otto_panic.webp",
    r_smug: "characters/cutouts/renda_smug.webp", r_evil: "characters/cutouts/renda_evil-grin.webp", r_sad: "characters/cutouts/renda_fake-sad.webp",
    r_laugh: "characters/cutouts/renda_laughing.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 116, root: 53, seed: 41, prog: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]] });
  const DUR = 15.0;
  const S = E.scene("flat", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const keyed = (keys, t) => {                                      // the engine's keyframe sampling, for values I compute myself
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [tb, vb, eb] = keys[i];
      if (t < tb) { const [ta, va] = keys[i - 1]; const u = Math.min(1, Math.max(0, (t - ta) / (tb - ta))); return va + (vb - va) * E.EASE[eb || "lin"](u); }
    }
    return keys[keys.length - 1][1];
  };

  const stage = E.el(S.el, "abs", "inset:0;transform-origin:320px 1150px");
  // ---- the room (left of the partition) and the corridor (right of it) ----
  E.el(stage, "abs", "left:0;top:548px;width:1080px;height:1012px;background:#cfd8dc");                                   // corridor
  E.el(stage, "abs", "left:0;top:1560px;width:1080px;height:360px;background:#b58a58");                                   // floor
  const room = E.el(stage, "abs", "left:0;top:548px;width:700px;height:1012px;background-color:#f1e6c9;background-image:repeating-linear-gradient(90deg,rgba(150,120,60,.10) 0 4px,transparent 4px 70px);overflow:hidden");
  E.el(stage, "abs", "left:0;top:532px;width:1080px;height:16px;background:#8a6f2c");
  const win = E.el(stage, "abs", "left:130px;top:620px;width:210px;height:240px;border:14px solid #7a5a2b;background:linear-gradient(180deg,#bfe3f5,#e8f5fb);border-radius:10px");
  E.el(win, "abs", "left:88px;top:0;width:10px;height:100%;background:#7a5a2b");
  E.el(win, "abs", "left:0;top:108px;width:100%;height:10px;background:#7a5a2b");
  E.el(stage, "abs", "left:466px;top:548px;width:6px;height:150px;background:#5b4636");
  E.el(stage, "abs", "left:436px;top:690px;width:66px;height:66px;border-radius:50%;background:#ffd95a;box-shadow:0 0 40px 12px rgba(255,217,90,.55)");
  const part = E.el(stage, "abs", "left:700px;top:548px;width:46px;height:1012px;background:linear-gradient(90deg,#4b382b,#6b5140);box-shadow:-10px 0 24px rgba(0,0,0,.25)");
  const Px = [[0, 700], [4.7, 700], [5.8, 640, "io"], [8.0, 640], [9.8, 545, "in"], [12.3, 545], [12.62, 330, "in"], [DUR, 330]];
  const ring = (css, t) => { const r = E.el(stage, "abs", `${css};border:8px solid ${C.amberD};border-radius:16px;opacity:0`); E.K(r, "o", [[t, 0], [t + .06, 1], [t + .5, 0, "in"]]); };
  // camera pulses on every tag, and the punch-in on the freeze / the squash
  const tags = [[2.5, "WINDOW +€150", 150], [3.6, "FLOOR +€100", 100], [4.7, "DOOR +€200", 200], [5.8, "LIGHT +€120", 120],
    [8.0, "AIR +€90", 90], [8.5, "SILENCE +€80", 80], [9.0, "SHADOW +€60", 60], [9.5, "VIEW OF WALL +€150", 150]];
  const zoom = [[0, 1]];
  for (const [t] of tags) zoom.push([t - .01, 1], [t, 1.035], [t + .18, 1, "out"]);
  zoom.push([6.59, 1], [6.6, 1], [6.72, 1.24, "out"], [7.9, 1.24], [8.0, 1, "io"]);
  zoom.push([12.29, 1], [12.3, 1], [12.42, 1.16, "out"], [DUR, 1.16]);
  zoom.sort((a, b) => a[0] - b[0]);
  E.K(stage, "s", zoom);

  // ---- Renda in the corridor, Otto in the room ----
  const RW = E.el(stage, "abs", "left:575px;top:880px;width:600px;height:880px");
  const RI = E.el(RW, "abs", "inset:0");
  const RN = ["r_smug", "r_evil", "r_sad", "r_laugh"];
  const rfaces = RN.map(n => E.img(RI, n, "position:absolute;left:0;top:0;width:600px;height:880px;object-fit:contain"));
  const rendaFace = [[0, "r_smug"], [2.5, "r_evil"], [6.6, "r_sad"], [8.0, "r_smug"], [10.4, "r_evil"], [12.4, "r_laugh"]];
  E.el(stage, "abs", "left:30px;top:1830px;width:540px;height:46px;border-radius:50%;background:rgba(60,40,20,.2);filter:blur(7px)");
  const OW = E.el(stage, "abs", "left:20px;top:900px;width:570px;height:860px");
  const OI = E.el(OW, "abs", "inset:0;transform-origin:0% 100%");
  const OTTO = ["o_smug", "o_hopeful", "o_worried", "o_confused", "o_angry", "o_shocked", "o_side", "o_defeated", "o_panic"];
  const ofaces = OTTO.map(n => E.img(OI, n, "position:absolute;left:0;top:0;width:570px;height:860px;object-fit:contain"));
  const ottoFace = [[0, "o_smug"], [2.4, "o_hopeful"], [3.6, "o_worried"], [4.7, "o_confused"], [5.8, "o_angry"], [6.6, "o_shocked"], [8.0, "o_side"], [9.6, "o_defeated"], [12.3, "o_panic"], [13.2, "o_defeated"]];
  E.K(OW, "x", [[0, -760], [.55, 0, "back"]]);
  E.S(.05, "whoosh", .8); E.S(.5, "thud", .7);
  E.F(t => {
    const px = keyed(Px, t); part.style.left = px + "px"; room.style.width = px + "px";
    const f = at(ottoFace, t); ofaces.forEach((im, i) => { im.style.opacity = OTTO[i] === f ? 1 : 0; });
    const rf = at(rendaFace, t); rfaces.forEach((im, i) => { im.style.opacity = RN[i] === rf ? 1 : 0; });
    const sx = Math.max(.5, Math.min(1, (px - 30) / 560));                     // the wall pushes Otto flat
    let y = Math.sin(t * 3.4) * 4, r = 0;
    if (t >= 6.6 && t < 7.9) r += Math.sin(t * 70) * 1.5;
    if (t >= 12.6 && t < 13.5) r += Math.sin(t * 60) * 1.4;
    OI.style.transform = `translateY(${y}px) rotate(${r}deg) scale(${sx},${1 + (1 - sx) * .18})`;
    RI.style.transform = `translateY(${Math.sin(t * 2.6) * 4}px)`;
  });

  // ---- the rent counter and the price tags ----
  const TOP = "left:100px;top:250px;width:780px;display:flex;flex-direction:column;gap:20px";
  const hookBox = E.el(S.el, "abs", "left:100px;top:262px;width:800px");
  const hook = E.text(hookBox, "Rent a flat? *$Easy.*", { size: 84, lh: 1.02, instant: true, id: "hook", nowrap: true });
  E.until(hook, 2.3);
  const rentBox = E.el(S.el, "abs", "left:100px;top:262px;width:780px");
  const rent = E.el(rentBox, "tx", `font-size:150px;line-height:1;font-weight:900;letter-spacing:-.04em;color:${C.ink}`, "€600");
  E.el(rentBox, "tx", `font-size:38px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:${C.mute};margin-top:6px`, "per month");
  E.K(rentBox, "o", [[2.4, 0], [2.48, 1], [6.55, 1], [6.62, 0], [7.9, 0], [8.0, 1], [DUR, 1]]);   // hidden while "…wait." owns the top of the screen
  const val = t => { let v = 600; for (const [t0, , a] of tags) v += a * E.EASE.out(Math.min(1, Math.max(0, (t - t0) / .32))); return Math.round(v); };
  E.F(t => { const v = val(t); rent.textContent = "€" + E.std.money(v); rent.style.color = v > 1300 ? C.coralD : v > 900 ? C.amberD : C.ink; });
  const stampBox = () => E.el(S.el, "abs", "left:70px;top:1250px;width:940px;display:flex;justify-content:center");
  const tagEl = (str, t, tOut, size = 62) => {
    const e = E.el(stampBox(), "", `display:inline-block;background:${C.amber};color:${C.ink};font-weight:900;font-size:${size}px;line-height:1.02;letter-spacing:-.03em;padding:.16em .3em .2em;border-radius:.24em;text-align:center`, str);
    E.K(e, "s", [[t, 1.6], [t + .16, 1, "back"]]); E.K(e, "r", [[t, -10], [t + .18, -4, "out"]]); E.K(e, "o", [[t, 0], [t + .05, 1]]);
    E.S(t + .1, "thud", .8); E.S(t + .12, "tick", .9); E.shake(t + .1, 8, .2); E.until(e, tOut, .12); return e;
  };
  tags.forEach(([t, s], i) => tagEl(s, t, i + 1 < tags.length ? tags[i + 1][0] : 10.4, s.length > 14 ? 54 : 62));
  ring("left:120px;top:610px;width:240px;height:262px", 2.5);           // the window
  ring("left:0;top:1552px;width:660px;height:24px;border-radius:6px", 3.6);   // the floor
  ring("left:686px;top:540px;width:74px;height:1030px", 4.7);           // the door (the partition)
  ring("left:420px;top:676px;width:98px;height:98px;border-radius:50%", 5.8);  // the light
  [8.0, 8.5, 9.0, 9.5].forEach(t => E.flash(t, "#f3b072", .22, .2));
  E.S(6.6, "scratch");
  E.S(8.0, "riser", .5);
  const waitBox = E.el(S.el, "abs", TOP);
  const wait = E.text(waitBox, "*!…wait.*", { size: 110, t: 6.7, id: "wait", stagger: .1 });
  E.until(wait, 7.95);
  // "SIGN HERE" and the twist
  const sign = E.el(stampBox(), "", `display:inline-block;background:${C.mint};color:${C.ink};font-weight:900;font-size:78px;line-height:1.02;letter-spacing:-.03em;padding:.16em .3em .2em;border-radius:.24em`, "SIGN HERE");
  E.K(sign, "s", [[10.5, 1.6], [10.66, 1, "back"]]); E.K(sign, "r", [[10.5, 8], [10.7, 3, "out"]]); E.K(sign, "o", [[10.5, 0], [10.55, 1]]); E.S(10.6, "thud"); E.shake(10.6, 10, .2); E.until(sign, 12.25, .1);
  const dep = E.stamp(stampBox(), "DEPOSIT: 6 MONTHS", 12.3, { size: 70, rot: -6, shake: 22 });
  E.S(12.5, "slam"); E.S(12.62, "nope"); E.flash(12.62, "#ff7d63", .35, .25); E.shake(12.62, 18, .35);

  E.finish(DUR);
  E.K(E.logo, "s", [[13.7, 1], [13.95, 1.18, "out"], [14.3, 1, "io"]]);
}
