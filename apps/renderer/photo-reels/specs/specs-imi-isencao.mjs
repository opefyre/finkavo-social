/**
 * Reel — 20 Sep 2026 — three years without IMI on a home you live in.
 *
 * New topic: the account has covered IMI instalments, never the exemption.
 *
 * Verified 14 Sep 2026 against EBF art. 46.º on the Portal das Finanças:
 *   n.º 5 — three years, for properties with a VPT up to €125.000; extendable by two
 *     more by decision of the assembleia municipal
 *   n.º 1 — own permanent home; household gross income the year before up to €153.300;
 *     used as the permanent home within six months of purchase
 *   n.º 6 a) — automatic for purchases, based on data AT already holds
 *   n.º 11 — granted at most twice to the same taxpayer or household
 */
import { holdsFor } from "../reading.mjs";

const scenes = [
  {
    type: "hook",
    kicker: "Bought a home in Portugal?",
    text: "You may pay no IMI for three years.",
    sub: "If the home and your income sit under two limits.",
  },
  {
    type: "figure",
    kicker: "Limit one: the home",
    figure: "€125.000",
    text: "Its tax value (VPT), not the price you paid.",
  },
  {
    type: "figure",
    kicker: "Limit two: your household",
    figure: "€153.300",
    text: "Gross household income in the year before.",
  },
  {
    type: "hook",
    kicker: "The condition",
    text: "It has to be your permanent home.",
    sub: "Move in within six months of buying. After a purchase, Finanças applies it automatically.",
  },
  {
    type: "payoff",
    card: true,
    kicker: "Check it",
    text: "Look for the exemption on your IMI record.",
    action: "Portal das Finanças → IMI",
  },
];

export function buildSpec() {
  return {
    id: "imi-isencao",
    photo: "rent",
    source: "Estatuto dos Benefícios Fiscais · art. 46.º",
    music: "waiting-by-the-tagus.mp3",
    holds: holdsFor(scenes),
    scenes,
    caption: {
      hook: "Bought a home to live in, in Portugal? If it and your income are under two limits, you pay no IMI for three years.",
      body: `The temporary IMI exemption for your own permanent home:

· Three years without IMI
· The home's tax value (VPT) must be €125.000 or less — the VPT, not the price you paid
· Your household's gross income in the year before must be €153.300 or less
· You must make it your permanent home within six months of buying

After a purchase, Finanças applies it automatically from the data it already has. Some municipalities extend it by two more years.

It can only be granted twice to the same person or household.

Worth checking: Portal das Finanças → IMI, and look for the exemption on your property.

Source: Estatuto dos Benefícios Fiscais, art. 46.º.`,
      cta: "Not sure your home qualifies? Ask Finkavo — every answer cites the law.",
      tags: ["#imi", "#comprarcasa", "#impostos", "#viveremportugal", "#Finkavo"],
    },
  };
}
