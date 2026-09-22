# Tools

Say the tool name and the details; the procedure below is the whole job. Standing rules are in `CLAUDE.md`.
Where the owner gives no detail, use the **defaults** shown and say which you used.

| Say | It does | Output |
|---|---|---|
| **`reel`** (`reel 5`, `reel 28 Sep–2 Oct`) | Topic → code-drawn reel → checked, rendered, verified → Buffer drafts | mp4 files, drafts at 09:00 |
| **`carousel`** (`carousel 5`) | Topic → spec (v2 design) → checked slides → Buffer drafts | PNG slides, drafts at 18:00 |
| **`topics`** (`topics 5`) | Picks and fact-checks topics that were never posted | topic briefs with sources |
| **`queue`** | What is scheduled, drafted, sent and empty | table of slots |
| **`publish`** | Takes finished media to R2 and creates the Buffer draft | draft IDs, verified |
| **`spare`** | How to work on the spare Mac | — |

---

## `queue` — what is in Buffer

```bash
ssh finkavo-spare
export PATH=$HOME/.local/finkavo-node/bin:$PATH; set -a; . ~/.config/finkavo-social/services.env; set +a
cd ~/social-posts-workflow/tools/buffer
node gaps.mjs 14                 # next 14 days: reel 09:00 and carousel 18:00 slots, draft/scheduled/sent, empties, off-slot posts
node gaps.mjs 10 2026-09-19      # from a given date
node list-posts.mjs | cut -c1-150   # every post ever (SINCE=2026-09-01 limits it)
node check-post.mjs <postId…>       # status, due time, asset type, hashtag count
```

Report: the `gaps` table trimmed to what matters, the first empty reel slot and carousel slot, and how many posts are drafts the
owner still has to schedule. A post is **not live** until the owner moves it from draft to scheduled.

## `topics` — choose and verify

Full method, prompt template and backlog: **`docs/topic-research.md`**. In short:

1. `queue` → `node list-posts.mjs` to read every earlier post. Read `docs/topic-research.md` backlog.
2. Pick candidates (tax/admin, one idea, one exact move, not covered).
3. Research each in parallel (one subagent per topic, using the template) against **primary sources you actually opened**.
4. Keep only topics whose numbers are confirmed. Drop any where official sources disagree.
5. Deliver, per topic: the rule (exact wording of thresholds), the one move, deadline, penalty, exceptions, source URLs, and hedges for anything unverified.

Default count: as many as the batch needs (reels 5, carousels 5). Update the backlog table when done.

## `reel` — a code-drawn reel (≈ 36 s)

Full guide: **`docs/kinetic-reels.md`** (API, checks, gotchas). Code: `tools/reel/`. Defaults: **5 reels**, on the
first empty reel slots from `queue`, **09:00 Lisbon**.

1. `queue` → the dates. `topics` → the topics.
2. On the laptop, in the repo: `cp reels/_template.reel.mjs reels/<id>.reel.mjs` and write `captions/<id>.txt`
   (5 scenes: hook · named habit · why · move · send-line + follow reason).
3. Sync and check on the spare Mac (repeat until `0 problem(s)` and the stills look right):
   ```bash
   rsync -a tools/reel/ finkavo-spare:~/social-posts-workflow/tools/reel/ --exclude out --exclude .venv
   ssh finkavo-spare 'export PATH=$HOME/.local/finkavo-node/bin:$PATH; cd ~/social-posts-workflow/tools/reel &&
     node render.mjs reels/<id>.reel.mjs --check &&
     node render.mjs reels/<id>.reel.mjs --stills 0,5.5,8.6,11.5,16,20,24.5,28,32,35.5 --sheet'
   scp finkavo-spare:~/social-posts-workflow/tools/reel/out/<id>/sheet.png /tmp/<id>-sheet.png    # then look at it
   ```
4. Render all (background), then verify each mp4: loudness ≈ −14 LUFS, frames taken from the **mp4**:
   ```bash
   ssh finkavo-spare 'cd ~/social-posts-workflow/tools/reel && nohup ./render-all.sh id1 id2 id3 > render-all.log 2>&1 &'
   ssh finkavo-spare 'cat ~/social-posts-workflow/tools/reel/render-all.log'       # until ALL DONE
   ```
5. `scp` each `reel.mp4` into the **repo itself**, at `tools/reel/out/<id>/reel.mp4` on the laptop (already git-ignored — no
   Desktop folder needed) and **show them to the owner** (SendUserFile). Publish only after they have seen them, unless they
   said to push straight away.
6. `publish` (below), **then clean up the local media** (see the note at the end of `publish`) once R2 and the draft are verified.
7. Commit `reels/<id>.reel.mjs` + `captions/<id>.txt` and push to `main`. Before the spare Mac pulls:
   `ssh finkavo-spare 'cd ~/social-posts-workflow && git clean -fq tools/reel/reels tools/reel/captions && git pull -q'`.
8. Report (short): table of date · topic · draft status, the caveats you hedged, what the owner must do (schedule the drafts).

Done when: checks pass, mp4 frames looked at, loudness ≈ −14, drafts verified with `check-post`, sources pushed.

