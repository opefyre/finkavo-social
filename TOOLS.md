# Tools

Say the tool name and the details; the procedure below is the whole job. Standing rules are in `CLAUDE.md`.
Where the owner gives no detail, use the **defaults** shown and say which you used.

| Say | It does | Output |
|---|---|---|
| **`reel`** (`reel 5`, `reel 28 Sep–2 Oct`) | Topic → code-drawn reel → checked, rendered, verified → Buffer drafts | mp4 files, drafts at 09:00 |
| **`carousel`** (`carousel 5`) | Topic → spec → checked slides → Buffer drafts | PNG slides, drafts at 18:00 |
| **`topics`** (`topics 5`) | Picks and fact-checks topics that were never posted | topic briefs with sources |
| **`queue`** | What is scheduled, drafted, sent and empty | table of slots |
| **`publish`** | Takes finished media to R2 and creates the Buffer draft | draft IDs, verified |
| **`spare`** | How to work on the spare Mac | — |
| **`pipeline`** | The automated n8n system (off): inspect, never start unasked | status |

---

## `queue` — what is in Buffer

```bash
ssh finkavo-spare
export PATH=$HOME/.local/finkavo-node/bin:$PATH; set -a; . ~/.config/finkavo-social/services.env; set +a
cd ~/social-posts-workflow/scripts/buffer
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

Full guide: **`docs/kinetic-reels.md`** (API, checks, gotchas). Code: `apps/renderer/kinetic/`. Defaults: **5 reels**, on the
first empty reel slots from `queue`, **09:00 Lisbon**.

1. `queue` → the dates. `topics` → the topics.
2. On the laptop, in the repo: `cp reels/_template.reel.mjs reels/<id>.reel.mjs` and write `captions/<id>.txt`
   (5 scenes: hook · named habit · why · move · send-line + follow reason).
3. Sync and check on the spare Mac (repeat until `0 problem(s)` and the stills look right):
   ```bash
   rsync -a apps/renderer/kinetic/ finkavo-spare:~/social-posts-workflow/apps/renderer/kinetic/ --exclude out --exclude .venv
   ssh finkavo-spare 'export PATH=$HOME/.local/finkavo-node/bin:$PATH; cd ~/social-posts-workflow/apps/renderer/kinetic &&
     node render.mjs reels/<id>.reel.mjs --check &&
     node render.mjs reels/<id>.reel.mjs --stills 0,5.5,8.6,11.5,16,20,24.5,28,32,35.5 --sheet'
   scp finkavo-spare:~/social-posts-workflow/apps/renderer/kinetic/out/<id>/sheet.png /tmp/<id>-sheet.png    # then look at it
   ```
4. Render all (background), then verify each mp4: loudness ≈ −14 LUFS, frames taken from the **mp4**:
   ```bash
   ssh finkavo-spare 'cd ~/social-posts-workflow/apps/renderer/kinetic && nohup ./render-all.sh id1 id2 id3 > render-all.log 2>&1 &'
   ssh finkavo-spare 'cat ~/social-posts-workflow/apps/renderer/kinetic/render-all.log'       # until ALL DONE
   ```
5. Copy the mp4s to `~/Desktop/finkavo-reels/` and **show them to the owner** (SendUserFile). Publish only after they have seen
   them, unless they said to push straight away.
6. `publish` (below). Then commit `reels/<id>.reel.mjs` + `captions/<id>.txt` and push to `main`. Before the spare Mac pulls:
   `ssh finkavo-spare 'cd ~/social-posts-workflow && git clean -fq apps/renderer/kinetic/reels apps/renderer/kinetic/captions && git pull -q'`.
7. Report (short): table of date · topic · draft status, the caveats you hedged, what the owner must do (schedule the drafts).

Done when: checks pass, mp4 frames looked at, loudness ≈ −14, drafts verified with `check-post`, sources pushed.

## `carousel` — a photo carousel (1080 × 1350, 5–7 slides)

Code: `apps/renderer/hand-carousels/` (README there). Defaults: **5 carousels**, first empty carousel slots, **18:00 Lisbon**.

1. `queue` → the dates. `topics` → the topics. Choose a photo from `img/`; check it for garbled text (crop with `photoPos`).
2. Add entries to a new `specs/batch-N.mjs` (copy the shape of `specs/batch-2.mjs`; caption with 5 hashtags).
3. Build on the spare Mac: `node build.mjs specs/batch-N.mjs` → `out/<id>/NN.png` + `out/<id>-caption.txt`. The build fails on grid-crop,
   overflow, a "3" in a serif headline, or more than 5 hashtags. **Look at every slide** (`scp` them over).
4. `publish` (below), with the slides as the images. Commit the spec file and push.

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

## `spare` — the spare Mac

`ssh finkavo-spare` (user `abolfazlshirkavand`; repo `~/social-posts-workflow`). Every render runs here.

- Node: `export PATH=$HOME/.local/finkavo-node/bin:$PATH`. Secrets: `~/.config/finkavo-social/services.env` (`BUFFER_API_KEY`, `BUFFER_CHANNEL_ID`, …): load with `set -a; . <file>; set +a`; never print or commit them.
- The shell is **bash 3.2** (no `declare -A`). Put awkward quoting in a script file, not inline over ssh. Foreground `sleep` is blocked; background jobs and poll.
- Python for the reel sound: `apps/renderer/kinetic/.venv` (`python3 -m venv .venv && .venv/bin/pip install -r requirements.txt`).
- Machine has 8 cores / 8 GB: the reel renderer uses 4 workers.
- Code reaches it with `git pull` (or `rsync` while iterating; `git clean` those files before pulling).

## `pipeline` — the automated system (off)

n8n workflows + Social API + renderer agent, run as LaunchAgents on the spare Mac. **Switched off by the owner's decision:
do not start, enable or edit it unless asked.** To inspect only:

- Services: `ssh finkavo-spare 'launchctl list | grep finkavo'` (n8n, api, renderer, renderer-agent, cloudflared, backup).
- Docs: `docs/pipeline/` (`CONTEXT.md` architecture, `OPERATIONS.md` runbook, `ANNUAL_CONTENT_STRATEGY.md`, `IMPLEMENTATION_TODO.md`).
- Parts: `apps/social-api`, `apps/renderer/src`, `workflows/` (13 n8n exports), `infrastructure/`, `plans/`, `config/`, `scripts/` (plan builder and validators, `deploy-spare.sh`, `db-query.mjs`).
- n8n access and the owner's session: read `docs/pipeline/OPERATIONS.md` before touching it. The app's D1 corpus is read-only.
- Plan tooling: `pnpm plan:build`, `pnpm plan:validate`, `pnpm calendar:validate`.
