"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const leftNav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
];

const rightNav = [
  { href: "/who-we-are", label: "Who We Are" },
  { href: "/contact", label: "Contact" },
];

const mobileNav = [...leftNav, ...rightNav];

function navClass(pathname: string, href: string, mobile = false) {
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  const base = mobile
    ? "tracking-wider uppercase transition-colors py-2 text-base"
    : "text-sm tracking-wider uppercase transition-colors pb-0.5";
  const state = active
    ? "text-text border-b-2 border-brand"
    : "text-text-muted hover:text-text border-b-2 border-transparent";
  return `${base} ${state}`;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/80 border-b border-border">
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

        <Link href="/" className="flex items-center gap-3 lg:justify-self-center group">
          <Image
            src="/tdh-logo.jpg"
            alt="The Dog House"
            width={72}
            height={72}
            priority
            className="w-16 h-16 lg:w-[72px] lg:h-[72px] rounded-sm object-cover"
          />
          <div className="hidden sm:block">
            <div className="font-display font-bold tracking-wide text-lg lg:text-xl leading-none">
              The Dog House
            </div>
            <div className="text-[10px] tracking-[0.2em] text-text-subtle uppercase mt-1">
              Performance Cars · Chilterns
            </div>
          </div>
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
            className="lg:hidden p-2 text-text"
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
