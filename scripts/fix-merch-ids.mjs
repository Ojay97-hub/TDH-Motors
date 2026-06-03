/**
 * One-off migration: merch products were seeded with dotted IDs
 * (`merchProduct.<slug>`). On a public dataset, Sanity's anonymous read grant
 * only covers `_id in path("*")` (no-dot IDs), so dotted docs are omitted with
 * `reason: "permission"` for token-less (published) fetches — i.e. the live
 * site never sees them, even though they're published.
 *
 * This re-creates each merch product under a non-dotted ID (`merch-<slug>`),
 * repoints references to the old IDs, and deletes the old docs, all in a
 * single atomic transaction.
 *
 * Usage: node --env-file=.env scripts/fix-merch-ids.mjs
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

// old dotted id -> new non-dotted id
const idMap = {
  "merchProduct.tdh-signature-hoodie": "merch-tdh-signature-hoodie",
  "merchProduct.dog-house-tee": "merch-dog-house-tee",
  "merchProduct.workshop-cap": "merch-workshop-cap",
  "merchProduct.garage-mug": "merch-garage-mug",
};

const SYSTEM_FIELDS = new Set(["_id", "_rev", "_createdAt", "_updatedAt"]);

function replaceRefs(value) {
  if (Array.isArray(value)) {
    return value.map(replaceRefs);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const next = {};
  for (const [key, nested] of Object.entries(value)) {
    next[key] = key === "_ref" && idMap[nested] ? idMap[nested] : replaceRefs(nested);
  }
  return next;
}

function changedTopLevelFields(doc) {
  const patch = {};
  for (const [key, value] of Object.entries(doc)) {
    if (SYSTEM_FIELDS.has(key)) continue;
    const next = replaceRefs(value);
    if (JSON.stringify(next) !== JSON.stringify(value)) {
      patch[key] = next;
    }
  }
  return patch;
}

async function main() {
  const oldIds = Object.keys(idMap);
  const newIds = Object.values(idMap);

  // Pull the full source docs (raw perspective, authenticated).
  const docs = await client.withConfig({ perspective: "raw" }).fetch(
    `*[_id in $ids]`,
    { ids: oldIds },
  );

  if (docs.length === 0) {
    const replacementDocs = await client.fetch(`*[_id in $ids]._id`, { ids: newIds });
    if (replacementDocs.length === newIds.length) {
      console.log("No dotted merch docs found. Migration already complete.");
      return;
    }
  }

  if (docs.length !== oldIds.length) {
    const found = docs.map((d) => d._id);
    console.error("Expected 4 merch docs, found:", found);
    process.exit(1);
  }

  const referencingDocs = await client.withConfig({ perspective: "raw" }).fetch(
    `*[references($ids)]`,
    { ids: oldIds },
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

  // 2. Repoint every document that references the old IDs.
  for (const doc of referencingDocs) {
    if (oldIds.includes(doc._id)) continue;
    const patch = changedTopLevelFields(doc);
    if (Object.keys(patch).length > 0) {
      tx.patch(doc._id, (p) => p.set(patch));
    }
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
