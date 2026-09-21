# Making a Finkavo reel (code-drawn, ~36 s)

A working guide. Follow it top to bottom and you get a checked, mixed, upload-ready reel in about an hour, most of it
thinking, not rendering.

**What this is.** Every reel is a small JavaScript file that describes an animation as keyframes. Playwright draws each
frame from the time alone, ffmpeg encodes them, and `audio.py` synthesises every sound from formulas (numpy), so
nothing needs licensing. No editing software, no stock footage, no AI video.

**Where it lives.** `tools/reel/`. Renders run on the **spare Mac**, not the laptop.

```
tools/reel/
  engine.js      keyframe tracks, kinetic text, wipe/shake/flash/stamp, and the checks
  icons.js       the icon set, drawn in SVG
  std.js         shared scenes: the named habit, the send-line, dial, arrow
  render.mjs     the driver: checks → frames → sound → encode
  audio.py       sound effects + music bed, from formulas
  reels/         one file per reel (start from _template.reel.mjs)
  captions/      one caption per reel, <id>.txt
  out/<id>/      renders (git-ignored)
```

---

## 0 · One-time setup on the spare Mac

```bash
ssh finkavo-spare
export PATH=$HOME/.local/finkavo-node/bin:$PATH
cd ~/social-posts-workflow && git pull
(cd tools && npm ci)                                                    # playwright + ffmpeg-static
cd tools/reel
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt      # numpy for the sound
node render.mjs reels/_template.reel.mjs --check                          # should print "0 problem(s)"
```

Playwright's Chromium is cached on the spare Mac; `ffmpeg-static` comes from `npm ci` and the fonts/logo from `branding/assets`. The Buffer scripts (`tools/buffer/`) read
`BUFFER_API_KEY` and `BUFFER_CHANNEL_ID` from `~/.config/finkavo-social/services.env`.

---

## 1 · Pick the topic (the step people skip)

The account has 160+ posts and repeats are the owner's biggest complaint. **Before writing anything:**

```bash
set -a; . ~/.config/finkavo-social/services.env; set +a
node ../buffer/list-posts.mjs | cut -c1-140          # every post; SINCE=2026-09-21 limits it to recent ones
```

Rules for a topic:

- **Tax / admin only.** Not employment law.
- **Not covered in any earlier post** — check the list above, and the Instagram grid if in doubt.
- **One idea and one exact move.** "You become a tax resident by nights, not paperwork" + "count your nights, then tell
  Finanças within 60 days". If it needs two moves, it is two reels.
- **Every number and caveat comes from a primary source.** Portal das Finanças code pages
  (`info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/...`), Ofícios-circulados, Segurança Social
  guides, gov.pt, AIMA. Blogs are only pointers to the official text.
- **If two official sources disagree, drop the topic** (a "no-debt certificate" idea died because Finanças' page says 3
  months validity and the law says 4).
- Anything you could not confirm stays out of the video. It may appear in the caption, hedged ("can bring a fine of…").
- Say "€3.000 **or more**", "**more than** 183 days" exactly as the law does. Note who the rule does *not* apply to.
- No invented Finkavo features. The only CTA is "Ask Finkavo — every answer cites the law."

Write the research down as: rule (quote ≤ 2 short sentences), the exact move, deadline, penalty, exceptions, source URLs
you actually opened.

---

## 2 · Script it as five scenes (≈ 36 s)

| # | Scene | Theme | Length | What it does |
|---|---|---|---|---|
| 1 | Hook | light | 6.6–6.8 s | The claim with its number. **Fully visible on frame 0**, something already moving. |
| 2 | The named habit | **dark** | 6.0 s | A name for the mistake, slammed in as a stamp; a one-line definition; what people say. |
| 3 | Why it happens | light | 9.5–9.8 s | A small diagram, then up to three cards. |
| 4 | The move | light | 7.8–8.0 s | The one exact action, the deadline, a check that lands with a ding. |
| 5 | Send-line + follow reason | light | 6.2–6.4 s | "Send this to …" then "Follow for …", and `@finkavo`. |

Only the habit scene is dark, so the reveal contrasts with the light scenes around it.

Copy budgets that keep the checker happy: hook ≤ 11 words; cards ≤ 11 words each at 50 px; two or three cards in scene 3;
the named habit ≤ 3 words (2–3 lines). Digits are fine everywhere: the whole reel is set in Noto Sans.

---

## 3 · Write the reel file

```bash
cd tools/reel
cp reels/_template.reel.mjs reels/my-topic.reel.mjs     # keep meta.id equal to the file name
```

