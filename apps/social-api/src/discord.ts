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
