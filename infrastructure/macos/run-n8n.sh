#!/bin/zsh
set -euo pipefail
set -a
source "$HOME/.config/finkavo-social/services.env"
set +a
export PATH="$HOME/.local/finkavo-node/bin:$PATH"
export TZ=Europe/Lisbon
export GENERIC_TIMEZONE=Europe/Lisbon
export N8N_PORT=5678
export N8N_LISTEN_ADDRESS=127.0.0.1
export N8N_HOST=${N8N_PUBLIC_HOST:-localhost}
export N8N_PROTOCOL=${N8N_PUBLIC_PROTOCOL:-http}
export N8N_EDITOR_BASE_URL=${N8N_EDITOR_BASE_URL:-"${N8N_PROTOCOL}://${N8N_HOST}:${N8N_PORT}"}
export WEBHOOK_URL=${WEBHOOK_URL:-"${N8N_EDITOR_BASE_URL}/"}
export N8N_PROXY_HOPS=1
export N8N_SECURE_COOKIE=true
export N8N_DIAGNOSTICS_ENABLED=false
export N8N_PERSONALIZATION_ENABLED=false
export N8N_VERSION_NOTIFICATIONS_ENABLED=false
export N8N_TEMPLATES_ENABLED=false
export EXECUTIONS_DATA_SAVE_ON_SUCCESS=none
export EXECUTIONS_DATA_SAVE_ON_ERROR=all
export EXECUTIONS_DATA_PRUNE=true
export EXECUTIONS_DATA_MAX_AGE=168
export N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
exec "$HOME/.local/finkavo-social-n8n/node_modules/.bin/n8n" start
