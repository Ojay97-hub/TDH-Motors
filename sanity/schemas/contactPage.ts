import { defineType, defineField } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sidebar", title: "Visit Us" },
    { name: "settings", title: "Shared Contact Details" },
    { name: "response", title: "Response Time" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "hero",
      description: 'e.g. "Get In Touch"',
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      group: "hero",
      description: 'e.g. "Contact Us"',
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 3,
      group: "hero",
      description: "Paragraph shown below the page heading.",
    }),
    defineField({
      name: "sidebarHeading",
      title: "Sidebar heading",
      type: "string",
      group: "sidebar",
      description:
        'e.g. "Visit Us". Phone, email, address, and hours are edited in Site Settings so the contact page and footer stay in sync.',
    }),
    defineField({
      name: "sharedContactDetails",
      title: "Shared contact details",
      type: "reference",
      group: "settings",
      to: [{ type: "siteSettings" }],
      readOnly: true,
      description:
        "Open Site Settings from here to edit the phone, email, address, and hours used by the contact page and footer.",
    }),
    defineField({
      name: "responseEyebrow",
      title: "Response eyebrow",
      type: "string",
      group: "response",
      description: 'e.g. "Response Time"',
    }),
    defineField({
      name: "responseBody",
      title: "Response body",
      type: "text",
      rows: 3,
      group: "response",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Contact Page" }),
  },
});
