import { defineType, defineField, defineArrayMember } from "sanity";
import { ctaLinkField } from "./_ctaLink";

export const detailingPage = defineType({
  name: "detailingPage",
  title: "Detailing Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "packages", title: "Packages" },
    { name: "services", title: "Services" },
    { name: "beforeAfter", title: "Before & After" },
    { name: "gallery", title: "Photo Gallery" },
    { name: "videos", title: "Videos" },
    { name: "social", title: "Social Feed" },
    { name: "footer", title: "Footer CTA" },
  ],
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "hero" }),
    defineField({ name: "heading", title: "Heading", type: "string", group: "hero" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 4, group: "hero" }),
    defineField({ name: "pricingBody", title: "Pricing body", type: "text", rows: 3, group: "hero" }),
    defineField({ name: "packagesEyebrow", title: "Packages eyebrow", type: "string", group: "packages" }),
    defineField({ name: "packagesHeading", title: "Packages heading", type: "string", group: "packages" }),
    defineField({ name: "packagesIntro", title: "Packages intro", type: "text", rows: 3, group: "packages" }),
    defineField({
      name: "packages",
      title: "Packages",
      description:
        "Tiered packages shown as a row of cards, cheapest first. Leave empty to hide the whole section. Confirm every price and duration with the detailing team before publishing.",
      type: "array",
      group: "packages",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Package name",
              type: "string",
              description: 'e.g. "Silver" or "Essential Detail"',
              validation: (r) => r.required(),
            }),
            defineField({
              name: "slug",
              title: "Slug",
              type: "slug",
              description: "Used for the package's own page, e.g. /services/detailing/packages/silver",
              options: { source: "name", maxLength: 60 },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "tier",
              title: "Tier label",
              type: "string",
              description: 'Small text above the name, e.g. "Tier One" or "Entry".',
            }),
            defineField({
              name: "image",
              title: "Package photo",
              type: "image",
              options: { hotspot: true },
              description: "A car that shows off this level of detail. Landscape crops work best.",
            }),
            defineField({ name: "tagline", title: "Tagline", type: "text", rows: 2 }),
            defineField({
              name: "price",
              title: "Price",
              type: "string",
              description: 'e.g. "From £200" or "POA"',
              validation: (r) => r.required(),
            }),
            defineField({
              name: "priceNote",
              title: "Price note",
              type: "string",
              description: 'Small text next to the price, e.g. "per vehicle".',
            }),
            defineField({
              name: "duration",
              title: "Duration",
              type: "string",
              description: 'e.g. "2 hr 30 min"',
            }),
            defineField({
              name: "includes",
              title: "What's included",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({
              name: "featured",
              title: "Highlight this package",
              type: "boolean",
              description: "Lifts the card and adds a badge. Use on one package only.",
              initialValue: false,
            }),
            defineField({
              name: "badgeLabel",
              title: "Badge label",
              type: "string",
              description: 'Shown when highlighted. Defaults to "Most Popular".',
              hidden: ({ parent }) => !parent?.featured,
            }),
            defineField({ name: "ctaLabel", title: "Button label", type: "string" }),
            ctaLinkField({
              name: "ctaLink",
              title: "Button link",
              description: "Where the package button goes. Defaults to /contact.",
            }),
            defineField({
              name: "longDescription",
              title: "Full description",
              type: "text",
              rows: 6,
              description:
                'Shown on the package\'s own page. Adding this (or the breakdown below) is what makes the "Read More" link appear on the card.',
            }),
            defineField({
              name: "detailSections",
              title: "Detailed breakdown",
              description: 'Grouped lists on the package page, e.g. "Exterior" and "Interior".',
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({
                      name: "title",
                      title: "Section title",
                      type: "string",
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: "items",
                      title: "Items",
                      type: "array",
                      of: [defineArrayMember({ type: "string" })],
                    }),
                  ],
                  preview: {
                    select: { title: "title", items: "items" },
                    prepare: ({ title, items }) => ({
                      title,
                      subtitle: `${items?.length ?? 0} item${items?.length === 1 ? "" : "s"}`,
                    }),
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "name", price: "price", duration: "duration", featured: "featured", media: "image" },
            prepare: ({ title, price, duration, featured, media }) => ({
              title: featured ? `★ ${title}` : title,
              subtitle: [price, duration].filter(Boolean).join(" · "),
              media,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "packagesNote",
      title: "Packages footnote",
      type: "text",
      rows: 2,
      group: "packages",
      description: "Small print under the cards, e.g. how size and condition affect the final price.",
    }),
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
    defineField({ name: "socialEyebrow", title: "Social eyebrow", type: "string", group: "social" }),
    defineField({ name: "socialHeading", title: "Social heading", type: "string", group: "social" }),
    defineField({ name: "socialIntro", title: "Social intro", type: "text", rows: 3, group: "social" }),
    defineField({
      name: "socialHandles",
      title: "Follow buttons",
      description: "Shown above the grid. Usually Instagram and TikTok.",
      type: "array",
      group: "social",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "Instagram" },
                  { title: "TikTok", value: "TikTok" },
                  { title: "Facebook", value: "Facebook" },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "handle",
              title: "Handle",
              type: "string",
              description: 'e.g. "@thedoghouse_as"',
            }),
            ctaLinkField({ name: "url", title: "Profile URL", description: "Full link to the profile." }),
          ],
          preview: { select: { title: "platform", subtitle: "handle" } },
        }),
      ],
    }),
    defineField({
      name: "socialFeed",
      title: "Social posts",
      description:
        "Square tiles of recent social content. Upload the photo (or a short clip) and paste the link to the real post — each tile opens that post. Leave empty to hide the section.",
      type: "array",
      group: "social",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "Instagram" },
                  { title: "TikTok", value: "TikTok" },
                  { title: "Facebook", value: "Facebook" },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "image",
              title: "Photo",
              type: "image",
              options: { hotspot: true },
              description: "Square crops look best. Use this OR a video clip below.",
            }),
            defineField({
              name: "videoFile",
              title: "Video clip",
              type: "file",
              options: { accept: "video/*" },
              description: "Short MP4. Only used when no photo is uploaded.",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
              description: "Optional — appears on hover.",
            }),
            ctaLinkField({
              name: "postUrl",
              title: "Link to post",
              description: "The Instagram / TikTok / Facebook post this tile opens.",
            }),
          ],
          validation: (rule) =>
            rule.custom((obj) => {
              const item = obj as { image?: unknown; videoFile?: unknown } | undefined;
              if (!item?.image && !item?.videoFile) {
                return "Upload a photo or a video clip";
              }
              return true;
            }),
          preview: {
            select: { title: "caption", subtitle: "platform", media: "image" },
            prepare: ({ title, subtitle, media }) => ({
              title: title || "Untitled post",
              subtitle,
              media,
            }),
          },
        }),
      ],
    }),
    defineField({ name: "socialCtaLabel", title: "Social CTA label", type: "string", group: "social" }),
    ctaLinkField({
      name: "socialCtaLink",
      title: "Social CTA link",
      group: "social",
      description: "Where the button under the grid goes — usually the Instagram or TikTok profile.",
    }),
    defineField({ name: "partnerNote", title: "Partner note", type: "text", rows: 2, group: "footer" }),
    defineField({ name: "ctaHeading", title: "CTA heading", type: "string", group: "footer" }),
    defineField({ name: "ctaBody", title: "CTA body", type: "text", rows: 2, group: "footer" }),
    defineField({ name: "ctaLabel", title: "CTA label", type: "string", group: "footer" }),
    ctaLinkField({ name: "ctaLink", title: "CTA link", group: "footer", description: "Where the CTA button goes. Defaults to /contact." }),
  ],
  preview: {
    prepare: () => ({ title: "Detailing Page" }),
  },
});
