// Which shape a post goes out in.
//
// The two formats do different jobs and the numbers say so plainly: a reel reaches about
// 2.25 times what a single image does and 1.36 times a carousel, while a carousel earns
// roughly nine times the saves. Reach finds people who have never heard of the account;
// saves are what a follower does with something they mean to come back to. An account
// that only posts reels is found and forgotten, and one that only posts carousels is
// useful to the people it already has and invisible to everyone else. So one of five is
// a reel.
//
// Which one is not a question of subject. Any topic can be a reel — the sorting used to
// be by intent, on the theory that deadlines suit short video and explainers do not, and
// that was a guess dressed up as a rule. What actually decides whether four frames land
// is whether there is a number to put on them: "30 June", "300 euros", "36 months" is
// what the eye stops for and what gets remembered. A reel without one is four frames of
// prose going past too quickly to read.
//
// So the preference is for the reel that has a figure, whatever it is about. A tax
// deadline and a rule about rental receipts compete on the same terms, and the one with
// the number wins.

export type PostFormat = "reel" | "carousel";

export type FormatDecision = { format: PostFormat; reason: string };

export function choosePostFormat(input: {
  hasValidReel: boolean;
  /** How many of the reel's frames carry a figure — the thing a viewer remembers. */
  reelFiguresCount?: number;
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

  const stillOwed = wantedReels - input.reelsAlreadyOnDay;
  const slotsLeftAfterThis = Math.max(0, postsPerDay - (input.postsAlreadyOnDay ?? 0) - 1);
  const figures = input.reelFiguresCount ?? 0;

  // A reel built around a figure is taken as soon as it appears. Waiting for a better one
  // when this one already has what the format runs on only risks the day ending without.
  if (figures > 0) {
    return { format: "reel", reason: `its reel carries ${figures} figure(s), which is what a viewer remembers` };
  }

  // Without a figure it waits, in case something with one turns up — but only while the
  // day can still afford to wait. A reel of prose beats no reel at all.
  if (stillOwed > 0 && slotsLeftAfterThis < stillOwed) {
    return { format: "reel", reason: `the day still owes ${stillOwed} reel and has ${slotsLeftAfterThis} slot(s) left after this one` };
  }

  return { format: "carousel", reason: "its reel has no figure to build on, and the day can still wait for one that has" };
}

/** How many reels a day should carry, given how many posts it holds. */
export function reelsPerDay(postsPerDay: number, maxReelsPerDay = 1): number {
  // One a day out of five: enough that the account is reaching people who have never
  // heard of it, few enough that most of the feed is still the format people save. Never
  // the whole day, even on a day made entirely of deadlines.
  return Math.max(0, Math.min(maxReelsPerDay, Math.max(postsPerDay >= 2 ? 1 : 0, Math.floor(postsPerDay / 5))));
}
