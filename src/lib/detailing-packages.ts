export type PackageDetailSection = {
  title?: string;
  items?: string[];
};

export type DetailingPackage = {
  name?: string;
  slug?: string;
  tier?: string;
  tagline?: string;
  duration?: string;
  price?: string;
  priceNote?: string;
  includes?: string[];
  featured?: boolean;
  badgeLabel?: string;
  ctaLabel?: string;
  ctaLink?: string;
  image?: string;
  longDescription?: string;
  detailSections?: PackageDetailSection[];
};

// ⚠️ PLACEHOLDER PRICING — the tier names, prices and durations below are a
// starting structure only and have NOT been confirmed by the detailing team.
// They exist so the section renders before the CMS is populated; the real
// figures should be entered in Sanity (Detailing Page → Packages), which
// overrides everything here.
export const DEFAULT_DETAILING_PACKAGES: DetailingPackage[] = [
  {
    slug: "silver",
    tier: "Tier One",
    name: "Silver",
    tagline: "A thorough interior and exterior clean to refresh and maintain a pristine appearance.",
    price: "From £200",
    duration: "Approx. 3 hours",
    includes: [
      "Wheel, arch and tyre deep clean",
      "Snow foam pre-wash and two-bucket wash",
      "Contactless dry and detail spray",
      "Full interior vacuum and wipe-down",
      "Glass cleaned inside and out, streak-free",
      "Tyre dressing and trim finish",
    ],
    ctaLabel: "Book Silver",
    ctaLink: "/contact",
    longDescription:
      "Our entry-level detail is built around doing the basics properly. Every stage uses pH-neutral products and a scratch-avoiding wash method, so the car comes back genuinely clean without picking up the swirl marks a quick supermarket wash would leave behind. Ideal as regular upkeep between bigger details, or to smarten a car up before it goes on sale.",
    detailSections: [
      {
        title: "Exterior",
        items: [
          "Wheels rinsed and cleaned with a dedicated wheel cleaner",
          "Arches, tyres and wheel faces agitated with soft brushes",
          "pH-neutral snow foam pre-wash to lift loose grit",
          "Two-bucket contact wash with lamb's wool mitts",
          "Contactless dry with filtered air and plush drying towels",
          "Detail spray for gloss, plus tyre dressing and trim finish",
        ],
      },
      {
        title: "Interior",
        items: [
          "Full vacuum of carpets, mats, seats and boot",
          "All hard surfaces wiped down and dressed",
          "Vents, switchgear and tight areas cleaned with detail brushes",
          "Glass cleaned inside and out for a streak-free finish",
          "Light odour neutralise and interior fragrance",
        ],
      },
    ],
  },
  {
    slug: "gold",
    tier: "Tier Two",
    name: "Gold",
    tagline: "Everything in Silver plus decontamination and a single-stage machine polish for real gloss.",
    price: "From £350",
    duration: "Approx. 6 hours",
    featured: true,
    badgeLabel: "Most Popular",
    includes: [
      "Everything in the Silver package",
      "Iron X and Tardis chemical decontamination",
      "Clay bar treatment across all panels",
      "Single-stage machine polish",
      "Gtechniq C2 Liquid Crystal applied",
      "Interior steam clean and fabric protection",
    ],
    ctaLabel: "Book Gold",
    ctaLink: "/contact",
    longDescription:
      "Gold is where the paint starts to properly transform. On top of everything in the Silver package, we chemically and mechanically decontaminate the paintwork, then machine polish to remove light marring and lift gloss. The finish is sealed with Gtechniq C2 Liquid Crystal for months of protection and strong water beading. This is the package most customers land on.",
    detailSections: [
      {
        title: "Everything in Silver, plus",
        items: [
          "Iron X fallout remover to dissolve bonded iron particles",
          "Tardis tar and glue removal on lower panels and arches",
          "Clay bar treatment to leave the paint glass-smooth",
          "Single-stage machine polish to remove light swirls and haze",
          "Gtechniq C2 Liquid Crystal sealant applied by hand",
        ],
      },
      {
        title: "Interior",
        items: [
          "Seat shampoo and extraction on fabric interiors",
          "Steam clean of trim, vents and tight seams",
          "Leather cleaned and conditioned where fitted",
          "Fabric and carpet protection applied",
        ],
      },
    ],
  },
  {
    slug: "platinum",
    tier: "Tier Three",
    name: "Platinum",
    tagline: "Our ultimate detail — multi-stage paint correction finished with Gtechniq ceramic protection.",
    price: "From £600",
    duration: "1–2 days",
    includes: [
      "Everything in the Gold package",
      "1–5 stage machine polish to remove swirls",
      "Panel wipe to strip all oils and fillers",
      "Gtechniq Crystal Serum Light and Exo coating",
      "Wheel Armour and glass coating",
      "Leather, fabric and dash protection",
    ],
    ctaLabel: "Book Platinum",
    ctaLink: "/contact",
    longDescription:
      "The full works. Platinum is a multi-stage paint correction that removes the swirl marks, holograms and fine scratches that dull a finish in direct sunlight, followed by a nano ceramic coating that locks the result in for years rather than months. Paintwork is panel-wiped before coating so nothing is hidden by polishing oils — what you see is the true corrected finish.",
    detailSections: [
      {
        title: "Paint correction",
        items: [
          "Full decontamination wash, clay and panel prep",
          "Paint depth readings taken before any correction",
          "1–5 stage machine polish depending on condition",
          "Removal of swirl marks, holograms and fine scratches",
          "Panel wipe to strip all oils, fillers and residues",
        ],
      },
      {
        title: "Protection",
        items: [
          "Gtechniq Crystal Serum Light nano ceramic coating",
          "Gtechniq Exo hydrophobic top layer",
          "Wheel Armour applied to wheel faces and barrels",
          "Glass coating for improved wet-weather visibility",
          "Matt Dash, i Leather and i Fabric interior protection",
        ],
      },
    ],
  },
];

