import { defineConfig } from "sanity";
import { presentationTool, type PreviewUrlResolverOptions } from "sanity/presentation";
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
  "contactPage",
  "inventoryPage",
  "soldPage",
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

// Cars get their own folder split by lifecycle so "what's in stock" and "what
// we've sold" are two separate lists — marking a car sold visibly moves it from
// one to the other, which is exactly what the public pages do.
function carsListItem(S: StructureBuilder) {
  return S.listItem()
    .title("Cars")
    .id("cars")
    .child(
      S.list()
        .title("Cars")
        .items([
          S.listItem()
            .title("In stock")
            .id("carsInStock")
            .child(
              S.documentTypeList("car")
                .title("In stock")
                .filter('_type == "car" && status != "sold"')
                .defaultOrdering([{ field: "year", direction: "desc" }]),
            ),
          S.listItem()
            .title("Sold")
            .id("carsSold")
            .child(
              S.documentTypeList("car")
                .title("Sold")
                .filter('_type == "car" && status == "sold"')
                .defaultOrdering([{ field: "soldDate", direction: "desc" }]),
            ),
          S.divider(),
          S.listItem()
            .title("All cars")
            .id("carsAll")
            .child(S.documentTypeList("car").title("All cars")),
        ]),
    );
}

function normalizePreviewOrigin(value?: string) {
  return value?.trim().replace(/\/+$/, "") || "";
}

function requiredEnv(name: string, value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`Missing required environment variable ${name}.`);
  }
  return trimmed;
}

const isProduction = process.env.NODE_ENV === "production";

// projectId/dataset must resolve in BOTH bundlers:
//  - Next.js (the embedded /studio route) exposes NEXT_PUBLIC_* vars.
//  - The Sanity CLI (`sanity deploy` → tdh-motors.sanity.studio) ONLY bakes in
//    vars prefixed SANITY_STUDIO_; it ignores NEXT_PUBLIC_*. Without a source it
//    can see, the hosted studio throws "Missing required environment variable".
// Neither value is secret (the projectId is shipped to the browser regardless),
// so a hardcoded fallback is safe and keeps the hosted studio working even if no
// env var is set. Use literal static member access so Vite can replace it.
const projectId = requiredEnv(
  "SANITY_STUDIO_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_PROJECT_ID",
  process.env.SANITY_STUDIO_SANITY_PROJECT_ID ??
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
    "sk5os0jg",
);
const dataset = requiredEnv(
  "SANITY_STUDIO_SANITY_DATASET / NEXT_PUBLIC_SANITY_DATASET",
  process.env.SANITY_STUDIO_SANITY_DATASET ??
    process.env.NEXT_PUBLIC_SANITY_DATASET ??
    "production",
);

// The site Presentation previews in its iframe. Each bundler only ever sees one
// of these vars (the Sanity CLI bakes in SANITY_STUDIO_*, Next.js bakes in
// NEXT_PUBLIC_*), and both may be unset — hence the empty fallback, which makes
// `initial` below default to the studio's own location.origin. Never hardcode a
// dev port here: `next dev` falls back to 3001+ whenever 3000 is taken, and a
// stale localhost:3000 silently previews whatever *other* app claimed that port.
// That app doesn't load @sanity/visual-editing, so Presentation just sits there
// until it times out with "Unable to connect to visual editing".
const previewOrigin = normalizePreviewOrigin(
  process.env.SANITY_STUDIO_PREVIEW_URL ||
    process.env.NEXT_PUBLIC_SITE_URL,
);

const previewUrl: PreviewUrlResolverOptions = {
  // Left undefined when no env var is set, so Presentation defaults to the
  // studio's own location.origin — correct for the embedded /studio route on
  // any port and in every deployed environment. (`origin`/`preview` are
  // deprecated in favour of this single `initial` URL.)
  initial: previewOrigin || undefined,
  // Derive the draft-mode routes from the origin actually being previewed
  // rather than from a build-time constant, so they can never point at a
  // different host than the iframe itself.
  previewMode: ({ targetOrigin }) => ({
    enable: `${targetOrigin}/api/draft-mode/enable`,
    disable: `${targetOrigin}/api/draft-mode/disable`,
    shareAccess: true,
  }),
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
  contactPage: { title: "Contact", href: "/contact" },
  inventoryPage: { title: "Inventory", href: "/inventory" },
  soldPage: { title: "Recently Sold", href: "/recently-sold" },
  siteSettings: { title: "Home", href: "/" },
} as const;

export default defineConfig({
  name: "tdh-motors",
  title: "TDH Motors",
  projectId,
  dataset,
  basePath: "/studio",
  schema: { types: schemaTypes },
  plugins: [
    presentationTool({
      previewUrl,
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
          { route: "/contact", filter: `_id == "contactPage"` },
          { route: "/inventory", filter: `_id == "inventoryPage"` },
          { route: "/recently-sold", filter: `_id == "soldPage"` },
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
          siteSettings: {
            locations: [
              { title: "Home", href: "/" },
              { title: "Contact", href: "/contact" },
            ],
          },
          car: {
            select: { title: "model", slug: "slug.current", status: "status" },
            resolve: (value) =>
              value?.slug
                ? {
                    locations: [
                      {
                        title: value.title || "Inventory item",
                        href: `/inventory/${value.slug}`,
                      },
                      // A sold car drops off /inventory and shows up on the
                      // showcase instead, so point the editor at the list it
                      // actually appears in.
                      value.status === "sold"
                        ? { title: "Recently Sold", href: "/recently-sold" }
                        : { title: "Inventory", href: "/inventory" },
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
            singletonListItem(S, "contactPage", "Contact Page"),
            singletonListItem(S, "inventoryPage", "Inventory Page"),
            singletonListItem(S, "soldPage", "Recently Sold Page"),
            S.divider(),
            carsListItem(S),
            // Every other non-singleton document type (e.g. Merch Products)
            ...S.documentTypeListItems().filter((item) => {
              const id = item.getId() ?? "";
              return id !== "car" && !singletonTypeNames.has(id);
            }),
          ]),
    }),
    ...(isProduction ? [] : [visionTool({ defaultApiVersion: "2025-05-20" })]),
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
