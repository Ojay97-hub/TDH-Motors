import { defineType, defineField, defineArrayMember } from "sanity";

export const storagePage = defineType({
  name: "storagePage",
  title: "Storage Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "benefits", title: "Why Store With Us" },
    { name: "included", title: "What's Included" },
    { name: "cta", title: "Call to Action" },
  ],
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "hero" }),
    defineField({ name: "heading", title: "Heading", type: "string", group: "hero" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 4, group: "hero" }),
    defineField({ name: "pricingBody", title: "Pricing body", type: "text", rows: 3, group: "hero" }),
    defineField({ name: "benefitsHeading", title: "Benefits heading", type: "string", group: "benefits" }),
    defineField({
      name: "benefits",
      title: "Benefits",
      type: "array",
      group: "benefits",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", title: "Body", type: "text", rows: 3, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
    defineField({ name: "includedHeading", title: "Included heading", type: "string", group: "included" }),
    defineField({
      name: "includedItems",
      title: "Included items",
      type: "array",
      group: "included",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "includedFootnote", title: "Included footnote", type: "text", rows: 2, group: "included" }),
    defineField({ name: "ctaHeading", title: "CTA heading", type: "string", group: "cta" }),
    defineField({ name: "ctaBody", title: "CTA body", type: "text", rows: 2, group: "cta" }),
    defineField({ name: "ctaLabel", title: "CTA label", type: "string", group: "cta" }),
  ],
  preview: {
    prepare: () => ({ title: "Storage Page" }),
  },
});
