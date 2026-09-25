// EP.41 "The free bread in Portugal" — Buck sits in a tasca. The waiter drops bread, olives, cheese, butter and pâté on the table
// ("Bom apetite!"). Buck: "Ooh, free snacks! So generous!" He eats everything while a COUVERT meter he cannot see climbs to €16.40.
// The sardines (€9.50) arrive, then the bill unrolls: "Sixteen euros… for BREAD?!" NEXT TIME: Buck in a bomb-disposal suit pushes
// the basket away with long tongs; the waiter slides it straight back, smiling: "Bom apetite!" Voiced (Buck, the waiter) + effects.
export const meta = {
  id: "ep41-couvert", date: "2026-11-03",
  images: {
    bk_f: "characters/cutouts/buck-chair_fork.webp", bk_b: "characters/cutouts/buck-chair_bread.webp", bk_s: "characters/cutouts/buck-chair_shock.webp",
    bomb: "characters/cutouts/buck-chair_bomb.webp", wt: "characters/cutouts/barman_smile.webp",
    bread: "characters/props/couvert-bread.webp", olives: "characters/props/couvert-olives.webp", cheese: "characters/props/couvert-cheese.webp",
    butter: "characters/props/couvert-butter.webp", pate: "characters/props/couvert-pate.webp", sard: "characters/props/couvert-sardines.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 57, seed: 411, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 17.2, TOP = 1350;
  const S = E.scene("tasca", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const DROP = 1.1, FREE = 3.2, EAT = 6.0, FISH = 8.8, BILL = 9.4, NEXT = 13.4, BACK = 15.0;

  // ---------------- the tasca ----------------
  const tileSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='110' height='110'><rect width='110' height='110' fill='#f7f4ec'/><rect x='2' y='2' width='106' height='106' rx='4' fill='none' stroke='#d6c79a' stroke-width='3'/><g fill='#d8a531'><circle cx='55' cy='55' r='10'/></g><g fill='#2f6db5'><path d='M55 12 L66 40 L55 34 L44 40Z'/><path d='M55 98 L66 70 L55 76 L44 70Z'/><path d='M12 55 L40 44 L34 55 L40 66Z'/><path d='M98 55 L70 44 L76 55 L70 66Z'/></g></svg>`;
  E.el(S.el, "abs", "inset:0;background:#f3e3c3");
  E.el(S.el, "abs", `left:0;top:880px;width:1080px;height:${TOP - 880}px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tileSvg)}");background-size:110px 110px`);
  E.el(S.el, "abs", "left:0;top:866px;width:1080px;height:16px;background:#8a5a2b");
  const board = E.el(S.el, "abs", "left:680px;top:470px;width:320px;height:260px;background:#2d3a33;border:12px solid #8a5a2b;border-radius:10px;color:#f4efe2;font-weight:800;font-size:34px;line-height:1.35;padding:18px 22px;box-sizing:border-box;font-family:'Comic Sans MS','Chalkboard SE',cursive");
  E.el(board, "", "font-size:40px;text-align:center;margin-bottom:6px", "HOJE");
  E.el(board, "", "", "Sardinhas&nbsp;&nbsp;9,50");
  E.el(board, "", "", "Bacalhau&nbsp;&nbsp;12,00");

  // ---------------- Buck at the table ----------------
  const BW = 536, BH = 1014, bk = E.el(S.el, "abs", `left:140px;top:${TOP - BH * .62}px;width:${BW}px;height:${BH}px;z-index:2;transform-origin:50% 100%`);
  const bIm = ["bk_f", "bk_b", "bk_s"].map(n => E.img(bk, n, `position:absolute;left:0;top:0;width:${BW}px;height:${BH}px`));
  E.F(t => { const f = at([[0, "bk_f"], [EAT - .1, "bk_b"], [FISH, "bk_f"], [BILL + .8, "bk_s"]], t); bIm.forEach((x, i) => { x.style.opacity = ["bk_f", "bk_b", "bk_s"][i] === f ? 1 : 0; }); });
  E.K(bk, "o", [[NEXT - .01, 1], [NEXT, 0]]);
  const bob = []; for (let t = 0; t < NEXT; t += .8) bob.push([t, 0, "io"], [t + .4, -8, "io"]);
  E.K(bk, "y", bob);
  const chew = []; for (let t = EAT; t < FISH - .2; t += .25) chew.push([t, 1, "io"], [t + .12, 1.03, "io"]);
  E.K(bk, "sy", chew);
  const bomb = E.el(S.el, "abs", `left:170px;top:960px;width:825px;height:981px;z-index:2;opacity:0`);
  E.img(bomb, "bomb", "width:825px;height:981px");
  E.K(bomb, "o", [[NEXT - .01, 0], [NEXT, 1]]);
  E.K(bomb, "x", [[NEXT + .5, 0], [NEXT + 1.0, -30, "io"], [BACK, -30], [BACK + .15, 20, "out"], [BACK + .4, 0, "io"]]);

  // ---------------- the waiter ----------------
  const wt = E.el(S.el, "abs", `left:640px;top:${TOP - 993 * .62 + 60}px;width:${856 * .62}px;height:${993 * .62}px;z-index:1;opacity:0`);
  E.img(wt, "wt", `width:${856 * .62}px;height:${993 * .62}px`);
  E.K(wt, "o", [[.7, 0], [.71, 1], [FREE - .01, 1], [FREE, 0]]);
  E.K(wt, "x", [[.7, 500], [1.0, 0, "out"], [FREE - .3, 0], [FREE, 500, "in"]]);
  const wt2 = E.el(S.el, "abs", `left:-80px;top:${TOP - 993 * .62 + 60}px;width:${856 * .62}px;height:${993 * .62}px;z-index:1;opacity:0`);   // back from the left for the end
  E.img(wt2, "wt", `width:${856 * .62}px;height:${993 * .62}px`);
  E.K(wt2, "o", [[BACK - .41, 0], [BACK - .4, 1]]); E.K(wt2, "x", [[BACK - .4, -500], [BACK - .1, 0, "out"]]);

  // ---------------- the table (red check cloth) ----------------
  E.el(S.el, "abs", `left:0;top:${TOP}px;width:1080px;height:150px;z-index:3;background-color:#fff;background-image:linear-gradient(90deg,rgba(214,58,58,.75) 50%,transparent 50%),linear-gradient(rgba(214,58,58,.75) 50%,transparent 50%);background-size:90px 90px`);
  E.el(S.el, "abs", `left:0;top:${TOP + 150}px;width:1080px;height:150px;z-index:3;background-color:#f1f1f1;background-image:linear-gradient(90deg,rgba(180,40,40,.8) 50%,transparent 50%),linear-gradient(rgba(180,40,40,.8) 50%,transparent 50%);background-size:90px 90px;box-shadow:0 -6px 0 rgba(0,0,0,.08)`);
  E.el(S.el, "abs", `left:0;top:${TOP + 300}px;width:1080px;height:${1920 - TOP - 300}px;z-index:1;background:repeating-linear-gradient(90deg,#8a6a4a 0 150px,#7d5f41 150px 300px)`);
  for (const x of [60, 980]) E.el(S.el, "abs", `left:${x}px;top:${TOP + 300}px;width:40px;height:220px;z-index:3;background:#5a3a22`);

  // ---------------- the couvert: lands, then gets eaten ----------------
  const ITEMS = [["bread", 287, 245, .82, 20, 2.5], ["pate", 255, 207, .8, 250, 2.8], ["olives", 242, 200, .82, 470, 3.0], ["cheese", 285, 194, .8, 680, 6.9], ["butter", 261, 172, .8, 870, 1.2]];
  const crumbs = x => { const c = E.el(S.el, "abs", `left:${x}px;top:${TOP + 60}px;width:170px;height:40px;z-index:4;opacity:0;background:radial-gradient(circle at 20% 50%,#d9a45c 0 7px,transparent 8px),radial-gradient(circle at 55% 30%,#c98e45 0 6px,transparent 7px),radial-gradient(circle at 80% 60%,#e0b36e 0 8px,transparent 9px)`); return c; };
  let price = [];
  ITEMS.forEach(([n, w, h, s, x, p], i) => {
    const t = DROP + i * .35, te = EAT + .1 + i * .5;
    const el = E.el(S.el, "abs", `left:${x}px;top:${TOP + 110 - h * s}px;width:${w * s}px;height:${h * s}px;z-index:4;opacity:0;transform-origin:50% 100%`);
    E.img(el, n, `width:${w * s}px;height:${h * s}px`);
    E.K(el, "o", [[t - .01, 0], [t, 1], [te, 1], [te + .15, 0]]);
    E.K(el, "y", [[t, -700], [t + .22, 0, "in"]]); E.K(el, "s", [[t + .22, 1.12], [t + .4, 1, "out"], [te, 1], [te + .15, .4, "in"]]);
    E.clip(t + .2, "sfx/plate-down.wav", { vol: .9 });
    const cr = crumbs(x + w * s / 2 - 85); E.K(cr, "o", [[te + .1, 0], [te + .15, 1], [NEXT - .01, 1], [NEXT, 0]]);
    E.clip(te, "sfx/munch.wav", { vol: .8, to: .45 });
    price.push([te, p]);
  });
  const sd = E.el(S.el, "abs", `left:${540 - 309 * .5}px;top:${TOP + 120 - 223}px;width:${309}px;height:${223}px;z-index:5;opacity:0;transform-origin:50% 100%`);
  E.img(sd, "sard", "width:309px;height:223px");
  E.K(sd, "o", [[FISH - .01, 0], [FISH, 1], [NEXT - .01, 1], [NEXT, 0]]); E.K(sd, "y", [[FISH, -700], [FISH + .22, 0, "in"]]);
  E.clip(FISH + .2, "sfx/plate-down.wav", { vol: .9 });
  // the basket comes back for the NEXT TIME scene
  const bb = E.el(S.el, "abs", `left:360px;top:${TOP + 110 - 245 * .82}px;width:${287 * .82}px;height:${245 * .82}px;z-index:4;opacity:0`);
  E.img(bb, "bread", `width:${287 * .82}px;height:${245 * .82}px`);
  E.K(bb, "o", [[NEXT - .01, 0], [NEXT, 1]]);
  E.K(bb, "x", [[NEXT + .5, 0], [NEXT + 1.1, -340, "io"], [BACK, -340], [BACK + .3, 0, "out"]]);
  E.K(bb, "r", [[NEXT + .5, 0], [NEXT + .8, -4, "io"], [NEXT + 1.1, 0, "io"], [BACK, 0], [BACK + .15, 5, "io"], [BACK + .3, 0, "io"]]);

  // ---------------- the couvert meter ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:52px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7`, "");
  const tot = [[0, 0]]; let acc = 0; price.sort((a, b) => a[0] - b[0]).forEach(([t, p]) => { acc += p; tot.push([t, acc]); });
  E.F(t => { const v = at(tot, t), s = `COUVERT: €${v.toFixed(2)}`; if (pill.textContent !== s) pill.textContent = s; pill.style.background = v > 0 ? C.coralD : C.ink; pill.style.opacity = t < NEXT ? 1 : 0; });
  price.forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.22], [t + .25, 1, "out"]]));
  const nx = E.el(S.el, "abs", `left:100px;top:352px;background:#1f7a3a;color:#fff;font-weight:900;font-size:52px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7;opacity:0`, "NEXT TIME…");
  E.K(nx, "o", [[NEXT - .01, 0], [NEXT, 1]]); E.K(nx, "s", [[NEXT, 1.3], [NEXT + .3, 1, "out"]]);

  // ---------------- the bill ----------------
  const rc = E.el(S.el, "abs", "left:590px;top:450px;width:440px;height:0;overflow:hidden;z-index:8;background:#fffdf6;box-shadow:0 12px 30px rgba(0,0,0,.25);border-radius:4px");
  const rin = E.el(rc, "", "padding:26px 30px;font-family:'Courier New',monospace;font-weight:700;font-size:34px;line-height:1.5;color:#2a2a2a");
  const LINES = [["PÃO", "2,50", 1], ["AZEITONAS", "3,00", 1], ["QUEIJO", "6,90", 1], ["MANTEIGA", "1,20", 1], ["PATÉ", "2,80", 1], ["SARDINHAS", "9,50", 0]];
  E.el(rin, "", "text-align:center;font-size:36px;border-bottom:3px dashed #999;padding-bottom:8px;margin-bottom:8px", "A CONTA");
  LINES.forEach(([a, b, cv]) => E.el(rin, "", `display:flex;justify-content:space-between;color:${cv ? "#c0392b" : "#2a2a2a"}`, `<span>${a}</span><span>${b}</span>`));
  E.el(rin, "", "display:flex;justify-content:space-between;border-top:3px dashed #999;margin-top:8px;padding-top:8px;font-size:40px", "<span>TOTAL</span><span>25,90</span>");
  const cvl = E.el(rin, "", "margin-top:10px;text-align:center;background:#c0392b;color:#fff;border-radius:10px;font-size:34px;padding:4px 0", "COUVERT: 16,40");
  E.K(rc, "o", [[NEXT - .01, 1], [NEXT, 0]]);
  E.F(t => { const u = Math.max(0, Math.min(1, (t - BILL) / 1.1)); rc.style.height = `${u * 700}px`; });
  E.K(cvl, "s", [[BILL + 1.1, 1], [BILL + 1.3, 1.15, "out"], [BILL + 1.5, 1, "io"]]);

  // ---------------- bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 56) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:9;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:20px 28px 24px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:32px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble(`Bom apetite!${sub("(Enjoy!)")}`, 600, 560, 400, 200, 2.7, FREE - .05, 58);
  bubble("Ooh, free snacks! So generous!", 40, 520, 520, 220, FREE + .05, EAT - .1, 54);
  bubble("Sixteen euros… for BREAD?!", 40, 520, 500, 220, BILL + 1.0, NEXT - .1, 54);
  bubble(`Bom apetite!`, 40, 600, 380, 170, BACK + .05, DUR - .5, 62);

  // ---------------- sound ----------------
  E.clip(0, "sfx/cafe-morning.wav", { vol: .25, duck: false }); E.clip(2.9, "sfx/cafe-morning.wav", { vol: .25, duck: false });
  E.clip(5.8, "sfx/cafe-morning.wav", { vol: .25, duck: false }); E.clip(8.7, "sfx/cafe-morning.wav", { vol: .2, duck: false, to: BILL - 8.7 });
  E.clip(2.7, "voices/ep41/w_bom1.wav", { vol: 1.15 });
  E.clip(FREE + .05, "voices/ep41/b_free.wav", { vol: 1.1 });
  E.clip(BILL, "sfx/printer.wav", { vol: .6, to: 1.2 });
  E.clip(BILL + 1.3, "sfx/cash-register.wav", { vol: .8 });
  E.clip(BILL + 1.0, "voices/ep41/b_bread.wav", { vol: 1.1 });
  E.S(NEXT, "whoosh", .6);
  E.clip(NEXT + .5, "sfx/plastic-squeak-short.wav", { vol: .5 });
  E.S(BACK, "swish", .8);
  E.clip(BACK + .05, "voices/ep41/w_bom2.wav", { vol: 1.15 });
  E.shake(BACK + .2, 10);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "The *free* bread in Portugal", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[16.4, 1], [16.65, 1.18, "out"], [17.0, 1, "io"]]);
}
