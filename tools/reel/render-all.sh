#!/bin/bash
# ./render-all.sh id1 id2 …   — renders reels/<id>.reel.mjs one after the other (about 2 minutes each).
# Run it in the background and poll the log:   nohup ./render-all.sh a b c > render-all.log 2>&1 &
export PATH=$HOME/.local/finkavo-node/bin:$PATH
cd "$(dirname "$0")" || exit 1
for r in "$@"; do
  echo "== $r $(date +%T)"
  node render.mjs "reels/$r.reel.mjs" 2>&1 | tail -6
done
echo "ALL DONE $(date +%T)"
