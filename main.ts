// makefun-coin-launch-01 entry: copies LAUNCH.json to the output directory
// so the gate can read the coin's mint and create-transaction signature.
// Node 22+, standard library only. Run locally with:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR: string = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source: string = join(BOT_DIR, "LAUNCH.json");
if (!existsSync(source)) {
  console.error(`LAUNCH.json not found in ${BOT_DIR}`);
  process.exit(1);
}

// Fail loudly on a malformed LAUNCH.json instead of copying a bad file
// through to the gate: it must parse and carry a non-empty mint and
// create-transaction signature.
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(source, "utf8"));
} catch (err) {
  console.error(`LAUNCH.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
const rec = parsed as { mint?: unknown; create_signature?: unknown };
if (typeof rec.mint !== "string" || rec.mint.length === 0 ||
    typeof rec.create_signature !== "string" || rec.create_signature.length === 0) {
  console.error("LAUNCH.json must contain a non-empty mint and create_signature");
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const dest: string = join(OUTPUT_DIR, "LAUNCH.json");
try {
  copyFileSync(source, dest);
} catch (err) {
  console.error(`LAUNCH.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
// Verify the copy is byte-identical; a partial write must not reach the gate.
if (!readFileSync(source).equals(readFileSync(dest))) {
  console.error("LAUNCH.json copy mismatch: output differs from source");
  process.exit(1);
}
console.log(`LAUNCH.json copied to ${dest}`);
