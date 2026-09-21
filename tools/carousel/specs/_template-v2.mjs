/**
 * TEMPLATE for a v2 carousel batch: copy to specs/batch-N.mjs, replace everything, keep it building. It uses every slide type.
 * `node build.mjs specs/_template-v2.mjs --sheet` builds it (out/template-v2-sheet.png shows the whole carousel).
 *
 * Sources: <the law article / official page every number below comes from — write them here, not just in the caption>
 *
 * The rules that keep a slide readable at phone size:
 *   · cover title ≤ 9 words, other titles ≤ 8; body ≤ 40 words; a row's key ≤ 34 characters, its value ≤ 22
 *   · pills (*word*) only on one or two short words: they never wrap
 *   · `source` is one short line for the footer pill (it keeps the first whole " · " segments that fit); the caption has the full list
 *   · every number in the slides comes from a primary source you opened
 */
export const DESIGN = "v2";
const tags = (...extra) => [...extra.slice(0, 3), "#viveremportugal", "#Finkavo"];   // three topic tags + the two fixed ones = 5

export const SPECS = [
  {
    id: "template-v2",
    day: "2026-01-01",
    source: "Código do IRS · art. 00.º",
    title: "Short title for Buffer",
    slides: [
      // COVER (dark). The pill words carry the hook. `icon` is any name from tools/reel/icons.js.
      { type: "cover", kicker: "Topic label", icon: "chart", title: "One clear claim with *$one number* in it.",
        body: "One line of context under the claim." },

      // CONTENT (light). One idea per slide; an optional icon tile anchors it.
      { type: "content", kicker: "Why it matters", icon: "calendar", title: "The first thing to know.",
        body: "Two or three short sentences. Say who it applies to and what changes for them." },

      // ROWS (light). Up to four key/value rows: thresholds, rates, fees.
      { type: "rows", kicker: "The numbers", title: "What each one gives you.",
        rows: [
          { key: "First item", value: "€100" },
          { key: "Second item", value: "15%, up to €900" },
          { key: "Third item", value: "Per person" },
          { key: "Fourth item", value: "Yes" },
        ] },

      // STEPS (light). Two to four numbered actions.
      { type: "steps", kicker: "How to do it", title: "Three steps, in order.",
        steps: [
          { title: "Find the page", text: "Portal das Finanças, then the service name." },
          { title: "Fill in the form", text: "Use the figures from your documents." },
          { title: "Keep the confirmation", text: "It is your proof." },
        ] },

      // VERSUS (light). A common belief against what the source says.
      { type: "versus", kicker: "Myth or fact", title: "What people get wrong.",
        versus: [
          { label: "Myth", text: "“It happens automatically for everyone.”" },
          { label: "Fact", text: "It applies only if you have done the step." },
        ] },

      // FIGURE (dark). One big number and what it means.
      { type: "figure", kicker: "The limit", figure: "€3.000", figureLabel: "or more",
        title: "This is where the rule starts.",
        body: "One sentence on what happens at the number." },

      // CTA (dark). The one move, then the follow reason.
      { type: "cta", kicker: "The move", title: "Do this one thing this week.",
        body: "Where, and by when.", action: "Save this for later." },
    ],
    caption: {
      hook: "The sentence that makes someone stop, with the number in it.",
      body: `What the rule says:

· Point one
· Point two

What to do: the one move.

Source: the articles and pages you actually opened.`,
      cta: "Not sure where you stand? Ask Finkavo — every answer cites the law.",
      tags: tags("#topic", "#topic2", "#financas"),
    },
  },
];
