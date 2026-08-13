import { readFile } from "node:fs/promises";

export type ReserveCard={id:string;subjectFamily:string;topic:string;userQuestion:string;audience:string;contentIntent:string;purpose:string;requiredAnswers:string[];sourcePolicy:{canonicalUrl:string;requiredAuthority:string;officialRequired:boolean;freshnessDays:number};evidenceTerms:string[];status:string};
export type ReserveEvidence={canonicalUrl:string;verifiedAt:string;visibleText?:string};
export type RecentReserveUse={subjectFamily:string;userQuestion:string;audience:string;contentIntent:string;usedAt:string};
const normalize=(value:string)=>value.toLocaleLowerCase("pt").normalize("NFD").replace(/[\u0300-\u036f]/g,"");

export function reserveEvidenceScore(card:ReserveCard,evidence:ReserveEvidence[]){
  const text=normalize(evidence.find(item=>item.canonicalUrl===card.sourcePolicy.canonicalUrl)?.visibleText||"");
  return card.evidenceTerms.reduce((score,term)=>{const normalized=normalize(term);return score+(normalized.length>=3&&text.includes(normalized)?Math.min(20,normalized.length):0);},0);
}

export async function loadEvergreenReserve():Promise<ReserveCard[]>{
  const data=JSON.parse(await readFile(new URL("../../../config/evergreen-reserve.json",import.meta.url),"utf8")) as {cards:ReserveCard[]};
  return data.cards;
}

export function eligibleReserveCards(cards:ReserveCard[],evidence:ReserveEvidence[],recent:RecentReserveUse[],now=new Date()){
  const latest=new Map<string,{time:number;text:string}>();for(const item of evidence){const time=new Date(item.verifiedAt).getTime();if(time>(latest.get(item.canonicalUrl)?.time||0))latest.set(item.canonicalUrl,{time,text:String(item.visibleText||"").toLocaleLowerCase("pt").normalize("NFD").replace(/[\u0300-\u036f]/g,"")});}
  return cards.filter(card=>{
    const evidenceItem=latest.get(card.sourcePolicy.canonicalUrl);if(!evidenceItem||now.getTime()-evidenceItem.time>card.sourcePolicy.freshnessDays*86_400_000)return false;
    if(evidenceItem.text){const terms=card.evidenceTerms.map(term=>term.toLocaleLowerCase("pt").normalize("NFD").replace(/[\u0300-\u036f]/g,"")).filter(term=>term.length>=3);if(!terms.some(term=>evidenceItem.text.includes(term)))return false;}
    return !recent.some(use=>use.subjectFamily===card.subjectFamily&&use.userQuestion===card.userQuestion&&use.audience===card.audience&&use.contentIntent===card.contentIntent&&now.getTime()-new Date(use.usedAt).getTime()<90*86_400_000);
  }).sort((a,b)=>reserveEvidenceScore(b,evidence)-reserveEvidenceScore(a,evidence)||a.id.localeCompare(b.id));
}
