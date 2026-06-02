import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool, type StructureBuilder } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { InventoryNavigator } from "./sanity/presentation/InventoryNavigator";
import { ViewDetailPageAction } from "./sanity/presentation/viewDetailPageAction";

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
          // Pin each singleton route to its fixed document id so Presentation
          // always resolves the one canonical singleton, never a stray copy.
          { route: "/", filter: `_id == "homePage"` },
          { route: "/services", filter: `_id == "servicesPage"` },
          { route: "/who-we-are", filter: `_id == "whoWeArePage"` },
          { route: "/services/detailing", filter: `_id == "detailingPage"` },
          { route: "/services/curated-sales", filter: `_id == "curatedSalesPage"` },
          { route: "/services/bespoke-sourcing", filter: `_id == "bespokeSourcingPage"` },
          { route: "/services/storage", filter: `_id == "storagePage"` },
          { route: "/merch", filter: `_id == "merchPage"` },
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
      components: {
        unstable_navigator: {
          minWidth: 280,
          maxWidth: 420,
          component: InventoryNavigator,
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
  document: {
    // Singletons must never be duplicated: a second copy of a singleton type
    // breaks resolution (the site/Presentation can pick the wrong/empty one).
    // Hide singleton types from the global "Create" menu...
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((template) => !singletonTypeNames.has(template.templateId))
        : prev,
    // ...and drop the duplicate/delete/unpublish actions on singleton docs.
    actions: (prev, { schemaType }) => {
      if (singletonTypeNames.has(schemaType)) {
        return prev.filter(
          ({ action }) =>
            action !== "duplicate" && action !== "delete" && action !== "unpublish",
        );
      }
      // Add a "View detail page" action to cars (shows only in Presentation).
      if (schemaType === "car") {
        return [...prev, ViewDetailPageAction];
      }
      return prev;
    },
  },
});
