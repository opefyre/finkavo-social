import { readFile } from "node:fs/promises";
import { createScheduledPost } from "../dist/buffer.js";
const [, , videoUrl, coverUrl, captionPath, dueAt, title] = process.argv;
const text = (await readFile(captionPath, "utf8")).trim();
const post = await createScheduledPost({
  channelId: process.env.BUFFER_CHANNEL_ID,
  text, dueAt, mediaUrls: [],
  video: { url: videoUrl, thumbnailUrl: coverUrl, title },
  saveToDraft: true,
});
console.log("BUFFER DRAFT:", JSON.stringify(post));
