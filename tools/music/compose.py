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


# ---- per-reel scores (9 Nov 2026). Times in seconds come from each reel's storyboard. ----

def _muted(t, windows):
    return any(a <= t < b for a, b in windows)


def ep127(out):
    """The draught: tasca noir. Guitar arpeggios + bass from 0.0, lead from the wind, dead stop on the slam (19.6 s),
    one guitar note at 20.0 s that rings to the end."""
    beat, dur = 60 / 92, 24.8
    s = Sampler(dur, seed=11)
    s.ambience(FADO_ROOM, gain=0.12, start=40)
    prog = [("D3", "m"), ("A2", "7"), ("D3", "m"), ("G2", "m"), ("Bb2", "M"), ("A2", "7"), ("D3", "m"), ("A2", "7"), ("D3", "m"), ("G2", "m")]
    stop = [(22.8, 24.8)]
    for bar, (root, kind) in enumerate(prog):
        t0 = bar * 4 * beat
        c = chord(root, kind)
        for off, n in ((0, c[0] - 12), (2, c[0] - 5)):
            if not _muted(t0 + off * beat, stop):
                s.note("bass", t0 + off * beat, n, 1.6 * beat, 0.75)
        arp = [c[0], c[1] + 12, c[2], c[1] + 12, c[2], c[1] + 12, c[0] + 12, c[2]]
        for i, n in enumerate(arp):
            t = t0 + i * beat / 2
            if not _muted(t, stop):
                s.note("guitar", t, n, beat * 0.9, 0.42 + 0.12 * (i % 4 == 0), pan=-0.35, bus="guitar_low")
    mel = [(9.4, "A3", 1), (10.4, "D4", 1), (11.4, "F4", 2), (13.4, "E4", 1), (14.4, "C#4", 1), (15.4, "E4", 2),
           (17.4, "G4", 1), (18.4, "F4", 1), (19.4, "E4", 1), (20.4, "D4", 2), (22.4, "E4", 1), (23.4, "F4", 1),
           (24.4, "A4", 2), (26.4, "G4", 1), (27.4, "E4", 1), (28.4, "F4", 2), (30.4, "E4", 1), (31.4, "D4", 1), (32.4, "C#4", 2)]
    for b, n, d in mel:
        t = b * beat
        if not _muted(t, stop):
            s.note("guitar", t, n, d * beat, 0.7, pan=0.3, bus="guitar_lead")
    s.note("guitar", 23.3, "D3", 1.4, 0.7, pan=0.0, bus="guitar_lead", release=0.5)
    return s.mix({"guitar_low": 0.7, "guitar_lead": 1.0, "bass": 0.8, "room": 1.0}, reverb=0.16, out=out)


