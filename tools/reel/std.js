// std.js — the two scenes every reel shares (the named habit, and the send-line + follow reason).
(() => {
  const C = E.C;
  E.std = {};
  E.std.money = v => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  E.std.habit = (s, t0, o) => {
    E.cur = s;
    E.blobs(s, [{ x: 500, y: 1000, d: 700, c: "#0d3a3a", ax: 40, ay: 40, o: .9 }, { x: -260, y: 200, d: 560, c: "#0a2c2e", ph: 1, o: .9 }]);
    const col = E.col(s, "gap:40px;justify-content:center");
    E.chip(col, "The habit", t0 + .25);
    E.S(t0 + .4, "riser", .6);
    E.stamp(col, o.name, t0 + 1.05, { size: o.size || 150, css: "max-width:780px", rot: -5 });
    E.text(col, o.def, { size: 62, t: t0 + 1.9, weight: 800, color: C.cream, ls: "-.02em", id: "def" });
    if (o.quote) {
      const q = E.el(col, "", `display:inline-flex;align-items:center;gap:22px;align-self:flex-start;margin-top:30px;background:${C.petrol};padding:26px 34px;border-radius:36px`);
      E.text(q, o.quote, { size: o.qsize || 58, t: t0 + 3.5, weight: 800, color: C.cream, id: "quote", ls: "-.02em", css: "white-space:nowrap" });
      const x = E.el(q, "", "width:84px;height:84px"); x.innerHTML = E.icons.cross(84);
      E.pop(x, t0 + 4.6, { from: .2 }); E.S(t0 + 4.62, "nope", .8);
      E.show(q, t0 + 3.3, { dy: 30 });
    }
    if (o.after) o.after(col, t0);
    const big = E.el(s.el, "", `position:absolute;right:60px;bottom:560px;font-weight:900;font-size:${o.decorSize || 300}px;line-height:1;letter-spacing:-.05em;color:rgba(127,224,192,.10)`, o.decor || "");
    E.F(t => { big.style.transform = `translateY(${Math.sin(t * .9) * 16}px)`; });
  };
  E.std.send = (s, t0, o) => {
    E.cur = s;
    E.blobs(s, [{ x: 600, y: 900, d: 700, c: "#dff5ec", ax: 50, ay: 40 }, { x: -260, y: 200, d: 620, c: "#fbe6d1", ph: 1 }]);
    const col = E.col(s, "gap:48px;justify-content:center");
    const env = E.el(col, "", "align-self:flex-start;margin-top:14px"); env.className = "sh"; env.innerHTML = E.icons[o.icon || "doc"](190);
    E.pop(env, t0 + .3, { from: .3 }); E.S(t0 + .35, "pop");
    E.text(col, o.send, { size: 88, t: t0 + .8, lh: 1.04, id: "send" });
    E.card(col, { t: t0 + 1.5, icon: "check", iconBg: C.mint, text: o.follow, size: 50, from: "up", ic: 116 });
    const h = E.el(col, "chip dk", "align-self:flex-start;font-size:52px;padding:22px 44px 26px;text-transform:none;letter-spacing:.01em", "@finkavo");
    E.pop(h, t0 + 3.6, { from: .5 }); E.S(t0 + 3.65, "ding");
  };
  // an arrow that draws itself on (a horizontal line with a head)
  E.std.arrow = (parent, w, color, t, dur = .5) => {
    const box = E.svg(parent, w, 40, `<path class="a" d="M4 20 H${w - 20} M${w - 34} 6 L${w - 6} 20 L${w - 34} 34" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`);
    E.K(E.part(box, "a"), "draw", [[t, 0], [t + dur, 1, "out"]]);
    return box;
  };
  // countdown/progress ring with a number and a label
  E.std.dial = (parent, size, o) => {
    const st = E.el(parent, "", `position:relative;width:${size}px;height:${size}px;flex:none`);
    const { box, arc } = E.ring(st, size, o.stroke || 30, o.color || C.amberD, "rgba(11,42,44,.10)"); box.style.position = "absolute";
    const num = E.el(st, "", `position:absolute;left:0;right:0;top:${size * .22}px;text-align:center;font-weight:900;font-size:${size * .4}px;line-height:1;letter-spacing:-.04em;color:${C.ink}`, String(o.from));
    E.el(st, "", `position:absolute;left:0;right:0;top:${size * .64}px;text-align:center;font-weight:800;font-size:${size * .105 * (o.labelScale || 1)}px;letter-spacing:.12em;text-transform:uppercase;color:${C.mute}`, o.label);
    const up = o.to >= o.from;
    E.K(arc, "draw", [[o.t0, up ? 0 : 1], [o.t1, up ? 1 : 0, "io"]]);
    E.count(num, o.t0, o.t1, o.from, o.to, { ticks: o.ticks || 8 });
    return st;
  };
})();

