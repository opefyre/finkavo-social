import { readFile } from "node:fs/promises";
import path from "node:path";
import { composeReelMotion } from "./compose-reel.js";
import { renderReelMotionFrames } from "./render-reel.js";
import { ReelManifestSchema } from "./reel-schema.js";
import { chooseSound, loadSoundLibrary } from "./sound-library.js";

const fixturePath = process.argv[2] || new URL("../fixtures/reel-imi-august.json", import.meta.url);
const manifest = ReelManifestSchema.parse(JSON.parse(await readFile(fixturePath, "utf8")));
const outputDir = process.env.RENDER_OUTPUT_DIR ?? "./data/reels-motion";
const assetRoot = path.resolve(process.env.RENDER_ASSET_ROOT || "branding/assets");

const library = await loadSoundLibrary(assetRoot);
const started = Date.now();
const { files, fps, durationMs } = await renderReelMotionFrames(manifest, outputDir);
process.stdout.write(`captured ${files.length} frames at ${fps}fps (${(durationMs / 1000).toFixed(1)}s) in ${((Date.now() - started) / 1000).toFixed(1)}s\n`);

const sound = chooseSound(manifest.topic, library);
const audio = !sound ? {} : sound.kind === "music" ? { musicPath: sound.path } : { effectPath: sound.path };
const out = await composeReelMotion(
  path.join(path.resolve(outputDir), "motion"),
  files.length,
  fps,
  path.join(path.resolve(outputDir), "reel-motion.mp4"),
  audio,
);
process.stdout.write(`wrote ${out.path} (${out.seconds}s, ${sound ? `${sound.kind} ${sound.name}` : "silent"})\n`);
