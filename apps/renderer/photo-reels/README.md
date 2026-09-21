# photo-reels (superseded)

The first hand-made reel kit: AI stock photo, glass panels, Fraunces headlines, music from `branding/assets/audio/music`.
New reels are made with [`../kinetic`](../kinetic) instead ([guide](../../../docs/kinetic-reels.md)). This kit stays because
its specs are the record of the reels already published and it still builds them.

```bash
cd apps/renderer/photo-reels
REEL_SPECS=specs-premios.mjs node preview.mjs          # settled stills + layout checks, no video → out/preview/
REEL_SPECS=specs-premios.mjs node build.mjs            # full render → out/<id>.mp4, -cover.png, -caption.txt
node captions.mjs premios                              # regenerate a caption from its spec → out/captions/
```

Timing is derived from word count in `reading.mjs` (3 words per second, plus overhead), not typed. Font rule: never put a
digit in the Fraunces headline (the "3" reads as a "5").
