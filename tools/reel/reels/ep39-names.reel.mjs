// EP.39 "Portuguese names don't fit" — clinic reception. "Full name, please." Grandma recites Maria da Conceição Fernandes da
// Silva Pereira dos Santos Costa Rodrigues de Almeida Sousa… while the form field shrinks its font, then spills out of the
// monitor, and the label printer spits a strip across the desk. Next: "And your name?" "Otto." "…Full name, please." The form
// refuses it: NAME TOO SHORT. Voiced (ElevenLabs: receptionist, grandma, Otto) with keyboard/printer effects. Paced per the guide.
export const meta = {
  id: "ep39-names", date: "2026-11-01",
  images: {
    rp: "characters/cutouts/pharmacist_polite.webp", rt: "characters/cutouts/pharmacist_tired.webp",
    dk: "characters/cutouts/dona_knowing.webp", ds: "characters/cutouts/dona_smirk.webp",
    ox: "characters/cutouts/otto-casual_excited.webp", oa: "characters/cutouts/otto-casual_awkward.webp",
  },
};

export default function (E) {
  const { C } = E;
  E.episode(-16);
  E.music({ bpm: 100, root: 62, seed: 391, prog: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]] });
  const DUR = 14.6, FLOOR = 1760;
  const S = E.scene("clinic", 0, DUR, "light"); E.cur = S;
  const at = (list, t) => { let v = list[0][1]; for (const [k, x] of list) if (t >= k) v = x; return v; };
  const FULL = .3, NAME = 1.7, PRINT = 7.35, OTTO = 8.5, YOURS = 8.9, OT = 10.15, FULL2 = 11.1, ERR = 12.0;

  // ---------------- the clinic ----------------
  E.el(S.el, "abs", "inset:0;background:#dcefe9");
  E.el(S.el, "abs", "left:0;top:1080px;width:1080px;height:40px;background:#b7dccf");
  const sign = E.el(S.el, "abs", "left:870px;top:470px;width:120px;height:120px;background:#fff;border-radius:20px;box-shadow:0 6px 14px rgba(0,0,0,.1)");
  E.el(sign, "abs", "left:45px;top:18px;width:30px;height:84px;background:#2f9e6f;border-radius:6px"); E.el(sign, "abs", "left:18px;top:45px;width:84px;height:30px;background:#2f9e6f;border-radius:6px");
  const tk = E.el(S.el, "abs", "left:90px;top:470px;width:180px;height:110px;background:#1d2b36;border-radius:14px;color:#ff5a4e;font-family:monospace;font-weight:900;font-size:64px;display:flex;align-items:center;justify-content:center", "A42");
  E.F(t => { const s = t < OTTO ? "A42" : "A43"; if (tk.textContent !== s) tk.textContent = s; });

  // ---------------- people behind the desk ----------------
  const fig = (imgs, w0, h0, sc, left, floor, z) => {
    const w = E.el(S.el, "abs", `left:${left}px;top:${floor - h0 * sc}px;width:${w0 * sc}px;height:${h0 * sc}px;z-index:${z};transform-origin:50% 100%`);
    const ims = imgs.map(([n, wd, ht]) => E.img(w, n, `position:absolute;left:${(w0 - wd) * sc / 2}px;bottom:0;width:${wd * sc}px;height:${ht * sc}px`));
    return { w, ims };
  };
  const rec = fig([["rp", 507, 1100], ["rt", 507, 1100]], 507, 1100, .95, 596, 1780, 1);
  E.F(t => { const tired = (t >= NAME + 2.6 && t < OTTO) || t >= FULL2; rec.ims[0].style.opacity = tired ? 0 : 1; rec.ims[1].style.opacity = tired ? 1 : 0; });
  const gm = fig([["dk", 665, 1014], ["ds", 665, 1014]], 665, 1014, 1.05, -70, 1830, 2);
  E.F(t => { const sm = t >= PRINT; gm.ims[0].style.opacity = sm ? 0 : 1; gm.ims[1].style.opacity = sm ? 1 : 0; });
  const gb = []; for (let t = 0; t < OTTO; t += .8) gb.push([t, 0, "io"], [t + .4, -8, "io"]);
  E.K(gm.w, "y", gb);                                                                        // frame-0 motion: she bobs, proud
  E.K(gm.w, "x", [[OTTO - .35, 0], [OTTO, -700, "in"]]);
  const ot = fig([["ox", 625, 1078], ["oa", 488, 1078]], 625, 1078, 1.0, -40, 1830, 2);
  E.F(t => { const aw = t >= ERR + .1; ot.ims[0].style.opacity = aw ? 0 : 1; ot.ims[1].style.opacity = aw ? 1 : 0; });
  E.K(ot.w, "o", [[OTTO - .01, 0], [OTTO, 1]]);
  E.K(ot.w, "x", [[OTTO, -700], [OTTO + .35, 0, "out"]]);

  // ---------------- the desk, the monitor, the printer ----------------
  E.el(S.el, "abs", "left:0;top:1500px;width:1080px;height:34px;background:#f4efe6;z-index:4;box-shadow:0 4px 0 rgba(0,0,0,.08)");
  E.el(S.el, "abs", "left:0;top:1534px;width:1080px;height:400px;background:#e7ddcc;z-index:4");
  E.el(S.el, "abs", "left:0;top:1534px;width:1080px;height:400px;background-image:repeating-linear-gradient(90deg,rgba(0,0,0,.05) 0 4px,transparent 4px 180px);z-index:4");
  E.el(S.el, "abs", "left:480px;top:1460px;width:120px;height:44px;background:#555;border-radius:6px;z-index:5");
  E.el(S.el, "abs", "left:520px;top:1430px;width:40px;height:40px;background:#666;z-index:5");
  const mon = E.el(S.el, "abs", "left:220px;top:1140px;width:640px;height:310px;background:#1d2b36;border-radius:22px;z-index:6;padding:18px;box-sizing:border-box");
  const scr = E.el(mon, "", "position:relative;width:100%;height:100%;background:#f7fbff;border-radius:10px");
  E.el(scr, "abs", "left:0;top:0;width:100%;height:56px;background:#2f6db5;border-radius:10px 10px 0 0;color:#fff;font-weight:900;font-size:30px;line-height:56px;padding-left:22px;box-sizing:border-box", "Patient registration");
  E.el(scr, "abs", `left:24px;top:84px;font-weight:800;font-size:34px;color:${C.ink}`, "Full name:");
  const fld = E.el(scr, "abs", "left:24px;top:136px;width:556px;height:96px;background:#fff;border:4px solid #2f6db5;border-radius:10px;box-sizing:border-box;display:flex;align-items:center;padding:0 14px;overflow:visible");
  const txt = E.el(fld, "", `white-space:nowrap;font-weight:800;color:${C.ink};font-size:48px;position:relative;z-index:10`, "");
  const caret = E.el(fld, "", "display:inline-block;width:4px;height:52px;background:#2f6db5;margin-left:4px");
  const err = E.el(scr, "abs", "left:40px;top:66px;width:520px;height:190px;background:#fff;border:6px solid #e5484d;border-radius:16px;box-shadow:0 10px 24px rgba(0,0,0,.25);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:12;opacity:0");
  E.el(err, "", "font-weight:900;font-size:50px;color:#e5484d", "⚠ Name too short");
  E.el(err, "", "font-weight:800;font-size:30px;color:#7a8791;margin-top:6px", "Please enter your full name");
  E.pop(err, ERR, { from: .3, dur: .3 });

  // the name, typed along with her voice (word start times from the ElevenLabs alignment)
  const W = [[.26, "Maria"], [.45, "da"], [.6, "Conceição"], [1.15, "Fernandes"], [1.71, "da"], [1.88, "Silva"], [2.28, "Pereira"], [2.76, "dos"], [2.99, "Santos"],
    [3.4, "Costa"], [3.81, "Rodrigues"], [4.35, "de"], [4.51, "Almeida"], [4.94, "Sousa…"], [5.6, ""]];
  const typed = t => {
    if (t >= OTTO) { const u = Math.max(0, Math.min(4, Math.floor((t - OT - .15) / .08))); return "Otto".slice(0, u); }
    const r = t - NAME - .1; let s = "";
    for (let i = 0; i < W.length - 1; i++) {
      const [a, w] = W[i], b = W[i + 1][0];
      if (r >= b) s += w + " "; else if (r >= a) { s += w.slice(0, Math.ceil(w.length * (r - a) / (b - a))); break; } else break;
    }
    return s.trimEnd();
  };
  E.F(t => {
    const s = typed(t); if (txt.textContent !== s) txt.textContent = s;
    let fs = 48; txt.style.fontSize = fs + "px";
    while (fs > 26 && txt.scrollWidth > 520) { fs -= 2; txt.style.fontSize = fs + "px"; }
    caret.style.opacity = (t * 2.5) % 1 < .5 ? 1 : 0;
    caret.style.display = txt.scrollWidth > 520 ? "none" : "inline-block";
    fld.style.borderColor = t >= ERR ? "#e5484d" : "#2f6db5";
  });

  E.el(S.el, "abs", "left:0;top:1700px;width:1080px;text-align:center;font-weight:900;font-size:84px;letter-spacing:.12em;color:#cdbfa6;z-index:4", "RECEÇÃO");
  // the label printer and its strip
  const pr = E.el(S.el, "abs", "left:880px;top:1400px;width:180px;height:110px;background:#eef1f4;border-radius:16px;border:6px solid #aeb8c2;z-index:5");
  E.el(pr, "abs", "left:26px;top:70px;width:116px;height:10px;background:#333;border-radius:4px");
  const strip = E.el(S.el, "abs", "left:0;top:1560px;width:0;height:92px;z-index:7;overflow:hidden;right:auto");
  const band = E.el(strip, "abs", "left:0;top:0;height:92px;background:#fff;border:3px solid #cfd6dd;border-right:none;display:flex;align-items:center;white-space:nowrap;padding:0 30px;box-sizing:border-box;box-shadow:0 6px 14px rgba(0,0,0,.15)");
  E.el(band, "", `font-weight:900;font-size:48px;color:${C.ink}`, "MARIA DA CONCEIÇÃO FERNANDES DA SILVA PEREIRA DOS SANTOS COSTA RODRIGUES DE ALMEIDA SOUSA");
  E.F(t => {
    const u = Math.max(0, Math.min(1, (t - PRINT) / 1.0)), w = u * 1060;
    strip.style.left = `${960 - w}px`; strip.style.width = `${w}px`;
    strip.style.opacity = t < OTTO - .1 ? 1 : 0;
  });

  // ---------------- bubbles ----------------
  const bubble = (html, left, top, w, tail, t0, t1, fs = 56) => {
    const b = E.el(S.el, "abs", `left:${left}px;top:${top}px;width:${w}px;z-index:8;transform-origin:${tail}px 100%`);
    const bx = E.el(b, "", `position:relative;background:#fff;border-radius:34px;padding:20px 28px 24px;box-shadow:0 10px 26px rgba(0,0,0,.18);font-weight:900;font-size:${fs}px;line-height:1.06;color:${C.ink};text-align:center`, html);
    E.el(bx, "abs", `left:${tail}px;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:6px`);
    E.pop(b, t0, { from: .3, dur: .3 }); E.K(b, "o", [[t0, 0], [t0 + .08, 1], [t1 - .12, 1], [t1, 0]]);
    return b;
  };
  bubble("Full name, please.", 520, 620, 480, 260, FULL, NAME - .05);
  bubble("And your name?", 540, 620, 460, 250, YOURS, OT - .05);
  bubble("Otto.", 80, 640, 260, 130, OT, FULL2 - .1, 64);
  bubble("…Full name, please.", 480, 620, 540, 290, FULL2, DUR - .5, 54);

  // ---------------- sound ----------------
  E.clip(FULL, "voices/ep39/r_full.wav", { vol: 1.1 });
  E.clip(NAME, "voices/ep39/g_name.wav", { vol: 1.15 });
  E.clip(NAME + .15, "sfx/keyboard.wav", { vol: .35, duck: false });
  E.clip(NAME + 3.15, "sfx/keyboard.wav", { vol: .35, duck: false, to: 2.5 });
  E.clip(PRINT, "sfx/printer.wav", { vol: .6, to: 1.3 });
  E.S(OTTO, "whoosh", .5);
  E.clip(YOURS, "voices/ep39/r_yours.wav", { vol: 1.1 });
  E.clip(OT, "voices/ep39/o_otto.wav", { vol: 1.2 });
  for (let k = 0; k < 4; k++) E.S(OT + .2 + k * .08, "tick", .5);
  E.clip(FULL2, "voices/ep39/r_full2.wav", { vol: 1.1 });
  E.clip(ERR, "sfx/phone-error.wav", { vol: .7 });

  // ---------------- title (frame 0) ----------------
  const titleBox = E.el(S.el, "abs", "left:100px;top:250px;width:800px;z-index:7");
  E.text(titleBox, "Portuguese names *don't fit*", { size: 54, lh: 1.04, instant: true, id: "hook", nowrap: true });

  E.finish(DUR);
  E.K(E.logo, "s", [[13.8, 1], [14.05, 1.18, "out"], [14.4, 1, "io"]]);
}
