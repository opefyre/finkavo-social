"""Finkavo sampler: plays composed notes on real recorded instruments (CC0 samples in ~/finkavo-instruments).

No synthesis: every note is a recorded sample, pitch-shifted at most a few semitones to the target note.
Needs numpy and ffmpeg. Run on the spare Mac:  ~/social-posts-workflow/tools/reel/.venv/bin/python tools/music/compose.py <name>

Instruments (key -> folder under ~/finkavo-instruments):
  guitar     freesound/guitar           classical nylon guitar, single notes (pitch detected)
  accordion  freesound/accordion        accordion, octave notes ("Accordion Keyboard Octave D5")
  clarinet   vsco/Woodwinds/Clarinet/susLong | stac
  bass       vsco/Strings/Solo Contrabass/Pizz
  tuba       vsco/Brass/Tuba/sus | stac
  trumpet    vsco/Brass/Trumpet/sus | stac
  trombone   vsco/Brass/Tenor Trombone/sus | stac
  harp       vsco/Strings/Harp
"""
import glob, json, os, re, subprocess
import numpy as np

SR = 44100
ROOT = os.path.expanduser("~/finkavo-instruments")
CACHE = os.path.join(ROOT, ".cache")
NOTE = {"C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8, "Ab": 8,
        "A": 9, "A#": 10, "Bb": 10, "B": 11}
DIRS = {
    "guitar": ["freesound/guitar"], "accordion": ["freesound/accordion"],
    "clarinet": ["vsco/Woodwinds/Clarinet/susLong"], "clarinet_stac": ["vsco/Woodwinds/Clarinet/stac"],
    "bass": ["vsco/Strings/Solo Contrabass/Pizz"],
    "tuba": ["vsco/Brass/Tuba/sus"], "tuba_stac": ["vsco/Brass/Tuba/stac"],
    "trumpet": ["vsco/Brass/Trumpet/sus"], "trumpet_stac": ["vsco/Brass/Trumpet/stac"],
    "trombone": ["vsco/Brass/Tenor Trombone/sus"], "trombone_stac": ["vsco/Brass/Tenor Trombone/stac"],
    "harp": ["vsco/Strings/Harp"],
}


def midi(name):
    """'A#3' / 'Eb4' / 'E4b' (= Eb4) -> MIDI number."""
    m = re.match(r"^([A-G])([#b]?)(-?\d)([b]?)$", name)
    if not m:
        raise ValueError(name)
    letter, acc, octv, post = m.groups()
    acc = acc or post
    return 12 * (int(octv) + 1) + NOTE[letter + acc]


def load(path):
    os.makedirs(CACHE, exist_ok=True)
    key = os.path.join(CACHE, re.sub(r"[^\w.-]", "_", os.path.relpath(path, ROOT)) + ".f32")
    if not os.path.exists(key):
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                             capture_output=True, check=True).stdout
        open(key, "wb").write(raw)
    return np.fromfile(key, dtype=np.float32)


def detect_pitch(x):
    """Median f0 (autocorrelation) over the steady part of a plucked note -> fractional MIDI."""
    a = x[int(0.05 * SR): int(0.6 * SR)]
    a = a - a.mean()
    if len(a) < 2048 or np.abs(a).max() < 1e-4:
        return None
    ests = []
    for s in range(0, len(a) - 4096, 2048):
        w = a[s:s + 4096] * np.hanning(4096)
        c = np.fft.irfft(np.abs(np.fft.rfft(w, 8192)) ** 2)[:4096]
        lo, hi = int(SR / 1300), int(SR / 70)
        lag = lo + int(np.argmax(c[lo:hi]))
        if c[lag] > 0.3 * c[0]:
            ests.append(SR / lag)
    if not ests:
        return None
    return 69 + 12 * np.log2(np.median(ests) / 440)


