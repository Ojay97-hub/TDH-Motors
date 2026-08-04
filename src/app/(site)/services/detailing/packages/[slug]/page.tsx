import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock, Tag } from "lucide-react";
import { CtaLink } from "@/components/cta-link";
import {
  DEFAULT_DETAILING_PACKAGES,
  findPackageBySlug,
  packageContactHref,
  packageSlug,
  type DetailingPackage,
} from "@/lib/detailing-packages";
import { safeSanityFetch, sanityClient } from "@/sanity/client";
import { detailingPackageBySlugQuery, detailingPackageSlugsQuery } from "@/sanity/queries";

type CmsResult = {
  package?: DetailingPackage | null;
  ctaHeading?: string;
  ctaBody?: string;
  ctaLabel?: string;
  ctaLink?: string;
  partnerNote?: string;
};

/**
 * Resolves a package from the CMS, falling back to the built-in defaults so the
 * "Read More" links on the detailing page still work before an editor has
 * populated the Packages tab in Sanity.
 */
async function getPackage(slug: string): Promise<{ pkg: DetailingPackage; cms: CmsResult | null } | null> {
  const cms = await safeSanityFetch<CmsResult>(
    detailingPackageBySlugQuery,
    { slug },
    { next: { revalidate: 60, tags: ["detailingPage"] } },
  );

  if (cms?.package?.name) {
    return { pkg: cms.package, cms };
  }

  const fallback = findPackageBySlug(DEFAULT_DETAILING_PACKAGES, slug);
  return fallback ? { pkg: fallback, cms } : null;
}

export async function generateStaticParams() {
  // Deliberately NOT `safeSanityFetch` — that goes through the Live Content API,
  // which reads `draftMode()`. `generateStaticParams` runs at build time with no
  // request behind it, so that throws and we'd silently prerender the built-in
  // tiers only. The plain client has no such dependency.
  let fromCms: string[] = [];
  try {
    const slugs = await sanityClient.fetch<string[]>(detailingPackageSlugsQuery);
    fromCms = (slugs ?? []).filter(Boolean);
  } catch (err) {
    // A CMS outage at build time shouldn't fail the build — the defaults below
    // still get prerendered and any CMS-only slug renders on demand.
    console.error(
      "[detailing] could not load package slugs for prerender:",
      err instanceof Error ? err.message : err,
    );
  }

  const fromDefaults = DEFAULT_DETAILING_PACKAGES.map((pkg, i) => packageSlug(pkg, i));

  return Array.from(new Set([...fromCms, ...fromDefaults])).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPackage(slug);

  if (!result) {
    return { title: "Package Not Found | TDH Motors" };
  }

  const { pkg } = result;
  return {
    title: `${pkg.name} Package | TDH Detailing`,
    description: pkg.tagline ?? pkg.longDescription?.slice(0, 155),
  };
}

export default async function DetailingPackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getPackage(slug);

  if (!result) notFound();

  const { pkg, cms } = result;
  const ctaHeading = cms?.ctaHeading ?? `Book the ${pkg.name} Package`;
  const ctaBody =
    cms?.ctaBody ??
    "Every car is assessed individually before we commit to a price. Send us a few photos and we'll confirm the cost and how long we'll need it for.";
  const ctaLabel = pkg.ctaLabel ?? cms?.ctaLabel ?? "Get In Touch";
  // Keeps the existing pkg → page → default precedence, but tags the contact
  // link with this tier so the enquiry form knows which package was clicked.
  // The route slug backfills `pkg.slug` for a CMS tier saved without one.
  const ctaLink = packageContactHref(
    { ...pkg, slug: pkg.slug ?? slug },
    0,
    cms?.ctaLink ?? "/contact",
  );
  const detailSections = pkg.detailSections ?? [];
  const includes = pkg.includes ?? [];

  return (
    <>
      <section className="container-page pt-32 md:pt-40 pb-12">
        <Link
          href="/services/detailing#packages"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-text-muted hover:text-brand-light transition-colors mb-8"
        >
          <ArrowLeft size={14} /> All Packages
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            {pkg.tier && (
              <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">{pkg.tier}</div>
            )}
            <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-4">{pkg.name}</h1>
            {pkg.tagline && (
              <p className="text-text-muted text-lg leading-relaxed mb-8">{pkg.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-border py-6">
              <div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-text-subtle mb-1.5">Price</div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl tracking-tight">{pkg.price}</span>
                  {pkg.priceNote && <span className="text-text-subtle text-xs">{pkg.priceNote}</span>}
                </div>
              </div>
              {pkg.duration && (
                <div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-text-subtle mb-1.5">Duration</div>
                  <div className="flex items-center gap-2 text-text">
                    <Clock size={16} className="text-brand-light shrink-0" />
                    <span className="font-display text-lg tracking-wide">{pkg.duration}</span>
                  </div>
                </div>
              )}
            </div>

            <CtaLink
              href={ctaLink}
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors mt-8"
            >
              {ctaLabel} <ArrowRight size={16} />
            </CtaLink>
          </div>

          {pkg.image && (
            <div className="relative aspect-4/3 w-full overflow-hidden border border-border bg-bg-elevated">
              <Image
                src={pkg.image}
                alt={`${pkg.name} package`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {pkg.longDescription && (
        <section className="container-page pb-16">
          <p className="text-text-muted text-lg leading-relaxed max-w-3xl">{pkg.longDescription}</p>
        </section>
      )}

      {detailSections.length > 0 && (
        <section className="border-t border-border bg-bg-elevated py-20 md:py-24">
          <div className="container-page">
            <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">The Detail</div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-12">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {detailSections.map((section, i) => (
                <div key={`${section.title ?? "section"}-${i}`} className="border border-border bg-bg p-8 md:p-10">
                  <h3 className="font-display text-2xl tracking-tight mb-6 flex items-center gap-3">
                    <Tag size={18} className="text-brand-light shrink-0" strokeWidth={1.5} />
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {(section.items ?? []).map((item, ii) => (
                      <li key={`${item}-${ii}`} className="flex items-start gap-3 text-sm text-text-muted">
                        <Check size={15} className="text-brand-light shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {includes.length > 0 && (
        <section className="border-t border-border py-20 md:py-24">
          <div className="container-page">
            <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">At A Glance</div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-12">Package Summary</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-4xl">
              {includes.map((item, i) => (
                <li key={`${item}-${i}`} className="flex items-start gap-3 text-text-muted border-b border-border pb-4">
                  <Check size={16} className="text-brand-light shrink-0 mt-1" strokeWidth={2.5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-t border-border bg-bg-elevated">
        <div className="container-page py-24 text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">{ctaHeading}</h2>
          <p className="text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">{ctaBody}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <CtaLink
              href={ctaLink}
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
            >
              {ctaLabel} <ArrowRight size={16} />
            </CtaLink>
            <Link
              href="/services/detailing#packages"
              className="inline-flex items-center gap-2 border border-border hover:border-brand text-text px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
            >
              Compare Packages
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
