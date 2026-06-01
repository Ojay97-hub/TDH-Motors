import { defineQuery } from "next-sanity";

const carProjection = /* groq */ `
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
  highlights,
  "images": images[].asset->url,
  "videos": videos[] {
    title,
    "videoFile": videoFile.asset->url,
    videoUrl,
  },
  "legacyVideoFile": video.asset->url,
  "legacyVideoUrl": videoUrl,
  featured,
  status
`;

const merchProductProjection = /* groq */ `
  _id,
  title,
  description,
  priceLabel,
  tiktokShopUrl,
  status,
  "image": image.asset->url
`;

export const allCarsQuery = defineQuery(`
  *[_type == "car"] | order(year desc, _createdAt desc) {
    ${carProjection}
  }
`);

export const featuredCarsQuery = defineQuery(`
  *[_type == "car" && featured == true] | order(year desc) {
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
  "featuredCars": featuredCars[]->{
    ${carProjection}
  },
  "homepageMerch": homepageMerch[]->{
    ${merchProductProjection}
  },
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

// The merch page can curate its own product grid via a reference list. Resolve
// those references inline so the page gets full product objects (an empty list
// falls back to every visible product at render time).
export const merchPageQuery = defineQuery(`*[_id == "merchPage"][0]{
  ...,
  "products": products[]->{
    ${merchProductProjection}
  }
}`);

export const detailingPageQuery = defineQuery(`*[_id == "detailingPage"][0] {
  ...,
  "beforeAfterGallery": beforeAfterGallery[] {
    label,
    serviceTag,
    "beforeImage": beforeImage.asset->url,
    "beforeVideo": beforeVideo.asset->url,
    "afterImage": afterImage.asset->url,
    "afterVideo": afterVideo.asset->url,
  },
  "gallery": gallery[] {
    caption,
    serviceTag,
    "image": image.asset->url,
  },
  "videos": videos[] {
    title,
    caption,
    orientation,
    "videoFile": videoFile.asset->url,
    videoUrl,
  }
}`);

export const merchProductsQuery = defineQuery(`
  *[_type == "merchProduct" && status != "hidden"] | order(coalesce(sortOrder, 100) asc, _createdAt desc) {
    ${merchProductProjection}
  }
`);
