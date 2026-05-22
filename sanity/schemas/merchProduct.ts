import { defineField, defineType } from "sanity";

export const merchProduct = defineType({
  name: "merchProduct",
  title: "Merch Product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Product name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Product image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "priceLabel",
      title: "Price label",
      description: "Optional display text, e.g. \"£24.99\" or \"From £20\".",
      type: "string",
    }),
    defineField({
      name: "tiktokShopUrl",
      title: "TikTok Shop URL",
      description: "Customers will complete the transaction on TikTok Shop.",
      type: "url",
      validation: (r) =>
        r.custom((value, context) => {
          const status = (context.document as { status?: string } | undefined)?.status;

          if (!value) {
            return status === "coming-soon"
              ? true
              : "Add a TikTok Shop URL unless the product is Coming Soon.";
          }

          try {
            const url = new URL(value);
            return url.protocol === "https:" ? true : "Use an https URL.";
          } catch {
            return "Enter a valid TikTok Shop URL.";
          }
        }),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "available",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Coming Soon", value: "coming-soon" },
          { title: "Hidden", value: "hidden" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      description: "Lower numbers appear first.",
      type: "number",
      initialValue: 100,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "priceLabel",
      media: "image",
    },
  },
  orderings: [
    {
      title: "Manual order",
      name: "sortOrderAsc",
      by: [
        { field: "sortOrder", direction: "asc" },
        { field: "_createdAt", direction: "desc" },
      ],
    },
  ],
});
