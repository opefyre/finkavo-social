# Skits: how we make them now

This guide covers the `skit` tool as it stands from **EP67 on (Sep 2026)**. The reference skits are EP67–72, and this is the only
current guide for them. Older skits (EP1–66) used an earlier formula; they are in git as history, but don't copy their style.

A skit is a short cartoon comedy reel, 19–21 s long, built in code on the kinetic reel engine. It uses a few generated images,
real sound effects and, most of the time, real voices. Its only job is **reach**: strangers on Explore watch it, send it to one
specific friend, and follow. Finkavo appears only as the logo pulse at the end and the last line of the caption.

---

## 1. The bar: 10/10 or don't make it

The owner's words: *"the last couple of videos have been not funny enough. Kinda lame even… Give me 10/10 ideas."*

**Anatomy of a skit that works** (every skit from EP67 to EP72 has this shape):

1. **One relatable premise, shown in the first second.** The title states the situation, not the joke: *Telling grandma you're
   vegetarian*, *Portuguese dads vs electricity*, *A quiet day at the beach*.
2. **Escalation, 3–5 beats, each bigger than the last.** Every beat has to top the previous one, not just add another item:
   - grandma's logic goes from "just fish" to "water is vegetable" to "the chicken… is corn" to a whole roast pig;
   - the rumour goes from "he has money" to "a spy!" to "É da máfia" to the barman saying "it's free" to the priest's blessing.
3. **A punchline that flips it**, usually the victim's deadpan last line after a beat of silence:
   *"…I'm vegetarian tomorrow."*, *"…I do Excel."*, *"…I live here now."*, *"Not THAT bread."*, *"Eleven euros. Beautiful."*
4. **A stamp and a short hold** so the punchline lands before the logo.

**What counts as lame** (it was rejected):
- A list or counter with no escalation: five similar items with the same energy.
- A joke that only works if you speak Portuguese, or that needs context the viewer doesn't have.
- Puns, and "bureaucracy is impossible" (done to death in EP1–5).
- A premise nobody has lived. The test is whether a stranger would think *"that's literally my mum"* and tag someone.

**Where the ideas come from:** universal family and everyday life, with Portugal as the warm backdrop.
- Mums, grandmas and dads.
- Food, the beach, the café, gossip.
- Tourists vs locals.
- Summer, football, electricity, voice notes.

Parody formats are strong too: a movie trailer (the heist), a rumour chain, the "offence" counter.

**Don't repeat a premise.** Before pitching, run `ls tools/reel/reels/` and read the header comments of the last ~15 skits. These
premises are taken:
- bacalhau
- beijinhos
- lunch break
- é já ali
- agosto (closed for the holidays)
- which club
- vegetarian
- the nata heist
- mum's voice note
- remote job
- the beach family
- the electricity dad

**Pitch format** (the owner says "go" to this). Give three ideas, each with:
- the premise, as the title;
- the escalation beats;
- the punchline, word for word;
- an honest score out of 10, judged on "would a stranger send this to a specific person?";
- the production call: which voices, and about how many new images.

Say which one you would make first. If an idea is below 8, replace it; don't pitch it.

## 2. Language: English first

The owner's words: *"you're building too much portuguese… the audience are also english-speakers. So, balance it. We could use
English with portuguese accent, or portuguese famous sayings, or even portuguese speaking by older people. Be careful about voices."*

- **Every character speaks English**, and Portuguese characters speak it *with a Portuguese accent*.
- **Portuguese words are seasoning**: at most **one or two lines per skit**, and only where they are the joke. That means a famous
  saying or reflex line ("Achas que eu trabalho na EDP?!", "É da máfia.", "Que Deus o proteja.", "Traz a televisão!"), spoken by
  an **older** character: grandma, the old man, the dad, the priest.
- **Every Portuguese line gets an English subtitle**: in the bubble (the `sub()` helper), and translated in the caption's first line.
- Small Portuguese words inside English lines are fine and add flavour: *filho*, *beijinhos*, *ai*.

## 3. Pace and length

The owner's words: *"not slow, not too fast… see the events… duration good, maybe 10-20% more."*

| Element | Time |
|---|---|
| Total | **19–21 s** (EP67–72 are 19.0–21.0 s) |
| Beat spacing | about 2–2.5 s per escalation beat, so each one can be seen and heard |
| A voiced bubble | on screen for its audio plus about 0.3 s; never under about 1.2 s |
| Montage items (a counter that climbs) | about 0.45–0.6 s apart, never 0.3 s |
| Punchline | the line, then the stamp about 1.5–1.8 s later, then hold until the logo pulse |
| Frame 0 | the title fully visible and something already moving (`--check` enforces it) |

