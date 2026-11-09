# EP127 storyboard (about 22 s, 30 fps)

Voices: **N** Finkavo Narrator `LSKH2rfiMj7AysE7xtJC` · **G** Dona Fernanda (grandma) `xIzR6egd3S3LJZbVW0c1` · **O** Otto `vBKc2FfBKJfcZNyEt1n6` · **D** Paulo (dad) `aLFUti4k8YKvtQGXv0UO`

| # | Time | Voice: line | Picture | Method | Motion / carry | Sound |
|---|---|---|---|---|---|---|
| 1 | 0.0–2.2 | N: "What's the deadliest thing in a Portuguese house?" | **Frame 0:** realistic Lisbon living room, lace curtain already billowing in, paper lifting off the sideboard; hook text big in the top third | realistic plate (parallax) + kinetic type | slow push-in; words land on the voice | wind gusting through a window gap, curtain flap at 0.05 s |
| 2 | 2.2–3.6 | N: "The gas?" | stove knob, red ✕ stamps it | 3D object (stove knob) + motion graphic | snap zoom in, ✕ slams | gas hiss cut by a dry stamp |
| 3 | 3.6–4.8 | N: "The knives?" | knife block, ✕ | 3D object | whip pan | knife ring, stamp |
| 4 | 4.8–6.2 | N: "The stairs? Please." | steep Lisbon stairwell, ✕ | realistic plate | whip pan down | footsteps, stamp |
| 5 | 6.2–8.6 | N: "It's invisible. And it just came through the window." | back in the room: the wind becomes visible as a flowing ribbon of particles through the window, curling round the sofa like a villain | particle simulation over the plate | camera follows the ribbon, carries into the hallway | low wind swell, a door creaks |
| 6 | 8.6–10.4 | G (PT): "Fecha a janela!" sub "Close the window!" | grandma (cast cutout) bursts in from the hallway, pointing | cartoon cast on the realistic plate | arrives from oversize, small camera shake | slipper slaps on tiles |
| 7 | 10.4–11.8 | O: "It's twenty-eight degrees..." | Otto in a T-shirt by the window, sweating | cast cutout + thermometer motion graphic (28 °C) | split frame | cicadas outside, fan hum |
| 8 | 11.8–13.4 | D: "Who opened the window?!" | dad storms in from the other side | cast cutout | whip pan | door bang |
| 9 | 13.4–16.0 | G: "Corrente de ar!" sub "A draught!" | the wind ribbon freezes; a WANTED poster slams over it: "CORRENTE DE AR" | motion graphic (poster), the particles become the poster's portrait | particles pull into the poster shape | paper slap on wall, single Portuguese-guitar sting |
| 10 | 16.0–19.6 | N: "The corrente de ar. Blamed for every cold, every stiff neck... and every family fight about the window." | quick montage on the poster's "crimes": a sneeze, a stiff neck, the window argument | motion graphics + cast reactions | each crime stamps on the poster | three small stamps, music builds |
| 11 | 19.6–22.0 | G: "Agora sim." sub "Now we're good." | grandma slams the window, curtains drop dead still; Otto now wrapped in a scarf and a vest, sweating | cast + plate | the curtain stops: the first still moment; logo small on the last frame | window slam, silence, one guitar note |

## Visual plan
- Realistic plates (Higgsfield, opaque): the living room (frame 0), the stairwell, the hallway. Parallax by splitting depth layers.
- 3D: stove knob and knife block (licensed CC0 models or image-to-3D), rendered as short RGBA moves in Blender on the spare Mac.
- The wind: a particle ribbon in HyperFrames (WebGL). This is the one job that wants the laptop: I'll ask before rendering it.
- Cast: grandma, Otto, dad from `branding/characters/`; new poses (grandma pointing, grandma slamming the window, Otto in scarf + vest) generated transparent from references.
- Motion graphics: red ✕ stamps, the thermometer, the WANTED poster with its "crimes" list. Picture changes every 1.2 to 2.6 s; no hold over 2 s until the final still curtain (deliberate).

## Sound plan
- Music (custom, composed by us): a mock-noir fado line on Portuguese guitar over upright bass and soft brushes, minor key, about 92 BPM; it stops dead on the window slam, then one guitar note resolves.
- Foley (real, physical): wind through a window gap, lace curtain flapping, gas hiss, knife ring, stair footsteps, slipper on tiles, door bang, paper on wall, window slam. From `branding/sfx/` first, then ElevenLabs effects.
- Voices: narrator 5 lines; grandma 3, Otto 1, dad 1.
- Mix: music at least 12 LU under speech, -14 LUFS.

## Estimated spend
- Higgsfield: about 6 to 8 images (plates + poses) ≈ 4 to 8 credits; no video clips.
- ElevenLabs: narrator and 3 character takes plus 3 to 5 new effects ≈ 800 to 1,200 characters/credits.
