import { defineLive } from "next-sanity/live";
import { sanityClient } from "./base-client";

const serverToken =
  process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN || false;

// Do not expose the write token to the browser. If a read token is configured,
// SanityLive can use it for live updates; otherwise draft preview still works
// through server-side draft fetching.
const browserToken = process.env.SANITY_API_READ_TOKEN || false;

export const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient,
  serverToken,
  browserToken,
});
