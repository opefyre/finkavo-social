import { readFile } from "node:fs/promises";
const data=JSON.parse(await readFile(new URL("../config/official-calendar-2026-2027.json",import.meta.url),"utf8"));
const errors=[];const keys=new Set();
for(const event of data.events){
  if(keys.has(event.key))errors.push(`duplicate key ${event.key}`);keys.add(event.key);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(event.date)||Number.isNaN(Date.parse(`${event.date}T12:00:00Z`)))errors.push(`${event.key}: invalid date`);
  const url=data.sources[event.source];if(!url)errors.push(`${event.key}: missing source`);
  else if(!/^https:\/\/(?:[^/]+\.)?(?:portaldasfinancas\.gov\.pt|seg-social\.pt|dgaep\.gov\.pt|portaleducacao\.gov\.pt)\//.test(url))errors.push(`${event.key}: source is not an allowed official domain`);
  if(event.status==="must_reverify"&&!/Do not publish|do not state/i.test(event.scope))errors.push(`${event.key}: missing publication hold`);
  if(!event.scope)errors.push(`${event.key}: missing applicability scope`);
}
const report={valid:!errors.length,events:data.events.length,confirmed:data.events.filter(e=>e.status==="confirmed"||e.status==="confirmed_rule").length,mustReverify:data.events.filter(e=>e.status==="must_reverify").length,errors};
console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
