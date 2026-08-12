import { readFile } from "node:fs/promises";

export type FactCard = { id:string; match:string[]; authority:string; sourceUrl:string; sourceTitle:string; facts:string[] };

export async function findFactCard(topic:string): Promise<FactCard|null> {
  const path=new URL("../../../config/simple-fact-cards.json",import.meta.url);
  const data=JSON.parse(await readFile(path,"utf8")) as {cards:FactCard[]};
  return data.cards.find(card=>card.match.some(term=>new RegExp(`(^|[^a-z0-9])${term.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}([^a-z0-9]|$)`,"i").test(topic)))??null;
}
