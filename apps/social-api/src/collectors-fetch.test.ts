import { describe, expect, it } from "vitest";
import { isFetchableUrl } from "./collectors.js";

describe("what the collector is willing to fetch", () => {
  it("refuses anything that points back at this machine", () => {
    for (const url of [
      "http://127.0.0.1:5678/rest/workflows",
      "http://localhost:4320/board",
      "http://[::1]:5678/",
      "http://192.168.1.10/admin",
      "http://10.0.0.5/",
      "http://172.16.4.1/",
      "http://169.254.169.254/latest/meta-data/",
      "http://0.0.0.0/",
      "http://db.internal/",
      "http://printer.local/",
    ]) {
      expect(isFetchableUrl(url), url).toBe(false);
    }
  });

  it("refuses anything that is not http", () => {
    for (const url of ["file:///etc/passwd", "ftp://example.com/x", "gopher://example.com", "not a url"]) {
      expect(isFetchableUrl(url), url).toBe(false);
    }
  });

  it("still allows the sources the pipeline actually reads", () => {
    for (const url of [
      "https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/calendario_fiscal/Pages/default.aspx",
      "https://dre.pt/codigo-do-trabalho",
      "https://www.seg-social.pt/inicio",
      "https://observador.pt/seccao/economia/feed/",
    ]) {
      expect(isFetchableUrl(url), url).toBe(true);
    }
  });
});
