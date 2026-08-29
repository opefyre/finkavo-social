import { describe, expect, it } from "vitest";
import { classifyGenerationFailure, countsAsAttempt, shouldRetireConcept, MAX_GENERATION_ATTEMPTS, MAX_TOTAL_ATTEMPTS } from "./block-reason.js";

describe("generation failure classification", () => {
  it("treats provider and transport trouble as no verdict on the topic", () => {
    for (const error of [
      "The operation was aborted due to timeout",
      "groq token/rate limit hit (retry after 42s)",
      "Request too large for model `openai/gpt-oss-120b`",
      "paced locally: the 8000-token minute needs 31s before this request fits",
      "Expected ',' or '}' after property value in JSON at position 4211",
      "groq request failed (400): Generated JSON does not match the expected schema",
      "fetch failed",
    ]) {
      const failure = classifyGenerationFailure(error);
      expect(failure.kind, error).toBe("infrastructure");
      expect(countsAsAttempt(failure), error).toBe(false);
      expect(shouldRetireConcept(failure, 99), error).toBe(false);
    }
  });

  it("counts editorial misses against the topic, but only after several", () => {
    const failure = classifyGenerationFailure("The final slide needs a topic-specific takeaway or next step");
    expect(failure.kind).toBe("content_quality");
    expect(countsAsAttempt(failure)).toBe(true);
    expect(shouldRetireConcept(failure, MAX_GENERATION_ATTEMPTS - 1)).toBe(false);
    expect(shouldRetireConcept(failure, MAX_GENERATION_ATTEMPTS)).toBe(true);
  });

  it("recognises evidence trouble as its own recoverable kind", () => {
    expect(classifyGenerationFailure("Evidence reliability gate failed: Sensitive claim lacks matching confirmation").kind).toBe("evidence");
    expect(classifyGenerationFailure("Sensitive evidence is older than 72 hours and must be researched again").kind).toBe("evidence");
  });
});

describe("total attempt ceiling", () => {
  const infra = classifyGenerationFailure("request timed out after 75000ms");
  it("still refuses to charge infrastructure a judged attempt", () => {
    expect(countsAsAttempt(infra)).toBe(false);
    expect(shouldRetireConcept(infra, 1, 3)).toBe(false);
  });
  it("retires a concept that never reaches judgement once attempts run away", () => {
    // The case this exists for: 84 attempts against a counter reading 6, because every
    // failure was infrastructure and nothing else was counting.
    expect(shouldRetireConcept(infra, 6, MAX_TOTAL_ATTEMPTS)).toBe(true);
  });
  it("leaves the judged ceiling where it was", () => {
    const quality = classifyGenerationFailure("The final slide needs a topic-specific takeaway");
    expect(shouldRetireConcept(quality, MAX_GENERATION_ATTEMPTS, 5)).toBe(true);
    expect(shouldRetireConcept(quality, MAX_GENERATION_ATTEMPTS - 1, 4)).toBe(false);
  });
});
