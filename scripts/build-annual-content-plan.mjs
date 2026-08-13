import { mkdir, readFile, writeFile } from "node:fs/promises";

const start = new Date("2026-08-13T12:00:00Z");
const days = 365;
const slots = ["08:30", "11:30", "14:30", "18:00", "21:00"];
const angles = [
  ["foundation", "{topic}: a plain-English explanation"],
  ["action", "{topic}: a practical step-by-step checklist"],
  ["edge_case", "{topic}: mistakes, exceptions and edge cases"],
  ["audience", "{topic} for {audience}"],
  ["golden_tip", "{topic}: one golden tip and what to verify"],
];

const pillars = [
  { id: "identity_access", audience: "new residents", risk: "medium", terms: ["NIF", "NISS", "Chave Móvel Digital", "Portal das Finanças", "Segurança Social Direta"], topics: [
    "What a Portuguese NIF is", "Getting a NIF as a resident", "Getting a NIF before moving", "Finding your NIF on official documents", "Changing the address linked to your NIF", "Tax representation and when it applies", "What a NISS is", "Requesting a NISS", "Recovering Portal das Finanças access", "Changing the temporary Finanças password", "Confirming email and mobile contacts on Finanças", "What Chave Móvel Digital does", "Activating Chave Móvel Digital", "Using gov.pt authentication", "Keeping digital copies of Portuguese documents"
  ]},
  { id: "immigration_residency", audience: "international residents", risk: "high", terms: ["AIMA", "autorização de residência", "visto", "reagrupamento familiar", "CPLP"], topics: [
    "Visa versus residence permit", "Residence title versus EU registration certificate", "Preparing for an AIMA appointment", "Residence renewal preparation", "Using the AIMA renewals portal", "Family reunification basics", "D7 residence route", "D8 digital-nomad route", "D2 entrepreneur route", "D3 highly qualified route", "CPLP residence documentation", "Long-term resident status", "Changing address during an immigration process", "Replacing a lost residence document", "Checking AIMA fees safely", "Recognising fake appointment websites", "When an application file is incomplete", "Keeping evidence of an immigration submission"
  ]},
  { id: "citizenship_civil", audience: "residents building a long-term life", risk: "high", terms: ["IRN", "cidadania", "nacionalidade", "registo civil", "Nascer Cidadão"], topics: [
    "Residence and citizenship are different processes", "Portuguese citizenship document checklist", "Counting legal residence time", "Birth registration in Portugal", "Nascer Cidadão service", "Marriage registration", "Requesting Portuguese civil certificates", "Apostilles and foreign documents", "Certified translations", "Name differences across foreign documents", "Tracking an IRN application", "Citizenship scams and unrealistic promises"
  ]},
  { id: "freelance_business", audience: "freelancers and solo founders", risk: "high", terms: ["trabalhador independente", "abrir atividade", "recibos verdes", "CAE", "CIRS"], topics: [
    "Opening freelance activity in Portugal", "Choosing a CAE or CIRS activity code", "Changing an activity code later", "Simplified accounting versus organised accounting", "What recibos verdes are", "Invoice, invoice-receipt and receipt differences", "Correcting a Portuguese invoice", "Closing freelance activity", "Restarting a closed activity", "Working with one main client", "Freelancing while employed", "Starting a small company versus freelancing", "Business expense record keeping", "Using certified invoicing software", "Invoicing foreign clients", "Proof to retain after opening activity", "When to speak with a certified accountant"
  ]},
  { id: "iva", audience: "freelancers and small businesses", risk: "high", terms: ["IVA", "CIVA", "artigo 53", "declaração periódica", "VIES"], topics: [
    "What IVA is", "Article 53 IVA exemption", "Monitoring the IVA exemption threshold", "Entering the normal IVA regime", "Leaving the IVA exemption", "Monthly versus quarterly IVA", "Quarterly IVA declaration basics", "Paying IVA after filing", "Correcting an IVA declaration", "Invoicing an EU business customer", "Checking a customer in VIES", "Reverse charge wording", "Invoicing a non-EU customer", "IVA on digital services", "IVA when buying business services abroad", "Keeping IVA evidence", "IVA after ceasing activity", "When property transactions involve IVA"
  ]},
  { id: "irs", audience: "people filing personal income tax", risk: "high", terms: ["IRS", "Modelo 3", "e-Fatura", "Anexo J", "IRS Automático"], topics: [
    "What Portuguese IRS is", "Who normally files Modelo 3", "Tax residence and IRS", "Preparing for IRS season", "Checking household information before IRS", "Validating e-Fatura expenses", "Reviewing automatic IRS", "Submitting Modelo 3", "Correcting an IRS return", "Foreign income and Anexo J", "Foreign bank accounts in Anexo J", "Rental income and IRS", "Freelance income and IRS", "Employment income and IRS", "Capital gains basics", "Receiving an IRS assessment", "Understanding an IRS refund", "Paying an IRS balance", "Keeping an IRS submission receipt", "What to do after missing the filing window", "IRS Jovem basics", "Tax deductions versus tax credits"
  ]},
  { id: "social_security", audience: "workers and freelancers", risk: "high", terms: ["Segurança Social", "declaração trimestral", "contribuições", "NISS", "desemprego"], topics: [
    "What Portuguese Social Security covers", "Registering as a self-employed worker", "First-year Social Security treatment", "Quarterly Social Security declarations", "Income included in a quarterly declaration", "Correcting a quarterly declaration", "Keeping proof of a quarterly declaration", "Calculating relevant self-employed income", "Monthly contribution payments", "Freelancing while employed", "Social Security contribution exemptions", "Stopping or suspending self-employment", "Checking contribution history", "Getting a contribution statement", "Voluntary Social Security", "Employee Social Security deductions", "Unemployment-benefit basics", "Sickness-benefit basics", "Parental-benefit basics", "Portable A1 certificates"
  ]},
  { id: "housing_property", audience: "renters and property owners", risk: "high", terms: ["arrendamento", "IMI", "AIMI", "IMT", "imóvel", "habitação"], topics: [
    "Reading a Portuguese rental contract", "Registering a rental contract", "Rental receipts", "Security deposits and records", "Proof of address for renters", "Changing utilities after moving", "What IMI is", "IMI payment instalments", "Temporary IMI exemptions", "What AIMI is", "What IMT is", "Stamp duty on property purchases", "Budgeting purchase transaction costs", "Property tax value versus market value", "Updating property ownership records", "Buying a primary residence", "Buying as a non-resident", "Selling a Portuguese property", "Rental income records", "Condominium documents", "Energy certificates", "Municipal property differences"
  ]},
  { id: "banking_money", audience: "people managing money in Portugal", risk: "medium", terms: ["Banco de Portugal", "SEPA", "conta bancária", "IBAN", "crédito"], topics: [
    "Opening a Portuguese bank account", "Resident versus non-resident bank accounts", "Documents banks request", "Understanding Portuguese IBANs", "SEPA transfers", "Direct debits", "Multibanco payments", "Paying the state through Multibanco", "MB WAY basics", "Bank fees and account packages", "Basic bank accounts", "Changing banks", "Closing a bank account", "Keeping proof of bank transfers", "Avoiding payment-reference scams", "Foreign bank accounts and Portuguese tax", "Credit reports at Banco de Portugal", "Mortgage preparation", "Variable versus fixed mortgage rates", "Deposit protection basics", "IBAN discrimination", "Currency-conversion costs"
  ]},
  { id: "employment", audience: "employees and job seekers", risk: "medium", terms: ["contrato de trabalho", "emprego", "salário", "férias", "desemprego"], topics: [
    "Reading a Portuguese employment contract", "Gross salary versus take-home pay", "Meal allowance", "Holiday and Christmas allowances", "Payslip basics", "Probation periods", "Fixed-term versus permanent contracts", "Working-time records", "Annual leave basics", "Public holidays and work", "Sick leave steps", "Ending an employment contract", "Keeping employment documents", "Registering with IEFP", "Unemployment-benefit preparation", "Remote work from Portugal", "Working for a foreign employer", "Employee plus freelance income", "Recognising unpaid-trial scams"
  ]},
  { id: "health_family", audience: "individuals and families", risk: "medium", terms: ["SNS", "centro de saúde", "médico de família", "nascimento", "família"], topics: [
    "Registering with the SNS", "Getting an SNS user number", "Registering at a health centre", "Requesting or changing a family doctor", "Using SNS 24", "Electronic prescriptions", "European Health Insurance Card", "S1 healthcare registration", "Healthcare for children", "Vaccination records", "Pregnancy and birth administration", "Registering a birth", "Parental-leave administration", "Emergency versus non-emergency care", "Keeping foreign medical records usable", "Health-fee exemptions", "Changing address in health records"
  ]},
  { id: "driving_transport", audience: "drivers and commuters", risk: "medium", terms: ["IMT", "carta de condução", "IUC", "veículo", "Via Verde"], topics: [
    "Using a foreign driving licence in Portugal", "Exchanging an EU driving licence", "Exchanging a non-EU driving licence", "Driving-licence exchange documents", "What happens when a foreign licence expires", "Buying a used car", "Checking vehicle documents", "Registering an imported vehicle", "ISV basics", "What IUC is", "IUC payment timing", "Portuguese toll systems", "Via Verde basics", "Electronic tolls for foreign vehicles", "Car-insurance documents", "Vehicle inspection timing", "Selling a vehicle safely", "Changing the address on vehicle records", "Public-transport passes"
  ]},
  { id: "education_children", audience: "families and students", risk: "medium", terms: ["matrícula escolar", "educação", "equivalência", "reconhecimento", "MEGA"], topics: [
    "Enrolling a child in a Portuguese school", "School-enrolment documents", "School catchment areas", "Renewing school enrolment", "Portuguese-language support for students", "Recognising foreign school records", "School-meal and support applications", "MEGA schoolbook vouchers", "School calendar basics", "National-exam administration", "Applying to Portuguese higher education", "Recognising a foreign degree", "Automatic versus specific degree recognition", "Student residence administration", "Moving schools during the year"
  ]},
  { id: "daily_life_consumer", audience: "everyone living in Portugal", risk: "low", terms: ["ePortugal", "Livro de Reclamações", "ANACOM", "energia", "telecomunicações"], topics: [
    "Using ePortugal to find public services", "Getting an atestado de residência", "Finding the correct municipal office", "Booking public-service appointments", "Using the electronic complaints book", "Changing electricity supplier", "Reading an electricity bill", "Changing telecom provider", "Mobile-phone contracts", "Internet installation documents", "Cancelling a consumer contract", "Keeping proof of cancellation", "Moving house administration checklist", "Preventing identity-document scams", "Official email and SMS scam checks", "Document-expiry monthly review", "Building an emergency document folder", "When a municipal rule differs", "Finding English-language official help"
  ]},
];

