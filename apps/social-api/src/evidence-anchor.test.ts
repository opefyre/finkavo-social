import { describe, expect, it } from "vitest";
import { anchorQuote } from "./evidence-anchor.js";

const CORPUS = [
  "Estao dispensados de apresentar a declaracao de IRS os sujeitos passivos que apenas tenham auferido rendimentos do trabalho dependente ou pensoes de montante inferior a 8500 euros.",
  "O prazo de entrega da declaracao de IRS decorre de 1 de abril a 30 de junho, independentemente de esse dia ser util ou nao.",
  "A reclamacao graciosa deve ser apresentada no prazo de 120 dias contados a partir do termo do prazo para pagamento voluntario.",
].join(" ");

describe("anchoring a claim to the source's own words", () => {
  it("keeps a quote that was already copied exactly", () => {
    const exact = "O prazo de entrega da declaracao de IRS decorre de 1 de abril a 30 de junho";
    expect(anchorQuote(exact, CORPUS)).toEqual({ anchored: true, quote: exact });
  });

  it("recovers the source wording when the model's copy drifted", () => {
    // The shape of the real failure: it starts right and loses the thread partway.
    const drifted = "A reclamacao graciosa deve ser apresentada no prazo de 120 dias a contar do fim do prazo de pagamento";
    const result = anchorQuote(drifted, CORPUS);
    expect(result.anchored).toBe(true);
    if (result.anchored) {
      // What comes back is the source's sentence, not the model's approximation of it.
      expect(CORPUS).toContain(result.quote);
      expect(result.quote).toContain("120 dias");
      expect(result.quote).not.toContain("a contar do fim");
    }
  });

  it("still refuses a claim the source does not carry", () => {
    const invented = "O prazo de entrega pode ser prorrogado por mais seis meses mediante pedido ao diretor de financas";
    const result = anchorQuote(invented, CORPUS);
    expect(result.anchored).toBe(false);
    if (!result.anchored) expect(result.reason).toMatch(/no passage of the source/);
  });

  it("returns the tightest passage that carries the claim, not a padded one", () => {
    const result = anchorQuote("rendimentos do trabalho dependente ou pensoes inferior a 8500 euros", CORPUS);
    expect(result.anchored).toBe(true);
    if (result.anchored) {
      expect(result.quote).toContain("8500 euros");
      // It must not drag in the unrelated deadline sentence alongside it.
      expect(result.quote).not.toContain("1 de abril");
    }
  });
});
