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
  postsAlreadyOnDay?: number;
  postsPerDay?: number;
  reelsPerDay?: number;
  maxReelsPerDay?: number;
}): FormatDecision {
  const postsPerDay = input.postsPerDay ?? 5;
  const wantedReels = input.reelsPerDay ?? 1;
  const maxReels = input.maxReelsPerDay ?? wantedReels;

  if (!input.hasValidReel) return { format: "carousel", reason: "no reel survived generation for this post" };
  if (input.reelsAlreadyOnDay >= maxReels) {
    return { format: "carousel", reason: `the day already has ${input.reelsAlreadyOnDay} reel(s), which is the cap` };
  }

  const planned = String(input.contentIntent ?? "");
  const chosen = String(input.postIntent ?? "");
  const intent = URGENT_INTENTS.has(planned) ? planned : chosen;
  if (URGENT_INTENTS.has(intent)) {
    return { format: "reel", reason: `${intent} carries a date or a consequence, which is what a reel is for` };
  }

  // The floor. Preferring dated posts is the right instinct but it is only a preference,
  // and a day made entirely of explainers was getting no reel at all — which is how a
  // format meant to reach strangers ends up never running. Once there are no longer more
  // slots left than reels still owed, the next post that can carry one does, whatever it
  // is about. A quieter reel is worth more than the day's only chance at reach going
  // unused.
  const stillOwed = wantedReels - input.reelsAlreadyOnDay;
  const slotsLeftAfterThis = Math.max(0, postsPerDay - (input.postsAlreadyOnDay ?? 0) - 1);
  if (stillOwed > 0 && slotsLeftAfterThis < stillOwed) {
    return { format: "reel", reason: `the day still owes ${stillOwed} reel and has ${slotsLeftAfterThis} slot(s) left after this one` };
  }

  return { format: "carousel", reason: `${intent || "evergreen"} rewards being saved and re-read, which a carousel does better` };
}

/** How many reels a day should carry, given how many posts it holds. */
export function reelsPerDay(postsPerDay: number, maxReelsPerDay = 1): number {
  // One a day out of five: enough that the account is reaching people who have never
  // heard of it, few enough that most of the feed is still the format people save. Never
  // the whole day, even on a day made entirely of deadlines.
  return Math.max(0, Math.min(maxReelsPerDay, Math.max(postsPerDay >= 2 ? 1 : 0, Math.floor(postsPerDay / 5))));
}
