import { readFile } from "node:fs/promises";
import { dueAt as toIso } from "./lisbon.mjs";
// argv: videoUrl captionPath dueAt title   (dueAt: ISO, or 2026-09-23@09:00 in Lisbon time)   — creates a reel DRAFT in Buffer (never publishes)
// SCHEDULE=1 creates it SCHEDULED instead (it will publish at dueAt). Only when the owner has explicitly asked for that post to be scheduled.
const [, , videoUrl, captionPath, dueArg, title] = process.argv;
const schedule = process.env.SCHEDULE === "1";
const dueAt = toIso(dueArg);
const text = (await readFile(captionPath, "utf8")).trim();
const tags = text.match(/#[\p{L}\p{N}_]+/gu) || [];
if (tags.length > 5) { console.error(`refusing: ${tags.length} hashtags`); process.exit(1); }
const query = `mutation CreatePost($input: CreatePostInput!) { createPost(input: $input) { __typename ... on PostActionSuccess { post { id status dueAt } } ... on MutationError { message } } }`;
const input = {
  text, channelId: process.env.BUFFER_CHANNEL_ID, schedulingType: "automatic", mode: "customScheduled", dueAt, aiAssisted: true, saveToDraft: !schedule,
  metadata: { instagram: { type: "reel", shouldShareToFeed: true, isAiGenerated: true } },
  assets: [{ video: { url: videoUrl, metadata: { title, thumbnailOffset: 400 } } }],
};
const r = await fetch("https://api.buffer.com", { method: "POST", headers: { authorization: `Bearer ${process.env.BUFFER_API_KEY}`, "content-type": "application/json" }, body: JSON.stringify({ query, variables: { input } }) });
const j = await r.json(); const p = j?.data?.createPost?.post;
console.log(p ? `${schedule ? "scheduled" : "draft"} ${p.id} ${p.status} due ${p.dueAt}` : "FAILED " + JSON.stringify(j).slice(0, 400));
