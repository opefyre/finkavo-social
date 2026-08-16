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
const normalizedNumberTokens = (value: string) => [...value.matchAll(/(?:€\s*)?\d+(?:[.,]\d+)?\s*(?:%|€|euros?|days?|months?|years?|dias?|meses?|anos?)?/giu)]
  .map(match => match[0].toLocaleLowerCase("pt").replace(/\s+/g, "").replace(",", "."))
  .filter(token => /[%€]|euros?|days?|months?|years?|dias?|meses?|anos?/iu.test(token));

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
  if (sensitiveClaims.length) {
    if (official.length < 2 || distinctOfficialHosts.length < 2) failures.push("Sensitive claims require two independent official sources");
    if (rule && !official.some(source => rule.domains.some(domain => matchesDomain(hostname(source.url), domain)))) failures.push(`The responsible authority (${rule.label}) is missing`);
    for (const claim of sensitiveClaims) {
      const tokens = normalizedNumberTokens(`${claim.claim} ${claim.evidenceQuote}`);
      const confirmingHosts = new Set<string>();
      for (const source of official) {
        const text = (source.excerpts || []).join(" ").toLocaleLowerCase("pt").replace(/\s+/g, "").replaceAll(",", ".");
        if (!tokens.length || tokens.every(token => text.includes(token))) confirmingHosts.add(hostname(source.url));
      }
      if (confirmingHosts.size < 2) failures.push(`Sensitive claim lacks matching confirmation from two official sources: ${claim.claim}`);
    }
  }
  const checkedAt = (input.now || new Date()).toISOString();
  return { passed: failures.length === 0, sensitive: sensitiveClaims.length > 0, failures: [...new Set(failures)], checkedAt, requiredAuthority: rule?.label || null, sourceCount: input.sources.length, officialHostCount: distinctOfficialHosts.length };
}
