// Which shape a post goes out in.
//
// It is a carousel. All of them, every day.
//
// This used to weigh a reel against a carousel per post: a reel reaches about 2.25 times
// what a single image does, a carousel earns roughly nine times the saves, so one of the
// day's posts was a reel and the rest were carousels, with the reel that carried a figure
// winning the slot. The reasoning still holds — reach finds people who have never heard
// of the account, saves are what a follower does with something they mean to return to.
// What changed is who makes the reel. They are made by hand now, one a day, and pushed to
// Buffer directly. A pipeline that also made them produced two reels a day and no way for
// either half to know about the other, because a hand-made reel never becomes a row in
// social_publish_job for the counter to see.
//
// So the decision is gone rather than defaulted. Leaving the reel branch reachable behind
// a flag would mean the count it depends on is wrong whenever a hand-made reel exists,
// and a chooser that silently reasons from a wrong number is worse than one that does not
// reason at all.

export type PostFormat = "reel" | "carousel";

export type FormatDecision = { format: PostFormat; reason: string };

export function choosePostFormat(): FormatDecision {
  return { format: "carousel", reason: "the pipeline publishes carousels; reels are made by hand" };
}
