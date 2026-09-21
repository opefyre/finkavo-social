// icons.js — a small icon set drawn in code. Filled, rounded shapes on a 100x100 box.
(() => {
  const C = E.C;
  const d = (o = {}) => ({ ink: C.ink, a: C.mint, b: C.amber, c: C.coral, w: "#ffffff", g: C.mintD, ...o });
  const wrap = (s, inner) => `<svg viewBox="0 0 100 100" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  E.icons = {
    moon: (s, o) => { o = d(o); return wrap(s, `<defs><mask id="mmk"><rect width="100" height="100" fill="#fff"/><circle cx="68" cy="36" r="31" fill="#000"/></mask></defs>
      <circle cx="46" cy="55" r="37" fill="${o.b}" mask="url(#mmk)"/><circle cx="78" cy="70" r="5" fill="${o.b}"/><circle cx="86" cy="52" r="3.5" fill="${o.b}"/>`); },
    calendar: (s, o) => { o = d(o); return wrap(s, `<rect x="10" y="18" width="80" height="72" rx="16" fill="${o.w}"/>
      <path d="M10 46 V34 a16 16 0 0 1 16 -16 H74 a16 16 0 0 1 16 16 V46 Z" fill="${o.b}"/>
      <rect x="28" y="8" width="10" height="22" rx="5" fill="${o.ink}"/><rect x="62" y="8" width="10" height="22" rx="5" fill="${o.ink}"/>
      ${[0, 1, 2].map(i => `<circle cx="${28 + i * 22}" cy="61" r="5" fill="${o.ink}" opacity=".85"/>`).join("")}${[0, 1, 2].map(i => `<circle cx="${28 + i * 22}" cy="77" r="5" fill="${o.ink}" opacity=".35"/>`).join("")}`); },
    house: (s, o) => { o = d(o); return wrap(s, `<rect x="20" y="44" width="60" height="44" rx="9" fill="${o.a}"/>
      <path d="M12 50 L50 16 L88 50 Z" fill="${o.b}" stroke="${o.b}" stroke-width="8" stroke-linejoin="round"/>
      <rect x="41" y="60" width="18" height="28" rx="6" fill="${o.ink}"/><rect x="26" y="54" width="11" height="11" rx="3" fill="${o.w}"/><rect x="63" y="54" width="11" height="11" rx="3" fill="${o.w}"/>`); },
    check: (s, o) => { o = d(o); return wrap(s, `<circle cx="50" cy="50" r="40" fill="${o.g}"/><path d="M30 52 L44 66 L71 35" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`); },
    cross: (s, o) => { o = d(o); return wrap(s, `<circle cx="50" cy="50" r="40" fill="${o.c}"/><path d="M33 33 L67 67 M67 33 L33 67" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round"/>`); },
    ban: (s, o) => { o = d(o); return wrap(s, `<circle cx="50" cy="50" r="38" fill="none" stroke="${o.c}" stroke-width="13"/><path d="M24 24 L76 76" stroke="${o.c}" stroke-width="13" stroke-linecap="round"/>`); },
    banknote: (s, o) => { o = d(o); return wrap(s, `<rect x="6" y="24" width="88" height="54" rx="12" fill="${o.g}"/><circle cx="50" cy="51" r="15" fill="${o.a}"/><circle cx="21" cy="51" r="5" fill="${o.a}" opacity=".7"/><circle cx="79" cy="51" r="5" fill="${o.a}" opacity=".7"/>
      <text x="50" y="59" text-anchor="middle" font-family="Noto Sans" font-weight="900" font-size="22" fill="${o.ink}">€</text>`); },
    coin: (s, o) => { o = d(o); return wrap(s, `<circle cx="50" cy="50" r="40" fill="${o.b}"/><circle cx="50" cy="50" r="30" fill="none" stroke="#d9812f" stroke-width="5"/>
      <text x="50" y="64" text-anchor="middle" font-family="Noto Sans" font-weight="900" font-size="42" fill="#b4621b">€</text>`); },
    car: (s, o) => { o = d(o); return wrap(s, `<path d="M8 62 Q8 54 16 50 L26 32 Q29 26 36 26 H64 Q71 26 74 32 L84 50 Q92 54 92 62 V72 H8 Z" fill="${o.c}"/>
      <path d="M32 34 H50 V48 H26 Z M56 34 H66 L76 48 H56 Z" fill="#fff" opacity=".9"/><circle cx="28" cy="72" r="11" fill="${o.ink}"/><circle cx="72" cy="72" r="11" fill="${o.ink}"/><circle cx="28" cy="72" r="4.5" fill="#fff"/><circle cx="72" cy="72" r="4.5" fill="#fff"/>`); },
    bank: (s, o) => { o = d(o); return wrap(s, `<path d="M8 38 L50 12 L92 38 Z" fill="${o.b}" stroke="${o.b}" stroke-width="6" stroke-linejoin="round"/>
      ${[0, 1, 2, 3].map(i => `<rect x="${16 + i * 20}" y="44" width="12" height="32" rx="4" fill="${o.w}"/>`).join("")}<rect x="8" y="80" width="84" height="10" rx="5" fill="${o.w}"/>`); },
    transfer: (s, o) => { o = d(o); return wrap(s, `<path d="M14 36 H74 M60 20 L78 36 L60 52" fill="none" stroke="${o.g}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M86 68 H26 M40 52 L22 68 L40 84" fill="none" stroke="${o.b}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`); },
    doc: (s, o) => { o = d(o); return wrap(s, `<rect x="20" y="8" width="60" height="84" rx="12" fill="${o.w}"/><path d="M62 8 H68 a12 12 0 0 1 12 12 V26 H62 Z" fill="${o.a}"/>
      <rect x="31" y="38" width="38" height="7" rx="3.5" fill="${o.ink}" opacity=".8"/><rect x="31" y="53" width="38" height="7" rx="3.5" fill="${o.ink}" opacity=".45"/><rect x="31" y="68" width="24" height="7" rx="3.5" fill="${o.ink}" opacity=".45"/>`); },
    receipt: (s, o) => { o = d(o); return wrap(s, `<path d="M22 10 H78 V90 L70 83 L62 90 L54 83 L46 90 L38 83 L30 90 L22 83 Z" fill="${o.w}" stroke="${o.w}" stroke-width="6" stroke-linejoin="round"/>
      <rect x="32" y="26" width="36" height="7" rx="3.5" fill="${o.ink}" opacity=".8"/><rect x="32" y="42" width="36" height="7" rx="3.5" fill="${o.ink}" opacity=".45"/><rect x="32" y="58" width="22" height="7" rx="3.5" fill="${o.ink}" opacity=".45"/><rect x="58" y="58" width="10" height="7" rx="3.5" fill="${o.g}"/>`); },
    hammer: (s, o) => { o = d(o); return wrap(s, `<g transform="rotate(38 50 50)"><rect x="43" y="34" width="14" height="60" rx="7" fill="${o.b}"/><rect x="18" y="14" width="64" height="26" rx="10" fill="${o.ink}"/><rect x="18" y="14" width="18" height="26" rx="9" fill="${o.g}"/></g>`); },
    tag: (s, o) => { o = d(o); return wrap(s, `<path d="M16 48 L48 16 H84 V52 L52 84 Z" fill="${o.b}" stroke="${o.b}" stroke-width="10" stroke-linejoin="round"/><circle cx="68" cy="32" r="7" fill="${o.w}"/>`); },
    chart: (s, o) => { o = d(o); return wrap(s, `<rect x="12" y="56" width="20" height="32" rx="7" fill="${o.a}"/><rect x="40" y="36" width="20" height="52" rx="7" fill="${o.g}"/><rect x="68" y="14" width="20" height="74" rx="7" fill="${o.b}"/>`); },
    lock: (s, o) => { o = d(o); return wrap(s, `<path d="M32 46 V34 a18 18 0 0 1 36 0 V46" fill="none" stroke="${o.ink}" stroke-width="11" stroke-linecap="round"/><rect x="18" y="44" width="64" height="46" rx="14" fill="${o.b}"/><circle cx="50" cy="63" r="6" fill="${o.ink}"/><rect x="47" y="63" width="6" height="14" rx="3" fill="${o.ink}"/>`); },
    clock: (s, o) => { o = d(o); return wrap(s, `<circle cx="50" cy="50" r="40" fill="${o.w}"/><rect class="hand" x="46.5" y="20" width="7" height="34" rx="3.5" fill="${o.ink}" style="transform-origin:50% 100%;transform-box:fill-box"/><rect x="48" y="46" width="24" height="7" rx="3.5" fill="${o.c}"/><circle cx="50" cy="50" r="6" fill="${o.ink}"/>`); },
    shield: (s, o) => { o = d(o); return wrap(s, `<path d="M50 8 L86 22 V48 C86 70 70 86 50 94 C30 86 14 70 14 48 V22 Z" fill="${o.g}"/><path d="M33 50 L45 62 L68 36" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`); },
    pin: (s, o) => { o = d(o); return wrap(s, `<path d="M50 92 C50 92 20 60 20 38 a30 30 0 0 1 60 0 C80 60 50 92 50 92 Z" fill="${o.c}"/><circle cx="50" cy="38" r="12" fill="#fff"/>`); },
  };
})();
