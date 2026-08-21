import { readdir } from "node:fs/promises";
import path from "node:path";

// The library has two halves and a reel draws from one of them, never both. Together they
// fought: the bed wants to sit under the whole thing and the sweep wants the moment of the
// cut, and mixed they read as a video that could not decide what it was.
//
// Music is supplied and licence-free — nothing here generates it, because generating music
// worth listening to is not something this pipeline should pretend to do. Effects are
// generated, because a filtered noise sweep is a shape rather than a composition and needs
// no licence from anyone.
export type ReelSound =
  | { kind: "music"; name: string; path: string }
  | { kind: "effect"; name: string; path: string };

const MUSIC_DIR = "audio/music";
const EFFECT_DIR = "audio/effects";

const stableIndex = (value: string, size: number) => {
  let hash = 2166136261;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  return size > 0 ? (hash >>> 0) % size : 0;
};

async function listFiles(root: string, folder: string, extensions: string[]): Promise<string[]> {
  try {
    const dir = path.join(root, folder);
    const entries = await readdir(dir);
    return entries.filter(name => extensions.includes(path.extname(name).toLowerCase())).sort().map(name => path.join(dir, name));
  } catch {
    return [];
  }
}

export async function loadSoundLibrary(assetRoot: string) {
  const [music, effects] = await Promise.all([
    listFiles(assetRoot, MUSIC_DIR, [".mp3", ".m4a", ".wav"]),
    listFiles(assetRoot, EFFECT_DIR, [".wav", ".mp3"]),
  ]);
  return { music, effects };
}

/**
 * Chooses what a reel sounds like from a key that identifies the post. The same post
 * always sounds the same — a re-render after an edit should not change the soundtrack —
 * while across the feed the choice moves, so the account does not have one song.
 */
export function chooseSound(key: string, library: { music: string[]; effects: string[] }): ReelSound | null {
  const wantsMusic = stableIndex(`bed:${key}`, 2) === 0;
  const order = wantsMusic ? ["music", "effects"] as const : ["effects", "music"] as const;
  for (const half of order) {
    const files = half === "music" ? library.music : library.effects;
    if (!files.length) continue;
    const file = files[stableIndex(`${half}:${key}`, files.length)]!;
    return { kind: half === "music" ? "music" : "effect", name: path.basename(file, path.extname(file)), path: file };
  }
  return null;
}
