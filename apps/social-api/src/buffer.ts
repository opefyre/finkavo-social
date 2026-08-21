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

// Buffer publishes its remaining quota on every response. Reading it lets the caller
// record real spend rather than inferring it, and lets a near-empty daily allowance stop
// optional monitoring before it becomes a hard 429.
export type BufferQuota = { dailyRemaining: number | null; windowRemaining: number | null; resetSeconds: number | null };

function parseQuota(headers: Headers): BufferQuota {
  // e.g. ratelimit: "100-in-15min"; r=94; t=593, "250-in-1day"; r=0; t=25734
  const raw = headers.get("ratelimit") ?? "";
  const read = (policy: RegExp) => {
    const segment = raw.split(",").find(part => policy.test(part));
    if (!segment) return { remaining: null as number | null, reset: null as number | null };
    const remaining = Number(segment.match(/\br=(\d+)/)?.[1]);
    const reset = Number(segment.match(/\bt=(\d+)/)?.[1]);
    return {
      remaining: Number.isFinite(remaining) ? remaining : null,
      reset: Number.isFinite(reset) ? reset : null,
    };
  };
  const daily = read(/1day/i);
  const window = read(/min/i);
  return { dailyRemaining: daily.remaining, windowRemaining: window.remaining, resetSeconds: daily.reset };
}

/** Set by the server so every provider call is accounted for and quota is observable. */
export let onBufferCall: (info: { kind: string; status: number; quota: BufferQuota }) => void = () => {};
export function setBufferCallObserver(observer: typeof onBufferCall) { onBufferCall = observer; }

async function request<T>(query: string, variables: Record<string, unknown>, kind = "graphql"): Promise<T> {
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
  const quota = parseQuota(response.headers);
  try { onBufferCall({ kind, status: response.status, quota }); } catch { /* accounting must never break a publish */ }
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

// Buffer's schema has carried reels all along — PostType lists them beside post and
// story, and AssetInput takes a video as readily as an image. Nothing here was blocked;
// the type was simply pinned to "post" and every asset built as an image, so a carousel
// was the only thing this could ever have sent.
export type BufferVideo = { url: string; thumbnailUrl?: string; title?: string };

export async function createScheduledPost(input: { channelId: string; text: string; dueAt?: string; mode?: "customScheduled" | "shareNow"; mediaUrls: string[]; video?: BufferVideo; saveToDraft?: boolean }) {
  const data = await request<{ createPost: { __typename: string; message?: string; post?: { id: string; status?: string; dueAt?: string } } }>(`
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        __typename
        ... on PostActionSuccess { post { id status dueAt } }
        ... on MutationError { message }
      }
    }
  `, { input: {
    text: input.text,
    channelId: input.channelId,
    schedulingType: "automatic",
    mode: input.mode || "customScheduled",
    ...(input.dueAt ? { dueAt: input.dueAt } : {}),
    aiAssisted: true,
    // A draft still carries its slot time. It sits in Buffer with the hour it is meant
    // for already on it, so approving is moving it to the queue rather than deciding when
    // it should go — the schedule is still the pipeline's, only the yes is not.
    ...(input.saveToDraft ? { saveToDraft: true } : {}),
    metadata: { instagram: {
      type: input.video ? "reel" : "post",
      // A reel is shown in the reels tab; this also puts it on the profile grid, which
      // is where anyone who came looking for the account will go.
      shouldShareToFeed: true,
      isAiGenerated: true,
    } },
    assets: input.video
      ? [{ video: {
          url: input.video.url,
          ...(input.video.thumbnailUrl ? { thumbnailUrl: input.video.thumbnailUrl } : {}),
          ...(input.video.title ? { metadata: { title: input.video.title } } : {}),
        } }]
      : input.mediaUrls.map((url) => ({ image: { url } })),
  } });
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

export async function deletePost(postId: string) {
  const data = await request<{ deletePost: { __typename: string; id?: string; message?: string } }>(`
    mutation DeletePost($input: DeletePostInput!) {
      deletePost(input: $input) {
        __typename
        ... on DeletePostSuccess { id }
        ... on VoidMutationError { message }
      }
    }
  `, { input: { id: postId } });
  if (!data.deletePost.id) throw new BufferError(data.deletePost.message || `Buffer delete failed (${data.deletePost.__typename})`, data.deletePost.__typename, false);
  return data.deletePost.id;
}

export async function findMatchingScheduledPost(input: { channelId: string; text: string; dueAt: string }) {
  const account = await request<{ account: { organizations: Array<{ id: string }> } }>(`query ReconcileAccount { account { organizations { id } } }`, {});
  const organizationId = account.account.organizations[0]?.id;
  if (!organizationId) throw new BufferError("Buffer account has no organization", "ORGANIZATION_NOT_FOUND", false);
  const organization = JSON.stringify(organizationId);
  const channel = JSON.stringify(input.channelId);
  const data = await request<{ posts: { edges: Array<{ node: { id: string; text?: string; dueAt?: string; status?: string; channelId?: string } }> } }>(`
    query ReconcilePosts {
      posts(first: 100, input: { organizationId: ${organization}, filter: { channelIds: [${channel}] }, sort: [{ field: dueAt, direction: desc }, { field: createdAt, direction: desc }] }) {
        edges { node { id text dueAt status channelId } }
      }
    }
  `, {});
  const due = new Date(input.dueAt).getTime();
  return data.posts.edges.map(edge => edge.node).find(post =>
    post.channelId === input.channelId && post.text === input.text && post.dueAt && Math.abs(new Date(post.dueAt).getTime() - due) < 60_000
  ) || null;
}
