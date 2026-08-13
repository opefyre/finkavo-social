import { describe, expect, it } from "vitest";
import { duplicateReason } from "./duplicate.js";

describe("duplicateReason", () => {
  it("blocks differently worded evergreen NIF explainers", () => {
    expect(duplicateReason(
      { topic: "Getting a NIF before moving for new residents", postIntent: "evergreen_explainer" },
      { topic: "What a Portuguese NIF is: a plain-English explanation", post_intent: "evergreen_explainer" },
    )).toContain("NIF");
  });

  it("allows recurring deadline reminders", () => {
    expect(duplicateReason(
      { topic: "IRS filing deadline: one week left", postIntent: "deadline_reminder" },
      { topic: "IRS filing deadline: one month left", post_intent: "deadline_reminder" },
    )).toBeNull();
  });

  it("allows new regulatory reporting on an existing subject", () => {
    expect(duplicateReason(
      { topic: "NIF rules changed today", postIntent: "regulatory_change" },
      { topic: "What a Portuguese NIF is", post_intent: "evergreen_explainer" },
    )).toBeNull();
  });

  it("does not treat shared editorial angle wording as the subject", () => {
    expect(duplicateReason(
      { topic: "Requesting a NISS: mistakes, exceptions and edge cases", postIntent: "common_mistake" },
      { topic: "Keeping foreign medical records usable: mistakes, exceptions and edge cases", post_intent: "common_mistake" },
    )).toBeNull();
  });
});
