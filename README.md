# Finkavo Social Posts

Instagram content for Finkavo (Portuguese tax and admin, in plain English). Two systems live here.

## 1 · Making posts by hand — the current way

Named tools, each with a complete procedure in **[`TOOLS.md`](TOOLS.md)**: `reel`, `carousel`, `topics`, `queue`, `publish`, `spare`.
Say the tool name and the details; everything else is written down.

| Path | What |
|---|---|
| `TOOLS.md`, `CLAUDE.md` | The tool registry and the standing rules |
| `apps/renderer/kinetic` | `reel` — 1080 × 1920 reels drawn in code. Guide: `docs/kinetic-reels.md` |
| `apps/renderer/hand-carousels` | `carousel` — 1080 × 1350 photo carousels from spec files |
| `scripts/buffer` | `queue` and `publish` — list, gaps, check, create drafts |
| `docs/topic-research.md` | `topics` — how to choose and verify a topic, and the backlog |
| `branding` | logo, fonts (and the music the pipeline uses) |

## 2 · The automated pipeline — switched off

An n8n + Social API system that planned, drafted, reviewed and scheduled five carousels a day. Kept intact, not in use.
Everything about it is under `docs/pipeline/` (`CONTEXT.md`, `ANNUAL_CONTENT_STRATEGY.md`, `IMPLEMENTATION_TODO.md`,
`OPERATIONS.md`). Its parts: `apps/social-api`, `apps/renderer/src`, `workflows`, `infrastructure`, `plans`, `config`, and
the `scripts/` that build and validate the plan.

## Pipeline setup

### Prerequisites

- Node.js 22+
- pnpm 11.7
- No administrator-level runtime is required; the spare Mac uses the native user-local installer
- Tailscale on both Macs

### First setup

1. Copy `.env.example` to `.env`.
2. Generate new n8n, renderer, and Social API secrets; do not reuse unrelated application secrets.
3. Install dependencies with `pnpm install`.
4. Install Chromium with `pnpm --filter @finkavo-social/renderer exec playwright install chromium`.
5. On the spare Mac, run `zsh infrastructure/macos/install-local-services.sh`.
6. Expose n8n and the review path privately with Tailscale Serve. Never enable Funnel for these services.

See `infrastructure/macos/README.md` for the installed setup. The Docker configuration remains available as an alternative.
