import { describe, expect, it } from "vitest";
import { retryDecision } from "./retry-policy.js";

describe("retry policy", () => {
  it("retries transient failures after 2 and 10 minutes, then dead-letters", () => {
    expect(retryDecision(1, true)).toEqual({ retry: true, blocked: false, delayMinutes: 2 });
    expect(retryDecision(2, true)).toEqual({ retry: true, blocked: false, delayMinutes: 10 });
    expect(retryDecision(3, true)).toEqual({ retry: true, blocked: false, delayMinutes: 30 });
    expect(retryDecision(6, true)).toEqual({ retry: true, blocked: false, delayMinutes: 720 });
    expect(retryDecision(7, true)).toEqual({ retry: false, blocked: false, delayMinutes: null });
  });

  it("does not retry permanent or ambiguous provider outcomes", () => {
    expect(retryDecision(1, false)).toEqual({ retry: false, blocked: false, delayMinutes: null });
    expect(retryDecision(1, true, true)).toEqual({ retry: false, blocked: true, delayMinutes: null });
    expect(retryDecision(1, true, false, 60)).toEqual({ retry: true, blocked: false, delayMinutes: 60 });
  });
});
