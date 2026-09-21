/**
 * Reel 7 — subsídio de Natal.
 *
 * Verified against the article: Código do Trabalho, art. 263.º.
 *   the amount equals one month's remuneration                        — n.º 1
 *   it must be paid by 15 December each year                          — n.º 1
 *   it is proportional in the year you were hired, the year the contract
 *     ends, or where the contract was suspended for a reason concerning
 *     the worker                                                      — n.º 2
 *   failing to pay it is a contraordenação MUITO grave                — n.º 3
 *
 * Written so a stranger understands each scene alone: the first frame says who it is
 * for and what the money is, and "subsídio de Natal" is introduced as Christmas pay
 * rather than assumed.
 */

import { holdsFor } from "../reading.mjs";

const scenes = [
  {
    type: "hook",
    kicker: "Working in Portugal",
    text: "Your Christmas pay is a legal right.",
    sub: "One extra month of pay, called the subsídio de Natal.",
  },
  {
    type: "dates",
    kicker: "The two numbers",
    text: "Both are set by law.",
    items: [
      { day: "15", month: "Dec", label: "Paid by" },
      { day: "1", month: "month", label: "Of your pay" },
    ],
  },
  {
    type: "hook",
    kicker: "Started your job this year",
    text: "You still get a share.",
    sub: "It is proportional to the months you have worked.",
  },
  {
    type: "payoff",
    card: true,
    kicker: "If it does not arrive",
    text: "Not paying it is a very serious offence.",
    action: "The deadline is 15 December.",
  },
];

export function buildSpec() {
  return {
    id: "subsidio-natal",
    photo: "natal",
    source: "Código do Trabalho · art. 263.º",
    music: "saffron-and-silk.mp3",
    holds: holdsFor(scenes),
    scenes,
    caption: {
      hook: "Working in Portugal: your Christmas pay is not a bonus your employer chooses to give. It is written into the labour code.",
      body: `The subsídio de Natal — Código do Trabalho, art. 263.º:

· It equals one month of your pay
· It must reach you by 15 December each year
· In the year you were hired it is proportional to the months you worked, and the same applies in the year a contract ends

An example: start in July and work six months of the year, and you receive half of a month's pay.

Not paying it, or paying it late, is a contraordenação muito grave — the most serious category in the labour code.

Your employer can pay it earlier, or in instalments across the year, if that is more favourable to you or your contract says so. What they cannot do is pay it after 15 December.`,
      cta: "Finkavo tells you what you are owed, and when.",
      tags: [
        "#subsidiodenatal", "#direitodotrabalho", "#contratodetrabalho",
        "#trabalharemportugal", "#viveremportugal", "#expatsinportugal", "#Finkavo",
      ],
    },
  };
}
