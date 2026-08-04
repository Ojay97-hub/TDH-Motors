import { defineField } from "sanity";

// ⚠️ DUPLICATED LOGIC — this is a copy of `isSafeCmsHref` in `src/lib/urls.ts`.
// The Studio schema can't import from `src/` (separate tsconfig roots / build),
// so the allowlist is intentionally duplicated here to enforce the same rule at
// edit time that the frontend enforces at render time. If you change the
// safe-protocol rules in one file, update the other in tandem or schema-time and
// runtime validation will drift apart.
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
      r
        // The `url` type carries an implicit `uri({allowRelative: false, scheme:
        // ['http', 'https']})` rule that the custom check below cannot override —
        // user validation is chained onto that base rule, not swapped for it. Left
        // alone it rejects every internal path, anchor and mailto:/tel: link this
        // field exists to accept. Re-declaring `uri()` replaces the implicit
        // constraint; `isSafeCmsHref` below still rejects protocol-relative hrefs
        // such as //example.com, which `allowRelative` on its own would permit.
        .uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] })
        .custom((value) =>
          !value || isSafeCmsHref(value)
            ? true
            : 'Use an internal path like "/contact", an anchor like "#section", or http/https/mailto/tel.',
        ),
  });
}
