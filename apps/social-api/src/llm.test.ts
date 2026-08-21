import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The gate keeps its window in module state, so each case imports a fresh copy.
async function freshClient(env: Record<string, string>) {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) process.env[key] = value;
  return import("./llm.js");
}

const BASE_ENV = {
  LLM_PROVIDER: "groq",
  LLM_API_KEY: "test-key",
  LLM_TOKENS_PER_MINUTE: "4000",
  LLM_MIN_GAP_MS: "0",
  // Any wait at all should surface as a deferral rather than stall the test.
  LLM_MAX_INLINE_WAIT_MS: "50",
};

const REQUEST = {
  instructions: "write a post",
  input: "evidence",
  schemaName: "draft",
  schema: { type: "object" },
};

function respondWith(totalTokens: number | undefined) {
  return vi.fn(async () => new Response(
    JSON.stringify({
      choices: [{ message: { content: '{"ok":true}' } }],
      ...(totalTokens === undefined ? {} : { usage: { total_tokens: totalTokens } }),
    }),
    { status: 200, headers: { "content-type": "application/json" } },
  ));
}

let originalFetch: typeof globalThis.fetch;
beforeEach(() => { originalFetch = globalThis.fetch; });
afterEach(() => { globalThis.fetch = originalFetch; vi.restoreAllMocks(); });

