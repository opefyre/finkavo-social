/**
 * One reel, in English, with the Portuguese terms left alone — "recibos verdes"
 * and "IVA" are what this audience calls these things, and translating them
 * would lose the people the hook is meant to catch.
 *
 * WHY THIS TOPIC, over the AIMA one that was the obvious emotional pick:
 * a bill tabled in June 2026 sought to repeal art. 82.º n.º 7 — the tacit
 * approval a reel would have been built on — and there is live disagreement over
 * whether its 60 days are calendar or working days. The consolidated law still
 * carries it, so the landing page can state it with its citation. A reel cannot:
 * it has no room for a caveat, and telling immigrants they hold a right that may
 * be repealed is the one mistake this brand cannot afford.
 *
 * The IVA deadline has none of that. It is statutory, unambiguous, and it runs
 * out this month — which is the hook, rather than something the hook has to
 * manufacture.
 */

/** The deadline the whole reel hangs on. CIVA art. 41.º n.º 10. */
export const FILING_DEADLINE = "2026-09-20";

/**
 * The countdown is computed, never typed. A hardcoded "16 days" is wrong the day
 * after it is written, and this reel's entire hook is that number.
 */
export function daysUntil(target, from = new Date()) {
  const a = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  const [y, m, d] = target.split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - a) / 86_400_000);
}

export function buildSpec(days) {
  return {
    id: "iva-16-days",
    photo: "iva",
    source: "Código do IVA · art. 41.º n.º 10 e art. 27.º n.º 10",
    music: "coffee-and-sharp-suits.mp3",
    // Hook short and hard; the trap gets the most air because it is the thing
    // being corrected; the payoff holds long enough to be screenshotted.
    holds: [2.8, 4.4, 3.0, 3.8, 3.4],
    scenes: [
      {
        // Names the audience in three words. Someone who has never heard
        // "recibos verdes" is not the person this needs to stop, and someone who
        // has knows instantly it is about them.
        type: "hook",
        kicker: "Recibos verdes",
        text: `You have ${days} days.`,
        sub: "Your Q2 IVA is not filed yet, and the date is not the one most people have in their calendar.",
      },
      {
        type: "dates",
        kicker: "Two dates, not one",
        text: "Filing and paying are different days.",
        items: [
          { day: "20", month: "Sept", label: "File" },
          { day: "25", month: "Sept", label: "Pay" },
        ],
      },
      {
        type: "figure",
        kicker: "Miss either one",
        figure: "€150 – €3,750",
        text: "The coima for a declaration filed late, or not at all.",
      },
      {
        type: "hook",
        kicker: "Why nobody knows this",
        text: "August is férias fiscais.",
        sub: "The normal rule puts Q2 on 20 August. A second rule moves it to September — so the date in your calendar is the one the law replaced.",
      },
      {
        type: "payoff",
        card: true,
        kicker: "Before the 20th",
        text: "Portal das Finanças → IVA → Declaração periódica.",
        action: "Save this. Q2 closes 25 September.",
      },
    ],
    caption: {
      hook: `Recibos verdes: your Q2 IVA is due in ${days} days — and not on the date most people have written down.`,
      body: `August is férias fiscais, so the second-quarter IVA declaration does not follow the normal rule.

· File by 20 September — Código do IVA, art. 41.º n.º 10
· Pay by 25 September — Código do IVA, art. 27.º n.º 10
· Late or missing declaration: coima de €150 a €3.750 — RGIT, art. 116.º n.º 1

Two different dates. Most people diarise one.

The normal rule (art. 41.º n.º 1 b) would put Q2 on 20 August — which is exactly why so many calendars carry the wrong date. A second rule moves it.

One note for 2026: 20 September falls on a Sunday, so do not leave it to the day.`,
      cta: "Finkavo tracks both dates for you, cited to the article.",
      tags: [
        "#recibosverdes", "#ivatrimestral", "#trabalhadorindependente",
        "#freelanceportugal", "#portugaltax", "#expatsinportugal", "#Finkavo",
      ],
    },
  };
}
