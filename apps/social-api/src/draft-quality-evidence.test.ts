import { describe, expect, it } from "vitest";
import { validateSocialDraft } from "./draft-quality.js";

const draft = {
  topic: "What a Portuguese NIF is", category: "nif" as const, riskLevel: "medium" as const,
  postIntent: "evergreen_explainer" as const, hook: "Understand your Portuguese NIF before you need it.",
  caption: "In Portugal, the NIF identifies taxpayers in dealings with the tax authority.",
  callToAction: "Save this for your Portugal admin checklist.", hashtags: ["#Finkavo", "#Portugal"],
  searchKeywords: ["Portuguese NIF", "Portugal tax number"],
  slides: [
    { type: "cover" as const, icon: "document" as const, eyebrow: "Portugal admin", title: "What is a NIF?", body: "A simple guide to Portugal’s tax identification number.", items: [], highlight: "", sourceLabel: "Portal das Finanças", altText: "Cover explaining the Portuguese NIF." },
    { type: "summary" as const, icon: "check" as const, eyebrow: "Key point", title: "Keep it available", body: "Store your NIF securely for future administrative tasks.", items: [], highlight: "", sourceLabel: "Portal das Finanças", altText: "Summary advising secure NIF storage." },
  ],
  claims: [{ claim: "The NIF identifies a taxpayer in Portugal.", evidenceQuote: "Número de identificação fiscal (NIF)" }],
};

describe("evidence excerpt quality", () => {
  it("allows an exact source heading without invented punctuation", () => expect(() => validateSocialDraft(draft)).not.toThrow());
});
