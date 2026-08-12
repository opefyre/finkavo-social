# Local Operations

## Host and privacy boundary

- Apple Silicon spare Mac, Node 22.23.1, n8n 2.4.8.
- Project copy: `~/social-posts-workflow`.
- n8n, renderer, Social API, and renderer agent are per-user LaunchAgents with `RunAtLoad` and `KeepAlive`.
- All services listen on localhost. The editor and review route are available only through private Tailscale Serve; Funnel is not configured.
- Logs are under `~/Library/Logs/FinkavoSocial`.

Local health endpoints:

- n8n: `http://127.0.0.1:5678/healthz`
- renderer: `http://127.0.0.1:4310/healthz`
- Social API: `http://127.0.0.1:4320/healthz`

## Secrets

Runtime secrets exist only on the spare Mac in `~/.config/finkavo-social/services.env` with mode `0600`. This includes the n8n encryption/JWT values, internal API token, OpenAI key, database URL, bucket-scoped R2 key, and least-privilege Buffer key. Discord values belong in the same protected file when configured. No credential belongs in n8n exports, Git, logs, or this document.

Back up this file with `~/.n8n`; encrypted n8n credentials cannot be restored without the original `N8N_ENCRYPTION_KEY`.

## Backups and retention

- `com.finkavo.social.backup` creates a consistent n8n SQLite backup together with the n8n config and protected service environment every day at 03:30 local time.
- Host-local archives live in `~/Backups/FinkavoSocial`, are mode `0600`, are integrity-checked after creation, and expire after 30 days.
- Keep at least one verified copy outside the spare Mac in Finkavo's protected secrets storage. Never place an archive in Git, cloud-synced public storage, or Discord.
- Restore n8n only from an archive that contains both `n8n/database.sqlite` and `n8n/config`; restore `services.env` with mode `0600` before starting the services.
- R2 objects under `social/carousels/` expire after 180 days. The database remains the durable audit record after media expiry.

## Services

- `com.finkavo.social.n8n`
- `com.finkavo.social.renderer`
- `com.finkavo.social.api`
- `com.finkavo.social.renderer-agent`
- `com.finkavo.social.backup`

Re-running `infrastructure/macos/install-local-services.sh` is safe. It preserves the protected environment, rebuilds both apps, and retries transient LaunchAgent bootstrap failures.

## Editorial flow

1. Broad-news and official-portal discovery workflows collect Portugal signals every two hours. They remain `discovery_only` until exact official evidence exists in the fresh canonical corpus.
2. At 06:30 Lisbon, the planner expands recurring deadlines/occasions, prioritizes verified official changes, applies repeat-aware campaign rules, and selects up to two diverse concepts. It allows the next occurrence of a recurring obligation even when that subject was covered previously.
3. Generate a draft from a planned, current canonical corpus document. The JSON contract enforces English social copy, a clear post intent, search phrases, exact source excerpts, approved icons/layouts, renderer-safe lengths, 3–7 slides, and no more than two repair attempts. Caption copy is packaged as hook, body, text CTA, `finkavo.com`, and four to eight focused hashtags.
4. Request the private review link. It is expiring, single-use, authenticated by Tailscale identity, and tied to the exact revision/evidence hash. The page shows the exact final Instagram caption and all slide alt text before approval.
5. Approve or reject in the review page. Direct API approval is disabled.
6. Queue rendering. The outbound Mac agent uploads through presigned R2 URLs; the API re-downloads and verifies all file hashes, sizes, MIME types, and dimensions.
7. Schedule only after review. Ambiguous provider errors are blocked for reconciliation rather than retried.

## Verified on 2026-08-12

- n8n, renderer, Social API, and renderer agent healthy.
- Private Tailscale review UI authenticated and revision-bound.
- Single-use approval recorded with reviewer identity; replay and mutation protections implemented.
- Additive CockroachDB migrations through `0005_editorial_intelligence.sql` applied.
- Dedicated `finkavo-social` R2 bucket and bucket-scoped read/write credential configured.
- `social-media.finkavo.com` configured as the public read-only Buffer media origin. Bucket listing and writes remain private; exact object URLs are public.
- Approved six-slide production render completed at 1080×1350 with byte-level integrity verification.
- Buffer personal key configured with only account-read and post read/write permissions; the `finkavo` Instagram channel is configured.
- Four Discord channels and dedicated webhooks configured: `ig-approvals`, `ig-published`, `ig-errors`, and `ig-system`; delivery tests succeeded in all four.
- A clearly labeled five-image English Buffer contract test published successfully through Instagram after verifying anonymous media access and the current Instagram metadata contract.
- Buffer GraphQL adapter, lease-safe publish queue, status monitor, Discord notifier, retries, dead-letter/block states, and daily health endpoint implemented.
- Type check, automated tests, and production build pass locally.
- A full LaunchAgent restart drill recovered all services, preserved ten final modular n8n workflows, and restored a healthy renderer heartbeat.
- Five approved Finkavo v3 visual families are available: petrol editorial, cream guide, mint checklist, peach deadline, and ink alert. Four dedicated gallery fixtures passed native-size, overflow, and brand-font checks.
- Daily verified local backup and 180-day R2 carousel retention are configured.

## Publishing policy

Broad discovery, official monitoring, exact-evidence triage, daily planning, Buffer monitoring, and daily health are active. Draft generation, approval-link creation, rendering, and scheduling remain manual by design. No editorial post can reach Buffer without an exact human approval and a completed verified render.

The Buffer contract-test utility is additionally guarded by `ALLOW_BUFFER_CONTRACT_TEST=yes`; it cannot create a test post accidentally.
