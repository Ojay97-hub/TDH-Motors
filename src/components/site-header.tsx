"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const leftNav = [
  { href: "/", label: "Home" },
  { href: "/services/detailing", label: "Detailing" },
  { href: "/services/curated-sales", label: "Curated Sales" },
  { href: "/services/storage", label: "Storage" },
];

const rightNav = [
  { href: "/services/bespoke-sourcing", label: "Bespoke Sourcing" },
  { href: "/who-we-are", label: "Who We Are" },
  { href: "/contact", label: "Contact" },
];

const mobileNav = [...leftNav, ...rightNav];

function navClass(pathname: string, href: string, mobile = false) {
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  const base = mobile
    ? "tracking-wider uppercase transition-colors py-2 text-base font-medium"
    : "text-sm tracking-wider uppercase transition-colors pb-0.5 font-medium";
  const state = active
    ? "text-text border-b-2 border-brand"
    : "text-text-muted hover:text-text border-b-2 border-transparent";
  return `${base} ${state}`;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-bg/95 backdrop-blur-md border-b border-border/60">
      <div className="container-page flex lg:grid lg:grid-cols-[1fr_auto_1fr] items-center justify-between h-24 lg:h-28 gap-4">
        <nav className="hidden lg:flex items-center gap-7 justify-self-start">
          {leftNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navClass(pathname, item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="flex items-center lg:justify-self-center group">
          <Image
            src="/tdh-logo.jpg"
            alt="The Dog House"
            width={96}
            height={96}
            loading="eager"
            fetchPriority="high"
            className="w-20 h-20 lg:w-24 lg:h-24 rounded-sm object-cover"
          />
        </Link>

        <div className="flex items-center justify-end gap-5 lg:gap-7 justify-self-end">
          <nav className="hidden lg:flex items-center gap-7">
            {rightNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={navClass(pathname, item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/inventory"
            className="hidden lg:inline-flex items-center px-5 py-2.5 bg-brand hover:bg-brand-light text-on-brand font-medium text-sm tracking-wider uppercase transition-colors"
          >
            Inventory
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-text transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-bg">
          <nav className="container-page py-6 flex flex-col gap-4">
            {mobileNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={navClass(pathname, item.href, true)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/inventory"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center px-5 py-3 bg-brand hover:bg-brand-light text-on-brand font-medium tracking-wider uppercase transition-colors mt-2"
            >
              Inventory
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
