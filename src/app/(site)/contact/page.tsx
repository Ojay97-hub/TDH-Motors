import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { sanityClient } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Contact",
  description: "Book a viewing or enquire about any car in our inventory.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ car?: string }>;
}) {
  const [{ car }, settings] = await Promise.all([
    searchParams,
    sanityClient.fetch(siteSettingsQuery, {}, { next: { revalidate: 60, tags: ["siteSettings"] } }),
  ]);

  const phone = settings?.phone ?? "+44 (0) 1000 000 000";
  const email = settings?.email ?? "hello@tdhmotors.co.uk";
  const addressLine1 = settings?.addressLine1 ?? "Aylesbury, Buckinghamshire";
  const addressLine2 = settings?.addressLine2 ?? "Exact address shared on booking";
  const hoursLabel = settings?.hoursLabel ?? "Monday – Saturday";
  const hoursDetail = settings?.hoursDetail ?? "09:00 – 17:00 (by appointment)";

  return (
    <>
      <section className="container-page pt-32 md:pt-40 pb-12">
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
                    <div className="text-text">{addressLine1}</div>
                    <div className="text-text-muted text-sm">{addressLine2}</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Phone size={20} className="text-brand-light shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Phone</div>
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-text hover:text-brand-light transition-colors">
                      {phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Mail size={20} className="text-brand-light shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Email</div>
                    <a href={`mailto:${email}`} className="text-text hover:text-brand-light transition-colors">
                      {email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Clock size={20} className="text-brand-light shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-text-subtle mb-1">Hours</div>
                    <div className="text-text">{hoursLabel}</div>
                    <div className="text-text-muted text-sm">{hoursDetail}</div>
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
