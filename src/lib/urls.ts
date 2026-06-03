// ⚠️ DUPLICATED LOGIC — keep in sync with `isSafeCmsHref` in
// `sanity/schemas/_ctaLink.ts`. The Studio schema can't import from `src/`
// (separate tsconfig roots / build), so the allowlist is intentionally copied
// there. If you change the safe-protocol rules here, update both files in
// tandem or CMS schema validation and runtime validation will drift apart.
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
