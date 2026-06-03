import { safeSanityFetch } from "@/sanity/client";
import { merchProductsQuery } from "@/sanity/queries";
import { MERCH_ITEMS, TIKTOK_SHOP_URL, type MerchItem } from "@/lib/merch";

export type MerchProductRaw = {
  _id?: string | null;
  title?: string | null;
  category?: string | null;
  description?: string | null;
  priceLabel?: string | null;
  tiktokShopUrl?: string | null;
  status?: "available" | "coming-soon" | "hidden" | null;
  image?: string | null;
};

function stringOr(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function hasUsableTitleAndImage(
  product: MerchProductRaw | null | undefined,
): product is MerchProductRaw & { title: string; image: string } {
  return Boolean(stringOr(product?.title) && stringOr(product?.image));
}

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
    .filter(hasUsableTitleAndImage)
    .filter((p) => p.status !== "hidden")
    .map((p) => ({
      title: stringOr(p.title),
      category: stringOr(p.category),
      detail: stringOr(p.description),
      image: stringOr(p.image),
      comingSoon: p.status === "coming-soon",
      tiktokShopUrl: stringOr(p.tiktokShopUrl, TIKTOK_SHOP_URL),
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
