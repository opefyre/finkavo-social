import { describe, expect, it } from "vitest";
import { meteredAllows, hydrateLlmSpend } from "./llm.js";

describe("the ceiling on a provider that might bill", () => {
  it("lets a provably free provider through untouched", () => {
    // OpenRouter is constrained to ":free" models and Groq's key is a free-tier account
    // whose ceiling the provider enforces itself.
    expect(meteredAllows("openrouter")).toBe(true);
    expect(meteredAllows("groq")).toBe(true);
  });

  it("stops a metered provider once the day's allowance is gone", () => {
    const cap = Number(process.env.LLM_METERED_MAX_CALLS_PER_DAY ?? 200);
    const now = Date.now();
    expect(meteredAllows("mistral", now)).toBe(true);
    hydrateLlmSpend(Array.from({ length: cap - 1 }, (_, index) => ({
      at: now - index * 1_000, tokens: 1_000, paid: false, provider: "mistral",
    })));
    expect(meteredAllows("mistral", now)).toBe(true);
    hydrateLlmSpend([{ at: now, tokens: 1_000, paid: false, provider: "mistral" }]);
    expect(meteredAllows("mistral", now)).toBe(false);
  });

  it("forgets a day-old call, so the allowance recovers", () => {
    const now = Date.now();
    expect(meteredAllows("mistral", now + 25 * 60 * 60 * 1000)).toBe(true);
  });
});
