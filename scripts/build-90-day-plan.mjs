#!/usr/bin/env node
// Lays authored briefs onto a rolling 90-day, five-slot-per-day schedule.
//
// This replaces scripts/build-annual-content-plan.mjs, which chose topics with index
// arithmetic ((day*3 + slot*5) % pillars.length) and therefore reused 297 topics across
// 1825 slots with five title templates. Here nothing is invented: a slot is filled by an
// authored brief from plans/brief-bank.json, an occasion from the official calendar, or
// it is left explicitly unfilled and reported. Running out of briefs is a visible
// shortfall, never silent filler.
//
// Usage: node scripts/build-90-day-plan.mjs [--start YYYY-MM-DD] [--days 90]

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { PILLAR_TERMS, deriveEvidenceTerms } from "./lib/evidence-terms.mjs";

const SLOT_TIMES = ["08:30", "11:30", "14:30", "18:00", "21:00"];
const NEWS_FLEX_SLOT = 3; // zero-based: the 18:00 slot is reserved for verified news
const MAX_HIGH_RISK_PER_DAY = 2;

// Freshness follows how fast the anchor can go stale, not the pillar.
const FRESHNESS_DAYS = { stable: 90, annual: 30, volatile: 7 };

// The pipeline's existing contentIntent vocabulary; valueClass is richer, so it is
// carried through separately rather than being flattened away.
const INTENT_BY_VALUE_CLASS = {
  threshold: "evergreen_explainer",
  scenario: "audience_specific",
  costly_mistake: "common_mistake",
  edge_case: "common_mistake",
  decision: "evergreen_explainer",
  deadline_action: "deadline_reminder",
  insider: "golden_tip",
};

const argOf = (name, fallback) => {
  const index = process.argv.indexOf(`--${name}`);
  return index > -1 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
};

const iso = date => date.toISOString().slice(0, 10);
const addDays = (date, count) => {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + count);
  return next;
};

function toPlanRow({ brief, date, slotIndex, occurrence, timing, reserve, fallbackTitle }) {
  return {
    date,
    time: SLOT_TIMES[slotIndex],
    slot: slotIndex + 1,
    pillar: brief.pillar,
    angle: brief.valueClass,
    title: brief.title,
    audience: brief.audience,
    risk: brief.risk,
    timing,
    reserve,
    searchTerms: (PILLAR_TERMS[brief.pillar] ?? []).join(" | "),
    authority: brief.source.authority,
    occurrence,
    evidenceTerms: deriveEvidenceTerms(brief).join(" | "),
    curationStatus: "curated_90_day",
    brief: {
      briefId: brief.id,
      subjectFamily: brief.pillar,
      userQuestion: brief.userQuestion,
      purpose: brief.promise,
      requiredAnswers: [
        `Answer directly: ${brief.userQuestion}`,
        `Establish the situation: ${brief.scenario}`,
        `State and explain the anchor: ${brief.anchorFact.claim}`,
      ],
      sourcePolicy: {
        canonicalUrl: brief.source.canonicalUrl,
        requiredAuthority: brief.source.authority,
        officialRequired: true,
        freshnessDays: FRESHNESS_DAYS[brief.volatility] ?? 30,
      },
      timingBehavior: timing === "evergreen" ? "flexible_evergreen" : "fixed_or_campaign",
      fallback: fallbackTitle ? { kind: "named_evergreen", title: fallbackTitle } : null,
      contentIntent: INTENT_BY_VALUE_CLASS[brief.valueClass] ?? "evergreen_explainer",
      occurrenceKey: null,
      campaignStage: null,
      // Carried through so generation and the quality gate can use them.
      valueClass: brief.valueClass,
      scenario: brief.scenario,
      promise: brief.promise,
      notObvious: brief.notObvious,
      anchorFact: brief.anchorFact,
      journeyStage: brief.journeyStage,
    },
  };
}

// --- inputs -----------------------------------------------------------------
const bank = JSON.parse(await readFile(new URL("../plans/brief-bank.json", import.meta.url), "utf8"));
const calendar = JSON.parse(await readFile(new URL("../config/official-calendar-2026-2027.json", import.meta.url), "utf8"));

