#!/bin/zsh
set -euo pipefail

PROJECT_DIR=${PROJECT_DIR:-"$HOME/social-posts-workflow"}
NODE_VERSION=${NODE_VERSION:-22.23.1}
N8N_VERSION=${N8N_VERSION:-2.4.8}
NODE_ROOT="$HOME/.local/finkavo-node"
N8N_ROOT="$HOME/.local/finkavo-social-n8n"
BIN_ROOT="$HOME/.local/bin"
CONFIG_ROOT="$HOME/.config/finkavo-social"
LOG_ROOT="$HOME/Library/Logs/FinkavoSocial"
LAUNCH_AGENTS="$HOME/Library/LaunchAgents"

mkdir -p "$NODE_ROOT" "$N8N_ROOT" "$BIN_ROOT" "$CONFIG_ROOT" "$LOG_ROOT" "$LAUNCH_AGENTS"
chmod 700 "$CONFIG_ROOT"

ARCH=$(uname -m)
if [[ "$ARCH" != "arm64" ]]; then
  print -u2 "Unsupported architecture: $ARCH"
  exit 1
fi

NODE_ARCHIVE="node-v${NODE_VERSION}-darwin-arm64.tar.gz"
NODE_URL="https://nodejs.org/dist/v${NODE_VERSION}/${NODE_ARCHIVE}"
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

if [[ ! -x "$NODE_ROOT/bin/node" ]] || [[ "$($NODE_ROOT/bin/node --version)" != "v${NODE_VERSION}" ]]; then
  curl --fail --location --silent --show-error "$NODE_URL" --output "$TEMP_DIR/$NODE_ARCHIVE"
  curl --fail --location --silent --show-error "https://nodejs.org/dist/v${NODE_VERSION}/SHASUMS256.txt" --output "$TEMP_DIR/SHASUMS256.txt"
  EXPECTED=$(awk -v file="$NODE_ARCHIVE" '$2 == file {print $1}' "$TEMP_DIR/SHASUMS256.txt")
  ACTUAL=$(shasum -a 256 "$TEMP_DIR/$NODE_ARCHIVE" | awk '{print $1}')
  [[ -n "$EXPECTED" && "$EXPECTED" == "$ACTUAL" ]] || { print -u2 "Node checksum verification failed"; exit 1; }
  rm -rf "$NODE_ROOT"
  mkdir -p "$NODE_ROOT"
  tar -xzf "$TEMP_DIR/$NODE_ARCHIVE" --strip-components=1 -C "$NODE_ROOT"
fi

export PATH="$NODE_ROOT/bin:$BIN_ROOT:$PATH"

if [[ ! -x "$N8N_ROOT/node_modules/.bin/n8n" ]] || [[ "$($N8N_ROOT/node_modules/.bin/n8n --version)" != "$N8N_VERSION" ]]; then
  "$NODE_ROOT/bin/npm" install --prefix "$N8N_ROOT" --omit=dev --no-audit --no-fund "n8n@${N8N_VERSION}"
fi

ENV_FILE="$CONFIG_ROOT/services.env"
if [[ ! -f "$ENV_FILE" ]]; then
  umask 077
  N8N_KEY=$(openssl rand -hex 32)
  JWT_KEY=$(openssl rand -hex 32)
  RENDER_KEY=$(openssl rand -hex 32)
  SOCIAL_API_KEY=$(openssl rand -hex 32)
  {
    print -r -- "N8N_ENCRYPTION_KEY=$N8N_KEY"
    print -r -- "N8N_USER_MANAGEMENT_JWT_SECRET=$JWT_KEY"
    print -r -- "RENDERER_API_TOKEN=$RENDER_KEY"
    print -r -- "SOCIAL_API_TOKEN=$SOCIAL_API_KEY"
  } > "$ENV_FILE"
fi
if ! grep -q '^SOCIAL_API_TOKEN=' "$ENV_FILE"; then
  umask 077
  print -r -- "SOCIAL_API_TOKEN=$(openssl rand -hex 32)" >> "$ENV_FILE"
fi
chmod 600 "$ENV_FILE"

cp "$PROJECT_DIR/infrastructure/macos/run-n8n.sh" "$CONFIG_ROOT/run-n8n.sh"
cp "$PROJECT_DIR/infrastructure/macos/run-renderer.sh" "$CONFIG_ROOT/run-renderer.sh"
cp "$PROJECT_DIR/infrastructure/macos/run-social-api.sh" "$CONFIG_ROOT/run-social-api.sh"
cp "$PROJECT_DIR/infrastructure/macos/run-renderer-agent.sh" "$CONFIG_ROOT/run-renderer-agent.sh"
cp "$PROJECT_DIR/infrastructure/macos/backup-local-state.sh" "$CONFIG_ROOT/backup-local-state.sh"
chmod 700 "$CONFIG_ROOT/run-n8n.sh" "$CONFIG_ROOT/run-renderer.sh" "$CONFIG_ROOT/run-social-api.sh" "$CONFIG_ROOT/run-renderer-agent.sh" "$CONFIG_ROOT/backup-local-state.sh"

