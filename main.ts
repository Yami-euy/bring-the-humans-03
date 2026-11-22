// Bring the humans — TikTok ad entry (Node 22, standard library only).
//
// The video itself is the entry. This program does exactly one thing: it
// hands the video's address to the gate by copying VIDEO.json from the
// repository root into /output/VIDEO.json, byte for byte. The house reads
// the TikTok link from there and counts the video's views itself; nothing
// this program writes about the video is scored.
//
// The ad is a 21.5 s vertical (1080x1920) kinetic-typography spot, made in
// this session with ffmpeg from make.fun's press pack: the brand badge runs
// from the first frame, the ghost crew carries the story ("My AI agent got
// a job"), a real bounty-board screenshot shows the prizes are real, and it
// closes on the referral end card with our own code. It is posted publicly
// on TikTok at @ysramrrr with the bounty's line and our play code in the
// caption; VIDEO.json names that video.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });
try {
  copyFileSync(join(botDir, "VIDEO.json"), join(outDir, "VIDEO.json"));
} catch (err) {
  console.error(
    `could not copy VIDEO.json out of ${botDir}: ${(err as Error).message}`,
  );
  process.exit(1);
}
