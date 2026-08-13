import { readFile } from "node:fs/promises";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");
const sql = postgres(databaseUrl, { max: 1, connect_timeout: 15 });
try {
  await sql`CREATE TABLE IF NOT EXISTS social_schema_migration (version STRING PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  const migrations = [
    { name: "0001_social_state.sql", sentinel: "social_post" },
    { name: "0002_production_pipeline.sql", sentinel: "social_review_token" },
    { name: "0003_publish_leases.sql", sentinel: "" },
    { name: "0004_discovery_planning.sql", sentinel: "social_discovery" },
    { name: "0005_editorial_intelligence.sql", sentinel: "social_editorial_rule" },
    { name: "0006_topic_led_plan.sql", sentinel: "social_editorial_plan_slot" },
    { name: "0007_editorial_identity.sql", sentinel: "" },
    { name: "0008_official_source_snapshots.sql", sentinel: "" },
    { name: "0009_reserve_evidence.sql", sentinel: "" },
  ];
  for (const { name, sentinel } of migrations) {
    const [applied] = await sql`SELECT version FROM social_schema_migration WHERE version = ${name}`;
    if (applied) continue;
    const [existing] = sentinel ? await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ${sentinel}` : [];
    if (existing) {
      await sql`INSERT INTO social_schema_migration (version) VALUES (${name}) ON CONFLICT DO NOTHING`;
      console.log(`Recorded existing ${name}`);
      continue;
    }
    const migration = await readFile(new URL(`../migrations/${name}`, import.meta.url), "utf8");
    await sql.unsafe(migration);
    await sql`INSERT INTO social_schema_migration (version) VALUES (${name})`;
    console.log(`Applied ${name}`);
  }
} finally {
  await sql.end({ timeout: 5 });
}
