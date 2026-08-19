// Provider-agnostic structured-generation client.
//
// The workflow runs at zero marginal cost, so generation defaults to Groq's free tier
// rather than paid OpenAI. Both speak JSON-schema-constrained structured output; they
// differ only in endpoint shape, so the provider is a small adapter and the model can be
// changed with env vars alone.

export type LlmProvider = "groq" | "openai" | "openrouter";

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
  // Free-tier standby. Its models are reached through an OpenAI-compatible endpoint, so
  // it needs no adapter of its own beyond not sending Groq's parameters.
  openrouter: {
    baseUrl: "https://openrouter.ai/api/v1",
    model: "nvidia/nemotron-3-super-120b-a12b:free",
    keyEnv: "OPENROUTER_API_KEY",
  },
};

// Groq's day runs out well before the work does, and when it does there is nothing to
// fall back on but waiting. These are the standby models, tried in order, and every one
// of them is free: a paid model would turn a quiet afternoon into a bill without anyone
// choosing it. Each is checked at startup for structured-output support, because a model
// that cannot honour a JSON schema is no use to a pipeline built entirely on them.
const FREE_MODEL_SUFFIX = ":free";

export function resolveFallbackConfigs(): LlmConfig[] {
  const provider = (process.env.LLM_FALLBACK_PROVIDER ?? "") as LlmProvider;
  if (!provider) return [];
  const defaults = DEFAULTS[provider];
  if (!defaults) return [];
  const apiKey = process.env[defaults.keyEnv];
  if (!apiKey) return [];

  const models = (process.env.LLM_FALLBACK_MODELS ?? defaults.model)
    .split(",").map(entry => entry.trim()).filter(Boolean)
    // Never silently spend money as a fallback. If a paid model is listed it is dropped
    // rather than used, because the whole point of the standby is that it stays free.
    .filter(model => provider !== "openrouter" || model.endsWith(FREE_MODEL_SUFFIX));

  return models.map(model => ({
    provider,
    apiKey,
    model,
    baseUrl: (process.env.LLM_FALLBACK_BASE_URL || defaults.baseUrl).replace(/\/$/, ""),
  }));
}

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
// Long enough to sit out a full token minute. A request costs about 4,500 of the 8,000,
// so only one fits per minute and the second has to wait roughly sixty seconds — under a
// 45-second limit that wait was refused instead, turning a queue into a deferral and
// halving how many drafts a recovery run could attempt. Waiting is bounded by the window
// itself, and the caller's timeout is now nine minutes, so it is affordable. Anything
// genuinely longer — a provider back-off, a spent day — still defers rather than blocks.
const PACING_MAX_INLINE_WAIT_MS = Number(process.env.LLM_MAX_INLINE_WAIT_MS ?? 70_000);
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
  return {
    limit: TOKENS_PER_DAY, spent, remaining: Math.max(0, TOKENS_PER_DAY - spent),
    blockedUntil: providerBlockedUntil > now ? new Date(providerBlockedUntil).toISOString() : null,
    standbys: resolveFallbackConfigs().map(config => config.model),
    standbyBlockedUntil: standbyBlockedUntil > now ? new Date(standbyBlockedUntil).toISOString() : null,
  };
}

// OpenRouter's free tier allows fifty model requests a day, shared across every free
// model on it, and says so in a header when it refuses. Without honouring that, each
// generation spends a call per standby rediscovering the same exhaustion. Blocked until
// the reset it names, the standbys are skipped and the concept defers cleanly instead.
let standbyBlockedUntil = 0;

function standbyAvailable() { return Date.now() >= standbyBlockedUntil; }