def ep128(out):
    """Leaving home: rua waltz. Light from 0.0, a lift around the 28.8 reveal (11-15 s), resolve at 22.0 s."""
    beat, dur = 60 / 104, 24.0
    s = Sampler(dur, seed=13)
    bars = int(dur / (3 * beat))
    prog = [("G2", "M"), ("D2", "7"), ("G2", "M"), ("C3", "M"), ("G2", "M"), ("D2", "7"), ("E2", "m"), ("D2", "7"),
            ("G2", "M"), ("C3", "M"), ("D2", "7"), ("G2", "M")]
    for bar in range(bars):
        root, kind = prog[bar % len(prog)]
        t0 = bar * 3 * beat
        c = chord(root, kind)
        lift = 1.15 if 12.4 <= t0 < 16.0 else 1.0
        s.note("bass", t0, c[0] - 12, beat * 1.2, 0.75 * lift)
        for off in (1, 2):
            for n in c[1:3]:
                s.note("guitar", t0 + off * beat, n + 12, beat * 0.6, 0.4 * lift, pan=-0.3)
    mel = [(0, "D5", 2), (2, "B4", 1), (3, "C5", 1), (4, "A4", 1), (5, "F#4", 1), (6, "G4", 3), (9, "B4", 2), (11, "D5", 1),
           (12, "E5", 2), (14, "C5", 1), (15, "B4", 3), (18, "A4", 2), (20, "C5", 1), (21, "E5", 3), (24, "D5", 3),
           (27, "B4", 2), (29, "A4", 1), (30, "B4", 2), (32, "C5", 1), (33, "A4", 2), (35, "F#4", 1), (36, "G4", 3), (39, "B4", 1), (40, "D5", 2), (42, "G4", 3)]
    for b, n, d in mel:
        t = b * beat
        if t < dur - 0.3:
            s.note("accordion", t, n, d * beat, 0.7 + (0.15 if 12.4 <= t < 16.0 else 0), pan=0.15)
    for b, n, d in [(21, "C4", 3), (24, "B3", 3), (33, "F#4", 3)]:
        s.note("clarinet", b * beat, n, d * beat, 0.4, pan=0.45)
    s.note("tuba_stac", 14.9, "G1", 0.6, 0.6)  # one low accent under "twenty-eight point eight"
    return s.mix({"accordion": 1.0, "guitar": 0.6, "bass": 0.8, "clarinet": 0.45, "tuba_stac": 0.5}, reverb=0.14, out=out)


def ep129(out):
    """The haircut: light filarmónica swing. Plays 0.0-2.4, drops out for "Contribuinte?" / "Sorry?" (2.4-5.0),
    returns with the receipt (5.0), button on the soup at 20.55 s."""
    beat, dur = 60 / 112, 21.6
    s = Sampler(dur, seed=17)
    mute = [(2.4, 4.4)]
    prog = [("Bb2", "M"), ("F2", "7"), ("Bb2", "M"), ("Eb2", "M"), ("Bb2", "M"), ("G2", "m"), ("C3", "m"), ("F2", "7"),
            ("Bb2", "M"), ("Eb2", "M"), ("F2", "7"), ("Bb2", "M")]
    bars = int(dur / (4 * beat)) + 1
    for bar in range(bars):
        root, kind = prog[bar % len(prog)]
        t0 = bar * 4 * beat
        c = chord(root, kind)
        for off, n in ((0, c[0] - 12), (2, c[2] - 24)):
            t = t0 + off * beat
            if t < dur - 0.2 and not _muted(t, mute):
                s.note("tuba_stac", t, n, beat * 0.7, 0.75)
        for off in (1, 3):
            t = t0 + off * beat
            if t < dur - 0.2 and not _muted(t, mute):
                for n in c[1:3]:
                    s.note("guitar", t, n + 12, beat * 0.4, 0.45, pan=-0.3)
    mel = [(0, "F4", 1), (1, "Bb4", 1), (2, "D5", 1), (3, "C5", 1), (10, "D5", 1), (11, "F5", 1.5), (12.5, "D5", 0.5),
           (13, "Eb5", 1), (14, "C5", 2), (16, "D5", 1), (17, "Bb4", 1), (18, "G4", 1), (19, "A4", 1), (20, "Bb4", 2),
           (22, "C5", 1), (23, "D5", 1), (24, "F5", 2), (26, "Eb5", 1), (27, "C5", 1), (28, "D5", 1), (29, "Bb4", 1),
           (32, "A4", 1), (33, "C5", 1), (34, "F5", 1), (35, "D5", 1)]
    for b, n, d in mel:
        t = b * beat
        if t < dur - 0.6 and not _muted(t, mute):
            s.note("clarinet" if d >= 1 else "clarinet_stac", t, n, d * beat, 0.65, pan=0.3)
    s.note("trumpet_stac", 20.85, "Bb4", 0.4, 0.7, pan=0.1)  # the button on the soup
    s.note("tuba_stac", 20.85, "Bb1", 0.4, 0.7)
    return s.mix({"tuba_stac": 0.85, "guitar": 0.55, "clarinet": 0.9, "clarinet_stac": 0.9, "trumpet_stac": 0.7},
                 reverb=0.18, out=out)


