import type { Metadata } from "next";
import { ArrowRight, Search } from "lucide-react";
import { safeSanityFetch } from "@/sanity/client";
import { bespokeSourcingPageQuery } from "@/sanity/queries";
import { CtaLink } from "@/components/cta-link";

export const metadata: Metadata = {
  title: "Bespoke Sourcing | TDH Motors",
  description: "Can't find what you want? We'll use our network to source your perfect car.",
};

const PROCESS_DEFAULTS = [
  {
    title: "Tell Us What You Want",
    body: "Whether it's a specific model, year range, colour, specification, or something more unique — the more detail, the better.",
  },
  {
    title: "We Search Our Network",
    body: "We tap into our extensive network of dealers, auction houses, and private contacts to find exactly what you're after.",
  },
  {
    title: "We Inspect & Deliver",
    body: "Once we've found your car, we conduct a thorough inspection, handle all the paperwork, and deliver it to you — ready to enjoy.",
  },
];

const PERFECT_FOR_DEFAULTS = [
  "Finding a rare colour or limited edition variant",
  "Locating investment-grade examples in perfect condition",
  "Sourcing specific year ranges or generations",
  "Finding cars with unusual specifications or low mileage",
  "One-off builds or bespoke configurations",
];

export default async function BespokeSourcingPage() {
  const cms = await safeSanityFetch(
    bespokeSourcingPageQuery,
    {},
    { next: { revalidate: 60, tags: ["bespokeSourcingPage"] } },
  );

  const eyebrow = cms?.eyebrow ?? "Service";
  const heading = cms?.heading ?? "Bespoke Sourcing";
  const intro = cms?.intro ?? "Looking for something specific? A rare variant, a particular colour, a unique specification, or an investment-grade example? Let us know your dream spec and we'll use our network to find it.";
  const processHeading = cms?.processHeading ?? "How It Works";
  const processItems = cms?.processItems?.length ? cms.processItems : PROCESS_DEFAULTS;
  const perfectForHeading = cms?.perfectForHeading ?? "Perfect For";
  const perfectForItems = cms?.perfectForItems?.length ? cms.perfectForItems : PERFECT_FOR_DEFAULTS;
  const noteHeading = cms?.noteHeading ?? "No obligation, no timeline pressure.";
  const noteBody = cms?.noteBody ?? "We'll search on your behalf with no cost unless we find exactly what you're looking for.";
  const ctaHeading = cms?.ctaHeading ?? "Let's Find Your Perfect Car";
  const ctaBody = cms?.ctaBody ?? "Tell us what you're looking for and we'll start the search. No obligation, no pressure — just an honest conversation.";
  const ctaLabel = cms?.ctaLabel ?? "Start the Search";
  const ctaLink = cms?.ctaLink ?? "/contact";

  return (
    <>
      <section className="container-page pt-32 md:pt-40 pb-12">
        <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">{eyebrow}</div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">{heading}</h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
          {intro}
        </p>
      </section>

      <section className="container-page pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Search size={32} className="text-brand-light" strokeWidth={1.5} />
              <h2 className="font-display text-3xl tracking-wide">{processHeading}</h2>
            </div>
            <div className="space-y-6">
              {processItems.map((item: { title: string; body: string }, i: number) => (
                <div key={`${item.title ?? "step"}-${i}`}>
                  <h3 className="font-display text-xl tracking-wide mb-2">{item.title}</h3>
                  <p className="text-text-muted leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg-elevated p-8 md:p-12">
            <h3 className="font-display text-2xl tracking-wide mb-6">{perfectForHeading}</h3>
            <ul className="space-y-4 mb-8">
              {perfectForItems.map((item: string, i: number) => (
                <li key={`${item}-${i}`} className="flex gap-3">
                  <span className="text-brand-light font-bold text-lg shrink-0">→</span>
                  <span className="text-text-muted leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="bg-bg p-6">
              <p className="text-text-muted text-sm">
                <span className="font-medium text-text block mb-2">{noteHeading}</span>
                {noteBody}
              </p>
            </div>
          </div>
        </div>
      </section>

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
