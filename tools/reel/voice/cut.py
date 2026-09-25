"""cut.py — cut lines out of a tts.py take: find each phrase in the alignment, snap to silence on the waveform, write a WAV per line.

usage: python3 cut.py lines.txt      (each row: <take_stem>|<exact phrase as written, without tags>|<out.wav>)
ALWAYS check the result against the waveform (print the envelope): the alignment can be off by up to ~1 s on excited lines;
if a cut clips a word, cut by hand with ffmpeg -ss/-to at the silence boundaries."""
import json, wave, sys, numpy as np
SR = 44100
def load(f):
    w = wave.open(f); return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float) / 32768
def cut(take, phrase, out, pad=.04, tempo=None):
    d = json.load(open(take + ".json")); a = d["a"]; chars = a["characters"]; s = "".join(chars)
    i = s.find(phrase)
    if i < 0: raise SystemExit(f"not found: {phrase}")
    t0 = a["character_start_times_seconds"][i]; t1 = a["character_end_times_seconds"][i + len(phrase) - 1]
    x = load(take + ".wav"); n = 441; e = np.array([np.sqrt(np.mean(x[k*n:(k+1)*n]**2)) for k in range(len(x)//n)]); thr = e.max() * .025
    k0 = int(t0 * 100); k1 = int(t1 * 100)
    # walk out to silence on both sides (at most 0.6 s)
    a0 = k0
    while a0 > 0 and a0 > k0 - 60 and not (e[a0-1] < thr and e[max(0,a0-4):a0].max() < thr): a0 -= 1
    b1 = k1
    while b1 < len(e) - 1 and b1 < k1 + 60 and not (e[b1] < thr and e[b1:b1+4].max() < thr): b1 += 1
    # also trim leading/trailing silence inside
    while a0 < b1 and e[a0] < thr: a0 += 1
    b1 = min(b1, len(e))
    while b1 > a0 and e[b1-1] < thr: b1 -= 1
    y = x[max(0, int((a0/100 - pad) * SR)): int((b1/100 + pad) * SR)]
    f = len(y); fade = int(.012 * SR); y[:fade] *= np.linspace(0, 1, fade); y[-fade:] *= np.linspace(1, 0, fade)
    w = wave.open(out, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
    print(f"{out}: {len(y)/SR:.2f}s  (aligned {t0:.2f}-{t1:.2f}, cut {a0/100:.2f}-{b1/100:.2f})")
if __name__ == "__main__":
    for line in open(sys.argv[1]):
        if line.strip(): take, phrase, out = line.rstrip("\n").split("|"); cut(take, phrase, out)
