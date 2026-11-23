# Experiment, Dec 2026: what makes a Finkavo reel spread

Designed 23 Nov 2026. Status: design only, awaiting the owner's go.

## Question
With the style fixed (the 2D cartoon cast, our only style with a real track record), which of four choices changes reach?

## Factors (2 levels each)
| Factor | Level − | Level + |
|---|---|---|
| C Content | Comedy only (everyday Portuguese situation) | The same skit plus one verified money/admin fact at the end |
| D Distribution | Trial reel (non-followers first) | Normal reel |
| H Hook | Question ("How many…?") | Warning ("Don't…", "The mistake…") |
| L Length | ~14 s | ~20 s |

## Design
2^(4−1) fractional factorial, generator L = C·D·H (resolution IV: every main effect is clear of every
two-factor interaction). Eight runs per replicate, three replicates = **24 reels**.

- **Blocking:** one replicate per week (weeks 1–3), so trends over time (holidays, account changes) fall in the
  block term, not in a factor.
- **Randomisation:** run order shuffled within each week (seed 20261207). The weekly order is below.
- **Each main effect is compared 12 vs 12.** With our measured noise (SD of log reach 0.92 on 41 skits), that detects
  roughly a 2.5–3× reach difference, or a ~12-point skip-rate difference, at the usual 5% / 80% power.
- **Topics:** 24 everyday-Portugal situations, each with a real money/admin angle, written *before* assignment and
  randomly allocated to runs. The topic decides nothing; the factor levels do. This removes the topic/content confound
  that broke every earlier comparison.

## Held constant
Cast and drawing style, narrator voice, own music, captions template, hashtags, 15:00 Lisbon, one reel a day, quality
gates, cover rule (known symbols), no logos or real banknotes.

## Measures (48 h, from Instagram insights)
1. Primary: log(reach).
2. Skip rate, share of the reel watched, (saves + shares) per 1,000 reached.

## Analysis
Linear model: log(reach) ~ block + C + D + H + L, effects with 95% intervals. The same for skip rate. A factor "wins"
only if its interval excludes zero; otherwise the answer is "no detectable difference at this size".

## Run order
| Week | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| 1 | fact/trial/warning/14 | comedy/normal/warning/14 | fact/normal/warning/20 | fact/trial/question/20 | comedy/trial/warning/20 | comedy/trial/question/14 | fact/normal/question/14 | comedy/normal/question/20 |
| 2 | comedy/normal/warning/14 | comedy/trial/warning/20 | fact/normal/question/14 | fact/normal/warning/20 | fact/trial/warning/14 | comedy/trial/question/14 | comedy/normal/question/20 | fact/trial/question/20 |
| 3 | fact/trial/warning/14 | comedy/normal/warning/14 | fact/normal/warning/20 | comedy/trial/question/14 | comedy/trial/warning/20 | fact/normal/question/14 | fact/trial/question/20 | comedy/normal/question/20 |

## Timing
Starts 8 Dec, after the style test's last reel (6 Dec), and runs 24 days in a row (8–31 Dec). The old backlog reels
on those days, and EP141 (20 Dec), move after 31 Dec. No other posts are interleaved.

## Topics (written 23 Nov 2026, before assignment; facts not yet verified)
Each is one everyday situation (the comedy) with one money/admin angle (used only in "comedy + fact" runs). Checked
against past reel captions: none repeats a past reel. Every fact is researched from primary sources before production;
any that fails is replaced by the reserve list.

| # | Situation (comedy) | Money/admin angle (to verify) |
|---|---|---|
| 1 | The Christmas bonus arrives and Otto plans a trip… then sees the payslip | Subsídio de Natal is taxed (IRS withheld) |
| 2 | Grandma's raspadinha habit: "this one is the winner" | Lottery and raspadinha prizes are taxed above a threshold |
| 3 | Euromilhões office pool at work: who keeps the ticket? | Tax on the prize, who pays it |
| 4 | Splitting the tasca bill: 9 people, 1 receipt, 1 NIF | Only the NIF on the receipt gets the IRS deduction |
| 5 | The pharmacy queue: everyone knows the pharmacist | Pharmacy spending counts as health expense for IRS |
| 6 | The CTT notice: "we tried to deliver" (nobody rang) | How long the parcel waits, what customs charges cost |
| 7 | The phone contract with "fidelização": leaving costs more than staying | Rules on early-termination charges |
| 8 | Condomínio meeting: 3 hours about one light bulb | Who must pay condominium fees, and the reserve fund |
| 9 | The senhorio who only accepts cash | Landlord must issue electronic rent receipts; renter deduction |
| 10 | Black Friday: the "–70%" price that was the same last week | Shops must show the previous lowest price |
| 11 | Returning a Christmas gift: "no refunds, only vale" | When shops must accept returns (and when they don't) |
| 12 | The gym that can't be cancelled | Cancelling a contract: the notice rules |
| 13 | Baptism gift envelope: how much is "normal"? | Cash gifts between family and the stamp-duty rule |
| 14 | The supermarket loyalty points that expire the day before you use them | Rules on expiry and what shops must tell you |
| 15 | The car inspection (IPO) panic: the queue, the verdict | When IPO is due and the fine for missing it |
| 16 | Taxi from the airport: the "special price" | Official fares, receipts with NIF for expense claims |
| 17 | The trotinete parked in front of grandma's door | Where scooters can be parked, the fine |
| 18 | Selling the old sofa on OLX: 40 messages "is it available?" | When selling second-hand becomes taxable |
| 19 | The botija de gás delivery guy who knows your whole life | Social energy tariff / gas price support |
| 20 | Winter in a Portuguese flat: colder inside than outside | Energy efficiency support for homes |
| 21 | New Year's Eve: 12 raisins, 12 wishes, 0 savings | What changes in taxes on 1 January 2027 |
| 22 | Kids' school book list in September… paid in December | School expenses deduction (education) |
| 23 | The vet bill for the cat | Vet bills give an IRS deduction (VAT share) |
| 24 | The EMEL parking ticket under the wiper | How long you have to pay, and the discount for paying early |

Reserve (if a fact fails): the electricity bill "estimate"; the water meter reading; the post-Christmas gym rush; the
bakery that weighs the bread.
