import { defineType, defineField, defineArrayMember } from "sanity";

export const car = defineType({
  name: "car",
  title: "Car",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "specs", title: "Specifications" },
    { name: "media", title: "Photos" },
    { name: "marketing", title: "Marketing" },
  ],
  fields: [
    defineField({
      name: "make",
      title: "Make",
      type: "string",
      group: "identity",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "model",
      title: "Model",
      type: "string",
      group: "identity",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "variant",
      title: "Variant",
      description: "Optional — e.g. \"Carrera S\", \"Competition\".",
      type: "string",
      group: "identity",
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      description: "Auto-generated from Make + Model + Variant + Year. Edit only if you need a custom URL.",
      type: "slug",
      group: "identity",
      options: {
        source: (doc) => {
          const d = doc as { make?: string; model?: string; variant?: string; year?: number };
          return [d.make, d.model, d.variant, d.year].filter(Boolean).join(" ");
        },
        maxLength: 96,
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "identity",
      validation: (r) => r.required().min(1900).max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "identity",
      initialValue: "available",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Reserved", value: "reserved" },
          { title: "Sold", value: "sold" },
          { title: "Coming Soon", value: "coming-soon" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "soldDate",
      title: "Date sold",
      description:
        "Filled in automatically when you mark a car as sold. Newest sales appear first on the Recently Sold page.",
      type: "date",
      group: "identity",
      options: { dateFormat: "DD MMM YYYY" },
      // Only meaningful once the car is sold — hidden the rest of the time so
      // the form stays short for the common (in-stock) case.
      hidden: ({ document }) => document?.status !== "sold",
    }),
    defineField({
      name: "hideFromSoldPage",
      title: "Hide from the Recently Sold page",
      description:
        "Tick this if a sold car shouldn't be showcased publicly (e.g. a private sale).",
      type: "boolean",
      group: "identity",
      initialValue: false,
      hidden: ({ document }) => document?.status !== "sold",
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      group: "identity",
      initialValue: false,
    }),

    defineField({
      name: "price",
      title: "Price (GBP)",
      type: "number",
      group: "specs",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "mileage",
      title: "Mileage (miles)",
      type: "number",
      group: "specs",
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: "transmission",
      title: "Transmission",
      type: "string",
      group: "specs",
      options: {
        list: ["Manual", "Automatic", "PDK", "DCT"],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "fuel",
      title: "Fuel",
      type: "string",
      group: "specs",
      options: {
        list: ["Petrol", "Diesel", "Electric", "Hybrid"],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "bodyType",
      title: "Body type",
      type: "string",
      group: "specs",
      options: {
        list: ["Coupe", "Convertible", "Saloon", "Estate", "SUV", "Hatchback"],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "specs",
      options: {
        list: [
          { title: "Luxury", value: "luxury" },
          { title: "Sports", value: "sports" },
          { title: "Performance", value: "performance" },
          { title: "Electric", value: "electric" },
          { title: "Classic", value: "classic" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "engine",
      title: "Engine",
      description: "e.g. \"3.0L Twin-Turbo Flat-Six\"",
      type: "string",
      group: "specs",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "power",
      title: "Power",
      description: "e.g. \"444 bhp\"",
      type: "string",
      group: "specs",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "colour",
      title: "Colour",
      type: "string",
      group: "specs",
      validation: (r) => r.required(),
    }),

    defineField({
      name: "images",
      title: "Photos",
      description: "Drag to reorder. The first image is used as the cover.",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      validation: (r) => r.required().min(1).error("Add at least one photo."),
    }),
    defineField({
      name: "video",
      title: "Video (deprecated — use Videos field below)",
      description: "DEPRECATED: Use the Videos field below instead. This field is kept for backward compatibility.",
      type: "file",
      group: "media",
      options: {
        accept: "video/*",
      },
      hidden: true,
    }),
    defineField({
      name: "videoUrl",
      title: "YouTube / TikTok URL (deprecated — use Videos field below)",
      description: "DEPRECATED: Use the Videos field below instead. This field is kept for backward compatibility.",
      type: "string",
      group: "media",
      hidden: true,
      validation: (r) =>
        r.custom((value) => {
          if (!value) return true;
          if (
            value.includes("youtube.com") ||
            value.includes("youtu.be") ||
            value.includes("tiktok.com")
          ) {
            return true;
          }
          return "Please enter a valid YouTube or TikTok URL.";
        }),
    }),
    defineField({
      name: "videos",
      title: "Videos",
      description: "Upload video files or paste external links. Shown on the car detail page.",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              description: "Optional — e.g. \"Walkaround\", \"Engine Start\"",
            }),
            defineField({
              name: "videoFile",
              title: "Video file",
              type: "file",
              options: { accept: "video/*" },
              description: "Upload an MP4. Used if no external URL is set.",
            }),
            defineField({
              name: "videoUrl",
              title: "External video URL",
              type: "url",
              description: "YouTube or TikTok URL. Used when no file is uploaded.",
              validation: (rule) =>
                rule.custom((value) => {
                  if (!value) return true;
                  const url = String(value);
                  if (
                    url.includes("youtube.com") ||
                    url.includes("youtu.be") ||
                    url.includes("tiktok.com")
                  ) {
                    return true;
                  }
                  return "Please enter a valid YouTube or TikTok URL.";
                }),
            }),
          ],
          validation: (rule) =>
            rule.custom((obj) => {
              const item = obj as { videoFile?: unknown; videoUrl?: string } | undefined;
              if (!item?.videoFile && !item?.videoUrl) {
                return "Upload a video file or paste an external URL";
              }
              return true;
            }),
          preview: {
            select: { title: "title", media: "videoFile" },
            prepare(selection) {
              return {
                title: selection.title || "Video",
              };
            },
          },
        }),
      ],
    }),

    defineField({
      name: "description",
      title: "Description",
      description: "1–3 paragraphs of marketing copy.",
      type: "text",
      rows: 6,
      group: "marketing",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "highlights",
      title: "Spec highlights",
      description: "Bullet points shown on the detail page.",
      type: "array",
      of: [{ type: "string" }],
      group: "marketing",
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: {
    select: {
      make: "make",
      model: "model",
      variant: "variant",
      year: "year",
      status: "status",
      soldDate: "soldDate",
      media: "images.0",
    },
    prepare({ make, model, variant, year, status, soldDate, media }) {
      const title = [year, make, model, variant].filter(Boolean).join(" ");
      const label = status
        ? `${status.charAt(0).toUpperCase()}${status.slice(1)}`
        : undefined;
      return {
        title,
        subtitle:
          status === "sold" && soldDate ? `Sold — ${soldDate}` : label,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Newest first",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
    {
      title: "Price (high to low)",
      name: "priceDesc",
      by: [{ field: "price", direction: "desc" }],
    },
    {
      title: "Recently sold first",
      name: "soldDateDesc",
      by: [{ field: "soldDate", direction: "desc" }],
    },
  ],
});
