import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock, ImageOff } from "lucide-react";
import { CtaLink } from "@/components/cta-link";
import { PackageDetailsToggle } from "@/components/package-details-toggle";
import {
  hasPackageDetail,
  packageContactHref,
  packageSlug,
  type DetailingPackage,
} from "@/lib/detailing-packages";

export type { DetailingPackage };

/**
 * Tiered package cards (Silver / Gold / Platinum style). One tier can be marked
 * `featured` to lift it out of the row with a badge — the grid keeps a uniform
 * height so the CTAs line up regardless of how many bullets each tier carries.
 *
 * A card links through to its own detail page only when it actually has
 * long-form content to show, so an editor adding a bare tier never creates a
 * "Read More" that lands on an empty page.
 */
export function DetailingPackages({ packages }: { packages: DetailingPackage[] }) {
  return (
    // `items-start` lets a card grow on its own when its Read More panel opens,
    // instead of stretching the whole row to match the tallest tier.
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
      {packages.map((pkg, i) => {
        const isFeatured = Boolean(pkg.featured);
        const slug = packageSlug(pkg, i);
        const showDetailLink = hasPackageDetail(pkg);

        return (
          <div
            key={`${pkg.name ?? "package"}-${i}`}
            className={`relative flex flex-col border transition-colors ${
              isFeatured
                ? "border-brand bg-bg-elevated md:-mt-4 md:mb-4 shadow-lg shadow-brand/5"
                : "border-border bg-bg-elevated hover:border-brand-light"
            }`}
          >
            {isFeatured && (
              <div className="bg-brand text-on-brand text-[10px] font-medium tracking-[0.25em] uppercase text-center py-2">
                {pkg.badgeLabel ?? "Most Popular"}
              </div>
            )}

            {/* Photo slot. Always rendered so the three tiers line up whether or
                not an editor has uploaded a car yet — an empty slot shows the
                same "no photo" placeholder the inventory cards use. */}
            <div className="group/photo relative aspect-4/3 overflow-hidden bg-stone-700 border-b border-border">
              {pkg.image ? (
                showDetailLink ? (
                  <Link
                    href={`/services/detailing/packages/${slug}`}
                    aria-label={`${pkg.name} package details`}
                    className="block h-full w-full"
                  >
                    <Image
                      src={pkg.image}
                      alt={`${pkg.name ?? "Detailing"} package`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover/photo:scale-105"
                    />
                  </Link>
                ) : (
                  <Image
                    src={pkg.image}
                    alt={`${pkg.name ?? "Detailing"} package`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-stone-300">
                  <ImageOff size={26} />
                  <span className="text-xs uppercase tracking-widest">Photo coming soon</span>
                </div>
              )}
            </div>

            <div className="p-8 md:p-9 flex flex-col grow">
              {pkg.tier && (
                <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">{pkg.tier}</div>
              )}
              <h3 className="font-display text-2xl md:text-3xl tracking-tight mb-2">{pkg.name}</h3>
              {pkg.tagline && (
                <p className="text-text-muted text-sm leading-relaxed mb-4">{pkg.tagline}</p>
              )}

              {showDetailLink && (
                <PackageDetailsToggle
                  longDescription={pkg.longDescription}
                  detailSections={pkg.detailSections}
                  href={`/services/detailing/packages/${slug}`}
                  packageName={pkg.name}
                />
              )}

              <div className="border-y border-border py-5 mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl tracking-tight text-text">{pkg.price}</span>
                  {pkg.priceNote && <span className="text-text-subtle text-xs">{pkg.priceNote}</span>}
                </div>
                {pkg.duration && (
                  <div className="flex items-center gap-2 text-text-muted text-sm mt-3">
                    <Clock size={14} className="text-brand-light shrink-0" />
                    <span>{pkg.duration}</span>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {(pkg.includes ?? []).map((item, ii) => (
                  <li key={`${item}-${ii}`} className="flex items-start gap-3 text-sm text-text-muted">
                    <Check size={15} className="text-brand-light shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <CtaLink
                href={packageContactHref(pkg, i)}
                className={`mt-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 font-medium tracking-wider uppercase text-xs transition-colors ${
                  isFeatured
                    ? "bg-brand hover:bg-brand-light text-on-brand"
                    : "border border-border text-text hover:border-brand hover:text-brand-light"
                }`}
              >
                {pkg.ctaLabel ?? "Book This Package"} <ArrowRight size={14} />
              </CtaLink>
            </div>
          </div>
        );
      })}
    </div>
  );
}
