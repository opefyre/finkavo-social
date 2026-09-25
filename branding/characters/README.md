# Character cast and expression library

Flat vector cartoon style. **Reuse these images, do not regenerate them.** Every scene starts from a file here, so the look
stays the same across episodes (the image tools cannot reproduce a character from a text prompt, only from a source image).

- `01-…09-*` — the nine base characters (Higgsfield `z_image`, ~0.15 credits each; 01-05 from the free Hugging Face Z-Image space).
- `expressions/<character>_<expression>.webp` — the expression library: same character, same pose, same canvas (880×1168), only the
  face changes. Made by editing the base image with `gpt_image_2_5` (medium, 0.5 credits each, from reference media).
- `cutouts/` — the same files with the background removed (`tools/reel/cutout.py`, joint-cropped so any two expressions of one
  character line up pixel for pixel). This is what reels load (`meta.images`).

Naming: `<character>_<expression>` in lower case, expression words joined with `-`. To add one: edit the character's base image with the
prompt "Keep this exact same character, same pose … Change ONLY his face: …", save it in `expressions/`, run
`NOCROP=1 python3 tools/reel/cutout.py in.webp out.webp`, then joint-crop with the other cutouts of that character.

## The cast

| # | Name | Role |
|---|---|---|
| 01 | Leo | the everyman newcomer, the viewer's stand-in |
| 02 | Nico | the paperwork nerd |
| 03 | Marta | the veteran expat |
| 04 | Otto | the eternally lost newcomer, the main victim |
| 05 | Buck | the clueless tourist |
| 06 | Sr. Carimbo | the deadpan clerk with the giant stamp ("carimbo" = stamp) |
| 07 | Sr. Renda | the smug landlord ("renda" = rent) |
| 08 | Zoe | the digital nomad |
| 09 | Dona Fernanda | the formidable Portuguese grandmother neighbour |

## Expressions available

**Otto (14):** worried (default) · hopeful · smug · angry · shocked · panic · confused · defeated · sleepy · side-eye · cry-laugh · celebrating · stubble (tired, weeks later) · ancient (long white beard, dusty suitcases)
**Sr. Carimbo (7):** deadpan (default) · smug · bored-asleep · angry · surprised · evil-grin · laughing
**Otto, other outfits** (no coat and suitcases; each set joint-cropped on its own canvas):
- at the table (sweater, on a chair): `otto-table_happy` (fork and knife) · `otto-table_plead` (cheeks full, hands up) · `otto-table_panic` · `otto-table_stuffed` (round as a ball)
- coat, no suitcases: `otto-coat_wave` · `otto-coat_cake` (fresh, holding a cake box) · `otto-coat_tired-cake` (stubble, cake box) · `otto-coat_phone` (stubble, phone to ear)
- summer: `otto-summer_happy` (towel, thumbs up) · `otto-summer_jacket` · `otto-summer_layers` (jacket, scarf, hat) · `otto-summer_bundled` (buried in winter clothes, sweating) · `otto-summer_shiver`
- sofa (pyjamas, bare feet): `otto-sofa_sneeze` · `otto-sofa_meh` · `otto-sofa_buried` (under blankets, thermometer)
- coat extras: `otto-coat_run` (sprinting, phone) · `otto-coat_remote` · `otto-coat_defeated` · `otto-coat_strain` · `otto-coat_ears` (hands over ears)
- in a plastic-covered rose armchair: `otto-armchair_sit` · `otto-armchair_sweat` · `otto-armchair_peel`
- casual extra: `otto-casual_awkward` (own canvas 488 wide, scratching head)
- grandma driving (side view, own 928×476 canvas): `dona-car_drive` · `dona-car_proud` · `dona-car_oh`
- carrying a food tower (9:16 canvas, drawn whole): `otto-tower_1` · `otto-tower_2` · `otto-tower_3` (hen on top)
- casual extras: `otto-casual_stubble` · `otto-casual_ancient` (long grey beard, cobweb)
- with a phone (sweater): `otto-phone_sleepy` · `otto-phone_shocked` · `otto-phone_panic` · `otto-phone_relief`
- casual standing (sweater, cupped hands): `otto-casual_excited` · `otto-casual_betrayed` · `otto-casual_grab` (heart eyes, reaching right)
**Sr. Renda (4):** smug · evil-grin · laughing · fake-sad
**Dona Fernanda (6):** knowing · skeptical · smirk · eye-roll · jacket (holding out a folded jacket, smug) · box (open box of cookies) · offended (hand on chest, pointing) · stir (spite-cooking a pot) · burger (night, dressing gown, caught eating) · coins · card · tea (tray of remedies) · sneeze · phone (panicking on a home phone) · phone-cry · hear (hand at ear, "WHAT?") · whisper (with remote) · notebook (reading glasses) · showphone (smartphone screen to viewer) · baby (knitted baby clothes) · pizza (eating a slice) · innocent (whistling, sauce on mouth)
**Marta:** `marta_phone` (showing her phone, excited) · `marta_wave` (shy wave, flowers)
**Others:** `buck_swim` · `buck_frozen` · `locals_beach` (couple in jackets on beach chairs) · `fans_stare` · `fans_nervous` (4 regulars, green scarves, waist-up) · `otto-casual_goal` · `otto-casual_oops` (red scarf) · `buck_map` · `buck_climb` · `buck_crawl` (wide canvas) · `oldlady_bags` (tiny local lady, walking right) · `zoe_laptop` · `zoe_zoom` · `zoe_glare` · `zoe_shock` (café chair, laptop) · `renda_present` (arms wide) · `buck_popcorn` · `leo_delivery` (pizza rider) · `pharmacist_polite` · `pharmacist_tired` (Sr. Carimbo in a white coat)
**Base cutouts:** `buck_default` · `leo_default` · `nico_default` · `marta_default` · `zoe_default` · `renda_default`
**Props** (`props/`): `food_bacalhau` · `food_bread` · `food_soup` · `food_chourico` · `food_rice` · `food_cake` · `food_natas` · `food_tupperware` · `tin` · `tin-sewing` · `tub` · `tub-soup` (frozen soup) · `bags` (a bag of bags) · `cookiebox` · `delivery-bag` · `burger` · `fries` · `pot` · `milk` · `bread-loaf` · `bananas` · `basket` · `coins` · `tea` · `honey` · `lemon` · `ointment` · `hotwater` · `blanket` · `thermometer` · `soup-chicken` · `printer` (with doily and rooster) · `remote` · `car` · `potatoes` · `hen` · `bacalhau-dry` · `cat` (flying) · `painting` · `router` · `fruitbowl` · `doily` · `porcelain-dog` · `pigeon` · `pigeon-nata` · `bed` · `stove` · `bulb` · `discoball` · `pastry-nata` · `pastry-berlim` · `pastry-travesseiro` · `pastry-arroz` · `pastry-queijada` · `pastry-paodeus`
**Sound:** `branding/sfx/` (ElevenLabs sound generation) and `branding/voices/<reel>/` (ElevenLabs voices); used with `E.clip`.
**Scenes** (`scenes/`, full-bleed video-call frames, no cutout): `call_forehead` · `call_nostrils` · `call_ear` · `call_portrait`

Cutout notes: chair gaps, bags and plates are near the background colour; after `cutout.py`, clear enclosed gaps and floor
shadows explicitly (a strict tolerance keeps plates and bags) and always check on magenta.

## Rules

- Never let the AI draw text or numbers on props; draw them in code.
- Check hands and props on every generated frame (extra limbs and floating objects were the two faults seen so far).
- Names are working names; change them freely.
