import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Wrench, Droplets, CheckCircle, ExternalLink } from "lucide-react";
import { BeforeAfterGallery } from "@/components/before-after-gallery";
import { safeSanityFetch } from "@/sanity/client";
import { detailingPageQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Detailing | TDH Motors",
  description: "Professional car detailing — protection, correction, enhancement, and valeting services.",
};

const SERVICE_ICONS = [Shield, Wrench, Sparkles, Droplets];

const SERVICES = [
  {
    icon: Shield,
    title: "New Car Protection",
    tag: "Protection Detailing",
    tagline: "Ceramic coating for lasting defence.",
    description:
      "Using Gtechniq nano ceramic coatings, we create a durable, slick surface that resists dirt, tar, tree sap, and bird droppings. The coating bonds at a nano level, providing multi-year protection with superior water-beading and an unrivalled finish.",
    bullets: [
      "Unrivalled reflection — gloss, depth and clarity",
      "Hydrophobic/water-dirt repelling properties",
      "Easy clean and self-cleaning properties",
      "Weather protection",
      "Anti-micro scratch properties",
      "Temperature resistant: -40°F to 250°F",
    ],
    price: "From £200",
    includes: [
      "Multi-stage decontamination wash",
      "Snow foam, clay bar, Iron X and Tardis treatment",
      "Single-stage machine polish",
      "Gtechniq Crystal Serum Light, Exo and Wheel Armour",
      "Glass coating and trim restorer",
      "Interior: Matt Dash, i Leather, i Fabric",
    ],
  },
  {
    icon: Wrench,
    title: "Swirl Correction",
    tag: "Correction Detailing",
    tagline: "Machine polishing to restore flawless paintwork.",
    description:
      "Machine polishing eliminates unsightly swirl marks and fine scratches from your paintwork — the kind that catch in sunlight and dull an otherwise perfect finish. It's not uncommon for cars straight from the dealership to carry swirling already. We correct it.",
    bullets: [
      "Removes swirl marks, fine scratches and holograms",
      "1–5 stage machine polishing depending on condition",
      "Addresses damage from improper washing, bird mess and tree sap",
      "Restores true gloss and depth to paintwork",
      "Optional ceramic coating package available",
    ],
    price: "From £250",
    includes: [
      "Multi-stage decontamination wash",
      "Wheel clean with Iron X, Tardis and citrus",
      "Arch and panel gap decontamination",
      "Clay bar treatment",
      "1–5 stage machine polish",
      "Panel wipe to remove all oils and waxes",
    ],
  },
  {
    icon: Sparkles,
    title: "Gloss Enhancement",
    tag: "Enhancement Detailing",
    tagline: "Maximise gloss, depth and reflection.",
    description:
      "Focused on elevating your car's visual impact — increasing gloss, depth and reflection while removing light surface marks. Ideal as a standalone treatment or as part of a regular annual maintenance schedule.",
    bullets: [
      "Removes light scratches and swirl marks",
      "Maximises gloss, depth and reflection",
      "Gtechniq C2 Liquid Crystal finishing spray applied",
      "Available as standalone or annual maintenance",
      "Perfect for cars in good condition needing a refresh",
    ],
    price: "From £200",
    includes: [
      "Multi-stage wash with polymer removal",
      "Wheel clean with Iron X and Tardis",
      "Snow foam and two-bucket wash method",
      "Clay bar treatment",
      "Single-stage machine polish",
      "Gtechniq C2 Liquid Crystal Detailing Spray",
    ],
  },
  {
    icon: Droplets,
    title: "Maintenance Valeting",
    tag: "Valeting",
    tagline: "Regular care that protects your investment.",
    description:
      "Monthly to six-weekly valet services using pH-neutral shampoos and scratch-avoiding techniques designed to preserve your paintwork and any ceramic coatings. Professional, sympathetic care without the risk of inflicting micro-scratches.",
    bullets: [
      "pH-neutral shampoos safe for ceramic coatings",
      "Scratch-avoiding two-bucket wash method",
      "Ideal for busy owners who want regular professional upkeep",
      "Maintains the integrity and appearance of ceramic coatings",
      "Scheduled to suit your routine",
    ],
    price: "From £200",
    includes: [
      "Exterior rinse and snow foam pre-wash",
      "Two-bucket wash with lamb's wool mitt",
      "Wheel and arch clean",
      "Contactless dry and detail spray",
      "Window clean",
      "Interior wipe-down and vacuum (on request)",
    ],
  },
];

function getEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

