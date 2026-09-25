# Character skits — funny reels for growth

The `skit` tool. Short cartoon comedy reels (12–16 s) starring a fixed cast, made in code on the kinetic reel engine, with a few
cheap generated images, real sound effects and, when the joke needs it, real voices. Their only job is **reach**: strangers on
Explore watch them, send them to a friend, and follow. Finkavo appears only as the logo pulse at the end and the last line of the
caption. Tax reels (`reel`) and carousels are a different tool with different rules.

Built since 24 Sep 2026: `tools/reel/reels/ep1-nif … ep30-derby`. Each has its caption in `tools/reel/captions/<id>.txt`.

---

## 1. What makes a skit worth making

- **A joke everyone already has.** Family (the grandma who overfeeds, the endless goodbye, "take a jacket"), everyday life
  (parking, the pharmacy queue, tech support for parents), travel (Lisbon hills, the Atlantic in October), food, football.
  Portugal is the **warm backdrop**, never the problem. Do not fall back on "bureaucracy is impossible": it was done to death in
  ep1–ep5 and the owner stopped it.
- **Stands alone.** A stranger with zero context gets it in the first second: a one-line title on frame 0 (2–5 words,
  `nowrap`), no series numbering, no "follow X", no character names on screen.
- **Three escalating beats and a twist.** Refusal ×3 → montage → twist → a short punchline hold. The twist is what gets sent.
- **Rotate topic and format.** Before pitching, list the last ~10 skits and avoid repeating either. Topics: family, food, travel,
  weather/beach, sport, housing, tech, shops, festivals, neighbours. Formats: situation skit, split screen (tourist vs resident),
  screen-as-stage (video call, group chat, phone), tier list / ranking (comment bait), Instagram vs reality, a counter that climbs
  (MOVES 37, KISSES 24, PLATE 14, SLICES 8→0).
- **Judge honestly before pitching.** Score each idea out of 10 ("would a stranger send this to a specific person?"). Pitch only
  ideas you would back; say which one you would make first and why.

**Pitch format** (what the owner says "go" to): three ideas, each with the joke in 2–3 lines, the twist, and the production call —
*voiced or effects only*, and *about N new images*. Keep it short.

## 2. Pace (the owner's standing rule)

Not slow, not too fast: the viewer must **see** every event, then move on.

| Element | Time |
|---|---|
| Total | 12–16 s (10–20 % longer than the early 10–13 s reels) |
| A dialogue bubble | ≥ 1.0–1.4 s; long lines longer; a voiced line stays up for its audio + ~0.3 s |
| Montage items | ~0.45–0.6 s apart (never 0.3 s) |
| Punchline | held ~1.5–2 s before the logo pulse |
| Frame 0 | title fully visible and something already moving (the `--check` enforces it) |

## 3. Cast and library — reuse first

`branding/characters/README.md` is the catalogue: the nine base characters, every expression/pose, props and full-bleed scenes,
with their cutouts in `branding/characters/cutouts/` and `branding/characters/props/`. Reuse is the default; generate only what the
story cannot be told without. Main cast: **Otto** (the newcomer, green beanie; outfits: coat, casual sweater, table, sofa,
summer, phone), **Dona Fernanda** (the grandma, ~30 poses), **Buck** (tourist), **Zoe** (nomad), **Sr. Renda** (landlord),
**Sr. Carimbo** (clerk/waiter/pharmacist), **Leo, Marta, Nico** (friends, queue, cameos).

### Generating images (Higgsfield)

- Model `gpt_image_2_5`, quality `medium`, **0.5 credits** each (`get_cost: true` first when in doubt). Batch with
  `generate_image_batch`, poll with `jobs_wait`. **Up to 10 credits per batch without asking the owner**; above that, ask.
- Always edit from a reference so the style stays identical: upload a base image with `media_upload` (PUT the bytes with curl,
  then `media_confirm`), or pass a previous **job id** as `image_references`.
  - New pose/outfit: "Keep this exact same character (same face, …, same flat vector cartoon style, plain cream background). Change ONLY …"
  - New expression of an existing pose: "Redraw this exact same character, same pose, same framing, same size and position on the canvas … Change ONLY his face: …"
  - Props: one **sticker sheet** (3×2 or 4×2 grid, "lots of empty space between them, nothing touching, no text"), then split.
  - New side characters: "In the exact same flat vector cartoon style as this reference, a DIFFERENT character: …"
- Always say "Exactly two arms and two hands, five fingers each. No text." Never let the AI draw text or numbers; draw them in code.
- **Look at every result** (a contact strip, then zoom on hands and props). Faults seen: extra/merged arms, floating props,
  a character drawn off-model (compare against the base image), a pose too timid for the joke (the first "stuffed" Otto). Redo
  those — 0.5 credits is cheaper than a weak reel.
