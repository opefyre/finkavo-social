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

const authorityRules: Array<{ pattern: RegExp; domains: string[]; label: string }> = [
  { pattern: /social_security|seguran[çc]a social|contribut|niss|independent.worker|self.employed|freelancer/iu, domains: ["seg-social.pt"], label: "Segurança Social" },
  { pattern: /\b(?:irs|iva|nif|imi|aimi|iuc|tax|fiscal|finan[çc]as)\b/iu, domains: ["portaldasfinancas.gov.pt"], label: "Autoridade Tributária" },
  { pattern: /aima|immigration|residen|migrant|visa|visto/iu, domains: ["aima.gov.pt"], label: "AIMA" },
  { pattern: /citizenship|nationality|nacionalidade|civil registry/iu, domains: ["justica.gov.pt", "irn.justica.gov.pt"], label: "Justiça / IRN" },
  { pattern: /employment|labour|labor|contrato de trabalho|worker rights/iu, domains: ["act.gov.pt"], label: "ACT" },
];

const hostname = (url: string) => { try { return new URL(url).hostname.replace(/^www\d?\./, ""); } catch { return ""; } };
const matchesDomain = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`);
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
  const primary = rule ? official.filter(source => rule.domains.some(domain => matchesDomain(hostname(source.url), domain))) : [];
  const restsOnItsAuthority = primary.length > 0;
  if (sensitiveClaims.length) {
    if (!restsOnItsAuthority && (official.length < 2 || distinctOfficialHosts.length < 2)) failures.push("Sensitive claims require two independent official sources");
    if (rule && !official.some(source => rule.domains.some(domain => matchesDomain(hostname(source.url), domain)))) failures.push(`The responsible authority (${rule.label}) is missing`);
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
