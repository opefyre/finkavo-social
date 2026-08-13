import postgres from "../apps/social-api/node_modules/postgres/src/index.js";
import { randomUUID } from "node:crypto";

const { DATABASE_URL, SOCIAL_API_TOKEN, SOCIAL_API_PORT = "4320" } = process.env;
if (!DATABASE_URL || !SOCIAL_API_TOKEN) throw new Error("DATABASE_URL and SOCIAL_API_TOKEN are required");
const date = process.argv[2];
if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) throw new Error("Usage: node scripts/validate-news-flex-live.mjs YYYY-MM-DD");

const sql = postgres(DATABASE_URL, { max: 1 });
let conceptId;
try {
  const [document] = await sql`
    SELECT d.id,d.title FROM document d
    WHERE d.source_tier='official' AND d.verified_still_available=true AND d.freshness_confidence='fresh'
      AND EXISTS (SELECT 1 FROM chunk c WHERE c.document_id=d.id AND c.vault_doc_id IS NULL)
    ORDER BY COALESCE(d.last_verified_at,d.fetched_at) DESC LIMIT 1
  `;
  if (!document) throw new Error("No fresh official document with direct excerpts is available");
  const fingerprint = `live-validation:${randomUUID()}`;
  const [concept] = await sql`
    INSERT INTO social_post_concept (document_id,topic,category,risk_level,priority,timeliness,fingerprint,status,reason,repeat_allowed,score)
    VALUES (${document.id},${document.title},'official_updates','medium',100,'official_change',${fingerprint},'eligible','Temporary live validation fixture',true,100)
    RETURNING id
  `;
  conceptId = concept.id;
  const response = await fetch(`http://127.0.0.1:${SOCIAL_API_PORT}/v1/news/decide-flex-slot`, {
    method: "POST",
    headers: { authorization: `Bearer ${SOCIAL_API_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify({ date, cutoffReached: true, dryRun: true }),
  });
  const result = await response.json();
  if (!response.ok || result.decision !== "verified_news" || result.conceptId !== conceptId) throw new Error(`Unexpected decision: ${JSON.stringify(result)}`);
  const [unchanged] = await sql`SELECT status,plan_slot_id,evidence_bundle_id FROM social_post_concept WHERE id=${conceptId}`;
  if (unchanged.status !== "eligible" || unchanged.plan_slot_id || unchanged.evidence_bundle_id) throw new Error("Dry-run mutated the official-change candidate");
  console.log(JSON.stringify({ valid: true, decision: result.decision, evidenceSource: result.source, approvalBypassed: false, dryRunMutation: false }, null, 2));
} finally {
  if (conceptId) await sql`DELETE FROM social_post_concept WHERE id=${conceptId}`;
  await sql.end();
}
