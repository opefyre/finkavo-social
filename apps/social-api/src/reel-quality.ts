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

// A reel used to carry about a quarter of what its carousel carried — 6.8 words a frame
// against 26.4 a slide — because the caps were set to what a viewer could read while the
// frame went past. That optimises for the wrong thing. A frame nobody can finish in 1.7
// seconds is a frame they stop to read, and a stopped viewer is a longer view, a replay,
// and something worth saving. The reel should say what the carousel says.
//
// The ceilings below are what the layout can typeset legibly at 1080x1920, not what can
// be read at speed. The floors matter as much: a model given room to write a sentence
// will still hand back four words if nothing stops it, which is how this drifted in the
// first place.
// These must not exceed what apps/renderer/src/reel-schema.ts will typeset, because that
// schema is applied at render time — long after the draft has passed every gate here and
// been approved. The payoff sat at 32 against the renderer's 20, and a payoff frame's text
// becomes the headline verbatim, so any payoff of 21 to 32 words passed generation and
// then failed to render. The post still went out, silently downgraded to the carousel it
// was also written as, and the only trace was a self-test line the next morning.
//
// hook headline 22, beat body 42, payoff headline 20 — mirrored from the renderer.
export const WORD_CAP: Record<ReelFrameDraft["type"], number> = { hook: 22, beat: 42, payoff: 20 };
// The hook floor rises with the others so it stays consistent with the 70-character
// minimum the wire schema now enforces: roughly twelve words, which is a full opening
// line rather than a headline.
// The model writes to whatever floor it is given and stops there — six words when there
// was none, ten when the floor was fourteen, sixteen when it was raised. So the floor
// is set where the copy should actually land: a beat at the weight of a carousel slide,
// which measured 26 words. The hook stays shorter because an opening line is a
// different job, and it is bounded below by the 70-character minimum on the wire.
// Settable without a deploy, because this is the one number that decides whether the
// reel reads like a carousel or like a headline, and it is a judgement about the account
// rather than about the code. A beat floor of 14 is measured — it produced 16-word beats
// and 59-word reels. Twenty-two aims at carousel parity, which is what the format is for,
// but the model has to agree: it writes to whatever floor it is given and stops there, so
// too high a floor means reels get dropped and posts go out as carousels instead. Lower
// REEL_MIN_BEAT_WORDS if that starts happening.
export const WORD_FLOOR: Record<ReelFrameDraft["type"], number> = {
  hook: Number(process.env.REEL_MIN_HOOK_WORDS ?? 12),
  beat: Number(process.env.REEL_MIN_BEAT_WORDS ?? 22),
  payoff: Number(process.env.REEL_MIN_PAYOFF_WORDS ?? 15),
};
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
    if (count < WORD_FLOOR[frame.type]) {
      return fail(`${position} has only ${count} words; a ${frame.type} frame needs at least ${WORD_FLOOR[frame.type]} so there is something worth pausing on`);
    }
    if (count > WORD_CAP[frame.type]) {
      return fail(`${position} has ${count} words and the frame can typeset ${WORD_CAP[frame.type]}`);
    }
    if (frame.figure && words(frame.figure) > 3) {
      return fail(`${position} has a figure of ${words(frame.figure)} words; a figure is three words at most`);
    }

    // There used to be a rule here forbidding the text from repeating its own figure. It
    // was right when a frame was six words and the figure would have been most of it. Now
    // that every frame clears a floor of at least twelve words, no frame is terse enough
    // for that to be a waste — and inside a sentence, naming the figure is how the
    // sentence works. The rule could no longer fire, so it is gone rather than left as a
    // branch nothing reaches.

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