def _tasca_score(out, dur, mutes, end_note, seed, bpm=88, lead=None):
    """Minor guitar duo + plucked bass over the fado-night room; silent in `mutes`, one ringing note at `end_note`."""
    beat = 60 / bpm
    s = Sampler(dur, seed=seed)
    s.ambience(FADO_ROOM, gain=0.1, start=60)
    prog = [("A2", "m"), ("E2", "7"), ("A2", "m"), ("D3", "m"), ("F2", "M"), ("E2", "7"), ("A2", "m"), ("E2", "7")]
    bars = int(dur / (4 * beat)) + 1
    for bar in range(bars):
        root, kind = prog[bar % len(prog)]
        t0 = bar * 4 * beat
        c = chord(root, kind)
        for off, n in ((0, c[0] - 12), (2, c[0] - 5)):
            t = t0 + off * beat
            if t < dur - .3 and not _muted(t, mutes):
                s.note("bass", t, n, 1.6 * beat, 0.75)
        for i, n in enumerate([c[0], c[1] + 12, c[2], c[1] + 12, c[2], c[1] + 12, c[0] + 12, c[2]]):
            t = t0 + i * beat / 2
            if t < dur - .3 and not _muted(t, mutes):
                s.note("guitar", t, n, beat * 0.9, 0.4 + 0.12 * (i % 4 == 0), pan=-0.35, bus="guitar_low")
    for b, n, d in (lead or []):
        t = b * beat
        if t < dur - .3 and not _muted(t, mutes):
            s.note("guitar", t, n, d * beat, 0.68, pan=0.3, bus="guitar_lead")
    s.note("guitar", end_note, "A2", min(1.6, dur - end_note), 0.7, bus="guitar_lead", release=0.5)
    return s.mix({"guitar_low": 0.7, "guitar_lead": 1.0, "bass": 0.8, "room": 1.0}, reverb=0.16, out=out)


def ep130(out):
    """The will: tasca noir in A minor; silent under "Então fica para o gato" (17.8-20.0), ringing note on the last line."""
    lead = [(4, "E4", 2), (6, "C4", 1), (7, "D4", 1), (8, "E4", 2), (10, "A3", 2), (12, "C4", 1), (13, "B3", 1), (14, "A3", 2),
            (16, "E4", 1), (17, "F4", 1), (18, "E4", 2), (20, "D4", 1), (21, "C4", 1), (22, "B3", 2)]
    return _tasca_score(out, 24.6, [(17.8, 20.2)], 21.2, seed=21, lead=lead)


