import { defineLive } from "next-sanity/live";
import { sanityClient } from "./base-client";

// Server-only token used by `sanityFetch` when draft mode is on. Reading drafts
// requires draft/private grants, which our SANITY_API_READ_TOKEN lacks (it's
// published-only), so prefer the write token here — otherwise draft preview
// silently renders published content. This never reaches the browser.
const serverToken =
  process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN || false;

// Do not expose the write token to the browser. The read token can drive live
// updates for published content; draft content is fetched server-side via
// serverToken above, so this stays a read-only (or no) token.
const browserToken = process.env.SANITY_API_READ_TOKEN || false;

export const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient,
  serverToken,
  browserToken,
});