sed -e "s|__HOME__|$HOME|g" -e "s|__NODE_ROOT__|$NODE_ROOT|g" -e "s|__N8N_ROOT__|$N8N_ROOT|g" -e "s|__PROJECT_DIR__|$PROJECT_DIR|g" \
  "$PROJECT_DIR/infrastructure/macos/com.finkavo.social.n8n.plist.template" > "$LAUNCH_AGENTS/com.finkavo.social.n8n.plist"
sed -e "s|__HOME__|$HOME|g" -e "s|__NODE_ROOT__|$NODE_ROOT|g" -e "s|__PROJECT_DIR__|$PROJECT_DIR|g" \
  "$PROJECT_DIR/infrastructure/macos/com.finkavo.social.renderer.plist.template" > "$LAUNCH_AGENTS/com.finkavo.social.renderer.plist"
sed -e "s|__HOME__|$HOME|g" -e "s|__NODE_ROOT__|$NODE_ROOT|g" -e "s|__PROJECT_DIR__|$PROJECT_DIR|g" \
  "$PROJECT_DIR/infrastructure/macos/com.finkavo.social.api.plist.template" > "$LAUNCH_AGENTS/com.finkavo.social.api.plist"
sed -e "s|__HOME__|$HOME|g" -e "s|__NODE_ROOT__|$NODE_ROOT|g" -e "s|__PROJECT_DIR__|$PROJECT_DIR|g" \
  "$PROJECT_DIR/infrastructure/macos/com.finkavo.social.renderer-agent.plist.template" > "$LAUNCH_AGENTS/com.finkavo.social.renderer-agent.plist"
sed -e "s|__HOME__|$HOME|g" \
  "$PROJECT_DIR/infrastructure/macos/com.finkavo.social.backup.plist.template" > "$LAUNCH_AGENTS/com.finkavo.social.backup.plist"
chmod 600 "$LAUNCH_AGENTS/com.finkavo.social.n8n.plist" "$LAUNCH_AGENTS/com.finkavo.social.renderer.plist" "$LAUNCH_AGENTS/com.finkavo.social.api.plist" "$LAUNCH_AGENTS/com.finkavo.social.renderer-agent.plist" "$LAUNCH_AGENTS/com.finkavo.social.backup.plist"

cd "$PROJECT_DIR"
"$NODE_ROOT/bin/corepack" pnpm --version >/dev/null
if ! "$NODE_ROOT/bin/corepack" pnpm install --frozen-lockfile; then
  # Managed pnpm installations can reject optional esbuild lifecycle scripts
  # even after installing the packages. The production renderer uses compiled
  # JavaScript and does not execute esbuild; require TypeScript to be present.
  [[ -x "$PROJECT_DIR/apps/renderer/node_modules/.bin/tsc" ]] || exit 1
fi
"$NODE_ROOT/bin/node" apps/renderer/node_modules/playwright/cli.js install chromium
"$NODE_ROOT/bin/node" apps/renderer/node_modules/typescript/bin/tsc -p apps/renderer/tsconfig.json
"$NODE_ROOT/bin/node" apps/social-api/node_modules/typescript/bin/tsc -p apps/social-api/tsconfig.json
[[ -f apps/renderer/dist/server.js && -f apps/renderer/dist/agent.js && -f apps/social-api/dist/server.js ]] || {
  print -u2 "Required production build artifacts are missing"
  exit 1
}

for label in com.finkavo.social.n8n com.finkavo.social.renderer com.finkavo.social.api com.finkavo.social.renderer-agent; do
  launchctl bootout "gui/$(id -u)/$label" 2>/dev/null || true
  loaded=false
  for attempt in 1 2 3 4 5; do
    if launchctl bootstrap "gui/$(id -u)" "$LAUNCH_AGENTS/$label.plist" 2>/dev/null; then
      loaded=true
      break
    fi
    sleep 1
  done
  if [[ "$loaded" != true ]]; then
    print -u2 "Unable to load $label after five attempts"
    exit 1
  fi
  launchctl enable "gui/$(id -u)/$label"
  launchctl kickstart -k "gui/$(id -u)/$label"
done

launchctl bootout "gui/$(id -u)/com.finkavo.social.backup" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$LAUNCH_AGENTS/com.finkavo.social.backup.plist"
launchctl enable "gui/$(id -u)/com.finkavo.social.backup"

print "Installed Node $NODE_VERSION and n8n $N8N_VERSION"
print "Service secrets: $ENV_FILE"
print "n8n: http://127.0.0.1:5678"
print "renderer: http://127.0.0.1:4310"
print "social API: http://127.0.0.1:4320"
