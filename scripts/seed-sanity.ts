// One-shot migration: copies the hardcoded cars from scripts/seed-data.ts into
// Sanity. Uses a stable document _id derived from the slug.
//
// Non-destructive by default: cars that already exist are SKIPPED (so editor
// changes made in Studio are never clobbered), and images are deduplicated by
// original filename so the same bytes aren't re-uploaded on every run. Pass
// --force-replace to overwrite existing car documents from the seed data.
//
// Usage:
//   npm run seed                      # create missing cars only
//   npm run seed -- --force-replace   # overwrite existing seed cars too
//
// Requires .env entries:
//   NEXT_PUBLIC_SANITY_PROJECT_ID
//   NEXT_PUBLIC_SANITY_DATASET
//   SANITY_API_WRITE_TOKEN   (Editor permission, never commit)

import { createClient } from "@sanity/client";
import { seedCars, type SeedCar } from "./seed-data";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
const token = process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN in .env",
  );
  process.exit(1);
}

if (dataset === "production" && process.env.FORCE_PROD_MUTATION !== "true") {
  console.error(
    'Refusing to mutate Sanity dataset "production". Set FORCE_PROD_MUTATION=true to proceed.',
  );
  process.exit(1);
}

const FORCE_REPLACE = process.argv.includes("--force-replace");

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-05-20",
  token,
  useCdn: false,
});

function docIdFor(slug: string): string {
  return `car-${slug}`;
}

function imageRef(assetId: string) {
  return {
    _type: "image" as const,
    _key: assetId.slice(-12),
    asset: { _type: "reference" as const, _ref: assetId },
  };
}

async function findExistingAssetId(filename: string): Promise<string | null> {
  const asset = await client.fetch<{ _id: string } | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename] | order(_createdAt desc)[0]{ _id }`,
    { filename },
  );
  return asset?._id ?? null;
}

async function uploadImage(url: string, filename: string) {
  // Basic dedup: reuse an existing asset with the same original filename
  // instead of re-uploading identical bytes on every run.
  const existingId = await findExistingAssetId(filename);
  if (existingId) {
    process.stdout.write("(reused) ");
    return imageRef(existingId);
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, { filename });
  return imageRef(asset._id);
}

async function seedCar(car: SeedCar) {
  console.log(`\n→ ${car.slug}`);

  const _id = docIdFor(car.slug);
  const exists = await client.fetch<boolean>(`defined(*[_id == $id][0]._id)`, { id: _id });
  if (exists && !FORCE_REPLACE) {
    console.log(`  • already exists — skipping (pass --force-replace to overwrite)`);
    return;
  }

  const imageRefs = [];
  for (let i = 0; i < car.images.length; i++) {
    process.stdout.write(`  · image ${i + 1}/${car.images.length}… `);
    const filename = `${car.slug}-${i + 1}.jpg`;
    const ref = await uploadImage(car.images[i], filename);
    imageRefs.push(ref);
    console.log("ok");
  }

  const doc = {
    _id,
    _type: "car",
    make: car.make,
    model: car.model,
    variant: car.variant,
    slug: { _type: "slug", current: car.slug },
    year: car.year,
    status: car.status,
    featured: car.featured ?? false,
    price: car.price,
    mileage: car.mileage,
    transmission: car.transmission,
    fuel: car.fuel,
    bodyType: car.bodyType,
    category: car.category,
    engine: car.engine,
    power: car.power,
    colour: car.colour,
    description: car.description,
    highlights: car.highlights,
    images: imageRefs,
  };

  if (FORCE_REPLACE) {
    await client.createOrReplace(doc);
    console.log(`  ✓ replaced ${doc._id}`);
  } else {
    await client.createIfNotExists(doc);
    console.log(`  ✓ created ${doc._id}`);
  }
}

async function main() {
  console.log(
    `Seeding ${seedCars.length} cars to Sanity dataset "${dataset}"` +
      (FORCE_REPLACE ? " (--force-replace: overwriting existing docs)" : " (skipping existing docs)"),
  );
  for (const car of seedCars) {
    try {
      await seedCar(car);
    } catch (err) {
      console.error(`  ✗ failed:`, err instanceof Error ? err.message : err);
      process.exitCode = 1;
    }
  }
  console.log(`\nDone. Open http://localhost:3000/studio to verify.`);
}

main();
