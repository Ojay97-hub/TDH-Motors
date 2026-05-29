export type MerchItem = {
  type: "hoodie" | "tshirt" | "cap" | "mug";
  title: string;
  category: string;
  detail: string;
  image: string;
  /** When true, the item isn't yet purchasable — show a "Coming Soon" state. */
  comingSoon: boolean;
  /** Where "Purchase on TikTok Shop" sends the customer. */
  tiktokShopUrl: string;
};

/** TikTok Shop / profile checkout destination. Per-item links can override this. */
export const TIKTOK_SHOP_URL = "https://www.tiktok.com/@thedoghouseas";

/**
 * Shared merch catalogue, used by both the homepage "Upcoming Merch" teaser and
 * the /merch storefront so the content stays in one place.
 */
export const MERCH_ITEMS: MerchItem[] = [
  {
    type: "hoodie",
    title: "TDH Signature Hoodie",
    category: "Heavyweight Fleece",
    detail: "Charcoal pullover with the gold Dog House mark printed oversized across the chest.",
    image: "/hoodie.png",
    comingSoon: true,
    tiktokShopUrl: TIKTOK_SHOP_URL,
  },
  {
    type: "tshirt",
    title: "Dog House Tee",
    category: "Premium Cotton",
    detail: "Clean black tee with the TDH artwork up front and Automotive Solutions branding below.",
    image: "/tshirt.png",
    comingSoon: true,
    tiktokShopUrl: TIKTOK_SHOP_URL,
  },
  {
    type: "cap",
    title: "Workshop Cap",
    category: "Embroidered Peak",
    detail: "Structured six-panel cap with a brushed-gold TDH patch made for show days and handovers.",
    image: "/cap.png",
    comingSoon: true,
    tiktokShopUrl: TIKTOK_SHOP_URL,
  },
  {
    type: "mug",
    title: "Garage Mug",
    category: "Ceramic Mug",
    detail: "TDH-branded mug for workshop brews, handover coffees, and early starts at the showroom.",
    image: "/mug.png",
    comingSoon: true,
    tiktokShopUrl: TIKTOK_SHOP_URL,
  },
];
