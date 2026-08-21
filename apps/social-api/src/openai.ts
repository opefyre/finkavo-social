import { DraftSchema, draftJsonSchema, providerSchema, type Draft } from "./contracts.js";
import { generateStructured } from "./llm.js";

type Candidate = {
  title: string;
  sourceUrl: string;
  authority: string | null;
  fetchedAt: string;
  excerpts: string[];
  editorialContext?: { topic: string; reason: string | null; campaignStage: string | null; plannedFor: string | null; expiresAt: string | null; purpose?: string; userQuestion?: string; requiredAnswers?: string[] };
  sources?: Array<{ title: string; sourceUrl: string; authority: string | null; fetchedAt: string; excerpts: string[] }>;
  repairFeedback?: string;
  /** Whether this particular draft is worth paying for. Decided by the caller, not here. */
  allowPaid?: boolean;
};

// Evidence excerpts are corpus chunks, and a chunk can be well over a thousand
// characters. Three sources with six excerpts each is roughly 5,000 tokens of input,
// which pushed requests to 13,500 tokens against a free-tier ceiling of 8,000 per minute
// and failed the whole generation before the model ran. Trimming here rather than at the
// corpus keeps chunks useful for term matching while giving the model a payload that
// fits. The excerpts still carry the exact wording claims must quote.
const MAX_EXCERPTS_PER_SOURCE = 3;
const MAX_EXCERPT_CHARS = 600;

function trimExcerpts(excerpts: string[] | undefined): string[] {
  return (excerpts ?? [])
    .slice(0, MAX_EXCERPTS_PER_SOURCE)
    .map(excerpt => (excerpt.length > MAX_EXCERPT_CHARS ? `${excerpt.slice(0, MAX_EXCERPT_CHARS).trimEnd()}…` : excerpt));
}

function withinTokenBudget(candidate: Candidate): Candidate {
  return {
    ...candidate,
    excerpts: trimExcerpts(candidate.excerpts),
    ...(candidate.sources ? { sources: candidate.sources.slice(0, 3).map(source => ({ ...source, excerpts: trimExcerpts(source.excerpts) })) } : {}),
  };
}

