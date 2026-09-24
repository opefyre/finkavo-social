// node reschedule-post.mjs <postId> <dueAt: ISO, or 2026-09-24@20:00 in Lisbon time>
// Moves ONE scheduled reel to a new time (it stays scheduled). Buffer re-validates the whole post on edit, so the script sends the post's own
// text, video and Instagram settings back unchanged. Only when the owner has asked for that post to move.
import { dueAt as toIso } from "./lisbon.mjs";
const [, , id, dueArg] = process.argv;
const H = { authorization: `Bearer ${process.env.BUFFER_API_KEY}`, "content-type": "application/json" };
const gql = async (query, variables) => (await (await fetch("https://api.buffer.com", { method: "POST", headers: H, body: JSON.stringify({ query, variables }) })).json());
const g = await gql(`query($id: PostId!){ post(input:{id:$id}){ id status text dueAt assets{ type source } metadata{ ... on InstagramPostMetadata { type shouldShareToFeed isAiGenerated } } } }`, { id });
const p = g?.data?.post;
if (!p) { console.log("NOT FOUND", JSON.stringify(g).slice(0, 200)); process.exit(1); }
if (p.status !== "scheduled") { console.log(`refusing: status is ${p.status}, not scheduled`); process.exit(1); }
const m = p.metadata || {};
const input = { id, text: p.text, mode: "customScheduled", dueAt: toIso(dueArg), schedulingType: "automatic", aiAssisted: true, saveToDraft: false,
  metadata: { instagram: { type: m.type || "reel", shouldShareToFeed: m.shouldShareToFeed ?? true, isAiGenerated: m.isAiGenerated ?? true } },
  assets: p.assets.map(a => (a.type === "video" ? { video: { url: a.source, metadata: { thumbnailOffset: 400 } } } : { image: { url: a.source } })) };
const r = await gql(`mutation($input: EditPostInput!){ editPost(input:$input){ __typename ... on PostActionSuccess { post { id status dueAt } } ... on MutationError { message } } }`, { input });
const e = r?.data?.editPost;
console.log(e?.post ? `${e.post.id} ${e.post.status} due ${e.post.dueAt} (was ${p.dueAt})` : `FAILED ${JSON.stringify(r).slice(0, 300)}`);
