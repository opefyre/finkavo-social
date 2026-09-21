import { readFile } from "node:fs/promises";
// node create-carousel-draft.mjs <captionPath> <dueAt ISO> <title> <imageUrl1> <imageUrl2> ...
// Creates a carousel DRAFT in Buffer (never publishes). Needs BUFFER_API_KEY and BUFFER_CHANNEL_ID.
const [, , captionPath, dueAt, title, ...urls] = process.argv;
if (urls.length < 2) { console.error("a carousel needs at least two images"); process.exit(1); }
const text = (await readFile(captionPath, "utf8")).trim();
const tags = text.match(/#[\p{L}\p{N}_]+/gu) || [];
if (tags.length > 5) { console.error(`refusing: ${tags.length} hashtags; Instagram allows five`); process.exit(1); }

const query = `mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    __typename
    ... on PostActionSuccess { post { id status dueAt } }
    ... on MutationError { message }
  }
}`;
const input = {
  text, channelId: process.env.BUFFER_CHANNEL_ID, schedulingType: "automatic", mode: "customScheduled", dueAt,
  aiAssisted: true, saveToDraft: true,
  metadata: { instagram: { type: "post", shouldShareToFeed: true, isAiGenerated: true } },
  assets: urls.map(url => ({ image: { url } })),
};
const r = await fetch("https://api.buffer.com", {
  method: "POST", headers: { authorization: `Bearer ${process.env.BUFFER_API_KEY}`, "content-type": "application/json" },
  body: JSON.stringify({ query, variables: { input } }),
});
const j = await r.json(); const p = j?.data?.createPost?.post;
console.log(p ? `draft ${p.id} ${p.status} due ${p.dueAt} (${urls.length} slides) — ${title}` : "FAILED " + JSON.stringify(j).slice(0, 300));
