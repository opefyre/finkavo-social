// Feed and official-page collection.
//
// This logic used to live in n8n Code nodes, which meant the discovery feed list, the
// canonical monitoring list, and the freshness window were configuration held inside two
// separate workflow graphs. Moving it here lets n8n be a pure scheduler with a single
// workflow, and keeps business rules in one testable place, as CONTEXT.md requires.

// Google News RSS hands back news.google.com redirect wrappers rather than article
// URLs. Sixty-nine of a hundred items collected in a day were those wrappers, and a
// wrapper cannot be read for the official links behind a story, so nothing could ever
// be corroborated from one. They stay for breadth of signal, but the Portuguese outlets
// below publish real article URLs, which is what corroboration actually needs.
export const DISCOVERY_FEEDS = [
  // Google News is gone. Its RSS hands back news.google.com redirect wrappers rather
  // than articles: fetching one returns half a megabyte of script with no link, and
  // opening it in the renderer lands on consent.google.com. Two thirds of everything
  // collected arrived that way and none of it could ever be corroborated, so it was
  // volume without a single usable item.
  //
  // These outlets publish real article URLs, which is what corroboration needs.
  "https://www.rtp.pt/noticias/rss/pais",
  "https://www.rtp.pt/noticias/rss/economia",
  "https://observador.pt/seccao/economia/feed/",
  "https://observador.pt/seccao/politica/feed/",
  "https://eco.sapo.pt/feed/",
  "https://www.dinheirovivo.pt/feed/",
];

export const MONITORED_CANONICAL_URLS = [
  "https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/calendario_fiscal/Pages/default.aspx",
  "https://info.portaldasfinancas.gov.pt/pt/apoio_ao_contribuinte/Cidadaos/Rendimentos/Declaracao/prazos/Paginas/default.aspx",
  "https://info.portaldasfinancas.gov.pt/pt/apoio_ao_contribuinte/Cidadaos/Casa_e_propriedades/Imposto_anual/Paginas/default.aspx",
  "https://www.seg-social.pt/trabalhadores-independentes",
  "https://bpstat.bportugal.pt/conteudos/noticias",
  "https://www.dgeste.mec.pt/?page_id=53180",
];

// Several Portuguese official sites reject non-browser agents outright, so collection
// presents a normal browser UA. Without it bportugal.pt and others answer 403 and the
// monitor records a false "page unusable".
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

export type DiscoveryItem = {
  url: string;
  title: string;
  publisher: string | null;
  locale: string;
  publishedAt: string | null;
  category: string;
  riskLevel: string;
};

const stripCdata = (value: string) =>
  value.replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1").trim();

const decodeEntities = (value: string) =>
  value
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&");

const tagValue = (block: string, tag: string) => {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeEntities(stripCdata(match[1])) : null;
};

/**
 * Minimal RSS 2.0 / Atom extraction. A dependency-free parser keeps the runtime free and
 * offline-installable; these feeds only need title, link and publication time.
 */
export function parseFeed(xml: string): Array<{ title: string | null; link: string | null; publishedAt: string | null; publisher: string | null }> {
  const blocks = xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/gi) ?? [];
  return blocks.map(block => {
    // Atom puts the URL in an attribute rather than element text.
    const link = tagValue(block, "link")
      || block.match(/<link[^>]*href=["']([^"']+)["']/i)?.[1]
      || null;
    return {
      title: tagValue(block, "title"),
      link: link ? decodeEntities(link.trim()) : null,
      publishedAt: tagValue(block, "pubDate") ?? tagValue(block, "published") ?? tagValue(block, "updated"),
      publisher: tagValue(block, "source") ?? tagValue(block, "dc:creator") ?? tagValue(block, "author"),
    };
  });
}

/**
 * Collects recent items across the discovery feeds. News is discovery-only: nothing here
 * is evidence, and the window is deliberately short so stale items cannot resurface.
 */
