import postgres from "../apps/social-api/node_modules/postgres/src/index.js";
import { eligibleReserveCards,loadEvergreenReserve,reserveEvidenceScore } from "../apps/social-api/dist/evergreen-reserve.js";

if(!process.env.DATABASE_URL)throw new Error("DATABASE_URL required");
const sql=postgres(process.env.DATABASE_URL,{max:1});
try{
  const cards=await loadEvergreenReserve();
  const urls=[...new Set(cards.map(card=>card.sourcePolicy.canonicalUrl))];
  const rows=await sql`SELECT DISTINCT ON (canonical_url) canonical_url AS "canonicalUrl",verified_at AS "verifiedAt",visible_text AS "visibleText" FROM social_reserve_evidence WHERE canonical_url IN ${sql(urls)} AND available=true ORDER BY canonical_url,verified_at DESC`;
  const evidence=rows.map(row=>({canonicalUrl:String(row.canonicalUrl),verifiedAt:String(row.verifiedAt),visibleText:String(row.visibleText)}));
  const recentRows=await sql`SELECT subject_family AS "subjectFamily",user_question AS "userQuestion",audience,content_intent AS "contentIntent",created_at AS "usedAt" FROM social_post WHERE created_at>now()-INTERVAL '90 days' AND status NOT IN ('blocked','rejected','failed')`;
  const recent=recentRows.map(row=>({subjectFamily:String(row.subjectFamily||""),userQuestion:String(row.userQuestion||""),audience:String(row.audience||""),contentIntent:String(row.contentIntent||""),usedAt:String(row.usedAt)}));
  const sourceSupported=cards.filter(card=>reserveEvidenceScore(card,evidence)>0);
  const unsupported=cards.filter(card=>reserveEvidenceScore(card,evidence)===0).map(card=>({id:card.id,pillar:card.subjectFamily,topic:card.topic,url:card.sourcePolicy.canonicalUrl,terms:card.evidenceTerms}));
  const eligible=eligibleReserveCards(cards,evidence,recent);
  const suppressedByRecent=sourceSupported.filter(card=>!eligible.some(item=>item.id===card.id));
  console.log(JSON.stringify({cards:cards.length,urls:urls.length,evidence:evidence.length,sourceSupported:sourceSupported.length,unsupported,recentPosts:recent.length,suppressedByRecent:suppressedByRecent.length,eligible:eligible.length,eligibleByPillar:Object.fromEntries(Object.entries(Object.groupBy(eligible,card=>card.subjectFamily)).map(([key,value])=>[key,value.length]))},null,2));
  if(sourceSupported.length!==cards.length)process.exitCode=1;
}finally{await sql.end({timeout:5});}
