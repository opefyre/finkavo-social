import { readFile, writeFile } from "node:fs/promises";

const catalog=JSON.parse(await readFile(new URL("../plans/finkavo-editorial-catalog.json",import.meta.url),"utf8"));
const pillarById=new Map(catalog.pillars.map(pillar=>[pillar.id,pillar]));
const source=(canonicalUrl,requiredAuthority)=>({canonicalUrl,requiredAuthority,officialRequired:true});
const f=(topic,userQuestion,requiredAnswer,evidenceTerms,sourcePolicy)=>({topic,userQuestion,requiredAnswer,evidenceTerms,sourcePolicy});

// Every brief below is deliberately narrower than its source page. A card is eligible only
// when its own evidence terms are present in a current snapshot of its exact canonical URL.
const profiles={
  identity_access:{source:source("https://www2.gov.pt/servicos/pedir-o-numero-de-identificacao-fiscal-para-pessoa-singular","gov.pt / Autoridade Tributária"),facts:[
    f("Why a NIF is used in Portugal","What everyday activities require a Portuguese NIF?","Explain the listed uses for a NIF.",["comprar bens ou serviços","fazer contratos","abrir contas bancárias"]),
    f("Who can request a Portuguese NIF","Can residents and non-residents both request a NIF?","State who may request a NIF.",["residente ou não residente","pode pedir"]),
    f("NIF and the Portuguese Citizen Card","Does a Citizen Card holder need to request a NIF separately?","Explain automatic NIF assignment with a Citizen Card.",["Cartão de Cidadão","atribuído automaticamente"]),
    f("When Portugal considers someone resident for NIF purposes","Which residence indicators does the NIF service list?","Summarise the residence indicators listed by gov.pt.",["mais de 183 dias","habitação permanente","atividade profissional"]),
    f("When you can request a NIF","Is there a fixed application window for requesting a NIF?","State when the NIF may be requested.",["a qualquer momento"]),
    f("Replacing a lost taxpayer card","What official route is listed when a taxpayer card is lost or stolen?","Point to the official replacement route.",["perda","extravio","2.ª via"]),
    f("Tax representatives and NIF applications","Where does gov.pt direct people for tax-representative information?","Explain that representative rules need the linked official guidance.",["representante fiscal","Informação adicional"]),
  ]},
  immigration_residency:{source:source("https://aima.gov.pt/pt/viver/autorizacao-de-residencia-regime-e-requisitos-gerais-art-o-77-o-n-o-1","AIMA"),facts:[
    f("How a general residence-permit application is submitted","How does AIMA say a general residence-permit request is submitted?","Explain the appointment and in-person submission route.",["mediante agendamento","entregue presencialmente"]),
    f("Core documents for a general residence permit","Which core identity and visa documents does AIMA list?","List the passport and valid residence-visa requirements.",["Passaporte","Visto de residência válido"]),
    f("Proving an address to AIMA as an owner","What address proof does AIMA list for an owner or usufructuary?","Explain the land-registry certificate or access-code proof.",["certidão de registo predial","código de acesso","proprietário"]),
    f("Proving an address to AIMA as a tenant","What address proof does AIMA list for a tenant?","Explain the landlord or accommodation-provider declaration.",["arrendatário","declaração do senhorio","entidade alojadora"]),
    f("Tax and Social Security registration in a residence application","When can AIMA ask for tax and Social Security registration proof?","State that each proof is listed when applicable.",["administração fiscal","segurança social","se aplicável"]),
    f("Health coverage proof for a residence application","What health-coverage evidence does AIMA list?","Explain the insurance or SNS-coverage alternatives.",["Seguro de saúde","Serviço Nacional de Saúde"]),
    f("Validity of a general temporary residence permit","How long does AIMA say the general temporary permit and renewals last?","State the two-year initial and three-year renewal periods.",["período de dois anos","períodos sucessivos de três anos"]),
  ]},
  citizenship_civil:{source:source("https://irn.justica.gov.pt/Nacionalidade/Naturalizacao","IRN / Justiça"),facts:[
    f("Portuguese nationality through naturalisation","What is the official naturalisation route for Portuguese nationality?","Explain the route at a high level without inferring eligibility.",["Naturalização","nacionalidade"]),
    f("Nationality by legal residence","Where does IRN explain nationality based on legal residence?","Identify the official legal-residence route.",["residência legal","Naturalização"]),
    f("Documents for a naturalisation request","Where should applicants verify the documents for naturalisation?","Direct readers to the IRN document requirements.",["documentos","pedido"]),
    f("Submitting a Portuguese nationality request","Which official authority handles a naturalisation request?","Identify IRN as the official process owner.",["IRN","Naturalização"]),
    f("Checking the correct nationality pathway","Why should applicants select the exact IRN nationality route first?","Explain that requirements depend on the official route selected.",["Nacionalidade","aquisição"]),
    f("Legal basis for Portuguese nationality requests","Which current nationality laws does the official page flag?","Point readers to the current nationality law and regulation named on the page.",["Lei da Nacionalidade","Regulamento da Nacionalidade Portuguesa"]),
    f("Avoiding unofficial nationality checklists","What should be checked before relying on a nationality checklist?","Tell readers to compare it with the current IRN route.",["IRN","documentos","Nacionalidade"]),
  ]},
  freelance_business:{source:source("https://www2.gov.pt/servicos/abrir-atividade-nas-financas","gov.pt / Autoridade Tributária"),facts:[
    f("Who needs to open freelance activity","Who does gov.pt say must open activity with Finanças?","Identify independent workers and people with side activity.",["trabalhador independente","atividade extra"]),
    f("The declaration that starts freelance activity","Which declaration opens independent activity?","Name the declaration of beginning of activity.",["declaração de início de atividade"]),
    f("When to open freelance activity","What is the latest day to open activity?","State the official timing rule.",["Antes de iniciar","próprio dia"]),
    f("Freelancing alongside employment","Can the opening-activity service cover a side activity alongside employment?","Explain that simultaneous employed work is included.",["simultâneo","trabalho por conta de outrem"]),
    f("Official guidance linked from the opening-activity service","Which official supporting documents does gov.pt list?","Name the leaflet and opening-activity manual.",["Folheto","Manual de Início de Atividade"]),
    f("Authority responsible for opening activity","Which authority owns the opening-activity service?","Identify the Autoridade Tributária e Aduaneira.",["Autoridade Tributária e Aduaneira"]),
    f("Opening activity before issuing freelance work","What administrative step comes before starting independent work?","Explain that activity must be opened before the work starts.",["abrir atividade","Antes de iniciar"]),
  ]},
  iva:{source:source("https://www2.gov.pt/cidadaos-europeus-viajar-viver-e-fazer-negocios-em-portugal/impostos-para-atividades-economicas-em-portugal/imposto-sobre-valor-acrescentado-iva-em-portugal","gov.pt / Autoridade Tributária"),facts:[
    f("What Portuguese IVA applies to","What kinds of transactions does the official IVA guide cover?","Explain the scope stated by gov.pt.",["IVA","bens","serviços"]),
    f("Who charges IVA","How does the official guide describe businesses that charge IVA?","Explain the taxable-person context supported by the page.",["sujeito passivo","IVA"]),
    f("Portuguese mainland IVA rates","Which mainland IVA rate categories are listed?","State only the current rate categories present in the source.",["taxa normal","taxa intermédia","taxa reduzida"]),
    f("IVA rates in Madeira and the Azores","Why must location be checked before applying an IVA rate?","Explain that regional rates differ, using the source values.",["Madeira","Açores","taxa"]),
    f("Article 9 IVA exemption","What kind of IVA exemption does Article 9 cover at a high level?","Explain the nature-based exemption examples present in the guide.",["artigo 9","isenção","saúde","educação"]),
    f("Article 53 IVA exemption","What does the guide say Article 53 exemption depends on?","Explain the turnover and activity conditions stated in the source.",["artigo 53","volume de negócios","isenção"]),
    f("What happens to IVA collected from a customer","What must a non-exempt independent worker do with charged IVA?","Explain that charged IVA is delivered to the state.",["cobra ao cliente","entregue ao Estado"],source("https://www.gov.pt/guias/trabalhar-por-conta-propria-guia-para-trabalhadores-independentes/obrigacoes-fiscais-e-pagamentos-impostos-e-contribuicoes","gov.pt / Autoridade Tributária")),
  ]},
  irs:{source:source("https://info.portaldasfinancas.gov.pt/pt/apoio_ao_contribuinte/Cidadaos/Rendimentos/Declaracao/Paginas/default.aspx","Autoridade Tributária"),facts:[
    f("The official IRS declaration hub","Where should someone start checking current IRS filing information?","Identify the AT declaration hub.",["Declaração","Autoridade Tributária"]),
    f("Finding Modelo 3 guidance","Where does AT group its Modelo 3 information?","Point to Modelo 3 in the official declaration hub.",["Modelo 3"]),
    f("Finding Automatic IRS guidance","Where can taxpayers verify Automatic IRS information?","Point to the IRS automático section.",["IRS automático"]),
    f("Finding IRS filing deadlines","Where does AT publish the main IRS declaration deadlines?","Point to the Principais Prazos section and avoid inventing dates.",["Principais Prazos"]),
    f("Finding IRS filing exemptions","Where can taxpayers check whether a filing exemption may apply?","Point to the official exemption section.",["Dispensa de entrega","declaração de IRS"]),
    f("Checking e-Fatura before IRS filing","Which official expense system is linked from the IRS declaration hub?","Identify e-Fatura as the linked official area.",["e-Fatura"]),
    f("Finding IRS deductions and benefits","Where does AT group deduction and tax-benefit information?","Point to the deductions and benefits section.",["Deduções","benefícios fiscais"]),
  ]},
  social_security:{source:source("https://www.gov.pt/guias/trabalhar-por-conta-propria-guia-para-trabalhadores-independentes/obrigacoes-fiscais-e-pagamentos-impostos-e-contribuicoes","gov.pt / Segurança Social"),facts:[
    f("Why independent workers contribute to Social Security","What protection does the official guide associate with contributions?","Explain the social protections listed by gov.pt.",["doença","parentalidade","reforma"]),
    f("How independent-worker contributions are calculated","Which income basis does the current guide use in its example rule?","Explain only the current calculation basis stated by gov.pt.",["rendimento médio trimestral","contribuições"]),
    f("Quarterly declarations for independent workers","What is the purpose of the quarterly Social Security declaration?","Explain the declaration using the guide's wording.",["declaração trimestral","rendimentos"]),
    f("Relevant income for independent-worker contributions","Which income measure does the guide use for Social Security contributions?","Explain the relevant quarterly income measure in the source.",["rendimento médio trimestral","Segurança Social"]),
    f("The first-year Social Security exemption","What first-year exemption does the current guide describe?","Explain only the exemption and opt-in choice stated by gov.pt.",["12 meses","isenção"]),
    f("Monthly Social Security deductions for independent workers","Does the guide describe Social Security deductions as monthly?","Explain the monthly contribution cadence.",["descontos mensais","Segurança Social"]),
    f("Independent work alongside an employment contract","When does the guide discuss exemption while combining both work types?","Summarise only the conditions stated in the current guide.",["contrato de trabalho","isenção"]),
  ]},
  housing_property:{source:source("https://info.portaldasfinancas.gov.pt/pt/apoio_ao_contribuinte/Cidadaos/Casa_e_propriedades/Paginas/default.aspx","Autoridade Tributária"),facts:[
    f("The official tax hub for homes and property","Where should property owners start checking Portuguese tax information?","Identify the AT Casa e propriedades hub.",["Casa e propriedades"]),
    f("Finding rental-contract tax guidance","Where does AT group information about urban rental contracts?","Point to the Contrato urbano section.",["Arrendamento","Contrato urbano"]),
    f("Finding official rental-receipt guidance","Where does AT group rental-receipt information?","Point to the Recibos section in the property hub.",["Arrendamento","Recibos"]),
    f("Finding property certificates and proof","Where does AT group property certificates and proof?","Point to Certidões e comprovativos.",["Certidões e comprovativos"]),
    f("Finding home-purchase tax information","Where does AT group tax information for buying a home?","Point to Compra da casa.",["Compra da casa"]),
    f("Finding IMI information","Where can owners verify the current annual IMI rules?","Point to the annual-tax area without inventing dates or rates.",["Imposto anual","IMI"]),
    f("Finding AIMI information","Where can owners verify current AIMI information?","Point to the annual-tax area without inventing thresholds.",["AIMI","Imposto anual"]),
  ]},
  banking_money:{source:source("https://clientebancario.bportugal.pt/en/how-order-transfers","Banco de Portugal"),facts:[
    f("Channels for ordering a bank transfer","Where can a standard or instant transfer be ordered?","List the branch and digital channels in the official guide.",["branches","homebanking","smartphone app"]),
    f("Payer details needed for a transfer","Which payer details can a payment provider request?","Explain the payer name and account IBAN fields.",["Their data","IBAN of their payment account"]),
    f("The amount field in a bank transfer","Which transaction amount must the payer provide?","Identify the amount of the credit transfer as required data.",["amount of the credit transfer"]),
    f("Ways to identify a transfer beneficiary","Which identifiers can be used for the payee?","Explain the IBAN and SPIN identifier alternatives.",["payee’s payment account","mobile phone number","tax identification number"]),
    f("Linking an identifier to SPIN","What must a recipient link before receiving transfers through SPIN?","Explain the identifier-to-IBAN link.",["link their mobile phone number","NIF","IBAN"]),
    f("The structure of a Portuguese IBAN","How many characters does a Portuguese IBAN have and how does it begin?","State the 25-character and PT50 structure.",["25 characters","begins with PT50"]),
    f("Confirming the payee before a transfer","What confirmation appears after entering a payee identifier?","Explain the account-holder name confirmation.",["name of the first account holder","payee confirmation"]),
  ]},
  employment:{source:source("https://www.gov.pt/guias/trabalhar-em-portugal","gov.pt / ACT"),facts:[
    f("What an employment contract should establish","What core employment relationship details should a worker identify?","Summarise the contract details present in the guide.",["contrato de trabalho","trabalhador","empregador"]),
    f("Written information from a Portuguese employer","What employment information must be communicated to a worker?","Explain the written-information duty in the guide.",["informação","trabalhador","empregador"]),
    f("Working time in Portugal","Where should workers verify normal working-time rules?","Summarise only the working-time rule in the guide.",["horário de trabalho","período normal"]),
    f("Annual leave in Portugal","What does the official work guide say about annual leave?","Explain the annual-leave entitlement stated in the source.",["férias","dias úteis"]),
    f("Holiday and Christmas allowances","Which annual allowances does the guide identify?","Explain the holiday and Christmas allowances in the source.",["subsídio de férias","subsídio de Natal"]),
    f("Ending an employment contract","Where does the guide explain ways an employment contract can end?","Summarise only the termination routes in the source.",["cessação","contrato de trabalho"]),
    f("Where to get help with employment rights","Which official authority does the guide identify for labour information?","Point readers to ACT.",["Autoridade para as Condições do Trabalho","ACT"]),
  ]},
  health_family:{source:source("https://www2.gov.pt/pt/servicos/pedir-o-numero-de-utente-do-sns?p_p_resource_id=usefulinformationAction","gov.pt / SNS"),facts:[
    f("What an SNS user number is for","Who receives an SNS user number?","Explain the stated purpose of the number.",["número nacional de utente","cuidados de saúde"]),
    f("SNS numbers for Portuguese citizens","How do Portuguese Citizen Card applicants receive an SNS number?","Explain automatic assignment with the Citizen Card.",["Cartão de Cidadão","automática"]),
    f("SNS numbers for foreign residents","When is an SNS number assigned to a foreign person?","Explain assignment at the first public-health visit.",["pessoas estrangeiras","primeira vez","centro de saúde ou hospital"]),
    f("Where a foreign person can obtain an SNS number","Which public-health locations can assign the number?","Name the centre or hospital channels stated.",["centro de saúde","hospital"]),
    f("Cost of obtaining an SNS user number","What fee does gov.pt list for the service?","State that the service is free.",["Gratuito"]),
    f("SNS number versus healthcare-cost coverage","Does having an SNS number itself guarantee cost coverage?","Explain the explicit limitation.",["não garante","cobertura das despesas"]),
    f("Finding a nearby SNS-number service point","How does gov.pt help users locate an in-person service point?","Explain the district and municipality search route.",["ponto de atendimento","Distrito","Concelho"]),
  ]},
  driving_transport:{source:source("https://www.imt-ip.pt/sites/IMTT/Portugues/Condutores/CartaConducao/Paginas/Carta-de-Conducao.aspx","IMT"),facts:[
    f("Finding the correct IMT driving-licence service","Where does IMT group services for drivers?","Explain the Tudo para Conduzir navigation route.",["Tudo para Conduzir","Sou Condutor"]),
    f("Foreign driving-licence exchanges","Where does IMT direct holders of foreign licences?","Point to Troca de Título de Condução Estrangeiro.",["Troca de Título de Condução Estrangeiro"]),
    f("Renewing a Portuguese driving licence","Where does IMT group licence-renewal information?","Point to Revalidação da Carta de Condução.",["Revalidação da Carta de Condução"]),
    f("Replacing a Portuguese driving licence","Where does IMT group duplicate-licence requests?","Point to Emissão de 2ª Via.",["Emissão de 2ª Via"]),
    f("Getting a driving-licence authenticity certificate","Which IMT service covers proof of licence authenticity?","Point to Certidão de Autenticidade.",["Certidão de Autenticidade"]),
    f("Getting an international driving permit","Where does IMT group international-permit information?","Point to Licença Internacional de Condução.",["Licença Internacional de Condução"]),
    f("Finding official vehicle-registration services","Where does IMT group vehicle registration and ownership services?","Point to the vehicle certificate and registration areas.",["Certificado Matrícula","Registo de Propriedade"]),
  ]},
  education_children:{source:source("https://www2.gov.pt/migrantes-viver-e-trabalhar-em-portugal/migrantes-ensino-em-portugal-para-criancas-jovens-e-adultos","gov.pt"),facts:[
    f("How Portugal organises school education","Which education levels does the migrant education guide describe?","Summarise the levels listed by gov.pt.",["ensino básico","ensino secundário"]),
    f("Compulsory schooling in Portugal","Which ages or stages does the guide describe as compulsory?","State only the compulsory-schooling rule in the source.",["escolaridade obrigatória","18 anos"]),
    f("Enrolling a newly arrived child in school","Where does the official migrant guide direct families for enrolment?","Explain the official enrolment route in the guide.",["matrícula","escola"]),
    f("Portuguese support for newly arrived students","What language support does the guide identify for non-native speakers?","Explain the Portuguese non-native-language support.",["Português Língua Não Materna","PLNM"]),
    f("Using foreign school records in Portugal","What does the guide say about equivalence of foreign qualifications?","Explain that school records may require equivalence.",["equivalência","habilitações estrangeiras"]),
    f("Adult education routes for migrants","Which adult-learning options does the guide identify?","Summarise only the adult routes named in the source.",["adultos","educação e formação"]),
    f("Finding official help with school placement","Which public education services does the guide identify?","Point to the official education contacts in the guide.",["educação","serviços"]),
  ]},
  daily_life_consumer:{source:source("https://www.asae.gov.pt/reclamacoes-e-denuncias/livro-de-reclamacoes.aspx","ASAE / Livro de Reclamações"),facts:[
    f("What Portugal's complaints book is","What is the Livro de Reclamações used for?","Explain its consumer-complaint purpose.",["Livro de Reclamações","reclamação"]),
    f("Physical and electronic complaints books","Which complaints-book formats are officially recognised?","Explain the physical and electronic formats.",["formato físico","formato eletrónico"]),
    f("When a business must provide the complaints book","What access obligation does the official page describe?","Explain the obligation without inventing exceptions.",["disponibilizar","Livro de Reclamações"]),
    f("Submitting an electronic consumer complaint","Where should an electronic complaint be submitted?","Point to the official electronic complaints-book route.",["Livro de Reclamações Eletrónico","plataforma"]),
    f("Information to keep with a consumer complaint","What transaction information should a consumer preserve?","List only the proof identified in the official guidance.",["comprovativo","reclamação"]),
    f("Complaint versus report to ASAE","How does the official page distinguish complaints and reports?","Explain only the distinction present in the source.",["reclamações","denúncias"]),
    f("Following the official complaints process","Why should consumers use the official complaints channel?","Explain the authority-routing function stated by ASAE.",["entidade competente","Livro de Reclamações"]),
  ]},
};

