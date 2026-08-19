// Feed and official-page collection.
//
// This logic used to live in n8n Code nodes, which meant the discovery feed list, the
// canonical monitoring list, and the freshness window were configuration held inside two
// separate workflow graphs. Moving it here lets n8n be a pure scheduler with a single
// workflow, and keeps business rules in one testable place, as CONTEXT.md requires.

export const DISCOVERY_FEEDS = [
  "https://news.google.com/rss/search?q=%28AIMA%20OR%20%22Portal%20das%20Finan%C3%A7as%22%20OR%20%22Seguran%C3%A7a%20Social%22%20OR%20gov.pt%29%20Portugal%20when%3A4h&hl=pt-PT&gl=PT&ceid=PT%3Apt-150",
  "https://news.google.com/rss/search?q=Portugal%20%28immigration%20OR%20tax%20OR%20housing%20OR%20employment%20OR%20public%20services%20OR%20scam%29%20when%3A4h&hl=en&gl=PT&ceid=PT%3Aen",
  "https://news.google.com/rss/search?q=Portugal%20%28national%20emergency%20OR%20major%20disruption%20OR%20strike%20OR%20wildfire%20OR%20flood%29%20when%3A4h&hl=en&gl=PT&ceid=PT%3Aen",
  "https://www.rtp.pt/noticias/rss/pais",
  "https://www.rtp.pt/noticias/rss/economia",
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
