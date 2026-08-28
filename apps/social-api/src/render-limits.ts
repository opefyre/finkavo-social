// What the templates can actually set, in one place.
//
// These used to live only inside createRenderManifest, as numbers passed to fit(), and
// fit() throws. The generation schema had its own, looser numbers — a cover subtitle
// could be 300 characters there and 150 here — so a draft passed every gate it was shown,
// spent its tokens, reached the renderer and died. Late, fatally, and after the cost.
//
// A limit the writer is never told is a limit the writer will break. These are exported
// so the prompt can state them, generation can enforce them while a repair is still
// possible, and the renderer can hold the same line at the end.
// What the draft schema accepts, so the two can be reconciled. A limit is only useful if
// it is the tightest one the copy must survive: the template allows a 420-character
// content body and the schema allows 300, and telling the writer 420 — which the first
// version of this briefing did — invites a draft that parsing rejects before the template
// ever sees it. Every number the writer is given below is the smaller of the pair.
const SCHEMA_LIMITS = {
  eyebrow: 40,
  title: 82,
  body: 300,
  item: 110,
  callToAction: 80,
  highlight: 70,
} as const;

const tightest = (template: number, schema: number) => Math.min(template, schema);

export const RENDER_LIMITS = {
  eyebrow: 42,
  title: 82,
  /** The cover's subtitle sits under a large headline and has the least room of any body. */
  coverSubtitle: 150,
  summaryBody: 300,
  contentBody: 420,
  item: 130,
  callToAction: 80,
  highlight: 80,
  category: 32,
  sourceLabel: 80,
} as const;

/** Fields whose limit is tighter than the draft schema's, so the writer must be told. */
/** The limit a field must actually survive: the tighter of template and schema. */
export const EFFECTIVE_LIMITS = {
  eyebrow: tightest(RENDER_LIMITS.eyebrow, SCHEMA_LIMITS.eyebrow),
  title: tightest(RENDER_LIMITS.title, SCHEMA_LIMITS.title),
  coverSubtitle: tightest(RENDER_LIMITS.coverSubtitle, SCHEMA_LIMITS.body),
  summaryBody: tightest(RENDER_LIMITS.summaryBody, SCHEMA_LIMITS.body),
  contentBody: tightest(RENDER_LIMITS.contentBody, SCHEMA_LIMITS.body),
  item: tightest(RENDER_LIMITS.item, SCHEMA_LIMITS.item),
  callToAction: tightest(RENDER_LIMITS.callToAction, SCHEMA_LIMITS.callToAction),
  highlight: tightest(RENDER_LIMITS.highlight, SCHEMA_LIMITS.highlight),
} as const;

export function renderLimitBriefing(): string {
  return [
    `Slide 1 is the cover: its body is a subtitle and must be ${EFFECTIVE_LIMITS.coverSubtitle} characters or fewer.`,
    `Every other slide body is ${EFFECTIVE_LIMITS.contentBody} characters or fewer.`,
    `Every slide title is ${EFFECTIVE_LIMITS.title} characters or fewer and every eyebrow ${EFFECTIVE_LIMITS.eyebrow}.`,
    `A list item is ${EFFECTIVE_LIMITS.item} characters or fewer; a highlight ${EFFECTIVE_LIMITS.highlight}; the call to action is ${EFFECTIVE_LIMITS.callToAction}.`,
    "Copy that exceeds any of these is rejected before the post can be drawn, so keep inside them.",
  ].join(" ");
}

export type RenderLimitFailure = { field: string; limit: number; length: number };

/**
 * The same contract the renderer enforces, applied while a repair is still possible.
 * Returns what is too long rather than throwing, so the caller can hand it back to the
 * model as feedback.
 */
export function renderLimitFailures(slides: Array<Record<string, unknown>>, callToAction: string): RenderLimitFailure[] {
  const failures: RenderLimitFailure[] = [];
  const check = (field: string, value: unknown, limit: number) => {
    const length = String(value ?? "").trim().length;
    if (length > limit) failures.push({ field, limit, length });
  };

  check("callToAction", callToAction, EFFECTIVE_LIMITS.callToAction);
  slides.forEach((slide, index) => {
    const where = `slide ${index + 1}`;
    check(`${where} eyebrow`, slide.eyebrow, EFFECTIVE_LIMITS.eyebrow);
    check(`${where} title`, slide.title, EFFECTIVE_LIMITS.title);
    if (slide.highlight) check(`${where} highlight`, slide.highlight, EFFECTIVE_LIMITS.highlight);
    for (const item of (Array.isArray(slide.items) ? slide.items : [])) {
      check(`${where} list item`, item, EFFECTIVE_LIMITS.item);
    }
    // The cover is the tight one, and the only place the draft schema is looser than the
    // template it feeds.
    if (index === 0) check(`${where} subtitle`, slide.body, EFFECTIVE_LIMITS.coverSubtitle);
    else if (index === slides.length - 1) check(`${where} body`, slide.body, EFFECTIVE_LIMITS.summaryBody);
    else check(`${where} body`, slide.body, EFFECTIVE_LIMITS.contentBody);
  });
  return failures;
}
