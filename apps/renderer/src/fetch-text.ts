import { chromium, type Browser } from "playwright";

// Several Portuguese official sites render their content client-side, so a plain HTTP
// fetch returns a 200 with almost no text and the page looks "unusable" to the corpus
// ingester. Others reject non-browser clients outright with 403. Chromium is already
// installed here for carousel rendering, so the same engine is reused to read those
// pages instead of adding a dependency or paying for a scraping service.

let browser: Browser | null = null;

async function sharedBrowser(): Promise<Browser> {
  if (browser?.isConnected()) return browser;
  browser = await chromium.launch({ args: ["--disable-dev-shm-usage"] });
  return browser;
}

export type FetchedPage = {
  url: string;
  // Where the browser ended up. Google News serves a redirect wrapper that only
  // resolves once scripts run, so the caller cannot know the article URL without it.
  finalUrl: string;
  status: number;
  title: string;
  text: string;
  // Absolute hrefs found on the page. Official announcement indexes are the only
  // reliable way to reach a notice published today, and reaching it means reading the
  // index's links rather than hashing the index itself.
  links: string[];
  error: string | null;
};

export async function fetchRenderedText(url: string, timeoutMs = 45_000): Promise<FetchedPage> {
  let context;
  try {
    const instance = await sharedBrowser();
    context = await instance.newContext({
      locale: "pt-PT",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
    });
    const page = await context.newPage();

    // Images and fonts are irrelevant to text extraction and are the slowest part of a
    // government page; blocking them keeps ingestion of ~30 sources practical.
    await page.route("**/*", route => {
      const type = route.request().resourceType();
      return type === "image" || type === "font" || type === "media" ? route.abort() : route.continue();
    });

    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: timeoutMs });
    // Client-rendered content arrives after DOMContentLoaded; wait for the network to
    // settle but do not fail the page if it never fully idles.
    await page.waitForLoadState("networkidle", { timeout: 10_000 }).catch(() => {});

    const title = (await page.title().catch(() => "")) || url;
    const links = await page.evaluate(() =>
      [...document.querySelectorAll("a[href]")]
        .map(a => (a as HTMLAnchorElement).href)
        .filter(href => href.startsWith("http"))
        .map(href => href.split("#")[0] ?? href),
    ).catch(() => [] as string[]);
    const text = await page.evaluate(() => {
      for (const node of Array.from(document.querySelectorAll("script,style,noscript,nav,header,footer"))) node.remove();
      const tidy = (value: string) => value.replace(/[ \t]+/g, " ").replace(/\n{2,}/g, "\n").trim();

      const visible = tidy(document.body?.innerText ?? "");

      // Portuguese government pages routinely put the substance inside collapsed
      // accordions — AIMA's requirement lists are a good example — and innerText skips
      // anything not currently displayed, yielding a couple of hundred characters of
      // section headings. textContent includes those nodes, so when the rendered text is
      // clearly too thin the hidden content is used instead.
      if (visible.length >= 800) return visible;
      const full = tidy(document.body?.textContent ?? "");
      return full.length > visible.length ? full : visible;
    });

    return { url, finalUrl: page.url(), status: response?.status() ?? 0, title: title.slice(0, 300), text, links: [...new Set(links)], error: null };
  } catch (error) {
    return { url, finalUrl: url, status: 0, title: url, text: "", links: [], error: String((error as Error).message ?? error) };
  } finally {
    await context?.close().catch(() => {});
  }
}

export async function closeFetchBrowser() {
  await browser?.close().catch(() => {});
  browser = null;
}
