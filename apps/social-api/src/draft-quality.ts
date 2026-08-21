import type { Draft } from "./contracts.js";
import { validateCaptionParts } from "./caption.js";

const endsIncomplete = (value: string) => /(?:\b(?:and|or|to|the|a|an|of|in|on|for|with|from|by|as)|[,;:—-])$/i.test(value.trim().replace(/[.!?)]$/, "").trim());
const completeSentence = (value: string) => /[.!?)]$/.test(value.trim()) && !endsIncomplete(value);
const hasPresentationArtifacts = (value: string) => /\bnoneof\b/i.test(value) || /\*\*|^\s*[-*]\s|^[A-Za-z0-9]+,\s*[A-Z]\d+:|\b[A-ZÁÉÍÓÚÇ]{4,}(?:\s+[A-ZÁÉÍÓÚÇ]{4,})+\b/.test(value);
// Exclude tokens such as "a", "as", "com", "regime", and "valor" that are
// common in English copy, URLs, or official Portuguese proper names. The gate
// should detect Portuguese sentences, not punish valid English posts for
// mentioning Portal das Finanças or similar source names.
const portugueseMarkers = /\b(?:ao|aos|como|da|das|de|declaração|do|dos|em|é|isenção|mensal|não|pagamento|para|passo|pela|pelo|por|prazo|rendimento|sobre|trimestral|uma)\b/giu;
const nonLatinSentenceScript = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Cyrillic}\p{Script=Arabic}\p{Script=Hebrew}]/u;
const sourceTrivia = /\b(?:which (?:law|regulation).*(?:page|site)|official page (?:flags|highlights|names|references)|(?:law|regulation) (?:named|mentioned) (?:on|by) the page|keep (?:these )?(?:official )?(?:law|regulation|source) names handy)\b/i;
const sourceCentricCover = /\b(?:what|which|see|find|discover)\b.{0,45}\b(?:guide|page|portal|source)\b.{0,35}\b(?:lists?|mentions?|names?|says?|shows?|recognises?)\b|\b(?:official routes?|options? (?:listed|mentioned)|guide highlights?)\b/i;
const engagementOnly = /^(?:(?:save|share|follow|bookmark)(?: this| us| finkavo| for more| and)?[ .,!]*)+$/i;
// The rule is that the last slide must leave the reader something to do, and that is
// right. Expressing it as nineteen permitted verbs was not: "File by 30 June", "Confirm
// your NIF before signing" and "Ask Financas for the form" are all exactly what the rule
// wants and all three were refused, because file, confirm and ask were not on the list.
// It threw away a third of the drafts on one morning. The list now covers how the action
// is actually phrased. "save" is deliberately absent: it is the one verb that reads as an
// instruction and as engagement bait in equal measure, and allowing it would let a slide
// whose only advice is "save this post" count as a practical next step. "keep" carries
// the honest version of that meaning.
const practicalAction = /\b(?:apply|arrange|ask|avoid|book|bring|calculate|call|check|choose|claim|collect|compare|complete|confirm|contact|count|declare|deduct|download|enrol|ensure|enter|file|fill|find|gather|get|include|keep|log|look|make|mark|monitor|note|obtain|pay|plan|prepare|present|print|provide|read|register|remember|renew|report|request|review|schedule|send|set|show|sign|start|store|submit|take|talk|track|update|upload|use|verify|visit|watch|write)\b/i;
const contextSignals = [
  /\b(?:is|means|refers to|stands for|a type of|the term)\b/i,
  /\b(?:for|if you|people who|residents?|workers?|parents?|students?|businesses?|who can|who needs)\b/i,
  practicalAction,
  /\b(?:because|so that|helps?|allows?|avoid|protect|benefit|matters?|important|result|consequence)\b/i,
  /\b(?:where|when|before|after|online|in person|through|at the)\b/i,
];
const acronymDefinitions:Record<string,RegExp>={
  AIMA:/agency for integration,? migration and asylum/i,AT:/tax authority/i,IRS:/personal income tax/i,IVA:/value[- ]added tax/i,
  NIF:/tax identification number/i,NISS:/social security identification number/i,PLA:/portuguese (?:host|welcoming) language/i,
  PLNM:/portuguese as a non[- ]native language/i,SNS:/national health service/i,
  // IMT is two different things and the property one is far commoner here: the
  // municipal tax on transferring a property. Accepting only the transport institute
  // failed posts that had used the acronym perfectly correctly.
  IMT:/(?:property|municipal) transfer tax|tax on (?:the )?transfer of propert|institute for mobility and transport/i,
  IMI:/municipal property tax/i,IUC:/(?:road|vehicle) tax/i,IBAN:/international bank account number/i,
  NIPC:/(?:corporate|company|legal person) tax identification number/i,
  CIRS:/personal income tax code/i,ACT:/(?:authority for )?working conditions/i,
  OECD:/organisation for economic/i,
};
const stopWords=new Set(["about","after","before","from","guide","official","portugal","post","the","this","what","when","where","which","with","your"]);
const words=(value:string)=>new Set((value.toLocaleLowerCase("en").match(/[a-z]{3,}/g)||[]).filter(word=>!stopWords.has(word)));
const overlap=(a:Set<string>,b:Set<string>)=>[...a].filter(value=>b.has(value)).length;
const similarity=(a:string,b:string)=>{const left=words(a),right=words(b),union=new Set([...left,...right]);return union.size?overlap(left,right)/union.size:0;};

