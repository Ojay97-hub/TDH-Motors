import { safeSanityFetch } from "@/sanity/client";
import { merchProductsQuery } from "@/sanity/queries";
import { MERCH_ITEMS, TIKTOK_SHOP_URL, type MerchItem } from "@/lib/merch";

export type MerchProductRaw = {
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
 * Maps raw CMS merch products into the `MerchItem` shape the cards render.
 * Drops hidden products and any without an image. Shared by the `/merch`
 * storefront loader and the homepage's curated `homepageMerch` list so both
 * apply identical filtering.
 */
export function toMerchItems(
  products: Array<MerchProductRaw | null | undefined> | null | undefined,
): MerchItem[] {
  return (products ?? [])
    // Resolved references can be null (target missing/unpublished); drop them.
    .filter((p): p is MerchProductRaw => Boolean(p))
    .filter((p) => p.status !== "hidden")
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

  const items = toMerchItems(products);

  // No usable CMS catalogue yet -> use the bundled defaults so the store isn't empty.
  return items.length > 0 ? items : MERCH_ITEMS;
}
