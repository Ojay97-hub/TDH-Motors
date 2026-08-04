/**
 * Canonical social accounts. Every social link on the site should come from
 * here so changing an account is a one-line edit rather than a hunt through
 * the footer, homepage, detailing page and floating rail.
 */
export type SocialAccount = {
  platform: "Instagram" | "TikTok" | "Facebook";
  handle: string;
  label: string;
  url: string;
};

export const SOCIAL_ACCOUNTS: SocialAccount[] = [
  {
    platform: "Instagram",
    handle: "@thedoghouse_as",
    label: "@thedoghouse_as",
    url: "https://www.instagram.com/thedoghouse_as",
  },
  {
    platform: "TikTok",
    handle: "@thedoghouseas",
    label: "@thedoghouseas",
    url: "https://www.tiktok.com/@thedoghouseas",
  },
  {
    platform: "Facebook",
    handle: "The Dog House AS",
    label: "The Dog House AS",
    url: "https://www.facebook.com/profile.php?id=61584858144187",
  },
];

export const INSTAGRAM_URL = SOCIAL_ACCOUNTS[0].url;
export const TIKTOK_URL = SOCIAL_ACCOUNTS[1].url;
