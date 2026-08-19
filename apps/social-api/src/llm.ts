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

export type StructuredRequest = {
  instructions: string;
  input: string;
  schemaName: string;
  schema: unknown;
  timeoutMs?: number;
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
  // is tiny. Waiting out the window is the correct response: failing here would instead
  // consume one of the topic's limited repair attempts for a non-editorial reason.
  try {
    return await callProvider(request, config);
  } catch (error) {
    if (!(error instanceof LlmRateLimitError)) throw error;
    const waitSeconds = Math.min(error.retryAfterSeconds ?? 65, 120);
    await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
    return callProvider(request, config);
  }
}

async function callProvider(
  request: StructuredRequest,
  config: LlmConfig,
): Promise<{ text: string; model: string }> {
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
    return { text, model: config.model };
  }

  // Groq exposes an OpenAI-compatible chat/completions endpoint.
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.2,
      // Groq's free tier allows 8000 tokens per minute, and max_completion_tokens is
      // *reserved* against that budget rather than measured after the fact. The system
      // prompt is roughly 2300 tokens, so anything above ~5500 here is rejected outright
      // with a 413 before the model runs. Too low is also fatal: gpt-oss spends
      // completion tokens on reasoning first, and a truncated object makes Groq reject
      // the whole call with json_validate_failed. 5000 leaves room for both.
      max_completion_tokens: Number(process.env.LLM_MAX_TOKENS ?? 5_000),
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
  const result = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const text = result.choices?.[0]?.message?.content;
  if (!text) throw new Error(`${config.provider} returned no structured output`);
  return { text, model: config.model };
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