// ---------- E.std.sk: the cartoon-skit kit (Dec 2026 experiment). One look for every run: a painted set, cast cutouts,
// a frame-0 hook title, speech bubbles with Portuguese subtitles, a Portugal tag, and (fact runs) a fact card. ----------
(() => {
  const C = E.C, sk = E.std.sk = {};
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  sk.at = at;
  sk.vis = (el, a, b) => E.F(t => { el.style.opacity = t >= a && t < b ? 1 : 0; });
  // painted set covering the frame, with a slow push-in so the frame never freezes
  sk.set = (S, key, a, b, o = {}) => {
    const w = E.el(S.el, "abs", "inset:0;overflow:hidden;transform-origin:50% 60%"); sk.vis(w, a, b);
    E.img(w, key, `position:absolute;left:0;top:0;width:1080px;height:1930px;object-fit:cover;${o.css || ""}`);
    E.K(w, "s", [[a, o.s0 || 1.0], [b, o.s1 || 1.06, "lin"]]); return w;
  };
  // a character with several pose images; poses = [[name, w, h], ...]; face = [[t, name], ...]
  sk.actor = (S, poses, o) => {
    const sc = o.scale || 1, W = Math.max(...poses.map(p => p[1])) * sc, H = Math.max(...poses.map(p => p[2])) * sc;
    const box = E.el(S.el, "abs", `left:${o.x - W / 2}px;top:${(o.floor || 1780) - H}px;width:${W}px;height:${H}px;z-index:${o.z || 3};transform-origin:50% 100%`);
    const inner = E.el(box, "abs", "inset:0;transform-origin:50% 100%");
    const ims = poses.map(([n, w, h]) => E.img(inner, n, `position:absolute;left:${(W - w * sc) / 2}px;bottom:0;width:${w * sc}px;height:${h * sc}px;${o.flip ? "transform:scaleX(-1)" : ""}`));
    const face = o.face || [[0, poses[0][0]]];
    E.F(t => { const f = at(face, t); ims.forEach((x, i) => { x.style.opacity = poses[i][0] === f ? 1 : 0; }); });
    if (o.on) sk.vis(box, o.on[0], o.on[1]);
    // idle breathing so a held character still moves
    E.K(inner, "sy", Array.from({ length: 40 }, (_, k) => [k * .6, k % 2 ? 1.012 : 1, "io"]));
    return { box, inner };
  };
  sk.hop = (a, t, h = 40) => E.K(a.inner, "y", [[t, 0], [t + .12, -h, "out"], [t + .26, 0, "in"]]);
  sk.lean = (a, t, d = 60, hold = .3) => E.K(a.inner, "x", [[t, 0], [t + .15, d, "out"], [t + .15 + hold, d], [t + .35 + hold, 0, "io"]]);
  sk.enter = (a, t, from = 900) => E.K(a.box, "x", [[t, from], [t + .35, 0, "out"]]);
  sk.shakeA = (a, t, n = 6) => E.K(a.inner, "r", [...Array.from({ length: n }, (_, k) => [t + k * .06, k % 2 ? 4 : -4]), [t + n * .06, 0]]);
  // speech bubble; pt = English subtitle shown under the Portuguese line
  sk.bubble = (S, html, o) => {
    const b = E.el(S.el, "abs", `left:${o.x}px;top:${o.y}px;width:${o.w || 520}px;z-index:9;transform-origin:${o.tail || 120}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:20px 28px 24px;box-shadow:0 10px 26px rgba(0,0,0,.2);font-weight:900;font-size:${o.fs || 58}px;line-height:1.08;color:${C.ink};text-align:center`,
      html + (o.pt ? `<div style="font-size:${Math.round((o.fs || 58) * .6)}px;font-weight:800;color:#8a6a1c;margin-top:6px">(${o.pt})</div>` : ""));
    E.el(bx, "abs", `left:${o.tail || 120}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, o.t0, { from: .3, dur: .28 }); E.K(b, "o", [[o.t0, 0], [o.t0 + .06, 1], [o.t1 - .1, 1], [o.t1, 0]]);
    return b;
  };
  // frame-0 hook: the narrator's line as the title, fully on screen at t=0, on a bold block; ends at t1
  sk.hook = (S, str, t1, o = {}) => {
    const box = E.el(S.el, "abs", `left:100px;top:${o.top || 250}px;width:780px;z-index:10;display:flex;justify-content:center`);
    const card = E.el(box, "", "background:#fff;border:6px solid #141414;border-radius:28px;padding:18px 30px 22px;box-shadow:0 12px 0 #141414;text-align:center");
    E.text(card, str, { size: o.size || 66, lh: 1.08, instant: true, id: "hook", align: "center" });
    E.K(box, "o", [[t1 - .15, 1], [t1, 0]]);
    return box;
  };
  // small Portugal tag (constant across all runs), top-left
  sk.tag = (S, t1) => {
    const g = E.el(S.el, "abs", "left:60px;top:120px;display:flex;align-items:center;gap:14px;background:#fff;border-radius:18px;padding:10px 20px 10px 12px;box-shadow:0 6px 16px rgba(0,0,0,.18);z-index:10;font-weight:900;font-size:36px;color:#141414");
    g.innerHTML = `<svg viewBox="0 0 60 40" width="66" height="44"><rect width="24" height="40" fill="#046a38"/><rect x="24" width="36" height="40" fill="#da291c"/><circle cx="24" cy="20" r="8" fill="#ffe900" stroke="#fff" stroke-width="1.5"/></svg>Portugal`;
    E.K(g, "o", [[t1 - .15, 1], [t1, 0]]); return g;
  };
  // fact card (fact runs only): the verified line, key number highlighted with *…*
  sk.fact = (S, str, t0, t1, o = {}) => {
    const box = E.el(S.el, "abs", `left:100px;top:${o.top || 330}px;width:780px;z-index:12;display:flex;justify-content:center`);
    const card = E.el(box, "", `background:#0f3b3a;border-radius:30px;padding:30px 36px 34px;box-shadow:0 18px 40px rgba(0,0,0,.35);text-align:center;border:6px solid #ffd640`);
    E.text(card, str, { size: o.size || 60, lh: 1.12, t: t0 + .1, color: "#fff", id: "fact", align: "center", stagger: .05 });
    E.pop(box, t0, { from: .5, dur: .3 }); E.K(box, "o", [[t0, 0], [t0 + .05, 1], [t1 - .15, 1], [t1, 0]]);
    return box;
  };
  // caption bar for narration lines that aren't in a bubble
  sk.cap = (S, list) => {
    const el = E.el(S.el, "abs", "left:60px;top:1590px;width:960px;text-align:center;z-index:11");
    E.F(t => { const s = at([[0, ""], ...list], t); if (el.dataset.s !== s) { el.dataset.s = s; el.innerHTML = s ? `<span style="display:inline-block;background:#141414;color:#fff;border-radius:16px;padding:10px 24px;font-weight:800;font-size:46px;line-height:1.2">${s}</span>` : ""; } });
  };
})();
// camera punches: the whole frame snaps between two framings every `every` s (an edit beat) so long holds keep changing
(() => { const sk = E.std.sk;
  sk.punch = (S, t0, t1, every = 1.7, amt = 1.09) => {
    const k = []; let i = 0;
    for (let t = t0; t < t1; t += every, i++) { const a = i % 2 ? amt : 1, b = i % 2 ? 1 : amt; k.push([t, a], [t + .14, b, "out"]); }
    S.el.style.transformOrigin = "50% 45%"; E.K(S.el, "s", k);
  };
})();

// ---------- E.std.ex: narrated-explainer kit (life-admin reels, Nov 2026). Cream paper background with a slow-moving grid,
// big kinetic headlines, white "object" cards (documents drawn in code), icon tiles, arrows that draw, check/cross marks. ----------
(() => {
  const sk = E.std.sk, ex = E.std.ex = {}, C = E.C;
  ex.bg = (S, a, b, col = "#f4efe4") => {
    const w = E.el(S.el, "abs", `inset:0;background:${col};overflow:hidden`); sk.vis(w, a, b); S._bg = w;
    const g = E.el(w, "abs", "left:-200px;top:-200px;width:1480px;height:2330px;background-image:linear-gradient(rgba(15,59,58,.07) 2px,transparent 2px),linear-gradient(90deg,rgba(15,59,58,.07) 2px,transparent 2px);background-size:80px 80px");
    E.K(g, "x", [[a, 0], [b, 80, "lin"]]); E.K(g, "y", [[a, 0], [b, 80, "lin"]]); return w;
  };
  // headline with words appearing on time; o.top, o.size; returns the block
  ex.head = (S, str, t0, t1, o = {}) => {
    const box = E.el(S.el, "abs", `left:100px;top:${o.top || 270}px;width:780px;z-index:10;text-align:${o.align || "center"}`);
    E.text(box, str, { size: o.size || 76, lh: 1.05, t: t0, align: o.align || "center", id: o.id || str.slice(0, 20), instant: !!o.instant, stagger: o.stagger || .09, color: o.color || "" });
    E.K(box, "o", [[t1 - .15, 1], [t1, 0]]); return box;
  };
  ex.card = (S, html, o) => {
    const el = E.el(S.el, "abs", `left:${o.x}px;top:${o.y}px;width:${o.w}px;${o.h ? `height:${o.h}px;` : ""}background:#fff;border-radius:28px;box-shadow:0 18px 40px rgba(15,59,58,.22);z-index:${o.z || 6};padding:${o.pad ?? 26}px;font-weight:900;color:#141414;${o.css || ""}`, html);
    sk.vis(el, o.t0, o.t1); if (o.t0 > 0) E.pop(el, o.t0, { from: o.from || .5, dur: .3 }); return el;
  };
  ex.tile = (S, svg, label, o) => {
    const el = E.el(S.el, "abs", `left:${o.x}px;top:${o.y}px;width:${o.w || 230}px;display:flex;flex-direction:column;align-items:center;gap:10px;z-index:${o.z || 6}`);
    const ic = E.el(el, "", `width:${o.s || 150}px;height:${o.s || 150}px;background:${o.bg || "#fff"};border-radius:32px;box-shadow:0 12px 26px rgba(15,59,58,.2);display:flex;align-items:center;justify-content:center`); ic.innerHTML = svg;
    E.el(el, "", `font-weight:900;font-size:${o.fs || 34}px;color:#0f3b3a;text-align:center;line-height:1.05`, label);
    sk.vis(el, o.t0, o.t1); if (o.t0 > 0) E.pop(el, o.t0, { from: .3, dur: .3 }); return { el, ic };
  };
  // a badge (✓ / ! / ✗) that pops onto a tile at t
  ex.mark = (parent, kind, t, o = {}) => {
    const col = { ok: "#1f9d55", warn: "#e0a100", no: "#d62828" }[kind], ch = { ok: "✓", warn: "!", no: "✗" }[kind];
    const m = E.el(parent, "abs", `right:${o.r ?? -8}px;top:${o.top ?? -8}px;width:64px;height:64px;border-radius:50%;background:${col};color:#fff;font-weight:900;font-size:44px;display:flex;align-items:center;justify-content:center;border:5px solid #fff;z-index:3`, ch);
    sk.vis(m, t, o.t1 ?? 999); E.pop(m, t, { from: .2, dur: .25 }); return m;
  };
  // an arrow that draws from (x1,y1) to (x2,y2) over dur
  ex.arrow = (S, x1, y1, x2, y2, t0, t1, o = {}) => {
    const len = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    const a = E.el(S.el, "abs", `left:${x1}px;top:${y1 - 7}px;width:${len}px;height:14px;transform-origin:0 50%;transform:rotate(${ang}deg);z-index:${o.z || 5}`);
    const bar = E.el(a, "abs", `left:0;top:0;height:14px;width:100%;background:${o.col || "#0f3b3a"};border-radius:7px;transform-origin:0 50%`);
    E.el(a, "abs", `right:-8px;top:-13px;width:0;height:0;border-left:34px solid ${o.col || "#0f3b3a"};border-top:20px solid transparent;border-bottom:20px solid transparent`);
    E.K(bar, "sx", [[t0, 0], [t0 + (o.dur || .4), 1, "out"]]); sk.vis(a, t0, t1); return a;
  };
  ex.icon = {
    tax: s => `<svg viewBox="0 0 100 100" width="${s}" height="${s}"><rect x="20" y="14" width="60" height="72" rx="8" fill="#0f3b3a"/><rect x="30" y="28" width="40" height="7" rx="3" fill="#fff"/><rect x="30" y="42" width="40" height="7" rx="3" fill="#fff"/><text x="50" y="76" font-size="22" font-weight="900" text-anchor="middle" fill="#ffd640" font-family="Noto Sans">€</text></svg>`,
    social: s => `<svg viewBox="0 0 100 100" width="${s}" height="${s}"><circle cx="35" cy="36" r="13" fill="#2f6db5"/><circle cx="65" cy="36" r="13" fill="#2f6db5"/><path d="M12 80c2-18 14-26 23-26s21 8 23 26z" fill="#2f6db5"/><path d="M42 80c2-18 14-26 23-26s21 8 23 26z" fill="#4f8fd5"/></svg>`,
    health: s => `<svg viewBox="0 0 100 100" width="${s}" height="${s}"><rect x="38" y="14" width="24" height="72" rx="6" fill="#d62828"/><rect x="14" y="38" width="72" height="24" rx="6" fill="#d62828"/></svg>`,
    paw: s => `<svg viewBox="0 0 100 100" width="${s}" height="${s}"><ellipse cx="50" cy="66" rx="20" ry="16" fill="#8a5f3a"/><circle cx="26" cy="44" r="9" fill="#8a5f3a"/><circle cx="40" cy="30" r="9" fill="#8a5f3a"/><circle cx="60" cy="30" r="9" fill="#8a5f3a"/><circle cx="74" cy="44" r="9" fill="#8a5f3a"/></svg>`,
  };
})();
// beat tints: the background switches tint on a beat (cream ↔ mint/sand), a whole-frame change every `every` s
(() => { const ex = E.std.ex, sk = E.std.sk;
  ex.tints = (S, t0, t1, every = 2.6) => {
    const cols = ["#f4efe4", "#b9e3d3", "#f4efe4", "#ecd09c"];
    const w = S._bg;
    E.F(t => { const i = t < t0 || t >= t1 ? 0 : Math.floor((t - t0) / every) % cols.length; const c = cols[i]; if (w.dataset.c !== c) { w.dataset.c = c; w.style.background = c; } });
    return w;
  };
})();
