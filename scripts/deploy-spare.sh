#!/bin/zsh
# Deploy to the spare Mac.
#
# Both services execute apps/*/dist/server.js, never the TypeScript sources. A deploy that
# only pulls therefore changes nothing about what is running, and every check still passes:
# healthz answers, the self-test is green, the tests are green — because they all exercise
# the source, not the artifact. Four fixes sat in git for a day looking deployed while the
# stale dist kept producing the exact failures they had fixed.
#
# So the build is not optional here, and the verification at the end reads the artifact.
set -euo pipefail
cd "$HOME/social-posts-workflow"
export PATH="$HOME/.local/finkavo-node/bin:$PATH"

echo "==> pull"
git pull --ff-only origin main

echo "==> build social-api"
(cd apps/social-api && npx tsc -p tsconfig.json)
echo "==> build renderer"
(cd apps/renderer && npx tsc -p tsconfig.json)

echo "==> migrate"
(cd apps/social-api && set -a && source "$HOME/.config/finkavo-social/services.env" && set +a && node dist/migrate.js)

echo "==> restart"
launchctl kickstart -k "gui/$(id -u)/com.finkavo.social.api"
launchctl kickstart -k "gui/$(id -u)/com.finkavo.social.renderer"
sleep 8

echo "==> prune orphaned build output"
# tsc writes outputs but never removes them, so a deleted source leaves its .js behind and
# the next deploy ships a module that no longer exists in the tree. Harmless until
# something still imports it, at which point the running service and the source disagree.
for app in social-api renderer; do
  find "apps/$app/dist" -name '*.js' 2>/dev/null | while read -r out; do
    src="apps/$app/src/${out#apps/$app/dist/}"
    [[ -f "${src%.js}.ts" ]] || { echo "    removing orphan ${out}"; rm -f "$out" "${out%.js}.d.ts" "${out}.map"; }
  done
done

echo "==> verify the artifact is newer than its sources"
for app in social-api renderer; do
  stale=$(find "apps/$app/src" -name '*.ts' -newer "apps/$app/dist/server.js" 2>/dev/null | wc -l | tr -d ' ')
  [[ "$stale" == "0" ]] && echo "    $app: dist is current" || { echo "    $app: $stale source file(s) NEWER than dist — build did not take"; exit 1; }
done
printf '    healthz: '; curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4320/healthz
