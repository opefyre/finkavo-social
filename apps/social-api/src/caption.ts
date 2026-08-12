const SITE = "finkavo.com";

export type CaptionParts = {
  hook: string;
  body: string;
  callToAction: string;
  hashtags: string[];
};

const clean = (value: string) => value.trim().replace(/\n{3,}/g, "\n\n");

export function composeInstagramCaption(parts: CaptionParts): string {
  const sections = [clean(parts.hook), clean(parts.body), clean(parts.callToAction), SITE, parts.hashtags.join(" ")];
  return sections.filter(Boolean).join("\n\n");
}

export function validateCaptionParts(parts: CaptionParts): void {
  const hook = clean(parts.hook);
  const body = clean(parts.body);
  const cta = clean(parts.callToAction);
  if (hook.length < 20 || hook.length > 125) throw new Error("Caption hook must be 20–125 characters");
  if (!/\b(?:Portugal|Portuguese)\b/i.test(`${hook} ${body}`)) throw new Error("Caption must clearly identify its Portugal context");
  if (body.length < 40 || body.length > 1_500) throw new Error("Caption body must be 40–1,500 characters");
  if (cta.length < 8 || cta.length > 65) throw new Error("Caption CTA must be 8–65 characters");
  if (parts.hashtags.length < 4 || parts.hashtags.length > 8) throw new Error("Use four to eight focused hashtags");
  const normalized = parts.hashtags.map((tag) => tag.toLowerCase());
  if (new Set(normalized).size !== normalized.length) throw new Error("Caption hashtags must be unique");
  if (!normalized.includes("#finkavo")) throw new Error("Caption hashtags must include #Finkavo");
  const output = composeInstagramCaption(parts);
  if (!output.includes(SITE)) throw new Error("Caption must include finkavo.com");
  if (output.length > 2_200) throw new Error("Instagram caption exceeds 2,200 characters");
}
