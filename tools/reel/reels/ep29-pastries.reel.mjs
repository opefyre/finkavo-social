// EP.29 "Portuguese pastries, ranked" — a tier list (S/A/B/C). Each pastry pops up on the counter with its name, Otto reacts,
// it slaps into its row. Pão de Deus lands in C (the comment bait). The pastel de nata gets a drum roll and goes to S… and a
// pigeon swoops in and steals it. "Your ranking? 👇" A tier-list format for comments; effects only, no voice.
export const meta = {
  id: "ep29-pastries", date: "2026-10-22",
  images: {
    o_excited: "characters/cutouts/otto-casual_excited.webp", o_grab: "characters/cutouts/otto-casual_grab.webp", o_betrayed: "characters/cutouts/otto-casual_betrayed.webp",
    nata: "characters/props/pastry-nata.webp", berlim: "characters/props/pastry-berlim.webp", trav: "characters/props/pastry-travesseiro.webp",
    arroz: "characters/props/pastry-arroz.webp", queij: "characters/props/pastry-queijada.webp", pao: "characters/props/pastry-paodeus.webp",
    pigeon: "characters/props/pigeon-nata.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 60, seed: 291, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [9, 12, 16]] });
  const DUR = 14.6;
  const S = E.scene("board", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  // ---------------- a café backdrop ----------------
  E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;background:#f6ead7");
  const tileSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#f8f5ee'/><rect x='2' y='2' width='116' height='116' rx='5' fill='none' stroke='#c9d8ea' stroke-width='3'/><g fill='#2f6db5'><circle cx='60' cy='60' r='9'/><ellipse cx='60' cy='36' rx='8' ry='15'/><ellipse cx='60' cy='84' rx='8' ry='15'/><ellipse cx='36' cy='60' rx='15' ry='8'/><ellipse cx='84' cy='60' rx='15' ry='8'/></g></svg>`;
  E.el(S.el, "abs", `left:0;top:1300px;width:1080px;height:620px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tileSvg)}");background-size:120px 120px;opacity:.7`);
  E.el(S.el, "abs", "left:0;top:1640px;width:1080px;height:280px;background:#8a5a2b");                 // the counter
  E.el(S.el, "abs", "left:0;top:1640px;width:1080px;height:22px;background:#a8764c");

  // ---------------- the tier board ----------------
  const TIERS = [["S", "#ff6b6b"], ["A", "#ffa94d"], ["B", "#ffd43b"], ["C", "#8ce99a"]];
  const RY = 450, RH = 205;
  const board = E.el(S.el, "abs", `left:40px;top:${RY}px;width:1000px;height:${RH * 4}px;border-radius:18px;overflow:hidden;background:#232323;box-shadow:0 14px 34px rgba(0,0,0,.25)`);
  TIERS.forEach(([l, c], i) => {
    E.el(board, "abs", `left:0;top:${i * RH}px;width:150px;height:${RH - 6}px;background:${c};display:flex;align-items:center;justify-content:center;font-weight:900;font-size:110px;color:#222`, l);
    E.el(board, "abs", `left:150px;top:${i * RH + RH - 6}px;width:850px;height:6px;background:#111`);
  });
  E.K(board, "s", [[0, .97], [.5, 1, "out"]]);                                                        // frame-0 motion
  // slot positions inside the rows
  const slot = (row, k) => [320 + k * 230, RY + row * RH + (RH - 6) / 2];

  // ---------------- Otto (bottom left, behind the counter) ----------------
  const OS = .62;
  const otto = E.el(S.el, "abs", `left:-10px;top:${1660 - 700 * OS}px;width:${625 * OS}px;height:${1078 * OS}px;z-index:1`);
  const OT = ["o_excited", "o_grab", "o_betrayed"];
  const oim = OT.map(n => E.img(otto, n, `position:absolute;left:0;top:0;width:${625 * OS}px;height:${1078 * OS}px`));
  E.el(S.el, "abs", "left:0;top:1660px;width:1080px;height:260px;background:#8a5a2b;z-index:2");      // counter front covers his legs

  // ---------------- the pastries ----------------
  // [image, w, h, name, tier row, slot, appear time]
  const P = [["arroz", 228, 243, "Bolo de arroz", 2, 0, .6], ["trav", 282, 181, "Travesseiro", 1, 0, 2.2], ["queij", 242, 195, "Queijada", 2, 1, 3.8],
    ["berlim", 243, 233, "Bola de Berlim", 1, 1, 5.4], ["pao", 252, 228, "Pão de Deus", 3, 0, 7.0], ["nata", 252, 194, "Pastel de nata", 0, 0, 9.0]];
  const HOLD = 1.1, NATA_HOLD = 1.5;
  const nameEl = E.el(S.el, "abs", `left:420px;top:1690px;width:620px;text-align:center;font-weight:900;font-size:58px;color:#fff;z-index:4;white-space:nowrap`, "");
  const STEAL = 11.4;
  P.forEach(([img, w, h, name, row, k, t0], i) => {
    const hold = img === "nata" ? NATA_HOLD : HOLD, tFly = t0 + hold, tLand = tFly + .35;
    const big = 1.35, sm = .8, bw = w * big, bh = h * big;
    const el = E.el(S.el, "abs", `left:0;top:0;width:${bw}px;height:${bh}px;z-index:3;opacity:0`);
    E.img(el, img, `width:${bw}px;height:${bh}px`);
    const cx = 730, cy = 1560, [sx, sy] = slot(row, k);
    E.K(el, "o", [[t0 - .01, 0], [t0, 1], ...(img === "nata" ? [[STEAL + .1, 1], [STEAL + .11, 0]] : [])]);
    E.K(el, "x", [[t0, cx - bw / 2], [tFly, cx - bw / 2], [tLand, sx - bw / 2, "io"]]);
    E.K(el, "y", [[t0, cy - bh / 2 + 120], [t0 + .25, cy - bh / 2, "back"], [tFly, cy - bh / 2], [tLand, sy - bh / 2, "io"]]);
    E.K(el, "s", [[t0, .4], [t0 + .25, 1, "back"], [tFly, 1], [tLand, sm / big, "io"]]);
    E.S(t0, "pop", .7); E.S(t0 + .05, "swish", .5);
    E.clip(tLand - .02, "sfx/tier-drop.wav", { vol: 1.0 });
    E.F(t => { if (t >= t0 && t < tFly) { if (nameEl.textContent !== name) nameEl.textContent = name; } else if (t >= tFly && nameEl.textContent === name) nameEl.textContent = ""; });
    if (img === "pao") { E.S(tLand + .05, "nope", .5); }
  });
  // Otto's reactions
  E.F(t => {
    const f = at([[0, "o_excited"], [9.0, "o_grab"], [STEAL + .2, "o_betrayed"]], t);
    oim.forEach((im, i) => { im.style.opacity = OT[i] === f ? 1 : 0; });
    otto.style.transform = t < 9 ? `translateY(${-Math.abs(Math.sin(t * 6)) * 8}px)` : "none";
  });
  // the nata moment: drum roll, glow, S-tier sparkle
  E.S(9.0, "riser", .6);
  const glow = E.el(S.el, "abs", "left:500px;top:1300px;width:460px;height:460px;border-radius:50%;background:radial-gradient(circle,rgba(255,230,140,.9),rgba(255,230,140,0) 68%);z-index:2;opacity:0");
  E.K(glow, "o", [[9.0, 0], [9.3, 1], [10.5, 1], [10.7, 0]]);
  E.S(10.85, "sparkle", .9); E.S(10.9, "ding", .7);
  const sGlow = E.el(S.el, "abs", `left:40px;top:${RY}px;width:1000px;height:${RH - 6}px;border-radius:18px 18px 0 0;box-shadow:inset 0 0 0 8px #ffd43b;z-index:3;opacity:0`);
  E.K(sGlow, "o", [[10.85, 0], [10.95, 1], [STEAL, 1], [STEAL + .2, 0]]);
  // …the pigeon steals it
  const [nx, ny] = slot(0, 0);
  const pg = E.el(S.el, "abs", `left:0;top:0;width:${287 * .9}px;height:${239 * .9}px;z-index:5;opacity:0`);
  E.img(pg, "pigeon", `width:${287 * .9}px;height:${239 * .9}px`);
  E.K(pg, "o", [[STEAL - .5, 0], [STEAL - .49, 1], [STEAL + 1.2, 1], [STEAL + 1.21, 0]]);
  E.K(pg, "x", [[STEAL - .5, -300], [STEAL, nx - 120, "out"], [STEAL + 1.2, 1200, "in"]]);
  E.K(pg, "y", [[STEAL - .5, ny - 400], [STEAL, ny - 120, "out"], [STEAL + 1.2, ny - 500, "in"]]);
  E.clip(STEAL - .5, "sfx/pigeon-flutter.wav", { vol: .9 });
  E.S(STEAL + .3, "scratch", .7);
  const empty = E.el(S.el, "abs", `left:${nx - 70}px;top:${ny - 55}px;width:140px;height:110px;border:6px dashed rgba(255,255,255,.5);border-radius:18px;z-index:3;opacity:0`);
  E.K(empty, "o", [[STEAL + .15, 0], [STEAL + .3, 1]]);

  // ---------------- text ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${typeof tail === "number" ? tail + "px" : tail === "l" ? "15%" : "85%"} 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:20px 28px 24px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 66 : 54}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `${typeof tail === "number" ? `left:${tail}px` : tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("NOOO!", 330, 1330, 300, 40, STEAL + .35, DUR - .6, true);
  const ask = E.el(S.el, "abs", `left:430px;top:1700px;width:600px;text-align:center;font-weight:900;font-size:58px;color:#fff;z-index:4;opacity:0`, "Your ranking? 👇");
  E.K(ask, "o", [[STEAL + 1.0, 0], [STEAL + 1.2, 1]]); E.K(ask, "s", [[STEAL + 1.0, .6], [STEAL + 1.3, 1, "back"]]);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Portuguese pastries, *ranked*", { size: 50, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[13.8, 1], [14.05, 1.18, "out"], [14.4, 1, "io"]]);
}
