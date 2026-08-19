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
});
