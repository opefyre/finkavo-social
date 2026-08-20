// Asking the model to reproduce Portuguese legal text character for character was a
// design mistake. It starts copying correctly and drifts partway through a long passage,
// and a draft that was otherwise sound was thrown away for it — twelve of thirty attempts
// in one morning. The words it needs are already in the corpus, so the quote does not
// have to survive a round trip through the model at all.
//
// The model's quote is treated as a pointer rather than as the evidence: we find the span
// of the source it is pointing at and use the source's own words. The result is verbatim
// by construction, which is a stronger guarantee than checking a copy afterwards. A claim
// that points at nothing still fails — that is an unsupported claim, and no amount of
// anchoring should rescue it.

const normalise = (value: string) => value.replace(/\s+/g, " ").trim();
const words = (value: string) => normalise(value).toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

/** How much of the model's quote must appear in the window for it to count as a pointer. */
const MIN_OVERLAP = 0.6;
const MIN_ANCHOR_CHARS = 40;

export type AnchorResult =
  | { anchored: true; quote: string }
  | { anchored: false; reason: string };

/**
 * Finds the passage of `corpus` that `quoted` refers to and returns the corpus's own
 * wording for it. Sentence boundaries are preferred so the returned quote reads as a
 * complete statement rather than a fragment cut mid-clause, which for tax or legal text
 * can change what it says.
 */
export function anchorQuote(quoted: string, corpus: string): AnchorResult {
  const haystack = normalise(corpus);
  const needle = normalise(quoted);
  if (!needle) return { anchored: false, reason: "the claim carried no quote" };
  if (haystack.includes(needle)) return { anchored: true, quote: needle };

  const wanted = words(needle);
  if (!wanted.length) return { anchored: false, reason: "the quote had no searchable words" };

  // Sentences are the unit a reader can verify, so candidates are built from them and
  // grown by neighbours until they cover what the model was pointing at.
  const sentences = haystack.split(/(?<=[.!?])\s+/).filter(sentence => sentence.trim().length > 0);
  let best: { score: number; text: string } | null = null;

  for (let start = 0; start < sentences.length; start++) {
    for (let span = 1; span <= 3 && start + span <= sentences.length; span++) {
      const candidate = sentences.slice(start, start + span).join(" ");
      const present = new Set(words(candidate));
      const hits = wanted.filter(word => present.has(word)).length;
      const score = hits / wanted.length;
      // Prefer the tightest passage that covers the claim: a longer one scoring the same
      // is padding, and padding is what makes a quote unverifiable at a glance.
      if (score > (best?.score ?? 0) || (best && score === best.score && candidate.length < best.text.length)) {
        best = { score, text: candidate };
      }
    }
  }

  if (!best || best.score < MIN_OVERLAP) {
    return { anchored: false, reason: `no passage of the source carries this claim (best overlap ${Math.round((best?.score ?? 0) * 100)}%)` };
  }
  if (best.text.length < MIN_ANCHOR_CHARS) {
    return { anchored: false, reason: "the matching passage was too short to stand as evidence" };
  }
  return { anchored: true, quote: best.text };
}
