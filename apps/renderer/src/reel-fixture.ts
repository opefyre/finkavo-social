import { readFile } from "node:fs/promises";
import path from "node:path";
import { composeReel } from "./compose-reel.js";
import { renderReel } from "./render-reel.js";
import { ReelManifestSchema } from "./reel-schema.js";
import { chooseSound, loadSoundLibrary } from "./sound-library.js";

const fixturePath = process.argv[2] || new URL("../fixtures/reel-imi-august.json", import.meta.url);
const manifest = ReelManifestSchema.parse(JSON.parse(await readFile(fixturePath, "utf8")));
const outputDir = process.env.RENDER_OUTPUT_DIR ?? "./data/reels";
const assetRoot = path.resolve(process.env.RENDER_ASSET_ROOT || "branding/assets");

const library = await loadSoundLibrary(assetRoot);
process.stdout.write(`library: ${library.music.length} music, ${library.effects.length} effects\n`);

const frames = await renderReel(manifest, outputDir);

// Show what the library actually does across a feed: the same frames given the soundtrack
// each of several posts would have received.
const keys = (process.env.REEL_SOUND_KEYS || manifest.topic).split("|");
for (const key of keys) {
  const sound = chooseSound(key, library);
  if (!sound) { process.stdout.write(`  ${key}: no sound available\n`); continue; }
  const audio = sound.kind === "music" ? { musicPath: sound.path } : { effectPath: sound.path };
  const out = await composeReel(manifest, frames, path.join(outputDir, `reel-${sound.kind}-${sound.name}.mp4`), audio);
  process.stdout.write(`  ${key.slice(0, 26).padEnd(27)} -> ${sound.kind.padEnd(6)} ${sound.name.padEnd(20)} ${out.seconds}s\n`);
}
