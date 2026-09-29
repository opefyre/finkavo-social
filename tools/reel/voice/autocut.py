"""autocut.py — cut lines from a tts.py take at the real speech segments (waveform envelope), guided by the alignment.
More reliable than cut.py when v3's timestamps drift on excited lines.

usage: python3 autocut.py <take_stem> '[["exact phrase as written, no tags", "out.wav"], ...]'
Prints each cut's span. "NO SEGMENT" or a span that swallows the next line → cut by hand with ffmpeg -ss/-to at the silence
(print the envelope), with afade in 0.01 / out 0.05. Always check every cut on the waveform: nobody here can listen.
"""
import json, subprocess, sys, numpy as np
take, jobs = sys.argv[1], json.loads(sys.argv[2])
d = json.load(open(take + ".json")); a = d["a"]; s = "".join(a["characters"]); st = a["character_start_times_seconds"]
x = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", take + ".wav", "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
x = np.frombuffer(x, np.int16).astype(float) / 32768; T = len(x) / 16000
e = np.array([20 * np.log10(np.sqrt((x[int(t * 16000):int((t + .02) * 16000)] ** 2).mean()) + 1e-9) for t in np.arange(0, T - .02, .02)])
on = e > -42; segs = []; i = 0
while i < len(on):
    if on[i]:
        j = i
        while j < len(on) and on[j]: j += 1
        segs.append([i * .02, j * .02]); i = j
    else: i += 1
merged = []
for sg in segs:
    if merged and sg[0] - merged[-1][1] < .3: merged[-1][1] = sg[1]
    else: merged.append(sg)
starts = sorted([st[s.find(p)] for p, _ in jobs] + [T])
for p, out in jobs:
    t0 = st[s.find(p)]; t1 = min(v for v in starts if v > t0 + .05)
    pick = [m for m in merged if (m[0] + m[1]) / 2 >= t0 - .35 and (m[0] + m[1]) / 2 < t1 - .1]
    if not pick: print("NO SEGMENT", p); continue
    a0, a1 = max(0, pick[0][0] - .05), min(T, pick[-1][1] + .08)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{a0:.3f}", "-to", f"{a1:.3f}", "-i", take + ".wav", "-af", f"afade=t=in:d=0.01,afade=t=out:st={max(0, a1 - a0 - .05):.3f}:d=0.05", "-ar", "44100", "-ac", "1", out], check=True)
    print(f"{out.split('/')[-2]}/{out.split('/')[-1]} {a0:.2f}-{a1:.2f} ({a1 - a0:.2f}s) aligned {t0:.2f}")
