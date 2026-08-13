import type { Draft } from "./contracts.js";
import { validateCaptionParts } from "./caption.js";

const endsIncomplete = (value: string) => /(?:\b(?:and|or|to|the|a|an|of|in|on|for|with|from|by|as)|[,;:—-])$/i.test(value.trim().replace(/[.!?)]$/, "").trim());
const completeSentence = (value: string) => /[.!?)]$/.test(value.trim()) && !endsIncomplete(value);
const hasPresentationArtifacts = (value: string) => /\bnoneof\b/i.test(value) || /\*\*|^\s*[-*]\s|^[A-Za-z0-9]+,\s*[A-Z]\d+:|\b(?!(?:AIMA|ASAE|AIMI|ACT|BIC|CIVA|CPAS|DGE|DGESTE|EEA|EU|IBAN|IEFP|IMI|IMT|IRN|IRS|IVA|NIB|NIPC|NIF|NISS|PLNM|REPSAE|SEPA|SNS|SPIN|SWIFT)\b)[A-ZÁÉÍÓÚÇ]{4,}\b/.test(value);
const portugueseMarkers = /\b(?:a|ao|aos|as|com|como|da|das|de|declaração|do|dos|e|em|é|isenção|mensal|não|o|os|pagamento|para|passo|pela|pelo|por|prazo|regime|rendimento|sobre|trimestral|uma|valor)\b/giu;

export function assertEnglishUserCopy(values: unknown[]) {
  const text = values.flat(Infinity).map(value => String(value || "")).join(" ").toLocaleLowerCase("pt");
  const markers = text.match(portugueseMarkers)?.length ?? 0;
  const words = text.match(/[a-zà-ÿ]+/giu)?.length ?? 1;
  if (markers >= 6 && markers / words >= 0.08) throw new Error("User-facing copy must be English");
}

export function validateSocialDraft(draft: Draft) {
  assertEnglishUserCopy([draft.topic, draft.hook, draft.caption, draft.callToAction, draft.slides.flatMap(slide => [slide.eyebrow, slide.title, slide.body, slide.items, slide.altText])]);
  validateCaptionParts({ hook: draft.hook, body: draft.caption, callToAction: draft.callToAction, hashtags: draft.hashtags });
  if (draft.slides[0]?.type !== "cover" || draft.slides.at(-1)?.type !== "summary") throw new Error("The carousel must start with a cover and end with a summary");
  if (draft.callToAction.length > 65 || endsIncomplete(draft.callToAction)) throw new Error("The call to action is incomplete or too long");
  if (new Set(draft.searchKeywords.map((item) => item.toLowerCase())).size !== draft.searchKeywords.length) throw new Error("Search phrases must be unique");
  for (const slide of draft.slides) {
    if (["cover","content","summary"].includes(slide.type) && !slide.body.trim()) throw new Error(`${slide.type} slide body must not be empty`);
    if (["cover","content","summary"].includes(slide.type) && !completeSentence(slide.body)) throw new Error(`${slide.type} slide body must end as a complete sentence and not trail off after a connector`);
    if (["cover","content","summary"].includes(slide.type) && hasPresentationArtifacts(slide.body)) throw new Error(`${slide.type} slide body must remove Markdown, list prefixes, corpus labels, or unapproved all-caps words`);
    if (["bullets","steps"].includes(slide.type) && (slide.items.length < 2 || slide.items.some((item) => !completeSentence(item) || hasPresentationArtifacts(item)))) throw new Error(`${slide.type} slide items must be clean, complete sentences`);
    if (/photo|photograph|illustration|crossed[- ]out|person standing|people standing/i.test(slide.altText)) throw new Error("Alt text describes artwork that the deterministic template does not render");
  }
  if (draft.claims.some((claim) => !completeSentence(claim.claim))) throw new Error("Claims must be complete sentences");
  if (draft.claims.some((claim) => claim.evidenceQuote.trim().length < 12)) throw new Error("Evidence excerpts must be substantial exact source text");
}
