import { describe, expect, it } from "vitest";
import { selectVisualStyle } from "./visual-style.js";

describe("visual style selection", () => {
  it("keeps deadline and alert palettes as their intent defaults", () => {
    expect(selectVisualStyle({ post_intent: "deadline_reminder", id: "1" })).toBe("peach_deadline");
    expect(selectVisualStyle({ post_intent: "timely_news", id: "2" })).toBe("ink_alert");
  });

  it("includes peach in the evergreen palette rotation", () => {
    const styles = new Set(Array.from({ length: 30 }, (_, index) => selectVisualStyle({ post_intent: "evergreen_explainer", planned_for: "2026-08-16", id: `post-${index}`, topic: `Topic ${index}` })));
    expect(styles).toEqual(new Set(["cream_guide", "mint_checklist", "petrol_editorial", "peach_deadline"]));
  });

  it("lets a planned deadline win over the model's chosen intent", () => {
    // A date-locked calendar row is a deadline whatever the model decides to call it.
    expect(selectVisualStyle({ content_intent: "deadline_reminder", post_intent: "evergreen_explainer" })).toBe("peach_deadline");
    expect(selectVisualStyle({ content_intent: "occasion", post_intent: "checklist" })).toBe("peach_deadline");
  });

  it("ignores a planned intent that carries no palette of its own", () => {
    // Only the four plan-authoritative intents override; everything else still follows
    // the model, so ordinary rows keep their stable rotation.
    expect(selectVisualStyle({ content_intent: "evergreen_explainer", post_intent: "timely_news" })).toBe("ink_alert");
  });
});
