// node gaps.mjs [days=14] [fromDate=today (YYYY-MM-DD, Lisbon)]
// The daily slots as Lisbon sees them: a reel at 09:00 and a carousel at 18:00. Shows which are filled (and whether the
// post is a draft, scheduled or sent), which are empty, and any post off-slot or sharing a time with another.
// Needs BUFFER_API_KEY and BUFFER_CHANNEL_ID.
const KEY = process.env.BUFFER_API_KEY, CH = process.env.BUFFER_CHANNEL_ID;
const days = +(process.argv[2] || 14);
const gql = async (query, variables) => (await fetch("https://api.buffer.com", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${KEY}` }, body: JSON.stringify({ query, variables }) })).json();

const local = iso => {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(iso)).map(x => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
};
const today = local(new Date().toISOString()).date;
const from = process.argv[3] || today;

const org = (await gql(`query{ account{ organizations{ id } } }`)).data.account.organizations[0].id;
let after = null; const posts = [];
for (let i = 0; i < 30; i++) {
  const r = await gql(`query($after:String,$input:PostsInput!){ posts(first:50, after:$after, input:$input){ edges{ node{ id status dueAt text } } pageInfo{ hasNextPage endCursor } } }`,
    { after, input: { organizationId: org, filter: { channelIds: [CH] }, sort: [{ field: "dueAt", direction: "desc" }] } });
  if (r.errors) { console.error(JSON.stringify(r.errors).slice(0, 400)); process.exit(1); }
  posts.push(...r.data.posts.edges.map(e => e.node));
  if (!r.data.posts.pageInfo.hasNextPage) break; after = r.data.posts.pageInfo.endCursor;
}

const withLocal = posts.map(p => ({ ...p, ...local(p.dueAt) })).map(p => ({ ...p, min: +p.time.slice(0, 2) * 60 + +p.time.slice(3, 5) }));
// a post within 10 minutes of the slot counts as being in it (Buffer publishes a few minutes late)
const slot = (ds, hour) => { const l = withLocal.filter(p => p.date === ds && Math.abs(p.min - hour * 60) <= 10); return l.length ? l : null; };
const exact = new Map(); for (const p of withLocal) { const k = `${p.date} ${p.time}`; (exact.get(k) || exact.set(k, []).get(k)).push(p); }
const cell = list => !list ? "—" : list.map(p => p.status).join("+") + (list.length > 1 ? "  ⚠ two posts" : "");
const dayName = d => new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", timeZone: "UTC" });

let emptyReel = 0, emptyCar = 0, firstReel = null, firstCar = null; const off = [];
console.log("date          reel 09:00        carousel 18:00");
for (let i = 0; i < days; i++) {
  const d = new Date(from + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + i); const ds = d.toISOString().slice(0, 10);
  const r = slot(ds, 9), c = slot(ds, 18);
  if (!r) { emptyReel++; firstReel ||= ds; } if (!c) { emptyCar++; firstCar ||= ds; }
  console.log(`${dayName(ds).padEnd(13)} ${cell(r).padEnd(17)} ${cell(c)}`);
}
for (const p of withLocal) if (p.date >= from && ![9, 18].some(h => Math.abs(p.min - h * 60) <= 10)) off.push(`${p.date} ${p.time}  ${p.status}  ${(p.text || "").slice(0, 40).replace(/\n/g, " ") || "(no caption — a story?)"}`);
for (const [k, list] of exact) if (list.length > 1 && k.slice(0, 10) >= from) off.push(`${k}  ⚠ ${list.length} posts at the same minute`);
console.log(`\nempty reel slots: ${emptyReel}${firstReel ? ` (first ${firstReel})` : ""}   empty carousel slots: ${emptyCar}${firstCar ? ` (first ${firstCar})` : ""}`);
if (off.length) console.log("off-slot posts:\n  " + off.sort().join("\n  "));
