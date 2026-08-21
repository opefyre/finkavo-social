import { readFile } from "node:fs/promises";
import { renderReel } from "./render-reel.js";
import { ReelManifestSchema } from "./reel-schema.js";

const fixturePath = process.argv[2] || new URL("../fixtures/reel-irs-deadline.json", import.meta.url);
const manifest = ReelManifestSchema.parse(JSON.parse(await readFile(fixturePath, "utf8")));
const outputs = await renderReel(manifest, process.env.RENDER_OUTPUT_DIR ?? "./data/reels");
process.stdout.write(`${outputs.join("\n")}\n`);
