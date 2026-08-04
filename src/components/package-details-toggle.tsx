"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import type { PackageDetailSection } from "@/lib/detailing-packages";

/**
 * Inline "Read More" for a package card: collapses the long-form copy by
 * default and expands it in place, so a visitor can compare tiers without
 * leaving the page. The expanded panel still links to the package's own page
 * for the full write-up.
 *
 * Animated with a 0fr→1fr grid row rather than max-height so the transition
 * works regardless of how much content each tier carries.
 */
export function PackageDetailsToggle({
  longDescription,
  detailSections = [],
  href,
  packageName,
}: {
  longDescription?: string;
  detailSections?: PackageDetailSection[];
  href: string;
  packageName?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase text-text border-b border-brand-light pb-0.5 hover:text-brand-light transition-colors cursor-pointer"
      >
        {open ? "Show Less" : "Read More"}
        <ChevronDown
          size={13}
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id={panelId}
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {longDescription && (
            <p className="text-sm text-text-muted leading-relaxed">{longDescription}</p>
          )}

          {detailSections.map((section, i) => (
            <div key={`${section.title ?? "section"}-${i}`} className="mt-5">
              <div className="text-[10px] tracking-[0.25em] uppercase text-brand-light mb-2.5">
                {section.title}
              </div>
              <ul className="space-y-2">
                {(section.items ?? []).map((item, ii) => (
                  <li key={`${item}-${ii}`} className="flex items-start gap-2.5 text-sm text-text-muted">
                    <Check size={13} className="text-brand-light shrink-0 mt-1" strokeWidth={2.5} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase text-brand-light hover:text-brand transition-colors mt-5"
          >
            {packageName ? `Full ${packageName} Page` : "Full Package Page"} <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
