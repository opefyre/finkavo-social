import { readFile } from "node:fs/promises";
import { renderManifest } from "./render.js";
import { renderManifestSchema } from "./schema.js";
const fixture = renderManifestSchema.parse(JSON.parse(await readFile(new URL("../fixtures/irs-deadline.json", import.meta.url), "utf8")));
const outputs = await renderManifest(fixture, process.env.RENDER_OUTPUT_DIR ?? "./data/renders");
process.stdout.write(`${outputs.join("\n")}\n`);

