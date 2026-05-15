import type { Metadata } from "next";
import { CarCard } from "@/components/car-card";
import { cars } from "@/lib/cars";

export const metadata: Metadata = {
  title: "Inventory",
  description: "Browse our current stock of performance and luxury cars.",
};

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const categories = [
    { key: "all", label: "All" },
    { key: "sports", label: "Sports" },
    { key: "performance", label: "Performance" },
    { key: "luxury", label: "Luxury" },
    { key: "electric", label: "Electric" },
    { key: "classic", label: "Classic" },
  ] as const;

  const filtered = category && category !== "all"
    ? cars.filter((c) => c.category === category)
    : cars;

  return (
    <>
      <section className="container-page pt-16 md:pt-24 pb-12">
        <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Current Stock</div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">Our Inventory</h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
          Every car listed below is in our care and available for viewing by appointment.
          Don't see what you're after? We can source it.
        </p>
      </section>

      <section className="container-page pb-24">
        <div className="flex flex-wrap gap-3 mb-10 pb-8 border-b border-border">
          {categories.map((cat) => {
            const active = (category ?? "all") === cat.key;
            return (
              <a
                key={cat.key}
                href={cat.key === "all" ? "/inventory" : `/inventory?category=${cat.key}`}
                className={`px-5 py-2 text-sm tracking-wider uppercase border transition-colors ${
                  active
                    ? "bg-brand border-brand text-text"
                    : "border-border text-text-muted hover:border-text hover:text-text"
                }`}
              >
                {cat.label}
              </a>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-text-muted">No cars in this category right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((car) => (
              <CarCard key={car.slug} car={car} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
