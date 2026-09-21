// v4 — glass.
//
// v3 was flat type on a photograph with a scrim: hard rules under the source line, a
// 3px stroked box around each date, a 5px bar. Legible, but it reads as 2019 print
// laid over a picture. This version rebuilds the surface as a small set of floating
// widgets on glass.
//
// The rules it is built to:
//   no strokes      — nothing is separated by a drawn line. Depth comes from a
//                     translucent fill, a backdrop blur, and a large soft shadow.
//   no sharp edges  — every surface is on the radius scale, and the smallest of them
//                     is 18px. Chips and the progress track are fully round.
//   widgets         — the frame is a stack of objects (a chip, a panel, tiles, a
//                     button) rather than a column of paragraphs.
//   glass           — each surface samples the photograph behind it, so the picture
//                     stays present through the copy instead of being scrimmed away.
//
// The rim is the part worth explaining. Real glass reads as glass because of a bright
// edge, but a 1px inset line is exactly the stroke this design is avoiding. So the rim
// here is a diffuse inset glow — a few pixels of light bleeding inward, no crisp edge —
// which is closer to how Apple's liquid glass behaves anyway.

export const W = 1080, H = 1920;

/**
 * Instagram's chrome. railTop is where the action rail begins: above it the right side
 * of the frame is free, which is where the brand mark sits.
 */
// left: more breathing room on the reading edge. right and bottom: brought in slightly, still clear
// of the action rail (~130px) and the caption block (~360px). edge: the brand mark sits this far from
// the page edge on its own, so widening the left padding does not drag the logo inward.
export const SAFE = { top: 250, bottom: 370, left: 100, right: 220, railTop: 820, edge: 60 };
const COL = W - SAFE.left - SAFE.right; // 760px — the only width that is really ours

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const words = (t) => String(t).trim().split(/\s+/).map(w => `<span class="w">${esc(w)}</span>`).join(" ");

function body(s) {
  switch (s.type) {
    case "dates":
      return `<div class="panel"><i class="sheen"></i>
                <h2 class="lead">${words(s.text)}</h2>
              </div>
              <div class="tiles">${s.items.map(d => `<div class="tile"><i class="sheen"></i>
                  <span class="tnum">${esc(d.day)}</span>
                  <span class="tunit">${esc(d.month)}</span>
                  <span class="tlab">${esc(d.label)}</span>
                </div>`).join("")}</div>`;
    case "figure":
      return `<div class="figwrap"><i class="sheen"></i>
                <span class="figure">${esc(s.figure)}</span>
              </div>
              <div class="panel"><i class="sheen"></i>
                <p class="sub">${words(s.text)}</p>
              </div>`;
    case "payoff":
      return `<div class="panel"><i class="sheen"></i>
                <h2 class="lead">${words(s.text)}</h2>
              </div>
              ${s.action ? `<div class="action"><i class="sheen"></i><span>${esc(s.action)}</span></div>` : ""}`;
    default:
      return `<div class="panel"><i class="sheen"></i>
                <h1 class="hook">${words(s.text)}</h1>
                ${s.sub ? `<p class="sub">${words(s.sub)}</p>` : ""}
              </div>`;
  }
}

function scene(s, i) {
  return `<section class="scene ${s.card ? "oncard" : "onphoto"}${i === 0 ? " first" : ""}" data-i="${i}">
    <div class="stack">
      ${s.kicker ? `<div class="chip"><i class="sheen"></i><span>${esc(s.kicker)}</span></div>` : ""}
      ${body(s)}
    </div>
  </section>`;
}

