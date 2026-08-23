import { defineQuery } from "next-sanity";

const carProjection = /* groq */ `
  _id,
  _type,
  "slug": slug.current,
  make,
  model,
  variant,
  year,
  price,
  mileage,
  transmission,
  fuel,
  bodyType,
  category,
  engine,
  power,
  colour,
  description,
  "highlights": coalesce(highlights, []),
  "images": coalesce(images[].asset->url, []),
  "videos": coalesce(videos[] {
    title,
    "videoFile": videoFile.asset->url,
    videoUrl,
  }, []),
  "legacyVideoFile": video.asset->url,
  "legacyVideoUrl": videoUrl,
  featured,
  status,
  soldDate
`;

const merchProductProjection = /* groq */ `
  _id,
  title,
  category,
  description,
  priceLabel,
  tiktokShopUrl,
  status,
  "image": image.asset->url
`;

// The inventory page only lists cars that are still on the books. Sold cars move
// to their own showcase (`soldCarsQuery`) rather than lingering in stock.
export const availableCarsQuery = defineQuery(`
  *[_type == "car" && status != "sold"] | order(year desc, _createdAt desc) {
    ${carProjection}
  }
`);

// Newest sale first. `soldDate` is set automatically when a car is marked sold,
// but cars sold before that field existed (or hand-edited ones) can be missing
// it — fall back to when the document last changed so they still sort sensibly.
export const soldCarsQuery = defineQuery(`
  *[_type == "car" && status == "sold" && hideFromSoldPage != true]
    | order(coalesce(soldDate, _updatedAt) desc, year desc) {
    ${carProjection}
  }
`);

export const featuredCarsQuery = defineQuery(`
  *[_type == "car" && featured == true && status != "sold"] | order(year desc) {
    ${carProjection}
  }
`);

export const carBySlugQuery = defineQuery(`
  *[_type == "car" && slug.current == $slug][0] {
    ${carProjection}
  }
`);

export const allCarSlugsQuery = defineQuery(`
  *[_type == "car" && defined(slug.current)].slug.current
`);

// Singletons are fetched by their fixed document id rather than `_type[0]`.
// `[_type == "x"][0]` is non-deterministic if a stray duplicate of the type
// ever exists (e.g. an accidental second draft), which can make Presentation
// or the site resolve to the wrong/empty document. The id-based query always
// targets the one canonical singleton (the drafts perspective overlays the
// draft onto this same id).
export const siteSettingsQuery = defineQuery(`*[_id == "siteSettings"][0]`);

// The homepage curates its own Featured Cars and Merch via reference lists.
// Resolve those references inline so the page gets full car/product objects
// (in the editor-chosen order). Both fall back at render time: an empty
// `featuredCars` uses the per-car `featured` flag, and an empty `homepageMerch`
// shows all visible products.
export const homePageQuery = defineQuery(`*[_id == "homePage"][0]{
  ...,
  "featuredCars": coalesce(featuredCars[@->status != "sold"]->{
    ${carProjection}
  }, []),
  "homepageMerch": coalesce(homepageMerch[@->status != "hidden"]->{
    ${merchProductProjection}
  }, []),
  comingSoonCard {
    show,
    eyebrow,
    heading,
    subtext,
    priceLabel,
    mileageLabel,
    "image": image.asset->url
  }
}`);

export const servicesPageQuery = defineQuery(`*[_id == "servicesPage"][0]`);

export const whoWeArePageQuery = defineQuery(`*[_id == "whoWeArePage"][0]`);

export const curatedSalesPageQuery = defineQuery(`*[_id == "curatedSalesPage"][0]`);

export const bespokeSourcingPageQuery = defineQuery(`*[_id == "bespokeSourcingPage"][0]`);

export const storagePageQuery = defineQuery(`*[_id == "storagePage"][0]`);

export const contactPageQuery = defineQuery(`*[_id == "contactPage"][0]`);

export const inventoryPageQuery = defineQuery(`*[_id == "inventoryPage"][0]`);

export const soldPageQuery = defineQuery(`*[_id == "soldPage"][0]`);

// The merch page can curate its own product grid via a reference list. Resolve
// those references inline so the page gets full product objects (an empty list
// falls back to every visible product at render time).
export const merchPageQuery = defineQuery(`*[_id == "merchPage"][0]{
  ...,
  "products": coalesce(products[@->status != "hidden"]->{
    ${merchProductProjection}
  }, [])
}`);

const detailingPackageProjection = /* groq */ `
  name,
  "slug": slug.current,
  tier,
  tagline,
  price,
  priceNote,
  duration,
  "includes": coalesce(includes, []),
  featured,
  badgeLabel,
  ctaLabel,
  ctaLink,
  longDescription,
  "detailSections": coalesce(detailSections[] {
    title,
    "items": coalesce(items, []),
  }, []),
  "image": image.asset->url
`;

export const detailingPageQuery = defineQuery(`*[_id == "detailingPage"][0] {
  ...,
  "packages": coalesce(packages[] {
    ${detailingPackageProjection}
  }, []),
  "beforeAfterGallery": coalesce(beforeAfterGallery[] {
    label,
    serviceTag,
    "beforeImage": beforeImage.asset->url,
    "beforeVideo": beforeVideo.asset->url,
    "afterImage": afterImage.asset->url,
    "afterVideo": afterVideo.asset->url,
  }, []),
  "gallery": coalesce(gallery[] {
    caption,
    serviceTag,
    "image": image.asset->url,
  }, []),
  "videos": coalesce(videos[] {
    title,
    caption,
    orientation,
    "videoFile": videoFile.asset->url,
    videoUrl,
  }, []),
  "socialFeed": coalesce(socialFeed[] {
    platform,
    caption,
    postUrl,
    "image": image.asset->url,
    "videoFile": videoFile.asset->url,
  }, [])
}`);

// Package detail pages read only the slice of the detailing page they need:
// the matching package plus the shared booking CTA copy.
export const detailingPackageBySlugQuery = defineQuery(`*[_id == "detailingPage"][0] {
  "package": packages[slug.current == $slug][0] {
    ${detailingPackageProjection}
  },
  ctaHeading,
  ctaBody,
  ctaLabel,
  ctaLink,
  partnerNote
}`);

export const detailingPackageSlugsQuery = defineQuery(`
  *[_id == "detailingPage"][0].packages[defined(slug.current)].slug.current
`);

// The contact form only needs enough to label and identify each tier in its
// package picker, so it skips the heavy projection above.
export const detailingPackageOptionsQuery = defineQuery(`
  coalesce(*[_id == "detailingPage"][0].packages[] {
    name,
    "slug": slug.current,
    price
  }, [])
`);

export const merchProductsQuery = defineQuery(`
  *[_type == "merchProduct" && status != "hidden"] | order(coalesce(sortOrder, 100) asc, _createdAt desc) {
    ${merchProductProjection}
  }
`);
