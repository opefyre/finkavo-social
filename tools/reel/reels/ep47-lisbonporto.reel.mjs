// EP.47 "Lisbon vs Porto" — split screen, LISBOA above, PORTO below, one bar each. In Porto, Otto proudly orders "Uma imperial,
// por favor!" — record scratch, the barman: "…Um FINO?" In Lisbon he tries "Um fino, por favor!" — "…Uma IMPERIAL?" Then coffee:
// "bica" in Porto ("…Um CIMBALINO?"), "cimbalino" in Lisbon ("…Uma BICA?"). A STARES scoreboard ticks 2–2. Coimbra, halfway: Otto
// just points at the tap, thumbs up. Voiced (Otto's accented Portuguese, a Lisbon and a Porto barman) with bar effects.
export const meta = {
  id: "ep47-lisbonporto", date: "2026-11-09",
  images: {
    of: "characters/cutouts/otto-casual_fast.webp", oa: "characters/cutouts/otto-casual_awkward.webp",
    ls: "characters/cutouts/barman_smile.webp", lt: "characters/cutouts/barman_stare.webp",
    pn: "characters/cutouts/portobar_neutral.webp", pt: "characters/cutouts/portobar_stare.webp",
    wt: "characters/cutouts/waiter_tray.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 57, seed: 471, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 17.4, MID = 1170, COI = 14.6;
  const S = E.scene("bars", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  // [city, time Otto orders, order clip, barman clip, barman line, order text, answer, drink]
  const R = [["P", .6, "o_imperial", 2.9, "p_fino", "Uma imperial, por favor!", "…Um FINO?", "beer"], ["L", 4.4, "o_fino", 6.3, "l_imperial", "Um fino, por favor!", "…Uma IMPERIAL?", "beer"],
    ["P", 7.9, "o_bica", 9.7, "p_cimbalino", "Uma bica, por favor!", "…Um CIMBALINO?", "coffee"], ["L", 11.1, "o_cimbalino", 13.2, "l_bica", "Um cimbalino, por favor!", "…Uma BICA?", "coffee"]];
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };

  const SPL = layer(0, COI);
  const half = (top, h, city) => {
    const P = E.el(SPL, "abs", `left:0;top:${top}px;width:1080px;height:${h}px;overflow:hidden`);
    const tile = city === "L"
      ? `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='#f7f3ea'/><rect x='2' y='2' width='76' height='76' rx='3' fill='none' stroke='#9fc0e0' stroke-width='3'/><circle cx='40' cy='40' r='12' fill='none' stroke='#2f6db5' stroke-width='5'/><circle cx='40' cy='40' r='4' fill='#f2b632'/></svg>`
      : `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='#eef3fb'/><rect x='2' y='2' width='76' height='76' rx='3' fill='none' stroke='#1f4e9c' stroke-width='3'/><path d='M40 10 L70 40 L40 70 L10 40Z' fill='none' stroke='#1f4e9c' stroke-width='5'/><circle cx='40' cy='40' r='6' fill='#1f4e9c'/></svg>`;
    E.el(P, "abs", `inset:0;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tile)}");background-size:80px 80px`);
    const bn = city === "L" ? ["ls", "lt", 856, 993, .52] : ["pn", "pt", 799, 948, .52];
    const bw = E.el(P, "abs", `left:560px;top:${h - 170 - bn[3] * bn[4] + 70}px;width:${bn[2] * bn[4]}px;height:${bn[3] * bn[4]}px`);
    const b1 = E.img(bw, bn[0], `position:absolute;left:0;top:0;width:${bn[2] * bn[4]}px;height:${bn[3] * bn[4]}px`);
    const b2 = E.img(bw, bn[1], `position:absolute;left:0;top:0;width:${bn[2] * bn[4]}px;height:${bn[3] * bn[4]}px;opacity:0`);
    E.el(P, "abs", `left:0;top:${h - 170}px;width:1080px;height:170px;background:${city === "L" ? "#6a3e1e" : "#3b2a20"}`);
    E.el(P, "abs", `left:0;top:${h - 170}px;width:1080px;height:22px;background:${city === "L" ? "#a8764c" : "#7a5a3a"}`);
    const OS = .56, ow = E.el(P, "abs", `left:40px;top:${h - 1052 * OS + 40}px;width:${545 * OS}px;height:${1052 * OS}px;z-index:2;transform-origin:50% 100%`);
    const o1 = E.img(ow, "of", `position:absolute;left:0;bottom:0;width:${545 * OS}px;height:${1052 * OS}px`);
    const o2 = E.img(ow, "oa", `position:absolute;left:${(545 - 488) * OS / 2}px;bottom:0;width:${488 * OS}px;height:${1078 * OS}px;opacity:0`);
    E.el(P, "abs", `left:${city === "L" ? 40 : 40}px;top:${city === "L" ? 360 : 24}px;background:${city === "L" ? "#1d2b36" : "#1f4e9c"};color:#fff;font-weight:900;font-size:40px;padding:4px 18px;border-radius:12px;z-index:3`, city === "L" ? "LISBOA" : "PORTO");
    const dim = E.el(P, "abs", "inset:0;background:#10202c;opacity:0;z-index:4");
    return { P, b1, b2, o1, o2, ow, dim, h };
  };
  const L = half(0, MID, "L"), Pt = half(MID, 1920 - MID, "P");
  const H = { L, P: Pt };
  E.el(SPL, "abs", `left:0;top:${MID - 6}px;width:1080px;height:12px;background:#fff;z-index:5`);

  // who is active, faces, dimming
  E.F(t => {
    let act = "P"; for (const r of R) if (t >= r[1] - .3) act = r[0];
    for (const k of ["L", "P"]) {
      const h = H[k], mine = R.filter(r => r[0] === k);
      let stare = false, awk = false; for (const r of mine) { if (t >= r[3] - .4 && t < r[3] + 1.4) stare = true; if (t >= r[3] - .4) awk = true; }
      const cur = mine.filter(r => t >= r[1] - .3).pop(); if (cur && t < cur[3] - .4) awk = false;
      h.b1.style.opacity = stare ? 0 : 1; h.b2.style.opacity = stare ? 1 : 0;
      h.o1.style.opacity = awk ? 0 : 1; h.o2.style.opacity = awk ? 1 : 0;
      h.dim.style.opacity = t > .4 && act !== k ? .42 : 0;
    }
  });
  const bobL = [], bobP = []; for (let t = 0; t < COI; t += .8) { bobL.push([t, 0, "io"], [t + .4, -6, "io"]); bobP.push([t + .4, 0, "io"], [t + .8, -6, "io"]); }
  E.K(L.ow, "y", bobL); E.K(Pt.ow, "y", bobP);                                                                   // frame-0 motion

  // drinks slide in with their local name
  R.forEach(([k, t0, , t1, , , ans, d], i) => {
    const h = H[k], x = d === "beer" ? 420 : 470, y = h.h - 170;
    const g = E.el(h.P, "abs", `left:${x}px;top:${y - (d === "beer" ? 120 : 60)}px;z-index:3;opacity:0`);
    if (d === "beer") E.el(g, "", "width:74px;height:120px;border-radius:6px 6px 16px 16px;background:linear-gradient(180deg,#fff 0 20%,#f2b632 20%);border:4px solid rgba(255,255,255,.85)");
    else { E.el(g, "", "width:86px;height:56px;border-radius:0 0 26px 26px;background:#fff;border:5px solid #6b3f1d;position:relative"); }
    const tg = E.el(h.P, "abs", `left:${x - 30}px;top:${y - (d === "beer" ? 190 : 130)}px;background:#fff;border-radius:10px;padding:2px 12px;font-weight:900;font-size:30px;color:${C.ink};box-shadow:0 4px 10px rgba(0,0,0,.15);z-index:3;opacity:0;white-space:nowrap`, ans.replace("…", "").replace("?", "").replace("Uma ", "").replace("Um ", ""));
    const ta = t1 + 1.0; [g, tg].forEach(el => E.K(el, "o", [[ta - .01, 0], [ta, 1]])); E.K(g, "x", [[ta, 300], [ta + .25, 0, "out"]]);
    E.clip(ta, "sfx/plate-down.wav", { vol: .5 });
  });

  // scoreboard on the divider
  const sc = E.el(SPL, "abs", `left:340px;top:${MID - 44}px;width:400px;height:88px;background:${C.ink};border-radius:44px;z-index:6;display:flex;align-items:center;justify-content:center;gap:14px;color:#fff;font-weight:900;font-size:38px;border:5px solid #fff`);
  const sL = E.el(sc, "", "", "LX 0"), sM = E.el(sc, "", "font-size:26px;color:#9fb0bd", "STARES"), sP = E.el(sc, "", "", "0 PT");
  E.F(t => { let l = 0, p = 0; for (const r of R) if (t >= r[3]) r[0] === "L" ? l++ : p++; const a = `LX ${l}`, b = `${p} PT`; if (sL.textContent !== a) sL.textContent = a; if (sP.textContent !== b) sP.textContent = b; });
  R.forEach(r => E.K(sc, "s", [[r[3] - .01, 1], [r[3], 1.18], [r[3] + .25, 1, "out"]]));

  // bubbles
  const bubble = (html, left, top, w, tail, t0, t1, fs = 50) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:9;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  R.forEach(([k, t0, , t1, , ord, ans], i) => {
    const top = k === "L" ? 470 : MID + 70, atop = k === "L" ? 400 : MID + 34;
    bubble(ord, 60, top, 470, 120, t0, t1 - .1, 46);
    bubble(ans, 560, atop, 440, 230, t1, (R[i + 1] ? R[i + 1][1] : COI) - .1, 50);
  });

  // ================= Coimbra: just point =================
  const Cm = layer(COI, DUR);
  E.el(Cm, "abs", "inset:0;background:linear-gradient(180deg,#f3e6c9,#ecd9b0)");
  E.el(Cm, "abs", "left:40px;top:430px;background:#7a2a3a;color:#fff;font-weight:900;font-size:40px;padding:4px 18px;border-radius:12px", "COIMBRA · HALFWAY");
  const tap = E.el(Cm, "abs", "left:470px;top:1120px;width:140px;height:260px");
  E.el(tap, "abs", "left:50px;top:0;width:40px;height:190px;border-radius:12px;background:linear-gradient(90deg,#c8ccd1,#8b939b)");
  E.el(tap, "abs", "left:30px;top:-60px;width:80px;height:70px;border-radius:16px;background:#e5484d");
  E.el(Cm, "abs", "left:0;top:1380px;width:1080px;height:540px;background:#6a3e1e"); E.el(Cm, "abs", "left:0;top:1380px;width:1080px;height:26px;background:#a8764c");
  const cw = E.el(Cm, "abs", `left:600px;top:${1400 - 1050 * .7}px;width:${628 * .7}px;height:${1050 * .7}px`);
  E.img(cw, "wt", `width:${628 * .7}px;height:${1050 * .7}px`);
  const co = E.el(Cm, "abs", `left:40px;top:${1700 - 1052 * .78}px;width:${545 * .78}px;height:${1052 * .78}px;z-index:2`);
  E.img(co, "of", `width:${545 * .78}px;height:${1052 * .78}px`);
  E.K(co, "x", [[COI, -400], [COI + .35, 0, "out"]]);
  const ok = E.el(Cm, "abs", "left:410px;top:880px;width:130px;height:130px;border-radius:50%;background:#1f7a3a;color:#fff;font-weight:900;font-size:84px;display:flex;align-items:center;justify-content:center;opacity:0", "✓");
  E.pop(ok, COI + .9, { from: .3, dur: .3 });
  const sb = E.el(S.el, "abs", "left:60px;top:1520px;width:960px;display:flex;justify-content:center;z-index:10");
  const st = E.stamp(sb, "JUST POINT.", COI + 1.4, { size: 110, rot: -6, bg: C.mint, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/cafe-morning.wav", { vol: .28, duck: false }); E.clip(2.9, "sfx/cafe-morning.wav", { vol: .28, duck: false });
  E.clip(5.8, "sfx/cafe-morning.wav", { vol: .28, duck: false }); E.clip(8.7, "sfx/cafe-morning.wav", { vol: .28, duck: false }); E.clip(11.6, "sfx/cafe-morning.wav", { vol: .28, duck: false, to: COI - 11.6 });
  R.forEach(([k, t0, oc, t1, bc]) => { E.clip(t0, `voices/ep47/${oc}.wav`, { vol: 1.15 }); E.S(t1 - .35, "scratch", .8); E.clip(t1, `voices/ep47/${bc}.wav`, { vol: 1.2 }); });
  E.S(COI, "whoosh", .6); E.S(COI + .9, "ding", .8); E.clip(COI + .3, "sfx/cafe-morning.wav", { vol: .25, duck: false, to: DUR - COI - .3 });

  // ---------------- title (frame 0) ----------------
  const tb = E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(246,239,226,.95);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:6");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Ordering in *Lisbon* vs *Porto*", { size: 50, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[16.6, 1], [16.85, 1.18, "out"], [17.2, 1, "io"]]);
}
