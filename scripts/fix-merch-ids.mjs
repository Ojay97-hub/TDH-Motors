/**
 * One-off migration: merch products were seeded with dotted IDs
 * (`merchProduct.<slug>`). On a public dataset, Sanity's anonymous read grant
 * only covers `_id in path("*")` (no-dot IDs), so dotted docs are omitted with
 * `reason: "permission"` for token-less (published) fetches — i.e. the live
 * site never sees them, even though they're published.
 *
 * This re-creates each merch product under a non-dotted ID (`merch-<slug>`),
 * repoints the homepage's `homepageMerch` references, and deletes the old docs,
 * all in a single atomic transaction.
 *
 * Usage: node --env-file=.env scripts/fix-merch-ids.mjs
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

// old dotted id -> new non-dotted id
const idMap = {
  "merchProduct.tdh-signature-hoodie": "merch-tdh-signature-hoodie",
  "merchProduct.dog-house-tee": "merch-dog-house-tee",
  "merchProduct.workshop-cap": "merch-workshop-cap",
  "merchProduct.garage-mug": "merch-garage-mug",
};

const SYSTEM_FIELDS = new Set(["_id", "_rev", "_createdAt", "_updatedAt"]);

async function main() {
  const oldIds = Object.keys(idMap);

  // Pull the full source docs (raw perspective, authenticated).
  const docs = await client.withConfig({ perspective: "raw" }).fetch(
    `*[_id in $ids]`,
    { ids: oldIds },
  );

  if (docs.length !== oldIds.length) {
    const found = docs.map((d) => d._id);
    console.error("Expected 4 merch docs, found:", found);
    process.exit(1);
  }

  // Pull the homepage's current merch reference list so we can repoint it.
  const home = await client.withConfig({ perspective: "raw" }).fetch(
    `*[_id == "homePage"][0]{ homepageMerch }`,
  );

  const tx = client.transaction();

  // 1. Create the replacement docs under non-dotted IDs (preserve all content).
  for (const doc of docs) {
    const newId = idMap[doc._id];
    const clone = { _id: newId, _type: doc._type };
    for (const [k, v] of Object.entries(doc)) {
      if (!SYSTEM_FIELDS.has(k)) clone[k] = v;
    }
    tx.createOrReplace(clone);
  }

  // 2. Repoint homePage.homepageMerch references to the new IDs (keep _key/order).
  if (home?.homepageMerch?.length) {
    const repointed = home.homepageMerch.map((ref) => ({
      ...ref,
      _ref: idMap[ref._ref] ?? ref._ref,
    }));
    tx.patch("homePage", (p) => p.set({ homepageMerch: repointed }));
  }

  // 3. Delete the old dotted docs (refs already repointed above, so no
  //    referential-integrity conflict within the transaction).
  for (const oldId of oldIds) {
    tx.delete(oldId);
  }

  const res = await tx.commit();
  console.log("Migration committed. Transaction:", res.transactionId);
  console.log("New merch IDs:", Object.values(idMap).join(", "));
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
