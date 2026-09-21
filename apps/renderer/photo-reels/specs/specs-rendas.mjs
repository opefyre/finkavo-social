/**
 * Reel 4 — the 2026 rent update.
 *
 * Audience: tenants, which is most of the expat readership and a group the first three
 * reels did not speak to at all.
 *
 * Written to the rule the last reel was rejected for breaking: a stranger with no
 * context must understand every scene on its own. So the first frame says who it is
 * for ("renting in Portugal"), what the number is, and what it governs. No pronoun
 * refers to anything not already on screen, and no Portuguese term arrives unexplained.
 *
 * Verified figures:
 *   coefficient for 2026 = 1,0224, i.e. a 2,24% maximum — Aviso n.º 23174/2025/2
 *   written notice, at least 30 days ahead, stating the coefficient and the new rent
 *     — Código Civil art. 1077.º
 *   once a year, and only a year after the contract began or the last update
 *
 * SCOPE, deliberately stated on screen: this is the ANNUAL UPDATE of a running
 * contract. A landlord may still propose a different rent when the contract term ends,
 * which is a separate negotiation under different rules — that belongs in the caption,
 * not in a reel, but the reel must not imply the cap covers it. Hence "while your
 * contract is running" in the opening.
 */

export function buildSpec() {
  return {
    id: "rendas-2026",
    photo: "rent",
    source: "Código Civil, art. 1077.º · Aviso 23174/2025",
    music: "the-slowest-hour-in-alfama.mp3",
    // Longer again, and the copy now settles at 45% of the pace rather than 58%, so
    // each scene sits finished on screen for noticeably longer than reel 3.
    holds: [5.0, 6.4, 6.0, 6.2, 5.4],
    scenes: [
      {
        type: "hook",
        kicker: "Renting in Portugal",
        text: "Your rent can go up 2,24% this year.",
        sub: "That is the legal maximum for the 2026 annual update. While your contract is running, your landlord cannot decide a bigger one.",
      },
      {
        type: "figure",
        kicker: "On a €1.000 rent",
        figure: "+€22,40",
        text: "The official coefficient for 2026 is 1,0224. A €1.000 rent becomes €1.022,40 a month — and not a cent more.",
      },
      {
        type: "dates",
        kicker: "Two conditions",
        text: "Both must be true.",
        items: [
          { day: "30", month: "days", label: "Written notice first" },
          { day: "1", month: "year", label: "Since the last rise" },
        ],
      },
      {
        // The part that is actually worth knowing, said without overstating it: the law
        // requires writing. Registered post is what makes it provable, not what makes
        // it legal — claiming a WhatsApp is void would be wrong.
        type: "hook",
        kicker: "Told you at the door?",
        text: "It has to be in writing.",
        sub: "The notice must state the coefficient and the new rent, and reach you 30 days before you pay it. Spoken notice does not count.",
      },
      {
        type: "payoff",
        card: true,
        kicker: "Check the letter",
        text: "The date, the coefficient, and the new amount.",
        action: "All three, or it is not a valid update.",
      },
    ],
    caption: {
      hook: "Renting in Portugal: your landlord can raise the rent by 2,24% in 2026, and not a cent more while your contract is running.",
      body: `The annual update coefficient for 2026 is 1,0224 — a maximum rise of 2,24% — set by Aviso n.º 23174/2025/2. On a €1.000 rent that is €1.022,40.

What makes the increase valid — Código Civil, art. 1077.º:
· It must be communicated in writing
· It must reach you at least 30 days before the new rent is due
· It must state the coefficient applied and the resulting new rent
· It can happen once a year, and only a year after the contract began or after the last update

Spoken notice does not count. Registered post with aviso de receção is what makes it provable if you ever have to argue about it.

One thing this does not cover: when the contract term ends, a landlord can propose a different rent for the new term. That is a negotiation, not the annual update, and the 2,24% cap does not apply to it.`,
      cta: "Finkavo checks the letter against the article for you.",
      tags: [
        "#arrendamento", "#rendas2026", "#inquilinos",
        "#viveremportugal", "#lisboa", "#expatsinportugal", "#Finkavo",
      ],
    },
  };
}
