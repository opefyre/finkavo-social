// Provider-agnostic structured-generation client.
//
// The workflow runs at zero marginal cost, so generation defaults to Groq's free tier
// rather than paid OpenAI. Both speak JSON-schema-constrained structured output; they
// differ only in endpoint shape, so the provider is a small adapter and the model can be
// changed with env vars alone.

export type LlmProvider = "groq" | "openai";

export type LlmConfig = {
  provider: LlmProvider;
  apiKey: string;
  model: string;
  baseUrl: string;
};

const DEFAULTS: Record<LlmProvider, { baseUrl: string; model: string; keyEnv: string }> = {
  groq: {
    baseUrl: "https://api.groq.com/openai/v1",
    model: "openai/gpt-oss-120b",
    keyEnv: "GROQ_API_KEY",
  },
  openai: {
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-5-mini",
    keyEnv: "OPENAI_API_KEY",
  },
};

export function resolveLlmConfig(): LlmConfig {
  const provider = (process.env.LLM_PROVIDER ?? "groq") as LlmProvider;
  const defaults = DEFAULTS[provider];
  if (!defaults) throw new Error(`Unsupported LLM_PROVIDER '${provider}'`);

  const apiKey = process.env.LLM_API_KEY || process.env[defaults.keyEnv];
  if (!apiKey) {
    throw new Error(`No API key for LLM provider '${provider}' (set LLM_API_KEY or ${defaults.keyEnv})`);
  }

  return {
    provider,
    apiKey,
    model: process.env.LLM_MODEL || defaults.model,
    baseUrl: (process.env.LLM_BASE_URL || defaults.baseUrl).replace(/\/$/, ""),
  };
}

// Tokens per minute allowed by the provider tier, and the share of it a single request
// may claim. Groq reserves max_completion_tokens up front, so the request must fit
// entirely inside one window.
const TOKENS_PER_MINUTE = Number(process.env.LLM_TOKENS_PER_MINUTE ?? 8_000);
const SAFETY_MARGIN = 400;
// Conservative for mixed English/Portuguese with accents and JSON punctuation, which
// tokenise worse than plain English prose.
const CHARS_PER_TOKEN = 3.2;
const MIN_COMPLETION_TOKENS = 2_600;

const estimateTokens = (text: string) => Math.ceil(text.length / CHARS_PER_TOKEN);

// ---------------------------------------------------------------------------------
// Pacing.
//
// The free tier is a rolling per-minute allowance, and nothing here used to watch it:
// requests went out back to back and the first sign of trouble was a 429 that had
// already cost a generation attempt. A burst of three repairs for one topic can spend
// the whole minute in seconds, so the fix is to hold a request at the door until the
// window can afford it rather than to apologise for it afterwards.
//
// Waits are only taken inline when they are short. A caller is an open HTTP request from
// n8n, so blocking it for the eleven minutes a daily-quota reset can ask for would time
// the trigger out and lose the work. Anything longer than PACING_MAX_INLINE_WAIT_MS is
// raised as a rate-limit error instead, which the server already treats as a deferral:
// the concept keeps its repair attempts and is picked up on the next tick.
const REQUESTS_PER_MINUTE = Number(process.env.LLM_REQUESTS_PER_MINUTE ?? 25);
// The per-minute window is not the real ceiling. The free tier also caps tokens per day
// — 200,000, against requests that reserve about 6,900 each, so roughly 29 attempts for
// the whole day. Running into that wall unannounced is what left an afternoon with no
// drafts and no explanation. Tracked here so the limit is refused deliberately, with the
// same deferral every other pacing decision uses, rather than discovered as a 429.
const TOKENS_PER_DAY = Number(process.env.LLM_TOKENS_PER_DAY ?? 200_000);
const DAY_MS = 24 * 60 * 60 * 1000;
const PACING_MAX_INLINE_WAIT_MS = Number(process.env.LLM_MAX_INLINE_WAIT_MS ?? 45_000);
const PACING_MIN_GAP_MS = Number(process.env.LLM_MIN_GAP_MS ?? 1_200);
const WINDOW_MS = 60_000;

type Spend = { at: number; tokens: number };
let spends: Spend[] = [];
/** Same records, kept for a day rather than a minute, for the daily ceiling. */
let dailySpends: Spend[] = [];
let lastCallAt = 0;
/** Set when the provider itself tells us to back off; no request goes out before it. */
let providerBlockedUntil = 0;
/** Requests queue rather than race: two callers must not both read the same free window. */
let gate: Promise<unknown> = Promise.resolve();

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function dailyTokens(now: number) {
  dailySpends = dailySpends.filter(spend => now - spend.at < DAY_MS);
  return dailySpends.reduce((total, spend) => total + spend.tokens, 0);
}

function windowState(now: number) {
  spends = spends.filter(spend => now - spend.at < WINDOW_MS);
  return {
    tokens: spends.reduce((total, spend) => total + spend.tokens, 0),
    requests: spends.length,
    oldest: spends.length ? spends[0].at : now,
  };
}

