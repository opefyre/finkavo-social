// Discord carries one thing now: something is broken and wants fixing.
//
// It used to carry four streams — approvals, publications, daily and weekly and monthly
// reports, and errors — across four webhooks. Review moved to Buffer drafts, so the
// approval stream had nothing to say; the rest were a running commentary on a pipeline
// working correctly, which is the kind of notification people learn to swipe away, and
// then miss the one that mattered. If it is not a failure someone has to act on, it does
// not belong here. The reports still exist as endpoints and still return their data —
// they simply no longer push it at anyone.
export async function notifyDiscord(title: string, details: Record<string, unknown>, actionUrl?: string) {
  const url = process.env.DISCORD_ERRORS_WEBHOOK_URL;
  if (!url) return false;
  const safeDetails = Object.entries(details)
    .filter(([key]) => !/token|secret|key|url/i.test(key))
    .map(([key, value]) => `**${key}:** ${String(value)}`)
    .join("\n");
  const safeActionUrl = actionUrl && actionUrl.startsWith("https://") ? actionUrl : undefined;
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      embeds: [{ title, description: safeDetails, url: safeActionUrl, color: 0xc53030, timestamp: new Date().toISOString() }],
    }),
    signal: AbortSignal.timeout(15_000),
  });
  // A bare status is undiagnosable: Discord says exactly which field it rejected and why,
  // and without that a recurring 400 is just a number in a log.
  if (!response.ok) {
    const reason = await response.text().catch(() => "");
    throw new Error(`Discord webhook failed (${response.status}): ${reason.slice(0, 300)}`);
  }
  return true;
}
