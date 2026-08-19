import { readFile } from "node:fs/promises";

export type AnnualPlanRow = {
  date: string; time: string; slot: number; pillar: string; angle: string; title: string;
  audience: string; risk: "low" | "medium" | "high"; timing: string; reserve: string;
  searchTerms: string; authority: string; occurrence: number;
  evidenceTerms: string;
  curationStatus: "curated_90_day" | "annual_candidate";
  brief: {
    subjectFamily:string; userQuestion:string; purpose:string; requiredAnswers:string[];
    sourcePolicy:{requiredAuthority:string;officialRequired:boolean;freshnessDays:number;canonicalUrl?:string};
    timingBehavior:string; fallback:{kind:string;title:string}|null; contentIntent:string; occurrenceKey:string|null;
    campaignStage?:string|null; calendarEventDate?:string|null; calendarStatus?:string|null; applicabilityScope?:string|null;
    // Present on plans built from plans/brief-bank.json. Generation and the quality gate
    // use these to hold the draft to the brief's specific promise and verifiable anchor
    // rather than to a topic string alone.
    briefId?:string;
    valueClass?:string;
    scenario?:string;
    promise?:string;
    notObvious?:string;
    anchorFact?:{claim:string;kind:string;namedThing?:string;verifyAt:string;volatility:string};
    journeyStage?:string;
  };
};

type AnnualPlan = { version: number; generatedAt: string; source?: string; window?: { start: string; days: number }; rows: AnnualPlanRow[] };

// Built by scripts/build-90-day-plan.mjs from the authored brief bank. The previous
// rolling-year file was produced by index arithmetic over a fixed topic list and is no
// longer read; see plans/BRIEF_STANDARD.md.
const PLAN_PATH = "../../../plans/finkavo-90-day-plan.json";

let cached: AnnualPlan | null = null;

export async function loadAnnualPlan(): Promise<AnnualPlan> {
  if (cached) return cached;
  const path = new URL(PLAN_PATH, import.meta.url);
  let raw: string;
  try {
    raw = await readFile(path, "utf8");
  } catch {
    throw new Error(
      `Editorial plan not found at ${PLAN_PATH}. Build it with ` +
      `'node scripts/build-90-day-plan.mjs --start <YYYY-MM-DD> --days 90'.`,
    );
  }
  const plan = JSON.parse(raw) as AnnualPlan;
  if (!plan.rows?.length) throw new Error("Editorial plan contains no rows");
  cached = plan;
  return plan;
}

/** Drops the in-memory copy so a rebuilt plan is picked up without restarting the API. */
export function invalidatePlanCache() {
  cached = null;
}

export function rowsForDate(plan: AnnualPlan, date: string) {
  return plan.rows.filter((row) => row.date === date).sort((a, b) => a.slot - b.slot);
}
