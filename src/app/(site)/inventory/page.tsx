import type { Metadata } from "next";
import { InventoryBrowser } from "@/components/inventory-browser";
import { getAllCars } from "@/lib/cars";

export const metadata: Metadata = {
  title: "Inventory",
  description: "Browse our current stock of performance and luxury cars.",
};

export const revalidate = 60;

export default async function InventoryPage() {
  const cars = await getAllCars();
  return <InventoryBrowser cars={cars} />;
}
