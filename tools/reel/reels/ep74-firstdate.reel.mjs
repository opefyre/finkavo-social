// EP.74 "A first date in Portugal" — English-first. Zoe on a candlelit first date with Tiago. "So… where do you live?" "Um… Graça?"
// "No way! My aunt lives in Graça!" The waiter: "Tiago! How is your mother?" A man at the next table, in Portuguese: "Tiago! O meu
// afilhado!" (My godson!) Zoe, whispering: "…That's my landlord." Heads pop up all over the restaurant — cousin, dentist, old teacher,
// godmothers — PEOPLE WHO KNOW TIAGO: 27. "Does everyone know you?" "It's Portugal." That night her phone buzzes: Tiago's mum.
// "Boa noite, nora! ❤️" (Good night, daughter-in-law!) "When is the wedding? 💍" Zoe: "…It was ONE date."
export const meta = {
  id: "ep74-firstdate", date: "2026-12-06",
  images: {
    zo: "characters/cutouts/zoe_date.webp", ti: "characters/cutouts/tiago_date.webp", bar: "characters/cutouts/barman_smile.webp", ren: "characters/cutouts/renda_default.webp",
    pr: "characters/cutouts/priest_bless.webp", lady: "characters/cutouts/lady_ask.webp", old: "characters/cutouts/oldman_ask.webp", gos: "characters/cutouts/gossip_ladies.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 92, root: 53, seed: 741, prog: [[0, 4, 7, 11], [5, 9, 12, 16], [2, 5, 9, 12], [7, 11, 14, 17]] });
  const DUR = 21.0, FLOOR = 1790, TABLE = 1330, Q = .4, GR = 2.3, AUNT = 4.0, BAR = 6.75, LAND = 9.2, ZL = 11.55, MONT = 12.8,
    EV = 14.5, PT = 15.85, HOME = 16.9, M1 = 17.2, M2 = 17.95, ONE = 18.65;
  const S = E.scene("date", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };

  // ================= the restaurant =================
  const R = E.el(S.el, "abs", "inset:0;overflow:hidden");
  E.el(R, "abs", "inset:0;background:#f1dcc0");
  E.el(R, "abs", "left:0;top:880px;width:1080px;height:1040px;background:#7a2e2a");
  E.el(R, "abs", "left:0;top:870px;width:1080px;height:20px;background:#5a1f1c");
  for (let i = 0; i < 6; i++) E.el(R, "abs", `left:${i * 180 + 20}px;top:960px;width:140px;height:600px;border:5px solid #8f3a35;border-radius:8px;box-sizing:border-box`);
  // string lights
  for (let i = 0; i < 12; i++) E.el(R, "abs", `left:${30 + i * 88}px;top:${430 + Math.sin(i * .9) * 26 + (i % 2) * 18}px;width:22px;height:22px;border-radius:50%;background:#ffd98a;box-shadow:0 0 22px 8px rgba(255,210,120,.55);opacity:${.8 + (i % 3) * .07}`);
  E.el(R, "abs", "left:0;top:420px;width:1080px;height:40px;border-bottom:3px solid #5a4636;border-radius:0 0 50% 50%");
  // the table in front, a candle that flickers
  const tbl = E.el(R, "abs", `left:150px;top:${TABLE}px;width:780px;height:${FLOOR - TABLE + 40}px;z-index:6`);
  E.el(tbl, "abs", "left:0;top:0;width:100%;height:230px;background-color:#fff;background-image:linear-gradient(45deg,rgba(214,48,49,.85) 25%,transparent 25%,transparent 75%,rgba(214,48,49,.85) 75%),linear-gradient(45deg,rgba(214,48,49,.85) 25%,transparent 25%,transparent 75%,rgba(214,48,49,.85) 75%);background-size:60px 60px;background-position:0 0,30px 30px;border-radius:10px;box-shadow:0 12px 20px rgba(0,0,0,.3)");
  E.el(tbl, "abs", "left:60px;top:230px;width:30px;height:300px;background:#4a2a18"); E.el(tbl, "abs", "left:690px;top:230px;width:30px;height:300px;background:#4a2a18");
  E.el(R, "abs", `left:520px;top:${TABLE - 150}px;width:40px;height:150px;background:#fffaf0;border-radius:6px;z-index:7`);
  const flame = E.el(R, "abs", `left:524px;top:${TABLE - 210}px;width:32px;height:56px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:radial-gradient(circle at 50% 70%,#fff3b0,#ffb52e 60%,#ff7a1a);box-shadow:0 0 40px 16px rgba(255,190,80,.5);z-index:7;transform-origin:50% 100%`);
  const fk = []; for (let t = 0; t < DUR; t += .25) fk.push([t, 1 + ((Math.round(t * 4) % 3) - 1) * .08]); E.K(flame, "sy", fk);   // frame-0 motion
  for (const x of [330, 700]) { E.el(R, "abs", `left:${x}px;top:${TABLE - 110}px;width:56px;height:70px;border-radius:0 0 28px 28px;background:rgba(150,20,40,.85);border:4px solid rgba(255,255,255,.7);border-top:none;z-index:7`); E.el(R, "abs", `left:${x + 25}px;top:${TABLE - 40}px;width:6px;height:40px;background:rgba(255,255,255,.8);z-index:7`); }

  const fig = (P, n, w, h, s, left, bottom, z) => { const el = E.el(P, "abs", `left:${left}px;top:${bottom - h * s}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };
  // the back row: heads that pop up over the partition during the montage
  const HEADS = [["gos", 750, 755, .5, -10, "GODMOTHERS"], ["old", 480, 1037, .48, 290, "OLD TEACHER"], ["lady", 546, 1031, .47, 530, "DENTIST"], ["pr", 412, 1028, .5, 820, "PRIEST"]];
  const HT = [MONT, MONT + .45, MONT + .9, MONT + 1.35];
  const backRow = E.el(R, "abs", "left:0;top:0;width:1080px;height:1180px;overflow:hidden;z-index:1");
  HEADS.forEach(([n, w, h, s, x, lab], i) => {
    const hd = fig(backRow, n, w, h, s, x, 1180, 1);
    E.K(hd, "y", [[HT[i], 650], [HT[i] + .25, 0, "back"], [EV - .2, 0], [EV + .15, 650, "in"]]);
    const tag = E.el(R, "abs", `left:${Math.max(10, Math.min(870, x + (w * s) / 2 - 100))}px;top:${1180 - h * s - 52}px;width:200px;text-align:center;font-weight:900;font-size:28px;color:#fff;background:${C.coralD};border-radius:12px;padding:4px 0;z-index:2;opacity:0`, lab);
    E.K(tag, "o", [[HT[i] + .15, 0], [HT[i] + .25, 1], [EV - .2, 1], [EV - .1, 0]]);
  });
  E.el(R, "abs", "left:0;top:1180px;width:1080px;height:40px;background:#5a1f1c;z-index:1");
  // Zoe (left, faces right) and Tiago (right, faces left)
  const zo = fig(R, "zo", 509, 1113, .8, 10, FLOOR, 3);
  const ti = fig(R, "ti", 613, 1127, .8, 580, FLOOR, 3);
  const zb = []; for (let t = 0; t < DUR; t += .9) zb.push([t, 0, "io"], [t + .45, -5, "io"]); E.K(zo, "y", zb);
  E.K(zo, "x", [[ZL - .2, 0], [ZL, 30, "out"], [ZL + 1.2, 30], [ZL + 1.4, 0, "io"]]);
  E.K(ti, "r", [[PT - .1, 0], [PT + .1, -3, "out"], [PT + .5, 0, "io"]]);
  // the waiter leans in between them, then the landlord from the next table
  const front = E.el(R, "abs", `left:0;top:0;width:1080px;height:${TABLE + 20}px;overflow:hidden;z-index:2`);
  const bar = fig(front, "bar", 856, 993, .5, 325, TABLE + 10, 2);
  E.K(bar, "y", [[BAR - .3, 520], [BAR, 0, "back"], [LAND - .35, 0], [LAND - .1, 520, "in"]]);
  const ren = fig(front, "ren", 1168, 1802, .4, 310, TABLE + 60, 2);
  E.K(ren, "y", [[LAND - .2, 760], [LAND + .1, 0, "back"], [MONT - .4, 0], [MONT - .1, 760, "in"]]);

  const pill = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:12`, "");
  const P = [[0, "FIRST DATE · 20:00"], [AUNT, "PEOPLE WHO KNOW TIAGO: 1"], [BAR, "PEOPLE WHO KNOW TIAGO: 2"], [LAND, "PEOPLE WHO KNOW TIAGO: 3"],
    [HT[0], "PEOPLE WHO KNOW TIAGO: 5"], [HT[1], "PEOPLE WHO KNOW TIAGO: 9"], [HT[2], "PEOPLE WHO KNOW TIAGO: 14"], [HT[3], "PEOPLE WHO KNOW TIAGO: 27"], [HOME, "23:47 · ZOE'S PHONE"]];
  E.F(t => { const s = at(P, t); if (pill.textContent !== s) pill.textContent = s; pill.style.background = t >= HT[3] && t < HOME ? C.coralD : C.ink; });
  P.slice(1).forEach(([t]) => E.K(pill, "s", [[t - .01, 1], [t, 1.15], [t + .2, 1, "out"]]));

  // ================= that night: the phone =================
  const N = E.el(S.el, "abs", "inset:0;background:#141a2e;z-index:10;opacity:0");
  E.K(N, "o", [[HOME - .01, 0], [HOME, 1]]);
  for (let i = 0; i < 30; i++) E.el(N, "abs", `left:${(i * 137) % 1060}px;top:${(i * 263) % 1900}px;width:4px;height:4px;border-radius:50%;background:rgba(255,255,255,.35)`);
  const ph = E.el(N, "abs", "left:190px;top:470px;width:700px;height:1260px;border-radius:70px;background:#0c0f18;padding:26px;box-sizing:border-box;box-shadow:0 30px 60px rgba(0,0,0,.5)");
  const sc = E.el(ph, "", "position:relative;width:100%;height:100%;border-radius:48px;background:#efe7dc;overflow:hidden");
  const hdr = E.el(sc, "abs", "left:0;top:0;width:100%;height:150px;background:#1f6b5c;display:flex;align-items:center;gap:20px;padding:40px 30px 0;box-sizing:border-box;color:#fff");
  E.el(hdr, "", "width:80px;height:80px;border-radius:50%;background:#f3c9a0;display:flex;align-items:center;justify-content:center;font-size:44px", "💐");
  const hn = E.el(hdr, "", "font-weight:900;font-size:38px;line-height:1.1", "Tiago's Mum");
  E.el(hn, "", "font-weight:700;font-size:24px;opacity:.8", "online");
  const msg = (html, top, t0) => { const m = E.el(sc, "abs", `left:30px;top:${top}px;max-width:560px;background:#fff;border-radius:0 26px 26px 26px;padding:18px 24px;font-weight:800;font-size:42px;line-height:1.15;color:#1d2b36;box-shadow:0 4px 10px rgba(0,0,0,.12);opacity:0`, html); E.pop(m, t0, { from: .4, dur: .3 }); E.K(m, "o", [[t0, 0], [t0 + .08, 1]]); return m; };
  msg(`Boa noite, nora! ❤️<div style="font-size:26px;font-weight:700;color:#7a8791;margin-top:6px">(Good night, daughter-in-law!)</div>`, 200, M1);
  msg("When is the wedding? 💍", 400, M2);
  const typing = E.el(sc, "abs", "left:30px;top:540px;background:#fff;border-radius:26px;padding:14px 26px;font-size:44px;color:#9aa4ad;opacity:0", "•••");
  E.K(typing, "o", [[M2 + .6, 0], [M2 + .7, 1]]); E.F(t => { typing.style.letterSpacing = `${(Math.floor(t * 4) % 3) * 4}px`; });

  // ================= bubbles, stamp =================
  const bubble = (html, left, top, w, tail, t0, t1, fs = 48) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:13;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:30px;padding:16px 24px 20px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  const sub = en => `<div style="font-size:28px;font-weight:800;color:#7a8791;margin-top:4px">${en}</div>`;
  bubble("So… where do you live?", 520, 700, 500, 300, Q, GR - .05, 48);
  bubble("Um… Graça?", 60, 740, 340, 120, GR, AUNT - .05, 52);
  bubble("No way! My aunt lives in Graça!", 440, 680, 600, 360, AUNT, BAR - .05, 48);
  bubble("Tiago! How is your mother?", 250, 600, 560, 280, BAR + .05, LAND - .3, 48);
  bubble(`Tiago! O meu afilhado!${sub("(Tiago! My godson!)")}`, 320, 470, 560, 200, LAND + .1, ZL - .05, 48);
  bubble("…That's my landlord.", 40, 700, 440, 130, ZL, MONT - .05, 46);
  bubble("Does everyone know you?", 40, 700, 460, 130, EV, PT - .05, 46);
  bubble("It's Portugal.", 600, 740, 380, 200, PT, HOME - .05, 52);
  bubble("…It was ONE date.", 190, 1560, 700, 350, ONE, DUR - .4, 56);
  const sb = E.el(S.el, "abs", "left:60px;top:1180px;width:960px;display:flex;justify-content:center;z-index:14");
  const st = E.stamp(sb, "PORTUGAL IS SMALL.", ONE + 1.3, { size: 96, rot: -6, bg: C.coralD, shake: 10 }); st.style.alignSelf = "center"; E.until(st, DUR, .1);

  // ================= sound =================
  E.clip(0, "sfx/restaurant.wav", { vol: .5, duck: false, to: HOME });
  E.clip(.1, "sfx/glass-clink.wav", { vol: .5 });
  E.clip(Q, "voices/ep74/ti_where.wav", { vol: 1.2 });
  E.clip(GR, "voices/ep74/z_graca.wav", { vol: 1.2 });
  E.clip(AUNT, "voices/ep74/ti_aunt.wav", { vol: 1.2 }); E.S(AUNT + .1, "ding", .4);
  E.S(BAR - .25, "whoosh", .5); E.clip(BAR + .05, "voices/ep74/b_mother.wav", { vol: 1.2 });
  E.S(LAND - .15, "whoosh", .5); E.clip(LAND + .1, "voices/ep74/l_afilhado.wav", { vol: 1.3 });
  E.clip(ZL, "voices/ep74/z_landlord.wav", { vol: 1.35 }); E.S(ZL, "scratch", .4);
  HT.forEach((t, i) => E.S(t, "pop", .5 + i * .08)); E.clip(MONT, "sfx/crowd-murmur.wav", { vol: .6, to: 1.8, duck: false });
  E.clip(EV, "voices/ep74/z_everyone.wav", { vol: 1.35 });
  E.clip(PT, "voices/ep74/ti_portugal.wav", { vol: 1.2 });
  E.S(HOME, "whoosh", .4); E.clip(M1, "sfx/phone-ping.wav", { vol: .9 }); E.clip(M2, "sfx/phone-ping.wav", { vol: .9 });
  E.clip(ONE, "voices/ep74/z_one.wav", { vol: 1.3 });

  // ---------------- title (frame 0) ----------------
  E.el(S.el, "abs", "left:78px;top:236px;width:830px;height:96px;border-radius:22px;background:rgba(255,250,242,.96);box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:12");
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:12");
  E.text(titleBox, "A first date in *Portugal*", { size: 56, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[20.2, 1], [20.45, 1.18, "out"], [20.8, 1, "io"]]);
}
