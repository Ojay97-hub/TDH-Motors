import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "phone",
      title: "Phone number",
      type: "string",
      description: 'e.g. "+44 (0) 1000 000 000"',
    }),
    defineField({
      name: "email",
      title: "Email address",
      type: "string",
      description: 'e.g. "hello@tdhmotors.co.uk"',
    }),
    defineField({
      name: "addressLine1",
      title: "Address line 1",
      type: "string",
      description: 'Shown in footer + contact sidebar, e.g. "Aylesbury, Buckinghamshire"',
    }),
    defineField({
      name: "addressLine2",
      title: "Address line 2",
      type: "string",
      description: 'e.g. "Exact address shared on booking"',
    }),
    defineField({
      name: "mapPlusCode",
      title: "Map plus code / short address",
      type: "string",
      description: 'Shown in the homepage map pin, e.g. "P5WG+RV Aylesbury"',
    }),
    defineField({
      name: "mapRegion",
      title: "Map region line",
      type: "string",
      description: 'Second line under plus code, e.g. "Buckinghamshire, UK"',
    }),
    defineField({
      name: "hoursLabel",
      title: "Opening hours label",
      type: "string",
      description: 'e.g. "Monday – Saturday"',
    }),
    defineField({
      name: "hoursDetail",
      title: "Opening hours detail",
      type: "string",
      description: 'e.g. "09:00 – 17:00 (by appointment)"',
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Google Maps embed URL",
      type: "url",
      description: "Full embed URL from Google Maps → Share → Embed a map",
    }),
    defineField({
      name: "mapDirectionsUrl",
      title: "Google Maps directions URL",
      type: "url",
      description: "URL opened when visitor clicks Get Directions",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
