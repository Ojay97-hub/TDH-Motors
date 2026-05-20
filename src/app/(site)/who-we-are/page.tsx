import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Eye, Handshake } from "lucide-react";
import { sanityClient } from "@/sanity/client";
import { whoWeArePageQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Who We Are",
  description: "A family-run performance car dealership in the heart of the Chilterns.",
};

const PRINCIPLE_ICONS = [Heart, Eye, Handshake];

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
  const cms = await sanityClient.fetch(
    whoWeArePageQuery,
    {},
    { next: { revalidate: 60, tags: ["whoWeArePage"] } },
  );

  const heroHeading = cms?.heroHeading ?? "Built on a passion for performance.";
  const introParagraph = cms?.introParagraph ?? "TDH Motors is a small, family-run dealership based in the Chilterns — with one principle that drives everything we do.";
  const para1 = cms?.para1 ?? "Buying a performance car should feel as good as driving one. Too often, it doesn't. Pushy sales tactics, opaque pricing, and tired stock have made the experience something to endure rather than enjoy.";
  const para2 = cms?.para2 ?? "We started TDH Motors to do things differently. Every car we offer has been hand-picked, personally inspected, and prepared in our own workshop. We sell cars we'd be proud to own — and we'd rather have fewer of the right ones than a full forecourt of the wrong ones.";
  const para3 = cms?.para3 ?? "We're a long way from a corporate showroom. There's no high-pressure sales floor, no commission targets, and no need to rush. We invite our customers to come and see us by appointment, take their time, ask questions, and only move forward when it feels right.";
  const principles = (cms?.principles && cms.principles.length > 0) ? cms.principles : PRINCIPLES_DEFAULTS;
  const ctaHeading = cms?.ctaHeading ?? "Come and Visit Us.";
  const ctaBody = cms?.ctaBody ?? "The best way to understand how we work is to come and meet us. Book an appointment and we'll put the kettle on.";

  return (
    <>
      <section className="relative h-[95vh] min-h-[700px] flex items-end overflow-hidden bg-stone-900">
        <Image
          src="/tdh-warehouse.jpg"
          alt="TDH Motors warehouse"
          fill
          sizes="100vw"
          priority
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
                <div key={p.title} className="text-center">
                  <Icon size={36} className="text-brand-light mx-auto mb-6" strokeWidth={1.5} />
                  <h3 className="font-display text-2xl tracking-wide mb-4">{p.title}</h3>
                  <p className="text-text-muted leading-relaxed">{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page py-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-6">{ctaHeading}</h2>
        <p className="text-text-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed">{ctaBody}</p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
        >
          Book a Visit <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
