// EP.66 "Which club are you?" — Otto's first day at a new job. A colleague, coffee in hand: "Então… és de que clube?" (So… which club
// are you?) Otto shrugs: "I don't really follow football." Record scratch. The office freezes. Three fans burst in, scarves up:
// "Benfica!" "Sporting!" "Porto!" "Tens de escolher!" (You have to choose!) Otto, wearing all three scarves: "…Can I have all three?"
// Sunday, derby day at the café: the whole café stares at him. Voiced (colleague and fans in Portuguese with subtitles; Otto).
export const meta = {
  id: "ep66-clube", date: "2026-11-28",
  images: {
    ex: "characters/cutouts/otto-casual_excited.webp", shrug: "characters/cutouts/otto-casual_shrug.webp", sc: "characters/cutouts/otto-casual_scarves.webp",
    mar: "characters/cutouts/marta_office.webp", red: "characters/cutouts/fan_red.webp", green: "characters/cutouts/fan_green.webp", blue: "characters/cutouts/fan_blue.webp",
    stare: "characters/cutouts/fans_stare.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 116, root: 57, seed: 661, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 17.4, FLOOR = 1760, Q = .5, SHRUG = 2.9, FREEZE = 4.7, RED = 5.3, GRN = 6.5, BLU = 7.7, CHOOSE = 9.0, ALL = 10.4, DERBY = 12.8;
  const S = E.scene("clube", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };

  // ================= the office =================
  const A = layer(0, DERBY);
  E.el(A, "abs", "inset:0;background:#e9eef2");
  E.el(A, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:linear-gradient(90deg,rgba(0,0,0,.035) 3px,transparent 3px);background-size:180px 100%");
  E.el(A, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background:#9aa6b0`);
  const w = E.el(A, "abs", "left:620px;top:470px;width:400px;height:320px;border:14px solid #fff;background:linear-gradient(180deg,#8fd0f5,#dff2fb)"); E.el(w, "abs", "left:180px;top:0;width:10px;height:100%;background:#fff");
  E.el(A, "abs", "left:80px;top:560px;width:260px;height:180px;background:#fff;border:8px solid #cfd6dc;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:34px;color:#2f6db5;text-align:center", "WELCOME,<br>OTTO!");
  const red = E.el(A, "abs", "inset:0;background:radial-gradient(circle at 50% 60%,rgba(40,10,10,0) 30%,rgba(40,10,10,.55));z-index:3;opacity:0");
  E.K(red, "o", [[FREEZE - .01, 0], [FREEZE, 1]]);
  // Otto: excited → shrug → three scarves
  const ow = E.el(A, "abs", `left:340px;top:0;width:1px;height:1px;z-index:5`);
  const OF = { ex: [625, 1078], shrug: [702, 1055], sc: [595, 1074] };
  const oIm = Object.entries(OF).map(([n, [iw, ih]]) => [n, E.img(ow, n, `position:absolute;left:${-iw * .78 / 2 + 200}px;top:${FLOOR + 40 - ih * .78}px;width:${iw * .78}px;height:${ih * .78}px;opacity:0`)]);
  E.F(t => { const f = at([[0, "ex"], [SHRUG, "shrug"], [ALL, "sc"]], t); oIm.forEach(([n, el]) => { el.style.opacity = n === f ? 1 : 0; }); });
  const ob = []; for (let t = 0; t < SHRUG; t += .8) ob.push([t, 0, "io"], [t + .4, -8, "io"]);
  E.K(ow, "y", ob);                                                                                                     // frame-0 motion
  E.K(ow, "s", [[ALL - .01, 1], [ALL, 1.1], [ALL + .25, 1, "out"]]);
  // the colleague
  const mw = E.el(A, "abs", `left:-20px;top:${FLOOR + 40 - 1038 * .78}px;width:${516 * .78}px;height:${1038 * .78}px;z-index:4`);
  E.img(mw, "mar", `width:${516 * .78}px;height:${1038 * .78}px`);
  E.K(mw, "x", [[RED - .2, 0], [RED + .2, -500, "in"]]);
  // the three fans burst in
  const fan = (n, w0, h0, t, left, from) => {
    const FS = .74, f = E.el(A, "abs", `left:${left}px;top:${FLOOR + 50 - h0 * FS}px;width:${w0 * FS}px;height:${h0 * FS}px;z-index:4;opacity:0`);
    E.img(f, n, `width:${w0 * FS}px;height:${h0 * FS}px`);
    E.K(f, "o", [[t - .01, 0], [t, 1]]); E.K(f, "x", [[t, from], [t + .3, 0, "out"]]);
    const j = []; for (let k = t + .3; k < DERBY; k += .4) j.push([k, 0, "io"], [k + .2, -14, "io"]); E.K(f, "y", j);
    return f;
  };
  const fr = fan("red", 770, 1050, RED, 560, 700); fan("green", 704, 1070, GRN, -120, -700); const fb = fan("blue", 766, 1054, BLU, 420, 700);
  E.K(fr, "x", [[BLU - .01, 0], [BLU + .3, -130, "out"]]); E.K(fr, "y", [[BLU + .29, 0], [BLU + .3, -40]]); E.F(t => { fr.style.zIndex = t >= BLU ? 3 : 4; }); E.K(fb, "x", [[BLU + .3, 0], [BLU + .5, 200, "out"]]);

  // ================= Sunday derby =================
  const Bl = layer(DERBY, DUR);
  E.el(Bl, "abs", "inset:0;background:#efe0c7");
  const tv = E.el(Bl, "abs", "left:300px;top:470px;width:480px;height:280px;background:#1d2b36;border-radius:16px;padding:14px;box-sizing:border-box");
  const pitch = E.el(tv, "", "width:100%;height:100%;border-radius:8px;background:repeating-linear-gradient(90deg,#3f9a4a 0 40px,#4aab55 40px 80px);position:relative");
  E.el(pitch, "abs", "left:50%;top:0;width:4px;height:100%;background:#fff;opacity:.8");
  E.el(tv, "abs", "left:150px;top:-44px;background:#e5484d;color:#fff;font-weight:900;font-size:28px;padding:2px 14px;border-radius:8px", "DERBY · LIVE");
  const st2 = E.el(Bl, "abs", `left:${540 - 1024 * .5}px;top:${1300 - 623 * 1.0}px;width:${1024 * 1.0}px;height:${623 * 1.0}px;z-index:2`);
  E.img(st2, "stare", `width:${1024 * 1.0}px;height:${623 * 1.0}px`);
  E.el(Bl, "abs", "left:0;top:1280px;width:1080px;height:640px;background:#6a3e1e;z-index:3"); E.el(Bl, "abs", "left:0;top:1280px;width:1080px;height:26px;background:#a8764c;z-index:3");
  const o2 = E.el(Bl, "abs", `left:${540 - 595 * .7 / 2}px;top:${1960 - 1074 * .7}px;width:${595 * .7}px;height:${1074 * .7}px;z-index:4`);
  E.img(o2, "sc", `width:${595 * .7}px;height:${1074 * .7}px`);
  E.K(o2, "y", [[DERBY, 300], [DERBY + .4, 0, "out"]]);
  const q = E.el(Bl, "abs", "left:0;top:0;width:1080px;height:1920px;z-index:5;pointer-events:none");
  E.F(t => { q.style.opacity = t > DERBY + .8 ? 1 : 0; });
  for (let i = 0; i < 4; i++) E.el(q, "abs", `left:${170 + i * 210}px;top:760px;font-weight:900;font-size:80px;color:#e5484d;-webkit-text-stroke:5px #fff;paint-order:stroke`, "!");

  // ================= HUD =================
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  E.F(t => { const s = t >= DERBY ? "SUNDAY · DERBY DAY" : t >= FREEZE ? "DAY 1 · SILENCE" : "DAY 1 AT THE NEW JOB"; if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= FREEZE ? C.coralD : C.ink; });

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 50) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble(`Então… és de que clube?${sub("(So… which club are you?)")}`, 30, 640, 560, 150, Q, SHRUG - .05, 46);
  bubble("I don't really follow football.", 400, 660, 560, 200, SHRUG, FREEZE + .4, 46);
  bubble("BENFICA!", 600, 620, 360, 180, RED, GRN, 64);
  bubble("SPORTING!", 40, 620, 380, 160, GRN, BLU, 64);
  bubble("PORTO!", 640, 620, 320, 160, BLU, CHOOSE, 64);
  bubble(`Tens de escolher!${sub("(You have to choose!)")}`, 30, 640, 480, 180, CHOOSE, ALL, 50);
  bubble("…Can I have all three?", 360, 660, 520, 200, ALL + .4, DERBY - .1, 48);
  const sb = E.el(S.el, "abs", "left:60px;top:1560px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "PICK ONE.", DERBY + 1.4, { size: 120, rot: -6, bg: C.coralD, shake: 12 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/office.wav", { vol: 3, duck: false, to: FREEZE });
  E.clip(Q, "voices/ep66/m_clube.wav", { vol: 1.2 });
  E.clip(SHRUG, "voices/ep66/o_follow.wav", { vol: 1.15 });
  E.S(FREEZE, "scratch", 1); E.clip(FREEZE + .2, "sfx/record-silence.wav", { vol: .5 });
  E.clip(RED, "voices/ep66/p_benfica.wav", { vol: 1.25 }); E.S(RED, "whoosh", .6);
  E.clip(GRN, "voices/ep66/z_sporting.wav", { vol: 1.25 }); E.S(GRN, "whoosh", .6);
  E.clip(BLU, "voices/ep66/v_porto.wav", { vol: 1.25 }); E.S(BLU, "whoosh", .6);
  E.clip(RED + .3, "sfx/stadium-goal.wav", { vol: .3, to: CHOOSE - RED - .3 });
  E.clip(CHOOSE, "voices/ep66/m_escolher.wav", { vol: 1.25 });
  E.S(ALL, "poof", .8); E.clip(ALL + .4, "voices/ep66/o_three.wav", { vol: 1.2 });
  E.S(DERBY, "whoosh", .5); E.clip(DERBY, "sfx/cafe-tv-crowd.wav", { vol: .5, duck: false });
  E.S(DERBY + .8, "scratch", .8);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "“Which *club* are you?”", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[16.6, 1], [16.85, 1.18, "out"], [17.2, 1, "io"]]);
}
