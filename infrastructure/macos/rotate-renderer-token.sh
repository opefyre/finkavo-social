#!/bin/zsh
set -euo pipefail

ENV_FILE="$HOME/.config/finkavo-social/services.env"
TEMP_FILE=$(mktemp)
trap 'rm -f "$TEMP_FILE"' EXIT
umask 077
NEW_TOKEN=$(openssl rand -hex 32)
awk -F= -v token="$NEW_TOKEN" '
  $1 == "RENDERER_API_TOKEN" { print "RENDERER_API_TOKEN=" token; found=1; next }
  { print }
  END { if (!found) print "RENDERER_API_TOKEN=" token }
' "$ENV_FILE" > "$TEMP_FILE"
mv "$TEMP_FILE" "$ENV_FILE"
chmod 600 "$ENV_FILE"
launchctl kickstart -k "gui/$(id -u)/com.finkavo.social.renderer"
print "Renderer token rotated and service restarted."

