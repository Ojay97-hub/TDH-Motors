// One-shot migration: copies the 7 hardcoded cars from scripts/seed-data.ts
// into Sanity. Idempotent — uses a stable document _id derived from the slug,
// so running twice updates instead of duplicating.
//
// Usage:  npm run seed
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

const forceProduction =
  process.env.FORCE_PROD_MUTATION === "true" ||
  process.argv.includes("--confirm-production");

if (dataset === "production" && !forceProduction) {
  console.error(
    'Refusing to mutate Sanity dataset "production". Set FORCE_PROD_MUTATION=true or pass --confirm-production to proceed.',
  );
  process.exit(1);
}

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

async function uploadImage(url: string, filename: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, { filename });
  return {
    _type: "image" as const,
    _key: asset._id.slice(-12),
    asset: { _type: "reference" as const, _ref: asset._id },
  };
}

async function seedCar(car: SeedCar) {
  console.log(`\n→ ${car.slug}`);

  const imageRefs = [];
  for (let i = 0; i < car.images.length; i++) {
    process.stdout.write(`  · uploading image ${i + 1}/${car.images.length}… `);
    const filename = `${car.slug}-${i + 1}.jpg`;
    const ref = await uploadImage(car.images[i], filename);
    imageRefs.push(ref);
    console.log("ok");
  }

  const doc = {
    _id: docIdFor(car.slug),
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

  await client.createOrReplace(doc);
  console.log(`  ✓ saved as ${doc._id}`);
}

async function main() {
  console.log(`Seeding ${seedCars.length} cars to Sanity dataset "${dataset}"`);
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
