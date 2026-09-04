import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/**
 * social_post_concept carries a partial unique index on plan_slot_id that excludes
 * blocked rows, so a blocked concept sits outside the index while still pointing at a
 * slot. An upsert that resurrects such a row without moving its pointer puts it back
 * into the index at whatever slot it held last — and if a live concept has taken that
 * slot since, the request dies on a duplicate key and the whole day's replacements go
 * with it.
 *
 * Two of the three reserve upserts shipped without the pointer move and produced 352
 * failed replacement runs; the news path had it all along. That is why this is an
 * invariant rather than a preference.
 */
describe("social_post_concept upserts", () => {
  const source = readFileSync(new URL("./server.ts", import.meta.url), "utf8");
  const inserts = source.split("INSERT INTO social_post_concept").slice(1);
  const settingSlot = inserts.filter(sql => sql.slice(0, 700).includes("plan_slot_id"));

  it("finds the upserts it means to police", () => {
    // Without this, a parser that matched nothing would make the assertion below pass
    // for the wrong reason.
    expect(inserts.length).toBeGreaterThan(0);
    expect(settingSlot).toHaveLength(3);
  });

  it("moves plan_slot_id on conflict wherever the insert sets it", () => {
    const offenders = settingSlot
      .map(sql => sql.slice(0, 1400))
      .filter(sql => sql.includes("ON CONFLICT"))
      .filter(sql => !sql.includes("plan_slot_id=excluded.plan_slot_id"));
    expect(offenders).toEqual([]);
  });
});
