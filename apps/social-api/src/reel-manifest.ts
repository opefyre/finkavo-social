import { selectVisualStyle } from "./visual-style.js";

// The generated frame and the rendered frame are not the same shape, and deliberately so.
// Generation writes one line of text per frame because that is what a model can be held
// to; the template needs to know where that line goes — a hook's headline, a beat's body,
// a payoff's opening line — and those want different type sizes.
type GeneratedFrame = { type: "hook" | "beat" | "payoff"; kicker?: string; figure?: string; label?: string; text: string };

const words = (value: string) => value.trim().split(/\s+/).filter(Boolean);

/** The call to action, cut to something a payoff frame has room for. */
function shortAction(callToAction: string): string {
  const firstSentence = callToAction.split(/(?<=[.!?])\s/)[0]?.trim() || callToAction.trim();
  const parts = words(firstSentence);
  if (!parts.length) return "Check the official page.";
  if (parts.length <= 10) return firstSentence;
  // Cut at a word rather than mid-phrase, and close it so it reads as a sentence.
  return `${parts.slice(0, 9).join(" ").replace(/[,;:]$/, "")}.`;
}

export function buildReelManifest(post: Record<string, unknown>, frames: GeneratedFrame[]) {
  return {
    topic: String(post.topic ?? ""),
    visualStyle: selectVisualStyle(post),
    sourceLabel: String(post.source_label || post.required_authority || "finkavo.com · @finkavo").slice(0, 90),
    frames: frames.map(frame => {
      if (frame.type === "hook") {
        return { type: "hook" as const, ...(frame.kicker ? { kicker: frame.kicker } : {}), headline: frame.text };
      }
      if (frame.type === "beat") {
        return {
          type: "beat" as const,
          ...(frame.figure ? { figure: frame.figure } : {}),
          ...(frame.label ? { label: frame.label } : {}),
          body: frame.text,
        };
      }
      return { type: "payoff" as const, headline: frame.text, action: shortAction(String(post.call_to_action ?? "")) };
    }),
  };
}