def ep131(out):
    """The names: mock-ceremonial filarmónica in F; drops for "Seis palavras. Escolha." (19.8-21.7), button on APPROVED (22.5)."""
    beat, dur = 60 / 108, 24.0
    s = Sampler(dur, seed=23)
    mute = [(19.8, 21.5)]
    prog = [("F2", "M"), ("C2", "7"), ("F2", "M"), ("Bb2", "M"), ("F2", "M"), ("D2", "m"), ("G2", "m"), ("C2", "7")]
    for bar in range(int(dur / (4 * beat)) + 1):
        root, kind = prog[bar % len(prog)]
        t0 = bar * 4 * beat
        c = chord(root, kind)
        for off, n in ((0, c[0] - 12), (2, c[2] - 24)):
            t = t0 + off * beat
            if t < dur - .3 and not _muted(t, mute):
                s.note("tuba_stac", t, n, beat * 0.7, 0.75)
        for off in (1, 3):
            t = t0 + off * beat
            if t < dur - .3 and not _muted(t, mute):
                for n in c[1:3]:
                    s.note("trombone_stac", t, n + 12, beat * 0.45, 0.5, pan=-0.3)
    mel = [(0, "C5", 1.5), (1.5, "A4", 0.5), (2, "F4", 1), (3, "A4", 1), (4, "C5", 2), (6, "Bb4", 1), (7, "G4", 1), (8, "A4", 2),
           (10, "F4", 1), (11, "G4", 1), (12, "A4", 1.5), (13.5, "Bb4", 0.5), (14, "C5", 2), (16, "D5", 1), (17, "C5", 1),
           (18, "A4", 2), (20, "F4", 1), (21, "A4", 1), (22, "C5", 2), (24, "Bb4", 1), (25, "G4", 1), (26, "A4", 2),
           (28, "F4", 1), (29, "G4", 1), (30, "A4", 2), (32, "C5", 2), (34, "A4", 2), (36, "F4", 2), (38, "G4", 2)]
    for b, n, d in mel:
        t = b * beat
        if t < dur - .6 and not _muted(t, mute):
            s.note("trumpet" if d >= 1 else "trumpet_stac", t, n, d * beat, 0.75, pan=0.2)
            s.note("clarinet" if d >= 1 else "clarinet_stac", t, midi(n) - 12, d * beat, 0.4, pan=0.4)
    s.note("trumpet_stac", 22.5, "F5", 0.5, 0.8, pan=0.1)
    s.note("tuba_stac", 22.5, "F1", 0.5, 0.8)
    return s.mix({"tuba_stac": 0.9, "trombone_stac": 0.55, "trumpet": 1.0, "trumpet_stac": 1.0, "clarinet": 0.5, "clarinet_stac": 0.5},
                 reverb=0.22, out=out)


def ep132(out):
    """Obrigado: rua waltz in D; starts at 1.0 after Zoe's first "Obrigado!", short stop for the waiter's "Obrigada." (2.4-3.3)."""
    beat, dur = 60 / 106, 26.4
    s = Sampler(dur, seed=29)
    mute = [(0, 1.0), (2.4, 3.3)]
    prog = [("D2", "M"), ("A2", "7"), ("A2", "7"), ("D2", "M"), ("G2", "M"), ("D2", "M"), ("A2", "7"), ("D2", "M")]
    for bar in range(int(dur / (3 * beat)) + 1):
        root, kind = prog[bar % len(prog)]
        t0 = 1.0 + bar * 3 * beat
        c = chord(root, kind)
        if t0 < dur - .3 and not _muted(t0, mute):
            s.note("bass", t0, c[0] - 12, beat * 1.2, 0.75)
        for off in (1, 2):
            t = t0 + off * beat
            if t < dur - .3 and not _muted(t, mute):
                for n in c[1:3]:
                    s.note("guitar", t, n + 12, beat * 0.6, 0.4, pan=-0.3)
    mel = [(0, "F#5", 2), (2, "E5", 1), (3, "D5", 2), (5, "A4", 1), (6, "B4", 2), (8, "C#5", 1), (9, "D5", 3), (12, "E5", 2),
           (14, "F#5", 1), (15, "G5", 2), (17, "E5", 1), (18, "D5", 2), (20, "C#5", 1), (21, "D5", 3), (24, "A4", 2), (26, "B4", 1),
           (27, "C#5", 2), (29, "E5", 1), (30, "D5", 3), (33, "F#5", 2), (35, "E5", 1), (36, "D5", 3), (39, "A4", 3)]
    for b, n, d in mel:
        t = 1.0 + b * beat
        if t < dur - .4 and not _muted(t, mute):
            s.note("accordion", t, n, d * beat, 0.7, pan=0.15)
    return s.mix({"accordion": 1.0, "guitar": 0.6, "bass": 0.8}, reverb=0.14, out=out)


