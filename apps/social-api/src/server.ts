import http from "node:http";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import postgres from "postgres";
import { z } from "zod";
import { DraftSchema } from "./contracts.js";
import { generateDraft } from "./openai.js";
import { LlmRateLimitError, llmDailyBudget, setLlmSpendObserver, hydrateLlmSpend, setMonthlyPaidUsage} from "./llm.js";
import { createBufferMediaUrl, createUploadUrl, uploadRenderedObject, verifyUploadedObject, type RenderFileInput } from "./storage.js";
import { BufferError, createScheduledPost, deletePost as deleteBufferPost, findMatchingScheduledPost, getPost as getBufferPost, setBufferCallObserver } from "./buffer.js";
import { notifyDiscord } from "./discord.js";
import { renderReviewPreview } from "./preview.js";
import { retryDecision } from "./retry-policy.js";
import { classifyGenerationFailure, countsAsAttempt, shouldRetireConcept, MAX_GENERATION_ATTEMPTS } from "./block-reason.js";
import { RENDER_LIMITS, renderLimitFailures, renderLimitBriefing } from "./render-limits.js";
import { runSelfTest } from "./selftest.js";
import { expandCalendar, loadEditorialCalendar, selectDailyMix } from "./planner.js";
import { assertEnglishUserCopy, validateSocialDraft } from "./draft-quality.js";
import { composeInstagramCaption } from "./caption.js";
import { loadAnnualPlan, rowsForDate, invalidatePlanCache } from "./annual-plan.js";
import { findFactCard } from "./fact-cards.js";
import { anchorQuote } from "./evidence-anchor.js";
import { validateReelFrames } from "./reel-quality.js";
import { choosePostFormat } from "./post-format.js";
import { buildReelManifest } from "./reel-manifest.js";
import { authenticatedReviewer } from "./access-auth.js";
import { findDuplicate, type DuplicateCandidate } from "./duplicate.js";
import { editorialIdentity } from "./editorial-identity.js";
import { eligibleReserveCards, loadEvergreenReserve } from "./evergreen-reserve.js";
import { collectDiscoveries, collectOfficialPages, fetchPage, visibleText, pageTitle, chunkText, officialLinksIn, OFFICIAL_ANNOUNCEMENT_PAGES, announcementLinks } from "./collectors.js";
import { sourceSupportsNewsTopic } from "./news-evidence.js";
import { editorialScore } from "./editorial-score.js";
import { boardPage } from "./board.js";
import { selectVisualStyle } from "./visual-style.js";
import { assessEvidenceReliability, isSensitiveClaim } from "./evidence-reliability.js";

const databaseUrl = process.env.DATABASE_URL;
const apiToken = process.env.SOCIAL_API_TOKEN;
if (!databaseUrl || !apiToken) throw new Error("DATABASE_URL and SOCIAL_API_TOKEN are required");
const sql = postgres(databaseUrl, { max: 5, idle_timeout: 20, connect_timeout: 15 });
const port = Number(process.env.SOCIAL_API_PORT || 4320);
const reviewBaseUrl = process.env.REVIEW_BASE_URL;
const reviewPathPrefix = (process.env.REVIEW_PATH_PREFIX || "").replace(/\/$/, "");
// When a finished post is actually handed to Buffer. This is a different list from the
// editorial plan's slots and it is the one that decides the times you see in the app, so
// cutting the plan to two posts a day without moving this left posts still being spread
// across five old times. Same hours as the plan now: late morning and early evening.
const dailyPublishSlots: ReadonlyArray<readonly [number, number]> = (process.env.PUBLISH_SLOTS || "11:00,18:00")
  .split(",").map(entry => entry.trim()).filter(Boolean)
  .map(entry => {
    const [hour, minute] = entry.split(":");
    return [Number(hour), Number(minute ?? 0)] as const;
  })
  .filter(([hour, minute]) => Number.isFinite(hour) && Number.isFinite(minute));
const bufferHandoffHours = Math.min(48, Math.max(1, Number(process.env.BUFFER_HANDOFF_HOURS || 24)));
// Where the yes comes from. "internal" is the board and the Discord approval link;
// "buffer_draft" sends the post to Buffer as a draft on its slot and lets the owner
// approve it in the Buffer app by moving it to the queue. The automated gates run either
// way — they are what decides whether a post is fit to exist, and that judgement does not
// move just because the human one does.
const reviewMode = process.env.REVIEW_MODE === "buffer_draft" ? "buffer_draft" : "internal";

// How many fixed posts a day the pipeline is trying to land. News items are extra and
// arrive whenever they break, so a day can exceed this; it is the floor the recovery
// loop works towards, not a ceiling on the feed.
const postsPerDay = Math.min(5, Math.max(1, Number(process.env.POSTS_PER_DAY || 2)));
const bufferQueueSoftLimit = Math.min(9, Math.max(1, Number(process.env.BUFFER_QUEUE_SOFT_LIMIT || 8)));
const publishAvailableAt = (scheduledAt: Date, now = new Date()) => new Date(Math.max(now.getTime(), scheduledAt.getTime() - bufferHandoffHours * 60 * 60_000));
const recoveryDaysInProgress = new Set<string>();

const hash = (value: unknown) => createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex");
const boardActionToken = (postId: string, revisionId: string | null, reviewer: string, expiresAt = Date.now() + 15 * 60_000) => {
  const payload = Buffer.from(JSON.stringify({ postId, revisionId, reviewer, expiresAt })).toString("base64url");
  const signature = createHmac("sha256", apiToken).update(payload).digest("base64url");
  return `${payload}.${signature}`;
};
const verifyBoardActionToken = (token: string, postId: string, revisionId: string | null, reviewer: string) => {
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;
  const expected = createHmac("sha256", apiToken).update(payload).digest();
  const received = Buffer.from(signature, "base64url");
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return false;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { postId?: string; revisionId?: string | null; reviewer?: string; expiresAt?: number };
    return value.postId === postId && value.revisionId === revisionId && value.reviewer === reviewer && Number(value.expiresAt) > Date.now();
  } catch { return false; }
};
const lisbonDate = (date: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
const lisbonSlotUtc = (day: string, hour: number, minute: number) => {
  const [year, month, date] = day.split("-").map(Number);
  const desired = Date.UTC(year, month - 1, date, hour, minute);
  let guess = desired;
  for (let index = 0; index < 2; index++) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(guess)).filter(part => part.type !== "literal").map(part => [part.type, Number(part.value)]));
    const represented = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
    guess += desired - represented;
  }
  return new Date(guess);
};
const addLisbonDays = (day: string, days: number) => {
  const [year, month, date] = day.split("-").map(Number);
  return lisbonDate(new Date(Date.UTC(year, month - 1, date + days, 12)));
};
const recentActivePosts = async (excludeId?: string) => sql`
  SELECT p.id,p.topic,p.category,p.audience,p.post_intent,p.subject_family,p.user_question,p.content_intent,p.occurrence_key,r.content_hash
  FROM social_post p LEFT JOIN social_post_revision r ON r.id=p.current_revision_id
  WHERE p.status NOT IN ('blocked','rejected','failed')
    AND p.created_at > now() - INTERVAL '365 days'
    ${excludeId ? sql`AND p.id <> ${excludeId}` : sql``}
  ORDER BY p.created_at DESC
`;
const findRecentDuplicate = async (candidate: DuplicateCandidate, excludeId?: string) =>
  findDuplicate(candidate, await recentActivePosts(excludeId) as DuplicateCandidate[]);
const fit = (value: unknown, max: number) => {
  const text = String(value || "").trim();
  if (text.length > max) throw new Error(`Approved render text exceeds its ${max}-character contract`);
  return text;
};
const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
const classifyTopic = (value: unknown) => {
  const text = String(value || "").toLocaleLowerCase("pt");
  if (/aima|resid.n|visto|visa|migr|estrangeir/.test(text)) return "immigration";
  if (/\birs\b|rendimento|modelo 3/.test(text)) return "irs";
  if (/iva|fiscal|imposto|tribut/.test(text)) return "tax";
  if (/seguran.a social|contribut|niss|trabalhador independente/.test(text)) return "social_security";
  if (/casa|im.vel|imi|arrendamento|habita/.test(text)) return "housing";
  if (/emprego|contrato de trabalho|sal.rio/.test(text)) return "employment";
  if (/nif|finan.as/.test(text)) return "nif";
  return "general";
};
// The discovery feeds are Portuguese -- RTP and Google News on pt-PT -- but this filter
// only ever matched English words, so a headline reading "reforma da Seguranca Social"
// or "Pensoes em risco" scored nothing and was dropped before anyone looked at it. Of a
// hundred items collected in a day, five got as far as being examined.
//
// Relevance now needs two things: the story has to name an institution or instrument
// that actually administers something, and it has to be about a change a reader could
// act on. Political debate about a reform is not an administrative change, and this is
// what keeps "CIP wants to debate Social Security reform" out of the queue.
const NEWS_INSTITUTIONS = /\b(?:aima|sef|autoridade tribut[áa]ria|financ[ae]s|seguran[çc]a social|seg-social|sns|servi[çc]o nacional de sa[úu]de|irn|conservat[óo]ria|imt|act|iefp|ihru|ersar?|erse|anacom|banco de portugal|di[áa]rio da rep[úu]blica|governo|minist[ée]rio|parlamento|assembleia da rep[úu]blica|c[âa]mara municipal|junta de freguesia|tax authority|social security|immigration)\b/i;
const NEWS_SUBJECTS = /\b(?:irs|iva|imi|aimi|iuc|imt|isv|nif|niss|seguran[çc]a social|visto|vistos|autoriza[çc][ãa]o de resid[êe]ncia|resid[êe]ncia|nacionalidade|cidadania|imigra[çc][ãa]o|reagrupamento|abono|pens[ãa]o|pens[õo]es|subs[íi]dio|presta[çc][ãa]o|licen[çc]a|arrendamento|renda|habita[çc][ãa]o|contrato de trabalho|despedimento|desemprego|sal[áa]rio m[íi]nimo|escalon?[õo]?es|dedu[çc][ãa]o|imposto|impostos|taxa|taxas|coima|prazo|prazos|declara[çc][ãa]o|reembolso|apoio|tax|pension|benefit|deadline|residence permit|citizenship|bilhete de identidade|cart[ãa]o de cidad[ãa]o|cart[ãa]o de resid[êe]ncia|certificado de resid[êe]ncia|pensionista|pensionistas|prova de vida|bonifica[çc][ãa]o|complemento|reagrupamento familiar|carteira digital|situa[çc][ãa]o fiscal|fatura|e-fatura|recibo|iban|d[ée]bito direto|seguran[çc]a social direta|portal das finan[çc]as|chave m[óo]vel digital|id card|direct debit)\b/i;
const NEWS_CHANGE = /\b(?:novo|nova|novos|novas|altera|altera[çc][ãa]o|altera[çc][õo]es|muda|mudan[çc]a|entra em vigor|aprovad[oa]|publicad[oa]|aumenta|aumento|sobe|desce|reduz|redu[çc][ãa]o|atualiza|atualiza[çc][ãa]o|passa a|deixa de|fim d[oae]|acaba|prazo|prorroga|adia|suspende|obrigat[óo]ri[oa]|regras|decreto|portaria|lei n|orçamento do estado|changes?|new rules?|deadline|comes into force|approved|autom[áa]tic[oa]|automaticamente|j[áa] pode|j[áa] est[áa]|passa a estar|dispon[íi]vel|renova[çc][ãa]o|renovar|online|digital|na app|self[- ]service|automatic(?:ally)?|now available)\b/i;

// A scam impersonating a public institution is the single most actionable thing a
// personal-finance account can post, and it never contains a change verb. "Mensagens
// fraudulentas enviadas em nome da Segurança Social" was dropped for that reason alone.
const NEWS_ALERT = /\b(?:alerta|fraudulent[ao]s?|fraude|burla|burl[õo]es|phishing|smishing|esquema|falso|falsa|scam|fake|impersonat)\b/i;

// Discovery sometimes hands over a headline that is a date, a bare number or the literal
// string "default" — the page had no usable title. Those became concepts, were judged for
// relevance and were retired as if a decision had been made about them. They are simply
// unusable, and saying so keeps the relevance statistics honest.
const usableHeadline = (text: string) => {
  const letters = text.replace(/[^\p{L}]/gu, "");
  if (letters.length < 12) return false;
  if (/^\s*default\s*$/i.test(text)) return false;
  return text.trim().split(/\s+/).length >= 3;
};

const newsRelevant = (title: unknown, category: unknown) => {
  const text = String(title || "");
  if (!usableHeadline(text)) return false;
  if (String(category || "general") !== "general") return true;
  const named = NEWS_INSTITUTIONS.test(text) || NEWS_SUBJECTS.test(text);
  if (!named) return false;
  return NEWS_CHANGE.test(text) || NEWS_ALERT.test(text);
};
const officialDomains = ["aima.gov.pt", "diariodarepublica.pt", "dre.pt", "gov.pt", "portaldasfinancas.gov.pt", "seg-social.pt", "irn.justica.gov.pt", "bportugal.pt", "sns24.gov.pt", "ine.pt", "dgeste.mec.pt", "act.gov.pt"];
const isOfficialUrl = (value:string) => { try { const hostname=new URL(value).hostname.replace(/^www\./,""); return officialDomains.some(domain=>hostname===domain||hostname.endsWith(`.${domain}`)); } catch { return false; } };
const exactTermMatch = (text: string, term: string) => {
  const escaped=term.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  return new RegExp(`(^|[^a-zà-ÿ0-9])${escaped}([^a-zà-ÿ0-9]|$)`,"iu").test(text);
};
const sourceDomainAllowed = (terms: string[], rawUrl: unknown) => {
  const hostname=new URL(String(rawUrl)).hostname.replace(/^www\./,""); const joined=terms.join(" ");
  const allows=(domains:string[])=>domains.some(domain=>domain==="gov.pt"?(hostname==="gov.pt"||hostname==="www2.gov.pt"):(hostname===domain||hostname.endsWith(`.${domain}`)));
  if (/\b(?:nif|modelo 3|irs|iva|iuc|imi|aimi|imt)\b/i.test(joined)) return allows(["portaldasfinancas.gov.pt","gov.pt"]);
  if (/\b(?:aima|autorização de residência)\b/i.test(joined)) return allows(["aima.gov.pt","gov.pt"]);
  if (/\b(?:registo de saúde|processo clínico|sns)\b/i.test(joined)) return allows(["sns.gov.pt","sns24.gov.pt","gov.pt"]);
  return true;
};
const sourceScopeAllowed = (plannedTopic: unknown, sourceTitle: unknown) => {
  const topic=String(plannedTopic).toLocaleLowerCase("en"); const title=String(sourceTitle).toLocaleLowerCase("en");
  const scoped=[
    {pattern:/\b(?:ari|golden visa|investimento)\b/i,topic:/\b(?:ari|golden visa|invest)\b/i},
    {pattern:/\b(?:refugiado|refugee|asilo|asylum|proteção internacional)\b/i,topic:/\b(?:refugee|asylum|international protection)\b/i},
    {pattern:/\b(?:reagrupamento|family reunification)\b/i,topic:/\b(?:family reunification|reagrupamento)\b/i},
    {pattern:/\b(?:irs jovem|young taxpayer)\b/i,topic:/\b(?:irs jovem|young taxpayer)\b/i},
  ];
  return scoped.every(rule=>!rule.pattern.test(title)||rule.topic.test(topic));
};
const topicMatchesPlan = (draftTopic: string, plannedTopic: string) => {
  const stop=new Set(["about","after","before","checklist","explanation","fallback","golden","international","news","plain","practical","preparation","reserve","residents","step","what","with","your"]);
  const tokens=(value:string)=>value.toLocaleLowerCase("en").replace(/[^a-zà-ÿ0-9 ]/g," ").split(/\s+/).filter(token=>token.length>=4&&!stop.has(token));
  const planned=new Set(tokens(plannedTopic)); return tokens(draftTopic).some(token=>planned.has(token));
};
const finishSentence = (value:string) => value.trim() && !/[.!?)]$/.test(value.trim()) ? `${value.trim()}.` : value.trim();

// An over-long evidence quote is the model being generous, not wrong, and it was the
// single largest mechanical cause of lost drafts — 43 failures in a fortnight, six of them
// retiring the concept outright. Every one died before DraftSchema.parse returned, so the
// repair pass never saw it and the tokens were spent for nothing.
//
// Trimming is safe here in a way it would not be for prose: the quote's whole job is to be
// findable verbatim in the source, and *any contiguous slice of a verbatim string is still
// verbatim*. So a shorter quote still anchors. The window is taken from the first digit
// where there is one — the figure is the part a reader is being asked to trust, and a
// prefix that stops short of it would anchor fine while proving nothing.
const trimQuoteKeepingItVerbatim = (quote:string, limit:number) => {
  const value = quote.trim();
  if (value.length <= limit) return value;
  const firstDigit = value.search(/\d/);
  // Start far enough back that the figure and its lead-in survive, but never mid-word.
  let from = firstDigit < 0 ? 0 : Math.max(0, Math.min(firstDigit - 120, value.length - limit));
  if (from > 0) { const space = value.indexOf(" ", from); from = space < 0 ? 0 : space + 1; }
  const slice = value.slice(from, from + limit);
  const lastSpace = slice.lastIndexOf(" ");
  return (slice.length < limit || lastSpace < limit * 0.6 ? slice : slice.slice(0, lastSpace)).trim();
};

// Mechanical defects are typos, not editorial failures. Repaired in place before the schema
// is applied, so a draft that is sound in substance is not thrown away — and does not spend
// another paid call — over a quote that ran long or a hashtag written twice.
const repairMechanicalDefects = (draft:unknown) => {
  if (!draft || typeof draft !== "object") return draft;
  const value = draft as Record<string, unknown>;
  if (Array.isArray(value.claims)) {
    value.claims = value.claims.map(entry => {
      if (!entry || typeof entry !== "object") return entry;
      const claim = entry as Record<string, unknown>;
      if (typeof claim.evidenceQuote === "string") claim.evidenceQuote = trimQuoteKeepingItVerbatim(claim.evidenceQuote, 500);
      if (typeof claim.claim === "string" && claim.claim.length > 300) claim.claim = finishSentence(claim.claim.slice(0, 300).replace(/\s+\S*$/, ""));
      return claim;
    });
  }
  // A repeated hashtag is a typo that was costing whole drafts. Keep the first of each and
  // the order the model chose; the caption rule still speaks up if too few survive.
  if (Array.isArray(value.hashtags)) {
    const seen = new Set<string>();
    value.hashtags = (value.hashtags as unknown[]).filter(tag => {
      if (typeof tag !== "string") return false;
      const key = tag.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 8);
  }
  if (Array.isArray(value.searchKeywords)) {
    const seen = new Set<string>();
    value.searchKeywords = (value.searchKeywords as unknown[])
      .filter(term => typeof term === "string" && term.trim().length >= 2)
      .map(term => (term as string).trim().slice(0, 60))
      .filter(term => { const key = term.toLowerCase(); if (seen.has(key)) return false; seen.add(key); return true; })
      .slice(0, 6);
  }
  return value;
};
const ensureKnownAcronymsAreDefined = <T extends z.infer<typeof DraftSchema>>(candidate:T) => {
  const definitions:Record<string,{test:RegExp;sentence:string}>={
    AIMA:{test:/agency for integration,? migration and asylum/i,sentence:"AIMA is Portugal’s Agency for Integration, Migration and Asylum."},
    AT:{test:/tax authority/i,sentence:"AT is Portugal’s Tax Authority."},
    IMT:{test:/institute for mobility and transport/i,sentence:"IMT is Portugal’s Institute for Mobility and Transport."},
    IRS:{test:/personal income tax/i,sentence:"IRS is Portugal’s personal income tax."},
    IVA:{test:/value[- ]added tax/i,sentence:"IVA is Portugal’s value-added tax."},
    NIF:{test:/tax identification number/i,sentence:"NIF means tax identification number in Portugal."},
    NISS:{test:/social security identification number/i,sentence:"NISS means Social Security identification number in Portugal."},
    PLNM:{test:/portuguese as a non[- ]native language/i,sentence:"PLNM means Portuguese as a non-native language."},
    SNS:{test:/national health service/i,sentence:"SNS is Portugal’s National Health Service."},
    // Every term below cost a finished draft before it was listed here. The rule that
    // an acronym must be explained is right — a reader meeting "EBF" has been told
    // nothing — but rejecting the post was the wrong remedy when the expansion is a
    // fixed fact we can supply. Defining it makes the post better; discarding it made
    // the day shorter.
    CIRS:{test:/personal income tax code/i,sentence:"CIRS is Portugal’s personal income tax code."},
    EBF:{test:/tax benefits statute/i,sentence:"EBF is Portugal’s tax benefits statute."},
    EEA:{test:/european economic area/i,sentence:"EEA means the European Economic Area."},
    IMI:{test:/municipal property tax/i,sentence:"IMI is Portugal’s municipal property tax."},
    IMT2:{test:/property transfer tax/i,sentence:"IMT is Portugal’s property transfer tax."},
    IRC:{test:/corporate income tax/i,sentence:"IRC is Portugal’s corporate income tax."},
    IUC:{test:/vehicle circulation tax/i,sentence:"IUC is Portugal’s vehicle circulation tax."},
    NHR:{test:/non[- ]habitual resident/i,sentence:"NHR means the non-habitual resident tax regime."},
    RNH:{test:/non[- ]habitual resident/i,sentence:"RNH is the Portuguese name for the non-habitual resident regime."},
    CPPT:{test:/code of procedure and tax process/i,sentence:"CPPT is Portugal’s code of tax procedure."},
    VAT:{test:/value[- ]added tax/i,sentence:"VAT means value-added tax, called IVA in Portugal."},
    SEF:{test:/former immigration service/i,sentence:"SEF was Portugal’s former immigration service, replaced by AIMA."},
    IFICI:{test:/tax incentive for scientific research and innovation/i,sentence:"IFICI is Portugal’s tax incentive for scientific research and innovation, the regime that replaced NHR."},
    AIMI:{test:/additional municipal property tax/i,sentence:"AIMI is Portugal’s additional municipal property tax on higher-value holdings."},
    RFAI:{test:/investment support tax regime/i,sentence:"RFAI is Portugal’s investment support tax regime."},
    DGERT:{test:/employment and labour relations authority/i,sentence:"DGERT is Portugal’s employment and labour relations authority."},
    CPLP:{test:/community of portuguese[- ]language countries/i,sentence:"CPLP is the Community of Portuguese-Language Countries."},
    IMT3:{test:/institute for mobility and transport/i,sentence:"IMT is Portugal’s Institute for Mobility and Transport."},
    ISS:{test:/social security institute/i,sentence:"ISS is Portugal’s Social Security Institute."},
    IRN:{test:/registries and notaries/i,sentence:"IRN is Portugal’s institute for registries and notaries."},
    ACT:{test:/working conditions authority/i,sentence:"ACT is Portugal’s working conditions authority."},
    SNS24:{test:/health advice line/i,sentence:"SNS24 is Portugal’s health advice line."},
    ADSE:{test:/public employees.? health scheme/i,sentence:"ADSE is the health scheme for Portuguese public employees."},
  };
  let publicCopy=[candidate.hook,candidate.caption,...candidate.slides.flatMap(slide=>[slide.title,slide.body,...slide.items])].join(" ");
  const missing:string[]=[];
  for(const [key,definition] of Object.entries(definitions)){
    const acronym=key.replace(/\d+$/,"");
    if(new RegExp(`\\b${acronym}\\b`).test(publicCopy)&&!definition.test.test(publicCopy)){missing.push(definition.sentence);publicCopy+=` ${definition.sentence}`;}
  }
  if(missing.length)candidate.caption=`${missing.join(" ")}\n\n${candidate.caption}`;
  return candidate;
};
const assertPublishableCopy = (post: Record<string, unknown>) => {
  const slides = (post.slides || []) as Array<Record<string, unknown>>;
  assertEnglishUserCopy([post.topic, post.hook, post.caption, post.call_to_action, slides.flatMap(slide => [slide.eyebrow, slide.title, slide.body, slide.items, slide.altText])]);
  for (const slide of slides) {
    const values = [slide.title, slide.body, ...((slide.items || []) as unknown[])].map(value => String(value || "").trim()).filter(Boolean);
    if (values.some(value => /(?:\(\.|\b(?:and|or|to|the|a|an|of|in|on|for|with|from|by|as)|[,;:—-])$/i.test(value))) throw new Error("Stored slide copy appears truncated");
  }
};
const simpleDraft = (topic:string, facts:string[]): z.infer<typeof DraftSchema> => {
  const subject=/\b(NIF|NISS|IUC|IMI|IBAN|SNS 24|Chave Móvel Digital|Livro de Reclamações)\b/i.exec(topic)?.[1]||"Portugal admin";
  const category=subject.toUpperCase()==="NIF"?"nif":subject.toUpperCase()==="NISS"?"niss":["IUC","IMI"].includes(subject.toUpperCase())?"tax":"general";
  const hook=`Portugal basics: understand ${subject} and what you should do next.`;
  const content=facts.slice(0,5).map(finishSentence);
  return DraftSchema.parse({topic,category,riskLevel:"medium",postIntent:"evergreen_explainer",hook,caption:content.slice(0,4).join("\n\n"),callToAction:"Save this Portugal guide for later.",hashtags:["#Finkavo","#Portugal","#PortugalAdmin",`#${subject.replace(/[^A-Za-z0-9]/g,"")}`],searchKeywords:[`${subject} Portugal`,`${subject} explained`],slides:[
    {type:"cover",icon:"document",eyebrow:"Portugal basics",title:`What is ${subject}?`,body:`A plain-English guide to ${subject} in Portugal.`,items:[],highlight:"",sourceLabel:"",altText:`Cover explaining ${subject} in Portugal.`},
    {type:"content",icon:"document",eyebrow:"Definition",title:`${subject}, explained`,body:content[0],items:[],highlight:"",sourceLabel:"",altText:`Definition of ${subject}.`},
    {type:"content",icon:"people",eyebrow:"Why it matters",title:"Where it is used",body:content[1]||content[0],items:[],highlight:"",sourceLabel:"",altText:`Common uses of ${subject}.`},
    {type:"content",icon:"warning",eyebrow:"Good to know",title:"Avoid this mistake",body:content[2]||content[0],items:[],highlight:"",sourceLabel:"",altText:`Important practical note about ${subject}.`},
    {type:"summary",icon:"check",eyebrow:"Quick recap",title:`Remember ${subject}`,body:content[4]||content[3]||content[0],items:[],highlight:"",sourceLabel:"",altText:`Summary of the ${subject} guide.`},
  ],claims:content.map(fact=>({claim:fact,evidenceQuote:fact}))});
};

const send = (res: http.ServerResponse, status: number, body: unknown) => {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(body));
};

async function internalApi(method: "GET" | "POST", pathname: string, body?: unknown) {
  const response = await fetch(`http://127.0.0.1:${port}${pathname}`, {
    method,
    headers: { authorization: `Bearer ${apiToken}`, "content-type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(360_000),
  });
  const result = await response.json() as Record<string, unknown>;
  return { ok: response.ok, status: response.status, result };
}

// --- provider cooldown -------------------------------------------------------------
// Buffer's rate limit was previously handled only on the failing job, so the next tick
// two minutes later called Buffer again regardless. Respecting the limit means not
// calling at all until the window resets, which this gate enforces for every
// Buffer-touching endpoint and across API restarts.
const BUFFER_PROVIDER = "buffer";

// Buffer allows 250 calls per rolling day. Five posts need roughly thirty, so the budget
// is generous — but only if nothing polls blindly. Monitoring is capped well below the
// ceiling so that publishing, which is the part that cannot be deferred, always has
// headroom left even on a bad day.
const BUFFER_DAILY_QUOTA = Number(process.env.BUFFER_DAILY_QUOTA ?? 250);
const BUFFER_MONITOR_BUDGET = Number(process.env.BUFFER_MONITOR_BUDGET ?? 120);
const BUFFER_MONITOR_MAX_PER_RUN = 3;
const BUFFER_MONITOR_RECHECK_MINUTES = 10;

async function bufferCallsLastDay(): Promise<number> {
  const [row] = await sql`SELECT count(*) AS count FROM social_provider_call WHERE provider=${BUFFER_PROVIDER} AND created_at > now() - INTERVAL '24 hours'`;
  return Number(row?.count ?? 0);
}

async function providerCooldownUntil(provider = BUFFER_PROVIDER): Promise<Date | null> {
  const [row] = await sql`SELECT until FROM social_provider_cooldown WHERE provider=${provider} AND until>now()`;
  return row ? new Date(String(row.until)) : null;
}

async function startProviderCooldown(minutes: number, reason: string, provider = BUFFER_PROVIDER) {
  // Never shorten an existing cooldown: a later, longer retry-after wins.
  const safeMinutes = Math.max(1, Math.ceil(minutes || 60));
  await sql`
    INSERT INTO social_provider_cooldown (provider, until, reason, updated_at)
    VALUES (${provider}, now() + (${safeMinutes}::STRING || ' minutes')::INTERVAL, ${reason}, now())
    ON CONFLICT (provider) DO UPDATE SET
      until = GREATEST(social_provider_cooldown.until, excluded.until),
      reason = excluded.reason,
      updated_at = now()
  `;
  await sql`INSERT INTO social_event (event_type, payload) VALUES ('provider.cooldown_started', ${sql.json({ provider, minutes: safeMinutes, reason })})`;
}

/** Records a cooldown when the failure is a provider-side pacing signal. */
async function noteProviderPacing(failure: BufferError) {
  if (failure.code === "RATE_LIMIT_EXCEEDED" || failure.code === "BUFFER_QUEUE_FULL") {
    await startProviderCooldown(failure.retryAfterMinutes || 60, failure.code);
  }
}

// Every Buffer call is recorded so the daily budget is measured rather than assumed, and
// the provider's own remaining-quota header is trusted over our count when it is lower.
// The token budget and the paid caps are only ceilings if they survive a restart, so
// spend goes to the ledger as it happens and comes back at startup. Fire-and-forget on
// the way out: a request must not fail because its bookkeeping did.
// The month's paid spend, refreshed from the ledger. A daily cap alone cannot bound a
// bill; this is the number that decides whether the worst case is five pounds or fifty.
const refreshMonthlyPaid = async () => {
  try {
    const [row] = await sql`
      SELECT count(*) FILTER (WHERE tokens > 0) AS calls, coalesce(sum(tokens), 0) AS tokens
      FROM social_llm_spend
      WHERE paid = true AND created_at >= date_trunc('month', now())`;
    setMonthlyPaidUsage({ calls: Number(row?.calls ?? 0), tokens: Number(row?.tokens ?? 0) });
  } catch {
    // Leave the last known figure in place: a ledger we cannot read is not a licence to spend.
  }
};
void refreshMonthlyPaid();
setInterval(() => { void refreshMonthlyPaid(); }, 5 * 60_000).unref();

setLlmSpendObserver(({ at, tokens, paid, provider }) => {
  void sql`INSERT INTO social_llm_spend (paid, provider, tokens, created_at) VALUES (${paid}, ${provider ?? null}, ${Math.round(tokens)}, ${new Date(at).toISOString()})`.catch(() => {});
});

void (async () => {
  try {
    const rows = await sql`SELECT paid, provider, tokens, created_at FROM social_llm_spend WHERE created_at > now() - INTERVAL '24 hours' ORDER BY created_at`;
    hydrateLlmSpend(rows.map(row => ({ at: new Date(String(row.created_at)).getTime(), tokens: Number(row.tokens), paid: Boolean(row.paid), provider: row.provider ? String(row.provider) : undefined })));
  } catch {
    // A budget that cannot be read is not a reason to refuse to start; the in-memory
    // window still applies and the next restart will try again.
  }
})();

setBufferCallObserver(({ kind, status, quota }) => {
  void sql`INSERT INTO social_provider_call (provider, kind) VALUES (${BUFFER_PROVIDER}, ${kind})`.catch(() => {});
  if (quota.dailyRemaining !== null && quota.dailyRemaining <= 0 && quota.resetSeconds) {
    void startProviderCooldown(Math.ceil(quota.resetSeconds / 60), `DAILY_QUOTA_EXHAUSTED_${status}`).catch(() => {});
  }
});


// A rejection with notes is a request for a rewrite, not a verdict on the topic. It
// keeps the concept alive, hands the reviewer's words to the next generation, and counts
// the round so a topic cannot bounce between reviewer and model indefinitely. A
// rejection with nothing written retires the topic, which is the older behaviour and
// still the right reading of "no".
const MAX_REVISION_ROUNDS = 2;

// A post lost after generation is a debt against that day, and the debt is recorded
// rather than inferred. Recovery reads these to know a slot is owed even when its own
// arithmetic already looks satisfied, and anything still open when the day closes is
// escalated instead of forgotten.
// Whether the bank still holds a usable topic for a day, which separates "we ran out of
// road" from "we ran out of ideas" in the alert.
const conceptsRemainingFor = async (day: string) => {
  const [row] = await sql`
    SELECT count(*) AS count FROM social_post_concept c
    WHERE c.status='planned' AND c.planned_for <= ${day}
      AND EXISTS (SELECT 1 FROM social_topic_evidence_bundle b WHERE b.id=c.evidence_bundle_id AND b.verification_state='verified' AND b.expires_at>now())`;
  return Number(row.count) > 0;
};

// Both scheduling paths go through here, because for a long time only one of them chose
// a format at all. The manual route decided reel-or-carousel and queued the video; the
// automated route — the one that actually runs every day — inserted the job with the
// column left to its default and never queued a render. That is why four drafts carried
// perfectly good reel frames and none of them ever became a reel: nothing on the path
// they travelled ever looked.
async function schedulePublishJob(tx: typeof sql, input: {
  post: Record<string, unknown>;
  scheduledAt: string;
  availableAt: string;
  idempotencyKey: string;
}) {
  const { post } = input;
  const day = lisbonDate(new Date(input.scheduledAt));
  const [revisionRow] = await tx`SELECT reel_frames FROM social_post_revision WHERE id = ${String(post.revision_id)}`;
  const [reelCount] = await tx`
    SELECT count(*) AS count FROM social_publish_job
    WHERE format = 'reel' AND status NOT IN ('failed','blocked')
      AND scheduled_at >= ${`${day} 00:00:00+00`} AND scheduled_at < ${`${day} 23:59:59+00`}`;
  const [dayCount] = await tx`
    SELECT count(*) AS count FROM social_publish_job
    WHERE status NOT IN ('failed','blocked')
      AND scheduled_at >= ${`${day} 00:00:00+00`} AND scheduled_at < ${`${day} 23:59:59+00`}`;
  const reelFrames = (Array.isArray(revisionRow?.reel_frames) ? revisionRow.reel_frames : []) as Array<{ figure?: string }>;
  const decided = choosePostFormat({
    postsAlreadyOnDay: Number(dayCount?.count ?? 0),
    postsPerDay: 5,
    hasValidReel: reelFrames.length >= 3,
    // What the eye stops for, and the only thing about a reel that predicts whether four
    // frames land. The subject does not.
    reelFiguresCount: reelFrames.filter(frame => String(frame.figure ?? "").trim()).length,
    reelsAlreadyOnDay: Number(reelCount?.count ?? 0),
  });
  const [created] = await tx`
    INSERT INTO social_publish_job (post_id, revision_id, render_job_id, idempotency_key, scheduled_at, available_at, format, format_reason)
    VALUES (${String(post.id)}, ${String(post.revision_id)}, ${post.render_job_id ? String(post.render_job_id) : null}, ${input.idempotencyKey}, ${input.scheduledAt}, ${input.availableAt}, ${decided.format}, ${decided.reason})
    RETURNING *`;

  // Queued here rather than at handoff so the video is finished long before its slot
  // arrives, instead of being encoded while a publish waits on it.
  if (decided.format === "reel" && Array.isArray(revisionRow?.reel_frames)) {
    const reelManifest = buildReelManifest(post, revisionRow.reel_frames as never);
    const reelKey = `reel:${String(post.id)}:${String(post.revision_id)}`;
    const [existingReel] = await tx`SELECT id FROM social_render_job WHERE idempotency_key = ${reelKey}`;
    if (!existingReel) {
      const [reelJob] = await tx`
        INSERT INTO social_render_job (post_id, revision_id, idempotency_key, manifest, manifest_hash, kind)
        VALUES (${String(post.id)}, ${String(post.revision_id)}, ${reelKey}, ${tx.json(reelManifest)}, ${hash(reelManifest)}, 'reel')
        RETURNING id`;
      await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${String(post.id)}, 'reel.render_queued', ${tx.json({ jobId: reelJob.id, frames: reelManifest.frames.length })})`;
    }
  }
  return { job: created, decided };
}

// A draft that fails the gate on its way to review is in exactly the position a draft
// that fails validation during generation is in: the copy is wrong, the topic is not.
// The difference was that generation repairs and this path retired the topic outright —
// after the tokens had already been spent writing the thing. The gate's own complaint is
// specific enough to rewrite from, so it goes back as reviewer feedback and the topic
// returns to the bank. Only a topic that keeps failing this way is eventually retired.
// The gates answer with a list of what is wrong — "complete Instagram caption; standalone
// reader value" — and that list is the only part worth handing back to the model. The
// error string on its own says a gate refused the post, which is not something anyone can
// rewrite from.
// A day, however the value arrived: an ISO string, a driver Date, or a plan date.
const asDay = (value: unknown) => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? "" : lisbonDate(value);
  const text = String(value ?? "").trim();
  const iso = text.match(/^\d{4}-\d{2}-\d{2}/);
  if (iso) return iso[0];
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? "" : lisbonDate(parsed);
};

const refusalReason = (result: Record<string, unknown>) => {
  const failures = Array.isArray(result.failures) ? result.failures.map(String).filter(Boolean) : [];
  if (failures.length) return failures.join("; ");
  return String(result.detail || result.error || "review request failed");
};

async function returnConceptForRepair(tx: typeof sql, input: { topic: string; plannedFor: unknown; reason: string }) {
  const [concept] = await tx`
    SELECT id, plan_slot_id, generation_attempts, total_generation_attempts FROM social_post_concept
    WHERE topic=${input.topic} AND planned_for=${input.plannedFor as string} ORDER BY updated_at DESC LIMIT 1`;
  if (!concept) return { retired: false, attempts: 0 };
  const attempts = Number(concept.generation_attempts ?? 0) + 1;
  const totalAttempts = Number(concept.total_generation_attempts ?? 0) + 1;
  const retire = attempts >= MAX_GENERATION_ATTEMPTS;
  if (retire) {
    await tx`UPDATE social_post_concept SET status='blocked',blocked_kind='content_quality',blocked_reason=${input.reason.slice(0, 300)},blocked_at=now(),generation_attempts=${attempts},total_generation_attempts=${totalAttempts},updated_at=now() WHERE id=${concept.id as string}`;
    if (concept.plan_slot_id) await tx`UPDATE social_editorial_plan_slot SET status='held',updated_at=now() WHERE id=${concept.plan_slot_id}`;
  } else {
    await tx`UPDATE social_post_concept SET status='planned',revision_feedback=${input.reason.slice(0, 500)},generation_attempts=${attempts},total_generation_attempts=${totalAttempts},blocked_kind=NULL,blocked_reason=NULL,updated_at=now() WHERE id=${concept.id as string}`;
    if (concept.plan_slot_id) await tx`UPDATE social_editorial_plan_slot SET status='evidence_ready',updated_at=now() WHERE id=${concept.plan_slot_id}`;
  }
  return { retired: retire, attempts };
}


// A post the evidence gate stopped before it ever reached Buffer has no way out on its
// own. The gate re-reads its sources every audit and reaches the same verdict, so it sits
// blocked, is counted as a lost slot, and is announced again every day — four of them ran
// for three days that way. Give it a disposition instead: after a grace period the draft
// is archived and its topic goes back to the bank with the gate's own complaint attached,
// so the next attempt is written against fresh evidence rather than the same stale
// bundle. The topic is not the problem; that particular draft of it was.
const EVIDENCE_BLOCK_GRACE_HOURS = Number(process.env.EVIDENCE_BLOCK_GRACE_HOURS ?? 24);

async function retireEvidenceBlockedPosts() {
  const stuck = await sql`
    SELECT j.id AS job_id, p.id AS post_id, p.topic, p.planned_for, j.error_message
    FROM social_publish_job j JOIN social_post p ON p.id = j.post_id
    WHERE j.status = 'blocked' AND j.provider_post_id IS NULL
      AND j.error_code = 'EVIDENCE_REVALIDATION_FAILED'
      AND j.updated_at < now() - (${EVIDENCE_BLOCK_GRACE_HOURS}::STRING || ' hours')::INTERVAL
    ORDER BY j.updated_at LIMIT 20`;
  const retired: string[] = [];
  for (const row of stuck) {
    await sql.begin(async tx => {
      await tx`UPDATE social_publish_job SET status='failed', updated_at=now() WHERE id=${row.job_id}`;
      await tx`UPDATE social_post SET status='failed', archived_at=now(), updated_at=now() WHERE id=${row.post_id}`;
      await returnConceptForRepair(tx, {
        topic: String(row.topic),
        plannedFor: row.planned_for,
        reason: `The previous draft was stopped before publishing and its evidence never cleared: ${String(row.error_message ?? "evidence revalidation failed").slice(0, 240)}. Research the topic again and write it against current sources.`,
      });
      await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${row.post_id}, 'evidence.blocked_post_retired', ${tx.json({ jobId: row.job_id, topic: String(row.topic), reason: String(row.error_message ?? "") })})`;
    });
    retired.push(String(row.topic));
  }
  return retired;
}

