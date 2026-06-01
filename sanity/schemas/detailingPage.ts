import { defineType, defineField, defineArrayMember } from "sanity";

export const detailingPage = defineType({
  name: "detailingPage",
  title: "Detailing Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "services", title: "Services" },
    { name: "beforeAfter", title: "Before & After" },
    { name: "gallery", title: "Photo Gallery" },
    { name: "videos", title: "Videos" },
    { name: "footer", title: "Footer CTA" },
  ],
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "hero" }),
    defineField({ name: "heading", title: "Heading", type: "string", group: "hero" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 4, group: "hero" }),
    defineField({ name: "pricingBody", title: "Pricing body", type: "text", rows: 3, group: "hero" }),
    defineField({
      name: "services",
      title: "Detailing services",
      type: "array",
      group: "services",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "tag", title: "Tag", type: "string" }),
            defineField({ name: "tagline", title: "Tagline", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
            defineField({ name: "price", title: "Price", type: "string" }),
            defineField({ name: "bullets", title: "Bullets", type: "array", of: [defineArrayMember({ type: "string" })] }),
            defineField({ name: "includes", title: "What's included", type: "array", of: [defineArrayMember({ type: "string" })] }),
          ],
          preview: { select: { title: "title", subtitle: "price" } },
        }),
      ],
    }),
    defineField({
      name: "beforeAfterGallery",
      title: "Before & After Gallery",
      description: "Each entry appears as a draggable side-by-side slider on the detailing page.",
      type: "array",
      group: "beforeAfter",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'e.g. "Bentley Continental GT — Swirl Correction"',
              validation: (r) => r.required(),
            }),
            defineField({
              name: "serviceTag",
              title: "Service tag",
              type: "string",
              description: 'e.g. "Correction Detailing"',
            }),
            defineField({
              name: "beforeImage",
              title: "Before — image",
              type: "image",
              options: { hotspot: true },
              description: "Use this OR the video field below, not both.",
            }),
            defineField({
              name: "beforeVideo",
              title: "Before — video file",
              type: "file",
              options: { accept: "video/*" },
              description: "Upload an MP4 to use a video for the Before side instead of a still image.",
            }),
            defineField({
              name: "afterImage",
              title: "After — image",
              type: "image",
              options: { hotspot: true },
              description: "Use this OR the video field below, not both.",
            }),
            defineField({
              name: "afterVideo",
              title: "After — video file",
              type: "file",
              options: { accept: "video/*" },
              description: "Upload an MP4 to use a video for the After side instead of a still image.",
            }),
          ],
          validation: (rule) =>
            rule.custom((obj) => {
              const item = obj as {
                beforeImage?: unknown;
                beforeVideo?: unknown;
                afterImage?: unknown;
                afterVideo?: unknown;
              } | undefined;
              if (!item?.afterImage && !item?.afterVideo) {
                return "Upload either an After image or After video";
              }
              if (item.beforeImage && item.beforeVideo) {
                return "Choose either a Before image or video, not both";
              }
              if (item.afterImage && item.afterVideo) {
                return "Choose either an After image or video, not both";
              }
              if (!item.beforeImage && !item.beforeVideo) {
                const hasAfter = item.afterImage || item.afterVideo;
                if (!hasAfter) {
                  return "Upload at least a Before or After image/video";
                }
              }
              return true;
            }),
          preview: {
            select: { title: "label", media: "afterImage" },
          },
        }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Photo Gallery",
      description: "Single completed-job photos — no before/after slider. Just upload a finished detail and (optionally) add a caption.",
      type: "array",
      group: "gallery",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Photo",
              type: "image",
              options: { hotspot: true },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
              description: 'Optional, e.g. "Porsche 911 — Ceramic Coating"',
            }),
            defineField({
              name: "serviceTag",
              title: "Service tag",
              type: "string",
              description: 'Optional, e.g. "Protection Detailing"',
            }),
          ],
          preview: {
            select: { title: "caption", subtitle: "serviceTag", media: "image" },
            prepare: ({ title, subtitle, media }) => ({
              title: title || "Untitled photo",
              subtitle,
              media,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "videos",
      title: "Videos",
      description: "Upload a file or paste a YouTube / Vimeo / TikTok URL.",
      type: "array",
      group: "videos",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "orientation",
              title: "Video orientation",
              type: "string",
              options: {
                list: [
                  { title: "Landscape (16:9)", value: "landscape" },
                  { title: "Portrait (9:16)", value: "portrait" },
                ],
              },
              description: "Choose portrait for phone recordings, landscape for full-width.",
              validation: (r) => r.required(),
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
              description: "YouTube or Vimeo URL. Used when no file is uploaded.",
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
          preview: { select: { title: "title" } },
        }),
      ],
    }),
    defineField({ name: "partnerNote", title: "Partner note", type: "text", rows: 2, group: "footer" }),
    defineField({ name: "ctaHeading", title: "CTA heading", type: "string", group: "footer" }),
    defineField({ name: "ctaBody", title: "CTA body", type: "text", rows: 2, group: "footer" }),
    defineField({ name: "ctaLabel", title: "CTA label", type: "string", group: "footer" }),
  ],
  preview: {
    prepare: () => ({ title: "Detailing Page" }),
  },
});