- A complex composed shot (Otto carrying a food tower) is better **generated whole** in 2–3 stages than assembled from props.

### Cutouts — the step that bites

`tools/reel/cutout.py` flood-fills the cream background. Then check **every cutout enlarged on magenta** before use.

| Problem | Fix |
|---|---|
| Pale face/beard/plastic flooded away | `TOLHEAD=14 HEADROWS=.55` (or `.8`–`1` for white clothes); `NOCROP=1` |
| White socks, sneakers, bags, paper cups vanish | strict tolerance `TOLHEAD=7 HEADROWS=1`, then remove the floor shadow only by exact colour and only in the bottom ~8 % |
| Cream trapped between legs / chair gaps | label connected regions within ~5 of the source background colour (from pixel [5,5]) below mid-height, drop regions > ~300 px; **never grow** into white areas (it ate white shirts, cups and album pages) |
| Strict cutout leaves floor shadows and cream gaps (chair slats, between legs) | `NOCROP=1 TOLHEAD=10 HEADROWS=1 cutout.py src cut 30`, then `tools/reel/cutout_clean.py src cut out` (shadow by exact colour, enclosed gaps d<5); a cream item mid-body (napkin) → gap_min_height `.62`; a prop the colour of the background (fresh cheese) → fill each row between its outline |
| White clothes/shoes still merge with the cream background | regenerate the same image (0.5 credits) with "Change ONLY the background: a solid flat pale mint-green background (#bfe8d6), with no floor shadow", then `cutout.py` with tolerance 40 (the American, EP37) |
| Floor-shadow ellipse under feet/props | low-saturation pale pixels in the bottom 7–10 %; for props, bottom 40 % |
| Expressions must line up | **joint-crop** every image of one pose set to the union bounding box (same canvas = frame-perfect swaps). Adding to a set later: re-crop with the same box, or keep the set's existing box so older reels don't shift |

Cutout names: `<character>-<outfit>_<expression>.webp` (e.g. `otto-coat_phone`, `dona_pizza`); props in `props/`. Add every new
file to `branding/characters/README.md`.

## 4. Sound — choose per skit

The owner's rule: **choose the most optimised approach per video.** Not every skit needs a voice.

