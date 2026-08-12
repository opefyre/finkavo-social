# Finkavo Social Posts Workflow

Local-first automation for producing source-backed English Instagram carousels for Finkavo.

- `apps/renderer` — deterministic 1080 × 1350 carousel renderer
- `infrastructure/n8n` — self-hosted n8n configuration for the spare Mac
- `workflows` — sanitized, version-controlled n8n exports
- `config/sources.yaml` — free discovery sources and source policy
- `branding` — project-local brand guidance
- `CONTEXT.md` — reviewed architecture and operating rules

The local MVP deliberately excludes unattended scheduling and publishing. Populated `.env` files, n8n data, credentials, and generated renders are ignored by Git.

## Prerequisites

- Node.js 22+
- pnpm 11.7
- No administrator-level runtime is required; the spare Mac uses the native user-local installer
- Tailscale on both Macs

## First setup

1. Copy `.env.example` to `.env`.
2. Generate new n8n and renderer secrets; do not reuse Finkavo application secrets.
3. Install dependencies with `pnpm install`.
4. Install Chromium with `pnpm --filter @finkavo-social/renderer exec playwright install chromium`.
5. On the spare Mac, run `zsh infrastructure/macos/install-local-services.sh`.
6. Expose n8n privately with `tailscale serve --bg 5678`.

See `infrastructure/macos/README.md` for the installed setup. The Docker configuration remains available as an alternative.
