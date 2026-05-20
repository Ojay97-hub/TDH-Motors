import { defineConfig } from "sanity";
import { structureTool, type StructureBuilder } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

const singletonTypeNames = new Set([
  "siteSettings",
  "homePage",
  "servicesPage",
  "whoWeArePage",
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

export default defineConfig({
  name: "tdh-motors",
  title: "TDH Motors",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "sk5os0jg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  basePath: "/studio",
  schema: { types: schemaTypes },
  plugins: [
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
