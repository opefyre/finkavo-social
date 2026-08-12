# n8n workflow exports

These exports contain no credentials or instance-specific credential IDs. After import, attach the shared Social API Bearer Auth credential to each local Social API request node. All publishing workflows remain inactive until Buffer is configured and an approved test is explicitly authorized.

## Workflow map

1. `WF-01-discovery-ingestion.json` — every two hours, collects free GDELT Portugal results as discovery-only records; they can never serve as evidence.
2. `WF-01-generate-draft.json` — manually selects an unused verified corpus source and creates a schema-validated English draft.
3. `WF-05-request-review.json` — creates a signed, expiring, revision-bound private review link. It cannot approve directly.
4. `WF-05-render-smoke.json` — deterministic renderer fixture test only.
5. `WF-06-render-approved.json` — queues only the exact approved revision; the outbound renderer agent performs and verifies the upload.
6. `WF-07-buffer-scheduling.json` — manually queues the latest completed render for 09:00 Lisbon the next day.
7. `WF-08-publish-monitor.json` — processes one due Buffer job and reconciles scheduled posts every 15 minutes.
8. `WF-09-health-report.json` — reads pipeline counts and renderer health daily at 08:00 Lisbon.

The safe manual order is generate → request review → approve in the private page → queue render → schedule. Generation allows an initial attempt plus two repairs. Approval and rendering are immutable and idempotent. Publishing retries use 2/10/30-minute policy, while ambiguous Buffer results are blocked for reconciliation rather than blindly retried.
