// EP.63 "Lunch break in Portugal" — 13:00. Otto at his desk with a squashed sandwich: "Just a quick sandwich…" His colleagues freeze,
// scandalised: "Almoças na secretária?!" (you eat lunch at your DESK?!). They drag him to the tasca: "Sopa, prato, sobremesa, café?"
// (soup, main, dessert, coffee?) — the courses land, the clock runs 13:00 → 14:30, colleagues laughing over wine and coffee. 14:35:
// Otto back at his desk, round, blissfully asleep: "Best meeting ever." Voiced (colleague, waiter in Portuguese with subtitles; Otto).
export const meta = {
  id: "ep63-lunchbreak", date: "2026-11-25",
  images: {
    sand: "characters/cutouts/otto-desk_sandwich.webp", zz: "characters/cutouts/otto-desk_asleep.webp",
    shock: "characters/cutouts/colleagues_shock.webp", lunch: "characters/cutouts/colleagues_lunch.webp",
    oh: "characters/cutouts/otto-table_happy.webp", os: "characters/cutouts/otto-table_stuffed.webp", wt: "characters/cutouts/waiter_tray.webp",
    soup: "characters/props/food_soup.webp", bac: "characters/props/food_bacalhau.webp", rice: "characters/props/food_rice.webp", nata: "characters/props/food_natas.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 60, seed: 631, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 17.6, FLOOR = 1760, SH = 2.2, TASCA = 5.4, BACK = 12.8;
  const S = E.scene("lunch", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };
  const fig = (P, n, w, h, s, left, bottom, z = 4) => { const el = E.el(P, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const office = P => {
    E.el(P, "abs", "inset:0;background:#e9eef2");
    E.el(P, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:linear-gradient(90deg,rgba(0,0,0,.035) 3px,transparent 3px);background-size:180px 100%");
    E.el(P, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background:#9aa6b0`);
    const w = E.el(P, "abs", "left:620px;top:470px;width:400px;height:320px;border:14px solid #fff;background:linear-gradient(180deg,#8fd0f5,#dff2fb)"); E.el(w, "abs", "left:180px;top:0;width:10px;height:100%;background:#fff");
    E.el(P, "abs", "left:80px;top:560px;width:120px;height:160px;border-radius:10px;background:#35a06f;box-shadow:inset 0 -20px 0 rgba(0,0,0,.1)");
    E.el(P, "abs", "left:70px;top:720px;width:140px;height:60px;border-radius:6px;background:#c9a878");
  };

  // ================= 1) the desk =================
  const A = layer(0, TASCA); office(A);
  const od = fig(A, "sand", 661, 978, .95, 40, FLOOR + 30, 3);
  const ob = []; for (let t = 0; t < SH; t += .8) ob.push([t, 0, "io"], [t + .4, -6, "io"]);
  E.K(od, "y", ob);                                                                                                     // frame-0 motion
  const cs = fig(A, "shock", 804, 800, .9, 1200, FLOOR + 30, 4);
  E.K(cs, "x", [[SH - .3, 0], [SH, -780, "out"], [TASCA - .8, -780], [TASCA - .2, 300, "in"]]);
  E.K(od, "x", [[TASCA - .8, 0], [TASCA - .2, 900, "in"]]);
  const crumbs = [0, 1, 2].map(i => E.el(A, "abs", `left:${420 + i * 30}px;top:1180px;width:14px;height:10px;border-radius:50%;background:#d9a45c;z-index:5;opacity:0`));
  E.F(t => crumbs.forEach((c, i) => { const u = ((t * 1.5 + i * .3) % 1); c.style.opacity = t < SH ? 1 - u : 0; c.style.transform = `translateY(${u * 200}px)`; }));

  // ================= 2) the tasca =================
  const Bl = layer(TASCA, BACK);
  const tile = `<svg xmlns='http://www.w3.org/2000/svg' width='110' height='110'><rect width='110' height='110' fill='#f7f4ec'/><rect x='2' y='2' width='106' height='106' rx='4' fill='none' stroke='#d6c79a' stroke-width='3'/><circle cx='55' cy='55' r='10' fill='#d8a531'/></svg>`;
  E.el(Bl, "abs", "inset:0;background:#f3e3c3");
  E.el(Bl, "abs", `left:0;top:860px;width:1080px;height:520px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tile)}");background-size:110px 110px`);
  const board = E.el(Bl, "abs", "left:640px;top:470px;width:380px;height:300px;background:#2d3a33;border:12px solid #8a5a2b;border-radius:10px;color:#f4efe2;font-weight:800;font-size:32px;line-height:1.35;padding:16px 22px;box-sizing:border-box;font-family:'Comic Sans MS','Chalkboard SE',cursive");
  E.el(board, "", "font-size:38px;text-align:center", "PRATO DO DIA");
  E.el(board, "", "", "Sopa + prato +"); E.el(board, "", "", "sobremesa + café");
  E.el(board, "", "font-size:30px;color:#f2c230", "(soup, main, dessert, coffee)");
  const col = fig(Bl, "lunch", 995, 726, .72, 360, 1420, 2);
  const lb = []; for (let t = TASCA; t < BACK; t += .7) lb.push([t, 0, "io"], [t + .35, -8, "io"]);
  E.K(col, "y", lb);
  const wt = fig(Bl, "wt", 628, 1050, .7, 780, 1450, 1);
  E.K(wt, "o", [[TASCA + 2.0, 1], [TASCA + 2.2, 0]]);
  E.el(Bl, "abs", "left:0;top:1400px;width:1080px;height:520px;z-index:3;background-color:#fff;background-image:linear-gradient(90deg,rgba(214,58,58,.75) 50%,transparent 50%),linear-gradient(rgba(214,58,58,.75) 50%,transparent 50%);background-size:90px 90px");
  const OT = E.el(Bl, "abs", `left:-20px;top:0;width:1px;height:1px;z-index:5`);
  const t1 = E.img(OT, "oh", `position:absolute;left:0;top:${1960 - 1080 * .78}px;width:${768 * .78}px;height:${1080 * .78}px`);
  const t2 = E.img(OT, "os", `position:absolute;left:0;top:${1960 - 1080 * .78}px;width:${768 * .78}px;height:${1080 * .78}px;opacity:0`);
  E.F(t => { const s = t >= TASCA + 5.2; t1.style.opacity = s ? 0 : 1; t2.style.opacity = s ? 1 : 0; });
  [["soup", 203, 184, 2.4, 520], ["bac", 241, 167, 3.4, 620], ["rice", 238, 155, 3.9, 800], ["nata", 235, 150, 4.6, 560]].forEach(([n, w, h, dt, x]) => {
    const t = TASCA + dt, el = E.el(Bl, "abs", `left:${x}px;top:${1470 - h}px;width:${w}px;height:${h}px;z-index:6;opacity:0`);
    E.img(el, n, `width:${w}px;height:${h}px`);
    E.K(el, "o", [[t - .01, 0], [t, 1], [BACK - .01, 1], [BACK, 0]]); E.K(el, "y", [[t, -600], [t + .22, 0, "in"]]); E.S(t + .22, "thud", .45);
  });
  const cup = E.el(Bl, "abs", "left:860px;top:1380px;width:70px;height:46px;border-radius:0 0 20px 20px;background:#fff;border:5px solid #6b3f1d;z-index:6;opacity:0");
  E.K(cup, "o", [[TASCA + 5.4, 0], [TASCA + 5.41, 1]]); E.K(cup, "y", [[TASCA + 5.4, -500], [TASCA + 5.6, 0, "in"]]);

  // ================= 3) back at the desk =================
  const Cl = layer(BACK, DUR); office(Cl);
  const oz = fig(Cl, "zz", 851, 941, .95, 60, FLOOR + 30, 3);
  const br = []; for (let t = BACK; t < DUR; t += 1.2) br.push([t, 1, "io"], [t + .6, 1.02, "io"]);
  E.K(oz, "sy", br);

  // ================= HUD =================
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:52px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  const mins = t => t < TASCA ? 780 + t * .6 : t < BACK ? 783 + (t - TASCA) / (BACK - TASCA) * 87 : 875;
  E.F(t => { const m = Math.floor(mins(t)), s = `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")} · LUNCH`; if (pill.textContent !== s) pill.textContent = s; pill.style.background = t < TASCA ? C.ink : t < BACK ? "#1f7a3a" : C.coralD; });
  const bd = E.el(S.el, "abs", "left:600px;top:352px;background:#fff;border-radius:14px;padding:4px 14px;font-weight:900;font-size:34px;color:#1d2b36;z-index:9;box-shadow:0 6px 14px rgba(0,0,0,.15)", "");
  E.F(t => { const s = t < TASCA ? "5 min, at the desk" : t < BACK ? "1 h 30, at the tasca" : "productivity: ?"; if (bd.textContent !== s) bd.textContent = s; });

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1b, fs = 50) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1b - .12, 1], [t1b, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble("Just a quick sandwich…", 40, 720, 480, 200, .4, SH - .05, 50);
  bubble(`Almoças na secretária?!${sub("(You eat lunch at your DESK?!)")}`, 440, 700, 600, 300, SH + .3, TASCA - .1, 48);
  bubble(`Sopa, prato, sobremesa, café?${sub("(Soup, main, dessert, coffee?)")}`, 380, 820, 640, 460, TASCA + .2, TASCA + 2.2, 46);
  bubble("Mais um vinhinho?", 560, 900, 420, 150, TASCA + 4.2, TASCA + 5.6, 48);
  bubble("Best meeting ever.", 60, 700, 440, 200, BACK + .4, DUR - .4, 52);
  const sb = E.el(S.el, "abs", "left:60px;top:1560px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "LUNCH IS SACRED.", BACK + 2.6, { size: 100, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/office.wav", { vol: 3, duck: false, to: TASCA });
  E.clip(.4, "voices/ep63/o_sandwich.wav", { vol: 1.15 });
  E.S(SH, "scratch", .9); E.clip(SH + .3, "voices/ep63/m_secretaria.wav", { vol: 1.2 });
  E.S(TASCA - .7, "whoosh", .7);
  E.clip(TASCA, "sfx/restaurant.wav", { vol: .45, duck: false }); E.clip(TASCA + 4.9, "sfx/restaurant.wav", { vol: .45, duck: false, to: BACK - TASCA - 4.9 });
  E.clip(TASCA + .2, "voices/ep63/w_sopa.wav", { vol: 1.15 });
  E.clip(TASCA + 4.2, "sfx/glass-clink.wav", { vol: 1.2 });
  E.clip(TASCA + 5.4, "sfx/cup-drop.wav", { vol: .3, to: .4 });
  E.S(BACK, "whoosh", .5); E.clip(BACK, "sfx/office.wav", { vol: 3, duck: false, to: DUR - BACK });
  E.clip(BACK + .2, "sfx/snore.wav", { vol: .5 });
  E.clip(BACK + .4, "voices/ep63/o_best.wav", { vol: 1.15 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "Lunch break in *Portugal*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[16.8, 1], [17.05, 1.18, "out"], [17.4, 1, "io"]]);
}
