import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { StorageGallery } from "./_components/storage-gallery";

export const metadata: Metadata = {
  title: "Storage | TDH Motors",
  description: "Secure, climate-controlled storage for your performance or classic car.",
};

export default function StoragePage() {
  return (
    <>
      <section className="container-page pt-32 md:pt-40 pb-12">
        <div className="text-xs tracking-[0.3em] uppercase text-brand-light mb-3">Service</div>
        <h1 className="font-display text-5xl md:text-6xl tracking-tight mb-6">Storage</h1>
        <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
          Whether you're a collector with a weekend car, between sales, or simply need a secure home for your vehicle, our secure and climate-controlled storage is the answer. Discretion and security are our highest priority — your car is kept confidential and protected around the clock.
        </p>
      </section>

      <section className="container-page pb-24">
        <StorageGallery />
      </section>

      <section className="container-page pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Lock size={32} className="text-brand-light" strokeWidth={1.5} />
              <h2 className="font-display text-3xl tracking-wide">Why Store With Us?</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl tracking-wide mb-2">Climate Controlled</h3>
                <p className="text-text-muted leading-relaxed">
                  Your vehicle is protected from the elements. Stable temperature and humidity keep paint, interior, and mechanical condition optimal.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl tracking-wide mb-2">Security First</h3>
                <p className="text-text-muted leading-relaxed">
                  Security is our number one priority. 24/7 CCTV monitoring, secure gates, alarmed access, and locked indoor storage mean your car is as safe as it can possibly be during its time with us.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl tracking-wide mb-2">Discreet &amp; Confidential</h3>
                <p className="text-text-muted leading-relaxed">
                  We keep a low profile. Your vehicle's presence, registration, and ownership details stay strictly confidential — nothing is shared, and the facility address is given only to clients.
                </p>
              </div>
              <div>
                <h3 className="font-display text-xl tracking-wide mb-2">Flexible Terms</h3>
                <p className="text-text-muted leading-relaxed">
                  Short or long-term storage to suit your needs. Whether it's seasonal or extended, we offer competitive rates with no long-term lock-in.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-bg-elevated p-8 md:p-12">
            <h3 className="font-display text-2xl tracking-wide mb-6">What's Included</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-brand-light font-bold text-lg shrink-0">✓</span>
                <span className="text-text-muted leading-relaxed">Climate-controlled storage bay</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-light font-bold text-lg shrink-0">✓</span>
                <span className="text-text-muted leading-relaxed">24/7 CCTV security monitoring</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-light font-bold text-lg shrink-0">✓</span>
                <span className="text-text-muted leading-relaxed">Discreet, fully confidential handling</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-light font-bold text-lg shrink-0">✓</span>
                <span className="text-text-muted leading-relaxed">Regular vehicle check-ins (on request)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-light font-bold text-lg shrink-0">✓</span>
                <span className="text-text-muted leading-relaxed">Battery trickle charging (available)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-light font-bold text-lg shrink-0">✓</span>
                <span className="text-text-muted leading-relaxed">Easy access for viewings or collection</span>
              </li>
              <li className="flex gap-3">
                <span className="text-brand-light font-bold text-lg shrink-0">✓</span>
                <span className="text-text-muted leading-relaxed">Flexible short or long-term rates</span>
              </li>
            </ul>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-text-muted text-sm">
                Perfect for collectors, investment vehicles, classic cars, or simply parking your pride and joy somewhere it'll be looked after.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-bg-elevated">
        <div className="container-page py-24 text-center">
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-6">Ready to Store With Confidence?</h2>
          <p className="text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Get in touch to discuss your storage needs and receive a competitive quote.
          </p>
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
