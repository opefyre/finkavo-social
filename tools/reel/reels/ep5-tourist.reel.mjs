// EP.5 "Tourist vs Resident" — split screen, the same five moments lived two ways. Top: Buck the tourist, everything is easy and joyful.
// Bottom: Otto the resident, the same moment gets slower and slower (he ages, a paper stack grows, the number board moves without him).
// Ends on the clerk's stamp. Stands alone for strangers; no series numbering, no "follow" line. Exaggerated on purpose (the caption says so).
export const meta = {
  id: "ep5-tourist", date: "2026-09-28",
  images: {
    b: "characters/cutouts/buck_default.webp",
    o_worried: "characters/cutouts/otto_worried.webp", o_sleepy: "characters/cutouts/otto_sleepy.webp",
    o_stubble: "characters/cutouts/otto_stubble.webp", o_ancient: "characters/cutouts/otto_ancient.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 55, seed: 51, prog: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]] });
  const DUR = 14.6;
  const S = E.scene("split", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const T = [0, 2.7, 5.4, 8.1, 10.9, DUR];

  // ---------- the two panels ----------
  const top = E.el(S.el, "abs", "left:0;top:0;width:1080px;height:952px;overflow:hidden;background:#ffd27a");
  const bot = E.el(S.el, "abs", "left:0;top:968px;width:1080px;height:952px;overflow:hidden;background:#c9d0d8");
  E.el(S.el, "abs", "left:0;top:952px;width:1080px;height:16px;background:#12305a");
  const topBg = ["#ffd27a", "#ffe6a8", "#bfe4ff", "#d4ecd6", "#a9d8ff"];
  const botBg = ["#c9d0d8", "#bcc4cd", "#adb6c0", "#9aa4b0", "#8b95a2"];
  E.F(t => {
    let i = 0; T.forEach((k, j) => { if (t >= k && j < 5) i = j; });
    top.style.background = topBg[i]; bot.style.background = botBg[i];
  });

  // ---------- the characters ----------
  const BW = E.el(S.el, "abs", "left:520px;top:250px;width:560px;height:720px");
  const BI = E.el(BW, "abs", "inset:0;transform-origin:50% 100%");
  E.img(BI, "b", "position:absolute;left:0;top:0;width:560px;height:720px;object-fit:contain");
  E.K(BW, "x", [[0, 0], [T[4], 0], [T[4] + .3, 40], [DUR, 40]]);
  E.F(t => {
    const hop = Math.max(0, Math.sin(t * 7)) * (t < T[4] ? 26 : 8);
    BI.style.transform = `translateY(${-hop}px) rotate(${Math.sin(t * 3.5) * 2.4}deg)`;
  });
  const OW = E.el(S.el, "abs", "left:520px;top:1190px;width:520px;height:730px");
  const OI = E.el(OW, "abs", "inset:0;transform-origin:50% 100%");
  const OTTO = ["o_worried", "o_sleepy", "o_stubble", "o_ancient"];
  const ofaces = OTTO.map(n => E.img(OI, n, "position:absolute;left:0;top:0;width:520px;height:730px;object-fit:contain"));
  const ottoFace = [[0, "o_worried"], [T[1], "o_sleepy"], [T[2], "o_stubble"], [T[3], "o_ancient"]];
  E.F(t => {
    const f = at(ottoFace, t);
    ofaces.forEach((im, i) => { im.style.opacity = OTTO[i] === f ? 1 : 0; });
    let y = Math.sin(t * 2.2) * 3, r = 0;
    if (t >= T[4]) r = Math.sin(t * 2) * 1.2;
    OI.style.transform = `translateY(${y}px) rotate(${r}deg)`;
  });

  // ---------- labels (static: the split is the whole premise) ----------
  const pill = (parent, str, bg, y) => E.el(parent, "", `position:absolute;left:100px;top:${y}px;background:${bg};color:${C.ink};font-weight:900;font-size:50px;letter-spacing:.08em;padding:.12em .42em .16em;border-radius:.32em`, str);
  pill(S.el, "TOURIST", "#7fe0c0", 232);
  pill(S.el, "RESIDENT", "#ff7d63", 1012);

  // ---------- per row: caption (left column) and a drawn prop under it ----------
  const capT = ["Sunset at the beach", "Coffee: €1", "SIM card: 2 minutes", "Review: 10/10", "Flies home happy"];
  const capB = ["Sunset at the AIMA office", "Coffee, waiting for a stamp", "SIM card: 6 months", "Now serving 4472", ""];
  const cap = (str, t0, t1, y, id) => {
    if (!str) return;
    const box = E.el(S.el, "abs", `left:100px;top:${y}px;width:430px`);
    const tx = E.text(box, str, { size: 60, lh: 1.04, t: t0, id, instant: t0 === 0, stagger: .05 });
    E.until(tx, t1, .1);
  };
  capT.forEach((s, i) => cap(s, T[i], T[i + 1], 318, i ? "" : "hook"));
  capB.forEach((s, i) => cap(s, T[i], T[i + 1], 1100, ""));

  const show = (el, t0, t1) => { E.K(el, "o", [[t0, t0 === 0 ? 1 : 0], [t0 + .06, 1], [t1 - .08, 1], [t1, t1 >= DUR ? 1 : 0]]); E.K(el, "s", [[t0, t0 === 0 ? 1 : .6], [t0 + .28, 1, "back"]]); };
  const P = (css, html = "") => E.el(S.el, "abs", css, html);

  // tourist props (y ~ 640-930)
  const sun = P("left:115px;top:700px;width:300px;height:230px;overflow:hidden");
  E.el(sun, "abs", "left:60px;top:20px;width:180px;height:180px;border-radius:50%;background:#ff9a1a;box-shadow:0 0 60px #ffcf5a");
  E.el(sun, "abs", "left:0;top:150px;width:300px;height:100px;background:#2f9bd6;border-radius:40px 40px 0 0");
  E.el(sun, "abs", "left:0;top:150px;width:300px;height:14px;background:#8fd6f5");
  show(sun, T[0], T[1]);
  const cupT = P("left:125px;top:690px;width:300px;height:240px");
  E.el(cupT, "abs", "left:40px;top:60px;width:170px;height:150px;border-radius:0 0 60px 60px;background:#fff;border:10px solid #6b3f1d;border-top-width:14px");
  E.el(cupT, "abs", "left:200px;top:90px;width:60px;height:70px;border:10px solid #6b3f1d;border-radius:0 40px 40px 0");
  E.el(cupT, "abs", "left:52px;top:78px;width:146px;height:34px;background:#6b3f1d;border-radius:0 0 40px 40px");
  E.el(cupT, "abs", `left:20px;top:0;width:120px;height:46px;border-radius:12px;background:${C.amber};color:${C.ink};font-weight:900;font-size:36px;display:flex;align-items:center;justify-content:center`, "€1");
  show(cupT, T[1], T[2]);
  const phone = P("left:135px;top:660px;width:200px;height:280px;border-radius:28px;background:#12202a;border:10px solid #33465a");
  E.el(phone, "abs", `left:10px;top:70px;width:160px;height:120px;border-radius:14px;background:#7fe0c0;color:${C.ink};font-weight:900;font-size:64px;display:flex;align-items:center;justify-content:center`, "✓");
  show(phone, T[2], T[3]);
  const stars = P("left:105px;top:700px;width:450px;height:120px;font-weight:900;font-size:84px;color:#ffb300;letter-spacing:.02em;white-space:nowrap", "★★★★★");
  show(stars, T[3], T[4]);
  const plane = P("left:-500px;top:520px;width:420px;height:190px");
  E.el(plane, "abs", "left:20px;top:70px;width:380px;height:56px;border-radius:30px 90px 90px 30px;background:#fff;box-shadow:0 6px 0 #c9d6e0");
  E.el(plane, "abs", "left:130px;top:96px;width:150px;height:22px;background:#c9d6e0;border-radius:10px;transform:skewX(-40deg);top:110px");
  E.el(plane, "abs", "left:120px;top:20px;width:200px;height:28px;border-radius:12px;background:#dde7ee;transform:skewX(-48deg);top:52px");
  E.el(plane, "abs", "left:10px;top:20px;width:80px;height:62px;background:#ff7d63;clip-path:polygon(0 0,100% 100%,0 100%);top:32px");
  E.K(plane, "x", [[T[4], 0], [DUR - .2, 1750, "in"]]);
  E.K(plane, "o", [[T[4], 0], [T[4] + .08, 1]]);

  // resident props (y ~ 1420-1700): the ticket board and the paper stack that grows
  const stackAt = (t0, t1, n) => {
    const g = P("left:115px;top:1490px;width:380px;height:220px");
    for (let i = 0; i < n; i++) E.el(g, "abs", `left:${20 + (i % 2) * 14 - (i % 3) * 5}px;top:${200 - (i + 1) * (n > 6 ? 17 : 26)}px;width:300px;height:${n > 6 ? 20 : 30}px;border-radius:6px;background:${i % 2 ? "#fffdf6" : "#f0e9d6"};border:3px solid #b9ae94`);
    show(g, t0, t1);
  };
  const tick = P(`left:115px;top:1470px;width:330px;height:150px;border-radius:18px;background:#111;color:#ff4b3a;font-weight:900;font-size:60px;white-space:nowrap;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 20px rgba(0,0,0,.25)`, "N.º 4471");
  show(tick, T[0], T[1]);
  stackAt(T[1], T[2], 4); stackAt(T[2], T[3], 9);
  const board = P("left:105px;top:1450px;width:440px;height:200px;border-radius:18px;background:#111;color:#ff4b3a;font-weight:900;font-size:92px;white-space:nowrap;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1", `<div style="font-size:32px;letter-spacing:.14em;color:#ffb0a4">MINHA SENHA 4471</div><div>4472</div>`);
  show(board, T[3], DUR);

  // ---------- rhythm: a swish and a two-tone answer at every row change ----------
  T.slice(0, 5).forEach((t, i) => {
    if (i) { E.S(t - .03, "swish", .8); E.flash(t, "#ffffff", .35, .16); }
    E.S(t + .05, i % 2 ? "ding" : "pop", .8); E.S(t + .3, "thud", .6);
    if (i === 3) E.S(t + .35, "sparkle", .7);
  });
  E.S(T[4] + .1, "whoosh", .8);
  E.S(T[2], "scratch", .6);

  // ---------- the stamp (the punchline) ----------
  const sb = E.el(S.el, "abs", "left:70px;top:1190px;width:940px;display:flex;justify-content:center");
  const st = E.stamp(sb, "COME BACK|TOMORROW".replace("|", "<br>"), 12.0, { size: 92, rot: -7, shake: 22 });
  st.style.textAlign = "center"; st.style.alignSelf = "center";
  E.until(st, DUR, .1);
  E.S(12.25, "nope", .9);

  E.finish(DUR);
  E.K(E.logo, "s", [[13.7, 1], [13.95, 1.18, "out"], [14.3, 1, "io"]]);
}
