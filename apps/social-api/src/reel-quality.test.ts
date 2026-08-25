import { describe, expect, it } from "vitest";
import { validateReelFrames, type ReelFrameDraft } from "./reel-quality.js";

const CORPUS = "O prazo de entrega da declaracao de IRS decorre de 1 de abril a 30 de junho. A deducao e de 300 euros por cada dependente. A reclamacao deve ser apresentada no prazo de 120 dias.";

// Carousel-weight copy, which is the point of the format now: enough on the frame that a
// viewer has to stop it to finish reading.
const ok: ReelFrameDraft[] = [
  { type: "hook", text: "Separated parents in Portugal both claim the child, and most of them get the split wrong" },
  { type: "beat", figure: "30 June", label: "Filing closes", text: "Both parents have to file inside the window for the deduction to be shared between them. If one files late, the split collapses and the whole benefit lands in a single household instead of two." },
  { type: "beat", figure: "300 euros", label: "Per dependent", text: "This is the amount each dependent is worth before the split is applied, and it is the figure the tax authority uses when it works out what each parent is owed for the year." },
  { type: "payoff", text: "Check the household details on the tax authority portal before the window closes, because the split follows what is registered there rather than what you agreed between yourselves." },
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
    const crossing = withFrames({ figure: "120 days", label: "To complain", text: "Miss this window and the complaint is refused outright, whatever its merits, because the deadline is counted from the date the decision was served rather than from the day you read it." }, 2);
    expect(validateReelFrames(crossing, CORPUS)).toEqual({ ok: true });
  });

  it("lets a sentence name its own figure", () => {
    // At six words, repeating the figure underneath wasted the only other line. In a
    // sentence it is the sentence.
    const result = validateReelFrames(withFrames({ text: "File by 30 June or the split is lost for the whole year, and the deduction goes to one household instead of being shared between both parents." }, 1), CORPUS);
    expect(result).toEqual({ ok: true });
  });


  it("refuses an acronym a viewer cannot look up mid-scroll", () => {
    const result = validateReelFrames(withFrames({ text: "Register the household on the AT portal before the window closes, because the split follows what is recorded there." }, 3), CORPUS);
    expect(result).toEqual({ ok: false, reason: expect.stringContaining("the tax authority") });
  });

  it("refuses more text than the frame can typeset", () => {
    // The ceiling is now what fits legibly at 1080x1920, not what can be read at speed —
    // a viewer is meant to have to stop — but a frame that overflows its layout helps
    // nobody.
    const long = Array.from({ length: 60 }, () => "word").join(" ");
    const result = validateReelFrames(withFrames({ text: long }, 1), CORPUS);
    expect(result).toEqual({ ok: false, reason: expect.stringContaining("can typeset 42") });
  });

  it("refuses a frame too sparse to be worth pausing on", () => {
    // The failure this format actually had: a model given room still handing back four
    // words, so the reel carried a quarter of what its carousel carried.
    const result = validateReelFrames(withFrames({ text: "File on time" }, 1), CORPUS);
    expect(result).toEqual({ ok: false, reason: expect.stringContaining("at least 22") });
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
