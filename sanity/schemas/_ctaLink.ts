import { defineField } from "sanity";

const SAFE_EXTERNAL_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

function isSafeCmsHref(value: string) {
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

/**
 * A CTA "link" field. Accepts an internal path like "/contact", an anchor like
 * "#section", or a full URL (http / https / mailto / tel), so editors can
 * repoint any button without code changes. Pair it with the matching CTA label
 * field.
 */
export function ctaLinkField(opts: {
  name: string;
  title: string;
  group?: string;
  description?: string;
}) {
  return defineField({
    name: opts.name,
    title: opts.title,
    type: "url",
    group: opts.group,
    description:
      opts.description ??
      'Where this button goes. Use an internal path like "/contact", an anchor like "#section", or a full URL like "https://...".',
    validation: (r) =>
      r.custom((value) =>
        !value || isSafeCmsHref(value)
          ? true
          : 'Use an internal path like "/contact", an anchor like "#section", or http/https/mailto/tel.',
      ),
  });
}
