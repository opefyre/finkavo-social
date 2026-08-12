import { describe, expect, it } from "vitest";
import { renderManifestSchema } from "./schema.js";
describe("render manifest", () => { it("rejects unapproved locales", () => { expect(renderManifestSchema.safeParse({ schemaVersion: 1, postId: "p1", revisionId: "r1", locale: "pt-PT", templateVersion: "finkavo-v1", slides: [] }).success).toBe(false); }); });

