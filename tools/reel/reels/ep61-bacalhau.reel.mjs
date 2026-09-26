// EP.61 "Christmas bacalhau" — 21 December. Grandma rings, holding a giant dried salt cod like a plank: "Para a Consoada!" (for
// Christmas Eve!) "…It's a plank." She fills Otto's bathtub and drops it in: "Três dias de molho!" (three days soaking!). Otto in his
// bathrobe: "There's a fish in my bath." DAY 1 → DAY 3: water changes, Otto brushing his teeth next to it, side-eyeing the fish.
// 24 December, the Consoada table: bacalhau, potatoes, greens — Otto: "Mais um bocadinho?" (one more little bit?). Voiced + water.
export const meta = {
  id: "ep61-bacalhau", date: "2026-11-23",
  images: {
    ex: "characters/cutouts/otto-casual_excited.webp", awk: "characters/cutouts/otto-casual_awkward.webp",
    gb: "characters/cutouts/dona_bacalhau.webp", gk: "characters/cutouts/dona_knowing.webp", gs: "characters/cutouts/dona_smirk.webp",
    rs: "characters/cutouts/otto-robe_shock.webp", rb: "characters/cutouts/otto-robe_brush.webp",
    cod: "characters/props/bacalhau-dry.webp", dish: "characters/props/food_bacalhau.webp", oh: "characters/cutouts/otto-table_happy.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 62, seed: 611, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 18.0, FLOOR = 1740, B = 4.8, D2 = 9.4, D3 = 11.0, EVE = 12.8;
  const S = E.scene("bacalhau", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };
  const fig = (P, n, w, h, s, left, bottom, z = 4) => { const el = E.el(P, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const swap = (P, faces, left, bottom, s, z = 4) => { const w = E.el(P, "abs", `left:${left}px;top:0;width:1px;height:1px;z-index:${z}`); const ims = faces.map(([n, iw, ih]) => [n, E.img(w, n, `position:absolute;left:0;top:${bottom - ih * s}px;width:${iw * s}px;height:${ih * s}px;opacity:0`)]); return { w, set: f => ims.forEach(([n, el]) => { el.style.opacity = n === f ? 1 : 0; }) }; };

  // ================= A) the front door =================
  const A = layer(0, B);
  E.el(A, "abs", "inset:0;background:#f1e2c6");
  E.el(A, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background:repeating-linear-gradient(90deg,#b98a5e 0 160px,#a97c52 160px 320px)`);
  E.el(A, "abs", `left:560px;top:760px;width:420px;height:${FLOOR - 760}px;background:#3b2412;border-radius:10px 10px 0 0`);
  const door = E.el(A, "abs", `left:574px;top:774px;width:392px;height:${FLOOR - 774}px;background:#8a5a2b;transform-origin:100% 50%`);
  E.K(door, "sx", [[.4, 1], [.7, .06, "out"]]);
  const wreath = E.el(A, "abs", "left:700px;top:880px;width:140px;height:140px;border-radius:50%;border:26px solid #2f7a3a;box-sizing:border-box");
  E.K(wreath, "o", [[.4, 1], [.5, 0]]);
  const OA = swap(A, [["ex", 625, 1078], ["awk", 488, 1078]], -20, FLOOR + 40, .8);
  E.F(t => OA.set(t < 2.9 ? "ex" : "awk"));
  const ob = []; for (let t = 0; t < 1.2; t += .6) ob.push([t, 0, "io"], [t + .3, -8, "io"]);
  E.K(OA.w, "y", ob);                                                                                                   // frame-0 motion
  const gr = fig(A, "gb", 613, 1101, .82, 560, FLOOR + 40, 3);
  E.K(gr, "o", [[.6, 0], [.61, 1]]); E.K(gr, "x", [[.6, 300], [1.0, 0, "out"]]);

  // ================= B) the bathroom =================
  const Bl = layer(B, EVE);
  E.el(Bl, "abs", "inset:0;background:#e3f1f4");
  E.el(Bl, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:linear-gradient(#c7dfe5 3px,transparent 3px),linear-gradient(90deg,#c7dfe5 3px,transparent 3px);background-size:90px 90px");
  E.el(Bl, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background:#9fb7bf`);
  const mir = E.el(Bl, "abs", "left:80px;top:600px;width:240px;height:300px;border-radius:120px 120px 20px 20px;border:12px solid #fff;background:linear-gradient(135deg,#dbe9f0,#f4fafc)");
  const tub = E.el(Bl, "abs", `left:360px;top:1340px;width:700px;height:360px;z-index:3`);
  const water = E.el(tub, "abs", "left:30px;bottom:30px;width:640px;height:0;background:linear-gradient(180deg,#9fd6f2,#5fb3dd);border-radius:0 0 120px 120px;z-index:1");
  const codEl = E.el(tub, "abs", `left:100px;top:40px;width:${300 * 1.7}px;height:${176 * 1.7}px;z-index:2;opacity:0;transform:rotate(-8deg)`);
  E.img(codEl, "cod", `width:${300 * 1.7}px;height:${176 * 1.7}px`);
  E.el(tub, "abs", "left:0;top:60px;width:700px;height:300px;border-radius:40px 40px 160px 160px;border:22px solid #fff;border-top:30px solid #f4f7f8;box-sizing:border-box;z-index:3;box-shadow:0 12px 0 rgba(0,0,0,.08)");
  E.el(tub, "abs", "left:560px;top:-70px;width:30px;height:120px;background:#aeb8c2;border-radius:8px;z-index:3");
  E.el(tub, "abs", "left:520px;top:-80px;width:90px;height:26px;background:#aeb8c2;border-radius:12px;z-index:3");
  const WL = [[B, 0], [B + .2, 0], [B + 1.2, 200], [D2 - .2, 200], [D2, 80], [D2 + .6, 200], [D3 - .2, 200], [D3, 80], [D3 + .6, 200]];
  E.F(t => { let v = WL[0][1]; for (let i = 0; i < WL.length - 1; i++) if (t >= WL[i][0]) { const [a, va] = WL[i], [b, vb] = WL[i + 1]; v = t >= b ? vb : va + (vb - va) * (t - a) / (b - a); } water.style.height = `${v}px`; codEl.style.transform = `translateY(${Math.sin(t * 2) * 6}px) rotate(${-8 + Math.sin(t * 1.3) * 3}deg)`; });
  E.K(codEl, "o", [[B + 1.2, 0], [B + 1.21, 1]]); E.K(codEl, "y", [[B + 1.2, -400], [B + 1.5, 0, "in"]]);
  const stream = E.el(Bl, "abs", "left:935px;top:1320px;width:18px;height:200px;background:linear-gradient(90deg,#9fd6f2,#5fb3dd,#9fd6f2);border-radius:9px;z-index:2;opacity:0");
  E.F(t => { stream.style.opacity = (t > B + .2 && t < B + 1.2) || (t > D2 && t < D2 + .6) || (t > D3 && t < D3 + .6) ? 1 : 0; });
  const bub = Array.from({ length: 8 }, (_, i) => E.el(Bl, "abs", `left:${460 + i * 60}px;top:1500px;width:${14 + (i % 3) * 6}px;height:${14 + (i % 3) * 6}px;border-radius:50%;border:3px solid rgba(255,255,255,.8);z-index:5;opacity:0`));
  E.F(t => bub.forEach((b, i) => { const u = ((t * .7 + i * .13) % 1); b.style.opacity = t > B + 1.3 ? 1 - u : 0; b.style.transform = `translateY(${-u * 120}px)`; }));
  const gk = fig(Bl, "gk", 665, 1014, .72, -40, FLOOR + 30, 4);
  E.K(gk, "o", [[B, 1], [B + 2.8, 1], [B + 3.0, 0], [D3 - .1, 0], [D3, 1], [D3 + 1.4, 1], [D3 + 1.6, 0]]);
  const OB = swap(Bl, [["rs", 457, 1069], ["rb", 355, 1067]], 20, FLOOR + 30, .8, 4);
  E.F(t => { OB.set(t < D2 ? "rs" : t < D3 ? "rb" : "rs"); OB.w.style.opacity = (t >= B + 2.9 && t < D3) || t >= D3 + 1.5 ? 1 : 0; });
  E.K(OB.w, "x", [[B + 2.9, -400], [B + 3.2, 0, "out"]]);

  // ================= C) Christmas Eve =================
  const Cl = layer(EVE, DUR);
  E.el(Cl, "abs", "inset:0;background:#f3dcc0");
  const garl = Array.from({ length: 14 }, (_, i) => E.el(Cl, "abs", `left:${i * 78 + 10}px;top:${450 + Math.sin(i / 13 * Math.PI) * 40}px;width:18px;height:18px;border-radius:50%;background:${["#e5484d", "#f2c230", "#2f9e6f"][i % 3]};box-shadow:0 0 10px 3px rgba(255,220,120,.6)`));
  E.F(t => garl.forEach((g, i) => { g.style.opacity = (Math.floor(t * 3 + i) % 2) ? 1 : .5; }));
  const gs = fig(Cl, "gs", 665, 1014, .72, 600, 1500, 2);
  E.el(Cl, "abs", "left:0;top:1480px;width:1080px;height:440px;background:#fbf7ef;z-index:3");
  E.el(Cl, "abs", "left:0;top:1540px;width:1080px;height:110px;background:repeating-linear-gradient(90deg,#c0392b 0 60px,#a93226 60px 120px);z-index:3");
  const plate = E.el(Cl, "abs", "left:380px;top:1380px;width:420px;height:170px;border-radius:50%;background:#fff;border:8px solid #e3dccc;z-index:4");
  E.img(E.el(plate, "abs", `left:${210 - 241 * .7}px;top:-40px;width:${241 * 1.4}px;height:${167 * 1.4}px`), "dish", `width:${241 * 1.4}px;height:${167 * 1.4}px`);
  for (let k = 0; k < 5; k++) E.el(Cl, "abs", `left:${810 + (k % 3) * 60}px;top:${1430 + Math.floor(k / 3) * 50}px;width:62px;height:50px;border-radius:50%;background:#e9d38a;border:4px solid #c9b060;z-index:4`);   // potatoes
  for (let k = 0; k < 3; k++) E.el(Cl, "abs", `left:${250 + k * 50}px;top:${1440 + (k % 2) * 30}px;width:80px;height:56px;border-radius:50% 50% 40% 40%;background:#4f9a45;border:4px solid #2f7a3a;z-index:4`);                       // greens
  const OC = fig(Cl, "oh", 768, 1080, .8, -150, 2010, 5);
  const ch = []; for (let t = EVE; t < DUR; t += .3) ch.push([t, 0, "io"], [t + .15, -8, "io"]);
  E.K(OC, "y", ch);

  // ================= HUD =================
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:#b0243a;color:#fff;font-weight:900;font-size:52px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  const P = [[0, "21 DEC"], [B, "21 DEC · SOAKING: DAY 1"], [D2, "22 DEC · SOAKING: DAY 2"], [D3, "23 DEC · SOAKING: DAY 3"], [EVE, "24 DEC · CONSOADA"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.2], [t + .2, 1, "out"]]));
  const chg = E.el(S.el, "abs", "left:600px;top:470px;background:#fff;border-radius:14px;padding:6px 16px;font-weight:900;font-size:34px;color:#2f6db5;z-index:9;box-shadow:0 6px 14px rgba(0,0,0,.15);opacity:0", "");
  E.F(t => { const n = t < D2 ? 1 : t < D3 ? 2 : 3, s = `WATER CHANGES: ${n}`; if (chg.textContent !== s) chg.textContent = s; chg.style.opacity = t >= B + 1.2 && t < EVE ? 1 : 0; });

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 50) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble(`Para a Consoada!${sub("(For Christmas Eve dinner!)")}`, 500, 560, 520, 250, 1.0, 2.9, 50);
  bubble("…It's a plank.", 40, 700, 380, 150, 3.0, B - .1, 52);
  bubble(`Três dias de molho!${sub("(Three days soaking!)")}`, 60, 600, 500, 150, B + .5, B + 2.7, 50);
  bubble("There's a fish in my bath.", 40, 620, 520, 170, B + 3.2, D2 - .1, 48);
  bubble("…", 330, 900, 130, 50, D2 + .3, D3 - .1, 60);
  bubble(`Mais um bocadinho?${sub("(One more little bit?)")}`, 40, 1000, 500, 150, EVE + 1.2, DUR - .4, 50);
  const sb = E.el(S.el, "abs", "left:60px;top:560px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "WORTH THE BATH.", EVE + 2.8, { size: 100, rot: -6, bg: "#b0243a", shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(.2, "sfx/doorbell.wav", { vol: .8 }); E.clip(.4, "sfx/door-open.wav", { vol: .5, to: .6 });
  E.clip(1.0, "voices/ep61/g_consoada.wav", { vol: 1.15 });
  E.clip(3.0, "voices/ep61/o_plank.wav", { vol: 1.2 });
  E.S(B, "whoosh", .5); E.clip(B + .2, "sfx/bath-fill.wav", { vol: .8, to: 1.1 }); E.clip(B + 1.45, "sfx/splash.wav", { vol: .8 });
  E.clip(B + .5, "voices/ep61/g_molho.wav", { vol: 1.15 });
  E.clip(B + 3.2, "voices/ep61/o_fish.wav", { vol: 1.2 });
  E.S(D2, "tick", .7); E.clip(D2, "sfx/bath-fill.wav", { vol: .6, to: .7 });
  E.S(D3, "tick", .7); E.clip(D3, "sfx/bath-fill.wav", { vol: .6, to: .7 });
  E.S(EVE, "whoosh", .5); E.clip(EVE, "sfx/wedding-party.wav", { vol: .15, duck: false, to: DUR - EVE });
  E.clip(EVE + .3, "sfx/munch.wav", { vol: .6 });
  E.clip(EVE + 1.2, "voices/ep61/o_bocadinho.wav", { vol: 1.2 }); E.S(EVE + 2.4, "sparkle", .6);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "Christmas *bacalhau*", { size: 58, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[17.2, 1], [17.45, 1.18, "out"], [17.8, 1, "io"]]);
}
