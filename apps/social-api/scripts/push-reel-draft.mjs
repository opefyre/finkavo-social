import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { uploadReelAssets } from "../dist/storage.js";
import { createScheduledPost } from "../dist/buffer.js";

const [, , mp4Path, coverPath, captionPath, dueAt, title] = process.argv;
const video = new Uint8Array(await readFile(mp4Path));
const cover = new Uint8Array(await readFile(coverPath));
const text = (await readFile(captionPath, "utf8")).trim();

const postId = randomUUID(), revisionId = randomUUID();
const { videoUrl, coverUrl } = await uploadReelAssets({ postId, revisionId, video, cover });
console.log("video:", videoUrl);
console.log("cover:", coverUrl);

for (const [label, url] of [["video", videoUrl], ["cover", coverUrl]]) {
  const r = await fetch(url, { method: "GET", headers: { Range: "bytes=0-31" }, signal: AbortSignal.timeout(20000) });
  if (!r.ok && r.status !== 206) throw new Error(`${label} not publicly readable: HTTP ${r.status}`);
  console.log(`${label} public: HTTP ${r.status}`);
}

const post = await createScheduledPost({
  channelId: process.env.BUFFER_CHANNEL_ID,
  text, dueAt, mediaUrls: [],
  video: { url: videoUrl, thumbnailUrl: coverUrl, title },
  saveToDraft: true,
});
console.log("BUFFER DRAFT:", JSON.stringify(post));