def ep133(out):
    """The TV levy: light accordion street waltz in G; drops for grandpa's "Pago a televisão e nem a ligo." (22.0-24.1), button after."""
    beat, dur = 60 / 112, 25.0
    s = Sampler(dur, seed=33)
    mute = [(22.0, 24.1)]
    prog = [("G2", "M"), ("D2", "7"), ("D2", "7"), ("G2", "M"), ("C3", "M"), ("G2", "M"), ("D2", "7"), ("G2", "M")]
    for bar in range(int(dur / (3 * beat)) + 1):
        root, kind = prog[bar % len(prog)]
        t0 = .2 + bar * 3 * beat
        c = chord(root, kind)
        if t0 < dur - .3 and not _muted(t0, mute):
            s.note("bass", t0, c[0] - 12, beat * 1.2, 0.75)
        for off in (1, 2):
            t = t0 + off * beat
            if t < dur - .3 and not _muted(t, mute):
                for n in c[1:3]:
                    s.note("guitar", t, n + 12, beat * 0.6, 0.38, pan=-0.3)
    mel = [(3, "D5", 1), (4, "B4", 1), (5, "G4", 1), (6, "A4", 2), (8, "F#4", 1), (9, "G4", 3), (12, "B4", 1), (13, "C5", 1),
           (14, "D5", 1), (15, "E5", 2), (17, "C5", 1), (18, "B4", 3), (21, "A4", 1), (22, "B4", 1), (23, "C5", 1), (24, "D5", 2),
           (26, "C5", 1), (27, "B4", 2), (29, "A4", 1), (30, "G4", 3)]
    for b, n, d in mel:
        t = .2 + b * beat
        if t < dur - .4 and not _muted(t, mute):
            s.note("accordion", t, n, d * beat, 0.62, pan=0.15)
    s.note("accordion", 24.15, "G4", 0.7, 0.7, pan=0.1)
    s.note("bass", 24.15, "G1", 0.7, 0.8)
    return s.mix({"accordion": 1.0, "guitar": 0.6, "bass": 0.8}, reverb=0.14, out=out)


def ep134(out):
    """Found money: tasca guitars in A minor; stops for "Volte daqui a um ano." (11.9-13.3), ringing note on Otto's coffee."""
    lead = [(4, "C4", 1), (5, "E4", 1), (6, "A3", 2), (8, "B3", 1), (9, "C4", 1), (10, "D4", 2), (12, "E4", 2), (14, "C4", 2),
            (18, "A3", 1), (19, "C4", 1), (20, "E4", 2), (22, "F4", 1), (23, "E4", 1), (24, "D4", 2), (26, "C4", 1), (27, "B3", 1),
            (28, "A3", 2), (30, "E4", 2)]
    return _tasca_score(out, 24.0, [(11.9, 13.3)], 20.0, seed=34, bpm=96, lead=lead)


def ep135(out):
    """25 April: slow, hopeful fingerpicked guitar in C over the fado-night room; quiet under grandma's "Eu estava lá." (26.4-end)."""
    beat, dur = 60 / 72, 28.3
    s = Sampler(dur, seed=35)
    s.ambience(FADO_ROOM, gain=0.08, start=90)
    mute = [(26.4, dur)]
    prog = [("C3", "M"), ("A2", "m"), ("F2", "M"), ("G2", "M"), ("C3", "M"), ("E2", "m"), ("F2", "M"), ("G2", "7")]
    for bar in range(int(dur / (4 * beat)) + 1):
        root, kind = prog[bar % len(prog)]
        t0 = bar * 4 * beat
        c = chord(root, kind)
        if t0 < dur - .3 and not _muted(t0, mute):
            s.note("bass", t0, c[0] - 12, 3 * beat, 0.6)
        for i, n in enumerate([c[0], c[2], c[1] + 12, c[2]] * 2):
            t = t0 + i * beat / 2
            if t < dur - .3 and not _muted(t, mute):
                s.note("guitar", t, n, beat * 1.2, 0.34 + 0.1 * (i % 4 == 0), pan=-0.3, bus="guitar_low")
    lead = [(8, "E4", 2), (10, "G4", 2), (12, "A4", 3), (15, "G4", 1), (16, "E4", 2), (18, "D4", 2), (20, "C4", 4),
            (24, "E4", 2), (26, "F4", 2), (28, "A4", 3), (31, "G4", 1)]
    for b, n, d in lead:
        t = b * beat
        if t < dur - .3 and not _muted(t, mute):
            s.note("guitar", t, n, d * beat, 0.6, pan=0.3, bus="guitar_lead")
    s.note("guitar", 26.4, "C3", 1.8, 0.45, bus="guitar_lead", release=0.8)
    return s.mix({"guitar_low": 0.7, "guitar_lead": 1.0, "bass": 0.7, "room": 1.0}, reverb=0.2, out=out)


