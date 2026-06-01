import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityClient } from "@/sanity/base-client";

const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  throw new Error("Missing SANITY_API_READ_TOKEN or SANITY_API_WRITE_TOKEN for draft preview.");
}

export const { GET } = defineEnableDraftMode({
  client: sanityClient.withConfig({ token }),
});