## `carousel` — a carousel (1080 × 1350, 6–8 slides)

Code and slide types: `tools/carousel/` (README there). **New batches use the v2 design**: flat, drawn in code, the reels' language
(dark cover and end card, cream content slides, pills, icon tiles). No photo needed. v1 (photo + glass) built batches 1–3 and is kept
only so those specs still build. Defaults: **5 carousels**, first empty carousel slots, **18:00 Lisbon**.

1. `queue` → the dates. `topics` → the topics.
2. On the laptop: `cp tools/carousel/specs/_template-v2.mjs tools/carousel/specs/batch-N.mjs` (it has `export const DESIGN = "v2"` and every
   slide type). One carousel per topic: a `cover` with the claim and a pilled number, slide 2 already useful, then `rows` / `steps` /
   `versus` / `figure` as the facts need, and a `cta`. Caption with 5 hashtags and the full source list.
3. On the spare Mac: `node build.mjs specs/batch-N.mjs --sheet` → `out/<id>/NN.png`, `out/<id>-caption.txt`, `out/<id>-sheet.png`.
   The build fails on grid-crop, overflow, clipping or more than 5 hashtags. **Look at every slide** (`scp` the sheets over).
4. `publish` (below), with the slides as the images, **then clean up the local media** (see the note at the end of `publish`).
   Commit the spec file and push.

## `publish` — media → R2 → Buffer draft

Reels 09:00 and carousels 18:00 Lisbon; write the time as `2026-09-23@09:00` and the script converts it (daylight saving handled).
Upload from the laptop (wrangler is authenticated there), only ever adding objects:

```bash
U=$(uuidgen | tr A-Z a-z)
cd ~/Desktop/Personal/Projects/finance/finkavo
# reel:     key social/reels/YYYY/MM/DD/$U/reel.mp4        carousel: social/carousels/YYYY/MM/DD/$U/01.png, 02.png …
npx wrangler r2 object put finkavo-social/<key> --file <local file> --content-type video/mp4 --remote     # image/png for slides
curl -sI -H "Range: bytes=0-1" https://social-media.finkavo.com/<key> | head -1         # expect 206; content-length must equal the local size
```

Create the draft on the spare Mac (env loaded as in `queue`), then verify:

```bash
node create-reel-draft.mjs https://social-media.finkavo.com/<key> <captions/id.txt> 2026-09-23@09:00 "Short title"
node create-carousel-draft.mjs <id-caption.txt> 2026-09-23@18:00 "Short title" <url1> <url2> …
node check-post.mjs <postId…>        # draft · due time · VideoAsset/ImageAsset · tags=5
node gaps.mjs 14                     # no two posts share a slot
```

The scripts refuse more than 5 hashtags and never publish. Captions live next to the source: `captions/<id>.txt`.

**Clean up the local media once R2 and the draft are verified.** R2 is the durable copy from here on — the mp4/pngs sitting in
`tools/reel/out/<id>/` or `tools/carousel/out/<id>/` (laptop and spare Mac) have no further reason to exist once `curl` showed 206
with the right content-length and `check-post` confirmed the draft. Delete both copies before moving to the next topic, so `out/`
never becomes a second archive next to R2.

## `spare` — the spare Mac

`ssh finkavo-spare` (user `abolfazlshirkavand`; repo `~/social-posts-workflow`). Every render runs here.

- Node: `export PATH=$HOME/.local/finkavo-node/bin:$PATH`. Secrets: `~/.config/finkavo-social/services.env` (only `BUFFER_API_KEY` and `BUFFER_CHANNEL_ID`): load with `set -a; . <file>; set +a`; never print or commit them.
- The shell is **bash 3.2** (no `declare -A`). Put awkward quoting in a script file, not inline over ssh. Foreground `sleep` is blocked; background jobs and poll.
- Python for the reel sound: `tools/reel/.venv` (`python3 -m venv .venv && .venv/bin/pip install -r requirements.txt`).
- Machine has 8 cores / 8 GB: the reel renderer uses 4 workers.
- Code reaches it with `git pull` (or `rsync` while iterating; `git clean` those files before pulling). Other projects' jobs also run on this Mac (`com.elixiary.*`, a `sohottakes` crontab): leave them alone.

## Retired: the automated pipeline

The n8n + Social API + renderer-agent system that drafted, reviewed and scheduled carousels was **shut down and removed on
21 Sep 2026** (owner's decision: no longer useful). The last commit that contains it is tagged **`pipeline-final`**
(`git show pipeline-final:docs/pipeline/CONTEXT.md`). Everything outside git was removed the same day: its services, n8n data,
backups, the local CockroachDB, the Cloudflare tunnel `finkavo-social-approvals` and the `approve.finkavo.com` DNS record, and
every key in `services.env` except the two Buffer values. Do not rebuild any of it. One leftover for the owner: the Cloudflare
Access application "Finkavo Social Approvals" (Zero Trust → Access controls → Applications), which protects nothing now.
Never touch the app's D1 corpus (read-only). Other projects share the spare Mac and the Cloudflare account (`elixiary`,
`sohottakes`, Azshambe): leave their files, jobs and Access applications alone.
