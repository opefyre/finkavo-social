// Which shape a post goes out in.
//
// The two formats do different jobs and the numbers say so plainly: a reel reaches about
// 2.25 times what a single image does and 1.36 times a carousel, while a carousel earns
// roughly nine times the saves. Reach finds people who have never heard of the account;
// saves are what a follower does with something they intend to come back to. An account
// that only posts reels is found and forgotten, and one that only posts carousels is
// useful to the people who already follow it and invisible to everyone else.
//
// So the split follows what the post is for rather than a quota. Something with a date
// and a consequence — a deadline, a change, a mistake that costs money — is worth
// interrupting a stranger's scroll for, and loses nothing by being short. Something a
// reader will want to find again in March is worth the slower format that keeps its
// detail and gets saved.

export type PostFormat = "reel" | "carousel";

/**
 * Intents whose value is urgency: a date, a change, or a way to lose money. These are
 * what a reel is for — the whole point survives four frames, and the number is the post.
 */
const URGENT_INTENTS = new Set([
  "deadline_reminder",
  "timely_news",
  "regulatory_change",
  "occasion",
  "common_mistake",
]);

export type FormatDecision = { format: PostFormat; reason: string };

export function choosePostFormat(input: {
  contentIntent?: string | null;
  postIntent?: string | null;
  hasValidReel: boolean;
  reelsAlreadyOnDay: number;
  maxReelsPerDay?: number;
}): FormatDecision {
  const maxReels = input.maxReelsPerDay ?? 2;

  // No reel to publish is the commonest answer and not an interesting one: the model did
  // not write one, or what it wrote did not survive its checks.
  if (!input.hasValidReel) return { format: "carousel", reason: "no reel survived generation for this post" };

  if (input.reelsAlreadyOnDay >= maxReels) {
    return { format: "carousel", reason: `the day already has ${input.reelsAlreadyOnDay} reels, which is the cap` };
  }

  // The plan's intent outranks the model's. Planning knows a slot is a dated calendar
  // event; the model is guessing from the evidence in front of it.
  const planned = String(input.contentIntent ?? "");
  const chosen = String(input.postIntent ?? "");
  const intent = URGENT_INTENTS.has(planned) ? planned : chosen;

  if (URGENT_INTENTS.has(intent)) {
    return { format: "reel", reason: `${intent} carries a date or a consequence, which is what a reel is for` };
  }

  return { format: "carousel", reason: `${intent || "evergreen"} rewards being saved and re-read, which a carousel does better` };
}

/** How many reels a day should carry, given how many posts it holds. */
export function reelsPerDay(postsPerDay: number, maxReelsPerDay = 2): number {
  // Never the whole day. Even on a day made entirely of deadlines, some of it has to be
  // the format people keep.
  return Math.max(0, Math.min(maxReelsPerDay, Math.floor(postsPerDay / 2)));
}
