# n8n workflow exports

These exports contain no credentials or instance-specific credential IDs. After import, attach the shared Social API Bearer Auth credential to each local Social API request node. All publishing workflows remain inactive until Buffer is configured and an approved test is explicitly authorized.

## Workflow map

1. `WF-01-discovery-ingestion.json` — every two hours, collects broad free Portugal news signals as discovery-only records.
2. `WF-01-official-monitoring.json` — every two hours, watches important Portuguese government domains for changes.
3. `WF-02-verification.json` — promotes only official notices that exactly match fresh canonical corpus evidence.
4. `WF-03-daily-planning.json` — at 06:30 Lisbon, expands recurring deadlines/occasions and selects up to five diverse launch-phase posts.
5. `WF-04-generate-planned.json` — manually generates social-first, evidence-bound English drafts for up to five verified plans.
6. `WF-05-request-review.json` — creates signed, expiring, revision-bound private review links for up to five drafts. It cannot approve directly.
7. `WF-06-render-approved.json` — queues up to five exact approved revisions; the outbound renderer agent performs and verifies the uploads.
8. `WF-07-buffer-scheduling.json` — manually assigns up to five completed renders to 08:30, 11:30, 14:30, 18:00, and 21:00 Lisbon the next day.
9. `WF-08-publish-monitor.json` — processes one due Buffer job and reconciles scheduled posts every 15 minutes.
10. `WF-09-health-report.json` — reads pipeline, editorial-calendar, and renderer health daily at 08:00 Lisbon.

The safe manual order is plan → generate → request review → approve in the private page → queue render → schedule. Recurring deadlines use occurrence-specific fingerprints, so a previous IRS or IVA post never suppresses the next filing period. Generation allows an initial attempt plus two repairs. Approval and rendering are immutable and idempotent. Publishing retries use 2/10/30-minute policy, while ambiguous Buffer results are blocked for reconciliation rather than blindly retried.
