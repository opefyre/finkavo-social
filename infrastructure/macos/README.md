# Native spare-Mac services

This is the zero-admin alternative to Docker. It installs pinned Node.js and n8n under the user's home directory, generates private service secrets, installs renderer dependencies, and registers the application services and daily backup as macOS LaunchAgents.

The services listen only on localhost:

- n8n: `127.0.0.1:5678`
- renderer: `127.0.0.1:4310`

n8n can be shared privately through Tailscale Serve. Funnel should remain disabled. Generated secrets live at `~/.config/finkavo-social/services.env` with mode `0600` and are not copied into the repository. Set `N8N_PUBLIC_HOST`, `N8N_PUBLIC_PROTOCOL`, `N8N_EDITOR_BASE_URL`, and `WEBHOOK_URL` in that protected environment file for the host's private URL.

Run on the spare Mac from the repository root:

```sh
zsh infrastructure/macos/install-local-services.sh
/Applications/Tailscale.app/Contents/MacOS/Tailscale serve --bg 5678
```

Logs live in `~/Library/Logs/FinkavoSocial`.

The daily backup runs at 03:30 and keeps verified, mode-`0600` archives in `~/Backups/FinkavoSocial` for 30 days. Periodically copy a verified archive to Finkavo's protected secrets storage on another machine.
