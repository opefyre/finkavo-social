import http from "node:http";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";
import { z } from "zod";
import { DraftSchema } from "./contracts.js";
import { generateDraft } from "./openai.js";
import { createBufferMediaUrl, createUploadUrl, uploadRenderedObject, verifyUploadedObject, type RenderFileInput } from "./storage.js";
import { BufferError, createScheduledPost, deletePost as deleteBufferPost, findMatchingScheduledPost, getPost as getBufferPost } from "./buffer.js";
import { notifyDiscord, notifyDiscordReview } from "./discord.js";
import { renderReviewPreview } from "./preview.js";
import { retryDecision } from "./retry-policy.js";
import { expandCalendar, loadEditorialCalendar, selectDailyMix } from "./planner.js";
import { assertEnglishUserCopy, validateSocialDraft } from "./draft-quality.js";
import { composeInstagramCaption } from "./caption.js";
import { loadAnnualPlan, rowsForDate } from "./annual-plan.js";
import { findFactCard } from "./fact-cards.js";
import { authenticatedReviewer } from "./access-auth.js";
import { findDuplicate, type DuplicateCandidate } from "./duplicate.js";
import { editorialIdentity } from "./editorial-identity.js";
import { eligibleReserveCards, loadEvergreenReserve } from "./evergreen-reserve.js";
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
const dailyPublishSlots = [[8, 30], [11, 30], [14, 30], [18, 0], [21, 0]] as const;
const bufferHandoffHours = Math.min(48, Math.max(1, Number(process.env.BUFFER_HANDOFF_HOURS || 24)));
const bufferQueueSoftLimit = Math.min(9, Math.max(1, Number(process.env.BUFFER_QUEUE_SOFT_LIMIT || 8)));
const publishAvailableAt = (scheduledAt: Date, now = new Date()) => new Date(Math.max(now.getTime(), scheduledAt.getTime() - bufferHandoffHours * 60 * 60_000));

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
const newsRelevant = (title: unknown, category: unknown) => {
  if (String(category || "general") !== "general") return true;
  return /\b(?:alert|bank|citizen|civil protection|consumer|countrywide|education|emergency|energy|evacuation|fire|flood|fraud|government|health|hospital|housing|immigrant|immigration|national|outage|payment|pension|public service|resident|school|scam|storm|strike|tax|transport|weather)\b/i.test(String(title || ""));
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
  };
  let publicCopy=[candidate.hook,candidate.caption,...candidate.slides.flatMap(slide=>[slide.title,slide.body,...slide.items])].join(" ");
  const missing:string[]=[];
  for(const [acronym,definition] of Object.entries(definitions)){
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

async function assessStoredRevision(postId: string, revisionId: string, requireRecent = false) {
  const [row]=await sql`SELECT p.topic,p.category,r.source_bundle,r.created_at FROM social_post p JOIN social_post_revision r ON r.id=${revisionId} AND r.post_id=p.id WHERE p.id=${postId}`;
  if(!row)return {passed:false,sensitive:false,failures:["Post revision is unavailable"],checkedAt:new Date().toISOString(),requiredAuthority:null,sourceCount:0,officialHostCount:0};
  const claims=await sql`SELECT claim_text AS claim,evidence_quote AS "evidenceQuote" FROM social_claim WHERE post_id=${postId} AND revision_id=${revisionId}`;
  const sources=(row.source_bundle||[]) as Array<Record<string,unknown>>;
  const assessment=assessEvidenceReliability({topic:String(row.topic),category:String(row.category),claims:claims.map(claim=>({claim:String(claim.claim),evidenceQuote:String(claim.evidenceQuote)})),sources:sources.map(source=>({url:String(source.url),title:String(source.title||""),publisher:source.publisher?String(source.publisher):null,tier:String(source.tier||""),retrievedAt:String(source.retrievedAt||""),excerpts:Array.isArray(source.excerpts)?source.excerpts.map(String):[]}))});
  if(requireRecent&&assessment.sensitive){
    const oldest=sources.reduce((age,source)=>Math.max(age,Date.now()-new Date(String(source.retrievedAt||0)).getTime()),0);
    if(!Number.isFinite(oldest)||oldest>24*60*60_000)return {...assessment,passed:false,failures:[...assessment.failures,"Sensitive evidence is older than 24 hours and must be researched again"]};
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

const GenerateSchema = z.object({ conceptId: z.string().uuid() });
const PlanningSchema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), capacity: z.number().int().min(1).max(5).default(2) });
const ResearchSchema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() });
const ReviewRequestSchema = z.object({ expiresInMinutes: z.number().int().min(5).max(1440).default(60), dryRun: z.boolean().default(false) });
const RenderRequestSchema = z.object({ idempotencyKey: z.string().min(8).max(200) });
const RenderFileSchema = z.object({ index: z.number().int().min(1).max(10), sha256: z.string().regex(/^[a-f0-9]{64}$/), bytes: z.number().int().positive().max(15_000_000), width: z.literal(1080), height: z.literal(1350), mimeType: z.literal("image/png") });
const UploadRequestSchema = z.object({ files: z.array(RenderFileSchema).min(3).max(7) });
const CompleteRenderSchema = z.object({ files: z.array(RenderFileSchema.extend({ key: z.string().min(10).max(500) })).min(3).max(7) });
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
const evidenceWindows=(text:string,terms:string[])=>{const normalized=text.replace(/\s+/g," ").trim();const windows:string[]=[];for(const term of terms){const at=normalized.toLocaleLowerCase("pt").indexOf(term.toLocaleLowerCase("pt"));if(at>=0)windows.push(normalized.slice(Math.max(0,at-350),Math.min(normalized.length,at+1650)));}if(!windows.length)windows.push(normalized.slice(0,2000));return [...new Set(windows)].slice(0,6);};

