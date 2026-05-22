import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Merch | TDH Motors",
  description: "The Dog House Motors official merchandise.",
};

export default function MerchPage() {
  return (
    <>
      <section className="container-page pt-32 md:pt-40 pb-24">
        <div className="max-w-2xl">
          <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Merch</div>
          <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">The Dog House</h1>
          <p className="text-text-muted text-lg leading-relaxed">
            Represent The Dog House Automotive Solutions with our exclusive merchandise. Designed for enthusiasts, by enthusiasts.
          </p>
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">Exclusive Designs</h2>
            <p className="text-text-muted leading-relaxed mb-6">
              Shop our curated collection of apparel, accessories, and lifestyle products. Everything is designed with the same attention to detail we bring to every car.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex gap-3">
                <span className="text-brand-light font-bold text-lg shrink-0">•</span>
                <span className="text-text-muted">Premium quality apparel</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-light font-bold text-lg shrink-0">•</span>
                <span className="text-text-muted">Exclusive designs</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-light font-bold text-lg shrink-0">•</span>
                <span className="text-text-muted">Limited edition items</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-light font-bold text-lg shrink-0">•</span>
                <span className="text-text-muted">Merch you'll actually wear</span>
              </li>
            </ul>
            <a
              href="https://www.tiktok.com/@thedoghouseas?lang=en-GB"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
            >
              Browse on TikTok Shop <ArrowRight size={16} />
            </a>
          </div>

          <div className="bg-bg-elevated p-8 md:p-12 border border-border rounded-sm">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">👕</div>
              <h3 className="font-display text-2xl tracking-wide mb-2">Coming Soon</h3>
              <p className="text-text-muted">Check back soon for new designs</p>
            </div>
            <p className="text-text-muted text-center text-sm leading-relaxed">
              Follow us on TikTok for the latest drops and exclusive previews of new designs.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg-elevated">
        <div className="container-page py-24 text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">Stay Updated</h2>
          <p className="text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Follow us on TikTok for the latest merchandise, exclusive designs, and behind-the-scenes content from The Dog House.
          </p>
          <a
            href="https://www.tiktok.com/@thedoghouseas?lang=en-GB"
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