export async function collectDiscoveries(options: { windowHours?: number; limit?: number } = {}) {
  const windowHours = options.windowHours ?? 4;
  const limit = options.limit ?? 100;
  const cutoff = Date.now() - windowHours * 3_600_000;
  const seen = new Set<string>();
  const items: DiscoveryItem[] = [];
  const failures: Array<{ feedUrl: string; error: string }> = [];

  const responses = await Promise.all(DISCOVERY_FEEDS.map(async feedUrl => {
    try {
      const response = await fetch(feedUrl, {
        headers: { "user-agent": BROWSER_UA, accept: "application/rss+xml, application/xml, text/xml, */*" },
        signal: AbortSignal.timeout(25_000),
      });
      if (!response.ok) return { feedUrl, error: `HTTP ${response.status}` as const, xml: null };
      return { feedUrl, error: null, xml: await response.text() };
    } catch (error) {
      return { feedUrl, error: String((error as Error).message ?? error), xml: null };
    }
  }));

  for (const response of responses) {
    if (!response.xml) {
      failures.push({ feedUrl: response.feedUrl, error: response.error ?? "unknown" });
      continue;
    }
    for (const entry of parseFeed(response.xml)) {
      if (!entry.link || !entry.title) continue;
      const published = Date.parse(entry.publishedAt ?? "");
      if (!Number.isFinite(published) || published < cutoff) continue;
      const key = entry.link.replace(/[#?].*$/, "");
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({
        url: entry.link,
        title: entry.title,
        publisher: entry.publisher,
        locale: "pt",
        publishedAt: new Date(published).toISOString(),
        category: "general",
        riskLevel: "medium",
      });
    }
  }

  return { items: items.slice(0, limit), failures, feedsChecked: DISCOVERY_FEEDS.length };
}

/**
 * Extracts readable text from an HTML page, dropping markup, script and style.
 * Evidence matching runs against this text, so it must keep sentence structure rather
 * than collapsing to keywords.
 */
export function visibleText(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|tr|section)>/gi, ".\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export function pageTitle(html: string, fallback: string): string {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return (match?.[1] ?? fallback).replace(/\s+/g, " ").trim().slice(0, 300);
}

/** Splits page text into overlapping-free chunks sized for term matching. */
export function chunkText(text: string, size = 1200): string[] {
  const paragraphs = text.split("\n").map(part => part.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = "";
  for (const paragraph of paragraphs) {
    if ((current + " " + paragraph).length > size && current) {
      chunks.push(current.trim());
      current = paragraph;
    } else {
      current = current ? `${current} ${paragraph}` : paragraph;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.slice(0, 60);
}

/** Fetches one page for corpus ingestion. */
// Article URLs come out of RSS items, so they are chosen by whoever publishes the feed
// rather than by us. The feed list is a fixed set of Portuguese news outlets and none of
// this is likely, but the machine doing the fetching also runs n8n on localhost, and a
// link that resolves inward would be fetched, stored as a document and could surface in
// a post. The cost of refusing is nothing; the cost of allowing it is the whole host.
const PRIVATE_HOST = /^(?:localhost|.*\.localhost|.*\.local|.*\.internal)$/i;
const PRIVATE_IPV4 = /^(?:0|10|127)\.|^169\.254\.|^172\.(?:1[6-9]|2\d|3[01])\.|^192\.168\./;

export function isFetchableUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    const host = parsed.hostname.replace(/^\[|\]$/g, "").toLowerCase();
    if (PRIVATE_HOST.test(host)) return false;
    if (PRIVATE_IPV4.test(host)) return false;
    // IPv6 loopback and unique-local.
    if (host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80")) return false;
    return true;
  } catch {
    return false;
  }
}

export async function fetchPage(url: string) {
  if (!isFetchableUrl(url)) return { url, status: 0, html: "", error: "refused: not a public http(s) address" };
  try {
    const response = await fetch(url, {
      headers: { "user-agent": BROWSER_UA, "accept-language": "pt-PT,pt;q=0.9,en;q=0.8" },
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
    });
    // A redirect can land somewhere the first URL was not, and fetch follows them for us,
    // so the destination is checked too. The request has already happened by this point;
    // what this prevents is the response being kept and used as evidence.
    if (response.url && !isFetchableUrl(response.url)) {
      return { url, status: 0, html: "", error: "refused: redirected to a private address" };
    }
    const html = await response.text();
    return { url, status: response.status, html, error: null as string | null };
  } catch (error) {
    return { url, status: 0, html: "", error: String((error as Error).message ?? error) };
  }
}

/** Fetches each monitored canonical page for change detection. */
export async function collectOfficialPages() {
  return Promise.all(MONITORED_CANONICAL_URLS.map(async url => {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": BROWSER_UA, "accept-language": "pt-PT,pt;q=0.9,en;q=0.8" },
        redirect: "follow",
        signal: AbortSignal.timeout(30_000),
      });
      const body = await response.text();
      return { url, httpStatus: response.status, body: body.slice(0, 750_000), fetchedAt: new Date().toISOString() };
    } catch (error) {
      return { url, httpStatus: 0, body: "", fetchedAt: new Date().toISOString(), error: String((error as Error).message ?? error) };
    }
  }));
}

