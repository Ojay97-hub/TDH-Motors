import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Car, Banknote } from "lucide-react";

export const metadata: Metadata = {
  title: "Curated Sales | TDH Motors",
  description: "Hand-picked performance cars with transparent valuations and part-exchange.",
};

export default function CuratedSalesPage() {
  return (
    <>
      <section className="container-page pt-32 md:pt-40 pb-12">
        <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Service</div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">Curated Sales</h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
          Every car in our inventory is hand-picked by our team and personally inspected before listing. We only sell cars we'd happily own ourselves. And we make trading in your current car straightforward.
        </p>
      </section>

      <section className="container-page pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Car size={32} className="text-brand-light" strokeWidth={1.5} />
              <h2 className="font-display text-3xl tracking-wide">Our Approach</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl tracking-wide mb-2">Hand-Picked Selection</h3>
                <p className="text-text-muted leading-relaxed">
                  We source performance and specialist cars that meet our exacting standards. Every vehicle is personally inspected before it reaches our inventory.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl tracking-wide mb-2">Fully Prepared</h3>
                <p className="text-text-muted leading-relaxed">
                  Each car receives a complete check, any necessary servicing, and professional detailing in our own workshop before delivery.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl tracking-wide mb-2">Transparent Pricing</h3>
                <p className="text-text-muted leading-relaxed">
                  No games, no haggling. What you see is what you get — we believe in honest conversations and fair value for both sides.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-bg-elevated p-8 md:p-12">
            <h3 className="font-display text-2xl tracking-wide mb-6">Part-Exchange Made Simple</h3>
            <p className="text-text-muted leading-relaxed mb-6">
              Trading in your current car? We offer fair, transparent valuations with no surprises. Here's how it works:
            </p>
            <div className="flex items-start gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-brand text-on-brand font-bold text-sm rounded-full shrink-0">1</span>
              <div>
                <h4 className="font-medium mb-1">Provide Details</h4>
                <p className="text-text-muted text-sm">Tell us about your car — make, model, year, mileage, condition.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-brand text-on-brand font-bold text-sm rounded-full shrink-0">2</span>
              <div>
                <h4 className="font-medium mb-1">We Inspect</h4>
                <p className="text-text-muted text-sm">Our team inspects your vehicle and provides a competitive valuation.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-brand text-on-brand font-bold text-sm rounded-full shrink-0">3</span>
              <div>
                <h4 className="font-medium mb-1">Trade & Upgrade</h4>
                <p className="text-text-muted text-sm">Apply the valuation to your next car and drive away happy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg-elevated">
        <div className="container-page py-24 text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">Find Your Next Car</h2>
          <p className="text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Browse our current inventory or tell us what you're looking for. We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
            >
              View Inventory <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-text/30 hover:border-text text-text px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
            >
              Get a Valuation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
