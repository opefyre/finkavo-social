import { describe, expect, it } from "vitest";
import { ReelManifestSchema, HOLD_SECONDS } from "./reel-schema.js";
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

  it("refuses a beat nobody could finish reading, and says how long it may be", () => {
    const long = manifest({
      frames: [
        { type: "hook", headline: "Your IMI instalment is due this month." },
        { type: "beat", figure: "31 August", body: "Miss it and the whole remaining bill can fall due at once, not just the instalment." },
        { type: "payoff", headline: "Check your IMI notice.", action: "Portal das Financas, before the 31st." },
      ],
    });
    expect(() => ReelManifestSchema.parse(long)).toThrow(/beat body must be 12 words or fewer/);
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

  it("holds every frame for the same short beat, so five frames stay under nine seconds", () => {
    const parsed = ReelManifestSchema.parse(manifest());
    const durations = frameDurations(parsed.frames, parsed.holdSeconds);
    expect(new Set(durations).size).toBe(1);
    expect(durations[0]).toBeCloseTo(HOLD_SECONDS, 2);
    expect(HOLD_SECONDS * 5).toBeLessThan(9);
  });
});