/** Milliseconds until this request fits the window, or 0 if it fits now. */
function waitFor(estimated: number, now: number): number {
  if (now < providerBlockedUntil) return providerBlockedUntil - now;
  // A day's allowance cannot be waited out inside a request, so exhausting it is
  // reported rather than slept on: the oldest spend has to age a full day to free room.
  if (dailyTokens(now) + estimated > TOKENS_PER_DAY) {
    const oldest = dailySpends.length ? dailySpends[0].at : now;
    return Math.max(WINDOW_MS, DAY_MS - (now - oldest));
  }
  const { tokens, requests, oldest } = windowState(now);
  const overTokens = tokens + estimated > TOKENS_PER_MINUTE - SAFETY_MARGIN;
  const overRequests = requests + 1 > REQUESTS_PER_MINUTE;
  if (!overTokens && !overRequests) {
    const gap = PACING_MIN_GAP_MS - (now - lastCallAt);
    return gap > 0 && lastCallAt > 0 ? gap : 0;
  }
  // The window frees up as the oldest spend ages out of it.
  return Math.max(250, WINDOW_MS - (now - oldest) + 250);
}

/**
 * Holds the caller until the per-minute allowance can afford `estimated` tokens, then
 * records the reservation. Serialised so concurrent callers cannot both claim the same
 * headroom. Returns a settle() to reconcile the reservation against real usage.
 */
async function reserve(estimated: number): Promise<(actual: number | null) => void> {
  const claim = gate.then(async () => {
    for (;;) {
      const now = Date.now();
      const wait = waitFor(estimated, now);
      if (wait === 0) break;
      if (wait > PACING_MAX_INLINE_WAIT_MS) {
        // Naming which of the two is holding the request matters when reading the logs:
        // a provider back-off is the tier refusing us for minutes, while a full local
        // window clears within the minute.
        const spentToday = dailyTokens(now);
        const reason = now < providerBlockedUntil
          ? `the provider asked for a ${Math.ceil((providerBlockedUntil - now) / 1000)}s back-off`
          : spentToday + estimated > TOKENS_PER_DAY
            ? `the ${TOKENS_PER_DAY}-token day is spent (${spentToday} used)`
            : `the ${TOKENS_PER_MINUTE}-token minute is full`;
        throw new LlmRateLimitError(
          `paced locally: rate limit deferred this request because ${reason}`,
          Math.ceil(wait / 1000),
        );
      }
      await sleep(wait);
    }
    const at = Date.now();
    lastCallAt = at;
    const spend: Spend = { at, tokens: estimated };
    spends.push(spend);
    dailySpends.push(spend);
    return spend;
  });
  // Keep the queue intact even when this caller gives up, so the next one still waits.
  gate = claim.catch(() => undefined);
  const spend = await claim;
  return (actual: number | null) => {
    if (actual !== null && Number.isFinite(actual)) spend.tokens = actual;
  };
}

/** What the day has left, for health reporting. */
export function llmDailyBudget() {
  const now = Date.now();
  const spent = dailyTokens(now);
  return { limit: TOKENS_PER_DAY, spent, remaining: Math.max(0, TOKENS_PER_DAY - spent), blockedUntil: providerBlockedUntil > now ? new Date(providerBlockedUntil).toISOString() : null };
}

/** Called when the provider returns a pacing signal, so every caller backs off, not one. */
function blockProvider(seconds: number) {
  providerBlockedUntil = Math.max(providerBlockedUntil, Date.now() + Math.max(1, seconds) * 1000);
}

/**
 * Largest completion the provider will accept alongside this input. Falls back to a
 * floor rather than zero: if the input is so large that nothing fits, the request should
 * fail loudly as a 413 rather than silently ask for a truncated, schema-invalid object.
 */
function completionBudget(request: { instructions: string; input: string; schema?: unknown; maxCompletionTokens?: number }): number {
  // The JSON schema is sent with the request and counts against the same window; at
  // ~2100 characters it is not a rounding error.
  const schemaTokens = request.schema ? estimateTokens(JSON.stringify(request.schema)) : 0;
  const used = estimateTokens(request.instructions) + estimateTokens(request.input) + schemaTokens;
  const available = TOKENS_PER_MINUTE - used - SAFETY_MARGIN;
  const ceiling = request.maxCompletionTokens ?? Number(process.env.LLM_MAX_TOKENS ?? 5_000);
  return Math.max(MIN_COMPLETION_TOKENS, Math.min(ceiling, available));
}

export type StructuredRequest = {
  instructions: string;
  input: string;
  schemaName: string;
  schema: unknown;
  timeoutMs?: number;
  maxCompletionTokens?: number;
};

/**
 * Returns the raw JSON text produced under the supplied schema. Callers parse and
 * validate it themselves so that a schema-shaped but semantically wrong response still
 * goes through the normal repair loop.
 */
