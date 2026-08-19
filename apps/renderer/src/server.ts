import { createServer } from "node:http";
import { renderManifestSchema } from "./schema.js";
import { renderManifest } from "./render.js";
import { fetchRenderedText } from "./fetch-text.js";
const port = Number(process.env.RENDERER_PORT ?? 4310);
const token = process.env.RENDERER_API_TOKEN;
const outputRoot = process.env.RENDER_OUTPUT_DIR ?? "./data/renders";

async function readBody(request: NodeJS.ReadableStream, limit = 1_000_000) {
  const chunks: Buffer[] = []; let size = 0;
  for await (const chunk of request) { const part = Buffer.from(chunk); size += part.length; if (size > limit) throw new Error("request_too_large"); chunks.push(part); }
  return Buffer.concat(chunks).toString("utf8");
}

createServer(async (request, response) => {
  response.setHeader("content-type", "application/json; charset=utf-8");
  if (request.method === "GET" && request.url === "/healthz") return response.end(JSON.stringify({ status: "ok" }));
  const isRender = request.method === "POST" && request.url === "/render";
  // Chromium already runs here for carousel rendering, so it also serves as the reader
  // for official pages that render client-side or refuse non-browser clients.
  const isFetchText = request.method === "POST" && request.url === "/fetch-text";
  if (!isRender && !isFetchText) { response.statusCode = 404; return response.end(JSON.stringify({ error: "not_found" })); }
  if (!token || request.headers.authorization !== `Bearer ${token}`) { response.statusCode = 401; return response.end(JSON.stringify({ error: "unauthorized" })); }
  try {
    if (isFetchText) {
      const { url, timeoutMs } = JSON.parse(await readBody(request)) as { url?: string; timeoutMs?: number };
      if (!url || !/^https:\/\//.test(url)) { response.statusCode = 400; return response.end(JSON.stringify({ error: "https url required" })); }
      const page = await fetchRenderedText(url, timeoutMs);
      response.statusCode = 200;
      return response.end(JSON.stringify(page));
    }
    const manifest = renderManifestSchema.parse(JSON.parse(await readBody(request)));
    const files = await renderManifest(manifest, outputRoot);
    response.statusCode = 201; response.end(JSON.stringify({ postId: manifest.postId, revisionId: manifest.revisionId, files }));
  } catch (error) { response.statusCode = 400; response.end(JSON.stringify({ error: error instanceof Error ? error.message : "render_failed" })); }
}).listen(port, "127.0.0.1", () => process.stdout.write(`Renderer listening on http://127.0.0.1:${port}\n`));
