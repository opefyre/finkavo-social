import { describe, expect, it } from "vitest";
import { repairMechanicalDefects } from "./draft-repair.js";
import { DraftSchema } from "./contracts.js";

/**
 * The largest single cause of discarded drafts over ten days was a short field a few
 * characters past its limit — most often a slide title over 82. Bodies and list items
 * were repaired here; the short fields were not, so the whole draft died and the attempt
 * was burned. These pin the repair.
 */
const draft = (over: Record<string, unknown>) => ({
  topic: "Sick leave in Portugal",
  category: "social_security",
  riskLevel: "medium",
  postIntent: "evergreen_explainer",
  hook: "What sick leave actually pays in Portugal",
  caption: "A short caption about sick leave in Portugal for the reader.",
  callToAction: "Save this for later.",
  hashtags: ["#Finkavo", "#Portugal"],
  searchKeywords: ["sick leave Portugal", "subsidio de doenca"],
  slides: [1, 2, 3].map(n => ({
    type: n === 1 ? "cover" : "content", icon: "document",
    eyebrow: "Sick leave", title: `Slide ${n} title`, body: "Body copy.",
    items: [], highlight: "", altText: "Alt text for the slide.",
    ...(n === 1 ? over : {}),
  })),
  claims: [{ claim: "Sick pay starts on day four.", evidenceQuote: "o subsidio e devido a partir do 4.o dia" }],
});

describe("mechanical repair of over-long short fields", () => {
  it("trims a title past 82 characters instead of losing the draft", () => {
    const title = "The waiting period before Segurança Social begins paying your sick leave benefit in full";
    expect(title.length).toBeGreaterThan(82);
    const repaired = repairMechanicalDefects(draft({ title })) as { slides: { title: string }[] };
    expect(repaired.slides[0].title.length).toBeLessThanOrEqual(82);
    // Cut at a word boundary, not mid-word, and no dangling punctuation.
    expect(title.startsWith(repaired.slides[0].title)).toBe(true);
    expect(repaired.slides[0].title).not.toMatch(/[\s,;:.-]$/);
    expect(() => DraftSchema.parse(repaired)).not.toThrow();
  });

  it("trims an over-long eyebrow and call to action", () => {
    const repaired = repairMechanicalDefects({
      ...draft({ eyebrow: "A very long eyebrow label that runs well past its forty character limit" }),
      callToAction: "Save this post so you can find the rule again when you actually need it one day",
    }) as { slides: { eyebrow: string }[]; callToAction: string };
    expect(repaired.slides[0].eyebrow.length).toBeLessThanOrEqual(40);
    expect(repaired.callToAction.length).toBeLessThanOrEqual(80);
  });

  it("leaves a field that already fits exactly as it was", () => {
    const title = "Sick leave starts on day four";
    const repaired = repairMechanicalDefects(draft({ title })) as { slides: { title: string }[] };
    expect(repaired.slides[0].title).toBe(title);
  });
});
