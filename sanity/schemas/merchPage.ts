import { defineType, defineField, defineArrayMember } from "sanity";
import { ctaLinkField } from "./_ctaLink";

export const merchPage = defineType({
  name: "merchPage",
  title: "Merch Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "perks", title: "Info Bar" },
    { name: "products", title: "Products Header" },
    { name: "cta", title: "Call to Action" },
  ],
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "hero" }),
    defineField({ name: "heading", title: "Heading", type: "string", group: "hero" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3, group: "hero" }),
    defineField({
      name: "perks",
      title: "Store perks",
      type: "array",
      group: "perks",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "detail", title: "Detail", type: "text", rows: 2, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      validation: (r) => r.max(3),
    }),
    defineField({ name: "productsLabel", title: "Products label", type: "string", group: "products" }),
    defineField({ name: "collectionLabel", title: "Collection label", type: "string", group: "products" }),
    defineField({
      name: "products",
      title: "Products shown on this page",
      description:
        "Choose which products appear in the shop grid, in this order. Remove one here to drop it from the page without deleting the product itself. Leave empty to show every visible product (by their sort order). Hidden products never appear, even if added here.",
      type: "array",
      group: "products",
      of: [defineArrayMember({ type: "reference", to: [{ type: "merchProduct" }] })],
      validation: (r) => r.unique(),
    }),
    defineField({ name: "ctaHeading", title: "CTA heading", type: "string", group: "cta" }),
    defineField({ name: "ctaBody", title: "CTA body", type: "text", rows: 2, group: "cta" }),
    defineField({ name: "ctaLabel", title: "CTA label", type: "string", group: "cta" }),
    ctaLinkField({ name: "ctaLink", title: "CTA link", group: "cta", description: "Where the CTA button goes. Defaults to the TikTok shop." }),
  ],
  preview: {
    prepare: () => ({ title: "Merch Page" }),
  },
});
