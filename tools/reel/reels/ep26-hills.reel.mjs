// EP.26 "Lisbon: 'only 800 metres'" — Buck the tourist reads the map: the hotel is 800 m away. Then: 247 steps, a 28% street, he
// crawls. A tiny 85-year-old lady with two full shopping bags strolls past him uphill ("Bom dia!"). Tram 28 rattles by full of
// waving passengers. The map: 750 m to go. No voice: a visual gag with real effects (ElevenLabs sfx). Paced per reel-pacing.
export const meta = {
  id: "ep26-hills", date: "2026-10-19",
  images: {
    b_map: "characters/cutouts/buck_map.webp", b_climb: "characters/cutouts/buck_climb.webp", b_crawl: "characters/cutouts/buck_crawl.webp",
    lady: "characters/cutouts/oldlady_bags.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 55, seed: 261, prog: [[0, 4, 7], [5, 9, 12], [7, 11, 14], [9, 12, 16]] });
  const DUR = 15.0;
  const S = E.scene("lisbon", 0, DUR, "light"); E.cur = S;
  const STAIRS = 2.6, HILL = 5.8, LADY = 7.6, TRAM = 10.1, MAP = 12.7;
  const scene = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;opacity:0;overflow:hidden"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };
  const sky = el => E.el(el, "abs", "inset:0;background:linear-gradient(180deg,#8fcdf0,#e4f4fb)");
  const facade = ["#f4c7a1", "#f7e3a3", "#bfe3d3", "#f2b8b0", "#c9d7f2", "#f6d0e0"];
  const house = (parent, x, bottom, w, h, col) => {
    const b = E.el(parent, "abs", `left:${x}px;top:${bottom - h}px;width:${w}px;height:${h}px;background:${col};border-top:30px solid #c0643f`);
    for (let r = 0; r < Math.floor((h - 80) / 190); r++) for (let c = 0; c < 2; c++) E.el(b, "abs", `left:${w / 2 - 105 + c * 120}px;top:${50 + r * 190}px;width:84px;height:120px;background:#3d5a73;border:8px solid #fff;border-radius:42px 42px 4px 4px`);
    return b;
  };

  // ================= A) the map: "only 800 m" =================
  const A = scene(0, STAIRS); sky(A);
  [0, 270, 540, 810].forEach((x, i) => house(A, x - 20, 1400, 290, 900 - (i % 2) * 90, facade[i]));
  E.el(A, "abs", "left:0;top:1400px;width:1080px;height:520px;background:#c9c0b0;background-image:radial-gradient(circle at 20px 20px,rgba(0,0,0,.1) 8px,transparent 9px);background-size:40px 40px");
  const bm = E.el(A, "abs", `left:40px;top:${1800 - 1024 * .95}px;width:${596 * .95}px;height:${1024 * .95}px`);
  E.img(bm, "b_map", `width:${596 * .95}px;height:${1024 * .95}px`);
  const bob = []; for (let t = 0; t < STAIRS; t += .5) bob.push([t, 0, "io"], [t + .25, -8, "io"]);
  E.K(bm, "y", bob);
  // the phone-map card: a straight line, 800 m
  const card = E.el(A, "abs", "left:620px;top:820px;width:400px;height:400px;border-radius:30px;background:#eef3e6;box-shadow:0 14px 34px rgba(0,0,0,.22);overflow:hidden;opacity:0");
  E.el(card, "abs", "inset:0;background-image:linear-gradient(90deg,rgba(0,0,0,.06) 2px,transparent 2px),linear-gradient(rgba(0,0,0,.06) 2px,transparent 2px);background-size:60px 60px");
  E.el(card, "abs", "left:80px;top:300px;width:260px;height:14px;border-radius:7px;background:repeating-linear-gradient(90deg,#2f6db5 0 22px,transparent 22px 36px);transform:rotate(-38deg);transform-origin:0 50%");
  E.el(card, "abs", "left:62px;top:290px;width:36px;height:36px;border-radius:50%;background:#2f6db5;border:6px solid #fff");
  E.el(card, "abs", "left:285px;top:100px;width:50px;height:60px;background:#e5484d;border-radius:50% 50% 50% 0;transform:rotate(-45deg)");
  E.el(card, "abs", `left:40px;top:40px;background:${C.ink};color:#fff;font-weight:900;font-size:48px;padding:.06em .36em .1em;border-radius:.3em`, "800 m");
  E.K(card, "o", [[.2, 1]]); E.K(card, "s", [[0, .96], [.4, 1, "out"]]); E.K(card, "r", [[0, 3], [.4, -2, "out"]]);
  E.S(0.05, "pop", .6);

  // ================= B) the stairs =================
  const B = scene(STAIRS, HILL); sky(B);
  [0, 300, 600, 900].forEach((x, i) => house(B, x - 40, 1100 - i * 120, 300, 700, facade[i + 1]));
  const stairs = E.el(B, "abs", "left:-100px;top:0;width:1400px;height:1920px");
  for (let i = 0; i < 22; i++) E.el(stairs, "abs", `left:${i * 60}px;top:${1860 - i * 44}px;width:1400px;height:${60 + i * 44}px;background:${i % 2 ? "#d9d0c0" : "#cfc5b3"};border-top:6px solid #b8ad98`);
  const bc = E.el(B, "abs", `left:0;top:0;width:${728 * .72}px;height:${982 * .72}px`);
  E.img(bc, "b_climb", `width:${728 * .72}px;height:${982 * .72}px`);
  // climbs slowly up and to the right along the stairs (step-by-step bobs)
  const kx = [], ky = [];
  for (let k = 0; k <= 9; k++) { const t = STAIRS + k * (HILL - STAIRS - .2) / 9; kx.push([t, 60 + k * 36, "io"]); ky.push([t, 1860 - 982 * .72 + 20 - k * 27, "io"], [t + .12, 1860 - 982 * .72 + 8 - k * 27, "out"]); }
  E.K(bc, "x", kx); E.K(bc, "y", ky.sort((a, b) => a[0] - b[0]));
  const steps = E.el(S.el, "abs", `left:100px;top:352px;display:inline-block;background:${C.ink};color:#fff;font-weight:900;font-size:56px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7;opacity:0`, "STEPS: 0");
  E.K(steps, "o", [[STAIRS, 0], [STAIRS + .05, 1], [HILL - .01, 1], [HILL, 0]]);
  E.F(t => { const n = Math.round(Math.min(247, Math.max(0, (t - STAIRS) / (HILL - STAIRS - .3) * 247))), s = "STEPS: " + n; if (steps.textContent !== s) steps.textContent = s; steps.style.background = n > 150 ? C.coralD : C.ink; });
  E.clip(STAIRS + .1, "sfx/footsteps-stairs.wav", { vol: .8, duck: false });
  E.clip(STAIRS + 1.4, "sfx/panting.wav", { vol: .7, to: 1.8 });

  // ================= C) the 28% street =================
  const Cc = scene(HILL, MAP); sky(Cc);
  const slope = x => 1760 - x * .324;                                       // 18° street
  for (let i = 0; i < 5; i++) { const x = i * 250 - 40; house(Cc, x, slope(x) + 40, 250, 760 + 81, facade[i % 6]); }
  E.el(Cc, "abs", "left:0;top:0;width:1080px;height:1920px;background:#bdb3a4;background-image:radial-gradient(circle at 20px 20px,rgba(0,0,0,.12) 8px,transparent 9px);background-size:40px 40px;clip-path:polygon(0 1760px,1080px 1410px,1080px 1920px,0 1920px)");
  // rails along the slope
  for (const off of [70, 130]) E.el(Cc, "abs", `left:-40px;top:${1760 + off}px;width:1300px;height:8px;background:#7b746a;transform-origin:0 0;transform:rotate(-18deg)`);
  // the incline sign
  const sign = E.el(Cc, "abs", "left:820px;top:780px;width:200px;height:620px");
  E.el(sign, "abs", "left:94px;top:170px;width:12px;height:460px;background:#8d8d8d");
  E.el(sign, "abs", "left:0;top:0;width:200px;height:180px;background:#d7262e;clip-path:polygon(50% 0,100% 100%,0 100%)");
  E.el(sign, "abs", "left:26px;top:34px;width:148px;height:130px;background:#fff;clip-path:polygon(50% 0,100% 100%,0 100%)");
  E.el(sign, "abs", "left:0;top:106px;width:200px;text-align:center;font-weight:900;font-size:44px;color:#111", "28%");
  E.K(sign, "s", [[HILL + .2, .4], [HILL + .5, 1, "back"]]); E.S(HILL + .25, "pop", .7);
  // Buck crawling up
  const CW = 901 * .7, CH = 510 * .7;
  const crawl = E.el(Cc, "abs", `left:0;top:0;width:${CW}px;height:${CH}px;transform-origin:50% 100%`);
  E.img(crawl, "b_crawl", `width:${CW}px;height:${CH}px`);
  const cx0 = 400, cx1 = 540;
  E.F(t => {
    const u = Math.min(1, Math.max(0, (t - HILL) / (MAP - HILL))), cx = cx0 + (cx1 - cx0) * u + Math.sin(t * 7) * 4;
    crawl.style.left = (cx - CW / 2) + "px"; crawl.style.top = (slope(cx) + 40 - CH) + "px";
    crawl.style.transform = `rotate(-18deg) translateY(${Math.abs(Math.sin(t * 7)) * -6}px)`;
  });
  E.clip(HILL + .2, "sfx/panting.wav", { vol: .9 });
  E.clip(HILL + 3.0, "sfx/panting.wav", { vol: .8, from: 1.5 });
  // the tiny old lady strolls past, uphill, effortlessly
  const LW = 788 * .5, LH = 951 * .5;
  const lady = E.el(Cc, "abs", `left:0;top:0;width:${LW}px;height:${LH}px;opacity:0;z-index:2`);
  E.img(lady, "lady", `width:${LW}px;height:${LH}px`);
  E.F(t => {
    const u = (t - LADY) / 2.2, cx = -200 + 1500 * u;
    lady.style.opacity = u > 0 && u < 1 ? 1 : 0;
    lady.style.left = (cx - LW / 2) + "px"; lady.style.top = (slope(cx) - LH + 30 - Math.abs(Math.sin(t * 12)) * 10) + "px";
  });
  E.S(LADY + .6, "whoosh", .6);
  // tram 28 rattles down the hill, full of waving people
  const tram = E.el(Cc, "abs", "left:0;top:0;width:760px;height:380px;transform-origin:0 100%;z-index:1");
  E.el(tram, "abs", "left:0;top:40px;width:760px;height:300px;border-radius:40px 40px 16px 16px;background:#ffcf2e;box-shadow:inset 0 -40px 0 #e0a800");
  for (let i = 0; i < 5; i++) {
    const w = E.el(tram, "abs", `left:${50 + i * 140}px;top:80px;width:110px;height:110px;border-radius:14px;background:#3d5a73;border:6px solid #fff6d0;overflow:hidden`);
    const head = E.el(w, "abs", `left:28px;top:34px;width:48px;height:48px;border-radius:50%;background:${["#f1c7a3", "#c68a5e", "#f5d0b4", "#8d5a3b", "#f0c19b"][i]}`);
    const arm = E.el(w, "abs", `left:74px;top:18px;width:14px;height:48px;border-radius:7px;background:${["#e5484d", "#35d07f", "#2f6db5", "#ffb300", "#9b59b6"][i]};transform-origin:50% 100%`);
    E.F(t => { arm.style.transform = `rotate(${Math.sin(t * 14 + i) * 30}deg)`; });
  }
  E.el(tram, "abs", "left:330px;top:0;width:100px;height:44px;border-radius:10px;background:#3b3b3b");
  E.el(tram, "abs", "left:620px;top:95px;font-weight:900;font-size:56px;color:#3b3b3b", "28");
  E.F(t => {
    const u = (t - TRAM) / 2.2, x = 1200 - 2200 * u;
    tram.style.opacity = u > 0 && u < 1 ? 1 : 0;
    tram.style.left = x + "px"; tram.style.top = (slope(x) + 110 - 380) + "px";
    tram.style.transform = `rotate(-18deg) translateY(${Math.sin(t * 40) * 2}px)`;
  });
  E.clip(TRAM - .1, "sfx/tram-pass.wav", { vol: .9 });

  // ================= D) the map again =================
  const D = scene(MAP, DUR);
  E.el(D, "abs", "inset:0;background:#eef3e6;background-image:linear-gradient(90deg,rgba(0,0,0,.06) 2px,transparent 2px),linear-gradient(rgba(0,0,0,.06) 2px,transparent 2px);background-size:90px 90px");
  E.el(D, "abs", "left:200px;top:1250px;width:700px;height:22px;border-radius:11px;background:repeating-linear-gradient(90deg,#2f6db5 0 34px,transparent 34px 54px);transform:rotate(-38deg);transform-origin:0 50%");
  E.el(D, "abs", "left:232px;top:1206px;width:60px;height:60px;border-radius:50%;background:#2f6db5;border:10px solid #fff;box-shadow:0 0 0 18px rgba(47,109,181,.25)");
  E.el(D, "abs", "left:740px;top:660px;width:90px;height:110px;background:#e5484d;border-radius:50% 50% 50% 0;transform:rotate(-45deg)");
  const pd = E.el(D, "abs", `left:300px;top:1120px;width:${CW * .55}px;height:${CH * .55}px;transform:rotate(-12deg)`);
  E.img(pd, "b_crawl", `width:${CW * .55}px;height:${CH * .55}px`);
  const sb = E.el(S.el, "abs", "left:100px;top:1460px;width:880px;display:flex;justify-content:center;z-index:9");
  const st = E.stamp(sb, "750 m TO GO", MAP + .35, { size: 110, rot: -6, shake: 16 });
  st.style.alignSelf = "center"; E.until(st, DUR, .1);
  E.S(MAP, "scratch", .7); E.S(MAP + .6, "nope", .7);

  // ---------------- bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 62) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    E.S(t0 + .02, "pop", .6);
    return b;
  };
  bubble("Only 800 metres! Easy!", 40, 540, 540, "l", .5, STAIRS);
  bubble("Bom dia!", 640, 1000, 300, "l", LADY + 1.1, LADY + 2.2, 56);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Lisbon: *“only 800 m”*", { size: 64, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[14.3, 1], [14.55, 1.18, "out"], [14.85, 1, "io"]]);
}
