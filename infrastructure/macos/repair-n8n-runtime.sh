#!/bin/zsh
set -euo pipefail

NODE_ROOT="$HOME/.local/finkavo-node"
N8N_ROOT="$HOME/.local/finkavo-social-n8n"
N8N_VERSION=${N8N_VERSION:-2.4.8}
LABEL=com.finkavo.social.n8n
BACKUP="$HOME/.local/finkavo-social-n8n.corrupt-$(date +%Y%m%d%H%M%S)"

export PATH="$NODE_ROOT/bin:$PATH"

launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
if [[ -d "$N8N_ROOT" ]]; then
  mv "$N8N_ROOT" "$BACKUP"
fi
mkdir -p "$N8N_ROOT"

"$NODE_ROOT/bin/npm" install --prefix "$N8N_ROOT" --omit=dev --no-audit --no-fund "n8n@${N8N_VERSION}"

ASSET=$(find "$N8N_ROOT/node_modules/n8n-editor-ui/dist/assets" -type f -name 'users.store-*.js' -print -quit)
[[ -n "$ASSET" && -s "$ASSET" ]] || { print -u2 "Editor asset missing"; exit 1; }
"$NODE_ROOT/bin/node" --check "$ASSET"
"$N8N_ROOT/node_modules/.bin/n8n" --version | grep -qx "$N8N_VERSION"

launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/$LABEL.plist"
launchctl enable "gui/$(id -u)/$LABEL"
launchctl kickstart -k "gui/$(id -u)/$LABEL"

print "Clean n8n runtime installed. Preserved previous runtime at: $BACKUP"

