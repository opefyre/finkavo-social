# Self-hosted n8n on the spare Mac

n8n stays on localhost and can be exposed only inside a private tailnet through Tailscale Serve. Do not enable Funnel.

## One-time setup

1. Install or update Docker Desktop on the spare Mac.
2. Copy this repository to the Mac and copy `.env.example` to `.env`.
3. Run `openssl rand -hex 32` three times and assign the results to `N8N_ENCRYPTION_KEY`, `N8N_USER_MANAGEMENT_JWT_SECRET`, and `RENDERER_API_TOKEN`.
4. Start n8n:

   ```sh
   docker compose --env-file .env -f infrastructure/n8n/compose.yaml up -d
   ```

5. Confirm `http://127.0.0.1:5678/healthz` responds locally.
6. Expose it privately:

   ```sh
   tailscale serve --bg 5678
   tailscale serve status
   ```

7. Open the HTTPS `.ts.net` URL from the primary Mac and create the first n8n owner account.

After Tailscale reports the final hostname, update `.env` with the HTTPS hostname, set `N8N_SECURE_COOKIE=true`, and restart n8n.

## Backup and updates

The Docker volume and exact `N8N_ENCRYPTION_KEY` must be backed up together. Workflow exports do not contain credentials. The image is pinned; review release notes and back up before changing its version.
