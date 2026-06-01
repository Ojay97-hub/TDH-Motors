import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // Next.js' Data Cache + `revalidate`/`tags` already control freshness, so the
  // extra Sanity CDN layer only adds staleness (published edits can lag behind).
  // Turning it off means revalidation always pulls the live published content.
  useCdn: false,
});
