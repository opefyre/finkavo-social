export type RetryDecision = {
  retry: boolean;
  blocked: boolean;
  delayMinutes: number | null;
};

const delays = [2, 10, 30] as const;

export function retryDecision(attempt: number, retryable: boolean, ambiguous = false): RetryDecision {
  const normalizedAttempt = Math.max(1, Math.trunc(attempt));
  const blocked = ambiguous;
  const retry = retryable && !blocked && normalizedAttempt < 3;
  return {
    retry,
    blocked,
    delayMinutes: retry ? delays[Math.min(normalizedAttempt - 1, delays.length - 1)] : null,
  };
}