function createRenderManifest(post: Record<string, unknown>, revision: Record<string, unknown>) {
  const raw = revision.slides as Array<Record<string, unknown>>;
  const slides = raw.map((slide, index) => {
    const base = { eyebrow: fit(slide.eyebrow, 42), title: fit(slide.title, 82), sourceLabel: fit(slide.sourceLabel || post.source_authority || "Finkavo source-backed guide", 80) };
    const type = String(slide.type || (index === 0 ? "cover" : index === raw.length - 1 ? "summary" : "content"));
    const icon = String(slide.icon || "document");
    if (type === "cover") return { ...base, type, icon, category: fit(post.category || "Portugal", 32), subtitle: fit(slide.body, 150) };
    if (type === "summary") return { ...base, type, icon, body: fit(slide.body, 300), cta: fit(revision.call_to_action, 80) };
    if (type === "bullets" || type === "steps") return { ...base, type, icon, items: (slide.items as unknown[]).map((item) => fit(item, 130)).slice(0, 5) };
    return { ...base, type: "content", icon, body: fit(slide.body, 420), ...(slide.highlight ? { highlight: fit(slide.highlight, 80) } : {}) };
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
        const status = row.archived_at ? "archived" : row.publish_job_status === "blocked" ? "blocked" : (row.render_job_status === "failed" || row.publish_job_status === "failed") ? "failed" : lifecycleStatus;
        const revisionId = row.revision_id ? String(row.revision_id) : null;
        return {
          id:String(row.id),status,lifecycle_status:lifecycleStatus,topic:String(row.topic),category:String(row.category),risk_level:String(row.risk_level),
          planned_for:row.planned_for,created_at:row.created_at,approved_at:row.approved_at,scheduled_at:row.scheduled_at,published_at:row.published_at,
          hook:row.revision_hook||row.hook,caption:row.revision_caption||row.caption,call_to_action:row.revision_cta||row.call_to_action,
          hashtags:row.revision_hashtags||row.hashtags,slides:row.revision_slides||row.slides,sources:row.source_bundle||[],revision_id:row.revision_id,
          approval_decision:row.approval_decision,reviewer:row.reviewer,approval_comment:row.approval_comment,decided_at:row.decided_at,
          render_job_id:row.render_job_id,render_job_status:row.render_job_status,render_error:row.render_error,
          publish_job_id:row.publish_job_id,publish_job_status:row.publish_job_status,publish_error:row.publish_error,
          archived_at:row.archived_at,archive_note:row.archive_note,buffer_post_id:row.buffer_post_id,instagram_id:row.instagram_id,
          action_token:boardActionToken(String(row.id),revisionId,reviewer),media,events:eventsByPost.get(String(row.id))||[],
        };
      }));
      return send(res, 200, { generatedAt: new Date().toISOString(), reviewer, posts });
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
          await tx`UPDATE social_review_token SET used_at=now() WHERE post_id=${post.id} AND revision_id=${input.revisionId} AND used_at IS NULL`;
          await tx`INSERT INTO social_approval(post_id,revision_id,evidence_hash,decision,reviewer,comment) VALUES(${post.id},${input.revisionId},${revision.evidence_hash},${decision},${reviewer},${input.comment || null})`;
          if (decision === "approved") await tx`UPDATE social_post SET status='approved',approved_revision_id=${input.revisionId},approved_at=now(),approved_by=${reviewer},updated_at=now() WHERE id=${post.id}`;
          else {await tx`UPDATE social_post SET status='rejected',approved_revision_id=NULL,approved_at=NULL,approved_by=NULL,updated_at=now() WHERE id=${post.id}`;const concepts=await tx`UPDATE social_post_concept SET status='blocked',updated_at=now() WHERE topic=${post.topic} AND planned_for=${post.planned_for} RETURNING plan_slot_id`;for(const concept of concepts)if(concept.plan_slot_id)await tx`UPDATE social_editorial_plan_slot SET status='held',updated_at=now() WHERE id=${concept.plan_slot_id}`;}
          await audit(`post.${decision}`, { revisionId: input.revisionId, comment: input.comment || null });
          return { status: 200, message: decision === "approved" ? "Exact revision approved." : "Post rejected." };
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
        else {await tx`UPDATE social_post SET status = 'rejected', approved_revision_id = NULL, approved_at = NULL, approved_by = NULL, updated_at = now() WHERE id = ${token.post_id}`;const concepts=await tx`UPDATE social_post_concept SET status='blocked',updated_at=now() WHERE topic=${post.topic} AND planned_for=${post.planned_for} RETURNING plan_slot_id`;for(const concept of concepts)if(concept.plan_slot_id)await tx`UPDATE social_editorial_plan_slot SET status='held',updated_at=now() WHERE id=${concept.plan_slot_id}`;}
        await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${token.post_id}, ${`post.${decision}`}, ${tx.json({ revisionId: token.revision_id, reviewer: String(reviewer) })})`;
        return decision;
      });
      if (!result) return sendHtml(res, 410, "<h1>Review link expired or already used</h1>");
      if (result === "changed") return sendHtml(res, 409, "<h1>This revision or its evidence changed. Approval was refused.</h1>");
      return sendHtml(res, 200, `<h1>${result === "approved" ? "Approved" : "Rejected"}</h1><p>The exact reviewed revision was recorded. This link cannot be reused.</p>`);
    }

    if (req.headers.authorization !== `Bearer ${apiToken}`) return send(res, 401, { error: "Unauthorized" });

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
          ON CONFLICT (fingerprint) DO UPDATE SET document_id=excluded.document_id, status=CASE WHEN social_post_concept.status IN ('used','planned') THEN social_post_concept.status WHEN excluded.document_id IS NOT NULL THEN 'eligible' ELSE 'blocked' END, planned_for=excluded.planned_for, reason=excluded.reason, expires_at=excluded.expires_at, score=excluded.score, updated_at=now()
        `;
        if (document) eligible++; else blocked++;
      }
      await sql`INSERT INTO social_event (event_type, payload) VALUES ('planning.calendar_synced', ${sql.json({ rules: config.rules.length, campaigns: expanded.length, eligible, blocked, configVersion: config.version })})`;
      return send(res, 200, { rules: config.rules.length, campaigns: expanded.length, eligible, blocked });
    }

    if (req.method === "POST" && url.pathname === "/v1/planning/daily") {
      const { date, capacity } = PlanningSchema.parse(await readJson(req));
      const planningDate = date || new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
      const plan = await loadAnnualPlan();
      const selected = rowsForDate(plan, planningDate).slice(0, capacity);
      if (!selected.length) return send(res, 409, { error: "The requested date is outside the approved rolling annual plan" });
      await sql`UPDATE social_editorial_plan_slot SET status='replaced',updated_at=now() WHERE publish_date=${planningDate} AND plan_version<>${plan.version} AND status IN ('planned','researching','evidence_ready','held')`;
      const planned = [];
      for (const item of selected) {
        const derivedIdentity = editorialIdentity(item);
        const identity = { subjectFamily:item.brief.subjectFamily||derivedIdentity.subjectFamily,userQuestion:item.brief.userQuestion||derivedIdentity.userQuestion,contentIntent:item.brief.contentIntent||derivedIdentity.contentIntent,occurrenceKey:item.brief.occurrenceKey||derivedIdentity.occurrenceKey,campaignStage:item.brief.campaignStage||derivedIdentity.campaignStage };
        const [slot] = await sql`
          INSERT INTO social_editorial_plan_slot (plan_version,publish_date,publish_time,slot_number,pillar,angle,topic,audience,risk_level,timing_class,reserve_kind,search_terms,required_authority,occurrence_number,subject_family,user_question,content_intent,occurrence_key,campaign_stage,brief)
          VALUES (${plan.version},${item.date},${item.time},${item.slot},${item.pillar},${item.angle},${item.title},${item.audience},${item.risk},${item.timing},${item.reserve},${sql.json(item.evidenceTerms.split("|").map(v=>v.trim()).filter(Boolean))},${item.authority},${item.occurrence},${identity.subjectFamily},${identity.userQuestion},${identity.contentIntent},${identity.occurrenceKey},${identity.campaignStage},${sql.json(item.brief)})
          ON CONFLICT (plan_version,publish_date,slot_number) DO UPDATE SET topic=excluded.topic,audience=excluded.audience,risk_level=excluded.risk_level,timing_class=excluded.timing_class,search_terms=excluded.search_terms,required_authority=excluded.required_authority,subject_family=excluded.subject_family,user_question=excluded.user_question,content_intent=excluded.content_intent,occurrence_key=excluded.occurrence_key,campaign_stage=excluded.campaign_stage,brief=excluded.brief,updated_at=now()
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
      const rows = await sql`SELECT c.* FROM social_post_concept c JOIN social_topic_evidence_bundle b ON b.id=c.evidence_bundle_id AND b.verification_state='verified' AND b.expires_at>now() WHERE c.status='planned' AND c.planned_for=${planningDate} ORDER BY c.score DESC LIMIT 5`;
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

    if(req.method==="POST"&&url.pathname==="/v1/reserve/replace-held"){
      const {date}=ReportSchema.parse(await readJson(req));const day=date||lisbonDate(new Date());const heldSlots=await sql`SELECT * FROM social_editorial_plan_slot s WHERE s.publish_date=${day} AND s.plan_version=(SELECT max(current_slot.plan_version) FROM social_editorial_plan_slot current_slot WHERE current_slot.publish_date=s.publish_date) AND s.status='held' ORDER BY s.slot_number`;
      const cards=await loadEvergreenReserve();const urls=[...new Set(cards.map(card=>card.sourcePolicy.canonicalUrl))];const evidence=await sql`SELECT DISTINCT ON (canonical_url) canonical_url AS "canonicalUrl",verified_at AS "verifiedAt",document_id,title,authority,content_hash,visible_text FROM social_reserve_evidence WHERE canonical_url IN ${sql(urls)} AND available=true AND document_id IS NOT NULL ORDER BY canonical_url,verified_at DESC`;const recent=await sql`SELECT subject_family AS "subjectFamily",user_question AS "userQuestion",audience,content_intent AS "contentIntent",created_at AS "usedAt" FROM social_post WHERE created_at>now()-INTERVAL '90 days' AND status NOT IN ('blocked','rejected','failed')`;let eligible=eligibleReserveCards(cards,evidence.map(row=>({canonicalUrl:String(row.canonicalUrl),verifiedAt:String(row.verifiedAt),visibleText:String(row.visible_text)})),recent.map(row=>({subjectFamily:String(row.subjectFamily||""),userQuestion:String(row.userQuestion||""),audience:String(row.audience||""),contentIntent:String(row.contentIntent||""),usedAt:String(row.usedAt)})));const replacements=[];
      for(const slot of heldSlots){
        const attemptedRows=await sql`SELECT topic FROM social_post_concept WHERE plan_slot_id=${slot.id}`;const attemptedTopics=new Set(attemptedRows.map(row=>String(row.topic)));const unused=eligible.filter(card=>!attemptedTopics.has(card.topic));
        const samePillar=unused.filter(card=>card.subjectFamily===slot.pillar);const pool=samePillar.length?samePillar:unused;if(!pool.length)break;
        const card=pool[0];eligible=eligible.filter(item=>item.id!==card.id);const source=evidence.find(row=>row.canonicalUrl===card.sourcePolicy.canonicalUrl)!;const sources=[{documentId:String(source.document_id),url:card.sourcePolicy.canonicalUrl,title:String(source.title),publisher:String(source.authority),tier:'official',locale:'pt',retrievedAt:String(source.verifiedAt),contentHash:String(source.content_hash),relevanceScore:100,matchedTerms:card.evidenceTerms,excerpts:evidenceWindows(String(source.visible_text),card.evidenceTerms)}];const bundleHash=hash(sources);const [bundle]=await sql`INSERT INTO social_topic_evidence_bundle(plan_slot_id,bundle_hash,sources,verification_state,verified_at,expires_at) VALUES(${slot.id},${bundleHash},${sql.json(sources)},'verified',now(),now()+(${card.sourcePolicy.freshnessDays}::STRING||' days')::INTERVAL) ON CONFLICT(plan_slot_id,bundle_hash) DO UPDATE SET verification_state='verified',verified_at=now(),expires_at=excluded.expires_at RETURNING id`;const briefIdentity=hash({id:card.id,topic:card.topic,userQuestion:card.userQuestion,audience:card.audience,contentIntent:card.contentIntent}).slice(0,16);const fingerprint=`held-fallback:${slot.plan_version}:${day}:${slot.slot_number}:${briefIdentity}`;const [concept]=await sql`INSERT INTO social_post_concept(document_id,topic,category,risk_level,priority,timeliness,fingerprint,status,planned_for,reason,repeat_allowed,score,plan_slot_id,evidence_bundle_id,subject_family,user_question,content_intent) VALUES(${source.document_id},${card.topic},${card.subjectFamily},'medium',${100-Number(slot.slot_number)},'evergreen',${fingerprint},'planned',${day},${`Evidence hold replacement for: ${slot.topic}`},false,${100-Number(slot.slot_number)},${slot.id},${bundle.id},${card.subjectFamily},${card.userQuestion},${card.contentIntent}) ON CONFLICT(fingerprint) DO UPDATE SET document_id=excluded.document_id,topic=excluded.topic,category=excluded.category,evidence_bundle_id=excluded.evidence_bundle_id,subject_family=excluded.subject_family,user_question=excluded.user_question,content_intent=excluded.content_intent,status=CASE WHEN social_post_concept.status='used' THEN 'used' ELSE 'planned' END,updated_at=now() RETURNING id`;await sql`UPDATE social_editorial_plan_slot SET topic=${card.topic},pillar=${card.subjectFamily},audience=${card.audience},timing_class='evergreen',reserve_kind='evidence_hold_fallback',search_terms=${sql.json(card.evidenceTerms)},required_authority=${card.sourcePolicy.canonicalUrl},subject_family=${card.subjectFamily},user_question=${card.userQuestion},content_intent=${card.contentIntent},occurrence_key=NULL,campaign_stage='evidence_hold_fallback',brief=${sql.json(card)},status='evidence_ready',updated_at=now() WHERE id=${slot.id}`;await sql`INSERT INTO social_event(event_type,payload) VALUES('planning.held_replaced',${sql.json({slotId:slot.id,originalTopic:slot.topic,reserveId:card.id,replacementTopic:card.topic,conceptId:concept.id})})`;replacements.push({slotId:slot.id,originalTopic:slot.topic,reserveId:card.id,topic:card.topic});}
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

    if (req.method === "GET" && url.pathname === "/v1/discoveries") {
      const rows = await sql`SELECT id, canonical_url, title, publisher, locale, published_at, source_kind, evidence_state, category, risk_level, created_at FROM social_discovery ORDER BY COALESCE(published_at, created_at) DESC LIMIT 100`;
      return send(res, 200, { discoveries: rows });
    }

    if (req.method === "POST" && url.pathname === "/v1/verification/triage") {
      const discoveries = await sql`SELECT * FROM social_discovery WHERE evidence_state='discovery_only' ORDER BY COALESCE(published_at, created_at) DESC LIMIT 100`;
      let promoted = 0;
      let held = 0;
      for (const discovery of discoveries) {
        const hostname = new URL(String(discovery.canonical_url)).hostname.replace(/^www\./, "");
        const official = officialDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
        if (!official) { held++; continue; }
        const [document] = await sql`
          SELECT id FROM document WHERE verified_still_available=true AND freshness_confidence='fresh' AND source_tier='official'
            AND source_url=${String(discovery.canonical_url)} ORDER BY COALESCE(last_verified_at,fetched_at) DESC LIMIT 1
        `;
        if (!document) { held++; continue; }
        const fingerprint = `official-change:${discovery.content_hash}`;
        await sql.begin(async (tx) => {
          await tx`UPDATE social_discovery SET evidence_state='promoted', updated_at=now() WHERE id=${discovery.id}`;
          await tx`
            INSERT INTO social_post_concept (document_id, discovery_id, topic, category, risk_level, priority, timeliness, fingerprint, status, reason, repeat_allowed, score)
            VALUES (${document.id}, ${discovery.id}, ${discovery.title}, ${discovery.category}, ${discovery.risk_level}, 90, 'official_change', ${fingerprint}, 'eligible', 'New or changed official notice verified against the canonical corpus', true, 90)
            ON CONFLICT (fingerprint) DO NOTHING
          `;
        });
        promoted++;
      }
      await sql`INSERT INTO social_event (event_type, payload) VALUES ('verification.triaged', ${sql.json({ reviewed: discoveries.length, promoted, held })})`;
      return send(res, 200, { reviewed: discoveries.length, promoted, held, rule: "Only exact official URLs already present in the fresh canonical corpus are promoted" });
    }

    if (req.method === "POST" && url.pathname === "/v1/news/dispatch-recent") {
      const candidates = await sql`
        SELECT c.id,c.topic,c.category,c.discovery_id,d.content_hash,COALESCE(d.published_at,d.created_at) AS discovered_at
        FROM social_post_concept c
        JOIN social_discovery d ON d.id=c.discovery_id
        WHERE c.status='eligible' AND c.timeliness='official_change'
          AND COALESCE(d.published_at,d.created_at)>=now()-INTERVAL '4 hours'
        ORDER BY COALESCE(d.published_at,d.created_at),c.created_at
        LIMIT 20
      `;
      const results: any[] = [];
      for (const candidate of candidates) {
        if (!newsRelevant(candidate.topic,candidate.category)) {
          await sql`UPDATE social_post_concept SET status='blocked',reason='News item is outside Finkavo relevance policy',updated_at=now() WHERE id=${candidate.id} AND status='eligible'`;
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
      await sql`INSERT INTO social_event(event_type,payload) VALUES('news.fast_lane_dispatched',${sql.json({windowHours:4,candidates:candidates.length,results})})`;
      return send(res,200,{windowHours:4,candidates:candidates.length,results});
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
      const generationInput = GenerateSchema.parse(await readJson(req));
      const [selectedConcept] = await sql`SELECT c.*,b.sources,b.bundle_hash,b.expires_at,s.brief FROM social_post_concept c LEFT JOIN social_topic_evidence_bundle b ON b.id=c.evidence_bundle_id AND b.verification_state='verified' AND b.expires_at>now() LEFT JOIN social_editorial_plan_slot s ON s.id=c.plan_slot_id WHERE c.id=${generationInput.conceptId} AND c.status='planned'`;
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
      if (!evidenceSources.length) return send(res,409,{error:"Concept has no current verified source material"});
      const source=evidenceSources[0]; const documentId=String(source.documentId);
      let checked: z.infer<typeof DraftSchema> | null = null;
      let model = "";
      let lastGenerationError = "";
      if (evidenceSources.some(source=>source.deterministicFactCard===true)) {
        checked=simpleDraft(String(selectedConcept.topic),evidenceSources.flatMap(source=>source.excerpts as string[]));
        model="deterministic-fact-card-v1";
      }
      for (let attempt = 1; !checked && attempt <= 3; attempt++) {
        try {
          const generated = await generateDraft({
            title: String(selectedConcept.topic), sourceUrl: String(source.url),
            authority: source.publisher ? String(source.publisher) : null,
            fetchedAt: String(source.retrievedAt), excerpts: evidenceSources.flatMap(s=>s.excerpts as string[]),
            sources: evidenceSources.map(s=>({title:String(s.title),sourceUrl:String(s.url),authority:s.publisher?String(s.publisher):null,fetchedAt:String(s.retrievedAt),excerpts:s.excerpts as string[]})),
            ...(lastGenerationError ? { repairFeedback: lastGenerationError } : {}),
            ...(selectedConcept ? { editorialContext: { topic: String(selectedConcept.topic), reason: selectedConcept.reason ? String(selectedConcept.reason) : null, campaignStage: selectedConcept.campaign_stage ? String(selectedConcept.campaign_stage) : null, plannedFor: selectedConcept.planned_for ? String(selectedConcept.planned_for) : null, expiresAt: selectedConcept.expires_at ? String(selectedConcept.expires_at) : null, purpose:selectedConcept.brief?.purpose?String(selectedConcept.brief.purpose):undefined,userQuestion:selectedConcept.brief?.userQuestion?String(selectedConcept.brief.userQuestion):undefined,requiredAnswers:Array.isArray(selectedConcept.brief?.requiredAnswers)?selectedConcept.brief.requiredAnswers.map(String):undefined } } : {}),
          });
          const candidate = ensureKnownAcronymsAreDefined(DraftSchema.parse(generated.draft));
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
          const corpusText = evidenceSources.flatMap(s=>s.excerpts as string[]).join("\n").replace(/\s+/g, " ");
          const unsupported = candidate.claims.find((claim) => !corpusText.includes(claim.evidenceQuote.replace(/\s+/g, " ")));
          if (unsupported) throw new Error("A claim evidence quote was not found verbatim in the supplied corpus excerpts");
          if (candidate.riskLevel === "high" && !evidenceSources.some(s=>s.tier === "official")) throw new Error("High-risk content requires an official primary source");
          const reliability=assessEvidenceReliability({topic:candidate.topic,category:candidate.category,claims:candidate.claims,sources:evidenceSources.map(s=>({url:String(s.url),title:String(s.title),publisher:s.publisher?String(s.publisher):null,tier:String(s.tier),retrievedAt:String(s.retrievedAt),excerpts:(s.excerpts as string[])||[]}))});
          if(!reliability.passed)throw new Error(`Evidence reliability gate failed: ${reliability.failures.join("; ")}`);
          checked = candidate;
          model = generated.model;
          break;
        } catch (error) {
          lastGenerationError = error instanceof Error ? error.message : "Generation validation failed";
        }
      }
      if (!checked) {
        await sql.begin(async tx=>{await tx`UPDATE social_post_concept SET status='blocked',updated_at=now() WHERE id=${selectedConcept.id}`;if(selectedConcept.plan_slot_id)await tx`UPDATE social_editorial_plan_slot SET status='held',updated_at=now() WHERE id=${selectedConcept.plan_slot_id}`;await tx`INSERT INTO social_event (event_type, payload) VALUES ('generation.failed', ${tx.json({ documentId,conceptId:selectedConcept.id,planSlotId:selectedConcept.plan_slot_id,error: lastGenerationError })})`;});
        return send(res, 422, { error: "Structured generation failed after the initial attempt and two targeted repairs", detail: lastGenerationError });
      }
      const reliability=assessEvidenceReliability({topic:checked.topic,category:checked.category,claims:checked.claims,sources:evidenceSources.map(s=>({url:String(s.url),title:String(s.title),publisher:s.publisher?String(s.publisher):null,tier:String(s.tier),retrievedAt:String(s.retrievedAt),excerpts:(s.excerpts as string[])||[]}))});
      const sourceBundle = evidenceSources.map(s=>({documentId:String(s.documentId),url:String(s.url),title:String(s.title),publisher:s.publisher?String(s.publisher):null,locale:String(s.locale),retrievedAt:String(s.retrievedAt),contentHash:String(s.contentHash),tier:String(s.tier),excerpts:(s.excerpts as string[])||[],reliability}));
      const evidenceHash = hash({ sourceBundle, claims: checked.claims });
      const contentHash = hash({ hook: checked.hook, caption: checked.caption, callToAction: checked.callToAction, hashtags: checked.hashtags, searchKeywords: checked.searchKeywords, postIntent: checked.postIntent, slides: checked.slides });
      const duplicate = await findRecentDuplicate({ topic: checked.topic, category: checked.category, audience: "English-speaking people in Portugal", postIntent: checked.postIntent, content_hash: contentHash, subject_family: selectedConcept.subject_family, user_question: selectedConcept.user_question, content_intent: selectedConcept.content_intent, occurrence_key: selectedConcept.occurrence_key });
      if (duplicate) {
        await sql.begin(async tx => {
          await tx`UPDATE social_post_concept SET status='blocked',updated_at=now() WHERE id=${selectedConcept.id}`;
          if(selectedConcept.plan_slot_id)await tx`UPDATE social_editorial_plan_slot SET status='held',updated_at=now() WHERE id=${selectedConcept.plan_slot_id}`;
          await tx`INSERT INTO social_event(event_type,payload) VALUES('quality.duplicate_blocked',${tx.json({ conceptId: String(selectedConcept.id), duplicateOf: String(duplicate.post.id), reason: duplicate.reason, stage: 'generation' })})`;
        });
        return send(res, 409, { error: "Duplicate topic blocked", duplicateOf: duplicate.post.id, reason: duplicate.reason });
      }
      const inserted = await sql.begin(async (tx) => {
        const [post] = await tx`
          INSERT INTO social_post (topic, source_document_id, source_url, source_title, source_authority, source_fetched_at,
            hook, caption, call_to_action, hashtags, slides, model, category, risk_level, post_intent, search_keywords,subject_family,user_question,content_intent,occurrence_key,planned_for)
          VALUES (${checked.topic}, ${documentId}, ${String(source.url)}, ${String(source.title)},
            ${source.publisher ? String(source.publisher) : null}, ${String(source.retrievedAt)},
            ${checked.hook}, ${checked.caption}, ${checked.callToAction}, ${tx.json(checked.hashtags)}, ${tx.json(checked.slides)}, ${model}, ${checked.category}, ${checked.riskLevel}, ${checked.postIntent}, ${tx.json(checked.searchKeywords)},${selectedConcept.subject_family},${selectedConcept.user_question},${selectedConcept.content_intent},${selectedConcept.occurrence_key},${selectedConcept.planned_for})
          RETURNING *
        `;
        const [revision] = await tx`
          INSERT INTO social_post_revision (post_id, revision_number, locale, template_version, hook, caption, call_to_action,
            hashtags, slides, alt_texts, source_bundle, evidence_hash, content_hash, model, prompt_version, post_intent, search_keywords)
          VALUES (${post.id}, 1, 'en', 'finkavo-v3', ${checked.hook}, ${checked.caption}, ${checked.callToAction},
            ${tx.json(checked.hashtags)}, ${tx.json(checked.slides)}, ${tx.json(checked.slides.map((slide) => slide.altText))},
            ${tx.json(sourceBundle)}, ${evidenceHash}, ${contentHash}, ${model}, 'v2', ${checked.postIntent}, ${tx.json(checked.searchKeywords)}) RETURNING *
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
        await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${post.id}, 'draft.created', ${tx.json({ model, revisionId: revision.id, evidenceHash, contentHash })})`;
        if (selectedConcept?.id) await tx`UPDATE social_post_concept SET status='used', updated_at=now() WHERE id=${selectedConcept.id}`;
        post.current_revision_id = revision.id;
        return post;
      });
      return send(res, 201, { post: inserted });
    }

    if (req.method === "POST" && url.pathname === "/v1/generation/recover-day") {
      const input = z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        target: z.number().int().min(1).max(5).default(5),
        maxRounds: z.number().int().min(1).max(8).default(6),
        maxConcepts: z.number().int().min(1).max(5).default(5),
        dailyAttemptBudget: z.number().int().min(5).max(20).default(12),
      }).parse(await readJson(req));
      const day = input.date || lisbonDate(new Date());
      const attempts: Array<{ round: number; stage: string; ok: boolean; replacements?: number; conceptId?: string; topic?: string | null; status?: number; error?: string | null }> = [];
      const reviews: Array<{ postId: string; ok: boolean; status: number; error: string | null }> = [];
      let replacements = 0;
      const [attemptCount] = await sql`SELECT count(*) AS count FROM social_event WHERE event_type='generation.candidate_attempted' AND payload->>'day'=${day}`;
      let attemptsUsed = Number(attemptCount.count);
      let budgetExhausted = attemptsUsed >= input.dailyAttemptBudget;
      for (let round = 1; round <= input.maxRounds; round++) {
        const [count] = await sql`SELECT count(*) AS count FROM social_post WHERE planned_for=${day} AND archived_at IS NULL AND status NOT IN ('blocked','failed','rejected')`;
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
          await sql`INSERT INTO social_event(event_type,payload) VALUES('generation.candidate_attempted',${sql.json({day,conceptId:concept.id,topic:concept.topic||null,attemptNumber:attemptsUsed+1,attemptBudget:input.dailyAttemptBudget})})`;
          attemptsUsed++;
          const generated = await internalApi("POST", "/v1/generate", { conceptId: concept.id });
          attempts.push({ round, stage: "generation", conceptId: concept.id, topic: concept.topic || null, ok: generated.ok, status: generated.status, error: generated.ok ? null : String(generated.result.detail || generated.result.error || "generation failed") });
          const postId=generated.ok&&generated.result.post&&typeof generated.result.post==='object'?String((generated.result.post as Record<string,unknown>).id||''):'';
          if(postId){const reviewed=await internalApi("POST",`/v1/posts/${postId}/request-review`,{expiresInMinutes:180});reviews.push({postId,ok:reviewed.ok,status:reviewed.status,error:reviewed.ok?null:String(reviewed.result.error||"review request failed")});}
        }
        if (budgetExhausted) break;
      }
      const posts = await sql`SELECT id,topic,status FROM social_post WHERE planned_for=${day} AND archived_at IS NULL AND status NOT IN ('blocked','failed','rejected') ORDER BY created_at`;
      const complete = posts.length >= input.target;
      const drafts = await sql`SELECT id FROM social_post WHERE planned_for=${day} AND status='draft' ORDER BY created_at`;
      for (const draft of drafts) {
        if(reviews.some(review=>review.postId===String(draft.id)))continue;
        const reviewed = await internalApi("POST", `/v1/posts/${draft.id}/request-review`, { expiresInMinutes: 180 });
        reviews.push({ postId: String(draft.id), ok: reviewed.ok, status: reviewed.status, error: reviewed.ok ? null : String(reviewed.result.error || "review request failed") });
      }
      const ready = complete && reviews.every(review => review.ok);
      budgetExhausted = !complete && attemptsUsed >= input.dailyAttemptBudget;
      await sql`INSERT INTO social_event(event_type,payload) VALUES('generation.day_recovery_completed',${sql.json({day,target:input.target,complete,ready,validPosts:posts.length,replacements,attempts,reviews,attemptsUsed,attemptBudget:input.dailyAttemptBudget,budgetExhausted})})`;
      return send(res, 200, { date: day, target: input.target, complete, ready, alertRequired: budgetExhausted, validPosts: posts.length, replacements, posts, attempts, reviews, attemptsUsed, attemptBudget: input.dailyAttemptBudget, budgetExhausted });
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
          const manifest = createRenderManifest(row as Record<string, unknown>, { id: row.revision_id, slides: row.revision_slides, call_to_action: row.revision_cta });
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
          const [job] = await tx`INSERT INTO social_publish_job (post_id,revision_id,render_job_id,idempotency_key,scheduled_at,available_at) VALUES (${post.id},${post.revision_id},${post.render_job_id},${idempotencyKey},${slot.toISOString()},${availableAt.toISOString()}) RETURNING id`;
          await tx`UPDATE social_post SET scheduled_at=${slot.toISOString()},updated_at=now() WHERE id=${post.id}`;
          await tx`INSERT INTO social_event (post_id,event_type,payload) VALUES (${post.id},'publish.queued',${tx.json({ jobId: job.id, scheduledAt: slot.toISOString(), automated: true })})`;
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
      await notifyDiscordReview({ title: "Instagram carousel ready for review", postId: reviewRequest[1], expiresAt: created.expires_at, actionUrl: reviewUrl, caption: finalCaption, files: previewFiles });
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
      if (files.length !== (job.manifest as { slides: unknown[] }).slides.length) return send(res, 400, { error: "Rendered file count does not match manifest" });
      const date = new Date(job.created_at as string);
      const prefix = `social/carousels/${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${String(date.getUTCDate()).padStart(2, "0")}/${job.post_id}/${job.revision_id}`;
      const uploads = await Promise.all(files.map(async (file) => {
        const stored: RenderFileInput = { ...file, key: `${prefix}/${String(file.index).padStart(2, "0")}.png` };
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
      if (updated && updated.status === "failed") await notifyDiscord("errors", "Carousel rendering failed permanently", { post: updated.post_id, job: updated.id, code: updated.error_code, attempt: updated.attempt_count });
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
        const [created] = await tx`INSERT INTO social_publish_job (post_id, revision_id, render_job_id, idempotency_key, scheduled_at, available_at) VALUES (${post.id}, ${post.revision_id}, ${post.render_job_id}, ${idempotencyKey}, ${scheduledAt}, ${availableAt.toISOString()}) RETURNING *`;
        await tx`UPDATE social_post SET scheduled_at = ${scheduledAt}, updated_at = now() WHERE id = ${post.id}`;
        await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${post.id}, 'publish.queued', ${tx.json({ jobId: created.id, scheduledAt })})`;
        return created;
      });
      return job ? send(res, 201, { job }) : send(res, 409, { error: "Only an approved, completed render of the current revision can be scheduled" });
    }

    if (req.method === "POST" && url.pathname === "/v1/publish-jobs/reconcile-blocked") {
      const jobs = await sql`
        SELECT j.*,jsonb_build_object('hook',p.hook,'caption',p.caption,'call_to_action',p.call_to_action,'hashtags',p.hashtags) AS post
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
        await tx`INSERT INTO social_publish_attempt (job_id, attempt_number, request_fingerprint) VALUES (${candidate.id}, ${attempt}, ${requestFingerprint})`;
        return { ...claimed, post };
      });
      if (!job) return send(res, 200, { job: null });
      try {
        const reliability=await assessStoredRevision(String(job.post_id),String(job.revision_id),true);
        if(!reliability.passed){await sql.begin(async tx=>{await tx`UPDATE social_publish_job SET status='blocked',lease_owner=NULL,lease_expires_at=NULL,error_code='EVIDENCE_REVALIDATION_FAILED',error_message=${reliability.failures.join("; ")},updated_at=now() WHERE id=${job.id}`;await tx`UPDATE social_post SET status='blocked',updated_at=now() WHERE id=${job.post_id}`;await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${job.post_id},'evidence.reliability_blocked',${tx.json({stage:'pre_publish',jobId:job.id,...reliability})})`;});await notifyDiscord("errors","Publication blocked by evidence validation",{post:job.post_id,job:job.id,problems:reliability.failures.join("\n")});return send(res,422,{error:"Publication blocked by evidence validation",...reliability});}
        assertPublishableCopy(job.post as Record<string, unknown>);
        const channelId = process.env.BUFFER_CHANNEL_ID;
        if (!channelId) throw new BufferError("BUFFER_CHANNEL_ID is not configured", "CHANNEL_NOT_CONFIGURED", false);
        const storedFiles = job.post.render_files as Array<{ key: string }>;
        const mediaUrls = await Promise.all(storedFiles.map((file) => createBufferMediaUrl(file.key)));
        const hashtags = job.post.hashtags as string[];
        const text = composeInstagramCaption({ hook: String(job.post.hook), body: String(job.post.caption), callToAction: String(job.post.call_to_action), hashtags });
        const providerPost = await createScheduledPost({ channelId, text, dueAt: new Date(job.scheduled_at as string).toISOString(), mediaUrls });
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
          await notifyDiscord("errors", blocked ? "Publish result needs reconciliation" : "Publish failed", {
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
      const jobs = await sql`
        SELECT * FROM social_publish_job
        WHERE status = 'scheduled' AND scheduled_at <= now() + INTERVAL '10 minutes'
        ORDER BY scheduled_at LIMIT 10
      `;
      const results: Array<{ id: string; status: string }> = [];
      for (const job of jobs) {
        try {
          const providerPost = await getBufferPost(String(job.provider_post_id));
          if (!providerPost) continue;
          if (providerPost.status === "sent") {
            await sql.begin(async (tx) => {
              await tx`UPDATE social_publish_job SET status = 'published', provider_status = 'sent', updated_at = now() WHERE id = ${job.id}`;
              await tx`UPDATE social_post SET status = 'published', published_at = ${providerPost.sentAt || new Date().toISOString()}, updated_at = now() WHERE id = ${job.post_id}`;
              await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${job.post_id}, 'publish.published', ${tx.json({ jobId: job.id, bufferPostId: job.provider_post_id })})`;
            });
            await notifyDiscord("published", "Instagram post published", { post: job.post_id, slides: (await sql`SELECT jsonb_array_length(render_files) AS count FROM social_post WHERE id = ${job.post_id}`)[0]?.count || "unknown" });
          } else if (providerPost.status === "error") {
            await sql.begin(async tx => {
              await tx`UPDATE social_publish_job SET status='retrying',provider_post_id=NULL,provider_status='error',available_at=now()+INTERVAL '30 minutes',error_code='BUFFER_POST_ERROR',error_message='Buffer reported post error; queued for a new slot',updated_at=now() WHERE id=${job.id}`;
              await tx`UPDATE social_post SET status='rendered',buffer_post_id=NULL,updated_at=now() WHERE id=${job.post_id}`;
              await tx`INSERT INTO social_event(post_id,event_type,payload) VALUES(${job.post_id},'publish.provider_error_requeued',${tx.json({jobId:job.id,bufferPostId:job.provider_post_id})})`;
            });
            const [failedPost] = await sql`SELECT topic FROM social_post WHERE id=${job.post_id}`;
            const boardUrl = `${(reviewBaseUrl || "https://approve.finkavo.com").replace(/\/$/, "")}/board?post=${job.post_id}`;
            await notifyDiscord("errors", "Buffer/Instagram delivery failed; post retained", {
              topic: failedPost?.topic || "Unknown topic", postId: job.post_id, publishJobId: job.id,
              bufferPostId: job.provider_post_id, failedScheduledTime: new Date(job.scheduled_at as string).toISOString(),
              providerStatus: "error", recovery: "Returned to the durable local queue for automatic assignment to the next available slot.",
            }, boardUrl);
          } else await sql`UPDATE social_publish_job SET provider_status = ${providerPost.status}, updated_at = now() WHERE id = ${job.id}`;
          results.push({ id: String(job.id), status: providerPost.status });
        } catch (error) {
          results.push({ id: String(job.id), status: `monitor_error:${error instanceof Error ? error.message : "unknown"}` });
          await sql`INSERT INTO social_event(post_id,event_type,payload) VALUES(${job.post_id},'publish.monitor_error',${sql.json({jobId:job.id,code:error instanceof BufferError?error.code:'MONITOR_ERROR'})})`;
          if (error instanceof BufferError && error.code === "RATE_LIMIT_EXCEEDED") break;
        }
      }
      return send(res, 200, { results });
    }

    if(req.method==="POST"&&url.pathname==="/v1/reliability/audit-queue"){
      const input=z.object({dryRun:z.boolean().default(true)}).parse(await readJson(req));
      const rows=await sql`SELECT p.id,p.topic,p.status,p.current_revision_id,j.id AS job_id,j.status AS job_status,j.provider_post_id FROM social_post p LEFT JOIN LATERAL(SELECT * FROM social_publish_job WHERE post_id=p.id ORDER BY created_at DESC LIMIT 1)j ON true WHERE p.status NOT IN('published','rejected','failed','blocked') AND p.archived_at IS NULL AND p.current_revision_id IS NOT NULL`;
      const checked=[];const blocked=[];const external=[];
      for(const row of rows){
        const assessment=await assessStoredRevision(String(row.id),String(row.current_revision_id),true);
        checked.push({postId:row.id,topic:row.topic,status:row.status,...assessment});
        if(assessment.passed)continue;
        if(row.job_status==='scheduled'&&row.provider_post_id){
          const item={postId:row.id,topic:row.topic,bufferPostId:row.provider_post_id,failures:assessment.failures};external.push(item);
          if(!input.dryRun){try{await deleteBufferPost(String(row.provider_post_id));await sql.begin(async tx=>{await tx`UPDATE social_publish_job SET status='blocked',provider_status='deleted_for_evidence_review',error_code='EVIDENCE_REVALIDATION_FAILED',error_message=${assessment.failures.join("; ")},updated_at=now() WHERE id=${row.job_id}`;await tx`UPDATE social_post SET status='blocked',buffer_post_id=NULL,updated_at=now() WHERE id=${row.id}`;const concepts=await tx`UPDATE social_post_concept SET status='blocked',updated_at=now() WHERE topic=${row.topic} AND planned_for=(SELECT planned_for FROM social_post WHERE id=${row.id}) RETURNING plan_slot_id`;for(const concept of concepts)if(concept.plan_slot_id)await tx`UPDATE social_editorial_plan_slot SET status='held',updated_at=now() WHERE id=${concept.plan_slot_id}`;await tx`INSERT INTO social_event(post_id,event_type,payload)VALUES(${row.id},'evidence.buffer_post_deleted',${tx.json({bufferPostId:row.provider_post_id,...assessment})})`;});}catch(error){(item as Record<string,unknown>).deleteError=error instanceof Error?error.message:'Buffer deletion failed';}}
          continue;
        }
        if(!input.dryRun){await sql.begin(async tx=>{if(row.job_id)await tx`UPDATE social_publish_job SET status='blocked',error_code='EVIDENCE_REVALIDATION_FAILED',error_message=${assessment.failures.join("; ")},updated_at=now() WHERE id=${row.job_id} AND status IN('pending','processing','retrying')`;await tx`UPDATE social_post SET status='blocked',updated_at=now() WHERE id=${row.id}`;const concepts=await tx`UPDATE social_post_concept SET status='blocked',updated_at=now() WHERE topic=${row.topic} AND planned_for=(SELECT planned_for FROM social_post WHERE id=${row.id}) RETURNING plan_slot_id`;for(const concept of concepts)if(concept.plan_slot_id)await tx`UPDATE social_editorial_plan_slot SET status='held',updated_at=now() WHERE id=${concept.plan_slot_id}`;await tx`INSERT INTO social_event(post_id,event_type,payload)VALUES(${row.id},'evidence.queue_audit_blocked',${tx.json(assessment)})`;});}
        blocked.push({postId:row.id,topic:row.topic,failures:assessment.failures});
      }
      if(external.length&&!input.dryRun)await notifyDiscord('errors','Buffer posts require evidence review before publication',{posts:external.map(item=>`${item.topic} — post ${item.postId}, Buffer ${item.bufferPostId}`).join('\n')});
      return send(res,200,{dryRun:input.dryRun,checked:checked.length,passed:checked.filter(item=>item.passed).length,blocked,external});
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
      return send(res, 200, { counts, planning, upcomingDeadlines, renderer, oldestQueuedRender: oldest?.oldest_job || null, publishQueue, bufferHandoffHours, bufferQueueSoftLimit, healthy: renderer ? Date.now() - new Date(renderer.last_seen_at as string).getTime() < 5 * 60_000 : false });
    }

    if(req.method==="POST"&&url.pathname==="/v1/reports/daily"){
      const {date}=ReportSchema.parse(await readJson(req));const day=date||lisbonDate(new Date());
      const slots=await sql`SELECT s.slot_number,s.publish_time,s.topic,s.status,s.reserve_kind,s.campaign_stage,b.verification_state,b.expires_at,g.generation_error FROM social_editorial_plan_slot s LEFT JOIN LATERAL (SELECT verification_state,expires_at FROM social_topic_evidence_bundle WHERE plan_slot_id=s.id ORDER BY verified_at DESC LIMIT 1) b ON true LEFT JOIN LATERAL (SELECT payload->>'error' AS generation_error FROM social_event WHERE event_type='generation.failed' AND payload->>'planSlotId'=s.id::STRING ORDER BY created_at DESC LIMIT 1) g ON true WHERE s.publish_date=${day} AND s.plan_version=(SELECT max(plan_version) FROM social_editorial_plan_slot WHERE publish_date=${day}) ORDER BY s.slot_number`;
      const approvals=await sql`SELECT p.topic,p.status,p.scheduled_at FROM social_post p WHERE (p.created_at AT TIME ZONE 'Europe/Lisbon')::DATE=${day} OR (p.scheduled_at AT TIME ZONE 'Europe/Lisbon')::DATE=${day} ORDER BY p.scheduled_at NULLS LAST,p.created_at`;
      const [news]=await sql`SELECT count(*) AS count FROM social_post_concept WHERE status='eligible' AND timeliness='official_change'`;
      const held=slots.filter(row=>row.status==='held').map(row=>`${row.slot_number}. ${row.topic} (source ${row.verification_state||'missing'}; generation failed: ${row.generation_error||'replacement unavailable'})`);
      const topicLines=slots.map(row=>`${row.slot_number}. ${row.publish_time} — ${row.topic} [${row.status==='held'?'source verified, generation failed':row.status}; evidence ${row.verification_state||'missing'}]`);
      const approvalLines=approvals.map(row=>`${row.status}${row.scheduled_at?` at ${new Date(String(row.scheduled_at)).toISOString()}`:''} — ${row.topic}`);
      const sent=await notifyDiscord('system',`Finkavo daily content report — ${day}`,{plannedTopics:topicLines.join('\n')||'No plan found',newsCandidates:String(news.count),held:held.join('\n')||'None',approvalsAndSchedule:approvalLines.join('\n')||'No drafts or approvals yet'});
      return send(res,200,{date:day,planned:slots.length,verified:slots.filter(row=>row.verification_state==='verified'&&new Date(String(row.expires_at))>new Date()).length,held:held.length,newsCandidates:Number(news.count),approvalStates:approvals.length,discordSent:sent,topics:topicLines});
    }

    if(req.method==="POST"&&url.pathname==="/v1/maintenance/weekly"){
      ReportSchema.parse(await readJson(req));const today=lisbonDate(new Date());const end=addLisbonDays(today,13);const plan=await loadAnnualPlan();
      let researched=0;for(let offset=0;offset<14;offset++){const day=addLisbonDays(today,offset);const headers={authorization:`Bearer ${apiToken}`,'content-type':'application/json'};const planned=await fetch(`http://127.0.0.1:${port}/v1/planning/daily`,{method:'POST',headers,body:JSON.stringify({date:day,capacity:5})});if(!planned.ok)continue;const evidenceRun=await fetch(`http://127.0.0.1:${port}/v1/evidence/research`,{method:'POST',headers,body:JSON.stringify({date:day})});if(evidenceRun.ok){const body=await evidenceRun.json() as {results?:unknown[]};researched+=body.results?.length||0;}}
      const upcoming=plan.rows.filter(row=>row.date>=today&&row.date<=end);const identities=new Set<string>();const duplicateIdentities:string[]=[];
      for(const row of upcoming){const key=[row.brief.subjectFamily,row.brief.userQuestion,row.audience,row.brief.contentIntent,row.brief.occurrenceKey||row.brief.campaignStage||''].join('|');if(identities.has(key))duplicateIdentities.push(key);identities.add(key);}
      const repaired=await sql`UPDATE social_editorial_plan_slot s SET status='evidence_ready',updated_at=now() WHERE s.publish_date BETWEEN ${today} AND ${end} AND s.status='held' AND EXISTS (SELECT 1 FROM social_topic_evidence_bundle b WHERE b.plan_slot_id=s.id AND b.verification_state='verified' AND b.expires_at>now()) RETURNING s.id`;
      const held=await sql`SELECT s.publish_date,s.slot_number,s.topic FROM social_editorial_plan_slot s WHERE s.publish_date BETWEEN ${today} AND ${end} AND s.plan_version=(SELECT max(current_slot.plan_version) FROM social_editorial_plan_slot current_slot WHERE current_slot.publish_date=s.publish_date) AND s.status='held' ORDER BY s.publish_date,s.slot_number`;
      const cards=await loadEvergreenReserve();const urls=[...new Set(cards.map(card=>card.sourcePolicy.canonicalUrl))];const evidence=await sql`SELECT canonical_url AS "canonicalUrl",max(verified_at) AS "verifiedAt" FROM social_reserve_evidence WHERE canonical_url IN ${sql(urls)} AND available=true GROUP BY canonical_url`;const reserveEligible=eligibleReserveCards(cards,evidence.map(row=>({canonicalUrl:String(row.canonicalUrl),verifiedAt:String(row.verifiedAt)})),[]).length;
      const details={window:`${today} to ${end}`,plannedBriefs:upcoming.length,evidenceChecks:researched,duplicateIdentities:duplicateIdentities.length,repairedEvidenceHolds:repaired.length,remainingHolds:held.length,reserveEligible};await notifyDiscord('system','Finkavo weekly content maintenance',details);
      return send(res,200,{...details,held});
    }

    if(req.method==="POST"&&url.pathname==="/v1/maintenance/monthly"){
      ReportSchema.parse(await readJson(req));const today=lisbonDate(new Date());const end=addLisbonDays(today,89);const plan=await loadAnnualPlan();const upcoming=plan.rows.filter(row=>row.date>=today&&row.date<=end);
      const [performance]=await sql`SELECT count(*) FILTER (WHERE status='published') AS published,count(*) FILTER (WHERE status IN ('blocked','failed','rejected')) AS unsuccessful,count(*) FILTER (WHERE status='approved') AS approved FROM social_post WHERE created_at>now()-INTERVAL '30 days'`;
      const [coverage]=await sql`SELECT count(*) AS active_slots,count(*) FILTER (WHERE s.status='held') AS held FROM social_editorial_plan_slot s WHERE s.publish_date BETWEEN ${today} AND ${end} AND s.plan_version=(SELECT max(current_slot.plan_version) FROM social_editorial_plan_slot current_slot WHERE current_slot.publish_date=s.publish_date)`;
      const details={window:`${today} to ${end}`,plannedBriefs:upcoming.length,activeSlots:Number(coverage.active_slots),held:Number(coverage.held),published30d:Number(performance.published),unsuccessful30d:Number(performance.unsuccessful),approved30d:Number(performance.approved)};await notifyDiscord('system','Finkavo monthly 90-day content review',details);return send(res,200,details);
    }

    if(req.method==="POST"&&url.pathname==="/v1/alerts/check"){
      ReportSchema.parse(await readJson(req));const now=new Date();const today=lisbonDate(now);const lisbonTime=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Lisbon',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(now);const alerts:string[]=[];
      const [renderer]=await sql`SELECT last_seen_at FROM social_renderer_heartbeat ORDER BY last_seen_at DESC LIMIT 1`;if(!renderer||now.getTime()-new Date(String(renderer.last_seen_at)).getTime()>5*60_000)alerts.push('Renderer heartbeat is stale');
      const [failed]=await sql`SELECT count(*) AS count FROM social_publish_job WHERE status='failed' AND updated_at>now()-INTERVAL '24 hours'`;if(Number(failed.count)>0)alerts.push(`${failed.count} publish schedule(s) failed in the last 24 hours`);
      const [renderFailed]=await sql`SELECT count(*) AS count FROM social_post WHERE planned_for=${today} AND status='failed'`;if(Number(renderFailed.count)>0)alerts.push(`${renderFailed.count} planned post(s) failed rendering`);
      const [stranded]=await sql`SELECT count(*) AS count FROM social_post p WHERE p.status='rendered' AND p.rendered_at<now()-INTERVAL '15 minutes' AND NOT EXISTS(SELECT 1 FROM social_publish_job j WHERE j.post_id=p.id AND j.revision_id=p.approved_revision_id)`;if(Number(stranded.count)>0)alerts.push(`${stranded.count} rendered post(s) are missing an internal publish job`);
      const [localOverdue]=await sql`SELECT count(*) AS count FROM social_publish_job WHERE status IN ('pending','retrying') AND scheduled_at<now()`;if(Number(localOverdue.count)>0)alerts.push(`${localOverdue.count} internal queued post(s) need rescheduling`);
      const blockedPublish=await sql`SELECT j.id,p.id AS post_id,p.topic,j.scheduled_at,j.error_code FROM social_publish_job j JOIN social_post p ON p.id=j.post_id WHERE j.status='blocked' AND j.updated_at<now()-INTERVAL '24 hours' ORDER BY j.scheduled_at LIMIT 10`;if(blockedPublish.length>0)alerts.push(`${blockedPublish.length} ambiguous Buffer result(s) have remained unresolved for more than 24 hours:\n${blockedPublish.map(row=>`${row.topic} — post ${row.post_id}, job ${row.id}, ${row.error_code||'unknown error'}`).join('\n')}`);
      const [bufferQueued]=await sql`SELECT count(*) AS count FROM social_publish_job WHERE status='scheduled' AND scheduled_at>now()`;if(Number(bufferQueued.count)>=bufferQueueSoftLimit)alerts.push(`Buffer handoff soft cap reached: ${bufferQueued.count}/${bufferQueueSoftLimit}`);
      const [overdue]=await sql`SELECT count(*) AS count FROM social_publish_job WHERE status='scheduled' AND scheduled_at<now()-INTERVAL '20 minutes'`;if(Number(overdue.count)>0)alerts.push(`${overdue.count} publication confirmation(s) are overdue`);
      if(lisbonTime>='09:00'){const [batch]=await sql`SELECT count(*) AS count FROM social_post WHERE planned_for=${today} AND status NOT IN ('blocked','failed','rejected')`;if(Number(batch.count)<5){const [recovery]=await sql`SELECT payload FROM social_event WHERE event_type='generation.day_recovery_completed' AND payload->>'day'=${today} ORDER BY created_at DESC LIMIT 1`;if(recovery?.payload?.budgetExhausted===true){const failures=await sql`SELECT s.topic,e.payload->>'error' AS error FROM social_editorial_plan_slot s LEFT JOIN LATERAL (SELECT payload FROM social_event WHERE event_type='generation.failed' AND payload->>'planSlotId'=s.id::STRING ORDER BY created_at DESC LIMIT 1) e ON true WHERE s.publish_date=${today} AND s.status='held' ORDER BY s.slot_number`;alerts.push(`Daily recovery budget exhausted: ${batch.count}/5 posts ready after ${recovery.payload.attemptsUsed}/${recovery.payload.attemptBudget} candidate attempts${failures.length?`\n${failures.map(row=>`${row.topic}: ${row.error||'no verified replacement available'}`).join('\n')}`:''}`);}}}
      const signature=hash({today,alerts});let sent=false;if(alerts.length){const [existing]=await sql`SELECT id FROM social_event WHERE event_type='operations.alert_sent' AND payload->>'signature'=${signature} LIMIT 1`;if(!existing){sent=await notifyDiscord('errors','Finkavo pipeline alert',{date:today,problems:alerts.join('\n')});await sql`INSERT INTO social_event(event_type,payload) VALUES('operations.alert_sent',${sql.json({signature,alerts})})`;}}
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
    console.error(JSON.stringify({ level: "error", message }));
    return send(res, clientError ? 400 : 500, { error: clientError ? message : "Internal server error" });
  }
});

const shutdown = async () => { server.close(); await sql.end({ timeout: 5 }); };
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
server.listen(port, "127.0.0.1", () => console.log(JSON.stringify({ service: "social-api", port })));
