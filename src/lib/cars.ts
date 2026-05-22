import { sanityClient } from "@/sanity/client";
import {
  allCarSlugsQuery,
  allCarsQuery,
  carBySlugQuery,
  featuredCarsQuery,
} from "@/sanity/queries";

export type Car = {
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
  videoFile?: string;
  videoUrl?: string;
  featured?: boolean;
  status: "available" | "reserved" | "sold" | "coming-soon";
};

export async function getAllCars(): Promise<Car[]> {
  return await sanityClient.fetch<Car[]>(
    allCarsQuery,
    {},
    { next: { revalidate: 60, tags: ["car"] } },
  );
}

export async function getFeaturedCars(): Promise<Car[]> {
  return await sanityClient.fetch<Car[]>(
    featuredCarsQuery,
    {},
    { next: { revalidate: 60, tags: ["car"] } },
  );
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  return await sanityClient.fetch<Car | null>(
    carBySlugQuery,
    { slug },
    { next: { revalidate: 60, tags: ["car", `car:${slug}`] } },
  );
}

export async function getAllCarSlugs(): Promise<string[]> {
  return await sanityClient.fetch<string[]>(
    allCarSlugsQuery,
    {},
    { next: { revalidate: 60, tags: ["car"] } },
  );
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
