import { readFile } from "node:fs/promises";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required");
const sql = postgres(databaseUrl, { max: 1, connect_timeout: 15 });
try {
  const migration = await readFile(new URL("../migrations/0001_social_state.sql", import.meta.url), "utf8");
  await sql.unsafe(migration);
  console.log("Social state migration applied");
} finally {
  await sql.end({ timeout: 5 });
}
