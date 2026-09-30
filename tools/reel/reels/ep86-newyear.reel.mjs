// EP.86 "New Year's Eve with a Portuguese grandma" — 23:55. Grandma reads the rules off a scroll that reaches the floor: "Twelve raisins!
// Twelve wishes! One for every bell!" Otto: "Twelve raisins?" "And stand on the chair!" "Blue underwear! Money in the pocket! Bang the
// pot!" The checklist fills. Otto, on the chair, briefs over his jeans: "Três… dois… um…" MIDNIGHT — twelve bells, twelve raisins, cheeks
// full: "Mmmf!" "Feliz Ano Novo!" — the chair collapses. Grandma, worried: "…Did you land on the RIGHT foot?" His left foot is in the air.
export const meta = {
  id: "ep86-newyear", date: "2026-12-18",
  images: {
    bg: "characters/scenes/bg_nye.webp", gs: "characters/cutouts/dona_scroll.webp", or: "characters/cutouts/otto-nye_raisins.webp", oc: "characters/cutouts/otto-nye_chair.webp",
    of: "characters/cutouts/otto-nye_fall.webp", rai: "characters/props/raisins.webp", pot: "characters/props/pot-spoon.webp", bri: "characters/props/blue-briefs.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 120, root: 57, seed: 861, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 21.4, RULES = .3, TWELVE = 3.5, CHAIR = 4.8, UNDER = 6.2, READY = 9.2, COUNT = 9.3, MID = 12.0, MMF = 12.9, FELIZ = 14.4,
    CRASH = 15.0, RIGHT = 16.6;
  const S = E.scene("nye", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const fig = (n, w, h, s, left, bottom, z = 3) => { const el = E.el(S.el, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  E.img(S.el, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  // fireworks burst in the window at midnight
  const COLS = ["#ff4d4d", "#ffd23f", "#4dd2ff", "#7dff6a", "#ff8ae2"];
  [[260, 700, MID], [420, 620, MID + .4], [180, 560, MID + .9], [380, 760, MID + 1.5], [300, 640, MID + 2.2]].forEach(([x, y, t], i) => {
    const b = E.el(S.el, "abs", `left:${x - 140}px;top:${y - 140}px;width:280px;height:280px;border-radius:50%;z-index:1;opacity:0;background:repeating-conic-gradient(${COLS[i % 5]} 0 6deg,transparent 6deg 18deg);-webkit-mask:radial-gradient(circle,transparent 25%,#000 27%,#000 58%,transparent 60%);mask:radial-gradient(circle,transparent 25%,#000 27%,#000 58%,transparent 60%)`);
    E.K(b, "o", [[t, 0], [t + .05, 1], [t + .9, 0]]); E.K(b, "s", [[t, .2], [t + .9, 1.3, "out"]]);
  });
  const flash = E.el(S.el, "abs", "inset:0;background:#fff;z-index:9;opacity:0"); E.K(flash, "o", [[MID - .01, 0], [MID, .5], [MID + .2, 0]]);

  // grandma with the endless scroll (left)
  const g = fig("gs", 612, 1007, .82, 0, 1900, 3);
  const gb = []; for (let t = 0; t < DUR; t += .8) gb.push([t, 0, "io"], [t + .4, -5, "io"]); E.K(g, "y", gb);                  // frame-0 motion
  E.K(g, "r", [[RIGHT - .2, 0], [RIGHT + .2, -4, "out"]]);
  // Otto (right): raisins → on the chair with everything → on the floor
  const o1 = fig("or", 386, 976, .82, 640, 1900), o2 = fig("oc", 624, 1017, .82, 560, 1900), o3 = fig("of", 965, 629, .8, 300, 1920, 4);
  show(o1, [[0, READY]]); show(o2, [[READY, CRASH]]); show(o3, [[CRASH, DUR]]);
  const wob = []; for (let t = READY; t < CRASH; t += .25) wob.push([t, -3, "io"], [t + .125, 3, "io"]); E.K(o2, "r", wob);
  E.K(o2, "y", [[MID, 0], [MID + .1, -30, "out"], [MID + .25, 0, "in"], [MID + 1.2, 0], [MID + 1.3, -24, "out"], [MID + 1.45, 0, "in"]]);
  E.K(o3, "y", [[CRASH, -200], [CRASH + .25, 0, "in"]]);
  const foot = E.el(S.el, "abs", "left:780px;top:1110px;background:#e5484d;color:#fff;font-weight:900;font-size:34px;padding:6px 14px;border-radius:12px;z-index:8;opacity:0;transform:rotate(8deg)", "LEFT ↑");
  show(foot, [[RIGHT + 1.2, DUR]]); E.K(foot, "s", [[RIGHT + 1.2, .3], [RIGHT + 1.5, 1, "back"]]);

  // the checklist (top right)
  const card = E.el(S.el, "abs", "left:590px;top:460px;width:450px;background:#fffdf3;border:6px solid #1d2b36;border-radius:18px;padding:14px 20px;box-sizing:border-box;z-index:7;box-shadow:0 12px 26px rgba(0,0,0,.25)");
  E.el(card, "", "font-weight:900;font-size:30px;letter-spacing:.08em;color:#b3262c;margin-bottom:6px", "MIDNIGHT RULES");
  const ITEMS = [["12 raisins", RULES + .4], ["12 wishes", RULES + 1.3], ["Stand on a chair", CHAIR], ["Blue underwear", UNDER], ["Money in pocket", UNDER + 1.0], ["Bang a pot", UNDER + 1.9], ["Right foot first!", RIGHT]];
  ITEMS.forEach(([txt, t]) => {
    const r = E.el(card, "", "display:flex;align-items:center;gap:12px;font-weight:800;font-size:34px;color:#1d2b36;line-height:1.35;opacity:0", "");
    const box = E.el(r, "", "width:30px;height:30px;border:4px solid #1d2b36;border-radius:6px;flex:none;display:flex;align-items:center;justify-content:center;font-size:26px;color:#1f7a3a", "");
    E.el(r, "", "", txt);
    E.K(r, "o", [[t - .01, 0], [t, 1]]); E.K(r, "s", [[t, 1.3], [t + .2, 1, "out"]]);
    E.F(tt => { const s = tt >= READY && t < RIGHT ? "✔" : tt >= RIGHT + .8 && t === RIGHT ? "✘" : ""; if (box.textContent !== s) box.textContent = s; box.style.color = s === "✘" ? "#d6333a" : "#1f7a3a"; });
  });
  show(card, [[RULES + .3, MID]]);

  // the clock + raisin counter
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const BELL = [...Array(12)].map((_, i) => MID + i * .2);
  E.F(t => {
    let s;
    if (t < READY) s = "23:55 · DEC 31";
    else if (t < MID) s = `23:59:${String(Math.min(59, 57 + Math.floor((t - COUNT) / .9))).padStart(2, "0")}`;
    else if (t < BELL[11] + .3) s = `🔔 RAISINS: ${Math.min(12, 1 + Math.floor((t - MID) / .2))}/12`;
    else s = "00:00 · 2027";
    if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= MID ? C.coralD : C.ink;
  });

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  const G = (h, t0, t1, fs = 44, w = 520) => bubble(h, 30, 900, w, 200, t0, t1, fs);
  G("Twelve raisins! Twelve wishes! One for every bell!", RULES, TWELVE - .05, 42, 540);
  bubble("Twelve raisins?", 600, 980, 400, 220, TWELVE, CHAIR - .05, 50);
  G("And stand on the chair!", CHAIR, UNDER - .05, 48, 460);
  G("Blue underwear! Money in the pocket! Bang the pot!", UNDER, READY, 42, 560);
  G(`Três… dois… um…${sub("(Three… two… one…)")}`, COUNT, MID - .05, 50, 460);
  bubble("Mmmf! Mmm-mmmf!", 600, 900, 420, 180, MMF, FELIZ, 50);
  G(`Feliz Ano Novo!${sub("(Happy New Year!)")}`, FELIZ, RIGHT - .05, 52, 440);
  G("…Did you land on the RIGHT foot?", RIGHT, DUR - .4, 46, 520);
  const sb = E.el(S.el, "abs", "left:60px;top:500px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "2027: CANCELLED.", RIGHT + 2.6, { size: 100, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(RULES, "voices/ep86/g_raisins.wav", { vol: 1.3 });
  E.clip(TWELVE, "voices/ep86/o_raisins.wav", { vol: 1.2 });
  E.clip(CHAIR, "voices/ep86/g_chair.wav", { vol: 1.3 });
  E.clip(UNDER, "voices/ep86/g_under.wav", { vol: 1.3 });
  E.S(READY, "poof", .5); E.clip(COUNT, "voices/ep86/g_count.wav", { vol: 1.3 });
  BELL.forEach((t, i) => E.S(t, "ding", .55 + (i % 2) * .1));
  E.clip(MID + .1, "sfx/applause-cheer.wav", { vol: .5, duck: false, to: 3 }); [MID, MID + .4, MID + .9, MID + 1.5].forEach(t => E.S(t, "crack", .6));
  E.clip(MMF, "voices/ep86/o_mmf.wav", { vol: 1.2 });
  E.clip(FELIZ, "voices/ep86/g_feliz.wav", { vol: 1.35 });
  E.S(CRASH - .05, "creak", .7); E.clip(CRASH + .15, "sfx/car-door-fall.wav", { vol: .9 }); E.S(CRASH + .2, "thud", .9);
  E.clip(RIGHT, "voices/ep86/g_right.wav", { vol: 1.35 }); E.S(RIGHT + 2.6, "scratch", .5);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "New Year's Eve with *grandma*", { size: 52, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[20.6, 1], [20.85, 1.18, "out"], [21.2, 1, "io"]]);
}
