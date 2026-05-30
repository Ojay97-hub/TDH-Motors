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
      name: "mapRegion",
      title: "General area",
      type: "string",
      description:
        'General location shown on the homepage map (the exact address is never published — it is shared on enquiry). e.g. "The Chilterns, Buckinghamshire"',
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
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
