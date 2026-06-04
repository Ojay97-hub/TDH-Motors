import { defineType, defineField, defineArrayMember } from "sanity";

export const inventoryPage = defineType({
  name: "inventoryPage",
  title: "Inventory Page",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: 'e.g. "Current Stock"',
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'e.g. "Our Inventory"',
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 3,
      description: "Paragraph shown below the page heading.",
    }),
    defineField({
      name: "inventoryCars",
      title: "Current car listings",
      type: "array",
      description:
        "Quick links to the vehicle documents currently shown on the inventory page. The live page still shows all car documents automatically.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "car" }] })],
      validation: (r) => r.unique(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Inventory Page" }),
  },
});
