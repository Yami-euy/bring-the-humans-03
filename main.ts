// Bring the humans — TikTok ad entry (Node 22, standard library only).
//
// The video itself is the entry. This program does exactly one thing: it
// hands the video's address to the gate by writing VIDEO.json from the
// repository root into /output/VIDEO.json. The house reads the TikTok link
// from there and counts the video's views itself; nothing this program
// writes about the video is scored.
//
// The ad is a 21.5 s vertical (1080x1920) kinetic-typography spot, made
// with ffmpeg from make.fun's press pack: the brand badge runs from the
// first frame, the ghost crew carries the story ("My AI agent got a job"),
// a real bounty-board screenshot shows the prizes are real, and it closes
// on the referral end card with our own code. It is posted publicly on
// TikTok at @ysramrrr with the bounty's line and our play code in the
// caption; VIDEO.json names that video.
//
// The gate only accepts a video's full address,
//   https://www.tiktok.com/@<handle>/video/<digits>
// A short link (vm.tiktok.com, vt.tiktok.com, tiktok.com/t/...) or a photo
// post (/photo/<id>) is refused, and so is a malformed address — so before
// writing anything out, this program reads VIDEO.json, checks the url
// against that shape, and normalises it: a query string or fragment the
// app's Share button left behind (for example ?_r=1&_t=...) is stripped,
// because the gate reads past it anyway and the clean address is the one
// the house's reader is asked for. An address that is not a full TikTok
// video URL fails loudly (exit 1) instead of shipping a bad entry.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// A full TikTok video address, with an optional trailing slash, query
// string or fragment after the numeric id (all stripped on output).
const VIDEO_URL_RE =
  /^https:\/\/www\.tiktok\.com\/@([^/\s]+)\/video\/(\d+)(?:[/?#].*)?$/;

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function fail(message: string): never {
  console.error(`VIDEO.json rejected: ${message}`);
  process.exit(1);
}

let data: unknown;
try {
  data = JSON.parse(readFileSync(join(botDir, "VIDEO.json"), "utf8"));
} catch (err) {
  fail(
    `could not read or parse VIDEO.json out of ${botDir}: ${(err as Error).message}`,
  );
}

if (typeof data !== "object" || data === null || Array.isArray(data)) {
  fail("VIDEO.json must be a JSON object like {\"url\": \"https://www.tiktok.com/@<handle>/video/<id>\"}");
}

const url = (data as { url?: unknown }).url;
if (typeof url !== "string") {
  fail("VIDEO.json must hold a string \"url\"");
}

const match = VIDEO_URL_RE.exec(url);
if (match === null) {
  fail(
    `url ${JSON.stringify(url)} is not a full TikTok video address ` +
      `(expected https://www.tiktok.com/@<handle>/video/<digits>; ` +
      `short links such as vt.tiktok.com/... and photo posts are refused by the gate)`,
  );
}

// Normalise: keep only the canonical address, dropping any query string,
// fragment or trailing slash the Share button left behind.
const normalised = `https://www.tiktok.com/@${match[1]}/video/${match[2]}`;

mkdirSync(outDir, { recursive: true });
try {
  writeFileSync(
    join(outDir, "VIDEO.json"),
    JSON.stringify({ ...(data as Record<string, unknown>), url: normalised }) + "\n",
    "utf8",
  );
} catch (err) {
  fail(`could not write VIDEO.json to ${outDir}: ${(err as Error).message}`);
}

console.log(`wrote VIDEO.json with url ${normalised}`);
