import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Heart, Eye, Handshake } from "lucide-react";
import { safeSanityFetch } from "@/sanity/client";
import { whoWeArePageQuery } from "@/sanity/queries";
import { CtaLink } from "@/components/cta-link";

export const metadata: Metadata = {
  title: "Who We Are",
  description: "A family-run performance car dealership in the heart of the Chilterns.",
};

const PRINCIPLE_ICONS = [Heart, Eye, Handshake];

const PARTNER_OPPORTUNITIES_DEFAULTS = [
  "Exclusive service partnerships",
  "Product and supplier collaborations",
  "Event and sponsorship opportunities",
  "Media and content partnerships",
];

const PRINCIPLES_DEFAULTS = [
  {
    title: "Passion First",
    body: "We sell cars because we love them. That passion shapes which cars make it onto our forecourt — and how we look after them once they're here.",
  },
  {
    title: "Total Transparency",
    body: "Honest descriptions, full history files, and fair pricing. What you see is what you get — and what you don't see, we'll happily show you.",
  },
  {
    title: "Long-Term Relationships",
    body: "Our best customers are repeat customers. We're not interested in a one-off sale — we want to be the dealer you call for your next car, and the one after that.",
  },
];

export default async function WhoWeArePage() {
  const cms = await safeSanityFetch(
    whoWeArePageQuery,
    {},
    { next: { revalidate: 60, tags: ["whoWeArePage"] } },
  );

  const heroHeading = cms?.heroHeading ?? "Built on a passion for performance.";
  const introParagraph = cms?.introParagraph ?? "TDH Motors is a small, family-run dealership based in the Chilterns — guided by three principles that drive everything we do.";
  const para1 = cms?.para1 ?? "Buying a performance car should feel as good as driving one. Too often, it doesn't. Pushy sales tactics, opaque pricing, and tired stock have made the experience something to endure rather than enjoy.";
  const para2 = cms?.para2 ?? "We started TDH Motors to do things differently. Every car we offer has been hand-picked, personally inspected, and prepared in our own workshop. We sell cars we'd be proud to own — and we'd rather have fewer of the right ones than a full forecourt of the wrong ones.";
  const para3 = cms?.para3 ?? "We're a long way from a corporate showroom. There's no high-pressure sales floor, no commission targets, and no need to rush. We invite our customers to come and see us by appointment, take their time, ask questions, and only move forward when it feels right.";
  const principles = (cms?.principles && cms.principles.length > 0) ? cms.principles : PRINCIPLES_DEFAULTS;
  const partnersEyebrow = cms?.partnersEyebrow ?? "Collaboration";
  const partnersHeading = cms?.partnersHeading ?? "Business Partners";
  const partnersBody = cms?.partnersBody ?? "We're always interested in exploring partnerships that align with our values. Whether you're a specialist service provider, a fellow enthusiast business, or have a unique opportunity — we'd like to hear from you.";
  const partnerOpportunities = cms?.partnerOpportunities?.length ? cms.partnerOpportunities : PARTNER_OPPORTUNITIES_DEFAULTS;
  const partnersCardBody = cms?.partnersCardBody ?? "We work with partners who share our passion for quality, attention to detail, and honest, long-term relationships.";
  const partnersCardFootnote = cms?.partnersCardFootnote ?? "Have an opportunity you think we should know about? Drop us a message and let's have a conversation. We're always open to the right opportunity.";
  const partnersCtaLabel = cms?.partnersCtaLabel ?? "Get In Touch";
  const partnersCtaLink = cms?.partnersCtaLink ?? "/contact?subject=business-partnership";
  const ctaHeading = cms?.ctaHeading ?? "Come and Visit Us.";
  const ctaBody = cms?.ctaBody ?? "The best way to understand how we work is to come and meet us. Book an appointment and we'll put the kettle on.";
  const ctaButtonLabel = cms?.ctaButtonLabel ?? "Book a Visit";
  const ctaButtonLink = cms?.ctaButtonLink ?? "/contact";

  return (
    <>
      <section className="relative h-[95vh] min-h-[700px] flex items-end overflow-hidden bg-stone-900">
        <Image
          src="/tdh-warehouse.jpg"
          alt="TDH Motors warehouse"
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/50 to-transparent" />
        <div className="relative container-page pb-4 text-center">
          <div className="text-xs tracking-[0.3em] uppercase text-brand mb-3">Our Story</div>
          <h1 className="font-display text-5xl md:text-7xl tracking-tight max-w-3xl font-bold mx-auto">
            {heroHeading}
          </h1>
        </div>
      </section>

      <section className="container-page py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 lg:col-start-3">
            <div className="max-w-none">
              <p className="text-xl md:text-2xl font-display text-text leading-relaxed mb-8">
                {introParagraph}
              </p>
              <p className="text-text-muted text-lg leading-relaxed mb-6">{para1}</p>
              <p className="text-text-muted text-lg leading-relaxed mb-6">{para2}</p>
              <p className="text-text-muted text-lg leading-relaxed">{para3}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-bg-elevated">
        <div className="container-page py-20">
          <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3 text-center">What We Stand For</div>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-center mb-16">
            Our Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {principles.map((p: { title: string; body: string }, i: number) => {
              const Icon = PRINCIPLE_ICONS[i] ?? Heart;
              return (
                <div key={`${p.title ?? "principle"}-${i}`} className="text-center">
                  <Icon size={36} className="text-brand-light mx-auto mb-6" strokeWidth={1.5} />
                  <h3 className="font-display text-2xl tracking-wide mb-4">{p.title}</h3>
                  <p className="text-text-muted leading-relaxed">{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg-elevated">
        <div className="container-page py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">{partnersEyebrow}</div>
              <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-6">{partnersHeading}</h2>
              <p className="text-text-muted text-lg leading-relaxed mb-8">
                {partnersBody}
              </p>
              <ul className="space-y-4 mb-10">
                {partnerOpportunities.map((item: string, i: number) => (
                  <li key={`${item}-${i}`} className="flex gap-3">
                    <span className="text-brand-light font-bold text-lg shrink-0">•</span>
                    <span className="text-text-muted">{item}</span>
                  </li>
                ))}
              </ul>
              <CtaLink
                href={partnersCtaLink}
                className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
              >
                {partnersCtaLabel} <ArrowRight size={16} />
              </CtaLink>
            </div>

            <div className="bg-bg-elevated border border-border p-8 md:p-12">
              <p className="text-text-muted leading-relaxed mb-6">
                {partnersCardBody}
              </p>
              <p className="text-text-muted text-sm leading-relaxed">
                {partnersCardFootnote}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-6">{ctaHeading}</h2>
        <p className="text-text-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed">{ctaBody}</p>
        <CtaLink
          href={ctaButtonLink}
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
        >
          {ctaButtonLabel} <ArrowRight size={16} />
        </CtaLink>
      </section>
    </>
  );
}