## 4. Voices (ElevenLabs Eleven v3)

Most current skits are voiced, because the delivery is the joke. Use voices when the words carry the joke; use effects only when
the joke is purely visual. Credits are topped up, but keep it lean: one take per character, short lines.

| Role | Voice | How |
|---|---|---|
| Grandma (Dona Fernanda) | `xIzR6egd3S3LJZbVW0c1` | English + `[strong Portuguese accent]` on **every** line |
| Otto, the newcomer | `vBKc2FfBKJfcZNyEt1n6` | plain English |
| Mum, a Portuguese woman in her 40s–50s | `bBNhdwrIjl4fcVYiRbT2` (Marta) | English + `[Portuguese accent]` |
| Dad, barman, waiter, middle-aged Portuguese man | `aLFUti4k8YKvtQGXv0UO` (Paulo) | English + `[Portuguese accent]`; `--lang pt` for his one Portuguese line |
| Portuguese woman for a Portuguese line | `iLelOQ6m5mpSeNH8fRob` (Maria) | `--lang pt` |
| Old man (café, village) | `xwVJ1SoRe0v1T88zEwBN` (Vicente) | `--lang pt` for sayings; English + accent otherwise |
| Priest | `aG7wZ76Yxt7KzKW5iYlb` | `--lang pt`, slow and solemn |
| Buck, the American tourist | `NNl6r8mD7vthiJatiJt1` | plain English |
| Trailer or documentary narrator | `nPczCjzI2devNBz1zQrb` (Brian) | `[deep, dramatic]` |
| Teenager | `TX3LPaxmHKxFdv7VOQHJ` (Liam) | plain English |
| Zoe, the nomad | `r1KmysJdVYZjJCm4mL3b` | plain English |
| Posh British woman | `pFZP5JQG7iQjIQuC4Bku` (Lily) | plain English |
| Boss | `yl2ZDV1MzN4HbQJbMihG` | plain English |

"Be careful about voices" means:
- Portuguese characters never sound American, and Americans never get an accent tag.
- Old characters get old voices.
- Don't reuse one voice for two characters in the same skit.

Search for a missing role with `GET /v1/shared-voices` (European Portuguese: `language=pt&accent=portugal`).

**Workflow:**

1. **Write one text file per character.** Put a longer warm-up line first, then the real lines, then a filler line last. v3
   wobbles on very short text and clips the last line of a take. Tags work: `[shouting]`, `[whispers]`, `[deadpan]`,
   `[suspicious, slow]`, `[firm, short]`.
