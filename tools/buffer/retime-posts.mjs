// node retime-posts.mjs <from HH:MM> <to HH:MM> [--apply] [--limit N] [--only <postId>]
// Moves every future draft and scheduled post whose Lisbon time is <from> to <to> on the same day, keeping its status
// (a draft stays a draft, a scheduled post stays scheduled). Without --apply it only prints the plan.
// One paged read (50 posts per call) plus one edit per post, so ~120 posts fit Buffer's 250 calls/day.
// Buffer re-validates the whole post on edit, so the post's own text, media and Instagram settings are sent back unchanged.
import { dueAt as toIso } from "./lisbon.mjs";
const args = process.argv.slice(2);
const [from, to] = args;
const apply = args.includes("--apply");
const limit = args.includes("--limit") ? +args[args.indexOf("--limit") + 1] : Infinity;
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
if (!/^\d\d:\d\d$/.test(from || "") || !/^\d\d:\d\d$/.test(to || "")) { console.log("usage: retime-posts.mjs 19:00 15:00 [--apply]"); process.exit(1); }
const H = { authorization: `Bearer ${process.env.BUFFER_API_KEY}`, "content-type": "application/json" };
let left = "?";
const gql = async (query, variables) => {
  for (let tries = 0; ; tries++) {   // Buffer also caps calls per 15 minutes: wait it out instead of stopping
    const res = await fetch("https://api.buffer.com", { method: "POST", headers: H, body: JSON.stringify({ query, variables }) });
    left = res.headers.get("x-ratelimit-remaining") ?? left;
    const j = await res.json();
    if (j?.errors?.[0]?.extensions?.code !== "RATE_LIMIT_EXCEEDED" || tries >= 20) return j;
    console.log("rate limited, waiting 60 s"); await new Promise(z => setTimeout(z, 60000));
  }
};
const time = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Lisbon", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const day = d => new Date(d).toLocaleDateString("en-CA", { timeZone: "Europe/Lisbon" });

const org = (await gql(`{ account { organizations { id } } }`))?.data?.account?.organizations?.[0]?.id;
if (!org) { console.log("could not read the organisation"); process.exit(1); }
const CH = process.env.BUFFER_CHANNEL_ID;
const posts = [];
for (let after = null; ;) {
  const r = await gql(`query($after:String,$input:PostsInput!){ posts(first:50, after:$after, input:$input){ edges{ node{ id status dueAt text assets{ type source } metadata{ ... on InstagramPostMetadata { type shouldShareToFeed isAiGenerated } } } } pageInfo{ hasNextPage endCursor } } }`,
    { after, input: { organizationId: org, filter: { channelIds: [CH], status: ["draft", "scheduled"] }, sort: [{ field: "dueAt", direction: "asc" }] } });
  if (!r.data) { console.log("READ FAILED", JSON.stringify(r).slice(0, 300)); process.exit(1); }
  posts.push(...r.data.posts.edges.map(e => e.node));
  if (!r.data.posts.pageInfo.hasNextPage) break;
  after = r.data.posts.pageInfo.endCursor;
}
const now = Date.now();
const taken = new Set(posts.map(p => p.dueAt && `${day(p.dueAt)}@${time.format(new Date(p.dueAt))}`));
const todo = posts.filter(p => p.dueAt && Date.parse(p.dueAt) > now && time.format(new Date(p.dueAt)) === from && (!only || p.id === only));
console.log(`${todo.length} posts at ${from} Lisbon (${todo.filter(p => p.status === "scheduled").length} scheduled, ${todo.filter(p => p.status === "draft").length} drafts) → ${to}`);

let ok = 0, n = 0;
for (const p of todo) {
  if (n++ >= limit) break;
  const target = `${day(p.dueAt)}@${to}`;
  if (taken.has(target)) { console.log(`skip ${p.id}: another post is already at ${target}`); continue; }
  if (Date.parse(toIso(target)) <= now) { console.log(`skip ${p.id}: ${target} is already past`); continue; }
  if (!apply) { console.log(`plan ${p.id} ${p.status} ${day(p.dueAt)} ${from} → ${to}`); continue; }
  const m = p.metadata || {};
  const input = { id: p.id, text: p.text, mode: "customScheduled", dueAt: toIso(target), schedulingType: "automatic", aiAssisted: true, saveToDraft: p.status === "draft",
    metadata: { instagram: { type: m.type || "reel", shouldShareToFeed: m.shouldShareToFeed ?? true, isAiGenerated: m.isAiGenerated ?? true } },
    assets: p.assets.map(a => (a.type === "video" ? { video: { url: a.source, metadata: { thumbnailOffset: 400 } } } : { image: { url: a.source } })) };
  const r = await gql(`mutation($input: EditPostInput!){ editPost(input:$input){ __typename ... on PostActionSuccess { post { id status dueAt } } ... on MutationError { message } } }`, { input });
  const e = r?.data?.editPost;
  if (e?.post && e.post.status === p.status) { ok++; console.log(`${e.post.id} ${e.post.status} ${e.post.dueAt} (was ${p.dueAt})`); }
  else { console.log(`FAILED ${p.id}: ${JSON.stringify(e?.post || r).slice(0, 300)} — stopping`); break; }
}
console.log(apply ? `moved ${ok}; calls left today: ${left}` : `dry run; calls left today: ${left}`);
