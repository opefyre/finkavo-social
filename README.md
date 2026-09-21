# Finkavo Social Posts

Instagram content for Finkavo (Portuguese tax and admin, in plain English), made by hand with code.

Say a tool name; the whole procedure is in **[`TOOLS.md`](TOOLS.md)** and the standing rules in [`CLAUDE.md`](CLAUDE.md).

| Tool | What | Where |
|---|---|---|
| `reel` | code-drawn 1080 × 1920 reels, synthesised sound | `tools/reel` · [guide](docs/kinetic-reels.md) |
| `carousel` | 1080 × 1350 photo carousels from spec files | `tools/carousel` |
| `topics` | choose and fact-check topics that were never posted | [`docs/topic-research.md`](docs/topic-research.md) |
| `queue`, `publish` | what is in Buffer; media → R2 → Buffer draft | `tools/buffer` |
| `spare` | working on the spare Mac, where every render runs | `TOOLS.md` |

`branding/` holds the logo and fonts. The earlier automated n8n pipeline was retired on 21 Sep 2026 and is preserved at git tag `pipeline-final`.

Setup on the spare Mac: `git pull`, then `cd tools && npm ci`, then see `docs/kinetic-reels.md` §0 for the sound venv.
