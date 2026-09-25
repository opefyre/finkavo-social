// EP.45 "'Nobody was home'" — a cutaway: Otto's flat on the left, the stairwell on the right, the front door between them. 09:00,
// his phone: "Your parcel arrives TODAY, 9:00–19:00." He waits by the door: coffee, lunch, a nap in a sleeping bag… 18:55, ear pressed
// to the door. On the other side a courier tiptoes up, slaps a note on the door without ringing, and sprints off. Ping: "Delivery
// attempted: nobody was home." "I'M RIGHT HERE!" The note: "Não estava ninguém :)". DAY 2: Otto waits OUTSIDE with a sign, "I'M HOME.
// PLEASE RING." The courier walks up, sticks the note on Otto's forehead, and leaves. Effects + one Otto line.
export const meta = {
  id: "ep45-delivery", date: "2026-11-07",
  images: {
    stool: "characters/cutouts/otto-casual_stool.webp", bag: "characters/cutouts/otto-casual_sleepbag.webp", ear: "characters/cutouts/otto-casual_listen.webp",
    shock: "characters/cutouts/otto-phone_shocked.webp", ex: "characters/cutouts/otto-casual_excited.webp", bet: "characters/cutouts/otto-casual_betrayed.webp",
    sneak: "characters/cutouts/courier_sneak.webp", stick: "characters/cutouts/courier_stick.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 60, seed: 451, prog: [[0, 4, 7], [9, 12, 16], [5, 9, 12], [7, 11, 14]] });
  const DUR = 17.6, FLOOR = 1780, DX = 520, DW = 44;
  const S = E.scene("door", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const SNEAK = 5.6, SLAP = 7.1, PING = 8.2, NOTE = 10.0, DAY2 = 12.2, SLAP2 = 14.5;
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };
  const fig = (P, faces, left, s, z = 3) => {        // several poses swapped in place, bottom-aligned on the floor
    const w = E.el(P, "abs", `left:${left}px;top:0;width:1px;height:${FLOOR}px;z-index:${z}`);
    const ims = faces.map(([n, iw, ih, dx = 0]) => E.img(w, n, `position:absolute;left:${dx}px;top:${FLOOR - ih * s}px;width:${iw * s}px;height:${ih * s}px;opacity:0`));
    return { w, set: f => ims.forEach((x, i) => { x.style.opacity = faces[i][0] === f ? 1 : 0; }) };
  };

  // ================= the cutaway: flat | door | stairwell =================
  const A = layer(0, DAY2);
  E.el(A, "abs", `left:0;top:0;width:${DX}px;height:1920px;background:#f3e3c3`);
  E.el(A, "abs", `left:0;top:1180px;width:${DX}px;height:${FLOOR - 1180}px;background:repeating-linear-gradient(90deg,#e8d3ad 0 60px,#e2cba3 60px 120px)`);
  const win = E.el(A, "abs", "left:60px;top:560px;width:200px;height:260px;border:12px solid #fff;border-radius:8px;overflow:hidden");
  const sky = E.el(win, "abs", "inset:0;background:#8fd0f5");
  E.F(t => { const h = at([[0, "#8fd0f5"], [2.9, "#a8dcff"], [4.3, "#f7b26b"], [5.1, "#e0795a"], [PING, "#5a4a7a"]], t); sky.style.background = h; });
  E.el(A, "abs", "left:310px;top:620px;width:150px;height:110px;background:#fff;border:8px solid #8a5a2b;border-radius:4px");
  E.el(A, "abs", "left:330px;top:640px;width:110px;height:70px;background:linear-gradient(135deg,#7cc4ee,#35a06f)");
  E.el(A, "abs", `left:${DX + DW}px;top:0;width:${1080 - DX - DW}px;height:1920px;background:#cfd8e0`);
  E.el(A, "abs", `left:${DX + DW}px;top:1180px;width:${1080 - DX - DW}px;height:${FLOOR - 1180}px;background:#bcc7d1`);
  for (let i = 0; i < 6; i++) E.el(A, "abs", `left:${880 + i * 40}px;top:${FLOOR + i * 30}px;width:200px;height:30px;background:${i % 2 ? "#a9b4be" : "#b7c1ca"}`);    // stairs going down
  E.el(A, "abs", "left:880px;top:560px;width:12px;height:1220px;background:#8a95a0");                                                   // banister post
  E.el(A, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background:#9c7a5a;z-index:1`);
  // the door, edge-on, with a knob on both sides
  E.el(A, "abs", `left:${DX - 14}px;top:520px;width:${DW + 28}px;height:${FLOOR - 520}px;background:#6b4a2c;border-radius:6px 6px 0 0;z-index:2`);
  E.el(A, "abs", `left:${DX}px;top:540px;width:${DW}px;height:${FLOOR - 540}px;background:#a0703f;z-index:2`);
  for (const x of [DX - 18, DX + DW + 4]) E.el(A, "abs", `left:${x}px;top:1150px;width:18px;height:18px;border-radius:50%;background:#e2b54a;z-index:2`);
  E.el(A, "abs", `left:${DX - 40}px;top:1640px;width:${DW + 80}px;height:24px;background:#8a6a4a;border-radius:4px;z-index:2`);          // doormat
  const note = E.el(A, "abs", `left:${DX + DW}px;top:960px;width:34px;height:70px;background:#ffe45c;box-shadow:2px 3px 0 rgba(0,0,0,.15);z-index:2;opacity:0;transform-origin:0 50%`);
  E.K(note, "o", [[SLAP - .01, 0], [SLAP, 1]]); E.K(note, "sx", [[SLAP, 1.6], [SLAP + .15, 1, "out"]]);

  // Otto inside
  const O = fig(A, [["stool", 483, 953, 0], ["bag", 701, 877, 0], ["ear", 461, 1036, 0], ["shock", 424, 1068, 0]], 0, .85);
  const oPos = [[0, 80], [3.6, DX - 701 * .8 + 30], [5.0, DX - 461 * .85], [PING, 90]];
  E.F(t => { O.set(at([[0, "stool"], [3.6, "bag"], [5.0, "ear"], [PING, "shock"]], t)); O.w.style.left = `${at(oPos, t)}px`; });
  const bob = []; for (let t = 0; t < 3.6; t += .8) bob.push([t, 0, "io"], [t + .4, -6, "io"]);
  E.K(O.w, "y", bob);
  const steam = [0, 1].map(i => E.el(A, "abs", "left:410px;top:1030px;width:26px;height:40px;border-radius:50%;background:rgba(255,255,255,.9);z-index:4;opacity:0"));
  E.F(t => steam.forEach((s, i) => { const u = ((t + i * .6) % 1.2) / 1.2; s.style.opacity = t < 3.6 ? (1 - u) * .8 : 0; s.style.transform = `translate(${Math.sin(u * 6) * 8}px,${-u * 90}px)`; }));
  const zz = [0, 1, 2].map(i => E.el(A, "abs", "left:360px;top:1010px;font-weight:900;font-size:54px;color:#5a6b7a;z-index:4;opacity:0", "z"));
  E.F(t => zz.forEach((z, i) => { const u = ((t - 3.6 + i * .4) % 1.2) / 1.2; z.style.opacity = t > 3.8 && t < 5.0 ? 1 - u : 0; z.style.transform = `translate(${u * 60}px,${-u * 120}px) scale(${.6 + u * .6})`; }));
  // the courier outside
  const K = fig(A, [["sneak", 521, 1006, 0], ["stick", 485, 1035, 0]], 0, .88, 3);
  E.F(t => { K.set(t < SLAP - .1 ? "sneak" : "stick"); K.w.style.left = `${lerp(t)}px`; K.w.style.opacity = t >= SNEAK && t < SLAP + 1.0 ? 1 : 0; });
  function lerp(t) {
    if (t < SNEAK + 1.3) { const u = Math.max(0, (t - SNEAK) / 1.3); return 1100 - (1100 - (DX + DW + 30)) * u; }
    if (t < SLAP + .4) return DX + DW + 6;
    return DX + DW + 6 + (t - SLAP - .4) * 1400;
  }
  const tip = []; for (let t = SNEAK; t < SNEAK + 1.3; t += .26) tip.push([t, 0, "io"], [t + .13, -18, "io"]);
  E.K(K.w, "y", tip);

  // ================= the note, close up =================
  const N = E.el(S.el, "abs", "left:190px;top:560px;width:700px;height:640px;z-index:8;opacity:0;background:#ffe45c;box-shadow:0 18px 40px rgba(0,0,0,.3);transform:rotate(-4deg);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;box-sizing:border-box");
  E.el(N, "abs", "left:280px;top:-18px;width:140px;height:40px;background:rgba(255,255,255,.6);transform:rotate(3deg)");
  E.el(N, "", `font-family:'Comic Sans MS','Chalkboard SE',cursive;font-weight:700;font-size:78px;line-height:1.1;color:#1d3f8a;text-align:center`, "Não estava ninguém :)");
  E.el(N, "", "margin-top:24px;font-weight:800;font-size:40px;color:#7a6a1a", "(Nobody was home)");
  E.pop(N, NOTE, { from: .3, dur: .35 }); E.K(N, "o", [[NOTE, 0], [NOTE + .1, 1], [DAY2 - .15, 1], [DAY2, 0]]);

  // ================= DAY 2: waiting outside =================
  const B = layer(DAY2, DUR);
  E.el(B, "abs", "inset:0;background:#cfd8e0");
  E.el(B, "abs", `left:0;top:1180px;width:1080px;height:${FLOOR - 1180}px;background:#bcc7d1`);
  E.el(B, "abs", `left:40px;top:560px;width:300px;height:${FLOOR - 560}px;background:#a0703f;border:14px solid #6b4a2c;border-bottom:none;border-radius:8px 8px 0 0`);
  E.el(B, "abs", "left:290px;top:1150px;width:24px;height:24px;border-radius:50%;background:#e2b54a");
  E.el(B, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background:#9c7a5a;z-index:1`);
  const O2 = fig(B, [["ex", 625, 1078, 0], ["bet", 625, 1078, 0]], 360, .82, 3);
  E.F(t => O2.set(t < SLAP2 + .1 ? "ex" : "bet"));
  const sg = E.el(B, "abs", "left:465px;top:1250px;width:300px;height:190px;background:#d8b47a;border:6px solid #b08a50;border-radius:8px;z-index:4;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:900;font-size:40px;line-height:1.1;color:#2a2a2a;transform:rotate(-3deg)", "I'M HOME.<br>PLEASE RING.");
  const K2 = fig(B, [["sneak", 521, 1006, 0], ["stick", 485, 1035, 0]], 0, 1.0, 5);
  E.F(t => { K2.set(t < SLAP2 - .15 ? "sneak" : "stick"); const x = t < SLAP2 - .15 ? 1100 - (1100 - 700) * Math.min(1, Math.max(0, (t - DAY2 - .8) / 1.2)) : t < SLAP2 + .8 ? 640 : 640 + (t - SLAP2 - .8) * 1300; K2.w.style.left = `${x}px`; });
  const n2 = E.el(B, "abs", "left:545px;top:895px;width:120px;height:120px;background:#ffe45c;box-shadow:2px 4px 0 rgba(0,0,0,.18);z-index:6;opacity:0;transform:rotate(-8deg);display:flex;align-items:center;justify-content:center;text-align:center;font-family:'Comic Sans MS','Chalkboard SE',cursive;font-size:22px;font-weight:700;color:#1d3f8a;line-height:1.05", "Não estava ninguém :)");
  E.K(n2, "o", [[SLAP2 - .01, 0], [SLAP2, 1]]); E.K(n2, "s", [[SLAP2, 1.5], [SLAP2 + .15, 1, "out"]]);

  // ================= HUD: clock, phone =================
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:56px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7`, "");
  const CLK = [[0, "09:00"], [2.2, "11:00"], [2.9, "13:00"], [3.6, "15:00"], [4.3, "17:00"], [5.0, "18:55"], [PING, "18:58"], [DAY2, "DAY 2 · 09:00"], [DAY2 + 1.1, "DAY 2 · 18:55"]];
  E.F(t => { const s = at(CLK, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= 5.0 && t < DAY2 ? C.coralD : C.ink; });
  CLK.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.2], [t + .2, 1, "out"]]));
  const banner = (t0, t1, title, body, red) => {
    const b = E.el(S.el, "abs", "left:140px;top:440px;width:800px;background:rgba(255,255,255,.97);border-radius:30px;box-shadow:0 14px 30px rgba(0,0,0,.2);display:flex;align-items:center;gap:22px;padding:22px 26px;box-sizing:border-box;z-index:9;opacity:0");
    const ic = E.el(b, "", `flex:none;width:84px;height:84px;border-radius:20px;background:${red ? "#e5484d" : "#c68b3f"};position:relative`);
    E.el(ic, "abs", "left:18px;top:24px;width:48px;height:38px;background:#f3d6a4;border-radius:4px"); E.el(ic, "abs", "left:38px;top:24px;width:8px;height:38px;background:#c68b3f");
    const tx = E.el(b, "", "flex:1");
    E.el(tx, "", "font-weight:800;font-size:28px;color:#7a8791", "Parcel delivery · now");
    E.el(tx, "", `font-weight:900;font-size:38px;line-height:1.15;color:${red ? "#c0392b" : C.ink}`, title);
    if (body) E.el(tx, "", "font-weight:700;font-size:30px;color:#4a5560", body);
    E.K(b, "o", [[t0, 0], [t0 + .1, 1], [t1 - .15, 1], [t1, 0]]); E.K(b, "y", [[t0, -120], [t0 + .3, 0, "out"]]);
  };
  banner(.3, 2.1, "Your parcel arrives TODAY", "between 09:00 and 19:00");
  banner(PING, NOTE - .05, "Delivery attempted: nobody was home", "Pick up at the store, 6 km away", true);

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 58) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:9;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:20px 28px 24px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("I'M RIGHT HERE!", 60, 740, 480, 160, PING + .35, NOTE - .05, 60);
  const sb = E.el(S.el, "abs", "left:60px;top:1470px;width:960px;display:flex;justify-content:center;z-index:10");
  const st = E.stamp(sb, "NOBODY HOME.", SLAP2 + 1.0, { size: 104, rot: -6, bg: C.coralD, shake: 12 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(.3, "sfx/phone-ping.wav", { vol: 1.2 });
  for (const [t] of CLK.slice(1, 6)) E.S(t, "tick", .7);
  E.clip(SNEAK, "sfx/tiptoe.wav", { vol: 2.0 });
  E.clip(SLAP, "sfx/note-slap.wav", { vol: 1.3 });
  E.S(SLAP + .4, "whoosh", .6); E.clip(SLAP + .45, "sfx/stairs-run.wav", { vol: .7, to: .9 }); E.clip(SLAP + .9, "sfx/van-away.wav", { vol: .5 });
  E.clip(PING, "sfx/phone-ping.wav", { vol: 1.2 });
  E.clip(PING + .35, "voices/ep45/o_here.wav", { vol: 1.2 }); E.shake(PING + .5, 12);
  E.S(NOTE, "pop", .7);
  E.S(DAY2, "whoosh", .5);
  E.clip(DAY2 + .8, "sfx/stairs-run.wav", { vol: .5, to: .9 });
  E.clip(SLAP2, "sfx/note-slap.wav", { vol: 1.4 }); E.S(SLAP2 + .05, "thud", .5);
  E.S(SLAP2 + .8, "whoosh", .5);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Waiting for a *delivery*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[16.8, 1], [17.05, 1.18, "out"], [17.4, 1, "io"]]);
}
