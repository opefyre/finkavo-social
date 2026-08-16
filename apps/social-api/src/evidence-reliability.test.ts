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
    expect(result.failures.join(" ")).toMatch(/lacks matching confirmation/);
  });
});
