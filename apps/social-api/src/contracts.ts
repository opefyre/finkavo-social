import { z } from "zod";

export const SlideSchema = z.object({
  type: z.enum(["cover", "content", "bullets", "steps", "summary"]),
  icon: z.enum(["calendar", "tax", "home", "passport", "document", "warning", "money", "people", "check"]),
  eyebrow: z.string().max(40),
  title: z.string().min(1).max(82),
  body: z.string().max(300),
  items: z.array(z.string().min(1).max(110)).max(5),
  highlight: z.string().max(70),
  sourceLabel: z.string().max(80).optional(),
  altText: z.string().min(1).max(300),
});

export const DraftSchema = z.object({
  topic: z.string().min(1).max(120),
  category: z.enum(["aima", "residency", "visas", "irs", "nif", "niss", "social_security", "tax", "employment", "citizenship", "deadlines", "government", "immigration", "business", "housing", "general"]),
  riskLevel: z.enum(["low", "medium", "high"]),
  postIntent: z.enum(["deadline_reminder", "regulatory_change", "timely_news", "evergreen_explainer", "checklist", "common_mistake", "occasion"]),
  hook: z.string().min(1).max(180),
  caption: z.string().min(1).max(1800),
  callToAction: z.string().min(1).max(80),
  hashtags: z.array(z.string().regex(/^#[A-Za-z0-9_]+$/)).max(8),
  searchKeywords: z.array(z.string().min(2).max(60)).min(2).max(6),
  slides: z.array(SlideSchema).min(3).max(7),
  claims: z.array(z.object({
    claim: z.string().min(1).max(300),
    evidenceQuote: z.string().min(1).max(500),
  })).min(1).max(8),
});

export type Draft = z.infer<typeof DraftSchema>;

/**
 * Strips length and pattern constraints from a JSON Schema for the provider.
 *
 * Groq validates generated JSON against the supplied schema server-side and rejects the
 * whole call when any constraint fails, so a slide body three characters over its limit
 * threw away an otherwise good draft and returned nothing to repair. Length is exactly
 * what the repair loop exists to fix: it can feed back "slide 2 body is 312 of 300" and
 * get a corrected draft.
 *
 * The provider therefore enforces shape — required fields, types, enums, item counts —
 * while Zod keeps the full contract, including every length the renderer depends on.
 */
export function providerSchema(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map(providerSchema);
  if (!schema || typeof schema !== "object") return schema;
  const relaxed: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(schema as Record<string, unknown>)) {
    if (key === "maxLength" || key === "minLength" || key === "pattern") continue;
    relaxed[key] = providerSchema(value);
  }
  return relaxed;
}

export const draftJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["topic", "category", "riskLevel", "postIntent", "hook", "caption", "callToAction", "hashtags", "searchKeywords", "slides", "claims"],
  properties: {
    topic: { type: "string", minLength: 1, maxLength: 120 },
    category: { type: "string", enum: ["aima", "residency", "visas", "irs", "nif", "niss", "social_security", "tax", "employment", "citizenship", "deadlines", "government", "immigration", "business", "housing", "general"] },
    riskLevel: { type: "string", enum: ["low", "medium", "high"] },
    postIntent: { type: "string", enum: ["deadline_reminder", "regulatory_change", "timely_news", "evergreen_explainer", "checklist", "common_mistake", "occasion"] },
    hook: { type: "string", minLength: 1, maxLength: 180 },
    caption: { type: "string", minLength: 1, maxLength: 1800 },
    callToAction: { type: "string", minLength: 1, maxLength: 80 },
    hashtags: { type: "array", maxItems: 8, items: { type: "string", pattern: "^#[A-Za-z0-9_]+$" } },
    searchKeywords: { type: "array", minItems: 2, maxItems: 6, items: { type: "string", minLength: 2, maxLength: 60 } },
    slides: {
      type: "array", minItems: 3, maxItems: 7,
      items: {
        type: "object", additionalProperties: false,
        required: ["type", "icon", "eyebrow", "title", "body", "items", "highlight", "sourceLabel", "altText"],
        properties: {
          type: { type: "string", enum: ["cover", "content", "bullets", "steps", "summary"] },
          icon: { type: "string", enum: ["calendar", "tax", "home", "passport", "document", "warning", "money", "people", "check"] },
          eyebrow: { type: "string", maxLength: 40 },
          title: { type: "string", minLength: 1, maxLength: 82 },
          body: { type: "string", maxLength: 300 },
          items: { type: "array", maxItems: 5, items: { type: "string", minLength: 1, maxLength: 110 } },
          highlight: { type: "string", maxLength: 70 },
          sourceLabel: { type: "string", maxLength: 80 },
          altText: { type: "string", minLength: 1, maxLength: 300 },
        },
      },
    },
    claims: {
      type: "array", minItems: 1, maxItems: 8,
      items: {
        type: "object", additionalProperties: false,
        required: ["claim", "evidenceQuote"],
        properties: {
          claim: { type: "string", minLength: 1, maxLength: 300 },
          evidenceQuote: { type: "string", minLength: 1, maxLength: 500 },
        },
      },
    },
  },
} as const;
