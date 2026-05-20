import { defineType, defineField, defineArrayMember } from "sanity";

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services Page",
  type: "document",
  fields: [
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 3,
      description: "Paragraph shown below the page heading.",
    }),
    defineField({
      name: "services",
      title: "Services",
      description: "Each card in the grid. Icons are assigned by position in code (up to 6).",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", title: "Body", type: "text", rows: 4, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      validation: (r) => r.max(6),
    }),
    defineField({
      name: "ctaHeading",
      title: "CTA heading",
      type: "string",
      description: 'e.g. "Looking for something specific?"',
    }),
    defineField({
      name: "ctaBody",
      title: "CTA body",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Services Page" }),
  },
});