describe("free-tier pacing", () => {
  it("holds a request that the per-minute window cannot afford instead of sending it", async () => {
    const fetchMock = respondWith(undefined);
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { generateStructured, LlmRateLimitError } = await freshClient(BASE_ENV);

    // The first request reserves the completion ceiling and fills the window.
    await expect(generateStructured(REQUEST)).resolves.toMatchObject({ model: expect.any(String) });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // The second cannot fit, and is refused locally rather than sent and rejected by Groq.
    await expect(generateStructured(REQUEST)).rejects.toBeInstanceOf(LlmRateLimitError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("trues the reservation up to what the call really cost, freeing the rest", async () => {
    // The reservation assumes the full completion ceiling; the model rarely writes it.
    // At the real 8000-token minute two reservations of ~5050 would not fit together,
    // so a second call only succeeds if the first was trued down to what it really used.
    const fetchMock = respondWith(120);
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { generateStructured } = await freshClient({ ...BASE_ENV, LLM_TOKENS_PER_MINUTE: "8000" });

    await generateStructured(REQUEST);
    // Having spent 120 rather than the reserved ~3600, there is room for more work.
    await expect(generateStructured(REQUEST)).resolves.toBeTruthy();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("refuses a request the day's allowance cannot cover, and says so", async () => {
    // The per-minute window is wide open here; only the daily ceiling is in the way,
    // which is the failure that used to arrive as an unexplained afternoon of no drafts.
    const fetchMock = respondWith(4_000);
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { generateStructured, llmDailyBudget, LlmRateLimitError } = await freshClient({
      ...BASE_ENV, LLM_TOKENS_PER_MINUTE: "40000", LLM_TOKENS_PER_DAY: "9000",
    });

    // Each call reserves the completion ceiling it might need (~2650) before sending,
    // then settles to the 4000 actually used, so the day is charged what was spent.
    await generateStructured(REQUEST);
    expect(llmDailyBudget().spent).toBe(4_000);

    await generateStructured(REQUEST);
    expect(llmDailyBudget().spent).toBe(8_000);

    // A third would have to reserve past 9000, so it never reaches the provider.
    await expect(generateStructured(REQUEST)).rejects.toThrow(/token day is spent/);
    await expect(generateStructured(REQUEST)).rejects.toBeInstanceOf(LlmRateLimitError);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(llmDailyBudget().remaining).toBe(1_000);
  });

  it("backs every caller off when the provider returns a long retry-after", async () => {
    const fetchMock = vi.fn(async () => new Response("rate limited", {
      status: 429,
      headers: { "retry-after": "600" },
    }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { generateStructured, LlmRateLimitError } = await freshClient(BASE_ENV);

    await expect(generateStructured(REQUEST)).rejects.toBeInstanceOf(LlmRateLimitError);
    const afterFirst = fetchMock.mock.calls.length;

    // A ten-minute back-off is far too long to hold an n8n trigger open, so the next
    // caller is refused at the door rather than retried into the same wall.
    await expect(generateStructured(REQUEST)).rejects.toBeInstanceOf(LlmRateLimitError);
    expect(fetchMock).toHaveBeenCalledTimes(afterFirst);
  });

  it("hands the work to a free standby when the primary is out of tokens", async () => {
    // Groq's day is spent — the state that left an afternoon with no drafts at all.
    const fetchMock = vi.fn(async (url: string | URL) => String(url).includes("openrouter")
      ? new Response(JSON.stringify({ choices: [{ message: { content: '{"ok":"from-standby"}' } }] }), { status: 200 })
      : new Response("daily limit", { status: 429, headers: { "retry-after": "1800" } }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { generateStructured } = await freshClient({
      ...BASE_ENV,
      OPENROUTER_API_KEY: "test-standby-key",
      LLM_FALLBACK_CHAIN: "openrouter:nvidia/nemotron-3-super-120b-a12b:free",
    });

    const result = await generateStructured(REQUEST);
    expect(result.text).toContain("from-standby");
    expect(result.model).toBe("nvidia/nemotron-3-super-120b-a12b:free");
  });

  it("refuses to fall back onto a paid model", async () => {
    // A standby that costs money would turn a quiet afternoon into a bill nobody chose.
    const { resolveFallbackConfigs } = await freshClient({
      ...BASE_ENV,
      OPENROUTER_API_KEY: "test-standby-key",
      LLM_FALLBACK_CHAIN: "openrouter:anthropic/claude-sonnet-4.5,openrouter:nvidia/nemotron-3-super-120b-a12b:free,openrouter:openai/gpt-5",
    });

    const models = resolveFallbackConfigs().map(config => config.model);
    expect(models).toEqual(["nvidia/nemotron-3-super-120b-a12b:free"]);
  });

  it("tries the next standby when one is rate limited, and gives up honestly", async () => {
    const fetchMock = vi.fn(async (url: string | URL) => new Response(String(url) && "limit", { status: 429, headers: { "retry-after": "900" } }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { generateStructured, LlmRateLimitError } = await freshClient({
      ...BASE_ENV,
      OPENROUTER_API_KEY: "test-standby-key",
      LLM_FALLBACK_CHAIN: "openrouter:nvidia/nemotron-3-super-120b-a12b:free,openrouter:google/gemma-4-26b-a4b-it:free",
    });

    // Primary refuses, then both standbys refuse; the caller still sees a rate limit,
    // which defers the concept rather than retiring the brief behind it.
    await expect(generateStructured(REQUEST)).rejects.toBeInstanceOf(LlmRateLimitError);
    const targets = fetchMock.mock.calls.map(call => String(call[0]));
    expect(targets.filter(url => url.includes("openrouter"))).toHaveLength(2);
  });

  it("stops asking the standbys once their shared daily allowance is spent", async () => {
    // OpenRouter refuses every free model together, and names when it resets. Without
    // reading that, each generation burns one call per standby learning it again.
    const refusal = JSON.stringify({ error: {
      message: "Rate limit exceeded: free-models-per-day",
      metadata: { headers: { "X-RateLimit-Limit": "50", "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": String(Date.now() + 3_600_000) } },
    } });
    const fetchMock = vi.fn(async (url: string | URL) => String(url).includes("openrouter")
      ? new Response(refusal, { status: 429 })
      : new Response("primary limit", { status: 429, headers: { "retry-after": "1800" } }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { generateStructured, LlmRateLimitError, llmDailyBudget } = await freshClient({
      ...BASE_ENV,
      LLM_FALLBACK_PROVIDER: "openrouter",
      OPENROUTER_API_KEY: "test-standby-key",
      LLM_FALLBACK_MODELS: "nvidia/nemotron-3-super-120b-a12b:free,google/gemma-4-26b-a4b-it:free",
    });

    await expect(generateStructured(REQUEST)).rejects.toBeInstanceOf(LlmRateLimitError);
    const firstRound = fetchMock.mock.calls.filter(call => String(call[0]).includes("openrouter")).length;
    expect(firstRound).toBeGreaterThan(0);
    expect(llmDailyBudget().standbys.every(standby => standby.blockedUntil)).toBe(true);

    // The next caller should not spend a single call rediscovering the same wall.
    await expect(generateStructured(REQUEST)).rejects.toBeInstanceOf(LlmRateLimitError);
    expect(fetchMock.mock.calls.filter(call => String(call[0]).includes("openrouter"))).toHaveLength(firstRound);
  });

  it("waits out a full token minute rather than refusing the second request", async () => {
    // Two real requests do not fit one 8,000-token minute, so the second has to queue.
    // Refusing it instead is what halved a recovery run's attempts.
    const fetchMock = respondWith(4_000);
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { generateStructured } = await freshClient({
      ...BASE_ENV,
      LLM_TOKENS_PER_MINUTE: "8000",
      LLM_MAX_INLINE_WAIT_MS: "70000",
      LLM_MIN_GAP_MS: "0",
    });

    await generateStructured(REQUEST);
    // The second would exceed the window on reservation, so it must wait, not throw.
    // vi's fake clock lets the sixty-second wait pass without the test taking a minute.
    vi.useFakeTimers();
    const second = generateStructured(REQUEST);
    await vi.advanceTimersByTimeAsync(61_000);
    await expect(second).resolves.toBeTruthy();
    vi.useRealTimers();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not let one standby's exhausted day stop the others", async () => {
    // Each free tier is its own bucket. Treating them as one meant OpenRouter running out
    // of its fifty a day silenced Mistral too, which had capacity the whole time.
    const refusal = JSON.stringify({ error: {
      message: "Rate limit exceeded: free-models-per-day",
      metadata: { headers: { "X-RateLimit-Reset": String(Date.now() + 3_600_000) } },
    } });
    const fetchMock = vi.fn(async (url: string | URL) => {
      const target = String(url);
      if (target.includes("openrouter")) return new Response(refusal, { status: 429 });
      if (target.includes("mistral")) return new Response(JSON.stringify({ choices: [{ message: { content: '{"ok":"from-mistral"}' } }] }), { status: 200 });
      return new Response("primary limit", { status: 429, headers: { "retry-after": "1800" } });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const { generateStructured } = await freshClient({
      ...BASE_ENV,
      OPENROUTER_API_KEY: "test-openrouter",
      MISTRAL_API_KEY: "test-mistral",
      LLM_FALLBACK_CHAIN: "openrouter:nvidia/nemotron-3-super-120b-a12b:free,mistral:magistral-small-latest",
    });

    const result = await generateStructured(REQUEST);
    expect(result.text).toContain("from-mistral");
    expect(result.model).toBe("magistral-small-latest");

    // OpenRouter is now known to be out for the day, so the next call skips it entirely
    // and goes straight to the standby that still has room.
    const before = fetchMock.mock.calls.filter(c => String(c[0]).includes("openrouter")).length;
    await generateStructured(REQUEST);
    expect(fetchMock.mock.calls.filter(c => String(c[0]).includes("openrouter"))).toHaveLength(before);
  });

  // The danger with a paid API is never the price of one request, it is the number of
  // them. These are the two things that make a runaway bill structurally impossible.
  describe("the paid provider", () => {
    const paidEnv = {
      ...BASE_ENV,
      LLM_PAID_ENABLED: "true",
      OPENAI_API_KEY: "test-paid-key",
      LLM_PAID_MAX_CALLS_PER_DAY: "2",
      LLM_PAID_DAILY_TOKEN_CAP: "999999",
    };
    const refuseFree = async (url: string | URL) => String(url).includes("openai.com")
      ? new Response(JSON.stringify({ output_text: '{"ok":"paid"}' }), { status: 200 })
      : new Response("limit", { status: 429, headers: { "retry-after": "1800" } });

    it("is never reached unless the caller asks", async () => {
      const fetchMock = vi.fn(refuseFree);
      globalThis.fetch = fetchMock as unknown as typeof fetch;
      const { generateStructured, LlmRateLimitError } = await freshClient(paidEnv);
      await expect(generateStructured(REQUEST)).rejects.toBeInstanceOf(LlmRateLimitError);
      expect(fetchMock.mock.calls.filter(c => String(c[0]).includes("openai.com"))).toHaveLength(0);
    });

    it("stays off entirely unless it has been switched on", async () => {
      const fetchMock = vi.fn(refuseFree);
      globalThis.fetch = fetchMock as unknown as typeof fetch;
      const { generateStructured, LlmRateLimitError } = await freshClient({ ...paidEnv, LLM_PAID_ENABLED: "false" });
      await expect(generateStructured(REQUEST, undefined, { allowPaid: true })).rejects.toBeInstanceOf(LlmRateLimitError);
      expect(fetchMock.mock.calls.filter(c => String(c[0]).includes("openai.com"))).toHaveLength(0);
    });

    it("answers when the free chain has refused and the caller asked", async () => {
      globalThis.fetch = vi.fn(refuseFree) as unknown as typeof fetch;
      const { generateStructured, llmDailyBudget } = await freshClient(paidEnv);
      const result = await generateStructured(REQUEST, undefined, { allowPaid: true });
      expect(result.text).toContain("paid");
      expect(llmDailyBudget().paid.callsUsed).toBe(1);
    });

    it("stops at its daily call ceiling however often it is asked", async () => {
      const fetchMock = vi.fn(refuseFree);
      globalThis.fetch = fetchMock as unknown as typeof fetch;
      const { generateStructured, LlmRateLimitError, llmDailyBudget } = await freshClient(paidEnv);
      await generateStructured(REQUEST, undefined, { allowPaid: true });
      await generateStructured(REQUEST, undefined, { allowPaid: true });
      // The third is refused before it is sent, not after it is billed.
      await expect(generateStructured(REQUEST, undefined, { allowPaid: true })).rejects.toBeInstanceOf(LlmRateLimitError);
      expect(fetchMock.mock.calls.filter(c => String(c[0]).includes("openai.com"))).toHaveLength(2);
      expect(llmDailyBudget().paid.callsUsed).toBe(2);
    });

    it("stops at its daily token ceiling as well as its call ceiling", async () => {
      const fetchMock = vi.fn(refuseFree);
      globalThis.fetch = fetchMock as unknown as typeof fetch;
      const { generateStructured, LlmRateLimitError } = await freshClient({
        ...paidEnv, LLM_PAID_MAX_CALLS_PER_DAY: "50", LLM_PAID_DAILY_TOKEN_CAP: "100",
      });
      await expect(generateStructured(REQUEST, undefined, { allowPaid: true })).rejects.toBeInstanceOf(LlmRateLimitError);
      expect(fetchMock.mock.calls.filter(c => String(c[0]).includes("openai.com"))).toHaveLength(0);
    });
  });
});

