// EP.70 "Explaining your remote job to grandma" — English-first. Grandma, squinting: "So… you don't go to work… but you have money?"
// Otto: "I work from home, Grandma. On the computer." Then the village gossip chain: "He doesn't work. But he has money." → "…A spy!"
// → an old man, in Portuguese: "É da máfia." (He's in the mafia.) The RUMOUR card escalates. Otto walks into the café: silence; the
// barman, sweating: "For you… it's free." The priest blesses him: "Que Deus o proteja." (May God protect you.) Otto: "…I do Excel."
export const meta = {
  id: "ep70-remotejob", date: "2026-12-02",
  images: {
    sk: "characters/cutouts/dona_skeptical.webp", kn: "characters/cutouts/dona_knowing.webp", shrug: "characters/cutouts/otto-casual_shrug.webp", awk: "characters/cutouts/otto-casual_awkward.webp",
    gos: "characters/cutouts/gossip_ladies.webp", old: "characters/cutouts/oldman_ask.webp", bar: "characters/cutouts/barman_nervous.webp", pr: "characters/cutouts/priest_bless.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 57, seed: 701, prog: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]] });
  const DUR = 19.8, FLOOR = 1740, Q = .3, HOME = 4.6, GOS = 6.9, SPY = 9.7, MAF = 10.8, CAFE = 12.2, FREE = 12.6, DEUS = 15.3, EXCEL = 16.8;
  const S = E.scene("remote", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };
  const fig = (P, n, w, h, s, left, bottom, z = 3) => { const el = E.el(P, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  // ================= 1) grandma's living room =================
  const A = layer(0, GOS);
  E.el(A, "abs", "inset:0;background:#f3e2c6");
  E.el(A, "abs", "left:0;top:0;width:1080px;height:1920px;background-image:radial-gradient(rgba(160,90,60,.12) 3px,transparent 4px);background-size:60px 60px");
  E.el(A, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background:repeating-linear-gradient(90deg,#b98a5e 0 160px,#a97c52 160px 320px)`);
  const lap = E.el(A, "abs", "left:170px;top:1260px;width:300px;height:190px;background:#3d4650;border-radius:14px 14px 4px 4px;z-index:4;padding:12px;box-sizing:border-box");
  const scr = E.el(lap, "", "width:100%;height:100%;background:#fff;border-radius:6px;padding:10px;box-sizing:border-box;display:grid;grid-template-columns:repeat(4,1fr);gap:4px");
  for (let i = 0; i < 16; i++) E.el(scr, "", `background:${i < 4 ? "#1f7a3a" : "#e7eef3"};border-radius:2px;height:22px`);
  E.el(A, "abs", "left:140px;top:1450px;width:360px;height:22px;background:#2b2f35;border-radius:4px;z-index:4");
  E.el(A, "abs", "left:120px;top:1472px;width:420px;height:30px;background:#8a5a2b;z-index:4");
  const ow = E.el(A, "abs", "left:-60px;top:0;width:1px;height:1px;z-index:3");
  const o1 = E.img(ow, "shrug", `position:absolute;left:0;top:${FLOOR + 40 - 1055 * .78}px;width:${702 * .78}px;height:${1055 * .78}px`);
  const gw = E.el(A, "abs", "left:520px;top:0;width:1px;height:1px;z-index:3");
  const g1 = E.img(gw, "sk", `position:absolute;left:0;top:${FLOOR + 40 - 1014 * .82}px;width:${665 * .82}px;height:${1014 * .82}px`);
  const gb = []; for (let t = 0; t < GOS; t += .8) gb.push([t, 0, "io"], [t + .4, -6, "io"]);
  E.K(gw, "y", gb);                                                                                                     // frame-0 motion
  const eyes = E.el(A, "abs", "left:760px;top:760px;font-weight:900;font-size:60px;color:#1d2b36;z-index:5;opacity:0", "?");
  E.K(eyes, "o", [[HOME + 1.2, 0], [HOME + 1.3, 1]]); E.K(eyes, "s", [[HOME + 1.2, .5], [HOME + 1.5, 1.3, "back"]]);

  // ================= 2) the gossip chain =================
  const B = layer(GOS, CAFE);
  E.el(B, "abs", "inset:0;background:linear-gradient(180deg,#8fd0f5,#dff2fb)");
  const HC = ["#f5c9a8", "#ffe29a", "#bfe0d6", "#f7b7b7"];
  for (let i = 0; i < 4; i++) { const h = E.el(B, "abs", `left:${-20 + i * 280}px;top:${700 - (i % 2) * 80}px;width:290px;height:${FLOOR - 700 + (i % 2) * 80}px;background:${HC[i]}`); E.el(h, "abs", "left:0;top:0;width:100%;height:22px;background:#c0643f"); for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) E.el(h, "abs", `left:${46 + k * 120}px;top:${70 + r * 200}px;width:70px;height:120px;background:#3d5a73;border:8px solid #fff;border-radius:35px 35px 4px 4px`); }
  E.el(B, "abs", `left:0;top:${FLOOR - 60}px;width:1080px;height:${1920 - FLOOR + 60}px;background:repeating-linear-gradient(135deg,#ece6d8 0 30px,#d9d0bd 30px 60px)`);
  const gl = fig(B, "gos", 750, 755, .92, 20, FLOOR + 30, 3);
  E.K(gl, "x", [[MAF - .2, 0], [MAF + .2, -300, "in"]]);
  const om = fig(B, "old", 480, 1037, .8, 700, FLOOR + 30, 3);
  E.K(om, "o", [[MAF - .21, 0], [MAF - .2, 1]]); E.K(om, "x", [[MAF - .2, 400], [MAF + .1, -220, "out"]]);
  // the rumour card
  const card = E.el(S.el, "abs", "left:120px;top:460px;width:840px;background:#fffdf3;border:8px solid #1d2b36;border-radius:18px;padding:14px 20px;box-sizing:border-box;z-index:9;text-align:center;opacity:0;box-shadow:0 12px 26px rgba(0,0,0,.2)");
  E.el(card, "", "font-weight:900;font-size:30px;color:#e5484d;letter-spacing:.1em", "THE RUMOUR");
  const rs = E.el(card, "", `font-weight:900;font-size:50px;color:${C.ink};line-height:1.1`, "");
  const RUM = [[GOS, "“He doesn't work. But he has money.”"], [SPY, "“He's a SPY.”"], [MAF, "“He's in the MAFIA.”"]];
  E.F(t => { const s = at([[0, ""], ...RUM], t); if (rs.textContent !== s) rs.textContent = s; card.style.opacity = t >= GOS + .2 && t < FREE ? 1 : 0; });
  RUM.forEach(([t]) => E.K(card, "s", [[t + .19, 1], [t + .2, 1.12], [t + .45, 1, "out"]]));
  const lvl = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  E.F(t => { const n = t < GOS ? 0 : t < SPY ? 1 : t < MAF ? 3 : t < CAFE ? 5 : 5, s = t < GOS ? "GRANDMA · SUSPICIOUS" : t >= EXCEL ? "TRUTH: EXCEL" : `RUMOUR LEVEL: ${"■".repeat(n)}${"□".repeat(5 - n)}`; if (lvl.textContent !== s) lvl.textContent = s; lvl.style.background = n >= 5 && t < EXCEL ? C.coralD : C.ink; });

  // ================= 3) the café =================
  const Cl = layer(CAFE, DUR);
  E.el(Cl, "abs", "inset:0;background:#efe0c7");
  const tile = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#f8f5ee'/><rect x='2' y='2' width='116' height='116' rx='5' fill='none' stroke='#c9d8ea' stroke-width='3'/><g fill='#2f6db5'><circle cx='60' cy='60' r='9'/><ellipse cx='60' cy='36' rx='8' ry='15'/><ellipse cx='60' cy='84' rx='8' ry='15'/><ellipse cx='36' cy='60' rx='15' ry='8'/><ellipse cx='84' cy='60' rx='15' ry='8'/></g></svg>`;
  E.el(Cl, "abs", `left:0;top:900px;width:1080px;height:560px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tile)}");background-size:120px 120px`);
  const br = fig(Cl, "bar", 662, 900, .82, 460, 1440, 1);
  const shk = []; for (let t = CAFE; t < DUR; t += .12) shk.push([t, (Math.round(t * 8) % 2) ? 3 : -3]); E.K(br, "x", shk);
  E.el(Cl, "abs", "left:0;top:1420px;width:1080px;height:500px;background:#6a3e1e;z-index:2"); E.el(Cl, "abs", "left:0;top:1420px;width:1080px;height:30px;background:#a8764c;z-index:2");
  fig(Cl, "awk", 488, 1078, .8, 20, 1860, 4);
  const pr = fig(Cl, "pr", 412, 1028, .82, 1080, 1860, 5);
  E.K(pr, "x", [[DEUS - .4, 0], [DEUS, -400, "out"]]);
  const halo = E.el(Cl, "abs", "left:80px;top:975px;width:260px;height:40px;border-radius:50%;border:8px solid #ffd23f;box-shadow:0 0 20px #ffd23f;z-index:5;opacity:0");
  E.K(halo, "o", [[DEUS + .3, 0], [DEUS + .5, 1]]);
  const q2 = E.el(Cl, "abs", "left:0;top:0;width:1080px;height:1920px;z-index:6;pointer-events:none;opacity:0");
  for (const [x, y] of [[560, 1000], [880, 1080]]) E.el(q2, "abs", `left:${x}px;top:${y}px;font-weight:900;font-size:60px;color:#1d2b36`, "…");
  E.K(q2, "o", [[CAFE + .2, 0], [CAFE + .3, 1], [FREE, 1], [FREE + .1, 0]]);

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble("So… you don't go to work… but you have money?", 420, 640, 620, 330, Q, HOME - .05, 44);
  bubble("I work from home, Grandma. On the computer.", 30, 700, 560, 180, HOME, GOS - .05, 44);
  bubble("…A spy!", 250, 900, 300, 120, SPY, MAF - .05, 56);
  bubble(`É da máfia.${sub("(He's in the mafia.)")}`, 500, 820, 420, 200, MAF, CAFE - .05, 52);
  bubble("For you… it's free.", 480, 560, 460, 200, FREE, DEUS - .05, 52);
  bubble(`Que Deus o proteja.${sub("(May God protect you.)")}`, 440, 560, 560, 460, DEUS, EXCEL - .05, 46);
  bubble("…I do Excel.", 30, 830, 400, 150, EXCEL, DUR - .4, 56);
  const sb = E.el(S.el, "abs", "left:60px;top:470px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "HE DOES EXCEL.", EXCEL + 1.4, { size: 110, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(Q, "voices/ep70/g_money.wav", { vol: 1.2 });
  E.clip(HOME, "voices/ep70/o_home.wav", { vol: 1.15 });
  E.S(GOS, "whoosh", .5); E.clip(GOS, "sfx/street-sunny.wav", { vol: 2.2, duck: false, to: CAFE - GOS });
  E.clip(GOS + .1, "voices/ep70/m_whisper.wav", { vol: 1.3 });
  E.clip(SPY, "voices/ep70/n_spy.wav", { vol: 1.3 }); E.S(SPY + .1, "ding", .5);
  E.clip(MAF, "voices/ep70/v_mafia.wav", { vol: 1.35 }); E.S(MAF + .1, "scratch", .6);
  E.S(CAFE, "whoosh", .5); E.clip(CAFE + .1, "sfx/record-silence.wav", { vol: .4 });
  E.clip(FREE, "voices/ep70/c_free.wav", { vol: 1.25 }); E.clip(FREE + 1.6, "sfx/plate-down.wav", { vol: .5 });
  E.clip(DEUS - .2, "sfx/angel-choir.wav", { vol: .5 }); E.clip(DEUS, "voices/ep70/p_deus.wav", { vol: 1.3 });
  E.clip(EXCEL, "voices/ep70/o_excel.wav", { vol: 1.25 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "Explaining *remote work* to grandma", { size: 42, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[19.0, 1], [19.25, 1.18, "out"], [19.6, 1, "io"]]);
}
