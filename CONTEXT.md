# Finkavo Social Content Workflow — Context and Architecture

**Status:** implemented local MVP; publishing remains intentionally disabled until Discord webhooks are configured and a live Buffer scheduling test is explicitly approved
**Last reviewed:** 2026-08-12
**Scope:** Instagram educational carousel workflow for Finkavo. This document defines the system; it does not contain credentials or production configuration.

## 1. Outcome

Build a recoverable, source-backed workflow that turns Finkavo corpus material and fresh official notices into English, deterministic Instagram carousels. n8n coordinates the work, but it does not own state. Finkavo's existing database and corpus remain the source of truth, the spare MacBook hosts n8n and renders, R2 stores generated media, Buffer schedules and publishes, and Discord reports or requests approval.

The first release should optimize for correctness and learning, not volume:

- Start with **1–2 posts per day**, not five.
- Require human approval for every post during the MVP.
- Publish in English for the initial product while retaining source-language evidence from Portuguese official sources.
- Use official sources for factual verification; news is a discovery signal, not proof.
- Never let a publishing retry regenerate approved copy or images.

## 2. Review of the proposed architecture

### What is sound

- Separating ingestion, verification, planning, generation, rendering, approval, scheduling, and monitoring is correct.
- Structured AI output with schema validation is safer than asking AI to create images or free-form layouts.
- Deterministic HTML/CSS templates keep brand output consistent.
- R2 is a suitable origin for media that Buffer fetches by URL.
- Explicit state, idempotency, retry limits, an event history, and Discord alerts make failures recoverable.
- Separate n8n workflows are easier to operate than one large graph.

### What needs correction

1. **D1 would create a second source of truth.** Finkavo already uses CockroachDB Serverless, Drizzle, and a database-backed durable job system. A separate D1 content database would duplicate infrastructure, migrations, operational tooling, and source records. This workflow should use the existing CockroachDB cluster with its own `social_*` tables and service role. If isolation is required later, use a separate Cockroach database/schema before adopting another database engine.

2. **The corpus should not be re-ingested into a parallel store.** Finkavo already has a large PT/EN corpus, source registry, authority metadata, and freshness work. The social workflow should consume canonical corpus IDs and source versions through a narrow internal API. It may ingest social-specific news/RSS discovery records, but verified official material should be promoted into the canonical corpus pipeline rather than copied indefinitely.

3. **n8n should not have unrestricted database access.** Give n8n a small authenticated Finkavo social API with task-specific endpoints. This centralizes validation, transactions, authorization, and idempotency. It also prevents workflow nodes from embedding schema knowledge and raw SQL.

4. **A public render endpoint on a spare Mac is fragile and unnecessarily exposed.** The MacBook may sleep, change networks, or be offline. Run a renderer agent that polls/claims queued render jobs, downloads the immutable render manifest, uploads results with short-lived presigned R2 URLs, and acknowledges completion. No inbound port is required.

5. **One `posts.status` value is not enough.** Editorial, verification, render, approval, scheduling, and publishing can progress or fail independently. Keep a small lifecycle on `social_posts`, but record render and publish execution in separate job tables. Otherwise a retry can overwrite the state needed to diagnose an earlier stage.

6. **Verification needs evidence snapshots, not only URLs and confidence scores.** Web pages change. Store source ID, canonical URL, title, publisher, locale, retrieved time, content hash/version, supporting excerpt or corpus span IDs, and the reviewer/verification method. A model-generated confidence number is not evidence.

7. **“AI compares news to an official page” is not sufficient for high-risk claims.** Tax, immigration, legal, deadline, fee, and eligibility claims need an official primary source and human approval. Unsupported claims go to `BLOCKED`, not into an automatic search loop that might manufacture certainty.

8. **Five posts every day is an unvalidated growth assumption.** It increases factual, review, and audience-fatigue risk. Begin at 1–2/day, measure saves, shares, reach, follows, and corrections, and change frequency from evidence. Keep five/day as a configurable ceiling, not the initial target.

9. **Language policy needed an explicit decision.** The social account is English-first, even when its official evidence is Portuguese. Generation must preserve the meaning of Portuguese primary sources and retain original-language supporting excerpts. Portuguese social editions are deferred and would require separate native review and approval.

