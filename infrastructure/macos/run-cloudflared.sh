#!/bin/zsh
set -euo pipefail

exec "$HOME/.local/bin/cloudflared" tunnel --no-autoupdate run --token-file "$HOME/.config/finkavo-social/cloudflared.token"
