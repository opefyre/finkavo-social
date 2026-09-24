// EP.2 "The bank" — Otto tries to open a bank account. It must stand alone for a stranger who never saw Episode 1.
// Loop (proof of income <-> a bank account), a record-scratch freeze, a montage where every absurd requirement costs a fee (money drains
// EUR 100 -> 0), a tiny payoff (the card), and the twist: the ATM says INSUFFICIENT FUNDS and the balance is -5. One employee, Sr. Carimbo,
// at every counter. No series numbering, no "follow" line: strangers watch this. Exaggerated on purpose (the caption says so).
export const meta = {
  id: "ep2-bank", date: "2026-09-26",
  images: {
    o_smug: "characters/cutouts/otto_smug.webp", o_hopeful: "characters/cutouts/otto_hopeful.webp", o_worried: "characters/cutouts/otto_worried.webp",
    o_shocked: "characters/cutouts/otto_shocked.webp", o_angry: "characters/cutouts/otto_angry.webp", o_sleepy: "characters/cutouts/otto_sleepy.webp",
    o_side: "characters/cutouts/otto_side-eye.webp", o_defeated: "characters/cutouts/otto_defeated.webp", o_party: "characters/cutouts/otto_celebrating.webp",
    o_cry: "characters/cutouts/otto_cry-laugh.webp", o_panic: "characters/cutouts/otto_panic.webp",
    c_deadpan: "characters/cutouts/carimbo_deadpan.webp", c_smug: "characters/cutouts/carimbo_smug.webp", c_bored: "characters/cutouts/carimbo_bored-asleep.webp",
    c_angry: "characters/cutouts/carimbo_angry.webp", c_evil: "characters/cutouts/carimbo_evil-grin.webp", c_laughing: "characters/cutouts/carimbo_laughing.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 108, root: 50, seed: 33, prog: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]] });
  const DUR = 15.0;
  const S = E.scene("bank", 0, DUR, "light"); E.cur = S;
  const rnd = (() => { let s = 11; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  const stage = E.el(S.el, "abs", "inset:0;transform-origin:320px 1150px");
  const shots = [];
  const wallCss = tint => `left:0;top:548px;width:1080px;height:1012px;background-color:${tint};background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.07) 0 3px,transparent 3px 180px)`;
  const room = (tint) => {
    const P = E.el(stage, "abs", "inset:0;overflow:hidden;display:none");
    E.el(P, "abs", wallCss(tint));
    E.el(P, "abs", "left:0;top:532px;width:1080px;height:16px;background:#c9a24a");
    E.el(P, "abs", "left:0;top:1560px;width:1080px;height:360px;background:#b9ab8e");
    return P;
  };
  const counter = (clerkNames, faceList, tint) => {
    const P = room(tint);
    E.el(P, "abs", "left:410px;top:562px;width:520px;height:76px;border-radius:14px;background:#c9a24a;color:#12305a;font-weight:900;font-size:44px;letter-spacing:.2em;display:flex;align-items:center;justify-content:center", "BANCO");
    const win = E.el(P, "abs", "left:330px;top:642px;width:700px;height:548px;overflow:hidden;background:#dbe8ec;border:14px solid #8a6f2c;border-radius:22px 22px 0 0");
    const nod = E.el(win, "abs", "inset:0");
    const idle = E.el(nod, "abs", "inset:0");
    const faces = clerkNames.map(n => E.img(idle, n, "position:absolute;left:50%;transform:translateX(-50%);top:0;height:900px;width:auto"));
    E.el(P, "abs", "left:0;top:1190px;width:1080px;height:48px;background:#efeae0;border-radius:10px 10px 0 0");
    E.el(P, "abs", "left:0;top:1238px;width:1080px;height:322px;background-color:#d3cbbb;background-image:repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 4px,transparent 4px 140px)");
    const sh = { P, nod, idle, faces, names: clerkNames, faceList };
    shots.push(sh); return sh;
  };
  const b1 = counter(["c_deadpan", "c_smug", "c_evil", "c_bored", "c_angry", "c_laughing"],
    [[0, "c_deadpan"], [2.6, "c_smug"], [6.3, "c_evil"], [7.0, "c_bored"], [7.6, "c_angry"], [8.2, "c_laughing"], [9.0, "c_smug"]], "#1d4f4c");
  const b2 = counter(["c_deadpan", "c_smug", "c_laughing"], [[0, "c_deadpan"], [3.95, "c_smug"], [10.0, "c_deadpan"]], "#235c58");
  // the ATM shot: no clerk, a machine drawn in code (so its screen is real text, never AI text)
  const atmRoom = room("#163c3a");
  const atm = E.el(atmRoom, "abs", "left:520px;top:560px;width:460px;height:1000px;border-radius:26px 26px 0 0;background:linear-gradient(180deg,#dfe5e8,#b8c2c8);box-shadow:0 14px 34px rgba(0,0,0,.35)");
  const screen = E.el(atm, "abs", "left:40px;top:60px;width:380px;height:270px;border-radius:16px;background:#0b2a44;border:8px solid #3b4b5c;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-weight:900;font-size:46px;line-height:1.1;letter-spacing:-.01em;color:#7fe0c0;padding:0 16px", "INSERT CARD");
  for (let i = 0; i < 12; i++) E.el(atm, "abs", `left:${70 + (i % 3) * 110}px;top:${380 + Math.floor(i / 3) * 74}px;width:90px;height:56px;border-radius:12px;background:#8d99a0;box-shadow:0 4px 0 #6d787e`);
  E.el(atm, "abs", "left:100px;top:700px;width:260px;height:24px;border-radius:12px;background:#12202a");           // the card slot
  E.el(atm, "abs", "left:120px;top:800px;width:220px;height:60px;border-radius:10px;background:#12202a");
  const shotAt = t => (t < 3.7 ? b1 : t < 6.3 ? b2 : t < 9.8 ? b1 : t < 12.2 ? b2 : { P: atmRoom, faces: [], names: [], faceList: [], idle: null, nod: null });
  const cuts = [3.7, 6.3, 9.8, 12.2];
  const zoom = [[0, 1]];
  for (const t of cuts) { zoom.push([t - .01, 1], [t, 1.07], [t + .16, 1, "out"]); E.S(t - .02, "swish", .8); }
  zoom.push([4.99, 1], [5.0, 1], [5.12, 1.26, "out"], [6.15, 1.26], [6.29, 1, "io"]);
  zoom.push([12.94, 1], [13.05, 1.34, "out"], [DUR, 1.34]);                             // push in on the ATM screen for the punchline
  zoom.sort((a, b) => a[0] - b[0]);
  E.K(stage, "s", zoom);
  E.F(t => { stage.style.transformOrigin = t >= 12.6 ? "690px 760px" : "320px 1150px"; });
  const allRooms = [b1.P, b2.P, atmRoom];
  E.F(t => {
    const cur = shotAt(t);
    allRooms.forEach(P => { P.style.display = P === cur.P ? "block" : "none"; });
    for (const sh of shots) {
      const face = at(sh.faceList, t);
      sh.faces.forEach((f, i) => { f.style.opacity = sh.names[i] === face ? 1 : 0; });
      sh.idle.style.transform = `translateY(${Math.sin(t * 2.4) * 4}px)`;
    }
    screen.innerHTML = t >= 12.95 ? '<span style="color:#ff7d63">INSUFFICIENT FUNDS</span>' : t >= 12.85 ? "…" : "INSERT CARD";
  });
  const nod = (sh, t) => { E.K(sh.nod, "y", [[t, 0], [t + .09, 66, "in"], [t + .22, 0, "out"]]); E.K(sh.nod, "sy", [[t, 1], [t + .09, .94, "in"], [t + .22, 1, "out"]]); };

  // ---------------- Otto ----------------
  E.el(stage, "abs", "left:30px;top:1830px;width:540px;height:46px;border-radius:50%;background:rgba(0,0,0,.22);filter:blur(7px)");
  const OW = E.el(stage, "abs", "left:20px;top:900px;width:570px;height:860px");
  const OI = E.el(OW, "abs", "inset:0;transform-origin:50% 100%");
  const OTTO = ["o_smug", "o_hopeful", "o_worried", "o_shocked", "o_angry", "o_sleepy", "o_side", "o_defeated", "o_party", "o_cry", "o_panic"];
  const ofaces = OTTO.map(n => E.img(OI, n, "position:absolute;left:0;top:0;width:570px;height:860px;object-fit:contain"));
  const ottoFace = [[0, "o_smug"], [2.4, "o_hopeful"], [3.7, "o_worried"], [5.0, "o_shocked"], [6.3, "o_angry"], [7.3, "o_sleepy"], [8.2, "o_side"], [9.0, "o_defeated"],
    [10.0, "o_party"], [10.7, "o_cry"], [12.2, "o_hopeful"], [12.95, "o_panic"], [13.7, "o_defeated"]];
  E.K(OW, "x", [[0, -760], [.55, 0, "back"]]);
  E.S(.05, "whoosh", .8); E.S(.5, "thud", .7);
  E.F(t => {
    const f = at(ottoFace, t);
    ofaces.forEach((im, i) => { im.style.opacity = OTTO[i] === f ? 1 : 0; });
    let y = Math.sin(t * 3.4) * 4, sy = 1 + Math.sin(t * 3.4) * .006, r = 0;
    if (t >= 5.0 && t < 6.3) r += Math.sin(t * 70) * 1.6;
    if (t >= 6.3 && t < 7.2) r += Math.sin(t * 40) * 1.0;
    if (t >= 12.95 && t < 13.6) r += Math.sin(t * 64) * 1.8;
    if (t >= 13.7) { const k = Math.min(1, (t - 13.7) / .5); y += k * 26; sy *= 1 - k * .05; r -= k * 2; }
    OI.style.transform = `translateY(${y}px) rotate(${r}deg) scaleY(${sy})`;
  });

  // the bank card: handed over at the counter, then eaten by the ATM
  const card = E.el(stage, "abs", "left:0;top:0;width:330px;height:204px;border-radius:20px;background:linear-gradient(135deg,#0f2f33,#1d4f4c);border:3px solid #c9a24a;box-shadow:0 12px 26px rgba(0,0,0,.35);opacity:0");
  E.el(card, "abs", "left:26px;top:38px;width:62px;height:46px;border-radius:8px;background:#c9a24a");
  E.el(card, "abs", "left:26px;top:132px;font-weight:900;font-size:30px;letter-spacing:.16em;color:#c9a24a", "BANCO");
  E.K(card, "x", [[10.05, 640], [10.65, 300, "out"], [12.3, 300], [12.9, 690, "io"]]);
  E.K(card, "y", [[10.05, 1090], [10.65, 1230, "out"], [12.3, 1230], [12.9, 1060, "io"]]);
  E.K(card, "r", [[10.05, 12], [10.65, -5, "out"]]);
  E.K(card, "o", [[10.05, 0], [10.12, 1], [12.88, 1], [12.93, 0]]);
  E.S(10.05, "swish"); E.S(10.68, "pop", .9); E.S(10.75, "ding"); E.S(10.8, "sparkle", .7);
  E.S(12.6, "swish", .8); E.S(12.92, "slam", .9);

  // ---------------- words ----------------
  const TOP = "left:100px;top:250px;width:780px;display:flex;flex-direction:column;gap:20px";
  const hookBox = E.el(S.el, "abs", "left:100px;top:262px;width:800px");
  const hook = E.text(hookBox, "Bank? *$Easy.*", { size: 118, lh: 1.02, instant: true, id: "hook", nowrap: true });
  E.until(hook, 2.3);
  const attempt = (n, t0, t1) => {
    const b = E.el(S.el, "abs", "left:100px;top:262px;width:780px");
    E.el(b, "tx", `font-size:112px;line-height:1;font-weight:900;letter-spacing:-.03em;color:${C.ink}`, `ATTEMPT <span style="display:inline-block;background:${C.amber};padding:0 .2em .04em;border-radius:.22em">${n}</span>`);
    E.K(b, "o", [[t0, 0], [t0 + .07, 1], [t1 - .1, 1], [t1, 0, "in"]]); E.K(b, "s", [[t0, .85], [t0 + .25, 1, "back"]]);
    E.S(t0 + .03, "pop", .8);
  };
  attempt(1, 2.4, 3.7); attempt(2, 3.75, 5.0);
  const waitBox = E.el(S.el, "abs", TOP);
  const wait = E.text(waitBox, "*!…wait.*", { size: 110, t: 5.1, id: "wait", stagger: .1 });
  E.until(wait, 6.3);

  // the money counter: every requirement costs a fee. 100 -> 0 in the montage, 0 after the account opens, -5 after the ATM.
  const moneyBox = E.el(S.el, "abs", TOP);
  const money = E.el(moneyBox, "tx", `font-size:150px;line-height:1;font-weight:900;letter-spacing:-.04em;color:${C.ink}`, "€100");
  E.K(moneyBox, "o", [[6.25, 0], [6.33, 1], [DUR, 1]]);
  E.count(money, 6.4, 9.7, 100, 0, { ease: "lin", fmt: v => "€" + v, ticks: 22 });
  E.F(t => { if (t >= 12.95) money.textContent = "-€5"; money.style.color = t >= 12.95 ? C.coral : t > 8.4 ? C.coralD : C.ink; });

  const stampBox = () => E.el(S.el, "abs", "left:70px;top:1250px;width:940px;display:flex;justify-content:center");
  const slam = (str, t, tOut, o = {}) => {
    const { size = 78, rot = (rnd() * 14 - 7), big = false } = o;
    const box = stampBox();
    const el = big ? E.stamp(box, str, t, { size, rot, shake: 20 })
      : (() => { const e = E.el(box, "", `display:inline-block;background:${C.coral};color:${C.ink};font-weight:900;font-size:${size}px;line-height:1.02;letter-spacing:-.03em;padding:.16em .3em .2em;border-radius:.24em;text-align:center`, str);
        E.K(e, "s", [[t, 1.6], [t + .16, 1, "back"]]); E.K(e, "r", [[t, rot - 10], [t + .18, rot, "out"]]); E.K(e, "o", [[t, 0], [t + .05, 1]]);
        E.S(t + .1, "thud", .8); E.shake(t + .1, 9, .2); return e; })();
    E.until(el, tOut, .12); return el;
  };
  nod(b1, 2.62); slam("NEED: PROOF OF INCOME", 2.7, 3.7, { size: 70, big: true });
  nod(b2, 3.92); slam("NEED: A BANK ACCOUNT", 4.0, 5.0, { size: 72, big: true });
  E.S(5.0, "scratch");
  const M = [["SIGNATURE (IN BLUE)", 6.4], ["PROOF YOU EXIST", 6.95], ["PHOTO WITH THE PEN", 7.5], ["STAMP FOR THE STAMP", 8.05], ["SELFIE WITH THE MANAGER", 8.6], ["FEE: FOR ASKING", 9.15]];
  M.forEach(([s, t], i) => { const nx = i + 1 < M.length ? M[i + 1][1] : 9.8; nod(b1, t - .08); slam(s, t, nx, { size: 64 }); });
  nod(b2, 9.92);
  E.S(12.95, "nope"); E.flash(12.95, "#ff7d63", .35, .25); E.shake(12.95, 14, .3);

  E.finish(DUR);
  E.K(E.logo, "s", [[13.6, 1], [13.85, 1.18, "out"], [14.2, 1, "io"]]);
}
