import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { StorageGallery } from "./_components/storage-gallery";
import { safeSanityFetch } from "@/sanity/client";
import { storagePageQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Storage | TDH Motors",
  description: "Secure, climate-controlled storage for your performance or classic car.",
};

const BENEFITS_DEFAULTS = [
  {
    title: "Climate Controlled",
    body: "Your vehicle is protected from the elements. Stable temperature and humidity keep paint, interior, and mechanical condition optimal.",
  },
  {
    title: "Security First",
    body: "Security is our number one priority. 24/7 CCTV monitoring, secure gates, alarmed access, and locked indoor storage mean your car is as safe as it can possibly be during its time with us.",
  },
  {
    title: "Discreet & Confidential",
    body: "We keep a low profile. Your vehicle's presence, registration, and ownership details stay strictly confidential — nothing is shared, and the facility address is given only to clients.",
  },
  {
    title: "Flexible Terms",
    body: "Short or long-term storage to suit your needs. Whether it's seasonal or extended, we offer competitive rates with no long-term lock-in.",
  },
];

const INCLUDED_DEFAULTS = [
  "Climate-controlled storage bay",
  "24/7 CCTV security monitoring",
  "Discreet, fully confidential handling",
  "Regular vehicle check-ins (on request)",
  "Battery trickle charging (available)",
  "Easy access for viewings or collection",
  "Flexible short or long-term rates",
];

export default async function StoragePage() {
  const cms = await safeSanityFetch(
    storagePageQuery,
    {},
    { next: { revalidate: 60, tags: ["storagePage"] } },
  );

  const eyebrow = cms?.eyebrow ?? "Service";
  const heading = cms?.heading ?? "Storage";
  const intro = cms?.intro ?? "Whether you're a collector with a weekend car, between sales, or simply need a secure home for your vehicle, our secure and climate-controlled storage is the answer. Discretion and security are our highest priority — your car is kept confidential and protected around the clock.";
  const pricingBody = cms?.pricingBody;
  const benefitsHeading = cms?.benefitsHeading ?? "Why Store With Us?";
  const benefits = cms?.benefits?.length ? cms.benefits : BENEFITS_DEFAULTS;
  const includedHeading = cms?.includedHeading ?? "What's Included";
  const includedItems = cms?.includedItems?.length ? cms.includedItems : INCLUDED_DEFAULTS;
  const includedFootnote = cms?.includedFootnote ?? "Perfect for collectors, investment vehicles, classic cars, or simply parking your pride and joy somewhere it'll be looked after.";
  const ctaHeading = cms?.ctaHeading ?? "Ready to Store With Confidence?";
  const ctaBody = cms?.ctaBody ?? "Get in touch to discuss your storage needs and receive a competitive quote.";
  const ctaLabel = cms?.ctaLabel ?? "Get In Touch";

  return (
    <>
      <section className="container-page pt-32 md:pt-40 pb-12">
        <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">{eyebrow}</div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">{heading}</h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
          {intro}
        </p>
        {pricingBody ? (
          <p className="text-text-muted max-w-2xl leading-relaxed mt-4">{pricingBody}</p>
        ) : (
          <p className="text-text-muted max-w-2xl leading-relaxed mt-4">
            Storage starts from <span className="text-text font-medium">£200</span>. Rates depend on the vehicle and
            length of stay, so final costing is assessed case by case —{" "}
            <Link href="/contact" className="text-brand hover:text-brand-light transition-colors font-medium">
              get in touch
            </Link>{" "}
            for a tailored quote.
          </p>
        )}
      </section>

      <section className="container-page pb-24">
        <StorageGallery />
      </section>

      <section className="container-page pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Lock size={32} className="text-brand-light" strokeWidth={1.5} />
              <h2 className="font-display text-3xl tracking-wide">{benefitsHeading}</h2>
            </div>
            <div className="space-y-6">
              {benefits.map((item: { title: string; body: string }, i: number) => (
                <div key={`${item.title ?? "benefit"}-${i}`}>
                  <h3 className="font-display text-xl tracking-wide mb-2">{item.title}</h3>
                  <p className="text-text-muted leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg-elevated p-8 md:p-12">
            <h3 className="font-display text-2xl tracking-wide mb-6">{includedHeading}</h3>
            <ul className="space-y-4">
              {includedItems.map((item: string, i: number) => (
                <li key={`${item}-${i}`} className="flex gap-3">
                  <span className="text-brand-light font-bold text-lg shrink-0">✓</span>
                  <span className="text-text-muted leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-text-muted text-sm">
                {includedFootnote}
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
