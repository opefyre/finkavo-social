import { DraftSchema, draftJsonSchema, type Draft } from "./contracts.js";

type Candidate = {
  title: string;
  sourceUrl: string;
  authority: string | null;
  fetchedAt: string;
  excerpts: string[];
  editorialContext?: { topic: string; reason: string | null; campaignStage: string | null; plannedFor: string | null; expiresAt: string | null };
  sources?: Array<{ title: string; sourceUrl: string; authority: string | null; fetchedAt: string; excerpts: string[] }>;
  repairFeedback?: string;
};

export async function generateDraft(candidate: Candidate): Promise<{ draft: Draft; model: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  const model = process.env.OPENAI_MODEL || "gpt-5-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      instructions: [
        "You create concise, practical, English-language carousel posts for Finkavo, a Portugal personal-finance product.",
        "All user-facing output fields must be written in English, even when the evidence is Portuguese. Keep exact evidenceQuote values in their original source language.",
        "Use only the supplied source excerpts. Do not introduce dates, thresholds, eligibility rules, rates, or legal claims absent from them.",
        "The editorial topic is predetermined. Sources are evidence for that topic; never replace it with a subject chosen from an arbitrary excerpt.",
        "When multiple sources are supplied, reconcile them and prefer official primary evidence. Do not combine rules that apply to different audiences, regions, or years.",
        "Every claim must include a short exact supporting excerpt. Never provide individualized financial, tax, or legal advice.",
        "Set riskLevel to high for tax, immigration, legal, deadline, fee, or eligibility content. Write useful alt text for every slide.",
        "Write for Instagram, not as a report: the cover promises one concrete benefit, each slide communicates one idea, and the final slide has a save/share/follow action.",
        "Prefer 5-6 slides and deliberately choose among cover, content, bullets, steps, and summary. Use an approved category icon. For fields unused by a slide type, return an empty string or empty array.",
        "The hook is the caption's first line: 20-125 characters, explicitly names the Portugal topic or audience, and promises a concrete supported benefit without vague clickbait. The caption field is the body only: 40-1500 characters, short paragraphs, supplied facts only, and no hook, CTA, website, or hashtags duplicated inside it.",
        "Write a practical 8-65 character callToAction. Return 4-8 focused hashtags including #Finkavo; prefer specific topic and audience tags over broad tags. The publisher appends finkavo.com and assembles the final hook/body/CTA/link/hashtag caption deterministically.",
        "Provide 2-6 natural search phrases a person might use on Instagram or Google. Repeat recurring deadlines when the supplied candidate is a new filing period; do not treat prior coverage as a reason to omit it.",
        "When editorialContext is present, follow its campaign stage and timing. Never infer the exact legal deadline from editorialContext alone; the date must also appear in the supplied official excerpts.",
        "Every body, bullet, evidence quote, and CTA must be a complete thought and must never be cut off to satisfy a character limit. Keep the CTA under 65 characters. Use sentence case rather than all-caps emphasis.",
        "Every cover, content, and summary body must end with a period, question mark, exclamation mark, or closing parenthesis. Every bullet and step must also end with one of those characters.",
        "If repairFeedback is supplied, correct that exact validation problem while preserving the predetermined topic and evidence-bound meaning.",
        "Alt text must describe only the text, layout type, and approved icon actually requested in the structured slide. Do not invent photos, crossed-out symbols, people, charts, or illustrations that the template will not render.",
        "Use cover as the first slide and summary as the final slide. Bullets and steps need 2-5 complete items; other slide types must have a complete body. Do not place unused copy in fields the chosen slide type will ignore.",
        "Slide copy is a clean English paraphrase of supported facts, not a raw corpus fragment. Never include Markdown markers, chunk labels such as 'D1', dangling quotation marks, or all-caps emphasis. Every body and list item ends with normal sentence punctuation.",
      ].join(" "),
      input: JSON.stringify(candidate),
      text: {
        format: {
          type: "json_schema",
          name: "finkavo_social_draft",
          strict: true,
          schema: draftJsonSchema,
        },
      },
    }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!response.ok) throw new Error(`OpenAI request failed (${response.status})`);
  const result = await response.json() as { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
  const text = result.output_text ?? result.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text;
  if (!text) throw new Error("OpenAI returned no structured output");
  return { draft: DraftSchema.parse(JSON.parse(text)), model };
}