def index(inst):
    """List of (midi, velocity_rank, path) for an instrument; cached as json."""
    cache = os.path.join(CACHE, f"index-{inst}.json")
    if os.path.exists(cache):
        return json.load(open(cache))
    out = []
    for d in DIRS[inst]:
        for p in sorted(glob.glob(os.path.join(ROOT, d, "*"))):
            b = os.path.basename(p)
            v = 1
            mv = re.search(r"_v(\d)", b)
            if mv:
                v = int(mv.group(1))
            m = re.search(r"_([A-G]#?\d)_", b) or re.search(r"Octave ([A-G]\d?b?\d?b?)\.", b)
            n = None
            if m:
                try:
                    n = midi(m.group(1))
                except ValueError:
                    n = None
            g = re.match(r"^\d+_(\d)_([A-G]b?)[_.]", b)  # Freesound id, then "<string>_<note>": string 6 = low E
            if inst == "guitar" and g:
                open_note = {6: 40, 5: 45, 4: 50, 3: 55, 2: 59, 1: 64}[int(g.group(1))]
                pc = NOTE[g.group(2)]
                n = next(m for m in range(open_note, open_note + 13) if m % 12 == pc)
            if n is None:
                if "Major" in b or "Minor" in b or "Bass" in b:
                    continue
                f = detect_pitch(load(p))
                if f is None:
                    continue
                n = float(f)
            out.append([n, v, p])
    json.dump(out, open(cache, "w"))
    return out


class Sampler:
    def __init__(self, seconds, seed=1):
        self.buf = {}
        self.n = int(seconds * SR)
        self.rng = np.random.default_rng(seed)
        self.idx = {}

    def note(self, inst, t, note, dur, vel=0.8, pan=0.0, release=0.12, bus=None):
        """Place one recorded note. note: MIDI number or name; dur in seconds; vel 0..1."""
        target = midi(note) if isinstance(note, str) else note
        if inst not in self.idx:
            self.idx[inst] = index(inst)
        cands = self.idx[inst]
        vmax = max(c[1] for c in cands)
        want_v = max(1, round(vel * vmax))
        best = min(cands, key=lambda c: (abs(c[0] - target) + 0.3 * abs(c[1] - want_v) + self.rng.random() * 0.05))
        x = load(best[2])
        ratio = 2 ** ((target - best[0]) / 12)
        if abs(ratio - 1) > 1e-3:
            pos = np.arange(0, len(x) - 1, ratio)
            x = np.interp(pos, np.arange(len(x)), x).astype(np.float32)
        on = int(np.argmax(np.abs(x) > 0.02 * np.abs(x).max()))  # trim the silence before the attack
        x = x[max(0, on - 64):]
        L = min(len(x), int((dur + release) * SR))
        x = x[:L].copy()
        r = min(L, int(release * SR))
        if r > 0:
            x[-r:] *= np.linspace(1, 0, r) ** 2
        x *= vel / (np.abs(x).max() + 1e-9) * 0.5
        s = int(t * SR)
        if s >= self.n:
            return
        e = min(self.n, s + L)
        key = bus or inst
        if key not in self.buf:
            self.buf[key] = np.zeros((self.n, 2), np.float32)
        gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        self.buf[key][s:e, 0] += x[: e - s] * gl
        self.buf[key][s:e, 1] += x[: e - s] * gr

    def ambience(self, path, gain=0.15, start=0.0):
        x = load(path)[int(start * SR):][: self.n]
        a = np.zeros((self.n, 2), np.float32)
        a[: len(x), 0] = a[: len(x), 1] = x
        self.buf["room"] = a * gain / (np.abs(a).max() + 1e-9)

    def mix(self, gains=None, reverb=0.18, out="out.wav", lufs=-16.0):
        gains = gains or {}
        mixb = np.zeros((self.n, 2), np.float32)
        for k, b in self.buf.items():
            mixb += b * gains.get(k, 1.0)
        if reverb:  # small room: decaying noise impulse, convolved per channel by FFT
            t = np.arange(int(0.9 * SR)) / SR
            ir = self.rng.standard_normal(len(t)).astype(np.float32) * np.exp(-t / 0.28)
            ir[: int(0.012 * SR)] = 0
            for ch in range(2):
                N = 1 << int(np.ceil(np.log2(self.n + len(ir))))
                wet = np.fft.irfft(np.fft.rfft(mixb[:, ch], N) * np.fft.rfft(ir, N), N)[: self.n]
                mixb[:, ch] += reverb * wet / (np.abs(wet).max() + 1e-9) * np.abs(mixb[:, ch]).max()
        mixb /= np.abs(mixb).max() + 1e-9
        tmp = out + ".raw.f32"
        (mixb * 0.9).astype(np.float32).tofile(tmp)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", tmp,
                        "-af", f"loudnorm=I={lufs}:TP=-1.5:LRA=11,aformat=sample_rates=48000", "-ar", "48000", out], check=True)
        os.remove(tmp)
        return out
