# Local Operations

## Host requirements

- Architecture: Apple Silicon (`arm64`)
- Node.js: 22.23.1, installed under `~/.local/finkavo-node`
- n8n: 2.4.8, installed under `~/.local/finkavo-social-n8n`
- Project copy: `~/social-posts-workflow`

## Private endpoints

- n8n editor: the private Tailscale Serve URL configured on the host
- n8n local health: `http://127.0.0.1:5678/healthz`
- renderer local health: `http://127.0.0.1:4310/healthz`
- Social API local health: `http://127.0.0.1:4320/healthz`

The editor is tailnet-only through Tailscale Serve. Funnel is not configured. Both underlying services listen only on localhost.

## Services

- `com.finkavo.social.n8n`
- `com.finkavo.social.renderer`
- `com.finkavo.social.api`

All are per-user LaunchAgents with `RunAtLoad` and `KeepAlive` enabled. Logs are under `~/Library/Logs/FinkavoSocial` on the spare Mac.

## Secrets

Generated service secrets are stored only on the spare Mac at:

```text
~/.config/finkavo-social/services.env
```

The file mode is `0600`. It contains independent n8n encryption, n8n JWT, and renderer authentication keys. Values are not committed or copied into this document.

Back up this file together with n8n's `~/.n8n` directory. Encrypted n8n credentials cannot be restored without the original `N8N_ENCRYPTION_KEY`.

## Verified on 2026-08-11

- n8n `/healthz`: healthy
- renderer `/healthz`: healthy
- n8n LaunchAgent: running
- renderer LaunchAgent: running
- Tailscale Serve: private HTTPS proxy active
- remote Playwright render: successful at 1080 × 1350
- n8n owner account: configured and signed in
- renderer authentication: encrypted n8n Bearer Auth credential
- n8n-to-renderer workflow execution: successful
- source-backed OpenAI draft generation: successful
- Social API and additive CockroachDB state tables: healthy
- gated `draft → approved → rendered` test: successful (six PNGs)

The initial owner account must be configured through the private editor. Keep the editor available only inside the chosen tailnet.

## Manual MVP workflow

1. Run `WF-01 Generate Source-backed Draft` and inspect the source, caption, and slides in its output.
2. Run `WF-05 Approve Latest Draft` only when that draft is acceptable.
3. Run `WF-06 Render Approved Draft`; PNG paths appear in the final node output.

All three workflows are manual and inactive. No unattended generation,
approval, rendering, scheduling, or publishing is enabled.
