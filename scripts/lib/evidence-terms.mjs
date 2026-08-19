// Shared evidence-term derivation, used by both the brief validator and the plan builder
// so that an underivable brief is rejected at authoring time rather than at layout time.
//
// The previous builder derived terms by chopping words out of the title, which produced
// "basics" and "working client" for 47.6% of slots, and matched /rent|tenant|lease/
// unanchored so that "parental" and "different" were tagged with Portuguese tenancy law.
// Every match here is word-bounded, and failure is explicit rather than guessed.

export const PILLAR_TERMS = {
  identity_access: ["NIF", "NISS", "Chave Móvel Digital", "Portal das Finanças", "Segurança Social Direta", "representante fiscal", "notificações eletrónicas", "Cartão de Cidadão", "título de residência", "domicílio fiscal", "morada", "assinatura digital", "e-balcão", "informação vinculativa", "senha de acesso", "agregado familiar"],
  immigration_residency: ["AIMA", "autorização de residência", "visto", "reagrupamento familiar", "CPLP", "atestado de residência", "visto para procura de trabalho", "certificado de registo"],
  citizenship_civil: ["IRN", "cidadania", "nacionalidade", "registo civil", "naturalização", "Cartão de Cidadão", "casamento", "publicações", "convenção antenupcial", "registo de nascimento", "divórcio", "partilha", "habilitação de herdeiros", "cabeça de casal", "herança", "Imposto do Selo"],
  freelance_business: ["trabalhador independente", "abrir atividade", "recibos verdes", "CAE", "ato isolado", "cessação de atividade", "sociedade unipessoal", "RCBE", "regime simplificado", "coeficiente", "fatura", "recibo verde", "contabilidade organizada", "acidentes de trabalho"],
  iva: ["IVA", "CIVA", "artigo 53", "declaração periódica", "VIES", "declaração de alterações", "declaração recapitulativa", "autoliquidação", "taxa reduzida", "taxa intermédia", "Lista I", "Lista II", "isenção", "artigo 9", "regime de caixa", "exigibilidade", "direito à dedução", "artigo 21"],
  irs: ["IRS", "Modelo 3", "e-Fatura", "Anexo J", "IRS Automático", "IRS Jovem", "IAS", "taxa liberatória", "Modelo 30", "retenção na fonte", "dedução à coleta", "despesas de saúde", "IFICI", "residente não habitual", "reclamação graciosa", "juros de mora"],
  social_security: ["Segurança Social", "Segurança Social Direta", "carreira contributiva", "plano prestacional", "situação contributiva", "declaração trimestral", "contribuições", "NISS", "trabalhador independente", "subsídio parental", "pensão de velhice", "fator de sustentabilidade", "subsídio de doença", "CIT", "pensão de alimentos", "FGADM", "pensão de sobrevivência", "complemento solidário para idosos", "prestação social para a inclusão", "cuidador informal", "rendimento social de inserção"],
  housing_property: ["arrendamento", "IMI", "AIMI", "IMT", "imóvel", "caderneta predial", "certidão permanente", "registo predial", "Imposto do Selo", "habitação própria permanente", "VPT", "oposição à renovação", "NRAU", "apoio à renda", "taxa de esforço", "IMT Jovem", "garantia pública", "rendimentos prediais", "categoria F", "Porta 65", "alojamento local", "mais-valias", "condomínio", "fundo comum de reserva", "certificado energético"],
  banking_money: ["Banco de Portugal", "SEPA", "conta bancária", "IBAN", "serviços mínimos bancários", "IAS", "MB WAY", "transferência a crédito", "débito direto", "mudança de conta", "crédito à habitação", "reembolso antecipado", "crédito aos consumidores", "TAEG", "Fundo de Garantia de Depósitos", "depósito a prazo", "PPR", "plano de poupança"],
  employment: ["contrato de trabalho", "Código do Trabalho", "salário", "férias", "feriado", "período experimental", "aviso prévio", "subsídio de desemprego", "prazo de garantia", "subsídio de férias", "duodécimos", "assédio", "procedimento disciplinar", "trabalho suplementar", "teletrabalho", "faltas justificadas", "trabalhador-estudante"],
  health_family: ["SNS", "centro de saúde", "médico de família", "número de utente", "taxas moderadoras", "insuficiência económica", "IAS", "consulta de recurso", "SNS 24", "atestado multiuso", "licença parental", "subsídio parental", "comparticipação", "regime excecional", "receita sem papel", "seguro de saúde", "período de carência", "ADSE", "regime convencionado"],
  driving_transport: ["IMT", "carta de condução", "IUC", "veículo", "passe", "Circula PT", "troca de carta", "título de condução", "inspeção periódica", "IPO", "registo de propriedade", "ISV", "DAV", "contraordenação", "revalidação", "atestado médico", "seguro automóvel", "declaração amigável"],
  education_children: ["matrícula escolar", "educação", "equivalência", "reconhecimento", "Direção-Geral da Educação", "Portal das Matrículas", "ASE", "abono de família", "prova escolar", "concurso nacional de acesso", "provas de ingresso", "creche", "manuais escolares", "reconhecimento", "Reconhecimento Automático", "bolsa de estudo", "ação social"],
  daily_life_consumer: ["ePortugal", "Livro de Reclamações", "ANACOM", "energia", "arbitragem de consumo", "fidelização", "ANACOM", "livre resolução", "garantia", "comercializador", "ERSE", "tarifa social", "serviços públicos essenciais", "prescrição", "ANAC", "direitos dos passageiros", "RGPD", "CNPD", "ruído", "SIAC", "recenseamento eleitoral"],
};

const INSTRUMENT_PATTERN =
  /\b(?:artigo|lei|decreto-lei|decreto|portaria|c[óo]digo|regulamento|modelo|anexo)\b[^,.;]{0,28}/gi;

/**
 * Returns the evidence terms for a brief, or throws when none can be derived.
 * Never falls back to words taken from the title.
 */
export function deriveEvidenceTerms(brief) {
  const terms = new Set();
  const haystack = `${brief.anchorFact?.claim ?? ""} ${brief.title ?? ""}`;

  if (brief.anchorFact?.namedThing) terms.add(brief.anchorFact.namedThing);

  for (const instrument of brief.anchorFact?.claim?.match(INSTRUMENT_PATTERN) ?? []) {
    terms.add(instrument.trim());
  }

  for (const term of PILLAR_TERMS[brief.pillar] ?? []) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`\\b${escaped}\\b`, "i").test(haystack)) terms.add(term);
  }

  if (!terms.size) {
    throw new Error(
      `cannot derive evidence terms: give anchorFact a namedThing, cite a legal instrument in the claim, ` +
      `or use a term from the ${brief.pillar} vocabulary`,
    );
  }
  return [...terms].slice(0, 5);
}
