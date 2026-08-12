import { createPublicKey, verify } from "node:crypto";
import type { IncomingHttpHeaders } from "node:http";

type AccessClaims = { aud?: string | string[]; email?: string; exp?: number; iss?: string; nbf?: number };
type JsonWebKeyWithKid = Record<string, string | string[] | undefined> & { kid?: string; alg?: string; kty?: string };

const accessAudience = process.env.CF_ACCESS_AUD || "";
const accessTeamDomain = (process.env.CF_ACCESS_TEAM_DOMAIN || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
const allowedEmail = (process.env.CF_ACCESS_ALLOWED_EMAIL || "opefyre@gmail.com").toLowerCase();
const authMode = process.env.REVIEW_AUTH_MODE || "tailscale";
let cachedKeys: { expiresAt: number; keys: JsonWebKeyWithKid[] } | undefined;

function decodeSegment<T>(value: string): T {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
}

async function accessKeys(): Promise<JsonWebKeyWithKid[]> {
  if (cachedKeys && cachedKeys.expiresAt > Date.now()) return cachedKeys.keys;
  if (!accessTeamDomain) throw new Error("CF_ACCESS_TEAM_DOMAIN is required");
  const response = await fetch(`https://${accessTeamDomain}/cdn-cgi/access/certs`, { signal: AbortSignal.timeout(8_000) });
  if (!response.ok) throw new Error(`Cloudflare Access cert lookup failed (${response.status})`);
  const body = await response.json() as { keys?: JsonWebKeyWithKid[] };
  if (!body.keys?.length) throw new Error("Cloudflare Access returned no signing keys");
  cachedKeys = { expiresAt: Date.now() + 60 * 60 * 1000, keys: body.keys };
  return body.keys;
}

async function cloudflareReviewer(headers: IncomingHttpHeaders): Promise<string | null> {
  if (!accessAudience || !accessTeamDomain) throw new Error("Cloudflare Access verification is not configured");
  const assertion = headers["cf-access-jwt-assertion"];
  if (typeof assertion !== "string") return null;
  const parts = assertion.split(".");
  if (parts.length !== 3) return null;
  try {
    const header = decodeSegment<{ alg?: string; kid?: string }>(parts[0]);
    const claims = decodeSegment<AccessClaims>(parts[1]);
    if (header.alg !== "RS256" || !header.kid) return null;
    const key = (await accessKeys()).find(candidate => candidate.kid === header.kid && (!candidate.alg || candidate.alg === "RS256"));
    if (!key) return null;
    const valid = verify("RSA-SHA256", Buffer.from(`${parts[0]}.${parts[1]}`), createPublicKey({ key: key as never, format: "jwk" }), Buffer.from(parts[2], "base64url"));
    const now = Math.floor(Date.now() / 1000);
    const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    const email = claims.email?.toLowerCase();
    if (!valid || claims.iss !== `https://${accessTeamDomain}` || !audience.includes(accessAudience) || !claims.exp || claims.exp <= now || (claims.nbf && claims.nbf > now + 30) || !email || email !== allowedEmail) return null;
    return email;
  } catch {
    return null;
  }
}

export async function authenticatedReviewer(headers: IncomingHttpHeaders): Promise<string | null> {
  if (authMode === "cloudflare_access") return cloudflareReviewer(headers);
  const tailscale = headers["tailscale-user-login"];
  return typeof tailscale === "string" ? tailscale : null;
}
