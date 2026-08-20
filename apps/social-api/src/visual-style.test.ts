import { describe, expect, it } from "vitest";
import { selectVisualStyle } from "./visual-style.js";

describe("visual style selection", () => {
  it("keeps deadline and alert palettes as their intent defaults", () => {
    expect(selectVisualStyle({ post_intent: "deadline_reminder", id: "1" })).toBe("peach_deadline");
    expect(selectVisualStyle({ post_intent: "timely_news", id: "2" })).toBe("ink_alert");
  });

  it("keeps peach out of the evergreen rotation so it still means a deadline", () => {
    // Peach used to appear in every rotation as well as being the deadline colour, so on
    // a plan where a quarter of posts are dated it landed on close to half of everything
    // and told the reader nothing.
    const styles = new Set(Array.from({ length: 30 }, (_, index) => selectVisualStyle({ post_intent: "evergreen_explainer", planned_for: "2026-08-16", id: `post-${index}`, topic: `Topic ${index}` })));
    expect(styles).toEqual(new Set(["cream_guide", "mint_checklist", "petrol_editorial"]));
    expect(styles.has("peach_deadline")).toBe(false);
  });

  it("spreads a realistic plan across the palettes instead of favouring one", () => {
    const intents = ["deadline_reminder", "evergreen_explainer", "evergreen_explainer", "common_mistake", "checklist", "audience_specific", "evergreen_explainer", "threshold"];
    const tally: Record<string, number> = {};
    for (let index = 0; index < 800; index++) {
      const intent = intents[index % intents.length];
      const style = selectVisualStyle({ planned_for: `2026-08-${1 + (index % 28)}`, id: `id-${index}`, topic: `topic ${index}`, content_intent: intent, post_intent: intent });
      tally[style] = (tally[style] ?? 0) + 1;
    }
    // No palette may run away with the feed; peach tracks how many posts are truly dated.
    for (const style of ["cream_guide", "mint_checklist", "petrol_editorial"]) {
      expect(tally[style]).toBeGreaterThan(800 * 0.15);
      expect(tally[style]).toBeLessThan(800 * 0.45);
    }
    expect(tally.peach_deadline).toBe(100);
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
