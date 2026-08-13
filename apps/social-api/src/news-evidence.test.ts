import { describe, expect, it } from "vitest";
import { sourceSupportsNewsTopic } from "./news-evidence.js";

describe("official news evidence specificity", () => {
  it("accepts a topic directly supported by the official source", () => {
    expect(sourceSupportsNewsTopic("AIMA residence permit renewal rules", "Residence permits", ["AIMA updated residence permit renewal rules and appointments."])).toBe(true);
  });

  it("rejects an unrelated official page", () => {
    expect(sourceSupportsNewsTopic("IVA quarterly filing deadline", "Residence permits", ["AIMA updated residence permit appointments."])).toBe(false);
  });
});
