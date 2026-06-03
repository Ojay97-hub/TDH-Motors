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
  _id?: string | null;
  _type?: string | null;
  slug?: string | null;
  make?: string | null;
  model?: string | null;
  variant?: string | null;
  year?: number | null;
  price?: number | null;
  mileage?: number | null;
  transmission?: string | null;
  fuel?: string | null;
  bodyType?: string | null;
  category?: string | null;
  engine?: string | null;
  power?: string | null;
  colour?: string | null;
  description?: string | null;
  highlights?: Array<string | null | undefined> | null;
  images?: Array<string | null | undefined> | null;
  videos?: Array<Video | null | undefined> | null;
  legacyVideoFile?: string | null;
  legacyVideoUrl?: string | null;
  featured?: boolean | null;
  status?: string | null;
};

const transmissions = ["Manual", "Automatic", "PDK", "DCT"] as const;
const fuels = ["Petrol", "Diesel", "Electric", "Hybrid"] as const;
const bodyTypes = ["Coupe", "Convertible", "Saloon", "Estate", "SUV", "Hatchback"] as const;
const categories = ["luxury", "sports", "performance", "electric", "classic"] as const;
const statuses = ["available", "reserved", "sold", "coming-soon"] as const;

export type Car = {
  _id: string;
  _type: "car";
  slug: string;
  make: string;
  model: string;
  variant?: string;
  year: number;
  price: number;
  mileage: number;
  transmission: (typeof transmissions)[number];
  fuel: (typeof fuels)[number];
  bodyType: (typeof bodyTypes)[number];
  category: (typeof categories)[number];
  engine: string;
  power: string;
  colour: string;
  description: string;
  highlights: string[];
  images: string[];
  videos?: Video[];
  featured?: boolean;
  status: (typeof statuses)[number];
};

function stringOr(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function optionalString(value: unknown): string | undefined {
  const normalized = stringOr(value);
  return normalized || undefined;
}

function numberOr(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function stringArrayOrEmpty(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => stringOr(item))
    .filter((item) => item.length > 0);
}

function oneOf<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
  fallback: T[number],
): T[number] {
  return typeof value === "string" && allowed.includes(value) ? value : fallback;
}

function normalizeVideos(car: CarRaw): Video[] {
  const videos = Array.isArray(car.videos)
    ? car.videos
        .filter((video): video is Video => Boolean(video))
        .map((video) => ({
          title: stringOr(video.title) || null,
          videoFile: optionalString(video.videoFile),
          videoUrl: optionalString(video.videoUrl),
        }))
        .filter((video) => video.videoFile || video.videoUrl)
    : [];

  // Only include legacy video if there are no new videos yet.
  if (videos.length === 0 && (optionalString(car.legacyVideoFile) || optionalString(car.legacyVideoUrl))) {
    videos.push({
      title: null,
      videoFile: optionalString(car.legacyVideoFile),
      videoUrl: optionalString(car.legacyVideoUrl),
    });
  }

  return videos;
}

function normalizeCar(car: CarRaw): Car {
  const videos = normalizeVideos(car);
  const fallbackId = stringOr(car._id, "unknown-car");

  return {
    _id: fallbackId,
    _type: "car",
    slug: stringOr(car.slug, fallbackId),
    make: stringOr(car.make, "Unknown"),
    model: stringOr(car.model, "Vehicle"),
    variant: optionalString(car.variant),
    year: numberOr(car.year),
    price: numberOr(car.price),
    mileage: numberOr(car.mileage),
    transmission: oneOf(car.transmission, transmissions, "Automatic"),
    fuel: oneOf(car.fuel, fuels, "Petrol"),
    bodyType: oneOf(car.bodyType, bodyTypes, "Coupe"),
    category: oneOf(car.category, categories, "performance"),
    engine: stringOr(car.engine, "Not specified"),
    power: stringOr(car.power, "Not specified"),
    colour: stringOr(car.colour, "Not specified"),
    description: stringOr(car.description, "Details coming soon."),
    highlights: stringArrayOrEmpty(car.highlights),
    images: stringArrayOrEmpty(car.images),
    videos: videos.length > 0 ? videos : undefined,
    featured: car.featured === true,
    status: oneOf(car.status, statuses, "available"),
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
    .map(normalizeCar);
}

export async function getAllCars(): Promise<Car[]> {
  const cars = await safeSanityFetch<CarRaw[]>(
    allCarsQuery,
    {},
    { next: { revalidate: 60, tags: ["car"] } },
    [],
  );
  return (cars ?? []).map(normalizeCar);
}

export async function getFeaturedCars(): Promise<Car[]> {
  const cars = await safeSanityFetch<CarRaw[]>(
    featuredCarsQuery,
    {},
    { next: { revalidate: 60, tags: ["car"] } },
    [],
  );
  return (cars ?? []).map(normalizeCar);
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  const car = await safeSanityFetch<CarRaw | null>(
    carBySlugQuery,
    { slug },
    { next: { revalidate: 60, tags: ["car", `car:${slug}`] } },
  );
  return car ? normalizeCar(car) : null;
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
