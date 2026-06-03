const SAFE_EXTERNAL_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

export function isSafeCmsHref(value: string): boolean {
  const href = value.trim();
  if (!href) return false;

  // Internal route: reject protocol-relative links such as //example.com.
  if (href.startsWith("/")) {
    return !href.startsWith("//");
  }

  // Hash anchors: allow standalone "#" placeholders and named targets.
  if (href.startsWith("#")) {
    return true;
  }

  try {
    const url = new URL(href);
    return SAFE_EXTERNAL_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
}

export function normalizeCmsHref(value?: string | null): string | null {
  const href = value?.trim();
  if (!href) return null;
  return isSafeCmsHref(href) ? href : null;
}
