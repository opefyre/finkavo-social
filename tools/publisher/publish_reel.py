"""publish_reel.py — a finished reel → social-publisher DRAFT (Trial Reel, performance switch on), validated. Never queues.

usage: /usr/bin/python3 tools/publisher/publish_reel.py <id> <YYYY-MM-DDTHH:MM:SSZ> [--account finkavo|sandbox] [--cover-at 1.0]
  <id>: episode folder tools/reel/eps/<id>/ with delivery/reel.mp4; caption from tools/reel/captions/<id>.txt.
  The cover is a JPEG pulled from the reel at --cover-at seconds (the hook frame), or --cover-file. Check it in the 3:4 grid crop. Times are UTC with Z.
  Queueing is publishing: do it only after the owner's yes for this post, with POST /v1/posts/<post_id>/queue.
"""
import argparse, json, os, subprocess, sys, tempfile, time, urllib.error, urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
KEY = open(os.path.expanduser("~/.config/social-publisher/keys/finkavo.key")).read().strip()
B = "https://social.opefyre.com"

ap = argparse.ArgumentParser()
ap.add_argument("id"); ap.add_argument("at")
ap.add_argument("--account", default="finkavo"); ap.add_argument("--cover-at", type=float, default=1.0)
ap.add_argument("--cover-file", help="a ready 1080x1920 JPEG cover (hook inside the centre 3:4 grid crop); overrides --cover-at")
a = ap.parse_args()
if not a.at.endswith("Z"):
    sys.exit("time must be UTC with Z, e.g. 2027-01-28T15:00:00Z")


def call(method, path, body=None, data=None, ctype="application/json", idem=None):
    h = {"Authorization": f"Bearer {KEY}", "User-Agent": "curl/8.7.1", "Content-Type": ctype}
    if idem:
        h["Idempotency-Key"] = idem
    raw = data if data is not None else (json.dumps(body).encode() if body is not None else None)
    for i in range(5):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(B + path, method=method, headers=h, data=raw), timeout=600))
        except urllib.error.HTTPError as e:
            t = e.read().decode()
            if e.code in (409, 429, 503) and "idempotency" not in t:
                time.sleep(10 * (i + 1)); continue
            sys.exit(f"{method} {path} → {e.code} {t[:400]}")


video = os.path.join(ROOT, "tools/reel/eps", a.id, "delivery/reel.mp4")
caption = open(os.path.join(ROOT, "tools/reel/captions", a.id + ".txt")).read().strip()
title = caption.split("\n")[0][:60]
tmp = tempfile.mkdtemp()
try:
    cover = os.path.join(tmp, "cover.jpg")
    if a.cover_file:
        cover = os.path.abspath(a.cover_file)
    else:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(a.cover_at), "-i", video, "-frames:v", "1", "-q:v", "2", cover], check=True)
    mv = call("POST", "/v1/media?filename=reel.mp4", data=open(video, "rb").read(), ctype="video/mp4")["media"]
    mc = call("POST", "/v1/media?filename=cover.jpg", data=open(cover, "rb").read(), ctype="image/jpeg")["media"]
    for m in (mv, mc):
        if m.get("problems"):
            sys.exit(f"media problems: {m['problems']}")
    post = call("POST", "/v1/posts", {
        "account_id": a.account, "type": "reel", "caption": caption, "media": [mv["id"]], "cover_media_id": mc["id"],
        "options": {"trial": "SS_PERFORMANCE", "share_to_feed": True, "audio_name": f"Finkavo · {title}"[:90]},
        "metadata": {"content_id": a.id}, "scheduled_at": a.at}, idem=f"finkavo-{a.account}-{a.id}-{a.at}")["post"]
    v = call("POST", f"/v1/posts/{post['id']}/validate")
    print(json.dumps({"post": post["id"], "status": post["status"], "scheduled_at": post.get("scheduled_at"),
                      "trial": post.get("options", {}).get("trial"), "valid": v.get("valid"), "problems": v.get("problems")}))
finally:
    for f in os.listdir(tmp):
        os.remove(os.path.join(tmp, f))
    os.rmdir(tmp)
