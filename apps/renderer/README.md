# apps/renderer

Everything that draws pixels for Finkavo's Instagram.

| Folder | What it makes | Status |
|---|---|---|
| `kinetic/` | 1080 × 1920 **reels drawn in code** (keyframes, synthesised sound). Guide: [`docs/kinetic-reels.md`](../../docs/kinetic-reels.md) | **Current way to make reels** |
| `hand-carousels/` | 1080 × 1350 photo **carousels** from spec files | **Current way to make carousels** |
| `src/` | The automated pipeline's carousel renderer and outbound job agent | Pipeline is switched off |

Every kit renders with Playwright (headless Chromium) and reads the logo and fonts from `branding/assets`. **Renders run on
the spare Mac, not the laptop.** Outputs go to each kit's git-ignored `out/`.

Publishing (upload to R2, create a Buffer draft) is the same for all of them: see [`scripts/buffer/`](../../scripts/buffer/README.md).
