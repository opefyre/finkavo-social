// EP.1 "The NIF" (v2) — Otto tries to get a NIF. Three counters send him in a circle, then a speed montage (Day 2 -> Day 365,
// he ages, the paper stack grows), a tiny payoff, and a twist: COME BACK TOMORROW, and he turns to dust.
// (One employee, Sr. Carimbo, at every counter: a stranger must not have to wonder who the other man is.)
// Exaggerated on purpose (the caption says so); no claim about real rules. Characters: branding/characters (expression library).
// Beats are cut fast: a new visual or sound every 0.4-1.5 s, the words are short, the stamps carry the joke.
export const meta = {
  id: "ep1-nif", date: "2026-09-25",
  images: {
    o_worried: "characters/cutouts/otto_worried.webp", o_hopeful: "characters/cutouts/otto_hopeful.webp", o_smug: "characters/cutouts/otto_smug.webp",
    o_confused: "characters/cutouts/otto_confused.webp", o_shocked: "characters/cutouts/otto_shocked.webp", o_angry: "characters/cutouts/otto_angry.webp",
    o_sleepy: "characters/cutouts/otto_sleepy.webp", o_stubble: "characters/cutouts/otto_stubble.webp", o_ancient: "characters/cutouts/otto_ancient.webp",
    c_deadpan: "characters/cutouts/carimbo_deadpan.webp", c_smug: "characters/cutouts/carimbo_smug.webp", c_bored: "characters/cutouts/carimbo_bored-asleep.webp",
    c_angry: "characters/cutouts/carimbo_angry.webp", c_surprised: "characters/cutouts/carimbo_surprised.webp", c_evil: "characters/cutouts/carimbo_evil-grin.webp",
    c_laughing: "characters/cutouts/carimbo_laughing.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 52, seed: 21, prog: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]] });
  const DUR = 15.2;
  const S = E.scene("counter", 0, DUR, "light"); E.cur = S;
  const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();   // fixed seed: every frame identical on every worker
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  // ---------------- the stage: three counters (cuts), Otto, props. Words and stamps sit above it. ----------------
  const stage = E.el(S.el, "abs", "inset:0;transform-origin:320px 1150px");
  const tileSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><rect width='140' height='140' fill='#f7f4ec'/><rect x='2' y='2' width='136' height='136' rx='6' fill='none' stroke='#c9d8ea' stroke-width='3'/><g fill='#2f6db5'><circle cx='70' cy='70' r='10'/><ellipse cx='70' cy='42' rx='9' ry='17'/><ellipse cx='70' cy='98' rx='9' ry='17'/><ellipse cx='42' cy='70' rx='17' ry='9'/><ellipse cx='98' cy='70' rx='17' ry='9'/></g><g fill='#7fa8dc'><circle cx='16' cy='16' r='6'/><circle cx='124' cy='16' r='6'/><circle cx='16' cy='124' r='6'/><circle cx='124' cy='124' r='6'/></g></svg>`;
  const tileUrl = `url("data:image/svg+xml;utf8,${encodeURIComponent(tileSvg)}")`;
  const shots = [], disps = [];
  const counter = (label, clerkNames, faceList, tint) => {
    const P = E.el(stage, "abs", "inset:0;overflow:hidden;display:none");
    E.el(P, "abs", `left:0;top:548px;width:1080px;height:1012px;background-color:${tint};background-image:${tileUrl};background-size:140px 140px;background-position:-20px 0`);
    E.el(P, "abs", "left:0;top:532px;width:1080px;height:16px;background:#2f6db5");
    E.el(P, "abs", "left:470px;top:562px;width:420px;height:70px;border-radius:14px;background:#12305a;color:#fff;font-weight:900;font-size:40px;letter-spacing:.16em;display:flex;align-items:center;justify-content:center", label);
    disps.push(E.el(P, "abs", "left:70px;top:600px;width:220px;height:120px;border-radius:16px;background:#111;color:#ff4b3a;font-weight:900;font-size:46px;white-space:nowrap;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 18px rgba(0,0,0,.25)", "N.º 913"));
    const win = E.el(P, "abs", "left:330px;top:642px;width:700px;height:548px;overflow:hidden;background:#d6e9ee;border:14px solid #3b4b5c;border-radius:22px 22px 0 0");
    const nod = E.el(win, "abs", "inset:0");
    const idle = E.el(nod, "abs", "inset:0");
    const faces = clerkNames.map(n => E.img(idle, n, "position:absolute;left:50%;transform:translateX(-50%);top:0;height:900px;width:auto"));
    E.el(P, "abs", "left:0;top:1190px;width:1080px;height:48px;background:#e3ab6b;border-radius:10px 10px 0 0");
    E.el(P, "abs", "left:0;top:1238px;width:1080px;height:322px;background-color:#b07a45;background-image:repeating-linear-gradient(90deg,rgba(0,0,0,.07) 0 4px,transparent 4px 120px)");
    E.el(P, "abs", "left:0;top:1560px;width:1080px;height:360px;background:#dccaa5");
    const sh = { P, nod, idle, faces, names: clerkNames, faceList };
    shots.push(sh); return sh;
  };
  const s1 = counter("BALCÃO 1", ["c_deadpan", "c_smug", "c_bored", "c_angry", "c_laughing", "c_evil"],
    [[0, "c_deadpan"], [2.5, "c_smug"], [7.2, "c_evil"], [7.7, "c_bored"], [8.2, "c_angry"], [8.7, "c_laughing"], [9.2, "c_bored"], [9.7, "c_smug"], [10.3, "c_deadpan"]], "#f7f4ec");
  const s2 = counter("BALCÃO 2", ["c_deadpan", "c_smug", "c_bored"], [[0, "c_deadpan"], [4.0, "c_smug"]], "#f4f0e2");   // the same employee at every counter
  const s3 = counter("BALCÃO 3", ["c_deadpan", "c_evil", "c_surprised", "c_laughing"],
    [[0, "c_deadpan"], [4.9, "c_evil"], [6.0, "c_surprised"], [10.8, "c_deadpan"], [13.0, "c_evil"], [13.7, "c_laughing"]], "#f9f5ea");
  const shotAt = t => (t < 3.6 ? s1 : t < 4.9 ? s2 : t < 7.2 ? s3 : t < 10.8 ? s1 : s3);
  const cuts = [3.6, 4.9, 7.2, 10.8];
  // camera: a small punch-in on every cut, and the big punch-in for the freeze on "…wait." (explicit hold keys so nothing creeps between them)
  const zoom = [[0, 1]];
  for (const t of cuts) { zoom.push([t - .01, 1], [t, 1.07], [t + .16, 1, "out"]); E.S(t - .02, "swish", .8); }
  zoom.push([5.99, 1], [6.0, 1], [6.12, 1.26, "out"], [7.05, 1.26], [7.2, 1, "io"]);
  zoom.sort((a, b) => a[0] - b[0]);
  E.K(stage, "s", zoom);                                                              // (the 7.2 cut shares its time with the release; the later key wins)
  E.F(t => {
    const cur = shotAt(t);
    for (const sh of shots) {
      sh.P.style.display = sh === cur ? "block" : "none";
      const face = at(sh.faceList, t);
      sh.faces.forEach((f, i) => { f.style.opacity = sh.names[i] === face ? 1 : 0; });
      sh.idle.style.transform = `translateY(${Math.sin(t * 2.4) * 4}px)`;
    }
  });
  const nod = (sh, t) => { E.K(sh.nod, "y", [[t, 0], [t + .09, 66, "in"], [t + .22, 0, "out"]]); E.K(sh.nod, "sy", [[t, 1], [t + .09, .94, "in"], [t + .22, 1, "out"]]); };

  // ---------------- Otto ----------------
  E.el(stage, "abs", "left:30px;top:1830px;width:540px;height:46px;border-radius:50%;background:rgba(60,40,20,.2);filter:blur(7px)");
  const OW = E.el(stage, "abs", "left:20px;top:900px;width:570px;height:860px");
  const OI = E.el(OW, "abs", "inset:0;transform-origin:50% 100%");
  const OTTO = ["o_worried", "o_hopeful", "o_smug", "o_confused", "o_shocked", "o_angry", "o_sleepy", "o_stubble", "o_ancient"];
  const ofaces = OTTO.map(n => E.img(OI, n, "position:absolute;left:0;top:0;width:570px;height:860px;object-fit:contain"));
  const ottoFace = [[0, "o_smug"], [2.3, "o_hopeful"], [3.6, "o_worried"], [4.9, "o_confused"], [6.0, "o_shocked"], [7.2, "o_angry"], [8.0, "o_sleepy"], [8.8, "o_stubble"], [9.8, "o_ancient"]];
  E.K(OW, "x", [[0, -760], [.55, 0, "back"]]);                                   // bursts in from the left
  E.S(.05, "whoosh", .8); E.S(.5, "thud", .7);
  E.K(OI, "o", [[13.95, 1], [14.2, 0, "in"]]);                                     // gone in a puff
  E.F(t => {
    const f = at(ottoFace, t);
    ofaces.forEach((im, i) => { im.style.opacity = OTTO[i] === f ? 1 : 0; });
    let y = Math.sin(t * 3.4) * 4, sy = 1 + Math.sin(t * 3.4) * .006, r = 0;
    if (t >= 6.0 && t < 7.2) r += Math.sin(t * 70) * 1.6;                          // shaking with shock
    if (t >= 7.2 && t < 8.0) r += Math.sin(t * 40) * 1.0;
    if (t >= 9.8) { const k = Math.min(1, (t - 9.8) / .5); y += k * 26; sy *= 1 - k * .05; r -= k * 2; }
    OI.style.transform = `translateY(${y}px) rotate(${r}deg) scaleY(${sy})`;
  });

  // props: the paper stack that grows through the montage, and the slip that finally arrives
  const stack = E.el(stage, "abs", "left:800px;bottom:360px;width:230px;height:0;background:repeating-linear-gradient(0deg,#fff 0 11px,#c9bfa8 11px 14px);border:3px solid #b9ae95;border-bottom:0;border-radius:6px 6px 0 0;box-shadow:0 10px 24px rgba(0,0,0,.22)");
  E.K(stack, "h", [[7.2, 0], [10.7, 640, "in"]]);
  const slip = E.el(stage, "abs", "left:0;top:0;width:380px;height:230px;background:#fff;border:4px solid #12305a;border-radius:14px;box-shadow:0 12px 26px rgba(0,0,0,.28);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;opacity:0");
  E.el(slip, "", "font-weight:900;font-size:42px;color:#12305a;letter-spacing:.14em", "NIF");
  E.el(slip, "", "font-weight:900;font-size:50px;color:#0b2a2c;letter-spacing:.06em", "123 456 789");
  E.K(slip, "x", [[11.05, 640], [11.65, 300, "out"]]); E.K(slip, "y", [[11.05, 1080], [11.65, 1200, "out"]]);
  E.K(slip, "r", [[11.05, 14], [11.65, -6, "out"]]); E.K(slip, "o", [[11.05, 0], [11.12, 1], [13.15, 1], [13.35, 0, "in"]]);
  E.S(11.05, "swish"); E.S(11.68, "pop", .9); E.S(11.75, "ding"); E.S(11.8, "sparkle", .7);

  // dust: what is left of Otto
  const dust = [];
  for (let i = 0; i < 46; i++) {
    const d = E.el(stage, "abs", `left:${200 + rnd() * 240}px;top:${1050 + rnd() * 450}px;width:${16 + rnd() * 30}px;height:${16 + rnd() * 30}px;border-radius:50%;background:${["#c9b28a", "#b39a6e", "#e0cfa8", "#8a7a5c"][i % 4]};opacity:0`);
    const ang = rnd() * Math.PI * 2, sp = 160 + rnd() * 460, t0 = 13.95 + rnd() * .1;
    E.K(d, "x", [[t0, 0], [t0 + 1.1, Math.cos(ang) * sp, "out"]]); E.K(d, "y", [[t0, 0], [t0 + 1.1, Math.sin(ang) * sp - 260, "out"]]);
    E.K(d, "o", [[t0, 0], [t0 + .08, .95], [t0 + .8, .9], [t0 + 1.2, 0, "in"]]);
    E.K(d, "s", [[t0, .4], [t0 + .5, 1.2, "out"]]); dust.push(d);
  }
  for (let i = 0; i < 9; i++) {                                                     // soft dust clouds
    const sz = 150 + rnd() * 130;
    const c = E.el(stage, "abs", `left:${180 + rnd() * 260}px;top:${1000 + rnd() * 460}px;width:${sz}px;height:${sz}px;border-radius:50%;background:rgba(232,222,200,.92);filter:blur(7px);opacity:0`);
    const t0 = 13.93 + rnd() * .12;
    E.K(c, "o", [[t0, 0], [t0 + .08, .95], [t0 + .7, .55], [t0 + 1.25, 0, "in"]]); E.K(c, "s", [[t0, .3], [t0 + 1.0, 1.7, "out"]]); E.K(c, "y", [[t0, 0], [t0 + 1.25, -120 - rnd() * 90, "out"]]);
  }
  E.S(13.95, "poof");

  // ---------------- words (top zone) and stamps ----------------
  const TOP = "left:100px;top:250px;width:780px;display:flex;flex-direction:column;gap:20px";
  const hookBox = E.el(S.el, "abs", "left:100px;top:262px;width:800px");
  const hook = E.text(hookBox, "Get a *NIF.* *$Easy.*", { size: 94, lh: 1.02, instant: true, id: "hook", nowrap: true });
  E.until(hook, 2.3);

  const attempt = (n, t0, t1) => {
    const b = E.el(S.el, "abs", "left:100px;top:262px;width:780px");
    const e = E.el(b, "tx", `font-size:112px;line-height:1;font-weight:900;letter-spacing:-.03em;color:${C.ink}`, `ATTEMPT <span style="display:inline-block;background:${C.amber};padding:0 .2em .04em;border-radius:.22em">${n}</span>`);
    E.K(b, "o", [[t0, 0], [t0 + .07, 1], [t1 - .1, 1], [t1, 0, "in"]]); E.K(b, "s", [[t0, .85], [t0 + .25, 1, "back"]]);
    E.S(t0 + .03, "pop", .8);
  };
  attempt(1, 2.4, 3.6); attempt(2, 3.7, 4.9); attempt(3, 5.0, 6.0);
  const waitBox = E.el(S.el, "abs", TOP);
  const wait = E.text(waitBox, "*!…wait.*", { size: 110, t: 6.1, id: "wait", stagger: .1 });
  E.until(wait, 7.3);

  const dayBox = E.el(S.el, "abs", TOP);
  const dayNum = E.el(dayBox, "tx", `font-size:150px;line-height:1;font-weight:900;letter-spacing:-.04em;color:${C.ink}`, "DAY 2");
  E.K(dayBox, "o", [[7.2, 0], [7.28, 1], [13.1, 1], [13.25, 0, "in"]]);
  E.count(dayNum, 7.3, 10.7, 2, 365, { ease: "in", fmt: v => "DAY " + v, ticks: 22 });
  E.F(t => { dayNum.style.color = t > 9.6 ? C.coralD : C.ink; });

  const stampBox = () => E.el(S.el, "abs", "left:70px;top:1250px;width:940px;display:flex;justify-content:center");
  const slam = (str, t, tOut, o = {}) => {                                        // a stamp without the white flash (for the fast montage)
    const { size = 78, rot = (rnd() * 14 - 7), big = false } = o;
    const box = stampBox();
    const el = big ? E.stamp(box, str, t, { size, rot, shake: 20 })
      : (() => { const e = E.el(box, "", `display:inline-block;background:${C.coral};color:${C.ink};font-weight:900;font-size:${size}px;line-height:1.02;letter-spacing:-.03em;padding:.16em .3em .2em;border-radius:.24em;text-align:center`, str);
        E.K(e, "s", [[t, 1.6], [t + .16, 1, "back"]]); E.K(e, "r", [[t, rot - 10], [t + .18, rot, "out"]]); E.K(e, "o", [[t, 0], [t + .05, 1]]);
        E.S(t + .1, "thud", .8); E.shake(t + .1, 9, .2); return e; })();
    E.until(el, tOut, .12); return el;
  };
  // the three refusals
  nod(s1, 2.62); slam("NEED: PROOF OF ADDRESS", 2.7, 3.6, { size: 70, big: true });
  nod(s2, 3.92); slam("NEED: A NIF", 4.0, 4.9, { size: 84, big: true });
  nod(s3, 5.22); slam("NEED: RENTAL CONTRACT", 5.3, 6.0, { size: 66, big: true });
  E.S(6.0, "scratch");
  // the montage: seven refusals, half a second each
  const M = [["PHOTO OF YOUR SUITCASE", 7.2], ["FORM 27-B (LOST)", 7.7], ["PROOF YOU EXIST", 8.15], ["WRONG COLOUR PEN", 8.6], ["STAMP FOR THE STAMP", 9.05], ["COME BACK IN 5 DAYS", 9.5], ["NEW RULE: NEW FORM", 9.95]];
  M.forEach(([s, t], i) => { const nx = i + 1 < M.length ? M[i + 1][1] : 10.7; nod(s1, t - .08); slam(s, t, nx, { size: 66 }); });
  // the twist
  nod(s3, 13.12); slam("COME BACK TOMORROW", 13.2, DUR, { size: 72, big: true });

  // the ticket display tells the story of the days: a different big number on every visit, 001 at the payoff, 999 again after the twist
  const nums = [[0, 913], [2.4, 887], [3.7, 941], [5.0, 968]];
  M.forEach(([_, t], i) => nums.push([t, [731, 802, 655, 947, 889, 712, 976][i]]));
  nums.push([10.8, 1], [13.2, 999]);
  E.F(t => { const n = at(nums, t), txt = "N.º " + String(n).padStart(3, "0"); for (const d of disps) if (d.textContent !== txt) d.textContent = txt; });

  E.finish(DUR);
  E.K(E.logo, "s", [[13.9, 1], [14.15, 1.18, "out"], [14.5, 1, "io"]]);   // the only brand touch: the logo, once, after the punchline
}
