// EP.31 "Breaking: rain in Lisbon" — a fake TV news broadcast. The anchor: "Breaking news. It is raining in Lisbon." LIVE: locals
// in puffer jackets under giant umbrellas ("Citizens are advised to stay indoors."). Grandma on the phone: "Cancel everything!
// It's RAINING!" A British tourist in shorts: "Mate. This is a drizzle." Update: the sun is back — ice creams and sunglasses.
// Voiced (ElevenLabs: anchor, grandma, Buck) with real rain/thunder/news-sting effects. Paced per the skit guide.
export const meta = {
  id: "ep31-rainnews", date: "2026-10-24",
  images: {
    anchor: "characters/cutouts/anchor_grave.webp", umbrellas: "characters/cutouts/locals_umbrellas.webp", dona: "characters/cutouts/dona_phone.webp",
    buck: "characters/cutouts/buck_drizzle.webp", sunny: "characters/cutouts/locals_sunny.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 57, seed: 311, prog: [[0, 3, 7], [5, 8, 12], [7, 10, 14], [3, 7, 10]] });
  const DUR = 15.4;
  const S = E.scene("news", 0, DUR, "dark"); E.cur = S;
  const LIVE = 3.3, GRAN = 6.3, BUCK = 9.2, UPD = 11.6, SUN = 13.0;
  const GROUND = 1390;
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };
  const figure = (parent, img, w, h, s, cx, extra = "") => { const W = w * s, H = h * s; const el = E.el(parent, "abs", `left:${cx - W / 2}px;top:${GROUND - H}px;width:${W}px;height:${H}px;${extra}`); E.img(el, img, `width:${W}px;height:${H}px`); return el; };
  const rain = (parent, n, heavy) => {
    for (let i = 0; i < n; i++) {
      const x = (i * 97) % 1120 - 20, len = heavy ? 70 : 34, sp = heavy ? 2600 : 1400, ph = (i * .137) % 1;
      const d = E.el(parent, "abs", `left:${x}px;top:0;width:${heavy ? 4 : 3}px;height:${len}px;border-radius:2px;background:rgba(220,235,255,${heavy ? .75 : .55});transform:rotate(12deg)`);
      E.F(t => { const y = ((t + ph) * sp) % 2100 - 150; d.style.top = y + "px"; d.style.left = (x - y * .21) + "px"; });
    }
  };
  const lisbon = (parent, sky, dim) => {
    E.el(parent, "abs", `left:0;top:0;width:1080px;height:1920px;background:${sky}`);
    ["#f4c7a1", "#f7e3a3", "#bfe3d3", "#f2b8b0"].forEach((c, i) => {
      const b = E.el(parent, "abs", `left:${i * 280 - 20}px;top:${520 + (i % 2) * 70}px;width:290px;height:${GROUND - 520 - (i % 2) * 70}px;background:${c};border-top:32px solid #c0643f;filter:brightness(${dim})`);
      for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) E.el(b, "abs", `left:${46 + k * 120}px;top:${60 + r * 230}px;width:84px;height:130px;background:#3d5a73;border:8px solid #fff;border-radius:42px 42px 4px 4px`);
    });
    E.el(parent, "abs", `left:0;top:${GROUND}px;width:1080px;height:${1920 - GROUND}px;background:#8d8a84`);
  };

  // ================= studio =================
  const studio = (t0, t1, sting) => {
    const L = layer(t0, t1);
    E.el(L, "abs", "left:0;top:0;width:1080px;height:1920px;background:radial-gradient(ellipse at 50% 35%,#27508f,#0c1c3d 70%)");
    for (let i = 0; i < 12; i++) E.el(L, "abs", `left:${i * 95}px;top:${900 - (i * 53) % 220}px;width:80px;height:${(i * 53) % 220 + 120}px;background:rgba(120,170,255,.12)`);
    E.el(L, "abs", "left:0;top:0;width:1080px;height:1920px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.03) 0 2px,transparent 2px 60px)");
    const a = figure(L, "anchor", 728, 1039, .85, 540);
    a.style.top = (1420 - 1039 * .85) + "px";
    const bob = []; for (let t = t0; t < t1; t += .9) bob.push([t, 0, "io"], [t + .45, -4, "io"]);
    E.K(a, "y", bob);
    E.el(L, "abs", "left:60px;top:1350px;width:960px;height:220px;border-radius:24px 24px 0 0;background:linear-gradient(180deg,#e9eef5,#b8c4d6);box-shadow:0 -8px 30px rgba(0,0,0,.35)");
    E.el(L, "abs", "left:60px;top:1350px;width:960px;height:14px;background:#d7262e");
    return L;
  };
  studio(0, LIVE); studio(UPD, SUN);
  E.clip(0, "sfx/news-sting.wav", { vol: .8 });
  E.clip(UPD - .05, "sfx/news-sting.wav", { vol: .6, to: 1.0 });

  // ================= LIVE: the street in the "storm" =================
  const L1 = layer(LIVE, GRAN);
  lisbon(L1, "linear-gradient(180deg,#5d6b7c,#9aa6b3)", .75);
  const um = figure(L1, "umbrellas", 1008, 645, 1.02, 540);
  const shiver = []; for (let t = LIVE; t < GRAN; t += .12) shiver.push([t, (Math.round((t - LIVE) / .12) % 2) ? 3 : -3]);
  E.K(um, "x", shiver);
  rain(L1, 70, true);
  const bolt = E.el(L1, "abs", "left:0;top:0;width:1080px;height:1920px;background:#fff;opacity:0");
  E.K(bolt, "o", [[LIVE + .15, 0], [LIVE + .2, .8], [LIVE + .3, 0], [LIVE + .38, .5], [LIVE + .5, 0]]);
  E.clip(LIVE + .1, "sfx/thunder.wav", { vol: .9 });
  E.clip(LIVE, "sfx/rain-heavy.wav", { vol: .45, duck: false });
  E.clip(LIVE + 2.9, "sfx/rain-heavy.wav", { vol: .45, duck: false, to: GRAN - LIVE - 2.9 });

  // ================= LIVE: grandma at home =================
  const L2 = layer(GRAN, BUCK);
  const tileSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#f8f5ee'/><rect x='2' y='2' width='116' height='116' rx='5' fill='none' stroke='#c9d8ea' stroke-width='3'/><g fill='#2f6db5'><circle cx='60' cy='60' r='9'/><ellipse cx='60' cy='36' rx='8' ry='15'/><ellipse cx='60' cy='84' rx='8' ry='15'/><ellipse cx='36' cy='60' rx='15' ry='8'/><ellipse cx='84' cy='60' rx='15' ry='8'/></g></svg>`;
  E.el(L2, "abs", `left:0;top:0;width:1080px;height:1920px;background-color:#f4e4c1;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tileSvg)}");background-size:120px 120px`);
  const win = E.el(L2, "abs", "left:640px;top:560px;width:340px;height:380px;border:18px solid #fff;border-radius:10px;overflow:hidden;background:linear-gradient(180deg,#5d6b7c,#9aa6b3)");
  rain(win, 14, true);
  E.el(L2, "abs", `left:0;top:${GROUND}px;width:1080px;height:${1920 - GROUND}px;background:#a8764c`);
  const dn = figure(L2, "dona", 661, 1023, .92, 380);
  const panic = []; for (let t = GRAN; t < BUCK; t += .2) panic.push([t, (Math.round((t - GRAN) / .2) % 2) ? 2.5 : -2.5]);
  E.K(dn, "r", panic); dn.style.transformOrigin = "50% 100%";
  E.clip(GRAN, "sfx/rain-heavy.wav", { vol: .2, duck: false });

  // ================= LIVE: the British tourist =================
  const L3 = layer(BUCK, UPD);
  lisbon(L3, "linear-gradient(180deg,#8fa9c4,#cfdbe6)", .92);
  figure(L3, "buck", 812, 1012, .9, 540);
  rain(L3, 18, false);
  E.clip(BUCK, "sfx/rain-heavy.wav", { vol: .12, duck: false, to: 2.4 });

  // ================= the sun is back =================
  const L4 = layer(SUN, DUR);
  lisbon(L4, "linear-gradient(180deg,#6cc0f5,#dff3fd)", 1.05);
  E.el(L4, "abs", "left:760px;top:430px;width:180px;height:180px;border-radius:50%;background:#fff2a0;box-shadow:0 0 90px 40px rgba(255,240,150,.85)");
  const sn = figure(L4, "sunny", 745, 636, 1.28, 540);
  E.K(sn, "s", [[SUN, .9], [SUN + .3, 1, "back"]]);
  E.S(SUN, "sparkle", .9); E.flash(SUN, "#fff8d8", .6, .3);
  E.clip(SUN + .2, "sfx/waves-seagulls.wav", { vol: .3, duck: false });

  // ================= broadcast graphics =================
  const live = E.el(S.el, "abs", "left:780px;top:352px;display:flex;align-items:center;gap:10px;background:rgba(0,0,0,.55);color:#fff;font-weight:900;font-size:40px;padding:6px 16px;border-radius:10px;z-index:7;opacity:0");
  const dot = E.el(live, "", "width:22px;height:22px;border-radius:50%;background:#ff3b30"); E.el(live, "", "", "LIVE");
  E.K(live, "o", [[LIVE - .01, 0], [LIVE, 1], [UPD - .01, 1], [UPD, 0], [SUN - .01, 0], [SUN, 1]]);
  E.F(t => { dot.style.opacity = Math.floor(t * 2) % 2 ? .3 : 1; });
  const lower = E.el(S.el, "abs", "left:0;top:1395px;width:1080px;height:110px;z-index:7");
  const tag = E.el(lower, "abs", "left:40px;top:0;height:110px;padding:0 26px;background:#d7262e;color:#fff;font-weight:900;font-size:44px;display:flex;align-items:center;white-space:nowrap", "BREAKING");
  const head = E.el(lower, "abs", "left:300px;top:0;right:40px;height:110px;padding:0 24px;background:#fff;color:#111;font-weight:900;font-size:42px;display:flex;align-items:center;white-space:nowrap;overflow:hidden", "");
  const LT = [[0, "BREAKING", "#d7262e", "RAIN IN LISBON"], [LIVE, "LIVE", "#d7262e", "BAIXA: 3 DROPS REPORTED"], [GRAN, "LIVE", "#d7262e", "GRANDMA CANCELS LUNCH"],
    [BUCK, "LIVE", "#d7262e", "TOURIST: \"A DRIZZLE\""], [UPD, "UPDATE", "#1f7a3a", "THE SUN IS BACK"], [SUN, "12 MIN LATER", "#1f7a3a", "24°C · ICE CREAM"]];
  E.F(t => {
    let cur = LT[0]; for (const r of LT) if (t >= r[0]) cur = r;
    if (tag.textContent !== cur[1] || head.textContent !== cur[3]) { tag.textContent = cur[1]; tag.style.background = cur[2]; head.textContent = cur[3]; }
    head.style.left = (tag.offsetWidth + 40) + "px";
  });
  LT.slice(1).forEach(([t]) => E.S(t, "swish", .5));
  E.K(lower, "x", [[0, 0], ...LT.slice(1).flatMap(([t]) => [[t - .01, 0], [t, -1080], [t + .3, 0, "out"]])]);
  const tick = E.el(S.el, "abs", "left:0;top:1505px;width:1080px;height:54px;background:#0c1c3d;overflow:hidden;z-index:7");
  const tickTx = E.el(tick, "abs", "left:0;top:6px;white-space:nowrap;color:#ffd43b;font-weight:900;font-size:34px",
    "UMBRELLA SALES +900% · CAFÉ TERRACES EVACUATED · SCARVES SOLD OUT · SCHOOLS CONSIDER CLOSING · LOCAL MAN SEES A CLOUD · ");
  E.F(t => { tickTx.style.transform = `translateX(${-((t * 180) % 1800)}px)`; });

  // ================= voices =================
  E.clip(.45, "voices/ep31/a_breaking.wav");
  E.clip(LIVE + .5, "voices/ep31/a_indoors.wav");
  E.clip(GRAN + .3, "voices/ep31/g_cancel.wav", { vol: 1.1 });
  E.clip(BUCK + .5, "voices/ep31/b_drizzle.wav", { vol: 1.1 });
  E.clip(UPD + .2, "voices/ep31/a_sun.wav");
  // subtitles for the voiced lines (read with the sound off)
  const sub = (str, t0, t1) => {
    const b = E.el(S.el, "abs", "left:60px;top:1250px;width:960px;display:flex;justify-content:center;z-index:8");
    const e = E.el(b, "", "background:rgba(0,0,0,.72);color:#fff;font-weight:800;font-size:46px;line-height:1.15;padding:.2em .6em .25em;border-radius:.4em;text-align:center", str);
    E.K(b, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]);
  };
  sub("Breaking news. It is raining in Lisbon.", .45, LIVE);
  sub("Citizens are advised to stay indoors.", LIVE + .5, GRAN);
  sub("Cancel everything! It's RAINING!", GRAN + .3, BUCK);
  sub("Mate. This is a drizzle.", BUCK + .5, UPD);
  sub("Update: the sun is back.", UPD + .2, SUN);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:0;top:228px;width:1080px;height:112px;background:rgba(12,28,61,.88);z-index:6");            // the channel bar behind the title
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Breaking: rain in *Lisbon*", { size: 62, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[14.6, 1], [14.85, 1.18, "out"], [15.2, 1, "io"]]);
}
