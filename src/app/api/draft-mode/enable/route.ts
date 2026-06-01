import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityClient } from "@/sanity/base-client";

// Presentation stores its preview secret as a *draft* `sanity.previewUrlSecret`
// document. Validating it here means reading drafts, so this token needs
// draft/private read access. Our SANITY_API_READ_TOKEN is published-only and
// can't see those secrets (every lookup misses -> "Invalid secret" / 401), so
// prefer the write token, which has the required grants. This route is
// server-only and never exposed to the client.
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!token) {
  throw new Error("Missing SANITY_API_WRITE_TOKEN or SANITY_API_READ_TOKEN for draft preview.");
}

export const { GET } = defineEnableDraftMode({
  client: sanityClient.withConfig({ token }),
});
