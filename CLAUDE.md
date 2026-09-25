# Working in this repo

When the owner names a tool (`reel`, `carousel`, `topics`, `queue`, `publish`, `spare`), open **TOOLS.md** and
follow that tool's procedure. Do not ask for what it already defines; use its defaults and say which you used.

Always:

- **Renders run on the spare Mac** (`ssh finkavo-spare`), never on the laptop. See `spare` in TOOLS.md.
- **Drafts only.** Create posts in Buffer as drafts; the owner schedules them. Never publish. The exception is a single post the owner explicitly asks you to schedule (`SCHEDULE=1`); never permanently delete posts (use `unschedule-post.mjs` to cancel a schedule and let the owner delete drafts).
- **Max 5 hashtags** (3 topic + `#viveremportugal` + `#Finkavo`). Reels 09:00 Lisbon, carousels 18:00, skits 19:00. Never two posts at the same time.
- **No repeated topics.** Check the full Buffer history first. Tax and admin only, never employment law.
- **Every number from a primary source you actually opened.** If two official sources disagree, drop the topic. No invented Finkavo features.
- **Never write to the app's D1 corpus** (read only). Only ever add objects to R2.
- **The old n8n pipeline is retired** (removed 21 Sep 2026, still in git at tag `pipeline-final`). Do not rebuild or restart it.
- **Reports are short and verified.** Say what is done, what is a draft, what you did not check. Look at what you rendered before saying it is fine.
- **Skits** (`skit`, docs/character-skits.md) are for reach, not tax facts: universal jokes, varied topics and formats, paced so
  every event can be seen (12–16 s). Higgsfield images up to 10 credits a batch without asking; ElevenLabs voices/effects only when
  the joke needs them. Nobody here can hear audio: say so, and check cuts on the waveform.
- Commit new reel/carousel/skit sources, captions and assets and push to `main` once they are published.
