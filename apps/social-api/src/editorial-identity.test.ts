import { describe, expect, it } from "vitest";
import { canonicalQuestion, editorialIdentity } from "./editorial-identity.js";

describe("editorial identity", () => {
  it("removes mechanical angle wording", () => {
    expect(canonicalQuestion("Requesting a NISS: mistakes, exceptions and edge cases")).toBe("requesting a niss");
  });

  it("keeps recurring occurrences separate", () => {
    const base = { time:"08:30",slot:1,pillar:"iva",angle:"action",title:"Quarterly IVA declaration",audience:"freelancers",risk:"high" as const,timing:"rule_locked",reserve:"date_locked",searchTerms:"IVA",authority:"AT",occurrence:1,evidenceTerms:"IVA" };
    expect(editorialIdentity({ ...base, date:"2027-02-20" }).occurrenceKey).not.toBe(editorialIdentity({ ...base, date:"2027-05-20" }).occurrenceKey);
  });
});
