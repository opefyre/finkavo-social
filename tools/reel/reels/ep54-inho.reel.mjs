// EP.54 "What '-inho' really means" — Portuguese diminutives, as dictionary cards. UM MINUTINHO (the cashier: "Só um minutinho!"),
// literally "a tiny minute", really 45 minutes: Otto grows a beard. UM BOCADINHO (grandma: "Come só um bocadinho!"), "a tiny bit",
// really a food tower. UMA VOLTINHA (Marta: "just a little voltinha!"), "a little stroll", really 23,412 steps up a hill. Finale: Otto
// at the café, "Obrigadinho!" — the café cheers: -INHO MASTERED. Voiced (cashier, grandma, Marta, Otto) + ticks, thuds, cheers.
export const meta = {
  id: "ep54-inho", date: "2026-11-16",
  images: {
    ex: "characters/cutouts/otto-casual_excited.webp", anc: "characters/cutouts/otto-casual_ancient.webp", tower: "characters/cutouts/otto-tower_3.webp",
    hike: "characters/cutouts/otto-casual_hike.webp", proud: "characters/cutouts/otto-casual_proud.webp",
    cash: "characters/cutouts/cashier_ask.webp", gran: "characters/cutouts/dona_knowing.webp", marta: "characters/cutouts/marta_default.webp", bar: "characters/cutouts/barman_smile.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 60, seed: 541, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 18.0, FLOOR = 1640, V2 = 5.4, V3 = 10.4, FIN = 14.8;
  const S = E.scene("inho", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };
  const img = (P, n, w, h, s, left, bottom, z = 2) => { const el = E.el(P, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  const counter = (P, top, col, edge) => { E.el(P, "abs", `left:0;top:${top}px;width:1080px;height:${1920 - top}px;background:${col};z-index:3`); E.el(P, "abs", `left:0;top:${top}px;width:1080px;height:26px;background:${edge};z-index:3`); };

  // ================= 1) UM MINUTINHO =================
  const A = layer(0, V2);
  E.el(A, "abs", "inset:0;background:#fdf6e9");
  for (let r = 0; r < 3; r++) { E.el(A, "abs", `left:0;top:${860 + r * 170}px;width:1080px;height:14px;background:#d8c9ae`); for (let k = 0; k < 14; k++) E.el(A, "abs", `left:${10 + k * 76}px;top:${860 + r * 170 - 84 - (k % 4) * 8}px;width:58px;height:${84 + (k % 4) * 8}px;border-radius:6px 6px 3px 3px;background:${["#e5484d", "#f2b632", "#2f6db5", "#35a06f", "#ff8a3d", "#9b59b6"][(k + r * 2) % 6]}`); }
  img(A, "cash", 522, 1057, .8, 600, 1760, 1);
  counter(A, 1420, "#3d4650", "#6b7682");
  const o1 = E.el(A, "abs", `left:20px;top:0;width:1px;height:1px;z-index:4`);
  const e1 = E.img(o1, "ex", `position:absolute;left:0;top:${1780 - 1078 * .8}px;width:${625 * .8}px;height:${1078 * .8}px`);
  const a1 = E.img(o1, "anc", `position:absolute;left:0;top:${1780 - 1078 * .8}px;width:${625 * .8}px;height:${1078 * .8}px;opacity:0`);
  E.F(t => { const o = t >= 3.7; e1.style.opacity = o ? 0 : 1; a1.style.opacity = o ? 1 : 0; });
  const b1 = []; for (let t = 0; t < 2.2; t += .8) b1.push([t, 0, "io"], [t + .4, -8, "io"]);
  E.K(o1, "y", b1);                                                                                                     // frame-0 motion
  const clk = E.el(A, "abs", "left:620px;top:720px;width:180px;height:180px;border-radius:50%;background:#fff;border:10px solid #1d2b36;z-index:2");
  const mh = E.el(clk, "abs", "left:86px;top:14px;width:8px;height:76px;background:#e5484d;border-radius:4px;transform-origin:50% 100%");
  E.F(t => { const m = Math.max(0, Math.min(45, (t - 2.2) / 1.6 * 45)); mh.style.transform = `rotate(${m * 6 * 8}deg)`; });

  // ================= 2) UM BOCADINHO =================
  const B = layer(V2, V3);
  const tile = `<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90'><rect width='90' height='90' fill='#f7f3ea'/><rect x='2' y='2' width='86' height='86' rx='4' fill='none' stroke='#9fc0e0' stroke-width='3'/><circle cx='45' cy='45' r='14' fill='none' stroke='#2f6db5' stroke-width='6'/></svg>`;
  E.el(B, "abs", `inset:0;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tile)}");background-size:90px 90px`);
  E.el(B, "abs", `left:0;top:${FLOOR}px;width:1080px;height:${1920 - FLOOR}px;background:#c89a64`);
  const gb = img(B, "gran", 665, 1014, .82, 560, FLOOR + 30, 2);
  const o2 = E.el(B, "abs", `left:0;top:0;width:1px;height:1px;z-index:3`);
  const e2 = E.img(o2, "ex", `position:absolute;left:30px;top:${FLOOR + 30 - 1078 * .8}px;width:${625 * .8}px;height:${1078 * .8}px`);
  const t2 = E.img(o2, "tower", `position:absolute;left:-40px;top:${FLOOR + 30 - 1344 * 1.0}px;width:${752 * 1.0}px;height:${1344 * 1.0}px;opacity:0`);
  E.F(t => { const o = t >= V2 + 2.4; e2.style.opacity = o ? 0 : 1; t2.style.opacity = o ? 1 : 0; });
  E.K(o2, "y", [[V2 + 2.4, -30], [V2 + 2.6, 0, "in"], [V2 + 2.7, -10, "out"], [V2 + 2.85, 0, "in"]]);

  // ================= 3) UMA VOLTINHA =================
  const Cc = layer(V3, FIN);
  E.el(Cc, "abs", "inset:0;background:linear-gradient(180deg,#8fd0f5,#dff2fb)");
  E.el(Cc, "abs", "left:-200px;top:880px;width:1500px;height:1400px;border-radius:50%;background:#6cae5a");
  E.el(Cc, "abs", "left:380px;top:780px;width:180px;height:130px;background:#c9b48a;clip-path:polygon(0 100%,0 30%,20% 30%,20% 0,40% 0,40% 30%,60% 30%,60% 0,80% 0,80% 30%,100% 30%,100% 100%)");   // a castle on top
  const path = E.el(Cc, "abs", "left:0;top:0;width:1080px;height:1920px", `<svg width="1080" height="1920"><path d="M-20 1800 C 300 1700, 700 1500, 470 1300 S 500 1000, 470 930" fill="none" stroke="#e9d9a8" stroke-width="40" stroke-linecap="round"/></svg>`);
  E.el(Cc, "abs", `left:0;top:${FLOOR + 40}px;width:1080px;height:${1920 - FLOOR}px;background:#5a9a4a`);
  img(Cc, "marta", 498, 1017, .78, 600, FLOOR + 60, 3);
  const o3 = E.el(Cc, "abs", `left:0;top:0;width:1px;height:1px;z-index:4`);
  const e3 = E.img(o3, "ex", `position:absolute;left:30px;top:${FLOOR + 60 - 1078 * .78}px;width:${625 * .78}px;height:${1078 * .78}px`);
  const h3 = E.img(o3, "hike", `position:absolute;left:60px;top:${FLOOR + 60 - 990 * .82}px;width:${474 * .82}px;height:${990 * .82}px;opacity:0`);
  E.F(t => { const o = t >= V3 + 2.0; e3.style.opacity = o ? 0 : 1; h3.style.opacity = o ? 1 : 0; });
  const steps = E.el(Cc, "abs", "left:600px;top:470px;background:#1d2b36;color:#7cff9e;font-family:monospace;font-weight:900;font-size:50px;padding:8px 20px;border-radius:14px;z-index:5;opacity:0", "");
  E.F(t => { const u = Math.max(0, Math.min(1, (t - V3 - 1.1) / 2.1)), n = Math.round(u * u * 23412), s = `STEPS: ${n.toLocaleString("en")}`; if (steps.textContent !== s) steps.textContent = s; steps.style.opacity = t > V3 + 1.0 ? 1 : 0; });

  // ================= finale: OBRIGADINHO =================
  const D = layer(FIN, DUR);
  E.el(D, "abs", "inset:0;background:#efe0c7");
  const tileC = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#f8f5ee'/><rect x='2' y='2' width='116' height='116' rx='5' fill='none' stroke='#c9d8ea' stroke-width='3'/><g fill='#2f6db5'><circle cx='60' cy='60' r='9'/><ellipse cx='60' cy='36' rx='8' ry='15'/><ellipse cx='60' cy='84' rx='8' ry='15'/><ellipse cx='36' cy='60' rx='15' ry='8'/><ellipse cx='84' cy='60' rx='15' ry='8'/></g></svg>`;
  E.el(D, "abs", `left:0;top:900px;width:1080px;height:560px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tileC)}");background-size:120px 120px`);
  img(D, "bar", 856, 993, .7, 480, 1440 + 993 * .7 * .08, 1);
  counter(D, 1420, "#6a3e1e", "#a8764c");
  const o4 = img(D, "proud", 625, 1078, .8, 10, 1800, 4);
  E.K(o4, "y", [[FIN + .9, 0], [FIN + 1.1, -40, "out"], [FIN + 1.3, 0, "in"], [FIN + 1.45, -20, "out"], [FIN + 1.6, 0, "in"]]);
  const conf = Array.from({ length: 30 }, (_, i) => E.el(D, "abs", `left:${(i * 37) % 1080}px;top:0;width:18px;height:26px;background:${["#e5484d", "#f2b632", "#2f9e6f", "#2f6db5"][i % 4]};z-index:6;opacity:0`));
  E.F(t => conf.forEach((c, i) => { const u = (t - FIN - 1.0) / 2.2; c.style.opacity = u > 0 && u < 1 ? 1 : 0; c.style.transform = `translate(${Math.sin(u * 6 + i) * 40}px,${400 + u * (900 + (i % 5) * 80)}px) rotate(${u * 600 + i * 30}deg)`; }));

  // ================= the dictionary card (all scenes) =================
  const card = E.el(S.el, "abs", "left:60px;top:440px;width:500px;background:#fff;border-radius:22px;box-shadow:0 12px 26px rgba(0,0,0,.18);padding:18px 24px;box-sizing:border-box;z-index:8;border-left:14px solid #2f9e6f");
  const cw = E.el(card, "", `font-weight:900;font-size:46px;color:${C.ink};line-height:1.05`, "");
  const cl = E.el(card, "", "font-weight:800;font-size:28px;color:#7a8791;margin-top:8px", "");
  const cr = E.el(card, "", "font-weight:900;font-size:34px;color:#c0392b;margin-top:6px", "");
  const CARDS = [[0, "UM MINUTINHO", 1.6, "literally: a tiny minute", 4.0, "really: 45 minutes"], [V2, "UM BOCADINHO", V2 + 1.6, "literally: a tiny bit", V2 + 2.6, "really: this ↓"],
    [V3, "UMA VOLTINHA", V3 + 1.3, "literally: a little stroll", V3 + 3.3, "really: 23,412 steps"], [FIN, "OBRIGADINHO", FIN + .9, "literally: a tiny thank-you", FIN + 1.6, "really: you're one of us"]];
  E.F(t => {
    const c = at(CARDS.map(x => [x[0], x]), t);
    const w = c[1], l = t >= c[2] ? c[3] : "", r = t >= c[4] ? c[5] : "";
    if (cw.textContent !== w) cw.textContent = w; if (cl.textContent !== l) cl.textContent = l; if (cr.textContent !== r) cr.textContent = r;
    card.style.borderLeftColor = t >= FIN ? "#f2b632" : "#2f9e6f";
  });
  CARDS.forEach(c => { E.K(card, "x", [[c[0] - .01, 0], [c[0], -600], [c[0] + .3, 0, "out"]]); E.K(cr, "s", [[c[4] - .01, 1], [c[4], 1.3], [c[4] + .25, 1, "out"]]); });
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  E.F(t => { const m = Math.round(Math.max(0, Math.min(45, (t - 2.2) / 1.6 * 45))); const s = t < V2 ? `WAITING: ${m} min` : t < V3 ? "PORTION: “tiny”" : t < FIN ? "WALK: “short”" : "LEVEL: LOCAL"; if (pill.textContent !== s) pill.textContent = s; pill.style.background = t < V2 && m >= 45 ? C.coralD : t >= FIN ? "#1f7a3a" : C.ink; });

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 54) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:32px;padding:18px 26px 22px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Só um minutinho!", 580, 700, 440, 230, .5, 2.2, 52);
  bubble("Come só um bocadinho!", 540, 720, 480, 260, V2 + .3, V2 + 2.3, 50);
  bubble("Just a little voltinha!", 560, 780, 460, 170, V3 + .2, V3 + 2.8, 50);
  bubble("Obrigadinho!", 80, 820, 400, 170, FIN + .2, DUR - .5, 60);
  const sb = E.el(S.el, "abs", "left:60px;top:1500px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "-INHO: MASTERED.", FIN + 1.9, { size: 96, rot: -6, bg: C.mint, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(.5, "voices/ep54/m_minutinho.wav", { vol: 1.15 });
  for (let k = 0; k < 12; k++) E.S(2.2 + k * .13, "tick", .5);
  E.S(3.7, "poof", .8); E.S(4.0, "nope", .6);
  E.S(V2, "whoosh", .5); E.clip(V2 + .3, "voices/ep54/g_bocadinho.wav", { vol: 1.15 });
  for (let k = 0; k < 4; k++) E.S(V2 + 2.4 + k * .1, "thud", .5);
  E.S(V3, "whoosh", .5); E.clip(V3 + .2, "voices/ep54/z_voltinha.wav", { vol: 1.1 });
  E.clip(V3 + 2.0, "sfx/panting.wav", { vol: .7 });
  E.S(FIN, "whoosh", .5); E.clip(FIN + .2, "sfx/cafe-morning.wav", { vol: .3, duck: false });
  E.clip(FIN + .3, "voices/ep54/o_obrigadinho.wav", { vol: 1.2 }); E.clip(FIN + 1.0, "sfx/applause-cheer.wav", { vol: .7 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.95);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "What *“-inho”* really means", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[17.2, 1], [17.45, 1.18, "out"], [17.8, 1, "io"]]);
}
