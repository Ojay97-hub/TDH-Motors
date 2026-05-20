import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "tdh-motors",
  title: "TDH Motors",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "sk5os0jg",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  basePath: "/studio",
  schema: { types: schemaTypes },
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: "2025-05-20" }),
  ],
});
