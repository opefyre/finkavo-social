type GraphQlResponse<T> = { data?: T; errors?: Array<{ message: string; extensions?: { code?: string } }> };

export class BufferError extends Error {
  constructor(message: string, public code: string, public retryable: boolean, public ambiguous = false) { super(message); }
}

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
  const body = await response.json() as GraphQlResponse<T>;
  if (response.status === 429) throw new BufferError("Buffer rate limit exceeded", "RATE_LIMIT_EXCEEDED", true);
  if (!response.ok) throw new BufferError(`Buffer HTTP ${response.status}`, `HTTP_${response.status}`, response.status >= 500);
  if (body.errors?.length) {
    const code = body.errors[0].extensions?.code || "GRAPHQL_ERROR";
    throw new BufferError(body.errors.map((item) => item.message).join("; "), code, ["UNEXPECTED", "RATE_LIMIT_EXCEEDED"].includes(code));
  }
  if (!body.data) throw new BufferError("Buffer returned no data", "EMPTY_RESPONSE", false, true);
  return body.data;
}

export async function createScheduledPost(input: { channelId: string; text: string; dueAt: string; mediaUrls: string[] }) {
  const data = await request<{ createPost: { __typename: string; message?: string; post?: { id: string; status?: string; dueAt?: string } } }>(`
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        __typename
        ... on PostActionSuccess { post { id status dueAt } }
        ... on MutationError { message }
      }
    }
  `, { input: { text: input.text, channelId: input.channelId, schedulingType: "automatic", mode: "customScheduled", dueAt: input.dueAt, assets: input.mediaUrls.map((url) => ({ image: { url } })) } });
  if (!data.createPost.post) throw new BufferError(data.createPost.message || `Buffer mutation failed (${data.createPost.__typename})`, data.createPost.__typename, false);
  return data.createPost.post;
}

export async function getPost(postId: string) {
  const data = await request<{ post: { id: string; status: string; dueAt?: string; sentAt?: string } | null }>(`
    query GetPost($input: PostInput!) { post(input: $input) { id status dueAt sentAt } }
  `, { input: { id: postId } });
  return data.post;
}
