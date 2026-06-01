/**
 * One-time backfill: populates the Home Page document's curated `featuredCars`
 * and `homepageMerch` reference lists from whatever is currently live —
 * i.e. every car with the "Featured" checkbox ticked, and every visible merch
 * product — in the exact order the site renders them today.
 *
 * Safe to re-run:
 *   - Uses `setIfMissing`, so it never overwrites a list you've already curated.
 *   - Patches both the published doc and its draft (if one exists), so your
 *     unpublished draft edits are preserved (no draft is discarded or created).
 *   - Only adds references on the Home Page; the cars/products are untouched.
 *
 * Usage:
 *   node --env-file=.env scripts/backfill-homepage-lists.mjs
 *   (SANITY_API_WRITE_TOKEN must be set in env or .env)
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, "../.env");

try {
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] ??= m[2].trim();
  }
} catch {
  // .env optional
}

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("Error: SANITY_API_WRITE_TOKEN is not set. Add it to your .env file.");
  process.exit(1);
}

const client = createClient({
  projectId: "sk5os0jg",
  dataset: "production",
  apiVersion: "2025-05-20",
  token,
  useCdn: false,
});

const HOME_PAGE_ID = "homePage";

// Reference-array members need a stable, unique `_key`. Derive it from the
// target id so re-runs produce identical keys (no churn).
const toRef = (id) => ({
  _type: "reference",
  _ref: id,
  _key: `ref-${id.replace(/[^a-zA-Z0-9_]/g, "-")}`,
});

async function main() {
  // Published-only ids, ordered to match the frontend queries exactly:
  //   featuredCarsQuery  -> order(year desc)
  //   merchProductsQuery -> order(coalesce(sortOrder, 100) asc, _createdAt desc)
  const featuredCarIds = await client.fetch(
    `*[_type == "car" && featured == true && !(_id in path("drafts.**"))] | order(year desc)._id`,
  );
  const merchIds = await client.fetch(
    `*[_type == "merchProduct" && status != "hidden" && !(_id in path("drafts.**"))]
       | order(coalesce(sortOrder, 100) asc, _createdAt desc)._id`,
  );

  console.log(`Found ${featuredCarIds.length} featured car(s) and ${merchIds.length} visible merch product(s).\n`);

  const patch = {
    featuredCars: featuredCarIds.map(toRef),
    homepageMerch: merchIds.map(toRef),
  };

  // Patch the published doc and the draft, whichever exist. setIfMissing means
  // an already-curated list on either is left untouched.
  for (const id of [HOME_PAGE_ID, `drafts.${HOME_PAGE_ID}`]) {
    const exists = await client.fetch(`defined(*[_id == $id][0]._id)`, { id });
    if (!exists) {
      console.log(`  skipped  ${id}  (does not exist)`);
      continue;
    }
    await client.patch(id).setIfMissing(patch).commit();
    console.log(`  patched  ${id}  (setIfMissing featuredCars + homepageMerch)`);
  }

  console.log("\nDone. Open the Home Page in the Studio to review, then Publish.");
}

main().catch((err) => {
  console.error("Backfill failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
