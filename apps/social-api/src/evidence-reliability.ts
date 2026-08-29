export type EvidenceSource = {
  url: string;
  title?: string;
  publisher?: string | null;
  tier?: string;
  retrievedAt?: string;
  excerpts?: string[];
};

export type EvidenceClaim = { claim: string; evidenceQuote: string };

const sensitivePattern = /(?:\b\d+(?:[.,]\d+)?\s*(?:%|€|euros?|days?|months?|years?|dias?|meses?|anos?)\b|€\s*\d|\b(?:rate|deadline|threshold|minimum|maximum|exemption|eligible|eligibility|mandatory|must|required|law|regulation|article|taxa|prazo|limite|isenção|obrigatóri[oa]|lei|regulamento|artigo)\b)/iu;

// `enforce` separates the two jobs a rule does. An enforced rule both grants the
// single-source waiver and *demands* its authority be present — citing anything else is a
// failure. That demand is only defensible where the agency is genuinely the sole voice on
// the subject, so it stays on the five original rules and nothing else.
//
// The rules below it are waiver-only. They exist because measuring the plan showed 74 of
// 109 slots matched no rule at all: annual leave, sick pay, overtime and parental leave
// all missed ACT's /employment|labour|labor/ pattern, and health, banking, vehicles,
// telecom and condominium law had no rule in the first place. Every one of those topics
// therefore needed two independent official hosts for any claim carrying a figure — which
// is most claims worth making. Marking them `enforce: false` grants the waiver without
// inventing a new way to fail: a topic that already passes on two independent sources goes
// on passing, because the "responsible authority is missing" check skips them.
const authorityRules: Array<{ pattern: RegExp; domains: string[]; label: string; enforce?: boolean }> = [
  { pattern: /social_security|seguran[çc]a social|contribut|niss|independent.worker|self.employed|freelancer/iu, domains: ["seg-social.pt"], label: "Segurança Social", enforce: true },
  { pattern: /\b(?:irs|iva|nif|imi|aimi|iuc|tax|fiscal|finan[çc]as)\b/iu, domains: ["portaldasfinancas.gov.pt"], label: "Autoridade Tributária", enforce: true },
  { pattern: /aima|immigration|residen|migrant|visa|visto/iu, domains: ["aima.gov.pt"], label: "AIMA", enforce: true },
  { pattern: /citizenship|nationality|nacionalidade|civil registry/iu, domains: ["justica.gov.pt", "irn.justica.gov.pt"], label: "Justiça / IRN", enforce: true },
  { pattern: /employment|labour|labor|contrato de trabalho|worker rights/iu, domains: ["act.gov.pt"], label: "ACT", enforce: true },

  { pattern: /\b(?:annual leave|f[ée]rias|feriado|public holiday|holiday pay|sick (?:pay|leave|note)|subs[íi]dio|overtime|horas extraordin[áa]rias|parental leave|licen[çc]a parental|maternity|paternity|fixed.term|contrato a termo|contract|contrato|dismissal|despedimento|notice period|training|forma[çc][ãa]o|working student|trabalhador.estudante|harassment|ass[ée]dio|rest day|dia de descanso|probation|per[íi]odo experimental|payslip|recibo de vencimento|minimum wage|sal[áa]rio m[íi]nimo|employer|employee|employ|working from home|teletrabalho|declara[çc][ãa]o trimestral|job start)(?:s|es)?\b/iu, domains: ["act.gov.pt", "seg-social.pt"], label: "ACT / Segurança Social" },
  { pattern: /\b(?:sns|sns24|adse|health|sa[úu]de|hospital|clinic|prescription|receita m[ée]dica|taxas? moderadoras?|user fee|medical|doctor|dentist|vaccin|vacina)(?:s|es)?\b/iu, domains: ["sns.gov.pt", "sns24.gov.pt", "adse.gov.pt", "adse.pt", "dgs.pt", "min-saude.pt"], label: "SNS / ADSE" },
  { pattern: /\b(?:iban|bank account|conta banc[áa]ria|mortgage|cr[ée]dito habita[çc][ãa]o|interest rate|taxa de juro|deposit|dep[óo]sito|banco de portugal|bportugal|mb way|transfer[êe]ncia|euribor|spread)(?:s|es)?\b/iu, domains: ["bportugal.pt", "clientebancario.bportugal.pt"], label: "Banco de Portugal" },
  { pattern: /\b(?:driving licence|driving license|driving test|foreign licence|carta de condu[çc][ãa]o|vehicle|ve[íi]culo|autom[óo]vel|inspe[çc][ãa]o|matr[íi]cula|imt|ansr|number plate|registration certificate)(?:s|es)?\b/iu, domains: ["imt-ip.pt", "ansr.pt"], label: "IMT / ANSR" },
  { pattern: /\b(?:telecom|operator|anacom|lock.?in|fideliza[çc][ãa]o|tarif[áa]rio|mobile plan|portabilidade|broadband|internet plan)(?:s|es)?\b/iu, domains: ["anacom.pt"], label: "ANACOM" },
  { pattern: /\b(?:condominium|cond[óo]mini|lease|arrendamento|landlord|senhorio|tenant|inquilino|rent|rental|renda|reserve fund|fundo de reserva|habita[çc][ãa]o|eviction|lodging)(?:s|es)?\b/iu, domains: ["portaldahabitacao.gov.pt", "portaldahabitacao.pt", "ihru.pt", "portaldasfinancas.gov.pt"], label: "Habitação" },
  { pattern: /\b(?:marriage|casamento|registry|registo|citizen card|cart[ãa]o de cidad[ãa]o|card renewal|certificate|certid[ãa]o|birth|nascimento|death|[óo]bito)(?:s|es)?\b/iu, domains: ["justica.gov.pt", "irn.justica.gov.pt"], label: "Justiça / IRN (orientação)" },
  { pattern: /\b(?:consumer|consumidor|warranty|garantia|refund|reembolso|livro de reclama[çc][õo]es|complaint book|right of withdrawal|direito de livre resolu[çc][ãa]o)(?:s|es)?\b/iu, domains: ["consumidor.gov.pt", "asae.gov.pt"], label: "DGC / ASAE" },
  // Deliberately last and deliberately broad. The enforced Autoridade Tributária rule above
  // keeps its narrow pattern because it *demands* its domain; this one only offers the
  // waiver, so it can catch the tax-shaped topics that rule misses — "taxed" rather than
  // "tax", a deduction, a Modelo, an instalment — without imposing anything.
  { pattern: /\b(?:tax(?:ed|able|ation)?|deduction|dedu[çc][ãa]o|declara[çc][ãa]o|modelo \d+|instalment|installment|presta[çc][ãa]o|filing|withholding|reten[çc][ãa]o|income|rendimento|allowance|escal[ãa]o|bracket)(?:s|es)?\b/iu, domains: ["portaldasfinancas.gov.pt", "info.portaldasfinancas.gov.pt"], label: "Autoridade Tributária (orientação)" },
];