10. **Buffer integration details must be explicit.** Buffer's current public API is GraphQL, media is supplied by URL rather than uploaded directly, and its asset input changed in May 2026. Instagram carousels are supported with up to ten images, but the MVP uses five. R2 URLs must stay valid until Buffer has fetched and published the post. The integration should be protected by a contract test, not assumed from an old REST example.

11. **Approval links need authentication and replay protection.** Do not expose a bare n8n webhook that approves by ID. Use a signed, single-use, expiring token, record the reviewer and timestamp, and reject approval if the content or source bundle changed after review.

12. **Retention, deletion, and secret handling are missing.** Store API keys only in the platform secret stores. Define lifecycle rules for render artifacts and source snapshots. Discord notifications must not contain secrets or unpublished sensitive material.

## 3. Architecture decision

```text
Finkavo corpus + official sources + RSS/news discovery
                         |
                         v
                 n8n orchestration
                         |
              authenticated Social API
                         |
          +--------------+---------------+
          |                              |
          v                              v
CockroachDB / Drizzle                Cloudflare R2
social state + evidence              assets + rendered PNGs
          |
          v
durable render job queue
          |
          v
MacBook renderer agent (outbound polling)
Node.js + TypeScript + Playwright + fixed templates
          |
          v
R2 -> Buffer GraphQL API -> Instagram
          |
          v
Discord approval and operational notifications
```

### Component responsibilities

| Component | Owns | Must not own |
|---|---|---|
| Finkavo corpus | Canonical sources, extracted material, authority and freshness metadata | Social schedule or publish attempts |
| n8n | Timers, branching, calling bounded APIs, operational coordination | Durable state, raw credentials in nodes, business rules duplicated in expressions |
| Social API | Validation, transactions, state transitions, idempotency, signed approval actions | Rendering or social publishing UI |
| CockroachDB | Editorial state, evidence links, schedules, jobs, attempts, append-only events | Image binaries |
| Mac renderer | Deterministic PNG production from a versioned manifest | Copywriting, verification, approval, scheduling |
| R2 | Versioned render inputs/outputs and fixed assets | Workflow state |
| Buffer | Scheduled delivery to Instagram | Canonical post state or evidence |
| Discord | Human notifications and approval entry points | Authoritative approval or publish state |

## 4. Data model

Use UUIDv7/ULID identifiers, UTC timestamps in storage, and `Europe/Lisbon` only when calculating/displaying the editorial schedule. All mutating operations accept an `idempotency_key`.

### Core tables

- `social_discoveries` — social-specific RSS/news notices awaiting triage; references a canonical source when promoted.
- `social_post_concepts` — topic, category, risk, priority, timeliness, language, and dedup fingerprint.
- `social_posts` — one publishable locale edition: caption, template version, lifecycle, schedule, and current approved revision.
- `social_post_revisions` — immutable structured copy/manifests produced for a post.
- `social_slides` — ordered, schema-validated slide data belonging to a revision.
- `social_claims` — atomic factual claims, risk type, review state, and exact wording used.
- `social_claim_evidence` — claim-to-corpus/source-version links with supporting span IDs and retrieval metadata.
- `social_approvals` — immutable approve/reject decisions tied to an exact revision and evidence-bundle hash.
- `social_render_jobs` / `social_render_attempts` — queued render work, leases, retries, checksums, and errors.
- `social_publish_jobs` / `social_publish_attempts` — Buffer requests, retries, provider IDs, and errors.
- `social_events` — append-only audit/operational event stream.
- `social_metrics_daily` — optional later phase for per-post outcome snapshots.

Canonical corpus tables remain outside this module and are referenced by stable IDs. Avoid copying full corpus bodies into social tables.

### Post lifecycle

```text
DRAFT -> RESEARCHING -> READY_FOR_REVIEW -> APPROVED
      -> RENDER_QUEUED -> RENDERED -> SCHEDULED -> PUBLISHED

From review:  -> REJECTED or BLOCKED
From a stage: -> FAILED (after that stage's retry policy is exhausted)
```

`RETRYING` is a job-attempt condition, not a durable editorial lifecycle. A scheduled or approved post does not return to generation because rendering or publishing failed.

