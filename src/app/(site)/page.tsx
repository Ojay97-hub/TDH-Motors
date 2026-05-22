import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, ExternalLink } from "lucide-react";

function InstagramIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

function FacebookIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
import { CarCard } from "@/components/car-card";
import { ShowroomVideo } from "@/components/showroom-video";
import { getFeaturedCars } from "@/lib/cars";
import { sanityClient } from "@/sanity/client";
import { homePageQuery, siteSettingsQuery } from "@/sanity/queries";

const SERVICES_STRIP_DEFAULTS = [
  { title: "Curated Sales", text: "Every car hand-picked and personally inspected. We only sell cars we'd happily own ourselves." },
  { title: "Bespoke Sourcing", text: "Looking for something specific? We'll use our network to find it — any spec, any variant." },
  { title: "Part-Exchange", text: "Honest, market-aware valuations on whatever you're driving today." },
  { title: "Detailing", text: "Full machine polish, paint protection, and ceramic coating from experienced detailers." },
];


export default async function Home() {
  const [featured, cms, settings] = await Promise.all([
    getFeaturedCars(),
    sanityClient.fetch(homePageQuery, {}, { next: { revalidate: 60, tags: ["homePage"] } }),
    sanityClient.fetch(siteSettingsQuery, {}, { next: { revalidate: 60, tags: ["siteSettings"] } }),
  ]);

  const heroLine1 = cms?.heroLine1 ?? "Performance Cars,";
  const heroLine2 = cms?.heroLine2 ?? "Hand-Picked.";
  const heroSubheading = cms?.heroSubheading ?? "Sourced for enthusiasts, by enthusiasts — every car on our forecourt selected on its own merit.";
  const aboutHeading = cms?.aboutHeading ?? "A proper passion for cars.";
  const aboutPara1 = cms?.aboutPara1 ?? "The Dog House is a small, family-run dealership tucked away in the Chilterns. We started it because buying a performance car should feel as good as driving one.";
  const aboutPara2 = cms?.aboutPara2 ?? "Every car we offer has been hand-picked, personally inspected, and prepared in our own workshop. No high-pressure sales floor, no commission targets — just an honest conversation and cars we're genuinely proud of.";
  const aboutPara3 = cms?.aboutPara3 ?? "Come and see us by appointment. We'll put the kettle on.";
  const servicesStrip = SERVICES_STRIP_DEFAULTS;
  const ctaHeading = cms?.ctaHeading ?? "By Appointment, In the Chilterns.";
  const ctaBody = cms?.ctaBody ?? "Our showroom is open by appointment, allowing us to give every visitor the time and attention they deserve. Get in touch to arrange a viewing.";
  const findUsHeading = cms?.findUsHeading ?? "Better yet, see us in person.";
  const findUsBody = cms?.findUsBody ?? "Viewing is by appointment only — give us a call or drop us a line and we'll get the kettle on.";

  const mapEmbedUrl = settings?.mapEmbedUrl ?? "https://maps.google.com/maps?q=P5WG%2BRV+Aylesbury%2C+UK&t=&z=15&ie=UTF8&iwloc=&output=embed";
  const mapDirectionsUrl = settings?.mapDirectionsUrl ?? "https://www.google.com/maps/dir/?api=1&destination=P5WG%2BRV+Aylesbury%2C+UK";
  const mapPlusCode = settings?.mapPlusCode ?? "P5WG+RV Aylesbury";
  const mapRegion = settings?.mapRegion ?? "Buckinghamshire, UK";

  return (
    <>
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[620px] overflow-hidden bg-stone-900">
        <Image
          src="/tdh-warehouse.jpg"
          alt="TDH Motors warehouse"
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover object-[20%_center] md:object-center"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-bg to-transparent" />

        <div className="relative h-full container-page flex items-end justify-end pb-12 md:pb-16">
          <div className="max-w-md w-full bg-bg/85 backdrop-blur-sm p-8 md:p-10 border-l-4 border-brand">
            <div className="inline-flex items-center gap-2 mb-4 text-[10px] tracking-[0.3em] uppercase text-brand">
              <span className="w-8 h-px bg-brand" />
              Established in the Chilterns
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.05] mb-4 tracking-tight">
              {heroLine1}<br />
              <span className="text-brand">{heroLine2}</span>
            </h1>
            <p className="text-text-muted mb-8 leading-relaxed">{heroSubheading}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/inventory"
                className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-6 py-3 font-medium tracking-wider uppercase text-xs transition-colors"
              >
                Browse Inventory <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-text/30 hover:border-text text-text px-6 py-3 font-medium tracking-wider uppercase text-xs transition-colors"
              >
                Book a Viewing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Step Inside */}
      <section className="container-page py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-brand mb-3">Who We Are</div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight font-bold mb-6">
              {aboutHeading}
            </h2>
            <p className="text-text-muted text-lg leading-relaxed mb-5">{aboutPara1}</p>
            <p className="text-text-muted leading-relaxed mb-5">{aboutPara2}</p>
            <p className="text-text-muted leading-relaxed mb-10">{aboutPara3}</p>
            <Link
              href="/who-we-are"
              className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-text border-b border-brand hover:border-brand-light pb-1 transition-colors"
            >
              Our Story <ArrowRight size={14} />
            </Link>
          </div>
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <ShowroomVideo />
          </div>
        </div>
      </section>

      {/* Services Strip */}
      <section className="border-y border-border bg-bg-elevated">
        <div className="container-page py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">What We Do</div>
              <h2 className="font-display text-4xl md:text-5xl tracking-tight">Services</h2>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {servicesStrip.map((svc: { title: string; text: string }) => (
                <div key={svc.title} className="border-l border-brand pl-6">
                  <h3 className="font-display text-xl tracking-wide mb-2">{svc.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{svc.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-text-muted hover:text-text transition-colors"
            >
              All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Inventory */}
      <section className="container-page py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Current Stock</div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight">Featured Cars</h2>
          </div>
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-text-muted hover:text-text transition-colors"
          >
            View Full Inventory <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((car) => (
            <CarCard key={car.slug} car={car} />
          ))}
          <div className="group block bg-bg-elevated border border-border border-dashed overflow-hidden cursor-default">
            <div className="relative aspect-4/3 flex flex-col items-center justify-center bg-linear-to-br from-stone-700 to-stone-900">
              <Clock size={36} className="text-stone-400 mb-3" strokeWidth={1.5} />
              <div className="text-xs tracking-[0.3em] uppercase text-amber-400 font-medium">Coming Soon</div>
            </div>
            <div className="p-6">
              <div className="text-xs text-text-subtle tracking-widest uppercase mb-2">New Arrival</div>
              <h3 className="font-display text-xl tracking-wide mb-1 text-text-muted">Details Coming Soon</h3>
              <div className="text-sm text-text-subtle mb-4">Stay tuned for our next listing</div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <div className="text-xs text-text-subtle uppercase tracking-wider">Price</div>
                  <div className="font-display text-lg text-text-muted">TBC</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-text-subtle uppercase tracking-wider">Mileage</div>
                  <div className="font-display text-lg text-text-muted">TBC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="border-t border-border bg-bg-elevated py-24 md:py-28">
        <div className="container-page">
          <div className="text-center mb-12">
            <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Stay Connected</div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight">Check Us Out on Our Socials</h2>
            <p className="text-text-muted mt-4 max-w-md mx-auto leading-relaxed">Follow along for new arrivals, behind-the-scenes content, and everything cars.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="https://www.instagram.com/thedoghouse_as"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-bg border border-border hover:border-brand transition-all duration-200 p-10 flex flex-col items-center text-center gap-5"
            >
              <div className="text-text-muted group-hover:text-brand-light transition-colors">
                <InstagramIcon size={36} />
              </div>
              <div>
                <div className="font-display text-xl tracking-wide mb-1">Instagram</div>
                <div className="text-text-muted text-sm">@thedoghouse_as</div>
              </div>
              <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-text-subtle group-hover:text-brand-light transition-colors">
                Follow <ExternalLink size={11} />
              </div>
            </a>
            <a
              href="https://www.tiktok.com/@thedoghouseas"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-bg border border-border hover:border-brand transition-all duration-200 p-10 flex flex-col items-center text-center gap-5"
            >
              <div className="text-text-muted group-hover:text-brand-light transition-colors">
                <TikTokIcon size={36} />
              </div>
              <div>
                <div className="font-display text-xl tracking-wide mb-1">TikTok</div>
                <div className="text-text-muted text-sm">@thedoghouseas</div>
              </div>
              <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-text-subtle group-hover:text-brand-light transition-colors">
                Follow <ExternalLink size={11} />
              </div>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61584858144187"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-bg border border-border hover:border-brand transition-all duration-200 p-10 flex flex-col items-center text-center gap-5"
            >
              <div className="text-text-muted group-hover:text-brand-light transition-colors">
                <FacebookIcon size={36} />
              </div>
              <div>
                <div className="font-display text-xl tracking-wide mb-1">Facebook</div>
                <div className="text-text-muted text-sm">The Dog House AS</div>
              </div>
              <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-text-subtle group-hover:text-brand-light transition-colors">
                Follow <ExternalLink size={11} />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bg border-y border-border py-24 md:py-32 text-center">
        <div className="container-page max-w-2xl mx-auto">
          <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Visit Us</div>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-6">{ctaHeading}</h2>
          <p className="text-text-muted text-lg leading-relaxed mb-10">{ctaBody}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
          >
            Book a Viewing <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Find Us */}
      <section className="border-t border-border bg-bg-elevated">
        <div className="relative h-[480px] md:h-[680px] bg-bg overflow-hidden">
          <iframe
            src={mapEmbedUrl}
            title="The Dog House — showroom location"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>

        <div className="container-page pt-16 md:pt-20 pb-20 md:pb-24">
          <div className="max-w-2xl mb-10">
            <div className="text-xs tracking-[0.3em] uppercase text-brand mb-3">Find Us</div>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight font-bold mb-3">
              {findUsHeading}
            </h2>
            <p className="text-text-muted leading-relaxed">{findUsBody}</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
            <div className="flex gap-3">
              <MapPin className="text-brand-light shrink-0 mt-1" size={22} strokeWidth={1.5} />
              <div>
                <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Showroom</div>
                <div className="text-text font-medium">{mapPlusCode}</div>
                <div className="text-text-muted text-sm">{mapRegion}</div>
              </div>
            </div>

            <a
              href={mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:ml-auto inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
            >
              Get Directions <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