export async function generateDraft(candidate: Candidate): Promise<{ draft: Draft; model: string; totalTokens: number | null }> {
  const { text, model, totalTokens } = await generateStructured({
    schemaName: "finkavo_social_draft",
    schema: providerSchema(draftJsonSchema),
    input: JSON.stringify(withinTokenBudget(candidate)),
    instructions: [
      // Compressed deliberately: the prompt, the JSON schema and the reserved completion
      // all count against one 8000-token minute on the free tier. The earlier 6,500-character
      // version left so little completion budget that the model spent it on reasoning and
      // returned an empty object. Every rule below is preserved; only the wording is shorter.
      "WRITE EVERY USER-FACING FIELD IN ENGLISH. Evidence is usually Portuguese; the post never is. Only evidenceQuote keeps its source language.",
      "You write practical English Instagram carousels for Finkavo, a Portugal personal-finance product.",
      "Use ONLY the supplied excerpts. Never add a date, threshold, rate, fee, eligibility rule or legal claim that is not in them. Never invent sources or give individual financial, tax or legal advice.",
      "The topic is predetermined. Sources prove it; they never replace it. Every slide and caption line must serve that topic. Omit adjacent facts that merely appear in the evidence.",
      "Reconcile multiple sources, preferring official ones. Never merge rules that apply to different audiences, regions or years.",
      "Each claim needs a short exact supporting excerpt. Set riskLevel high for tax, immigration, legal, deadline, fee or eligibility content.",
      "CHARACTER LIMITS the renderer enforces and cannot wrap: slide title 82, list item 110, highlight 70, eyebrow 40, altText 300, hook 180, callToAction 80. Slide body 300, EXCEPT the cover slide whose body becomes the cover subtitle and must be 150 or less. Never exceed one; never truncate mid-sentence to fit.",
      "Use exactly 5 slides: cover, three content, summary. No bullets or steps. Use an approved category icon. Unused fields take an empty string or empty array.",
      "The post must stand alone. Assume the reader has never seen Finkavo, the source, or the Portuguese term. Define every abbreviation and Portuguese term in plain English on first use, including AIMA, AT, IRS, IVA, NIF, NISS, SNS.",
      "Slide 1 names the real subject, the audience or situation, and the useful question answered. It must read naturally. Never use source-centric covers such as what the guide lists, official routes, or what the page says.",
      "Each content slide adds a DIFFERENT useful fact. Do not stretch one fact across slides, restate the cover, describe source headings, or use filler like everyone has a right.",
      "The final slide gives a topic-specific takeaway or next step first; save/share/follow language may follow it but can never be the takeaway.",
      "Deliver a practical outcome: a definition and why it matters, who is affected, an action or checklist, a mistake and its consequence, or a verified date or change. Never produce trivia about which law or heading a page mentions. If the evidence supports only trivia, or cannot support a complete standalone explanation, fail generation.",
      "Caption package: hook is the first line, 20-125 characters, names the Portugal topic or audience and promises a concrete supported benefit without clickbait. caption is body only, 40-1500 characters, short paragraphs, supplied facts only, and must not repeat the hook, CTA, website or hashtags. callToAction is 8-65 characters. Return 4-8 focused hashtags including #Finkavo, preferring specific tags. Provide 2-6 natural search phrases.",
      "Follow editorialContext campaign stage and timing when present, and answer its purpose, userQuestion and requiredAnswers directly. Never infer a legal deadline from editorialContext alone; the date must also appear in the excerpts. If the evidence cannot support a required answer, fail rather than substituting adjacent facts.",
      "Repeat recurring deadlines when the candidate is a new filing period; prior coverage is not a reason to omit it.",
      "Every body, item, quote and CTA is a complete thought ending in . ? ! or ). Sentence case, never all-caps. Slide copy is clean English paraphrase, never a raw corpus fragment, Markdown, chunk labels such as D1, or dangling quotes.",
      "altText describes only the text, layout and approved icon actually in the slide. Never invent photos, people, charts or symbols the template will not render.",
      // These sat at the top for a while, shouted, because the reel kept coming back
      // empty. The cause turned out to be a missing field in the schema — the model had
      // nowhere to write one — and by the time that was fixed the emphasis was still here,
      // crowding out the post itself: gpt-oss started returning objects with the reel and
      // none of the required top-level fields. Stated once, in its place, it behaves.
      "Also write a reel of the same post: 4 frames, one hook, two beats, one payoff, in that order.",
      "A reel frame is read in 1.7 seconds. hook text max 12 words, beat text max 12 words, payoff text max 10 words.",
      "Put the number in the beat's figure field, 3 words at most — '30 June', '25 euros', '36 months' — and name it in label, 5 words at most.",
      "The beat's text must not repeat its figure; use it to say what the figure means or what happens if it is missed.",
      "Spell out an institution the first time it appears in the reel: 'the tax authority', not 'AT'. A reel is watched without the caption.",
      "Reel frames carry only facts the excerpts state directly. Return reel.frames empty only if the excerpts contain no date, amount, rate or duration at all.",
      "If repairFeedback is supplied, fix exactly that problem while keeping the topic and evidence-bound meaning.",
    ].join(" "),
  }, undefined, { allowPaid: Boolean(candidate.allowPaid) });
  // Hashtags must match ^#[A-Za-z0-9_]+$, and that pattern is stripped from the schema
  // the provider sees, so a model has no way to know it and writes "#IRS 2026" or
  // "#mais-info". Failing an otherwise sound draft over punctuation in its hashtags is
  // the wrong trade: they carry no claim and no evidence, so they are repaired here
  // rather than sent back for another generation. Anything left empty is dropped.
  function tidyHashtags(value: unknown): unknown {
    if (!Array.isArray(value)) return value;
    const cleaned = value
      .map(tag => `#${String(tag).replace(/[^A-Za-z0-9_]/g, "")}`)
      .filter(tag => tag.length > 1);
    return [...new Set(cleaned)];
  }

  // Alt text has a 300-character ceiling that is stripped from the schema the provider
  // sees, so the model overruns it and an otherwise good draft is thrown away. Unlike the
  // copy on the slide, alt text is a description of what the slide shows: it carries no
  // claim, is never read by a follower, and trimming it to the last full sentence that
  // fits changes nothing about the post. Visible copy is deliberately not touched here —
  // when a title or body runs long the repair loop rewrites it, which is its job.
  function tidyAltText(value: unknown): unknown {
    if (!Array.isArray(value)) return value;
    return value.map(slide => {
      if (!slide || typeof slide !== "object") return slide;
      const entry = slide as Record<string, unknown>;
      const alt = typeof entry.altText === "string" ? entry.altText.trim() : "";
      if (alt.length <= 300) return entry;
      const clipped = alt.slice(0, 300);
      const lastStop = Math.max(clipped.lastIndexOf(". "), clipped.lastIndexOf("? "), clipped.lastIndexOf("! "));
      return { ...entry, altText: lastStop > 80 ? clipped.slice(0, lastStop + 1) : `${clipped.slice(0, 297).trimEnd()}...` };
    });
  }

  // A body that stops after "and" or a comma is a sentence the model did not finish, and
  // the fix is to end it at the last one it did — not to throw the post away and spend
  // another generation on the same topic. Only trailing fragments are removed; nothing is
  // rewritten, reordered or shortened for style, so what remains is the model's own copy.
  function endAtLastCompleteSentence(value: unknown): unknown {
    if (typeof value !== "string") return value;
    const text = value.trim();
    if (!text || /[.!?)]$/.test(text)) return text;
    const cut = Math.max(text.lastIndexOf(". "), text.lastIndexOf("! "), text.lastIndexOf("? "));
    // Keep the fragment rather than gut the slide: a body reduced to almost nothing is
    // worse than one the repair loop is asked to finish properly.
    return cut > text.length * 0.5 ? text.slice(0, cut + 1) : text;
  }

  function tidyProse(value: unknown): unknown {
    if (!Array.isArray(value)) return value;
    return value.map(slide => {
      if (!slide || typeof slide !== "object") return slide;
      const entry = slide as Record<string, unknown>;
      return {
        ...entry,
        ...(typeof entry.body === "string" ? { body: endAtLastCompleteSentence(entry.body) } : {}),
        ...(Array.isArray(entry.items) ? { items: entry.items.map(endAtLastCompleteSentence) } : {}),
      };
    });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    // A parse failure says nothing about the draft on its own. Describing the shape of
    // what came back distinguishes a model that wrote bad JSON from one that padded its
    // answer with whitespace until the token ceiling cut the object off mid-write.
    const lines = text.split("\n");
    const blank = lines.filter(line => !line.trim()).length;
    throw new Error(
      `${model} returned unparseable JSON (${error instanceof Error ? error.message : "parse failed"}); ` +
      `chars=${text.length} lines=${lines.length} blank=${blank} tokens=${totalTokens ?? "?"} ` +
      `head=${JSON.stringify(text.slice(0, 80))} tail=${JSON.stringify(text.slice(-60))}`,
    );
  }
  if (parsed && typeof parsed === "object") {
    const draft = parsed as Record<string, unknown>;
    draft.hashtags = tidyHashtags(draft.hashtags);
    draft.slides = tidyAltText(tidyProse(draft.slides));
    draft.callToAction = endAtLastCompleteSentence(draft.callToAction);
  }
  return { draft: DraftSchema.parse(parsed), model, totalTokens };
}
