/**
 * Reel — 19 Sep 2026 — fix a missed tax obligation before Finanças notices, and the fine
 * drops to 12,5% of the minimum.
 *
 * New topic: the account has covered contesting a tax bill and paying in instalments,
 * never the voluntary reduction of a fine.
 *
 * Verified 14 Sep 2026 against RGIT art. 30.º (wording in force since 1 Jan 2022):
 *   reduced to 12,5% of the legal minimum if requested before any auto de notícia,
 *     participação, denúncia or tax inspection
 *   reduced to 50% of the minimum if requested by the end of the prior-hearing deadline
 *     inside an inspection
 *   the minimum used is always the one for negligence
 *   the reduced fine is paid, and the situation regularised, within 30 days of being
 *     notified of the amount; otherwise a contraordenação process is opened
 *   where putting it right does not depend on tax the services have to assess, handing
 *     in the missing payment or declaration counts as the request (n.º 5)
 *   the reduced fine is never below €25 (Portal das Finanças, "Coimas")
 */
import { holdsFor } from "../reading.mjs";

const scenes = [
  {
    type: "hook",
    kicker: "Missed a Finanças deadline?",
    text: "Fix it before Finanças finds it.",
    sub: "Coming forward first shrinks the fine to a fraction.",
  },
  {
    type: "figure",
    kicker: "The reduction",
    figure: "12,5%",
    text: "Of the minimum fine, if you act before any notice or inspection.",
  },
  {
    type: "hook",
    kicker: "What fixing it means",
    text: "File what was missing. Pay what was due.",
    sub: "Finanças then notifies you of the reduced fine to pay.",
  },
  {
    type: "hook",
    kicker: "If they get there first",
    text: "Most of the discount is gone.",
    sub: "Inside an inspection, the best left is 50% of the minimum.",
  },
  {
    type: "payoff",
    card: true,
    kicker: "The catch",
    text: "The reduced fine has to be paid on time.",
    action: "Within 30 days of the notice, or it is lost.",
  },
];

export function buildSpec() {
  return {
    id: "coima-reducao",
    photo: "resign-dark",
    source: "RGIT · art. 30.º",
    music: "after-six-martini.mp3",
    holds: holdsFor(scenes),
    scenes,
    caption: {
      hook: "Missed a tax deadline in Portugal? Put it right before Finanças notices, and the fine drops to 12,5% of the legal minimum.",
      body: `How the reduction works (RGIT, art. 30.º):

· Before any notice, complaint or tax inspection — the fine is cut to 12,5% of the legal minimum
· Inside an inspection, up to the end of the prior-hearing deadline — 50% of the minimum
· The minimum used is always the one for negligence

What you have to do:
· Put the situation right — file what was missing and pay any tax due
· Pay the reduced fine within 30 days of being notified of the amount

Where putting it right does not depend on tax that Finanças has to calculate, handing in the missing declaration or payment already counts as the request. The reduced fine is never less than €25.

Miss the 30 days and the reduction is lost: a contraordenação process is opened straight away.

Source: Regime Geral das Infrações Tributárias, art. 30.º.`,
      cta: "Not sure what you missed? Ask Finkavo — every answer cites the law.",
      tags: ["#coimas", "#financas", "#impostos", "#viveremportugal", "#Finkavo"],
    },
  };
}
