export type RetryDecision = {
  retry: boolean;
  blocked: boolean;
  delayMinutes: number | null;
};

const delays = [2, 10, 30, 120, 360, 720] as const;

export function retryDecision(attempt: number, retryable: boolean, ambiguous = false, minimumDelayMinutes = 0): RetryDecision {
  const normalizedAttempt = Math.max(1, Math.trunc(attempt));
  const blocked = ambiguous;
  const retry = retryable && !blocked && normalizedAttempt <= delays.length;
  return {
    retry,
    blocked,
    delayMinutes: retry ? Math.max(delays[Math.min(normalizedAttempt - 1, delays.length - 1)], Math.max(0, Math.ceil(minimumDelayMinutes))) : null,
  };
}
