"""audio.py — every sound is synthesised from formulas (numpy). Nothing is sampled, so nothing needs licensing.
usage: audio.py meta.json outdir   ->  sfx.wav (effects only), music.wav, mix.wav (music ducked under effects)
Each effect is placed at the sample index of its animation event, so it lands on the frame of its visual."""
import sys, json, wave
import numpy as np

SR = 44100
meta = json.load(open(sys.argv[1])); out = sys.argv[2].rstrip("/")
D = float(meta["dur"]); N = int(round(D * SR)) + SR // 2  # a little tail, trimmed by ffmpeg
rng = np.random.default_rng(11)
T = lambda n: np.arange(n) / SR
peak = lambda x: x / (np.max(np.abs(x)) + 1e-9)

def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")

def sweep(dur, f0, f1, k):
    n = int(dur * SR); t = T(n)
    f = f1 + (f0 - f1) * np.exp(-k * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)

def band_noise(dur, fa, fb, q=2.2, shape=1.5, ramp=None):
    """noise through a band-pass whose centre glides from fa to fb (short-time FFT, overlap-add)"""
    n = int(dur * SR); noise = rng.standard_normal(n + 4096)
    frame, hop = 2048, 512; win = np.hanning(frame); freqs = np.fft.rfftfreq(frame, 1 / SR)
    acc = np.zeros(n + 2 * frame)
    for i in range(0, n, hop):
        u = i / max(1, n)
        fc = np.exp(np.log(fa) + (np.log(fb) - np.log(fa)) * u)
        g = np.exp(-0.5 * ((np.log(freqs + 1) - np.log(fc)) * q) ** 2)
        acc[i:i + frame] += np.fft.irfft(np.fft.rfft(noise[i:i + frame] * win) * g) * win
    y = acc[:n]
    a = np.sin(np.pi * np.linspace(0, 1, n)) ** shape if ramp is None else np.linspace(0, 1, n) ** ramp
    return y * a

def env(n, atk, tau):
    t = T(n); e = np.exp(-t / tau)
    return e * (1 - np.exp(-t / atk)) if atk > 0 else e

def s_whoosh():  return peak(band_noise(.55, 260, 4400, 2.0, 1.4)) * .9
def s_swish():   return peak(band_noise(.24, 900, 3200, 2.4, 1.2)) * .55
def s_pop():
    n = int(.14 * SR); return peak(sweep(.14, 950, 250, 42) * env(n, .001, .04)) * .8
def s_thud():
    n = int(.6 * SR); t = T(n)
    body = sweep(.6, 135, 44, 13) * env(n, .002, .17)
    knock = lowpass(rng.standard_normal(n), 28) * np.exp(-t / .025)
    return peak(body + .5 * peak(knock)) * 1.0
def s_slam():
    n = int(.6 * SR); t = T(n)
    crack = (rng.standard_normal(n) - lowpass(rng.standard_normal(n), 10)) * np.exp(-t / .035)
    return peak(s_thud()[:n] + .35 * peak(crack)) * 1.0
def s_ding():
    n = int(1.6 * SR); t = T(n); f0 = 1568.0
    y = sum(a * np.sin(2 * np.pi * f0 * r * t) * np.exp(-t / tau) for r, a, tau in [(1, 1, 1.0), (2.76, .35, .55), (5.4, .14, .25)])
    return peak(y * (1 - np.exp(-t / .002))) * .7
def s_tick():
    n = int(.05 * SR); t = T(n)
    return peak(np.sin(2 * np.pi * 3100 * t) * np.exp(-t / .006) + .3 * rng.standard_normal(n) * np.exp(-t / .002)) * .5
def s_sparkle():
    y = np.zeros(int(.9 * SR))
    for k, f in enumerate([1046.5, 1318.5, 1568.0, 2093.0]):
        n = int(.5 * SR); t = T(n); s = np.sin(2 * np.pi * f * t) * np.exp(-t / .12)
        i = int(k * .07 * SR); y[i:i + n] += s
    return peak(y) * .55
def s_nope():
    n = int(.42 * SR); t = T(n); f = 300 - 90 * (t / .42)
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = sum(np.sin(h * ph) / h for h in (1, 3, 5)) * np.exp(-t / .22)
    return peak(y * (1 - np.exp(-t / .004))) * .6
def s_riser():
    return peak(band_noise(1.0, 180, 3800, 1.6, 1.0, ramp=1.6)) * .55

def s_scratch():
    # record scratch: a fast pitch dive and a quick swing back, over grainy noise
    n1, n2 = int(.16 * SR), int(.11 * SR)
    f = np.concatenate([np.linspace(1100, 140, n1), np.linspace(140, 620, n2)])
    ph = 2 * np.pi * np.cumsum(f) / SR
    saw = sum(np.sin(h * ph) / h for h in (1, 2, 3, 4))
    grain = lowpass(rng.standard_normal(len(f)), 3)
    e = np.concatenate([np.linspace(.2, 1, n1) ** .5, np.linspace(1, 0, n2) ** 1.3])
    return peak((saw * .7 + grain * .9) * e) * .8
def s_poof():
    n = int(.7 * SR); t = T(n)
    puff = band_noise(.7, 3000, 260, 1.1, 1.0)[:n] * np.exp(-t / .22)
    low = sweep(.7, 90, 40, 9) * env(n, .004, .12)
    return peak(puff * .8 + low * .5) * .8
