import { defineType, defineField, defineArrayMember } from "sanity";

export const detailingPage = defineType({
  name: "detailingPage",
  title: "Detailing Page",
  type: "document",
  groups: [
    { name: "beforeAfter", title: "Before & After", default: true },
    { name: "videos", title: "Videos" },
  ],
  fields: [
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
          validation: (r) => [
            r.custom((obj) => {
              if (!obj?.afterImage && !obj?.afterVideo) {
                return "Upload either an After image or After video";
              }
              if (obj?.beforeImage && obj?.beforeVideo) {
                return "Choose either a Before image or video, not both";
              }
              if (obj?.afterImage && obj?.afterVideo) {
                return "Choose either an After image or video, not both";
              }
              if (!obj?.beforeImage && !obj?.beforeVideo) {
                const hasAfter = obj?.afterImage || obj?.afterVideo;
                if (!hasAfter) {
                  return "Upload at least a Before or After image/video";
                }
              }
              return true;
            }),
          ],
          preview: {
            select: { title: "label", media: "afterImage" },
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
          validation: (r) => [
            r.custom((obj) => {
              if (!obj?.videoFile && !obj?.videoUrl) {
                return "Upload a video file or paste an external URL";
              }
              return true;
            }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Detailing Page" }),
  },
});
