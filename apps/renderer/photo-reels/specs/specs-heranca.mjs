/**
 * Reel — 18 Sep 2026 — inheritance: close family pays nothing, but the estate must
 * still be declared.
 *
 * New topic: the account has covered marriage regimes and custody, never inheritance.
 *
 * Verified 14 Sep 2026:
 *   Código do Imposto do Selo art. 6.º e) — spouse or unido de facto, descendants and
 *     ascendants are exempt from verba 1.2
 *   verba 1.2 — 10% on gratuitous transfers
 *   art. 26.º — participação by the cabeça de casal by the end of the third month after
 *     the month of death (e.g. death in August → end of November)
 *   the participação is required even when every heir is exempt, when the deceased had
 *     assets in Portugal (AT, Folheto "Participação do Imposto do Selo – Óbito")
 *   Portal: Modelo 1 ISTG, with Anexo I (assets) and Anexo II (heirs)
 */
import { holdsFor } from "../reading.mjs";

const scenes = [
  {
    type: "hook",
    kicker: "When a parent dies in Portugal",
    text: "No tax to pay. Still a deadline.",
    sub: "Even when nobody owes a cent, Finanças must be told.",
  },
  {
    type: "hook",
    kicker: "Who pays",
    text: "Close family pays nothing.",
    sub: "Spouse or partner, children, grandchildren, parents, grandparents. Anyone else pays 10%.",
  },
  {
    type: "figure",
    kicker: "The deadline",
    figure: "3rd month",
    text: "The declaration is due by the end of the third month after the death.",
  },
  {
    type: "hook",
    kicker: "Who files it",
    text: "The cabeça de casal.",
    sub: "The person managing the estate until it is shared out. It lists what was left.",
  },
  {
    type: "payoff",
    card: true,
    kicker: "Where",
    text: "Portal das Finanças, participação do Imposto do Selo.",
    action: "File it even if nobody owes tax.",
  },
];

export function buildSpec() {
  return {
    id: "heranca-selo",
    photo: "natal-dark",
    source: "Código do Imposto do Selo · art. 6.º e 26.º",
    music: "the-slowest-hour-in-alfama.mp3",
    holds: holdsFor(scenes),
    scenes,
    caption: {
      hook: "When a family member dies in Portugal, close family pays no inheritance tax — but the estate still has to be declared to Finanças, by a deadline.",
      body: `Who pays Imposto do Selo on an inheritance:

· Exempt — spouse or unmarried partner (unido de facto), children, grandchildren, parents, grandparents
· Everyone else — 10%

The declaration (participação) is still required when every heir is exempt, if the person who died had assets in Portugal.

· Who files: the cabeça de casal — the person who manages the estate until it is shared out
· Deadline: the end of the third month after the month of death. A death in August means the end of November
· How: Portal das Finanças → Modelo 1 do Imposto do Selo (ISTG), with the list of assets and the list of heirs

Source: Código do Imposto do Selo, art. 6.º and 26.º; Tabela Geral, verba 1.2.`,
      cta: "Dealing with an estate? Ask Finkavo what applies to yours — every answer cites the law.",
      tags: ["#heranca", "#impostodoselo", "#financas", "#viveremportugal", "#Finkavo"],
    },
  };
}
