import { readFile } from "node:fs/promises";

export type ReserveCard={id:string;subjectFamily:string;topic:string;userQuestion:string;audience:string;contentIntent:string;purpose:string;requiredAnswers:string[];sourcePolicy:{canonicalUrl:string;requiredAuthority:string;officialRequired:boolean;freshnessDays:number};evidenceTerms:string[];status:string};
export type ReserveEvidence={canonicalUrl:string;verifiedAt:string};
export type RecentReserveUse={subjectFamily:string;userQuestion:string;audience:string;contentIntent:string;usedAt:string};

export async function loadEvergreenReserve():Promise<ReserveCard[]>{
  const data=JSON.parse(await readFile(new URL("../../../config/evergreen-reserve.json",import.meta.url),"utf8")) as {cards:ReserveCard[]};
  return data.cards;
}

export function eligibleReserveCards(cards:ReserveCard[],evidence:ReserveEvidence[],recent:RecentReserveUse[],now=new Date()){
  const latest=new Map<string,number>();for(const item of evidence){const time=new Date(item.verifiedAt).getTime();if(time>(latest.get(item.canonicalUrl)||0))latest.set(item.canonicalUrl,time);}
  return cards.filter(card=>{
    const verified=latest.get(card.sourcePolicy.canonicalUrl);if(!verified||now.getTime()-verified>card.sourcePolicy.freshnessDays*86_400_000)return false;
    return !recent.some(use=>use.subjectFamily===card.subjectFamily&&use.userQuestion===card.userQuestion&&use.audience===card.audience&&use.contentIntent===card.contentIntent&&now.getTime()-new Date(use.usedAt).getTime()<90*86_400_000);
  });
}
