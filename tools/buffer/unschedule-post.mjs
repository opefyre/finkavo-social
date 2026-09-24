// node unschedule-post.mjs <postId…>
// Moves SCHEDULED posts back to DRAFT so they will not publish, keeping their text, media and time. Reversible: the owner can schedule them
// again in Buffer. It never deletes anything (permanent deletion is the owner's call).
// Buffer re-validates the whole post on edit, so the script reads the post and sends its own text, assets and Instagram settings back unchanged.
const H = { authorization: `Bearer ${process.env.BUFFER_API_KEY}`, "content-type": "application/json" };
const gql = async (query, variables) => (await (await fetch("https://api.buffer.com", { method: "POST", headers: H, body: JSON.stringify({ query, variables }) })).json());
for (const id of process.argv.slice(2)) {
  const g = await gql(`query($id: PostId!){ post(input:{id:$id}){ id status text dueAt assets{ type source } metadata{ ... on InstagramPostMetadata { type shouldShareToFeed isAiGenerated } } } }`, { id });
  const p = g?.data?.post;
  if (!p) { console.log(id, "NOT FOUND", JSON.stringify(g).slice(0, 200)); continue; }
  if (p.status !== "scheduled") { console.log(id, `skipped: status is ${p.status}, not scheduled`); continue; }
  const m = p.metadata || {};
  const input = { id, text: p.text, saveToDraft: true, mode: "customScheduled", dueAt: p.dueAt, schedulingType: "automatic", aiAssisted: true,
    metadata: { instagram: { type: m.type || "post", shouldShareToFeed: m.shouldShareToFeed ?? true, isAiGenerated: m.isAiGenerated ?? true } },
    assets: p.assets.map(a => (a.type === "video" ? { video: { url: a.source } } : { image: { url: a.source } })) };
  const r = await gql(`mutation($input: EditPostInput!){ editPost(input:$input){ __typename ... on PostActionSuccess { post { id status dueAt } } ... on MutationError { message } } }`, { input });
  const e = r?.data?.editPost;
  console.log(e?.post ? `${e.post.id} -> ${e.post.status} (was scheduled for ${p.dueAt})` : `${id} FAILED ${JSON.stringify(r).slice(0, 300)}`);
}
