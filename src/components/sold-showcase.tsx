import Image from "next/image";
import Link from "next/link";
import { createDataAttribute } from "next-sanity";
import { ArrowRight, ArrowUpRight, ImageOff } from "lucide-react";
import { formatMileage, formatPrice, formatSoldDate, type Car } from "@/lib/cars";

type SoldPageContent = {
  eyebrow?: string | null;
  heading?: string | null;
  intro?: string | null;
  showPrices?: boolean | null;
  emptyMessage?: string | null;
  ctaHeading?: string | null;
  ctaBody?: string | null;
  ctaLabel?: string | null;
  ctaLink?: string | null;
};

// Sold cars are showcase pieces, not stock — the enquiry they should generate is
// "find me one like this", so every CTA points at sourcing rather than a viewing.
const SOURCING_HREF = "/contact?type=Bespoke+Sourcing";

function sourcingHrefFor(car: Car) {
  return `${SOURCING_HREF}&car=${encodeURIComponent(car.slug)}`;
}

export function SoldShowcase({
  cars,
  page,
}: {
  cars: Car[];
  page?: SoldPageContent | null;
}) {
  const eyebrow = page?.eyebrow ?? "Through The Door";
  const heading = page?.heading ?? "Recently Sold";
  const intro =
    page?.intro ??
    "A look at some of the cars we've bought, prepared, and sold on to happy owners. If something here is your sort of thing, we can almost certainly find you one.";
  const emptyMessage =
    page?.emptyMessage ?? "Sold cars will appear here as they leave the showroom.";
  const ctaHeading = page?.ctaHeading ?? "Looking for something similar?";
  const ctaBody =
    page?.ctaBody ??
    "Cars like these rarely sit around. Tell us what you're after and we'll use our network to track down the right car, in the right spec, at the right money.";
  const ctaLabel = page?.ctaLabel ?? "Source Me One";
  const ctaLink = page?.ctaLink ?? SOURCING_HREF;
  const showPrices = page?.showPrices === true;

  const pageAttr = (path: string) =>
    createDataAttribute({
      baseUrl: "/studio",
      id: "soldPage",
      type: "soldPage",
      path,
    }).toString();

  return (
    <>
      {/* Page header */}
      <section className="container-page pt-32 md:pt-40 pb-10">
        <div
          className="text-xs tracking-[0.3em] uppercase text-brand mb-3"
          data-sanity={pageAttr("eyebrow")}
        >
          {eyebrow}
        </div>
        <h1
          className="font-display font-bold text-5xl md:text-6xl tracking-tight mb-4"
          data-sanity={pageAttr("heading")}
        >
          {heading}
        </h1>
        <p
          className="text-text-muted text-lg max-w-2xl leading-relaxed mb-6"
          data-sanity={pageAttr("intro")}
        >
          {intro}
        </p>
        {cars.length > 0 && (
          <span className="text-sm text-text-muted">
            <span className="font-semibold text-text">{cars.length}</span>{" "}
            car{cars.length !== 1 ? "s" : ""} sold
          </span>
        )}
      </section>

      {/* Sold grid */}
      <section className="border-t border-border">
        <div className="container-page py-10 md:py-14">
          {cars.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-text-muted" data-sanity={pageAttr("emptyMessage")}>
                {emptyMessage}
              </p>
              <Link
                href="/inventory"
                className="mt-6 inline-flex items-center gap-2 text-sm tracking-wider uppercase text-brand hover:text-brand-light transition-colors"
              >
                Browse current stock <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {cars.map((car, i) => (
                <SoldCard
                  key={car.slug}
                  car={car}
                  showPrice={showPrices}
                  // The top row is above the fold, so one of these is the LCP
                  // image — let it load eagerly instead of waiting on lazy.
                  priority={i < 3}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sourcing CTA */}
      <section className="border-t border-border bg-bg-elevated">
        <div className="container-page py-20 md:py-24 max-w-2xl mx-auto text-center">
          <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">
            Bespoke Sourcing
          </div>
          <h2
            className="font-display text-3xl md:text-4xl tracking-tight mb-5"
            data-sanity={pageAttr("ctaHeading")}
          >
            {ctaHeading}
          </h2>
          <p
            className="text-text-muted leading-relaxed mb-10"
            data-sanity={pageAttr("ctaBody")}
          >
            {ctaBody}
          </p>
          <Link
            href={ctaLink}
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
            data-sanity={pageAttr("ctaLabel")}
          >
            {ctaLabel} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

function SoldCard({
  car,
  showPrice,
  priority = false,
}: {
  car: Car;
  showPrice: boolean;
  priority?: boolean;
}) {
  const carAttr = (path: string) =>
    createDataAttribute({
      baseUrl: "/studio",
      id: car._id,
      type: car._type,
      path,
    }).toString();
  const soldOn = formatSoldDate(car.soldDate);

  return (
    <article
      data-sanity={carAttr("make")}
      className="group relative bg-surface border border-border hover:border-brand transition-colors overflow-hidden"
    >
      <Link
        href={`/inventory/${car.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`${car.year} ${car.make} ${car.model} — sold`}
      />

      <div className="relative aspect-4/3 overflow-hidden bg-bg-elevated">
        {car.images[0] ? (
          <Image
            src={car.images[0]}
            alt={`${car.year} ${car.make} ${car.model}`}
            fill
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            // Sold cars sit back a step from live stock, then come to life on hover.
            className="object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-bg-elevated text-text-subtle">
            <ImageOff size={20} />
            <span className="text-[10px] uppercase tracking-widest">No photo</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 text-xs uppercase tracking-widest font-medium">
          Sold
        </div>
        {soldOn && (
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 text-[11px] uppercase tracking-wider">
            {soldOn}
          </div>
        )}
        <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-bg/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={16} className="text-text" />
        </div>
      </div>

      <div className="p-5">
        <div className="text-xs text-text-subtle tracking-widest uppercase mb-1.5">
          {car.year} · {car.bodyType}
        </div>
        <h3 className="font-display font-bold text-lg mb-0.5" data-sanity={carAttr("model")}>
          {car.make} {car.model}
        </h3>
        {car.variant && (
          <div className="text-sm text-text-muted mb-3" data-sanity={carAttr("variant")}>
            {car.variant}
          </div>
        )}
        <div className="flex items-center justify-between pt-3.5 border-t border-border">
          <div className="font-display font-bold text-lg text-text-muted">
            {showPrice ? formatPrice(car.price) : "Sold"}
          </div>
          <div className="text-xs text-text-subtle uppercase tracking-wider">
            {formatMileage(car.mileage)}
          </div>
        </div>
        <Link
          href={sourcingHrefFor(car)}
          className="relative z-20 mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-brand hover:text-brand-light transition-colors"
        >
          Find me one like this <ArrowRight size={12} />
        </Link>
      </div>
    </article>
  );
}