def ep136(out):
    """Land clearing: rustic accordion waltz in D; drops under grandma's "Eu tenho as cabras há quarenta anos." (13.2-15.6)."""
    beat, dur = 60 / 116, 17.5
    s = Sampler(dur, seed=36)
    mute = [(13.2, 15.6)]
    prog = [("D2", "M"), ("A2", "7"), ("A2", "7"), ("D2", "M"), ("G2", "M"), ("D2", "M"), ("A2", "7"), ("D2", "M")]
    for bar in range(int(dur / (3 * beat)) + 1):
        root, kind = prog[bar % len(prog)]
        t0 = .2 + bar * 3 * beat
        c = chord(root, kind)
        if t0 < dur - .3 and not _muted(t0, mute):
            s.note("bass", t0, c[0] - 12, beat * 1.2, 0.75)
        for off in (1, 2):
            t = t0 + off * beat
            if t < dur - .3 and not _muted(t, mute):
                for n in c[1:3]:
                    s.note("guitar", t, n + 12, beat * 0.6, 0.38, pan=-0.3)
    mel = [(3, "A4", 1), (4, "D5", 1), (5, "F#5", 1), (6, "E5", 2), (8, "C#5", 1), (9, "D5", 3), (12, "F#5", 1), (13, "G5", 1),
           (14, "A5", 1), (15, "F#5", 2), (17, "E5", 1), (18, "D5", 3), (21, "C#5", 1), (22, "D5", 1), (23, "E5", 1), (24, "F#5", 2)]
    for b, n, d in mel:
        t = .2 + b * beat
        if t < dur - .4 and not _muted(t, mute):
            s.note("accordion", t, n, d * beat, 0.62, pan=0.15)
    s.note("accordion", 15.7, "D5", 0.8, 0.7, pan=0.1)
    s.note("bass", 15.7, "D1", 0.8, 0.8)
    return s.mix({"accordion": 1.0, "guitar": 0.6, "bass": 0.8}, reverb=0.14, out=out)


