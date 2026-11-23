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
