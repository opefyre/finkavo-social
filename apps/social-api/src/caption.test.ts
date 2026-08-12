import { describe, expect, it } from "vitest";
import { composeInstagramCaption, validateCaptionParts } from "./caption.js";

const good = {
  hook: "Portugal tax deadline: prepare these details before you file.",
  body: "A short, source-backed checklist can help you identify missing information before using the official filing portal.",
  callToAction: "Save this checklist and share it with someone filing.",
  hashtags: ["#Finkavo", "#PortugalTaxes", "#PortugalAdmin", "#LivingInPortugal"],
};

describe("Instagram captions", () => {
  it("builds a hook-first caption with CTA, website, and focused hashtags", () => {
    validateCaptionParts(good);
    expect(composeInstagramCaption(good)).toBe(`${good.hook}\n\n${good.body}\n\n${good.callToAction}\n\nfinkavo.com\n\n${good.hashtags.join(" ")}`);
  });
  it("rejects missing brand hashtag and weak hooks", () => {
    expect(() => validateCaptionParts({ ...good, hook: "Read this.", hashtags: good.hashtags.slice(1) })).toThrow();
  });
});
