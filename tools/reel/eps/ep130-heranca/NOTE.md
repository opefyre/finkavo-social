# NOTE.md generation log

| Item | Model | Credits |
|---|---|---|
| frame-0 plate | gpt_image_2_5 medium | 0.5 |
| opening clip | kling3_0 pro 5 s silent | 7.5 |
| tiago_plant, dona_folded, cat-crown | gpt_image_2_5 medium | 1.5 |
| voices (shared batch with EP130–132) | ElevenLabs eleven_v4 | part of ~1,700 characters |
| music | own composition (tools/music/compose.py), CC0 samples | 0 |

Build: engine render with magenta opening, then tools/reel/layclip.sh <id> <seconds> lays the Kling clip underneath and normalises to -14 LUFS.

## Gates (10 Nov 2026)
All pass: frame 0 (real clip + hook), picture change, loudness -14.5 to -14.8 LUFS with peak at or under -1.5 dBFS, no silence over 0.4 s, 1080x1920 30 fps H.264, AAC 48 kHz. Frames looked at (14 per reel). Not checked: nobody listened.
