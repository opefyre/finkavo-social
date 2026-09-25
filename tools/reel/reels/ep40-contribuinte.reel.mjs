// EP.40 "Contribuinte?" — in Portugal every till asks for your tax number (NIF). Café, €0.80: "Contribuinte?" Otto digs through his
// wallet and reads it off the card, digit by digit (NIF TIME: 12.4 s). Pharmacy: faster (2.0 s). Supermarket: he fires it off
// before she finishes asking (0.9 s). Then, at a bar, a woman smiles: "So… can I get your number?" Reflex: "123-456-789!"
// "…Is that your tax number?" Voiced (ElevenLabs: three cashiers in Portuguese, Otto, the woman) with shop/bar ambience.
export const meta = {
  id: "ep40-contribuinte", date: "2026-11-02",
  images: {
    o_ex: "characters/cutouts/otto-casual_excited.webp", o_wal: "characters/cutouts/otto-casual_wallet.webp", o_card: "characters/cutouts/otto-casual_card.webp",
    o_fast: "characters/cutouts/otto-casual_fast.webp", o_beer: "characters/cutouts/otto-casual_beer.webp", o_frz: "characters/cutouts/otto-casual_beer-frozen.webp",
    bSmile: "characters/cutouts/barman_smile.webp", bStare: "characters/cutouts/barman_stare.webp",
    ph: "characters/cutouts/pharmacist_polite.webp", cash: "characters/cutouts/cashier_ask.webp",
    w_ask: "characters/cutouts/woman_ask.webp", w_meh: "characters/cutouts/woman_meh.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 60, seed: 401, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 17.6;
  const S = E.scene("shops", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const PH = 5.0, SU = 8.2, BAR = 10.3;
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };
  const img = (L, n, w, h, s, left, top, z = 1) => { const el = E.el(L, "abs", `left:${left}px;top:${top}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  // Otto standing in front of a counter, feet at 1900; faces swap in place
  const otto = (L, faces, s = .86) => {
    const W = 636 * s, H = 1052 * s, w = E.el(L, "abs", `left:20px;top:${1900 - H}px;width:${W}px;height:${H}px;z-index:4;transform-origin:50% 100%`);
    const ims = faces.map(([n, iw, ih]) => E.img(w, n, `position:absolute;left:${(636 - iw) * s / 2}px;bottom:0;width:${iw * s}px;height:${ih * s}px`));
    return { w, set: f => ims.forEach((x, i) => { x.style.opacity = faces[i][0] === f ? 1 : 0; }) };
  };
  const counter = (L, top, col, edge) => { E.el(L, "abs", `left:0;top:${top}px;width:1080px;height:${1920 - top}px;background:${col};z-index:3`); E.el(L, "abs", `left:0;top:${top}px;width:1080px;height:30px;background:${edge};z-index:3`); };

  // ================= 1) the café =================
  const A = layer(0, PH);
  const tileSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#f8f5ee'/><rect x='2' y='2' width='116' height='116' rx='5' fill='none' stroke='#c9d8ea' stroke-width='3'/><g fill='#2f6db5'><circle cx='60' cy='60' r='9'/><ellipse cx='60' cy='36' rx='8' ry='15'/><ellipse cx='60' cy='84' rx='8' ry='15'/><ellipse cx='36' cy='60' rx='15' ry='8'/><ellipse cx='84' cy='60' rx='15' ry='8'/></g></svg>`;
  E.el(A, "abs", "inset:0;background:#efe0c7");
  E.el(A, "abs", `left:0;top:900px;width:1080px;height:560px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tileSvg)}");background-size:120px 120px`);
  const m = E.el(A, "abs", "left:60px;top:680px;width:300px;height:220px;border-radius:24px 24px 8px 8px;background:linear-gradient(180deg,#d9dde1,#9aa3ab)");
  for (let i = 0; i < 2; i++) E.el(m, "abs", `left:${60 + i * 140}px;top:140px;width:40px;height:60px;background:#444;border-radius:0 0 8px 8px`);
  const bm = img(A, "bSmile", 856, 993, .72, 440, 1440 - 993 * .72 * .92, 1);
  const bs = img(A, "bStare", 856, 993, .72, 440, 1440 - 993 * .72 * .92, 1); bs.style.opacity = 0;
  E.F(t => { const st = t >= 3.2; bm.style.opacity = st ? 0 : 1; bs.style.opacity = st ? 1 : 0; });
  counter(A, 1420, "#6a3e1e", "#a8764c");
  E.el(A, "abs", "left:560px;top:1386px;width:64px;height:40px;border-radius:0 0 18px 18px;background:#fff;border:5px solid #6b3f1d;z-index:3");
  const oA = otto(A, [["o_ex", 625, 1078], ["o_wal", 636, 1039], ["o_card", 428, 1031]]);
  E.F(t => oA.set(at([[0, "o_ex"], [1.1, "o_wal"], [1.85, "o_card"]], t)));
  const bob = []; for (let t = 0; t < PH; t += .8) bob.push([t, 0, "io"], [t + .4, -8, "io"]);
  E.K(oA.w, "y", bob);                                                                         // frame-0 motion
  for (let i = 0; i < 4; i++) {                                                                 // cards fly out of the wallet
    const t = 1.12 + i * .08, c = E.el(A, "abs", `left:${280 + i * 30}px;top:1330px;width:86px;height:56px;border-radius:8px;background:${["#2f6db5", "#e5484d", "#f2b632", "#9aa3ab"][i]};border:3px solid #fff;z-index:5;opacity:0`);
    E.K(c, "o", [[t - .01, 0], [t, 1]]); E.K(c, "x", [[t, 0], [t + .5, (i - 1.5) * 160, "out"]]); E.K(c, "y", [[t, 0], [t + .25, -140, "out"], [t + .7, 540, "in"]]); E.K(c, "r", [[t, 0], [t + .7, (i % 2 ? 1 : -1) * 280]]);
  }

  // ================= 2) the pharmacy =================
  const B = layer(PH, SU);
  E.el(B, "abs", "inset:0;background:#e4f3ee");
  for (let r = 0; r < 3; r++) {                                                                 // shelves of boxes
    E.el(B, "abs", `left:0;top:${700 + r * 200}px;width:1080px;height:18px;background:#c9ddd6`);
    for (let k = 0; k < 9; k++) E.el(B, "abs", `left:${30 + k * 118}px;top:${700 + r * 200 - 110 - (k % 3) * 14}px;width:${90 - (k % 2) * 16}px;height:${110 + (k % 3) * 14}px;border-radius:6px;background:${["#fff", "#f7c6c6", "#cfe3ff", "#fff1b8", "#d9f2e4"][(k + r) % 5]};border:3px solid #b8cbc4`);
  }
  const gx = E.el(B, "abs", "left:880px;top:470px;width:120px;height:120px;background:#2f9e6f;border-radius:20px;opacity:.95");
  E.el(gx, "abs", "left:45px;top:16px;width:30px;height:88px;background:#fff;border-radius:6px"); E.el(gx, "abs", "left:16px;top:45px;width:88px;height:30px;background:#fff;border-radius:6px");
  img(B, "ph", 507, 1100, .8, 560, 1720 - 1100 * .8, 1);
  counter(B, 1420, "#f4f7f6", "#cfdcd7");
  E.el(B, "abs", "left:640px;top:1320px;width:150px;height:100px;background:#fff;border:4px solid #b8cbc4;border-radius:10px;z-index:3");
  const oB = otto(B, [["o_card", 428, 1031], ["o_fast", 545, 1052]]);
  E.F(t => oB.set(at([[0, "o_card"], [PH + .95, "o_fast"]], t)));
  E.K(oB.w, "x", [[PH, -500], [PH + .3, 0, "out"]]);

  // ================= 3) the supermarket =================
  const Cc = layer(SU, BAR);
  E.el(Cc, "abs", "inset:0;background:#fdf6e9");
  for (let r = 0; r < 3; r++) {
    E.el(Cc, "abs", `left:0;top:${720 + r * 190}px;width:1080px;height:16px;background:#d8c9ae`);
    for (let k = 0; k < 14; k++) E.el(Cc, "abs", `left:${10 + k * 76}px;top:${720 + r * 190 - 90 - (k % 4) * 10}px;width:58px;height:${90 + (k % 4) * 10}px;border-radius:${k % 3 ? 6 : 20}px ${k % 3 ? 6 : 20}px 4px 4px;background:${["#e5484d", "#f2b632", "#2f6db5", "#35a06f", "#ff8a3d", "#9b59b6"][(k + r * 2) % 6]}`);
  }
  img(Cc, "cash", 522, 1057, .82, 560, 1720 - 1057 * .82, 1);
  counter(Cc, 1420, "#3d4650", "#6b7682");
  E.el(Cc, "abs", "left:0;top:1450px;width:1080px;height:40px;background:repeating-linear-gradient(90deg,#222 0 40px,#2d2d2d 40px 80px);z-index:3");
  const gum = E.el(Cc, "abs", "left:420px;top:1396px;width:90px;height:46px;border-radius:8px;background:#35d07f;border:4px solid #fff;z-index:3");
  E.K(gum, "x", [[SU, 300], [SU + .8, 0, "out"]]);
  const oC = otto(Cc, [["o_fast", 545, 1052]]); oC.set("o_fast");
  E.K(oC.w, "x", [[SU, -500], [SU + .25, 0, "out"]]);

  // ================= 4) the bar =================
  const D = layer(BAR, DUR);
  E.el(D, "abs", "inset:0;background:linear-gradient(180deg,#2b1d33,#4a2a3a)");
  E.el(D, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:#f6efe2;box-shadow:0 8px 20px rgba(0,0,0,.3);z-index:6");   // the title stays readable at night
  for (let i = 0; i < 14; i++) E.el(D, "abs", `left:${(i * 173) % 1040}px;top:${480 + (i * 97) % 420}px;width:${60 + (i % 4) * 30}px;height:${60 + (i % 4) * 30}px;border-radius:50%;background:radial-gradient(circle,rgba(255,${190 + (i % 3) * 20},120,.45),transparent 70%)`);
  for (let r = 0; r < 2; r++) {
    E.el(D, "abs", `left:0;top:${900 + r * 170}px;width:1080px;height:14px;background:#6b4632`);
    for (let k = 0; k < 16; k++) { const hgt = 90 + (k % 3) * 22; E.el(D, "abs", `left:${16 + k * 67}px;top:${900 + r * 170 - hgt}px;width:34px;height:${hgt}px;border-radius:14px 14px 4px 4px;background:${["#3f8f5a", "#b5482d", "#d9a441", "#7fb0d6", "#8a3d6b"][(k + r) % 5]};opacity:.9`); }
  }
  E.el(D, "abs", "left:0;top:1360px;width:1080px;height:560px;background:#5a3522");
  E.el(D, "abs", "left:0;top:1360px;width:1080px;height:26px;background:#8a5a3a");
  const wm = E.el(D, "abs", `left:640px;top:${1900 - 1088 * .86}px;width:${413 * .86}px;height:${1088 * .86}px;z-index:4;transform-origin:50% 100%`);
  const w1 = E.img(wm, "w_ask", `position:absolute;left:0;bottom:0;width:${413 * .86}px;height:${1088 * .86}px`);
  const w2 = E.img(wm, "w_meh", `position:absolute;left:0;bottom:0;width:${413 * .86}px;height:${1088 * .86}px`);
  const oD = otto(D, [["o_beer", 456, 1050], ["o_frz", 456, 1050]]);
  E.F(t => { const meh = t >= BAR + 4.6; w1.style.opacity = meh ? 0 : 1; w2.style.opacity = meh ? 1 : 0; oD.set(t >= BAR + 4.7 ? "o_frz" : "o_beer"); });
  E.K(oD.w, "x", [[BAR, 60], [BAR + .01, 60]]);
  const sway = []; for (let t = BAR; t < DUR; t += 1.2) sway.push([t, 0, "io"], [t + .6, 2, "io"]);
  E.K(wm, "r", sway);

  // ================= labels: the shop, the NIF timer =================
  const tag = E.el(S.el, "abs", "right:50px;top:470px;height:80px;display:flex;align-items:center;background:#fff;border-radius:22px;padding:0 26px;box-shadow:0 8px 20px rgba(0,0,0,.14);z-index:7;white-space:nowrap;font-weight:900;font-size:40px", "");
  const TAG = [[0, "Café · €0.80"], [PH, "Pharmacy · €4.95"], [SU, "Supermarket · €0.99"], [BAR, "Bar · 23:40"]];
  E.F(t => { const s = at(TAG, t); if (tag.textContent !== s) tag.textContent = s; tag.style.color = C.ink; });
  [PH, SU, BAR].forEach(t => E.K(tag, "x", [[t - .01, 0], [t, 400], [t + .3, 0, "out"]]));
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:52px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7`, "");
  // the timer runs while Otto answers, then freezes on his time
  const RUNS = [[1.0, 4.95, 12.4], [PH + 1.0, PH + 3.0, 2.0], [SU + .45, SU + 1.6, .9]];
  E.F(t => {
    let s = "NIF TIME: 0.0 s", col = C.ink;
    for (const [a, b, v] of RUNS) if (t >= a) { const u = Math.min(1, (t - a) / (b - a)); s = `NIF TIME: ${(u * v).toFixed(1)} s`; col = u >= 1 ? (v < 1 ? "#1f7a3a" : v < 5 ? "#c77d12" : C.coralD) : C.ink; }
    if (t >= BAR) { s = "NIF: MEMORISED ✓"; col = "#1f7a3a"; }
    if (pill.textContent !== s) pill.textContent = s; pill.style.background = col;
  });

  // ================= bubbles =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 58) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:20px 28px 24px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:32px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble(`Contribuinte?${sub("(Tax number?)")}`, 560, 600, 440, 250, .35, 1.9, 62);
  bubble("Uh… one… two…", 40, 740, 460, 200, 1.95, PH - .05, 54);
  bubble(`Contribuinte?`, 580, 640, 420, 230, PH + .2, PH + 1.2, 62);
  bubble("123, 456, 789.", 40, 760, 440, 200, PH + 1.05, SU - .05, 58);
  bubble(`<span style="white-space:nowrap">Contri—</span>`, 600, 640, 360, 170, SU + .2, SU + .9, 62);
  bubble("123456789!", 40, 760, 400, 200, SU + .45, BAR - .05, 64);
  bubble("So… can I get your number?", 520, 560, 520, 300, BAR + .4, BAR + 3.0, 54);
  bubble("123456789!", 40, 740, 400, 200, BAR + 3.05, BAR + 4.5, 64);
  bubble("…Is that your tax number?", 520, 560, 520, 300, BAR + 4.6, DUR - .5, 54);

  // ================= stamp =================
  const sb = E.el(S.el, "abs", "left:60px;top:1250px;width:960px;display:flex;justify-content:center;z-index:9");
  const st = E.stamp(sb, "WRONG NUMBER.", BAR + 5.9, { size: 100, rot: -6, bg: C.coralD, shake: 12 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/cafe-morning.wav", { vol: .3, duck: false }); E.clip(2.9, "sfx/cafe-morning.wav", { vol: .3, duck: false, to: PH - 2.9 });
  E.clip(.35, "voices/ep40/c_cafe.wav", { vol: 1.15 });
  E.clip(1.1, "sfx/cards-spill.wav", { vol: 2.2 });
  E.clip(1.95, "voices/ep40/o_slow.wav", { vol: 1.15 });
  E.S(PH, "whoosh", .5);
  E.clip(PH + .2, "voices/ep40/c_pharm.wav", { vol: 1.15 });
  E.clip(PH + 1.05, "voices/ep40/o_mid2.wav", { vol: 1.15 });
  E.clip(PH + 3.05, "sfx/pharmacy-beep.wav", { vol: .4, to: .4 });
  E.S(SU, "whoosh", .5); E.S(SU + .9, "tick", .6);
  E.clip(SU + .2, "voices/ep40/c_super.wav", { vol: 1.1, to: .45, gain: [[SU + .2, 1], [SU + .6, 1], [SU + .65, 0]] });
  E.clip(SU + .45, "voices/ep40/o_fast2.wav", { vol: 1.2 });
  E.S(SU + 1.8, "ding", .6);
  E.clip(BAR, "sfx/bar-night.wav", { vol: .35, duck: false });
  E.clip(BAR + 5, "sfx/bar-night.wav", { vol: .35, duck: false, to: DUR - BAR - 5 });
  E.clip(BAR + .4, "voices/ep40/w_number.wav", { vol: 1.1 });
  E.clip(BAR + 3.05, "voices/ep40/o_fast2.wav", { vol: 1.2 });
  E.clip(BAR + 4.6, "voices/ep40/w_tax.wav", { vol: 1.1 });
  E.S(BAR + 4.7, "scratch", .8);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Buying *anything* in Portugal", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[16.8, 1], [17.05, 1.18, "out"], [17.4, 1, "io"]]);
}