const cards=[];
for(const [pillarId,profile] of Object.entries(profiles)){
  const pillar=pillarById.get(pillarId);if(!pillar)throw new Error(`Unknown pillar ${pillarId}`);
  if(profile.facts.length!==7)throw new Error(`${pillarId} must have exactly seven curated reserve briefs`);
  for(const [index,fact] of profile.facts.entries()){
    const sourcePolicy={...(fact.sourcePolicy||profile.source),freshnessDays:pillar.risk==="high"?7:pillar.risk==="medium"?30:90};
    cards.push({id:`reserve-${pillarId}-${String(index+1).padStart(2,"0")}`,subjectFamily:pillarId,topic:fact.topic,userQuestion:fact.userQuestion,audience:pillar.audience,contentIntent:["evergreen_explainer","checklist","common_mistake"][index%3],purpose:`Give ${pillar.audience} one source-backed practical answer to: ${fact.userQuestion}`,requiredAnswers:[fact.requiredAnswer],sourcePolicy,evidenceTerms:fact.evidenceTerms,status:"available_when_exact_source_answers_brief"});
  }
}
const identities=cards.map(card=>[card.subjectFamily,card.userQuestion,card.audience,card.contentIntent].join("|").toLowerCase());
if(cards.length<90||new Set(identities).size!==cards.length)throw new Error("Reserve must contain at least 90 unique editorial identities");
await writeFile(new URL("../config/evergreen-reserve.json",import.meta.url),`${JSON.stringify({version:2,generatedAt:new Date().toISOString(),minimum:90,cards},null,2)}\n`);
console.log(JSON.stringify({cards:cards.length,pillars:Object.fromEntries(Object.entries(Object.groupBy(cards,c=>c.subjectFamily)).map(([key,value])=>[key,value.length])),unique:new Set(identities).size},null,2));
