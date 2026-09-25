// EP.46 "Quem é o último?" — the Portuguese invisible queue. 08:59: Otto is FIRST at the clinic reception, standing proudly by the
// window. An old man walks in: "Quem é o último?" (who's last?). Nobody answers (Otto has no idea). "Pronto… sou eu." — he sits, #1.
// Each newcomer asks the room, someone raises a finger ("Sou eu."), and they sit anywhere: dotted arrows link them into a web
// across the chairs, #1 → #5. "Wait… I was first!" "Próximo!" ×5 — they go in perfect order. 13:00, Otto steps up: "Almoço!", the
// shutter slams. Voiced (ElevenLabs, Portuguese with subtitles) + waiting-room ambience.
export const meta = {
  id: "ep46-ultimo", date: "2026-11-08",
  images: {
    ox: "characters/cutouts/otto-casual_excited.webp", oa: "characters/cutouts/otto-casual_awkward.webp", ob: "characters/cutouts/otto-casual_betrayed.webp",
    rec: "characters/cutouts/pharmacist_polite.webp",
    omA: "characters/cutouts/oldman_ask.webp", omS: "characters/cutouts/oldman_seated.webp",
    lyA: "characters/cutouts/lady_ask.webp", lyS: "characters/cutouts/lady_seated.webp",
    dnA: "characters/cutouts/dona_knowing.webp", dnS: "characters/cutouts/dona_seated.webp",
    leA: "characters/cutouts/leo_default.webp", leS: "characters/cutouts/leo_seated.webp",
    maA: "characters/cutouts/marta_default.webp", maS: "characters/cutouts/marta_seated.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 60, seed: 461, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 17.8, FLOOR = 1660, SS = .42;
  const S = E.scene("waiting", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  // ---------------- the waiting room ----------------
  E.el(S.el, "abs", "inset:0;background:#dff0ea");
  E.el(S.el, "abs", "left:0;top:1090px;width:1080px;height:36px;background:#b9dccf");
  E.el(S.el, "abs", `left:0;top:1300px;width:1080px;height:620px;background:linear-gradient(180deg,#c4ccc9,#d3d9d7)`);
  const clockW = E.el(S.el, "abs", "left:830px;top:470px;width:150px;height:150px;border-radius:50%;background:#fff;border:10px solid #1d2b36");
  const hh = E.el(clockW, "abs", "left:71px;top:30px;width:8px;height:46px;background:#1d2b36;border-radius:4px;transform-origin:50% 100%");
  const mh = E.el(clockW, "abs", "left:72px;top:14px;width:6px;height:62px;background:#e5484d;border-radius:3px;transform-origin:50% 100%");
  E.F(t => { const h = 8.98 + Math.max(0, Math.min(1, (t - 12.1) / 3.5)) * 4.02; hh.style.transform = `rotate(${h * 30}deg)`; mh.style.transform = `rotate(${(h % 1) * 360 + t * 40}deg)`; });
  E.el(S.el, "abs", "left:600px;top:500px;width:170px;height:96px;background:#fff;border-radius:14px;box-shadow:0 6px 12px rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:40px;color:#2f9e6f", "✚ SAÚDE");
  // the reception window, with the receptionist and a shutter
  const RW = E.el(S.el, "abs", "left:30px;top:650px;width:300px;height:330px;background:#fff;border:14px solid #8aa;border-radius:10px;overflow:hidden");
  E.img(E.el(RW, "abs", `left:${150 - 507 * .52 / 2}px;top:20px;width:${507 * .52}px;height:${1100 * .52}px`), "rec", `width:${507 * .52}px;height:${1100 * .52}px`);
  const shutter = E.el(RW, "abs", "left:0;top:0;width:100%;height:100%;background:repeating-linear-gradient(180deg,#9aa6ad 0 26px,#7f8b92 26px 30px);transform-origin:50% 0");
  E.K(shutter, "sy", [[0, 0], [15.55, 0], [15.75, 1, "in"]]);
  E.el(S.el, "abs", "left:20px;top:980px;width:320px;height:26px;background:#8aa;border-radius:6px");
  // two rows of chairs: [x, floor, scale, z]
  const SEAT = { B1: [470, 1400, .5, 2], B2: [680, 1400, .5, 2], B3: [890, 1400, .5, 2], F1: [500, 1790, .58, 4], F2: [740, 1790, .58, 4] };
  const bench = (x0, x1, fl, z) => { E.el(S.el, "abs", `left:${x0}px;top:${fl - 250}px;width:${x1 - x0}px;height:120px;border-radius:14px;background:#aab3b8;z-index:${z - 1}`); E.el(S.el, "abs", `left:${x0 - 6}px;top:${fl - 140}px;width:${x1 - x0 + 12}px;height:26px;border-radius:10px;background:#9aa3a8;z-index:${z - 1}`); for (let x = x0 + 20; x < x1; x += 140) E.el(S.el, "abs", `left:${x}px;top:${fl - 114}px;width:10px;height:114px;background:#7d868b;z-index:${z - 1}`); };
  bench(380, 990, 1400, 2); bench(380, 880, 1790, 4);

  // ---------------- Otto at the reception ----------------
  const OS = .7, ot = E.el(S.el, "abs", `left:10px;top:${1800 - 1078 * OS}px;width:${625 * OS}px;height:${1078 * OS}px;z-index:5;transform-origin:50% 100%`);
  const oIm = [["ox", 625], ["oa", 488], ["ob", 625]].map(([n, w]) => [n, E.img(ot, n, `position:absolute;left:${(625 - w) * OS / 2}px;bottom:0;width:${w * OS}px;height:${1078 * OS}px`)]);
  E.F(t => { const f = at([[0, "ox"], [2.7, "oa"], [12.2, "ox"], [15.8, "ob"]], t); oIm.forEach(([n, el]) => { el.style.opacity = n === f ? 1 : 0; }); });
  const ob = []; for (let t = 0; t < 2.6; t += .8) ob.push([t, 0, "io"], [t + .4, -8, "io"]);
  E.K(ot, "y", ob);                                                                                                 // frame-0 motion
  E.K(ot, "x", [[12.2, 0], [12.35, 30, "out"], [12.6, 0, "io"], [13.0, 0], [13.15, 30, "out"], [13.4, 0, "io"], [15.2, 0], [15.45, 40, "out"]]);

  // ---------------- the arrivals: ask the room, then sit anywhere ----------------
  // [standing img, w, h, standing scale, seated img, w, h, seat, enter, sit, leave]
  const P = [
    ["omA", 480, 1037, .64, "omS", 462, 1006, "F2", 1.4, 4.4, 12.2],
    ["lyA", 546, 1031, .64, "lyS", 453, 1028, "B1", 5.0, 6.8, 13.0],
    ["dnA", 665, 1014, .66, "dnS", 597, 1027, "B3", 7.3, 9.0, 13.6],
    ["leA", 514, 1019, .64, "leS", 528, 984, "F1", 9.35, 9.8, 14.1],
    ["maA", 498, 1017, .64, "maS", 545, 1009, "B2", 9.95, 10.35, 14.6],
  ];
  const heads = [];
  P.forEach(([a, aw, ah, as, s, sw, sh, seat, t0, t1, t2], i) => {
    const st = E.el(S.el, "abs", `left:${975 - aw * as / 2}px;top:${1830 - ah * as}px;width:${aw * as}px;height:${ah * as}px;z-index:6;opacity:0`);
    E.img(st, a, `width:${aw * as}px;height:${ah * as}px`);
    E.K(st, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); E.K(st, "x", [[t0, 420], [t0 + .3, 0, "out"]]);
    const [x, fl, sc, z] = SEAT[seat], se = E.el(S.el, "abs", `left:${x - sw * sc / 2}px;top:${fl - sh * sc}px;width:${sw * sc}px;height:${sh * sc}px;z-index:${z};opacity:0`);
    E.img(se, s, `width:${sw * sc}px;height:${sh * sc}px`);
    E.K(se, "o", [[t1 - .01, 0], [t1, 1], [t2 - .01, 1], [t2, 0]]); E.K(se, "y", [[t1, -40], [t1 + .2, 0, "in"]]);
    heads.push([x, fl - sh * sc + 60, t1, t2, fl - sh * sc]);
    const bd = E.el(S.el, "abs", `left:${x + 40}px;top:${fl - sh * sc - 36}px;width:76px;height:76px;border-radius:50%;background:#e5484d;color:#fff;font-weight:900;font-size:46px;display:flex;align-items:center;justify-content:center;z-index:7;opacity:0;border:5px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.2)`, `${i + 1}`);
    E.pop(bd, t1 + .1, { from: .3, dur: .25 }); E.K(bd, "o", [[t1 + .1, 0], [t1 + .15, 1], [t2 - .01, 1], [t2, 0]]);
    E.S(t1 + .1, "pop", .6);
  });
  const headTop = i => heads[i][4];
  // the web: dotted arrows from each person to the next (SVG, drawn in as they sit)
  const svgEl = E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;z-index:6;pointer-events:none");
  const paths = [];
  for (let i = 1; i < heads.length; i++) {
    const [x0, y0] = heads[i - 1], [x1, y1, t1, ] = heads[i], t2 = heads[i - 1][3];
    const mx = (x0 + x1) / 2 + (i % 2 ? 60 : -60), my = Math.min(y0, y1) - 120 - Math.abs(x1 - x0) * .2;
    paths.push({ d: `M${x0} ${y0} Q${mx} ${my} ${x1} ${y1}`, t1, t2 });
  }
  svgEl.innerHTML = `<svg width="1080" height="1920"><defs><marker id="ah" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#e5484d"/></marker></defs>${paths.map((p, i) => `<path id="pa${i}" d="${p.d}" fill="none" stroke="#e5484d" stroke-width="9" stroke-dasharray="18 14" stroke-linecap="round" marker-end="url(#ah)" opacity="0"/>`).join("")}</svg>`;
  E.F(t => paths.forEach((p, i) => { const el = svgEl.querySelector(`#pa${i}`); if (el) el.setAttribute("opacity", t >= p.t1 && t < p.t2 ? 1 : 0); }));

  // ---------------- clock pill ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:54px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7`, "");
  const CLK = [[0, "08:59 · FIRST!"], [1.4, "09:01"], [5.0, "09:07"], [7.3, "09:12"], [9.35, "09:20"], [12.2, "10:00"], [13.0, "11:00"], [13.6, "12:00"], [14.1, "12:30"], [14.6, "12:59"], [15.6, "13:00 · LUNCH"]];
  E.F(t => { const s = at(CLK, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t < 1.4 ? "#1f7a3a" : t >= 15.6 ? C.coralD : C.ink; });

  // ---------------- bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 54) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:9;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:32px;padding:18px 26px 22px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:30px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble("First!", 100, 870, 240, 110, .3, 1.35, 60);
  bubble(`Quem é o último?${sub("(Who's last?)")}`, 540, 900, 520, 380, 1.6, 3.2, 52);
  bubble("?", 190, 900, 110, 30, 2.7, 3.3, 64);
  bubble(`Pronto… sou eu.${sub("(Fine… it's me.)")}`, 540, 900, 520, 380, 3.3, 4.9, 52);
  bubble(`Quem é o último?`, 540, 920, 520, 380, 5.1, 6.2, 52);
  bubble(`Sou eu.${sub("(Me.)")}`, SEAT.F2[0] - 150, headTop(0) - 190, 300, 130, 6.2, 7.2, 50);
  bubble(`Quem é o último?`, 540, 920, 520, 380, 7.4, 8.5, 52);
  bubble(`Sou eu.`, SEAT.B1[0] - 125, headTop(1) - 150, 250, 100, 8.5, 9.4, 50);
  bubble("Wait… I was first!", 40, 860, 460, 150, 10.6, 12.1, 52);
  [12.2, 13.0, 13.6, 14.1, 14.6].forEach((t, i) => bubble("Próximo!", 250, 470, 330, 60, t, t + (i < 1 ? .75 : .45), 50));
  bubble(`Almoço!${sub("(Lunch!)")}`, 250, 470, 330, 60, 15.2, 15.9, 56);

  // ---------------- stamp ----------------
  const sb = E.el(S.el, "abs", "left:60px;top:1200px;width:960px;display:flex;justify-content:center;z-index:10");
  const st = E.stamp(sb, "FIRST IN. LAST OUT.", 16.1, { size: 90, rot: -6, bg: C.coralD, shake: 12 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  for (let k = 0; k < 4; k++) E.clip(k * 1.2, "sfx/crowd-murmur.wav", { vol: .12 + k * .03, duck: false });
  for (let k = 4; k < 13; k++) E.clip(k * 1.2, "sfx/crowd-murmur.wav", { vol: .22, duck: false, to: Math.min(1.2, DUR - k * 1.2) });
  E.clip(1.4, "sfx/door-open.wav", { vol: .5, to: .6 }); E.clip(5.0, "sfx/door-open.wav", { vol: .5, to: .6 }); E.clip(7.3, "sfx/door-open.wav", { vol: .5, to: .6 });
  E.clip(1.6, "voices/ep46/v_ultimo.wav", { vol: 1.15 });
  E.clip(3.3, "voices/ep46/v_pronto.wav", { vol: 1.15 });
  E.clip(5.1, "voices/ep46/m_ultimo.wav", { vol: 1.15 });
  E.clip(6.2, "voices/ep46/v_soueu.wav", { vol: 1.15 });
  E.clip(7.4, "voices/ep46/g_ultimo.wav", { vol: 1.15 });
  E.clip(8.5, "voices/ep46/m_soueu.wav", { vol: 1.15 });
  E.clip(10.6, "voices/ep46/o_first.wav", { vol: 1.15 });
  [12.2, 13.0, 13.6, 14.1, 14.6].forEach(t => E.clip(t, "voices/ep46/r_proximo.wav", { vol: 1.1 }));
  E.clip(15.2, "voices/ep46/r_almoco.wav", { vol: 1.15 });
  E.clip(15.65, "sfx/shutter-slam.wav", { vol: .9 }); E.shake(15.7, 10);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "The Portuguese *queue*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[17.0, 1], [17.25, 1.18, "out"], [17.6, 1, "io"]]);
}
