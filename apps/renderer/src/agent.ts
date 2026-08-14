import { createHash } from "node:crypto";
import { hostname } from "node:os";
import { readFile, stat } from "node:fs/promises";
import { renderManifestSchema, type RenderManifest } from "./schema.js";
import { renderManifest } from "./render.js";

const apiBase = process.env.SOCIAL_API_BASE_URL || "http://127.0.0.1:4320";
const token = process.env.SOCIAL_API_TOKEN;
const outputRoot = process.env.RENDER_OUTPUT_DIR || "./data/renders";
const workerId = process.env.RENDERER_WORKER_ID || `${hostname()}-renderer`;
const pollMs = Number(process.env.RENDERER_POLL_MS || 30_000);
if (!token) throw new Error("SOCIAL_API_TOKEN is required for renderer agent");

async function api(path: string, init: RequestInit = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: { authorization: `Bearer ${token}`, "x-renderer-id": workerId, "content-type": "application/json", ...init.headers },
    signal: AbortSignal.timeout(120_000),
  });
  const body = await response.json() as Record<string, unknown>;
  if (!response.ok) throw new Error(`${path} failed (${response.status}): ${String(body.error || "unknown error")}`);
  return body;
}

async function processOne() {
  const claimed = await api("/v1/render-jobs/claim", { method: "POST", body: "{}" });
  const job = claimed.job as { id: string; manifest: unknown } | null;
  if (!job) {
    await api("/v1/renderer/heartbeat", { method: "POST", body: "{}" });
    return false;
  }
  try {
    const manifest: RenderManifest = renderManifestSchema.parse(job.manifest);
    const paths = await renderManifest(manifest, outputRoot);
    const files = await Promise.all(paths.map(async (path, index) => {
      const bytes = await readFile(path);
      const info = await stat(path);
      return { index: index + 1, sha256: createHash("sha256").update(bytes).digest("hex"), bytes: info.size, width: 1080 as const, height: 1350 as const, mimeType: "image/png" as const, path };
    }));
    const prepared = await api(`/v1/render-jobs/${job.id}/uploads`, { method: "POST", body: JSON.stringify({ files: files.map(({ path: _path, ...file }) => file) }) });
    const uploads = prepared.uploads as Array<{ index: number; key: string; uploadUrl: string; sha256: string; bytes: number; width: 1080; height: 1350; mimeType: "image/png" }>;
    for (const upload of uploads) {
      const file = files.find((item) => item.index === upload.index)!;
      const bytes = await readFile(file.path);
      const response = await fetch(upload.uploadUrl, { method: "PUT", headers: { "content-type": upload.mimeType, "content-length": String(upload.bytes) }, body: new Uint8Array(bytes), signal: AbortSignal.timeout(120_000) });
      if (!response.ok) {
        const detail = (await response.text()).replace(/<RequestId>.*?<\/RequestId>/s, "").replace(/<HostId>.*?<\/HostId>/s, "").slice(0, 500);
        throw new Error(`R2 upload failed (${response.status}) for slide ${upload.index}: ${detail}`);
      }
    }
    await api(`/v1/render-jobs/${job.id}/complete`, { method: "POST", body: JSON.stringify({ files: uploads.map(({ uploadUrl: _url, ...file }) => file) }) });
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown render failure";
    const deterministic = /overflows the canvas|invalid .*canvas|approved brand fonts|schema|parse|does not match its manifest/i.test(message);
    await api(`/v1/render-jobs/${job.id}/fail`, { method: "POST", body: JSON.stringify({ code: deterministic ? "RENDER_CONTRACT_FAILED" : "RENDER_FAILED", message, retryable: !deterministic }) });
    return true;
  }
}

async function main() {
  for (;;) {
    try {
      const worked = await processOne();
      if (!worked) await new Promise((resolve) => setTimeout(resolve, pollMs));
    } catch (error) {
      console.error(JSON.stringify({ level: "error", workerId, message: error instanceof Error ? error.message : "agent failure" }));
      await new Promise((resolve) => setTimeout(resolve, pollMs));
    }
  }
}

void main();
