// EP.17 "The family group chat" — grandma adds Otto to "FAMÍLIA". 214 messages: good-morning cards, a prayer chain, a blurry
// photo of soup, an uncle's rant, an 8-minute voice note. He taps "Leave group"… bliss. Then grandma calls in tears ("Why did
// you leave the FAMILY?!") and six relatives re-add him at once. Universal joke. A generic chat screen (no real app's branding).
export const meta = {
  id: "ep17-groupchat", date: "2026-10-10",
  images: {
    o_sleepy: "characters/cutouts/otto-phone_sleepy.webp", o_shocked: "characters/cutouts/otto-phone_shocked.webp",
    o_panic: "characters/cutouts/otto-phone_panic.webp", o_relief: "characters/cutouts/otto-phone_relief.webp",
    d_cry: "characters/cutouts/dona_phone-cry.webp", avatar: "characters/scenes/call_portrait.webp",
    soup: "characters/props/food_soup.webp", hen: "characters/props/hen.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 112, root: 55, seed: 171, prog: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]] });
  const DUR = 14.4;
  const S = E.scene("room", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FLOOD = .9, LEAVE = 5.2, LEFT = 5.9, CALL = 7.2, CRY = 7.9, READD = 9.6, END = 11.6;

  E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;background:linear-gradient(180deg,#e7ddf3,#d6c7ea)");
  E.el(S.el, "abs", "left:0;top:1680px;width:1080px;height:240px;background:#9d86b8");

  // ---------------- Otto ----------------
  const OS = 1.05, OW = 424 * OS, OH = 1068 * OS;
  const ottoW = E.el(S.el, "abs", `left:-10px;top:${1690 - OH}px;width:${OW}px;height:${OH}px;z-index:2`);
  const ottoI = E.el(ottoW, "abs", "inset:0;transform-origin:50% 100%");
  const OT = ["o_sleepy", "o_shocked", "o_panic", "o_relief"];
  const oim = OT.map(n => E.img(ottoI, n, `position:absolute;left:0;top:0;width:${OW}px;height:${OH}px`));
  E.F(t => {
    const f = at([[0, "o_sleepy"], [1.9, "o_shocked"], [3.6, "o_panic"], [LEFT, "o_relief"], [CALL, "o_panic"], [READD + 1.2, "o_shocked"]], t);
    oim.forEach((im, i) => { im.style.opacity = OT[i] === f ? 1 : 0; });
    let r = Math.sin(t * 1.6) * 1.2, y = 0;
    if (t >= 3.6 && t < LEAVE) r = Math.sin(t * 50) * 1.6;
    if (t >= LEFT && t < CALL) { y = -Math.abs(Math.sin((t - LEFT) * 2.4)) * 10; r = Math.sin(t * 2) * 3; }   // floating in bliss
    if (t >= CALL && t < READD + 1.2) r = Math.sin(t * 70) * 2;
    ottoI.style.transform = `translateY(${y}px) rotate(${r}deg)`;
  });
  // bliss sparkles
  for (let i = 0; i < 5; i++) {
    const sp = E.el(S.el, "abs", `left:${60 + i * 70}px;top:${760 + (i % 2) * 60}px;width:26px;height:26px;background:#ffd23f;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);z-index:3;opacity:0`);
    E.K(sp, "o", [[LEFT + i * .15, 0], [LEFT + .2 + i * .15, 1], [CALL - .2, 1], [CALL, 0]]);
    E.K(sp, "s", [[LEFT, .5], [LEFT + .6, 1.3, "io"], [CALL, .8, "io"]]);
  }

  // ---------------- the phone ----------------
  const PX = 400, PY = 430, PW = 640, PH = 1100;
  const phone = E.el(S.el, "abs", `left:${PX}px;top:${PY}px;width:${PW}px;height:${PH}px;border-radius:54px;background:#161616;box-shadow:0 24px 60px rgba(0,0,0,.3);z-index:3`);
  E.K(phone, "y", [[0, 26], [.45, 0, "out"]]);
  const scr = E.el(phone, "abs", `left:18px;top:18px;width:${PW - 36}px;height:${PH - 36}px;border-radius:40px;overflow:hidden;background:#efe6da`);
  const head = E.el(scr, "abs", "left:0;top:0;width:100%;height:150px;background:#2f6f63;display:flex;align-items:center;gap:18px;padding:34px 24px 0;z-index:3");
  const gav = E.el(head, "", "width:84px;height:84px;border-radius:50%;background:#ff9ec4;display:flex;align-items:center;justify-content:center;flex:none");
  gav.innerHTML = `<svg viewBox="0 0 32 30" width="46" height="44"><path d="M16 29 C6 21 0 15 0 8.5 C0 3.8 3.6 0 8.2 0 C11.2 0 14 1.8 16 4.6 C18 1.8 20.8 0 23.8 0 C28.4 0 32 3.8 32 8.5 C32 15 26 21 16 29Z" fill="#d9304f"/></svg>`;
  const nameCol = E.el(head, "", "display:flex;flex-direction:column;color:#fff");
  E.el(nameCol, "", "font-weight:900;font-size:44px;line-height:1", "FAMÍLIA");
  const members = E.el(nameCol, "", "font-weight:700;font-size:28px;opacity:.85;margin-top:6px", "47 members");
  const badge = E.el(head, "", "margin-left:auto;background:#35d07f;color:#fff;font-weight:900;font-size:40px;min-width:70px;height:70px;border-radius:35px;display:flex;align-items:center;justify-content:center;padding:0 16px", "0");
  E.F(t => {
    const n = t < FLOOD ? 0 : t < LEAVE ? Math.min(214, Math.round(214 * Math.pow((t - FLOOD) / (LEAVE - .4 - FLOOD), 1.4))) : 214;
    const b = String(n); if (badge.textContent !== b) badge.textContent = b;
    badge.style.opacity = t >= LEFT && t < READD ? 0 : 1;
  });
  E.K(badge, "s", [[LEAVE - .5, 1.5], [LEAVE - .25, 1, "back"]]);

  const col = E.el(scr, "abs", "left:0;top:150px;width:100%;height:" + (PH - 36 - 150) + "px;overflow:hidden");
  const inner = E.el(col, "abs", "left:0;right:0;bottom:24px;display:flex;flex-direction:column;gap:16px;padding:0 20px");
  const msgs = [];
  const add = (t, html, css = "", side = "l") => {
    const row = E.el(inner, "", `display:flex;justify-content:${side === "sys" ? "center" : side === "l" ? "flex-start" : "flex-end"};max-height:0;opacity:0`);
    const b = side === "sys"
      ? E.el(row, "", `background:#e1f1ec;color:#35554d;border-radius:18px;padding:10px 18px;font-weight:800;font-size:32px;${css}`, html)
      : E.el(row, "", `background:#fff;border-radius:6px 26px 26px 26px;padding:12px 18px 14px;box-shadow:0 2px 4px rgba(0,0,0,.08);color:${C.ink};font-weight:800;font-size:36px;line-height:1.14;max-width:500px;${css}`, html);
    msgs.push({ row, t });
    return b;
  };
  const who = (n, c) => `<div style="font-size:28px;font-weight:900;color:${c};margin-bottom:4px">${n}</div>`;
  E.F(t => { for (const m of msgs) { const on = t >= m.t; m.row.style.maxHeight = on ? "900px" : "0"; m.row.style.opacity = on ? 1 : 0; } });
  add(.3, "Grandma added you", "", "sys");
  // the flood, one message every ~0.5 s so each can be read
  const F = [
    [FLOOD, who("Tia Rosa", "#c2185b") + "Bom dia família!!!"],
    [FLOOD + .5, who("Grandma", "#2f6f63") + `<div style="position:relative;width:380px;height:200px;border-radius:16px;background:linear-gradient(135deg,#fff1b8,#ffd36e);display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:58px;color:#8a1f4a">Bom dia!</div>`],
    [FLOOD + 1.0, who("Tio Zé", "#1565c0") + "SHARE THIS WITH 10 PEOPLE OR 7 YEARS BAD LUCK"],
    [FLOOD + 1.5, who("Grandma", "#2f6f63") + `<div style="width:380px;height:230px;border-radius:16px;overflow:hidden;background:#d9cbb5;position:relative"></div>`],
    [FLOOD + 2.0, who("Tio Zé", "#1565c0") + "And another thing about the GOVERNMENT, when I was young the bread was… <span style='color:#2f6f63'>read more</span>"],
    [FLOOD + 2.6, who("Grandma", "#2f6f63") + `<div style="display:flex;align-items:center;gap:14px"><div style="width:0;height:0;border-left:30px solid #2f6f63;border-top:19px solid transparent;border-bottom:19px solid transparent"></div><div style="display:flex;gap:4px;align-items:center">${Array.from({ length: 20 }, (_, i) => `<div style="width:6px;height:${10 + ((i * 37) % 36)}px;border-radius:3px;background:#2f6f63"></div>`).join("")}</div><div style="font-size:48px;font-weight:900;color:${C.coralD}">8:32</div></div>`],
    [FLOOD + 3.2, who("Primo Rui", "#6a1b9a") + "who is this new number?"],
    [FLOOD + 3.7, who("Tia Rosa", "#c2185b") + "Look at my hen!!!" + `<div style="width:200px;height:210px;margin-top:6px;position:relative"></div>`],
  ];
  const fb = F.map(([t, html]) => { const b = add(t, html); E.S(t, "pop", .55); return b; });
  // real pictures inside two of the bubbles: the blurry soup, and the hen
  const soupHolder = fb[3].lastChild;
  E.img(soupHolder, "soup", "position:absolute;left:70px;top:10px;width:240px;height:auto;filter:blur(5px);transform:rotate(-14deg)");   // a blurry, crooked photo
  const henHolder = fb[7].lastChild;
  E.img(henHolder, "hen", "position:absolute;left:0;top:0;width:200px;height:auto");
  // Otto leaves: the menu, the tap, the system message
  const menu = E.el(scr, "abs", "left:0;right:0;bottom:0;background:#fff;border-radius:34px 34px 0 0;padding:26px 30px 40px;display:flex;flex-direction:column;gap:18px;z-index:6;opacity:0;box-shadow:0 -10px 30px rgba(0,0,0,.2)");
  E.el(menu, "", "font-weight:800;font-size:36px;color:#555", "Mute notifications");
  const leaveBtn = E.el(menu, "", "font-weight:900;font-size:44px;color:#e5484d;padding:14px 0", "Leave group");
  E.K(menu, "o", [[LEAVE, 0], [LEAVE + .1, 1], [LEFT - .05, 1], [LEFT, 0]]);
  E.K(menu, "y", [[LEAVE, 300], [LEAVE + .25, 0, "out"]]);
  const tap = E.el(leaveBtn, "", "position:absolute;width:90px;height:90px;border-radius:50%;background:rgba(229,72,77,.35);margin:-70px 0 0 120px;opacity:0");
  E.K(tap, "o", [[LEAVE + .45, 0], [LEAVE + .5, 1], [LEAVE + .7, 0]]); E.K(tap, "s", [[LEAVE + .45, .4], [LEAVE + .7, 1.6]]);
  E.S(LEAVE, "swish", .6); E.S(LEAVE + .5, "tick", 1);
  add(LEFT, "You left", "", "sys");
  E.S(LEFT + .1, "sparkle", .9);
  E.F(t => { const m = t >= LEFT && t < READD ? "46 members" : "47 members"; if (members.textContent !== m) members.textContent = m; });

  // ---------------- grandma calls, crying ----------------
  const call = E.el(scr, "abs", "inset:0;background:linear-gradient(180deg,#1f4f47,#0f2b27);display:flex;flex-direction:column;align-items:center;padding-top:140px;gap:26px;z-index:7;opacity:0");
  const ring = E.el(call, "", "width:260px;height:260px;border-radius:50%;overflow:hidden;position:relative;background:#f4e4c1");
  E.img(ring, "avatar", "position:absolute;left:-123px;top:-200px;width:500px;height:auto");
  E.el(call, "", "color:#fff;font-weight:900;font-size:62px", "Grandma");
  E.el(call, "", "color:#fff;opacity:.8;font-weight:700;font-size:36px", "incoming call…");
  E.K(call, "o", [[CALL - .01, 0], [CALL, 1], [READD - .01, 1], [READD, 0]]);
  E.S(CALL, "buzz", 1); E.S(CALL + .7, "buzz", .8);
  const DS = .95, dona = E.el(S.el, "abs", `left:420px;top:${1690 - 1023 * DS}px;width:${602 * DS}px;height:${1023 * DS}px;z-index:4;opacity:0`);
  E.img(dona, "d_cry", `width:${602 * DS}px;height:${1023 * DS}px`);
  E.K(dona, "o", [[CRY - .01, 0], [CRY, 1], [READD - .01, 1], [READD, 0]]);
  E.K(dona, "x", [[CRY, 600], [CRY + .3, 0, "out"], [READD - .25, 0], [READD, 600, "in"]]);
  const sob = []; for (let t = CRY + .3; t < READD; t += .3) sob.push([t, 0, "io"], [t + .15, -12, "io"]);
  E.K(dona, "y", sob);
  E.S(CRY, "whoosh", .7); E.S(CRY + .35, "nope", .7);

  // ---------------- six relatives re-add him at once ----------------
  ["Tia Rosa", "Tio Zé", "Grandma", "Primo Rui", "Tia Rosa", "Grandma"].forEach((n, i) => {
    const t = READD + .2 + i * .3;
    add(t, `${n} added you`, "", "sys"); E.S(t, "pop", .6 + i * .05);
  });
  const again = add(END, who("Grandma", "#2f6f63") + `<div style="position:relative;width:380px;height:200px;border-radius:16px;background:linear-gradient(135deg,#ffd1dc,#ffb3c6);display:flex;align-items:center;justify-content:center;font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:58px;color:#8a1f4a">Bom dia!</div>`);
  E.S(END, "ding", .7);

  // ---------------- bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, big = false) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail === "l" ? "15%" : "85%"} 100%`);
    const box = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:22px 30px 26px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${big ? 72 : 58}px;line-height:1.04;letter-spacing:-.02em;color:${C.ink};text-align:center`, html);
    E.el(box, "abs", `${tail === "l" ? "left:70px" : "right:70px"};bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 });
    E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    E.S(t0 + .02, "pop", .6);
    return b;
  };
  bubble("Peace. At last.", 40, 470, 480, "l", LEFT + .3, CALL - .1);
  bubble("Why did you leave the FAMILY?!", 380, 440, 660, "r", CRY + .35, READD - .1, true);

  // ---------------- title + clock (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "The family *group chat*", { size: 62, lh: 1.04, instant: true, id: "hook", nowrap: true });
  const clock = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7`, "07:15");

  E.finish(DUR);
  E.K(E.logo, "s", [[13.5, 1], [13.75, 1.18, "out"], [14.1, 1, "io"]]);
}
