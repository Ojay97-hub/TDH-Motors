import type { Metadata } from "next";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { MerchGrid } from "@/components/merch-grid";
import { TIKTOK_SHOP_URL } from "@/lib/merch";
import { getMerchItems, toMerchItems } from "@/lib/merch-products";
import { safeSanityFetch } from "@/sanity/client";
import { merchPageQuery } from "@/sanity/queries";
import { CtaLink } from "@/components/cta-link";

export const metadata: Metadata = {
  title: "Shop | TDH Motors",
  description: "Shop The Dog House official apparel and garage essentials — checkout securely through TikTok Shop.",
};

const PERK_ICONS = [ShieldCheck, Truck, Sparkles];

const STORE_PERKS_DEFAULTS = [
  {
    title: "Secure TikTok checkout",
    detail: "Every order is completed and protected through TikTok Shop.",
  },
  {
    title: "Tracked delivery",
    detail: "Shipping and tracking handled end-to-end by TikTok Shop.",
  },
  {
    title: "New drop incoming",
    detail: "The first Dog House collection lands soon — follow for the date.",
  },
];

export default async function MerchPage() {
  const [cms, fallbackProducts] = await Promise.all([
    // Tag with "merchProduct" too, so editing a curated product revalidates here.
    safeSanityFetch(
      merchPageQuery,
      {},
      { next: { revalidate: 60, tags: ["merchPage", "merchProduct"] } },
    ),
    getMerchItems(),
  ]);

  // Curated list takes priority; an empty list falls back to every visible product.
  const products = cms?.products?.length ? toMerchItems(cms.products) : fallbackProducts;

  const eyebrow = cms?.eyebrow ?? "Shop";
  const heading = cms?.heading ?? "The Dog House Shop";
  const intro = cms?.intro ?? "Official TDH apparel and garage essentials, built around the new Dog House artwork. Browse the collection below and check out securely through TikTok Shop.";
  const perks = cms?.perks?.length ? cms.perks : STORE_PERKS_DEFAULTS;
  const productsLabel = cms?.productsLabel ?? `${products.length} ${products.length === 1 ? "product" : "products"}`;
  const collectionLabel = cms?.collectionLabel ?? "The Dog House Drop";
  const ctaHeading = cms?.ctaHeading ?? "Don't Miss the Drop";
  const ctaBody = cms?.ctaBody ?? "Follow TDH on TikTok for the launch date, new drops, restocks, and behind-the-scenes previews.";
  const ctaLabel = cms?.ctaLabel ?? "Follow on TikTok";
  const ctaLink = cms?.ctaLink ?? TIKTOK_SHOP_URL;

  return (
    <>
      {/* Storefront header */}
      <section className="container-page pt-32 md:pt-40 pb-12">
        <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">{eyebrow}</div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">{heading}</h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
          {intro}
        </p>
      </section>

      {/* Trust / info bar */}
      <section className="container-page pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 border border-border divide-y sm:divide-y-0 sm:divide-x divide-border bg-bg-elevated">
          {perks.map((perk: { title: string; detail: string }, i: number) => {
            const Icon = PERK_ICONS[i] ?? ShieldCheck;
            return (
              <div key={`${perk.title ?? "perk"}-${i}`} className="flex items-start gap-4 p-6">
                <Icon size={22} className="text-brand-light shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <div className="font-medium text-text mb-1">{perk.title}</div>
                  <p className="text-text-muted text-sm leading-relaxed">{perk.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Product grid */}
      <section className="container-page pb-24">
        <div className="flex items-center justify-between border-b border-border pb-5 mb-10">
          <div className="text-sm text-text-muted">
            {productsLabel}
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-text-subtle">{collectionLabel}</div>
        </div>

        <MerchGrid items={products} />
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-bg-elevated">
        <div className="container-page py-24 text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">{ctaHeading}</h2>
          <p className="text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            {ctaBody}
          </p>
          <CtaLink
            href={ctaLink}
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
          >
            {ctaLabel} <ArrowRight size={16} />
          </CtaLink>
        </div>
      </section>
    </>
  );
}
