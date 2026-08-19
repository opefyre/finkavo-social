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
      "If repairFeedback is supplied, fix exactly that problem while keeping the topic and evidence-bound meaning.",
    ].join(" "),
  });
  return { draft: DraftSchema.parse(JSON.parse(text)), model, totalTokens };
}