async function requestReplacement(tx: typeof sql, input: { publishDate: unknown; reason: string; postId?: unknown; jobId?: unknown }) {
  // The day the slot belongs to, preferred over today: a post lost at 23:50 is a debt
  // against the day it was planned for, not against tomorrow.
  //
  // Via asDay, because the driver hands back a Date and String(date).slice(0, 10) is
  // "Sun Aug 19" — which the DATE column accepted and filed under the year 2001.
  let publishDate = input.publishDate ? asDay(input.publishDate) : "";
  if (!publishDate && input.postId) {
    const [post] = await tx`SELECT planned_for FROM social_post WHERE id=${String(input.postId)}`;
    if (post?.planned_for) publishDate = asDay(post.planned_for);
  }
  if (!publishDate) publishDate = lisbonDate(new Date());
  await tx`
    INSERT INTO social_replacement_request (publish_date, reason, source_post_id, source_job_id)
    VALUES (${publishDate}, ${input.reason.slice(0, 300)}, ${input.postId ? String(input.postId) : null}, ${input.jobId ? String(input.jobId) : null})
    ON CONFLICT (source_job_id) WHERE source_job_id IS NOT NULL AND status='open' DO NOTHING`;
  await tx`INSERT INTO social_event (event_type, payload) VALUES ('publish.replacement_requested', ${tx.json({ publishDate, reason: input.reason.slice(0, 300), postId: input.postId ? String(input.postId) : null, jobId: input.jobId ? String(input.jobId) : null })})`;
}

async function applyRejection(tx: typeof sql, postId: string, topic: string, plannedFor: unknown, comment: string | null) {
  const notes = (comment ?? "").trim();
  const [concept] = await tx`
    SELECT id, plan_slot_id, revision_round FROM social_post_concept
    WHERE topic = ${topic} AND planned_for = ${plannedFor as string} ORDER BY updated_at DESC LIMIT 1
  `;
  const round = Number(concept?.revision_round ?? 0);
  const rewrite = Boolean(notes) && Boolean(concept) && round < MAX_REVISION_ROUNDS;

  if (!rewrite) {
    const concepts = await tx`UPDATE social_post_concept SET status='blocked',blocked_kind='reviewer',blocked_reason=${notes ? `reviewer rejected after ${round} rewrite round(s): ${notes.slice(0, 200)}` : "reviewer rejected with no rewrite notes"},blocked_at=now(),updated_at=now() WHERE topic=${topic} AND planned_for=${plannedFor as string} RETURNING plan_slot_id`;
    for (const row of concepts) if (row.plan_slot_id) await tx`UPDATE social_editorial_plan_slot SET status='held',updated_at=now() WHERE id=${row.plan_slot_id}`;
    return { rewrite: false as const, round };
  }

  await tx`
    UPDATE social_post_concept
    SET status='planned', revision_feedback=${notes}, revision_round=${round + 1}, updated_at=now()
    WHERE id=${concept.id as string}
  `;
  // The slot keeps its verified evidence, so generation can pick it straight back up.
  if (concept.plan_slot_id) await tx`UPDATE social_editorial_plan_slot SET status='evidence_ready',updated_at=now() WHERE id=${concept.plan_slot_id}`;
  await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${postId},'revision.requested_from_reviewer',${tx.json({ conceptId: concept.id, round: round + 1, notes })})`;
  return { rewrite: true as const, round: round + 1 };
}

// Reads a page through the renderer's Chromium so client-rendered and bot-guarded
// official sites remain usable as evidence.
// Fetch an official page and store it as evidence, returning the document row or null
// when the page cannot be read well enough to cite. Extracted from the brief ingest so
// triage can reach an official source the corpus has never seen -- a notice published
// this morning is exactly the case news is supposed to catch, and it is never already
// in the corpus.
async function ingestOfficialDocument(canonicalUrl: string, authority: string) {
  try {
    const page = await fetchPage(canonicalUrl);
    let text = page.html ? visibleText(page.html) : "";
    let title = page.html ? pageTitle(page.html, canonicalUrl) : canonicalUrl;
    if (page.status === 403 || page.status === 0 || text.length < 400) {
      const rendered = await fetchViaRenderer(canonicalUrl);
      if (rendered && rendered.text.length > text.length) { text = rendered.text; title = rendered.title || title; }
    }
    // Too thin to cite. Storing it anyway would let a post claim a source that says nothing.
    if (text.length < 400) return null;
    const contentHash = hash(text);
    const [document] = await sql`
      INSERT INTO document (source_tier, source_url, source_authority, title, original_lang, content_hash,
                            fetched_at, last_verified_at, freshness_confidence, last_upstream_check_at, verified_still_available)
      VALUES ('official', ${canonicalUrl}, ${authority}, ${title}, 'pt', ${contentHash},
              now(), now(), 'fresh', now(), true)
      ON CONFLICT (source_url) DO UPDATE SET
        title=excluded.title, content_hash=excluded.content_hash, last_verified_at=now(),
        freshness_confidence='fresh', last_upstream_check_at=now(), verified_still_available=true
      RETURNING id
    `;
    const chunks = chunkText(text);
    await sql`DELETE FROM chunk WHERE document_id=${document.id}`;
    for (const [index, chunk] of chunks.entries()) {
      await sql`INSERT INTO chunk (document_id, chunk_index, text, token_count, lang, content_hash)
                VALUES (${document.id}, ${index}, ${chunk}, ${Math.ceil(chunk.length / 4)}, 'pt', ${hash(chunk)})`;
    }
    return document as { id: unknown };
  } catch {
    return null;
  }
}

// The reserve is what a held slot falls back on, and every reader of
// social_reserve_evidence required a row that nothing in the codebase ever wrote. The
// table was read in four places and inserted into in none, so the only rows present were
// hand-seeded ones for long-replaced cards: a rebuilt reserve was inert on arrival and
// every held slot stayed held. This fetches each card's cited source and records it.
async function verifyReserveEvidence(limit = 40) {
  const cards = await loadEvergreenReserve();
  const byUrl = new Map<string, (typeof cards)[number]>();
  for (const card of cards) if (!byUrl.has(card.sourcePolicy.canonicalUrl)) byUrl.set(card.sourcePolicy.canonicalUrl, card);
  const current = await sql`
    SELECT DISTINCT canonical_url AS url FROM social_reserve_evidence
    WHERE available = true AND document_id IS NOT NULL AND verified_at > now() - INTERVAL '30 days'
  `;
  const fresh = new Set(current.map(row => String(row.url)));
  const pending = [...byUrl.values()].filter(card => !fresh.has(card.sourcePolicy.canonicalUrl)).slice(0, limit);
  const unreachable: string[] = [];
  let verified = 0;
  for (const card of pending) {
    const canonicalUrl = card.sourcePolicy.canonicalUrl;
    const authority = card.sourcePolicy.requiredAuthority || "Official authority";
    const document = await ingestOfficialDocument(canonicalUrl, authority);
    if (!document) { unreachable.push(canonicalUrl); continue; }
    const documentId = String(document.id);
    const [meta] = await sql`SELECT title, content_hash FROM document WHERE id = ${documentId}`;
    const [body] = await sql`SELECT string_agg(text, chr(10) ORDER BY chunk_index) AS text FROM chunk WHERE document_id = ${documentId}`;
    const visible = String(body?.text ?? "");
    if (visible.length < 400) { unreachable.push(canonicalUrl); continue; }
    await sql`
      INSERT INTO social_reserve_evidence (canonical_url, authority, title, original_lang, content_hash, visible_text, document_id, fetched_at, verified_at, available)
      VALUES (${canonicalUrl}, ${authority}, ${String(meta?.title ?? canonicalUrl)}, 'pt', ${String(meta?.content_hash ?? "")}, ${visible}, ${documentId}, now(), now(), true)
      ON CONFLICT (canonical_url, content_hash) DO UPDATE SET
        verified_at = now(), available = true, document_id = excluded.document_id, visible_text = excluded.visible_text, title = excluded.title
    `;
    verified += 1;
  }
  await sql`INSERT INTO social_event (event_type, payload) VALUES ('reserve.evidence_verified', ${sql.json({ cards: cards.length, sources: byUrl.size, attempted: pending.length, verified, unreachable })})`;
  return { cards: cards.length, sources: byUrl.size, attempted: pending.length, verified, unreachable };
}

async function fetchViaRenderer(url: string): Promise<{ title: string; text: string; finalUrl: string; links: string[] } | null> {
  const base = process.env.RENDERER_BASE_URL || "http://127.0.0.1:4310";
  const rendererToken = process.env.RENDERER_API_TOKEN;
  if (!rendererToken) return null;
  try {
    const response = await fetch(`${base.replace(/\/$/, "")}/fetch-text`, {
      method: "POST",
      headers: { authorization: `Bearer ${rendererToken}`, "content-type": "application/json" },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(70_000),
    });
    if (!response.ok) return null;
    const page = await response.json() as { title?: string; text?: string; finalUrl?: string; links?: string[] };
    return { title: String(page.title ?? ""), text: String(page.text ?? ""), finalUrl: String(page.finalUrl || url), links: Array.isArray(page.links) ? page.links.map(String) : [] };
  } catch {
    return null;
  }
}

async function reconcileBufferPublish(job: Record<string, any>) {
  const channelId = process.env.BUFFER_CHANNEL_ID;
  if (!channelId) throw new BufferError("BUFFER_CHANNEL_ID is not configured", "CHANNEL_NOT_CONFIGURED", false);
  const text = composeInstagramCaption({ hook: String(job.post.hook), body: String(job.post.caption), callToAction: String(job.post.call_to_action), hashtags: job.post.hashtags as string[] });
  const match = await findMatchingScheduledPost({ channelId, text, dueAt: new Date(job.scheduled_at as string).toISOString() });
  if (!match) return null;
  await sql.begin(async tx => {
    await tx`UPDATE social_publish_job SET status='scheduled',provider_post_id=${match.id},provider_status=${match.status||'scheduled'},lease_owner=NULL,lease_expires_at=NULL,error_code=NULL,error_message=NULL,updated_at=now() WHERE id=${job.id} AND status IN ('processing','blocked')`;
    await tx`UPDATE social_post SET status='scheduled',buffer_post_id=${match.id},updated_at=now() WHERE id=${job.post_id}`;
    await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${job.post_id},'publish.reconciled_buffer',${tx.json({jobId:job.id,bufferPostId:match.id,scheduledAt:job.scheduled_at})})`;
  });
  return match;
}

const sendHtml = (res: http.ServerResponse, status: number, body: string) => {
  res.writeHead(status, {
    "content-type": "text/html; charset=utf-8", "cache-control": "no-store",
    "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    "x-content-type-options": "nosniff", "referrer-policy": "no-referrer",
  });
  res.end(body);
};

const sendBoardHtml = (res: http.ServerResponse, body: string, nonce: string) => {
  res.writeHead(200, {
    "content-type": "text/html; charset=utf-8", "cache-control": "no-store",
    "content-security-policy": `default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src https: data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`,
    "x-content-type-options": "nosniff", "referrer-policy": "no-referrer", "permissions-policy": "camera=(), microphone=(), geolocation=()",
  });
  res.end(body);
};

async function readJson(req: http.IncomingMessage): Promise<unknown> {
  const parts: Buffer[] = [];
  let size = 0;
  for await (const part of req) {
    size += part.length;
    if (size > 1_000_000) throw new Error("Request body too large");
    parts.push(part);
  }
  return JSON.parse(Buffer.concat(parts).toString("utf8") || "{}");
}

async function readForm(req: http.IncomingMessage): Promise<URLSearchParams> {
  const parts: Buffer[] = [];
  let size = 0;
  for await (const part of req) {
    size += part.length;
    if (size > 32_000) throw new Error("Request body too large");
    parts.push(part);
  }
  return new URLSearchParams(Buffer.concat(parts).toString("utf8"));
}

function reviewPage(post: Record<string, unknown>, revision: Record<string, unknown>, token: string, reviewer: string) {
  const slides = revision.slides as Array<Record<string, unknown>>;
  const sources = revision.source_bundle as Array<Record<string, unknown>>;
  const altTexts = revision.alt_texts as string[];
  const finalCaption = composeInstagramCaption({
    hook: String(revision.hook),
    body: String(revision.caption),
    callToAction: String(revision.call_to_action),
    hashtags: revision.hashtags as string[],
  });
  const slideCards = slides.map((slide, index) => `<article><small>Slide ${index + 1}</small><h3>${escapeHtml(slide.title)}</h3><p>${escapeHtml(slide.body)}</p><p class="meta"><strong>Alt text:</strong> ${escapeHtml(altTexts[index])}</p></article>`).join("");
  const sourceItems = sources.map((source) => `<li><a href="${escapeHtml(source.url)}" rel="noreferrer">${escapeHtml(source.title)}</a> — ${escapeHtml(source.publisher)}<br><small>Retrieved ${escapeHtml(source.retrievedAt)}</small>${Array.isArray(source.excerpts)?`<blockquote>${(source.excerpts as unknown[]).slice(0,3).map(escapeHtml).join("<br><br>")}</blockquote>`:""}</li>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Review · ${escapeHtml(post.topic)}</title><style>
  :root{font-family:Inter,ui-sans-serif,system-ui;color:#143735;background:#f6f2ea}body{margin:0}.wrap{max-width:1080px;margin:auto;padding:32px 20px 64px}header{display:flex;justify-content:space-between;gap:20px;align-items:start}.pill{background:#f0aa70;padding:6px 10px;border-radius:99px;font-weight:700;text-transform:uppercase;font-size:12px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin:24px 0}article,.panel{background:white;border:1px solid #d7ddd8;border-radius:14px;padding:20px;box-shadow:0 5px 18px #1437350d}article small,.meta{color:#5c706c;font-size:13px}h1{font-size:clamp(30px,5vw,52px);margin:.35em 0}h3{font-size:22px}.caption{white-space:pre-wrap;line-height:1.6}a{color:#175e58}form{display:flex;gap:12px;align-items:end;flex-wrap:wrap;margin-top:20px}label{display:grid;gap:6px;flex:1;min-width:240px}textarea{min-height:70px;padding:10px;border:1px solid #aebbb7;border-radius:8px}button{border:0;border-radius:9px;padding:12px 20px;font-weight:800;cursor:pointer}.approve{background:#175e58;color:white}.reject{background:#9d3535;color:white}.warning{border-left:5px solid #f0aa70}.identity{font-size:13px;color:#5c706c}</style></head><body><main class="wrap"><header><div><span class="pill">${escapeHtml(post.risk_level)} risk · ${escapeHtml(post.category)}</span><h1>${escapeHtml(post.topic)}</h1><p>${escapeHtml(revision.hook)}</p></div><p class="identity">Reviewer: ${escapeHtml(reviewer)}</p></header><section class="panel warning"><strong>Approval is revision-bound.</strong> Any change to copy, slides, or evidence invalidates this decision.</section><section class="grid">${slideCards}</section><section class="panel"><h2>Final Instagram caption</h2><p class="caption">${escapeHtml(finalCaption)}</p><h2>Sources</h2><ul>${sourceItems}</ul><p class="meta">Evidence hash: ${escapeHtml(String(revision.evidence_hash).slice(0, 16))}…</p><form method="post" action="${escapeHtml(reviewPathPrefix)}/review/${escapeHtml(token)}/decision"><label>Optional review comment<textarea name="comment" maxlength="500"></textarea></label><button class="approve" name="decision" value="approved">Approve exact revision</button><button class="reject" name="decision" value="rejected">Reject</button></form></section></main></body></html>`;
}

/**
 * Re-checks the sources behind a revision and, where they still say what the post quoted,
 * records that they were checked just now.
 *
 * The freshness rule reads retrievedAt out of the revision's own source bundle, which is a
 * snapshot taken when the draft was written and never moves again. Harmless while a post
 * was generated and handed over inside a day; not harmless once generation started working
 * days ahead, because a post written on Monday for Thursday arrived at handoff carrying
 * Monday's timestamp and could never be anything but stale.
 *
 * What it does not do is compare the page to how it looked before. An official page gains
 * a news item or a related-links block and its text changes by three thousand characters
 * without a word of the part we quoted moving — refusing the post for that is not caution,
 * it is superstition. The question worth asking is the one generation already asks: does
 * the source still contain the sentence this post put in quotation marks? If it does, the
 * evidence has been re-read and still holds. If it does not, the timestamp stays where it
 * was and the post stays blocked, which is the entire point of the check.
 */
// Re-read one document from its source. Documents that arrive through the brief bank or
// the recurring calendar are kept fresh by /v1/corpus/ingest-briefs, but a document that
// came in through discovery has nothing refreshing it — so it quietly aged past the
// twenty-four hours the pre-publish check demands, and posts already sitting in Buffer
// were pulled back out over a source that was still perfectly available. Refreshing on
// demand costs one fetch and only happens for a document a live post actually depends on.
async function reverifyDocument(documentId: string): Promise<boolean> {
  const [document] = await sql`SELECT id, source_url, source_authority, title FROM document WHERE id=${documentId}`;
  if (!document?.source_url) return false;
  const canonicalUrl = String(document.source_url);
  try {
    const page = await fetchPage(canonicalUrl);
    let text = page.html ? visibleText(page.html) : "";
    let title = page.html ? pageTitle(page.html, canonicalUrl) : String(document.title || canonicalUrl);
    if (page.status === 403 || page.status === 0 || text.length < 400) {
      const rendered = await fetchViaRenderer(canonicalUrl);
      if (rendered && rendered.text.length > text.length) { text = rendered.text; title = rendered.title || title; }
    }
    // Storing a page that came back empty would replace real evidence with nothing.
    if (text.length < 400) return false;
    await sql`
      UPDATE document SET title=${title}, content_hash=${hash(text)}, last_verified_at=now(),
        freshness_confidence='fresh', last_upstream_check_at=now(), verified_still_available=true
      WHERE id=${documentId}`;
    const chunks = chunkText(text);
    await sql`DELETE FROM chunk WHERE document_id=${documentId}`;
    for (const [index, chunk] of chunks.entries()) {
      await sql`INSERT INTO chunk (document_id, chunk_index, text, token_count, lang, content_hash)
                VALUES (${documentId}, ${index}, ${chunk}, ${Math.ceil(chunk.length / 4)}, 'pt', ${hash(chunk)})`;
    }
    await sql`INSERT INTO social_event (event_type, payload) VALUES ('official_source.reverified', ${sql.json({ documentId, url: canonicalUrl, chunks: chunks.length })})`;
    return true;
  } catch {
    return false;
  }
}

async function refreshRevisionEvidence(postId: string, revisionId: string): Promise<{ refreshed: number; changed: number }> {
  const [row] = await sql`SELECT source_bundle FROM social_post_revision WHERE id=${revisionId} AND post_id=${postId}`;
  const sources = (row?.source_bundle ?? []) as Array<Record<string, unknown>>;
  if (!sources.length) return { refreshed: 0, changed: 0 };

  const claims = await sql`SELECT evidence_quote FROM social_claim WHERE post_id=${postId} AND revision_id=${revisionId}`;
  const quotes = claims.map(claim => String(claim.evidence_quote).replace(/\s+/g, " ").trim()).filter(Boolean);

  let refreshed = 0;
  let changed = 0;
  const updated = await Promise.all(sources.map(async source => {
    const documentId = source.documentId ? String(source.documentId) : "";
    if (!documentId) return source;
    let [document] = await sql`
      SELECT last_verified_at FROM document
      WHERE id=${documentId} AND verified_still_available=true
        AND last_verified_at > now() - INTERVAL '24 hours'
    `;
    // Stale is not the same as gone. Read it again before deciding the post cannot go
    // out; only a source that will not come back should stop a post that is already
    // written, approved and queued.
    if (!document && await reverifyDocument(documentId)) {
      [document] = await sql`
        SELECT last_verified_at FROM document
        WHERE id=${documentId} AND verified_still_available=true
          AND last_verified_at > now() - INTERVAL '24 hours'
      `;
    }
    if (!document) return source;

    const [body] = await sql`SELECT string_agg(text, chr(10) ORDER BY chunk_index) AS text FROM chunk WHERE document_id=${documentId}`;
    const current = String(body?.text ?? "").replace(/\s+/g, " ");
    // Only the quotes this source actually carried have to survive in it; another
    // source's sentence being absent here says nothing about this one.
    const carried = quotes.filter(quote => (source.excerpts as string[] | undefined)?.some(excerpt => excerpt.replace(/\s+/g, " ").includes(quote)) ?? true);
    const stillThere = carried.every(quote => current.includes(quote));
    if (!stillThere) { changed += 1; return source; }

    refreshed += 1;
    // ISO, not String(date). The driver returns a Date and its default string form is
    // "Fri Aug 21 2026 07:59:50 GMT+0100 (Western European Summer Time)", which every
    // later reader has to re-parse and which some of them get wrong.
    const verifiedAt = document.last_verified_at instanceof Date
      ? document.last_verified_at.toISOString()
      : new Date(String(document.last_verified_at)).toISOString();
    return { ...source, retrievedAt: verifiedAt };
  }));

  if (refreshed) {
    await sql`UPDATE social_post_revision SET source_bundle=${sql.json(updated as never)} WHERE id=${revisionId}`;
    await sql`INSERT INTO social_event(post_id,event_type,payload) VALUES(${postId},'evidence.revision_refreshed',${sql.json({ revisionId, refreshed, changed })})`;
  }
  return { refreshed, changed };
}

async function assessStoredRevision(postId: string, revisionId: string, requireRecent = false) {
  const [row]=await sql`SELECT p.topic,p.category,r.source_bundle,r.created_at FROM social_post p JOIN social_post_revision r ON r.id=${revisionId} AND r.post_id=p.id WHERE p.id=${postId}`;
  if(!row)return {passed:false,sensitive:false,failures:["Post revision is unavailable"],checkedAt:new Date().toISOString(),requiredAuthority:null,sourceCount:0,officialHostCount:0};
  const claims=await sql`SELECT claim_text AS claim,evidence_quote AS "evidenceQuote" FROM social_claim WHERE post_id=${postId} AND revision_id=${revisionId}`;
  const sources=(row.source_bundle||[]) as Array<Record<string,unknown>>;
  const assessment=assessEvidenceReliability({topic:String(row.topic),category:String(row.category),claims:claims.map(claim=>({claim:String(claim.claim),evidenceQuote:String(claim.evidenceQuote)})),sources:sources.map(source=>({url:String(source.url),title:String(source.title||""),publisher:source.publisher?String(source.publisher):null,tier:String(source.tier||""),retrievedAt:String(source.retrievedAt||""),excerpts:Array.isArray(source.excerpts)?source.excerpts.map(String):[]}))});
  if(requireRecent&&assessment.sensitive){
    // Re-read the sources before judging their age. The publish path already did this;
    // the queue audit did not, so a post whose source had simply not been re-checked
    // that day was pulled out of Buffer rather than refreshed — which is the same
    // stale-timestamp refusal this was written to end, arriving through the other door.
    await refreshRevisionEvidence(postId, revisionId).catch(() => ({ refreshed: 0, changed: 0 }));
    const [refreshedRow]=await sql`SELECT source_bundle FROM social_post_revision WHERE id=${revisionId}`;
    const current=((refreshedRow?.source_bundle||sources) as Array<Record<string,unknown>>);
    // A timestamp that will not parse is a source that needs looking at, not a source
    // that is infinitely old — and reduced through Math.max it turned one bad value into
    // NaN and failed the whole bundle. One post was refused at ten hours old for it.
    const ages=current.map(source=>new Date(String(source.retrievedAt??"")).getTime()).filter(time=>Number.isFinite(time)).map(time=>Date.now()-time);
    const unreadable=current.length-ages.length;
    const oldest=ages.length?Math.max(...ages):Number.POSITIVE_INFINITY;
    if(unreadable>0)return {...assessment,passed:false,failures:[...assessment.failures,`${unreadable} evidence source(s) carry an unreadable retrieval time`]};
    // Twenty-four hours was too tight for what these sources are. A tax code or a labour
    // statute changes a few times a year, and some of the sites — seg-social.pt among
    // them — refuse our fetcher outright, so their documents can never be re-read however
    // often we try. A post whose evidence was verified two days ago and whose quoted
    // sentence is still in the corpus was being held forever on the theory that it might
    // have changed, while the check that would have shown it changed could not run.
    //
    // The guard that matters is still in force above this one: refreshRevisionEvidence
    // re-reads what it can and fails the post outright if a quoted sentence has gone. This
    // is only the ceiling for evidence we could not re-read at all.
    const freshnessHours = Number(process.env.EVIDENCE_MAX_AGE_HOURS ?? 72);
    if(oldest>freshnessHours*60*60_000)return {...assessment,passed:false,failures:[...assessment.failures,`Sensitive evidence is older than ${freshnessHours} hours and could not be re-read`]};
  }
  return assessment;
}

async function assessStoredEditorial(postId:string,revisionId:string){
  const [row]=await sql`SELECT p.topic,p.risk_level,p.subject_family,p.user_question,p.content_intent,r.hook,r.caption,r.call_to_action,r.hashtags,r.slides,r.source_bundle FROM social_post p JOIN social_post_revision r ON r.id=${revisionId} AND r.post_id=p.id WHERE p.id=${postId}`;
  if(!row)return {score:0,failures:["post revision unavailable"],passed:false};
  const sources=row.source_bundle as Array<{url?:string;tier?:string;publisher?:string;title?:string}>;
  const sourceLabel=String(sources.find(source=>source.publisher)?.publisher||sources[0]?.title||"Official source").slice(0,80);
  const slides=(row.slides as Array<{title?:string;body?:string;items?:string[];sourceLabel?:string}>).map(slide=>({...slide,sourceLabel:slide.sourceLabel?.trim()||sourceLabel}));
  return editorialScore({topic:String(row.topic),hook:String(row.hook),caption:String(row.caption),callToAction:String(row.call_to_action),hashtags:row.hashtags as string[],slides,riskLevel:String(row.risk_level),subjectFamily:String(row.subject_family||""),userQuestion:String(row.user_question||""),contentIntent:String(row.content_intent||""),sources});
}

const GenerateSchema = z.object({ conceptId: z.string().uuid(), allowPaid: z.boolean().default(false)});
// Five is the daily cadence the plan is built for, so it is the default. This defaulted
// to 2 while the scheduler called it with no override, which silently capped the day at
// two planned concepts no matter how many slots the plan held. Capacity remains a cap,
// not a quota: a slot without current evidence is still held rather than filled.
const PlanningSchema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), capacity: z.number().int().min(1).max(5).default(5) });
const ResearchSchema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() });
const ReviewRequestSchema = z.object({ expiresInMinutes: z.number().int().min(5).max(1440).default(60), dryRun: z.boolean().default(false) });
const RenderRequestSchema = z.object({ idempotencyKey: z.string().min(8).max(200) });
// What a renderer is allowed to hand back. Each kind is exact rather than loosened into
// "any size, any type": the literal dimensions are what stop a slide of the wrong shape
// reaching Instagram, and widening them so a reel could fit would have given that up for
// carousels too.
const RenderFileBase = { index: z.number().int().min(1).max(10), sha256: z.string().regex(/^[a-f0-9]{64}$/), bytes: z.number().int().positive().max(60_000_000) };
const CarouselSlideFile = z.object({ ...RenderFileBase, width: z.literal(1080), height: z.literal(1350), mimeType: z.literal("image/png") });
const ReelVideoFile = z.object({ ...RenderFileBase, width: z.literal(1080), height: z.literal(1920), mimeType: z.literal("video/mp4") });
const ReelCoverFile = z.object({ ...RenderFileBase, width: z.literal(1080), height: z.literal(1920), mimeType: z.literal("image/png") });
const RenderFileSchema = z.union([CarouselSlideFile, ReelVideoFile, ReelCoverFile]);
const UploadRequestSchema = z.object({ files: z.array(RenderFileSchema).min(2).max(7) });
const KeyedRenderFile = z.union([
  CarouselSlideFile.extend({ key: z.string().min(10).max(500) }),
  ReelVideoFile.extend({ key: z.string().min(10).max(500) }),
  ReelCoverFile.extend({ key: z.string().min(10).max(500) }),
]);
const CompleteRenderSchema = z.object({ files: z.array(KeyedRenderFile).min(2).max(7) });
const FailJobSchema = z.object({ code: z.string().min(1).max(80), message: z.string().min(1).max(1000), retryable: z.boolean() });
const ScheduleSchema = z.object({ scheduledAt: z.string().datetime({ offset: true }), idempotencyKey: z.string().min(8).max(200) });
const DiscoverySchema = z.object({
  url: z.string().url().max(2000), title: z.string().min(1).max(500), publisher: z.string().max(200).nullable().optional(),
  locale: z.string().min(2).max(10).default("en"), publishedAt: z.string().datetime({ offset: true }).nullable().optional(),
  category: z.string().min(1).max(80).default("general"), riskLevel: z.enum(["low", "medium", "high"]).default("medium"),
});
const DiscoveryBatchSchema = z.object({ items: z.array(DiscoverySchema).min(1).max(100), sourceKind: z.enum(["rss", "news_discovery", "official_notice"]).default("news_discovery") });
const OfficialSnapshotSchema=z.object({url:z.string().url(),httpStatus:z.number().int().min(100).max(599),body:z.string().max(900_000),fetchedAt:z.string().datetime().optional()});
const NewsDecisionSchema=z.object({date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),cutoffReached:z.boolean().default(false),dryRun:z.boolean().default(false)});
const ReportSchema=z.object({date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()});
const BoardActionSchema = z.object({
  postId: z.string().uuid(), revisionId: z.string().uuid().nullable(),
  action: z.enum(["approve", "reject", "reopen_review", "retry_render", "retry_publish", "force_retry_publish", "edit_revision", "send_review", "archive", "restore"]),
  token: z.string().min(20), comment: z.string().max(500).optional().default(""),
  acknowledged: z.boolean().optional().default(false),
  edit: z.object({
    hook: z.string().min(10).max(300), caption: z.string().min(20).max(2200), callToAction: z.string().min(5).max(300),
    slides: z.array(z.object({ title: z.string().min(2).max(82), body: z.string().max(320) })).min(3).max(7),
  }).optional(),
});
// indexOf stopped at the *first* mention of each term, so a page that states the figure
// further down — in the second table, in the exception, in the row that actually applies —
// handed the writer an opening window that did not contain it. The claim then failed the
// anchor check over a number the source stated plainly. Every occurrence is a candidate
// now, and the six slots go to the windows carrying the most search terms and the most
// figures. Windows are capped and merged so the budget is the same as before: six windows
// of two thousand characters, six different parts of the page rather than six views of one.
const evidenceWindows=(text:string,terms:string[])=>{
  const normalized=text.replace(/\s+/g," ").trim();
  const haystack=normalized.toLocaleLowerCase("pt");
  const lowered=[...new Set(terms.map(term=>term.toLocaleLowerCase("pt")).filter(Boolean))];
  const starts:number[]=[];
  for(const term of lowered){
    let at=haystack.indexOf(term);
    for(let found=0;at>=0&&found<20;found++){starts.push(at);at=haystack.indexOf(term,at+term.length);}
  }
  if(!starts.length)return [normalized.slice(0,2000)];
  const merged:Array<{from:number;to:number}>=[];
  for(const at of [...new Set(starts)].sort((a,b)=>a-b)){
    const from=Math.max(0,at-350),to=Math.min(normalized.length,at+1650);
    const last=merged[merged.length-1];
    // Overlapping windows are the same evidence twice, but merging without a ceiling walks
    // a window across a whole page when the term recurs throughout it.
    if(last&&from<=last.to&&Math.max(last.to,to)-last.from<=2000)last.to=Math.max(last.to,to);
    else merged.push({from,to});
  }
  return merged
    .map(window=>{const body=haystack.slice(window.from,window.to);return {...window,score:lowered.filter(term=>body.includes(term)).length*100+Math.min((body.match(/\d/g)||[]).length,60)};})
    .sort((a,b)=>b.score-a.score||a.from-b.from)
    .slice(0,6)
    .sort((a,b)=>a.from-b.from)
    .map(window=>normalized.slice(window.from,window.to));
};