### Invariants

- Only an exact approved revision can be rendered or scheduled.
- Editing copy, slides, sources, or schedule after approval invalidates the approval.
- Every factual claim in a medium/high-risk post has at least one current official source.
- Every R2 output records SHA-256, byte size, dimensions, MIME type, template version, and render-manifest hash.
- Only one active publish job exists per post and provider.
- Provider calls use deterministic idempotency keys where supported; locally, duplicate requests return the existing job.
- Events are append-only and contain correlation IDs across n8n, API, renderer, and Buffer.

## 5. Workflow design

### WF-01 — Discovery ingestion (every 2 hours)

1. Fetch configured RSS/news/official discovery feeds using conditional requests (`ETag`/`Last-Modified`).
2. Normalize canonical URL, publisher, publication time, locale, title, and content fingerprint.
3. Deduplicate by canonical URL plus content hash; fuzzy similarity is a secondary check, never the only key.
4. Classify category, locality, likely risk, importance, and expiry/deadline signals.
5. Save new discovery records and emit an event.
6. Route likely official-source additions to the existing corpus ingestion/freshness path.

News remains `DISCOVERY_ONLY` until its claims are supported by official evidence.

### WF-02 — Claim extraction and verification

1. Extract atomic claims from an eligible corpus item or discovery.
2. Retrieve official evidence from the canonical corpus first; use bounded official-domain search only for gaps.
3. Save claim-to-source-version relationships and supporting spans.
4. Run deterministic checks for dates, monetary amounts, entity names, locale, and contradictory values.
5. Mark each claim `SUPPORTED`, `CONFLICTED`, `STALE`, or `UNSUPPORTED`.
6. Hold the concept if any required claim is not supported.
7. Require human review for tax, legal, immigration, fees, deadlines, and eligibility.

### WF-03 — Daily planning (once daily)

Inputs:

- unused evergreen corpus topics;
- newly verified and time-sensitive official changes;
- upcoming deadlines;
- recent posting history and topic fingerprints;
- configured editorial capacity and locale strategy.

Initial rules:

- Select 1–2 concepts/day; configurable maximum 5.
- Do not repeat the same normalized topic within 14 days unless an official change makes repetition necessary.
- At least one evergreen concept on any two-post day.
- No more than one high-risk/time-sensitive concept per day during MVP.
- Avoid consecutive posts from the same category.
- Reserve review capacity; do not plan more posts than a human can approve.
- Treat the proposed posting times as experiments, not fixed truth; default scheduling is stored in Lisbon time and converted to UTC.

### WF-04 — Structured copy generation

AI receives only the approved concept, locale, evidence bundle, voice rules, and versioned JSON schema. It returns structured JSON containing:

- locale and template ID;
- 3–7 slides for MVP (five is the default, ten is the provider ceiling);
- caption, CTA, optional hashtags, alt text per slide;
- claim IDs used by each slide/caption fragment;
- source list suitable for the caption or final slide.

Validate with shared Zod/JSON Schema. Enforce hard limits for title/body/item lengths at generation time so the renderer never shrinks text unpredictably. On validation failure, allow at most two repair attempts, then mark the generation job failed and alert Discord.

Generation must not invent sources, add unsupplied facts, or distort Portuguese source meaning when producing English copy. A future Portuguese output would be a separately reviewed revision, not a string substitution.

### WF-05 — Approval

During MVP, all posts require approval. Discord receives a preview link, risk summary, schedule, and source list. The approval page displays the exact revision and evidence bundle.

- Approval action: signed, single-use token; short expiry; authenticated reviewer identity.
- Decision records: reviewer, time, revision ID, evidence hash, comment.
- Any content/evidence mutation invalidates approval.
- Rejection returns the post to an explicit revision path; it does not silently regenerate.

Later policy, after an error-free pilot:

- Low-risk evergreen: eligible for auto-approval.
- Medium-risk: sampled or manual approval.
- High-risk/current law, tax, immigration, fees, deadlines, eligibility: always manual approval.

### WF-06 — Rendering

After approval, the Social API creates an immutable render manifest in R2 and queues a render job. The Mac renderer:

