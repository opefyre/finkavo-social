import { createHash } from "node:crypto";
import { hostname } from "node:os";
import { readFile, stat } from "node:fs/promises";
import { renderManifestSchema, type RenderManifest } from "./schema.js";
import { renderManifest } from "./render.js";
import { ReelManifestSchema } from "./reel-schema.js";
import { renderReel } from "./render-reel.js";
import { composeReel } from "./compose-reel.js";
import { chooseSound, loadSoundLibrary } from "./sound-library.js";
import path from "node:path";

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
  const job = claimed.job as { id: string; manifest: unknown; kind?: string } | null;
  if (!job) {
    await api("/v1/renderer/heartbeat", { method: "POST", body: "{}" });
    return false;
  }
  try {
    // A reel comes off the same queue with the same lease and the same retries; only what
    // it produces differs — an MP4 and the cover frame, rather than one PNG per slide.
    if (job.kind === "reel") {
      const reel = ReelManifestSchema.parse(job.manifest);
      const workDir = path.join(outputRoot, "reels", job.id);
      const framePaths = await renderReel(reel, workDir);

      // The soundtrack is chosen from the post itself, so a re-render after an edit does
      // not silently hand the same reel a different song.
      const assetRoot = path.resolve(process.env.RENDER_ASSET_ROOT || "branding/assets");
      const library = await loadSoundLibrary(assetRoot);
      const sound = chooseSound(reel.topic, library);
      const audio = sound?.kind === "music" ? { musicPath: sound.path } : sound ? { effectPath: sound.path } : {};
      const video = await composeReel(reel, framePaths, path.join(workDir, "reel.mp4"), audio);

      // Two files: the video, and the opening frame as its cover. Left to itself
      // Instagram picks a frame mid-zoom with the text half-scaled.
      const parts = [
        { index: 1, file: video.path, mimeType: "video/mp4" as const },
        { index: 2, file: framePaths[0]!, mimeType: "image/png" as const },
      ];
      const reelFiles = await Promise.all(parts.map(async part => {
        const bytes = await readFile(part.file);
        const info = await stat(part.file);
        return { index: part.index, path: part.file, sha256: createHash("sha256").update(bytes).digest("hex"), bytes: info.size, width: 1080 as const, height: 1920 as const, mimeType: part.mimeType };
      }));
      const preparedReel = await api(`/v1/render-jobs/${job.id}/uploads`, { method: "POST", body: JSON.stringify({ files: reelFiles.map(({ path: _p, ...file }) => file) }) });
      const reelUploads = preparedReel.uploads as Array<{ index: number; key: string; uploadUrl: string; bytes: number; mimeType: string }>;
      for (const upload of reelUploads) {
        const local = reelFiles.find(item => item.index === upload.index)!;
        const bytes = await readFile(local.path);
        const response = await fetch(upload.uploadUrl, { method: "PUT", headers: { "content-type": upload.mimeType, "content-length": String(upload.bytes) }, body: new Uint8Array(bytes) });
        if (!response.ok) throw new Error(`R2 upload failed (${response.status}) for reel part ${upload.index}`);
      }
      await api(`/v1/render-jobs/${job.id}/complete`, { method: "POST", body: JSON.stringify({ files: reelUploads.map(({ uploadUrl: _u, ...file }) => file) }) });
      return true;
    }

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
