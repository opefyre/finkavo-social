"""Original short pieces for Finkavo reels, played by tools/music/sampler.py on real recorded instruments.

Usage (spare Mac): ~/social-posts-workflow/tools/reel/.venv/bin/python tools/music/compose.py <piece> [out.wav]
Pieces: tasca (minor guitar duo + bass, fado-night room), filarmonica (village brass march), rua (accordion street waltz).
All melodies and harmonies here are written for Finkavo; nothing is copied from existing songs.
"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
from sampler import Sampler, midi, ROOT

FADO_ROOM = os.path.join(ROOT, "freesound/misc/776250_AMB-Night,People,DistantFadoLive-BairroAlto,Lisbon-02Oct2022,21.53H.mp3")


def chord(root, kind):
    r = midi(root)
    return [r + i for i in {"m": (0, 3, 7), "M": (0, 4, 7), "7": (0, 4, 7, 10)}[kind]]


def tasca(out):
    bpm, beat = 92, 60 / 92
    s = Sampler(16.0, seed=3)
    s.ambience(FADO_ROOM, gain=0.22, start=20)
    prog = [("D3", "m"), ("A2", "7"), ("D3", "m"), ("G2", "m"), ("D3", "m"), ("A2", "7")]
    for bar, (root, kind) in enumerate(prog):
        t0 = bar * 4 * beat
        c = chord(root, kind)
        s.note("bass", t0, c[0] - 12, 1.8 * beat, 0.8)
        s.note("bass", t0 + 2 * beat, c[0] - 5, 1.6 * beat, 0.6)
        arp = [c[0], c[1] + 12, c[2], c[1] + 12, c[2] + 12 if len(c) < 4 else c[3], c[2], c[1] + 12, c[2]]
        for i, n in enumerate(arp):  # fingerpicked eighths
            s.note("guitar", t0 + i * beat / 2, n, beat * 0.9, 0.5 + 0.15 * (i % 4 == 0), pan=-0.35, bus="guitar_low")
    mel = [(0, "A4", 1.5), (1.5, "D5", 0.5), (2, "F5", 1), (3, "E5", 1), (4, "E5", 1.5), (5.5, "C#5", 0.5), (6, "E5", 1),
           (7, "G5", 1), (8, "F5", 2), (10, "E5", 0.5), (10.5, "D5", 0.5), (11, "C#5", 1), (12, "D5", 1.5), (13.5, "F5", 0.5),
           (14, "A5", 1), (15, "G5", 1), (16, "F5", 1), (17, "E5", 1), (18, "D5", 2), (20, "E5", 1), (21, "C#5", 1),
           (22, "A4", 2)]
    for b, n, d in mel:
        s.note("guitar", b * beat, midi(n) - 12, d * beat, 0.75, pan=0.3, bus="guitar_lead")  # an octave down: the recorded guitar tops out at A#4
    s.note("guitar", 24 * beat, "D3", 2.0, 0.6, pan=0.3, bus="guitar_lead")
    return s.mix({"guitar_low": 0.7, "guitar_lead": 1.0, "bass": 0.8, "room": 1.0}, reverb=0.16, out=out)


def filarmonica(out):
    bpm, beat = 112, 60 / 112
    s = Sampler(16.0, seed=5)
    prog = [("Bb2", "M"), ("F2", "7"), ("Bb2", "M"), ("Eb2", "M"), ("Bb2", "M"), ("F2", "7"), ("Bb2", "M")]
    for bar, (root, kind) in enumerate(prog):
        t0 = bar * 4 * beat
        c = chord(root, kind)
        s.note("tuba_stac", t0, c[0] - 12, beat * 0.8, 0.85)
        s.note("tuba_stac", t0 + 2 * beat, c[2] - 12 - (12 if c[2] - 24 > 40 else 0), beat * 0.8, 0.75)
        for off in (1, 3):  # the "pah"
            for n in c[1:3]:
                s.note("trombone_stac", t0 + off * beat, n + 12, beat * 0.5, 0.55, pan=-0.3)
    mel = [(0, "F4", 0.75), (0.75, "Bb4", 0.25), (1, "D5", 1), (2, "C5", 0.5), (2.5, "Bb4", 0.5), (3, "A4", 1),
           (4, "C5", 1.5), (5.5, "Eb5", 0.5), (6, "D5", 1), (7, "C5", 1), (8, "Bb4", 1), (9, "D5", 1), (10, "F5", 1.5),
           (11.5, "D5", 0.5), (12, "Eb5", 2), (14, "G5", 1), (15, "Eb5", 1), (16, "D5", 1), (17, "F5", 1), (18, "Bb4", 1),
           (19, "D5", 1), (20, "C5", 1.5), (21.5, "A4", 0.5), (22, "C5", 1), (23, "Eb5", 1), (24, "D5", 2.5)]
    for b, n, d in mel:
        s.note("trumpet" if d >= 1 else "trumpet_stac", b * beat, n, d * beat, 0.8, pan=0.2)
        s.note("clarinet" if d >= 1 else "clarinet_stac", b * beat, midi(n) - 12, d * beat, 0.45, pan=0.4)
    return s.mix({"tuba_stac": 0.9, "trombone_stac": 0.55, "trumpet": 1.0, "trumpet_stac": 1.0, "clarinet": 0.5,
                  "clarinet_stac": 0.5}, reverb=0.24, out=out)


def rua(out):
    bpm, beat = 104, 60 / 104
    s = Sampler(16.0, seed=7)
    prog = [("G2", "M"), ("D2", "7"), ("D2", "7"), ("G2", "M"), ("C3", "M"), ("G2", "M"), ("D2", "7"), ("G2", "M"), ("G2", "M")]
    for bar, (root, kind) in enumerate(prog):
        t0 = bar * 3 * beat
        c = chord(root, kind)
        s.note("bass", t0, c[0] - 12, beat * 1.2, 0.8)
        for off in (1, 2):  # guitar "pah-pah"
            for n in c[1:3]:
                s.note("guitar", t0 + off * beat, n + 12, beat * 0.6, 0.45, pan=-0.3)
    mel = [(0, "D5", 2), (2, "B4", 1), (3, "C5", 1), (4, "A4", 1), (5, "F#4", 1), (6, "A4", 2), (8, "C5", 1),
           (9, "B4", 3), (12, "E5", 2), (14, "C5", 1), (15, "D5", 2), (17, "B4", 1), (18, "A4", 1), (19, "B4", 1),
           (20, "C5", 1), (21, "B4", 2), (23, "A4", 1), (24, "G4", 3)]
    for b, n, d in mel:
        s.note("accordion", b * beat, n, d * beat, 0.75, pan=0.15)
    counter = [(6, "D4", 3), (12, "G4", 3), (18, "F#4", 3), (21, "G4", 3)]
    for b, n, d in counter:
        s.note("clarinet", b * beat, n, d * beat, 0.4, pan=0.45)
    return s.mix({"accordion": 1.0, "guitar": 0.6, "bass": 0.8, "clarinet": 0.45}, reverb=0.14, out=out)


if __name__ == "__main__":
    name = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else f"{name}.wav"
    print({"tasca": tasca, "filarmonica": filarmonica, "rua": rua}[name](out))
