# Grandma reels — production plan (EP6–EP8)

Three reels built on jokes every culture recognises (the grandma who overfeeds, the endless goodbye, "take a jacket").
Portugal is the warm backdrop, not the problem. Cast: Dona Fernanda (grandma/neighbour) and Otto, plus cameos.
Each reel: 12–15 s, one-line title visible on frame 0, a new beat every 0.4–1.5 s, three-step escalation, a montage,
one twist, a closing button, logo pulse, loops cleanly. Effects-only and music versions.

## The fix that makes these work: new Otto poses

Every current Otto image wears a winter coat and holds two suitcases. That breaks a lunch table, a doorway and a beach.
New images, edited from `04-otto.webp` (same face, green beanie kept as his signature), `gpt_image_2_5` medium, 0.5 credits each:

| Reel | Image | Use |
|---|---|---|
| A | otto_table-happy: seated, cosy sweater, fork and knife in hands, chewing, happy | opening |
| A | otto_table-plead: same pose, hands up "no more", pleading | "I'm full" beats |
| A | otto_table-panic: same pose, eyes huge | the record-scratch |
| A | otto_stuffed: same pose, body round as a ball, cheeks puffed, button popped | end of montage, the roll |
| A | food sheet: bacalhau plate, bread basket, bowl of soup, chouriço, rice, cake, pastel de nata, stacked tupperware (no text) | the dishes that land |
| B | otto_leaving: winter coat and scarf, NO suitcases, hand raised waving | the door |
| B | otto_leaving-tired: same, stubble, dark eyes, holding a cake box | sunrise |
| B | otto_phone: same, holding a phone to his ear, defeated | the twist |
| C | otto_summer: t-shirt, shorts, sunglasses, beach bag, happy | the door |
| C | otto_bundled: buried in jacket, scarves, gloves, blanket, red face, sweating | the montage peak |
| C | otto_shiver: summer clothes, arms hugging himself, teeth chattering | the breeze |
| C | dona_jacket: Dona holding out a folded jacket, smug | the twist |

12 images ≈ 6 credits (preflight 0.5 each confirmed; balance 438). Leo, Marta, Nico, Zoe, Buck cutouts for B are free
(`cutout.py`). Every image: check hands and props, no AI text, cutout checked enlarged on magenta, joint-cropped per set.
Backgrounds, tables, doors, clocks, thermometers and all text are drawn in code.

---

## A — "Lunch at grandma's" (≈14 s)

Kitchen: azulejo wall, window, red-white checked tablecloth. Otto seated behind the table, Dona standing right with the
wooden spoon, a pot on the table. Speech bubbles for dialogue; Portuguese line with its English in small type under it.

| t (s) | Picture | Words | Sound |
|---|---|---|---|
| 0.0 | Title on frame 0. Otto eating, happy, small plate | **Lunch at grandma's** | clink |
| 1.0 | Otto leans back, pats belly | "I'm full, thanks!" | — |
| 1.8 | Dona smirks, spoon slams: pile ×2. Counter top-right | "Come mais!" *(eat more)* · PLATE 2 | splat |
| 3.0 | Otto hands up; pile ×3, bread basket slides in | "No, really…" · PLATE 3 | splat, pop |
| 4.0 | Otto begs; pile towers, soup bowl lands | "Please." · PLATE 4 | splat |
| 5.0 | Record scratch, push-in on Otto (panic) | — | scratch |
| 5.3–9.0 | Montage, a dish every 0.45 s; Otto widens each hit; table bows; sweat | PLATE 5 → 14 | pops, rising pitch |
| 9.0 | Table snaps in half; Otto (stuffed) drops | — | crack, thud, shake |
| 9.5 | Otto rolls out of the door | — | whoosh, door slam |
| 10.6 | Dona alone, turns to camera, sceptical | "He barely ate." | silence, then ding |
| 12.0 | She hurls a tupperware tower out the door | — | whoosh … thud, "oof" |
| 13.2 | Logo pulse; loops to the small plate | — | — |

Caption hook: "She will not accept 'I'm full' 😭" · bait: "Tag the person who feeds you like this 👇"

## B — "Leaving a Portuguese party" (≈14.5 s)

Hallway: door left, wall clock, window showing the sky. Otto at the door in his coat.

| t (s) | Picture | Words | Sound |
|---|---|---|---|
| 0.0 | Title on frame 0. Otto at door, hand up. Clock 22:00, night | **Leaving a Portuguese party** | — |
| 0.4 | | "Ok, I'm going!" | pop |
| 1.2 | Dona piles a cake box into his arms; clock 22:40 | "Wait, take some cake!" | swish, tick |
| 2.6 | Marta pops in with her phone; clock 23:50 | "Did you see my holiday photos?" | pop, tick |
| 4.0 | Leo pops in; clock 01:10 | "And how's your mother?" | pop, tick |
| 5.3 | Otto tries again | "Ok… bye!" | — |
| 5.6–9.0 | Goodbye kisses: every relative leans in twice (Nico, Zoe, Buck, Leo, Marta, Dona); clock spins; sky night → dawn | KISSES: 2 → 24 | smack ×12, clock whirr |
| 9.0 | Sunrise, rooster; Otto tired, stubble | 06:30 | rooster |
| 9.8 | Otto out, door shuts. Cut: his sofa, he collapses | — | slam, thud |
| 11.0 | Phone buzzes | "Chegaste bem?" *(home safe?)* | buzz |
| 12.2 | Otto defeated | "…oh, one more thing!" | ding |
| 13.4 | Logo pulse; loop to the door at 22:00 | — | — |

Caption hook: "A Portuguese goodbye takes longer than the party 😅" · bait: "Tag the friend who says bye 6 times 👇"

## C — "32°C. Grandma:" (≈12.5 s)

Front door, bright sun, a thermometer drawn in code. Otto in summer clothes; Dona blocks the door.

| t (s) | Picture | Words | Sound |
|---|---|---|---|
| 0.0 | Title on frame 0. Otto happy, beach bag. Thermometer 32°C | **32°C. Grandma:** | cicadas |
| 0.6 | A jacket flies onto Otto | "Leva um casaco!" *(take a jacket!)* | swish, thud |
| 1.8 | Scarf; 34°C | "And a scarf." | swish |
| 2.8 | Beanie; 36°C | "It's windy." | swish |
| 3.6–6.6 | Montage: gloves, second coat, blanket, thermos of soup; 38 → 44°C, thermometer red and shaking; Otto buried (bundled), sweat flying | — | swishes, rising sizzle |
| 7.0 | Cut: beach. Otto tears it all off, relief | — | pop ×5, waves |
| 8.8 | One tiny breeze; Otto shivers (shiver) | — | small swish |
| 9.8 | Dona pops up behind the parasol holding the jacket, smug | "Eu disse." *(told you.)* | ding |
| 11.2 | Logo pulse; loop | — | — |

Caption hook: "Portuguese grandmas and the fear of 'apanhar frio' 🧥" · bait: "Tag the one who always brings a jacket 👇"

---

Caption ending for all three: "Exaggerated for laughs. Mostly." + "Ask Finkavo, every answer cites the law." + 5 hashtags
(3 topic, #viveremportugal, #Finkavo). No facts or figures are claimed on screen; the Portuguese lines are everyday phrases.

## Order and checks

A first, then B, then C. For each: generate and check the images → cutouts on magenta → `--check` → stills sheet →
render → frames from the mp4 → send to the owner. Not verifiable here: the sound by ear.
