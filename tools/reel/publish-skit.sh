#!/bin/bash
# publish-skit.sh <id> <YYYY-MM-DD> "<short title>" [HH:MM]   — run on the LAPTOP after the owner approved the skit.
# out/<id>/reel.mp4 (with music) → R2 (verified 206 + size) → Buffer: scheduled if a slot is free, else a draft with the time set
# (free plan: 10 scheduled posts max; the owner bumps drafts later) → check-post → deletes out/<id>/ here and on the spare Mac.
set -euo pipefail
id=$1; day=$2; title=$3; hm=${4:-19:00}; qt=$(printf %q "$title")   # quoted for the remote shell (titles with apostrophes)
REPO=$(cd "$(dirname "$0")/../.." && pwd); F=$REPO/tools/reel/out/$id/reel.mp4; CAP=$REPO/tools/reel/captions/$id.txt
[ -f "$F" ] && [ -f "$CAP" ] || { echo "missing $F or $CAP"; exit 1; }
n=$(grep -oE '(^|[[:space:]])#[[:alnum:]_]+' "$CAP" | wc -l | tr -d ' '); [ "$n" -le 5 ] || { echo "caption has $n hashtags ('#1' counts too)"; exit 1; }
K=social/reels/${day//-//}/$(uuidgen | tr A-Z a-z)/reel.mp4
(cd ~/Desktop/Personal/Projects/finance/finkavo && npx wrangler r2 object put "finkavo-social/$K" --file "$F" --content-type video/mp4 --remote 2>&1 | grep -iE "complete|error")
got=$(curl -sI -H "Range: bytes=0-1" "https://social-media.finkavo.com/$K" | grep -i content-range | tr -d '\r' | sed 's#.*/##')
[ "$got" = "$(stat -f %z "$F")" ] || { echo "R2 size mismatch: $got"; exit 1; }
scp -q "$CAP" finkavo-spare:/tmp/$id.txt
ssh -n finkavo-spare "export PATH=\$HOME/.local/finkavo-node/bin:\$PATH; set -a; . ~/.config/finkavo-social/services.env; set +a; cd ~/social-posts-workflow/tools/buffer
r=\$(SCHEDULE=1 node create-reel-draft.mjs https://social-media.finkavo.com/$K /tmp/$id.txt ${day}@$hm $qt | tail -1)
case \"\$r\" in *LimitReached*) r=\$(node create-reel-draft.mjs https://social-media.finkavo.com/$K /tmp/$id.txt ${day}@$hm $qt | tail -1);; esac
echo \"\$r\"; case \"\$r\" in draft*|scheduled*) ;; *) echo 'Buffer refused: local media kept'; exit 3;; esac
node check-post.mjs \$(echo \"\$r\" | awk '{print \$2}'); rm -rf ~/social-posts-workflow/tools/reel/out/$id"
rm -rf "$REPO/tools/reel/out/$id"          # only reached when the post exists (set -e stops on the ssh exit 3)
