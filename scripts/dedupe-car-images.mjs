/**
 * Removes duplicate photos from car `images` arrays.
 *
 * Dragging the same batch of photos into a car twice attaches every one of them
 * again — the gallery then shows each shot twice. This keeps the first
 * occurrence of each asset (preserving the editor's chosen order) and drops the
 * later repeats.
 *
 * Only the duplicate array entries are unset, by `_key`. The array is never
 * rewritten wholesale, so nothing else on the document can be clobbered.
 *
 * Drafts are handled alongside published docs — otherwise publishing a stale
 * draft would put the duplicates straight back.
 *
 * Entries with no photo attached (failed or abandoned uploads) are always
 * reported but only removed with --drop-empty. They're invisible on the site —
 * the GROQ projection drops them — so they're untidy rather than broken.
 *
 * Usage:
 *   node --env-file=.env scripts/dedupe-car-images.mjs                # dry run
 *   node --env-file=.env scripts/dedupe-car-images.mjs --apply        # write
 *   node --env-file=.env scripts/dedupe-car-images.mjs --drop-empty   # also clear empty slots
 */

import { createClient } from "@sanity/client";
import { getSanityWriteConfig } from "./sanity-write-config.mjs";

const apply = process.argv.includes("--apply");
const dropEmpty = process.argv.includes("--drop-empty");
const { projectId, dataset, token } = getSanityWriteConfig();

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-05-20",
  token,
  useCdn: false,
  // "raw" so drafts come back as their own documents rather than being
  // overlaid on (or hidden behind) the published version.
  perspective: "raw",
});

function carLabel(car) {
  const name = [car.year, car.make, car.model].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  return name || car.slug || car._id;
}

/**
 * Splits an images array into the repeats (second and later use of an asset,
 * keeping the first so the editor's ordering survives) and the entries that
 * never got a photo attached at all.
 */
function classify(images) {
  const seen = new Set();
  const duplicates = [];
  const empty = [];

  for (const item of Array.isArray(images) ? images : []) {
    const ref = item?.asset?._ref;
    if (!ref) {
      empty.push(item);
      continue;
    }
    if (seen.has(ref)) duplicates.push(item);
    else seen.add(ref);
  }

  return { duplicates, empty };
}

const cars = await client.fetch(
  `*[_type == "car" && defined(images)]{ _id, "slug": slug.current, make, model, year, images }`,
);

let totalDuplicates = 0;
let totalEmpty = 0;
const plan = [];

for (const car of cars) {
  const { duplicates, empty } = classify(car.images);
  const targets = dropEmpty ? [...duplicates, ...empty] : duplicates;
  if (targets.length === 0 && empty.length === 0) continue;

  // Every entry needs a _key to be targeted individually. Sanity adds these
  // automatically, but bail loudly rather than guess if one is missing.
  const missingKeys = targets.filter((item) => !item._key);
  if (missingKeys.length > 0) {
    console.error(
      `  ! ${carLabel(car)} (${car._id}) has ${missingKeys.length} entr${missingKeys.length === 1 ? "y" : "ies"} without a _key — skipping, fix this one by hand.`,
    );
    continue;
  }

  totalDuplicates += duplicates.length;
  totalEmpty += empty.length;
  plan.push({ car, duplicates, empty, targets });
}

if (plan.length === 0) {
  console.log("No duplicate or empty car photos found. Nothing to do.");
  process.exit(0);
}

const verb = apply ? "Removing" : "Would remove";
console.log(
  `${verb} ${totalDuplicates} duplicate photo${totalDuplicates === 1 ? "" : "s"}` +
    (dropEmpty ? ` and ${totalEmpty} empty slot${totalEmpty === 1 ? "" : "s"}` : "") +
    `:\n`,
);

for (const { car, duplicates, empty, targets } of plan) {
  const isDraft = car._id.startsWith("drafts.");
  const before = car.images.length;
  console.log(`  ${carLabel(car)}${isDraft ? "  [draft]" : ""}`);
  console.log(`    ${before} entries -> ${before - targets.length}`);
  for (const item of duplicates) {
    console.log(`      - duplicate  ${item.asset._ref}`);
  }
  for (let i = 0; i < empty.length; i++) {
    console.log(
      `      ${dropEmpty ? "- empty slot (no photo attached)" : "· empty slot (kept — pass --drop-empty to remove)"}`,
    );
  }
}

if (!apply) {
  console.log("\nDry run only. Re-run with --apply to make these changes.");
  process.exit(0);
}

console.log("");
for (const { car, targets } of plan) {
  if (targets.length === 0) continue;
  const paths = targets.map((item) => `images[_key=="${item._key}"]`);
  await client.patch(car._id).unset(paths).commit();
  console.log(`  updated  ${carLabel(car)}  (${car._id})`);
}

console.log(
  `\nDone. Removed ${totalDuplicates} duplicate${dropEmpty ? ` and ${totalEmpty} empty` : ""} photo entr${totalDuplicates + (dropEmpty ? totalEmpty : 0) === 1 ? "y" : "ies"}.`,
);
