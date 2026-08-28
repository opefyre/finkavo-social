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
export function renderLimitBriefing(): string {
  return [
    `Slide 1 is the cover: its body is a subtitle and must be ${RENDER_LIMITS.coverSubtitle} characters or fewer.`,
    `Every slide title is ${RENDER_LIMITS.title} characters or fewer and every eyebrow ${RENDER_LIMITS.eyebrow}.`,
    `A list item is ${RENDER_LIMITS.item} characters or fewer; the call to action is ${RENDER_LIMITS.callToAction}.`,
    "A slide that exceeds these cannot be drawn and the whole post is discarded, so keep inside them.",
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

  check("callToAction", callToAction, RENDER_LIMITS.callToAction);
  slides.forEach((slide, index) => {
    const where = `slide ${index + 1}`;
    check(`${where} eyebrow`, slide.eyebrow, RENDER_LIMITS.eyebrow);
    check(`${where} title`, slide.title, RENDER_LIMITS.title);
    if (slide.highlight) check(`${where} highlight`, slide.highlight, RENDER_LIMITS.highlight);
    for (const item of (Array.isArray(slide.items) ? slide.items : [])) {
      check(`${where} list item`, item, RENDER_LIMITS.item);
    }
    // The cover is the tight one, and the only place the draft schema is looser than the
    // template it feeds.
    if (index === 0) check(`${where} subtitle`, slide.body, RENDER_LIMITS.coverSubtitle);
    else if (index === slides.length - 1) check(`${where} body`, slide.body, RENDER_LIMITS.summaryBody);
    else check(`${where} body`, slide.body, RENDER_LIMITS.contentBody);
  });
  return failures;
}
