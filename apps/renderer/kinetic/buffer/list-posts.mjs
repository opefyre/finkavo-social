// Lists every post on the channel (SINCE=YYYY-MM-DD limits it) with status counts. Needs BUFFER_API_KEY and BUFFER_CHANNEL_ID.
const KEY = process.env.BUFFER_API_KEY, CH = process.env.BUFFER_CHANNEL_ID;
const gql = async (query, variables) => {
  const r = await fetch("https://api.buffer.com", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${KEY}` }, body: JSON.stringify({ query, variables }) });
  const t = await r.text(); try { return JSON.parse(t); } catch { return { raw: t, status: r.status }; }
};
const org = await gql(`query{ account{ organizations{ id name } } }`);
console.log(JSON.stringify(org).slice(0,400));
const orgId = org?.data?.account?.organizations?.[0]?.id;
let after = null, all = [];
for (let i = 0; i < 20; i++) {
  const q = `query($after:String,$input:PostsInput!){ posts(first:50, after:$after, input:$input){ edges{ node{ id status dueAt sentAt text error{ message } assets{ __typename } } } pageInfo{ hasNextPage endCursor } } }`;
  const r = await gql(q, { after, input: { organizationId: orgId, filter: { channelIds: [CH] }, sort: [{ field: "dueAt", direction: "desc" }] } });
  if (r.errors) { console.log(JSON.stringify(r.errors).slice(0,600)); break; }
  const p = r.data.posts; all.push(...p.edges.map(e => e.node));
  if (!p.pageInfo.hasNextPage) break; after = p.pageInfo.endCursor;
}
console.log("total", all.length);
const by = {}; for (const p of all) by[p.status] = (by[p.status]||0)+1; console.log(JSON.stringify(by));
for (const p of all.filter(p => (p.dueAt||"") >= (process.env.SINCE || "2000")).sort((a,b)=>a.dueAt<b.dueAt?-1:1))
  console.log(p.dueAt, p.status, p.id, (p.error?.message||""), JSON.stringify((p.text||"").slice(0,110)));
