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

  it("blocks the same structured evergreen brief", () => {
    expect(duplicateReason(
      { topic:"How NISS works",audience:"new residents",subject_family:"identity_access",user_question:"what is niss",content_intent:"evergreen_explainer" },
      { topic:"NISS explained",audience:"new residents",subject_family:"identity_access",user_question:"what is niss",content_intent:"evergreen_explainer" },
    )).toBe("identical editorial brief");
  });

  it("allows different occurrences of a recurring campaign", () => {
    expect(duplicateReason(
      { topic:"Quarterly IVA reminder",postIntent:"deadline_reminder",occurrence_key:"iva:2027-q1" },
      { topic:"Quarterly IVA reminder",post_intent:"deadline_reminder",occurrence_key:"iva:2027-q2" },
    )).toBeNull();
  });

  it("separates distinct rules that share one subject", () => {
    // These two both say IRS and were both retired as repeats of each other. They are
    // different rules, different figures and different evidence.
    expect(duplicateReason(
      { topic: "Rent and old mortgage interest, both at fifteen per cent on your IRS", postIntent: "evergreen_explainer" },
      { topic: "Three hundred and sixty-five days that change a crypto gain on your IRS", post_intent: "evergreen_explainer" },
    )).toBeNull();
    expect(duplicateReason(
      { topic: "What health and education expenses are actually worth on your IRS", postIntent: "evergreen_explainer" },
      { topic: "The income floor below which IRS is not payable", post_intent: "evergreen_explainer" },
    )).toBeNull();
  });

  it("still blocks a bare second explainer of the same instrument", () => {
    expect(duplicateReason(
      { topic: "How IRS works", postIntent: "evergreen_explainer" },
      { topic: "What your IRS is, explained", post_intent: "evergreen_explainer" },
    )).toContain("IRS");
  });
});
