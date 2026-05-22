import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { sanityClient } from "@/sanity/client";
import { siteSettingsQuery } from "@/sanity/queries";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

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
            <div className="flex items-center gap-4 mt-4">
              <a
                href="https://www.instagram.com/thedoghouse_as"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-text-muted hover:text-brand-light transition-colors"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@thedoghouseas?lang=en-GB"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-text-muted hover:text-brand-light transition-colors"
              >
                <TikTokIcon size={18} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61584858144187&locale=en_GB"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-text-muted hover:text-brand-light transition-colors"
              >
                <FacebookIcon size={18} />
              </a>
            </div>
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
              <li><Link href="/merch" className="hover:text-text transition-colors">Merch</Link></li>
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
