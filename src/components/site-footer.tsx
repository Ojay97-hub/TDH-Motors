import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { sanityClient } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/queries";

export async function SiteFooter() {
  const settings = await sanityClient.fetch(
    siteSettingsQuery,
    {},
    { next: { revalidate: 60, tags: ["siteSettings"] } },
  );

  const phone = settings?.phone ?? "+44 (0) 1000 000 000";
  const email = settings?.email ?? "hello@tdhmotors.co.uk";
  const addressLine1 = settings?.addressLine1 ?? "Aylesbury, Buckinghamshire";
  const addressLine2 = settings?.addressLine2 ?? "HP-area, UK";
  const hoursLabel = settings?.hoursLabel ?? "Monday – Saturday";
  const hoursDetail = settings?.hoursDetail ?? "09:00 – 17:00 (by appointment)";

  return (
    <footer className="border-t border-border bg-bg-elevated">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/tdh-logo.jpg"
                alt="The Dog House"
                width={48}
                height={48}
                className="w-12 h-12 rounded-sm object-cover"
              />
              <div>
                <div className="font-display font-bold tracking-wide leading-none">
                  The Dog House
                </div>
                <div className="text-[10px] tracking-[0.2em] text-text-subtle uppercase mt-1">
                  Performance · Chilterns
                </div>
              </div>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Hand-picked performance and luxury cars in the heart of the
              Chilterns. Sourced for enthusiasts, by enthusiasts.
            </p>
          </div>

          <div>
            <h4 className="font-display tracking-widest text-sm uppercase mb-4 text-text">
              Explore
            </h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li><Link href="/inventory" className="hover:text-text transition-colors">Inventory</Link></li>
              <li><Link href="/services" className="hover:text-text transition-colors">Services</Link></li>
              <li><Link href="/who-we-are" className="hover:text-text transition-colors">Who We Are</Link></li>
              <li><Link href="/contact" className="hover:text-text transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display tracking-widest text-sm uppercase mb-4 text-text">
              Visit
            </h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 text-brand-light shrink-0" />
                <span>{addressLine1}<br />{addressLine2}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="mt-0.5 text-brand-light shrink-0" />
                <span>{hoursLabel}<br />{hoursDetail}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display tracking-widest text-sm uppercase mb-4 text-text">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-sm text-text-muted">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-light shrink-0" />
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-text transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-brand-light shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-text transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-subtle">
          <div>© {new Date().getFullYear()} TDH Motors. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-text-muted transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-text-muted transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
