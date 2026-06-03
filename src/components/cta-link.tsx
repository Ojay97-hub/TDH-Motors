import Link from "next/link";
import type { ReactNode } from "react";
import { normalizeCmsHref } from "@/lib/urls";

/**
 * Renders a CMS-driven CTA link. Unsafe hrefs are deliberately rendered as
 * inert text so CMS content cannot inject executable protocols.
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
  const target = normalizeCmsHref(href);

  if (!target) {
    return <span className={className}>{children}</span>;
  }

  const isExternal = !target.startsWith("/") && !target.startsWith("#");

  if (isExternal) {
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
