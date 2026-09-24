# Buffer helpers

Small, dependency-free scripts for the hand-made posts. They read `BUFFER_API_KEY` and `BUFFER_CHANNEL_ID` from the
environment (on the spare Mac: `set -a; . ~/.config/finkavo-social/services.env; set +a`). Posts are created as **drafts** and the owner moves them to scheduled in Buffer. The one exception is a post the owner explicitly
asks to have scheduled (`SCHEDULE=1`, below).

| Script | Use |
|---|---|
| `gaps.mjs [days] [from]` | The next N days as Lisbon sees them: is the 09:00 reel slot and the 18:00 carousel slot filled (draft/scheduled/sent), which are empty, and any off-slot or double-booked post. |
| `list-posts.mjs` | Every post on the channel with status counts. `SINCE=2026-09-21` limits it. Run this **before choosing topics** (no repeats) and before choosing times (no two posts at once). |
| `create-reel-draft.mjs <videoUrl> <caption.txt> <dueAt> "<title>"` | Reel draft; thumbnail taken at 0.4 s. |
| `lisbon.mjs` | `dueAt` accepts `2026-09-23@09:00` (Lisbon wall-clock) and converts it, daylight saving included (clocks go back 25 Oct 2026). |
| `create-carousel-draft.mjs <caption.txt> <dueAt> "<title>" <img1> <img2> …` | Carousel draft. |
| `SCHEDULE=1 node create-reel-draft.mjs …` | Creates the reel **scheduled** (it will publish at `dueAt`). Only when the owner has explicitly asked for that post to be scheduled. |
| `unschedule-post.mjs <postId…>` | Moves scheduled posts back to **draft** so they do not publish (reversible, text and media unchanged). It never deletes: permanent deletion is the owner's, in Buffer. |
| `check-post.mjs <postId…>` | Status, due time, asset type and hashtag count. |

Rules baked in: **at most 5 hashtags** (the scripts refuse more). Reels 09:00 Lisbon, carousels 18:00 (write `2026-09-23@09:00`; do not hard-code `08:00Z`). Media must already be public: upload to R2 first (`social/reels/YYYY/MM/DD/<uuid>/reel.mp4`,
`social/carousels/YYYY/MM/DD/<uuid>/NN.png`, public base `https://social-media.finkavo.com`).
