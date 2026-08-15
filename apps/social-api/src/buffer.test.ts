import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { findMatchingScheduledPost, getPost } from "./buffer.js";

describe("Buffer response classification", () => {
  const previousKey = process.env.BUFFER_API_KEY;
  beforeEach(() => { process.env.BUFFER_API_KEY = "test-key"; });
  afterEach(() => { vi.unstubAllGlobals(); if (previousKey === undefined) delete process.env.BUFFER_API_KEY; else process.env.BUFFER_API_KEY = previousKey; });

  it("preserves an ambiguous non-JSON gateway response without retrying a create-like request blindly", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>gateway failure</html>", { status: 502, headers: { "content-type": "text/html" } })));
    await expect(getPost("post-1")).rejects.toMatchObject({ code: "NON_JSON_HTTP_502", retryable: false, ambiguous: true });
  });

  it("classifies a non-JSON permission response as definite rather than ambiguous", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("<html>forbidden</html>", { status: 403, headers: { "content-type": "text/html" } })));
    await expect(getPost("post-1")).rejects.toMatchObject({ code: "NON_JSON_HTTP_403", retryable: false, ambiguous: false });
  });

  it("reconciles an exact scheduled post by channel, caption, and due time", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(Response.json({ data: { account: { organizations: [{ id: "org-1" }] } } }))
      .mockResolvedValueOnce(Response.json({ data: { posts: { edges: [{ node: { id: "buffer-1", text: "Exact caption", dueAt: "2026-08-16T10:30:00.000Z", status: "scheduled", channelId: "channel-1" } }] } } })));
    await expect(findMatchingScheduledPost({ channelId: "channel-1", text: "Exact caption", dueAt: "2026-08-16T10:30:00.000Z" })).resolves.toMatchObject({ id: "buffer-1" });
  });
});