export async function generateStructured(
  request: StructuredRequest,
  config: LlmConfig = resolveLlmConfig(),
): Promise<{ text: string; model: string }> {
  // The free tier's ceiling is per minute, so a burst — an initial generation plus two
  // repairs for the same topic — can exhaust it in seconds even though the daily volume
  // is tiny. The request is now paced before it is sent rather than after it is refused;
  // a 429 that still gets through backs every caller off, not just this one.
  const estimated = estimateTokens(request.instructions) + estimateTokens(request.input)
    + (request.schema ? estimateTokens(JSON.stringify(request.schema)) : 0)
    + completionBudget(request);

  for (let attempt = 1; ; attempt++) {
    const settle = await reserve(estimated);
    try {
      const result = await callProvider(request, config);
      settle(result.totalTokens);
      return { text: result.text, model: result.model };
    } catch (error) {
      // A refused request still cost the provider nothing, so release the reservation.
      settle(0);
      if (!(error instanceof LlmRateLimitError)) throw error;
      blockProvider(error.retryAfterSeconds ?? 65);
      // One inline retry, and only when the wait is short enough to hold the caller for.
      const waitMs = Math.max(0, providerBlockedUntilMs() - Date.now());
      if (attempt >= 2 || waitMs > PACING_MAX_INLINE_WAIT_MS) throw error;
    }
  }
}

/** Exposed for the retry decision above; the value itself stays private to the gate. */
function providerBlockedUntilMs(): number {
  return providerBlockedUntil;
}

async function callProvider(
  request: StructuredRequest,
  config: LlmConfig,
): Promise<{ text: string; model: string; totalTokens: number | null }> {
  const timeout = AbortSignal.timeout(request.timeoutMs ?? 90_000);

  if (config.provider === "openai") {
    const response = await fetch(`${config.baseUrl}/responses`, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.model,
        instructions: request.instructions,
        input: request.input,
        text: { format: { type: "json_schema", name: request.schemaName, strict: true, schema: request.schema } },
      }),
      signal: timeout,
    });
    if (!response.ok) throw new Error(await describeFailure(response, config));
    const result = await response.json() as {
      output_text?: string;
      output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
    };
    const text = result.output_text
      ?? result.output?.flatMap(item => item.content ?? []).find(item => item.type === "output_text")?.text;
    if (!text) throw new Error(`${config.provider} returned no structured output`);
    return { text, model: config.model, totalTokens: null };
  }

  // Groq exposes an OpenAI-compatible chat/completions endpoint.
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.2,
      // The free tier counts prompt + reserved completion against one 8000-token minute.
      // A fixed completion ceiling therefore fails as soon as the input grows: once real
      // evidence excerpts were ingested the same request went from fitting to 13,500
      // tokens. The ceiling is derived from what the input actually costs so the request
      // is always inside the window.
      max_completion_tokens: completionBudget(request),
      reasoning_effort: process.env.LLM_REASONING_EFFORT ?? "low",
      response_format: {
        type: "json_schema",
        json_schema: { name: request.schemaName, strict: true, schema: request.schema },
      },
      messages: [
        { role: "system", content: request.instructions },
        { role: "user", content: request.input },
      ],
    }),
    signal: timeout,
  });
  if (!response.ok) throw new Error(await describeFailure(response, config));
  const result = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { total_tokens?: number };
  };
  const text = result.choices?.[0]?.message?.content;
  if (!text) throw new Error(`${config.provider} returned no structured output`);
  // Groq reports what the call really cost. Trusting it over the estimate keeps the
  // window honest: the estimate reserves the completion ceiling, which is usually far
  // more than the model actually writes.
  return { text, model: config.model, totalTokens: result.usage?.total_tokens ?? null };
}

// Rate limits are a normal operating condition on a free tier, so they must stay
// distinguishable from real failures: the caller retries a 429 and fails a 400.
export class LlmRateLimitError extends Error {
  constructor(message: string, readonly retryAfterSeconds: number | null) {
    super(message);
    this.name = "LlmRateLimitError";
  }
}

async function describeFailure(response: Response, config: LlmConfig): Promise<string> {
  const detail = await response.text().catch(() => "");
  const summary = detail.slice(0, 300);

  // 429 is the usual rate limit. 413 on Groq means the request plus its reserved
  // completion budget exceeds the per-minute token allowance — also a pacing problem,
  // not a bad request, so both wait rather than burning a repair attempt.
  if (response.status === 429 || response.status === 413) {
    const header = response.headers.get("retry-after");
    const parsed = header ? Number(header) : NaN;
    const retryAfter = Number.isFinite(parsed) ? parsed : null;
    throw new LlmRateLimitError(
      `${config.provider} token/rate limit hit${retryAfter ? ` (retry after ${retryAfter}s)` : ""}: ${summary}`,
      retryAfter,
    );
  }
  return `${config.provider} request failed (${response.status}) using model ${config.model}: ${summary}`;
}
