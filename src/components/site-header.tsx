"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type RefObject } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

const servicesItems = [
  { href: "/services/detailing", label: "Detailing" },
  { href: "/services/curated-sales", label: "Curated Sales" },
  { href: "/services/storage", label: "Storage" },
  { href: "/services/bespoke-sourcing", label: "Bespoke Sourcing" },
];

const leftNav = [
  { href: "/", label: "Home" },
  { href: "/who-we-are", label: "About" },
];

const rightNav = [
  { href: "/contact", label: "Contact" },
];

const mobileNav = [
  { href: "/", label: "Home" },
  ...servicesItems,
  { href: "/who-we-are", label: "About" },
  { href: "/merch", label: "Merch" },
  { href: "/contact", label: "Contact" },
  { href: "/inventory", label: "Inventory" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function navClass(pathname: string, href: string, mobile = false) {
  const active = isActive(pathname, href);
  const base = mobile
    ? "tracking-wider uppercase transition-colors py-2 text-base font-medium"
    : "text-sm tracking-wider uppercase transition-colors pb-0.5 font-medium";
  const state = active
    ? "text-text border-b-2 border-brand"
    : "text-text/85 hover:text-text border-b-2 border-transparent";
  return `${base} ${state}`;
}

function dropdownPanelClass(open: boolean) {
  return `absolute top-full pt-2 transition-all duration-150 z-50 ${
    open
      ? "opacity-100 visible translate-y-0"
      : "opacity-0 invisible translate-y-1 pointer-events-none"
  }`;
}

function useNavDropdown(
  ref: RefObject<HTMLDivElement | null>,
  pathname: string,
) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setPinned(false);
    setHovered(false);
  }

  useEffect(() => {
    if (!pinned) return;
    const handlePointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setPinned(false);
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    return () => document.removeEventListener("pointerdown", handlePointer);
  }, [pinned, ref]);

  return {
    open: hovered || pinned,
    pinned,
    togglePinned: () => setPinned((value) => !value),
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };
}

function dropdownItemClass(pathname: string, href: string) {
  const active = isActive(pathname, href);
  return `block px-4 py-2.5 text-sm tracking-wider uppercase font-medium whitespace-nowrap transition-colors ${
    active
      ? "text-text bg-bg-elevated"
      : "text-text-muted hover:text-text hover:bg-bg-elevated"
  }`;
}

function ServicesDropdown({ pathname }: { pathname: string }) {
  const parentActive = servicesItems.some((item) => isActive(pathname, item.href));
  const ref = useRef<HTMLDivElement>(null);
  const dropdown = useNavDropdown(ref, pathname);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={dropdown.onMouseEnter}
      onMouseLeave={dropdown.onMouseLeave}
    >
      <button
        type="button"
        onClick={dropdown.togglePinned}
        aria-expanded={dropdown.open}
        aria-label="Toggle Services menu"
        className={`flex items-center gap-0.5 text-sm tracking-wider uppercase font-medium transition-colors pb-0.5 border-b-2 ${
          parentActive
            ? "text-text border-brand"
            : "text-text/85 hover:text-text border-transparent"
        }`}
      >
        Services
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform ${dropdown.open ? "rotate-180" : ""} ${parentActive ? "text-text" : "text-text/85"}`}
          aria-hidden
        />
      </button>
      <div className={dropdownPanelClass(dropdown.open)}>
        <div className="min-w-44 border border-border/60 bg-bg shadow-lg py-1">
          {servicesItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={dropdownItemClass(pathname, item.href)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-bg/65 backdrop-blur-md border-b border-border/60">
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
          <ServicesDropdown pathname={pathname} />
        </nav>

        <Link href="/" className="flex items-center lg:justify-self-center group">
          <Image
            src="/logo-light-mode.png"
            alt="The Dog House"
            width={192}
            height={192}
            loading="eager"
            fetchPriority="high"
            className="w-20 h-20 lg:w-24 lg:h-24 object-contain dark:invert"
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
            href="/merch"
            className={`hidden lg:inline-flex items-center font-medium text-sm tracking-wider uppercase transition-colors py-2.5 px-5 border border-text/60 ${
              isActive(pathname, "/merch")
                ? "bg-text/10 text-text"
                : "bg-transparent text-text/85 hover:text-text hover:border-text/80 hover:bg-text/5"
            }`}
          >
            Merch
          </Link>

          <Link
            href="/inventory"
            className={`hidden lg:inline-flex items-center font-medium text-sm tracking-wider uppercase transition-colors text-on-brand py-2.5 px-5 ${
              isActive(pathname, "/inventory") ? "bg-brand-light" : "bg-brand hover:bg-brand-light"
            }`}
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
                onClick={closeMenu}
                className={navClass(pathname, item.href, true)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
