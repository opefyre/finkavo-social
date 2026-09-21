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
