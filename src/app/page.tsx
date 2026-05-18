import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Wrench, Shield, Search } from "lucide-react";
import { CarCard } from "@/components/car-card";
import { ShowroomVideo } from "@/components/showroom-video";
import { getFeaturedCars } from "@/lib/cars";

export default function Home() {
  const featured = getFeaturedCars();

  return (
    <>
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[620px] overflow-hidden bg-stone-900">
        <Image
          src="/tdh-warehouse.jpg"
          alt="TDH Motors warehouse"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        {/* Subtle bottom fade so the white site continues out of the photo */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />

        {/* Text card in bottom-right, with its own backdrop so the photo stays visible */}
        <div className="relative h-full container-page flex items-end justify-end pb-12 md:pb-16">
          <div className="max-w-md w-full bg-bg/85 backdrop-blur-sm p-8 md:p-10 border-l-4 border-brand">
            <div className="inline-flex items-center gap-2 mb-4 text-[10px] tracking-[0.3em] uppercase text-brand">
              <span className="w-8 h-px bg-brand" />
              Established in the Chilterns
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.05] mb-4 tracking-tight">
              Performance Cars,<br />
              <span className="text-brand">Hand-Picked.</span>
            </h1>
            <p className="text-text-muted mb-8 leading-relaxed">
              Sourced for enthusiasts, by enthusiasts — every car on our forecourt selected on its own merit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/inventory"
                className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-6 py-3 font-medium tracking-wider uppercase text-xs transition-colors"
              >
                Browse Inventory <ArrowRight size={14} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-text/30 hover:border-text text-text px-6 py-3 font-medium tracking-wider uppercase text-xs transition-colors"
              >
                Book a Viewing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Step Inside (video) */}
      <section className="container-page py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: about copy */}
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-brand mb-3">Who We Are</div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight font-bold mb-6">
              A proper passion for cars.
            </h2>
            <p className="text-text-muted text-lg leading-relaxed mb-5">
              The Dog House is a small, family-run dealership tucked away in the Chilterns. We started it because buying a performance car should feel as good as driving one.
            </p>
            <p className="text-text-muted leading-relaxed mb-5">
              Every car we offer has been hand-picked, personally inspected, and prepared in our own workshop. No high-pressure sales floor, no commission targets — just an honest conversation and cars we're genuinely proud of.
            </p>
            <p className="text-text-muted leading-relaxed mb-10">
              Come and see us by appointment. We'll put the kettle on.
            </p>
            <Link
              href="/who-we-are"
              className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-text border-b border-brand hover:border-brand-light pb-1 transition-colors"
            >
              Our Story <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right: portrait video */}
          <div className="w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto">
            <ShowroomVideo />
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-y border-border bg-bg-elevated">
        <div className="container-page py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { icon: Award, title: "Curated Selection", text: "Every car personally inspected and approved." },
              { icon: Search, title: "Bespoke Sourcing", text: "Can't find what you want? We'll find it for you." },
              { icon: Wrench, title: "Full Servicing", text: "In-house preparation and ongoing care." },
              { icon: Shield, title: "Trusted Trade-Ins", text: "Fair, transparent valuations on your current car." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex flex-col gap-3">
                <Icon size={28} className="text-brand-light" strokeWidth={1.5} />
                <h3 className="font-display tracking-wider text-lg">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Inventory */}
      <section className="container-page py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Current Stock</div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight">Featured Cars</h2>
          </div>
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-text-muted hover:text-text transition-colors"
          >
            View Full Inventory <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((car) => (
            <CarCard key={car.slug} car={car} />
          ))}
        </div>
      </section>

      {/* Services Strip */}
      <section className="border-y border-border bg-bg-elevated">
        <div className="container-page py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">What We Do</div>
              <h2 className="font-display text-4xl md:text-5xl tracking-tight">Services</h2>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: "Sales", text: "Curated stock plus dedicated bespoke sourcing for cars we don't yet have." },
                { title: "Part-Exchange", text: "Honest, market-aware valuations on whatever you're driving today." },
                { title: "Finance", text: "Flexible HP and PCP through our trusted finance partners." },
                { title: "Workshop", text: "Servicing, MOT preparation, and detailing — in-house." },
              ].map(({ title, text }) => (
                <div key={title} className="border-l border-brand pl-6">
                  <h3 className="font-display text-xl tracking-wide mb-2">{title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-text-muted hover:text-text transition-colors"
            >
              All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-24 md:py-32 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Visit Us</div>
          <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-6">
            By Appointment, In the Chilterns.
          </h2>
          <p className="text-text-muted text-lg leading-relaxed mb-10">
            Our showroom is open by appointment, allowing us to give every visitor the
            time and attention they deserve. Get in touch to arrange a viewing.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-on-brand px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
          >
            Book a Viewing <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
