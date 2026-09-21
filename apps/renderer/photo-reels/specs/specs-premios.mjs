/**
 * Reel — 16 Sep 2026 — what the State keeps from a Euromilhões prize.
 *
 * New topic: nothing in the 153 posts on the account covers gambling prizes.
 *
 * Verified 14 Sep 2026:
 *   Tabela Geral do Imposto do Selo, verba 11.4 — jogos sociais do Estado, 20% on the
 *     part of the prize above €5.000; verba 11.3 — 4,5% included in the price of the bet
 *   withheld by Santa Casa before payment; prizes are not IRS income (DECO PROteste)
 *   covers Euromilhões, Totoloto, Totobola, M1lhão, Raspadinha, Lotaria Clássica and
 *     Popular, and Placard
 *   worked example: €20.000 prize → €15.000 × 20% = €3.000 kept → €17.000 paid
 */
import { holdsFor } from "../reading.mjs";

const scenes = [
  {
    type: "hook",
    kicker: "Euromilhões in Portugal",
    text: "Win, and the State takes a cut.",
    sub: "20% of every euro above €5.000.",
  },
  {
    type: "figure",
    kicker: "What a €20.000 prize pays",
    figure: "€17.000",
    text: "€3.000 is kept before the money reaches you.",
  },
  {
    type: "hook",
    kicker: "Not just Euromilhões",
    text: "Every Santa Casa game works this way.",
    sub: "Totoloto, Raspadinha, Lotaria, M1lhão and Placard too.",
  },
  {
    type: "hook",
    kicker: "The good part",
    text: "Nothing to declare afterwards.",
    sub: "The prize does not go on your IRS return. Keep the Santa Casa paperwork.",
  },
  {
    type: "payoff",
    card: true,
    kicker: "And on every ticket",
    text: "Part of what you pay is already tax.",
    action: "4,5% Imposto do Selo, built into the price.",
  },
];

export function buildSpec() {
  return {
    id: "premios-jogo",
    photo: "receipt",
    source: "Imposto do Selo · verbas 11.3 e 11.4",
    music: "calor-no-asfalto.mp3",
    holds: holdsFor(scenes),
    scenes,
    caption: {
      hook: "Playing Euromilhões in Portugal? If you win more than €5.000, the State keeps 20% of everything above that — before you ever see the money.",
      body: `How prizes from the State's social games are taxed:

· Up to €5.000 — paid in full
· Above €5.000 — 20% Imposto do Selo on the part above €5.000, withheld by Santa Casa

Example: a €20.000 prize. €15.000 is above the limit, 20% of that is €3.000, so €17.000 reaches you.

It applies to every Santa Casa game: Euromilhões, Totoloto, Totobola, M1lhão, Raspadinha, Lotaria Clássica, Lotaria Popular and Placard.

The prize is not income for IRS, so there is nothing to declare. Keep the documents Santa Casa gives you — they prove where the money came from.

And on every bet: 4,5% Imposto do Selo is already included in the price of the ticket.

Source: Tabela Geral do Imposto do Selo, verbas 11.3 and 11.4.`,
      cta: "Questions about your own situation? Ask Finkavo — every answer cites the law.",
      tags: ["#euromilhoes", "#impostodoselo", "#impostos", "#viveremportugal", "#Finkavo"],
    },
  };
}
