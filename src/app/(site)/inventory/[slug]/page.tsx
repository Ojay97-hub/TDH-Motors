import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Gauge, Fuel, Cog, Calendar, Check, ExternalLink } from "lucide-react";
import {
  getAllCarSlugs,
  getCarBySlug,
  formatPrice,
  formatMileage,
  formatSoldDate,
} from "@/lib/cars";
import { CarGallery } from "@/components/car-gallery";

export const revalidate = 60;

function getEmbedUrl(url: string): string | null {
  if (!url) return null;

  // YouTube
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (videoIdMatch?.[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
  }

  // TikTok
  if (url.includes("tiktok.com")) {
    const videoIdMatch = url.match(/video\/(\d+)/);
    if (videoIdMatch?.[1]) {
      return `https://www.tiktok.com/embed/v2/${videoIdMatch[1]}`;
    }
  }

  return null;
}

function getExternalVideoLabel(url: string): string {
  if (url.includes("tiktok.com")) return "Watch on TikTok";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "Watch on YouTube";
  return "Watch video";
}

export async function generateStaticParams() {
  const slugs = await getAllCarSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
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
  const car = await getCarBySlug(slug);
  if (!car) notFound();

  // A sold car keeps its page (the link may be shared, and it's part of the
  // Recently Sold showcase) but must never invite a purchase enquiry.
  const isSold = car.status === "sold";
  const soldOn = formatSoldDate(car.soldDate);

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
          href={isSold ? "/recently-sold" : "/inventory"}
          className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft size={14} /> {isSold ? "Back to Recently Sold" : "Back to Inventory"}
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

      {/* Videos */}
      {car.videos && car.videos.length > 0 && (
        <section className="container-page pb-16">
          <div className="mb-8">
            <h2 className="font-display text-2xl tracking-wide">Videos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {car.videos.map((video, idx) => {
              const embedUrl = video.videoUrl ? getEmbedUrl(video.videoUrl) : null;
              return (
                <div key={`${video.title ?? "video"}-${idx}`} className="bg-black overflow-hidden">
                  <div className="aspect-video">
                    {video.videoFile ? (
                      <video
                        src={video.videoFile}
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    ) : embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={video.title || `${car.year} ${car.make} ${car.model} video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                        sandbox="allow-same-origin allow-scripts allow-presentation"
                      />
                    ) : video.videoUrl ? (
                      <div className="flex h-full min-h-48 items-center justify-center bg-stone-900 p-6">
                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-brand-light transition-colors hover:text-brand"
                        >
                          {getExternalVideoLabel(video.videoUrl)} <ExternalLink size={14} />
                        </a>
                      </div>
                    ) : (
                      <div className="flex h-full min-h-48 items-center justify-center bg-bg-elevated p-6 text-center text-sm text-text-muted">
                        Video unavailable — add a file or supported link in Sanity.
                      </div>
                    )}
                  </div>
                  {video.title && (
                    <div className="p-4 bg-bg-elevated border-t border-border">
                      <div className="font-display text-sm tracking-wide">{video.title}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

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
              {isSold ? (
                <>
                  <div className="inline-flex items-center bg-red-600 text-white px-3 py-1 text-xs uppercase tracking-widest font-medium mb-4">
                    Sold
                  </div>
                  <div className="font-display text-3xl tracking-tight mb-2">
                    This one has gone.
                  </div>
                  <p className="text-text-muted leading-relaxed mb-6">
                    {soldOn ? `Sold in ${soldOn}. ` : ""}
                    We can source another in the spec you want — tell us what you&apos;re
                    after and we&apos;ll go looking.
                  </p>

                  <div className="space-y-3">
                    <Link
                      href={`/contact?type=Bespoke+Sourcing&car=${encodeURIComponent(car.slug)}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-6 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
                    >
                      Find Me One <ArrowRight size={16} />
                    </Link>
                    <Link
                      href="/inventory"
                      className="w-full inline-flex items-center justify-center gap-2 border border-border hover:border-text text-text px-6 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
                    >
                      Browse Current Stock
                    </Link>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border text-sm text-text-muted space-y-2">
                    <div>Sourcing is what we do best.</div>
                    <div>Part-exchange welcome. Finance available.</div>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
