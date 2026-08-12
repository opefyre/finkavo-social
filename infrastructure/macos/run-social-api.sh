#!/bin/zsh
set -euo pipefail
set -a
source "$HOME/.config/finkavo-social/services.env"
set +a
export PATH="$HOME/.local/finkavo-node/bin:$PATH"
export SOCIAL_API_PORT=4320
exec "$HOME/.local/finkavo-node/bin/node" "$HOME/social-posts-workflow/apps/social-api/dist/server.js"
