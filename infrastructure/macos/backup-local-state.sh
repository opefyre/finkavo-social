#!/bin/zsh
set -euo pipefail

BACKUP_ROOT=${FINKAVO_BACKUP_ROOT:-"$HOME/Backups/FinkavoSocial"}
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
STAGE="$BACKUP_ROOT/.stage-$STAMP"
ARCHIVE="$BACKUP_ROOT/finkavo-social-$STAMP.tar.gz"

umask 077
mkdir -p "$STAGE/n8n"
trap 'rm -rf "$STAGE"' EXIT

sqlite3 "$HOME/.n8n/database.sqlite" ".backup $STAGE/n8n/database.sqlite"
cp "$HOME/.n8n/config" "$STAGE/n8n/config"
cp "$HOME/.config/finkavo-social/services.env" "$STAGE/services.env"
tar -C "$STAGE" -czf "$ARCHIVE" .
tar -tzf "$ARCHIVE" >/dev/null
shasum -a 256 "$ARCHIVE" > "$ARCHIVE.sha256"

# Keep one month of daily host-local recovery points.
find "$BACKUP_ROOT" -type f -name 'finkavo-social-*.tar.gz' -mtime +30 -delete
find "$BACKUP_ROOT" -type f -name 'finkavo-social-*.tar.gz.sha256' -mtime +30 -delete

print "Verified backup: $ARCHIVE"
