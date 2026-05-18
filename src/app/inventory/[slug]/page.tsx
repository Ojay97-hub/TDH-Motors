import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Gauge, Fuel, Cog, Calendar, Check } from "lucide-react";
import { cars, getCarBySlug, formatPrice, formatMileage } from "@/lib/cars";
import { CarGallery } from "@/components/car-gallery";

export async function generateStaticParams() {
  return cars.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) return { title: "Not found" };
  return {
    title: `${car.year} ${car.make} ${car.model}${car.variant ? ` ${car.variant}` : ""}`,
    description: car.description,
  };
}

export default async function CarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) notFound();

  const specs = [
    { icon: Calendar, label: "Year", value: car.year.toString() },
    { icon: Gauge, label: "Mileage", value: formatMileage(car.mileage) },
    { icon: Cog, label: "Transmission", value: car.transmission },
    { icon: Fuel, label: "Fuel", value: car.fuel },
  ];

  return (
    <div className="grid-pattern">
      <div className="container-page pt-8">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft size={14} /> Back to Inventory
        </Link>
      </div>

      {/* Hero gallery */}
      <section className="container-page pt-8 pb-16">
        <CarGallery
          images={car.images}
          alt={`${car.year} ${car.make} ${car.model}`}
          status={car.status}
        />
      </section>

      {/* Details */}
      <section className="container-page pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2 bg-bg-elevated border border-border p-6 md:p-10">
            <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">
              {car.category}
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight mb-2">
              {car.year} {car.make} {car.model}
            </h1>
            {car.variant && (
              <div className="font-display text-2xl text-text-muted mb-8">{car.variant}</div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-border my-8">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label}>
                  <Icon size={20} className="text-brand-light mb-2" strokeWidth={1.5} />
                  <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">
                    {label}
                  </div>
                  <div className="font-medium text-text">{value}</div>
                </div>
              ))}
            </div>

            <h2 className="font-display text-2xl tracking-wide mb-4">Description</h2>
            <p className="text-text-muted leading-relaxed mb-10">{car.description}</p>

            <h2 className="font-display text-2xl tracking-wide mb-4">Specification</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {car.highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-text-muted">
                  <Check size={16} className="mt-1 text-brand-light shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8 border-t border-border">
              <div>
                <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Engine</div>
                <div className="text-text">{car.engine}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Power</div>
                <div className="text-text">{car.power}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Body</div>
                <div className="text-text">{car.bodyType}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Colour</div>
                <div className="text-text">{car.colour}</div>
              </div>
            </div>
          </div>

          {/* Sidebar — pricing & enquiry */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 bg-bg-elevated border border-border p-8">
              <div className="text-xs uppercase tracking-wider text-text-subtle mb-2">Price</div>
              <div className="font-display text-4xl tracking-tight mb-6">
                {formatPrice(car.price)}
              </div>

              <div className="space-y-3">
                <Link
                  href={`/contact?car=${car.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-6 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
                >
                  Enquire <ArrowRight size={16} />
                </Link>
                <a
                  href="tel:+441000000000"
                  className="w-full inline-flex items-center justify-center gap-2 border border-border hover:border-text text-text px-6 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
                >
                  Call To Discuss
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-border text-sm text-text-muted space-y-2">
                <div>Viewing strictly by appointment.</div>
                <div>Part-exchange welcome. Finance available.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
