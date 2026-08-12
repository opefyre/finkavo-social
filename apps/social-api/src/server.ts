import http from "node:http";
import { createHash, randomBytes } from "node:crypto";
import postgres from "postgres";
import { z } from "zod";
import { DraftSchema } from "./contracts.js";
import { generateDraft } from "./openai.js";
import { createBufferMediaUrl, createUploadUrl, verifyUploadedObject, type RenderFileInput } from "./storage.js";
import { BufferError, createScheduledPost, getPost as getBufferPost } from "./buffer.js";
import { notifyDiscord } from "./discord.js";
import { retryDecision } from "./retry-policy.js";
import { expandCalendar, loadEditorialCalendar, selectDailyMix } from "./planner.js";
import { validateSocialDraft } from "./draft-quality.js";
import { composeInstagramCaption } from "./caption.js";
import { loadAnnualPlan, rowsForDate } from "./annual-plan.js";

const databaseUrl = process.env.DATABASE_URL;
const apiToken = process.env.SOCIAL_API_TOKEN;
if (!databaseUrl || !apiToken) throw new Error("DATABASE_URL and SOCIAL_API_TOKEN are required");
const sql = postgres(databaseUrl, { max: 5, idle_timeout: 20, connect_timeout: 15 });
const port = Number(process.env.SOCIAL_API_PORT || 4320);
const reviewBaseUrl = process.env.REVIEW_BASE_URL;
const reviewPathPrefix = (process.env.REVIEW_PATH_PREFIX || "").replace(/\/$/, "");

const hash = (value: unknown) => createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex");
const fit = (value: unknown, max: number) => {
  const text = String(value || "").trim();
  if (text.length > max) throw new Error(`Approved render text exceeds its ${max}-character contract`);
  return text;
};
const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
const appearsPortuguese = (draft: z.infer<typeof DraftSchema>) => {
  const text = [draft.topic, draft.hook, draft.caption, draft.callToAction, ...draft.slides.flatMap((slide) => [slide.eyebrow, slide.title, slide.body, slide.altText])].join(" ").toLocaleLowerCase("pt");
  const markers = text.match(/\b(?:para|com|uma|não|dos|das|que|até|rendimento|contribuição|declaração|trimestre|mensal|passo|prazo|pagamento|isenção|ajuste)\b/gu)?.length ?? 0;
  return markers >= 5;
};
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

const send = (res: http.ServerResponse, status: number, body: unknown) => {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(body));
};

