import { readFile, readdir } from "node:fs/promises";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");
const sql = postgres(databaseUrl, { max: 1, connect_timeout: 15 });
try {
  await sql`CREATE TABLE IF NOT EXISTS social_schema_migration (version STRING PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  // Sentinels exist only for migrations whose tables predate this migration table, so an
  // already-provisioned database can be adopted without re-running them.
  const legacySentinels: Record<string, string> = {
    "0000_corpus_dependency.sql": "document",
    "0001_social_state.sql": "social_post",
    "0002_production_pipeline.sql": "social_review_token",
    "0004_discovery_planning.sql": "social_discovery",
    "0005_editorial_intelligence.sql": "social_editorial_rule",
    "0006_topic_led_plan.sql": "social_editorial_plan_slot",
    "0014_local_corpus_chunks.sql": "chunk",
  };

  // Read the directory rather than maintaining a hardcoded list. The list silently
  // ignored any migration nobody remembered to add to it, which is how 0015 shipped
  // without its table existing.
  const migrationsDir = new URL("../migrations/", import.meta.url);
  const names = (await readdir(migrationsDir)).filter(name => name.endsWith(".sql")).sort();
  if (!names.length) throw new Error("No migrations found");

  for (const name of names) {
    const sentinel = legacySentinels[name] ?? "";
    const [applied] = await sql`SELECT version FROM social_schema_migration WHERE version = ${name}`;
    if (applied) continue;
    const [existing] = sentinel ? await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ${sentinel}` : [];
    if (existing) {
      await sql`INSERT INTO social_schema_migration (version) VALUES (${name}) ON CONFLICT DO NOTHING`;
      console.log(`Recorded existing ${name}`);
      continue;
    }
    const migration = await readFile(new URL(name, migrationsDir), "utf8");
    await sql.unsafe(migration);
    await sql`INSERT INTO social_schema_migration (version) VALUES (${name})`;
    console.log(`Applied ${name}`);
  }
} finally {
  await sql.end({ timeout: 5 });
}