def s_splat():
    # wet food landing: a soft low thump plus a short, dull, lowpassed noise burst
    n = int(.32 * SR); t = T(n)
    thump = sweep(.32, 170, 60, 22) * env(n, .002, .07)
    wet = lowpass(rng.standard_normal(n), 14) * np.exp(-t / .045) * (1 - np.exp(-t / .004))
    return peak(thump * .8 + peak(wet) * .9) * .85
def s_crack():
    # wood snapping: a burst of sharp splinter clicks over a heavy thud
    n = int(.7 * SR); t = T(n); y = np.zeros(n)
    for k, dt in enumerate([0, .018, .03, .052, .07, .11]):
        i = int(dt * SR); m = int(.03 * SR); tt = T(m)
        y[i:i + m] += (rng.standard_normal(m) - lowpass(rng.standard_normal(m), 6)) * np.exp(-tt / .006) * (1 - k * .12)
    th = s_thud(); y = y[:len(th)]
    return peak(peak(y) * .9 + th[:len(y)] * .7) * 1.0
SFX = dict(splat=s_splat, crack=s_crack, scratch=s_scratch, poof=s_poof, whoosh=s_whoosh, swish=s_swish, pop=s_pop, thud=s_thud, slam=s_slam, ding=s_ding, tick=s_tick, sparkle=s_sparkle, nope=s_nope, riser=s_riser)
cache = {}
sfx = np.zeros((N, 2)); loud = []
for k, ev in enumerate(sorted(meta["sounds"], key=lambda e: e["t"])):
    name = ev["name"]
    if name not in SFX: raise SystemExit(f"unknown sound: {name}")
    y = cache.setdefault(name, SFX[name]()) * ev.get("vol", 1.0)
    i = int(round(ev["t"] * SR)); j = min(N, i + len(y))
    pan = 0.5 + (0.12 if k % 2 else -0.12)                       # a touch of alternating width
    sfx[i:j, 0] += y[:j - i] * np.cos(pan * np.pi / 2); sfx[i:j, 1] += y[:j - i] * np.sin(pan * np.pi / 2)
    if name in ("crack", "whoosh", "thud", "slam", "ding", "sparkle", "nope", "riser", "scratch", "poof"): loud.append(ev["t"])

# ---------- music bed ----------
spec = meta.get("music") or {}
bpm = spec.get("bpm", 84); root = spec.get("root", 57)
prog = spec.get("prog", [[0, 3, 7], [5, 8, 12], [3, 7, 10], [7, 10, 14]])
seed = spec.get("seed", 3); r2 = np.random.default_rng(seed)
beat = 60.0 / bpm; bar = 4 * beat
mf = lambda m: 440.0 * 2 ** ((m - 69) / 12)
music = np.zeros(N)
def add(y, t0, gain=1.0):
    i = int(t0 * SR); j = min(N, i + len(y))
    if 0 <= i < N: music[i:j] += y[:j - i] * gain
nb = int(np.ceil(N / SR / bar)) + 1
for b in range(nb):
    ch = prog[b % len(prog)]; t0 = b * bar
    n = int((bar + .8) * SR); t = T(n)
    e = np.minimum(1, t / .45) * np.minimum(1, np.maximum(0, (bar + .8 - t) / .7))
    pad = np.zeros(n)
    for iv in ch:
        f = mf(root + iv)
        for det in (-.0015, .0015):
            pad += np.sin(2 * np.pi * f * (1 + det) * t) + .25 * np.sin(2 * np.pi * 2 * f * (1 + det) * t)
    bass = np.sin(2 * np.pi * mf(root + ch[0] - 24) * t)
    add((pad * .06 + bass * .22) * e, t0)
    # soft pluck arpeggio on eighths
    for k in range(8):
        if r2.random() < .22: continue
        note = ch[[0, 1, 2, 1, 2, 1, 0, 2][k]] + 12
        n2 = int(.5 * SR); t2 = T(n2); f = mf(root + note)
        pl = (np.sin(2 * np.pi * f * t2) + .3 * np.sin(2 * np.pi * 2 * f * t2)) * np.exp(-t2 / .16) * (1 - np.exp(-t2 / .003))
        add(pl, t0 + k * beat / 2, .16 * (.7 + .3 * r2.random()))
    for k in (0, 2):  # soft pulse on 1 and 3
        n3 = int(.3 * SR); add(sweep(.3, 100, 48, 22) * env(n3, .002, .09), t0 + k * beat, .25)
music = peak(music) * .34

# duck the music under loud effects: quick dip, short hold, gentle return
duck = np.ones(N)
for t in loud:
    i = int(t * SR); a, h, r = int(.02 * SR), int(.14 * SR), int(.38 * SR)
    shape = np.concatenate([np.linspace(1, .42, a), np.full(h, .42), np.linspace(.42, 1, r)])
    i0 = max(0, i - a); seg = shape[(i0 - (i - a)):]; j = min(N, i0 + len(seg))
    duck[i0:j] = np.minimum(duck[i0:j], seg[:j - i0])
mstereo = np.stack([music * duck, music * duck], axis=1)

def write(path, y):
    y = np.tanh(y * 1.05)
    pcm = (np.clip(y, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
write(f"{out}/sfx.wav", sfx * .9)
write(f"{out}/music.wav", np.stack([music, music], axis=1))
write(f"{out}/mix.wav", mstereo + sfx * .9)
print(f"audio: {len(meta['sounds'])} effects, music {bpm} bpm, {len(loud)} duck points")
