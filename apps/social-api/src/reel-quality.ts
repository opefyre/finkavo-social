import { assertEnglishUserCopy } from "./draft-quality.js";
import { normalizedNumberTokens } from "./evidence-reliability.js";

// A reel is not a decoration on a post that was already checked — it makes its own
// claims, in its own words, to someone who will never see the caption or the sources
// underneath it. It gets the same kind of scrutiny the slides get, adapted to a format
// where there is no room to qualify anything.

export type ReelFrameDraft = {
  type: "hook" | "beat" | "payoff";
  kicker?: string;
  figure?: string;
  label?: string;
  text: string;
};

const WORD_CAP: Record<ReelFrameDraft["type"], number> = { hook: 12, beat: 12, payoff: 10 };
const words = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
const normalise = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();

/** Institutions a viewer cannot be assumed to know, and what the reel should say instead. */
const SPELL_OUT: Array<{ acronym: RegExp; say: string }> = [
  { acronym: /\bAT\b/, say: "the tax authority" },
  { acronym: /\bAIMA\b/, say: "the immigration agency" },
  { acronym: /\bIRN\b/, say: "the registry office" },
  { acronym: /\bISS\b/, say: "Social Security" },
  { acronym: /\bACT\b/, say: "the labour authority" },
  { acronym: /\bCPLP\b/, say: "the Portuguese-language community" },
  { acronym: /\bEBF\b/, say: "the tax benefits statute" },
  { acronym: /\bCIRS\b/, say: "the income tax code" },
  { acronym: /\bCPPT\b/, say: "the tax procedure code" },
];

export function validateReelFrames(frames: ReelFrameDraft[], corpusText: string): { ok: true } | { ok: false; reason: string } {
  const fail = (reason: string) => ({ ok: false as const, reason });

  if (frames.length < 3 || frames.length > 5) {
    return fail(`a reel needs three to five frames, this one has ${frames.length}`);
  }
  if (frames[0]!.type !== "hook") return fail("the first frame must be the hook");
  if (frames.at(-1)!.type !== "payoff") return fail("the last frame must be the payoff");
  if (frames.slice(1, -1).some(frame => frame.type !== "beat")) return fail("everything between the hook and the payoff must be a beat");
  if (frames.filter(frame => frame.type === "hook").length !== 1) return fail("a reel has exactly one hook");
  if (frames.filter(frame => frame.type === "payoff").length !== 1) return fail("a reel has exactly one payoff");

  const everything = frames.flatMap(frame => [frame.kicker ?? "", frame.label ?? "", frame.text]);
  try {
    assertEnglishUserCopy(everything);
  } catch {
    return fail("reel copy must be English; only a figure may carry a Portuguese term");
  }

  for (const [index, frame] of frames.entries()) {
    const position = `frame ${index + 1} (${frame.type})`;
    const count = words(frame.text);
    if (count > WORD_CAP[frame.type]) {
      return fail(`${position} has ${count} words and there is time for ${WORD_CAP[frame.type]}`);
    }
    if (frame.figure && words(frame.figure) > 3) {
      return fail(`${position} has a figure of ${words(frame.figure)} words; a figure is three words at most`);
    }

    // The figure is the largest thing on the frame. Repeating it underneath spends the
    // only other line saying what the viewer has already read.
    if (frame.figure) {
      const figure = normalise(frame.figure);
      if (figure && normalise(frame.text).includes(figure)) {
        return fail(`${position} repeats its figure "${frame.figure}" in the text below it`);
      }
    }

    for (const { acronym, say } of SPELL_OUT) {
      if (acronym.test(`${frame.text} ${frame.label ?? ""} ${frame.kicker ?? ""}`)) {
        return fail(`${position} uses an acronym a viewer cannot look up mid-scroll; write "${say}"`);
      }
    }
  }

  // Every figure shown has to be one the source states. A reel is the part of the post
  // most likely to be believed on sight and least likely to be checked, so a number that
  // is not in the evidence is the worst thing it could carry.
  const evidence = new Set(normalizedNumberTokens(corpusText));
  for (const [index, frame] of frames.entries()) {
    if (!frame.figure) continue;
    const shown = normalizedNumberTokens(frame.figure);
    const unsupported = shown.find(token => !evidence.has(token));
    if (unsupported) {
      return fail(`frame ${index + 1} shows "${frame.figure}", which the evidence does not state`);
    }
  }

  return { ok: true };
}