const start = new Date(`${argOf("start", iso(new Date()))}T00:00:00Z`);
const days = Number(argOf("days", "90"));

const calendarByDate = new Map();
for (const event of calendar.events ?? []) {
  if (!calendarByDate.has(event.date)) calendarByDate.set(event.date, []);
  calendarByDate.get(event.date).push(event);
}

// --- selection ---------------------------------------------------------------
// Briefs are consumed at most once inside the window, so nothing can repeat. Ordering
// spreads pillars rather than draining one at a time.
const pool = [...bank.briefs];

// Hold part of the bank back so failover always has somewhere to go. Without this the
// window consumes every brief and a held slot has no verified replacement, which is how
// the previous system ended up with 77 blocked concepts against 3 ready ones. The share
// is taken from the pillars with the most briefs so coverage stays broad.
const reserveShare = Number(argOf("reserve-share", "0.2"));
const reserveTarget = Math.min(pool.length, Math.max(0, Math.round(pool.length * reserveShare)));
const heldBack = new Set();
if (reserveTarget > 0) {
  const byPillarCount = new Map();
  for (const brief of pool) byPillarCount.set(brief.pillar, (byPillarCount.get(brief.pillar) ?? 0) + 1);
  const ordered = [...pool].sort((a, b) => (byPillarCount.get(b.pillar) - byPillarCount.get(a.pillar)) || a.id.localeCompare(b.id));
  for (const brief of ordered) {
    if (heldBack.size >= reserveTarget) break;
    heldBack.add(brief.id);
  }
}

const layoutPool = pool.filter(brief => !heldBack.has(brief.id));
const byPillar = new Map();
for (const brief of layoutPool) {
  if (!byPillar.has(brief.pillar)) byPillar.set(brief.pillar, []);
  byPillar.get(brief.pillar).push(brief);
}
const used = new Set();

function takeBrief({ avoidPillar, allowHighRisk }) {
  // Prefer the pillar with the most unused briefs so coverage stays even, never the
  // pillar used in the previous slot, and respect the daily high-risk cap.
  const ranked = [...byPillar.entries()]
    .map(([pillar, briefs]) => [pillar, briefs.filter(b => !used.has(b.id))])
    .filter(([pillar, briefs]) => briefs.length && pillar !== avoidPillar)
    .sort((a, b) => b[1].length - a[1].length);

  for (const [, briefs] of ranked) {
    const pick = briefs.find(b => allowHighRisk || b.risk !== "high");
    if (pick) {
      used.add(pick.id);
      return pick;
    }
  }
  return null;
}

const rows = [];
const shortfalls = [];
const occurrences = new Map();

for (let dayIndex = 0; dayIndex < days; dayIndex++) {
  const date = iso(addDays(start, dayIndex));
  const todaysEvents = [...(calendarByDate.get(date) ?? [])];
  let highRiskToday = 0;
  let previousPillar = null;

  for (let slotIndex = 0; slotIndex < SLOT_TIMES.length; slotIndex++) {
    const allowHighRisk = highRiskToday < MAX_HIGH_RISK_PER_DAY;

    // A date-locked occasion outranks evergreen material and takes the slot directly.
    const event = todaysEvents.shift();
    if (event) {
      const anchorBrief = layoutPool.find(b => b.pillar === event.subjectFamily && !used.has(b.id));
      if (anchorBrief) {
        used.add(anchorBrief.id);
        const occurrence = (occurrences.get(event.key) ?? 0) + 1;
        occurrences.set(event.key, occurrence);
        const row = toPlanRow({
          brief: { ...anchorBrief, title: event.title, risk: "high" },
          date, slotIndex, occurrence,
          timing: event.status === "confirmed" ? "official_locked" : "must_reverify",
          reserve: "date_locked",
        });
        row.brief.occurrenceKey = event.key;
        row.brief.campaignStage = "single";
        row.brief.calendarEventDate = event.date;
        row.brief.calendarStatus = event.status;
        row.authority = calendar.sources?.[event.source] ?? row.authority;
        rows.push(row);
        highRiskToday++;
        previousPillar = row.pillar;
        continue;
      }
      shortfalls.push({ date, slot: slotIndex + 1, reason: `no brief available for calendar event ${event.key}` });
    }

    const brief = takeBrief({ avoidPillar: previousPillar, allowHighRisk });
    if (!brief) {
      shortfalls.push({ date, slot: slotIndex + 1, reason: "brief bank exhausted" });
      continue;
    }

    const isNewsFlex = slotIndex === NEWS_FLEX_SLOT;
    const occurrence = (occurrences.get(brief.id) ?? 0) + 1;
    occurrences.set(brief.id, occurrence);
    rows.push(toPlanRow({
      brief,
      date,
      slotIndex,
      occurrence,
      timing: isNewsFlex ? "news_flex" : "evergreen",
      reserve: isNewsFlex ? "breaking_news" : "none",
      // The 18:00 slot yields to verified news; if none clears evidence by cutoff, this
      // named brief runs instead. It is a real authored brief, not generic filler.
      fallbackTitle: isNewsFlex ? brief.title : null,
    }));
    if (brief.risk === "high") highRiskToday++;
    previousPillar = brief.pillar;
  }
}

