// EP.36 "Ordering a coffee 'to go' in Portugal" — a local: "Um café." €0.80, gone in 4 seconds. Buck: "Hi! Can I get a large oat
// milk caramel latte, extra foam… to go?" Record scratch: the café freezes, a cup clatters, the locals stare, the silence counter
// climbs to 8 seconds. The barman hands over a tiny espresso in a plastic shot cup: "To go." Voiced (ElevenLabs: local, Buck,
// barman) with real café effects. Same café and barman as the app skit. Paced per the skit guide.
export const meta = {
  id: "ep36-togo", date: "2026-10-29",
  images: {
    locals: "characters/cutouts/locals_espresso.webp", bSmile: "characters/cutouts/barman_smile.webp", bStare: "characters/cutouts/barman_stare.webp",
    order: "characters/cutouts/buck_order.webp", tiny: "characters/cutouts/buck_tinycup.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 104, root: 58, seed: 361, prog: [[0, 4, 7], [5, 9, 12], [2, 5, 9], [7, 11, 14]] });
  const DUR = 14.6;
  const S = E.scene("cafe", 0, DUR, "light"); E.cur = S;
  const LOCAL = .5, BUCK = 2.5, ORDER = 2.75, FREEZE = 7.25, SERVE = 10.1, TOGO = 10.45, TINY = 11.2;
  const layer = (t0, t1) => { const el = E.el(S.el, "abs", "inset:0;overflow:hidden;opacity:0"); E.K(el, "o", [[t0 - .01, 0], [t0, 1], [t1 - .01, 1], [t1, 0]]); return el; };
  const tileSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#f8f5ee'/><rect x='2' y='2' width='116' height='116' rx='5' fill='none' stroke='#c9d8ea' stroke-width='3'/><g fill='#2f6db5'><circle cx='60' cy='60' r='9'/><ellipse cx='60' cy='36' rx='8' ry='15'/><ellipse cx='60' cy='84' rx='8' ry='15'/><ellipse cx='36' cy='60' rx='15' ry='8'/><ellipse cx='84' cy='60' rx='15' ry='8'/></g></svg>`;
  const cafe = (L) => {
    E.el(L, "abs", "inset:0;background:#efe0c7");
    E.el(L, "abs", `left:0;top:900px;width:1080px;height:560px;background-image:url("data:image/svg+xml;utf8,${encodeURIComponent(tileSvg)}");background-size:120px 120px`);
    const m = E.el(L, "abs", "left:700px;top:660px;width:320px;height:230px;border-radius:24px 24px 8px 8px;background:linear-gradient(180deg,#d9dde1,#9aa3ab)");
    for (let i = 0; i < 2; i++) E.el(m, "abs", `left:${70 + i * 150}px;top:150px;width:40px;height:60px;background:#444;border-radius:0 0 8px 8px`);
  };
  const counter = (L) => { E.el(L, "abs", "left:0;top:1420px;width:1080px;height:500px;background:#6a3e1e;z-index:2"); E.el(L, "abs", "left:0;top:1420px;width:1080px;height:34px;background:#a8764c;z-index:2"); };
  const img = (L, n, w, h, s, left, top, z = 1) => { const el = E.el(L, "abs", `left:${left}px;top:${top}px;width:${w * s}px;height:${h * s}px;z-index:${z};transform-origin:50% 100%`); E.img(el, n, `width:${w * s}px;height:${h * s}px`); return el; };

  // ================= 1) the local: um café, 4 seconds =================
  const A = layer(0, BUCK); cafe(A);
  img(A, "bSmile", 856, 993, .7, 520, 1440 - 993 * .7 * .92, 1);
  counter(A);
  const loc = img(A, "locals", 1024, 595, .92, -120, 1460 - 595 * .92, 3);
  const sip = []; for (let t = 0; t < BUCK; t += .8) sip.push([t, 0, "io"], [t + .4, -10, "io"]);
  E.K(loc, "y", sip);                                                              // frame-0 motion: they sip
  const cup = E.el(A, "abs", "left:760px;top:1386px;width:64px;height:40px;border-radius:0 0 18px 18px;background:#fff;border:5px solid #6b3f1d;z-index:3");
  E.K(cup, "x", [[.9, 0], [1.4, -420, "out"]]);
  E.S(.95, "swish", .6);

  // ================= 2) Buck orders =================
  const B = layer(BUCK, FREEZE); cafe(B);
  const bm = img(B, "bSmile", 856, 993, .72, 440, 1440 - 993 * .72 * .92, 1);
  counter(B);
  const bk = img(B, "order", 723, 1014, .86, -60, 1910 - 1014 * .86, 3);
  E.K(bk, "x", [[BUCK, -500], [BUCK + .3, 0, "out"]]);
  const bob = []; for (let t = BUCK; t < FREEZE; t += .5) bob.push([t, 0, "io"], [t + .25, -8, "io"]);
  E.K(bk, "y", bob);

  // ================= 3) the freeze =================
  const Cc = layer(FREEZE, SERVE); cafe(Cc);
  E.el(Cc, "abs", "inset:0;background:rgba(40,60,80,.18);z-index:1");
  counter(Cc);
  const lz = img(Cc, "locals", 1024, 595, 1.05, 0, 1470 - 595 * 1.05, 3);
  E.K(lz, "s", [[FREEZE, 1.12], [FREEZE + .3, 1, "out"]]);
  const drop = E.el(Cc, "abs", "left:600px;top:900px;width:70px;height:46px;border-radius:0 0 20px 20px;background:#fff;border:5px solid #6b3f1d;z-index:4;opacity:0");
  E.K(drop, "o", [[FREEZE + .45, 0], [FREEZE + .46, 1]]); E.K(drop, "y", [[FREEZE + .46, 0], [FREEZE + .85, 480, "in"]]); E.K(drop, "r", [[FREEZE + .46, 0], [FREEZE + .85, 160]]);
  E.clip(FREEZE + .8, "sfx/cup-drop.wav", { vol: .9 });
  E.S(FREEZE, "scratch", 1);

  // ================= 4) "to go" =================
  const D = layer(SERVE, DUR); cafe(D);
  img(D, "bStare", 856, 993, .72, 440, 1440 - 993 * .72 * .92, 1);
  counter(D);
  const bk2 = E.el(D, "abs", `left:-60px;top:${1910 - 1014 * .86}px;width:${723 * .86}px;height:${1014 * .86}px;z-index:3`);
  const b1 = E.img(bk2, "order", `position:absolute;left:0;top:0;width:${723 * .86}px;height:${1014 * .86}px`);
  const b2 = E.img(bk2, "tiny", `position:absolute;left:0;top:0;width:${723 * .86}px;height:${1014 * .86}px`);
  E.F(t => { const tn = t >= TINY; b1.style.opacity = tn ? 0 : 1; b2.style.opacity = tn ? 1 : 0; });
  E.S(TINY, "pop", .7);

  // ================= sound =================
  E.clip(0, "sfx/cafe-morning.wav", { vol: .35, duck: false });
  E.clip(2.9, "sfx/cafe-morning.wav", { vol: .35, duck: false });
  E.clip(5.8, "sfx/cafe-morning.wav", { vol: .35, duck: false, to: FREEZE - 5.8 });
  E.clip(LOCAL, "voices/ep36/local_cafe.wav", { vol: 1.1 });
  E.clip(ORDER, "voices/ep36/buck_order.wav", { vol: 1.05 });
  E.clip(TOGO, "voices/ep36/barman_togo.wav", { vol: 1.2 });
  for (let k = 1; k <= 7; k++) E.S(FREEZE + .5 + k * .33, "tick", .7);
  E.clip(TINY + .9, "sfx/cafe-morning.wav", { vol: .3, duck: false, to: DUR - TINY - 1.2 });

  // ================= text =================
  const pill = E.el(S.el, "abs", `left:100px;top:352px;display:inline-block;background:${C.ink};color:#fff;font-weight:900;font-size:52px;padding:.06em .38em .1em;border-radius:.3em;white-space:nowrap;z-index:7;opacity:0`, "");
  const P = [[1.3, "€0.80 · 4 SECONDS", "#1f7a3a"], [BUCK, "", ""], [FREEZE + .5, "SILENCE: 1s", C.coralD], [SERVE, "", ""], [TINY + .6, "€0.80 · TO GO", "#1f7a3a"]];
  E.F(t => {
    let cur = ["", ""]; for (const [k, s, c] of P) if (t >= k) cur = [s, c];
    let s = cur[0]; if (s.startsWith("SILENCE")) s = `SILENCE: ${Math.min(8, 1 + Math.floor((t - FREEZE - .5) / .33))}s`;
    if (pill.textContent !== s) pill.textContent = s; if (cur[1]) pill.style.background = cur[1];
    pill.style.opacity = s ? 1 : 0;
  });
  const bubble = (html, left, top, w, tail, t0, t1, fs = 54) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:20px 28px 24px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble(`Um café.<div style="font-size:34px;font-weight:800;opacity:.6">(an espresso)</div>`, 40, 720, 330, 90, LOCAL, BUCK - .1, 64);
  bubble("Hi! Can I get a large oat milk caramel latte, extra foam… to go?", 40, 560, 640, 200, ORDER, FREEZE - .05, 52);
  bubble("To go.", 520, 520, 300, 170, TOGO, DUR - .7, 72);

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Coffee *“to go”* in Portugal", { size: 58, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[13.8, 1], [14.05, 1.18, "out"], [14.4, 1, "io"]]);
}
