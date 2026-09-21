/**
 * Reel — IUC, the car tax nobody reminds you about.
 *
 * Deliberately NOT employment. Finkavo is a tax and admin assistant; six of the last
 * eleven reels had drifted into labour law, which is adjacent to the product rather
 * than part of it.
 *
 * Verified:
 *   IUC is paid in the anniversary month of the vehicle's first registration, by the
 *     last day of that month
 *   the payment window opens on the first day of the month before
 *   no bill is posted — you generate the reference yourself on the Portal das Finanças
 *   from 2028 it moves to a single national deadline in April
 *
 * The reel exists for the first of those: it is a tax with no invoice and no reminder,
 * on a date that is different for every car.
 */

import { holdsFor } from "../reading.mjs";

const scenes = [
  {
    type: "hook",
    kicker: "If you own a car in Portugal",
    text: "Nobody sends you the car tax bill.",
    sub: "There is no letter. You go and fetch it.",
  },
  {
    type: "hook",
    kicker: "When it is due",
    text: "The month your car was first registered.",
    sub: "Not a national date — it is personal to your car.",
  },
  {
    type: "figure",
    kicker: "And from 2028",
    figure: "April",
    text: "One national deadline replaces the registration month.",
  },
  {
    type: "payoff",
    card: true,
    kicker: "Until then",
    text: "Portal das Finanças, search IUC, issue the reference.",
    action: "Pay by the last day of your month.",
  },
];

export function buildSpec() {
  return {
    id: "iuc-matricula",
    photo: "car",
    source: "Portal das Finanças · IUC",
    music: "rubber-band-logic.mp3",
    holds: holdsFor(scenes),
    scenes,
    caption: {
      hook: "If you own a car in Portugal: the IUC is a tax with no bill and no reminder, and its deadline is different for every car.",
      body: `The Imposto Único de Circulação — the annual car tax:

· It is due in the anniversary month of your car's first registration, not on a national date
· You can pay from the first day of the month before
· The deadline is the last day of your registration month
· Nothing arrives in the post. You generate the reference yourself

How to pay: Portal das Finanças → log in with your NIF → search "IUC" → choose the registration → emitir documento. You can then pay by MB Way, homebanking, Multibanco or at the CTT counter.

Miss the deadline and the tax goes into execução fiscal, with interest on top.

One change worth diarising: from 2028 the IUC moves to a single national deadline in April, so the registration-month rule goes away. Until then it is still your car's birthday month.`,
      cta: "Finkavo keeps track of which month is yours.",
      tags: [
        "#iuc", "#impostos", "#carro",
        "#viveremportugal", "#portaldasfinancas", "#expatsinportugal", "#Finkavo",
      ],
    },
  };
}