1. Polls for work and claims a time-limited lease.
2. Downloads the manifest, assets, fonts, and named template version.
3. Renders at 1080 × 1350 using pinned Node, Chromium/Playwright, fonts, and dependencies.
4. Checks overflow, missing glyphs, image dimensions, safe zones, and slide count.
5. Uploads PNGs to a versioned private R2 prefix using short-lived presigned upload URLs.
6. Reports checksums and results; the API re-downloads each object to verify its SHA-256, byte size, MIME type, and PNG dimensions before marking the job complete transactionally.

Suggested object key:

```text
social/carousels/{yyyy}/{mm}/{dd}/{post_id}/{revision_id}/01.png
```

Do not overwrite rendered revisions. R2 lifecycle rules may delete rejected/unpublished artifacts after an agreed retention period; published artifacts should remain reproducible.

### WF-07 — Buffer scheduling

Preconditions:

- exact revision is approved;
- all images exist and passed render QA;
- caption and alt text pass validation;
- schedule is in the future;
- Buffer channel configuration is healthy.

Use Buffer's GraphQL API and its current `AssetInput` contract. Provide HTTPS media URLs that Buffer can fetch and keep them valid through publication plus a safety window. Store Buffer post/group ID, channel ID, requested schedule, provider status, and response correlation data. Never store the API key in the database or workflow export.

### WF-08 — Publish monitoring

Poll Buffer for scheduled/sent/failed state because post metrics are currently experimental and should not be a critical dependency. Reconcile local state with provider state and, when available, store the Instagram media ID/permalink.

Alert once on state transition, not on every poll:

- `PUBLISHED` -> `#ig-published`
- retry scheduled or dead-letter -> `#ig-errors`
- low inventory, renderer offline, stale sources, or daily summary -> `#ig-system`

### WF-09 — Health report

Daily report includes:

- planned / approved / rendered / scheduled / published counts;
- blocked concepts by reason;
- retries and dead-letter jobs;
- oldest queued job and renderer last heartbeat;
- upcoming high-risk deadlines;
- source freshness warnings;
- Buffer reconciliation mismatches.

## 6. Retry and recovery policy

Each external side effect is a durable job with a lease and an attempt ledger.

- Transient failure: retry after approximately 2, 10, and 30 minutes with jitter.
- Rate limit: honor provider retry metadata when present.
- Validation, unsupported claim, authentication, or permission failure: do not blindly retry; mark blocked/failed and alert.
- Exhausted retries: dead-letter the job and preserve all inputs and attempt errors.
- Stale running lease: a reaper returns the job to pending when safe.
- Renderer heartbeat: alert after a configurable offline threshold; queued work remains intact.

Retries resume the failed stage only. A Buffer outage cannot alter approved copy, and a renderer outage cannot cause new copy generation.

## 7. Deterministic design system

```text
renderer/
  assets/
    logo.svg
    backgrounds/
    icons/
  templates/
    cover/
    content/
    bullets/
    steps/
    summary/
  styles/
    tokens.css
    brand.css
  schemas/
  src/
```

AI may select approved slide types, icons, copy, highlights, and CTA variants. It may not change logo geometry, colors, fonts, spacing scale, frame, footer, safe zones, or aspect ratio.

Every template and asset bundle has a version. Templates must have fixtures for long English text, Portuguese names and accents in citations, currency, dates, empty optional fields, maximum list length, and source footers. Snapshot tests plus visual regression images run before a renderer release.

Accessibility requirements:

- sufficient color contrast;
- minimum type size and hard copy limits;
- no essential meaning conveyed by color alone;
- alt text generated and reviewed for every image;
- readable source attribution without presenting social content as professional tax/legal advice.

## 8. Security and operations

- n8n, renderer, and Buffer get separate least-privilege credentials.
- Use platform secret stores and rotation; never commit secrets or include them in Discord.
- Social API endpoints authenticate machine identities, validate schemas, rate limit, and log correlation IDs.
- Renderer claims use short leases; R2 upload/download URLs are scoped, short-lived, and object-specific.
- Approval tokens are signed, expiring, single-use, and revision-bound.
- Keep n8n workflow exports sanitized and version-controlled.
- Back up workflow definitions and include social tables in the existing backup/restore review.
- Extend Finkavo's data-flow/vendor register when this workflow ships.

