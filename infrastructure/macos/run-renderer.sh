#!/bin/zsh
set -euo pipefail
set -a
source "$HOME/.config/finkavo-social/services.env"
set +a
export PATH="$HOME/.local/finkavo-node/bin:$PATH"
export RENDERER_PORT=4310
export RENDER_OUTPUT_DIR="$HOME/social-posts-workflow/data/renders"
exec "$HOME/.local/finkavo-node/bin/node" "$HOME/social-posts-workflow/apps/renderer/dist/server.js"

