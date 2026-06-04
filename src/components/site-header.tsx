"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type RefObject } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

const leftNav = [
  { href: "/", label: "Home" },
  { href: "/services/detailing", label: "Detailing" },
  { href: "/services/curated-sales", label: "Curated Sales" },
  { href: "/services/storage", label: "Storage" },
];

const rightNav = [
  { href: "/services/bespoke-sourcing", label: "Bespoke Sourcing" },
];

const whoWeAreNav = {
  href: "/contact",
  label: "Contact",
  children: [{ href: "/who-we-are", label: "Who We Are" }],
};

const inventoryNav = {
  href: "/inventory",
  label: "Inventory",
  children: [{ href: "/merch", label: "Merch" }],
};

const mobileNav = [
  ...leftNav,
  ...rightNav,
  { href: "/who-we-are", label: "Who We Are" },
  { href: "/contact", label: "Contact" },
  { href: "/merch", label: "Merch" },
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

// Drives a nav dropdown that opens on hover (mouse) or tap (touch).
// `open = hovered || pinned`; the chevron toggles `pinned`, hover drives the
// rest, and an outside tap or route change collapses it again. The owning
// component passes its own `ref` so the outside-tap check can read it.
function useNavDropdown(
  ref: RefObject<HTMLDivElement | null>,
  pathname: string,
) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Collapse the dropdown when the route changes — React's recommended
  // "adjust state during render" pattern, no extra effect pass needed.
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

function NavDropdown({
  href,
  label,
  items,
  pathname,
}: {
  href: string;
  label: string;
  items: { href: string; label: string }[];
  pathname: string;
}) {
  const parentActive =
    isActive(pathname, href) ||
    items.some((child) => isActive(pathname, child.href));
  const ref = useRef<HTMLDivElement>(null);
  const dropdown = useNavDropdown(ref, pathname);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={dropdown.onMouseEnter}
      onMouseLeave={dropdown.onMouseLeave}
    >
      <div
        className={`flex items-center gap-0.5 pb-0.5 border-b-2 transition-colors ${
          parentActive ? "border-brand" : "border-transparent"
        }`}
      >
        <Link
          href={href}
          className={`text-sm tracking-wider uppercase font-medium transition-colors ${
            parentActive ? "text-text" : "text-text/85 hover:text-text"
          }`}
        >
          {label}
        </Link>
        <button
          type="button"
          onClick={dropdown.togglePinned}
          aria-expanded={dropdown.open}
          aria-label={`Toggle ${label} menu`}
          className="flex items-center -m-1 p-1"
        >
          <ChevronDown
            size={14}
            className={`shrink-0 transition-transform ${
              dropdown.open ? "rotate-180" : ""
            } ${parentActive ? "text-text" : "text-text/85"}`}
            aria-hidden
          />
        </button>
      </div>
      <div className={`right-0 ${dropdownPanelClass(dropdown.open)}`}>
        <div className="min-w-40 border border-border/60 bg-bg shadow-lg py-1">
          {items.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={dropdownItemClass(pathname, child.href)}
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function InventoryDropdown({ pathname }: { pathname: string }) {
  const { href, label, children: items } = inventoryNav;
  const parentActive =
    isActive(pathname, href) ||
    items.some((child) => isActive(pathname, child.href));
  const ref = useRef<HTMLDivElement>(null);
  const dropdown = useNavDropdown(ref, pathname);

  return (
    <div
      ref={ref}
      className="relative hidden lg:block"
      onMouseEnter={dropdown.onMouseEnter}
      onMouseLeave={dropdown.onMouseLeave}
    >
      <div
        className={`inline-flex items-center font-medium text-sm tracking-wider uppercase transition-colors text-on-brand ${
          parentActive ? "bg-brand-light" : "bg-brand hover:bg-brand-light"
        }`}
      >
        <Link href={href} className="py-2.5 pl-5 pr-1">
          {label}
        </Link>
        <button
          type="button"
          onClick={dropdown.togglePinned}
          aria-expanded={dropdown.open}
          aria-label={`Toggle ${label} menu`}
          className="flex items-center py-2.5 pr-4 pl-1"
        >
          <ChevronDown
            size={14}
            className={`transition-transform ${
              dropdown.open ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </button>
      </div>
      <div className={`right-0 ${dropdownPanelClass(dropdown.open)}`}>
        <div className="min-w-40 border border-border/60 bg-bg shadow-lg py-1">
          {items.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={dropdownItemClass(pathname, child.href)}
            >
              {child.label}
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
            <NavDropdown
              href={whoWeAreNav.href}
              label={whoWeAreNav.label}
              items={whoWeAreNav.children}
              pathname={pathname}
            />
          </nav>

          <InventoryDropdown pathname={pathname} />

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
            <Link
              href={inventoryNav.href}
              onClick={closeMenu}
              className="inline-flex items-center justify-center w-full px-5 py-3 bg-brand hover:bg-brand-light text-on-brand font-medium tracking-wider uppercase transition-colors mt-2"
            >
              {inventoryNav.label}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
