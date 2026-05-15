"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/services", label: "Services" },
  { href: "/who-we-are", label: "Who We Are" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/80 border-b border-border">
      <div className="container-page flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-sm border border-brand flex items-center justify-center group-hover:border-brand-light transition-colors">
            <span className="font-display font-bold text-brand-light text-sm tracking-widest">
              TDH
            </span>
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-semibold tracking-widest text-lg leading-none">
              TDH MOTORS
            </div>
            <div className="text-[10px] tracking-[0.2em] text-text-subtle uppercase mt-1">
              Performance Cars · Chilterns
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-wider uppercase text-text-muted hover:text-text transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/inventory"
            className="inline-flex items-center px-5 py-2.5 bg-brand hover:bg-brand-light text-text font-medium text-sm tracking-wider uppercase transition-colors"
          >
            View Stock
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 text-text"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-bg">
          <nav className="container-page py-6 flex flex-col gap-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base tracking-wider uppercase text-text-muted hover:text-text transition-colors py-2"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/inventory"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center px-5 py-3 bg-brand hover:bg-brand-light text-text font-medium tracking-wider uppercase transition-colors mt-2"
            >
              View Stock
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
