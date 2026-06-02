import { defineType, defineField, defineArrayMember } from "sanity";
import { ctaLinkField } from "./_ctaLink";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "about", title: "About Section" },
    { name: "servicesStrip", title: "Services Strip" },
    { name: "featuredCars", title: "Featured Cars" },
    { name: "merch", title: "Merch Section" },
    { name: "merchItems", title: "Merch Items" },
    { name: "social", title: "Social Section" },
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
    defineField({ name: "heroPrimaryCtaLabel", title: "Hero primary button — label", type: "string", group: "hero", description: 'e.g. "Browse Inventory". Defaults to "Browse Inventory".' }),
    ctaLinkField({ name: "heroPrimaryCtaLink", title: "Hero primary button — link", group: "hero", description: 'Where the primary hero button goes. Defaults to /inventory.' }),
    defineField({ name: "heroSecondaryCtaLabel", title: "Hero secondary button — label", type: "string", group: "hero", description: 'e.g. "Book a Viewing". Defaults to "Book a Viewing".' }),
    ctaLinkField({ name: "heroSecondaryCtaLink", title: "Hero secondary button — link", group: "hero", description: 'Where the secondary hero button goes. Defaults to /contact.' }),

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

    // Featured Cars (curated for the homepage)
    defineField({
      name: "featuredCars",
      title: "Featured cars",
      description:
        "Cars shown in the “Featured Cars” section on the homepage, in this order. Only cars that also have the “Featured on homepage” checkbox ticked will appear — un-ticking a car removes it from the homepage even if it’s still listed here. Leave empty to fall back to every car with the checkbox ticked.",
      type: "array",
      group: "featuredCars",
      of: [defineArrayMember({ type: "reference", to: [{ type: "car" }] })],
      validation: (r) => r.max(6).unique(),
    }),

    // The dark "Coming Soon" teaser shown at the end of the Featured Cars row.
    // It isn't a real car, so it's edited here on the Home Page.
    defineField({
      name: "comingSoonCard",
      title: "“Coming Soon” card",
      description:
        "The dark teaser card shown after the featured cars. Turn it off once you have enough real cars to fill the row.",
      type: "object",
      group: "featuredCars",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "show", title: "Show this card", type: "boolean", initialValue: true }),
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string", description: 'e.g. "New Arrival"' }),
        defineField({ name: "heading", title: "Heading", type: "string", description: 'e.g. "Details Coming Soon"' }),
        defineField({ name: "subtext", title: "Subtext", type: "string", description: 'e.g. "Stay tuned for our next listing"' }),
        defineField({ name: "priceLabel", title: "Price label", type: "string", description: 'e.g. "TBC"' }),
        defineField({ name: "mileageLabel", title: "Mileage label", type: "string", description: 'e.g. "TBC"' }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          description: "Optional. Defaults to the TDH “Coming Soon” graphic.",
        }),
      ],
      preview: {
        select: { title: "heading", subtitle: "show" },
        prepare: ({ title, subtitle }) => ({
          title: title || "Details Coming Soon",
          subtitle: subtitle === false ? "Hidden" : "Visible",
        }),
      },
    }),

    defineField({ name: "merchEyebrow", title: "Merch eyebrow", type: "string", group: "merch" }),
    defineField({ name: "merchHeading", title: "Merch heading", type: "string", group: "merch" }),
    defineField({ name: "merchBody", title: "Merch body", type: "text", rows: 3, group: "merch" }),
    defineField({ name: "merchPrimaryCta", title: "Merch primary CTA — label", type: "string", group: "merch" }),
    ctaLinkField({ name: "merchPrimaryCtaLink", title: "Merch primary CTA — link", group: "merch", description: 'Where the primary button goes. Defaults to /merch.' }),
    defineField({ name: "merchSecondaryCta", title: "Merch secondary CTA — label", type: "string", group: "merch" }),
    ctaLinkField({ name: "merchSecondaryCtaLink", title: "Merch secondary CTA — link", group: "merch", description: 'Where the secondary button goes. Defaults to the TikTok page.' }),

    // Merch items (curated for the homepage)
    defineField({
      name: "homepageMerch",
      title: "Merch items",
      description:
        "Products shown in the “Upcoming Merch” section on the homepage, in this order. Remove one here to drop it from the homepage without deleting the product. Leave empty to show all visible products.",
      type: "array",
      group: "merchItems",
      of: [defineArrayMember({ type: "reference", to: [{ type: "merchProduct" }] })],
      validation: (r) => r.max(8).unique(),
    }),

    defineField({ name: "socialEyebrow", title: "Social eyebrow", type: "string", group: "social" }),
    defineField({ name: "socialHeading", title: "Social heading", type: "string", group: "social" }),
    defineField({ name: "socialBody", title: "Social body", type: "text", rows: 2, group: "social" }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      group: "social",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "platform", title: "Platform", type: "string", validation: (r) => r.required() }),
            defineField({ name: "label", title: "Displayed handle/name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "url", title: "URL", type: "url", validation: (r) => r.required() }),
            defineField({ name: "ctaLabel", title: "CTA label", type: "string" }),
          ],
          preview: { select: { title: "platform", subtitle: "label" } },
        }),
      ],
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
    defineField({ name: "ctaButtonLabel", title: "CTA button — label", type: "string", group: "cta", description: 'e.g. "Book a Viewing". Also used by the "Find Us" button. Defaults to "Book a Viewing".' }),
    ctaLinkField({ name: "ctaButtonLink", title: "CTA button — link", group: "cta", description: 'Where the CTA / Find Us button goes. Defaults to /contact.' }),

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
