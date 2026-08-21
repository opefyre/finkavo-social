import { readFile } from "node:fs/promises";
import path from "node:path";
import { composeReel } from "./compose-reel.js";
import { renderReel } from "./render-reel.js";
import { ReelManifestSchema } from "./reel-schema.js";

const fixturePath = process.argv[2] || new URL("../fixtures/reel-imi-august.json", import.meta.url);
const manifest = ReelManifestSchema.parse(JSON.parse(await readFile(fixturePath, "utf8")));
const outputDir = process.env.RENDER_OUTPUT_DIR ?? "./data/reels";
const musicPath = process.env.REEL_MUSIC_PATH;

const frames = await renderReel(manifest, outputDir);

// Frames are rendered once and scored three ways, so the only difference between the
// files is what they sound like.
const variants: Array<[string, { musicPath?: string; whoosh?: boolean }]> = [
  ["music", { musicPath }],
  ["whoosh", { whoosh: true }],
  ["music-and-whoosh", { musicPath, whoosh: true }],
];

for (const [name, audio] of variants) {
  if (audio.musicPath === undefined && name !== "whoosh") continue;
  const out = await composeReel(manifest, frames, path.join(outputDir, `reel-${name}.mp4`), audio);
  process.stdout.write(`${out.path} (${out.seconds}s)\n`);
}
