import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL, { max: 1, idle_timeout: 5 });
console.log(JSON.stringify(await sql.unsafe(process.argv[2]), null, 1));
await sql.end();
