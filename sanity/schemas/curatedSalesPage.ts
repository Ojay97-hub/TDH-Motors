import { defineType, defineField, defineArrayMember } from "sanity";

export const curatedSalesPage = defineType({
  name: "curatedSalesPage",
  title: "Curated Sales Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "approach", title: "Our Approach" },
    { name: "partExchange", title: "Part-Exchange" },
    { name: "cta", title: "Call to Action" },
  ],
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "hero" }),
    defineField({ name: "heading", title: "Heading", type: "string", group: "hero" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3, group: "hero" }),
    defineField({ name: "approachHeading", title: "Approach heading", type: "string", group: "approach" }),
    defineField({
      name: "approachItems",
      title: "Approach items",
      type: "array",
      group: "approach",
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
    defineField({ name: "partExchangeHeading", title: "Part-exchange heading", type: "string", group: "partExchange" }),
    defineField({ name: "partExchangeIntro", title: "Part-exchange intro", type: "text", rows: 3, group: "partExchange" }),
    defineField({
      name: "partExchangeSteps",
      title: "Part-exchange steps",
      type: "array",
      group: "partExchange",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", title: "Body", type: "text", rows: 2, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
    defineField({ name: "ctaHeading", title: "CTA heading", type: "string", group: "cta" }),
    defineField({ name: "ctaBody", title: "CTA body", type: "text", rows: 2, group: "cta" }),
    defineField({ name: "primaryCtaLabel", title: "Primary CTA label", type: "string", group: "cta" }),
    defineField({ name: "secondaryCtaLabel", title: "Secondary CTA label", type: "string", group: "cta" }),
  ],
  preview: {
    prepare: () => ({ title: "Curated Sales Page" }),
  },
});
