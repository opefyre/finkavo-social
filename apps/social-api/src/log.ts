/**
 * Every log line carries the time it was written.
 *
 * Without it the error log is only an ordered list: you can tell that one failure came
 * after another, but not whether either happened this hour or three weeks ago. Triaging
 * a live incident meant dating each failure through social_event and using the line's
 * position in the file as a crude clock — during which the loudest error in the log
 * turned out to have stopped eight days earlier, and the quietest was the live one.
 *
 * ts goes first so it survives any truncation of the line, and is ISO-8601 UTC so it
 * sorts lexically and joins cleanly against social_event.created_at.
 */
export function logLine(level: "error" | "info", fields: Record<string, unknown>): string {
  return JSON.stringify({ ts: new Date().toISOString(), level, ...fields });
}
