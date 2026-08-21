import { readFile } from "node:fs/promises";
import path from "node:path";
import { composeReel } from "./compose-reel.js";
import { renderReel } from "./render-reel.js";
import { ReelManifestSchema } from "./reel-schema.js";

const fixturePath = process.argv[2] || new URL("../fixtures/reel-imi-august.json", import.meta.url);
const manifest = ReelManifestSchema.parse(JSON.parse(await readFile(fixturePath, "utf8")));
const outputDir = process.env.RENDER_OUTPUT_DIR ?? "./data/reels";

const frames = await renderReel(manifest, outputDir);
const video = await composeReel(manifest, frames, path.join(outputDir, "reel.mp4"));
process.stdout.write(`${frames.join("\n")}\n${video.path} (${video.seconds}s)\n`);
