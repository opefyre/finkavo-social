// EP.6 "Lunch at grandma's" — the grandma who will not accept "I'm full". Three polite refusals, three more dishes, a record
// scratch, a montage (PLATE 5 -> 14, Otto swells into a ball), the table snaps, Otto rolls out of frame, and she says
// "He barely ate." — then throws a tower of tupperware after him. Universal joke, Portugal is the warm backdrop.
// Stands alone for strangers: no series numbering, no "follow" line.
export const meta = {
  id: "ep6-lunch", date: "2026-09-29",
  images: {
    o_happy: "characters/cutouts/otto-table_happy.webp", o_plead: "characters/cutouts/otto-table_plead.webp",
    o_panic: "characters/cutouts/otto-table_panic.webp", o_ball: "characters/cutouts/otto-table_stuffed.webp",
    d_knowing: "characters/cutouts/dona_knowing.webp", d_smirk: "characters/cutouts/dona_smirk.webp", d_skeptical: "characters/cutouts/dona_skeptical.webp",
    f_bacalhau: "characters/props/food_bacalhau.webp", f_bread: "characters/props/food_bread.webp", f_soup: "characters/props/food_soup.webp",
    f_chourico: "characters/props/food_chourico.webp", f_rice: "characters/props/food_rice.webp", f_cake: "characters/props/food_cake.webp",
    f_natas: "characters/props/food_natas.webp", f_tupper: "characters/props/food_tupperware.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 120, root: 57, seed: 61, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [5, 9, 12]] });
  const DUR = 13.6;
  const S = E.scene("kitchen", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const TABLE = 1250;                                             // table-top line (px)

  // ---------------- the kitchen ----------------
  const stage = E.el(S.el, "abs", "inset:0;transform-origin:350px 850px");
  E.el(stage, "abs", "left:0;top:0;width:1080px;height:1920px;background:#f4e4c1");                 // painted upper wall
  const tileSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#f8f5ee'/><rect x='2' y='2' width='116' height='116' rx='5' fill='none' stroke='#c9d8ea' stroke-width='3'/><g fill='#2f6db5'><circle cx='60' cy='60' r='9'/><ellipse cx='60' cy='36' rx='8' ry='15'/><ellipse cx='60' cy='84' rx='8' ry='15'/><ellipse cx='36' cy='60' rx='15' ry='8'/><ellipse cx='84' cy='60' rx='15' ry='8'/></g><g fill='#7fa8dc'><circle cx='14' cy='14' r='5'/><circle cx='106' cy='14' r='5'/><circle cx='14' cy='106' r='5'/><circle cx='106' cy='106' r='5'/></g></svg>`;
  E.el(stage, "abs", `left:0;top:560px;width:1080px;height:1060px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tileSvg)}");background-size:120px 120px;background-position:-30px 0`);
  E.el(stage, "abs", "left:0;top:546px;width:1080px;height:16px;background:#2f6db5");               // tile border
  E.el(stage, "abs", "left:0;top:1600px;width:1080px;height:320px;background:#c9a27a");              // floor
  E.el(stage, "abs", "left:0;top:1600px;width:1080px;height:10px;background:#a57e58");

  // ---------------- people (behind the table) ----------------
  const OS = 1.0, OW = 768 * OS, OH = 1080 * OS;
  const ottoW = E.el(stage, "abs", `left:-30px;top:${TABLE - 560 * OS}px;width:${OW}px;height:${OH}px;z-index:1`);
  const ottoI = E.el(ottoW, "abs", `inset:0;transform-origin:${380 * OS}px ${1080 * OS}px`);
  const OT = ["o_happy", "o_plead", "o_panic", "o_ball"];
  const oimg = OT.map(n => E.img(ottoI, n, `position:absolute;left:0;top:0;width:${OW}px;height:${OH}px`));
  const ottoFace = [[0, "o_happy"], [.7, "o_plead"], [5.3, "o_panic"], [8.3, "o_ball"]];

  const DS = .95, DW = 665 * DS, DH = 1014 * DS;
  const dona = E.el(stage, "abs", `left:490px;top:${TABLE - 620 * DS}px;width:${DW}px;height:${DH}px;z-index:1`);
  const donaI = E.el(dona, "abs", "inset:0;transform-origin:50% 100%");
  const DT = ["d_knowing", "d_smirk", "d_skeptical"];
  const dimg = DT.map(n => E.img(donaI, n, `position:absolute;left:0;top:0;width:${DW}px;height:${DH}px`));
  // she sways gently from frame 0 (the only motion before the first line)
  const sway = []; for (let t = 0; t <= 13.6; t += .8) sway.push([t, (Math.round(t / .8) % 2) ? -10 : 0, "io"]);
  E.K(dona, "y", sway);
  const donaFace = [[0, "d_knowing"], [1.6, "d_smirk"], [3.4, "d_knowing"], [4.4, "d_smirk"], [5.4, "d_knowing"], [10.5, "d_skeptical"], [11.7, "d_smirk"]];

  // ---------------- the table (two halves, so it can snap in the middle) ----------------
  const CRACK = 8.9;
  const half = (left, w, pivot) => {
    const h = E.el(stage, "abs", `left:${left}px;top:${TABLE}px;width:${w}px;height:360px;z-index:2;transform-origin:${pivot} 0`);
    E.el(h, "abs", "left:0;top:0;width:100%;height:26px;background:#8a5a2b;border-radius:6px");     // table top edge
    E.el(h, "abs", `left:0;top:22px;width:100%;height:338px;background-color:#fbf7ef;background-image:linear-gradient(45deg,rgba(207,53,46,.9) 25%,transparent 25%,transparent 75%,rgba(207,53,46,.9) 75%),linear-gradient(45deg,rgba(207,53,46,.9) 25%,transparent 25%,transparent 75%,rgba(207,53,46,.9) 75%);background-size:80px 80px;background-position:0 0,40px 40px;opacity:.95`);
    E.el(h, "abs", "left:0;top:352px;width:100%;height:8px;background:rgba(0,0,0,.12)");
    return h;
  };
  const tl = half(-20, 560, "0px"), tr = half(540, 560, "560px");
  E.K(tl, "r", [[CRACK, 0], [CRACK + .08, 4, "out"], [CRACK + .5, 16, "in"]]);
  E.K(tl, "y", [[CRACK, 0], [CRACK + .5, 170, "in"]]);
  E.K(tr, "r", [[CRACK, 0], [CRACK + .08, -4, "out"], [CRACK + .5, -16, "in"]]);
  E.K(tr, "y", [[CRACK, 0], [CRACK + .5, 170, "in"]]);

  // ---------------- food: every dish drops in and stacks; at the crack everything falls ----------------
  const SZ = { bacalhau: [241, 167], bread: [221, 199], soup: [203, 184], chourico: [220, 142], rice: [238, 155], cake: [211, 204], natas: [235, 150] };
  const dishes = [];
  const dish = (name, cx, bottom, sc, t, sound = "splat") => {
    const [w, h] = SZ[name], W = w * sc, H = h * sc;
    const d = E.el(stage, "abs", `left:${cx - W / 2}px;top:${bottom - H}px;width:${W}px;height:${H}px;z-index:3;transform-origin:50% 100%`);
    E.img(d, "f_" + name, `width:${W}px;height:${H}px`);
    if (t > 0) {
      E.K(d, "y", [[t - .18, -1100], [t, 0, "in"], [CRACK, 0], [CRACK + .7, 1500, "in"]]);
      E.K(d, "sy", [[t, .7], [t + .16, 1, "back"]]);
      E.K(d, "sx", [[t, 1.25], [t + .16, 1, "back"]]);
      E.K(d, "o", [[t - .19, 0], [t - .18, 1]]);
      E.S(t, sound, .9);
    } else E.K(d, "y", [[CRACK, 0], [CRACK + .7, 1500, "in"]]);
    E.K(d, "r", [[CRACK, 0], [CRACK + .7, (dishes.length % 2 ? 1 : -1) * (40 + dishes.length * 7)]]);
    dishes.push(d);
  };
  dish("bacalhau", 350, 1310, 1.15, 0);
  dish("bread", 600, 1270, 1.05, 1.9);
  dish("soup", 130, 1285, .95, 3.7);
  dish("chourico", 350, 1195, .9, 4.7);
  const MT = [5.6, 5.9, 6.2, 6.5, 6.8, 7.1, 7.4, 7.7, 8.0, 8.3];                 // the montage: a dish every 0.3 s
  const M = [["cake", 600, 1085, .9], ["natas", 130, 1135, .85], ["rice", 350, 1095, .9], ["bacalhau", 600, 935, .8], ["bread", 130, 1015, .8],
    ["soup", 820, 1280, .9], ["cake", 1000, 1275, .8], ["natas", 820, 1125, .8], ["chourico", 130, 885, .72], ["rice", 1000, 1110, .75]];
  M.forEach(([n, x, b, s], i) => dish(n, x, b, s, MT[i], i % 2 ? "pop" : "splat"));

  // the plate counter
  const plate = E.el(S.el, "abs", `left:100px;top:352px;display:inline-block;background:${C.ink};color:#fff;font-weight:900;font-size:58px;letter-spacing:.04em;padding:.1em .38em .14em;border-radius:.3em;white-space:nowrap;transform-origin:0 50%`, "PLATE 1");
  const plateN = [[0, 1], [1.9, 2], [3.7, 3], [4.7, 4], ...MT.map((t, i) => [t, 5 + i])];
  E.F(t => {
    const n = at(plateN, t);
    const s = "PLATE " + n; if (plate.textContent !== s) plate.textContent = s;
    plate.style.background = n >= 10 ? C.coralD : n >= 5 ? C.amberD : C.ink;
  });
  plateN.slice(1).forEach(([t]) => E.K(plate, "s", [[t, 1.35], [t + .2, 1, "back"]]));
  E.K(plate, "o", [[0, 0], [1.88, 0], [1.9, 1]]);

  // ---------------- Otto's body over time ----------------
  const ROLL = 9.35;
  E.F(t => {
    const f = at(ottoFace, t);
    oimg.forEach((im, i) => { im.style.opacity = OT[i] === f ? 1 : 0; });
    oimg[3].style.clipPath = t >= CRACK ? `inset(0 0 ${(1 - 790 / 1080) * 100}% 0)` : "none";   // the ball without its chair
    ottoW.style.zIndex = t >= CRACK ? 4 : 1;
    let sx = 1, sy = 1, y = 0, r = 0;
    if (t < 5.3) { y = Math.max(0, Math.sin(t * 9)) * -6; }                                        // chewing bob
    if (t >= 5.6 && t < 8.3) { const k = (t - 5.6) / 2.7; sx = 1 + k * .28; sy = 1 - k * .04; r = Math.sin(t * 50) * 1.2 * k; }
    if (t >= 5.3 && t < 5.6) r = Math.sin(t * 70) * 2;
    ottoI.style.transform = `translateY(${y}px) rotate(${r}deg) scale(${sx},${sy})`;
  });
  // the ball drops with the table, bounces, and rolls out left
  const BX = 380 * OS, BY = 480 * OS;
  E.F(t => { ottoW.style.transformOrigin = `${BX}px ${BY}px`; });
  E.K(ottoW, "y", [[CRACK, 0], [CRACK + .3, 420, "in"], [CRACK + .42, 360, "out"], [ROLL, 420, "in"]]);
  E.K(ottoW, "x", [[ROLL, 0], [ROLL + .9, -1150, "in"]]);
  E.K(ottoW, "r", [[ROLL, 0], [ROLL + .9, -560, "in"]]);
  E.S(8.3, "poof", .9); E.flash(8.3, "#fff4c0", .35, .2);

  // ---------------- Dona ----------------
  E.F(t => {
    const f = at(donaFace, t);
    dimg.forEach((im, i) => { im.style.opacity = DT[i] === f ? 1 : 0; });
    let y = 0;
    for (const k of [1.6, 3.4, 4.4]) if (t >= k && t < k + .3) y -= Math.sin((t - k) / .3 * Math.PI) * 26;   // a little hop on each line
    donaI.style.transform = `translateY(${y}px)`;
  });
  const THROW = 11.95;
  const tup = E.el(stage, "abs", "left:640px;top:820px;width:147px;height:258px;z-index:5;opacity:0");
  E.img(tup, "f_tupper", "width:147px;height:258px");
  E.K(tup, "o", [[THROW - .01, 0], [THROW, 1], [THROW + .55, 1], [THROW + .56, 0]]);
  E.K(tup, "x", [[THROW, 0], [THROW + .55, -1100, "lin"]]);
  E.K(tup, "y", [[THROW, 0], [THROW + .25, -260, "out"], [THROW + .55, 220, "in"]]);
  E.K(tup, "r", [[THROW, 0], [THROW + .55, -300]]);
  E.S(THROW, "whoosh", .9); E.S(THROW + .58, "thud", 1); E.S(THROW + .62, "poof", .6); E.shake(THROW + .58, 10, .25);

  // ---------------- speech bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:6;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const box = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 80 : 60}px;line-height:1.02;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(box, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .1, 1], [t1, 0]]);
    E.S(t0 + .02, "pop", .7);
    return b;
  };
  const sub = s => `<div style="font-size:40px;font-weight:800;color:${C.mute};margin-top:6px;letter-spacing:0">${s}</div>`;
  bubble("I'm full, thanks!", 60, 455, 500, "l", .7, 1.6);
  bubble(`Come mais!${sub("(eat more)")}`, 470, 440, 540, "r", 1.6, 2.8, true);
  bubble("No, really…", 60, 470, 440, "l", 2.8, 3.5);
  bubble("Just a little!", 470, 460, 500, "r", 3.4, 4.4);
  bubble("You're so thin!", 450, 460, 520, "r", 4.4, 5.35);
  bubble("He barely ate.", 420, 425, 580, "r", 10.5, 11.7, true);
  bubble("Take some home!", 420, 460, 580, "r", 11.7, 13.0);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Lunch at *grandma's*", { size: 76, lh: 1.04, instant: true, id: "hook", nowrap: true });

  // ---------------- camera and rhythm ----------------
  E.S(5.3, "scratch"); E.K(stage, "s", [[5.29, 1], [5.34, 1.16, "out"], [5.55, 1.16], [5.7, 1, "io"]]);
  E.S(5.62, "riser", .6);
  E.S(CRACK, "crack", 1); E.shake(CRACK, 26, .45); E.flash(CRACK, "#ffffff", .5, .2); E.S(CRACK + .3, "thud", .9);
  E.S(ROLL, "whoosh", 1); E.S(ROLL + .95, "slam", .7);
  E.S(10.62, "ding", .7);

  E.finish(DUR);
  E.K(E.logo, "s", [[12.8, 1], [13.05, 1.18, "out"], [13.4, 1, "io"]]);
}
