const stopWords = new Set([
  "about", "after", "before", "checklist", "edge", "edges", "exception", "exceptions", "explained",
  "explanation", "getting", "golden", "guide", "mistake", "mistakes", "moving", "new", "plain",
  "portugal", "portuguese", "practical", "residents", "simple", "step", "things", "tip", "understand",
  "verify", "what", "when", "where", "which", "with", "your",
]);

const recurringIntents = new Set(["deadline_reminder", "occasion", "regulatory_change", "timely_news"]);
const subjectPatterns: Array<[string, RegExp]> = [
  ["nif", /\bnif\b/i], ["niss", /\bniss\b/i], ["sns24", /\bsns\s*24\b/i],
  ["irs", /\birs\b/i], ["iva", /\biva\b/i], ["iuc", /\biuc\b/i],
  ["imi", /\bimi\b/i], ["aimi", /\baimi\b/i], ["aima", /\baima\b/i],
  ["modelo3", /\bmodelo\s*3\b/i], ["cmd", /chave m[oó]vel digital/i],
];

export type DuplicateCandidate = { id?: unknown; topic?: unknown; category?: unknown; audience?: unknown; post_intent?: unknown; postIntent?: unknown; content_hash?: unknown; subject_family?: unknown; user_question?: unknown; content_intent?: unknown; occurrence_key?: unknown };

const normalized = (value: unknown) => String(value || "").toLocaleLowerCase("en").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const tokens = (value: unknown) => new Set(normalized(value).split(" ").filter(token => token.length >= 3 && !stopWords.has(token)));
const subjects = (value: unknown) => new Set(subjectPatterns.filter(([, pattern]) => pattern.test(String(value || ""))).map(([name]) => name));
const intent = (value: DuplicateCandidate) => String(value.post_intent || value.postIntent || "evergreen_explainer");

// Interrogatives, auxiliaries and the stock verbs of an explainer. A topic built only
// from these plus its subject tag is saying "here is what X is" and nothing more; a
// topic that keeps a word after they are removed is about something in particular.
const genericWords = new Set([
  "and", "are", "apply", "applying", "but", "can", "could", "does", "english", "explain",
  "for", "from", "get", "gets", "how", "into", "its", "means", "meaning", "need", "needs",
  "not", "out", "own", "request", "requesting", "should", "that", "the", "this", "use",
  "used", "using", "was", "were", "who", "whom", "whose", "why", "work", "works", "you",
]);

const specifics = (value: unknown) => {
  const subjectTags = subjects(value);
  return new Set([...tokens(value)].filter(token =>
    !genericWords.has(token) && !subjectTags.has(token) && !subjectPatterns.some(([name, pattern]) => subjectTags.has(name) && pattern.test(token))));
};

export function duplicateReason(candidate: DuplicateCandidate, existing: DuplicateCandidate): string | null {
  if (candidate.content_hash && existing.content_hash && candidate.content_hash === existing.content_hash) return "identical content";
  const candidateTopic = normalized(candidate.topic);
  const existingTopic = normalized(existing.topic);
  if (!candidateTopic || !existingTopic) return null;
  if (candidate.occurrence_key && existing.occurrence_key && candidate.occurrence_key === existing.occurrence_key) return "identical campaign occurrence";
  if (candidate.occurrence_key && existing.occurrence_key && candidate.occurrence_key !== existing.occurrence_key) return null;
  if (candidateTopic === existingTopic) return "identical topic";
  if (candidate.subject_family && candidate.user_question && candidate.content_intent &&
      candidate.subject_family === existing.subject_family && candidate.user_question === existing.user_question &&
      candidate.content_intent === existing.content_intent && String(candidate.audience || "") === String(existing.audience || "") &&
      !candidate.occurrence_key && !existing.occurrence_key) return "identical editorial brief";
  if (recurringIntents.has(intent(candidate)) || recurringIntents.has(intent(existing))) return null;

  // Sharing a subject tag used to be decisive on its own: any two topics that both said
  // "IRS" were duplicates. IRS is the largest single subject in Portuguese personal
  // finance, so that rule quietly capped the account at roughly one IRS post ever. It
  // retired twelve good, separately-evidenced topics — the fifteen-per-cent rent
  // deduction, the reinvestment window, the 365-day crypto rule — as repeats of one
  // another, which is most of why the topic bank looked exhausted.
  //
  // What the rule was really reaching for is not the subject but the specificity. Two
  // bare explainers of the same instrument ("what a NIF is", "who can request a NIF")
  // are the same post. Two distinct rules inside one instrument are not. So a shared
  // subject only blocks when at least one side carries nothing specific beyond the
  // subject itself and the generic vocabulary of an explainer.
  const candidateSubjects = subjects(candidate.topic);
  const sharedSubject = [...subjects(existing.topic)].find(subject => candidateSubjects.has(subject));
  if (sharedSubject && (specifics(candidate.topic).size === 0 || specifics(existing.topic).size === 0)) {
    return `repeated generic ${sharedSubject.toUpperCase()} explainer`;
  }

  const left = tokens(candidate.topic);
  const right = tokens(existing.topic);
  const intersection = [...left].filter(token => right.has(token)).length;
  const containment = intersection / Math.max(1, Math.min(left.size, right.size));
  if (sharedSubject && intersection >= 2 && containment >= 0.5) return `repeated ${sharedSubject.toUpperCase()} topic`;
  if (intersection >= 2 && containment >= 0.7) return "substantially repeated topic";
  return null;
}

export function findDuplicate(candidate: DuplicateCandidate, existing: DuplicateCandidate[]) {
  for (const post of existing) {
    if (candidate.id && String(candidate.id) === String(post.id)) continue;
    const reason = duplicateReason(candidate, post);
    if (reason) return { post, reason };
  }
  return null;
}
