import { z } from "zod";

// A frame is on screen for 1.7 seconds. A silent reader on a phone gets through roughly
// four words a second and needs a beat before that to find the line at all, so the honest
// budget is about seven words — not the twenty a carousel slide can carry.
//
// These are caps rather than targets, with a little headroom above what reads
// comfortably, because a limit tight enough to be correct on average is tight enough to
// reject most drafts. The message on each one names the number so a rewrite has something
// to aim at instead of guessing.
// At 1.7 seconds the words arrived at roughly thirty-three a second against a reading
// speed of four or five, so a frame was a blur and then it was gone: the copy finished
// revealing with a quarter of a second left before it began sliding out, which is not
// long enough to register that there is anything to stop for. The extra half-second is
// spent on the reveal itself and on a beat of stillness after it. The frame still holds
// far more than can be read in the time it is up — that is the point — but it now reads
// as deliberate rather than frantic.
export const HOLD_SECONDS = Number(process.env.REEL_HOLD_SECONDS ?? 2.3);

const words = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

// These ceilings are what the layout can typeset legibly at 1080x1920, not what can be
// read in the time the frame is on screen. The frame is deliberately fuller than 1.7
// seconds allows: a viewer who cannot finish it stops the video, and a stopped video is a
// longer view and a likelier save than one that slid past with six words on it.
const atMost = (limit: number, field: string) =>
  z.string().min(1).refine(value => words(value) <= limit, {
    message: `${field} must be ${limit} words or fewer, which is what the frame can typeset legibly`,
  });

export const ReelFrameSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("hook"),
    kicker: atMost(4, "kicker").optional(),
    headline: atMost(22, "hook headline"),
  }),
  z.object({
    type: z.literal("beat"),
    // The figure is what the eye lands on and what gets remembered, so it earns its space
    // by being short: "31 August", "€25", "36 months".
    figure: atMost(3, "figure").optional(),
    label: atMost(6, "label").optional(),
    body: atMost(42, "beat body"),
  }),
  z.object({
    type: z.literal("payoff"),
    headline: atMost(20, "payoff headline"),
    action: atMost(32, "payoff action"),
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
