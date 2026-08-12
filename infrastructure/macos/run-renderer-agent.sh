#!/bin/zsh
set -euo pipefail
set -a
source "$HOME/.config/finkavo-social/services.env"
set +a
export PATH="$HOME/.local/finkavo-node/bin:$PATH"
export SOCIAL_API_BASE_URL=http://127.0.0.1:4320
export RENDER_OUTPUT_DIR="$HOME/social-posts-workflow/data/renders"
exec "$HOME/.local/finkavo-node/bin/node" "$HOME/social-posts-workflow/apps/renderer/dist/agent.js"
