import { describe, expect, it } from "vitest";
import { expandCalendar, selectDailyMix, type CalendarConfig } from "./planner.js";

const config: CalendarConfig = { version: 1, timezone: "Europe/Lisbon", rules: [{ slug: "quarterly", title: "Quarterly filing", category: "tax", audience: "business", riskLevel: "high", kind: "annual-date", dates: ["04-30", "07-31"], campaign: [{ daysBefore: 14, stage: "guide" }, { daysBefore: 3, stage: "reminder" }], sourceUrl: "https://example.gov", sourceLabel: "Official", verificationCadenceDays: 30 }] };

describe("editorial planner", () => {
  it("creates a new campaign for every recurring deadline", () => {
    const items = expandCalendar(config, "2026-01-01", 365);
    expect(items.map((item) => item.fingerprint)).toEqual(["quarterly:2026-04-30:guide", "quarterly:2026-04-30:reminder", "quarterly:2026-07-31:guide", "quarterly:2026-07-31:reminder"]);
  });
  it("selects urgent due campaigns even when the topic repeats", () => {
    const items = expandCalendar(config, "2026-01-01", 365);
    expect(selectDailyMix(items, "2026-04-27", 2)[0]?.campaignStage).toBe("reminder");
  });
});