def ep137(out):
    """The wedding: festive filarmónica in Bb; drops under grandma's "O casamento é barato. A festa é que não." (13.2-16.0)."""
    beat, dur = 60 / 112, 17.2
    s = Sampler(dur, seed=37)
    mute = [(13.2, 16.0)]
    prog = [("Bb1", "M"), ("F2", "7"), ("Bb1", "M"), ("Eb2", "M"), ("Bb1", "M"), ("G2", "m"), ("C2", "m"), ("F2", "7")]
    for bar in range(int(dur / (4 * beat)) + 1):
        root, kind = prog[bar % len(prog)]
        t0 = bar * 4 * beat
        c = chord(root, kind)
        for off, n in ((0, c[0]), (2, c[2] - 12)):
            t = t0 + off * beat
            if t < dur - .3 and not _muted(t, mute):
                s.note("tuba_stac", t, n, beat * 0.7, 0.75)
        for off in (1, 3):
            t = t0 + off * beat
            if t < dur - .3 and not _muted(t, mute):
                for n in c[1:3]:
                    s.note("trombone_stac", t, n + 24, beat * 0.45, 0.5, pan=-0.3)
    mel = [(0, "F4", 1), (1, "Bb4", 1), (2, "D5", 2), (4, "C5", 1), (5, "Bb4", 1), (6, "A4", 2), (8, "Bb4", 1), (9, "C5", 1),
           (10, "D5", 1.5), (11.5, "Eb5", 0.5), (12, "F5", 2), (14, "D5", 2), (16, "G4", 1), (17, "Bb4", 1), (18, "Eb5", 2),
           (20, "D5", 1), (21, "C5", 1), (22, "Bb4", 2), (24, "F5", 2), (26, "D5", 1), (27, "C5", 1), (28, "Bb4", 2)]
    for b, n, d in mel:
        t = b * beat
        if t < dur - .6 and not _muted(t, mute):
            s.note("trumpet" if d >= 1 else "trumpet_stac", t, n, d * beat, 0.75, pan=0.2)
            s.note("clarinet" if d >= 1 else "clarinet_stac", t, midi(n) - 12, d * beat, 0.4, pan=0.4)
    s.note("trumpet_stac", 16.1, "Bb4", 0.5, 0.8, pan=0.1)
    s.note("tuba_stac", 16.1, "Bb1", 0.5, 0.8)
    return s.mix({"tuba_stac": 0.9, "trombone_stac": 0.55, "trumpet": 1.0, "trumpet_stac": 1.0, "clarinet": 0.5, "clarinet_stac": 0.5},
                 reverb=0.22, out=out)


def ep138(out):
    """The van: tasca guitars in A minor at dusk tempo; stops for "Aqui pode." (17.6-18.4), ringing note after."""
    lead = [(4, "E4", 2), (6, "D4", 1), (7, "C4", 1), (8, "B3", 2), (10, "C4", 2), (12, "A3", 2), (14, "E4", 2),
            (16, "F4", 1), (17, "E4", 1), (18, "D4", 2), (20, "C4", 2), (22, "B3", 2), (24, "A3", 2)]
    return _tasca_score(out, 19.6, [(17.6, 18.4)], 18.45, seed=38, bpm=84, lead=lead)


def _waltz(out, dur, mute, key, mel, end_t, seed, bpm=114):
    """Accordion street waltz (rua style) in a major key: bass on 1, guitar chords on 2-3, accordion melody; button at end_t."""
    beat = 60 / bpm
    s = Sampler(dur, seed=seed)
    I, V, IV = key
    prog = [I, V, V, I, IV, I, V, I]
    for bar in range(int(dur / (3 * beat)) + 1):
        root, kind = prog[bar % len(prog)]
        t0 = .2 + bar * 3 * beat
        c = chord(root, kind)
        if t0 < dur - .3 and not _muted(t0, mute):
            s.note("bass", t0, c[0] - 12, beat * 1.2, 0.75)
        for off in (1, 2):
            t = t0 + off * beat
            if t < dur - .3 and not _muted(t, mute):
                for n in c[1:3]:
                    s.note("guitar", t, n + 12, beat * 0.6, 0.38, pan=-0.3)
    for b, n, d in mel:
        t = .2 + b * beat
        if t < dur - .4 and not _muted(t, mute):
            s.note("accordion", t, n, d * beat, 0.62, pan=0.15)
    s.note("accordion", end_t, chord(*I)[1] + 12, 0.8, 0.7, pan=0.1)
    s.note("bass", end_t, chord(*I)[0] - 12, 0.8, 0.8)
    return s.mix({"accordion": 1.0, "guitar": 0.6, "bass": 0.8}, reverb=0.14, out=out)


