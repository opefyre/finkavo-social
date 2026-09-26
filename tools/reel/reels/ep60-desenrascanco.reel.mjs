// EP.60 "Desenrascanço" — the Portuguese art of fixing anything with what you have. The TV is static and the remote is in bits; the
// technician says three weeks. Sr. Zé from next door: "Deixa comigo." (leave it to me) — tape round the remote, a coat hanger in the
// TV, football on screen: "Pronto. Novo." (there. brand new.) The car door falls off: tape, tape — "Pronto. Novo." Then Otto's chair
// snaps. Otto grabs the tape and a clothes peg: "Deixa comigo." Fixed. Zé wipes a tear: "Já és português." (you're Portuguese now.)
// Voiced (Zé in Portuguese with subtitles, Otto) + clunks, tape rips, a TV hiss.
export const meta = {
  id: "ep60-desenrascanco", date: "2026-11-22",
  images: {
    phone: "characters/cutouts/otto-casual_phonedespair.webp", bet: "characters/cutouts/otto-casual_betrayed.webp", tape: "characters/cutouts/otto-casual_tape.webp",
    zt: "characters/cutouts/ze_tape.webp", zp: "characters/cutouts/ze_proud.webp",
    car: "characters/props/car_old.webp", car2: "characters/props/car_old-nodoor.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 60, seed: 601, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 18.2, FLOOR = 1720, B = 6.6, Cs = 11.6;
  const S = E.scene("fix", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };
  const room = P => {
    E.el(P, "abs", "inset:0;background:#f0e3cc");
    E.el(P, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:repeating-linear-gradient(90deg,rgba(120,90,50,.06) 0 70px,transparent 70px 140px)");
    E.el(P, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background:repeating-linear-gradient(90deg,#b98a5e 0 160px,#a97c52 160px 320px)`);
    const pic = E.el(P, "abs", "left:760px;top:480px;width:220px;height:170px;border:12px solid #8a5a2b;background:linear-gradient(180deg,#8fd0f5 0 55%,#6cae5a 55%)");
    E.el(pic, "abs", "left:120px;top:30px;width:40px;height:40px;border-radius:50%;background:#ffd23f");
  };
  const tapeStrip = (P, x, y, w, rot, t) => { const el = E.el(P, "abs", `left:${x}px;top:${y}px;width:${w}px;height:34px;background:linear-gradient(180deg,#d9dde1,#aab3bb 50%,#cfd4d8);border-radius:3px;box-shadow:0 2px 3px rgba(0,0,0,.25);transform:rotate(${rot}deg);transform-origin:0 50%;z-index:6;opacity:0`); E.K(el, "o", [[t - .01, 0], [t, 1]]); E.K(el, "sx", [[t, 0], [t + .18, 1, "out"]]); return el; };
  const fig = (P, faces, left, s, z = 5) => {
    const w = E.el(P, "abs", `left:${left}px;top:0;width:1px;height:1px;z-index:${z}`);
    const ims = faces.map(([n, iw, ih]) => [n, E.img(w, n, `position:absolute;left:0;top:${FLOOR + 30 - ih * s}px;width:${iw * s}px;height:${ih * s}px;opacity:0`)]);
    return { w, set: f => ims.forEach(([n, el]) => { el.style.opacity = n === f ? 1 : 0; }) };
  };

  // ================= A) the TV and the remote =================
  const A = layer(0, B); room(A);
  const tv = E.el(A, "abs", "left:420px;top:900px;width:420px;height:320px;background:#2b2f35;border-radius:24px;padding:22px;box-sizing:border-box;z-index:2");
  const scr = E.el(tv, "", "position:relative;width:100%;height:100%;border-radius:12px;overflow:hidden;background:#555");
  const noise = E.el(scr, "abs", "inset:-40px;background-image:repeating-linear-gradient(0deg,#ddd 0 2px,#555 2px 5px,#999 5px 7px,#333 7px 9px),repeating-linear-gradient(90deg,rgba(255,255,255,.2) 0 3px,transparent 3px 7px)");
  E.F(t => { noise.style.transform = `translate(${(t * 997) % 30 - 15}px,${(t * 613) % 30 - 15}px)`; noise.style.opacity = t < 3.7 ? 1 : 0; });   // frame-0 motion: static
  const pitch = E.el(scr, "abs", "inset:0;background:repeating-linear-gradient(90deg,#3f9a4a 0 40px,#4aab55 40px 80px);opacity:0");
  E.el(pitch, "abs", "left:50%;top:0;width:4px;height:100%;background:#fff;opacity:.8"); E.el(pitch, "abs", "left:calc(50% - 40px);top:calc(50% - 40px);width:80px;height:80px;border:4px solid #fff;border-radius:50%;opacity:.8");
  const ball = E.el(pitch, "abs", "left:0;top:120px;width:22px;height:22px;border-radius:50%;background:#fff");
  E.F(t => { ball.style.transform = `translate(${((t - 3.7) * 160) % 330}px,${Math.sin(t * 5) * 40}px)`; });
  E.K(pitch, "o", [[3.69, 0], [3.7, 1]]);
  E.el(A, "abs", "left:400px;top:1220px;width:460px;height:40px;background:#7a5230;border-radius:6px;z-index:2");
  E.el(A, "abs", `left:430px;top:1260px;width:30px;height:${FLOOR - 1260}px;background:#6a4526;z-index:2`); E.el(A, "abs", `left:800px;top:1260px;width:30px;height:${FLOOR - 1260}px;background:#6a4526;z-index:2`);
  const hanger = E.el(A, "abs", "left:600px;top:760px;width:160px;height:150px;z-index:3;opacity:0", `<svg width="160" height="150"><path d="M20 140 L80 40 L140 140 M80 40 Q80 10 100 12 Q116 14 110 30" stroke="#8a95a0" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`);
  E.K(hanger, "o", [[3.5, 0], [3.51, 1]]); E.K(hanger, "y", [[3.5, -300], [3.7, 0, "in"]]);
  const remote = E.el(A, "abs", "left:470px;top:1580px;width:90px;height:220px;border-radius:24px;background:#2b2b2b;z-index:4;transform:rotate(-70deg)");
  for (let k = 0; k < 6; k++) E.el(remote, "abs", `left:${18 + (k % 2) * 34}px;top:${30 + Math.floor(k / 2) * 44}px;width:20px;height:20px;border-radius:50%;background:${k ? "#8a95a0" : "#e5484d"}`);
  const batts = [0, 1].map(i => E.el(A, "abs", `left:${600 + i * 70}px;top:${1650 + i * 20}px;width:60px;height:26px;border-radius:6px;background:linear-gradient(90deg,#2f6db5 0 70%,#c9ccd0 70%);z-index:4`));
  batts.forEach((b, i) => { E.K(b, "x", [[3.1, 0], [3.35, -130 - i * 50, "in"]]); E.K(b, "o", [[3.35, 1], [3.4, 0]]); });
  tapeStrip(A, 470, 1620, 180, -70, 3.4);
  const OA = fig(A, [["phone", 475, 1053], ["bet", 625, 1078]], -40, .74);
  E.F(t => OA.set(t < 4.6 ? "phone" : "bet"));
  const ZA = fig(A, [["zt", 741, 1009]], 620, .72, 5);
  E.F(t => ZA.set("zt")); E.K(ZA.w, "x", [[2.5, 600], [2.85, 0, "out"]]);

  // ================= B) the car door =================
  const Bl = layer(B, Cs);
  E.el(Bl, "abs", "inset:0;background:linear-gradient(180deg,#8fd0f5,#dff2fb)");
  const HC = ["#f5c9a8", "#ffe29a", "#bfe0d6", "#f7b7b7"];
  for (let i = 0; i < 4; i++) { const h = E.el(Bl, "abs", `left:${-20 + i * 280}px;top:${700 - (i % 2) * 80}px;width:290px;height:${FLOOR - 700}px;background:${HC[i]}`); E.el(h, "abs", "left:0;top:0;width:100%;height:22px;background:#c0643f"); for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) E.el(h, "abs", `left:${46 + c * 120}px;top:${70 + r * 200}px;width:70px;height:120px;background:#3d5a73;border:8px solid #fff;border-radius:35px 35px 4px 4px`); }
  E.el(Bl, "abs", `left:0;top:${FLOOR - 60}px;width:1080px;height:${1920 - FLOOR + 60}px;background:#8a8f95`);
  const CW = 1056 * .8, CH = 504 * .8, car = E.el(Bl, "abs", `left:${540 - CW / 2}px;top:${FLOOR + 40 - CH}px;width:${CW}px;height:${CH}px;z-index:2`);
  const c1 = E.img(car, "car", `position:absolute;left:0;top:0;width:${CW}px;height:${CH}px`);
  const c2 = E.img(car, "car2", `position:absolute;left:0;top:0;width:${CW}px;height:${CH}px;opacity:0`);
  E.F(t => { const d = t >= B + .5 && t < B + 2.3; c1.style.opacity = d ? 0 : 1; c2.style.opacity = d ? 1 : 0; });
  E.K(car, "sy", [[B + .49, 1], [B + .5, .95], [B + .75, 1, "out"]]);
  const dx = 540 - CW / 2, dy = FLOOR + 40 - CH;
  tapeStrip(Bl, dx + CW * .28, dy + CH * .2, 260, 38, B + 2.4); tapeStrip(Bl, dx + CW * .3, dy + CH * .72, 260, -38, B + 2.6); tapeStrip(Bl, dx + CW * .2, dy + CH * .47, 330, 0, B + 2.8);
  const OB = fig(Bl, [["phone", 475, 1053]], -120, .7, 3); OB.set("phone");
  const ZB = fig(Bl, [["zt", 741, 1009]], 640, .7, 3); ZB.set("zt"); E.K(ZB.w, "x", [[B + 1.1, 500], [B + 1.4, 0, "out"]]);
  E.F(t => { OB.w.style.opacity = t >= B + .8 ? 1 : 0; });

  // ================= C) Otto's chair =================
  const Cl = layer(Cs, DUR); room(Cl);
  const chair = E.el(Cl, "abs", `left:430px;top:${FLOOR - 430}px;width:260px;height:430px;z-index:3`);
  E.el(chair, "abs", "left:20px;top:0;width:220px;height:200px;border:16px solid #8a5a2b;border-bottom:none;border-radius:20px 20px 0 0");
  E.el(chair, "abs", "left:0;top:200px;width:260px;height:36px;background:#9c6a36;border-radius:6px");
  E.el(chair, "abs", "left:20px;top:236px;width:22px;height:194px;background:#8a5a2b");
  const leg = E.el(chair, "abs", "left:218px;top:236px;width:22px;height:194px;background:#8a5a2b;transform-origin:50% 0");
  E.K(leg, "r", [[Cs + .5, 0], [Cs + .7, 65, "in"], [Cs + 2.2, 65], [Cs + 2.21, 0]]);
  E.K(chair, "r", [[Cs + .5, 0], [Cs + .7, 8, "in"], [Cs + 2.2, 8], [Cs + 2.21, 0]]);
  tapeStrip(Cl, 640, FLOOR - 190, 90, 0, Cs + 2.21); tapeStrip(Cl, 640, FLOOR - 140, 90, 0, Cs + 2.3);
  const peg = E.el(Cl, "abs", `left:660px;top:${FLOOR - 250}px;width:26px;height:90px;border-radius:6px;background:#d9b27a;border:3px solid #8a5a2b;z-index:7;opacity:0`); E.K(peg, "o", [[Cs + 2.35, 0], [Cs + 2.36, 1]]);
  const OC = fig(Cl, [["bet", 625, 1078], ["tape", 605, 1038]], -30, .76);
  E.F(t => OC.set(t < Cs + 1.4 ? "bet" : "tape"));
  const ZC = fig(Cl, [["zp", 499, 1054]], 700, .72, 4); ZC.set("zp"); E.K(ZC.w, "x", [[Cs + 2.7, 500], [Cs + 3.0, 0, "out"]]);
  const def = E.el(S.el, "abs", "left:120px;top:1745px;width:840px;background:#fffdf3;border-left:14px solid #2f9e6f;border-radius:16px;padding:16px 22px;box-sizing:border-box;z-index:9;box-shadow:0 10px 24px rgba(0,0,0,.2);opacity:0");
  E.el(def, "", `font-weight:900;font-size:42px;color:${C.ink}`, "desenrascanço (n.)");
  E.el(def, "", "font-weight:800;font-size:32px;color:#4a5560;margin-top:4px", "the art of fixing anything with whatever you have.");
  E.pop(def, Cs + 4.6, { from: .3, dur: .3 });

  // ================= HUD =================
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:46px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  const P = [[0, "TECHNICIAN: 3 WEEKS"], [4.3, "SR. ZÉ: 4 SECONDS"], [B, "GARAGE: 2 WEEKS"], [B + 2.9, "SR. ZÉ: 1 ROLL OF TAPE"], [Cs, "OTTO'S CHAIR"], [Cs + 2.3, "OTTO: 3 SECONDS"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = /ZÉ|OTTO:/.test(s) ? "#1f7a3a" : /WEEK/.test(s) ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.2], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 50) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble("Three weeks? For a remote?", 40, 620, 500, 160, .5, 2.6, 48);
  bubble(`Deixa comigo.${sub("(Leave it to me.)")}`, 560, 640, 440, 250, 2.9, 4.2, 50);
  bubble(`Pronto. Novo.${sub("(There. Brand new.)")}`, 560, 640, 440, 250, 4.3, B - .1, 52);
  bubble(`Deixa comigo.`, 580, 660, 400, 220, B + 1.5, B + 2.6, 52);
  bubble(`Pronto. Novo.`, 580, 660, 400, 220, B + 3.1, Cs - .1, 54);
  bubble(`Deixa comigo.${sub("(Leave it to me.)")}`, 40, 640, 440, 170, Cs + 1.4, Cs + 2.7, 50);
  bubble(`Já és português.${sub("(You're Portuguese now.)")}`, 540, 620, 500, 280, Cs + 3.1, DUR - .4, 48);
  const sb = E.el(S.el, "abs", "left:60px;top:470px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "DESENRASCANÇO.", Cs + 4.2, { size: 100, rot: -6, bg: C.mint, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/rain-heavy.wav", { vol: .08, duck: false, to: 3.7 });                                           // TV hiss
  E.clip(.5, "voices/ep60/o_weeks.wav", { vol: 1.15 });
  E.clip(2.9, "voices/ep60/v_deixa.wav", { vol: 1.2 });
  E.clip(3.4, "sfx/plastic-rip.wav", { vol: .8, to: .5 }); E.S(3.7, "ding", .7); E.clip(3.8, "sfx/stadium-goal.wav", { vol: .25, to: 1.8 });
  E.clip(4.3, "voices/ep60/v_novo.wav", { vol: 1.15 });
  E.S(B, "whoosh", .5); E.clip(B + .5, "sfx/car-door-fall.wav", { vol: 1.0 }); E.shake(B + .55, 12);
  E.clip(B + 1.5, "voices/ep60/v_deixa.wav", { vol: 1.2 });
  for (const t of [B + 2.4, B + 2.6, B + 2.8]) E.clip(t, "sfx/plastic-rip.wav", { vol: .7, to: .35 });
  E.clip(B + 3.1, "voices/ep60/v_novo.wav", { vol: 1.15 }); E.S(B + 3.0, "ding", .6);
  E.S(Cs, "whoosh", .5); E.S(Cs + .6, "crack", 1); E.S(Cs + .7, "thud", .8);
  E.clip(Cs + 1.4, "voices/ep60/o_deixa.wav", { vol: 1.2 });
  E.clip(Cs + 2.2, "sfx/plastic-rip.wav", { vol: .8, to: .4 }); E.S(Cs + 2.4, "ding", .8);
  E.clip(Cs + 3.1, "voices/ep60/v_portugues.wav", { vol: 1.2 }); E.S(Cs + 3.2, "sparkle", .6);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "Fixing things, *Portuguese style*", { size: 48, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[17.4, 1], [17.65, 1.18, "out"], [18.0, 1, "io"]]);
}
