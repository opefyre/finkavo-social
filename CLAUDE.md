# Working in this repo

When the owner names a tool (`reel`, `carousel`, `topics`, `queue`, `publish`, `spare`), open **TOOLS.md** and
follow that tool's procedure. Do not ask for what it already defines; use its defaults and say which you used.

Always:

- **Renders run on the spare Mac** (`ssh finkavo-spare`); the laptop too, but only with the owner's approval each time. See `spare` in TOOLS.md.
- **Drafts only.** New reels are social-publisher drafts (from 9 Nov 2026); posts already in Buffer stay there as drafts. The owner schedules them. Never publish. The exception is a single post the owner explicitly asks you to schedule (`SCHEDULE=1`); never permanently delete posts (use `unschedule-post.mjs` to cancel a schedule and let the owner delete drafts).
- **Max 5 hashtags** (3 topic + `#viveremportugal` + `#Finkavo`). Reels 09:00 Lisbon, carousels 18:00, skits 15:00 (moved from 19:00 on 5 Oct 2026 so people see them before bed). Never two posts at the same time.
- **No repeated topics.** Check the full Buffer history first. Tax and admin only, never employment law.
- **Every number from a primary source you actually opened.** If two official sources disagree, drop the topic. No invented Finkavo features.
- **Never write to the app's D1 corpus** (read only). Only ever add objects to R2.
- **The old n8n pipeline is retired** (removed 21 Sep 2026, still in git at tag `pipeline-final`). Do not rebuild or restart it.
- **Reports are short and verified.** Say what is done, what is a draft, what you did not check. Look at what you rendered before saying it is fine.
- **Reels/skits** follow the `finkavo-social` skill (~/.claude/skills/finkavo-social), read before every batch: scored ideas and
  hooks (skip rate decides reach), at least two production methods per reel, no synthesized sound or generic music, gates, the
  owner's review, then social-publisher drafts at 15:00 Lisbon, every one a Trial Reel with the performance switch on. Music is composed by us from
  real recorded instruments (Gemini as fallback), never ElevenLabs music or synthesized sound. English first, Portuguese as subtitled seasoning. Higgsfield used freely but
  logged (ask above ~50 credits a batch). Nobody here can hear audio: say so, and check cuts on the waveform.
- Commit new reel/carousel/skit sources, captions and assets and push to `main` once they are published.
