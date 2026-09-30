// EP.111 "Just one more photo" — seen through Mum's phone camera: a family lined up at a Lisbon viewpoint. Mum (off-screen): "Okay, everybody smile!" Click. "Lovely! One more!"
// "Someone blinked. One more!" "Grandma, look at the camera!" Grandma: "Which camera?!" "Dad, don't look at me, look at the PHONE!" Dad: "I am looking at the phone!"
// 47 PHOTOS LATER (17:42, the sun gone orange, everyone wilted). Teen: "I'm melting." Dad: "Can we go now?" Mum: "Perfect! … Oh. My thumb." (a huge thumb fills the lens.) "Okay. One more!"
// Stamp: ALL 48: THUMB.
export const meta = {
  id: "ep111-onemore", date: "2027-01-12",
  images: {
    bg: "characters/scenes/bg_miradouro.webp",
    f1: "characters/cutouts/family-photo_good.webp", f2: "characters/cutouts/family-photo_tense.webp", f3: "characters/cutouts/family-photo_wind.webp", f4: "characters/cutouts/family-photo_dead.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 110, root: 53, seed: 1111, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 26.6, SMILE = .3, LOVELY = 2.85, BLINK = 4.75, GRANM = 7.1, WHICH = 8.65, PHONE = 9.85, LOOKING = 12.2, CARD = 14.0, MELT = 15.6, GO = 17.6, THUMB = 18.75, ONE = 22.0, STAMP = 24.0;
  const S = E.scene("photo", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const show = (el, spans) => E.F(t => { el.style.opacity = spans.some(([a, b]) => t >= a && t < b) ? 1 : 0; });
  const BG = "position:absolute;left:0;top:0;width:1080px;height:1930px";
  E.img(S.el, "bg", BG);

  // ---- the family, behind a low stone wall
  const FW = 1080, FH = 752 * FW / 1344, FB = 1420;
  const fam = E.el(S.el, "abs", `left:0;top:${FB - FH}px;width:${FW}px;height:${FH}px;z-index:4`);
  const P = ["f1", "f2", "f3", "f4"].map(n => E.img(fam, n, `position:absolute;left:0;top:0;width:${FW}px;height:${FH}px;opacity:0`));
  const T2 = 4.6, T3 = 9.7, T4 = CARD;
  E.F(t => { const k = t < T2 ? 0 : t < T3 ? 1 : t < T4 ? 2 : 3; P.forEach((f, i) => { f.style.opacity = i === k ? 1 : 0; }); });
  const sway = []; for (let t = 0; t < DUR; t += .45) sway.push([t, (Math.round(t / .45) % 2) ? .6 : -.6, "io"]); E.K(fam, "r", sway);
  const wb = []; for (let t = 0; t < DUR; t += .8) wb.push([t, 0, "io"], [t + .4, -4, "io"]); E.K(fam, "y", wb);
  E.el(S.el, "abs", `left:0;top:${FB - 4}px;width:1080px;height:${1930 - FB + 4}px;background:linear-gradient(#e6d6b4,#cdb98f);z-index:6;box-shadow:0 -6px 18px rgba(0,0,0,.25)`);
  E.el(S.el, "abs", `left:0;top:${FB - 4}px;width:1080px;height:46px;background:#f2e6c8;z-index:6;border-bottom:6px solid #b39f74`);

  // ---- the light goes: afternoon → evening
  const dusk = E.el(S.el, "abs", "inset:0;background:linear-gradient(rgba(255,150,60,.0),rgba(255,120,40,.55));z-index:7;opacity:0;mix-blend-mode:multiply");
  E.K(dusk, "o", [[0, 0], [T2, .05], [T3, .2], [CARD - .1, .4], [CARD, .85], [DUR, .9]]);

  // ---- phone viewfinder
  const vf = E.el(S.el, "abs", "inset:0;z-index:9;pointer-events:none");
  const cn = (x, y, bx, by) => E.el(vf, "abs", `left:${x}px;top:${y}px;width:70px;height:70px;border:solid #fff;border-width:${by ? "0" : "8px"} ${bx ? "0" : "8px"} ${by ? "8px" : "0"} ${bx ? "8px" : "0"};opacity:.9`);
  [[36, 470, 0, 0], [974, 470, 1, 0], [36, 1480, 0, 1], [974, 1480, 1, 1]].forEach(a => cn(...a));
  const fbx = E.el(vf, "abs", "left:290px;top:760px;width:500px;height:420px;border:5px solid #ffd60a;border-radius:8px;opacity:0"); show(fbx, [[0, 2.3], [2.5, 4.3], [4.5, 6.7], [6.9, 9.0], [9.2, 13.9], [15, 19], [19.6, DUR]]);
  E.K(fbx, "s", [[0, 1.1], [.4, 1], [2.3, 1.1], [2.5, 1]]);
  const ring = E.el(vf, "abs", "left:450px;top:1760px;width:180px;height:180px;border-radius:50%;border:10px solid #fff;display:flex;align-items:center;justify-content:center");
  const dot = E.el(ring, "", "width:120px;height:120px;border-radius:50%;background:#fff");
  const SH = [2.4, 4.35, 6.75, 9.05, 11.95, 13.85, ...Array.from({ length: 8 }, (_, i) => 14.0 + i * .18), THUMB + .9];
  SH.forEach(t => { E.flash(t, "#ffffff", .45, .12); E.K(dot, "s", [[t - .01, 1], [t, .75], [t + .12, 1, "out"]]); });
  // the thumb, creeping into the corner from the start and filling the lens at the end
  const thumb = E.el(S.el, "abs", "left:-130px;top:1180px;width:520px;height:900px;border-radius:260px;background:radial-gradient(circle at 60% 30%,#ffc9a0,#f0a074 70%);z-index:10;transform-origin:0 100%;box-shadow:inset -20px -10px 40px rgba(150,70,40,.35)");
  E.el(thumb, "abs", "left:190px;top:40px;width:190px;height:230px;border-radius:95px 95px 60px 60px;background:#fff0e6;opacity:.9;box-shadow:inset 0 -10px 18px rgba(200,140,120,.5)");
  E.K(thumb, "s", [[0, .35], [THUMB - .7, .4], [THUMB, 1.0, "out"], [THUMB + .35, 1.75, "io"], [ONE - .2, 1.75], [ONE + .2, .4, "io"]]);
  E.K(thumb, "o", [[0, 1]]);

  // ---- time card
  const card = E.el(S.el, "abs", "inset:0;background:#141a2e;z-index:14;opacity:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:76px;color:#fff6c8;text-align:center;padding:0 60px;line-height:1.1", "47 PHOTOS<br>LATER…");
  E.K(card, "o", [[CARD, 0], [CARD + .1, 1], [CARD + 1.4, 1], [CARD + 1.55, 0]]);

  // ---- pill
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const PL = [[0, "PHOTOS: 0 · 14:00"], [2.4, "PHOTOS: 1 · 14:00"], [4.35, "PHOTOS: 2 · 14:10"], [6.75, "PHOTOS: 3 · 14:25"], [9.05, "PHOTOS: 4 · 14:40"], [11.95, "PHOTOS: 5 · 15:05"], [13.85, "PHOTOS: 6 · 15:30"], [CARD + 1.5, "PHOTOS: 47 · 17:42"], [THUMB + .9, "PHOTOS: 48 · 17:45"]];
  E.F(t => { const s = at(PL, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= 2.4 ? C.coralD : C.ink; });
  PL.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.1], [t + .2, 1, "out"]]));

  // ================= bubbles, stamp =================
  const bubble = (html, hx, top, w, t0, t1, fs = 48, z = 10) => {
    const tail = Math.max(50, Math.min(w - 90, w / 2)), left = Math.max(20, Math.min(1060 - w, hx - tail)), tl = hx - left - 22;
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:${z};transform-origin:${tl}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.25);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tl}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  // Mum is off-screen, behind the phone: her bubbles sit under the wall, with a little camera badge
  const MUM = (html, t0, t1, fs = 48) => { const b = bubble(`<div style="font-size:26px;color:#7a8791;margin-bottom:2px">📱 MUM (BEHIND THE PHONE)</div>${html}`, 540, 1520, 700, t0, t1, fs, 13); return b; };
  MUM("Okay, everybody smile!", SMILE, LOVELY - .1);
  MUM("Lovely! One more!", LOVELY, BLINK - .1);
  MUM("Someone blinked. One more!", BLINK, GRANM - .1);
  MUM("Grandma, look at the camera!", GRANM, WHICH - .1);
  bubble("Which camera?!", 430, 690, 420, WHICH, PHONE - .1, 56);
  MUM("Dad, don't look at me, look at the PHONE!", PHONE, LOOKING - .1, 42);
  bubble("I am looking at the phone!", 150, 690, 500, LOOKING, CARD - .1, 48);
  bubble("I'm melting.", 930, 710, 380, MELT, GO - .1, 54);
  bubble("Can we go now?", 150, 700, 420, GO, THUMB - .1, 52);
  MUM("Perfect! …Oh. My thumb.", THUMB, ONE - .1, 50);
  MUM("Okay. One more!", ONE, STAMP + .3, 56);
  E.stamp(E.el(S.el, "abs", "left:30px;top:560px;width:1020px;display:flex;justify-content:center;z-index:11"), "ALL 48: THUMB.", STAMP, { size: 100, rot: -6, bg: C.coralD, shake: 10 });

  // ================= sound =================
  E.clip(0, "sfx/waves-seagulls.wav", { vol: .22, duck: false, to: CARD }); E.clip(MELT - .2, "sfx/cicadas.wav", { vol: .3, duck: false, to: DUR - MELT });
  E.clip(SMILE, "voices/ep111/m_smile.wav", { vol: 1.3 }); E.clip(LOVELY, "voices/ep111/m_lovely.wav", { vol: 1.3 }); E.clip(BLINK, "voices/ep111/m_blinked.wav", { vol: 1.3 });
  E.clip(GRANM, "voices/ep111/m_grandma.wav", { vol: 1.3 }); E.clip(WHICH, "voices/ep111/g_camera.wav", { vol: 1.35 });
  E.clip(PHONE, "voices/ep111/m_phone.wav", { vol: 1.3 }); E.clip(LOOKING, "voices/ep111/d_looking.wav", { vol: 1.3 });
  SH.forEach(t => E.clip(t, "sfx/elx-camera-shutter.wav", { vol: .8, to: .5 }));
  E.S(CARD, "whoosh", .4);
  E.clip(MELT, "voices/ep111/t_melting.wav", { vol: 1.2 }); E.clip(GO, "voices/ep111/d_go.wav", { vol: 1.3 });
  E.clip(THUMB, "voices/ep111/m_thumb.wav", { vol: 1.3 });
  E.clip(ONE, "voices/ep111/m_onemore.wav", { vol: 1.3 }); E.clip(ONE + 1.0, "sfx/elx-queue-sigh.wav", { vol: .6, to: 1.6 });
  E.S(STAMP, "ding", .4);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "\"Just *one more* photo!\"", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[25.8, 1], [26.05, 1.18, "out"], [26.35, 1, "io"]]);
}
