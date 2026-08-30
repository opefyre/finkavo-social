import { describe, expect, it } from "vitest";
import { ReelManifestSchema, HOLD_SECONDS, STILL_SECONDS } from "./reel-schema.js";
import { frameDurations } from "./compose-reel.js";

const manifest = (overrides: Record<string, unknown> = {}) => ({
  topic: "The August IMI instalment",
  visualStyle: "peach_deadline",
  sourceLabel: "Autoridade Tributaria e Aduaneira",
  frames: [
    { type: "hook", kicker: "10 days left", headline: "Your IMI instalment is due this month." },
    { type: "beat", figure: "31 August", label: "The deadline", body: "Miss it and the whole bill can fall due." },
    { type: "payoff", headline: "Check your IMI notice.", action: "Portal das Financas, before the 31st." },
  ],
  ...overrides,
});

describe("copy written to the length of the cut", () => {
  it("accepts copy short enough to read in the time it is shown", () => {
    const parsed = ReelManifestSchema.parse(manifest());
    expect(parsed.holdSeconds).toBe(HOLD_SECONDS);
  });

  it("accepts a beat written to the weight of a carousel slide", () => {
    // The frame is meant to hold more than 1.7 seconds allows, so the viewer stops to
    // finish it. Forty-odd words is a slide, and a slide is the point.
    const full = manifest({
      frames: [
        { type: "hook", headline: "Your IMI instalment is due this month, and August is the one people forget" },
        { type: "beat", figure: "31 August", body: "Miss this date and the tax authority can call in the entire remaining bill at once, rather than letting you keep paying it in parts across the year as you had planned when the first instalment fell due." },
        { type: "payoff", headline: "Check your IMI notice before the month ends", action: "Portal das Financas has the instalment and the direct debit, and the charge only happens automatically if you set that up earlier." },
      ],
    });
    expect(() => ReelManifestSchema.parse(full)).not.toThrow();
  });

  it("refuses more than the frame can typeset, and says how much it may hold", () => {
    const overflowing = manifest({
      frames: [
        { type: "hook", headline: "Your IMI instalment is due this month." },
        { type: "beat", figure: "31 August", body: Array.from({ length: 60 }, () => "word").join(" ") },
        { type: "payoff", headline: "Check your IMI notice.", action: "Portal das Financas, before the 31st." },
      ],
    });
    expect(() => ReelManifestSchema.parse(overflowing)).toThrow(/beat body must be 42 words or fewer/);
  });

  it("refuses a figure that is really a sentence", () => {
    const wordy = manifest({
      frames: [
        { type: "hook", headline: "Your IMI instalment is due this month." },
        { type: "beat", figure: "the thirty first day of August", body: "Miss it and the bill falls due." },
        { type: "payoff", headline: "Check your IMI notice.", action: "Portal das Financas, before the 31st." },
      ],
    });
    expect(() => ReelManifestSchema.parse(wordy)).toThrow(/figure must be 3 words or fewer/);
  });

  it("holds every frame for the same beat, and keeps five of them inside a scroll", () => {
    // The old ceiling here was thirteen seconds for five frames, on the reasoning that a
    // reel should be something you fall into rather than commit to. That was traded
    // deliberately: at a 2.3s hold the copy finished arriving and the frame left, so a
    // section read as motion and there was nothing to stop on — and a viewer stopping is
    // the entire reason a frame carries more words than its hold allows. A second of
    // stillness per section is worth the extra length, so five frames now run 16.5s.
    // The reveal did not slow down to buy it; see `pace` in reel-motion.
    const parsed = ReelManifestSchema.parse(manifest());
    const durations = frameDurations(parsed.frames, parsed.holdSeconds);
    expect(new Set(durations).size).toBe(1);
    expect(durations[0]).toBeCloseTo(HOLD_SECONDS, 2);
    expect(HOLD_SECONDS).toBeGreaterThan(1.9);
    expect(STILL_SECONDS).toBeGreaterThanOrEqual(0.8);
    // Still bounded: a reel someone has to commit to is a reel they scroll past.
    expect(HOLD_SECONDS * 5).toBeLessThanOrEqual(18);
  });
});