const officialCalendar = JSON.parse(await readFile(new URL("../config/official-calendar-2026-2027.json", import.meta.url), "utf8"));
const timingForStatus = { confirmed: "official_locked", confirmed_rule: "rule_locked", must_reverify: "must_reverify", occasion: "occasion" };
const campaigns = officialCalendar.events.flatMap((event) => (event.campaign ?? []).map((stage) => ({
  date: stage.publishDate,
  pillar: event.subjectFamily,
  title: stage.title,
  timing: timingForStatus[event.status],
  authority: officialCalendar.sources[event.source],
  sourceKey: event.source,
  eventKey: event.key,
  eventDate: event.date,
  calendarStatus: event.status,
  campaignStage: stage.stage,
  scope: event.scope,
})));

const campaignMap = Map.groupBy(campaigns, (item) => item.date);
const lowerRiskPillars = pillars.filter((pillar) => pillar.risk !== "high");
const authorityProfiles = {
  identity_access:"gov.pt, Autoridade Tributária, Segurança Social, or Autenticação.gov as applicable",
  immigration_residency:"AIMA, gov.pt, Diário da República, or IRN as applicable",
  citizenship_civil:"IRN, gov.pt, or Diário da República", freelance_business:"Autoridade Tributária, Segurança Social, gov.pt, or Diário da República",
  iva:"Autoridade Tributária or Diário da República", irs:"Autoridade Tributária or Diário da República",
  social_security:"Segurança Social, gov.pt, or Diário da República", housing_property:"Autoridade Tributária, gov.pt, Diário da República, or the responsible municipality",
  banking_money:"Banco de Portugal, European Central Bank, or gov.pt", employment:"ACT, Segurança Social, IEFP, gov.pt, or Diário da República",
  health_family:"SNS, SNS 24, gov.pt, or Diário da República", driving_transport:"IMT, Autoridade Tributária, gov.pt, or Diário da República",
  education_children:"Direção-Geral da Educação, DGES, gov.pt, or Diário da República", daily_life_consumer:"gov.pt, Direção-Geral do Consumidor, ANACOM, ERSE, or the responsible municipality",
};
const iso = (date) => date.toISOString().slice(0, 10);
const csv = (value) => `"${String(value).replaceAll('"', '""')}"`;
const evidenceGlossary = [
  [/\bnif\b/i, ["NIF", "número de identificação fiscal"]],
  [/\bniss\b/i, ["NISS", "número de identificação da segurança social"]],
  [/chave móvel|digital key/i, ["Chave Móvel Digital", "autenticação.gov"]],
  [/modelo 3/i, ["Modelo 3", "declaração de rendimentos"]],
  [/\birs\b|income tax/i, ["IRS", "Imposto sobre o Rendimento das Pessoas Singulares"]],
  [/e-?fatura/i, ["e-Fatura", "faturas"]],
  [/\biva\b|vat/i, ["IVA", "Imposto sobre o Valor Acrescentado"]],
  [/social security|segurança social|quarterly declaration/i, ["Segurança Social", "declaração trimestral"]],
  [/residence|residency|aima|family reunification|cplp|visa/i, ["AIMA", "autorização de residência"]],
  [/medical record|health record/i, ["registo de saúde", "processo clínico", "SNS"]],
  [/family doctor/i, ["médico de família", "SNS"]],
  [/\biuc\b/i, ["IUC", "Imposto Único de Circulação"]],
  [/\bimi\b/i, ["IMI", "Imposto Municipal sobre Imóveis"]],
  [/\baimi\b/i, ["AIMI", "Adicional ao IMI"]],
  [/\bimt\b/i, ["IMT", "Imposto Municipal sobre as Transmissões"]],
  [/driving licen[cs]e/i, ["carta de condução", "IMT"]],
  [/school|education|enrolment/i, ["matrículas", "Portal das Matrículas", "educação"]],
  [/employment contract|employee|job|payslip/i, ["contrato de trabalho", "Código do Trabalho"]],
  [/rent|tenant|landlord|lease/i, ["arrendamento", "contrato de arrendamento"]],
  [/bank|iban|sepa/i, ["Banco de Portugal", "IBAN", "SEPA"]],
  [/consumer|complaint/i, ["Livro de Reclamações", "Direção-Geral do Consumidor"]],
];
const genericWords = new Set(["what","when","where","which","with","your","from","into","before","after","about","portugal","portuguese","plain","english","explanation","practical","step","checklist","mistakes","exceptions","edge","cases","golden","tip","verify","news","reserve","fallback"]);
function evidenceTermsFor(topic, title, pillar) {
  const terms = [];
  for (const [pattern, values] of evidenceGlossary) if (pattern.test(`${topic} ${title}`)) terms.push(...values);
  if (!terms.length) {
    const words = topic.toLowerCase().replace(/[^a-zà-ÿ0-9 ]/g, " ").split(/\s+/).filter((word) => word.length > 4 && !genericWords.has(word));
    terms.push(words.slice(0, 3).join(" "));
  }
  const pillarFallback = pillar.terms.find((term) => new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(`${topic} ${title}`));
  if (pillarFallback) terms.push(pillarFallback);
  return [...new Set(terms.filter(Boolean))].slice(0, 5);
}
const rows = [];
const seen = new Map();
const usedBriefs90 = new Set();
const campaignSlotOrder = [3, 2, 1, 4, 0];
const intentByAngle = { foundation:"evergreen_explainer", action:"checklist", edge_case:"common_mistake", audience:"audience_specific", golden_tip:"golden_tip" };
const answerPrompts = {
  foundation: topic => [`Define ${topic} without jargon.`, "Explain who encounters it and why it matters.", "Clarify the most important limitation or confusion."],
  action: topic => [`State when someone should handle ${topic}.`, "List the preparation and official-channel steps in order.", "Explain what proof or confirmation to retain."],
  edge_case: topic => [`Identify the normal route for ${topic}.`, "Explain two realistic mistakes or exceptions.", "Give the safe next action when the normal route fails."],
  audience: topic => [`Explain how ${topic} applies to the named audience.`, "Separate universal rules from audience-dependent details.", "Give one concrete action the audience can take."],
  golden_tip: topic => [`Explain the single highest-value habit for ${topic}.`, "Show what to verify before acting.", "State what record, receipt, or confirmation to keep."],
};
function briefFor({ topic, pillar, angle, timing, reserve, authority, date, title, campaign }) {
  const recurring=["official_locked","rule_locked","must_reverify","occasion","seasonal"].includes(timing);
  return {
    subjectFamily:pillar.id,
    userQuestion:`How should ${pillar.audience} handle ${topic}?`,
    purpose: recurring ? `Help ${pillar.audience} act safely around the ${date} occurrence.` : `Give ${pillar.audience} one complete, practical answer about ${topic}.`,
    requiredAnswers:answerPrompts[angle](topic),
    sourcePolicy:{requiredAuthority:authority,officialRequired:pillar.risk!=="low"||timing!=="evergreen",freshnessDays:pillar.risk==="high"?7:pillar.risk==="medium"?30:90},
    timingBehavior:recurring?"fixed_or_campaign":"flexible_evergreen",
    fallback:reserve==="breaking_news"?{kind:"named_evergreen",title:title.replace(/^NEWS RESERVE — fallback:\s*/,"")}:null,
    contentIntent:recurring?(timing==="occasion"||timing==="seasonal"?"occasion":"deadline_reminder"):intentByAngle[angle],
    occurrenceKey:campaign?.eventKey ?? (recurring?`${pillar.id}:${date}:${topic.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`:null),
    campaignStage:campaign?.campaignStage ?? (recurring ? "single" : null),
    calendarEventDate:campaign?.eventDate ?? null,
    calendarStatus:campaign?.calendarStatus ?? null,
    applicabilityScope:campaign?.scope ?? null,
  };
}

