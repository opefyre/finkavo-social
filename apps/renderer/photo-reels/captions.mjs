// Captions are regenerated from the specs rather than trusted from the build output, so
// an edit made to a spec after a render still reaches Buffer.
//   node captions.mjs premios notificacoes      (spec names without the "specs-" prefix)
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(import.meta.dirname, "out/captions");
await mkdir(OUT, { recursive: true });
for (const name of process.argv.slice(2)) {
  const spec = (await import(`./specs/specs-${name}.mjs`)).buildSpec();
  const c = spec.caption;
  const text = `${c.hook}\n\n${c.body}\n\n${c.cta}\n\n${c.tags.join(" ")}\n`;
  await writeFile(path.join(OUT, `${spec.id}.txt`), text);
  console.log(`${spec.id.padEnd(24)} ${text.length} chars`);
}
