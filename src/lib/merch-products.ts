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

  // Need an image to render a card; ignore CMS products without one.
  const withImages = (products ?? []).filter((p) => p.image);

  if (withImages.length === 0) {
    return MERCH_ITEMS;
  }

  return withImages.map((p) => ({
    title: p.title,
    category: p.category ?? "",
    detail: p.description ?? "",
    image: p.image as string,
    comingSoon: p.status === "coming-soon",
    tiktokShopUrl: p.tiktokShopUrl || TIKTOK_SHOP_URL,
  }));
}