def ep139(out):
    """IRS Jovem: bright waltz in A; drops under grandma's "Devias ter vindo mais cedo." (19.6-21.3)."""
    mel = [(3, "E5", 1), (4, "C#5", 1), (5, "A4", 1), (6, "B4", 2), (8, "G#4", 1), (9, "A4", 3), (12, "C#5", 1), (13, "D5", 1),
           (14, "E5", 1), (15, "F#5", 2), (17, "D5", 1), (18, "C#5", 3), (21, "B4", 1), (22, "C#5", 1), (23, "D5", 1), (24, "E5", 2),
           (26, "D5", 1), (27, "C#5", 2), (29, "B4", 1), (30, "A4", 3), (33, "E5", 2), (35, "C#5", 1), (36, "A4", 3)]
    return _waltz(out, 22.4, [(19.6, 21.3)], (("A2", "M"), ("E2", "7"), ("D2", "M")), mel, 21.4, seed=39)


def ep140(out):
    """Crypto: quick tasca guitars in E minor feel (A minor score at 104 bpm); ringing note on Buck's "Oh, come ON."."""
    lead = [(4, "E4", 1), (5, "G4", 1), (6, "A4", 2), (8, "G4", 1), (9, "E4", 1), (10, "D4", 2), (12, "E4", 2), (14, "B3", 2),
            (16, "C4", 1), (17, "D4", 1), (18, "E4", 2), (20, "G4", 1), (21, "F4", 1), (22, "E4", 2), (24, "D4", 1), (25, "C4", 1),
            (26, "B3", 2), (28, "E4", 2), (30, "A3", 2)]
    return _tasca_score(out, 20.2, [(17.0, 17.3)], 19.2, seed=40, bpm=104, lead=lead)


def ep141(out):
    """The souls' table: slow fingerpicked guitar in A minor over the night room; hushed under grandma (16.7-end)."""
    beat, dur = 60 / 66, 19.0
    s = Sampler(dur, seed=41)
    s.ambience(FADO_ROOM, gain=0.06, start=120)
    mute = [(16.7, dur)]
    prog = [("A2", "m"), ("F2", "M"), ("C3", "M"), ("E2", "7"), ("A2", "m"), ("D3", "m"), ("E2", "7"), ("A2", "m")]
    for bar in range(int(dur / (4 * beat)) + 1):
        root, kind = prog[bar % len(prog)]
        t0 = bar * 4 * beat
        c = chord(root, kind)
        if t0 < dur - .3 and not _muted(t0, mute):
            s.note("bass", t0, c[0] - 12, 3 * beat, 0.55)
        for i, n in enumerate([c[0], c[2], c[1] + 12, c[2]] * 2):
            t = t0 + i * beat / 2
            if t < dur - .3 and not _muted(t, mute):
                s.note("guitar", t, n, beat * 1.2, 0.3 + 0.1 * (i % 4 == 0), pan=-0.3, bus="guitar_low")
    lead = [(4, "E4", 2), (6, "C4", 2), (8, "D4", 3), (11, "B3", 1), (12, "C4", 2), (14, "A3", 2), (16, "E4", 2), (18, "F4", 2)]
    for b, n, d in lead:
        t = b * beat
        if t < dur - .3 and not _muted(t, mute):
            s.note("guitar", t, n, d * beat, 0.55, pan=0.3, bus="guitar_lead")
    s.note("guitar", 17.9, "A2", 1.0, 0.4, bus="guitar_lead", release=0.8)
    return s.mix({"guitar_low": 0.7, "guitar_lead": 1.0, "bass": 0.7, "room": 1.0}, reverb=0.22, out=out)


if __name__ == "__main__":
    name = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else f"{name}.wav"
    pieces = {"tasca": tasca, "filarmonica": filarmonica, "rua": rua, "ep127": ep127, "ep128": ep128, "ep129": ep129,
              "ep130": ep130, "ep131": ep131, "ep132": ep132, "ep133": ep133, "ep134": ep134, "ep135": ep135, "ep136": ep136, "ep137": ep137, "ep138": ep138, "ep139": ep139, "ep140": ep140, "ep141": ep141}
    print(pieces[name](out))
