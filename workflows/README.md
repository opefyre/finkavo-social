# n8n workflow exports

These exports contain no secrets. The production instance attaches its encrypted Social API Bearer credential after import. Scheduled production workflows are active; the separate manual render, schedule, and monitor exports remain inactive recovery controls.

## Workflow map

1. `WF-01-discovery-ingestion.json` — every two hours, collects broad free Portugal news signals as discovery-only records.
2. `WF-01-official-monitoring.json` — every two hours, watches important Portuguese government domains for changes.
3. `WF-02-verification.json` — promotes only official notices that exactly match fresh canonical corpus evidence.
4. `WF-03-daily-planning.json` — at 08:00 Lisbon, loads that day's five predetermined annual-plan topics, checks the flexible news slot, builds current evidence bundles, and replaces unsupported flexible slots only with named verified reserves.
5. `WF-04-generate-planned.json` — at 08:02 Lisbon, generates social-first English drafts only from that day's verified topic-led plan.
6. `WF-05-request-review.json` — from 08:10 to 08:30 Lisbon, creates signed, expiring, revision-bound private review links for up to five drafts assigned to that day's plan. It cannot approve directly or reuse a draft from another plan date.
7. `WF-06-render-approved.json` — queues up to five exact approved revisions; the outbound renderer agent performs and verifies the uploads.
8. `WF-07-buffer-scheduling.json` — manually assigns up to five completed renders to 08:30, 11:30, 14:30, 18:00, and 21:00 Lisbon the next day.
9. `WF-08-publish-monitor.json` — processes one due Buffer job and reconciles scheduled posts every 15 minutes.
10. `WF-09-health-report.json` — reads pipeline, editorial-calendar, and renderer health daily at 08:00 Lisbon.

The safe manual order is plan → generate → request review → approve in the private page → queue render → schedule. Recurring deadlines use occurrence-specific fingerprints, so a previous IRS or IVA post never suppresses the next filing period. Generation allows an initial attempt plus two repairs. Approval and rendering are immutable and idempotent. Publishing retries use 2/10/30-minute policy, while ambiguous Buffer results are blocked for reconciliation rather than blindly retried.
