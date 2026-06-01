import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, ExternalLink, ShoppingBag } from "lucide-react";

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
import { getFeaturedCars, normalizeCars } from "@/lib/cars";
import { TIKTOK_SHOP_URL } from "@/lib/merch";
import { getMerchItems, toMerchItems } from "@/lib/merch-products";
import { safeSanityFetch } from "@/sanity/client";
import { homePageQuery, siteSettingsQuery } from "@/sanity/queries";

type SocialLink = { platform?: string; label?: string; url?: string; ctaLabel?: string };

const SOCIAL_LINKS_DEFAULTS: SocialLink[] = [
  { platform: "Instagram", label: "@thedoghouse_as", url: "https://www.instagram.com/thedoghouse_as", ctaLabel: "Follow" },
  { platform: "TikTok", label: "@thedoghouseas", url: "https://www.tiktok.com/@thedoghouseas", ctaLabel: "Follow" },
  { platform: "Facebook", label: "The Dog House AS", url: "https://www.facebook.com/profile.php?id=61584858144187", ctaLabel: "Follow" },
];

function SocialPlatformIcon({ platform, size = 36 }: { platform?: string; size?: number }) {
  const key = (platform ?? "").toLowerCase();
  if (key.includes("instagram")) return <InstagramIcon size={size} />;
  if (key.includes("tiktok")) return <TikTokIcon size={size} />;
  if (key.includes("facebook")) return <FacebookIcon size={size} />;
  return <ExternalLink size={size} />;
}

const SERVICES_STRIP_DEFAULTS = [
  { title: "Curated Sales", text: "Every car hand-picked and personally inspected. We only sell cars we'd happily own ourselves." },
  { title: "Bespoke Sourcing", text: "Looking for something specific? We'll use our network to find it — any spec, any variant." },
  { title: "Part-Exchange", text: "Honest, market-aware valuations on whatever you're driving today." },
  { title: "Detailing", text: "Full machine polish, paint protection, and ceramic coating from experienced detailers." },
];

export const revalidate = 60;

