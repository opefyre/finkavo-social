"""sfx.py — real sound effects from ElevenLabs sound generation, saved as 44.1 kHz mono WAVs in branding/sfx/ (reuse before generating).

usage: python3 sfx.py <name> "<prompt: what it is, dry/close, no music>" <seconds> [--influence 0.55]
Check the level envelope after generating: a weak or empty take happens (re-prompt with "very loud, continuous, close-up").
"""
import json, os, sys, subprocess, urllib.request, argparse
ap = argparse.ArgumentParser(); ap.add_argument("name"); ap.add_argument("prompt"); ap.add_argument("seconds", type=float); ap.add_argument("--influence", type=float, default=.55)
a = ap.parse_args()
key = os.environ.get("ELEVENLABS_API_KEY") or open(os.path.expanduser("~/Desktop/Personal/Projects/finance/secrets/elevenlabs-api.txt")).read().strip()
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../../branding/sfx", a.name)
req = urllib.request.Request("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128",
                             data=json.dumps({"text": a.prompt, "duration_seconds": a.seconds, "prompt_influence": a.influence}).encode(),
                             headers={"xi-api-key": key, "Content-Type": "application/json"})
open(out + ".mp3", "wb").write(urllib.request.urlopen(req).read())
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", out + ".mp3", "-ac", "1", "-ar", "44100", out + ".wav"], check=True)
os.remove(out + ".mp3")
import wave, numpy as np
x = np.frombuffer(wave.open(out + ".wav").readframes(10 ** 8), np.int16).astype(float) / 32768; n = 4410
print(a.name, " ".join(f"{20 * np.log10(np.sqrt(np.mean(x[i * n:(i + 1) * n] ** 2)) + 1e-6):.0f}" for i in range(len(x) // n)))