// A news story about an administrative change almost always names or links the official
// notice behind it. The story itself is never evidence -- Finkavo does not write from a
// newspaper -- but it is a reliable signal that an official page is worth reading now.
// This pulls the official links out of an article so triage can go and read the source.
export function officialLinksIn(html: string, officialDomains: string[]): string[] {
  const found = new Set<string>();
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
    const href = match[1];
    if (!href.startsWith("http")) continue;
    let hostname: string;
    try { hostname = new URL(href).hostname.replace(/^www\./, ""); } catch { continue; }
    if (!officialDomains.some(domain => hostname === domain || hostname.endsWith(`.${domain}`))) continue;
    // Drop the fragment so the same page under two anchors is read once.
    found.add(href.split("#")[0]);
  }
  return [...found];
}

// Where the institutions publish their own notices. A story about an administrative
// change is nearly always announced here first and in full, on an official domain, so
// it is evidence in its own right and needs no corroboration through a newspaper.
export const OFFICIAL_ANNOUNCEMENT_PAGES = [
  { url: "https://www.seg-social.pt/ptss/pssd/noticias", authority: "Instituto da Seguranca Social" },
  { url: "https://info.portaldasfinancas.gov.pt/pt/destaques/Paginas/default.aspx", authority: "Autoridade Tributaria e Aduaneira" },
  { url: "https://aima.gov.pt/pt/noticias", authority: "AIMA" },
  { url: "https://www.gov.pt/noticias", authority: "gov.pt" },
  { url: "https://www.sns.gov.pt/noticias/", authority: "Servico Nacional de Saude" },
];

// An index page links to navigation as well as to notices. A notice sits deeper than the
// section it lives in, so require a path with some substance to it and drop the obvious
// furniture. Being wrong here is cheap: a non-article official page that reads well is
// still valid evidence, and one that reads thin is dropped at ingest.
export function announcementLinks(pageUrl: string, links: string[]): string[] {
  const index = new URL(pageUrl);
  const origin = index.hostname.replace(/^www\./, "");
  // A notice lives under the board that lists it. Requiring that prefix is what
  // separates an announcement from the site furniture: the SNS board links to the whole
  // institutional menu, and "museu da saude" is not news about anything.
  const base = index.pathname.replace(/\/[^/]*\.(aspx|html?|php)$/i, "/").replace(/\/$/, "");
  const out = new Set<string>();
  for (const link of links) {
    let parsed: URL;
    try { parsed = new URL(link); } catch { continue; }
    if (parsed.hostname.replace(/^www\./, "") !== origin) continue;
    const path = parsed.pathname.replace(/\/$/, "");
    if (path === base) continue;
    if (base && !path.startsWith(base + "/")) continue;
    if (/\.(pdf|jpg|png|zip|xlsx?|docx?)$/i.test(path)) continue;
    if (/(contactos|acessibilidade|privacidade|cookies|mapa-do-site|login|pesquisa|rss)/i.test(path)) continue;
    // Notice boards paginate, and page 2 of a list is not an announcement.
    if (/\/(page|pagina)[:/-]?\d+$/i.test(path) || /^\d+$/.test(path.split("/").filter(Boolean).slice(-1)[0] ?? "")) continue;
    out.add(parsed.toString());
  }
  return [...out];
}

