import { describe, expect, it } from "vitest";
import { validateReelFrames, type ReelFrameDraft } from "./reel-quality.js";

const CORPUS = "O prazo de entrega da declaracao de IRS decorre de 1 de abril a 30 de junho. A deducao e de 300 euros por cada dependente. A reclamacao deve ser apresentada no prazo de 120 dias.";

const ok: ReelFrameDraft[] = [
  { type: "hook", text: "Co-parents: split the child deduction" },
  { type: "beat", figure: "30 June", label: "Filing closes", text: "File late and you lose the split" },
  { type: "beat", figure: "300 euros", label: "Per dependent", text: "Each parent claims this amount" },
  { type: "payoff", text: "Register now on the tax authority portal" },
];

const withFrames = (changes: Partial<ReelFrameDraft>, index: number): ReelFrameDraft[] =>
  ok.map((frame, i) => (i === index ? { ...frame, ...changes } : frame));

describe("what a reel is allowed to say", () => {
  it("accepts a reel whose figures the source states", () => {
    expect(validateReelFrames(ok, CORPUS)).toEqual({ ok: true });
  });

  it("refuses a figure the evidence does not state", () => {
    // The number on screen is the part most likely to be believed and least likely to be
    // checked, so an invented one is the worst thing a reel could carry.
    const result = validateReelFrames(withFrames({ figure: "900 euros" }, 2), CORPUS);
    expect(result).toEqual({ ok: false, reason: expect.stringContaining("which the evidence does not state") });
  });

  it("matches a figure across the language of the source", () => {
    // The reel is English, the source is Portuguese: "120 days" is "120 dias".
    const crossing = withFrames({ figure: "120 days", label: "To complain", text: "Miss this and the complaint is refused" }, 2);
    expect(validateReelFrames(crossing, CORPUS)).toEqual({ ok: true });
  });

  it("refuses copy that repeats its own figure underneath it", () => {
    const result = validateReelFrames(withFrames({ text: "File by 30 June or lose it" }, 1), CORPUS);
    expect(result).toEqual({ ok: false, reason: expect.stringContaining("repeats its figure") });
  });

  it("refuses an acronym a viewer cannot look up mid-scroll", () => {
    const result = validateReelFrames(withFrames({ text: "Register now on the AT portal" }, 3), CORPUS);
    expect(result).toEqual({ ok: false, reason: expect.stringContaining("the tax authority") });
  });

  it("refuses text there is no time to read", () => {
    const long = "File late and you will lose the entire split for both parents this year";
    const result = validateReelFrames(withFrames({ text: long }, 1), CORPUS);
    expect(result).toEqual({ ok: false, reason: expect.stringContaining("there is time for 12") });
  });

  it("insists on hook first and payoff last", () => {
    expect(validateReelFrames([ok[1]!, ok[0]!, ok[3]!], CORPUS)).toEqual({ ok: false, reason: expect.stringContaining("first frame must be the hook") });
    expect(validateReelFrames([ok[0]!, ok[1]!, ok[2]!], CORPUS)).toEqual({ ok: false, reason: expect.stringContaining("last frame must be the payoff") });
  });

  it("refuses a figure that is really a sentence", () => {
    const result = validateReelFrames(withFrames({ figure: "three hundred euros per dependent" }, 2), CORPUS);
    expect(result).toEqual({ ok: false, reason: expect.stringContaining("three words at most") });
  });
});
