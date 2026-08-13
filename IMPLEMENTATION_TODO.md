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

- [ ] Complete the official calendar for IRS, IVA, Social Security, IMI, AIMI, IUC, employment, education, immigration, and relevant public-service cycles.
- [ ] Add Portuguese national occasions, useful seasonal moments, and selected official events.
- [x] Create preparation, reminder, last-call, and after-deadline stages where genuinely useful.
- [ ] Add same-day or freshness-window reverification for dates, thresholds, eligibility, and closures.

## 4. Evergreen reserve

- [ ] Build at least 90 distinct, evidence-ready evergreen briefs.
- [ ] Ensure reserve coverage across all 14 editorial pillars and major user journeys.
- [ ] Prevent reserve use when its evidence is stale or its subject recently ran for the same audience and purpose.

## 5. Source and news reliability

- [x] Monitor canonical official authority pages directly; keep news/RSS as discovery only.
- [x] Resolve discovery links to original sources and reject aggregators as evidence.
- [x] Detect material page changes using canonical URL and content hash.
- [ ] Implement verified-news replacement for the flexible slot, with an automatic named evergreen fallback at cutoff.
- [ ] Validate an official change can replace a flexible slot without bypassing evidence or approval.

## 6. Quality gates

- [ ] Enforce planned-topic coverage and source specificity before draft creation.
- [ ] Enforce factual support, current dates, English-only copy, caption completeness, and useful/non-generic content.
- [ ] Enforce visual QA: real logo, brand font/colors, no clipping, no stretching, readable type, complete slides, and valid media URLs.
- [ ] Add a final pre-Discord editorial score and block anything below threshold.
- [ ] Validate representative low-, medium-, and high-risk posts plus deliberate failure cases.

## 7. Operations and reporting

- [ ] Send a daily Discord report containing five planned topics, evidence status, news candidates, held reasons, approvals, and publishing schedule.
- [ ] Add weekly maintenance: verify the next 14 days, repair held topics, audit duplicates, and replenish reserves.
- [ ] Add monthly maintenance: verify the next 90 days and review content performance.
- [ ] Add measurable alerting for failed schedules, missing approval batches, stale renderer heartbeat, and publication-confirmation failures.

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