- **Effects only** when the joke is visual (parking, the Atlantic, the pastry ranking, the pizza thief): bubbles carry the words.
- **Voiced** when the joke *is* the words or their delivery (grandma's pharmacy chatter, "WHAT?! I can't hear ANYTHING!",
  the landlord's pitch, the football commentator).
- Every skit: the synthetic effects in `tools/reel/audio.py` (`pop`, `swish`, `thud`, `slam`, `ding`, `sparkle`, `nope`, `scratch`,
  `poof`, `riser`, `splat`, `crack`, `smack`, `buzz`, `cluck`, `creak`, …) plus a music bed (`E.music`).

**Real effects** (ElevenLabs sound generation, reused across skits) live in `branding/sfx/`: doorbell, plastic squeak/rip,
cicadas, crowd murmur/ooh/applause, car rev/bump, tram, pigeon, panting, footsteps, wind, club bass, call join/drop, waves, splash,
ice, café crowd, stadium goal, tier drop, … Check the folder before generating:
`python3 tools/reel/voice/sfx.py <name> "<prompt, dry, no music>" <seconds>` (prints the level envelope — re-prompt a weak take).

**Voices** (ElevenLabs Eleven v3): `tools/reel/voice/tts.py` then `tools/reel/voice/cut.py`, WAVs into `branding/voices/<id>/`.
- One take per character: a longer warm-up line first, the real lines, a filler line last (v3 wobbles on short text and clips the
  final line). Tags work: `[strong Portuguese accent]`, `[shouting]`, `[whispers]`, `[crying]`, `[deadpan]`.
- Voices in use: grandma `xIzR6egd3S3LJZbVW0c1` (+ `[strong Portuguese accent]`), Otto `vBKc2FfBKJfcZNyEt1n6`, Zoe
  `r1KmysJdVYZjJCm4mL3b`, landlord `aG7wZ76Yxt7KzKW5iYlb`, pharmacist/waiter `pgoedMoL7SCrpaX44PjD`, boss `yl2ZDV1MzN4HbQJbMihG`,
  young Portuguese woman `bBNhdwrIjl4fcVYiRbT2`; European-Portuguese TV/commentator `aLFUti4k8YKvtQGXv0UO` (Paulo, `--lang pt`)
  and `iLelOQ6m5mpSeNH8fRob` (Maria). Search more with `GET /v1/shared-voices`.
- The key (`finance/secrets/elevenlabs-api.txt`) is restricted: no speech-to-text, max `mp3_44100_128`. Nobody here can listen,
  so **verify every cut on the waveform envelope**; the alignment can be ~1 s off on excited lines — recut by hand at the silence
  boundaries when a word is clipped. Speed a long line with `atempo=1.08` rather than cutting words.
- The owner judges how it sounds; say so in every report.

In the reel: `E.clip(t, "voices/<id>/x.wav" | "sfx/x.wav", { vol, from, to, gain: [[t, g], …], duck })` — mixed into both mp4s;
`gain` is a volume curve in reel time (the TV that follows its volume bar), `duck: false` for ambience and deliberately buried lines.
`E.music({ off: true })` drops the synthetic music bed when a recorded clip is the music (the fado reel).

## 5. Building the reel

Start from a recent skit of the same kind (they are the templates): `ep6-lunch` (table + escalating dishes), `ep13-checkout`
(panning queue), `ep18-tv` (voice + gain curve), `ep19-sofa` (voice + real effects), `ep22-parking` (effects-only crowd),
`ep25-nomad` (Instagram vs reality + call window), `ep29-pastries` (tier list), `ep30-derby` (TV + crowd + voices).

- `E.episode(-16)`, one scene, `meta.images` for the cutouts, `E.img` inside a wrapper per character; swap faces by opacity in an
  `E.F` with an `at([[t, name], …])` timeline; hops/sways as keyframes; never set `style.transform` from `E.F` on an element that
  also has `E.K` x/y keyframes (it overwrites them — put the per-frame transform on an inner element).
- Speech bubbles: the local `bubble(html, left, top, w, tail, t0, t1)` helper (tail offset in px so it points at the speaker).
  Keep bubbles and stamps **off faces**; for a Portuguese line, a small English subtitle inside the bubble.
- One title (frame 0, `nowrap`, ≤ ~800 px wide → size 50–66), one counter pill at `top:352px` when there is something to count,
  one stamp for the punchline, the logo pulse at the end. Draw rooms, props, screens and all text in code.
- Ids: `ep<NN>-<slug>`; `meta.date` = the planned post date.

## 6. Procedure (`skit`, `skit 3`)

1. **Pitch** three varied ideas (§1) with the production call. Wait for "go".
2. **Images**: list what the library lacks → one batch (≤ 10 credits) → look → cutouts → magenta check → joint-crop → README.
3. **Sound**: reuse `branding/sfx/`; generate missing effects; voices only if the skit is voiced → cut → envelope check.
4. **Write** `tools/reel/reels/<id>.reel.mjs` and `captions/<id>.txt`.
5. **Check and look** on the spare Mac:
   ```bash
   rsync -a tools/reel/ finkavo-spare:~/social-posts-workflow/tools/reel/ --exclude out --exclude .venv
   rsync -a branding/ finkavo-spare:~/social-posts-workflow/branding/
   ssh finkavo-spare 'export PATH=$HOME/.local/finkavo-node/bin:$PATH; cd ~/social-posts-workflow/tools/reel &&
     node render.mjs reels/<id>.reel.mjs --check && node render.mjs reels/<id>.reel.mjs --stills 0.5,2,4,6,8,10,12,14'
   ```
   Pull the stills into one strip and **look**: faces covered, characters too small or cut by the frame edge, props floating,
   overlaps, wrong character at the wrong moment. Fix and repeat. Expect 2–3 rounds.
6. **Render** (`nohup ./render-all.sh <ids> > render-all.log 2>&1 &`), copy `reel.mp4` + `reel-sfx-only.mp4` into
   `tools/reel/out/<id>/`, pull 7–9 frames **from the mp4**, measure loudness (≈ −14 LUFS), then send the with-music mp4 to the
   owner with a short table: length, sound approach, the joke, credits spent, fixes made, "not checked: the sound by ear".
7. **Publish when the owner says "schedule"** — posts go out at **19:00 Lisbon**, one per day, the next free evenings:
   `tools/reel/publish-skit.sh <id> <YYYY-MM-DD> "<short title>"` uploads to R2 (verified), schedules the post, or — if Buffer's
   free plan is full (10 scheduled posts) — creates a **draft with the date and time set** for the owner to bump, checks it, and
   deletes the local and spare-Mac media.
8. **Commit** the reel sources, captions, new images, props, sfx and voices, and push to `main`.

## 7. Caption

```
<one-line hook, 1–2 emoji>

Tag the <person> who <does the thing> 👇

Exaggerated for laughs. Mostly.

Ask Finkavo, every answer cites the law.

#<topic> #<topic> #<topic> #viveremportugal #Finkavo
```

Five hashtags maximum (the scripts refuse more). No facts or figures are claimed in skits; if one is, it needs a primary source
like any tax reel.

## 8. Cost (for the owner's question "how much per video")

About 1.5–5 Higgsfield credits of images per skit (falling as the library grows), 0–1,500 ElevenLabs characters for voices,
a few ElevenLabs sound generations; rendering (spare Mac), sound synthesis, R2 and Buffer are free.
