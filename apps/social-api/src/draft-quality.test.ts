import { describe, expect, it } from "vitest";
import { DraftSchema } from "./contracts.js";
import { assertEnglishUserCopy, validateSocialDraft } from "./draft-quality.js";

const good = DraftSchema.parse({ topic:"Portugal deadline",category:"tax",riskLevel:"high",postIntent:"deadline_reminder",hook:"A deadline worth preparing for.",caption:"Portugal tax deadline explained clearly.",callToAction:"Save this reminder.",hashtags:["#Portugal","#Tax","#Deadline","#Finkavo"],searchKeywords:["Portugal tax deadline","filing reminder Portugal"],slides:[{type:"cover",icon:"calendar",eyebrow:"Deadline",title:"Prepare before the deadline",body:"Know what to check before you submit.",items:[],highlight:"",sourceLabel:"Official source",altText:"Cover layout with a calendar icon and deadline title."},{type:"bullets",icon:"check",eyebrow:"Checklist",title:"Before you submit",body:"",items:["Check your information before submission.","Keep the official receipt after submission."],highlight:"",sourceLabel:"Official source",altText:"Checklist layout with two preparation items."},{type:"summary",icon:"document",eyebrow:"Summary",title:"Prepare early",body:"Use the official portal and keep your receipt.",items:[],highlight:"",sourceLabel:"Official source",altText:"Summary layout with a document icon and final reminder."}],claims:[{claim:"The official portal provides the filing process.",evidenceQuote:"Use the official portal to submit the declaration."}] });

describe("social draft quality", () => {
  it("accepts complete deterministic social copy", () => expect(() => validateSocialDraft(good)).not.toThrow());
  it.each(["low","medium","high"] as const)("accepts a complete %s-risk post", riskLevel => {
    const candidate=structuredClone(good);candidate.riskLevel=riskLevel;expect(()=>validateSocialDraft(candidate)).not.toThrow();
  });
  it("rejects truncated, markdown, and invented-visual copy", () => {
    const broken = structuredClone(good);
    broken.slides[1]!.items[0] = "- **The count resumes on the 1st day of the month";
    expect(() => validateSocialDraft(broken)).toThrow();
    broken.slides[1]!.items[0] = "Check your information before submission.";
    broken.slides[1]!.altText = "An illustration of people standing beside a chart.";
    expect(() => validateSocialDraft(broken)).toThrow();
  });
  it("rejects Portuguese and mixed Portuguese-English public copy", () => {
    expect(() => assertEnglishUserCopy(["How your contribution is calculated: 21,4% sobre a base mensal calculada a partir da declaração trimestral.", "Regra geral de contribuição para trabalhadores independentes. O pagamento é mensal."])).toThrow(/English/);
    expect(() => assertEnglishUserCopy(["A Portuguese NIF is a tax identification number. Keep your Número de Identificação Fiscal available."])).not.toThrow();
  });
  it("accepts legitimate official and payment acronyms", () => {
    const candidate=structuredClone(good);
    candidate.slides[0]!.body="Use ASAE for the official complaints route.";
    candidate.slides[1]!.items=["Check the IBAN and NIB before a SWIFT transfer.","Use SPIN only through your payment provider."];
    expect(()=>validateSocialDraft(candidate)).not.toThrow();
  });
  it("rejects an all-caps emphasis phrase", () => {
    const candidate=structuredClone(good);
    candidate.slides[0]!.body="SAVE THIS IMPORTANT POST.";
    expect(()=>validateSocialDraft(candidate)).toThrow(/all-caps/);
  });
});
