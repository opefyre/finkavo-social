import { z } from "zod";

// A frame is on screen for 1.7 seconds. A silent reader on a phone gets through roughly
// four words a second and needs a beat before that to find the line at all, so the honest
// budget is about seven words — not the twenty a carousel slide can carry.
//
// These are caps rather than targets, with a little headroom above what reads
// comfortably, because a limit tight enough to be correct on average is tight enough to
// reject most drafts. The message on each one names the number so a rewrite has something
// to aim at instead of guessing.
export const HOLD_SECONDS = 1.7;

const words = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

const atMost = (limit: number, field: string) =>
  z.string().min(1).refine(value => words(value) <= limit, {
    message: `${field} must be ${limit} words or fewer: at ${HOLD_SECONDS}s a frame there is no time to read more`,
  });

export const ReelFrameSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("hook"),
    kicker: atMost(4, "kicker").optional(),
    headline: atMost(12, "hook headline"),
  }),
  z.object({
    type: z.literal("beat"),
    // The figure is what the eye lands on and what gets remembered, so it earns its space
    // by being short: "31 August", "€25", "36 months".
    figure: atMost(3, "figure").optional(),
    label: atMost(5, "label").optional(),
    body: atMost(12, "beat body"),
  }),
  z.object({
    type: z.literal("payoff"),
    headline: atMost(8, "payoff headline"),
    action: atMost(10, "payoff action"),
  }),
]);

export const ReelManifestSchema = z.object({
  topic: z.string().min(1),
  visualStyle: z.enum(["petrol_editorial", "cream_guide", "mint_checklist", "peach_deadline", "ink_alert"]),
  sourceLabel: z.string().min(1).max(90),
  // Three to five frames. Under three there is no story; at 1.7s each, five is 8.5
  // seconds, which is short enough to be watched twice and still be worth the second one.
  frames: z.array(ReelFrameSchema).min(3).max(5),
  holdSeconds: z.number().min(0.8).max(6).default(HOLD_SECONDS),
});

export type ReelFrame = z.infer<typeof ReelFrameSchema>;
export type ReelManifest = z.infer<typeof ReelManifestSchema>;
