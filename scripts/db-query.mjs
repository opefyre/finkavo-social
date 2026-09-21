// node scripts/db-query.mjs "select …"  — runs one SQL statement against the pipeline database (DATABASE_URL) and prints JSON.
// Read-only by habit: use it to look, never to edit. Needs `pnpm install` (postgres lives in apps/social-api).
import postgres from "../apps/social-api/node_modules/postgres/src/index.js";
const sql = postgres(process.env.DATABASE_URL, { max: 1, idle_timeout: 5 });
console.log(JSON.stringify(await sql.unsafe(process.argv[2]), null, 1));
await sql.end();
