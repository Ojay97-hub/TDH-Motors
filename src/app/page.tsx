import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Wrench, Shield, Search } from "lucide-react";
import { CarCard } from "@/components/car-card";
import { getFeaturedCars } from "@/lib/cars";

export default function Home() {
  const featured = getFeaturedCars();

  return (
    <>
      {/* Hero */}
      <section className="relative h-[92vh] min-h-[640px] flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=2400&q=85"
          alt="Performance car"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg/80 to-transparent" />

        <div className="relative container-page pb-24 md:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6 text-xs tracking-[0.3em] uppercase text-brand-light">
              <span className="w-8 h-px bg-brand-light" />
              Established in the Chilterns
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold leading-[0.95] mb-6 tracking-tight">
              Performance Cars,<br />
              <span className="text-brand-light">Hand-Picked.</span>
            </h1>
            <p className="text-lg md:text-xl text-text-muted max-w-xl mb-10 leading-relaxed">
              Sourced for enthusiasts, by enthusiasts. From iconic sports cars to flagship
              luxury — every car in our inventory is selected on its own merit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/inventory"
                className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-light text-text px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
              >
                Browse Inventory <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-border hover:border-text text-text px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
              >
                Book a Viewing
              </Link>
            </div>
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

      {/* About Teaser */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-[4/5] lg:aspect-[3/4]">
            <Image
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=85"
              alt="TDH Motors workshop"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute -inset-px border border-brand pointer-events-none" />
          </div>
          <div>
            <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Who We Are</div>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-6">
              Built on a Passion for<br />Performance.
            </h2>
            <p className="text-text-muted text-lg leading-relaxed mb-6">
              TDH Motors began with a simple idea: that buying a performance car should
              be as exciting as driving one. We're a small, family-run dealership in the
              heart of the Chilterns, with decades of combined experience across the
              marques we love.
            </p>
            <p className="text-text-muted leading-relaxed mb-8">
              From hot hatches to grand tourers, every car we offer has been chosen on
              its own merit — not its margin. We invite you to come and see them for
              yourself, by appointment.
            </p>
            <Link
              href="/who-we-are"
              className="inline-flex items-center gap-2 text-sm tracking-wider uppercase text-text border-b border-brand hover:border-brand-light pb-1 transition-colors"
            >
              Read Our Story <ArrowRight size={14} />
            </Link>
          </div>
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
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-light text-text px-8 py-4 font-medium tracking-wider uppercase text-sm transition-colors"
          >
            Book a Viewing <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
