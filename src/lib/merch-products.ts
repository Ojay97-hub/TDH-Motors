import { safeSanityFetch } from "@/sanity/client";
import { merchProductsQuery } from "@/sanity/queries";
import { MERCH_ITEMS, TIKTOK_SHOP_URL, type MerchItem } from "@/lib/merch";

type MerchProductRaw = {
  _id: string;
  title: string;
  category?: string;
  description?: string;
  priceLabel?: string;
  tiktokShopUrl?: string;
  status?: "available" | "coming-soon" | "hidden";
  image?: string;
};

/**
 * Loads the merch catalogue from Sanity (used by both the /merch storefront and
 * the homepage teaser). Falls back to the bundled MERCH_ITEMS when no CMS
 * products exist yet, so the store is never empty during/after migration.
 */
export async function getMerchItems(): Promise<MerchItem[]> {
  const products = await safeSanityFetch<MerchProductRaw[]>(
    merchProductsQuery,
    {},
    { next: { revalidate: 60, tags: ["merchProduct"] } },
    [],
  );

  // Defensively drop hidden products even if the query filter ever changes,
  // so an unpublished/hidden item can never leak into the storefront.
  const visible = (products ?? []).filter((p) => p.status !== "hidden");

  // No CMS catalogue yet -> use the bundled defaults so the store isn't empty.
  if (visible.length === 0) {
    return MERCH_ITEMS;
  }

  // A card needs an image to render; skip any visible product without one.
  return visible
    .filter((p) => p.image)
    .map((p) => ({
    title: p.title,
    category: p.category ?? "",
    detail: p.description ?? "",
    image: p.image as string,
    comingSoon: p.status === "coming-soon",
    tiktokShopUrl: p.tiktokShopUrl || TIKTOK_SHOP_URL,
  }));
}
