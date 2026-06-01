import { defineType, defineField, defineArrayMember } from "sanity";

export const bespokeSourcingPage = defineType({
  name: "bespokeSourcingPage",
  title: "Bespoke Sourcing Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "process", title: "How It Works" },
    { name: "perfectFor", title: "Perfect For" },
    { name: "cta", title: "Call to Action" },
  ],
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "hero" }),
    defineField({ name: "heading", title: "Heading", type: "string", group: "hero" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3, group: "hero" }),
    defineField({ name: "processHeading", title: "Process heading", type: "string", group: "process" }),
    defineField({
      name: "processItems",
      title: "Process items",
      type: "array",
      group: "process",
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
    defineField({ name: "perfectForHeading", title: "Perfect for heading", type: "string", group: "perfectFor" }),
    defineField({
      name: "perfectForItems",
      title: "Perfect for items",
      type: "array",
      group: "perfectFor",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({ name: "noteHeading", title: "Note heading", type: "string", group: "perfectFor" }),
    defineField({ name: "noteBody", title: "Note body", type: "text", rows: 2, group: "perfectFor" }),
    defineField({ name: "ctaHeading", title: "CTA heading", type: "string", group: "cta" }),
    defineField({ name: "ctaBody", title: "CTA body", type: "text", rows: 2, group: "cta" }),
    defineField({ name: "ctaLabel", title: "CTA label", type: "string", group: "cta" }),
  ],
  preview: {
    prepare: () => ({ title: "Bespoke Sourcing Page" }),
  },
});
