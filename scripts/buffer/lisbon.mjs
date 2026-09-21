// "2026-09-23@09:00" (Lisbon wall-clock) → ISO UTC, DST-aware. Anything else is passed through unchanged.
// Lisbon is UTC+1 in summer and UTC+0 in winter (clocks change on the last Sunday of March and October), so a
// fixed "08:00Z" is right in September and an hour wrong from 25 Oct 2026.
export function dueAt(arg) {
  const m = /^(\d{4})-(\d{2})-(\d{2})@(\d{2}):(\d{2})$/.exec(arg || "");
  if (!m) return arg;
  const [y, mo, d, h, mi] = m.slice(1).map(Number);
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  const localMinutes = t => { const p = Object.fromEntries(fmt.formatToParts(new Date(t)).map(x => [x.type, x.value])); return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) / 60000; };
  let t = Date.UTC(y, mo - 1, d, h, mi);                 // start by assuming Lisbon = UTC…
  const want = t / 60000;
  t -= (localMinutes(t) - want) * 60000;                 // …then correct by the offset Lisbon actually has at that moment
  t -= (localMinutes(t) - want) * 60000;                 // once more, for the hour either side of a clock change
  return new Date(t).toISOString();
}
if (import.meta.url === `file://${process.argv[1]}`) for (const a of process.argv.slice(2)) console.log(a, "→", dueAt(a));