Edit strings, the source comment at the top, boundaries `B`, and `E.music({ bpm, root, seed, prog })` (change these per
reel so the beds differ). Look at `cash-limit.reel.mjs` (two-piece bar diagram), `activity-closing.reel.mjs` (a three-node
flow with arrows) and `imi-works.reel.mjs` (timeline) for scene-3 ideas.

### The API you actually need

**Text markup** (`E.text`, and card/chip text): `*word*` mint pill · `*$word*` amber pill (use for numbers) ·
`*!word*` coral pill (warnings) · `|` line break. Punctuation after a pill stays attached. **Keep pills to one or two
short words; a pill never wraps.**

| Call | Does |
|---|---|
| `E.scene(id, t0, t1, "light"\|"dark")` then `E.wipe(boundary)` | a scene, and the wipe (with whoosh) between scenes |
| `E.col(scene, css)` | the 780 px content column inside the safe zone |
| `E.text(parent, str, {size, t, instant, weight, color, lh, css, id})` | words rise in one by one from `t`; `instant:true` = visible from frame 0 |
| `E.chip(parent, str, t, {instant})` | the small label at the top of a scene |
| `E.card(parent, {t, icon, iconBg, text, size, ic, from})` | slides in from the side with a swish + pop; its text starts 0.28 s after `t` |
| `E.stamp(parent, str, t, {size})` | the signature move: scale 1.9→1, tilt, thud + shake + flash |
| `E.pop(el, t)` / `E.show(el, t, {dy, out})` | pop with a bounce / slide up and fade |
| `E.K(el, prop, [[t, value, ease], ...])` | raw keyframes. Props `o x y s sx sy r w h draw blur`. The ease belongs to the segment **ending** at that key: `lin out in io back elastic step` |
| `E.count(el, t0, t1, a, b, {fmt, ticks})` | integer counter with tick sounds; `E.std.money(n)` formats `18750` → `18.750` |
| `E.F(t => …)` | any per-frame effect. **Must be a pure function of `t`** (no random, no state) |
| `E.std.dial(parent, size, {from, to, t0, t1, label})` | ring + number that counts up or down |
| `E.std.arrow(parent, w, color, t)` | an arrow that draws itself on |
| `E.dots(parent, {n, cols, size, gap, t0, t1})` | a grid of dots that fill in |
| `E.std.habit(scene, t0, {name, size, def, quote, qsize, decor, after})` | the whole dark scene |
| `E.std.send(scene, t0, {send, follow, icon})` | the whole last scene |
| `E.S(t, "ding", vol)` | register a sound at time `t`. Sounds: `whoosh swish pop thud slam ding tick sparkle nope riser` |
| `E.shake(t, amp)` `E.flash(t)` | impact effects |
| `E.blobs(scene, [...])` | slow drifting shapes, so no frame is ever static |

Icons (`E.icons.name(size, colors?)`): moon calendar house check cross ban banknote coin car bank transfer doc receipt
hammer tag chart lock clock shield pin. Add new ones in `icons.js` as filled rounded shapes on a 100×100 box.

Rules the design depends on:

- Never put white icons on a white tile (invisible). Use a tinted `iconBg`, or give standalone icons `className = "sh"`
  for a soft shadow.
- Centre labels away from markers they would collide with; put labels *inside* bars when you can.
- Long stamp text breaks at hyphens ("Year-End") — rename instead ("The December Check").
- The first frame is the cover (Buffer takes the thumbnail at 0.4 s): the hook must read as a complete post on its own.

---

## 4 · Check, look, fix (repeat)

```bash
node render.mjs reels/my-topic.reel.mjs --check                                  # seconds; no rendering
node render.mjs reels/my-topic.reel.mjs --stills 0,5.5,8.6,11.5,16,20,24.5,28,32,35.5 --sheet
# → out/my-topic/sheet.png  (copy it to the laptop and open it: scp finkavo-spare:...)
```

The checker fails the build (exit 1) on:

