import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool, type StructureBuilder } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

const singletonTypeNames = new Set([
  "siteSettings",
  "homePage",
  "servicesPage",
  "whoWeArePage",
  "detailingPage",
  "curatedSalesPage",
  "bespokeSourcingPage",
  "storagePage",
  "merchPage",
]);

function singletonListItem(S: StructureBuilder, typeName: string, title: string) {
  return S.listItem()
    .title(title)
    .id(typeName)
    .child(
      S.document()
        .id(typeName)
        .schemaType(typeName)
        .documentId(typeName),
    );
}

const previewOrigin =
  process.env.SANITY_STUDIO_PREVIEW_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";
const draftMode = {
  enable: `${previewOrigin}/api/draft-mode/enable`,
  disable: `${previewOrigin}/api/draft-mode/disable`,
  shareAccess: true,
};

const pageLocations = {
  homePage: { title: "Home", href: "/" },
  servicesPage: { title: "Services", href: "/services" },
  whoWeArePage: { title: "Who We Are", href: "/who-we-are" },
  detailingPage: { title: "Detailing", href: "/services/detailing" },
  curatedSalesPage: { title: "Curated Sales", href: "/services/curated-sales" },
  bespokeSourcingPage: { title: "Bespoke Sourcing", href: "/services/bespoke-sourcing" },
  storagePage: { title: "Storage", href: "/services/storage" },
  merchPage: { title: "Merch", href: "/merch" },
  siteSettings: { title: "Home", href: "/" },
} as const;

export default defineConfig({
  name: "tdh-motors",
  title: "TDH Motors",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "sk5os0jg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  basePath: "/studio",
  schema: { types: schemaTypes },
  plugins: [
    presentationTool({
      previewUrl: {
        initial: previewOrigin,
        origin: previewOrigin,
        preview: "/",
        previewMode: draftMode,
      },
      allowOrigins: [previewOrigin],
      resolve: {
        mainDocuments: [
          { route: "/", type: "homePage" },
          { route: "/services", type: "servicesPage" },
          { route: "/who-we-are", type: "whoWeArePage" },
          { route: "/services/detailing", type: "detailingPage" },
          { route: "/services/curated-sales", type: "curatedSalesPage" },
          { route: "/services/bespoke-sourcing", type: "bespokeSourcingPage" },
          { route: "/services/storage", type: "storagePage" },
          { route: "/merch", type: "merchPage" },
          {
            route: "/inventory/:slug",
            filter: `_type == "car" && slug.current == $slug`,
            params: ({ params }) => ({ slug: params.slug }),
          },
        ],
        locations: {
          ...Object.fromEntries(
            Object.entries(pageLocations).map(([type, location]) => [
              type,
              {
                locations: [
                  {
                    title: location.title,
                    href: location.href,
                  },
                ],
              },
            ]),
          ),
          car: {
            select: { title: "model", slug: "slug.current" },
            resolve: (value) =>
              value?.slug
                ? {
                    locations: [
                      {
                        title: value.title || "Inventory item",
                        href: `/inventory/${value.slug}`,
                      },
                    ],
                  }
                : null,
          },
          merchProduct: {
            locations: [{ title: "Merch", href: "/merch" }],
          },
        },
      },
    }),
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            singletonListItem(S, "siteSettings", "Site Settings"),
            S.divider(),
            singletonListItem(S, "homePage", "Home Page"),
            singletonListItem(S, "servicesPage", "Services Page"),
            singletonListItem(S, "whoWeArePage", "Who We Are"),
            singletonListItem(S, "detailingPage", "Detailing Page"),
            singletonListItem(S, "curatedSalesPage", "Curated Sales Page"),
            singletonListItem(S, "bespokeSourcingPage", "Bespoke Sourcing Page"),
            singletonListItem(S, "storagePage", "Storage Page"),
            singletonListItem(S, "merchPage", "Merch Page"),
            S.divider(),
            // All non-singleton document types (e.g. Cars)
            ...S.documentTypeListItems().filter(
              (item) => !singletonTypeNames.has(item.getId() ?? ""),
            ),
          ]),
    }),
    visionTool({ defaultApiVersion: "2025-05-20" }),
  ],
});
