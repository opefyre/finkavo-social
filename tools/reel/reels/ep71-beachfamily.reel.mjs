// EP.71 "A quiet day at the beach" — Buck alone on an empty beach: "Ahh. Peace and quiet." A Portuguese family arrives and unloads,
// item after item around him: parasol, chairs, cooler, a pot of rice, a sardine grill, a watermelon, "Traz a televisão!" (bring the
// TV!), a canary in a cage. ITEMS: 1 → 8. Grandma, from her chair: "Hey! You! Skinny boy! Come eat!" "Oh, I'm alright, thanks—"
// "Sit!" Last shot: Buck on the cooler with a sardine and rice: "…I live here now." English-first (grandma with a Portuguese accent).
export const meta = {
  id: "ep71-beachfamily", date: "2026-12-03",
  images: {
    towel: "characters/cutouts/buck_towel.webp", sard: "characters/cutouts/buck_sardine.webp", fam: "characters/cutouts/beach_family.webp", gran: "characters/cutouts/dona_beach.webp",
    parasol: "characters/props/gear_parasol.webp", chairs: "characters/props/gear_chairs.webp", cooler: "characters/props/gear_cooler.webp", pot: "characters/props/gear_pot.webp",
    grill: "characters/props/gear_grill.webp", melon: "characters/props/gear_melon.webp", tv: "characters/props/gear_tv.webp", canary: "characters/props/gear_canary.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 60, seed: 711, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]] });
  const DUR = 19.0, SAND = 1150, PEACE = .4, FAM = 2.6, EAT = 9.8, ALR = 13.0, SIT = 14.7, LIVE = 15.5;
  const S = E.scene("beach", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  // ---------------- the beach ----------------
  E.el(S.el, "abs", "inset:0;background:linear-gradient(180deg,#8fd0f5,#dff2fb)");
  E.el(S.el, "abs", "left:780px;top:470px;width:160px;height:160px;border-radius:50%;background:#ffd23f;box-shadow:0 0 70px 36px rgba(255,210,63,.55)");
  const sea = E.el(S.el, "abs", `left:0;top:900px;width:1080px;height:${SAND - 900}px;background:linear-gradient(180deg,#1f7fb8,#5fb3dd)`);
  const foam = E.el(S.el, "abs", `left:0;top:${SAND - 30}px;width:2200px;height:60px;background:radial-gradient(circle at 45px 30px,#fff 28px,transparent 29px);background-size:90px 60px;opacity:.85`);
  E.F(t => { foam.style.transform = `translateX(${-((t * 40) % 90)}px) translateY(${Math.sin(t * 1.6) * 8}px)`; });   // frame-0 motion
  E.el(S.el, "abs", `left:0;top:${SAND}px;width:1080px;height:${1920 - SAND}px;background:#f0d9a4`);
  E.el(S.el, "abs", `left:0;top:${SAND}px;width:1080px;height:${1920 - SAND}px;background-image:radial-gradient(rgba(180,140,80,.25) 2px,transparent 3px);background-size:40px 40px`);

  // ---------------- Buck ----------------
  const bt = E.el(S.el, "abs", `left:10px;top:${1790 - 499 * .8}px;width:${1108 * .8}px;height:${499 * .8}px;z-index:5`);
  E.img(bt, "towel", `width:${1108 * .8}px;height:${499 * .8}px`);
  E.K(bt, "o", [[LIVE - .31, 1], [LIVE - .3, 0]]);
  const bs = E.el(S.el, "abs", `left:200px;top:${1820 - 996 * .78}px;width:${610 * .78}px;height:${996 * .78}px;z-index:6;opacity:0`);
  E.img(bs, "sard", `width:${610 * .78}px;height:${996 * .78}px`);
  E.K(bs, "o", [[LIVE - .31, 0], [LIVE - .3, 1]]); E.K(bs, "y", [[LIVE - .3, -60], [LIVE, 0, "in"]]);

  // ---------------- the family walks in ----------------
  const fw = E.el(S.el, "abs", `left:0;top:${1520 - 584 * 1.05}px;width:${1153 * 1.05}px;height:${584 * 1.05}px;z-index:3;opacity:0`);
  E.img(fw, "fam", `width:${1153 * 1.05}px;height:${584 * 1.05}px`);
  E.K(fw, "o", [[FAM - .01, 0], [FAM, 1], [FAM + 1.8, 1], [FAM + 2.0, 0]]);
  E.K(fw, "x", [[FAM, 1100], [FAM + 1.8, -300]]);
  const wb = []; for (let t = FAM; t < FAM + 2; t += .3) wb.push([t, 0, "io"], [t + .15, -10, "io"]); E.K(fw, "y", wb);

  // ---------------- the gear lands, item by item ----------------
  const GEAR = [["parasol", 249, 265, 1.7, 560, 1560, 4.5], ["chairs", 221, 228, 1.0, 830, 1580, 5.0], ["cooler", 197, 207, 1.1, 360, 1600, 5.5], ["pot", 236, 181, .95, 700, 1780, 6.0],
    ["grill", 200, 289, .95, 880, 1820, 6.5], ["melon", 190, 220, .8, 120, 1470, 7.0], ["tv", 204, 236, 1.0, 620, 1560, 7.9], ["canary", 159, 263, .9, 20, 1520, 8.6]];
  GEAR.forEach(([n, w, h, s, x, bottom, t], i) => {
    const el = E.el(S.el, "abs", `left:${x}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${bottom > 1700 ? 7 : 4};opacity:0;transform-origin:50% 100%`);
    E.img(el, n, `width:${w * s}px;height:${h * s}px`);
    E.K(el, "o", [[t - .01, 0], [t, 1]]); E.K(el, "y", [[t, -800], [t + .28, 0, "in"]]); E.K(el, "s", [[t + .28, 1.15], [t + .45, 1, "out"]]);
    E.S(t + .28, "thud", .55); if (i < 7) E.S(t + .3, "pop", .3);
  });
  const smoke = [0, 1, 2].map(i => E.el(S.el, "abs", `left:${930 + i * 30}px;top:1520px;width:44px;height:60px;border-radius:50%;background:rgba(200,200,200,.8);z-index:8;opacity:0`));
  E.F(t => smoke.forEach((s, i) => { const u = ((t + i * .4) % 1.2) / 1.2; s.style.opacity = t > 6.8 ? (1 - u) * .8 : 0; s.style.transform = `translate(${Math.sin(u * 5 + i) * 14}px,${-u * 180}px) scale(${.7 + u})`; }));
  // grandma settles into her chair
  const gr = E.el(S.el, "abs", `left:590px;top:${1780 - 1014 * .7}px;width:${747 * .7}px;height:${1014 * .7}px;z-index:6;opacity:0`);
  E.img(gr, "gran", `width:${747 * .7}px;height:${1014 * .7}px`);
  E.K(gr, "o", [[EAT - .41, 0], [EAT - .4, 1]]); E.K(gr, "y", [[EAT - .4, -60], [EAT - .1, 0, "in"]]);
  const wave = []; for (let t = EAT; t < LIVE; t += .5) wave.push([t, -2, "io"], [t + .25, 2, "io"]); E.K(gr, "r", wave);

  // ---------------- HUD ----------------
  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:9`, "");
  E.F(t => { const n = GEAR.filter(g => t >= g[6]).length, s = t < FAM ? "BEACH · PEOPLE: 1" : t < LIVE ? `ITEMS UNLOADED: ${n}` : "BUCK · STATUS: ADOPTED"; if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= LIVE ? "#1f7a3a" : n >= 6 ? C.coralD : C.ink; });
  GEAR.forEach(g => E.K(pill, "s", [[g[6] - .01, 1], [g[6], 1.2], [g[6] + .2, 1, "out"]]));

  // ---------------- bubbles, stamp ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 50) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:10;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble("Ahh. Peace and quiet.", 40, 1120, 440, 120, PEACE, FAM + .6, 50);
  bubble(`Traz a televisão!${sub("(Bring the TV!)")}`, 560, 860, 440, 200, 7.3, 8.9, 50);
  bubble("Hey! You! Skinny boy! Come eat!", 420, 800, 600, 330, EAT, ALR - .05, 48);
  bubble("Oh, I'm alright, thanks—", 30, 1150, 480, 140, ALR, SIT - .05, 46);
  bubble("SIT!", 660, 840, 260, 140, SIT, LIVE - .05, 72);
  bubble("…I live here now.", 60, 800, 440, 260, LIVE, DUR - .4, 52);
  const sb = E.el(S.el, "abs", "left:60px;top:470px;width:960px;display:flex;justify-content:center;z-index:11");
  const st = E.stamp(sb, "ADOPTED.", LIVE + 1.4, { size: 130, rot: -6, bg: "#1f7a3a", shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ---------------- sound ----------------
  for (let k = 0; k < 4; k++) E.clip(k * 4.8, "sfx/waves-seagulls.wav", { vol: k ? .45 : .6, duck: false, to: Math.min(4.8, DUR - k * 4.8) });
  E.clip(PEACE, "voices/ep71/b_peace.wav", { vol: 1.15 });
  E.S(FAM, "scratch", .6); E.clip(FAM + .2, "sfx/stairs-run.wav", { vol: .5, to: 1.6 }); E.clip(FAM + .4, "sfx/crowd-murmur.wav", { vol: .3, duck: false });
  E.clip(6.8, "sfx/sizzle.wav", { vol: .5 });
  E.clip(7.3, "voices/ep71/d_tv.wav", { vol: 1.25 });
  E.clip(8.9, "sfx/canary.wav", { vol: .7 });
  E.clip(EAT, "voices/ep71/g_eat.wav", { vol: 1.2 });
  E.clip(ALR, "voices/ep71/b_alright.wav", { vol: 1.15 });
  E.clip(SIT, "voices/ep71/g_sit.wav", { vol: 1.3 }); E.shake(SIT + .05, 14);
  E.clip(LIVE - .1, "sfx/munch.wav", { vol: .6 });
  E.clip(LIVE, "voices/ep71/b_live.wav", { vol: 1.2 }); E.S(LIVE + 1.4, "sparkle", .6);

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:8");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:9");
  E.text(titleBox, "A *quiet* day at the beach", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[18.2, 1], [18.45, 1.18, "out"], [18.8, 1, "io"]]);
}
