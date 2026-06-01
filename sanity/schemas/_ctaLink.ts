import { defineField } from "sanity";

/**
 * A CTA "link" field. Accepts an internal path like "/contact" or a full URL
 * (https / mailto / tel), so editors can repoint any button without code
 * changes. Pair it with the matching CTA label field.
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
      'Where this button goes. Use an internal path like "/contact" or a full URL like "https://…".',
    validation: (r) =>
      r.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
  });
}
