# NOTE.md generation log

| Item | Model | Credits |
|---|---|---|
| frame-0 plate | gpt_image_2_5 medium | 0.5 |
| stove, knives, stairwell plates | gpt_image_2_5 medium | 1.5 |
| dona_point, dona_slam | gpt_image_2_5 medium | 1.0 |
| curtain clip (Kling 3.0 pro, 5 s, silent) | kling3_0 | 7.5 |
| curtain clip (Kling 3.0 pro, 5 s, silent) | kling3_0 | 7.5 |
| narrator, grandma, Otto, dad takes (shared batch) | ElevenLabs eleven_v4 | part of ~1,800 characters |
| music | own composition (tools/music/compose.py ep127), CC0 samples | 0 |

Build note: the engine renders the reel with magenta in the two living-room windows (0–3 s, 7–10 s); ffmpeg lays the Kling clip
(media/curtain-kling.mp4: 0–3.0 s and 1.8–4.8 s) underneath with chromakey 0xff00ff, then normalises to -14 LUFS.

## Gates (9 Nov 2026)
- Frame 0: real curtain motion, hook on screen; FRAME0 check passed.
- Picture change: 68% of runtime changing, longest hold 2.0 s → pass.
- Loudness -14.2 LUFS, peak -1.8 dBFS; no silence over 0.4 s; 1080x1920 30 fps H.264, AAC 48 kHz.
- No facts stated; the draught belief is played as a family belief, no medical claim.
- Not checked: nobody listened.
