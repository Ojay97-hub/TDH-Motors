import type { Metadata } from "next";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { MerchGrid } from "@/components/merch-grid";
import { MERCH_ITEMS, TIKTOK_SHOP_URL } from "@/lib/merch";

export const metadata: Metadata = {
  title: "Shop | TDH Motors",
  description: "Shop The Dog House official apparel and garage essentials — checkout securely through TikTok Shop.",
};

const STORE_PERKS = [
  {
    icon: ShieldCheck,
    title: "Secure TikTok checkout",
    detail: "Every order is completed and protected through TikTok Shop.",
  },
  {
    icon: Truck,
    title: "Tracked delivery",
    detail: "Shipping and tracking handled end-to-end by TikTok Shop.",
  },
  {
    icon: Sparkles,
    title: "New drop incoming",
    detail: "The first Dog House collection lands soon — follow for the date.",
  },
];

export default function MerchPage() {
  return (
    <>
      {/* Storefront header */}
      <section className="container-page pt-32 md:pt-40 pb-12">
        <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Shop</div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">The Dog House Shop</h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
          Official TDH apparel and garage essentials, built around the new Dog House artwork.
          Browse the collection below and check out securely through TikTok Shop.
        </p>
      </section>

      {/* Trust / info bar */}
      <section className="container-page pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 border border-border divide-y sm:divide-y-0 sm:divide-x divide-border bg-bg-elevated">
          {STORE_PERKS.map((perk) => {
            const Icon = perk.icon;
            return (
              <div key={perk.title} className="flex items-start gap-4 p-6">
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
            {MERCH_ITEMS.length} {MERCH_ITEMS.length === 1 ? "product" : "products"}
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-text-subtle">The Dog House Drop</div>
        </div>

        <MerchGrid items={MERCH_ITEMS} />
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-bg-elevated">
        <div className="container-page py-24 text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">Don&apos;t Miss the Drop</h2>
          <p className="text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Follow TDH on TikTok for the launch date, new drops, restocks, and behind-the-scenes previews.
          </p>
          <a
            href={TIKTOK_SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
          >
            Follow on TikTok <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </>
  );
}
