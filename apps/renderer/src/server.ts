import { createServer } from "node:http";
import { renderManifestSchema } from "./schema.js";
import { renderManifest } from "./render.js";
const port = Number(process.env.RENDERER_PORT ?? 4310);
const token = process.env.RENDERER_API_TOKEN;
const outputRoot = process.env.RENDER_OUTPUT_DIR ?? "./data/renders";
createServer(async (request, response) => {
  response.setHeader("content-type", "application/json; charset=utf-8");
  if (request.method === "GET" && request.url === "/healthz") return response.end(JSON.stringify({ status: "ok" }));
  if (request.method !== "POST" || request.url !== "/render") { response.statusCode = 404; return response.end(JSON.stringify({ error: "not_found" })); }
  if (!token || request.headers.authorization !== `Bearer ${token}`) { response.statusCode = 401; return response.end(JSON.stringify({ error: "unauthorized" })); }
  try {
    const chunks: Buffer[] = []; let size = 0;
    for await (const chunk of request) { const part = Buffer.from(chunk); size += part.length; if (size > 1_000_000) throw new Error("request_too_large"); chunks.push(part); }
    const manifest = renderManifestSchema.parse(JSON.parse(Buffer.concat(chunks).toString("utf8")));
    const files = await renderManifest(manifest, outputRoot);
    response.statusCode = 201; response.end(JSON.stringify({ postId: manifest.postId, revisionId: manifest.revisionId, files }));
  } catch (error) { response.statusCode = 400; response.end(JSON.stringify({ error: error instanceof Error ? error.message : "render_failed" })); }
}).listen(port, "127.0.0.1", () => process.stdout.write(`Renderer listening on http://127.0.0.1:${port}\n`));

