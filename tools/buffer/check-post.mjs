// node check-post.mjs <postId...> — status, due time, asset type and hashtag count for each post.
const KEY=process.env.BUFFER_API_KEY;
for (const id of process.argv.slice(2)) {
 const r=await (await fetch("https://api.buffer.com",{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${KEY}`},body:JSON.stringify({query:`query($id:PostId!){post(input:{id:$id}){id status dueAt text assets{__typename} }}`,variables:{id}})})).json();
 const p=r.data.post; console.log(p.id,p.status,p.dueAt,p.assets.map(a=>a.__typename).join(","),"tags="+(p.text.match(/#[\p{L}\p{N}_]+/gu)||[]).length);
}
