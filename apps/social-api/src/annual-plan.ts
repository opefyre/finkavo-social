import { readFile } from "node:fs/promises";

export type AnnualPlanRow = {
  date: string; time: string; slot: number; pillar: string; angle: string; title: string;
  audience: string; risk: "low" | "medium" | "high"; timing: string; reserve: string;
  searchTerms: string; authority: string; occurrence: number;
  evidenceTerms: string;
  curationStatus: "curated_90_day" | "annual_candidate";
  brief: {
    subjectFamily:string; userQuestion:string; purpose:string; requiredAnswers:string[];
    sourcePolicy:{requiredAuthority:string;officialRequired:boolean;freshnessDays:number};
    timingBehavior:string; fallback:{kind:string;title:string}|null; contentIntent:string; occurrenceKey:string|null;
    campaignStage?:string|null; calendarEventDate?:string|null; calendarStatus?:string|null; applicabilityScope?:string|null;
  };
};

type AnnualPlan = { version: number; generatedAt: string; rows: AnnualPlanRow[] };

export async function loadAnnualPlan(): Promise<AnnualPlan> {
  const path = new URL("../../../plans/finkavo-rolling-year-2026-08-13.json", import.meta.url);
  return JSON.parse(await readFile(path, "utf8")) as AnnualPlan;
}

export function rowsForDate(plan: AnnualPlan, date: string) {
  return plan.rows.filter((row) => row.date === date).sort((a, b) => a.slot - b.slot);
}