/** Slugifies a package name so CMS entries without an explicit slug still route. */
export function packageSlug(pkg: DetailingPackage, index: number): string {
  if (pkg.slug) return pkg.slug;
  const fromName = (pkg.name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return fromName || `package-${index + 1}`;
}

/** Finds a package by slug, tolerating entries whose slug is derived from the name. */
export function findPackageBySlug(
  packages: DetailingPackage[],
  slug: string,
): DetailingPackage | undefined {
  return packages.find((pkg, i) => packageSlug(pkg, i) === slug);
}

/** True when a package has enough content to justify a "Read More" page. */
export function hasPackageDetail(pkg: DetailingPackage): boolean {
  return Boolean(pkg.longDescription || pkg.detailSections?.length);
}

/** The enquiry type a package booking belongs under. Must match the contact form + API enum. */
export const DETAILING_ENQUIRY_TYPE = "Detailing";

const CONTACT_PATH = "/contact";

/**
 * Destination for a package's "Book this" CTA.
 *
 * When the CTA points at the contact page — the default for every tier — the
 * tier is carried through as query params so the form arrives with Detailing
 * selected and the right package highlighted. Any other destination is returned
 * untouched, so an editor who repoints a tier at an external booking system or a
 * different page doesn't get our query string stapled onto it.
 */
export function packageContactHref(
  pkg: DetailingPackage,
  index: number,
  fallbackHref?: string,
): string {
  const href = (pkg.ctaLink ?? fallbackHref ?? CONTACT_PATH).trim() || CONTACT_PATH;

  // Split off hash then query so an editor's own params/anchor survive.
  const hashAt = href.indexOf("#");
  const hash = hashAt === -1 ? "" : href.slice(hashAt);
  const withoutHash = hashAt === -1 ? href : href.slice(0, hashAt);
  const queryAt = withoutHash.indexOf("?");
  const path = queryAt === -1 ? withoutHash : withoutHash.slice(0, queryAt);

  if (path !== CONTACT_PATH) return href;

  const params = new URLSearchParams(queryAt === -1 ? "" : withoutHash.slice(queryAt + 1));
  params.set("type", DETAILING_ENQUIRY_TYPE);
  params.set("package", packageSlug(pkg, index));
  return `${path}?${params.toString()}${hash}`;
}

/** The slice of a package the contact form's picker needs. */
export type DetailingPackageOption = {
  name: string;
  slug: string;
  price?: string;
};

/**
 * Reduces packages to picker options, dropping any tier an editor has started
 * but not yet named — an unnamed chip would be unlabelled and unselectable.
 */
export function toPackageOptions(packages: DetailingPackage[]): DetailingPackageOption[] {
  return packages
    .map((pkg, i) => ({
      name: (pkg.name ?? "").trim(),
      slug: packageSlug(pkg, i),
      price: pkg.price,
    }))
    .filter((option) => Boolean(option.name && option.slug));
}
