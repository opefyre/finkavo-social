/**
 * Reel 11 — who actually qualifies for subsídio de desemprego.
 *
 * From the ISS Guia Prático – Subsídio de Desemprego and the seg-social pages:
 *   the prazo de garantia is 360 days of employed work with registered earnings in the
 *     24 months before the date of unemployment
 *   the unemployment has to be INVOLUNTARY, and the employer's declaration is what
 *     proves it
 *   days counted include days worked, days as an independent worker where the
 *     contribution rate covers unemployment, and days on sickness or parental benefit
 *     (other than the social parental benefits)
 *
 * WHY THIS TOPIC: the two conditions are simple, and the second one — that resigning
 * normally rules you out — is the one people discover too late, after they have already
 * handed in their notice. Deliberately paired with the notice reel the day before.
 */

import { holdsFor } from "../reading.mjs";

const scenes = [
  {
    type: "hook",
    kicker: "Losing your job in Portugal",
    text: "Quitting usually means no unemployment pay.",
    sub: "It has to be a job you did not choose to leave.",
  },
  {
    type: "figure",
    kicker: "You also need a work record",
    figure: "360 days",
    text: "Of employed work in the 24 months before you stop.",
  },
  {
    type: "hook",
    kicker: "What counts as involuntary",
    text: "The decision was not yours.",
    sub: "A dismissal, or a fixed-term contract reaching its end.",
  },
  {
    type: "payoff",
    card: true,
    kicker: "Before you hand in notice",
    text: "Check both conditions first.",
    action: "The days, and the reason for leaving.",
  },
];

export function buildSpec() {
  return {
    id: "subsidio-desemprego",
    photo: "jobless",
    source: "ISS · Guia Prático Subsídio de Desemprego",
    music: "waiting-by-the-tagus.mp3",
    holds: holdsFor(scenes),
    scenes,
    caption: {
      hook: "Losing your job in Portugal: there are two conditions for subsídio de desemprego, and the one people discover too late is that resigning normally rules you out.",
      body: `The two conditions:

1. The work record — the prazo de garantia. You need 360 days of employed work with registered earnings in the 24 months before the date you become unemployed.

2. The reason. The unemployment has to be involuntary, and your employer's declaration is what proves it. A dismissal counts. A fixed-term contract reaching its end counts. Handing in your notice normally does not.

What counts towards the 360 days: days you worked, days as a trabalhador independente where your contribution rate includes unemployment cover, and days you were receiving sickness or parental benefit — the social parental benefits excepted.

If you are thinking about leaving, this is worth checking before you write the letter rather than after.

Source: ISS, Guia Prático – Subsídio de Desemprego.`,
      cta: "Finkavo checks whether you would qualify, with the source.",
      tags: [
        "#subsidiodedesemprego", "#segurancasocial", "#direitodotrabalho",
        "#trabalharemportugal", "#viveremportugal", "#expatsinportugal", "#Finkavo",
      ],
    },
  };
}
