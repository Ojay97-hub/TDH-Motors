import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-bg-elevated">
      <div className="container-page py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-sm border border-brand flex items-center justify-center">
                <span className="font-display font-bold text-brand-light text-sm tracking-widest">
                  TDH
                </span>
              </div>
              <div>
                <div className="font-display font-semibold tracking-widest leading-none">
                  TDH MOTORS
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
                <span>Aylesbury, Buckinghamshire<br />HP-area, UK</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="mt-0.5 text-brand-light shrink-0" />
                <span>09:00 – 17:00<br />By appointment only</span>
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
                <a href="tel:+441000000000" className="hover:text-text transition-colors">
                  +44 (0) 1000 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-brand-light shrink-0" />
                <a href="mailto:hello@tdhmotors.co.uk" className="hover:text-text transition-colors">
                  hello@tdhmotors.co.uk
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
