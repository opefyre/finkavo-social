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
});