## 9. MVP boundaries

Included:

- Existing Finkavo corpus plus a small official/RSS discovery list.
- English structured carousel copy from English and Portuguese evidence.
- Five deterministic slide templates.
- Manual approval for all posts.
- Pull-based Mac renderer, R2 storage, Buffer scheduling, status polling, Discord alerts.
- Durable state, retries, idempotency, and audit events.

Deferred:

- automatic approval;
- AI-created imagery;
- Reels/video;
- comments/DM automation;
- trend scraping or unofficial Instagram automation;
- optimization driven by Buffer's experimental metrics;
- more than one Instagram channel;
- five-post daily cadence.

## 10. Acceptance criteria for the implementation phase

1. A seeded canonical corpus item can produce a PT or EN draft with every claim linked to evidence.
2. Unsupported or conflicting high-risk claims cannot reach approval.
3. Editing a reviewed revision invalidates its approval.
4. Duplicate n8n executions do not create duplicate concepts, renders, schedules, or Buffer posts.
5. The Mac can be offline for a day without losing jobs; work resumes when it reconnects.
6. A fixed fixture renders byte-stable or visually approved output with no overflow at 1080 × 1350.
7. Buffer can fetch all carousel assets and schedule a five-image test post.
8. A simulated transient failure follows the retry policy; a permanent failure dead-letters once and alerts once.
9. Local state reconciles with Buffer after n8n or the renderer restarts.
10. No secret appears in the repository, n8n export, events, render manifest, or Discord messages.

## 11. Open decisions before implementation

- Whether this workflow lives inside the existing Finkavo monorepo or remains a separate repository that consumes Finkavo APIs. **Recommendation:** keep n8n exports and renderer code here, but place the Social API, shared schemas, and Drizzle migrations in the Finkavo monorepo.
- Exact brand assets, fonts, PT/EN voice guide, disclaimer, caption source format, and visual fixtures.
- Initial official/RSS discovery allowlist and responsible reviewer(s).
- Buffer plan, organization owner/API-key access, Instagram Professional connection, and test channel.
- R2 retention windows for rejected, failed, scheduled, and published artifacts.
- Whether Portuguese social editions should ever be added; they are outside the MVP.
- Whether approval occurs on a small Finkavo review page linked from Discord or inside a Discord bot. **Recommendation:** a Finkavo review page; Discord remains the notification surface.

## 12. External contracts verified on 2026-08-11

- Buffer's public API is GraphQL and supports Instagram post creation; media is supplied through hosted URLs rather than direct file upload.
- Buffer changed its media asset input contract on 2026-05-25, so implementation must use the current schema and a contract test.
- Buffer supports image-only Instagram carousels with up to ten images; this design defaults to five.
- Cloudflare recommends a Worker API for application access to D1 from outside Workers, while its built-in REST API is more appropriate for administrative use. This reinforces avoiding direct n8n-to-D1 access, although this design selects the existing CockroachDB instead.

References:

- Buffer API introduction: https://developers.buffer.com/guides/introduction.html
- Buffer API reference: https://developers.buffer.com/reference.html
- Buffer media hosting: https://developers.buffer.com/guides/hosting-media.html
- Buffer API help and May 2026 asset migration notice: https://support.buffer.com/article/859-does-buffer-have-an-api
- Buffer Instagram support: https://support.buffer.com/article/554-using-instagram-with-buffer
- Cloudflare D1 external-access guidance: https://developers.cloudflare.com/d1/tutorials/build-an-api-to-access-d1/

## 13. Implemented local MVP — 2026-08-12

- A private Social API runs on the spare Mac and uses additive `social_*` tables in CockroachDB.
- Candidate selection reads only public corpus chunks, excludes unavailable/retracted documents, and prioritizes official sources.
- OpenAI structured output creates English drafts with evidence quotes; the API key remains in the protected host environment.
- n8n stores encrypted Bearer credentials and has separate manual generate, approve, and approved-only render workflows.
- A real official-source draft completed `draft → approved → rendered` and produced six 1080 × 1350 PNGs.
- No schedule, public service, Buffer integration, or publishing action is active in this phase.
