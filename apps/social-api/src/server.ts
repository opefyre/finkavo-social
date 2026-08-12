import http from "node:http";
import postgres from "postgres";
import { z } from "zod";
import { DraftSchema } from "./contracts.js";
import { generateDraft } from "./openai.js";

const databaseUrl = process.env.DATABASE_URL;
const apiToken = process.env.SOCIAL_API_TOKEN;
if (!databaseUrl || !apiToken) throw new Error("DATABASE_URL and SOCIAL_API_TOKEN are required");
const sql = postgres(databaseUrl, { max: 5, idle_timeout: 20, connect_timeout: 15 });
const port = Number(process.env.SOCIAL_API_PORT || 4320);

const send = (res: http.ServerResponse, status: number, body: unknown) => {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(body));
};

async function readJson(req: http.IncomingMessage): Promise<unknown> {
  const parts: Buffer[] = [];
  let size = 0;
  for await (const part of req) {
    size += part.length;
    if (size > 1_000_000) throw new Error("Request body too large");
    parts.push(part);
  }
  return JSON.parse(Buffer.concat(parts).toString("utf8") || "{}");
}

const GenerateSchema = z.object({ documentId: z.string().uuid() });
const RenderedSchema = z.object({ files: z.array(z.string().min(1)).min(1).max(10) });

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (req.method === "GET" && url.pathname === "/healthz") {
      await sql`SELECT 1`;
      return send(res, 200, { ok: true, service: "social-api" });
    }
    if (req.headers.authorization !== `Bearer ${apiToken}`) return send(res, 401, { error: "Unauthorized" });

    if (req.method === "GET" && url.pathname === "/v1/candidates") {
      const requested = Number(url.searchParams.get("limit") || 10);
      const limit = Math.max(1, Math.min(Number.isFinite(requested) ? requested : 10, 25));
      const rows = await sql`
        SELECT d.id, d.title, d.source_url, d.source_authority, d.source_tier,
               d.fetched_at, d.last_verified_at, d.freshness_confidence,
               array_agg(c.text ORDER BY c.chunk_index) FILTER (WHERE c.chunk_index < 4) AS excerpts
        FROM document d
        JOIN chunk c ON c.document_id = d.id AND c.vault_doc_id IS NULL
        WHERE d.verified_still_available = true
          AND d.freshness_confidence = 'fresh'
          AND d.source_tier IN ('official', 'professional', 'editorial')
          AND NOT EXISTS (SELECT 1 FROM social_post p WHERE p.source_document_id = d.id AND p.created_at > now() - INTERVAL '90 days')
        GROUP BY d.id
        ORDER BY CASE d.source_tier WHEN 'official' THEN 0 WHEN 'professional' THEN 1 ELSE 2 END,
                 COALESCE(d.last_verified_at, d.fetched_at) DESC
        LIMIT ${limit}
      `;
      return send(res, 200, { candidates: rows });
    }

    if (req.method === "POST" && url.pathname === "/v1/generate") {
      const { documentId } = GenerateSchema.parse(await readJson(req));
      const rows = await sql`
        SELECT d.id, d.title, d.source_url, d.source_authority, d.fetched_at,
               array_agg(c.text ORDER BY c.chunk_index) FILTER (WHERE c.chunk_index < 6) AS excerpts
        FROM document d JOIN chunk c ON c.document_id = d.id AND c.vault_doc_id IS NULL
        WHERE d.id = ${documentId} AND d.verified_still_available = true AND d.freshness_confidence != 'retracted'
        GROUP BY d.id LIMIT 1
      `;
      if (!rows[0]) return send(res, 404, { error: "Public corpus document not found" });
      const source = rows[0] as Record<string, unknown>;
      const { draft, model } = await generateDraft({
        title: String(source.title), sourceUrl: String(source.source_url),
        authority: source.source_authority ? String(source.source_authority) : null,
        fetchedAt: String(source.fetched_at), excerpts: source.excerpts as string[],
      });
      const checked = DraftSchema.parse(draft);
      const inserted = await sql.begin(async (tx) => {
        const [post] = await tx`
          INSERT INTO social_post (topic, source_document_id, source_url, source_title, source_authority, source_fetched_at,
            hook, caption, call_to_action, hashtags, slides, model)
          VALUES (${checked.topic}, ${documentId}, ${String(source.source_url)}, ${String(source.title)},
            ${source.source_authority ? String(source.source_authority) : null}, ${String(source.fetched_at)},
            ${checked.hook}, ${checked.caption}, ${checked.callToAction}, ${tx.json(checked.hashtags)}, ${tx.json(checked.slides)}, ${model})
          RETURNING *
        `;
        for (const claim of checked.claims) await tx`
          INSERT INTO social_claim (post_id, claim_text, evidence_quote, source_url)
          VALUES (${post.id}, ${claim.claim}, ${claim.evidenceQuote}, ${String(source.source_url)})
        `;
        await tx`INSERT INTO social_event (post_id, event_type, payload) VALUES (${post.id}, 'draft.created', ${tx.json({ model })})`;
        return post;
      });
      return send(res, 201, { post: inserted });
    }

    if (req.method === "GET" && url.pathname === "/v1/posts") {
      const status = url.searchParams.get("status");
      const rows = status
        ? await sql`SELECT * FROM social_post WHERE status = ${status} ORDER BY created_at DESC LIMIT 50`
        : await sql`SELECT * FROM social_post ORDER BY created_at DESC LIMIT 50`;
      return send(res, 200, { posts: rows });
    }

    const approve = url.pathname.match(/^\/v1\/posts\/([0-9a-f-]+)\/approve$/i);
    if (req.method === "POST" && approve) {
      const [post] = await sql.begin(async (tx) => {
        const [updated] = await tx`UPDATE social_post SET status = 'approved', approved_at = now(), approved_by = 'owner', updated_at = now() WHERE id = ${approve[1]} AND status = 'draft' RETURNING *`;
        if (updated) await tx`INSERT INTO social_event (post_id, event_type) VALUES (${updated.id}, 'post.approved')`;
        return [updated];
      });
      return post ? send(res, 200, { post }) : send(res, 409, { error: "Only draft posts can be approved" });
    }

    const rendered = url.pathname.match(/^\/v1\/posts\/([0-9a-f-]+)\/rendered$/i);
    if (req.method === "POST" && rendered) {
      const { files } = RenderedSchema.parse(await readJson(req));
      const [post] = await sql`UPDATE social_post SET status = 'rendered', rendered_at = now(), render_files = ${sql.json(files)}, updated_at = now() WHERE id = ${rendered[1]} AND status = 'approved' RETURNING *`;
      return post ? send(res, 200, { post }) : send(res, 409, { error: "Only approved posts can be marked rendered" });
    }

    return send(res, 404, { error: "Not found" });
  } catch (error) {
    const clientError = error instanceof z.ZodError || (error instanceof SyntaxError);
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(JSON.stringify({ level: "error", message }));
    return send(res, clientError ? 400 : 500, { error: clientError ? message : "Internal server error" });
  }
});

const shutdown = async () => { server.close(); await sql.end({ timeout: 5 }); };
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
server.listen(port, "127.0.0.1", () => console.log(JSON.stringify({ service: "social-api", port })));
