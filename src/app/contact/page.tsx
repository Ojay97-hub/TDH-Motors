import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a viewing or enquire about any car in our inventory.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ car?: string }>;
}) {
  const { car } = await searchParams;

  return (
    <>
      <section className="container-page pt-16 md:pt-24 pb-12">
        <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Get In Touch</div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">Contact Us</h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
          Drop us a line below, or come and see us. Viewings are by appointment so we
          can give you our undivided attention.
        </p>
      </section>

      <section className="container-page pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ContactForm prefilledCar={car} />
          </div>

          <div className="lg:col-span-5">
            <div className="bg-bg-elevated border border-border p-8">
              <h2 className="font-display text-2xl tracking-wide mb-8">Visit Us</h2>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <MapPin size={20} className="text-brand-light shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Address</div>
                    <div className="text-text">Aylesbury, Buckinghamshire</div>
                    <div className="text-text-muted text-sm">Exact address shared on booking</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Phone size={20} className="text-brand-light shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Phone</div>
                    <a href="tel:+441000000000" className="text-text hover:text-brand-light transition-colors">
                      +44 (0) 1000 000 000
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Mail size={20} className="text-brand-light shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Email</div>
                    <a href="mailto:hello@tdhmotors.co.uk" className="text-text hover:text-brand-light transition-colors">
                      hello@tdhmotors.co.uk
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Clock size={20} className="text-brand-light shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Hours</div>
                    <div className="text-text">Monday – Saturday</div>
                    <div className="text-text-muted text-sm">09:00 – 17:00 (by appointment)</div>
                  </div>
                </li>
              </ul>

              <div className="mt-10 pt-6 border-t border-border">
                <div className="text-xs uppercase tracking-wider text-text-subtle mb-3">Response Time</div>
                <p className="text-text-muted text-sm leading-relaxed">
                  We typically respond to all enquiries within one working day. For
                  urgent queries, please give us a call.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
