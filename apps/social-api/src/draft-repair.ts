// Mechanical defects are typos, not editorial failures, and they were the largest single
// mechanical cause of lost drafts — 43 in a fortnight, six of them retiring the concept.
//
// This lives in its own module because the repair has to run in two places. The provider
// adapter validates the model's JSON the moment it arrives (openai.ts), which is *before*
// the generation route ever sees it, so a repair applied only in the route never ran: an
// over-long quote still killed the draft inside the adapter and the route's repair was
// dead code for that case.
const finishSentence = (value: string) =>
  value.trim() && !/[.!?)]$/.test(value.trim()) ? `${value.trim()}.` : value.trim();

// Trimming is safe here in a way it would not be for prose: the quote's whole job is to be
// findable verbatim in the source, and *any contiguous slice of a verbatim string is still
// verbatim*, so a shorter quote still anchors. The window starts near the first digit
// where there is one — the figure is the part a reader is being asked to trust, and a
// prefix stopping short of it would anchor fine while proving nothing.
export const trimQuoteKeepingItVerbatim = (quote: string, limit: number) => {
  const value = quote.trim();
  if (value.length <= limit) return value;
  const firstDigit = value.search(/\d/);
  let from = firstDigit < 0 ? 0 : Math.max(0, Math.min(firstDigit - 120, value.length - limit));
  if (from > 0) { const space = value.indexOf(" ", from); from = space < 0 ? 0 : space + 1; }
  const slice = value.slice(from, from + limit);
  const lastSpace = slice.lastIndexOf(" ");
  return (slice.length < limit || lastSpace < limit * 0.6 ? slice : slice.slice(0, lastSpace)).trim();
};

const dedupe = (values: unknown[], cap: number, normalise: (value: string) => string) => {
  const seen = new Set<string>();
  return values.filter((entry): entry is string => typeof entry === "string")
    .map(entry => entry.trim())
    .filter(entry => {
      if (!entry) return false;
      const key = normalise(entry);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, cap);
};

export const repairMechanicalDefects = (draft: unknown) => {
  if (!draft || typeof draft !== "object") return draft;
  const value = draft as Record<string, unknown>;
  if (Array.isArray(value.claims)) {
    value.claims = value.claims.map(entry => {
      if (!entry || typeof entry !== "object") return entry;
      const claim = entry as Record<string, unknown>;
      if (typeof claim.evidenceQuote === "string") claim.evidenceQuote = trimQuoteKeepingItVerbatim(claim.evidenceQuote, 500);
      if (typeof claim.claim === "string" && claim.claim.length > 300) claim.claim = finishSentence(claim.claim.slice(0, 300).replace(/\s+\S*$/, ""));
      return claim;
    });
  }
  // A repeated hashtag is a typo that was costing whole drafts. Keep the first of each and
  // the order the model chose; the caption rule still speaks up if too few survive.
  if (Array.isArray(value.hashtags)) value.hashtags = dedupe(value.hashtags, 8, tag => tag.toLowerCase());
  if (Array.isArray(value.searchKeywords)) value.searchKeywords = dedupe(value.searchKeywords, 6, term => term.toLowerCase()).map(term => term.slice(0, 60));
  // A reel figure is a short label like "22 dias". When the model writes a sentence there
  // the whole draft dies over a field that is optional in the first place, so an
  // unusable one is dropped and the post goes out as a carousel.
  const reel = value.reel as Record<string, unknown> | undefined;
  if (reel && Array.isArray(reel.frames)) {
    reel.frames = reel.frames.map(entry => {
      if (!entry || typeof entry !== "object") return entry;
      const frame = entry as Record<string, unknown>;
      if (typeof frame.figure === "string" && frame.figure.length > 24) frame.figure = undefined;
      return frame;
    });
  }
  return value;
};