function createRenderManifest(post: Record<string, unknown>, revision: Record<string, unknown>) {
  const raw = revision.slides as Array<Record<string, unknown>>;
  const slides = raw.map((slide, index) => {
    const base = { eyebrow: fit(slide.eyebrow, RENDER_LIMITS.eyebrow), title: fit(slide.title, RENDER_LIMITS.title), sourceLabel: fit(slide.sourceLabel || post.source_authority || "Finkavo source-backed guide", 80) };
    const type = String(slide.type || (index === 0 ? "cover" : index === raw.length - 1 ? "summary" : "content"));
    const icon = String(slide.icon || "document");
    if (type === "cover") return { ...base, type, icon, category: fit(post.category || "Portugal", RENDER_LIMITS.category), subtitle: fit(slide.body, RENDER_LIMITS.coverSubtitle) };
    if (type === "summary") return { ...base, type, icon, body: fit(slide.body, RENDER_LIMITS.summaryBody), cta: fit(revision.call_to_action, RENDER_LIMITS.callToAction) };
    if (type === "bullets" || type === "steps") return { ...base, type, icon, items: (slide.items as unknown[]).map((item) => fit(item, RENDER_LIMITS.item)).slice(0, 5) };
    return { ...base, type: "content", icon, body: fit(slide.body, RENDER_LIMITS.contentBody), ...(slide.highlight ? { highlight: fit(slide.highlight, RENDER_LIMITS.highlight) } : {}) };
  });
  const visualStyle = selectVisualStyle(post);
  return { schemaVersion: 1, postId: String(post.id), revisionId: String(revision.id), locale: "en", templateVersion: "finkavo-v3", visualStyle, slides };
}

