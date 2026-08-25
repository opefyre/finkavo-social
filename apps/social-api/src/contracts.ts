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
  // The reel version of the same post, written in the same call. A second call would
  // double the token cost of every post on a tier that runs out mid-afternoon, and the
  // model already has the evidence in front of it here.
  //
  // frames may be empty. A strict provider schema requires every property to be present,
  // so absence is expressed there as an empty array rather than a missing key, and an
  // empty one simply means this post goes out as a carousel — not a failure. Here it is
  // optional, because a draft assembled in a test or by an owner edit has no reel and
  // should not have to invent one.
  reel: z.object({
    frames: z.array(z.object({
      type: z.enum(["hook", "beat", "payoff"]),
      // Null on the wire means "does not apply"; an empty string means the model filled
      // the field with nothing. Both become absent here so the renderer sees one shape.
      kicker: z.string().max(40).nullish().transform(value => value || undefined),
      figure: z.string().max(24).nullish().transform(value => value || undefined),
      label: z.string().max(48).nullish().transform(value => value || undefined),
      // 320, matching the wire schema. Left at 140 this rejected as too_big exactly the
      // frames the new floors were asking for, so a reel written to the right weight
      // failed parsing and the post fell back to the sparse version it had before.
      text: z.string().min(1).max(320),
    })).max(5),
  }).optional(),
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
 *
 * minLength is the exception, and it is kept. Dropping it made an empty string a valid
 * answer, and a weaker model takes that offer: the free standby models returned drafts
 * whose hook, caption and call to action were all "", which Zod then rejected three
 * times before the topic was retired. An over-long field is worth repairing because
 * there is something there to shorten; an empty one is not a length to fix but an answer
 * never given, and no repair round recovers it.
 */
export function providerSchema(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map(providerSchema);
  if (!schema || typeof schema !== "object") return schema;
  const relaxed: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(schema as Record<string, unknown>)) {
    if (key === "maxLength" || key === "pattern") continue;
    relaxed[key] = providerSchema(value);
  }
  return relaxed;
}

export const draftJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["topic", "category", "riskLevel", "postIntent", "hook", "caption", "callToAction", "hashtags", "searchKeywords", "slides", "claims", "reel"],
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
    reel: {
      type: "object", additionalProperties: false, required: ["frames"],
      properties: {
        // Asked for in the prompt, the reel kept coming back empty: promoted to the top of
        // the instructions gpt-oss started dropping the post's own fields, and left lower
        // down Mistral simply skipped it. A schema does not need to be persuasive. Four
        // frames are required here, so the model has to write them.
        //
        // This is safe to demand because it is not the last word: Zod below accepts any
        // number and validateReelFrames judges what arrives. A reel forced out of a topic
        // that has none fails its checks and is dropped, and the post still goes out as a
        // carousel — which is the outcome the prompt was politely asking for anyway.
        //
        // The frames carry the same weight of copy as the carousel slides. A reel that
        // only shows headlines gives a viewer nothing to stop for; one that holds a real
        // paragraph is read, replayed and saved.
        frames: {
          type: "array", minItems: 4, maxItems: 4,
          items: {
            // Strict mode requires every property to appear in `required`, so a field
            // that does not apply — a hook has no figure — is expressed as null rather
            // than left out. Zod turns those nulls back into absent fields below.
            type: "object", additionalProperties: false,
            required: ["type", "text", "kicker", "figure", "label"],
            properties: {
              // The fields carried no descriptions, and the model filled them the way an
              // untitled form gets filled: everything went into `text`. Four of the first
              // five reels wrote their number inside the sentence — "365 days start then" —
              // leaving `figure` null, which is the one field the format is built around
              // and the one the layout renders large.
              type: {
                type: "string", enum: ["hook", "beat", "payoff"],
                description: "hook opens, beat carries the substance, payoff closes with what to do.",
              },
              kicker: {
                type: ["string", "null"], maxLength: 40,
                description: "Optional small line above the figure, e.g. \"Deadline\" or \"You keep\".",
              },
              figure: {
                type: ["string", "null"], maxLength: 24,
                description: "The number on its own, and nothing else: \"365\", \"15%\", \"30 June\", \"€300\". This is displayed large and is what a viewer remembers, so put the number here rather than inside the sentence. Null only when the frame genuinely has no number.",
              },
              label: {
                type: ["string", "null"], maxLength: 48,
                description: "What the figure counts, in a word or two: \"days\", \"of the rent\", \"to file\".",
              },
              text: {
                // Enforced by the provider before the draft ever reaches us, which is worth more
                // than any amount of instruction: asked in prose for a full sentence the model
                // kept returning six words, then ten. Seventy characters is about twelve words.
                type: "string", minLength: 70, maxLength: 320,
                description: "The English copy for this frame, written as fully as a carousel slide: complete sentences, not a caption. A hook runs 12 to 22 words; a beat 22 to 42; a payoff 15 to 32. The frame deliberately holds more than a viewer can read while it passes, so they stop the video to finish it — a frame of six words gives them no reason to stop and is rejected. Example of a beat: \"Miss this date and the tax authority can call in the entire remaining bill at once, rather than letting you keep paying it in parts across the year as you had planned.\" Do not repeat the figure in this text — it is already on screen above the line.",
              },
            },
          },
        },
      },
    },
  },
} as const;
