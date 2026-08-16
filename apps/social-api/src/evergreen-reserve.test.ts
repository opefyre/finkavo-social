import { describe, expect, it } from "vitest";
import { eligibleReserveCards, type ReserveCard } from "./evergreen-reserve.js";

const card: ReserveCard = { id:"r1",subjectFamily:"nif",topic:"What a NIF is",userQuestion:"What is a NIF?",audience:"new residents",contentIntent:"evergreen_explainer",purpose:"Explain it",requiredAnswers:["a","b","c"],sourcePolicy:{canonicalUrl:"https://gov.pt/nif",requiredAuthority:"gov.pt",officialRequired:true,freshnessDays:30},evidenceTerms:["NIF","tax"],status:"available_when_live_evidence_matches" };
const evidence = [{ canonicalUrl:"https://gov.pt/nif",verifiedAt:"2026-08-12T12:00:00Z" }];

describe("evergreen reserve eligibility", () => {
  it("requires unexpired exact canonical evidence", () => {
    const now=new Date("2026-08-13T12:00:00Z");
    expect(eligibleReserveCards([card],[],[],now)).toHaveLength(0);
    expect(eligibleReserveCards([card],evidence,[],now)).toHaveLength(1);
    expect(eligibleReserveCards([card],[{canonicalUrl:"https://gov.pt/nif",verifiedAt:"2026-07-01T12:00:00Z"}],[],now)).toHaveLength(0);
  });

  it("blocks the same structured brief for 90 days", () => {
    const recent=[{subjectFamily:"nif",userQuestion:"What is a NIF?",audience:"new residents",contentIntent:"evergreen_explainer",usedAt:"2026-08-01T12:00:00Z"}];
    expect(eligibleReserveCards([card],evidence,recent,new Date("2026-08-13T12:00:00Z"))).toHaveLength(0);
  });

  it("pre-filters differently worded repeated NIF posts", () => {
    const candidate={...card,topic:"Who can request a Portuguese NIF",userQuestion:"Who can request a NIF?"};
    const recent=[{subjectFamily:"nif",userQuestion:"Why is a NIF used in Portugal?",audience:"new residents",contentIntent:"evergreen_explainer",usedAt:"2026-08-10T00:00:00Z"}];
    expect(eligibleReserveCards([candidate],evidence,recent,new Date("2026-08-16T00:00:00Z"))).toHaveLength(0);
  });

  it("ranks the most source-specific brief first", () => {
    const generic={...card,id:"generic",topic:"Tax basics",userQuestion:"What are tax basics?",evidenceTerms:["tax"]};
    const detailedEvidence=[{canonicalUrl:"https://gov.pt/nif",verifiedAt:"2026-08-12T12:00:00Z",visibleText:"The Número de Identificação Fiscal (NIF) identifies a taxpayer for tax purposes."}];
    expect(eligibleReserveCards([generic,card],detailedEvidence,[],new Date("2026-08-13T12:00:00Z"))[0]?.id).toBe("r1");
  });
});
