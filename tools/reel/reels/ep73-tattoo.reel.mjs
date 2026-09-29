// EP.73 "Showing mum your first tattoo" — English-first. The teen, nervous: "Mum… I got a tattoo. A tiny one." A plate smashes off
// screen; Mum slides in: "A TATTOO?!" then, to the heavens, the classic Portuguese line: "Ai, meu Deus! O que é que os vizinhos vão
// dizer?!" (What will the neighbours say?!) Across the street the shutters fly open one by one, neighbours peeking… and the last
// window is Grandma's. She is in the kitchen a second later, squinting at the tiny heart: "…That's it?" She rolls up her sleeve: a
// huge sailor tattoo, an anchor and a heart that says RUI. "Amateur." Mum: "Mãe… who is RUI?!" Grandma: "Shh. Don't tell your father."
export const meta = {
  id: "ep73-tattoo", date: "2026-12-05",
  images: {
    tw: "characters/cutouts/teen_wrist.webp", mh: "characters/cutouts/mum_horror.webp", sk: "characters/cutouts/dona_skeptical.webp",
    kn: "characters/cutouts/dona_knowing.webp", sl: "characters/cutouts/dona_sleeve.webp",
    gos: "characters/cutouts/gossip_ladies.webp", old: "characters/cutouts/oldman_ask.webp", lady: "characters/cutouts/lady_ask.webp", pr: "characters/cutouts/priest_bless.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 55, seed: 733, prog: [[0, 4, 7], [5, 9, 12], [2, 5, 9], [7, 11, 14]] });
  const DUR = 20.8, FLOOR = 1760, Q = .4, CRASH = 3.55, WHAT = 3.7, VIZ = 4.95, WIN = 8.05, GW = 9.9, GRAN = 11.1, IT = 11.5,
    SLEEVE = 12.9, AMA = 13.5, RUI = 14.8, DAD = 16.9, FAINT = 18.95;
  const S = E.scene("tattoo", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };

  // ================= the kitchen =================
  const K = E.el(S.el, "abs", "inset:0;overflow:hidden");
  E.K(K, "o", [[WIN - .01, 1], [WIN, 0], [GRAN - .01, 0], [GRAN, 1]]);
  E.el(K, "abs", "inset:0;background:#f4ead8");
  const tile = `<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90'><rect width='90' height='90' fill='#fbf8f1'/><rect x='2' y='2' width='86' height='86' rx='4' fill='none' stroke='#cfdcec' stroke-width='3'/><circle cx='45' cy='45' r='14' fill='none' stroke='#2f6db5' stroke-width='4'/><circle cx='45' cy='45' r='4' fill='#2f6db5'/></svg>`;
  E.el(K, "abs", `left:0;top:880px;width:1080px;height:420px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tile)}");background-size:90px 90px`);
  E.el(K, "abs", "left:0;top:1300px;width:1080px;height:40px;background:#8a5a2b");
  E.el(K, "abs", `left:0;top:1340px;width:1080px;height:${FLOOR - 1340}px;background:#d9c7a8`);
  for (let i = 0; i < 4; i++) E.el(K, "abs", `left:${40 + i * 260}px;top:1380px;width:220px;height:${FLOOR - 1420}px;border:6px solid #b89c74;border-radius:10px;box-sizing:border-box`);
  E.el(K, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background:repeating-linear-gradient(90deg,#c9a06a 0 160px,#b88f5c 160px 320px)`);
  // the window over the sink, the street outside
  const win = E.el(K, "abs", "left:600px;top:470px;width:400px;height:360px;background:linear-gradient(180deg,#8fd0f5,#dff2fb);border:14px solid #fff;border-radius:10px;box-shadow:inset 0 0 0 6px #e7dcc6;overflow:hidden");
  E.el(win, "abs", "left:30px;top:140px;width:160px;height:260px;background:#f5c9a8"); E.el(win, "abs", "left:210px;top:100px;width:170px;height:300px;background:#ffe29a");
  E.el(win, "abs", "left:186px;top:0;width:14px;height:100%;background:#fff");
  // a dish rack of plates
  for (let i = 0; i < 4; i++) E.el(K, "abs", `left:${120 + i * 36}px;top:1180px;width:26px;height:110px;border-radius:13px;background:#fff;border:3px solid #cfd6dc;box-sizing:border-box`);

  const fig = (P, n, w, h, s, left, z = 3) => { const el = E.el(P, "abs", `left:${left}px;top:${FLOOR + 30 - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  // the teen (left)
  const TS = .74, teen = fig(K, "tw", 423, 996, TS, 20, 4);
  const tb = []; for (let t = 0; t < WHAT; t += .7) tb.push([t, 0, "io"], [t + .35, -8, "io"]); E.K(teen, "y", tb);   // frame-0 motion
  E.K(teen, "x", [[WHAT - .1, 0], [WHAT + .1, -18, "out"], [WHAT + .4, 0, "io"]]);
  // mum (right): slides in on the crash; faints at the end
  const MS = .76, mum = fig(K, "mh", 371, 998, MS, 780, 5);
  E.K(mum, "x", [[CRASH, 420], [CRASH + .25, 0, "out"]]);
  const mshake = []; for (let t = VIZ; t < VIZ + 2.9; t += .1) mshake.push([t, (Math.round(t * 10) % 2) ? 1.5 : -1.5]); mshake.push([VIZ + 3, 0]);
  E.K(mum, "r", [...mshake, [FAINT, 0], [FAINT + .45, 88, "in"]]);
  E.K(mum, "y", [[FAINT, 0], [FAINT + .45, 60, "in"]]);
  // shards of the dropped plate
  const shards = [0, 1, 2, 3, 4].map(i => E.el(K, "abs", `left:${1000}px;top:${FLOOR - 20}px;width:${30 + i * 6}px;height:${16 + i * 3}px;background:#fff;border:3px solid #cfd6dc;border-radius:4px;z-index:6;opacity:0`));
  shards.forEach((s, i) => { E.K(s, "o", [[CRASH - .01, 0], [CRASH, 1], [VIZ, 1], [VIZ + .3, 0]]); E.K(s, "x", [[CRASH, 0], [CRASH + .4, -140 - i * 60, "out"]]); E.K(s, "y", [[CRASH, 0], [CRASH + .2, -60 - i * 15, "out"], [CRASH + .4, 0, "in"]]); E.K(s, "r", [[CRASH, 0], [CRASH + .4, 200 + i * 90]]); });
  // grandma (middle): appears the instant her shutter closes
  const GS = .72, gw = E.el(K, "abs", "left:300px;top:0;width:1px;height:1px;z-index:4");
  const g1 = E.img(gw, "sk", `position:absolute;left:30px;top:${FLOOR + 30 - 1014 * GS}px;width:${665 * GS}px;height:${1014 * GS}px`);
  const g2 = E.img(gw, "sl", `position:absolute;left:0;top:${FLOOR + 30 - 985 * GS}px;width:${628 * GS}px;height:${985 * GS}px;opacity:0`);
  E.F(t => { const on = t >= GRAN, s = t >= SLEEVE; g1.style.opacity = on && !s ? 1 : 0; g2.style.opacity = on && s ? 1 : 0; });
  E.K(gw, "s", [[GRAN, .6], [GRAN + .25, 1, "back"], [SLEEVE - .01, 1], [SLEEVE, 1.08], [SLEEVE + .3, 1, "out"]]);
  // RUI on the banner of the tattoo (banner centre in the cutout: 70,344, tilted −17°)
  const rui = E.el(gw, "abs", `left:${70 * GS - 40}px;top:${FLOOR + 30 - 985 * GS + 344 * GS - 10}px;width:80px;height:20px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:15px;color:#b23a2e;letter-spacing:.06em;transform:rotate(-17deg);opacity:0`, "RUI");
  E.K(rui, "o", [[SLEEVE - .01, 0], [SLEEVE, 1]]);
  const poof = E.el(K, "abs", "left:330px;top:1100px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.95),rgba(255,255,255,0) 70%);z-index:6;opacity:0");
  E.K(poof, "o", [[GRAN - .01, 0], [GRAN, 1], [GRAN + .35, 0]]); E.K(poof, "s", [[GRAN, .5], [GRAN + .35, 1.4, "out"]]);

  // callouts: the tiny heart (magnifier) and the big tattoo (zoom)
  const callout = (n, w, h, s, cx, cy, left, top, d, t0, t1, ring) => {
    const c = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${d}px;height:${d}px;border-radius:50%;overflow:hidden;background:#fbe3cc;border:12px solid ${ring};box-shadow:0 12px 30px rgba(0,0,0,.25);z-index:9;opacity:0`);
    E.img(c, n, `position:absolute;left:${d / 2 - cx * s}px;top:${d / 2 - cy * s}px;width:${w * s}px;height:${h * s}px`);
    E.pop(c, t0, { from: .3, dur: .3 }); E.K(c, "o", [[t0, 0], [t0 + .08, 1], [t1 - .1, 1], [t1, 0]]);
    return c;
  };
  const mag = callout("tw", 423, 996, 5, 348, 422, 330, 600, 300, IT - .3, SLEEVE - .05, "#3d4650");
  E.el(mag, "abs", "left:0;top:0;width:100%;height:100%;border-radius:50%;box-shadow:inset 0 0 0 6px rgba(255,255,255,.5)");
  const handle = E.el(S.el, "abs", "left:560px;top:880px;width:34px;height:150px;border-radius:17px;background:#3d4650;transform:rotate(-40deg);z-index:8;opacity:0");
  E.K(handle, "o", [[IT - .3, 0], [IT - .22, 1], [SLEEVE - .15, 1], [SLEEVE - .05, 0]]);
  const zoom = callout("sl", 628, 985, 3.2, 72, 330, 600, 500, 400, SLEEVE + .15, RUI - .1, "#1d2b36");
  E.el(zoom, "abs", `left:${200 + (70 - 72) * 3.2 - 80}px;top:${200 + (344 - 330) * 3.2 - 24}px;width:160px;height:48px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:40px;color:#b23a2e;letter-spacing:.08em;transform:rotate(-17deg)`, "RUI");

  // ================= across the street =================
  const W = layer(WIN, GRAN);
  E.el(W, "abs", "inset:0;background:linear-gradient(180deg,#8fd0f5,#dff2fb)");
  E.el(W, "abs", "left:40px;top:470px;width:1000px;height:1450px;background:#f7d9a8;border-top:26px solid #c0643f");
  E.el(W, "abs", "left:40px;top:470px;width:1000px;height:1450px;background-image:repeating-linear-gradient(0deg,rgba(0,0,0,.03) 0 4px,transparent 4px 60px)");
  const SLOT = [[100, 560, "gos", 750, 755, .5, -40], [580, 560, "old", 480, 1037, .5, 10], [100, 1000, "lady", 546, 1031, .5, 20], [580, 1000, "pr", 412, 1028, .52, 40], [300, 1400, "kn", 665, 1014, .62, -10]];
  const OPEN = [8.2, 8.6, 9.0, 9.4, GW];
  SLOT.forEach(([x, y, n, w, h, s, dx], i) => {
    const big = i === 4, ww = big ? 480 : 400, wh = big ? 380 : 320;
    const f = E.el(W, "abs", `left:${x}px;top:${y}px;width:${ww}px;height:${wh}px;background:#2b3a4a;border:12px solid #fff;border-radius:${ww / 2}px ${ww / 2}px 6px 6px;overflow:hidden;box-sizing:border-box`);
    E.img(f, n, `position:absolute;left:${ww / 2 - w * s / 2 + dx}px;top:${big ? 40 : 30}px;width:${w * s}px;height:${h * s}px`);
    E.el(W, "abs", `left:${x - 20}px;top:${y + wh - 6}px;width:${ww + 40}px;height:26px;background:#c0643f;border-radius:6px`);
    // two green shutters that swing open
    for (const side of [0, 1]) {
      const sh = E.el(W, "abs", `left:${x + side * ww / 2}px;top:${y}px;width:${ww / 2}px;height:${wh}px;background:repeating-linear-gradient(0deg,#2f7d4f 0 22px,#256a41 22px 28px);border:6px solid #1f5a37;box-sizing:border-box;transform-origin:${side ? "100%" : "0"} 50%`);
      E.K(sh, "sx", [[OPEN[i], 1], [OPEN[i] + .22, .06, "out"]]);
    }
  });
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  const P = [[0, "THE TATTOO: 1 CM"], [WIN, "NEIGHBOURS WHO KNOW: 0"], [8.2, "NEIGHBOURS WHO KNOW: 1"], [8.6, "NEIGHBOURS WHO KNOW: 2"], [9.0, "NEIGHBOURS WHO KNOW: 3"], [9.4, "NEIGHBOURS WHO KNOW: 4"], [GW, "…AND GRANDMA"], [GRAN, "THE TATTOO: 1 CM"], [SLEEVE, "GRANDMA'S: 40 CM"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = s.startsWith("…AND") || s.startsWith("GRANDMA") ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble("Mum… I got a tattoo. A tiny one.", 40, 880, 540, 120, Q, CRASH, 46);
  bubble("A TATTOO?!", 560, 860, 440, 300, WHAT, VIZ - .05, 60);
  bubble(`Ai, meu Deus! O que é que os vizinhos vão dizer?!${sub("(Oh my God! What will the neighbours say?!)")}`, 330, 620, 700, 540, VIZ, WIN, 44);
  bubble("…That's it?", 330, 950, 340, 150, IT, SLEEVE - .05, 54);
  bubble("Amateur.", 330, 960, 320, 150, AMA, RUI - .05, 60);
  bubble("Mãe… who is RUI?!", 560, 860, 480, 330, RUI, DAD - .05, 50);
  bubble("Shh. Don't tell your father.", 260, 930, 520, 200, DAD, DUR - .4, 48);
  const sb = E.el(S.el, "abs", "left:60px;top:560px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "SINCE 1968.", FAINT + .5, { size: 120, rot: -6, bg: "#1f5fa8", shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(Q, "voices/ep73/t_tattoo.wav", { vol: 1.2 });
  E.clip(CRASH - .1, "sfx/plate-smash.wav", { vol: 1.0 });
  E.S(CRASH, "whoosh", .5); E.clip(WHAT, "voices/ep73/m_what.wav", { vol: 1.25 });
  E.clip(VIZ, "voices/ep73/m_vizinhos.wav", { vol: 1.3 });
  E.S(WIN, "whoosh", .5); E.clip(WIN, "sfx/street-sunny.wav", { vol: 1.6, duck: false, to: GRAN - WIN });
  OPEN.forEach((t, i) => { E.clip(t, "sfx/shutter-open.wav", { vol: 1.3 }); if (i < 4) E.clip(t + .15, "sfx/crowd-murmur.wav", { vol: .35, to: .6, duck: false }); });
  E.S(GW + .2, "ding", .5);
  E.S(GRAN, "poof", .7);
  E.S(IT - .3, "pop", .5); E.clip(IT, "voices/ep73/g_thatsit.wav", { vol: 1.3 });
  E.S(SLEEVE - .05, "scratch", .5); E.clip(SLEEVE, "sfx/accordion-sting.wav", { vol: .8 }); E.S(SLEEVE + .15, "sparkle", .6);
  E.clip(AMA, "voices/ep73/g_amateur.wav", { vol: 1.3 });
  E.clip(RUI, "voices/ep73/m_rui.wav", { vol: 1.25 });
  E.clip(DAD, "voices/ep73/g_father.wav", { vol: 1.4 });
  E.S(FAINT + .4, "thud", .9);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "Showing mum your first *tattoo*", { size: 50, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[20.0, 1], [20.25, 1.18, "out"], [20.6, 1, "io"]]);
}
