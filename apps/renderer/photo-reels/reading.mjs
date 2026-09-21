/**
 * How long a scene has to stay on screen for someone to actually finish reading it.
 *
 * The holds used to be typed in by hand and nudged upward whenever a reel felt fast,
 * which is guesswork with extra steps: it never says how fast is too fast, and it treats
 * a six-word payoff and a twenty-six-word explainer as if they needed the same time.
 *
 * WORDS_PER_SECOND is the budget. Subtitling practice puts comfortable adult reading at
 * roughly 17-20 characters a second; at about 5.5 characters a word that is 3.1-3.6 words
 * a second. 3.0 is the low end of that on purpose — this is dense legal copy over a
 * moving photograph, read by someone holding a phone, not a subtitle under dialogue they
 * can also hear.
 *
 * The second term matters as much: the copy animates in a word at a time, so the last
 * word of a scene does not exist until n * PER_WORD_MS have passed. A hold long enough to
 * read the text but not long enough to finish showing it is still too short.
 */

/** Comfortable reading rate for this material, in words per second. */
export const WORDS_PER_SECOND = 3.0;

/** Matches the per-word stagger cap in page.mjs. Keep the two in step. */
const PER_WORD_MS = 72;
/**
 * The last word's 240ms fade, the 180ms the scene takes to leave, and a settle buffer
 * so the final line is not still being read as it goes.
 */
const OVERHEAD_MS = 1200;

/** Every word a viewer has to read in a scene, whatever element carries it. */
export function sceneWords(scene) {
  const parts = [scene.kicker, scene.text, scene.sub, scene.figure, scene.action];
  for (const item of scene.items ?? []) parts.push(item.day, item.month, item.label);
  return parts
    .filter(Boolean)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/**
 * The shortest hold, in seconds, that lets a scene be both fully shown and fully read.
 * Rounded up to a tenth so the numbers in a spec stay legible.
 */
export function holdFor(scene) {
  const words = sceneWords(scene);
  const toShow = words * PER_WORD_MS;
  const toRead = (words / WORDS_PER_SECOND) * 1000;
  return Math.ceil((Math.max(toShow, toRead) + OVERHEAD_MS) / 100) / 10;
}

/** Derive the holds for a whole spec, so the timing follows the copy rather than a guess. */
export function holdsFor(scenes) {
  return scenes.map(holdFor);
}
