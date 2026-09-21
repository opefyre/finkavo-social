/**
 * Reel 2 — the contribution dial.
 *
 * WHY THIS TOPIC, and what I threw away to get here:
 *
 * The first candidate was the first-year Social Security exemption. Dropped: the
 * official Segurança Social wording ties the quarterly declaration to workers "when
 * required to pay contributions", which contradicts the accountancy blogs that say
 * you must file all through the exemption. Unresolved, so unusable.
 *
 * The second was CIRS art. 31.º n.º 13 — the 15% of gross you must justify with
 * receipts under the regime simplificado. It reads like a trap until you check the
 * primary text: item a) already counts the art. 25.º specific deduction (EUR 4.104)
 * OR your social security contributions, whichever is higher. Contributions run at
 * 21,4% of 70% of gross, which is 14,98% of gross — so for anyone paying in full the
 * 15% is covered by contributions alone and there is no trap. A reel on it would have
 * been confidently wrong.
 *
 * What survived is better anyway, because it is a lever rather than a warning: at the
 * moment of the quarterly declaration you may fix a relevant income up to 25% above or
 * below the declared figure, in 5% steps. Almost nobody moves it. It is unambiguous,
 * it is in force, it has a real deadline this quarter, and it has an honest catch —
 * the same number that sets the bill sets the cover. That catch is the story.
 *
 * Every figure on screen is derived, not quoted from a blog:
 *   relevant income = 70% of services invoiced          — rendimento relevante
 *   monthly base    = 1/3 of the quarter's relevant income — art. 163.º n.º 1
 *   rate            = 21,4% for trabalhadores independentes — art. 168.º n.º 1
 *   option          = +/-25%, in 5% steps                  — art. 164.º
 * For a steady EUR 3.000 month: base 2.100, contribution 449,40 -> 337,05 / 561,75.
 */

/** Last day of the month the Q3 declaration is due in. Art. 164.º: Jan, Apr, Jul, Oct. */
export const Q3_DEADLINE = "2026-10-31";

const RATE = 0.214;        // art. 168.º n.º 1
const RELEVANT = 0.70;     // rendimento relevante for prestação de serviços
const MONTHLY_INVOICED = 3000;

const eur = (n) => `€${Math.round(n)}`;
const base = MONTHLY_INVOICED * RELEVANT;

export function buildSpec() {
  return {
    id: "ss-dial",
    photo: "ss",
    source: "Código Contributivo · art. 163.º, 164.º e 168.º",
    music: "apricot-afternoon.mp3",
    // The turn gets the most air. It is the part that makes the hook honest, and it is
    // the reason to follow rather than just to save.
    holds: [3.0, 3.6, 4.0, 4.2, 3.4],
    scenes: [
      {
        // A benefit, stated precisely, plus an open loop. "There is a catch" is the
        // line that buys the next twelve seconds.
        type: "hook",
        kicker: "Recibos verdes",
        text: "You can cut your Segurança Social bill by 25%.",
        sub: "Legally, in the quarterly declaration. Almost nobody does — and there is a catch worth knowing.",
      },
      {
        type: "figure",
        kicker: "What you pay now",
        figure: eur(base * RATE),
        text: `A €${MONTHLY_INVOICED.toLocaleString("en-GB")} month. Your base is 70% of it. The rate is 21,4%.`,
      },
      {
        type: "dates",
        kicker: "Up to ±25%, in steps of 5%",
        text: "Same declaration. Different bill.",
        items: [
          { day: eur(base * 0.75 * RATE), month: "−25%", label: "Lower" },
          { day: eur(base * 1.25 * RATE), month: "+25%", label: "Higher" },
        ],
      },
      {
        // The catch, and the reason this is not just a money-saving tip. Without it the
        // reel would be advice that quietly costs people their sick pay.
        type: "hook",
        kicker: "The catch",
        text: "It is a dial, not a discount.",
        sub: "That same number sets your sick pay, parental leave and pension. Turn the bill down and you turn the cover down with it.",
      },
      {
        type: "payoff",
        card: true,
        kicker: "Q3 closes 31 October",
        text: "Segurança Social Direta → Declaração Trimestral.",
        action: "The dial only exists while you file.",
      },
    ],
    caption: {
      hook: "Recibos verdes: you can move your Segurança Social bill up to 25% in either direction — and almost nobody touches it.",
      body: `When you file the declaração trimestral you can fix a rendimento relevante up to 25% above or below the figure your invoices produce, in steps of 5%.

How the bill is built:
· Rendimento relevante = 70% of the services you invoiced
· Monthly base = 1/3 of the quarter's relevant income — art. 163.º n.º 1
· Rate = 21,4% for trabalhadores independentes — art. 168.º n.º 1
· The ±25% option — art. 164.º

On a steady €3.000 month that is a €449 contribution, which the dial moves to €337 or €562.

The catch is the part most posts leave out: the contribution base is also the figure your subsídio de doença, parental leave and pension are calculated from. Turning the bill down turns the cover down with it. It is a dial, not a discount.

Q3 (July–September) is declared by 31 October. Note it falls on a Saturday.`,
      cta: "Finkavo tracks the quarters and the articles behind them.",
      tags: [
        "#recibosverdes", "#segurancasocial", "#trabalhadorindependente",
        "#freelanceportugal", "#portugaltax", "#expatsinportugal", "#Finkavo",
      ],
    },
  };
}
