"""tighten.py <id> [--speed 1.07] [--keep 0.3] [--min-gap 0.45] [--tail 1.0]
Shortens a delivered reel without touching its sources: cuts the pauses between spoken lines down to --keep seconds,
shortens the tail (keeps --tail s after the last line, plus the final second with the logo), then speeds everything up by
--speed with pitch kept (atempo). The music is rebuilt from the clip list and cut at the same points with 60 ms crossfades, so its hits stay in sync.
Needs out/<id>/meta.json from the engine render (copied from the spare Mac) and branding/ WAVs.
Writes tools/reel/eps/<id>/delivery/reel.mp4 (the old one kept as reel-orig.mp4) and prints the cut list.
"""
import argparse, json, os, subprocess, wave, numpy as np

ap = argparse.ArgumentParser(); ap.add_argument("id"); ap.add_argument("--speed", type=float, default=1.07)
ap.add_argument("--keep", type=float, default=0.3); ap.add_argument("--min-gap", type=float, default=0.45); ap.add_argument("--tail", type=float, default=1.0)
ap.add_argument("--protect", action="append", default=[], help="a-b seconds never cut (a visual payoff with no voice)")
a = ap.parse_args()
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, "../../branding"))
W = os.path.join(HERE, "../../out/tighten", a.id); D = os.path.join(HERE, "eps", a.id, "delivery")
meta = json.load(open(os.path.join(W, "meta.json"))); SR = 44100; DUR = meta["dur"]; N = int(DUR * SR)
assert not meta.get("sounds"), "synth sounds not supported"

def load(p):
    w = wave.open(os.path.join(ROOT, p)); ch = w.getnchannels(); sw = w.getsampwidth()
    x = np.frombuffer(w.readframes(w.getnframes()), {2: np.int16, 4: np.int32}[sw]).astype(float) / (32768 if sw == 2 else 2 ** 31)
    assert w.getframerate() == SR, p
    return x.reshape(-1, ch).mean(axis=1) if ch > 1 else x

def stem(pick):
    y = np.zeros(N)
    for c in meta["clips"]:
        if not pick(c): continue
        x = load(c["file"]); s = int(c.get("from", 0) * SR); e = int(c["to"] * SR) if c.get("to") else len(x); x = x[s:e] * c.get("vol", 1.0)
        if c.get("gain"):
            tt = c["t"] + np.arange(len(x)) / SR; g = c["gain"]; x = x * np.interp(tt, [p[0] for p in g], [p[1] for p in g])
        i = int(round(c["t"] * SR)); j = min(N, i + len(x)); y[i:j] += x[:j - i]
    return y

is_music = lambda c: "music" in c["file"]
voice = stem(lambda c: c["file"].startswith("voices/")); fx = stem(lambda c: not is_music(c)); mus = stem(is_music)

# speech activity on the voice stem (20 ms frames within 30 dB of the loudest)
hop = int(.02 * SR); rms = np.array([np.sqrt((voice[k:k + hop] ** 2).mean() + 1e-12) for k in range(0, N, hop)])
db = 20 * np.log10(rms); on = db > db.max() - 30; t = np.arange(len(on)) * .02
segs = []; k = 0
while k < len(on):
    if on[k]:
        j = k
        while j < len(on) and on[j]: j += 1
        segs.append([t[k], t[min(j, len(t) - 1)]]); k = j
    else: k += 1
m = []
for s in segs:  # merge blips < 0.15 s apart
    if m and s[0] - m[-1][1] < .15: m[-1][1] = s[1]
    else: m.append(s)
cuts = []  # (start, end) spans to remove
for x, y in zip(m, m[1:]):
    g = y[0] - x[1]
    if g > a.min_gap:
        c0 = x[1] + a.keep / 2; c1 = c0 + g - a.keep
        if any(c0 < float(r.split("-")[1]) and c1 > float(r.split("-")[0]) for r in a.protect): continue
        cuts.append((c0, c1))
end = m[-1][1] + a.tail
if end < DUR - 1.0: cuts.append((end, DUR - 1.0))
keep = []; p = 0.0
for c0, c1 in cuts: keep.append((p, c0)); p = c1
keep.append((p, DUR))
print("speech", [(round(x, 2), round(y, 2)) for x, y in m]); print(json.dumps({"id": a.id, "dur": DUR, "cuts": [(round(x, 2), round(y, 2)) for x, y in cuts],
                  "removed": round(sum(y - x for x, y in cuts), 2), "new_dur": round(sum(y - x for x, y in keep) / a.speed, 2)}))

# audio: effects+voices cut, music continuous; both sped up with pitch kept
tmp = os.path.join(W, "tmp"); os.makedirs(tmp, exist_ok=True)
def wr(p, y):
    with wave.open(p, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(y, -1, 1) * 32767).astype("<i2").tobytes())
fxc = np.concatenate([fx[int(x * SR):int(y * SR)] for x, y in keep]); newlen = len(fxc) / SR
# 10 ms fades at each join to avoid clicks
def xjoin(y, xf=int(.06 * SR)):  # join the kept parts with short equal-power crossfades (music stays on its beats)
    out = y[int(keep[0][0] * SR):int(keep[0][1] * SR)].copy()
    for x0, x1 in keep[1:]:
        seg = y[max(0, int(x0 * SR) - xf):int(x1 * SR)].copy(); r = np.linspace(0, 1, xf)
        out[-xf:] = out[-xf:] * np.cos(r * np.pi / 2) + seg[:xf] * np.sin(r * np.pi / 2); out = np.concatenate([out, seg[xf:]])
    return out
musc = xjoin(mus); musc = np.pad(musc, (0, max(0, len(fxc) - len(musc))))[:len(fxc)]
wr(f"{tmp}/fx.wav", fxc * .9); wr(f"{tmp}/mus.wav", musc)
orig = os.path.join(D, "reel-orig.mp4")
if not os.path.exists(orig): os.rename(os.path.join(D, "reel.mp4"), orig)
sel = "+".join(f"between(t,{x:.3f},{y:.3f})" for x, y in keep)
T = newlen / a.speed
fc = (f"[0:v]select='{sel}',setpts=N/30/TB,setpts=PTS/{a.speed},fps=30[v];"
      f"[1:a]afade=t=in:d=0.01,atempo={a.speed}[f];[2:a]atempo={a.speed}[m];"
      f"[f][m]amix=inputs=2:normalize=0,atrim=0:{T:.3f},loudnorm=I=-14:TP=-1.5:LRA=11,aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[a]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", orig, "-i", f"{tmp}/fx.wav", "-i", f"{tmp}/mus.wav", "-filter_complex", fc,
                "-map", "[v]", "-map", "[a]", "-t", f"{T:.3f}", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k",
                "-movflags", "+faststart", os.path.join(D, "reel.mp4")], check=True)
print("wrote", os.path.join(D, "reel.mp4"), round(T, 2), "s")
