import { defineType, defineField, defineArrayMember } from "sanity";

export const whoWeArePage = defineType({
  name: "whoWeArePage",
  title: "Who We Are Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "story", title: "Our Story" },
    { name: "principles", title: "Principles" },
    { name: "cta", title: "Call to Action" },
  ],
  fields: [
    defineField({
      name: "heroHeading",
      title: "Hero heading",
      type: "string",
      group: "hero",
      description: 'e.g. "Built on a passion for performance."',
    }),

    defineField({
      name: "introParagraph",
      title: "Lead paragraph",
      type: "text",
      rows: 3,
      group: "story",
      description: "Displayed larger than the rest — the opening statement.",
    }),
    defineField({
      name: "para1",
      title: "Paragraph 1",
      type: "text",
      rows: 3,
      group: "story",
    }),
    defineField({
      name: "para2",
      title: "Paragraph 2",
      type: "text",
      rows: 3,
      group: "story",
    }),
    defineField({
      name: "para3",
      title: "Paragraph 3",
      type: "text",
      rows: 3,
      group: "story",
    }),

    defineField({
      name: "principles",
      title: "Principles",
      description: "Up to 3 principle cards. Icons are assigned by position in code.",
      type: "array",
      group: "principles",
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
      validation: (r) => r.max(3),
    }),

    defineField({
      name: "ctaHeading",
      title: "CTA heading",
      type: "string",
      group: "cta",
      description: 'e.g. "Come and Visit Us."',
    }),
    defineField({
      name: "ctaBody",
      title: "CTA body",
      type: "text",
      rows: 2,
      group: "cta",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Who We Are" }),
  },
});
