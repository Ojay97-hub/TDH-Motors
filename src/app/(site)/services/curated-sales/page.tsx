import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Car } from "lucide-react";
import { safeSanityFetch } from "@/sanity/client";
import { curatedSalesPageQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Curated Sales | TDH Motors",
  description: "Hand-picked performance cars with transparent valuations and part-exchange.",
};

const APPROACH_DEFAULTS = [
  {
    title: "Hand-Picked Selection",
    body: "We source performance and specialist cars that meet our exacting standards. Every vehicle is personally inspected before it reaches our inventory.",
  },
  {
    title: "Fully Prepared",
    body: "Each car receives a complete check, any necessary servicing, and professional detailing in our own workshop before delivery.",
  },
  {
    title: "Transparent Pricing",
    body: "No games, no haggling. What you see is what you get — we believe in honest conversations and fair value for both sides.",
  },
];

const PART_EXCHANGE_DEFAULTS = [
  { title: "Provide Details", body: "Tell us about your car — make, model, year, mileage, condition." },
  { title: "We Inspect", body: "Our team inspects your vehicle and provides a competitive valuation." },
  { title: "Trade & Upgrade", body: "Apply the valuation to your next car and drive away happy." },
];

export default async function CuratedSalesPage() {
  const cms = await safeSanityFetch(
    curatedSalesPageQuery,
    {},
    { next: { revalidate: 60, tags: ["curatedSalesPage"] } },
  );

  const eyebrow = cms?.eyebrow ?? "Service";
  const heading = cms?.heading ?? "Curated Sales";
  const intro = cms?.intro ?? "Every car in our inventory is hand-picked by our team and personally inspected before listing. We only sell cars we'd happily own ourselves. And we make trading in your current car straightforward.";
  const approachHeading = cms?.approachHeading ?? "Our Approach";
  const approachItems = cms?.approachItems?.length ? cms.approachItems : APPROACH_DEFAULTS;
  const partExchangeHeading = cms?.partExchangeHeading ?? "Part-Exchange Made Simple";
  const partExchangeIntro = cms?.partExchangeIntro ?? "Trading in your current car? We offer fair, transparent valuations with no surprises. Here's how it works:";
  const partExchangeSteps = cms?.partExchangeSteps?.length ? cms.partExchangeSteps : PART_EXCHANGE_DEFAULTS;
  const ctaHeading = cms?.ctaHeading ?? "Find Your Next Car";
  const ctaBody = cms?.ctaBody ?? "Browse our current inventory or tell us what you're looking for. We're here to help.";
  const primaryCtaLabel = cms?.primaryCtaLabel ?? "View Inventory";
  const secondaryCtaLabel = cms?.secondaryCtaLabel ?? "Get a Valuation";

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
              <Car size={32} className="text-brand-light" strokeWidth={1.5} />
              <h2 className="font-display text-3xl tracking-wide">{approachHeading}</h2>
            </div>
            <div className="space-y-6">
              {approachItems.map((item: { title: string; body: string }, i: number) => (
                <div key={`${item.title ?? "approach"}-${i}`}>
                  <h3 className="font-display text-xl tracking-wide mb-2">{item.title}</h3>
                  <p className="text-text-muted leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg-elevated p-8 md:p-12">
            <h3 className="font-display text-2xl tracking-wide mb-6">{partExchangeHeading}</h3>
            <p className="text-text-muted leading-relaxed mb-6">
              {partExchangeIntro}
            </p>
            {partExchangeSteps.map((step: { title: string; body: string }, i: number) => (
              <div key={`${step.title ?? "step"}-${i}`} className={`flex items-start gap-3 ${i < partExchangeSteps.length - 1 ? "mb-4" : ""}`}>
                <span className="inline-flex items-center justify-center w-8 h-8 bg-brand text-on-brand font-bold text-sm rounded-full shrink-0">{i + 1}</span>
                <div>
                  <h4 className="font-medium mb-1">{step.title}</h4>
                  <p className="text-text-muted text-sm">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg-elevated">
        <div className="container-page py-24 text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">{ctaHeading}</h2>
          <p className="text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            {ctaBody}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/inventory"
              className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
            >
              {primaryCtaLabel} <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-text/30 hover:border-text text-text px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
            >
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
