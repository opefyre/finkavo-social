export async function notifyDiscord(kind: "approval" | "published" | "errors" | "system", title: string, details: Record<string, unknown>, actionUrl?: string) {
  const envName = kind === "approval" ? "DISCORD_APPROVAL_WEBHOOK_URL" : kind === "published" ? "DISCORD_PUBLISHED_WEBHOOK_URL" : kind === "errors" ? "DISCORD_ERRORS_WEBHOOK_URL" : "DISCORD_SYSTEM_WEBHOOK_URL";
  const url = process.env[envName];
  if (!url) return false;
  const safeDetails = Object.entries(details).filter(([key]) => !/token|secret|key|url/i.test(key)).map(([key, value]) => `**${key}:** ${String(value)}`).join("\n");
  const safeActionUrl = actionUrl && actionUrl.startsWith("https://") ? actionUrl : undefined;
  const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ embeds: [{ title, description: safeDetails, url: safeActionUrl, color: kind === "published" ? 0x2f855a : kind === "errors" ? 0xc53030 : kind === "approval" ? 0x175e58 : 0xd69e2e, timestamp: new Date().toISOString() }] }), signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Discord webhook failed (${response.status})`);
  return true;
}

export async function notifyDiscordReview(input: {
  title: string;
  postId: string;
  expiresAt: unknown;
  actionUrl: string;
  caption: string;
  files: string[];
}) {
  const url = process.env.DISCORD_APPROVAL_WEBHOOK_URL;
  if (!url) return false;
  const form = new FormData();
  const attachments = await Promise.all(input.files.map(async (file, index) => {
    const filename = `slide-${String(index + 1).padStart(2, "0")}.png`;
    const bytes = await readFile(file);
    form.append(`files[${index}]`, new Blob([new Uint8Array(bytes)], { type: "image/png" }), filename);
    return { id: index, filename };
  }));
  const caption = input.caption.length > 3900 ? `${input.caption.slice(0, 3897)}…` : input.caption;
  const embeds = [
    {
      title: input.title,
      url: input.actionUrl,
      description: `**Post:** ${input.postId}\n**Review expires:** ${String(input.expiresAt)}\n\n**Final Instagram caption**\n${caption}`,
      color: 0x175e58,
      timestamp: new Date().toISOString(),
    },
    ...attachments.map((attachment, index) => ({ title: `Slide ${index + 1} of ${attachments.length}`, image: { url: `attachment://${attachment.filename}` }, color: 0x175e58 })),
  ];
  form.append("payload_json", JSON.stringify({ attachments, embeds }));
  const response = await fetch(url, { method: "POST", body: form, signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`Discord review preview failed (${response.status})`);
  return true;
}
import { readFile } from "node:fs/promises";