export function buildPage(spec, assets) {
  const HOLD = spec.holds.map(h => h * 1000);
  const total = HOLD.reduce((a, b) => a + b, 0);
  const starts = HOLD.reduce((a, h) => (a.push((a.at(-1) ?? 0) + h), a), [0]).slice(0, -1);

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
@font-face{font-family:"Fraunces";font-weight:300 900;font-display:block;src:url("${assets.frauncesExt}") format("woff2")}
@font-face{font-family:"Fraunces";font-weight:300 900;font-display:block;src:url("${assets.fraunces}") format("woff2")}
@font-face{font-family:"Noto Sans";font-weight:400 900;font-display:block;src:url("${assets.notoExt}") format("woff2")}
@font-face{font-family:"Noto Sans";font-weight:400 900;font-display:block;src:url("${assets.noto}") format("woff2")}

:root{
  /* Ground and ink */
  --deep:#06181a; --petrol:#0f2f33; --ink:#f5f8f6; --muted:rgba(245,248,246,.76);
  /* Accents. Mint carries the brand, amber marks a number, coral marks a cost. */
  --mint:#7fe0c0; --amber:#f3b072; --coral:#ff7d63;

  /* Radius scale. Nothing in this design is square-cornered. */
  --r-chip:999px; --r-sm:18px; --r-md:28px; --r-lg:40px; --r-xl:52px;

  /* Glass. The rim is a diffuse inset glow, never a 1px line. */
  --glass:linear-gradient(158deg,rgba(255,255,255,.16),rgba(255,255,255,.055) 46%,rgba(255,255,255,.09));
  --glass-soft:linear-gradient(158deg,rgba(255,255,255,.11),rgba(255,255,255,.04));
  --blur:saturate(150%) blur(30px);
  --rim:inset 0 3px 14px rgba(255,255,255,.13), inset 0 -2px 18px rgba(0,0,0,.16);
  --lift:0 28px 70px rgba(0,0,0,.46), 0 6px 18px rgba(0,0,0,.30);
  --lift-sm:0 14px 38px rgba(0,0,0,.38);
}

*{box-sizing:border-box;margin:0;border:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{background:var(--deep);color:var(--ink);font-family:"Noto Sans",Arial,sans-serif;-webkit-font-smoothing:antialiased}
.stage{position:relative;width:${W}px;height:${H}px;overflow:hidden;isolation:isolate;background:var(--deep)}

/* ---------- background ---------- */
.bg{position:absolute;inset:0;z-index:0}
.ph{position:absolute;inset:-8%;background-size:cover;background-position:center;
  filter:saturate(.78) contrast(1.06) brightness(.86);will-change:transform}
.grade{position:absolute;inset:0;background:var(--petrol);mix-blend-mode:color;opacity:.28}
/* Lighter than v3: the glass does the work of separating copy from picture now, so the
   photograph no longer has to be dimmed into a texture to keep type readable. */
.scrim{position:absolute;inset:0;background:linear-gradient(180deg,
  rgba(6,24,26,.50) 0%, rgba(6,24,26,.16) 26%, rgba(6,24,26,.34) 54%, rgba(6,24,26,.80) 100%)}
/* A slow drifting light, so the glass has something moving to refract. */
.glow{position:absolute;z-index:1;width:1200px;height:1200px;left:-260px;top:420px;pointer-events:none;
  background:radial-gradient(circle at center, rgba(127,224,192,.20), rgba(127,224,192,0) 62%);
  filter:blur(28px);will-change:transform}

.scene{position:absolute;inset:0;z-index:2;will-change:opacity}
.oncard::before{content:"";position:absolute;inset:0;background:radial-gradient(120% 78% at 70% 18%, #12403f 0%, var(--deep) 64%)}

/* ---------- the widget stack ---------- */
.stack{position:absolute;left:${SAFE.left}px;width:${COL}px;bottom:${SAFE.bottom + 100}px;
  display:flex;flex-direction:column;align-items:flex-start;gap:22px;z-index:3;
  transform-origin:left bottom;will-change:transform,opacity,filter}

/* Every surface shares this: translucent fill, blurred backdrop, soft lift, diffuse rim. */
.chip,.panel,.tile,.figwrap,.action,.cite{
  position:relative;overflow:hidden;
  background:var(--glass);-webkit-backdrop-filter:var(--blur);backdrop-filter:var(--blur);
  box-shadow:var(--rim),var(--lift)}

.chip{border-radius:var(--r-chip);padding:16px 30px 17px;box-shadow:var(--rim),var(--lift-sm)}
.chip span{font-size:29px;font-weight:900;letter-spacing:.13em;text-transform:uppercase;color:var(--mint)}

.panel{border-radius:var(--r-xl);padding:40px 44px 44px;width:100%}
.hook{font-family:"Fraunces",Georgia,serif;font-weight:900;font-size:100px;line-height:1.02;letter-spacing:-.028em}
.lead{font-family:"Fraunces",Georgia,serif;font-weight:900;font-size:76px;line-height:1.06;letter-spacing:-.022em}
.sub{font-size:41px;line-height:1.34;font-weight:640;color:var(--muted)}
.panel .hook + .sub{margin-top:26px}
/* The opening frame is the one that has to stop a thumb, and it is also the cover. Its
   headline runs a third larger than any other scene's, with the sub and chip stepped up
   to keep the proportions. Long words will not fit at this size, so build.mjs checks
   every word against the panel it sits in. */
.first .hook{font-size:132px;line-height:.98;letter-spacing:-.032em}
.first .sub{font-size:44px;line-height:1.3}
.first .chip span{font-size:31px}
.w{display:inline-block;white-space:nowrap;opacity:0;will-change:transform,opacity,filter}
/* The grid tile. Buffer refuses a thumbnail image and picks a frame by offset, so the
   cover has to be a real frame — hiding the sub with visibility rather than display
   keeps the headline exactly where it stays, so nothing jumps when the video starts. */
body.coverframe .sub{visibility:hidden}

/* The number gets its own object rather than sitting in the paragraph. */
.figwrap{border-radius:var(--r-lg);padding:26px 44px 32px;background:var(--glass-soft)}
.figure{font-family:"Noto Sans",Arial,sans-serif;font-weight:900;font-size:118px;line-height:1;letter-spacing:-.035em;color:var(--amber);display:block;font-variant-numeric:lining-nums}

.tiles{display:flex;gap:20px;width:100%}
.tile{flex:1;border-radius:var(--r-md);padding:28px 26px 26px;background:var(--glass-soft);
  opacity:0;will-change:transform,opacity}
.tile .tnum{display:block;font-family:"Noto Sans",Arial,sans-serif;font-weight:900;font-size:82px;line-height:.94;letter-spacing:-.03em;color:var(--amber);font-variant-numeric:lining-nums}
.tile .tunit{display:block;font-size:31px;font-weight:900;margin-top:6px}
.tile .tlab{display:block;font-size:23px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-top:14px}

/* Reads as a button rather than a rule with text under it. */
.action{border-radius:var(--r-chip);padding:20px 34px 22px;opacity:0;
  background:linear-gradient(158deg,rgba(127,224,192,.26),rgba(127,224,192,.11))}
.action span{font-size:34px;font-weight:800;color:var(--mint)}

/* The specular sweep that makes a surface read as glass rather than as frosted plastic. */
.sheen{position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(112deg,transparent 30%,rgba(255,255,255,.11) 46%,rgba(255,255,255,.04) 54%,transparent 70%);
  transform:translateX(-130%);will-change:transform}

/* ---------- furniture ---------- */
.top{position:absolute;z-index:6;right:${SAFE.edge}px;top:${SAFE.top}px}
.top img{width:88px;height:88px;object-fit:contain;display:block}
.mark{position:absolute;z-index:6;right:${SAFE.right + 20}px;bottom:${SAFE.bottom + 44}px;
  font-size:22px;font-weight:900;letter-spacing:.24em;opacity:.46}
.cite{position:absolute;z-index:6;left:${SAFE.left}px;bottom:${SAFE.bottom + 34}px;
  border-radius:var(--r-chip);padding:12px 24px 13px;white-space:nowrap;
  font-size:23px;font-weight:700;color:var(--muted);box-shadow:var(--rim),var(--lift-sm)}

/* Segments, not a rule: one rounded capsule per scene, each filling on its own beat. */
.bar{position:absolute;z-index:6;left:${SAFE.left}px;width:${COL}px;bottom:${SAFE.bottom + 6}px;
  display:flex;gap:8px}
.bar .seg{flex:1;height:8px;border-radius:999px;background:rgba(245,248,246,.18);overflow:hidden}
.bar .seg i{display:block;height:100%;width:0%;border-radius:999px;
  background:linear-gradient(90deg,var(--mint),var(--amber))}

.grain{position:absolute;inset:0;z-index:5;pointer-events:none;opacity:.045;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E")}
</style></head><body>
<div class="stage">
  <div class="bg">
    <div class="ph" style="background-image:url('${spec.photo}')"></div>
    <div class="grade"></div>
    <div class="scrim"></div>
  </div>
  <div class="glow"></div>
  ${spec.scenes.map(scene).join("")}
  <div class="grain"></div>
  <div class="top"><img src="${assets.logo}" alt=""></div>
  <div class="mark">FINKAVO</div>
  <div class="cite">${esc(spec.source)}</div>
  <div class="bar">${spec.holds.map(() => '<div class="seg"><i></i></div>').join("")}</div>
</div>
<script>
(function(){
  var HOLD=${JSON.stringify(HOLD)}, STARTS=${JSON.stringify(starts)}, DURATION=${total};
  var EASE="cubic-bezier(.16,1,.3,1)";
  var SPRING="cubic-bezier(.2,1.35,.4,1)";
  function at(el,f,d,dur,e){ return el?el.animate(f,{delay:d,duration:dur,easing:e||EASE,fill:"both"}):null; }

  // Each segment fills across its own scene only.
  [].forEach.call(document.querySelectorAll(".bar .seg i"),function(fill,i){
    at(fill,[{width:"0%"},{width:"100%"}],STARTS[i],HOLD[i],"linear");
  });

  at(document.querySelector(".bg .ph"),
     [{transform:"scale(1.03) translate3d(0,0,0)"},{transform:"scale(1.16) translate3d(-26px,-34px,0)"}],0,DURATION,"linear");
  // The drifting light. Slow enough to be felt rather than watched.
  at(document.querySelector(".glow"),
     [{transform:"translate3d(0,0,0)"},{transform:"translate3d(520px,-260px,0)"}],0,DURATION,"linear");

  document.querySelectorAll(".scene").forEach(function(sc,i){
    var start=STARTS[i], hold=HOLD[i], last=(i===HOLD.length-1);
    var pace=Math.max(700,hold-900);

    // One timeline per scene, and a handoff rather than a crossfade: the outgoing scene
    // is at zero before the incoming one leaves zero, so two scenes never compose.
    var kf=[], mark=function(ms,o){ kf.push({opacity:o,offset:Math.max(0,Math.min(1,ms/DURATION))}); };
    if(i===0) mark(0,1); else { mark(0,0); mark(start-50,0); mark(start+110,1); }
    mark(start+hold-180,1);
    if(!last){ mark(start+hold-60,0); mark(DURATION,0); } else mark(DURATION,1);
    for(var k=1;k<kf.length;k++) if(kf[k].offset<kf[k-1].offset) kf[k].offset=kf[k-1].offset;
    sc.animate(kf,{duration:DURATION,easing:"linear",fill:"both"});

    // Layer 1 — the whole stack settles: rises, scales up, and comes out of defocus.
    // The blur is what makes it read as liquid rather than as a sliding card.
    var stack=sc.querySelector(".stack");
    at(stack,[
      {transform:"translate3d(0,34px,0) scale(.965)",filter:"blur(9px)"},
      {transform:"translate3d(0,0,0) scale(1)",filter:"blur(0px)"}
    ],start,720);
    if(!last) at(stack,[{transform:"translate3d(0,0,0) scale(1)"},{transform:"translate3d(0,-14px,0) scale(.99)"}],start+hold-260,260,"cubic-bezier(.4,0,1,1)");

    // Layer 2 — the specular sweep across every glass surface, staggered so the light
    // travels through the stack rather than flashing all at once.
    [].forEach.call(sc.querySelectorAll(".sheen"),function(sh,n){
      at(sh,[{transform:"translateX(-130%)"},{transform:"translateX(130%)"}],start+160+n*110,860,"cubic-bezier(.32,.06,.24,1)");
    });

    // Layer 3 — the kicker chip, arriving just after the panel it labels.
    var chip=sc.querySelector(".chip");
    if(chip) at(chip,[{opacity:0,transform:"translate3d(0,10px,0) scale(.94)"},{opacity:1,transform:"none"}],start+90,420,SPRING);

    // Layer 4 — the copy, a word at a time.
    var ws=sc.querySelectorAll(".w"), lead=chip?110:0;
    var win=Math.max(300,pace*0.45-lead), per=Math.min(72,Math.max(22,win/Math.max(1,ws.length)));
    [].forEach.call(ws,function(w,n){
      at(w,[{opacity:0},{opacity:1}],start+lead+n*per,240);
      at(w,[{transform:"translate3d(0,14px,0)",filter:"blur(5px)"},{transform:"none",filter:"blur(0px)"}],start+lead+n*per,460);
    });

    // Layer 5 — the number, and the tiles, each on a spring.
    var fig=sc.querySelector(".figure");
    if(fig) at(fig,[{opacity:0,transform:"scale(.82) translate3d(0,16px,0)"},{opacity:1,transform:"none"}],start+200,620,SPRING);

    sc.querySelectorAll(".tile").forEach(function(d,n){
      at(d,[{opacity:0,transform:"translate3d(0,26px,0) scale(.95)"},{opacity:1,transform:"none"}],start+280+n*160,560,SPRING);
    });

    var act=sc.querySelector(".action");
    if(act) at(act,[{opacity:0,transform:"translate3d(0,14px,0) scale(.96)"},{opacity:1,transform:"none"}],start+Math.max(700,pace*0.5),460,SPRING);
  });

  var anims=document.getAnimations(); anims.forEach(function(a){a.pause();});
  window.__duration=DURATION;
  window.__seek=function(ms){ var t=Math.max(0,Math.min(DURATION,ms)); anims.forEach(function(a){a.currentTime=t;}); };
  window.__seek(0);
})();
</script></body></html>`;
}
