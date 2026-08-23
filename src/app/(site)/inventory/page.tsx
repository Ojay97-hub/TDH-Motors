import type { Metadata } from "next";
import { InventoryBrowser } from "@/components/inventory-browser";
import { getAvailableCars } from "@/lib/cars";
import { safeSanityFetch } from "@/sanity/client";
import { inventoryPageQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Inventory",
  description: "Browse our current stock of performance and luxury cars.",
};

export const revalidate = 60;

export default async function InventoryPage() {
  // Sold cars are deliberately excluded — they move to /recently-sold.
  const [cars, cms] = await Promise.all([
    getAvailableCars(),
    safeSanityFetch(inventoryPageQuery, {}, { next: { revalidate: 60, tags: ["inventoryPage"] } }),
  ]);

  return <InventoryBrowser cars={cars} page={cms} />;
}
