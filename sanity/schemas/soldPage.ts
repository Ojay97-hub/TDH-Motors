import { defineType, defineField } from "sanity";
import { SoldCarsListInput } from "../components/SoldCarsList";

export const soldPage = defineType({
  name: "soldPage",
  title: "Recently Sold Page",
  type: "document",
  fields: [
    defineField({
      // Read-only window onto the cars this page is currently showing. The page
      // has no reference list to inspect — it builds itself from every car
      // marked as Sold — so without this there's no way to get from this
      // document to the cars it renders. The stored value is never used; the
      // custom input queries the cars live.
      name: "carsOnThisPage",
      title: "Cars on this page",
      description:
        "Builds itself — mark a car as Sold and it appears here, newest sale first. Click Open to edit one.",
      type: "string",
      readOnly: true,
      components: { input: SoldCarsListInput },
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description: 'e.g. "Through The Door"',
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: 'e.g. "Recently Sold"',
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 3,
      description: "Paragraph shown below the page heading.",
    }),
    defineField({
      name: "showPrices",
      title: "Show the sale price on each car",
      type: "boolean",
      description:
        "Off by default — sold cars show a 'Sold' badge instead of a price. Turn on to display what each car was listed at.",
      initialValue: false,
    }),
    defineField({
      name: "emptyMessage",
      title: "Empty state message",
      type: "string",
      description:
        "Shown when no cars are marked as sold yet.",
    }),
    defineField({
      name: "ctaHeading",
      title: "Bottom CTA heading",
      type: "string",
      description: 'e.g. "Looking for something similar?"',
    }),
    defineField({
      name: "ctaBody",
      title: "Bottom CTA text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ctaLabel",
      title: "Bottom CTA button label",
      type: "string",
    }),
    defineField({
      name: "ctaLink",
      title: "Bottom CTA button link",
      type: "string",
      description: 'e.g. "/contact" or "/services/bespoke-sourcing"',
    }),
  ],
  preview: {
    prepare: () => ({ title: "Recently Sold Page" }),
  },
});
