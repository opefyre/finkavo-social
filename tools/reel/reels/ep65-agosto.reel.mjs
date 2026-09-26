// EP.65 "August in Portugal" — Otto has toothache and a swollen cheek. "Is anything open?!" The bakery, the barber, the dentist, the
// garage: shutters down, the same paper sign — FECHADO PARA FÉRIAS, reabre em setembro (closed for holidays, reopens in September).
// CLOSED: 1 → 4. Meanwhile, in the Algarve: the baker, the barber and the dentist on their beach towels. "Volto em setembro!" (back in
// September!). Final shot: Otto gives up and joins them on the beach. Voiced (Otto, barber) + street, cicadas, waves.
export const meta = {
  id: "ep65-agosto", date: "2026-11-27",
  images: { tooth: "characters/cutouts/otto-summer_toothache.webp", beach: "characters/cutouts/beach_workers.webp", happy: "characters/cutouts/otto-summer_happy.webp" },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 62, seed: 651, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 18.0, FLOOR = 1640, SH0 = .9, SHD = 1.75, CARD = 8.0, BEACH = 8.9, JOIN = 13.8;
  const S = E.scene("agosto", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };

  // ================= the closed shops =================
  const A = layer(0, CARD);
  E.el(A, "abs", "inset:0;background:linear-gradient(180deg,#ffd27a,#fff0c8)");
  const sun = E.el(A, "abs", "left:820px;top:430px;width:180px;height:180px;border-radius:50%;background:#ffb02e;box-shadow:0 0 80px 40px rgba(255,176,46,.5)");
  E.K(sun, "s", [[0, 1], [.8, 1.06, "io"], [1.6, 1, "io"], [2.4, 1.06, "io"], [3.2, 1, "io"]]);                         // frame-0 motion
  const SHOPS = [["PADARIA", "(bakery)", "#f5c9a8"], ["BARBEARIA", "(barber)", "#cfe0f5"], ["DENTISTA", "(dentist)", "#bfe0d6"], ["OFICINA", "(garage)", "#f2d4a0"]];
  SHOPS.forEach(([name, en, col], i) => {
    const t0 = SH0 + i * SHD, t1 = t0 + SHD;
    const f = E.el(A, "abs", `left:360px;top:640px;width:720px;height:${FLOOR - 640}px;background:${col};opacity:0;z-index:1`);
    E.K(f, "o", [[t0 - .01, 0], [t0, 1], [i < 3 ? t1 - .01 : CARD, 1], [i < 3 ? t1 : CARD + .01, 0]]); E.K(f, "x", [[t0, 800], [t0 + .3, 0, "out"]]);
    E.el(f, "abs", "left:0;top:0;width:100%;height:22px;background:#c0643f");
    const sg = E.el(f, "abs", "left:60px;top:90px;width:600px;height:130px;background:#fff;border:8px solid #1d2b36;border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center");
    E.el(sg, "", "font-weight:900;font-size:64px;color:#1d2b36;letter-spacing:.05em;line-height:1", name);
    E.el(sg, "", "font-weight:800;font-size:28px;color:#7a8791", en);
    E.el(f, "abs", `left:60px;top:280px;width:600px;height:${FLOOR - 640 - 280}px;background:repeating-linear-gradient(180deg,#9aa6ad 0 34px,#7f8b92 34px 40px);border-radius:6px 6px 0 0`);
    const note = E.el(f, "abs", "left:180px;top:420px;width:360px;background:#fffdf3;box-shadow:0 6px 14px rgba(0,0,0,.25);padding:14px 16px;box-sizing:border-box;transform:rotate(-3deg);font-family:'Comic Sans MS','Chalkboard SE',cursive;color:#1d2b36;text-align:center");
    E.el(note, "", "font-weight:700;font-size:40px;line-height:1.1", "FECHADO PARA FÉRIAS");
    E.el(note, "", "font-weight:700;font-size:28px;margin-top:6px", "Reabre em setembro");
    E.el(note, "", "font-family:Arial;font-weight:800;font-size:22px;color:#7a8791;margin-top:6px", "(Closed for holidays. Reopens in September.)");
    E.el(note, "abs", "left:140px;top:-12px;width:80px;height:26px;background:rgba(255,255,255,.7)");
    E.pop(note, t0 + .35, { from: .3, dur: .3 });
  });
  E.el(A, "abs", `left:0;top:${FLOOR - 70}px;width:1080px;height:70px;background:repeating-linear-gradient(135deg,#ece6d8 0 30px,#d9d0bd 30px 60px);z-index:2`);
  E.el(A, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background:#8a8f95;z-index:2`);
  const ot = E.el(A, "abs", `left:-10px;top:${FLOOR + 60 - 1074 * .82}px;width:${498 * .82}px;height:${1074 * .82}px;z-index:4`);
  E.img(ot, "tooth", `width:${498 * .82}px;height:${1074 * .82}px`);
  SHOPS.forEach((_, i) => { const t = SH0 + i * SHD; E.K(ot, "x", [[t - .01, 0], [t, -60], [t + .3, 0, "out"]]); });
  const heat = Array.from({ length: 5 }, (_, i) => E.el(A, "abs", `left:${120 + i * 180}px;top:${FLOOR - 40}px;width:140px;height:10px;border-radius:5px;background:rgba(255,255,255,.5);z-index:3`));
  E.F(t => heat.forEach((h, i) => { h.style.transform = `translateY(${-((t * 60 + i * 30) % 80)}px) scaleX(${1 + Math.sin(t * 5 + i) * .3})`; }));

  // ================= the card =================
  const card = E.el(S.el, "abs", "inset:0;z-index:12;background:#1d2b36;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:74px;text-align:center;opacity:0", "MEANWHILE,<br>IN THE ALGARVE…");
  E.K(card, "o", [[CARD - .01, 0], [CARD, 1], [BEACH - .2, 1], [BEACH, 0]]);

  // ================= the beach, from above =================
  const Bl = layer(BEACH, JOIN);
  E.el(Bl, "abs", "inset:0;background:#f0d9a4");
  E.el(Bl, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:radial-gradient(rgba(180,140,80,.25) 2px,transparent 3px);background-size:40px 40px");
  const sea = E.el(Bl, "abs", "left:0;top:0;width:1080px;height:760px;background:linear-gradient(180deg,#1f7fb8,#5fb3dd)");
  E.el(sea, "abs", "left:0;bottom:-30px;width:2200px;height:60px;background:radial-gradient(circle at 45px 30px,#fff 28px,transparent 29px);background-size:90px 60px;opacity:.8");
  for (const [x, y, c] of [[40, 900, "#e5484d"], [880, 1550, "#2f6db5"], [60, 1650, "#f2b632"], [900, 880, "#2f9e6f"]]) E.el(Bl, "abs", `left:${x}px;top:${y}px;width:170px;height:170px;border-radius:50%;background:conic-gradient(${c} 0 45deg,#fff 45deg 90deg,${c} 90deg 135deg,#fff 135deg 180deg,${c} 180deg 225deg,#fff 225deg 270deg,${c} 270deg 315deg,#fff 315deg);box-shadow:8px 12px 0 rgba(0,0,0,.15)`);
  const bw = E.el(Bl, "abs", `left:${540 - 1098 * .88 / 2}px;top:980px;width:${1098 * .88}px;height:${781 * .88}px;z-index:2`);
  E.img(bw, "beach", `width:${1098 * .88}px;height:${781 * .88}px`);
  E.K(bw, "s", [[BEACH, 1.15], [BEACH + .6, 1, "out"]]);
  [["the baker", 110, 900, BEACH + .8], ["the barber", 400, 900, BEACH + 1.3], ["the dentist", 700, 900, BEACH + 1.8]].forEach(([s, x, y, t]) => {
    const l = E.el(Bl, "abs", `left:${x}px;top:${y}px;background:#fff;border-radius:14px;padding:6px 16px;font-weight:900;font-size:38px;color:#1d2b36;z-index:4;box-shadow:0 6px 14px rgba(0,0,0,.2);white-space:nowrap`, `↓ ${s}`);
    E.pop(l, t, { from: .3, dur: .3 }); E.S(t, "pop", .6);
  });

  // ================= Otto joins them =================
  const Cl = layer(JOIN, DUR);
  E.el(Cl, "abs", "inset:0;background:linear-gradient(180deg,#8fd0f5,#dff2fb)");
  E.el(Cl, "abs", "left:0;top:1000px;width:1080px;height:360px;background:linear-gradient(180deg,#1f7fb8,#5fb3dd)");
  E.el(Cl, "abs", "left:0;top:1340px;width:1080px;height:580px;background:#f0d9a4");
  E.el(Cl, "abs", "left:760px;top:470px;width:170px;height:170px;border-radius:50%;background:#ffd23f;box-shadow:0 0 70px 36px rgba(255,210,63,.55)");
  const oh = E.el(Cl, "abs", `left:${540 - 857 * .78 / 2}px;top:${1800 - 1119 * .78}px;width:${857 * .78}px;height:${1119 * .78}px;z-index:3`);
  E.img(oh, "happy", `width:${857 * .78}px;height:${1119 * .78}px`);
  E.K(oh, "y", [[JOIN, 400], [JOIN + .4, 0, "out"], [JOIN + 1.2, -10, "io"], [JOIN + 2, 0, "io"]]);

  // ================= HUD =================
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.coralD};color:#fff;font-weight:900;font-size:52px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  E.F(t => { const n = SHOPS.filter((_, i) => t >= SH0 + i * SHD + .35).length, s = t >= JOIN ? "AUGUST · STATUS: ON HOLIDAY" : t >= BEACH ? "AUGUST · ALGARVE" : `AUGUST · CLOSED: ${n}`; if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= JOIN ? "#1f7a3a" : C.coralD; });
  SHOPS.forEach((_, i) => { const t = SH0 + i * SHD + .35; E.K(pill, "s", [[t - .01, 1], [t, 1.22], [t + .25, 1, "out"]]); });

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 50) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble("Is anything open?!", 30, 700, 420, 150, .4, 2.6, 52);
  bubble("…Hello?!", 30, 700, 300, 150, SH0 + 3 * SHD + .3, CARD - .1, 54);
  bubble(`Volto em setembro!${sub("(Back in September!)")}`, 300, 600, 480, 220, BEACH + 2.4, JOIN - .1, 50);
  const sb = E.el(S.el, "abs", "left:60px;top:560px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "SEE YOU IN SEPTEMBER.", JOIN + 1.0, { size: 84, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/cicadas.wav", { vol: .5, duck: false }); E.clip(3.9, "sfx/cicadas.wav", { vol: .5, duck: false, to: CARD - 3.9 });
  E.clip(.4, "voices/ep65/o_open.wav", { vol: 1.2 });
  SHOPS.forEach((_, i) => { const t = SH0 + i * SHD; E.S(t, "whoosh", .4); E.clip(t + .35, "sfx/note-slap.wav", { vol: 1.2 }); E.S(t + .5, "nope", .45); });
  E.S(CARD, "scratch", .7);
  E.clip(BEACH, "sfx/waves-seagulls.wav", { vol: .6, duck: false }); E.clip(BEACH + 4, "sfx/waves-seagulls.wav", { vol: .6, duck: false, to: DUR - BEACH - 4 });
  E.clip(BEACH + 2.4, "voices/ep65/p_setembro.wav", { vol: 1.25 });
  E.S(JOIN, "whoosh", .5); E.S(JOIN + .4, "sparkle", .7);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "*August* in Portugal", { size: 58, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[17.2, 1], [17.45, 1.18, "out"], [17.8, 1, "io"]]);
}