const sendHtml = (res: http.ServerResponse, status: number, body: string) => {
  res.writeHead(status, {
    "content-type": "text/html; charset=utf-8", "cache-control": "no-store",
    "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    "x-content-type-options": "nosniff", "referrer-policy": "no-referrer",
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
  const sourceItems = sources.map((source) => `<li><a href="${escapeHtml(source.url)}" rel="noreferrer">${escapeHtml(source.title)}</a> — ${escapeHtml(source.publisher)}</li>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Review · ${escapeHtml(post.topic)}</title><style>
  :root{font-family:Inter,ui-sans-serif,system-ui;color:#143735;background:#f6f2ea}body{margin:0}.wrap{max-width:1080px;margin:auto;padding:32px 20px 64px}header{display:flex;justify-content:space-between;gap:20px;align-items:start}.pill{background:#f0aa70;padding:6px 10px;border-radius:99px;font-weight:700;text-transform:uppercase;font-size:12px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin:24px 0}article,.panel{background:white;border:1px solid #d7ddd8;border-radius:14px;padding:20px;box-shadow:0 5px 18px #1437350d}article small,.meta{color:#5c706c;font-size:13px}h1{font-size:clamp(30px,5vw,52px);margin:.35em 0}h3{font-size:22px}.caption{white-space:pre-wrap;line-height:1.6}a{color:#175e58}form{display:flex;gap:12px;align-items:end;flex-wrap:wrap;margin-top:20px}label{display:grid;gap:6px;flex:1;min-width:240px}textarea{min-height:70px;padding:10px;border:1px solid #aebbb7;border-radius:8px}button{border:0;border-radius:9px;padding:12px 20px;font-weight:800;cursor:pointer}.approve{background:#175e58;color:white}.reject{background:#9d3535;color:white}.warning{border-left:5px solid #f0aa70}.identity{font-size:13px;color:#5c706c}</style></head><body><main class="wrap"><header><div><span class="pill">${escapeHtml(post.risk_level)} risk · ${escapeHtml(post.category)}</span><h1>${escapeHtml(post.topic)}</h1><p>${escapeHtml(revision.hook)}</p></div><p class="identity">Reviewer: ${escapeHtml(reviewer)}</p></header><section class="panel warning"><strong>Approval is revision-bound.</strong> Any change to copy, slides, or evidence invalidates this decision.</section><section class="grid">${slideCards}</section><section class="panel"><h2>Final Instagram caption</h2><p class="caption">${escapeHtml(finalCaption)}</p><h2>Sources</h2><ul>${sourceItems}</ul><p class="meta">Evidence hash: ${escapeHtml(String(revision.evidence_hash).slice(0, 16))}…</p><form method="post" action="${escapeHtml(reviewPathPrefix)}/review/${escapeHtml(token)}/decision"><label>Optional review comment<textarea name="comment" maxlength="500"></textarea></label><button class="approve" name="decision" value="approved">Approve exact revision</button><button class="reject" name="decision" value="rejected">Reject</button></form></section></main></body></html>`;
}

const GenerateSchema = z.object({ conceptId: z.string().uuid() });
const PlanningSchema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), capacity: z.number().int().min(1).max(5).default(2) });
const ResearchSchema = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() });
const ReviewRequestSchema = z.object({ expiresInMinutes: z.number().int().min(5).max(1440).default(60) });
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
  const intent = String(post.post_intent || "evergreen_explainer");
  const visualStyle = intent === "deadline_reminder" || intent === "occasion"
    ? "peach_deadline"
    : intent === "regulatory_change" || intent === "timely_news"
      ? "ink_alert"
      : intent === "checklist" || intent === "common_mistake"
        ? "mint_checklist"
        : intent === "evergreen_explainer"
          ? "cream_guide"
          : "petrol_editorial";
  return { schemaVersion: 1, postId: String(post.id), revisionId: String(revision.id), locale: "en", templateVersion: "finkavo-v3", visualStyle, slides };
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (req.method === "GET" && url.pathname === "/healthz") {
      await sql`SELECT 1`;
      return send(res, 200, { ok: true, service: "social-api" });
    }

    const reviewMatch = url.pathname.match(/^\/review\/([A-Za-z0-9_-]{32,})$/);
    if (req.method === "GET" && reviewMatch) {
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
      const reviewer = String(req.headers["tailscale-user-login"] || "Identity available through Tailscale Serve only");
      return sendHtml(res, 200, reviewPage(row as Record<string, unknown>, {
        hook: row.revision_hook, caption: row.revision_caption, call_to_action: row.revision_cta,
        hashtags: row.revision_hashtags, slides: row.revision_slides,
        alt_texts: row.alt_texts, source_bundle: row.source_bundle, evidence_hash: row.evidence_hash,
      }, reviewMatch[1], reviewer));
    }

    const decisionMatch = url.pathname.match(/^\/review\/([A-Za-z0-9_-]{32,})\/decision$/);
    if (req.method === "POST" && decisionMatch) {
      const reviewer = req.headers["tailscale-user-login"];
      if (!reviewer) return sendHtml(res, 403, "<h1>Approval requires an authenticated Tailscale Serve identity</h1>");
      const form = await readForm(req);
      const decision = z.enum(["approved", "rejected"]).parse(form.get("decision"));
      const comment = z.string().max(500).parse(form.get("comment") || "");
      const tokenHash = hash(decisionMatch[1]);
      const result = await sql.begin(async (tx) => {
        const [token] = await tx`
          SELECT * FROM social_review_token
          WHERE token_hash = ${tokenHash} AND used_at IS NULL AND expires_at > now()
          FOR UPDATE
        `;
        if (!token) return null;
        const [post] = await tx`SELECT current_revision_id FROM social_post WHERE id = ${token.post_id} FOR UPDATE`;
        const [revision] = await tx`SELECT evidence_hash FROM social_post_revision WHERE id = ${token.revision_id}`;
        if (!post || !revision || post.current_revision_id !== token.revision_id || revision.evidence_hash !== token.evidence_hash) return "changed";
        await tx`UPDATE social_review_token SET used_at = now() WHERE id = ${token.id}`;
        await tx`INSERT INTO social_approval (post_id, revision_id, evidence_hash, decision, reviewer, comment) VALUES (${token.post_id}, ${token.revision_id}, ${token.evidence_hash}, ${decision}, ${String(reviewer)}, ${comment || null})`;
        if (decision === "approved") await tx`UPDATE social_post SET status = 'approved', approved_revision_id = ${token.revision_id}, approved_at = now(), approved_by = ${String(reviewer)}, updated_at = now() WHERE id = ${token.post_id}`;
        else await tx`UPDATE social_post SET status = 'rejected', approved_revision_id = NULL, approved_at = NULL, approved_by = NULL, updated_at = now() WHERE id = ${token.post_id}`;
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
      const planned = [];
      for (const item of selected) {
        const [slot] = await sql`
          INSERT INTO social_editorial_plan_slot (plan_version,publish_date,publish_time,slot_number,pillar,angle,topic,audience,risk_level,timing_class,reserve_kind,search_terms,required_authority,occurrence_number)
          VALUES (${plan.version},${item.date},${item.time},${item.slot},${item.pillar},${item.angle},${item.title},${item.audience},${item.risk},${item.timing},${item.reserve},${sql.json(item.evidenceTerms.split("|").map(v=>v.trim()).filter(Boolean))},${item.authority},${item.occurrence})
          ON CONFLICT (plan_version,publish_date,slot_number) DO UPDATE SET topic=excluded.topic,audience=excluded.audience,risk_level=excluded.risk_level,timing_class=excluded.timing_class,search_terms=excluded.search_terms,required_authority=excluded.required_authority,updated_at=now()
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
      const slots = await sql`SELECT * FROM social_editorial_plan_slot WHERE publish_date=${planningDate} AND status IN ('planned','researching','evidence_ready','held') ORDER BY slot_number`;
      const results=[];
      for (const slot of slots) {
        const terms = (slot.search_terms as string[]).map(v=>v.trim()).filter(v=>v.length >= 3);
        const pattern = terms.map(v=>v.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|");
        const candidates = pattern ? await sql`
          SELECT d.id,d.title,d.source_url,d.source_authority,d.source_tier,d.original_lang,d.content_hash,d.fetched_at,d.last_verified_at,
                 array_agg(c.text ORDER BY c.chunk_index) FILTER (WHERE c.chunk_index < 8) AS excerpts
          FROM document d JOIN chunk c ON c.document_id=d.id AND c.vault_doc_id IS NULL
          WHERE d.verified_still_available=true AND d.freshness_confidence='fresh' AND d.source_tier IN ('official','professional','editorial')
            AND (d.title ~* ${pattern} OR c.text ~* ${pattern})
          GROUP BY d.id
          ORDER BY CASE d.source_tier WHEN 'official' THEN 0 WHEN 'professional' THEN 1 ELSE 2 END, COALESCE(d.last_verified_at,d.fetched_at) DESC
          LIMIT 40
        ` : [];
        const normalizedTerms=terms.map(v=>v.toLocaleLowerCase("pt"));
        const scored: any[]=(candidates as any[]).map(source=>{const title=String(source.title).toLocaleLowerCase("pt");const body=(source.excerpts as string[]).join(" ").toLocaleLowerCase("pt");const matched=normalizedTerms.filter(term=>title.includes(term)||body.includes(term));const score=matched.reduce((sum,term)=>sum+(title.includes(term)?6:2),0);return {...source,relevance_score:score,matched_terms:matched};}).filter(source=>source.relevance_score>=2).sort((a,b)=>b.relevance_score-a.relevance_score||String(b.last_verified_at||b.fetched_at).localeCompare(String(a.last_verified_at||a.fetched_at)));
        const sources: any[] = []; const seenAuthorities=new Set<string>();
        for(const source of scored){const authority=String(source.source_authority||new URL(String(source.source_url)).hostname);if(seenAuthorities.has(authority)&&sources.length>=2)continue;sources.push(source);seenAuthorities.add(authority);if(sources.length>=4)break;}
        const needsOfficial = slot.risk_level === 'high' || slot.timing_class !== 'evergreen';
        const valid = sources.length >= 2 && sources[0].relevance_score>=4 && (!needsOfficial || sources.some(s=>s.source_tier==='official'));
        if (!valid) { await sql`UPDATE social_editorial_plan_slot SET status='held',updated_at=now() WHERE id=${slot.id}`; results.push({slotId:slot.id,topic:slot.topic,state:'held',sources:sources.length}); continue; }
        const normalized=sources.map(s=>({documentId:s.id,url:s.source_url,title:s.title,publisher:s.source_authority,tier:s.source_tier,locale:s.original_lang,retrievedAt:s.last_verified_at||s.fetched_at,contentHash:s.content_hash,relevanceScore:s.relevance_score,matchedTerms:s.matched_terms,excerpts:(s.excerpts as string[]).slice(0,6)}));
        const bundleHash=hash(normalized); const freshnessDays=slot.risk_level==='high'?7:slot.risk_level==='medium'?30:90;
        const [bundle]=await sql`INSERT INTO social_topic_evidence_bundle (plan_slot_id,bundle_hash,sources,verification_state,verified_at,expires_at) VALUES (${slot.id},${bundleHash},${sql.json(normalized)},'verified',now(),now()+(${freshnessDays}::STRING||' days')::INTERVAL) ON CONFLICT (plan_slot_id,bundle_hash) DO UPDATE SET verification_state='verified',verified_at=now(),expires_at=excluded.expires_at RETURNING *`;
        const primary=normalized.find(s=>s.tier==='official')||normalized[0]; const fingerprint=`plan:${slot.plan_version}:${planningDate}:${slot.slot_number}`;
        const [concept]=await sql`INSERT INTO social_post_concept (document_id,topic,category,risk_level,priority,timeliness,fingerprint,status,planned_for,reason,repeat_allowed,score,plan_slot_id,evidence_bundle_id) VALUES (${primary.documentId},${slot.topic},${slot.pillar},${slot.risk_level},${100-Number(slot.slot_number)},${slot.timing_class},${fingerprint},'planned',${planningDate},${`Predetermined annual-plan topic for ${slot.audience}`},true,${100-Number(slot.slot_number)},${slot.id},${bundle.id}) ON CONFLICT (fingerprint) DO UPDATE SET document_id=excluded.document_id,evidence_bundle_id=excluded.evidence_bundle_id,status=CASE WHEN social_post_concept.status='used' THEN 'used' ELSE 'planned' END,updated_at=now() RETURNING *`;
        await sql`UPDATE social_editorial_plan_slot SET status='evidence_ready',updated_at=now() WHERE id=${slot.id}`;
        results.push({slotId:slot.id,conceptId:concept.id,topic:slot.topic,state:'verified',sources:normalized.map(source=>({title:source.title,url:source.url,tier:source.tier,relevanceScore:source.relevanceScore,matchedTerms:source.matchedTerms})),bundleHash});
      }
      return send(res,200,{date:planningDate,results});
    }

    if (req.method === "GET" && url.pathname === "/v1/planning/queue") {
      const rows = await sql`SELECT c.* FROM social_post_concept c JOIN social_topic_evidence_bundle b ON b.id=c.evidence_bundle_id AND b.verification_state='verified' AND b.expires_at>now() WHERE c.status='planned' AND c.planned_for<=current_date+7 ORDER BY c.planned_for,c.score DESC LIMIT 25`;
      return send(res, 200, { concepts: rows });
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
      const officialDomains = ["aima.gov.pt", "diariodarepublica.pt", "dre.pt", "gov.pt", "portaldasfinancas.gov.pt", "seg-social.pt", "irn.justica.gov.pt", "bportugal.pt", "sns24.gov.pt", "ine.pt"];
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
      const [selectedConcept] = await sql`SELECT c.*,b.sources,b.bundle_hash,b.expires_at FROM social_post_concept c JOIN social_topic_evidence_bundle b ON b.id=c.evidence_bundle_id WHERE c.id=${generationInput.conceptId} AND c.status='planned' AND b.verification_state='verified' AND b.expires_at>now()`;
      if (!selectedConcept) return send(res,409,{error:"Concept lacks a current verified multi-source evidence bundle"});
      const evidenceSources=selectedConcept.sources as Array<Record<string,unknown>>; const source=evidenceSources[0]; const documentId=String(source.documentId);
      let checked: z.infer<typeof DraftSchema> | null = null;
      let model = "";
      let lastGenerationError = "";
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const generated = await generateDraft({
            title: String(selectedConcept.topic), sourceUrl: String(source.url),
            authority: source.publisher ? String(source.publisher) : null,
            fetchedAt: String(source.retrievedAt), excerpts: evidenceSources.flatMap(s=>s.excerpts as string[]),
            sources: evidenceSources.map(s=>({title:String(s.title),sourceUrl:String(s.url),authority:s.publisher?String(s.publisher):null,fetchedAt:String(s.retrievedAt),excerpts:s.excerpts as string[]})),
            ...(lastGenerationError ? { repairFeedback: lastGenerationError } : {}),
            ...(selectedConcept ? { editorialContext: { topic: String(selectedConcept.topic), reason: selectedConcept.reason ? String(selectedConcept.reason) : null, campaignStage: selectedConcept.campaign_stage ? String(selectedConcept.campaign_stage) : null, plannedFor: selectedConcept.planned_for ? String(selectedConcept.planned_for) : null, expiresAt: selectedConcept.expires_at ? String(selectedConcept.expires_at) : null } } : {}),
          });
          const candidate = DraftSchema.parse(generated.draft);
          if (!candidate.topic.toLocaleLowerCase("en").includes(String(selectedConcept.topic).split(":")[0].toLocaleLowerCase("en").slice(0, 24))) throw new Error("Draft drifted away from the predetermined editorial topic");
          validateSocialDraft(candidate);
          if (appearsPortuguese(candidate)) throw new Error("User-facing draft copy must be English; evidence quotes may remain Portuguese");
          const corpusText = evidenceSources.flatMap(s=>s.excerpts as string[]).join("\n").replace(/\s+/g, " ");
          const unsupported = candidate.claims.find((claim) => !corpusText.includes(claim.evidenceQuote.replace(/\s+/g, " ")));
          if (unsupported) throw new Error("A claim evidence quote was not found verbatim in the supplied corpus excerpts");
          if (candidate.riskLevel === "high" && !evidenceSources.some(s=>s.tier === "official")) throw new Error("High-risk content requires an official primary source");
          checked = candidate;
          model = generated.model;
          break;
        } catch (error) {
          lastGenerationError = error instanceof Error ? error.message : "Generation validation failed";
        }
      }
      if (!checked) {
        await sql`INSERT INTO social_event (event_type, payload) VALUES ('generation.failed', ${sql.json({ documentId, error: lastGenerationError })})`;
        return send(res, 422, { error: "Structured generation failed after the initial attempt and two targeted repairs", detail: lastGenerationError });
      }
      const sourceBundle = evidenceSources.map(s=>({documentId:String(s.documentId),url:String(s.url),title:String(s.title),publisher:s.publisher?String(s.publisher):null,locale:String(s.locale),retrievedAt:String(s.retrievedAt),contentHash:String(s.contentHash),tier:String(s.tier)}));
      const evidenceHash = hash({ sourceBundle, claims: checked.claims });
      const contentHash = hash({ hook: checked.hook, caption: checked.caption, callToAction: checked.callToAction, hashtags: checked.hashtags, searchKeywords: checked.searchKeywords, postIntent: checked.postIntent, slides: checked.slides });
      const inserted = await sql.begin(async (tx) => {
        const [post] = await tx`
          INSERT INTO social_post (topic, source_document_id, source_url, source_title, source_authority, source_fetched_at,
            hook, caption, call_to_action, hashtags, slides, model, category, risk_level, post_intent, search_keywords)
          VALUES (${checked.topic}, ${documentId}, ${String(source.url)}, ${String(source.title)},
            ${source.publisher ? String(source.publisher) : null}, ${String(source.retrievedAt)},
            ${checked.hook}, ${checked.caption}, ${checked.callToAction}, ${tx.json(checked.hashtags)}, ${tx.json(checked.slides)}, ${model}, ${checked.category}, ${checked.riskLevel}, ${checked.postIntent}, ${tx.json(checked.searchKeywords)})
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

    if (req.method === "GET" && url.pathname === "/v1/posts") {
      const status = url.searchParams.get("status");
      const rows = status
        ? await sql`SELECT * FROM social_post WHERE status = ${status} ORDER BY created_at DESC LIMIT 50`
        : await sql`SELECT * FROM social_post ORDER BY created_at DESC LIMIT 50`;
      return send(res, 200, { posts: rows });
    }

    const reviewRequest = url.pathname.match(/^\/v1\/posts\/([0-9a-f-]+)\/request-review$/i);
    if (req.method === "POST" && reviewRequest) {
      const { expiresInMinutes } = ReviewRequestSchema.parse(await readJson(req));
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
        return [token];
      });
      if (!created) return send(res, 409, { error: "Only a current draft revision can be sent for review" });
      const base = reviewBaseUrl || `${url.protocol}//${url.host}`;
      const reviewUrl = `${base.replace(/\/$/, "")}/review/${rawToken}`;
      await notifyDiscord("approval", "Instagram carousel ready for review", { post: reviewRequest[1], expiresAt: created.expires_at }, reviewUrl);
      return send(res, 201, { reviewUrl, expiresAt: created.expires_at });
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
        const [created] = await tx`INSERT INTO social_publish_job (post_id, revision_id, render_job_id, idempotency_key, scheduled_at) VALUES (${post.id}, ${post.revision_id}, ${post.render_job_id}, ${idempotencyKey}, ${scheduledAt}) RETURNING *`;
        await tx`UPDATE social_post SET scheduled_at = ${scheduledAt}, updated_at = now() WHERE id = ${post.id}`;
        await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${post.id}, 'publish.queued', ${tx.json({ jobId: created.id, scheduledAt })})`;
        return created;
      });
      return job ? send(res, 201, { job }) : send(res, 409, { error: "Only an approved, completed render of the current revision can be scheduled" });
    }

    if (req.method === "POST" && url.pathname === "/v1/publish-jobs/process") {
      const workerId = z.string().min(3).max(120).parse(req.headers["x-publisher-id"] || "n8n-publisher");
      const job: any = await sql.begin(async (tx) => {
        await tx`UPDATE social_publish_job SET status = 'retrying', lease_owner = NULL, lease_expires_at = NULL, available_at = now(), updated_at = now() WHERE status = 'processing' AND lease_expires_at < now()`;
        const [candidate] = await tx`SELECT * FROM social_publish_job WHERE status IN ('pending','retrying') AND available_at <= now() ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED`;
        if (!candidate) return null;
        const attempt = Number(candidate.attempt_count) + 1;
        const [claimed] = await tx`UPDATE social_publish_job SET status = 'processing', attempt_count = ${attempt}, lease_owner = ${workerId}, lease_expires_at = now() + INTERVAL '5 minutes', updated_at = now() WHERE id = ${candidate.id} RETURNING *`;
        const [post] = await tx`SELECT hook, caption, call_to_action, hashtags, render_files FROM social_post WHERE id = ${candidate.post_id}`;
        const requestFingerprint = hash({ postId: candidate.post_id, revisionId: candidate.revision_id, scheduledAt: candidate.scheduled_at, files: post.render_files });
        await tx`INSERT INTO social_publish_attempt (job_id, attempt_number, request_fingerprint) VALUES (${candidate.id}, ${attempt}, ${requestFingerprint})`;
        return { ...claimed, post };
      });
      if (!job) return send(res, 200, { job: null });
      try {
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
        const failure = error instanceof BufferError ? error : new BufferError(error instanceof Error ? error.message : "Publish failure", "PUBLISH_FAILED", false, true);
        const { retry, blocked, delayMinutes } = retryDecision(Number(job.attempt_count), failure.retryable, failure.ambiguous);
        const [failed] = await sql.begin(async (tx) => {
          const [updated] = retry
            ? await tx`UPDATE social_publish_job SET status = 'retrying', available_at = now() + (${delayMinutes!}::STRING || ' minutes')::INTERVAL, lease_owner = NULL, lease_expires_at = NULL, error_code = ${failure.code}, error_message = ${failure.message}, updated_at = now() WHERE id = ${job.id} RETURNING *`
            : await tx`UPDATE social_publish_job SET status = ${blocked ? "blocked" : "failed"}, lease_owner = NULL, lease_expires_at = NULL, error_code = ${failure.code}, error_message = ${failure.message}, updated_at = now() WHERE id = ${job.id} RETURNING *`;
          await tx`UPDATE social_publish_attempt SET finished_at = now(), outcome = ${retry ? "retrying" : blocked ? "blocked" : "failed"}, error_code = ${failure.code}, error_message = ${failure.message} WHERE job_id = ${job.id} AND attempt_number = ${job.attempt_count}`;
          await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${job.post_id}, ${retry ? "publish.retrying" : blocked ? "publish.blocked" : "publish.failed"}, ${tx.json({ jobId: job.id, attempt: job.attempt_count, code: failure.code, delayMinutes: retry ? delayMinutes : null })})`;
          return [updated];
        });
        if (!retry) await notifyDiscord("errors", blocked ? "Publish result needs reconciliation" : "Publish failed", { post: job.post_id, code: failure.code, attempt: job.attempt_count });
        return send(res, retry ? 202 : 422, { job: failed, error: failure.message });
      }
    }

    if (req.method === "POST" && url.pathname === "/v1/publish-jobs/monitor") {
      const jobs = await sql`SELECT * FROM social_publish_job WHERE status = 'scheduled' ORDER BY scheduled_at LIMIT 20`;
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
            await sql`UPDATE social_publish_job SET status = 'failed', provider_status = 'error', error_code = 'BUFFER_POST_ERROR', error_message = 'Buffer reported post error', updated_at = now() WHERE id = ${job.id}`;
            await notifyDiscord("errors", "Buffer reported publish failure", { post: job.post_id, bufferPost: job.provider_post_id });
          } else await sql`UPDATE social_publish_job SET provider_status = ${providerPost.status}, updated_at = now() WHERE id = ${job.id}`;
          results.push({ id: String(job.id), status: providerPost.status });
        } catch (error) {
          results.push({ id: String(job.id), status: `monitor_error:${error instanceof Error ? error.message : "unknown"}` });
        }
      }
      return send(res, 200, { results });
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
      return send(res, 200, { counts, planning, upcomingDeadlines, renderer, oldestQueuedRender: oldest?.oldest_job || null, healthy: renderer ? Date.now() - new Date(renderer.last_seen_at as string).getTime() < 5 * 60_000 : false });
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
