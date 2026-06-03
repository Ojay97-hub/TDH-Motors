/**
 * One-time backfill: populates the Merch Page document's curated `products`
 * reference list from whatever is currently live — i.e. every visible merch
 * product, in the exact order the /merch grid renders them today.
 *
 * Without this, a brand-new `products` field is empty, which the site treats as
 * "show all visible products" — correct on the page, but the Studio field reads
 * "No items", so editors can't see/reorder/remove what's actually shown. This
 * seeds the list so it mirrors the current page.
 *
 * Safe to re-run:
 *   - Uses `setIfMissing`, so it never overwrites a list you've already curated.
 *   - Patches both the published doc and its draft (if one exists), so your
 *     unpublished draft edits are preserved (no draft is discarded or created).
 *   - Only adds references on the Merch Page; the products themselves are untouched.
 *
 * Usage:
 *   node --env-file=.env scripts/backfill-merchpage-products.mjs
 *   (SANITY_API_WRITE_TOKEN must be set in env or .env)
 */

import { createClient } from "@sanity/client";
import { getSanityWriteConfig } from "./sanity-write-config.mjs";

const { projectId, dataset, token } = getSanityWriteConfig();

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-05-20",
  token,
  useCdn: false,
});

const MERCH_PAGE_ID = "merchPage";

// Reference-array members need a stable, unique `_key`. Derive it from the
// target id so re-runs produce identical keys (no churn).
const toRef = (id) => ({
  _type: "reference",
  _ref: id,
  _key: `ref-${id.replace(/[^a-zA-Z0-9_]/g, "-")}`,
});

async function main() {
  // Published-only ids, ordered to match the frontend query exactly:
  //   merchProductsQuery -> order(coalesce(sortOrder, 100) asc, _createdAt desc)
  const merchIds = await client.fetch(
    `*[_type == "merchProduct" && status != "hidden" && !(_id in path("drafts.**"))]
       | order(coalesce(sortOrder, 100) asc, _createdAt desc)._id`,
  );

  console.log(`Found ${merchIds.length} visible merch product(s).\n`);

  const patch = { products: merchIds.map(toRef) };

  // Patch the published doc and the draft, whichever exist. setIfMissing means
  // an already-curated list on either is left untouched.
  for (const id of [MERCH_PAGE_ID, `drafts.${MERCH_PAGE_ID}`]) {
    const exists = await client.fetch(`defined(*[_id == $id][0]._id)`, { id });
    if (!exists) {
      console.log(`  skipped  ${id}  (does not exist)`);
      continue;
    }
    await client.patch(id).setIfMissing(patch).commit();
    console.log(`  patched  ${id}  (setIfMissing products)`);
  }

  console.log("\nDone. Open the Merch Page in the Studio to review, then Publish.");
}

main().catch((err) => {
  console.error("Backfill failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
