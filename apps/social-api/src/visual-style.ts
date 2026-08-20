export type VisualStyle = "petrol_editorial" | "cream_guide" | "mint_checklist" | "peach_deadline" | "ink_alert";

const stableIndex = (value: string, size: number) => {
  let hash = 2166136261;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  return (hash >>> 0) % size;
};

// Intents the plan itself is authoritative about. post_intent is chosen by the model
// at generation time, so a date-locked deadline only reached the peach palette if the
// model happened to label it a deadline_reminder. Where planning already knows what the
// slot is -- a calendar deadline or a public occasion -- that wins.
const PLANNED_INTENTS = new Set(["deadline_reminder", "occasion", "regulatory_change", "timely_news"]);

export function selectVisualStyle(post: Record<string, unknown>): VisualStyle {
  const planned = String(post.content_intent || "");
  const intent = PLANNED_INTENTS.has(planned) ? planned : String(post.post_intent || "evergreen_explainer");
  if (intent === "deadline_reminder" || intent === "occasion") return "peach_deadline";
  if (intent === "regulatory_change" || intent === "timely_news") return "ink_alert";

  // Peach is reserved for the deadline above, and appears in none of the lists below.
  // It used to sit in all three, which made it both the deadline colour and a general
  // purpose one: with roughly a quarter of the plan being dated, peach came out on close
  // to half of everything and stopped telling the reader anything. Kept exclusive, the
  // colour carries a meaning -- this one is time-sensitive -- and the remaining three
  // share the evergreen posts evenly. The hash was never the problem; it distributes
  // 4000 posts as 1000/985/999/1016.
  const key = [post.planned_for, post.id, post.topic].map(value => String(value || "")).join(":");
  if (intent === "checklist") return ["mint_checklist", "cream_guide"][stableIndex(key, 2)] as VisualStyle;
  if (intent === "common_mistake") return ["petrol_editorial", "mint_checklist"][stableIndex(key, 2)] as VisualStyle;
  return ["cream_guide", "mint_checklist", "petrol_editorial"][stableIndex(key, 3)] as VisualStyle;
}
