// EP.85 "The Christmas gift that never dies" — Otto's boss: "Merry Christmas, Otto! Something special for you." A bottle of Port in a
// fancy box. Otto: "Oh wow… thank you!" then, whispering: "…Regift." The box travels: the neighbour, the barber, the priest, the landlord,
// the lady next door, grandma — and the gift tag grows a list of crossed-out names. Christmas 2026, grandma: "Filho! I got you something
// special!" Otto: "Wait. This box looks familiar." Inside: an empty bottle and a note — "Sorry. Long winter. — Manel". "…I'll regift it."
export const meta = {
  id: "ep85-regift", date: "2026-12-17",
  images: {
    boss: "characters/cutouts/boss_gift.webp", og: "characters/cutouts/otto-xmas_gift.webp", oe: "characters/cutouts/otto-xmas_empty.webp", dg: "characters/cutouts/dona_gift.webp",
    manel: "characters/cutouts/manel_smug.webp", barber: "characters/cutouts/barber_talk.webp", priest: "characters/cutouts/priest_bless.webp", lady: "characters/cutouts/lady_ask.webp",
    old: "characters/cutouts/oldman_ask.webp", dk: "characters/cutouts/dona_knowing.webp", box: "characters/props/giftbox.webp", xmas: "characters/scenes/bg_xmas.webp", street: "characters/scenes/bg_night.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 55, seed: 851, prog: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]] });
  const DUR = 20.6, MERRY = .3, THX = 3.5, REG = 5.85, CHAIN = 6.7, HOME = 11.0, SPEC = 11.2, FAM = 13.95, OPEN = 16.6, AGAIN = 18.3;
  const S = E.scene("regift", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); show(el, [[t0, t1]]); return el; };
  const fig = (P, n, w, h, s, left, bottom, z = 3) => { const el = E.el(P, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  // ================= 1) the office party =================
  const A = layer(0, CHAIN);
  E.el(A, "abs", "inset:0;background:#e7eef3");
  E.el(A, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:repeating-linear-gradient(90deg,rgba(80,110,140,.06) 0 90px,transparent 90px 180px)");
  E.el(A, "abs", "left:0;top:1640px;width:1080px;height:300px;background:#8a9aa8");
  E.el(A, "abs", "left:620px;top:440px;width:380px;height:300px;background:#bfe3f7;border:14px solid #fff;box-sizing:border-box;box-shadow:inset 0 0 0 4px #cfd8df");
  for (let i = 0; i < 14; i++) E.el(A, "abs", `left:${30 + i * 76}px;top:${480 + (i % 2) * 20}px;width:26px;height:26px;border-radius:50%;background:${["#e5484d", "#f2c230", "#2fae6b", "#2f6db5"][i % 4]}`);
  E.el(A, "abs", "left:0;top:490px;width:1080px;height:3px;background:#1d2430");
  const bossF = fig(A, "boss", 560, 977, .95, 250, 1780, 3); E.K(bossF, "x", [[THX - .3, 0], [THX, -1100, "in"]]);
  const og1 = fig(A, "og", 374, 982, .95, 380, 1780, 4); E.K(og1, "x", [[THX - .3, 700], [THX, 0, "out"]]);
  const ob = []; for (let t = 0; t < CHAIN; t += .7) ob.push([t, 0, "io"], [t + .35, -6, "io"]); E.K(og1, "y", ob);           // frame-0 motion
  const wink = E.el(A, "abs", "left:720px;top:900px;font-size:90px;opacity:0;z-index:6", "😉"); show(wink, [[REG, CHAIN]]);

  // ================= 2) the box travels =================
  const B = layer(CHAIN, HOME);
  E.img(B, "street", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  E.el(B, "abs", "inset:0;background:rgba(10,20,50,.35)");
  const snow = [...Array(24)].map((_, i) => E.el(B, "abs", `left:${(i * 89) % 1080}px;top:0;width:${7 + (i % 3) * 3}px;height:${7 + (i % 3) * 3}px;border-radius:50%;background:rgba(255,255,255,.85)`));
  E.F(t => snow.forEach((f, i) => { const u = (t * (.1 + (i % 4) * .03) + i * .21) % 1; f.style.transform = `translate(${Math.sin(t * 2 + i) * 18}px,${u * 1900}px)`; }));
  // a conveyor of people, each holding the box for a moment
  const CH = [["manel", 386, 978, .72], ["barber", 420, 1044, .68], ["priest", 412, 1028, .7], ["old", 480, 1037, .68], ["lady", 546, 1031, .68], ["dg", 550, 961, .72]];
  const GAP = .7, strip = E.el(B, "abs", "left:0;top:0;width:1px;height:1px");
  CH.forEach(([n, w, h, s], i) => fig(strip, n, w, h, s, 700 + i * 520, 1880, 3));
  E.F(t => { const u = Math.max(0, t - CHAIN - .3); const k = Math.min(CH.length - 1, u / GAP); strip.style.transform = `translateX(${-k * 520 - 380}px)`; });
  const box = E.el(B, "abs", "left:470px;top:1120px;width:140px;height:276px;z-index:5"); E.img(box, "box", "width:140px;height:276px");
  const hop = []; for (let i = 0; i < CH.length; i++) { const t = CHAIN + .3 + i * GAP; hop.push([t, 0, "in"], [t + .2, -120, "out"], [t + .4, 0, "in"]); } E.K(box, "y", hop);
  E.K(box, "r", hop.map(([t, v, e]) => [t, v / 10, e]));
  // the gift tag, growing
  const NAMES = ["To: Otto", "To: Manel", "To: Sr. Luís", "To: Padre João", "To: Sr. Vicente", "To: Dona Rosa", "To: Avó"];
  const tag = E.el(S.el, "abs", "left:590px;top:560px;width:420px;background:#fffdf3;border:5px solid #b3262c;border-radius:14px;padding:18px 24px;box-sizing:border-box;z-index:9;transform:rotate(4deg);font-family:'Comic Sans MS',cursive;font-weight:700;font-size:40px;line-height:1.25;color:#1d2b36;opacity:0;box-shadow:0 12px 26px rgba(0,0,0,.3)");
  const lines = NAMES.map((n, i) => E.el(tag, "", "position:relative;white-space:nowrap", n));
  E.F(t => {
    const k = t < CHAIN ? 0 : Math.min(NAMES.length - 1, Math.floor((t - CHAIN - .3) / GAP) + 1);
    tag.style.opacity = t >= CHAIN && t < HOME ? 1 : t >= FAM && t < OPEN ? 1 : 0; tag.style.left = t >= FAM ? "70px" : "590px"; tag.style.top = t >= FAM ? "440px" : "560px";
    lines.forEach((l, i) => { l.style.display = i <= k || t >= FAM ? "block" : "none"; l.style.textDecoration = (i < k || t >= FAM && i < NAMES.length - 1) ? "line-through 5px #b3262c" : "none"; l.style.opacity = (i < k || (t >= FAM && i < NAMES.length - 1)) ? .55 : 1; });
  });
  const hilite = E.el(tag, "abs", "left:10px;top:12px;width:230px;height:58px;border:6px solid #f2c230;border-radius:30px;opacity:0");
  E.K(hilite, "o", [[FAM + .9, 0], [FAM + 1, 1]]); E.K(hilite, "s", [[FAM + .9, 1.5], [FAM + 1.2, 1, "out"]]);

  // ================= 3) Christmas 2026 at grandma's =================
  const Cc = layer(HOME, DUR);
  E.img(Cc, "xmas", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  const dg = fig(Cc, "dg", 550, 961, .9, 20, 1900, 3), dk = fig(Cc, "dk", 665, 1014, .85, 0, 1900, 3);
  show(dg, [[HOME, FAM]]); show(dk, [[FAM, DUR]]);
  const o2 = fig(Cc, "og", 374, 982, .9, 640, 1900, 3), o3 = fig(Cc, "oe", 468, 981, .9, 600, 1900, 3);
  show(o2, [[FAM - .3, OPEN]]); E.K(o2, "x", [[FAM - .3, 300], [FAM, 0, "out"]]); show(o3, [[OPEN, DUR]]);
  const note = E.el(Cc, "abs", "left:300px;top:1000px;width:500px;padding:24px 28px;background:#fffdf3;border:5px solid #1d2b36;border-radius:12px;transform:rotate(-4deg);font-family:'Comic Sans MS',cursive;font-weight:700;font-size:48px;line-height:1.2;color:#1d2b36;text-align:center;z-index:8;opacity:0;box-shadow:0 12px 26px rgba(0,0,0,.3)", "Sorry. Long winter.<br>— Manel 🍷");
  E.pop(note, OPEN + .2, { from: .3, dur: .35 }); E.K(note, "o", [[OPEN + .2, 0], [OPEN + .28, 1], [AGAIN - .1, 1], [AGAIN + .1, 0]]);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "OFFICE PARTY · DEC 2025"], [CHAIN, "REGIFTED ×1"], ...CH.slice(1).map((_, i) => [CHAIN + .3 + (i + 1) * GAP, `REGIFTED ×${i + 2}`]), [HOME, "CHRISTMAS 2026"], [OPEN, "CONTENTS: 0 ML"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = s.startsWith("REGIFTED") || t >= OPEN ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Merry Christmas, Otto! Something special for you.", 300, 700, 620, 220, MERRY, THX - .05, 44);
  bubble("Oh wow… thank you!", 300, 740, 480, 200, THX, REG - .05, 48);
  bubble("…Regift.", 620, 800, 300, 60, REG, CHAIN, 52);
  bubble("Filho! I got you something special!", 40, 860, 560, 200, SPEC, FAM - .05, 46);
  bubble("Wait. This box looks familiar.", 440, 930, 600, 360, FAM, OPEN - .05, 44);
  bubble("…I'll regift it.", 520, 880, 420, 260, AGAIN, DUR - .4, 52);
  const sb = E.el(S.el, "abs", "left:60px;top:540px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "REGIFT #8.", AGAIN + 1.0, { size: 120, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/office.wav", { vol: .5, duck: false, to: CHAIN });
  E.clip(MERRY, "voices/ep85/b_merry.wav", { vol: 1.25 });
  E.clip(THX, "voices/ep85/o_thanks.wav", { vol: 1.2 });
  E.clip(REG, "voices/ep85/o_regift.wav", { vol: 2.6 }); E.S(REG + .1, "ding", .4);
  E.S(CHAIN, "whoosh", .6); CH.forEach((_, i) => E.S(CHAIN + .5 + i * GAP, "pop", .5 + i * .05));
  E.S(HOME, "whoosh", .6); E.clip(HOME, "sfx/crowd-murmur.wav", { vol: .3, duck: false, to: DUR - HOME });
  E.clip(SPEC, "voices/ep85/g_special.wav", { vol: 1.3 });
  E.clip(FAM, "voices/ep85/o_familiar.wav", { vol: 1.2 }); E.S(FAM + .9, "scratch", .5);
  E.clip(OPEN, "sfx/plastic-rip.wav", { vol: .7 }); E.S(OPEN + .3, "thud", .4);
  E.clip(AGAIN, "voices/ep85/o_again.wav", { vol: 1.25 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "The gift that never *dies*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[19.8, 1], [20.05, 1.18, "out"], [20.4, 1, "io"]]);
}
