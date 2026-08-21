import { z } from "zod";

// A Reel is watched, not read. Where a carousel slide can carry a paragraph because the
// reader chose to stop on it, a frame here has about two seconds of a stranger's
// attention while their thumb is already moving. So each frame carries one idea, the
// figure is the thing the eye lands on, and the copy is short enough to finish before
// the frame changes.
export const ReelFrameSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("hook"),
    kicker: z.string().min(1).max(30).optional(),
    headline: z.string().min(1).max(90),
  }),
  z.object({
    type: z.literal("beat"),
    // The number is the reason to keep watching: "30 June", "€200", "24 months".
    figure: z.string().min(1).max(18).optional(),
    label: z.string().min(1).max(38).optional(),
    body: z.string().min(1).max(150),
  }),
  z.object({
    type: z.literal("payoff"),
    headline: z.string().min(1).max(70),
    action: z.string().min(1).max(90),
  }),
]);

export const ReelManifestSchema = z.object({
  topic: z.string().min(1),
  visualStyle: z.enum(["petrol_editorial", "cream_guide", "mint_checklist", "peach_deadline", "ink_alert"]),
  sourceLabel: z.string().min(1).max(90),
  // Three to five frames. Under three there is no story; over five and a fifteen-second
  // Reel gives each frame too little time to be read.
  frames: z.array(ReelFrameSchema).min(3).max(5),
});

export type ReelFrame = z.infer<typeof ReelFrameSchema>;
export type ReelManifest = z.infer<typeof ReelManifestSchema>;
