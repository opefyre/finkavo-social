/**
 * Reel 6 — holiday days, and the belief that they roll over.
 *
 * WHO THIS IS FOR: anyone on a contrato de trabalho in Portugal, which is most people
 * working here. Nothing in it assumes the viewer has seen the account before or knows a
 * single Portuguese legal term.
 *
 * Checked against the article text, not summaries:
 *   22 dias úteis a year is the legal minimum, and dias úteis are Monday to Friday
 *     excluding public holidays                                    — art. 238.º n.º 1 e 2
 *   holiday is taken in the calendar year in which it accrues      — art. 240.º n.º 1
 *   it may run to 30 April of the following year ONLY by agreement with the employer,
 *     or to take it with a family member living abroad             — art. 240.º n.º 2
 *   on termination the worker is paid the holiday pay AND the subsídio for days
 *     accrued and not taken, plus the proportional part for the year — art. 245.º
 *
 * THE CORRECTION THIS REEL EXISTS FOR: "you have until April" is repeated everywhere as
 * if it were an entitlement. It is not. The default is that the days end with the year,
 * and April is a concession the employer has to agree to. Saying it the common way round
 * would be the kind of confident wrongness this account cannot afford, so the reel says
 * what is actually true and puts the agreement on screen.
 *
 * TIMING is derived from the copy by holdFor(), and re-checked in the build: every scene
 * has to be readable at 3 words a second and to finish animating in before it leaves.
 */

import { holdsFor } from "../reading.mjs";

const scenes = [
  {
    type: "hook",
    kicker: "Working in Portugal",
    text: "Your holiday days do not roll over.",
    sub: "By law you take them in the same calendar year.",
  },
  {
    type: "figure",
    kicker: "What you are owed",
    figure: "22 days",
    text: "Every year. Weekends and public holidays are not counted.",
  },
  {
    // The correction, with the condition on screen rather than implied.
    type: "dates",
    kicker: "Carrying days into next year",
    text: "Your employer must agree.",
    items: [
      { day: "31", month: "Dec", label: "The default limit" },
      { day: "30", month: "Apr", label: "Only if agreed" },
    ],
  },
  {
    type: "payoff",
    card: true,
    kicker: "If you leave with days left",
    text: "They have to be paid out.",
    action: "Book them, or get the agreement in writing.",
  },
];

export function buildSpec() {
  return {
    id: "ferias-2026",
    photo: "calendar",
    source: "Código do Trabalho · art. 238.º, 240.º e 245.º",
    music: "apricot-afternoon.mp3",
    holds: holdsFor(scenes),
    scenes,
    caption: {
      hook: "Working in Portugal: your holiday days do not automatically roll into next year. The default is that they end with the year.",
      body: `How much you get — art. 238.º:
· 22 dias úteis a year, as a legal minimum
· Dias úteis are Monday to Friday, and public holidays do not count

When you have to take them — art. 240.º:
· The rule is the calendar year in which they accrue
· They can run to 30 April of the following year only if your employer agrees, or if you are taking them with a family member living abroad
· Up to half of last year's days can be added to this year's, again by agreement

"You have until April" gets repeated as though it were a right. It is a concession, and it needs a yes from your employer. Ask for it in writing.

If you leave with days untaken — art. 245.º: you are paid the holiday pay and the holiday subsídio for the days you accrued and did not take, plus the proportional part for your final year.

In your first year the rule is different: two working days for each month of the contract, up to 20 days, and you can only take them after six complete months — art. 239.º.`,
      cta: "Finkavo tracks what you are owed, with the article behind it.",
      tags: [
        "#ferias", "#direitodotrabalho", "#contratodetrabalho",
        "#trabalharemportugal", "#viveremportugal", "#expatsinportugal", "#Finkavo",
      ],
    },
  };
}
