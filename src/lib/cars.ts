import { safeSanityFetch } from "@/sanity/client";
import { sanityClient } from "@/sanity/base-client";
import {
  allCarSlugsQuery,
  allCarsQuery,
  carBySlugQuery,
  featuredCarsQuery,
} from "@/sanity/queries";

export type Video = {
  title?: string | null;
  videoFile?: string;
  videoUrl?: string;
};

type CarRaw = {
  slug: string;
  make: string;
  model: string;
  variant?: string;
  year: number;
  price: number;
  mileage: number;
  transmission: "Manual" | "Automatic" | "PDK" | "DCT";
  fuel: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  bodyType: "Coupe" | "Convertible" | "Saloon" | "Estate" | "SUV" | "Hatchback";
  category: "luxury" | "sports" | "performance" | "electric" | "classic";
  engine: string;
  power: string;
  colour: string;
  description: string;
  highlights: string[];
  images: string[];
  videos?: Video[];
  legacyVideoFile?: string;
  legacyVideoUrl?: string;
  featured?: boolean;
  status: "available" | "reserved" | "sold" | "coming-soon";
};

export type Car = Omit<CarRaw, "legacyVideoFile" | "legacyVideoUrl"> & {
  videos?: Video[];
};

function normalizeCarVideos(car: CarRaw): Car {
  const videos = [...(car.videos || [])];

  // Only include legacy video if there are no new videos yet
  if ((videos.length === 0) && (car.legacyVideoFile || car.legacyVideoUrl)) {
    videos.push({
      title: null,
      videoFile: car.legacyVideoFile,
      videoUrl: car.legacyVideoUrl,
    });
  }

  return {
    ...car,
    videos: videos.length > 0 ? videos : undefined,
  };
}

/**
 * Normalizes a list of raw cars (e.g. the homepage's curated `featuredCars`
 * references resolved by `homePageQuery`) into the public `Car` shape, applying
 * the same legacy-video handling as every other car loader.
 */
export function normalizeCars(
  cars: Array<CarRaw | null | undefined> | null | undefined,
): Car[] {
  // Resolved references can be null (target missing/unpublished); drop them.
  return (cars ?? [])
    .filter((c): c is CarRaw => Boolean(c))
    .map(normalizeCarVideos);
}

export async function getAllCars(): Promise<Car[]> {
  const cars = await safeSanityFetch<CarRaw[]>(
    allCarsQuery,
    {},
    { next: { revalidate: 60, tags: ["car"] } },
    [],
  );
  return (cars ?? []).map(normalizeCarVideos);
}

export async function getFeaturedCars(): Promise<Car[]> {
  const cars = await safeSanityFetch<CarRaw[]>(
    featuredCarsQuery,
    {},
    { next: { revalidate: 60, tags: ["car"] } },
    [],
  );
  return (cars ?? []).map(normalizeCarVideos);
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  const car = await safeSanityFetch<CarRaw | null>(
    carBySlugQuery,
    { slug },
    { next: { revalidate: 60, tags: ["car", `car:${slug}`] } },
  );
  return car ? normalizeCarVideos(car) : null;
}

export async function getAllCarSlugs(): Promise<string[]> {
  try {
    return await sanityClient.fetch<string[]>(allCarSlugsQuery);
  } catch (err) {
    console.error(
      "[sanity] slug fetch failed during static param generation:",
      err instanceof Error ? err.message : err,
    );
    return [];
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatMileage(miles: number): string {
  return new Intl.NumberFormat("en-GB").format(miles) + " mi";
}
