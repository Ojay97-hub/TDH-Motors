import type { Metadata } from "next";
import { InventoryBrowser } from "@/components/inventory-browser";

export const metadata: Metadata = {
  title: "Inventory",
  description: "Browse our current stock of performance and luxury cars.",
};

export default function InventoryPage() {
  return (
    <>
      <section className="container-page pt-16 md:pt-24 pb-10">
        <div className="text-xs tracking-[0.3em] uppercase text-brand mb-3">Current Stock</div>
        <h1 className="font-display font-bold text-5xl md:text-6xl tracking-tight mb-4">Our Inventory</h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
          Every car listed below is in our care and available for viewing by appointment.
          Don't see what you're after? We can source it.
        </p>
      </section>

      <InventoryBrowser />
    </>
  );
}