// Diário da República publishes the law itself. Every rule above names the agency that
// administers something — ACT for working conditions, Segurança Social for contributions
// — and for how a rule is applied in practice that is the right authority to insist on.
// But when the source is the statute as published in the official gazette, demanding the
// agency that interprets it is backwards: the Código do Trabalho on dre.pt is the more
// authoritative account of statutory leave than any guidance page about it. Seven
// employment topics failed in a single day for the offence of citing the law.
const PRIMARY_LAW_DOMAINS = ["dre.pt", "diariodarepublica.pt"];

const hostname = (url: string) => { try { return new URL(url).hostname.replace(/^www\d?\./, ""); } catch { return ""; } };
const matchesDomain = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`);
const speaksWithAuthority = (url: string, domains: string[]) => {
  const host = hostname(url);
  return domains.some(domain => matchesDomain(host, domain)) || PRIMARY_LAW_DOMAINS.some(domain => matchesDomain(host, domain));
};
// A figure has to be compared across two languages and two number conventions, because
// the post is written in English and the source it cites is Portuguese. Comparing the raw
// text meant "120 days" never matched "120 dias", "8500 euros" never matched "8.500
// euros", and "250 euros" never matched "250 EUR" — so a claim the source stated plainly
// was recorded as unconfirmed. Every figure is reduced to a number and a canonical unit
// before anything is compared.
const UNIT_ALIASES: Array<{ canonical: string; pattern: RegExp }> = [
  { canonical: "pct", pattern: /^(?:%|per ?cento?|percent)$/iu },
  { canonical: "eur", pattern: /^(?:€|eur|euros?)$/iu },
  { canonical: "day", pattern: /^(?:days?|dias?)$/iu },
  { canonical: "month", pattern: /^(?:months?|m[êe]s|meses)$/iu },
  { canonical: "year", pattern: /^(?:years?|anos?)$/iu },
];

const canonicalUnit = (raw: string) => UNIT_ALIASES.find(alias => alias.pattern.test(raw.trim()))?.canonical ?? "";

/**
 * Reads "8.500", "8,500", "8500" as the same number. A single separator followed by
 * exactly three digits is a thousands separator in both conventions; anything else is a
 * decimal point. Getting this backwards would turn 8.500 euros into 8.5, so it is the one
 * place worth being fussy.
 */
function numericValue(raw: string): string {
  const digits = raw.replace(/[^\d.,]/g, "");
  if (!digits) return "";
  const separators = digits.match(/[.,]/g) ?? [];
  let normalised = digits;
  if (separators.length > 1) {
    normalised = digits.replace(/[.,](?=\d{3}\b)/g, "").replace(",", ".");
  } else if (separators.length === 1) {
    normalised = /[.,]\d{3}$/.test(digits) ? digits.replace(/[.,]/, "") : digits.replace(",", ".");
  }
  const value = Number(normalised);
  return Number.isFinite(value) ? String(value) : "";
}

export // Portuguese official text spells numbers as often as it writes them: "os noivos tem ate
// seis meses para casar", "no prazo de trinta dias". A post written in English says "6
// months", and comparing digits alone called that unsupported — a correct figure refused
// because the source used a word for it. Both sides are put into digits first.
const SPELLED_NUMBERS: Array<[RegExp, string]> = [
  [/\b(?:um|uma|one)\b/giu, "1"], [/\b(?:dois|duas|two)\b/giu, "2"], [/\b(?:tr[êe]s|three)\b/giu, "3"],
  [/\b(?:quatro|four)\b/giu, "4"], [/\b(?:cinco|five)\b/giu, "5"], [/\b(?:seis|six)\b/giu, "6"],
  [/\b(?:sete|seven)\b/giu, "7"], [/\b(?:oito|eight)\b/giu, "8"], [/\b(?:nove|nine)\b/giu, "9"],
  [/\b(?:dez|ten)\b/giu, "10"], [/\b(?:onze|eleven)\b/giu, "11"], [/\b(?:doze|twelve)\b/giu, "12"],
  [/\b(?:quinze|fifteen)\b/giu, "15"], [/\b(?:vinte|twenty)\b/giu, "20"], [/\b(?:trinta|thirty)\b/giu, "30"],
  [/\b(?:sessenta|sixty)\b/giu, "60"], [/\b(?:noventa|ninety)\b/giu, "90"], [/\b(?:cento|hundred)\b/giu, "100"],
];

const withDigits = (value: string) =>
  SPELLED_NUMBERS.reduce((text, [pattern, digit]) => text.replace(pattern, digit), value);

export const normalizedNumberTokens = (rawValue: string): string[] => ((value: string) =>
  [...value.matchAll(/(?:€\s*)?(\d[\d.,]*)\s*(%|€|euros?|eur|days?|dias?|months?|meses|m[êe]s|years?|anos?|per ?cento?|percent)?/giu)]
    .map(match => {
      const unit = canonicalUnit(match[2] ?? "") || (/^€/.test(match[0]) ? "eur" : "");
      const number = numericValue(match[1]);
      return unit && number ? `${number}${unit}` : "";
    })
    .filter(Boolean))(withDigits(rawValue));


export function isSensitiveClaim(value: EvidenceClaim | string) {
  const text = typeof value === "string" ? value : `${value.claim} ${value.evidenceQuote}`;
  return sensitivePattern.test(text);
}

export function requiredAuthority(topic: string, category?: string) {
  const context = `${category || ""} ${topic}`;
  return authorityRules.find(rule => rule.pattern.test(context)) || null;
}

export function assessEvidenceReliability(input: { topic: string; category?: string; claims: EvidenceClaim[]; sources: EvidenceSource[]; now?: Date }) {
  const sensitiveClaims = input.claims.filter(isSensitiveClaim);
  const failures: string[] = [];
  const rule = requiredAuthority(input.topic, input.category);
  const official = input.sources.filter(source => source.tier === "official");
  const distinctOfficialHosts = [...new Set(official.map(source => hostname(source.url)).filter(Boolean))];
  // Corroboration means "check this against someone who would know", and for Portuguese
  // administrative facts that someone is the authority that sets the rule. Requiring a
  // second independent site to repeat the tax authority's own threshold blocked nearly
  // every useful post — in personal finance almost any claim worth making carries a
  // figure, a deadline or a percentage, so almost every claim was ruled sensitive and
  // then failed for want of a second source that does not exist.
  //
  // The guard the rule was really providing was against misreading one page. That risk is
  // now handled where it belongs: the corpus is official-only, and every quote is anchored
  // verbatim to the source it came from rather than retyped by the model. So a claim
  // sourced from the responsible authority stands on that authority. A claim sourced from
  // an official page that is *not* the responsible authority still needs a second, because
  // that is the case where one page really can be wrong or out of date.
  const primary = rule ? official.filter(source => speaksWithAuthority(source.url, rule.domains)) : [];
  const restsOnItsAuthority = primary.length > 0;
  if (sensitiveClaims.length) {
    if (!restsOnItsAuthority && (official.length < 2 || distinctOfficialHosts.length < 2)) failures.push("Sensitive claims require two independent official sources");
    if (rule?.enforce && !official.some(source => speaksWithAuthority(source.url, rule.domains))) failures.push(`The responsible authority (${rule.label}) is missing`);
    for (const claim of sensitiveClaims) {
      const tokens = normalizedNumberTokens(`${claim.claim} ${claim.evidenceQuote}`);
      const confirmingHosts = new Set<string>();
      for (const source of official) {
        // Both sides are reduced to number-and-unit before comparing, so an English post
        // and its Portuguese source agree about "120 days" and "120 dias".
        const theirs = new Set(normalizedNumberTokens((source.excerpts || []).join(" ")));
        if (!tokens.length || tokens.every(token => theirs.has(token))) confirmingHosts.add(hostname(source.url));
      }
      // The figure still has to appear in the evidence — that check is not relaxed, only
      // the number of places it must appear in. Where the authority itself states it, its
      // word is the confirmation; otherwise two independent officials must agree.
      const confirmedByAuthority = restsOnItsAuthority && primary.some(source => {
        const theirs = new Set(normalizedNumberTokens((source.excerpts || []).join(" ")));
        return !tokens.length || tokens.every(token => theirs.has(token));
      });
      // Resting on the authority waives the need for a second source. It does not waive a
      // disagreement between them. If another official page quotes a different figure of
      // the same kind — 29,6% where the claim says 21,4% — one of them is stale or has
      // been misread, and publishing either as settled is what this gate exists to stop.
      const unitOf = (token: string) => token.replace(/[\d.]/g, "");
      const units = new Set(tokens.map(unitOf).filter(Boolean));
      const contradicting = official.some(source => {
        const theirs = normalizedNumberTokens((source.excerpts || []).join(" "));
        const comparable = theirs.filter(token => units.has(unitOf(token)));
        return comparable.length > 0 && !comparable.some(token => tokens.includes(token));
      });
      if (contradicting) {
        failures.push(`Official sources disagree on a figure in this claim: ${claim.claim}`);
      } else if (!confirmedByAuthority && confirmingHosts.size < 2) {
        failures.push(`Sensitive claim lacks matching confirmation from two official sources: ${claim.claim}`);
      }
    }
  }
  const checkedAt = (input.now || new Date()).toISOString();
  return { passed: failures.length === 0, sensitive: sensitiveClaims.length > 0, failures: [...new Set(failures)], checkedAt, requiredAuthority: rule?.label || null, sourceCount: input.sources.length, officialHostCount: distinctOfficialHosts.length };
}