2. **Generate one take per character**, at most **3 at once** (ElevenLabs' concurrency limit). Keep takes in the session
   scratchpad, not the repo:
   `python3 tools/reel/voice/tts.py <voice_id> gran.txt $SCRATCH/gran [--lang pt]`
3. **Cut the lines:**
   `python3 tools/reel/voice/autocut.py $SCRATCH/gran '[["So... you don'"'"'t go to work", "branding/voices/epNN/g_money.wav"]]'`
   It cuts at the real speech segments. If it prints `NO SEGMENT`, or a cut swallows the next line, recut by hand with ffmpeg
   `-ss/-to` at the silence you find in the waveform envelope, with `afade` in 0.01 and out 0.05.
4. **Speed up a long line** with `atempo=1.08–1.12`; don't cut words.
5. **Check every cut on the waveform.** Nobody here can hear it, so say so in the report.

Voice files go in `branding/voices/<epNN>/`, named `<speaker letter>_<word>.wav`, e.g. `d_edp.wav`, `t_twelve.wav`.

## 5. Sound effects

- **Check what already exists first:** `ls branding/sfx/`. There are 160+ files, among them: fridge-open, switch-click, unplug,
  mail-slot, teeth-chatter, angel-choir, spoon-drop, heist-sting, coo, big-wave, dog-bark, tv-loud, restaurant,
  office, glass-clink, sizzle, canary, crowd-murmur, doorbell and more (the record scratch is synthetic: `E.S(t, "scratch")`).
- **Generate only what's missing**:
  `python3 tools/reel/voice/sfx.py <name> "<prompt, dry, no music>" <seconds ≥ 0.5>`
  It prints the level envelope; re-prompt a weak take.
- **Synthetic hits** from `tools/reel/audio.py` go under everything: `E.S(t, "pop" | "whoosh" | "thud" | "sparkle" | …, vol)`.
- **The synthetic music bed** is `E.music({ bpm, root, seed, prog })`, with a different seed for each skit.
- **Placing clips:** `E.clip(t, "voices/<ep>/x.wav" | "sfx/x.wav", { vol, from, to, gain, duck })`.
  - Voices at vol 1.1–1.3, effects at 0.3–1.5.
  - Use `duck: false` for ambience.

## 6. Images

**Reuse first.** `branding/characters/README.md` lists every cutout and prop. The main cast:
- Otto, in coat, casual, table and phone outfits;
- Dona Fernanda, with 30+ poses including dona_pig, dona_beach, dona_skeptical, dona_knowing;
- Buck (chair, towel, sardine);
- Zoe, mum, Zé the dad, the teen, the old men, the gossips, the priest, the barman and the beach family;
- the pigeon crew.

**Generating** (Higgsfield):
- Use `gpt_image_2_5`, quality `medium`: **0.5 credits** an image, at most 12 per batch, **up to 10 credits a batch without asking**.
- Always edit from a reference image or job id so the style stays identical:
  - "Keep this exact same character … same flat vector cartoon style, plain cream background. Change ONLY …";
  - "In the exact same flat vector cartoon style as this reference, a DIFFERENT character: …";
  - for props, one **sticker sheet**: "3×2 grid, lots of empty space, nothing touching, no text".
- Always add: "Exactly two arms and two hands, five fingers each. No text." Draw all text and numbers in code.
- **White clothes, white paws or white props**: generate them on mint from the start. "…a solid flat pale mint-green background
  (#bfe8d6), with no floor shadow". Cream-background versions of these always get damaged by the cutout.
- **Look at every result**, zooming in on hands and props. Redo anything off-model; 0.5 credits is cheaper than a weak reel.
- Download originals to the scratchpad. **Only cutouts and props go in the repo**; `branding/characters/expressions/` is git-ignored.
- **Use Higgsfield for richness, not just characters**: full illustrated backgrounds (`branding/characters/scenes/bg_*`, generated
  with "an empty background scene … no characters, no text"), vehicles with see-through windows (cut with `cutout_mint.py`, then
  place people behind them), and a second stage of edits from a first job id for extra poses of a new character. A shirtless or
  swimwear reference can trip the content filter ("nsfw"): retry with a clothed character as the style reference.

**Cutouts:**
- Cream background:
  - `NOCROP=1 TOLHEAD=8 HEADROWS=1 python3 tools/reel/cutout.py src.png cut.png 20-30`
  - then `python3 tools/reel/cutout_clean.py src.png cut.png out.webp [shadow_tol] [gap_min_height]`.
- Mint background: `python3 tools/reel/cutout_mint.py src.png out.webp` (flood fill plus mint-hue gap removal: clears the mint between legs and
  chair slats without eating white shirts, jackets or newspapers).
- Floor shadows: remove them by colour in the bottom few percent only.
- Sticker sheets: split per grid cell, or by **connected component** when an item crosses the cell edge (the parasol). Split two
  touching items at the column where the transparency is lowest (the pigeons).
- Check **every cutout enlarged on magenta**:
  - trapped cream between legs or in scarves: re-clean with gap_min 0;
  - speckled white clothes: regenerate on mint.
- Names: `<character>[-outfit]_<expression>.webp` in `cutouts/`, and `<set>_<item>.webp` in `props/`. Add each one to the README.

## 7. Building the reel

**Start from the closest recent skit.** Copy it and change it:

| Skit | Use it for |
|---|---|
| `ep67-vegetarian` | a table scene, grandma's escalating logic on a chalkboard, a big prop entrance |
| `ep68-heist` | a parody format (trailer title cards, reticle, narrator), a crew of props |
| `ep69-voicenote` | screen-as-stage (a phone voice note with a timer), a split panel of what's really happening, time passing on Otto |
| `ep70-remotejob` | a rumour chain across several characters, an escalating card, a location change |
| `ep71-beachfamily` | items piling up around a character with an ITEMS counter, a crowd arriving |
| `ep76-enhance` | screen-as-stage with zooms (translate + scale to a target, reticle, ENHANCE flash), a public comment typed live |
| `ep77-taxi` | split screen: the action outside (scrolling street, vehicles) on top, faces inside below |
| `ep78-diy` | a cross-section of two flats, a time-skip montage (SUNDAY → YEAR 2), a callback loop ending |
| `ep72-edp` | an "OFFENCE #n" pill counter, room lighting and a thermometer reacting, text drawn onto a prop (the framed bill) |

**The shape of the file:**
- A header comment with the full joke.
- `meta = { id, date, images }`.
- `E.episode(-16)`, `E.music(...)`, then one scene with named beat times: `const FRIDGE = .6, TWO = 4.6, …`.
- Build the set in code: the room, the furniture, the lights.
- Each character is a wrapper holding its pose images. Swap poses by opacity inside `E.F`. Hops and walks are `E.K` keyframes on
  the wrapper.
  - Never set `style.transform` from `E.F` on an element that also has `E.K` x/y keyframes.
  - Keyframes merge per property, so add hold keys.
- HUD: one counter pill at `top:352px` when there is something to count (OFFENCE #1…, ITEMS, RUMOUR, the voice-note timer).
- `bubble(html, left, top, w, tailPx, t0, t1, fontSize)` for speech, plus `sub(en)` for the subtitle under a Portuguese line.
- **One stamp** for the punchline (`E.stamp`, `E.until(st, DUR, .1)`).
- The **title** on frame 0:
  - `E.text(titleBox, "Portuguese dads vs *electricity*", { size: 48–54, instant: true, id: "hook", nowrap: true })` on a cream
    plate at `top:236px`;
  - 2–6 words, no numbering, no names.
- `E.finish(DUR)` and the logo pulse about 0.8 s before the end.

**Layout rules learned from the stills:**
- Bubbles and stamps never cover a face.
- Nobody is cut by the frame edge.
- Props don't cross heads.
- Keep chalkboard or sign text to three short lines.
- Text drawn onto a generated prop (the framed bill) is positioned from the prop's measured box inside the cutout, not by eye.

## 8. Check, look, render (on the spare Mac only)

```bash
rsync -a tools/reel/ finkavo-spare:~/social-posts-workflow/tools/reel/ --exclude out --exclude .venv
rsync -a branding/ finkavo-spare:~/social-posts-workflow/branding/
ssh finkavo-spare 'export PATH=$HOME/.local/finkavo-node/bin:$PATH; cd ~/social-posts-workflow/tools/reel &&
  node render.mjs reels/<id>.reel.mjs --check && node render.mjs reels/<id>.reel.mjs --stills 0.5,3,6,9,12,15,18,20 --sheet'
```

1. **Check.** If `--check` fails on the safe zone, make the title smaller; don't loosen the rule.
2. **Look at the stills** and check each thing in turn:
   - faces covered?
   - anyone cut off?
   - the wrong pose at the wrong moment?
   - a bubble outliving its line?
   - the punchline readable?

   Expect 2–3 rounds.
3. **Render:** `nohup ./render-all.sh <id1> <id2> <id3> > render-all.log 2>&1 &` (about 2 minutes each).
4. **Copy and inspect the video.** Copy `reel.mp4` to **`tools/reel/out/<id>/`** (git-ignored); this is the only local copy, and there
   are no Desktop folders. Pull frames from the mp4 and look at them.
5. **Measure loudness** (target −14 LUFS). If a reel is quieter than about −15.5 and the peaks allow, re-encode the audio with
   `volume=+NdB` and copy the video stream as-is.
6. **Send the mp4s for review**, with a short table: length, voices used, the joke, credits spent, fixes made, and "not checked: the
   sound by ear".

## 9. Publish (when the owner says "schedule")

- Skits post at **19:00 Lisbon**, one per evening, on the next free days after the last skit already in Buffer. Never two posts at
  the same time.
- For one skit, run `tools/reel/publish-skit.sh <id> <YYYY-MM-DD> "<short title>"`. It:
  - uploads to R2 and verifies the size;
  - schedules the post, or creates a **draft with the date and time set** when the free plan's 10 scheduled posts are full (the
    owner bumps those);
  - runs `check-post`;
  - deletes `out/<id>` on both Macs.
- For a batch, use a zsh loop that doesn't feed stdin to ssh: ``for l in "${(@f)$(cat queue.txt)}"; do …; done < /dev/null``.
  The script already uses `ssh -n`.
- **Buffer rate limit** (`RATE_LIMIT_EXCEEDED`, a 24 h window):
  - Stop at the first refusal; each failed attempt leaves an unused R2 upload.
  - Probe with `query{ account{ id } }` before retrying.
  - Retry later, or when the owner says Buffer is fine.
- Commit the reel sources, captions, new cutouts, props, sfx and voices, then push to `main`.

## 10. Caption

```
<the title as a hook, 1–2 emoji> ("<Portuguese line>" = "<English>")

Tag the <person> who <does the thing> 👇

Exaggerated for laughs. Mostly.

Ask Finkavo, every answer cites the law.

#<topic> #<topic> #<topic> #viveremportugal #Finkavo
```

Use five hashtags at most; the script refuses more. Skits claim no facts or figures; if one does, it needs a primary source.

## 11. Cost per skit

| Item | Typical amount |
|---|---|
| Images | about 2–6 Higgsfield credits (4–12 images at 0.5 each) |
| Voices | about 600–1,500 ElevenLabs characters |
| New sound effects | a few generations |
| Rendering, R2, Buffer | free |
