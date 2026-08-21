import { describe, expect, it } from "vitest";
import { choosePostFormat, reelsPerDay } from "./post-format.js";

const base = { hasValidReel: true, reelsAlreadyOnDay: 0, postsPerDay: 5 };

describe("choosing the shape a post goes out in", () => {
  it("takes any topic whose reel has a figure", () => {
    // Subject is not the test. A rental-receipt rule with a number in it makes a better
    // reel than a deadline written as prose.
    const decision = choosePostFormat({ ...base, reelFiguresCount: 2, postsAlreadyOnDay: 0 });
    expect(decision.format).toBe("reel");
    expect(decision.reason).toContain("figure");
  });

  it("waits for a figure while the day can still afford to", () => {
    const early = choosePostFormat({ ...base, reelFiguresCount: 0, postsAlreadyOnDay: 1 });
    expect(early.format).toBe("carousel");
  });

  it("takes a reel without a figure rather than end the day with none", () => {
    const lastChance = choosePostFormat({ ...base, reelFiguresCount: 0, postsAlreadyOnDay: 4 });
    expect(lastChance.format).toBe("reel");
    expect(lastChance.reason).toContain("still owes");
  });

  it("falls back to a carousel when no reel survived its checks", () => {
    const decision = choosePostFormat({ ...base, hasValidReel: false, reelFiguresCount: 3, postsAlreadyOnDay: 4 });
    expect(decision).toEqual({ format: "carousel", reason: expect.stringContaining("no reel survived") });
  });

  it("stops turning a whole day into reels", () => {
    const decision = choosePostFormat({ ...base, reelFiguresCount: 3, reelsAlreadyOnDay: 1 });
    expect(decision).toEqual({ format: "carousel", reason: expect.stringContaining("cap") });
  });

  it("gives every day exactly one reel, whatever the day is made of", () => {
    // The property that matters, across a day with figures and a day without.
    for (const figuresPerPost of [[0, 0, 0, 0, 0], [2, 1, 0, 3, 1], [0, 0, 3, 0, 0]]) {
      let reels = 0;
      figuresPerPost.forEach((figures, index) => {
        const decision = choosePostFormat({
          hasValidReel: true, reelFiguresCount: figures,
          reelsAlreadyOnDay: reels, postsAlreadyOnDay: index, postsPerDay: 5,
        });
        if (decision.format === "reel") reels += 1;
      });
      expect(reels).toBe(1);
    }
  });

  it("asks for one reel in a normal day of five", () => {
    expect(reelsPerDay(5)).toBe(1);
    expect(reelsPerDay(3)).toBe(1);
    expect(reelsPerDay(1)).toBe(0);
  });

  it("explains itself, because the choice shows up in the feed", () => {
    expect(choosePostFormat({ ...base, reelFiguresCount: 1, postsAlreadyOnDay: 0 }).reason).toBeTruthy();
  });
});
