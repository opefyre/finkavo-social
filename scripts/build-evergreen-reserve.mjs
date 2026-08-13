import { readFile, writeFile } from "node:fs/promises";

const catalog=JSON.parse(await readFile(new URL("../plans/finkavo-editorial-catalog.json",import.meta.url),"utf8"));
const sources={
  identity_access:["https://www2.gov.pt/servicos/pedir-o-numero-de-identificacao-fiscal-para-pessoa-singular","gov.pt"],
  immigration_residency:["https://aima.gov.pt/pt/viver/autorizacao-de-residencia-regime-e-requisitos-gerais-art-o-77-o-n-o-1","AIMA"],
  citizenship_civil:["https://files.diariodarepublica.pt/1s/2024/03/04600/0000200019.pdf","Diário da República / Lei da Nacionalidade"],
  freelance_business:["https://www2.gov.pt/servicos/abrir-atividade-nas-financas","gov.pt / Autoridade Tributária"],
  iva:["https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/questoes_frequentes/pages/faqs-00924.aspx","Autoridade Tributária"],
  irs:["https://info.portaldasfinancas.gov.pt/pt/apoio_ao_contribuinte/Cidadaos/Rendimentos/Declaracao/Paginas/default.aspx","Autoridade Tributária"],
  social_security:["https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2009-34514575","Diário da República / Código Contributivo"],
  housing_property:["https://info.portaldasfinancas.gov.pt/pt/apoio_ao_contribuinte/Cidadaos/Casa_e_propriedades/Paginas/default.aspx","Autoridade Tributária"],
  banking_money:["https://www.bportugal.pt/sites/default/files/anexos/documentos-relacionados/international_bank_account_number_pt.pdf","Banco de Portugal"],
  employment:["https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2009-34514575","Diário da República / Código Contributivo"],
  health_family:["https://www2.gov.pt/pt/servicos/pedir-o-numero-de-utente-do-sns?p_p_resource_id=usefulinformationAction","gov.pt / SNS"],
  driving_transport:["https://www.imt-ip.pt/sites/IMTT/Portugues/Condutores/CartaConducao/Paginas/Carta-de-Conducao.aspx","IMT"],
  education_children:["https://www.dgeste.mec.pt/","DGEstE"],
  daily_life_consumer:["https://www.asae.gov.pt/reclamacoes-e-denuncias/livro-de-reclamacoes.aspx","ASAE / Livro de Reclamações"],
};
const cards=[];
for(const pillar of catalog.pillars){
  const [sourceUrl,authority]=sources[pillar.id];
  for(const [index,topic] of pillar.topics.slice(0,7).entries()) cards.push({
    id:`reserve-${pillar.id}-${String(index+1).padStart(2,"0")}`,
    subjectFamily:pillar.id,
    topic,
    userQuestion:`What does someone living in Portugal need to know about ${topic.toLowerCase()}?`,
    audience:pillar.audience,
    contentIntent:index%3===0?"evergreen_explainer":index%3===1?"checklist":"common_mistake",
    purpose:`Give ${pillar.audience} a complete practical answer about ${topic}.`,
    requiredAnswers:[`Explain ${topic} in plain English.`,`State the practical action or decision involved.`,`Clarify the main limitation, exception, or proof to retain.`],
    sourcePolicy:{canonicalUrl:sourceUrl,requiredAuthority:authority,officialRequired:true,freshnessDays:pillar.risk==="high"?7:pillar.risk==="medium"?30:90},
    evidenceTerms:[...new Set([topic,...pillar.terms])].slice(0,6),
    status:"available_when_live_evidence_matches",
  });
}
await writeFile(new URL("../config/evergreen-reserve.json",import.meta.url),`${JSON.stringify({version:1,generatedAt:new Date().toISOString(),minimum:90,cards},null,2)}\n`);
console.log(JSON.stringify({cards:cards.length,pillars:Object.fromEntries(Object.entries(Object.groupBy(cards,c=>c.subjectFamily)).map(([k,v])=>[k,v.length])),unique:new Set(cards.map(c=>[c.subjectFamily,c.userQuestion,c.audience,c.contentIntent].join("|").toLowerCase())).size},null,2));
