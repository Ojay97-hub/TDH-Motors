import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Eye, Handshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Who We Are",
  description: "A family-run performance car dealership in the heart of the Chilterns.",
};

export default function WhoWeArePage() {
  return (
    <>
      <section className="relative h-[60vh] min-h-[480px] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1493238792000-8113da705763?w=2400&q=85"
          alt="Country road in the Chilterns"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
        <div className="relative container-page pb-16">
          <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Our Story</div>
          <h1 className="font-display text-5xl md:text-7xl tracking-tight max-w-3xl">
            Built on a passion for performance.
          </h1>
        </div>
      </section>

      <section className="container-page py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 lg:col-start-3">
            <div className="prose prose-invert max-w-none">
              <p className="text-xl md:text-2xl font-display text-text leading-relaxed mb-8">
                TDH Motors is a small, family-run dealership based in the Chilterns —
                with one principle that drives everything we do.
              </p>
              <p className="text-text-muted text-lg leading-relaxed mb-6">
                Buying a performance car should feel as good as driving one. Too often,
                it doesn't. Pushy sales tactics, opaque pricing, and tired stock have
                made the experience something to endure rather than enjoy.
              </p>
              <p className="text-text-muted text-lg leading-relaxed mb-6">
                We started TDH Motors to do things differently. Every car we offer has
                been hand-picked, personally inspected, and prepared in our own
                workshop. We sell cars we'd be proud to own — and we'd rather have
                fewer of the right ones than a full forecourt of the wrong ones.
              </p>
              <p className="text-text-muted text-lg leading-relaxed">
                We're a long way from a corporate showroom. There's no high-pressure
                sales floor, no commission targets, and no need to rush. We invite our
                customers to come and see us by appointment, take their time, ask
                questions, and only move forward when it feels right.
              </p>
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
            {[
              {
                icon: Heart,
                title: "Passion First",
                body: "We sell cars because we love them. That passion shapes which cars make it onto our forecourt — and how we look after them once they're here.",
              },
              {
                icon: Eye,
                title: "Total Transparency",
                body: "Honest descriptions, full history files, and fair pricing. What you see is what you get — and what you don't see, we'll happily show you.",
              },
              {
                icon: Handshake,
                title: "Long-Term Relationships",
                body: "Our best customers are repeat customers. We're not interested in a one-off sale — we want to be the dealer you call for your next car, and the one after that.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="text-center">
                <Icon size={36} className="text-brand-light mx-auto mb-6" strokeWidth={1.5} />
                <h3 className="font-display text-2xl tracking-wide mb-4">{title}</h3>
                <p className="text-text-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-6">
          Come and Visit Us.
        </h2>
        <p className="text-text-muted text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          The best way to understand how we work is to come and meet us. Book an
          appointment and we'll put the kettle on.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-text px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
        >
          Book a Visit <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}
