export async function renderReviewPreview(manifest: unknown): Promise<string[]> {
  const base = process.env.RENDERER_BASE_URL || "http://127.0.0.1:4310";
  const token = process.env.RENDERER_API_TOKEN;
  if (!token) throw new Error("RENDERER_API_TOKEN is required for review previews");
  const response = await fetch(`${base}/render`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(manifest),
    signal: AbortSignal.timeout(120_000),
  });
  const body = await response.json() as { files?: string[]; error?: string };
  if (!response.ok || !body.files?.length) throw new Error(body.error || `Preview renderer failed (${response.status})`);
  return body.files;
}