type StoredRenderFile = RenderFileInput & { index: number };
async function persistReviewedRender(post: Record<string, unknown>, revision: Record<string, unknown>, paths: string[]) {
  const postId = String(post.id);
  const revisionId = String(revision.id);
  const manifest = createRenderManifest(post, revision);
  const manifestHash = hash(manifest);
  if (paths.length !== manifest.slides.length) throw new Error("Reviewed render file count does not match its manifest");
  const now = new Date();
  const prefix = `social/carousels/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${String(now.getUTCDate()).padStart(2, "0")}/${postId}/${revisionId}`;
  const files: StoredRenderFile[] = [];
  for (const [index, path] of paths.entries()) {
    const bytes = await readFile(path);
    const png = bytes.length >= 24 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const width = png ? view.getUint32(16) : 0;
    const height = png ? view.getUint32(20) : 0;
    if (!png || width !== 1080 || height !== 1350) throw new Error(`Reviewed slide ${index + 1} is not a valid 1080 × 1350 PNG`);
    const file: StoredRenderFile = {
      index: index + 1,
      sha256: createHash("sha256").update(bytes).digest("hex"),
      bytes: bytes.length,
      width: 1080,
      height: 1350,
      mimeType: "image/png",
      key: `${prefix}/${String(index + 1).padStart(2, "0")}.png`,
    };
    if (!(await uploadRenderedObject(file, bytes))) throw new Error(`Reviewed slide ${index + 1} failed R2 verification`);
    files.push(file);
  }
  const [saved] = await sql.begin(async (tx) => {
    const [currentPost] = await tx`SELECT id,status,current_revision_id,approved_revision_id FROM social_post WHERE id=${postId} FOR UPDATE`;
    if (!currentPost || currentPost.current_revision_id !== revisionId) return [];
    const [existing] = await tx`SELECT * FROM social_render_job WHERE post_id=${postId} AND revision_id=${revisionId} ORDER BY created_at DESC LIMIT 1 FOR UPDATE`;
    let job;
    if (existing) {
      if (existing.status !== "completed" && existing.status !== "failed") return [];
      [job] = await tx`UPDATE social_render_job SET status='completed',manifest=${tx.json(manifest)},manifest_hash=${manifestHash},output_files=${tx.json(files)},lease_owner=NULL,lease_expires_at=NULL,error_code=NULL,error_message=NULL,updated_at=now() WHERE id=${existing.id} RETURNING *`;
    } else {
      [job] = await tx`INSERT INTO social_render_job(post_id,revision_id,idempotency_key,status,manifest,manifest_hash,attempt_count,output_files) VALUES(${postId},${revisionId},${`render:${postId}:${revisionId}`},'completed',${tx.json(manifest)},${manifestHash},1,${tx.json(files)}) RETURNING *`;
      await tx`INSERT INTO social_render_attempt(job_id,attempt_number,worker_id,finished_at,outcome) VALUES(${job.id},1,'review-renderer',now(),'completed')`;
    }
    const approved = currentPost.approved_revision_id === revisionId;
    if (approved) await tx`UPDATE social_post SET status='rendered',rendered_at=now(),render_files=${tx.json(files)},updated_at=now() WHERE id=${postId}`;
    await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${postId},${approved ? "render.recovered_reviewed" : "render.reviewed_ready"},${tx.json({jobId:String(job.id),revisionId,manifestHash,files:files.map(file=>({key:file.key,sha256:file.sha256,bytes:file.bytes}))})})`;
    return [job];
  });
  if (!saved) throw new Error("Reviewed render could not be attached to the current revision");
  return { job: saved, files };
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (req.method === "GET" && url.pathname === "/healthz") {
      await sql`SELECT 1`;
      return send(res, 200, { ok: true, service: "social-api" });
    }

    if (req.method === "GET" && url.pathname === "/board") {
      const reviewer = await authenticatedReviewer(req.headers);
      if (!reviewer) return sendHtml(res, 403, "<h1>Dashboard access requires the authenticated owner identity</h1>");
      const nonce = randomBytes(18).toString("base64url");
      return sendBoardHtml(res, boardPage(reviewer, nonce), nonce);
    }

    if (req.method === "GET" && url.pathname === "/board/data") {
      const reviewer = await authenticatedReviewer(req.headers);
      if (!reviewer) return send(res, 403, { error: "Dashboard access requires the authenticated owner identity" });
      const rows = await sql`
        SELECT p.*,r.id AS revision_id,r.hook AS revision_hook,r.caption AS revision_caption,
          r.call_to_action AS revision_cta,r.hashtags AS revision_hashtags,r.slides AS revision_slides,
          r.source_bundle,r.evidence_hash,r.content_hash,
          a.decision AS approval_decision,a.reviewer,a.comment AS approval_comment,a.decided_at,
          rj.id AS render_job_id,rj.status AS render_job_status,rj.error_code AS render_error_code,rj.error_message AS render_error,rj.output_files AS render_output_files,
          pj.id AS publish_job_id,pj.status AS publish_job_status,pj.provider_status,pj.error_code AS publish_error_code,pj.error_message AS publish_error
        FROM social_post p
        LEFT JOIN social_post_revision r ON r.id=p.current_revision_id
        LEFT JOIN LATERAL (SELECT * FROM social_approval WHERE post_id=p.id ORDER BY decided_at DESC LIMIT 1) a ON true
        LEFT JOIN LATERAL (SELECT * FROM social_render_job WHERE post_id=p.id AND revision_id=p.current_revision_id ORDER BY created_at DESC LIMIT 1) rj ON true
        LEFT JOIN LATERAL (SELECT * FROM social_publish_job WHERE post_id=p.id AND revision_id=p.current_revision_id ORDER BY created_at DESC LIMIT 1) pj ON true
        ORDER BY COALESCE(p.planned_for,p.created_at::DATE) DESC,p.created_at DESC
        LIMIT 500
      `;
      const ids = rows.map(row => String(row.id));
      const events = ids.length ? await sql`SELECT post_id,event_type,created_at FROM social_event WHERE post_id IN ${sql(ids)} ORDER BY created_at DESC LIMIT 5000` : [];
      const eventsByPost = new Map<string, Array<Record<string, unknown>>>();
      for (const event of events) {
        const key = String(event.post_id); const list = eventsByPost.get(key) || [];
        if (list.length < 20) list.push(event as Record<string, unknown>);
        eventsByPost.set(key, list);
      }
      const posts = await Promise.all(rows.map(async row => {
        const files = ((row.render_files || row.render_output_files || []) as Array<{ key?: string }>).filter(file => file.key);
        const media = await Promise.all(files.map(async file => ({ key: file.key, url: await createBufferMediaUrl(String(file.key)) })));
        const lifecycleStatus = String(row.status);
        // A post is only marked published once the monitor has confirmed delivery with
        // Buffer. While that polling is blocked — a rate-limit cooldown, an exhausted
        // budget — a post can already be live on Instagram while this board still shows
        // it as scheduled, which is what made the board look wrong rather than stale.
        // Saying "awaiting confirmation" is honest about which of the two we know.
        const awaitingConfirmation = row.publish_job_status === "scheduled"
          && Boolean(row.scheduled_at) && new Date(String(row.scheduled_at)).getTime() < Date.now();
        const status = row.archived_at ? "archived" : row.publish_job_status === "blocked" ? "blocked" : (row.render_job_status === "failed" || row.publish_job_status === "failed") ? "failed" : awaitingConfirmation ? "awaiting_confirmation" : lifecycleStatus;
        const revisionId = row.revision_id ? String(row.revision_id) : null;
        return {
          id:String(row.id),status,lifecycle_status:lifecycleStatus,topic:String(row.topic),category:String(row.category),risk_level:String(row.risk_level),
          planned_for:row.planned_for,created_at:row.created_at,approved_at:row.approved_at,scheduled_at:row.scheduled_at,published_at:row.published_at,
          hook:row.revision_hook||row.hook,caption:row.revision_caption||row.caption,call_to_action:row.revision_cta||row.call_to_action,
          hashtags:row.revision_hashtags||row.hashtags,slides:row.revision_slides||row.slides,sources:row.source_bundle||[],revision_id:row.revision_id,
          approval_decision:row.approval_decision,reviewer:row.reviewer,approval_comment:row.approval_comment,decided_at:row.decided_at,
          render_job_id:row.render_job_id,render_job_status:row.render_job_status,render_error:row.render_error,
          publish_job_id:row.publish_job_id,publish_job_status:row.publish_job_status,publish_error:row.publish_error,
          archived_at:row.archived_at,archive_note:row.archive_note,buffer_post_id:row.buffer_post_id,instagram_id:row.instagram_id,awaiting_confirmation:awaitingConfirmation,
          action_token:boardActionToken(String(row.id),revisionId,reviewer),media,events:eventsByPost.get(String(row.id))||[],
        };
      }));
      const cooldown = await providerCooldownUntil();
      return send(res, 200, { generatedAt: new Date().toISOString(), reviewer, posts, providerCooldownUntil: cooldown ? cooldown.toISOString() : null });
    }

    if (req.method === "POST" && url.pathname === "/board/action") {
      const reviewer = await authenticatedReviewer(req.headers);
      if (!reviewer) return send(res, 403, { error: "Action requires the authenticated owner identity" });
      const input = BoardActionSchema.parse(await readJson(req));
      if (!verifyBoardActionToken(input.token, input.postId, input.revisionId, reviewer)) return send(res, 403, { error: "Action expired. Refresh the board and try again." });
      if(input.action==="approve"&&input.revisionId){const [reliability,editorial]=await Promise.all([assessStoredRevision(input.postId,input.revisionId),assessStoredEditorial(input.postId,input.revisionId)]);if(!reliability.passed)return send(res,422,{error:`Approval blocked: ${reliability.failures.join("; ")}`});if(!editorial.passed)return send(res,422,{error:`Approval blocked: ${editorial.failures.join("; ")}`});}
      if (input.action === "send_review") {
        const reviewed = await internalApi("POST", `/v1/posts/${input.postId}/request-review`, { expiresInMinutes: 240, dryRun: false });
        return send(res, reviewed.status, reviewed.ok ? { message: "Post sent to Review and Discord." } : { error: String(reviewed.result.error || "The post could not be sent to review") });
      }
      const result = await sql.begin(async tx => {
        const [post] = await tx`SELECT * FROM social_post WHERE id=${input.postId} FOR UPDATE`;
        if (!post || String(post.current_revision_id || "") !== String(input.revisionId || "")) return { status: 409, error: "The post revision changed. Refresh before acting." };
        const audit = async (eventType: string, details: Record<string, unknown> = {}) => tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${post.id},${eventType},${tx.json({ reviewer, source: "operations_board", ...details })})`;

        if (input.action === "approve" || input.action === "reject") {
          if (post.status !== "ready_for_review" || !input.revisionId) return { status: 409, error: "Only the exact revision currently awaiting review can be decided." };
          const [revision] = await tx`SELECT evidence_hash FROM social_post_revision WHERE id=${input.revisionId} AND post_id=${post.id}`;
          if (!revision) return { status: 409, error: "The current revision is unavailable." };
          const decision = input.action === "approve" ? "approved" : "rejected";
          let rejectionOutcome: { rewrite: boolean; round: number } | null = null;
          await tx`UPDATE social_review_token SET used_at=now() WHERE post_id=${post.id} AND revision_id=${input.revisionId} AND used_at IS NULL`;
          await tx`INSERT INTO social_approval(post_id,revision_id,evidence_hash,decision,reviewer,comment) VALUES(${post.id},${input.revisionId},${revision.evidence_hash},${decision},${reviewer},${input.comment || null})`;
          if (decision === "approved") await tx`UPDATE social_post SET status='approved',approved_revision_id=${input.revisionId},approved_at=now(),approved_by=${reviewer},updated_at=now() WHERE id=${post.id}`;
          else {
            await tx`UPDATE social_post SET status='rejected',approved_revision_id=NULL,approved_at=NULL,approved_by=NULL,updated_at=now() WHERE id=${post.id}`;
            rejectionOutcome = await applyRejection(tx, String(post.id), String(post.topic), post.planned_for, input.comment || null);
          }
          await audit(`post.${decision}`, { revisionId: input.revisionId, comment: input.comment || null });
          return { status: 200, message: decision === "approved" ? "Exact revision approved."
            : rejectionOutcome?.rewrite ? `Rejected. Your notes were sent back for a rewrite (round ${rejectionOutcome.round} of ${MAX_REVISION_ROUNDS}).`
            : "Post rejected. Without notes the topic is retired and its slot released." };
        }

        if (input.action === "reopen_review") {
          if (post.status !== "rejected" || !input.revisionId) return { status: 409, error: "Only a rejected current revision can be reopened." };
          await tx`UPDATE social_post SET status='ready_for_review',updated_at=now() WHERE id=${post.id}`;
          await audit("review.reopened", { revisionId: input.revisionId });
          return { status: 200, message: "Post returned to Review." };
        }

        if (input.action === "edit_revision") {
          if (!input.edit || !input.revisionId || !["rejected", "blocked", "failed"].includes(String(post.status))) return { status: 409, error: "Only an Attention item with a current revision can be edited." };
          const [revision] = await tx`SELECT * FROM social_post_revision WHERE id=${input.revisionId} AND post_id=${post.id}`;
          if (!revision) return { status: 409, error: "The current revision is unavailable." };
          const originalSlides = revision.slides as Array<Record<string, unknown>>;
          if (input.edit.slides.length !== originalSlides.length) return { status: 409, error: "The slide count changed. Refresh before editing." };
          const slides = originalSlides.map((slide, index) => ({ ...slide, title: input.edit!.slides[index].title.trim(), body: input.edit!.slides[index].body.trim() }));
          const edited = { topic: post.topic, hook: input.edit.hook.trim(), caption: input.edit.caption.trim(), call_to_action: input.edit.callToAction.trim(), slides };
          assertPublishableCopy(edited);
          const contentHash = hash({ hook: edited.hook, caption: edited.caption, callToAction: edited.call_to_action, hashtags: revision.hashtags, slides });
          if (contentHash === revision.content_hash) return { status: 409, error: "Nothing changed." };
          const [number] = await tx`SELECT COALESCE(max(revision_number),0)+1 AS value FROM social_post_revision WHERE post_id=${post.id}`;
          const [created] = await tx`INSERT INTO social_post_revision(post_id,revision_number,locale,template_version,hook,caption,call_to_action,hashtags,slides,alt_texts,source_bundle,evidence_hash,content_hash,model,prompt_version) VALUES(${post.id},${number.value},${revision.locale},${revision.template_version},${edited.hook},${edited.caption},${edited.call_to_action},${revision.hashtags},${tx.json(slides)},${revision.alt_texts},${revision.source_bundle},${revision.evidence_hash},${contentHash},'owner_board_edit',${revision.prompt_version}) RETURNING id`;
          await tx`UPDATE social_review_token SET used_at=now() WHERE post_id=${post.id} AND used_at IS NULL`;
          await tx`UPDATE social_post SET status='draft',current_revision_id=${created.id},approved_revision_id=NULL,approved_at=NULL,approved_by=NULL,rendered_at=NULL,render_files=NULL,scheduled_at=NULL,buffer_post_id=NULL,hook=${edited.hook},caption=${edited.caption},call_to_action=${edited.call_to_action},slides=${tx.json(slides)},updated_at=now() WHERE id=${post.id}`;
          await audit("revision.owner_edited", { previousRevisionId: input.revisionId, revisionId: created.id, contentHash });
          return { status: 200, message: "New draft revision saved. Open it in Drafts and send it to Review." };
        }

        if (input.action === "retry_render") {
          const [job] = await tx`SELECT * FROM social_render_job WHERE post_id=${post.id} AND revision_id=${post.approved_revision_id} AND status='failed' ORDER BY created_at DESC LIMIT 1 FOR UPDATE`;
          if (!job || post.current_revision_id !== post.approved_revision_id) return { status: 409, error: "No failed render exists for the current approved revision." };
          await tx`UPDATE social_render_job SET status='retrying',attempt_count=0,available_at=now(),lease_owner=NULL,lease_expires_at=NULL,error_code=NULL,error_message=NULL,updated_at=now() WHERE id=${job.id}`;
          await tx`UPDATE social_post SET status='render_queued',updated_at=now() WHERE id=${post.id}`;
          await audit("render.requeued", { jobId: job.id, revisionId: job.revision_id, manual: true });
          return { status: 200, message: "Render queued for retry." };
        }

        if (input.action === "retry_publish" || input.action === "force_retry_publish") {
          if (input.action === "force_retry_publish" && !input.acknowledged) return { status: 400, error: "Confirm that Buffer contains no matching post before retrying." };
          const allowedStatus = input.action === "force_retry_publish" ? "blocked" : "failed";
          const [job] = await tx`SELECT * FROM social_publish_job WHERE post_id=${post.id} AND revision_id=${post.approved_revision_id} AND status=${allowedStatus} ORDER BY created_at DESC LIMIT 1 FOR UPDATE`;
          if (!job || post.current_revision_id !== post.approved_revision_id) return { status: 409, error: "No safely retryable publish failure exists for the current approved revision." };
          let scheduledAt = new Date(String(job.scheduled_at));
          if (scheduledAt.getTime() < Date.now() + 15 * 60_000) scheduledAt = new Date(Math.ceil((Date.now() + 30 * 60_000) / (30 * 60_000)) * 30 * 60_000);
          await tx`UPDATE social_publish_job SET status='retrying',scheduled_at=${scheduledAt.toISOString()},available_at=now(),provider_post_id=NULL,provider_status=NULL,lease_owner=NULL,lease_expires_at=NULL,error_code=NULL,error_message=NULL,updated_at=now() WHERE id=${job.id}`;
          await tx`UPDATE social_post SET status='rendered',scheduled_at=${scheduledAt.toISOString()},buffer_post_id=NULL,updated_at=now() WHERE id=${post.id}`;
          await audit("publish.requeued_manual", { jobId: job.id, scheduledAt: scheduledAt.toISOString(), ambiguityAcknowledged: input.action === "force_retry_publish" });
          return { status: 200, message: `Publish retry queued for ${scheduledAt.toISOString()}.` };
        }

        if (input.action === "archive") {
          const attention = post.status === "rejected" || post.status === "blocked" || post.status === "failed" || (await tx`SELECT id FROM social_render_job WHERE post_id=${post.id} AND status='failed' LIMIT 1`).length > 0 || (await tx`SELECT id FROM social_publish_job WHERE post_id=${post.id} AND status IN ('failed','blocked') LIMIT 1`).length > 0;
          if (!attention || post.archived_at) return { status: 409, error: "Only an active Attention item can be archived." };
          await tx`UPDATE social_post SET archived_at=now(),archived_by=${reviewer},archive_note=${input.comment || null},updated_at=now() WHERE id=${post.id}`;
          await audit("attention.archived", { comment: input.comment || null });
          return { status: 200, message: "Attention item archived. It remains recoverable." };
        }

        if (!post.archived_at) return { status: 409, error: "This post is not archived." };
        await tx`UPDATE social_post SET archived_at=NULL,archived_by=NULL,archive_note=NULL,updated_at=now() WHERE id=${post.id}`;
        await audit("attention.restored");
        return { status: 200, message: "Post restored to its operational column." };
      });
      return send(res, result.status, result.error ? { error: result.error } : { message: result.message });
    }

    const reviewMatch = url.pathname.match(/^\/review\/([A-Za-z0-9_-]{32,})$/);
    if (req.method === "GET" && reviewMatch) {
      const reviewer = await authenticatedReviewer(req.headers);
      if (!reviewer) return sendHtml(res, 403, "<h1>Approval requires an authenticated owner identity</h1>");
      const tokenHash = hash(reviewMatch[1]);
      const [row] = await sql`
        SELECT t.expires_at, t.used_at, p.*, r.id AS revision_id, r.hook AS revision_hook,
               r.caption AS revision_caption, r.call_to_action AS revision_cta, r.hashtags AS revision_hashtags,
               r.slides AS revision_slides, r.alt_texts,
               r.source_bundle, r.evidence_hash
        FROM social_review_token t
        JOIN social_post p ON p.id = t.post_id
        JOIN social_post_revision r ON r.id = t.revision_id
        WHERE t.token_hash = ${tokenHash}
        LIMIT 1
      `;
      if (!row || row.used_at || new Date(String(row.expires_at)) <= new Date()) return sendHtml(res, 410, "<h1>Review link expired or already used</h1>");
      return sendHtml(res, 200, reviewPage(row as Record<string, unknown>, {
        hook: row.revision_hook, caption: row.revision_caption, call_to_action: row.revision_cta,
        hashtags: row.revision_hashtags, slides: row.revision_slides,
        alt_texts: row.alt_texts, source_bundle: row.source_bundle, evidence_hash: row.evidence_hash,
      }, reviewMatch[1], reviewer));
    }

    const decisionMatch = url.pathname.match(/^\/review\/([A-Za-z0-9_-]{32,})\/decision$/);
    if (req.method === "POST" && decisionMatch) {
      const reviewer = await authenticatedReviewer(req.headers);
      if (!reviewer) return sendHtml(res, 403, "<h1>Approval requires an authenticated owner identity</h1>");
      const form = await readForm(req);
      const decision = z.enum(["approved", "rejected"]).parse(form.get("decision"));
      const comment = z.string().max(500).parse(form.get("comment") || "");
      const tokenHash = hash(decisionMatch[1]);
      if(decision==="approved"){
        const [candidate]=await sql`SELECT post_id,revision_id FROM social_review_token WHERE token_hash=${tokenHash} AND used_at IS NULL AND expires_at>now()`;
        if(candidate){const [reliability,editorial]=await Promise.all([assessStoredRevision(String(candidate.post_id),String(candidate.revision_id)),assessStoredEditorial(String(candidate.post_id),String(candidate.revision_id))]);if(!reliability.passed)return sendHtml(res,422,`<h1>Approval blocked</h1><p>${escapeHtml(reliability.failures.join("; "))}</p>`);if(!editorial.passed)return sendHtml(res,422,`<h1>Approval blocked</h1><p>${escapeHtml(editorial.failures.join("; "))}</p>`);}
      }
      const result = await sql.begin(async (tx) => {
        const [token] = await tx`
          SELECT * FROM social_review_token
          WHERE token_hash = ${tokenHash} AND used_at IS NULL AND expires_at > now()
          FOR UPDATE
        `;
        if (!token) return null;
        const [post] = await tx`SELECT current_revision_id,topic,planned_for FROM social_post WHERE id = ${token.post_id} FOR UPDATE`;
        const [revision] = await tx`SELECT evidence_hash FROM social_post_revision WHERE id = ${token.revision_id}`;
        if (!post || !revision || post.current_revision_id !== token.revision_id || revision.evidence_hash !== token.evidence_hash) return "changed";
        await tx`UPDATE social_review_token SET used_at = now() WHERE id = ${token.id}`;
        await tx`INSERT INTO social_approval (post_id, revision_id, evidence_hash, decision, reviewer, comment) VALUES (${token.post_id}, ${token.revision_id}, ${token.evidence_hash}, ${decision}, ${String(reviewer)}, ${comment || null})`;
        if (decision === "approved") await tx`UPDATE social_post SET status = 'approved', approved_revision_id = ${token.revision_id}, approved_at = now(), approved_by = ${String(reviewer)}, updated_at = now() WHERE id = ${token.post_id}`;
        else {
          await tx`UPDATE social_post SET status = 'rejected', approved_revision_id = NULL, approved_at = NULL, approved_by = NULL, updated_at = now() WHERE id = ${token.post_id}`;
          await applyRejection(tx, String(token.post_id), String(post.topic), post.planned_for, comment || null);
        }
        await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${token.post_id}, ${`post.${decision}`}, ${tx.json({ revisionId: token.revision_id, reviewer: String(reviewer) })})`;
        return decision;
      });
      if (!result) return sendHtml(res, 410, "<h1>Review link expired or already used</h1>");
      if (result === "changed") return sendHtml(res, 409, "<h1>This revision or its evidence changed. Approval was refused.</h1>");
      return sendHtml(res, 200, `<h1>${result === "approved" ? "Approved" : "Rejected"}</h1><p>The exact reviewed revision was recorded. This link cannot be reused.</p>`);
    }

    if (req.headers.authorization !== `Bearer ${apiToken}`) return send(res, 401, { error: "Unauthorized" });

    // Rebuilds the rolling window from the brief bank so "today" is always inside the
    // plan. Without this the window silently ages out and daily planning starts
    // rejecting the current date. The builder is the single source of layout rules, so
    // it is invoked rather than reimplemented here.
    // Ingests every canonical source referenced by the brief bank into the local corpus.
    //
    // Evidence research matches against `document`/`chunk` and requires the brief's own
    // canonical URL to be present, so a brief whose source was never ingested is held no
    // matter how good it is. This keeps the corpus in step with the bank; without it,
    // adding a brief silently produces a held slot.
    if (req.method === "POST" && url.pathname === "/v1/corpus/ingest-briefs") {
      const bankRaw = await readFile(new URL("../../../plans/brief-bank.json", import.meta.url), "utf8");
      const bank = JSON.parse(bankRaw) as { briefs: Array<{ source: { canonicalUrl: string; authority: string } }> };
      // The recurring calendar rules reference sources of their own, and those were never
      // on this list — only the brief bank was. So a rule pointing at a perfectly good
      // Finanças page produced a blocked concept every quarter, for the same reason the
      // comment above describes: the URL was never ingested, so nothing could verify
      // against it. Quarterly IVA, World Savings Day and Portugal Day had all been sitting
      // blocked as "no verified official document" while their sources existed and were
      // reachable.
      const calendarRules = await sql`SELECT DISTINCT source_url, title FROM social_editorial_rule WHERE source_url IS NOT NULL AND source_url <> ''`;
      const targets = [...new Map([
        ...bank.briefs.map(b => [b.source.canonicalUrl, b.source.authority] as [string, string]),
        ...calendarRules.map(rule => [String(rule.source_url), String(rule.title || "Official source")] as [string, string]),
      ]).entries()];
      const force = Boolean((await readJson(req).catch(() => ({})) as { force?: boolean }).force);

      const results: Array<Record<string, unknown>> = [];
      for (const [canonicalUrl, authority] of targets) {
       try {
        if (!force) {
          const [fresh] = await sql`SELECT id FROM document WHERE source_url=${canonicalUrl} AND verified_still_available=true AND last_verified_at > now() - INTERVAL '24 hours'`;
          if (fresh) { results.push({ url: canonicalUrl, state: "fresh" }); continue; }
        }
        const page = await fetchPage(canonicalUrl);
        let text = page.html ? visibleText(page.html) : "";
        let title = page.html ? pageTitle(page.html, canonicalUrl) : canonicalUrl;
        let via = "http";

        // Many Portuguese official sites render client-side or refuse non-browser
        // clients, so a plain fetch returns 200 with no text, or 403. The renderer
        // already runs Chromium for carousels; reuse it to read those pages rather than
        // discarding perfectly good official sources.
        if (page.status === 403 || page.status === 0 || text.length < 400) {
          const rendered = await fetchViaRenderer(canonicalUrl);
          if (rendered && rendered.text.length > text.length) {
            text = rendered.text;
            title = rendered.title || title;
            via = "chromium";
          }
        }

        // A page that fetched but still yielded almost no text is unusable as evidence
        // and must not be stored as if it were, or briefs citing it verify against nothing.
        if (text.length < 400) {
          results.push({ url: canonicalUrl, state: "unusable", status: page.status, length: text.length, error: page.error });
          continue;
        }
        const contentHash = hash(text);
        const [document] = await sql`
          INSERT INTO document (source_tier, source_url, source_authority, title, original_lang, content_hash,
                                fetched_at, last_verified_at, freshness_confidence, last_upstream_check_at, verified_still_available)
          VALUES ('official', ${canonicalUrl}, ${authority}, ${title}, 'pt', ${contentHash},
                  now(), now(), 'fresh', now(), true)
          ON CONFLICT (source_url) DO UPDATE SET
            title=excluded.title, content_hash=excluded.content_hash, last_verified_at=now(),
            freshness_confidence='fresh', last_upstream_check_at=now(), verified_still_available=true
          RETURNING id
        `;
        const chunks = chunkText(text);
        await sql`DELETE FROM chunk WHERE document_id=${document.id}`;
        for (const [index, chunk] of chunks.entries()) {
          await sql`INSERT INTO chunk (document_id, chunk_index, text, token_count, lang, content_hash)
                    VALUES (${document.id}, ${index}, ${chunk}, ${Math.ceil(chunk.length / 4)}, 'pt', ${hash(chunk)})`;
        }
        results.push({ url: canonicalUrl, state: "ingested", via, chunks: chunks.length, characters: text.length });
       } catch (error) {
        // One unreachable or malformed source must not abort ingestion of the rest;
        // otherwise a single bad page holds every brief that follows it.
        results.push({ url: canonicalUrl, state: "error", error: String((error as Error).message ?? error).slice(0, 200) });
       }
      }
      const ingested = results.filter(r => r.state === "ingested").length;
      const unusable = results.filter(r => r.state === "unusable").length;
      await sql`INSERT INTO social_event (event_type, payload) VALUES ('corpus.briefs_ingested', ${sql.json({ targets: targets.length, ingested, unusable })})`;
      return send(res, 200, { targets: targets.length, ingested, unusable, results });
    }

    if (req.method === "POST" && url.pathname === "/v1/planning/rebuild") {
      const projectRoot = new URL("../../../", import.meta.url).pathname;
      const built = await new Promise<{ code: number; output: string }>(resolve => {
        const child = spawn(process.execPath, ["scripts/build-90-day-plan.mjs", "--days", "90"], { cwd: projectRoot });
        let output = "";
        child.stdout.on("data", chunk => { output += String(chunk); });
        child.stderr.on("data", chunk => { output += String(chunk); });
        child.on("close", code => resolve({ code: code ?? 1, output }));
        child.on("error", error => resolve({ code: 1, output: String(error) }));
      });
      if (built.code !== 0) return send(res, 500, { error: "Plan rebuild failed", output: built.output.slice(0, 800) });
      invalidatePlanCache();
      const plan = await loadAnnualPlan();
      await sql`INSERT INTO social_event (event_type, payload) VALUES ('planning.rebuilt', ${sql.json({ window: plan.window, rows: plan.rows.length })})`;
      return send(res, 200, { window: plan.window, rows: plan.rows.length, output: built.output.trim().split("\n").slice(0, 6) });
    }

    if (req.method === "POST" && url.pathname === "/v1/planning/sync") {
      const config = await loadEditorialCalendar();
      const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
      const expanded = expandCalendar(config, today, 400);
      let eligible = 0;
      let blocked = 0;
      for (const rule of config.rules) {
        await sql`
          INSERT INTO social_editorial_rule (slug, title, category, audience, risk_level, recurrence, campaign, source_url, source_label, verification_cadence_days, config_version)
          VALUES (${rule.slug}, ${rule.title}, ${rule.category}, ${rule.audience}, ${rule.riskLevel}, ${sql.json({ kind: rule.kind, dates: rule.dates ?? [], months: rule.months ?? [], day: rule.day ?? null })}, ${sql.json(rule.campaign)}, ${rule.sourceUrl}, ${rule.sourceLabel}, ${rule.verificationCadenceDays}, ${config.version})
          ON CONFLICT (slug) DO UPDATE SET title=excluded.title, category=excluded.category, audience=excluded.audience, risk_level=excluded.risk_level, recurrence=excluded.recurrence, campaign=excluded.campaign, source_url=excluded.source_url, source_label=excluded.source_label, verification_cadence_days=excluded.verification_cadence_days, config_version=excluded.config_version, updated_at=now()
        `;
      }
      for (const item of expanded) {
        const [rule] = await sql`SELECT id FROM social_editorial_rule WHERE slug=${item.slug}`;
        const [document] = await sql`
          SELECT id FROM document
          WHERE verified_still_available=true AND freshness_confidence='fresh' AND source_tier='official'
            AND regexp_replace(source_url, '/$', '')=regexp_replace(${item.sourceUrl}, '/$', '')
          ORDER BY COALESCE(last_verified_at, fetched_at) DESC LIMIT 1
        `;
        const occurrenceStatus = document ? "verified" : "needs_verification";
        const [occurrence] = await sql`
          INSERT INTO social_editorial_occurrence (rule_id, due_date, source_verified_at, status)
          VALUES (${rule.id}, ${item.dueDate}, ${document ? new Date().toISOString() : null}, ${occurrenceStatus})
          ON CONFLICT (rule_id, due_date) DO UPDATE SET status=excluded.status, source_verified_at=COALESCE(excluded.source_verified_at, social_editorial_occurrence.source_verified_at), updated_at=now()
          RETURNING id
        `;
        const conceptStatus = document ? "eligible" : "blocked";
        await sql`
          INSERT INTO social_post_concept (document_id, topic, category, risk_level, priority, timeliness, fingerprint, status, planned_for, occurrence_id, campaign_stage, reason, expires_at, repeat_allowed, score)
          VALUES (${document?.id ?? null}, ${`${item.title} — ${item.campaignStage}`}, ${item.category}, ${item.riskLevel}, ${item.score}, 'deadline', ${item.fingerprint}, ${conceptStatus}, ${item.publishDate}, ${occurrence.id}, ${item.campaignStage}, ${`Recurring obligation due ${item.dueDate}; ${item.audience}`}, ${`${item.dueDate}T23:59:59Z`}, true, ${item.score})
          ON CONFLICT (fingerprint) DO UPDATE SET document_id=excluded.document_id, status=CASE WHEN social_post_concept.status IN ('used','planned') THEN social_post_concept.status WHEN excluded.document_id IS NOT NULL THEN 'eligible' ELSE 'blocked' END, blocked_kind=CASE WHEN excluded.document_id IS NULL THEN 'no_source' ELSE NULL END, blocked_reason=CASE WHEN excluded.document_id IS NULL THEN 'no verified official document matches the rule source URL yet' ELSE NULL END, planned_for=excluded.planned_for, reason=excluded.reason, expires_at=excluded.expires_at, score=excluded.score, updated_at=now()
        `;
        if (document) eligible++; else blocked++;
      }
      await sql`INSERT INTO social_event (event_type, payload) VALUES ('planning.calendar_synced', ${sql.json({ rules: config.rules.length, campaigns: expanded.length, eligible, blocked, configVersion: config.version })})`;
      return send(res, 200, { rules: config.rules.length, campaigns: expanded.length, eligible, blocked });
    }

    if (req.method === "POST" && url.pathname === "/v1/planning/daily") {
      const { date, capacity } = PlanningSchema.parse(await readJson(req));
      const planningDate = date || new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
      // A concept is only ever looked at on its own planned_for date. Anything that was
      // planned but not reached — five slots a day against a larger bank, or a day where
      // generation ran short — was simply never seen again, still carrying verified
      // evidence. That is the quiet half of how the bank drains: not topics rejected, but
      // topics left behind. Carry those forward. The plan slot stays where it is, because
      // generation reads it only for the brief, and the brief is still the right brief.
      // Only when planning today. This endpoint is also called for the next fortnight, to
      // build the window ahead — and carrying forward on those runs walked the entire bank
      // one day further into the future on each call, until sixty-five topics with live
      // evidence were parked on a date two weeks out and today had nothing to generate
      // from. The day reported "no eligible topic remained in the bank" while the bank was
      // full. Sweeping up what a past day did not reach is a thing you do for the day you
      // are actually living in.
      const carried = planningDate !== lisbonDate(new Date()) ? [] : await sql`
        UPDATE social_post_concept c SET planned_for=${planningDate}, updated_at=now()
        WHERE c.status='planned' AND c.planned_for < ${planningDate}
          AND EXISTS (SELECT 1 FROM social_topic_evidence_bundle b
                      WHERE b.id=c.evidence_bundle_id AND b.verification_state='verified' AND b.expires_at>now())
          AND NOT EXISTS (SELECT 1 FROM social_post p WHERE p.topic=c.topic AND p.status NOT IN ('blocked','rejected','failed'))
        RETURNING c.id, c.topic`;
      if (carried.length) {
        await sql`INSERT INTO social_event (event_type, payload) VALUES ('planning.concepts_carried_forward', ${sql.json({ planningDate, carried: carried.length, topics: carried.slice(0, 10).map(row => String(row.topic)) })})`;
      }

      const plan = await loadAnnualPlan();
      const selected = rowsForDate(plan, planningDate).slice(0, capacity);
      if (!selected.length) return send(res, 409, { error: "The requested date is outside the approved rolling annual plan" });
      await sql`UPDATE social_editorial_plan_slot SET status='replaced',updated_at=now() WHERE publish_date=${planningDate} AND plan_version<>${plan.version} AND status IN ('planned','researching','evidence_ready','held')`;
      // Retiring by version only works when the version moved. Cutting the day from five
      // posts to two changed the shape of the plan without changing its number, so the
      // upsert refreshed slots one and two and left three, four and five sitting there —
      // the day still had five slots and the old times. Anything beyond what today's plan
      // asks for is retired on its slot number too, whatever version wrote it.
      await sql`UPDATE social_editorial_plan_slot SET status='replaced',updated_at=now() WHERE publish_date=${planningDate} AND slot_number>${selected.length} AND status IN ('planned','researching','evidence_ready','held')`;
      const planned = [];
      for (const item of selected) {
        const derivedIdentity = editorialIdentity(item);
        const identity = { subjectFamily:item.brief.subjectFamily||derivedIdentity.subjectFamily,userQuestion:item.brief.userQuestion||derivedIdentity.userQuestion,contentIntent:item.brief.contentIntent||derivedIdentity.contentIntent,occurrenceKey:item.brief.occurrenceKey||derivedIdentity.occurrenceKey,campaignStage:item.brief.campaignStage||derivedIdentity.campaignStage };
        const [slot] = await sql`
          INSERT INTO social_editorial_plan_slot (plan_version,publish_date,publish_time,slot_number,pillar,angle,topic,audience,risk_level,timing_class,reserve_kind,search_terms,required_authority,occurrence_number,subject_family,user_question,content_intent,occurrence_key,campaign_stage,brief)
          VALUES (${plan.version},${item.date},${item.time},${item.slot},${item.pillar},${item.angle},${item.title},${item.audience},${item.risk},${item.timing},${item.reserve},${sql.json(item.evidenceTerms.split("|").map(v=>v.trim()).filter(Boolean))},${item.authority},${item.occurrence},${identity.subjectFamily},${identity.userQuestion},${identity.contentIntent},${identity.occurrenceKey},${identity.campaignStage},${sql.json(item.brief)})
          ON CONFLICT (plan_version,publish_date,slot_number) DO UPDATE SET publish_time=excluded.publish_time,topic=excluded.topic,audience=excluded.audience,risk_level=excluded.risk_level,timing_class=excluded.timing_class,search_terms=excluded.search_terms,required_authority=excluded.required_authority,subject_family=excluded.subject_family,user_question=excluded.user_question,content_intent=excluded.content_intent,occurrence_key=excluded.occurrence_key,campaign_stage=excluded.campaign_stage,brief=excluded.brief,updated_at=now()
          RETURNING *
        `;
        planned.push(slot);
      }
      await sql`INSERT INTO social_event (event_type, payload) VALUES ('planning.topic_led_day_loaded', ${sql.json({ planningDate, planVersion: plan.version, slots: planned.map(x=>({ id:x.id, topic:x.topic, time:x.publish_time })) })})`;
      return send(res, 200, { date: planningDate, capacity, planVersion: plan.version, planned });
    }

    if (req.method === "POST" && url.pathname === "/v1/evidence/research") {
      const { date } = ResearchSchema.parse(await readJson(req));
      const planningDate = date || new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
      const slots = await sql`SELECT * FROM social_editorial_plan_slot WHERE publish_date=${planningDate} AND plan_version=(SELECT max(plan_version) FROM social_editorial_plan_slot WHERE publish_date=${planningDate}) AND status IN ('planned','researching','evidence_ready','held') ORDER BY slot_number`;
      const results=[];
      for (const slot of slots) {
        if(slot.status==='evidence_ready'){
          const [currentBundle]=await sql`SELECT id FROM social_topic_evidence_bundle WHERE plan_slot_id=${slot.id} AND verification_state='verified' AND expires_at>now() ORDER BY verified_at DESC LIMIT 1`;
          if(currentBundle){results.push({slotId:slot.id,topic:slot.topic,state:'already_verified',bundleId:currentBundle.id});continue;}
        }
        if(slot.timing_class==='must_reverify'){
          await sql`UPDATE social_editorial_plan_slot SET status='held',updated_at=now() WHERE id=${slot.id}`;
          results.push({slotId:slot.id,topic:slot.topic,state:'held',reason:'official_date_requires_reverification'});
          continue;
        }
        const factCard=slot.timing_class==='evergreen'?await findFactCard(String(slot.topic)):null;
        const terms = (slot.search_terms as string[]).map(v=>v.trim()).filter(v=>v.length >= 3);
        const pattern = terms.map(v=>v.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|");
        const candidates = pattern ? await sql`
          SELECT d.id,d.title,d.source_url,d.source_authority,d.source_tier,d.original_lang,d.content_hash,d.fetched_at,d.last_verified_at,
                 array_agg(c.text ORDER BY c.chunk_index) FILTER (WHERE c.text ~* ${pattern}) AS excerpts
          FROM document d JOIN chunk c ON c.document_id=d.id AND c.vault_doc_id IS NULL
          WHERE d.verified_still_available=true AND d.freshness_confidence='fresh' AND d.source_tier IN ('official','professional','editorial')
            AND (d.title ~* ${pattern} OR c.text ~* ${pattern})
          GROUP BY d.id
          ORDER BY CASE d.source_tier WHEN 'official' THEN 0 WHEN 'professional' THEN 1 ELSE 2 END, COALESCE(d.last_verified_at,d.fetched_at) DESC
          LIMIT 40
        ` : [];
        const normalizedTerms=terms.map(v=>v.toLocaleLowerCase("pt"));
        const genericAuthorityTerms=new Set(["sns","aima","irs","iva"]); const substantiveTerms=normalizedTerms.filter(term=>!genericAuthorityTerms.has(term));
        const canonicalSource=/^https:\/\//.test(String(slot.required_authority))?String(slot.required_authority).replace(/\/$/,""):null;
        const scored: any[]=(candidates as any[]).map(source=>{const title=String(source.title).toLocaleLowerCase("pt");const body=(source.excerpts as string[]).join(" ").toLocaleLowerCase("pt");const matched=normalizedTerms.filter(term=>exactTermMatch(title,term)||exactTermMatch(body,term));const substantiveMatched=matched.filter(term=>substantiveTerms.includes(term));const score=matched.reduce((sum,term)=>sum+(exactTermMatch(title,term)?6:2),0);return {...source,relevance_score:score,matched_terms:matched,substantive_matched:substantiveMatched};}).filter(source=>source.relevance_score>=2&&source.substantive_matched.length>0&&sourceDomainAllowed(normalizedTerms,source.source_url)&&sourceScopeAllowed(slot.topic,source.title)).sort((a,b)=>Number(Boolean(canonicalSource&&String(b.source_url).replace(/\/$/,"")===canonicalSource))-Number(Boolean(canonicalSource&&String(a.source_url).replace(/\/$/,"")===canonicalSource))||b.relevance_score-a.relevance_score||String(b.last_verified_at||b.fetched_at).localeCompare(String(a.last_verified_at||a.fetched_at)));
        const sources: any[] = []; const seenHosts=new Set<string>();
        for(const source of scored){const host=new URL(String(source.source_url)).hostname.replace(/^www\d?\./,"");if(seenHosts.has(host))continue;sources.push(source);seenHosts.add(host);if(sources.length>=3)break;}
        const needsOfficial = slot.risk_level === 'high' || slot.timing_class !== 'evergreen';
        const minimumRelevance = slot.risk_level === 'high' || slot.timing_class !== 'evergreen' ? 6 : slot.risk_level === 'medium' ? 4 : 2;
        const includesCanonical=!canonicalSource||sources.some(source=>String(source.source_url).replace(/\/$/,"")===canonicalSource);
        const valid = (factCard ? sources.length >= 1 : sources.length >= 1 && sources[0].relevance_score>=minimumRelevance) && includesCanonical && (!needsOfficial || sources.some(s=>s.source_tier==='official'));
        if (!valid) { await sql`UPDATE social_editorial_plan_slot SET status='held',updated_at=now() WHERE id=${slot.id}`; results.push({slotId:slot.id,topic:slot.topic,state:'held',sources:sources.length}); continue; }
        const normalized=sources.map((s,index)=>({documentId:s.id,url:index===0&&factCard?factCard.sourceUrl:s.source_url,title:index===0&&factCard?factCard.sourceTitle:s.title,publisher:index===0&&factCard?factCard.authority:s.source_authority,tier:s.source_tier,locale:s.original_lang,retrievedAt:s.last_verified_at||s.fetched_at,contentHash:index===0&&factCard?hash(factCard):s.content_hash,relevanceScore:factCard&&index===0?100:s.relevance_score,matchedTerms:factCard&&index===0?factCard.match:s.matched_terms,excerpts:index===0&&factCard?factCard.facts:(s.excerpts as string[]).slice(0,6),deterministicFactCard:Boolean(factCard&&index===0)}));
        const bundleHash=hash(normalized); const freshnessDays=slot.risk_level==='high'?7:slot.risk_level==='medium'?30:90;
        const [bundle]=await sql`INSERT INTO social_topic_evidence_bundle (plan_slot_id,bundle_hash,sources,verification_state,verified_at,expires_at) VALUES (${slot.id},${bundleHash},${sql.json(normalized)},'verified',now(),now()+(${freshnessDays}::STRING||' days')::INTERVAL) ON CONFLICT (plan_slot_id,bundle_hash) DO UPDATE SET verification_state='verified',verified_at=now(),expires_at=excluded.expires_at RETURNING *`;
        const primary=normalized.find(s=>s.tier==='official')||normalized[0]; const fingerprint=`plan:${slot.plan_version}:${planningDate}:${slot.slot_number}`;
        const [concept]=await sql`INSERT INTO social_post_concept (document_id,topic,category,risk_level,priority,timeliness,fingerprint,status,planned_for,reason,repeat_allowed,score,plan_slot_id,evidence_bundle_id,subject_family,user_question,content_intent,occurrence_key) VALUES (${primary.documentId},${slot.topic},${slot.pillar},${slot.risk_level},${100-Number(slot.slot_number)},${slot.timing_class},${fingerprint},'planned',${planningDate},${`Predetermined annual-plan topic for ${slot.audience}`},true,${100-Number(slot.slot_number)},${slot.id},${bundle.id},${slot.subject_family},${slot.user_question},${slot.content_intent},${slot.occurrence_key}) ON CONFLICT (fingerprint) DO UPDATE SET document_id=excluded.document_id,evidence_bundle_id=excluded.evidence_bundle_id,subject_family=excluded.subject_family,user_question=excluded.user_question,content_intent=excluded.content_intent,occurrence_key=excluded.occurrence_key,status=CASE WHEN social_post_concept.status='used' THEN 'used' ELSE 'planned' END,updated_at=now() RETURNING *`;
        await sql`UPDATE social_editorial_plan_slot SET status='evidence_ready',updated_at=now() WHERE id=${slot.id}`;
        results.push({slotId:slot.id,conceptId:concept.id,topic:slot.topic,state:'verified',sources:normalized.map(source=>({title:source.title,url:source.url,tier:source.tier,relevanceScore:source.relevanceScore,matchedTerms:source.matchedTerms})),bundleHash});
      }
      return send(res,200,{date:planningDate,results});
    }

    if (req.method === "GET" && url.pathname === "/v1/planning/queue") {
      const requestedDate = url.searchParams.get("date");
      const planningDate = requestedDate || lisbonDate(new Date());
      if (!/^\d{4}-\d{2}-\d{2}$/.test(planningDate)) return send(res, 400, { error: "date must be YYYY-MM-DD" });
      // A concept planned for today and not used today is still a good concept tomorrow,
      // so the queue matches on or before the date rather than exactly. Matching exactly
      // meant recovery could never work ahead: concepts are only ever dated today, so the
      // queue for tomorrow was always empty and the day arrived with nothing written.
      // Ordered oldest first, so the ones that have been waiting go first.
      const rows = await sql`SELECT c.* FROM social_post_concept c JOIN social_topic_evidence_bundle b ON b.id=c.evidence_bundle_id AND b.verification_state='verified' AND b.expires_at>now() WHERE c.status='planned' AND c.planned_for <= ${planningDate} ORDER BY c.planned_for, c.score DESC LIMIT 5`;
      return send(res, 200, { date: planningDate, concepts: rows });
    }

    if(req.method==="POST"&&url.pathname==="/v1/official-sources/snapshot"){
      const input=OfficialSnapshotSchema.parse(await readJson(req));
      const canonical=new URL(input.url);canonical.hash="";canonical.search="";const canonicalUrl=canonical.toString();
      if(!isOfficialUrl(canonicalUrl))return send(res,400,{error:"Only canonical official-authority URLs can be monitored"});
      const pageTitle=(input.body.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]||`Official page changed: ${canonical.hostname}`).replace(/\s+/g," ").trim().slice(0,300);
      const normalized=input.body.replace(/<!--[\s\S]*?-->/g,"").replace(/<script[\s\S]*?<\/script>/gi,"").replace(/<style[\s\S]*?<\/style>/gi,"").replace(/<[^>]+>/g," ").replace(/&nbsp;|&#160;/gi," ").replace(/&amp;/gi,"&").replace(/\s+/g," ").trim();
      if(input.httpStatus<200||input.httpStatus>=400||normalized.length<100)return send(res,422,{error:"Official page fetch is unusable",httpStatus:input.httpStatus,contentLength:normalized.length});
      const contentHash=hash(normalized);const [previous]=await sql`SELECT content_hash FROM social_official_source_snapshot WHERE canonical_url=${canonicalUrl} ORDER BY fetched_at DESC LIMIT 1`;
      const changed=Boolean(previous&&previous.content_hash!==contentHash);
      await sql`INSERT INTO social_official_source_snapshot (canonical_url,http_status,content_hash,content_length,changed,fetched_at) VALUES (${canonicalUrl},${input.httpStatus},${contentHash},${normalized.length},${changed},${input.fetchedAt||new Date().toISOString()}) ON CONFLICT (canonical_url,content_hash) DO UPDATE SET fetched_at=excluded.fetched_at,http_status=excluded.http_status,content_length=excluded.content_length`;
      if(changed){await sql`INSERT INTO social_discovery (canonical_url,title,publisher,locale,content_hash,source_kind,category,risk_level,raw_metadata) VALUES (${canonicalUrl},${pageTitle},${canonical.hostname},'pt',${contentHash},'official_notice',${classifyTopic(pageTitle)},'high',${sql.json({monitor:'canonical_page',previousHash:previous.content_hash})}) ON CONFLICT (canonical_url,content_hash) DO NOTHING`;}
      await sql`INSERT INTO social_event (event_type,payload) VALUES ('official_source.checked',${sql.json({canonicalUrl,contentHash,changed,httpStatus:input.httpStatus,contentLength:normalized.length})})`;
      return send(res,200,{canonicalUrl,contentHash,changed,baseline:!previous});
    }

    if(req.method==="GET"&&url.pathname==="/v1/reserve/eligible"){
      const cards=await loadEvergreenReserve();const urls=[...new Set(cards.map(card=>card.sourcePolicy.canonicalUrl))];
      const documents=await sql`SELECT DISTINCT ON (canonical_url) canonical_url AS "canonicalUrl",verified_at AS "verifiedAt",visible_text FROM social_reserve_evidence WHERE canonical_url IN ${sql(urls)} AND available=true ORDER BY canonical_url,verified_at DESC`;
      const recent=await sql`SELECT subject_family AS "subjectFamily",user_question AS "userQuestion",audience,content_intent AS "contentIntent",created_at AS "usedAt" FROM social_post WHERE created_at>now()-INTERVAL '90 days' AND status NOT IN ('blocked','rejected','failed')`;
      const eligible=eligibleReserveCards(cards,documents.map(row=>({canonicalUrl:String(row.canonicalUrl),verifiedAt:String(row.verifiedAt),visibleText:String(row.visible_text)})),recent.map(row=>({subjectFamily:String(row.subjectFamily||""),userQuestion:String(row.userQuestion||""),audience:String(row.audience||""),contentIntent:String(row.contentIntent||""),usedAt:String(row.usedAt)})));
      return send(res,200,{total:cards.length,eligible:eligible.length,held:cards.length-eligible.length,cards:eligible});
    }

    if(req.method==="POST"&&url.pathname==="/v1/reserve/verify"){
      return send(res, 200, await verifyReserveEvidence(z.object({limit:z.number().int().min(1).max(200).default(40)}).parse(await readJson(req)).limit));
    }

    if(req.method==="POST"&&url.pathname==="/v1/reserve/replace-held"){
      const {date}=ReportSchema.parse(await readJson(req));const day=date||lisbonDate(new Date());const heldSlots=await sql`SELECT * FROM social_editorial_plan_slot s WHERE s.publish_date=${day} AND s.plan_version=(SELECT max(current_slot.plan_version) FROM social_editorial_plan_slot current_slot WHERE current_slot.publish_date=s.publish_date) AND s.status='held' ORDER BY s.slot_number`;
      const cards=await loadEvergreenReserve();const urls=[...new Set(cards.map(card=>card.sourcePolicy.canonicalUrl))];const evidence=await sql`SELECT DISTINCT ON (canonical_url) canonical_url AS "canonicalUrl",verified_at AS "verifiedAt",document_id,title,authority,content_hash,visible_text FROM social_reserve_evidence WHERE canonical_url IN ${sql(urls)} AND available=true AND document_id IS NOT NULL ORDER BY canonical_url,verified_at DESC`;const recent=await sql`SELECT subject_family AS "subjectFamily",user_question AS "userQuestion",audience,content_intent AS "contentIntent",created_at AS "usedAt" FROM social_post WHERE created_at>now()-INTERVAL '90 days' AND status NOT IN ('blocked','rejected','failed')`;let eligible=eligibleReserveCards(cards,evidence.map(row=>({canonicalUrl:String(row.canonicalUrl),verifiedAt:String(row.verifiedAt),visibleText:String(row.visible_text)})),recent.map(row=>({subjectFamily:String(row.subjectFamily||""),userQuestion:String(row.userQuestion||""),audience:String(row.audience||""),contentIntent:String(row.contentIntent||""),usedAt:String(row.usedAt)})));const replacements=[];
      for(const slot of heldSlots){
        const attemptedRows=await sql`SELECT topic FROM social_post_concept WHERE plan_slot_id=${slot.id}`;const attemptedTopics=new Set(attemptedRows.map(row=>String(row.topic)));const unused=eligible.filter(card=>!attemptedTopics.has(card.topic));
        const samePillar=unused.filter(card=>card.subjectFamily===slot.pillar);const pool=samePillar.length?samePillar:unused;if(!pool.length)break;
        const card=pool[0];eligible=eligible.filter(item=>item.id!==card.id);const source=evidence.find(row=>row.canonicalUrl===card.sourcePolicy.canonicalUrl)!;const sources=[{documentId:String(source.document_id),url:card.sourcePolicy.canonicalUrl,title:String(source.title),publisher:String(source.authority),tier:'official',locale:'pt',retrievedAt:String(source.verifiedAt),contentHash:String(source.content_hash),relevanceScore:100,matchedTerms:card.evidenceTerms,excerpts:evidenceWindows(String(source.visible_text),card.evidenceTerms)}];const bundleHash=hash(sources);const [bundle]=await sql`INSERT INTO social_topic_evidence_bundle(plan_slot_id,bundle_hash,sources,verification_state,verified_at,expires_at) VALUES(${slot.id},${bundleHash},${sql.json(sources)},'verified',now(),now()+(${card.sourcePolicy.freshnessDays}::STRING||' days')::INTERVAL) ON CONFLICT(plan_slot_id,bundle_hash) DO UPDATE SET verification_state='verified',verified_at=now(),expires_at=excluded.expires_at RETURNING id`;const briefIdentity=hash({id:card.id,topic:card.topic,userQuestion:card.userQuestion,audience:card.audience,contentIntent:card.contentIntent}).slice(0,16);// The fingerprint deliberately excludes the day and the slot number. Including them
        // minted a brand-new concept row every time a card was tried, so 29 reserve cards
        // had spawned 224 rows — each later colliding with the one post that did get made
        // from the card, and each blocked as a duplicate. One card is now one row, which
        // keeps the blocked count honest instead of making the bank look exhausted.
        const fingerprint=`held-fallback:${briefIdentity}`;const [concept]=await sql`INSERT INTO social_post_concept(document_id,topic,category,risk_level,priority,timeliness,fingerprint,status,planned_for,reason,repeat_allowed,score,plan_slot_id,evidence_bundle_id,subject_family,user_question,content_intent) VALUES(${source.document_id},${card.topic},${card.subjectFamily},'medium',${100-Number(slot.slot_number)},'evergreen',${fingerprint},'planned',${day},${`Evidence hold replacement for: ${slot.topic}`},false,${100-Number(slot.slot_number)},${slot.id},${bundle.id},${card.subjectFamily},${card.userQuestion},${card.contentIntent}) ON CONFLICT(fingerprint) DO UPDATE SET document_id=excluded.document_id,topic=excluded.topic,category=excluded.category,evidence_bundle_id=excluded.evidence_bundle_id,subject_family=excluded.subject_family,user_question=excluded.user_question,content_intent=excluded.content_intent,status=CASE WHEN social_post_concept.status='used' THEN 'used' ELSE 'planned' END,updated_at=now() RETURNING id`;await sql`UPDATE social_editorial_plan_slot SET topic=${card.topic},pillar=${card.subjectFamily},audience=${card.audience},timing_class='evergreen',reserve_kind='evidence_hold_fallback',search_terms=${sql.json(card.evidenceTerms)},required_authority=${card.sourcePolicy.canonicalUrl},subject_family=${card.subjectFamily},user_question=${card.userQuestion},content_intent=${card.contentIntent},occurrence_key=NULL,campaign_stage='evidence_hold_fallback',brief=${sql.json(card)},status='evidence_ready',updated_at=now() WHERE id=${slot.id}`;await sql`INSERT INTO social_event(event_type,payload) VALUES('planning.held_replaced',${sql.json({slotId:slot.id,originalTopic:slot.topic,reserveId:card.id,replacementTopic:card.topic,conceptId:concept.id})})`;replacements.push({slotId:slot.id,originalTopic:slot.topic,reserveId:card.id,topic:card.topic});}
      return send(res,200,{date:day,held:heldSlots.length,replaced:replacements.length,replacements});
    }

    if(req.method==="POST"&&url.pathname==="/v1/news/decide-flex-slot"){
      const {date,cutoffReached,dryRun}=NewsDecisionSchema.parse(await readJson(req));const [slot]=await sql`SELECT * FROM social_editorial_plan_slot WHERE publish_date=${date} AND plan_version=(SELECT max(plan_version) FROM social_editorial_plan_slot WHERE publish_date=${date}) AND timing_class='news_flex' AND status IN ('planned','held') ORDER BY slot_number LIMIT 1`;
      if(!slot)return send(res,200,{date,decision:"already_decided",message:"No undecided flexible slot exists for this date"});
      const existing=await recentActivePosts();
      const newsRows=await sql`SELECT c.*,d.source_url,d.source_authority,d.title AS source_title,d.original_lang,d.content_hash,COALESCE(d.last_verified_at,d.fetched_at) AS retrieved_at,array_agg(ch.text ORDER BY ch.chunk_index) FILTER (WHERE ch.id IS NOT NULL) AS excerpts FROM social_post_concept c JOIN document d ON d.id=c.document_id AND d.source_tier='official' AND d.verified_still_available=true AND d.freshness_confidence='fresh' LEFT JOIN chunk ch ON ch.document_id=d.id AND ch.vault_doc_id IS NULL WHERE c.status='eligible' AND c.timeliness='official_change' GROUP BY c.id,d.id ORDER BY c.created_at DESC LIMIT 20`;
      const news=newsRows.find(row=>(row.excerpts as string[]|null)?.length&&sourceSupportsNewsTopic(String(row.topic),String(row.source_title),(row.excerpts as string[]))&&!findDuplicate({topic:row.topic,subject_family:row.category,user_question:row.topic,content_intent:'timely_news',postIntent:'timely_news'},existing as DuplicateCandidate[]));
      if(news){if(dryRun)return send(res,200,{date,decision:'verified_news',dryRun:true,slotId:slot.id,conceptId:news.id,topic:news.topic,source:news.source_url});const identity={subjectFamily:String(news.category),userQuestion:`What changed in ${String(news.topic)} and who needs to act?`,contentIntent:'timely_news',occurrenceKey:`official-change:${news.content_hash}`};const sources=[{documentId:String(news.document_id),url:String(news.source_url),title:String(news.source_title),publisher:String(news.source_authority||"Official authority"),tier:'official',locale:String(news.original_lang),retrievedAt:String(news.retrieved_at),contentHash:String(news.content_hash),relevanceScore:100,matchedTerms:[String(news.topic)],excerpts:(news.excerpts as string[]).slice(0,6)}];const bundleHash=hash(sources);const [bundle]=await sql`INSERT INTO social_topic_evidence_bundle (plan_slot_id,bundle_hash,sources,verification_state,verified_at,expires_at) VALUES (${slot.id},${bundleHash},${sql.json(sources)},'verified',now(),now()+INTERVAL '24 hours') ON CONFLICT (plan_slot_id,bundle_hash) DO UPDATE SET verification_state='verified',verified_at=now(),expires_at=excluded.expires_at RETURNING id`;await sql.begin(async tx=>{await tx`UPDATE social_editorial_plan_slot SET topic=${news.topic},pillar=${news.category},risk_level=${news.risk_level},reserve_kind='verified_news',required_authority=${news.source_url},subject_family=${identity.subjectFamily},user_question=${identity.userQuestion},content_intent=${identity.contentIntent},occurrence_key=${identity.occurrenceKey},campaign_stage='news_replacement',status='evidence_ready',updated_at=now() WHERE id=${slot.id}`;await tx`UPDATE social_post_concept SET status='planned',planned_for=${date},plan_slot_id=${slot.id},evidence_bundle_id=${bundle.id},subject_family=${identity.subjectFamily},user_question=${identity.userQuestion},content_intent=${identity.contentIntent},occurrence_key=${identity.occurrenceKey},updated_at=now() WHERE id=${news.id}`;});return send(res,200,{date,decision:'verified_news',slotId:slot.id,conceptId:news.id,topic:news.topic,source:news.source_url});}
      if(!cutoffReached)return send(res,200,{date,decision:'waiting_for_verified_news',slotId:slot.id});
      const cards=await loadEvergreenReserve();const urls=[...new Set(cards.map(card=>card.sourcePolicy.canonicalUrl))];const evidence=await sql`SELECT DISTINCT ON (canonical_url) canonical_url AS "canonicalUrl",verified_at AS "verifiedAt",document_id,title,authority,content_hash,visible_text FROM social_reserve_evidence WHERE canonical_url IN ${sql(urls)} AND available=true AND document_id IS NOT NULL ORDER BY canonical_url,verified_at DESC`;const recent=await sql`SELECT subject_family AS "subjectFamily",user_question AS "userQuestion",audience,content_intent AS "contentIntent",created_at AS "usedAt" FROM social_post WHERE created_at>now()-INTERVAL '90 days' AND status NOT IN ('blocked','rejected','failed')`;const eligible=eligibleReserveCards(cards,evidence.map(row=>({canonicalUrl:String(row.canonicalUrl),verifiedAt:String(row.verifiedAt)})),recent.map(row=>({subjectFamily:String(row.subjectFamily||""),userQuestion:String(row.userQuestion||""),audience:String(row.audience||""),contentIntent:String(row.contentIntent||""),usedAt:String(row.usedAt)})));const card=eligible[Number(createHash('sha256').update(date).digest().readUInt32BE(0))%eligible.length];if(!card){if(!dryRun)await sql`UPDATE social_editorial_plan_slot SET status='held',updated_at=now() WHERE id=${slot.id}`;return send(res,409,{error:'No evidence-current non-duplicate reserve is available',slotId:slot.id,dryRun});}const source=evidence.find(row=>row.canonicalUrl===card.sourcePolicy.canonicalUrl)!;if(dryRun)return send(res,200,{date,decision:'named_evergreen_fallback',dryRun:true,slotId:slot.id,reserveId:card.id,topic:card.topic,source:card.sourcePolicy.canonicalUrl});const sources=[{documentId:String(source.document_id),url:card.sourcePolicy.canonicalUrl,title:String(source.title),publisher:String(source.authority),tier:'official',locale:'pt',retrievedAt:String(source.verifiedAt),contentHash:String(source.content_hash),relevanceScore:100,matchedTerms:card.evidenceTerms,excerpts:evidenceWindows(String(source.visible_text),card.evidenceTerms)}];const bundleHash=hash(sources);const [bundle]=await sql`INSERT INTO social_topic_evidence_bundle (plan_slot_id,bundle_hash,sources,verification_state,verified_at,expires_at) VALUES (${slot.id},${bundleHash},${sql.json(sources)},'verified',now(),now()+(${card.sourcePolicy.freshnessDays}::STRING||' days')::INTERVAL) ON CONFLICT (plan_slot_id,bundle_hash) DO UPDATE SET verification_state='verified',verified_at=now(),expires_at=excluded.expires_at RETURNING id`;const briefIdentity=hash({id:card.id,topic:card.topic,userQuestion:card.userQuestion,audience:card.audience,contentIntent:card.contentIntent}).slice(0,16);const fingerprint=`reserve:${date}:${slot.slot_number}:${briefIdentity}`;const [concept]=await sql`INSERT INTO social_post_concept (document_id,topic,category,risk_level,priority,timeliness,fingerprint,status,planned_for,reason,repeat_allowed,score,plan_slot_id,evidence_bundle_id,subject_family,user_question,content_intent) VALUES (${source.document_id},${card.topic},${card.subjectFamily},'medium',${100-Number(slot.slot_number)},'evergreen',${fingerprint},'planned',${date},${`Named evergreen cutoff fallback ${card.id}`},false,${100-Number(slot.slot_number)},${slot.id},${bundle.id},${card.subjectFamily},${card.userQuestion},${card.contentIntent}) ON CONFLICT (fingerprint) DO UPDATE SET document_id=excluded.document_id,topic=excluded.topic,category=excluded.category,evidence_bundle_id=excluded.evidence_bundle_id,subject_family=excluded.subject_family,user_question=excluded.user_question,content_intent=excluded.content_intent,status=CASE WHEN social_post_concept.status='used' THEN 'used' ELSE 'planned' END,updated_at=now() RETURNING id`;await sql`UPDATE social_editorial_plan_slot SET topic=${card.topic},pillar=${card.subjectFamily},audience=${card.audience},timing_class='evergreen',reserve_kind='named_evergreen_fallback',search_terms=${sql.json(card.evidenceTerms)},required_authority=${card.sourcePolicy.canonicalUrl},subject_family=${card.subjectFamily},user_question=${card.userQuestion},content_intent=${card.contentIntent},occurrence_key=NULL,campaign_stage='news_cutoff_fallback',brief=${sql.json(card)},status='evidence_ready',updated_at=now() WHERE id=${slot.id}`;return send(res,200,{date,decision:'named_evergreen_fallback',slotId:slot.id,conceptId:concept.id,reserveId:card.id,topic:card.topic,source:card.sourcePolicy.canonicalUrl});
    }

    if (req.method === "POST" && url.pathname === "/v1/discoveries") {
      const { items, sourceKind } = DiscoveryBatchSchema.parse(await readJson(req));
      let inserted = 0;
      for (const item of items) {
        const canonicalUrl = new URL(item.url); canonicalUrl.hash = "";
        ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => canonicalUrl.searchParams.delete(key));
        const contentHash = hash({ title: item.title.trim(), publishedAt: item.publishedAt || null });
        const rows = await sql`
          INSERT INTO social_discovery (canonical_url, title, publisher, locale, published_at, content_hash, source_kind, category, risk_level, raw_metadata)
          VALUES (${canonicalUrl.toString()}, ${item.title.trim()}, ${item.publisher || null}, ${item.locale}, ${item.publishedAt || null}, ${contentHash}, ${sourceKind}, ${item.category}, ${item.riskLevel}, ${sql.json({ discoveredUrl: item.url })})
          ON CONFLICT (canonical_url, content_hash) DO NOTHING RETURNING id
        `;
        inserted += rows.length;
      }
      await sql`INSERT INTO social_event (event_type, payload) VALUES ('discovery.ingested', ${sql.json({ received: items.length, inserted, sourceKind })})`;
      return send(res, 200, { received: items.length, inserted, duplicates: items.length - inserted });
    }

    // Fetches the discovery feeds and stores what is new. Previously an n8n graph of
    // Code + rssFeedRead nodes; folding it here lets the scheduler be a single workflow.
    if (req.method === "POST" && url.pathname === "/v1/discovery/rss") {
      const { items, failures, feedsChecked } = await collectDiscoveries();
      if (!items.length) {
        // An empty window is normal for a four-hour cutoff and must not read as failure.
        await sql`INSERT INTO social_event (event_type, payload) VALUES ('discovery.empty', ${sql.json({ feedsChecked, failures })})`;
        return send(res, 200, { feedsChecked, received: 0, inserted: 0, failures });
      }
      const stored = await internalApi("POST", "/v1/discoveries", { items, sourceKind: "news_discovery" });
      if (!stored.ok) return send(res, 502, { error: "Failed to store discoveries", detail: stored.result, failures });
      return send(res, 200, { feedsChecked, failures, ...stored.result });
    }

    // Fetches each monitored canonical page and records a snapshot. An individual page
    // being unusable is reported per URL rather than failing the whole run, so one dead
    // government page cannot stop change detection on the other five.
    if (req.method === "POST" && url.pathname === "/v1/official-sources/monitor") {
      const pages = await collectOfficialPages();
      const results: Array<Record<string, unknown>> = [];
      for (const page of pages) {
        if (!page.body) {
          results.push({ url: page.url, ok: false, error: (page as { error?: string }).error ?? `HTTP ${page.httpStatus}` });
          continue;
        }
        const snapshot = await internalApi("POST", "/v1/official-sources/snapshot", {
          url: page.url, httpStatus: page.httpStatus, body: page.body, fetchedAt: page.fetchedAt,
        });
        results.push({ url: page.url, ok: snapshot.ok, ...(snapshot.ok ? snapshot.result : { error: snapshot.result }) });
      }
      const changed = results.filter(item => item.changed).length;
      const failed = results.filter(item => item.ok === false).length;
      await sql`INSERT INTO social_event (event_type, payload) VALUES ('official_source.monitored', ${sql.json({ checked: results.length, changed, failed })})`;
      return send(res, 200, { checked: results.length, changed, failed, results });
    }

    if (req.method === "GET" && url.pathname === "/v1/discoveries") {
      const rows = await sql`SELECT id, canonical_url, title, publisher, locale, published_at, source_kind, evidence_state, category, risk_level, created_at FROM social_discovery ORDER BY COALESCE(published_at, created_at) DESC LIMIT 100`;
      return send(res, 200, { discoveries: rows });
    }

    if (req.method === "POST" && url.pathname === "/v1/discovery/official-announcements") {
      // Read each institution's own notice board and record the individual notices as
      // discoveries. They are on official domains, so triage reads and promotes them
      // without needing a newspaper to vouch for anything.
      const results: Array<Record<string, unknown>> = [];
      let inserted = 0;
      for (const page of OFFICIAL_ANNOUNCEMENT_PAGES) {
        try {
          const rendered = await fetchViaRenderer(page.url);
          if (!rendered) { results.push({ page: page.url, state: "unreadable" }); continue; }
          const candidates = announcementLinks(page.url, rendered.links).slice(0, 15);
          let added = 0;
          for (const link of candidates) {
            const [existing] = await sql`SELECT id FROM social_discovery WHERE canonical_url=${link} LIMIT 1`;
            if (existing) continue;
            const slug = (link.split("/").filter(Boolean).slice(-1)[0] ?? link).replace(/[-_]/g, " ").replace(/\.\w+$/, "").slice(0, 200);
            await sql`
              INSERT INTO social_discovery (canonical_url, title, publisher, locale, category, risk_level, content_hash, source_kind, evidence_state, published_at)
              VALUES (${link}, ${slug}, ${page.authority}, 'pt', 'general', 'high', ${hash(link)}, 'official_announcement', 'discovery_only', now())
              ON CONFLICT DO NOTHING
            `;
            added++; inserted++;
          }
          results.push({ page: page.url, found: candidates.length, added });
        } catch (error) {
          results.push({ page: page.url, state: "error", error: String((error as Error).message ?? error).slice(0, 160) });
        }
      }
      await sql`INSERT INTO social_event (event_type, payload) VALUES ('discovery.official_announcements', ${sql.json({ pages: OFFICIAL_ANNOUNCEMENT_PAGES.length, inserted })})`;
      return send(res, 200, { pages: OFFICIAL_ANNOUNCEMENT_PAGES.length, inserted, results });
    }

    if (req.method === "POST" && url.pathname === "/v1/verification/triage") {
      const discoveries = await sql`SELECT * FROM social_discovery WHERE evidence_state='discovery_only' ORDER BY COALESCE(published_at, created_at) DESC LIMIT 100`;
      let promoted = 0;
      let held = 0;
      let corroborated = 0;
      // Reading pages costs time and hits other people's servers, so a run only spends a
      // fixed number of fetches. Anything not reached this quarter hour is reached next.
      let fetchBudget = 12;

      for (const discovery of discoveries) {
        const itemUrl = String(discovery.canonical_url);
        const official = isOfficialUrl(itemUrl);
        let evidenceUrl = itemUrl;

        let [document] = await sql`
          SELECT id FROM document WHERE verified_still_available=true AND freshness_confidence='fresh' AND source_tier='official'
            AND source_url=${itemUrl} ORDER BY COALESCE(last_verified_at,fetched_at) DESC LIMIT 1
        `;

        // An official page announced today is never already in the corpus, which is what
        // used to hold every official announcement: the corpus only ever contained the
        // pages the brief bank and the monitor list named. Read it now.
        if (!document && official && fetchBudget > 0) {
          fetchBudget--;
          const hostname = new URL(itemUrl).hostname.replace(/^www\./, "");
          const ingested = await ingestOfficialDocument(itemUrl, String(discovery.source_authority || hostname));
          if (ingested) document = ingested as { id: unknown };
        }

        // A newspaper is a signal, never evidence. Follow the official links out of the
        // story and cite the notice itself; if the story leads nowhere official, hold it.
        if (!document && !official) {
          if (!newsRelevant(discovery.title, discovery.category)) { held++; continue; }
          if (discovery.corroboration_attempted_at) { held++; continue; }
          if (fetchBudget <= 0) { held++; continue; }
          fetchBudget--;
          await sql`UPDATE social_discovery SET corroboration_attempted_at=now() WHERE id=${discovery.id}`;

          // Google News hands out redirect wrappers, not articles: fetching one returns
          // half a megabyte of script and no link to anything. Two thirds of everything
          // collected arrives this way, so the wrapper is opened in the renderer's
          // browser, which follows the redirect the way a reader's would.
          let articleUrl = itemUrl;
          if (/(^|\.)news\.google\.com$/.test(new URL(itemUrl).hostname)) {
            const resolved = await fetchViaRenderer(itemUrl);
            const landed = resolved?.finalUrl ? new URL(resolved.finalUrl).hostname : "";
            if (landed && !/(^|\.)google\.com$/.test(landed)) articleUrl = resolved!.finalUrl;
            else { held++; continue; }
          }

          const article = await fetchPage(articleUrl);
          const links = article.html ? officialLinksIn(article.html, officialDomains) : [];
          for (const link of links.slice(0, 3)) {
            const [existing] = await sql`
              SELECT id FROM document WHERE verified_still_available=true AND freshness_confidence='fresh' AND source_tier='official'
                AND source_url=${link} ORDER BY COALESCE(last_verified_at,fetched_at) DESC LIMIT 1
            `;
            const found = existing ?? await ingestOfficialDocument(link, new URL(link).hostname.replace(/^www\./, ""));
            if (found) {
              document = found as { id: unknown };
              evidenceUrl = link;
              corroborated++;
              await sql`UPDATE social_discovery SET corroborating_url=${link} WHERE id=${discovery.id}`;
              break;
            }
          }
        }

        if (!document) { held++; continue; }
        const fingerprint = `official-change:${discovery.content_hash}`;
        await sql.begin(async (tx) => {
          await tx`UPDATE social_discovery SET evidence_state='promoted', updated_at=now() WHERE id=${discovery.id}`;
          await tx`
            INSERT INTO social_post_concept (document_id, discovery_id, topic, category, risk_level, priority, timeliness, fingerprint, status, reason, repeat_allowed, score)
            VALUES (${document.id}, ${discovery.id}, ${discovery.title}, ${discovery.category}, ${discovery.risk_level}, 90, 'official_change', ${fingerprint}, 'eligible', ${evidenceUrl === itemUrl ? 'Official notice read and verified against the canonical corpus' : `News item corroborated against the official source at ${evidenceUrl}`}, true, 90)
            ON CONFLICT (fingerprint) DO NOTHING
          `;
        });
        promoted++;
      }
      await sql`INSERT INTO social_event (event_type, payload) VALUES ('verification.triaged', ${sql.json({ reviewed: discoveries.length, promoted, held, corroborated })})`;
      return send(res, 200, { reviewed: discoveries.length, promoted, held, corroborated, rule: "Official pages are read on sight; a news item is promoted only once an official source behind it has been read" });
    }

    if (req.method === "POST" && url.pathname === "/v1/news/dispatch-recent") {
      const candidates = await sql`
        SELECT c.id,c.topic,c.category,c.discovery_id,d.content_hash,COALESCE(d.published_at,d.created_at) AS discovered_at
        FROM social_post_concept c
        JOIN social_discovery d ON d.id=c.discovery_id
        WHERE c.status='eligible' AND c.timeliness='official_change'
          AND COALESCE(d.published_at,d.created_at)>=now()-INTERVAL '24 hours'
        ORDER BY COALESCE(d.published_at,d.created_at),c.created_at
        LIMIT 20
      `;
      const results: any[] = [];
      for (const candidate of candidates) {
        if (!newsRelevant(candidate.topic,candidate.category)) {
          await sql`UPDATE social_post_concept SET status='blocked',reason='News item is outside Finkavo relevance policy',blocked_kind='relevance',blocked_reason='the headline named no institution or instrument, or described no change a reader could act on',blocked_at=now(),updated_at=now() WHERE id=${candidate.id} AND status='eligible'`;
          results.push({conceptId:candidate.id,topic:candidate.topic,state:'irrelevant'});
          continue;
        }
        const identity={subjectFamily:String(candidate.category||'general'),userQuestion:`What changed in ${String(candidate.topic)} and who needs to act?`,contentIntent:'timely_news',occurrenceKey:`official-change:${String(candidate.content_hash)}`};
        const claimed=await sql`UPDATE social_post_concept SET status='planned',planned_for=${lisbonDate(new Date())},subject_family=${identity.subjectFamily},user_question=${identity.userQuestion},content_intent=${identity.contentIntent},occurrence_key=${identity.occurrenceKey},updated_at=now() WHERE id=${candidate.id} AND status='eligible' RETURNING id`;
        if(!claimed.length)continue;
        const generated=await internalApi("POST","/v1/generate",{conceptId:String(candidate.id)});
        if(!generated.ok){results.push({conceptId:candidate.id,topic:candidate.topic,state:'generation_failed',status:generated.status,error:generated.result.detail||generated.result.error});continue;}
        const post=(generated.result.post||{}) as {id?:string};
        if(!post.id){results.push({conceptId:candidate.id,topic:candidate.topic,state:'generation_failed',error:'Generator returned no post'});continue;}
        const reviewed=await internalApi("POST",`/v1/posts/${post.id}/request-review`,{expiresInMinutes:180});
        results.push({conceptId:candidate.id,postId:post.id,topic:candidate.topic,state:reviewed.ok?'sent_for_immediate_review':'review_failed',reviewStatus:reviewed.status,error:reviewed.ok?null:reviewed.result.error});
      }
      await sql`INSERT INTO social_event(event_type,payload) VALUES('news.fast_lane_dispatched',${sql.json({windowHours:24,candidates:candidates.length,results})})`;
      return send(res,200,{windowHours:24,candidates:candidates.length,results});
    }

    if (req.method === "GET" && url.pathname === "/v1/candidates") {
      const requested = Number(url.searchParams.get("limit") || 10);
      const limit = Math.max(1, Math.min(Number.isFinite(requested) ? requested : 10, 25));
      const rows = await sql`
        SELECT d.id, d.title, d.source_url, d.source_authority, d.source_tier,
               d.fetched_at, d.last_verified_at, d.freshness_confidence,
               array_agg(c.text ORDER BY c.chunk_index) FILTER (WHERE c.chunk_index < 4) AS excerpts
        FROM document d
        JOIN chunk c ON c.document_id = d.id AND c.vault_doc_id IS NULL
        WHERE d.verified_still_available = true
          AND d.freshness_confidence = 'fresh'
          AND d.source_tier IN ('official', 'professional', 'editorial')
          AND NOT EXISTS (SELECT 1 FROM social_post p WHERE p.source_document_id = d.id AND p.created_at > now() - INTERVAL '90 days')
        GROUP BY d.id
        ORDER BY CASE d.source_tier WHEN 'official' THEN 0 WHEN 'professional' THEN 1 ELSE 2 END,
                 COALESCE(d.last_verified_at, d.fetched_at) DESC
        LIMIT ${limit}
      `;
      return send(res, 200, { candidates: rows });
    }

    if (req.method === "POST" && url.pathname === "/v1/generate") {
      // Stage timing. A generation that never returns looks identical from outside to one
      // that is merely slow, and the process sitting at zero per cent CPU says only that
      // it is waiting — not for what. This says for what.
      const genStarted = Date.now();
      const mark = (stage: string, extra?: Record<string, unknown>) =>
        console.log(JSON.stringify({ level: "info", at: "generate", stage, ms: Date.now() - genStarted, ...extra }));
      mark("entered");
      const generationInput = GenerateSchema.parse(await readJson(req));
      mark("body-parsed");
      const [selectedConcept] = await sql`SELECT c.*,b.sources,b.bundle_hash,b.expires_at,s.brief FROM social_post_concept c LEFT JOIN social_topic_evidence_bundle b ON b.id=c.evidence_bundle_id AND b.verification_state='verified' AND b.expires_at>now() LEFT JOIN social_editorial_plan_slot s ON s.id=c.plan_slot_id WHERE c.id=${generationInput.conceptId} AND c.status='planned'`;
      mark("concept-loaded", { found: Boolean(selectedConcept) });
      if (!selectedConcept) return send(res,409,{error:"Concept is not planned or its evidence is unavailable"});
      let evidenceSources=(selectedConcept.sources || []) as Array<Record<string,unknown>>;
      if(selectedConcept.plan_slot_id&&!evidenceSources.length)return send(res,409,{error:"Planned content requires a current verified topic-specific evidence bundle"});
      if (!evidenceSources.length && selectedConcept.document_id) {
        const [document] = await sql`
          SELECT d.id,d.title,d.source_url,d.source_authority,d.source_tier,d.original_lang,d.content_hash,
                 COALESCE(d.last_verified_at,d.fetched_at) AS retrieved_at,
                 array_agg(c.text ORDER BY c.chunk_index) FILTER (WHERE c.chunk_index < 10) AS excerpts
          FROM document d JOIN chunk c ON c.document_id=d.id AND c.vault_doc_id IS NULL
          WHERE d.id=${selectedConcept.document_id} AND d.verified_still_available=true AND d.freshness_confidence='fresh'
            AND d.source_tier IN ('official','professional','editorial')
          GROUP BY d.id
        `;
        if (document) evidenceSources=[{ documentId:document.id,url:document.source_url,title:document.title,publisher:document.source_authority,tier:document.source_tier,locale:document.original_lang,retrievedAt:document.retrieved_at,contentHash:document.content_hash,relevanceScore:50,excerpts:document.excerpts }];
      }
      mark("evidence-resolved", { sources: evidenceSources.length });
      if (!evidenceSources.length) return send(res,409,{error:"Concept has no current verified source material"});
      const source=evidenceSources[0]; const documentId=String(source.documentId);
      let checked: z.infer<typeof DraftSchema> | null = null;
      let model = "";
      let lastGenerationError = "";
      let usedTokens: number | null = null;
      const reviewerNotes = String(selectedConcept.revision_feedback ?? "").trim();
      // Passed in by whoever asked for this draft. The generation endpoint does not decide
      // to spend money; the loop that can see the day is short does. Read from the input
      // already parsed above — the body is a stream and only gives itself up once.
      const allowPaid = Boolean(generationInput.allowPaid);
      // Matching on the message text alone was fragile: local pacing says nothing a
      // rate-limit regex recognises, so a deferred request was read as an editorial
      // failure and retired a perfectly good brief. The type is the reliable signal.
      let lastErrorWasPacing = false;
      // The whole request, not just one provider call.
      //
      // Three attempts, each walking a chain of five providers, is easily ten minutes
      // when they are slow — and the scheduler that drives this gives up at nine. So a
      // generation could never finish inside the window that started it: the day made
      // attempt after attempt, none of them completing, and produced nothing for a day
      // and a half while looking, from outside, like a pipeline that had stopped. Bounded
      // here, an attempt that runs long defers and the concept keeps its place for the
      // next tick.
      const generationDeadline = Date.now() + Number(process.env.GENERATION_MAX_SECONDS ?? 240) * 1000;

      // A fact-card source used to skip the model outright and ship simpleDraft(). That
      // guaranteed a blocked post: the mechanical draft never carries a real caption or
      // standalone value, so the pre-Discord gate rejected every one and the slot was
      // spent for nothing. The model runs first now and simpleDraft() waits underneath as
      // the fallback. Accuracy is not what was protecting these posts anyway — the
      // verbatim-quote and evidence-reliability checks below apply to model output too.
      // Started only when the remaining budget can hold a whole attempt. Checking the
      // deadline alone let an attempt begin a second before it and then run its full
      // length past it, which is how a request bounded at two hundred seconds still took
      // more than six hundred. An attempt is the chain plus, at most, one paid call.
      const attemptBudgetMs = Number(process.env.LLM_CHAIN_DEADLINE_MS ?? 70_000)
        + Number(process.env.LLM_FALLBACK_TIMEOUT_MS ?? 240_000)
        + 15_000;
      for (let attempt = 1; !checked && attempt <= 3 && Date.now() + attemptBudgetMs <= generationDeadline; attempt++) {
        try {
          mark("model-call-start", { attempt });
          const generated = await generateDraft({
            title: String(selectedConcept.topic), sourceUrl: String(source.url),
            authority: source.publisher ? String(source.publisher) : null,
            fetchedAt: String(source.retrievedAt), excerpts: evidenceSources.flatMap(s=>s.excerpts as string[]),
            sources: evidenceSources.map(s=>({title:String(s.title),sourceUrl:String(s.url),authority:s.publisher?String(s.publisher):null,fetchedAt:String(s.retrievedAt),excerpts:s.excerpts as string[]})),
            // The reviewer's notes outrank an automated repair hint and must survive all
            // three attempts, so they are carried alongside rather than overwritten.
            ...(reviewerNotes || lastGenerationError
              ? { repairFeedback: [reviewerNotes ? `The reviewer rejected the previous draft with these notes, which this rewrite must address: ${reviewerNotes}` : "", lastGenerationError].filter(Boolean).join(" ") }
              : {}),
            allowPaid,
            ...(selectedConcept ? { editorialContext: { topic: String(selectedConcept.topic), reason: selectedConcept.reason ? String(selectedConcept.reason) : null, campaignStage: selectedConcept.campaign_stage ? String(selectedConcept.campaign_stage) : null, plannedFor: selectedConcept.planned_for ? String(selectedConcept.planned_for) : null, expiresAt: selectedConcept.expires_at ? String(selectedConcept.expires_at) : null, purpose:selectedConcept.brief?.purpose?String(selectedConcept.brief.purpose):undefined,userQuestion:selectedConcept.brief?.userQuestion?String(selectedConcept.brief.userQuestion):undefined,requiredAnswers:Array.isArray(selectedConcept.brief?.requiredAnswers)?selectedConcept.brief.requiredAnswers.map(String):undefined } } : {}),
          });
          mark("model-returned", { attempt, model: generated.model });
          const candidate = ensureKnownAcronymsAreDefined(DraftSchema.parse(repairMechanicalDefects(generated.draft)));
          const sourceLabel = String(
            evidenceSources.find((item) => item.publisher)?.publisher ||
            evidenceSources[0]?.title ||
            "Official source",
          ).slice(0, 80);
          candidate.slides = candidate.slides.map((slide) => ({
            ...slide,
            sourceLabel: slide.sourceLabel?.trim() || sourceLabel,
          }));
          candidate.slides= candidate.slides.map(slide=>({...slide,body:slide.body?finishSentence(slide.body):slide.body,items:slide.items.map(finishSentence)}));
          candidate.claims=candidate.claims.map(claim=>({...claim,claim:finishSentence(claim.claim)}));
          if (!topicMatchesPlan(candidate.topic,String(selectedConcept.topic))) throw new Error("Draft drifted away from the predetermined editorial topic");
          const publicCopy=[candidate.hook,candidate.caption,...candidate.slides.flatMap(slide=>[slide.title,slide.body,...slide.items])].join(" ");
          if (/\b(?:sources?|excerpts?|documents?)\b.{0,60}\b(?:do not|does not|don't|cannot|fail(?:s|ed)? to|not enough)\b/i.test(publicCopy)) throw new Error("Draft discusses missing evidence instead of delivering the predetermined topic");
          validateSocialDraft(candidate);
          // The renderer's own contract, applied here rather than at render time. A slide
          // that is too long to draw used to pass every gate, spend its tokens, and die
          // in the manifest — fatally, and after the cost. Checked here it is just
          // another repairable defect, and the model is told exactly which field.
          const tooLong = renderLimitFailures(candidate.slides as unknown as Array<Record<string, unknown>>, candidate.callToAction);
          if (tooLong.length) {
            throw new Error(
              `These are too long to fit the template: ${tooLong.map(f => `${f.field} is ${f.length} characters and the limit is ${f.limit}`).join("; ")}. Shorten them without losing the meaning.`,
            );
          }
          const corpusText = evidenceSources.flatMap(s=>s.excerpts as string[]).join("\n").replace(/\s+/g, " ");

          // The reel was checked only after the loop had finished, so "the model wrote no
          // reel" was recorded and never acted on. Across four days that meant 26 of 30
          // drafts carried no reel and the day had nothing to promote — the one-reel-a-day
          // guarantee has no way to invent frames that were never written. The reel now
          // gets a repair pass of its own.
          //
          // Only on the first attempt. A reel must never cost a post that is otherwise
          // sound, which was the right instinct in the original design; it just needs one
          // chance to be asked for again before we give up on it.
          // Two passes, not one. A single nudge was not enough: the model would come back
          // with six-word frames again and the reel would be dropped, so the format quietly
          // reverted to the headlines it had before. The last attempt still accepts whatever
          // arrives, because a reel must never cost a post that is otherwise sound.
          if (attempt <= 2) {
            const draftFrames = candidate.reel?.frames ?? [];
            const draftVerdict = draftFrames.length
              ? validateReelFrames(draftFrames, corpusText)
              : { ok: false as const, reason: "no reel was written at all" };
            // A reel with no figure is four frames of prose going past too fast to read,
            // and the scheduler will pass over it in favour of one that has a number. Ask
            // once. It is not fatal — if the second attempt still has none, the reel is
            // kept and can still carry the day as a last resort.
            const hasFigure = draftFrames.some(frame => String(frame.figure ?? "").trim());
            if (draftVerdict.ok && !hasFigure) {
              throw new Error(
                "The reel has no figure. Put the number the post turns on — a deadline, a rate, a count of days — " +
                "in the `figure` field of the frame it belongs to, with what it counts in `label`, and keep it out " +
                "of that frame's `text`. Keep the carousel and the rest of the reel exactly as they are.",
              );
            }
            if (!draftVerdict.ok) {
              throw new Error(
                `The reel is missing or unusable: ${draftVerdict.reason}. ` +
                `Every post must also carry a reel of exactly four frames — one "hook", two "beat", one "payoff". ` +
                `Write each frame as fully as a carousel slide: the hook 12 to 22 words, each beat 22 to 42, the payoff ` +
                `15 to 32, in complete sentences. The frame should hold more than a viewer can read as it passes, so ` +
                `they stop the video to finish it. Any figure shown must be one the excerpts state directly. ` +
                `Keep the carousel exactly as it is and add the reel.`,
              );
            }
          }
          // The quote is taken from the source rather than trusted from the model. It
          // drifts partway through long Portuguese passages, and a sound draft used to be
          // discarded for it. Anchoring makes the evidence verbatim by construction; a
          // claim the source does not carry still fails, because that is not a copying
          // problem but an unsupported claim.
          for (const claim of candidate.claims) {
            const anchor = anchorQuote(claim.evidenceQuote, corpusText);
            if (!anchor.anchored) {
              throw new Error(
                `The claim "${claim.claim.slice(0, 80)}" is not supported by the supplied excerpts: ${anchor.reason}. ` +
                `Make every claim one the excerpts state directly.`,
              );
            }
            claim.evidenceQuote = anchor.quote;
          }
          if (candidate.riskLevel === "high" && !evidenceSources.some(s=>s.tier === "official")) throw new Error("High-risk content requires an official primary source");
          const reliability=assessEvidenceReliability({topic:candidate.topic,category:candidate.category,claims:candidate.claims,sources:evidenceSources.map(s=>({url:String(s.url),title:String(s.title),publisher:s.publisher?String(s.publisher):null,tier:String(s.tier),retrievedAt:String(s.retrievedAt),excerpts:(s.excerpts as string[])||[]}))});
          if(!reliability.passed)throw new Error(`Evidence reliability gate failed: ${reliability.failures.join("; ")}`);
          checked = candidate;
          model = generated.model;
          usedTokens = generated.totalTokens;
          break;
        } catch (error) {
          lastGenerationError = error instanceof Error ? error.message : "Generation validation failed";
          lastErrorWasPacing = error instanceof LlmRateLimitError;
        }
      }
      if (!checked) {
        // Distinguish "this topic cannot produce a good post" from "the provider was
        // busy". Blocking the concept is an editorial verdict: it retires the topic and
        // holds its slot for the day. A rate limit or network fault says nothing about
        // the topic, and treating it as one silently retired five perfectly good briefs
        // the first time the free-tier token ceiling was hit.
        const infrastructural = lastErrorWasPacing
          || /rate limit|token\/rate|paced locally|Request too large|tokens per minute|ECONNRESET|ETIMEDOUT|fetch failed|AbortError|timed out|returned no structured output|5\d\d\)/i
            .test(lastGenerationError ?? "");
        if (infrastructural) {
          await sql`INSERT INTO social_event (event_type, payload) VALUES ('generation.deferred', ${sql.json({ documentId, conceptId: selectedConcept.id, planSlotId: selectedConcept.plan_slot_id, error: lastGenerationError })})`;
          // 503 so the caller retries this concept on the next cycle instead of counting
          // it as a content failure and reaching for a replacement brief.
          return send(res, 503, { error: "Generation provider unavailable; the concept remains planned", detail: lastGenerationError, retryable: true });
        }
        // The mechanical draft has produced six blocked posts and nothing published. It
        // skips every check the model's output goes through, so its shortcomings are only
        // found at the pre-Discord gate — after a post row, a render and its uploads have
        // been spent on something that could never publish. It now has to pass the same
        // validation as a model draft before it is allowed to become a post; when it
        // cannot, the concept fails here as it would have anyway, minus the wasted work.
        if (evidenceSources.some(source=>source.deterministicFactCard===true)) {
          const mechanical = simpleDraft(String(selectedConcept.topic), evidenceSources.flatMap(source=>source.excerpts as string[]));
          try {
            // The model's output goes through this before validation; the mechanical
            // draft did not, so it failed on acronyms that would have been defined for it.
            const expanded = ensureKnownAcronymsAreDefined(mechanical);
            validateSocialDraft(expanded);
            checked = expanded;
            model = "deterministic-fact-card-v1";
          } catch (error) {
            lastGenerationError = `mechanical fallback rejected: ${error instanceof Error ? error.message : "invalid"}`;
          }
        }
      }
      if (!checked) {
        // A failed generation used to retire the topic outright. That is how a bank of
        // 153 topics fell to 45 eligible: a Groq timeout, a token-per-minute pause or a
        // truncated JSON body read exactly like "this subject is unusable". Now the
        // failure is classified first — infrastructure never counts against the topic,
        // and everything else has to fail MAX_GENERATION_ATTEMPTS times on different
        // runs before the concept is retired.
        const failure = classifyGenerationFailure(lastGenerationError);
        const priorAttempts = Number(selectedConcept.generation_attempts ?? 0);
        const attempts = priorAttempts + (countsAsAttempt(failure) ? 1 : 0);
        // Every attempt counts here, infrastructure included, so a concept that can never
        // get through the model stops eventually instead of spending the day's calls.
        const totalAttempts = Number(selectedConcept.total_generation_attempts ?? 0) + 1;
        const retire = shouldRetireConcept(failure, attempts, totalAttempts);
        const unworkable = retire && !countsAsAttempt(failure);
        await sql.begin(async tx => {
          if (retire) {
            await tx`UPDATE social_post_concept SET status='blocked',blocked_kind=${unworkable ? "infrastructure" : failure.kind},blocked_reason=${unworkable ? `Retired after ${totalAttempts} attempts without ever reaching judgement: ${failure.reason}`.slice(0, 400) : failure.reason},blocked_at=now(),generation_attempts=${attempts},total_generation_attempts=${totalAttempts},updated_at=now() WHERE id=${selectedConcept.id}`;
            if (selectedConcept.plan_slot_id) await tx`UPDATE social_editorial_plan_slot SET status='held',updated_at=now() WHERE id=${selectedConcept.plan_slot_id}`;
          } else {
            // Back into the bank. The slot returns to evidence_ready so the very next
            // generation run can pick this topic straight back up.
            await tx`UPDATE social_post_concept SET status='planned',generation_attempts=${attempts},total_generation_attempts=${totalAttempts},blocked_kind=NULL,blocked_reason=NULL,updated_at=now() WHERE id=${selectedConcept.id}`;
            if (selectedConcept.plan_slot_id) await tx`UPDATE social_editorial_plan_slot SET status='evidence_ready',updated_at=now() WHERE id=${selectedConcept.plan_slot_id}`;
          }
          await tx`INSERT INTO social_event (event_type, payload) VALUES ('generation.failed', ${tx.json({ documentId, conceptId: selectedConcept.id, planSlotId: selectedConcept.plan_slot_id, error: lastGenerationError, kind: failure.kind, attempts, totalAttempts, retired: retire, unworkable })})`;
        });
        return send(res, 422, { error: "Structured generation failed after the initial attempt and two targeted repairs", detail: lastGenerationError, kind: failure.kind, attempts, retired: retire });
      }
      const reliability=assessEvidenceReliability({topic:checked.topic,category:checked.category,claims:checked.claims,sources:evidenceSources.map(s=>({url:String(s.url),title:String(s.title),publisher:s.publisher?String(s.publisher):null,tier:String(s.tier),retrievedAt:String(s.retrievedAt),excerpts:(s.excerpts as string[])||[]}))});
      const sourceBundle = evidenceSources.map(s=>({documentId:String(s.documentId),url:String(s.url),title:String(s.title),publisher:s.publisher?String(s.publisher):null,locale:String(s.locale),retrievedAt:String(s.retrievedAt),contentHash:String(s.contentHash),tier:String(s.tier),excerpts:(s.excerpts as string[])||[],reliability}));
      const evidenceHash = hash({ sourceBundle, claims: checked.claims });
      const contentHash = hash({ hook: checked.hook, caption: checked.caption, callToAction: checked.callToAction, hashtags: checked.hashtags, searchKeywords: checked.searchKeywords, postIntent: checked.postIntent, slides: checked.slides });
      const duplicate = await findRecentDuplicate({ topic: checked.topic, category: checked.category, audience: "English-speaking people in Portugal", postIntent: checked.postIntent, content_hash: contentHash, subject_family: selectedConcept.subject_family, user_question: selectedConcept.user_question, content_intent: selectedConcept.content_intent, occurrence_key: selectedConcept.occurrence_key });
      if (duplicate) {
        await sql.begin(async tx => {
          await tx`UPDATE social_post_concept SET status='blocked',blocked_kind='duplicate',blocked_reason=${`${duplicate.reason} (already covered by post ${String(duplicate.post.id).slice(0, 8)})`},blocked_at=now(),updated_at=now() WHERE id=${selectedConcept.id}`;
          if(selectedConcept.plan_slot_id)await tx`UPDATE social_editorial_plan_slot SET status='held',updated_at=now() WHERE id=${selectedConcept.plan_slot_id}`;
          await tx`INSERT INTO social_event(event_type,payload) VALUES('quality.duplicate_blocked',${tx.json({ conceptId: String(selectedConcept.id), duplicateOf: String(duplicate.post.id), reason: duplicate.reason, stage: 'generation' })})`;
        });
        return send(res, 409, { error: "Duplicate topic blocked", duplicateOf: duplicate.post.id, reason: duplicate.reason });
      }
      mark("validated");
      const inserted = await sql.begin(async (tx) => {
        const [post] = await tx`
          INSERT INTO social_post (topic, source_document_id, source_url, source_title, source_authority, source_fetched_at,
            hook, caption, call_to_action, hashtags, slides, model, category, risk_level, post_intent, search_keywords,subject_family,user_question,content_intent,occurrence_key,planned_for)
          VALUES (${checked.topic}, ${documentId}, ${String(source.url)}, ${String(source.title)},
            ${source.publisher ? String(source.publisher) : null}, ${String(source.retrievedAt)},
            ${checked.hook}, ${checked.caption}, ${checked.callToAction}, ${tx.json(checked.hashtags)}, ${tx.json(checked.slides)}, ${model}, ${checked.category}, ${checked.riskLevel}, ${checked.postIntent}, ${tx.json(checked.searchKeywords)},${selectedConcept.subject_family},${selectedConcept.user_question},${selectedConcept.content_intent},${selectedConcept.occurrence_key},${selectedConcept.planned_for})
          RETURNING *
        `;
        // The reel is checked on its own terms — its figures against the evidence, its
        // copy against the time it is on screen — and a failure only costs the reel. A
        // carousel that passed every gate is not thrown away because the short version of
        // it came out wrong; the post goes out without one and the reason is kept, which
        // is also how we learn which rule keeps catching things.
        const reelFrames = checked.reel?.frames ?? [];
        // The same excerpts the claims were checked against, rebuilt here because the
        // copy used during generation lives inside the attempt loop.
        const reelCorpus = evidenceSources.flatMap(entry => entry.excerpts as string[]).join("\n").replace(/\s+/g, " ");
        const reelVerdict = reelFrames.length ? validateReelFrames(reelFrames, reelCorpus) : { ok: false as const, reason: "the model wrote no reel for this post" };
        const reelToStore = reelVerdict.ok ? reelFrames : null;
        const reelRejected = reelVerdict.ok ? null : reelVerdict.reason;

        const [revision] = await tx`
          INSERT INTO social_post_revision (post_id, revision_number, locale, template_version, hook, caption, call_to_action,
            hashtags, slides, alt_texts, source_bundle, evidence_hash, content_hash, model, prompt_version, post_intent, search_keywords, reel_frames, reel_rejected_reason)
          VALUES (${post.id}, 1, 'en', 'finkavo-v3', ${checked.hook}, ${checked.caption}, ${checked.callToAction},
            ${tx.json(checked.hashtags)}, ${tx.json(checked.slides)}, ${tx.json(checked.slides.map((slide) => slide.altText))},
            ${tx.json(sourceBundle)}, ${evidenceHash}, ${contentHash}, ${model}, 'v2', ${checked.postIntent}, ${tx.json(checked.searchKeywords)},
            ${reelToStore ? tx.json(reelToStore) : null}, ${reelRejected}) RETURNING *
        `;
        await tx`UPDATE social_post SET current_revision_id = ${revision.id} WHERE id = ${post.id}`;
        for (const claim of checked.claims) {
          const claimSource=evidenceSources.find(s=>(s.excerpts as string[]).join(" ").replace(/\s+/g," ").includes(claim.evidenceQuote.replace(/\s+/g," ")))||source;
          const [savedClaim] = await tx`
            INSERT INTO social_claim (post_id, revision_id, claim_text, evidence_quote, source_url, risk_type, review_state)
            VALUES (${post.id}, ${revision.id}, ${claim.claim}, ${claim.evidenceQuote}, ${String(claimSource.url)}, ${checked.riskLevel}, 'supported') RETURNING id
          `;
          await tx`INSERT INTO social_claim_evidence (claim_id, document_id, source_url, source_title, publisher, locale, retrieved_at, content_hash, supporting_excerpt)
            VALUES (${savedClaim.id}, ${String(claimSource.documentId)}, ${String(claimSource.url)}, ${String(claimSource.title)}, ${claimSource.publisher ? String(claimSource.publisher) : null}, ${String(claimSource.locale)}, ${String(claimSource.retrievedAt)}, ${String(claimSource.contentHash)}, ${claim.evidenceQuote})`;
        }
        await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${post.id}, 'draft.created', ${tx.json({ tokens: usedTokens, reelFrames: reelToStore ? reelToStore.length : 0, reelRejected, model, revisionId: revision.id, evidenceHash, contentHash })})`;
        // Clearing the notes here matters: the rewrite they asked for now exists, and
        // leaving them set would re-apply the same correction to every later draft.
        if (selectedConcept?.id) await tx`UPDATE social_post_concept SET status='used', revision_feedback=NULL, updated_at=now() WHERE id=${selectedConcept.id}`;
        post.current_revision_id = revision.id;
        return post;
      });
      return send(res, 201, { post: inserted });
    }

    if (req.method === "POST" && url.pathname === "/v1/generation/recover-day") {
      const input = z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        // Clamped to the configured cadence rather than trusted. The scheduler that calls
        // this holds its own copy of the number and was still asking for five a hundred
        // and eighteen times a day after the cadence moved to two — so every run judged
        // the day three short, kept generating against a bank that did not need it, and
        // raised an alert about a shortfall that was not one. The cadence is a setting on
        // this side; a caller asking for more than it is a caller that has not been told.
        target: z.number().int().min(1).max(5).default(postsPerDay).transform(value => Math.min(value, postsPerDay)),
        maxRounds: z.number().int().min(1).max(8).default(6),
        maxConcepts: z.number().int().min(1).max(5).default(postsPerDay),
        // This is a runaway guard, not a production target. Capped at 20 it decided the
        // day was over while slots were still empty: five posts at the observed pass rate
        // needs more tries than that, and stopping short is the one outcome the schedule
        // cannot absorb. Real scarcity is enforced where it actually exists — the token
        // gate defers when Groq's day is gone, and provider failures are refunded below —
        // so this only has to stop a loop that has genuinely run out of ideas.
        dailyAttemptBudget: z.number().int().min(5).max(200).default(40),
        // Publishing is a queue: a post takes the next free slot, and an overdue one is
        // pushed forward rather than lost. Generation was not — it filled today and
        // stopped, so a day the model had trouble with left the queue short with nothing
        // behind it to draw on. Working ahead turns a bad day into a smaller buffer
        // instead of an empty slot.
        lookaheadDays: z.number().int().min(0).max(7).default(0),
        // n8n kills the request at its own timeout, which leaves the work half done and
        // the day's lock still held, so the next tick is refused and the minute is lost.
        // Stopping just short of that returns what was finished, releases the lock, and
        // lets the following run carry on — the loop is resumable by design.
        maxRunSeconds: z.number().int().min(30).max(3600).default(480),
      }).parse(await readJson(req));
      const requestedDay = input.date || lisbonDate(new Date());

      // Work the earliest day that is still short. A day already holding its five costs
      // nothing to skip, so successive runs move the buffer outward on their own.
      // A day whose posting times have all passed cannot be filled any more, however
      // short it is. Recovery used to keep choosing it anyway — today held one post
      // against a target of two, so every run for the rest of the evening worked on a day
      // that could no longer publish, and tomorrow was never written. The owner asked
      // when tomorrow's posts would appear and the honest answer was: they would not.
      const lastSlotToday = dailyPublishSlots.length
        ? dailyPublishSlots[dailyPublishSlots.length - 1]!
        : ([23, 59] as const);
      const dayIsSpent = (candidate: string) =>
        candidate === lisbonDate(new Date())
        && Date.now() > lisbonSlotUtc(candidate, lastSlotToday[0], lastSlotToday[1]).getTime();

      let day = requestedDay;
      for (let offset = 0; offset <= input.lookaheadDays; offset++) {
        const candidate = addLisbonDays(requestedDay, offset);
        day = candidate;
        if (dayIsSpent(candidate)) continue;
        const [held] = await sql`
          SELECT count(*) AS count FROM social_post
          WHERE planned_for=${candidate} AND archived_at IS NULL
            AND status IN ('ready_for_review','approved','render_queued','rendered','scheduled','published')
        `;
        if (Number(held.count) < input.target) break;
      }
      if (recoveryDaysInProgress.has(day)) return send(res, 409, { error: "Recovery is already running for this date; the next scheduled cycle will retry." });
      recoveryDaysInProgress.add(day);
      try {
      const deadline = Date.now() + input.maxRunSeconds * 1000;
      const outOfTime = () => Date.now() >= deadline;
      const attempts: Array<{ round: number; stage: string; ok: boolean; replacements?: number; conceptId?: string; topic?: string | null; status?: number; error?: string | null }> = [];
      const reviews: Array<{ postId: string; ok: boolean; status: number; error: string | null }> = [];
      let replacements = 0;
      const [attemptCount] = await sql`SELECT count(*) AS count FROM social_event WHERE event_type='generation.candidate_attempted' AND payload->>'day'=${day}`;
      let attemptsUsed = Number(attemptCount.count);
      let budgetExhausted = attemptsUsed >= input.dailyAttemptBudget;
      for (let round = 1; round <= input.maxRounds && !outOfTime(); round++) {
        const [count] = await sql`SELECT count(*) AS count FROM social_post WHERE planned_for=${day} AND archived_at IS NULL AND status IN ('ready_for_review','approved','render_queued','rendered','scheduled','published')`;
        if (Number(count.count) >= input.target) break;
        let queue = await internalApi("GET", `/v1/planning/queue?date=${encodeURIComponent(day)}`);
        let concepts = (queue.result.concepts || []) as Array<{ id: string; topic?: string }>;
        if (!concepts.length) {
          const replaced = await internalApi("POST", "/v1/reserve/replace-held", { date: day });
          const replacementRows = (replaced.result.replacements || []) as unknown[];
          replacements += replacementRows.length;
          attempts.push({ round, stage: "replacement", ok: replaced.ok, replacements: replacementRows.length });
          if (!replaced.ok || !replacementRows.length) break;
          queue = await internalApi("GET", `/v1/planning/queue?date=${encodeURIComponent(day)}`);
          concepts = (queue.result.concepts || []) as Array<{ id: string; topic?: string }>;
        }
        if (!concepts.length) break;
        const missing = Math.max(0, input.target - Number(count.count));
        for (const concept of concepts.slice(0, Math.min(missing, input.maxConcepts))) {
          if (attemptsUsed >= input.dailyAttemptBudget) { budgetExhausted = true; break; }
          // A single generation can take minutes on a free standby, so the check goes
          // here rather than only between rounds.
          if (outOfTime()) break;
          await sql`INSERT INTO social_event(event_type,payload) VALUES('generation.candidate_attempted',${sql.json({day,conceptId:concept.id,topic:concept.topic||null,attemptNumber:attemptsUsed+1,attemptBudget:input.dailyAttemptBudget})})`;
          attemptsUsed++;
          // Paying is a last resort in two senses: the free chain has to have refused
          // first, which generateStructured enforces, and the day has to be genuinely
          // short after the free budget has had a real go at it, which is this. Half the
          // attempts spent and still under target is the line — before that, a shortfall
          // is just a day in progress.
          const spentHalfTheBudget = attemptsUsed >= Math.floor(input.dailyAttemptBudget / 2);
          const stillShort = Number(count.count) < input.target;
          // An exhausted free allowance is its own reason to pay: every attempt then
          // fails instantly and the older "half the attempt budget is spent" test would
          // keep paid locked while nothing whatsoever was achieved.
          //
          // But paying is only worth it when the model is the thing standing in the way.
          // Opening it on that basis alone spent thirty-one paid calls and a quarter of a
          // million tokens in half an hour and produced no draft at all, because the
          // drafts were failing content and evidence rules — which a better model writes
          // no faster. Each of the three attempts for a concept was reaching for paid,
          // and each attempt failed the same way it had before.
          //
          // So: once per concept, on its first attempt only. If the first paid draft is
          // refused for what it says rather than for who wrote it, the next two tries are
          // free ones, and the concept keeps its place for another day.
          const freeAllowanceGone = llmDailyBudget().remaining <= 12_000;
          const worthPaying = (attempt: number) => attempt === 1 && (spentHalfTheBudget || freeAllowanceGone);
          const generated = await internalApi("POST", "/v1/generate", {
            conceptId: concept.id,
            allowPaid: stillShort && worthPaying(1),
          });
          attempts.push({ round, stage: "generation", conceptId: concept.id, topic: concept.topic || null, ok: generated.ok, status: generated.status, error: generated.ok ? null : String(generated.result.detail || generated.result.error || "generation failed") });
          // A provider outage is not an editorial attempt. Refunding it keeps the daily
          // budget meaningful: it should measure how many topics we tried, not how many
          // times the free tier was busy. The concept stays planned for the next cycle.
          if (generated.status === 503) {
            await sql`DELETE FROM social_event WHERE event_type='generation.candidate_attempted' AND payload->>'day'=${day} AND payload->>'conceptId'=${String(concept.id)} AND payload->>'attemptNumber'=${String(attemptsUsed)}`;
            attemptsUsed--;
            continue;
          }
          const postId=generated.ok&&generated.result.post&&typeof generated.result.post==='object'?String((generated.result.post as Record<string,unknown>).id||''):'';
          if(postId){const reviewed=await internalApi("POST",`/v1/posts/${postId}/request-review`,{expiresInMinutes:180});reviews.push({postId,ok:reviewed.ok,status:reviewed.status,error:reviewed.ok?null:String(reviewed.result.error||"review request failed")});if(!reviewed.ok)await sql.begin(async tx=>{await tx`UPDATE social_post SET status='failed',updated_at=now() WHERE id=${postId} AND status='draft'`;await returnConceptForRepair(tx,{topic:String(concept.topic||""),plannedFor:day,reason:`The previous draft was refused on its way to review: ${refusalReason(reviewed.result as Record<string, unknown>)}. Rewrite it so it passes.`});await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${postId},'review.handoff_failed',${tx.json({conceptId:concept.id,error:String(reviewed.result.error||"review request failed")})})`;await requestReplacement(tx,{publishDate:day,reason:`review handoff failed: ${String(reviewed.result.error||"review request failed")}`,postId});});}
        }
        if (budgetExhausted) break;
      }
      const posts = await sql`SELECT id,topic,status FROM social_post WHERE planned_for=${day} AND archived_at IS NULL AND status IN ('ready_for_review','approved','render_queued','rendered','scheduled','published') ORDER BY created_at`;
      const complete = posts.length >= input.target;
      const drafts = await sql`SELECT id FROM social_post WHERE planned_for=${day} AND status='draft' ORDER BY created_at`;
      for (const draft of drafts) {
        if(reviews.some(review=>review.postId===String(draft.id)))continue;
        const reviewed = await internalApi("POST", `/v1/posts/${draft.id}/request-review`, { expiresInMinutes: 180 });
        reviews.push({ postId: String(draft.id), ok: reviewed.ok, status: reviewed.status, error: reviewed.ok ? null : String(reviewed.result.error || "review request failed") });
        if(!reviewed.ok)await sql.begin(async tx=>{const [post]=await tx`UPDATE social_post SET status='failed',updated_at=now() WHERE id=${draft.id} AND status='draft' RETURNING topic,planned_for`;if(post){await returnConceptForRepair(tx,{topic:String(post.topic),plannedFor:post.planned_for,reason:`The previous draft was refused on its way to review: ${refusalReason(reviewed.result as Record<string, unknown>)}. Rewrite it so it passes.`});await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${draft.id},'review.handoff_failed',${tx.json({error:String(reviewed.result.error||"review request failed")})})`;}});
      }
      const ready = complete && reviews.every(review => review.ok);
      budgetExhausted = !complete && attemptsUsed >= input.dailyAttemptBudget;

      // Settle the day's outstanding replacement debts. The day being back at target is
      // what "filled" means — a specific post cannot be traced to a specific loss, and
      // pretending otherwise would only make the record look more precise than it is.
      // A post that was never made leaves the same hole as one that was lost, so it
      // files the same debt. Without this the two failures were reported differently:
      // a withdrawn post raised an alert, a day that simply came up short returned a
      // flag in a response body that only the scheduler ever read.
      // Only for a day that has actually run. Recovery works ahead by design, so a
      // future day is normally incomplete and owes nothing yet; a post genuinely lost
      // from a future day still files its own debt through requestReplacement.
      const gap = day <= lisbonDate(new Date()) ? Math.max(0, input.target - posts.length) : 0;
      if (gap > 0) {
        // Counted across every status except 'filled'. Counting only the open ones meant
        // each run re-filed a shortfall the previous run had just closed as unfillable,
        // so the debt grew by the size of the gap every cycle and the alert text changed
        // with it — which also defeated the alert's own de-duplication. Aug 23 reached
        // fourteen owed posts on a day that was three short.
        const [recorded] = await sql`SELECT count(*) AS count FROM social_replacement_request WHERE publish_date=${day} AND status<>'filled'`;
        for (let i = Number(recorded.count); i < gap; i++) {
          await sql`INSERT INTO social_replacement_request (publish_date, reason) VALUES (${day}, ${`the day finished ${gap} post(s) short of ${input.target}`})`;
        }
      }
      const owed = await sql`SELECT id, reason, source_post_id FROM social_replacement_request WHERE publish_date=${day} AND status='open' ORDER BY created_at`;
      let replacementsFilled = 0;
      let replacementsUnfillable = 0;
      if (complete) {
        // Including the ones already written off. A day that was short at nine in the
        // morning and whole by lunchtime should not keep a failure on its record, and
        // leaving it there kept the seven-day summary reporting a shortfall that no
        // longer existed.
        const settled = await sql`UPDATE social_replacement_request SET status='filled', updated_at=now() WHERE publish_date=${day} AND status<>'filled' RETURNING id`;
        replacementsFilled = settled.length;
        if (replacementsFilled) await sql`INSERT INTO social_event(event_type,payload) VALUES('publish.replacement_filled',${sql.json({ day, filled: replacementsFilled })})`;
      } else if (owed.length && day <= lisbonDate(new Date())) {
        // The day is short and cannot be worked any further this cycle. Whether that is
        // because the bank is empty, the token budget is gone or the clock ran out, the
        // one thing that must not happen is for it to pass unnoticed.
        //
        // Only for today or a day already gone. A day in the future being incomplete is
        // not a failure, it is a day that has not happened yet — recovery works ahead by
        // design, and alerting on that reported every look at tomorrow as a crisis.
        const exhausted = budgetExhausted || outOfTime() || !(await conceptsRemainingFor(day));
        const [alreadyToldSomeone] = await sql`SELECT count(*) AS count FROM social_replacement_request WHERE publish_date=${day} AND alerted_at IS NOT NULL`;
        if (exhausted && !Number(alreadyToldSomeone.count)) {
          const marked = await sql`UPDATE social_replacement_request SET status='unfillable', alerted_at=now(), updated_at=now() WHERE publish_date=${day} AND status='open' RETURNING id, reason`;
          replacementsUnfillable = marked.length;
          const cause = budgetExhausted ? "the day's generation budget was spent" : outOfTime() ? "the recovery run hit its time limit" : "no eligible topic remained in the bank";
          await sql`INSERT INTO social_event(event_type,payload) VALUES('operations.alert_sent',${sql.json({ kind: 'replacement_unfillable', day, owed: marked.length, validPosts: posts.length, target: input.target, cause })})`;
          await notifyDiscord(`Finkavo: ${day} is short ${input.target - posts.length} post(s) and cannot be refilled`, {
            day,
            postsHeld: `${posts.length} of ${input.target}`,
            replacementsOwed: marked.length,
            cause,
            lostBecause: marked.map(row => String(row.reason)).slice(0, 5).join("\n"),
          });
        }
      }

      await sql`INSERT INTO social_event(event_type,payload) VALUES('generation.day_recovery_completed',${sql.json({day,target:input.target,complete,ready,validPosts:posts.length,replacements,attempts,reviews,attemptsUsed,attemptBudget:input.dailyAttemptBudget,budgetExhausted,replacementsOwed:owed.length,replacementsFilled,replacementsUnfillable})})`;
      return send(res, 200, { date: day, target: input.target, ranOutOfTime: outOfTime(), complete, ready, alertRequired: budgetExhausted || replacementsUnfillable > 0, validPosts: posts.length, replacements, posts, attempts, reviews, attemptsUsed, attemptBudget: input.dailyAttemptBudget, budgetExhausted, replacementsOwed: owed.length, replacementsFilled, replacementsUnfillable });
      } finally {
        recoveryDaysInProgress.delete(day);
      }
    }

    // Idempotent safety net: sends any of today's drafts that recovery did not already
    // hand to review. Replaces the WF-05 graph (GET posts -> Code -> IF -> POST review),
    // so the scheduler no longer needs branching. An empty queue is a normal no-op.
    if (req.method === "POST" && url.pathname === "/v1/review/request-pending") {
      const day = lisbonDate(new Date());
      const drafts = await sql`SELECT id FROM social_post WHERE planned_for=${day} AND status='draft' ORDER BY created_at`;
      if (!drafts.length) return send(res, 200, { date: day, pending: 0, requested: 0, results: [] });
      const results: Array<{ postId: string; ok: boolean; status: number; error: string | null }> = [];
      for (const draft of drafts) {
        const reviewed = await internalApi("POST", `/v1/posts/${draft.id}/request-review`, { expiresInMinutes: 180 });
        results.push({
          postId: String(draft.id),
          ok: reviewed.ok,
          status: reviewed.status,
          error: reviewed.ok ? null : String(reviewed.result.error || "review request failed"),
        });
      }
      const failures = results.filter(item => !item.ok).length;
      await sql`INSERT INTO social_event (event_type, payload) VALUES ('review.request_pending', ${sql.json({ date: day, pending: drafts.length, failures })})`;
      return send(res, 200, { date: day, pending: drafts.length, requested: results.length - failures, failures, results });
    }

    if (req.method === "GET" && url.pathname === "/v1/posts") {
      const status = url.searchParams.get("status");
      const createdOn = url.searchParams.get("createdOn");
      const createdDate = createdOn === "today" ? lisbonDate(new Date()) : createdOn;
      const plannedFor = url.searchParams.get("plannedFor");
      const plannedDate = plannedFor === "today" ? lisbonDate(new Date()) : plannedFor;
      if (createdDate && !/^\d{4}-\d{2}-\d{2}$/.test(createdDate)) return send(res, 400, { error: "createdOn must be today or YYYY-MM-DD" });
      if (plannedDate && !/^\d{4}-\d{2}-\d{2}$/.test(plannedDate)) return send(res, 400, { error: "plannedFor must be today or YYYY-MM-DD" });
      const rows = status && plannedDate
        ? await sql`SELECT * FROM social_post WHERE status=${status} AND planned_for=${plannedDate} ORDER BY created_at DESC LIMIT 5`
        : status && createdDate
        ? await sql`SELECT * FROM social_post WHERE status=${status} AND (created_at AT TIME ZONE 'Europe/Lisbon')::DATE=${createdDate} ORDER BY created_at DESC LIMIT 5`
          : status
          ? await sql`SELECT * FROM social_post WHERE status=${status} ORDER BY created_at DESC LIMIT 50`
          : plannedDate
            ? await sql`SELECT * FROM social_post WHERE planned_for=${plannedDate} ORDER BY created_at DESC LIMIT 50`
          : createdDate
            ? await sql`SELECT * FROM social_post WHERE (created_at AT TIME ZONE 'Europe/Lisbon')::DATE=${createdDate} ORDER BY created_at DESC LIMIT 50`
            : await sql`SELECT * FROM social_post ORDER BY created_at DESC LIMIT 50`;
      return send(res, 200, { createdOn: createdDate || null, plannedFor: plannedDate || null, posts: rows });
    }

    if (req.method === "POST" && url.pathname === "/v1/automation/advance") {
      const now = new Date();
      const minimum = now.getTime() + 15 * 60_000;
      const result = await sql.begin(async (tx) => {
        const approved = await tx`
          SELECT p.*, r.id AS revision_id, r.slides AS revision_slides, r.call_to_action AS revision_cta,
                 r.evidence_hash, r.content_hash
          FROM social_post p JOIN social_post_revision r ON r.id=p.approved_revision_id
          WHERE p.status='approved' AND p.current_revision_id=p.approved_revision_id
          ORDER BY p.approved_at LIMIT 10 FOR UPDATE OF p
        `;
        const renders: string[] = [];
        for (const row of approved) {
          try { assertPublishableCopy(row as Record<string, unknown>); } catch (error) {
            await tx`UPDATE social_post SET status='blocked',updated_at=now() WHERE id=${row.id}`;
            await tx`INSERT INTO social_event (post_id,event_type,payload) VALUES (${row.id},'quality.blocked',${tx.json({ stage: 'render_queue', reason: error instanceof Error ? error.message : 'quality failure' })})`;
            continue;
          }
          const idempotencyKey = `render:${row.id}:${row.revision_id}`;
          const [existing] = await tx`SELECT * FROM social_render_job WHERE idempotency_key=${idempotencyKey} FOR UPDATE`;
          if (existing?.status === "completed" && Array.isArray(existing.output_files) && existing.output_files.length) {
            await tx`UPDATE social_post SET status='rendered',rendered_at=COALESCE(rendered_at,now()),render_files=${tx.json(existing.output_files)},updated_at=now() WHERE id=${row.id}`;
            await tx`INSERT INTO social_event (post_id,event_type,payload) VALUES (${row.id},'render.approved_reused',${tx.json({jobId:existing.id,revisionId:row.revision_id})})`;
            continue;
          }
          if (existing) continue;
          // One post whose copy breaks a render contract used to take the whole batch with
          // it. createRenderManifest enforces per-field character limits and throws, and this
          // call sat outside the guard that already wraps the copy check above — so a single
          // over-long cover subtitle aborted the transaction and every approved post behind
          // it stopped moving. Three were stuck for a day that way, which reads from Buffer
          // as an empty Drafts folder with no explanation.
          let manifest: ReturnType<typeof createRenderManifest>;
          try {
            manifest = createRenderManifest(row as Record<string, unknown>, { id: row.revision_id, slides: row.revision_slides, call_to_action: row.revision_cta } as never);
          } catch (error) {
            await tx`UPDATE social_post SET status='blocked',updated_at=now() WHERE id=${row.id}`;
            await tx`INSERT INTO social_event (post_id,event_type,payload) VALUES (${row.id},'quality.blocked',${tx.json({ stage: 'render_manifest', reason: error instanceof Error ? error.message : 'render contract' })})`;
            continue;
          }
          const [job] = await tx`INSERT INTO social_render_job (post_id,revision_id,idempotency_key,manifest,manifest_hash) VALUES (${row.id},${row.revision_id},${idempotencyKey},${tx.json(manifest)},${hash(manifest)}) RETURNING id`;
          await tx`UPDATE social_post SET status='render_queued',updated_at=now() WHERE id=${row.id}`;
          await tx`INSERT INTO social_event (post_id,event_type,payload) VALUES (${row.id},'render.queued',${tx.json({ jobId: job.id, revisionId: row.revision_id, automated: true })})`;
          renders.push(String(row.id));
        }

        const occupiedRows = await tx`SELECT scheduled_at FROM social_publish_job WHERE scheduled_at >= ${new Date(minimum).toISOString()} AND status NOT IN ('failed','blocked')`;
        const occupied = new Set(occupiedRows.map(row => new Date(String(row.scheduled_at)).toISOString()));
        const candidates: Date[] = [];
        const today = lisbonDate(now);
        for (let dayOffset = 0; dayOffset < 8; dayOffset++) for (const [hour, minute] of dailyPublishSlots) {
          const slot = lisbonSlotUtc(addLisbonDays(today, dayOffset), hour, minute);
          if (slot.getTime() >= minimum && !occupied.has(slot.toISOString())) candidates.push(slot);
        }
        const overdue = await tx`
          SELECT * FROM social_publish_job
          WHERE status IN ('pending','retrying') AND scheduled_at < ${new Date(minimum).toISOString()}
          ORDER BY scheduled_at FOR UPDATE
        `;
        const rescheduled: Array<{ postId: string; scheduledAt: string }> = [];
        for (const job of overdue) {
          const slot = candidates.shift();
          if (!slot) break;
          const availableAt = publishAvailableAt(slot, now);
          await tx`UPDATE social_publish_job SET scheduled_at=${slot.toISOString()},available_at=${availableAt.toISOString()},error_code=NULL,error_message=NULL,updated_at=now() WHERE id=${job.id}`;
          await tx`UPDATE social_post SET scheduled_at=${slot.toISOString()},updated_at=now() WHERE id=${job.post_id}`;
          await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${job.post_id},'publish.rescheduled_local',${tx.json({jobId:job.id,previousScheduledAt:job.scheduled_at,scheduledAt:slot.toISOString()})})`;
          rescheduled.push({postId:String(job.post_id),scheduledAt:slot.toISOString()});
        }
        const rendered = await tx`
          SELECT p.*, r.id AS revision_id, j.id AS render_job_id
          FROM social_post p JOIN social_post_revision r ON r.id=p.approved_revision_id
          JOIN social_render_job j ON j.post_id=p.id AND j.revision_id=r.id AND j.status='completed'
          WHERE p.status='rendered' AND p.current_revision_id=p.approved_revision_id
          ORDER BY p.rendered_at LIMIT 10 FOR UPDATE OF p
        `;
        const scheduled: Array<{ postId: string; scheduledAt: string }> = [];
        for (const post of rendered) {
          try { assertPublishableCopy(post as Record<string, unknown>); } catch (error) {
            await tx`UPDATE social_post SET status='blocked',updated_at=now() WHERE id=${post.id}`;
            await tx`INSERT INTO social_event (post_id,event_type,payload) VALUES (${post.id},'quality.blocked',${tx.json({ stage: 'publish_queue', reason: error instanceof Error ? error.message : 'quality failure' })})`;
            continue;
          }
          const slot = candidates.shift();
          if (!slot) break;
          const idempotencyKey = `buffer:${post.id}:${post.revision_id}:${slot.toISOString()}`;
          const [existing] = await tx`SELECT id FROM social_publish_job WHERE post_id=${post.id} AND revision_id=${post.revision_id}`;
          if (existing) continue;
          const availableAt = publishAvailableAt(slot, now);
          const { job, decided } = await schedulePublishJob(tx, { post: post as Record<string, unknown>, scheduledAt: slot.toISOString(), availableAt: availableAt.toISOString(), idempotencyKey });
          await tx`UPDATE social_post SET scheduled_at=${slot.toISOString()},updated_at=now() WHERE id=${post.id}`;
          await tx`INSERT INTO social_event (post_id,event_type,payload) VALUES (${post.id},'publish.queued',${tx.json({ jobId: job.id, scheduledAt: slot.toISOString(), automated: true, format: decided.format, formatReason: decided.reason })})`;
          scheduled.push({ postId: String(post.id), scheduledAt: slot.toISOString() });
          occupied.add(slot.toISOString());
        }
        return { renders, scheduled, rescheduled };
      });
      return send(res, 200, result);
    }

    const reviewRequest = url.pathname.match(/^\/v1\/posts\/([0-9a-f-]+)\/request-review$/i);
    if (req.method === "POST" && reviewRequest) {
      const { expiresInMinutes, dryRun } = ReviewRequestSchema.parse(await readJson(req));
      const [previewSource] = await sql`
        SELECT p.*, r.id AS revision_id, r.slides AS revision_slides, r.call_to_action AS revision_cta,
               r.hook AS revision_hook, r.caption AS revision_caption, r.hashtags AS revision_hashtags,
               r.source_bundle AS revision_sources
        FROM social_post p JOIN social_post_revision r ON r.id = p.current_revision_id
        WHERE p.id = ${reviewRequest[1]} AND p.status = 'draft'
      `;
      if (!previewSource) return send(res, 409, { error: "Only a current draft revision can be sent for review" });
      const scoredSlides=(previewSource.revision_slides as Array<{title?:string;body?:string;items?:string[];sourceLabel?:string}>).map(slide=>({...slide,sourceLabel:slide.sourceLabel||String(previewSource.source_authority||"Official source")}));
      const quality=editorialScore({topic:String(previewSource.topic),hook:String(previewSource.revision_hook),caption:String(previewSource.revision_caption),callToAction:String(previewSource.revision_cta),hashtags:previewSource.revision_hashtags as string[],slides:scoredSlides,sources:previewSource.revision_sources as Array<{url?:string;tier?:string}>,riskLevel:String(previewSource.risk_level),subjectFamily:String(previewSource.subject_family||""),userQuestion:String(previewSource.user_question||""),contentIntent:String(previewSource.content_intent||"")});
      if(!quality.passed){if(!dryRun)await sql.begin(async tx=>{await tx`UPDATE social_post SET status='blocked',updated_at=now() WHERE id=${previewSource.id}`;await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${previewSource.id},'quality.editorial_score_blocked',${tx.json({stage:'pre_discord',score:quality.score,failures:quality.failures})})`;});return send(res,422,{error:"Post failed the pre-Discord editorial gate",dryRun,...quality});}
      const reliability=await assessStoredRevision(String(previewSource.id),String(previewSource.revision_id));
      if(!reliability.passed){if(!dryRun)await sql.begin(async tx=>{await tx`UPDATE social_post SET status='blocked',updated_at=now() WHERE id=${previewSource.id}`;await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${previewSource.id},'evidence.reliability_blocked',${tx.json({stage:'pre_review',...reliability})})`;});return send(res,422,{error:"Post failed the evidence reliability gate",dryRun,...reliability});}
      const duplicate = await findRecentDuplicate(previewSource as DuplicateCandidate, String(previewSource.id));
      if (duplicate && !dryRun) {
        await sql.begin(async tx => {
          await tx`UPDATE social_review_token SET used_at=now() WHERE post_id=${previewSource.id} AND used_at IS NULL`;
          await tx`UPDATE social_post SET status='blocked',updated_at=now() WHERE id=${previewSource.id} AND status='draft'`;
          await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${previewSource.id},'quality.duplicate_blocked',${tx.json({ duplicateOf: String(duplicate.post.id), reason: duplicate.reason, stage: 'review_request' })})`;
        });
        return send(res, 409, { error: "Duplicate topic blocked", duplicateOf: duplicate.post.id, reason: duplicate.reason });
      }
      if(duplicate&&dryRun)return send(res,409,{error:"Duplicate topic blocked",dryRun:true,duplicateOf:duplicate.post.id,reason:duplicate.reason});
      if (reviewMode === "buffer_draft") {
        // Everything above this line still ran: the editorial score, the evidence
        // reliability check and the duplicate check. What is skipped is only the preview
        // render, the signed link and the Discord message, because the post is about to
        // appear in Buffer where it can be read on the phone that would have opened them.
        if (dryRun) return send(res, 200, { dryRun: true, mode: reviewMode, postId: String(previewSource.id), revisionId: String(previewSource.revision_id), quality });
        await sql.begin(async tx => {
          const [revision] = await tx`SELECT evidence_hash FROM social_post_revision WHERE id=${previewSource.revision_id}`;
          await tx`
            INSERT INTO social_approval (post_id, revision_id, evidence_hash, decision, reviewer, comment)
            VALUES (${previewSource.id}, ${previewSource.revision_id}, ${String(revision?.evidence_hash ?? "")}, 'approved', 'buffer_draft_review', 'Gates passed; the owner approves this in Buffer by moving it out of drafts.')
          `;
          await tx`
            UPDATE social_post SET status='approved', approved_revision_id=${previewSource.revision_id},
              approved_at=now(), approved_by='buffer_draft_review', updated_at=now()
            WHERE id=${previewSource.id} AND status='draft'
          `;
          await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${previewSource.id},'review.delegated_to_buffer',${tx.json({ revisionId: String(previewSource.revision_id), score: quality.score })})`;
        });
        return send(res, 200, { postId: String(previewSource.id), revisionId: String(previewSource.revision_id), mode: reviewMode, quality });
      }

      const previewFiles = await renderReviewPreview(createRenderManifest(previewSource as Record<string, unknown>, {
        id: previewSource.revision_id,
        slides: previewSource.revision_slides,
        call_to_action: previewSource.revision_cta,
      }));
      if(dryRun)return send(res,200,{dryRun:true,postId:String(previewSource.id),revisionId:String(previewSource.revision_id),quality,previewFiles});
      await persistReviewedRender(previewSource as Record<string, unknown>, {
        id: previewSource.revision_id,
        slides: previewSource.revision_slides,
        call_to_action: previewSource.revision_cta,
      }, previewFiles);
      const rawToken = randomBytes(32).toString("base64url");
      const [created] = await sql.begin(async (tx) => {
        const [post] = await tx`
          SELECT p.id, p.status, p.current_revision_id, r.evidence_hash
          FROM social_post p JOIN social_post_revision r ON r.id = p.current_revision_id
          WHERE p.id = ${reviewRequest[1]} AND p.status = 'draft'
          FOR UPDATE OF p
        `;
        if (!post) return [];
        await tx`UPDATE social_review_token SET used_at = now() WHERE post_id = ${post.id} AND used_at IS NULL`;
        const [token] = await tx`
          INSERT INTO social_review_token (token_hash, post_id, revision_id, evidence_hash, expires_at)
          VALUES (${hash(rawToken)}, ${post.id}, ${post.current_revision_id}, ${post.evidence_hash}, now() + (${expiresInMinutes}::STRING || ' minutes')::INTERVAL)
          RETURNING expires_at
        `;
        await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${post.id}, 'review.requested', ${tx.json({ revisionId: post.current_revision_id, expiresInMinutes })})`;
        await tx`UPDATE social_post SET status='ready_for_review',updated_at=now() WHERE id=${post.id}`;
        return [token];
      });
      if (!created) return send(res, 409, { error: "Only a current draft revision can be sent for review" });
      const base = reviewBaseUrl || `${url.protocol}//${url.host}`;
      const reviewUrl = `${base.replace(/\/$/, "")}/review/${rawToken}`;
      const finalCaption = composeInstagramCaption({
        hook: String(previewSource.revision_hook),
        body: String(previewSource.revision_caption),
        callToAction: String(previewSource.revision_cta),
        hashtags: previewSource.revision_hashtags as string[],
      });
      // Review happens in Buffer drafts now; nothing to announce here.
      return send(res, 201, { reviewUrl, expiresAt: created.expires_at });
    }

    const recoverReviewed = url.pathname.match(/^\/v1\/posts\/([0-9a-f-]+)\/recover-reviewed-render$/i);
    if (req.method === "POST" && recoverReviewed) {
      const [source] = await sql`
        SELECT p.*,r.id AS revision_id,r.slides AS revision_slides,r.call_to_action AS revision_cta
        FROM social_post p JOIN social_post_revision r ON r.id=p.approved_revision_id
        WHERE p.id=${recoverReviewed[1]} AND p.current_revision_id=p.approved_revision_id
          AND p.status IN ('approved','render_queued','rendering','failed')
      `;
      if (!source) return send(res, 409, { error: "Only the current approved revision can be recovered" });
      const slideCount = (source.revision_slides as unknown[]).length;
      const renderRoot = path.resolve(process.env.RENDER_OUTPUT_DIR || "./data/renders");
      const files = Array.from({ length: slideCount }, (_, index) => path.join(renderRoot, String(source.id), String(source.revision_id), `${String(index + 1).padStart(2, "0")}.png`));
      const recovered = await persistReviewedRender(source as Record<string, unknown>, { id: source.revision_id, slides: source.revision_slides, call_to_action: source.revision_cta }, files);
      return send(res, 200, { postId: source.id, job: recovered.job, files: recovered.files });
    }

    const renderRequest = url.pathname.match(/^\/v1\/posts\/([0-9a-f-]+)\/request-render$/i);
    if (req.method === "POST" && renderRequest) {
      const { idempotencyKey } = RenderRequestSchema.parse(await readJson(req));
      const job = await sql.begin(async (tx) => {
        const [existing] = await tx`SELECT * FROM social_render_job WHERE idempotency_key = ${idempotencyKey}`;
        if (existing) return existing;
        const [row] = await tx`
          SELECT p.*, r.id AS revision_id, r.slides AS revision_slides, r.call_to_action AS revision_cta,
                 r.evidence_hash, r.content_hash
          FROM social_post p JOIN social_post_revision r ON r.id = p.approved_revision_id
          WHERE p.id = ${renderRequest[1]} AND p.status = 'approved' AND p.current_revision_id = p.approved_revision_id
          FOR UPDATE OF p
        `;
        if (!row) return null;
        const [approval] = await tx`SELECT id FROM social_approval WHERE post_id = ${row.id} AND revision_id = ${row.revision_id} AND evidence_hash = ${row.evidence_hash} AND decision = 'approved' ORDER BY decided_at DESC LIMIT 1`;
        if (!approval) return null;
        const manifest = createRenderManifest(row as Record<string, unknown>, { id: row.revision_id, slides: row.revision_slides, call_to_action: row.revision_cta });
        const [created] = await tx`
          INSERT INTO social_render_job (post_id, revision_id, idempotency_key, manifest, manifest_hash)
          VALUES (${row.id}, ${row.revision_id}, ${idempotencyKey}, ${tx.json(manifest)}, ${hash(manifest)}) RETURNING *
        `;
        await tx`UPDATE social_post SET status = 'render_queued', updated_at = now() WHERE id = ${row.id}`;
        await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${row.id}, 'render.queued', ${tx.json({ jobId: created.id, revisionId: row.revision_id })})`;
        return created;
      });
      return job ? send(res, 201, { job }) : send(res, 409, { error: "An exact current approval is required before rendering" });
    }

    if (req.method === "POST" && url.pathname === "/v1/render-jobs/claim") {
      const workerId = z.string().min(3).max(120).parse(req.headers["x-renderer-id"]);
      const job = await sql.begin(async (tx) => {
        await tx`UPDATE social_render_job SET status = 'retrying', lease_owner = NULL, lease_expires_at = NULL, available_at = now(), updated_at = now() WHERE status = 'leased' AND lease_expires_at < now()`;
        const [candidate] = await tx`SELECT * FROM social_render_job WHERE status IN ('pending','retrying') AND available_at <= now() ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED`;
        if (!candidate) return null;
        const [attemptRow] = await tx`SELECT COALESCE(max(attempt_number), 0) + 1 AS next_attempt FROM social_render_attempt WHERE job_id = ${candidate.id}`;
        const attempt = Number(attemptRow.next_attempt);
        const [claimed] = await tx`UPDATE social_render_job SET status = 'leased', attempt_count = ${attempt}, lease_owner = ${workerId}, lease_expires_at = now() + INTERVAL '10 minutes', updated_at = now() WHERE id = ${candidate.id} RETURNING *`;
        await tx`INSERT INTO social_render_attempt (job_id, attempt_number, worker_id) VALUES (${candidate.id}, ${attempt}, ${workerId})`;
        await tx`UPSERT INTO social_renderer_heartbeat (worker_id, version, last_seen_at, details) VALUES (${workerId}, 'finkavo-v3', now(), ${tx.json({ state: "rendering", jobId: candidate.id })})`;
        return claimed;
      });
      return send(res, 200, { job });
    }

    const getRenderMatch = url.pathname.match(/^\/v1\/render-jobs\/([0-9a-f-]+)$/i);
    if (req.method === "GET" && getRenderMatch) {
      const [job] = await sql`SELECT id, post_id, revision_id, status, attempt_count, available_at, lease_owner, lease_expires_at, output_files, error_code, error_message, created_at, updated_at FROM social_render_job WHERE id = ${getRenderMatch[1]}`;
      return job ? send(res, 200, { job }) : send(res, 404, { error: "Render job not found" });
    }

    if (req.method === "POST" && url.pathname === "/v1/renderer/heartbeat") {
      const workerId = z.string().min(3).max(120).parse(req.headers["x-renderer-id"]);
      await sql`UPSERT INTO social_renderer_heartbeat (worker_id, version, last_seen_at, details) VALUES (${workerId}, 'finkavo-v3', now(), ${sql.json({ state: "idle" })})`;
      return send(res, 200, { ok: true });
    }

    const retryRenderMatch = url.pathname.match(/^\/v1\/render-jobs\/([0-9a-f-]+)\/retry$/i);
    if (req.method === "POST" && retryRenderMatch) {
      const [job] = await sql.begin(async (tx) => {
        const [failed] = await tx`
          SELECT j.* FROM social_render_job j
          JOIN social_post p ON p.id = j.post_id
          WHERE j.id = ${retryRenderMatch[1]} AND j.status = 'failed'
            AND p.current_revision_id = j.revision_id
            AND p.approved_revision_id = j.revision_id
          FOR UPDATE OF j
        `;
        if (!failed) return [];
        const [updated] = await tx`
          UPDATE social_render_job SET status = 'retrying', attempt_count = 0,
            available_at = now(), lease_owner = NULL, lease_expires_at = NULL,
            error_code = NULL, error_message = NULL, updated_at = now()
          WHERE id = ${failed.id} RETURNING *
        `;
        await tx`UPDATE social_post SET status = 'render_queued', updated_at = now() WHERE id = ${failed.post_id}`;
        await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${failed.post_id}, 'render.requeued', ${tx.json({ jobId: failed.id, revisionId: failed.revision_id })})`;
        return [updated];
      });
      return job ? send(res, 200, { job }) : send(res, 409, { error: "Only a failed render of the current approved revision can be retried" });
    }

    const uploadMatch = url.pathname.match(/^\/v1\/render-jobs\/([0-9a-f-]+)\/uploads$/i);
    if (req.method === "POST" && uploadMatch) {
      const workerId = z.string().min(3).max(120).parse(req.headers["x-renderer-id"]);
      const { files } = UploadRequestSchema.parse(await readJson(req));
      const [job] = await sql`SELECT * FROM social_render_job WHERE id = ${uploadMatch[1]} AND status = 'leased' AND lease_owner = ${workerId} AND lease_expires_at > now()`;
      if (!job) return send(res, 409, { error: "Render lease is missing or expired" });
      const isReel = String(job.kind) === "reel";
      const expected = isReel ? 2 : (job.manifest as { slides: unknown[] }).slides.length;
      if (files.length !== expected) return send(res, 400, { error: `Expected ${expected} files for a ${isReel ? "reel" : "carousel"} render, received ${files.length}` });
      const date = new Date(job.created_at as string);
      const prefix = `social/${isReel ? "reels" : "carousels"}/${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${String(date.getUTCDate()).padStart(2, "0")}/${job.post_id}/${job.revision_id}`;
      const uploads = await Promise.all(files.map(async (file) => {
        // The extension follows the file rather than the convention. Naming a reel's MP4
        // "01.png" works — R2 serves the content type it was uploaded with, and Buffer
        // read it quite happily — but it is a lie on disk, and the first person to open
        // the bucket looking for a video will not find one.
        const stored: RenderFileInput = { ...file, key: `${prefix}/${String(file.index).padStart(2, "0")}.${file.mimeType === "video/mp4" ? "mp4" : "png"}` };
        return { ...stored, uploadUrl: await createUploadUrl(stored) };
      }));
      return send(res, 200, { uploads });
    }

    const completeMatch = url.pathname.match(/^\/v1\/render-jobs\/([0-9a-f-]+)\/complete$/i);
    if (req.method === "POST" && completeMatch) {
      const workerId = z.string().min(3).max(120).parse(req.headers["x-renderer-id"]);
      const { files } = CompleteRenderSchema.parse(await readJson(req));
      if (!(await Promise.all(files.map((file) => verifyUploadedObject(file)))).every(Boolean)) return send(res, 422, { error: "One or more R2 objects failed metadata verification" });
      const [completed] = await sql.begin(async (tx) => {
        const [job] = await tx`UPDATE social_render_job SET status = 'completed', output_files = ${tx.json(files)}, lease_expires_at = NULL, updated_at = now() WHERE id = ${completeMatch[1]} AND status = 'leased' AND lease_owner = ${workerId} AND lease_expires_at > now() RETURNING *`;
        if (!job) return [];
        await tx`UPDATE social_render_attempt SET finished_at = now(), outcome = 'completed' WHERE job_id = ${job.id} AND attempt_number = ${job.attempt_count}`;
        await tx`UPDATE social_post SET status = 'rendered', rendered_at = now(), render_files = ${tx.json(files)}, updated_at = now() WHERE id = ${job.post_id} AND approved_revision_id = ${job.revision_id}`;
        await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${job.post_id}, 'render.completed', ${tx.json({ jobId: job.id, files: files.map((file) => ({ key: file.key, sha256: file.sha256, bytes: file.bytes })) })})`;
        await tx`UPSERT INTO social_renderer_heartbeat (worker_id, version, last_seen_at, details) VALUES (${workerId}, 'finkavo-v3', now(), ${tx.json({ state: "idle" })})`;
        return [job];
      });
      return completed ? send(res, 200, { job: completed }) : send(res, 409, { error: "Render lease is missing or expired" });
    }

    const failRenderMatch = url.pathname.match(/^\/v1\/render-jobs\/([0-9a-f-]+)\/fail$/i);
    if (req.method === "POST" && failRenderMatch) {
      const workerId = z.string().min(3).max(120).parse(req.headers["x-renderer-id"]);
      const failure = FailJobSchema.parse(await readJson(req));
      const [updated] = await sql.begin(async (tx) => {
        const [job] = await tx`SELECT * FROM social_render_job WHERE id = ${failRenderMatch[1]} AND status = 'leased' AND lease_owner = ${workerId} FOR UPDATE`;
        if (!job) return [];
        const decision = retryDecision(Number(job.attempt_count), failure.retryable);
        const { retry, delayMinutes } = decision;
        const [next] = retry
          ? await tx`UPDATE social_render_job SET status = 'retrying', available_at = now() + (${delayMinutes!}::STRING || ' minutes')::INTERVAL, lease_owner = NULL, lease_expires_at = NULL, error_code = ${failure.code}, error_message = ${failure.message}, updated_at = now() WHERE id = ${job.id} RETURNING *`
          : await tx`UPDATE social_render_job SET status = 'failed', lease_owner = NULL, lease_expires_at = NULL, error_code = ${failure.code}, error_message = ${failure.message}, updated_at = now() WHERE id = ${job.id} RETURNING *`;
        await tx`UPDATE social_render_attempt SET finished_at = now(), outcome = ${retry ? "retrying" : "failed"}, error_code = ${failure.code}, error_message = ${failure.message} WHERE job_id = ${job.id} AND attempt_number = ${job.attempt_count}`;
        await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${job.post_id}, ${retry ? "render.retrying" : "render.failed"}, ${tx.json({ jobId: job.id, attempt: job.attempt_count, delayMinutes: retry ? delayMinutes : null, code: failure.code })})`;
        if (!retry) await tx`UPDATE social_post SET status = 'failed', updated_at = now() WHERE id = ${job.post_id}`;
        return [next];
      });
      if (updated && updated.status === "failed") await notifyDiscord("Carousel rendering failed permanently", { post: updated.post_id, job: updated.id, code: updated.error_code, attempt: updated.attempt_count });
      return updated ? send(res, 200, { job: updated }) : send(res, 409, { error: "Render job is not leased by this worker" });
    }

    const scheduleMatch = url.pathname.match(/^\/v1\/posts\/([0-9a-f-]+)\/schedule$/i);
    if (req.method === "POST" && scheduleMatch) {
      const { scheduledAt, idempotencyKey } = ScheduleSchema.parse(await readJson(req));
      if (new Date(scheduledAt).getTime() < Date.now() + 10 * 60_000) return send(res, 400, { error: "Schedule must be at least 10 minutes in the future" });
      const [approved]=await sql`SELECT approved_revision_id FROM social_post WHERE id=${scheduleMatch[1]}`;
      if(approved?.approved_revision_id){const reliability=await assessStoredRevision(scheduleMatch[1],String(approved.approved_revision_id),true);if(!reliability.passed)return send(res,422,{error:"Scheduling blocked by final evidence validation",...reliability});}
      const job = await sql.begin(async (tx) => {
        const [existing] = await tx`SELECT * FROM social_publish_job WHERE idempotency_key = ${idempotencyKey}`;
        if (existing) return existing;
        const [post] = await tx`
          SELECT p.*, r.id AS revision_id, j.id AS render_job_id
          FROM social_post p
          JOIN social_post_revision r ON r.id = p.approved_revision_id
          JOIN social_render_job j ON j.post_id = p.id AND j.revision_id = r.id AND j.status = 'completed'
          WHERE p.id = ${scheduleMatch[1]} AND p.status = 'rendered' AND p.current_revision_id = p.approved_revision_id
          FOR UPDATE OF p
        `;
        if (!post || !(post.render_files as unknown[])?.length || !(post.caption as string)?.trim()) return null;
        assertPublishableCopy(post as Record<string, unknown>);
        const availableAt = publishAvailableAt(new Date(scheduledAt));

        // Decided in one place for both scheduling paths — see schedulePublishJob. The
        // day's mix is only knowable at the moment a slot is assigned, which is why the
        // decision lives here rather than at generation time.
        const { job: created, decided } = await schedulePublishJob(tx, {
          post: post as Record<string, unknown>,
          scheduledAt,
          availableAt: availableAt.toISOString(),
          idempotencyKey,
        });
        await tx`UPDATE social_post SET scheduled_at = ${scheduledAt}, updated_at = now() WHERE id = ${post.id}`;

        await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${post.id}, 'publish.queued', ${tx.json({ jobId: created.id, scheduledAt, format: decided.format, formatReason: decided.reason })})`;
        return created;
      });
      return job ? send(res, 201, { job }) : send(res, 409, { error: "Only an approved, completed render of the current revision can be scheduled" });
    }

    if (req.method === "POST" && url.pathname === "/v1/publish-jobs/reconcile-blocked") {
      const jobs = await sql`
        SELECT j.*,p.planned_for,jsonb_build_object('hook',p.hook,'caption',p.caption,'call_to_action',p.call_to_action,'hashtags',p.hashtags) AS post
        FROM social_publish_job j JOIN social_post p ON p.id=j.post_id
        WHERE j.status='blocked' ORDER BY j.updated_at LIMIT 20
      `;
      const results: Array<Record<string, unknown>> = [];
      for (const job of jobs) {
        try {
          const match = await reconcileBufferPublish(job as Record<string, any>);
          if (match) results.push({ jobId: job.id, postId: job.post_id, result: "found_in_buffer", bufferPostId: match.id });
          else {
            await sql.begin(async tx => {
              await tx`UPDATE social_publish_job SET status='retrying',available_at=now(),provider_post_id=NULL,provider_status=NULL,error_code=NULL,error_message=NULL,updated_at=now() WHERE id=${job.id} AND status='blocked'`;
              await tx`UPDATE social_post SET status='rendered',buffer_post_id=NULL,updated_at=now() WHERE id=${job.post_id}`;
              await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${job.post_id},'publish.reconciliation_absent_requeued',${tx.json({jobId:job.id,scheduledAt:job.scheduled_at})})`;
            });
            results.push({ jobId: job.id, postId: job.post_id, result: "confirmed_absent_requeued" });
          }
        } catch (error) { results.push({ jobId: job.id, postId: job.post_id, result: "reconciliation_failed", error: error instanceof Error ? error.message : "unknown" }); }
      }
      return send(res, 200, { results });
    }

    if (req.method === "POST" && url.pathname === "/v1/publish-jobs/process") {
      const cooldown = await providerCooldownUntil();
      if (cooldown) return send(res, 200, { skipped: "buffer_cooldown", until: cooldown.toISOString() });
      const dailySpend = await bufferCallsLastDay();
      if (dailySpend >= BUFFER_DAILY_QUOTA) {
        await startProviderCooldown(60, "DAILY_QUOTA_GUARD");
        return send(res, 200, { skipped: "buffer_daily_quota", spentLastDay: dailySpend, quota: BUFFER_DAILY_QUOTA });
      }
      const workerId = z.string().min(3).max(120).parse(req.headers["x-publisher-id"] || "n8n-publisher");
      const job: any = await sql.begin(async (tx) => {
        await tx`UPDATE social_publish_job SET status = 'retrying', lease_owner = NULL, lease_expires_at = NULL, available_at = now(), updated_at = now() WHERE status = 'processing' AND lease_expires_at < now()`;
        const [queued] = await tx`SELECT count(*) AS count FROM social_publish_job WHERE status='scheduled' AND scheduled_at>now()`;
        if (Number(queued.count) >= bufferQueueSoftLimit) return null;
        const handoffCutoff = new Date(Date.now() + bufferHandoffHours * 60 * 60_000);
        const [candidate] = await tx`SELECT * FROM social_publish_job WHERE status IN ('pending','retrying') AND available_at <= now() AND scheduled_at <= ${handoffCutoff.toISOString()} ORDER BY scheduled_at LIMIT 1 FOR UPDATE SKIP LOCKED`;
        if (!candidate) return null;
        const [attemptRow] = await tx`SELECT COALESCE(max(attempt_number),0)+1 AS next_attempt FROM social_publish_attempt WHERE job_id=${candidate.id}`;
        const attempt = Number(attemptRow.next_attempt);
        const [claimed] = await tx`UPDATE social_publish_job SET status = 'processing', attempt_count = ${attempt}, lease_owner = ${workerId}, lease_expires_at = now() + INTERVAL '5 minutes', updated_at = now() WHERE id = ${candidate.id} RETURNING *`;
        const [post] = await tx`SELECT topic, hook, caption, call_to_action, hashtags, slides, render_files FROM social_post WHERE id = ${candidate.post_id}`;
        const requestFingerprint = hash({ postId: candidate.post_id, revisionId: candidate.revision_id, scheduledAt: candidate.scheduled_at, files: post.render_files });
        // A serialization retry can re-run this body after the row already exists, which
        // raised a duplicate-key error on (job_id, attempt_number) and lost the publish.
        // Refreshing the same attempt is safe: history is still append-only because the
        // number always comes from max+1, so a genuinely new attempt gets a new row.
        await tx`
          INSERT INTO social_publish_attempt (job_id, attempt_number, request_fingerprint)
          VALUES (${candidate.id}, ${attempt}, ${requestFingerprint})
          ON CONFLICT (job_id, attempt_number)
          DO UPDATE SET request_fingerprint = excluded.request_fingerprint, started_at = now()
        `;
        return { ...claimed, post };
      });
      if (!job) return send(res, 200, { job: null });
      try {
        // Read the sources again before deciding this post is stale. "Must be researched
        // again" is an instruction, and until now nothing carried it out at handoff: the
        // revision's timestamps were frozen when the draft was written, so a post
        // generated days ahead could never be anything but too old. Refreshing only moves
        // the timestamp when the source still hashes to what it hashed to — a source that
        // has changed keeps its old one, and the post stays blocked, which is right.
        let reliability = await assessStoredRevision(String(job.post_id), String(job.revision_id), true);
        if (!reliability.passed && reliability.failures.some(failure => /older than \d+ hours/.test(failure))) {
          const refresh = await refreshRevisionEvidence(String(job.post_id), String(job.revision_id));
          if (refresh.refreshed) reliability = await assessStoredRevision(String(job.post_id), String(job.revision_id), true);
        }

        // This gate asks whether the evidence still holds, not whether approving the post
        // was the right call in the first place. That judgement was made at generation,
        // where a weak claim could still be repaired and nothing had been spent on
        // rendering. Re-running all of it here re-litigates a decision already taken, and
        // does it at the one moment nothing can be done about it: a post with four claims,
        // three of them cited perfectly, died fully rendered because the fourth said "four
        // years" and the excerpt did not.
        //
        // What can genuinely change after approval is the source: a quoted sentence that
        // has gone, a figure the authority now states differently, evidence too old to
        // re-read. Those still stop the post. A corroboration count cannot change on its
        // own, so it is not asked again here.
        const CHANGED_SINCE_APPROVAL = /no longer|has changed|disagree|older than \d+ hours|unreadable retrieval|not found verbatim/i;
        if (!reliability.passed) {
          const changed = reliability.failures.filter(failure => CHANGED_SINCE_APPROVAL.test(failure));
          const settledAtApproval = reliability.failures.filter(failure => !CHANGED_SINCE_APPROVAL.test(failure));
          if (!changed.length && settledAtApproval.length) {
            await sql`INSERT INTO social_event (post_id, event_type, payload) VALUES (${job.post_id}, 'evidence.settled_at_approval', ${sql.json({ jobId: job.id, carried: settledAtApproval })})`;
            reliability = { ...reliability, passed: true, failures: [] };
          }
        }
        if(!reliability.passed){await sql.begin(async tx=>{await tx`UPDATE social_publish_job SET status='blocked',lease_owner=NULL,lease_expires_at=NULL,error_code='EVIDENCE_REVALIDATION_FAILED',error_message=${reliability.failures.join("; ")},updated_at=now() WHERE id=${job.id}`;await tx`UPDATE social_post SET status='blocked',updated_at=now() WHERE id=${job.post_id}`;await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${job.post_id},'evidence.reliability_blocked',${tx.json({stage:'pre_publish',jobId:job.id,...reliability})})`;await requestReplacement(tx,{publishDate:job.planned_for??job.scheduled_at,reason:`evidence revalidation failed before publishing: ${reliability.failures.join("; ")}`,postId:job.post_id,jobId:job.id});});await notifyDiscord("Publication blocked by evidence validation",{post:job.post_id,job:job.id,problems:reliability.failures.join("\n")});return send(res,422,{error:"Publication blocked by evidence validation",...reliability});}
        assertPublishableCopy(job.post as Record<string, unknown>);
        const channelId = process.env.BUFFER_CHANNEL_ID;
        if (!channelId) throw new BufferError("BUFFER_CHANNEL_ID is not configured", "CHANNEL_NOT_CONFIGURED", false);
        const storedFiles = job.post.render_files as Array<{ key: string }>;
        const mediaUrls = await Promise.all(storedFiles.map((file) => createBufferMediaUrl(file.key)));

        // A reel goes over as a video, and only if its render actually finished. If the
        // encode failed or is still running when the slot arrives, the post goes out as
        // the carousel it was also written as — the slides exist either way, so a missing
        // video costs the format and not the post.
        let video: { url: string; thumbnailUrl?: string; title?: string } | undefined;
        if (String(job.format) === "reel") {
          const [reelRender] = await sql`
            SELECT output_files FROM social_render_job
            WHERE post_id = ${job.post_id} AND revision_id = ${job.revision_id} AND kind = 'reel' AND status = 'completed'
            ORDER BY created_at DESC LIMIT 1
          `;
          const parts = (reelRender?.output_files ?? []) as Array<{ key: string; mimeType?: string }>;
          const videoPart = parts.find(part => part.mimeType === "video/mp4");
          if (videoPart) {
            // No thumbnailUrl. Buffer's schema accepts one and Instagram does not — the
            // first reel came back "social networks do not accept custom video
            // thumbnails" — so the cover frame is uploaded and kept but not offered.
            // Instagram picks its own frame; the opening frame being a full-bleed title
            // card is what makes that choice look deliberate anyway.
            video = {
              url: await createBufferMediaUrl(videoPart.key),
              title: String(job.post.topic ?? "").slice(0, 90),
            };
          } else {
            // Falling back to the slides here was too eager, and it is how the first reel
            // reached Buffer as a carousel: the encode was still running when the
            // three-minute publish tick claimed the job, and "no video yet" was treated
            // the same as "no video ever". A render still in flight is a reason to wait.
            const [pending] = await sql`
              SELECT status FROM social_render_job
              WHERE post_id = ${job.post_id} AND revision_id = ${job.revision_id} AND kind = 'reel'
                AND status IN ('pending','leased','retrying')
              ORDER BY created_at DESC LIMIT 1
            `;
            if (pending) {
              await sql.begin(async tx => {
                await tx`UPDATE social_publish_job SET status='pending', lease_owner=NULL, lease_expires_at=NULL, available_at=now()+INTERVAL '3 minutes', updated_at=now() WHERE id=${job.id}`;
                await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${job.post_id},'reel.awaiting_render',${tx.json({ jobId: job.id, renderStatus: String(pending.status) })})`;
              });
              return send(res, 200, { job: null, waiting: "reel render in progress" });
            }
            // No render in flight and none completed: the encode is not coming, so the
            // post goes out as the carousel it was also written as rather than not at all.
            //
            // But it goes out *as a carousel*, on the record. It used to keep format='reel'
            // while publishing five images, so the job said reel, the day's reel quota was
            // counted as met, and the only way to find out otherwise was to ask Buffer what
            // it had actually received. One went out that way on 27 August and I reported it
            // as a published reel because our own row said so.
            await sql`
              UPDATE social_publish_job
              SET format='carousel',
                  format_reason=${'the reel render failed, so this went out as the carousel it was also written as'},
                  updated_at=now()
              WHERE id=${job.id}`;
            await sql`INSERT INTO social_event(post_id,event_type,payload) VALUES(${job.post_id},'reel.render_missing',${sql.json({ jobId: job.id, downgradedTo: 'carousel' })})`;
            await notifyDiscord("Reel downgraded to carousel: its video never rendered", {
              post: String(job.post_id),
              topic: String(job.post?.topic ?? ""),
              note: "The day may now be short of its reel.",
            });
          }
        }
        const hashtags = job.post.hashtags as string[];
        const text = composeInstagramCaption({ hook: String(job.post.hook), body: String(job.post.caption), callToAction: String(job.post.call_to_action), hashtags });
        // Whether this arrives as a draft depends on whether a person has already said
        // yes to it, not only on the mode. Thirteen posts were sitting approved on the
        // board when the mode changed, and sending those as drafts would have asked for
        // the same approval twice — the switch is about where the next yes comes from,
        // not about discarding one already given. An approval recorded against
        // buffer_draft_review is the machine standing in for that yes, so it does not
        // count: those are exactly the posts that still need a person in Buffer.
        const [priorApproval] = await sql`
          SELECT reviewer FROM social_approval
          WHERE post_id = ${job.post_id} AND decision = 'approved'
          ORDER BY decided_at DESC LIMIT 1
        `;
        // Retained for the event record: who approved a post is worth knowing even when
        // it no longer changes where the post is delivered.
        const approvedByAPerson = Boolean(priorApproval?.reviewer) && String(priorApproval.reviewer) !== "buffer_draft_review";
        const providerPost = await createScheduledPost({ channelId, text, dueAt: new Date(job.scheduled_at as string).toISOString(), mediaUrls, video, // In buffer_draft mode everything lands as a draft, full stop. The exception for a
          // post that already carried a human approval made sense when approval happened on
          // the board and Buffer was only delivery — but review moved into Buffer, so an old
          // approval record is not consent to publish, it is just history. It was sending
          // posts straight to the queue while the owner waited for them in Drafts.
          saveToDraft: reviewMode === "buffer_draft" });
        const [saved] = await sql.begin(async (tx) => {
          const [updated] = await tx`UPDATE social_publish_job SET status = 'scheduled', provider_post_id = ${providerPost.id}, provider_status = ${providerPost.status || "scheduled"}, lease_owner = NULL, lease_expires_at = NULL, updated_at = now() WHERE id = ${job.id} AND status = 'processing' RETURNING *`;
          await tx`UPDATE social_publish_attempt SET finished_at = now(), outcome = 'scheduled', provider_correlation_id = ${providerPost.id} WHERE job_id = ${job.id} AND attempt_number = ${job.attempt_count}`;
          await tx`UPDATE social_post SET status = 'scheduled', buffer_post_id = ${providerPost.id}, updated_at = now() WHERE id = ${job.post_id}`;
          await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${job.post_id}, 'publish.scheduled', ${tx.json({ jobId: job.id, bufferPostId: providerPost.id, scheduledAt: job.scheduled_at })})`;
          return [updated];
        });
        return send(res, 200, { job: saved });
      } catch (error) {
        let failure = error instanceof BufferError ? error : new BufferError(error instanceof Error ? error.message : "Publish failure", "PUBLISH_FAILED", false, true);
        if (failure.ambiguous) {
          try {
            const match = await reconcileBufferPublish(job as Record<string, any>);
            if (match) return send(res, 200, { job: { ...job, status: "scheduled", provider_post_id: match.id }, reconciled: true });
            failure = new BufferError(`Buffer create response was ambiguous, but an exact scheduled-post lookup confirmed absence (${failure.code})`, "AMBIGUOUS_CONFIRMED_ABSENT", true, false);
          } catch (reconcileError) {
            await sql`INSERT INTO social_event(post_id,event_type,payload) VALUES(${job.post_id},'publish.reconciliation_failed',${sql.json({jobId:job.id,createError:failure.code,reconcileError:reconcileError instanceof Error?reconcileError.message:'unknown'})})`;
          }
        }
        // A pacing failure pauses every Buffer call, not just this job's next attempt.
        await noteProviderPacing(failure);
        const { retry, blocked, delayMinutes } = retryDecision(Number(job.attempt_count), failure.retryable, failure.ambiguous, failure.retryAfterMinutes);
        const [failed] = await sql.begin(async (tx) => {
          const [updated] = retry
            ? await tx`UPDATE social_publish_job SET status = 'retrying', available_at = now() + (${delayMinutes!}::STRING || ' minutes')::INTERVAL, lease_owner = NULL, lease_expires_at = NULL, error_code = ${failure.code}, error_message = ${failure.message}, updated_at = now() WHERE id = ${job.id} RETURNING *`
            : await tx`UPDATE social_publish_job SET status = ${blocked ? "blocked" : "failed"}, lease_owner = NULL, lease_expires_at = NULL, error_code = ${failure.code}, error_message = ${failure.message}, updated_at = now() WHERE id = ${job.id} RETURNING *`;
          await tx`UPDATE social_publish_attempt SET finished_at = now(), outcome = ${retry ? "retrying" : blocked ? "blocked" : "failed"}, error_code = ${failure.code}, error_message = ${failure.message} WHERE job_id = ${job.id} AND attempt_number = ${job.attempt_count}`;
          await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${job.post_id}, ${retry ? "publish.retrying" : blocked ? "publish.blocked" : "publish.failed"}, ${tx.json({ jobId: job.id, attempt: job.attempt_count, code: failure.code, delayMinutes: retry ? delayMinutes : null })})`;
          return [updated];
        });
        if (!retry) {
          const boardUrl = `${(reviewBaseUrl || "https://approve.finkavo.com").replace(/\/$/, "")}/board?post=${job.post_id}`;
          await notifyDiscord(blocked ? "Publish result needs reconciliation" : "Publish failed", {
            topic: job.post.topic, postId: job.post_id, publishJobId: job.id,
            intendedTime: new Date(job.scheduled_at as string).toISOString(), attempt: job.attempt_count,
            code: failure.code, error: failure.message,
            requiredAction: blocked ? "Check Buffer for this topic, then use the guarded retry or archive action on the board." : "Open the board to inspect and retry.",
          }, boardUrl);
        }
        return send(res, 200, { job: failed, accepted: false, recoveryState: retry ? "automatic_retry" : blocked ? "manual_reconciliation" : "attention", error: failure.message });
      }
    }

    if (req.method === "POST" && url.pathname === "/v1/publish-jobs/monitor") {
      const monitorCooldown = await providerCooldownUntil();
      if (monitorCooldown) return send(res, 200, { skipped: "buffer_cooldown", until: monitorCooldown.toISOString(), checked: 0 });

      // Monitoring is the optional half of the budget: a confirmation can wait, a publish
      // cannot. Once monitoring has spent its share, stop and leave the rest for handoff.
      const spent = await bufferCallsLastDay();
      if (spent >= BUFFER_MONITOR_BUDGET) {
        return send(res, 200, { skipped: "monitor_budget_reached", spentLastDay: spent, monitorBudget: BUFFER_MONITOR_BUDGET, checked: 0 });
      }

      // Only look at posts that are actually due, and re-check any single job at most
      // every few minutes. Previously this ran every two minutes against up to ten jobs
      // regardless of whether their time had come, which alone exceeded the daily quota
      // three times over and left nothing to confirm delivery with.
      const jobs = await sql`
        SELECT * FROM social_publish_job
        WHERE status = 'scheduled'
          -- Due posts, and posts still recorded as waiting on the owner whatever their
          -- time. Only asking about due posts meant a draft approved into the queue days
          -- early was never asked about again: our copy said "draft" until its slot came
          -- round, so reports described work as awaiting approval that had been approved,
          -- and the overdue check skipped it on the same false grounds. There are only
          -- ever a handful in that state, so this costs almost nothing against the daily
          -- Buffer allowance.
          AND (scheduled_at <= now() OR coalesce(provider_status,'') IN ('draft','needs_approval'))
          AND (last_provider_check_at IS NULL
               OR last_provider_check_at < now() - (${BUFFER_MONITOR_RECHECK_MINUTES}::STRING || ' minutes')::INTERVAL)
        ORDER BY scheduled_at
        LIMIT ${BUFFER_MONITOR_MAX_PER_RUN}
      `;
      for (const job of jobs) {
        await sql`UPDATE social_publish_job SET last_provider_check_at = now() WHERE id = ${job.id}`;
      }
      const results: Array<{ id: string; status: string }> = [];
      for (const job of jobs) {
        try {
          const providerPost = await getBufferPost(String(job.provider_post_id));
          if (!providerPost) continue;

          // Buffer owns what happens to a post once it has it, and that includes the
          // post's state, not only its time. Ours was written at handoff and never
          // touched again, so a draft the owner had already approved into the queue
          // still read as "draft" here — days later, in reports and in the overdue
          // check, which deliberately ignores drafts on the grounds that the ball is
          // with the owner. It was not. Take whatever Buffer says.
          if (providerPost.status && providerPost.status !== job.provider_status) {
            await sql`UPDATE social_publish_job SET provider_status=${providerPost.status}, updated_at=now() WHERE id=${job.id}`;
            await sql`INSERT INTO social_event (post_id, event_type, payload) VALUES (${job.post_id}, 'publish.provider_status_changed', ${sql.json({ jobId: job.id, from: job.provider_status ?? null, to: providerPost.status })})`;
          }

          // The owner reschedules from the Buffer app, and nothing brought that back
          // here. Our copy kept the original slot, the confirmation check then read the
          // post as overdue, and the alert fired on every run about a post that had
          // simply been moved. Once a post is handed over, Buffer owns its time.
          if (providerPost.dueAt && providerPost.status !== "sent") {
            const providerDue = new Date(providerPost.dueAt);
            const localDue = new Date(String(job.scheduled_at));
            if (!Number.isNaN(providerDue.getTime()) && Math.abs(providerDue.getTime() - localDue.getTime()) > 60_000) {
              await sql.begin(async tx => {
                await tx`UPDATE social_publish_job SET scheduled_at=${providerDue.toISOString()}, updated_at=now() WHERE id=${job.id}`;
                await tx`UPDATE social_post SET scheduled_at=${providerDue.toISOString()}, updated_at=now() WHERE id=${job.post_id}`;
                await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${job.post_id}, 'publish.reschedule_adopted', ${tx.json({ jobId: job.id, from: localDue.toISOString(), to: providerDue.toISOString() })})`;
              });
            }
          }

          if (providerPost.status === "sent") {
            await sql.begin(async (tx) => {
              await tx`UPDATE social_publish_job SET status = 'published', provider_status = 'sent', updated_at = now() WHERE id = ${job.id}`;
              await tx`UPDATE social_post SET status = 'published', published_at = ${providerPost.sentAt || new Date().toISOString()}, updated_at = now() WHERE id = ${job.post_id}`;
              await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${job.post_id}, 'publish.published', ${tx.json({ jobId: job.id, bufferPostId: job.provider_post_id })})`;
            });
          } else if (providerPost.status === "error") {
            await sql.begin(async tx => {
              await tx`UPDATE social_publish_job SET status='retrying',provider_post_id=NULL,provider_status='error',available_at=now()+INTERVAL '30 minutes',error_code='BUFFER_POST_ERROR',error_message='Buffer reported post error; queued for a new slot',updated_at=now() WHERE id=${job.id}`;
              await tx`UPDATE social_post SET status='rendered',buffer_post_id=NULL,updated_at=now() WHERE id=${job.post_id}`;
              await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${job.post_id},'publish.provider_error_requeued',${tx.json({jobId:job.id,bufferPostId:job.provider_post_id})})`;
            });
            const [failedPost] = await sql`SELECT topic FROM social_post WHERE id=${job.post_id}`;
            const boardUrl = `${(reviewBaseUrl || "https://approve.finkavo.com").replace(/\/$/, "")}/board?post=${job.post_id}`;
            await notifyDiscord("Buffer/Instagram delivery failed; post retained", {
              topic: failedPost?.topic || "Unknown topic", postId: job.post_id, publishJobId: job.id,
              bufferPostId: job.provider_post_id, failedScheduledTime: new Date(job.scheduled_at as string).toISOString(),
              providerStatus: "error", recovery: "Returned to the durable local queue for automatic assignment to the next available slot.",
            }, boardUrl);
          } else await sql`UPDATE social_publish_job SET provider_status = ${providerPost.status}, updated_at = now() WHERE id = ${job.id}`;
          results.push({ id: String(job.id), status: providerPost.status });
        } catch (error) {
          results.push({ id: String(job.id), status: `monitor_error:${error instanceof Error ? error.message : "unknown"}` });
          await sql`INSERT INTO social_event(post_id,event_type,payload) VALUES(${job.post_id},'publish.monitor_error',${sql.json({jobId:job.id,code:error instanceof BufferError?error.code:'MONITOR_ERROR'})})`;
          // Stopping this batch is not enough on its own: without a recorded cooldown the
          // next tick two minutes later calls Buffer again and logs the same error.
          if (error instanceof BufferError) {
            await noteProviderPacing(error);
            if (error.code === "RATE_LIMIT_EXCEEDED" || error.code === "BUFFER_QUEUE_FULL") break;
          }
        }
      }
      return send(res, 200, { results });
    }

    if(req.method==="POST"&&url.pathname==="/v1/reliability/audit-queue"){
      const input=z.object({dryRun:z.boolean().default(true)}).parse(await readJson(req));
      const rows=await sql`SELECT p.id,p.topic,p.status,p.planned_for,p.current_revision_id,j.id AS job_id,j.status AS job_status,j.provider_post_id FROM social_post p LEFT JOIN LATERAL(SELECT * FROM social_publish_job WHERE post_id=p.id ORDER BY created_at DESC LIMIT 1)j ON true WHERE p.status NOT IN('published','rejected','failed','blocked') AND p.archived_at IS NULL AND p.current_revision_id IS NOT NULL`;
      const checked=[];const blocked=[];const external=[];
      for(const row of rows){
        const assessment=await assessStoredRevision(String(row.id),String(row.current_revision_id),true);
        checked.push({postId:row.id,topic:row.topic,status:row.status,...assessment});
        if(assessment.passed)continue;
        if(row.job_status==='scheduled'&&row.provider_post_id){
          const item={postId:row.id,topic:row.topic,bufferPostId:row.provider_post_id,failures:assessment.failures};external.push(item);
          if(!input.dryRun){try{await deleteBufferPost(String(row.provider_post_id));await sql.begin(async tx=>{await tx`UPDATE social_publish_job SET status='blocked',provider_status='deleted_for_evidence_review',error_code='EVIDENCE_REVALIDATION_FAILED',error_message=${assessment.failures.join("; ")},updated_at=now() WHERE id=${row.job_id}`;await tx`UPDATE social_post SET status='blocked',buffer_post_id=NULL,updated_at=now() WHERE id=${row.id}`;const concepts=await tx`UPDATE social_post_concept SET status='blocked',blocked_kind='evidence',blocked_reason=${`evidence revalidation failed on a queued post: ${assessment.failures.join("; ").slice(0,240)}`},blocked_at=now(),updated_at=now() WHERE topic=${row.topic} AND planned_for=(SELECT planned_for FROM social_post WHERE id=${row.id}) RETURNING plan_slot_id`;for(const concept of concepts)if(concept.plan_slot_id)await tx`UPDATE social_editorial_plan_slot SET status='held',updated_at=now() WHERE id=${concept.plan_slot_id}`;await tx`INSERT INTO social_event(post_id,event_type,payload)VALUES(${row.id},'evidence.buffer_post_deleted',${tx.json({bufferPostId:row.provider_post_id,...assessment})})`;await requestReplacement(tx,{publishDate:row.planned_for,reason:`queued Buffer post withdrawn on evidence review: ${assessment.failures.join("; ")}`,postId:row.id,jobId:row.job_id});});}catch(error){(item as Record<string,unknown>).deleteError=error instanceof Error?error.message:'Buffer deletion failed';}}
          continue;
        }
        if(!input.dryRun){await sql.begin(async tx=>{if(row.job_id)await tx`UPDATE social_publish_job SET status='blocked',error_code='EVIDENCE_REVALIDATION_FAILED',error_message=${assessment.failures.join("; ")},updated_at=now() WHERE id=${row.job_id} AND status IN('pending','processing','retrying')`;await tx`UPDATE social_post SET status='blocked',updated_at=now() WHERE id=${row.id}`;const concepts=await tx`UPDATE social_post_concept SET status='blocked',blocked_kind='evidence',blocked_reason=${`evidence revalidation failed on a queued post: ${assessment.failures.join("; ").slice(0,240)}`},blocked_at=now(),updated_at=now() WHERE topic=${row.topic} AND planned_for=(SELECT planned_for FROM social_post WHERE id=${row.id}) RETURNING plan_slot_id`;for(const concept of concepts)if(concept.plan_slot_id)await tx`UPDATE social_editorial_plan_slot SET status='held',updated_at=now() WHERE id=${concept.plan_slot_id}`;await tx`INSERT INTO social_event(post_id,event_type,payload)VALUES(${row.id},'evidence.queue_audit_blocked',${tx.json(assessment)})`;await requestReplacement(tx,{publishDate:row.planned_for,reason:`queue audit blocked the post on evidence: ${assessment.failures.join("; ")}`,postId:row.id,jobId:row.job_id});});}
        blocked.push({postId:row.id,topic:row.topic,failures:assessment.failures});
      }
      if(external.length&&!input.dryRun)await notifyDiscord('Buffer posts require evidence review before publication',{posts:external.map(item=>`${item.topic} — post ${item.postId}, Buffer ${item.bufferPostId}`).join('\n')});
      // Anything that has sat blocked past the grace period is dispositioned here rather
      // than left to be re-announced tomorrow.
      const retiredStale = input.dryRun ? [] : await retireEvidenceBlockedPosts();
      return send(res,200,{retiredStale,dryRun:input.dryRun,checked:checked.length,passed:checked.filter(item=>item.passed).length,blocked,external});
    }

    if(req.method==="POST"&&url.pathname==="/v1/editorial/audit-review"){
      const input=z.object({dryRun:z.boolean().default(true)}).parse(await readJson(req));
      const rows=await sql`SELECT id,topic,status,current_revision_id FROM social_post WHERE status IN('draft','ready_for_review') AND archived_at IS NULL AND current_revision_id IS NOT NULL ORDER BY created_at`;
      const blocked=[];
      for(const row of rows){const result=await assessStoredEditorial(String(row.id),String(row.current_revision_id));if(result.passed)continue;blocked.push({postId:row.id,topic:row.topic,status:row.status,failures:result.failures});if(!input.dryRun)await sql.begin(async tx=>{await tx`UPDATE social_review_token SET used_at=now() WHERE post_id=${row.id} AND used_at IS NULL`;await tx`UPDATE social_post SET status='blocked',updated_at=now() WHERE id=${row.id}`;await tx`INSERT INTO social_event(post_id,event_type,payload)VALUES(${row.id},'quality.standalone_value_blocked',${tx.json({stage:'review_audit',score:result.score,failures:result.failures})})`;});}
      return send(res,200,{dryRun:input.dryRun,checked:rows.length,passed:rows.length-blocked.length,blocked});
    }

    if (req.method === "GET" && url.pathname === "/v1/health-report") {
      const [counts] = await sql`SELECT count(*) FILTER (WHERE status = 'draft') AS drafts, count(*) FILTER (WHERE status = 'approved') AS approved, count(*) FILTER (WHERE status = 'rendered') AS rendered, count(*) FILTER (WHERE status = 'scheduled') AS scheduled, count(*) FILTER (WHERE status = 'published') AS published, count(*) FILTER (WHERE status IN ('blocked','failed')) AS blocked FROM social_post`;
      const [renderer] = await sql`SELECT worker_id, version, last_seen_at FROM social_renderer_heartbeat ORDER BY last_seen_at DESC LIMIT 1`;
      const [oldest] = await sql`SELECT min(created_at) AS oldest_job FROM social_render_job WHERE status IN ('pending','retrying')`;
      const upcomingDeadlines = await sql`
        SELECT r.title, r.category, o.due_date, o.status
        FROM social_editorial_occurrence o JOIN social_editorial_rule r ON r.id=o.rule_id
        WHERE o.due_date BETWEEN current_date AND current_date + 45 ORDER BY o.due_date LIMIT 12
      `;
      const [planning] = await sql`SELECT count(*) FILTER (WHERE status='blocked') AS blocked_concepts, count(*) FILTER (WHERE status IN ('eligible','planned')) AS ready_concepts FROM social_post_concept`;
      const publishQueue = await sql`SELECT status,count(*) AS count FROM social_publish_job GROUP BY status ORDER BY status`;
      return send(res, 200, {
        // A day with no drafts is usually the free tier's daily token ceiling rather
        // than anything wrong, so the remaining allowance is reported alongside the queue.
        llm: llmDailyBudget(), counts, planning, upcomingDeadlines, renderer, oldestQueuedRender: oldest?.oldest_job || null, publishQueue, bufferHandoffHours, bufferQueueSoftLimit, healthy: renderer ? Date.now() - new Date(renderer.last_seen_at as string).getTime() < 5 * 60_000 : false });
    }

    if(req.method==="POST"&&url.pathname==="/v1/reports/daily"){
      const {date}=ReportSchema.parse(await readJson(req));const day=date||lisbonDate(new Date());
      const slots=await sql`SELECT s.slot_number,s.publish_time,s.topic,s.status,s.reserve_kind,s.campaign_stage,b.verification_state,b.expires_at,g.generation_error FROM social_editorial_plan_slot s LEFT JOIN LATERAL (SELECT verification_state,expires_at FROM social_topic_evidence_bundle WHERE plan_slot_id=s.id ORDER BY verified_at DESC LIMIT 1) b ON true LEFT JOIN LATERAL (SELECT payload->>'error' AS generation_error FROM social_event WHERE event_type='generation.failed' AND payload->>'planSlotId'=s.id::STRING ORDER BY created_at DESC LIMIT 1) g ON true WHERE s.publish_date=${day} AND s.plan_version=(SELECT max(plan_version) FROM social_editorial_plan_slot WHERE publish_date=${day}) ORDER BY s.slot_number`;
      const approvals=await sql`SELECT p.topic,p.status,p.scheduled_at FROM social_post p WHERE (p.created_at AT TIME ZONE 'Europe/Lisbon')::DATE=${day} OR (p.scheduled_at AT TIME ZONE 'Europe/Lisbon')::DATE=${day} ORDER BY p.scheduled_at NULLS LAST,p.created_at`;
      const [news]=await sql`SELECT count(*) AS count FROM social_post_concept WHERE status='eligible' AND timeliness='official_change'`;
      const held=slots.filter(row=>row.status==='held').map(row=>`${row.slot_number}. ${row.topic} (source ${row.verification_state||'missing'}; generation failed: ${row.generation_error||'replacement unavailable'})`);
      const topicLines=slots.map(row=>`${row.slot_number}. ${row.publish_time} — ${row.topic} [${row.status==='held'?'source verified, generation failed':row.status}; evidence ${row.verification_state||'missing'}]`);
      const approvalLines=approvals.map(row=>`${row.status}${row.scheduled_at?` at ${new Date(String(row.scheduled_at)).toISOString()}`:''} — ${row.topic}`);
      return send(res,200,{date:day,planned:slots.length,verified:slots.filter(row=>row.verification_state==='verified'&&new Date(String(row.expires_at))>new Date()).length,held:held.length,newsCandidates:Number(news.count),approvalStates:approvals.length,topics:topicLines});
    }

    if(req.method==="POST"&&url.pathname==="/v1/maintenance/weekly"){
      await verifyReserveEvidence().catch(()=>null);
      ReportSchema.parse(await readJson(req));const today=lisbonDate(new Date());const end=addLisbonDays(today,13);const plan=await loadAnnualPlan();
      let researched=0;for(let offset=0;offset<14;offset++){const day=addLisbonDays(today,offset);const headers={authorization:`Bearer ${apiToken}`,'content-type':'application/json'};const planned=await fetch(`http://127.0.0.1:${port}/v1/planning/daily`,{method:'POST',headers,body:JSON.stringify({date:day,capacity:5})});if(!planned.ok)continue;const evidenceRun=await fetch(`http://127.0.0.1:${port}/v1/evidence/research`,{method:'POST',headers,body:JSON.stringify({date:day})});if(evidenceRun.ok){const body=await evidenceRun.json() as {results?:unknown[]};researched+=body.results?.length||0;}}
      const upcoming=plan.rows.filter(row=>row.date>=today&&row.date<=end);const identities=new Set<string>();const duplicateIdentities:string[]=[];
      for(const row of upcoming){const key=[row.brief.subjectFamily,row.brief.userQuestion,row.audience,row.brief.contentIntent,row.brief.occurrenceKey||row.brief.campaignStage||''].join('|');if(identities.has(key))duplicateIdentities.push(key);identities.add(key);}
      const repaired=await sql`UPDATE social_editorial_plan_slot s SET status='evidence_ready',updated_at=now() WHERE s.publish_date BETWEEN ${today} AND ${end} AND s.status='held' AND EXISTS (SELECT 1 FROM social_topic_evidence_bundle b WHERE b.plan_slot_id=s.id AND b.verification_state='verified' AND b.expires_at>now()) RETURNING s.id`;
      const held=await sql`SELECT s.publish_date,s.slot_number,s.topic FROM social_editorial_plan_slot s WHERE s.publish_date BETWEEN ${today} AND ${end} AND s.plan_version=(SELECT max(current_slot.plan_version) FROM social_editorial_plan_slot current_slot WHERE current_slot.publish_date=s.publish_date) AND s.status='held' ORDER BY s.publish_date,s.slot_number`;
      const cards=await loadEvergreenReserve();const urls=[...new Set(cards.map(card=>card.sourcePolicy.canonicalUrl))];const evidence=await sql`SELECT canonical_url AS "canonicalUrl",max(verified_at) AS "verifiedAt" FROM social_reserve_evidence WHERE canonical_url IN ${sql(urls)} AND available=true GROUP BY canonical_url`;const reserveEligible=eligibleReserveCards(cards,evidence.map(row=>({canonicalUrl:String(row.canonicalUrl),verifiedAt:String(row.verifiedAt)})),[]).length;
      const details={window:`${today} to ${end}`,plannedBriefs:upcoming.length,evidenceChecks:researched,duplicateIdentities:duplicateIdentities.length,repairedEvidenceHolds:repaired.length,remainingHolds:held.length,reserveEligible};
      return send(res,200,{...details,held});
    }

    if(req.method==="POST"&&url.pathname==="/v1/maintenance/monthly"){
      ReportSchema.parse(await readJson(req));const today=lisbonDate(new Date());const end=addLisbonDays(today,89);const plan=await loadAnnualPlan();const upcoming=plan.rows.filter(row=>row.date>=today&&row.date<=end);
      const [performance]=await sql`SELECT count(*) FILTER (WHERE status='published') AS published,count(*) FILTER (WHERE status IN ('blocked','failed','rejected')) AS unsuccessful,count(*) FILTER (WHERE status='approved') AS approved FROM social_post WHERE created_at>now()-INTERVAL '30 days'`;
      const [coverage]=await sql`SELECT count(*) AS active_slots,count(*) FILTER (WHERE s.status='held') AS held FROM social_editorial_plan_slot s WHERE s.publish_date BETWEEN ${today} AND ${end} AND s.plan_version=(SELECT max(current_slot.plan_version) FROM social_editorial_plan_slot current_slot WHERE current_slot.publish_date=s.publish_date)`;
      const details={window:`${today} to ${end}`,plannedBriefs:upcoming.length,activeSlots:Number(coverage.active_slots),held:Number(coverage.held),published30d:Number(performance.published),unsuccessful30d:Number(performance.unsuccessful),approved30d:Number(performance.approved)};return send(res,200,details);
    }

    // Runs after every deploy and on the hour. Each check corresponds to something that
    // actually broke this week and was found by the owner rather than by us; the whole
    // point is that the pipeline notices its own failures within the hour.
    if (req.method === "POST" && url.pathname === "/v1/selftest") {
      const today = lisbonDate(new Date());
      const checks = await runSelfTest({
        sql,
        today,
        postsPerDay,
        rendererBaseUrl: process.env.RENDERER_BASE_URL || "http://127.0.0.1:4310",
        rendererToken: process.env.RENDERER_API_TOKEN,
        bufferReachable: async () => {
          // A read against the configured channel. Cheap, and it exercises the same
          // credential and host the handoff uses rather than merely pinging something.
          const channelId = process.env.BUFFER_CHANNEL_ID;
          if (!channelId) return false;
          try {
            await findMatchingScheduledPost({ channelId, text: "finkavo selftest probe", dueAt: new Date(Date.now() + 86_400_000).toISOString() });
            return true;
          } catch {
            return false;
          }
        },
      });
      const faults = checks.filter(check => !check.ok && check.severity === "fault");
      const warnings = checks.filter(check => !check.ok && check.severity === "warning");
      const healthy = faults.length === 0;

      // Deduplicated on what is wrong, so a fault that persists says so once rather than
      // every hour — the mistake the shortfall alert made.
      if (faults.length) {
        const signature = hash({ today, faults: faults.map(fault => fault.name) });
        const [seen] = await sql`SELECT id FROM social_event WHERE event_type='selftest.failed' AND payload->>'signature'=${signature} LIMIT 1`;
        if (!seen) {
          await notifyDiscord("Pipeline self-test failed", Object.fromEntries(faults.map(fault => [fault.name, fault.detail])));
          await sql`INSERT INTO social_event (event_type, payload) VALUES ('selftest.failed', ${sql.json({ signature, faults, warnings })})`;
        }
      }
      return send(res, healthy ? 200 : 503, { healthy, checks });
    }

    if(req.method==="POST"&&url.pathname==="/v1/alerts/check"){
      ReportSchema.parse(await readJson(req));const now=new Date();const today=lisbonDate(now);const lisbonTime=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Lisbon',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);const alerts:string[]=[];
      const [renderer]=await sql`SELECT last_seen_at FROM social_renderer_heartbeat ORDER BY last_seen_at DESC LIMIT 1`;if(!renderer||now.getTime()-new Date(String(renderer.last_seen_at)).getTime()>5*60_000)alerts.push('Renderer heartbeat is stale');
      // Archived posts are ones we deliberately retired — an evidence-blocked draft given up
      // on rather than a schedule that broke. Counting them here meant tidying up four stuck
      // posts immediately raised an alert about having done so.
      const [failed]=await sql`SELECT count(*) AS count FROM social_publish_job j WHERE j.status='failed' AND j.updated_at>now()-INTERVAL '24 hours' AND EXISTS (SELECT 1 FROM social_post p WHERE p.id=j.post_id AND p.archived_at IS NULL)`;if(Number(failed.count)>0)alerts.push(`${failed.count} publish schedule(s) failed in the last 24 hours`);
      // Archived means retired on purpose, the same as in the publish-failure count above.
      // A post we gave up on is not a renderer that broke.
      const [renderFailed]=await sql`SELECT count(*) AS count FROM social_post WHERE planned_for=${today} AND status='failed' AND archived_at IS NULL`;if(Number(renderFailed.count)>0)alerts.push(`${renderFailed.count} planned post(s) failed rendering`);
      const [stranded]=await sql`SELECT count(*) AS count FROM social_post p WHERE p.status='rendered' AND p.rendered_at<now()-INTERVAL '15 minutes' AND NOT EXISTS(SELECT 1 FROM social_publish_job j WHERE j.post_id=p.id AND j.revision_id=p.approved_revision_id)`;if(Number(stranded.count)>0)alerts.push(`${stranded.count} rendered post(s) are missing an internal publish job`);
      const [localOverdue]=await sql`SELECT count(*) AS count FROM social_publish_job WHERE status IN ('pending','retrying') AND scheduled_at<now()`;if(Number(localOverdue.count)>0)alerts.push(`${localOverdue.count} internal queued post(s) need rescheduling`);
      // The seven-day shortfall tally and the still-owed count both used to be listed
      // here. Neither is a fault anyone can act on — a day that came up short has
      // already said so once, at the time, and repeating it daily for a week is how a
      // channel stops being read. What is left below is only what is actually broken.
      // Two different things were being reported as one, in the words of the rarer of
      // them. "Ambiguous" means a handoff came back unclear and nobody knows whether
      // Buffer published it — that needs a person to look. A post stopped by the evidence
      // gate never reached Buffer at all and needs its evidence fixed or the post
      // retired. Four of the latter spent three days being announced as the former.
      const blockedPublish=await sql`SELECT j.id,p.id AS post_id,p.topic,j.scheduled_at,j.error_code,j.provider_post_id FROM social_publish_job j JOIN social_post p ON p.id=j.post_id WHERE j.status='blocked' AND j.updated_at<now()-INTERVAL '24 hours' ORDER BY j.scheduled_at LIMIT 10`;
      const ambiguous=blockedPublish.filter(row=>row.provider_post_id);
      const evidenceStopped=blockedPublish.filter(row=>!row.provider_post_id);
      if(ambiguous.length>0)alerts.push(`${ambiguous.length} Buffer handoff(s) came back ambiguous and need checking against Buffer before retrying:\n${ambiguous.map(row=>`${row.topic} — post ${row.post_id}, job ${row.id}, ${row.error_code||'unknown error'}`).join('\n')}`);
      if(evidenceStopped.length>0)alerts.push(`${evidenceStopped.length} post(s) were stopped by the evidence gate before reaching Buffer and have not cleared in 24 hours:\n${evidenceStopped.map(row=>`${row.topic} — post ${row.post_id}`).join('\n')}`);
      // A post sitting in Buffer as a draft is waiting for a person, not running late, so it
      // is not counted as an overdue confirmation. provider_status carries what Buffer last
      // said about it: draft and needs_approval both mean the ball is with the owner.
      const [overdue]=await sql`SELECT count(*) AS count FROM social_publish_job WHERE status='scheduled' AND scheduled_at<now()-INTERVAL '20 minutes' AND coalesce(provider_status,'') NOT IN ('draft','needs_approval')`;if(Number(overdue.count)>0)alerts.push(`${overdue.count} publication confirmation(s) are overdue`);
      if(lisbonTime>='09:00'){const [batch]=await sql`SELECT count(*) AS count FROM social_post WHERE planned_for=${today} AND status NOT IN ('blocked','failed','rejected')`;if(Number(batch.count)<postsPerDay){const [recovery]=await sql`SELECT payload FROM social_event WHERE event_type='generation.day_recovery_completed' AND payload->>'day'=${today} ORDER BY created_at DESC LIMIT 1`;if(recovery?.payload?.budgetExhausted===true){const failures=await sql`SELECT s.topic,e.payload->>'error' AS error FROM social_editorial_plan_slot s LEFT JOIN LATERAL (SELECT payload FROM social_event WHERE event_type='generation.failed' AND payload->>'planSlotId'=s.id::STRING ORDER BY created_at DESC LIMIT 1) e ON true WHERE s.publish_date=${today} AND s.status='held' ORDER BY s.slot_number`;alerts.push(`Daily recovery budget exhausted: ${batch.count}/${postsPerDay} posts ready after ${recovery.payload.attemptsUsed}/${recovery.payload.attemptBudget} candidate attempts${failures.length?`\n${failures.map(row=>`${row.topic}: ${row.error||'no verified replacement available'}`).join('\n')}`:''}`);}}}
      const signature=hash({today,alerts});let sent=false;if(alerts.length){const [existing]=await sql`SELECT id FROM social_event WHERE event_type='operations.alert_sent' AND payload->>'signature'=${signature} LIMIT 1`;if(!existing){sent=await notifyDiscord('Finkavo pipeline alert',{date:today,problems:alerts.join('\n')});await sql`INSERT INTO social_event(event_type,payload) VALUES('operations.alert_sent',${sql.json({signature,alerts})})`;}}
      return send(res,200,{date:today,alerts,sent});
    }

    const approve = url.pathname.match(/^\/v1\/posts\/([0-9a-f-]+)\/approve$/i);
    if (req.method === "POST" && approve) {
      return send(res, 410, { error: "Direct approval is disabled. Request and use a signed, revision-bound review link." });
    }

    return send(res, 404, { error: "Not found" });
  } catch (error) {
    const clientError = error instanceof z.ZodError || (error instanceof SyntaxError);
    const message = error instanceof Error ? error.message : "Unknown error";
    // "fetch failed" on its own is undiagnosable — it is what undici throws for every
    // network fault, and the reason lives on the cause. Six hundred of those in the log
    // said nothing about which host, which port, or why. The cause and the route go with
    // it now.
    const cause = error instanceof Error && error.cause ? String((error.cause as { message?: string }).message ?? error.cause) : undefined;
    const stack = error instanceof Error && !cause ? String(error.stack ?? "").split("\n").slice(1, 4).join(" | ") : undefined;
    console.error(JSON.stringify({ level: "error", message, cause, route: `${req.method} ${req.url ?? ""}`.slice(0, 120), stack }));
    return send(res, clientError ? 400 : 500, { error: clientError ? message : "Internal server error" });
  }
});

const shutdown = async () => { server.close(); await sql.end({ timeout: 5 }); };
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
server.listen(port, "127.0.0.1", () => console.log(JSON.stringify({ service: "social-api", port })));
