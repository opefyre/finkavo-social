import { readFile } from "node:fs/promises";
const data=JSON.parse(await readFile(new URL("../config/evergreen-reserve.json",import.meta.url),"utf8"));
const errors=[];const identities=new Set();const pillars=new Map();
for(const card of data.cards){
  const identity=[card.subjectFamily,card.userQuestion,card.audience,card.contentIntent].join("|").toLowerCase();
  if(identities.has(identity))errors.push(`${card.id}: duplicate identity`);identities.add(identity);
  pillars.set(card.subjectFamily,(pillars.get(card.subjectFamily)||0)+1);
  if(!Array.isArray(card.requiredAnswers)||card.requiredAnswers.length<1||card.requiredAnswers.length>3)errors.push(`${card.id}: incomplete required answers`);
  if(!/^https:\/\//.test(card.sourcePolicy?.canonicalUrl||"")||!card.sourcePolicy?.officialRequired)errors.push(`${card.id}: non-canonical source policy`);
  if(![7,30,90].includes(card.sourcePolicy?.freshnessDays))errors.push(`${card.id}: invalid freshness`);
  if(!Array.isArray(card.evidenceTerms)||card.evidenceTerms.length<1)errors.push(`${card.id}: insufficient evidence terms`);
}
if(data.cards.length<90)errors.push(`only ${data.cards.length} cards`);
if(pillars.size!==14)errors.push(`only ${pillars.size} pillars`);
for(const [pillar,count] of pillars)if(count<6)errors.push(`${pillar}: only ${count} cards`);
console.log(JSON.stringify({valid:!errors.length,cards:data.cards.length,uniqueIdentities:identities.size,pillars:Object.fromEntries(pillars),errors},null,2));if(errors.length)process.exitCode=1;
