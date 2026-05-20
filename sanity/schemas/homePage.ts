import { defineType, defineField, defineArrayMember } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "about", title: "About Section" },
    { name: "valueProps", title: "Value Props" },
    { name: "servicesStrip", title: "Services Strip" },
    { name: "cta", title: "Call to Action" },
    { name: "findUs", title: "Find Us" },
  ],
  fields: [
    // Hero
    defineField({
      name: "heroLine1",
      title: "Hero heading — line 1",
      type: "string",
      group: "hero",
      description: 'e.g. "Performance Cars,"',
    }),
    defineField({
      name: "heroLine2",
      title: "Hero heading — line 2 (brand colour)",
      type: "string",
      group: "hero",
      description: 'e.g. "Hand-Picked." — rendered in the accent colour',
    }),
    defineField({
      name: "heroSubheading",
      title: "Hero subheading",
      type: "text",
      rows: 2,
      group: "hero",
    }),

    // About / Step Inside section
    defineField({
      name: "aboutHeading",
      title: "About heading",
      type: "string",
      group: "about",
      description: 'e.g. "A proper passion for cars."',
    }),
    defineField({
      name: "aboutPara1",
      title: "About paragraph 1",
      type: "text",
      rows: 3,
      group: "about",
    }),
    defineField({
      name: "aboutPara2",
      title: "About paragraph 2",
      type: "text",
      rows: 3,
      group: "about",
    }),
    defineField({
      name: "aboutPara3",
      title: "About paragraph 3",
      type: "text",
      rows: 2,
      group: "about",
    }),

    // Value props (icons fixed in code by position)
    defineField({
      name: "valueProps",
      title: "Value propositions",
      description: "Up to 4 items. Icons are assigned by position in code.",
      type: "array",
      group: "valueProps",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 2, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      validation: (r) => r.max(4),
    }),

    // Services strip (icons fixed in code by position)
    defineField({
      name: "servicesStrip",
      title: "Services strip items",
      description: "Up to 4 items. Shown in the Services section on the homepage.",
      type: "array",
      group: "servicesStrip",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Text", type: "text", rows: 2, validation: (r) => r.required() }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      validation: (r) => r.max(4),
    }),

    // Bottom CTA section
    defineField({
      name: "ctaHeading",
      title: "CTA heading",
      type: "string",
      group: "cta",
      description: 'e.g. "By Appointment, In the Chilterns."',
    }),
    defineField({
      name: "ctaBody",
      title: "CTA body",
      type: "text",
      rows: 3,
      group: "cta",
    }),

    // Find Us section
    defineField({
      name: "findUsHeading",
      title: "Find Us heading",
      type: "string",
      group: "findUs",
      description: 'e.g. "Better yet, see us in person."',
    }),
    defineField({
      name: "findUsBody",
      title: "Find Us body",
      type: "text",
      rows: 2,
      group: "findUs",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
