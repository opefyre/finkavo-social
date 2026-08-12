# n8n workflow exports

Sanitized n8n JSON exports will live here. Credential values and instance-specific IDs must never be committed.

Planned workflows:

1. `WF-01-discovery-ingestion.json`
2. `WF-02-claim-verification.json`
3. `WF-03-daily-planning.json`
4. `WF-04-copy-generation.json`
5. `WF-05-render-smoke.json` — renderer smoke test
6. `WF-05-approve-draft.json` — explicit owner-controlled approval gate
7. `WF-06-render-approved.json` — only renders approved database records
8. `WF-08-buffer-scheduling.json`
9. `WF-09-publish-monitor.json`
10. `WF-10-health-report.json`

They follow the Social API contract and database migrations; credentials stay in n8n.

The committed exports intentionally contain no instance-specific credential IDs. After import, attach the Social API Bearer Auth credential to the Social API nodes and the Renderer Bearer Auth credential to renderer nodes. `WF-06` can only select records already marked `approved` in the database.

Current manual order: run `WF-01`, inspect its final draft output, run `WF-05`
only if the copy and source are acceptable, then run `WF-06`. No publishing
workflow is active.