| Message | Meaning | Fix |
|---|---|---|
| `READ "…" (Nw) on screen X s, needs Y s` | every text must stay on screen ≥ words ÷ 3 + 0.8 s (and cards start their text 0.28 s late; the wipe eats the last 0.28 s) | start it earlier, cut words, or lengthen the scene. **Cut copy before loosening timing.** |
| `SAFE … spans x…, y…` | text outside x 100–880, y 250–1550 (Instagram's UI covers the rest) | shorter text or smaller `size` |
| `FIT … overflows its block` | a word or pill wider than its column | shorten the pill; pills don't wrap |
| `FRAME0 …` | hook not visible on frame 0, or nothing moves in the first 0.5 s | `instant: true` on the hook; add a counter/dial/bobbing icon |
| `duration … outside 35–38s` / `expected 5 scenes` | structure | fix `B` / scenes |
| `SOUND … outside the reel` | an `E.S` past the end | move it |

Then **read the stills**. The checker cannot see ugly: overlaps, a dull diagram, a wrapped label. Look at the frame during
the stamp slam and during each wipe as well.

---

## 5 · Render, then verify the real file

```bash
node render.mjs reels/my-topic.reel.mjs           # about 2 minutes: 4 workers, ~1,100 frames
```

Outputs in `out/my-topic/`: `reel.mp4` (mixed, −14 LUFS), `reel-sfx-only.mp4` (effects only, for adding a trending
track in the Instagram app), plus `mix.wav`, `sfx.wav`, `music.wav`, `meta.json`.

The renderer already asserts the audio track is as long as the video (loudnorm outputs 192 kHz and silently halves the
track unless it is pinned back to 44.1 kHz; that is handled). Still do these by hand on the finished mp4:

```bash
F=$(node -e 'import("ffmpeg-static").then(m=>console.log(m.default))')
$F -hide_banner -i out/my-topic/reel.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+I:"      # ≈ -14 LUFS
for t in 0.4 7.6 19 27 33.8; do $F -y -loglevel error -ss $t -i out/my-topic/reel.mp4 -frames:v 1 v-$t.png; done
```

Open the frames from the **mp4**, not the stills: they are what people will see.

---

## 6 · Caption

One file per reel, `captions/<id>.txt`, in this shape (see the existing ones):

```
<hook sentence, with the number>

<What the rule says, as short bullets with "·">

<Penalty / exceptions / who it does not apply to>

What to do: <the one move>

Source: <articles and pages actually opened>.

<Topic question>? Ask Finkavo — every answer cites the law.

#topic1 #topic2 #financas #viveremportugal #Finkavo
```

**Maximum 5 hashtags**: three topic tags + `#viveremportugal` + `#Finkavo`. `create-reel-draft.mjs` refuses more.

---

## 7 · Publish (drafts only)

Reels go out at **09:00 Lisbon**, carousels at **18:00**. Never two posts at the same time. List the
target days first, and leave posts as drafts: the owner moves them to scheduled.

```bash
# 1. copy the mp4 to a machine with wrangler auth (the finkavo repo on the laptop) and upload
U=$(uuidgen | tr A-Z a-z); K=social/reels/2026/09/21/$U/reel.mp4
cd ~/Desktop/Personal/Projects/finance/finkavo
npx wrangler r2 object put finkavo-social/$K --file /path/to/reel.mp4 --content-type video/mp4 --remote
curl -sI -H "Range: bytes=0-1" https://social-media.finkavo.com/$K | head -1      # expect 206, and matching content-length

# 2. create the Buffer draft (on the spare Mac, env loaded)
node ../buffer/create-reel-draft.mjs https://social-media.finkavo.com/$K captions/my-topic.txt 2026-09-23@09:00 "Short title"

# 3. verify
node ../buffer/check-post.mjs <postId>      # draft · due time · VideoAsset · tags=5
node ../buffer/list-posts.mjs               # no two posts share a time
```

Only touch R2 to add the object. Full details for the Buffer scripts: `tools/buffer/README.md`. Do not touch the app's D1 corpus.

---

## 8 · Before you say it is done

- [ ] Topic absent from every earlier post; numbers traceable to an opened primary source.
- [ ] `--check` prints `0 problem(s)`.
- [ ] Stills read cleanly at phone size; no overlap, no orphan word, no invisible icon.
- [ ] Frames taken from the final mp4 look right; loudness ≈ −14 LUFS; audio length = video length.
- [ ] Caption: 5 hashtags, source line, hedged where unverified, no invented features.
- [ ] Draft in Buffer at the right time slot; `check-post` shows a video asset; no time collisions.
- [ ] Tell the owner what is a draft, and that they need to schedule it.

## Gotchas

- The spare Mac's shell is bash 3.2: no `declare -A`. Put anything with awkward quoting in a script file, not inline over ssh.
- Fraunces cannot render numerals (3 reads as 5). The engine uses Noto Sans throughout; `--check` fails if Fraunces ever holds a digit.
- A re-render of the same file gives bit-identical audio and visually identical video (measured PSNR 74 dB against the published reel), though not a byte-identical mp4. Re-rendering after a small edit is safe.
- `--force` renders despite failed checks. Use it only to look at a problem, never to publish.
