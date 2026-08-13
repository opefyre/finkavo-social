import type { AnnualPlanRow } from "./annual-plan.js";

const boilerplate = [
  /^NEWS RESERVE — fallback:\s*/i,
  /:\s*a plain-English explanation$/i,
  /:\s*a practical step-by-step checklist$/i,
  /:\s*mistakes, exceptions and edge cases$/i,
  /:\s*one golden tip and what to verify$/i,
  /\s+for\s+.+$/i,
  /\s+—\s+(?:first-time setup|renewal|family context|correction scenario|non-resident angle|document recovery)$/i,
];

const intentByAngle: Record<string, string> = {
  foundation: "evergreen_explainer",
  action: "checklist",
  edge_case: "common_mistake",
  audience: "audience_specific",
  golden_tip: "golden_tip",
};

export function canonicalQuestion(title: string) {
  let value = title.trim();
  for (const pattern of boilerplate) value = value.replace(pattern, "").trim();
  return value.toLocaleLowerCase("en").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

export function editorialIdentity(row: AnnualPlanRow) {
  const recurring = ["official_locked", "rule_locked", "must_reverify", "occasion", "seasonal"].includes(row.timing);
  const contentIntent = recurring ? (row.timing === "occasion" || row.timing === "seasonal" ? "occasion" : "deadline_reminder") : intentByAngle[row.angle] || "evergreen_explainer";
  const occurrenceKey = recurring ? `${row.pillar}:${canonicalQuestion(row.title)}:${row.date}` : null;
  return {
    subjectFamily: row.pillar,
    userQuestion: canonicalQuestion(row.title),
    contentIntent,
    occurrenceKey,
    campaignStage: recurring ? row.angle : null,
  };
}
