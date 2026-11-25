"""gen_lines.py <lines.json> <reel-id> — one wav per line in branding/voices/<reel-id>/<key>.wav (44.1 kHz mono, trimmed).
Kokoro (free, local) for plain English; ElevenLabs only for Portuguese/accented speakers (voices marked "eleven")."""
import json, os, subprocess, sys, tempfile, glob
import numpy as np, soundfile as sf
spec = json.load(open(sys.argv[1])); rid = sys.argv[2]
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, "../../../branding/voices", rid); os.makedirs(OUT, exist_ok=True)
M = os.path.expanduser("~/Desktop/Personal/Projects/sc-simulator/vrolen-youtube/tools/models"); K = None
def trim(src, dst):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.08",
                    "-ar", "44100", "-ac", "1", dst], check=True)
for sp, key, text in spec[rid]:
    dst = os.path.join(OUT, f"{key}.wav")
    if os.path.exists(dst): continue
    kind, voice, extra = spec["voices"][sp]
    tmp = tempfile.mkdtemp()
    if kind == "kokoro":
        if K is None:
            from kokoro_onnx import Kokoro; K = Kokoro(f"{M}/kokoro-v1.0.onnx", f"{M}/voices-v1.0.bin")
        a, sr = K.create(text, voice=voice, speed=float(extra), lang="en-us"); sf.write(f"{tmp}/a.wav", a, sr)
    else:
        open(f"{tmp}/l.txt", "w").write(text)
        args = ["python3", os.path.join(HERE, "tts.py"), voice, f"{tmp}/l.txt", f"{tmp}/a"] + (["--lang", extra] if extra == "pt" else [])
        subprocess.run(args, check=True, capture_output=True)
    trim(f"{tmp}/a.wav", dst)
    print(rid, key, sp, round(sf.info(dst).duration, 2), "s")