// --- write --------------------------------------------------------------------
const plan = {
  version: 3,
  generatedAt: new Date(Number(process.env.SOURCE_DATE_EPOCH ?? Date.now())).toISOString(),
  source: "plans/brief-bank.json",
  window: { start: iso(start), days },
  rows,
};

await mkdir(new URL("../plans", import.meta.url), { recursive: true });
await writeFile(new URL("../plans/finkavo-90-day-plan.json", import.meta.url), `${JSON.stringify(plan, null, 2)}\n`);

// The reserve is whatever the window did not consume. Deriving it here rather than
// maintaining a separate file means a fallback can never collide with a brief already
// scheduled inside the window, and reserve cards inherit the same authored anchors and
// verified sources as planned ones. The previous config/evergreen-reserve.json held 98
// cards sliced from only 14 pages, with source-centric required answers.
const reserveCards = pool
  .filter(brief => !used.has(brief.id))
  .map(brief => ({
    id: brief.id,
    subjectFamily: brief.pillar,
    topic: brief.title,
    userQuestion: brief.userQuestion,
    audience: brief.audience,
    contentIntent: INTENT_BY_VALUE_CLASS[brief.valueClass] ?? "evergreen_explainer",
    purpose: brief.promise,
    requiredAnswers: [
      `Answer directly: ${brief.userQuestion}`,
      `Establish the situation: ${brief.scenario}`,
      `State and explain the anchor: ${brief.anchorFact.claim}`,
    ],
    sourcePolicy: {
      canonicalUrl: brief.source.canonicalUrl,
      requiredAuthority: brief.source.authority,
      officialRequired: true,
      freshnessDays: FRESHNESS_DAYS[brief.volatility] ?? 30,
    },
    evidenceTerms: deriveEvidenceTerms(brief),
    status: "eligible",
  }));

await writeFile(
  new URL("../plans/finkavo-reserve.json", import.meta.url),
  `${JSON.stringify({ version: 1, generatedAt: plan.generatedAt, source: "plans/brief-bank.json (unused by the current window)", cards: reserveCards }, null, 2)}\n`,
);

const wanted = days * SLOT_TIMES.length;
const daysFilled = new Set(rows.map(r => r.date)).size;
console.log(`plan window : ${iso(start)} for ${days} days (${wanted} slots)`);
console.log(`slots filled: ${rows.length}  days covered: ${daysFilled}`);
console.log(`briefs used : ${used.size} of ${pool.length} in the bank (${heldBack.size} held back as reserve)`);

const titles = new Set(rows.map(r => r.title));
console.log(`unique titles: ${titles.size} of ${rows.length} rows` + (titles.size === rows.length ? "  (no repetition)" : "  ** REPETITION **"));

if (shortfalls.length) {
  const exhausted = shortfalls.filter(s => s.reason === "brief bank exhausted").length;
  console.log(`\nunfilled slots: ${shortfalls.length} (${exhausted} from an exhausted bank)`);
  console.log(`the bank needs ${wanted} briefs to fill ${days} days; it holds ${pool.length}.`);
  for (const shortfall of shortfalls.filter(s => s.reason !== "brief bank exhausted").slice(0, 10)) {
    console.log(`  ${shortfall.date} slot ${shortfall.slot}: ${shortfall.reason}`);
  }
}
