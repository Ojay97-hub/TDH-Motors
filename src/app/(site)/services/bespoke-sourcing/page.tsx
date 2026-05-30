import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Bespoke Sourcing | TDH Motors",
  description: "Can't find what you want? We'll use our network to source your perfect car.",
};

export default function BespokeSourcingPage() {
  return (
    <>
      <section className="container-page pt-32 md:pt-40 pb-12">
        <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Service</div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">Bespoke Sourcing</h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
          Looking for something specific? A rare variant, a particular colour, a unique specification, or an investment-grade example? Let us know your dream spec and we&apos;ll use our network to find it.
        </p>
      </section>

      <section className="container-page pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Search size={32} className="text-brand-light" strokeWidth={1.5} />
              <h2 className="font-display text-3xl tracking-wide">How It Works</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl tracking-wide mb-2">Tell Us What You Want</h3>
                <p className="text-text-muted leading-relaxed">
                  Whether it&apos;s a specific model, year range, colour, specification, or something more unique — the more detail, the better.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl tracking-wide mb-2">We Search Our Network</h3>
                <p className="text-text-muted leading-relaxed">
                  We tap into our extensive network of dealers, auction houses, and private contacts to find exactly what you&apos;re after.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl tracking-wide mb-2">We Inspect & Deliver</h3>
                <p className="text-text-muted leading-relaxed">
                  Once we&apos;ve found your car, we conduct a thorough inspection, handle all the paperwork, and deliver it to you — ready to enjoy.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-bg-elevated p-8 md:p-12">
            <h3 className="font-display text-2xl tracking-wide mb-6">Perfect For</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3">
                <span className="text-brand-light font-bold text-lg shrink-0">→</span>
                <span className="text-text-muted leading-relaxed">Finding a rare colour or limited edition variant</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-light font-bold text-lg shrink-0">→</span>
                <span className="text-text-muted leading-relaxed">Locating investment-grade examples in perfect condition</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-light font-bold text-lg shrink-0">→</span>
                <span className="text-text-muted leading-relaxed">Sourcing specific year ranges or generations</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-light font-bold text-lg shrink-0">→</span>
                <span className="text-text-muted leading-relaxed">Finding cars with unusual specifications or low mileage</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-light font-bold text-lg shrink-0">→</span>
                <span className="text-text-muted leading-relaxed">One-off builds or bespoke configurations</span>
              </li>
            </ul>

            <div className="bg-bg p-6">
              <p className="text-text-muted text-sm">
                <span className="font-medium text-text block mb-2">No obligation, no timeline pressure.</span>
                We&apos;ll search on your behalf with no cost unless we find exactly what you&apos;re looking for.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg-elevated">
        <div className="container-page py-24 text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">Let&apos;s Find Your Perfect Car</h2>
          <p className="text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Tell us what you&apos;re looking for and we&apos;ll start the search. No obligation, no pressure — just an honest conversation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
          >
            Start the Search <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
