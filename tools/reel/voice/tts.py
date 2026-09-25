"""tts.py — one ElevenLabs take per character, with character timestamps (so lines can be cut exactly).

usage: python3 tts.py <voice_id> <lines.txt> <out_stem> [--stability 0.5] [--seed 7] [--lang pt]
  lines.txt: one line per row, Eleven v3 tags allowed ("[strong Portuguese accent] [shouting] WHAT?!").
  Put a longer warm-up line FIRST and a filler line LAST: v3 is unstable on very short text and the last line of a take can be clipped.
  Writes <out_stem>.mp3, <out_stem>.wav (44.1 kHz mono) and <out_stem>.json (text + alignment) for cut.py.
Key: $ELEVENLABS_API_KEY or ~/Desktop/Personal/Projects/finance/secrets/elevenlabs-api.txt (never print or commit it).
"""
import json, os, sys, base64, subprocess, urllib.request, time, argparse
ap = argparse.ArgumentParser(); ap.add_argument("voice"); ap.add_argument("lines"); ap.add_argument("out")
ap.add_argument("--stability", type=float, default=0.5); ap.add_argument("--seed", type=int, default=7); ap.add_argument("--lang")
a = ap.parse_args()
key = os.environ.get("ELEVENLABS_API_KEY") or open(os.path.expanduser("~/Desktop/Personal/Projects/finance/secrets/elevenlabs-api.txt")).read().strip()
text = "\n... ...\n".join(l.rstrip("\n") for l in open(a.lines) if l.strip())
body = {"text": text, "model_id": "eleven_v3", "voice_settings": {"stability": a.stability}, "seed": a.seed}
if a.lang: body["language_code"] = a.lang
for attempt in range(3):
    try:
        req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{a.voice}/with-timestamps?output_format=mp3_44100_128",
                                     data=json.dumps(body).encode(), headers={"xi-api-key": key, "Content-Type": "application/json"})
        d = json.loads(urllib.request.urlopen(req).read()); break
    except urllib.error.HTTPError as e:
        print("ERR", e.code, e.read()[:200]); time.sleep(4)
else: sys.exit(1)
open(a.out + ".mp3", "wb").write(base64.b64decode(d["audio_base64"]))
json.dump({"text": text, "a": d.get("alignment")}, open(a.out + ".json", "w"))
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", a.out + ".mp3", "-ac", "1", "-ar", "44100", a.out + ".wav"], check=True)
print(a.out, "ok")
