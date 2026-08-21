import { describe, expect, it } from "vitest";
import { DraftSchema } from "./contracts.js";
import { assertEnglishUserCopy, validateSocialDraft, validateStandaloneValue } from "./draft-quality.js";

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
    expect(() => assertEnglishUserCopy(["Use Portal das Finanças as a starting point. A filing exemption is not the same as an automatic exemption from every tax obligation."])).not.toThrow();
  });
  it("rejects non-Latin text accidentally mixed into English copy", () => {
    expect(() => assertEnglishUserCopy(["Save this post if你想 keep it handy."])).toThrow(/English Latin script/);
  });
  it("rejects source-page trivia without a reader outcome", () => {
    const candidate=structuredClone(good);
    candidate.topic="Which law and regulation does the Justice page flag?";
    candidate.hook="See which law and regulation the official page flags.";
    candidate.callToAction="Keep these official law names handy.";
    expect(()=>validateSocialDraft(candidate)).toThrow(/source-page trivia/);
  });
  it("rejects a cover that merely reports what an official guide lists",()=>{const candidate=structuredClone(good);candidate.topic="Adult education routes for migrants";candidate.hook="See which adult learning routes the gov guide lists.";candidate.slides[0]!.title="Adult education routes for migrants";candidate.slides[0]!.body="Find the adult learning routes named in the official guide.";expect(()=>validateSocialDraft(candidate)).toThrow(/source|standalone/i);});
  it("rejects unexplained official and payment acronyms", () => {
    const candidate=structuredClone(good);
    candidate.slides[0]!.body="Use ASAE for the official complaints route.";
    candidate.slides[1]!.items=["Check the IBAN and NIB before a SWIFT transfer.","Use SPIN only through your payment provider."];
    expect(()=>validateSocialDraft(candidate)).toThrow(/defined/);
  });
  it("accepts an acronym when the term is explained",()=>{const candidate=structuredClone(good);candidate.slides[0]!.body="A Portuguese tax identification number (NIF) identifies a taxpayer.";candidate.topic="Portuguese tax identification number";candidate.slides[0]!.title="Your Portuguese tax number";expect(()=>validateSocialDraft(candidate)).not.toThrow();});
  it("rejects an all-caps emphasis phrase", () => {
    const candidate=structuredClone(good);
    candidate.slides[0]!.body="SAVE THIS IMPORTANT POST.";
    expect(()=>validateSocialDraft(candidate)).toThrow(/all-caps/);
  });

  // The final slide must leave the reader something to do. That was expressed as a list
  // of nineteen permitted verbs, so "File by 30 June" and "Confirm your tax number" were
  // refused for using a synonym — a third of one morning's drafts died on it.
  describe("the practical next step on the final slide", () => {
    const build = (takeaway: string) => ({
      topic: "tax return filing", hook: "Filing your tax return in Portugal", caption: "c",
      callToAction: "Check the deadline.", hashtags: ["#tax"],
      slides: [
        { type: "cover", title: "Tax return filing in Portugal", body: "The tax return filing window for residents who must submit a return.", items: [], altText: "a", sourceLabel: "Tax office", eyebrow: "Tax" },
        { type: "content", title: "Who must file", body: "Residents with income must submit the return before the deadline.", items: [], altText: "a", sourceLabel: "Tax office", eyebrow: "Tax" },
        { type: "summary", title: "Next step", body: takeaway, items: [], altText: "a", sourceLabel: "Tax office", eyebrow: "Tax" },
      ],
    });

    for (const takeaway of [
      "File your tax return by 30 June to avoid the penalty.",
      "Confirm your tax number before signing the lease.",
      "Ask the tax office for the form if your situation changed.",
      "Keep the receipt: you will need it to claim the deduction.",
    ]) {
      it(`accepts a real instruction: ${takeaway.slice(0, 32)}`, () => {
        expect(() => validateStandaloneValue(build(takeaway) as never)).not.toThrow();
      });
    }

    for (const takeaway of ["Save this post. Follow for more.", "Share this and follow us for more tips."]) {
      it(`still refuses engagement bait: ${takeaway.slice(0, 28)}`, () => {
        expect(() => validateStandaloneValue(build(takeaway) as never)).toThrow(/final slide needs/);
      });
    }
  });
});


describe("the final slide", () => {
  const post = (last: { title: string; body: string }) => ({
    topic: "The reinvestment window that removes tax on selling your home",
    hook: "Selling your home in Portugal? The tax can disappear.",
    caption: "If you reinvest the proceeds of your permanent home within the window, the gain is not taxed. Residents who sell and buy again qualify, so check the dates before you sign anything.",
    slides: [
      { title: "The reinvestment window", body: "Selling your permanent home in Portugal can be tax free." },
      { title: "What counts", body: "The property you sold has to have been your permanent home." },
      { title: "The window", body: "You reinvest within the period the law allows." },
      last,
    ],
  });

  it("accepts a takeaway phrased without a whitelisted verb", () => {
    // Every one of these was refused by the permitted-verb list.
    for (const body of [
      "30 June is the deadline to declare the reinvestment.",
      "Read the notice from Financas before you sign.",
      "Set a reminder for the reinvestment window.",
      "Get the form from Financas before the deadline.",
    ]) {
      expect(() => validateStandaloneValue(post({ title: "Before you sell", body })), body).not.toThrow();
    }
  });

  it("still refuses a last slide that says nothing about the post", () => {
    expect(() => validateStandaloneValue(post({ title: "Save this", body: "Save this for later." })))
      .toThrow(/final slide/i);
    expect(() => validateStandaloneValue(post({ title: "Follow", body: "Follow us for more tips." })))
      .toThrow(/final slide/i);
  });
});
