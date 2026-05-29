import { createClient, type FilteredResponseQueryOptions } from "next-sanity";
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

const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 150;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Wraps sanityClient.fetch so a CMS/network failure (e.g. the machine can't
 * reach Sanity — `connect EACCES`, DNS issues, an outage) degrades gracefully
 * instead of throwing and crashing the whole route.
 *
 * Transient failures (intermittent connection drops from local security
 * software / VPNs are common on Windows) are retried with a short backoff
 * before giving up; only after all attempts fail do we fall back to `fallback`
 * so pages keep rendering their static content.
 */
// Defaults to `any` to mirror sanityClient.fetch's untyped return, so callers
// that don't pass a type behave exactly as they did before.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function safeSanityFetch<T = any>(
  query: string,
  params: Record<string, unknown> = {},
  options?: FilteredResponseQueryOptions,
  fallback: T | null = null,
): Promise<T | null> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await sanityClient.fetch<T>(query, params, options);
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_ATTEMPTS) {
        await sleep(RETRY_BASE_DELAY_MS * attempt);
      }
    }
  }
  console.error(
    `[sanity] fetch failed after ${MAX_ATTEMPTS} attempts, falling back to default content:`,
    lastErr instanceof Error ? lastErr.message : lastErr,
  );
  return fallback;
}
