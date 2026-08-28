import type postgres from "postgres";

// Every check here exists because something it would have caught actually happened, and
// was found by the owner looking at an empty Drafts folder rather than by us. The point is
// not coverage for its own sake — it is that the pipeline notices its own failures within
// the hour instead of within the day.
//
// Deliberately cheap. Nothing here generates a draft or writes to Buffer: a self-test that
// costs tokens is a self-test that gets switched off. It asserts that each link can carry
// work, and that recent work actually moved.

export type Check = { name: string; ok: boolean; detail: string; severity: "fault" | "warning" };

type Deps = {
  sql: ReturnType<typeof postgres>;
  today: string;
  postsPerDay: number;
  rendererBaseUrl: string;
  rendererToken: string | undefined;
  bufferReachable: () => Promise<boolean>;
};

const ok = (name: string, detail: string): Check => ({ name, ok: true, detail, severity: "fault" });
const bad = (name: string, detail: string, severity: Check["severity"] = "fault"): Check => ({ name, ok: false, detail, severity });

export async function runSelfTest(deps: Deps): Promise<Check[]> {
  const { sql, today, postsPerDay } = deps;
  const checks: Check[] = [];

  // The carry-forward bug parked the whole bank two weeks in the future and today had
  // nothing to generate from, while the alert said the bank was empty. It was not.
  const [ready] = await sql`
    SELECT count(*) AS count FROM social_post_concept c
    JOIN social_topic_evidence_bundle b ON b.id = c.evidence_bundle_id
    WHERE c.status = 'planned' AND c.planned_for <= ${today}
      AND b.verification_state = 'verified' AND b.expires_at > now()`;
  checks.push(Number(ready.count) > 0
    ? ok("bank has work for today", `${ready.count} concept(s) with live evidence`)
    : bad("bank has work for today", "no planned concept for today carries verified, unexpired evidence"));

  // The pacing deadlock stopped generation for a day and a half without one error. The
  // symptom was silence, so silence is what this looks for.
  const [lastDraft] = await sql`SELECT max(created_at) AS at FROM social_post_revision`;
  const draftAgeHours = lastDraft?.at ? (Date.now() - new Date(String(lastDraft.at)).getTime()) / 3_600_000 : Infinity;
  checks.push(draftAgeHours < 20
    ? ok("generation is producing", `last draft ${draftAgeHours.toFixed(1)}h ago`)
    : bad("generation is producing", `no draft written in ${Number.isFinite(draftAgeHours) ? draftAgeHours.toFixed(0) + "h" : "recorded history"}`));

  // One post with an over-long cover subtitle threw inside the batch and stopped every
  // approved post behind it. Nothing looked wrong from outside.
  const [stalled] = await sql`
    SELECT count(*) AS count FROM social_post
    WHERE status IN ('approved','rendered') AND archived_at IS NULL
      AND updated_at < now() - INTERVAL '3 hours'`;
  checks.push(Number(stalled.count) === 0
    ? ok("approved work is moving", "nothing approved has been sitting for hours")
    : bad("approved work is moving", `${stalled.count} approved or rendered post(s) have not moved in 3 hours`));

  // The renderer ran a week of pre-motion code because a deploy restarted a service name
  // that does not exist, with stderr suppressed.
  const [renderer] = await sql`SELECT worker_id, last_seen_at FROM social_renderer_heartbeat ORDER BY last_seen_at DESC LIMIT 1`;
  const beatAge = renderer?.last_seen_at ? (Date.now() - new Date(String(renderer.last_seen_at)).getTime()) / 60_000 : Infinity;
  checks.push(beatAge < 10
    ? ok("renderer is alive", `heartbeat ${beatAge.toFixed(1)} min ago`)
    : bad("renderer is alive", `renderer last checked in ${Number.isFinite(beatAge) ? beatAge.toFixed(0) + " min" : "never"} ago`));

  // It can accept work, not merely be running.
  if (deps.rendererToken) {
    try {
      const response = await fetch(`${deps.rendererBaseUrl.replace(/\/$/, "")}/healthz`, { signal: AbortSignal.timeout(8_000) });
      checks.push(response.ok
        ? ok("renderer answers", `HTTP ${response.status}`)
        : bad("renderer answers", `renderer returned HTTP ${response.status}`));
    } catch (error) {
      checks.push(bad("renderer answers", `renderer unreachable: ${error instanceof Error ? error.message : "unknown"}`));
    }
  }

  // A reel whose video failed to render published as five images while still recorded as a
  // reel, so the day counted a reel it had not delivered.
  const downgraded = await sql`
    SELECT count(*) AS count FROM social_event
    WHERE event_type = 'reel.render_missing' AND created_at > now() - INTERVAL '24 hours'`;
  checks.push(Number(downgraded[0]?.count ?? 0) === 0
    ? ok("reels render as reels", "no reel fell back to slides today")
    : bad("reels render as reels", `${downgraded[0]!.count} reel(s) published as carousels because the video never rendered`, "warning"));

  // Our record of what Buffer holds drifted for days: posts approved into the queue still
  // read as drafts here, and the overdue check skips drafts.
  checks.push(await deps.bufferReachable()
    ? ok("Buffer answers", "the API responded")
    : bad("Buffer answers", "Buffer did not respond"));

  // The point of the whole thing.
  const [landed] = await sql`
    SELECT count(*) AS count FROM social_publish_job j
    WHERE j.scheduled_at >= ${today} AND j.scheduled_at < (${today}::date + 1)
      AND j.status NOT IN ('failed','blocked')`;
  checks.push(Number(landed.count) >= postsPerDay
    ? ok("today is covered", `${landed.count} of ${postsPerDay} slot(s) filled`)
    : bad("today is covered", `${landed.count} of ${postsPerDay} slot(s) filled`, "warning"));

  return checks;
}
