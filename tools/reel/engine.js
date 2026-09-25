// engine.js — runs inside the page. Every frame is a pure function of time: E.render(t) sets every
// property from its keyframe track, so any frame can be drawn on its own, in any order, on any worker.
window.E = (() => {
  const W = 1080, H = 1920, FPS = 30;
  // Instagram's chrome: nothing readable above y=250, below y=1550, left of 100 or right of 880.
  const SAFE = { top: 250, bottom: 370, left: 100, right: 220 };
  const COL = 780;
  const C = {
    deep: "#06181a", petrol: "#0f2f33", teal: "#1d4f4c", ink: "#0b2a2c", cream: "#f6f1e7", white: "#ffffff",
    mint: "#7fe0c0", mintD: "#26a688", amber: "#f3b072", amberD: "#d9812f", coral: "#ff7d63", coralD: "#d9482e",
    mute: "#557270", line: "#e6dfd0",
  };

  // ---------- keyframe tracks ----------
  // [time, value, easing]: the easing shapes the segment that ENDS at this key.
  const EASE = {
    lin: u => u,
    out: u => 1 - Math.pow(1 - u, 3),
    in: u => u * u * u,
    io: u => (u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
    back: u => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); },
    elastic: u => (u === 0 ? 0 : u === 1 ? 1 : Math.pow(2, -10 * u) * Math.sin((u * 10 - .75) * (2 * Math.PI) / 3) + 1),
    step: u => (u < 1 ? 0 : 1),
  };
  const sample = (keys, t) => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [tb, vb, eb] = keys[i];
      if (t < tb) {
        const [ta, va] = keys[i - 1];
        const u = (t - ta) / (tb - ta);
        return va + (vb - va) * EASE[eb || "lin"](Math.min(1, Math.max(0, u)));
      }
    }
    return keys[keys.length - 1][1];
  };
  const TF = new Set(["x", "y", "r", "s", "sx", "sy"]);
  const PROPS = {
    w: (el, v) => { el.style.width = v + "px"; },
    h: (el, v) => { el.style.height = v + "px"; },
    draw: (el, v) => { el.style.strokeDashoffset = String(1 - v); },
    blur: (el, v) => { el.style.filter = v > 0.01 ? `blur(${v}px)` : "none"; },
  };

  const E = { W, H, FPS, SAFE, COL, C, EASE, tracked: [], fns: [], sounds: [], texts: [], scenes: [], shakes: [], flashes: [], cur: null, dur: 0, wipes: [] };

  E.K = (el, prop, keys) => {
    const tr = el.__tr || (el.__tr = {});
    (tr[prop] || (tr[prop] = [])).push(...keys);
    tr[prop].sort((a, b) => a[0] - b[0]);
    if (!el.__tracked) { el.__tracked = true; E.tracked.push(el); }
    return el;
  };
  E.F = fn => { E.fns.push(fn); };
  E.S = (t, name, vol = 1) => { E.sounds.push({ t, name, vol }); };
  // A recorded clip (a voice line, a TV soundtrack): a WAV under branding/, placed at t. o.vol, o.from/o.to (seconds into the file),
  // o.gain = [[t, g], ...] a volume curve in reel time (for a TV that is turned down), o.duck = true to dip the music under it.
  E.clips = [];
  E.clip = (t, file, o = {}) => { E.clips.push({ t, file, vol: o.vol ?? 1, from: o.from ?? 0, to: o.to ?? null, gain: o.gain || null, duck: o.duck ?? true }); };

  // ---------- DOM ----------
  E.el = (parent, cls = "", css = "", html = "") => {
    const d = document.createElement("div");
    if (cls) d.className = cls;
    if (css) d.style.cssText = css;
    if (html) d.innerHTML = html;
    parent.appendChild(d);
    return d;
  };

  E.CSS = `
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{width:${W}px;height:${H}px;overflow:hidden;background:#000}
  body{font-family:"Noto Sans",Arial,sans-serif;-webkit-font-smoothing:antialiased;font-variant-numeric:lining-nums}
  .world{position:absolute;inset:0;overflow:hidden;will-change:transform}
  .scene{position:absolute;inset:0;overflow:hidden;display:none}
  .light{--fg:${C.ink};--bg:${C.cream};--card:#fff;--cardfg:${C.ink};--mute:${C.mute};--shadow:0 22px 50px rgba(11,42,44,.13),0 4px 10px rgba(11,42,44,.06);background:var(--bg);color:var(--fg)}
  .dark{--fg:${C.cream};--bg:${C.deep};--card:${C.petrol};--cardfg:${C.cream};--mute:rgba(246,241,231,.66);--shadow:0 22px 50px rgba(0,0,0,.35);background:radial-gradient(120% 70% at 70% 12%,#123f3f 0%,${C.deep} 62%);color:var(--fg)}
  .abs{position:absolute}
  .col{position:absolute;left:${SAFE.left}px;top:${SAFE.top}px;width:${COL}px;height:${H - SAFE.top - SAFE.bottom}px;display:flex;flex-direction:column}
  .tx{font-weight:900;letter-spacing:-.03em}
  .tx .ln{display:block;text-wrap:balance}
  .tx .w{display:inline-block;will-change:transform,opacity}
  .tx .em{display:inline-block;padding:.02em .2em .06em;border-radius:.26em;margin-right:.04em}
  .em.mint{background:${C.mint};color:${C.ink}} .em.amber{background:${C.amber};color:${C.ink}} .em.coral{background:${C.coral};color:${C.ink}}
  .chip{display:inline-flex;align-items:center;gap:14px;padding:14px 28px 15px;border-radius:999px;font-weight:900;font-size:30px;letter-spacing:.13em;text-transform:uppercase;background:${C.mint};color:${C.ink}}
  .chip.dk{background:${C.ink};color:${C.mint}}
  .chip .w{margin-right:.4em}
  .card{position:relative;display:flex;align-items:center;gap:28px;padding:28px 34px 28px 28px;border-radius:40px;background:var(--card);color:var(--cardfg);box-shadow:var(--shadow)}
  .card .ic{flex:none;width:104px;height:104px;border-radius:30px;display:flex;align-items:center;justify-content:center}
  .prog{position:absolute;left:${SAFE.left}px;top:196px;width:${COL}px;height:12px;border-radius:6px;background:rgba(11,42,44,.14);overflow:hidden}
  .prog i{position:absolute;inset:0;border-radius:6px;background:${C.mintD};transform-origin:0 50%}
  .logo{position:absolute;right:60px;top:70px;width:112px;height:112px;border-radius:32px;padding:0}
  .logo img{display:block;width:100%;height:100%;object-fit:contain;border-radius:30px}
  .flash{position:absolute;inset:0;pointer-events:none;opacity:0}
  .wipe{position:absolute;left:50%;top:50%;width:1900px;height:3400px;margin-left:-950px;margin-top:-1700px;pointer-events:none}
  svg{display:block;overflow:visible}
  .sh{filter:drop-shadow(0 10px 16px rgba(11,42,44,.22))}
  svg *{transform-box:fill-box;transform-origin:center}
  `;

  E.init = (assets) => {
    document.head.insertAdjacentHTML("beforeend", `<style>${E.CSS}</style>`);
    const b = document.body; b.innerHTML = "";
    E.world = E.el(b, "world");
    E.ui = E.el(b, "abs", "inset:0;pointer-events:none");
    E.assets = assets;
    E.images = assets.images || {};
  };
  // Episode mode (character shorts): any length 10-30 s, one or more scenes, no 5-scene rule. Set with E.episode().
  E.episode = (sfxLufs = -16) => { E.kind = "episode"; E.sfxLufs = sfxLufs; };
  // A picture from meta.images (a cutout PNG). Returns the <img>; size it with css (height:820px;width:auto).
  E.img = (parent, name, css = "") => {
    const i = document.createElement("img");
    if (!E.images[name]) throw new Error("unknown image " + name);
    i.src = E.images[name]; i.style.cssText = "display:block;" + css; parent.appendChild(i); return i;
  };

  // ---------- scenes ----------
  E.scene = (id, t0, t1, theme = "light") => {
    const el = E.el(E.world, `scene ${theme}`);
    const S = { id, t0, t1, theme, el, i: E.scenes.length };
    E.scenes.push(S); E.cur = S;
    return S;
  };
  E.col = (S, css = "") => E.el(S.el, "col", css);

  // ---------- kinetic text ----------
  // *word* = mint pill, *$word* = amber pill, *!word* = coral pill, | = line break.
  E.text = (parent, str, o = {}) => {
    const { size = 56, weight = 900, color = "", lh = 1.06, ls = "", t = 0, stagger = .07, dur = .3, rise = 26, align = "left", font = "", instant = false, css = "", id = "", check = true, up = false, nowrap = false } = o;
    const block = E.el(parent, "tx", `font-size:${size}px;font-weight:${weight};line-height:${lh};text-align:${align};${color ? `color:${color};` : ""}${ls ? `letter-spacing:${ls};` : ""}${font ? `font-family:${font};` : ""}${up ? "text-transform:uppercase;" : ""}${css}`);
    let n = 0; const wordEls = [];
    for (const line of String(str).split("|")) {
      const ln = E.el(block, "ln", nowrap ? "text-wrap:nowrap;white-space:nowrap" : "");   // (.ln has text-wrap:balance, which would override an inherited nowrap)
      const re = /\*([^*]+)\*([^\s*]*)|(\S+)/g; let m;
      while ((m = re.exec(line))) {
        const span = document.createElement("span");
        span.className = "w";
        if (m[1] !== undefined) {
          let s = m[1], kind = "mint";
          if (s[0] === "$") { kind = "amber"; s = s.slice(1); } else if (s[0] === "!") { kind = "coral"; s = s.slice(1); }
          const em = document.createElement("span"); em.className = `em ${kind}`; em.textContent = s.split(" ").join("\u00a0");
          span.appendChild(em); if (m[2]) span.appendChild(document.createTextNode(m[2]));
          n += s.split(" ").length;
        } else { span.textContent = m[3]; n += 1; }
        ln.appendChild(span); ln.appendChild(document.createTextNode(" "));
        wordEls.push(span);
      }
    }
    wordEls.forEach((w, i) => {
      if (instant) return;
      const s = t + i * stagger;
      E.K(w, "o", [[s, 0], [s + dur * .6, 1, "out"]]);
      E.K(w, "y", [[s, rise], [s + dur, 0, "out"]]);
    });
    const h = { el: block, words: n, wordEls, tIn: instant ? 0 : t, tFull: instant ? 0 : t + (wordEls.length - 1) * stagger + dur, tOut: null, scene: E.cur, id: id || String(str).slice(0, 24), check };
    E.texts.push(h);
    return h;
  };
  // Make a text (or any element) leave at t.
  E.until = (h, t, dur = .22) => {
    const el = h.el || h;
    E.K(el, "o", [[t, 1], [t + dur, 0, "in"]]);
    if (h.words !== undefined) h.tOut = t;
    return h;
  };
  // Pop in: scale up with a bounce while fading.
  E.pop = (el, t, o = {}) => {
    const { from = 0.2, dur = .42, ease = "back", dy = 0 } = o;
    E.K(el, "s", [[t, from], [t + dur, 1, ease]]);
    E.K(el, "o", [[t, 0], [t + .12, 1, "out"]]);
    if (dy) E.K(el, "y", [[t, dy], [t + dur, 0, "out"]]);
    return el;
  };
  // Show: slide up and fade in, optionally fade out again.
  E.show = (el, t, o = {}) => {
    const { dy = 40, dur = .4, out = null } = o;
    E.K(el, "y", [[t, dy], [t + dur, 0, "out"]]);
    E.K(el, "o", [[t, 0], [t + dur * .6, 1, "out"]]);
    if (out !== null) E.K(el, "o", [[out, 1], [out + .2, 0, "in"]]);
    return el;
  };
  E.swap = (el, list) => {
    E.F(t => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; if (el.textContent !== v) el.textContent = v; });
  };
  // Integer counter from a to b between t0 and t1 (with optional tick sounds).
  E.count = (el, t0, t1, a, b, o = {}) => {
    const { ease = "io", fmt = v => String(v), ticks = 0, tick = "tick" } = o;
    E.F(t => {
      const u = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
      const v = Math.round(a + (b - a) * EASE[ease](u));
      const s = fmt(v); if (el.textContent !== s) el.textContent = s;
    });
    for (let i = 0; i < ticks; i++) E.S(t0 + (t1 - t0) * (i / Math.max(1, ticks - 1)), tick, .5);
  };

  // ---------- impact ----------
  E.shake = (t, amp = 16, dur = .32) => { E.shakes.push({ t, amp, dur, seed: E.shakes.length * 1.7 + 1 }); };
  E.flash = (t, color = "#ffffff", peak = .55, dur = .2) => {
    const el = E.el(E.ui, "flash", `background:${color}`);
    E.K(el, "o", [[t, 0], [t + .025, peak, "out"], [t + dur, 0, "out"]]);
    E.flashEls = (E.flashEls || []).concat(el);
  };
  E.stamp = (parent, str, t, o = {}) => {
    const { size = 108, bg = C.coral, fg = C.ink, rot = -6, from = 1.9, css = "", shake = 18, sound = "thud" } = o;
    const el = E.el(parent, "", `display:inline-block;align-self:flex-start;background:${bg};color:${fg};font-weight:900;font-size:${size}px;line-height:1;letter-spacing:-.035em;padding:.16em .3em .2em;border-radius:.24em;${css}`, str);
    E.K(el, "s", [[t, from], [t + .26, 1, "back"]]);
    E.K(el, "r", [[t, rot - 14], [t + .3, rot, "out"]]);
    E.K(el, "o", [[t, 0], [t + .08, 1, "out"]]);
    E.S(t + .2, sound); E.shake(t + .2, shake); E.flash(t + .2, "#ffffff", .5, .22);
    return el;
  };
  // Wipe transition centred on time tb (cover, swap scene, uncover) with a whoosh.
  E.wipe = tb => {
    const d = .28;
    const mk = (color, lag) => {
      const el = E.el(E.ui, "wipe", `background:${color};transform:translateX(-2600px) skewX(-8deg)`);
      E.K(el, "x", [[tb - d + lag, -2600], [tb + lag, 0, "io"], [tb + lag + .0001, 0], [tb + d + lag, 2600, "io"]]);
      el.__skew = true;
      return el;
    };
    mk(C.deep, .07); mk(C.mint, 0);
    E.S(tb - d - .02, "whoosh");
    E.wipes.push(tb);
  };

  // ---------- diagram helpers ----------
  E.svg = (parent, w, h, inner, css = "") => {
    const d = E.el(parent, "", `width:${w}px;height:${h}px;${css}`);
    d.innerHTML = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
    return d;
  };
  E.part = (root, cls) => root.querySelector("." + cls);
  E.ring = (parent, size, stroke, color, track, css = "") => {
    const r = (size - stroke) / 2;
    const box = E.svg(parent, size, size,
      `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${track}" stroke-width="${stroke}"/>` +
      `<circle class="arc" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" style="transform:rotate(-90deg);transform-box:view-box;transform-origin:50% 50%"/>`, css);
    const arc = E.part(box, "arc");
    return { box, arc };
  };
  E.dots = (parent, o) => {
    const { n, cols, size = 26, gap = 7, t0, t1, on = C.mintD, off = "rgba(11,42,44,.12)", hi = C.amberD, css = "" } = o;
    const rows = Math.ceil(n / cols);
    const wrap = E.el(parent, "", `display:grid;grid-template-columns:repeat(${cols},${size}px);gap:${gap}px;${css}`);
    const list = [];
    for (let i = 0; i < n; i++) {
      const d = E.el(wrap, "", `width:${size}px;height:${size}px;border-radius:50%;background:${off}`);
      const last = i === n - 1;
      const dot = E.el(d, "", `width:100%;height:100%;border-radius:50%;background:${last ? hi : on}`);
      const ti = t0 + (t1 - t0) * Math.pow(i / (n - 1 || 1), 1.0);
      E.K(dot, "s", [[ti, 0], [ti + .2, last ? 1.5 : 1, "back"]]);
      if (last) E.K(dot, "s", [[ti + .2, 1.5], [ti + .5, 1.25, "out"]]);
      list.push({ dot, t: ti });
    }
    return { wrap, list, rows };
  };
  E.card = (parent, o) => {
    const { t, from = "left", icon = null, iconBg = C.mint, text, size = 46, css = "", ic = 104, out = null, lh = 1.12, w = COL } = o;
    const el = E.el(parent, "card", `width:${w}px;${css}`);
    let ico = null;
    if (icon) { ico = E.el(el, "ic", `background:${iconBg};width:${ic}px;height:${ic}px`); ico.innerHTML = E.icons[icon](ic * .72, o.colors); }
    const h = E.text(el, text, { size, t: t + .28, weight: 800, lh, ls: "-.02em", stagger: .05 });
    h.el.style.flex = "1";
    const dx = from === "left" ? -170 : from === "right" ? 170 : 0;
    E.K(el, "x", [[t, dx], [t + .5, 0, "back"]]);
    if (from === "up") E.K(el, "y", [[t, 60], [t + .45, 0, "out"]]);
    E.K(el, "o", [[t, 0], [t + .22, 1, "out"]]);
    if (ico) E.K(ico, "s", [[t + .18, .3], [t + .6, 1, "back"]]);
    E.S(t + .02, "swish", .7); E.S(t + .3, "pop", .8);
    if (out !== null) { E.K(el, "o", [[out, 1], [out + .22, 0, "in"]]); h.tOut = out; }
    return { el, text: h, ico };
  };
  E.chip = (parent, str, t, o = {}) => {
    const el = E.el(parent, `chip${o.dark ? " dk" : ""}`, `align-self:flex-start;${o.css || ""}`);
    const h = E.text(el, str, { size: 30, t: o.instant ? 0 : t + .1, weight: 900, ls: ".13em", stagger: .05, up: true, instant: !!o.instant, check: false, css: "font-weight:900" });
    if (!o.instant) E.pop(el, t, { from: .6, dur: .36 });
    return { el, text: h };
  };
  // Soft drifting shapes, so even a "still" frame has something moving.
  E.blobs = (S, list) => {
    for (const b of list) {
      const el = E.el(S.el, "abs", `left:${b.x}px;top:${b.y}px;width:${b.d}px;height:${b.d}px;border-radius:50%;background:${b.c};opacity:${b.o ?? .5}`);
      E.F(t => { el.style.transform = `translate(${Math.sin(t * (b.sp || .5) + (b.ph || 0)) * (b.ax || 40)}px,${Math.cos(t * (b.sp || .5) * .8 + (b.ph || 0)) * (b.ay || 50)}px)`; });
    }
  };

  // ---------- frame ----------
  const seedNoise = (a) => Math.sin(a * 12.9898) * 43758.5453 % 1;
  E.render = (t) => {
    for (const el of E.tracked) {
      const tr = el.__tr;
      const g = (p, d) => (tr[p] ? sample(tr[p], t) : d);
      if (tr.x || tr.y || tr.r || tr.s || tr.sx || tr.sy) {
        const s = g("s", 1);
        el.style.transform = `${el.__skew ? "skewX(-8deg) " : ""}translate(${g("x", 0)}px,${g("y", 0)}px) rotate(${g("r", 0)}deg) scale(${s * g("sx", 1)},${s * g("sy", 1)})`;
      }
      if (tr.o) el.style.opacity = sample(tr.o, t);
      for (const p in tr) if (!TF.has(p) && p !== "o" && PROPS[p]) PROPS[p](el, sample(tr[p], t));
    }
    for (const fn of E.fns) fn(t);
    for (const S of E.scenes) S.el.style.display = (t >= S.t0 && t < S.t1) || (S.i === E.scenes.length - 1 && t >= S.t0) ? "block" : "none";
    let dx = 0, dy = 0;
    for (const s of E.shakes) {
      const u = (t - s.t) / s.dur;
      if (u >= 0 && u <= 1) { const k = (1 - u) * (1 - u); dx += s.amp * k * Math.sin(70 * (t - s.t) + s.seed); dy += s.amp * k * Math.cos(83 * (t - s.t) + s.seed * 2); }
    }
    E.world.style.transform = `translate(${dx.toFixed(2)}px,${dy.toFixed(2)}px)`;
    // brand + progress follow the scene theme
    const S = E.sceneAt(t);
    if (E.logo) {
      const dk = S && S.theme === "dark";
      E.logo.style.background = dk ? C.mint : "transparent";
      E.logo.style.padding = dk ? "8px" : "0";
      E.logo.style.width = E.logo.style.height = dk ? "128px" : "112px";
      E.logo.style.top = dk ? "62px" : "70px"; E.logo.style.right = dk ? "52px" : "60px";
      if (E.prog) { E.prog.style.background = dk ? "rgba(246,241,231,.18)" : "rgba(11,42,44,.14)"; E.progFill.style.background = dk ? C.mint : C.mintD; }
    }
  };
  E.sceneAt = t => { let r = E.scenes[0]; for (const S of E.scenes) if (t >= S.t0) r = S; return r; };

  // ---------- finish: brand, progress bar, meta ----------
  E.finish = (dur) => {
    E.dur = dur;
    E.logo = E.el(E.ui, "logo"); E.logo.innerHTML = `<img src="${E.assets.logo}" alt="">`;
    if (E.kind !== "episode") {                                                       // (an episode has no progress bar: Instagram draws its own)
      E.prog = E.el(E.ui, "prog"); E.progFill = E.el(E.prog, "", "position:absolute;inset:0;border-radius:6px;transform-origin:0 50%");
      E.K(E.progFill, "sx", [[0, 0.0001], [dur, 1, "lin"]]);
    }
    E.render(0);
  };

  // ---------- checks ----------
  E.check = () => {
    const bad = [];
    const S0 = E.scenes;
    if (E.kind === "episode") { if (E.dur < 10 || E.dur > 30) bad.push(`duration ${E.dur}s is outside 10–30s`); }
    else {
      if (S0.length !== 5) bad.push(`expected 5 scenes, found ${S0.length}`);
      if (E.dur < 35 || E.dur > 38) bad.push(`duration ${E.dur}s is outside 35–38s`);
    }
    // 1. reading time: words/3 + 0.8s on screen
    for (const h of E.texts) {
      if (!h.check) continue;
      const S = h.scene, end = h.tOut ?? (S.i === S0.length - 1 ? E.dur : S.t1 - .28);
      const need = h.words / 3 + .8, have = end - h.tIn;
      if (have + 1e-6 < need) bad.push(`READ  "${h.id}" (${h.words}w) on screen ${have.toFixed(2)}s, needs ${need.toFixed(2)}s`);
      if (h.tFull > end - .1) bad.push(`READ  "${h.id}" is never fully visible before it leaves`);
    }
    // 2. safe zone: measure every text at the moment it is fully in
    for (const h of E.texts) {
      if (!h.check) continue;
      const S = h.scene, t = Math.min(h.tFull + .1, (h.tOut ?? S.t1) - .05);
      E.render(Math.max(t, S.t0 + .01));
      let l = 1e9, r = -1e9, tp = 1e9, b = -1e9;
      for (const w of h.wordEls) { const q = w.getBoundingClientRect(); l = Math.min(l, q.left); r = Math.max(r, q.right); tp = Math.min(tp, q.top); b = Math.max(b, q.bottom); }
      if (l < SAFE.left - 6 || r > W - 200 + 6 || tp < SAFE.top - 6 || b > H - SAFE.bottom + 6)
        bad.push(`SAFE  "${h.id}" at ${t.toFixed(1)}s spans x ${Math.round(l)}–${Math.round(r)}, y ${Math.round(tp)}–${Math.round(b)}`);
      // a word that runs past its own block means it could not be laid out
      const bl = h.el.getBoundingClientRect();
      for (const w of h.wordEls) { const q = w.getBoundingClientRect(); if (q.right > bl.right + 2) { bad.push(`FIT   "${h.id}": word "${w.textContent}" overflows its block`); break; } }
    }
    // 3. sounds inside the reel
    for (const s of E.sounds) if (s.t < 0 || s.t > E.dur) bad.push(`SOUND ${s.name} at ${s.t.toFixed(2)}s is outside the reel`);
    // 4. no digits in serif type (Fraunces cannot render numerals)
    document.querySelectorAll("*").forEach(el => { const f = getComputedStyle(el).fontFamily; if (/Fraunces/.test(f) && /\d/.test(el.textContent)) bad.push(`FONT  digits in Fraunces: ${el.textContent.slice(0, 30)}`); });
    E.render(0);
    return bad;
  };
  E.meta = () => ({ kind: E.kind || "reel", sfxLufs: E.sfxLufs || -20, dur: E.dur, sounds: E.sounds.slice().sort((a, b) => a.t - b.t), clips: E.clips || [], music: E.musicSpec || null, scenes: E.scenes.map(s => ({ id: s.id, t0: s.t0, t1: s.t1, theme: s.theme })) });
  E.music = spec => { E.musicSpec = spec; };

  E.icons = {};
  return E;
})();
