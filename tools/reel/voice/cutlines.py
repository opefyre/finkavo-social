"""cutlines.py — cut each line of a tts.py take into its own file, at real silence, and audit every cut.

usage: python3 cutlines.py <take_stem> <out_dir> <name1> <name2> ...
  The take's lines (from <take_stem>.json, written by tts.py) are numbered from 0; the first line is the warm-up and the last
  the filler, so the names map to lines 1..N-2 in order. Use "-" to skip a line.

How a cut is placed: each line's span comes from the character alignment (tags in [brackets] are ignored). The cut moves outward
to the first quiet 10 ms frame (< -45 dBFS), never past the neighbouring lines' spans. The audit prints the level just outside
each cut: anything louder than -45 dB means the cut probably clips a word, and is flagged CHECK.
"""
import json, os, subprocess, sys
import numpy as np

SR = 44100
stem, out = sys.argv[1], sys.argv[2]
names = sys.argv[3:]
d = json.load(open(stem + ".json"))
text, al = d["text"], d["a"]
chars, st, en = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", stem + ".wav", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                                 capture_output=True, check=True).stdout, np.float32)
fr = int(0.01 * SR)
db = 20 * np.log10(np.sqrt(np.convolve(x ** 2, np.ones(fr) / fr, "same")) + 1e-9)

# spans of each line in the alignment (lines are joined by "\n... ...\n" in tts.py)
joined = "".join(chars)
lines = joined.split("\n... ...\n")
spans, pos = [], 0
for ln in lines:
    a, b = pos, pos + len(ln)
    i = a
    if ln.startswith("["):
        while i < b and joined[i] != "]":
            i += 1
        i += 1
    while i < b and joined[i] in " ":
        i += 1
    spans.append((st[i], en[b - 1]))
    pos = b + len("\n... ...\n")

# real pauses in the take (ElevenLabs' character times drift, so cut on actual silence, not on the alignment)
quiet = db < -40
gaps, i = [], 0
while i < len(quiet):
    if quiet[i]:
        j = i
        while j < len(quiet) and quiet[j]:
            j += 1
        if (j - i) / SR >= 0.05:
            gaps.append((i / SR, j / SR))
        i = j
    else:
        i += 1

def boundary(k):
    """Cut point between line k and k+1: the middle of the real pause nearest the alignment boundary."""
    t = (spans[k][1] + spans[k + 1][0]) / 2
    g = min(gaps, key=lambda g: abs((g[0] + g[1]) / 2 - t))
    return g, (g[0] + g[1]) / 2

os.makedirs(out, exist_ok=True)
for k, name in enumerate(names, start=1):
    if name == "-":
        continue
    g0, _ = boundary(k - 1)
    g1, _ = boundary(k)
    a = max(g0[1] - 0.03, (g0[0] + g0[1]) / 2)      # just before the speech starts, inside the pause
    b = min(g1[0] + 0.06, (g1[0] + g1[1]) / 2)      # just after the speech ends, inside the pause
    ia, ib = int(a * SR), int(b * SR)
    pre = db[max(0, ia - fr):ia].max() if ia > fr else -99
    post = db[ib:ib + fr].max() if ib + fr < len(db) else -99
    flag = "CHECK" if max(pre, post) > -35 else ("tight" if max(pre, post) > -45 else "ok")
    f = os.path.join(out, name + ".wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", stem + ".wav", "-ss", f"{a:.3f}", "-to", f"{b:.3f}",
                    "-af", "afade=t=in:d=0.01,areverse,afade=t=in:d=0.04,areverse", f], check=True)
    print(f"{name:22s} {a:6.2f}-{b:6.2f}s  {b - a:4.2f}s  pre {pre:5.1f} dB  post {post:5.1f} dB  {flag}  | {lines[k][:60]}")