for (let day = 0; day < days; day++) {
  const date = new Date(start); date.setUTCDate(start.getUTCDate() + day);
  const dateText = iso(date);
  const todaysCampaigns=campaignMap.get(dateText)||[];
  let highRiskCount = todaysCampaigns.filter(campaign=>pillars.find(item=>item.id===campaign.pillar)?.risk==="high").length;
  for (let slot = 0; slot < slots.length; slot++) {
    let pillarIndex = (day * 3 + slot * 5) % pillars.length;
    let pillar = pillars[pillarIndex];
    if (pillar.risk === "high" && highRiskCount >= 2) pillar = lowerRiskPillars[(day + slot) % lowerRiskPillars.length];
    let topicIndex=(Math.floor(day / 2)+slot*7)%pillar.topics.length;
    let topic=pillar.topics[topicIndex];
    const [angle, pattern] = angles[(day + slot) % angles.length];
    if(day<90){for(let attempt=0;attempt<pillar.topics.length;attempt++){const candidate=pillar.topics[(topicIndex+attempt)%pillar.topics.length];const identity=`${pillar.id}|${candidate}|${pillar.audience}|${intentByAngle[angle]}`.toLowerCase();if(!usedBriefs90.has(identity)){topic=candidate;usedBriefs90.add(identity);break;}}}
    let title = pattern.replace("{topic}", topic).replace("{audience}", pillar.audience);
    let timing = "evergreen";
    let authority = authorityProfiles[pillar.id];
    let reserve = slot === 3 ? "breaking_news" : "none";
    const campaignIndex=campaignSlotOrder.indexOf(slot);
    let isCampaign=false;
    if (campaignIndex>=0 && todaysCampaigns[campaignIndex]) {
      const campaign = todaysCampaigns[campaignIndex];
      pillar = pillars.find((item) => item.id === campaign.pillar) ?? pillar;
      title = campaign.title; topic=campaign.title; timing = campaign.timing; authority = campaign.authority; reserve = "date_locked";
      isCampaign=true;
    } else if (slot === 3) {
      title = `NEWS RESERVE — fallback: ${title}`;
      timing = "news_flex";
      authority = "Official-source verification required; otherwise use fallback";
    }
    const key = title.replace(/^NEWS RESERVE — fallback: /, "");
    const occurrence = (seen.get(key) ?? 0) + 1; seen.set(key, occurrence);
    if (pillar.risk === "high"&&!isCampaign) highRiskCount++;
    const campaign = isCampaign ? todaysCampaigns[campaignIndex] : null;
    const brief=briefFor({topic,pillar,angle,timing,reserve,authority,date:dateText,title,campaign});
    rows.push({ date: dateText, time: slots[slot], slot: slot + 1, pillar: pillar.id, angle, title, audience: pillar.audience, risk: pillar.risk, timing, reserve, evidenceTerms: evidenceTermsFor(topic, title, pillar).join(" | "), searchTerms: pillar.terms.join(" | "), authority, occurrence, curationStatus:day<90?"curated_90_day":"annual_candidate", brief });
  }
}

