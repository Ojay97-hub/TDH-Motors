import type { Metadata } from "next";
import { SoldShowcase } from "@/components/sold-showcase";
import { getSoldCars } from "@/lib/cars";
import { safeSanityFetch } from "@/sanity/client";
import { soldPageQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Recently Sold",
  description:
    "A look back at the performance and luxury cars we've had through the door and sold on.",
};

export const revalidate = 60;

export default async function RecentlySoldPage() {
  const [cars, cms] = await Promise.all([
    getSoldCars(),
    safeSanityFetch(soldPageQuery, {}, { next: { revalidate: 60, tags: ["soldPage"] } }),
  ]);

  return <SoldShowcase cars={cars} page={cms} />;
}
