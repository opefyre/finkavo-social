import { readFile } from "node:fs/promises";

const plan=JSON.parse(await readFile(new URL("../plans/finkavo-rolling-year-2026-08-13.json",import.meta.url),"utf8"));
const rows=plan.rows.slice(0,450);
const errors=[];
if(rows.length!==450)errors.push(`Expected 450 rows, found ${rows.length}`);
const dates=new Map();
const identities=new Map();
for(const row of rows){
  dates.set(row.date,(dates.get(row.date)||0)+1);
  if(row.curationStatus!=="curated_90_day")errors.push(`${row.date}/${row.slot}: not curated`);
  const b=row.brief;
  if(!b||!b.subjectFamily||!b.userQuestion||!b.purpose||b.requiredAnswers?.length!==3)errors.push(`${row.date}/${row.slot}: incomplete brief`);
  if(!b?.sourcePolicy?.requiredAuthority||![7,30,90].includes(b.sourcePolicy.freshnessDays))errors.push(`${row.date}/${row.slot}: incomplete source policy`);
  if(row.risk!=="low"&&!b?.sourcePolicy?.officialRequired)errors.push(`${row.date}/${row.slot}: official source not required for ${row.risk}-risk brief`);
  if(/Corpus authority allowlist/i.test(b?.sourcePolicy?.requiredAuthority||""))errors.push(`${row.date}/${row.slot}: generic authority profile`);
  if(row.pillar==="social_security"&&/self-employment/i.test(row.title)&&/Código do Trabalho/.test(row.evidenceTerms))errors.push(`${row.date}/${row.slot}: employment-law terms misrouted to self-employment`);
  if(row.reserve==="breaking_news"&&!b?.fallback?.title)errors.push(`${row.date}/${row.slot}: missing named fallback`);
  const identity=[b?.subjectFamily,b?.userQuestion,row.audience,b?.contentIntent,b?.occurrenceKey||""].join("|").toLowerCase();
  if(identities.has(identity))errors.push(`${row.date}/${row.slot}: duplicate brief with ${identities.get(identity)}`); else identities.set(identity,`${row.date}/${row.slot}`);
}
for(const [date,count] of dates)if(count!==5)errors.push(`${date}: expected 5 slots, found ${count}`);
const mechanical=rows.filter(row=>/ — (?:first-time setup|renewal|family context|correction scenario|non-resident angle|document recovery)$/.test(row.title));
if(mechanical.length)errors.push(`${mechanical.length} mechanical suffixes remain`);
const highRiskByDay=Object.groupBy(rows.filter(row=>row.risk==="high"),row=>row.date);
for(const [date,items] of Object.entries(highRiskByDay))if(items.length>2)errors.push(`${date}: ${items.length} high-risk slots`);
const report={valid:errors.length===0,rows:rows.length,days:dates.size,uniqueIdentities:identities.size,newsFallbacks:rows.filter(r=>r.reserve==="breaking_news").length,dateLocked:rows.filter(r=>r.reserve==="date_locked").length,errors:errors.slice(0,100)};
console.log(JSON.stringify(report,null,2));
if(errors.length)process.exitCode=1;
