/**
 * Reel 9 — the notice you owe when you resign.
 *
 * Código do Trabalho, art. 400.º and 401.º:
 *   notice must be in writing                                          — art. 400.º n.º 1
 *   30 days if you have up to two years of seniority, 60 days if more  — art. 400.º n.º 1
 *   on a fixed-term contract, 30 days (six months or longer) or 15 days — art. 400.º n.º 3
 *   a contract or collective agreement may extend it to six months for
 *     management and roles of responsibility                           — art. 400.º n.º 2
 *   giving less notice means paying the employer the base pay for the
 *     days missing                                                     — art. 401.º
 *
 * The last one is the reason for the reel. People know they should give notice; very few
 * know that falling short is a debt the employer can claim.
 */

import { holdsFor } from "../reading.mjs";

const scenes = [
  {
    type: "hook",
    kicker: "Leaving your job in Portugal",
    text: "You owe your employer notice.",
    sub: "In writing, and the length depends on your time there.",
  },
  {
    type: "dates",
    kicker: "How much notice",
    text: "Count your years.",
    items: [
      { day: "30", month: "days", label: "Up to 2 years" },
      { day: "60", month: "days", label: "Over 2 years" },
    ],
  },
  {
    type: "hook",
    kicker: "Walk out early",
    text: "You pay for the days you skipped.",
    sub: "Your employer can claim that pay back from you.",
  },
  {
    type: "payoff",
    card: true,
    kicker: "Before you resign",
    text: "Count your years, then put it in writing.",
    action: "Fixed-term contracts have shorter notice.",
  },
];

export function buildSpec() {
  return {
    id: "aviso-previo",
    photo: "resign",
    source: "Código do Trabalho · art. 400.º e 401.º",
    music: "after-the-last-call.mp3",
    holds: holdsFor(scenes),
    scenes,
    caption: {
      hook: "Leaving a job in Portugal: you owe notice, in writing — and if you give less than the law requires, your employer can claim the difference from you.",
      body: `On an open-ended contract — Código do Trabalho, art. 400.º:
· 30 days' notice if you have up to two years of seniority
· 60 days' notice if you have more than two years
· It has to be in writing

On a fixed-term contract:
· 30 days if the contract runs six months or longer
· 15 days if it is shorter

If you hold a management position or a role of responsibility, your contract or a collective agreement can extend the notice up to six months. Check what yours says before you count on 30 days.

The part people miss — art. 401.º: if you give less notice than you owe, you must pay your employer an amount equal to your base pay for the days you did not work out. It is a debt, not a penalty the employer has to argue for.

Someone recognised as a victim of domestic violence is exempt from giving notice.`,
      cta: "Finkavo works out which notice period is yours.",
      tags: [
        "#avisoprevio", "#direitodotrabalho", "#contratodetrabalho",
        "#trabalharemportugal", "#viveremportugal", "#expatsinportugal", "#Finkavo",
      ],
    },
  };
}
