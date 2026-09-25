// EP.11 "Texting grandma" — 06:02: a flood of flowery "Bom dia" cards (47 new), a 12:48 voice note, a forwarded "share with
// 10 people" warning. Otto answers "ok". Typing… "Why are you angry with me?" — and then she calls. Universal joke; the
// "Bom dia" cards are the Portuguese touch. A generic chat screen (no real app's branding). Stands alone for strangers.
export const meta = {
  id: "ep11-texting", date: "2026-10-04",
  images: {
    o_sleepy: "characters/cutouts/otto-phone_sleepy.webp", o_shocked: "characters/cutouts/otto-phone_shocked.webp",
    o_panic: "characters/cutouts/otto-phone_panic.webp", avatar: "characters/scenes/call_portrait.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 120, root: 55, seed: 111, prog: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]] });
  const DUR = 10.6;
  const S = E.scene("room", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const VOICE = 2.9, FWD = 4.2, OK = 5.5, TYPING = 6.1, ANGRY = 6.7, CALL = 7.9;

  // ---------------- bedroom, early morning ----------------
  E.el(S.el, "abs", "left:0;top:0;width:1080px;height:1920px;background:linear-gradient(180deg,#f7dcc0,#efc9a8)");
  E.el(S.el, "abs", "left:0;top:1680px;width:1080px;height:240px;background:#b98a63");

  // ---------------- Otto (left) ----------------
  const OS = 1.05, OW = 424 * OS, OH = 1068 * OS;
  const ottoW = E.el(S.el, "abs", `left:-10px;top:${1690 - OH}px;width:${OW}px;height:${OH}px;z-index:2`);
  const ottoI = E.el(ottoW, "abs", "inset:0;transform-origin:50% 100%");
  const OT = ["o_sleepy", "o_shocked", "o_panic"];
  const oimg = OT.map(n => E.img(ottoI, n, `position:absolute;left:0;top:0;width:${OW}px;height:${OH}px`));
  const ottoAt = [[0, "o_sleepy"], [VOICE, "o_shocked"], [OK, "o_sleepy"], [ANGRY, "o_panic"]];
  E.F(t => {
    const f = at(ottoAt, t);
    oimg.forEach((im, i) => { im.style.opacity = OT[i] === f ? 1 : 0; });
    let r = Math.sin(t * 1.6) * 1.2, y = 0;
    if (t >= CALL) r = Math.sin(t * 80) * 2.4;
    if (t >= VOICE && t < VOICE + .3) y = -20 * Math.sin((t - VOICE) / .3 * Math.PI);
    ottoI.style.transform = `translateY(${y}px) rotate(${r}deg)`;
  });

  // ---------------- the phone screen (right) ----------------
  const PX = 400, PY = 430, PW = 640, PH = 1100;
  const phone = E.el(S.el, "abs", `left:${PX}px;top:${PY}px;width:${PW}px;height:${PH}px;border-radius:54px;background:#161616;padding:18px;box-shadow:0 24px 60px rgba(0,0,0,.3);z-index:3`);
  const scr = E.el(phone, "abs", `left:18px;top:18px;width:${PW - 36}px;height:${PH - 36}px;border-radius:40px;overflow:hidden;background:#efe6da`);
  E.K(phone, "y", [[0, 26], [.45, 0, "out"]]);                                                        // frame-0 motion
  // header
  const head = E.el(scr, "abs", "left:0;top:0;width:100%;height:150px;background:#2f6f63;display:flex;align-items:center;gap:20px;padding:34px 26px 0;z-index:3");
  const av = E.el(head, "", "width:88px;height:88px;border-radius:50%;overflow:hidden;position:relative;background:#f4e4c1;flex:none");
  E.img(av, "avatar", "position:absolute;left:-42px;top:-70px;width:170px;height:auto");
  const nameCol = E.el(head, "", "display:flex;flex-direction:column;color:#fff");
  E.el(nameCol, "", "font-weight:900;font-size:44px;line-height:1", "Grandma");
  const status = E.el(nameCol, "", "font-weight:700;font-size:30px;opacity:.85;margin-top:6px", "online");
  const badge = E.el(head, "", "margin-left:auto;background:#35d07f;color:#fff;font-weight:900;font-size:40px;min-width:70px;height:70px;border-radius:35px;display:flex;align-items:center;justify-content:center;padding:0 16px", "1");
  E.F(t => {
    const st = t >= TYPING && t < ANGRY ? "typing…" : "online"; if (status.textContent !== st) status.textContent = st;
    const n = t < .3 ? 1 : t < 2.7 ? Math.min(47, Math.round(1 + 46 * Math.pow((t - .3) / 2.4, 1.6))) : 47;
    const b = String(n); if (badge.textContent !== b) badge.textContent = b;
  });
  E.K(badge, "s", [[2.7, 1.5], [2.95, 1, "back"]]);
  // the chat column: messages stack from the bottom and push the older ones up
  const col = E.el(scr, "abs", "left:0;top:150px;width:100%;height:" + (PH - 36 - 150) + "px;overflow:hidden");
  const inner = E.el(col, "abs", "left:0;right:0;bottom:24px;display:flex;flex-direction:column;gap:18px;padding:0 22px");
  const msgs = [];
  const msg = (t, html, side = "l", css = "") => {
    const row = E.el(inner, "", `display:flex;justify-content:${side === "l" ? "flex-start" : "flex-end"};max-height:0;opacity:0;overflow:visible`);
    const b = E.el(row, "", `background:${side === "l" ? "#fff" : "#c9f2df"};border-radius:${side === "l" ? "6px 26px 26px 26px" : "26px 6px 26px 26px"};padding:14px 18px;box-shadow:0 2px 4px rgba(0,0,0,.08);color:${C.ink};font-weight:800;font-size:38px;line-height:1.12;${css}`, html);
    msgs.push({ row, b, t });
    return b;
  };
  E.F(t => { for (const m of msgs) { const on = t >= m.t; m.row.style.maxHeight = on ? "900px" : "0"; m.row.style.opacity = on ? 1 : 0; } });
  const cardCss = ["#ffd1dc,#ffb3c6", "#fff1b8,#ffd36e", "#d6f5d6,#9fe0b0", "#d9e8ff,#a9c8ff", "#f0d9ff,#d3a9ff", "#ffe0c2,#ffb98a"];
  const flower = (x, y, c) => `<div style="position:absolute;left:${x}px;top:${y}px;width:54px;height:54px;border-radius:50%;background:${c};box-shadow:0 0 0 10px ${c}55"></div><div style="position:absolute;left:${x + 18}px;top:${y + 18}px;width:18px;height:18px;border-radius:50%;background:#ffd23f"></div>`;
  const card = (t, i) => msg(t, `<div style="position:relative;width:380px;height:240px;border-radius:16px;background:linear-gradient(135deg,${cardCss[i % 6]});overflow:hidden">${flower(30, 30, "#e0457b")}${flower(290, 150, "#ff7aa8")}${flower(250, 20, "#c83b6b")}<div style="position:absolute;left:0;right:0;top:78px;text-align:center;font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:64px;color:#8a1f4a;text-shadow:0 2px 0 #fff">Bom dia!</div></div>`, "l", "padding:8px");
  [0, .45, .85, 1.2, 1.5, 1.75, 1.95, 2.12, 2.27, 2.4, 2.52, 2.62].forEach((t, i) => { card(t, i); E.S(t, "pop", .5 + (i % 3) * .1); });
  // the voice note
  const wave = Array.from({ length: 26 }, (_, i) => `<div style="width:7px;height:${12 + ((i * 37) % 44)}px;border-radius:4px;background:#2f6f63"></div>`).join("");
  msg(VOICE, `<div style="display:flex;align-items:center;gap:16px"><div style="width:0;height:0;border-left:34px solid #2f6f63;border-top:21px solid transparent;border-bottom:21px solid transparent"></div><div style="display:flex;align-items:center;gap:5px">${wave}</div><div style="font-size:60px;font-weight:900;color:${C.coralD};white-space:nowrap">12:48</div></div>`);
  E.S(VOICE, "ding", .7);
  // the forwarded warning
  msg(FWD, `<div style="font-size:28px;font-weight:700;color:#7a7a7a;font-style:italic;margin-bottom:6px">↪ Forwarded many times</div>DON'T drink cold water after lunch!!! SHARE WITH 10 PEOPLE`);
  E.S(FWD, "pop", .8);
  // Otto's reply
  msg(OK, "ok", "r", "font-size:58px");
  E.S(OK, "swish", .6);
  // her answer
  msg(ANGRY, "Why are you angry with me?", "l", `font-size:58px;color:${C.coralD}`);
  E.S(ANGRY, "nope", .7); E.shake(ANGRY, 10, .25);
  // typing dots
  const dots = E.el(inner, "", "display:flex;gap:10px;background:#fff;border-radius:6px 26px 26px 26px;padding:22px 24px;align-self:flex-start;opacity:0;max-height:0");
  const dd = [0, 1, 2].map(() => E.el(dots, "", "width:16px;height:16px;border-radius:50%;background:#9aa"));
  E.F(t => {
    const on = t >= TYPING && t < ANGRY; dots.style.opacity = on ? 1 : 0; dots.style.maxHeight = on ? "80px" : "0"; dots.style.padding = on ? "22px 24px" : "0 24px";
    dd.forEach((d, i) => { d.style.transform = `translateY(${Math.sin(t * 12 - i) * 6}px)`; });
  });

  // ---------------- the incoming call ----------------
  const call = E.el(scr, "abs", "inset:0;background:linear-gradient(180deg,#1f4f47,#0f2b27);display:flex;flex-direction:column;align-items:center;padding-top:140px;gap:26px;z-index:5;opacity:0");
  const ring = E.el(call, "", "width:260px;height:260px;border-radius:50%;overflow:hidden;position:relative;background:#f4e4c1;box-shadow:0 0 0 18px rgba(255,255,255,.12)");
  E.img(ring, "avatar", "position:absolute;left:-123px;top:-200px;width:500px;height:auto");
  E.el(call, "", "color:#fff;font-weight:900;font-size:62px", "Grandma");
  E.el(call, "", "color:#fff;opacity:.8;font-weight:700;font-size:36px", "incoming video call…");
  const acts = E.el(call, "", "position:absolute;bottom:90px;left:0;right:0;display:flex;justify-content:space-around");
  E.el(acts, "", "width:130px;height:130px;border-radius:50%;background:#e5484d");
  E.el(acts, "", "width:130px;height:130px;border-radius:50%;background:#35d07f");
  E.K(call, "o", [[CALL - .01, 0], [CALL, 1]]);
  E.F(t => { ring.style.boxShadow = `0 0 0 ${18 + Math.max(0, Math.sin((t - CALL) * 9)) * 22}px rgba(255,255,255,.14)`; });
  E.K(phone, "r", [[CALL, 0], ...Array.from({ length: 14 }, (_, i) => [CALL + .05 + i * .06, i % 2 ? -3 : 3]), [CALL + .95, 0], [CALL + 1.1, 0], ...Array.from({ length: 12 }, (_, i) => [CALL + 1.15 + i * .06, i % 2 ? -3 : 3]), [CALL + 1.9, 0]]);
  E.S(CALL, "buzz", 1); E.S(CALL + 1.1, "buzz", 1); E.S(CALL + 2.2, "buzz", .9);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Texting *grandma*", { size: 70, lh: 1.04, instant: true, id: "hook", nowrap: true });
  const clock = E.el(S.el, "abs", `left:100px;top:352px;background:${C.ink};color:#fff;font-weight:900;font-size:50px;padding:.08em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7`, "06:02");

  E.finish(DUR);
  E.K(E.logo, "s", [[9.9, 1], [10.15, 1.18, "out"], [10.5, 1, "io"]]);
}
