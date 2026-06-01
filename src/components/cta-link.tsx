import Link from "next/link";
import type { ReactNode } from "react";

/**
 * True for anything that should open as a plain anchor: full URLs (http/https),
 * mailto/tel, and protocol-relative URLs ("//cdn.example.com"). Everything else
 * is treated as an internal path.
 */
export function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/i.test(href) || href.startsWith("//");
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
  href?: string | null;
  className?: string;
  children: ReactNode;
}) {
  const target = href?.trim();

  // No link configured — render the label without an anchor rather than a
  // broken <a href=""> (which would just reload the current page).
  if (!target) {
    return <span className={className}>{children}</span>;
  }

  if (isExternalHref(target)) {
    return (
      <a href={target} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={target} className={className}>
      {children}
    </Link>
  );
}
