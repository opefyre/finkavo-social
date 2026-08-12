import { DraftSchema, draftJsonSchema, type Draft } from "./contracts.js";

type Candidate = {
  title: string;
  sourceUrl: string;
  authority: string | null;
  fetchedAt: string;
  excerpts: string[];
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
        "Use only the supplied source excerpts. Do not introduce dates, thresholds, eligibility rules, rates, or legal claims absent from them.",
        "Every claim must include a short exact supporting excerpt. Never provide individualized financial, tax, or legal advice.",
        "Prefer 4-6 slides: clear hook, useful explanation, action checklist, and a source reminder.",
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
