// "Portuguese, decoded" — four phrases every expat knows, each translated by one visual gag (a dictionary card), with Dona Fernanda
// stamping the real meaning. Ja vai = a loading bar stuck at 99%; Amanha = a sticky note that hops to tomorrow forever; Nao ha problema =
// the office burns while the clerk sips coffee; Pois = every answer is "Pois." until Otto's head explodes. Stands alone (a stranger needs no
// context), no series numbering, no "follow" line. Exaggerated on purpose (the caption says so).
export const meta = {
  id: "ep4-decoded", date: "2026-09-28",
  images: {
    o_hopeful: "characters/cutouts/otto_hopeful.webp", o_worried: "characters/cutouts/otto_worried.webp", o_sleepy: "characters/cutouts/otto_sleepy.webp",
    o_defeated: "characters/cutouts/otto_defeated.webp", o_panic: "characters/cutouts/otto_panic.webp", o_shocked: "characters/cutouts/otto_shocked.webp",
    o_confused: "characters/cutouts/otto_confused.webp", o_angry: "characters/cutouts/otto_angry.webp", o_smug: "characters/cutouts/otto_smug.webp",
    c_smug: "characters/cutouts/carimbo_smug.webp", c_deadpan: "characters/cutouts/carimbo_deadpan.webp", c_evil: "characters/cutouts/carimbo_evil-grin.webp",
    d_know: "characters/cutouts/dona_knowing.webp", d_skep: "characters/cutouts/dona_skeptical.webp", d_smirk: "characters/cutouts/dona_smirk.webp",
    d_roll: "characters/cutouts/dona_eye-roll.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 55, seed: 52, prog: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]] });
  const DUR = 15.0;
  const S = E.scene("decoded", 0, DUR, "light"); E.cur = S;
  const rnd = (() => { let s = 23; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const T = [0, 1.9, 5.0, 8.1, 11.4, DUR];                                // T[0] the title card, T[1..4] the four gags, T[5] the end

  const stage = E.el(S.el, "abs", "inset:0;transform-origin:540px 1000px");
  E.el(stage, "abs", "left:0;top:1700px;width:1080px;height:220px;background:#dccaa5");                  // floor
  // the dictionary card: every gag draws inside it
  const card = E.el(stage, "abs", "left:40px;top:560px;width:1000px;height:520px;border-radius:40px;background:#fff;box-shadow:0 22px 50px rgba(11,42,44,.16);overflow:hidden");
  const groups = [0, 1, 2, 3, 4].map(() => E.el(card, "abs", "inset:0;display:none"));
  const zoom = [[0, 1]];
  for (const t of T.slice(1, 5)) { zoom.push([t - .01, 1], [t, 1.05], [t + .2, 1, "out"]); E.S(t - .02, "swish", .8); }

  // ---------- gag 0: the title card ----------
  E.el(groups[0], "abs", `inset:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:170px;letter-spacing:-.04em;color:${C.ink}`, `PT <span style="color:${C.mintD};margin:0 .18em">→</span> EN`);

  // ---------- gag 1: "Já vai" — a loading bar that never finishes ----------
  const g1 = groups[1], t1 = T[1];
  E.el(g1, "abs", `left:100px;top:96px;font-weight:900;font-size:48px;color:${C.mute};letter-spacing:.01em`, "1 second remaining…");
  const spin = E.el(g1, "abs", `left:840px;top:64px;width:96px;height:96px;border-radius:50%;border:12px solid rgba(11,42,44,.12);border-top-color:${C.mintD}`);
  E.el(g1, "abs", "left:100px;top:250px;width:720px;height:56px;border-radius:28px;background:rgba(11,42,44,.10);overflow:hidden");
  const fill1 = E.el(g1, "abs", `left:100px;top:250px;width:720px;height:56px;border-radius:28px;background:${C.mintD};transform-origin:0 50%`);
  E.K(fill1, "sx", [[t1 + .3, .001], [t1 + 1.0, .99, "out"], [t1 + 2.2, .996, "lin"]]);
  const pct = E.el(g1, "abs", `left:845px;top:246px;font-weight:900;font-size:56px;color:${C.ink}`, "0%");
  E.F(t => {
    spin.style.transform = `rotate(${t * 540}deg)`;
    const u = Math.min(1, Math.max(0, (t - (t1 + .3)) / .7)); pct.textContent = Math.round(99 * E.EASE.out(u)) + "%";
  });
  E.S(t1 + .3, "whoosh", .6);

  // ---------- gag 2: "Amanhã" — the sticky note hops to tomorrow, forever ----------
  const g2 = groups[2], t2 = T[2];
  E.el(g2, "abs", `left:0;top:0;width:1000px;height:78px;background:${C.coral}`);
  const mon = E.el(g2, "abs", "left:44px;top:8px;font-weight:900;font-size:52px;color:#fff;letter-spacing:.06em", "SEP 2026");
  const cells = [];
  for (let i = 0; i < 28; i++) {
    const cx = 44 + (i % 7) * 130, cy = 96 + Math.floor(i / 7) * 92;
    E.el(g2, "abs", `left:${cx}px;top:${cy}px;width:120px;height:80px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:40px;color:${C.mute}`, String(i + 1));
    cells.push([cx, cy]);
  }
  const todayRing = E.el(g2, "abs", `width:88px;height:88px;border-radius:50%;border:8px solid ${C.mintD}`);
  const sticky = E.el(g2, "abs", "width:150px;height:96px;background:#ffe36e;box-shadow:0 8px 14px rgba(0,0,0,.22);display:flex;align-items:center;justify-content:center;text-align:center;font-weight:900;font-size:27px;line-height:1.05;color:#5b4a00;transform:rotate(-4deg)", "TOMOR-<br>ROW");
  const hopT = [.45, .78, 1.06, 1.3, 1.5, 1.67, 1.82, 1.95, 2.06];       // the hops speed up
  const hopIdx = [24, 25, 26, 27, 0, 1, 2, 3, 4];                          // day 25, 26, 27, 28, then the next month's 1, 2, 3 …
  E.F(t => {
    let k = -1; hopT.forEach((h, i) => { if (t >= t2 + h) k = i; });
    const idx = k < 0 ? 24 : hopIdx[k];
    const [sx, sy] = cells[idx]; sticky.style.left = (sx - 12) + "px"; sticky.style.top = (sy - 8) + "px";
    const [rx, ry] = cells[Math.max(0, idx - 1)]; todayRing.style.left = (rx + 16) + "px"; todayRing.style.top = (ry - 4) + "px";
    mon.textContent = k < 4 ? "SEP 2026" : k < 7 ? "OCT 2026" : "2027";
  });
  hopT.forEach(h => E.S(t2 + h, "tick", .7));
  [4, 7].forEach(i => E.S(t2 + hopT[i], "pop", .7));

  // ---------- gag 3: "Não há problema" — the office burns, the clerk sips ----------
  const g3 = groups[3], t3 = T[3];
  E.el(g3, "abs", "inset:0;background:#1d4f4c");
  E.img(g3, "c_smug", "position:absolute;left:50%;transform:translateX(-50%);top:8px;height:760px;width:auto");
  const mug = E.el(g3, "abs", "left:700px;top:296px;width:104px;height:92px;border-radius:8px 8px 26px 26px;background:#fff;box-shadow:0 6px 0 #cfc7b8");
  E.el(mug, "abs", "left:96px;top:16px;width:34px;height:44px;border:9px solid #fff;border-left:0;border-radius:0 22px 22px 0");
  const steam = [0, 1, 2].map(i => E.el(g3, "abs", `left:${718 + i * 30}px;top:${226}px;width:10px;height:64px;border-radius:6px;background:rgba(255,255,255,.7)`));
  const flames = [];
  for (let i = 0; i < 10; i++) {
    const w = 150 + rnd() * 90;
    flames.push({ el: E.el(g3, "abs", `left:${-20 + i * 106 + rnd() * 24}px;bottom:-30px;width:${w}px;height:${150 + rnd() * 80}px;border-radius:50% 50% 45% 45% / 72% 72% 28% 28%;background:radial-gradient(ellipse at 50% 85%,#fff3a0 0%,#ffb13c 34%,#ff5b2e 66%,rgba(255,60,30,0) 72%);transform-origin:50% 100%;transform:scale(0)`), ph: rnd() * 6 });
  }
  const heat = E.el(g3, "abs", "inset:0;background:rgba(255,70,30,.0);pointer-events:none");
  const smoke = [0, 1, 2, 3, 4].map(i => { const s = E.el(g3, "abs", `left:${80 + i * 190}px;top:340px;width:${150 + rnd() * 60}px;height:${150 + rnd() * 60}px;border-radius:50%;background:rgba(20,20,20,.5);filter:blur(10px);opacity:0`);
    E.K(s, "y", [[t3 + .6 + i * .12, 0], [t3 + 2.4, -300, "out"]]); E.K(s, "o", [[t3 + .6 + i * .12, 0], [t3 + 1.0 + i * .12, .8], [t3 + 2.4, 0]]); return s; });
  E.F(t => {
    const grow = E.EASE.io(Math.min(1, Math.max(0, (t - (t3 + .35)) / 1.3)));
    flames.forEach((f, i) => { const fl = 1 + .13 * Math.sin(t * 12 + f.ph); f.el.style.transform = `scale(${grow * (1 + .08 * Math.sin(t * 9 + i)) },${grow * fl})`; });
    heat.style.background = `rgba(255,70,30,${grow * (.12 + .06 * Math.sin(t * 10))})`;
    steam.forEach((s, i) => { s.style.opacity = .55 + .3 * Math.sin(t * 5 + i); s.style.transform = `translateY(${-((t * 30 + i * 20) % 40)}px)`; });
  });
  E.S(t3 + .4, "riser", .6); E.flash(t3 + .5, "#ff5a30", .28, .35);

  // ---------- gag 4: "Pois." — every answer is the same word ----------
  const g4 = groups[4], t4 = T[4];
  E.img(g4, "c_deadpan", "position:absolute;left:760px;transform:translateX(-50%);top:8px;height:720px;width:auto");
  const bubble = (txt, x, y, bg, t0, t1, size = 62, fg = C.ink) => {
    const b = E.el(g4, "abs", `left:${x}px;top:${y}px;padding:.18em .42em .24em;border-radius:34px;background:${bg};color:${fg};font-weight:900;font-size:${size}px;letter-spacing:-.02em;white-space:nowrap;box-shadow:0 8px 18px rgba(0,0,0,.18);opacity:0`, txt);
    E.K(b, "s", [[t0, .5], [t0 + .22, 1, "back"]]); E.K(b, "o", [[t0, 0], [t0 + .06, 1], [t1, 1], [t1 + .12, 0, "in"]]); E.S(t0 + .03, "pop", .8); return b;
  };
  bubble("Open?", 70, 90, "#eef2f3", t4 + .15, t4 + .95);
  bubble("Pois.", 330, 250, "#c6f0df", t4 + .55, t4 + .95);
  bubble("Fixed?", 70, 90, "#eef2f3", t4 + .9, t4 + 1.6);
  bubble("Pois.", 330, 250, "#c6f0df", t4 + 1.25, t4 + 1.6);
  bubble("YES OR NO?!", 40, 90, "#ffe1d9", t4 + 1.6, t4 + 2.2, 70);
  bubble("POIS.", 250, 96, "#c6f0df", t4 + 2.0, t4 + 2.6, 110);

  // ---------- Otto and Dona Fernanda ----------
  const OW = E.el(stage, "abs", "left:20px;top:1060px;width:474px;height:700px");
  const OI = E.el(OW, "abs", "inset:0;transform-origin:50% 100%");
  const OTTO = ["o_smug", "o_hopeful", "o_worried", "o_sleepy", "o_defeated", "o_panic", "o_shocked", "o_confused", "o_angry"];
  const ofaces = OTTO.map(n => E.img(OI, n, "position:absolute;left:0;top:0;width:474px;height:700px;object-fit:contain"));
  const ottoFace = [[0, "o_smug"], [T[1], "o_hopeful"], [T[1] + 1.2, "o_worried"], [T[1] + 1.9, "o_sleepy"],
    [T[2], "o_hopeful"], [T[2] + 1.0, "o_worried"], [T[2] + 2.0, "o_defeated"],
    [T[3], "o_shocked"], [T[3] + .5, "o_panic"],
    [T[4], "o_confused"], [T[4] + 1.0, "o_angry"], [T[4] + 1.8, "o_panic"]];
  E.K(OW, "x", [[0, -560], [.5, 0, "back"]]); E.S(.05, "whoosh", .8); E.S(.45, "thud", .7);
  const POP = T[4] + 2.15;                                                // Otto's head goes
  E.K(OI, "o", [[POP, 1], [POP + .1, 0, "in"]]);
  const DW = E.el(stage, "abs", "left:590px;top:1060px;width:459px;height:700px");
  const DI = E.el(DW, "abs", "inset:0");
  const DN = ["d_know", "d_skep", "d_smirk", "d_roll"];
  const dfaces = DN.map(n => E.img(DI, n, "position:absolute;left:0;top:0;width:459px;height:700px;object-fit:contain"));
  const labelAt = [T[1] + 2.15, T[2] + 2.15, T[3] + 2.15, T[4] + 2.4];
  const donaFace = [[0, "d_know"], [T[1], "d_skep"], [labelAt[0], "d_smirk"], [T[2], "d_skep"], [labelAt[1], "d_smirk"], [T[3], "d_roll"], [labelAt[2], "d_smirk"], [T[4], "d_skep"], [labelAt[3], "d_smirk"]];
  E.F(t => {
    const f = at(ottoFace, t); ofaces.forEach((im, i) => { im.style.opacity = OTTO[i] === f ? 1 : 0; });
    const d = at(donaFace, t); dfaces.forEach((im, i) => { im.style.opacity = DN[i] === d ? 1 : 0; });
    let r = 0;
    if (t >= T[3] && t < T[3] + 2.2) r += Math.sin(t * 66) * 2;              // panic during the fire
    if (t >= T[4] + 1.8 && t < POP) r += Math.sin(t * 50) * 1.6;
    OI.style.transform = `translateY(${Math.sin(t * 3.4) * 4}px) rotate(${r}deg)`;
    DI.style.transform = `translateY(${Math.sin(t * 2.4 + 1) * 3}px)`;
  });
  // the head goes: confetti from where his head was
  ["#7fe0c0", "#ff7d63", "#f3b072", "#ffffff", "#ffe36e"].forEach((col, ci) => {
    for (let i = 0; i < 9; i++) {
      const p = E.el(stage, "abs", `left:250px;top:1130px;width:${14 + rnd() * 18}px;height:${14 + rnd() * 18}px;border-radius:${i % 2 ? "50%" : "4px"};background:${col};opacity:0`);
      const a = rnd() * Math.PI * 2, sp = 220 + rnd() * 520, t0 = POP + rnd() * .05;
      E.K(p, "x", [[t0, 0], [t0 + 1.0, Math.cos(a) * sp, "out"]]); E.K(p, "y", [[t0, 0], [t0 + 1.0, Math.sin(a) * sp - 120, "out"]]);
      E.K(p, "o", [[t0, 0], [t0 + .05, 1], [t0 + .8, 1], [t0 + 1.1, 0, "in"]]); E.K(p, "r", [[t0, 0], [t0 + 1.0, (rnd() - .5) * 720]]);
    }
  });
  E.S(POP, "poof"); E.S(POP + .02, "sparkle", .8); E.flash(POP, "#ffffff", .4, .2);

  // ---------- the words: the phrase, its gloss, and Dona Fernanda's stamp ----------
  const TOP = "left:100px;top:262px;width:800px;display:flex;flex-direction:column;gap:14px";
  const hookBox = E.el(S.el, "abs", "left:100px;top:262px;width:800px");
  const hook = E.text(hookBox, "Portuguese, *$decoded.*", { size: 68, lh: 1.02, instant: true, id: "hook", nowrap: true });
  E.until(hook, T[1] - .05);
  const PH = [["Já *$vai*", "(right away)"], ["*$Amanhã*", "(tomorrow)"], ["Não há *$problema*", "(no problem)"], ["*$Pois.*", "(…yes?)"]];
  PH.forEach(([ph, gloss], i) => {
    const t0 = T[i + 1], t1 = T[i + 2] - .08;
    const box = E.el(S.el, "abs", TOP);
    const a = E.text(box, ph, { size: i === 2 ? 82 : 96, lh: 1.0, t: t0, id: "ph" + i, nowrap: true });
    const b = E.text(box, gloss, { size: 46, weight: 800, color: C.mute, t: t0 + .25, id: "gl" + i, nowrap: true });
    E.until(a, t1); E.until(b, t1);
  });
  const LABEL = ["= 45 MIN", "= NEVER", "= PROBLEM", "= ANYTHING"];
  LABEL.forEach((txt, i) => {
    const t = labelAt[i], tOut = i < 3 ? T[i + 2] - .05 : DUR;
    const el = E.el(card, "", `position:absolute;left:0;right:0;bottom:36px;margin:0 auto;width:max-content;background:${C.coral};color:${C.ink};font-weight:900;font-size:78px;line-height:1.02;letter-spacing:-.03em;padding:.16em .34em .2em;border-radius:.24em;z-index:5`, txt);
    E.K(el, "s", [[t, 1.7], [t + .16, 1, "back"]]); E.K(el, "r", [[t, -12], [t + .18, -4, "out"]]); E.K(el, "o", [[t, 0], [t + .05, 1], [tOut, 1], [tOut + .1, 0, "in"]]);
    E.S(t + .1, "thud", .9); E.shake(t + .1, 9, .22);
    const dw = DW; E.K(dw, "y", [[t - .02, 0], [t + .08, 30, "in"], [t + .22, 0, "out"]]);        // the wooden spoon comes down
  });
  E.F(t => { groups.forEach((g, i) => { g.style.display = t >= T[i] && t < T[i + 1] ? "block" : "none"; }); });

  E.finish(DUR);
  zoom.sort((a, b) => a[0] - b[0]); E.K(stage, "s", zoom);
  E.K(E.logo, "s", [[14.0, 1], [14.25, 1.18, "out"], [14.6, 1, "io"]]);
}
