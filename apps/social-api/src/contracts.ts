import { z } from "zod";

export const SlideSchema = z.object({
  eyebrow: z.string().max(40),
  title: z.string().min(1).max(90),
  body: z.string().min(1).max(260),
  sourceLabel: z.string().max(80).optional(),
});

export const DraftSchema = z.object({
  topic: z.string().min(1).max(120),
  hook: z.string().min(1).max(180),
  caption: z.string().min(1).max(1800),
  callToAction: z.string().min(1).max(180),
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
  required: ["topic", "hook", "caption", "callToAction", "hashtags", "slides", "claims"],
  properties: {
    topic: { type: "string", minLength: 1, maxLength: 120 },
    hook: { type: "string", minLength: 1, maxLength: 180 },
    caption: { type: "string", minLength: 1, maxLength: 1800 },
    callToAction: { type: "string", minLength: 1, maxLength: 180 },
    hashtags: { type: "array", maxItems: 8, items: { type: "string", pattern: "^#[A-Za-z0-9_]+$" } },
    slides: {
      type: "array", minItems: 3, maxItems: 7,
      items: {
        type: "object", additionalProperties: false,
        required: ["eyebrow", "title", "body", "sourceLabel"],
        properties: {
          eyebrow: { type: "string", maxLength: 40 },
          title: { type: "string", minLength: 1, maxLength: 90 },
          body: { type: "string", minLength: 1, maxLength: 260 },
          sourceLabel: { type: "string", maxLength: 80 },
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
