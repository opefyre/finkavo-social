import { readFile } from "node:fs/promises";
import { renderManifest } from "./render.js";
import { renderManifestSchema } from "./schema.js";
const fixturePath = process.argv[2] || new URL("../fixtures/irs-deadline.json", import.meta.url);
const fixture = renderManifestSchema.parse(JSON.parse(await readFile(fixturePath, "utf8")));
const outputs = await renderManifest(fixture, process.env.RENDER_OUTPUT_DIR ?? "./data/renders");
process.stdout.write(`${outputs.join("\n")}\n`);
