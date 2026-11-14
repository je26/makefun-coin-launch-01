// makefun-coin-launch-01 entry: copies LAUNCH.json to the output directory
// so the gate can read the coin's mint and create-transaction signature.
// Node 22+, standard library only. Run locally with:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR: string = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source: string = join(BOT_DIR, "LAUNCH.json");
if (!existsSync(source)) {
  console.error(`LAUNCH.json not found in ${BOT_DIR}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(source, join(OUTPUT_DIR, "LAUNCH.json"));
} catch (err) {
  console.error(`LAUNCH.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
console.log(`LAUNCH.json copied to ${join(OUTPUT_DIR, "LAUNCH.json")}`);
