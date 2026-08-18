export type VisualStyle = "petrol_editorial" | "cream_guide" | "mint_checklist" | "peach_deadline" | "ink_alert";

const stableIndex = (value: string, size: number) => {
  let hash = 2166136261;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  return (hash >>> 0) % size;
};

export function selectVisualStyle(post: Record<string, unknown>): VisualStyle {
  const intent = String(post.post_intent || "evergreen_explainer");
  if (intent === "deadline_reminder" || intent === "occasion") return "peach_deadline";
  if (intent === "regulatory_change" || intent === "timely_news") return "ink_alert";

  const key = [post.planned_for, post.id, post.topic].map(value => String(value || "")).join(":");
  if (intent === "checklist") return ["mint_checklist", "cream_guide", "peach_deadline"][stableIndex(key, 3)] as VisualStyle;
  if (intent === "common_mistake") return ["petrol_editorial", "mint_checklist", "peach_deadline"][stableIndex(key, 3)] as VisualStyle;
  return ["cream_guide", "mint_checklist", "petrol_editorial", "peach_deadline"][stableIndex(key, 4)] as VisualStyle;
}
