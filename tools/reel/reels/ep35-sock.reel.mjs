// EP.35 "The sock that fell to the neighbours" — Otto's striped sock drops from his clothesline. He goes down to fetch it and every
// floor keeps him: 3rd floor, grandma feeds him (plates land); 2nd floor, a proud mum shows 400 baby photos; 1st floor, the
// landlord "just a quick word about the rent". The clock runs 10:05 → 18:40. Back upstairs with oranges, cake, wine… no sock.
// Last shot: the sock is in a pigeon's nest. Effects only (knocks, doors, stairs, pigeon). Paced per the skit guide.
export const meta = {
  id: "ep35-sock", date: "2026-10-28",
  images: {
    o_ex: "characters/cutouts/otto-casual_excited.webp", o_bet: "characters/cutouts/otto-casual_betrayed.webp", o_awk: "characters/cutouts/otto-casual_awkward.webp",
    o_load: "characters/cutouts/otto-casual_loaded.webp", dona: "characters/cutouts/dona_box.webp", mum: "characters/cutouts/neighbour_album.webp",
    renda: "characters/cutouts/renda_smug.webp", sock: "characters/props/sock.webp", nest: "characters/props/pigeon-nest.webp",
    f1: "characters/props/food_bacalhau.webp", f2: "characters/props/food_soup.webp", f3: "characters/props/food_cake.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 57, seed: 351, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [9, 12, 16]] });
  const DUR = 15.6;
  const S = E.scene("building", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FALL = .9, F3 = 2.6, F2 = 5.6, F1 = 8.6, HOME = 11.4, NEST = 13.4, FLOOR = 1720;
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };
  const fig = (parent, img, w, h, s, left, extra = "") => { const W = w * s, H = h * s; const el = E.el(parent, "abs", `left:${left}px;top:${FLOOR - H + 10}px;width:${W}px;height:${H}px;transform-origin:50% 100%;${extra}`); E.img(el, img, `width:${W}px;height:${H}px`); return el; };

  // ================= 0) the balcony: the sock falls =================
  const A = layer(0, F3);
  E.el(A, "abs", "inset:0;background:linear-gradient(180deg,#8fcdf0,#dff2fb)");
  E.el(A, "abs", "left:0;top:560px;width:1080px;height:1360px;background:#f7e3a3");
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) E.el(A, "abs", `left:${80 + c * 330}px;top:${1000 + r * 320}px;width:200px;height:220px;background:#3d5a73;border:12px solid #fff;border-radius:100px 100px 6px 6px`);
  E.el(A, "abs", "left:0;top:900px;width:1080px;height:20px;background:#3b3b3b");                    // the balcony rail
  E.el(A, "abs", "left:0;top:620px;width:1080px;height:6px;background:#555");                        // the clothesline
  const shirts = [["#e5484d", 120], ["#2f6db5", 360], ["#35d07f", 800]];
  shirts.forEach(([c, x], i) => { const s2 = E.el(A, "abs", `left:${x}px;top:626px;width:140px;height:170px;background:${c};border-radius:10px 10px 4px 4px;transform-origin:50% 0`); const k = []; for (let t = 0; t < F3; t += .6) k.push([t, 3, "io"], [t + .3, -3, "io"]); E.K(s2, "r", k); });
  const sock = E.el(A, "abs", `left:590px;top:622px;width:${232 * .6}px;height:${268 * .6}px;transform-origin:50% 0`);
  E.img(sock, "sock", `width:${232 * .6}px;height:${268 * .6}px`);
  E.K(sock, "r", [[0, 8], [.4, -8, "io"], [FALL, 6, "io"], [FALL + 1.2, 400, "in"]]);
  E.K(sock, "y", [[FALL, 0], [FALL + 1.2, 1500, "in"]]);
  E.K(sock, "x", [[FALL, 0], [FALL + .6, 60, "io"], [FALL + 1.2, -40, "io"]]);
  E.S(FALL, "pop", .7); E.S(FALL + .1, "whoosh", .7);
  const oA = fig(A, "o_ex", 625, 1078, .9, -60, "z-index:2");
  const oA2 = fig(A, "o_bet", 625, 1078, .9, -60, "z-index:2;opacity:0");
  E.K(oA2, "o", [[FALL + .5, 0], [FALL + .55, 1]]); E.K(oA, "o", [[FALL + .5, 1], [FALL + .55, 0]]);

  // ================= floors: a stairwell landing with a door =================
  const landing = (t0, t1, n, wall) => {
    const L = layer(t0, t1);
    E.el(L, "abs", `inset:0;background:${wall}`);
    E.el(L, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:linear-gradient(rgba(0,0,0,.05) 2px,transparent 2px);background-size:100% 90px");
    E.el(L, "abs", `left:0;top:${FLOOR}px;width:1080px;height:200px;background:#b99a7a`);
    E.el(L, "abs", `left:560px;top:620px;width:400px;height:${FLOOR - 620}px;background:#3b2412;border-radius:8px 8px 0 0`);
    const door = E.el(L, "abs", `left:574px;top:634px;width:372px;height:${FLOOR - 634}px;background:#8a5a2b;transform-origin:100% 50%;z-index:1`);
    E.el(door, "abs", "left:40px;top:60px;width:292px;height:360px;border:8px solid #6a3e1e;border-radius:8px");
    E.el(door, "abs", "left:40px;top:500px;width:292px;height:360px;border:8px solid #6a3e1e;border-radius:8px");
    E.el(door, "abs", "left:30px;top:470px;width:30px;height:30px;border-radius:50%;background:#e2b54a");
    E.el(L, "abs", `left:690px;top:560px;width:140px;height:60px;border-radius:10px;background:#fff;box-shadow:0 4px 8px rgba(0,0,0,.15);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:40px;color:#333`, `${n}º`);
    E.K(door, "sx", [[t0 + .7, 1], [t0 + 1.0, .06, "out"]]);
    E.clip(t0 + .15, "sfx/door-knock.wav", { vol: .8 }); E.clip(t0 + .7, "sfx/door-open.wav", { vol: .6, to: .6 });
    E.clip(t0 - .45, "sfx/stairs-run.wav", { vol: .7, to: .8 });
    return L;
  };
  const otto = (L, t0, t1, faces) => {
    const w = E.el(L, "abs", `left:-40px;top:${FLOOR - 1078 * .9 + 10}px;width:${625 * .9}px;height:${1078 * .9}px;z-index:3`);
    const im = faces.map(([n, wd]) => E.img(w, n, `position:absolute;left:0;bottom:0;width:${wd * .9}px;height:${1078 * .9}px`));
    E.F(t => { const f = at(faces.map(([n, , k]) => [t0 + k, n]), t); im.forEach((x, i) => { x.style.opacity = faces[i][0] === f ? 1 : 0; }); });
    E.K(w, "x", [[t0, -400], [t0 + .3, 0, "out"]]);
    return w;
  };
  // 3rd floor: grandma feeds him
  const L3 = landing(F3, F2, 3, "#f1e2c9");
  const dn = fig(L3, "dona", 619, 1021, .9, 560, "z-index:2;opacity:0");
  E.K(dn, "o", [[F3 + .9, 0], [F3 + 1.0, 1]]);
  otto(L3, F3, F2, [["o_ex", 625, 0], ["o_awk", 488, 1.2]]);
  E.el(L3, "abs", `left:300px;top:1330px;width:200px;height:24px;border-radius:8px;background:#7a4a26;z-index:3`); E.el(L3, "abs", `left:390px;top:1354px;width:20px;height:${FLOOR - 1354}px;background:#6a3e1e;z-index:3`);
  [["f2", 203, 184, 2.0], ["f1", 241, 167, 2.4], ["f3", 211, 204, 2.8]].forEach(([n, w, h, dt], i) => {
    const t = F3 + dt, el = E.el(L3, "abs", `left:${400 - w * .4 + (i % 2) * 20}px;top:${1330 - i * 130 - h * .8}px;width:${w * .8}px;height:${h * .8}px;z-index:4;opacity:0`);
    E.img(el, n, `width:${w * .8}px;height:${h * .8}px`);
    E.K(el, "o", [[t - .01, 0], [t, 1]]); E.K(el, "y", [[t, -500], [t + .25, 0, "in"]]); E.S(t + .25, "splat", .7);
  });
  // 2nd floor: the proud mum and her album
  const L2 = landing(F2, F1, 2, "#dfe9f2");
  const mm = fig(L2, "mum", 512, 1075, .9, 560, "z-index:2;opacity:0");
  E.K(mm, "o", [[F2 + .9, 0], [F2 + 1.0, 1]]);
  otto(L2, F2, F1, [["o_ex", 625, 0], ["o_awk", 488, 1.2], ["o_bet", 625, 2.3]]);
  for (let i = 0; i < 7; i++) {                                                           // baby photos pile up
    const t = F2 + 1.3 + i * .22, ph = E.el(L2, "abs", `left:${140 + (i % 3) * 110}px;top:${620 + (i % 4) * 90}px;width:150px;height:170px;background:#fff;box-shadow:0 6px 12px rgba(0,0,0,.2);z-index:4;opacity:0;padding:10px`);
    E.el(ph, "", `width:130px;height:110px;background:radial-gradient(circle at 50% 45%,#f5d0b4 0 26px,${["#ffd1dc", "#cfe8ff", "#fff1b8"][i % 3]} 27px)`);
    E.K(ph, "o", [[t - .01, 0], [t, 1]]); E.K(ph, "r", [[t, (i % 2 ? 1 : -1) * 20], [t + .2, (i % 2 ? 1 : -1) * 8, "out"]]); E.K(ph, "s", [[t, .5], [t + .2, 1, "back"]]);
    E.S(t, "tick", .6);
  }
  // 1st floor: the landlord
  const L1 = landing(F1, HOME, 1, "#e9dfe8");
  const rd = fig(L1, "renda", 672, 1030, .88, 540, "z-index:2;opacity:0");
  E.K(rd, "o", [[F1 + .9, 0], [F1 + 1.0, 1]]);
  otto(L1, F1, HOME, [["o_ex", 625, 0], ["o_bet", 625, 1.3]]);

  // ================= home: loaded, no sock =================
  const H = layer(HOME, NEST);
  E.el(H, "abs", "inset:0;background:linear-gradient(180deg,#f6b26b,#ffd9a0)");                 // evening
  E.el(H, "abs", "left:0;top:560px;width:1080px;height:1360px;background:#f7e3a3");
  for (let c = 0; c < 3; c++) E.el(H, "abs", `left:${80 + c * 330}px;top:1000px;width:200px;height:220px;background:#3d5a73;border:12px solid #fff;border-radius:100px 100px 6px 6px`);
  E.el(H, "abs", "left:0;top:900px;width:1080px;height:20px;background:#3b3b3b");
  E.el(H, "abs", "left:0;top:620px;width:1080px;height:6px;background:#555");
  const oh = fig(H, "o_load", 625, 1078, 1.0, 220, "z-index:2");
  E.K(oh, "y", [[HOME, 0], [HOME + .2, -14, "out"], [HOME + .4, 0, "in"]]);
  E.S(HOME, "thud", .6);

  // ================= the nest =================
  const N = layer(NEST, DUR);
  E.el(N, "abs", "inset:0;background:linear-gradient(180deg,#f19a5a,#ffcf8a)");
  E.el(N, "abs", "left:0;top:1300px;width:1080px;height:620px;background:#c0643f");                // a roof
  E.el(N, "abs", "left:0;top:1300px;width:1080px;height:620px;background-image:repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 6px,transparent 6px 70px),repeating-linear-gradient(0deg,rgba(0,0,0,.1) 0 6px,transparent 6px 50px)");
  const ns = E.el(N, "abs", `left:${540 - 381 * .8}px;top:${1330 - 315 * 1.6}px;width:${381 * 1.6}px;height:${315 * 1.6}px`);
  E.img(ns, "nest", `width:${381 * 1.6}px;height:${315 * 1.6}px`);
  E.K(ns, "s", [[NEST, .6], [NEST + .35, 1, "back"]]);
  E.clip(NEST + .1, "sfx/pigeon-flutter.wav", { vol: .6 });
  E.S(NEST + .2, "ding", .7);

  // ================= clock, text =================
  const clock = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:56px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7`, "10:05");
  const mins = t => { const K = [[0, 605], [F3, 605], [F2, 755], [F1, 910], [HOME, 1060], [HOME + .6, 1120]]; let a = K[0], b = K[K.length - 1]; for (let i = 0; i < K.length - 1; i++) if (t >= K[i][0] && t < K[i + 1][0]) { a = K[i]; b = K[i + 1]; } const u = b[0] > a[0] ? Math.min(1, (t - a[0]) / (b[0] - a[0])) : 1; return t >= K[K.length - 1][0] ? 1120 : a[1] + (b[1] - a[1]) * u; };
  E.F(t => { const m = Math.round(mins(t)), s = `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`; if (clock.textContent !== s) clock.textContent = s; clock.style.background = t >= HOME ? C.coralD : C.ink; });
  const bubble = (html, left, top, w, tail, t0, t1, fs = 56) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:20px 28px 24px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]); E.S(t0 + .02, "pop", .5);
    return b;
  };
  bubble("My sock!", 60, 640, 340, 120, FALL + .5, F3 - .1, 64);
  bubble("Come in! Have you eaten?", 520, 440, 520, 300, F3 + 1.05, F2 - .1);
  bubble("Have you seen my baby?", 520, 440, 520, 300, F2 + 1.05, F1 - .1);
  bubble("Just a quick word about the rent…", 480, 440, 560, 320, F1 + 1.05, HOME - .1);
  bubble("…Where's my sock?", 520, 700, 520, 80, HOME + .6, NEST - .05, 60);
  const sb = E.el(S.el, "abs", "left:60px;top:520px;width:960px;display:flex;justify-content:center;z-index:9");
  const st = E.stamp(sb, "FOUND IT.", NEST + .5, { size: 110, rot: -6, bg: C.mint, shake: 12 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "My sock fell to the *neighbours*", { size: 48, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[14.8, 1], [15.05, 1.18, "out"], [15.4, 1, "io"]]);
}