export default async function Home() {
  const [fallbackFeatured, cms, settings, fallbackMerch] = await Promise.all([
    getFeaturedCars(),
    // The homepage query resolves the curated `featuredCars`/`homepageMerch`
    // references, so tag it with "car"/"merchProduct" too — editing a
    // referenced car or product then revalidates the homepage as well.
    safeSanityFetch(homePageQuery, {}, { next: { revalidate: 60, tags: ["homePage", "car", "merchProduct"] } }),
    safeSanityFetch(siteSettingsQuery, {}, { next: { revalidate: 60, tags: ["siteSettings"] } }),
    getMerchItems(),
  ]);

  // Curated homepage lists take priority; fall back to the per-car `featured`
  // flag and the full product catalogue when an editor hasn't curated a list.
  const featured = cms?.featuredCars?.length ? normalizeCars(cms.featuredCars) : fallbackFeatured;
  const merchItems = cms?.homepageMerch?.length ? toMerchItems(cms.homepageMerch) : fallbackMerch;

  const heroLine1 = cms?.heroLine1 ?? "Performance Cars,";
  const heroLine2 = cms?.heroLine2 ?? "Hand-Picked.";
  const heroSubheading = cms?.heroSubheading ?? "Sourced for enthusiasts, by enthusiasts — every car on our forecourt selected on its own merit.";
  const aboutHeading = cms?.aboutHeading ?? "A proper passion for cars.";
  const aboutPara1 = cms?.aboutPara1 ?? "The Dog House is a small, family-run dealership tucked away in the Chilterns. We started it because buying a performance car should feel as good as driving one.";
  const aboutPara2 = cms?.aboutPara2 ?? "Every car we offer has been hand-picked, personally inspected, and prepared in our own workshop. No high-pressure sales floor, no commission targets — just an honest conversation and cars we're genuinely proud of.";
  const aboutPara3 = cms?.aboutPara3 ?? "Come and see us by appointment. We'll put the kettle on.";
  const servicesStrip = cms?.servicesStrip?.length ? cms.servicesStrip : SERVICES_STRIP_DEFAULTS;
  const merchEyebrow = cms?.merchEyebrow ?? "Upcoming Merch";
  const merchHeading = cms?.merchHeading ?? "The Dog House Drop";
  const merchBody = cms?.merchBody ?? "The new TDH artwork is being turned into a small merch line across hoodies, tees, caps, and garage essentials. Coming soon.";
  const merchPrimaryCta = cms?.merchPrimaryCta ?? "Preview Merch";
  const merchSecondaryCta = cms?.merchSecondaryCta ?? "Drop Updates";
  const socialEyebrow = cms?.socialEyebrow ?? "Stay Connected";
  const socialHeading = cms?.socialHeading ?? "Check Us Out on Our Socials";
  const socialBody = cms?.socialBody ?? "Follow along for new arrivals, behind-the-scenes content, and everything cars.";
  const socialLinks: SocialLink[] = cms?.socialLinks?.length ? cms.socialLinks : SOCIAL_LINKS_DEFAULTS;
  const ctaHeading = cms?.ctaHeading ?? "By Appointment, In the Chilterns.";
  const ctaBody = cms?.ctaBody ?? "Our showroom is open by appointment, allowing us to give every visitor the time and attention they deserve. Get in touch to arrange a viewing.";
  const findUsHeading = cms?.findUsHeading ?? "Better yet, see us in person.";
  const findUsBody = cms?.findUsBody ?? "Viewing is by appointment only — give us a call or drop us a line and we'll get the kettle on.";

  // "Coming Soon" teaser card at the end of the Featured Cars row. Editable on
  // the Home Page doc; falls back to the original copy/graphic. `show` defaults
  // to true (undefined on docs created before this field existed).
  const comingSoon = cms?.comingSoonCard ?? {};
  const showComingSoon = comingSoon.show !== false;
  const comingSoonImage = comingSoon.image || "/coming-soon-tdh.png";
  const comingSoonEyebrow = comingSoon.eyebrow || "New Arrival";
  const comingSoonHeading = comingSoon.heading || "Details Coming Soon";
  const comingSoonSubtext = comingSoon.subtext || "Stay tuned for our next listing";
  const comingSoonPrice = comingSoon.priceLabel || "TBC";
  const comingSoonMileage = comingSoon.mileageLabel || "TBC";

  // For privacy/security the home page only ever shows a general area — the exact
  // yard is shared once a visitor enquires. We deliberately ignore any precise
  // mapEmbedUrl / plus code from the CMS here and build a wide, region-level map
  // centred on the general region, so the address can never be re-exposed publicly.
  const mapRegion = settings?.mapRegion ?? "The Chilterns, Buckinghamshire";
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapRegion)}&z=11&output=embed`;

  return (
    <>
      {/* Hero — pulled up behind the sticky header (matching its h-24/h-28) so the
          image fills the full viewport and the translucent header shows the image
          through it even at the top of the page, not the bare page background. */}
      <section className="relative h-screen min-h-[640px] -mt-24 lg:-mt-28 overflow-hidden bg-stone-900">
        <Image
          src="/new-hero-image.png"
          alt="The Dog House Automotive Solutions"
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover object-[65%_center] md:object-center"
        />
        {/* Even darkening so centered text stays legible across the frame — lighter in light mode */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/55" />
        {/* Bottom fade — anchored to fully-solid bg at the very bottom so it matches the next section exactly, then curves up to transparent. Kept short and light in light mode so it doesn't wash out the hero; dark mode restores the taller/denser fade that blends with the dark image. */}
        <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-bg from-12% via-bg/12 via-50% to-transparent dark:h-72 dark:from-20% dark:via-bg/35 dark:via-60%" />

        <div className="relative h-full container-page flex items-center justify-center text-center pt-24 lg:pt-28">
          <div className="max-w-3xl flex flex-col items-center">
            <div className="inline-flex items-center gap-3 mb-6 text-[10px] tracking-[0.3em] uppercase text-brand-light animate-fade-up [animation-delay:100ms] group">
              <span className="h-px bg-brand-light transition-all duration-500 w-8 group-hover:w-14" />
              Established in the Chilterns
              <span className="h-px bg-brand-light transition-all duration-500 w-8 group-hover:w-14" />
            </div>
            <h1 className="group font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] mb-6 tracking-tight text-white animate-fade-up [animation-delay:250ms]">
              <span className="inline-block transition-transform duration-500 ease-out group-hover:-translate-y-1">{heroLine1}</span>
              <br />
              <span className="inline-block text-brand-light transition-all duration-500 ease-out group-hover:text-white group-hover:[text-shadow:0_0_36px_rgba(64,145,108,0.7)] group-hover:translate-y-1">
                {heroLine2}
              </span>
            </h1>
            <p className="text-white/85 text-lg max-w-xl mb-10 leading-relaxed animate-fade-up [animation-delay:450ms]">{heroSubheading}</p>
            <div className="flex flex-col gap-3 w-full max-w-56 animate-fade-up [animation-delay:650ms]">
              <Link
                href="/inventory"
                className="group inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-7 py-4 font-medium tracking-wider uppercase text-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/30"
              >
                Browse Inventory
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 border border-white/40 hover:border-white text-white px-7 py-4 font-medium tracking-wider uppercase text-xs transition-all duration-300 bg-white/5 hover:bg-white/15 backdrop-blur-sm hover:-translate-y-0.5"
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
              {servicesStrip.map((svc: { title: string; text: string }, i: number) => (
                <div key={`${svc.title ?? "service"}-${i}`} className="border-l border-brand pl-6">
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
          {showComingSoon && (
            <div className="group block bg-bg-elevated border border-border border-dashed overflow-hidden cursor-default">
              <div className={`relative aspect-4/3 overflow-hidden bg-black ${comingSoon.image ? "" : "p-6 md:p-8"}`}>
                <Image
                  src={comingSoonImage}
                  alt={comingSoonHeading}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`transition-transform duration-700 group-hover:scale-105 ${comingSoon.image ? "object-cover" : "object-contain"}`}
                />
              </div>
              <div className="p-6">
                <div className="text-xs text-text-subtle tracking-widest uppercase mb-2">{comingSoonEyebrow}</div>
                <h3 className="font-display text-xl tracking-wide mb-1 text-text-muted">{comingSoonHeading}</h3>
                <div className="text-sm text-text-subtle mb-4">{comingSoonSubtext}</div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <div className="text-xs text-text-subtle uppercase tracking-wider">Price</div>
                    <div className="font-display text-lg text-text-muted">{comingSoonPrice}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-text-subtle uppercase tracking-wider">Mileage</div>
                    <div className="font-display text-lg text-text-muted">{comingSoonMileage}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Merch */}
      <section className="border-y border-border bg-bg-elevated">
        <div className="container-page py-24 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-end mb-12">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">{merchEyebrow}</div>
              <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-5">
                {merchHeading}
              </h2>
              <p className="text-text-muted text-lg leading-relaxed">
                {merchBody}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:justify-end gap-3">
              <Link
                href="/merch"
                className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-7 py-4 font-medium tracking-wider uppercase text-xs transition-colors"
              >
                {merchPrimaryCta} <ShoppingBag size={15} />
              </Link>
              <a
                href="https://www.tiktok.com/@thedoghouseas"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-border hover:border-brand text-text px-7 py-4 font-medium tracking-wider uppercase text-xs transition-colors"
              >
                {merchSecondaryCta} <ExternalLink size={13} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {merchItems.map((item, i) => (
              <article
                key={`${item.title ?? "merch"}-${i}`}
                className="group relative overflow-hidden border border-border bg-bg transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-xl hover:shadow-black/10"
              >
                <Link
                  href="/merch"
                  aria-label={`View ${item.title} on the merch page`}
                  className="absolute inset-0 z-10"
                />
                <div className="relative aspect-4/3 overflow-hidden bg-bg">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 md:p-7">
                  <div className="text-xs text-text-subtle tracking-widest uppercase mb-2">
                    {item.category}
                  </div>
                  <h3 className="font-display text-xl tracking-wide mb-3">{item.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    {item.detail} Coming soon.
                  </p>
                  <a
                    href={TIKTOK_SHOP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-20 mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-brand-light transition-colors hover:text-text"
                  >
                    Purchase on TikTok <ExternalLink size={12} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="border-t border-border bg-bg-elevated py-24 md:py-28">
        <div className="container-page">
          <div className="text-center mb-12">
            <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">{socialEyebrow}</div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight">{socialHeading}</h2>
            <p className="text-text-muted mt-4 max-w-md mx-auto leading-relaxed">{socialBody}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialLinks.map((link, i) => (
              <a
                key={`${link.platform ?? "social"}-${i}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-bg border border-border hover:border-brand transition-all duration-200 p-10 flex flex-col items-center text-center gap-5"
              >
                <div className="text-text-muted group-hover:text-brand-light transition-colors">
                  <SocialPlatformIcon platform={link.platform} size={36} />
                </div>
                <div>
                  <div className="font-display text-xl tracking-wide mb-1">{link.platform}</div>
                  <div className="text-text-muted text-sm">{link.label}</div>
                </div>
                <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-text-subtle group-hover:text-brand-light transition-colors">
                  {link.ctaLabel ?? "Follow"} <ExternalLink size={11} />
                </div>
              </a>
            ))}
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
            title="The Dog House — general area"
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
                <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Based in</div>
                <div className="text-text font-medium">{mapRegion}</div>
                <div className="text-text-muted text-sm">Exact address shared once you enquire.</div>
              </div>
            </div>

            <Link
              href="/contact"
              className="sm:ml-auto inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
            >
              Book a Viewing <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
