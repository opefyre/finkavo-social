type GraphQlResponse<T> = { data?: T; errors?: Array<{ message: string; extensions?: { code?: string } }> };

export class BufferError extends Error {
  constructor(message: string, public code: string, public retryable: boolean, public ambiguous = false, public retryAfterMinutes = 0) { super(message); }
}

const retryAfterMinutes = (value: string | null) => {
  if (!value) return 60;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(1, Math.ceil(seconds / 60));
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? Math.max(1, Math.ceil((timestamp - Date.now()) / 60_000)) : 60;
};

async function request<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const apiKey = process.env.BUFFER_API_KEY;
  if (!apiKey) throw new BufferError("BUFFER_API_KEY is not configured", "AUTH_NOT_CONFIGURED", false);
  let response: Response;
  try {
    response = await fetch("https://api.buffer.com", {
      method: "POST", headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ query, variables }), signal: AbortSignal.timeout(30_000),
    });
  } catch (error) {
    throw new BufferError(error instanceof Error ? error.message : "Buffer network failure", "UNKNOWN_PROVIDER_RESULT", false, true);
  }
  if (response.status === 429) throw new BufferError("Buffer rate limit exceeded", "RATE_LIMIT_EXCEEDED", true, false, retryAfterMinutes(response.headers.get("retry-after")));
  const contentType = response.headers.get("content-type") || "unknown content type";
  const raw = await response.text();
  let body: GraphQlResponse<T>;
  try { body = JSON.parse(raw) as GraphQlResponse<T>; }
  catch {
    const message = `Buffer returned non-JSON (HTTP ${response.status}; ${contentType.split(";")[0]})`;
    const ambiguous = response.ok || response.status >= 500;
    throw new BufferError(message, `NON_JSON_HTTP_${response.status}`, false, ambiguous);
  }
  if (!response.ok) throw new BufferError(`Buffer HTTP ${response.status}`, `HTTP_${response.status}`, response.status >= 500);
  if (body.errors?.length) {
    const code = body.errors[0].extensions?.code || "GRAPHQL_ERROR";
    const message = body.errors.map((item) => item.message).join("; ");
    const queueFull = /queue|scheduled posts?|posting limit|maximum posts?/i.test(message);
    throw new BufferError(message, queueFull ? "BUFFER_QUEUE_FULL" : code, queueFull || ["UNEXPECTED", "RATE_LIMIT_EXCEEDED"].includes(code), false, queueFull ? 60 : code === "RATE_LIMIT_EXCEEDED" ? 60 : 0);
  }
  if (!body.data) throw new BufferError("Buffer returned no data", "EMPTY_RESPONSE", false, true);
  return body.data;
}

export async function createScheduledPost(input: { channelId: string; text: string; dueAt?: string; mode?: "customScheduled" | "shareNow"; mediaUrls: string[] }) {
  const data = await request<{ createPost: { __typename: string; message?: string; post?: { id: string; status?: string; dueAt?: string } } }>(`
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        __typename
        ... on PostActionSuccess { post { id status dueAt } }
        ... on MutationError { message }
      }
    }
  `, { input: { text: input.text, channelId: input.channelId, schedulingType: "automatic", mode: input.mode || "customScheduled", ...(input.dueAt ? { dueAt: input.dueAt } : {}), aiAssisted: true, metadata: { instagram: { type: "post", shouldShareToFeed: true, isAiGenerated: true } }, assets: input.mediaUrls.map((url) => ({ image: { url } })) } });
  if (!data.createPost.post) {
    const message = data.createPost.message || `Buffer mutation failed (${data.createPost.__typename})`;
    const queueFull = /queue|scheduled posts?|posting limit|maximum posts?/i.test(message);
    throw new BufferError(message, queueFull ? "BUFFER_QUEUE_FULL" : data.createPost.__typename, queueFull, false, queueFull ? 60 : 0);
  }
  return data.createPost.post;
}

export async function getPost(postId: string) {
  const data = await request<{ post: { id: string; status: string; dueAt?: string; sentAt?: string } | null }>(`
    query GetPost($input: PostInput!) { post(input: $input) { id status dueAt sentAt } }
  `, { input: { id: postId } });
  return data.post;
}
