# carousel

Hand-written carousels, one spec file per batch. A spec is a list of carousels; each has a list of slides and a caption.
There are two designs, and **new batches use v2**.

| | v2 (current) | v1 (batches 1–3, kept so they still build) |
|---|---|---|
| Look | flat, drawn in code, the reels' language: dark cover and end card, cream content slides, pills, icon tiles | AI stock photo behind glass panels, serif headlines |
| Fonts | Noto Sans only, so numbers can never be misprinted | Fraunces headlines (its "3" reads as a "5") + Noto Sans |
| Needs | nothing: no photo, icons come from `../reel/icons.js` | a photo from `img/` per carousel |
| Chosen by | `export const DESIGN = "v2";` in the spec file | the default |

```bash
cd tools/carousel
cp specs/_template-v2.mjs specs/batch-4.mjs        # every slide type, building as it stands
node build.mjs specs/batch-4.mjs --sheet           # → out/<id>/01.png … , out/<id>-caption.txt, out/<id>-sheet.png
DESIGN=v2 node build.mjs specs/batch-3.mjs         # preview an old spec in the new look (does not touch the old files)
```

## Slide types (v2)

| `type` | Theme | Fields | Use it for |
|---|---|---|---|
| `cover` | dark | `kicker`, `icon`, `title`, `body` | The hook: the claim with its number. Pill the number or the key word |
| `content` | light | `kicker`, `icon`?, `title`, `body` | One idea, two or three sentences |
| `rows` | light | `kicker`, `title`, `rows: [{key, value}]` (≤ 4) | Thresholds, rates, fees, "who qualifies" |
| `steps` | light | `kicker`, `title`, `steps: [{title, text}]` (2–4) | The exact sequence of an action |
| `versus` | light | `kicker`, `title`, `versus: [{label, text}, {label, text}]` | A common belief against what the source says |
| `figure` | dark | `kicker`, `figure`, `figureLabel`, `title`, `body` | The one number that matters |
| `cta` | dark | `kicker`, `title`, `body`, `action`, `follow`? | The move, then the follow reason (same as the reels' last scene) |

Text markup: `*word*` mint pill, `*$word*` amber pill, `*!word*` coral pill. **Pills only on one or two short words: they never wrap.**
`icon` is any name in `tools/reel/icons.js` (moon calendar house check cross ban banknote coin car bank transfer doc receipt hammer tag chart lock clock shield pin).

Rhythm: dark cover → cream slides (a `figure` slide gives a dark beat mid-way) → dark end card. Aim for 6–8 slides; slide 2 should
deliver the first useful fact, because that is where people decide to keep swiping.

## What the build enforces (both designs)

The build stops, and writes nothing for that carousel, when: copy leaves the **grid crop** (the profile grid centre-crops 4:5 to 1:1,
keeping y 135–1215; v2 checks every block of content, not just its container), text overflows its measure, a box clips its
content, furniture overlaps furniture, the logo straddles the crop, or the caption has **more than 5 hashtags**. v1 also fails a "3" in a serif headline.
v2's footer `source` pill keeps the first whole " · " segments that fit; put the full list in the caption.

Copy budgets that build cleanly: cover title ≤ 9 words, other titles ≤ 8, body ≤ 40 words, row key ≤ 34 characters, row value ≤ 22.
Numbers come from a primary source you opened, and **you look at every slide** (`--sheet` makes that one image). Post at 18:00 Lisbon; reels go out at 09:00.

## Publish

Upload `out/<id>/NN.png` to R2 as `social/carousels/YYYY/MM/DD/<uuid>/NN.png`, then
`node ../buffer/create-carousel-draft.mjs out/<id>-caption.txt 2026-10-05@18:00 "<title>" <url1> <url2> …` (see `../buffer/README.md`).
