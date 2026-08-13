const ignored = new Set([
  "about", "after", "before", "change", "changes", "for", "from", "how", "new", "official",
  "portugal", "portuguese", "the", "this", "update", "updates", "what", "when", "with",
]);

const words = (value: string) => value.toLocaleLowerCase("pt").normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").match(/[a-z0-9]{3,}/g)?.filter(word => !ignored.has(word)) ?? [];

export function sourceSupportsNewsTopic(topic: string, sourceTitle: string, excerpts: string[]) {
  const terms = [...new Set(words(topic))];
  if (!terms.length) return false;
  const evidence = words(`${sourceTitle} ${excerpts.join(" ")}`);
  const evidenceTerms = new Set(evidence);
  const matched = terms.filter(term => evidenceTerms.has(term));
  return matched.length >= Math.min(2, terms.length);
}