await mkdir("plans", { recursive: true });
const headers = Object.keys(rows[0]).filter(key=>key!=="brief");
await writeFile("plans/finkavo-rolling-year-2026-08-13.csv", `${headers.map(csv).join(",")}\n${rows.map((row) => headers.map((key) => csv(row[key])).join(",")).join("\n")}\n`);
await writeFile("plans/finkavo-rolling-year-2026-08-13.json", `${JSON.stringify({ version: 2, generatedAt: new Date().toISOString(), rows }, null, 2)}\n`);
await writeFile("plans/finkavo-editorial-catalog.json", `${JSON.stringify({ version: 2, period: { start: iso(start), days }, slots, angles: angles.map(([id]) => id), pillars, campaigns }, null, 2)}\n`);
const summary = {
  period: { start: iso(start), end: rows.at(-1).date },
  totalSlots: rows.length,
  dateLocked: rows.filter((row) => row.reserve === "date_locked").length,
  newsReserve: rows.filter((row) => row.reserve === "breaking_news").length,
  evergreen: rows.filter((row) => row.timing === "evergreen").length,
  pillars: Object.fromEntries(pillars.map((pillar) => [pillar.id, rows.filter((row) => row.pillar === pillar.id).length])),
  duplicateExactTitles: rows.length - new Set(rows.map((row) => row.title)).size,
  curated90DayBriefs: rows.filter(row=>row.curationStatus==="curated_90_day").length,
};
await writeFile("plans/finkavo-rolling-year-summary.json", `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