function noteStandbyRefusal(resetHeader: string | null) {
  const resetMs = Number(resetHeader);
  standbyBlockedUntil = Number.isFinite(resetMs) && resetMs > Date.now()
    ? resetMs
    : Date.now() + 60 * 60 * 1000;
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
function completionBudget(request: { instructions: string; input: string; schema?: unknown; maxCompletionTokens?: number }, provider: LlmProvider = "groq"): number {
  // Standby budgets are their own: see the reasoning note on the request body below.
  if (provider !== "groq") return request.maxCompletionTokens ?? Number(process.env.LLM_FALLBACK_MAX_TOKENS ?? 6_000);
  // The JSON schema is sent with the request and counts against the same window; at
  // ~2100 characters it is not a rounding error.
  const schemaTokens = request.schema ? estimateTokens(JSON.stringify(request.schema)) : 0;
  const used = estimateTokens(request.instructions) + estimateTokens(request.input) + schemaTokens;
  const available = TOKENS_PER_MINUTE - used - SAFETY_MARGIN;
  // Groq admits a request on what it reserves, not what it ends up using, and the daily
  // allowance is what runs out first. Reserving 5,000 against real drafts that complete
  // in about 1,100 spent a third of the day's tokens on headroom nothing ever occupied:
  // 6,890 a request instead of 4,490, which is 29 attempts in a day rather than 44. The
  // floor below is still 2,600, so this leaves better than twice what a draft has needed.
  const ceiling = request.maxCompletionTokens ?? Number(process.env.LLM_MAX_TOKENS ?? 2_600);
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
): Promise<{ text: string; model: string; totalTokens: number | null }> {
  // The free tier's ceiling is per minute, so a burst — an initial generation plus two
  // repairs for the same topic — can exhaust it in seconds even though the daily volume
  // is tiny. The request is now paced before it is sent rather than after it is refused;
  // a 429 that still gets through backs every caller off, not just this one.
  const estimated = estimateTokens(request.instructions) + estimateTokens(request.input)
    + (request.schema ? estimateTokens(JSON.stringify(request.schema)) : 0)
    + completionBudget(request);

  let paced: LlmRateLimitError | null = null;
  for (let attempt = 1; attempt <= 2 && !paced; attempt++) {
    const settle = await reserve(estimated).catch(error => {
      if (error instanceof LlmRateLimitError) { paced = error; return null; }
      throw error;
    });
    if (!settle) break;
    try {
      const result = await callProvider(request, config);
      settle(result.totalTokens);
      return { text: result.text, model: result.model, totalTokens: result.totalTokens };
    } catch (error) {
      // A refused request still cost the provider nothing, so release the reservation.
      settle(0);
      if (!(error instanceof LlmRateLimitError)) throw error;
      blockProvider(error.retryAfterSeconds ?? 65);
      // One inline retry, and only when the wait is short enough to hold the caller for.
      const waitMs = Math.max(0, providerBlockedUntilMs() - Date.now());
      if (attempt >= 2 || waitMs > PACING_MAX_INLINE_WAIT_MS) { paced = error; break; }
    }
  }

  // The primary is rate limited or out of tokens for the day. That is a statement about
  // the account, not the request, so the same work is offered to the free standby models
  // in turn. Only a pacing failure gets here: a malformed request would fail identically
  // everywhere and should surface as itself rather than be retried four more times.
  for (const fallback of standbyAvailable() ? resolveFallbackConfigs() : []) {
    try {
      const result = await callProvider(request, fallback);
      return { text: result.text, model: result.model, totalTokens: result.totalTokens };
    } catch (error) {
      // A standby with its own limit reached, or one that cannot hold the schema, just
      // means the next one gets a turn. Anything else is a real fault and stops here.
      if (error instanceof LlmRateLimitError) continue;
      if (error instanceof Error && /\((?:4\d\d|5\d\d)\)|no structured output/i.test(error.message)) continue;
      throw error;
    }
  }
  throw paced ?? new LlmRateLimitError("every provider is rate limited", 60);
}

/** Exposed for the retry decision above; the value itself stays private to the gate. */
function providerBlockedUntilMs(): number {
  return providerBlockedUntil;
}

async function callProvider(
  request: StructuredRequest,
  config: LlmConfig,
): Promise<{ text: string; model: string; totalTokens: number | null }> {
  const timeout = AbortSignal.timeout(
    request.timeoutMs ?? (config.provider === "groq" ? 90_000 : Number(process.env.LLM_FALLBACK_TIMEOUT_MS ?? 240_000)),
  );

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

  // Groq and OpenRouter both expose an OpenAI-compatible chat/completions endpoint, but
  // only Groq takes max_completion_tokens and reasoning_effort; sending them onward makes
  // some models reject the whole request.
  const isGroq = config.provider === "groq";
  const budget = completionBudget(request, config.provider);
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      ...(config.provider === "openrouter" ? { "X-Title": "Finkavo Social" } : {}),
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.2,
      // The free tier counts prompt + reserved completion against one 8000-token minute.
      // A fixed completion ceiling therefore fails as soon as the input grows: once real
      // evidence excerpts were ingested the same request went from fitting to 13,500
      // tokens. The ceiling is derived from what the input actually costs so the request
      // is always inside the window.
      // Both standbys reason before answering, and their thinking is charged against the
      // same ceiling as the answer. Nemotron given 5,000 tokens spent 4,000 of them
      // thinking and returned an object cut off at its second line; given 16,000 it spent
      // every one and still returned nothing valid, taking 106 seconds to do it. Turning
      // reasoning off it answers in under a thousand tokens, in full, first time. So the
      // fix is not more room — it is not asking for the deliberation in the first place.
      ...(isGroq
        ? { max_completion_tokens: budget, reasoning_effort: process.env.LLM_REASONING_EFFORT ?? "low" }
        : { max_tokens: budget, reasoning: { enabled: false } }),
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
    if (config.provider === "openrouter" && /free-models-per-day|openrouter_free_tier_daily/i.test(detail)) {
      const reset = /"X-RateLimit-Reset":"(\d+)"/i.exec(detail)?.[1] ?? null;
      noteStandbyRefusal(reset);
    }
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
