import { describe, expect, it } from "vitest";
import { choosePostFormat } from "./post-format.js";

describe("post format", () => {
  it("is always a carousel, because reels are made by hand", () => {
    // The pipeline and the hand-made reels have no shared counter: a reel pushed straight
    // to Buffer never becomes a social_publish_job row, so any per-day reel arithmetic
    // here would be reasoning from a number that is wrong whenever one exists.
    const decision = choosePostFormat();
    expect(decision.format).toBe("carousel");
    expect(decision.reason).toBeTruthy();
  });
});
