import { z } from "zod";

export const SlideSchema = z.object({
  eyebrow: z.string().max(40),
  title: z.string().min(1).max(82),
  body: z.string().min(1).max(150),
  sourceLabel: z.string().max(80).optional(),
  altText: z.string().min(1).max(300),
});

export const DraftSchema = z.object({
  topic: z.string().min(1).max(120),
  category: z.enum(["aima", "residency", "visas", "irs", "nif", "niss", "social_security", "tax", "employment", "citizenship", "deadlines", "government", "immigration", "business", "housing", "general"]),
  riskLevel: z.enum(["low", "medium", "high"]),
  hook: z.string().min(1).max(180),
  caption: z.string().min(1).max(1800),
  callToAction: z.string().min(1).max(80),
  hashtags: z.array(z.string().regex(/^#[A-Za-z0-9_]+$/)).max(8),
  slides: z.array(SlideSchema).min(3).max(7),
  claims: z.array(z.object({
    claim: z.string().min(1).max(300),
    evidenceQuote: z.string().min(1).max(500),
  })).min(1).max(8),
});

export type Draft = z.infer<typeof DraftSchema>;

export const draftJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["topic", "category", "riskLevel", "hook", "caption", "callToAction", "hashtags", "slides", "claims"],
  properties: {
    topic: { type: "string", minLength: 1, maxLength: 120 },
    category: { type: "string", enum: ["aima", "residency", "visas", "irs", "nif", "niss", "social_security", "tax", "employment", "citizenship", "deadlines", "government", "immigration", "business", "housing", "general"] },
    riskLevel: { type: "string", enum: ["low", "medium", "high"] },
    hook: { type: "string", minLength: 1, maxLength: 180 },
    caption: { type: "string", minLength: 1, maxLength: 1800 },
    callToAction: { type: "string", minLength: 1, maxLength: 80 },
    hashtags: { type: "array", maxItems: 8, items: { type: "string", pattern: "^#[A-Za-z0-9_]+$" } },
    slides: {
      type: "array", minItems: 3, maxItems: 7,
      items: {
        type: "object", additionalProperties: false,
        required: ["eyebrow", "title", "body", "sourceLabel", "altText"],
        properties: {
          eyebrow: { type: "string", maxLength: 40 },
          title: { type: "string", minLength: 1, maxLength: 82 },
          body: { type: "string", minLength: 1, maxLength: 150 },
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
