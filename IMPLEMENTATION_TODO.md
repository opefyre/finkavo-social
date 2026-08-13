# Finkavo content-system completion checklist

This is the authoritative completion tracker. A box is checked only after the implementation is committed, deployed to the spare Mac where applicable, and its validation evidence is recorded below.

## 1. Editorial-plan cleanup and identity

- [ ] Replace mechanically varied titles with distinct, intentional topic briefs.
- [x] Add structured identity to every brief: `subject_family`, `user_question`, `audience`, `intent`, `occurrence_key`, and `campaign_stage`.
- [x] Make duplicate controls use structured identity while allowing legitimate recurring deadline campaigns.
- [ ] Validate the full plan has no duplicate subject/question/audience/intent combination without an occurrence or campaign-stage reason.

## 2. Verified 90-day plan

- [x] Curate the next 90 days: five specific briefs per day, each with purpose, required answers, source policy, timing class, and fallback behavior.
- [x] Verify every fixed-date brief against a current official source.
- [x] Hold any slot that lacks adequate evidence; never fill it with generic copy.
- [x] Validate all 450 briefs structurally and editorially.

## 3. Deadlines, occasions, and campaigns

- [x] Complete the official calendar for IRS, IVA, Social Security, IMI, AIMI, IUC, employment, education, immigration, and relevant public-service cycles.
- [x] Add Portuguese national occasions, useful seasonal moments, and selected official events.
- [x] Create preparation, reminder, last-call, and after-deadline stages where genuinely useful.
- [x] Add same-day or freshness-window reverification for dates, thresholds, eligibility, and closures.

## 4. Evergreen reserve

- [ ] Build at least 90 distinct, source-specific, generation-tested evergreen briefs.
- [ ] Ensure reserve coverage across all 14 editorial pillars and major user journeys with a source that answers each brief.
- [x] Prevent reserve use when its evidence is stale or its subject recently ran for the same audience and purpose.

## 5. Source and news reliability

- [x] Monitor canonical official authority pages directly; keep news/RSS as discovery only.
- [x] Resolve discovery links to original sources and reject aggregators as evidence.
- [x] Detect material page changes using canonical URL and content hash.
- [x] Implement verified-news replacement for the flexible slot, with an automatic named evergreen fallback at cutoff.
- [x] Validate an official change can replace a flexible slot without bypassing evidence or approval.

## 6. Quality gates

- [x] Enforce planned-topic coverage and source specificity before draft creation.
- [x] Enforce factual support, current dates, English-only copy, caption completeness, and useful/non-generic content.
- [x] Enforce visual QA: real logo, brand font/colors, no clipping, no stretching, readable type, complete slides, and valid media URLs.
- [x] Add a final pre-Discord editorial score and block anything below threshold.
- [x] Validate representative low-, medium-, and high-risk posts plus deliberate failure cases.

## 7. Operations and reporting

- [x] Send a daily Discord report containing five planned topics, evidence status, news candidates, held reasons, approvals, and publishing schedule.
- [x] Add weekly maintenance: verify the next 14 days, repair held topics, audit duplicates, and replenish reserves.
- [x] Add monthly maintenance: verify the next 90 days and review content performance.
- [x] Add measurable alerting for failed schedules, missing approval batches, stale renderer heartbeat, and publication-confirmation failures.

## 8. Production completion

- [ ] Run automated tests and full data validation.
- [ ] Dry-run one complete day without publishing.
- [ ] Deploy the final workflows and API to the spare Mac.
- [ ] Confirm live schedules, Discord delivery, secure mobile approval, rendering, Buffer scheduling, publishing, and published alerts.
- [ ] Update `CONTEXT.md`, operational documentation, and GitHub.
- [ ] Complete a final audit showing no known non-Buffer blocker and record the evidence below.

## Validation record

| Date | Item | Evidence | Result |
|---|---|---|---|
| 2026-08-13 | Tracker created | Requirements converted into implementation and validation gates | Pass |
| 2026-08-13 | Structured editorial identity | Migration `0007`; identity and duplicate tests; live schema/API verification | Pass |
| 2026-08-13 | Curated 90-day brief set | Plan v2 validator: 450 briefs, 90 days, 450 unique identities, complete source/fallback policies, high-risk cap | Pass |
| 2026-08-13 | Official-calendar foundation | 18 scoped events; 14 current/rule-confirmed; 3 explicitly held for reverification; official-domain validator | Pass |
| 2026-08-13 | Calendar-to-plan integration | Calendar generates 25 campaign stages; all stages inside the curated window appear once with matching event, stage, date, status, and canonical source | Pass |
| 2026-08-13 | Evidence holds and canonical fixed-date sources | Live API automatically holds `must_reverify`; fixed-date research is restricted to the calendar's exact canonical URL; deployed service running; five-slot campaign-day API check passed | Pass |
| 2026-08-13 | Canonical official monitoring | Six directly fetchable authority pages; canonical URL + normalized visible-text hash snapshots; repeat hash unchanged; n8n workflow replaced in place and published | Pass |
| 2026-08-13 | Calendar expansion | 34 scoped events, 44 campaign stages, full mainland 2026–27 school cycle, remaining in-period national holidays, plus explicit AIMA/ACT continuous monitoring rules | Pass |
| 2026-08-13 | Evergreen reserve structural audit | 98 unique briefs, seven per pillar; 14/14 exact official sources stored append-only; freshness and 90-day same-identity reuse gates validated. Later generation testing showed that one source per pillar did not answer every brief, so source-specific curation remains open. | Superseded |
| 2026-08-13 | Calendar completion and reverification | Validator: 34 events, 44 campaign stages, 31 confirmed and 2 deliberately held for same-day reverification; deployed evidence workflow preserves holds | Pass |
| 2026-08-13 | Flexible news decision | Production WF-03 updated in place; live preview waits before cutoff and selects evidence-current named reserve at cutoff | Pass |
| 2026-08-13 | Official-news replacement safety | Topic-specific source gate; self-cleaning live official-change preview returned `verified_news`; candidate remained unmutated and approval was not bypassed | Pass |
| 2026-08-13 | Draft and editorial quality gates | Evidence bundle required for planned content; factual quote, date freshness, English, caption, identity, specific-hook and pre-Discord score gates; 29 API test cases including all risk levels and deliberate failures | Pass |
| 2026-08-13 | Visual quality gate | Spare-Mac renderer produced five 1080×1350 slides with approved logo/fonts, no clipping/overlap/stretching; fixture visually inspected; public-media contract remains enforced before Buffer | Pass |
| 2026-08-13 | Daily Discord operations report | Live Discord delivery returned exactly five current-version slots with evidence, held reasons, candidate count, approvals and schedule; duplicate plan versions automatically retired | Pass |
| 2026-08-13 | Maintenance and alerts | Active WF-10: 15-minute alert checks, Monday 14-day plan/evidence/duplicate/reserve maintenance, monthly 90-day/performance review; live alert detected incomplete 2/5 batch | Pass |
| 2026-08-13 | Evidence-hold fallback | Tomorrow live plan: four unsupported topics replaced by named evidence-current reserve briefs; final report 5 planned, 5 verified, 0 held | Pass |
| 2026-08-13 | Live reserve generation audit | Five-post dry run: two drafts passed; six weak topic/source attempts were blocked automatically. Retry constraint and source-specific ranking were deployed; reserve curation remains open until at least 90 briefs pass the stricter source-answer test. No content was published or sent to Discord. | Correctly blocked |
