import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Car, Search, Wrench, Banknote, Shield, Sparkles } from "lucide-react";
import { sanityClient } from "@/sanity/client";
import { servicesPageQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Sales, bespoke sourcing, part-exchange, finance, servicing, and detailing — all in one place.",
};

const SERVICE_ICONS = [Car, Search, Banknote, Shield, Wrench, Sparkles];

const SERVICES_DEFAULTS = [
  {
    title: "Curated Sales",
    body: "Every car in our inventory is hand-picked by our team and personally inspected before listing. We only sell cars we'd happily own ourselves.",
  },
  {
    title: "Bespoke Sourcing",
    body: "Looking for something specific? Let us know your dream spec and we'll use our network to find it. From discreet investment-grade cars to one-off configurations.",
  },
  {
    title: "Part-Exchange",
    body: "Whether you're upgrading or downsizing, we offer fair, transparent valuations on any car you'd like to trade. No surprises, no haggling.",
  },
  {
    title: "Finance",
    body: "Flexible HP and PCP arrangements through our trusted partners. We'll help you structure a deal that works for you, with no obligation.",
  },
  {
    title: "Servicing & MOT",
    body: "Our in-house workshop handles preparation, servicing, and MOT for every car we sell — and for our customers, long after they drive away.",
  },
  {
    title: "Detailing",
    body: "Full machine polish, paint protection, and ceramic coating from experienced detailers. Every car we sell is presented at its absolute best.",
  },
];

export default async function ServicesPage() {
  const cms = await sanityClient.fetch(
    servicesPageQuery,
    {},
    { next: { revalidate: 60, tags: ["servicesPage"] } },
  );

  const intro = cms?.intro ?? "We're more than a showroom. From the moment we source a car to the day you drive it home — and every service after — we're here to look after you.";
  const services = (cms?.services && cms.services.length > 0) ? cms.services : SERVICES_DEFAULTS;
  const ctaHeading = cms?.ctaHeading ?? "Looking for something specific?";
  const ctaBody = cms?.ctaBody ?? "Tell us what you'd like to drive next and we'll start the search. No obligation, no pressure — just an honest conversation.";

  return (
    <>
      <section className="container-page pt-32 md:pt-40 pb-12">
        <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">What We Do</div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">Services</h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">{intro}</p>
      </section>

      <section className="container-page pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {services.map((svc: { title: string; body: string }, i: number) => {
            const Icon = SERVICE_ICONS[i] ?? Car;
            return (
              <div key={svc.title} className="bg-bg p-8 md:p-10 hover:bg-bg-elevated transition-colors">
                <Icon size={32} className="text-brand-light mb-6" strokeWidth={1.5} />
                <h2 className="font-display text-2xl tracking-wide mb-3">{svc.title}</h2>
                <p className="text-text-muted leading-relaxed">{svc.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-bg-elevated">
        <div className="container-page py-24 text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">{ctaHeading}</h2>
          <p className="text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">{ctaBody}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
          >
            Get In Touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
