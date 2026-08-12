import { readFile } from "node:fs/promises";

export type CampaignStage = { daysBefore: number; stage: string };
export type EditorialRule = {
  slug: string; title: string; category: string; audience: string; riskLevel: "low" | "medium" | "high";
  kind: "annual-date" | "month-end" | "monthly-date"; dates?: string[]; months?: number[]; day?: number; campaign: CampaignStage[];
  sourceUrl: string; sourceLabel: string; verificationCadenceDays: number;
};
export type CalendarConfig = { version: number; timezone: string; rules: EditorialRule[] };
export type PlannedOccurrence = EditorialRule & { dueDate: string; publishDate: string; campaignStage: string; score: number; fingerprint: string };

const iso = (date: Date) => date.toISOString().slice(0, 10);
const atUtcNoon = (date: string) => new Date(`${date}T12:00:00Z`);
const addDays = (date: string, days: number) => { const value = atUtcNoon(date); value.setUTCDate(value.getUTCDate() + days); return iso(value); };
const lastDay = (year: number, month: number) => new Date(Date.UTC(year, month, 0, 12)).getUTCDate();

export async function loadEditorialCalendar(): Promise<CalendarConfig> {
  const path = new URL("../../../config/editorial-calendar.json", import.meta.url);
  return JSON.parse(await readFile(path, "utf8")) as CalendarConfig;
}

export function expandCalendar(config: CalendarConfig, fromDate: string, days = 400): PlannedOccurrence[] {
  const from = atUtcNoon(fromDate);
  const until = atUtcNoon(addDays(fromDate, days));
  const years = [from.getUTCFullYear(), from.getUTCFullYear() + 1, from.getUTCFullYear() + 2];
  const output: PlannedOccurrence[] = [];
  for (const rule of config.rules) {
    const dueDates: string[] = [];
    for (const year of years) {
      if (rule.kind === "annual-date") for (const partial of rule.dates ?? []) dueDates.push(`${year}-${partial}`);
      if (rule.kind === "month-end") for (const month of rule.months ?? []) dueDates.push(`${year}-${String(month).padStart(2, "0")}-${lastDay(year, month)}`);
      if (rule.kind === "monthly-date") for (let month = 1; month <= 12; month++) dueDates.push(`${year}-${String(month).padStart(2, "0")}-${String(Math.min(rule.day ?? 1, lastDay(year, month))).padStart(2, "0")}`);
    }
    for (const dueDate of dueDates) {
      const due = atUtcNoon(dueDate);
      if (due < from || due > until) continue;
      for (const stage of rule.campaign) {
        const publishDate = addDays(dueDate, -stage.daysBefore);
        const urgency = Math.max(0, 45 - stage.daysBefore);
        const risk = rule.riskLevel === "high" ? 30 : rule.riskLevel === "medium" ? 15 : 5;
        output.push({ ...rule, dueDate, publishDate, campaignStage: stage.stage, score: 50 + urgency + risk, fingerprint: `${rule.slug}:${dueDate}:${stage.stage}` });
      }
    }
  }
  return output.sort((a, b) => a.publishDate.localeCompare(b.publishDate) || b.score - a.score);
}

export function selectDailyMix(items: PlannedOccurrence[], date: string, capacity = 2) {
  const eligible = items.filter((item) => item.publishDate <= date && item.dueDate >= date).sort((a, b) => b.score - a.score);
  const selected: PlannedOccurrence[] = [];
  for (const item of eligible) {
    if (selected.length >= Math.max(1, Math.min(capacity, 5))) break;
    if (selected.some((chosen) => chosen.category === item.category)) continue;
    selected.push(item);
  }
  return selected;
}
