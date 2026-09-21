/**
 * Reel 8 — subsídio de alimentação, and why the card is worth more than the cash.
 *
 * The 2026 exemption ceilings: EUR 6,15 a day paid in cash, EUR 10,46 a day paid on a
 * meal card. The two are not independent numbers — CIRS art. 2.º sets the card ceiling
 * at the cash ceiling plus 70%, and 6,15 x 1,7 = 10,455, which rounds to 10,46. That
 * arithmetic is the reason to trust the pair.
 *
 * Anything above the ceiling is taxed as normal pay and carries social security. The
 * allowance is only owed for days actually worked.
 *
 * The reel deliberately does not say the card is "better" without saying why: the money
 * is the same, the tax is not.
 */

import { holdsFor } from "../reading.mjs";

const scenes = [
  {
    type: "hook",
    kicker: "Meal allowance in Portugal",
    text: "The card is worth more than the cash.",
    sub: "Same money from your employer, different tax.",
  },
  {
    type: "dates",
    kicker: "Tax-free per working day",
    text: "The 2026 ceilings.",
    items: [
      { day: "€6,15", month: "a day", label: "Paid in cash" },
      { day: "€10,46", month: "a day", label: "On a meal card" },
    ],
  },
  {
    type: "figure",
    kicker: "The gap",
    figure: "€4,31",
    text: "More reaches you untaxed each day, just for the card.",
  },
  {
    type: "payoff",
    card: true,
    kicker: "Across a working month",
    text: "That is about €95 you would otherwise be taxed on.",
    action: "Ask how yours is paid.",
  },
];

export function buildSpec() {
  return {
    id: "subsidio-alimentacao",
    photo: "meal",
    source: "CIRS art. 2.º · limites de isenção 2026",
    music: "apricot-afternoon.mp3",
    holds: holdsFor(scenes),
    scenes,
    caption: {
      hook: "Meal allowance in Portugal: the same money is taxed differently depending on whether it reaches you as cash or on a meal card.",
      body: `The 2026 ceilings, per day actually worked, set by Portaria n.º 51-B/2026:

· Paid in cash — up to €6,15 free of IRS and Social Security
· Paid on a meal card — up to €10,46 free of IRS and Social Security

The two are linked rather than independent: CIRS art. 2.º sets the card ceiling at the cash ceiling plus 70%, and 6,15 × 1,7 = 10,46.

Anything above the ceiling is treated as ordinary pay: it is taxed and it carries social security contributions.

The difference is €4,31 a day. Over a typical 22 working days that is roughly €95 a month that reaches you whole instead of being taxed.

Two things worth knowing: the allowance is only due for days you actually work — holidays included, it is not paid for days you did not work — and it does not form part of your base salary.`,
      cta: "Finkavo checks what your payslip should say.",
      tags: [
        "#subsidiodealimentacao", "#cartaorefeicao", "#irs",
        "#trabalharemportugal", "#viveremportugal", "#expatsinportugal", "#Finkavo",
      ],
    },
  };
}
