import Link from "next/link";
import type { ReactNode } from "react";

/** True for full URLs and mailto/tel — anything that should open as a plain anchor. */
export function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

/**
 * Renders a CMS-driven CTA link: a client-side <Link> for internal paths like
 * "/contact", or a new-tab <a> for full URLs / mailto / tel. Lets editors point
 * any CTA at either an internal page or an external site.
 */
export function CtaLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
