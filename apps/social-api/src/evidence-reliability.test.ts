import { describe, expect, it } from "vitest";
import { assessEvidenceReliability } from "./evidence-reliability.js";

const claim = { claim: "The contribution rate is 21.4%.", evidenceQuote: "A taxa contributiva é de 21,4%." };
describe("evidence reliability", () => {
  it("blocks a sensitive claim backed only by gov.pt", () => {
    const result=assessEvidenceReliability({topic:"Social Security contributions for freelancers",category:"social_security",claims:[{claim:"The contribution rate is 29.6%.",evidenceQuote:"correspondem a 29,6%"}],sources:[{url:"https://www.gov.pt/guide",tier:"official",excerpts:["correspondem a 29,6%"]}]});
    expect(result.passed).toBe(false);
    expect(result.failures.join(" ")).toMatch(/two independent|Segurança Social/);
  });
  it("accepts matching confirmation including the responsible authority", () => {
    const result=assessEvidenceReliability({topic:"Social Security contributions for freelancers",category:"social_security",claims:[claim],sources:[
      {url:"https://www.seg-social.pt/faq",tier:"official",excerpts:["A taxa contributiva é de 21,4%."]},
      {url:"https://diariodarepublica.pt/dr/legislacao",tier:"official",excerpts:["A taxa contributiva é de 21,4%."]},
    ]});
    expect(result.passed).toBe(true);
  });
  it("blocks two official sources when their sensitive values do not agree", () => {
    const result=assessEvidenceReliability({topic:"Social Security contributions",category:"social_security",claims:[claim],sources:[
      {url:"https://www.seg-social.pt/faq",tier:"official",excerpts:["A taxa contributiva é de 21,4%."]},
      {url:"https://www.gov.pt/guide",tier:"official",excerpts:["A taxa contributiva é de 29,6%."]},
    ]});
    expect(result.passed).toBe(false);
    expect(result.failures.join(" ")).toMatch(/disagree on a figure|lacks matching confirmation/);
  });

  it("accepts the responsible authority alone when nothing contradicts it", () => {
    // Almost every useful personal-finance claim carries a figure, so demanding a second
    // site repeat the authority's own number blocked the pipeline rather than protecting
    // it. One authority, quoted verbatim and uncontradicted, is enough.
    const result = assessEvidenceReliability({
      topic: "Social Security contributions for freelancers", category: "social_security", claims: [claim],
      sources: [{ url: "https://www.seg-social.pt/faq", tier: "official", excerpts: ["A taxa contributiva e de 21,4%."] }],
    });
    expect(result.passed).toBe(true);
  });

  // The post is written in English and cites a Portuguese source, so every figure has to
  // survive a change of language and of number convention before it can be compared.
  // Without this, "120 days" never matched "120 dias" and a claim the source stated
  // plainly was recorded as unconfirmed.
  const acrossLanguages: Array<[string, string, string, boolean]> = [
    ["a thousands separator", "The exemption applies below 8500 euros.", "O limite e de 8.500 euros por ano.", true],
    ["a decimal comma", "The rate is 21.4%.", "A taxa e de 21,4%.", true],
    ["euros written as a code", "You pay 250 euros.", "O valor e de 250 EUR.", true],
    ["days against dias", "You have 120 days to contest.", "prazo de 120 dias contados.", true],
    ["months against meses", "within 36 months of the sale", "no prazo de 36 meses apos a venda", true],
    ["a figure the source contradicts", "The rate is 29.6%.", "A taxa e de 21,4%.", false],
  ];

  for (const [label, claimText, excerpt, expected] of acrossLanguages) {
    it(`${expected ? "accepts" : "rejects"} ${label}`, () => {
      const result = assessEvidenceReliability({
        topic: "IRS deduction limits", category: "irs",
        claims: [{ claim: claimText, evidenceQuote: excerpt }],
        sources: [{ url: "https://info.portaldasfinancas.gov.pt/faq", tier: "official", excerpts: [excerpt] }],
      });
      expect(result.passed).toBe(expected);
    });
  }
});


describe("the official gazette", () => {
  it("counts as the responsible authority for a topic it legislates", () => {
    // Seven employment topics failed in one day because they cited the Codigo do
    // Trabalho on dre.pt rather than a guidance page on act.gov.pt.
    const result = assessEvidenceReliability({
      topic: "The days of leave owed for a marriage or a death in the family",
      category: "employment",
      claims: [{ claim: "An employee is entitled to 15 consecutive days of leave to marry.", evidenceQuote: "o trabalhador tem direito a faltar 15 dias seguidos por casamento" }],
      sources: [{
        url: "https://dre.pt/codigo-do-trabalho", title: "Codigo do Trabalho", publisher: "Diario da Republica",
        tier: "official", retrievedAt: new Date().toISOString(),
        excerpts: ["o trabalhador tem direito a faltar 15 dias seguidos por casamento"],
      }],
    });
    expect(result.failures.join(" ")).not.toMatch(/responsible authority/i);
  });
});

describe("waiver-only authority rules", () => {
  // Expanding the rule table is only safe if the new entries grant the single-source
  // waiver without also demanding their own authority. If they enforced, a health or
  // condominium topic that passes today on two independent sources would start failing
  // with "the responsible authority is missing" — the table would block more, not less.
  it("never reports a missing authority for a topic no enforced rule claims", () => {
    const result = assessEvidenceReliability({
      topic: "The household income limit for SNS fee exemption",
      claims: [{ claim: "The exemption threshold is 632 euros.", evidenceQuote: "o limiar é de 632 euros" }],
      sources: [
        { url: "https://www.sns.gov.pt/isencao", tier: "official", excerpts: ["o limiar é de 632 euros"] },
        { url: "https://www.portaldasfinancas.gov.pt/x", tier: "official", excerpts: ["o limiar é de 632 euros"] },
      ],
    });
    expect(result.failures.join(" ")).not.toMatch(/responsible authority/);
    expect(result.passed).toBe(true);
  });

  it("waives the second source when the health authority itself states the figure", () => {
    const result = assessEvidenceReliability({
      topic: "Primary care and its prescribed tests carry no user fee",
      claims: [{ claim: "The user fee is 0 euros.", evidenceQuote: "taxa moderadora de 0 euros" }],
      sources: [{ url: "https://www.sns.gov.pt/taxas", tier: "official", excerpts: ["taxa moderadora de 0 euros"] }],
    });
    expect(result.passed).toBe(true);
  });

  it("still enforces the five original authorities", () => {
    const result = assessEvidenceReliability({
      topic: "IRS deadlines for freelancers",
      category: "tax",
      claims: [{ claim: "The rate is 23%.", evidenceQuote: "a taxa é de 23%" }],
      sources: [{ url: "https://www.example-official.pt/guide", tier: "official", excerpts: ["a taxa é de 23%"] }],
    });
    expect(result.passed).toBe(false);
    expect(result.failures.join(" ")).toMatch(/responsible authority/);
  });
});
