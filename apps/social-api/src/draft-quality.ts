import type { Draft } from "./contracts.js";

const endsIncomplete = (value: string) => /(?:\b(?:and|or|to|the|a|an|of|in|on|for|with|from|by|as)|[,;:—-])$/i.test(value.trim());
const completeSentence = (value: string) => /[.!?)]$/.test(value.trim()) && !endsIncomplete(value);
const hasPresentationArtifacts = (value: string) => /\*\*|^\s*[-*]\s|^[A-Za-z0-9]+,\s*[A-Z]\d+:|\b(?!(?:AIMA|IRS|IVA|NISS|IMI|AIMI|EU)\b)[A-ZÁÉÍÓÚÇ]{4,}\b/.test(value);

export function validateSocialDraft(draft: Draft) {
  if (draft.slides[0]?.type !== "cover" || draft.slides.at(-1)?.type !== "summary") throw new Error("The carousel must start with a cover and end with a summary");
  if (draft.callToAction.length > 65 || endsIncomplete(draft.callToAction)) throw new Error("The call to action is incomplete or too long");
  if (draft.hashtags.length < 4) throw new Error("Use four to eight focused hashtags");
  if (new Set(draft.searchKeywords.map((item) => item.toLowerCase())).size !== draft.searchKeywords.length) throw new Error("Search phrases must be unique");
  for (const slide of draft.slides) {
    if (["cover","content","summary"].includes(slide.type) && (!slide.body.trim() || !completeSentence(slide.body) || hasPresentationArtifacts(slide.body))) throw new Error(`${slide.type} slide body must be a clean, complete sentence`);
    if (["bullets","steps"].includes(slide.type) && (slide.items.length < 2 || slide.items.some((item) => !completeSentence(item) || hasPresentationArtifacts(item)))) throw new Error(`${slide.type} slide items must be clean, complete sentences`);
    if (/photo|photograph|illustration|crossed[- ]out|person standing|people standing/i.test(slide.altText)) throw new Error("Alt text describes artwork that the deterministic template does not render");
  }
  if (draft.claims.some((claim) => !completeSentence(claim.claim) || !completeSentence(claim.evidenceQuote))) throw new Error("Claims and evidence excerpts must be complete sentences");
}
