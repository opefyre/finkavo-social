import { describe, expect, it } from "vitest";
import { renderManifestSchema } from "./schema.js";
describe("render manifest", () => { it("rejects unapproved locales", () => { expect(renderManifestSchema.safeParse({ schemaVersion: 1, postId: "p1", revisionId: "r1", locale: "pt-PT", templateVersion: "finkavo-v2", slides: [] }).success).toBe(false); }); });

describe("visual styles", () => {
  const slides = [
    { type: "cover", icon: "document", category: "Portugal", title: "A useful guide", subtitle: "What residents should know" },
    { type: "content", icon: "document", title: "The detail", body: "Verify the current information with the official source." },
    { type: "summary", icon: "check", title: "Next step", body: "Keep the source with your records.", cta: "Save this guide" },
  ];
  it("defaults older manifests to the petrol editorial family", () => {
    const parsed = renderManifestSchema.parse({ schemaVersion: 1, postId: "p1", revisionId: "r1", locale: "en", templateVersion: "finkavo-v3", slides });
    expect(parsed.visualStyle).toBe("petrol_editorial");
  });
  it("accepts every approved family and rejects arbitrary palettes", () => {
    for (const visualStyle of ["petrol_editorial", "cream_guide", "mint_checklist", "peach_deadline", "ink_alert"]) {
      expect(renderManifestSchema.safeParse({ schemaVersion: 1, postId: "p1", revisionId: "r1", locale: "en", templateVersion: "finkavo-v3", visualStyle, slides }).success).toBe(true);
    }
    expect(renderManifestSchema.safeParse({ schemaVersion: 1, postId: "p1", revisionId: "r1", locale: "en", templateVersion: "finkavo-v3", visualStyle: "random", slides }).success).toBe(false);
  });
});
