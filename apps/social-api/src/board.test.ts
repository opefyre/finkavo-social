import { describe, expect, it } from "vitest";
import { boardPage } from "./board.js";

describe("private board page", () => {
  it("ships syntactically valid client JavaScript and escapes reviewer identity", () => {
    const html = boardPage(`owner<script>alert("x")</script>@example.com`, "test-nonce");
    const script = html.match(/<script nonce="test-nonce">([\s\S]*?)<\/script>/)?.[1];
    expect(script).toBeTruthy();
    expect(() => new Function(script!)).not.toThrow();
    expect(html).not.toContain(`owner<script>`);
    expect(html).toContain("owner&lt;script&gt;");
  });
});
