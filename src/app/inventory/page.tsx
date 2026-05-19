import type { Metadata } from "next";
import { InventoryBrowser } from "@/components/inventory-browser";

export const metadata: Metadata = {
  title: "Inventory",
  description: "Browse our current stock of performance and luxury cars.",
};

export default function InventoryPage() {
  return (
    <>
      <InventoryBrowser />
    </>
  );
}
