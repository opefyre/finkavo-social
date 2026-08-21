import { describe, expect, it } from "vitest";
import { choosePostFormat, reelsPerDay } from "./post-format.js";

const base = { hasValidReel: true, reelsAlreadyOnDay: 0 };

describe("choosing the shape a post goes out in", () => {
  it("sends a dated or costly post as a reel", () => {
    for (const intent of ["deadline_reminder", "timely_news", "regulatory_change", "common_mistake"]) {
      expect(choosePostFormat({ ...base, contentIntent: intent }).format).toBe("reel");
    }
  });

  it("keeps an explainer as a carousel, because that is what gets saved", () => {
    for (const intent of ["evergreen_explainer", "checklist", "audience_specific"]) {
      expect(choosePostFormat({ ...base, contentIntent: intent }).format).toBe("carousel");
    }
  });

  it("lets the plan's intent outrank the model's guess", () => {
    // Planning knows the slot is a dated calendar event; the model is inferring from
    // whatever evidence it happened to be handed.
    const decision = choosePostFormat({ ...base, contentIntent: "deadline_reminder", postIntent: "evergreen_explainer" });
    expect(decision.format).toBe("reel");
  });

  it("falls back to a carousel when no reel survived its checks", () => {
    const decision = choosePostFormat({ ...base, hasValidReel: false, contentIntent: "deadline_reminder" });
    expect(decision).toEqual({ format: "carousel", reason: expect.stringContaining("no reel survived") });
  });

  it("stops turning a whole day into reels", () => {
    // A feed of nothing but reels is found and forgotten: some of the day has to be the
    // format people keep.
    const decision = choosePostFormat({ ...base, contentIntent: "deadline_reminder", reelsAlreadyOnDay: 2 });
    expect(decision).toEqual({ format: "carousel", reason: expect.stringContaining("cap") });
  });

  it("never gives a day more reels than half its posts", () => {
    expect(reelsPerDay(5)).toBe(2);
    expect(reelsPerDay(3)).toBe(1);
    expect(reelsPerDay(1)).toBe(0);
    expect(reelsPerDay(10)).toBe(2);
  });

  it("explains itself, because the choice shows up in the feed", () => {
    const decision = choosePostFormat({ ...base, contentIntent: "deadline_reminder" });
    expect(decision.reason).toContain("date or a consequence");
  });
});
