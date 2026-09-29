// EP.76 "When grandma zooms into your photo" — a crime-show ENHANCE parody. Otto posts a beach selfie: "Look, Grandma! My holiday!"
// Grandma, reading glasses on: "Enhance." — the burger: "A HAMBURGER? You are in PORTUGAL!" "Enhance!" — the sunburn: "Where is your
// SUNSCREEN?!" "Enhance!" — the receipt: "Nine euros for a BEER?! I have beer at home!" Then she comments, publicly, typing with one
// finger: "Put a shirt on, filho. Everybody can see. ❤️" — 2,431 likes. Otto's post: 12. Otto: "…She has more likes than me."
export const meta = {
  id: "ep76-enhance", date: "2026-12-08",
  images: {
    bg: "characters/scenes/bg_beach.webp", sel: "characters/cutouts/otto-beach_selfie.webp", oph: "characters/cutouts/otto-beach_phone.webp",
    burger: "characters/props/burger.webp", gt: "characters/cutouts/dona_tablet.webp", gg: "characters/cutouts/dona_tablet-gasp.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 50, seed: 761, prog: [[0, 3, 7], [8, 12, 15], [5, 8, 12], [7, 11, 14]] });
  const DUR = 21.6, POST = .3, GR = 2.35, E1 = 2.45, BURG = 3.55, E2 = 7.3, SUN = 8.3, E3 = 10.7, BEER = 11.65, TYPE = 15.6,
    POSTED = 18.7, LIKES = 19.4;
  const S = E.scene("enhance", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  E.el(S.el, "abs", "inset:0;background:#1d2b36");

  // ================= the tablet screen with the photo =================
  const SX = 60, SY = 430, SW = 960, SH = 1100;
  E.el(S.el, "abs", `left:${SX - 22}px;top:${SY - 22}px;width:${SW + 44}px;height:${SH + 44}px;border-radius:40px;background:#0c0f18;box-shadow:0 20px 50px rgba(0,0,0,.5)`);
  const scr = E.el(S.el, "abs", `left:${SX}px;top:${SY}px;width:${SW}px;height:${SH}px;border-radius:20px;overflow:hidden;background:#fff`);
  const ph = E.el(scr, "abs", `left:0;top:0;width:${SW}px;height:${SH}px;transform-origin:0 0`);
  E.img(ph, "bg", `position:absolute;left:0;top:-500px;width:${SW}px;height:${1344 * SW / 752}px`);
  // on the table: a beer, the burger, the receipt
  E.el(ph, "abs", "left:80px;top:760px;width:46px;height:96px;border-radius:6px 6px 10px 10px;background:linear-gradient(180deg,#fff8e0 0 18%,#f2b530 18%);border:3px solid rgba(255,255,255,.8);box-sizing:border-box");
  E.img(ph, "burger", "position:absolute;left:150px;top:780px;width:150px;height:130px");
  const rc = E.el(ph, "abs", "left:320px;top:810px;width:120px;height:78px;background:#fffdf5;border:2px solid #d8d2c2;transform:rotate(-8deg);padding:6px 8px;box-sizing:border-box;font-family:monospace;font-weight:700;font-size:12px;line-height:1.3;color:#333");
  rc.innerHTML = "BAR DA PRAIA<br>1× BURGER 14.00<br>1× <b style='color:#c0392b'>BEER 9.00</b>";
  const ow = E.el(ph, "abs", "left:430px;top:0;width:1px;height:1px");
  E.img(ow, "sel", `position:absolute;left:0;top:${1080 - 940 * .9}px;width:${542 * .9}px;height:${940 * .9}px`);
  const ob = []; for (let t = 0; t < GR; t += .6) ob.push([t, 0, "io"], [t + .3, -6, "io"]); E.K(ow, "y", ob);                     // frame-0 motion
  // zooms: translate so the target lands in the centre of the screen, scale 2.6 (origin 0,0)
  const K = 2.6, cx = SW / 2, cy = SH / 2, Z = [[E1 + .55, 220, 850], [E2 + .45, 600, 520], [E3 + .45, 385, 845]];
  const zx = [[0, 0]], zy = [[0, 0]], zs = [[0, 1]];
  Z.forEach(([t, x, y], i) => {
    const out = [BURG + 3.5, SUN + 2.25, TYPE - .15][i];
    zx.push([t, 0], [t + .45, cx - K * x, "io"], [out, cx - K * x], [out + .3, 0, "io"]);
    zy.push([t, 0], [t + .45, cy - K * y, "io"], [out, cy - K * y], [out + .3, 0, "io"]);
    zs.push([t, 1], [t + .45, K, "io"], [out, K], [out + .3, 1, "io"]);
  });
  E.K(ph, "x", zx); E.K(ph, "y", zy); E.K(ph, "s", zs);
  // the red reticle before each zoom
  Z.forEach(([t, x, y]) => {
    const r = E.el(scr, "abs", `left:${x - 110}px;top:${y - 110}px;width:220px;height:220px;border:6px solid #e5484d;box-sizing:border-box;opacity:0`);
    E.el(r, "abs", "left:-6px;top:-40px;background:#e5484d;color:#fff;font-weight:900;font-size:24px;padding:2px 10px", "TARGET");
    E.K(r, "o", [[t - .4, 0], [t - .35, 1], [t, 1], [t + .05, 0]]); E.K(r, "s", [[t - .4, 1.6], [t - .15, 1, "out"]]);
  });
  // scan lines + ENHANCE flash during each zoom
  Z.forEach(([t]) => {
    const fl = E.el(scr, "abs", "inset:0;background:repeating-linear-gradient(0deg,rgba(80,255,180,.18) 0 3px,transparent 3px 9px);opacity:0");
    E.K(fl, "o", [[t, 0], [t + .05, 1], [t + .5, 0]]);
    const lab = E.el(scr, "abs", "left:30px;top:30px;background:rgba(0,0,0,.7);color:#6fffb0;font-family:monospace;font-weight:700;font-size:40px;padding:6px 16px;letter-spacing:.1em;opacity:0", "ENHANCING…");
    E.K(lab, "o", [[t, 0], [t + .05, 1], [t + .7, 1], [t + .8, 0]]);
  });
  // the Instagram-ish post bar (top of the screen)
  const bar = E.el(scr, "abs", "left:0;top:0;width:100%;height:100px;background:rgba(255,255,255,.96);display:flex;align-items:center;gap:18px;padding:0 24px;box-sizing:border-box");
  E.el(bar, "", "width:64px;height:64px;border-radius:50%;background:linear-gradient(45deg,#f2c230,#e5484d,#a33cc0)");
  E.el(bar, "", "font-weight:900;font-size:34px;color:#1d2b36", "otto.in.portugal");
  E.el(bar, "", "margin-left:auto;font-weight:800;font-size:30px;color:#7a8791", "Best day ever ☀️");
  E.F(t => { bar.style.opacity = t < E1 + .5 || (t > TYPE - .2) ? 1 : 0; });

  // the comment she writes, in public
  const cm = E.el(scr, "abs", `left:0;top:${SH - 400}px;width:100%;height:400px;background:#fff;border-top:2px solid #e3e3e3;padding:26px 330px 26px 30px;box-sizing:border-box;opacity:0`);
  E.K(cm, "o", [[TYPE - .01, 0], [TYPE, 1]]); E.K(cm, "y", [[TYPE, 200], [TYPE + .3, 0, "out"]]);
  const hd = E.el(cm, "", "display:flex;align-items:center;gap:16px");
  E.el(hd, "", "width:64px;height:64px;border-radius:50%;background:#f3c9a0;display:flex;align-items:center;justify-content:center;font-size:40px", "👵");
  E.el(hd, "", "font-weight:900;font-size:34px;color:#1d2b36", "dona.fernanda.1946");
  const txt = E.el(cm, "", "margin-top:14px;font-weight:700;font-size:44px;line-height:1.2;color:#1d2b36;min-height:110px", "");
  const MSG = "Put a shirt on, filho. Everybody can see. ❤️";
  E.F(t => { const n = t < TYPE + .2 ? 0 : Math.min(MSG.length, Math.floor((t - TYPE - .2) / 2.7 * MSG.length)); const s = MSG.slice(0, n) + (t < POSTED && Math.floor(t * 3) % 2 ? "|" : ""); if (txt.textContent !== s) txt.textContent = s; });
  const likes = E.el(cm, "", "margin-top:6px;font-weight:900;font-size:36px;color:#e5484d", "");
  E.F(t => { const n = t < POSTED ? 0 : Math.round(Math.min(1, (t - POSTED) / .8) ** 2 * 2431); const s = n ? `❤️ ${n.toLocaleString("en")} likes` : ""; if (likes.textContent !== s) likes.textContent = s; });
  E.K(likes, "s", [[POSTED + .8, 1], [POSTED + 1, 1.2, "out"], [POSTED + 1.25, 1, "io"]]);

  // grandma, bottom-right, with her tablet
  const gw = E.el(S.el, "abs", "left:640px;top:0;width:1px;height:1px;z-index:5");
  const g1 = E.img(gw, "gt", `position:absolute;left:0;top:${1935 - 1024 * .64}px;width:${688 * .64}px;height:${1024 * .64}px`);
  const g2 = E.img(gw, "gg", `position:absolute;left:0;top:${1935 - 1024 * .64}px;width:${688 * .64}px;height:${1024 * .64}px;opacity:0`);
  const GASP = [[BURG, BURG + 1.2], [SUN, SUN + 1], [BEER, BEER + 1.4]];
  E.F(t => { const g = GASP.some(([a, b]) => t >= a && t < b); g1.style.opacity = g ? 0 : 1; g2.style.opacity = g ? 1 : 0; });
  E.K(gw, "y", [[GR - .3, 700], [GR, 0, "out"], [LIKES - .1, 0], [LIKES, 700]]);

  // ================= the end: Otto reads it =================
  const F = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0;z-index:6");
  E.K(F, "o", [[LIKES - .01, 0], [LIKES, 1]]);
  E.img(F, "bg", "position:absolute;left:0;top:0;width:1080px;height:1930px");
  E.el(F, "abs", "inset:0;background:rgba(20,26,46,.25)");
  const of = E.el(F, "abs", `left:${540 - 372 * 1.05 / 2}px;top:${1880 - 915 * 1.05}px;width:${372 * 1.05}px;height:${915 * 1.05}px`); E.img(of, "oph", `width:${372 * 1.05}px;height:${915 * 1.05}px`);
  E.K(of, "s", [[LIKES, 1.08], [LIKES + .4, 1, "out"]]);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "OTTO'S POST: 12 LIKES"], [E1 + .5, "ENHANCE ×1"], [E2 + .4, "ENHANCE ×2"], [E3 + .4, "ENHANCE ×3"], [TYPE, "GRANDMA IS TYPING…"], [POSTED, "GRANDMA'S COMMENT"], [LIKES, "OTTO: 12 · GRANDMA: 2,431"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = s.startsWith("ENHANCE") || t >= LIKES ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Look, Grandma! My holiday!", 340, 470, 560, 330, POST, GR - .05, 48);
  bubble("Enhance.", 300, 1600, 300, 240, E1, BURG - .05, 54);
  bubble("A HAMBURGER? You are in PORTUGAL!", 30, 1590, 620, 540, BURG, E2 - .05, 46);
  bubble("Enhance!", 300, 1600, 300, 240, E2, SUN - .05, 54);
  bubble("Where is your SUNSCREEN?!", 30, 1590, 600, 540, SUN, E3 - .05, 48);
  bubble("Enhance!", 300, 1600, 300, 240, E3, BEER - .05, 54);
  bubble("Nine euros for a BEER?! I have beer at home!", 30, 1560, 620, 540, BEER, TYPE - .05, 44);
  bubble("…She has more likes than me.", 190, 720, 700, 350, LIKES + .3, DUR - .4, 50);
  const sb = E.el(S.el, "abs", "left:60px;top:470px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "2,431 LIKES.", LIKES + 1.2, { size: 116, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/waves-seagulls.wav", { vol: .5, duck: false, to: GR });
  E.clip(POST, "voices/ep76/o_post.wav", { vol: 1.2 });
  E.clip(GR - .1, "sfx/phone-ping.wav", { vol: .6 });
  E.clip(E1, "voices/ep76/g_enhance.wav", { vol: 1.35 }); E.clip(E1 + .5, "sfx/enhance-zoom.wav", { vol: .9 });
  E.clip(BURG, "voices/ep76/g_burger.wav", { vol: 1.3 });
  E.clip(E2, "voices/ep76/g_enh2.wav", { vol: 1.35 }); E.clip(E2 + .4, "sfx/enhance-zoom.wav", { vol: .9 });
  E.clip(SUN, "voices/ep76/g_sun.wav", { vol: 1.3 });
  E.clip(E3, "voices/ep76/g_enh2.wav", { vol: 1.35 }); E.clip(E3 + .4, "sfx/enhance-zoom.wav", { vol: .9 });
  E.clip(BEER, "voices/ep76/g_beer.wav", { vol: 1.3 });
  E.clip(TYPE, "voices/ep76/g_type.wav", { vol: 1.3 }); E.clip(TYPE + .2, "sfx/phone-typing.wav", { vol: .6, to: 2.6 });
  E.clip(POSTED, "sfx/phone-ping.wav", { vol: .8 }); E.S(POSTED + .2, "riser", .4);
  E.clip(LIKES + .3, "voices/ep76/o_likes.wav", { vol: 1.2 }); E.S(LIKES + 1.2, "thud", .6);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "Grandma *zooms* into your photo", { size: 46, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[20.8, 1], [21.05, 1.18, "out"], [21.4, 1, "io"]]);
}