function getExternalLabel(url: string): string {
  if (url.includes("tiktok.com")) return "Watch on TikTok";
  if (url.includes("instagram.com")) return "Watch on Instagram";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "Watch on YouTube";
  if (url.includes("vimeo.com")) return "Watch on Vimeo";
  return "Watch Video";
}

export default async function DetailingPage() {
  type BeforeAfterItem = { label: string; serviceTag?: string; beforeImage?: string; beforeVideo?: string; afterImage?: string; afterVideo?: string };
  type GalleryItem = { image: string; caption?: string; serviceTag?: string };
  type VideoItem = { title: string; caption?: string; orientation?: string; videoFile?: string; videoUrl?: string };
  type ServiceItem = {
    title: string;
    tag?: string;
    tagline?: string;
    description?: string;
    price?: string;
    bullets?: string[];
    includes?: string[];
    icon?: typeof Shield;
  };

  const cms = await safeSanityFetch<{
    eyebrow?: string;
    heading?: string;
    intro?: string;
    pricingBody?: string;
    services?: ServiceItem[];
    partnerNote?: string;
    ctaHeading?: string;
    ctaBody?: string;
    ctaLabel?: string;
    beforeAfterGallery?: BeforeAfterItem[];
    gallery?: GalleryItem[];
    videos?: VideoItem[];
  }>(
    detailingPageQuery,
    {},
    { next: { revalidate: 60, tags: ["detailingPage"] } },
  );

  const eyebrow = cms?.eyebrow ?? "Service";
  const heading = cms?.heading ?? "Detailing";
  const intro = cms?.intro;
  const pricingBody = cms?.pricingBody;
  const services: ServiceItem[] = cms?.services?.length ? cms.services : SERVICES;
  const partnerNote = cms?.partnerNote;
  const ctaHeading = cms?.ctaHeading ?? "Book Your Detail";
  const ctaBody = cms?.ctaBody ?? "Every job is assessed individually. Get in touch to discuss your car's needs and we'll recommend the right service for you.";
  const ctaLabel = cms?.ctaLabel ?? "Get In Touch";
  const beforeAfterGallery: BeforeAfterItem[] = cms?.beforeAfterGallery ?? [];
  const gallery: GalleryItem[] = cms?.gallery ?? [];
  const videos: VideoItem[] = cms?.videos ?? [];

  return (
    <>
      <section className="container-page pt-32 md:pt-40 pb-12">
        <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">{eyebrow}</div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">{heading}</h1>
        {intro ? (
          <p className="text-text-muted text-lg max-w-2xl leading-relaxed">{intro}</p>
        ) : (
          <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
            From ceramic coating protection to full paintwork correction, our professional detailing team —{" "}
            <span className="text-brand font-medium">TDH Detailing</span> in partnership with{" "}
            <a
              href="https://www.ttautodetailing.co.uk/detailing-and-protection"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:text-brand-light transition-colors font-medium"
            >
              TT Auto detailers
            </a>{" "}
            — delivers showroom results that last. Every service uses industry-leading Gtechniq products and meticulous preparation.
          </p>
        )}
        {pricingBody ? (
          <p className="text-text-muted max-w-2xl leading-relaxed mt-4">{pricingBody}</p>
        ) : (
          <p className="text-text-muted max-w-2xl leading-relaxed mt-4">
            Prices start from <span className="text-text font-medium">£200</span>. Every car is different, so final
            costing is assessed case by case —{" "}
            <Link href="/contact" className="text-brand hover:text-brand-light transition-colors font-medium">
              get in touch
            </Link>{" "}
            for a tailored quote.
          </p>
        )}
      </section>

      <section className="container-page pb-24 space-y-16">
        {services.map((svc, i) => {
          const Icon = svc.icon ?? SERVICE_ICONS[i] ?? Sparkles;
          const isEven = i % 2 === 0;
          return (
            <div
              key={svc.title}
              className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border"
            >
              <div className={`p-8 md:p-12 bg-bg-elevated ${!isEven ? "lg:order-2" : ""}`}>
                <div className="flex items-center gap-3 mb-2">
                  <Icon size={24} className="text-brand-light" strokeWidth={1.5} />
                  <div className="text-xs tracking-[0.3em] uppercase text-brand-light">{svc.tag}</div>
                </div>
                <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-2">{svc.title}</h2>
                {"price" in svc && svc.price && (
                  <div className="inline-block bg-brand text-on-brand text-sm font-medium tracking-wider uppercase px-3 py-1 mb-4">
                    {svc.price}
                  </div>
                )}
                {svc.tagline && <p className="text-text-muted leading-relaxed mb-6 italic text-sm">{svc.tagline}</p>}
                {svc.description && <p className="text-text-muted leading-relaxed mb-8">{svc.description}</p>}
                <ul className="space-y-2">
                  {(svc.bullets ?? []).map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-text-muted">
                      <CheckCircle size={15} className="text-brand-light shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`p-8 md:p-12 bg-bg border-t lg:border-t-0 border-border ${!isEven ? "lg:order-1 lg:border-r border-border" : "lg:border-l border-border"}`}>
                <h3 className="font-display text-xl tracking-wide mb-6 text-text">What&apos;s Included</h3>
                <ul className="space-y-3">
                  {(svc.includes ?? []).map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-text-muted">
                      <span className="text-brand-light shrink-0 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </section>

      {/* Before & After Gallery */}
      {beforeAfterGallery.length > 0 && (
        <section className="border-t border-border py-24 md:py-28">
          <div className="container-page">
            <div className="mb-12">
              <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Results</div>
              <h2 className="font-display text-4xl md:text-5xl tracking-tight">Before &amp; After</h2>
              <p className="text-text-muted mt-4 max-w-lg leading-relaxed">
                Drag the handle left and right to compare.
              </p>
            </div>
            <BeforeAfterGallery items={beforeAfterGallery} />
          </div>
        </section>
      )}

      {/* Photo Gallery — single completed-job photos */}
      {gallery.length > 0 && (
        <section className="border-t border-border py-24 md:py-28">
          <div className="container-page">
            <div className="mb-12">
              <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Recent Work</div>
              <h2 className="font-display text-4xl md:text-5xl tracking-tight">The Gallery</h2>
              <p className="text-text-muted mt-4 max-w-lg leading-relaxed">
                A selection of recently completed details.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gallery.map((item, i) => (
                <figure key={i} className="group overflow-hidden border border-border bg-bg-elevated">
                  <div className="relative aspect-4/3 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.caption || "Completed detailing job"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {(item.caption || item.serviceTag) && (
                    <figcaption className="p-5">
                      {item.serviceTag && (
                        <div className="text-[10px] tracking-[0.25em] uppercase text-brand-light mb-1">
                          {item.serviceTag}
                        </div>
                      )}
                      {item.caption && (
                        <div className="font-display text-lg tracking-wide">{item.caption}</div>
                      )}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <section className="border-t border-border bg-bg-elevated py-24 md:py-28">
          <div className="container-page">
            <div className="mb-12">
              <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Showcase</div>
              <h2 className="font-display text-4xl md:text-5xl tracking-tight">Watch the Work</h2>
              <a
                href="https://www.tiktok.com/@thedoghouseas"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-text-muted hover:text-text transition-colors mt-4"
              >
                View Our Videos Here Too <ExternalLink size={14} />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((v) => {
                const embedUrl = v.videoUrl ? getEmbedUrl(v.videoUrl) : null;
                const isPortrait = v.orientation === "portrait";
                return (
                  <div key={v.title} className={`bg-bg border border-border overflow-hidden ${isPortrait ? "md:col-span-1 max-w-md" : ""}`}>
                    {v.videoFile ? (
                      <video
                        src={v.videoFile}
                        controls
                        playsInline
                        className={`w-full object-cover ${isPortrait ? "aspect-9/16" : "aspect-video"}`}
                      />
                    ) : embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className={`w-full border-0 ${isPortrait ? "aspect-9/16" : "aspect-video"}`}
                      />
                    ) : v.videoUrl ? (
                      <div className="aspect-video flex items-center justify-center bg-stone-900">
                        <a
                          href={v.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-brand-light hover:text-brand transition-colors"
                        >
                          {getExternalLabel(v.videoUrl)} <ExternalLink size={14} />
                        </a>
                      </div>
                    ) : null}
                    <div className="p-5">
                      <div className="font-display text-lg tracking-wide mb-1">{v.title}</div>
                      {v.caption && (
                        <p className="text-text-muted text-sm leading-relaxed">{v.caption}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-border bg-bg py-16 md:py-20">
        <div className="container-page">
          {partnerNote ? (
            <p className="text-text-muted text-center">{partnerNote}</p>
          ) : (
            <p className="text-text-muted text-center">
              Our detailing work is carried out by{" "}
              <span className="text-brand font-medium">TDH Detailing</span> in partnership with{" "}
              <a
                href="https://www.ttautodetailing.co.uk/detailing-and-protection"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:text-brand-light transition-colors font-medium inline-flex items-center gap-1"
              >
                TT Auto detailers <ExternalLink size={12} />
              </a>
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-border bg-bg-elevated">
        <div className="container-page py-24 text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">{ctaHeading}</h2>
          <p className="text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            {ctaBody}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
          >
            {ctaLabel} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
