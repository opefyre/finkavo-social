# Buffer helpers

Small, dependency-free scripts for the hand-made posts. They read `BUFFER_API_KEY` and `BUFFER_CHANNEL_ID` from the
environment (on the spare Mac: `set -a; . ~/.config/finkavo-social/services.env; set +a`). Nothing here publishes: posts
are created as **drafts**, and the owner moves them to scheduled in Buffer.

| Script | Use |
|---|---|
| `list-posts.mjs` | Every post on the channel with status counts. `SINCE=2026-09-21` limits it. Run this **before choosing topics** (no repeats) and before choosing times (no two posts at once). |
| `create-reel-draft.mjs <videoUrl> <caption.txt> <dueAt> "<title>"` | Reel draft; thumbnail taken at 0.4 s. |
| `create-carousel-draft.mjs <caption.txt> <dueAt> "<title>" <img1> <img2> …` | Carousel draft. |
| `check-post.mjs <postId…>` | Status, due time, asset type and hashtag count. |

Rules baked in: **at most 5 hashtags** (the scripts refuse more). Reels 09:00 Lisbon, carousels 18:00 (08:00 Z / 17:00 Z in
summer). Media must already be public: upload to R2 first (`social/reels/YYYY/MM/DD/<uuid>/reel.mp4`,
`social/carousels/YYYY/MM/DD/<uuid>/NN.png`, public base `https://social-media.finkavo.com`).
