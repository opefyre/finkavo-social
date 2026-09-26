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
- casual standing (sweater, cupped hands): `otto-casual_excited` · `otto-casual_betrayed` · `otto-casual_grab` (heart eyes, reaching right) · `otto-casual_nose` (holding a bumped nose, stars) · `otto-casual_bucket` (holding a blue bucket, worried) — same 625×1078 canvas
- casual (EP40–42): `otto-casual_wallet` (cards flying) · `otto-casual_card` (squinting at a card) · `otto-casual_fast` (finger up, rattling it off) · `otto-casual_beer` · `otto-casual_beer-frozen` (same canvas) · `otto-casual_shiver` (scarf, gloves) · `otto-casual_burrito` (three duvets, hot-water bottle) · `otto-casual_window` (side view, arms pushing a window open) · `otto-casual_bench` (sunbathing on a green bench, blanket)
- side view, facing right (own canvases): `otto-side_kiss` (leaning in, puckered) · `otto-side_hand` (handshake and pucker at once, confused)
- `otto-boat` (yellow dinghy, life vest, oar; wide 864×625 canvas, faces right)
**Sr. Renda (4):** smug · evil-grin · laughing · fake-sad
**Dona Fernanda (6):** knowing · skeptical · smirk · eye-roll · jacket (holding out a folded jacket, smug) · box (open box of cookies) · offended (hand on chest, pointing) · stir (spite-cooking a pot) · burger (night, dressing gown, caught eating) · coins · card · tea (tray of remedies) · sneeze · phone (panicking on a home phone) · phone-cry · hear (hand at ear, "WHAT?") · whisper (with remote) · notebook (reading glasses) · showphone (smartphone screen to viewer) · baby (knitted baby clothes) · pizza (eating a slice) · innocent (whistling, sauce on mouth)
**Marta:** `marta_phone` (showing her phone, excited) · `marta_wave` (shy wave, flowers)
**Café:** `barman_talk` · `barman_smile` · `barman_stare` (holding a tiny plastic cup) · `locals_espresso` (3 locals at the bar, shocked) · `buck_order` · `buck_tinycup`
**Others:** `otto-casual_proud` (phone up) · `otto-casual_loaded` (gifts, one sock) · `neighbour_album` · `anchor_grave` (TV news anchor) · `locals_umbrellas` · `locals_sunny` · `buck_drizzle` · `fadista_sing` · `fadista_glare` · `fadista_point` · `guitarist` · `fado_audience` (shushing) · `otto-chair_crisps` · `otto-chair_phone` · `oldlady_trolley` · `buck_swim` · `buck_frozen` · `locals_beach` (couple in jackets on beach chairs) · `fans_stare` · `fans_nervous` (4 regulars, green scarves, waist-up) · `otto-casual_goal` · `otto-casual_oops` (red scarf) · `buck_map` · `buck_climb` · `buck_crawl` (wide canvas) · `oldlady_bags` (tiny local lady, walking right) · `zoe_laptop` · `zoe_zoom` · `zoe_glare` · `zoe_shock` (café chair, laptop) · `renda_present` (arms wide) · `buck_popcorn` · `leo_delivery` (pizza rider) · `pharmacist_polite` · `pharmacist_tired` (Sr. Carimbo in a white coat)
**Greetings (EP37), all facing left:** `french_kiss` (beret, leaning in for a kiss) · `american_hug` (hoodie, charging with arms wide) · `british_hand` (tweed, stiff handshake)
**Plumber (EP38):** `plumber_phone` (on the phone, thumbs up) · `plumber_shrug` (red toolbox, shrug)
**Tasca (EP41):** `buck-chair_fork` · `buck-chair_bread` · `buck-chair_shock` (seated, napkin; same canvas) · `buck-chair_bomb` (bomb-disposal suit, long tongs, wide canvas)
**Others (EP40, EP42):** `cashier_ask` (supermarket, red polo) · `woman_ask` · `woman_meh` (green dress, phone; same canvas) · `swede_wave` · `swede_puzzled` (T-shirt, shorts, wool socks, ice cream; same canvas)
**Terrace / delivery (EP44–45):** `waiter_tray` · `waiter_offended` · `waiter_facepalm` (white jacket, bow tie, tray; same canvas) · `buck_hola` · `buck_sorry` (same canvas) · `courier_sneak` (tiptoeing, parcel, faces left) · `courier_stick` (slapping a note, faces left) · `otto-casual_stool` (coffee, faces right) · `otto-casual_sleepbag` · `otto-casual_listen` (ear to a wall, faces right)
**Waiting room (EP46):** `oldman_ask` · `oldman_seated` (flat cap, cane) · `lady_ask` · `lady_seated` (purple blouse, handbag) · `dona_seated` · `leo_seated` · `marta_seated` (all seated ones on grey plastic chairs)
**Lisbon vs Porto (EP47):** `portobar_neutral` · `portobar_stare` (waist-up, same canvas)
**Night out (EP48):** `otto-casual_dance` · `otto-casual_barsleep` (on a bar stool, faces right) · `otto-casual_yawn` (walking left) · `otto-jog` (hoodie, running right) · `dj_phone` · `bouncer_yawn` · `crowd_night` (5 dressed-up, walking right) · `crowd_dawn` (4 with bifanas, walking left)
**Calçada / Multibanco / used car (EP49–51):** `otto-casual_stroll` (whistling, walking right) · `otto-casual_slip` · `otto-casual_spin` · `otto-casual_split` (wide canvas) · `dona_umbrella` (walking right) · `judges_bench` (3 old men with blank score cards) · `otto-casual_press` (pressing a button, faces right) · `otto-casual_jawdrop` · `salesman_present` · `salesman_pronto` (same canvas) · props `car_old` · `car_old-nodoor` (same canvas)
**Wedding / cat / -inho (EP52–54):** `otto-suit_happy` · `otto-suit_stuffed` · `otto-suit_asleep` (seated, same canvas) · `otto-suit_dragged` · `dona_dance` · `bride_groom` · `cat_walk` · `cat_beg` · `cat_fat` (orange tabby, torn ear) · `posh_lady` (faces left) · `girl_bowl` (yellow raincoat, faces left) · `otto-casual_hike` (backpack, exhausted)
**Parking / barber / Nazaré (EP55–57):** `arrumador_wave` · `arrumador_hand` (yellow vest, faces left, same canvas) · `otto-car` (yellow car, Otto driving, faces right) · `otto-casual_coin` · `barber_talk` · `barber_mirror` · `otto-cape_hair` · `otto-cape_bald` (no beanie, barber chair, same canvas) · `buck_surf` · `buck_run` · `buck_beach` · `dona_surf` (surfing and knitting)
**Condo / Bolo-Rei / desenrascanço (EP58–60):** `otto-casual_seated` · `otto-casual_seated-old` (grey plastic chair, same canvas) · `otto-ladder` (screwing in a bulb) · `family_chew` · `family_cheer` (4 in Christmas jumpers, waist-up, same canvas) · `ze_tape` (duct tape + coat hanger) · `ze_proud` (thumbs up, tear) · `otto-casual_tape` · `otto-casual_phonedespair` · prop `bolo-rei`
**Base cutouts:** `buck_default` · `leo_default` · `nico_default` · `marta_default` · `zoe_default` · `renda_default`
**Props** (`props/`): `food_bacalhau` · `food_bread` · `food_soup` · `food_chourico` · `food_rice` · `food_cake` · `food_natas` · `food_tupperware` · `tin` · `tin-sewing` · `tub` · `tub-soup` (frozen soup) · `bags` (a bag of bags) · `cookiebox` · `delivery-bag` · `burger` · `fries` · `pot` · `milk` · `bread-loaf` · `bananas` · `basket` · `coins` · `tea` · `honey` · `lemon` · `ointment` · `hotwater` · `blanket` · `thermometer` · `soup-chicken` · `printer` (with doily and rooster) · `remote` · `car` · `potatoes` · `hen` · `bacalhau-dry` · `cat` (flying) · `painting` · `router` · `fruitbowl` · `doily` · `porcelain-dog` · `pigeon` · `pigeon-nata` · `bed` · `stove` · `bulb` · `discoball` · `pastry-nata` · `pastry-berlim` · `pastry-travesseiro` · `pastry-arroz` · `pastry-queijada` · `pastry-paodeus` · `sock` · `pigeon-nest` · `couvert-bread` · `couvert-olives` · `couvert-cheese` · `couvert-butter` · `couvert-pate` · `couvert-sardines` · `map-iberia` (square, Portugal green, Spain orange)
**Sound:** `branding/sfx/` (ElevenLabs sound generation) and `branding/voices/<reel>/` (ElevenLabs voices); used with `E.clip`.
**Scenes** (`scenes/`, full-bleed video-call frames, no cutout): `call_forehead` · `call_nostrils` · `call_ear` · `call_portrait`

Cutout notes: chair gaps, bags and plates are near the background colour; after `cutout.py`, clear enclosed gaps and floor
shadows explicitly (a strict tolerance keeps plates and bags) and always check on magenta.

## Rules

- Never let the AI draw text or numbers on props; draw them in code.
- Check hands and props on every generated frame (extra limbs and floating objects were the two faults seen so far).
- Names are working names; change them freely.
