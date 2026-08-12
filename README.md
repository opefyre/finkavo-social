# Finkavo Social Posts Workflow

Local-first automation for producing source-backed English Instagram carousels for Finkavo.

The editorial system is topic-first: a versioned rolling-year plan defines five daily subjects, then the corpus and official sources are retrieved only as evidence. See `ANNUAL_CONTENT_STRATEGY.md` and the generated calendar in `plans/`.

- `apps/social-api` — durable workflow state, evidence, approval, R2, Buffer, monitoring, and audit API
- `apps/renderer` — deterministic 1080 × 1350 carousel renderer and outbound job agent
- `infrastructure/n8n` — self-hosted n8n configuration for the spare Mac
- `workflows` — sanitized, version-controlled n8n exports
- `config/sources.yaml` — free discovery sources and source policy
- `branding` — project-local brand guidance
- `CONTEXT.md` — reviewed architecture and operating rules
- `ANNUAL_CONTENT_STRATEGY.md` — annual taxonomy, timing rules, verification policy, and five-post daily rhythm
- `plans` — the 365-day, 1,825-slot human-readable and machine-readable editorial plan

The production workflow includes recurring deadline and occasion campaigns, official-portal change monitoring, exact-evidence verification, daily topic planning, social-first structured copy, deterministic branded carousels, human-gated scheduling, active publish monitoring, Discord notifications, and a guarded Buffer contract test. Populated `.env` files, n8n data, credentials, and generated renders are ignored by Git.

## Prerequisites

- Node.js 22+
- pnpm 11.7
- No administrator-level runtime is required; the spare Mac uses the native user-local installer
- Tailscale on both Macs

## First setup

1. Copy `.env.example` to `.env`.
2. Generate new n8n, renderer, and Social API secrets; do not reuse unrelated application secrets.
3. Install dependencies with `pnpm install`.
4. Install Chromium with `pnpm --filter @finkavo-social/renderer exec playwright install chromium`.
5. On the spare Mac, run `zsh infrastructure/macos/install-local-services.sh`.
6. Expose n8n and the review path privately with Tailscale Serve. Never enable Funnel for these services.

See `infrastructure/macos/README.md` for the installed setup. The Docker configuration remains available as an alternative.
