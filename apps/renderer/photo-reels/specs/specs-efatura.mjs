/**
 * Reel — the NIF question at the till, and what it is actually worth.
 *
 * Core tax rather than labour law, and it starts from something that happens to every
 * person in Portugal several times a week: being asked "contribuinte?" at the counter.
 *
 * Verified against the deduction rules:
 *   despesas gerais familiares — 35% of the invoice, capped at EUR 250 per taxpayer
 *     (EUR 500 on a joint return)
 *   saúde — 15%, capped at EUR 1.000 per household
 *   educação — 30%, capped at EUR 800
 *   rendas de habitação permanente — 15%, capped at EUR 900 for 2026
 *   invoices have to be registered and validated on e-Fatura; anything still pending
 *     does not count
 *   the validation deadline is 25 February of the following year
 *
 * Checked rather than assumed: 25 February is a Wednesday in 2026 and a Thursday in
 * 2027, so the date stands as written. A widely repeated article claimed it fell on a
 * Saturday in 2026 and moved to 2 March; that is wrong.
 *
 * The reel avoids naming a tax year on screen, because the rates and caps outlive any
 * one of them and the caption carries the detail.
 */

import { holdsFor } from "../reading.mjs";

const scenes = [
  {
    type: "hook",
    kicker: "Shopping in Portugal",
    text: "Say yes when they ask for your NIF.",
    sub: "It puts the receipt on your tax return.",
  },
  {
    type: "dates",
    kicker: "What comes back",
    text: "A share of what you spent.",
    items: [
      { day: "35%", month: "of the bill", label: "Everyday spending" },
      { day: "15%", month: "of the bill", label: "Health" },
    ],
  },
  {
    type: "figure",
    kicker: "There is a ceiling",
    figure: "€250",
    text: "The most everyday spending gives back, per person.",
  },
  {
    type: "payoff",
    card: true,
    kicker: "By 25 February",
    text: "Invoices left pending do not count.",
    action: "Check e-Fatura before the deadline.",
  },
];

export function buildSpec() {
  return {
    id: "efatura-nif",
    photo: "receipt",
    source: "CIRS · deduções à coleta",
    music: "coffee-and-sharp-suits.mp3",
    holds: holdsFor(scenes),
    scenes,
    caption: {
      hook: "Shopping in Portugal: that question at the till — contribuinte? — is the difference between a receipt that counts on your IRS and one that does not.",
      body: `What each kind of spending gives back, as a deduction against the tax you owe:

· Everyday family spending — 35% of the invoice, up to €250 per person (€500 on a joint return). Groceries, clothes, fuel, water, electricity, gas
· Health — 15%, up to €1.000 per household
· Education — 30%, up to €800
· Rent on your permanent home — 15%, up to €900

Two things decide whether any of it reaches you:

1. Your NIF has to be on the invoice. That is what the question at the counter is for.
2. The invoice has to be validated on e-Fatura. Anything sitting in "pendente" is not counted, because the portal does not know which category it belongs to.

The deadline to validate the previous year's invoices is 25 February.

Worth knowing: the €250 ceiling on everyday spending is reached at about €715 of invoices, which most households pass early in the year. The categories with real headroom are health, education and rent.`,
      cta: "Finkavo tells you which receipts are worth keeping.",
      tags: [
        "#efatura", "#irs", "#impostos",
        "#deducoes", "#viveremportugal", "#expatsinportugal", "#Finkavo",
      ],
    },
  };
}
