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
    // A feed of nothing but reels is found and forgotten: most of the day has to be the
    // format people keep.
    const decision = choosePostFormat({ ...base, contentIntent: "deadline_reminder", reelsAlreadyOnDay: 1 });
    expect(decision).toEqual({ format: "carousel", reason: expect.stringContaining("cap") });
  });

  it("gives a day of nothing but explainers a reel anyway", () => {
    // Preferring dated posts is only a preference. A day made entirely of explainers was
    // getting no reel at all, which is how the format meant to reach strangers ends up
    // never running.
    const lastChance = choosePostFormat({
      ...base, contentIntent: "evergreen_explainer",
      reelsAlreadyOnDay: 0, postsAlreadyOnDay: 4, postsPerDay: 5,
    });
    expect(lastChance.format).toBe("reel");
    expect(lastChance.reason).toContain("still owes");
  });

  it("waits for a better candidate while the day still has room", () => {
    // Early in the day an explainer stays a carousel: a deadline may still turn up, and
    // it would make the better reel.
    const early = choosePostFormat({
      ...base, contentIntent: "evergreen_explainer",
      reelsAlreadyOnDay: 0, postsAlreadyOnDay: 1, postsPerDay: 5,
    });
    expect(early.format).toBe("carousel");
  });

  it("gives every day one reel across a run of days", () => {
    // The property that matters: five explainer-only posts a day still yield one reel.
    for (const intents of [
      ["evergreen_explainer", "checklist", "evergreen_explainer", "audience_specific", "evergreen_explainer"],
      ["deadline_reminder", "evergreen_explainer", "checklist", "evergreen_explainer", "evergreen_explainer"],
    ]) {
      let reels = 0;
      intents.forEach((intent, index) => {
        const decision = choosePostFormat({
          hasValidReel: true, contentIntent: intent,
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
    const decision = choosePostFormat({ ...base, contentIntent: "deadline_reminder" });
    expect(decision.reason).toContain("date or a consequence");
  });
});
