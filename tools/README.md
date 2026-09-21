# tools

Hand-made Instagram content tools. One npm package (`playwright` + `ffmpeg-static`), so `npm ci` here is the only install.

| Folder | Tool | What |
|---|---|---|
| `reel/` | `reel` | 1080 × 1920 reels drawn in code, with synthesised sound. Guide: [`docs/kinetic-reels.md`](../docs/kinetic-reels.md) |
| `carousel/` | `carousel` | 1080 × 1350 photo carousels from spec files |
| `buffer/` | `queue`, `publish` | list, gaps, check, and create Buffer drafts: [`buffer/README.md`](buffer/README.md) |

The procedures, defaults and rules for each tool are in [`TOOLS.md`](../TOOLS.md). Everything renders with headless Chromium and
reads the logo and fonts from `../branding/assets`. **Renders run on the spare Mac.** Outputs go to git-ignored `out/` folders.