type StandaloneCandidate={topic:string;hook:string;caption:string;slides:Array<{title?:string;body?:string;eyebrow?:string;items?:string[]}>};
export function validateStandaloneValue(draft: StandaloneCandidate) {
  const cover=draft.slides[0];const summary=draft.slides.at(-1);
  if(!cover||overlap(words(draft.topic),words(`${cover.title||""} ${cover.body||""}`))<1)throw new Error("Slide 1 must clearly name the post topic");
  if(sourceCentricCover.test(`${cover.title} ${cover.body} ${draft.hook}`))throw new Error("Slide 1 describes a source instead of a useful standalone topic");
  const publicCopy=[...draft.slides.flatMap(slide=>[slide.eyebrow||"",slide.title||"",slide.body||"",...(slide.items||[])]),draft.hook,draft.caption].join(" ");
  const acronyms=[...new Set(publicCopy.match(/\b[A-Z]{2,6}\b/g)||[])].filter(value=>!["EU","ID","URL"].includes(value));
  for(const acronym of acronyms){const escaped=acronym.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");const defined=(acronymDefinitions[acronym]?.test(publicCopy)??false)||new RegExp(`(?:[A-Za-z][A-Za-z -]{4,}\\(${escaped}\\)|\\b${escaped}\\b\\s*(?:means|is|stands for|—|:)\\s*[A-Za-z])`).test(publicCopy);if(!defined)throw new Error(`${acronym} must be defined for a standalone reader — write it out in full followed by the acronym in brackets, as in "Municipal Property Tax (${acronym})", the first time it appears`);}
  const signals=contextSignals.filter(pattern=>pattern.test(publicCopy)).length;
  if(signals<3)throw new Error("The post lacks enough standalone context, audience, purpose, or practical action");
  const content=draft.slides.slice(1,-1).map(slide=>`${slide.title||""} ${slide.body||""} ${(slide.items||[]).join(" ")}`);
  for(let index=0;index<content.length;index++)for(let other=index+1;other<content.length;other++)if(similarity(content[index],content[other])>.72)throw new Error("Content slides repeat the same information instead of adding value");
  const takeaway=`${summary?.title||""} ${summary?.body||""} ${(summary?.items||[]).join(" ")}`;
  // This was the single biggest reason drafts were thrown away — fourteen in one day,
  // after the permitted-verb list had already been widened from nineteen entries to
  // fifty. Widening it again would not help, because the premise is wrong: a whitelist
  // cannot enumerate English. "Read the notice", "Set a reminder for 30 June" and "Get
  // the form from Finanças" are all exactly what the rule wants, and a final slide
  // reading "30 June — the deadline to file" is a perfectly good takeaway with no
  // imperative in it at all.
  //
  // What the rule is actually protecting against is a last slide that says nothing about
  // this post — "Save this for later", "Follow for more Portugal tips". So test for that
  // instead: the slide must carry something of its own, which can be an action, a figure
  // or date, or a word from the topic that is not boilerplate. Any one will do.
  const takeawayCarriesAction = practicalAction.test(takeaway);
  const takeawayCarriesFigure = /\d/.test(takeaway);
  const takeawayCarriesTopic = overlap(words(draft.topic), words(takeaway)) > 0;
  const takeawaySaysSomething = takeawayCarriesAction || takeawayCarriesFigure || takeawayCarriesTopic;
  if(!takeawaySaysSomething||engagementOnly.test(takeaway.trim()))throw new Error("The final slide needs a topic-specific takeaway or next step before engagement language — name the action, the date or the thing this post is about, not just an invitation to engage");
}

export function assertEnglishUserCopy(values: unknown[]) {
  const text = values.flat(Infinity).map(value => String(value || "")).join(" ").toLocaleLowerCase("pt");
  if (nonLatinSentenceScript.test(text)) throw new Error("User-facing copy must use the English Latin script");
  const markers = text.match(portugueseMarkers)?.length ?? 0;
  const words = text.match(/[a-zà-ÿ]+/giu)?.length ?? 1;
  if (markers >= 6 && markers / words >= 0.08) throw new Error("User-facing copy must be English");
}

export function validateSocialDraft(draft: Draft) {
  assertEnglishUserCopy([draft.topic, draft.hook, draft.caption, draft.callToAction, draft.slides.flatMap(slide => [slide.eyebrow, slide.title, slide.body, slide.items, slide.altText])]);
  validateCaptionParts({ hook: draft.hook, body: draft.caption, callToAction: draft.callToAction, hashtags: draft.hashtags });
  const readerCopy = [draft.topic,draft.hook,draft.caption,draft.callToAction,...draft.slides.flatMap(slide=>[slide.eyebrow,slide.title,slide.body,slide.items])].flat().join(" ");
  if (sourceTrivia.test(readerCopy)) throw new Error("The post is source-page trivia rather than a useful reader outcome");
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
  validateStandaloneValue(draft);
  if (draft.claims.some((claim) => !completeSentence(claim.claim))) throw new Error("Claims must be complete sentences");
  if (draft.claims.some((claim) => claim.evidenceQuote.trim().length < 12)) throw new Error("Evidence excerpts must be substantial exact source text");
}
