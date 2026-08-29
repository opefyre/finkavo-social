// A generation failure says something about the attempt, not always about the topic.
// Of the 245 failures behind the first big cull, a large share were provider timeouts,
// token-per-minute pacing, truncated JSON and schema mismatches — the model never got
// far enough to have an opinion on the subject. Retiring the topic for those is how a
// 153-topic bank shrank to 45 eligible while looking, from the outside, like exhaustion.
export type BlockKind =
  | "infrastructure"
  | "content_quality"
  | "evidence"
  | "duplicate"
  | "relevance"
  | "no_source"
  | "reviewer"
  | "superseded";

// Only content_quality and evidence are ever the topic's fault, and even those earn
// retirement by repetition rather than on the first miss.
const INFRASTRUCTURE = [
  /timed?\s*out|timeout|aborted due to timeout/i,
  /rate limit|too many requests|\b429\b|token\/rate/i,
  /request too large|context length|maximum context|token limit/i,
  /paced locally|needs \d+s before this request fits/i,
  /expected [,'"}\]]+ or [,'"}\]]+|unexpected (?:token|end of)|json at position|unterminated string/i,
  /does not match the expected|generated json does not match|invalid schema|response_format/i,
  /bad gateway|service unavailable|internal server error|upstream/i,
  /socket hang up|econnreset|enotfound|etimedout|fetch failed|network error/i,
  /all providers|no provider available|provider cooldown|quota exhausted/i,
];

const EVIDENCE = [
  /evidence reliability gate/i,
  /sensitive evidence is older than/i,
  /two independent official sources|two official sources/i,
  /not supported by the supplied excerpts/i,
  /evidence quote was not found verbatim/i,
];

export type FailureClass = { kind: BlockKind; retryable: boolean; reason: string };

export function classifyGenerationFailure(rawError: unknown): FailureClass {
  const reason = String(rawError ?? "unknown generation failure").slice(0, 400);
  if (INFRASTRUCTURE.some(pattern => pattern.test(reason))) {
    return { kind: "infrastructure", retryable: true, reason };
  }
  if (EVIDENCE.some(pattern => pattern.test(reason))) {
    // Evidence can go stale and come back; re-research is a real path to recovery.
    return { kind: "evidence", retryable: true, reason };
  }
  return { kind: "content_quality", retryable: true, reason };
}

// How many times a topic may fail generation before it is genuinely retired. An
// infrastructure failure does not count against it at all — it never reached the point
// of being judged, so charging it an attempt would let one bad provider afternoon retire
// a week of perfectly good topics.
export const MAX_GENERATION_ATTEMPTS = 5;

// Not charging infrastructure an attempt was right, but it left nothing at all holding the
// other end: a concept whose evidence bundle reliably truncates the model's JSON, or whose
// every call times out, is never judged and so never retires. One concept was attempted 84
// times with its counter reading 6. It is not a bad topic — it is a topic this pipeline
// cannot currently get through the model, and after enough tries that distinction stops
// mattering, because it is spending the day's calls and starving everything behind it.
//
// So there are two ceilings. Five *judged* failures still retire a topic on its merits.
// Twenty attempts of any kind retire it as unworkable, which is deliberately far enough
// above five that a bad provider afternoon cannot reach it.
export const MAX_TOTAL_ATTEMPTS = 20;

export function countsAsAttempt(failure: FailureClass): boolean {
  return failure.kind !== "infrastructure";
}

export function shouldRetireConcept(failure: FailureClass, attemptsAfterThisOne: number, totalAttemptsAfterThisOne = 0): boolean {
  if (totalAttemptsAfterThisOne >= MAX_TOTAL_ATTEMPTS) return true;
  if (!countsAsAttempt(failure)) return false;
  return attemptsAfterThisOne >= MAX_GENERATION_ATTEMPTS;
}
